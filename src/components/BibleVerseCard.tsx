import { BibleVerse } from "@/types/news";

export default function BibleVerseCard({ verse }: { verse: BibleVerse }) {
  return (
    <blockquote className="relative overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/60 px-6 py-5 text-ink">
      <span className="absolute -left-1 -top-3 select-none font-serif text-6xl text-brand-200" aria-hidden>
        &ldquo;
      </span>
      <p className="relative text-[15px] leading-relaxed">{verse.text}</p>
      <cite className="relative mt-3 block text-sm font-semibold not-italic text-brand-700">
        — {verse.reference}
      </cite>
    </blockquote>
  );
}
