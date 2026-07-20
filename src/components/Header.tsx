"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ALL_CATEGORIES } from "@/types/news";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "디원뉴스";

function LogoMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-extrabold text-white shadow-card">
      D
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();

  const isActive = (cat: string) => pathname === `/category/${encodeURIComponent(cat)}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-extrabold tracking-tight text-ink">{SITE_NAME}</span>
        </Link>
        <nav className="hidden gap-1 text-sm font-medium text-slate-500 sm:flex">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURIComponent(cat)}`}
              className={`rounded-full px-3 py-1.5 transition ${
                isActive(cat)
                  ? "bg-brand-50 text-brand-700"
                  : "hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3 text-sm font-medium text-slate-500 sm:hidden">
        {ALL_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/category/${encodeURIComponent(cat)}`}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
              isActive(cat) ? "bg-brand-50 text-brand-700" : "bg-slate-100 hover:text-ink"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  );
}
