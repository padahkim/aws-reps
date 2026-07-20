import type { ReactNode } from "react";
import { C } from "../ui";

/** 챕터 도식 SVG 모음 (규약 v3) — sections/*.mdx 가 import 한다. 내용은 body.tsx 시절 그대로. */

const SANS = "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const MONO = "'JetBrains Mono', monospace";

export function GlobalInfraSvg() {
  const az = (x: number, code: string, name: string) => (
    <>
      <rect x={x} y={130} width={120} height={200} rx={10} fill="#FFFFFF" stroke={C.teal} strokeWidth={2} />
      <text x={x + 60} y={158} fontSize={13} fontWeight={900} fill={C.teal} textAnchor="middle">
        {name}
      </text>
      <text x={x + 60} y={176} fontSize={10.5} fill={C.inkSoft} textAnchor="middle">
        {code}
      </text>
      <rect x={x + 16} y={192} width={88} height={34} rx={6} fill={C.tealSoft} />
      <text x={x + 60} y={214} fontSize={11} textAnchor="middle" fill={C.teal}>
        데이터센터 🏢
      </text>
      <rect x={x + 16} y={234} width={88} height={34} rx={6} fill={C.tealSoft} />
      <text x={x + 60} y={256} fontSize={11} textAnchor="middle" fill={C.teal}>
        데이터센터 🏢
      </text>
    </>
  );

  return (
    <svg viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg" fontFamily={SANS} style={{ width: "100%", height: "auto", display: "block" }}>
      <rect x={10} y={10} width={740} height={400} rx={16} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="6 5" />
      <text x={30} y={40} fontSize={14} fontWeight={900} fill={C.inkSoft}>
        🌏 AWS 글로벌 인프라
      </text>

      {/* 서울 리전 */}
      <rect x={40} y={60} width={440} height={320} rx={14} fill={C.blueSoft} stroke={C.blue} strokeWidth={2.5} />
      <text x={60} y={92} fontSize={15} fontWeight={900} fill={C.blue}>
        리전: 서울 (ap-northeast-2)
      </text>
      <text x={60} y={112} fontSize={12} fill={C.inkSoft}>
        지리적으로 독립된 하나의 지역
      </text>

      {az(60, "ap-northeast-2a", "AZ-a")}
      <text x={120} y={308} fontSize={10.5} fill={C.inkSoft} textAnchor="middle">
        1개 이상의
      </text>
      <text x={120} y={322} fontSize={10.5} fill={C.inkSoft} textAnchor="middle">
        데이터센터 묶음
      </text>
      {az(200, "ap-northeast-2b", "AZ-b")}
      {az(340, "ap-northeast-2c", "AZ-c")}

      <line x1={180} y1={290} x2={200} y2={290} stroke={C.amber} strokeWidth={3} />
      <line x1={320} y1={290} x2={340} y2={290} stroke={C.amber} strokeWidth={3} />
      <text x={260} y={352} fontSize={11.5} fill={C.amberText} textAnchor="middle" fontWeight={700}>
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

      {/* 엣지 */}
      <rect x={520} y={240} width={210} height={140} rx={14} fill={C.amberSoft} stroke={C.amber} strokeWidth={2} />
      <text x={540} y={272} fontSize={14} fontWeight={900} fill={C.amberText}>
        엣지 로케이션
      </text>
      <text x={540} y={296} fontSize={11.5} fill={C.inkSoft}>
        리전보다 훨씬 많은 소규모 거점
      </text>
      <text x={540} y={316} fontSize={11.5} fill={C.inkSoft}>
        CloudFront(CDN) 캐시,
      </text>
      <text x={540} y={336} fontSize={11.5} fill={C.inkSoft}>
        Route 53 등이 여기서 동작
      </text>
      <text x={540} y={362} fontSize={11} fill={C.amberText} fontWeight={700}>
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
      {client(280, "⌨️ CLI", <tspan fontFamily={MONO}>aws s3 ls</tspan>, "인증: 액세스 키 / 롤")}
      {client(530, "📦 SDK", "Python(boto3), JS, Java…", "인증: 액세스 키 / 롤")}

      <line x1={130} y1={120} x2={330} y2={196} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#arrow-api)" />
      <line x1={380} y1={120} x2={380} y2={196} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#arrow-api)" />
      <line x1={630} y1={120} x2={430} y2={196} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#arrow-api)" />

      <rect x={180} y={200} width={400} height={72} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={2.5} />
      <text x={380} y={228} fontSize={14} fontWeight={900} fill={C.amberText} textAnchor="middle">
        🔏 요청 서명 (SigV4)
      </text>
      <text x={380} y={252} fontSize={12} fill={C.inkSoft} textAnchor="middle">
        자격증명으로 요청에 서명 → &ldquo;누가 보냈는지&rdquo;를 증명 (도구가 자동 처리)
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
