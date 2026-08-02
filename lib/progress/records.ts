"use client";

import { useEffect, useState } from "react";
import { globalQuestionKey, stableQuestionId, type QuestionIdentity } from "./keys";

/**
 * 학습 진도 저장소 `dva.progress.v1` (#66 — 부모 에픽 #86의 첫 쓰기 경로).
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §4. **이 키의 쓰기는 전부 이 파일을 거친다**(§4-1).
 *
 * 저장하는 것은 사실뿐이다 — 시도 횟수·정오·시각. 점수·정답률·약점 개념처럼 파생 가능한
 * 값은 저장하지 않고 읽는 쪽이 콘텐츠와 런타임 조인해서 낸다(§4-1). 목차의 "8/11" 배지도
 * 저장된 점수가 아니라 `lastResult` 집계다 — 그래서 재응시가 자동으로 반영된다.
 *
 * 읽음 진도(`aws-reps.read.v1`)는 별개 키·별개 파일이다(lib/progress.ts). 강건성 규칙은
 * 그쪽과 같다: SSG 라 초기 렌더는 항상 빈 값이고(useEffect 로 채운다), 저장 실패는 조용히
 * 무시한다(프라이빗 모드에서도 학습 자체는 굴러가야 한다).
 */
const KEY = "dva.progress.v1";

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
 * 챕터 하나의 열람·완료 스냅샷 (§4-1). 이 이슈에는 **쓰기 경로가 없다** — 열람 기록과
 * 완료 배지는 #86 잔여 범위다. 그래도 형을 여기 두는 이유: 이 파일이 키의 구조를 소유하므로
 * read-repair 가 이 자리를 알아야 남의 기록을 지우지 않는다.
 */
export interface ChapterRecord {
  visitedAt: string;
  completedAt?: string;
  [extra: string]: unknown;
}

/** 이 빌드가 아는 마이너 버전 — 메이저는 키 접미 `.v1` 이다 (§4-3). */
const V = 1;

export interface Progress {
  v: number;                                   // 마이너(호환 확장) 버전. 모르는 상위 버전은 낮추지 않는다
  chapters: Record<string, ChapterRecord>;
  questions: Record<string, QuestionRecord>;   // 키 = 전역 문항 키 (keys.ts)
  [extra: string]: unknown;                    // 미지 필드 보존 (§4-3)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function emptyProgress(): Progress {
  return { v: V, chapters: {}, questions: {} };
}

