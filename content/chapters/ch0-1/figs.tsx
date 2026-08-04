"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { C, MONO, SANS } from "../ui";
import { chipBtn, SimFrame, Switch } from "../interactive";

/**
 * 이 챕터 고유의 도식 SVG·인터랙티브 (규약 v3) — sections/*.mdx 가 import 한다.
 * 범용 프리미티브·상수는 여기 두지 않는다 (schema.ts "공용 승격 규약", #156).
 * CredentialChainResolver(#72)가 useState 를 쓰므로 파일 전체를 "use client"로 둔다
 * (body.tsx 클라이언트 경계 안이라 무해 — ch0-2·ch1-2 figs 전례).
 */

export function GlobalInfraSvg() {
  const az = (x: number, code: string, name: string) => (
    <>
      <rect x={x} y={130} width={120} height={230} rx={10} fill="#FFFFFF" stroke={C.teal} strokeWidth={2} />
      <text x={x + 60} y={158} fontSize={13} fontWeight={900} fill={C.teal} textAnchor="middle">
        {name}
      </text>
      <text x={x + 60} y={176} fontSize={10.5} fill={C.inkSoft} textAnchor="middle">
        {code}
      </text>
      <rect x={x + 16} y={190} width={88} height={30} rx={6} fill={C.tealSoft} />
      <text x={x + 60} y={210} fontSize={11} textAnchor="middle" fill={C.teal}>
        데이터센터 🏢
      </text>
      <rect x={x + 16} y={224} width={88} height={30} rx={6} fill={C.tealSoft} />
      <text x={x + 60} y={244} fontSize={11} textAnchor="middle" fill={C.teal}>
        데이터센터 🏢
      </text>
    </>
  );

  /**
   * VPC·서브넷 겹 (#230) — 물리 계층(리전 ⊃ AZ ⊃ 데이터센터) 위에 겹쳐 그린다.
   * 새 도식을 만들지 않고 여기 얹는 이유는 "리전 안에 내가 그은 네트워크"라는 **포함 관계**가
   * 한 그림에서 보여야 하기 때문 — VPC 띠는 AZ 경계를 가로질러 리전의 AZ 전체를 덮고,
   * 서브넷 칩은 AZ 박스 안에 들어간다(AZ 하나에 매임).
   * 색은 새 색조를 늘리지 않고 중립(inkSoft) 점선으로 둔다 — 파랑/틸/앰버는 이미 물리 계층과
   * 엣지가 쓰고 있고, "AWS가 만든 칸"과 "내가 그은 칸"을 실선/점선으로 가르는 편이 읽힌다.
   */
  const subnet = (x: number) => (
    <>
      <rect x={x + 14} y={302} width={92} height={34} rx={6} fill={C.line} />
      <text x={x + 60} y={324} fontSize={11.5} fontWeight={700} textAnchor="middle" fill={C.ink}>
        서브넷
      </text>
    </>
  );

  return (
    <svg viewBox="0 0 760 450" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <rect x={10} y={10} width={740} height={430} rx={16} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="6 5" />
      <text x={30} y={40} fontSize={14} fontWeight={900} fill={C.inkSoft}>
        🌏 AWS 글로벌 인프라
      </text>

      {/* 서울 리전 */}
      <rect x={40} y={60} width={440} height={350} rx={14} fill={C.blueSoft} stroke={C.blue} strokeWidth={2.5} />
      <text x={60} y={92} fontSize={15} fontWeight={900} fill={C.blue}>
        리전: 서울 (ap-northeast-2)
      </text>
      <text x={60} y={112} fontSize={12} fill={C.inkSoft}>
        지리적으로 독립된 하나의 지역
      </text>

      {az(60, "ap-northeast-2a", "AZ-a")}
      {az(200, "ap-northeast-2b", "AZ-b")}
      {az(340, "ap-northeast-2c", "AZ-c")}

      <line x1={180} y1={232} x2={200} y2={232} stroke={C.amber} strokeWidth={3} />
      <line x1={320} y1={232} x2={340} y2={232} stroke={C.amber} strokeWidth={3} />

      {/* VPC 겹 — AZ 박스 뒤가 아니라 위에 그려 경계를 가로지르게 한다 */}
      <rect x={52} y={276} width={416} height={70} rx={10} fill="none" stroke={C.inkSoft} strokeWidth={2} strokeDasharray="7 5" />
      {subnet(60)}
      {subnet(200)}
      {subnet(340)}
      <rect x={52} y={264} width={148} height={24} rx={6} fill={C.inkSoft} />
      <text x={64} y={281} fontSize={11.5} fontWeight={800} fill="#FFFFFF">
        VPC — 내 사설 네트워크
      </text>

      <text x={260} y={382} fontSize={11.5} fill={C.amberText} textAnchor="middle" fontWeight={700}>
        AZ끼리 초고속 저지연 전용망으로 연결 (물리적으로는 수십 km 분리)
      </text>

      {/* 도쿄 리전 */}
      <rect x={520} y={60} width={210} height={150} rx={14} fill={C.blueSoft} stroke={C.blue} strokeWidth={2.5} />
      <text x={540} y={92} fontSize={14} fontWeight={900} fill={C.blue}>
        리전: 도쿄
      </text>
      <text x={540} y={112} fontSize={11.5} fill={C.inkSoft}>
        ap-northeast-1
      </text>
      {[540, 602, 664].map((x) => (
        <g key={x}>
          <rect x={x} y={126} width={52} height={60} rx={8} fill="#FFF" stroke={C.teal} strokeWidth={1.5} />
          <text x={x + 26} y={160} fontSize={11} textAnchor="middle" fill={C.teal}>
            AZ
          </text>
        </g>
      ))}

      {/* 엣지 — 서울 리전 박스가 VPC 겹만큼 길어졌으므로 아래 끝을 맞춰 내린다 */}
      <rect x={520} y={255} width={210} height={155} rx={14} fill={C.amberSoft} stroke={C.amber} strokeWidth={2} />
      <text x={540} y={287} fontSize={14} fontWeight={900} fill={C.amberText}>
        엣지 로케이션
      </text>
      <text x={540} y={311} fontSize={11.5} fill={C.inkSoft}>
        리전보다 훨씬 많은 소규모 거점
      </text>
      <text x={540} y={331} fontSize={11.5} fill={C.inkSoft}>
        CloudFront(CDN) 캐시,
      </text>
      <text x={540} y={351} fontSize={11.5} fill={C.inkSoft}>
        Route 53 등이 여기서 동작
      </text>
      <text x={540} y={377} fontSize={11} fill={C.amberText} fontWeight={700}>
        → 사용자와 가까운 곳에서 응답
      </text>
    </svg>
  );
}

