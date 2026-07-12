//fable 5 high
import React, { useState } from "react";

// ─────────────────────────────────────────────
// AWS DVA-C02 · IAM 완전 정리 (실습 제외)
// 디자인 토큰: 잉크 네이비 + AWS 앰버 + 시맨틱(허용 틸 / 거부 레드)
// ─────────────────────────────────────────────

const C = {
  ink: "#141B24",
  ink2: "#1E2833",
  paper: "#FAFAF7",
  card: "#FFFFFF",
  line: "#E4E2DA",
  amber: "#E8862E",
  amberSoft: "#FDF1E4",
  allow: "#0E8A6D",
  allowSoft: "#E3F4EE",
  deny: "#C7402D",
  denySoft: "#FBEAE6",
  blue: "#2166A8",
  blueSoft: "#E8F1F9",
  gray: "#6B7280",
  code: "#0F1720",
};

const font = {
  body: "'Noto Sans KR', -apple-system, 'Apple SD Gothic Neo', sans-serif",
  mono: "'IBM Plex Mono', 'SF Mono', Consolas, monospace",
};

// 빈출도 배지 (DVA-C02 기준 체감 출제 비중)
function Freq({ level }) {
  const map = {
    3: { label: "빈출도 상", bg: C.denySoft, fg: C.deny },
    2: { label: "빈출도 중", bg: C.amberSoft, fg: "#B4671F" },
    1: { label: "빈출도 하", bg: "#EEF0F3", fg: C.gray },
  };
  const m = map[level];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: m.bg,
        color: m.fg,
        borderRadius: 999,
        padding: "3px 12px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ letterSpacing: 2 }}>
        {"●".repeat(level)}
        {"○".repeat(3 - level)}
      </span>
      {m.label}
    </span>
  );
}

function Section({ id, kicker, title, freq, children }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: font.mono,
            fontSize: 12,
            color: C.amber,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          {kicker}
        </span>
        {freq && <Freq level={freq} />}
      </div>
      <h2
        style={{
          margin: "0 0 18px",
          fontSize: 26,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        padding: "20px 22px",
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function P({ children, style }) {
  return (
    <p
      style={{
        margin: "0 0 12px",
        fontSize: 15,
        lineHeight: 1.75,
        color: "#2B3440",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function Callout({ tone = "amber", title, children }) {
  const tones = {
    amber: { bg: C.amberSoft, bd: "#F0C79A", fg: "#8A5316" },
    allow: { bg: C.allowSoft, bd: "#A9DCC9", fg: "#0B6B55" },
    deny: { bg: C.denySoft, bd: "#EDB6AA", fg: "#9E3323" },
    blue: { bg: C.blueSoft, bd: "#AECBE6", fg: "#1B4F80" },
  };
  const t = tones[tone];
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.bd}`,
        borderRadius: 12,
        padding: "14px 18px",
        margin: "14px 0",
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 800,
            fontSize: 13.5,
            color: t.fg,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "#333B45" }}>
        {children}
      </div>
    </div>
  );
}

function Code({ children }) {
  return (
    <pre
      style={{
        background: C.code,
        color: "#D7E0EA",
        borderRadius: 12,
        padding: "16px 18px",
        fontFamily: font.mono,
        fontSize: 12.5,
        lineHeight: 1.7,
        overflowX: "auto",
        margin: "12px 0",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

function Tag({ children, tone = "blue" }) {
  const map = {
    blue: { bg: C.blueSoft, fg: C.blue },
    allow: { bg: C.allowSoft, fg: C.allow },
    deny: { bg: C.denySoft, fg: C.deny },
    ink: { bg: "#EDEFF2", fg: C.ink2 },
  };
  const t = map[tone];
  return (
    <span
      style={{
        fontFamily: font.mono,
        fontSize: 11.5,
        fontWeight: 700,
        background: t.bg,
        color: t.fg,
        borderRadius: 6,
        padding: "2px 8px",
      }}
    >
      {children}
    </span>
  );
}

function Table({ head, rows }) {
  return (
    <div style={{ overflowX: "auto", margin: "12px 0" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
      >
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  background: C.ink,
                  color: "#F3EFE7",
                  fontSize: 12.5,
                  fontWeight: 700,
                  borderRadius:
                    i === 0
                      ? "8px 0 0 0"
                      : i === head.length - 1
                        ? "0 8px 0 0"
                        : 0,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? "#F6F5F1" : C.card }}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${C.line}`,
                    lineHeight: 1.6,
                    verticalAlign: "top",
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
// SVG 다이어그램 공용 파츠
// ─────────────────────────────────────────────

const svgText = (extra = {}) => ({
  fontFamily: font.body,
  fontSize: 12,
  fill: C.ink,
  ...extra,
});

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = C.gray,
  dashed = false,
  label,
  labelDy = -6,
}) {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker
          id={`ah-${color.replace("#", "")}`}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="1.8"
        strokeDasharray={dashed ? "5 4" : "none"}
        markerEnd={`url(#ah-${color.replace("#", "")})`}
      />
      {label && (
        <text
          x={mx}
          y={my + labelDy}
          textAnchor="middle"
          style={svgText({ fontSize: 11, fill: color, fontWeight: 700 })}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function PersonIcon({ x, y, name, color = C.blue }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={7}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d={`M ${x - 11} ${y + 22} q 11 -14 22 0`}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
      <text
        x={x}
        y={y + 36}
        textAnchor="middle"
        style={svgText({ fontSize: 11, fontWeight: 600 })}
      >
        {name}
      </text>
    </g>
  );
}

// 1) 사용자 · 그룹 다이어그램
function UserGroupDiagram() {
  return (
    <svg
      viewBox="0 0 720 300"
      style={{ width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="20"
        y="30"
        width="200"
        height="110"
        rx="12"
        fill={C.blueSoft}
        stroke={C.blue}
        strokeDasharray="6 4"
      />
      <text
        x="120"
        y="52"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.blue })}
      >
        Developers 그룹
      </text>
      <PersonIcon x={60} y={80} name="Alice" />
      <PersonIcon x={120} y={80} name="Bob" />
      <PersonIcon x={180} y={80} name="Charles" />

      <rect
        x="260"
        y="30"
        width="150"
        height="110"
        rx="12"
        fill={C.blueSoft}
        stroke={C.blue}
        strokeDasharray="6 4"
      />
      <text
        x="335"
        y="52"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.blue })}
      >
        Operations 그룹
      </text>
      <PersonIcon x={300} y={80} name="David" />
      <PersonIcon x={370} y={80} name="Edward" />

      <rect
        x="140"
        y="165"
        width="230"
        height="110"
        rx="12"
        fill={C.amberSoft}
        stroke={C.amber}
        strokeDasharray="6 4"
      />
      <text
        x="255"
        y="187"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: "#B4671F" })}
      >
        Audit Team 그룹
      </text>
      <PersonIcon x={205} y={215} name="Charles" color={C.amber} />
      <PersonIcon x={305} y={215} name="David" color={C.amber} />

      <PersonIcon x={560} y={80} name="Fred" color={C.gray} />
      <text
        x="560"
        y="135"
        textAnchor="middle"
        style={svgText({ fontSize: 11, fill: C.gray })}
      >
        그룹 미소속 사용자
      </text>
      <text
        x="560"
        y="151"
        textAnchor="middle"
        style={svgText({ fontSize: 11, fill: C.gray })}
      >
        (인라인 정책으로 권한 부여 가능)
      </text>

      <text
        x="470"
        y="230"
        style={svgText({ fontSize: 12.5, fontWeight: 700 })}
      >
        · 그룹에는 사용자만 포함 (그룹 중첩 불가)
      </text>
      <text
        x="470"
        y="252"
        style={svgText({ fontSize: 12.5, fontWeight: 700 })}
      >
        · 한 사용자가 여러 그룹에 속할 수 있음
      </text>
      <text
        x="470"
        y="274"
        style={svgText({ fontSize: 12.5, fontWeight: 700 })}
      >
        · 그룹에 속하지 않아도 됨 (Fred)
      </text>
    </svg>
  );
}

