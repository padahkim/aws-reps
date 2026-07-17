/**
 * 콘텐츠 규약 정적 검사 — tsc가 못 잡는 "값 수준" 계약 위반을 잡는다.
 * 정본 계약: content/schema.ts. 여기서는 그 계약이 값에서 지켜지는지 검사한다.
 *
 * 실행: `npm run validate` (build 앞에 자동 연결됨).
 * 순수 함수 validateChapters()를 export 해 픽스처(*.test.mts)가 직접 먹인다.
 */
import type { ChapterData } from "../content/schema.ts";

export interface Problem {
  chapterId: string;   // 위반이 속한 챕터 id (id 유일성 위반 등 전역 검사는 대표 id)
  code: string;        // 기계 판독용 코드 (픽스처가 이걸로 규칙별 검출을 확인)
  message: string;     // 사람 판독용 설명
}

/**
 * 챕터 레지스트리 전체를 정적 검사한다. 위반 목록을 돌려준다(빈 배열 = 통과).
 * 던지지 않는다 — 호출부가 종료 코드를 정한다.
 */
export function validateChapters(chapters: ChapterData[]): Problem[] {
  const problems: Problem[] = [];

  // ── 전역: 챕터 id 유일 ────────────────────────────────────────────────
  const seen = new Map<string, number>();
  for (const { chapterMeta } of chapters) {
    seen.set(chapterMeta.id, (seen.get(chapterMeta.id) ?? 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) {
      problems.push({
        chapterId: id,
        code: "DUPLICATE_ID",
        message: `챕터 id "${id}" 가 ${count}번 등장 — 리포 전역 유일해야 함`,
      });
    }
  }

  // 실존 챕터 id 집합 (prerequisites 참조 검증용)
  const knownIds = new Set(chapters.map((c) => c.chapterMeta.id));

  for (const { chapterMeta, quiz } of chapters) {
    const cid = chapterMeta.id;

    // ── prerequisites 는 실존 챕터 id 만 참조 ──────────────────────────
    for (const pre of chapterMeta.prerequisites) {
      if (!knownIds.has(pre)) {
        problems.push({
          chapterId: cid,
          code: "PREREQ_MISSING",
          message: `prerequisites 의 "${pre}" 는 존재하지 않는 챕터 id`,
        });
      }
      if (pre === cid) {
        problems.push({
          chapterId: cid,
          code: "PREREQ_SELF",
          message: `prerequisites 가 자기 자신("${cid}")을 참조`,
        });
      }
    }

    // ── 문항 검사 (빈 quiz 는 적법 → 이 루프가 그냥 안 돈다) ────────────
    for (const q of quiz) {
      const qref = `${cid}:${q.id}`;

      // concept 비어있지 않음 (최소 1개, 각 항목도 비지 않은 문자열)
      if (q.concept.length === 0) {
        problems.push({
          chapterId: cid,
          code: "CONCEPT_EMPTY",
          message: `${qref}: concept 가 비어 있음 (최소 1개 필요)`,
        });
      } else if (q.concept.some((c) => c.trim() === "")) {
        problems.push({
          chapterId: cid,
          code: "CONCEPT_EMPTY",
          message: `${qref}: concept 에 빈 문자열 항목이 있음`,
        });
      }

      // choices 는 2개 이상 (schema: "2개 이상")
      if (q.choices.length < 2) {
        problems.push({
          chapterId: cid,
          code: "CHOICES_TOO_FEW",
          message: `${qref}: choices 가 ${q.choices.length}개 — 2개 이상 필요`,
        });
      }

      // answer 는 최소 1개 (복수 가능)
      if (q.answer.length === 0) {
        problems.push({
          chapterId: cid,
          code: "ANSWER_EMPTY",
          message: `${qref}: answer 가 비어 있음 (정답 최소 1개)`,
        });
      }

      // answer 인덱스가 choices 범위 내 (정수·중복 없음)
      const answerSeen = new Set<number>();
      for (const a of q.answer) {
        if (!Number.isInteger(a) || a < 0 || a >= q.choices.length) {
          problems.push({
            chapterId: cid,
            code: "ANSWER_OUT_OF_RANGE",
            message: `${qref}: answer 인덱스 ${a} 가 choices 범위(0..${q.choices.length - 1}) 밖`,
          });
        }
        if (answerSeen.has(a)) {
          problems.push({
            chapterId: cid,
            code: "ANSWER_DUPLICATE",
            message: `${qref}: answer 인덱스 ${a} 중복`,
          });
        }
        answerSeen.add(a);
      }

      // choiceExplanations 는 있으면 choices 와 길이 일치
      if (q.choiceExplanations !== undefined && q.choiceExplanations.length !== q.choices.length) {
        problems.push({
          chapterId: cid,
          code: "CHOICE_EXPL_LENGTH",
          message: `${qref}: choiceExplanations 길이 ${q.choiceExplanations.length} ≠ choices 길이 ${q.choices.length}`,
        });
      }
    }
  }

  return problems;
}

/** 이 파일이 직접 실행됐는지 (import 되었는지 아닌지) — ESM 판별. */
function isMain(): boolean {
  return Boolean(process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href);
}

async function main(): Promise<void> {
  const { registry } = await import("../content/registry.ts");
  const chapters = registry.map((entry) => entry.data);
  const problems = validateChapters(chapters);

  if (problems.length === 0) {
    console.log(`✓ content 검사 통과 (챕터 ${chapters.length}개)`);
    return;
  }

  console.error(`✗ content 검사 실패 — 위반 ${problems.length}건:\n`);
  for (const p of problems) {
    console.error(`  [${p.code}] ${p.message}`);
  }
  process.exit(1);
}

if (isMain()) {
  main().catch((err) => {
    console.error("validate-content 실행 오류:", err);
    process.exit(1);
  });
}
