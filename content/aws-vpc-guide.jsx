//fable 5 high
import { useState } from "react";

/* ────────────────────────────────────────────────
   AWS VPC 완전 정복 가이드
   강의 109~114 (실습 제외) 전체 내용 + 시험 빈출도
   ──────────────────────────────────────────────── */

const C = {
  ink: "#15202F",
  sub: "#5A6A80",
  bg: "#F2F4F8",
  card: "#FFFFFF",
  line: "#DDE3EC",
  orange: "#E8830C",
  orangeSoft: "#FDF1E1",
  green: "#1E9E6E",
  greenSoft: "#E4F5EE",
  blue: "#3D6FE0",
  blueSoft: "#E9F0FD",
  red: "#D64545",
  redSoft: "#FCE9E9",
  purple: "#7C5CD6",
  purpleSoft: "#F0EBFB",
  navy: "#1F2D45",
};

/* ── 빈출도 배지 ── */
function FreqBadge({ level }) {
  const map = {
    3: { label: "빈출도 상", bg: C.redSoft, fg: C.red, dots: "●●●" },
    2: { label: "빈출도 중", bg: C.orangeSoft, fg: C.orange, dots: "●●○" },
    1: { label: "빈출도 하", bg: C.blueSoft, fg: C.blue, dots: "●○○" },
  };
  const m = map[level];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ background: m.bg, color: m.fg }}
    >
      <span style={{ letterSpacing: "1px" }}>{m.dots}</span> {m.label}
    </span>
  );
}

/* ── 공통 카드 ── */
function Card({ title, freq, children, accent }) {
  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderTop: accent ? `4px solid ${accent}` : `1px solid ${C.line}`,
      }}
    >
      {title && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="text-lg font-bold" style={{ color: C.ink }}>
            {title}
          </h3>
          {freq && <FreqBadge level={freq} />}
        </div>
      )}
      {children}
    </div>
  );
}

function P({ children }) {
  return (
    <p className="text-sm leading-7 mb-3" style={{ color: C.ink }}>
      {children}
    </p>
  );
}

function Hi({ children, color = C.orange }) {
  return (
    <strong style={{ color }} className="font-bold">
      {children}
    </strong>
  );
}

function Code({ children }) {
  return (
    <code
      className="rounded px-1.5 py-0.5 text-xs font-mono"
      style={{ background: C.blueSoft, color: C.blue }}
    >
      {children}
    </code>
  );
}

/* ── 다이어그램 상세 패널 ── */
function DetailPanel({ info, sel }) {
  const d = sel ? info[sel] : null;
  return (
    <div
      className="rounded-xl px-4 py-3 mt-3 text-sm leading-6 transition-all"
      style={{
        background: d ? C.orangeSoft : C.bg,
        border: `1px dashed ${d ? C.orange : C.line}`,
        color: C.ink,
        minHeight: "64px",
      }}
    >
      {d ? (
        <>
          <div className="font-bold mb-1" style={{ color: C.orange }}>
            {d.t}
          </div>
          <div>{d.d}</div>
        </>
      ) : (
        <div style={{ color: C.sub }}>
          👆 다이어그램의 구성 요소를 클릭하면 상세 설명이 표시됩니다.
        </div>
      )}
    </div>
  );
}

/* 클릭 가능한 SVG 노드 헬퍼 */
const clickable = (sel, id, setSel) => ({
  onClick: () => setSel(sel === id ? null : id),
  style: { cursor: "pointer" },
  opacity: sel && sel !== id ? 0.45 : 1,
});

/* ════════════════════════════════════════════════
   다이어그램 1 : VPC 마스터 구조 (VPC·서브넷·IGW·NAT)
   ════════════════════════════════════════════════ */
