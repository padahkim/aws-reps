"use client";

import { useEffect, useState } from "react";
import { isRecord, repair, type Progress, type QuestionRecord } from "./records-core";

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
 * 읽음 진도(`aws-reps.read.v1`)는 별개 키·별개 파일이다(lib/progress.ts). 강건성 규칙은
 * 그쪽과 같다: SSG 라 초기 렌더는 항상 빈 값이고(useEffect 로 채운다), 저장 실패는 조용히
 * 무시한다(프라이빗 모드에서도 학습 자체는 굴러가야 한다).
 */
const KEY = "dva.progress.v1";

export type { ChapterRecord, Progress, QuestionRecord } from "./records-core";

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
