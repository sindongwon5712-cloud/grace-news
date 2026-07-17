import type { MetadataRoute } from "next";
import { ALL_CATEGORIES, getAllArticles } from "@/lib/news";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grace-news.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.2 },
    ...ALL_CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(cat)}`,
      changeFrequency: "hourly" as const,
      priority: 0.6,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
