"use client";

import {
  C,
  ChLink,
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
import { sections } from "./meta";

const SANS = "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const MONO = "'JetBrains Mono', monospace";

/** 섹션 컴포넌트 목록 — 순서 = meta.sections (불일치는 아래 assert가 빌드 프리렌더에서 잡는다). */
const SECTIONS = [IamSection];

if (SECTIONS.length !== sections.length) {
  throw new Error(`ch0-2: 본문 섹션 ${SECTIONS.length}개 ≠ meta.sections ${sections.length}개`);
}

/** 규약 v2 — section 인덱스(0-based)의 섹션 하나만 렌더. 인트로/체크리스트는 첫/마지막 섹션에. */
export default function Ch02Body({ section }: { section: number }) {
  const S = SECTIONS[section];
  if (!S) throw new Error(`ch0-2: 섹션 인덱스 ${section} 범위 밖 (0..${SECTIONS.length - 1})`);
  return (
    <>
      {section === 0 && (
      <P>
        IAM(Identity and Access Management)은 AWS의 <b>출입 통제 시스템</b>입니다.{" "}
        <ChLink id="ch0-1">ch0-1</ChLink>에서 본 것처럼 모든 도구는 결국 같은 API를 부르고
        요청마다 SigV4로 서명되는데 — 서명 검증(인증)을
        통과한 다음 단계로, 모든 API 호출은 실행 전에 &ldquo;이 주체가 이 행동을 이 리소스에 해도
        되는가?&rdquo;를 IAM에게 검사받습니다. 구성 요소는 딱 두 종류로 나눠서 보면 쉽습니다:{" "}
        <b>주체(Identity)</b>와 <b>권한(Policy)</b>.
      </P>
      )}
      <S />
      {section === SECTIONS.length - 1 && (
      <Checklist
        title="체크리스트 — 이 문장이 술술 나오면 통과"
        items={[
          {
            text: "유저는 영구 신원, 롤은 빌려 쓰는 신원이고, 권한은 정책(JSON: Effect/Action/Resource)을 연결해야 생긴다",
            freq: "★★★",
          },
          {
            text: "명시적 Deny는 항상 Allow를 이기고, 기본값은 전부 거부다",
            freq: "★★★",
          },
          {
            text: "AWS 위에서 도는 코드의 인증은 액세스 키 하드코딩이 아니라 IAM 롤(임시 자격증명)이다",
            freq: "★★★",
          },
        ]}
      />
      )}
    </>
  );
}

function IamSection() {
  return (
    <Sec {...sections[0]}>
      <Fig caption="주체(유저·그룹·롤)에 정책(JSON)을 연결하면, 그 주체가 리소스에 접근할 수 있게 된다.">
        <IamStructureSvg />
      </Fig>

      <SubTitle>4가지 구성 요소</SubTitle>
      <Table
        head={["요소", "무엇인가", "한 줄 비유"]}
        rows={[
          [
            "유저 (User)",
            <>
              사람이나 애플리케이션을 나타내는 <b>영구 신원</b>. 비밀번호(콘솔용)와 액세스
              키(API용)를 가질 수 있음
            </>,
            "사원증을 가진 직원",
          ],
          [
            "그룹 (Group)",
            "유저의 묶음. 그룹에 정책을 붙이면 소속 유저 전원에게 적용",
            "“개발팀” 부서",
          ],
          [
            "롤 (Role)",
            <>
              고정 자격증명이 없는, <b>필요할 때 빌려 쓰는 신원</b>. EC2·Lambda 같은 서비스나
              다른 계정의 유저가 맡을(assume) 수 있고, 맡는 순간 <b>임시 자격증명</b>이 발급됨
            </>,
            "방문증 — 아무나 발급받을 수 있게 정해둔 규칙에 따라 잠깐 빌려 쓰고 반납",
          ],
          [
            "정책 (Policy)",
            "권한을 정의하는 JSON 문서. 주체(유저/그룹/롤)에 연결해야 효력 발생",
            "출입 허가 목록",
          ],
        ]}
      />

      <SubTitle>정책 JSON의 3대 키워드</SubTitle>
      <ul style={{ margin: "0.5rem 0 0.5rem 1.25rem" }}>
        <li style={{ margin: "6px 0" }}>
          <b>Effect</b> — <Code>Allow</Code> 또는 <Code>Deny</Code>. 기본은 전부 거부(암묵적
          Deny)이고, <b>명시적 Deny는 어떤 Allow보다 항상 이긴다</b>
        </li>
        <li style={{ margin: "6px 0" }}>
          <b>Action</b> — 허용/거부할 API 동작. 예: <Code>s3:GetObject</Code>,{" "}
          <Code>dynamodb:PutItem</Code>
        </li>
        <li style={{ margin: "6px 0" }}>
          <b>Resource</b> — 대상 리소스의 ARN. 예: <Code>arn:aws:s3:::my-bucket/*</Code>
        </li>
      </ul>
      <Note>
        평가 순서 감각: 명시적 Deny 있으면 → 거부 / 없고 Allow 있으면 → 허용 / 둘 다 없으면 →
        거부(기본값).
      </Note>

      <SubTitle>왜 &ldquo;유저의 액세스 키&rdquo;가 아니라 &ldquo;롤&rdquo;인가</SubTitle>
      <P>
        EC2 인스턴스 안의 코드가 S3에 접근해야 한다면? 액세스 키를 코드나 서버에 박아두면 유출 시
        영구적으로 악용됩니다. 대신 <b>인스턴스에 롤을 부여</b>하면 SDK가 임시 자격증명을
        자동으로 받아와 사용하고, 자격증명은 몇 시간 단위로 자동 만료·갱신됩니다 —{" "}
        <ChLink id="ch0-1">ch0-1의 자격증명 탐색 체인</ChLink> 마지막 단계(붙어 있는 IAM 롤)가
        바로 이것입니다.{" "}
        <b>&ldquo;AWS 위에서 도는 코드에는 키 대신 롤&rdquo;</b> — 이 한 문장이 DVA 전체를
        관통하는 정답 패턴입니다.
      </P>

      <ExamPoint>
        <ExamLi>
          <b>&ldquo;EC2/Lambda/ECS에서 다른 AWS 서비스에 접근&rdquo; → 정답은 거의 항상 IAM 롤.</b>{" "}
          액세스 키를 코드/환경변수/AMI에 넣는 선택지는 오답
        </ExamLi>
        <ExamLi>
          <b>최소 권한 원칙(Least Privilege)</b>: <Code>*</Code> 전체 허용보다 필요한
          Action·Resource만 허용하는 선택지가 정답
        </ExamLi>
        <ExamLi>
          정책 JSON을 보여주고 &ldquo;이 요청은 허용되는가?&rdquo;를 묻는 문제 — Deny 우선
          규칙과 Resource ARN 매칭을 읽을 줄 알아야 함
        </ExamLi>
        <ExamLi>
          교차 계정 접근, 임시 권한 → <b>STS AssumeRole</b> 키워드
        </ExamLi>
        <ExamLi>루트 계정은 일상 업무에 쓰지 않고 MFA로 잠가둔다 — 베스트 프랙티스형 문항</ExamLi>
      </ExamPoint>
    </Sec>
  );
}

function IamStructureSvg() {
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
