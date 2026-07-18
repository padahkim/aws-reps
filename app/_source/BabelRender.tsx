"use client";

import { useEffect, useState } from "react";
import * as ReactNS from "react";
import ReactDefault from "react";
import * as LucideNS from "lucide-react";
import type { ComponentType } from "react";
import ErrorBoundary from "./error-boundary";

// 날것 .jsx 원본을 "브라우저에서" Babel 로 변환해 렌더한다.
//
// 왜 번들러(Turbopack)가 아니라 Babel 인가:
//   이 원본들은 Babel 기반 플레이그라운드에서 저작됐고, 일부는 JSX 안에 escape 안 한 날 `>`
//   (예: "stock > :zero") 같은, Next 의 SWC 가 거부하는 구문을 담고 있다. 그런 파일이 번들러
//   그래프에 들어가면 dev 서버 전체가 sticky 500 으로 죽어 제품 라우트까지 오염된다.
//   → 원본은 절대 import 하지 않고 fs 로 읽은 "문자열"만 받아 브라우저에서 변환한다.
//   파싱 불가 파일은 변환 단계에서 예외 → 여기서 잡아 그 파일만 실패하고 목차·나머지는 산다.
//
//   react / lucide-react 는 이 (정상) 모듈이 정적 import 해 require 심으로 주입한다 —
//   원본이 실제 아이콘까지 그대로 렌더된다.

type Status =
  | { state: "loading" }
  | { state: "ready"; Comp: ComponentType }
  | { state: "error"; error: Error };

interface BabelStandalone {
  transform: (code: string, opts: unknown) => { code: string | null };
}
declare global {
  interface Window {
    Babel?: BabelStandalone;
  }
}

// layout 이 주입한 Babel standalone 스크립트가 준비될 때까지 대기.
function waitForBabel(): Promise<BabelStandalone> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.Babel) return resolve(window.Babel);
      if (Date.now() - start > 15000) {
        return reject(new Error("Babel standalone 로드 실패 (CDN 차단?)"));
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}

// Babel 의 commonjs interop 이 통과하도록 __esModule/default/named 를 모두 갖춘 CJS 형태로 정리.
const reactModule = Object.assign({ __esModule: true, default: ReactDefault }, ReactNS);

// 설치된 lucide-react 에 없는 아이콘(예: 1.x 에서 빠진 브랜드 아이콘 `Github`)은 undefined 로
// 나가 "Element type is invalid" 로 문서 전체를 죽인다. 검수 도구에서 아이콘 하나 때문에 본문을
// 못 보는 건 손해이므로, 없는 이름은 눈에 띄는 자리표시자로 대체한다.
// 접근할 때마다 새 컴포넌트를 만들면 매 렌더 remount 되므로 이름별로 캐시한다.
const iconFallbacks = new Map<string, ComponentType>();

function makeIconFallback(name: string): ComponentType {
  const cached = iconFallbacks.get(name);
  if (cached) return cached;
  const Fallback = () =>
    ReactDefault.createElement(
      "span",
      {
        title: `lucide-react 에 없는 아이콘: ${name}`,
        style: {
          display: "inline-block",
          width: "1em",
          height: "1em",
          borderRadius: "2px",
          background: "#fca5a5",
        },
      },
      null,
    );
  Fallback.displayName = `MissingIcon(${name})`;
  iconFallbacks.set(name, Fallback);
  return Fallback;
}

const lucideModule = new Proxy(
  Object.assign({ __esModule: true }, LucideNS) as Record<string, unknown>,
  {
    get(target, prop: string | symbol) {
      if (typeof prop === "string" && !(prop in target)) {
        return makeIconFallback(prop);
      }
      return target[prop as string];
    },
  },
);

function requireShim(name: string): unknown {
  if (name === "react") return reactModule;
  if (name === "lucide-react") return lucideModule;
  throw new Error(`검수 도구가 해석하지 못한 import: "${name}"`);
}

function compile(source: string, file: string, Babel: BabelStandalone): ComponentType {
  const out = Babel.transform(source, {
    filename: file,
    presets: [
      ["env", { modules: "commonjs", targets: { esmodules: true } }],
      ["react", { runtime: "classic" }],
    ],
  });
  if (!out.code) throw new Error("Babel 변환 결과가 비었습니다.");

  const module: { exports: Record<string, unknown> } = { exports: {} };
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const factory = new Function("require", "module", "exports", "React", out.code);
  factory(requireShim, module, module.exports, ReactDefault);

  const Comp = (module.exports.default ?? module.exports) as ComponentType | undefined;
  if (typeof Comp !== "function") {
    throw new Error("default export 컴포넌트를 찾지 못했습니다.");
  }
  return Comp;
}

export default function BabelRender({ file, source }: { file: string; source: string }) {
  const [status, setStatus] = useState<Status>({ state: "loading" });

  useEffect(() => {
    let alive = true;
    setStatus({ state: "loading" });
    waitForBabel()
      .then((Babel) => {
        const Comp = compile(source, file, Babel);
        if (alive) setStatus({ state: "ready", Comp });
      })
      .catch((e: unknown) => {
        if (alive) {
          setStatus({
            state: "error",
            error: e instanceof Error ? e : new Error(String(e)),
          });
        }
      });
    return () => {
      alive = false;
    };
  }, [file, source]);

  if (status.state === "loading") {
    return <p style={{ color: "#888" }}>Babel 변환 중…</p>;
  }

  if (status.state === "error") {
    // 변환/평가 실패 (예: SWC/Babel 모두 못 읽는 구문) — 렌더 이전 단계라 에러 경계가 못 잡는다.
    return (
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #e11d48",
          borderRadius: "8px",
          background: "#fff1f2",
          color: "#9f1239",
          fontFamily: "ui-monospace, monospace",
          fontSize: "0.85rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <strong>⚠ 변환 실패: {file}</strong>
        {"\n\n"}
        {status.error.message}
      </div>
    );
  }

  const Comp = status.Comp;
  // 렌더 도중 던지는 원본은 에러 경계가 잡는다 (변환 실패와 별개 단계).
  return (
    <ErrorBoundary key={file} file={file}>
      <Comp />
    </ErrorBoundary>
  );
}