export function ApiConvergeSvg() {
  const client = (x: number, title: string, l1: ReactNode, l2: string) => (
    <>
      <rect x={x} y={30} width={200} height={90} rx={12} fill={C.blueSoft} stroke={C.blue} strokeWidth={2} />
      <text x={x + 100} y={62} fontSize={14} fontWeight={900} fill={C.blue} textAnchor="middle">
        {title}
      </text>
      <text x={x + 100} y={84} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        {l1}
      </text>
      <text x={x + 100} y={102} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        {l2}
      </text>
    </>
  );

  return (
    <svg viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arrow-api" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.blue} />
        </marker>
      </defs>

      {client(30, "🖥 관리 콘솔", "브라우저 GUI", "로그인: ID/비밀번호 (+MFA)")}
      {client(280, "⌨️ CLI", <tspan fontFamily={MONO}>aws s3 ls</tspan>, "인증: 액세스 키 / 역할")}
      {client(530, "📦 SDK", "Python(boto3), JS, Java…", "인증: 액세스 키 / 역할")}

      <line x1={130} y1={120} x2={330} y2={196} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#arrow-api)" />
      <line x1={380} y1={120} x2={380} y2={196} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#arrow-api)" />
      <line x1={630} y1={120} x2={430} y2={196} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#arrow-api)" />

      <rect x={180} y={200} width={400} height={72} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={2.5} />
      <text x={380} y={228} fontSize={14} fontWeight={900} fill={C.amberText} textAnchor="middle">
        🔏 요청 서명 (SigV4)
      </text>
      <text x={380} y={252} fontSize={12} fill={C.inkSoft} textAnchor="middle">
        자격 증명으로 요청에 서명 → &ldquo;누가 보냈는지&rdquo;를 증명 (도구가 자동 처리)
      </text>

      <line x1={380} y1={272} x2={380} y2={308} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#arrow-api)" />
      <text x={480} y={296} fontSize={11.5} fill={C.inkSoft} textAnchor="middle">
        HTTPS 요청
      </text>

      <rect x={150} y={312} width={460} height={96} rx={14} fill={C.ink} />
      <text x={380} y={344} fontSize={15} fontWeight={900} fill="#FFFFFF" textAnchor="middle">
        동일한 AWS API 엔드포인트
      </text>
      <text x={380} y={366} fontSize={12} fill={C.codeFg} textAnchor="middle" fontFamily={MONO}>
        s3.ap-northeast-2.amazonaws.com
      </text>
      <text x={380} y={392} fontSize={12} fill="#B8C4CF" textAnchor="middle">
        ① 서명 검증(인증) → ② IAM 정책 검사(인가) → ③ 실행
      </text>
    </svg>
  );
}

