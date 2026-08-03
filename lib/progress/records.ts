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

/**
 * 정규 ISO 순간(`new Date().toISOString()` 이 내는 그 형식)인가.
 *
 * `Date.parse` 가 유한한지만 보면 부족하다 (PR #202 Codex P2): `Date.parse("0")` 은 2000년으로
 * 통과하고, `"2024-02-30"` 은 존재하지 않는 날짜인데 조용히 3월 1일이 된다. 게다가 규격 밖
 * 문자열의 해석은 **브라우저마다 다르다** — 같은 저장값이 기기마다 다른 시각이 되는 셈이다.
 * 그 값들이 통과하면 간격 반복(§1-2 dueAt)과 연체 정렬(§1-3)이 날조된 시각 위에서 돈다.
 *
 * 판정은 **왕복 동일성**으로 한다: 파싱한 순간을 다시 직렬화해 원본과 같아야 한다. 이 저장소는
 * `toISOString()` 으로만 쓰므로 그 형식이 곧 정본이고, 달력값 검증도 여기에 딸려 온다
 * (2024-02-30 은 3월 1일로 되돌아와 불일치한다). 형식이 다른 값은 손상으로 보고 집계에서
 * 빼지만 **저장에서 지우지는 않는다** — 재응시 시 salvage 가 누계·첫 결과를 도로 살린다.
 */
function isIsoInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const t = Date.parse(value);
  return Number.isFinite(t) && new Date(t).toISOString() === value;
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
  if (lastResult === undefined || !isIsoInstant(raw.lastAt)) return undefined;
  const rawFirst = raw.firstResult === "pass" || raw.firstResult === "fail" ? raw.firstResult : undefined;
  // attempts 는 **살아 있으면 그 값을 믿고, 망가졌을 때만 추론한다**. 순서가 중요하다 (PR #202
  // Codex P2): 살아 있는 값을 증거로 덮으면 일어나지 않은 시도를 지어내고, 반대로 망가진 값을
  // 1로 떨어뜨리면 아래 firstResult 분기가 알려진 첫 결과를 lastResult 로 덮어 버린다.
  // 추론의 근거: ① 정답 횟수만큼은 시도했다 ② 유효한 양 끝이 서로 다르면 서로 다른 시도다(≥2).
  const statedAttempts =
    typeof raw.attempts === "number" && Number.isFinite(raw.attempts) && raw.attempts >= 1
      ? Math.floor(raw.attempts)
      : undefined;
  const attempts = Math.max(
    statedAttempts ?? (rawFirst !== undefined && rawFirst !== lastResult ? 2 : 1),
    count(raw.correct, 0),
    1,
  );
  // 시도가 1회면 첫 결과 = 마지막 결과다. 저장값이 그와 다르면 **불가능한 이력**이므로
  // lastResult 를 정본으로 덮어쓴다. 없으면 이걸로 복원되고(§4-3 "누락 필드 기본값 주입"),
  // 2회 이상이면 복원할 근거가 없어 비워 둔다 — **모르는 것은 모르는 채로 둔다**.
  // 여기서 아무 값이나 채우면 §2-1 숙달 판정이 오염된다.
  const firstResult = attempts === 1 ? lastResult : rawFirst;
  // 누계는 **알려진 양 끝**이 하한과 상한을 정한다 (PR #202 Codex P2). lastResult 만 보던
  // 예전 규칙은 `{attempts:2, correct:2, firstResult:"fail", lastResult:"pass"}`(첫 시도가
  // 오답인데 전부 정답)나 `{attempts:2, correct:1, 양끝 모두 pass}`(정답 2회를 아는데 1회)
  // 같은 불가능한 이력을 통과시켰다. 시도가 1회면 양 끝이 같은 시도이므로 한 번만 센다.
  const endpoints = attempts === 1 ? [lastResult] : [firstResult, lastResult];
  const knownPass = endpoints.filter((r) => r === "pass").length;
  const knownFail = endpoints.filter((r) => r === "fail").length;
  const correct = Math.min(Math.max(count(raw.correct, 0), knownPass), attempts - knownFail);
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

