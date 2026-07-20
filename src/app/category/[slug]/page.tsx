import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_CATEGORIES, getArticlesByCategory } from "@/lib/news";
import { REVALIDATE_SECONDS } from "@/lib/feeds";
import { NewsCategory } from "@/types/news";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";

export const revalidate = REVALIDATE_SECONDS;

interface PageProps {
  params: { slug: string };
}

function toCategory(slug: string): NewsCategory | undefined {
  const decoded = decodeURIComponent(slug);
  return ALL_CATEGORIES.find((c) => c === decoded);
}

export function generateStaticParams() {
  return ALL_CATEGORIES.map((cat) => ({ slug: cat }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = toCategory(params.slug);
  if (!category) return { title: "카테고리를 찾을 수 없습니다" };

  return {
    title: `${category} 소식 모아보기`,
    description: `${category} 관련 기독교 뉴스를 3줄 요약으로 모아봅니다.`,
    alternates: { canonical: `/category/${encodeURIComponent(category)}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = toCategory(params.slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(category);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          카테고리
        </span>
        <h1 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">{category} 소식</h1>
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} label="상단 광고" />

      {articles.length === 0 ? (
        <p className="text-slate-500">아직 등록된 {category} 소식이 없습니다.</p>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </section>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} label="하단 광고" />
    </div>
  );
}
