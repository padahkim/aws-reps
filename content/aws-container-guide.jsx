import { useState } from "react";

/* ═══════════════ 디자인 토큰 ═══════════════ */
const C = {
  bg: "#0a0e17", panel: "#131a2a", panel2: "#0c111d", line: "#243048",
  txt: "#e8edf4", sub: "#93a4bd",
  o: "#ff9900", b: "#58a6ff", g: "#8b949e", gr: "#3fb950",
  p: "#bc8cff", r: "#f85149", y: "#e3b341",
};
const FONT = "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',-apple-system,'Segoe UI',sans-serif";
const MONO = "'SF Mono','JetBrains Mono',Consolas,monospace";

/* ═══════════════ 공통 UI 컴포넌트 ═══════════════ */
const Freq = ({ n }) => {
  const meta = { 3: ["매우 빈출", C.r], 2: ["빈출", C.o], 1: ["저빈출", C.g] }[n];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11,
      fontWeight: 700, color: meta[1], background: meta[1] + "1a",
      border: `1px solid ${meta[1]}55`, padding: "2px 9px", borderRadius: 999,
      whiteSpace: "nowrap", verticalAlign: "middle" }}>
      <span style={{ letterSpacing: 1 }}>{"★".repeat(n)}{"☆".repeat(3 - n)}</span>{meta[0]}
    </span>
  );
};

const Sec = ({ no, title, freq, children }) => (
  <section style={{ margin: "6px 0 40px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {no && <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".14em",
        color: C.o, border: `1px solid ${C.o}55`, background: "rgba(255,153,0,.08)",
        padding: "3px 9px", borderRadius: 6, fontFamily: MONO }}>{no}</span>}
      {freq && <Freq n={freq} />}
    </div>
    <h2 style={{ fontSize: 22, fontWeight: 800, margin: "12px 0 0", letterSpacing: "-0.01em", lineHeight: 1.35 }}>{title}</h2>
    <div style={{ width: 46, height: 3, background: C.o, borderRadius: 2, margin: "10px 0 4px" }} />
    {children}
  </section>
);

const H3 = ({ children, freq }) => (
  <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: "26px 0 4px",
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", lineHeight: 1.4 }}>
    {children}{freq && <Freq n={freq} />}
  </h3>
);

const P = ({ children }) => (
  <p style={{ margin: "10px 0", lineHeight: 1.8, fontSize: 14.5, color: C.txt }}>{children}</p>
);
const O = ({ children }) => <strong style={{ color: C.o }}>{children}</strong>;
const Bl = ({ children }) => <strong style={{ color: C.b }}>{children}</strong>;
const List = ({ children }) => (
  <ul style={{ margin: "8px 0", paddingLeft: 20, color: C.txt }}>{children}</ul>
);
const Li = ({ t, children }) => (
  <li style={{ margin: "7px 0", lineHeight: 1.75, fontSize: 14 }}>
    {t && <strong style={{ color: C.txt }}>{t} — </strong>}{children}
  </li>
);

const Tip = ({ children }) => (
  <div style={{ background: "linear-gradient(135deg, rgba(255,153,0,.10), rgba(255,153,0,.02))",
    border: `1px solid ${C.o}44`, borderLeft: `4px solid ${C.o}`, borderRadius: 10,
    padding: "11px 14px", margin: "16px 0", fontSize: 13.5, lineHeight: 1.75 }}>
    <span style={{ fontWeight: 800, color: C.o, marginRight: 6 }}>📌 시험 포인트</span>{children}
  </div>
);
const Note = ({ children }) => (
  <div style={{ background: "rgba(88,166,255,.06)", border: "1px solid rgba(88,166,255,.25)",
    borderRadius: 10, padding: "10px 14px", margin: "14px 0", fontSize: 13,
    lineHeight: 1.7, color: C.sub }}>{children}</div>
);

const Grid = ({ min = 220, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
    gap: 12, margin: "14px 0" }}>{children}</div>
);
const Card = ({ title, color = C.b, children }) => (
  <div style={{ background: C.panel, border: `1px solid ${C.line}`,
    borderTop: `3px solid ${color}`, borderRadius: 12, padding: "13px 15px" }}>
    <div style={{ fontWeight: 800, fontSize: 13.5, color, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const Code = ({ children }) => (
  <code style={{ background: "#1a2338", border: "1px solid #2b3a5c", padding: "1px 6px",
    borderRadius: 6, fontSize: 12.5, color: "#9ecbff", fontFamily: MONO }}>{children}</code>
);
const CodeBlock = ({ children }) => (
  <pre style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10,
    padding: "13px 15px", overflowX: "auto", fontSize: 12, lineHeight: 1.65,
    color: "#9ecbff", fontFamily: MONO, margin: "12px 0" }}>{children}</pre>
);

const btnStyle = (act, color = C.o) => ({
  padding: "6px 13px", borderRadius: 999, fontSize: 12.5, fontWeight: 700,
  cursor: "pointer", fontFamily: FONT,
  border: `1px solid ${act ? color : C.line}`,
  background: act ? color + "22" : "transparent",
  color: act ? color : C.sub,
});
const navBtnStyle = (dis) => ({
  padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, fontFamily: FONT,
  cursor: dis ? "default" : "pointer", opacity: dis ? 0.35 : 1,
  border: `1px solid ${C.line}`, background: C.panel, color: C.txt,
});

/* ═══════════════ SVG 다이어그램 프리미티브 ═══════════════ */
const AD = () => (
  <defs>
    {Object.entries({ o: C.o, b: C.b, g: C.g, gr: C.gr, p: C.p, r: C.r }).map(([k, v]) => (
      <marker key={k} id={"ah-" + k} markerWidth="7" markerHeight="7" refX="5.5" refY="2.75" orient="auto">
        <path d="M0,0 L5.5,2.75 L0,5.5 Z" fill={v} />
      </marker>
    ))}
  </defs>
);
const Bx = ({ x, y, w, h, f = "#15203a", s = "#2b3a5c", r = 9, dash }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={f} stroke={s}
    strokeWidth="1.3" strokeDasharray={dash ? "5 4" : "none"} />
);
const Tx = ({ x, y, s = 12, f = C.txt, w = 600, a = "middle", children }) => (
  <text x={x} y={y} fontSize={s} fill={f} fontWeight={w} textAnchor={a} fontFamily={FONT}>{children}</text>
);
const Ar = ({ x1, y1, x2, y2, c = "g", dash, sw = 1.5 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C[c]} strokeWidth={sw}
    strokeDasharray={dash ? "5 4" : "none"} markerEnd={`url(#ah-${c})`} />
);
const Dia = ({ vb, cap, children }) => (
  <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 14,
    padding: "12px 8px 4px", margin: "14px 0" }}>
    <svg viewBox={vb} style={{ width: "100%", height: "auto", display: "block" }}><AD />{children}</svg>
    {cap && <div style={{ textAlign: "center", fontSize: 12, color: C.sub,
      padding: "9px 10px 8px", lineHeight: 1.65 }}>{cap}</div>}
  </div>
);

