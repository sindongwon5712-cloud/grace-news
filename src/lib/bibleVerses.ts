import { BibleVerse, NewsCategory } from "@/types/news";

const VERSES_BY_CATEGORY: Record<NewsCategory, BibleVerse[]> = {
  선교: [
    {
      reference: "마태복음 28:19",
      text: "그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고",
    },
    {
      reference: "로마서 10:15",
      text: "보내심을 받지 아니하였으면 어찌 전파하리요 기록된 바 아름답도다 좋은 소식을 전하는 자들의 발이여 함과 같으니라",
    },
    {
      reference: "사도행전 1:8",
      text: "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라",
    },
  ],
  교회: [
    {
      reference: "마태복음 18:20",
      text: "두세 사람이 내 이름으로 모인 곳에는 나도 그들 중에 있느니라",
    },
    {
      reference: "에베소서 4:16",
      text: "그에게서 온 몸이 각 마디를 통하여 도움을 받음으로 연결되고 결합되어 사랑 안에서 스스로 세우느니라",
    },
    {
      reference: "히브리서 10:25",
      text: "모이기를 폐하는 어떤 사람들의 습관과 같이 하지 말고 오직 권하여 그 날이 가까움을 볼수록 더욱 그리하자",
    },
  ],
  봉사: [
    {
      reference: "갈라디아서 5:13",
      text: "오직 사랑으로 서로 종 노릇 하라",
    },
    {
      reference: "베드로전서 4:10",
      text: "각각 은사를 받은 대로 하나님의 여러 가지 은혜를 맡은 선한 청지기 같이 서로 봉사하라",
    },
    {
      reference: "마태복음 25:40",
      text: "내가 진실로 너희에게 이르노니 너희가 여기 내 형제 중에 지극히 작은 자 하나에게 한 것이 곧 내게 한 것이니라",
    },
  ],
  문화: [
    {
      reference: "시편 96:1",
      text: "새 노래로 여호와께 노래하라 온 땅이여 여호와께 노래할지어다",
    },
    {
      reference: "빌립보서 4:8",
      text: "무엇에든지 참되며 경건하며 옳으며 정결하며 사랑 받을 만하며 칭찬 받을 만하며 무슨 덕이 있든지 기림이 있든지 이것들을 생각하라",
    },
  ],
  사회: [
    {
      reference: "미가서 6:8",
      text: "오직 정의를 행하며 인자를 사랑하며 겸손하게 네 하나님과 함께 행하는 것이 아니냐",
    },
    {
      reference: "잠언 31:8-9",
      text: "너는 말 못 하는 자와 모든 고독한 자의 송사를 위하여 입을 열지니라 너는 입을 열어 공의로 재판하여 곤고한 자와 궁핍한 자를 신원할지니라",
    },
  ],
  칼럼: [
    {
      reference: "잠언 3:5-6",
      text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라",
    },
    {
      reference: "야고보서 1:5",
      text: "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라",
    },
  ],
};

/** slug 문자열을 시드로 사용해 카테고리 내에서 항상 같은 구절을 결정론적으로 고릅니다. */
export function pickVerse(category: NewsCategory, seed: string): BibleVerse {
  const list = VERSES_BY_CATEGORY[category] ?? VERSES_BY_CATEGORY["교회"];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return list[hash % list.length];
}
