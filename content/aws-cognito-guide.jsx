//fable 5 high
import { useState } from "react";

/* ─────────────────────────  디자인 토큰  ───────────────────────── */
const C = {
  ink: "#16202E", // 본문 잉크
  paper: "#F7F6F2", // 배경
  card: "#FFFFFF",
  line: "#E3E0D8",
  orange: "#EC7211", // AWS 오렌지 (강조)
  orangeSoft: "#FDEBDD",
  navy: "#232F3E", // AWS 네이비
  blue: "#2E6DA8", // 흐름/링크
  blueSoft: "#E8F1F9",
  green: "#2F8459",
  greenSoft: "#E6F3EC",
  red: "#C2452D",
  redSoft: "#FBEAE6",
  purple: "#6B4FA0",
  purpleSoft: "#F0EBF8",
  gray: "#6B7280",
  graySoft: "#F1F0EC",
};

const font = {
  fontFamily:
    "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/* ─────────────────────────  작은 공용 컴포넌트  ───────────────────────── */

function Stars({ n }) {
  return (
    <span style={{ color: C.orange, letterSpacing: 2 }}>
      {"★".repeat(n)}
      <span style={{ color: C.line }}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

function FreqBadge({ level, note }) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-2 mb-5"
      style={{ background: C.orangeSoft, border: `1px solid ${C.orange}33` }}
    >
      <span
        className="text-xs font-bold px-2 py-1 rounded"
        style={{ background: C.orange, color: "#fff" }}
      >
        시험 빈출도
      </span>
      <Stars n={level} />
      <span className="text-xs" style={{ color: C.ink }}>
        {note}
      </span>
    </div>
  );
}

function Card({ title, color = C.blue, children }) {
  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ background: C.card, border: `1px solid ${C.line}` }}
    >
      {title && (
        <div
          className="text-sm font-bold mb-2 pb-2"
          style={{ color, borderBottom: `2px solid ${color}22` }}
        >
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed" style={{ color: C.ink }}>
        {children}
      </div>
    </div>
  );
}

function KW({ children }) {
  return (
    <span
      className="font-semibold px-1 rounded"
      style={{ background: C.orangeSoft, color: "#9A4A0B" }}
    >
      {children}
    </span>
  );
}

