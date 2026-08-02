"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { C, Code, MONO, SANS } from "../ui";
import { chipBtn, outlineBtn, SimFrame, Switch } from "../interactive";

/**
 * 이 챕터 고유의 도식 SVG·인터랙티브 (규약 v3) — sections/*.mdx 가 import 한다.
 * 범용 프리미티브·상수는 여기 두지 않는다 (schema.ts "공용 승격 규약", #156).
 * EvalEngine 은 iam_guide.jsx 의 인터랙티브 정책 평가 시뮬레이터 이식본(#68) —
 * useState 를 쓰므로 파일 전체를 "use client"로 둔다 (body.tsx 클라이언트 경계 안이라 무해).
 * CardGrid/InfoCard/PointBox/AccentRow 는 iam_guide 의 TwoCol·Card·Note·색 보더 행
 * 프리미티브 이식(#75) — 본문 기조를 표 중심에서 iam_guide 카드·콜아웃 중심으로 되돌린다.
 */

/** iam_guide TwoCol 이식 — 카드들을 반응형 그리드로 배치한다. */
export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: 12,
        margin: "1rem 0",
      }}
    >
      {children}
    </div>
  );
}

const CARD_TONE = {
  blue: C.blue,
  amber: C.amberText,
  teal: C.teal,
  red: C.red,
  ink: C.inkSoft,
} as const;

/**
 * iam_guide Card+Chip 이식 — 색 제목 + (선택) 한 줄 비유 + 본문.
 * items 를 주면 Table rows 관례처럼 ReactNode 배열을 목록으로 그린다.
 * back 을 주면 플립 카드가 된다 (#205 파일럿): 탭/클릭·Enter/Space 로 뒤집혀 뒷면에
 * 본문 상세의 압축 재진술을 보여준다. 뒷면은 새 지식 금지 — 본문이 단일 진실.
 * <button> 이 아니라 role="button" 인 이유: 뒷면에 목록 등 블록 콘텐츠가 올 수 있는데
 * button 의 콘텐츠 모델은 phrasing 뿐이라 유효하지 않은 HTML 이 된다.
 */
