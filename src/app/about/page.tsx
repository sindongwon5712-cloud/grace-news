import type { Metadata } from "next";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "은혜뉴스";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE_NAME} 서비스 소개`,
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink">{SITE_NAME} 소개</h1>
      <p className="mt-4 leading-relaxed text-ink/80">
        {SITE_NAME}는 여러 기독교 언론사의 소식을 한 곳에 모아 핵심만 3줄로 요약해
        전해드리는 뉴스 큐레이션 서비스입니다. 매번 여러 사이트를 돌아다니며 교계 소식을
        찾아야 했던 불편함을 해소하고, 바쁜 일상 속에서도 짧은 시간에 오늘의 소식과
        관련 성경 말씀을 함께 만나실 수 있도록 만들었습니다.
      </p>
      <p className="mt-4 leading-relaxed text-ink/80">
        모든 기사는 제목과 3줄 요약, 원문 링크로만 제공되며, 전문(全文)은 제공하지
        않습니다. 더 자세한 내용이 궁금하시다면 원문 링크를 통해 발행처의 기사를
        직접 확인해 주세요.
      </p>
    </div>
  );
}
