//fable 5 max
import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   AWS DVA-C02 · 섹션 27 「보안 및 암호화」 학습 가이드
   팔레트: AWS 콘솔 vernacular (Squid Ink + AWS Orange)
   ───────────────────────────────────────────── */
const C = {
  ink: "#161E2D",
  ink2: "#2C3A4F",
  paper: "#F6F4EF",
  card: "#FFFFFF",
  line: "#DDD6C7",
  orange: "#EC7211",
  orangeSoft: "#FDEBD9",
  teal: "#0E7C7B",
  tealSoft: "#E2F1F0",
  red: "#BF3B2B",
  redSoft: "#FBE7E3",
  gold: "#B7791F",
  sub: "#5C6675",
  codeBg: "#101826",
};

/* ── 빈출도 배지 ─────────────────────────────── */
function Freq({ level, note }) {
  const labels = ["", "낮음", "낮음~중간", "중간", "높음", "매우 높음"];
  const color = level >= 5 ? C.red : level >= 4 ? C.orange : level >= 3 ? C.gold : C.sub;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className="text-xs font-bold tracking-wide px-2 py-1 rounded"
        style={{ background: level >= 4 ? C.redSoft : level >= 3 ? C.orangeSoft : "#EEEBE2", color }}
      >
        시험 빈출도
      </span>
      <span className="flex gap-1" aria-label={`빈출도 ${level}/5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="inline-block rounded-sm"
            style={{ width: 16, height: 8, background: i <= level ? color : "#E6E1D3" }}
          />
        ))}
      </span>
      <span className="text-xs font-semibold" style={{ color }}>{labels[level]}</span>
      {note && <span className="text-xs" style={{ color: C.sub }}>· {note}</span>}
    </div>
  );
}

/* ── 텍스트 빌딩블록 ──────────────────────────── */
const Code = ({ children }) => (
  <code
    className="px-1.5 py-0.5 rounded text-sm font-mono"
    style={{ background: "#ECE8DD", color: "#8A3C00" }}
  >
    {children}
  </code>
);

const CodeBlock = ({ children }) => (
  <pre
    className="rounded-lg p-4 text-sm font-mono overflow-x-auto my-3 leading-relaxed"
    style={{ background: C.codeBg, color: "#E8EDF5" }}
  >
    {children}
  </pre>
);

const P = ({ children }) => (
  <p className="my-3 leading-relaxed" style={{ color: C.ink2 }}>{children}</p>
);

const Ul = ({ items }) => (
  <ul className="my-3 space-y-2">
    {items.map((it, i) => (
      <li key={i} className="flex gap-2 leading-relaxed" style={{ color: C.ink2 }}>
        <span className="mt-2 shrink-0 rounded-full" style={{ width: 6, height: 6, background: C.orange }} />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const H3 = ({ children }) => (
  <h3 className="mt-7 mb-2 text-lg font-bold" style={{ color: C.ink }}>{children}</h3>
);

function Callout({ type = "exam", title, children }) {
  const conf = {
    exam: { bg: C.redSoft, bar: C.red, label: title || "시험 포인트" },
    tip: { bg: C.tealSoft, bar: C.teal, label: title || "핵심 개념" },
    warn: { bg: C.orangeSoft, bar: C.orange, label: title || "주의" },
  }[type];
  return (
    <div className="my-4 rounded-lg overflow-hidden flex" style={{ background: conf.bg }}>
      <div style={{ width: 5, background: conf.bar }} />
      <div className="p-4 flex-1">
        <div className="text-xs font-bold tracking-wide mb-1" style={{ color: conf.bar }}>{conf.label}</div>
        <div className="text-sm leading-relaxed" style={{ color: C.ink }}>{children}</div>
      </div>
    </div>
  );
}

function Table({ head, rows, firstColStrong = true }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg" style={{ border: `1px solid ${C.line}` }}>
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: C.ink, color: "#FFF" }}>
            {head.map((h, i) => (
              <th key={i} className="text-left px-4 py-2.5 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? "#FAF8F2" : C.card, borderTop: `1px solid ${C.line}` }}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-4 py-2.5 align-top leading-relaxed ${j === 0 && firstColStrong ? "font-semibold" : ""}`}
                  style={{ color: j === 0 && firstColStrong ? C.ink : C.ink2 }}
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

/* ── SVG 다이어그램 헬퍼 ──────────────────────── */
const Defs = ({ id }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={C.ink2} />
    </marker>
    <marker id={id + "o"} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill={C.orange} />
    </marker>
  </defs>
);

const Box = ({ x, y, w, h, title, sub, fill = C.card, stroke = C.ink2, dashed, titleFill }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dashed ? "5 4" : "0"} />
    <text x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 5)} textAnchor="middle" fontSize="13" fontWeight="700" fill={titleFill || C.ink}>{title}</text>
    {sub && (
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize="11" fill={C.sub}>{sub}</text>
    )}
  </g>
);

const Arr = ({ p, label, label2, mid, dy = -8, orange, dashed }) => {
  const stroke = orange ? C.orange : C.ink2;
  return (
    <g>
      <path d={p} fill="none" stroke={stroke} strokeWidth="1.8" strokeDasharray={dashed ? "6 4" : "0"} markerEnd={`url(#${orange ? "arrHeado" : "arrHead"})`} />
      {label && (
        <text x={mid[0]} y={mid[1] + dy} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={stroke}>{label}</text>
      )}
      {label2 && (
        <text x={mid[0]} y={mid[1] + dy + 13} textAnchor="middle" fontSize="11" fill={C.sub}>{label2}</text>
      )}
    </g>
  );
};

const Lock = ({ x, y, s = 1, color = C.orange }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x="-7" y="-2" width="14" height="11" rx="2" fill={color} />
    <path d="M -4 -2 v -3 a 4 4 0 0 1 8 0 v 3" fill="none" stroke={color} strokeWidth="2.2" />
  </g>
);

const Diagram = ({ children, vb, caption, minW = 640 }) => (
  <figure className="my-5">
    <div className="rounded-xl p-3 overflow-x-auto" style={{ background: "#FCFAF5", border: `1px solid ${C.line}` }}>
      <svg viewBox={vb} className="w-full h-auto" style={{ minWidth: minW }} xmlns="http://www.w3.org/2000/svg" role="img">
        <Defs id="arrHead" />
        {children}
      </svg>
    </div>
    {caption && (
      <figcaption className="text-xs mt-2 text-center" style={{ color: C.sub }}>{caption}</figcaption>
    )}
  </figure>
);

