import Link from "next/link";
import { ALL_CATEGORIES } from "@/lib/news";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "은혜뉴스";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-brand-600">
            ✝ {SITE_NAME}
          </span>
        </Link>
        <nav className="hidden gap-4 text-sm font-medium text-ink/70 sm:flex">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURIComponent(cat)}`}
              className="transition hover:text-brand-600"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-5xl gap-4 overflow-x-auto px-4 pb-2 text-sm font-medium text-ink/70 sm:hidden">
        {ALL_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/category/${encodeURIComponent(cat)}`}
            className="whitespace-nowrap transition hover:text-brand-600"
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  );
}
