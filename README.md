# 보험 블로그 자동화 시스템

YouTube에서 보험/손해사정 관련 인기 영상을 찾아 자동으로 블로그 글로 변환하는 시스템입니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 데이터베이스 초기화

```bash
npm run db:init
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 필수: YouTube Data API v3 키
YOUTUBE_API_KEY=your_youtube_api_key_here

# 필수: Google Gemini API 키
GEMINI_API_KEY=your_gemini_api_key_here

# 선택: Telegram 알림
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

**API 키 발급 방법:**

#### YouTube Data API v3
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성
3. "API 및 서비스" → "라이브러리" 이동
4. "YouTube Data API v3" 검색 및 활성화
5. "사용자 인증 정보" → "API 키" 생성

#### Google Gemini API
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. "Get API key" 클릭
3. API 키 복사

#### Telegram Bot (선택사항)
1. Telegram에서 [@BotFather](https://t.me/botfather) 검색
2. `/newbot` 명령어로 봇 생성
3. 봇 토큰 복사
4. 생성한 봇에 메시지 전송 후 Chat ID 확인:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
insurance-blog/
├── pages/                # Next.js 페이지
│   ├── index.js         # 홈 (포스트 목록)
│   ├── posts/[slug].js  # 포스트 상세
│   ├── admin/           # 관리자 페이지
│   │   ├── dashboard.js # 대시보드
│   │   └── discover.js  # 영상 검색
│   └── api/             # API 라우트
│       ├── search-videos.js
│       └── posts/[action].js
│
├── components/          # React 컴포넌트
│   ├── Layout.js
│   └── PostCard.js
│
├── lib/                 # 헬퍼 함수
│   ├── db.js           # JSON 데이터 저장소
│   └── youtube.js      # YouTube API
│
├── data/               # JSON 데이터 파일
│   ├── posts.json      # 포스트
│   ├── videos.json     # 발견된 영상
│   └── notifications.json
│
└── styles/             # 스타일
    └── globals.css
```

## 🎯 주요 기능

### 1. 영상 검색 및 발굴
- YouTube에서 키워드로 영상 검색
- 조회수 10,000회 이상 필터링
- 최근 30일 이내 영상만 표시

### 2. 자동 블로그 글 생성
- YouTube 자막 자동 추출
- Gemini API로 SEO 최적화된 글 생성
- 2000자 이상 본문
- H2/H3 구조화

### 3. 콘텐츠 관리
- Draft 상태로 저장
- 관리자 검토 및 승인
- 예약 발행 설정

### 4. SEO 최적화
- SSG (Static Site Generation)
- Schema.org 마크업
- 메타태그 자동 생성
- Lighthouse 400점 목표

## 📝 사용 방법

### 영상 검색 및 선택
1. http://localhost:3000/admin/discover 접속
2. 키워드 입력 (예: "손해사정사 비용")
3. 검색 결과에서 원하는 영상 선택
4. "글 생성" 버튼 클릭

### 포스트 검토 및 발행
1. http://localhost:3000/admin/dashboard 접속
2. Draft 포스트 목록 확인
3. 미리보기 및 수정
4. 발행 시간 예약 또는 즉시 발행

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: JSON 파일 기반 저장소
- **AI**: Google Gemini API
- **API**: YouTube Data API v3
- **Deployment**: Vercel

## 📦 배포

### Vercel 배포

1. GitHub 저장소 생성 및 푸시
2. [Vercel](https://vercel.com) 계정 생성
3. "Import Project" → GitHub 저장소 선택
4. 환경 변수 설정 (YOUTUBE_API_KEY, GEMINI_API_KEY)
5. 배포 시작

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 데이터베이스 초기화
npm run db:init

# Lint 검사
npm run lint
```

## 📄 라이선스

MIT License

## 🤝 기여

Issue 및 Pull Request 환영합니다!

## 📞 문의

문제가 발생하면 GitHub Issues를 이용해주세요.

---

**프로젝트 상태**: MVP 개발 완료 ✅
**마지막 업데이트**: 2024-11-16
