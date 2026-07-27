"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { C, FigSwitch } from "../ui";
import { SimFrame } from "../interactive";

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

/**
 * 두 방향 권한 도식 — 원본 aws-lambda-dva-guide-2.jsx TabSecurity 이식(#81). Lambda를 가운데
 * 두고 들어오는 권한(리소스 기반 정책)과 나가는 권한(실행 역할)을 좌우로 대칭 배치한다.
 * 구 2×2 배치본을 이 중앙 정렬 레이아웃으로 대체 — Lambda가 한 번만 등장해 방향이 더 또렷하다.
 * FlowSvg/FlowBox/FlowArrow(아래 정의)는 함수 선언이라 호이스팅되어 여기서 참조해도 안전하다.
 */
export function PermissionSvg() {
  const mid = "arr-perm";
  const midV = "arr-perm-v";
  return (
    <FigSwitch
      wide={
        <FlowSvg vb="0 0 720 210" mid={mid}>
          <FlowBox x={30} y={82} w={170} h={64} label="S3 · SNS · 다른 계정" sub="호출하는 쪽" color={C.amber} />
          <FlowBox x={280} y={78} w={160} h={72} label="λ Lambda" color={C.ink} />
          <FlowBox x={520} y={82} w={170} h={64} label="DynamoDB · S3 · SQS" sub="접근당하는 쪽" color={C.teal} />
          <FlowArrow d="M200,110 L280,110" color={C.amber} mid={mid} animate />
          <FlowArrow d="M440,114 L520,114" color={C.teal} mid={mid} animate />
          <text x={240} y={96} textAnchor="middle" fill={C.amberText} fontSize={11.5} fontFamily={MONO} fontWeight={700}>
            리소스 기반 정책
          </text>
          <text x={240} y={140} textAnchor="middle" fill={C.inkSoft} fontSize={10.5}>
            “누가 나를 호출?” · 들어옴
          </text>
          <text x={480} y={100} textAnchor="middle" fill={C.teal} fontSize={11.5} fontFamily={MONO} fontWeight={700}>
            실행 역할 (IAM Role)
          </text>
          <text x={480} y={140} textAnchor="middle" fill={C.inkSoft} fontSize={10.5}>
            “내가 무엇에 접근?” · 나감
          </text>
          <text x={360} y={186} textAnchor="middle" fill={C.inkSoft} fontSize={12}>
            폴링(ESM)은 예외 — Lambda가 소스를 읽으므로 실행 역할에 읽기 권한
          </text>
        </FlowSvg>
      }
      narrow={
        <FlowSvg vb="0 0 360 430" mid={midV} minW={0}>
          <FlowBox x={95} y={20} w={170} h={64} label="S3 · SNS · 다른 계정" sub="호출하는 쪽" color={C.amber} />
          <FlowBox x={100} y={148} w={160} h={72} label="λ Lambda" color={C.ink} />
          <FlowBox x={95} y={300} w={170} h={64} label="DynamoDB · S3 · SQS" sub="접근당하는 쪽" color={C.teal} />
          <FlowArrow d="M180,84 L180,148" color={C.amber} mid={midV} animate />
          <FlowArrow d="M180,220 L180,300" color={C.teal} mid={midV} animate />
          <text x={70} y={110} textAnchor="middle" fill={C.amberText} fontSize={11.5} fontFamily={MONO} fontWeight={700}>
            리소스 기반 정책
          </text>
          <text x={78} y={128} textAnchor="middle" fill={C.inkSoft} fontSize={10.5}>
            “누가 나를 호출?” · 들어옴
          </text>
          <text x={272} y={252} textAnchor="middle" fill={C.teal} fontSize={11.5} fontFamily={MONO} fontWeight={700}>
            실행 역할 (IAM Role)
          </text>
          <text x={272} y={270} textAnchor="middle" fill={C.inkSoft} fontSize={10.5}>
            “내가 무엇에 접근?” · 나감
          </text>
          <text x={180} y={396} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
            폴링(ESM)은 예외 — Lambda가 소스를
          </text>
          <text x={180} y={414} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
            읽으므로 실행 역할에 읽기 권한
          </text>
        </FlowSvg>
      }
    />
  );
}

