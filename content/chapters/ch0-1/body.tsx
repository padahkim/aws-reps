"use client";

import type { ReactNode } from "react";
import {
  C,
  Checklist,
  Code,
  ExamLi,
  ExamPoint,
  Fig,
  Note,
  P,
  Sec,
  SubTitle,
  Table,
} from "../ui";

const SANS = "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const MONO = "'JetBrains Mono', monospace";

export default function Ch01Body() {
  return (
    <>
      <P>
        어떤 서비스를 배우든 계속 등장하는 기반 개념 — 인프라의 물리적 구조(리전/AZ), 모든
        도구가 수렴하는 API와 자격증명, 그리고 요금의 사고방식. 여기서 다루는 &ldquo;문법&rdquo;은
        이후 모든 서비스 설명이 전제로 깔고 가는 공통 언어입니다. 이 챕터는 개념 이해 중심이며,
        실습은 포함하지 않습니다. (출입 통제 시스템인 IAM은 별도 챕터 ch0-2에서 다룹니다.)
      </P>

      <RegionAzSection />
      <ApiSection />
      <PricingSection />

      <Checklist
        title="체크리스트 — 이 문장이 술술 나오면 통과"
        items={[
          {
            text: "리전은 지리적 지역, AZ는 리전 안의 분리된 데이터센터 그룹이며, 여러 AZ에 걸치는 것이 고가용성의 기본이다",
            freq: "★★☆",
          },
          {
            text: "콘솔·CLI·SDK는 전부 같은 API를 부르며, 모든 요청은 자격증명으로 서명(SigV4)된다",
            freq: "★★★",
          },
          {
            text: "SDK는 코드 → 환경변수 → 설정파일 → 롤 순서로 자격증명을 찾는다",
            freq: "★★☆",
          },
          {
            text: "요금은 종량제(컴퓨팅·스토리지·아웃바운드 전송)이고, “운영 부담 최소화” 문구는 관리형/서버리스가 정답 방향이다",
            freq: "★★☆",
          },
        ]}
      />
    </>
  );
}

/* ── 01 리전 / 가용영역 ─────────────────────────────────────────────── */

