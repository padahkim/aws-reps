// fable5 high
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   AWS DVA(DVA-C02) · EC2 섹션 학습 가이드
   팔레트: paper #F6F7F9 / ink #1C2733 / line #E1E6EC
           accent(주황) #E8801A / blue #2F6FAE / green #359268 / red #C4554D
   서체: IBM Plex Sans KR(본문) + IBM Plex Mono(코드·라벨)
────────────────────────────────────────────── */

const C = {
  paper: "#F6F7F9",
  card: "#FFFFFF",
  ink: "#1C2733",
  sub: "#5B6B7B",
  line: "#E1E6EC",
  accent: "#E8801A",
  accentSoft: "#FDF1E3",
  blue: "#2F6FAE",
  blueSoft: "#EBF2F9",
  green: "#359268",
  greenSoft: "#E9F5EF",
  red: "#C4554D",
  redSoft: "#FBEEED",
  mono: "'IBM Plex Mono', monospace",
};

/* ── 출제빈도 게이지 (이 페이지의 시그니처 요소) ── */
function FreqGauge({ level, compact }) {
  const labels = {
    1: "낮음",
    2: "낮음~보통",
    3: "보통",
    4: "높음",
    5: "매우 높음",
  };
  const color =
    level >= 5
      ? C.red
      : level >= 4
        ? C.accent
        : level >= 3
          ? C.blue
          : "#9AA8B5";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        flexShrink: 0,
      }}
    >
      <span
        style={{ display: "inline-flex", gap: 2.5, alignItems: "flex-end" }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              width: compact ? 4 : 5,
              height: (compact ? 5 : 6) + i * (compact ? 2 : 2.4),
              borderRadius: 1.5,
              background: i <= level ? color : C.line,
              transition: "background .2s",
            }}
          />
        ))}
      </span>
      {!compact && (
        <span
          style={{
            fontFamily: C.mono,
            fontSize: 11,
            color,
            fontWeight: 600,
            letterSpacing: ".02em",
          }}
        >
          출제 {labels[level]}
        </span>
      )}
    </span>
  );
}

/* ── 공통 레이아웃 조각 ── */
function Section({ id, no, title, freq, children, refMap }) {
  return (
    <section
      id={id}
      ref={(el) => (refMap.current[id] = el)}
      style={{ scrollMarginTop: 86, marginBottom: 46 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: C.mono,
            fontSize: 12,
            color: C.accent,
            fontWeight: 600,
            letterSpacing: ".08em",
          }}
        >
          {no}
        </span>
        <h2
          style={{
            fontSize: 23,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        <FreqGauge level={freq} />
      </div>
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${C.ink} 0 56px, ${C.line} 56px)`,
          marginBottom: 18,
        }}
      />
      {children}
    </section>
  );
}

function Card({ children, tone, style }) {
  const bg =
    tone === "warn"
      ? C.accentSoft
      : tone === "good"
        ? C.greenSoft
        : tone === "bad"
          ? C.redSoft
          : C.card;
  const border = tone ? "transparent" : C.line;
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 12,
        lineHeight: 1.7,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ExamTip({ children }) {
  return (
    <Card tone="warn" style={{ display: "flex", gap: 10 }}>
      <span
        style={{
          fontFamily: C.mono,
          fontSize: 11,
          fontWeight: 700,
          color: C.accent,
          whiteSpace: "nowrap",
          paddingTop: 3,
        }}
      >
        시험 포인트
      </span>
      <div style={{ fontSize: 14 }}>{children}</div>
    </Card>
  );
}

function Mono({ children }) {
  return (
    <code
      style={{
        fontFamily: C.mono,
        fontSize: "0.88em",
        background: C.blueSoft,
        color: C.blue,
        padding: "1px 5px",
        borderRadius: 4,
      }}
    >
      {children}
    </code>
  );
}

function Table({ head, rows, widths }) {
  return (
    <div
      style={{
        overflowX: "auto",
        marginBottom: 12,
        border: `1px solid ${C.line}`,
        borderRadius: 10,
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: 13.5,
          minWidth: 560,
        }}
      >
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "9px 12px",
                  background: C.ink,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 12.5,
                  width: widths ? widths[i] : undefined,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? "#FAFBFC" : "#fff" }}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "9px 12px",
                    borderTop: `1px solid ${C.line}`,
                    verticalAlign: "top",
                    lineHeight: 1.55,
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

/* ── SVG 다이어그램 공통 조각 ── */
function Diagram({ vb, children, caption, h }) {
  return (
    <figure style={{ margin: "6px 0 16px" }}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.line}`,
          borderRadius: 12,
          padding: "10px 8px",
        }}
      >
        <svg
          viewBox={vb}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: h || 999,
            display: "block",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill={C.sub} />
            </marker>
            <marker
              id="arrB"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill={C.blue} />
            </marker>
            <marker
              id="arrG"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill={C.green} />
            </marker>
            <marker
              id="arrR"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill={C.red} />
            </marker>
            <marker
              id="arrO"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill={C.accent} />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      {caption && (
        <figcaption
          style={{
            fontSize: 12,
            color: C.sub,
            marginTop: 6,
            fontFamily: C.mono,
            letterSpacing: ".01em",
          }}
        >
          ▲ {caption}
        </figcaption>
      )}
    </figure>
  );
}

const box = (x, y, w, h, opts = {}) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={opts.rx ?? 8}
    fill={opts.fill || C.card}
    stroke={opts.stroke || C.ink}
    strokeWidth={opts.sw ?? 1.4}
    strokeDasharray={opts.dash || "none"}
  />
);
const txt = (x, y, s, opts = {}) => (
  <text
    x={x}
    y={y}
    fontSize={opts.fs || 12.5}
    fontWeight={opts.fw || 500}
    fill={opts.fill || C.ink}
    textAnchor={opts.anchor || "middle"}
    fontFamily={opts.mono ? C.mono : "'IBM Plex Sans KR', sans-serif"}
  >
    {s}
  </text>
);

/* ═══════════ 개별 다이어그램 ═══════════ */

function DiagramEC2() {
  return (
    <Diagram
      vb="0 0 760 300"
      caption="EC2 인스턴스를 구성하는 선택 요소 — 시험에서는 이 조합을 '사이징 & 구성 옵션'이라 부른다"
    >
      {/* EC2 본체 */}
      {box(280, 60, 200, 180, {
        stroke: C.accent,
        sw: 2,
        fill: C.accentSoft,
        rx: 12,
      })}
      {txt(380, 88, "EC2 인스턴스", { fs: 16, fw: 700 })}
      {txt(380, 108, "(가상 서버)", { fs: 11.5, fill: C.sub })}
      {box(300, 124, 160, 30, { stroke: C.line, sw: 1 })}
      {txt(380, 143, "OS · Linux / Windows / macOS", { fs: 11 })}
      {box(300, 160, 160, 30, { stroke: C.line, sw: 1 })}
      {txt(380, 179, "vCPU + RAM", { fs: 11 })}
      {box(300, 196, 160, 30, { stroke: C.line, sw: 1 })}
      {txt(380, 215, "네트워크 카드 · 퍼블릭 IP", { fs: 11 })}

      {/* 좌: 사용자 & User Data */}
      {box(30, 70, 170, 64, { stroke: C.blue })}
      {txt(115, 96, "User Data 스크립트", { fs: 12.5, fw: 600, fill: C.blue })}
      {txt(115, 114, "부팅 시 · 1회 · root 권한", { fs: 10.5, fill: C.sub })}
      <line
        x1="200"
        y1="102"
        x2="276"
        y2="120"
        stroke={C.blue}
        strokeWidth="1.6"
        markerEnd="url(#arrB)"
      />

      {box(30, 176, 170, 64, { stroke: C.green })}
      {txt(115, 202, "보안 그룹", { fs: 12.5, fw: 600, fill: C.green })}
      {txt(115, 220, "인스턴스 방화벽", { fs: 10.5, fill: C.sub })}
      <line
        x1="200"
        y1="208"
        x2="276"
        y2="196"
        stroke={C.green}
        strokeWidth="1.6"
        markerEnd="url(#arrG)"
      />

      {/* 우: 스토리지 */}
      {box(560, 52, 170, 52, { stroke: C.ink })}
      {txt(645, 73, "EBS / EFS", { fs: 12.5, fw: 600 })}
      {txt(645, 90, "네트워크 연결 스토리지", { fs: 10.5, fill: C.sub })}
      <line
        x1="480"
        y1="110"
        x2="556"
        y2="82"
        stroke={C.sub}
        strokeWidth="1.6"
        markerEnd="url(#arr)"
      />

      {box(560, 128, 170, 52, { stroke: C.ink, dash: "5 4" })}
      {txt(645, 149, "인스턴스 스토어", { fs: 12.5, fw: 600 })}
      {txt(645, 166, "하드웨어 직결 (임시)", { fs: 10.5, fill: C.sub })}
      <line
        x1="480"
        y1="152"
        x2="556"
        y2="152"
        stroke={C.sub}
        strokeWidth="1.6"
        markerEnd="url(#arr)"
      />

      {box(560, 204, 170, 52, { stroke: C.accent })}
      {txt(645, 225, "ELB · ASG", { fs: 12.5, fw: 600, fill: C.accent })}
      {txt(645, 242, "분산 · 자동 확장 (연계)", { fs: 10.5, fill: C.sub })}
      <line
        x1="480"
        y1="200"
        x2="556"
        y2="224"
        stroke={C.accent}
        strokeWidth="1.6"
        markerEnd="url(#arrO)"
      />
    </Diagram>
  );
}

