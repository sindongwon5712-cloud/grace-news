import type { Metadata } from "next";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "디원뉴스";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE_NAME} 개인정보처리방침 및 쿠키 정책`,
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl text-ink/80">
      <h1 className="text-2xl font-extrabold text-ink">개인정보처리방침</h1>
      <p className="mt-4 text-sm text-ink/50">시행일: 2026년 1월 1일</p>

      <h2 className="mt-6 text-lg font-bold text-ink">1. 수집하는 개인정보 항목</h2>
      <p>
        {SITE_NAME}는 별도의 회원가입 절차 없이 이용 가능하며, 이용자가 직접 입력하는
        개인정보(예: 문의 시 이메일 주소)를 제외하고는 개인을 식별할 수 있는 정보를
        수집하지 않습니다.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">2. 쿠키 및 광고 서비스</h2>
      <p>
        본 사이트는 제3자 광고 서비스(Google AdSense)를 이용하며, Google을 포함한 제3자
        공급업체는 쿠키를 사용하여 이용자가 본 사이트 및 다른 사이트를 방문한 이력을
        기반으로 광고를 게재할 수 있습니다. Google의 광고 쿠키 사용에 대해서는{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline"
        >
          Google 광고 정책 페이지
        </a>
        에서 자세히 확인하실 수 있으며, Google 광고 설정 페이지에서 맞춤 광고를 원치
        않을 경우 이를 비활성화할 수 있습니다.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">3. 저작권 안내</h2>
      <p>
        본 사이트에서 제공하는 뉴스 콘텐츠는 각 기사의 제목과 3줄 요약만을 담고 있으며,
        전체 저작권은 원문을 발행한 언론사 및 저작권자에게 있습니다. 원문 전체가
        궁금하신 경우 제공된 링크를 통해 발행처 사이트에서 확인해 주세요.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">4. 문의</h2>
      <p>
        개인정보처리방침에 대한 문의사항은 <a href="/contact" className="text-brand-600 underline">문의 페이지</a>를
        통해 연락해 주시기 바랍니다.
      </p>
    </div>
  );
}
