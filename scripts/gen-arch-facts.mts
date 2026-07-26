/**
 * docs/ARCHITECTURE.md 의 "사실 블록" 생성기 (#117).
 *
 * 문서는 두 층이다:
 *   • 서술 (큰 그림·왜 이렇게 했나) — 사람/프롬프트가 쓴다. 잘 안 변한다. 여기서 안 건드린다.
 *   • 사실·인벤토리 (챕터 수·섹션 수·선택 슬롯 보유·스택 버전) — 코드가 정본이고 자주 변한다.
 *     손으로 베껴 적으면 반드시 낡는다 (#109에서 두 번 연속 낡은 채 발견됐다). 여기서 생성한다.
 *
 * 아래층만 마커 블록 사이에 다시 쓴다. 마커 밖은 한 글자도 손대지 않는다:
 *   <!-- BEGIN GENERATED: <name> -->
 *   …생성물…
 *   <!-- END GENERATED -->
 *
 * 실행:
 *   node scripts/gen-arch-facts.mts            # 다시 생성해 파일에 쓴다 (npm run docs:facts)
 *   node scripts/gen-arch-facts.mts --check    # 어긋나면 diff 출력 + exit 1 (CI 신선도 게이트)
 *
 * 정본 소스: content/registry.ts · content/schema.ts · docs/CURRICULUM.md ·
 *            package.json · .nvmrc · content/*.jsx|html
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DOC_REL = "docs/ARCHITECTURE.md";
const DOC = join(ROOT, DOC_REL);

const BEGIN_RE = /^<!-- BEGIN GENERATED: ([a-z0-9-]+) -->$/;
const END_MARK = "<!-- END GENERATED -->";

// ── 사실 수집 ────────────────────────────────────────────────────────────

interface ChapterFact {
  id: string;
  sections: number;
  slots: Record<string, boolean>;   // optionalSlots 의 각 슬롯 보유 여부
}

interface PhasePlan {
  phase: string;                    // "0단계"
  count: number;                    // 그 단계의 계획 챕터 수
}

interface Facts {
  chapters: ChapterFact[];          // registry 순서 (= 학습 순서)
  optionalSlots: string[];          // schema.ts ChapterData 의 optional 필드 이름
  chapterDirs: string[];            // content/chapters/ 하위 디렉터리 = 구조화된 챕터
  unregistered: string[];           // 디렉터리는 있는데 registry 에 없는 챕터
  plan: PhasePlan[];
  planTotal: number;
  legacyJsx: number;
  legacyHtml: number;
  deps: [string, string][];         // package.json dependencies (이름 정렬)
  typescript: string;
  node: string;                     // .nvmrc
}

function readText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

/**
 * schema.ts 의 ChapterData 에서 **optional 필드 이름**을 뽑는다.
 * 인벤토리 표의 열이 여기서 나오므로, 선택 슬롯이 늘면 표도 자동으로 늘어난다
 * (#109의 실패 모드 = selfQuiz 슬롯이 통째로 문서에서 누락된 것).
 */
function parseOptionalSlots(src: string): string[] {
  const m = src.match(/export interface ChapterData \{\n([\s\S]*?)\n\}/);
  if (!m) throw new Error("content/schema.ts: ChapterData 인터페이스를 찾지 못했다");
  const slots: string[] = [];
  for (const raw of m[1].split("\n")) {
    const line = raw.replace(/\/\/.*$/, "").trim();
    const f = line.match(/^([A-Za-z_$][\w$]*)\?\s*:/);
    if (f) slots.push(f[1]);
  }
  if (slots.length === 0) throw new Error("content/schema.ts: ChapterData 에 optional 슬롯이 하나도 없다 — 파서가 낡았는지 확인하라");
  return slots;
}

