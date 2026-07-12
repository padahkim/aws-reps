//fable 5 high
import React, { useState, useEffect } from "react";

/* ============================================================
   AWS DVA-C02 · Amazon S3 완전 정복 가이드
   - 실습(핸즈온) 제외, 이론 강의 전체 커버
   - 출제 빈도: DVA-C02 수험생 커뮤니티/기출 경향 기반 추정치
   ============================================================ */

const C = {
  navy: "#161E2D",
  navy2: "#1F2A3D",
  ink: "#232F3E",
  paper: "#F7F8FA",
  card: "#FFFFFF",
  line: "#E3E7ED",
  orange: "#EC7211",
  orangeDk: "#C55B0B",
  green: "#7AA116", // S3 공식 컬러
  greenDk: "#5C7D0E",
  blue: "#2074D5",
  red: "#D13212",
  gray: "#6B7684",
  yellow: "#F2B807",
};

/* ---------- 출제 빈도 배지 ---------- */
function FreqBadge({ level }) {
  const map = {
    5: { label: "최빈출", color: C.red, bg: "#FDEBE7", desc: "거의 매 시험 출제" },
    4: { label: "빈출", color: C.orangeDk, bg: "#FDF1E4", desc: "자주 출제" },
    3: { label: "보통", color: "#8A6D00", bg: "#FBF3D5", desc: "종종 출제" },
    2: { label: "가끔", color: C.gray, bg: "#EEF1F4", desc: "간헐적 출제" },
  };
  const m = map[level];
  return (
    <span className="freq" style={{ color: m.color, background: m.bg }} title={m.desc}>
      {"●".repeat(level)}
      {"○".repeat(5 - level)}
      <b>{m.label}</b>
    </span>
  );
}