/* ── 다이어그램 1: 암호화 3가지 방식 ───────────── */
function DiagEncryption101() {
  return (
    <Diagram vb="0 0 760 330" caption="암호화 101 — 전송 중 · 서버 측(저장 시) · 클라이언트 측 암호화 비교">
      {/* 전송 중 */}
      <text x="14" y="26" fontSize="13" fontWeight="800" fill={C.ink}>① 전송 중 암호화 (TLS / SSL)</text>
      <Box x={20} y={40} w={130} h={52} title="클라이언트" sub="브라우저 / 앱" />
      <Box x={610} y={40} w={130} h={52} title="서버" sub="HTTPS 엔드포인트" />
      <Arr p="M 152 66 H 608" mid={[380, 66]} label="🔒 HTTPS (TLS 암호화 터널)" label2="중간자(MITM) 공격 방어 · 서버는 TLS 인증서 보유" orange />
      {/* 서버측 */}
      <text x="14" y="140" fontSize="13" fontWeight="800" fill={C.ink}>② 서버 측 암호화 (저장 시 · At Rest)</text>
      <Box x={20} y={154} w={130} h={52} title="클라이언트" sub="평문 전송(HTTP S)" />
      <Box x={330} y={154} w={180} h={52} title="AWS 서비스 (예: S3)" sub="수신 후 암호화하여 저장" />
      <Box x={610} y={154} w={130} h={52} title="데이터 키" sub="서비스가 관리" fill={C.orangeSoft} stroke={C.orange} />
      <Arr p="M 152 180 H 328" mid={[240, 180]} label="객체 전송" />
      <Arr p="M 512 180 H 608" mid={[560, 180]} label="암·복호화" orange />
      <Lock x={420} y={148} />
      {/* 클라이언트측 */}
      <text x="14" y="252" fontSize="13" fontWeight="800" fill={C.ink}>③ 클라이언트 측 암호화</text>
      <Box x={20} y={266} w={180} h={52} title="클라이언트가 직접 암호화" sub="봉투 암호화 기법 활용" fill={C.orangeSoft} stroke={C.orange} />
      <Box x={330} y={266} w={180} h={52} title="저장소 (S3 등)" sub="암호문만 보관" dashed />
      <Arr p="M 202 292 H 328" mid={[265, 292]} label="암호문 업로드" />
      <text x="530" y="286" fontSize="11.5" fontWeight="600" fill={C.red}>서버는 절대 데이터를</text>
      <text x="530" y="301" fontSize="11.5" fontWeight="600" fill={C.red}>복호화할 수 없어야 함</text>
      <Lock x={100} y={260} />
    </Diagram>
  );
}

/* ── 다이어그램 2: 리전 간 스냅샷 재암호화 ─────── */
function DiagCrossRegion() {
  return (
    <Diagram vb="0 0 760 190" caption="KMS 키는 리전에 종속 — 암호화된 스냅샷을 다른 리전으로 복사하면 대상 리전의 KMS 키로 재암호화된다">
      <rect x="14" y="20" width="340" height="150" rx="10" fill="none" stroke={C.teal} strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="30" y="42" fontSize="12" fontWeight="800" fill={C.teal}>리전 A (eu-west-2)</text>
      <rect x="406" y="20" width="340" height="150" rx="10" fill="none" stroke={C.teal} strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="422" y="42" fontSize="12" fontWeight="800" fill={C.teal}>리전 B (ap-southeast-2)</text>
      <Box x={36} y={58} w={140} h={50} title="EBS 볼륨" sub="KMS Key A로 암호화" />
      <Box x={200} y={58} w={130} h={50} title="스냅샷" sub="Key A로 암호화" fill={C.orangeSoft} stroke={C.orange} />
      <Box x={428} y={58} w={140} h={50} title="스냅샷 사본" sub="Key B로 재암호화" fill={C.orangeSoft} stroke={C.orange} />
      <Box x={592} y={58} w={134} h={50} title="EBS 볼륨 복원" sub="리전 B" />
      <Arr p="M 178 83 H 198" mid={[188, 83]} />
      <Arr p="M 332 83 H 426" mid={[380, 83]} label="복사 + 재암호화" orange />
      <Arr p="M 570 83 H 590" mid={[580, 83]} />
      <text x="120" y="150" fontSize="11.5" fill={C.sub}>KMS Key A (리전 A 전용)</text>
      <text x="500" y="150" fontSize="11.5" fill={C.sub}>KMS Key B (리전 B 전용)</text>
      <Lock x={100} y={136} s={0.8} />
      <Lock x={480} y={136} s={0.8} />
    </Diagram>
  );
}

/* ── 다이어그램 3: Encrypt API (≤4KB) ─────────── */
function DiagEncryptApi() {
  return (
    <Diagram vb="0 0 760 210" caption="KMS Encrypt / Decrypt API — 데이터가 KMS로 전송되므로 4KB 이하만 가능">
      <Box x={20} y={30} w={170} h={56} title="클라이언트" sub="시크릿 ≤ 4KB (평문)" />
      <rect x={330} y={16} width={190} height={178} rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="425" y="40" fontSize="13" fontWeight="800" fill={C.teal} textAnchor="middle">AWS KMS</text>
      <Box x={352} y={54} w={146} h={48} title="KMS Key" sub="키는 절대 외부 유출 X" fill="#FFF" stroke={C.teal} />
      <text x="425" y="128" fontSize="11" fill={C.sub} textAnchor="middle">IAM 권한 확인 후</text>
      <text x="425" y="143" fontSize="11" fill={C.sub} textAnchor="middle">암호화/복호화 수행</text>
      <Box x={590} y={30} w={150} h={56} title="암호문" sub="DB·환경변수에 저장" fill={C.orangeSoft} stroke={C.orange} />
      <Arr p="M 192 58 H 328" mid={[260, 50]} label="Encrypt API" label2="평문 전송" orange />
      <Arr p="M 522 58 H 588" mid={[555, 50]} label="암호문 반환" />
      <Arr p="M 588 150 H 192" mid={[390, 176]} dy={16} label="Decrypt API로 복호화 (역방향)" dashed />
      <path d="M 522 150 H 588" fill="none" stroke="none" />
      <Lock x={655} y={22} s={0.9} />
    </Diagram>
  );
}

