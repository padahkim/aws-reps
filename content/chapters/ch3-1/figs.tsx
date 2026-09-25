"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { C, MONO } from "../ui";
import { chipBtn, SimFrame } from "../interactive";

/**
 * 이 챕터 고유의 도식 SVG·인터랙티브 (규약 v3) — sections/*.mdx 가 import 한다.
 * 범용 프리미티브·상수는 여기 두지 않는다 (schema.ts "공용 승격 규약", #156).
 * StepFlow 가 useState 를 쓰므로 파일 전체를 "use client" 로 둔다 (body.tsx 클라이언트 경계
 * 안이라 무해 — ch0-1·ch0-2·ch1-2 figs 전례).
 *
 * StepFlow 는 레거시 원본의 StepPlayer(content/aws-cognito-guide.jsx L125)를 옮긴 것이다.
 * ui.tsx·interactive.tsx 로 승격하지 않고 챕터 로컬에 둔 이유: 지금 이걸 쓰는 챕터가 하나뿐이라
 * 규약의 rule of three("두 번째 챕터가 같은 것을 요구할 때 승격")에 아직 못 미친다.
 * 절차형 도식은 다른 챕터에도 있을 법하니, 두 번째 요구가 오면 그때 interactive.tsx 로 올린다.
 */

/* ── 단계 재생 프레임 ────────────────────────────────────────────────── */

/**
 * 단계별 도식 재생기 — render(step) 이 그 단계까지 켜진 SVG 를 그린다.
 * 원본은 이전/다음 버튼만 있었는데 단계 칩을 더했다: 4~5단계짜리 흐름에서 "③ 만 다시"가
 * 잦은데 버튼만으로는 되감아야 했다. 칩이 현재 위치 표시도 겸한다.
 */
function StepFlow({
  label,
  steps,
  render,
}: {
  label: string;
  steps: string[];
  render: (step: number) => ReactNode;
}) {
  const [step, setStep] = useState(0);
  const last = steps.length - 1;
  return (
    <SimFrame title={`${label} — 단계를 눌러 흐름을 따라가 보세요`} icon="⚡">
      {render(step)}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}단계`}
            aria-pressed={i === step}
            className="widget-btn"
            onClick={() => setStep(i)}
            style={{ ...chipBtn(i === step, C.amber, C.amberSoft), fontFamily: MONO, fontSize: "0.78rem", padding: "6px 12px", borderRadius: 8 }}
          >
            {i + 1}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="widget-btn"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{ ...chipBtn(false, C.blue, C.blueSoft), fontSize: "0.78rem", padding: "6px 12px", borderRadius: 8, opacity: step === 0 ? 0.35 : 1 }}
        >
          ← 이전
        </button>
        <button
          type="button"
          className="widget-btn"
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={step === last}
          style={{ ...chipBtn(true, C.amber, C.amberSoft), fontSize: "0.78rem", padding: "6px 12px", borderRadius: 8, opacity: step === last ? 0.35 : 1 }}
        >
          다음 →
        </button>
      </div>
      <p style={{ fontSize: "0.86rem", color: C.ink, lineHeight: 1.65, margin: "12px 0 0", display: "flex", gap: 8 }}>
        <b style={{ color: C.amberText, flexShrink: 0 }}>{step + 1} / {steps.length}</b>
        <span>{steps[step]}</span>
      </p>
    </SimFrame>
  );
}

/* ── SVG 공용 조각 (이 챕터 안에서만) ──────────────────────────────────── */

/**
 * 꺼짐 상태의 톤 — 테마 토큰에서 섞어 만든다 (#288). 라이트에서는 원래의 옅은 회색과 거의 같고,
 * 다크에서는 어둡게 가라앉아 꺼진 상자가 켜진 상자보다 밝아지지 않는다 (ch0-1 #284 전례).
 */
const OFF_FILL = "color-mix(in srgb, var(--border) 20%, transparent)";
const OFF_TEXT = "color-mix(in srgb, var(--muted) 60%, var(--card-bg))";
const OFF_LINE_TEXT = "color-mix(in srgb, var(--muted) 40%, var(--card-bg))";

/** 켜짐/꺼짐 두 상태를 가진 도식이라, 상자·글자·화살표가 전부 active 를 받는다. */
const box = (on: boolean, fill: string, stroke: string) => ({
  fill: on ? fill : OFF_FILL,
  stroke: on ? stroke : C.line,
  strokeWidth: on ? 2 : 1.2,
});
const label = (on: boolean, color: string, size = 12) => ({
  fill: on ? color : OFF_TEXT,
  fontWeight: on ? 700 : 500,
  fontSize: size,
});
const line = (on: boolean, color: string = C.blue) => ({
  stroke: on ? color : C.line,
  strokeWidth: on ? 2.4 : 1.4,
  fill: "none",
  markerEnd: on ? `url(#${headId(color)})` : "url(#ah-off)",
});
const lineText = (on: boolean, color: string = C.blue) => ({
  fill: on ? color : OFF_LINE_TEXT,
  fontSize: 10.5,
  fontWeight: on ? 700 : 500,
});