export function InfoCard({
  tone = "blue",
  title,
  sub,
  items,
  back,
  children,
}: {
  tone?: keyof typeof CARD_TONE;
  title: ReactNode;
  sub?: ReactNode;
  items?: ReactNode[];
  back?: ReactNode;
  children?: ReactNode;
}) {
  const color = CARD_TONE[tone];
  const [flipped, setFlipped] = useState(false);

  const cardStyle: CSSProperties = {
    background: C.card,
    border: `1px solid ${C.line}`,
    borderRadius: 12,
    padding: "0.9rem 1rem",
    color: C.ink,
  };

  const front = (
    <>
      <div style={{ fontWeight: 900, fontSize: "0.92rem", color }}>{title}</div>
      {sub && <div style={{ fontSize: "0.78rem", color: C.inkSoft, marginTop: 2 }}>{sub}</div>}
      {children && (
        <div style={{ fontSize: "0.88rem", color: C.inkSoft, marginTop: 6, lineHeight: 1.65 }}>
          {children}
        </div>
      )}
      {items && (
        <ul
          style={{
            fontSize: "0.88rem",
            color: C.inkSoft,
            lineHeight: 1.7,
            margin: "6px 0 0",
            paddingLeft: 18,
          }}
        >
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </>
  );

  if (back === undefined) return <div style={cardStyle}>{front}</div>;

  // 컨트롤은 카드 전체가 아니라 우하단 토글 버튼 하나다 (PR #208 Codex 지적): 카드 전체를
  // role="button"으로 만들면 접근성 이름이 면 내용을 따라 상태와 함께 바뀌어 aria-pressed가
  // 무엇의 눌림인지 모호해진다. 버튼 라벨은 고정하고 상태는 aria-pressed로만 전달하며,
  // 면 콘텐츠는 버튼 밖의 일반 텍스트로 노출한다. 카드 아무 데나 탭해도 뒤집히는 UX는
  // 래퍼 onClick이 유지한다 (버튼 클릭도 여기로 버블링돼 한 번만 토글).
  return (
    <div
      className="flip-card"
      style={{ position: "relative", "--flip-ring": color } as CSSProperties}
      onClick={() => setFlipped((f) => !f)}
    >
      {/* 버튼이 면들보다 DOM에서 앞이다 (PR #208 Codex 라운드 2): 토글 후 스크린리더가
          앞으로 읽어 나가면 새로 드러난 면이 바로 따라온다. 화면 위치는 절대 위치라 그대로.
          보이는 문구도 "카드 뒤집기"로 고정 — aria-label이 이를 포함해야 음성 입력
          사용자가 보이는 문구로 버튼을 부를 수 있다 (상태는 화살표·aria-pressed가 전달). */}
      <button
        type="button"
        className="flip-toggle"
        aria-pressed={flipped}
        aria-label={typeof title === "string" ? `${title} — 카드 뒤집기` : "카드 뒤집기"}
        style={{ fontFamily: MONO, fontSize: "0.68rem", color }}
      >
        {flipped ? "↩" : "↻"} 카드 뒤집기
      </button>
      <div className="flip-inner" style={{ transform: flipped ? "rotateY(180deg)" : undefined }}>
        <div
          className="flip-face"
          aria-hidden={flipped}
          style={{ ...cardStyle, paddingBottom: "2.1rem" }}
        >
          {front}
        </div>
        <div
          className="flip-face flip-face-back"
          aria-hidden={!flipped}
          style={{ ...cardStyle, border: `1px solid ${color}`, paddingBottom: "2.1rem" }}
        >
          <div style={{ fontWeight: 900, fontSize: "0.92rem", color }}>{title}</div>
          <div style={{ fontSize: "0.88rem", color: C.inkSoft, marginTop: 6, lineHeight: 1.65 }}>
            {back}
          </div>
        </div>
      </div>
    </div>
  );
}

const POINT_TONE = {
  blue: [C.blue, C.blueSoft],
  amber: [C.amberText, C.amberSoft],
  teal: [C.teal, C.tealSoft],
  red: [C.red, C.redSoft],
} as const;

/** iam_guide Note(▸ DVA 포인트) 콜아웃 이식 — 톤·제목 지정형. 함정 전용은 WarnBox. */
export function PointBox({
  tone = "blue",
  title = "DVA 포인트",
  children,
}: {
  tone?: keyof typeof POINT_TONE;
  title?: string;
  children: ReactNode;
}) {
  const [c, bg] = POINT_TONE[tone];
  return (
    <div
      style={{
        background: bg,
        borderLeft: `4px solid ${c}`,
        borderRadius: "0 10px 10px 0",
        padding: "0.8rem 1.1rem",
        margin: "1.1rem 0",
        color: C.ink,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: "0.72rem",
          fontWeight: 700,
          color: c,
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        ▸ {title}
      </div>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

/** iam_guide 색 보더 행 이식 — 용어(색 볼드) + 설명 한 행. 정책 유형·치트시트용. */
export function AccentRow({
  color,
  term,
  children,
}: {
  color: string;
  term: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 12px",
        padding: "10px 14px",
        background: C.card,
        border: `1px solid ${C.line}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        margin: "8px 0",
        color: C.ink,
      }}
    >
      <b style={{ color, fontSize: "0.88rem", minWidth: 150, flex: "none" }}>{term}</b>
      <span style={{ fontSize: "0.88rem", color: C.inkSoft, lineHeight: 1.6, flex: "1 1 260px" }}>
        {children}
      </span>
    </div>
  );
}

/** IAM = AWS 계정의 관문 — iam_guide DiagOverview 이식(#75). */
export function OverviewGateSvg() {
  return (
    <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-gate" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.teal} />
        </marker>
      </defs>

      {/* 요청 주체들 */}
      {[
        ["개발자", 40],
        ["애플리케이션", 105],
        ["AWS 서비스", 170],
      ].map(([t, y], i) => (
        <g key={i}>
          <rect x={20} y={y as number} width={120} height={46} rx={9} fill={C.blueSoft} stroke={C.blue} strokeWidth={1.5} />
          <text x={80} y={(y as number) + 28} fontSize={12} fontWeight={700} fill={C.blue} textAnchor="middle">{t}</text>
          <line x1={140} y1={(y as number) + 23} x2={250} y2={150} stroke={C.inkSoft} strokeWidth={1.5} strokeDasharray="4 3" />
        </g>
      ))}

      {/* IAM 관문 */}
      <rect x={250} y={90} width={130} height={120} rx={10} fill="#FFF" stroke={C.ink} strokeWidth={2} />
      <text x={315} y={120} fontSize={19} fontWeight={900} fill={C.ink} textAnchor="middle">IAM</text>
      <text x={315} y={140} fontSize={10.5} fill={C.inkSoft} textAnchor="middle" fontFamily={MONO}>인증 + 인가</text>
      <g transform="translate(292,152)">
        <rect width={46} height={40} rx={5} fill="none" stroke={C.amber} strokeWidth={2} />
        <path d="M12 40 v-14 a11 11 0 0 1 22 0 v14" fill="none" stroke={C.amber} strokeWidth={2} />
      </g>

      {/* 허용 시 → 리소스 */}
      <line x1={380} y1={150} x2={450} y2={150} stroke={C.teal} strokeWidth={2} markerEnd="url(#arrow-gate)" />
      <text x={415} y={141} fontSize={10.5} fontWeight={700} fill={C.teal} textAnchor="middle">허용 시</text>

      {/* AWS 계정 리소스 */}
      <rect x={460} y={60} width={320} height={180} rx={12} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={620} y={86} fontSize={11.5} fontWeight={900} fill={C.teal} textAnchor="middle" fontFamily={MONO}>AWS 계정 리소스</text>
      {[
        ["S3", 480, 105],
        ["EC2", 560, 105],
        ["DynamoDB", 640, 105],
        ["Lambda", 720, 105],
        ["IAM", 480, 165],
        ["SNS", 560, 165],
        ["RDS", 640, 165],
        ["SQS", 720, 165],
      ].map(([t, x, y], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={70} height={44} rx={7} fill="#FFF" stroke={C.teal} strokeWidth={1.5} />
          <text x={(x as number) + 35} y={(y as number) + 27} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle" fontFamily={MONO}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

/** 유저·그룹·역할·정책 관계도 — iam_guide DiagComponents 이식(#75, 기존 자작 IamStructureSvg 대체). */
export function ComponentsSvg() {
  return (
    <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-comp-amber" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.amber} />
        </marker>
        <marker id="arrow-comp-red" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.red} />
        </marker>
      </defs>

      {/* 그룹: 유저 4명 */}
      <rect x={30} y={40} width={250} height={220} rx={12} fill={C.blueSoft} stroke={C.blue} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={45} y={64} fontSize={12} fontWeight={900} fill={C.blue} fontFamily={MONO}>GROUP: Developers</text>
      {[
        [60, 90],
        [170, 90],
        [60, 175],
        [170, 175],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={90} height={60} rx={9} fill="#FFF" stroke={C.blue} strokeWidth={1.5} />
          <circle cx={x + 45} cy={y + 22} r={9} fill="none" stroke={C.blue} strokeWidth={1.6} />
          <path d={`M${x + 30} ${y + 46} a15 15 0 0 1 30 0`} fill="none" stroke={C.blue} strokeWidth={1.6} />
          <text x={x + 45} y={y + 56} fontSize={9} fill={C.inkSoft} textAnchor="middle" fontFamily={MONO}>User</text>
        </g>
      ))}

      {/* 그룹 → 정책 연결 */}
      <line x1={280} y1={150} x2={340} y2={150} stroke={C.amber} strokeWidth={2} markerEnd="url(#arrow-comp-amber)" />
      <text x={310} y={141} fontSize={10} fontWeight={700} fill={C.amberText} textAnchor="middle">연결</text>

      {/* 정책 */}
      <rect x={345} y={110} width={130} height={80} rx={10} fill={C.amberSoft} stroke={C.amber} strokeWidth={2} />
      <path d="M362 128 h96 M362 145 h96 M362 162 h70" stroke={C.amber} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      <text x={410} y={183} fontSize={10.5} fontWeight={900} fill={C.amberText} textAnchor="middle" fontFamily={MONO}>Policy (권한)</text>

      {/* 역할 */}
      <rect x={520} y={40} width={250} height={130} rx={12} fill={C.redSoft} stroke={C.red} strokeWidth={2} />
      <text x={535} y={64} fontSize={12.5} fontWeight={900} fill={C.red} fontFamily={MONO}>🎭 ROLE (임시 권한)</text>
      <g transform="translate(540,80)">
        <circle cx={14} cy={14} r={13} fill="none" stroke={C.red} strokeWidth={2} />
        <path d="M20 14 h20 M40 14 l-5 -5 M40 14 l-5 5" stroke={C.red} strokeWidth={2} fill="none" />
      </g>
      <text x={595} y={98} fontSize={10.5} fill={C.ink} fontFamily={MONO}>AssumeRole로</text>
      <text x={595} y={114} fontSize={10.5} fill={C.ink} fontFamily={MONO}>일시적으로 위임</text>
      <text x={535} y={152} fontSize={9.5} fill={C.inkSoft} fontFamily={MONO}>EC2 · Lambda · 교차계정 · 페더레이션</text>

      {/* 역할에도 정책 연결 */}
      <path d="M520 150 C 500 150, 490 155, 479 155" stroke={C.amber} strokeWidth={2} fill="none" markerEnd="url(#arrow-comp-amber)" />

      {/* 역할을 맡는 주체(Trust) */}
      <rect x={520} y={210} width={250} height={120} rx={12} fill="#FFF" stroke={C.red} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={535} y={234} fontSize={11.5} fontWeight={900} fill={C.red} fontFamily={MONO}>역할을 맡는 주체 (Trust)</text>
      {[
        ["EC2 / Lambda", 262],
        ["다른 AWS 계정의 유저", 287],
        ["Google · SAML 등 외부 ID", 312],
      ].map(([t, y], i) => (
        <text key={i} x={545} y={y as number} fontSize={10.5} fill={C.ink} fontFamily={MONO}>• {t}</text>
      ))}
      <path d="M645 210 C 645 195, 645 185, 645 174" stroke={C.red} strokeWidth={1.5} fill="none" strokeDasharray="4 3" markerEnd="url(#arrow-comp-red)" />
      <text x={660} y={196} fontSize={9.5} fill={C.red}>assume</text>
    </svg>
  );
}

/** 정책 JSON 해부 — iam_guide DiagPolicyJSON 이식(#75). 코드 + 필드별 주석 카드 2열. */
export function PolicyAnatomy() {
  // [코드 라인, 강조 필드명, 코드 강조색(어두운 배경용), 칩 색(밝은 카드용), 주석]
  const rows: { t: string; k?: string; code?: string; chip?: string; note?: string }[] = [
    { t: `{` },
    { t: `  "Version": "2012-10-17",`, k: "Version", code: "#8FA0B4", chip: C.inkSoft, note: "정책 언어 버전 — 항상 이 값 (고정 문자열, 사실상 필수)" },
    { t: `  "Id": "S3-Account-Permissions",`, k: "Id", code: "#8FA0B4", chip: C.inkSoft, note: "정책 식별자 (선택)" },
    { t: `  "Statement": [{`, k: "Statement", code: "#8FB8EF", chip: C.blue, note: "권한 규칙의 배열 — 핵심 블록" },
    { t: `    "Sid": "AllowS3Read",`, k: "Sid", code: "#8FA0B4", chip: C.inkSoft, note: "문장 식별자 (선택, 설명용)" },
    { t: `    "Effect": "Allow",`, k: "Effect", code: "#6FD3C4", chip: C.teal, note: "Allow 또는 Deny (필수) — Deny가 언제나 우선" },
    { t: `    "Principal": { "AWS": ["arn:aws:iam::123456789012:root"] },`, k: "Principal", code: "#8FB8EF", chip: C.blue, note: "“누가” — 리소스 기반 정책에서 사용" },
    { t: `    "Action": ["s3:GetObject"],`, k: "Action", code: "#FFB55C", chip: C.amberText, note: "허용/거부할 API 동작 (필수)" },
    { t: `    "Resource": "arn:aws:s3:::my-bucket/*",`, k: "Resource", code: "#F4A08A", chip: C.red, note: "대상 리소스의 ARN (필수)" },
    { t: `    "Condition": {`, k: "Condition", code: "#6FD3C4", chip: C.teal, note: "적용 조건 (IP·MFA·태그 등) — 선택" },
    { t: `      "IpAddress": { "aws:SourceIp": "203.0.113.0/24" }` },
    { t: `    }` },
    { t: `  }]` },
    { t: `}` },
  ];
  return (
    <div
      style={{
        display: "grid",
        // min(300px, 100%): 320px급 폰에선 본문 폭이 300px 아래로 내려가므로
        // 트랙 최소값을 컨테이너 폭으로 캡해야 가로 오버플로가 없다 (#76 Codex 리뷰).
        gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
        gap: 12,
        margin: "1rem 0",
      }}
    >
      <pre
        style={{
          fontFamily: MONO,
          fontSize: "0.74rem",
          lineHeight: 1.85,
          background: C.ink,
          color: "#C7D2E0",
          borderRadius: 11,
          padding: "1rem 1.1rem",
          overflowX: "auto",
          margin: 0,
        }}
      >
        {rows.map((r, i) => (
          <div key={i}>
            {r.k ? (
              <>
                <span style={{ color: "#7D8FA6" }}>{r.t.slice(0, r.t.indexOf(`"`))}</span>
                <span style={{ color: r.code }}>&quot;{r.k}&quot;</span>
                <span>{r.t.slice(r.t.indexOf(`"`) + r.k.length + 2)}</span>
              </>
            ) : (
              <span style={{ color: "#7D8FA6" }}>{r.t}</span>
            )}
          </div>
        ))}
      </pre>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows
          .filter((r) => r.note)
          .map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "7px 10px",
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                color: C.ink,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: r.chip,
                  border: `1px solid ${r.chip}`,
                  background: "#FFF",
                  padding: "1px 7px",
                  borderRadius: 5,
                  whiteSpace: "nowrap",
                }}
              >
                {r.k}
              </span>
              <span style={{ fontSize: "0.8rem", color: C.inkSoft, lineHeight: 1.55 }}>{r.note}</span>
            </div>
          ))}
      </div>
    </div>
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
        [C.amberText, "Permission Boundary", "유저·역할 개인의 권한 상한선.", "그룹에는 못 건다 (함정 포인트)."],
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
      <text x={244} y={90} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">① AssumeRole 요청 (역할 ARN)</text>

      <line x1={385} y1={152} x2={117} y2={152} stroke={C.amber} strokeWidth={2} markerEnd="url(#arrow-sts)" />
      <text x={244} y={144} fontSize={11} fontWeight={700} fill={C.amberText} textAnchor="middle">② 임시 자격 증명 발급</text>
      <text x={244} y={170} fontSize={10} fill={C.inkSoft} textAnchor="middle" fontFamily={MONO}>AccessKeyId · SecretAccessKey · SessionToken (만료 있음)</text>

      <line x1={110} y1={218} x2={638} y2={218} stroke={C.teal} strokeWidth={2} markerEnd="url(#arrow-sts)" />
      <text x={375} y={210} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">③ 임시 자격으로 API 호출 (s3:GetObject)</text>

      <line x1={645} y1={272} x2={117} y2={272} stroke={C.teal} strokeWidth={2} markerEnd="url(#arrow-sts)" />
      <text x={375} y={264} fontSize={11} fontWeight={700} fill={C.teal} textAnchor="middle">④ 데이터 반환 (권한 있으면)</text>
    </svg>
  );
}