function Li({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span style={{ color: C.orange }}>▸</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function ExamTip({ children }) {
  return (
    <div
      className="rounded-lg px-4 py-3 my-3 text-sm"
      style={{
        background: C.navy,
        color: "#F3EFE7",
        borderLeft: `4px solid ${C.orange}`,
      }}
    >
      <span className="font-bold" style={{ color: "#FFB169" }}>
        📝 시험 포인트&nbsp;
      </span>
      {children}
    </div>
  );
}

/* ─────────────────────  인터랙티브 단계 플로우 래퍼  ───────────────────── */
function StepPlayer({ steps, children, label }) {
  const [step, setStep] = useState(0);
  return (
    <div
      className="rounded-xl overflow-hidden mb-4"
      style={{ border: `1px solid ${C.line}`, background: C.card }}
    >
      <div
        className="px-4 py-2 text-xs font-bold flex items-center justify-between"
        style={{ background: C.navy, color: "#fff" }}
      >
        <span>⚡ {label} — 버튼을 눌러 단계별로 따라가 보세요</span>
        <span style={{ color: "#FFB169" }}>
          {step + 1} / {steps.length}
        </span>
      </div>
      <div className="p-2">{children(step)}</div>
      <div
        className="px-4 py-3 flex items-center gap-3 flex-wrap"
        style={{ background: C.graySoft, borderTop: `1px solid ${C.line}` }}
      >
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-3 py-1.5 rounded-md text-xs font-bold disabled:opacity-30"
          style={{
            background: "#fff",
            border: `1px solid ${C.line}`,
            color: C.ink,
          }}
        >
          ← 이전
        </button>
        <button
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="px-3 py-1.5 rounded-md text-xs font-bold disabled:opacity-30"
          style={{ background: C.orange, color: "#fff" }}
        >
          다음 단계 →
        </button>
        <div
          className="text-xs flex-1 min-w-40 font-medium"
          style={{ color: C.ink }}
        >
          <span
            className="inline-block w-5 h-5 rounded-full text-center mr-1.5 font-bold"
            style={{ background: C.orange, color: "#fff", lineHeight: "20px" }}
          >
            {step + 1}
          </span>
          {steps[step]}
        </div>
      </div>
    </div>
  );
}

/* SVG 공용 조각 */
const boxStyle = (active, fill, stroke) => ({
  fill: active ? fill : "#FBFAF7",
  stroke: active ? stroke : C.line,
  strokeWidth: active ? 2 : 1.2,
});
const txt = (active, color) => ({
  fill: active ? color : "#9AA0A8",
  fontWeight: active ? 700 : 500,
  fontSize: 12,
});
const arrow = (active, color = C.blue) => ({
  stroke: active ? color : "#D8D5CC",
  strokeWidth: active ? 2.5 : 1.5,
  fill: "none",
  markerEnd: active ? "url(#ah)" : "url(#ahGray)",
});
const arrowLabel = (active, color = C.blue) => ({
  fill: active ? color : "#C4C1B8",
  fontSize: 10.5,
  fontWeight: active ? 700 : 500,
});

function Defs() {
  return (
    <defs>
      <marker
        id="ah"
        markerWidth="8"
        markerHeight="8"
        refX="7"
        refY="4"
        orient="auto"
      >
        <path d="M0,0 L8,4 L0,8 z" fill={C.blue} />
      </marker>
      <marker
        id="ahGray"
        markerWidth="8"
        markerHeight="8"
        refX="7"
        refY="4"
        orient="auto"
      >
        <path d="M0,0 L8,4 L0,8 z" fill="#D8D5CC" />
      </marker>
      <marker
        id="ahOr"
        markerWidth="8"
        markerHeight="8"
        refX="7"
        refY="4"
        orient="auto"
      >
        <path d="M0,0 L8,4 L0,8 z" fill={C.orange} />
      </marker>
    </defs>
  );
}

/* ═════════════════════════  1. 개요 (394)  ═════════════════════════ */
function Overview() {
  return (
    <div>
      <FreqBadge
        level={4}
        note="DVA(개발자)에서 매우 자주 출제 · SAA(설계)에서도 키워드 문제로 꾸준히 등장"
      />

      <Card title="Cognito란?" color={C.orange}>
        <p className="mb-2">
          <KW>Amazon Cognito</KW>는 <b>웹/모바일 애플리케이션의 사용자</b>에게
          자격 증명(Identity)을 부여하는 서비스입니다. 핵심은 이 사용자들이{" "}
          <b>AWS 계정 밖에 있는 외부 사용자</b>라는 점입니다.
        </p>
        <Li
          items={[
            <>
              <b>Cognito User Pools (CUP)</b> — 앱 사용자를 위한{" "}
              <KW>로그인/인증(Authentication)</KW> 기능. 서버리스 사용자 DB.
            </>,
            <>
              <b>Cognito Identity Pools (CIP, 연합 자격 증명)</b> — 사용자에게{" "}
              <KW>임시 AWS 자격 증명(Authorization)</KW>을 부여해 AWS 리소스에
              직접 접근하게 함.
            </>,
          ]}
        />
      </Card>

      <svg
        viewBox="0 0 700 300"
        className="w-full mb-4 rounded-xl"
        style={{ background: C.card, border: `1px solid ${C.line}` }}
      >
        <Defs />
        <text
          x="350"
          y="28"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill={C.navy}
        >
          Cognito의 두 축
        </text>
        {/* 사용자 */}
        <circle
          cx="80"
          cy="150"
          r="26"
          fill={C.blueSoft}
          stroke={C.blue}
          strokeWidth="2"
        />
        <text x="80" y="155" textAnchor="middle" fontSize="18">
          👤
        </text>
        <text
          x="80"
          y="195"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={C.ink}
        >
          웹/모바일 사용자
        </text>
        <text x="80" y="209" textAnchor="middle" fontSize="9.5" fill={C.gray}>
          (AWS 계정 밖의 수백만 명)
        </text>
        {/* CUP */}
        <rect
          x="230"
          y="60"
          width="200"
          height="80"
          rx="10"
          fill={C.orangeSoft}
          stroke={C.orange}
          strokeWidth="2"
        />
        <text
          x="330"
          y="88"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#9A4A0B"
        >
          User Pools (CUP)
        </text>
        <text x="330" y="107" textAnchor="middle" fontSize="10.5" fill={C.ink}>
          "너 누구야?" → 인증(Authentication)
        </text>
        <text x="330" y="123" textAnchor="middle" fontSize="10.5" fill={C.ink}>
          로그인 성공 시 JWT 토큰 발급
        </text>
        {/* CIP */}
        <rect
          x="230"
          y="170"
          width="200"
          height="80"
          rx="10"
          fill={C.greenSoft}
          stroke={C.green}
          strokeWidth="2"
        />
        <text
          x="330"
          y="198"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill={C.green}
        >
          Identity Pools (CIP)
        </text>
        <text x="330" y="217" textAnchor="middle" fontSize="10.5" fill={C.ink}>
          "뭘 할 수 있어?" → 인가(Authorization)
        </text>
        <text x="330" y="233" textAnchor="middle" fontSize="10.5" fill={C.ink}>
          임시 AWS 자격 증명 발급 (STS)
        </text>
        {/* 대상 */}
        <rect
          x="510"
          y="60"
          width="150"
          height="80"
          rx="10"
          fill="#FBFAF7"
          stroke={C.line}
        />
        <text
          x="585"
          y="95"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={C.ink}
        >
          API Gateway / ALB
        </text>
        <text x="585" y="112" textAnchor="middle" fontSize="10" fill={C.gray}>
          백엔드 API 보호
        </text>
        <rect
          x="510"
          y="170"
          width="150"
          height="80"
          rx="10"
          fill="#FBFAF7"
          stroke={C.line}
        />
        <text
          x="585"
          y="205"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={C.ink}
        >
          S3 · DynamoDB 등
        </text>
        <text x="585" y="222" textAnchor="middle" fontSize="10" fill={C.gray}>
          AWS 리소스 직접 접근
        </text>
        {/* 화살표 */}
        <path d="M110,135 C160,110 190,100 226,100" style={arrow(true)} />
        <path
          d="M110,165 C160,190 190,205 226,208"
          style={arrow(true, C.green)}
        />
        <path d="M434,100 L506,100" style={arrow(true)} />
        <path d="M434,208 L506,208" style={arrow(true, C.green)} />
        <text x="165" y="95" style={arrowLabel(true)}>
          로그인
        </text>
        <text x="150" y="205" style={arrowLabel(true, C.green)}>
          자격 증명 요청
        </text>
      </svg>

      <Card title="IAM과의 구분 — 시험 단골" color={C.red}>
        <Li
          items={[
            <>
              <b>IAM</b>: 여러분이 <b>신뢰하는 내부 사용자</b> — 개발자, 관리자,
              AWS 계정 안의 주체.
            </>,
            <>
              <b>Cognito</b>: <b>수백~수백만 명의 외부 앱 사용자</b> — 모바일/웹
              앱 고객.
            </>,
          ]}
        />
        <ExamTip>
          문제에 <KW>"hundreds of users"</KW>, <KW>"mobile"</KW>,{" "}
          <KW>"authenticate with SAML / 소셜 로그인"</KW> 같은 표현이 나오면
          답은 거의 항상 <b>Cognito</b>입니다.
        </ExamTip>
      </Card>
    </div>
  );
}

/* ═════════════════════  2. 사용자 풀 CUP (395)  ═════════════════════ */
function CupFlow(step) {
  const s = (n) => step >= n;
  return (
    <svg viewBox="0 0 700 290" className="w-full">
      <Defs />
      {/* 사용자 */}
      <circle
        cx="70"
        cy="120"
        r="26"
        style={boxStyle(true, C.blueSoft, C.blue)}
      />
      <text x="70" y="126" textAnchor="middle" fontSize="18">
        👤
      </text>
      <text x="70" y="165" textAnchor="middle" style={txt(true, C.ink)}>
        사용자 (앱)
      </text>
      {/* CUP */}
      <rect
        x="250"
        y="70"
        width="190"
        height="100"
        rx="10"
        style={boxStyle(s(0), C.orangeSoft, C.orange)}
      />
      <text
        x="345"
        y="98"
        textAnchor="middle"
        style={{ ...txt(s(0), "#9A4A0B"), fontSize: 13 }}
      >
        Cognito User Pool
      </text>
      <text x="345" y="118" textAnchor="middle" style={txt(s(0), C.ink)}>
        서버리스 사용자 DB
      </text>
      <text x="345" y="136" textAnchor="middle" style={txt(s(1), C.ink)}>
        ID/PW 검증 · MFA
      </text>
      <text x="345" y="154" textAnchor="middle" style={txt(s(1), C.ink)}>
        이메일/전화 확인
      </text>
      {/* 소셜 */}
      <rect
        x="250"
        y="205"
        width="190"
        height="60"
        rx="10"
        style={boxStyle(s(4), C.purpleSoft, C.purple)}
      />
      <text x="345" y="230" textAnchor="middle" style={txt(s(4), C.purple)}>
        연합 로그인 (Federation)
      </text>
      <text x="345" y="248" textAnchor="middle" style={txt(s(4), C.ink)}>
        Google · Facebook · SAML · OIDC
      </text>
      {/* JWT */}
      <rect
        x="500"
        y="80"
        width="170"
        height="80"
        rx="10"
        style={boxStyle(s(2), C.greenSoft, C.green)}
      />
      <text
        x="585"
        y="108"
        textAnchor="middle"
        style={{ ...txt(s(2), C.green), fontSize: 13 }}
      >
        JWT 토큰 반환
      </text>
      <text x="585" y="128" textAnchor="middle" style={txt(s(2), C.ink)}>
        ID · Access · Refresh
      </text>
      <text x="585" y="146" textAnchor="middle" style={txt(s(3), C.ink)}>
        → API GW / ALB 에 제시
      </text>
      {/* 화살표 */}
      <path d="M100,110 L245,105" style={arrow(s(0))} />
      <text x="130" y="95" style={arrowLabel(s(0))}>
        ① 로그인 (ID/PW)
      </text>
      <path d="M444,110 L495,112" style={arrow(s(2), C.green)} />
      <text x="440" y="98" style={arrowLabel(s(2), C.green)}>
        ③ JWT
      </text>
      <path d="M345,200 L345,175" style={arrow(s(4), C.purple)} />
      <text x="360" y="192" style={arrowLabel(s(4), C.purple)}>
        대신 소셜/기업 계정으로도 OK
      </text>
    </svg>
  );
}

function UserPools() {
  return (
    <div>
      <FreqBadge
        level={5}
        note="CUP 자체 + JWT + API Gateway 연동은 DVA 최빈출 주제 중 하나"
      />

      <Card title="Cognito User Pools (CUP) = 인증" color={C.orange}>
        <Li
          items={[
            <>
              웹/모바일 앱 사용자를 위한 <KW>서버리스 사용자 데이터베이스</KW>
              이자 로그인 기능.
            </>,
            <>
              <b>간편 로그인</b>: 사용자 이름(또는 이메일) + 비밀번호, 비밀번호
              재설정 지원.
            </>,
            <>
              이메일 · 전화번호 <b>확인(verification)</b> 기능 내장.
            </>,
            <>
              <KW>MFA(다요소 인증)</KW> 지원.
            </>,
            <>
              <b>연합 자격 증명(Federated Identities)</b>: Facebook, Google,
              SAML, OpenID Connect 계정으로 로그인 가능. (⚠ Identity Pool과 별개
              — CUP 자체 기능)
            </>,
            <>
              유출된 자격 증명 차단: 비밀번호가 다른 곳에서 유출된 것으로
              확인되면 로그인 차단 가능.
            </>,
            <>
              로그인 성공 시 <KW>JWT(JSON Web Token)</KW> 반환.
            </>,
          ]}
        />
      </Card>

      <StepPlayer
        label="CUP 로그인 흐름"
        steps={[
          "사용자가 앱에서 ID/비밀번호로 User Pool에 로그인 요청",
          "CUP이 자격 증명 검증 — 필요 시 MFA, 이메일/전화 확인 수행",
          "인증 성공 → JWT(ID·Access·Refresh 토큰) 발급",
          "앱은 이 JWT를 API Gateway나 ALB에 제시해 백엔드 접근",
          "직접 가입 대신 Google/Facebook/SAML 등 연합 로그인도 CUP이 처리",
        ]}
      >
        {(step) => CupFlow(step)}
      </StepPlayer>

      <Card title="주요 통합 대상" color={C.blue}>
        <Li
          items={[
            <>
              <KW>API Gateway</KW> — Cognito Authorizer로 JWT를 검증해 API 보호
              (매우 흔한 아키텍처).
            </>,
            <>
              <KW>Application Load Balancer</KW> — 리스너에서 인증을 수행하고
              뒤의 백엔드로 전달 (398강 참고).
            </>,
          ]}
        />
      </Card>

      <ExamTip>
        "사용자 DB를 직접 운영하지 않고 회원가입·로그인·MFA를 구현하고 싶다" →{" "}
        <b>Cognito User Pools</b>. "로그인 후 받은 토큰"이라는 표현이 나오면{" "}
        <b>JWT</b>를 떠올리세요.
      </ExamTip>
    </div>
  );
}

/* ═════════════════════  3. CUP 기타 (397)  ═════════════════════ */
function UserPoolsExtra() {
  const triggers = [
    ["Pre Sign-up", "가입 요청 수락 전 커스텀 검증"],
    ["Post Confirmation", "가입 확인 후 환영 메시지·초기화 로직"],
    ["Pre Authentication", "로그인 요청 수락 전 커스텀 검증/차단"],
    ["Post Authentication", "로그인 후 이벤트 로깅·분석"],
    ["Pre Token Generation", "토큰 발급 직전 클레임 추가/수정"],
    ["User Migration", "기존 사용자 DB에서 CUP로 마이그레이션"],
    ["Custom Message", "인증/확인 메시지 내용 커스터마이징"],
    ["Custom Auth Flow", "CAPTCHA 등 커스텀 인증 챌린지 정의"],
  ];
  return (
    <div>
      <FreqBadge
        level={4}
        note="Lambda 트리거·Hosted UI 커스텀 도메인·적응형 인증은 DVA 단골 지엽 포인트"
      />

      <Card title="① Lambda 트리거" color={C.purple}>
        <p className="mb-3">
          CUP은 인증 라이프사이클의 각 시점에 <KW>Lambda 함수를 동기 호출</KW>
          하도록 연결할 수 있습니다.
        </p>
        <svg viewBox="0 0 700 120" className="w-full mb-3">
          <Defs />
          {[
            "가입\n(Sign-up)",
            "확인\n(Confirm)",
            "로그인\n(Auth)",
            "토큰 발급\n(Token)",
          ].map((t, i) => (
            <g key={i}>
              <rect
                x={30 + i * 170}
                y={30}
                width={130}
                height={44}
                rx={8}
                fill={C.orangeSoft}
                stroke={C.orange}
                strokeWidth="1.5"
              />
              {t.split("\n").map((line, j) => (
                <text
                  key={j}
                  x={95 + i * 170}
                  y={48 + j * 15}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#9A4A0B"
                >
                  {line}
                </text>
              ))}
              <text
                x={95 + i * 170}
                y={100}
                textAnchor="middle"
                fontSize="10"
                fill={C.purple}
                fontWeight="700"
              >
                ⚡ Pre / Post Lambda
              </text>
              {i < 3 && (
                <path
                  d={`M${162 + i * 170},52 L${196 + i * 170},52`}
                  style={arrow(true, C.orange)}
                  markerEnd="url(#ahOr)"
                />
              )}
            </g>
          ))}
        </svg>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {triggers.map(([name, desc]) => (
            <div
              key={name}
              className="rounded-lg px-3 py-2 text-xs"
              style={{ background: C.purpleSoft }}
            >
              <b style={{ color: C.purple }}>{name}</b>
              <span style={{ color: C.ink }}> — {desc}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="② Hosted UI (호스팅된 로그인 페이지)" color={C.blue}>
        <Li
          items={[
            <>
              Cognito가 <KW>로그인·가입·비밀번호 재설정 UI를 대신 호스팅</KW> —
              앱은 리다이렉트만 하면 됨.
            </>,
            <>로고와 CSS로 외관 커스터마이징 가능.</>,
            <>
              <b>커스텀 도메인</b> 사용 가능 — 단, 이때 ACM 인증서는 반드시{" "}
              <KW>us-east-1 (버지니아 북부)</KW>에 있어야 함.
            </>,
            <>
              커스텀 도메인은 User Pool의 <b>"App Integration"</b> 섹션에서
              정의.
            </>,
          ]}
        />
        <ExamTip>
          "Hosted UI + 커스텀 도메인 + 인증서 위치" →{" "}
          <b>ACM 인증서는 us-east-1</b>. CloudFront와 같은 규칙이라 세트로
          외우면 좋습니다.
        </ExamTip>
      </Card>

      <Card title="③ 적응형 인증 (Adaptive Authentication)" color={C.red}>
        <p className="mb-2">
          로그인 시도의 <b>위험도(Risk Score)</b>를 계산해 의심스러우면{" "}
          <KW>추가로 MFA를 요구</KW>하거나 차단합니다.
        </p>
        <svg viewBox="0 0 700 110" className="w-full mb-2">
          <Defs />
          {[
            ["낮음 (Low)", C.greenSoft, C.green, "그냥 통과"],
            ["중간 (Medium)", C.orangeSoft, C.orange, "MFA 요구"],
            ["높음 (High)", C.redSoft, C.red, "MFA 요구 / 차단"],
          ].map(([label, bg, stroke, action], i) => (
            <g key={i}>
              <rect
                x={40 + i * 220}
                y={20}
                width={180}
                height={60}
                rx={10}
                fill={bg}
                stroke={stroke}
                strokeWidth="2"
              />
              <text
                x={130 + i * 220}
                y={46}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={stroke}
              >
                {label}
              </text>
              <text
                x={130 + i * 220}
                y={66}
                textAnchor="middle"
                fontSize="11"
                fill={C.ink}
              >
                {action}
              </text>
            </g>
          ))}
        </svg>
        <Li
          items={[
            <>
              위험 판단 근거: 새 디바이스, 새 위치(IP), 비정상 로그인 패턴 등.
            </>,
            <>
              차단된 자격 증명(compromised credentials), 계정 탈취 방지 통합.
            </>,
            <>
              로그인 시도와 위험 점수는 <KW>CloudWatch Logs</KW>로 내보내
              모니터링 가능.
            </>,
          ]}
        />
      </Card>

      <Card title="④ JWT 토큰 구조 — 디코딩 문제 대비" color={C.green}>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          {[
            ["Header", "서명 알고리즘·키 ID", C.blueSoft, C.blue],
            ["Payload", "사용자 정보 (클레임)", C.greenSoft, C.green],
            ["Signature", "위·변조 검증용 서명", C.purpleSoft, C.purple],
          ].map(([t, d, bg, col]) => (
            <div
              key={t}
              className="flex-1 rounded-lg p-3 text-center"
              style={{ background: bg, border: `1.5px solid ${col}` }}
            >
              <div className="font-bold text-sm" style={{ color: col }}>
                {t}
              </div>
              <div className="text-xs mt-1" style={{ color: C.ink }}>
                {d}
              </div>
            </div>
          ))}
        </div>
        <Li
          items={[
            <>
              Payload를 base64 디코딩하면 <KW>sub</KW>(사용자 고유 UUID), 이름,
              이메일, 전화번호, 만료 시간 등 확인 가능.
            </>,
            <>
              <b>sub</b> UUID로 CUP DB에서 사용자 상세 정보를 조회할 수 있음.
            </>,
            <>서명이 유효해야만 신뢰 — 위·변조된 토큰은 검증 실패.</>,
          ]}
        />
      </Card>
    </div>
  );
}

/* ═════════════════════  4. ALB 인증 (398)  ═════════════════════ */
function AlbFlow(step) {
  const s = (n) => step >= n;
  return (
    <svg viewBox="0 0 700 300" className="w-full">
      <Defs />
      <circle
        cx="60"
        cy="140"
        r="26"
        style={boxStyle(true, C.blueSoft, C.blue)}
      />
      <text x="60" y="146" textAnchor="middle" fontSize="18">
        👤
      </text>
      <text x="60" y="185" textAnchor="middle" style={txt(true, C.ink)}>
        사용자
      </text>
      {/* ALB */}
      <rect
        x="200"
        y="80"
        width="180"
        height="120"
        rx="10"
        style={boxStyle(s(0), C.orangeSoft, C.orange)}
      />
      <text
        x="290"
        y="106"
        textAnchor="middle"
        style={{ ...txt(s(0), "#9A4A0B"), fontSize: 13 }}
      >
        ALB
      </text>
      <text x="290" y="126" textAnchor="middle" style={txt(s(0), C.ink)}>
        HTTPS 리스너 (필수)
      </text>
      <text x="290" y="146" textAnchor="middle" style={txt(s(1), C.ink)}>
        규칙: authenticate-cognito
      </text>
      <text x="290" y="164" textAnchor="middle" style={txt(s(1), C.ink)}>
        또는 authenticate-oidc
      </text>
      {/* CUP */}
      <rect
        x="230"
        y="235"
        width="180"
        height="50"
        rx="10"
        style={boxStyle(s(2), C.purpleSoft, C.purple)}
      />
      <text x="320" y="256" textAnchor="middle" style={txt(s(2), C.purple)}>
        Cognito User Pool
      </text>
      <text x="320" y="273" textAnchor="middle" style={txt(s(2), C.ink)}>
        (또는 OIDC IdP)
      </text>
      {/* 백엔드 */}
      <rect
        x="500"
        y="100"
        width="170"
        height="80"
        rx="10"
        style={boxStyle(s(3), C.greenSoft, C.green)}
      />
      <text
        x="585"
        y="130"
        textAnchor="middle"
        style={{ ...txt(s(3), C.green), fontSize: 13 }}
      >
        백엔드 (타깃 그룹)
      </text>
      <text x="585" y="150" textAnchor="middle" style={txt(s(3), C.ink)}>
        인증 로직 없이
      </text>
      <text x="585" y="166" textAnchor="middle" style={txt(s(3), C.ink)}>
        비즈니스 로직에 집중
      </text>
      {/* 화살표 */}
      <path d="M90,135 L195,135" style={arrow(s(0))} />
      <text x="100" y="122" style={arrowLabel(s(0))}>
        ① HTTPS 요청
      </text>
      <path d="M290,205 L308,230" style={arrow(s(2), C.purple)} />
      <text x="180" y="225" style={arrowLabel(s(2), C.purple)}>
        ② 미인증 → 로그인으로
      </text>
      <path d="M345,232 L330,208" style={arrow(s(2), C.purple)} />
      <path d="M384,138 L495,138" style={arrow(s(3), C.green)} />
      <text x="395" y="126" style={arrowLabel(s(3), C.green)}>
        ③ 인증 후 전달
      </text>
    </svg>
  );
}

function AlbAuth() {
  return (
    <div>
      <FreqBadge
        level={3}
        note="SAA·DVA 모두에서 '인증 오프로드' 시나리오로 종종 출제"
      />

      <Card title="핵심 아이디어 — 인증을 ALB로 오프로드" color={C.orange}>
        <Li
          items={[
            <>
              <KW>ALB가 사용자를 대신 인증</KW>하므로 애플리케이션은 인증 코드를
              없애고 <b>비즈니스 로직에 집중</b>할 수 있음.
            </>,
            <>
              반드시 <KW>HTTPS 리스너</KW>에서만 인증 규칙 설정 가능.
            </>,
            <>
              리스너 규칙 액션: <b>authenticate-cognito</b> 또는{" "}
              <b>authenticate-oidc</b>.
            </>,
          ]}
        />
      </Card>

      <StepPlayer
        label="ALB 인증 흐름 (Cognito 방식)"
        steps={[
          "사용자가 ALB의 HTTPS 리스너로 요청",
          "리스너 규칙의 authenticate-cognito 액션이 인증 여부 확인",
          "미인증이면 Cognito(Hosted UI)로 리다이렉트 → 로그인 → 세션 쿠키",
          "인증 완료된 요청만 타깃 그룹(백엔드)으로 전달",
        ]}
      >
        {(step) => AlbFlow(step)}
      </StepPlayer>

      <Card title="두 가지 인증 방식" color={C.blue}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-3" style={{ background: C.orangeSoft }}>
            <div
              className="font-bold text-sm mb-1"
              style={{ color: "#9A4A0B" }}
            >
              A. Cognito User Pools
            </div>
            <ul className="text-xs space-y-1" style={{ color: C.ink }}>
              <li>▸ 소셜 IdP (Amazon, Facebook, Google)</li>
              <li>▸ 기업 자격 증명: SAML, LDAP, Microsoft AD</li>
              <li>
                ▸ 필요: User Pool + <b>User Pool Client</b> +{" "}
                <b>User Pool Domain</b>
              </li>
              <li>
                ▸ IdP에서 <b>콜백 URL로 ALB 주소</b> 허용 필요
              </li>
            </ul>
          </div>
          <div className="rounded-lg p-3" style={{ background: C.purpleSoft }}>
            <div className="font-bold text-sm mb-1" style={{ color: C.purple }}>
              B. OIDC 호환 IdP 직접 연결
            </div>
            <ul className="text-xs space-y-1" style={{ color: C.ink }}>
              <li>▸ authenticate-oidc 액션 사용</li>
              <li>▸ 설정 필요: Authorization 엔드포인트</li>
              <li>▸ Token 엔드포인트 · User Info 엔드포인트</li>
              <li>▸ Client ID / Client Secret</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card title="OnUnauthenticatedRequest — 미인증 요청 처리" color={C.red}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            [
              "authenticate (기본값)",
              "IdP 로그인 페이지로 리다이렉트",
              C.greenSoft,
              C.green,
            ],
            ["deny", "요청 거부 — HTTP 401 반환", C.redSoft, C.red],
            ["allow", "인증 없이 그대로 통과 허용", C.blueSoft, C.blue],
          ].map(([t, d, bg, col]) => (
            <div
              key={t}
              className="rounded-lg p-3"
              style={{ background: bg, border: `1.5px solid ${col}` }}
            >
              <div className="font-bold text-xs" style={{ color: col }}>
                {t}
              </div>
              <div className="text-xs mt-1" style={{ color: C.ink }}>
                {d}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ExamTip>
        "애플리케이션 코드 수정 없이 사용자 인증을 추가" →{" "}
        <b>ALB + authenticate-cognito/oidc</b>. HTTPS 리스너 전제 조건도 함께
        기억하세요.
      </ExamTip>
    </div>
  );
}

/* ═════════════════════  5. 자격 증명 풀 CIP (399)  ═════════════════════ */
function CipFlow(step) {
  const s = (n) => step >= n;
  return (
    <svg viewBox="0 0 700 330" className="w-full">
      <Defs />
      <circle
        cx="60"
        cy="150"
        r="26"
        style={boxStyle(true, C.blueSoft, C.blue)}
      />
      <text x="60" y="156" textAnchor="middle" fontSize="18">
        👤
      </text>
      <text x="60" y="195" textAnchor="middle" style={txt(true, C.ink)}>
        사용자
      </text>
      {/* IdP */}
      <rect
        x="150"
        y="30"
        width="180"
        height="66"
        rx="10"
        style={boxStyle(s(0), C.purpleSoft, C.purple)}
      />
      <text x="240" y="55" textAnchor="middle" style={txt(s(0), C.purple)}>
        로그인 IdP
      </text>
      <text x="240" y="73" textAnchor="middle" style={txt(s(0), C.ink)}>
        CUP · Google · SAML · OIDC…
      </text>
      {/* CIP */}
      <rect
        x="250"
        y="130"
        width="190"
        height="80"
        rx="10"
        style={boxStyle(s(1), C.greenSoft, C.green)}
      />
      <text
        x="345"
        y="158"
        textAnchor="middle"
        style={{ ...txt(s(1), C.green), fontSize: 13 }}
      >
        Cognito Identity Pool
      </text>
      <text x="345" y="178" textAnchor="middle" style={txt(s(1), C.ink)}>
        토큰 검증 후
      </text>
      <text x="345" y="195" textAnchor="middle" style={txt(s(2), C.ink)}>
        STS로 자격 증명 교환
      </text>
      {/* STS */}
      <rect
        x="500"
        y="130"
        width="170"
        height="80"
        rx="10"
        style={boxStyle(s(2), C.orangeSoft, C.orange)}
      />
      <text
        x="585"
        y="158"
        textAnchor="middle"
        style={{ ...txt(s(2), "#9A4A0B"), fontSize: 13 }}
      >
        STS
      </text>
      <text x="585" y="178" textAnchor="middle" style={txt(s(2), C.ink)}>
        임시 AWS 자격 증명
      </text>
      <text x="585" y="195" textAnchor="middle" style={txt(s(2), C.ink)}>
        (IAM 역할 기반)
      </text>
      {/* AWS 리소스 */}
      <rect
        x="380"
        y="250"
        width="290"
        height="60"
        rx="10"
        style={boxStyle(s(3), C.blueSoft, C.blue)}
      />
      <text x="525" y="275" textAnchor="middle" style={txt(s(3), C.blue)}>
        S3 · DynamoDB 등 AWS 리소스 직접 접근
      </text>
      <text x="525" y="293" textAnchor="middle" style={txt(s(3), C.ink)}>
        (IAM 정책 + Policy Variable로 범위 제한)
      </text>
      {/* 게스트 */}
      <rect
        x="60"
        y="250"
        width="240"
        height="60"
        rx="10"
        style={boxStyle(s(4), C.redSoft, C.red)}
      />
      <text x="180" y="275" textAnchor="middle" style={txt(s(4), C.red)}>
        게스트(미인증) 사용자도 가능
      </text>
      <text x="180" y="293" textAnchor="middle" style={txt(s(4), C.ink)}>
        게스트 전용 IAM 역할 부여
      </text>
      {/* 화살표 */}
      <path d="M85,132 L145,80" style={arrow(s(0), C.purple)} />
      <text x="60" y="100" style={arrowLabel(s(0), C.purple)}>
        ① 로그인
      </text>
      <path d="M270,100 L320,126" style={arrow(s(1), C.green)} />
      <text x="300" y="112" style={arrowLabel(s(1), C.green)}>
        ② 토큰 전달
      </text>
      <path
        d="M444,170 L495,170"
        style={arrow(s(2), C.orange)}
        markerEnd="url(#ahOr)"
      />
      <text x="448" y="158" style={arrowLabel(s(2), C.orange)}>
        ③ 교환
      </text>
      <path d="M560,214 L535,246" style={arrow(s(3))} />
      <text x="575" y="235" style={arrowLabel(s(3))}>
        ④ 직접 접근
      </text>
    </svg>
  );
}

function IdentityPools() {
  return (
    <div>
      <FreqBadge
        level={4}
        note="'임시 AWS 자격 증명' + Policy Variable 파티셔닝은 DVA 빈출"
      />

      <Card
        title="Cognito Identity Pools (구 Federated Identities) = 인가"
        color={C.green}
      >
        <Li
          items={[
            <>
              앱 사용자에게 <KW>임시 AWS 자격 증명</KW>을 부여해{" "}
              <b>AWS 계정의 리소스에 직접 접근</b>하게 함.
            </>,
            <>
              자격 증명의 원천(로그인 소스)은 다양: <b>Cognito User Pools</b>,
              소셜(Amazon·Facebook·Google·Apple), OIDC, SAML, 개발자 인증 자격
              증명(커스텀 서버).
            </>,
            <>
              <KW>미인증(게스트) 접근</KW>도 허용 가능 — 로그인 없이 제한된
              권한만 부여.
            </>,
            <>
              사용자는 자격 증명으로 AWS 서비스를 <b>직접</b> 호출하거나{" "}
              <b>API Gateway 경유</b>로 접근.
            </>,
          ]}
        />
      </Card>

      <StepPlayer
        label="CIP 자격 증명 발급 흐름"
        steps={[
          "사용자가 IdP(CUP, Google, SAML 등)에 로그인해 토큰 획득",
          "그 토큰을 Identity Pool에 전달 → CIP가 토큰 유효성 검증",
          "CIP가 STS를 통해 IAM 역할 기반 임시 자격 증명으로 교환",
          "사용자는 임시 자격 증명으로 S3, DynamoDB 등에 직접 접근",
          "로그인 없는 게스트에게도 별도 역할로 제한적 접근 허용 가능",
        ]}
      >
        {(step) => CipFlow(step)}
      </StepPlayer>

      <Card title="IAM 역할과 권한 제어" color={C.blue}>
        <Li
          items={[
            <>
              <b>기본 역할</b>: 인증된(authenticated) 사용자용 / 게스트(guest)
              사용자용 IAM 역할을 각각 지정.
            </>,
            <>
              <b>규칙(Rules)</b>로 사용자 ID·속성에 따라 다른 역할 선택 가능.
            </>,
            <>
              IAM 역할의 <b>신뢰 정책(Trust Policy)</b>은{" "}
              <KW>Cognito Identity</KW>를 신뢰하도록 설정.
            </>,
            <>
              <KW>Policy Variables</KW>로 사용자별 데이터 파티셔닝:
            </>,
          ]}
        />
        <div
          className="mt-3 rounded-lg p-3 text-xs font-mono overflow-x-auto"
          style={{ background: C.navy, color: "#D7F0DE" }}
        >
          <div style={{ color: "#FFB169" }}>// S3 — 자기 프리픽스만 접근</div>
          <div>"s3:prefix": "${"${cognito-identity.amazonaws.com:sub}"}/*"</div>
          <div className="mt-2" style={{ color: "#FFB169" }}>
            // DynamoDB — 자기 행(row)만 접근 (Leading Keys)
          </div>
          <div>
            "dynamodb:LeadingKeys": ["${"${cognito-identity.amazonaws.com:sub}"}
            "]
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: C.gray }}>
          → 한 테이블/버킷을 수백만 사용자가 공유해도 각자 자기 데이터만 보게
          하는 패턴. DVA 단골!
        </p>
      </Card>

      <ExamTip>
        "사용자가 S3/DynamoDB에 <b>직접</b> 접근", "게스트 사용자", "임시 자격
        증명" → <b>Identity Pools</b>. 행/프리픽스 단위 격리 →{" "}
        <b>Policy Variable (LeadingKeys, s3:prefix)</b>.
      </ExamTip>
    </div>
  );
}

/* ═════════════════════  6. CUP vs CIP (401)  ═════════════════════ */
function Comparison() {
  const rows = [
    [
      "역할",
      "인증 (Authentication) — 신원 확인",
      "인가 (Authorization) — AWS 접근 권한",
    ],
    ["산출물", "JWT 토큰", "임시 AWS 자격 증명 (STS)"],
    [
      "사용자 DB",
      "서버리스 사용자 DB 자체 보유",
      "DB 없음 — 외부 IdP 토큰을 교환만",
    ],
    [
      "연합 로그인",
      "Google·FB·SAML·OIDC 로그인 지원",
      "CUP·소셜·SAML·OIDC·커스텀을 소스로 수용",
    ],
    ["게스트", "불가 (로그인이 목적)", "미인증 게스트 접근 가능"],
    ["권한 제어", "—", "IAM 역할 + Policy Variable 세분화"],
    ["주 통합처", "API Gateway · ALB", "S3 · DynamoDB 등 AWS 서비스 직접"],
  ];
  return (
    <div>
      <FreqBadge
        level={5}
        note="두 서비스 구분 문제는 DVA·SAA 공통 최빈출 — 반드시 정리"
      />

      <div
        className="overflow-x-auto rounded-xl mb-4"
        style={{ border: `1px solid ${C.line}` }}
      >
        <table className="w-full text-sm" style={{ background: C.card }}>
          <thead>
            <tr style={{ background: C.navy, color: "#fff" }}>
              <th className="p-3 text-left text-xs w-24">구분</th>
              <th
                className="p-3 text-left text-xs"
                style={{ color: "#FFB169" }}
              >
                User Pools (CUP)
              </th>
              <th
                className="p-3 text-left text-xs"
                style={{ color: "#8FD6A8" }}
              >
                Identity Pools (CIP)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, a, b], i) => (
              <tr
                key={k}
                style={{
                  background: i % 2 ? "#FBFAF7" : "#fff",
                  borderTop: `1px solid ${C.line}`,
                }}
              >
                <td className="p-3 text-xs font-bold" style={{ color: C.gray }}>
                  {k}
                </td>
                <td className="p-3 text-xs" style={{ color: C.ink }}>
                  {a}
                </td>
                <td className="p-3 text-xs" style={{ color: C.ink }}>
                  {b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card title="CUP + CIP 함께 쓰기 — 가장 완전한 아키텍처" color={C.orange}>
        <svg viewBox="0 0 700 250" className="w-full">
          <Defs />
          <circle
            cx="55"
            cy="120"
            r="24"
            fill={C.blueSoft}
            stroke={C.blue}
            strokeWidth="2"
          />
          <text x="55" y="126" textAnchor="middle" fontSize="16">
            👤
          </text>
          <rect
            x="140"
            y="80"
            width="160"
            height="80"
            rx="10"
            fill={C.orangeSoft}
            stroke={C.orange}
            strokeWidth="2"
          />
          <text
            x="220"
            y="108"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#9A4A0B"
          >
            ① CUP 로그인
          </text>
          <text
            x="220"
            y="128"
            textAnchor="middle"
            fontSize="10.5"
            fill={C.ink}
          >
            인증 → JWT 발급
          </text>
          <text
            x="220"
            y="145"
            textAnchor="middle"
            fontSize="10.5"
            fill={C.ink}
          >
            (소셜/SAML 연합 포함)
          </text>
          <rect
            x="360"
            y="80"
            width="160"
            height="80"
            rx="10"
            fill={C.greenSoft}
            stroke={C.green}
            strokeWidth="2"
          />
          <text
            x="440"
            y="108"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill={C.green}
          >
            ② CIP 교환
          </text>
          <text
            x="440"
            y="128"
            textAnchor="middle"
            fontSize="10.5"
            fill={C.ink}
          >
            JWT → 임시 AWS
          </text>
          <text
            x="440"
            y="145"
            textAnchor="middle"
            fontSize="10.5"
            fill={C.ink}
          >
            자격 증명 (STS)
          </text>
          <rect
            x="575"
            y="80"
            width="105"
            height="80"
            rx="10"
            fill={C.blueSoft}
            stroke={C.blue}
            strokeWidth="2"
          />
          <text
            x="627"
            y="112"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill={C.blue}
          >
            ③ AWS
          </text>
          <text
            x="627"
            y="132"
            textAnchor="middle"
            fontSize="10.5"
            fill={C.ink}
          >
            S3 · DynamoDB
          </text>
          <text
            x="627"
            y="147"
            textAnchor="middle"
            fontSize="10.5"
            fill={C.ink}
          >
            직접 접근
          </text>
          <path d="M82,120 L135,120" style={arrow(true)} />
          <path d="M304,120 L355,120" style={arrow(true, C.green)} />
          <path d="M524,120 L570,120" style={arrow(true)} />
          <text
            x="350"
            y="215"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={C.gray}
          >
            "인증은 CUP, 인가는 CIP" — 두 서비스를 이어서 완성
          </text>
        </svg>
      </Card>

      <Card title="한 줄 암기" color={C.red}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="rounded-lg p-3 text-center"
            style={{ background: C.orangeSoft }}
          >
            <div className="text-lg font-black" style={{ color: "#9A4A0B" }}>
              CUP = "너 누구야?"
            </div>
            <div className="text-xs mt-1" style={{ color: C.ink }}>
              로그인 · 사용자 DB · JWT
            </div>
          </div>
          <div
            className="rounded-lg p-3 text-center"
            style={{ background: C.greenSoft }}
          >
            <div className="text-lg font-black" style={{ color: C.green }}>
              CIP = "뭘 할 수 있어?"
            </div>
            <div className="text-xs mt-1" style={{ color: C.ink }}>
              임시 자격 증명 · IAM 역할 · 게스트
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ═════════════════════  7. 시험 포인트 총정리  ═════════════════════ */
function ExamSummary() {
  const points = [
    [
      5,
      "CUP vs CIP 구분",
      "인증(JWT) vs 인가(임시 AWS 자격 증명). 두 서비스 역할 구분이 최빈출.",
    ],
    [
      5,
      "키워드 매칭",
      "'hundreds of users', 'mobile', 'SAML/소셜 로그인' → Cognito. 내부 직원 → IAM.",
    ],
    [
      4,
      "Policy Variable 파티셔닝",
      "DynamoDB LeadingKeys, s3:prefix + ${cognito-identity...:sub}로 사용자별 데이터 격리.",
    ],
    [
      4,
      "API Gateway + CUP",
      "Cognito Authorizer로 JWT 검증 — DVA 서버리스 아키텍처 단골.",
    ],
    [
      4,
      "Lambda 트리거",
      "Pre Sign-up, Post Confirmation, User Migration 등 시점별 후크.",
    ],
    [
      3,
      "ALB 인증 오프로드",
      "HTTPS 리스너 + authenticate-cognito/oidc, OnUnauthenticatedRequest 3옵션.",
    ],
    [3, "Hosted UI 커스텀 도메인", "ACM 인증서는 반드시 us-east-1."],
    [
      3,
      "적응형 인증",
      "위험 점수(Low/Medium/High) 기반 MFA 요구·차단, CloudWatch Logs 연동.",
    ],
    [3, "게스트 접근", "미인증 사용자 지원은 CIP만 가능."],
    [
      2,
      "JWT 구조",
      "Header · Payload(sub UUID) · Signature — base64 디코딩 문제.",
    ],
  ];
  return (
    <div>
      <Card title="빈출도 순 총정리 (DVA-C02 기준 체감 빈도)" color={C.orange}>
        <p className="text-xs mb-3" style={{ color: C.gray }}>
          ※ AWS는 공식 출제 비율을 공개하지 않으므로, 강의·덤프·수험 후기 기반의
          체감 빈도입니다. Cognito는 DVA에서 보안 도메인의 핵심 서비스이고,
          SAA에서는 키워드 식별 수준으로 나옵니다.
        </p>
        <div className="space-y-2">
          {points.map(([lv, t, d], i) => (
            <div
              key={i}
              className="flex gap-3 items-start rounded-lg p-3"
              style={{ background: i % 2 ? "#FBFAF7" : C.graySoft }}
            >
              <div className="shrink-0 text-xs pt-0.5">
                <Stars n={lv} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.ink }}>
                  {t}
                </div>
                <div className="text-xs mt-0.5" style={{ color: C.gray }}>
                  {d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <ExamTip>
        퀴즈 24 대비 핵심:{" "}
        <b>
          ① CUP=인증/JWT ② CIP=인가/임시 자격 증명/게스트 ③ ALB=HTTPS 리스너에서
          인증 오프로드 ④ Policy Variable로 사용자별 격리 ⑤ Hosted UI 인증서는
          us-east-1
        </b>{" "}
        — 이 다섯 가지면 대부분 커버됩니다.
      </ExamTip>
    </div>
  );
}

/* ═════════════════════════  메인 앱  ═════════════════════════ */
const TABS = [
  { id: "overview", label: "394 · 개요", comp: Overview },
  { id: "cup", label: "395 · 사용자 풀", comp: UserPools },
  { id: "cupx", label: "397 · CUP 기타", comp: UserPoolsExtra },
  { id: "alb", label: "398 · ALB 인증", comp: AlbAuth },
  { id: "cip", label: "399 · 자격 증명 풀", comp: IdentityPools },
  { id: "vs", label: "401 · CUP vs CIP", comp: Comparison },
  { id: "exam", label: "🎯 시험 총정리", comp: ExamSummary },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const Active = TABS.find((t) => t.id === tab).comp;
  return (
    <div className="min-h-screen" style={{ ...font, background: C.paper }}>
      {/* 헤더 */}
      <header className="px-5 pt-6 pb-4" style={{ background: C.navy }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="text-xs font-bold tracking-widest mb-1"
            style={{ color: C.orange }}
          >
            AWS CERTIFICATION · SECTION 394–401
          </div>
          <h1 className="text-2xl font-black text-white">
            Amazon Cognito 완전 정복
          </h1>
          <p className="text-xs mt-1.5" style={{ color: "#AEB8C4" }}>
            사용자 풀 · 자격 증명 풀 · ALB 인증 — 실습 제외 전 개념 + 빈출도
          </p>
        </div>
      </header>

      {/* 탭 */}
      <nav
        className="sticky top-0 z-10 overflow-x-auto"
        style={{ background: C.navy, borderBottom: `3px solid ${C.orange}` }}
      >
        <div className="max-w-3xl mx-auto flex px-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="whitespace-nowrap px-3 py-3 text-xs font-bold transition-colors"
              style={{
                color: tab === t.id ? C.orange : "#AEB8C4",
                borderBottom:
                  tab === t.id
                    ? `3px solid ${C.orange}`
                    : "3px solid transparent",
                marginBottom: -3,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 본문 */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Active />
        <footer className="text-center text-xs py-6" style={{ color: C.gray }}>
          탭을 눌러 강의 순서대로 학습하세요 · ⚡ 표시 다이어그램은 단계
          버튼으로 흐름을 재생할 수 있습니다
        </footer>
      </main>
    </div>
  );
}
