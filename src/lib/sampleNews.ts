import { NewsArticle, NewsCategory } from "@/types/news";
import { getFallbackImage } from "./image";
import { pickVerse } from "./bibleVerses";

interface SampleSeed {
  slug: string;
  title: string;
  summary: string[];
  category: NewsCategory;
  daysAgo: number;
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "디원뉴스";

/**
 * 애드센스 심사 및 초기 방문자 경험을 위한 기본 예시 콘텐츠입니다.
 * 외부 언론사 기사를 그대로 옮긴 것이 아니라 자체 편집팀이 작성한
 * 정보성 콘텐츠이므로 저작권 문제가 없습니다.
 * 실제 RSS 피드가 정상 수집되면 최신 뉴스가 상단에 먼저 노출되고,
 * 이 예시 콘텐츠는 그 아래에 계속 보조 콘텐츠로 남아 있습니다.
 */
const SEEDS: SampleSeed[] = [
  {
    slug: "sample-mission-01",
    title: "단기선교 떠나기 전 꼭 확인해야 할 5가지",
    summary: [
      "단기선교는 열정만큼이나 사전 준비가 중요합니다.",
      "현지 문화 이해, 건강 관리, 팀 내 역할 분담을 미리 점검하세요.",
      "무엇보다 기도로 준비하는 시간이 선교의 열매를 좌우합니다.",
    ],
    category: "선교",
    daysAgo: 1,
  },
  {
    slug: "sample-mission-02",
    title: "온라인 시대, 디지털 선교는 어떻게 이루어지나",
    summary: [
      "코로나 이후 많은 선교단체가 온라인 플랫폼을 적극 활용하고 있습니다.",
      "SNS와 유튜브를 통한 복음 전파 사례가 빠르게 늘고 있습니다.",
      "물리적 거리의 한계를 넘는 새로운 선교 모델이 주목받고 있습니다.",
    ],
    category: "선교",
    daysAgo: 2,
  },
  {
    slug: "sample-church-01",
    title: "작은 교회가 지역사회와 함께 성장하는 법",
    summary: [
      "출석 인원보다 지역과의 관계가 교회 건강의 척도가 되고 있습니다.",
      "동네 도서관, 반찬 나눔 등 생활 밀착형 사역이 좋은 반응을 얻고 있습니다.",
      "작지만 진정성 있는 섬김이 지역 주민의 마음을 열고 있습니다.",
    ],
    category: "교회",
    daysAgo: 1,
  },
  {
    slug: "sample-church-02",
    title: "다음세대를 위한 교회학교, 무엇이 바뀌고 있나",
    summary: [
      "많은 교회학교가 놀이와 체험 중심 커리큘럼으로 전환하고 있습니다.",
      "부모와 함께하는 가정예배 자료를 배포하는 교회도 늘고 있습니다.",
      "디지털 세대에 맞춘 눈높이 신앙교육이 새로운 과제로 떠올랐습니다.",
    ],
    category: "교회",
    daysAgo: 3,
  },
  {
    slug: "sample-church-03",
    title: "예배 회복 이후, 성도들이 다시 찾은 것들",
    summary: [
      "대면 예배가 회복되며 공동체성에 대한 갈망이 커졌다는 조사 결과가 나왔습니다.",
      "찬양과 교제의 가치를 새롭게 발견했다는 응답이 많았습니다.",
      "온라인과 오프라인을 병행하는 하이브리드 예배도 자리잡고 있습니다.",
    ],
    category: "교회",
    daysAgo: 4,
  },
  {
    slug: "sample-service-01",
    title: "청년 봉사팀이 만든 작은 변화, 쪽방촌 도시락 나눔",
    summary: [
      "한 청년 공동체가 매주 토요일 쪽방촌에 도시락을 전달하고 있습니다.",
      "단순한 물품 지원을 넘어 어르신들과의 대화 시간을 함께 마련합니다.",
      "꾸준함이 만드는 신뢰가 봉사의 진짜 힘이라는 평가를 받고 있습니다.",
    ],
    category: "봉사",
    daysAgo: 2,
  },
  {
    slug: "sample-service-02",
    title: "재난 현장에 가장 먼저 도착하는 교회 봉사단",
    summary: [
      "수해와 화재 등 재난 현장에 교회 봉사단의 손길이 이어지고 있습니다.",
      "장비와 인력을 자체적으로 갖춘 상시 대응팀도 늘어나는 추세입니다.",
      "신속한 초기 대응이 피해 복구 기간을 크게 단축시키고 있습니다.",
    ],
    category: "봉사",
    daysAgo: 5,
  },
  {
    slug: "sample-culture-01",
    title: "CCM을 넘어, 크리스천 창작자들이 만드는 콘텐츠들",
    summary: [
      "음악을 넘어 영화, 웹툰, 팟캐스트 등으로 창작 영역이 넓어지고 있습니다.",
      "일상의 언어로 신앙을 풀어내는 콘텐츠가 젊은 세대에게 호응을 얻고 있습니다.",
      "플랫폼을 통해 국내를 넘어 해외 시청자와도 만나고 있습니다.",
    ],
    category: "문화",
    daysAgo: 1,
  },
  {
    slug: "sample-culture-02",
    title: "가족이 함께 볼 만한 신앙 기반 콘텐츠 추천",
    summary: [
      "여름방학을 맞아 온 가족이 함께 볼 신앙 콘텐츠에 관심이 커지고 있습니다.",
      "다큐멘터리부터 애니메이션까지 선택의 폭이 넓어졌습니다.",
      "부모와 자녀가 함께 대화 나눌 수 있는 콘텐츠가 특히 인기입니다.",
    ],
    category: "문화",
    daysAgo: 6,
  },
  {
    slug: "sample-society-01",
    title: "교계, 취약계층 돌봄을 위한 연대 나서",
    summary: [
      "여러 교단과 단체가 취약계층 지원을 위한 공동 대응체를 구성했습니다.",
      "긴급 생계비 지원과 상담 연계 등 실질적 도움에 초점을 맞췄습니다.",
      "장기적으로는 자립을 돕는 프로그램으로 확대할 계획입니다.",
    ],
    category: "사회",
    daysAgo: 3,
  },
  {
    slug: "sample-society-02",
    title: "저출생 시대, 교회가 할 수 있는 역할은",
    summary: [
      "지역사회 돌봄 공백을 교회 공동체가 메우려는 시도가 이어지고 있습니다.",
      "공동육아와 돌봄나눔 프로그램을 운영하는 교회가 늘고 있습니다.",
      "세대를 잇는 공동체 회복이 근본적 해법이라는 목소리가 나옵니다.",
    ],
    category: "사회",
    daysAgo: 7,
  },
  {
    slug: "sample-column-01",
    title: "[칼럼] 바쁜 일상 속에서 큐티 습관을 지키는 법",
    summary: [
      "짧더라도 매일 같은 시간에 말씀을 여는 것이 습관의 핵심입니다.",
      "완벽한 묵상보다 꾸준한 접촉이 신앙의 근육을 키웁니다.",
      "작은 실천이 쌓여 삶의 방향을 바꾼다는 것을 기억하시길 바랍니다.",
    ],
    category: "칼럼",
    daysAgo: 2,
  },
];

export function getSampleArticles(): NewsArticle[] {
  const now = Date.now();
  return SEEDS.map((seed) => {
    const publishedAt = new Date(
      now - seed.daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();
    return {
      slug: seed.slug,
      title: seed.title,
      summary: seed.summary,
      sourceName: `${SITE_NAME} 편집팀`,
      sourceUrl: "/about",
      imageUrl: getFallbackImage(seed.category, seed.slug),
      isOriginalImage: false,
      category: seed.category,
      publishedAt,
      verse: pickVerse(seed.category, seed.slug),
    } satisfies NewsArticle;
  });
}