/* ============ 인터랙티브: 정책 평가 시뮬레이터 (iam_guide EvalEngine 이식) ============ */

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
    { id: "pb", label: "Permission Boundary 통과?", sub: "유저·역할 권한 상한" },
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

/* ============ 인터랙티브: 정책 요청 테스터 (#72 신규) ============ */

/** 요청 조립용 칩 버튼 — 호버·포커스는 공용 chipBtn + .widget-btn 체계(#144)에 맡긴다. */
function ReqChip({
  active,
  onClick,
  color,
  soft,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  soft: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="widget-btn"
      style={{
        ...chipBtn(active, color, soft),
        fontFamily: MONO,
        fontSize: "0.74rem",
        padding: "6px 11px",
        borderRadius: 8,
      }}
    >
      {children}
    </button>
  );
}
/**
 * 정책 요청 테스터 — 샘플 S3 정책(2 statement)에 요청 시나리오를 던져 ALLOW/암묵적 DENY 를
 * 판정하고, 결정을 만든 절을 하이라이트한다. EvalEngine(§06)이 다루는 교차 정책 우선순위와
 * 다른 축 — 여기는 "한 정책 안에서 어느 절이 왜 매칭/실패하는가"다.
 *
 * 자유 조합이 아니라 시나리오 프리셋인 이유 (2026-07-27 사용자 결정): 축 4개를 따로 두면
 * 2×2×2×2 = 16 상태가 되고 그중 대부분이 "여러 조건이 동시에 어긋난" 상태다. 그러면 함정이
 * 서로를 가려서 무엇을 배우는 화면인지 읽히지 않는다 — 실제로 Resource·IP·MFA 가 함께 틀린
 * 상태에서 ✖ 배지는 셋인데 판정문은 하나만 지목해 서로 어긋나 보였다. 프리셋은 한 번에 한
 * 가지만 어긋나게 고정하므로 각 시나리오가 함정 하나씩을 고립시킨다.
 *
 * 판정 로직의 사실 근거 (#72 코멘트 기록 대상):
 * - 버킷 ARN(:::my-bucket)과 객체 ARN(:::my-bucket/*)은 다른 ARN — §04 본문·InfoCard.
 * - Allow 절이 하나도 매칭되지 않으면 기본값인 암묵적 거부 — EvalEngine 평가 순서와 동일.
 * - Condition 이 있는 절은 조건 불충족 시 발효되지 않음 (aws:SourceIp·aws:MultiFactorAuthPresent).
 *
 * IP 는 공인 주소로 모델링한다 (PR #151 Codex 지적, P1). aws:SourceIp 는 요청이 AWS 에
 * 도달할 때 관찰되는 주소라, 사무실 사설 IP(10.x)는 NAT 를 거쳐 공인 주소로 바뀐 뒤에야
 * 보인다 — 사설 CIDR 을 조건으로 걸면 "사내망이면 ALLOW"라는 성립 불가능한 인과를 가르치게
 * 된다. 그래서 문서용 예약 대역(RFC 5737)의 공인 주소를 쓴다. (VPC 엔드포인트 경유 요청은
 * aws:VpcSourceIp 를 쓰지만 그 경로는 이 섹션 범위 밖이다.)
 */

