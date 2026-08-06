// 앱 아이콘 PNG 생성기 (#234) — public/icon.svg → public/icon-192.png · icon-512.png.
//
// 왜 직접 래스터화하나: 이 리포는 바이너리를 커밋하지 않고(원본은 SVG 하나), 의존성 목록도
// 최소로 유지한다. 단색 사각형 몇 개를 그리려고 네이티브 이미지 라이브러리(sharp/resvg)를
// 들이는 건 값이 안 맞는다. 대신 SVG 를 "사각형만" 쓰는 제한 서브셋으로 못 박고, 그 서브셋을
// Node 내장 zlib 만으로 PNG 까지 굽는다.
//
// 서브셋을 벗어나면 조용히 다르게 그리는 대신 **빌드를 세운다** (parseSvg 의 검사) — 원본과
// 산출물이 말없이 어긋나는 것이 제일 나쁘기 때문이다.
//
// prebuild 가 호출한다. 산출물은 gitignore 된다.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SIZES = [192, 512];

/* ── SVG(제한 서브셋) 파싱 ─────────────────────────────────────────────── */

/**
 * 지원하는 요소는 <rect> 뿐. 그 외 도형이 보이면 던진다.
 *
 * 속성까지 화이트리스트로 보는 이유 (Codex P2, PR #238): 요소 이름만 검사하면
 * transform·opacity·ry·stroke 처럼 **적법하지만 이 래스터라이저가 구현하지 않은** 속성이
 * 조용히 무시된다. 그러면 커밋된 SVG 와 배포되는 PNG 가 말없이 달라진다 — 이 생성기가
 * 애초에 막겠다고 한 일이다.
 */
const SUPPORTED = new Set(["svg", "rect"]);
const SUPPORTED_ATTRS = {
  svg: new Set(["xmlns", "viewBox", "width", "height"]),
  rect: new Set(["x", "y", "width", "height", "rx", "fill"]),
};

/**
 * 태그 안의 속성 이름만 뽑는다 (값은 안 본다).
 * 홑따옴표도 본다 — XML 에서 적법하고, 큰따옴표만 보면 `opacity='0.5'` 같은 미구현 속성이
 * 화이트리스트 검사를 통째로 비껴간다 (Codex P2, PR #238 2라운드).
 */