function RegionAzSection() {
  return (
    <Sec
      num="01"
      title="리전 / 가용영역(AZ)"
      sub={'"내 리소스는 물리적으로 어디에 있는가"'}
      freq="mid"
      freqLabel="빈출 ★★☆ · 직접 문항은 적지만 모든 문제의 전제"
    >
      <P>
        AWS는 전 세계에 데이터센터를 깔아 두고, 이를{" "}
        <b>리전(Region) → 가용영역(AZ) → 데이터센터</b>의 계층으로 묶어서 제공합니다.
      </P>

      <Fig caption="계층 구조: 리전 ⊃ 가용영역(AZ) ⊃ 데이터센터. 엣지 로케이션은 이와 별개의 촘촘한 캐시 거점망.">
        <GlobalInfraSvg />
      </Fig>

      <SubTitle>핵심 개념</SubTitle>
      <Table
        head={["용어", "정의", "기억할 것"]}
        rows={[
          [
            "리전 (Region)",
            <>
              지리적으로 독립된 지역. 예: 서울 <Code>ap-northeast-2</Code>
            </>,
            "리전을 선택하면 대부분의 리소스는 그 리전 안에만 존재. 기준: 지연시간, 규제(데이터 주권), 서비스 지원 여부, 가격",
          ],
          [
            "가용영역 (AZ)",
            "리전 내 물리적으로 분리된 데이터센터 그룹 (모든 리전은 최소 3개)",
            <>
              한 AZ가 정전·재해로 죽어도 다른 AZ는 살아있음 →{" "}
              <b>Multi-AZ = 고가용성(HA)의 기본기</b>
            </>,
          ],
          [
            "엣지 로케이션",
            "전 세계 수백 개의 캐시/접점 거점",
            "CloudFront, Route 53, Global Accelerator가 사용. 리전·AZ와는 별개",
          ],
        ]}
      />

      <SubTitle>서비스의 &ldquo;범위&rdquo; 감각</SubTitle>
      <ul style={{ margin: "0.5rem 0 0.5rem 1.25rem" }}>
        <li style={{ margin: "6px 0" }}>
          <b>글로벌 서비스</b>: IAM, Route 53, CloudFront — 리전을 골라도 전체에 적용
        </li>
        <li style={{ margin: "6px 0" }}>
          <b>리전 서비스</b>: S3, DynamoDB, Lambda — 리전 단위로 존재 (대부분이 여기 해당)
        </li>
        <li style={{ margin: "6px 0" }}>
          <b>AZ 단위 리소스</b>: EC2 인스턴스, EBS 볼륨, 서브넷 — 특정 AZ 하나에 놓임
        </li>
      </ul>
      <Note>
        EBS 볼륨은 같은 AZ의 EC2에만 붙일 수 있다 — 이런 식으로 &ldquo;이 리소스는 어느 범위에
        사는가&rdquo;가 뒤 단계의 함정 문제로 계속 재활용됩니다.
      </Note>

      <ExamPoint>
        <ExamLi>
          &ldquo;리전이 무엇인가&rdquo; 같은 직접 질문은 드물고,{" "}
          <b>고가용성을 위해 여러 AZ에 배포</b>하라는 선택지의 전제로 등장
        </ExamLi>
        <ExamLi>
          지연시간을 줄여야 한다 → 사용자와 가까운 <b>리전 선택</b> 또는 <b>CloudFront(엣지)</b>가
          정답 패턴
        </ExamLi>
        <ExamLi>
          리소스 이름 규칙 감각: 리전 코드 <Code>ap-northeast-2</Code>, AZ 코드{" "}
          <Code>ap-northeast-2a</Code>
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

function GlobalInfraSvg() {
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

/* ── 02 AWS API의 구조 ──────────────────────────────────────────────── */

function ApiSection() {
  return (
    <Sec
      num="02"
      title="AWS API의 구조"
      sub="콘솔·CLI·SDK는 전부 &ldquo;같은 API&rdquo;를 부르는 다른 껍데기"
      freq="hi"
      freqLabel="빈출 ★★★ · 자격증명 관련은 개발자 시험의 핵심"
    >
      <P>
        AWS의 모든 것은 <b>HTTPS API</b>입니다. 웹 콘솔에서 버튼을 누르든, 터미널에서 CLI 명령을
        치든, 코드에서 SDK를 호출하든 — 최종적으로는 전부 동일한 API 엔드포인트로 서명된 HTTP
        요청이 날아갑니다. 이 사실 하나를 알면 &ldquo;콘솔에서 되는 건 코드에서도 된다&rdquo;는
        감각이 생깁니다.
      </P>

      <Fig caption="세 가지 도구 모두 같은 API로 수렴한다. 요청마다 자격증명으로 서명(SigV4)되고, IAM이 인가를 검사한다.">
        <ApiConvergeSvg />
      </Fig>

      <SubTitle>자격증명(Credentials)이란</SubTitle>
      <Table
        head={["종류", "구성", "용도 / 특징"]}
        rows={[
          ["비밀번호", "ID + 비밀번호 (+ MFA)", "콘솔 로그인 전용. API 호출에는 못 씀"],
          [
            "액세스 키",
            "Access Key ID + Secret Access Key 한 쌍",
            <>
              CLI·SDK에서 API 호출용. <b>영구 자격증명이라 유출 시 치명적</b> — 절대
              코드/깃허브에 넣지 않기
            </>,
          ],
          [
            "임시 자격증명",
            "키 쌍 + 세션 토큰 (STS 발급)",
            <>
              롤을 맡으면 자동 발급. 만료 시간이 있어 안전 → <b>권장 방식</b>
            </>,
          ],
        ]}
      />

      <SubTitle>SDK/CLI가 자격증명을 찾는 순서 (Credential Provider Chain)</SubTitle>
      <P>코드에 키를 직접 쓰지 않아도 SDK가 알아서 아래 순서로 자격증명을 탐색합니다:</P>
      <ul style={{ margin: "0.5rem 0 0.5rem 1.25rem" }}>
        <li style={{ margin: "6px 0" }}>
          ① 코드에 명시된 파라미터 → ② 환경변수 (<Code>AWS_ACCESS_KEY_ID</Code> 등) → ③ 설정
          파일 (<Code>~/.aws/credentials</Code>) → ④ <b>붙어 있는 IAM 롤</b> (EC2 인스턴스
          프로파일, Lambda 실행 롤 등)
        </li>
      </ul>
      <Note>
        그래서 EC2에 롤만 붙여두면 코드는 자격증명을 전혀 몰라도 동작합니다. &ldquo;같은 코드가
        로컬에서는 설정 파일, EC2에서는 롤로 인증된다&rdquo; — 이 체인 개념이 시험에 나옵니다.
      </Note>

      <ExamPoint>
        <ExamLi>
          &ldquo;애플리케이션에 자격증명을 가장 안전하게 제공하는 방법은?&rdquo; → <b>IAM 롤</b>{" "}
          (하드코딩·환경변수·설정파일 배포는 오답)
        </ExamLi>
        <ExamLi>
          API 요청은 <b>SigV4로 서명</b>된다 — S3 presigned URL 등 뒤 단계 주제의 기반
        </ExamLi>
        <ExamLi>
          CLI에서 임시로 다른 권한이 필요 → <Code>sts assume-role</Code> 패턴
        </ExamLi>
        <ExamLi>
          <b>403 AccessDenied</b> = 인가(정책) 실패, <b>403 SignatureDoesNotMatch</b> =
          서명/자격증명 문제 — 상태 코드가 아니라 <b>에러 코드</b>로 구분하라 (트러블슈팅형
          문항의 단서)
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

function ApiConvergeSvg() {
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

/* ── 03 요금의 기본 사고방식 ────────────────────────────────────────── */

function PricingSection() {
  return (
    <Sec
      num="03"
      title="요금의 기본 사고방식"
      sub="쓴 만큼 낸다 · 관리형 vs 직접 운영"
      freq="lo"
      freqLabel="빈출 ★☆☆ · 직접 출제는 드물지만 &ldquo;정답 고르는 감각&rdquo;의 뿌리"
    >
      <P>
        AWS 요금의 대원칙은 <b>종량제(Pay-as-you-go)</b> — 선투자 없이, 쓴 만큼만, 초·요청·GB
        단위로 냅니다. 과금 축은 크게 세 가지입니다: <b>컴퓨팅(실행 시간)</b>,{" "}
        <b>스토리지(저장 용량×기간)</b>,{" "}
        <b>데이터 전송(특히 AWS 밖으로 나가는 아웃바운드)</b>. 들어오는 데이터(인바운드)는
        대부분 무료라는 것도 기억해 두세요.
      </P>

      <Fig caption="오른쪽으로 갈수록 운영 부담이 AWS로 넘어가고, 과금은 &ldquo;확보한 자원&rdquo; 기준에서 &ldquo;실제 사용량&rdquo; 기준으로 바뀐다.">
        <ManagedSpectrumSvg />
      </Fig>

      <SubTitle>관리형(Managed) vs 직접 운영의 의미</SubTitle>
      <P>
        <b>관리형 서비스</b>란 서버 프로비저닝·패치·백업·장애 조치 같은 &ldquo;운영
        잡일&rdquo;을 AWS가 대신 해주는 서비스입니다. DVA는 개발자 시험이라{" "}
        <b>&ldquo;운영 부담을 줄이고 코드에 집중&rdquo;</b>이라는 방향의 선택지가 정답인 경우가
        압도적으로 많습니다. 문제에서 <i>&ldquo;minimal operational overhead&rdquo;</i>,{" "}
        <i>&ldquo;least management effort&rdquo;</i> 같은 문구가 보이면 관리형/서버리스 쪽
        선택지에 가중치를 두세요.
      </P>

      <SubTitle>알아두면 좋은 부가 개념</SubTitle>
      <ul style={{ margin: "0.5rem 0 0.5rem 1.25rem" }}>
        <li style={{ margin: "6px 0" }}>
          <b>프리 티어</b> — 신규 계정에 일부 서비스를 일정량 무료 제공 (학습용)
        </li>
        <li style={{ margin: "6px 0" }}>
          <b>EC2 구매 옵션 감각</b> — 온디맨드(기본, 유연) / 예약·Savings Plans(장기 약정 할인)
          / 스팟(최대 90% 할인, 대신 중단될 수 있음 → 중단 허용 워크로드용)
        </li>
        <li style={{ margin: "6px 0" }}>
          <b>리전마다 가격이 다르다</b> — 같은 서비스라도 리전에 따라 단가 차이
        </li>
        <li style={{ margin: "6px 0" }}>
          <b>공동 책임 모델</b> — AWS는 &ldquo;클라우드 자체의&rdquo; 보안(하드웨어·시설),
          고객은 &ldquo;클라우드 안의&rdquo; 보안(데이터·IAM 설정·앱)을 책임. 관리형일수록 AWS
          쪽 책임 범위가 넓어짐
        </li>
      </ul>

      <ExamPoint>
        <ExamLi>요금 계산 문제 자체는 거의 안 나옴 (그건 Cloud Practitioner 영역)</ExamLi>
        <ExamLi>
          대신 <b>&ldquo;운영 오버헤드 최소화&rdquo; = 관리형/서버리스 선택</b>이라는 판단
          기준으로 계속 활용됨
        </ExamLi>
        <ExamLi>
          &ldquo;비용 효율적(cost-effective)&rdquo; 조건이 붙으면: 안 쓸 때 0원인 서버리스,
          중단 허용이면 스팟 — 이런 방향 감각을 묻는 문항
        </ExamLi>
      </ExamPoint>
    </Sec>
  );
}

function ManagedSpectrumSvg() {
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