/** 요청 시나리오 — 각각 한 가지 축만 어긋나게 두어 함정을 하나씩 고립시킨다. */
/** 정책이 객체 읽기 절에 쓴 Resource — 시나리오가 정한다 (정상은 객체 ARN, 함정은 버킷 ARN). */
const OBJ_RESOURCE_OK = "arn:aws:s3:::my-bucket/*";
const OBJ_RESOURCE_BAD = "arn:aws:s3:::my-bucket";

const REQ_SCENARIOS = [
  {
    key: "get-ok",
    label: "객체 다운로드",
    req: { action: "s3:GetObject", arn: "arn:aws:s3:::my-bucket/report.pdf", ip: "203.0.113.9 (사무실 NAT)", mfa: true },
    objResource: OBJ_RESOURCE_OK,
    lesson: "기준점 — Action·Resource·조건이 모두 맞는 요청",
  },
  {
    key: "list-ok",
    label: "목록 조회",
    req: { action: "s3:ListBucket", arn: "arn:aws:s3:::my-bucket", ip: "203.0.113.9 (사무실 NAT)", mfa: false },
    objResource: OBJ_RESOURCE_OK,
    lesson: "버킷 ARN 이 맞는 경우 — 목록 조회는 버킷을 대상으로 한다 (이 절엔 MFA 조건이 없다)",
  },
  {
    // 함정은 요청이 아니라 정책에 있다: GetObject 요청은 반드시 객체 키를 실어 보내므로
    // IAM 이 평가하는 대상도 객체 ARN 이다 — "버킷 ARN 으로 객체를 요청"하는 호출은 존재하지
    // 않는다 (PR #151 Codex 지적). 실무에서 실제로 나는 실수는 정책의 Resource 를 버킷 ARN 으로
    // 써 놓고 객체를 읽으려는 쪽이라, 그쪽을 모델링한다.
    key: "arn-trap",
    label: "정책이 버킷 ARN 만 허용",
    req: { action: "s3:GetObject", arn: "arn:aws:s3:::my-bucket/report.pdf", ip: "203.0.113.9 (사무실 NAT)", mfa: true },
    objResource: OBJ_RESOURCE_BAD,
    lesson: "정책의 Resource 실수 — 객체를 읽으려면 :::my-bucket/* 여야 한다. 버킷 ARN 은 ListBucket 같은 버킷 수준 작업용이다",
  },
  {
    key: "ip-out",
    label: "카페 Wi-Fi 에서 요청",
    req: { action: "s3:GetObject", arn: "arn:aws:s3:::my-bucket/report.pdf", ip: "198.51.100.7 (카페 Wi-Fi)", mfa: true },
    objResource: OBJ_RESOURCE_OK,
    lesson: "Condition 불충족 — Action·Resource 가 맞아도 절이 발효되지 않는다",
  },
  {
    key: "no-mfa",
    label: "MFA 없이 요청",
    req: { action: "s3:GetObject", arn: "arn:aws:s3:::my-bucket/report.pdf", ip: "203.0.113.9 (사무실 NAT)", mfa: false },
    objResource: OBJ_RESOURCE_OK,
    lesson: "Bool 조건 불충족 — 나머지가 다 맞아도 MFA 하나로 갈린다",
  },
] as const;

