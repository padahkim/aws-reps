# CONTRACT.md — v1 규약 이관 초안 〔축1 제안 · 정본 아님 · 규약 세션 인계용〕

> 🚩 **소유권 고지 — 이 파일은 정본이 아니다.** 정본 규약은 **규약(스키마) 세션이 저작**한다. 이 문서는 **축1(학습설계 리뷰어)이 규약 세션에 넘기는 이관 초안**(`SCHEMA_FEEDBACK_AXIS1 §E/§F`를 구현 형태로 정리한 것)이며, 규약 세션이 이어받아 정본화·대체한다. 축1은 **[A] 항목(학습설계 필드·생성 규칙)에만** 확정 권한이 있다.
> ⚠️ **DRAFT — 미확정.** 확정 절차: 규약 세션이 아래 **[B]** 항목(모듈 구조·명명·로딩·본문 규정 = CONTRACT_PREWORK 기술 결정)을 확정 → 이 배너 제거 → 정본.
> **[A] = 축1 §E-4 인간 확정(2026-07-14).** **[B] = `docs/CONTRACT_PREWORK.md §1~2` 권장, 규약 세션 기술 확정 대기.**
> 출처: `docs/SCHEMA_FEEDBACK_AXIS1.md §F`(A) · `docs/CONTRACT_PREWORK.md`(B) · `docs/LEARNING_LOOP_DRAFT.md §4-2`(앱 소비 계약) · v0 = RUBRIC §3 / CURRICULUM §3.

---

## 0. 지위 · 범위
- **소유권**: 정본 저작 = **규약 세션**. 이 파일은 **축1 제안 이관 초안**(§E/§F 구현 정리)으로, 규약 세션이 정본화/대체 대상이다. 축1이 임의로 정본화하지 않는다.
- 이 규약은 `/content`의 **챕터 모듈이 지켜야 할 형식**이다. 앱은 이 규약이 export하는 것만 소비한다(셸–콘텐츠 분리, PLAYBOOK §3).
- 확정 상태: **A(학습설계 필드·생성 규칙) 확정 / B(기술 구조) 미확정.** 신규모드 전환(RUBRIC §5-6)은 이 문서 정본화 이후.
- v0 대비 순수 신규 필드는 **3개뿐**(`type`·`choiceExplanations`·`fixedChoiceOrder?`). 나머지는 기존 필드 활용 + 생성 규칙(부록 A).

## 1. 모듈 구조 〔B — CONTRACT_PREWORK §2-0/§2-1〕
```
content/chapters/{id}/
  meta.ts    ← chapterMeta + quiz  (순수 데이터, "use client" 금지, 서버 안전)
  body.jsx   ← "use client" + export default 본문 (자유 jsx)
```
- **근거**: RSC 제약 — `meta`는 서버 소비 필수(`generateStaticParams`·내비·`generateMetadata`)이나 `body`는 인출 인터랙션으로 클라이언트 필수. 단일 파일이면 충돌(§2-0). 2파일 분리로 서버/클라 경계 = 파일 경계 → 구조 게이트를 grep으로 검사 가능.
- **로딩**〔B §2-3〕: `content/registry.ts`가 `meta.ts` 전부 정적 import + `body`는 `next/dynamic`. `generateStaticParams`는 레지스트리 키에서 파생.

## 2. `chapterMeta` (meta.ts) 〔A 필드 + B 명명〕
```ts
export const chapterMeta = {
  id: string,                       // 챕터 식별자 (예: "ch1-2"). ★안정성 요구: 개명 시 진도 마이그레이션(§6)
  phase: 0|1|2|3|4|5,
  title: string,
  domain: "개발"|"보안"|"배포"|"트러블슈팅",
  examWeight: number,
  prerequisites: string[],          // 〔A 확정 #4〕 L6 강제 근거. 각 개념 블록이 이 중 1개+ 를 본문에서 명시 인용
  // chapters?: string[],           // 〔B §1-D-4〕 복수 챕터 매핑(레거시 1:N). 기술 확정 대상
};
```
- 명명 `chapterMeta`(vs `meta`)는 〔B §2-2〕: grep 유일성·게이트 기계화 이유로 권장. 기술 확정 대상.