/* ═══════════════ TAB 1 · Docker (168강) ═══════════════ */
function DockerTab() {
  return (<>
    <Sec no="168강" title="Docker란? — 모든 것의 출발점" freq={1}>
      <P><O>Docker</O>는 앱을 배포하기 위한 소프트웨어 개발 플랫폼입니다. 앱을 <O>컨테이너</O>라는
        표준화된 패키지에 담으면, <Bl>어떤 OS·어떤 머신에서든 완전히 동일하게 실행</Bl>됩니다.
        "내 컴퓨터에서는 되는데요?" 문제가 사라지는 거죠.</P>
      <List>
        <Li t="동일한 동작 보장">머신에 상관없이 호환성 문제 없음, 예측 가능한 동작</Li>
        <Li t="유지보수·배포가 쉬움">작업량 감소, 어떤 언어·OS·기술과도 호환</Li>
        <Li t="대표 사용 사례">마이크로서비스 아키텍처, 온프레미스 앱을 클라우드로 이전(리프트 앤 시프트)</Li>
      </List>

      <H3>Docker vs 가상 머신(VM) — 구조 비교</H3>
      <P>VM은 <Bl>하이퍼바이저</Bl> 위에 <Bl>Guest OS를 통째로</Bl> 올리지만, Docker는 하이퍼바이저 없이
        <O> Docker Daemon</O> 위에서 컨테이너들이 <O>호스트의 자원을 공유</O>합니다.
        그래서 한 서버에 훨씬 많은 컨테이너를 가볍게 띄울 수 있습니다.</P>
      <Grid min={215}>
        <Dia vb="0 0 230 236" cap="OS를 통째로 복제 → 무겁고 느림">
          <Tx x={115} y={16} s={12} w={800}>가상 머신 (VM)</Tx>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Bx x={12 + i * 70} y={28} w={62} h={36} f="#12263f" s={C.b + "66"} />
              <Tx x={43 + i * 70} y={50} s={10.5}>App</Tx>
              <Bx x={12 + i * 70} y={68} w={62} h={36} />
              <Tx x={43 + i * 70} y={90} s={10}>Guest OS</Tx>
            </g>
          ))}
          <Bx x={12} y={112} w={206} h={34} f="#241a33" s={C.p + "66"} />
          <Tx x={115} y={133} s={11} f={C.p}>하이퍼바이저</Tx>
          <Bx x={12} y={154} w={206} h={34} />
          <Tx x={115} y={175} s={11}>Host OS</Tx>
          <Bx x={12} y={196} w={206} h={34} />
          <Tx x={115} y={217} s={11}>인프라 (서버)</Tx>
        </Dia>
        <Dia vb="0 0 230 236" cap="자원을 공유 → 가볍고 빠름">
          <Tx x={115} y={16} s={12} w={800}>Docker 컨테이너</Tx>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <Bx x={12 + i * 53} y={28} w={48} h={76} f="#12263f" s={C.b + "66"} />
              <Tx x={36 + i * 53} y={62} s={10.5}>App</Tx>
              <Tx x={36 + i * 53} y={78} s={8.5} f={C.sub}>컨테이너</Tx>
            </g>
          ))}
          <Bx x={12} y={112} w={206} h={34} f="#33250f" s={C.o + "66"} />
          <Tx x={115} y={133} s={11} f={C.o}>Docker Daemon</Tx>
          <Bx x={12} y={154} w={206} h={34} />
          <Tx x={115} y={175} s={11}>Host OS</Tx>
          <Bx x={12} y={196} w={206} h={34} />
          <Tx x={115} y={217} s={11}>인프라 (서버)</Tx>
        </Dia>
      </Grid>

      <H3>Docker 이미지의 생명주기</H3>
      <P><O>Dockerfile</O>(빌드 명령서)로 <O>이미지</O>를 만들고, 이미지를 <O>저장소</O>에 올린 뒤,
        어디서든 내려받아 <O>컨테이너</O>로 실행합니다. 저장소는 퍼블릭인 <Bl>Docker Hub</Bl>와
        AWS의 <O>Amazon ECR</O>(프라이빗 + 퍼블릭 갤러리)이 대표적입니다.</P>
      <Dia vb="0 0 420 462" cap="이미지 = 배포 단위(설계도) · 컨테이너 = 실행 중인 인스턴스">
        {[
          ["Dockerfile", "이미지를 만드는 명령서", "#15203a", "#2b3a5c"],
          ["Docker 이미지", "빌드된 앱 패키지", "#12263f", C.b + "66"],
          ["저장소 (Repository)", "Docker Hub · Amazon ECR", "#33250f", C.o + "66"],
          ["Docker 이미지", "다른 서버에서 내려받음", "#12263f", C.b + "66"],
          ["컨테이너 (실행 중)", "격리된 환경에서 앱 구동", "#132e1d", C.gr + "66"],
        ].map(([t, sub, f, s], i) => (
          <g key={i}>
            <Bx x={110} y={18 + i * 96} w={200} h={52} f={f} s={s} />
            <Tx x={210} y={40 + i * 96} s={12.5} w={800}>{t}</Tx>
            <Tx x={210} y={58 + i * 96} s={9.5} f={C.sub}>{sub}</Tx>
          </g>
        ))}
        {["docker build", "docker push", "docker pull", "docker run"].map((cmd, i) => (
          <g key={cmd}>
            <Ar x1={210} y1={74 + i * 96} x2={210} y2={110 + i * 96} c="o" />
            <Tx x={224} y={96 + i * 96} s={11} f={C.o} a="start" w={700}>$ {cmd}</Tx>
          </g>
        ))}
      </Dia>

      <H3>AWS의 컨테이너 서비스 4형제 — 이 매핑이 핵심!</H3>
      <Grid min={200}>
        <Card title="Amazon ECS" color={C.o}>아마존 <strong>자체</strong> 컨테이너 오케스트레이션 플랫폼. 컨테이너를 언제·어디서·몇 개 실행할지 관리</Card>
        <Card title="Amazon EKS" color={C.b}>관리형 <strong>Kubernetes</strong>. 오픈소스 표준을 AWS에서 운영</Card>
        <Card title="Amazon ECR" color={C.gr}>컨테이너 <strong>이미지 저장소</strong> (AWS판 Docker Hub)</Card>
        <Card title="AWS Fargate" color={C.p}><strong>서버리스</strong> 컨테이너 실행 환경. ECS·EKS 양쪽에서 사용 가능</Card>
      </Grid>
      <Tip>Docker 자체를 직접 묻는 문제는 드뭅니다. 대신 <strong>"컨테이너는 하이퍼바이저 없이 호스트 자원을 공유한다"</strong>는 개념과,
        위 4개 서비스가 각각 <strong>무슨 역할</strong>인지(오케스트레이션 / K8s / 저장소 / 서버리스 실행)가 다른 모든 문제의 전제가 됩니다.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 2 · Amazon ECS 기초 (169~170강) ═══════════════ */
