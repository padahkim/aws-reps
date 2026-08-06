"use client";

import { useEffect, useState } from "react";

/**
 * **읽음** 진도 저장소 (이슈 #7) — localStorage 단일 키에 { [chapterId]: 읽은 섹션 번호[] }.
 * 섹션 번호는 URL과 같은 1-based (퀴즈 섹션 포함). 로그인 없음 — 기기 로컬로만 유지되고,
 * 진도 초기화 UI는 범위 외(필요 시 별도 이슈).
 *
 * **이 디렉터리에는 진도 저장소가 둘 있다 — 헷갈리지 않게 여기 적어 둔다** (#203):
 *
 * | 파일 | 키 | 담는 것 |
 * |---|---|---|
 * | `read.ts` (이 파일) | `aws-reps.read.v1` | **어디까지 읽었나** — 챕터별 읽은 섹션 번호 |
 * | `records.ts` + `records-core.ts` | `dva.progress.v1` | **뭘 맞히고 틀렸나** — 문항별 채점 사실 |
 *
 * 둘은 키도 모델도 별개이고 서로를 읽지 않는다. 공통 규칙만 같다: SSG 라 초기 렌더는 항상
 * 빈 값이고(`useEffect` 로 채운다 — hydration 불일치 방지), 파싱·저장 실패는 조용히 삼켜
 * "진도 없음"으로 degrade 한다(프라이빗 모드에서도 학습 자체는 굴러가야 한다).
 *
 * 이 파일은 규칙이 단순해 전용 회귀 테스트가 없다 — 저장하는 게 숫자 배열 하나뿐이고
 * read-repair 도 `getReadSections` 의 필터 한 줄이다. 옆 저장소는 규칙이 많아 붙어 있다
 * (`npm run progress:test`, #214).
 */
const KEY = "aws-reps.read.v1";

type ReadMap = Record<string, number[]>;

function loadMap(): ReadMap {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    return typeof parsed === "object" && parsed !== null ? (parsed as ReadMap) : {};
  } catch {
    // 파싱 실패·스토리지 접근 불가(프라이빗 모드 등)는 빈 진도로 강건하게
    return {};
  }
}

export function getReadSections(chapterId: string): number[] {
  const value = loadMap()[chapterId];
  return Array.isArray(value) ? value.filter((n) => Number.isInteger(n) && n >= 1) : [];
}

/** 섹션 방문 = 읽음. 이미 읽음이면 no-op. 저장 실패는 조용히 무시(진도는 보조 기능). */
export function markSectionRead(chapterId: string, sec: number): void {
  const map = loadMap();
  const current = getReadSections(chapterId);
  if (current.includes(sec)) return;
  map[chapterId] = [...current, sec].sort((a, b) => a - b);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* noop */
  }
}

/**
 * 마운트 후 localStorage에서 읽음 목록을 읽는다 — SSG HTML은 항상 "빈 진도"로 렌더되므로
 * useEffect로 채워야 hydration 불일치가 없다.
 */
export function useReadSections(chapterId: string): number[] {
  const [read, setRead] = useState<number[]>([]);
  useEffect(() => {
    setRead(getReadSections(chapterId));
  }, [chapterId]);
  return read;
}

/**
 * 여러 챕터의 읽음 목록을 한 번에 읽는다 (#235 홈 대시보드) — 훅은 조건·반복 안에서 못 부르니
 * 챕터 목록을 도는 화면은 `useReadSections` 를 챕터 수만큼 늘어놓을 수 없다. 규칙은 그 훅과
 * 같다: SSG 초기 렌더는 빈 진도, 마운트 후 useEffect 로 채움, 값 검사는 `getReadSections` 경유.
 *
 * 의존은 배열 identity 가 아니라 **내용**이다 — 호출부가 렌더마다 `chapters.map(...)` 으로 새
 * 배열을 만들어 넘겨도 다시 읽지 않는다. 구분자 `\u0000` 은 챕터 id 에 나올 수 없는 문자다.
 *
 * `storage` 이벤트도 듣는다 (PR #237 Codex P2 — `useProgress`·`useReview` 와 같은 규칙):
 * 홈을 한 탭에 열어 둔 채 다른 탭에서 섹션을 읽으면, 마운트 1회 스냅샷만으로는 진행률·
 * 커버리지만 낡은 채 남는다 — 대시보드가 조인하는 다른 저장소들은 cross-tab 갱신되므로
 * 이쪽만 안 들으면 지표끼리 어긋난다. (`useReadSections` 는 읽음을 만드는 섹션 페이지
 * 쪽이라 사정이 다르다 — 필요해지면 그때 같은 규칙을 붙인다.)
 */
export function useReadMap(chapterIds: readonly string[]): Record<string, number[]> {
  const [map, setMap] = useState<Record<string, number[]>>({});
  const joined = chapterIds.join("\u0000");
  useEffect(() => {
    const ids = joined === "" ? [] : joined.split("\u0000");
    const read = () => setMap(Object.fromEntries(ids.map((id) => [id, getReadSections(id)])));
    read();
    // key === null 은 localStorage.clear() — 그때도 다시 읽어야 비워진 상태가 반영된다
    // (storage 이벤트 규칙은 records.ts useProgress 와 같다)
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === KEY) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [joined]);
  return map;
}
