# ARCHITECTURE.md — aws-reps 현행 아키텍처 (as-built)

> **지위**: **현행 기술 문서**. 코드에서 직접 확인한 as-built 사실만 담는다 — 제안이 아니라 관측이다.
> 설계 제안 문서 [`docs/APP_ARCHITECTURE_DRAFT.md`](APP_ARCHITECTURE_DRAFT.md)·[`docs/LEARNING_LOOP_DRAFT.md`](LEARNING_LOOP_DRAFT.md)는 그대로 남기고, 이 문서가 그 제안이 실제로 무엇으로 구현/변형/폐기됐는지를 §5에서 대조한다.
> **작성 방법**: 읽기 전용 진단 + 5축 병렬 심층 리뷰 후 각 발견을 코드에 대해 반증 검증(21건 발견 / 21건 확정 / 0건 반증). 모든 판단에 `파일:라인` 근거를 붙였다.
> **기준 커밋**: `content/ch0-2-iam-guide-rewrite` 브랜치 (24f7625 계열). 파일 수·라인은 이 시점 기준이며, 코드가 정본이다.

---

## 1. 한눈 요약

- **스택**: Next.js 16 (App Router) + React 19 + TypeScript strict. 본문은 `@next/mdx` (remark/rehype 플러그인 **0개**). 스크립트는 Node 네이티브 TS(strip-types)로 직접 실행.
- **배포**: `output: "export"` — **서버 런타임 없는 순수 정적 사이트(SSG)**. `develop` push → Vercel 프리뷰(+`/_source` 검수), `main` → 프로덕션. 진도는 `localStorage`뿐, 로그인 없음.
- **핵심 결정 3가지**: ① 콘텐츠 2계층 — 레거시 날것 원본(import 금지·검수 전용)과 규약 v3 구조화 챕터를 분리하고, 앱은 `lib/content.ts` **단일 통로**로만 소비한다. ② 규약(`content/schema.ts`)이 챕터 계약의 단일 진실이고, 값 수준 위반은 빌드 게이트(`validate-content.mts`)가, 섹션 수 불일치는 `body.tsx` 모듈평가 assert가 잡는다. ③ 본문 표현은 TSX 셸 + MDX 산문으로, 섹션 단위 정적 라우트(`/chapters/{id}/{n}`)로 프리렌더된다.
- **구조 규모**: 레거시 원본 **28개**(27 `.jsx` + 1 `.html`) → 구조화 챕터 **4개**(ch0-1/0-2/1-1/1-2) 등록. 이 4개가 CURRICULUM §5의 **릴리즈 1(MVP) 콘텐츠 세트와 정확히 일치**한다.
- **건강 상태 (루브릭 총점 = 3.3 / 5)**: 릴리즈 차단 결함(높음) **0건**. 구조화 콘텐츠 파이프라인·규약 경계·강건성은 견고(4점대), 상태·진도 계층이 확정 설계 대비 가장 뒤처져 있음(2점). 발견 21건 = 높음 0 / 중간 3 / 낮음 18.

---

## 2. 시각화

### 2-A. 시스템 지도 — 요청에서 상태까지

```mermaid
flowchart TD
  U([브라우저 요청]) --> R{"정적 라우트<br/>output: export · dynamicParams=false"}
  R -->|/| H["app/page.tsx<br/>홈·챕터목록"]:::srv
  R -->|/chapters/id| CP["app/chapters/[id]/page.tsx<br/>섹션 목차"]:::srv
  R -->|/chapters/id/n| SP["app/chapters/[id]/[sec]/page.tsx<br/>섹션 페이지"]:::srv

  H --> LC["lib/content.ts<br/>앱↔콘텐츠 유일 통로"]:::gate
  CP --> LC
  SP --> LC
  LC --> REG["content/registry.ts<br/>수동 등록 4챕터"]:::content
  REG --> SCH["content/schema.ts<br/>규약 v3 단일진실"]:::content

  SP -->|await entry.loadBody| BODY["content/chapters/id/body.tsx<br/>use client shim"]:::cli
  BODY -->|dynamic import<br/>챕터별 청크| MDX["sections/NN.mdx<br/>+ figs.tsx"]:::content
  BODY --> UI["content/chapters/ui.tsx<br/>Sec·Table·ExamPoint…"]:::content

  H -.->|use client| HP["home-progress.tsx"]:::cli
  SP -.->|use client| MR["mark-read.tsx"]:::cli
  CP -.->|use client| TOC["section-toc.tsx"]:::cli
  SP --> CQ["chapter-quiz.tsx<br/>useState·비저장"]:::cli
  SP --> SC["section-concepts.tsx<br/>useState·비저장"]:::cli
  HP --> PROG["lib/progress.ts<br/>localStorage: aws-reps.read.v1"]:::state
  MR --> PROG
  TOC --> PROG

  classDef srv fill:#E3EDF6,stroke:#2E5E8C,color:#171E26;
  classDef cli fill:#FDEBD3,stroke:#E8830C,color:#171E26;
  classDef content fill:#DCF0EF,stroke:#0E7C7B,color:#171E26;
  classDef state fill:#F8E4DF,stroke:#B9432C,color:#171E26;
  classDef gate fill:#171E26,stroke:#171E26,color:#fff;
```

