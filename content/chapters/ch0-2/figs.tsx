import { C } from "../ui";

/** 챕터 도식 SVG 모음 (규약 v3) — sections/*.mdx 가 import 한다. 내용은 body.tsx 시절 그대로. */

const SANS = "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const MONO = "'JetBrains Mono', monospace";

export function IamStructureSvg() {
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
