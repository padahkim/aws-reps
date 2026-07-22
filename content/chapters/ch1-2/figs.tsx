"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { C } from "../ui";

/**
 * 챕터 도식 SVG + 챕터 로컬 컴포넌트 (규약 v3) — sections/*.mdx 가 import 한다.
 * InvocationModeExplorer/ReservedConcurrencySlider/CanaryWeightSlider 는 원본
 * aws-lambda-dva-guide-2.jsx 의 학습용 인터랙티브 3종 이식본(#71) — useState 를
 * 쓰므로 파일 전체를 "use client"로 둔다 (body.tsx 클라이언트 경계 안이라 무해, ch0-2 전례).
 */

export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** 코드/CLI 예시 블록 — 잉크 배경 카드 (전역 셀렉터 없이 인라인 스타일만). */
export function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div style={{ margin: "1rem 0" }}>
      {title && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: C.inkSoft,
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          fontFamily: MONO,
          fontSize: "0.8rem",
          lineHeight: 1.7,
          background: C.ink,
          color: "#D5E0EC",
          borderRadius: 11,
          padding: "1rem 1.15rem",
          overflowX: "auto",
          margin: 0,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

/** 주의(함정) 콜아웃 — 레드 왼쪽 보더. */
export function WarnBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: C.redSoft,
        color: C.ink,
        borderLeft: `5px solid ${C.red}`,
        borderRadius: "0 12px 12px 0",
        padding: "0.85rem 1.15rem",
        margin: "1.25rem 0",
        fontSize: "0.93rem",
      }}
    >
      <b style={{ color: C.red }}>⚠ 함정 </b>
      {children}
    </div>
  );
}

export function PermissionSvg() {
  return (
    <svg viewBox="0 0 700 190" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="30" y="25" width="150" height="50" rx="10" fill={C.card} stroke={C.amber} strokeWidth="1.6" />
      <text x="105" y="55" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        Lambda 함수
      </text>
      <rect x="470" y="25" width="200" height="50" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="570" y="48" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>
        S3 · DynamoDB · SQS …
      </text>
      <text x="570" y="65" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        읽기/쓰기 (나가는 방향)
      </text>
      <line x1="180" y1="50" x2="470" y2="50" stroke={C.amber} strokeWidth="2" />
      <text x="325" y="40" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.amberText}>
        실행 역할 (Execution Role)
      </text>
      <rect x="30" y="115" width="200" height="50" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="130" y="138" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>
        다른 서비스 · 다른 계정
      </text>
      <text x="130" y="155" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        S3 이벤트, ALB, 계정 B …
      </text>
      <rect x="520" y="115" width="150" height="50" rx="10" fill={C.card} stroke={C.amber} strokeWidth="1.6" />
      <text x="595" y="145" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        함수 호출
      </text>
      <line x1="230" y1="140" x2="520" y2="140" stroke={C.teal} strokeWidth="2" />
      <text x="375" y="130" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.teal}>
        리소스 기반 정책 (들어오는 방향)
      </text>
    </svg>
  );
}

/* ============ 인터랙티브 3종 — aws-lambda-dva-guide-2.jsx 이식 (#71) ============ */

/** 인터랙티브 공용 프레임 — ch0-2 EvalEngine 의 잉크 헤더 카드 관례. */
function SimFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        overflow: "hidden",
        margin: "1.25rem 0",
        color: C.ink,
      }}
    >
      <div
        style={{
          background: C.ink,
          padding: "10px 16px",
          fontFamily: MONO,
          color: "#DCE6F2",
          fontSize: "0.82rem",
          fontWeight: 700,
        }}
      >
        🎛 {title}
      </div>
      <div style={{ padding: "1rem 1.1rem" }}>{children}</div>
    </div>
  );
}