function EcsTab() {
  return (<>
    <Sec no="169강" title="Amazon ECS — 두 가지 Launch Type" freq={3}>
      <P><O>ECS</O>(Elastic Container Service)에서 Docker 컨테이너를 실행한다는 것은
        = <O>ECS 클러스터</O> 위에서 <O>ECS 태스크</O>를 실행한다는 뜻입니다.
        태스크를 <Bl>어떤 인프라 위에서</Bl> 돌릴지가 바로 Launch Type입니다.</P>
      <Grid min={215}>
        <Dia vb="0 0 230 218" cap="인스턴스를 직접 만들고 패치·유지관리해야 함">
          <Bx x={8} y={24} w={214} h={186} f="none" s={C.line} dash />
          <Tx x={115} y={44} s={10} f={C.sub}>ECS 클러스터 — EC2 Launch Type</Tx>
          {[0, 1].map((i) => (
            <g key={i}>
              <Bx x={18 + i * 100} y={54} w={94} h={146} />
              <Tx x={65 + i * 100} y={72} s={9.5}>EC2 인스턴스</Tx>
              <Bx x={26 + i * 100} y={82} w={78} h={26} f="#33250f" s={C.o + "66"} r={6} />
              <Tx x={65 + i * 100} y={99} s={9} f={C.o}>ECS Agent</Tx>
              <Bx x={26 + i * 100} y={116} w={78} h={32} f="#12263f" s={C.b + "66"} r={6} />
              <Tx x={65 + i * 100} y={136} s={9.5}>태스크</Tx>
              <Bx x={26 + i * 100} y={156} w={78} h={32} f="#12263f" s={C.b + "66"} r={6} />
              <Tx x={65 + i * 100} y={176} s={9.5}>태스크</Tx>
            </g>
          ))}
        </Dia>
        <Dia vb="0 0 230 218" cap="CPU/메모리만 정의하면 AWS가 알아서 실행">
          <Bx x={8} y={24} w={214} h={186} f="none" s={C.line} dash />
          <Tx x={115} y={44} s={10} f={C.sub}>ECS 클러스터 — Fargate</Tx>
          {[[26, 70], [120, 70], [26, 122], [120, 122]].map(([x, y], i) => (
            <g key={i}>
              <Bx x={x} y={y} w={84} h={38} f="#12263f" s={C.b + "66"} r={8} />
              <Tx x={x + 42} y={y + 24} s={10.5}>태스크</Tx>
            </g>
          ))}
          <Tx x={115} y={188} s={10.5} f={C.o} w={800}>관리할 서버 없음 — 서버리스 ✨</Tx>
        </Dia>
      </Grid>
      <Grid min={230}>
        <Card title="EC2 Launch Type" color={C.b}>
          클러스터에 <strong>EC2 인스턴스를 직접 프로비저닝·유지관리</strong>해야 함.
          각 인스턴스는 <strong>ECS Agent</strong>를 실행해 스스로를 클러스터에 등록.
          컨테이너의 시작·중지 자체는 AWS가 처리.
        </Card>
        <Card title="Fargate Launch Type" color={C.o}>
          프로비저닝할 인프라가 <strong>전혀 없음</strong> = <strong>서버리스</strong>.
          태스크 정의만 만들면 필요한 CPU/RAM 기준으로 AWS가 대신 태스크를 실행.
          확장하려면 <strong>태스크 수만 늘리면 끝</strong>.
        </Card>
      </Grid>
      <Tip>문제에 <strong>"서버리스"</strong>, <strong>"인프라 관리 없이 컨테이너 실행"</strong>이 보이면 → <strong>Fargate</strong>.
        반대로 인스턴스 수준의 제어(특정 AMI, GPU 등)가 필요하면 → EC2 Launch Type. 시험 전체에서 가장 자주 나오는 구분입니다.</Tip>
      <Note>170강 참고: ECS 콘솔이 신형 UI로 개편되어 강의 화면과 실제 화면이 다를 수 있습니다. 시험 내용과는 무관합니다.</Note>
    </Sec>

    <Sec no="169강" title="ECS의 IAM 역할 — 누가 어떤 권한을 쓰나" freq={3}>
      <P>ECS에는 <Bl>서로 다른 주체가 쓰는 서로 다른 역할</Bl>이 있고, 시험은 이 구분을 집요하게 묻습니다.</P>
      <Dia vb="0 0 460 250" cap="역할 분리 = 최소 권한 원칙. Task Role은 태스크 정의 안에서 지정합니다.">
        <Bx x={14} y={40} w={170} h={190} />
        <Tx x={99} y={60} s={11} f={C.sub}>EC2 인스턴스</Tx>
        <Bx x={28} y={72} w={142} h={40} f="#33250f" s={C.o + "66"} />
        <Tx x={99} y={96} s={11.5} f={C.o} w={700}>ECS Agent</Tx>
        <Bx x={28} y={140} w={142} h={70} f="#12263f" s={C.b + "66"} />
        <Tx x={99} y={168} s={11.5} w={700}>ECS 태스크</Tx>
        <Tx x={99} y={186} s={9.5} f={C.sub}>(앱 컨테이너)</Tx>
        <Bx x={285} y={52} w={160} h={74} />
        <Tx x={365} y={72} s={10.5} w={700}>관리용 AWS 서비스</Tx>
        <Tx x={365} y={92} s={9.5} f={C.sub}>ECS API · CloudWatch Logs</Tx>
        <Tx x={365} y={108} s={9.5} f={C.sub}>ECR 이미지 pull · SSM/Secrets</Tx>
        <Bx x={285} y={160} w={160} h={60} />
        <Tx x={365} y={182} s={10.5} w={700}>앱이 쓰는 AWS 서비스</Tx>
        <Tx x={365} y={202} s={9.5} f={C.sub}>S3 · DynamoDB 등</Tx>
        <Ar x1={172} y1={92} x2={283} y2={90} c="o" />
        <Tx x={228} y={78} s={9.5} f={C.o} w={700}>EC2 Instance Profile</Tx>
        <Ar x1={172} y1={176} x2={283} y2={190} c="b" />
        <Tx x={228} y={214} s={9.5} f={C.b} w={700}>ECS Task Role</Tx>
      </Dia>
      <Grid min={230}>
        <Card title="EC2 Instance Profile" color={C.o}>
          <strong>EC2 Launch Type 전용</strong>. <strong>ECS Agent</strong>가 사용:
          ECS 서비스 API 호출, CloudWatch Logs로 컨테이너 로그 전송,
          <strong> ECR에서 이미지 pull</strong>, Secrets Manager·SSM Parameter Store의 민감 데이터 참조.
        </Card>
        <Card title="ECS Task Role" color={C.b}>
          <strong>태스크(앱) 자신</strong>이 쓰는 역할. 서비스마다 다른 역할을 붙일 수 있어
          태스크별 최소 권한 가능 (예: 태스크 A는 S3, 태스크 B는 DynamoDB).
          <strong> 태스크 정의(Task Definition)에서 지정</strong>.
        </Card>
      </Grid>
      <Tip>"태스크가 S3에 접근하지 못한다" → <strong>Task Role</strong> 확인.
        "인스턴스가 ECR에서 이미지를 못 가져온다 / 로그가 CloudWatch에 안 올라간다" → <strong>Instance Profile</strong>(또는 Fargate라면 Task Execution Role) 확인.</Tip>
    </Sec>

    <Sec no="169강" title="로드 밸런서 통합" freq={2}>
      <Dia vb="0 0 440 176" cap="ALB가 트래픽을 여러 태스크로 분산">
        <Bx x={14} y={66} w={78} h={44} />
        <Tx x={53} y={92} s={11}>사용자</Tx>
        <Bx x={132} y={66} w={96} h={44} f="#33250f" s={C.o + "66"} />
        <Tx x={180} y={92} s={11.5} f={C.o} w={700}>ALB</Tx>
        <Bx x={268} y={20} w={158} h={140} f="none" s={C.line} dash />
        <Tx x={347} y={38} s={9.5} f={C.sub}>ECS 서비스</Tx>
        {[50, 88, 126].map((y, i) => (
          <g key={i}>
            <Bx x={280} y={y} w={134} h={28} f="#12263f" s={C.b + "66"} r={7} />
            <Tx x={347} y={y + 18} s={10}>ECS 태스크</Tx>
          </g>
        ))}
        <Ar x1={92} y1={88} x2={130} y2={88} c="g" />
        <Ar x1={228} y1={88} x2={278} y2={64} c="o" />
        <Ar x1={228} y1={88} x2={278} y2={102} c="o" />
        <Ar x1={228} y1={88} x2={278} y2={140} c="o" />
      </Dia>
      <Grid min={200}>
        <Card title="ALB ✅ 권장" color={C.gr}>대부분의 사용 사례를 지원. Fargate와도 호환. <strong>동적 호스트 포트 매핑</strong> 지원(태스크 정의 탭 참고)</Card>
        <Card title="NLB — 특수 목적" color={C.b}><strong>초고성능·높은 처리량</strong>이 필요하거나 <strong>AWS PrivateLink</strong>와 함께 쓸 때만 권장</Card>
        <Card title="CLB ❌ 비권장" color={C.r}>지원은 되지만 고급 기능 없음. <strong>Fargate 미지원</strong>, 동적 포트 매핑 불가</Card>
      </Grid>
    </Sec>

    <Sec no="169강" title="데이터 볼륨 — Amazon EFS 마운트" freq={3}>
      <P>ECS 태스크에 네트워크 파일 시스템인 <O>Amazon EFS</O>를 마운트할 수 있습니다.
        <Bl> EC2와 Fargate 두 Launch Type 모두 호환</Bl>되며, 어느 AZ에서 실행되든
        모든 태스크가 <O>같은 데이터를 공유</O>합니다.</P>
      <Dia vb="0 0 440 236" cap="어느 AZ의 태스크든 같은 데이터 공유 → 멀티 AZ 영속(persistent) 공유 스토리지">
        <Bx x={24} y={30} w={180} h={86} f="none" s={C.line} dash />
        <Tx x={114} y={48} s={10} f={C.sub}>가용 영역 A</Tx>
        <Bx x={54} y={58} w={120} h={40} f="#12263f" s={C.b + "66"} />
        <Tx x={114} y={82} s={10.5}>ECS 태스크</Tx>
        <Bx x={236} y={30} w={180} h={86} f="none" s={C.line} dash />
        <Tx x={326} y={48} s={10} f={C.sub}>가용 영역 B</Tx>
        <Bx x={266} y={58} w={120} h={40} f="#12263f" s={C.b + "66"} />
        <Tx x={326} y={82} s={10.5}>ECS 태스크</Tx>
        <Bx x={140} y={164} w={160} h={52} f="#132e1d" s={C.gr + "66"} />
        <Tx x={220} y={186} s={12} f={C.gr} w={700}>Amazon EFS</Tx>
        <Tx x={220} y={203} s={9.5} f={C.sub}>네트워크 파일 시스템</Tx>
        <Ar x1={114} y1={100} x2={190} y2={162} c="gr" />
        <Ar x1={326} y1={100} x2={250} y2={162} c="gr" />
      </Dia>
      <List>
        <Li><O>Fargate + EFS = 완전 서버리스</O> 조합 (서버도, 스토리지 관리도 없음)</Li>
        <Li t="주의"><Bl>Amazon S3는 파일 시스템으로 마운트할 수 없습니다</Bl> — 시험 단골 함정!</Li>
      </List>
      <Tip>"여러 AZ의 컨테이너가 <strong>영속적인 스토리지를 공유</strong>해야 한다" → <strong>EFS</strong>.
        보기에 S3가 있어도 <strong>파일 시스템 마운트는 불가</strong>하므로 오답입니다.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 3 · 스케일링 & 롤링 업데이트 (173~174강) ═══════════════ */
const ROLL_SCEN = {
  a: {
    name: "min 50% / max 100%",
    desc: "먼저 구버전을 내리고, 빈 자리에 새 버전을 올림 — 여유 용량이 없을 때 (일시적으로 용량 감소 허용)",
    steps: [
      { v: [1, 1, 1, 1], cap: "시작 — v1 태스크 4개 실행 중 (100%)" },
      { v: [1, 1], cap: "v1 태스크 2개 종료 → 50% (min 50%까지 허용되므로 OK)" },
      { v: [1, 1, 2, 2], cap: "v2 태스크 2개 시작 → 100% (max 100% 한도 도달)" },
      { v: [2, 2], cap: "남은 v1 태스크 2개 종료 → 다시 50%" },
      { v: [2, 2, 2, 2], cap: "v2 태스크 2개 시작 → 전부 v2, 업데이트 완료 ✅" },
    ],
  },
  b: {
    name: "min 100% / max 150%",
    desc: "먼저 새 버전을 추가로 올리고, 그 다음 구버전을 내림 — 용량이 한 번도 줄지 않는 무중단 방식",
    steps: [
      { v: [1, 1, 1, 1], cap: "시작 — v1 태스크 4개 실행 중 (100%)" },
      { v: [1, 1, 1, 1, 2, 2], cap: "v2 태스크 2개 추가 → 6개 = 150% (max 150% 한도)" },
      { v: [1, 1, 2, 2], cap: "v1 태스크 2개 종료 → 100% (min 100% 유지 OK)" },
      { v: [1, 1, 2, 2, 2, 2], cap: "v2 태스크 2개 추가 → 다시 150%" },
      { v: [2, 2, 2, 2], cap: "v1 태스크 2개 종료 → 전부 v2, 완료 ✅" },
    ],
  },
};

function RollingDemo() {
  const [sc, setSc] = useState("a");
  const [i, setI] = useState(0);
  const s = ROLL_SCEN[sc];
  const step = s.steps[i];
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 14,
      padding: "16px 15px", margin: "14px 0" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {Object.entries(ROLL_SCEN).map(([k, v]) => (
          <button key={k} onClick={() => { setSc(k); setI(0); }} style={btnStyle(sc === k)}>{v.name}</button>
        ))}
      </div>
      <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.65, marginBottom: 16 }}>{s.desc}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minHeight: 50, alignItems: "center" }}>
        {step.v.map((v, idx) => (
          <div key={idx} style={{ width: 46, height: 46, borderRadius: 10, display: "flex",
            alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13,
            color: "#0b0f19", background: v === 1 ? C.b : C.o,
            boxShadow: "0 3px 10px rgba(0,0,0,.45)" }}>v{v}</div>
        ))}
      </div>
      <div style={{ fontSize: 13.5, margin: "16px 0 12px", lineHeight: 1.65 }}>
        <span style={{ color: C.o, fontWeight: 800, fontFamily: MONO }}>STEP {i + 1}/{s.steps.length}</span>
        <span style={{ color: C.sub }}> · </span>{step.cap}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} style={navBtnStyle(i === 0)}>◀ 이전</button>
        <button onClick={() => setI(Math.min(s.steps.length - 1, i + 1))} disabled={i === s.steps.length - 1}
          style={navBtnStyle(i === s.steps.length - 1)}>다음 ▶</button>
        <span style={{ fontSize: 11.5, color: C.sub, marginLeft: "auto" }}>
          <span style={{ color: C.b, fontWeight: 800 }}>■</span> v1 구버전&nbsp;&nbsp;
          <span style={{ color: C.o, fontWeight: 800 }}>■</span> v2 신버전
        </span>
      </div>
    </div>
  );
}

