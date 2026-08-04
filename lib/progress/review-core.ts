/**
 * 오답 노트 저장소 `dva.review.v1` 의 **순수 층** — Leitner 상자 상태의 형(型)과 그 값을
 * 다루는 규칙만 있다: 읽을 때의 검사(read-repair), 채점 결과를 얹는 전이(`applyResult`),
 * 그리고 화면이 쓰는 선별·정렬(`dueList`·`upcomingList`).
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §1(상자·간격·강등·조기 정답)·§4-1(스키마).
 *
 * `records-core.ts` 와 같은 이유로 순수하다 (#214): 여기 결함은 타입이 맞고 화면도 멀쩡한데
 * **간격만 틀리는** 모양으로 나온다 — 상자가 한 칸 더 오르거나, 조기 정답이 승급을 통과하거나,
 * dueAt 이 하루 어긋나거나. 그런 건 화면을 봐서는 알 수 없고 며칠 뒤 복습 큐가 이상해져서야
 * 드러난다. 그래서 `window` 를 모르는 함수만 여기 모아 `review-core.test.ts` 가 CI 에서 돌린다.
 * 브라우저 붙임(localStorage·React)은 `review.ts` 쪽이다.
 *
 * **저장하는 것은 상태뿐이다** — 상자 번호·다음 기한·졸업 시각. 시도 횟수·정오 이력은
 * `dva.progress.v1`(records-core.ts)이 갖고 있고 여기서 복제하지 않는다. 두 키는 채점 한 번에
 * 함께 갱신되지만(records.ts `recordQuestionAttempt`) 소유하는 사실이 다르다.
 */

// 확장자를 적는 이유: 이 파일은 node 가 직접 실행하는 경로(`npm run progress:test`)에 있고,
// node ESM 은 확장자 없는 상대 경로를 못 찾는다. 번들러 쪽은 양쪽 다 되므로(content/chapters/*/
// meta.ts 가 같은 형태로 `./drills.ts` 를 부른다) 실행되는 쪽에 맞춘다.
import { isIsoInstant, isRecord } from "./records-core.ts";

/** 상자 번호 (§1-2) — 3개가 상한이다. "이 앱의 사용자는 시험 준비생 1명"(설계 머리말). */
export type Box = 1 | 2 | 3;

/**
 * 문항 하나의 상자 상태 (§4-1). 알 수 없는 필드는 보존되므로 인덱스 시그니처가 열려 있다.
 *
 * **이 저장소에 없는 문항 = 아직 한 번도 틀린 적이 없는 문항**이다. 오답 노트는 이름 그대로
 * 오답만 담는다 (§1-2) — 처음부터 맞힌 문항을 넣으면 복습 큐가 전체 문항 수로 부풀어
 * "오늘의 복습"이 행동 유도 지표 구실을 못 한다.
 */
export interface ReviewItem {
  box: Box;                   // 현재 상자 — 낮을수록 약점
  dueAt: string;              // 다음 재출제 시각 = 마지막 채점 + 그 상자의 간격 (ISO 8601)
  /**
   * 졸업(숙달) 시각 — 있으면 복습 큐에서 빠진다 (§2-1: 상자 3에서 due 상태의 정답).
   * 다시 틀리면 **이 필드를 지우고** 상자 1로 되돌린다 (§1-2 강등) — 망각 반영은 그게 전부다.
   */
  graduatedAt?: string;
  [extra: string]: unknown;
}

export interface Review {
  v: number;                             // 마이너(호환 확장) 버전. 모르는 상위 버전은 낮추지 않는다
  items: Record<string, ReviewItem>;     // 키 = 전역 문항 키 (keys.ts)
  [extra: string]: unknown;
}

/** 이 빌드가 아는 마이너 버전 — 메이저는 키 접미 `.v1` 이다 (§4-3). */
export const V = 1;

/**
 * 상자별 간격(일) — §1-2. 설계 D1 이 "간격값은 상수 튜닝 사항으로, 결정 대상 아님"이라고
 * 못박았으므로 이 표만 고치면 정책이 바뀐다.
 */
export const INTERVAL_DAYS: Record<Box, number> = { 1: 1, 2: 3, 3: 7 };

const DAY_MS = 86_400_000;

export function isBox(value: unknown): value is Box {
  return value === 1 || value === 2 || value === 3;
}