export function ManagedSpectrumSvg() {
  return (
    <svg viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <text x={380} y={34} fontSize={15} fontWeight={900} fill={C.ink} textAnchor="middle">
        직접 운영 ↔ 관리형: 책임과 운영 부담의 스펙트럼
      </text>

      <line x1={60} y1={70} x2={700} y2={70} stroke={C.inkSoft} strokeWidth={2} />
      <text x={60} y={58} fontSize={11.5} fill={C.inkSoft}>
        직접 운영 (내가 다 함)
      </text>
      <text x={700} y={58} fontSize={11.5} fill={C.inkSoft} textAnchor="end">
        완전 관리형 (AWS가 다 함)
      </text>

      {/* EC2 (IaaS) */}
      <rect x={50} y={90} width={200} height={230} rx={12} fill={C.redSoft} stroke={C.red} strokeWidth={2} />
      <text x={150} y={118} fontSize={13.5} fontWeight={900} fill={C.red} textAnchor="middle">
        EC2 (IaaS)
      </text>
      <text x={150} y={140} fontSize={11} fill={C.inkSoft} textAnchor="middle">
        가상 서버를 빌림
      </text>
      <text x={66} y={168} fontSize={11.5} fill={C.ink}>
        내 책임:
      </text>
      <text x={66} y={188} fontSize={11} fill={C.inkSoft}>
        · OS 패치, 보안 업데이트
      </text>
      <text x={66} y={206} fontSize={11} fill={C.inkSoft}>
        · 런타임/미들웨어 설치
      </text>
      <text x={66} y={224} fontSize={11} fill={C.inkSoft}>
        · 스케일링, 장애 대응
      </text>
      <text x={66} y={242} fontSize={11} fill={C.inkSoft}>
        · 앱 코드
      </text>
      <text x={66} y={278} fontSize={11} fontWeight={700} fill={C.red}>
        과금: 인스턴스 켜져 있는
      </text>
      <text x={66} y={294} fontSize={11} fontWeight={700} fill={C.red}>
        시간(초 단위) — 놀아도 과금
      </text>

      {/* 관리형 */}
      <rect x={280} y={90} width={200} height={230} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={2} />
      <text x={380} y={118} fontSize={13.5} fontWeight={900} fill={C.amberText} textAnchor="middle">
        RDS · Beanstalk 등
      </text>
      <text x={380} y={140} fontSize={11} fill={C.inkSoft} textAnchor="middle">
        관리형 서비스
      </text>
      <text x={296} y={168} fontSize={11.5} fill={C.ink}>
        AWS가 대신:
      </text>
      <text x={296} y={188} fontSize={11} fill={C.inkSoft}>
        · DB 설치, 패치, 백업
      </text>
      <text x={296} y={206} fontSize={11} fill={C.inkSoft}>
        · Multi-AZ 장애 조치
      </text>
      <text x={296} y={230} fontSize={11.5} fill={C.ink}>
        내 책임:
      </text>
      <text x={296} y={248} fontSize={11} fill={C.inkSoft}>
        · 스키마, 쿼리, 앱 코드
      </text>
      <text x={296} y={278} fontSize={11} fontWeight={700} fill={C.amberText}>
        과금: 인스턴스 시간 +
      </text>
      <text x={296} y={294} fontSize={11} fontWeight={700} fill={C.amberText}>
        스토리지 (운영은 AWS가)
      </text>

      {/* 서버리스 */}
      <rect x={510} y={90} width={200} height={230} rx={12} fill={C.tealSoft} stroke={C.teal} strokeWidth={2.5} />
      <text x={610} y={118} fontSize={13.5} fontWeight={900} fill={C.teal} textAnchor="middle">
        Lambda · S3 · DynamoDB
      </text>
      <text x={610} y={140} fontSize={11} fill={C.inkSoft} textAnchor="middle">
        서버리스 / 완전 관리형
      </text>
      <text x={526} y={168} fontSize={11.5} fill={C.ink}>
        AWS가 대신:
      </text>
      <text x={526} y={188} fontSize={11} fill={C.inkSoft}>
        · 서버라는 개념 자체가 없음
      </text>
      <text x={526} y={206} fontSize={11} fill={C.inkSoft}>
        · 스케일링 완전 자동
      </text>
      <text x={526} y={230} fontSize={11.5} fill={C.ink}>
        내 책임:
      </text>
      <text x={526} y={248} fontSize={11} fill={C.inkSoft}>
        · 코드/데이터만
      </text>
      <text x={526} y={278} fontSize={11} fontWeight={700} fill={C.teal}>
        과금: 요청 수 × 실행 시간
      </text>
      <text x={526} y={294} fontSize={11} fontWeight={700} fill={C.teal}>
        — 안 쓰면 0원
      </text>

      <rect x={50} y={344} width={660} height={66} rx={12} fill={C.ink} />
      <text x={380} y={372} fontSize={13} fontWeight={900} fill="#FFFFFF" textAnchor="middle">
        종량제 3대 과금 축
      </text>
      <text x={380} y={396} fontSize={12} fill={C.codeFg} textAnchor="middle">
        ⏱ 컴퓨팅(실행 시간) · 💾 스토리지(GB × 기간) · 🌐 데이터 전송(나가는 방향, 아웃바운드)
      </text>
    </svg>
  );
}

