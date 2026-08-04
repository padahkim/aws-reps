"use client";

import { earnsCompletion } from "./completion-core.ts";
import { getReadSections } from "./read.ts";
import { loadProgress, markChapterCompleted } from "./records.ts";

/**
 * 완료 조건을 **지금** 충족했으면 스냅샷을 남긴다 (#224) — 판정(`completion-core.ts`)과 저장
 * (`records.ts`)을 잇는 브라우저 쪽 한 줄이다. 저장소 셋을 여기서 읽어 조인한다: 읽은 섹션
 * (`aws-reps.read.v1`) · 채점 기록(`dva.progress.v1`) · 콘텐츠에서 온 finalQ 키.
 *
 * **채점하는 자리마다 불러야 한다** (PR #225 Codex P1). 배지가 마운트될 때만 부르면
 * "충족했다가 곧 깨진" 구간을 통째로 놓친다: 마무리 세션에서 80%를 넘긴 직후 "다시 풀기"로
 * 맞혔던 문항을 틀리면, 화면에는 배지가 뜬 적이 없고 저장에도 스냅샷이 없어 그 챕터는
 * **완료한 적 없는 것으로 남는다**. 배지 유지(D5)가 지키려는 것이 정확히 그 이력이다.
 * 그래서 저장은 "조건을 처음 **관측**한 순간"이 아니라 "처음 **충족**한 순간"이어야 하고,
 * 충족은 채점이 일어나는 그 자리에서만 빠짐없이 보인다.
 *
 * 저장된 값을 직접 읽는다(훅 상태가 아니라) — 채점 직후에 불리므로 방금 쓴 값을 봐야 한다.
 * 이미 스냅샷이 있으면 아무것도 하지 않는다(`applyChapterCompletion` 이 덮어쓰지 않는다).
 *
 * @returns 이번 호출이 스냅샷을 남겼으면 true — 화면이 다시 읽어야 하는지 판단에 쓴다.
 */
export function captureChapterCompletion(chapterId: string, finalKeys: readonly string[]): boolean {
  if (typeof window === "undefined") return false;
  // finalQ 가 없는 챕터는 저장할 사실이 없다 — "열람 완료"(D4)는 읽음 진도에서 파생된다
  if (finalKeys.length === 0) return false;
  const progress = loadProgress();
  if (progress.chapters[chapterId]?.completedAt !== undefined) return false;
  const earned = earnsCompletion({
    readSections: getReadSections(chapterId),
    finalKeys,
    questions: progress.questions,
  });
  if (!earned) return false;
  markChapterCompleted(chapterId, new Date().toISOString());
  return true;
}