function ScaleTab() {
  return (<>
    <Sec no="173강" title="ECS 서비스 오토 스케일링" freq={3}>
      <P>ECS <O>태스크의 개수</O>를 자동으로 늘리고 줄이는 기능으로, <Bl>AWS Application Auto Scaling</Bl>을 사용합니다.
        스케일링 판단에 쓸 수 있는 지표는 딱 <O>3가지</O> — 시험에서 그대로 물어봅니다.</P>
      <Grid min={180}>
        <Card title="① 평균 CPU 사용률" color={C.o}>ECS 서비스의 평균 CPU 사용량</Card>
        <Card title="② 평균 메모리 사용률" color={C.b}>RAM 기준으로 스케일링</Card>
        <Card title="③ ALB 타깃당 요청 수" color={C.gr}>Request Count Per Target — ALB에서 오는 지표</Card>
      </Grid>
      <List>
        <Li t="Target Tracking">특정 CloudWatch 지표의 목표값을 유지하도록 자동 조절</Li>
        <Li t="Step Scaling">CloudWatch 경보를 기준으로 단계적으로 조절</Li>
        <Li t="Scheduled Scaling">예측 가능한 시간대(예: 매일 저녁 트래픽 급증)에 맞춰 미리 조절</Li>
      </List>

      <H3>⚠️ 두 가지 스케일링을 절대 혼동하지 말 것</H3>
      <P><O>ECS 서비스 오토 스케일링 = 태스크 레벨</O>이고, <Bl>EC2 오토 스케일링 = 인스턴스 레벨</Bl>입니다.
        태스크가 늘어나도 놓을 인스턴스가 없으면 소용없죠. 그래서 EC2 Launch Type에서는 인스턴스도 함께 늘려야 합니다.
        Fargate라면? 서버가 없으니 <O>태스크 스케일링만으로 끝</O> — 훨씬 쉬워서 권장됩니다.</P>
      <Dia vb="0 0 460 230" cap="Capacity Provider는 ASG와 짝을 이뤄, 태스크가 필요로 하는 만큼 인프라를 자동 확장">
        <Tx x={14} y={26} s={10.5} f={C.sub} a="start" w={700}>① 태스크 레벨 — ECS Service Auto Scaling</Tx>
        <Bx x={14} y={40} w={124} h={54} />
        <Tx x={76} y={61} s={10.5} w={700}>CloudWatch 지표</Tx>
        <Tx x={76} y={78} s={9} f={C.sub}>예: CPU 60% 초과</Tx>
        <Bx x={168} y={40} w={130} h={54} />
        <Tx x={233} y={61} s={10.5} w={700}>스케일링 정책</Tx>
        <Tx x={233} y={78} s={9} f={C.sub}>Target Tracking 등</Tx>
        <Bx x={328} y={34} w={118} h={66} f="#12263f" s={C.b + "66"} />
        <Tx x={387} y={60} s={10.5} f={C.b} w={700}>ECS 서비스</Tx>
        <Tx x={387} y={80} s={9.5} f={C.sub}>태스크 수 ⬆⬇</Tx>
        <Ar x1={138} y1={67} x2={166} y2={67} c="g" />
        <Ar x1={298} y1={67} x2={326} y2={67} c="b" />
        <Tx x={14} y={142} s={10.5} f={C.sub} a="start" w={700}>② 인스턴스 레벨 (EC2 Launch Type) — Capacity Provider 권장</Tx>
        <Bx x={14} y={156} w={132} h={54} />
        <Tx x={80} y={177} s={10.5} w={700}>태스크 놓을 공간 부족</Tx>
        <Tx x={80} y={194} s={9} f={C.sub}>용량 부족 감지</Tx>
        <Bx x={176} y={156} w={130} h={54} f="#33250f" s={C.o + "66"} />
        <Tx x={241} y={177} s={10.5} f={C.o} w={700}>Capacity Provider</Tx>
        <Tx x={241} y={194} s={9} f={C.sub}>ASG와 페어링</Tx>
        <Bx x={336} y={156} w={110} h={54} />
        <Tx x={391} y={177} s={10.5} w={700}>ASG가 EC2 추가</Tx>
        <Tx x={391} y={194} s={9} f={C.sub}>인스턴스 ⬆</Tx>
        <Ar x1={146} y1={183} x2={174} y2={183} c="g" />
        <Ar x1={306} y1={183} x2={334} y2={183} c="o" />
      </Dia>
      <Tip>EC2 Launch Type에서 인스턴스를 늘리는 두 방법: ASG 직접 스케일링(예: CPU 기준) vs
        <strong> ECS Cluster Capacity Provider(권장)</strong>. "새 태스크를 실행할 용량이 부족하면 자동으로 인프라를 확장" → Capacity Provider가 정답.</Tip>
    </Sec>

    <Sec no="174강" title="롤링 업데이트 — min / max 퍼센트" freq={2}>
      <P>서비스를 v1 → v2로 업데이트할 때, <O>Minimum healthy percent</O>(업데이트 중 유지할 최소 실행 비율, 기본 100%)와
        <O> Maximum percent</O>(desired 대비 동시에 존재 가능한 최대 비율, 기본 200%)로
        <Bl> 몇 개를 어떤 순서로 내리고 올릴지</Bl>를 제어합니다. 직접 단계를 넘겨보세요 (태스크 4개 기준):</P>
      <RollingDemo />
      <Tip>계산 문제로 출제됩니다. 핵심 규칙 — 실행 중 태스크가 <strong>min% 아래로 내려가면 안 되고</strong>,
        전체 태스크가 <strong>max%를 넘으면 안 됨</strong>. 클러스터에 여유 용량이 없어 max를 100%로 둬야 한다면,
        min을 100% 미만(예: 50%)으로 낮춰야만 업데이트가 진행됩니다.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 4 · 솔루션 아키텍처 (175강) ═══════════════ */
function ArchTab() {
  return (<>
    <Sec no="175강" title="ECS 솔루션 아키텍처 4가지 패턴" freq={2}>
      <P>시험은 이 4가지 패턴을 <Bl>시나리오 문제</Bl>로 바꿔서 냅니다. 그림째로 기억해 두세요.</P>

      <H3>① EventBridge로 태스크 실행 — 이벤트 기반</H3>
      <Dia vb="0 0 440 178" cap="완전 서버리스 아키텍처: 파일 업로드 → 자동 처리 → 결과 저장">
        <Bx x={14} y={26} w={76} h={44} />
        <Tx x={52} y={52} s={10.5}>사용자</Tx>
        <Bx x={122} y={26} w={84} h={44} f="#132e1d" s={C.gr + "66"} />
        <Tx x={164} y={52} s={10.5} f={C.gr}>S3 버킷</Tx>
        <Bx x={238} y={26} w={128} h={44} f="#241a33" s={C.p + "66"} />
        <Tx x={302} y={52} s={10.5} f={C.p}>EventBridge</Tx>
        <Bx x={238} y={104} w={128} h={44} f="#12263f" s={C.b + "66"} />
        <Tx x={302} y={124} s={10.5}>ECS 태스크 실행</Tx>
        <Tx x={302} y={140} s={8.5} f={C.sub}>(Fargate · Run Task)</Tx>
        <Bx x={96} y={104} w={100} h={44} />
        <Tx x={146} y={124} s={10.5}>DynamoDB</Tx>
        <Tx x={146} y={140} s={8.5} f={C.sub}>결과 저장</Tx>
        <Ar x1={90} y1={48} x2={120} y2={48} c="g" />
        <Ar x1={206} y1={48} x2={236} y2={48} c="gr" />
        <Tx x={222} y={20} s={8.5} f={C.sub}>이벤트</Tx>
        <Ar x1={302} y1={70} x2={302} y2={102} c="p" />
        <Ar x1={236} y1={126} x2={198} y2={126} c="b" />
        <Tx x={217} y={114} s={8.5} f={C.b}>Task Role</Tx>
      </Dia>

      <H3>② EventBridge 스케줄 — 정기 배치 작업</H3>
      <Dia vb="0 0 440 116" cap="예: 1시간마다 Fargate 태스크로 배치 처리 후 S3에 결과 저장">
        <Bx x={14} y={30} w={148} h={52} f="#241a33" s={C.p + "66"} />
        <Tx x={88} y={51} s={10.5} f={C.p} w={700}>EventBridge 스케줄</Tx>
        <Tx x={88} y={68} s={9} f={C.sub}>예: 1시간마다 (cron)</Tx>
        <Bx x={198} y={30} w={130} h={52} f="#12263f" s={C.b + "66"} />
        <Tx x={263} y={51} s={10.5}>ECS 태스크</Tx>
        <Tx x={263} y={68} s={9} f={C.sub}>Fargate 배치 작업</Tx>
        <Bx x={364} y={30} w={62} h={52} f="#132e1d" s={C.gr + "66"} />
        <Tx x={395} y={60} s={10.5} f={C.gr}>S3</Tx>
        <Ar x1={162} y1={56} x2={196} y2={56} c="p" />
        <Ar x1={328} y1={56} x2={362} y2={56} c="gr" />
      </Dia>

      <H3>③ SQS 큐 + 서비스 오토 스케일링</H3>
      <Dia vb="0 0 440 158" cap="태스크들이 SQS에서 메시지를 폴링. 메시지가 쌓이면 오토 스케일링으로 태스크 증가">
        <Bx x={14} y={52} w={108} h={52} f="#33250f" s={C.o + "66"} />
        <Tx x={68} y={73} s={11} f={C.o} w={700}>SQS 큐</Tx>
        <Tx x={68} y={90} s={9} f={C.sub}>메시지 대기</Tx>
        <Bx x={210} y={14} w={216} h={130} f="none" s={C.line} dash />
        <Tx x={318} y={32} s={9.5} f={C.sub}>ECS 서비스 (Auto Scaling)</Tx>
        {[44, 78, 112].map((y, i) => (
          <g key={i}>
            <Bx x={226} y={y} w={184} h={26} f="#12263f" s={C.b + "66"} r={7} />
            <Tx x={318} y={y + 17} s={9.5}>태스크</Tx>
          </g>
        ))}
        <Ar x1={224} y1={57} x2={126} y2={70} c="b" dash />
        <Ar x1={224} y1={91} x2={126} y2={78} c="b" dash />
        <Ar x1={224} y1={125} x2={126} y2={86} c="b" dash />
        <Tx x={172} y={44} s={9} f={C.b} w={700}>메시지 폴링</Tx>
      </Dia>

      <H3>④ 종료된 태스크 가로채기 (Intercept Stopped Tasks)</H3>
      <Dia vb="0 0 440 112" cap="태스크의 상태 변경(종료) 이벤트를 EventBridge가 감지 → SNS로 관리자에게 알림">
        <Bx x={14} y={30} w={132} h={52} f="#3a1416" s={C.r + "66"} />
        <Tx x={80} y={51} s={10.5} f={C.r} w={700}>ECS 태스크 종료</Tx>
        <Tx x={80} y={68} s={9} f={C.sub}>(Exited 이벤트)</Tx>
        <Bx x={180} y={30} w={128} h={52} f="#241a33" s={C.p + "66"} />
        <Tx x={244} y={60} s={10.5} f={C.p}>EventBridge</Tx>
        <Bx x={342} y={30} w={84} h={52} />
        <Tx x={384} y={51} s={10.5} w={700}>SNS</Tx>
        <Tx x={384} y={68} s={9} f={C.sub}>→ 관리자 이메일</Tx>
        <Ar x1={146} y1={56} x2={178} y2={56} c="r" />
        <Ar x1={308} y1={56} x2={340} y2={56} c="p" />
      </Dia>
      <Tip>"S3 업로드 시 자동으로 컨테이너 작업 실행" = ①, "매시간 배치" = ②(EventBridge 스케줄),
        "큐 길이에 따라 처리량 확장" = ③, "태스크가 죽으면 알림" = ④. 전부 <strong>서버리스 조합(Fargate + EventBridge)</strong>이 포인트입니다.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 5 · 태스크 정의 심화 (176강) ═══════════════ */
function TaskDefTab() {
  return (<>
    <Sec no="176강" title="태스크 정의(Task Definition)란" freq={3}>
      <P><O>태스크 정의</O>는 "ECS야, Docker 컨테이너를 이렇게 실행해줘"라고 알려주는
        <Bl> JSON 형식의 메타데이터</Bl>입니다. 하나의 태스크 정의에 <O>최대 10개 컨테이너</O>를 정의할 수 있습니다.</P>
      <Grid min={130}>
        <Card title="이미지 이름" color={C.o}>어떤 이미지를 실행할지</Card>
        <Card title="포트 바인딩" color={C.b}>컨테이너 포트 ↔ 호스트 포트</Card>
        <Card title="CPU · 메모리" color={C.gr}>태스크에 필요한 자원</Card>
        <Card title="환경 변수" color={C.p}>설정값·시크릿 주입</Card>
        <Card title="IAM Role" color={C.y}>태스크가 쓸 권한</Card>
        <Card title="네트워킹 · 로깅" color={C.r}>로그는 CloudWatch로</Card>
      </Grid>
    </Sec>

    <Sec no="176강" title="로드 밸런싱 ① EC2 Launch Type — 동적 호스트 포트 매핑" freq={3}>
      <P>태스크 정의에서 <O>컨테이너 포트만 정의하고 호스트 포트를 비워두면(0)</O>,
        각 컨테이너에 <Bl>무작위 호스트 포트</Bl>가 배정됩니다. 그래야 같은 인스턴스에 같은 앱 태스크를 여러 개 띄울 수 있죠.</P>
      <Dia vb="0 0 460 262" cap="호스트 포트를 비우면(0) 무작위 배정 → ALB가 동적 매핑을 자동으로 인식 (CLB는 불가!)">
        <Bx x={14} y={96} w={96} h={60} f="#33250f" s={C.o + "66"} />
        <Tx x={62} y={122} s={11.5} f={C.o} w={700}>ALB</Tx>
        <Tx x={62} y={140} s={8.5} f={C.sub}>SG: 웹 80/443</Tx>
        <Bx x={176} y={20} w={270} h={226} />
        <Tx x={311} y={40} s={11} f={C.sub}>EC2 인스턴스 1대</Tx>
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <Bx x={190} y={56 + r * 62} w={152} h={46} f="#12263f" s={C.b + "66"} />
            <Tx x={266} y={74 + r * 62} s={10.5}>ECS 태스크</Tx>
            <Tx x={266} y={90 + r * 62} s={8.5} f={C.sub}>컨테이너 포트 80</Tx>
            <Bx x={352} y={64 + r * 62} w={82} h={30} f="#3a300f" s={C.y + "66"} r={7} />
            <Tx x={393} y={83 + r * 62} s={9.5} f={C.y}>호스트 :{32768 + r}</Tx>
          </g>
        ))}
        <Ar x1={110} y1={112} x2={188} y2={79} c="o" />
        <Ar x1={110} y1={126} x2={188} y2={141} c="o" />
        <Ar x1={110} y1={140} x2={188} y2={203} c="o" />
      </Dia>
      <Tip>보안 그룹까지가 한 세트로 출제 — 호스트 포트를 예측할 수 없으므로
        <strong> EC2 인스턴스의 SG는 ALB의 SG로부터 "모든 포트"를 허용</strong>해야 합니다.</Tip>
    </Sec>

    <Sec no="176강" title="로드 밸런싱 ② Fargate — 태스크마다 고유 ENI" freq={3}>
      <P>Fargate는 인스턴스가 없으므로 호스트 포트 개념 자체가 없습니다. 대신 <O>태스크마다 전용
        ENI(고유 프라이빗 IP)</O>가 붙고, <Bl>컨테이너 포트만 정의</Bl>하면 됩니다.</P>
      <Dia vb="0 0 460 232" cap="ENI의 SG는 ALB로부터 포트 80만 허용하면 충분 (ALB SG는 웹에서 80/443)">
        <Bx x={14} y={86} w={96} h={60} f="#33250f" s={C.o + "66"} />
        <Tx x={62} y={112} s={11.5} f={C.o} w={700}>ALB</Tx>
        <Tx x={62} y={130} s={8.5} f={C.sub}>SG: 웹 80/443</Tx>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Bx x={200} y={16 + i * 72} w={240} h={56} f="#12263f" s={C.b + "66"} />
            <Tx x={320} y={38 + i * 72} s={11}>ECS 태스크 (Fargate)</Tx>
            <Tx x={320} y={56 + i * 72} s={9.5} f={C.b}>ENI 10.0.0.1{1 + i} → 포트 80</Tx>
          </g>
        ))}
        <Ar x1={110} y1={106} x2={198} y2={44} c="o" />
        <Ar x1={110} y1={116} x2={198} y2={116} c="o" />
        <Ar x1={110} y1={126} x2={198} y2={188} c="o" />
      </Dia>
    </Sec>

    <Sec no="176강" title="IAM Role · 환경 변수 · 데이터 볼륨" freq={3}>
      <H3>IAM Role은 태스크 정의 단위로</H3>
      <P>Task Role은 <O>태스크 정의 안에서 지정</O>하며, 그 정의로 생성된 <Bl>모든 태스크가 역할을 상속</Bl>합니다.
        콘솔에서는 두 가지 역할을 구분해서 지정합니다:</P>
      <Grid min={230}>
        <Card title="Task Role" color={C.b}><strong>앱 코드</strong>가 AWS API를 부를 때 사용 (S3, DynamoDB 등)</Card>
        <Card title="Task Execution Role" color={C.o}><strong>ECS/Fargate 자체</strong>가 사용 — ECR 이미지 pull, CloudWatch 로그 전송, SSM/Secrets에서 시크릿 조회</Card>
      </Grid>

      <H3>환경 변수 — 어디서 가져올 수 있나</H3>
      <Dia vb="0 0 440 246" cap="SSM·Secrets의 값은 컨테이너 시작 시 API로 가져와(fetch) 해석(resolve)되어 주입됨">
        {[
          ["하드코딩", "고정 값 · URL 등", 18, "#15203a", "#2b3a5c", C.txt],
          ["SSM Parameter Store", "API 키 · 공유 설정", 74, "#12263f", C.b + "66", C.b],
          ["Secrets Manager", "DB 비밀번호 등 민감정보", 130, "#241a33", C.p + "66", C.p],
          ["S3 환경 파일 (.env)", "대량(bulk) 일괄 주입", 186, "#132e1d", C.gr + "66", C.gr],
        ].map(([t, sub, y, f, s, col]) => (
          <g key={t}>
            <Bx x={14} y={y} w={168} h={42} f={f} s={s} />
            <Tx x={98} y={y + 18} s={10.5} f={col} w={700}>{t}</Tx>
            <Tx x={98} y={y + 34} s={8.5} f={C.sub}>{sub}</Tx>
          </g>
        ))}
        <Bx x={300} y={92} w={126} h={64} f="#33250f" s={C.o + "66"} />
        <Tx x={363} y={118} s={11.5} f={C.o} w={700}>ECS 태스크</Tx>
        <Tx x={363} y={136} s={8.5} f={C.sub}>시작 시 주입 · 해석</Tx>
        <Ar x1={184} y1={39} x2={298} y2={104} c="g" />
        <Ar x1={184} y1={95} x2={298} y2={116} c="b" />
        <Ar x1={184} y1={151} x2={298} y2={132} c="p" />
        <Ar x1={184} y1={207} x2={298} y2={144} c="gr" />
      </Dia>

      <H3>데이터 볼륨 (Bind Mount) — 사이드카 패턴</H3>
      <P><Bl>같은 태스크 정의 안의 여러 컨테이너</Bl>가 데이터를 공유하는 방법으로, EC2·Fargate 모두 동작합니다.</P>
      <Dia vb="0 0 440 240" cap="EC2 태스크 = 인스턴스 스토리지(인스턴스 수명 동안 유지) · Fargate = 임시(ephemeral) 스토리지 20~200GiB (기본 20GiB, 태스크 수명)">
        <Bx x={50} y={18} w={340} h={200} f="none" s={C.line} dash />
        <Tx x={220} y={38} s={10.5} f={C.sub}>ECS 태스크 (하나의 태스크 정의)</Tx>
        <Bx x={74} y={54} w={140} h={58} f="#12263f" s={C.b + "66"} />
        <Tx x={144} y={78} s={11}>앱 컨테이너</Tx>
        <Tx x={144} y={95} s={8.5} f={C.sub}>로그 · 메트릭 생성</Tx>
        <Bx x={226} y={54} w={140} h={58} f="#241a33" s={C.p + "66"} />
        <Tx x={296} y={78} s={11} f={C.p}>사이드카 컨테이너</Tx>
        <Tx x={296} y={95} s={8.5} f={C.sub}>메트릭 · 로그 전송</Tx>
        <Bx x={130} y={156} w={180} h={46} f="#33250f" s={C.o + "66"} />
        <Tx x={220} y={176} s={10.5} f={C.o} w={700}>공유 볼륨 (bind mount)</Tx>
        <Tx x={220} y={192} s={8.5} f={C.sub}>두 컨테이너가 함께 사용</Tx>
        <Ar x1={144} y1={114} x2={186} y2={154} c="o" />
        <Ar x1={296} y1={114} x2={254} y2={154} c="o" />
      </Dia>
      <Tip>"같은 태스크의 컨테이너끼리 데이터 공유" 또는 "앱 컨테이너 옆에서 <strong>메트릭·로그를 수집해 전송하는 사이드카</strong>" → bind mount.
        환경 변수는 "민감정보 → <strong>Secrets Manager / SSM</strong>", "대량 설정 → <strong>S3의 .env 파일</strong>"로 매칭하세요.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 6 · 태스크 배치 (178강) ═══════════════ */