/* ============ 인터랙티브: 자격 증명 체인 리졸버 (#72 신규) ============ */

/**
 * 자격 증명 체인 리졸버 — "같은 코드·두 환경"(내 노트북 vs EC2) 프리셋 위에서 자격 증명
 * 소스 4개를 켜고 끄면, SDK 가 실제로 쓰는 소스를 first-hit(위에서부터 먼저 발견된 것)으로
 * 판정한다. EvalEngine(ch0-2)의 first-true-wins 상태기계와 같은 구조.
 *
 * 사실 근거 (#72 코멘트 기록 대상): §02 본문 체인 순서(코드 파라미터 → 환경변수 →
 * 설정 파일 → IAM 역할)와 "구체적인 지정이 기본값을 이깁니다". EC2에 환경변수가 있으면
 * 역할보다 우선하는 엣지케이스 포함 — "EC2 = 항상 역할" 오개념 방지. 실제 SDK 체인에는
 * 웹 아이덴티티·ECS 컨테이너 자격 증명 등 중간 단계가 더 있다 (하단에 명시).
 */
export function CredentialChainResolver() {
  const [env, setEnv] = useState<"laptop" | "ec2">("laptop");
  const [src, setSrc] = useState({ code: false, envvar: false, config: true, role: false });

  const switchEnv = (e: "laptop" | "ec2") => {
    setEnv(e);
    // 환경 전환 시 그 환경의 전형적 기본 상태로 — 노트북=설정 파일, EC2=역할
    setSrc(
      e === "laptop"
        ? { code: false, envvar: false, config: true, role: false }
        : { code: false, envvar: false, config: false, role: true },
    );
  };

  const roleAvailable = env === "ec2";

  const chain: { key: keyof typeof src; num: string; label: string; sub: string; available: boolean }[] = [
    { key: "code", num: "①", label: "코드에 명시된 파라미터", sub: "키가 코드에 하드코딩 — 안티패턴", available: true },
    { key: "envvar", num: "②", label: "환경변수", sub: "AWS_ACCESS_KEY_ID 등", available: true },
    { key: "config", num: "③", label: "설정 파일", sub: "~/.aws/credentials (aws configure)", available: true },
    {
      key: "role",
      num: "④",
      label: "붙어 있는 IAM 역할",
      sub: roleAvailable ? "EC2 인스턴스 프로파일" : "이 환경엔 없음 — 역할은 EC2·Lambda 같은 AWS 실행 환경에 붙는다",
      available: roleAvailable,
    },
  ];

  const winner = chain.find((c) => c.available && src[c.key])?.key ?? null;
  const envMasksRole = env === "ec2" && winner === "envvar" && src.role;

  const verdict: Record<string, { title: string; body: string; safe: boolean }> = {
    code: {
      title: "코드 파라미터 사용",
      safe: false,
      body: "체인 최우선 — 가장 구체적인 지정이라 나머지를 전부 이깁니다. 하지만 영구 키가 코드에 박혀 유출에 가장 취약한 안티패턴입니다.",
    },
    envvar: {
      title: "환경변수 사용",
      safe: false,
      body: envMasksRole
        ? "환경변수가 역할보다 앞 순서라, 역할이 붙어 있어도 환경변수의 키가 쓰입니다 — \"EC2면 항상 역할\"이 아닙니다. 역할을 쓰게 하려면 환경변수를 지워야 합니다."
        : "설정 파일·역할보다 앞 순서 — 컨테이너·CI 환경에서 흔하지만, 영구 키라면 유출 리스크는 남습니다.",
    },
    config: {
      title: "설정 파일 사용",
      safe: false,
      body: "내 노트북의 표준 경로 — aws configure가 저장한 영구 액세스 키로 서명합니다. 키 관리 책임이 내게 남습니다.",
    },
    role: {
      title: "IAM 역할 사용",
      safe: true,
      body: "앞 순서 소스가 전부 없어서 역할까지 내려왔습니다 — 저장된 영구 키가 아예 없고 만료되는 임시 자격 증명을 자동으로 받아 씁니다. 시험의 \"가장 안전한 방법\" 정답 (ch0-2 역할).",
    },
  };

  return (
    <SimFrame title="자격 증명 체인 리졸버 — 같은 코드, 두 환경" icon="🔑">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
        {(
          [
            ["laptop", "💻 내 노트북"],
            ["ec2", "🖥 EC2 인스턴스"],
          ] as const
        ).map(([v, lbl]) => (
          <button
            key={v}
            type="button"
            onClick={() => switchEnv(v)}
            aria-pressed={env === v}
            className="widget-btn"
            style={{
              ...chipBtn(env === v, C.blue, C.blueSoft),
              fontFamily: MONO,
              fontSize: "0.78rem",
              padding: "8px 14px",
              borderRadius: 8,
            }}
          >
            {lbl}
          </button>
        ))}
      </div>
      <p style={{ fontSize: "0.8rem", color: C.inkSoft, lineHeight: 1.6, margin: "0 0 12px" }}>
        같은 코드가 환경에 따라 다른 자격 증명으로 인증됩니다 — SDK는 아래 순서로 탐색해{" "}
        <b style={{ color: C.ink }}>처음 발견한 소스</b>를 씁니다.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {chain.map((c, i) => {
            const isWinner = winner === c.key;
            const on = c.available && src[c.key];
            return (
              <div key={c.key}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 9,
                    border: `1.5px solid ${isWinner ? C.teal : C.line}`,
                    background: isWinner ? C.tealSoft : "#fff",
                    opacity: c.available ? 1 : 0.5,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: isWinner ? C.teal : C.ink }}>
                      {c.num} {c.label}
                      {isWinner && <span style={{ fontFamily: MONO, fontSize: "0.68rem", marginLeft: 6 }}>← SDK가 사용</span>}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: C.inkSoft, marginTop: 1 }}>{c.sub}</div>
                  </div>
                  <Switch
                    on={on}
                    onClick={() => setSrc({ ...src, [c.key]: !src[c.key] })}
                    colorOn={C.teal}
                    label={`${c.label} 존재`}
                    disabled={!c.available}
                  />
                </div>
                {i < chain.length - 1 && (
                  <div style={{ height: 8, marginLeft: 20, borderLeft: `2px solid ${C.line}` }} />
                )}
              </div>
            );
          })}
        </div>

        <div>
          {winner ? (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: verdict[winner].safe ? C.tealSoft : C.amberSoft,
                border: `1.5px solid ${verdict[winner].safe ? C.teal : C.amber}`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: verdict[winner].safe ? C.teal : C.amberText,
                }}
              >
                {verdict[winner].safe ? "✔" : "→"} {verdict[winner].title}
              </div>
              <div style={{ fontSize: "0.82rem", marginTop: 6, lineHeight: 1.65, color: C.ink }}>
                {verdict[winner].body}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: C.redSoft,
                border: `1.5px solid ${C.red}`,
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: "1rem", fontWeight: 900, color: C.red }}>✖ 자격 증명 없음</div>
              <div style={{ fontSize: "0.82rem", marginTop: 6, lineHeight: 1.65, color: C.ink }}>
                체인 끝까지 아무 소스도 없음 — SDK는 요청을 서명하지 못하고 에러를 냅니다.
              </div>
            </div>
          )}

          <p style={{ fontSize: "0.76rem", color: C.inkSoft, lineHeight: 1.6, margin: "10px 0 0" }}>
            노트북에선 설정 파일이, EC2에선 역할이 이기는 게 전형 — 그래서 <b>같은 코드</b>가 두 환경에서
            다르게 인증됩니다. 실제 SDK 체인에는 웹 아이덴티티 토큰·ECS 컨테이너 자격 증명 등 중간
            단계가 더 있습니다 — 시험 감각은 이 4개의 순서면 충분합니다.
          </p>
        </div>
      </div>
    </SimFrame>
  );
}

