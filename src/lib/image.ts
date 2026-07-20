import { NewsCategory } from "@/types/news";

/**
 * 원본 기사에서 썸네일을 추출하지 못했을 때 쓰는 기본 이미지.
 * Picsum Photos(picsum.photos)는 API 키 없이 실제 사진을 seed 기반으로 안정적으로
 * 제공하는 무료 서비스로, 같은 seed(카테고리+slug)에는 항상 같은 사진이 매핑되어
 * 새로고침해도 이미지가 바뀌지 않습니다. 카테고리별 주제(교회/선교 등)에 정확히
 * 맞는 사진은 아니지만, 실제 사진이 필요하다는 요구에 맞춰 아이콘 대신 사용합니다.
 */
export function getFallbackImage(category: NewsCategory, seed: string): string {
  const key = encodeURIComponent(`${category}-${seed}`);
  return `https://picsum.photos/seed/${key}/800/450`;
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
