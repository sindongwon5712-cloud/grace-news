import { NewsCategory } from "@/types/news";

export interface FeedConfig {
  name: string;
  url: string;
  category: NewsCategory;
}

/**
 * 기본 피드 목록.
 *
 * 구글 뉴스 RSS(키워드 검색)는 URL 구조가 안정적으로 문서화되어 있어
 * 별도 API 키 없이 바로 동작하는 기본값으로 사용합니다.
 * https://news.google.com/rss/search?q=검색어&hl=ko&gl=KR&ceid=KR:ko
 *
 * 특정 언론사(크리스천투데이, 국민일보 미션라이프, 뉴스앤조이, 기독신문 등)의
 * 자체 RSS 주소를 알고 있다면 아래 배열에 { name, url, category } 형태로
 * 추가/교체하세요. 각 언론사 사이트 하단의 'RSS' 링크에서 정확한 주소를
 * 확인한 뒤 넣는 것을 권장합니다 (언론사마다 주소 형식이 다르고 수시로 바뀔 수 있음).
 */
export const FEEDS: FeedConfig[] = [
  {
    name: "구글 뉴스 - 기독교",
    url: "https://news.google.com/rss/search?q=%EA%B8%B0%EB%8F%85%EA%B5%90&hl=ko&gl=KR&ceid=KR:ko",
    category: "교회",
  },
  {
    name: "구글 뉴스 - 교회",
    url: "https://news.google.com/rss/search?q=%EA%B5%90%ED%9A%8C&hl=ko&gl=KR&ceid=KR:ko",
    category: "교회",
  },
  {
    name: "구글 뉴스 - 선교",
    url: "https://news.google.com/rss/search?q=%EC%84%A0%EA%B5%90&hl=ko&gl=KR&ceid=KR:ko",
    category: "선교",
  },
  {
    name: "구글 뉴스 - 봉사",
    url: "https://news.google.com/rss/search?q=%EA%B5%90%ED%9A%8C%20%EB%B4%89%EC%82%AC&hl=ko&gl=KR&ceid=KR:ko",
    category: "봉사",
  },
  {
    name: "구글 뉴스 - 크리스천 문화",
    url: "https://news.google.com/rss/search?q=%ED%81%AC%EB%A6%AC%EC%8A%A4%EC%B2%9C%20%EB%AC%B8%ED%99%94&hl=ko&gl=KR&ceid=KR:ko",
    category: "문화",
  },
];

export const REVALIDATE_SECONDS = 60 * 30; // 30분마다 재수집 (ISR)
