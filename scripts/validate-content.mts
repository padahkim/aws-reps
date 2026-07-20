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

  for (const { chapterMeta, quiz, sections, session } of chapters) {
    const cid = chapterMeta.id;

    // ── 섹션 규약 (v2): 최소 1개, 제목 비지 않음, num 챕터 내 유일 ──────
    if (sections.length === 0) {
      problems.push({
        chapterId: cid,
        code: "SECTIONS_EMPTY",
        message: `sections 가 비어 있음 — 섹션 최소 1개 필요 (규약 v2)`,
      });
    }
    const numSeen = new Set<string>();
    sections.forEach((s, i) => {
      if (s.title.trim() === "") {
        problems.push({
          chapterId: cid,
          code: "SECTION_TITLE_EMPTY",
          message: `sections[${i}]: title 이 비어 있음`,
        });
      }
      if (s.num.trim() === "") {
        problems.push({
          chapterId: cid,
          code: "SECTION_NUM_EMPTY",
          message: `sections[${i}]: num 이 비어 있음`,
        });
      } else if (numSeen.has(s.num)) {
        problems.push({
          chapterId: cid,
          code: "SECTION_NUM_DUP",
          message: `sections[${i}]: num "${s.num}" 이 챕터 내에서 중복`,
        });
      }
      numSeen.add(s.num);
    });

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

    // ── 인출 세션 검사 (session 없는 챕터는 적법 → 이 블록을 건너뛴다) ────
    if (session) {
      // 세션 항목 id 는 챕터 내 유일 — concepts·mixed 를 한 이름공간으로 본다
      // (v2 세션 페이지가 둘을 한 화면에 올리므로 서로도 겹치면 안 된다).
      const idSeen = new Set<string>();
      const checkId = (id: string, where: string) => {
        if (id.trim() === "") {
          problems.push({
            chapterId: cid,
            code: "SESSION_ID_EMPTY",
            message: `session.${where}: id 가 비어 있음`,
          });
        } else if (idSeen.has(id)) {
          problems.push({
            chapterId: cid,
            code: "SESSION_ID_DUP",
            message: `session.${where}: id "${id}" 가 챕터 내에서 중복`,
          });
        }
        idSeen.add(id);
      };

      // 개념 카드: section 은 실존하는 SectionMeta.num 을 가리켜야 한다 (하단 매핑의 전제)
      session.concepts.forEach((c, i) => {
        checkId(c.id, `concepts[${i}]`);
        if (!numSeen.has(c.section)) {
          problems.push({
            chapterId: cid,
            code: "SESSION_SECTION_MISSING",
            message: `session.concepts[${i}] (id "${c.id}"): section "${c.section}" 이 실존하지 않는 섹션 num — 카드가 어디에도 안 붙는다`,
          });
        }
        if (c.q.trim() === "" || c.a.trim() === "") {
          problems.push({
            chapterId: cid,
            code: "SESSION_CONCEPT_EMPTY",
            message: `session.concepts[${i}] (id "${c.id}"): q 또는 a 가 비어 있음`,
          });
        }
      });

      // 도식: 선형 체인이라 edges 는 nodes 보다 정확히 1 짧다
      if (session.diagram) {
        const { nodes, edges } = session.diagram;
        if (nodes.length < 2) {
          problems.push({
            chapterId: cid,
            code: "SESSION_DIAGRAM_TOO_SHORT",
            message: `session.diagram: nodes 가 ${nodes.length}개 — 최소 2개 필요 (체인이 성립해야 함)`,
          });
        } else if (edges.length !== nodes.length - 1) {
          problems.push({
            chapterId: cid,
            code: "SESSION_DIAGRAM_EDGES",
            message: `session.diagram: edges ${edges.length}개 ≠ nodes ${nodes.length}개 - 1 (선형 체인 모델)`,
          });
        }
      }

      session.mixed.forEach((m, i) => checkId(m.id, `mixed[${i}]`));
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