/* ---------- SVG 다이어그램 공용 파츠 ---------- */
const boxStyle = (fill, stroke) => ({ fill, stroke, strokeWidth: 1.5, rx: 8 });
function DBox({ x, y, w, h, fill = "#fff", stroke = C.line, label, sub, fs = 12, color = C.ink }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth="1.5" />
      <text x={x + w / 2} y={sub ? y + h / 2 - 5 : y + h / 2 + 4} textAnchor="middle" fontSize={fs} fontWeight="700" fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={fs - 2} fill={C.gray}>{sub}</text>}
    </g>
  );
}
function Arrow({ x1, y1, x2, y2, color = C.gray, dash, label, labelDy = -6 }) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id={`ah-${color.replace("#", "")}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.8" strokeDasharray={dash} markerEnd={`url(#ah-${color.replace("#", "")})`} />
      {label && <text x={mx} y={my + labelDy} textAnchor="middle" fontSize="10.5" fill={color} fontWeight="600">{label}</text>}
    </g>
  );
}
function Diagram({ vb, h = 260, children, caption }) {
  return (
    <figure className="diagram">
      <svg viewBox={vb} style={{ width: "100%", height: "auto" }} role="img">{children}</svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/* ---------- 콘텐츠 블록 ---------- */
function KP({ children }) { return <div className="kp"><span className="kp-mark">✓</span><div>{children}</div></div>; }
function Warn({ children }) { return <div className="warn"><span>⚠</span><div>{children}</div></div>; }
function Exam({ children }) { return <div className="exam"><span className="exam-tag">시험 포인트</span><div>{children}</div></div>; }
function Code({ children }) { return <code className="inline-code">{children}</code>; }

/* ============================================================
   섹션별 다이어그램
   ============================================================ */

function OverviewDiagram() {
  return (
    <Diagram vb="0 0 720 250" caption="버킷(전역 고유 이름, 리전 단위 생성) 안에 객체가 Key로 저장된다. 폴더는 실제로 존재하지 않으며 Key의 prefix일 뿐이다.">
      <rect x="20" y="20" width="680" height="210" rx="12" fill="#F2F7E8" stroke={C.green} strokeWidth="2" />
      <text x="40" y="48" fontSize="14" fontWeight="800" fill={C.greenDk}>S3 버킷: my-bucket (리전: ap-northeast-2)</text>
      <text x="40" y="66" fontSize="11" fill={C.gray}>이름은 전 세계(모든 리전·모든 계정)에서 유일해야 함</text>
      <DBox x={50} y={85} w={290} h={110} fill="#fff" stroke={C.line} label="" />
      <text x={65} y={110} fontSize="12" fontWeight="700" fill={C.ink}>객체 (Object)</text>
      <text x={65} y={132} fontSize="11.5" fill={C.ink}>Key: <tspan fontFamily="monospace" fill={C.blue}>images/2026/cat.jpg</tspan></text>
      <text x={65} y={150} fontSize="11" fill={C.gray}>= prefix(images/2026/) + 객체 이름(cat.jpg)</text>
      <text x={65} y={172} fontSize="11" fill={C.gray}>값(Value) = 본문 데이터, 최대 5TB</text>
      <DBox x={370} y={85} w={300} h={110} fill="#fff" stroke={C.line} label="" />
      <text x={385} y={110} fontSize="12" fontWeight="700" fill={C.ink}>객체 구성 요소</text>
      <text x={385} y={132} fontSize="11" fill={C.ink}>· 메타데이터 (key-value 텍스트)</text>
      <text x={385} y={150} fontSize="11" fill={C.ink}>· 태그 (최대 10개 — 보안·수명주기에 활용)</text>
      <text x={385} y={168} fontSize="11" fill={C.ink}>· 버전 ID (버전 관리 활성화 시)</text>
      <text x={40} y={220} fontSize="11" fontWeight="600" fill={C.red}>5GB 초과 업로드 시 반드시 멀티파트 업로드 사용</text>
    </Diagram>
  );
}

function PolicyDiagram() {
  return (
    <Diagram vb="0 0 720 270" caption="IAM 사용자/역할은 [IAM 정책 ∪ 버킷 정책]으로 평가되며, 명시적 Deny가 하나라도 있으면 무조건 거부된다.">
      <DBox x={20} y={40} w={130} h={54} fill="#EAF2FD" stroke={C.blue} label="IAM 사용자/역할" sub="같은 계정" />
      <DBox x={20} y={160} w={130} h={54} fill="#FDF1E4" stroke={C.orange} label="외부 사용자" sub="교차 계정 / 퍼블릭" />
      <DBox x={290} y={95} w={160} h={64} fill="#fff" stroke={C.ink} label="접근 평가" sub="명시적 Deny 우선" />
      <DBox x={550} y={95} w={140} h={64} fill="#F2F7E8" stroke={C.green} label="S3 버킷" sub="허용 or 거부" />
      <Arrow x1={150} y1={67} x2={290} y2={112} color={C.blue} label="IAM 정책" />
      <Arrow x1={150} y1={187} x2={290} y2={142} color={C.orange} label="버킷 정책 (리소스 기반)" />
      <Arrow x1={450} y1={127} x2={550} y2={127} color={C.green} label="Allow 존재 & Deny 없음" />
      <rect x="20" y="235" width="680" height="1" fill={C.line} />
      <text x="20" y="258" fontSize="11.5" fill={C.ink} fontWeight="600">퍼블릭 접근을 허용하려면: 버킷 정책 + "퍼블릭 액세스 차단(Block Public Access)" 해제 둘 다 필요</text>
    </Diagram>
  );
}

function VersioningDiagram() {
  return (
    <Diagram vb="0 0 720 240" caption="같은 Key로 덮어쓰면 새 버전이 쌓인다. 삭제하면 '삭제 마커'가 최상단에 추가될 뿐 이전 버전은 남는다.">
      <text x="30" y="30" fontSize="13" fontWeight="800" fill={C.ink}>Key: report.docx</text>
      <DBox x={30} y={50} w={190} h={44} fill="#FDEBE7" stroke={C.red} label="🚩 삭제 마커" sub="Version: pXk3... (최신)" />
      <DBox x={30} y={104} w={190} h={44} fill="#fff" stroke={C.line} label="Version 3" sub="v3 업로드" />
      <DBox x={30} y={158} w={190} h={44} fill="#fff" stroke={C.line} label="Version 2" sub="v2 업로드" />
      <DBox x={260} y={158} w={230} h={44} fill="#EEF1F4" stroke={C.gray} label="Version: null" sub="버전 관리 활성화 이전 객체" />
      <Arrow x1={260} y1={180} x2={220} y2={180} color={C.gray} />
      <text x={520} y={62} fontSize="12" fontWeight="700" fill={C.ink}>복원 방법</text>
      <text x={520} y={82} fontSize="11" fill={C.ink}>삭제 마커를 삭제하면</text>
      <text x={520} y={98} fontSize="11" fill={C.ink}>이전 버전이 다시 보임</text>
      <text x={520} y={130} fontSize="12" fontWeight="700" fill={C.ink}>중단(Suspend)</text>
      <text x={520} y={150} fontSize="11" fill={C.ink}>기존 버전은 삭제되지 않고</text>
      <text x={520} y={166} fontSize="11" fill={C.ink}>이후 업로드만 null 버전</text>
      <text x={30} y={228} fontSize="11.5" fontWeight="600" fill={C.red}>버전 관리는 버킷 수준 설정 · 복제(Replication)의 전제 조건</text>
    </Diagram>
  );
}

function ReplicationDiagram() {
  return (
    <Diagram vb="0 0 720 250" caption="CRR(교차 리전)·SRR(동일 리전) 복제. 양쪽 버킷 모두 버전 관리 필수, 복제는 비동기.">
      <DBox x={30} y={60} w={200} h={80} fill="#F2F7E8" stroke={C.green} label="원본 버킷" sub="ap-northeast-2 · 버전 관리 ON" />
      <DBox x={480} y={60} w={200} h={80} fill="#F2F7E8" stroke={C.green} label="대상 버킷" sub="us-east-1 · 버전 관리 ON" />
      <Arrow x1={230} y1={100} x2={480} y2={100} color={C.orange} label="비동기 복제 (IAM 역할 필요)" />
      <text x={355} y={125} textAnchor="middle" fontSize="10.5" fill={C.gray}>다른 계정도 가능</text>
      <text x={30} y={180} fontSize="12" fontWeight="700" fill={C.ink}>CRR 사용처: 규정 준수, 지연 시간 단축, 계정 간 복제</text>
      <text x={30} y={200} fontSize="12" fontWeight="700" fill={C.ink}>SRR 사용처: 로그 집계, 운영↔테스트 환경 실시간 복제</text>
      <text x={30} y={230} fontSize="11.5" fill={C.red} fontWeight="600">활성화 이후 새 객체만 복제 (기존 객체는 S3 Batch Replication 사용) · 복제 체이닝 불가 (1→2→3 ✗)</text>
    </Diagram>
  );
}

function StorageClassDiagram() {
  return (
    <Diagram vb="0 0 720 210" caption="자주 접근 → 드물게 접근 → 아카이브로 갈수록 저장 비용↓, 검색 비용/시간↑. 모든 클래스의 내구성은 11-nine으로 동일.">
      <Arrow x1={40} y1={40} x2={690} y2={40} color={C.gray} label="저장 비용 ↓ · 검근 빈도 ↓ · 검색 시간/비용 ↑" labelDy={-10} />
      <DBox x={30} y={60} w={100} h={56} fill="#EAF2FD" stroke={C.blue} label="Standard" sub="즉시" fs={11} />
      <DBox x={140} y={60} w={130} h={56} fill="#EAF2FD" stroke={C.blue} label="Intelligent-Tiering" sub="자동 이동" fs={11} />
      <DBox x={280} y={60} w={100} h={56} fill="#FDF1E4" stroke={C.orange} label="Standard-IA" sub="즉시" fs={11} />
      <DBox x={390} y={60} w={100} h={56} fill="#FDF1E4" stroke={C.orange} label="One Zone-IA" sub="1개 AZ만" fs={11} />
      <DBox x={500} y={60} w={100} h={56} fill="#EEF1F4" stroke={C.gray} label="Glacier IR" sub="밀리초 검색" fs={11} />
      <DBox x={610} y={60} w={45} h={56} fill="#EEF1F4" stroke={C.gray} label="GF" sub="분~시간" fs={10} />
      <DBox x={663} y={60} w={45} h={56} fill="#D8DDE4" stroke={C.gray} label="GDA" sub="12~48h" fs={10} />
      <text x={30} y={150} fontSize="11.5" fill={C.ink}>GF = Glacier Flexible Retrieval (신속 1~5분 / 표준 3~5시간 / 대량 5~12시간, 최소 90일)</text>
      <text x={30} y={170} fontSize="11.5" fill={C.ink}>GDA = Glacier Deep Archive (표준 12시간 / 대량 48시간, 최소 180일) — 최저가</text>
      <text x={30} y={196} fontSize="11.5" fontWeight="600" fill={C.red}>One Zone-IA: AZ 파괴 시 데이터 유실 → 재생성 가능한 사본·2차 백업용</text>
    </Diagram>
  );
}

function LifecycleDiagram() {
  return (
    <Diagram vb="0 0 720 220" caption="수명 주기 규칙 = 전환(Transition) + 만료(Expiration). prefix나 태그로 대상 범위 지정 가능.">
      <Arrow x1={40} y1={60} x2={690} y2={60} color={C.gray} label="객체 생성 후 경과 일수" labelDy={-10} />
      <DBox x={40} y={80} w={120} h={50} fill="#EAF2FD" stroke={C.blue} label="Standard" sub="0일" fs={11} />
      <DBox x={230} y={80} w={120} h={50} fill="#FDF1E4" stroke={C.orange} label="Standard-IA" sub="60일 후 전환" fs={11} />
      <DBox x={420} y={80} w={120} h={50} fill="#EEF1F4" stroke={C.gray} label="Glacier" sub="180일 후 전환" fs={11} />
      <DBox x={610} y={80} w={80} h={50} fill="#FDEBE7" stroke={C.red} label="삭제" sub="만료" fs={11} />
      <Arrow x1={160} y1={105} x2={230} y2={105} color={C.orange} />
      <Arrow x1={350} y1={105} x2={420} y2={105} color={C.gray} />
      <Arrow x1={540} y1={105} x2={610} y2={105} color={C.red} />
      <text x={40} y={165} fontSize="11.5" fill={C.ink}>만료 액션 활용: 이전 버전 삭제 · 완료되지 않은 멀티파트 업로드 정리 · 오래된 삭제 마커 제거</text>
      <text x={40} y={192} fontSize="11.5" fontWeight="600" fill={C.greenDk}>S3 Analytics(스토리지 클래스 분석): Standard→Standard-IA 전환 시점 추천 리포트(24~48시간 소요), 규칙 수립에 활용</text>
    </Diagram>
  );
}

function EventDiagram() {
  return (
    <Diagram vb="0 0 720 270" caption="S3 이벤트(생성·삭제·복원·복제 등)를 4가지 대상으로 전달. EventBridge 경유 시 고급 필터링과 다중 대상 지원.">
      <DBox x={30} y={100} w={150} h={64} fill="#F2F7E8" stroke={C.green} label="S3 버킷" sub="s3:ObjectCreated:* 등" />
      <DBox x={300} y={20} w={150} h={46} fill="#FDF1E4" stroke={C.orange} label="SNS" sub="팬아웃" fs={12} />
      <DBox x={300} y={80} w={150} h={46} fill="#FDF1E4" stroke={C.orange} label="SQS" sub="버퍼링" fs={12} />
      <DBox x={300} y={140} w={150} h={46} fill="#FDF1E4" stroke={C.orange} label="Lambda" sub="예: 썸네일 생성" fs={12} />
      <DBox x={300} y={200} w={150} h={46} fill="#EAF2FD" stroke={C.blue} label="EventBridge" sub="모든 이벤트 자동 전달" fs={12} />
      <DBox x={540} y={200} w={160} h={46} fill="#fff" stroke={C.blue} label="18개 이상 AWS 서비스" sub="Step Functions, Kinesis…" fs={11} />
      <Arrow x1={180} y1={118} x2={300} y2={43} color={C.orange} />
      <Arrow x1={180} y1={128} x2={300} y2={103} color={C.orange} />
      <Arrow x1={180} y1={140} x2={300} y2={163} color={C.orange} label="리소스 정책 필요" labelDy={16} />
      <Arrow x1={180} y1={152} x2={300} y2={223} color={C.blue} />
      <Arrow x1={450} y1={223} x2={540} y2={223} color={C.blue} label="JSON 규칙 필터링" />
      <text x={30} y={258} fontSize="11" fill={C.gray}>대상이 이벤트를 받으려면 SNS/SQS/Lambda의 리소스(액세스) 정책에서 S3 허용 필요 · 전달은 보통 수초, 간혹 1분+</text>
    </Diagram>
  );
}

function PerformanceDiagram() {
  return (
    <Diagram vb="0 0 720 300" caption="멀티파트 업로드(병렬 업로드), Transfer Acceleration(엣지 경유), 바이트 범위 가져오기(병렬 다운로드).">
      <text x={30} y={30} fontSize="13" fontWeight="800" fill={C.ink}>① 멀티파트 업로드 — 100MB 이상 권장, 5GB 초과 필수</text>
      <DBox x={30} y={45} w={90} h={40} fill="#EAF2FD" stroke={C.blue} label="큰 파일" fs={11} />
      <DBox x={170} y={40} w={70} h={24} fill="#fff" stroke={C.line} label="Part 1" fs={10} />
      <DBox x={170} y={68} w={70} h={24} fill="#fff" stroke={C.line} label="Part 2" fs={10} />
      <DBox x={250} y={54} w={20} h={24} fill="#fff" stroke={C.line} label="…" fs={10} />
      <DBox x={340} y={45} w={90} h={40} fill="#F2F7E8" stroke={C.green} label="S3" fs={11} />
      <Arrow x1={120} y1={65} x2={168} y2={60} color={C.gray} label="분할" />
      <Arrow x1={272} y1={65} x2={338} y2={65} color={C.green} label="병렬 업로드" />
      <text x={30} y={120} fontSize="13" fontWeight="800" fill={C.ink}>② Transfer Acceleration — 엣지 로케이션 → AWS 프라이빗 네트워크</text>
      <DBox x={30} y={135} w={110} h={40} fill="#EAF2FD" stroke={C.blue} label="미국 클라이언트" fs={11} />
      <DBox x={250} y={135} w={130} h={40} fill="#FDF1E4" stroke={C.orange} label="엣지 로케이션" sub="가까운 곳" fs={11} />
      <DBox x={490} y={135} w={150} h={40} fill="#F2F7E8" stroke={C.green} label="S3 (호주 리전)" fs={11} />
      <Arrow x1={140} y1={155} x2={250} y2={155} color={C.blue} label="퍼블릭 인터넷 (최소화)" />
      <Arrow x1={380} y1={155} x2={490} y2={155} color={C.green} label="AWS 프라이빗 망 (고속)" />
      <text x={30} y={210} fontSize="13" fontWeight="800" fill={C.ink}>③ 바이트 범위 가져오기(Byte-Range Fetch) — 다운로드 병렬화 / 부분 검색</text>
      <DBox x={30} y={225} w={90} h={40} fill="#F2F7E8" stroke={C.green} label="S3 객체" fs={11} />
      <Arrow x1={120} y1={238} x2={230} y2={238} color={C.blue} label="0~9MB" />
      <Arrow x1={120} y1={252} x2={230} y2={252} color={C.blue} label="10~19MB" labelDy={14} />
      <DBox x={232} y={225} w={110} h={40} fill="#EAF2FD" stroke={C.blue} label="병렬 GET" sub="장애 복원력 ↑" fs={11} />
      <text x={370} y={243} fontSize="11.5" fill={C.ink}>헤더만 가져오기 등 부분 검색에도 활용</text>
      <text x={30} y={290} fontSize="11.5" fontWeight="600" fill={C.greenDk}>기준 성능: prefix당 초당 3,500 PUT/COPY/POST/DELETE · 5,500 GET/HEAD — prefix 수 제한 없음(분산 시 확장)</text>
    </Diagram>
  );
}

function EncryptionDiagram() {
  return (
    <Diagram vb="0 0 720 330" caption="서버 측 암호화 3종(+DSSE) vs 클라이언트 측 암호화. SSE-C는 HTTPS 필수 + 매 요청 키 전달.">
      <text x={30} y={26} fontSize="13" fontWeight="800" fill={C.ink}>서버 측 암호화 (SSE) — S3가 저장 시 암호화</text>
      <DBox x={30} y={40} w={160} h={62} fill="#F2F7E8" stroke={C.green} label="SSE-S3 (기본값)" sub="S3 관리 키 · AES-256" fs={11.5} />
      <DBox x={210} y={40} w={160} h={62} fill="#FDF1E4" stroke={C.orange} label="SSE-KMS" sub="KMS 키 · 감사(CloudTrail)" fs={11.5} />
      <DBox x={390} y={40} w={160} h={62} fill="#FDEBE7" stroke={C.red} label="SSE-C" sub="고객 제공 키 · HTTPS 필수" fs={11.5} />
      <DBox x={570} y={40} w={130} h={62} fill="#EEF1F4" stroke={C.gray} label="DSSE-KMS" sub="KMS 이중 암호화" fs={11.5} />
      <text x={30} y={130} fontSize="11" fill={C.ink}>헤더: <tspan fontFamily="monospace" fill={C.blue}>x-amz-server-side-encryption</tspan> = AES256(SSE-S3) / aws:kms(SSE-KMS) / aws:kms:dsse(DSSE)</text>
      <text x={30} y={150} fontSize="11" fill={C.red} fontWeight="600">SSE-C: 키를 매 요청 HTTP 헤더로 전달, S3는 사용 후 키 폐기 → 다운로드 시에도 같은 키 필요</text>
      <text x={30} y={185} fontSize="13" fontWeight="800" fill={C.ink}>SSE-KMS 흐름과 제약</text>
      <DBox x={30} y={200} w={110} h={46} fill="#EAF2FD" stroke={C.blue} label="사용자" fs={11.5} />
      <DBox x={250} y={200} w={110} h={46} fill="#F2F7E8" stroke={C.green} label="S3" fs={11.5} />
      <DBox x={470} y={200} w={110} h={46} fill="#FDF1E4" stroke={C.orange} label="KMS" sub="GenerateDataKey / Decrypt" fs={11.5} />
      <Arrow x1={140} y1={223} x2={250} y2={223} color={C.blue} label="HTTPS + 헤더" />
      <Arrow x1={360} y1={223} x2={470} y2={223} color={C.orange} label="KMS API 호출" />
      <text x={30} y={278} fontSize="11.5" fill={C.red} fontWeight="600">KMS API에는 초당 요청 한도(리전별 5,500~30,000)가 있어 대량 업/다운로드 시 스로틀링 가능 → Service Quotas로 상향</text>
      <text x={30} y={306} fontSize="13" fontWeight="800" fill={C.ink}>클라이언트 측 암호화: 업로드 전 직접 암호화·다운로드 후 직접 복호화 (키·암호화 주기 전부 고객 관리)</text>
    </Diagram>
  );
}

function CorsDiagram() {
  return (
    <Diagram vb="0 0 720 260" caption="다른 오리진의 웹페이지가 S3 자원을 요청하면 브라우저가 preflight로 허용 여부를 확인한다. CORS 헤더는 '요청받는 쪽' 버킷에 설정.">
      <DBox x={30} y={30} w={170} h={56} fill="#EAF2FD" stroke={C.blue} label="브라우저" sub="오리진: http://example.com" fs={11.5} />
      <DBox x={490} y={30} w={200} h={56} fill="#F2F7E8" stroke={C.green} label="교차 오리진 S3 버킷" sub="http://other.s3-website…" fs={11.5} />
      <Arrow x1={200} y1={48} x2={490} y2={48} color={C.gray} label="① Preflight (OPTIONS) + Origin 헤더" />
      <Arrow x1={490} y1={70} x2={200} y2={70} color={C.orange} label="② Access-Control-Allow-Origin / -Methods" labelDy={14} />
      <Arrow x1={200} y1={110} x2={490} y2={110} color={C.green} label="③ 허용되면 실제 GET 요청" labelDy={-6} />
      <text x={30} y={155} fontSize="12" fontWeight="700" fill={C.ink}>오리진 = 프로토콜(scheme) + 호스트 + 포트</text>
      <text x={30} y={175} fontSize="11.5" fill={C.ink}>같은 오리진: http://example.com/app1 ↔ /app2 ✔ · 다른 오리진: http↔https, 도메인 다름, 포트 다름 ✗</text>
      <text x={30} y={205} fontSize="11.5" fontWeight="600" fill={C.red}>시험 단골: 정적 웹사이트(버킷 A)가 버킷 B의 자원을 fetch → CORS 설정은 버킷 B에!</text>
      <text x={30} y={230} fontSize="11.5" fill={C.gray}>특정 오리진 하나 또는 *(모든 오리진) 허용 가능</text>
    </Diagram>
  );
}

function PresignedDiagram() {
  return (
    <Diagram vb="0 0 720 240" caption="프라이빗 버킷을 유지하면서, URL 생성자의 권한을 '상속'한 임시 URL로 특정 객체에 GET/PUT 허용.">
      <DBox x={30} y={40} w={160} h={56} fill="#EAF2FD" stroke={C.blue} label="버킷 소유자" sub="Console / CLI / SDK" fs={11.5} />
      <DBox x={280} y={40} w={170} h={56} fill="#F2F7E8" stroke={C.green} label="프라이빗 S3 버킷" fs={11.5} />
      <DBox x={530} y={40} w={160} h={56} fill="#FDF1E4" stroke={C.orange} label="외부 사용자" sub="로그인 없이 접근" fs={11.5} />
      <Arrow x1={190} y1={68} x2={280} y2={68} color={C.blue} label="① Presigned URL 생성" />
      <Arrow x1={190} y1={110} x2={530} y2={110} color={C.gray} label="② URL 전달 (만료 시간 포함)" labelDy={14} />
      <Arrow x1={560} y1={96} x2={450} y2={80} color={C.orange} label="③ GET/PUT" />
      <text x={30} y={165} fontSize="12" fontWeight="700" fill={C.ink}>만료 시간: 콘솔 최대 12시간 · CLI/SDK 최대 168시간(7일)</text>
      <text x={30} y={190} fontSize="11.5" fill={C.ink}>사용 예: 프리미엄 동영상을 로그인 사용자에게만 · 사용자 파일 업로드를 특정 위치에 임시 허용</text>
      <text x={30} y={215} fontSize="11.5" fontWeight="600" fill={C.red}>URL을 받은 사람은 '생성자의 권한'으로 동작 — 시험 최빈출 시나리오</text>
    </Diagram>
  );
}

function AccessPointDiagram() {
  return (
    <Diagram vb="0 0 720 260" caption="거대한 버킷 정책 하나 대신, 용도별 액세스 포인트 + 각자의 정책으로 보안 관리를 단순화.">
      <DBox x={30} y={30} w={150} h={46} fill="#EAF2FD" stroke={C.blue} label="재무팀" fs={11.5} />
      <DBox x={30} y={100} w={150} h={46} fill="#EAF2FD" stroke={C.blue} label="영업팀" fs={11.5} />
      <DBox x={30} y={170} w={150} h={46} fill="#EAF2FD" stroke={C.blue} label="분석팀" fs={11.5} />
      <DBox x={280} y={30} w={180} h={46} fill="#FDF1E4" stroke={C.orange} label="Finance AP" sub="정책: /finance/* R/W" fs={11} />
      <DBox x={280} y={100} w={180} h={46} fill="#FDF1E4" stroke={C.orange} label="Sales AP" sub="정책: /sales/* R/W" fs={11} />
      <DBox x={280} y={170} w={180} h={46} fill="#FDF1E4" stroke={C.orange} label="Analytics AP" sub="정책: 전체 읽기 전용" fs={11} />
      <DBox x={550} y={95} w={150} h={64} fill="#F2F7E8" stroke={C.green} label="S3 버킷" sub="/finance, /sales…" fs={12} />
      <Arrow x1={180} y1={53} x2={280} y2={53} color={C.blue} />
      <Arrow x1={180} y1={123} x2={280} y2={123} color={C.blue} />
      <Arrow x1={180} y1={193} x2={280} y2={193} color={C.blue} />
      <Arrow x1={460} y1={53} x2={550} y2={110} color={C.orange} />
      <Arrow x1={460} y1={123} x2={550} y2={127} color={C.orange} />
      <Arrow x1={460} y1={193} x2={550} y2={145} color={C.orange} />
      <text x={30} y={245} fontSize="11.5" fill={C.ink}>각 AP는 고유 DNS(인터넷 또는 VPC Origin) 보유 · VPC Origin이면 VPC 엔드포인트(+정책) 통해서만 접근</text>
    </Diagram>
  );
}

function ObjectLambdaDiagram() {
  return (
    <Diagram vb="0 0 720 250" caption="버킷을 복제하지 않고, 조회 시점에 Lambda로 객체를 변환해 돌려준다. (액세스 포인트 + Object Lambda AP 필요)">
      <DBox x={30} y={90} w={150} h={56} fill="#EAF2FD" stroke={C.blue} label="분석 애플리케이션" sub="개인정보 제거본 필요" fs={11} />
      <DBox x={250} y={90} w={180} h={56} fill="#FDF1E4" stroke={C.orange} label="Object Lambda AP" fs={11.5} />
      <DBox x={250} y={175} w={180} h={50} fill="#FDEBE7" stroke={C.red} label="Lambda 함수" sub="예: PII 마스킹, 워터마크" fs={11} />
      <DBox x={500} y={90} w={190} h={56} fill="#F2F7E8" stroke={C.green} label="S3 버킷 (+지원 AP)" sub="원본 객체 1벌만 유지" fs={11} />
      <Arrow x1={180} y1={118} x2={250} y2={118} color={C.blue} label="① GET" />
      <Arrow x1={430} y1={118} x2={500} y2={118} color={C.green} label="② 원본 조회" />
      <Arrow x1={340} y1={146} x2={340} y2={175} color={C.red} label="③ 변환" labelDy={0} />
      <Arrow x1={300} y1={175} x2={230} y2={146} color={C.orange} label="④ 변환본 반환" />
      <text x={30} y={245} fontSize="11.5" fill={C.ink}>사용 예: PII 삭제(분석용) · XML→JSON 변환 · 이미지 리사이즈/워터마크(요청자별 다르게)</text>
    </Diagram>
  );
}

function WebsiteDiagram() {
  return (
    <Diagram vb="0 0 720 190" caption="버킷에 정적 파일을 올리고 웹사이트 호스팅을 켜면 전용 엔드포인트로 서비스된다.">
      <DBox x={30} y={50} w={150} h={56} fill="#EAF2FD" stroke={C.blue} label="사용자 브라우저" fs={11.5} />
      <DBox x={280} y={50} w={220} h={56} fill="#F2F7E8" stroke={C.green} label="S3 정적 웹사이트" sub="HTML / CSS / JS / 이미지" fs={11.5} />
      <Arrow x1={180} y1={78} x2={280} y2={78} color={C.blue} label="HTTP GET" />
      <text x={30} y={140} fontSize="11.5" fontFamily="monospace" fill={C.blue}>http://bucket-name.s3-website-리전.amazonaws.com (또는 s3-website.리전)</text>
      <text x={30} y={168} fontSize="11.5" fontWeight="600" fill={C.red}>403 Forbidden이 뜨면 → 버킷 정책이 퍼블릭 읽기를 허용하는지 확인 (시험 단골)</text>
    </Diagram>
  );
}

function MfaDiagram() {
  return (
    <Diagram vb="0 0 720 180" caption="MFA Delete: 파괴적 작업(버전 영구 삭제, 버전 관리 중단)에 MFA 코드를 요구한다.">
      <DBox x={30} y={40} w={170} h={56} fill="#EAF2FD" stroke={C.blue} label="루트 계정 (필수)" sub="CLI/SDK/API로만 설정" fs={11} />
      <DBox x={300} y={40} w={170} h={56} fill="#FDEBE7" stroke={C.red} label="MFA 코드 요구" sub="버전 영구 삭제 시" fs={11} />
      <DBox x={540} y={40} w={150} h={56} fill="#F2F7E8" stroke={C.green} label="버전 관리 버킷" fs={11.5} />
      <Arrow x1={200} y1={68} x2={300} y2={68} color={C.blue} />
      <Arrow x1={470} y1={68} x2={540} y2={68} color={C.red} />
      <text x={30} y={135} fontSize="11.5" fill={C.ink}>MFA 불필요: 버전 관리 활성화, 삭제 마커 추가(일반 삭제), 목록 조회</text>
      <text x={30} y={160} fontSize="11.5" fontWeight="600" fill={C.red}>전제: 버킷 버전 관리 활성화 · 오직 버킷 소유자(루트)만 활성/비활성 가능</text>
    </Diagram>
  );
}

function LogsDiagram() {
  return (
    <Diagram vb="0 0 720 170" caption="모든 요청을 로깅 버킷에 기록. 로깅 버킷 = 대상 버킷이면 무한 루프 → 요금 폭탄!">
      <DBox x={30} y={40} w={160} h={56} fill="#F2F7E8" stroke={C.green} label="애플리케이션 버킷" sub="모든 요청 (허용/거부)" fs={11} />
      <DBox x={290} y={40} w={170} h={56} fill="#FDF1E4" stroke={C.orange} label="로깅 버킷" sub="반드시 같은 리전" fs={11.5} />
      <DBox x={540} y={40} w={150} h={56} fill="#EAF2FD" stroke={C.blue} label="Athena 등" sub="로그 분석" fs={11.5} />
      <Arrow x1={190} y1={68} x2={290} y2={68} color={C.orange} label="액세스 로그" />
      <Arrow x1={460} y1={68} x2={540} y2={68} color={C.blue} />
      <text x={30} y={140} fontSize="12" fontWeight="700" fill={C.red}>⚠ 로깅 버킷을 모니터링 대상 버킷과 동일하게 설정하면 로그가 로그를 낳는 무한 루프 발생</text>
    </Diagram>
  );
}

/* ============================================================
   섹션 데이터
   ============================================================ */
const SECTIONS = [
  {
    id: "overview", no: "115", title: "S3 개요", freq: 3, group: "기초",
    body: (
      <>
        <p>Amazon S3는 <b>무한 확장 스토리지</b>로 불리는 객체 스토리지 서비스입니다. 백업/스토리지, 재해 복구(DR), 아카이브, 하이브리드 클라우드 스토리지, 애플리케이션·미디어 호스팅, 데이터 레이크/빅데이터 분석, 소프트웨어 배포, 정적 웹사이트 등 AWS 전반의 기반으로 쓰입니다.</p>
        <OverviewDiagram />
        <KP><b>버킷</b>은 리전 단위로 생성되지만 이름은 <b>전 세계적으로 고유</b>해야 합니다. (S3가 글로벌 서비스처럼 보이지만 실제로는 리전 서비스)</KP>
        <KP>버킷 이름 규칙: 3~63자, 대문자·언더스코어 불가, 소문자/숫자로 시작, IP 형식 불가.</KP>
        <KP><b>객체 Key = 전체 경로</b>입니다. <Code>s3://bucket/folder1/file.txt</Code>에서 Key는 <Code>folder1/file.txt</Code>. "디렉터리"라는 개념은 실제로 없고 UI가 prefix를 폴더처럼 보여줄 뿐입니다.</KP>
        <KP>객체 최대 크기 <b>5TB</b>, 한 번의 PUT은 최대 5GB → <b>5GB 초과 시 멀티파트 업로드 필수</b>.</KP>
        <Exam>버킷 이름의 전역 고유성, "폴더는 prefix일 뿐", 5TB/5GB/멀티파트 수치는 기초 문제로 종종 등장합니다.</Exam>
      </>
    ),
  },
  {
    id: "security", no: "117", title: "S3 보안: 버킷 정책", freq: 4, group: "기초",
    body: (
      <>
        <p>S3 보안은 <b>사용자 기반(IAM 정책)</b>과 <b>리소스 기반(버킷 정책, ACL)</b>으로 나뉩니다. ACL은 현재 기본 비활성화가 권장되며, 시험의 중심은 <b>버킷 정책</b>입니다.</p>
        <PolicyDiagram />
        <KP>접근 허용 조건: <b>(IAM 허용 OR 리소스 정책 허용) AND 명시적 Deny 없음</b>.</KP>
        <KP>버킷 정책 JSON 구성: <Code>Effect</Code>(Allow/Deny), <Code>Principal</Code>(누가), <Code>Action</Code>(예: s3:GetObject), <Code>Resource</Code>(예: <Code>arn:aws:s3:::bucket/*</Code>).</KP>
        <KP>주요 사용 사례: ① 버킷 퍼블릭 공개 ② 업로드 시 암호화 강제 ③ <b>교차 계정(Cross-Account) 접근 허용</b>.</KP>
        <KP>EC2에서 S3 접근 시에는 액세스 키를 넣지 말고 <b>IAM 역할(인스턴스 프로파일)</b>을 사용합니다.</KP>
        <Warn><b>퍼블릭 액세스 차단(Block Public Access)</b>: 회사 데이터 유출 방지용 추가 안전장치. 이 설정이 켜져 있으면 버킷 정책으로 퍼블릭을 허용해도 절대 공개되지 않습니다. 계정 수준 일괄 설정도 가능.</Warn>
        <Exam>"버킷 정책을 열었는데도 접근이 안 된다" → Block Public Access 확인. "다른 계정의 IAM 사용자에게 접근 허용" → 버킷 정책. 이 두 시나리오가 단골입니다.</Exam>
      </>
    ),
  },
  {
    id: "website", no: "119", title: "S3 정적 웹사이트", freq: 3, group: "기초",
    body: (
      <>
        <p>S3는 정적 웹사이트(HTML/CSS/JS)를 호스팅하고 인터넷에 서비스할 수 있습니다. 인덱스 문서·에러 문서를 지정합니다.</p>
        <WebsiteDiagram />
        <KP>엔드포인트 형식은 리전에 따라 <Code>.s3-website-리전</Code> 또는 <Code>.s3-website.리전</Code> (대시/점 차이).</KP>
        <Exam><b>403 Forbidden = 버킷 정책이 퍼블릭 읽기를 허용하지 않음</b>. 정적 웹사이트 + CORS 조합 문제(146강 참고)도 자주 나옵니다.</Exam>
      </>
    ),
  },
  {
    id: "versioning", no: "121", title: "S3 버전 관리", freq: 4, group: "기초",
    body: (
      <>
        <p>버킷 수준에서 활성화하며, 같은 Key에 덮어쓸 때마다 새로운 버전이 생성됩니다. <b>의도치 않은 삭제로부터 보호</b>하고 이전 버전으로 쉽게 롤백할 수 있어, 사실상 모든 버킷에 권장됩니다.</p>
        <VersioningDiagram />
        <KP>버전 관리 <b>이전</b>에 존재하던 객체의 버전은 <Code>null</Code>.</KP>
        <KP>삭제 = 실제 삭제가 아니라 <b>삭제 마커</b> 추가. 삭제 마커를 삭제하면 객체가 "복원"됩니다.</KP>
        <KP>버전 관리를 <b>중단(Suspend)</b>해도 기존 버전은 삭제되지 않습니다.</KP>
        <Exam>"실수로 삭제한 파일 복구" → 버전 관리 + 삭제 마커 제거. 복제·MFA Delete의 전제 조건이라는 점도 연계 출제됩니다.</Exam>
      </>
    ),
  },
  {
    id: "replication", no: "123", title: "S3 복제 (CRR / SRR)", freq: 3, group: "기초",
    body: (
      <>
        <p>버킷 간 객체를 <b>비동기</b>로 복제합니다. 교차 리전(CRR)과 동일 리전(SRR)이 있으며, 다른 AWS 계정 간에도 가능합니다.</p>
        <ReplicationDiagram />
        <KP>필수 조건: <b>원본·대상 버킷 모두 버전 관리 활성화</b> + S3에 적절한 IAM 권한(역할) 부여.</KP>
        <KP>복제 활성화 후 <b>새 객체만</b> 복제됩니다. 기존 객체와 복제 실패 객체는 <b>S3 Batch Replication</b>으로 복제합니다.</KP>
        <KP><b>삭제 마커 복제는 선택 사항</b>(옵션으로 켤 수 있음). 그러나 <b>버전 ID를 지정한 영구 삭제는 복제되지 않습니다</b>(악의적 삭제 전파 방지).</KP>
        <KP><b>복제 체이닝 불가</b>: 버킷1→버킷2, 버킷2→버킷3이어도 버킷1의 객체가 버킷3에 자동 복제되지 않습니다.</KP>
        <Exam>"버전 관리 필수", "새 객체만/기존은 Batch Replication", "체이닝 불가" 3가지가 복제 문제의 핵심 선지입니다.</Exam>
      </>
    ),
  },
  {
    id: "storage", no: "126", title: "S3 스토리지 클래스", freq: 4, group: "기초",
    body: (
      <>
        <p>객체 생성 시 클래스를 선택하거나, 수동/수명 주기 규칙으로 변경할 수 있습니다. <b>내구성(Durability)은 모든 클래스에서 11-nine(99.999999999%)으로 동일</b>하며, 차이는 가용성(Availability)·비용·검색 시간입니다.</p>
        <StorageClassDiagram />
        <div className="table-wrap"><table>
          <thead><tr><th>클래스</th><th>가용성</th><th>특징</th><th>사용 예</th></tr></thead>
          <tbody>
            <tr><td><b>Standard</b></td><td>99.99%</td><td>즉시 접근, 최소 기간/검색 비용 없음</td><td>빅데이터, 모바일·게임, 콘텐츠 배포</td></tr>
            <tr><td><b>Standard-IA</b></td><td>99.9%</td><td>저렴한 저장 + 검색 비용, 최소 30일</td><td>재해 복구, 백업</td></tr>
            <tr><td><b>One Zone-IA</b></td><td>99.5%</td><td><b>단일 AZ</b> — AZ 파괴 시 유실</td><td>재생성 가능한 사본, 온프레미스 2차 백업</td></tr>
            <tr><td><b>Glacier Instant Retrieval</b></td><td>99.9%</td><td>밀리초 검색, 최소 90일</td><td>분기 1회 접근하는 데이터</td></tr>
            <tr><td><b>Glacier Flexible Retrieval</b></td><td>99.99%*</td><td>신속 1~5분 / 표준 3~5시간 / 대량 5~12시간, 최소 90일</td><td>아카이브</td></tr>
            <tr><td><b>Glacier Deep Archive</b></td><td>99.99%*</td><td>표준 12시간 / 대량 48시간, 최소 180일, <b>최저가</b></td><td>장기 보존(규정)</td></tr>
            <tr><td><b>Intelligent-Tiering</b></td><td>99.9%</td><td>접근 패턴 따라 자동 계층 이동, 검색 비용 없음, 소액 모니터링 비용</td><td>패턴을 모르는 데이터</td></tr>
          </tbody>
        </table><p className="table-note">* 복원 후 기준. 가용성 수치보다 "검색 시간·최소 보관 기간·단일 AZ 여부"가 시험 포인트입니다.</p></div>
        <Exam>① "복원 없이 즉시 접근 + 아카이브 가격" → Glacier Instant Retrieval ② "재생성 가능한 데이터의 저비용 보관" → One Zone-IA ③ "접근 패턴 불명 + 운영 부담 최소화" → Intelligent-Tiering ④ 신속/표준/대량 검색 시간 암기.</Exam>
      </>
    ),
  },
  {
    id: "lifecycle", no: "136", title: "생애 주기 규칙 (+ S3 Analytics)", freq: 4, group: "고급",
    body: (
      <>
        <p>객체를 자동으로 다른 클래스로 <b>전환(Transition)</b>하거나 <b>만료(Expiration, 삭제)</b>시키는 규칙입니다. prefix(<Code>s3://bucket/mp3/*</Code>)나 객체 태그로 적용 범위를 좁힐 수 있습니다.</p>
        <LifecycleDiagram />
        <KP>전환 액션 예: 생성 60일 후 Standard-IA로, 6개월 후 Glacier로.</KP>
        <KP>만료 액션 예: 365일 후 액세스 로그 삭제, <b>이전 버전 삭제</b>, <b>미완료 멀티파트 업로드 삭제</b>.</KP>
        <KP>대표 시나리오(썸네일): 원본 사진 → Standard, 60일 후 Glacier / 썸네일(재생성 가능) → One Zone-IA, 60일 후 만료.</KP>
        <KP>"삭제 후 30일 내 즉시 복구 + 이후 1년까지 48시간 내 복구" → 버전 관리 + 이전 버전을 30일 후 Standard-IA → 이후 Glacier Deep Archive로 전환.</KP>
        <KP><b>S3 Analytics(스토리지 클래스 분석)</b>: Standard → Standard-IA 전환 추천만 제공(One Zone-IA·Glacier는 미지원). 리포트는 24~48시간 후부터 매일 갱신. 수명 주기 규칙 수립의 근거로 활용.</KP>
        <Exam>버전 관리 + 수명 주기를 조합한 복구 시나리오, "미완료 멀티파트 업로드 정리" 비용 절감 문제가 자주 나옵니다.</Exam>
      </>
    ),
  },
  {
    id: "events", no: "138", title: "S3 이벤트 알림", freq: 4, group: "고급",
    body: (
      <>
        <p><Code>s3:ObjectCreated:*</Code>, <Code>s3:ObjectRemoved:*</Code>, 복원·복제 이벤트 등을 SNS·SQS·Lambda로 전달합니다. 대표 사례: <b>이미지 업로드 → Lambda로 썸네일 자동 생성</b>.</p>
        <EventDiagram />
        <KP>객체 이름 필터링 가능(예: <Code>*.jpg</Code>). 이벤트는 대개 수초 내 전달되지만 1분 이상 걸릴 수도 있습니다.</KP>
        <KP>S3가 대상에 게시하려면 대상 측 <b>리소스(액세스) 정책</b>에서 S3를 허용해야 합니다. (IAM 역할이 아니라 SNS/SQS/Lambda의 리소스 정책 — 시험 포인트)</KP>
        <KP><b>Amazon EventBridge</b>: 모든 S3 이벤트가 자동 전달되며, ① 메타데이터·객체 크기·이름 등 <b>고급 필터링</b> ② <b>18개 이상 서비스</b>(Step Functions, Kinesis 등)로 전달 ③ 아카이브·재생(Replay)·안정적 전송 지원.</KP>
        <Exam>"업로드 시 자동 처리" → S3 이벤트 + Lambda. "Step Functions/Kinesis로 보내고 싶다" 또는 "이벤트 재생 필요" → EventBridge. "알림이 안 온다" → 대상의 리소스 정책 확인.</Exam>
      </>
    ),
  },
  {
    id: "performance", no: "140", title: "S3 퍼포먼스", freq: 5, group: "고급",
    body: (
      <>
        <p>DVA 최빈출 영역 중 하나입니다. 기준 성능과 3가지 최적화 기법을 확실히 잡아야 합니다.</p>
        <PerformanceDiagram />
        <KP>기준 성능: <b>prefix당 초당 3,500 PUT/COPY/POST/DELETE · 5,500 GET/HEAD</b>. prefix 수는 무제한이므로 여러 prefix에 분산하면 그만큼 확장.</KP>
        <KP><b>멀티파트 업로드</b>: 100MB 이상 권장, <b>5GB 초과 필수</b>. 파트 병렬 업로드로 대역폭 극대화.</KP>
        <KP><b>Transfer Acceleration</b>: 파일을 가까운 엣지 로케이션으로 보낸 뒤 AWS 프라이빗 망으로 대상 리전 버킷까지 고속 전송. 멀티파트와 병행 가능. 업로드·다운로드 모두 지원.</KP>
        <KP><b>바이트 범위 가져오기(Byte-Range Fetches)</b>: GET을 특정 바이트 범위로 병렬 요청 → 다운로드 가속 + 실패 시 해당 범위만 재시도(복원력↑). 파일 앞부분(헤더)만 가져오는 부분 검색에도 사용.</KP>
        <Exam>"멀리 떨어진 리전으로 대용량 업로드 가속" → Transfer Acceleration (+멀티파트). "다운로드 병렬화/부분 조회" → Byte-Range Fetch. 3,500/5,500 수치 암기 필수.</Exam>
      </>
    ),
  },
  {
    id: "tags", no: "141", title: "객체 태그 & 메타데이터", freq: 2, group: "고급",
    body: (
      <>
        <KP><b>사용자 정의 메타데이터</b>: 반드시 <Code>x-amz-meta-</Code>로 시작하는 key-value. 객체와 함께 저장되고 조회 시 반환됩니다.</KP>
        <KP><b>객체 태그</b>: 객체당 최대 10개. ① 세분화된 권한 제어(특정 태그 객체만 접근) ② 분석(S3 Analytics에서 태그로 그룹화) ③ 수명 주기 규칙 필터에 활용.</KP>
        <Warn><b>메타데이터·태그로 검색/필터링은 불가!</b> 원하는 객체를 태그·메타데이터로 찾아야 한다면 인덱스를 DynamoDB 같은 외부 DB에 만들어 검색해야 합니다.</Warn>
        <Exam>"태그로 객체를 검색하려면?" → 불가능, DynamoDB 인덱스 구축. 이 함정 선지가 시험에 그대로 나옵니다.</Exam>
      </>
    ),
  },
  {
    id: "encryption", no: "142", title: "S3 암호화 (SSE-S3 / SSE-KMS / DSSE-KMS / SSE-C / 클라이언트)", freq: 5, group: "보안",
    body: (
      <>
        <p><b>DVA 시험에서 S3 최빈출 주제</b>입니다. 4가지 방식의 차이·헤더·제약을 정확히 구분하세요.</p>
        <EncryptionDiagram />
        <div className="table-wrap"><table>
          <thead><tr><th>방식</th><th>키 관리</th><th>헤더</th><th>핵심 포인트</th></tr></thead>
          <tbody>
            <tr><td><b>SSE-S3</b></td><td>AWS(S3) 소유·관리</td><td><Code>"x-amz-server-side-encryption": "AES256"</Code></td><td>AES-256, 신규 버킷·객체 <b>기본값</b></td></tr>
            <tr><td><b>SSE-KMS</b></td><td>KMS 키 (직접 관리 가능)</td><td><Code>"aws:kms"</Code></td><td>키 사용자 제어 + <b>CloudTrail 감사</b>. 업/다운로드 시 KMS API 호출 → <b>KMS 쿼터 스로틀링</b> 주의</td></tr>
            <tr><td><b>DSSE-KMS</b></td><td>KMS 키</td><td><Code>"aws:kms:dsse"</Code></td><td>KMS 기반 <b>이중(2겹) 암호화</b> — 2023년 추가, 시험 선지로 등장 가능</td></tr>
            <tr><td><b>SSE-C</b></td><td><b>고객이 외부에서 관리</b></td><td>키를 매 요청 헤더로 전달</td><td><b>HTTPS 필수</b>, S3는 키를 저장하지 않음, 읽을 때도 같은 키 제공 필요</td></tr>
            <tr><td><b>클라이언트 측</b></td><td>고객 (S3 밖)</td><td>—</td><td>업로드 전 암호화·다운로드 후 복호화 전 과정을 고객이 수행</td></tr>
          </tbody>
        </table></div>
        <KP><b>전송 중 암호화(SSL/TLS)</b>: HTTP·HTTPS 엔드포인트 모두 존재하지만 HTTPS 권장. <b>SSE-C는 HTTPS만 가능</b>.</KP>
        <KP>HTTPS 강제: 버킷 정책에서 <Code>aws:SecureTransport = false</Code>인 요청을 <b>Deny</b>.</KP>
        <KP>버킷 정책의 암호화 강제(<Code>x-amz-server-side-encryption</Code> 헤더 없는 PUT을 Deny)는 <b>기본 암호화 설정보다 먼저 평가</b>됩니다.</KP>
        <Exam>① "감사 추적 + 키 제어" → SSE-KMS ② "회사 외부에서 키를 완전 관리, AWS에 키 저장 금지" → SSE-C 또는 클라이언트 측 ③ "대량 업로드 시 KMS 스로틀링" → Service Quotas 상향 ④ 헤더 값 3종 구분.</Exam>
      </>
    ),
  },
  {
    id: "default-enc", no: "145", title: "S3 기본 암호화", freq: 3, group: "보안",
    body: (
      <>
        <KP>신규 버킷·객체에는 <b>SSE-S3가 자동(기본) 적용</b>됩니다.</KP>
        <KP>기본 암호화를 SSE-KMS 등으로 변경 가능. 헤더 없이 업로드하면 기본 설정이 적용됩니다.</KP>
        <KP>특정 방식을 <b>강제</b>하려면 버킷 정책으로 암호화 헤더가 없는/다른 PUT을 거부 — <b>버킷 정책은 항상 기본 암호화보다 먼저 평가</b>.</KP>
      </>
    ),
  },
  {
    id: "cors", no: "146", title: "S3 CORS", freq: 4, group: "보안",
    body: (
      <>
        <p>CORS(Cross-Origin Resource Sharing)는 <b>브라우저의 보안 메커니즘</b>으로, 웹페이지의 오리진과 다른 오리진의 자원 요청을 통제합니다. DVA에 반드시 나온다고 알려진 주제입니다.</p>
        <CorsDiagram />
        <KP>오리진 = <b>scheme(프로토콜) + host(도메인) + port</b>. 하나라도 다르면 교차 오리진.</KP>
        <KP>브라우저는 먼저 <b>preflight(OPTIONS) 요청</b>에 <Code>Origin</Code> 헤더를 담아 보내고, 서버가 <Code>Access-Control-Allow-Origin</Code>/<Code>-Methods</Code>로 허용해야 실제 요청을 보냅니다.</KP>
        <KP>허용 대상은 특정 오리진 하나 또는 <Code>*</Code>(전체). CORS 설정은 JSON으로 버킷에 등록합니다.</KP>
        <Exam><b>"요청을 받는 쪽 버킷에 CORS 헤더를 설정한다"</b>가 정답 포인트. 웹사이트 버킷 A가 버킷 B의 이미지를 fetch하면 CORS는 B에 설정합니다.</Exam>
      </>
    ),
  },
  {
    id: "mfa", no: "148", title: "S3 MFA Delete", freq: 2, group: "보안",
    body: (
      <>
        <MfaDiagram />
        <KP>MFA 필요 작업: <b>객체 버전 영구 삭제</b>, <b>버전 관리 중단</b>.</KP>
        <KP>MFA 불필요: 버전 관리 활성화, 삭제 마커 추가, 삭제된 버전 목록 조회.</KP>
        <KP>전제: 버전 관리 활성화 버킷 · <b>루트 계정만</b> 활성/비활성 가능 · 콘솔이 아닌 <b>CLI/SDK/API로만</b> 설정.</KP>
      </>
    ),
  },
  {
    id: "logs", no: "150", title: "S3 액세스 로그", freq: 2, group: "보안",
    body: (
      <>
        <p>감사 목적으로 버킷에 대한 <b>모든 요청(허용·거부 불문)</b>을 다른 S3 버킷에 파일로 기록합니다. Athena 등으로 분석할 수 있습니다.</p>
        <LogsDiagram />
        <KP>로깅 대상 버킷과 로깅 버킷은 <b>같은 리전</b>이어야 합니다.</KP>
        <Warn><b>로깅 버킷 = 모니터링 대상 버킷으로 설정 금지!</b> 로그가 로그를 만드는 무한 루프 → 스토리지 요금 폭증.</Warn>
      </>
    ),
  },
  {
    id: "presigned", no: "152", title: "미리 서명된 URL (Presigned URL)", freq: 5, group: "보안",
    body: (
      <>
        <p>버킷을 프라이빗으로 유지하면서 특정 객체에 대한 임시 접근을 부여하는 방법으로, <b>DVA 최빈출 주제</b>입니다.</p>
        <PresignedDiagram />
        <KP>URL을 받은 사람은 <b>URL을 생성한 사용자의 GET/PUT 권한을 상속</b>합니다.</KP>
        <KP>만료: 콘솔 생성 시 최대 <b>12시간</b>, CLI/SDK는 최대 <b>168시간(7일)</b>.</KP>
        <KP>사용 예: 프리미엄 동영상을 로그인 사용자에게만 제공 · 계속 바뀌는 사용자 목록에 URL을 동적으로 생성 · 특정 위치로의 임시 업로드 허용.</KP>
        <Exam>"버킷은 비공개 유지 + 특정 사용자에게 임시 다운로드/업로드 허용" → Presigned URL이 정답인 문제가 매우 자주 출제됩니다.</Exam>
      </>
    ),
  },
  {
    id: "accesspoint", no: "154", title: "S3 액세스 포인트", freq: 2, group: "보안",
    body: (
      <>
        <p>버킷 하나에 팀·용도별 접근 규칙이 늘어나 버킷 정책이 비대해질 때, <b>액세스 포인트별 정책</b>으로 보안 관리를 단순화합니다.</p>
        <AccessPointDiagram />
        <KP>각 액세스 포인트는 자체 <b>DNS 이름</b>과 <b>액세스 포인트 정책</b>(버킷 정책과 유사)을 가집니다.</KP>
        <KP>Origin 유형: 인터넷 또는 <b>VPC</b>. VPC Origin이면 <b>VPC 엔드포인트</b>를 만들어야만 접근 가능하며, 엔드포인트 정책에서 대상 버킷·AP 접근을 허용해야 합니다.</KP>
      </>
    ),
  },
  {
    id: "objectlambda", no: "155", title: "S3 Object Lambda", freq: 3, group: "보안",
    body: (
      <>
        <p>객체를 호출자에게 반환하기 <b>직전에 Lambda로 변환</b>하는 기능입니다. 변환본을 위한 별도 버킷 복제가 필요 없습니다.</p>
        <ObjectLambdaDiagram />
        <KP>구성: 원본 버킷 + <b>S3 액세스 포인트(지원 AP)</b> + <b>Object Lambda 액세스 포인트</b> + Lambda 함수.</KP>
        <KP>사용 예: 분석 환경용 <b>PII 마스킹/삭제</b> · XML→JSON 등 <b>포맷 변환</b> · 요청자별 <b>이미지 리사이즈·워터마크</b>.</KP>
        <Exam>"원본 하나만 두고 애플리케이션마다 다른 형태로 제공" → Object Lambda가 정답 키워드입니다.</Exam>
      </>
    ),
  },
];

const GROUPS = ["기초", "고급", "보안"];
const GROUP_QUIZ = { "기초": "퀴즈 8 · Amazon S3", "고급": "퀴즈 10 · S3 고급", "보안": "퀴즈 11 · S3 보안" };

/* ============================================================
   메인 앱
   ============================================================ */
export default function S3Guide() {
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const section = SECTIONS.find((s) => s.id === active);
  const idx = SECTIONS.indexOf(section);

  useEffect(() => {
    const el = document.getElementById("content-top");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  }, [active]);

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        .app {
          font-family: "Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",system-ui,sans-serif;
          display: flex; min-height: 100vh; background: ${C.paper}; color: ${C.ink};
          font-size: 15px; line-height: 1.7;
        }
        /* ---- 사이드바 ---- */
        .side {
          width: 268px; flex-shrink: 0; background: ${C.navy}; color: #C9D3E0;
          position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 22px 14px 30px;
        }
        .brand { padding: 0 10px 18px; border-bottom: 1px solid #2B3A52; margin-bottom: 14px; }
        .brand .cube { display:inline-flex; align-items:center; gap:9px; }
        .brand h1 { font-size: 17px; color: #fff; letter-spacing: -0.3px; }
        .brand p { font-size: 11.5px; color: #8A99AE; margin-top: 4px; }
        .grp { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: ${C.green};
          padding: 14px 10px 6px; text-transform: uppercase; }
        .grp small { color:#6E7E94; font-weight:600; letter-spacing:0; display:block; }
        .nav-btn {
          display: flex; align-items: baseline; gap: 8px; width: 100%; text-align: left;
          background: none; border: none; color: #C9D3E0; padding: 8px 10px; border-radius: 8px;
          font-size: 13.5px; cursor: pointer; font-family: inherit; line-height: 1.4;
        }
        .nav-btn:hover { background: ${C.navy2}; color: #fff; }
        .nav-btn.on { background: ${C.orange}; color: #fff; font-weight: 700; }
        .nav-btn .no { font-family: ui-monospace, monospace; font-size: 11px; color: #7C8CA3; flex-shrink:0; }
        .nav-btn.on .no { color: #FFE1C4; }
        .nav-btn .dots { margin-left:auto; font-size:9px; letter-spacing:1px; flex-shrink:0; }
        /* ---- 본문 ---- */
        .main { flex: 1; min-width: 0; }
        .topbar { display: none; }
        .content { max-width: 860px; margin: 0 auto; padding: 40px 34px 80px; }
        .crumb { font-size: 12px; font-weight: 700; letter-spacing: 1px; color: ${C.green}; text-transform: uppercase; }
        .head { display:flex; flex-wrap:wrap; align-items:center; gap:14px; margin: 8px 0 6px; }
        .head h2 { font-size: 27px; letter-spacing: -0.5px; }
        .head .lec { font-family: ui-monospace, monospace; font-size: 12px; background:#EDF0F4; color:${C.gray};
          padding: 3px 9px; border-radius: 99px; font-weight:700; }
        .freq { display:inline-flex; align-items:center; gap:7px; font-size: 11px; letter-spacing:2px;
          padding: 4px 11px; border-radius: 99px; }
        .freq b { font-size: 12px; letter-spacing:0; }
        .freq-note { font-size: 12px; color:${C.gray}; margin-bottom: 26px; }
        .body p { margin: 14px 0; }
        .body b { color: ${C.ink}; }
        /* ---- 블록 ---- */
        .kp { display:flex; gap:11px; background:#fff; border:1px solid ${C.line}; border-left: 4px solid ${C.green};
          border-radius: 10px; padding: 12px 16px; margin: 10px 0; font-size: 14px; }
        .kp-mark { color:${C.green}; font-weight:900; flex-shrink:0; }
        .warn { display:flex; gap:11px; background:#FDF6F4; border:1px solid #F3D2C8; border-left: 4px solid ${C.red};
          border-radius: 10px; padding: 12px 16px; margin: 10px 0; font-size: 14px; }
        .warn > span { color:${C.red}; font-weight:900; }
        .exam { display:flex; flex-direction:column; gap:7px; background:#FFF8EE; border:1px solid #F3DFC2;
          border-radius: 12px; padding: 15px 18px; margin: 20px 0 6px; font-size: 14px; }
        .exam-tag { align-self:flex-start; font-size: 11px; font-weight: 900; letter-spacing:1px; color:#fff;
          background:${C.orange}; padding: 3px 10px; border-radius: 99px; }
        .inline-code { font-family: ui-monospace, "SF Mono", monospace; font-size: 12.5px; background: #EDF0F4;
          color: #B0410F; padding: 2px 6px; border-radius: 5px; white-space: nowrap; }
        /* ---- 다이어그램 ---- */
        .diagram { background: #fff; border: 1px solid ${C.line}; border-radius: 14px;
          padding: 18px 16px 10px; margin: 20px 0; }
        .diagram figcaption { font-size: 12px; color: ${C.gray}; padding: 10px 6px 6px; border-top: 1px dashed ${C.line}; margin-top: 8px; }
        /* ---- 테이블 ---- */
        .table-wrap { overflow-x: auto; margin: 18px 0; }
        table { border-collapse: collapse; width: 100%; font-size: 13px; background:#fff;
          border: 1px solid ${C.line}; border-radius: 12px; overflow: hidden; }
        th { background: ${C.ink}; color: #fff; text-align: left; padding: 9px 12px; font-size: 12.5px; white-space:nowrap; }
        td { padding: 9px 12px; border-top: 1px solid ${C.line}; vertical-align: top; }
        tr:nth-child(even) td { background: #FAFBFC; }
        .table-note { font-size: 12px; color:${C.gray}; margin-top: 7px; }
        /* ---- 이전/다음 ---- */
        .pager { display:flex; justify-content: space-between; gap: 12px; margin-top: 44px; }
        .pager button { flex:1; background:#fff; border:1.5px solid ${C.line}; border-radius: 12px; padding: 13px 16px;
          cursor: pointer; font-family: inherit; text-align:left; font-size: 13px; color:${C.ink}; }
        .pager button:hover { border-color: ${C.orange}; }
        .pager button:disabled { opacity: 0.35; cursor: default; }
        .pager button:disabled:hover { border-color: ${C.line}; }
        .pager .dir { font-size: 11px; color:${C.gray}; font-weight:700; letter-spacing:1px; display:block; margin-bottom:3px; }
        .pager .next { text-align: right; }
        .quiz-flag { margin-top: 28px; background:${C.navy}; color:#DCE4EF; border-radius: 12px; padding: 14px 18px;
          font-size: 13px; display:flex; gap:10px; align-items:center; }
        .quiz-flag b { color:${C.yellow}; }
        /* ---- 모바일 ---- */
        @media (max-width: 840px) {
          .side { position: fixed; z-index: 40; left: 0; transform: translateX(-100%); transition: transform .22s; width: 280px; }
          .side.open { transform: translateX(0); box-shadow: 0 0 0 100vmax rgba(10,15,25,.45); }
          .topbar { display:flex; align-items:center; gap: 12px; position: sticky; top:0; z-index: 30;
            background:${C.navy}; color:#fff; padding: 12px 16px; }
          .topbar button { background:${C.navy2}; color:#fff; border:none; border-radius:8px; padding: 7px 12px;
            font-size:13px; font-family:inherit; cursor:pointer; }
          .topbar span { font-size: 14px; font-weight: 700; }
          .content { padding: 26px 18px 60px; }
          .head h2 { font-size: 22px; }
        }
        button:focus-visible, .nav-btn:focus-visible { outline: 2px solid ${C.orange}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .side { transition: none; } }
      `}</style>

      {/* 사이드바 */}
      <nav className={`side ${menuOpen ? "open" : ""}`} aria-label="강의 목차">
        <div className="brand">
          <div className="cube">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <path d="M13 2 L23 7 V19 L13 24 L3 19 V7 Z" fill={C.green} />
              <path d="M13 2 L23 7 L13 12 L3 7 Z" fill="#9CC24A" />
              <path d="M13 12 V24 L3 19 V7 Z" fill={C.greenDk} />
            </svg>
            <h1>Amazon S3 정복</h1>
          </div>
          <p>AWS DVA-C02 · 이론 강의 {SECTIONS.length}개 · 실습 제외</p>
        </div>
        {GROUPS.map((g) => (
          <div key={g}>
            <div className="grp">{g}<small>{GROUP_QUIZ[g]} 범위</small></div>
            {SECTIONS.filter((s) => s.group === g).map((s) => (
              <button key={s.id} className={`nav-btn ${active === s.id ? "on" : ""}`}
                onClick={() => { setActive(s.id); setMenuOpen(false); }}>
                <span className="no">{s.no}</span>
                <span>{s.title}</span>
                <span className="dots" style={{ color: active === s.id ? "#FFE1C4" : s.freq >= 5 ? "#FF8A65" : s.freq >= 4 ? "#F2B807" : "#5B6B82" }}>
                  {"●".repeat(s.freq)}
                </span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* 본문 */}
      <div className="main">
        <div className="topbar">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="목차 열기">☰ 목차</button>
          <span>S3 · {section.title}</span>
        </div>
        <main className="content" id="content-top">
          <div className="crumb">{section.group} · {GROUP_QUIZ[section.group]}</div>
          <div className="head">
            <span className="lec">강의 {section.no}</span>
            <h2>{section.title}</h2>
            <FreqBadge level={section.freq} />
          </div>
          <p className="freq-note">출제 빈도는 DVA-C02 기출 경향·수험 커뮤니티 기반 추정치입니다 (●5 = 거의 매 시험, ●2 = 간헐적).</p>
          <div className="body">{section.body}</div>

          {SECTIONS.filter((s) => s.group === section.group).slice(-1)[0].id === section.id && (
            <div className="quiz-flag">📝 여기까지가 <b>{GROUP_QUIZ[section.group]} 퀴즈</b> 범위입니다. 퀴즈 전에 이 그룹의 "시험 포인트"만 다시 훑어보세요.</div>
          )}

          <div className="pager">
            <button disabled={idx === 0} onClick={() => setActive(SECTIONS[idx - 1]?.id)}>
              <span className="dir">← 이전</span>{idx > 0 ? SECTIONS[idx - 1].title : "—"}
            </button>
            <button className="next" disabled={idx === SECTIONS.length - 1} onClick={() => setActive(SECTIONS[idx + 1]?.id)}>
              <span className="dir">다음 →</span>{idx < SECTIONS.length - 1 ? SECTIONS[idx + 1].title : "—"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