/**
 * 화살촉 색 — marker id 는 색 값이 아니라 이 고정 키로 만든다. C 의 값이 `var(--x, #hex)` 라
 * 색 문자열에서 id 를 파생하면 url(#…) 참조가 깨져 화살촉이 사라진다 (#288).
 */
const HEAD_COLORS = { blue: C.blue, teal: C.teal, amber: C.amber, red: C.red };
const headId = (color: string) =>
  `ah-${Object.entries(HEAD_COLORS).find(([, c]) => c === color)?.[0] ?? "off"}`;

/** 화살촉 정의 — 색마다 하나씩. id 가 DOM 전역이라 색 키를 접미사로 붙여 충돌을 피한다. */
function Heads() {
  return (
    <defs>
      {Object.entries(HEAD_COLORS).map(([key, col]) => (
        <marker key={key} id={`ah-${key}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={col} />
        </marker>
      ))}
      <marker id="ah-off" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" fill={C.line} />
      </marker>
    </defs>
  );
}

/**
 * 도식 프레임 — 좁은 화면에서 가로 스크롤을 허용한다 (ch1-2 FlowSvg 와 같은 처방, #101).
 * 700 폭 도식을 390px 폰에 통째로 우겨넣으면 글자가 6px 대로 줄어 못 읽는다. minWidth 를
 * 두면 축소 대신 스크롤이 되어 글자 크기가 유지된다.
 */
function SvgFrame({ vb, aria, children }: { vb: string; aria: string; children: ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={vb} role="img" aria-label={aria} style={{ display: "block", width: "100%", minWidth: 580, height: "auto" }}>
        <Heads />
        {children}
      </svg>
    </div>
  );
}

/* ── §01 두 개의 풀 ───────────────────────────────────────────────────── */

export function TwoPoolsSvg() {
  return (
    <SvgFrame vb="0 0 700 300" aria="Cognito의 두 축 — User Pool은 인증, Identity Pool은 인가">
      <circle cx="72" cy="150" r="26" fill={C.blueSoft} stroke={C.blue} strokeWidth="2" />
      <text x="72" y="156" textAnchor="middle" fontSize="18">👤</text>
      <text x="72" y="196" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>웹·모바일 사용자</text>
      <text x="72" y="211" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>앱 사용자 수백만 명</text>

      <rect x="230" y="58" width="200" height="84" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="2" />
      <text x="330" y="86" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.amberText}>User Pool (CUP)</text>
      <text x="330" y="106" textAnchor="middle" fontSize="10.5" fill={C.ink}>“너 누구야?” — 인증</text>
      <text x="330" y="124" textAnchor="middle" fontSize="10.5" fill={C.ink}>로그인 성공 → JWT 발급</text>

      <rect x="230" y="172" width="200" height="84" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="2" />
      <text x="330" y="200" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.teal}>Identity Pool (CIP)</text>
      <text x="330" y="220" textAnchor="middle" fontSize="10.5" fill={C.ink}>“뭘 할 수 있어?” — 인가</text>
      <text x="330" y="238" textAnchor="middle" fontSize="10.5" fill={C.ink}>임시 AWS 자격 증명 (STS)</text>

      <rect x="508" y="58" width="160" height="84" rx="10" fill={OFF_FILL} stroke={C.line} />
      <text x="588" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>API Gateway · ALB</text>
      <text x="588" y="112" textAnchor="middle" fontSize="10" fill={C.inkSoft}>내 백엔드 API 보호</text>

      <rect x="508" y="172" width="160" height="84" rx="10" fill={OFF_FILL} stroke={C.line} />
      <text x="588" y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>S3 · DynamoDB</text>
      <text x="588" y="226" textAnchor="middle" fontSize="10" fill={C.inkSoft}>AWS 리소스 직접 접근</text>

      <path d="M102,132 C158,106 190,98 226,98" style={line(true, C.amber)} />
      <text x="132" y="94" style={lineText(true, C.amber)}>로그인</text>
      <path d="M102,168 C158,192 190,208 226,212" style={line(true, C.teal)} />
      <text x="118" y="212" style={lineText(true, C.teal)}>자격 증명 요청</text>
      <path d="M434,100 L504,100" style={line(true, C.amber)} />
      <text x="440" y="90" style={lineText(true, C.amber)}>인증 연동</text>
      <path d="M434,214 L504,214" style={line(true, C.teal)} />
      <text x="440" y="204" style={lineText(true, C.teal)}>임시 키로 호출</text>
    </SvgFrame>
  );
}

/* ── §04 CUP 로그인 흐름 ──────────────────────────────────────────────── */

function cupFlowSvg(step: number) {
  const s = (n: number) => step >= n;
  // 토큰은 User Pool → 사용자(앱)로 돌아오고(③), 앱이 API Gateway 에 제시한다(④) — 본문 §04 의
  // "User Pool은 사용자에게 토큰을 준다 — 백엔드는 이 대화에 끼지 않는다"를 그대로 그린다 (#290).
  // ④ 는 User Pool 상자 위로 돌아 가서, User Pool 이 API Gateway 로 토큰을 넘기는 것처럼 읽히지 않게 한다.
  return (
    <SvgFrame vb="0 0 700 300" aria="User Pool 로그인 흐름 — 앱이 로그인을 요청하고, User Pool이 검증한 뒤 토큰을 사용자에게 돌려주며, 앱이 그 토큰을 API Gateway에 제시한다. 연합 로그인도 User Pool이 처리한다">
      <circle cx="70" cy="150" r="26" style={box(true, C.blueSoft, C.blue)} />
      <text x="70" y="156" textAnchor="middle" fontSize="18">👤</text>
      <text x="70" y="196" textAnchor="middle" style={label(true, C.ink)}>사용자 (앱)</text>

      <rect x="230" y="90" width="200" height="104" rx="10" style={box(s(0), C.amberSoft, C.amber)} />
      <text x="330" y="116" textAnchor="middle" style={label(s(0), C.amberText, 13)}>Cognito User Pool</text>
      <text x="330" y="136" textAnchor="middle" style={label(s(0), C.ink)}>서버리스 사용자 DB</text>
      <text x="330" y="158" textAnchor="middle" style={label(s(1), C.ink)}>② ID·비밀번호 검증 · MFA</text>
      <text x="330" y="180" textAnchor="middle" style={label(s(2), C.ink)}>인증 성공 → 토큰 발급</text>

      <rect x="230" y="228" width="200" height="56" rx="10" style={box(s(4), C.blueSoft, C.blue)} />
      <text x="330" y="251" textAnchor="middle" style={label(s(4), C.blue)}>연합 로그인 (Federation)</text>
      <text x="330" y="270" textAnchor="middle" style={label(s(4), C.ink, 11)}>Google · Facebook · SAML · OIDC</text>

      <rect x="520" y="100" width="160" height="84" rx="10" style={box(s(3), C.tealSoft, C.teal)} />
      <text x="600" y="128" textAnchor="middle" style={label(s(3), C.teal, 13)}>API Gateway</text>
      <text x="600" y="148" textAnchor="middle" style={label(s(3), C.ink)}>토큰 검증 (§07)</text>
      <text x="600" y="168" textAnchor="middle" style={label(s(3), C.ink)}>통과하면 백엔드 호출</text>

      <path d="M98,138 L225,130" style={line(s(0), C.amber)} />
      <text x="106" y="120" style={lineText(s(0), C.amber)}>① 로그인 요청</text>
      <path d="M226,166 L100,164" style={line(s(2), C.teal)} />
      <text x="112" y="184" style={lineText(s(2), C.teal)}>③ 토큰 3종</text>
      <path d="M70,122 L70,44 L600,44 L600,95" style={line(s(3), C.teal)} />
      <text x="190" y="34" style={lineText(s(3), C.teal)}>④ 토큰을 Authorization 헤더에 실어 제시</text>
      <path d="M330,224 L330,199" style={line(s(4), C.blue)} />
      <text x="342" y="216" style={lineText(s(4), C.blue)}>소셜·기업 계정도 같은 자리</text>
    </SvgFrame>
  );
}

export function CupLoginFlow() {
  return (
    <StepFlow
      label="CUP 로그인 흐름"
      steps={[
        "사용자가 앱에 ID·비밀번호를 입력하면, 앱이 자기 앱 클라이언트 ID를 붙여 User Pool에 로그인을 요청한다. 요청 방식(인증 흐름)은 앱 클라이언트가 허용한 것만 쓸 수 있다 — 아래 표.",
        "User Pool이 자격 증명을 검증한다 — 설정에 따라 MFA 챌린지가 여기서 붙고, 챌린지까지 통과해야 다음 단계로 간다.",
        "인증 성공 → User Pool이 토큰 세 개(ID·Access·Refresh)를 사용자(앱)에게 돌려준다. ID·Access는 JWT이고, Refresh는 앱이 열어 볼 수 없는 암호화된 문자열이다. Hosted UI(OAuth) 경로는 Grant·scope에 따라 구성이 달라진다 → §08.",
        "앱이 받은 토큰을 Authorization 헤더에 실어 API Gateway에 제시한다. API Gateway가 토큰을 검증하고 통과한 요청만 백엔드로 넘긴다 (§07). ALB는 토큰을 받는 게 아니라 로그인 자체를 대신한다 — §13.",
        "직접 가입 대신 Google·Facebook·SAML 같은 연합 로그인을 써도 처리하고 토큰을 내주는 쪽은 똑같이 User Pool이다. 연합 로그인은 SDK 로그인 API가 아니라 Hosted UI(OAuth) 경로로 들어온다 (§08).",
      ]}
      render={cupFlowSvg}
    />
  );
}

/* ── §06 JWT 구조 ─────────────────────────────────────────────────────── */

export function JwtPartsSvg() {
  const parts: [string, string, string, string][] = [
    ["Header", "서명 알고리즘 · 키 ID", C.blueSoft, C.blue],
    ["Payload", "사용자 정보 (클레임)", C.tealSoft, C.teal],
    ["Signature", "위·변조 검증용 서명", C.amberSoft, C.amber],
  ];
  return (
    <SvgFrame vb="0 0 700 210" aria="JWT는 Header, Payload, Signature 세 조각이 점으로 이어진 구조">
      {parts.map(([t, d, bg, col], i) => (
        <g key={t}>
          <rect x={24 + i * 224} y={28} width={204} height={74} rx={10} fill={bg} stroke={col} strokeWidth="2" />
          <text x={126 + i * 224} y={58} textAnchor="middle" fontSize="14" fontWeight="800" fill={col === C.amber ? C.amberText : col}>{t}</text>
          <text x={126 + i * 224} y={80} textAnchor="middle" fontSize="10.5" fill={C.ink}>{d}</text>
          {i < 2 && <text x={236 + i * 224} y={72} textAnchor="middle" fontSize="20" fontWeight="800" fill={C.inkSoft}>.</text>}
        </g>
      ))}
      <text x="350" y="130" textAnchor="middle" fontSize="11" fill={C.inkSoft}>세 조각을 점(.)으로 이어 붙인 한 줄 문자열</text>
      <rect x="24" y="146" width="652" height="46" rx="8" fill={C.codeBg} />
      <text x="40" y="176" fontSize="12" fontFamily={MONO} fill={C.codeFg}>eyJraWQiOiJ…  .  eyJzdWIiOiI5ZjMx…  .  NkZ1bWJlcl9zaWc…</text>
    </SvgFrame>
  );
}

/* ── §09 Lambda 트리거 시점 ───────────────────────────────────────────── */

export function TriggerTimelineSvg() {
  // 시점마다 실제로 존재하는 트리거만 적는다 — Post Sign-up·Pre Confirmation·Post Token Generation 은 없다.
  // 앞뒤가 둘 다 있는 시점은 로그인(Pre/Post Authentication)뿐이다.
  const stages: [string, string][] = [
    ["가입 (Sign-up)", "⚡ Pre Sign-up"],
    ["확인 (Confirm)", "⚡ Post Confirmation"],
    ["로그인 (Auth)", "⚡ Pre / Post Authentication"],
    ["토큰 발급 (Token)", "⚡ Pre Token Generation"],
  ];
  return (
    <SvgFrame vb="0 0 700 140" aria="가입에는 Pre Sign-up, 확인에는 Post Confirmation, 로그인에는 Pre와 Post Authentication, 토큰 발급에는 Pre Token Generation 트리거가 붙는다">
      {stages.map(([t, trig], i) => (
        <g key={t}>
          <rect x={22 + i * 172} y={34} width={140} height={46} rx={8} fill={C.amberSoft} stroke={C.amber} strokeWidth="1.5" />
          <text x={92 + i * 172} y={62} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.amberText}>{t}</text>
          <text x={92 + i * 172} y={106} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.blue}>{trig}</text>
          {i < 3 && <path d={`M${164 + i * 172},57 L${192 + i * 172},57`} style={line(true, C.amber)} />}
        </g>
      ))}
    </SvgFrame>
  );
}

/* ── §10 적응형 인증 위험도 ───────────────────────────────────────────── */

export function RiskScoreSvg() {
  const rows: [string, string, string, string][] = [
    ["낮음 (Low)", "그대로 통과", C.tealSoft, C.teal],
    ["중간 (Medium)", "MFA 추가 요구", C.amberSoft, C.amber],
    ["높음 (High)", "MFA 요구 또는 차단", C.redSoft, C.red],
  ];
  return (
    <SvgFrame vb="0 0 700 120" aria="위험 수준 낮음, 중간, 높음에 통과, MFA 요구, 차단을 배정한 설정 예">
      {rows.map(([t, d, bg, col], i) => (
        <g key={t}>
          <rect x={22 + i * 224} y={24} width={204} height={68} rx={10} fill={bg} stroke={col} strokeWidth="2" />
          <text x={124 + i * 224} y={54} textAnchor="middle" fontSize="13" fontWeight="800" fill={col === C.amber ? C.amberText : col}>{t}</text>
          <text x={124 + i * 224} y={76} textAnchor="middle" fontSize="11" fill={C.ink}>{d}</text>
        </g>
      ))}
    </SvgFrame>
  );
}

/* ── §11 CIP 자격 증명 발급 흐름 ──────────────────────────────────────── */

function cipFlowSvg(step: number) {
  const s = (n: number) => step >= n;
  return (
    <SvgFrame vb="0 0 700 330" aria="Identity Pool이 IdP 공급자 증명을 검증해 STS 임시 자격 증명으로 교환하는 흐름">
      <circle cx="62" cy="150" r="26" style={box(true, C.blueSoft, C.blue)} />
      <text x="62" y="156" textAnchor="middle" fontSize="18">👤</text>
      <text x="62" y="196" textAnchor="middle" style={label(true, C.ink)}>사용자</text>

      <rect x="150" y="28" width="184" height="66" rx="10" style={box(s(0), C.blueSoft, C.blue)} />
      <text x="242" y="54" textAnchor="middle" style={label(s(0), C.blue)}>로그인 IdP</text>
      <text x="242" y="74" textAnchor="middle" style={label(s(0), C.ink, 11)}>User Pool · Google · SAML · OIDC</text>

      <rect x="248" y="128" width="196" height="84" rx="10" style={box(s(1), C.tealSoft, C.teal)} />
      <text x="346" y="156" textAnchor="middle" style={label(s(1), C.teal, 13)}>Identity Pool</text>
      <text x="346" y="176" textAnchor="middle" style={label(s(1), C.ink)}>증명 유효성 검증</text>
      <text x="346" y="196" textAnchor="middle" style={label(s(2), C.ink)}>→ STS 로 교환 요청</text>

      <rect x="500" y="128" width="172" height="84" rx="10" style={box(s(2), C.amberSoft, C.amber)} />
      <text x="586" y="156" textAnchor="middle" style={label(s(2), C.amberText, 13)}>STS</text>
      <text x="586" y="176" textAnchor="middle" style={label(s(2), C.ink)}>임시 AWS 자격 증명</text>
      <text x="586" y="196" textAnchor="middle" style={label(s(2), C.ink, 11)}>IAM 역할을 맡아 발급</text>

      <rect x="376" y="252" width="296" height="62" rx="10" style={box(s(3), C.blueSoft, C.blue)} />
      <text x="524" y="278" textAnchor="middle" style={label(s(3), C.blue)}>S3 · DynamoDB 직접 접근</text>
      <text x="524" y="298" textAnchor="middle" style={label(s(3), C.ink, 11)}>IAM 정책 + 정책 변수로 범위 제한</text>

      <rect x="52" y="252" width="248" height="62" rx="10" style={box(s(4), C.redSoft, C.red)} />
      <text x="176" y="278" textAnchor="middle" style={label(s(4), C.red)}>게스트(미인증)도 가능</text>
      <text x="176" y="298" textAnchor="middle" style={label(s(4), C.ink, 11)}>게스트 전용 IAM 역할</text>

      <path d="M84,130 L146,80" style={line(s(0), C.blue)} />
      <text x="56" y="102" style={lineText(s(0), C.blue)}>① 로그인</text>
      <path d="M272,98 L322,124" style={line(s(1), C.teal)} />
      <text x="286" y="116" style={lineText(s(1), C.teal)}>② 증명 전달</text>
      <path d="M448,168 L495,168" style={line(s(2), C.amber)} />
      <text x="446" y="156" style={lineText(s(2), C.amber)}>③ 교환</text>
      <path d="M562,216 L536,248" style={line(s(3), C.blue)} />
      <text x="574" y="238" style={lineText(s(3), C.blue)}>④ 직접 접근</text>
    </SvgFrame>
  );
}

export function CipCredentialFlow() {
  return (
    <StepFlow
      label="CIP 자격 증명 발급 흐름"
      steps={[
        "사용자가 IdP(User Pool, Google, SAML 등)에 로그인해 공급자 증명(ID 토큰·assertion 등)을 받는다.",
        "그 증명을 Identity Pool에 넘긴다 — Identity Pool은 증명이 진짜인지부터 검증한다.",
        "검증이 끝나면 Identity Pool이 STS를 호출해 IAM 역할 기반 임시 자격 증명으로 바꾼다.",
        "사용자는 그 임시 자격 증명으로 S3·DynamoDB 같은 AWS 리소스를 직접 호출한다.",
        "로그인하지 않은 게스트에게도 별도 역할을 지정해 제한된 접근을 열어 줄 수 있다.",
      ]}
      render={cipFlowSvg}
    />
  );
}

/* ── §13 ALB 인증 흐름 ────────────────────────────────────────────────── */

function albFlowSvg(step: number) {
  const s = (n: number) => step >= n;
  // 공식 인증 흐름(ELB 가이드 "Authentication flow")을 여섯 단계로 묶었다 (#291) — ③ 의 code 는
  // 브라우저를 거쳐 ALB 콜백에 닿고, ④ 코드 교환과 ⑤ UserInfo 조회는 ALB 가 직접 나가는
  // 서버 쪽 호출이다. 본문의 IPv4 아웃바운드 WarnBox 가 바로 이 두 화살표를 전제로 한다.
  // ⑥ 은 쿠키를 들려 원래 주소로 되돌린 뒤의 전달이라, 사용자 쪽 리다이렉트는 캡션에만 적는다.
  return (
    <SvgFrame vb="0 0 700 350" aria="ALB가 미인증 사용자를 User Pool 로그인 페이지로 보내고, 돌아온 인가 코드를 Token 엔드포인트에서 교환하고 UserInfo 엔드포인트에서 클레임을 조회한 뒤, 서명한 x-amzn-oidc-data 헤더에 클레임을 실어 백엔드로 전달한다">
      <circle cx="60" cy="106" r="26" style={box(true, C.blueSoft, C.blue)} />
      <text x="60" y="112" textAnchor="middle" fontSize="18">👤</text>
      <text x="60" y="152" textAnchor="middle" style={label(true, C.ink)}>사용자 (브라우저)</text>

      <rect x="226" y="52" width="214" height="110" rx="10" style={box(s(0), C.amberSoft, C.amber)} />
      <text x="333" y="78" textAnchor="middle" style={label(s(0), C.amberText, 13)}>ALB</text>
      <text x="333" y="98" textAnchor="middle" style={label(s(0), C.ink)}>HTTPS 리스너 (필수)</text>
      <text x="333" y="120" textAnchor="middle" style={label(s(0), C.ink)}>authenticate-cognito 규칙</text>
      <text x="333" y="142" textAnchor="middle" style={label(s(0), C.ink)}>세션 쿠키 확인 · 발급</text>

      <rect x="510" y="52" width="180" height="110" rx="10" style={box(s(5), C.tealSoft, C.teal)} />
      <text x="600" y="78" textAnchor="middle" style={label(s(5), C.teal, 13)}>백엔드 (타깃 그룹)</text>
      <text x="600" y="100" textAnchor="middle" fontFamily={MONO} style={label(s(5), C.ink, 11)}>x-amzn-oidc-data</text>
      <text x="600" y="122" textAnchor="middle" style={label(s(5), C.ink, 11)}>로그인 코드 없음</text>
      <text x="600" y="142" textAnchor="middle" style={label(s(5), C.ink, 11)}>인가 전 서명 · signer 검증</text>

      <rect x="24" y="222" width="436" height="116" rx="10" style={box(s(1), C.blueSoft, C.blue)} />
      <rect x="40" y="234" width="150" height="64" rx="8" style={box(s(1), C.card, C.blue)} />
      <text x="115" y="260" textAnchor="middle" style={label(s(1), C.blue)}>로그인 페이지</text>
      <text x="115" y="280" textAnchor="middle" style={label(s(1), C.ink, 11)}>(Hosted UI)</text>
      <rect x="222" y="234" width="104" height="64" rx="8" style={box(s(3), C.card, C.blue)} />
      <text x="274" y="260" textAnchor="middle" style={label(s(3), C.blue)}>Token</text>
      <text x="274" y="280" textAnchor="middle" style={label(s(3), C.ink, 11)}>엔드포인트</text>
      <rect x="340" y="234" width="104" height="64" rx="8" style={box(s(4), C.card, C.blue)} />
      <text x="392" y="260" textAnchor="middle" style={label(s(4), C.blue)}>UserInfo</text>
      <text x="392" y="280" textAnchor="middle" style={label(s(4), C.ink, 11)}>엔드포인트</text>
      <text x="242" y="322" textAnchor="middle" style={label(s(1), C.blue, 13)}>Cognito User Pool</text>

      <path d="M88,106 L221,106" style={line(s(0), C.amber)} />
      <text x="98" y="94" style={lineText(s(0), C.amber)}>① HTTPS 요청</text>
      <path d="M60,160 L60,229" style={line(s(1), C.blue)} />
      <text x="68" y="196" style={lineText(s(1), C.blue)}>② 로그인 페이지로</text>
      <path d="M176,234 L250,167" style={line(s(2), C.blue)} />
      <text x="170" y="214" textAnchor="end" style={lineText(s(2), C.blue)}>③ code → ALB</text>
      <path d="M268,167 L268,229" style={line(s(3), C.amber)} />
      <path d="M284,229 L284,167" style={line(s(3), C.amber)} />
      <text x="292" y="202" style={lineText(s(3), C.amber)}>④ code ↔ 토큰</text>
      <path d="M386,167 L386,229" style={line(s(4), C.amber)} />
      <path d="M402,229 L402,167" style={line(s(4), C.amber)} />
      <text x="410" y="202" style={lineText(s(4), C.amber)}>⑤ 클레임 조회</text>
      <path d="M444,106 L505,106" style={line(s(5), C.teal)} />
      <text x="450" y="94" style={lineText(s(5), C.teal)}>⑥ 전달</text>
    </SvgFrame>
  );
}

export function AlbAuthFlow() {
  return (
    <StepFlow
      label="ALB 인증 흐름 (Cognito 방식)"
      steps={[
        "사용자가 ALB의 HTTPS 리스너로 요청을 보낸다. authenticate-cognito 규칙이 걸린 요청이면 ALB가 먼저 세션 쿠키가 있는지 본다. (HTTP 리스너에는 인증 규칙을 걸 수 없다)",
        "쿠키가 없으면(미인증) ALB가 사용자를 User Pool의 로그인 페이지(Hosted UI, §08)로 리다이렉트하고, 사용자는 거기서 로그인한다.",
        "로그인이 끝나면 User Pool이 인가 코드(code)를 붙여 사용자를 ALB의 콜백 주소 /oauth2/idpresponse로 돌려보낸다 — 코드는 브라우저를 거쳐 ALB에 닿는다.",
        "ALB가 그 코드를 User Pool의 Token 엔드포인트에 제시해 토큰(ID·Access)으로 교환한다. §08에서 앱이 하던 교환을 ALB가 서버 쪽에서 대신하는 것이다.",
        "ALB가 받은 Access 토큰으로 UserInfo 엔드포인트를 불러 사용자 클레임(sub·email 등)을 얻는다.",
        "ALB가 세션 쿠키를 발급해 사용자를 원래 주소로 돌려보내고, 그 요청을 타깃으로 넘기면서 클레임을 ALB가 서명한 x-amzn-oidc-data 헤더에 실어 준다. 백엔드에는 로그인 플로우 코드가 없다 — 다만 이 클레임으로 인가하려면 서명과 signer 확인은 백엔드 몫이다. 이후 요청은 쿠키가 유효한 동안 이 단계로 바로 온다.",
      ]}
      render={albFlowSvg}
    />
  );
}

/* ── §14 CUP + CIP 조합 ───────────────────────────────────────────────── */

export function CombinedArchSvg() {
  return (
    <SvgFrame vb="0 0 700 230" aria="CUP으로 로그인해 ID 토큰을 받고, CIP가 그것을 임시 AWS 자격 증명으로 바꿔 AWS 리소스에 접근한다">
      <circle cx="52" cy="112" r="24" fill={C.blueSoft} stroke={C.blue} strokeWidth="2" />
      <text x="52" y="118" textAnchor="middle" fontSize="16">👤</text>

      <rect x="134" y="72" width="166" height="82" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="2" />
      <text x="217" y="100" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.amberText}>① CUP 로그인</text>
      <text x="217" y="120" textAnchor="middle" fontSize="10.5" fill={C.ink}>인증 → ID 토큰</text>
      <text x="217" y="138" textAnchor="middle" fontSize="10.5" fill={C.ink}>(소셜·SAML 연합 포함)</text>

      <rect x="356" y="72" width="166" height="82" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="2" />
      <text x="439" y="100" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.teal}>② CIP 교환</text>
      <text x="439" y="120" textAnchor="middle" fontSize="10.5" fill={C.ink}>ID 토큰 → 임시 AWS</text>
      <text x="439" y="138" textAnchor="middle" fontSize="10.5" fill={C.ink}>자격 증명 (STS)</text>

      <rect x="578" y="72" width="100" height="82" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="2" />
      <text x="628" y="104" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.blue}>③ AWS</text>
      <text x="628" y="124" textAnchor="middle" fontSize="10.5" fill={C.ink}>S3 · DynamoDB</text>
      <text x="628" y="142" textAnchor="middle" fontSize="10.5" fill={C.ink}>직접 접근</text>

      <path d="M78,112 L129,112" style={line(true, C.amber)} />
      <path d="M304,112 L351,112" style={line(true, C.teal)} />
      <path d="M526,112 L573,112" style={line(true, C.blue)} />
      <text x="350" y="196" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.inkSoft}>“인증은 CUP, 인가는 CIP” — 두 서비스를 이어 붙여 완성한다</text>
    </SvgFrame>
  );
}
