//fable 5 high
import React, { useState } from "react";

/* ─────────────────────────────────────────────
   AWS DVA-C02 · API Gateway 완전 정복 가이드
   강의 339~359 개념 전체 (실습 제외) + 빈출도
   ───────────────────────────────────────────── */

const C = {
  bg: "#0D1321",
  surface: "#151D30",
  surface2: "#1C2740",
  line: "#2A3854",
  ink: "#E9EEF8",
  sub: "#9AA8C2",
  amber: "#F5A83C",
  teal: "#3FC9A8",
  blue: "#5B9BFF",
  violet: "#A78BFA",
  rose: "#F27D8D",
  dim: "#5B6B8C",
};

const mono = "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace";
const sans = "'Pretendard', 'Noto Sans KR', -apple-system, 'Segoe UI', sans-serif";

/* ── 빈출도 게이지 ─────────────────────────── */
function Freq({ level }) {
  const meta = {
    3: { label: "최빈출", color: C.rose, desc: "시험에 거의 반드시 출제" },
    2: { label: "빈출", color: C.amber, desc: "출제 확률 높음" },
    1: { label: "가끔 출제", color: C.teal, desc: "개념 위주로 알아두기" },
  }[level];
  return (
    <span
      title={meta.desc}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        background: `${meta.color}18`,
        border: `1px solid ${meta.color}55`,
        fontSize: 11.5,
        fontFamily: mono,
        color: meta.color,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "inline-flex", gap: 2.5 }}>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 9,
              borderRadius: 1.5,
              background: i <= level ? meta.color : `${meta.color}30`,
            }}
          />
        ))}
      </span>
      {meta.label}
    </span>
  );
}

/* ── 공통 소품 ─────────────────────────────── */
function Pill({ children, color = C.blue }) {
  return (
    <code
      style={{
        fontFamily: mono,
        fontSize: "0.85em",
        color,
        background: `${color}14`,
        border: `1px solid ${color}40`,
        borderRadius: 5,
        padding: "1px 6px",
      }}
    >
      {children}
    </code>
  );
}

