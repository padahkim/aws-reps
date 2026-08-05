"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyChapterCompletion,
  isRecord,
  repair,
  type Progress,
  type QuestionRecord,
} from "./records-core.ts";

/**
 * 학습 진도 저장소 `dva.progress.v1` (#66 — 부모 에픽 #86의 첫 쓰기 경로).
 * 소유권은 갈라져 있다 (#207): 정책·판정 기준·"왜 이 필드들인가"는
 * docs/design/LEARNING_LOOP_DRAFT.md §4가 정본이고, **필드 목록의 정본은 `records-core.ts`**
 * (`Progress`·`QuestionRecord`·`ChapterRecord`)이다 — 문서는 필드를 소유하지 않는다.
 * **이 키의 쓰기는 전부 이 파일을 거친다**(§4-1).
 *
 * 필드가 옆 파일인 이유 (#214): 이 파일은 `"use client"` + react import 라 node 가 못 부르고,
 * 그래서 CI 가 진도 로직을 한 줄도 실행하지 못했다. 형과 규칙(read-repair·쓰기 누적)을
 * `records-core.ts` 로 옮겨 회귀 테스트를 붙였고, 여기에는 그것을 localStorage·React 에
 * 붙이는 일만 남는다. 공개 API 는 여전히 여기서 나간다.
 *
 * **읽음 진도(`aws-reps.read.v1`)는 별개 키·별개 파일이다** — 같은 디렉터리의 `read.ts` 이고,
 * "어디까지 읽었나"를 담는다(이쪽은 "뭘 맞히고 틀렸나"다, #203). 서로를 읽지 않는다.
 * 강건성 규칙만 같다: SSG 라 초기 렌더는 항상 빈 값이고(useEffect 로 채운다), 저장 실패는
 * 조용히 무시한다(프라이빗 모드에서도 학습 자체는 굴러가야 한다).
 */
const KEY = "dva.progress.v1";

export type { ChapterRecord, Progress, QuestionRecord } from "./records-core.ts";

/** 저장된 원본을 파싱만 해서 돌려준다. 못 읽으면 빈 객체 — 서버·파싱 실패·접근 불가 공통. */
function readRaw(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const text = window.localStorage.getItem(KEY);
    if (text === null) return {};
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? parsed : {};
  } catch {
    // 파싱 실패·스토리지 접근 불가(프라이빗 모드 등) — 옆 read.ts 와 같은 처리
    return {};
  }
}

/** 저장소 전체를 읽는다. 못 읽거나 망가졌으면 그만큼 "진도 없음"으로 강건하게. */
export function loadProgress(): Progress {
  return repair(readRaw());
}

/**
 * 이 키에 쓰는 유일한 함수. 채점 조합(어떤 값을 얹을지·언제)은 `attempt.ts` 가 정하고,
 * 여기서는 저장만 한다 — 그 갈라짐의 이유는 그 파일 주석에 있다 (#219).
 */
export function saveProgress(data: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* 저장 실패(프라이빗 모드·용량 초과)는 조용히 무시 — 진도는 보조 기능이다 */
  }
}

/**
 * 챕터 완료 스냅샷을 남긴다 (#224) — `chapters` 슬롯에 쓰는 유일한 함수이자, 이 키의 쓰기가
 * 전부 이 파일을 거친다는 §4-1 규칙의 두 번째 지점이다(첫 번째는 채점 쪽 `saveProgress`).
 *
 * 판정은 하지 않는다. 부를지 말지는 화면(`app/completion-badge.tsx`)이 `completion-core.ts`
 * 의 조건식으로 정하고, 여기서는 "이미 있으면 그대로 둔다"만 지킨다 —
 * `applyChapterCompletion` 이 바꿀 게 없으면 같은 객체를 돌려주므로 헛된 저장도 없다.
 */
export function markChapterCompleted(chapterId: string, at: string): void {
  if (typeof window === "undefined") return;
  const before = loadProgress();
  const after = applyChapterCompletion(before, chapterId, at);
  if (after === before) return;
  saveProgress(after);
}

/**
 * 마운트 후 저장소 전체를 읽는다 — SSG HTML 은 항상 "기록 없음"으로 렌더되므로 useEffect 로
 * 채워야 hydration 불일치가 없다 (옆 read.ts 의 useReadSections 와 같은 규칙).
 *
 * `storage` 이벤트도 듣는다 (PR #202 Codex P2): 목차를 한 탭에 열어 둔 채 다른 탭에서 퀴즈를
 * 풀면, 마운트 1회 스냅샷만으로는 배지가 새로고침 전까지 낡은 점수를 계속 보인다. 이 이벤트는
 * **다른 탭의 쓰기만** 오므로 같은 탭의 채점과 겹치지 않는다 — 같은 탭에서 이 키에 쓴 화면은
 * `refresh` 를 직접 불러야 한다 (완료 배지가 스냅샷을 남긴 직후가 그 경우다, `useReview` 와 같다).
 */
export function useProgress(): { progress: Progress; refresh: () => void } {
  const [progress, setProgress] = useState<Progress>(() => repair({}));
  const refresh = useCallback(() => setProgress(loadProgress()), []);
  useEffect(() => {
    refresh();
    // key === null 은 localStorage.clear() — 그때도 다시 읽어야 비워진 상태가 반영된다
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);
  return { progress, refresh };
}

/** 문항 기록만 필요한 화면(목차 점수 배지)이 쓰는 얇은 겉면 — 규칙은 `useProgress` 와 같다. */
export function useQuestionRecords(): Record<string, QuestionRecord> {
  return useProgress().progress.questions;
}