/* ── 다이어그램 4: 봉투 암호화 ─────────────────── */
function DiagEnvelope() {
  return (
    <Diagram vb="0 0 760 430" caption="봉투 암호화(Envelope Encryption) — GenerateDataKey로 암호화, Decrypt로 데이터 키 복원">
      {/* 암호화 측 */}
      <text x="14" y="24" fontSize="13" fontWeight="800" fill={C.ink}>암호화: GenerateDataKey API</text>
      <Box x={20} y={40} w={190} h={56} title="클라이언트" sub="대용량 파일 (> 4KB)" />
      <Box x={550} y={40} w={190} h={56} title="AWS KMS" sub="KMS Key로 DEK 생성" fill={C.tealSoft} stroke={C.teal} />
      <Arr p="M 212 58 H 548" mid={[380, 50]} label="① GenerateDataKey 호출" orange />
      <Arr p="M 548 82 H 212" mid={[380, 104]} dy={0} label="② 평문 DEK + 암호화된 DEK 반환" />
      <Box x={20} y={140} w={190} h={54} title="평문 데이터 키 (DEK)" sub="클라이언트 측에서만 사용" fill="#FFF" stroke={C.gold} />
      <Box x={20} y={210} w={190} h={54} title="③ 로컬에서 파일 암호화" sub="DEK로 클라이언트가 직접" fill={C.orangeSoft} stroke={C.orange} />
      <Arr p="M 115 196 V 208" mid={[115, 202]} />
      {/* 최종 봉투 */}
      <rect x={300} y={150} width={220} height={130} rx="10" fill="#FFF" stroke={C.ink} strokeWidth="1.8" />
      <text x="410" y="174" fontSize="12.5" fontWeight="800" fill={C.ink} textAnchor="middle">최종 저장물 = “봉투”</text>
      <rect x={318} y={186} width={184} height={36} rx="6" fill={C.orangeSoft} stroke={C.orange} strokeWidth="1.3" />
      <text x="410" y="208" fontSize="11.5" fontWeight="600" fill={C.ink} textAnchor="middle">암호화된 파일</text>
      <rect x={318} y={230} width={184} height={36} rx="6" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.3" />
      <text x="410" y="252" fontSize="11.5" fontWeight="600" fill={C.ink} textAnchor="middle">암호화된 데이터 키 (함께 보관)</text>
      <Arr p="M 212 237 H 298" mid={[255, 229]} label="④ 함께 저장" />
      <Lock x={500} y={144} s={0.9} />
      {/* 복호화 측 */}
      <text x="14" y="318" fontSize="13" fontWeight="800" fill={C.ink}>복호화: Decrypt API (암호화된 DEK만 전송, 파일은 전송 안 함)</text>
      <Box x={20} y={334} w={190} h={54} title="암호화된 DEK" sub="봉투에서 꺼냄 (≤ 4KB)" fill={C.tealSoft} stroke={C.teal} />
      <Box x={300} y={334} w={190} h={54} title="AWS KMS" sub="Decrypt API" fill={C.tealSoft} stroke={C.teal} />
      <Box x={550} y={334} w={190} h={54} title="평문 DEK → 파일 복호화" sub="로컬에서 수행" fill={C.orangeSoft} stroke={C.orange} />
      <Arr p="M 212 361 H 298" mid={[255, 353]} label="① 전송" orange />
      <Arr p="M 492 361 H 548" mid={[520, 353]} label="② 반환" />
    </Diagram>
  );
}

/* ── 다이어그램 5: S3 버킷 키 ──────────────────── */
function DiagBucketKey() {
  return (
    <Diagram vb="0 0 760 250" caption="S3 버킷 키 — KMS 호출을 버킷 수준 키 1회 생성으로 줄여 SSE-KMS 비용을 최대 99% 절감">
      <Box x={20} y={90} w={160} h={56} title="AWS KMS" sub="고객 KMS Key" fill={C.tealSoft} stroke={C.teal} />
      <Box x={280} y={90} w={190} h={56} title="S3 버킷 키" sub="버킷 수준 · 주기적 생성" fill={C.orangeSoft} stroke={C.orange} />
      <Arr p="M 182 118 H 278" mid={[230, 110]} label="KMS 호출 (드묾)" orange />
      <Box x={580} y={20} w={160} h={48} title="데이터 키 1" sub="객체 A 암호화" />
      <Box x={580} y={100} w={160} h={48} title="데이터 키 2" sub="객체 B 암호화" />
      <Box x={580} y={180} w={160} h={48} title="데이터 키 3" sub="객체 C 암호화" />
      <Arr p="M 472 104 C 520 80 540 60 578 46" mid={[520, 60]} />
      <Arr p="M 472 118 H 578" mid={[525, 112]} label="S3 내부에서 파생" />
      <Arr p="M 472 132 C 520 160 540 184 578 202" mid={[520, 186]} />
      <text x="100" y="190" fontSize="11.5" fill={C.sub}>효과: KMS API 호출·비용 ↓</text>
      <text x="100" y="206" fontSize="11.5" fill={C.sub}>CloudTrail의 KMS 이벤트 ↓</text>
    </Diagram>
  );
}

/* ── 다이어그램 6: Secrets Manager 로테이션 ───── */
function DiagRotation() {
  return (
    <Diagram vb="0 0 760 220" caption="Secrets Manager 자동 로테이션 — Lambda가 새 시크릿을 생성해 DB와 시크릿을 동시에 갱신">
      <Box x={20} y={80} w={190} h={60} title="Secrets Manager" sub="X일마다 로테이션 트리거" fill={C.tealSoft} stroke={C.teal} />
      <Box x={300} y={80} w={180} h={60} title="로테이션 Lambda" sub="AWS 제공 템플릿 or 커스텀" fill={C.orangeSoft} stroke={C.orange} />
      <Box x={580} y={80} w={160} h={60} title="Amazon RDS" sub="MySQL·PostgreSQL 등" />
      <Arr p="M 212 100 H 298" mid={[255, 92]} label="① 호출" orange />
      <Arr p="M 482 100 H 578" mid={[530, 92]} label="② 새 암호 설정" orange />
      <Arr p="M 390 142 C 390 180 250 185 214 150" mid={[300, 190]} dy={0} label="③ 새 시크릿 저장" />
      <Box x={300} y={16} w={180} h={44} title="애플리케이션" sub="GetSecretValue로 항상 최신값" dashed />
      <Arr p="M 210 84 C 240 50 270 42 298 40" mid={[240, 44]} />
      <Lock x={110} y={70} s={0.85} />
    </Diagram>
  );
}

/* ── 다이어그램 7: Nitro Enclaves ─────────────── */
function DiagNitro() {
  return (
    <Diagram vb="0 0 760 230" caption="AWS Nitro Enclaves — EC2 인스턴스 내부의 완전 격리 VM, vsock 로컬 채널로만 통신">
      <rect x={40} y={24} width={560} height={186} rx="12" fill="#FFF" stroke={C.ink} strokeWidth="1.8" />
      <text x="60" y="50" fontSize="13" fontWeight="800" fill={C.ink}>EC2 인스턴스 (EnclaveOptions: true)</text>
      <Box x={64} y={70} w={200} h={110} title="부모 인스턴스" sub="일반 애플리케이션" />
      <rect x={340} y={70} width={230} height={110} rx="10" fill={C.redSoft} stroke={C.red} strokeWidth="1.8" strokeDasharray="7 4" />
      <text x="455" y="100" fontSize="12.5" fontWeight="800" fill={C.red} textAnchor="middle">Nitro Enclave</text>
      <text x="455" y="122" fontSize="11" fill={C.ink2} textAnchor="middle">✕ 영구 스토리지 없음</text>
      <text x="455" y="139" fontSize="11" fill={C.ink2} textAnchor="middle">✕ 외부 네트워크 없음</text>
      <text x="455" y="156" fontSize="11" fill={C.ink2} textAnchor="middle">✕ SSH 등 대화형 접근 없음</text>
      <Arr p="M 266 125 H 338" mid={[302, 117]} label="vsock 채널" orange />
      <Box x={630} y={80} w={110} h={90} title="AWS KMS" sub="암호화 증명으로 Enclave만 키 사용 허용" fill={C.tealSoft} stroke={C.teal} />
      <Arr p="M 572 125 H 628" mid={[600, 117]} dashed />
      <text x="60" y="200" fontSize="11" fill={C.sub}>nitro-cli로 EIF(Enclave Image File) 생성 → Enclave 기동</text>
    </Diagram>
  );
}