/* ============ 인터랙티브 3종 — aws-lambda-dva-guide-2.jsx 이식 (#71) ============ */

/**
 * 원본 Svg 헬퍼 이식 — 기본은 가로형(minWidth 560, 좁으면 가로 스크롤). 세로형(#101)은
 * minW={0}으로 컨테이너 폭에 맞춰 축소되게 한다 (세로 배치는 360 폭이라 축소해도 읽힌다).
 */
function FlowSvg({ vb, mid, minW = 560, children }: { vb: string; mid: string; minW?: number; children: ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={vb} style={{ width: "100%", minWidth: minW || undefined, height: "auto", display: "block" }}>
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

/**
 * 원본 Arrow 헬퍼 이식 — animate 는 경로를 따라 도는 점(SMIL animateMotion). dur 로 유량을 표현한다.
 * dots(#81) = 경로 위를 함께 흐르는 점의 수. 1이면 단발(동기 요청 1건), 여러 개면 dur 을 균등 분할해
 * 연속 스트림처럼 보인다 — 비동기 큐 적재·폴링 배치 묶음의 "흐름"을 움직임으로 구분하는 장치.
 */
function FlowArrow({
  d, color, mid, label, lx, ly, dash = false, animate = false, dur = 2.2, dots = 1,
}: {
  d: string; color: string; mid: string;
  label?: string; lx?: number; ly?: number;
  dash?: boolean; animate?: boolean; dur?: number; dots?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <g>
      <path
        d={d} fill="none" stroke={color} strokeWidth={1.8}
        strokeDasharray={dash ? "6 5" : "none"}
        markerEnd={`url(#${mid})`} opacity={0.9}
      />
      {animate && !reducedMotion &&
        Array.from({ length: Math.max(1, dots) }).map((_, i) => (
          <circle key={i} r={4} fill={color}>
            <animateMotion
              dur={`${dur}s`}
              begin={`${(i * dur) / Math.max(1, dots)}s`}
              repeatCount="indefinite"
              path={d}
            />
          </circle>
        ))}
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
  const midV = "arr-inv-v";
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
        <FigSwitch
          wide={
            <FlowSvg vb="0 0 720 200" mid={mid}>
              <FlowBox x={30} y={70} w={150} h={60} label="클라이언트" sub="API Gateway · ALB · CLI" color={C.blue} />
              <FlowBox x={290} y={70} w={150} h={60} label="λ Lambda" color={C.ink} />
              <FlowBox x={550} y={70} w={140} h={60} label="응답 대기" sub="결과·에러 즉시 반환" color={C.blue} dashed />
              {/* 요청은 느리게(응답까지 블로킹), 응답은 빠르게 — 비대칭 유량이 "기다림"을 드러낸다(#81) */}
              <FlowArrow d="M180,90 L290,90" color={C.blue} mid={mid} label="요청 — 응답까지 블로킹" lx={235} ly={80} animate dur={2.8} />
              <FlowArrow d="M290,110 L180,110" color={C.teal} mid={mid} label="응답 / 에러" lx={235} ly={128} animate dur={1.1} />
              <FlowArrow d="M440,100 L550,100" color={C.inkSoft} mid={mid} dash />
              <text x={360} y={175} textAnchor="middle" fill={C.inkSoft} fontSize={12}>
                재시도 없음 — 에러 처리는 클라이언트 책임
              </text>
            </FlowSvg>
          }
          narrow={
            <FlowSvg vb="0 0 360 360" mid={midV} minW={0}>
              <FlowBox x={95} y={20} w={170} h={60} label="클라이언트" sub="API Gateway · ALB · CLI" color={C.blue} />
              <FlowBox x={95} y={160} w={170} h={60} label="λ Lambda" color={C.ink} />
              <FlowBox x={95} y={260} w={170} h={56} label="응답 대기" sub="결과·에러 즉시 반환" color={C.blue} dashed />
              <FlowArrow d="M150,80 L150,160" color={C.blue} mid={midV} label="요청 — 응답까지 블로킹" lx={76} ly={112} animate dur={2.8} />
              <FlowArrow d="M210,160 L210,80" color={C.teal} mid={midV} label="응답 / 에러" lx={282} ly={112} animate dur={1.1} />
              <FlowArrow d="M180,220 L180,260" color={C.inkSoft} mid={midV} dash />
              <text x={180} y={346} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
                재시도 없음 — 에러 처리는 클라이언트 책임
              </text>
            </FlowSvg>
          }
        />
      )}

      {mode === "async" && (
        <FigSwitch
          wide={
            <FlowSvg vb="0 0 720 260" mid={mid}>
              <FlowBox x={20} y={30} w={140} h={56} label="S3 · SNS" sub="EventBridge 등" color={C.amber} />
              <FlowBox x={230} y={30} w={160} h={56} label="내부 이벤트 큐" sub="Lambda가 관리" color={C.amber} dashed />
              <FlowBox x={460} y={30} w={150} h={56} label="λ Lambda" color={C.ink} />
              <FlowBox x={230} y={160} w={170} h={56} label="실패 대상" sub="DLQ 또는 Destination" color={C.red} />
              <FlowBox x={470} y={160} w={170} h={56} label="성공 대상" sub="Destination (SQS·SNS·λ·EB)" color={C.teal} />
              {/* 이벤트가 연달아 큐에 쌓이고(dots=3), 202는 거의 즉시 되돌아온다(dur 0.6) — "적재 + 즉시 반환"(#81) */}
              <FlowArrow d="M160,50 L230,50" color={C.amber} mid={mid} label="이벤트 적재" lx={195} ly={40} animate dur={1.9} dots={3} />
              <FlowArrow d="M230,72 L160,72" color={C.inkSoft} mid={mid} label="202 즉시 반환" lx={195} ly={100} dash animate dur={0.6} />
              <FlowArrow d="M390,58 L460,58" color={C.amber} mid={mid} animate dur={1.6} dots={2} />
              <FlowArrow d="M500,86 C480,130 420,150 400,160" color={C.red} mid={mid} label="함수 오류 3회 후" lx={430} ly={128} dash />
              <FlowArrow d="M545,86 L552,160" color={C.teal} mid={mid} label="성공 시" lx={585} ly={128} dash />
              <text x={360} y={245} textAnchor="middle" fill={C.inkSoft} fontSize={12}>
                함수 오류: 총 3회 시도 후 DLQ/Destination · 스로틀·서비스 오류: 최대 6시간 백오프 재시도
              </text>
            </FlowSvg>
          }
          narrow={
            <FlowSvg vb="0 0 360 486" mid={midV} minW={0}>
              <FlowBox x={95} y={16} w={170} h={56} label="S3 · SNS" sub="EventBridge 등" color={C.amber} />
              <FlowBox x={95} y={136} w={170} h={56} label="내부 이벤트 큐" sub="Lambda가 관리" color={C.amber} dashed />
              <FlowBox x={95} y={256} w={170} h={56} label="λ Lambda" color={C.ink} />
              <FlowBox x={10} y={376} w={165} h={56} label="실패 대상" sub="DLQ 또는 Destination" color={C.red} />
              <FlowBox x={185} y={376} w={165} h={56} label="성공 대상" sub="Destination (SQS·SNS·λ·EB)" color={C.teal} />
              <FlowArrow d="M150,72 L150,136" color={C.amber} mid={midV} label="이벤트 적재" lx={106} ly={108} animate dur={1.9} dots={3} />
              <FlowArrow d="M210,136 L210,72" color={C.inkSoft} mid={midV} label="202 즉시 반환" lx={268} ly={108} dash animate dur={0.6} />
              <FlowArrow d="M180,192 L180,256" color={C.amber} mid={midV} animate dur={1.6} dots={2} />
              <FlowArrow d="M140,312 C120,340 100,350 95,376" color={C.red} mid={midV} label="함수 오류 3회 후" lx={64} ly={352} dash />
              <FlowArrow d="M220,312 C240,340 260,350 265,376" color={C.teal} mid={midV} label="성공 시" lx={292} ly={352} dash />
              <text x={180} y={456} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
                함수 오류: 총 3회 시도 후 DLQ/Destination
              </text>
              <text x={180} y={474} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
                스로틀·서비스 오류: 최대 6시간 백오프 재시도
              </text>
            </FlowSvg>
          }
        />
      )}

      {mode === "poll" && (
        <FigSwitch
          wide={
            <FlowSvg vb="0 0 720 230" mid={mid}>
              <FlowBox x={20} y={60} w={160} h={64} label="SQS · Kinesis" sub="DynamoDB Streams" color={C.teal} />
              <FlowBox x={280} y={60} w={180} h={64} label="Event Source Mapping" sub="Lambda가 대신 폴링" color={C.teal} dashed />
              <FlowBox x={540} y={60} w={150} h={64} label="λ Lambda" sub="배치 단위 동기 호출" color={C.ink} />
              {/* ESM 이 폴링하고(단발), 레코드 여러 건이 묶음으로 흐르며(dots=4), 배치 1건이 동기 호출된다 — "배치 묶음"(#81) */}
              <FlowArrow d="M280,80 L180,80" color={C.teal} mid={mid} label="poll" lx={230} ly={70} animate dur={1.4} />
              <FlowArrow d="M180,105 L280,105" color={C.teal} mid={mid} label="배치(레코드 묶음)" lx={230} ly={125} animate dur={2.2} dots={4} />
              <FlowArrow d="M460,92 L540,92" color={C.amber} mid={mid} animate dur={1.6} />
              <text x={360} y={185} textAnchor="middle" fill={C.inkSoft} fontSize={12}>
                SQS: 성공한 메시지 삭제 · Kinesis/DDB Streams: 샤드 순서 보장, 성공 또는 만료까지 재시도(횟수·수명 제한 설정 가능)
              </text>
            </FlowSvg>
          }
          narrow={
            <FlowSvg vb="0 0 360 436" mid={midV} minW={0}>
              <FlowBox x={95} y={16} w={170} h={64} label="SQS · Kinesis" sub="DynamoDB Streams" color={C.teal} />
              <FlowBox x={85} y={160} w={190} h={64} label="Event Source Mapping" sub="Lambda가 대신 폴링" color={C.teal} dashed />
              <FlowBox x={95} y={288} w={170} h={64} label="λ Lambda" sub="배치 단위 동기 호출" color={C.ink} />
              <FlowArrow d="M150,160 L150,80" color={C.teal} mid={midV} label="poll" lx={128} ly={124} animate dur={1.4} />
              <FlowArrow d="M210,80 L210,160" color={C.teal} mid={midV} label="배치(레코드 묶음)" lx={278} ly={124} animate dur={2.2} dots={4} />
              <FlowArrow d="M180,224 L180,288" color={C.amber} mid={midV} animate dur={1.6} />
              <text x={180} y={384} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
                SQS: 성공한 메시지 삭제
              </text>
              <text x={180} y={402} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
                Kinesis/DDB Streams: 샤드 순서 보장,
              </text>
              <text x={180} y={420} textAnchor="middle" fill={C.inkSoft} fontSize={11}>
                성공 또는 만료까지 재시도(횟수·수명 제한 설정 가능)
              </text>
            </FlowSvg>
          }
        />
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
  const midV = "arr-canary-v";

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
      <FigSwitch
        wide={
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
        }
        narrow={
          <FlowSvg vb="0 0 360 260" mid={midV} minW={0}>
            <FlowBox x={95} y={16} w={170} h={60} label={'별칭 "prod"'} sub="트래픽 분배" color={C.amber} />
            <FlowBox x={10} y={184} w={165} h={60} label="버전 1 (기존)" sub={`${100 - weight}% 트래픽`} color={C.blue} />
            <FlowBox x={185} y={184} w={165} h={60} label="버전 2 (신규)" sub={`${weight}% 트래픽`} color={C.teal} />
            <FlowArrow d="M150,76 C120,110 95,150 92,184" color={C.blue} mid={midV} animate={weight < 100} dur={110 / (100 - weight)} />
            <FlowArrow d="M210,76 C240,110 265,150 268,184" color={C.teal} mid={midV} animate={weight > 0} dur={110 / weight} />
            <text x={70} y={130} textAnchor="middle" fill={C.blue} fontSize={13} fontFamily={MONO} fontWeight={700}>
              {100 - weight}%
            </text>
            <text x={290} y={130} textAnchor="middle" fill={C.teal} fontSize={13} fontFamily={MONO} fontWeight={700}>
              {weight}%
            </text>
          </FlowSvg>
        }
      />
      <p style={{ fontSize: "0.88rem", color: C.inkSoft, lineHeight: 1.65, margin: "10px 0 0" }}>
        prod 별칭 하나가 트래픽을 V1 <b style={{ color: C.blue }}>{100 - weight}%</b> / V2{" "}
        <b style={{ color: C.teal }}>{weight}%</b>로 나눕니다 — 신규 버전을 소량으로 검증한 뒤
        가중치를 올려 전환을 완료하는 <b>카나리 배포</b> 패턴입니다.
      </p>
    </SimFrame>
  );
}

/* ============ 개요 도식·수치 — aws-lambda-dva-guide-2.jsx TabOverview 이식 (#81) ============ */

/**
 * 전체 그림 — 이벤트 소스 → Lambda → 대상. 화살표 색이 호출 방식을 뜻한다:
 * 파랑=동기 · 앰버=비동기 · 청록=폴링(ESM). 이 3방식 구분이 챕터의 뼈대다.
 */
export function LambdaFlowOverviewSvg() {
  const mid = "arr-overview";
  const midV = "arr-overview-v";
  return (
    <FigSwitch
      wide={
        <FlowSvg vb="0 0 720 280" mid={mid}>
          {/* 이벤트 소스 (왼쪽) */}
          <FlowBox x={20} y={20} w={150} h={46} label="API Gateway" sub="HTTP · 동기" color={C.blue} />
          <FlowBox x={20} y={80} w={150} h={46} label="S3" sub="객체 업로드 · 비동기" color={C.amber} />
          <FlowBox x={20} y={140} w={150} h={46} label="SQS · Kinesis" sub="큐 · 스트림 · 폴링" color={C.teal} />
          <FlowBox x={20} y={200} w={150} h={46} label="EventBridge" sub="스케줄 · 비동기" color={C.amber} />
          {/* Lambda (가운데) */}
          <FlowBox x={300} y={92} w={150} h={92} label="λ Lambda" sub="함수 코드 실행" color={C.ink} />
          {/* 대상 (오른쪽 — 실행 역할로 접근) */}
          <FlowBox x={560} y={40} w={140} h={46} label="DynamoDB" sub="데이터 저장" color={C.teal} />
          <FlowBox x={560} y={116} w={140} h={46} label="SNS · SQS" sub="후속 처리" color={C.teal} />
          <FlowBox x={560} y={192} w={140} h={46} label="CloudWatch" sub="로그 · 지표" color={C.teal} />
          {/* 소스 → Lambda (색 = 호출 방식) */}
          <FlowArrow d="M170,43 C240,43 250,115 300,120" color={C.blue} mid={mid} animate />
          <FlowArrow d="M170,103 C230,103 240,128 300,132" color={C.amber} mid={mid} animate />
          <FlowArrow d="M170,163 C230,163 240,150 300,148" color={C.teal} mid={mid} animate dots={3} />
          <FlowArrow d="M170,223 C240,223 250,175 300,162" color={C.amber} mid={mid} />
          {/* Lambda → 대상 (실행 역할) */}
          <FlowArrow d="M450,120 C520,112 520,66 560,63" color={C.teal} mid={mid} />
          <FlowArrow d="M450,138 L560,139" color={C.teal} mid={mid} animate />
          <FlowArrow d="M450,158 C520,166 520,212 560,215" color={C.teal} mid={mid} />
        </FlowSvg>
      }
      narrow={
        <FlowSvg vb="0 0 360 470" mid={midV} minW={0}>
          {/* 이벤트 소스 (위, 2×2 — 색 = 호출 방식) */}
          <FlowBox x={15} y={20} w={160} h={46} label="API Gateway" sub="HTTP · 동기" color={C.blue} />
          <FlowBox x={185} y={20} w={160} h={46} label="S3" sub="객체 업로드 · 비동기" color={C.amber} />
          <FlowBox x={15} y={76} w={160} h={46} label="SQS · Kinesis" sub="큐 · 스트림 · 폴링" color={C.teal} />
          <FlowBox x={185} y={76} w={160} h={46} label="EventBridge" sub="스케줄 · 비동기" color={C.amber} />
          {/* Lambda (가운데) */}
          <FlowBox x={105} y={190} w={150} h={80} label="λ Lambda" sub="함수 코드 실행" color={C.ink} />
          {/* 대상 (아래 — 실행 역할로 접근) */}
          <FlowBox x={15} y={330} w={160} h={46} label="DynamoDB" sub="데이터 저장" color={C.teal} />
          <FlowBox x={185} y={330} w={160} h={46} label="SNS · SQS" sub="후속 처리" color={C.teal} />
          <FlowBox x={105} y={404} w={150} h={46} label="CloudWatch" sub="로그 · 지표" color={C.teal} />
          {/* 소스 → Lambda */}
          <FlowArrow d="M95,66 C95,130 130,165 150,190" color={C.blue} mid={midV} animate />
          <FlowArrow d="M265,66 C265,130 230,165 210,190" color={C.amber} mid={midV} animate />
          <FlowArrow d="M95,122 C95,160 125,178 145,190" color={C.teal} mid={midV} animate dots={3} />
          <FlowArrow d="M265,122 C265,160 235,178 215,190" color={C.amber} mid={midV} />
          {/* Lambda → 대상 */}
          <FlowArrow d="M150,270 C120,290 95,300 95,330" color={C.teal} mid={midV} />
          <FlowArrow d="M210,270 C240,290 265,300 265,330" color={C.teal} mid={midV} animate />
          <FlowArrow d="M180,270 L180,404" color={C.teal} mid={midV} />
        </FlowSvg>
      }
    />
  );
}

/** 핵심 수치 한눈에 보기 — 원본 TabOverview 카드 그리드 이식. 상세표는 20 한도 총정리에. */
export function KeyNumbersGrid() {
  const items: [string, string, string][] = [
    ["최대 실행 시간", "900초 (15분)", "기본값 3초"],
    ["메모리", "128MB ~ 10,240MB", "CPU는 메모리에 비례"],
    ["/tmp 스토리지", "512MB ~ 10GB", "임시 파일 공간"],
    ["환경 변수", "총 4KB", "전체 합산 크기"],
    ["배포 패키지", "50MB(zip) / 250MB(해제)", "컨테이너는 10GB"],
    ["동시성 기본값", "계정·리전당 1,000", "소프트 한도 · 상향 가능"],
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 10,
        margin: "1.25rem 0",
      }}
    >
      {items.map(([k, v, s]) => (
        <div
          key={k}
          style={{
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div style={{ color: C.inkSoft, fontSize: "0.72rem", fontFamily: MONO, marginBottom: 4 }}>
            {k}
          </div>
          <div style={{ color: C.amberText, fontSize: "0.95rem", fontWeight: 800 }}>{v}</div>
          <div style={{ color: C.inkSoft, fontSize: "0.72rem", marginTop: 2, opacity: 0.85 }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

/* ============ 실행 환경 라이프사이클 — TabLifecycle 도식 + study LifecycleSim 이식 (#81) ============ */

/**
 * 실행 환경 수명주기 — INIT → INVOKE → SHUTDOWN. 원본 guide-2 TabLifecycle 이식.
 * 웜 호출은 INIT/SHUTDOWN 없이 INVOKE만 반복(점선 루프). SHUTDOWN 단계는 인터랙티브
 * LifecycleSim(12)이 다루지 않는 부분이라 이 정적 도식으로 보완한다.
 */
export function ExecEnvLifecycleSvg() {
  const mid = "arr-life";
  const midV = "arr-life-v";
  return (
    <FigSwitch
      wide={
        <FlowSvg vb="0 0 720 200" mid={mid}>
          <FlowBox x={20} y={38} w={200} h={72} label="INIT (초기화)" sub="런타임 시작 + 핸들러 밖 코드" color={C.amber} />
          <FlowBox x={260} y={38} w={200} h={72} label="INVOKE (호출)" sub="handler() 실행" color={C.teal} />
          <FlowBox x={500} y={38} w={200} h={72} label="SHUTDOWN" sub="환경 종료" color={C.inkSoft} />
          <FlowArrow d="M220,74 L260,74" color={C.inkSoft} mid={mid} />
          <FlowArrow d="M460,74 L500,74" color={C.inkSoft} mid={mid} />
          {/* 웜 호출: INVOKE 만 반복 (아래로 도는 점선 루프) */}
          <FlowArrow d="M330,110 C330,150 390,150 390,112" color={C.teal} mid={mid} dash label="웜: INVOKE만 반복" lx={360} ly={172} />
          <text x={120} y={135} textAnchor="middle" fill={C.red} fontSize={11} fontFamily={MONO}>
            콜드 스타트 구간
          </text>
        </FlowSvg>
      }
      narrow={
        <FlowSvg vb="0 0 360 330" mid={midV} minW={0}>
          <FlowBox x={20} y={20} w={220} h={64} label="INIT (초기화)" sub="런타임 시작 + 핸들러 밖 코드" color={C.amber} />
          <FlowBox x={20} y={130} w={220} h={64} label="INVOKE (호출)" sub="handler() 실행" color={C.teal} />
          <FlowBox x={20} y={240} w={220} h={64} label="SHUTDOWN" sub="환경 종료" color={C.inkSoft} />
          <FlowArrow d="M130,84 L130,130" color={C.inkSoft} mid={midV} />
          <FlowArrow d="M130,194 L130,240" color={C.inkSoft} mid={midV} />
          {/* 웜 호출: INVOKE 만 반복 (오른쪽으로 도는 점선 루프) */}
          <FlowArrow d="M240,146 C300,150 300,178 242,176" color={C.teal} mid={midV} dash />
          <text x={300} y={206} textAnchor="middle" fill={C.teal} fontSize={11} fontFamily={MONO}>
            웜: INVOKE만
          </text>
          <text x={300} y={222} textAnchor="middle" fill={C.teal} fontSize={11} fontFamily={MONO}>
            반복
          </text>
          <text x={252} y={58} textAnchor="start" fill={C.red} fontSize={11} fontFamily={MONO}>
            콜드 스타트
          </text>
          <text x={252} y={74} textAnchor="start" fill={C.red} fontSize={11} fontFamily={MONO}>
            구간
          </text>
        </FlowSvg>
      }
    />
  );
}

/** 콜드 스타트는 4단계, 웜 호출은 1단계. 각 단계가 타이머로 순차 점등되는 원본 로직 유지. */
const LIFECYCLE_PHASES: Record<"cold" | "warm", { key: string; label: string; desc: string; color: string; dur: number }[]> = {
  cold: [
    { key: "download", label: "코드 다운로드", desc: "S3/ECR에서 배포 패키지를 가져옴", color: C.blue, dur: 900 },
    { key: "env", label: "실행 환경 생성", desc: "마이크로VM(Firecracker) 부팅 · 메모리·런타임 할당", color: C.blue, dur: 900 },
    { key: "init", label: "INIT (초기화)", desc: "핸들러 밖 코드 — import · DB 커넥션 · SDK 클라이언트", color: C.amber, dur: 1100 },
    { key: "invoke", label: "INVOKE (핸들러 실행)", desc: "handler(event, context) 실행", color: C.teal, dur: 900 },
  ],
  warm: [
    { key: "invoke", label: "INVOKE (핸들러 실행)", desc: "기존 환경 재사용 — INIT 생략 · /tmp·전역 변수 유지", color: C.teal, dur: 900 },
  ],
};

/**
 * 실행 환경 라이프사이클 시뮬레이터 — 원본 lambda-dva-study.jsx LifecycleSim 이식(#81).
 * 콜드/웜 버튼으로 단계가 setTimeout 으로 순차 점등된다. 원본 타이머 로직 유지, ui 팔레트 적용.
 */
export function LifecycleSim() {
  const [mode, setMode] = useState<"cold" | "warm" | null>(null);
  const [step, setStep] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = (m: "cold" | "warm") => {
    if (timer.current) clearTimeout(timer.current);
    setMode(m);
    setStep(0);
  };

  useEffect(() => {
    if (mode === null || step < 0) return;
    const phases = LIFECYCLE_PHASES[mode];
    if (step >= phases.length) return;
    timer.current = setTimeout(() => setStep((s) => s + 1), phases[step].dur);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [mode, step]);

  const phases = mode === null ? [] : LIFECYCLE_PHASES[mode];
  const done = mode !== null && step >= phases.length;

  return (
    <SimFrame title="실행 환경 라이프사이클 — 콜드 vs 웜을 실행해 보세요">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.ink }}>호출 실행 →</span>
        <button
          type="button"
          onClick={() => run("cold")}
          aria-pressed={mode === "cold"}
          style={{ cursor: "pointer", background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: "0.82rem", fontWeight: 600 }}
        >
          ❄️ 콜드 스타트 호출
        </button>
        {/* 배경은 amber 가 아니라 amberText — 흰 글자 기준 2.73:1 이라 AA 미달이었다(#149).
            옆의 콜드 스타트 버튼(C.blue, 6.78:1)과 무게도 이제 맞는다. */}
        <button
          type="button"
          onClick={() => run("warm")}
          aria-pressed={mode === "warm"}
          style={{ cursor: "pointer", background: C.amberText, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: "0.82rem", fontWeight: 600 }}
        >
          🔥 웜 호출
        </button>
      </div>

      {mode === null && (
        <p style={{ color: C.inkSoft, fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
          버튼을 눌러 두 경로를 비교해 보세요 — 콜드 스타트는 <b>4단계</b>, 웜 호출은 단 <b>1단계</b>입니다.
        </p>
      )}

      {mode !== null && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phases.map((ph, i) => {
            const state = i < step ? "done" : i === step ? "active" : "wait";
            return (
              <div
                key={ph.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 9,
                  border: `1.5px solid ${state === "wait" ? C.line : ph.color}`,
                  background: state === "active" ? ph.color : state === "done" ? C.card : "#FAFBFC",
                  opacity: state === "wait" ? 0.5 : 1,
                  transition: "all .35s",
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: state === "active" ? "#fff" : ph.color,
                    minWidth: 20,
                  }}
                >
                  {state === "done" ? "✓" : `${i + 1}`}
                </span>
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, color: state === "active" ? "#fff" : C.ink }}>
                    {ph.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: state === "active" ? "rgba(255,255,255,.88)" : C.inkSoft }}>
                    {ph.desc}
                  </div>
                </div>
              </div>
            );
          })}
          {done && (
            <div
              style={{
                background: mode === "cold" ? C.amberSoft : C.tealSoft,
                borderRadius: 9,
                padding: "10px 14px",
                fontSize: "0.85rem",
                lineHeight: 1.6,
                color: C.ink,
              }}
            >
              {mode === "cold" ? (
                <>
                  콜드 스타트 완료 — 수백 ms에서 수 초까지 지연될 수 있습니다. 이 지연을 없애는 것이{" "}
                  <b>Provisioned Concurrency</b>(미리 INIT까지 끝낸 환경을 대기)입니다.
                </>
              ) : (
                <>
                  웜 호출 완료 — 환경이 재사용되므로{" "}
                  <b>핸들러 밖에서 초기화한 것(DB 커넥션·SDK 클라이언트·/tmp 캐시)</b>이 그대로 살아
                  있습니다. 무거운 초기화는 항상 핸들러 밖에 두는 것이 베스트 프랙티스입니다.
                </>
              )}
            </div>
          )}
        </div>
      )}
    </SimFrame>
  );
}
