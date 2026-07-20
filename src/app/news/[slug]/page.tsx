import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/news";
import { REVALIDATE_SECONDS } from "@/lib/feeds";
import AdSlot from "@/components/AdSlot";
import BibleVerseCard from "@/components/BibleVerseCard";

export const revalidate = REVALIDATE_SECONDS;
export const dynamicParams = true;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  // 빌드 시점에는 최신 30개만 정적 생성하고, 나머지는 방문 시 ISR로 생성됩니다.
  return articles.slice(0, 30).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "기사를 찾을 수 없습니다" };

  const description = article.summary.join(" ");

  return {
    title: article.title,
    description,
    openGraph: {
      type: "article",
      title: article.title,
      description,
      images: [{ url: article.imageUrl }],
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
    alternates: {
      canonical: `/news/${article.slug}`,
    },
  };
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function NewsDetailPage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    image: [article.imageUrl],
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME || "디원뉴스",
    },
    description: article.summary.join(" "),
  };

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          {article.category}
        </span>
        <h1 className="mt-3 text-2xl font-extrabold leading-snug text-ink sm:text-3xl">
          {article.title}
        </h1>
        <div className="mt-2 flex gap-3 text-sm text-ink/50">
          <span>{article.sourceName}</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.imageUrl} alt={article.title} className="w-full object-cover" />
      </div>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE} label="본문 상단 광고" />

      <ul className="flex flex-col gap-3 rounded-xl bg-white p-5 text-[15px] leading-relaxed text-ink shadow-sm">
        {article.summary.map((line, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="font-bold text-brand-500">{idx + 1}.</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <BibleVerseCard verse={article.verse} />

      <Link
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-brand-700"
      >
        원본 기사 보러가기 →
      </Link>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} label="하단 광고" />
    </article>
  );
}
