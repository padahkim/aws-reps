// dev 검수 도구(/_source)의 라우트·매니페스트 생성기.
//
// content/ 최상위 날것 원본(*.jsx + aws-dva-stage0.html)을 스캔해
//   1) app/%5Fsource/manifest.ts        — 목차가 쓰는 목록
//   2) app/%5Fsource/<slug>/page.tsx    — 원본 1개짜리 정적 라우트 28개
// 를 만든다. 원본이 추가/삭제되면 `node scripts/gen-source-routes.mjs` 를 다시 돌린다.
//
// 왜 정적 라우트를 생성하나 (동적 [file] 대신): SourcePage.tsx 상단 주석 참조 —
// %5F 이스케이프 폴더 아래 동적 세그먼트가 output:"export" 에서 매칭되지 않는 Next 버그 회피.
import { readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const routesDir = join(root, "app", "%5Fsource");

const TEMPLATE_FILE = "dva-chapter-template.jsx";
const slugOf = (file) => file.replace(/\.[^.]+$/, "");

const files = readdirSync(contentDir)
  .filter((f) => f.endsWith(".jsx") || f.endsWith(".html"))
  .sort((a, b) => {
    // .jsx 먼저, 그 안에서는 이름순 — 목차 순서와 동일하게.
    const ext = (f) => (f.endsWith(".jsx") ? 0 : 1);
    return ext(a) - ext(b) || a.localeCompare(b);
  });

if (files.length === 0) throw new Error("content/ 에 원본이 없습니다.");

const dupes = files
  .map(slugOf)
  .filter((s, i, arr) => arr.indexOf(s) !== i);
if (dupes.length) throw new Error(`슬러그 충돌(확장자 뗀 이름 중복): ${dupes.join(", ")}`);

// 1) manifest.ts
const entries = files
  .map((f) => {
    const kind = f.endsWith(".jsx") ? "jsx" : "html";
    const tmpl = f === TEMPLATE_FILE ? ", isTemplate: true" : "";
    return `  { file: ${JSON.stringify(f)}, kind: ${JSON.stringify(kind)}${tmpl} },`;
  })
  .join("\n");

writeFileSync(
  join(routesDir, "manifest.ts"),
  `// 자동 생성 — scripts/gen-source-routes.mjs. 직접 편집하지 말 것.
// dev 검수 도구 전용 매니페스트: content/ 최상위 날것 원본 목록.
// 제품 registry(content/registry.ts)와 무관하며, 여기의 어떤 것도 제품 경로로 새지 않는다.

export interface SourceItem {
  /** content/ 기준 파일명 */
  file: string;
  kind: "jsx" | "html";
  /** 제품 챕터가 아니라 저작용 템플릿임을 구분 (제외하진 않음) */
  isTemplate?: boolean;
}

export const SOURCES: SourceItem[] = [
${entries}
];

/**
 * URL 슬러그 = 확장자 뗀 파일명. 생성기가 슬러그 충돌을 막아준다.
 */
export function slugOf(file: string): string {
  return file.replace(/\\.[^.]+$/, "");
}

export function getByFile(file: string): SourceItem | undefined {
  return SOURCES.find((s) => s.file === file);
}
`,
  "utf8",
);

// 2) 파일별 정적 라우트 — 기존 생성물 정리 후 재생성.
const keep = new Set([
  "manifest.ts",
  "page.tsx",
  "SourcePage.tsx",
  "SourceHead.tsx",
  "BabelRender.tsx",
  "error-boundary.tsx",
]);
for (const entry of readdirSync(routesDir, { withFileTypes: true })) {
  if (entry.isDirectory() && !keep.has(entry.name)) {
    rmSync(join(routesDir, entry.name), { recursive: true, force: true });
  }
}

for (const file of files) {
  const dir = join(routesDir, slugOf(file));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "page.tsx"),
    `// 자동 생성 — scripts/gen-source-routes.mjs. 직접 편집하지 말 것.
import SourcePage from "../SourcePage";

export default function Page() {
  return <SourcePage file={${JSON.stringify(file)}} />;
}
`,
    "utf8",
  );
}

console.log(`생성 완료: manifest.ts + 라우트 ${files.length}개`);