function DiagramNaming() {
  return (
    <Diagram
      vb="0 0 760 210"
      caption="인스턴스 유형 명명 규칙 — 예: m5.2xlarge"
    >
      {txt(230, 84, "m", { fs: 56, fw: 700, mono: true, fill: C.blue })}
      {txt(310, 84, "5", { fs: 56, fw: 700, mono: true, fill: C.green })}
      {txt(352, 84, ".", { fs: 56, fw: 700, mono: true, fill: C.sub })}
      {txt(480, 84, "2xlarge", { fs: 56, fw: 700, mono: true, fill: C.accent })}

      <line
        x1="230"
        y1="102"
        x2="230"
        y2="132"
        stroke={C.blue}
        strokeWidth="1.5"
      />
      {box(140, 132, 180, 52, { stroke: C.blue })}
      {txt(230, 153, "인스턴스 패밀리", { fs: 12.5, fw: 700, fill: C.blue })}
      {txt(230, 171, "m=범용 · c=컴퓨팅 · r=메모리", { fs: 10.5, fill: C.sub })}

      <line
        x1="310"
        y1="102"
        x2="330"
        y2="132"
        stroke={C.green}
        strokeWidth="1.5"
      />
      {box(330, 132, 130, 52, { stroke: C.green })}
      {txt(395, 153, "세대", { fs: 12.5, fw: 700, fill: C.green })}
      {txt(395, 171, "숫자↑ = 신형·개선", { fs: 10.5, fill: C.sub })}

      <line
        x1="480"
        y1="102"
        x2="540"
        y2="132"
        stroke={C.accent}
        strokeWidth="1.5"
      />
      {box(470, 132, 180, 52, { stroke: C.accent })}
      {txt(560, 153, "크기 (size)", { fs: 12.5, fw: 700, fill: C.accent })}
      {txt(560, 171, "커질수록 vCPU·RAM 증가", { fs: 10.5, fill: C.sub })}
    </Diagram>
  );
}

function DiagramSG() {
  return (
    <Diagram
      vb="0 0 780 330"
      caption="보안 그룹 = 인스턴스를 감싸는 '허용 규칙 전용' 방화벽 · Stateful(응답 트래픽 자동 허용)"
    >
      {/* SG 테두리 */}
      {box(300, 40, 220, 250, {
        stroke: C.green,
        sw: 2,
        dash: "7 5",
        rx: 14,
        fill: C.greenSoft,
      })}
      {txt(410, 66, "보안 그룹", { fs: 14, fw: 700, fill: C.green })}
      {box(340, 110, 140, 110, { stroke: C.ink, sw: 1.6 })}
      {txt(410, 150, "EC2", { fs: 16, fw: 700 })}
      {txt(410, 172, "인스턴스", { fs: 12, fill: C.sub })}

      {/* 인바운드 허용 */}
      {box(30, 70, 180, 58, { stroke: C.green })}
      {txt(120, 92, "허용된 IP · 포트 443", { fs: 12, fw: 600, fill: C.green })}
      {txt(120, 110, "인바운드 규칙에 존재", { fs: 10.5, fill: C.sub })}
      <line
        x1="210"
        y1="99"
        x2="336"
        y2="130"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      {txt(268, 100, "허용 ✓", { fs: 11, fw: 700, fill: C.green })}

      {/* 인바운드 차단 */}
      {box(30, 180, 180, 58, { stroke: C.red })}
      {txt(120, 202, "그 외 모든 트래픽", { fs: 12, fw: 600, fill: C.red })}
      {txt(120, 220, "규칙 없음 = 기본 차단", { fs: 10.5, fill: C.sub })}
      <line
        x1="210"
        y1="209"
        x2="296"
        y2="200"
        stroke={C.red}
        strokeWidth="2"
        strokeDasharray="6 4"
        markerEnd="url(#arrR)"
      />
      {txt(255, 190, "차단 ✕", { fs: 11, fw: 700, fill: C.red })}

      {/* 아웃바운드 */}
      {box(590, 120, 170, 58, { stroke: C.blue })}
      {txt(675, 142, "인터넷 / 외부", { fs: 12, fw: 600, fill: C.blue })}
      {txt(675, 160, "아웃바운드 기본 전체 허용", { fs: 10.5, fill: C.sub })}
      <line
        x1="484"
        y1="149"
        x2="586"
        y2="149"
        stroke={C.blue}
        strokeWidth="2"
        markerEnd="url(#arrB)"
      />

      {/* Stateful 응답 */}
      <path
        d="M 586 168 C 540 200 500 200 486 178"
        fill="none"
        stroke={C.sub}
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#arr)"
      />
      {txt(560, 208, "응답은 규칙 없이 자동 허용 (Stateful)", {
        fs: 10.5,
        fill: C.sub,
      })}

      {/* 특징 요약 */}
      {txt(
        410,
        316,
        "리전·VPC 종속 | 인스턴스 N:M 연결 | 다른 SG를 소스로 참조 가능",
        { fs: 11, fill: C.sub, mono: true },
      )}
    </Diagram>
  );
}

function DiagramSSH() {
  return (
    <Diagram
      vb="0 0 760 200"
      caption="SSH 접속 흐름 — 프라이빗 키는 내 PC, 퍼블릭 키는 인스턴스에 위치"
    >
      {box(40, 60, 190, 90, { stroke: C.ink })}
      {txt(135, 90, "내 컴퓨터", { fs: 14, fw: 700 })}
      {txt(135, 112, "프라이빗 키 (.pem)", {
        fs: 11.5,
        fill: C.blue,
        mono: true,
      })}
      {txt(135, 130, "chmod 400 필수", { fs: 10.5, fill: C.sub })}

      <line
        x1="230"
        y1="105"
        x2="520"
        y2="105"
        stroke={C.blue}
        strokeWidth="2"
        markerEnd="url(#arrB)"
      />
      {box(300, 82, 150, 44, { stroke: C.blue, fill: C.blueSoft })}
      {txt(375, 100, "SSH · 포트 22", {
        fs: 12.5,
        fw: 700,
        fill: C.blue,
        mono: true,
      })}
      {txt(375, 117, "SG 인바운드 22 허용 필요", { fs: 10, fill: C.sub })}

      {box(524, 60, 200, 90, { stroke: C.accent, sw: 1.8 })}
      {txt(624, 90, "EC2 인스턴스", { fs: 14, fw: 700 })}
      {txt(624, 112, "퍼블릭 키 보관", { fs: 11.5, fill: C.accent })}
      {txt(624, 130, "ec2-user @ 퍼블릭 IP", {
        fs: 10.5,
        fill: C.sub,
        mono: true,
      })}
    </Diagram>
  );
}

function DiagramRole() {
  return (
    <Diagram
      vb="0 0 780 320"
      caption="EC2에서 AWS API를 호출할 땐 반드시 IAM Role — 자격 증명 하드코딩은 절대 금지"
    >
      {/* 잘못된 방법 */}
      {box(30, 40, 340, 110, { stroke: C.red, fill: C.redSoft, rx: 12 })}
      {txt(200, 66, "✕ 잘못된 방법", { fs: 13.5, fw: 700, fill: C.red })}
      {txt(200, 92, "인스턴스에서 aws configure 실행", { fs: 12, mono: true })}
      {txt(200, 112, "액세스 키를 인스턴스에 저장", { fs: 12 })}
      {txt(200, 134, "→ 키 유출 위험 · 시험 단골 오답 선택지", {
        fs: 11,
        fill: C.red,
      })}

      {/* 올바른 방법 */}
      {box(410, 40, 340, 110, { stroke: C.green, fill: C.greenSoft, rx: 12 })}
      {txt(580, 66, "✓ 올바른 방법", { fs: 13.5, fw: 700, fill: C.green })}
      {txt(580, 92, "IAM Role을 인스턴스에 연결", { fs: 12, fw: 600 })}
      {txt(580, 112, "임시 자격 증명 자동 발급·교체", { fs: 12 })}
      {txt(580, 134, "인스턴스당 역할 1개 연결 가능", { fs: 11, fill: C.sub })}

      {/* 흐름 */}
      {box(120, 200, 170, 80, { stroke: C.accent, sw: 1.8 })}
      {txt(205, 230, "EC2 인스턴스", { fs: 13.5, fw: 700 })}
      {txt(205, 252, "+ IAM Role", { fs: 12, fill: C.green, fw: 700 })}

      <line
        x1="290"
        y1="240"
        x2="470"
        y2="240"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      {txt(380, 228, "역할 권한으로 API 호출", { fs: 11, fill: C.green })}

      {box(474, 200, 240, 80, { stroke: C.blue })}
      {txt(594, 230, "AWS 서비스", { fs: 13.5, fw: 700, fill: C.blue })}
      {txt(594, 252, "S3 · DynamoDB · IAM 등", { fs: 11.5, fill: C.sub })}
    </Diagram>
  );
}