> 파란=서버 컴포넌트, 주황=`"use client"`, 청록=콘텐츠 영역, 빨강=상태(localStorage), 검정=경계 통로. 서버 페이지는 `lib/content.ts`만 보고, 본문은 `loadBody()`의 동적 `import()`로 챕터별 청크가 분리된다(`content/registry.ts:20-22`). 퀴즈·개념카드·읽음진도 등 클라이언트 상호작용만 `"use client"` shim으로 내려간다.

### 2-B. 콘텐츠 파이프라인 — 레거시에서 렌더까지

```mermaid
flowchart LR
  subgraph LEG["레거시 원본 28개 · 앱 import 금지"]
    L1["content/*.jsx (27)"]:::pending
    L2["aws-dva-stage0.html (1)"]:::pending
  end
  LEG -->|문자열+Babel<br/>번들러 그래프 밖| REV["app/_source<br/>dev·preview 검수 전용"]:::rev

  L1 ==>|수동 표준화| STR
  L2 ==>|수동 표준화| STR
  subgraph STR["구조화 챕터 4개 (등록됨)"]
    C1["ch0-1 · 4섹션 · session✓"]:::done
    C2["ch0-2 · 10섹션"]:::done
    C3["ch1-1 · 18섹션"]:::done
    C4["ch1-2 · 20섹션"]:::done
  end
  STR --> REG["content/registry.ts<br/>수동 1줄 등록"]:::gate
  REG --> LC["lib/content.ts"]:::gate
  LC --> APP([앱 렌더])

  PEND["미이행 원본 19개<br/>(중복쌍 3: API GW·CI/CD·메시징)"]:::pending
  SUPER["이행완료·잔존 원본 8개<br/>(iam/s3/lambda/stage0)"]:::sup

  classDef done fill:#DCF0EF,stroke:#0E7C7B,color:#171E26;
  classDef pending fill:#FDEBD3,stroke:#E8830C,color:#171E26;
  classDef sup fill:#EFEFEF,stroke:#888,color:#333;
  classDef rev fill:#E3EDF6,stroke:#2E5E8C,color:#171E26;
  classDef gate fill:#171E26,stroke:#171E26,color:#fff;
```

> 28개 원본 = **8개 이행완료**(구조화 챕터로 흡수됐지만 검수용으로 잔존) + **19개 미이행** + **1개 템플릿**(`dva-chapter-template.jsx`). 구조화 챕터에는 네거티브 규정 위반 **0건**, 레거시에는 63건이 있으나 완전히 격리된다(§4-C).

### 2-C. 빌드·검증 게이트 — 무엇을 언제 막나

```mermaid
flowchart TD
  DEV["npm run dev"] --> PREDEV["predev: gen-source-routes.mjs<br/>app/%5Fsource 라우트 생성(gitignore)"]
  BUILD["npm run build"] --> PREBUILD["prebuild"]
  PREBUILD --> VAL["validate-content.mts<br/>값 계약 검사"]:::gate
  PREBUILD --> GEN["gen-source-routes --build<br/>preview만 /_source 유지·prod 제외"]
  VAL -->|위반시 exit 1| STOP([빌드 중단]):::stop
  VAL --> NB["next build<br/>(Vercel preview에서만 실행)"]
  NB --> ASSERT["body.tsx 모듈평가 assert<br/>SECTIONS≠meta.sections → 프리렌더 실패"]:::gate

  CI["GitHub CI · PR/push→develop"] --> TC["typecheck (tsc --noEmit)"]:::gate
  CI --> VAL2["validate"]:::gate
  CI --> VT["validate:test (검사기 회귀 픽스처)"]:::gate
  CI -. next build 안 함 .-> GAPX["assert·MDX 오류는<br/>CI를 통과해 Vercel preview에서만 검출"]:::warn

  GUARD["git_guard.py (PreToolUse 훅)"] -->|gh·rm -rf·force-push 등 차단| BASH([Bash 도구])

  classDef gate fill:#DCF0EF,stroke:#0E7C7B,color:#171E26;
  classDef warn fill:#FDEBD3,stroke:#E8830C,color:#171E26;
  classDef stop fill:#F8E4DF,stroke:#B9432C,color:#171E26;
```

### 2-D. static → server 전환 (현행 vs 에픽 이후)

```mermaid
flowchart LR
  subgraph NOW["현행 · 순수 SSG"]
    N1["output: export"]
    N2["localStorage aws-reps.read.v1<br/>읽음 진도만·기기 로컬"]
    N3["서버 런타임 없음"]
    N4["Vercel 정적 호스팅"]
  end
  subgraph FUT["에픽 이후 · 서버 도입"]
    F1["output: export 제거<br/>(next.config.ts 1줄)"]
    F2["인증 (Cognito? — spike 미결)"]
    F3["DB · 계정 귀속 진도<br/>Leitner·오답노트·숙달"]
    F4["AI 채점 서버·데이터 계층"]
  end
  N1 ==>|이 옵션만 제거| F1
  N3 ==>|Route Handler 도입| F2
  N2 ==>|로컬→계정 마이그레이션| F3
  N4 ==>|SSR/ISR 배포로 전환| F4
```

