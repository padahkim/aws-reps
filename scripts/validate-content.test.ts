/**
 * validate-content 픽스처 — 각 규칙을 고의로 깨뜨린 입력이 실제로 잡히는지,
 * 적법한 입력(빈 quiz 포함)은 통과하는지 확인한다.
 *
 * 실행: `npm run validate:test`. 하나라도 어긋나면 종료 코드 1.
 * (프로덕션 검사가 아니라 검사기 자체의 회귀 테스트다.)
 */
import { validateChapters, validateGlossary, validateTermRefs, type Problem } from "./validate-content.ts";
import type {
  ChapterData,
  ChapterMeta,
  GlossaryTerm,
  Question,
  SectionMeta,
  SelfQuizEntry,
  SessionConcept,
  SessionData,
} from "../content/schema.ts";

let failures = 0;

function meta(id: string, prerequisites: string[] = [], over: Partial<ChapterMeta> = {}): ChapterMeta {
  return { id, phase: "P", title: `T-${id}`, domain: "foundation", examWeight: 1 as const, prerequisites, ...over };
}

/** 오리엔테이션 픽스처용 — num "01".."0N" 섹션 N개 (#161 파트 커버리지 검사). */
function sectionsUpTo(n: number): SectionMeta[] {
  return Array.from({ length: n }, (_, i) => section({ num: String(i + 1).padStart(2, "0"), title: `t${i + 1}` }));
}

const OBJECTIVES = ["…을 구분한다", "…을 고른다", "…을 설명한다"];

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

/** 도식 노드 — role·name 쌍 (#59). 테스트에서는 이름 하나로 둘 다 채운다. */
function dnode(name: string) {
  return { role: `${name} 역할`, name };
}

/** 세션 기본값 — 개념 카드 1장, 도식·혼합 없음 (ch0-1 모양). */
function sess(over: Partial<SessionData> = {}): SessionData {
  return { concepts: [concept()], mixed: [], ...over };
}