export function PolicyRequestTester() {
  const [pick, setPick] = useState<(typeof REQ_SCENARIOS)[number]["key"]>("get-ok");
  // 예측 게이트 — 답을 먼저 찍어야 판정이 열린다. 누르자마자 결과가 보이면 "예측"이 아니라
  // 그냥 읽기가 되고, 그건 정적 설명과 다를 게 없다 (#72 가 찾으려던 것의 반대).
  const [guess, setGuess] = useState<"allow" | "deny" | null>(null);
  const choose = (k: (typeof REQ_SCENARIOS)[number]["key"]) => { setPick(k); setGuess(null); };
  const sc = REQ_SCENARIOS.find((s) => s.key === pick) ?? REQ_SCENARIOS[0];
  const { action, arn, ip, mfa } = sc.req;
  const objResource = sc.objResource;

  const inIpRange = ip.startsWith("203.0.113.");
  // 정책의 Resource 가 요청 대상을 덮는가. `/*` 로 끝나면 그 접두사 아래 객체를 덮고,
  // 아니면 그 ARN 자체(= 버킷)만 가리킨다 — 버킷 ARN 은 객체를 포함하지 않는다.
  const covers = (policyArn: string, target: string) =>
    policyArn.endsWith("/*") ? target.startsWith(policyArn.slice(0, -1)) : target === policyArn;

  // statement 별 필드 매칭. 요청 Action 은 정확히 한 절에만 있으므로, Action 이 다른 절은
  // "실패"가 아니라 "이 요청과 무관"이다 — 아래 표시에서 ✔/✖ 대신 그렇게 적는다.
  const st = [
    {
      sid: "ListMyBucket",
      actionOk: action === "s3:ListBucket",
      resourceOk: arn === "arn:aws:s3:::my-bucket",
      ipOk: inIpRange,
      mfaOk: true,
      hasMfa: false,
    },
    {
      sid: "ReadObjectsWithMfa",
      actionOk: action === "s3:GetObject",
      resourceOk: covers(objResource, arn),
      ipOk: inIpRange,
      mfaOk: mfa,
      hasMfa: true,
    },
  ].map((s) => ({ ...s, matched: s.actionOk && s.resourceOk && s.ipOk && s.mfaOk }));

  const allow = st.some((s) => s.matched);
  // 결정 절 = 요청 Action 을 가진 절. 나머지 절은 애초에 이 요청을 다루지 않는다.
  const di = st.findIndex((s) => s.actionOk);
  const d = st[di];
  // 프리셋은 한 번에 한 축만 어긋나므로 실패 절도 항상 하나다.
  const failClause = d.matched ? null : !d.resourceOk ? "resource" : !d.ipOk ? "ip" : "mfa";

  const reason = allow
    ? di === 0
      // MFA 없이 통과하는 게 이 시나리오의 함정이다. 아래 절의 MFA 조건을 보고 "거부돼야
      // 하는 것 아니냐"고 걸리는 지점이라(2026-07-27 사용자 피드백), 조건이 정책 전체가
      // 아니라 절마다 따로 걸린다는 것을 판정문에서 짚는다.
      ? "요청 Action(s3:ListBucket)을 가진 절은 첫 번째 ListMyBucket 하나뿐이고, 대상도 버킷 ARN이라 매칭됩니다. 이 절의 조건은 IP 하나뿐이라 MFA 없이도 통과합니다 — 아래 ReadObjectsWithMfa 절의 MFA 조건은 s3:GetObject 용이라 이 요청에는 걸리지 않습니다. 조건은 정책 전체가 아니라 절(statement)마다 따로 걸립니다."
      : "객체 ARN · 사무실 IP · MFA 까지 절의 모든 조건을 충족해 매칭됩니다."
    : failClause === "resource"
      ? "s3:GetObject 는 허용돼 있지만 그 절의 Resource 가 버킷 ARN(:::my-bucket)입니다. 버킷 ARN 은 버킷 자체만 가리켜 그 안의 객체를 덮지 않으므로, 객체를 읽으려면 :::my-bucket/* 여야 합니다 — Action 이 맞아도 Resource 가 대상을 안 덮으면 암묵적 거부."
      : failClause === "ip"
        ? "Action·Resource 는 매칭되지만 요청 IP 가 IpAddress 조건(203.0.113.0/24) 밖입니다 — 조건이 안 맞으면 그 절은 발효되지 않아 암묵적 거부."
        : "Action·Resource·IP 까지 매칭되지만 aws:MultiFactorAuthPresent:true 를 충족하지 못했습니다 — 조건 하나가 어긋나 절 전체가 발효되지 않습니다.";

  const lines: { t: string; stIdx?: number; clause?: string }[] = [
    { t: `{` },
    { t: `  "Version": "2012-10-17",` },
    { t: `  "Statement": [{` },
    { t: `    "Sid": "ListMyBucket",`, stIdx: 0 },
    { t: `    "Effect": "Allow",`, stIdx: 0 },
    { t: `    "Action": ["s3:ListBucket"],`, stIdx: 0, clause: "action" },
    { t: `    "Resource": "arn:aws:s3:::my-bucket",`, stIdx: 0, clause: "resource" },
    { t: `    "Condition": {`, stIdx: 0 },
    { t: `      "IpAddress": { "aws:SourceIp": "203.0.113.0/24" }`, stIdx: 0, clause: "ip" },
    { t: `    }`, stIdx: 0 },
    { t: `  }, {` },
    { t: `    "Sid": "ReadObjectsWithMfa",`, stIdx: 1 },
    { t: `    "Effect": "Allow",`, stIdx: 1 },
    { t: `    "Action": ["s3:GetObject"],`, stIdx: 1, clause: "action" },
    { t: `    "Resource": "${objResource}",`, stIdx: 1, clause: "resource" },
    { t: `    "Condition": {`, stIdx: 1 },
    { t: `      "IpAddress": { "aws:SourceIp": "203.0.113.0/24" },`, stIdx: 1, clause: "ip" },
    { t: `      "Bool": { "aws:MultiFactorAuthPresent": "true" }`, stIdx: 1, clause: "mfa" },
    { t: `    }`, stIdx: 1 },
    { t: `  }]` },
    { t: `}` },
  ];

  // 요청 필드에 우리말 풀이를 붙인다 — Action·Resource 를 이미 아는 독자를 전제하면
  // 이 위젯이 무슨 상황인지부터 안 잡힌다 (2026-07-27 사용자 피드백).
  const reqRows: [string, string, string][] = [
    ["Action", action, "무슨 작업을 하려는가"],
    ["Resource", arn, "어떤 대상에 대해"],
    ["SourceIp", ip, "어디서 접속했는가"],
    ["MFA", mfa ? "인증함" : "없음", "2단계 인증을 거쳤는가"],
  ];

  return (
    <SimFrame title="정책 요청 테스터 — 허용될지 먼저 맞혀 보세요" icon="🔍">
      <div
        style={{
          background: C.blueSoft,
          borderLeft: `4px solid ${C.blue}`,
          borderRadius: "0 9px 9px 0",
          padding: "10px 13px",
          marginBottom: 12,
          fontSize: "0.85rem",
          lineHeight: 1.7,
          color: C.ink,
        }}
      >
        {/* 정책이 어디에 붙어 있는지를 정확히 말해야 한다. "버킷에 붙어 있다"고 하면 리소스
            기반(버킷) 정책이 되는데, 그러면 Principal 이 필수라 아래 JSON 은 AWS 가 거부하는
            형태가 된다 — 위 ExamPoint 가 가르치는 포인트와도 정면으로 어긋난다 (PR #151 Codex 지적). */}
        <b style={{ color: C.blue }}>이런 상황입니다.</b> 여러분은 <b>IAM 유저</b>이고, 아래{" "}
        <b>정책 한 장</b>이 그 유저에게 붙어 있습니다 — 사람·역할에 붙이는{" "}
        <b>자격 증명 기반 정책</b>이라 “누가”에 해당하는 <Code>Principal</Code>이 없습니다(주체가 곧
        이 정책을 달고 있는 나). 정책은 <b>무엇을 · 어디에 · 어떤 조건에서</b> 할 수 있는지 적어둔
        규칙 목록이고, 요청이 들어올 때마다 AWS가 이걸 읽어 <b>허용/거부</b>를 정합니다. 여기서는{" "}
        <Code>my-bucket</Code>이라는 버킷을 다룹니다.
        <div style={{ marginTop: 6 }}>
          시나리오를 하나 고르면 <b>어떤 요청이 날아왔는지</b>가 보입니다. 정책과 요청을 견줘 보고{" "}
          <b>통과할지 막힐지 먼저 찍은 다음</b> 정답을 여세요 — 시험도 딱 이 형식으로 묻습니다.
        </div>
      </div>

      <div style={{ fontFamily: MONO, fontSize: "0.68rem", color: C.inkSoft, letterSpacing: 0.5, marginBottom: 5 }}>
        ① 시나리오 고르기
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {REQ_SCENARIOS.map((s) => (
          <ReqChip key={s.key} active={pick === s.key} onClick={() => choose(s.key)} color={C.blue} soft={C.blueSoft}>
            {s.label}
          </ReqChip>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          // 320px 급 폰에서 트랙이 컨테이너보다 넓어지지 않게 min() 으로 캡한다 (#76 전례)
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontFamily: MONO, fontSize: "0.68rem", color: C.inkSoft, letterSpacing: 0.5, marginBottom: 5 }}>
            ② 날아온 요청 — 이걸 정책과 견줘 봅니다
          </div>
          <div
            style={{
              border: `1px solid ${C.line}`,
              borderRadius: 9,
              padding: "8px 11px",
              background: C.card,
              marginBottom: 10,
            }}
          >
            {reqRows.map(([k, v, hint]) => (
              <div key={k} style={{ display: "flex", flexWrap: "wrap", gap: "0 8px", fontSize: "0.74rem", lineHeight: 1.75, padding: "2px 0" }}>
                <span style={{ fontFamily: MONO, color: C.inkSoft, minWidth: 68, flex: "none" }}>{k}</span>
                <span style={{ fontFamily: MONO, color: C.ink, wordBreak: "break-all" }}>{v}</span>
                <span style={{ color: C.inkSoft, opacity: 0.8, fontSize: "0.7rem", flexBasis: "100%", paddingLeft: 76 }}>
                  {hint}
                </span>
              </div>
            ))}
          </div>

          <pre
            style={{
              fontFamily: MONO,
              fontSize: "0.72rem",
              lineHeight: 1.8,
              background: C.ink,
              color: "#C7D2E0",
              borderRadius: 11,
              padding: "0.9rem 1rem",
              overflowX: "auto",
              margin: 0,
            }}
          >
            {lines.map((ln, i) => {
              // 예측 전에는 하이라이트를 걸지 않는다 — 어느 줄이 붉은지가 곧 정답이다.
              const isDecisiveSt = guess !== null && ln.stIdx === di;
              const isFail = isDecisiveSt && failClause !== null && ln.clause === failClause;
              const isMatchedSt = isDecisiveSt && d.matched;
              return (
                <div
                  key={i}
                  style={{
                    background: isFail
                      ? "rgba(185,67,44,.45)"
                      : isMatchedSt
                        ? "rgba(14,124,123,.3)"
                        : "transparent",
                    // 예측 전에는 두 절을 똑같이 선명하게 — 어느 절이 밝은지도 단서가 된다
                    opacity: guess !== null && ln.stIdx !== undefined && !isDecisiveSt ? 0.45 : 1,
                    borderRadius: 4,
                  }}
                >
                  {ln.t}
                  {isFail && <span style={{ color: "#F4A08A", fontWeight: 700 }}>  ← 여기서 갈린다</span>}
                </div>
              );
            })}
          </pre>
        </div>

        <div>
          {guess === null ? (
            <div
              style={{
                padding: "14px 15px",
                borderRadius: 10,
                background: C.card,
                border: `1.5px dashed ${C.amber}`,
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: "0.68rem", color: C.amberText, letterSpacing: 0.5, fontWeight: 700 }}>
                ③ 먼저 찍어 보세요
              </div>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: C.ink, margin: "6px 0 12px" }}>
                왼쪽 요청이 이 정책을 통과할까요? <b>Action → Resource → Condition</b> 순으로 짚어
                보세요 — 정책의 어느 절이 이 요청을 다루는지, 그 절의 조건을 요청이 다 채우는지.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setGuess("allow")}
                  className="widget-btn"
                  style={{ ...outlineBtn(C.teal, C.tealSoft), padding: "9px 16px", borderRadius: 9 }}
                >
                  ✔ 허용될 것 같다
                </button>
                <button
                  type="button"
                  onClick={() => setGuess("deny")}
                  className="widget-btn"
                  style={{ ...outlineBtn(C.red, C.redSoft), padding: "9px 16px", borderRadius: 9 }}
                >
                  ✖ 거부될 것 같다
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 9,
                  marginBottom: 8,
                  background: (guess === "allow") === allow ? C.tealSoft : C.amberSoft,
                  border: `1.5px solid ${(guess === "allow") === allow ? C.teal : C.amber}`,
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  color: C.ink,
                }}
              >
                {(guess === "allow") === allow ? (
                  <>
                    <b style={{ color: C.teal }}>맞혔습니다.</b> 아래에서 어느 절이 결정했는지 확인해
                    보세요.
                  </>
                ) : (
                  <>
                    <b style={{ color: C.amberText }}>예측과 다릅니다.</b> “{guess === "allow" ? "허용" : "거부"}
                    ”이라고 보셨는데 실제 판정은 “{allow ? "허용" : "거부"}”입니다 — 왜 갈렸는지 아래를
                    보세요. 틀린 자리가 기억에 가장 오래 남습니다.
                  </>
                )}
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: allow ? C.tealSoft : C.redSoft,
                  border: `1.5px solid ${allow ? C.teal : C.red}`,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: "1.2rem", fontWeight: 900, color: allow ? C.teal : C.red }}>
                  {allow ? "✔ ALLOW" : "✖ DENY (암묵적)"}
                </div>
                <div style={{ fontSize: "0.8rem", marginTop: 6, lineHeight: 1.6 }}>{reason}</div>
              </div>
            </>
          )}

          {guess !== null && (
          <div
            style={{
              marginTop: 10,
              padding: "9px 12px",
              borderRadius: 9,
              background: C.amberSoft,
              borderLeft: `4px solid ${C.amber}`,
              color: C.ink,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: "0.66rem", fontWeight: 700, color: C.amberText, letterSpacing: 0.5 }}>
              이 시나리오가 보여주는 것
            </div>
            <div style={{ fontSize: "0.82rem", lineHeight: 1.6, marginTop: 3 }}>{sc.lesson}</div>
          </div>
          )}

          {guess !== null && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {st.map((s, i) => {
              const irrelevant = !s.actionOk;
              return (
                <div
                  key={s.sid}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1.5px solid ${irrelevant ? C.line : s.matched ? C.teal : C.red}`,
                    background: "#fff",
                    opacity: irrelevant ? 0.55 : 1,
                  }}
                >
                  <div style={{ fontFamily: MONO, fontSize: "0.72rem", fontWeight: 700, color: C.ink, marginBottom: 4 }}>
                    &quot;{s.sid}&quot;
                  </div>
                  {irrelevant ? (
                    // Action 이 다른 절은 채점 대상이 아니다 — ✖ 로 적으면 "실패"로 읽혀,
                    // 왜 다른 조건은 맞는데 거부인지 되묻게 된다.
                    <div style={{ fontSize: "0.74rem", color: C.inkSoft, lineHeight: 1.5 }}>
                      이 요청과 무관 — 절의 Action 이 {action} 이 아니라 평가되지 않습니다
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {(
                        [
                          ["Action", s.actionOk],
                          ["Resource", s.resourceOk],
                          ["IP", s.ipOk],
                          ["MFA", s.hasMfa ? s.mfaOk : null],
                        ] as [string, boolean | null][]
                      ).map(([lbl, ok]) => (
                        <span
                          key={lbl}
                          style={{
                            fontFamily: MONO,
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 5,
                            background: ok === null ? "#F1F3F5" : ok ? C.tealSoft : C.redSoft,
                            color: ok === null ? C.inkSoft : ok ? C.teal : C.red,
                          }}
                        >
                          {lbl} {ok === null ? "조건 없음" : ok ? "✔" : "✖"}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}

          {guess !== null && (
          <p style={{ fontSize: "0.78rem", color: C.inkSoft, lineHeight: 1.6, margin: "10px 0 0" }}>
            이 정책엔 명시적 Deny 가 없으므로 거부는 전부 <b>“매칭되는 Allow 없음 = 암묵적 거부”</b>입니다.
            여러 정책이 얽힌 우선순위(Deny 우선 등)는 §06 평가 시뮬레이터에서 다룹니다.
          </p>
          )}
          {/* 전제는 시나리오와 무관하게 고정 표시되므로 MFA 여부를 단정하면 안 된다 — "MFA 없이
              요청" 시나리오에서 요청 패널(MFA: 없음)과 정면으로 어긋난다 (PR #151 Codex 지적).
              고정된 것은 자격 증명 타입(IAM 유저)이고, MFA 유무는 시나리오가 정한다. */}
          <p style={{ fontSize: "0.74rem", color: C.inkSoft, lineHeight: 1.55, margin: "6px 0 0", opacity: 0.9 }}>
            전제: 요청자는 <b>IAM 유저</b>(역할 세션이 아님)이고, 사무실 요청은 회사 NAT를 거쳐 공인
            IP로 나갑니다. <span style={{ fontFamily: MONO }}>aws:MultiFactorAuthPresent</span>는
            자격 증명에 MFA 맥락이 실려 있을 때만 참이라 역할 세션에서는 다르게 동작할 수 있고,{" "}
            <span style={{ fontFamily: MONO }}>aws:SourceIp</span>는 AWS가 관찰하는 공인 주소입니다.
          </p>
        </div>
      </div>
    </SimFrame>
  );
}
