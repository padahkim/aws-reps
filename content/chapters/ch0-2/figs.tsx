"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { C } from "../ui";

/**
 * 챕터 도식 SVG + 로컬 컴포넌트 모음 (규약 v3) — sections/*.mdx 가 import 한다.
 * EvalEngine 은 iam_guide.jsx 의 인터랙티브 정책 평가 시뮬레이터 이식본(#68) —
 * useState 를 쓰므로 파일 전체를 "use client"로 둔다 (body.tsx 클라이언트 경계 안이라 무해).
 */

const SANS = "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const MONO = "'JetBrains Mono', monospace";

/** 블록 코드 — ch1-1 figs 전례. 내용은 \n 이스케이프 한 줄 템플릿으로 받는다. */
export function CodeBlock({ children }: { children: string }) {
  return (
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
        margin: "1rem 0",
      }}
    >
      {children}
    </pre>
  );
}

/** 주의(함정) 콜아웃 — 레드 왼쪽 보더 (ch1-1 figs 전례). */
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

export function IamStructureSvg() {
  return (
    <svg viewBox="0 0 760 460" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-iam" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.inkSoft} />
        </marker>
      </defs>

      <text x={130} y={34} fontSize={15} fontWeight={900} fill={C.blue} textAnchor="middle">
        ① 주체 (누가)
      </text>
      <text x={390} y={34} fontSize={15} fontWeight={900} fill={C.amberText} textAnchor="middle">
        ② 정책 (무엇을 해도 되는가)
      </text>
      <text x={646} y={34} fontSize={15} fontWeight={900} fill={C.teal} textAnchor="middle">
        ③ 리소스 (대상)
      </text>

      {/* 유저 */}
      <rect x={40} y={56} width={180} height={86} rx={12} fill={C.blueSoft} stroke={C.blue} strokeWidth={2} />
      <text x={130} y={84} fontSize={14} fontWeight={900} fill={C.blue} textAnchor="middle">
        👤 유저 (User)
      </text>
      <text x={130} y={106} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        사람/앱의 영구 신원
      </text>
      <text x={130} y={124} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        비밀번호 · 액세스 키 보유
      </text>

      {/* 그룹 */}
      <rect x={40} y={156} width={180} height={76} rx={12} fill={C.blueSoft} stroke={C.blue} strokeWidth={2} strokeDasharray="5 4" />
      <text x={130} y={184} fontSize={14} fontWeight={900} fill={C.blue} textAnchor="middle">
        👥 그룹 (Group)
      </text>
      <text x={130} y={206} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        유저 묶음. 정책을 묶어서
      </text>
      <text x={130} y={222} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        배포하는 관리 편의 도구
      </text>

      {/* 롤 */}
      <rect x={40} y={246} width={180} height={96} rx={12} fill="#FFF" stroke={C.red} strokeWidth={2.5} />
      <text x={130} y={274} fontSize={14} fontWeight={900} fill={C.red} textAnchor="middle">
        🎭 롤 (Role)
      </text>
      <text x={130} y={296} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        누구나 &ldquo;빌려 쓸 수 있는&rdquo; 신원
      </text>
      <text x={130} y={313} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        고정 자격증명 없음
      </text>
      <text x={130} y={330} fontSize={11.5} fontWeight={700} fill={C.red} textAnchor="middle">
        → 임시 자격증명 자동 발급
      </text>

      {/* 정책 문서 */}
      <rect x={300} y={80} width={180} height={230} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={2.5} />
      <text x={390} y={108} fontSize={14} fontWeight={900} fill={C.amberText} textAnchor="middle">
        📜 정책 (Policy)
      </text>
      <text x={390} y={126} fontSize={11} fill={C.inkSoft} textAnchor="middle">
        JSON 문서
      </text>
      <rect x={316} y={140} width={148} height={150} rx={8} fill={C.ink} />
      <text x={328} y={164} fontSize={10.5} fill={C.codeFg} fontFamily={MONO}>
        {"{"}
      </text>
      <text x={336} y={182} fontSize={10.5} fill="#8FE3C0" fontFamily={MONO}>
        &quot;Effect&quot;:
      </text>
      <text x={336} y={197} fontSize={10.5} fill="#fff" fontFamily={MONO}>
        &nbsp;&nbsp;&quot;Allow&quot;,
      </text>
      <text x={336} y={218} fontSize={10.5} fill="#8FE3C0" fontFamily={MONO}>
        &quot;Action&quot;:
      </text>
      <text x={336} y={233} fontSize={10.5} fill="#fff" fontFamily={MONO}>
        &nbsp;&nbsp;&quot;s3:GetObject&quot;,
      </text>
      <text x={336} y={254} fontSize={10.5} fill="#8FE3C0" fontFamily={MONO}>
        &quot;Resource&quot;:
      </text>
      <text x={336} y={269} fontSize={10.5} fill="#fff" fontFamily={MONO}>
        &nbsp;&nbsp;&quot;arn:aws:s3:::...&quot;
      </text>
      <text x={328} y={286} fontSize={10.5} fill={C.codeFg} fontFamily={MONO}>
        {"}"}
      </text>

      {/* 리소스 */}
      <rect x={560} y={70} width={172} height={60} rx={12} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={646} y={106} fontSize={13.5} fontWeight={700} fill={C.teal} textAnchor="middle">
        🪣 S3 버킷
      </text>
      <rect x={560} y={146} width={172} height={60} rx={12} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={646} y={182} fontSize={13.5} fontWeight={700} fill={C.teal} textAnchor="middle">
        🗄 DynamoDB 테이블
      </text>
      <rect x={560} y={222} width={172} height={60} rx={12} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={646} y={258} fontSize={13.5} fontWeight={700} fill={C.teal} textAnchor="middle">
        λ Lambda 함수 …
      </text>

      {/* 화살표 */}
      <line x1={220} y1={100} x2={296} y2={150} stroke={C.inkSoft} strokeWidth={2} markerEnd="url(#arrow-iam)" />
      <line x1={220} y1={194} x2={296} y2={195} stroke={C.inkSoft} strokeWidth={2} markerEnd="url(#arrow-iam)" />
      <line x1={220} y1={290} x2={296} y2={245} stroke={C.inkSoft} strokeWidth={2} markerEnd="url(#arrow-iam)" />
      <text x={258} y={180} fontSize={11} fill={C.inkSoft} fontWeight={700}>
        정책 연결
      </text>
      <line x1={480} y1={195} x2={556} y2={176} stroke={C.inkSoft} strokeWidth={2} markerEnd="url(#arrow-iam)" />
      <text x={518} y={168} fontSize={11} fill={C.inkSoft} fontWeight={700}>
        접근 허용
      </text>

      {/* 하단: 롤 플로우 */}
      <rect x={40} y={368} width={692} height={76} rx={12} fill={C.redSoft} stroke={C.red} strokeWidth={2} />
      <text x={60} y={394} fontSize={12.5} fontWeight={900} fill={C.red}>
        ★ DVA 단골 패턴 — 롤을 통한 임시 자격증명
      </text>
      <text x={60} y={418} fontSize={12.5} fill={C.ink}>
        EC2 / Lambda
      </text>
      <line x1={150} y1={414} x2={230} y2={414} stroke={C.red} strokeWidth={2} markerEnd="url(#arrow-iam)" />
      <text x={190} y={405} fontSize={10.5} fill={C.red} textAnchor="middle">
        롤을 맡음(assume)
      </text>
      <text x={238} y={418} fontSize={12.5} fill={C.ink}>
        🎭 IAM 롤
      </text>
      <line x1={308} y1={414} x2={418} y2={414} stroke={C.red} strokeWidth={2} markerEnd="url(#arrow-iam)" />
      <text x={363} y={405} fontSize={10.5} fill={C.red} textAnchor="middle">
        STS가 발급
      </text>
      <text x={426} y={418} fontSize={12.5} fill={C.ink}>
        🔑 임시 자격증명 (자동 만료·갱신)
      </text>
      <line x1={632} y1={414} x2={674} y2={414} stroke={C.red} strokeWidth={2} markerEnd="url(#arrow-iam)" />
      <text x={682} y={418} fontSize={12.5} fill={C.ink}>
        AWS API
      </text>
    </svg>
  );
}