/** CURRICULUM.md §2의 단계별 계획 챕터 수 — 마이그레이션 분모의 정본. */
function parseCurriculum(src: string): PhasePlan[] {
  const sec = src.split(/^## /m).find((s) => s.startsWith("2. 커리큘럼 구조"));
  if (!sec) throw new Error("docs/CURRICULUM.md: '## 2. 커리큘럼 구조' 절을 찾지 못했다");

  const plan: PhasePlan[] = [];
  for (const raw of sec.split("\n")) {
    const head = raw.match(/^###\s+(\S+단계)/);
    if (head) {
      plan.push({ phase: head[1], count: 0 });
      continue;
    }
    if (/^-\s+\*\*Ch\s+[\w-]+\./.test(raw)) {
      if (plan.length === 0) throw new Error("docs/CURRICULUM.md: 단계 헤딩보다 챕터 항목이 먼저 나온다 — 파서가 낡았다");
      plan[plan.length - 1].count += 1;
    }
  }

  const empty = plan.filter((p) => p.count === 0).map((p) => p.phase);
  if (plan.length === 0 || empty.length > 0) {
    throw new Error(`docs/CURRICULUM.md: 챕터를 세지 못한 단계가 있다 (${empty.join("·") || "단계 자체 없음"}) — 파서가 낡았다`);
  }
  return plan;
}

async function collectFacts(): Promise<Facts> {
  const { registry } = await import("../content/registry.ts");

  const optionalSlots = parseOptionalSlots(readText("content/schema.ts"));

  const chapters: ChapterFact[] = registry.map((entry) => {
    const d = entry.data;
    const bag = d as unknown as Record<string, unknown>;
    const slots: Record<string, boolean> = {};
    for (const s of optionalSlots) slots[s] = bag[s] !== undefined;
    return { id: d.chapterMeta.id, sections: d.sections.length, slots };
  });

  // content/chapters/ 의 디렉터리 = 구조화된 챕터. registry 에 없으면 앱에 안 실린다(고립).
  const chapterDirs = readdirSync(join(ROOT, "content/chapters"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  const registered = new Set(chapters.map((c) => c.id));
  const unregistered = chapterDirs.filter((d) => !registered.has(d));

  const contentFiles = readdirSync(join(ROOT, "content"));
  const legacyJsx = contentFiles.filter((f) => f.endsWith(".jsx")).length;
  const legacyHtml = contentFiles.filter((f) => f.endsWith(".html")).length;

  const plan = parseCurriculum(readText("docs/CURRICULUM.md"));
  const planTotal = plan.reduce((n, p) => n + p.count, 0);

  const pkg = JSON.parse(readText("package.json")) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  const deps = Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b));

  return {
    chapters,
    optionalSlots,
    chapterDirs,
    unregistered,
    plan,
    planTotal,
    legacyJsx,
    legacyHtml,
    deps,
    typescript: pkg.devDependencies.typescript,
    node: readText(".nvmrc").trim(),
  };
}

// ── 블록별 생성 ──────────────────────────────────────────────────────────

/** 런타임 의존 + TypeScript + Node. 어떤 패키지를 싣느냐도 규칙으로 고정해 손 개입을 없앤다. */
function genStackVersions(f: Facts): string[] {
  return [
    "| 패키지 | 버전 |",
    "|---|---|",
    ...f.deps.map(([name, ver]) => `| \`${name}\` | \`${ver}\` |`),
    `| \`typescript\` (dev) | \`${f.typescript}\` |`,
    `| Node (\`.nvmrc\`) | \`${f.node}\` |`,
  ];
}

function genMigrationStatus(f: Facts): string[] {
  const ids = f.chapterDirs.map((d) => `\`${d}\``).join("·");
  const orphan = f.unregistered.length > 0;
  // 분자는 **registry 등록분**이다 — 디렉터리만 있고 등록 안 된 챕터는 앱에 안 실리니 진척이 아니다.
  const ratio = `**${f.chapters.length}/${f.planTotal}**${orphan ? "(registry 등록 기준)" : ""}`;
  const reg = orphan
    ? `그중 **${f.unregistered.length}개가 registry 미등록**(${f.unregistered.map((d) => `\`${d}\``).join("·")}) — 앱에 안 실린다`
    : "전부 `registry.ts`에 등록됨";
  const breakdown = f.plan.map((p) => `${p.phase} ${p.count}`).join(" + ");

  return [
    `\`content/chapters/\`에 **${f.chapterDirs.length}개** 구조화 완료 — ${ids}, ${reg}. ` +
      `\`docs/CURRICULUM.md\`가 계획한 총 **${f.planTotal}개**(${breakdown}) 대비 ${ratio}다. ` +
      `레거시 원본 **${f.legacyJsx + f.legacyHtml}개**(\`content/*.jsx\` ${f.legacyJsx} + \`.html\` ${f.legacyHtml})는 별개 계층이라 이 분모에 섞지 않는다.`,
  ];
}

function genChapterInventory(f: Facts): string[] {
  const head = ["챕터", "섹션", ...f.optionalSlots.map((s) => `\`${s}\``)];
  return [
    `| ${head.join(" | ")} |`,
    `|${head.map(() => "---").join("|")}|`,
    ...f.chapters.map(
      (c) =>
        `| \`${c.id}\` | ${c.sections} | ${f.optionalSlots.map((s) => (c.slots[s] ? "✓" : "—")).join(" | ")} |`,
    ),
  ];
}

function generateAll(f: Facts): Record<string, string[]> {
  return {
    "stack-versions": genStackVersions(f),
    "migration-status": genMigrationStatus(f),
    "chapter-inventory": genChapterInventory(f),
  };
}