// 2) AWS 접근 3가지 방법
function AccessMethodsDiagram() {
  const box = (x, title, sub, cred, color, soft) => (
    <g>
      <rect
        x={x}
        y="30"
        width="200"
        height="120"
        rx="14"
        fill={soft}
        stroke={color}
        strokeWidth="1.5"
      />
      <text
        x={x + 100}
        y="60"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fontSize: 14, fill: color })}
      >
        {title}
      </text>
      <text
        x={x + 100}
        y="82"
        textAnchor="middle"
        style={svgText({ fontSize: 11.5 })}
      >
        {sub}
      </text>
      <rect
        x={x + 25}
        y="98"
        width="150"
        height="26"
        rx="13"
        fill="#fff"
        stroke={color}
      />
      <text
        x={x + 100}
        y="115"
        textAnchor="middle"
        style={svgText({ fontSize: 11, fontWeight: 700, fill: color })}
      >
        {cred}
      </text>
    </g>
  );
  return (
    <svg
      viewBox="0 0 720 230"
      style={{ width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {box(
        20,
        "관리 콘솔",
        "웹 브라우저 UI",
        "비밀번호 + MFA",
        C.blue,
        C.blueSoft,
      )}
      {box(
        260,
        "CLI",
        "터미널 명령줄 도구",
        "액세스 키",
        "#B4671F",
        C.amberSoft,
      )}
      {box(
        500,
        "SDK",
        "코드에 내장 (언어별 라이브러리)",
        "액세스 키",
        C.allow,
        C.allowSoft,
      )}
      <Arrow x1={120} y1={150} x2={330} y2={200} color={C.gray} />
      <Arrow x1={360} y1={150} x2={360} y2={195} color={C.gray} />
      <Arrow x1={600} y1={150} x2={390} y2={200} color={C.gray} />
      <rect x="290" y="198" width="140" height="26" rx="13" fill={C.ink} />
      <text
        x="360"
        y="215"
        textAnchor="middle"
        style={svgText({ fill: "#F3EFE7", fontWeight: 700, fontSize: 12 })}
      >
        AWS API
      </text>
    </svg>
  );
}

// 3) IAM 역할 다이어그램
function RoleDiagram() {
  return (
    <svg
      viewBox="0 0 720 210"
      style={{ width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="20"
        y="60"
        width="170"
        height="90"
        rx="14"
        fill={C.blueSoft}
        stroke={C.blue}
        strokeWidth="1.5"
      />
      <text
        x="105"
        y="95"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fontSize: 14, fill: C.blue })}
      >
        EC2 인스턴스
      </text>
      <text
        x="105"
        y="118"
        textAnchor="middle"
        style={svgText({ fontSize: 11.5 })}
      >
        (가상 서버)
      </text>

      <rect
        x="285"
        y="60"
        width="170"
        height="90"
        rx="14"
        fill={C.amberSoft}
        stroke={C.amber}
        strokeWidth="1.5"
      />
      <text
        x="370"
        y="95"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fontSize: 14, fill: "#B4671F" })}
      >
        IAM 역할 (Role)
      </text>
      <text
        x="370"
        y="118"
        textAnchor="middle"
        style={svgText({ fontSize: 11.5 })}
      >
        권한 정책이 연결됨
      </text>

      <rect
        x="550"
        y="30"
        width="150"
        height="60"
        rx="12"
        fill={C.allowSoft}
        stroke={C.allow}
        strokeWidth="1.5"
      />
      <text
        x="625"
        y="66"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.allow })}
      >
        Amazon S3
      </text>
      <rect
        x="550"
        y="115"
        width="150"
        height="60"
        rx="12"
        fill={C.allowSoft}
        stroke={C.allow}
        strokeWidth="1.5"
      />
      <text
        x="625"
        y="151"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.allow })}
      >
        DynamoDB
      </text>

      <Arrow
        x1={190}
        y1={105}
        x2={280}
        y2={105}
        color={C.amber}
        label="역할 위임 (assume)"
      />
      <Arrow
        x1={455}
        y1={90}
        x2={545}
        y2={62}
        color={C.allow}
        label="API 호출"
        labelDy={-8}
      />
      <Arrow x1={455} y1={120} x2={545} y2={148} color={C.allow} />
      <text
        x="105"
        y="185"
        textAnchor="middle"
        style={svgText({ fontSize: 11.5, fill: C.gray })}
      >
        사람이 아닌 AWS 서비스가 사용
      </text>
    </svg>
  );
}

