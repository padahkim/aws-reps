/**
 * 학습 진도 저장소 `dva.progress.v1` 의 **순수 층** — 저장된 값의 형(型)과 그 값을 다루는
 * 규칙만 있다: 읽을 때의 검사(read-repair)와 쓸 때의 누적(`applyAttempt`).
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §4.
 *
 * **왜 `records.ts` 에서 갈라져 나왔나** (#214): 저 파일은 `"use client"` + react import 라
 * node 가 부를 수 없고, 그래서 CI 가 **한 줄도 실행하지 않았다**. 그런데 PR #202 에서 자동
 * 리뷰가 반복해 낸 결함은 전부 이쪽 몫이었다 — *저장된 값을 읽어 다른 값으로 바꾸는 과정*의
 * 오류. 타입은 맞고 화면도 멀쩡한데 결과값만 틀리는 종류라 typecheck 도 브라우저도 못 잡는다.
 * 게다가 여기는 화면 깜빡임이 아니라 **학습 이력의 영속 계층**이라, 틀린 값이 조용히 저장되고
 * 그 위에 다음 채점이 누적된다. 그래서 `window` 를 모르는 순수 함수만 이 파일에 모아
 * `records-core.test.ts`(`npm run progress:test`)가 CI 에서 돌린다.
 *
 * **경계**: 브라우저 붙임(localStorage 읽기·쓰기, storage 이벤트, `useQuestionRecords`)은
 * `records.ts` 에 남는다. 공개 API(`loadProgress`·`recordQuestionAttempt`·`useQuestionRecords`)
 * 도 그쪽이 정본이다 — 앱은 이 파일을 직접 import 하지 않는다.
 *
 * 저장하는 것은 사실뿐이다 — 시도 횟수·정오·시각. 점수·정답률·약점 개념처럼 파생 가능한
 * 값은 저장하지 않고 읽는 쪽이 콘텐츠와 런타임 조인해서 낸다(§4-1). 목차의 "8/11" 배지도
 * 저장된 점수가 아니라 `lastResult` 집계다 — 그래서 재응시가 자동으로 반영된다.
 */

/** 문항 하나의 시도 기록 (§4-1). 알 수 없는 필드는 보존되므로 인덱스 시그니처가 열려 있다. */
export interface QuestionRecord {
  attempts: number;                 // 채점 횟수 (재응시 누적)
  correct: number;                  // 그중 정답 횟수
  lastResult: "pass" | "fail";      // 마지막 채점 결과 — 배지·완료 판정이 보는 값 (§2-3)
  lastAt: string;                   // 마지막 채점 시각 (ISO 8601)
  /**
   * 첫 채점의 결과 — 한 번 쓰이면 다시 바뀌지 않는다. 설계 §4-1 스키마에 없는 필드를 더한
   * 것이다 (PR #202 → 사용자 결정): §2-1 이 숙달을 "첫 시도 정답"으로 정의하는데, 나머지
   * 네 필드로는 재응시 뒤에 그 사실을 복원할 방법이 없다. 판정을 만드는 건 #86 잔여지만
   * **데이터는 지금부터 쌓이므로** 그때 가서는 소급이 불가능하다.
   * optional 인 이유: 이 필드가 생기기 전에 저장된 기록이 있을 수 있다 (§4-3 read-repair).
   */
  firstResult?: "pass" | "fail";
  [extra: string]: unknown;
}

/**
 * 챕터 하나의 열람·완료 스냅샷 (§4-1). 아직 **쓰기 경로가 없다** — 열람 기록과 완료 배지는
 * #86 잔여 범위다. 그래도 형을 여기 두는 이유: 이 파일이 키의 구조를 소유하므로 read-repair
 * 가 이 자리를 알아야 남의 기록을 지우지 않는다.
 */
export interface ChapterRecord {
  visitedAt: string;
  completedAt?: string;
  [extra: string]: unknown;
}

/** 이 빌드가 아는 마이너 버전 — 메이저는 키 접미 `.v1` 이다 (§4-3). */
export const V = 1;

