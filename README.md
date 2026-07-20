# 디원뉴스 (grace-news)

기독교 교계 소식을 여러 사이트에서 일일이 찾아볼 필요 없이, 한 곳에 모아 **3줄 요약 + 관련 성경 구절**로 보여주는 뉴스 큐레이션 웹앱입니다. Next.js 14(App Router) + Tailwind CSS로 제작되었고, 애드센스 광고 수익화와 SEO(검색엔진 최적화)를 염두에 두고 구성했습니다.

## 핵심 기능

- **실시간 뉴스 수집**: 구글 뉴스 RSS(키워드 검색) 기반으로 30분마다 자동 재수집(ISR). `src/lib/feeds.ts`에서 피드 목록을 자유롭게 교체/추가 가능.
- **3줄 요약**: `ANTHROPIC_API_KEY`를 넣으면 Claude가 기사 본문을 3줄로 요약합니다. 키가 없으면 자동으로 본문 발췌 기반 무료 요약으로 대체되어, API 키 없이도 즉시 서비스가 동작합니다.
- **이미지 자동 매칭**: 기사 원본 썸네일을 최대한 추출하고, 없으면 카테고리(선교/교회/봉사/문화/사회/칼럼)에 맞는 SVG 기본 이미지를 코드로 즉석 생성합니다. 외부 이미지 서비스에 의존하지 않아 저작권 문제와 깨진 이미지 링크 걱정이 없습니다.
- **저작권 안전 설계**: 기사 전문을 가져오지 않고 '제목 + 3줄 요약 + 원문 링크'만 제공합니다.
- **SEO 최적화**: 뉴스 상세 페이지마다 동적 `title`/`description`/OG 태그/JSON-LD(NewsArticle)가 자동 생성되고, `sitemap.xml`·`robots.txt`가 자동으로 만들어집니다.
- **애드센스 대응**: 상단/본문 중간/하단에 광고 슬롯 컴포넌트(`AdSlot`)가 미리 배치되어 있고, 승인 전에는 안내 박스만, 승인 후 환경변수만 넣으면 실제 광고가 표시됩니다. 애드센스 심사를 위한 기본 예시 콘텐츠 12개와 개인정보처리방침 페이지도 포함되어 있습니다.

## 파일 구조

```
grace-news/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 전역 레이아웃, 메타데이터, 애드센스 스크립트
│   │   ├── page.tsx            # 홈 (최신 뉴스 그리드)
│   │   ├── news/[slug]/page.tsx    # 뉴스 상세 (동적 메타태그/OG/JSON-LD)
│   │   ├── category/[slug]/page.tsx # 카테고리별 목록
│   │   ├── about/ privacy/ contact/ # 소개, 개인정보처리방침, 문의
│   │   ├── sitemap.ts          # sitemap.xml 자동 생성
│   │   └── robots.ts           # robots.txt 자동 생성
│   ├── components/
│   │   ├── NewsCard.tsx / Header.tsx / Footer.tsx
│   │   ├── AdSlot.tsx           # 애드센스 광고 슬롯
│   │   └── BibleVerseCard.tsx
│   ├── lib/
│   │   ├── feeds.ts            # RSS 피드 목록 설정
│   │   ├── rss.ts              # RSS 수집 & 파싱 (ISR 캐시 연동)
│   │   ├── image.ts            # 썸네일 추출 & 기본 이미지 생성
│   │   ├── bibleVerses.ts      # 카테고리별 성경 구절 매칭
│   │   ├── summarize.ts        # 3줄 요약 (Claude API / 무료 발췌 폴백)
│   │   ├── news.ts             # 전체 수집·가공 로직 통합
│   │   └── sampleNews.ts       # 애드센스 심사용 기본 예시 콘텐츠 12개
│   └── types/news.ts
├── .env.example
└── package.json
```

---

## 0. 로컬에서 실행해보기

이 컴퓨터에는 Node.js가 설치되어 있지 않아 이 세션에서는 빌드를 직접 실행하지 못했습니다. 배포 전에 로컬(또는 Vercel)에서 아래 순서로 한 번 확인하는 것을 권장합니다.

