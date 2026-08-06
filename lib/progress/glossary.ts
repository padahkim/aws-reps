"use client";

import { useCallback, useEffect, useState } from "react";
import { isRecord } from "./records-core.ts";

/**
 * 용어집 암기 체크 저장소 `dva.glossary.v1` (#210) — /glossary 인출 카드의 "안다/모른다"
 * 셀프 채점을 항목별로 담는다. 이 디렉터리의 다른 두 저장소(#203 표 참조: read.ts ·
 * records.ts)와 키도 모델도 별개이고 서로를 읽지 않는다 — 용어는 문항이 아니라 전역 문항
 * 키(`chapterId::slug`)가 없고, Leitner 상자·기한도 (아직) 없다. 간격 반복·통계는 체크
 * 데이터가 쌓인 뒤 별도 이슈다 (#210 범위 제외) — `at` 을 지금부터 남기는 이유이기도 하다.
 *
 * 강건성 규칙은 옆 파일들과 같다: SSG 라 초기 렌더는 항상 빈 값이고(useEffect 로 채운다 —
 * hydration 불일치 방지), 파싱·저장 실패는 조용히 무시한다(프라이빗 모드에서도 학습 자체는
 * 굴러가야 한다). **이 키의 쓰기는 전부 이 파일을 거친다** (records.ts §4-1과 같은 규칙).
 *
 * 이 파일은 규칙이 단순해 전용 회귀 테스트가 없다 — read.ts 와 같은 사정이다: 저장하는 게
 * id → {known, at} 평면 맵 하나이고 read-repair 도 아래 필터 한 줄이다.
 */
const KEY = "dva.glossary.v1";

/** 항목 하나의 마지막 셀프 채점 — known = 마지막에 "안다"를 눌렀는가. */
export interface GlossaryMark {
  known: boolean;
  at: string;
}

export type GlossaryMarks = Record<string, GlossaryMark>;

function isMark(value: unknown): value is GlossaryMark {
  return (
    isRecord(value) && typeof value.known === "boolean" && typeof value.at === "string"
  );
}

/** 저장소 전체를 읽는다. 못 읽거나 망가진 항목은 그만큼 "체크 없음"으로 강건하게. */
export function loadGlossaryMarks(): GlossaryMarks {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    if (!isRecord(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, v]) => isMark(v)),
    ) as GlossaryMarks;
  } catch {
    // 파싱 실패·스토리지 접근 불가(프라이빗 모드 등)는 빈 체크로 강건하게
    return {};
  }
}

/** 셀프 채점 하나를 기록한다 — 마지막 채점이 이전 값을 덮는다. 저장 실패는 조용히 무시. */
export function markGlossaryTerm(id: string, known: boolean, at: string): void {
  if (typeof window === "undefined") return;
  const marks = loadGlossaryMarks();
  marks[id] = { known, at };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(marks));
  } catch {
    /* 저장 실패(프라이빗 모드·용량 초과)는 조용히 무시 — 체크는 보조 기능이다 */
  }
}

/**
 * 마운트 후 체크 맵을 읽는다 — SSG HTML 은 항상 "체크 없음"으로 렌더되므로 useEffect 로
 * 채워야 hydration 불일치가 없다 (`useProgress` 와 같은 규칙).
 *
 * `refresh` 를 함께 돌려준다: 암기 카드는 **같은 탭에서** 채점하므로 `storage` 이벤트가
 * 오지 않는다(그 이벤트는 다른 탭의 쓰기만 온다) — 채점한 쪽이 직접 다시 읽어야 목록
 * 배지가 갱신된다 (`useReview` 와 같은 규칙).
 */
export function useGlossaryMarks(): { marks: GlossaryMarks; refresh: () => void } {
  const [marks, setMarks] = useState<GlossaryMarks>({});
  const refresh = useCallback(() => setMarks(loadGlossaryMarks()), []);
  useEffect(() => {
    refresh();
    // key === null 은 localStorage.clear() — 그때도 다시 읽어야 비워진 상태가 반영된다
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);
  return { marks, refresh };
}
