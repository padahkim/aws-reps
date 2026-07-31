/**
 * 콘텐츠 규약 정적 검사 — tsc가 못 잡는 "값 수준" 계약 위반을 잡는다.
 * 정본 계약: content/schema.ts. 여기서는 그 계약이 값에서 지켜지는지 검사한다.
 *
 * 실행: `npm run validate` (build 앞에 자동 연결됨).
 * 순수 함수 validateChapters()를 export 해 픽스처(*.test.ts)가 직접 먹인다.
 */
import type { ChapterData } from "../content/schema.ts";

export interface Problem {
  chapterId: string;   // 위반이 속한 챕터 id (id 유일성 위반 등 전역 검사는 대표 id)
  code: string;        // 기계 판독용 코드 (픽스처가 이걸로 규칙별 검출을 확인)
  message: string;     // 사람 판독용 설명
}

/** 섹션 num 표기 — 제로패딩 2자리 이상 숫자 ("00"·"01"·"10"). schema.ts SectionMeta.num 참조. */
const SECTION_NUM_FORMAT = /^\d{2,}$/;

/** 섹션 본문 예산 상한 (~3KB) — schema.ts "섹션 분량 예산" 참조. 초과는 warn(비실패). */
export const SECTION_BUDGET_BYTES = 3 * 1024;

/**
 * 섹션 소스에서 <Fold …>…</Fold> 블록(심화층)을 제외한 UTF-8 바이트 수 — 예산은
 * 본문(시험 직결) 층에만 적용된다. 접은 내용까지 세면 접어도 경고가 안 사라져
 * Fold 의 유인이 없어진다. Fold 중첩은 규약에 없다(비탐욕 매칭이라 안쪽 닫는 태그에서 끊긴다).
 */
