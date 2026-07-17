import { Fragment } from "react";
import { getAllArticles } from "@/lib/news";
import { REVALIDATE_SECONDS } from "@/lib/feeds";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";

export const revalidate = REVALIDATE_SECONDS;

const INLINE_AD_AFTER = 6;

export default async function HomePage() {
  const articles = await getAllArticles();

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-10 text-white">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          매일 아침, 교계 소식을 3줄로
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-50/90 sm:text-base">
          여러 기독교 언론사를 일일이 돌아다닐 필요 없이, 오늘의 선교·교회·봉사·문화 소식을
          한눈에 모아 핵심만 확인하세요. 관련 성경 말씀도 함께 전해드립니다.
        </p>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} label="상단 광고" />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, idx) => (
          <Fragment key={article.slug}>
            <NewsCard article={article} />
            {idx > 0 && (idx + 1) % INLINE_AD_AFTER === 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <AdSlot
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE}
                  label="본문 중간 광고"
                />
              </div>
            )}
          </Fragment>
        ))}
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} label="하단 광고" />
    </div>
  );
}
