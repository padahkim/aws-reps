"use client";

import { useEffect, useState } from "react";
import { globalQuestionKey, stableQuestionId, type QuestionIdentity } from "./keys";
import { applyAttempt, repair, type Progress, type QuestionRecord } from "./repair";

/**
 * 학습 진도 저장소 `dva.progress.v1` 의 **브라우저 접점** (#66 — 부모 에픽 #86의 첫 쓰기 경로).
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §4. **이 키의 쓰기는 전부 이 파일을 거친다**(§4-1).
 *
 * 값을 판단하는 규칙(검사·보정·병합)은 여기 없다 — `repair.ts` 가 소유하고 CI 가 회귀 테스트로
 * 잠근다(#214). 여기 남은 것은 localStorage 입출력과 React 결선뿐이다.
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

// 형은 규칙 쪽이 소유하지만 소비자는 이 모듈만 알면 된다 (#66 이후의 import 경로 유지).
export type { ChapterRecord, Progress, QuestionRecord } from "./repair";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
 * 병합 규칙은 `applyAttempt`(repair.ts)가 갖고 있고 여기서는 읽기·시각·저장만 맡는다.
 */
export function recordQuestionAttempt(
  chapterId: string,
  question: QuestionIdentity,
  passed: boolean,
): void {
  if (typeof window === "undefined") return;
  // 문항 객체를 받아 여기서 안정 식별자로 푼다 — 호출부가 실수로 원시 q.id 를 넘길 자리를
  // 아예 없앤다 (positional id 로 저장하면 원본 재정렬 때 진도가 조용히 엉뚱한 문항에 붙는다)
  const gk = globalQuestionKey(chapterId, stableQuestionId(question));
  save(applyAttempt(repair(readRaw()), gk, passed, new Date().toISOString()));
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