/** 인증(AuthN) → 인가(AuthZ) 2단계 흐름 — iam_guide DiagAuthN 이식. */
export function AuthFlowSvg() {
  return (
    <svg viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-authn" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.inkSoft} />
        </marker>
      </defs>

      <rect x={16} y={72} width={104} height={62} rx={10} fill={C.blueSoft} stroke={C.blue} strokeWidth={2} />
      <text x={68} y={99} fontSize={13} fontWeight={900} fill={C.blue} textAnchor="middle">요청자</text>
      <text x={68} y={118} fontSize={10} fill={C.inkSoft} textAnchor="middle">User / Role / 앱</text>

      <line x1={120} y1={103} x2={168} y2={103} stroke={C.inkSoft} strokeWidth={2} markerEnd="url(#arrow-authn)" />

      <rect x={172} y={58} width={160} height={92} rx={10} fill="#FFF" stroke={C.blue} strokeWidth={2.5} />
      <text x={252} y={84} fontSize={13.5} fontWeight={900} fill={C.blue} textAnchor="middle">① 인증 AuthN</text>
      <text x={252} y={104} fontSize={11} fill={C.ink} textAnchor="middle">&ldquo;너 누구야?&rdquo;</text>
      <text x={252} y={122} fontSize={10} fill={C.inkSoft} textAnchor="middle">비밀번호 · 액세스 키(SigV4)</text>
      <text x={252} y={137} fontSize={10} fill={C.inkSoft} textAnchor="middle">· MFA · 임시 토큰</text>

      <line x1={332} y1={103} x2={380} y2={103} stroke={C.inkSoft} strokeWidth={2} markerEnd="url(#arrow-authn)" />

      <rect x={384} y={58} width={160} height={92} rx={10} fill="#FFF" stroke={C.amber} strokeWidth={2.5} />
      <text x={464} y={84} fontSize={13.5} fontWeight={900} fill={C.amberText} textAnchor="middle">② 인가 AuthZ</text>
      <text x={464} y={104} fontSize={11} fill={C.ink} textAnchor="middle">&ldquo;뭐 할 수 있어?&rdquo;</text>
      <text x={464} y={122} fontSize={10} fill={C.inkSoft} textAnchor="middle">정책 수집 · 평가</text>
      <text x={464} y={137} fontSize={10} fill={C.inkSoft} textAnchor="middle">Allow / Deny 판정</text>

      <line x1={544} y1={86} x2={596} y2={72} stroke={C.teal} strokeWidth={2} markerEnd="url(#arrow-authn)" />
      <line x1={544} y1={120} x2={596} y2={134} stroke={C.red} strokeWidth={2} markerEnd="url(#arrow-authn)" />

      <rect x={600} y={48} width={144} height={44} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={672} y={75} fontSize={12.5} fontWeight={900} fill={C.teal} textAnchor="middle">리소스 접근 허용</text>
      <rect x={600} y={112} width={144} height={44} rx={10} fill={C.redSoft} stroke={C.red} strokeWidth={2} />
      <text x={672} y={139} fontSize={12.5} fontWeight={900} fill={C.red} textAnchor="middle">AccessDenied</text>

      <text x={380} y={190} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        인증을 통과해도(유효한 키) 정책이 없으면 인가에서 거부된다 — 두 단계는 별개
      </text>
    </svg>
  );
}