/* ── 다이어그램 8: SSM 계층 구조 ──────────────── */
function DiagSsmTree() {
  const rows = [
    { d: 0, t: "/my-department/", c: C.ink },
    { d: 1, t: "my-app/", c: C.ink },
    { d: 2, t: "dev/", c: C.teal },
    { d: 3, t: "db-url          ← GetParameters", c: C.ink2 },
    { d: 3, t: "db-password     ← (SecureString)", c: C.ink2 },
    { d: 2, t: "prod/           ← GetParametersByPath (재귀 조회 가능)", c: C.teal },
    { d: 3, t: "db-url", c: C.ink2 },
    { d: 3, t: "db-password", c: C.ink2 },
    { d: 1, t: "other-app/", c: C.ink },
    { d: 0, t: "/other-department/", c: C.ink },
    { d: 0, t: "/aws/reference/secretsmanager/my-secret-id   ← Secrets Manager 시크릿 참조", c: C.red },
    { d: 0, t: "/aws/service/ami-amazon-linux-latest/…       ← AWS 공개 파라미터 (최신 AMI)", c: C.gold },
  ];
  return (
    <div className="my-4 rounded-lg p-4 font-mono text-sm leading-7 overflow-x-auto" style={{ background: C.codeBg }}>
      {rows.map((r, i) => (
        <div key={i} style={{ paddingLeft: r.d * 24, color: r.c === C.ink2 ? "#C9D3E0" : r.c === C.ink ? "#FFFFFF" : r.c === C.teal ? "#5CD6C0" : r.c === C.red ? "#FF9A8A" : "#F0C36D", whiteSpace: "pre" }}>
          {r.d > 0 ? "└─ " : ""}{r.t}
        </div>
      ))}
    </div>
  );
}

/* ── 섹션 데이터 (목차) ───────────────────────── */
const SECTIONS = [
  { id: "enc101", no: "01", title: "암호화 101", freq: 2 },
  { id: "kms", no: "02", title: "KMS 개요", freq: 5 },
  { id: "keypolicy", no: "03", title: "KMS 키 정책 & IAM", freq: 3 },
  { id: "envelope", no: "04", title: "봉투 암호화 & 암호화 패턴", freq: 5 },
  { id: "limits", no: "05", title: "KMS 한도 (쿼터·스로틀링)", freq: 4 },
  { id: "bucketkey", no: "06", title: "S3 버킷 키", freq: 3 },
  { id: "hsm", no: "07", title: "CloudHSM", freq: 2 },
  { id: "ssm", no: "08", title: "SSM 파라미터 스토어", freq: 4 },
  { id: "secrets", no: "09", title: "Secrets Manager", freq: 4 },
  { id: "compare", no: "10", title: "SSM vs Secrets Manager", freq: 5 },
  { id: "cfn", no: "11", title: "CloudFormation 통합", freq: 3 },
  { id: "cwlogs", no: "12", title: "CloudWatch 로그 암호화", freq: 2 },
  { id: "codebuild", no: "13", title: "CodeBuild 보안", freq: 3 },
  { id: "nitro", no: "14", title: "Nitro Enclaves", freq: 2 },
];

function Section({ id, no, title, freq, freqNote, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-14">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-mono text-sm font-bold" style={{ color: C.orange }}>{no}</span>
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: C.ink }}>{title}</h2>
      </div>
      <Freq level={freq} note={freqNote} />
      <div className="mt-4">{children}</div>
      <div className="mt-10" style={{ borderBottom: `1px solid ${C.line}` }} />
    </section>
  );
}

