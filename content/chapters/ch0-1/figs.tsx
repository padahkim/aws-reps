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

/** §01 — AZ 장애 & 고가용성 인터랙티브 시뮬레이터. */
export function AzFailureSimulator() {
  const [multiAz, setMultiAz] = useState(false);
  const [azADown, setAzADown] = useState(false);
  const [showEbsInfo, setShowEbsInfo] = useState(false);

  return (
    <SimFrame title="AZ 장애 & 고가용성 시뮬레이터" icon="⚡">
      <div style={{ fontSize: "0.86rem", color: C.inkSoft, marginBottom: 12 }}>
        배치 방식과 장애 상황을 직접 눌러보며, Multi-AZ가 어떻게 고가용성을 만드는지 확인해 보세요.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: C.ink }}>배치 방식:</span>
        <button
          type="button"
          className="widget-btn"
          aria-pressed={!multiAz}
          onClick={() => setMultiAz(false)}
          style={{
            ...chipBtn(!multiAz, C.blue, C.blueSoft),
            padding: "5px 12px",
            fontSize: "0.82rem",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          단일 AZ 배포 (서버 1대)
        </button>
        <button
          type="button"
          className="widget-btn"
          aria-pressed={multiAz}
          onClick={() => setMultiAz(true)}
          style={{
            ...chipBtn(multiAz, C.teal, C.tealSoft),
            padding: "5px 12px",
            fontSize: "0.82rem",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Multi-AZ 분산 배포 (서버 2대)
        </button>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: azADown ? C.red : C.inkSoft }}>
            {azADown ? "⚡ AZ-a 정전 발생 중" : "정상 전력"}
          </span>
          <Switch
            on={azADown}
            onClick={() => setAzADown(!azADown)}
            colorOn={C.red}
            label="AZ-a 장애 발생"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 12 }}>
        {/* AZ-a 카드 */}
        <div
          style={{
            border: `1.5px solid ${azADown ? C.red : C.line}`,
            borderRadius: 10,
            padding: "10px 12px",
            background: azADown ? C.redSoft : "#fff",
            transition: "background 0.2s, border-color 0.2s",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: azADown ? C.red : C.ink }}>
              AZ-a (ap-northeast-2a)
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: azADown ? C.red : C.teal }}>
              {azADown ? "🔥 전력 차단 / 다운" : "🟢 가동 중"}
            </span>
          </div>

          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 6,
                background: azADown ? "rgba(255,255,255,0.7)" : C.blueSoft,
                border: `1px solid ${azADown ? C.red : C.line}`,
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>🖥</span>
              <div style={{ fontSize: "0.78rem" }}>
                <b>EC2 인스턴스 A</b>
                <span style={{ color: azADown ? C.red : C.inkSoft, marginLeft: 6 }}>
                  {azADown ? "(작동 중지 ✖)" : "(요청 처리 중)"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 6,
                background: azADown ? "rgba(255,255,255,0.7)" : C.amberSoft,
                border: `1px solid ${azADown ? C.red : C.line}`,
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>💾</span>
              <div style={{ fontSize: "0.78rem" }}>
                <b>EBS 볼륨 A</b>
                <span style={{ color: azADown ? C.red : C.amberText, marginLeft: 6 }}>
                  {azADown ? "(접근 불가 ✖)" : "(EC2 A에 마운트)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AZ-b 카드 */}
        <div
          style={{
            border: `1.5px solid ${multiAz ? C.teal : C.line}`,
            borderRadius: 10,
            padding: "10px 12px",
            background: multiAz ? "#fff" : "#FAFAFA",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: C.ink }}>
              AZ-b (ap-northeast-2b)
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: C.teal }}>
              🟢 정상 (독립 데이터센터)
            </span>
          </div>

          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {multiAz ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 6,
                  background: C.tealSoft,
                  border: `1px solid ${C.teal}`,
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>🖥</span>
                <div style={{ fontSize: "0.78rem" }}>
                  <b>EC2 인스턴스 B</b>
                  <span style={{ color: C.teal, marginLeft: 6, fontWeight: 700 }}>
                    {azADown ? "(ALB가 트래픽 단독 전달 중 ✔)" : "(ALB가 트래픽 분산 전달 중)"}
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "12px 8px",
                  borderRadius: 6,
                  border: `1px dashed ${C.line}`,
                  textAlign: "center",
                  fontSize: "0.78rem",
                  color: C.inkSoft,
                }}
              >
                배치된 서버 없음 (단일 AZ 모드)
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowEbsInfo(!showEbsInfo)}
              style={{
                background: "none",
                border: "none",
                padding: "2px 0",
                color: C.blue,
                fontSize: "0.73rem",
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {showEbsInfo ? "▲ EBS 연결 제약 접기" : "❓ AZ-a의 EBS를 이 서버에 바로 붙일 수 있나요?"}
            </button>
            {showEbsInfo && (
              <div
                style={{
                  fontSize: "0.72rem",
                  color: C.red,
                  background: C.redSoft,
                  padding: "6px 8px",
                  borderRadius: 6,
                  lineHeight: 1.5,
                }}
              >
                <b>불가 ⚠:</b> EBS 볼륨은 특정 AZ에 물리적으로 묶입니다.{" "}
                {azADown ? (
                  <>
                    이미 다운된 볼륨에서는 새 스냅샷을 뜰 수 없으므로,{" "}
                    <b>평소 미리 생성해 둔 스냅샷에서 AZ-b에 새 볼륨을 생성해 마운트</b>해야 합니다 (시험 단골 함정).
                  </>
                ) : (
                  <>
                    AZ-b 인스턴스에서 쓰려면{" "}
                    <b>미리 스냅샷을 생성해 두고, 그 스냅샷으로 AZ-b에 새 볼륨을 복원해 마운트</b>해야 합니다 (시험 단골 함정).
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 결과 판정 배너 */}
      <div
        style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 8,
          background: !azADown ? (multiAz ? C.tealSoft : "#F4F6F8") : multiAz ? C.tealSoft : C.redSoft,
          border: `1.5px solid ${!azADown ? (multiAz ? C.teal : C.line) : multiAz ? C.teal : C.red}`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.85rem",
            fontWeight: 800,
            color: !azADown ? (multiAz ? C.teal : C.ink) : multiAz ? C.teal : C.red,
          }}
        >
          {!azADown
            ? multiAz
              ? "✔ Multi-AZ 정상 운용 중 (장애 대비 완료)"
              : "ℹ 단일 AZ 가동 중 (단, AZ-a 장애 시 전체 중단 위험)"
            : multiAz
              ? "✔ 서비스 정상 유지 (ALB가 AZ-b로 트래픽 자동 우회)"
              : "✖ 서비스 전체 중단 (단일 장애점 SPoF — 서버 무응답)"}
        </div>
        <div style={{ fontSize: "0.78rem", color: C.ink, marginTop: 4, lineHeight: 1.5 }}>
          {!azADown
            ? multiAz
              ? "서버 2대가 서로 다른 가용영역에 분산되어 있어, 한 건물에 불이 나도 서비스가 멈추지 않습니다."
              : "지금은 잘 동작하지만, AWS도 결국 데이터센터 건물입니다. AZ-a에 전력 문제나 화재가 나면 즉시 중단됩니다."
            : multiAz
              ? "AZ-a가 완전히 정전되었지만, 앞단 로드 밸런서(ALB)가 헬스체크로 장애를 감지하고 트래픽을 정상인 AZ-b의 인스턴스로 자동 우회하여 서비스가 끊김 없이 이어집니다. 이것이 AWS가 정의하는 고가용성(HA)입니다."
              : "서버가 1대뿐인 AZ-a가 죽으면서 요청을 받아줄 서버가 0대가 되었습니다. 라우팅할 대상이 없으므로 서비스가 완전히 멈춥니다(단일 장애점 SPoF)."}
        </div>
      </div>
    </SimFrame>
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
        이 범위 안에서 문법 작성과 에러 해석을 빠르게 돕는다.
      </text>
      <text x={68} y={158} fontSize={11.5} fill={C.inkSoft}>
        하지만 “이게 문제인가?”를 판단하려면 더 넓은 맥락이 필요하다.
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

/** §00 — AI 사고 심층 랩: 코드 바깥의 시스템 맹점 파헤치기 */
export function AiBlindSpotLab() {
  const [activeTab, setActiveTab] = useState<"security" | "cost" | "auth">("security");

  const data = {
    security: {
      badge: "🚨 보안 구멍",
      label: "보안: S3 퍼블릭 유출",
      color: C.red,
      colorSoft: C.redSoft,
      title: "웹사이트 이미지 403 Forbidden 에러",
      userPrompt: "“웹사이트에서 S3 이미지가 403 에러로 안 떠요. 고쳐줘!”",
      aiMistake: (
        <>
          <div><b>AI의 위험한 처방:</b></div>
          <div style={{ marginTop: 4, color: C.inkSoft }}>
            “403 에러는 권한이 없어서 발생합니다. S3 버킷의 퍼블릭 차단을 해제하고 아래 정책을 추가하세요:”
          </div>
          <pre
            style={{
              margin: "8px 0 6px",
              padding: "8px 10px",
              borderRadius: 8,
              background: "#1E293B",
              color: "#F87171",
              fontFamily: MONO,
              fontSize: "0.78rem",
              lineHeight: 1.5,
              overflowX: "auto",
            }}
          >
            {`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}`}
          </pre>
          <div style={{ color: C.red, fontWeight: 700, fontSize: "0.82rem" }}>
            🚨 참사: "Principal": "*"로 인해 전 세계 누구나 파일을 다운로드할 수 있게 열려 회사 데이터 유출 사고 발생!
          </div>
        </>
      ),
      skepticismQuestion: "최신 AI 코딩 에이전트도 진짜로 이런 위험하고 멍청한 설정을 주나요?",
      skepticismAnswer: (
        <>
          <p style={{ margin: "4px 0" }}>
            <b>네, 지금도 ChatGPT(Codex)나 Claude Code 같은 최신 코딩 에이전트에 맥락 없이 “S3 이미지 403 해결해줘”라고만 치면 실제로 가장 흔히 작성해 주는 diff입니다.</b>
          </p>
          <ul style={{ margin: "4px 0 0 16px", padding: 0, lineHeight: 1.6 }}>
            <li>
              <b>맥락 없는 질문의 한계:</b> 질문자가 'CloudFront 뒤에 숨겨야 한다'는 아키텍처 맥락을 주지 않으면, 아무리 뛰어난 AI라도 403 에러를 당장 없애는 가장 빠른 통계적 경로(퍼블릭 개방)를 선택합니다.
            </li>
            <li>
              <b>경고는 달아도 코드는 열어버린다:</b> 최신 모델은 답변 끝에 '보안상 주의하라'는 각주를 덧붙이기도 하지만, 정작 메인으로 짜준 diff는 버킷 빗장을 푸는 코드입니다. 초심자는 에러가 사라지니 안심하고 배포했다가 유출 사고로 이어집니다.
            </li>
            <li>
              <b>판단과 책임은 사람의 몫:</b> AI 모델이 멍청해서가 아니라, 시스템의 보안 경계와 비즈니스 책임은 사람이 정해줘야 하기 때문입니다.
            </li>
          </ul>
        </>
      ),
      solutionPrompt: "“S3 버킷은 퍼블릭 차단(비공개)을 유지하고, CloudFront OAC로만 안전하게 서빙되도록 정책 짜줘”",
      solutionResult: (
        <>
          버킷을 전 세계에 여는 대신, 오직 캐시 서버(CloudFront)만 열 수 있는 전용 열쇠(OAC)를 쥐어주는 <b>안전한 최신 보안 아키텍처</b>가 완성됩니다.
        </>
      ),
    },
    cost: {
      badge: "💸 요금 폭탄",
      label: "요금: 이벤트 무한 루프",
      color: C.amber,
      colorSoft: C.amberSoft,
      title: "청구서에 찍힌 예상의 5배 요금 폭탄",
      userPrompt: "“Lambda로 파일 처리하는데 요금이 너무 많이 나왔어요. 코드에 while 무한 루프가 있나 봐줘”",
      aiMistake: (
        <>
          <div><b>AI의 오판:</b></div>
          <div style={{ marginTop: 4, color: C.inkSoft }}>
            “코드 전체를 검토했으나 <code>while</code>문이나 재귀 호출이 전혀 없습니다. 코드 문법에는 아무 이상이 없으니 안심하셔도 됩니다.”
          </div>
          <div style={{ marginTop: 8, color: C.red, fontWeight: 700, fontSize: "0.82rem" }}>
            🚨 참사: 코드는 멀쩡하지만, 몇 시간 만에 함수가 수백만 번 실행되어 월말 요금 폭탄!
          </div>
        </>
      ),
      skepticismQuestion: "인프라 YAML 설정 파일에 S3 트리거를 다 적어줬는데도 AI가 못 잡나요?",
      skepticismAnswer: (
        <>
          <p style={{ margin: "4px 0" }}>
            <b>못 잡습니다. 설정 파일과 코드 문법 둘 다 각각은 100% 정상 문법이기 때문입니다.</b>
          </p>
          <ul style={{ margin: "4px 0 0 16px", padding: 0, lineHeight: 1.6 }}>
            <li>
              <b>분리된 컨텍스트:</b> 실무에선 인프라 템플릿(YAML)과 비즈니스 코드(JS/Python)가 분리되어 있어, AI에게 코드와 에러 로그만 보여주는 경우가 대부분입니다.
            </li>
            <li>
              <b>런타임 이벤트의 맹점:</b> 설령 YAML을 통째로 줘도, <code>S3 업로드 → Lambda 실행</code> 설정 자체는 표준 문법입니다. 문제는 람다 함수가 결과를 '자기를 깨운 바로 그 버킷'에 다시 저장하며 생기는 <b>런타임 이벤트 무한 핑퐁</b>입니다.
            </li>
            <li>
              (이 사고가 얼마나 정적으로 잡기 어려웠으면 AWS 본사조차 2023년 말에야 클라우드 자체에서 재귀 루프를 강제 차단하는 감지 기능을 추가했을 정도입니다).
            </li>
          </ul>
        </>
      ),
      solutionPrompt: "“S3 업로드 이벤트는 uploads/ 접두사(prefix)로만 제한하고, 결과는 별도 버킷에 저장하도록 이벤트 흐름을 분리해줘”",
      solutionResult: (
        <>
          코드 내부를 고치는 게 아니라, <b>서비스 간 이벤트 연결 경로를 분리</b>하여 무한 루프 가능성을 원천 차단합니다.
        </>
      ),
    },
    auth: {
      badge: "🔑 권한 사고",
      label: "권한: AccessDenied 삽질",
      color: C.blue,
      colorSoft: C.blueSoft,
      title: "프로덕션에서만 AccessDenied 발생",
      userPrompt: "“로컬 내 컴퓨터에선 DB랑 S3가 잘 읽히는데, 배포하니까 AccessDenied 에러가 나요. 에러 로그 보고 고쳐줘”",
      aiMistake: (
        <>
          <div><b>AI의 헛발질:</b></div>
          <div style={{ marginTop: 4, color: C.inkSoft }}>
            “데이터베이스 조회 함수의 쿼리 매개변수나 예외 처리 로직에 오류가 있는 것 같습니다. 아래와 같이 애플리케이션 코드를 수정해 보세요...”
          </div>
          <div style={{ marginTop: 8, color: C.red, fontWeight: 700, fontSize: "0.82rem" }}>
            🚨 참사: 코드는 100% 무죄인데, AI 말만 믿고 멀쩡한 비즈니스 로직만 몇 시간째 뜯어고치는 삽질 반복!
          </div>
        </>
      ),
      skepticismQuestion: "초심자는 '에러 났으니 코드를 고치는 게 당연하지 않나?'라고 생각하기 쉬운데 왜 문제인가요?",
      skepticismAnswer: (
        <>
          <p style={{ margin: "4px 0" }}>
            <b>코드가 틀린 게 아니라, 코드를 실행하는 '주체(자격 증명)'가 환경마다 다르기 때문입니다.</b>
          </p>
          <ul style={{ margin: "4px 0 0 16px", padding: 0, lineHeight: 1.6 }}>
            <li>
              <b>로컬 개발 환경:</b> 내 PC에 등록된 내 관리자 AWS 계정 키로 실행되므로 모든 리소스에 접근 가능했습니다.
            </li>
            <li>
              <b>클라우드 프로덕션:</b> 내 PC 키가 아니라, 서버(Lambda)에 부여된 <b>실행 역할(IAM Role)</b>로 실행됩니다. 여기에 권한이 빠져 있어서 거부당한 것입니다.
            </li>
            <li>
              AI는 눈앞의 코드 문법만 볼 뿐 서버의 클라우드 IAM 역할을 알지 못하므로, 죄 없는 코드만 계속 만지작거립니다.
            </li>
          </ul>
        </>
      ),
      solutionPrompt: "“코드엔 문제없어. 이 Lambda가 S3 객체를 읽을 수 있도록 IAM 실행 역할에 최소 권한 정책을 추가해줘”",
      solutionResult: (
        <>
          멀쩡한 코드는 한 줄도 건드리지 않고, <b>클라우드 실행 주체에게 올바른 IAM 권한을 부여</b>하여 1분 만에 깔끔하게 해결합니다.
        </>
      ),
    },
  };

  const current = data[activeTab];

  return (
    <SimFrame title="AI 사고 심층 랩: 코드 바깥의 시스템 맹점 파헤치기" icon="🎛">
      <div style={{ fontSize: "0.86rem", color: C.inkSoft, marginBottom: 14 }}>
        탭을 눌러 각 사고에서 AI가 왜 어처구니없는 오판을 하는지, 그리고 독자들이 가장 많이 품는 현실적인 의문의 진실을 확인해 보세요.
      </div>

      {/* 탭 버튼 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {(["security", "cost", "auth"] as const).map((key) => {
          const item = data[key];
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              className="widget-btn"
              aria-pressed={active}
              onClick={() => setActiveTab(key)}
              style={{
                ...chipBtn(active, item.color, item.colorSoft),
                padding: "6px 13px",
                fontSize: "0.82rem",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 상세 내용 카드 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* 1. 초심자의 질문 & AI의 오판 */}
        <div
          style={{
            border: `1.5px solid ${C.line}`,
            borderRadius: 10,
            padding: "12px 14px",
            background: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: C.inkSoft, marginBottom: 4 }}>
            💬 초심자의 질문
          </div>
          <div style={{ fontSize: "0.92rem", fontWeight: 700, color: C.ink, marginBottom: 12 }}>
            {current.userPrompt}
          </div>

          <div
            style={{
              borderTop: `1px dashed ${C.line}`,
              paddingTop: 10,
              fontSize: "0.86rem",
            }}
          >
            {current.aiMistake}
          </div>
        </div>

        {/* 2. 현실적인 독자의 의문 & 시스템 진실 */}
        <div
          style={{
            border: `1.5px solid ${C.amber}`,
            borderRadius: 10,
            padding: "12px 14px",
            background: C.amberSoft,
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: C.amberText, marginBottom: 6 }}>
            🤔 잠깐! {current.skepticismQuestion}
          </div>
          <div style={{ fontSize: "0.85rem", color: C.ink, lineHeight: 1.6 }}>
            {current.skepticismAnswer}
          </div>
        </div>

        {/* 3. 시스템을 아는 개발자의 질문 & 정석 설계 */}
        <div
          style={{
            border: `1.5px solid ${C.teal}`,
            borderRadius: 10,
            padding: "12px 14px",
            background: C.tealSoft,
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: C.teal, marginBottom: 4 }}>
            ✨ 시스템을 이해한 개발자의 질문
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.ink, marginBottom: 6 }}>
            {current.solutionPrompt}
          </div>
          <div style={{ fontSize: "0.84rem", color: C.inkSoft, lineHeight: 1.5 }}>
            👉 <b>결과:</b> {current.solutionResult}
          </div>
        </div>
      </div>
    </SimFrame>
  );
}