/** §00 — AI(생성)와 사람(판단)의 분업 루프. */
export function AiDivisionSvg() {
  return (
    <svg viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* AI 박스 */}
      <rect x={40} y={55} width={280} height={150} rx={14} fill={C.blueSoft} stroke={C.blue} strokeWidth={2.5} />
      <text x={180} y={90} fontSize={15} fontWeight={900} fill={C.blue} textAnchor="middle">
        🤖 AI의 몫 — 생성
      </text>
      <text x={180} y={122} fontSize={12} fill={C.inkSoft} textAnchor="middle">
        인프라 코드 · 설정 초안 작성
      </text>
      <text x={180} y={142} fontSize={12} fill={C.inkSoft} textAnchor="middle">
        반복 작업 자동화
      </text>
      <text x={180} y={176} fontSize={11.5} fontWeight={700} fill={C.blue} textAnchor="middle">
        문법은 완벽하다
      </text>

      {/* 사람 박스 */}
      <rect x={440} y={55} width={280} height={150} rx={14} fill={C.amberSoft} stroke={C.amber} strokeWidth={2.5} />
      <text x={580} y={90} fontSize={15} fontWeight={900} fill={C.amberText} textAnchor="middle">
        🧑‍💻 사람의 몫 — 판단
      </text>
      <text x={580} y={122} fontSize={12} fill={C.inkSoft} textAnchor="middle">
        적합한가? 안전한가? 비용은?
      </text>
      <text x={580} y={142} fontSize={12} fill={C.inkSoft} textAnchor="middle">
        장애가 나면 어디부터 보나?
      </text>
      <text x={580} y={176} fontSize={11.5} fontWeight={700} fill={C.amberText} textAnchor="middle">
        검증하고, 책임진다
      </text>

      {/* 순환 화살표 */}
      <line x1={324} y1={95} x2={428} y2={95} stroke={C.inkSoft} strokeWidth={2.5} />
      <polygon points="436,95 424,89 424,101" fill={C.inkSoft} />
      <text x={380} y={82} fontSize={11} fill={C.inkSoft} textAnchor="middle" fontWeight={700}>
        결과물
      </text>
      <line x1={436} y1={168} x2={332} y2={168} stroke={C.teal} strokeWidth={2.5} />
      <polygon points="324,168 336,162 336,174" fill={C.teal} />
      <text x={380} y={192} fontSize={11} fill={C.teal} textAnchor="middle" fontWeight={700}>
        좋은 질문 · 구체적 지시
      </text>

      <text x={380} y={252} fontSize={12.5} fontWeight={800} fill={C.inkSoft} textAnchor="middle">
        아는 만큼 AI를 잘 부리고 — 모르는 만큼, 잘못된 것을 자신 있게 배포한다
      </text>
    </svg>
  );
}

