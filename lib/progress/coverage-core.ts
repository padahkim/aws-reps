/**
 * 진도·커버리지 계산의 **순수 층** (#235) — "얼마나 왔나"를 내는 집계만 있다.
 * 설계 정본: docs/design/LEARNING_LOOP_DRAFT.md §3-1(전체 진행률·D6)·§3-2(도메인 커버리지).
 *
 * `completion-core.ts` 와 같은 이유로 순수하다 (#214): 여기 결함은 화면에 "고장"으로 안
 * 보인다 — "열람 완료"가 분자에서 빠지거나 도메인 하나가 통째로 사라져도 그럴듯한 숫자가
 * 나온다. 잘못된 진행률은 사용자가 자기 위치를 잘못 알게 하는 종류의 오류라, `window` 를
 * 모르는 함수만 여기 모아 `coverage-core.test.ts`(`npm run progress:test`)가 CI 에서 돌린다.
 *
 * 챕터 하나의 판정(`ChapterStatus`)은 `completion-core.ts` 소관이고 여기서 다시 하지 않는다 —
 * 이 파일은 판정 결과를 받아 **세기만** 한다. 저장하는 값도 없다(§4-1 "파생 가능한 값은
 * 저장하지 않는다") — 전부 읽는 쪽의 런타임 조인이다.
 */
import type { ChapterStatus } from "./completion-core.ts";

/**
 * 진행률의 분자로 세는 등급 (§3-1) — **"열람 완료" 포함**이 요점이다 (D4·D6). 퀴즈가 없어
 * 열람만으로 닫힌 챕터를 빼면, #29 로 퀴즈 없는 레거시가 들어오는 내내 진행률이 눌린다.
 */
export function countsAsDone(status: ChapterStatus): boolean {
  return status !== "미완료";
}

/** 도메인 하나의 커버리지 재료 (§3-2). 표시(시험 비중 병기)는 화면 몫이다. */
export interface DomainCoverage {
  domain: string;
  done: number;    // 완료 챕터 수 ("열람 완료" 포함 — countsAsDone)
  total: number;   // 그 도메인의 전체 챕터 수
}

/**
 * 도메인별 커버리지 (§3-2) = 완료 챕터 수 ÷ 그 도메인 전체 챕터 수.
 *
 * - 귀속은 받은 `domain` 값 그대로다 — "0단계(기반) 챕터처럼 귀속이 애매한 것은 meta 에 적힌
 *   값을 그대로 따른다. 학습 루프가 재분류하지 않는다"(§3-2). `foundation` 도 한 줄이 된다.
 * - 순서는 **첫 등장 순서**다. 입력이 레지스트리(=커리큘럼) 순서로 오므로 그 순서가 곧
 *   학습 순서다 — 여기서 정렬을 더하면 두 화면이 다른 순서를 갖게 될 뿐이다.
 * - 판정이 없는 챕터(`statusById` 에 키 없음)는 "미완료"로 센다 — 분모에서 빼면 아직 손대지
 *   않은 챕터가 커버리지를 부풀린다.
 */
export function domainCoverage(
  chapters: readonly { id: string; domain: string }[],
  statusById: Readonly<Record<string, ChapterStatus>>,
): DomainCoverage[] {
  const slots = new Map<string, DomainCoverage>();
  for (const { id, domain } of chapters) {
    let slot = slots.get(domain);
    if (!slot) {
      slot = { domain, done: 0, total: 0 };
      slots.set(domain, slot);
    }
    slot.total += 1;
    if (countsAsDone(statusById[id] ?? "미완료")) slot.done += 1;
  }
  return [...slots.values()];
}
