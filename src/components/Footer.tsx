import Link from "next/link";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "디원뉴스";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl leading-relaxed">
          © {new Date().getFullYear()} {SITE_NAME}. 각 기사의 저작권은 원문 발행처에 있으며,
          본 사이트는 제목과 3줄 요약만 제공하고 원문 링크로 연결합니다.
        </p>
        <div className="flex gap-5 font-medium">
          <Link href="/about" className="transition hover:text-brand-600">
            소개
          </Link>
          <Link href="/privacy" className="transition hover:text-brand-600">
            개인정보처리방침
          </Link>
          <Link href="/contact" className="transition hover:text-brand-600">
            문의
          </Link>
        </div>
      </div>
    </footer>
  );
}
