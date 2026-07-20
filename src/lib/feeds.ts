import { NewsCategory } from "@/types/news";

export interface FeedConfig {
  name: string;
  url: string;
  category: NewsCategory;
}

/**
 * 실제 기독교 언론사의 RSS 피드 목록.
 *
 * 구글 뉴스 검색 RSS는 기사 링크가 구글의 자바스크립트 리다이렉트 페이지로
 * 감싸져 있어(news.google.com/rss/articles/...) 원본 기사의 실제 사진을
 * 가져올 수 없다는 한계가 있어, 각 언론사가 직접 제공하는 RSS로 교체했습니다.
 * 이렇게 하면 링크가 원문 기사로 바로 연결되어 사진 출처를 정확히 밝힐 수 있고,
 * 이미지도 실제 기사 사진을 가져올 수 있습니다.
 *
 * 각 언론사는 편의상 카테고리 하나씩에 매칭해 두었지만, 실제로는 각 언론사가
 * 다양한 주제를 함께 다룹니다. 특정 언론사의 세부 섹션(선교/봉사 등) RSS 주소를
 * 알고 있다면 더 정교하게 교체하세요.
 */
export const FEEDS: FeedConfig[] = [
  {
    name: "데일리굿뉴스",
    url: "https://www.goodnews1.com/rss/allArticle.xml",
    category: "선교",
  },
  {
    name: "뉴스앤조이",
    url: "https://www.newsnjoy.or.kr/rss/allArticle.xml",
    category: "교회",
  },
  {
    name: "아이굿뉴스",
    url: "https://www.igoodnews.net/rss/allArticle.xml",
    category: "봉사",
  },
  {
    name: "당당뉴스",
    url: "https://www.dangdangnews.com/rss/allArticle.xml",
    category: "문화",
  },
  {
    name: "한국기독공보",
    url: "https://www.pckworld.com/rss/allArticle.xml",
    category: "사회",
  },
  {
    name: "교회와신앙",
    url: "https://www.amennews.com/rss/allArticle.xml",
    category: "칼럼",
  },
];

export const REVALIDATE_SECONDS = 60 * 30; // 30분마다 재수집 (ISR)
