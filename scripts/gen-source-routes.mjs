// dev 검수 도구(/_source)의 라우트·매니페스트 생성기.
//
// 구조 — 왜 두 폴더로 나뉘어 있나:
//   app/_source/    손으로 쓴 소스. 언더스코어 = Next private 폴더라 라우팅되지 않고 빌드에도
//                   들어가지 않는다. git 에 커밋된다.
//   app/%5Fsource/  실제 /_source 라우트. 100% 이 스크립트의 생성물이고 gitignore 된다.
//                   %5F 는 리터럴 "_" 로 디코드돼 /_source 경로를 만든다.
//
//   predev  가 이 스크립트를 돌려 라우트를 만들고 (npm run dev 하면 자동),
//   prebuild 가 --clean 으로 지워서 production 빌드에서 /_source 를 통째로 제외한다.
//   → 로컬 검수는 그대로, 배포본에는 날것 원본(9MB)이 실리지 않는다.
//
// 원본이 추가/삭제되면 `node scripts/gen-source-routes.mjs` 를 다시 돌린다.
//
// 왜 정적 라우트를 생성하나 (동적 [file] 대신): SourcePage.tsx 상단 주석 참조 —
// %5F 이스케이프 폴더 아래 동적 세그먼트가 output:"export" 에서 매칭되지 않는 Next 버그 회피.
import { readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const srcDir = join(root, "app", "_source"); // 손으로 쓴 소스 (커밋됨)
const routesDir = join(root, "app", "%5Fsource"); // 생성된 라우트 (gitignore)

// --clean: 생성된 라우트를 지운다 (prebuild 에서 호출 → 빌드에서 /_source 제외).
if (process.argv.includes("--clean")) {
  rmSync(routesDir, { recursive: true, force: true });
  console.log("정리 완료: app/%5Fsource 제거 (production 빌드에서 /_source 제외)");
  process.exit(0);
}

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

const dupes = files.map(slugOf).filter((s, i, arr) => arr.indexOf(s) !== i);
if (dupes.length) throw new Error(`슬러그 충돌(확장자 뗀 이름 중복): ${dupes.join(", ")}`);

// 1) manifest.ts — 손으로 쓴 소스 쪽에 둔다 (_source 의 컴포넌트들이 import 하므로).
const entries = files
  .map((f) => {
    const kind = f.endsWith(".jsx") ? "jsx" : "html";
    const tmpl = f === TEMPLATE_FILE ? ", isTemplate: true" : "";
    return `  { file: ${JSON.stringify(f)}, kind: ${JSON.stringify(kind)}${tmpl} },`;
  })
  .join("\n");

writeFileSync(
  join(srcDir, "manifest.ts"),
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

// 2) 라우트 — 전부 생성물이므로 통째로 지우고 다시 만든다.
rmSync(routesDir, { recursive: true, force: true });
mkdirSync(routesDir, { recursive: true });

const banner = `// 자동 생성 — scripts/gen-source-routes.mjs. 직접 편집하지 말 것 (gitignore 됨).
// 실제 구현은 app/_source/ 에 있다.`;

// 목차 라우트 /_source
writeFileSync(
  join(routesDir, "page.tsx"),
  `${banner}
import IndexPage from "../_source/IndexPage";

export default function Page() {
  return <IndexPage />;
}
`,
  "utf8",
);

// 원본별 라우트 /_source/<slug>
for (const file of files) {
  const dir = join(routesDir, slugOf(file));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "page.tsx"),
    `${banner}
import SourcePage from "../../_source/SourcePage";

export default function Page() {
  return <SourcePage file={${JSON.stringify(file)}} />;
}
`,
    "utf8",
  );
}

console.log(`생성 완료: manifest.ts + 라우트 ${files.length + 1}개 (목차 1 + 원본 ${files.length})`);