/** §00 — AI가 보는 범위(코드·에러·로그)와 그 바깥의 시스템 맥락. */
export function BlindSpotSvg() {
  const ctx = (x: number, title: string, l1: string, l2: string, incident: string) => (
    <>
      <rect x={x} y={196} width={216} height={104} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={2} />
      <text x={x + 108} y={224} fontSize={13} fontWeight={900} fill={C.amberText} textAnchor="middle">
        {title}
      </text>
      <text x={x + 108} y={248} fontSize={11} fill={C.inkSoft} textAnchor="middle">
        {l1}
      </text>
      <text x={x + 108} y={266} fontSize={11} fill={C.inkSoft} textAnchor="middle">
        {l2}
      </text>
      <text x={x + 108} y={288} fontSize={10.5} fill={C.red} textAnchor="middle" fontWeight={700}>
        {incident}
      </text>
    </>
  );

  return (
    <svg viewBox="0 0 760 390" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* 바깥: 시스템 전체 */}
      <rect x={20} y={20} width={720} height={310} rx={16} fill="#FFFFFF" stroke={C.line} strokeWidth={2} strokeDasharray="7 5" />
      <text x={44} y={50} fontSize={14} fontWeight={900} fill={C.ink}>
        🗺 시스템 전체 — 사람이 그려야 하는 그림
      </text>

      {/* 안쪽: AI의 시야 */}
      <rect x={44} y={68} width={672} height={104} rx={12} fill={C.blueSoft} stroke={C.blue} strokeWidth={2.5} />
      <text x={68} y={96} fontSize={13} fontWeight={900} fill={C.blue}>
        🤖 AI에게 보여준 것
      </text>
      {[
        { x: 300, label: "코드" },
        { x: 420, label: "에러 메시지" },
        { x: 566, label: "로그" },
      ].map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={80} width={b.label.length > 4 ? 130 : 100} height={34} rx={8} fill="#FFFFFF" stroke={C.blue} strokeWidth={1.5} />
          <text x={b.x + (b.label.length > 4 ? 65 : 50)} y={102} fontSize={11.5} fill={C.blue} textAnchor="middle" fontFamily={MONO}>
            {b.label}
          </text>
        </g>
      ))}
      <text x={68} y={140} fontSize={11.5} fill={C.inkSoft}>
        이 범위 안에서는 정확하다 — 문법도, 에러 해석도 틀리지 않는다.
      </text>
      <text x={68} y={158} fontSize={11.5} fill={C.inkSoft}>
        하지만 “이게 문제인가?”는 이 안에 답이 없다.
      </text>

      {/* 바깥의 세 축 = 세 사고 */}
      {ctx(44, "실행 주체", "로컬의 나 ≠ Lambda 실행 역할", "누구의 권한으로 도는가", "→ 프로덕션에서만 AccessDenied")}
      {ctx(272, "이벤트 흐름", "출력이 자기 트리거로 돌아오면", "무한 루프가 된다", "→ 청구서 5배")}
      {ctx(500, "노출 경계", "무엇이 인터넷에 열려 있고", "무엇이 뒤에 숨어야 하는가", "→ 버킷이 통째로 공개")}

      <text x={380} y={362} fontSize={12.5} fontWeight={800} fill={C.inkSoft} textAnchor="middle">
        AI는 보여준 것 안에선 천재다 — 무엇을 보여줄지는 사람이 정한다
      </text>
    </svg>
  );
}
