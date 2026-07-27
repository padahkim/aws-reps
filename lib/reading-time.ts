/**
 * 챕터 예상 소요 시간 — 빌드 시 산출한다 (#161, 규약 v3.1).
 *
 * meta 에 손으로 적지 않는 이유: 본문이 바뀌는 순간 그 자리에서 낡고, 낡은 수치는
 * 없는 것보다 나쁘다. 원문(MDX)과 문항 수가 정본이고 여기서 매 빌드 다시 센다.
 *
 * **서버 전용** — node:fs 를 쓴다. 클라이언트 컴포넌트에서 import 하면 번들이 깨진다
 * (app/ 는 lib/content.ts 의 re-export 로만 이걸 만진다. output: "export" 라 실행 시점은
 * 항상 빌드/개발 서버다).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ChapterEntry } from "@/content/registry";

/**
 * 산출 계수 — 정밀한 예측이 아니라 "한 시간짜리인지 십 분짜리인지"를 알려주는 자릿수다.
 * 그래서 결과도 5분 단위로 반올림한다 (37분 같은 숫자는 없는 정밀도를 주장한다).
 */
const PROSE_CPM = 250;        // 한국어 기술 산문 정독 — 표·코드가 섞여 일반 독서(600자/분)보다 느리다
const SELF_QUIZ_MIN = 0.5;    // 셀프 퀴즈 1문항: 떠올리고 답 열어 대조
const CONCEPT_MIN = 1;        // 인출 개념 카드 1장: 덮고 떠올리기 + why
const QUIZ_MIN = 1;           // 챕터 퀴즈 1문항: 선택지 판단 + 해설

/** 챕터 하나의 산출 결과는 빌드 내내 안 변한다 — 섹션 페이지 21개가 같은 값을 다시 세지 않게 캐시. */
const cache = new Map<string, number | undefined>();

/**
 * MDX 원문에서 "읽는 글자"만 남긴다. 정확한 파서가 아니라 분량 자릿수를 재는 근사다 —
 * import/export 줄, JSX 표현식 {…}, 태그, md 기호를 걷어내고 공백을 뺀 글자 수를 센다.
 * 컴포넌트 prop 안의 텍스트(Checklist items 등)는 {…} 와 함께 사라지므로 과소 추정 쪽으로
 * 치우친다 — 예상 소요는 넘치는 것보다 모자란 게 낫다 (겁주지 않는다).
 */
function proseChars(src: string): number {
  let s = src.replace(/^(import|export)[^\n]*$/gm, "");
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // JSX 표현식은 중첩되므로 정규식이 아니라 깊이 스캔으로 지운다
  let out = "";
  let depth = 0;
  for (const ch of s) {
    if (ch === "{") depth++;
    else if (ch === "}") depth = Math.max(0, depth - 1);
    else if (depth === 0) out += ch;
  }

  return out
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_`>|[\]()-]/g, "")
    .replace(/\s+/g, "").length;
}

/** 챕터 디렉터리의 intro·sections/*.mdx·outro 원문 글자 수 합. 디렉터리가 없으면 undefined. */
function chapterProseChars(chapterId: string): number | undefined {
  const dir = join(process.cwd(), "content", "chapters", chapterId);
  if (!existsSync(dir)) return undefined;

  const files: string[] = [];
  for (const name of ["intro.mdx", "outro.mdx"]) {
    const path = join(dir, name);
    if (existsSync(path)) files.push(path);
  }
  const sectionsDir = join(dir, "sections");
  if (existsSync(sectionsDir)) {
    for (const name of readdirSync(sectionsDir)) {
      if (name.endsWith(".mdx")) files.push(join(sectionsDir, name));
    }
  }
  if (files.length === 0) return undefined;

  return files.reduce((sum, path) => sum + proseChars(readFileSync(path, "utf8")), 0);
}

/**
 * 챕터를 처음부터 끝까지 (본문 정독 + 셀프 퀴즈 + 인출 카드 + 챕터 퀴즈) 도는 데 걸리는
 * 대략의 분. 5분 단위 반올림, 최소 5분. 본문 mdx 를 못 찾으면 undefined —
 * 호출부는 그 경우 소요 표시를 생략한다 (틀린 수치보다 없는 편이 낫다).
 */
export function estimateChapterMinutes(entry: ChapterEntry): number | undefined {
  const { chapterMeta, quiz, session, selfQuiz } = entry.data;
  const cached = cache.get(chapterMeta.id);
  if (cache.has(chapterMeta.id)) return cached;

  const chars = chapterProseChars(chapterMeta.id);
  const minutes =
    chars === undefined
      ? undefined
      : Math.max(
          5,
          Math.round(
            (chars / PROSE_CPM +
              (selfQuiz?.length ?? 0) * SELF_QUIZ_MIN +
              (session?.concepts.length ?? 0) * CONCEPT_MIN +
              quiz.length * QUIZ_MIN) /
              5
          ) * 5
        );

  cache.set(chapterMeta.id, minutes);
  return minutes;
}
