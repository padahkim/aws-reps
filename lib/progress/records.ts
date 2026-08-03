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

/**
 * 0 이상의 **안전 정수**로 정규화. 숫자가 아니거나 음수·NaN 이면 fallback.
 *
 * 안전 정수까지 요구하는 이유 (PR #202 Codex P2): `Number.MAX_SAFE_INTEGER` 를 넘는 값은
 * 유한하지만 `+ 1` 이 같은 수로 평가된다 — 그대로 통과시키면 재응시가 결과만 갱신하고
 * **시도 횟수는 영원히 안 늘어나는** 기록이 생긴다. 그 경우 손상으로 보고 fallback 을 쓴다.
 */
function count(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return fallback;
  const n = Math.floor(value);
  return Number.isSafeInteger(n) ? n : fallback;
}

/** 증가값을 `count` 가 받아들이는 범위 안에 묶는다 — 쓰기가 자기 검증을 통과하도록. */
function saturate(value: number): number {
  return Math.min(value, Number.MAX_SAFE_INTEGER);
}

/**
 * 문항 기록 하나를 규약대로 고친다. 시도 사실을 복원할 수 없을 만큼 망가졌으면 undefined —
 * 그 항목은 **집계에서만** 빠진다 (저장에서 지우지는 않는다 — mergeOverRaw 참조).
 *
 * 누계(attempts·correct)와 마지막 결과가 모순이면 **lastResult 를 정본으로 삼는다** (PR #202
 * Codex P2): 배지·완료 판정이 직접 읽는 값이 lastResult 라, 여기서 어긋난 채 두면 화면이
 * 말하는 것과 누계가 따로 논다. 게다가 이후 채점이 이 값들을 그대로 증가시켜 모순이 굳는다.
 */
/** 시도 사실 3종 — 저장된 값을 규약대로 정리한 결과. */
interface AttemptFacts {
  attempts: number;
  correct: number;
  firstResult?: "pass" | "fail";
}

/**
 * 시도 사실(횟수·정답 수·첫 결과)을 규약대로 정리한다 — **로드 경로와 재응시 구제 경로가
 * 함께 쓰는 단 하나의 자리다.**
 *
 * 왜 함수로 뽑았나 (PR #202 8라운드): 같은 규칙을 두 곳에 손으로 복제해 두는 동안 **같은 모양의
 * 결함이 세 번 반복됐다** — 한쪽에 규칙을 추가하면 다른 쪽이 조용히 옛 규칙으로 남았다
 * (5·7·8라운드). 불변식은 한 곳에만 있어야 두 경로가 갈라지지 않는다.
 *
 * 규칙 넷, 순서가 중요하다:
 * 1. `attempts` 가 숫자로 **살아 있으면 그 값을 믿는다.** 살아 있는 값을 증거로 덮으면
 *    일어나지 않은 시도를 지어낸다.
 * 2. 없거나 망가졌을 때만 추론한다 — 정답 횟수만큼은 시도했고, 유효한 양 끝이 서로 다르면
 *    서로 다른 시도이므로 최소 2회다.
 * 3. 시도가 1회면 양 끝이 **같은 시도**다 → 첫 결과 = 마지막 결과. 알려진 쪽으로 채우고,
 *    저장값이 그와 어긋나면 불가능한 이력이므로 덮는다. 2회 이상인데 첫 결과를 모르면
 *    **모르는 채로 둔다** — 아무 값이나 채우면 §2-1 숙달 판정이 오염된다.
 * 4. 누계는 알려진 양 끝이 하한(그중 pass 수)과 상한(attempts − 그중 fail 수)을 정한다.
 */
