"use client";

import { useCallback, useEffect, useState } from "react";
import { isRecord } from "./records-core";
import { loadProgress } from "./records";
import { applyResult, repairReview, seedFromHistory, type Review } from "./review-core";

/**
 * 오답 노트 저장소 `dva.review.v1` (#219 — 부모 에픽 #86). Leitner 상자 상태를 담는다.
 * 상자 전이·선별·정렬 규칙은 여기 없다 — `review-core.ts` 가 소유하고 CI 가 회귀 픽스처로
 * 잠근다. 여기 남은 것은 localStorage 입출력과 React 결선뿐이다 (`records.ts` 와 같은 구조).
 *
 * **이 키의 쓰기는 전부 이 파일을 거친다**(§4-1). 단 앱이 부르는 채점 진입점은 여전히
 * `records.ts` 의 `recordQuestionAttempt` 하나다 — 그쪽이 두 키를 **같은 시각으로** 갱신한다.
 * 시각을 공유하는 게 중요한 이유: `dva.progress.v1` 의 `lastAt` 과 여기 `dueAt` 이 서로 다른
 * 순간에서 계산되면 "방금 푼 문항인데 기한이 어제"처럼 앞뒤가 안 맞는 상태가 만들어진다.
 *
 * 강건성 규칙은 옆 파일들과 같다: SSG 라 초기 렌더는 항상 빈 값이고(useEffect 로 채운다),
 * 저장 실패는 조용히 무시한다(프라이빗 모드에서도 학습 자체는 굴러가야 한다).
 */
const KEY = "dva.review.v1";

export type { Box, Review, ReviewEntry, ReviewItem } from "./review-core";

/** 저장된 원본을 파싱만 해서 돌려준다. 못 읽으면 빈 객체 — 서버·파싱 실패·접근 불가 공통. */
function readRaw(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const text = window.localStorage.getItem(KEY);
    if (text === null) return {};
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * 저장소 전체를 읽는다. 못 읽거나 망가졌으면 그만큼 "복습할 것 없음"으로 강건하게.
 *
 * 읽으면서 **이 키가 생기기 전에 쌓인 오답을 메운다**(`seedFromHistory`, #219 리뷰 지적 →
 * 채택). 진도 키는 #66부터 채점 사실을 쌓아 왔는데 이 키는 이번에 처음 생기므로, 그러지 않으면
 * 이미 틀린 문항들이 우연히 다시 풀리기 전까지 영영 안 나온다. 저장은 하지 않는다 — 값이
 * 결정적이라 읽을 때마다 같고, 첫 쓰기가 일어날 때 함께 저장된다.
 */
export function loadReview(): Review {
  return seedFromHistory(repairReview(readRaw()), loadProgress().questions);
}

function save(data: Review): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* 저장 실패(프라이빗 모드·용량 초과)는 조용히 무시 — 복습 큐는 보조 기능이다 */
  }
}

/**
 * 채점 결과 하나를 상자 상태에 반영한다 — `recordQuestionAttempt` 가 부르는 유일한 쓰기 지점.
 * `at` 을 인자로 받는 이유는 진도 키와 **같은 순간**을 쓰기 위해서다(위 파일 주석 참조).
 *
 * 읽고(`readRaw`) → 고치고(`repairReview`) → 메우고(`seedFromHistory`) → 얹고(`applyResult`) →
 * 저장한다. 상태가 안 바뀌는 채점(조기 정답·첫 정답)도 저장은 한다 — `repairReview` 가 버린
 * 손상 항목의 삭제와 위 메움을 그때 반영해야 하기 때문이다.
 *
 * **`before` 를 인자로 받는 것이 핵심이다**: 메움의 재료인 진도는 이 채점으로 바뀌는 값이라,
 * 저장된 것을 여기서 다시 읽으면 **이미 이번 결과가 반영된 뒤**일 수 있다. 실제로 그랬다 —
 * 과거 오답이 메워지기 전에 정답 채점이 진도를 `pass` 로 덮으면, 메움이 그 문항을 건너뛰어
 * 상자가 없는 채로 "첫 정답"이 되고 **승급이 통째로 사라졌다**(프리뷰에서 잡았다). 호출 순서로
 * 막을 수도 있지만 그건 다음 사람이 모르는 규칙이 된다 — 스냅샷을 넘겨 못 틀리게 한다.
 */
export function recordReviewResult(
  gk: string,
  passed: boolean,
  at: string,
  before: Record<string, { lastResult: "pass" | "fail"; lastAt: string }>,
): void {
  if (typeof window === "undefined") return;
  save(applyResult(seedFromHistory(repairReview(readRaw()), before), gk, passed, at));
}

/**
 * 마운트 후 오답 노트를 읽는다 — SSG HTML 은 항상 "복습 없음"으로 렌더되므로 useEffect 로
 * 채워야 hydration 불일치가 없다 (`useQuestionRecords` 와 같은 규칙).
 *
 * `refresh` 를 함께 돌려준다: 오답 노트 화면은 **같은 탭에서** 채점하므로 `storage` 이벤트가
 * 오지 않는다(그 이벤트는 다른 탭의 쓰기만 온다). 채점한 쪽이 직접 다시 읽어야 상자·기한
 * 표시가 갱신된다.
 */
export function useReview(): { review: Review; refresh: () => void } {
  const [review, setReview] = useState<Review>(() => repairReview({}));
  const refresh = useCallback(() => setReview(loadReview()), []);
  useEffect(() => {
    refresh();
    // key === null 은 localStorage.clear() — 그때도 다시 읽어야 비워진 상태가 반영된다
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);
  return { review, refresh };
}