## 3. `quiz` (meta.ts) — `Question` 〔A ✅ 확정〕
```ts
type Question = {
  id: string,                       // 챕터-로컬 "q1". 전역키는 앱 어댑터가 `${chapterMeta.id}:${id}` 합성(규약 무변경)
  type: "mc",                       // 〔확정 #3〕 v1은 mc(객관식)만 정식 — 단일·복수정답 모두. recall/flashcard는 v1.1(§8)
  scope: "mini" | "final",          // 인출 시점은 본문 <Quiz> 배치 위치가 표현
  concept: string[],                // 〔확정 #4-b〕 복수, 최소 1. 앱 약점/숙달 계산이 소비(§6). 없으면 챕터 id 폴백
  scenario: string,
  choices: string[],                // 〔확정 #8, 2026-07-14〕 선택지 배열 — 길이 가변(DVA "5개 중 2개" 흔함). 최소 4 권장, 레거시 3지선다는 오답 1개 보충
  answer: number[],                 // 정답 인덱스 배열 — 복수정답 지원("N개 고르기")
  explanation: string,              // 정답 근거 전용
  choiceExplanations: string[],     // 〔확정 #1 — 신규모드 의무〕 choices와 1:1 동일 길이. 선택지별 "왜 틀렸나 + 어떤 상황이면 정답(wouldBeCorrectWhen)"
  fixedChoiceOrder?: boolean,       // 〔확정 #4-b〕 optional. true면 셔플 금지(순서 참조 문항 "A와 B 모두" 류)
};

export const quiz: Question[];      // 〔확정 #4-b〕 빈 배열 [] 적법. 앱은 빈 quiz에 강건해야 함
```

## 4. 본문 (body.jsx) 〔B〕
### 4-1. 문항 배치 API 〔B §2-5〕
```tsx
<Quiz ids={["q1","q2"]} />   // 챕터-로컬 id 참조 (기본형, grep 가능)
<Quiz scope="final" />       // quiz[].scope 필터 (ids와 상호배타)
```
문항 데이터는 props가 아니라 ChapterProvider 컨텍스트에서 조회 → 본문–문항 결합은 문자열 id 참조뿐. 채점·진도·오답노트는 `<Quiz>` 내부(앱 셸).

### 4-2. 본문 네거티브 규정 〔B §1-D-3 — 신규모드 게이트〕
본문은 자유 jsx이나 아래를 **금지**한다(앱 셸 침범·오염 방지):
- ❌ 자체 내비게이션/페이저/사이드바 (내비는 앱 셸 소관)
- ❌ 전역 셀렉터 스타일(`<style>` 내 `table`, `body` 등) — 다른 챕터 오염
- ❌ `document`/`window` 직접 접근·스크롤 제어
- ❌ 외부 리소스(폰트 CDN 등) 로드
- ❌ 진도/완료 상태 자체 집계(앱 진도와 이중 장부)