function Callout({ type = "exam", title, children }) {
  const conf = {
    exam: { color: C.rose, icon: "★", t: title || "시험 포인트" },
    tip: { color: C.teal, icon: "✓", t: title || "핵심 정리" },
    warn: { color: C.amber, icon: "!", t: title || "주의" },
  }[type];
  return (
    <div
      style={{
        margin: "14px 0",
        padding: "12px 16px",
        borderRadius: 10,
        background: `${conf.color}0D`,
        borderLeft: `3px solid ${conf.color}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontFamily: mono,
          fontWeight: 700,
          color: conf.color,
          marginBottom: 6,
          letterSpacing: 0.5,
        }}
      >
        {conf.icon} {conf.t}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.75, color: C.ink }}>{children}</div>
    </div>
  );
}

function Table({ head, rows, widths }) {
  return (
    <div style={{ overflowX: "auto", margin: "14px 0", borderRadius: 10, border: `1px solid ${C.line}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 560 }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  background: C.surface2,
                  color: C.amber,
                  fontFamily: mono,
                  fontSize: 12,
                  fontWeight: 700,
                  borderBottom: `1px solid ${C.line}`,
                  width: widths ? widths[i] : "auto",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  style={{
                    padding: "10px 14px",
                    borderBottom: i === rows.length - 1 ? "none" : `1px solid ${C.line}`,
                    color: j === 0 ? C.ink : C.sub,
                    fontWeight: j === 0 ? 600 : 400,
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

function H3({ children }) {
  return (
    <h3
      style={{
        fontSize: 16.5,
        fontWeight: 700,
        color: C.ink,
        margin: "28px 0 10px",
        paddingBottom: 6,
        borderBottom: `1px dashed ${C.line}`,
      }}
    >
      {children}
    </h3>
  );
}

function P({ children }) {
  return <p style={{ fontSize: 14.5, lineHeight: 1.85, color: C.sub, margin: "8px 0" }}>{children}</p>;
}

function Ul({ items }) {
  return (
    <ul style={{ margin: "8px 0", paddingLeft: 4, listStyle: "none" }}>
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            fontSize: 14.5,
            lineHeight: 1.8,
            color: C.sub,
            padding: "3px 0 3px 18px",
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", left: 0, color: C.amber }}>▸</span>
          {it}
        </li>
      ))}
    </ul>
  );
}

/* ── SVG 다이어그램 공통 ───────────────────── */
function Diagram({ title, viewBox, children, h = 300 }) {
  return (
    <div
      style={{
        margin: "16px 0",
        borderRadius: 12,
        border: `1px solid ${C.line}`,
        background: `linear-gradient(180deg, ${C.surface} 0%, #10182A 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "8px 14px",
          fontSize: 11.5,
          fontFamily: mono,
          color: C.dim,
          borderBottom: `1px solid ${C.line}`,
          letterSpacing: 0.8,
        }}
      >
        ◈ DIAGRAM — {title}
      </div>
      <svg viewBox={viewBox} style={{ width: "100%", height: "auto", maxHeight: h, display: "block" }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={C.dim} />
          </marker>
          <marker id="arrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={C.amber} />
          </marker>
          <marker id="arrT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={C.teal} />
          </marker>
          <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={C.rose} />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

const Box = ({ x, y, w, h, label, sub, color = C.blue, dashed }) => (
  <g>
    <rect
      x={x} y={y} width={w} height={h} rx={9}
      fill={`${color}14`} stroke={color} strokeWidth={1.4}
      strokeDasharray={dashed ? "5 4" : "none"}
    />
    <text x={x + w / 2} y={y + h / 2 + (sub ? -5 : 4)} textAnchor="middle" fill={C.ink} fontSize={12.5} fontWeight={700} fontFamily={sans}>
      {label}
    </text>
    {sub && (
      <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily={mono}>
        {sub}
      </text>
    )}
  </g>
);

const Flow = ({ d, color = C.dim, marker = "arr", dashed, label, lx, ly }) => (
  <g>
    <path d={d} fill="none" stroke={color} strokeWidth={1.6} markerEnd={`url(#${marker})`} strokeDasharray={dashed ? "5 4" : "none"} />
    {label && (
      <text x={lx} y={ly} textAnchor="middle" fill={color === C.dim ? C.sub : color} fontSize={10.5} fontFamily={mono}>
        {label}
      </text>
    )}
  </g>
);

const Note = ({ x, y, text, color = C.sub, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={10.5} fontFamily={mono}>
    {text}
  </text>
);

/* ═══════════════ 섹션별 다이어그램 ═══════════════ */

function OverviewDiagram() {
  return (
    <Diagram title="API Gateway 기본 아키텍처" viewBox="0 0 760 260" h={280}>
      <Box x={20} y={100} w={110} h={58} label="클라이언트" sub="Web / Mobile" color={C.sub} />
      <Box x={230} y={88} w={180} h={84} label="API Gateway" sub="REST · HTTP · WebSocket" color={C.amber} />
      <Box x={560} y={20} w={170} h={52} label="Lambda 함수" sub="가장 흔한 통합" color={C.teal} />
      <Box x={560} y={104} w={170} h={52} label="HTTP 엔드포인트" sub="EC2 · ALB · 온프레미스" color={C.blue} />
      <Box x={560} y={188} w={170} h={52} label="AWS 서비스" sub="SQS · Step Functions · Kinesis" color={C.violet} />
      <Flow d="M130,129 L230,129" color={C.amber} marker="arrA" label="HTTPS 요청" lx={180} ly={120} />
      <Flow d="M410,110 C480,90 500,60 560,48" color={C.teal} marker="arrT" />
      <Flow d="M410,130 L560,130" color={C.blue} />
      <Flow d="M410,150 C480,170 500,200 560,212" color={C.violet} />
      <Note x={320} y={200} text="인증 · 스로틀링 · 캐싱 · 검증 · 변환" color={C.dim} />
      <Note x={320} y={215} text="↑ 게이트웨이가 대신 처리" color={C.dim} />
    </Diagram>
  );
}

function EndpointDiagram() {
  return (
    <Diagram title="엔드포인트 유형 3가지" viewBox="0 0 760 250" h={270}>
      {/* Edge-Optimized */}
      <Box x={20} y={30} w={225} h={190} label="" color={C.amber} dashed />
      <Note x={132} y={52} text="Edge-Optimized (기본값)" color={C.amber} />
      <Box x={45} y={70} w={175} h={44} label="전 세계 클라이언트" color={C.sub} />
      <Box x={45} y={158} w={175} h={44} label="CloudFront 엣지" sub="→ API GW는 한 리전에" color={C.amber} />
      <Flow d="M132,114 L132,158" color={C.amber} marker="arrA" />
      {/* Regional */}
      <Box x={268} y={30} w={225} h={190} label="" color={C.blue} dashed />
      <Note x={380} y={52} text="Regional" color={C.blue} />
      <Box x={293} y={70} w={175} h={44} label="같은 리전 클라이언트" color={C.sub} />
      <Box x={293} y={158} w={175} h={44} label="API Gateway" sub="자체 CloudFront 결합 가능" color={C.blue} />
      <Flow d="M380,114 L380,158" color={C.blue} />
      {/* Private */}
      <Box x={516} y={30} w={225} h={190} label="" color={C.teal} dashed />
      <Note x={628} y={52} text="Private" color={C.teal} />
      <Box x={541} y={70} w={175} h={44} label="VPC 내부 클라이언트" color={C.sub} />
      <Box x={541} y={158} w={175} h={44} label="인터페이스 VPC 엔드포인트" sub="+ 리소스 정책으로 접근 제어" color={C.teal} />
      <Flow d="M628,114 L628,158" color={C.teal} marker="arrT" />
    </Diagram>
  );
}

function StageDiagram() {
  return (
    <Diagram title="스테이지 + 스테이지 변수 + Lambda Alias 패턴" viewBox="0 0 760 300" h={320}>
      <Box x={20} y={110} w={120} h={70} label="API Gateway" sub="배포(Deploy) 필수!" color={C.amber} />
      <Box x={220} y={30} w={150} h={52} label="Stage: dev" sub="var: alias=DEV" color={C.teal} />
      <Box x={220} y={124} w={150} h={52} label="Stage: test" sub="var: alias=TEST" color={C.blue} />
      <Box x={220} y={218} w={150} h={52} label="Stage: prod" sub="var: alias=PROD" color={C.rose} />
      <Flow d="M140,130 C180,110 190,70 220,58" color={C.teal} marker="arrT" />
      <Flow d="M140,145 L220,148" color={C.blue} />
      <Flow d="M140,162 C180,185 190,225 220,242" color={C.rose} marker="arrR" />
      <Box x={470} y={30} w={130} h={52} label="Alias: DEV" sub="→ $LATEST" color={C.teal} />
      <Box x={470} y={124} w={130} h={52} label="Alias: TEST" sub="→ v2" color={C.blue} />
      <Box x={470} y={218} w={130} h={52} label="Alias: PROD" sub="→ v1 (95%) / v2 (5%)" color={C.rose} />
      <Flow d="M370,56 L470,56" color={C.teal} marker="arrT" />
      <Flow d="M370,150 L470,150" color={C.blue} />
      <Flow d="M370,244 L470,244" color={C.rose} marker="arrR" />
      <Box x={640} y={124} w={100} h={52} label="Lambda" sub="하나의 함수" color={C.violet} />
      <Flow d="M600,56 C625,70 630,110 640,130" color={C.dim} />
      <Flow d="M600,150 L640,150" color={C.dim} />
      <Flow d="M600,244 C625,230 630,190 640,170" color={C.dim} />
      <Note x={430} y={290} text={'통합 URI에 ${stageVariables.alias} 삽입 → 스테이지마다 다른 alias 호출'} color={C.amber} />
    </Diagram>
  );
}

function CanaryDiagram() {
  return (
    <Diagram title="Canary 배포 — prod 트래픽 분할" viewBox="0 0 760 240" h={260}>
      <Box x={20} y={90} w={120} h={60} label="클라이언트" sub="100% 트래픽" color={C.sub} />
      <Box x={240} y={90} w={170} h={60} label="Stage: prod" sub="Canary 활성화" color={C.amber} />
      <Flow d="M140,120 L240,120" color={C.amber} marker="arrA" />
      <Box x={540} y={26} w={190} h={60} label="현재 버전 (v1)" sub="지표·로그 분리 수집" color={C.blue} />
      <Box x={540} y={152} w={190} h={60} label="Canary 버전 (v2)" sub="지표·로그 분리 수집" color={C.teal} />
      <Flow d="M410,105 C470,85 490,66 540,56" color={C.blue} label="95%" lx={475} ly={68} />
      <Flow d="M410,135 C470,155 490,172 540,182" color={C.teal} marker="arrT" label="5%" lx={475} ly={185} />
      <Note x={385} y={220} text="검증 완료 → 'Promote Canary'로 100% 전환 (= Blue/Green)" color={C.dim} />
    </Diagram>
  );
}

function IntegrationDiagram({ mode }) {
  if (mode === "proxy") {
    return (
      <Diagram title="프록시 통합 (AWS_PROXY / HTTP_PROXY)" viewBox="0 0 760 220" h={240}>
        <Box x={20} y={80} w={110} h={60} label="클라이언트" color={C.sub} />
        <Box x={280} y={80} w={180} h={60} label="API Gateway" sub="변형 없이 통과 (passthrough)" color={C.amber} />
        <Box x={610} y={80} w={130} h={60} label="Lambda / HTTP" sub="요청·응답 전부 책임" color={C.teal} />
        <Flow d="M130,100 L280,100" color={C.amber} marker="arrA" label="요청 그대로" lx={205} ly={90} />
        <Flow d="M460,100 L610,100" color={C.amber} marker="arrA" />
        <Flow d="M610,124 L460,124" color={C.teal} marker="arrT" />
        <Flow d="M280,124 L130,124" color={C.teal} marker="arrT" label="응답 그대로" lx={205} ly={140} />
        <Note x={380} y={185} text="매핑 템플릿 사용 불가 · Lambda가 statusCode/headers/body 형식을 직접 반환" color={C.rose} />
      </Diagram>
    );
  }
  return (
    <Diagram title="비프록시 통합 (AWS / HTTP) — 매핑 템플릿" viewBox="0 0 760 230" h={250}>
      <Box x={20} y={85} w={100} h={60} label="클라이언트" color={C.sub} />
      <Box x={190} y={40} w={160} h={60} label="통합 요청" sub="매핑 템플릿 (VTL)" color={C.violet} />
      <Box x={190} y={135} w={160} h={60} label="통합 응답" sub="매핑 템플릿 (VTL)" color={C.violet} />
      <Box x={430} y={85} w={130} h={60} label="백엔드" sub="예: SOAP API" color={C.blue} />
      <Box x={630} y={85} w={110} h={60} label="변환 예시" sub="JSON ↔ XML" color={C.teal} dashed />
      <Flow d="M120,100 C150,90 160,75 190,68" color={C.violet} label="요청 변형" lx={148} ly={62} />
      <Flow d="M350,70 C395,78 405,90 430,98" color={C.violet} />
      <Flow d="M430,132 C405,140 395,152 350,160" color={C.blue} />
      <Flow d="M190,162 C160,155 150,140 120,130" color={C.blue} label="응답 변형" lx={148} ly={178} />
      <Note x={380} y={215} text="헤더·쿼리스트링·바디 수정 가능 · 파라미터 이름 변경 · 필드 필터링" color={C.dim} />
    </Diagram>
  );
}

function CacheDiagram() {
  return (
    <Diagram title="캐싱 흐름" viewBox="0 0 760 240" h={260}>
      <Box x={20} y={90} w={110} h={60} label="클라이언트" color={C.sub} />
      <Box x={230} y={90} w={160} h={60} label="API Gateway" color={C.amber} />
      <Box x={230} y={185} w={160} h={44} label="스테이지 캐시" sub="TTL 300s (0~3600s)" color={C.teal} />
      <Box x={560} y={90} w={130} h={60} label="백엔드" sub="캐시 미스일 때만" color={C.blue} />
      <Flow d="M130,120 L230,120" color={C.amber} marker="arrA" />
      <Flow d="M300,150 L300,185" color={C.teal} marker="arrT" label="① 캐시 확인" lx={370} ly={172} />
      <Flow d="M390,112 L560,112" color={C.blue} label="② Miss → 백엔드" lx={475} ly={102} />
      <Flow d="M560,134 L390,134" color={C.blue} label="③ 응답 저장 후 반환" lx={475} ly={152} />
      <Note x={380} y={40} text="용량 0.5GB ~ 237GB · 스테이지 단위 정의, 메서드 단위 오버라이드 · 비용 高 → prod 권장" color={C.dim} />
      <Note x={380} y={60} text="클라이언트 무효화: Cache-Control: max-age=0 + InvalidateCache IAM 권한" color={C.rose} />
    </Diagram>
  );
}

function AuthDiagram({ mode }) {
  if (mode === "iam") {
    return (
      <Diagram title="IAM 권한 방식 (SigV4)" viewBox="0 0 760 200" h={220}>
        <Box x={20} y={70} w={140} h={60} label="IAM 사용자/역할" sub="AWS 내부 사용자" color={C.blue} />
        <Box x={310} y={70} w={170} h={60} label="API Gateway" sub="IAM 정책 검증" color={C.amber} />
        <Box x={610} y={70} w={130} h={60} label="백엔드" color={C.teal} />
        <Flow d="M160,100 L310,100" color={C.blue} label="SigV4 서명 헤더" lx={235} ly={90} />
        <Flow d="M480,100 L610,100" color={C.teal} marker="arrT" />
        <Note x={380} y={170} text="추가 비용 없음 · 리소스 정책과 결합해 교차 계정 접근 제어 가능" color={C.dim} />
      </Diagram>
    );
  }
  if (mode === "cognito") {
    return (
      <Diagram title="Cognito User Pools (인증만 담당)" viewBox="0 0 760 230" h={250}>
        <Box x={20} y={90} w={120} h={60} label="클라이언트" color={C.sub} />
        <Box x={220} y={10} w={170} h={54} label="Cognito User Pool" sub="① 로그인 → 토큰 발급" color={C.violet} />
        <Box x={300} y={130} w={170} h={60} label="API Gateway" sub="② 토큰 검증" color={C.amber} />
        <Box x={610} y={130} w={130} h={60} label="백엔드" sub="권한 부여는 여기서" color={C.teal} />
        <Flow d="M120,100 C160,70 180,48 220,40" color={C.violet} />
        <Flow d="M140,150 L300,155" color={C.amber} marker="arrA" label="토큰 전달" lx={215} ly={144} />
        <Flow d="M470,160 L610,160" color={C.teal} marker="arrT" />
        <Note x={380} y={220} text="인증(Authentication)=Cognito · 인가(Authorization)=백엔드 · 커스텀 로직 없음" color={C.dim} />
      </Diagram>
    );
  }
  return (
    <Diagram title="Lambda Authorizer (커스텀 인증)" viewBox="0 0 760 250" h={270}>
      <Box x={20} y={95} w={120} h={60} label="클라이언트" sub="3rd party 토큰" color={C.sub} />
      <Box x={280} y={95} w={170} h={60} label="API Gateway" sub="정책 캐시 (시간 절약)" color={C.amber} />
      <Box x={310} y={10} w={200} h={54} label="Authorizer Lambda" sub="토큰/파라미터 검증" color={C.violet} />
      <Box x={610} y={95} w={130} h={60} label="백엔드" color={C.teal} />
      <Flow d="M140,125 L280,125" color={C.amber} marker="arrA" label="① 요청+토큰" lx={210} ly={115} />
      <Flow d="M355,95 L385,64" color={C.violet} label="②" lx={352} ly={78} />
      <Flow d="M440,64 L430,95" color={C.violet} label="③ IAM 정책 반환" lx={545} ly={52} />
      <Flow d="M450,125 L610,125" color={C.teal} marker="arrT" label="④ Allow 시" lx={530} ly={115} />
      <Note x={380} y={210} text="토큰 기반(JWT·OAuth) 또는 요청 파라미터 기반(헤더·쿼리) · 외부 인증 시스템에 최적" color={C.dim} />
      <Note x={380} y={230} text="비용: Lambda 호출당 과금 → 정책 캐싱으로 절감" color={C.rose} />
    </Diagram>
  );
}

function WsDiagram() {
  return (
    <Diagram title="WebSocket API — 양방향 통신" viewBox="0 0 760 320" h={340}>
      <Box x={20} y={120} w={120} h={64} label="클라이언트" sub="wss:// 연결" color={C.sub} />
      <Box x={290} y={120} w={180} h={64} label="WebSocket API" sub="connectionId 유지" color={C.amber} />
      <Box x={600} y={120} w={140} h={64} label="Lambda" sub="connectionId 저장" color={C.teal} />
      <Box x={600} y={230} w={140} h={54} label="DynamoDB" sub="연결 상태 관리" color={C.blue} />
      <Flow d="M140,138 L290,138" color={C.amber} marker="arrA" label="① $connect" lx={215} ly={128} />
      <Flow d="M470,138 L600,138" color={C.teal} marker="arrT" label="②" lx={535} ly={128} />
      <Flow d="M670,184 L670,230" color={C.blue} label="③ 저장" lx={710} ly={212} />
      <Flow d="M140,166 L290,166" color={C.dim} label="프레임 전송" lx={215} ly={182} />
      <Flow d="M600,90 C500,55 380,60 290,110" color={C.rose} marker="arrR" label="서버→클라이언트: POST @connections/{id}" lx={430} ly={45} />
      <Note x={380} y={305} text="라우트: $connect · $disconnect · $default + 커스텀 (routeSelection: $request.body.action)" color={C.dim} />
    </Diagram>
  );
}

function ArchDiagram() {
  return (
    <Diagram title="시험 단골 아키텍처 — 단일 도메인 통합" viewBox="0 0 760 280" h={300}>
      <Box x={20} y={105} w={110} h={60} label="클라이언트" sub="example.com" color={C.sub} />
      <Box x={230} y={105} w={160} h={60} label="CloudFront" sub="경로 기반 라우팅" color={C.amber} />
      <Box x={530} y={30} w={200} h={60} label="S3 버킷" sub="/  → 정적 콘텐츠" color={C.blue} />
      <Box x={530} y={180} w={200} h={60} label="API Gateway + Lambda" sub="/api → REST API" color={C.teal} />
      <Flow d="M130,135 L230,135" color={C.amber} marker="arrA" label="HTTPS" lx={180} ly={125} />
      <Flow d="M390,118 C455,95 480,75 530,62" color={C.blue} label="/ 경로" lx={455} ly={78} />
      <Flow d="M390,152 C455,175 480,195 530,208" color={C.teal} marker="arrT" label="/api 경로" lx={452} ly={202} />
      <Note x={380} y={265} text="하나의 도메인 · SSL 통합 · CORS 문제 회피 · 정적/동적 콘텐츠 분리 서빙" color={C.dim} />
    </Diagram>
  );
}

/* ═══════════════ 섹션 콘텐츠 ═══════════════ */

function SecOverview() {
  return (
    <>
      <P>
        API Gateway는 <b style={{ color: C.ink }}>완전 관리형 서버리스</b> 서비스로, Lambda·HTTP 백엔드·AWS 서비스를
        REST / HTTP / WebSocket API로 외부에 노출합니다. 시험에서는 "서버 관리 없이 API를 노출하고 인증·스로틀링까지
        처리하고 싶다"는 시나리오에서 정답으로 등장합니다.
      </P>
      <OverviewDiagram />
      <H3>주요 기능 (전부 시험 소재)</H3>
      <Ul
        items={[
          <>API <b>버저닝</b> (v1, v2…) 및 환경 분리 (dev / test / prod)</>,
          <>보안: <b>인증(Authentication)</b>과 <b>권한 부여(Authorization)</b> 내장</>,
          <><b>API 키</b> 발급, 요청 <b>스로틀링</b>(사용 계획)</>,
          <>Swagger / <b>OpenAPI</b> 스펙 가져오기·내보내기</>,
          <>요청·응답 <b>변환(매핑 템플릿)</b> 및 <b>검증(Request Validation)</b></>,
          <>SDK 및 API 명세 자동 생성</>,
          <>응답 <b>캐싱</b></>,
        ]}
      />
      <H3>3가지 통합 대상</H3>
      <Table
        head={["통합 대상", "설명"]}
        rows={[
          ["Lambda 함수", "가장 흔한 패턴. REST API로 Lambda를 노출. 완전 서버리스"],
          ["HTTP 엔드포인트", "온프레미스 API, ALB 등 앞단에 배치. 속도 제한·캐싱·인증을 추가하는 목적"],
          ["AWS 서비스", "Step Functions 실행, SQS 메시지 전송, Kinesis 데이터 전송 등을 HTTP로 노출. 인증·배포·요금 관리 추가 목적"],
        ]}
      />
      <H3>엔드포인트 유형</H3>
      <EndpointDiagram />
      <Table
        head={["유형", "특징", "시험 키워드"]}
        rows={[
          ["Edge-Optimized (기본)", "CloudFront 엣지 로케이션을 통해 라우팅 → 전 세계 지연시간 개선. API GW 자체는 한 리전에 존재", "글로벌 클라이언트"],
          ["Regional", "같은 리전 클라이언트 대상. 직접 CloudFront와 결합해 캐싱 전략을 세밀하게 제어 가능", "리전 내 서비스"],
          ["Private", "인터페이스 VPC 엔드포인트(ENI)로만 접근. 리소스 정책으로 접근 정의", "VPC 내부 전용"],
        ]}
      />
      <Callout type="exam">
        <b>커스텀 도메인 + HTTPS(ACM) 인증서 위치</b> — Edge-Optimized라면 인증서는 반드시{" "}
        <Pill color={C.rose}>us-east-1</Pill>에, Regional이라면 <b>API Gateway와 같은 리전</b>에 있어야 합니다.
        그리고 Route 53에 CNAME 또는 A-Alias 레코드를 설정합니다. 자주 나오는 함정 문제입니다.
      </Callout>
    </>
  );
}

function SecStages() {
  return (
    <>
      <P>
        API Gateway에서 변경한 내용은 <b style={{ color: C.rose }}>배포(Deploy)하기 전까지 절대 반영되지 않습니다</b>.
        "변경했는데 왜 안 바뀌죠?"라는 시나리오의 정답은 항상 "배포를 안 했기 때문"입니다.
      </P>
      <Ul
        items={[
          <>배포는 <b>스테이지</b>(dev, test, prod 등 — 이름·개수 자유) 단위로 이뤄짐</>,
          <>각 스테이지는 자기만의 설정(파라미터, 캐시, 로그 등)을 가짐</>,
          <>스테이지별 배포 이력이 유지되어 <b>이전 배포로 롤백 가능</b></>,
          <>스테이지별 URL: <Pill>https://[api-id].execute-api.[region].amazonaws.com/[stage]</Pill></>,
        ]}
      />
      <H3>스테이지 변수 (Stage Variables)</H3>
      <P>
        스테이지 변수는 API Gateway의 <b style={{ color: C.ink }}>환경 변수</b>입니다. 스테이지마다 다른 값을 설정해
        재배포 없이 구성만 바꿀 수 있습니다.
      </P>
      <Ul
        items={[
          <>사용처: Lambda 함수 ARN, HTTP 엔드포인트 URL, 매핑 템플릿의 파라미터</>,
          <>Lambda의 <Pill>context</Pill> 객체로 전달됨</>,
          <>참조 문법: <Pill color={C.amber}>{"${stageVariables.변수명}"}</Pill></>,
        ]}
      />
      <StageDiagram />
      <Callout type="exam" title="최빈출 패턴: Stage Variables + Lambda Alias">
        통합 URI에 <Pill color={C.amber}>{"함수이름:${stageVariables.lambdaAlias}"}</Pill>처럼 스테이지 변수를 넣으면{" "}
        <b>스테이지마다 다른 Lambda alias</b>를 호출합니다. dev 스테이지 → DEV alias → $LATEST, prod 스테이지 → PROD
        alias → v1(가중치 라우팅 가능). 이렇게 하면 <b>API를 재배포하지 않고</b> Lambda 버전만 교체할 수 있습니다.
        DVA 시험에서 매우 자주 출제됩니다.
      </Callout>
    </>
  );
}

function SecCanary() {
  return (
    <>
      <P>
        Canary 배포는 새 버전을 <b style={{ color: C.ink }}>prod 트래픽의 일부에만</b> 먼저 노출해 안전하게 검증하는
        기법입니다. 보통 prod 스테이지에서 사용합니다.
      </P>
      <CanaryDiagram />
      <Ul
        items={[
          <>트래픽 분배 비율은 자유롭게 설정 (예: 95% / 5%)</>,
          <>Canary 채널의 <b>지표(Metrics)와 로그가 별도로</b> 수집됨 → 새 버전만 모니터링 가능</>,
          <>Canary용으로 <b>스테이지 변수를 오버라이드</b>할 수 있음</>,
          <>검증이 끝나면 "Promote Canary"로 Canary를 100%로 승격</>,
        ]}
      />
      <Callout type="tip">
        시험에서 "API Gateway로 Blue/Green 배포를 하고 싶다"는 문장이 나오면 정답은 <b>Canary 배포</b>입니다. (Lambda
        쪽 Blue/Green은 alias 가중치 + CodeDeploy)
      </Callout>
    </>
  );
}

function SecIntegration() {
  const [mode, setMode] = useState("proxy");
  return (
    <>
      <P>
        DVA 시험 API Gateway 문제 중 가장 많이 출제되는 주제입니다. <b style={{ color: C.ink }}>프록시 vs 비프록시</b>의
        차이, 그리고 각 통합 유형에서 매핑 템플릿 사용 가능 여부를 정확히 구분해야 합니다.
      </P>
      <div style={{ display: "flex", gap: 8, margin: "14px 0 4px" }}>
        {[
          ["proxy", "프록시 통합"],
          ["nonproxy", "비프록시 통합"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: sans,
              cursor: "pointer",
              border: `1px solid ${mode === k ? C.amber : C.line}`,
              background: mode === k ? `${C.amber}1A` : "transparent",
              color: mode === k ? C.amber : C.sub,
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <IntegrationDiagram mode={mode} />
      <Table
        head={["통합 유형", "설명", "매핑 템플릿"]}
        widths={["150px", "auto", "110px"]}
        rows={[
          [<Pill color={C.dim}>MOCK</Pill>, "백엔드 호출 없이 API Gateway가 직접 응답 반환. 테스트용", "—"],
          [<Pill color={C.violet}>HTTP / AWS</Pill>, "비프록시. 통합 요청·응답을 직접 구성. Lambda·HTTP·AWS 서비스 대상 (예: API GW → SQS)", <b style={{ color: C.teal }}>가능 ✓</b>],
          [<Pill color={C.amber}>AWS_PROXY</Pill>, "Lambda 프록시. 요청 전체(헤더·쿼리·바디)를 이벤트로 그대로 전달. 응답 형식(statusCode/headers/body)은 Lambda 책임", <b style={{ color: C.rose }}>불가 ✗</b>],
          [<Pill color={C.blue}>HTTP_PROXY</Pill>, "HTTP 백엔드로 그대로 전달. 단, 게이트웨이에서 HTTP 헤더 추가는 가능 (예: 백엔드용 API 키 삽입)", <b style={{ color: C.rose }}>불가 ✗</b>],
        ]}
      />
      <H3>매핑 템플릿 (Mapping Templates)</H3>
      <Ul
        items={[
          <><b>VTL</b>(Velocity Template Language) 사용 — 루프·조건문 지원</>,
          <>쿼리스트링·헤더·바디 <b>수정</b>, 파라미터 <b>이름 변경</b>, 결과 <b>필터링</b>(불필요한 필드 제거)</>,
          <>Content-Type은 <Pill>application/json</Pill> 또는 <Pill>application/xml</Pill>로 설정해야 함</>,
        ]}
      />
      <Callout type="exam" title="시험 단골 시나리오 2가지">
        ① <b>JSON ↔ XML(SOAP) 변환</b>: 클라이언트는 JSON, 레거시 백엔드는 SOAP(XML) → 비프록시 통합 + 매핑
        템플릿으로 요청은 JSON→XML, 응답은 XML→JSON 변환.
        <br />② <b>쿼리스트링 이름 변경</b>: 클라이언트의 <Pill>?name=foo</Pill>를 백엔드의{" "}
        <Pill>{'{"my_variable": "foo"}'}</Pill>로 매핑. "매핑 템플릿이 필요하다 = 프록시 통합은 정답이 될 수 없다"를
        기억하세요.
      </Callout>
    </>
  );
}

function SecOpenApi() {
  return (
    <>
      <P>
        OpenAPI(구 Swagger)는 REST API를 <b style={{ color: C.ink }}>코드로 정의</b>하는 표준 스펙입니다(YAML/JSON).
        API Gateway와 양방향으로 호환됩니다.
      </P>
      <Ul
        items={[
          <><b>가져오기(Import)</b>: 기존 OpenAPI 3.0 스펙으로 API를 생성/업데이트. AWS 확장 태그{" "}
            <Pill>x-amazon-apigateway-*</Pill>로 통합 등 AWS 전용 설정 포함 가능</>,
          <><b>내보내기(Export)</b>: 현재 API를 OpenAPI 스펙으로 추출</>,
          <>스펙으로부터 클라이언트 <b>SDK 자동 생성</b> 가능</>,
        ]}
      />
      <H3>요청 검증 (Request Validation)</H3>
      <P>
        백엔드 호출 <b>전에</b> API Gateway가 요청의 유효성을 검사해, 잘못된 요청이면 즉시{" "}
        <Pill color={C.rose}>400</Pill>을 반환합니다. 불필요한 백엔드 호출을 줄여 비용을 절감합니다.
      </P>
      <Ul
        items={[
          <>검증 대상: 필수 <b>쿼리스트링/헤더 존재 여부</b>, <b>요청 바디가 모델(JSON Schema)에 부합</b>하는지</>,
          <>OpenAPI 스펙에 <Pill>x-amazon-apigateway-request-validators</Pill>로 검증기를 정의하고 메서드에 적용</>,
        ]}
      />
      <Callout type="tip">
        "Lambda가 호출되기 전에 잘못된 입력을 걸러내 비용을 줄이고 싶다" → <b>Request Validation</b>이 정답 키워드.
      </Callout>
    </>
  );
}

function SecCache() {
  return (
    <>
      <P>
        캐싱은 백엔드 호출 횟수를 줄여 <b style={{ color: C.ink }}>지연시간과 백엔드 부하를 감소</b>시킵니다.
      </P>
      <CacheDiagram />
      <Ul
        items={[
          <>기본 TTL <b>300초</b> (최소 0초 = 캐시 끔, 최대 <b>3600초</b>)</>,
          <>캐시는 <b>스테이지 단위</b>로 정의, <b>메서드 단위</b>로 설정 오버라이드 가능</>,
          <>캐시 용량: <b>0.5GB ~ 237GB</b>, 암호화 옵션 있음</>,
          <>비용이 비싸므로 <b>prod에서만</b> 활성화 권장 (dev/test는 비활성)</>,
        ]}
      />
      <H3>캐시 무효화 (Invalidation)</H3>
      <Ul
        items={[
          <>콘솔에서 <b>전체 캐시 즉시 플러시</b> 가능</>,
          <>클라이언트가 헤더 <Pill color={C.amber}>Cache-Control: max-age=0</Pill>로 특정 항목 무효화 —{" "}
            단, <Pill>execute-api:InvalidateCache</Pill> <b>IAM 권한</b> 필요</>,
        ]}
      />
      <Callout type="warn">
        "Require authorization" 체크를 하지 않으면 <b>아무 클라이언트나 캐시를 무효화</b>할 수 있습니다. 시험에서
        보안 함정으로 출제됩니다.
      </Callout>
    </>
  );
}

function SecUsagePlan() {
  return (
    <>
      <P>
        API를 <b style={{ color: C.ink }}>유료 상품처럼</b> 고객에게 제공하고 싶을 때 사용 계획(Usage Plan)과 API
        키를 사용합니다.
      </P>
      <Table
        head={["구성 요소", "역할"]}
        rows={[
          ["Usage Plan", "누가 어떤 스테이지·메서드에 얼마나 접근할 수 있는지 정의. 스로틀링(rate·burst) + 쿼터(일/주/월 최대 요청 수)"],
          [
            "API Key",
            <>
              고객에게 배포하는 영숫자 문자열. 클라이언트는 요청 헤더{" "}
              <Pill color={C.amber}>x-api-key</Pill>에 담아 전송. 스로틀링·쿼터가 키 단위로 적용됨
            </>,
          ],
        ]}
      />
      <Callout type="exam" title="올바른 설정 순서 (순서 문제 출제됨)">
        ① API를 만들고 키 필수(require API key) 설정 후 <b>스테이지에 배포</b> → ② <b>API 키 생성</b>(고객에게 배포)
        → ③ <b>사용 계획 생성</b>(스로틀·쿼터) → ④ 스테이지와 API 키를 사용 계획에 <b>연결</b>. 쿼터 초과 시{" "}
        <Pill color={C.rose}>429 Too Many Requests</Pill> 반환.
      </Callout>
    </>
  );
}

function SecMonitoring() {
  return (
    <>
      <H3>CloudWatch Logs (실행 로그)</H3>
      <Ul
        items={[
          <>요청/응답 <b>본문 포함</b> 상세 로그. 스테이지 단위 활성화, 로그 레벨 <Pill>ERROR</Pill> / <Pill>DEBUG</Pill> / <Pill>INFO</Pill></>,
          <>민감 데이터가 로그에 남을 수 있음 → 주의</>,
        ]}
      />
      <H3>Access Logs + X-Ray</H3>
      <Ul
        items={[
          <><b>Access Logs</b>: 누가 어떻게 접근했는지 — 형식을 직접 커스터마이징(JSON 등)</>,
          <><b>X-Ray</b>: 요청 추적 활성화. <b>X-Ray + API Gateway + Lambda</b> 조합이면 전체 경로의 완전한 그림 확보</>,
        ]}
      />
      <H3>CloudWatch 지표 (스테이지 단위)</H3>
      <Table
        head={["지표", "의미"]}
        rows={[
          ["CacheHitCount / CacheMissCount", "캐시 효율 확인"],
          ["Count", "일정 기간 총 API 요청 수"],
          [<b style={{ color: C.amber }}>IntegrationLatency</b>, "백엔드에 요청을 보내고 응답을 받기까지의 시간 (백엔드 성능)"],
          [<b style={{ color: C.amber }}>Latency</b>, "클라이언트 요청 수신 → 응답 반환까지 전체 시간 (통합 지연 + 오버헤드 포함)"],
          ["4XXError / 5XXError", "클라이언트 측 / 서버 측 오류 수"],
        ]}
      />
      <Callout type="exam" title="29초 규칙">
        API Gateway의 최대 통합 타임아웃은 <b style={{ color: C.rose }}>29초</b>. Lambda는 최대 15분 실행 가능하지만
        API Gateway 뒤에 있으면 29초 안에 응답해야 합니다. 초과 시 <Pill color={C.rose}>504</Pill>.
      </Callout>
      <H3>스로틀링과 오류 코드</H3>
      <Ul
        items={[
          <>계정 단위 소프트 리밋: <b>10,000 req/s</b> (전체 API가 공유!) — 한 API가 폭주하면 다른 API도 스로틀됨</>,
          <>초과 시 <Pill color={C.rose}>429 Too Many Requests</Pill> (재시도 가능 오류)</>,
          <>대응: <b>Usage Plan으로 API/스테이지별 한도</b> 설정, 메서드 단위 스로틀 제한, 한도 상향 요청</>,
        ]}
      />
      <Table
        head={["코드", "의미"]}
        rows={[
          ["400", "Bad Request (요청 검증 실패 등)"],
          ["403", "Access Denied — 권한 없음, WAF 필터링"],
          ["429", "쿼터 초과 / 스로틀링"],
          [<b style={{ color: C.rose }}>502</b>, "Bad Gateway — 보통 Lambda 프록시가 잘못된 형식의 출력을 반환했을 때, 또는 과부하"],
          ["503", "Service Unavailable — 백엔드 다운"],
          ["504", "Integration Failure/Timeout — 29초 초과"],
        ]}
      />
    </>
  );
}

function SecCors() {
  return (
    <>
      <P>
        브라우저에서 <b style={{ color: C.ink }}>다른 도메인(오리진)의 API</b>를 호출하려면 CORS가 활성화되어야
        합니다. 브라우저가 먼저 <Pill color={C.amber}>OPTIONS</Pill> <b>프리플라이트(pre-flight)</b> 요청을 보내고,
        API가 허용 헤더를 반환해야 본 요청이 진행됩니다.
      </P>
      <Ul
        items={[
          <>응답에 포함되어야 하는 헤더: <Pill>Access-Control-Allow-Origin</Pill>,{" "}
            <Pill>Access-Control-Allow-Methods</Pill>, <Pill>Access-Control-Allow-Headers</Pill></>,
          <>콘솔에서 "Enable CORS"로 활성화 가능</>,
        ]}
      />
      <Callout type="exam">
        <b>프록시 통합(AWS_PROXY)에서는 게이트웨이가 응답을 만들지 않으므로</b>, CORS 헤더를{" "}
        <b style={{ color: C.rose }}>Lambda 코드가 직접 응답에 포함</b>해야 합니다. "CORS를 켰는데도 브라우저에서
        차단된다" 시나리오의 정답입니다. (예: S3 정적 웹사이트 → 다른 도메인의 API Gateway 호출)
      </Callout>
    </>
  );
}

function SecAuth() {
  const [mode, setMode] = useState("iam");
  return (
    <>
      <P>
        <b style={{ color: C.ink }}>세 가지 보안 방식 중 어떤 상황에 무엇을 쓰는가</b> — DVA에서 가장 확실하게 나오는
        문제 유형입니다.
      </P>
      <div style={{ display: "flex", gap: 8, margin: "14px 0 4px", flexWrap: "wrap" }}>
        {[
          ["iam", "IAM 권한"],
          ["cognito", "Cognito User Pools"],
          ["lambda", "Lambda Authorizer"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: sans,
              cursor: "pointer",
              border: `1px solid ${mode === k ? C.amber : C.line}`,
              background: mode === k ? `${C.amber}1A` : "transparent",
              color: mode === k ? C.amber : C.sub,
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <AuthDiagram mode={mode} />
      <Table
        head={["방식", "언제 쓰나", "인증/인가", "핵심 키워드"]}
        rows={[
          [
            "IAM",
            "사용자·역할이 이미 AWS 계정에 있을 때 (내부 서비스, EC2→API 등)",
            "인증 = IAM · 인가 = IAM 정책",
            <>SigV4 서명 · 무료 · <b>리소스 정책</b>과 결합 시 교차 계정 접근</>,
          ],
          [
            "Cognito User Pools",
            "자체 사용자 풀을 관리할 때 (모바일/웹 앱 사용자)",
            "인증 = Cognito · 인가 = 백엔드",
            "토큰 만료 자동 관리 · 커스텀 구현 없음",
          ],
          [
            "Lambda Authorizer",
            "3rd party 인증 시스템(외부 JWT·OAuth·SAML 등)을 쓸 때",
            "인증 = 외부 · 인가 = Lambda가 IAM 정책 반환",
            "가장 유연 · 정책 캐시 · Lambda 비용 발생",
          ],
        ]}
      />
      <H3>리소스 정책 (Resource Policies)</H3>
      <Ul
        items={[
          <>API Gateway 자체에 붙이는 JSON 정책 — <b>누가 API에 접근 가능한지</b> 정의</>,
          <>주 사용처: <b>특정 IP 대역 허용/차단</b>, <b>VPC 엔드포인트만 허용</b>(Private API), <b>교차 계정 접근</b></>,
        ]}
      />
      <Callout type="exam" title="문제 풀이 공식">
        "다른 AWS 계정에서 접근" → <b>IAM + 리소스 정책</b> / "우리 앱 회원 로그인" → <b>Cognito</b> / "기존 사내
        인증 서버·외부 IdP 재사용" → <b>Lambda Authorizer</b>. 이 3줄만 외워도 대부분의 문제가 풀립니다.
      </Callout>
    </>
  );
}

function SecRestVsHttp() {
  return (
    <>
      <P>
        HTTP API는 REST API의 <b style={{ color: C.ink }}>저비용·저지연 경량 버전</b>입니다. 기능 차이가 곧 시험
        문제입니다.
      </P>
      <Table
        head={["", "HTTP API", "REST API"]}
        rows={[
          ["비용 / 지연", <b style={{ color: C.teal }}>저렴 · 낮은 지연</b>, "상대적으로 비쌈"],
          ["통합", "프록시 통합만 (Lambda 프록시, HTTP 프록시, Private)", "모든 통합 (비프록시 + 매핑 템플릿 포함)"],
          ["인증", <>OIDC · OAuth 2.0 · <b>JWT 내장 지원</b></>, "IAM · Cognito · Lambda Authorizer"],
          ["리소스 정책", <b style={{ color: C.rose }}>없음</b>, "있음"],
          ["사용 계획 / API 키", <b style={{ color: C.rose }}>없음</b>, "있음"],
          ["캐싱 / 요청 검증 / X-Ray", <b style={{ color: C.rose }}>없음</b>, "있음"],
          ["CORS", "내장 지원", "지원"],
        ]}
      />
      <Callout type="tip">
        문제에 <b>"매핑 템플릿 · 사용 계획 · API 키 · 캐싱 · 리소스 정책"</b> 중 하나라도 나오면 → <b>REST API</b>.{" "}
        "가장 저렴하게 Lambda를 노출" → <b>HTTP API</b>.
      </Callout>
    </>
  );
}

function SecWebSocket() {
  return (
    <>
      <P>
        WebSocket API는 클라이언트와 서버 간 <b style={{ color: C.ink }}>양방향(two-way) 실시간 통신</b>을 제공합니다.
        서버가 먼저 클라이언트에게 데이터를 푸시할 수 있는 <b>Stateful</b> 애플리케이션에 사용합니다 — 채팅, 멀티플레이어
        게임, 금융 거래 플랫폼이 대표 사례입니다.
      </P>
      <WsDiagram />
      <H3>연결 수명주기와 URL</H3>
      <Ul
        items={[
          <>연결 URL: <Pill>{"wss://[api-id].execute-api.[region].amazonaws.com/[stage]"}</Pill></>,
          <>연결 시 <Pill color={C.amber}>connectionId</Pill>가 부여되며 연결이 유지되는 동안 동일 — 보통 DynamoDB에
            사용자 메타데이터와 함께 저장</>,
        ]}
      />
      <H3>서버 → 클라이언트 전송 (Connection URL Callback)</H3>
      <Ul
        items={[
          <>연결 URL 뒤에 <Pill>{"/@connections/{connectionId}"}</Pill>를 붙여 HTTPS로 호출 (<b>IAM SigV4</b> 서명 필요)</>,
          <><Pill>POST</Pill> = 클라이언트로 메시지 전송 · <Pill>GET</Pill> = 연결 상태 확인 · <Pill>DELETE</Pill> = 연결
            종료</>,
        ]}
      />
      <H3>라우팅 (Routing)</H3>
      <Ul
        items={[
          <>기본 라우트 3개: <Pill color={C.teal}>$connect</Pill> · <Pill color={C.rose}>$disconnect</Pill> ·{" "}
            <Pill>$default</Pill></>,
          <>커스텀 라우트: <b>route selection expression</b>으로 JSON 메시지의 필드를 평가 — 예:{" "}
            <Pill color={C.amber}>$request.body.action</Pill> 값이 <Pill>"join"</Pill>이면 join 라우트의 백엔드로</>,
          <>매칭되는 라우트가 없으면 <Pill>$default</Pill>로 전달</>,
        ]}
      />
      <Callout type="exam">
        "서버가 클라이언트에 실시간으로 푸시" · "채팅 앱" · "connectionId" → <b>WebSocket API</b>. 그리고 서버→클라이언트
        전송에는 <b>@connections 콜백 URL + POST + SigV4</b>라는 조합을 기억하세요.
      </Callout>
    </>
  );
}

function SecArch() {
  return (
    <>
      <P>
        섹션 마지막의 아키텍처 강의는 <b style={{ color: C.ink }}>정적 콘텐츠(S3)와 REST API를 하나의 도메인으로
        통합</b>하는 패턴을 다룹니다.
      </P>
      <ArchDiagram />
      <Ul
        items={[
          <>CloudFront를 최상단에 두고 <b>경로 기반 라우팅</b>: <Pill>/</Pill> → S3 오리진, <Pill>/api</Pill> → API
            Gateway 오리진</>,
          <>장점: <b>단일 도메인</b>(CORS 문제 회피), 단일 SSL 인증서, 엣지 캐싱, 정적/동적 콘텐츠 분리</>,
        ]}
      />
      <Callout type="tip">
        S3 정적 웹사이트가 <b>다른 도메인</b>의 API Gateway를 직접 호출하면 CORS 설정이 필수지만, CloudFront로 같은
        도메인에 묶으면 CORS 자체가 필요 없어집니다. 두 접근을 비교하는 문제가 나옵니다.
      </Callout>
    </>
  );
}

/* ═══════════════ 섹션 정의 ═══════════════ */
const SECTIONS = [
  { id: "overview", no: "340", title: "API Gateway 개요", freq: 3, comp: SecOverview },
  { id: "stages", no: "342", title: "단계(Stage) 및 배포", freq: 3, comp: SecStages },
  { id: "canary", no: "345", title: "Canary 배포", freq: 2, comp: SecCanary },
  { id: "integration", no: "347", title: "통합 유형 및 매핑 템플릿", freq: 3, comp: SecIntegration },
  { id: "openapi", no: "349", title: "OpenAPI & 요청 검증", freq: 1, comp: SecOpenApi },
  { id: "cache", no: "351", title: "캐싱", freq: 2, comp: SecCache },
  { id: "usage", no: "352", title: "사용 계획 & API 키", freq: 2, comp: SecUsagePlan },
  { id: "monitoring", no: "353", title: "모니터링·로깅·추적", freq: 2, comp: SecMonitoring },
  { id: "cors", no: "354", title: "CORS", freq: 2, comp: SecCors },
  { id: "auth", no: "355", title: "인증 및 권한 부여", freq: 3, comp: SecAuth },
  { id: "restvshttp", no: "357", title: "REST API vs HTTP API", freq: 2, comp: SecRestVsHttp },
  { id: "websocket", no: "358", title: "WebSocket API", freq: 1, comp: SecWebSocket },
  { id: "arch", no: "359", title: "아키텍처 패턴", freq: 1, comp: SecArch },
];

/* ═══════════════ 메인 앱 ═══════════════ */
export default function App() {
  const [active, setActive] = useState("overview");
  const sec = SECTIONS.find((s) => s.id === active);
  const Comp = sec.comp;
  const idx = SECTIONS.findIndex((s) => s.id === active);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: sans, color: C.ink }}>
      {/* 헤더 */}
      <header
        style={{
          padding: "26px 24px 20px",
          borderBottom: `1px solid ${C.line}`,
          background: `radial-gradient(1200px 300px at 20% -50%, ${C.amber}12, transparent)`,
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontFamily: mono, fontSize: 11.5, color: C.amber, letterSpacing: 2, marginBottom: 8 }}>
            AWS CERTIFIED DEVELOPER — ASSOCIATE (DVA-C02)
          </div>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
            Amazon API Gateway <span style={{ color: C.amber }}>완전 정복</span>
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, color: C.sub }}>
            강의 339–359 전 개념 (실습 제외) · 다이어그램 중심 · 빈출도 표시
          </p>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          gap: 0,
          alignItems: "flex-start",
        }}
      >
        {/* 사이드바 */}
        <nav
          style={{
            width: 258,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            maxHeight: "100vh",
            overflowY: "auto",
            padding: "18px 12px 30px",
            borderRight: `1px solid ${C.line}`,
            display: "var(--nav-display, block)",
          }}
          className="side-nav"
        >
          {SECTIONS.map((s) => {
            const on = s.id === active;
            const fc = { 3: C.rose, 2: C.amber, 1: C.teal }[s.freq];
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActive(s.id);
                  window.scrollTo({ top: 0 });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 10px",
                  marginBottom: 2,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: on ? `${C.amber}14` : "transparent",
                  color: on ? C.ink : C.sub,
                  fontSize: 13.5,
                  fontWeight: on ? 700 : 500,
                  fontFamily: sans,
                }}
              >
                <span style={{ fontFamily: mono, fontSize: 10.5, color: on ? C.amber : C.dim, width: 26 }}>{s.no}</span>
                <span style={{ flex: 1 }}>{s.title}</span>
                <span style={{ display: "inline-flex", gap: 2 }}>
                  {[1, 2, 3].map((i) => (
                    <span key={i} style={{ width: 4, height: 8, borderRadius: 1, background: i <= s.freq ? fc : `${fc}28` }} />
                  ))}
                </span>
              </button>
            );
          })}
          <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: 8, background: C.surface, fontSize: 11, fontFamily: mono, color: C.dim, lineHeight: 2 }}>
            <div><span style={{ color: C.rose }}>▮▮▮</span> 최빈출</div>
            <div><span style={{ color: C.amber }}>▮▮</span>&nbsp;&nbsp;빈출</div>
            <div><span style={{ color: C.teal }}>▮</span>&nbsp;&nbsp;&nbsp;가끔 출제</div>
          </div>
        </nav>

        {/* 본문 */}
        <main style={{ flex: 1, minWidth: 0, padding: "22px clamp(16px, 3vw, 34px) 60px" }}>
          {/* 모바일용 셀렉트 */}
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="mobile-nav"
            style={{
              display: "none",
              width: "100%",
              marginBottom: 16,
              padding: "10px 12px",
              borderRadius: 8,
              background: C.surface,
              color: C.ink,
              border: `1px solid ${C.line}`,
              fontSize: 14,
              fontFamily: sans,
            }}
          >
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.no} · {s.title}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: C.dim }}>강의 {sec.no}</span>
            <Freq level={sec.freq} />
          </div>
          <h2 style={{ fontSize: "clamp(19px, 3vw, 25px)", fontWeight: 800, margin: "6px 0 4px", letterSpacing: -0.3 }}>
            {sec.title}
          </h2>

          <Comp />

          {/* 이전/다음 */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 44, gap: 12 }}>
            {idx > 0 ? (
              <button
                onClick={() => { setActive(SECTIONS[idx - 1].id); window.scrollTo({ top: 0 }); }}
                style={{ padding: "10px 16px", borderRadius: 9, border: `1px solid ${C.line}`, background: C.surface, color: C.sub, fontSize: 13, cursor: "pointer", fontFamily: sans }}
              >
                ← {SECTIONS[idx - 1].title}
              </button>
            ) : <span />}
            {idx < SECTIONS.length - 1 ? (
              <button
                onClick={() => { setActive(SECTIONS[idx + 1].id); window.scrollTo({ top: 0 }); }}
                style={{ padding: "10px 16px", borderRadius: 9, border: `1px solid ${C.amber}55`, background: `${C.amber}12`, color: C.amber, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: sans }}
              >
                {SECTIONS[idx + 1].title} →
              </button>
            ) : <span />}
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .side-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }
        button:focus-visible, select:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
