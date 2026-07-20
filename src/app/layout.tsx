import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "디원뉴스";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grace-news.vercel.app";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const NAVER_VERIFICATION = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 기독교 뉴스 3분 큐레이션`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "여러 기독교 언론사의 소식을 한 곳에 모아 AI가 3줄로 요약해드립니다. 선교, 교회, 봉사, 문화 소식을 매일 빠르게 확인하세요.",
  keywords: ["기독교 뉴스", "교계 소식", "크리스천 뉴스", "선교", "교회 소식", "성경 말씀"],
  verification: {
    google: GOOGLE_VERIFICATION || undefined,
    other: NAVER_VERIFICATION ? { "naver-site-verification": NAVER_VERIFICATION } : undefined,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 기독교 뉴스 3분 큐레이션`,
    description: "여러 기독교 언론사의 소식을 한 곳에 모아 AI가 3줄로 요약해드립니다.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - 기독교 뉴스 3분 큐레이션`,
    description: "여러 기독교 언론사의 소식을 한 곳에 모아 AI가 3줄로 요약해드립니다.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <Footer />
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