function DiagramPurchase() {
  const rows = [
    { name: "On-Demand", d: 8, c: 0, note: "약정 없음 · 정가" },
    { name: "Reserved (1·3년)", d: 62, c: 80, note: "최대 -72%" },
    { name: "Savings Plans", d: 62, c: 74, note: "최대 -72% · $단위 약정" },
    { name: "Spot", d: 86, c: 8, note: "최대 -90% · 중단 가능" },
  ];
  return (
    <Diagram
      vb="0 0 780 300"
      caption="할인율 ↔ 약정/제약의 트레이드오프 — 할인이 클수록 유연성이 줄어든다"
    >
      {txt(120, 30, "구매 옵션", { fs: 12, fw: 700, anchor: "start" })}
      {txt(430, 30, "할인율", {
        fs: 11,
        fw: 700,
        fill: C.green,
        anchor: "start",
        mono: true,
      })}
      {txt(620, 30, "약정·제약", {
        fs: 11,
        fw: 700,
        fill: C.red,
        anchor: "start",
        mono: true,
      })}
      {rows.map((r, i) => {
        const y = 62 + i * 58;
        return (
          <g key={r.name}>
            {txt(120, y + 6, r.name, { fs: 13, fw: 600, anchor: "start" })}
            {txt(120, y + 24, r.note, {
              fs: 10.5,
              fill: C.sub,
              anchor: "start",
            })}
            <rect
              x={330}
              y={y - 8}
              width={200}
              height={13}
              rx={6}
              fill={C.line}
            />
            <rect
              x={330}
              y={y - 8}
              width={r.d * 2}
              height={13}
              rx={6}
              fill={C.green}
            />
            <rect
              x={330}
              y={y + 12}
              width={200}
              height={13}
              rx={6}
              fill={C.line}
            />
            <rect
              x={330}
              y={y + 12}
              width={r.c * 2}
              height={13}
              rx={6}
              fill={C.red}
              opacity="0.75"
            />
          </g>
        );
      })}
      {txt(
        390,
        292,
        "그 외: Dedicated Host(물리 서버 전용) · Dedicated Instance(전용 HW) · Capacity Reservation(용량만 예약, 할인 없음)",
        { fs: 10.5, fill: C.sub },
      )}
    </Diagram>
  );
}

function DiagramEBS() {
  return (
    <Diagram
      vb="0 0 780 330"
      caption="EBS는 AZ에 묶인 '네트워크 드라이브' — 같은 AZ의 인스턴스에만 연결, 분리 후 재연결 가능"
    >
      {/* AZ-a */}
      {box(40, 40, 330, 250, { stroke: C.blue, dash: "8 6", rx: 14 })}
      {txt(205, 68, "가용 영역 us-east-1a", {
        fs: 12.5,
        fw: 700,
        fill: C.blue,
        mono: true,
      })}
      {box(80, 100, 120, 74, { stroke: C.ink })}
      {txt(140, 130, "EC2 A", { fs: 13.5, fw: 700 })}
      {box(80, 200, 100, 60, { stroke: C.accent, sw: 1.8, rx: 10 })}
      {txt(130, 224, "EBS ①", { fs: 12.5, fw: 700, fill: C.accent })}
      {txt(130, 242, "10GB", { fs: 10.5, fill: C.sub, mono: true })}
      <line
        x1="130"
        y1="196"
        x2="138"
        y2="178"
        stroke={C.accent}
        strokeWidth="2"
        markerEnd="url(#arrO)"
      />
      {box(230, 200, 100, 60, { stroke: C.accent, sw: 1.8, rx: 10 })}
      {txt(280, 224, "EBS ②", { fs: 12.5, fw: 700, fill: C.accent })}
      {txt(280, 242, "50GB", { fs: 10.5, fill: C.sub, mono: true })}
      <line
        x1="272"
        y1="196"
        x2="176"
        y2="176"
        stroke={C.accent}
        strokeWidth="2"
        markerEnd="url(#arrO)"
      />
      {txt(205, 282, "인스턴스 1대에 볼륨 여러 개 OK", {
        fs: 10.5,
        fill: C.sub,
      })}

      {/* AZ-b */}
      {box(410, 40, 330, 250, { stroke: C.blue, dash: "8 6", rx: 14 })}
      {txt(575, 68, "가용 영역 us-east-1b", {
        fs: 12.5,
        fw: 700,
        fill: C.blue,
        mono: true,
      })}
      {box(450, 100, 120, 74, { stroke: C.ink })}
      {txt(510, 130, "EC2 B", { fs: 13.5, fw: 700 })}
      {box(600, 108, 110, 60, { stroke: C.accent, sw: 1.8, rx: 10 })}
      {txt(655, 132, "EBS ③", { fs: 12.5, fw: 700, fill: C.accent })}
      {txt(655, 150, "미연결 상태 가능", { fs: 10, fill: C.sub })}

      {/* AZ 간 직접 이동 불가 */}
      <line
        x1="330"
        y1="230"
        x2="596"
        y2="230"
        stroke={C.red}
        strokeWidth="2"
        strokeDasharray="7 5"
        markerEnd="url(#arrR)"
      />
      {txt(463, 218, "AZ 간 직접 이동 ✕ → 스냅샷으로 이동", {
        fs: 11,
        fw: 700,
        fill: C.red,
      })}
      {box(600, 204, 110, 56, { stroke: C.red, dash: "4 4", rx: 10 })}
      {txt(655, 236, "연결 불가", { fs: 11.5, fill: C.red, fw: 600 })}
    </Diagram>
  );
}

function DiagramSnapshot() {
  return (
    <Diagram
      vb="0 0 780 250"
      caption="스냅샷 = 특정 시점 백업 — AZ·리전을 넘는 유일한 통로"
    >
      {box(40, 80, 130, 70, { stroke: C.accent, sw: 1.8, rx: 10 })}
      {txt(105, 108, "EBS 볼륨", { fs: 12.5, fw: 700, fill: C.accent })}
      {txt(105, 128, "us-east-1a", { fs: 10.5, fill: C.sub, mono: true })}
      <line
        x1="170"
        y1="115"
        x2="280"
        y2="115"
        stroke={C.sub}
        strokeWidth="2"
        markerEnd="url(#arr)"
      />
      {txt(225, 103, "snapshot", { fs: 10.5, fill: C.sub, mono: true })}

      {box(284, 72, 170, 86, {
        stroke: C.blue,
        sw: 1.8,
        rx: 10,
        fill: C.blueSoft,
      })}
      {txt(369, 100, "EBS 스냅샷", { fs: 13, fw: 700, fill: C.blue })}
      {txt(369, 120, "S3에 저장 (증분 백업)", { fs: 10.5, fill: C.sub })}
      {txt(369, 140, "Archive 계층: -75%↓ 복원 24~72h", {
        fs: 9.8,
        fill: C.sub,
      })}

      <line
        x1="454"
        y1="96"
        x2="580"
        y2="66"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      {box(584, 36, 170, 56, { stroke: C.green, rx: 10 })}
      {txt(669, 58, "다른 AZ에 복원", { fs: 12, fw: 700, fill: C.green })}
      {txt(669, 76, "us-east-1b", { fs: 10.5, fill: C.sub, mono: true })}

      <line
        x1="454"
        y1="134"
        x2="580"
        y2="164"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      {box(584, 140, 170, 56, { stroke: C.green, rx: 10 })}
      {txt(669, 162, "다른 리전에 복사", { fs: 12, fw: 700, fill: C.green })}
      {txt(669, 180, "재해 복구(DR)", { fs: 10.5, fill: C.sub })}

      {txt(
        369,
        226,
        "삭제 실수 방지: Recycle Bin (보존 1일~1년) · 빠른 복원: FSR(Fast Snapshot Restore, 고비용)",
        { fs: 10.8, fill: C.sub },
      )}
    </Diagram>
  );
}

function DiagramAMI() {
  return (
    <Diagram
      vb="0 0 780 220"
      caption="AMI 생성·활용 흐름 — 사전 구성 이미지로 부팅 시간 단축"
    >
      {box(40, 70, 160, 80, { stroke: C.ink })}
      {txt(120, 98, "EC2 인스턴스", { fs: 12.5, fw: 700 })}
      {txt(120, 118, "소프트웨어 설치·설정", { fs: 10.5, fill: C.sub })}
      {txt(120, 134, "완료 상태", { fs: 10.5, fill: C.sub })}

      <line
        x1="200"
        y1="110"
        x2="300"
        y2="110"
        stroke={C.sub}
        strokeWidth="2"
        markerEnd="url(#arr)"
      />
      {txt(250, 98, "이미지 생성", { fs: 10.5, fill: C.sub })}

      {box(304, 62, 180, 96, {
        stroke: C.accent,
        sw: 2,
        rx: 12,
        fill: C.accentSoft,
      })}
      {txt(394, 92, "커스텀 AMI", { fs: 14, fw: 700, fill: C.accent })}
      {txt(394, 112, "OS + 앱 + 설정 스냅샷", { fs: 10.5, fill: C.sub })}
      {txt(394, 130, "리전 종속 · 리전 간 복사 가능", { fs: 10, fill: C.sub })}

      <line
        x1="484"
        y1="88"
        x2="590"
        y2="66"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      <line
        x1="484"
        y1="110"
        x2="590"
        y2="110"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      <line
        x1="484"
        y1="132"
        x2="590"
        y2="154"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      {box(594, 44, 150, 44, { stroke: C.green, rx: 9 })}
      {txt(669, 70, "새 인스턴스 1", { fs: 11.5, fw: 600 })}
      {box(594, 92, 150, 44, { stroke: C.green, rx: 9 })}
      {txt(669, 118, "새 인스턴스 2", { fs: 11.5, fw: 600 })}
      {box(594, 140, 150, 44, { stroke: C.green, rx: 9 })}
      {txt(669, 166, "다른 리전 시작", { fs: 11.5, fw: 600 })}

      {txt(
        390,
        202,
        "종류: 퍼블릭 AMI(AWS 제공) · 프라이빗 AMI(직접 제작) · Marketplace AMI(타사 제작/판매)",
        { fs: 10.8, fill: C.sub },
      )}
    </Diagram>
  );
}