/** 0 이상의 정수로 정규화. 숫자가 아니거나 음수·NaN 이면 fallback. */
function count(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

/**
 * 문항 기록 하나를 규약대로 고친다. 시도 사실을 복원할 수 없을 만큼 망가졌으면 undefined —
 * 그 항목은 **집계에서만** 빠진다 (저장에서 지우지는 않는다 — mergeOverRaw 참조).
 *
 * 누계(attempts·correct)와 마지막 결과가 모순이면 **lastResult 를 정본으로 삼는다** (PR #202
 * Codex P2): 배지·완료 판정이 직접 읽는 값이 lastResult 라, 여기서 어긋난 채 두면 화면이
 * 말하는 것과 누계가 따로 논다. 게다가 이후 채점이 이 값들을 그대로 증가시켜 모순이 굳는다.
 */
function repairQuestion(raw: unknown): QuestionRecord | undefined {
  if (!isRecord(raw)) return undefined;
  const lastResult = raw.lastResult === "pass" || raw.lastResult === "fail" ? raw.lastResult : undefined;
  // lastAt 은 파싱 가능한 시각이어야 한다 — 문자열이기만 하면 통과시키면 간격 반복(§1-2 dueAt)과
  // 연체 정렬(§1-3)이 이 값을 Date 로 읽는 순간 조용히 깨진다
  if (lastResult === undefined || typeof raw.lastAt !== "string" || !Number.isFinite(Date.parse(raw.lastAt))) {
    return undefined;
  }
  // lastResult 가 있다는 건 최소 1회 채점됐다는 뜻. correct 가 살아 있으면 attempts 는 최소
  // 그만큼이다 — 반대로 잡으면 멀쩡한 correct 를 클램프가 깎아 버린다
  const attempts = Math.max(count(raw.attempts, 1), count(raw.correct, 0), 1);
  let correct = Math.min(count(raw.correct, 0), attempts);
  if (lastResult === "pass" && correct === 0) correct = 1;
  if (lastResult === "fail" && correct === attempts) correct = attempts - 1;
  // firstResult 가 없는 기록 중 시도가 1회뿐인 것은 첫 결과 = 마지막 결과다 — 그만큼은
  // 복원해 준다 (§4-3 "누락 필드 기본값 주입"). 2회 이상이면 복원할 근거가 없어 비워 둔다.
  const firstResult =
    raw.firstResult === "pass" || raw.firstResult === "fail"
      ? raw.firstResult
      : attempts === 1
        ? lastResult
        : undefined;
  return {
    ...raw,   // 알 수 없는 필드는 그대로 통과 (§4-3 — 구버전 세션이 신버전 필드를 지우지 않도록)
    attempts,
    correct,
    lastResult,
    lastAt: raw.lastAt,
    firstResult,
  };
}

/** 챕터 기록 하나를 고친다. 열람 시각이 없으면 스냅샷이 아니므로 버린다. */
function repairChapter(raw: unknown): ChapterRecord | undefined {
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
function repair(raw: Record<string, unknown>): Progress {
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

/** 저장된 원본을 파싱만 해서 돌려준다. 못 읽으면 빈 객체 — 서버·파싱 실패·접근 불가 공통. */
function readRaw(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const text = window.localStorage.getItem(KEY);
    if (text === null) return {};
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? parsed : {};
  } catch {
    // 파싱 실패·스토리지 접근 불가(프라이빗 모드 등) — lib/progress.ts 와 같은 처리
    return {};
  }
}

/** 저장소 전체를 읽는다. 못 읽거나 망가졌으면 그만큼 "진도 없음"으로 강건하게. */
export function loadProgress(): Progress {
  return repair(readRaw());
}

/**
 * 원본 위에 고친 값을 얹는다 — **읽기가 삭제가 되지 않게 하는 자리다**.
 * `repair` 는 못 고친 항목을 집계에서 빼는데, 그 결과를 그대로 저장하면 무관한 문항 하나를
 * 채점한 것만으로 남의 기록이 영구히 사라진다. 원본을 먼저 깔면 못 고친 항목은 저장소에
 * 그대로 남고, 고친 항목만 정규화된 값으로 덮인다.
 */
function mergeOverRaw<T>(raw: unknown, repaired: Record<string, T>): Record<string, T> {
  // 원본 항목의 형은 모른다(그래서 못 고쳤다) — 저장 직전에만 쓰는 통과용 캐스트다
  return isRecord(raw) ? { ...(raw as Record<string, T>), ...repaired } : repaired;
}

function save(data: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* 저장 실패(프라이빗 모드·용량 초과)는 조용히 무시 — 진도는 보조 기능이다 */
  }
}

/**
 * 문항 하나의 채점 결과를 기록한다 — `<ChapterQuiz>` 의 유일한 쓰기 지점.
 *
 * 재응시("다시 풀기")도 그대로 한 번 더 기록한다: `attempts` 는 누적되고 `lastResult` 는
 * 덮어써진다. 설계상 챕터 안의 즉시 재도전은 막지 않되 상자 승급에는 쓰지 않는다(§1-2) —
 * 그 판단은 이 기록을 읽는 쪽(#86 잔여)이 하고, 여기서는 사실만 남긴다.
 */
export function recordQuestionAttempt(
  chapterId: string,
  question: QuestionIdentity,
  passed: boolean,
): void {
  if (typeof window === "undefined") return;
  const raw = readRaw();
  const data = repair(raw);
  // 문항 객체를 받아 여기서 안정 식별자로 푼다 — 호출부가 실수로 원시 q.id 를 넘길 자리를
  // 아예 없앤다 (positional id 로 저장하면 원본 재정렬 때 진도가 조용히 엉뚱한 문항에 붙는다)
  const gk = globalQuestionKey(chapterId, stableQuestionId(question));
  const prev = data.questions[gk];
  const result = passed ? "pass" : "fail";
  data.questions[gk] = {
    ...prev,
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (passed ? 1 : 0),
    lastResult: result,
    lastAt: new Date().toISOString(),
    firstResult: prev?.firstResult ?? result,   // 첫 채점에만 쓰이고 그 뒤로는 고정 (§2-1)
  };
  save({
    ...data,
    chapters: mergeOverRaw(raw.chapters, data.chapters),
    questions: mergeOverRaw(raw.questions, data.questions),
  });
}

/**
 * 마운트 후 문항 기록을 읽는다 — SSG HTML 은 항상 "기록 없음"으로 렌더되므로 useEffect 로
 * 채워야 hydration 불일치가 없다 (lib/progress.ts useReadSections 와 같은 규칙).
 *
 * `storage` 이벤트도 듣는다 (PR #202 Codex P2): 목차를 한 탭에 열어 둔 채 다른 탭에서 퀴즈를
 * 풀면, 마운트 1회 스냅샷만으로는 배지가 새로고침 전까지 낡은 점수를 계속 보인다. 이 이벤트는
 * **다른 탭의 쓰기만** 오므로 같은 탭의 채점과 겹치지 않는다.
 */
export function useQuestionRecords(): Record<string, QuestionRecord> {
  const [records, setRecords] = useState<Record<string, QuestionRecord>>({});
  useEffect(() => {
    const read = () => setRecords(loadProgress().questions);
    read();
    // key === null 은 localStorage.clear() — 그때도 다시 읽어야 비워진 상태가 반영된다
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === KEY) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return records;
}
