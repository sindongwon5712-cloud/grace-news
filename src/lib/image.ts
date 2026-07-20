import { NewsCategory } from "@/types/news";
import { REVALIDATE_SECONDS } from "./feeds";

/**
 * 카테고리별로 실제 주제와 연관된 사진을 검색해서 보여주기 위한 영어 키워드.
 * LoremFlickr는 Flickr의 실제 사진을 태그로 검색해 제공하므로, 한글 카테고리명 대신
 * 검색이 잘 되는 영어 키워드를 매핑해 둡니다.
 */
const CATEGORY_KEYWORDS: Record<NewsCategory, string> = {
  선교: "missionary,christian",
  교회: "church,cathedral",
  봉사: "volunteer,charity",
  문화: "worship,music",
  사회: "community,people",
  칼럼: "bible,book",
};

function hashToInt(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * 원본 기사에서 썸네일을 추출하지 못했을 때 쓰는 기본 이미지.
 * LoremFlickr(loremflickr.com)는 API 키 없이 카테고리 키워드로 실제 Flickr 사진을
 * 가져올 수 있는 무료 서비스입니다. `lock` 파라미터에 slug 기반 고정값을 넣어
 * 같은 기사에는 항상 같은 사진이 매핑되도록(새로고침해도 안 바뀌도록) 합니다.
 */
export function getFallbackImage(category: NewsCategory, seed: string): string {
  const keywords = CATEGORY_KEYWORDS[category] ?? CATEGORY_KEYWORDS["교회"];
  const lock = hashToInt(`${category}-${seed}`);
  return `https://loremflickr.com/800/450/${keywords}?lock=${lock}`;
}

function extractMetaContent(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export interface ScrapedArticleImage {
  url: string;
  caption?: string;
}

/**
 * 원본 기사 페이지에 직접 접속해 실제 사진(og:image)과, 있다면 사진 설명(figcaption)을
 * 함께 가져옵니다. RSS에 이미지가 없는 경우(구글 뉴스 등 대부분)에만 호출되는
 * 보조 수단이며, 실패하거나 시간이 오래 걸리면 조용히 undefined를 반환해
 * 카테고리 연관 자료사진으로 자연스럽게 대체됩니다.
 */
export async function fetchArticleOgImage(
  articleUrl: string
): Promise<ScrapedArticleImage | undefined> {
  try {
    const res = await fetch(articleUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DwonNewsBot/1.0)" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return undefined;

    const html = await res.text();
    const imageUrl = extractMetaContent(html, "og:image") || extractMetaContent(html, "twitter:image");
    if (!imageUrl) return undefined;

    const figcaptionMatch = html.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const rawCaption = figcaptionMatch?.[1]
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const caption =
      rawCaption && rawCaption.length > 3 && rawCaption.length < 120
        ? decodeHtmlEntities(rawCaption)
        : undefined;

    return { url: imageUrl, caption };
  } catch {
    return undefined;
  }
}

interface RawRssItem {
  enclosure?: { url?: string };
  "media:content"?: unknown;
  "media:thumbnail"?: unknown;
  content?: string;
  "content:encoded"?: string;
  contentSnippet?: string;
}

function firstImgSrc(html?: string): string | undefined {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

/** rss-parser가 만들어주는 media:content/media:thumbnail 노드 형태(단일 객체 또는 배열)에서 url을 안전하게 뽑아냅니다. */
function getUrlFromMediaNode(node: unknown): string | undefined {
  if (!node) return undefined;
  if (Array.isArray(node)) {
    for (const child of node) {
      const url = getUrlFromMediaNode(child);
      if (url) return url;
    }
    return undefined;
  }
  if (typeof node === "object" && node !== null && "$" in node) {
    const dollar = (node as { $?: { url?: string } }).$;
    if (dollar?.url) return dollar.url;
  }
  return undefined;
}

/** RSS 아이템에서 썸네일 이미지 URL을 최대한 추출합니다. 없으면 undefined. */
export function extractImageFromItem(item: RawRssItem): string | undefined {
  if (item.enclosure?.url) return item.enclosure.url;

  const fromMediaContent = getUrlFromMediaNode(item["media:content"]);
  if (fromMediaContent) return fromMediaContent;

  const fromThumbnail = getUrlFromMediaNode(item["media:thumbnail"]);
  if (fromThumbnail) return fromThumbnail;

  return firstImgSrc(item["content:encoded"]) || firstImgSrc(item.content);
}
