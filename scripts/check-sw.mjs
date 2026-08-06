// 프리캐시 목록 ↔ 빌드 산출물 대조 (#234). postbuild 가 호출한다. 어긋나면 빌드를 세운다.
//
// 왜 필요한가: public/sw.js 의 목록은 빌드 **전에** 레지스트리로 만들어진다
// (scripts/gen-sw.ts — 그래야 배포에 실린다). 그래서 앱 라우터가 실제로 낸 페이지와 조용히
// 어긋날 수 있다. 어긋남의 대가는 둘 다 사용자가 뒤늦게 겪는 종류다:
//   목록 < 실물 → 그 페이지는 오프라인에서 안 뜬다
//   목록 > 실물 → 설치 때 404 를 부른다 (부분 캐시)
// 빌드 산출물이 유일한 진실이므로, 배포 직전에 여기서 맞대 본다.
//
// 이 스크립트는 **검사만 한다** — postbuild 가 out/ 에 써 넣은 파일은 배포에 실리지 않는다
// (실측). 그래서 여기서 sw.js 를 고칠 수는 없고, 틀렸다는 사실을 크게 알리는 것이 몫이다.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");

/** 라우트가 아니라서 목록에 없어야 정상인 산출물. */
const NOT_A_ROUTE = new Set(["/404", "/_not-found"]);

/** 생성된 sw.js 에서 배열 하나를 읽어 온다. */
function readList(sw, name) {
  const m = new RegExp(`const ${name} = (\\[[^\\]]*\\]);`).exec(sw);
  if (!m) throw new Error(`public/sw.js 에서 ${name} 를 찾지 못했습니다.`);
  return JSON.parse(m[1]);
}

/** out/ 의 .html 산출물을 배포된 URL 형태(확장자 없는 라우트)로 바꾼다. */
function builtRoutes(dir, base = dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(base, full).split(sep).join("/");
    // /_source 는 dev 검수 도구다 — preview 빌드에만 있고 실유저 화면이 아니라 대조 대상이 아니다.
    const [head] = rel.split("/");
    if (head === "_source" || head.startsWith("_source.") || head === "_next") continue;
    if (entry.isDirectory()) found.push(...builtRoutes(full, base));
    else if (entry.name.endsWith(".html")) {
      const route = "/" + rel.replace(/\.html$/, "").replace(/^index$/, "").replace(/\/index$/, "");
      found.push(route === "/" ? "/" : route);
    }
  }
  return found;
}

const swPath = join(root, "public", "sw.js");
if (!existsSync(swPath)) throw new Error("public/sw.js 가 없습니다 — prebuild 의 gen-sw 가 돌지 않았습니다.");
if (!existsSync(outDir)) throw new Error("out/ 이 없습니다 — next build 뒤에 실행하세요.");

const sw = readFileSync(swPath, "utf8");
const listed = new Set(readList(sw, "ROUTES"));
const built = new Set(builtRoutes(outDir).filter((r) => !NOT_A_ROUTE.has(r)));

const missing = [...built].filter((r) => !listed.has(r)).sort();   // 실물에 있는데 목록에 없다
const extra = [...listed].filter((r) => !built.has(r)).sort();     // 목록에 있는데 실물에 없다

// 페이로드·정적 자산도 실물이 있는지 본다 (목록의 다른 두 갈래).
const absent = [...readList(sw, "PAYLOADS"), ...readList(sw, "ASSETS")]
  .filter((p) => !existsSync(join(outDir, p.replace(/^\//, "") || "index.html")))
  .sort();

if (missing.length || extra.length || absent.length) {
  console.error("프리캐시 목록이 빌드 산출물과 어긋납니다 (lib/chapter-routes.ts siteRoutes 를 맞추세요):");
  if (missing.length) console.error(`  빠짐 ${missing.length}건 — 오프라인에서 안 뜬다: ${missing.slice(0, 10).join(", ")}`);
  if (extra.length) console.error(`  잉여 ${extra.length}건 — 설치 때 404: ${extra.slice(0, 10).join(", ")}`);
  if (absent.length) console.error(`  실물 없는 자산 ${absent.length}건: ${absent.slice(0, 10).join(", ")}`);
  process.exit(1);
}

console.log(`프리캐시 목록 대조 통과: 문서 ${listed.size}개가 빌드 산출물과 일치`);