1. [Node.js 20 LTS](https://nodejs.org) 설치
2. 프로젝트 폴더에서 의존성 설치 및 환경변수 설정
   ```bash
   cd grace-news
   npm install
   cp .env.example .env.local   # Mac/Linux. Windows는 파일 복사로 대체
   ```
3. 개발 서버 실행 후 `http://localhost:3000` 접속하여 확인
   ```bash
   npm run dev
   ```
4. 배포 전 빌드 검증
   ```bash
   npm run build
   ```

`.env.local`을 비워둔 채로도(`ANTHROPIC_API_KEY`, 애드센스 값 없이도) 사이트는 정상 동작합니다. 이 경우 요약은 무료 발췌 방식으로, 광고 자리는 안내 박스로 보입니다.

---

## 1. Vercel을 통한 1분 무료 배포

1. [github.com](https://github.com)에 새 저장소를 만들고 `grace-news` 폴더 전체를 푸시합니다.
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 디원뉴스"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com)에 GitHub 계정으로 가입/로그인합니다.
3. 대시보드에서 **Add New → Project**를 클릭하고 방금 만든 저장소를 선택(Import)합니다.
4. Framework Preset이 자동으로 **Next.js**로 인식됩니다. 별도 설정 변경 없이 진행합니다.
5. **Environment Variables** 섹션에 `.env.example`에 있는 항목을 필요한 만큼 입력합니다.
   - 최소한 `NEXT_PUBLIC_SITE_URL`은 배포 후 발급받는 도메인(예: `https://grace-news.vercel.app`)으로 넣어주는 것을 권장합니다 (없어도 기본값으로 동작은 합니다. 배포 후 실제 도메인을 넣고 재배포하세요).
6. **Deploy** 버튼 클릭 → 약 1분 내 빌드 및 배포가 완료되고, `xxxx.vercel.app` 주소가 발급됩니다.
7. 이후 `main` 브랜치에 커밋을 푸시할 때마다 자동으로 재배포됩니다.
8. (선택) Vercel 프로젝트의 **Settings → Domains**에서 보유한 커스텀 도메인을 연결할 수 있습니다.

---

## 2. 구글 서치 콘솔(Google Search Console) 등록 & 사이트맵 제출

1. [Google Search Console](https://search.google.com/search-console)에 접속해 구글 계정으로 로그인합니다.
2. **속성 추가** → **URL 접두어** 방식을 선택하고 배포된 사이트 주소(예: `https://grace-news.vercel.app`)를 입력합니다.
3. 소유권 확인 방법 중 **HTML 태그** 방식을 선택하면 `<meta name="google-site-verification" content="...">` 값이 제공됩니다.
4. 발급받은 content 값을 Vercel 프로젝트의 환경변수 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`에 붙여넣고 재배포합니다. (`src/app/layout.tsx`의 `metadata.verification.google`에 이미 자동 연결되어 있습니다.)
5. 재배포가 끝나면 Search Console로 돌아와 **확인** 버튼을 클릭합니다.
6. 왼쪽 메뉴에서 **Sitemaps**를 클릭하고, 새 사이트맵 추가란에 `sitemap.xml`을 입력한 뒤 제출합니다. (전체 주소: `https://your-domain/sitemap.xml`)
7. 며칠 내로 **URL 검사** 도구에서 개별 뉴스 페이지의 색인 생성을 요청하면 노출 속도를 더 앞당길 수 있습니다.

---

## 3. 네이버 서치어드바이저(Naver Search Advisor) 등록 & 사이트맵 제출

1. [네이버 서치어드바이저](https://searchadvisor.naver.com)에 네이버 계정으로 로그인합니다.
2. **웹마스터 도구 → 사이트 등록**에서 배포된 사이트 주소를 입력합니다.
3. 소유 확인 방법으로 **HTML 태그** 방식을 선택하면 `content="..."` 값이 제공됩니다.
4. 이 값을 Vercel 환경변수 `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`에 넣고 재배포합니다. (`layout.tsx`에 이미 `naver-site-verification` meta 태그로 연결되어 있습니다.)
5. 재배포 후 서치어드바이저에서 **소유확인** 버튼을 클릭합니다.
6. 등록된 사이트를 선택 → **요청 → 사이트맵 제출**에서 `sitemap.xml`을 제출합니다.
7. 좌측 메뉴의 **요청 → 웹페이지 수집**에서 주요 페이지 URL을 등록하면 수집 속도를 높일 수 있습니다.

---

## 4. 구글 애드센스 신청 & 광고 코드 적용

### 4-1. 신청 전 체크리스트
- 사이트가 실제 도메인으로 배포되어 있고 (Vercel 기본 도메인도 가능) 정상 접속되는지 확인
- 이 프로젝트에 포함된 예시 콘텐츠 12개 + RSS로 수집되는 실제 뉴스가 함께 노출되고 있는지 확인
- `개인정보처리방침`(`/privacy`), `소개`(`/about`), `문의`(`/contact`) 페이지가 정상 노출되는지 확인
- `src/app/contact/page.tsx`가 참조하는 `NEXT_PUBLIC_CONTACT_EMAIL`을 실제 연락 가능한 이메일로 변경

### 4-2. 신청 절차
1. [Google AdSense](https://www.google.com/adsense)에 접속해 계정을 만들고 사이트 URL을 등록합니다.
2. 발급되는 **자동 광고 코드**(ads.txt 안내 포함)를 확인합니다. AdSense는 사이트 루트에 `ads.txt` 파일이 있는지 확인하므로, 승인 화면에 나오는 내용을 그대로 `public/ads.txt` 파일로 만들어 추가하세요. 예시:
   ```
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
   (`pub-XXXXXXXXXXXXXXXX` 부분은 실제 발급받은 값으로 교체)
3. 심사는 보통 몇 시간~2주 정도 소요됩니다. 이 기간에는 콘텐츠를 꾸준히 추가/갱신해 두는 것이 유리합니다 (RSS 자동 수집이 계속 새 기사를 채워줍니다).

### 4-3. 승인 후 광고 코드 적용
1. AdSense 대시보드 → **광고 → 광고 단위별**에서 원하는 형태(디스플레이 광고)로 광고 단위를 3개 만듭니다 (상단/본문 중간/하단용).
2. 각 광고 단위 생성 시 발급되는 **광고 클라이언트 ID**(`ca-pub-...`)와 **슬롯 ID**(숫자)를 확인합니다.
3. Vercel 프로젝트의 환경변수에 아래 값을 입력하고 재배포합니다.
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT_TOP=상단광고슬롯ID
   NEXT_PUBLIC_ADSENSE_SLOT_INLINE=본문중간광고슬롯ID
   NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=하단광고슬롯ID
   ```
4. 재배포 후 홈/상세/카테고리 페이지의 `AdSlot` 자리에 자동으로 실제 광고가 표시됩니다. (코드를 다시 수정할 필요가 없습니다 — `src/components/AdSlot.tsx`가 환경변수 유무에 따라 자동 전환됩니다.)

---

## 운영 팁

- **피드 추가/교체**: `src/lib/feeds.ts`에서 원하는 언론사의 RSS 주소를 알고 있다면 배열에 추가하세요. 구글 뉴스 키워드 검색 RSS는 안정적이지만, 특정 언론사 RSS를 직접 연결하면 더 정확한 원문 이미지/출처를 얻을 수 있습니다.
- **요약 품질 개선**: `ANTHROPIC_API_KEY`를 등록하면 Claude 기반 3줄 요약으로 자동 전환됩니다 (`src/lib/summarize.ts`). 비용이 부담된다면 무료 발췌 요약만으로도 서비스는 정상 동작합니다.
- **재수집 주기 변경**: `src/lib/feeds.ts`의 `REVALIDATE_SECONDS` 값을 조정하면 ISR 재검증 주기를 바꿀 수 있습니다 (기본 30분).
- **카테고리/성경구절 커스터마이징**: `src/lib/bibleVerses.ts`에서 카테고리별 구절 목록을 자유롭게 추가/수정할 수 있습니다.