/** 원본 Svg 헬퍼 이식 — 좁은 화면에선 가로 스크롤 (minWidth 560). */
function FlowSvg({ vb, mid, children }: { vb: string; mid: string; children: ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={vb} style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}>
        <defs>
          <marker id={mid} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

/** 원본 Box 헬퍼 이식 — 색 8% 틴트 채움은 라이트 배경에서도 같은 문법이 성립한다. */
function FlowBox({
  x, y, w, h, label, sub, color, dashed = false,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; color: string; dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        fill={`${color}14`} stroke={color} strokeWidth={1.5}
        strokeDasharray={dashed ? "5 4" : "none"}
      />
      <text
        x={x + w / 2} y={y + (sub ? h / 2 - 5 : h / 2 + 1)}
        textAnchor="middle" dominantBaseline="middle"
        fill={C.ink} fontSize={13} fontWeight={700}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2} y={y + h / 2 + 13}
          textAnchor="middle" dominantBaseline="middle"
          fill={C.inkSoft} fontSize={10.5} fontFamily={MONO}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/**
 * prefers-reduced-motion 감지 — SMIL 은 CSS 미디어쿼리로 못 끄므로 JS 로 분기한다.
 * useEffect 는 클라이언트에서만 실행되어 프리렌더에 안전 (초기값 false → 하이드레이션 후 반영).
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** 원본 Arrow 헬퍼 이식 — animate 는 경로를 따라 도는 점(SMIL animateMotion). dur 로 유량을 표현한다. */
function FlowArrow({
  d, color, mid, label, lx, ly, dash = false, animate = false, dur = 2.2,
}: {
  d: string; color: string; mid: string;
  label?: string; lx?: number; ly?: number; dash?: boolean; animate?: boolean; dur?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <g>
      <path
        d={d} fill="none" stroke={color} strokeWidth={1.8}
        strokeDasharray={dash ? "6 5" : "none"}
        markerEnd={`url(#${mid})`} opacity={0.9}
      />
      {animate && !reducedMotion && (
        <circle r={4} fill={color}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
        </circle>
      )}
      {label && (
        <text x={lx} y={ly} textAnchor="middle" fill={color} fontSize={11} fontFamily={MONO}>
          {label}
        </text>
      )}
    </g>
  );
}

/**
 * 호출 방식 탐색기 — 원본 TabInvocation 이식. 버튼으로 sync/async/poll 을 전환하며
 * 각 방식의 흐름도를 비교한다. 색 관례는 구 InvocationSvg 를 승계: 동기=blue,
 * 비동기=amber, 폴링=teal (Lambda 는 중립 ink).
 */
export function InvocationModeExplorer() {
  const [mode, setMode] = useState<"sync" | "async" | "poll">("sync");
  const modes = [
    { id: "sync" as const, label: "① 동기 (Synchronous)", color: C.blue, soft: C.blueSoft, text: C.blue },
    { id: "async" as const, label: "② 비동기 (Asynchronous)", color: C.amber, soft: C.amberSoft, text: C.amberText },
    { id: "poll" as const, label: "③ 이벤트 소스 매핑 (Polling)", color: C.teal, soft: C.tealSoft, text: C.teal },
  ];
  const mid = "arr-inv";
  const caption: Record<typeof mode, string> = {
    sync: "호출자가 결과를 기다립니다 — 에러도 그대로 돌려받으며, 재시도는 클라이언트 책임입니다.",
    async: "이벤트가 내부 큐에 적재되고 호출자는 즉시 202를 받습니다 — 함수 오류는 자동 재시도(총 3회 시도)되므로 함수는 멱등해야 하고, 스로틀·서비스 오류는 큐로 되돌려 최대 6시간 재시도됩니다.",
    poll: "큐·스트림은 Lambda를 직접 호출하지 못하므로, ESM이 소스를 대신 폴링해 배치를 동기 호출합니다.",
  };

  return (
    <SimFrame title="호출 방식 탐색기 — 클릭해서 흐름을 비교해 보세요">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            aria-pressed={mode === m.id}
            style={{
              cursor: "pointer",
              fontFamily: MONO,
              fontSize: "0.78rem",
              padding: "8px 14px",
              borderRadius: 8,
              border: `1.5px solid ${mode === m.id ? m.color : C.line}`,
              background: mode === m.id ? m.soft : "transparent",
              color: mode === m.id ? m.text : C.inkSoft,
              fontWeight: mode === m.id ? 700 : 400,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "sync" && (
        <FlowSvg vb="0 0 720 200" mid={mid}>
          <FlowBox x={30} y={70} w={150} h={60} label="클라이언트" sub="API Gateway · ALB · CLI" color={C.blue} />
          <FlowBox x={290} y={70} w={150} h={60} label="λ Lambda" color={C.ink} />
          <FlowBox x={550} y={70} w={140} h={60} label="응답 대기" sub="결과·에러 즉시 반환" color={C.blue} dashed />
          <FlowArrow d="M180,90 L290,90" color={C.blue} mid={mid} label="요청 (대기함)" lx={235} ly={80} animate />
          <FlowArrow d="M290,110 L180,110" color={C.teal} mid={mid} label="응답 / 에러" lx={235} ly={128} animate />
          <FlowArrow d="M440,100 L550,100" color={C.inkSoft} mid={mid} dash />
          <text x={360} y={175} textAnchor="middle" fill={C.inkSoft} fontSize={12}>
            재시도 없음 — 에러 처리는 클라이언트 책임
          </text>
        </FlowSvg>
      )}

      {mode === "async" && (
        <FlowSvg vb="0 0 720 260" mid={mid}>
          <FlowBox x={20} y={30} w={140} h={56} label="S3 · SNS" sub="EventBridge 등" color={C.amber} />
          <FlowBox x={230} y={30} w={160} h={56} label="내부 이벤트 큐" sub="Lambda가 관리" color={C.amber} dashed />
          <FlowBox x={460} y={30} w={150} h={56} label="λ Lambda" color={C.ink} />
          <FlowBox x={230} y={160} w={170} h={56} label="실패 대상" sub="DLQ 또는 Destination" color={C.red} />
          <FlowBox x={470} y={160} w={170} h={56} label="성공 대상" sub="Destination (SQS·SNS·λ·EB)" color={C.teal} />
          <FlowArrow d="M160,50 L230,50" color={C.amber} mid={mid} label="이벤트 적재" lx={195} ly={40} animate />
          <FlowArrow d="M230,72 L160,72" color={C.inkSoft} mid={mid} label="202 즉시 반환" lx={195} ly={100} dash />
          <FlowArrow d="M390,58 L460,58" color={C.amber} mid={mid} animate />
          <FlowArrow d="M500,86 C480,130 420,150 400,160" color={C.red} mid={mid} label="함수 오류 3회 후" lx={430} ly={128} dash />
          <FlowArrow d="M545,86 L552,160" color={C.teal} mid={mid} label="성공 시" lx={585} ly={128} dash />
          <text x={360} y={245} textAnchor="middle" fill={C.inkSoft} fontSize={12}>
            함수 오류: 총 3회 시도 후 DLQ/Destination · 스로틀·서비스 오류: 최대 6시간 백오프 재시도
          </text>
        </FlowSvg>
      )}

      {mode === "poll" && (
        <FlowSvg vb="0 0 720 230" mid={mid}>
          <FlowBox x={20} y={60} w={160} h={64} label="SQS · Kinesis" sub="DynamoDB Streams" color={C.teal} />
          <FlowBox x={280} y={60} w={180} h={64} label="Event Source Mapping" sub="Lambda가 대신 폴링" color={C.teal} dashed />
          <FlowBox x={540} y={60} w={150} h={64} label="λ Lambda" sub="배치 단위 동기 호출" color={C.ink} />
          <FlowArrow d="M280,80 L180,80" color={C.teal} mid={mid} label="poll" lx={230} ly={70} animate />
          <FlowArrow d="M180,105 L280,105" color={C.teal} mid={mid} label="배치(레코드 묶음)" lx={230} ly={125} animate />
          <FlowArrow d="M460,92 L540,92" color={C.amber} mid={mid} animate />
          <text x={360} y={185} textAnchor="middle" fill={C.inkSoft} fontSize={12}>
            SQS: 성공한 메시지 삭제 · Kinesis/DDB Streams: 샤드 순서 보장, 성공 또는 만료까지 재시도(횟수·수명 제한 설정 가능)
          </text>
        </FlowSvg>
      )}

      <p style={{ fontSize: "0.85rem", color: C.inkSoft, lineHeight: 1.65, margin: "10px 0 0" }}>
        {caption[mode]}
      </p>
    </SimFrame>
  );
}

/** 예약 동시성 슬라이더 — 원본 TabConcurrency 이식. 계정 풀 1,000을 나눠보는 시뮬레이터. */
export function ReservedConcurrencySlider() {
  const [reserved, setReserved] = useState(200);
  const total = 1000;
  const otherPool = total - reserved;

  return (
    <SimFrame title="예약 동시성 — 슬라이더로 풀을 나눠보세요">
      <input
        type="range"
        min={0}
        max={900}
        step={50}
        value={reserved}
        onChange={(e) => setReserved(Number(e.target.value))}
        aria-label="중요 함수 A의 예약 동시성"
        style={{ width: "100%", accentColor: C.amber }}
      />
      <div
        style={{
          display: "flex",
          height: 54,
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${C.line}`,
          marginTop: 10,
        }}
      >
        <div
          style={{
            width: `${(reserved / total) * 100}%`,
            background: C.amberSoft,
            borderRight: reserved > 0 ? `2px solid ${C.amber}` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
            overflow: "hidden",
            transition: "width .2s",
          }}
        >
          {reserved > 0 && (
            <span style={{ fontFamily: MONO, fontSize: "0.75rem", color: C.amberText, whiteSpace: "nowrap" }}>
              함수 A: {reserved}
            </span>
          )}
        </div>
        <div
          style={{
            flex: 1,
            background: C.tealSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // minWidth 0 + overflow hidden 필수 — nowrap 라벨이 flex 최소 폭을 키워
            // 바 비율 자체를 왜곡한다 (#80 Codex 리뷰). 극단값에선 라벨이 잘리는 게 맞다.
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: "0.75rem", color: C.teal, whiteSpace: "nowrap" }}>
            공유 풀: {otherPool}
          </span>
        </div>
      </div>
      <p style={{ fontSize: "0.88rem", color: C.inkSoft, lineHeight: 1.65, margin: "12px 0 0" }}>
        중요 함수 A는 트래픽이 폭주해도 <b style={{ color: C.amberText }}>{reserved}</b>을 넘지
        못하고(상한), 다른 함수들이 아무리 바빠도 <b style={{ color: C.amberText }}>{reserved}</b>은
        A를 위해 남아 있습니다(보장). 나머지 모든 함수는 공유 풀 {otherPool}을 나눠 씁니다.
      </p>
    </SimFrame>
  );
}

/** 카나리 배포 슬라이더 — 원본 TabDeploy 이식. 별칭 가중치로 V1/V2 트래픽을 나눠보는 시뮬레이터. */
export function CanaryWeightSlider() {
  const [weight, setWeight] = useState(10);
  const mid = "arr-canary";

  return (
    <SimFrame title="가중치 별칭 카나리 배포 — 직접 조절해 보세요">
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        aria-label="버전 2로 보낼 트래픽 비율"
        style={{ width: "100%", accentColor: C.teal }}
      />
      <FlowSvg vb="0 0 720 210" mid={mid}>
        <FlowBox x={30} y={75} w={150} h={60} label={'별칭 "prod"'} sub="트래픽 분배" color={C.amber} />
        <FlowBox x={470} y={20} w={200} h={60} label="버전 1 (기존)" sub={`${100 - weight}% 트래픽`} color={C.blue} />
        <FlowBox x={470} y={130} w={200} h={60} label="버전 2 (신규)" sub={`${weight}% 트래픽`} color={C.teal} />
        {/* dur ∝ 1/트래픽 비율 — 점 주기가 유량을 표현해야 5/95 가 50/50 처럼 안 보인다 (#80 Codex 리뷰) */}
        <FlowArrow d="M180,95 C330,90 340,55 470,50" color={C.blue} mid={mid} animate={weight < 100} dur={110 / (100 - weight)} />
        <FlowArrow d="M180,115 C330,120 340,155 470,160" color={C.teal} mid={mid} animate={weight > 0} dur={110 / weight} />
        <text x={310} y={60} textAnchor="middle" fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700}>
          {100 - weight}%
        </text>
        <text x={310} y={155} textAnchor="middle" fill={C.teal} fontSize={13} fontFamily={MONO} fontWeight={700}>
          {weight}%
        </text>
      </FlowSvg>
      <p style={{ fontSize: "0.88rem", color: C.inkSoft, lineHeight: 1.65, margin: "10px 0 0" }}>
        prod 별칭 하나가 트래픽을 V1 <b style={{ color: C.blue }}>{100 - weight}%</b> / V2{" "}
        <b style={{ color: C.teal }}>{weight}%</b>로 나눕니다 — 신규 버전을 소량으로 검증한 뒤
        가중치를 올려 전환을 완료하는 <b>카나리 배포</b> 패턴입니다.
      </p>
    </SimFrame>
  );
}
