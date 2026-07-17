/**
 * validate-content 픽스처 — 각 규칙을 고의로 깨뜨린 입력이 실제로 잡히는지,
 * 적법한 입력(빈 quiz 포함)은 통과하는지 확인한다.
 *
 * 실행: `npm run validate:test`. 하나라도 어긋나면 종료 코드 1.
 * (프로덕션 검사가 아니라 검사기 자체의 회귀 테스트다.)
 */
import { validateChapters, type Problem } from "./validate-content.mts";
import type { ChapterData, Question } from "../content/schema.ts";

let failures = 0;

function meta(id: string, prerequisites: string[] = []) {
  return { id, phase: "P", title: `T-${id}`, domain: "foundation", examWeight: 1 as const, prerequisites };
}

function question(over: Partial<Question> = {}): Question {
  return {
    id: "q1",
    scope: "mini",
    concept: ["c"],
    scenario: "s",
    choices: ["a", "b", "c", "d"],
    answer: [0],
    explanation: "e",
    ...over,
  };
}

function ch(chapterMeta: ReturnType<typeof meta>, quiz: Question[] = []): ChapterData {
  return { chapterMeta, quiz };
}

function codes(problems: Problem[]): Set<string> {
  return new Set(problems.map((p) => p.code));
}

/** 이 입력이 `code` 위반을 내는지 확인 (검출 케이스). */
function expectCaught(label: string, input: ChapterData[], code: string) {
  const found = codes(validateChapters(input));
  if (found.has(code)) {
    console.log(`  ✓ ${label} → ${code}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}: ${code} 기대했으나 미검출 (검출: ${[...found].join(", ") || "없음"})`);
  }
}

/** 이 입력이 어떤 위반도 내지 않는지 확인 (통과 케이스). */
function expectClean(label: string, input: ChapterData[]) {
  const found = validateChapters(input);
  if (found.length === 0) {
    console.log(`  ✓ ${label} → 통과`);
  } else {
    failures++;
    console.error(`  ✗ ${label}: 통과 기대했으나 위반 ${found.length}건 (${found.map((p) => p.code).join(", ")})`);
  }
}

console.log("── 검출되어야 하는 위반 ──");

// answer 인덱스가 choices 범위 밖
expectCaught("answer 범위 초과", [ch(meta("1-1"), [question({ choices: ["a", "b"], answer: [5] })])], "ANSWER_OUT_OF_RANGE");
expectCaught("answer 음수", [ch(meta("1-1"), [question({ answer: [-1] })])], "ANSWER_OUT_OF_RANGE");

// choiceExplanations 길이 ≠ choices 길이
expectCaught("choiceExplanations 길이 불일치", [ch(meta("1-1"), [question({ choices: ["a", "b", "c", "d"], choiceExplanations: ["x", "y"] })])], "CHOICE_EXPL_LENGTH");

// concept 비어있음
expectCaught("concept 빈 배열", [ch(meta("1-1"), [question({ concept: [] })])], "CONCEPT_EMPTY");
expectCaught("concept 빈 문자열", [ch(meta("1-1"), [question({ concept: ["  "] })])], "CONCEPT_EMPTY");

// prerequisites 가 실존하지 않는 챕터 참조
expectCaught("prereq 미존재 참조", [ch(meta("1-1", ["ghost-9"]))], "PREREQ_MISSING");

// 챕터 id 중복
expectCaught("id 중복", [ch(meta("1-1")), ch(meta("1-1"))], "DUPLICATE_ID");

// 보조 규칙
expectCaught("choices 부족", [ch(meta("1-1"), [question({ choices: ["a"], answer: [0] })])], "CHOICES_TOO_FEW");
expectCaught("answer 빈 배열", [ch(meta("1-1"), [question({ answer: [] })])], "ANSWER_EMPTY");
expectCaught("answer 중복 인덱스", [ch(meta("1-1"), [question({ answer: [1, 1] })])], "ANSWER_DUPLICATE");
expectCaught("prereq 자기참조", [ch(meta("1-1", ["1-1"]))], "PREREQ_SELF");

console.log("\n── 통과해야 하는 적법 입력 ──");

// 빈 레지스트리
expectClean("빈 레지스트리", []);

// 빈 quiz 는 적법 (schema: 빈 배열 적법)
expectClean("빈 quiz", [ch(meta("1-1"))]);

// 완전한 정상 챕터 — 복수정답 + choiceExplanations 일치 + 실존 prereq
expectClean("정상 챕터(복수정답·prereq·choiceExpl)", [
  ch(meta("1-1")),
  ch(meta("1-2", ["1-1"]), [
    question({ id: "q1", answer: [0, 2], choiceExplanations: ["w", "x", "y", "z"] }),
    question({ id: "q2", scope: "final", concept: ["a", "b"] }),
  ]),
]);

console.log("");
if (failures === 0) {
  console.log("✓ 모든 픽스처 통과");
} else {
  console.error(`✗ 픽스처 ${failures}건 실패`);
  process.exit(1);
}