function DiagramStore() {
  return (
    <Diagram
      vb="0 0 780 230"
      caption="EBS(네트워크 연결) vs 인스턴스 스토어(물리 직결·휘발성)"
    >
      {box(60, 50, 300, 140, { stroke: C.ink, rx: 12 })}
      {txt(210, 80, "EBS", { fs: 15, fw: 700 })}
      <line
        x1="120"
        y1="120"
        x2="300"
        y2="120"
        stroke={C.blue}
        strokeWidth="2.5"
        strokeDasharray="8 5"
      />
      {txt(210, 110, "네트워크 연결", { fs: 11, fill: C.blue })}
      {txt(210, 150, "지속성 O · 중지해도 데이터 유지", {
        fs: 11.5,
        fill: C.green,
        fw: 600,
      })}
      {txt(210, 170, "IOPS 상한 존재", { fs: 10.5, fill: C.sub })}

      {box(420, 50, 300, 140, { stroke: C.accent, sw: 2, rx: 12 })}
      {txt(570, 80, "인스턴스 스토어", { fs: 15, fw: 700, fill: C.accent })}
      <line
        x1="480"
        y1="120"
        x2="660"
        y2="120"
        stroke={C.accent}
        strokeWidth="4"
      />
      {txt(570, 110, "하드웨어 물리 직결", { fs: 11, fill: C.accent })}
      {txt(570, 150, "초고성능 I/O (수백만 IOPS 가능)", { fs: 11.5, fw: 600 })}
      {txt(570, 170, "중지·종료 시 데이터 소실 (임시)", {
        fs: 10.5,
        fill: C.red,
        fw: 600,
      })}

      {txt(
        390,
        214,
        "인스턴스 스토어 용도: 버퍼 · 캐시 · 스크래치 데이터 · 임시 콘텐츠 — 장기 저장 ✕, 백업·복제는 사용자 책임",
        { fs: 10.8, fill: C.sub },
      )}
    </Diagram>
  );
}

function DiagramMultiAttach() {
  return (
    <Diagram
      vb="0 0 780 260"
      caption="EBS Multi-Attach — io1/io2 한정, 같은 AZ, 최대 16개 인스턴스 동시 연결"
    >
      {box(60, 30, 660, 200, { stroke: C.blue, dash: "8 6", rx: 14 })}
      {txt(390, 56, "단일 가용 영역 (AZ)", {
        fs: 12.5,
        fw: 700,
        fill: C.blue,
        mono: true,
      })}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {box(120 + i * 190, 80, 140, 56, { stroke: C.ink })}
          {txt(190 + i * 190, 112, `EC2 #${i + 1}`, { fs: 12.5, fw: 700 })}
          <line
            x1={190 + i * 190}
            y1="136"
            x2={370 + (i - 1) * 18}
            y2="178"
            stroke={C.accent}
            strokeWidth="2"
            markerEnd="url(#arrO)"
          />
        </g>
      ))}
      {box(300, 178, 180, 44, {
        stroke: C.accent,
        sw: 2,
        rx: 10,
        fill: C.accentSoft,
      })}
      {txt(390, 198, "io1 / io2 볼륨", { fs: 12.5, fw: 700, fill: C.accent })}
      {txt(390, 214, "동시 읽기·쓰기", { fs: 10, fill: C.sub })}
      {txt(
        390,
        248,
        "클러스터 인식 파일 시스템 필요 (XFS·EXT4 같은 일반 FS ✕)",
        { fs: 11, fill: C.red, fw: 600 },
      )}
    </Diagram>
  );
}

function DiagramEFS() {
  return (
    <Diagram
      vb="0 0 780 300"
      caption="EFS = 다중 AZ에서 수백 대가 동시에 마운트하는 관리형 NFS"
    >
      {box(300, 40, 180, 70, {
        stroke: C.green,
        sw: 2,
        rx: 12,
        fill: C.greenSoft,
      })}
      {txt(390, 68, "Amazon EFS", { fs: 14.5, fw: 700, fill: C.green })}
      {txt(390, 90, "관리형 NFS · 자동 확장", { fs: 10.5, fill: C.sub })}

      {[
        { x: 60, az: "AZ-a" },
        { x: 320, az: "AZ-b" },
        { x: 580, az: "AZ-c" },
      ].map((z, i) => (
        <g key={z.az}>
          {box(z.x, 150, 140, 110, { stroke: C.blue, dash: "7 5", rx: 12 })}
          {txt(z.x + 70, 174, z.az, {
            fs: 11.5,
            fw: 700,
            fill: C.blue,
            mono: true,
          })}
          {box(z.x + 22, 190, 96, 52, { stroke: C.ink })}
          {txt(z.x + 70, 212, "EC2", { fs: 12, fw: 700 })}
          {txt(z.x + 70, 230, "Linux 전용", { fs: 9.5, fill: C.sub })}
          <line
            x1={z.x + 70}
            y1="188"
            x2={i === 0 ? 320 : i === 1 ? 390 : 460}
            y2="112"
            stroke={C.green}
            strokeWidth="2"
            markerEnd="url(#arrG)"
          />
        </g>
      ))}
      {txt(
        390,
        288,
        "동시 접속 수백 클라이언트 · 10GB+/s 처리량 · POSIX 파일 시스템 · SG로 접근 제어 · 사용량 기반 과금",
        { fs: 10.8, fill: C.sub },
      )}
    </Diagram>
  );
}

function DiagramEFSvsEBS() {
  return (
    <Diagram
      vb="0 0 780 280"
      caption="시험 최빈출 비교 — 연결 범위가 결정적 차이"
    >
      {/* EBS side */}
      {box(40, 40, 330, 200, { stroke: C.accent, sw: 1.8, rx: 14 })}
      {txt(205, 68, "EBS", { fs: 15, fw: 700, fill: C.accent })}
      {box(90, 90, 100, 90, { stroke: C.blue, dash: "6 4", rx: 10 })}
      {txt(140, 112, "AZ-a", { fs: 10.5, fill: C.blue, mono: true })}
      {box(105, 122, 70, 44, { stroke: C.ink })}
      {txt(140, 148, "EC2 1대", { fs: 10.5, fw: 600 })}
      {box(230, 118, 90, 50, { stroke: C.accent, rx: 9 })}
      {txt(275, 147, "볼륨", { fs: 11.5, fw: 700, fill: C.accent })}
      <line
        x1="226"
        y1="143"
        x2="180"
        y2="143"
        stroke={C.accent}
        strokeWidth="2"
        markerEnd="url(#arrO)"
      />
      {txt(205, 208, "1 AZ · (기본) 1 인스턴스", { fs: 11.5, fw: 600 })}
      {txt(205, 226, "네트워크 블록 스토리지", { fs: 10.5, fill: C.sub })}

      {/* EFS side */}
      {box(410, 40, 330, 200, { stroke: C.green, sw: 1.8, rx: 14 })}
      {txt(575, 68, "EFS", { fs: 15, fw: 700, fill: C.green })}
      {box(455, 96, 100, 44, { stroke: C.blue, dash: "6 4", rx: 9 })}
      {txt(505, 122, "AZ-a EC2들", { fs: 10, fill: C.blue })}
      {box(455, 150, 100, 44, { stroke: C.blue, dash: "6 4", rx: 9 })}
      {txt(505, 176, "AZ-b EC2들", { fs: 10, fill: C.blue })}
      {box(610, 118, 100, 56, { stroke: C.green, rx: 10, fill: C.greenSoft })}
      {txt(660, 143, "파일", { fs: 11.5, fw: 700, fill: C.green })}
      {txt(660, 160, "시스템", { fs: 11.5, fw: 700, fill: C.green })}
      <line
        x1="606"
        y1="132"
        x2="559"
        y2="118"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      <line
        x1="606"
        y1="160"
        x2="559"
        y2="172"
        stroke={C.green}
        strokeWidth="2"
        markerEnd="url(#arrG)"
      />
      {txt(575, 208, "다중 AZ · 수백 인스턴스 공유", { fs: 11.5, fw: 600 })}
      {txt(575, 226, "네트워크 파일 시스템 (Linux만)", {
        fs: 10.5,
        fill: C.sub,
      })}
    </Diagram>
  );
}

/* ═══════════ 섹션 정의 ═══════════ */

const NAV = [
  { id: "map", label: "빈출 맵" },
  { id: "budget", label: "31 예산" },
  { id: "basics", label: "32 EC2 기초" },
  { id: "types", label: "34 인스턴스 유형" },
  { id: "sg", label: "35 보안 그룹" },
  { id: "ssh", label: "37~42 SSH" },
  { id: "role", label: "43 IAM 역할" },
  { id: "purchase", label: "44 구매 옵션" },
  { id: "ip", label: "45 IPv4 요금" },
  { id: "ebs", label: "46 EBS" },
  { id: "snap", label: "48 스냅샷" },
  { id: "ami", label: "50 AMI" },
  { id: "store", label: "52 인스턴스 스토어" },
  { id: "voltype", label: "53 볼륨 유형" },
  { id: "multi", label: "54 다중 연결" },
  { id: "efs", label: "55 EFS" },
  { id: "vs", label: "57 EFS vs EBS" },
];

const FREQ_MAP = [
  { id: "sg", t: "보안 그룹 (문제 해결 시나리오)", f: 5 },
  { id: "role", t: "EC2 IAM 인스턴스 역할", f: 5 },
  { id: "vs", t: "EFS vs EBS vs 인스턴스 스토어 비교", f: 5 },
  { id: "ebs", t: "EBS 개요 · AZ 종속성", f: 4 },
  { id: "voltype", t: "EBS 볼륨 유형 (gp3 / io2)", f: 4 },
  { id: "efs", t: "EFS 특성 (다중 AZ · Linux)", f: 4 },
  { id: "basics", t: "EC2 기초 · User Data", f: 3 },
  { id: "types", t: "인스턴스 유형 패밀리", f: 3 },
  { id: "purchase", t: "구매 옵션 (Spot · RI · SP)", f: 3 },
  { id: "snap", t: "EBS 스냅샷 · Archive · Recycle Bin", f: 3 },
  { id: "ami", t: "AMI", f: 3 },
  { id: "store", t: "인스턴스 스토어 (임시성)", f: 3 },
  { id: "ssh", t: "SSH · Instance Connect", f: 2 },
  { id: "multi", t: "EBS Multi-Attach", f: 2 },
  { id: "budget", t: "AWS 예산 설정", f: 1 },
  { id: "ip", t: "퍼블릭 IPv4 요금", f: 1 },
];