export function sectionBudgetBytes(source: string): number {
  return Buffer.byteLength(source.replace(/<Fold\b[\s\S]*?<\/Fold>/g, ""), "utf8");
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

  for (const { chapterMeta, quiz, sections, session, selfQuiz } of chapters) {
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
      } else {
        // 제로패딩 2자리 이상 숫자만 — num 은 mdx 파일명(sections/NN.mdx)과 같은 문자열이라
        // "1"·"1a" 같은 표기는 파일명·목차·라우트를 조용히 어긋나게 한다.
        if (!SECTION_NUM_FORMAT.test(s.num)) {
          problems.push({
            chapterId: cid,
            code: "SECTION_NUM_FORMAT",
            message: `sections[${i}]: num "${s.num}" 이 제로패딩 숫자 형식이 아님 (2자리 이상 숫자 — "00"·"01"·"10")`,
          });
        }
        if (numSeen.has(s.num)) {
          problems.push({
            chapterId: cid,
            code: "SECTION_NUM_DUP",
            message: `sections[${i}]: num "${s.num}" 이 챕터 내에서 중복`,
          });
        }
      }
      numSeen.add(s.num);
    });

    // 배열 순서대로 1씩 증가해야 한다 — meta.num · sections/NN.mdx · body import 순서의
    // 드리프트(섹션 하나를 지우고 num 을 안 당긴 경우 등)를 잡는다. 시작값은 0·1 둘 다 적법:
    // ch0-1 은 동기 서문을 "00" 으로 쓴다 (content/chapters/ch0-1/meta.ts).
    // 형식 위반이 이미 잡힌 챕터는 건너뛴다 — 같은 사실을 두 번 보고하지 않는다.
    if (sections.length > 0 && sections.every((s) => SECTION_NUM_FORMAT.test(s.num))) {
      const nums = sections.map((s) => Number(s.num));
      if (nums[0] !== 0 && nums[0] !== 1) {
        problems.push({
          chapterId: cid,
          code: "SECTION_NUM_SEQUENCE",
          message: `sections[0]: num "${sections[0].num}" — 첫 섹션은 "00" 또는 "01" 이어야 함`,
        });
      }
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[i - 1] + 1) {
          problems.push({
            chapterId: cid,
            code: "SECTION_NUM_SEQUENCE",
            message: `sections[${i}]: num "${sections[i].num}" — 앞 섹션 "${sections[i - 1].num}" 다음 번호가 아님 (연속이어야 함)`,
          });
        }
      }
    }

    // ── 오리엔테이션 (v3.1, #161) — 없는 챕터는 적법 → 각 블록을 건너뛴다 ──
    // 학습 목표: 규약이 3~5개로 못박혀 있다 (2개 이하는 지도가 안 되고, 6개 이상은
    // 목차를 한 번 더 쓴 것이라 선행조직자 효과가 사라진다).
    if (chapterMeta.objectives) {
      const n = chapterMeta.objectives.length;
      if (n < 3 || n > 5) {
        problems.push({
          chapterId: cid,
          code: "OBJECTIVES_COUNT",
          message: `objectives 가 ${n}개 — 3~5개여야 함 (규약 v3.1). 필요 없으면 필드를 생략하라`,
        });
      }
      chapterMeta.objectives.forEach((o, i) => {
        if (o.trim() === "") {
          problems.push({
            chapterId: cid,
            code: "OBJECTIVE_EMPTY",
            message: `objectives[${i}] 가 빈 문자열`,
          });
        }
      });
    }

    // 파트: 전 섹션을 순서대로 빠짐·중복 없이 덮어야 한다 — 안 덮이는 섹션은 목차의
    // 어느 그룹에도 안 들어가 화면에서 조용히 사라진다. 그래서 커버리지는 빌드를 막는다.
    // **파트 개수는 일부러 검사하지 않는다** (objectives 의 3~5 개와 다른 이유): 적정 개수는
    // 챕터 크기에 달렸고(4섹션짜리 ch0-1 에 최소 4파트를 강제하면 파트당 1섹션이 된다),
    // 개수가 어긋나도 화면은 정상이다. 여기서 막는 건 "화면이 조용히 틀어지는 것"뿐이다.
    if (chapterMeta.parts) {
      const parts = chapterMeta.parts;
      const indexOfNum = new Map(sections.map((s, i) => [s.num, i]));

      if (parts.length === 0) {
        problems.push({
          chapterId: cid,
          code: "PARTS_EMPTY",
          message: `parts 가 빈 배열 — 파트를 채우거나 필드를 생략하라`,
        });
      }

      let resolvable = parts.length > 0;
      parts.forEach((p, i) => {
        if (p.title.trim() === "") {
          problems.push({
            chapterId: cid,
            code: "PART_TITLE_EMPTY",
            message: `parts[${i}]: title 이 비어 있음`,
          });
        }
        for (const [field, num] of [["from", p.from], ["to", p.to]] as const) {
          if (!indexOfNum.has(num)) {
            resolvable = false;
            problems.push({
              chapterId: cid,
              code: "PART_SECTION_MISSING",
              message: `parts[${i}]: ${field} "${num}" 이 실존하지 않는 섹션 num`,
            });
          }
        }
      });

      // 범위가 전부 실존할 때만 커버리지를 본다 — 못 푸는 num 이 섞이면 같은 사실을
      // "커버 안 됨"으로 한 번 더 보고하게 된다.
      if (resolvable) {
        let expected = 0;   // 다음 파트가 시작해야 할 섹션 인덱스
        parts.forEach((p, i) => {
          const from = indexOfNum.get(p.from)!;
          const to = indexOfNum.get(p.to)!;
          if (to < from) {
            problems.push({
              chapterId: cid,
              code: "PART_RANGE_REVERSED",
              message: `parts[${i}] "${p.title}": from "${p.from}" 이 to "${p.to}" 보다 뒤 — 범위가 뒤집혔다`,
            });
            expected = -1;   // 이후 연속성 판정은 의미가 없다
            return;
          }
          if (expected < 0) return;
          if (from !== expected) {
            problems.push({
              chapterId: cid,
              code: "PART_COVERAGE",
              message:
                from > expected
                  ? `parts[${i}] "${p.title}": 섹션 "${sections[expected].num}" 부터 "${sections[from - 1].num}" 까지가 어느 파트에도 안 들어간다`
                  : `parts[${i}] "${p.title}": from "${p.from}" 이 앞 파트와 겹친다 (앞 파트는 "${sections[expected - 1].num}" 에서 끝났다)`,
            });
          }
          expected = to + 1;
        });
        if (expected >= 0 && expected !== sections.length) {
          problems.push({
            chapterId: cid,
            code: "PART_COVERAGE",
            message: `parts 가 마지막 섹션 "${sections[sections.length - 1].num}" 까지 덮지 않는다 (섹션 "${sections[expected].num}" 부터 남음)`,
          });
        }
      }
    }

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
    // 문항 id 는 챕터 내 유일 — 앱이 `${chapterId}:${q.id}` 를 전역 키로 합성하므로
    // (lib/content.ts globalQuestionKey) 중복 id 는 React key 충돌로 이어진다.
    const qIdSeen = new Set<string>();
    quiz.forEach((q, qi) => {
      const qref = `${cid}:${q.id}`;

      if (q.id.trim() === "") {
        problems.push({
          chapterId: cid,
          code: "QUESTION_ID_EMPTY",
          message: `quiz[${qi}]: id 가 비어 있음`,
        });
      } else if (qIdSeen.has(q.id)) {
        problems.push({
          chapterId: cid,
          code: "QUESTION_ID_DUP",
          message: `quiz[${qi}]: id "${q.id}" 가 챕터 내에서 중복`,
        });
      }
      qIdSeen.add(q.id);

      // 시나리오·해설 비어있음 — 빈 scenario 는 빈 문항으로, 빈 explanation 은
      // 채점 후 해설 패널 공백으로 렌더된다 (app/chapters/[id]/chapter-quiz.tsx).
      if (q.scenario.trim() === "") {
        problems.push({
          chapterId: cid,
          code: "SCENARIO_EMPTY",
          message: `${qref}: scenario 가 비어 있음`,
        });
      }
      if (q.explanation.trim() === "") {
        problems.push({
          chapterId: cid,
          code: "EXPLANATION_EMPTY",
          message: `${qref}: explanation 이 비어 있음 (정답 근거 필수)`,
        });
      }

      // 선택지 개별 문자열 비어있음 — 개수(CHOICES_TOO_FEW)와 별개 검사
      q.choices.forEach((c, ci) => {
        if (c.trim() === "") {
          problems.push({
            chapterId: cid,
            code: "CHOICE_EMPTY",
            message: `${qref}: choices[${ci}] 가 빈 문자열`,
          });
        }
      });

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

      // choiceExplanations 는 있으면 choices 와 길이 일치 (필드 자체는 optional)
      if (q.choiceExplanations !== undefined) {
        if (q.choiceExplanations.length !== q.choices.length) {
          problems.push({
            chapterId: cid,
            code: "CHOICE_EXPL_LENGTH",
            message: `${qref}: choiceExplanations 길이 ${q.choiceExplanations.length} ≠ choices 길이 ${q.choices.length}`,
          });
        }

        // 개별 항목 비어있음 — 화면에서 두 갈래로 샌다 (chapter-quiz.tsx):
        // ""는 falsy 라 해설 블록이 통째로 사라져 "해설 없는 문항"과 구별되지 않고,
        // "  "는 truthy 라 빈 해설 박스가 렌더된다. 인덱스를 적어 어느 선택지인지 짚는다.
        q.choiceExplanations.forEach((e, ci) => {
          if (e.trim() === "") {
            problems.push({
              chapterId: cid,
              code: "CHOICE_EXPL_EMPTY",
              message: `${qref}: choiceExplanations[${ci}] 가 비어 있음`,
            });
          }
        });
      }
    });

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
        // 정교화 질문(#89 ③): why 가 있으면 q 는 필수·비어있지 않음,
        // 모범답 a 는 옵션이지만 있으면 비어있지 않아야 한다 (빈 게이트 방지).
        if (c.why !== undefined) {
          if (c.why.q.trim() === "") {
            problems.push({
              chapterId: cid,
              code: "SESSION_WHY_EMPTY",
              message: `session.concepts[${i}] (id "${c.id}"): why.q 가 비어 있음 — 정교화 질문이 없으면 why 를 생략하라`,
            });
          }
          if (c.why.a !== undefined && c.why.a.trim() === "") {
            problems.push({
              chapterId: cid,
              code: "SESSION_WHY_ANSWER_EMPTY",
              message: `session.concepts[${i}] (id "${c.id}"): why.a 가 빈 문자열 — 모범답을 채우거나 a 를 생략하라`,
            });
          }
        }
      });

      // 도식: 선형 체인이라 edges 는 nodes 보다 정확히 1 짧다
      if (session.diagram) {
        const { prompt, nodes, edges } = session.diagram;
        if (prompt.trim() === "") {
          problems.push({
            chapterId: cid,
            code: "SESSION_DIAGRAM_PROMPT_EMPTY",
            message: `session.diagram: prompt 가 비어 있음 — 무엇을 그릴지 지시가 없으면 재현 과제가 성립하지 않는다`,
          });
        }
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
        // 노드는 role(인출 큐)·name(인출 대상) 쌍 — 한쪽이 비면 그 노드는 과제가 성립하지 않는다
        nodes.forEach((n, i) => {
          if (n.role.trim() === "" || n.name.trim() === "") {
            problems.push({
              chapterId: cid,
              code: "SESSION_DIAGRAM_NODE_EMPTY",
              message: `session.diagram.nodes[${i}]: role 또는 name 이 비어 있음`,
            });
          }
        });
      }

      // 교차 복습 항목: id 유일성 + 네 필드 전부 채워져야 한다 —
      // 한 칸이라도 비면 대조 카드가 빈 줄로 렌더된다.
      session.mixed.forEach((m, i) => {
        checkId(m.id, `mixed[${i}]`);
        for (const field of ["scenario", "service", "why", "contrast"] as const) {
          if (m[field].trim() === "") {
            problems.push({
              chapterId: cid,
              code: "SESSION_MIXED_EMPTY",
              message: `session.mixed[${i}] (id "${m.id}"): ${field} 가 비어 있음`,
            });
          }
        }
      });
    }

    // ── 셀프 퀴즈 검사 (#98 — selfQuiz 없는 챕터는 적법 → 건너뛴다) ─────────
    if (selfQuiz) {
      selfQuiz.forEach((e, i) => {
        if (!numSeen.has(e.section)) {
          problems.push({
            chapterId: cid,
            code: "SELFQUIZ_SECTION_MISSING",
            message: `selfQuiz[${i}]: section "${e.section}" 이 실존하지 않는 섹션 num — 덱이 어디에도 안 붙는다`,
          });
        }
        if (e.q.trim() === "" || e.a.trim() === "") {
          problems.push({
            chapterId: cid,
            code: "SELFQUIZ_ITEM_EMPTY",
            message: `selfQuiz[${i}] (section "${e.section}"): q 또는 a 가 비어 있음`,
          });
        }
        // yn(판정형 표시, #150): 있으면 "예"|"아니오"만 — 그 외 값(빈 문자열 포함)이면
        // 위젯의 어느 버튼과도 매칭되지 않아 그 문항은 항상 오답 처리된다.
        if (e.yn !== undefined && e.yn !== "예" && e.yn !== "아니오") {
          problems.push({
            chapterId: cid,
            code: "SELFQUIZ_YN_INVALID",
            message: `selfQuiz[${i}] (section "${e.section}"): yn 값 ${JSON.stringify(e.yn)} — "예" 또는 "아니오"만 허용`,
          });
        }
      });
    }
  }

  return problems;
}