/**
 * `at` 에서 `days` 일 뒤의 정규 ISO 순간. 계산할 수 없으면 undefined.
 *
 * `days` 까지 검사하는 이유: `new Date(NaN).toISOString()` 은 **던진다**. 이 함수는 채점 클릭
 * 한복판에서 불리므로, 던지면 그 자리에서 화면이 죽는다 — 값이 하나 안 바뀌는 것과는 무게가
 * 다르다. 상수 표에 없는 상자 번호가 들어오는 경로는 지금 없지만, 없는 경로를 믿고 던지는
 * 코드를 두는 것과 한 줄로 막는 것 중에는 후자가 싸다.
 */
export function addDays(at: string, days: number): string | undefined {
  if (!isIsoInstant(at) || !Number.isFinite(days)) return undefined;
  return new Date(Date.parse(at) + days * DAY_MS).toISOString();
}

/**
 * 상자 상태 하나를 검사한다. **말이 되면 그대로 두고, 아니면 버린다** — `repairQuestion` 과
 * 같은 원칙이다(고쳐 쓰지 않는다). 버리는 단위도 같다: 그 문항 하나이고, 이웃은 산다.
 *
 * 여기서 "말이 안 된다"는 건 대부분 **시각이 시각이 아닌** 경우다. 그런 값이 통과하면 연체
 * 정렬(§1-3)과 다음 기한 계산이 날조된 시각 위에서 돌고, 최악은 `dueAt` 이 영원히 오지 않아
 * 그 문항이 복습 큐에서 조용히 사라지는 것이다 — 사용자는 "다 복습했다"고 읽는다.
 */
export function repairItem(raw: unknown): ReviewItem | undefined {
  if (!isRecord(raw)) return undefined;
  if (!isBox(raw.box)) return undefined;
  if (!isIsoInstant(raw.dueAt)) return undefined;
  // 있으면 시각이어야 한다. 값이 있는데 시각이 아니면 졸업 여부 자체를 믿을 수 없다
  if (raw.graduatedAt !== undefined && !isIsoInstant(raw.graduatedAt)) return undefined;
  const graduatedAt = typeof raw.graduatedAt === "string" ? raw.graduatedAt : undefined;
  return {
    ...raw,   // 알 수 없는 필드는 그대로 통과 (§4-3 — 구버전 세션이 신버전 필드를 지우지 않도록)
    box: raw.box,
    dueAt: raw.dueAt,
    graduatedAt,
  };
}

/** 저장된 객체를 현재 구조로 고친다 (§4-3). `v` 는 읽어서 분기하되 **낮추지 않는다**. */
export function repairReview(raw: Record<string, unknown>): Review {
  const items: Record<string, ReviewItem> = {};
  if (isRecord(raw.items)) {
    for (const [gk, value] of Object.entries(raw.items)) {
      const fixed = repairItem(value);
      if (fixed) items[gk] = fixed;
    }
  }
  const v = typeof raw.v === "number" && Number.isInteger(raw.v) && raw.v > V ? raw.v : V;
  return { ...raw, v, items };
}

/**
 * 채점 하나가 이 문항의 상자를 어떻게 바꾸는가 — **간격 반복의 전부가 이 함수다** (§1-2).
 * 바뀔 게 없으면 `undefined` 를 돌려준다(조기 정답·첫 정답·졸업 유지).
 *
 * | 이전 상태 | 오답 | 정답 |
 * |---|---|---|
 * | 없음 (한 번도 안 틀림) | 상자 1 진입 · due = +1일 | **아무 일 없음** — 오답 노트에 넣지 않는다 |
 * | 상자 n · due 전 | 상자 1 강등 · due = +1일 | **승급 안 함** (D2) |
 * | 상자 n(<3) · due 도달 | 상자 1 강등 · due = +1일 | 상자 n+1 · due = +새 간격 |
 * | 상자 3 · due 도달 | 상자 1 강등 · due = +1일 | **졸업** — graduatedAt 기록 |
 * | 졸업 | 상자 1 재진입 · graduatedAt 삭제 | 졸업 유지 |
 *
 * **조기 정답을 승급시키지 않는 이유**(D2): 방금 해설을 읽고 몇 분 뒤 맞힌 것은 단기 기억
 * 재인이지 간격을 둔 인출이 아니다. 이 한 줄이 없으면 같은 자리에서 연타해 상자를 통과할 수
 * 있어 간격 반복이 통째로 무력화된다. 반대로 **오답은 due 여부와 무관하게 언제나 강등**이다 —
 * 모르는 것은 언제 드러나든 사실이므로.
 */