## 5. 신규 콘텐츠 생성 규칙 〔A ✅ 확정 — 구조 게이트 후보〕
1. **모든 mc → `choiceExplanations`를 `choices`와 동수로 완비**(확정 #1). 미비 시 반려.
2. **모든 개념 블록 → `chapterMeta.prerequisites` 챕터 1개+ 명시 인용**(확정 #4, L6=2). 최선두 챕터(앵커 A4)는 예외.
3. **recall 소재 → mc 변환 + 본문 인출 카드(채점 X)로 병존**(확정 #3).
4. **모든 섹션 → miniQuiz ≥ 1**. 빈 quiz는 레거시 잔존 한정.
5. **예시는 개념 블록 내부 결합**(L3 역설 방지).
6. **문항 소재 = 기존 콜아웃**(시험포인트/결정표/N문형) 직접 승격.

## 6. 앱 소비 계약 (LEARNING_LOOP §4-2) — 참조
앱이 규약에서 소비하는 **최소 면**(이 표 밖 의존 금지):

| 의존 지점 | 소비 요소 | 저장 | v1 변경 영향 |
|---|---|---|---|
| 문항 식별 | `chapterMeta.id` + `quiz[].id` (gk 합성) | **저장(유일 하드 의존)** | id 개명 = 진도 마이그레이션 |
| 챕터 완료 | `quiz[].scope==="final"` | 안 함 | 어댑터 필터 1줄 |
| 약점 개념 | `quiz[].concept` (없으면 챕터 id 폴백) | 안 함 | 런타임 조인, 저장 무영향 |
| 커버리지 | `chapterMeta.domain` | 안 함 | 동상 |
| 셔플 | `choices`+`answer`(+`fixedChoiceOrder?`) | 안 함 | 렌더 매핑뿐 |

→ **저장 데이터가 깨지는 경로는 id 개명 하나.** "문항에 id·정답·해설이 있다"는 가정만 성립하면 유효.

## 7. 신규모드 0차 구조 게이트 (RUBRIC §7-1 신규) 〔A+B〕
하나라도 위반 시 즉시 반려:
- **G1**〔B〕 `export const chapterMeta` + `export const quiz` + `export default` 존재(2파일 구조)
- **G2**〔A〕 모든 mc 문항에 `choiceExplanations`를 `choices`와 동수 완비 (해설 없는 퀴즈 30%↑ 금지)
- **G3**〔B〕 본문 네거티브 규정(§4-2) 위반 없음
- **G4**〔A〕 각 개념 블록에 `prerequisites` 인용 존재(최선두 챕터 예외)
- **G5**〔A〕 담당 범위 밖 주제가 분량 차지하지 않음(L5)

## 8. 미확정 · v1.1
- `freq`: 섹션 정식화 후 `section.freq`(확정 #4-b). 섹션 개념은 LEARNING_LOOP §2-3 유보.
- `type` 확장(`recall`/`flashcard`/`selfcheck`) + 자가보고 채점 UX — **v1.1**.
- `chapters?[]` 복수 매핑, `chapterMeta` vs `meta` 명명, 레지스트리 codegen — 〔B〕 기술 확정.

---

## 부록 A. v0 → v1 변경 요약
| 요소 | v0 | v1 | 확정 |
|---|---|---|---|
| 모듈 | 단일 jsx (meta+quiz+default) | 2파일(meta.ts + body.jsx) | 〔B〕 |
| `type` | 없음(4지선다 암묵) | `"mc"` 고정(신규) | A ✅ |
| `choices`/`choiceExplanations` | `[4]` 고정(암묵) | `string[]` 가변 — 복수정답·5지("N개 고르기") 대응 | A ✅ #8 |
| `concept` | 단수 문자열 | `string[]` | A ✅ |
| 오답 해설 | `explanation` 겸용 | `choiceExplanations`(신규·의무) + `explanation`(정답 근거 전용) | A ✅ |
| 셔플 예외 | 없음 | `fixedChoiceOrder?`(신규·optional) | A ✅ |
| 빈 quiz | 미정 | 적법 명문화 | A ✅ |
| L6 | 없음 | `prerequisites` 활용 생성 규칙 | A ✅ |
| 명명·로딩·본문규정 | 미정 | §1·§4·§7 | 〔B〕 미확정 |

> **이관 지침(인간)**: 이 파일을 검토해 [B] 항목을 CONTRACT_PREWORK와 최종 대조·확정한 뒤 DRAFT 배너를 제거하면 정본이 된다. [A] 항목은 축1 확정분이므로 변경 시 SCHEMA_FEEDBACK_AXIS1 §E-4 재개정 필요.
> ✅ **choices 가변 통일 완료(2026-07-14, 확정 #8)**: `CONTRACT_PREWORK §2-4`도 `choices`/`choiceExplanations`를 `string[]`로 갱신함 — 이 §3와 일치. DVA "5개 중 2개 고르기"(복수정답·5지) 문항 표현 가능.
