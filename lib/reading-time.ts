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
import { existsSync, readFileSync } from "node:fs";
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

/** 5분 단위 반올림 — 37분 같은 숫자는 없는 정밀도를 주장한다. floor 는 표시 하한. */
function round5(minutes: number, floor = 5): number {
  return Math.max(floor, Math.round(minutes / 5) * 5);
}

/**
 * 파일 읽기만 캐시한다 (챕터 id → 섹션별 글자 수). 산출 결과 자체를 캐시하지 않는 이유:
 * 결과는 넘겨받은 파트 범위에 따라 달라지는데 키는 챕터 id 하나뿐이라, 캐시하면 다른
 * 인자로 부른 호출이 남의 답을 받는다. 비싼 건 파일 I/O 이고 나머지는 덧셈이다.
 */
const charsCache = new Map<string, Map<string, number> | undefined>();

/**
 * MDX 원문에서 "읽는 글자"만 남긴다. 정확한 파서가 아니라 분량 자릿수를 재는 근사다.
 *
 * 두 벌을 더한다 — ① 문자열 리터럴의 내용 ② 그걸 걷어낸 나머지의 산문.
 * **리터럴을 반드시 세야 한다**: 이 리포의 표·체크리스트는 전부 컴포넌트 prop 안의 문자열이라
 * (`<Table rows={[["메모리","128MB~10GB",…]]}/>`), 표현식을 통째로 버리면 한도 총정리 같은
 * 표 한 장짜리 섹션이 "원문 1,828자 → 산문 184자"로 잡혀 0.7분이 된다 (실측). 표는 읽는 데
 * 시간이 더 걸리지 덜 걸리지 않는다.
 *
 * 리터럴을 먼저 빼내는 순서도 중요하다 — 남겨 둔 채 태그를 지우면 `<Table head=… rows=…`
 * 처럼 `>` 가 한참 뒤에 오는 열린 태그가 표 내용을 통째로 삼킨다.
 */