/** 정책 유형 경계와 유효 권한(교집합) — iam_guide DiagPolicyTypes + guide-2 BoundaryDiagram 통합 이식. */
export function PolicyTypesSvg() {
  return (
    <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <circle cx={230} cy={175} r={145} fill="none" stroke={C.red} strokeWidth={2} strokeDasharray="6 5" />
      <text x={230} y={52} fontSize={12.5} fontWeight={900} fill={C.red} textAnchor="middle">SCP (조직 최대 한계)</text>

      <circle cx={205} cy={190} r={100} fill="none" stroke={C.amber} strokeWidth={2} />
      <text x={148} y={112} fontSize={11.5} fontWeight={900} fill={C.amberText} textAnchor="middle">Permission</text>
      <text x={148} y={127} fontSize={11.5} fontWeight={900} fill={C.amberText} textAnchor="middle">Boundary</text>

      <circle cx={258} cy={205} r={76} fill={C.blueSoft} fillOpacity={0.75} stroke={C.blue} strokeWidth={2} />
      <text x={300} y={155} fontSize={11.5} fontWeight={900} fill={C.blue} textAnchor="middle">Identity</text>
      <text x={300} y={170} fontSize={11.5} fontWeight={900} fill={C.blue} textAnchor="middle">Policy</text>

      <circle cx={228} cy={205} r={33} fill={C.teal} fillOpacity={0.9} />
      <text x={228} y={202} fontSize={11} fontWeight={900} fill="#FFF" textAnchor="middle">유효</text>
      <text x={228} y={216} fontSize={11} fontWeight={900} fill="#FFF" textAnchor="middle">권한</text>

      <text x={455} y={70} fontSize={13} fontWeight={900} fill={C.ink}>유효 권한 = 세 경계의 교집합</text>
      {[
        [C.red, "SCP", "Organizations가 계정 전체에 거는 최대치.", "여기 없으면 무슨 정책이든 불가."],
        [C.amberText, "Permission Boundary", "유저·롤 개인의 권한 상한선.", "그룹에는 못 건다 (함정 포인트)."],
        [C.blue, "Identity Policy", "실제로 부여한 허용 권한.", ""],
        [C.teal, "유효 권한", "모든 경계 안에서 겹치는 부분만", "실제로 허용된다."],
      ].map(([col, t, d1, d2], i) => (
        <g key={i} transform={`translate(455,${94 + i * 60})`}>
          <rect x={0} y={-11} width={14} height={14} rx={3} fill={col === C.teal ? C.teal : "none"} stroke={col as string} strokeWidth={2} />
          <text x={24} y={2} fontSize={12.5} fontWeight={900} fill={col as string}>{t}</text>
          <text x={24} y={20} fontSize={11} fill={C.inkSoft}>{d1}</text>
          {d2 && <text x={24} y={35} fontSize={11} fill={C.inkSoft}>{d2}</text>}
        </g>
      ))}
    </svg>
  );
}

