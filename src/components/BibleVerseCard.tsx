import { BibleVerse } from "@/types/news";

export default function BibleVerseCard({ verse }: { verse: BibleVerse }) {
  return (
    <blockquote className="rounded-xl border-l-4 border-brand-400 bg-brand-50 px-5 py-4 text-ink">
      <p className="text-[15px] leading-relaxed">&ldquo;{verse.text}&rdquo;</p>
      <cite className="mt-2 block text-sm font-semibold not-italic text-brand-600">
        — {verse.reference}
      </cite>
    </blockquote>
  );
}
