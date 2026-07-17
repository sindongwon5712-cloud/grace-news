import Parser from "rss-parser";
import { FeedConfig, REVALIDATE_SECONDS } from "./feeds";

export interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  "content:encoded"?: string;
  enclosure?: { url?: string };
  "media:content"?: unknown;
  "media:thumbnail"?: { $?: { url?: string } };
  source: FeedConfig;
}

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      "content:encoded",
    ],
  },
});

/**
 * Next.js의 fetch 데이터 캐시(next.revalidate)를 사용해 RSS XML을 가져온 뒤
 * rss-parser로 파싱합니다. rss-parser 자체 HTTP 클라이언트 대신 fetch를 직접
 * 써야 App Router의 ISR 캐시/재검증 주기가 정확히 적용됩니다.
 */
export async function fetchFeedItems(feed: FeedConfig): Promise<RssItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GraceNewsBot/1.0)",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const parsed = await parser.parseString(xml);

    return (parsed.items || []).map((item) => ({
      ...item,
      source: feed,
    })) as RssItem[];
  } catch (err) {
    console.error(`[rss] ${feed.name} 피드를 불러오지 못했습니다.`, err);
    return [];
  }
}

export async function fetchAllFeeds(feeds: FeedConfig[]): Promise<RssItem[]> {
  const results = await Promise.allSettled(feeds.map(fetchFeedItems));
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
