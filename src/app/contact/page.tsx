import type { Metadata } from "next";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "은혜뉴스";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com";

export const metadata: Metadata = {
  title: "문의하기",
  description: `${SITE_NAME}에 문의하기`,
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl text-ink/80">
      <h1 className="text-2xl font-extrabold text-ink">문의하기</h1>
      <p className="mt-4 leading-relaxed">
        기사 삭제 요청, 저작권 관련 문의, 서비스 오류 제보 등은 아래 이메일로
        연락해 주세요. 최대한 빠르게 답변드리겠습니다.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-700"
      >
        {CONTACT_EMAIL}
      </a>
      <p className="mt-4 text-sm text-ink/50">
        * 사이트 운영자는 .env 파일의 NEXT_PUBLIC_CONTACT_EMAIL 값을 실제 연락 가능한
        이메일 주소로 변경해 주세요.
      </p>
    </div>
  );
}