const STRAT = {
  binpack: { name: "Binpack", color: C.o, layout: [4, 2, 0],
    desc: "CPU/메모리가 가장 덜 남은 인스턴스부터 꽉꽉 채워 배치 → 사용 인스턴스 수 최소화 = 비용 절감 💰" },
  spread: { name: "Spread", color: C.gr, layout: [2, 2, 2],
    desc: "지정한 기준(AZ, instanceId 등)으로 고르게 분산 → 고가용성 🛡 (AZ 하나가 죽어도 생존)" },
  random: { name: "Random", color: C.b, layout: [3, 1, 2],
    desc: "말 그대로 무작위 배치 🎲" },
};

function PlacementDemo() {
  const [k, setK] = useState("binpack");
  const cur = STRAT[k];
  const az = ["AZ-a", "AZ-b", "AZ-c"];
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 14,
      padding: "16px 15px", margin: "14px 0" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {Object.entries(STRAT).map(([key, v]) => (
          <button key={key} onClick={() => setK(key)} style={btnStyle(k === key, v.color)}>{v.name}</button>
        ))}
      </div>
      <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.65, marginBottom: 14 }}>{cur.desc}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {cur.layout.map((n, i) => (
          <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 12,
            background: C.panel, padding: "10px 8px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.sub, textAlign: "center",
              marginBottom: 8, lineHeight: 1.5 }}>
              인스턴스 {String.fromCharCode(65 + i)}<br />
              <span style={{ fontWeight: 600, fontFamily: MONO, fontSize: 10 }}>{az[i]}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} style={j < n
                  ? { height: 22, borderRadius: 6, background: cur.color + "33",
                      border: `1px solid ${cur.color}`, color: cur.color, fontSize: 10,
                      fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }
                  : { height: 22, borderRadius: 6, border: `1px dashed ${C.line}` }}>
                  {j < n ? "태스크" : ""}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 11.5, color: C.sub, marginTop: 12 }}>
        태스크 6개 배치 예시 (인스턴스당 용량 4)
      </div>
    </div>
  );
}