function ch(
  chapterMeta: ReturnType<typeof meta>,
  quiz: Question[] = [],
  sections: SectionMeta[] = [section()],
  session?: SessionData,
  selfQuiz?: SelfQuizEntry[]
): ChapterData {
  return { chapterMeta, quiz, sections, session, selfQuiz };
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

// 문항 id (#77 — 세션 id 규칙과 대칭)
expectCaught("문항 id 공백", [ch(meta("1-1"), [question({ id: "  " })])], "QUESTION_ID_EMPTY");
expectCaught(
  "문항 id 중복",
  [ch(meta("1-1"), [question({ id: "q1" }), question({ id: "q1", scenario: "s2" })])],
  "QUESTION_ID_DUP"
);

// 문항 값 비어있음 (#77)
expectCaught("scenario 공백", [ch(meta("1-1"), [question({ scenario: "   " })])], "SCENARIO_EMPTY");
expectCaught("explanation 공백", [ch(meta("1-1"), [question({ explanation: "" })])], "EXPLANATION_EMPTY");
expectCaught("choices 항목 빈 문자열", [ch(meta("1-1"), [question({ choices: ["a", "", "c", "d"] })])], "CHOICE_EMPTY");

// choiceExplanations 항목 비어있음 (#145) — 길이는 맞는데 칸이 빈 경우
expectCaught(
  "choiceExpl 항목 빈 문자열",
  [ch(meta("1-1"), [question({ choiceExplanations: ["w", "", "y", "z"] })])],
  "CHOICE_EXPL_EMPTY"
);
expectCaught(
  "choiceExpl 항목 공백만",
  [ch(meta("1-1"), [question({ choiceExplanations: ["w", "x", "   ", "z"] })])],
  "CHOICE_EXPL_EMPTY"
);

// 섹션 규약 (v2)
expectCaught("sections 빈 배열", [ch(meta("1-1"), [], [])], "SECTIONS_EMPTY");
expectCaught("섹션 title 공백", [ch(meta("1-1"), [], [section({ title: "  " })])], "SECTION_TITLE_EMPTY");
expectCaught("섹션 num 공백", [ch(meta("1-1"), [], [section({ num: "" })])], "SECTION_NUM_EMPTY");
expectCaught(
  "섹션 num 중복",
  [ch(meta("1-1"), [], [section(), section({ title: "t2" })])],
  "SECTION_NUM_DUP"
);

// 섹션 num 형식·연속성 (#77)
expectCaught("섹션 num 한 자리", [ch(meta("1-1"), [], [section({ num: "1" })])], "SECTION_NUM_FORMAT");
expectCaught("섹션 num 비숫자", [ch(meta("1-1"), [], [section({ num: "01a" })])], "SECTION_NUM_FORMAT");
expectCaught(
  "섹션 num 시작값 어긋남 (02 부터)",
  [ch(meta("1-1"), [], [section({ num: "02" })])],
  "SECTION_NUM_SEQUENCE"
);
expectCaught(
  "섹션 num 불연속 (01 → 03)",
  [ch(meta("1-1"), [], [section({ num: "01" }), section({ num: "03", title: "t2" })])],
  "SECTION_NUM_SEQUENCE"
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
  "concept why.q 공백",
  [ch(meta("1-1"), [], [section()], sess({ concepts: [concept({ why: { q: "   " } })] }))],
  "SESSION_WHY_EMPTY"
);
expectCaught(
  "concept why.a 빈 문자열 (모범답 있으면 비지 않아야)",
  [ch(meta("1-1"), [], [section()], sess({ concepts: [concept({ why: { q: "왜?", a: "" } })] }))],
  "SESSION_WHY_ANSWER_EMPTY"
);
expectCaught(
  "diagram edges 개수 불일치 (nodes-1 아님)",
  [ch(meta("1-1"), [], [section()], sess({ diagram: { prompt: "p", nodes: [dnode("a"), dnode("b"), dnode("c")], edges: ["x"] } }))],
  "SESSION_DIAGRAM_EDGES"
);
expectCaught(
  "diagram nodes 1개 (체인 불성립)",
  [ch(meta("1-1"), [], [section()], sess({ diagram: { prompt: "p", nodes: [dnode("a")], edges: [] } }))],
  "SESSION_DIAGRAM_TOO_SHORT"
);

// 세션 값 비어있음 (#77)
expectCaught(
  "diagram prompt 공백",
  [ch(meta("1-1"), [], [section()], sess({ diagram: { prompt: "  ", nodes: [dnode("a"), dnode("b")], edges: ["x"] } }))],
  "SESSION_DIAGRAM_PROMPT_EMPTY"
);
expectCaught(
  "diagram node role 공백 (#59 — role·name 쌍)",
  [ch(meta("1-1"), [], [section()], sess({ diagram: { prompt: "p", nodes: [{ role: "  ", name: "a" }, dnode("b")], edges: ["x"] } }))],
  "SESSION_DIAGRAM_NODE_EMPTY"
);
expectCaught(
  "mixed scenario 공백",
  [
    ch(meta("1-1"), [], [section()], sess({
      mixed: [{ id: "m1", scenario: "  ", service: "svc", why: "w", contrast: "c" }],
    })),
  ],
  "SESSION_MIXED_EMPTY"
);
expectCaught(
  "mixed contrast 공백",
  [
    ch(meta("1-1"), [], [section()], sess({
      mixed: [{ id: "m1", scenario: "s", service: "svc", why: "w", contrast: "" }],
    })),
  ],
  "SESSION_MIXED_EMPTY"
);

// ── 오리엔테이션 (v3.1, #161) ─────────────────────────────────────────
expectCaught(
  "objectives 2개 (하한 미달)",
  [ch(meta("1-1", [], { objectives: ["a", "b"] }))],
  "OBJECTIVES_COUNT"
);
expectCaught(
  "objectives 6개 (상한 초과)",
  [ch(meta("1-1", [], { objectives: ["a", "b", "c", "d", "e", "f"] }))],
  "OBJECTIVES_COUNT"
);
expectCaught(
  "objectives 항목 공백",
  [ch(meta("1-1", [], { objectives: ["a", "  ", "c"] }))],
  "OBJECTIVE_EMPTY"
);
expectCaught(
  "parts 빈 배열",
  [ch(meta("1-1", [], { parts: [] }))],
  "PARTS_EMPTY"
);
expectCaught(
  "파트 title 공백",
  [ch(meta("1-1", [], { parts: [{ title: " ", from: "01", to: "01" }] }))],
  "PART_TITLE_EMPTY"
);
expectCaught(
  "파트 from 이 미존재 섹션",
  [ch(meta("1-1", [], { parts: [{ title: "p", from: "09", to: "01" }] }), [], sectionsUpTo(2))],
  "PART_SECTION_MISSING"
);
expectCaught(
  "파트 범위 뒤집힘",
  [ch(meta("1-1", [], { parts: [{ title: "p", from: "02", to: "01" }] }), [], sectionsUpTo(2))],
  "PART_RANGE_REVERSED"
);
expectCaught(
  "파트 사이에 빠진 섹션",
  [
    ch(
      meta("1-1", [], { parts: [{ title: "p1", from: "01", to: "01" }, { title: "p2", from: "03", to: "04" }] }),
      [],
      sectionsUpTo(4)
    ),
  ],
  "PART_COVERAGE"
);
expectCaught(
  "파트 범위 겹침",
  [
    ch(
      meta("1-1", [], { parts: [{ title: "p1", from: "01", to: "03" }, { title: "p2", from: "03", to: "04" }] }),
      [],
      sectionsUpTo(4)
    ),
  ],
  "PART_COVERAGE"
);
expectCaught(
  "파트가 첫 섹션부터 시작하지 않음",
  [ch(meta("1-1", [], { parts: [{ title: "p", from: "02", to: "03" }] }), [], sectionsUpTo(3))],
  "PART_COVERAGE"
);
expectCaught(
  "파트가 마지막 섹션까지 덮지 않음",
  [ch(meta("1-1", [], { parts: [{ title: "p", from: "01", to: "02" }] }), [], sectionsUpTo(4))],
  "PART_COVERAGE"
);

// 셀프 퀴즈 yn (#150 — 판정형 표시는 "예"|"아니오"만. TS 밖 데이터 유입 대비 런타임 검사)
expectCaught(
  "selfQuiz yn 허용 밖 값",
  [ch(meta("1-1"), [], [section()], undefined, [{ section: "01", q: "되나?", a: "안 된다", yn: "no" as SelfQuizEntry["yn"] }])],
  "SELFQUIZ_YN_INVALID"
);
expectCaught(
  "selfQuiz yn 빈 문자열",
  [ch(meta("1-1"), [], [section()], undefined, [{ section: "01", q: "되나?", a: "안 된다", yn: "" as SelfQuizEntry["yn"] }])],
  "SELFQUIZ_YN_INVALID"
);

console.log("\n── 통과해야 하는 적법 입력 ──");

// 셀프 퀴즈: yn 태깅·미태깅 혼재는 적법 (#150 — yn 은 optional, 없으면 서술형)
expectClean("정상 selfQuiz(yn 태깅+미태깅 혼재)", [
  ch(meta("1-1"), [], [section()], undefined, [
    { section: "01", q: "되나?", a: "안 된다", yn: "아니오" },
    { section: "01", q: "가능한가?", a: "가능하다", yn: "예" },
    { section: "01", q: "무엇인가?", a: "이것" },
  ]),
]);

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

// 섹션 num 00 시작 + 연속 (#77 — ch0-1 이 동기 서문을 "00" 으로 쓴다)
expectClean("정상 섹션 num(00 시작·4개 연속)", [
  ch(meta("1-1"), [], [
    section({ num: "00" }),
    section({ num: "01", title: "t2" }),
    section({ num: "02", title: "t3" }),
    section({ num: "03", title: "t4" }),
  ]),
]);

// why 정교화 질문만 (모범답 미기입 — 콘텐츠 이행 전 상태)
expectClean("정상 session(why 질문만)", [
  ch(meta("1-1"), [], [section()], sess({ concepts: [concept({ why: { q: "왜 그럴까요?" } })] })),
]);

// why 질문 + 모범답 (신형식 완성)
expectClean("정상 session(why 질문+모범답)", [
  ch(
    meta("1-1"),
    [],
    [section()],
    sess({ concepts: [concept({ why: { q: "왜 그럴까요?", a: "…이기 때문." } })] })
  ),
]);

// 선형 체인 도식 + 혼합 — edges = nodes - 1
expectClean("정상 session(도식·혼합 포함)", [
  ch(meta("1-1"), [], [section()], {
    concepts: [concept()],
    diagram: { prompt: "p", nodes: [dnode("a"), dnode("b"), dnode("c")], edges: ["x", "y"] },
    mixed: [{ id: "m1", scenario: "s", service: "svc", why: "w", contrast: "c" }],
  }),
]);

// 오리엔테이션 없음 = 점진 적용 중 (v3.1 필드는 전부 optional)
expectClean("오리엔테이션 없음", [ch(meta("1-1"), [], sectionsUpTo(4))]);

// objectives 3개·5개 (경계값) + 전 섹션을 덮는 파트 3개 (한 섹션짜리 파트 포함)
expectClean("정상 오리엔테이션(objectives 3개·파트 연속 커버)", [
  ch(
    meta("1-1", [], {
      objectives: OBJECTIVES,
      parts: [
        { title: "p1", from: "01", to: "02" },
        { title: "p2", from: "03", to: "03" },
        { title: "p3", from: "04", to: "05" },
      ],
    }),
    [],
    sectionsUpTo(5)
  ),
]);
expectClean("정상 오리엔테이션(objectives 5개·파트 없음)", [
  ch(meta("1-1", [], { objectives: [...OBJECTIVES, "…을 비교한다", "…을 판단한다"] }), [], sectionsUpTo(3)),
]);

// choiceExplanations 는 optional (schema.ts) — 필드 자체를 생략한 문항은 적법하다.
// 있을 때 네 칸이 다 차 있으면 역시 적법 (#145 가 잡는 건 "있는데 빈 칸"뿐).
expectClean("choiceExpl 생략", [ch(meta("1-1"), [question()])]);
expectClean("choiceExpl 네 칸 모두 채움", [ch(meta("1-1"), [question({ choiceExplanations: ["w", "x", "y", "z"] })])]);

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

// ── 용어집 (#57 결정 1 — validateGlossary) ──────────────────────────────────

function gterm(over: Partial<GlossaryTerm> = {}): GlossaryTerm {
  return { id: "s3", term: "S3", short: "설명 한 줄", ...over };
}

/** 용어집 검사는 chapters 를 함께 받는다 (chapterId 실존 검증) — 픽스처 챕터는 "1-1" 하나. */
const GLOSSARY_CHAPTERS = [ch(meta("1-1"))];

function expectGlossaryCaught(label: string, terms: GlossaryTerm[], code: string) {
  const found = codes(validateGlossary(terms, GLOSSARY_CHAPTERS));
  if (found.has(code)) {
    console.log(`  ✓ ${label} → ${code}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}: ${code} 기대했으나 미검출 (검출: ${[...found].join(", ") || "없음"})`);
  }
}

function expectGlossaryClean(label: string, terms: GlossaryTerm[]) {
  const found = validateGlossary(terms, GLOSSARY_CHAPTERS);
  if (found.length === 0) {
    console.log(`  ✓ ${label} → 통과`);
  } else {
    failures++;
    console.error(`  ✗ ${label}: 통과 기대했으나 위반 ${found.length}건 (${found.map((p) => p.code).join(", ")})`);
  }
}

console.log("\n── 용어집: 검출되어야 하는 위반 ──");

expectGlossaryCaught("id 빈 문자열", [gterm({ id: "  " })], "GLOSSARY_ID_EMPTY");
expectGlossaryCaught("id 대문자", [gterm({ id: "S3" })], "GLOSSARY_ID_FORMAT");
expectGlossaryCaught("id 공백 포함", [gterm({ id: "edge location" })], "GLOSSARY_ID_FORMAT");
expectGlossaryCaught("id 특수문자($LATEST)", [gterm({ id: "$latest" })], "GLOSSARY_ID_FORMAT");
expectGlossaryCaught("id 중복", [gterm(), gterm({ term: "다른 용어" })], "GLOSSARY_ID_DUP");
expectGlossaryCaught("term 빈 문자열", [gterm({ term: " " })], "GLOSSARY_TERM_EMPTY");
expectGlossaryCaught("term 표기 중복", [gterm(), gterm({ id: "s3-dup" })], "GLOSSARY_TERM_DUP");
expectGlossaryCaught("term 공백 변형 중복", [gterm(), gterm({ id: "s3-b", term: "S3 " })], "GLOSSARY_TERM_DUP");
expectGlossaryCaught("short 빈 문자열", [gterm({ short: "" })], "GLOSSARY_SHORT_EMPTY");
expectGlossaryCaught("full 빈 문자열", [gterm({ full: " " })], "GLOSSARY_FIELD_EMPTY");
expectGlossaryCaught("detail 빈 문자열", [gterm({ detail: "" })], "GLOSSARY_FIELD_EMPTY");
expectGlossaryCaught("chapterId 미존재 참조", [gterm({ chapterId: "ghost-9" })], "GLOSSARY_CHAPTER_MISSING");

console.log("\n── 용어집: 통과해야 하는 케이스 ──");

// 빈 용어집도 적법 — 데이터가 채워지기 전 상태에서 검사기가 죽지 않아야 한다
expectGlossaryClean("빈 용어집", []);
// 필수 필드만 (full·detail·chapterId 전부 생략) — optional 생략은 적법한 표현
expectGlossaryClean("필수 필드만", [gterm()]);
// 전 필드 + 실존 chapterId + 케밥 케이스 id
expectGlossaryClean("전 필드(실존 chapterId·케밥 id)", [
  gterm({
    id: "edge-location",
    term: "엣지 로케이션",
    full: "Edge Location",
    short: "사용자 가까이에 둔 캐시 거점.",
    detail: "문단 하나.\n\n문단 둘.",
    chapterId: "1-1",
  }),
]);

// ── 본문 Term 참조 (#193 — validateTermRefs) ────────────────────────────────

const TERM_IDS = new Set(["region", "s3"]);

function srcFile(source: string, path = "content/chapters/ch1-1/sections/01.mdx") {
  return [{ path, source }];
}

function expectTermCaught(label: string, files: { path: string; source: string }[], code: string) {
  const found = codes(validateTermRefs(files, TERM_IDS));
  if (found.has(code)) {
    console.log(`  ✓ ${label} → ${code}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}: ${code} 기대했으나 미검출 (검출: ${[...found].join(", ") || "없음"})`);
  }
}

function expectTermClean(label: string, files: { path: string; source: string }[]) {
  const found = validateTermRefs(files, TERM_IDS);
  if (found.length === 0) {
    console.log(`  ✓ ${label} → 통과`);
  } else {
    failures++;
    console.error(`  ✗ ${label}: 통과 기대했으나 위반 ${found.length}건 (${found.map((p) => p.code).join(", ")})`);
  }
}

console.log("\n── Term 참조: 검출되어야 하는 위반 ──");

expectTermCaught("없는 id 참조", srcFile('<Term id="ghost">유령</Term>'), "TERM_REF_UNKNOWN");
expectTermCaught("동적 id 표현", srcFile("<Term id={termId}>리전</Term>"), "TERM_REF_UNPARSEABLE");
expectTermCaught("id 속성 누락", srcFile("<Term>리전</Term>"), "TERM_REF_UNPARSEABLE");
// 리터럴 id가 있어도 스프레드가 런타임에 덮어쓸 수 있다 (PR #213 Codex) — 표현식 일체 금지
expectTermCaught("리터럴 id + 스프레드", srcFile('<Term id="region" {...props}>리전</Term>'), "TERM_REF_UNPARSEABLE");
expectTermCaught(
  "여러 참조 중 하나만 위반",
  srcFile('<Term id="region">리전</Term>과 <Term id="ghost">유령</Term>'),
  "TERM_REF_UNKNOWN"
);

console.log("\n── Term 참조: 통과해야 하는 케이스 ──");

expectTermClean("실존 id 참조", srcFile('<Term id="region">리전</Term>'));
expectTermClean("children 생략(self-closing)", srcFile('<Term id="s3" />'));
expectTermClean("속성 줄바꿈", srcFile('<Term\n  id="region"\n>리전</Term>'));
expectTermClean("Term 미사용 파일", srcFile("일반 본문 문단. TermX 나 </Term> 비슷한 문자열은 무해."));
expectTermClean("유사 컴포넌트명(TermCard)은 무시", srcFile('<TermCard id="ghost" />'));

console.log("");
if (failures === 0) {
  console.log("✓ 모든 픽스처 통과");
} else {
  console.error(`✗ 픽스처 ${failures}건 실패`);
  process.exit(1);
}