/** 동일 계정 합집합 vs 교차 계정 양쪽 Allow — guide-2 CrossAccountDiagram 이식. */
export function CrossAccountSvg() {
  return (
    <svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-xacct" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.amber} />
        </marker>
      </defs>

      <rect x={20} y={28} width={310} height={168} rx={12} fill="#FFF" stroke={C.blue} strokeWidth={2} strokeDasharray="7 5" />
      <text x={175} y={52} fontSize={13} fontWeight={900} fill={C.blue} textAnchor="middle">계정 A</text>
      <text x={92} y={102} fontSize={26} textAnchor="middle">👤</text>
      <text x={92} y={126} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">IAM 유저</text>
      <rect x={160} y={82} width={150} height={52} rx={9} fill={C.blueSoft} stroke={C.blue} strokeWidth={1.5} />
      <text x={235} y={103} fontSize={11.5} fontWeight={900} fill={C.blue} textAnchor="middle">자격 증명 정책</text>
      <text x={235} y={121} fontSize={10} fill={C.inkSoft} textAnchor="middle" fontFamily={MONO}>s3:GetObject Allow</text>

      <rect x={430} y={28} width={310} height={168} rx={12} fill="#FFF" stroke={C.teal} strokeWidth={2} strokeDasharray="7 5" />
      <text x={585} y={52} fontSize={13} fontWeight={900} fill={C.teal} textAnchor="middle">계정 B</text>
      <rect x={456} y={76} width={110} height={66} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={511} y={114} fontSize={13} fontWeight={900} fill={C.teal} textAnchor="middle">🪣 S3 버킷</text>
      <rect x={586} y={84} width={134} height={52} rx={9} fill="#FFF" stroke={C.teal} strokeWidth={1.5} />
      <text x={653} y={105} fontSize={11.5} fontWeight={900} fill={C.teal} textAnchor="middle">버킷 정책</text>
      <text x={653} y={123} fontSize={10} fill={C.inkSoft} textAnchor="middle">계정 A 허용</text>

      <line x1={104} y1={148} x2={452} y2={112} stroke={C.amber} strokeWidth={2.5} markerEnd="url(#arrow-xacct)" />
      <text x={280} y={158} fontSize={11} fontWeight={700} fill={C.amberText} textAnchor="middle">교차 계정 접근</text>

      <text x={380} y={226} fontSize={12} fontWeight={700} fill={C.teal} textAnchor="middle">
        동일 계정: 자격 증명 정책 ∪ 리소스 정책 — 한쪽만 Allow여도 접근 가능 (합집합)
      </text>
      <text x={380} y={248} fontSize={12} fontWeight={700} fill={C.red} textAnchor="middle">
        교차 계정: 자격 증명 정책 Allow + 리소스 정책 Allow 둘 다 필요
      </text>
    </svg>
  );
}