function VpcMasterDiagram() {
  const [sel, setSel] = useState(null);
  const info = {
    internet: {
      t: "인터넷 (Internet)",
      d: "VPC 외부의 퍼블릭 네트워크입니다. VPC 내부 리소스가 인터넷과 통신하려면 반드시 IGW를 거쳐야 합니다.",
    },
    igw: {
      t: "IGW — 인터넷 게이트웨이",
      d: "VPC를 인터넷과 연결해 주는 관문입니다. VPC당 1개만 연결 가능하며, 수평 확장되고 고가용성을 자체 제공합니다. 퍼블릭 서브넷의 라우팅 테이블에 0.0.0.0/0 → IGW 경로가 있어야 인터넷 통신이 가능합니다.",
    },
    vpc: {
      t: "VPC — Virtual Private Cloud",
      d: "AWS 클라우드 내의 논리적으로 격리된 프라이빗 네트워크입니다. 리전(Region) 단위 리소스이며, CIDR 블록(예: 10.0.0.0/16)으로 IP 범위를 정의합니다. 리전당 기본 최대 5개(소프트 리밋)까지 생성 가능하고, 모든 신규 계정에는 기본 VPC(Default VPC)가 제공됩니다.",
    },
    pubA: {
      t: "퍼블릭 서브넷 (Public Subnet)",
      d: "인터넷에서 접근 가능한 서브넷입니다. 라우팅 테이블에 IGW로 향하는 경로(0.0.0.0/0 → IGW)가 있으면 퍼블릭 서브넷이 됩니다. 주로 로드밸런서, NAT 게이트웨이, Bastion Host를 배치합니다.",
    },
    privA: {
      t: "프라이빗 서브넷 (Private Subnet)",
      d: "인터넷에서 직접 접근할 수 없는 서브넷입니다. 라우팅 테이블에 IGW 경로가 없습니다. 애플리케이션 서버, 데이터베이스처럼 외부 노출이 불필요한 리소스를 배치합니다.",
    },
    nat: {
      t: "NAT 게이트웨이",
      d: "프라이빗 서브넷의 인스턴스가 '아웃바운드'로만 인터넷에 접근하게 해 줍니다(소프트웨어 업데이트 등). 인터넷에서 인스턴스로의 인바운드 접근은 차단됩니다. AWS 완전관리형이며 반드시 '퍼블릭 서브넷'에 배치하고 IGW와 함께 동작합니다.",
    },
    ec2pub: {
      t: "퍼블릭 EC2 인스턴스",
      d: "퍼블릭 IP를 가지며 IGW를 통해 인터넷과 직접 양방향 통신이 가능합니다. 예: 웹서버, Bastion Host.",
    },
    ec2priv: {
      t: "프라이빗 EC2 인스턴스",
      d: "프라이빗 IP만 가지며 인터넷에서 직접 접근이 불가능합니다. 인터넷에 나갈 때는 NAT 게이트웨이를 경유합니다 (프라이빗 EC2 → NAT GW → IGW → 인터넷).",
    },
    rds: {
      t: "데이터베이스 (RDS 등)",
      d: "가장 보호가 필요한 계층으로, 프라이빗 서브넷에 배치하는 것이 모범 사례입니다.",
    },
    az: {
      t: "가용 영역 (Availability Zone)",
      d: "서브넷은 반드시 '하나의 AZ'에 속합니다 (VPC는 리전 단위, 서브넷은 AZ 단위). 고가용성을 위해 여러 AZ에 서브넷을 나눠 배치합니다.",
    },
    cidr: {
      t: "CIDR 블록",
      d: "VPC의 IP 주소 범위입니다. 예: 10.0.0.0/16은 65,536개의 IP를 의미합니다. 서브넷은 이 범위를 더 작게 나눈 것(예: 10.0.1.0/24)이며, VPC 피어링 시 CIDR이 겹치면 안 됩니다.",
    },
  };

  const box = (props) => <rect rx="10" {...props} />;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 880 600"
          className="w-full"
          style={{ minWidth: "640px" }}
        >
          {/* 인터넷 */}
          <g {...clickable(sel, "internet", setSel)}>
            <ellipse cx="440" cy="42" rx="120" ry="30" fill={C.navy} />
            <text
              x="440"
              y="40"
              textAnchor="middle"
              fill="#fff"
              fontSize="15"
              fontWeight="700"
            >
              🌐 인터넷
            </text>
            <text
              x="440"
              y="58"
              textAnchor="middle"
              fill="#B9C6DD"
              fontSize="10"
            >
              (클릭해서 설명 보기)
            </text>
          </g>

          {/* 인터넷 ↔ IGW 양방향 */}
          <line
            x1="440"
            y1="72"
            x2="440"
            y2="108"
            stroke={C.orange}
            strokeWidth="3"
          />
          <polygon points="440,104 434,94 446,94" fill={C.orange} />
          <polygon points="440,76 434,86 446,86" fill={C.orange} />

          {/* VPC 컨테이너 */}
          <g {...clickable(sel, "vpc", setSel)}>
            {box({
              x: 40,
              y: 140,
              width: 800,
              height: 440,
              fill: "#FBFCFE",
              stroke: C.orange,
              strokeWidth: 2.5,
              strokeDasharray: "0",
            })}
            <text x="60" y="168" fill={C.orange} fontSize="15" fontWeight="800">
              VPC
            </text>
          </g>
          <g {...clickable(sel, "cidr", setSel)}>
            <rect
              x="110"
              y="150"
              width="150"
              height="26"
              rx="13"
              fill={C.blueSoft}
              stroke={C.blue}
            />
            <text
              x="185"
              y="167"
              textAnchor="middle"
              fill={C.blue}
              fontSize="12"
              fontWeight="700"
              fontFamily="monospace"
            >
              CIDR 10.0.0.0/16
            </text>
          </g>

          {/* IGW (VPC 경계 위) */}
          <g {...clickable(sel, "igw", setSel)}>
            <rect
              x="385"
              y="112"
              width="110"
              height="52"
              rx="12"
              fill={C.orange}
            />
            <text
              x="440"
              y="134"
              textAnchor="middle"
              fill="#fff"
              fontSize="13"
              fontWeight="800"
            >
              IGW
            </text>
            <text
              x="440"
              y="152"
              textAnchor="middle"
              fill="#FFE9CF"
              fontSize="10"
            >
              인터넷 게이트웨이
            </text>
          </g>

          {/* AZ A */}
          <g {...clickable(sel, "az", setSel)}>
            {box({
              x: 70,
              y: 200,
              width: 360,
              height: 350,
              fill: "none",
              stroke: C.sub,
              strokeWidth: 1.5,
              strokeDasharray: "7 5",
            })}
            <text x="90" y="192" fill={C.sub} fontSize="12" fontWeight="700">
              가용 영역 A (AZ-a)
            </text>
          </g>
          {/* AZ B */}
          <g {...clickable(sel, "az", setSel)}>
            {box({
              x: 450,
              y: 200,
              width: 360,
              height: 350,
              fill: "none",
              stroke: C.sub,
              strokeWidth: 1.5,
              strokeDasharray: "7 5",
            })}
            <text x="470" y="192" fill={C.sub} fontSize="12" fontWeight="700">
              가용 영역 B (AZ-b)
            </text>
          </g>

          {/* 퍼블릭 서브넷 A */}
          <g {...clickable(sel, "pubA", setSel)}>
            {box({
              x: 90,
              y: 215,
              width: 320,
              height: 140,
              fill: C.greenSoft,
              stroke: C.green,
              strokeWidth: 2,
            })}
            <text x="106" y="238" fill={C.green} fontSize="12" fontWeight="800">
              퍼블릭 서브넷
            </text>
            <text
              x="106"
              y="254"
              fill={C.green}
              fontSize="10"
              fontFamily="monospace"
            >
              10.0.1.0/24
            </text>
          </g>
          {/* NAT GW */}
          <g {...clickable(sel, "nat", setSel)}>
            <rect
              x="120"
              y="270"
              width="120"
              height="66"
              rx="10"
              fill={C.green}
            />
            <text
              x="180"
              y="298"
              textAnchor="middle"
              fill="#fff"
              fontSize="13"
              fontWeight="800"
            >
              NAT GW
            </text>
            <text
              x="180"
              y="316"
              textAnchor="middle"
              fill="#DCF4E9"
              fontSize="10"
            >
              아웃바운드 전용
            </text>
          </g>
          {/* 퍼블릭 EC2 */}
          <g {...clickable(sel, "ec2pub", setSel)}>
            <rect
              x="272"
              y="270"
              width="116"
              height="66"
              rx="10"
              fill="#fff"
              stroke={C.green}
              strokeWidth="2"
            />
            <text
              x="330"
              y="298"
              textAnchor="middle"
              fill={C.green}
              fontSize="13"
              fontWeight="800"
            >
              EC2
            </text>
            <text
              x="330"
              y="316"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              퍼블릭 IP 보유
            </text>
          </g>

          {/* 퍼블릭 서브넷 B */}
          <g {...clickable(sel, "pubA", setSel)}>
            {box({
              x: 470,
              y: 215,
              width: 320,
              height: 140,
              fill: C.greenSoft,
              stroke: C.green,
              strokeWidth: 2,
            })}
            <text x="486" y="238" fill={C.green} fontSize="12" fontWeight="800">
              퍼블릭 서브넷
            </text>
            <text
              x="486"
              y="254"
              fill={C.green}
              fontSize="10"
              fontFamily="monospace"
            >
              10.0.2.0/24
            </text>
          </g>
          <g {...clickable(sel, "ec2pub", setSel)}>
            <rect
              x="560"
              y="270"
              width="140"
              height="66"
              rx="10"
              fill="#fff"
              stroke={C.green}
              strokeWidth="2"
            />
            <text
              x="630"
              y="298"
              textAnchor="middle"
              fill={C.green}
              fontSize="13"
              fontWeight="800"
            >
              ELB / Bastion
            </text>
            <text
              x="630"
              y="316"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              외부 노출 리소스
            </text>
          </g>

          {/* 프라이빗 서브넷 A */}
          <g {...clickable(sel, "privA", setSel)}>
            {box({
              x: 90,
              y: 380,
              width: 320,
              height: 150,
              fill: C.blueSoft,
              stroke: C.blue,
              strokeWidth: 2,
            })}
            <text x="106" y="403" fill={C.blue} fontSize="12" fontWeight="800">
              프라이빗 서브넷
            </text>
            <text
              x="106"
              y="419"
              fill={C.blue}
              fontSize="10"
              fontFamily="monospace"
            >
              10.0.11.0/24
            </text>
          </g>
          <g {...clickable(sel, "ec2priv", setSel)}>
            <rect
              x="120"
              y="435"
              width="120"
              height="66"
              rx="10"
              fill="#fff"
              stroke={C.blue}
              strokeWidth="2"
            />
            <text
              x="180"
              y="463"
              textAnchor="middle"
              fill={C.blue}
              fontSize="13"
              fontWeight="800"
            >
              EC2 (앱)
            </text>
            <text
              x="180"
              y="481"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              프라이빗 IP만
            </text>
          </g>
          <g {...clickable(sel, "rds", setSel)}>
            <rect
              x="272"
              y="435"
              width="116"
              height="66"
              rx="10"
              fill="#fff"
              stroke={C.blue}
              strokeWidth="2"
            />
            <text
              x="330"
              y="463"
              textAnchor="middle"
              fill={C.blue}
              fontSize="13"
              fontWeight="800"
            >
              RDS
            </text>
            <text
              x="330"
              y="481"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              데이터베이스
            </text>
          </g>

          {/* 프라이빗 서브넷 B */}
          <g {...clickable(sel, "privA", setSel)}>
            {box({
              x: 470,
              y: 380,
              width: 320,
              height: 150,
              fill: C.blueSoft,
              stroke: C.blue,
              strokeWidth: 2,
            })}
            <text x="486" y="403" fill={C.blue} fontSize="12" fontWeight="800">
              프라이빗 서브넷
            </text>
            <text
              x="486"
              y="419"
              fill={C.blue}
              fontSize="10"
              fontFamily="monospace"
            >
              10.0.12.0/24
            </text>
          </g>
          <g {...clickable(sel, "ec2priv", setSel)}>
            <rect
              x="500"
              y="435"
              width="120"
              height="66"
              rx="10"
              fill="#fff"
              stroke={C.blue}
              strokeWidth="2"
            />
            <text
              x="560"
              y="463"
              textAnchor="middle"
              fill={C.blue}
              fontSize="13"
              fontWeight="800"
            >
              EC2 (앱)
            </text>
            <text
              x="560"
              y="481"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              프라이빗 IP만
            </text>
          </g>
          <g {...clickable(sel, "rds", setSel)}>
            <rect
              x="652"
              y="435"
              width="116"
              height="66"
              rx="10"
              fill="#fff"
              stroke={C.blue}
              strokeWidth="2"
            />
            <text
              x="710"
              y="463"
              textAnchor="middle"
              fill={C.blue}
              fontSize="13"
              fontWeight="800"
            >
              RDS 대기
            </text>
            <text
              x="710"
              y="481"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              Multi-AZ
            </text>
          </g>

          {/* 트래픽 흐름: 프라이빗 EC2 → NAT → IGW */}
          <path
            d="M 180 435 L 180 336"
            stroke={C.purple}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6 4"
          />
          <polygon points="180,340 174,350 186,350" fill={C.purple} />
          <path
            d="M 180 270 C 180 220, 385 190, 400 164"
            stroke={C.purple}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6 4"
          />
          <polygon points="402,161 390,166 398,176" fill={C.purple} />
          <text x="215" y="380" fill={C.purple} fontSize="11" fontWeight="700">
            아웃바운드
          </text>
          <text x="215" y="394" fill={C.purple} fontSize="11" fontWeight="700">
            전용 경로
          </text>
        </svg>
      </div>
      <DetailPanel info={info} sel={sel} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   다이어그램 2 : NACL vs 보안 그룹
   ════════════════════════════════════════════════ */
function SgNaclDiagram() {
  const [sel, setSel] = useState(null);
  const info = {
    nacl: {
      t: "NACL (네트워크 ACL)",
      d: "서브넷 경계에서 동작하는 방화벽입니다. ALLOW(허용)와 DENY(거부) 규칙을 모두 지원하고, 무상태(Stateless)라서 들어온 트래픽의 응답도 다시 규칙 평가를 받습니다. 규칙은 번호 순서대로 평가되며, IP 주소 단위로만 제어합니다.",
    },
    sg: {
      t: "보안 그룹 (Security Group)",
      d: "인스턴스(ENI) 단위에서 동작하는 방화벽입니다. ALLOW 규칙만 지원(DENY 불가)하고, 상태 저장(Stateful)이라 들어온 트래픽의 응답은 규칙과 무관하게 자동 허용됩니다. IP뿐 아니라 '다른 보안 그룹'을 소스로 참조할 수 있습니다.",
    },
    inbound: {
      t: "인바운드 트래픽 경로",
      d: "외부 → 서브넷(NACL 인바운드 규칙 평가) → 인스턴스(SG 인바운드 규칙 평가) 순서로 두 번 검사됩니다.",
    },
    reply: {
      t: "응답(리턴) 트래픽",
      d: "SG는 Stateful → 응답 자동 허용. NACL은 Stateless → 응답 트래픽도 아웃바운드 규칙에서 다시 평가됩니다. 이 차이가 시험 단골 포인트입니다!",
    },
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 860 380"
          className="w-full"
          style={{ minWidth: "620px" }}
        >
          {/* 외부 */}
          <ellipse cx="90" cy="185" rx="62" ry="34" fill={C.navy} />
          <text
            x="90"
            y="182"
            textAnchor="middle"
            fill="#fff"
            fontSize="13"
            fontWeight="700"
          >
            🌐 외부
          </text>
          <text x="90" y="200" textAnchor="middle" fill="#B9C6DD" fontSize="10">
            요청자
          </text>

          {/* 서브넷 = NACL 경계 */}
          <g {...clickable(sel, "nacl", setSel)}>
            <rect
              x="230"
              y="60"
              width="580"
              height="260"
              rx="14"
              fill={C.purpleSoft}
              stroke={C.purple}
              strokeWidth="3"
              strokeDasharray="10 6"
            />
            <rect
              x="250"
              y="44"
              width="240"
              height="30"
              rx="15"
              fill={C.purple}
            />
            <text
              x="370"
              y="64"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              서브넷 경계 = NACL (무상태)
            </text>
          </g>

          {/* 인스턴스 = SG 경계 */}
          <g {...clickable(sel, "sg", setSel)}>
            <rect
              x="430"
              y="110"
              width="330"
              height="170"
              rx="14"
              fill={C.greenSoft}
              stroke={C.green}
              strokeWidth="3"
            />
            <rect
              x="450"
              y="96"
              width="250"
              height="28"
              rx="14"
              fill={C.green}
            />
            <text
              x="575"
              y="115"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              인스턴스 경계 = 보안 그룹 (상태 저장)
            </text>
            <rect
              x="530"
              y="160"
              width="130"
              height="80"
              rx="10"
              fill="#fff"
              stroke={C.green}
              strokeWidth="2"
            />
            <text
              x="595"
              y="196"
              textAnchor="middle"
              fill={C.ink}
              fontSize="14"
              fontWeight="800"
            >
              EC2
            </text>
            <text
              x="595"
              y="216"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              인스턴스
            </text>
          </g>

          {/* 인바운드 화살표 */}
          <g {...clickable(sel, "inbound", setSel)}>
            <line
              x1="155"
              y1="165"
              x2="525"
              y2="165"
              stroke={C.orange}
              strokeWidth="3.5"
            />
            <polygon points="530,165 516,157 516,173" fill={C.orange} />
            <text
              x="300"
              y="152"
              fill={C.orange}
              fontSize="12"
              fontWeight="800"
            >
              ① 인바운드: NACL 평가 → SG 평가
            </text>
          </g>

          {/* 응답 화살표 */}
          <g {...clickable(sel, "reply", setSel)}>
            <line
              x1="525"
              y1="225"
              x2="155"
              y2="225"
              stroke={C.blue}
              strokeWidth="3.5"
              strokeDasharray="8 5"
            />
            <polygon points="150,225 164,217 164,233" fill={C.blue} />
            <text x="240" y="250" fill={C.blue} fontSize="12" fontWeight="800">
              ② 응답: SG는 자동 허용 · NACL은 재평가
            </text>
          </g>
        </svg>
      </div>
      <DetailPanel info={info} sel={sel} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   다이어그램 3 : VPC 피어링 (전이성 없음)
   ════════════════════════════════════════════════ */
function PeeringDiagram() {
  const [sel, setSel] = useState(null);
  const info = {
    ab: {
      t: "피어링 A ↔ B (연결됨)",
      d: "두 VPC를 AWS 프라이빗 네트워크로 직접 연결합니다. 서로 같은 네트워크에 있는 것처럼 통신할 수 있습니다. 단, 양쪽 VPC의 라우팅 테이블을 각각 업데이트해야 실제 통신이 됩니다.",
    },
    bc: {
      t: "피어링 B ↔ C (연결됨)",
      d: "피어링은 서로 다른 계정, 서로 다른 리전 간에도 가능합니다.",
    },
    ac: {
      t: "A ↔ C 통신 불가! (전이성 없음)",
      d: "A-B, B-C가 피어링되어 있어도 A와 C는 통신할 수 없습니다. 피어링은 전이(Transitive)되지 않으므로 A-C 통신이 필요하면 A-C 간 피어링을 '별도로' 맺어야 합니다. ★ 시험 최다 출제 포인트!",
    },
    cidr: {
      t: "CIDR 중복 금지",
      d: "피어링하려는 두 VPC의 CIDR 블록(IP 범위)이 겹치면 피어링을 생성할 수 없습니다.",
    },
  };
  const vpc = (x, y, name, cidr, id) => (
    <g {...clickable(sel, "cidr", setSel)} key={id}>
      <rect
        x={x}
        y={y}
        width="180"
        height="110"
        rx="14"
        fill="#fff"
        stroke={C.orange}
        strokeWidth="2.5"
      />
      <text
        x={x + 90}
        y={y + 42}
        textAnchor="middle"
        fill={C.ink}
        fontSize="16"
        fontWeight="800"
      >
        {name}
      </text>
      <text
        x={x + 90}
        y={y + 68}
        textAnchor="middle"
        fill={C.blue}
        fontSize="12"
        fontFamily="monospace"
        fontWeight="700"
      >
        {cidr}
      </text>
      <text
        x={x + 90}
        y={y + 90}
        textAnchor="middle"
        fill={C.sub}
        fontSize="10"
      >
        CIDR 중복 금지
      </text>
    </g>
  );
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 860 330"
          className="w-full"
          style={{ minWidth: "620px" }}
        >
          {vpc(60, 40, "VPC A", "10.0.0.0/16", "a")}
          {vpc(340, 180, "VPC B", "10.1.0.0/16", "b")}
          {vpc(620, 40, "VPC C", "10.2.0.0/16", "c")}

          {/* A-B */}
          <g {...clickable(sel, "ab", setSel)}>
            <line
              x1="230"
              y1="130"
              x2="355"
              y2="200"
              stroke={C.green}
              strokeWidth="4"
            />
            <rect
              x="230"
              y="150"
              width="96"
              height="26"
              rx="13"
              fill={C.green}
            />
            <text
              x="278"
              y="168"
              textAnchor="middle"
              fill="#fff"
              fontSize="11"
              fontWeight="800"
            >
              피어링 ✓
            </text>
          </g>
          {/* B-C */}
          <g {...clickable(sel, "bc", setSel)}>
            <line
              x1="510"
              y1="200"
              x2="635"
              y2="130"
              stroke={C.green}
              strokeWidth="4"
            />
            <rect
              x="535"
              y="150"
              width="96"
              height="26"
              rx="13"
              fill={C.green}
            />
            <text
              x="583"
              y="168"
              textAnchor="middle"
              fill="#fff"
              fontSize="11"
              fontWeight="800"
            >
              피어링 ✓
            </text>
          </g>
          {/* A-C 불가 */}
          <g {...clickable(sel, "ac", setSel)}>
            <line
              x1="240"
              y1="90"
              x2="620"
              y2="90"
              stroke={C.red}
              strokeWidth="3.5"
              strokeDasharray="10 7"
            />
            <circle
              cx="430"
              cy="90"
              r="24"
              fill={C.redSoft}
              stroke={C.red}
              strokeWidth="2.5"
            />
            <text
              x="430"
              y="98"
              textAnchor="middle"
              fill={C.red}
              fontSize="20"
              fontWeight="900"
            >
              ✕
            </text>
            <text
              x="430"
              y="46"
              textAnchor="middle"
              fill={C.red}
              fontSize="13"
              fontWeight="800"
            >
              A ↔ C 통신 불가 (전이성 없음!)
            </text>
          </g>
        </svg>
      </div>
      <DetailPanel info={info} sel={sel} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   다이어그램 4 : VPC 엔드포인트
   ════════════════════════════════════════════════ */
function EndpointDiagram() {
  const [sel, setSel] = useState(null);
  const info = {
    gw: {
      t: "게이트웨이 엔드포인트 (Gateway Endpoint)",
      d: "라우팅 테이블에 경로를 추가하는 방식으로, 오직 S3와 DynamoDB 두 서비스만 지원합니다. 무료입니다. '엔드포인트 + S3/DynamoDB' 조합이 나오면 게이트웨이 엔드포인트가 정답인 경우가 많습니다. ★ 빈출!",
    },
    itf: {
      t: "인터페이스 엔드포인트 (Interface Endpoint / PrivateLink)",
      d: "서브넷 안에 프라이빗 IP를 가진 ENI(네트워크 인터페이스)를 생성하는 방식입니다. S3/DynamoDB를 포함한 대부분의 AWS 서비스를 지원하며, 시간당 요금 + 데이터 처리 요금이 발생합니다.",
    },
    ec2: {
      t: "프라이빗 서브넷의 EC2",
      d: "인터넷 접근 없이(IGW·NAT 없이) 엔드포인트를 통해 AWS 서비스에 프라이빗하게 접근합니다. 보안 강화 + NAT 비용 절감 효과가 있습니다.",
    },
    no: {
      t: "인터넷 경유 불필요!",
      d: "엔드포인트가 없다면 프라이빗 EC2는 NAT GW → IGW → 퍼블릭 인터넷을 거쳐 S3에 접근해야 합니다. 엔드포인트를 쓰면 트래픽이 AWS 내부 네트워크에만 머뭅니다.",
    },
    svc: {
      t: "AWS 서비스 (S3, DynamoDB, 기타)",
      d: "AWS 서비스들은 기본적으로 퍼블릭 엔드포인트(퍼블릭 URL)로 노출되어 있습니다. VPC 엔드포인트는 이 서비스들에 '프라이빗 네트워크'로 접근하는 통로입니다.",
    },
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 860 420"
          className="w-full"
          style={{ minWidth: "620px" }}
        >
          {/* VPC */}
          <rect
            x="40"
            y="40"
            width="480"
            height="350"
            rx="14"
            fill="#FBFCFE"
            stroke={C.orange}
            strokeWidth="2.5"
          />
          <text x="60" y="68" fill={C.orange} fontSize="14" fontWeight="800">
            VPC
          </text>
          {/* 프라이빗 서브넷 */}
          <rect
            x="70"
            y="90"
            width="420"
            height="270"
            rx="12"
            fill={C.blueSoft}
            stroke={C.blue}
            strokeWidth="2"
          />
          <text x="88" y="115" fill={C.blue} fontSize="12" fontWeight="800">
            프라이빗 서브넷 (IGW·NAT 경로 없음)
          </text>

          <g {...clickable(sel, "ec2", setSel)}>
            <rect
              x="100"
              y="150"
              width="130"
              height="150"
              rx="10"
              fill="#fff"
              stroke={C.blue}
              strokeWidth="2"
            />
            <text
              x="165"
              y="220"
              textAnchor="middle"
              fill={C.ink}
              fontSize="15"
              fontWeight="800"
            >
              EC2
            </text>
            <text
              x="165"
              y="242"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              프라이빗 인스턴스
            </text>
          </g>

          {/* 게이트웨이 엔드포인트 */}
          <g {...clickable(sel, "gw", setSel)}>
            <rect
              x="330"
              y="140"
              width="150"
              height="70"
              rx="10"
              fill={C.green}
            />
            <text
              x="405"
              y="168"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              게이트웨이
            </text>
            <text
              x="405"
              y="186"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              엔드포인트 (무료)
            </text>
            <text
              x="405"
              y="202"
              textAnchor="middle"
              fill="#DCF4E9"
              fontSize="9"
            >
              라우팅 테이블 방식
            </text>
          </g>

          {/* 인터페이스 엔드포인트 */}
          <g {...clickable(sel, "itf", setSel)}>
            <rect
              x="330"
              y="250"
              width="150"
              height="70"
              rx="10"
              fill={C.purple}
            />
            <text
              x="405"
              y="278"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              인터페이스
            </text>
            <text
              x="405"
              y="296"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              엔드포인트 (ENI)
            </text>
            <text
              x="405"
              y="312"
              textAnchor="middle"
              fill="#EDE6FB"
              fontSize="9"
            >
              PrivateLink · 유료
            </text>
          </g>

          {/* 연결선 */}
          <line
            x1="230"
            y1="180"
            x2="330"
            y2="176"
            stroke={C.green}
            strokeWidth="3"
          />
          <line
            x1="230"
            y1="270"
            x2="330"
            y2="284"
            stroke={C.purple}
            strokeWidth="3"
          />

          {/* 서비스들 */}
          <g {...clickable(sel, "svc", setSel)}>
            <rect
              x="620"
              y="110"
              width="200"
              height="90"
              rx="12"
              fill="#fff"
              stroke={C.green}
              strokeWidth="2.5"
            />
            <text
              x="720"
              y="148"
              textAnchor="middle"
              fill={C.ink}
              fontSize="14"
              fontWeight="800"
            >
              S3 · DynamoDB
            </text>
            <text
              x="720"
              y="172"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              게이트웨이 엔드포인트는
            </text>
            <text
              x="720"
              y="186"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              이 두 서비스만 지원!
            </text>
          </g>
          <g {...clickable(sel, "svc", setSel)}>
            <rect
              x="620"
              y="240"
              width="200"
              height="90"
              rx="12"
              fill="#fff"
              stroke={C.purple}
              strokeWidth="2.5"
            />
            <text
              x="720"
              y="278"
              textAnchor="middle"
              fill={C.ink}
              fontSize="13"
              fontWeight="800"
            >
              대부분의 AWS 서비스
            </text>
            <text
              x="720"
              y="300"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              CloudWatch, SQS, SNS,
            </text>
            <text
              x="720"
              y="314"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              Kinesis, ECR 등
            </text>
          </g>

          <line
            x1="480"
            y1="172"
            x2="620"
            y2="158"
            stroke={C.green}
            strokeWidth="3"
          />
          <polygon points="624,157 610,152 612,166" fill={C.green} />
          <line
            x1="480"
            y1="288"
            x2="620"
            y2="284"
            stroke={C.purple}
            strokeWidth="3"
          />
          <polygon points="624,284 610,278 610,292" fill={C.purple} />

          {/* 인터넷 미경유 표시 */}
          <g {...clickable(sel, "no", setSel)}>
            <rect
              x="560"
              y="30"
              width="260"
              height="46"
              rx="23"
              fill={C.redSoft}
              stroke={C.red}
              strokeWidth="2"
            />
            <text
              x="690"
              y="50"
              textAnchor="middle"
              fill={C.red}
              fontSize="12"
              fontWeight="800"
            >
              🚫 인터넷(IGW·NAT) 경유 없음
            </text>
            <text x="690" y="66" textAnchor="middle" fill={C.red} fontSize="10">
              AWS 프라이빗 네트워크만 사용
            </text>
          </g>
        </svg>
      </div>
      <DetailPanel info={info} sel={sel} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   다이어그램 5 : Site-to-Site VPN & Direct Connect
   ════════════════════════════════════════════════ */
function HybridDiagram() {
  const [sel, setSel] = useState(null);
  const info = {
    cgw: {
      t: "CGW — 고객 게이트웨이 (Customer Gateway)",
      d: "온프레미스(회사 데이터센터) 쪽에 설치·설정하는 장비/소프트웨어입니다. Site-to-Site VPN의 온프레미스 측 종단점입니다.",
    },
    vgw: {
      t: "VGW — 가상 프라이빗 게이트웨이 (Virtual Private Gateway)",
      d: "AWS VPC 쪽에 연결하는 VPN 종단점입니다. CGW(온프레미스) + VGW(AWS)가 모두 있어야 Site-to-Site VPN이 성립합니다.",
    },
    vpn: {
      t: "Site-to-Site VPN",
      d: "퍼블릭 인터넷 위로 '암호화된 터널'을 만들어 온프레미스와 VPC를 연결합니다. 몇 분~몇 시간 내 빠르게 구축 가능하고 저렴하지만, 인터넷을 경유하므로 대역폭·지연이 상대적으로 불안정합니다.",
    },
    dx: {
      t: "Direct Connect (DX)",
      d: "온프레미스와 AWS 사이에 '물리 전용선'을 설치하는 방식입니다. 인터넷을 전혀 거치지 않아 빠르고 안정적이며 보안성이 높지만, 구축에 최소 1개월 이상 소요되고 비쌉니다. '완전히 프라이빗한 연결'이 필요하면 DX가 정답입니다.",
    },
    onprem: {
      t: "온프레미스 데이터센터",
      d: "회사가 자체 보유한 서버·네트워크 환경입니다. 하이브리드 클라우드에서는 온프레미스와 AWS VPC를 VPN 또는 DX로 연결합니다.",
    },
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 860 380"
          className="w-full"
          style={{ minWidth: "620px" }}
        >
          {/* 온프레미스 */}
          <g {...clickable(sel, "onprem", setSel)}>
            <rect
              x="40"
              y="90"
              width="200"
              height="200"
              rx="14"
              fill="#fff"
              stroke={C.navy}
              strokeWidth="2.5"
            />
            <text
              x="140"
              y="130"
              textAnchor="middle"
              fill={C.ink}
              fontSize="14"
              fontWeight="800"
            >
              🏢 온프레미스 DC
            </text>
            <text
              x="140"
              y="152"
              textAnchor="middle"
              fill={C.sub}
              fontSize="10"
            >
              회사 데이터센터
            </text>
          </g>
          <g {...clickable(sel, "cgw", setSel)}>
            <rect
              x="70"
              y="190"
              width="140"
              height="60"
              rx="10"
              fill={C.navy}
            />
            <text
              x="140"
              y="216"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              CGW
            </text>
            <text
              x="140"
              y="234"
              textAnchor="middle"
              fill="#B9C6DD"
              fontSize="9"
            >
              고객 게이트웨이
            </text>
          </g>

          {/* VPC */}
          <rect
            x="620"
            y="90"
            width="200"
            height="200"
            rx="14"
            fill="#FBFCFE"
            stroke={C.orange}
            strokeWidth="2.5"
          />
          <text
            x="720"
            y="130"
            textAnchor="middle"
            fill={C.orange}
            fontSize="14"
            fontWeight="800"
          >
            AWS VPC
          </text>
          <g {...clickable(sel, "vgw", setSel)}>
            <rect
              x="650"
              y="190"
              width="140"
              height="60"
              rx="10"
              fill={C.orange}
            />
            <text
              x="720"
              y="216"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="800"
            >
              VGW
            </text>
            <text
              x="720"
              y="234"
              textAnchor="middle"
              fill="#FFE9CF"
              fontSize="9"
            >
              가상 프라이빗 게이트웨이
            </text>
          </g>

          {/* VPN 경로 */}
          <g {...clickable(sel, "vpn", setSel)}>
            <path
              d="M 210 205 C 340 130, 520 130, 650 205"
              stroke={C.green}
              strokeWidth="4"
              fill="none"
              strokeDasharray="10 6"
            />
            <rect
              x="320"
              y="98"
              width="230"
              height="48"
              rx="24"
              fill={C.greenSoft}
              stroke={C.green}
              strokeWidth="2"
            />
            <text
              x="435"
              y="118"
              textAnchor="middle"
              fill={C.green}
              fontSize="12"
              fontWeight="800"
            >
              Site-to-Site VPN 🔒
            </text>
            <text
              x="435"
              y="136"
              textAnchor="middle"
              fill={C.green}
              fontSize="10"
            >
              퍼블릭 인터넷 + 암호화 터널 · 빠른 구축
            </text>
          </g>

          {/* DX 경로 */}
          <g {...clickable(sel, "dx", setSel)}>
            <path
              d="M 210 240 C 340 320, 520 320, 650 240"
              stroke={C.purple}
              strokeWidth="5"
              fill="none"
            />
            <rect
              x="320"
              y="300"
              width="230"
              height="48"
              rx="24"
              fill={C.purpleSoft}
              stroke={C.purple}
              strokeWidth="2"
            />
            <text
              x="435"
              y="320"
              textAnchor="middle"
              fill={C.purple}
              fontSize="12"
              fontWeight="800"
            >
              Direct Connect (DX) ⚡
            </text>
            <text
              x="435"
              y="338"
              textAnchor="middle"
              fill={C.purple}
              fontSize="10"
            >
              물리 전용선 · 인터넷 미경유 · 구축 1개월+
            </text>
          </g>
        </svg>
      </div>
      <DetailPanel info={info} sel={sel} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   다이어그램 6 : 3계층 아키텍처
   ════════════════════════════════════════════════ */
function ThreeTierDiagram() {
  const [sel, setSel] = useState(null);
  const info = {
    r53: {
      t: "Route 53 (DNS)",
      d: "사용자가 도메인 이름으로 접속하면 Route 53이 ELB의 주소를 알려줍니다. 아키텍처의 진입점 역할입니다.",
    },
    elb: {
      t: "1계층: ELB (퍼블릭 서브넷)",
      d: "사용자 트래픽을 받아 여러 EC2 인스턴스로 분산합니다. 외부에 노출되는 유일한 계층이므로 퍼블릭 서브넷에 배치합니다.",
    },
    app: {
      t: "2계층: EC2 + Auto Scaling (프라이빗 서브넷)",
      d: "실제 애플리케이션 로직이 실행되는 계층입니다. 외부에 직접 노출할 필요가 없으므로 프라이빗 서브넷에 배치하고, ASG(오토 스케일링 그룹)로 여러 AZ에 걸쳐 확장성을 확보합니다.",
    },
    data: {
      t: "3계층: 데이터 계층 (프라이빗 서브넷)",
      d: "RDS(데이터 저장·읽기)와 ElastiCache(세션 데이터·캐시)를 배치합니다. 가장 민감한 계층이므로 반드시 프라이빗 서브넷에 두고 앱 계층에서만 접근하도록 SG를 설정합니다.",
    },
    user: {
      t: "사용자",
      d: "웹 브라우저나 모바일 앱을 통해 서비스에 접근하는 최종 사용자입니다.",
    },
  };
  const tier = (y, h, fill, stroke) => (
    <rect
      x="150"
      y={y}
      width="640"
      height={h}
      rx="12"
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
    />
  );
  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 860 560"
          className="w-full"
          style={{ minWidth: "620px" }}
        >
          {/* 사용자 & Route53 */}
          <g {...clickable(sel, "user", setSel)}>
            <circle cx="90" cy="70" r="34" fill={C.navy} />
            <text
              x="90"
              y="76"
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              fontWeight="800"
            >
              👤
            </text>
            <text
              x="90"
              y="122"
              textAnchor="middle"
              fill={C.ink}
              fontSize="12"
              fontWeight="700"
            >
              사용자
            </text>
          </g>
          <g {...clickable(sel, "r53", setSel)}>
            <rect
              x="330"
              y="40"
              width="180"
              height="60"
              rx="12"
              fill={C.purple}
            />
            <text
              x="420"
              y="66"
              textAnchor="middle"
              fill="#fff"
              fontSize="13"
              fontWeight="800"
            >
              Route 53
            </text>
            <text
              x="420"
              y="86"
              textAnchor="middle"
              fill="#EDE6FB"
              fontSize="10"
            >
              DNS 질의
            </text>
          </g>
          <line
            x1="128"
            y1="62"
            x2="330"
            y2="66"
            stroke={C.purple}
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <line
            x1="100"
            y1="102"
            x2="240"
            y2="160"
            stroke={C.ink}
            strokeWidth="3"
          />
          <polygon points="244,162 230,160 236,150" fill={C.ink} />

          {/* 1계층 ELB */}
          <g {...clickable(sel, "elb", setSel)}>
            {tier(140, 100, C.greenSoft, C.green)}
            <text x="170" y="168" fill={C.green} fontSize="12" fontWeight="800">
              1계층 · 퍼블릭 서브넷
            </text>
            <rect
              x="380"
              y="158"
              width="180"
              height="60"
              rx="10"
              fill={C.green}
            />
            <text
              x="470"
              y="184"
              textAnchor="middle"
              fill="#fff"
              fontSize="13"
              fontWeight="800"
            >
              ELB
            </text>
            <text
              x="470"
              y="204"
              textAnchor="middle"
              fill="#DCF4E9"
              fontSize="10"
            >
              로드 밸런서 (다중 AZ)
            </text>
          </g>

          {/* 2계층 앱 */}
          <g {...clickable(sel, "app", setSel)}>
            {tier(280, 120, C.blueSoft, C.blue)}
            <text x="170" y="308" fill={C.blue} fontSize="12" fontWeight="800">
              2계층 · 프라이빗 서브넷 (앱)
            </text>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect
                  x={300 + i * 130}
                  y={320}
                  width="110"
                  height="60"
                  rx="10"
                  fill="#fff"
                  stroke={C.blue}
                  strokeWidth="2"
                />
                <text
                  x={355 + i * 130}
                  y={346}
                  textAnchor="middle"
                  fill={C.blue}
                  fontSize="12"
                  fontWeight="800"
                >
                  EC2
                </text>
                <text
                  x={355 + i * 130}
                  y={364}
                  textAnchor="middle"
                  fill={C.sub}
                  fontSize="9"
                >
                  AZ-{["a", "b", "c"][i]}
                </text>
              </g>
            ))}
            <rect
              x="620"
              y="288"
              width="150"
              height="26"
              rx="13"
              fill={C.blue}
            />
            <text
              x="695"
              y="306"
              textAnchor="middle"
              fill="#fff"
              fontSize="10"
              fontWeight="800"
            >
              Auto Scaling 그룹
            </text>
          </g>

          {/* 3계층 데이터 */}
          <g {...clickable(sel, "data", setSel)}>
            {tier(440, 110, C.orangeSoft, C.orange)}
            <text
              x="170"
              y="468"
              fill={C.orange}
              fontSize="12"
              fontWeight="800"
            >
              3계층 · 프라이빗 서브넷 (데이터)
            </text>
            <rect
              x="310"
              y="480"
              width="180"
              height="56"
              rx="10"
              fill="#fff"
              stroke={C.orange}
              strokeWidth="2"
            />
            <text
              x="400"
              y="504"
              textAnchor="middle"
              fill={C.orange}
              fontSize="12"
              fontWeight="800"
            >
              RDS
            </text>
            <text x="400" y="522" textAnchor="middle" fill={C.sub} fontSize="9">
              데이터 저장 / 읽기
            </text>
            <rect
              x="530"
              y="480"
              width="180"
              height="56"
              rx="10"
              fill="#fff"
              stroke={C.orange}
              strokeWidth="2"
            />
            <text
              x="620"
              y="504"
              textAnchor="middle"
              fill={C.orange}
              fontSize="12"
              fontWeight="800"
            >
              ElastiCache
            </text>
            <text x="620" y="522" textAnchor="middle" fill={C.sub} fontSize="9">
              세션 · 캐시 데이터
            </text>
          </g>

          {/* 흐름 화살표 */}
          <line
            x1="470"
            y1="218"
            x2="470"
            y2="280"
            stroke={C.ink}
            strokeWidth="3"
          />
          <polygon points="470,284 464,272 476,272" fill={C.ink} />
          <line
            x1="470"
            y1="400"
            x2="470"
            y2="440"
            stroke={C.ink}
            strokeWidth="3"
          />
          <polygon points="470,444 464,432 476,432" fill={C.ink} />
        </svg>
      </div>
      <DetailPanel info={info} sel={sel} />
    </div>
  );
}

/* ── 비교 테이블 ── */
function Table({ head, rows, colColors }) {
  return (
    <div
      className="overflow-x-auto rounded-xl"
      style={{ border: `1px solid ${C.line}` }}
    >
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-bold"
                style={{
                  background: colColors?.[i] || C.navy,
                  color: "#fff",
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
            <tr key={ri} style={{ background: ri % 2 ? "#F7F9FC" : "#fff" }}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3 leading-6 align-top"
                  style={{
                    color: C.ink,
                    borderTop: `1px solid ${C.line}`,
                    fontWeight: ci === 0 ? 700 : 400,
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

/* ════════════════ 섹션 콘텐츠 ════════════════ */

function SectionIntro() {
  return (
    <>
      <Card title="VPC 섹션에서 알아야 할 것" accent={C.orange}>
        <P>
          VPC(Virtual Private Cloud)는 AWS 네트워킹의 <Hi>핵심 기반</Hi>입니다.
          이 섹션에서는 네트워킹 전문가 수준이 아니라,{" "}
          <Hi>자격증 시험과 실무에 필요한 개념 수준</Hi>에서 다음을 다룹니다.
        </P>
        <ul
          className="text-sm leading-7 mb-3 pl-5"
          style={{ color: C.ink, listStyle: "disc" }}
        >
          <li>VPC · 서브넷 · 인터넷 게이트웨이(IGW) · NAT 게이트웨이</li>
          <li>보안 그룹(SG) · 네트워크 ACL(NACL) · VPC Flow Logs</li>
          <li>VPC 피어링 · VPC 엔드포인트</li>
          <li>Site-to-Site VPN · Direct Connect(DX)</li>
          <li>3계층(3-Tier) 솔루션 아키텍처</li>
        </ul>
        <P>
          <Hi color={C.blue}>💡 참고:</Hi> Developer/Practitioner 계열
          시험에서는 VPC가 1~3문제 수준으로 "개념 이해" 중심으로 출제되지만,{" "}
          <Hi>Solutions Architect(SAA)</Hi> 시험에서는 네트워킹 비중이 훨씬 높아
          이 개념들이 반복적으로 등장합니다. 어느 시험이든 이 섹션의 내용은
          반드시 알아야 하는 기초입니다.
        </P>
      </Card>

      <Card title="주제별 시험 빈출도 한눈에 보기" accent={C.red}>
        <Table
          head={["주제", "빈출도", "시험 포인트"]}
          rows={[
            [
              "보안 그룹 vs NACL",
              <FreqBadge key="1" level={3} />,
              "Stateful vs Stateless, ALLOW만 vs ALLOW+DENY 차이가 단골 출제",
            ],
            [
              "VPC 엔드포인트",
              <FreqBadge key="2" level={3} />,
              "게이트웨이(S3·DynamoDB 전용) vs 인터페이스 구분 문제 빈출",
            ],
            [
              "퍼블릭/프라이빗 서브넷 + NAT",
              <FreqBadge key="3" level={3} />,
              "프라이빗 인스턴스의 아웃바운드 인터넷 접근 = NAT GW",
            ],
            [
              "VPC 피어링",
              <FreqBadge key="4" level={2} />,
              "전이성 없음(A-B, B-C 연결돼도 A-C 통신 불가) + CIDR 중복 금지",
            ],
            [
              "VPN vs Direct Connect",
              <FreqBadge key="5" level={2} />,
              "빠른 구축·암호화 = VPN / 전용선·인터넷 미경유·1개월+ = DX",
            ],
            [
              "VPC Flow Logs",
              <FreqBadge key="6" level={2} />,
              "네트워크 트래픽 로깅·문제 해결 시나리오에서 등장",
            ],
            [
              "3계층 아키텍처",
              <FreqBadge key="7" level={1} />,
              "직접 출제보다는 여러 문제의 배경 시나리오로 활용됨",
            ],
          ]}
        />
      </Card>
    </>
  );
}

function SectionVpc() {
  return (
    <>
      <Card
        title="VPC · 서브넷 · IGW · NAT 전체 구조"
        freq={3}
        accent={C.orange}
      >
        <P>
          아래는 이 강의 전체를 관통하는 <Hi>가장 중요한 그림</Hi>입니다. 각
          구성 요소를 클릭해 보세요.
        </P>
        <VpcMasterDiagram />
      </Card>

      <Card title="VPC — Virtual Private Cloud" freq={2}>
        <ul
          className="text-sm leading-8 pl-5"
          style={{ color: C.ink, listStyle: "disc" }}
        >
          <li>
            AWS 클라우드 안의 <Hi>논리적으로 격리된 프라이빗 네트워크</Hi>
          </li>
          <li>
            <Hi color={C.blue}>리전(Region) 단위</Hi> 리소스 — 리전마다 별도로
            생성 (기본 소프트 리밋: 리전당 5개)
          </li>
          <li>
            모든 신규 AWS 계정에는 <Hi>기본 VPC(Default VPC)</Hi>가 자동
            생성되어 있음
          </li>
          <li>
            IP 범위는 <Code>CIDR</Code> 블록으로 정의 — 예:{" "}
            <Code>10.0.0.0/16</Code> (약 65,536개 IP)
          </li>
        </ul>
      </Card>

      <Card title="서브넷 (Subnet)" freq={3}>
        <ul
          className="text-sm leading-8 pl-5 mb-4"
          style={{ color: C.ink, listStyle: "disc" }}
        >
          <li>
            VPC의 IP 범위를 더 작게 나눈 <Hi>네트워크 파티션</Hi>
          </li>
          <li>
            서브넷은 <Hi color={C.blue}>하나의 가용 영역(AZ)에만</Hi> 속함
            (VPC=리전, 서브넷=AZ — 시험 포인트!)
          </li>
        </ul>
        <Table
          head={["구분", "퍼블릭 서브넷 🟢", "프라이빗 서브넷 🔵"]}
          colColors={[C.navy, C.green, C.blue]}
          rows={[
            ["인터넷 접근", "직접 접근 가능 (양방향)", "직접 접근 불가"],
            ["조건", "라우팅 테이블에 IGW 경로 존재", "IGW 경로 없음"],
            [
              "배치 리소스",
              "ELB, NAT GW, Bastion Host",
              "앱 서버(EC2), DB(RDS), 캐시",
            ],
            ["아웃바운드 인터넷", "IGW로 직접", "NAT GW 경유로만 가능"],
          ]}
        />
        <p className="text-sm mt-4 leading-7" style={{ color: C.ink }}>
          <Hi color={C.purple}>라우팅 테이블(Route Table)</Hi>이 서브넷의 성격을
          결정합니다. "네트워크 트래픽을 어디로 보낼지" 정의하며,{" "}
          <Code>0.0.0.0/0 → IGW</Code> 규칙이 있으면 퍼블릭 서브넷이 됩니다.
        </p>
      </Card>

      <Card title="IGW — 인터넷 게이트웨이" freq={3}>
        <ul
          className="text-sm leading-8 pl-5"
          style={{ color: C.ink, listStyle: "disc" }}
        >
          <li>
            VPC가 <Hi>인터넷과 통신</Hi>하도록 해 주는 관문
          </li>
          <li>
            <Hi color={C.blue}>VPC당 1개</Hi>만 연결 가능, 자체적으로 수평 확장
            + 고가용성 제공
          </li>
          <li>
            IGW를 만들기만 하면 끝이 아니라, 라우팅 테이블에 경로를 추가해야
            실제로 동작
          </li>
        </ul>
      </Card>

      <Card title="NAT 게이트웨이 vs NAT 인스턴스" freq={3}>
        <P>
          <Hi>목적:</Hi> 프라이빗 서브넷의 인스턴스가{" "}
          <Hi color={C.green}>아웃바운드로만</Hi> 인터넷에 접근(예: 패키지
          업데이트)하게 하되, 인터넷에서 들어오는 접근은 차단하는 것. 트래픽
          경로: <Code>프라이빗 EC2 → NAT GW(퍼블릭 서브넷) → IGW → 인터넷</Code>
        </P>
        <Table
          head={["구분", "NAT 게이트웨이 (권장)", "NAT 인스턴스 (구식)"]}
          colColors={[C.navy, C.green, C.sub]}
          rows={[
            ["관리 주체", "AWS 완전관리형", "사용자가 직접 EC2로 운영"],
            [
              "가용성/대역폭",
              "AZ 내 고가용성, 자동 확장",
              "직접 관리 필요, 제한적",
            ],
            ["배치 위치", "퍼블릭 서브넷", "퍼블릭 서브넷"],
            [
              "시험 답",
              "대부분의 시나리오에서 정답",
              "레거시 — 거의 출제 안 됨",
            ],
          ]}
        />
        <p className="text-sm mt-4 leading-7" style={{ color: C.ink }}>
          <Hi color={C.red}>⚠ 암기:</Hi> NAT 게이트웨이는 반드시{" "}
          <Hi>퍼블릭 서브넷</Hi>에 배치하고, 고가용성이 필요하면{" "}
          <Hi>AZ마다 하나씩</Hi> 배포합니다 (NAT GW는 단일 AZ 리소스).
        </p>
      </Card>
    </>
  );
}

function SectionSecurity() {
  return (
    <>
      <Card
        title="NACL vs 보안 그룹 — 2중 방화벽 구조"
        freq={3}
        accent={C.purple}
      >
        <P>
          외부 트래픽은 <Hi color={C.purple}>서브넷 경계의 NACL</Hi>을 먼저
          통과한 뒤, <Hi color={C.green}>인스턴스 경계의 보안 그룹</Hi>을
          통과합니다. 다이어그램의 요소를 클릭해 보세요.
        </P>
        <SgNaclDiagram />
      </Card>

      <Card title="비교표 — 시험 최다 출제 구간" freq={3}>
        <Table
          head={["구분", "NACL (네트워크 ACL)", "보안 그룹 (SG)"]}
          colColors={[C.navy, C.purple, C.green]}
          rows={[
            ["적용 레벨", "서브넷 단위", "인스턴스(ENI) 단위"],
            [
              "규칙 유형",
              "ALLOW + DENY 모두 가능",
              "ALLOW만 가능 (명시 안 되면 암묵적 거부)",
            ],
            [
              "상태",
              "무상태 (Stateless) — 응답 트래픽도 규칙 재평가",
              "상태 저장 (Stateful) — 응답 트래픽 자동 허용",
            ],
            [
              "규칙 평가",
              "번호 순서대로 평가 (낮은 번호 우선)",
              "모든 규칙을 종합 평가",
            ],
            ["참조 대상", "IP 주소만", "IP 주소 + 다른 보안 그룹 참조 가능"],
            [
              "기본값",
              "기본 NACL은 모두 허용",
              "인바운드 모두 거부 / 아웃바운드 모두 허용",
            ],
          ]}
        />
        <div
          className="rounded-xl px-4 py-3 mt-4 text-sm leading-7"
          style={{
            background: C.redSoft,
            border: `1px solid ${C.red}`,
            color: C.ink,
          }}
        >
          <Hi color={C.red}>🎯 시험 단서 찾기:</Hi> "특정 IP를 <b>차단(DENY)</b>
          해야 한다" → <b>NACL</b> (SG는 DENY 불가!) / "응답 트래픽이 자동으로
          허용된다" → <b>보안 그룹</b>
        </div>
      </Card>

      <Card title="VPC Flow Logs" freq={2} accent={C.blue}>
        <ul
          className="text-sm leading-8 pl-5"
          style={{ color: C.ink, listStyle: "disc" }}
        >
          <li>
            VPC로 드나드는 <Hi>모든 IP 트래픽 정보를 캡처</Hi>하는 기능
          </li>
          <li>
            3가지 레벨에서 활성화 가능: <Hi color={C.blue}>VPC 레벨</Hi> ·{" "}
            <Hi color={C.blue}>서브넷 레벨</Hi> ·{" "}
            <Hi color={C.blue}>ENI(네트워크 인터페이스) 레벨</Hi>
          </li>
          <li>
            용도: <Hi>연결 문제 모니터링·트러블슈팅</Hi> (예: 서브넷→인터넷,
            서브넷→서브넷, 인터넷→서브넷 통신 이슈)
          </li>
          <li>
            ELB, RDS, ElastiCache, Redshift 등{" "}
            <Hi>AWS 관리형 서비스의 네트워크 정보도 캡처</Hi>됨
          </li>
          <li>
            로그 저장 위치: <Code>S3</Code>, <Code>CloudWatch Logs</Code>,{" "}
            <Code>Kinesis Data Firehose</Code>
          </li>
        </ul>
      </Card>
    </>
  );
}

function SectionConnect() {
  return (
    <>
      <Card title="VPC 피어링 (Peering)" freq={2} accent={C.green}>
        <P>
          두 VPC를 AWS 프라이빗 네트워크로 연결해{" "}
          <Hi>마치 같은 네트워크처럼</Hi> 통신하게 합니다. 아래 다이어그램에서{" "}
          <Hi color={C.red}>빨간 ✕</Hi>를 꼭 클릭해 보세요 — 시험 최다 출제
          포인트입니다.
        </P>
        <PeeringDiagram />
        <ul
          className="text-sm leading-8 pl-5 mt-4"
          style={{ color: C.ink, listStyle: "disc" }}
        >
          <li>
            <Hi color={C.red}>전이성 없음(Not Transitive)</Hi>: A-B, B-C가
            연결돼도 A-C는 통신 불가 → 통신이 필요한 <Hi>모든 VPC 쌍마다</Hi>{" "}
            피어링 필요
          </li>
          <li>
            두 VPC의 <Hi>CIDR이 겹치면 안 됨</Hi>
          </li>
          <li>피어링 후 각 VPC의 라우팅 테이블 업데이트 필수</li>
          <li>서로 다른 AWS 계정 간, 서로 다른 리전 간에도 피어링 가능</li>
        </ul>
      </Card>

      <Card title="VPC 엔드포인트 (Endpoints)" freq={3} accent={C.green}>
        <P>
          AWS 서비스(S3, DynamoDB 등)는 기본적으로 퍼블릭 URL로 노출됩니다. VPC
          엔드포인트를 쓰면{" "}
          <Hi>인터넷(IGW·NAT)을 거치지 않고 프라이빗 네트워크로</Hi> AWS
          서비스에 접근할 수 있습니다. → 보안 향상 + 지연 감소 + NAT 비용 절감.
        </P>
        <EndpointDiagram />
        <div className="mt-4">
          <Table
            head={[
              "구분",
              "게이트웨이 엔드포인트",
              "인터페이스 엔드포인트 (PrivateLink)",
            ]}
            colColors={[C.navy, C.green, C.purple]}
            rows={[
              ["지원 서비스", "S3, DynamoDB 단 2개!", "대부분의 AWS 서비스"],
              [
                "구현 방식",
                "라우팅 테이블에 경로 추가",
                "서브넷에 ENI(프라이빗 IP) 생성",
              ],
              ["비용", "무료", "시간당 + 데이터 처리 요금"],
              [
                "시험 단서",
                "'S3/DynamoDB + 프라이빗 접근' → 이것",
                "'그 외 서비스 프라이빗 접근' → 이것",
              ],
            ]}
          />
        </div>
      </Card>

      <Card
        title="Site-to-Site VPN & Direct Connect (DX)"
        freq={2}
        accent={C.purple}
      >
        <P>
          온프레미스 데이터센터와 AWS VPC를 연결하는{" "}
          <Hi>하이브리드 네트워킹</Hi>의 두 가지 방식입니다.
        </P>
        <HybridDiagram />
        <div className="mt-4">
          <Table
            head={["구분", "Site-to-Site VPN", "Direct Connect (DX)"]}
            colColors={[C.navy, C.green, C.purple]}
            rows={[
              [
                "연결 매체",
                "퍼블릭 인터넷 (암호화 터널)",
                "물리 전용선 (프라이빗)",
              ],
              ["구축 시간", "몇 분~몇 시간 (빠름)", "최소 1개월 이상"],
              ["비용", "저렴", "비쌈"],
              ["성능", "인터넷 품질에 의존", "빠르고 안정적, 일관된 대역폭"],
              [
                "구성 요소",
                "CGW(온프레미스) + VGW(AWS) 모두 필요",
                "DX 로케이션 경유 전용 연결",
              ],
              [
                "시험 단서",
                "'빠르게', '암호화된 인터넷 연결'",
                "'인터넷 미경유', '전용', '대용량·안정'",
              ],
            ]}
          />
        </div>
        <p className="text-sm mt-4 leading-7" style={{ color: C.ink }}>
          <Hi color={C.red}>⚠ 주의:</Hi> Site-to-Site VPN이나 DX로 연결해도{" "}
          <Hi>VPC 엔드포인트에는 접근할 수 없습니다</Hi>. 엔드포인트는 VPC 내부
          리소스 전용입니다 (시험에 종종 함정으로 등장).
        </p>
      </Card>
    </>
  );
}

function SectionThreeTier() {
  return (
    <>
      <Card title="3계층(3-Tier) 솔루션 아키텍처" freq={1} accent={C.blue}>
        <P>
          지금까지 배운 VPC 개념을 총동원한 <Hi>대표 아키텍처 패턴</Hi>입니다.
          사용자 요청이 위에서 아래로 흐릅니다. 각 계층을 클릭해 보세요.
        </P>
        <ThreeTierDiagram />
      </Card>
      <Card title="계층별 요약">
        <Table
          head={["계층", "구성 요소", "서브넷", "역할"]}
          rows={[
            ["진입", "Route 53", "—", "도메인 이름을 ELB 주소로 변환 (DNS)"],
            [
              "1계층",
              "ELB (로드 밸런서)",
              "퍼블릭",
              "사용자 트래픽을 받아 다중 AZ의 EC2로 분산",
            ],
            [
              "2계층",
              "EC2 + Auto Scaling 그룹",
              "프라이빗",
              "애플리케이션 로직 실행, AZ 간 확장/축소",
            ],
            [
              "3계층",
              "RDS + ElastiCache",
              "프라이빗",
              "RDS = 데이터 저장·읽기 / ElastiCache = 세션·캐시",
            ],
          ]}
        />
        <p className="text-sm mt-4 leading-7" style={{ color: C.ink }}>
          <Hi color={C.blue}>💡 핵심:</Hi> 외부에 노출되는 것은{" "}
          <Hi color={C.green}>ELB뿐</Hi>이고, 앱과 데이터는 모두{" "}
          <Hi>프라이빗 서브넷</Hi>에 숨깁니다. 보안 그룹 체인은{" "}
          <Code>ELB SG → EC2 SG(소스=ELB SG) → RDS SG(소스=EC2 SG)</Code> 형태로
          구성하는 것이 모범 사례입니다.
        </p>
      </Card>
    </>
  );
}

function SectionCheat() {
  const items = [
    [
      "VPC",
      "리전 단위의 프라이빗 네트워크. CIDR로 IP 범위 정의. 리전당 기본 5개.",
    ],
    [
      "서브넷",
      "VPC를 나눈 파티션. AZ 단위. 퍼블릭(IGW 경로 O) / 프라이빗(IGW 경로 X).",
    ],
    [
      "라우팅 테이블",
      "트래픽 경로 정의. 0.0.0.0/0 → IGW 규칙이 서브넷을 퍼블릭으로 만듦.",
    ],
    ["인터넷 게이트웨이 (IGW)", "VPC의 인터넷 관문. VPC당 1개. 자체 고가용성."],
    [
      "NAT 게이트웨이",
      "프라이빗 서브넷의 아웃바운드 전용 인터넷 접근. AWS 관리형. 퍼블릭 서브넷에 배치.",
    ],
    ["NAT 인스턴스", "NAT GW의 셀프 관리 버전(EC2). 레거시."],
    [
      "NACL",
      "서브넷 방화벽. 무상태(Stateless). ALLOW + DENY. IP만 참조. 규칙 번호순 평가.",
    ],
    [
      "보안 그룹 (SG)",
      "인스턴스(ENI) 방화벽. 상태 저장(Stateful). ALLOW만. IP + 다른 SG 참조 가능.",
    ],
    [
      "VPC Flow Logs",
      "VPC/서브넷/ENI 레벨의 IP 트래픽 로그. S3·CloudWatch Logs·Firehose로 전송. 트러블슈팅용.",
    ],
    [
      "VPC 피어링",
      "VPC 간 프라이빗 연결. CIDR 중복 금지. 전이성 없음(모든 쌍마다 필요).",
    ],
    [
      "VPC 엔드포인트",
      "AWS 서비스에 프라이빗 접근. 게이트웨이형(S3·DynamoDB, 무료) / 인터페이스형(대부분 서비스, ENI, 유료).",
    ],
    [
      "PrivateLink",
      "인터페이스 엔드포인트의 기반 기술. 서비스를 수천 개 VPC에 프라이빗하게 노출.",
    ],
    [
      "Site-to-Site VPN",
      "온프레미스 ↔ AWS를 인터넷 위 암호화 터널로 연결. CGW + VGW 필요. 빠른 구축.",
    ],
    [
      "Direct Connect (DX)",
      "온프레미스 ↔ AWS 물리 전용선. 인터넷 미경유. 구축 1개월+. 빠르고 안정적.",
    ],
    ["CGW / VGW", "VPN의 양쪽 종단점. CGW = 온프레미스 측, VGW = AWS(VPC) 측."],
    [
      "3계층 아키텍처",
      "ELB(퍼블릭) → EC2 ASG(프라이빗) → RDS·ElastiCache(프라이빗).",
    ],
  ];
  return (
    <>
      <Card title="VPC 치트 시트 — 시험 직전 총정리" accent={C.red}>
        <div className="grid gap-3">
          {items.map(([k, v], i) => (
            <div
              key={i}
              className="rounded-xl px-4 py-3 flex flex-col gap-1 sm:flex-row sm:gap-4"
              style={{
                background: i % 2 ? "#F7F9FC" : "#fff",
                border: `1px solid ${C.line}`,
              }}
            >
              <div
                className="font-bold text-sm shrink-0"
                style={{ color: C.orange, minWidth: "190px" }}
              >
                {k}
              </div>
              <div className="text-sm leading-6" style={{ color: C.ink }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="🎯 시험 단서 → 정답 빠른 매칭" accent={C.orange}>
        <Table
          head={["문제 속 단서", "정답 방향"]}
          rows={[
            ["특정 IP를 명시적으로 차단(DENY)", "NACL (SG는 불가)"],
            ["응답 트래픽 자동 허용 / Stateful", "보안 그룹"],
            [
              "프라이빗 인스턴스가 인터넷으로 나가야 함",
              "NAT 게이트웨이 (퍼블릭 서브넷에)",
            ],
            ["S3·DynamoDB에 인터넷 없이 접근 + 무료", "게이트웨이 엔드포인트"],
            [
              "기타 AWS 서비스에 프라이빗 접근",
              "인터페이스 엔드포인트 (PrivateLink)",
            ],
            [
              "A-B, B-C 피어링인데 A-C 통신 안 됨",
              "정상 동작 — 피어링은 전이 안 됨, A-C 별도 피어링",
            ],
            ["온프레미스 연결을 빠르게, 암호화로", "Site-to-Site VPN"],
            ["인터넷을 전혀 거치지 않는 전용 연결", "Direct Connect"],
            ["네트워크 트래픽 로깅·연결 문제 분석", "VPC Flow Logs"],
          ]}
        />
      </Card>
    </>
  );
}

/* ════════════════ 메인 앱 ════════════════ */
const NAV = [
  {
    id: "intro",
    num: "109",
    label: "섹션 소개 & 빈출도",
    comp: <SectionIntro />,
  },
  { id: "vpc", num: "110", label: "VPC·서브넷·IGW·NAT", comp: <SectionVpc /> },
  {
    id: "sec",
    num: "111",
    label: "NACL·SG·Flow Logs",
    comp: <SectionSecurity />,
  },
  {
    id: "conn",
    num: "112",
    label: "피어링·엔드포인트·VPN·DX",
    comp: <SectionConnect />,
  },
  {
    id: "tier",
    num: "114",
    label: "3계층 아키텍처",
    comp: <SectionThreeTier />,
  },
  {
    id: "cheat",
    num: "113",
    label: "치트 시트 & 총정리",
    comp: <SectionCheat />,
  },
];

export default function App() {
  const [tab, setTab] = useState("intro");
  const cur = NAV.find((n) => n.id === tab);
  const idx = NAV.findIndex((n) => n.id === tab);

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily:
          "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif",
      }}
    >
      {/* 헤더 */}
      <header style={{ background: C.navy }} className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div
            className="inline-block rounded-full px-3 py-1 text-xs font-bold mb-3"
            style={{
              background: C.orange,
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            AWS 자격증 대비 · 섹션 109–114
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            AWS VPC 완전 정복 가이드
          </h1>
          <p className="text-sm" style={{ color: "#AFC0DA" }}>
            인터랙티브 다이어그램으로 배우는 VPC 기초 — 다이어그램 속 요소를
            클릭하면 설명이 나타납니다
          </p>
        </div>
      </header>

      {/* 네비게이션 */}
      <nav
        className="px-4 py-3 sticky top-0 z-10"
        style={{ background: "#fff", borderBottom: `1px solid ${C.line}` }}
      >
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors"
              style={{
                background: tab === n.id ? C.orange : C.bg,
                color: tab === n.id ? "#fff" : C.sub,
                border: `1px solid ${tab === n.id ? C.orange : C.line}`,
              }}
            >
              <span className="opacity-70 mr-1">{n.num}</span>
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 본문 */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {cur.comp}

        {/* 이전/다음 */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => idx > 0 && setTab(NAV[idx - 1].id)}
            disabled={idx === 0}
            className="rounded-xl px-5 py-3 text-sm font-bold"
            style={{
              background: idx === 0 ? C.line : "#fff",
              color: idx === 0 ? C.sub : C.ink,
              border: `1px solid ${C.line}`,
              cursor: idx === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← 이전
          </button>
          <button
            onClick={() => idx < NAV.length - 1 && setTab(NAV[idx + 1].id)}
            disabled={idx === NAV.length - 1}
            className="rounded-xl px-5 py-3 text-sm font-bold"
            style={{
              background: idx === NAV.length - 1 ? C.line : C.orange,
              color: "#fff",
              cursor: idx === NAV.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            다음 →
          </button>
        </div>
      </main>

      <footer className="text-center text-xs py-8" style={{ color: C.sub }}>
        VPC 기초 (강의 109–114) · 실습 제외 전체 개념 + 시험 빈출도 정리
      </footer>
    </div>
  );
}