function PlacementTab() {
  return (<>
    <Sec no="178강" title="태스크 배치 (Task Placement)" freq={3}>
      <P><Bl>EC2 Launch Type 전용</Bl>입니다 — Fargate는 서버가 없으니 AWS가 알아서 배치하죠.
        새 태스크를 어느 인스턴스에 놓을지, ECS는 <O>CPU · 메모리 · 사용 가능한 포트</O>를 보고
        <O> 배치 전략(Strategy)</O>과 <O>배치 제약(Constraint)</O>에 따라 결정합니다 (best effort).</P>
      <List>
        <Li t="배치 프로세스">① CPU·메모리·포트 요구를 충족하는 인스턴스 식별 →
          ② 배치 제약을 만족하는 인스턴스 식별 → ③ 배치 전략을 가장 잘 만족하는 인스턴스 식별 → ④ 배치</Li>
      </List>

      <H3>배치 전략 3가지 — 버튼을 눌러 비교해 보세요</H3>
      <PlacementDemo />
      <P>전략은 <O>섞어 쓸 수도</O> 있습니다. 예: AZ로 spread한 뒤, 각 AZ 안에서는 memory로 binpack:</P>
      <CodeBlock>{`"placementStrategy": [
  { "type": "spread",  "field": "attribute:ecs.availability-zone" },
  { "type": "binpack", "field": "memory" }
]`}</CodeBlock>

      <H3>배치 제약 (Constraints) 2가지</H3>
      <Grid min={230}>
        <Card title="distinctInstance" color={C.o}>모든 태스크를 <strong>서로 다른 인스턴스</strong>에 배치</Card>
        <Card title="memberOf" color={C.b}><strong>Cluster Query Language</strong> 표현식을 만족하는 인스턴스에만 배치.
          예: <Code>attribute:ecs.instance-type =~ t2.*</Code> (t2 계열만)</Card>
      </Grid>
      <Tip>키워드 매칭 문제입니다 — <strong>비용 최소화 = binpack</strong>, <strong>고가용성 = spread(AZ)</strong>,
        "태스크를 전부 다른 인스턴스에" = <strong>distinctInstance</strong>, "특정 인스턴스 타입에만" = <strong>memberOf</strong>.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 7 · Amazon ECR (180강) ═══════════════ */
function EcrTab() {
  return (<>
    <Sec no="180강" title="Amazon ECR — 컨테이너 이미지 저장소" freq={2}>
      <P><O>ECR</O>(Elastic Container Registry)은 AWS에서 Docker 이미지를 저장·관리하는 서비스입니다.
        <Bl> 프라이빗</Bl>과 <Bl>퍼블릭</Bl>(Amazon ECR Public Gallery) 저장소를 모두 지원합니다.</P>
      <Dia vb="0 0 440 170" cap="push/pull 모두 IAM 권한 필요 — 접근 오류가 나면 IAM 정책부터 확인!">
        <Bx x={14} y={58} w={92} h={54} />
        <Tx x={60} y={80} s={10.5}>개발자</Tx>
        <Tx x={60} y={97} s={8.5} f={C.sub}>이미지 빌드</Tx>
        <Bx x={168} y={50} w={116} h={70} f="#33250f" s={C.o + "66"} />
        <Tx x={226} y={76} s={11.5} f={C.o} w={700}>Amazon ECR</Tx>
        <Tx x={226} y={94} s={8.5} f={C.sub}>이미지는 S3에 저장됨</Tx>
        <Bx x={340} y={58} w={88} h={54} />
        <Tx x={384} y={80} s={10.5}>ECS / EC2</Tx>
        <Tx x={384} y={97} s={8.5} f={C.sub}>컨테이너 실행</Tx>
        <Ar x1={106} y1={84} x2={166} y2={84} c="o" />
        <Tx x={136} y={72} s={9} f={C.o} w={700}>docker push</Tx>
        <Ar x1={284} y1={84} x2={338} y2={84} c="b" />
        <Tx x={311} y={72} s={9} f={C.b} w={700}>pull</Tx>
        <Tx x={220} y={148} s={10} f={C.y} w={700}>🔐 접근 제어는 전부 IAM</Tx>
      </Dia>
      <List>
        <Li>ECS와 <O>완전 통합</O>, 이미지는 백엔드에서 <Bl>S3에 저장</Bl></Li>
        <Li>지원 기능: <O>이미지 취약점 스캐닝</O>, 버저닝, 이미지 태그, 이미지 라이프사이클 정책</Li>
      </List>

      <H3>로그인 커맨드 — 개발자 시험(DVA) 단골</H3>
      <CodeBlock>{`# 1) ECR 로그인 (get-login-password 방식이 최신)
aws ecr get-login-password --region ap-northeast-1 \\
  | docker login --username AWS --password-stdin \\
    123456789012.dkr.ecr.ap-northeast-1.amazonaws.com

# 2) 이미지 push / pull
docker push 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/demo:latest
docker pull 123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/demo:latest`}</CodeBlock>
      <Tip><Code>get-login-password</Code>를 파이프로 <Code>docker login</Code>에 넘기는 형태를 기억하세요
        (구버전 <Code>get-login</Code>은 폐지). username은 항상 <strong>AWS</strong> 고정.
        그리고 "이미지 pull 권한 오류" 시나리오의 정답은 거의 항상 <strong>IAM 정책 확인</strong>입니다.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 8 · Copilot & EKS (182·184강) ═══════════════ */
function ExtraTab() {
  return (<>
    <Sec no="182강" title="AWS Copilot — 컨테이너 앱 전용 CLI" freq={1}>
      <P><O>AWS Copilot</O>은 프로덕션 수준의 컨테이너 앱을 <Bl>빌드·릴리스·운영</Bl>하게 해주는 CLI 도구입니다.
        인프라의 복잡함 대신 <O>앱 개발에만 집중</O>할 수 있게 해줍니다.</P>
      <Grid min={200}>
        <Card title="어디에 배포?" color={C.o}><strong>ECS · Fargate · App Runner</strong>에 배포</Card>
        <Card title="무엇을 자동화?" color={C.b}>프로비저닝, 오토 스케일링, 헬스체크 등 잘 설계된(well-architected) 인프라 구성</Card>
        <Card title="어떻게 정의?" color={C.gr}><strong>YAML 파일 하나</strong>로 마이크로서비스 아키텍처 기술</Card>
        <Card title="배포·운영" color={C.p}>커맨드 한 번으로 <strong>CodePipeline</strong> 통한 자동 배포, 로그·헬스 상태 트러블슈팅</Card>
      </Grid>
      <Tip>"컨테이너 앱을 <strong>CLI로 간단히 빌드·배포</strong>하고 싶다" 정도의 키워드 매칭만 나옵니다. 깊게는 안 물어봐요.</Tip>
    </Sec>

    <Sec no="184강" title="Amazon EKS — 관리형 Kubernetes" freq={1}>
      <P><O>EKS</O>(Elastic Kubernetes Service)는 AWS에서 <Bl>관리형 Kubernetes 클러스터</Bl>를 띄우는 서비스입니다.
        K8s는 컨테이너 배포·스케일링·관리를 자동화하는 <O>오픈소스</O> 시스템으로, ECS의 대안이지만 <Bl>API가 다릅니다</Bl>.
        EC2 모드(워커 노드 배포)와 Fargate 모드(서버리스) 모두 지원하고, 여러 리전에 배포하려면 리전마다 클러스터를 만듭니다.</P>
      <Dia vb="0 0 460 290" cap="Pod = K8s에서 컨테이너를 담는 최소 실행 단위 (ECS의 태스크에 대응)">
        <Bx x={10} y={26} w={440} h={206} f="none" s={C.line} dash />
        <Tx x={230} y={46} s={11} f={C.sub}>Amazon EKS 클러스터</Tx>
        <Bx x={24} y={60} w={200} h={158} />
        <Tx x={124} y={80} s={10} w={700}>관리형 노드 그룹 (EC2 · ASG)</Tx>
        {[0, 1].map((i) => (
          <g key={i}>
            <Bx x={36 + i * 94} y={92} w={84} h={112} f={C.panel2} />
            <Tx x={78 + i * 94} y={108} s={9} f={C.sub}>노드 (EC2)</Tx>
            <Bx x={44 + i * 94} y={118} w={68} h={26} f="#12263f" s={C.b + "66"} r={6} />
            <Tx x={78 + i * 94} y={135} s={9.5} f={C.b}>Pod</Tx>
            <Bx x={44 + i * 94} y={152} w={68} h={26} f="#12263f" s={C.b + "66"} r={6} />
            <Tx x={78 + i * 94} y={169} s={9.5} f={C.b}>Pod</Tx>
          </g>
        ))}
        <Bx x={236} y={60} w={200} h={158} />
        <Tx x={336} y={80} s={10} w={700}>Fargate 모드 — 노드 없음</Tx>
        {[[250, 100], [344, 100], [250, 144]].map(([x, y], i) => (
          <g key={i}>
            <Bx x={x} y={y} w={80} h={30} f="#33250f" s={C.o + "66"} r={7} />
            <Tx x={x + 40} y={y + 19} s={9.5} f={C.o}>Pod</Tx>
          </g>
        ))}
        <Tx x={336} y={200} s={9.5} f={C.sub}>서버 관리 ✕ — 서버리스</Tx>
        <Tx x={230} y={256} s={10} f={C.sub}>데이터 볼륨: StorageClass 매니페스트 + CSI 드라이버 사용</Tx>
        <Tx x={230} y={274} s={10} f={C.gr} w={700}>EBS · EFS (Fargate 호환 유일!) · FSx for Lustre · FSx for NetApp ONTAP</Tx>
      </Dia>
      <H3>노드 타입 3가지</H3>
      <Grid min={200}>
        <Card title="Managed Node Groups" color={C.o}>AWS가 노드(EC2)를 생성·관리. ASG의 일부로 운영, 온디맨드·스팟 지원</Card>
        <Card title="Self-Managed Nodes" color={C.b}>노드를 직접 생성·등록·관리. 사전 구성된 <strong>EKS Optimized AMI</strong> 사용 가능</Card>
        <Card title="AWS Fargate" color={C.gr}>유지관리 제로, <strong>노드 자체가 없음</strong></Card>
      </Grid>
      <Tip>키워드는 두 개 — 회사가 <strong>이미 Kubernetes를 쓰고 있거나</strong>, <strong>"클라우드에 종속되지 않게(cloud-agnostic)"</strong>라는
        표현이 나오면 EKS. 그리고 <strong>EKS + Fargate에서 쓸 수 있는 스토리지는 EFS뿐</strong>입니다.</Tip>
    </Sec>
  </>);
}

/* ═══════════════ TAB 9 · 시험 요약 ═══════════════ */
const thStyle = { textAlign: "left", padding: "9px 10px", fontSize: 12, color: C.sub,
  borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap" };
const tdStyle = { padding: "10px 10px", fontSize: 12.5, lineHeight: 1.6,
  borderBottom: `1px solid ${C.line}`, verticalAlign: "top" };

function SummaryTab() {
  const rows = [
    ["Fargate vs EC2 타입", "\"서버리스 · 인프라 관리 없음\" = Fargate / 인스턴스 제어 필요 = EC2", 3],
    ["ECS IAM 역할", "Agent·실행용 = Instance Profile(Execution Role) / 앱용 = Task Role(태스크 정의에서 지정)", 3],
    ["서비스 오토 스케일링", "지표 3종: CPU · 메모리 · ALB 타깃당 요청 수 / 인프라 확장 = Capacity Provider", 3],
    ["동적 호스트 포트 매핑", "EC2 타입 + ALB / EC2 SG는 ALB SG로부터 모든 포트 허용", 3],
    ["Fargate 네트워킹", "태스크마다 고유 ENI(프라이빗 IP), 컨테이너 포트만 정의", 3],
    ["환경변수 · 시크릿", "SSM Parameter Store / Secrets Manager / S3 .env(대량)", 3],
    ["태스크 배치", "binpack=비용 절감 / spread(AZ)=고가용성 / distinctInstance / memberOf", 3],
    ["EFS 볼륨", "멀티 AZ 공유 스토리지 / Fargate+EFS=서버리스 / S3 마운트 불가", 3],
    ["롤링 업데이트", "min healthy % / max % 로 업데이트 순서 계산", 2],
    ["솔루션 아키텍처", "EventBridge(이벤트·스케줄) / SQS 폴링 스케일링 / 종료 태스크 → SNS 알림", 2],
    ["ECR", "get-login-password 로그인 / 접근 오류 = IAM 확인 / 스캐닝·라이프사이클", 2],
    ["Bind Mount 사이드카", "같은 태스크 내 컨테이너 간 공유 / Fargate 임시 스토리지 20~200GiB", 2],
    ["AWS Copilot", "컨테이너 앱 빌드·배포용 CLI (ECS·Fargate·App Runner)", 1],
    ["Amazon EKS", "관리형 K8s / cloud-agnostic 키워드 / EKS+Fargate 스토리지는 EFS만", 1],
    ["Docker 기초", "컨테이너는 하이퍼바이저 없이 호스트 자원 공유", 1],
  ];
  return (<>
    <Sec no="총정리" title="시험 직전 핵심 요약표">
      <P>시험장 들어가기 전, 이 표만 훑으세요. 빈출도 높은 순으로 정렬했습니다.</P>
      <div style={{ overflowX: "auto", border: `1px solid ${C.line}`, borderRadius: 12,
        background: C.panel2 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead><tr>
            <th style={thStyle}>주제</th><th style={thStyle}>한 줄 핵심</th><th style={thStyle}>빈출도</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? "transparent" : "rgba(255,255,255,.02)" }}>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{r[0]}</td>
                <td style={{ ...tdStyle, color: C.sub }}>{r[1]}</td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}><Freq n={r[2]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>🚨 함정 모음 — 오답 유도 포인트</H3>
      <List>
        <Li><Bl>S3는 파일 시스템으로 마운트 불가</Bl> — 공유 스토리지는 EFS</Li>
        <Li><Bl>CLB</Bl>는 동적 포트 매핑 불가 + Fargate 미지원</Li>
        <Li>태스크 배치 전략/제약은 <Bl>EC2 Launch Type에만</Bl> 해당</Li>
        <Li>ECS Service Auto Scaling(태스크) ≠ EC2 Auto Scaling(인스턴스)</Li>
        <Li>EKS + Fargate에서 쓸 수 있는 볼륨은 <Bl>EFS 하나뿐</Bl></Li>
        <Li>ECR pull 실패 → 네트워크보다 <Bl>IAM 정책부터</Bl> 확인</Li>
      </List>
      <Note>※ 빈출도(★)는 공식 통계가 아니라 강의에서의 강조도와 수험 후기 경향을 바탕으로 한 추정치입니다.
        참고용으로만 활용하고, 모든 개념을 고르게 학습하는 것을 권장합니다.</Note>
    </Sec>
  </>);
}

/* ═══════════════ 메인 앱 ═══════════════ */
export default function App() {
  const [tab, setTab] = useState("docker");
  const tabs = [
    { id: "docker", label: "🐳 Docker", comp: DockerTab },
    { id: "ecs", label: "📦 ECS 기초", comp: EcsTab },
    { id: "scale", label: "⚖️ 스케일링·배포", comp: ScaleTab },
    { id: "arch", label: "🏗️ 아키텍처", comp: ArchTab },
    { id: "taskdef", label: "📋 태스크 정의", comp: TaskDefTab },
    { id: "placement", label: "🎯 태스크 배치", comp: PlacementTab },
    { id: "ecr", label: "🗂️ ECR", comp: EcrTab },
    { id: "extra", label: "🚀 Copilot·EKS", comp: ExtraTab },
    { id: "summary", label: "✅ 시험 요약", comp: SummaryTab },
  ];
  const Cur = tabs.find((t) => t.id === tab).comp;
  const go = (id) => { setTab(id); window.scrollTo(0, 0); };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.txt, fontFamily: FONT,
      WebkitFontSmoothing: "antialiased" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 60px" }}>
        <header style={{ padding: "34px 0 18px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".22em", color: C.o,
            fontFamily: MONO, marginBottom: 12 }}>AWS CERTIFICATION · CONTAINER SECTION</div>
          <h1 style={{ fontSize: 27, fontWeight: 800, margin: 0, lineHeight: 1.3,
            letterSpacing: "-0.02em" }}>ECS · ECR · Fargate 완전 정리</h1>
          <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.7, margin: "10px 0 14px" }}>
            Docker 기초부터 EKS까지 — 시험 빈출 포인트 중심 (강의 168–184, 실습 제외)
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Freq n={3} /><Freq n={2} /><Freq n={1} />
          </div>
        </header>
        <nav style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(10,14,23,.92)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          margin: "0 -16px", padding: "10px 16px", borderBottom: `1px solid ${C.line}`,
          display: "flex", gap: 8, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => go(t.id)}
              style={{ ...btnStyle(tab === t.id), flex: "0 0 auto", whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </nav>
        <main style={{ paddingTop: 28 }}><Cur /></main>
        <footer style={{ marginTop: 30, paddingTop: 16, borderTop: `1px solid ${C.line}`,
          fontSize: 11.5, color: C.sub, lineHeight: 1.7 }}>
          ※ 빈출도는 공식 자료가 아닌 강의 강조도·수험 후기 기반 추정치입니다.
          실습 강의(171·172·177·179·181·183)의 시험 관련 포인트는 각 개념 섹션에 녹여 정리했습니다.
        </footer>
      </div>
    </div>
  );
}