/** STS AssumeRole 시퀀스 — iam_guide DiagSTS 이식. */
export function StsSequenceSvg() {
  const lanes: [string, number, string][] = [
    ["EC2 / Lambda / 유저", 110, C.blue],
    ["STS", 385, C.amberText],
    ["대상 리소스 (예: S3)", 645, C.teal],
  ];
  return (
    <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-sts" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.inkSoft} />
        </marker>
      </defs>
      {lanes.map(([t, x, col], i) => (
        <g key={i}>
          <rect x={x - 85} y={18} width={170} height={36} rx={9} fill="#FFF" stroke={col} strokeWidth={2} />
          <text x={x} y={41} fontSize={12} fontWeight={900} fill={col} textAnchor="middle">{t}</text>
          <line x1={x} y1={54} x2={x} y2={300} stroke={C.line} strokeWidth={1.5} strokeDasharray="4 4" />
        </g>
      ))}
      <line x1={110} y1={98} x2={378} y2={98} stroke={C.amber} strokeWidth={2} markerEnd="url(#arrow-sts)" />
      <text x={244} y={90} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">① AssumeRole 요청 (롤 ARN)</text>

      <line x1={385} y1={152} x2={117} y2={152} stroke={C.amber} strokeWidth={2} markerEnd="url(#arrow-sts)" />
      <text x={244} y={144} fontSize={11} fontWeight={700} fill={C.amberText} textAnchor="middle">② 임시 자격증명 발급</text>
      <text x={244} y={170} fontSize={10} fill={C.inkSoft} textAnchor="middle" fontFamily={MONO}>AccessKeyId · SecretAccessKey · SessionToken (만료 있음)</text>

      <line x1={110} y1={218} x2={638} y2={218} stroke={C.teal} strokeWidth={2} markerEnd="url(#arrow-sts)" />
      <text x={375} y={210} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">③ 임시 자격으로 API 호출 (s3:GetObject)</text>

      <line x1={645} y1={272} x2={117} y2={272} stroke={C.teal} strokeWidth={2} markerEnd="url(#arrow-sts)" />
      <text x={375} y={264} fontSize={11} fontWeight={700} fill={C.teal} textAnchor="middle">④ 데이터 반환 (권한 있으면)</text>
    </svg>
  );
}

/* ============ 인터랙티브: 정책 평가 시뮬레이터 (iam_guide EvalEngine 이식) ============ */

