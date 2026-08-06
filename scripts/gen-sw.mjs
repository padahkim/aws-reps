// 서비스 워커 빌드기 (#234) — scripts/sw.template.js + out/ 실물 목록 → out/sw.js.
//
// 왜 빌드 **뒤**(postbuild)에 out/ 을 훑나 — 레지스트리를 걷지 않고:
//   오프라인에서 셀프 퀴즈가 돌아가려면 HTML 만으로는 부족하다. Next 는 라우트마다 해시된
//   청크(_next/static/*.js)와 RSC 페이로드(*.txt)를 내고, 이름이 빌드 시점에야 정해진다.
//   HTML 만 캐시하면 하이드레이션이 죽어 화면은 뜨는데 아무것도 눌리지 않는다.
//   빌드 산출물 자체가 가장 정확한 목록이므로 그것을 그대로 쓴다.
//
// 캐시 이름에 들어갈 버전 = 담을 파일 내용 전부의 해시. 내용이 한 글자라도 바뀌면 새 캐시가
// 되고, 옛 캐시는 activate 에서 지워진다. 아무것도 안 바뀌면 같은 버전이라 갱신 배너도 안 뜬다.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");
const templatePath = join(root, "scripts", "sw.template.js");

/**
 * 프리캐시에서 빼는 것들. out/ 기준 상대 경로(POSIX 구분자)를 받는다.
 *
 * `_source` — dev 검수 도구(/_source)의 날것 원본 9MB. Vercel **preview** 빌드에서는
 * 실제로 out/ 에 존재한다 (scripts/gen-source-routes.mjs 의 --build 분기). 실유저가 쓰는
 * 화면이 아니고, 오프라인으로 들고 다닐 이유는 더더욱 없다. 여기서 명시적으로 끊는다.
 *
 * 폴더만 막으면 새는 것에 주의: Next 는 인덱스 라우트를 폴더 **옆에** 도 떨군다
 * (out/_source/ 와 나란히 out/_source.html · _source.txt). 그래서 첫 세그먼트를
 * "_source" 와 "_source.*" 양쪽으로 본다 — _sourcemap 같은 남의 이름은 건드리지 않게.
 */
export function shouldPrecache(relPath) {
  if (relPath === "sw.js") return false; // 자기 자신
  const [head] = relPath.split("/");
  if (head === "_source" || head.startsWith("_source.")) return false;
  return !relPath.split("/").some((seg) => seg.startsWith("."));
}

/** out/ 을 훑어 URL 경로 목록을 만든다 (정렬 고정 — 같은 빌드면 같은 목록). */
export function collect(dir, base = dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(base, full).split(sep).join("/");
    if (!shouldPrecache(rel)) continue;
    if (entry.isDirectory()) found.push(...collect(full, base));
    else if (entry.isFile()) found.push(rel);
  }
  return found.sort();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = collect(outDir);
  if (files.length === 0) throw new Error("out/ 이 비었습니다 — next build 뒤에 실행하세요.");

  const digest = createHash("sha256");
  let bytes = 0;
  for (const rel of files) {
    const buf = readFileSync(join(outDir, rel));
    bytes += buf.length;
    digest.update(rel).update("\0").update(buf).update("\0");
  }
  const version = digest.digest("hex").slice(0, 12);

  const template = readFileSync(templatePath, "utf8");
  const sw = template
    .replaceAll("__VERSION__", version)
    .replaceAll("__PRECACHE__", JSON.stringify(files.map((f) => `/${f}`)));

  // 치환이 실제로 일어났는지 확인한다 — 자리표시자 이름을 고치고 여기를 잊으면
  // 캐시가 통째로 비어 조용히 오프라인이 안 되는 상태로 배포된다.
  for (const token of ["__VERSION__", "__PRECACHE__"]) {
    if (sw.includes(token)) throw new Error(`sw.template.js 의 ${token} 를 치환하지 못했습니다.`);
  }

  writeFileSync(join(outDir, "sw.js"), sw, "utf8");
  console.log(
    `서비스 워커 생성 완료: out/sw.js — 프리캐시 ${files.length}개 ` +
      `(${(bytes / 1024 / 1024).toFixed(1)}MB), 버전 ${version}`,
  );
}