/* ── 메인 앱 ─────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("enc101");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: C.paper, fontFamily: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif" }}>
      {/* ── 헤더 ── */}
      <header className="px-6 py-10 md:py-14" style={{ background: C.ink }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-bold tracking-widest mb-3" style={{ color: C.orange }}>
            AWS CERTIFIED DEVELOPER – ASSOCIATE (DVA-C02) · 섹션 27
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            AWS 보안 및 암호화
            <span className="block mt-2 text-lg md:text-xl font-semibold" style={{ color: "#9AA7B8" }}>
              KMS · 봉투 암호화 · SSM Parameter Store · Secrets Manager · CloudHSM · Nitro Enclaves
            </span>
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              ["최다 빈출", "봉투 암호화 · KMS · SSM vs Secrets Manager", C.red],
              ["시험 비중", "DVA 전체 문제의 약 10~15%가 이 섹션과 직·간접 관련", C.orange],
              ["학습 팁", "“어떤 상황에 어떤 서비스?” 시나리오 판단이 핵심", C.teal],
            ].map(([k, v, col], i) => (
              <div key={i} className="rounded-lg px-4 py-2.5 text-sm" style={{ background: "#1F2B3D" }}>
                <span className="font-bold mr-2" style={{ color: col }}>{k}</span>
                <span style={{ color: "#C9D3E0" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex gap-8">
        {/* ── 사이드 목차 ── */}
        <nav className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <div className="text-xs font-bold tracking-widest mb-3" style={{ color: C.sub }}>목차 · 빈출도</div>
            <ul className="space-y-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => go(s.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between gap-2 transition-colors"
                    style={{
                      background: active === s.id ? C.orangeSoft : "transparent",
                      color: active === s.id ? "#8A3C00" : C.ink2,
                      fontWeight: active === s.id ? 700 : 500,
                    }}
                  >
                    <span className="truncate">{s.no}. {s.title}</span>
                    <span className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="rounded-sm" style={{ width: 5, height: 10, background: i <= s.freq ? (s.freq >= 5 ? C.red : s.freq >= 4 ? C.orange : s.freq >= 3 ? C.gold : "#9AA3AF") : "#E6E1D3" }} />
                      ))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 text-xs leading-relaxed" style={{ borderTop: `1px solid ${C.line}`, color: C.sub }}>
              빈출도는 강의 강조도와 최근 DVA-C02 출제 경향을 종합한 추정치입니다.
            </div>
          </div>
        </nav>

        {/* ── 본문 ── */}
        <main className="flex-1 min-w-0">

          {/* 01 암호화 101 */}
          <Section id="enc101" no="01" title="암호화 101" freq={2} freqNote="직접 출제는 적지만 모든 문제의 전제 지식">
            <P>
              AWS의 모든 보안 문제는 <b>“데이터가 어디에 있을 때, 누가, 어떤 키로 암호화하는가”</b>라는 질문으로 환원됩니다.
              암호화는 위치와 주체에 따라 세 가지로 나뉩니다.
            </P>
            <DiagEncryption101 />
            <H3>① 전송 중 암호화 (Encryption in flight — TLS/SSL)</H3>
            <Ul items={[
              <>데이터가 네트워크를 이동하는 동안 암호화. 전송 전에 암호화되고 도착 후 복호화됩니다.</>,
              <>서버에 <b>TLS 인증서</b>가 있어야 하며(HTTPS), 중간자 공격(MITM)을 방어합니다.</>,
              <>SSL은 TLS의 옛 이름 — 시험에서는 사실상 같은 의미로 취급합니다.</>,
            ]} />
            <H3>② 서버 측 암호화 (Server-Side, 저장 시)</H3>
            <Ul items={[
              <>서버가 데이터를 <b>수신한 뒤</b> 암호화해 저장하고, 클라이언트에 반환하기 <b>직전에</b> 복호화합니다.</>,
              <>암·복호화에 쓰는 <b>데이터 키</b>가 필요하며, 서버가 키에 접근할 수 있어야 하므로 키 관리 서비스(KMS)가 필요합니다.</>,
              <>S3의 SSE(Server-Side Encryption)가 대표적인 예입니다.</>,
            ]} />
            <H3>③ 클라이언트 측 암호화</H3>
            <Ul items={[
              <>클라이언트가 데이터를 <b>직접 암호화한 뒤</b> 서버에 올립니다. 서버는 암호문만 보관하며 <b>절대 복호화할 수 없어야</b> 합니다.</>,
              <>복호화도 수신 클라이언트에서만 수행 — 뒤에 나오는 <b>봉투 암호화</b>가 이를 구현하는 표준 기법입니다.</>,
            ]} />
          </Section>

          {/* 02 KMS */}
          <Section id="kms" no="02" title="KMS (Key Management Service) 개요" freq={5} freqNote="이 섹션의 중심 — 거의 매 시험 등장">
            <P>
              “AWS에서 암호화”라는 말이 나오면 십중팔구 <b>KMS</b>입니다. AWS가 키를 대신 관리해 주며,
              권한은 <b>IAM과 완전히 통합</b>되고 모든 키 사용은 <b>CloudTrail</b>로 감사할 수 있습니다.
              EBS, S3, RDS, SSM 등 대부분의 서비스에 밀접하게 통합되어 있습니다.
            </P>
            <Callout type="exam">
              시크릿(비밀번호, API 키 등)을 코드나 평문 환경변수에 <b>절대 저장하지 마세요.</b> KMS API로 암호화해 환경변수/코드에 넣거나,
              SSM Parameter Store·Secrets Manager를 사용하는 것이 시험의 정답 패턴입니다.
            </Callout>
            <H3>KMS 키 유형: 대칭 vs 비대칭</H3>
            <Table
              head={["구분", "대칭 (Symmetric)", "비대칭 (Asymmetric)"]}
              rows={[
                ["알고리즘", "AES-256 · 단일 키로 암·복호화", "RSA / ECC · 공개키 + 개인키 쌍"],
                ["용도", "KMS와 통합된 AWS 서비스의 기본, 봉투 암호화", "암·복호화 또는 서명/검증(Sign/Verify)"],
                ["키 접근", "키 자체를 절대 열람 불가 — 반드시 KMS API 경유", "공개키는 다운로드 가능, 개인키는 열람 불가"],
                ["대표 시나리오", "S3 SSE-KMS, EBS 암호화 등 대부분", "KMS API를 호출할 수 없는 외부 사용자가 AWS 밖에서 암호화"],
              ]}
            />
            <H3>키 소유·관리 주체 3종 (+ 비용)</H3>
            <Table
              head={["키 종류", "설명", "비용"]}
              rows={[
                ["AWS 소유 키 (Owned)", <>AWS가 소유·관리, 사용자에게 보이지 않음. <Code>SSE-S3</Code>, <Code>SSE-SQS</Code>, <Code>SSE-DDB</Code> 기본 암호화에 사용</>, "무료"],
                ["AWS 관리형 키 (Managed)", <><Code>aws/서비스명</Code> 형태 (예: <Code>aws/rds</Code>, <Code>aws/ebs</Code>). 해당 서비스 안에서만 사용 가능</>, "무료"],
                ["고객 관리형 키 (CMK)", "직접 생성하거나 자체 키 자료(BYOK)를 가져옴. 키 정책·교체·교차계정 제어 가능", <>월 <b>$1</b> + API 호출 10,000건당 약 <b>$0.03</b></>],
              ]}
            />
            <H3>자동 키 교체 (Rotation)</H3>
            <Ul items={[
              <><b>AWS 관리형 키</b>: 1년마다 자동 교체 (강제, 변경 불가).</>,
              <><b>고객 관리형 키</b>: 자동 교체 <b>활성화 필요</b>, 기본 1년 주기.</>,
              <><b>가져온(Imported) 키</b>: 자동 교체 불가 — 별칭(Alias)을 이용한 <b>수동 교체만</b> 가능.</>,
            ]} />
            <H3>KMS 키는 리전 범위(Region-scoped)</H3>
            <P>
              KMS 키는 생성된 리전 안에서만 사용할 수 있습니다. 암호화된 EBS 스냅샷을 다른 리전으로 복사하면,
              AWS가 <b>대상 리전의 다른 KMS 키로 재암호화</b>합니다. (멀티 리전 키라는 예외적 기능도 있지만, 기본 원칙은 “키 = 리전 종속”)
            </P>
            <DiagCrossRegion />
          </Section>

          {/* 03 키 정책 */}
          <Section id="keypolicy" no="03" title="KMS 키 정책 & IAM 보안 주체" freq={3} freqNote="교차 계정 스냅샷 시나리오로 출제">
            <P>
              KMS 키에 대한 접근은 S3 버킷 정책과 유사한 <b>키 정책(Key Policy)</b>으로 제어합니다.
              단, S3와 결정적 차이가 하나 있습니다 — <b>키 정책이 없으면 아무도 그 키에 접근할 수 없습니다.</b>
            </P>
            <Table
              head={["정책 유형", "내용"]}
              rows={[
                ["기본 키 정책", <>사용자가 정책을 지정하지 않으면 생성됨. <b>계정 루트(= 계정 전체)에 키 접근을 허용</b>하므로, 이후 IAM 정책만으로 사용자·역할에 키 사용 권한을 부여할 수 있음</>],
                ["커스텀 키 정책", <>키에 접근·관리할 수 있는 사용자/역할을 명시적으로 지정. <b>교차 계정(cross-account) 접근</b>을 허용할 때 필수</>],
              ]}
            />
            <H3>대표 시나리오: 암호화된 스냅샷을 다른 계정에 공유</H3>
            <Ul items={[
              <>① 고객 관리형 키(CMK)로 암호화된 스냅샷 생성 — <b>AWS 관리형 키(aws/ebs)로 암호화된 스냅샷은 교차 계정 공유 불가</b>.</>,
              <>② <b>키 정책에 대상 계정의 교차 계정 접근을 허용</b>하는 문을 추가.</>,
              <>③ 암호화된 스냅샷을 대상 계정과 공유.</>,
              <>④ 대상 계정에서 스냅샷을 복사하며 <b>자기 계정의 CMK로 재암호화</b>.</>,
              <>⑤ 그 스냅샷으로 볼륨 생성.</>,
            ]} />
            <Callout type="exam">
              “다른 계정과 암호화된 스냅샷/AMI를 공유하려면?” → <b>고객 관리형 키 + 키 정책의 교차 계정 허용 + 복사 시 재암호화</b> 3종 세트를 기억하세요.
            </Callout>
          </Section>

          {/* 04 봉투 암호화 */}
          <Section id="envelope" no="04" title="KMS 암호화 패턴 & 봉투 암호화" freq={5} freqNote="DVA 최다 빈출 주제 중 하나">
            <H3>Encrypt API — 4KB 한도</H3>
            <P>
              <Code>Encrypt</Code> API는 데이터를 KMS로 <b>직접 전송</b>해 암호화하므로 <b>4KB 이하</b>의 데이터만 처리할 수 있습니다.
              작은 시크릿(비밀번호, 토큰)에 적합합니다.
            </P>
            <DiagEncryptApi />
            <H3>4KB 초과 → 봉투 암호화 (Envelope Encryption)</H3>
            <P>
              4KB보다 큰 데이터는 KMS로 보내지 않고, <Code>GenerateDataKey</Code>로 받은 <b>데이터 키(DEK)</b>를 이용해
              <b> 클라이언트 측에서</b> 암호화합니다. 이것이 봉투 암호화이며, 시험에서 “4KB 초과 암호화”가 나오면 무조건 이 답입니다.
            </P>
            <DiagEnvelope />
            <Callout type="tip" title="봉투 암호화 절차 요약">
              <b>암호화</b>: <Code>GenerateDataKey</Code> 호출 → 평문 DEK + 암호화된 DEK 수신 → 평문 DEK로 로컬 암호화 → 평문 DEK는 메모리에서 폐기,
              <b> 암호화된 파일 + 암호화된 DEK를 함께(봉투로) 저장</b>.<br />
              <b>복호화</b>: 암호화된 DEK만 <Code>Decrypt</Code> API로 전송(≤4KB) → 평문 DEK 수신 → 로컬에서 파일 복호화.
            </Callout>
            <H3>꼭 알아야 할 KMS API 정리</H3>
            <Table
              head={["API", "역할", "시험 포인트"]}
              rows={[
                [<Code>Encrypt</Code>, "≤ 4KB 데이터를 KMS에서 직접 암호화", "4KB 한도!"],
                [<Code>Decrypt</Code>, "≤ 4KB 암호문(데이터 키 포함) 복호화", "봉투 암호화의 복호화 단계에 사용"],
                [<Code>GenerateDataKey</Code>, "평문 DEK + 암호화된 DEK 반환", "봉투 암호화의 시작점 (즉시 암호화할 때)"],
                [<Code>GenerateDataKeyWithoutPlaintext</Code>, "암호화된 DEK만 반환", "지금 말고 나중에 사용할 키가 필요할 때 (사용 시 Decrypt 필요)"],
                [<Code>GenerateRandom</Code>, "임의의 바이트 문자열 생성", "암호화와 무관한 난수 생성"],
              ]}
            />
            <H3>AWS Encryption SDK & 데이터 키 캐싱</H3>
            <Ul items={[
              <><b>Encryption SDK</b>는 봉투 암호화를 대신 구현해 주는 라이브러리(Java·Python·C·JavaScript)이며 CLI 도구도 제공합니다.</>,
              <><b>데이터 키 캐싱</b>: <Code>LocalCryptoMaterialsCache</Code>로 DEK를 재사용 — KMS API 호출 수(비용·스로틀링)를 줄이는 대신,
                하나의 키가 여러 데이터에 쓰여 보안이 약간 낮아지는 <b>트레이드오프</b>. 최대 수명·사용 횟수·바이트 수를 설정합니다.</>,
            ]} />
            <Callout type="exam">
              “KMS 호출이 너무 많아 비용/스로틀링 문제가 발생한다” → <b>데이터 키 캐싱(LocalCryptoMaterialsCache)</b>이 정답 후보입니다.
            </Callout>
          </Section>

          {/* 05 KMS 한도 */}
          <Section id="limits" no="05" title="KMS 한도 — 요청 쿼터 & ThrottlingException" freq={4} freqNote="스로틀링 해결책 3종이 단골 출제">
            <P>
              KMS의 암호화 작업(Encrypt·Decrypt·GenerateDataKey 등)은 리전별로 <b>초당 요청 쿼터를 모두 공유</b>합니다.
              쿼터를 초과하면 <Code>ThrottlingException</Code>이 발생합니다.
            </P>
            <Table
              head={["키/작업 종류", "요청 쿼터 (초당)"]}
              rows={[
                ["대칭 키 암호화 작업", "리전에 따라 5,500 / 10,000 / 30,000 (us-east-1 등 대형 리전이 높음)"],
                ["RSA 2048 비대칭 작업", "500"],
                ["ECC 비대칭 작업", "300"],
              ]}
            />
            <Callout type="warn" title="숨은 함정">
              쿼터는 <b>내가 직접 호출한 것 + AWS 서비스가 내 대신 호출한 것</b>을 합산합니다.
              예: SSE-KMS로 암호화된 S3 객체를 대량 다운로드하면, S3가 뒤에서 KMS <Code>Decrypt</Code>를 호출해 쿼터를 소모합니다.
            </Callout>
            <H3>ThrottlingException 해결책 (시험 3종 세트)</H3>
            <Ul items={[
              <>① <b>지수 백오프(Exponential Backoff)</b>로 재시도.</>,
              <>② <Code>GenerateDataKey</Code>가 원인이라면 <b>DEK 캐싱(Encryption SDK의 데이터 키 캐싱)</b> 도입 검토.</>,
              <>③ <b>Service Quotas 콘솔 / API로 쿼터 상향 요청</b> (한도는 변경 가능함).</>,
            ]} />
          </Section>

          {/* 06 S3 버킷 키 */}
          <Section id="bucketkey" no="06" title="S3 버킷 키 (Bucket Key)" freq={3} freqNote="SSE-KMS 비용 절감 = 버킷 키">
            <P>
              SSE-KMS를 쓰는 버킷에서 객체마다 KMS를 호출하면 API 비용과 스로틀링 위험이 커집니다.
              <b> S3 버킷 키</b>를 켜면 KMS 키에서 <b>버킷 수준 키를 한 번 생성</b>하고, 이후 객체별 데이터 키는 S3가 그 버킷 키로부터 만들어냅니다.
            </P>
            <DiagBucketKey />
            <Ul items={[
              <>SSE-KMS의 <b>API 호출을 최대 99% 감소</b> → 암호화 비용 최대 99% 절감.</>,
              <>KMS 호출이 줄어드는 만큼 <b>CloudTrail에 기록되는 KMS 이벤트도 감소</b>합니다 (감사 로그가 줄어드는 부수효과).</>,
            ]} />
          </Section>

          {/* 07 CloudHSM */}
          <Section id="hsm" no="07" title="CloudHSM" freq={2} freqNote="주로 ‘KMS vs CloudHSM’ 구분 문제">
            <P>
              KMS가 “AWS가 암호화 <b>소프트웨어</b>를 관리”한다면, CloudHSM은 “AWS가 전용 암호화 <b>하드웨어</b>(HSM)를 제공하고,
              <b>키는 전적으로 사용자가 관리</b>”하는 서비스입니다.
            </P>
            <Ul items={[
              <>전용(single-tenant) 하드웨어, <b>변조 방지</b>, <b>FIPS 140-2 Level 3</b> 규정 준수.</>,
              <>대칭·비대칭 키 모두 지원. <b>SSE-C</b>(고객 제공 키) 방식과 궁합이 좋음.</>,
              <>무료 티어 없음. <b>CloudHSM 클라이언트 소프트웨어</b>를 직접 설치해 키를 관리해야 함.</>,
              <>IAM 권한은 <b>클러스터의 생성·삭제(CRUD)까지만</b> — 키 자체의 관리·사용 권한은 CloudHSM 소프트웨어에서 사용자를 만들어 제어.</>,
              <>클러스터를 <b>여러 AZ에 분산(Multi-AZ)</b>해 고가용성 확보. Redshift(암호화) 등과 통합 가능.</>,
            ]} />
            <H3>KMS vs CloudHSM 비교</H3>
            <Table
              head={["항목", "AWS KMS", "AWS CloudHSM"]}
              rows={[
                ["테넌시", "멀티 테넌트", "싱글 테넌트 (전용 하드웨어)"],
                ["표준", "FIPS 140-2 Level 2 (일부 Level 3)", "FIPS 140-2 Level 3"],
                ["키 관리 주체", "AWS 소프트웨어가 관리 (사용자는 API로 사용)", "전적으로 사용자 (클라이언트 소프트웨어)"],
                ["키 종류", "AWS Owned / AWS Managed / Customer Managed", "고객 유지 키 전용"],
                ["접근 제어·감사", "IAM + CloudTrail", "IAM은 클러스터 CRUD만 · 감사는 CloudTrail/CloudWatch"],
                ["고가용성", "AWS 관리 리전 서비스", "여러 AZ에 클러스터 직접 구성"],
              ]}
            />
            <Callout type="exam">
              “규제상 <b>FIPS 140-2 Level 3</b> 전용 하드웨어에서 키를 <b>직접</b> 관리해야 한다” → CloudHSM. 그 외 대부분의 상황 → KMS.
            </Callout>
          </Section>

          {/* 08 SSM */}
          <Section id="ssm" no="08" title="SSM 파라미터 스토어" freq={4} freqNote="계층 구조·티어·정책까지 세부 출제">
            <P>
              구성값과 시크릿을 저장하는 <b>서버리스</b> 서비스입니다. 버전 추적이 되고, IAM으로 접근을 제어하며,
              <b> SecureString</b> 타입을 쓰면 KMS로 (선택적) 암호화됩니다. EventBridge 알림, CloudFormation과도 통합됩니다.
            </P>
            <H3>계층 구조 (Hierarchy)</H3>
            <P>
              파라미터 이름을 경로처럼 구성하면 IAM 정책으로 <b>경로 단위 접근 제어</b>가 가능하고,
              <Code>GetParametersByPath</Code>로 하위 파라미터를 한 번에(재귀 옵션 포함) 조회할 수 있습니다.
            </P>
            <DiagSsmTree />
            <Ul items={[
              <><Code>/aws/reference/secretsmanager/…</Code> 경로로 <b>Secrets Manager의 시크릿을 SSM API로 조회</b>할 수 있습니다.</>,
              <><Code>/aws/service/ami-amazon-linux-latest/…</Code> 같은 <b>AWS 공개 파라미터</b>로 최신 AMI ID 등을 얻을 수 있습니다.</>,
            ]} />
            <H3>Standard vs Advanced 티어</H3>
            <Table
              head={["항목", "Standard", "Advanced"]}
              rows={[
                ["파라미터 개수(계정·리전당)", "10,000개", "100,000개"],
                ["최대 크기", "4KB", "8KB"],
                ["파라미터 정책", "불가", "가능"],
                ["비용", "무료", "파라미터당 월 $0.05"],
              ]}
            />
            <H3>파라미터 정책 (Advanced 전용)</H3>
            <Ul items={[
              <><b>Expiration (TTL)</b>: 지정 시점에 파라미터를 자동 삭제 — 비밀번호 등 민감 데이터의 강제 갱신 유도.</>,
              <><b>ExpirationNotification</b>: 만료 N일 전 <b>EventBridge</b>로 알림.</>,
              <><b>NoChangeNotification</b>: 일정 기간 파라미터가 변경되지 않으면 알림 (예: “20일간 비밀번호가 안 바뀌었다”).</>,
              <>하나의 파라미터에 <b>여러 정책을 동시에</b> 할당할 수 있습니다.</>,
            ]} />
          </Section>

          {/* 09 Secrets Manager */}
          <Section id="secrets" no="09" title="Secrets Manager" freq={4} freqNote="키워드: 로테이션 · RDS 통합">
            <P>
              이름 그대로 <b>시크릿 저장 전용</b> 서비스입니다. 파라미터 스토어와 구분되는 결정적 기능은
              <b> X일마다 강제되는 자동 로테이션</b>과 <b>RDS 통합</b>입니다.
            </P>
            <DiagRotation />
            <Ul items={[
              <>로테이션 시 <b>Lambda 함수</b>가 새 시크릿을 생성·적용 (RDS 등은 AWS 제공 템플릿 사용, 그 외는 커스텀 Lambda).</>,
              <><b>Amazon RDS(MySQL·PostgreSQL·Aurora), Redshift, DocumentDB</b>와 네이티브 통합 — DB 사용자·비밀번호 관리에 최적.</>,
              <>시크릿은 <b>KMS 암호화가 필수</b> (파라미터 스토어는 선택).</>,
              <><b>멀티 리전 시크릿</b>: 기본 리전의 시크릿을 다른 리전으로 <b>복제(읽기 전용 복제본)</b>하고 동기화. 복제본을 <b>독립 시크릿으로 승격</b> 가능 → 재해복구(DR), 다중 리전 앱·DB에 활용.</>,
            ]} />
            <Callout type="exam">
              문제에 <b>“자동 로테이션”</b>, <b>“RDS 자격 증명 관리”</b>가 보이면 Secrets Manager가 정답입니다.
            </Callout>
          </Section>

          {/* 10 비교 */}
          <Section id="compare" no="10" title="SSM 파라미터 스토어 vs Secrets Manager" freq={5} freqNote="두 서비스 중 고르는 문제가 반드시 나온다고 생각할 것">
            <Table
              head={["항목", "SSM Parameter Store", "Secrets Manager"]}
              rows={[
                ["비용", "저렴 (Standard 무료)", "상대적으로 비쌈 (시크릿당 과금 + API 호출 과금)"],
                ["KMS 암호화", "선택 사항 (SecureString)", "필수"],
                ["자동 로테이션", <>네이티브 로테이션 <b>없음</b> — EventBridge 스케줄 + <b>Lambda를 직접 구성</b>해야 함</>, <><b>내장 자동 로테이션</b> (Lambda 기반, RDS·Redshift·DocumentDB 템플릿 제공)</>],
                ["RDS 등 DB 통합", "없음", "네이티브 통합"],
                ["부가 기능", "계층 구조, 공개 파라미터(AMI), 파라미터 정책(TTL), Secrets Manager 시크릿 참조 가능", "멀티 리전 복제, 교차 계정 공유(리소스 정책)"],
                ["CloudFormation", "통합", "통합"],
              ]}
            />
            <Callout type="tip" title="선택 기준 한 줄 요약">
              <b>단순·저비용 구성값/시크릿 저장</b> → 파라미터 스토어. <b>자동 로테이션·DB 자격 증명</b> → Secrets Manager.
            </Callout>
          </Section>

          {/* 11 CloudFormation */}
          <Section id="cfn" no="11" title="CloudFormation — Secrets Manager & SSM 통합" freq={3} freqNote="동적 참조 3종 문법 암기">
            <H3>동적 참조 (Dynamic References)</H3>
            <P>템플릿에 시크릿을 하드코딩하지 않고, 배포 시점에 값을 가져옵니다. 문법 3종:</P>
            <CodeBlock>{`{{resolve:ssm:파라미터명:버전}}            # 평문 파라미터
{{resolve:ssm-secure:파라미터명:버전}}     # SecureString (복호화하여 주입)
{{resolve:secretsmanager:시크릿ID:SecretString:json키::버전}}  # Secrets Manager`}</CodeBlock>
            <H3>RDS 관리형 마스터 암호 — 두 가지 옵션</H3>
            <Table
              head={["옵션", "동작 방식"]}
              rows={[
                [<><Code>ManageMasterUserPassword: true</Code></>, <>RDS(또는 Aurora)가 Secrets Manager에 <b>시크릿을 자동 생성</b>하고 <b>로테이션까지 자체 관리</b> — 가장 간단하고 시험이 좋아하는 답</>],
                ["직접 생성 방식", <>템플릿에서 <Code>AWS::SecretsManager::Secret</Code> 생성(GenerateSecretString) → RDS에 동적 참조로 주입 → <Code>AWS::SecretsManager::SecretTargetAttachment</Code>로 시크릿과 DB를 연결(link)해 로테이션 대상 지정</>],
              ]}
            />
          </Section>

          {/* 12 CloudWatch 로그 암호화 */}
          <Section id="cwlogs" no="12" title="CloudWatch 로그 암호화" freq={2} freqNote="키워드: 콘솔 불가 · CLI/API 전용">
            <Ul items={[
              <>CloudWatch Logs는 <b>KMS 키로 로그 그룹 수준</b>에서 암호화할 수 있습니다 (로그 그룹마다 다른 키 지정 가능).</>,
              <><b>콘솔에서는 KMS 키를 연결할 수 없고</b>, 반드시 <b>CloudWatch Logs API/CLI</b>를 사용해야 합니다.</>,
              <>기존 로그 그룹: <Code>associate-kms-key</Code> · 신규 로그 그룹: <Code>create-log-group --kms-key-id</Code></>,
              <>KMS <b>키 정책</b>에서 <Code>logs.리전.amazonaws.com</Code> 서비스 주체에게 Encrypt/Decrypt 등 권한을 허용해야 합니다 (IAM 정책이 아니라 <b>키 정책</b> 수정!).</>,
            ]} />
            <CodeBlock>{`aws logs associate-kms-key \\
  --log-group-name /my/log-group \\
  --kms-key-id arn:aws:kms:ap-northeast-1:111122223333:key/abcd-...`}</CodeBlock>
          </Section>

          {/* 13 CodeBuild */}
          <Section id="codebuild" no="13" title="CodeBuild 보안" freq={3} freqNote="buildspec 환경변수 시크릿 처리 방법 출제">
            <Ul items={[
              <>빌드가 VPC 내부 리소스(RDS 등)에 접근해야 하면 CodeBuild에 <b>VPC 구성을 지정</b>해야 합니다.</>,
              <>시크릿을 <b>평문 환경변수로 넣지 마세요</b> — 환경변수는 콘솔·CLI에서 노출될 수 있습니다.</>,
            ]} />
            <H3>buildspec.yml에서의 올바른 시크릿 사용</H3>
            <CodeBlock>{`env:
  parameter-store:            # SSM Parameter Store 참조
    DB_PASSWORD: /my-app/prod/db-password
  secrets-manager:            # Secrets Manager 참조
    API_KEY: prod/api:SecretString:api_key`}</CodeBlock>
            <P>
              즉, 환경변수는 <b>SSM Parameter Store 파라미터 참조</b> 또는 <b>Secrets Manager 시크릿 참조</b>로 선언하고,
              빌드 시점에 안전하게 주입되도록 합니다.
            </P>
          </Section>

          {/* 14 Nitro */}
          <Section id="nitro" no="14" title="AWS Nitro Enclaves" freq={2} freqNote="키워드: 격리 · 암호화 증명 · 민감 데이터">
            <P>
              <b>고도로 민감한 데이터</b>(PII, 의료·금융 데이터, 지식재산)를 <b>완전히 격리된 컴퓨팅 환경</b>에서 처리하기 위한 기능입니다.
            </P>
            <DiagNitro />
            <Ul items={[
              <>완전 격리 VM: <b>영구 스토리지 ✕ · 대화형 접근(SSH) ✕ · 외부 네트워크 ✕</b>. 부모 인스턴스와는 로컬 <b>vsock</b> 채널로만 통신.</>,
              <><b>암호화 증명(Cryptographic Attestation)</b>: 승인된(검증된) 코드만 Enclave에서 실행됨을 보증.</>,
              <><b>KMS 통합</b>: 증명 결과를 기반으로 <b>오직 해당 Enclave만</b> 특정 KMS 키에 접근하도록 키 정책 구성 가능.</>,
              <>사용 절차: <Code>EnclaveOptions=true</Code>로 EC2 시작 → <Code>nitro-cli</Code>로 <b>EIF</b>(Enclave Image File) 생성 → Enclave 기동.</>,
              <>사용 사례: 민감 데이터 처리, 시크릿 보호, 프라이빗 키 서버, 카드 정보 토큰화 등.</>,
            ]} />
          </Section>

          {/* 마무리 요약 */}
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold mb-4" style={{ color: C.ink }}>⚡ 시험 직전 10초 요약</h2>
            <Table
              firstColStrong
              head={["문제 속 키워드", "정답 방향"]}
              rows={[
                ["4KB보다 큰 데이터 암호화", "봉투 암호화 (GenerateDataKey + 로컬 암호화)"],
                ["KMS ThrottlingException", "지수 백오프 → DEK 캐싱 → Service Quotas 상향"],
                ["SSE-KMS 비용/호출 절감 (S3)", "S3 버킷 키"],
                ["시크릿 자동 로테이션 · RDS 자격 증명", "Secrets Manager"],
                ["저렴한 구성값 저장 · 계층 구조 · TTL", "SSM Parameter Store (+Advanced 파라미터 정책)"],
                ["FIPS 140-2 Level 3 · 키 직접 관리", "CloudHSM"],
                ["암호화 스냅샷 교차 계정 공유", "CMK + 키 정책 교차 계정 허용 + 복사 시 재암호화"],
                ["CloudWatch 로그 KMS 암호화", "콘솔 ✕ → associate-kms-key (CLI/API) + 키 정책 수정"],
                ["CodeBuild의 시크릿", "환경변수 평문 ✕ → parameter-store / secrets-manager 참조"],
                ["완전 격리 환경에서 민감 데이터 처리", "Nitro Enclaves (암호화 증명)"],
              ]}
            />
            <div className="text-xs mt-6 leading-relaxed" style={{ color: C.sub }}>
              ※ 빈출도는 Stéphane Maarek DVA-C02 강의의 강조도와 최근 수험 후기·출제 경향을 종합한 <b>추정치</b>이며, 실제 시험 구성은 회차마다 다를 수 있습니다.
              실습(핸즈온) 강의 내용은 요청에 따라 제외했습니다.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