function Switch({ on, onClick, colorOn, label }: { on: boolean; onClick: () => void; colorOn: string; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      style={{
        width: 44,
        height: 24,
        borderRadius: 20,
        position: "relative",
        cursor: "pointer",
        border: "none",
        padding: 0,
        flex: "none",
        background: on ? colorOn : "#A9B4BF",
        transition: "background .2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      />
    </button>
  );
}

/**
 * 정책 평가 시뮬레이터 — 토글 4개로 요청 조건을 바꾸면 AWS 평가 순서(단순화:
 * 명시적 Deny > SCP > Permission Boundary > 명시적 Allow > 암묵적 Deny)에 따라
 * 실시간 판정을 보여준다. 순서 정확성은 축2 리포트에서 공식 문서 대조로 확인됨.
 * 범위는 자격 증명 기반(identity-based) 경로만 — 같은 계정 리소스 기반 정책이
 * 주체에게 직접 Allow하는 경우 Boundary의 암묵적 deny에 제한받지 않는 예외가
 * 있어(공식 evaluation-logic 문서), Allow 단계를 Identity 정책으로 한정한다.
 */
export function EvalEngine() {
  const [explicitDeny, setDeny] = useState(false);
  const [scp, setScp] = useState(true);
  const [pb, setPb] = useState(true);
  const [allow, setAllow] = useState(true);

  let stop: string | null = null;
  let result = "ALLOW";
  if (explicitDeny) { stop = "deny"; result = "DENY"; }
  else if (!scp) { stop = "scp"; result = "DENY"; }
  else if (!pb) { stop = "pb"; result = "DENY"; }
  else if (!allow) { stop = "allow"; result = "DENY"; }

  const reason = explicitDeny ? "명시적 Deny는 그 무엇도 이깁니다 → 즉시 거부"
    : !scp ? "SCP(조직 경계)가 허용하지 않음 → 거부"
    : !pb ? "Permission Boundary 상한 밖 → 거부"
    : !allow ? "어떤 정책도 명시적으로 Allow하지 않음 → 암묵적 거부"
    : "모든 경계를 통과하고 명시적 Allow 존재 → 허용";

  const steps = [
    { id: "start", label: "요청 도착", sub: "기본값 = 암묵적 거부" },
    { id: "deny", label: "명시적 Deny 있음?", sub: "어디든 Deny 하나라도 있으면 끝" },
    { id: "scp", label: "SCP가 허용?", sub: "조직 계정일 때 최대 한계" },
    { id: "pb", label: "Permission Boundary 통과?", sub: "유저·롤 권한 상한" },
    { id: "allow", label: "명시적 Allow 있음?", sub: "Identity(자격 증명 기반) 정책" },
  ];

  const toggles: [string, boolean, () => void, string][] = [
    ["명시적 Deny 존재", explicitDeny, () => setDeny(!explicitDeny), C.red],
    ["SCP가 허용", scp, () => setScp(!scp), C.teal],
    ["Permission Boundary 통과", pb, () => setPb(!pb), C.teal],
    ["명시적 Allow 존재", allow, () => setAllow(!allow), C.teal],
  ];

  const isAllow = result === "ALLOW";

  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", margin: "1.25rem 0", color: C.ink }}>
      <div style={{ background: C.ink, padding: "10px 16px", fontFamily: MONO, color: "#DCE6F2", fontSize: "0.82rem", fontWeight: 700 }}>
        🎛 정책 평가 시뮬레이터 — 토글을 바꿔보세요
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0 }}>
        <div style={{ padding: "1rem 1.1rem", borderRight: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: MONO, fontSize: "0.72rem", color: C.inkSoft, marginBottom: 8, letterSpacing: 1 }}>INPUT — 요청 조건</div>
          {toggles.map(([label, on, fn, col], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "9px 4px" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{label}</span>
              <Switch on={on} onClick={fn} colorOn={col} label={label} />
            </div>
          ))}
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 10,
              background: isAllow ? C.tealSoft : C.redSoft,
              border: `1.5px solid ${isAllow ? C.teal : C.red}`,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: "1.25rem", fontWeight: 900, color: isAllow ? C.teal : C.red }}>
              {isAllow ? "✔ ALLOW" : "✖ DENY"}
            </div>
            <div style={{ fontSize: "0.8rem", marginTop: 6, lineHeight: 1.5 }}>{reason}</div>
          </div>
        </div>
        <div style={{ padding: "1rem 1.1rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.72rem", color: C.inkSoft, marginBottom: 8, letterSpacing: 1 }}>DECISION FLOW — 평가 순서</div>
          {steps.map((s, i) => {
            const isStop = stop === s.id;
            return (
              <div key={s.id}>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: "7px 10px",
                    borderRadius: 8,
                    border: `1.5px solid ${isStop ? C.red : C.line}`,
                    background: isStop ? C.redSoft : "#fff",
                  }}
                >
                  <span style={{ fontFamily: MONO, fontSize: "0.7rem", fontWeight: 700, color: isStop ? C.red : C.inkSoft, minWidth: 14 }}>{i}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: isStop ? C.red : C.ink }}>{s.label}</div>
                    <div style={{ fontSize: "0.72rem", color: C.inkSoft }}>{s.sub}</div>
                  </div>
                  {isStop && <span style={{ color: C.red, fontWeight: 900 }}>✕</span>}
                </div>
                {i < steps.length - 1 && <div style={{ height: 10, marginLeft: 18, borderLeft: `2px solid ${C.line}` }} />}
              </div>
            );
          })}
          {!stop && (
            <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", borderRadius: 8, background: C.tealSoft, border: `1.5px solid ${C.teal}` }}>
              <span style={{ color: C.teal, fontWeight: 900 }}>✔</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.teal }}>모든 게이트 통과 → 최종 허용</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