function proseChars(src: string): number {
  const s = src.replace(/^(import|export)[^\n]*$/gm, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // ① 문자열 리터럴을 빼내고 그 자리는 공백으로 — 남은 텍스트에서 태그·표현식을 지우기 위함
  let literals = "";
  let rest = "";
  let quote: string | null = null;
  let escaped = false;
  for (const ch of s) {
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) { quote = null; rest += " "; continue; }
      literals += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    rest += ch;
  }

  // ② 남은 것에서 JSX 표현식(중첩되므로 깊이 스캔)과 태그·md 기호를 지운다
  let prose = "";
  let depth = 0;
  for (const ch of rest) {
    if (ch === "{") depth++;
    else if (ch === "}") depth = Math.max(0, depth - 1);
    else if (depth === 0) prose += ch;
  }

  const count = (text: string) =>
    text.replace(/<[^>]*>/g, "").replace(/[#*_`>|[\]()-]/g, "").replace(/\s+/g, "").length;
  return count(literals) + count(prose);
}

/**
 * 섹션별 본문 글자 수 (num → 글자). 챕터 디렉터리나 sections/ 가 없으면 undefined —
 * 그러면 호출부가 소요 표시를 통째로 생략한다 (틀린 수치보다 없는 편이 낫다).
 * intro·outro 는 각각 첫 섹션·마지막 섹션 페이지에 얹혀 렌더되므로 그 섹션에 합산한다.
 */
function sectionChars(entry: ChapterEntry): Map<string, number> | undefined {
  const { chapterMeta, sections } = entry.data;
  if (charsCache.has(chapterMeta.id)) return charsCache.get(chapterMeta.id);
  const result = readSectionChars(entry);
  charsCache.set(chapterMeta.id, result);
  return result;
}

function readSectionChars(entry: ChapterEntry): Map<string, number> | undefined {
  const { chapterMeta, sections } = entry.data;
  const dir = join(process.cwd(), "content", "chapters", chapterMeta.id);
  const sectionsDir = join(dir, "sections");
  if (!existsSync(sectionsDir) || sections.length === 0) return undefined;

  const read = (path: string) => (existsSync(path) ? proseChars(readFileSync(path, "utf8")) : 0);
  const chars = new Map<string, number>();
  for (const s of sections) {
    chars.set(s.num, read(join(sectionsDir, `${s.num}.mdx`)));
  }

  // 아웃트로는 마지막 섹션 페이지 하단에 있으니 그 섹션에 합산한다. **인트로는 합산하지
  // 않는다** — v3.2(#174)부터 목차 페이지에 있어서 어느 섹션에서도 읽히지 않는다. 첫 섹션에
  // 계속 얹으면 파트 1 의 "약 N분"이 그 파트 페이지에 없는 글을 세게 된다 (INTRO 키로 따로 담아
  // estimateChapter 가 챕터 단위 항으로 쓴다).
  const last = sections[sections.length - 1].num;
  chars.set(last, (chars.get(last) ?? 0) + read(join(dir, "outro.mdx")));
  chars.set(INTRO_KEY, read(join(dir, "intro.mdx")));
  return chars;
}

/**
 * 인트로 글자 수를 담는 키. 섹션 num 과 충돌하지 않아야 한다 — num 은 "01".."NN" 이므로
 * 콜론이 들어간 이 키는 어떤 챕터에서도 섹션과 겹치지 않는다.
 */
const INTRO_KEY = "chapter:intro";

/** 파트 범위 — lib/content.ts 의 ResolvedPart 를 받되, 순환 import 를 피해 구조로만 받는다. */
export interface SectionRange {
  fromSec: number;   // 1-based 섹션 페이지 번호 (양끝 포함)
  toSec: number;
}

export interface ChapterEstimate {
  total: number;     // 챕터 전체. **parts 합 + quiz + intro 와 정확히 일치한다** (아래 참조)
  parts: number[];   // 넘겨받은 파트 순서와 1:1. 파트가 없으면 빈 배열
  quiz: number;      // 챕터 퀴즈 — 어느 파트에도 안 속한다. quiz 가 없으면 0
  intro: number;     // 목차 페이지의 챕터 인트로 (v3.2 #174) — 어느 파트에도 안 속한다
}

/**
 * 챕터를 처음부터 끝까지 (인트로 + 본문 정독 + 셀프 퀴즈 + 인출 카드 + 챕터 퀴즈) 도는 데
 * 걸리는 대략의 분. 본문 mdx 를 못 찾으면 undefined.
 *
 * **총합은 파트별 값의 합으로 정의한다** — 화면에 파트마다 "약 N분"이 뜨는데 각각을 5분
 * 단위로 반올림하면 그 합이 따로 반올림한 총합과 어긋난다. 학습자가 더해 볼 수 있는
 * 숫자들이므로, 어긋나는 쪽이 아니라 총합을 합으로 맞추는 쪽을 택했다.
 * 인트로·퀴즈는 어느 파트에도 안 속하므로 그 합에 각각 더해진다 (v3.2 — 인트로가 섹션에서
 * 목차 페이지로 빠지면서 파트 밖 항이 하나 늘었다).
 */
export function estimateChapter(
  entry: ChapterEntry,
  parts: readonly SectionRange[] = []
): ChapterEstimate | undefined {
  const { quiz, session, selfQuiz } = entry.data;
  const chars = sectionChars(entry);
  if (!chars) return undefined;

  // 섹션 하나를 도는 raw 분 — 반올림 전 값이라 파트 단위로 합산한 뒤에 한 번만 반올림한다
  const raw = entry.data.sections.map(
    (s) =>
      (chars.get(s.num) ?? 0) / PROSE_CPM +
      (selfQuiz?.filter((e) => e.section === s.num).length ?? 0) * SELF_QUIZ_MIN +
      (session?.concepts.filter((c) => c.section === s.num).length ?? 0) * CONCEPT_MIN
  );
  const sum = (from: number, to: number) => raw.slice(from, to).reduce((a, b) => a + b, 0);

  // 퀴즈는 반올림하지 않는다 — 문항당 1분이라 이미 정수이고, 5분으로 올리면 없는 시간이 생긴다
  const quizMinutes = quiz.length * QUIZ_MIN;
  // 인트로도 반올림하지 않는다 — 문단 한둘짜리라 5분으로 올리면 대부분 없는 시간이 생긴다.
  // 다만 0분으로 사라지지도 않게 올림한다 (읽는 글이 있는데 0분이라고 적을 수는 없다).
  const introRaw = (chars.get(INTRO_KEY) ?? 0) / PROSE_CPM;
  const introMinutes = introRaw > 0 ? Math.max(1, Math.round(introRaw)) : 0;
  const partMinutes = parts.map((p) => round5(sum(p.fromSec - 1, p.toSec)));
  const total =
    partMinutes.length > 0
      ? partMinutes.reduce((a, b) => a + b, 0) + quizMinutes + introMinutes
      : round5(sum(0, raw.length) + quizMinutes + introMinutes);

  return { total, parts: partMinutes, quiz: quizMinutes, intro: introMinutes };
}
