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
      <section className="bg-grid-fade relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 sm:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          실시간 자동 업데이트
        </span>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-4xl">
          매일 아침, 교계 소식을{" "}
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            3줄로
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
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
