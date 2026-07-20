import { createHash } from "crypto";
import { cache } from "react";
import { NewsArticle, NewsCategory } from "@/types/news";
import { FEEDS } from "./feeds";
import { fetchAllFeeds, RssItem } from "./rss";
import { extractImageFromItem, getFallbackImage } from "./image";
import { pickVerse } from "./bibleVerses";
import { summarizeToThreeLines, stripHtml } from "./summarize";
import { getSampleArticles } from "./sampleNews";

function slugFromLink(link: string): string {
  return createHash("md5").update(link).digest("hex").slice(0, 12);
}

function toIsoDate(pubDate?: string): string {
  if (!pubDate) return new Date().toISOString();
  const parsed = new Date(pubDate);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

async function mapItemToArticle(item: RssItem): Promise<NewsArticle | null> {
  if (!item.link || !item.title) return null;

  const slug = slugFromLink(item.link);
  const rawContent =
    item["content:encoded"] || item.content || item.contentSnippet || "";
  const title = stripHtml(item.title) || item.title.trim();
  const summary = await summarizeToThreeLines(title, rawContent);
  const extractedImage = extractImageFromItem(item);
  const category = item.source.category;

  return {
    slug,
    title,
    summary,
    sourceName: item.source.name.replace(/^구글 뉴스 - /, "") || "출처 미상",
    sourceUrl: item.link,
    imageUrl: extractedImage || getFallbackImage(category, slug),
    category,
    publishedAt: toIsoDate(item.pubDate),
    verse: pickVerse(category, slug),
  };
}

function dedupeBySlug(articles: NewsArticle[]): NewsArticle[] {
  const map = new Map<string, NewsArticle>();
  for (const article of articles) {
    if (!map.has(article.slug)) map.set(article.slug, article);
  }
  return [...map.values()];
}

/**
 * 전체 기사 목록을 가져옵니다. React `cache()`로 감싸 동일 렌더 사이클(같은 요청) 내
 * 여러 페이지/메타데이터 함수에서 중복 호출되어도 한 번만 실제로 수집합니다.
 */
export const getAllArticles = cache(async (): Promise<NewsArticle[]> => {
  const items = await fetchAllFeeds(FEEDS);
  const mapped = await Promise.all(items.map(mapItemToArticle));
  const rssArticles = mapped.filter((a): a is NewsArticle => a !== null);

  const sample = getSampleArticles();
  const combined = dedupeBySlug([...rssArticles, ...sample]);

  return combined.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
});

export async function getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  const all = await getAllArticles();
  return all.find((a) => a.slug === slug);
}

export async function getArticlesByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.category === category);
}

export const ALL_CATEGORIES: NewsCategory[] = [
  "선교",
  "교회",
  "봉사",
  "문화",
  "사회",
  "칼럼",
];