export interface Progress {
  v: number;                                   // 마이너(호환 확장) 버전. 모르는 상위 버전은 낮추지 않는다
  chapters: Record<string, ChapterRecord>;
  questions: Record<string, QuestionRecord>;   // 키 = 전역 문항 키 (keys.ts)
  [extra: string]: unknown;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * 정규 ISO 순간(`new Date().toISOString()` 이 내는 그 형식)인가.
 *
 * `Date.parse` 가 유한한지만 보면 부족하다 (PR #202 Codex P2): `Date.parse("0")` 은 2000년으로
 * 통과하고, `"2024-02-30"` 은 존재하지 않는 날짜인데 조용히 3월 1일이 된다. 게다가 규격 밖
 * 문자열의 해석은 **브라우저마다 다르다** — 같은 저장값이 기기마다 다른 시각이 되는 셈이다.
 * 그 값들이 통과하면 간격 반복(§1-2 dueAt)과 연체 정렬(§1-3)이 날조된 시각 위에서 돈다.
 *
 * 판정은 **왕복 동일성**으로 한다: 파싱한 순간을 다시 직렬화해 원본과 같아야 한다. 이 저장소는
 * `toISOString()` 으로만 쓰므로 그 형식이 곧 정본이고, 달력값 검증도 여기에 딸려 온다
 * (2024-02-30 은 3월 1일로 되돌아와 불일치한다). 형식이 다른 값은 손상으로 보고 집계에서
 * 뺀다 — 그 문항 기록 하나만 버리고, 삭제는 다음 저장 때 반영된다 (repairQuestion 참조).
 */
export function isIsoInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const t = Date.parse(value);
  return Number.isFinite(t) && new Date(t).toISOString() === value;
}

/** 0 이상의 정수인가 — 횟수 필드의 유일한 형식 조건. */
export function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/**
 * 문항 기록 하나를 검사한다. **말이 되면 그대로 두고, 아니면 버린다** — 고쳐 쓰지 않는다.
 *
 * 왜 고치지 않나 (2026-08-03 사용자 결정, PR #202): 앞뒤 안 맞는 값을 살려내려면 "응시 1회에
 * 맞힘 3회면 둘 중 어느 쪽이 진짜인가" 같은 판단 규칙이 필요하고, 그 규칙은 자동 리뷰가
 * 파고들 때마다 계속 늘어난다(실제로 그렇게 됐다). 그런데 **이 저장소에는 그런 값을 만드는
 * 경로가 없다** — 쓰는 곳이 recordQuestionAttempt 하나뿐이고 항상 앞뒤 맞는 값만 쓴다.
 * 그런 기록이 있다면 사람이 브라우저 저장소를 손으로 고친 것이고, 그건 살려낼 이력이 아니다.
 *
 * **버리는 단위는 문항 하나**다. 저장소 전체를 비우면 한 글자 깨진 것 때문에 전 챕터 진도가
 * 날아간다. 실제 삭제는 다음 저장 때 일어난다(로드는 집계에서 빼기만 한다).
 *
 * 여기서 하는 유일한 보정은 §4-3 이 말하는 "누락 필드 기본값 주입"이다 — 시도가 1회면 첫
 * 결과가 곧 마지막 결과이므로 그 자리를 채운다 (`firstResult` 가 생기기 전에 저장된 기록의
 * 이행 경로). 알 수 없는 필드는 그대로 통과시킨다.
 */
export function repairQuestion(raw: unknown): QuestionRecord | undefined {
  if (!isRecord(raw)) return undefined;
  const lastResult =
    raw.lastResult === "pass" || raw.lastResult === "fail" ? raw.lastResult : undefined;
  const firstResult =
    raw.firstResult === "pass" || raw.firstResult === "fail" ? raw.firstResult : undefined;
  if (lastResult === undefined) return undefined;
  if (raw.firstResult !== undefined && firstResult === undefined) return undefined;
  if (!isIsoInstant(raw.lastAt)) return undefined;
  if (!isCount(raw.attempts) || raw.attempts < 1) return undefined;
  if (!isCount(raw.correct) || raw.correct > raw.attempts) return undefined;
  // 시도가 1회면 양 끝이 같은 시도다 — 서로 다르면 있을 수 없는 기록이다
  if (raw.attempts === 1 && firstResult !== undefined && firstResult !== lastResult) return undefined;
  return {
    ...raw,   // 알 수 없는 필드는 그대로 통과 (§4-3 — 구버전 세션이 신버전 필드를 지우지 않도록)
    attempts: raw.attempts,
    correct: raw.correct,
    lastResult,
    lastAt: raw.lastAt,
    firstResult: firstResult ?? (raw.attempts === 1 ? lastResult : undefined),
  };
}

/** 챕터 기록 하나를 고친다. 열람 시각이 없으면 스냅샷이 아니므로 버린다. */
export function repairChapter(raw: unknown): ChapterRecord | undefined {
  if (!isRecord(raw) || typeof raw.visitedAt !== "string") return undefined;
  const completedAt = typeof raw.completedAt === "string" ? raw.completedAt : undefined;
  return { ...raw, visitedAt: raw.visitedAt, completedAt };
}

/**
 * 저장된 객체를 현재 구조로 고친다 (§4-3) — 누락 필드는 기본값, 미지 필드는 보존.
 *
 * `v` 는 **읽어서 분기하되 낮추지 않는다** (PR #202 Codex P2): 내부 v 는 호환 확장 버전이라
 * 상위 v 의 데이터도 이 구조로 읽히지만, 그렇다고 v 를 1로 되찍으면 신버전이 이미 마이그레이션한
 * 데이터를 구버전 탭이 "미마이그레이션"으로 되돌려 표시한다. 모르는 상위 버전은 그대로 통과시킨다.
 */
export function repair(raw: Record<string, unknown>): Progress {
  const chapters: Record<string, ChapterRecord> = {};
  if (isRecord(raw.chapters)) {
    for (const [id, value] of Object.entries(raw.chapters)) {
      const fixed = repairChapter(value);
      if (fixed) chapters[id] = fixed;
    }
  }
  const questions: Record<string, QuestionRecord> = {};
  if (isRecord(raw.questions)) {
    for (const [gk, value] of Object.entries(raw.questions)) {
      const fixed = repairQuestion(value);
      if (fixed) questions[gk] = fixed;
    }
  }
  const v = typeof raw.v === "number" && Number.isInteger(raw.v) && raw.v > V ? raw.v : V;
  return { ...raw, v, chapters, questions };
}

/**
 * 채점 사실 하나를 얹은 **새 진도**를 돌려준다 — 쓰기 경로의 유일한 계산이다.
 * 입력 `data` 는 건드리지 않는다(호출부가 읽은 스냅샷을 그대로 들고 있어도 안전하도록).
 *
 * 재응시("다시 풀기")도 그대로 한 번 더 기록한다: `attempts` 는 누적되고 `lastResult` 는
 * 덮어써진다. 설계상 챕터 안의 즉시 재도전은 막지 않되 상자 승급에는 쓰지 않는다(§1-2) —
 * 그 판단은 이 기록을 읽는 쪽(#86 잔여)이 하고, 여기서는 사실만 남긴다.
 *
 * `data` 는 **`repair` 를 통과한 값**이어야 한다 — 그래야 `prev` 가 말이 되는 기록임이 보장되고,
 * 말이 안 되던 이웃 기록의 삭제도 이 반환값을 저장할 때 함께 반영된다.
 * `at` 은 `new Date().toISOString()` 형식이어야 한다 (isIsoInstant 참조) — 아니면 다음 로드가
 * 이 기록을 버린다.
 */
export function applyAttempt(data: Progress, gk: string, passed: boolean, at: string): Progress {
  const result = passed ? "pass" : "fail";
  const prev = data.questions[gk];
  return {
    ...data,
    questions: {
      ...data.questions,
      [gk]: {
        ...prev,
        attempts: (prev?.attempts ?? 0) + 1,
        correct: (prev?.correct ?? 0) + (passed ? 1 : 0),
        lastResult: result,
        lastAt: at,
        // 이력이 없을 때만 이번 결과가 첫 결과다. 이력은 있는데 첫 결과를 모르는 경우
        // (firstResult 가 생기기 전에 저장된 기록)는 **모르는 채로 둔다** — 나중 시도를 첫 시도로
        // 적으면 #86 의 숙달 판정("첫 시도 정답")이 뒤집힌다
        firstResult: prev ? prev.firstResult : result,
      },
    },
  };
}
