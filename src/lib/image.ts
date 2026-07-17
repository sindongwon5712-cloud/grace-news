import { NewsCategory } from "@/types/news";

const CATEGORY_THEME: Record<
  NewsCategory,
  { from: string; to: string; label: string; icon: string }
> = {
  선교: { from: "#c67f2a", to: "#824c1c", label: "선교", icon: "🌍" },
  교회: { from: "#8a6d3b", to: "#4f3c1f", label: "교회", icon: "⛪" },
  봉사: { from: "#b98a3f", to: "#6b4a1e", label: "봉사", icon: "🤝" },
  문화: { from: "#a5631f", to: "#59341b", label: "문화", icon: "🎵" },
  사회: { from: "#8f7355", to: "#4a3823", label: "사회", icon: "📰" },
  칼럼: { from: "#9c7a4a", to: "#54401f", label: "칼럼", icon: "✍️" },
};

/**
 * 저작권 걱정 없는 카테고리별 기본 이미지를 SVG(Data URI)로 즉석 생성합니다.
 * 외부 이미지 서비스(Unsplash 등)에 의존하지 않으므로 배포 후 깨질 위험이 없습니다.
 */
export function getFallbackImage(category: NewsCategory): string {
  const theme = CATEGORY_THEME[category] ?? CATEGORY_THEME["교회"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.from}"/>
        <stop offset="100%" stop-color="${theme.to}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#g)"/>
    <text x="50%" y="45%" font-size="90" text-anchor="middle" dominant-baseline="middle">${theme.icon}</text>
    <text x="50%" y="68%" font-size="34" font-family="sans-serif" font-weight="600" fill="#fdf8f0" text-anchor="middle" dominant-baseline="middle">${theme.label} 소식</text>
  </svg>`;
  const encoded = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
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
