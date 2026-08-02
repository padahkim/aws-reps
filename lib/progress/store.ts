"use client";

import { useEffect, useState } from "react";
import { globalQuestionKey } from "./keys";

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

export interface Progress {
  v: 1;                                        // 마이너(호환 확장) 버전 — 메이저는 키 접미 `.v1` (§4-3)
  chapters: Record<string, ChapterRecord>;
  questions: Record<string, QuestionRecord>;   // 키 = 전역 문항 키 (keys.ts)
  [extra: string]: unknown;                    // 미지 필드 보존 (§4-3)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function emptyProgress(): Progress {
  return { v: 1, chapters: {}, questions: {} };
}

/** 0 이상의 정수로 정규화. 숫자가 아니거나 음수·NaN 이면 fallback. */
function count(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

/**
 * 문항 기록 하나를 규약대로 고친다. 시도 사실을 복원할 수 없을 만큼 망가졌으면 undefined —
 * 그 항목 하나만 버리고 나머지 진도는 살린다.
 */
function repairQuestion(raw: unknown): QuestionRecord | undefined {
  if (!isRecord(raw)) return undefined;
  const lastResult = raw.lastResult === "pass" || raw.lastResult === "fail" ? raw.lastResult : undefined;
  if (lastResult === undefined || typeof raw.lastAt !== "string") return undefined;
  // lastResult 가 있다는 건 최소 1회 채점됐다는 뜻 — attempts 가 없거나 0이면 1로 복원한다
  const attempts = Math.max(count(raw.attempts, 1), 1);
  return {
    ...raw,   // 알 수 없는 필드는 그대로 통과 (§4-3 — 구버전 세션이 신버전 필드를 지우지 않도록)
    attempts,
    correct: Math.min(count(raw.correct, 0), attempts),
    lastResult,
    lastAt: raw.lastAt,
  };
}

/** 챕터 기록 하나를 고친다. 열람 시각이 없으면 스냅샷이 아니므로 버린다. */
function repairChapter(raw: unknown): ChapterRecord | undefined {
  if (!isRecord(raw) || typeof raw.visitedAt !== "string") return undefined;
  const completedAt = typeof raw.completedAt === "string" ? raw.completedAt : undefined;
  return { ...raw, visitedAt: raw.visitedAt, completedAt };
}

/** 저장된 객체를 현재 구조로 고친다 (§4-3) — 누락 필드는 기본값, 미지 필드는 보존. */
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
  return { ...raw, v: 1, chapters, questions };
}

/** 저장소 전체를 읽는다. 서버·파싱 실패·접근 불가는 전부 "진도 없음"으로 강건하게. */
export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  let raw: unknown;
  try {
    const text = window.localStorage.getItem(KEY);
    if (text === null) return emptyProgress();
    raw = JSON.parse(text);
  } catch {
    // 파싱 실패·스토리지 접근 불가(프라이빗 모드 등) — lib/progress.ts 와 같은 처리
    return emptyProgress();
  }
  return isRecord(raw) ? repair(raw) : emptyProgress();
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
  questionId: string,
  passed: boolean,
): void {
  if (typeof window === "undefined") return;
  const data = loadProgress();
  const gk = globalQuestionKey(chapterId, questionId);
  const prev = data.questions[gk];
  data.questions[gk] = {
    ...prev,
    attempts: (prev?.attempts ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (passed ? 1 : 0),
    lastResult: passed ? "pass" : "fail",
    lastAt: new Date().toISOString(),
  };
  save(data);
}

/**
 * 마운트 후 문항 기록을 읽는다 — SSG HTML 은 항상 "기록 없음"으로 렌더되므로 useEffect 로
 * 채워야 hydration 불일치가 없다 (lib/progress.ts useReadSections 와 같은 규칙).
 */
export function useQuestionRecords(): Record<string, QuestionRecord> {
  const [records, setRecords] = useState<Record<string, QuestionRecord>>({});
  useEffect(() => {
    setRecords(loadProgress().questions);
  }, []);
  return records;
}
