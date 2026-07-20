/**
 * validate-content 픽스처 — 각 규칙을 고의로 깨뜨린 입력이 실제로 잡히는지,
 * 적법한 입력(빈 quiz 포함)은 통과하는지 확인한다.
 *
 * 실행: `npm run validate:test`. 하나라도 어긋나면 종료 코드 1.
 * (프로덕션 검사가 아니라 검사기 자체의 회귀 테스트다.)
 */
import { validateChapters, type Problem } from "./validate-content.mts";
import type {
  ChapterData,
  Question,
  SectionMeta,
  SessionConcept,
  SessionData,
} from "../content/schema.ts";

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

function section(over: Partial<SectionMeta> = {}): SectionMeta {
  return { num: "01", title: "t", sub: "s", freq: "mid", freqLabel: "f", ...over };
}

function concept(over: Partial<SessionConcept> = {}): SessionConcept {
  return { id: "c1", section: "01", q: "질문?", a: "답", ...over };
}

/** 세션 기본값 — 개념 카드 1장, 도식·혼합 없음 (ch0-1 모양). */
function sess(over: Partial<SessionData> = {}): SessionData {
  return { concepts: [concept()], mixed: [], ...over };
}

function ch(
  chapterMeta: ReturnType<typeof meta>,
  quiz: Question[] = [],
  sections: SectionMeta[] = [section()],
  session?: SessionData
): ChapterData {
  return { chapterMeta, quiz, sections, session };
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

// 섹션 규약 (v2)
expectCaught("sections 빈 배열", [ch(meta("1-1"), [], [])], "SECTIONS_EMPTY");
expectCaught("섹션 title 공백", [ch(meta("1-1"), [], [section({ title: "  " })])], "SECTION_TITLE_EMPTY");
expectCaught("섹션 num 공백", [ch(meta("1-1"), [], [section({ num: "" })])], "SECTION_NUM_EMPTY");
expectCaught(
  "섹션 num 중복",
  [ch(meta("1-1"), [], [section(), section({ title: "t2" })])],
  "SECTION_NUM_DUP"
);

// 인출 세션 규약 (#58)
expectCaught(
  "concepts.section 이 실존하지 않는 섹션",
  [ch(meta("1-1"), [], [section({ num: "01" })], sess({ concepts: [concept({ section: "99" })] }))],
  "SESSION_SECTION_MISSING"
);
expectCaught(
  "concepts id 중복",
  [ch(meta("1-1"), [], [section()], sess({ concepts: [concept(), concept({ q: "다른 질문?" })] }))],
  "SESSION_ID_DUP"
);
expectCaught(
  "concept id 와 mixed id 충돌 (한 이름공간)",
  [
    ch(meta("1-1"), [], [section()], sess({
      mixed: [{ id: "c1", scenario: "s", service: "svc", why: "w", contrast: "c" }],
    })),
  ],
  "SESSION_ID_DUP"
);
expectCaught(
  "concept q 공백",
  [ch(meta("1-1"), [], [section()], sess({ concepts: [concept({ q: "   " })] }))],
  "SESSION_CONCEPT_EMPTY"
);
expectCaught(
  "diagram edges 개수 불일치 (nodes-1 아님)",
  [ch(meta("1-1"), [], [section()], sess({ diagram: { prompt: "p", nodes: ["a", "b", "c"], edges: ["x"] } }))],
  "SESSION_DIAGRAM_EDGES"
);
expectCaught(
  "diagram nodes 1개 (체인 불성립)",
  [ch(meta("1-1"), [], [section()], sess({ diagram: { prompt: "p", nodes: ["a"], edges: [] } }))],
  "SESSION_DIAGRAM_TOO_SHORT"
);

console.log("\n── 통과해야 하는 적법 입력 ──");

// 빈 레지스트리
expectClean("빈 레지스트리", []);

// 빈 quiz 는 적법 (schema: 빈 배열 적법)
expectClean("빈 quiz", [ch(meta("1-1"))]);

// session 없는 챕터는 적법 (ChapterData.session? optional — 점진 이행)
expectClean("session 없음", [ch(meta("1-1"), [], [section()], undefined)]);

// 카드 0장 + 도식 없음 + 혼합 없음 — 전부 빈 세션도 적법
expectClean("빈 session", [ch(meta("1-1"), [], [section()], { concepts: [], mixed: [] })]);

// ch0-1 모양: 카드가 일부 섹션에만 붙고(00 은 생략), diagram·mixed 없음
expectClean("정상 session(섹션 일부에만 카드·도식 없음)", [
  ch(
    meta("1-1"),
    [],
    [section({ num: "00" }), section({ num: "01", title: "t2" })],
    sess({ concepts: [concept({ id: "c1", section: "01" }), concept({ id: "c2", section: "01" })] })
  ),
]);

// 선형 체인 도식 + 혼합 — edges = nodes - 1
expectClean("정상 session(도식·혼합 포함)", [
  ch(meta("1-1"), [], [section()], {
    concepts: [concept()],
    diagram: { prompt: "p", nodes: ["a", "b", "c"], edges: ["x", "y"] },
    mixed: [{ id: "m1", scenario: "s", service: "svc", why: "w", contrast: "c" }],
  }),
]);

// 완전한 정상 챕터 — 복수정답 + choiceExplanations 일치 + 실존 prereq + 다중 섹션
expectClean("정상 챕터(복수정답·prereq·choiceExpl·다중 섹션)", [
  ch(meta("1-1")),
  ch(
    meta("1-2", ["1-1"]),
    [
      question({ id: "q1", answer: [0, 2], choiceExplanations: ["w", "x", "y", "z"] }),
      question({ id: "q2", scope: "final", concept: ["a", "b"] }),
    ],
    [section(), section({ num: "02", title: "t2" })]
  ),
]);

console.log("");
if (failures === 0) {
  console.log("✓ 모든 픽스처 통과");
} else {
  console.error(`✗ 픽스처 ${failures}건 실패`);
  process.exit(1);
}