// ── 마커 블록 치환 ───────────────────────────────────────────────────────

interface Block {
  name: string;
  begin: number;   // BEGIN 마커 줄 인덱스
  end: number;     // END 마커 줄 인덱스
}

function findBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let openName = "";
  let openAt = -1;

  for (let i = 0; i < lines.length; i++) {
    const b = lines[i].match(BEGIN_RE);
    if (b) {
      if (openAt >= 0) {
        throw new Error(`${DOC_REL}:${i + 1}: 생성 블록 "${openName}"이 닫히기 전에 "${b[1]}"이 열렸다 (중첩 금지)`);
      }
      openName = b[1];
      openAt = i;
      continue;
    }
    if (lines[i].trim() === END_MARK) {
      if (openAt < 0) throw new Error(`${DOC_REL}:${i + 1}: 열린 적 없는 생성 블록의 END 마커`);
      if (blocks.some((x) => x.name === openName)) {
        throw new Error(`${DOC_REL}:${openAt + 1}: 생성 블록 이름 "${openName}"이 중복`);
      }
      blocks.push({ name: openName, begin: openAt, end: i });
      openAt = -1;
    }
  }
  if (openAt >= 0) throw new Error(`${DOC_REL}:${openAt + 1}: 생성 블록 "${openName}"이 닫히지 않았다`);
  return blocks;
}

/** 블록 이름 집합이 문서와 생성기 사이에서 어긋나면 조용히 낡으니 여기서 깬다. */
function assertBlockCoverage(blocks: Block[], gen: Record<string, string[]>): void {
  const inDoc = new Set(blocks.map((b) => b.name));
  const known = Object.keys(gen);
  for (const name of inDoc) {
    if (!known.includes(name)) throw new Error(`${DOC_REL}: 생성기가 모르는 블록 "${name}" — gen-arch-facts.mts 에 추가하거나 마커를 지워라`);
  }
  for (const name of known) {
    if (!inDoc.has(name)) throw new Error(`${DOC_REL}: 생성 블록 "${name}" 마커가 문서에 없다 — 마커를 넣거나 생성기에서 빼라`);
  }
}

function applyBlocks(lines: string[], blocks: Block[], gen: Record<string, string[]>): string[] {
  const out: string[] = [];
  let cursor = 0;
  for (const b of blocks) {
    out.push(...lines.slice(cursor, b.begin + 1));   // BEGIN 마커까지 원문 그대로
    out.push(...gen[b.name]);
    cursor = b.end;                                   // END 마커부터 다시 원문
  }
  out.push(...lines.slice(cursor));
  return out;
}

/** 앞뒤 동일한 줄은 잘라내고 달라진 부분만 -/+ 로 보여준다. */
function blockDiff(cur: string[], next: string[]): string[] {
  let s = 0;
  while (s < cur.length && s < next.length && cur[s] === next[s]) s++;
  let e = 0;
  while (e < cur.length - s && e < next.length - s && cur[cur.length - 1 - e] === next[next.length - 1 - e]) e++;
  return [
    ...cur.slice(s, cur.length - e).map((l) => `  - ${l}`),
    ...next.slice(s, next.length - e).map((l) => `  + ${l}`),
  ];
}

// ── 실행 ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const check = process.argv.includes("--check");

  const src = readFileSync(DOC, "utf8");
  const lines = src.split("\n");
  const blocks = findBlocks(lines);
  const gen = generateAll(await collectFacts());
  assertBlockCoverage(blocks, gen);

  const stale = blocks.filter((b) => {
    const cur = lines.slice(b.begin + 1, b.end);
    return cur.join("\n") !== gen[b.name].join("\n");
  });

  if (stale.length === 0) {
    console.log(`✓ ${DOC_REL} 사실 블록 최신 (블록 ${blocks.length}개)`);
    return;
  }

  if (check) {
    console.error(`✗ ${DOC_REL} 의 사실 블록이 코드와 어긋난다 — 블록 ${stale.length}개:\n`);
    for (const b of stale) {
      console.error(`── [${b.name}] ──`);
      for (const l of blockDiff(lines.slice(b.begin + 1, b.end), gen[b.name])) console.error(l);
      console.error("");
    }
    console.error("`npm run docs:facts` 로 다시 생성한 뒤 커밋하라.");
    process.exit(1);
  }

  writeFileSync(DOC, applyBlocks(lines, blocks, gen).join("\n"), "utf8");
  console.log(`✓ ${DOC_REL} 갱신 — 블록 ${stale.length}개: ${stale.map((b) => b.name).join(", ")}`);
}

main().catch((err: unknown) => {
  console.error("gen-arch-facts 실행 오류:", err instanceof Error ? err.message : err);
  process.exit(1);
});