/**
 * 원본에서 그 문항의 못 고친 기록을 꺼낸다. `repair` 가 거절한 기록도 **시도 횟수·정답
 * 횟수·첫 결과·미지 필드**는 대개 멀쩡하다 — 거절 사유는 보통 `lastAt`·`lastResult` 하나다.
 * 그것들을 다시 쓸 수 있게 돌려주는 자리이고, 값의 정규화는 호출부가 한다.
 */
function salvageQuestion(
  rawQuestions: unknown,
  gk: string,
): Record<string, unknown> | undefined {
  if (!isRecord(rawQuestions)) return undefined;
  const entry = rawQuestions[gk];
  return isRecord(entry) ? entry : undefined;
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
  const result = passed ? "pass" : "fail";
  const prev = data.questions[gk];
  // repair 가 이 기록을 거절했다면(예: lastAt 이 시각으로 안 읽힌다) 원본에서 **살릴 수 있는
  // 사실만** 건진다. 거절 사유 하나 때문에 시도 횟수·첫 결과·미지 필드까지 버리면, 재응시
  // 한 번이 과거 이력을 통째로 "처음 푸는 문항"으로 되돌린다 (PR #202 Codex P2).
  // mergeOverRaw 로는 못 막는다 — 같은 키에서는 새로 쓴 항목이 원본을 이기기 때문이다.
  const salvaged = prev === undefined ? salvageQuestion(raw.questions, gk) : undefined;
  const prevFirst =
    prev?.firstResult ??
    (salvaged?.firstResult === "pass" || salvaged?.firstResult === "fail"
      ? salvaged.firstResult
      : undefined);
  // 구제한 기록의 하한은 **알려진 양 끝을 모두** 근거로 잡는다 — repairQuestion 의 endpoints
  // 규칙과 같아야 한다 (PR #202 Codex P2). 첫 결과만 보고 마지막 결과를 버리면, 둘이 서로
  // 다를 때(= 서로 다른 시도라는 증거) 과거 한 회와 그 정답이 통째로 사라진다.
  // attempts 가 0으로 떨어지는 것도 위험하다 — 아래 클램프가 살아남은 correct 를 깎고,
  // prevAttempts === 0 이 "처음 푸는 문항"으로 읽혀 첫 결과까지 이번 답으로 덮는다.
  const salvagedLast =
    salvaged?.lastResult === "pass" || salvaged?.lastResult === "fail"
      ? salvaged.lastResult
      : undefined;
  // 양 끝이 서로 다르면 서로 다른 시도이므로 최소 2회, 같거나 한쪽만 알면 최소 1회다
  const knownEnds =
    prevFirst !== undefined && salvagedLast !== undefined && prevFirst !== salvagedLast
      ? [prevFirst, salvagedLast]
      : [prevFirst ?? salvagedLast].filter((r) => r !== undefined);
  const salvagedAttempts = Math.max(
    count(salvaged?.attempts, 0),
    count(salvaged?.correct, 0),
    knownEnds.length,
  );
  const prevAttempts = prev?.attempts ?? salvagedAttempts;
  const prevCorrect = Math.min(
    Math.max(
      prev?.correct ?? count(salvaged?.correct, 0),
      knownEnds.filter((r) => r === "pass").length,
    ),
    prevAttempts,
  );
  data.questions[gk] = {
    ...salvaged,   // 못 고친 기록의 미지 필드 보존 (아래에서 아는 필드는 전부 덮어쓴다)
    ...prev,
    attempts: prevAttempts + 1,
    correct: prevCorrect + (passed ? 1 : 0),
    lastResult: result,
    lastAt: new Date().toISOString(),
    // 첫 채점일 때만 쓰고 그 뒤로는 고정 (§2-1). 이력이 있는데 첫 결과를 모르는 경우
    // (이 필드 이전에 저장된 다회 시도 기록)는 **모르는 채로 둔다** — 지금 결과를 첫 결과로
    // 적으면 나중 시도가 첫 시도로 영구히 오기입되어 숙달 판정이 뒤집힌다
    firstResult: prevAttempts === 0 ? result : prevFirst,
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