export default function App() {
  const [active, setActive] = useState("map");
  const refMap = useRef({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    Object.values(refMap.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id) => {
    refMap.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        background: C.paper,
        color: C.ink,
        minHeight: "100vh",
        fontFamily: "'IBM Plex Sans KR', 'Apple SD Gothic Neo', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background:${C.accentSoft}; }
        .navpill { border:1px solid ${C.line}; background:#fff; border-radius:999px; padding:6px 13px;
          font-size:12px; font-family:${C.mono}; cursor:pointer; white-space:nowrap; color:${C.sub};
          transition: all .15s; font-weight:500; }
        .navpill:hover { border-color:${C.ink}; color:${C.ink}; }
        .navpill.on { background:${C.ink}; color:#fff; border-color:${C.ink}; }
        .navpill:focus-visible { outline:2px solid ${C.accent}; outline-offset:2px; }
        ul.tight { margin:6px 0; padding-left:20px; }
        ul.tight li { margin-bottom:5px; line-height:1.65; font-size:14px; }
        .freqrow { display:flex; align-items:center; gap:12px; padding:8px 12px; border-radius:8px;
          cursor:pointer; transition:background .15s; }
        .freqrow:hover { background:${C.blueSoft}; }
        @media (prefers-reduced-motion: reduce) { * { scroll-behavior:auto !important; transition:none !important; } }
      `}</style>

      {/* ── 헤더 ── */}
      <header
        style={{ maxWidth: 960, margin: "0 auto", padding: "44px 20px 10px" }}
      >
        <div
          style={{
            fontFamily: C.mono,
            fontSize: 12,
            color: C.accent,
            fontWeight: 700,
            letterSpacing: ".14em",
          }}
        >
          AWS CERTIFIED DEVELOPER — ASSOCIATE (DVA-C02)
        </div>
        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 44px)",
            fontWeight: 700,
            margin: "8px 0 10px",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          EC2 기초 & 데이터 관리
          <span
            style={{
              color: C.sub,
              fontWeight: 500,
              fontSize: "0.55em",
              marginLeft: 12,
            }}
          >
            강의 31–58 · 실습 제외 전체 개념
          </span>
        </h1>
        <p
          style={{
            color: C.sub,
            fontSize: 14.5,
            lineHeight: 1.7,
            maxWidth: 720,
            margin: 0,
          }}
        >
          각 주제 옆의 <FreqGauge level={4} compact /> 게이지는 DVA 시험에서의{" "}
          <b style={{ color: C.ink }}>추정 출제빈도</b>입니다 (공식 통계가 아닌
          기출 경향 기반 추정). 게이지가 높은 주제부터 확실히 잡으세요.
        </p>
      </header>

      {/* ── 고정 내비게이션 ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(246,247,249,.92)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${C.line}`,
          padding: "10px 0",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: 7,
            overflowX: "auto",
          }}
        >
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`navpill ${active === n.id ? "on" : ""}`}
              onClick={() => go(n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <main
        style={{ maxWidth: 960, margin: "0 auto", padding: "34px 20px 80px" }}
      >
        {/* ════ 빈출 맵 ════ */}
        <Section
          id="map"
          no="OVERVIEW"
          title="출제빈도 맵 — 무엇부터 볼까"
          freq={5}
          refMap={refMap}
        >
          <Card>
            <div style={{ fontSize: 13.5, color: C.sub, marginBottom: 10 }}>
              클릭하면 해당 섹션으로 이동합니다. DVA는 SAA와 달리 인프라
              설계보다 <b style={{ color: C.ink }}>개발자 관점의 문제 해결</b>
              (자격 증명 관리, 접속 오류 원인, 스토리지 선택)을 묻는 경향이
              강합니다.
            </div>
            {FREQ_MAP.map((r) => (
              <div
                key={r.id}
                className="freqrow"
                onClick={() => go(r.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && go(r.id)}
              >
                <FreqGauge level={r.f} compact />
                <span
                  style={{ fontSize: 14, fontWeight: r.f >= 4 ? 600 : 400 }}
                >
                  {r.t}
                </span>
              </div>
            ))}
          </Card>
        </Section>

        {/* ════ 31 예산 ════ */}
        <Section
          id="budget"
          no="LECTURE 31"
          title="AWS 예산 설정 (Budgets)"
          freq={1}
          refMap={refMap}
        >
          <Card>
            EC2 실습을 시작하기 전 <b>비용 사고를 막기 위한 안전장치</b>를
            설정하는 파트입니다. 시험 출제 비중은 낮지만 실무 필수 습관입니다.
            <ul className="tight">
              <li>
                <b>Billing 콘솔 접근 권한</b>: 기본적으로 IAM 사용자는 결제
                정보를 볼 수 없음 → 루트 계정에서{" "}
                <Mono>IAM user access to billing</Mono> 활성화 필요
              </li>
              <li>
                <b>Bills</b>: 서비스별·리전별 실제 청구 내역 확인
              </li>
              <li>
                <b>Free Tier 대시보드</b>: 프리티어 사용량과 초과 예상치 확인
              </li>
              <li>
                <b>AWS Budgets</b>: 예산(예: $10) 설정 후 실제/예측 사용량이
                임계치(예: 50%, 85%, 100%)를 넘으면 이메일 알림 — Zero spend
                budget 템플릿으로 "1원이라도 나가면 알림" 구성 가능
              </li>
            </ul>
          </Card>
        </Section>

        {/* ════ 32 EC2 기초 ════ */}
        <Section
          id="basics"
          no="LECTURE 32–33"
          title="EC2 기초 & User Data"
          freq={3}
          refMap={refMap}
        >
          <Card>
            <b>EC2 (Elastic Compute Cloud)</b>는 AWS의 대표적인 <b>IaaS</b>
            (Infrastructure as a Service)로, 클라우드에서 가상 서버를 임대하는
            서비스입니다. 넓게 보면 EC2라는 이름 아래 다음이 묶입니다.
            <ul className="tight">
              <li>
                가상 머신 임대 → <b>EC2 인스턴스</b>
              </li>
              <li>
                가상 드라이브 저장 → <b>EBS</b>
              </li>
              <li>
                부하 분산 → <b>ELB</b> (Elastic Load Balancer)
              </li>
              <li>
                자동 확장 → <b>ASG</b> (Auto Scaling Group)
              </li>
            </ul>
          </Card>
          <DiagramEC2 />
          <Card>
            <b>사이징 & 구성 시 선택하는 것들</b>
            <ul className="tight">
              <li>운영체제: Linux(시험·실무 최다) / Windows / macOS</li>
              <li>컴퓨팅 파워: vCPU 수, 메모리(RAM) 크기</li>
              <li>
                스토리지: 네트워크 연결형(EBS·EFS) 또는 하드웨어 직결형(인스턴스
                스토어)
              </li>
              <li>네트워크 카드 속도, 퍼블릭 IP 여부</li>
              <li>
                방화벽 규칙 → <b>보안 그룹</b>
              </li>
              <li>
                부트스트랩 스크립트 → <b>EC2 User Data</b>
              </li>
            </ul>
          </Card>
          <Card>
            <b>EC2 User Data</b>
            <ul className="tight">
              <li>
                인스턴스 <b>최초 부팅 시 딱 1회</b> 실행되는 스크립트
                (부트스트래핑)
              </li>
              <li>
                <b>root 사용자 권한</b>으로 실행됨 (명령에 sudo 개념 포함)
              </li>
              <li>
                용도: 패키지 업데이트, 소프트웨어 설치(예: httpd 웹 서버), 파일
                다운로드 등 부팅 자동화
              </li>
              <li>
                스크립트가 길수록 부팅이 느려짐 → 반복 사용 시 AMI로 굽는 게
                효율적
              </li>
            </ul>
          </Card>
          <ExamTip>
            "인스턴스 시작 시 자동으로 웹 서버를 설치하려면?" → <b>User Data</b>
            . "매 부팅마다"가 아니라 <b>첫 부팅 1회</b>라는 점,{" "}
            <b>root로 실행</b>된다는 점이 함정 포인트입니다.
          </ExamTip>
        </Section>

        {/* ════ 34 인스턴스 유형 ════ */}
        <Section
          id="types"
          no="LECTURE 34"
          title="EC2 인스턴스 유형"
          freq={3}
          refMap={refMap}
        >
          <DiagramNaming />
          <Table
            head={["패밀리", "약자 예시", "특징", "대표 사용 사례"]}
            rows={[
              [
                <b>범용 (General Purpose)</b>,
                <Mono>t2, t3, m5</Mono>,
                "컴퓨팅·메모리·네트워크 균형",
                "웹 서버, 코드 리포지토리, 개발 환경",
              ],
              [
                <b>컴퓨팅 최적화 (Compute)</b>,
                <Mono>c5, c6g</Mono>,
                "고성능 프로세서",
                "배치 처리, 미디어 트랜스코딩, HPC, 게임 서버, ML 추론",
              ],
              [
                <b>메모리 최적화 (Memory)</b>,
                <Mono>r5, x1, z1d</Mono>,
                "대용량 RAM",
                "인메모리 DB(Redis), 대규모 관계형/NoSQL DB, BI, 실시간 빅데이터 처리",
              ],
              [
                <b>스토리지 최적화 (Storage)</b>,
                <Mono>i3, d2, h1</Mono>,
                "로컬 스토리지 고속 I/O",
                "OLTP 시스템, NoSQL DB, 캐시, 데이터 웨어하우스, 분산 파일 시스템",
              ],
            ]}
          />
          <ExamTip>
            사용 사례 → 패밀리를 매칭하는 문제가 나옵니다.{" "}
            <b>인메모리 = R(메모리)</b>, <b>배치/트랜스코딩 = C(컴퓨팅)</b>,{" "}
            <b>고속 로컬 I/O = I(스토리지)</b>만 기억해도 대부분 풀립니다. 무료
            티어는 <Mono>t2.micro</Mono>(월 750시간).
          </ExamTip>
        </Section>

        {/* ════ 35 보안 그룹 ════ */}
        <Section
          id="sg"
          no="LECTURE 35–36"
          title="보안 그룹 & 클래식 포트"
          freq={5}
          refMap={refMap}
        >
          <DiagramSG />
          <Card>
            <b>핵심 특성</b>
            <ul className="tight">
              <li>
                <b>허용(Allow) 규칙만</b> 존재 — 거부 규칙 없음 (거부가 필요하면
                NACL)
              </li>
              <li>
                <b>인바운드: 기본 전체 차단</b> /{" "}
                <b>아웃바운드: 기본 전체 허용</b>
              </li>
              <li>
                <b>Stateful</b>: 나간 요청의 응답은 인바운드 규칙 없이도 자동
                허용
              </li>
              <li>
                규칙 소스로 IP(CIDR)뿐 아니라 <b>다른 보안 그룹을 참조</b> 가능
                → 로드밸런서↔인스턴스 연결에 자주 사용
              </li>
              <li>
                보안 그룹 1개 ↔ 인스턴스 여러 개, 인스턴스 1개 ↔ 보안 그룹 여러
                개 (N:M)
              </li>
              <li>
                <b>리전·VPC 종속</b> — 리전 바뀌면 새로 생성
              </li>
              <li>
                인스턴스 "외부"에서 동작 — 차단된 트래픽은 인스턴스에 도달조차
                못 함
              </li>
              <li>
                SSH 접속용 보안 그룹은 별도로 분리 관리하는 것이 모범 사례
              </li>
            </ul>
          </Card>
          <Card tone="warn">
            <b>접속 오류 진단 (초빈출)</b>
            <ul className="tight">
              <li>
                접속 시 <b>Timeout(시간 초과)</b> → 100% <b>보안 그룹 문제</b>{" "}
                (규칙이 트래픽을 막는 중)
              </li>
              <li>
                <b>Connection refused(연결 거부)</b> → 보안 그룹은 통과했고,{" "}
                <b>애플리케이션 문제</b>(서비스 미실행 등)
              </li>
            </ul>
          </Card>
          <Table
            head={["포트", "프로토콜", "용도"]}
            widths={[70, 110]}
            rows={[
              [
                <Mono>22</Mono>,
                "SSH",
                "Linux 인스턴스 원격 접속 (Secure Shell)",
              ],
              [<Mono>21</Mono>, "FTP", "파일 전송 (File Transfer Protocol)"],
              [
                <Mono>22</Mono>,
                "SFTP",
                "SSH 기반 파일 전송 — SSH와 같은 22번 포트",
              ],
              [<Mono>80</Mono>, "HTTP", "비보안 웹 트래픽"],
              [<Mono>443</Mono>, "HTTPS", "보안 웹 트래픽"],
              [<Mono>3389</Mono>, "RDP", "Windows 인스턴스 원격 데스크톱"],
            ]}
          />
          <ExamTip>
            "Timeout = 보안 그룹, Refused = 애플리케이션" 공식과 클래식 포트
            번호(특히 22 / 443 / 3389)는 반드시 암기하세요.
          </ExamTip>
        </Section>

        {/* ════ 37~42 SSH ════ */}
        <Section
          id="ssh"
          no="LECTURE 37–42"
          title="SSH & EC2 Instance Connect"
          freq={2}
          refMap={refMap}
        >
          <DiagramSSH />
          <Card>
            <b>SSH 개요</b>
            <ul className="tight">
              <li>
                <b>포트 22</b>로 인스턴스의 터미널을 원격 제어 — 보안 그룹
                인바운드에 22 허용 필수
              </li>
              <li>
                키 페어: 생성 시 프라이빗 키(<Mono>.pem</Mono> —
                Mac/Linux/Win10+, <Mono>.ppk</Mono> — 구형 PuTTY)를 다운로드
              </li>
              <li>
                접속 명령: <Mono>ssh -i mykey.pem ec2-user@퍼블릭IP</Mono>
              </li>
              <li>
                OS별 도구: Linux/Mac/Windows 10+ → 기본 ssh 명령 · 구형 Windows
                → PuTTY
              </li>
            </ul>
          </Card>
          <Card>
            <b>SSH 문제 해결 체크리스트</b>
            <ul className="tight">
              <li>
                <Mono>Permission denied (publickey)</Mono> → 잘못된 키 또는
                잘못된 사용자명(Amazon Linux는 <Mono>ec2-user</Mono>)
              </li>
              <li>
                <Mono>UNPROTECTED PRIVATE KEY FILE</Mono> →{" "}
                <Mono>chmod 400 mykey.pem</Mono> 으로 권한 축소
              </li>
              <li>Timeout → 보안 그룹 22번 미허용, 또는 회사 방화벽</li>
              <li>
                퍼블릭 IP는 <b>중지 후 재시작 시 변경</b>됨 — 이전 IP로 접속하면
                실패
              </li>
            </ul>
          </Card>
          <Card tone="good">
            <b>EC2 Instance Connect</b>
            <ul className="tight">
              <li>
                브라우저에서 클릭만으로 접속 — 키 파일 관리 불필요 (
                <b>일회용 임시 키</b>를 AWS가 자동 주입)
              </li>
              <li>Amazon Linux 2 / Ubuntu 등에서 기본 지원</li>
              <li>
                여전히 내부적으로 SSH를 쓰므로 <b>보안 그룹 22번 허용은 필요</b>{" "}
                (함정 포인트)
              </li>
            </ul>
          </Card>
        </Section>

        {/* ════ 43 IAM 역할 ════ */}
        <Section
          id="role"
          no="LECTURE 43"
          title="EC2 IAM 인스턴스 역할"
          freq={5}
          refMap={refMap}
        >
          <DiagramRole />
          <Card>
            <ul className="tight">
              <li>
                인스턴스 안에서 <Mono>aws configure</Mono>로 액세스 키를
                입력하면 <b>키가 인스턴스에 평문 저장</b> — 다른 사용자가 조회
                가능, 유출 시 계정 전체 위험
              </li>
              <li>
                대신 <b>IAM Role</b>을 인스턴스에 연결하면 AWS가{" "}
                <b>임시 자격 증명을 자동 발급·순환</b>
              </li>
              <li>
                연결된 역할의 권한 범위 내에서만 <Mono>aws iam list-users</Mono>{" "}
                같은 CLI/API 호출 가능
              </li>
              <li>역할 정책 변경은 즉시는 아니지만 짧은 시간 내 반영됨</li>
              <li>
                인스턴스에는 <b>동시에 하나의 역할만</b> 연결 가능 (역할 교체는
                가능)
              </li>
            </ul>
          </Card>
          <ExamTip>
            DVA 전 영역을 관통하는 원칙:{" "}
            <b>
              "EC2(또는 Lambda, ECS)에서 AWS 자격 증명이 필요하면 답은 항상 IAM
              Role"
            </b>
            . 액세스 키를 코드·환경변수·인스턴스에 넣는 선택지는 전부
            오답입니다.
          </ExamTip>
        </Section>

        {/* ════ 44 구매 옵션 ════ */}
        <Section
          id="purchase"
          no="LECTURE 44"
          title="EC2 인스턴스 구매 옵션"
          freq={3}
          refMap={refMap}
        >
          <DiagramPurchase />
          <Table
            head={["옵션", "할인", "핵심 조건", "적합한 워크로드"]}
            rows={[
              [
                <b>On-Demand</b>,
                "없음 (정가)",
                "약정 없음 · Linux/Windows는 초당 과금(최소 1분), 기타 OS는 시간당",
                "짧고 예측 불가능한 워크로드, 중단 불가 작업",
              ],
              [
                <b>Reserved Instances</b>,
                "최대 ~72%",
                "1년/3년 약정 · 인스턴스 속성(유형·리전·테넌시·OS) 고정 · 선결제일수록 할인↑ · RI 마켓플레이스에서 매매 가능",
                "장기간 안정적 사용 — 대표적으로 데이터베이스",
              ],
              [
                <b>Convertible RI</b>,
                "최대 ~66%",
                "약정 중 유형·패밀리·OS·테넌시 변경 가능",
                "장기 사용 + 유연성 필요",
              ],
              [
                <b>Savings Plans</b>,
                "최대 ~72%",
                "1년/3년간 시간당 $금액 약정 · 패밀리+리전 고정, 크기·OS·테넌시는 유연 · 초과분은 온디맨드 요금",
                "장기 사용 + 인스턴스 크기 유연성",
              ],
              [
                <b>Spot Instances</b>,
                "최대 ~90%",
                "내 최대 가격 < 스팟 가격이 되면 언제든 회수(2분 통보)",
                "배치 작업, 데이터 분석, 이미지 처리, 장애 허용 분산 워크로드 — 중요 작업·DB에는 ✕",
              ],
              [
                <b>Dedicated Hosts</b>,
                "-",
                "물리 서버 전체 예약 · 소켓/코어 단위 라이선스(BYOL) · 규정 준수 요건 대응 · 가장 비쌈",
                "라이선스 제약, 컴플라이언스",
              ],
              [
                <b>Dedicated Instances</b>,
                "-",
                "전용 하드웨어에서 실행되지만 배치(placement) 제어권 없음",
                "하드웨어 격리만 필요할 때",
              ],
              [
                <b>Capacity Reservations</b>,
                "없음",
                "특정 AZ의 용량을 기간 약정 없이 예약 · 사용 안 해도 과금",
                "특정 AZ에서 용량 확보가 반드시 필요한 단기 작업",
              ],
            ]}
          />
          <Card>
            <b>호텔 비유 (강의 암기법)</b> — On-Demand: 정가로 아무 때나 투숙 ·
            Reserved: 장기 예약 할인 · Savings Plans: 기간 동안 일정 금액
            지불하고 방 등급은 유연 · Spot: 빈방 초특가지만 언제든 쫓겨날 수
            있음 · Dedicated Host: 건물 전체 대관 · Capacity Reservation: 방을
            잡아두고 안 자도 돈은 냄.
          </Card>
          <ExamTip>
            "중단돼도 괜찮은 저비용 배치 작업" → <b>Spot</b> · "1년 이상 꾸준히
            도는 DB" → <b>Reserved</b> · "BYOL/규정 준수" →{" "}
            <b>Dedicated Host</b>. 시나리오→옵션 매칭이 출제 패턴입니다.
          </ExamTip>
        </Section>

        {/* ════ 45 IPv4 ════ */}
        <Section
          id="ip"
          no="LECTURE 45"
          title="AWS의 퍼블릭 IPv4 요금"
          freq={1}
          refMap={refMap}
        >
          <Card>
            <ul className="tight">
              <li>
                2024년 2월부터 <b>모든 퍼블릭 IPv4 주소에 시간당 $0.005</b> 부과
                (월 약 $3.6/개) — 서비스 불문(EC2, RDS, 로드밸런서 등)
              </li>
              <li>배경: IPv4 주소 고갈로 조달 비용 상승 → IPv6 전환 유도</li>
              <li>
                EC2 프리티어: 신규 계정 기준 월 750시간의 퍼블릭 IPv4 무료 제공
                — 인스턴스 2대를 동시에 켜면 750시간을 초과해 과금 발생 가능
              </li>
              <li>
                IPv6를 쓰면 이 요금이 없지만, 많은 가정용 ISP가 아직 IPv6 미지원
              </li>
              <li>
                Billing 콘솔에서 <b>퍼블릭 IP 인사이트</b>로 사용 중인 IPv4 확인
                가능
              </li>
            </ul>
          </Card>
        </Section>

        {/* ════ 46 EBS ════ */}
        <Section
          id="ebs"
          no="LECTURE 46–47"
          title="EBS (Elastic Block Store) 개요"
          freq={4}
          refMap={refMap}
        >
          <DiagramEBS />
          <Card>
            <ul className="tight">
              <li>
                인스턴스에 연결하는 <b>네트워크 드라이브</b> — 물리 연결이
                아니라 네트워크 통신(약간의 지연 존재)
              </li>
              <li>
                인스턴스 <b>종료 후에도 데이터 유지</b> 가능 → 지속성 스토리지
              </li>
              <li>
                <b>특정 AZ에 종속</b> — 다른 AZ 인스턴스에 연결 불가, 이동하려면
                스냅샷 사용
              </li>
              <li>
                (gp 계열 기준) <b>한 번에 하나의 인스턴스</b>에만 연결 ·
                인스턴스는 볼륨 여러 개 보유 가능
              </li>
              <li>연결 안 된 채로 존재 가능("네트워크 USB"), 필요 시 탈착</li>
              <li>
                <b>용량·IOPS를 미리 프로비저닝</b>하고 그만큼 과금 — 나중에 증설
                가능
              </li>
            </ul>
          </Card>
          <Card tone="warn">
            <b>Delete on Termination 속성</b>
            <ul className="tight">
              <li>
                <b>루트 볼륨: 기본 ✓ (인스턴스 종료 시 함께 삭제)</b>
              </li>
              <li>추가(비루트) 볼륨: 기본 ✕ (유지)</li>
              <li>
                시험 시나리오: "종료 후에도 루트 볼륨 데이터를 보존하려면?" →
                루트 볼륨의 Delete on Termination을 <b>비활성화</b>
              </li>
            </ul>
          </Card>
        </Section>

        {/* ════ 48 스냅샷 ════ */}
        <Section
          id="snap"
          no="LECTURE 48–49"
          title="EBS 스냅샷"
          freq={3}
          refMap={refMap}
        >
          <DiagramSnapshot />
          <Card>
            <ul className="tight">
              <li>
                볼륨의 <b>특정 시점 백업</b> — 볼륨을 분리(detach)하지 않아도
                가능하지만 분리 후 백업이 권장
              </li>
              <li>
                <b>AZ·리전 간 복사 가능</b> → EBS를 다른 AZ/리전으로 옮기는 표준
                방법
              </li>
              <li>
                <b>EBS Snapshot Archive</b>: 아카이브 계층으로 이동 시 최대{" "}
                <b>75% 저렴</b>, 대신 복원에 <b>24~72시간</b>
              </li>
              <li>
                <b>Recycle Bin(휴지통)</b>: 삭제된 스냅샷을 지정 기간(
                <b>1일~1년</b>) 보존해 실수 삭제로부터 복구
              </li>
              <li>
                <b>FSR (Fast Snapshot Restore)</b>: 스냅샷을 완전 초기화해 첫
                사용부터 지연 없음 — 비용이 높음
              </li>
            </ul>
          </Card>
          <ExamTip>
            "볼륨을 다른 AZ로 옮겨라" →{" "}
            <b>스냅샷 생성 → 대상 AZ에서 볼륨 복원</b>. "복원이 느려도 저렴하게
            보관" → <b>Archive</b>. "실수 삭제 방지" → <b>Recycle Bin</b>.
          </ExamTip>
        </Section>

        {/* ════ 50 AMI ════ */}
        <Section
          id="ami"
          no="LECTURE 50–51"
          title="AMI (Amazon Machine Image)"
          freq={3}
          refMap={refMap}
        >
          <DiagramAMI />
          <Card>
            <ul className="tight">
              <li>
                인스턴스의 <b>커스터마이징 이미지</b> — OS + 소프트웨어 + 설정 +
                모니터링 도구까지 통째로 저장
              </li>
              <li>
                사전 패키징이므로 User Data로 매번 설치하는 것보다{" "}
                <b>부팅이 빠름</b>
              </li>
              <li>
                <b>특정 리전에 종속</b>되지만 리전 간 <b>복사 가능</b> → 글로벌
                배포·DR에 활용
              </li>
              <li>
                종류: <b>퍼블릭 AMI</b>(AWS 제공, 예: Amazon Linux 2) ·{" "}
                <b>프라이빗 AMI</b>(직접 제작·유지관리) · <b>Marketplace AMI</b>
                (타사가 제작·판매)
              </li>
              <li>
                제작 절차: 인스턴스 구성 → 중지(데이터 무결성) → AMI
                생성(내부적으로 EBS 스냅샷 생성) → AMI로 신규 인스턴스 시작
              </li>
            </ul>
          </Card>
        </Section>

        {/* ════ 52 인스턴스 스토어 ════ */}
        <Section
          id="store"
          no="LECTURE 52"
          title="EC2 인스턴스 스토어"
          freq={3}
          refMap={refMap}
        >
          <DiagramStore />
          <Card>
            <ul className="tight">
              <li>
                호스트 서버에 <b>물리적으로 직결된 디스크</b> → 네트워크 EBS보다
                훨씬 높은 I/O 성능 (수백만 IOPS 가능)
              </li>
              <li>
                <b>임시(ephemeral) 스토리지</b>: 인스턴스{" "}
                <b>중지·종료 시 데이터 소실</b>, 하드웨어 장애 시에도 손실 위험
              </li>
              <li>
                백업·복제는 전적으로 <b>사용자 책임</b>
              </li>
              <li>용도: 버퍼, 캐시, 스크래치 데이터, 임시 콘텐츠</li>
            </ul>
          </Card>
          <ExamTip>
            "가장 높은 디스크 I/O 성능이 필요하다" → <b>인스턴스 스토어</b>. 단,
            "데이터가 유지되어야 한다"는 조건이 붙으면 오답 — 그땐{" "}
            <b>io2 EBS</b>가 정답입니다.
          </ExamTip>
        </Section>

        {/* ════ 53 볼륨 유형 ════ */}
        <Section
          id="voltype"
          no="LECTURE 53"
          title="EBS 볼륨 유형 6가지"
          freq={4}
          refMap={refMap}
        >
          <Table
            head={["유형", "매체", "성능 요약", "특징 · 사용 사례"]}
            rows={[
              [
                <b>gp3</b>,
                "SSD",
                <span>
                  기본 3,000 IOPS / 125MB/s → 최대 <b>16,000 IOPS</b> /
                  1,000MB/s
                </span>,
                <span>
                  최신 범용. <b>IOPS·처리량을 크기와 독립적으로</b> 설정 가능.
                  부팅 볼륨 ✓
                </span>,
              ],
              [
                <b>gp2</b>,
                "SSD",
                <span>
                  크기 연동: 3 IOPS/GB, 버스트 3,000, 최대 16,000 IOPS (약
                  5,334GB에서 도달)
                </span>,
                <span>
                  구형 범용. <b>IOPS가 크기에 종속</b>. 부팅 볼륨 ✓
                </span>,
              ],
              [
                <b>io1</b>,
                "SSD",
                "프로비저닝 IOPS 최대 64,000 (Nitro 인스턴스)",
                <span>
                  고성능·저지연. 16,000 IOPS 초과 필요 시. DB 워크로드. 부팅 ✓ ·{" "}
                  <b>Multi-Attach ✓</b>
                </span>,
              ],
              [
                <b>io2 Block Express</b>,
                "SSD",
                <span>
                  최대 <b>256,000 IOPS</b>, 서브밀리초 지연 (1,000 IOPS/GB)
                </span>,
                <span>
                  최고 성능·내구성. 미션 크리티컬 DB. 부팅 ✓ ·{" "}
                  <b>Multi-Attach ✓</b>
                </span>,
              ],
              [
                <b>st1</b>,
                "HDD",
                "최대 500 IOPS / 500MB/s",
                "처리량 최적화 HDD. 빅데이터, 데이터 웨어하우스, 로그 처리. 부팅 ✕",
              ],
              [
                <b>sc1</b>,
                "HDD",
                "최대 250 IOPS / 250MB/s",
                "콜드 HDD — 최저 비용. 접근 빈도 낮은 아카이브. 부팅 ✕",
              ],
            ]}
          />
          <Card tone="warn">
            <b>부팅(루트) 볼륨 가능 유형: gp2 · gp3 · io1 · io2 뿐</b> —
            HDD(st1, sc1)는 부팅 불가. 이것 자체가 시험 문제로 나옵니다.
          </Card>
          <ExamTip>
            gp2 vs gp3 구분: <b>gp3는 IOPS와 크기가 독립</b>(비용 최적화
            정답으로 자주 등장), gp2는 크기를 키워야 IOPS가 올라감. "32,000 IOPS
            이상 필요" → gp 계열 탈락, <b>io1/io2 + Nitro</b>.
          </ExamTip>
        </Section>

        {/* ════ 54 다중 연결 ════ */}
        <Section
          id="multi"
          no="LECTURE 54"
          title="EBS Multi-Attach"
          freq={2}
          refMap={refMap}
        >
          <DiagramMultiAttach />
          <Card>
            <ul className="tight">
              <li>
                <b>io1/io2 패밀리 한정</b> 기능 — 같은 볼륨을 여러 인스턴스에
                동시 연결
              </li>
              <li>
                <b>같은 AZ 안에서만</b> · 최대 <b>16개 인스턴스</b>
              </li>
              <li>각 인스턴스가 전체 읽기·쓰기 권한 보유</li>
              <li>
                <b>클러스터 인식(cluster-aware) 파일 시스템 필수</b> — XFS·EXT4
                같은 일반 파일 시스템 사용 불가
              </li>
              <li>
                사용 사례: 동시 쓰기가 필요한 고가용 클러스터형 Linux
                애플리케이션(예: Teradata)
              </li>
            </ul>
          </Card>
        </Section>

        {/* ════ 55 EFS ════ */}
        <Section
          id="efs"
          no="LECTURE 55–56"
          title="Amazon EFS (Elastic File System)"
          freq={4}
          refMap={refMap}
        >
          <DiagramEFS />
          <Card>
            <b>핵심 특성</b>
            <ul className="tight">
              <li>
                <b>관리형 NFS</b>(네트워크 파일 시스템, NFSv4.1) —{" "}
                <b>여러 AZ의 수백 개 인스턴스가 동시에 마운트</b>
              </li>
              <li>
                <b>Linux 전용</b> (POSIX 파일 시스템, 표준 파일 API) — Windows
                AMI 불가
              </li>
              <li>
                고가용·확장성 — 용량 계획 불필요,{" "}
                <b>자동 확장 & 사용량 기반 과금</b> (프로비저닝 없음)
              </li>
              <li>
                비용은 gp2의 약 <b>3배</b> 수준 — 대신 스토리지 클래스로 절감
              </li>
              <li>보안 그룹으로 접근 제어 · KMS 저장 시 암호화 지원</li>
              <li>사용 사례: 콘텐츠 관리, 웹 서빙, 데이터 공유, WordPress</li>
            </ul>
          </Card>
          <Table
            head={["설정 축", "옵션", "설명"]}
            rows={[
              [
                <b>성능 모드</b>,
                <Mono>General Purpose</Mono>,
                "기본값. 지연 시간에 민감한 워크로드 (웹 서버, CMS)",
              ],
              [
                "",
                <Mono>Max I/O</Mono>,
                "지연↑ 대신 처리량·병렬성 극대화 (빅데이터, 미디어 처리)",
              ],
              [
                <b>처리량 모드</b>,
                <Mono>Bursting</Mono>,
                "저장 용량에 비례해 처리량 버스트 (1TB = 50MB/s + 100MB/s 버스트)",
              ],
              [
                "",
                <Mono>Provisioned</Mono>,
                "저장 용량과 무관하게 처리량 고정 지정",
              ],
              [
                "",
                <Mono>Elastic</Mono>,
                "워크로드에 따라 자동 조절 (읽기 최대 3GB/s, 쓰기 1GB/s) — 예측 불가 워크로드 권장",
              ],
              [
                <b>스토리지 클래스</b>,
                <Mono>Standard</Mono>,
                "자주 접근하는 파일",
              ],
              [
                "",
                <Mono>EFS-IA</Mono>,
                "저빈도 접근 — 저장 비용↓, 조회 시 비용 발생. 수명 주기 정책으로 자동 이동",
              ],
              ["", <Mono>Archive</Mono>, "연 몇 회 접근 — 최대 50% 추가 절감"],
              [<b>가용성</b>, <Mono>Standard(다중 AZ)</Mono>, "프로덕션용"],
              [
                "",
                <Mono>One Zone</Mono>,
                "단일 AZ — 개발용, IA와 결합 시 최대 90% 절감 (One Zone-IA)",
              ],
            ]}
          />
          <ExamTip>
            EFS 키워드 3종: <b>"여러 AZ" · "동시 마운트" · "Linux/POSIX"</b>. 이
            중 하나라도 시나리오에 보이면 EFS가 정답 후보 1순위. 비용 절감 요구
            시 <b>수명 주기 정책 + EFS-IA</b>.
          </ExamTip>
        </Section>

        {/* ════ 57 EFS vs EBS ════ */}
        <Section
          id="vs"
          no="LECTURE 57–58"
          title="EFS vs EBS vs 인스턴스 스토어 — 최종 비교"
          freq={5}
          refMap={refMap}
        >
          <DiagramEFSvsEBS />
          <Table
            head={["기준", "EBS", "EFS", "인스턴스 스토어"]}
            rows={[
              [
                "연결 범위",
                <span>
                  <b>1 AZ</b> · 기본 1개 인스턴스 (io1/2 Multi-Attach 예외)
                </span>,
                <span>
                  <b>다중 AZ</b> · 수백 개 인스턴스 동시
                </span>,
                "해당 인스턴스 전용",
              ],
              [
                "유형",
                "블록 스토리지",
                "네트워크 파일 시스템 (NFS)",
                "로컬 블록 스토리지",
              ],
              [
                "OS",
                "Linux · Windows",
                <b>Linux 전용 (POSIX)</b>,
                "Linux · Windows",
              ],
              ["AZ 간 이동", "스냅샷으로만 가능", "자체가 다중 AZ", "불가"],
              [
                "과금",
                "프로비저닝 용량 기준",
                <b>사용량 기준 (자동 확장)</b>,
                "인스턴스 요금에 포함",
              ],
              [
                "지속성",
                "인스턴스와 독립적으로 유지",
                "유지",
                <b>중지·종료 시 소실</b>,
              ],
              [
                "가격대",
                "보통 (gp3 저렴)",
                "높음 (gp2의 ~3배, IA로 절감)",
                "-",
              ],
              [
                "대표 사례",
                "DB 볼륨, 루트 볼륨",
                "공유 콘텐츠, WordPress, CMS",
                "캐시, 버퍼, 스크래치",
              ],
            ]}
          />
          <Card tone="warn">
            <b>gp2 볼륨 마이그레이션 시 주의 (섹션 정리 강의 포인트)</b>
            <ul className="tight">
              <li>EBS를 다른 AZ로: 스냅샷 → 복원</li>
              <li>
                루트 EBS는 기본적으로 인스턴스 종료 시 삭제 (Delete on
                Termination) — 필요하면 해제
              </li>
              <li>
                "여러 인스턴스가 같은 데이터를 공유해야 함" = EBS로는 불가(단일
                AZ·단일 연결) → <b>EFS</b>
              </li>
            </ul>
          </Card>
          <ExamTip>
            비교 문제 즉답 공식 — <b>"공유 + 다중 AZ" → EFS</b> ·{" "}
            <b>"단일 인스턴스 고성능 영구 디스크" → EBS</b> ·{" "}
            <b>"최고 I/O + 임시 OK" → 인스턴스 스토어</b>. 이 세 줄이 이
            섹션에서 가장 많이 출제되는 패턴입니다.
          </ExamTip>
        </Section>

        <footer
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 18,
            color: C.sub,
            fontSize: 12,
            fontFamily: C.mono,
            lineHeight: 1.8,
          }}
        >
          출제빈도는 DVA-C02 기출 경향 기반 추정치이며 공식 배점이 아닙니다. ·
          실습 강의(33·36·38~41·47·49·51·56)의 콘솔 조작 절차는 제외하고 개념만
          수록했습니다.
        </footer>
      </main>
    </div>
  );
}
