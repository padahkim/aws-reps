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

/** 켜짐/꺼짐 두 상태를 가진 도식이라, 상자·글자·화살표가 전부 active 를 받는다. */
const box = (on: boolean, fill: string, stroke: string) => ({
  fill: on ? fill : "#FBFAF8",
  stroke: on ? stroke : C.line,
  strokeWidth: on ? 2 : 1.2,
});
const label = (on: boolean, color: string, size = 12) => ({
  fill: on ? color : "#A6A399",
  fontWeight: on ? 700 : 500,
  fontSize: size,
});
const line = (on: boolean, color: string = C.blue) => ({
  stroke: on ? color : "#DEDBD3",
  strokeWidth: on ? 2.4 : 1.4,
  fill: "none",
  markerEnd: on ? `url(#ah-${color.replace("#", "")})` : "url(#ah-off)",
});
const lineText = (on: boolean, color: string = C.blue) => ({
  fill: on ? color : "#C6C3BA",
  fontSize: 10.5,
  fontWeight: on ? 700 : 500,
});

/** 화살촉 정의 — 색마다 하나씩. id 가 DOM 전역이라 색을 접미사로 붙여 충돌을 피한다. */
function Heads() {
  return (
    <defs>
      {[C.blue, C.teal, C.amber, C.red].map((col) => (
        <marker key={col} id={`ah-${col.replace("#", "")}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={col} />
        </marker>
      ))}
      <marker id="ah-off" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" fill="#DEDBD3" />
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

      <rect x="508" y="58" width="160" height="84" rx="10" fill="#FBFAF8" stroke={C.line} />
      <text x="588" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>API Gateway · ALB</text>
      <text x="588" y="112" textAnchor="middle" fontSize="10" fill={C.inkSoft}>내 백엔드 API 보호</text>

      <rect x="508" y="172" width="160" height="84" rx="10" fill="#FBFAF8" stroke={C.line} />
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
  return (
    <SvgFrame vb="0 0 700 290" aria="User Pool 로그인 흐름 — 로그인, 검증, JWT 발급, 제시, 연합 로그인">
      <circle cx="70" cy="120" r="26" style={box(true, C.blueSoft, C.blue)} />
      <text x="70" y="126" textAnchor="middle" fontSize="18">👤</text>
      <text x="70" y="166" textAnchor="middle" style={label(true, C.ink)}>사용자 (앱)</text>

      <rect x="250" y="66" width="190" height="104" rx="10" style={box(s(0), C.amberSoft, C.amber)} />
      <text x="345" y="94" textAnchor="middle" style={label(s(0), C.amberText, 13)}>Cognito User Pool</text>
      <text x="345" y="114" textAnchor="middle" style={label(s(0), C.ink)}>서버리스 사용자 DB</text>
      <text x="345" y="134" textAnchor="middle" style={label(s(1), C.ink)}>ID·비밀번호 검증 · MFA</text>
      <text x="345" y="154" textAnchor="middle" style={label(s(1), C.ink)}>(이메일·전화 확인은 가입 단계)</text>

      <rect x="250" y="206" width="190" height="60" rx="10" style={box(s(4), C.blueSoft, C.blue)} />
      <text x="345" y="230" textAnchor="middle" style={label(s(4), C.blue)}>연합 로그인 (Federation)</text>
      <text x="345" y="250" textAnchor="middle" style={label(s(4), C.ink, 11)}>Google · Facebook · SAML · OIDC</text>

      <rect x="498" y="76" width="172" height="84" rx="10" style={box(s(2), C.tealSoft, C.teal)} />
      <text x="584" y="104" textAnchor="middle" style={label(s(2), C.teal, 13)}>사용자 토큰 발급</text>
      <text x="584" y="124" textAnchor="middle" style={label(s(2), C.ink)}>scope · grant에 따라 구성</text>
      <text x="584" y="144" textAnchor="middle" style={label(s(3), C.ink)}>→ API Gateway 에 제시</text>

      <path d="M100,112 L245,104" style={line(s(0), C.amber)} />
      <text x="126" y="92" style={lineText(s(0), C.amber)}>① 로그인 (ID·비밀번호)</text>
      <path d="M444,112 L493,114" style={line(s(2), C.teal)} />
      <text x="436" y="98" style={lineText(s(2), C.teal)}>③ JWT</text>
      <path d="M345,202 L345,176" style={line(s(4), C.blue)} />
      <text x="358" y="194" style={lineText(s(4), C.blue)}>소셜·기업 계정으로도 같은 자리</text>
    </SvgFrame>
  );
}

export function CupLoginFlow() {
  return (
    <StepFlow
      label="CUP 로그인 흐름"
      steps={[
        "사용자가 앱에서 ID·비밀번호로 User Pool에 로그인을 요청한다.",
        "User Pool이 자격 증명을 검증한다 — 설정에 따라 MFA가 여기서 붙는다. 이메일·전화 확인은 로그인이 아니라 가입 직후에 끝내는 절차라, 확인이 안 된 사용자는 여기서 거부된다.",
        "인증 성공 → 요청한 scope와 grant에 맞는 토큰을 발급한다. openid가 있어야 ID 토큰이 나오고, Implicit Grant에는 Refresh 토큰이 없다. ID·Access는 JWT이고, Refresh는 앱이 열어 볼 수 없는 불투명 문자열이다.",
        "앱은 이 토큰을 Authorization 헤더에 실어 API Gateway에 제시해 백엔드에 접근한다. ALB는 토큰을 받는 게 아니라 로그인 자체를 대신한다 — §13.",
        "직접 가입 대신 Google·Facebook·SAML 같은 연합 로그인을 써도 처리하는 쪽은 똑같이 User Pool이다.",
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
  return (
    <SvgFrame vb="0 0 700 300" aria="ALB가 HTTPS 리스너에서 인증을 처리하고 인증된 요청만 백엔드로 보낸다">
      <circle cx="60" cy="140" r="26" style={box(true, C.blueSoft, C.blue)} />
      <text x="60" y="146" textAnchor="middle" fontSize="18">👤</text>
      <text x="60" y="186" textAnchor="middle" style={label(true, C.ink)}>사용자</text>

      <rect x="196" y="76" width="188" height="124" rx="10" style={box(s(0), C.amberSoft, C.amber)} />
      <text x="290" y="104" textAnchor="middle" style={label(s(0), C.amberText, 13)}>ALB</text>
      <text x="290" y="124" textAnchor="middle" style={label(s(0), C.ink)}>HTTPS 리스너 (필수)</text>
      <text x="290" y="150" textAnchor="middle" style={label(s(1), C.ink)}>규칙: authenticate-cognito</text>
      <text x="290" y="170" textAnchor="middle" style={label(s(1), C.ink)}>또는 authenticate-oidc</text>

      <rect x="204" y="236" width="188" height="54" rx="10" style={box(s(2), C.blueSoft, C.blue)} />
      <text x="298" y="258" textAnchor="middle" style={label(s(2), C.blue)}>Cognito User Pool</text>
      <text x="298" y="278" textAnchor="middle" style={label(s(2), C.ink, 11)}>(또는 OIDC IdP)</text>

      <rect x="498" y="96" width="174" height="84" rx="10" style={box(s(3), C.tealSoft, C.teal)} />
      <text x="585" y="126" textAnchor="middle" style={label(s(3), C.teal, 13)}>백엔드 (타깃 그룹)</text>
      <text x="585" y="146" textAnchor="middle" style={label(s(3), C.ink)}>인증 코드 없이</text>
      <text x="585" y="164" textAnchor="middle" style={label(s(3), C.ink)}>비즈니스 로직만</text>

      <path d="M90,136 L191,134" style={line(s(0), C.amber)} />
      <text x="98" y="122" style={lineText(s(0), C.amber)}>① HTTPS 요청</text>
      <path d="M282,204 L292,232" style={line(s(2), C.blue)} />
      <text x="120" y="228" style={lineText(s(2), C.blue)}>② 미인증이면 로그인으로</text>
      <path d="M320,234 L308,206" style={line(s(2), C.blue)} />
      <path d="M388,138 L493,138" style={line(s(3), C.teal)} />
      <text x="396" y="126" style={lineText(s(3), C.teal)}>③ 인증된 요청만 전달</text>
    </SvgFrame>
  );
}

export function AlbAuthFlow() {
  return (
    <StepFlow
      label="ALB 인증 흐름 (Cognito 방식)"
      steps={[
        "사용자가 ALB의 HTTPS 리스너로 요청을 보낸다. (HTTP 리스너에는 인증 규칙을 걸 수 없다)",
        "리스너 규칙의 authenticate-cognito 액션이 이 요청이 인증된 것인지 확인한다.",
        "미인증이면 Cognito Hosted UI로 리다이렉트해 로그인시키고, 세션 쿠키를 발급한다.",
        "인증이 끝난 요청만 타깃 그룹(백엔드)으로 전달된다 — 백엔드에는 인증 코드가 없다.",
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