export function nextItem(
  prev: ReviewItem | undefined,
  passed: boolean,
  at: string,
): ReviewItem | undefined {
  if (!isIsoInstant(at)) return undefined;   // 날조된 시각으로 기한을 만들지 않는다

  if (!passed) {
    const dueAt = addDays(at, INTERVAL_DAYS[1]);
    if (dueAt === undefined) return undefined;
    // 미지 필드는 살리되 graduatedAt 은 **지운다** — 다시 틀렸으므로 졸업이 아니다
    const rest = { ...prev };
    delete rest.graduatedAt;
    return { ...rest, box: 1, dueAt };
  }

  // 정답인데 이력이 없다 = 한 번도 틀린 적 없는 문항 → 오답 노트에 들이지 않는다 (§1-2)
  if (prev === undefined) return undefined;
  // 이미 졸업한 문항의 정답은 상태를 바꾸지 않는다 (due 계산에서 이미 빠져 있다)
  if (prev.graduatedAt !== undefined) return undefined;
  // 조기 정답 (D2) — 기록은 progress 쪽에 남고, 여기서는 상자를 건드리지 않는다
  if (Date.parse(at) < Date.parse(prev.dueAt)) return undefined;

  if (prev.box === 3) {
    const dueAt = addDays(at, INTERVAL_DAYS[3]);
    if (dueAt === undefined) return undefined;
    return { ...prev, box: 3, dueAt, graduatedAt: at };
  }
  const box = (prev.box + 1) as Box;
  const dueAt = addDays(at, INTERVAL_DAYS[box]);
  if (dueAt === undefined) return undefined;
  return { ...prev, box, dueAt };
}

/**
 * 채점 사실 하나를 얹은 **새 오답 노트**를 돌려준다 — 쓰기 경로의 유일한 계산이다.
 * 입력 `data` 는 건드리지 않는다. 바뀔 게 없으면 받은 것을 그대로 돌려준다.
 *
 * `data` 는 `repairReview` 를 통과한 값이어야 하고, `at` 은 `new Date().toISOString()`
 * 형식이어야 한다 — 아니면 다음 로드가 이 항목을 버린다 (repairItem 참조).
 */
export function applyResult(data: Review, gk: string, passed: boolean, at: string): Review {
  const next = nextItem(data.items[gk], passed, at);
  if (next === undefined) return data;
  return { ...data, items: { ...data.items, [gk]: next } };
}

/** 목록 한 줄 — 전역 문항 키와 그 상태를 함께 들고 다닌다. */
export interface ReviewEntry {
  gk: string;
  item: ReviewItem;
}

/** 아직 졸업하지 않은 항목만 (= 오답 노트의 모집단, §4-1). */
function active(data: Review): ReviewEntry[] {
  return Object.entries(data.items)
    .filter(([, item]) => item.graduatedAt === undefined)
    .map(([gk, item]) => ({ gk, item }));
}

/**
 * 지금 풀어야 하는 문항 (§1-3) — `dueAt ≤ now`, **연체 오래된 순 → 상자 낮은 순**.
 * 연체가 먼저인 이유는 잊힌 지 오래된 것부터 되살리는 게 간격 반복의 취지이고, 같은 기한이면
 * 상자가 낮은 쪽(더 자주 틀린 쪽)이 약점이라 먼저다. 마지막 gk 비교는 정렬을 결정적으로
 * 만들기 위한 것이다 — 같은 목록이 새로고침마다 다른 순서로 보이지 않게.
 */
export function dueList(data: Review, now: string): ReviewEntry[] {
  const t = Date.parse(now);
  return active(data)
    .filter(({ item }) => Date.parse(item.dueAt) <= t)
    .sort(
      (a, b) =>
        Date.parse(a.item.dueAt) - Date.parse(b.item.dueAt) ||
        a.item.box - b.item.box ||
        (a.gk < b.gk ? -1 : 1),
    );
}

/** 아직 기한이 안 된 문항 — 화면에서는 접힌 "예정" 영역이다 (§1-3). 가까운 기한 순. */
export function upcomingList(data: Review, now: string): ReviewEntry[] {
  const t = Date.parse(now);
  return active(data)
    .filter(({ item }) => Date.parse(item.dueAt) > t)
    .sort(
      (a, b) =>
        Date.parse(a.item.dueAt) - Date.parse(b.item.dueAt) ||
        a.item.box - b.item.box ||
        (a.gk < b.gk ? -1 : 1),
    );
}

/** "복습 N" 배지가 읽는 값 (§1-3) — 알림·푸시는 만들지 않는다. 숫자 하나가 전부다. */
export function dueCount(data: Review, now: string): number {
  return dueList(data, now).length;
}