function attrNames(source) {
  return [...source.matchAll(/([a-zA-Z][\w:-]*)\s*=\s*["']/g)].map((m) => m[1]);
}

export function parseSvg(source) {
  // 주석을 먼저 걷어낸다 — 주석 안의 예시 태그가 도형으로 잡히지 않게.
  const svg = source.replace(/<!--[\s\S]*?-->/g, "");

  const root = /<svg\b([^>]*)>/.exec(svg);
  if (!root) throw new Error("icon.svg: <svg> 를 찾지 못했습니다.");
  const viewBox = attr(root[1], "viewBox");
  if (!viewBox) throw new Error("icon.svg: viewBox 가 필요합니다.");
  const [vx, vy, vw, vh] = viewBox.trim().split(/[\s,]+/).map(Number);
  if (vx !== 0 || vy !== 0 || !(vw > 0) || vw !== vh) {
    throw new Error(`icon.svg: viewBox 는 "0 0 N N"(정사각) 이어야 합니다 — 받은 값 "${viewBox}"`);
  }

  const tags = [...svg.matchAll(/<([a-zA-Z][\w-]*)\b([^>]*?)\/?>/g)];
  const unsupported = tags.map((t) => t[1]).filter((name) => !SUPPORTED.has(name));
  if (unsupported.length) {
    throw new Error(
      `icon.svg: 래스터라이저가 모르는 요소 ${[...new Set(unsupported)].join(", ")} — ` +
        `<rect> 만 쓸 수 있습니다 (scripts/gen-icons.mjs 머리말).`,
    );
  }

  for (const [, name, body] of tags) {
    const unknown = attrNames(body).filter((a) => !SUPPORTED_ATTRS[name].has(a));
    if (unknown.length) {
      throw new Error(
        `icon.svg: <${name}> 의 ${unknown.join(", ")} 는 래스터라이저가 그리지 못합니다 — ` +
          `쓸 수 있는 속성: ${[...SUPPORTED_ATTRS[name]].join(", ")}.`,
      );
    }
  }

  const rects = tags
    .filter((t) => t[1] === "rect")
    .map((t, i) => {
      const a = t[2];
      const num = (name, fallback) => {
        const raw = attr(a, name);
        if (raw === undefined) {
          if (fallback !== undefined) return fallback;
          throw new Error(`icon.svg: rect[${i}] 에 ${name} 이 없습니다.`);
        }
        const n = Number(raw);
        if (!Number.isFinite(n)) throw new Error(`icon.svg: rect[${i}] 의 ${name}="${raw}" 는 수가 아닙니다.`);
        return n;
      };
      return {
        x: num("x", 0),
        y: num("y", 0),
        w: num("width"),
        h: num("height"),
        r: num("rx", 0),
        fill: parseColor(attr(a, "fill"), i),
      };
    });

  if (rects.length === 0) throw new Error("icon.svg: <rect> 가 하나도 없습니다.");
  return { size: vw, rects };
}

function attr(source, name) {
  // 값의 따옴표도 두 종류 다 받는다 (attrNames 와 같은 이유).
  const m = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`).exec(source);
  return m ? (m[2] ?? m[3]) : undefined;
}

function parseColor(raw, i) {
  if (!raw) throw new Error(`icon.svg: rect[${i}] 에 fill 이 없습니다.`);
  const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(raw.trim());
  if (!hex) throw new Error(`icon.svg: rect[${i}] 의 fill="${raw}" — #rgb·#rrggbb 만 지원합니다.`);
  const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
  return [0, 2, 4].map((o) => parseInt(h.slice(o, o + 2), 16));
}

/* ── 래스터화 ──────────────────────────────────────────────────────────── */

const SUB = 4; // 픽셀당 4×4 서브샘플 — 둥근 모서리를 계단 없이 낸다.

/** 점이 둥근 사각형 안인가 (viewBox 좌표계). */
function inside(rect, px, py) {
  const { x, y, w, h } = rect;
  if (px < x || py < y || px > x + w || py > y + h) return false;
  const r = Math.min(rect.r, w / 2, h / 2);
  if (r <= 0) return true;
  // 모서리 원 밖으로 나가는 경우만 걸러 낸다.
  const cx = px < x + r ? x + r : px > x + w - r ? x + w - r : px;
  const cy = py < y + r ? y + r : py > y + h - r ? y + h - r : py;
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= r * r;
}

/** 도형 목록을 size×size RGBA 로 굽는다 (그린 순서 = 위에 쌓이는 순서). */
export function rasterize({ size: viewSize, rects }, size) {
  const rgba = Buffer.alloc(size * size * 4); // 초기값 = 투명 검정
  const scale = viewSize / size;
  const step = scale / SUB;
  const offset = step / 2;
  const total = SUB * SUB;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const i = (py * size + px) * 4;
      for (const rect of rects) {
        let hits = 0;
        for (let sy = 0; sy < SUB; sy++) {
          const vy = (py + 0) * scale + sy * step + offset;
          for (let sx = 0; sx < SUB; sx++) {
            const vx = (px + 0) * scale + sx * step + offset;
            if (inside(rect, vx, vy)) hits++;
          }
        }
        if (hits === 0) continue;
        const a = hits / total;
        // 불투명 도형을 커버리지만큼 덮어 그린다 (source-over, 알파는 누적).
        for (let c = 0; c < 3; c++) rgba[i + c] = Math.round(rgba[i + c] * (1 - a) + rect.fill[c] * a);
        rgba[i + 3] = Math.round(rgba[i + 3] * (1 - a) + 255 * a);
      }
    }
  }
  return rgba;
}

/* ── PNG 인코딩 (RGBA8, 필터 없음) ─────────────────────────────────────── */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

export function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  // [10] compression, [11] filter, [12] interlace — 전부 0(기본)

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // 필터 타입 None — 단색 면이라 zlib 만으로 충분히 줄어든다
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── 실행 ──────────────────────────────────────────────────────────────── */

if (import.meta.url === `file://${process.argv[1]}`) {
  const svg = parseSvg(readFileSync(join(root, "public", "icon.svg"), "utf8"));
  const made = SIZES.map((size) => {
    const png = encodePng(size, rasterize(svg, size));
    writeFileSync(join(root, "public", `icon-${size}.png`), png);
    return `icon-${size}.png (${(png.length / 1024).toFixed(1)}KB)`;
  });
  console.log(`아이콘 생성 완료: ${made.join(", ")}`);
}