### 2-E. 아키텍처 건강 루브릭 (한눈)

| 항목 | 점수 | 막대 |
|---|---|---|
| 콘텐츠 파이프라인 | 4 / 5 | ████████░░ |
| 상태·진도 | **2 / 5** | ████░░░░░░ |
| 빌드·툴링·하네스 | 3 / 5 | ██████░░░░ |
| 규약·경계 일관성 | 4 / 5 | ████████░░ |
| 확장성·서버 준비도 | 3 / 5 | ██████░░░░ |
| 강건성 | 4 / 5 | ████████░░ |
| **총점** | **3.3 / 5** | ██████▌░░░ |

> 가장 낮은 2개 = **상태·진도(2)**와 **빌드·툴링·하네스(3)**. 다음 우선순위 근거는 §6·§7.

---

## 3. 축별 현행 구조 (as-built)

### 3-0. 스택·빌드·배포

- **패키지·스크립트 체인** (`package.json`): `predev` → `gen-source-routes.mjs`(검수 라우트 생성); `prebuild` → `validate` + `gen-source-routes.mjs --build`; `build` → `next build`. `validate`/`validate:test`/`typecheck`는 독립 실행. 패키지 매니저 npm 고정, `package-lock.json` 커밋.
- **`output: "export"`의 의미** (`next.config.ts:4-10`): Route Handler·서버 컴포넌트 fetch·미들웨어·ISR 전부 배제된 순수 프리렌더. 주석이 전환 지점을 명시한다 — *"서버 기능이 필요해지면 이 옵션만 제거한다."*
- **MDX** (`next.config.ts:12-16`): `createMDX({})` — remark/rehype 플러그인 없음(Next 16+Turbopack 불안정, #15 결정). Mermaid·하이라이트가 필요하면 플러그인이 아니라 클라이언트 컴포넌트로 도입하도록 규약이 못박음(`content/schema.ts:22-23`).
- **tsconfig** (`tsconfig.json`): `strict: true`, `allowJs: false`, `allowImportingTsExtensions: true`, `moduleResolution: "bundler"`, `paths: { "@/*": ["./*"] }`. 단 `noUncheckedIndexedAccess`는 미설정 — `sections[n-1]`·`SECTIONS[section]`이 non-undefined로 타입되어 `body.tsx`가 자체 런타임 인덱스 가드를 둔다(`content/chapters/ch0-2/body.tsx:40`).
- **CI** (`.github/workflows/ci.yml`): PR·push(→`develop`)에서 Node 24 고정 + `npm ci` + `typecheck` + `validate` + `validate:test`. **`next build`는 CI에서 돌리지 않는다**(주석 명시, #28 — 빌드 검증은 Vercel 프리뷰 담당).
- **배포**: `develop`→프리뷰(`/_source` 검수 포함), `main`→프로덕션. 프로덕션 export 산출물은 `out/`에 챕터별 정적 HTML로 떨어진다(`out/chapters/ch0-1/1.html`..`5.html` = 4섹션 + 퀴즈).

### 3-1. 축1 — 콘텐츠 파이프라인 (2계층)

- **① 레거시 날것 원본**: `content/*.jsx`(27) + `content/aws-dva-stage0.html`(1) = **28개**. 앱은 이들을 **절대 import 하지 않는다**. 검수 도구 `/_source`만이 `readFileSync`로 **문자열**을 읽어 브라우저에서 Babel-standalone으로 변환·렌더한다(`app/_source/SourcePage.tsx:16-19`, `app/_source/BabelRender.tsx`). 이유: 일부 원본이 SWC가 거부하는 구문(escape 안 한 날 `>` 등)을 담고 있어, 번들러 그래프에 넣으면 dev 서버 전체가 sticky 500으로 죽는다(`BabelRender.tsx:10-17`). `/_source` 라우트는 `predev`가 만들고(gitignore, `app/%5Fsource/`) `prebuild --build`가 preview 외 빌드에서 제거한다 — 실유저 배포본에 9MB 원본이 실리지 않는다.
- **② 구조화 챕터**: `content/chapters/{id}/` (규약 v3). 파일 구조 = `meta.ts`(순수 데이터) + `body.tsx`(`"use client"` shim) + `intro/outro/sections/NN.mdx`(산문) + `figs.tsx`(챕터 도식·로컬 컴포넌트) + 선택 `session.ts`·`drills.ts`.
- **앱이 보는 경로**: `content/registry.ts`(소비하는 유일 목록, **수동 등록**) → `lib/content.ts`(앱↔콘텐츠 **유일 통로**, 평행 타입 없이 schema 타입 re-export).
- **마이그레이션 현황**: **4/28 등록**. 등록 4개 = ch0-1(4섹션), ch0-2(10섹션), ch1-1(18섹션), ch1-2(20섹션) = 릴리즈 1 세트. 원본 28개의 내역 = 이행완료 8 + 미이행 19 + 템플릿 1.
- **MDX 규정 준수**: 구조화 MDX **60개 파일**(52 섹션 + 8 intro/outro) 전수 스캔 결과 코드펜스 0·다중행 텍스트태그 0·`<style>`/외부리소스/`window`/`document` 0·볼드 flanking 실패 0 — **완전 준수**. 예시(`content/chapters/ch0-2/sections/06.mdx`): `../../ui` 프리미티브와 `../figs` 로컬 컴포넌트를 import하고, `>`는 `&gt;`로, 텍스트 담는 컴포넌트는 한 줄로 쓴다.

### 3-2. 축2 — 상태·진도

- **저장소** (`lib/progress.ts`): localStorage **단일 키 `aws-reps.read.v1`**, 모델 `{ [chapterId]: number[] }` — 읽은 섹션 번호(1-based, 퀴즈 섹션 포함) 배열만. 버전 필드 없음, read-repair/마이그레이션 없음.
- **hydration 처리**: SSG HTML은 항상 "빈 진도"로 렌더되므로 `useReadSections`가 `useEffect`로 마운트 후 채운다(`lib/progress.ts:47-53`) — 불일치 없음. 파싱 실패·스토리지 접근 불가는 `try/catch → {}` + `Array.isArray`·`Number.isInteger` 필터로 강건(`lib/progress.ts:14-27`).
- **읽음 신호**: 섹션 페이지 방문 = 읽음(`app/chapters/[id]/[sec]/mark-read.tsx`가 마운트 시 무조건 기록). 퀴즈 섹션 페이지도 방문만으로 읽음 처리된다(§5 발견 참조).
- **진도 외 상태 = 없음**: 퀴즈 시도·정답 이력·오답노트·Leitner 상자 **전부 미저장**. `chapter-quiz.tsx`는 순수 `useState`(선택/제출)로, 언마운트·이동 시 소실(`app/chapters/[id]/chapter-quiz.tsx:38-39,55-58`). 개념 인출 카드 열림 상태도 비저장 `useState`(`section-concepts.tsx:28`).

### 3-3. 축3 — 빌드·툴링·하네스

- **`validate-content.mts`** (값 수준 계약 검사, `prebuild`+CI 연결): 순수 함수 `validateChapters()`를 export해 픽스처가 직접 먹인다. 검사 항목 = 챕터 id 유일, 섹션 최소1·title·num(비어있음/중복), prerequisites(실존·자기참조), 문항 concept·choices≥2·answer(비어있음/범위/중복)·choiceExplanations 길이, 세션 id 유일·concept.section 실존·q/a 비어있음·diagram edges=nodes-1.
- **`validate-content.test.mts`** (검사기 회귀 픽스처): 각 규칙을 고의로 깨뜨린 입력이 잡히는지 + 적법 입력(빈 quiz·session 없음 등)이 통과하는지 확인.
- **`gen-source-routes.mjs`**: `/_source` 검수 라우트·매니페스트 생성. `--build`는 `VERCEL_ENV=preview`에서만 라우트를 유지하고 그 외엔 제거.
- **`import-drills.mts`**: aws-cloud-drills `<subject>.json` → `content/chapters/<id>/drills.ts`(커밋되는 생성물, 손편집 금지). `SUBJECT_TO_CHAPTER` 매핑 = s3→ch1-1, lambda→ch1-2, aws-basics→ch0-1, iam→ch0-2.
- **`git_guard.py`** (PreToolUse 훅, `.claude/settings.json` 등록): gh CLI 기본 차단(홈 마커+개인 계정일 때만 허용) + 파괴적 명령(`rm -rf`·`push --force`·`reset --hard`·`clean -f`·`branch -D`) 차단.

---

## 4. 규약·경계

### 4-A. 규약 v3 요지 (`content/schema.ts`)

`ChapterData` = `{ chapterMeta, quiz: Question[], sections: SectionMeta[], session? }`. 핵심 계약:
- **섹션 규약(v2)**: `meta.sections`가 섹션 목록의 단일 진실. `body.tsx`의 default export는 `{ section: number; afterSection?: ReactNode }`를 받아 **인덱스 하나만** 렌더(RSC는 클라 모듈 배열 export를 인덱싱 못 하므로 prop 방식). 본문 섹션 수 ≠ `meta.sections.length`면 모듈평가에서 throw.
- **빈 배열 적법성**: `quiz` 빈 배열 적법(앱이 강건해야 함), `sections`는 최소 1(빈 배열 위반), `session` 없는 챕터 적법(점진 이행).
- **인출 세션(#54/#58)**: `session.concepts[].section === sections[].num` 매핑, 카드 열림 v1 비저장. `diagram`은 선형 체인(edges=nodes-1)이 안 맞으면 생략, `mixed` 빈 배열 적법.
- **본문 네거티브 규정**: ✗자체 내비/사이드바/페이저 ✗전역 셀렉터 스타일 ✗`document`/`window` ✗외부 리소스.

### 4-B. 불변식 ↔ 게이트 매핑

| 불변식 | 강제 게이트 | 근거 |
|---|---|---|
| 타입·리터럴 유니온 (examWeight 1..5, freq, scope, difficulty) | **tsc** | `schema.ts:80,93,107,114` (meta.ts가 소스 리터럴로 작성) |
| 챕터 id 유일 / 섹션 최소1·title·num·중복 / prereq 실존·자기참조 | **validate-content** | `validate-content.mts:28-93` |
| 문항 concept≥1 / choices≥2 / answer 비어있음·범위·중복 / choiceExpl 길이 | **validate-content** | `validate-content.mts:100-159` |
| 세션 id 유일·비어있음 / concept.section 실존 / q·a 비어있음 / diagram edges=nodes-1 | **validate-content** | `validate-content.mts:166-221` |
| 본문 섹션 수 = meta.sections.length / 섹션 인덱스 범위 | **body.tsx 모듈평가 assert** (프리렌더 전용) | `content/chapters/ch0-2/body.tsx:22-24,40` |
| MDX 규정(코드펜스·다중행 태그·`<style>`·외부리소스·볼드 flanking) | **없음** (저자·리뷰 규율) | §5 발견 M-3 |
| `Question.id` 유일·비어있음 | **없음** | §5 발견 M-1 |
| q.scenario·q.explanation·choices·mixed 필드·diagram.prompt 비어있음 | **없음** | §5 발견 M-2 |
| section.num "01".."NN" 형식 | **없음** (비어있음·중복만) | §5 발견 L |
| 앱 ↛ content 직접 import | **없음** (docstring 규율만) | §5 발견 B |

### 4-C. 경계 침범 여부

- **"앱은 content/를 직접 import 안 함"**: ✅ **성립**. `grep` 결과 `@/content`를 import하는 파일은 `lib/content.ts` 하나뿐(+검수 전용 `app/_source`는 문자열로 읽음). 단 **규약(convention)일 뿐 기계적 강제 없음** — ESLint 설정·`no-restricted-imports`·dependency-cruiser 부재(§5 발견 B).
- **본문 네거티브 규정**: 구조화 콘텐츠 위반 **0건**. 레거시 원본은 63건(`window.` 14·`document.` 15·`<style` 19·`fonts.googleapis` 15)이나 import 금지 + `/_source` prod 제외로 **완전 격리** — 배포본 영향 0.
- **팔레트 중복(경계 존중형)**: `chapter-quiz.tsx:13-14`·`section-concepts.tsx:16-17`이 `ui.tsx`의 색값을 import하지 않고 **복제**한다 — 앱이 content/를 직접 import하지 않기 위한 의도적 중복(문서화됨). 색 드리프트 리스크는 작으나 평행 상수다.
- **registry 수동 등록 확장성**: 챕터당 import 1줄 + 배열 1항목(`content/registry.ts:26-47`). 4→28로 갈 때 손 유지 목록이지만, id 유일성·계약은 게이트가 잡는다. 자동 발견(glob) 없음 — 정적 import 요구·명시성 위해 의도적. `session`은 ch0-1만 배선됨(신규 챕터가 session.ts 추가 시 registry 배선을 잊기 쉬운 수동 footgun).

---

## 5. 건강 진단 (발견)

> 발견 21건 전수 반증 검증 완료(확정 21 / 반증 0). 심각도는 검증자가 하향 교정한 최종값. **높음 0 · 중간 3 · 낮음 18.**

### 중간 (3건 — 다음에 손볼 후보)

**M-1 · `Question.id` 유일성·비어있음을 어떤 게이트도 강제하지 않음** (`gate-coverage`)
세션 id는 `checkId()`로 중복·공백을 잡지만(`validate-content.mts:167-182,221`), 문항 id는 quiz 루프(`:96-160`)가 concept/choices/answer만 보고 id는 안 본다. 중복·빈 `q.id`가 tsc+validate+validate:test를 통과한 뒤 `chapter-quiz.tsx:241`의 React key를 충돌시키고(재조정 깨짐·dev 경고) `globalQuestionKey`도 충돌시킨다. 세션과 문항 사이 **비대칭**. → **이슈 [#77](https://github.com/padahkim/aws-reps/issues/77)** 등록(validate 게이트 하드닝).

**M-2 · 값 수준 비어있음 검사가 선택적** (`gate-coverage`)
`concept`·`section.title`·세션 `q/a`는 비어있음을 검사하나, `q.scenario`(`schema.ts:107`)·`q.explanation`(`:110`)·개별 choices·`SessionMixedItem`의 scenario/service/why/contrast(`:221`은 id만 검사)·`SessionDiagram.prompt`는 **미검사**. 빈 `explanation`은 채점 후 해설 패널이 공백으로 렌더되고(`chapter-quiz.tsx:196-200`), 빈 `scenario`는 빈 문항으로 렌더된다(`:91`) — 전부 게이트 통과. 원칙 없는 누락. → **이슈 [#77](https://github.com/padahkim/aws-reps/issues/77)** 에 M-1과 함께 포함.

**M-3 · CI가 `next build`를 돌리지 않아 body-assert·MDX 오류가 CI를 빠져나감** (`gate-coverage`)
CI는 typecheck+validate+validate:test만 실행(`ci.yml:31-35`). `validate`는 `registry`를 import하나 `body`는 lazy `import()`라 평가되지 않는다(`registry.ts:34-38`) — 섹션 수 불일치 assert·섹션 인덱스 초과·MDX hydration/파싱 오류는 **Vercel 프리뷰 빌드에서만** 검출된다. 결함 PR이 CI green으로 `develop`에 머지된 뒤 배포 빌드를 깬다. *완화*: land 스킬이 프리뷰 확인을 필수화하므로 프로덕션 전에 잡힌다(그래서 중간, 높음 아님). 의도된 결정(#28)이라 이슈화는 선택.

### 낮음 (18건 — 요지)

- **B · 콘텐츠 import 경계가 산문으로만 선언, 기계 강제 없음** (`boundary`/debt): ESLint·lint 스크립트·dependency 규칙 부재. 현재는 규율로 성립하나 미래 컴포넌트가 `content/`·`ui.tsx`를 직접 import해도 막을 게 없다. lint 규칙 1개로 값싸게 닫힘. → 이슈 [#77](https://github.com/padahkim/aws-reps/issues/77) 범위 제외(별개 lint 메커니즘) — 별도 chore 후보.
- **draft-gap 6건** (§5-대조 참조): 대부분 reasonable-simplification 또는 deferred-scope. 실제 debt는 B와 localStorage 네임스페이스 divergence(D-6).
- **robustness 4건**:
  - `[sec]` 라우트에 빈-레지스트리 자리표시자 가드 없음(`[id]`엔 있음). 레지스트리가 비면 `[sec]/page.tsx:12-19`가 `[]`를 반환해 `output:export`가 "missing generateStaticParams"로 빌드 실패. 잠재적(현재 4챕터 등록). → 2줄 수정.
  - `ProgressBar`가 pct를 clamp 안 함(`progress-bar.tsx:6`) — 두 호출부가 done≤total을 보장하나 클램프가 컴포넌트가 아닌 호출부에 있음. 잠재.
  - 모듈평가 assert가 import 배열 길이만 보고 `sections/` 디렉터리 파일 수는 안 봄 — orphan `NN.mdx`가 조용히 미렌더될 수 있음(현재 0건).
  - `globalQuestionKey`(`lib/content.ts:55`)는 **죽은 코드**(호출부 0) — 미구현 학습 루프를 위한 선행 stub.
- **legacy 4건** (전부 격리·설계상 의도): dynamodb 메모리 stale(아래), 미이행 중복쌍 3(API GW·CI/CD·메시징), 이행완료 원본 8개 잔존(검수용, manifest에 상태 마커 없음), 네거티브 규정 63건 격리.
- **section.num 형식 미강제**(`static-ceiling`): "01".."NN" 형식을 게이트가 안 봄. 문자열 일치(`:187`)로 우연히 맞물려 드리프트가 안 잡힘. → 이슈 [#77](https://github.com/padahkim/aws-reps/issues/77)에 포함.
- **ch0-1 인트로를 섹션 index 1에 렌더**(`consistency`): `INTRO_AT=1`(`ch0-1/body.tsx:25`) — 00이 동기 부여 서문이라 의도·문서화됨. 규약이 인트로 배치를 body에 위임하므로 버그 아님. 인트로-at-0을 하드코딩하는 검증기가 false-flag할 위험만.

### 메모리 정정 (§5-M-stale)

`dynamodb-guide.jsx:889`이 escape 안 한 `>`를 담는다는 **자동 메모리 노트는 stale/false**. 현재 `<span className="st">"stock &gt; :zero"</span>`로 **이미 escape됨**(커밋 `ca8634a`, 2026-07-18 `fix(content): escape a raw > in dynamodb-guide JSX`). 파일 어디에도 JSX 텍스트 내 unescaped `>` 없음. → 세션 메모리(`MEMORY.md`·`source-review-tool.md`)를 정정한다.

### 5-대조 · Draft ↔ as-built 괴리 (현행 문서화의 알맹이)

| # | DRAFT 상정 | as-built | 판정 |
|---|---|---|---|
| D-1 | `lib/contract/` 어댑터 3파일 (types/adapter/registry, 내부 AppChapterMeta/AppQuestion) — 규약 churn 흡수 | `lib/contract/` **부재**. `lib/content.ts`가 schema 타입 **직접 re-export**(평행 타입 없음), 검증은 빌드 게이트로 이관 | **합리적 단순화** — 규약이 v3 확정·단일진실이라 평행 타입은 항등 매핑 의례. 능력 손실 0 (`lib/content.ts:2-4`) |
| D-2 | `components/Quiz.tsx` + `ChapterProvider.tsx` (context로 quiz 주입, props 금지) | `components/`·context **부재**. `chapter-quiz.tsx`가 **props**로 받고 형제 섹션 페이지로 배선 | **합리적 단순화** — context는 자유-jsx 본문 "내부"에서 quiz를 읽으려던 것. v3가 퀴즈를 독립 섹션 페이지(N+1)로 올려 문제 자체가 소멸(`[sec]/page.tsx:72`) |
| D-3 | `app/review/` 오답노트 라우트 + standalone Quiz | **부재**(디렉터리·라우트·내비 없음) | **deferred-scope** — 확정 스코프이나 에픽 #53·MVP 게이트 #33 뒤. 현재 배포 의존 0 |
| D-4 | **확정된**[인간 2026-07-14] Leitner 상자·`dva.progress.v1`/`dva.review.v1`·attempts/correct/box/dueAt/graduatedAt·숙달 5상태·due·약점개념·도메인 커버리지 대시보드·`lib/progress/store.ts` | **전부 미구현**. `lib/progress.ts` 읽음추적만, 퀴즈 결과 비저장 | **deferred-scope** (확정 = 미투기적 committed work). 유일한 선행 hook `globalQuestionKey`는 죽은 stub |
| D-5 | 3대시보드 지표(전체 진행률·오늘의 복습·도메인 커버리지) | 홈은 챕터 목록 + 챕터별 읽음 바만(`app/page.tsx:42-63`) | **deferred-scope** (D-4 종속) |
| D-6 | 네임스페이스 `dva.*`, 2키, `{chapters:{visitedAt}}`, 내부 `v` 필드 + read-repair | `aws-reps.read.v1`, 1키, `{[id]:number[]}`, 버전 필드 없음 | **debt(낮음)** — 확정 §4 스펙과 이름·모델 불일치. 학습 루프·계정 도입 시 1회성 재조정 필요(단일 사용자·저장 이력 0이라 비용 근소) |
| D-7 | 완료(ch) ⇔ 열람 ∧ finalQ 마지막시도 ≥80% (D7) | 방문=읽음, 퀴즈 페이지 방문만으로 진도 100% 도달(`[sec]/page.tsx:79`) | **deferred-scope** — 의도된 MVP 단순화(#7). `progress.ts`가 "읽음 진도"로 정직히 라벨. 확정 완료 조건과의 라이브 divergence이나 §2-3 착수 시 재조정 |

---

## 6. 루브릭 점수 (재실행 시 추세 비교용 — 항목·척도 고정)

> 척도: 1=심각한 결손·릴리즈 차단 / 2=동작하나 큰 부채 / 3=동작·알려진 부채 수용 가능 / 4=견고·소소한 개선점 / 5=모범.

| 항목 | 점수 | 근거 (대표 `파일:라인`) |
|---|---|---|
| **콘텐츠 파이프라인** | **4** | 2계층 분리 깔끔·격리 완전, MDX 60파일 100% 준수, 구조화 위반 0. 감점 = MDX 무게이트(저자규율) + 수동 registry(4→28 손유지). `content/registry.ts:26-47`, 60 mdx 스캔 0위반 |
| **상태·진도** | **2** | 읽음추적은 동작·hydration 안전·파싱강건. 그러나 **확정 학습루프(Leitner/시도/숙달) 전부 미구현**, 퀴즈결과 소실, 네임스페이스·완료조건 divergence, 계정 귀속 경로 0. `lib/progress.ts:10-12`, `chapter-quiz.tsx:38-39` |
| **빌드·툴링·하네스** | **3** | validate 계약 견고 + 회귀픽스처 + Node24 CI + git_guard. 알려진 부채 = 게이트 커버리지 구멍(M-1·M-2·M-3), 형식·경계 무게이트. `validate-content.mts`, `ci.yml:31-35` |
| **규약·경계 일관성** | **4** | schema 단일진실 준수·평행타입 0, 경계 성립, draft 괴리 관리 양호(의도·문서화). 감점 = 경계 기계 강제 부재(발견 B) + 일부 불변식 무강제. `lib/content.ts:1-19`, 구조화 0위반 |
| **확장성·서버 준비도** | **3** | SSG로 동작·전환지점 국소화(config 1줄)·SSR 호환 라우팅. 감점 = 서버 스캐폴딩 0 + 3에픽(인증·DB·AI) 순net-new 대량 + 로컬→계정 마이그레이션. `next.config.ts:4-10`, `lib/progress.ts` |
| **강건성** | **4** | 빈 quiz·session 없음·파싱실패·notFound·done>total·복수정답 전부 처리. 감점 = `[sec]` 빈-레지스트리 비대칭 + ProgressBar 무clamp(둘 다 잠재). `lib/progress.ts:14-27`, `lib/content.ts:30-39` |
| **총점** | **3.3** | 단순 평균 (4+2+3+4+3+4)/6 = 20/6 |

**가장 낮은 2개 = 다음 우선순위**: ① **상태·진도(2)** — 확정 설계 대비 가장 뒤처지고 재조정 debt(D-6·D-7)를 안고 있으나, 정면 해소는 학습루프 에픽(#53) 타이밍에 종속. ② **빌드·툴링·하네스(3)** — 지금 값싸게 올릴 수 있는 축(validate 커버리지 M-1·M-2, 경계 lint B). 즉 **근래 손볼 것은 하네스(게이트 하드닝), 큰 재작업은 상태·진도(에픽)** 로 갈린다.

---

## 7. 확장 지점

### 7-A. static → server 전환

- **전환 트리거**: 인증·DB·AI 채점 중 하나라도 서버 런타임을 요구하는 순간. `output: "export"` 제거가 관문(`next.config.ts:8` 주석이 이미 지시).
- **제거 시 깨지는/바뀌는 것**: ① 배포 모델(정적 호스팅 → SSR/ISR, Vercel 함수). ② `/_source` gen-route 우회(정적 export 전용 Next 버그 회피)가 불필요해짐. ③ `dynamicParams=false`+`generateStaticParams` 패턴은 유지 가능하나 ISR/SSR 옵션이 열림. ④ 진도가 localStorage(기기 로컬) → 서버 DB(계정 귀속)로 이관 필요.
- **국소성**: 콘텐츠 경계(`lib/content.ts`)·진도 모듈(`lib/progress.ts`)이 각각 단일 파일이라 전환 표면이 좁다 — 진도는 한 모듈만 서버 어댑터로 교체하면 된다.

### 7-B. 에픽 준비도

- **인증**: 진도 모델 마이그레이션이 핵심 — 현행 `aws-reps.read.v1`(익명·기기)를 계정 귀속으로 옮기고, 확정 §4-1 스펙(`dva.progress.v1`/`dva.review.v1`)과 네임스페이스·모델을 재조정해야 한다(발견 D-6). 저장 이력이 0이라 마이그레이션 자체는 근소하나 **불가피**하다. `globalQuestionKey`(죽은 stub)가 그 gk 합성 지점을 예약해 둠.
- **유저 기능(학습 루프)**: 확정 설계(Leitner·오답노트·숙달·대시보드)가 통째로 미구현(D-3·D-4·D-5). 규약(`schema.ts`)은 이미 세션 데이터 타입을 확정해 뒀으나, **런타임 상태 계층은 백지**다. 이게 상태·진도 축을 2점으로 누른 주 원인.
- **AI 채점**: 서버/데이터 계층이 전제. 현 구조에 해당 스캐폴딩 0 — output:export 해제 + Route Handler + (문항·답안·채점) 데이터 계층 신설이 필요. `Question`·`SessionConcept` 규약은 채점 대상 데이터 형태를 이미 제공.

### 7-C. MVP(Phase1~4) 결손 (구조만 — 콘텐츠 분량·품질은 범위 외)

- **콘텐츠 세트**: ✅ **구조적 완비**. 릴리즈 1 = ch0-1·ch0-2·1-1·1-2 (CURRICULUM §5) = 등록된 4챕터와 정확히 일치.
- **앱 셸**: ✅ 커리큘럼 내비·챕터 로더·섹션 퀴즈 엔진(즉시 채점·해설·복수정답)·읽음 진도 동작.
- **결손**: CURRICULUM §4-3의 MVP 요구 **"오답 노트 기록·재출제"**가 as-built에 없음(D-3·D-4) — 단 이는 프로젝트 현행 정책상 인출학습 에픽(#53)으로 MVP 게이트 뒤로 밀려 있어(메모리: "AI 채점은 MVP 게이트·#33 후"), **범위 정의의 문제이지 미완 결함이 아니다**. 순수 구조 관점의 릴리즈 차단 결손은 **없음**(높음 발견 0).
- **하네스 하드닝**(선택, 릴리즈 전 권장): 게이트 커버리지(이슈 [#77](https://github.com/padahkim/aws-reps/issues/77) — M-1·M-2·section.num)와 경계 lint(발견 B)는 값싸고 회귀를 막는다 — 잔여 24챕터(#29) 저작이 시작되면 이 백스톱의 가치가 커진다.

---

## 부록 · 검증 방법

이 문서는 읽기 전용 진단 후, 5축(챕터 계약 준수·MDX 규정·레거시 감사·draft 괴리·강건성/게이트) 심층 리더를 병렬 실행하고 각 발견을 코드에 대해 **반증 검증**(adversarial verify)해 작성했다 — 발견 21건 전수 확정, 반증 0, 심각도 다수 하향 교정. 모든 `파일:라인`은 관측 시점(24f7625 계열) 기준이며, 재점검 시 §6 루브릭을 같은 항목·척도로 재채점하면 점수 추세가 구조 개선/퇴행을 드러낸다.