/** 이 파일이 직접 실행됐는지 (import 되었는지 아닌지) — ESM 판별. */
function isMain(): boolean {
  return Boolean(process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href);
}

/** 섹션 분량 예산 warn (#162) — 종료 코드에 영향 없음. fs 오류는 던진다(조용한 no-op 금지). */
async function warnSectionBudgets(chapterIds: string[]): Promise<void> {
  const { readdir, readFile } = await import("node:fs/promises");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const root = dirname(dirname(fileURLToPath(import.meta.url))); // scripts/ 의 부모 = 리포 루트
  for (const id of chapterIds) {
    const dir = join(root, "content", "chapters", id, "sections");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".mdx")).sort();
    for (const f of files) {
      const bytes = sectionBudgetBytes(await readFile(join(dir, f), "utf8"));
      if (bytes > SECTION_BUDGET_BYTES) {
        console.warn(
          `⚠ [SECTION_BUDGET] ${id} sections/${f}: 본문 ${(bytes / 1024).toFixed(1)}KB > ` +
            `${(SECTION_BUDGET_BYTES / 1024).toFixed(1)}KB — 시험 비직결 상세를 <Fold> 로 접는 것을 고려 (schema.ts 섹션 분량 예산)`
        );
      }
    }
  }
}

async function main(): Promise<void> {
  const { registry } = await import("../content/registry.ts");
  const chapters = registry.map((entry) => entry.data);
  const problems = validateChapters(chapters);

  await warnSectionBudgets(chapters.map((c) => c.chapterMeta.id));

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