function normalizeFacts(
  attempts: unknown,
  correct: unknown,
  firstResult: unknown,
  lastResult: unknown,
): AttemptFacts {
  const last = lastResult === "pass" || lastResult === "fail" ? lastResult : undefined;
  const rawFirst = firstResult === "pass" || firstResult === "fail" ? firstResult : undefined;
  // count 와 같은 잣대를 쓴다 — 0·음수·NaN·안전 정수 밖은 "살아 있는 값"이 아니다
  const statedCount = count(attempts, 0);
  const stated = statedCount >= 1 ? statedCount : undefined;
  const knownCorrect = count(correct, 0);
  // 양 끝이 서로 다르면 서로 다른 시도(≥2), 하나라도 알면 ≥1, 아무것도 모르면 0(= 이력 없음)
  const endsFloor =
    rawFirst !== undefined && last !== undefined && rawFirst !== last
      ? 2
      : rawFirst !== undefined || last !== undefined
        ? 1
        : 0;
  // **오답으로 알려진 양 끝은 정답 시도와 겹칠 수 없으므로 정답 횟수에 더해진다** (PR #202
  // Codex P2): `{correct:2, first:"fail", last:"pass"}` 는 정답 2회 + 오답인 첫 시도 = 최소 3회다.
  // 이걸 안 더하면 attempts 가 2로 추론되고 아래 상한 클램프가 정답 하나를 지운다.
  // 양 끝이 둘 다 오답일 때 서로 다른 시도인지는 정답이 하나라도 있어야 확정된다.
  const failEnds = (rawFirst === "fail" ? 1 : 0) + (last === "fail" ? 1 : 0);
  const countsFloor = knownCorrect + (failEnds === 2 && knownCorrect === 0 ? 1 : failEnds);
  // 추론 하한(endsFloor·countsFloor)은 **stated 가 없을 때만** 쓴다 — 하나라도 바깥에 두면
  // 살아 있는 attempts 를 덮어 규칙 1이 깨진다. `knownCorrect` 가 바깥에 있던 동안
  // `{attempts:1, correct:3, first:"fail", last:"pass"}` 가 3회로 부풀고 거짓 첫 오답까지
  // 살아남았다 (PR #202 Codex P2). stated 가 살아 있는데 누계와 모순이면 **누계 쪽을** 아래
  // 클램프가 깎는다 — 서로 모순인 두 손상값 중 하나를 골라야 하고, 규칙 1이 그 선택을 고정한다.
  // 바깥에 남는 하한은 "마지막 결과를 안다 = 최소 1회 채점됐다" 하나뿐이다 (아무것도 모르면 0).
  // 하한 계산에도 덧셈이 있으므로 여기서 포화시킨다 — **이 함수는 자기 검증(`count`)이
  // 거절할 값을 내보내지 않는다**. 한 군데(반환 직전)에서 묶어야 안쪽 산술이 늘어나도
  // 같은 구멍이 다시 생기지 않는다 (PR #202 Codex P2 — 11라운드 불변식을 추론 경로까지 확장).
  const n = saturate(Math.max(stated ?? Math.max(endsFloor, countsFloor), last !== undefined ? 1 : 0));
  // 시도 1회면 양 끝이 같은 시도다 — 알려진 쪽(마지막 결과 우선)으로 첫 결과를 채운다
  const first = n === 1 ? (last ?? rawFirst) : rawFirst;
  const endpoints = n === 1 ? [first] : [first, last];
  const knownPass = endpoints.filter((r) => r === "pass").length;
  const knownFail = endpoints.filter((r) => r === "fail").length;
  return {
    attempts: n,
    correct: saturate(Math.min(Math.max(count(correct, 0), knownPass), Math.max(n - knownFail, 0))),
    firstResult: first,
  };
}

function repairQuestion(raw: unknown): QuestionRecord | undefined {
  if (!isRecord(raw)) return undefined;
  const lastResult = raw.lastResult === "pass" || raw.lastResult === "fail" ? raw.lastResult : undefined;
  if (lastResult === undefined || !isIsoInstant(raw.lastAt)) return undefined;
  return {
    ...raw,   // 알 수 없는 필드는 그대로 통과 (§4-3 — 구버전 세션이 신버전 필드를 지우지 않도록)
    ...normalizeFacts(raw.attempts, raw.correct, raw.firstResult, lastResult),
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
  // 이전 상태를 사실 3종으로 환산한다. repair 가 살린 기록은 이미 정리돼 있고, 거절된 기록은
  // **로드 경로와 같은 함수**로 환산한다 — 규칙을 여기 복제하지 않는 것이 요점이다.
  const prior: AttemptFacts = prev
    ? { attempts: prev.attempts, correct: prev.correct, firstResult: prev.firstResult }
    : normalizeFacts(salvaged?.attempts, salvaged?.correct, salvaged?.firstResult, salvaged?.lastResult);
  data.questions[gk] = {
    ...salvaged,   // 못 고친 기록의 미지 필드 보존 (아래에서 아는 필드는 전부 덮어쓴다)
    ...prev,
    // **이 저장소는 자기 repair 가 거절할 값을 절대 쓰지 않는다** — 그 불변식이 깨지면 방금
    // 쓴 기록을 다음 로드가 손상으로 보고 이력을 재구성해 버린다. `count` 가 안전 정수까지만
    // 받으므로 증가도 거기서 멈춘다 (PR #202 Codex P2 — 상한에서 넘치는 대신 포화시킨다).
    attempts: saturate(prior.attempts + 1),
    correct: saturate(prior.correct + (passed ? 1 : 0)),
    lastResult: result,
    lastAt: new Date().toISOString(),
    // 이력이 하나도 없을 때만 이번 결과가 첫 결과다. 이력이 있는데 첫 결과를 모르는 경우
    // (이 필드 이전에 저장된 다회 시도 기록)는 **모르는 채로 둔다** — 지금 결과를 첫 결과로
    // 적으면 나중 시도가 첫 시도로 영구히 오기입되어 숙달 판정이 뒤집힌다
    firstResult: prior.attempts === 0 ? result : prior.firstResult,
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
