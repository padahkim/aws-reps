# APP_ARCHITECTURE_DRAFT — 규약 변경에 강건한 Next.js 스켈레톤 초안 (단계 2-0a 부산물)

> **지위**: 설계 제안 문서. 코드 구현물 아님. 규약 v1 확정(단계 2-2) 후 앱 세션(단계 4)의 입력.
> **설계 목표 하나**: 규약이 v1에서 어떻게 확정되든(필드 추가·명명 변경·유형 확장) **어댑터 한 겹만 고치면 되는** 구조. 앱의 나머지는 어댑터가 내놓는 내부 타입만 본다.
> 전제·용어는 `CONTRACT_PREWORK.md` §2 제안(2파일 분리, chapterMeta, 레지스트리)을 따르되, 그 제안이 기각되어도 본 문서의 어댑터 경계는 유효하다.

## 1. 디렉터리 트리

```
app/
  layout.tsx                    # 루트 레이아웃 (서버)
  page.tsx                      # 홈 = 챕터 목록 + 진도 요약
  chapters/
    [id]/
      page.tsx                  # 챕터 페이지 (서버) — generateStaticParams로 SSG
  review/
    page.tsx                    # 오답노트 (클라)
lib/
  contract/                     # ★ 어댑터 한 겹 — 규약 의존이 여기에만 존재
    types.ts                    #   앱 내부 타입: AppChapterMeta, AppQuestion (규약과 별개 명명)
    adapter.ts                  #   규약 export → 내부 타입 변환 + 검증. v1 확정 시 이 파일만 채움
    registry.ts                 #   content/registry를 re-export — 앱 코드는 content/를 직접 import 금지
  progress/
    store.ts                    # localStorage 접근 전담 (아래 §3 키 구조)
components/
  Quiz.tsx                      # 공용 <Quiz> (클라) — §4
  ChapterProvider.tsx           # 챕터 quiz 데이터 컨텍스트 주입 (클라)
  Nav.tsx, ProgressBadge.tsx    # meta만 소비 (서버 가능)
content/                        # 콘텐츠 영역 — 앱 세션 수정 금지 (표준화 세션 소유)
  registry.ts
  chapters/{id}/meta.ts, body.jsx
```

규약 의존 지점은 `lib/contract/` 3파일로 격리. 예: v1이 `chapterMeta`가 아니라 `meta`로 확정되면 `adapter.ts`의 import 별칭 1줄 수정. quiz에 필드가 추가되면 `types.ts`+`adapter.ts`만 확장 — `<Quiz>`·진도·오답노트는 내부 타입만 보므로 무수정.

## 2. 라우팅·로딩

- `app/chapters/[id]/page.tsx` (서버): `registry`에서 meta 조회 → `generateStaticParams()` = 레지스트리 키 → 전 챕터 SSG
- 본문: `next/dynamic(() => import('content/chapters/{id}/body'))` — 챕터별 청크 분리. 로딩 fallback은 앱 셸 소유
- 렌더 구성: `<ChapterProvider quiz={adaptedQuiz}>` (클라) 안에 dynamic body — body 내 `<Quiz>`가 컨텍스트로 문항 조회
- quiz가 빈 배열인 챕터(레거시 다수)에서도 페이지·진도가 정상 동작해야 함 — Provider는 빈 배열 허용, `<Quiz>` 미사용 본문 적법

## 3. 진도 저장 — localStorage 키 구조

단일 루트 키 + 버전 필드(마이그레이션 대비). 문항 id가 전역 유일(챕터 접두)이라는 규약 제안에 의존 — 기각되면 어댑터가 접두를 합성해 동일 보장.

```ts
"dva.progress.v1": {
  chapters: { [chapterId]: { visitedAt: string, sectionsSeen?: string[] } },
  questions: { [questionId]: {           // 예: "s3-q01"
    attempts: number, correct: number,
    lastResult: "pass"|"fail", lastAt: string,
  }},
}
"dva.review.v1": { [questionId]: { addedAt: string, clearedAt?: string } }  // 오답노트
```

- 쓰기는 전부 `lib/progress/store.ts` 경유 (컴포넌트에서 localStorage 직접 접근 금지)
- 오답노트·혼합복습은 `questions`의 fail 이력 + 문항 `concept[]` 태그로 파생 — 별도 저장 최소화

## 4. 공용 `<Quiz>` props 경계 (대략)

```tsx
<Quiz
  ids?: string[]                 // 명시 나열 (기본형)
  scope?: string                 // "section:…" | "chapter" — ids와 상호배타
  // 데이터는 props로 받지 않는다: ChapterProvider 컨텍스트에서 조회
  // 채점·진도 기록·오답노트 등록은 내부 처리 (progress store 경유)
  // 풀이 정책 옵션(자기설명 게이트 등)은 v1 미포함 — 확장 슬롯만 예약: mode?: string
/>
```

오답노트 화면은 챕터 컨텍스트 없이 전역 레지스트리에서 문항을 역조회하는 `<Quiz standalone questions={…}>` 변형이 필요 — 상세는 앱 세션에서.

## 5. 이 초안이 규약 v1에 요구하는 것 (역방향 의존 명세)

① 문항 id 전역 유일 ② meta의 서버 소비 가능성(§2-0) ③ quiz 빈 배열 적법 ④ scope 어휘 통제. 넷 다 CONTRACT_PREWORK §2에 제안으로 존재 — v1 확정 시 이 넷이 기각되는지만 확인하면 초안 유효성이 판정된다.
