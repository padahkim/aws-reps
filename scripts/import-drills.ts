/**
 * aws-cloud-drills 퀴즈 임포트 어댑터 (이슈 #6).
 *
 * 원본: ~/pdk/projects/aws-cloud-drills/data/questions/<subject>.json
 *       (스키마: 그 리포의 types/quiz.ts — slug·title·question·choices·answers·
 *        answerSummary·explanation[]·wrongChoiceNotes·difficulty·domain·tags·references)
 * 출력: content/chapters/<chapterId>/drills.ts — `export const quiz: Question[]` (커밋되는 생성물.
 *       손편집 금지 — 수정은 원본 리포에서 하고 이 스크립트를 재실행한다.)
 *
 * 변환 규칙 (content/schema.ts Question 기준, 정보 손실 최소화):
 *   question           → scenario
 *   answers            → answer
 *   explanation[]      → explanation ("\n\n" 문단 병합 — 렌더러가 다시 분할)
 *   wrongChoiceNotes   → choiceExplanations (choices 전체 길이 배열로 확장;
 *   + answerSummary       정답 칸은 "정답. " + answerSummary — 기존 수기 문항의 관례와 동일)
 *   title·difficulty·references → 동명 optional 필드로 보존
 *   tags               → concept (챕터 과목과 같은 태그는 중복이라 제외, 전부 겹치면 원본 유지)
 *   slug               → 동명 필드 (부분 선별의 안정 키 — #69 Codex 리뷰) + 문항 위 주석
 *   domain(번호)       → 버림 — chapterMeta.domain이 챕터 수준에서 이미 커버
 *
 * 실행: node scripts/import-drills.ts [subject ...]   (무인자 = 매핑된 전 과목)
 *       원본 위치 재정의: DRILLS_DIR=/path/to/aws-cloud-drills
 */
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Question } from "../content/schema.ts";

/** drills 과목 파일명 → aws-reps 챕터 id. 새 챕터 변환 시 여기에 한 줄 추가. */
const SUBJECT_TO_CHAPTER: Record<string, string> = {
  s3: "ch1-1",
  lambda: "ch1-2",
  "aws-basics": "ch0-1",
  iam: "ch0-2",
};

interface DrillsQuestion {
  slug: string;
  chapterId: string;
  title: string;
  question: string;
  choices: string[];
  answers: number[];
  answerSummary: string;
  explanation: string[];
  wrongChoiceNotes: { choice: number; note: string }[];
  difficulty: "easy" | "medium" | "hard";
  domain: number;
  tags: string[];
  references: { title: string; url: string }[];
}

function convert(subject: string, src: DrillsQuestion[]): Question[] {
  return src.map((d, i) => {
    // 정답/오답 해설을 choices 전체 길이 배열로 짠다 — 빠진 칸은 데이터 결함이므로 즉시 실패.
    const choiceExplanations = d.choices.map((_, idx) => {
      if (d.answers.includes(idx)) return `정답. ${d.answerSummary}`;
      const note = d.wrongChoiceNotes.find((w) => w.choice === idx);
      if (!note) throw new Error(`${subject}/${d.slug}: 오답 선택지 ${idx}에 wrongChoiceNote 없음`);
      return note.note;
    });

    const concept = d.tags.filter((t) => t !== subject);

    return {
      id: `q${i + 1}`,
      slug: d.slug,
      scope: "final" as const,
      concept: concept.length > 0 ? concept : d.tags,
      scenario: d.question,
      choices: d.choices,
      answer: d.answers,
      explanation: d.explanation.join("\n\n"),
      choiceExplanations,
      title: d.title,
      difficulty: d.difficulty,
      references: d.references,
    };
  });
}

function render(subject: string, src: DrillsQuestion[], questions: Question[]): string {
  const items = questions
    .map((q, i) => `  // source: ${src[i].slug}\n${JSON.stringify(q, null, 2).replace(/^/gm, "  ")},`)
    .join("\n");
  return `/**
 * 생성물 — 손편집 금지. \`node scripts/import-drills.ts ${subject}\` 재실행으로 갱신.
 * 원본: aws-cloud-drills data/questions/${subject}.json (${questions.length}문항)
 */
import type { Question } from "../../schema";

export const quiz: Question[] = [
${items}
];
`;
}

const drillsDir = process.env.DRILLS_DIR ?? join(homedir(), "pdk/projects/aws-cloud-drills");
const repoRoot = new URL("..", import.meta.url).pathname;
const subjects = process.argv.slice(2).length > 0 ? process.argv.slice(2) : Object.keys(SUBJECT_TO_CHAPTER);

for (const subject of subjects) {
  const chapterId = SUBJECT_TO_CHAPTER[subject];
  if (!chapterId) {
    console.error(`✗ "${subject}" 는 SUBJECT_TO_CHAPTER 에 없는 과목 (등록: ${Object.keys(SUBJECT_TO_CHAPTER).join(", ")})`);
    process.exit(1);
  }
  const srcPath = join(drillsDir, "data/questions", `${subject}.json`);
  const src: DrillsQuestion[] = JSON.parse(readFileSync(srcPath, "utf8"));
  const questions = convert(subject, src);
  const outPath = join(repoRoot, "content/chapters", chapterId, "drills.ts");
  writeFileSync(outPath, render(subject, src, questions));
  console.log(`✓ ${subject} → ${chapterId}/drills.ts (${questions.length}문항)`);
}