// 4) 정책 평가 로직 플로우차트
function PolicyEvalDiagram() {
  const diamond = (cx, cy, w, h, text1, text2) => (
    <g>
      <polygon
        points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`}
        fill="#fff"
        stroke={C.ink2}
        strokeWidth="1.6"
      />
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        style={svgText({ fontWeight: 700, fontSize: 12 })}
      >
        {text1}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        style={svgText({ fontWeight: 700, fontSize: 12 })}
      >
        {text2}
      </text>
    </g>
  );
  const result = (x, y, text, tone) => (
    <g>
      <rect
        x={x}
        y={y}
        width={130}
        height={44}
        rx={22}
        fill={tone === "allow" ? C.allowSoft : C.denySoft}
        stroke={tone === "allow" ? C.allow : C.deny}
        strokeWidth="1.8"
      />
      <text
        x={x + 65}
        y={y + 27}
        textAnchor="middle"
        style={svgText({
          fontWeight: 800,
          fontSize: 13.5,
          fill: tone === "allow" ? C.allow : C.deny,
        })}
      >
        {text}
      </text>
    </g>
  );
  return (
    <svg
      viewBox="0 0 720 330"
      style={{ width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="295" y="15" width="130" height="40" rx="20" fill={C.ink} />
      <text
        x="360"
        y="40"
        textAnchor="middle"
        style={svgText({ fill: "#F3EFE7", fontWeight: 700 })}
      >
        API 요청 발생
      </text>
      <Arrow x1={360} y1={55} x2={360} y2={80} color={C.ink2} />

      {diamond(360, 125, 250, 84, "① 명시적 DENY가", "하나라도 있는가?")}
      <Arrow x1={485} y1={125} x2={560} y2={125} color={C.deny} label="예" />
      {result(565, 103, "최종 거부", "deny")}

      <Arrow
        x1={360}
        y1={167}
        x2={360}
        y2={195}
        color={C.ink2}
        label="아니오"
        labelDy={4}
      />
      {diamond(360, 240, 250, 84, "② 명시적 ALLOW가", "하나라도 있는가?")}
      <Arrow x1={485} y1={240} x2={560} y2={240} color={C.allow} label="예" />
      {result(565, 218, "허용", "allow")}

      <Arrow
        x1={235}
        y1={240}
        x2={160}
        y2={240}
        color={C.deny}
        label="아니오"
      />
      {result(25, 218, "암묵적 거부", "deny")}
      <text
        x="90"
        y="285"
        textAnchor="middle"
        style={svgText({ fontSize: 11, fill: C.gray })}
      >
        기본값 (Deny by default)
      </text>
      <text
        x="360"
        y="315"
        textAnchor="middle"
        style={svgText({ fontSize: 12.5, fontWeight: 800, fill: C.deny })}
      >
        핵심: 명시적 DENY는 모든 ALLOW를 무조건 이긴다
      </text>
    </svg>
  );
}

// 5) 권한 경계 (Permission Boundary) 교집합 다이어그램
function BoundaryDiagram() {
  return (
    <svg
      viewBox="0 0 720 260"
      style={{ width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="290" cy="130" r="100" fill={C.blue} opacity="0.16" />
      <circle cx="430" cy="130" r="100" fill={C.amber} opacity="0.2" />
      <text
        x="225"
        y="60"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.blue })}
      >
        자격 증명 기반 정책
      </text>
      <text
        x="225"
        y="78"
        textAnchor="middle"
        style={svgText({ fontSize: 11, fill: C.blue })}
      >
        (사용자에게 부여된 권한)
      </text>
      <text
        x="500"
        y="60"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: "#B4671F" })}
      >
        권한 경계
      </text>
      <text
        x="500"
        y="78"
        textAnchor="middle"
        style={svgText({ fontSize: 11, fill: "#B4671F" })}
      >
        (허용 가능한 최대 범위)
      </text>
      <text
        x="360"
        y="126"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fontSize: 13, fill: C.ink })}
      >
        교집합만
      </text>
      <text
        x="360"
        y="144"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fontSize: 13, fill: C.ink })}
      >
        실제 유효 권한
      </text>
      <text
        x="360"
        y="248"
        textAnchor="middle"
        style={svgText({ fontSize: 12.5, fontWeight: 700, fill: C.gray })}
      >
        경계 밖의 권한은 정책에서 Allow해도 무효 · 사용자와 역할에 적용 가능
        (그룹에는 불가)
      </text>
    </svg>
  );
}

// 6) 교차 계정: 자격 증명 정책 vs 리소스 정책
function CrossAccountDiagram() {
  return (
    <svg
      viewBox="0 0 720 250"
      style={{ width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="20"
        y="30"
        width="300"
        height="190"
        rx="14"
        fill="#fff"
        stroke={C.blue}
        strokeDasharray="7 5"
        strokeWidth="1.5"
      />
      <text
        x="170"
        y="55"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.blue })}
      >
        계정 A
      </text>
      <PersonIcon x={100} y={110} name="IAM 사용자" />
      <rect
        x="170"
        y="95"
        width="130"
        height="46"
        rx="10"
        fill={C.blueSoft}
        stroke={C.blue}
      />
      <text
        x="235"
        y="115"
        textAnchor="middle"
        style={svgText({ fontSize: 11.5, fontWeight: 700, fill: C.blue })}
      >
        자격 증명 정책
      </text>
      <text
        x="235"
        y="131"
        textAnchor="middle"
        style={svgText({ fontSize: 10.5 })}
      >
        s3:GetObject Allow
      </text>

      <rect
        x="400"
        y="30"
        width="300"
        height="190"
        rx="14"
        fill="#fff"
        stroke={C.allow}
        strokeDasharray="7 5"
        strokeWidth="1.5"
      />
      <text
        x="550"
        y="55"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.allow })}
      >
        계정 B
      </text>
      <rect
        x="440"
        y="80"
        width="110"
        height="70"
        rx="12"
        fill={C.allowSoft}
        stroke={C.allow}
      />
      <text
        x="495"
        y="112"
        textAnchor="middle"
        style={svgText({ fontWeight: 800, fill: C.allow })}
      >
        S3 버킷
      </text>
      <rect
        x="570"
        y="90"
        width="115"
        height="50"
        rx="10"
        fill="#fff"
        stroke={C.allow}
      />
      <text
        x="627"
        y="110"
        textAnchor="middle"
        style={svgText({ fontSize: 11.5, fontWeight: 700, fill: C.allow })}
      >
        버킷 정책
      </text>
      <text
        x="627"
        y="126"
        textAnchor="middle"
        style={svgText({ fontSize: 10.5 })}
      >
        계정 A 허용
      </text>

      <Arrow
        x1={110}
        y1={150}
        x2={438}
        y2={115}
        color={C.amber}
        label="교차 계정 접근"
      />
      <text
        x="360"
        y="235"
        textAnchor="middle"
        style={svgText({ fontSize: 12.5, fontWeight: 700, fill: C.deny })}
      >
        교차 계정: 자격 증명 정책 Allow + 리소스 정책 Allow 둘 다 필요
      </text>
      <text
        x="360"
        y="215"
        textAnchor="middle"
        style={svgText({ fontSize: 12.5, fontWeight: 700, fill: C.allow })}
      >
        동일 계정: 둘 중 하나만 Allow여도 접근 가능 (합집합)
      </text>
    </svg>
  );
}

export default function App() {
  const [active, setActive] = useState("intro");

  const nav = [
    { id: "intro", n: "01", t: "IAM 소개", freq: 3 },
    { id: "policy", n: "02", t: "IAM 정책", freq: 3 },
    { id: "mfa", n: "03", t: "비밀번호 정책 & MFA", freq: 1 },
    { id: "access", n: "04", t: "액세스 키 · CLI · SDK", freq: 2 },
    { id: "cloudshell", n: "05", t: "CloudShell", freq: 1 },
    { id: "roles", n: "06", t: "IAM 역할", freq: 3 },
    { id: "security", n: "07", t: "IAM 보안 도구", freq: 2 },
    { id: "best", n: "08", t: "모범 사례 & 공동 책임", freq: 2 },
    { id: "advanced", n: "09", t: "고급 IAM", freq: 3 },
    { id: "summary", n: "10", t: "요약 & 시험 포인트", freq: null },
  ];

  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        fontFamily: font.body,
        background: C.paper,
        minHeight: "100vh",
        color: C.ink,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800;900&family=IBM+Plex+Mono:wght@400;600&display=swap');
        html { scroll-behavior: smooth; }
        ul.tight { margin: 0 0 12px; padding-left: 22px; }
        ul.tight li { font-size: 14.5px; line-height: 1.8; color: #2B3440; margin-bottom: 4px; }
        .navbtn:hover { background: rgba(255,255,255,0.08) !important; }
        @media (max-width: 860px) { .sidebar { display: none !important; } .main { margin-left: 0 !important; padding: 24px 18px !important; } }
      `}</style>

      {/* 사이드바 */}
      <aside
        className="sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 250,
          background: C.ink,
          padding: "26px 16px",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            padding: "0 10px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 11,
              color: C.amber,
              letterSpacing: "0.14em",
              fontWeight: 600,
            }}
          >
            AWS DVA-C02
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#F3EFE7",
              marginTop: 4,
            }}
          >
            IAM 완전 정리
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: "rgba(255,255,255,0.55)",
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            섹션 4 (12~30강) + 고급 IAM (415강)
            <br />
            실습 제외 · 이론 전체 포함
          </div>
        </div>
        {nav.map((item) => (
          <button
            key={item.id}
            className="navbtn"
            onClick={() => scrollTo(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              background:
                active === item.id ? "rgba(232,134,46,0.16)" : "transparent",
              border: "none",
              borderLeft:
                active === item.id
                  ? `3px solid ${C.amber}`
                  : "3px solid transparent",
              borderRadius: 8,
              padding: "9px 10px",
              cursor: "pointer",
              textAlign: "left",
              marginBottom: 2,
            }}
          >
            <span
              style={{
                fontFamily: font.mono,
                fontSize: 11,
                color: active === item.id ? C.amber : "rgba(255,255,255,0.4)",
              }}
            >
              {item.n}
            </span>
            <span
              style={{
                fontSize: 13.5,
                fontWeight: active === item.id ? 800 : 500,
                color: active === item.id ? "#fff" : "rgba(255,255,255,0.78)",
                flex: 1,
              }}
            >
              {item.t}
            </span>
            {item.freq && (
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: 1.5,
                  color:
                    item.freq === 3
                      ? "#F08A73"
                      : item.freq === 2
                        ? C.amber
                        : "rgba(255,255,255,0.35)",
                }}
              >
                {"●".repeat(item.freq)}
              </span>
            )}
          </button>
        ))}
        <div
          style={{
            marginTop: 18,
            padding: "12px 10px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 10,
            fontSize: 11,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          ●●● 빈출도 상 · ●● 중 · ● 하<br />
          DVA-C02 실제 출제 경향 기반의 대략적 체감 지표입니다.
        </div>
      </aside>

      {/* 본문 */}
      <main
        className="main"
        style={{
          marginLeft: 250,
          padding: "40px 48px 80px",
          maxWidth: 880,
          boxSizing: "border-box",
        }}
      >
        {/* 헤더 */}
        <header
          style={{
            marginBottom: 44,
            paddingBottom: 28,
            borderBottom: `2px solid ${C.ink}`,
          }}
        >
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 13,
              color: C.amber,
              fontWeight: 600,
              letterSpacing: "0.1em",
            }}
          >
            AWS Certified Developer – Associate
          </div>
          <h1
            style={{
              margin: "10px 0 12px",
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            IAM<span style={{ color: C.amber }}>.</span> 자격 증명 및 액세스
            관리
          </h1>
          <P style={{ fontSize: 16, maxWidth: 640 }}>
            IAM(Identity and Access Management)은 AWS의 모든 보안의
            출발점입니다. DVA 시험에서 IAM 자체 문제뿐 아니라
            <b> 모든 서비스 문제의 전제 지식</b>으로 등장하므로, 정책 평가
            로직과 역할(Role) 개념은 반드시 완벽하게 이해해야 합니다.
          </P>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Tag tone="ink">글로벌 서비스</Tag>
            <Tag tone="ink">리전 선택 불필요</Tag>
            <Tag tone="deny">명시적 Deny 우선</Tag>
            <Tag tone="allow">최소 권한 원칙</Tag>
          </div>
        </header>

        {/* 01 IAM 소개 */}
        <Section
          id="intro"
          kicker="12강 · IAM 소개"
          title="사용자, 그룹, 정책"
          freq={3}
        >
          <Card>
            <P>
              <b>IAM은 글로벌 서비스</b>입니다. 리전을 선택할 필요가 없으며,
              생성한 사용자·그룹·정책은 전 세계 모든 리전에서 동일하게
              적용됩니다. (시험에서 "IAM 사용자는 어느 리전에 생성되는가?" 같은
              함정 문제로 출제됩니다.)
            </P>
            <Table
              head={["구성 요소", "설명", "핵심 포인트"]}
              rows={[
                [
                  <b>루트 계정 (Root)</b>,
                  "계정 생성 시 기본으로 만들어지는 최상위 계정",
                  "초기 설정 외에는 사용 금지, 절대 공유 금지",
                ],
                [
                  <b>사용자 (User)</b>,
                  "조직 내 한 사람에 대응되는 자격 증명",
                  "1 물리적 사용자 = 1 IAM 사용자",
                ],
                [
                  <b>그룹 (Group)</b>,
                  "사용자를 묶어 권한을 일괄 부여하는 단위",
                  "그룹 안에 그룹 불가, 사용자만 포함 가능",
                ],
                [
                  <b>정책 (Policy)</b>,
                  "권한을 정의하는 JSON 문서",
                  "사용자 또는 그룹에 연결(attach)",
                ],
              ]}
            />
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 10,
                color: C.ink2,
              }}
            >
              사용자와 그룹의 관계
            </div>
            <UserGroupDiagram />
          </Card>
          <Callout
            tone="allow"
            title="최소 권한 원칙 (Least Privilege Principle)"
          >
            사용자에게 필요 이상의 권한을 부여하지 않습니다. AWS 보안의
            대원칙이며, 시험 전반에 걸쳐 "가장 적절한 권한 설계"를 고르는 기준이
            됩니다.
          </Callout>
        </Section>

        {/* 02 IAM 정책 */}
        <Section
          id="policy"
          kicker="14강 · IAM 정책"
          title="정책 구조와 상속"
          freq={3}
        >
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              정책 상속 (Inheritance)
            </div>
            <ul className="tight">
              <li>
                <b>그룹에 연결된 정책</b> → 그룹의 모든 구성원에게 적용됩니다.
              </li>
              <li>
                여러 그룹에 속한 사용자는 <b>모든 그룹의 정책을 합쳐서</b>{" "}
                받습니다.
              </li>
              <li>
                그룹에 속하지 않은 사용자에게는{" "}
                <b>인라인 정책(Inline Policy)</b>을 직접 연결할 수 있습니다.
              </li>
            </ul>
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              정책 JSON 구조 — 시험 최빈출 암기 대상
            </div>
            <Code>{`{
  "Version": "2012-10-17",          // 정책 언어 버전 (항상 이 값, 필수)
  "Id": "S3-Account-Permissions",   // 정책 식별자 (선택)
  "Statement": [
    {
      "Sid": "1",                   // 문장 식별자 (선택)
      "Effect": "Allow",            // Allow 또는 Deny (필수)
      "Principal": {                // 정책이 적용되는 대상 (리소스 기반 정책에서 사용)
        "AWS": ["arn:aws:iam::123456789012:root"]
      },
      "Action": ["s3:GetObject", "s3:PutObject"],   // 허용/거부할 API 목록
      "Resource": ["arn:aws:s3:::mybucket/*"],      // 대상 리소스 ARN
      "Condition": { ... }          // 적용 조건 (선택)
    }
  ]
}`}</Code>
            <Table
              head={["요소", "필수 여부", "설명"]}
              rows={[
                [
                  <Tag tone="ink">Version</Tag>,
                  "필수",
                  <>
                    정책 언어 버전. 항상 <code>2012-10-17</code>
                  </>,
                ],
                [
                  <Tag tone="ink">Effect</Tag>,
                  "필수",
                  "Allow(허용) 또는 Deny(거부)",
                ],
                [
                  <Tag tone="ink">Action</Tag>,
                  "필수",
                  <>
                    허용/거부할 API 동작 목록. 와일드카드 가능 (
                    <code>s3:*</code>)
                  </>,
                ],
                [
                  <Tag tone="ink">Resource</Tag>,
                  "필수",
                  "동작이 적용될 리소스의 ARN 목록",
                ],
                [
                  <Tag tone="ink">Principal</Tag>,
                  "리소스 정책에서",
                  "이 정책이 적용될 계정/사용자/역할",
                ],
                [
                  <Tag tone="ink">Condition</Tag>,
                  "선택",
                  "정책이 발효되는 조건 (IP, 시간, MFA 여부 등)",
                ],
              ]}
            />
          </Card>
          <Callout tone="deny" title="시험 팁">
            <b>Effect / Principal / Action / Resource</b> 네 가지 요소의 의미를
            묻거나, 주어진 JSON 정책을 읽고 "이 사용자가 할 수 있는 일"을
            해석하는 문제가 매우 자주 나옵니다. Version 값(2012-10-17)이
            날짜처럼 생겼지만 고정 문자열이라는 점도 기억하세요.
          </Callout>
        </Section>

        {/* 03 MFA */}
        <Section
          id="mfa"
          kicker="16강 · IAM MFA 개요"
          title="비밀번호 정책 & 다요소 인증(MFA)"
          freq={1}
        >
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              비밀번호 정책 (Password Policy)
            </div>
            <ul className="tight">
              <li>최소 비밀번호 길이 설정</li>
              <li>특정 문자 유형 요구 (대문자 / 소문자 / 숫자 / 특수문자)</li>
              <li>IAM 사용자의 자체 비밀번호 변경 허용 여부</li>
              <li>일정 기간 후 비밀번호 만료(expiration) → 강제 변경</li>
              <li>이전 비밀번호 재사용 금지 (prevent re-use)</li>
            </ul>
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              MFA = 알고 있는 것(비밀번호) + 가지고 있는 것(디바이스)
            </div>
            <P>
              비밀번호가 유출되어도 물리적 디바이스가 없으면 계정이 침해되지
              않습니다.{" "}
              <b>루트 계정과 관리자급 IAM 사용자에게는 반드시 MFA를 적용</b>하는
              것이 권장됩니다.
            </P>
            <Table
              head={["MFA 디바이스 유형", "예시", "특징"]}
              rows={[
                [
                  <b>가상 MFA 디바이스</b>,
                  "Google Authenticator, Authy",
                  "스마트폰 앱. 한 기기에 여러 토큰(여러 계정/사용자) 지원",
                ],
                [
                  <b>U2F 보안 키</b>,
                  "YubiKey (서드파티)",
                  "물리 USB 키. 하나의 키로 여러 루트/IAM 사용자 지원",
                ],
                [
                  <b>하드웨어 키 팹</b>,
                  "Gemalto (서드파티)",
                  "OTP를 표시하는 전용 물리 장치",
                ],
                [
                  <b>GovCloud용 키 팹</b>,
                  "SurePassID (서드파티)",
                  "AWS GovCloud (US) 전용",
                ],
              ]}
            />
          </Card>
        </Section>

        {/* 04 액세스 키/CLI/SDK */}
        <Section
          id="access"
          kicker="18~23강 · 액세스 키, CLI, SDK"
          title="AWS에 접근하는 3가지 방법"
          freq={2}
        >
          <Card>
            <AccessMethodsDiagram />
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              액세스 키 (Access Keys)
            </div>
            <ul className="tight">
              <li>
                <b>Access Key ID</b> ≈ 사용자 이름 / <b>Secret Access Key</b> ≈
                비밀번호에 해당
              </li>
              <li>
                사용자가 관리 콘솔에서 직접 생성하며,{" "}
                <b>생성 시점에만 Secret Key 확인 가능</b>
              </li>
              <li>
                절대 공유 금지. 코드에 하드코딩 금지 (시험 단골 오답 선택지)
              </li>
            </ul>
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              AWS CLI
            </div>
            <ul className="tight">
              <li>터미널에서 명령어로 AWS 서비스와 상호작용하는 도구</li>
              <li>
                AWS 서비스의 <b>퍼블릭 API에 직접 접근</b>
              </li>
              <li>
                리소스 관리를 스크립트로 자동화 가능 · 오픈 소스 · 콘솔의 대안
              </li>
              <li>
                Windows / macOS / Linux 모두 지원, <code>aws configure</code>로
                액세스 키 등록
              </li>
            </ul>
            <Code>{`$ aws configure
AWS Access Key ID:     AKIA................
AWS Secret Access Key: ****************************
Default region name:   ap-northeast-2
Default output format: json

$ aws iam list-users   # 등록된 자격 증명으로 API 호출`}</Code>
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              AWS SDK
            </div>
            <ul className="tight">
              <li>
                <b>언어별 라이브러리</b>로, 애플리케이션 코드 안에 내장하여 AWS
                API를 호출
              </li>
              <li>
                지원: JavaScript, Python(boto3), Java, C++, Go, PHP, .NET, Ruby
                등
              </li>
              <li>모바일 SDK(Android, iOS)와 IoT 디바이스 SDK도 존재</li>
              <li>
                예: <b>AWS CLI 자체가 Python용 SDK(boto3) 위에 구현</b>되어 있음
                — 시험 상식 포인트
              </li>
            </ul>
          </Card>
          <Callout tone="blue" title="DVA 관점 빈출 패턴">
            "애플리케이션 코드에서 AWS를 호출해야 한다" → SDK, "터미널/스크립트
            자동화" → CLI, "리전을 지정하지 않고 SDK를 쓰면?" → 기본적으로{" "}
            <b>us-east-1</b>이 사용됨.
          </Callout>
        </Section>

        {/* 05 CloudShell */}
        <Section
          id="cloudshell"
          kicker="23강 · AWS CloudShell"
          title="브라우저 기반 터미널"
          freq={1}
        >
          <Card>
            <ul className="tight">
              <li>
                관리 콘솔 안에서 바로 실행되는 <b>무료</b> 브라우저 터미널 (AWS
                CLI가 사전 설치됨)
              </li>
              <li>
                <b>로그인한 사용자의 자격 증명을 자동 사용</b> → 액세스 키 설정
                불필요
              </li>
              <li>
                홈 디렉터리에 <b>리전별 1GB의 영구 스토리지</b> 제공 (재접속해도
                파일 유지)
              </li>
              <li>
                파일 업로드/다운로드 지원, 여러 탭 분할 가능, 기본 리전은 현재
                콘솔 리전
              </li>
              <li>모든 리전에서 제공되지는 않음 (지원 리전에서만 사용 가능)</li>
            </ul>
          </Card>
        </Section>

        {/* 06 IAM 역할 */}
        <Section
          id="roles"
          kicker="24강 · AWS 서비스에 대한 IAM 역할"
          title="IAM 역할 (Roles)"
          freq={3}
        >
          <Card>
            <P>
              <b>역할(Role)은 사람이 아니라 AWS 서비스가 사용하는 자격 증명</b>
              입니다. EC2 인스턴스나 Lambda 함수가 다른 AWS 서비스에 API를
              호출하려면 권한이 필요한데, 이때 액세스 키를 심는 대신 역할을
              부여합니다.
            </P>
            <RoleDiagram />
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              자주 쓰이는 역할
            </div>
            <ul className="tight">
              <li>
                <b>EC2 인스턴스 역할</b> — 인스턴스 내부 애플리케이션이 AWS API
                호출 시 사용 (DVA 최빈출)
              </li>
              <li>
                <b>Lambda 함수 역할 (실행 역할)</b> — 함수가 다른 서비스 접근 시
                사용
              </li>
              <li>
                <b>CloudFormation 역할</b> — 스택이 리소스를 생성/수정할 때 사용
              </li>
            </ul>
          </Card>
          <Callout tone="deny" title="시험 최빈출: 액세스 키 vs 역할">
            "EC2에서 S3에 접근해야 한다"는 문제에서{" "}
            <b>액세스 키를 인스턴스에 저장하는 선택지는 항상 오답</b>입니다.
            정답은 언제나 "IAM 역할을 인스턴스에 연결"입니다. 이 패턴은 EC2,
            Lambda, ECS 등 서비스만 바꿔서 반복 출제됩니다.
          </Callout>
        </Section>

        {/* 07 보안 도구 */}
        <Section
          id="security"
          kicker="26강 · IAM 보안 도구"
          title="자격 증명 보고서 & 액세스 어드바이저"
          freq={2}
        >
          <Card>
            <Table
              head={["도구", "수준", "내용", "용도"]}
              rows={[
                [
                  <b>
                    IAM 자격 증명 보고서
                    <br />
                    (Credentials Report)
                  </b>,
                  <Tag tone="blue">계정 수준</Tag>,
                  "모든 사용자와 각 자격 증명의 상태(비밀번호 사용/변경일, MFA 여부, 액세스 키 로테이션 등)를 담은 CSV 보고서",
                  "계정 전체 감사",
                ],
                [
                  <b>
                    IAM 액세스 어드바이저
                    <br />
                    (Access Advisor)
                  </b>,
                  <Tag tone="allow">사용자 수준</Tag>,
                  "특정 사용자에게 부여된 서비스 권한과 각 서비스에 마지막으로 접근한 시각",
                  "미사용 권한 제거 → 최소 권한 실현",
                ],
              ]}
            />
            <Callout tone="blue" title="구분 문제 대비">
              "계정 전체 사용자 목록과 자격 증명 상태" → <b>자격 증명 보고서</b>{" "}
              / "이 사용자가 어떤 서비스를 언제 마지막으로 썼는가" →{" "}
              <b>액세스 어드바이저</b>. 두 도구를 바꿔 묻는 문제가 자주
              나옵니다. (콘솔에서는 현재 "Last Accessed" 탭으로 표시됩니다.)
            </Callout>
          </Card>
        </Section>

        {/* 08 모범 사례 & 공동 책임 */}
        <Section
          id="best"
          kicker="28~29강 · 모범 사례 & 공동 책임 모델"
          title="IAM 모범 사례와 책임 분담"
          freq={2}
        >
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              IAM 모범 사례 (Best Practices)
            </div>
            <ul className="tight">
              <li>
                루트 계정은 <b>초기 계정 설정 외에 사용하지 않는다</b>
              </li>
              <li>
                <b>물리적 사용자 1명 = IAM 사용자 1개</b> (계정 공유 금지)
              </li>
              <li>
                사용자를 <b>그룹에 배정</b>하고 권한은 그룹 단위로 관리
              </li>
              <li>
                <b>강력한 비밀번호 정책</b> 수립
              </li>
              <li>
                <b>MFA</b> 사용을 강제/권장
              </li>
              <li>
                AWS 서비스에 권한을 줄 때는 <b>역할(Role)</b> 사용
              </li>
              <li>
                CLI/SDK 사용 시에는 <b>액세스 키</b> 사용 (공유 금지)
              </li>
              <li>
                <b>자격 증명 보고서와 액세스 어드바이저</b>로 권한을 정기 감사
              </li>
              <li>
                IAM 사용자와 액세스 키를 <b>절대 공유하지 않는다</b>
              </li>
            </ul>
          </Card>
          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 12,
                color: C.ink2,
              }}
            >
              IAM의 공동 책임 모델 (Shared Responsibility Model)
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              <div
                style={{
                  background: C.blueSoft,
                  border: `1.5px solid ${C.blue}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{ fontWeight: 800, color: C.blue, marginBottom: 8 }}
                >
                  AWS의 책임 — 클라우드 "자체"의 보안
                </div>
                <ul className="tight">
                  <li>글로벌 인프라(하드웨어, 네트워크) 보안</li>
                  <li>구성 및 취약점 분석 (자사 인프라)</li>
                  <li>규정 준수(컴플라이언스) 검증</li>
                </ul>
              </div>
              <div
                style={{
                  background: C.amberSoft,
                  border: `1.5px solid ${C.amber}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{ fontWeight: 800, color: "#B4671F", marginBottom: 8 }}
                >
                  고객(나)의 책임 — 클라우드 "내부"의 보안
                </div>
                <ul className="tight">
                  <li>사용자·그룹·역할·정책의 생성과 관리, 모니터링</li>
                  <li>모든 계정에 MFA 활성화</li>
                  <li>액세스 키의 주기적 교체(로테이션)</li>
                  <li>IAM 도구를 활용한 적절한 권한 부여</li>
                  <li>접근 패턴 분석 및 권한 검토</li>
                </ul>
              </div>
            </div>
          </Card>
        </Section>

        {/* 09 고급 IAM */}
        <Section
          id="advanced"
          kicker="415강 · 고급 IAM"
          title="정책 평가 로직 · 교차 계정 · 동적 정책 · 권한 경계"
          freq={3}
        >
          <Callout tone="deny" title="DVA 시험의 핵심 중의 핵심">
            415강의 내용은 DVA에서 <b>가장 출제 빈도가 높은 IAM 주제</b>입니다.
            특히 ① 명시적 Deny 우선 규칙, ② IAM 정책과 S3 버킷 정책의 합산 평가,
            ③ iam:PassRole은 반드시 정확히 알아야 합니다.
          </Callout>

          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              ① 권한 부여(Authorization) 평가 로직
            </div>
            <PolicyEvalDiagram />
            <ul className="tight" style={{ marginTop: 10 }}>
              <li>
                기본값은 <b>모든 요청 거부(implicit deny)</b> — 단, 루트 계정은
                모든 권한 보유
              </li>
              <li>
                <b>명시적 Deny가 하나라도 있으면</b> 다른 어떤 Allow가 있어도{" "}
                <b>무조건 거부</b>
              </li>
              <li>Deny가 없고 Allow가 있으면 허용, 둘 다 없으면 암묵적 거부</li>
            </ul>
          </Card>

          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              ② IAM 정책(자격 증명 기반) & S3 버킷 정책(리소스 기반)
            </div>
            <P>
              동일 계정 안에서는 두 정책의 <b>합집합(union)</b>으로 평가됩니다.
              교차 계정에서는 양쪽 모두의 Allow가 필요합니다.
            </P>
            <CrossAccountDiagram />
            <Table
              head={[
                "시나리오 (시험 단골 4문형)",
                "IAM 정책",
                "버킷 정책",
                "결과",
              ]}
              rows={[
                [
                  "케이스 1",
                  <Tag tone="allow">RW Allow</Tag>,
                  "없음",
                  <Tag tone="allow">접근 가능</Tag>,
                ],
                [
                  "케이스 2",
                  <Tag tone="allow">RW Allow</Tag>,
                  <Tag tone="deny">명시적 Deny</Tag>,
                  <Tag tone="deny">접근 불가</Tag>,
                ],
                [
                  "케이스 3",
                  "권한 없음",
                  <Tag tone="allow">RW Allow</Tag>,
                  <Tag tone="allow">접근 가능 (동일 계정)</Tag>,
                ],
                [
                  "케이스 4",
                  <Tag tone="deny">명시적 Deny</Tag>,
                  <Tag tone="allow">Allow</Tag>,
                  <Tag tone="deny">접근 불가</Tag>,
                ],
              ]}
            />
          </Card>

          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              ③ 동적 정책 (Dynamic Policies) — 정책 변수
            </div>
            <P>
              사용자 100명에게 각자의 홈 디렉터리(/home/사용자명)만 허용하려면,
              사용자마다 정책 100개를 만들 필요 없이{" "}
              <b>
                정책 변수 <code>{"${aws:username}"}</code>
              </b>
              를 사용한 정책 1개로 해결합니다.
            </P>
            <Code>{`{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": ["arn:aws:s3:::my-company/home/\${aws:username}/*"]
}`}</Code>
          </Card>

          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              ④ 관리형 정책 vs 인라인 정책
            </div>
            <Table
              head={["유형", "관리 주체", "특징"]}
              rows={[
                [
                  <b>AWS 관리형 정책</b>,
                  "AWS",
                  "AWS가 유지·업데이트. 신규 서비스/API 출시 시 자동 반영 (예: AdministratorAccess, PowerUserAccess)",
                ],
                [
                  <b>고객 관리형 정책</b>,
                  "고객",
                  "재사용 가능, 버전 관리 및 롤백 지원, 세밀한 제어 가능 — 모범 사례로 권장",
                ],
                [
                  <b>인라인 정책</b>,
                  "고객",
                  "특정 하나의 보안 주체(principal)에 1:1로 종속. 사용자 삭제 시 정책도 함께 삭제됨",
                ],
              ]}
            />
          </Card>

          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              ⑤ 역할 전달 권한 — iam:PassRole (DVA 초빈출)
            </div>
            <P>
              EC2 인스턴스를 시작하면서 역할을 붙이거나, Lambda·CodePipeline
              등에 역할을 지정하려면, 그 작업을 수행하는 사용자에게{" "}
              <b>
                <code>iam:PassRole</code>
              </b>{" "}
              권한이 필요합니다. 역할 확인을 위해 <code>iam:GetRole</code>이
              함께 쓰이기도 합니다.
            </P>
            <Code>{`{
  "Effect": "Allow",
  "Action": ["ec2:RunInstances", "iam:PassRole"],
  "Resource": "arn:aws:iam::123456789012:role/S3AccessRole"
}`}</Code>
            <Callout tone="blue" title="신뢰 정책 (Trust Policy)">
              역할은 아무 서비스나 가져다 쓸 수 없습니다. 역할의{" "}
              <b>신뢰 정책에 정의된 서비스/주체만</b> 그 역할을 맡을(assume) 수
              있습니다. "역할을 전달했는데 서비스가 사용하지 못한다" → 신뢰
              정책의 Principal 확인이 정답인 문제가 나옵니다.
            </Callout>
          </Card>

          <Card>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 8,
                color: C.ink2,
              }}
            >
              ⑥ 권한 경계 (Permission Boundaries)
            </div>
            <BoundaryDiagram />
            <ul className="tight" style={{ marginTop: 8 }}>
              <li>
                <b>사용자와 역할</b>에 설정 가능 (그룹에는 불가) — 함정 포인트
              </li>
              <li>
                보안 주체가 가질 수 있는 <b>최대 권한의 상한선</b>을 정의
                (자체로 권한을 부여하지는 않음)
              </li>
              <li>
                유효 권한 = <b>자격 증명 기반 정책 ∩ 권한 경계</b> (교집합)
              </li>
              <li>
                활용: 개발자에게 정책 생성 권한을 주되 권한 상승(privilege
                escalation)을 차단
              </li>
              <li>
                AWS Organizations의 SCP와 함께 사용 가능 — 전체 유효 권한은{" "}
                <b>SCP ∩ 권한 경계 ∩ 자격 증명 정책</b>
              </li>
            </ul>
          </Card>
        </Section>

        {/* 10 요약 */}
        <Section
          id="summary"
          kicker="30강 · IAM 요약"
          title="한 장 요약 & 시험 직전 체크리스트"
        >
          <Card>
            <Table
              head={["개념", "한 줄 정리"]}
              rows={[
                ["사용자 (Users)", "실제 사람과 매핑, 콘솔 비밀번호 보유"],
                ["그룹 (Groups)", "사용자만 포함, 권한 일괄 관리"],
                ["정책 (Policies)", "권한을 정의한 JSON, 사용자/그룹에 연결"],
                ["역할 (Roles)", "EC2·Lambda 등 AWS 서비스에게 주는 자격 증명"],
                ["보안 (Security)", "MFA + 비밀번호 정책"],
                ["AWS CLI", "명령줄로 AWS 관리 (액세스 키 사용)"],
                ["AWS SDK", "코드 안에서 AWS 관리 (액세스 키 사용)"],
                ["액세스 키", "CLI/SDK용 자격 증명 — 공유·하드코딩 금지"],
                [
                  "감사 (Audit)",
                  "자격 증명 보고서(계정) + 액세스 어드바이저(사용자)",
                ],
              ]}
            />
          </Card>
          <Card style={{ background: C.ink, border: "none" }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: C.amber,
                marginBottom: 12,
              }}
            >
              시험 직전 최종 체크 — 이것만은 반드시
            </div>
            <ul className="tight">
              {[
                "IAM은 글로벌 서비스다 (리전 없음)",
                "명시적 Deny > Allow > 암묵적 Deny(기본값)",
                "EC2/Lambda가 AWS를 호출한다 → 무조건 역할(Role), 액세스 키는 오답",
                "역할을 서비스에 지정하려면 iam:PassRole 권한 필요",
                "교차 계정 접근 = 자격 증명 정책 Allow + 리소스 정책 Allow 둘 다",
                "동일 계정 = 자격 증명 정책과 리소스 정책의 합집합",
                "정책 변수 ${aws:username}으로 사용자별 동적 정책 1개로 처리",
                "권한 경계는 사용자·역할에만 (그룹 불가), 유효 권한은 교집합",
                "인라인 정책은 주체와 함께 삭제, 고객 관리형 정책은 재사용·버전 관리 가능",
              ].map((t, i) => (
                <li key={i} style={{ color: "#E9E5DC" }}>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
          <P style={{ fontSize: 12.5, color: C.gray, marginTop: 20 }}>
            빈출도는 DVA-C02 시험의 일반적인 출제 경향을 바탕으로 한 학습
            우선순위 지표이며, 실제 시험 구성은 회차마다 다를 수 있습니다.
          </P>
        </Section>
      </main>
    </div>
  );
}
