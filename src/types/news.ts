export type NewsCategory =
  | "선교"
  | "교회"
  | "봉사"
  | "문화"
  | "사회"
  | "칼럼";

export const ALL_CATEGORIES: NewsCategory[] = [
  "선교",
  "교회",
  "봉사",
  "문화",
  "사회",
  "칼럼",
];

export interface BibleVerse {
  reference: string;
  text: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  summary: string[]; // 3줄 요약 (배열의 각 항목이 한 줄)
  sourceName: string;
  sourceUrl: string;
  imageUrl: string;
  category: NewsCategory;
  publishedAt: string; // ISO string
  verse: BibleVerse;
}
