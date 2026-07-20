import Link from "next/link";
import { NewsArticle } from "@/types/news";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-2 text-base font-bold leading-snug text-ink transition group-hover:text-brand-600">
          {article.title}
        </h2>
        <p className="line-clamp-2 text-sm text-slate-500">{article.summary[0]}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-slate-400">
          <span className="font-medium text-slate-500">{article.sourceName}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>
      </div>
    </Link>
  );
}
