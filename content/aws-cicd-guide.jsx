//opus 4.8 max
import React, { useState, useEffect, useRef } from "react";
import {
  Workflow, GitBranch, Github, Package, Hammer, Rocket, Server,
  Search, Cpu, AlertTriangle, ChevronLeft, ChevronRight, ChevronRight as Chev,
  CheckCircle2, KeyRound, Lock, Boxes, Gauge, ScanSearch, Layers,
  FileCode2, GitCommit, ShieldCheck, Container, ListChecks, Repeat,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 *  AWS DVA · CI/CD — 인터랙티브 학습 가이드
 *  구조 자체가 하나의 파이프라인. 각 서비스는 색으로 구분.
 * ------------------------------------------------------------------ */

const ACCENT = {
  amber:    "#FFA23A",
  source:   "#5B9BD5",
  git:      "#A78BFA",
  pipe:     "#FFA23A",
  build:    "#34C892",
  deploy:   "#FF6E6E",
  artifact: "#2DBBD4",
  guru:     "#C08CFF",
  grey:     "#7A8A8C",
};

const SECTIONS = [
  { id:"intro",    n:"00", label:"CI/CD 개요",        tag:"overview",       accent:"amber",    icon:Workflow,    freq:{lvl:0,txt:"핵심 개념",special:true} },
  { id:"commit",   n:"01", label:"CodeCommit",         tag:"CodeCommit",     accent:"source",   icon:GitCommit,   freq:{lvl:3,txt:"중간"} },
  { id:"eol",      n:"02", label:"CodeCommit 현황",    tag:"GA Returned",accent:"grey",     icon:AlertTriangle,freq:{lvl:1,txt:"낮음 · 필수 인지"} },
  { id:"github",   n:"03", label:"GitHub 연동",        tag:"GitHub",         accent:"git",      icon:Github,      freq:{lvl:2,txt:"낮음~중간"} },
  { id:"pipeline", n:"04", label:"CodePipeline",       tag:"CodePipeline",   accent:"pipe",     icon:Workflow,    freq:{lvl:4,txt:"높음"} },
  { id:"build",    n:"05", label:"CodeBuild",          tag:"CodeBuild",      accent:"build",    icon:Hammer,      freq:{lvl:4,txt:"높음"} },
  { id:"deploy",   n:"06", label:"CodeDeploy",         tag:"CodeDeploy",     accent:"deploy",   icon:Rocket,      freq:{lvl:5,txt:"매우 높음"} },
  { id:"ec2asg",   n:"07", label:"EC2 · ASG 배포",     tag:"CodeDeploy",     accent:"deploy",   icon:Server,      freq:{lvl:3,txt:"중간~높음"} },
  { id:"artifact", n:"08", label:"CodeArtifact",       tag:"CodeArtifact",   accent:"artifact", icon:Package,     freq:{lvl:2,txt:"낮음~중간"} },
  { id:"guru",     n:"09", label:"CodeGuru",           tag:"CodeGuru",       accent:"guru",     icon:ScanSearch,  freq:{lvl:3,txt:"중간"} },
  { id:"agent",    n:"10", label:"CodeGuru 에이전트",  tag:"Profiler Agent", accent:"guru",     icon:Gauge,       freq:{lvl:1,txt:"낮음"} },
  { id:"summary",  n:"11", label:"요약 · 치트시트",    tag:"summary",        accent:"amber",    icon:ListChecks,  freq:{lvl:0,txt:"복습",special:true} },
];

/* ---------- 작은 UI 조각들 ---------- */

function Freq({ freq, size = "sm" }) {
  if (freq.special) {
    return (
      <span className={`freq freq-${size} freq-special`}>
        <span className="freq-star">◆</span>{freq.txt}
      </span>
    );
  }
  return (
    <span className={`freq freq-${size}`} title={`빈출빈도: ${freq.txt}`}>
      <span className="freq-bars" aria-hidden>
        {[0,1,2,3,4].map(i => (
          <i key={i} className={i < freq.lvl ? "on" : ""} />
        ))}
      </span>
      <span className="freq-txt">{freq.txt}</span>
    </span>
  );
}

/* 가로 플로우: 자식 박스들을 화살표로 연결 (모바일에선 세로로 전환) */
function Flow({ children }) {
  const items = React.Children.toArray(children);
  return (
    <div className="flow">
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < items.length - 1 && <span className="farrow" aria-hidden><Chev size={18} /></span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function FBox({ icon:Icon, title, sub, color = "var(--amber)", dim = false, wide = false }) {
  return (
    <div className={`fbox${dim ? " dim" : ""}${wide ? " wide" : ""}`} style={{ "--fb": color }}>
      {Icon && <span className="fbox-ic"><Icon size={18} /></span>}
      <span className="fbox-txt">
        <span className="fbox-t">{title}</span>
        {sub && <span className="fbox-s">{sub}</span>}
      </span>
    </div>
  );
}

function Callout({ kind = "exam", title, icon:Icon, children }) {
  const Def = kind === "warn" ? AlertTriangle : kind === "tip" ? CheckCircle2 : ListChecks;
  const I = Icon || Def;
  return (
    <div className={`callout callout-${kind}`}>
      <div className="callout-h"><I size={16} /><span>{title}</span></div>
      <div className="callout-b">{children}</div>
    </div>
  );
}

function KV({ k, children }) {
  return (
    <div className="kv"><span className="kv-k">{k}</span><span className="kv-v">{children}</span></div>
  );
}

function Frame({ cap, children, tight = false }) {
  return (
    <figure className={`frame${tight ? " tight" : ""}`}>
      <div className="frame-body">{children}</div>
      {cap && <figcaption className="frame-cap">{cap}</figcaption>}
    </figure>
  );
}

function Chip({ children, c }) {
  return <span className="chip" style={c ? { "--chip": c } : undefined}>{children}</span>;
}

/* ---------- 각 섹션 콘텐츠 ---------- */

function Intro() {
  return (
    <>
      <p className="lead">
        <b>CI/CD</b>는 코드를 <b>빠르고 안정적으로</b> 배포하기 위한 개발 방법론입니다.
        수동 배포의 느림·실수를 자동화로 없애는 것이 목표죠. AWS는 이 흐름의 각 단계를 담당하는
        전용 서비스들을 제공하며, 이들을 하나로 엮으면 완전 자동화된 파이프라인이 됩니다.
      </p>

      <Frame cap="CI/CD 전체 흐름 — 코드가 저장소에서 프로덕션까지 자동으로 흐른다">
        <div className="hero-pipe">
          <div className="hero-band"><span>CodePipeline 이 전체를 오케스트레이션</span></div>
          <div className="hero-track">
            <span className="hero-flow" aria-hidden />
            <Flow>
              <FBox icon={GitBranch} title="개발자" sub="git push" color="#8FA3B8" />
              <FBox icon={GitCommit} title="Source" sub="CodeCommit / GitHub" color={ACCENT.source} />
              <FBox icon={Hammer} title="Build & Test" sub="CodeBuild" color={ACCENT.build} />
              <FBox icon={Rocket} title="Deploy" sub="CodeDeploy" color={ACCENT.deploy} />
              <FBox icon={Server} title="Production" sub="EC2 / Lambda / ECS" color="#8FA3B8" />
            </Flow>
          </div>
        </div>
      </Frame>

      <div className="split-h">
        <div className="split-col">
          <h4 className="mini-h">CI — 지속적 통합 <span className="mini-en">Continuous Integration</span></h4>
          <p>개발자가 코드를 <b>자주</b> push → 빌드 서버가 <b>자동으로 빌드·테스트</b>. 버그를 빨리 발견하고 통합 지옥을 피합니다. AWS에서는 <b>CodeBuild</b>가 담당.</p>
        </div>
        <div className="split-col">
          <h4 className="mini-h">CD — 지속적 배포 <span className="mini-en">Continuous Delivery / Deployment</span></h4>
          <p>검증된 코드를 <b>자동으로 안정적으로</b> 배포. 사람 개입을 최소화합니다. AWS에서는 <b>CodeDeploy</b>가 담당.</p>
        </div>
      </div>

      <h4 className="mini-h">AWS 서비스 지도</h4>
      <div className="mapgrid">
        {[
          { i:GitCommit, c:ACCENT.source, t:"CodeCommit", d:"관리형 Git 저장소 (2025-11 GA 복귀)" },
          { i:Github, c:ACCENT.git, t:"GitHub", d:"외부 Git 저장소 연동" },
          { i:Workflow, c:ACCENT.pipe, t:"CodePipeline", d:"전체 흐름 오케스트레이션" },
          { i:Hammer, c:ACCENT.build, t:"CodeBuild", d:"컴파일 · 테스트 · 패키징" },
          { i:Rocket, c:ACCENT.deploy, t:"CodeDeploy", d:"배포 자동화" },
          { i:Package, c:ACCENT.artifact, t:"CodeArtifact", d:"의존성 · 패키지 관리" },
          { i:ScanSearch, c:ACCENT.guru, t:"CodeGuru", d:"ML 코드 리뷰 · 성능 분석" },
        ].map((m) => (
          <div className="mapcard" key={m.t} style={{ "--mc": m.c }}>
            <span className="mapcard-ic"><m.i size={16} /></span>
            <div><div className="mapcard-t">{m.t}</div><div className="mapcard-d">{m.d}</div></div>
          </div>
        ))}
      </div>

      <Callout kind="tip" title="시험 관점 — 어떤 서비스가 무슨 일?">
        문제는 대개 <b>“이 시나리오에 맞는 서비스는?”</b> 형태로 나옵니다. 저장소=Source, 빌드=CodeBuild,
        배포=CodeDeploy, 흐름 연결=CodePipeline 이라는 <b>역할 매핑</b>만 확실하면 절반은 풀립니다.
      </Callout>
    </>
  );
}

function Commit() {
  return (
    <>
      <p className="lead">
        <b>CodeCommit</b>은 AWS의 <b>관리형 Git 소스 관리</b> 서비스입니다. 코드가 <b>내 AWS 계정 안에만</b> 저장되어
        보안·규정 준수에 유리한 것이 핵심 특징이에요.
      </p>

      <div className="feat-row">
        <Chip c={ACCENT.source}>Private Git 저장소</Chip>
        <Chip c={ACCENT.source}>용량 제한 없음</Chip>
        <Chip c={ACCENT.source}>완전 관리형</Chip>
        <Chip c={ACCENT.source}>고가용성</Chip>
        <Chip c={ACCENT.source}>Git으로 상호작용</Chip>
      </div>

      <Frame cap="CodeCommit 접근 — 인증 → IAM 인가 → 암호화된 저장소">
        <Flow>
          <FBox icon={KeyRound} title="개발자 인증" sub="SSH Key / HTTPS" color="#8FA3B8" />
          <FBox icon={ShieldCheck} title="IAM 인가" sub="IAM Policy로 접근 제어" color="#FFB347" />
          <FBox icon={Lock} title="CodeCommit 저장소" sub="KMS 암호화 · HTTPS/SSH" color={ACCENT.source} />
        </Flow>
      </Frame>

      <div className="split-h">
        <div className="split-col">
          <h4 className="mini-h">인증 <span className="mini-en">Authentication</span></h4>
          <ul className="ul">
            <li><b>SSH Keys</b> — IAM 사용자에 공개키 등록</li>
            <li><b>HTTPS</b> — AWS CLI <b>Credential Helper</b> 또는 Git Credentials 생성</li>
            <li>계정 비밀번호로 직접 로그인하는 방식은 <b>없음</b></li>
          </ul>
        </div>
        <div className="split-col">
          <h4 className="mini-h">인가 · 암호화</h4>
          <ul className="ul">
            <li><b>인가</b>: IAM Policy로 저장소별 권한 제어</li>
            <li><b>저장 시</b>: KMS로 자동 암호화 (at rest)</li>
            <li><b>전송 시</b>: HTTPS 또는 SSH (in transit)</li>
            <li><b>교차 계정</b>: IAM Role + STS <span className="mono">AssumeRole</span></li>
          </ul>
        </div>
      </div>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li>인증 수단은 <b>SSH 또는 HTTPS(자격증명 헬퍼/Git credentials)</b>. “비밀번호 로그인”은 함정.</li>
          <li>접근 제어 = <b>IAM Policy</b>, 교차 계정 접근 = <b>IAM Role + STS</b>.</li>
          <li>암호화는 <b>자동</b>(KMS at rest, 전송 중 HTTPS/SSH) — 별도 설정 불필요.</li>
        </ul>
      </Callout>
    </>
  );
}

function Eol() {
  return (
    <>
      <Callout kind="warn" title="CodeCommit — 신규 중단(2024) → GA 복귀(2025-11-24)">
        <p style={{ margin:0 }}>
          2024년 7월 25일 신규 고객 제공이 한때 중단됐으나, <b>2025년 11월 24일 GA로 복귀</b>하여
          현재 신규 고객도 다시 CodeCommit을 생성·사용할 수 있습니다.
        </p>
      </Callout>

      <p className="lead">
        AWS는 <b>GitHub · GitLab · Bitbucket</b> 같은 외부 Git 제공자 연동도 폭넓게 지원합니다.
        시험 대비 관점에서 정리하면:
      </p>

      <Frame cap="방향 전환 — 관리형 저장소에서 외부 Git 연동으로" tight>
        <Flow>
          <FBox icon={GitCommit} title="CodeCommit" sub="GA 복귀(2025-11)" color={ACCENT.grey} />
          <FBox icon={Repeat} title="AWS 권장" sub="외부 Git 사용" color="#FFB347" />
          <FBox icon={Github} title="GitHub / GitLab / Bitbucket" sub="CodeConnections로 연동" color={ACCENT.git} wide />
        </Flow>
      </Frame>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li>여전히 문제에 <b>CodeCommit이 등장</b>할 수 있음 — 개념(인증/역할)은 그대로 알아둘 것.</li>
          <li>“새 프로젝트의 저장소 선택” 류 최신 시나리오는 <b>GitHub 연동(CodeConnections)</b>이 정답 쪽.</li>
          <li>핵심은 “저장소가 무엇이든 <b>Source 단계의 역할</b>은 동일하다”는 점.</li>
        </ul>
      </Callout>
    </>
  );
}

function GitHub() {
  return (
    <>
      <p className="lead">
        <b>GitHub</b>은 가장 널리 쓰이는 서드파티 Git 저장소로, AWS의 CodePipeline·CodeBuild와 연동됩니다.
        이 연결의 다리 역할을 <b>AWS CodeConnections</b>(구 CodeStar Connections)가 합니다.
      </p>

      <Frame cap="GitHub → CodeConnections(OAuth 기반 안전 연결) → AWS 서비스">
        <Flow>
          <FBox icon={Github} title="GitHub 저장소" sub="commit / PR" color={ACCENT.git} />
          <FBox icon={GitBranch} title="CodeConnections" sub="구 CodeStar Connections" color="#FFB347" wide />
          <FBox icon={Workflow} title="CodePipeline / CodeBuild" sub="Source 단계로 사용" color={ACCENT.pipe} wide />
        </Flow>
      </Frame>

      <div className="split-h">
        <div className="split-col">
          <h4 className="mini-h">연동 방식</h4>
          <ul className="ul">
            <li><b>CodeConnections</b>가 GitHub ↔ AWS 간 <b>OAuth 기반 안전 연결</b> 관리</li>
            <li>파이프라인의 <b>Source 단계</b>에서 GitHub 저장소를 소스로 지정</li>
          </ul>
        </div>
        <div className="split-col">
          <h4 className="mini-h">자동 트리거</h4>
          <ul className="ul">
            <li><b>Webhook</b>으로 커밋 발생 시 파이프라인 자동 실행</li>
            <li>수동 폴링 대신 이벤트 기반 → 빠른 반응</li>
          </ul>
        </div>
      </div>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li>GitHub을 파이프라인 소스로 쓰려면 → <b>CodeConnections(CodeStar Connections)</b>로 연결.</li>
          <li>커밋 시 자동 실행 = <b>Webhook</b> 기반 트리거.</li>
        </ul>
      </Callout>
    </>
  );
}

function Pipeline() {
  const stages = [
    { t:"Source", d:"CodeCommit · GitHub · ECR · S3", c:ACCENT.source, i:GitCommit },
    { t:"Build",  d:"CodeBuild · Jenkins", c:ACCENT.build, i:Hammer },
    { t:"Test",   d:"CodeBuild · 3rd party", c:"#FFB347", i:ListChecks },
    { t:"Deploy", d:"CodeDeploy · Beanstalk · CFN · ECS · S3", c:ACCENT.deploy, i:Rocket },
    { t:"Invoke", d:"Lambda · Step Functions", c:ACCENT.guru, i:Cpu },
  ];
  return (
    <>
      <p className="lead">
        <b>CodePipeline</b>은 CI/CD 워크플로우를 <b>시각적으로 오케스트레이션</b>하는 도구입니다.
        여러 <b>단계(Stage)</b>로 구성되고, 각 단계의 결과물(<b>Artifact</b>)은 <b>S3 버킷</b>에 저장되어 다음 단계로 전달됩니다.
      </p>

      <Frame cap="단계 사이로 아티팩트가 S3를 거쳐 흐른다">
        <div className="pipe-stages">
          {stages.map((s, i) => (
            <React.Fragment key={s.t}>
              <div className="pstage" style={{ "--ps": s.c }}>
                <span className="pstage-ic"><s.i size={16} /></span>
                <div className="pstage-t">{s.t}</div>
                <div className="pstage-d">{s.d}</div>
              </div>
              {i < stages.length - 1 && (
                <div className="pstage-link" aria-hidden>
                  <Chev size={16} />
                  <span className="pstage-art"><Package size={11} /> S3 artifact</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Frame>

      <div className="split-h">
        <div className="split-col">
          <h4 className="mini-h">구성 요소</h4>
          <ul className="ul">
            <li>각 단계는 <b>순차 또는 병렬</b> 액션 포함 가능</li>
            <li><b>Manual Approval</b>(수동 승인) 단계 삽입 가능</li>
            <li>아티팩트는 <b>S3</b>에 저장·전달 (단계 간 산출물)</li>
          </ul>
        </div>
        <div className="split-col">
          <h4 className="mini-h">모니터링 · 문제 해결</h4>
          <ul className="ul">
            <li>상태 변화 → <b>EventBridge</b>(구 CloudWatch Events)로 알림</li>
            <li>API 호출 감사 → <b>CloudTrail</b></li>
            <li>단계 실패 → 파이프라인 중단, 콘솔에서 상세 확인</li>
            <li>액션 수행 실패 → <b>IAM Service Role 권한</b> 점검</li>
          </ul>
        </div>
      </div>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li><b>아티팩트는 S3</b>에 저장되어 단계 간 전달된다 — 자주 나옴.</li>
          <li>파이프라인 상태 변화 감지/알림 = <b>EventBridge(CloudWatch Events)</b>.</li>
          <li>“파이프라인이 특정 액션을 못 한다” → <b>IAM Service Role</b> 확인이 정답.</li>
          <li>수동 승인이 필요하면 → <b>Manual Approval</b> 액션 추가.</li>
        </ul>
      </Callout>
    </>
  );
}

function Build() {
  const phases = ["install", "pre_build", "build", "post_build"];
  return (
    <>
      <p className="lead">
        <b>CodeBuild</b>은 완전 관리형 <b>지속적 통합(빌드)</b> 서비스입니다(Jenkins 대안).
        소스를 <b>컴파일·테스트</b>하고 배포 가능한 <b>패키지(아티팩트)</b>를 만듭니다.
        빌드 지침은 <b><span className="mono">buildspec.yml</span></b>에 정의하고, 이 파일은 <b>소스 루트</b>에 있어야 합니다.
      </p>

      <Frame cap="소스 → 빌드 환경(Docker)에서 buildspec 실행 → 아티팩트 & 로그">
        <Flow>
          <FBox icon={GitCommit} title="소스" sub="CodeCommit · S3 · GitHub · Bitbucket" color={ACCENT.source} wide />
          <FBox icon={Container} title="빌드 환경" sub="Docker 이미지 (관리형/커스텀)" color={ACCENT.build} wide />
          <FBox icon={Package} title="출력" sub="Artifacts → S3 · 로그 → CloudWatch/S3" color="#8FA3B8" wide />
        </Flow>
      </Frame>

      <h4 className="mini-h"><span className="mono">buildspec.yml</span> 구조</h4>
      <Frame tight cap="phases는 install → pre_build → build → post_build 순으로 실행">
        <div className="spec">
          <div className="spec-row">
            <span className="spec-k">env</span>
            <span className="spec-v">환경 변수 · <b>plaintext / SSM Parameter Store / Secrets Manager</b></span>
          </div>
          <div className="spec-row">
            <span className="spec-k">phases</span>
            <span className="spec-v spec-phases">
              {phases.map((p, i) => (
                <React.Fragment key={p}>
                  <code>{p}</code>{i < phases.length - 1 && <Chev size={13} className="spec-arrow" />}
                </React.Fragment>
              ))}
            </span>
          </div>
          <div className="spec-row">
            <span className="spec-k">artifacts</span>
            <span className="spec-v">빌드 산출물 → S3 업로드</span>
          </div>
          <div className="spec-row">
            <span className="spec-k">cache</span>
            <span className="spec-v">의존성 등 캐시 → S3 저장 (빌드 속도 향상)</span>
          </div>
        </div>
      </Frame>

      <div className="split-h">
        <div className="split-col">
          <h4 className="mini-h">환경 & 실행</h4>
          <ul className="ul">
            <li>빌드 환경 = <b>Docker 이미지</b> (관리형 또는 커스텀)</li>
            <li><b>VPC 내부</b>에서 실행 가능 (내부 리소스 접근 시)</li>
            <li><b>로컬 빌드</b>로 심층 디버깅 (CodeBuild Agent)</li>
          </ul>
        </div>
        <div className="split-col">
          <h4 className="mini-h">로그 · 지표</h4>
          <ul className="ul">
            <li>로그 → <b>CloudWatch Logs & S3</b></li>
            <li>지표 → <b>CloudWatch Metrics</b>, 알람 → CloudWatch Alarms</li>
            <li>이벤트 → <b>EventBridge</b></li>
          </ul>
        </div>
      </div>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li><b><span className="mono">buildspec.yml</span>은 소스 루트</b>에 위치 — 위치 함정 주의.</li>
          <li>민감한 값은 <b>SSM Parameter Store / Secrets Manager</b>로 주입(plaintext 지양).</li>
          <li>빌드가 <b>VPC 내부 리소스</b>(RDS 등)에 접근해야 하면 → CodeBuild를 <b>VPC에 구성</b>.</li>
          <li>phases 순서(install→pre_build→build→post_build)와 <b>artifacts/cache</b> 역할 기억.</li>
        </ul>
      </Callout>
    </>
  );
}

/* 작은 트래픽 전환 미니 차트 (Lambda) */
function ShiftChart({ kind }) {
  // 시간에 따른 새 버전 트래픽 비율을 계단/직선으로 표현
  let path, label;
  if (kind === "linear") {
    path = "M0,60 L20,48 L40,36 L60,24 L80,12 L100,4";
    label = "일정 비율씩 점진 증가";
  } else if (kind === "canary") {
    path = "M0,60 L0,52 L60,52 L60,4 L100,4";
    label = "소량 먼저 → 나머지 한 번에";
  } else {
    path = "M0,60 L0,4 L100,4";
    label = "한 번에 100%";
  }
  return (
    <div className="shift">
      <svg viewBox="0 0 100 68" className="shift-svg" preserveAspectRatio="none">
        <line x1="0" y1="60" x2="100" y2="60" className="shift-axis" />
        <path d={path} className="shift-line" />
      </svg>
      <span className="shift-cap">{label}</span>
    </div>
  );
}

function Deploy() {
  const hooks = [
    "ApplicationStop", "BeforeInstall", "( Install )",
    "AfterInstall", "ApplicationStart", "ValidateService",
  ];
  return (
    <>
      <p className="lead">
        <b>CodeDeploy</b>는 <b>배포 자동화</b> 서비스입니다. 대상은 <b>EC2 · 온프레미스 · Lambda · ECS</b>.
        EC2/온프레미스는 <b>CodeDeploy Agent</b>가 실행 중이어야 하고, 배포는 <b><span className="mono">appspec.yml</span></b>로 정의합니다.
        <b>DVA에서 가장 자주 나오는 CI/CD 주제</b>이니 배포 방식을 확실히 구분하세요.
      </p>

      <h4 className="mini-h">EC2 / 온프레미스 배포 방식</h4>
      <div className="split-h">
        <div className="dcard" style={{ "--dc": ACCENT.source }}>
          <div className="dcard-h"><Server size={15} /> In-place (현재 위치)</div>
          <p className="dcard-p">기존 인스턴스에 <b>순차적으로</b> 배포. 배포 중 해당 인스턴스는 <b>잠시 중단</b>. 추가 비용 없음.</p>
          <div className="feat-row">
            <Chip>비용 저렴</Chip><Chip>일시 중단 발생</Chip>
          </div>
        </div>
        <div className="dcard" style={{ "--dc": ACCENT.build }}>
          <div className="dcard-h"><Layers size={15} /> Blue / Green</div>
          <p className="dcard-p"><b>새 인스턴스 그룹</b> 생성 후 트래픽을 <b>전환</b>. <b>무중단</b>이고 롤백이 쉬움. 리소스 2배 필요.</p>
          <div className="feat-row">
            <Chip c={ACCENT.build}>무중단</Chip><Chip c={ACCENT.build}>롤백 용이</Chip><Chip>비용↑</Chip>
          </div>
        </div>
      </div>

      <h4 className="mini-h">배포 설정 <span className="mini-en">Deployment Configuration · EC2</span></h4>
      <div className="feat-row">
        <Chip c={ACCENT.deploy}>OneAtATime</Chip>
        <Chip c={ACCENT.deploy}>HalfAtATime</Chip>
        <Chip c={ACCENT.deploy}>AllAtOnce</Chip>
        <Chip c={ACCENT.deploy}>Custom</Chip>
      </div>

      <h4 className="mini-h">Lambda 트래픽 전환 <span className="mini-en">Traffic Shifting</span></h4>
      <Frame cap="세 가지 방식으로 새 버전에 트래픽을 점진적/즉시 이동">
        <div className="shift-grid">
          <div className="shift-card"><div className="shift-t">Linear</div><ShiftChart kind="linear" /></div>
          <div className="shift-card"><div className="shift-t">Canary</div><ShiftChart kind="canary" /></div>
          <div className="shift-card"><div className="shift-t">AllAtOnce</div><ShiftChart kind="allatonce" /></div>
        </div>
      </Frame>
      <p className="note">참고 — <b>ECS는 Blue/Green만</b> 지원합니다.</p>

      <h4 className="mini-h"><span className="mono">appspec.yml</span> 수명 주기 훅 <span className="mini-en">Lifecycle Hooks · EC2</span></h4>
      <Frame tight cap="배포는 정해진 훅 순서대로 진행되고, 각 훅에 스크립트를 걸 수 있다">
        <div className="hooks">
          {hooks.map((h, i) => (
            <React.Fragment key={h}>
              <span className={`hook${h.startsWith("(") ? " hook-mid" : ""}`}>{h}</span>
              {i < hooks.length - 1 && <span className="hook-arrow" aria-hidden><Chev size={14} /></span>}
            </React.Fragment>
          ))}
        </div>
      </Frame>

      <Callout kind="exam" title="시험 포인트 (매우 중요)">
        <ul className="ul tight">
          <li><b>무중단·쉬운 롤백</b>이 필요 → <b>Blue/Green</b>. 비용 절약·단순 → <b>In-place</b>.</li>
          <li>EC2/온프레미스는 <b>CodeDeploy Agent 필수</b>. Lambda/ECS는 에이전트 불필요.</li>
          <li>Lambda 점진 배포 = <b>Linear / Canary / AllAtOnce</b> 구분. <b>ECS는 Blue/Green만</b>.</li>
          <li>배포 실패 또는 <b>CloudWatch 알람</b> 발생 시 <b>자동 롤백</b>(마지막 성공 리비전 재배포).</li>
          <li>배포 동작 정의 = <b><span className="mono">appspec.yml</span></b>, 순서 = 수명 주기 훅.</li>
        </ul>
      </Callout>
    </>
  );
}

function Ec2Asg() {
  return (
    <>
      <p className="lead">
        CodeDeploy로 <b>EC2</b>와 <b>Auto Scaling Group(ASG)</b>에 배포할 때의 세부 사항입니다.
      </p>

      <div className="split-h">
        <div className="split-col">
          <h4 className="mini-h">EC2 인스턴스</h4>
          <ul className="ul">
            <li>배포 대상은 <b>태그(Tags) 또는 이름</b>으로 식별</li>
            <li><b>CodeDeploy Agent 설치 필수</b></li>
            <li>설치 자동화 → <b>User Data</b> 스크립트 또는 <b>Systems Manager</b></li>
          </ul>
        </div>
        <div className="split-col">
          <h4 className="mini-h">ASG 배포 방식</h4>
          <ul className="ul">
            <li><b>In-place</b>: ASG 내 <b>기존 EC2</b>를 업데이트</li>
            <li><b>Blue/Green</b>: <b>새 ASG</b>를 생성 → 검증 → 트래픽 전환 → 기존 ASG 종료</li>
          </ul>
        </div>
      </div>

      <Frame cap="ASG — In-place는 기존 그룹 갱신, Blue/Green은 새 그룹으로 교체">
        <div className="split-h nogap-top">
          <div className="asg-col" style={{ "--dc": ACCENT.source }}>
            <div className="asg-h">In-place</div>
            <Flow>
              <FBox icon={Server} title="기존 ASG" sub="v1 → v2 갱신" color={ACCENT.source} />
              <FBox icon={CheckCircle2} title="동일 그룹 유지" sub="" color="#8FA3B8" />
            </Flow>
          </div>
          <div className="asg-col" style={{ "--dc": ACCENT.build }}>
            <div className="asg-h">Blue / Green</div>
            <Flow>
              <FBox icon={Server} title="기존 ASG (Blue)" sub="v1" color="#8FA3B8" />
              <FBox icon={Layers} title="새 ASG (Green)" sub="v2 → 전환" color={ACCENT.build} />
            </Flow>
          </div>
        </div>
      </Frame>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li>EC2 배포 대상 식별 = <b>태그/이름</b>, 그리고 <b>Agent 설치</b>가 전제.</li>
          <li>Agent 대량 설치·유지 = <b>Systems Manager</b> 활용이 정답으로 자주 등장.</li>
          <li>ASG Blue/Green은 <b>새 ASG 생성</b> 방식이라는 점 기억.</li>
        </ul>
      </Callout>
    </>
  );
}

function Artifact() {
  return (
    <>
      <p className="lead">
        <b>CodeArtifact</b>는 소프트웨어 <b>패키지(의존성)</b>를 저장·관리하는 아티팩트 관리 서비스입니다.
        개발자와 <b>CodeBuild</b>가 여기서 의존성을 가져오고, <b>퍼블릭 저장소의 프록시</b> 역할도 합니다.
      </p>

      <Frame cap="개발자·CodeBuild가 CodeArtifact에서 의존성을 받고, CodeArtifact는 퍼블릭 저장소를 대신 캐시">
        <div className="art-diagram">
          <div className="art-left">
            <FBox icon={GitBranch} title="개발자" sub="npm/pip/mvn ..." color="#8FA3B8" />
            <FBox icon={Hammer} title="CodeBuild" sub="빌드 시 의존성" color={ACCENT.build} />
          </div>
          <span className="art-arrow" aria-hidden><ChevronLeft size={18} /></span>
          <div className="art-center" style={{ "--dc": ACCENT.artifact }}>
            <Package size={20} />
            <div className="art-center-t">CodeArtifact</div>
            <div className="art-center-s">저장 · 캐시 · 프록시</div>
          </div>
          <span className="art-arrow" aria-hidden><ChevronLeft size={18} /></span>
          <div className="art-right">
            <FBox icon={Boxes} title="퍼블릭 저장소" sub="npm · PyPI · Maven Central · NuGet" color="#8FA3B8" wide />
          </div>
        </div>
      </Frame>

      <div className="split-h">
        <div className="split-col">
          <h4 className="mini-h">지원 패키지 매니저</h4>
          <div className="feat-row">
            <Chip c={ACCENT.artifact}>Maven</Chip><Chip c={ACCENT.artifact}>Gradle</Chip>
            <Chip c={ACCENT.artifact}>npm</Chip><Chip c={ACCENT.artifact}>yarn</Chip>
            <Chip c={ACCENT.artifact}>pip</Chip><Chip c={ACCENT.artifact}>twine</Chip>
            <Chip c={ACCENT.artifact}>NuGet</Chip>
          </div>
        </div>
        <div className="split-col">
          <h4 className="mini-h">핵심 개념</h4>
          <ul className="ul">
            <li><b>Upstream Repository</b> + <b>External Connection</b>으로 퍼블릭 저장소 연결</li>
            <li><b>EventBridge</b> 연동: 새 패키지 버전 → 파이프라인 트리거</li>
            <li><b>Resource Policy</b>로 교차 계정 접근 제어</li>
          </ul>
        </div>
      </div>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li>“의존성/패키지를 안전하게 저장·공유” 시나리오 = <b>CodeArtifact</b>.</li>
          <li>새 패키지 버전 발생 시 자동 파이프라인 실행 = <b>EventBridge</b> 연동.</li>
          <li>퍼블릭 저장소 다운타임에도 안정적 빌드 = <b>프록시/캐시</b> 기능.</li>
        </ul>
      </Callout>
    </>
  );
}

function Guru() {
  return (
    <>
      <p className="lead">
        <b>CodeGuru</b>는 <b>머신러닝 기반</b>으로 자동 코드 리뷰와 애플리케이션 성능 추천을 제공합니다.
        <b>두 부분</b>으로 나뉘며, 이 <b>둘의 구분</b>이 시험의 핵심입니다.
      </p>

      <div className="split-h">
        <div className="guru-card" style={{ "--dc": "#7FB3E8" }}>
          <div className="guru-tag">배포 <b>전</b> · 개발</div>
          <div className="guru-h"><Search size={16} /> CodeGuru Reviewer</div>
          <p className="guru-p"><b>정적 코드 분석</b>으로 자동 코드 리뷰. 버그·보안 취약점·리소스 누수·잘못된 예외 처리 등을 탐지.</p>
          <ul className="ul tight">
            <li>지원 언어: <b>Java · Python</b></li>
            <li>연동: GitHub · Bitbucket · CodeCommit</li>
          </ul>
        </div>
        <div className="guru-card" style={{ "--dc": ACCENT.guru }}>
          <div className="guru-tag">배포 <b>후</b> · 프로덕션</div>
          <div className="guru-h"><Gauge size={16} /> CodeGuru Profiler</div>
          <p className="guru-p"><b>런타임 성능</b> 가시성·추천. 비용이 큰(expensive) 코드 라인을 찾아 <b>CPU/힙 사용량</b>을 줄임.</p>
          <ul className="ul tight">
            <li>프로덕션에서 실행, <b>오버헤드 최소</b></li>
            <li>에이전트로 데이터 수집</li>
          </ul>
        </div>
      </div>

      <Frame cap="Reviewer는 배포 전 코드 품질, Profiler는 배포 후 런타임 성능" tight>
        <Flow>
          <FBox icon={FileCode2} title="개발 코드" sub="정적 분석" color="#8FA3B8" />
          <FBox icon={Search} title="Reviewer" sub="배포 전 · 코드 품질" color="#7FB3E8" wide />
          <FBox icon={Rocket} title="실행 중인 앱" sub="런타임" color="#8FA3B8" />
          <FBox icon={Gauge} title="Profiler" sub="배포 후 · 성능" color={ACCENT.guru} wide />
        </Flow>
      </Frame>

      <Callout kind="tip" title="한 줄 기억법">
        <b>Reviewer = 배포 “전” 코드 품질</b> (정적 분석) · <b>Profiler = 배포 “후” 런타임 성능</b> (프로파일링).
        이 대비만 확실하면 대부분의 문제가 풀립니다.
      </Callout>
    </>
  );
}

function Agent() {
  const rows = [
    ["MaxStackDepth", "수집할 스택의 최대 깊이"],
    ["MemoryUsageLimitPercent", "프로파일러가 사용할 최대 메모리 비율"],
    ["MinimumTimeForReportingInMilliseconds", "보고 사이 최소 시간"],
    ["ReportingIntervalInMilliseconds", "보고 주기"],
    ["SamplingIntervalInMilliseconds", "샘플링 주기 (짧을수록 상세 · 오버헤드↑)"],
  ];
  return (
    <>
      <p className="lead">
        <b>CodeGuru Profiler</b>는 애플리케이션에 <b>에이전트(Agent)</b>를 붙여 데이터를 <b>샘플링·보고</b>합니다.
        에이전트 동작은 아래 설정값으로 조정합니다.
      </p>

      <Frame tight cap="에이전트 설정 — 샘플링 상세도와 오버헤드 사이의 균형을 조절">
        <div className="agent-table">
          {rows.map(([k, v]) => (
            <div className="agent-row" key={k}>
              <code className="agent-k">{k}</code>
              <span className="agent-v">{v}</span>
            </div>
          ))}
        </div>
      </Frame>

      <Callout kind="exam" title="시험 포인트">
        <ul className="ul tight">
          <li>세부 설정값을 통째로 외울 필요는 낮음. <b>“에이전트가 샘플링/보고 주기를 설정으로 제어”</b>한다는 개념 위주.</li>
          <li><b>SamplingInterval</b>이 짧을수록 <b>정밀↑ · 오버헤드↑</b>라는 트레이드오프만 이해.</li>
        </ul>
      </Callout>
    </>
  );
}

function Summary() {
  const rows = [
    { s:"CodeCommit",  r:"소스 저장소 (Git)",         k:"SSH/HTTPS 인증 · IAM · 2025-11 GA 복귀",     c:ACCENT.source,   f:{lvl:3,txt:"중간"} },
    { s:"GitHub",      r:"외부 Git 연동",             k:"CodeConnections · Webhook",           c:ACCENT.git,      f:{lvl:2,txt:"낮음~중간"} },
    { s:"CodePipeline",r:"오케스트레이션",            k:"Stage · Artifact(S3) · EventBridge",  c:ACCENT.pipe,     f:{lvl:4,txt:"높음"} },
    { s:"CodeBuild",   r:"빌드/테스트",               k:"buildspec.yml · Docker · SSM/Secrets", c:ACCENT.build,    f:{lvl:4,txt:"높음"} },
    { s:"CodeDeploy",  r:"배포 자동화",               k:"In-place vs Blue/Green · appspec.yml", c:ACCENT.deploy,   f:{lvl:5,txt:"매우 높음"} },
    { s:"CodeArtifact",r:"패키지/의존성 관리",        k:"프록시·캐시 · EventBridge",           c:ACCENT.artifact, f:{lvl:2,txt:"낮음~중간"} },
    { s:"CodeGuru",    r:"코드 리뷰·성능",            k:"Reviewer(전) vs Profiler(후)",        c:ACCENT.guru,     f:{lvl:3,txt:"중간"} },
  ];
  return (
    <>
      <p className="lead">
        전체를 한 장으로 정리했습니다. <b>역할 · 핵심 키워드 · 빈출빈도</b>를 함께 훑으며 마무리 복습하세요.
      </p>

      <div className="sumtable">
        <div className="sumtable-head">
          <span>서비스</span><span>역할</span><span>핵심 키워드</span><span>빈출</span>
        </div>
        {rows.map((r) => (
          <div className="sumtable-row" key={r.s} style={{ "--dc": r.c }}>
            <span className="st-s"><i className="st-dot" />{r.s}</span>
            <span className="st-r">{r.r}</span>
            <span className="st-k">{r.k}</span>
            <span className="st-f"><Freq freq={r.f} size="xs" /></span>
          </div>
        ))}
      </div>

      <div className="split-h">
        <Callout kind="tip" title="가장 자주 나오는 3가지">
          <ul className="ul tight">
            <li><b>CodeDeploy</b> — In-place vs Blue/Green, Lambda 트래픽 전환, 롤백</li>
            <li><b>CodePipeline</b> — 아티팩트(S3), EventBridge, IAM Service Role</li>
            <li><b>CodeBuild</b> — buildspec.yml 위치·phases, 비밀값 주입, VPC</li>
          </ul>
        </Callout>
        <Callout kind="warn" title="자주 틀리는 함정">
          <ul className="ul tight">
            <li>CodeCommit “비밀번호 로그인” — <b>없음</b> (SSH/HTTPS)</li>
            <li>ECS 배포 — <b>Blue/Green만</b> 지원</li>
            <li>buildspec.yml — <b>소스 루트</b>에 있어야 함</li>
            <li>Reviewer/Profiler를 <b>바꿔서</b> 고르는 실수</li>
          </ul>
        </Callout>
      </div>

      <div className="freq-legend">
        <span className="fl-title">빈출빈도 범례</span>
        <span className="fl-item"><Freq freq={{lvl:5,txt:"매우 높음"}} size="xs" /> 반드시 정복</span>
        <span className="fl-item"><Freq freq={{lvl:4,txt:"높음"}} size="xs" /> 자주 출제</span>
        <span className="fl-item"><Freq freq={{lvl:3,txt:"중간"}} size="xs" /> 개념+대표문제</span>
        <span className="fl-item"><Freq freq={{lvl:2,txt:"낮음"}} size="xs" /> 개념 위주</span>
      </div>
      <p className="disclaimer">
        ※ 빈출빈도는 공식 시험 청사진의 수치가 아니라, DVA 시험의 도메인 비중과 대표 기출 패턴을 바탕으로 한 <b>추정치</b>입니다. 실제 출제는 회차마다 다를 수 있습니다.
      </p>
    </>
  );
}

const RENDER = {
  intro:Intro, commit:Commit, eol:Eol, github:GitHub, pipeline:Pipeline,
  build:Build, deploy:Deploy, ec2asg:Ec2Asg, artifact:Artifact, guru:Guru,
  agent:Agent, summary:Summary,
};

/* ------------------------------------------------------------------ */

export default function App() {
  const [active, setActive] = useState("intro");
  const mainRef = useRef(null);

  useEffect(() => {
    const id = "ibm-plex-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  const idx = SECTIONS.findIndex(s => s.id === active);
  const cur = SECTIONS[idx];
  const Body = RENDER[active];
  const accentHex = ACCENT[cur.accent];

  const go = (id) => {
    setActive(id);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="cicd-app" style={{ "--accent": accentHex }}>
      <style>{CSS}</style>

      <header className="hdr">
        <div className="hdr-in">
          <div className="hdr-mark"><Workflow size={18} /></div>
          <div className="hdr-txt">
            <div className="hdr-eyebrow">AWS Certified Developer · Associate</div>
            <h1 className="hdr-title">CI/CD 완전 정복</h1>
          </div>
          <div className="hdr-line" aria-hidden><span className="hdr-flow" /></div>
          <div className="hdr-count">{idx + 1} / {SECTIONS.length}</div>
        </div>
      </header>

      <div className="shell">
        <nav className="nav" aria-label="섹션">
          <div className="nav-spine" aria-hidden />
          {SECTIONS.map((s) => {
            const on = s.id === active;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                className={`nav-item${on ? " on" : ""}`}
                style={{ "--na": ACCENT[s.accent] }}
                onClick={() => go(s.id)}
                aria-current={on ? "true" : undefined}
              >
                <span className="nav-node"><Icon size={14} /></span>
                <span className="nav-main">
                  <span className="nav-n">{s.n}</span>
                  <span className="nav-label">{s.label}</span>
                </span>
                {!s.freq.special && (
                  <span className="nav-freq" aria-hidden>
                    {[0,1,2,3,4].map(i => <i key={i} className={i < s.freq.lvl ? "on" : ""} />)}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <main className="main" ref={mainRef}>
          <article className="section" key={active}>
            <div className="sec-head">
              <div className="sec-headline">
                <span className="sec-tag"><span className="sec-tag-dot" />{cur.tag}</span>
                <h2 className="sec-title">{cur.label}</h2>
              </div>
              <div className="sec-freq">
                <span className="sec-freq-lbl">빈출빈도</span>
                <Freq freq={cur.freq} />
              </div>
            </div>

            <div className="sec-body">
              <Body />
            </div>

            <nav className="pager">
              <button
                className="pg-btn"
                disabled={idx === 0}
                onClick={() => idx > 0 && go(SECTIONS[idx - 1].id)}
              >
                <ChevronLeft size={16} />
                <span className="pg-txt">
                  <span className="pg-dir">이전</span>
                  {idx > 0 && <span className="pg-name">{SECTIONS[idx - 1].label}</span>}
                </span>
              </button>
              <button
                className="pg-btn pg-next"
                disabled={idx === SECTIONS.length - 1}
                onClick={() => idx < SECTIONS.length - 1 && go(SECTIONS[idx + 1].id)}
              >
                <span className="pg-txt">
                  <span className="pg-dir">다음</span>
                  {idx < SECTIONS.length - 1 && <span className="pg-name">{SECTIONS[idx + 1].label}</span>}
                </span>
                <ChevronRight size={16} />
              </button>
            </nav>
          </article>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  스타일
 * ------------------------------------------------------------------ */
const CSS = `
.cicd-app{
  --ink:#0C1118; --ink2:#0F1620; --panel:#141D28; --panel2:#1A2534;
  --panelHi:#212E3F; --line:#273545; --line2:#33465B;
  --text:#E9EFF6; --dim:#93A2B6; --faint:#5E6E82;
  --amber:#FFA23A;
  --sans:'IBM Plex Sans KR',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  font-family:var(--sans);
  color:var(--text);
  background:
    radial-gradient(1100px 500px at 78% -10%, rgba(255,162,58,0.06), transparent 60%),
    radial-gradient(900px 500px at 0% 0%, rgba(91,155,213,0.05), transparent 55%),
    var(--ink);
  min-height:100vh;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  letter-spacing:-0.003em;
}
.cicd-app *{box-sizing:border-box;}
.cicd-app b{font-weight:600;color:#fff;}
.mono{font-family:var(--mono);font-size:0.92em;}

/* ---- header ---- */
.hdr{position:sticky;top:0;z-index:40;background:rgba(12,17,24,0.82);
  backdrop-filter:blur(12px);border-bottom:1px solid var(--line);}
.hdr-in{max-width:1180px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;gap:14px;}
.hdr-mark{width:38px;height:38px;flex:none;border-radius:10px;display:grid;place-items:center;
  color:var(--ink);background:linear-gradient(135deg,#FFB865,#FF9A2E);
  box-shadow:0 4px 16px rgba(255,154,46,0.30);}
.hdr-txt{display:flex;flex-direction:column;}
.hdr-eyebrow{font-family:var(--mono);font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--amber);font-weight:500;}
.hdr-title{margin:1px 0 0;font-size:19px;font-weight:700;letter-spacing:-0.02em;}
.hdr-line{flex:1;height:2px;margin:0 4px;border-radius:2px;position:relative;overflow:hidden;
  background:linear-gradient(90deg,transparent,var(--line2) 25%,var(--line2) 75%,transparent);min-width:24px;}
.hdr-flow{position:absolute;top:0;left:-30%;height:100%;width:30%;
  background:linear-gradient(90deg,transparent,var(--amber),transparent);
  animation:flow 3.2s linear infinite;}
.hdr-count{flex:none;font-family:var(--mono);font-size:12px;color:var(--dim);
  border:1px solid var(--line);border-radius:20px;padding:4px 11px;}
@keyframes flow{to{left:100%;}}

/* ---- shell / layout ---- */
.shell{max-width:1180px;margin:0 auto;padding:22px;display:grid;
  grid-template-columns:246px 1fr;gap:26px;align-items:start;}

/* ---- nav ---- */
.nav{position:sticky;top:84px;display:flex;flex-direction:column;gap:2px;padding-left:6px;position:relative;}
.nav-spine{position:absolute;left:19px;top:14px;bottom:14px;width:2px;
  background:linear-gradient(180deg,transparent,var(--line) 8%,var(--line) 92%,transparent);}
.nav-item{position:relative;display:flex;align-items:center;gap:10px;
  background:transparent;border:1px solid transparent;border-radius:10px;
  padding:8px 10px 8px 8px;cursor:pointer;text-align:left;color:var(--dim);
  font-family:var(--sans);transition:background .16s,color .16s,border-color .16s;width:100%;}
.nav-item:hover{background:var(--panel);color:var(--text);}
.nav-item.on{background:var(--panel2);border-color:var(--line);color:var(--text);}
.nav-node{width:27px;height:27px;flex:none;border-radius:8px;display:grid;place-items:center;
  background:var(--ink2);border:1px solid var(--line);color:var(--dim);z-index:1;transition:all .16s;}
.nav-item:hover .nav-node{color:var(--na);border-color:var(--na);}
.nav-item.on .nav-node{color:var(--ink);background:var(--na);border-color:var(--na);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--na) 22%,transparent);}
.nav-main{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25;}
.nav-n{font-family:var(--mono);font-size:9.5px;color:var(--faint);letter-spacing:0.08em;}
.nav-item.on .nav-n{color:var(--na);}
.nav-label{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nav-freq{display:flex;gap:2px;align-items:center;flex:none;}
.nav-freq i{width:3px;height:11px;border-radius:1px;background:var(--line2);}
.nav-freq i.on{background:var(--na);}

/* ---- main ---- */
.main{min-width:0;}
.section{animation:fade .32s ease;}
@keyframes fade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}

.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;flex-wrap:wrap;
  padding-bottom:16px;margin-bottom:22px;border-bottom:1px solid var(--line);}
.sec-tag{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono);font-size:11.5px;
  letter-spacing:0.06em;color:var(--accent);font-weight:500;text-transform:none;}
.sec-tag-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 8px color-mix(in srgb,var(--accent) 60%,transparent);}
.sec-title{margin:5px 0 0;font-size:27px;font-weight:700;letter-spacing:-0.025em;line-height:1.1;}
.sec-freq{display:flex;flex-direction:column;align-items:flex-end;gap:5px;}
.sec-freq-lbl{font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);}

/* ---- freq badge ---- */
.freq{display:inline-flex;align-items:center;gap:8px;}
.freq-bars{display:flex;gap:2.5px;align-items:center;}
.freq-bars i{width:5px;height:15px;border-radius:1.5px;background:var(--line2);transition:none;}
.freq-bars i.on{background:linear-gradient(180deg,#FFB865,#FF9A2E);}
.freq-txt{font-family:var(--mono);font-size:12.5px;font-weight:500;color:var(--text);}
.freq-sm .freq-bars i{width:5px;height:15px;}
.freq-xs .freq-bars i{width:4px;height:11px;}
.freq-xs .freq-txt{font-size:11px;color:var(--dim);}
.freq-special{font-family:var(--mono);font-size:12px;color:var(--amber);
  border:1px solid color-mix(in srgb,var(--amber) 40%,transparent);border-radius:20px;
  padding:3px 11px;display:inline-flex;gap:6px;align-items:center;}
.freq-star{font-size:8px;}

/* ---- prose ---- */
.sec-body>*+*{margin-top:20px;}
.lead{font-size:15.5px;line-height:1.72;color:#D3DEEA;margin:0;}
.note{font-size:13.5px;color:var(--dim);margin:0;padding:9px 13px;border-left:2px solid var(--line2);
  background:var(--panel);border-radius:0 8px 8px 0;}
.disclaimer{font-size:12px;color:var(--faint);line-height:1.6;margin:0;}
.mini-h{font-size:14px;font-weight:600;color:#fff;margin:26px 0 12px;display:flex;align-items:baseline;gap:9px;
  letter-spacing:-0.01em;}
.mini-en{font-family:var(--mono);font-size:11px;font-weight:400;color:var(--faint);letter-spacing:0.02em;}
.ul{margin:0;padding-left:2px;list-style:none;display:flex;flex-direction:column;gap:8px;}
.ul li{position:relative;padding-left:18px;font-size:14px;color:#CAD6E3;line-height:1.55;}
.ul li::before{content:"";position:absolute;left:2px;top:9px;width:5px;height:5px;border-radius:50%;
  background:var(--accent);opacity:0.85;}
.ul.tight{gap:6px;}
.ul.tight li{font-size:13.5px;}

/* ---- split columns ---- */
.split-h{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start;}
.split-h.nogap-top{gap:16px;}
.split-col{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 17px;}
.split-col .mini-h{margin-top:0;}
.split-col p{font-size:13.5px;color:#CAD6E3;margin:0;line-height:1.6;}

/* ---- chips ---- */
.feat-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px;}
.chip{--chip:var(--dim);font-family:var(--mono);font-size:11.5px;font-weight:500;
  color:color-mix(in srgb,var(--chip) 88%,white);
  background:color-mix(in srgb,var(--chip) 12%,transparent);
  border:1px solid color-mix(in srgb,var(--chip) 30%,transparent);
  border-radius:7px;padding:4px 9px;letter-spacing:0.01em;}

/* ---- frame (diagram) ---- */
.frame{margin:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--ink2);}
.frame-body{padding:22px 20px;background:
  linear-gradient(var(--panel) 1px,transparent 1px) 0 0/100% 100%,
  radial-gradient(circle at 1px 1px, color-mix(in srgb,var(--line) 60%,transparent) 1px, transparent 0) 0 0/22px 22px;
  background-color:var(--ink2);}
.frame.tight .frame-body{padding:18px;}
.frame-cap{padding:10px 16px;font-size:12px;color:var(--dim);border-top:1px solid var(--line);
  background:var(--panel);display:flex;align-items:center;gap:7px;line-height:1.4;}
.frame-cap::before{content:"◈";color:var(--accent);font-size:9px;}

/* ---- flow (박스 + 화살표) ---- */
.flow{display:flex;align-items:stretch;justify-content:center;gap:0;flex-wrap:nowrap;}
.fbox{--fb:var(--amber);display:flex;align-items:center;gap:10px;flex:1;min-width:0;
  background:var(--panel2);border:1px solid var(--line2);
  border-top:2px solid var(--fb);border-radius:10px;padding:11px 13px;
  box-shadow:0 2px 10px rgba(0,0,0,0.20);}
.fbox.wide{flex:1.5;}
.fbox.dim{opacity:0.62;filter:saturate(0.6);}
.fbox-ic{width:30px;height:30px;flex:none;border-radius:8px;display:grid;place-items:center;
  color:var(--fb);background:color-mix(in srgb,var(--fb) 15%,transparent);}
.fbox-txt{display:flex;flex-direction:column;min-width:0;line-height:1.28;}
.fbox-t{font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.fbox-s{font-family:var(--mono);font-size:10.5px;color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.farrow{flex:none;display:grid;place-items:center;color:var(--faint);padding:0 5px;align-self:center;}

/* ---- hero pipeline ---- */
.hero-pipe{display:flex;flex-direction:column;gap:0;}
.hero-band{text-align:center;margin-bottom:14px;}
.hero-band span{font-family:var(--mono);font-size:11px;letter-spacing:0.05em;color:var(--amber);
  border:1px dashed color-mix(in srgb,var(--amber) 45%,transparent);border-radius:20px;padding:4px 14px;
  background:color-mix(in srgb,var(--amber) 8%,transparent);}
.hero-track{position:relative;}
.hero-flow{position:absolute;left:0;top:-9px;width:34px;height:3px;border-radius:3px;
  background:linear-gradient(90deg,transparent,var(--amber),transparent);
  animation:heroflow 3.4s linear infinite;opacity:0.9;}
@keyframes heroflow{from{left:-6%;}to{left:100%;}}

/* ---- service map cards ---- */
.mapgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:10px;}
.mapcard{--mc:var(--amber);display:flex;align-items:center;gap:11px;
  background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--mc);
  border-radius:10px;padding:11px 13px;}
.mapcard-ic{width:30px;height:30px;flex:none;border-radius:8px;display:grid;place-items:center;
  color:var(--mc);background:color-mix(in srgb,var(--mc) 14%,transparent);}
.mapcard-t{font-size:13.5px;font-weight:600;color:#fff;}
.mapcard-d{font-size:11.5px;color:var(--dim);line-height:1.35;}

/* ---- callout ---- */
.callout{border-radius:12px;padding:0;overflow:hidden;border:1px solid var(--line);}
.callout-h{display:flex;align-items:center;gap:8px;padding:11px 15px;font-size:13px;font-weight:600;
  border-bottom:1px solid var(--line);}
.callout-b{padding:14px 15px;font-size:13.5px;color:#CAD6E3;line-height:1.6;}
.callout-b p{margin:0;}
.callout-b .ul{margin:0;}
.callout-exam{background:color-mix(in srgb,var(--amber) 6%,var(--panel));
  border-color:color-mix(in srgb,var(--amber) 26%,var(--line));}
.callout-exam .callout-h{color:var(--amber);
  background:color-mix(in srgb,var(--amber) 10%,transparent);
  border-color:color-mix(in srgb,var(--amber) 24%,transparent);}
.callout-tip{background:color-mix(in srgb,#34C892 6%,var(--panel));
  border-color:color-mix(in srgb,#34C892 26%,var(--line));}
.callout-tip .callout-h{color:#4FD6A6;background:color-mix(in srgb,#34C892 10%,transparent);
  border-color:color-mix(in srgb,#34C892 22%,transparent);}
.callout-warn{background:color-mix(in srgb,#FF7A5A 7%,var(--panel));
  border-color:color-mix(in srgb,#FF7A5A 30%,var(--line));}
.callout-warn .callout-h{color:#FF9576;background:color-mix(in srgb,#FF7A5A 12%,transparent);
  border-color:color-mix(in srgb,#FF7A5A 26%,transparent);}

/* ---- key-value ---- */
.kv{display:flex;gap:10px;font-size:13.5px;padding:6px 0;}
.kv-k{font-family:var(--mono);color:var(--accent);flex:none;min-width:120px;}
.kv-v{color:#CAD6E3;}

/* ---- pipeline stages ---- */
.pipe-stages{display:flex;align-items:stretch;justify-content:center;gap:0;}
.pstage{--ps:var(--amber);flex:1;min-width:0;background:var(--panel2);border:1px solid var(--line2);
  border-top:2px solid var(--ps);border-radius:10px;padding:12px 10px;text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:5px;}
.pstage-ic{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;
  color:var(--ps);background:color-mix(in srgb,var(--ps) 15%,transparent);}
.pstage-t{font-size:13px;font-weight:600;color:#fff;}
.pstage-d{font-size:10px;color:var(--dim);line-height:1.3;font-family:var(--mono);}
.pstage-link{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:4px;color:var(--faint);padding:0 3px;}
.pstage-art{font-family:var(--mono);font-size:8.5px;color:var(--amber);white-space:nowrap;
  display:flex;align-items:center;gap:2px;opacity:0.85;}

/* ---- buildspec ---- */
.spec{display:flex;flex-direction:column;gap:9px;}
.spec-row{display:flex;align-items:center;gap:12px;background:var(--panel2);
  border:1px solid var(--line);border-radius:9px;padding:9px 13px;}
.spec-k{font-family:var(--mono);font-size:12.5px;font-weight:600;color:var(--build,#34C892);
  color:#4FD6A6;min-width:78px;flex:none;}
.spec-v{font-size:13px;color:#CAD6E3;}
.spec-phases{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.spec-phases code{font-family:var(--mono);font-size:12px;color:#fff;background:var(--ink2);
  border:1px solid var(--line2);border-radius:6px;padding:3px 8px;}
.spec-arrow{color:var(--faint);}

/* ---- deploy cards ---- */
.dcard{--dc:var(--amber);background:var(--panel);border:1px solid var(--line);
  border-top:2px solid var(--dc);border-radius:12px;padding:15px 16px;}
.dcard-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#fff;
  margin-bottom:8px;}
.dcard-h svg{color:var(--dc);}
.dcard-p{font-size:13px;color:#CAD6E3;margin:0 0 10px;line-height:1.55;}

/* ---- traffic shift ---- */
.shift-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.shift-card{background:var(--panel2);border:1px solid var(--line2);border-radius:10px;padding:12px;
  display:flex;flex-direction:column;gap:9px;}
.shift-t{font-family:var(--mono);font-size:12px;font-weight:600;color:#fff;text-align:center;}
.shift{display:flex;flex-direction:column;gap:6px;}
.shift-svg{width:100%;height:52px;}
.shift-axis{stroke:var(--line2);stroke-width:1;}
.shift-line{fill:none;stroke:var(--deploy,#FF6E6E);stroke:#FF8A8A;stroke-width:2.5;
  stroke-linejoin:round;stroke-linecap:round;
  filter:drop-shadow(0 0 4px rgba(255,110,110,0.4));
  vector-effect:non-scaling-stroke;}
.shift-cap{font-size:10.5px;color:var(--dim);text-align:center;line-height:1.35;}

/* ---- hooks ---- */
.hooks{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;}
.hook{font-family:var(--mono);font-size:11.5px;color:#fff;background:var(--panel2);
  border:1px solid var(--line2);border-top:2px solid var(--deploy,#FF6E6E);border-top-color:#FF8A8A;
  border-radius:8px;padding:7px 10px;white-space:nowrap;}
.hook-mid{border-top-color:var(--line2);color:var(--dim);background:var(--ink2);}
.hook-arrow{color:var(--faint);display:grid;place-items:center;}

/* ---- asg ---- */
.asg-col{--dc:var(--amber);background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px;}
.asg-h{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--dc);margin-bottom:11px;text-align:center;}

/* ---- codeartifact diagram ---- */
.art-diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;}
.art-left{display:flex;flex-direction:column;gap:9px;flex:1;min-width:150px;}
.art-right{flex:1;min-width:150px;display:flex;}
.art-center{--dc:var(--artifact,#2DBBD4);flex:none;width:150px;text-align:center;
  background:color-mix(in srgb,#2DBBD4 12%,var(--panel2));
  border:1px solid color-mix(in srgb,#2DBBD4 40%,var(--line2));border-radius:12px;padding:15px 10px;
  color:#5FD4E8;display:flex;flex-direction:column;align-items:center;gap:3px;}
.art-center-t{font-size:14px;font-weight:600;color:#fff;}
.art-center-s{font-family:var(--mono);font-size:10px;color:var(--dim);}
.art-arrow{color:var(--faint);flex:none;}

/* ---- guru ---- */
.guru-card{--dc:var(--amber);background:var(--panel);border:1px solid var(--line);
  border-top:2px solid var(--dc);border-radius:12px;padding:15px 16px;}
.guru-tag{display:inline-block;font-family:var(--mono);font-size:10px;letter-spacing:0.04em;
  color:var(--dc);border:1px solid color-mix(in srgb,var(--dc) 35%,transparent);
  background:color-mix(in srgb,var(--dc) 10%,transparent);border-radius:20px;padding:2px 9px;margin-bottom:10px;}
.guru-h{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:#fff;margin-bottom:8px;}
.guru-h svg{color:var(--dc);}
.guru-p{font-size:13px;color:#CAD6E3;margin:0 0 11px;line-height:1.55;}

/* ---- agent table ---- */
.agent-table{display:flex;flex-direction:column;gap:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;}
.agent-row{display:flex;gap:14px;padding:11px 14px;background:var(--panel);border-bottom:1px solid var(--line);
  align-items:baseline;flex-wrap:wrap;}
.agent-row:last-child{border-bottom:none;}
.agent-row:nth-child(even){background:var(--panel2);}
.agent-k{font-family:var(--mono);font-size:12px;color:#C08CFF;font-weight:500;flex:none;min-width:200px;}
.agent-v{font-size:13px;color:#CAD6E3;}

/* ---- summary table ---- */
.sumtable{border:1px solid var(--line);border-radius:12px;overflow:hidden;}
.sumtable-head{display:grid;grid-template-columns:1.1fr 1fr 1.6fr 0.9fr;gap:12px;padding:10px 16px;
  background:var(--panelHi);font-family:var(--mono);font-size:10.5px;letter-spacing:0.1em;
  text-transform:uppercase;color:var(--dim);font-weight:500;}
.sumtable-row{--dc:var(--amber);display:grid;grid-template-columns:1.1fr 1fr 1.6fr 0.9fr;gap:12px;
  padding:12px 16px;border-top:1px solid var(--line);background:var(--panel);align-items:center;}
.sumtable-row:nth-child(even){background:var(--panel2);}
.st-s{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:#fff;}
.st-dot{width:8px;height:8px;border-radius:2px;background:var(--dc);flex:none;}
.st-r{font-size:12.5px;color:#CAD6E3;}
.st-k{font-family:var(--mono);font-size:11px;color:var(--dim);line-height:1.4;}

/* ---- freq legend ---- */
.freq-legend{display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:13px 16px;
  background:var(--panel);border:1px solid var(--line);border-radius:12px;}
.fl-title{font-family:var(--mono);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);}
.fl-item{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--dim);}

/* ---- pager ---- */
.pager{display:flex;justify-content:space-between;gap:12px;margin-top:34px;padding-top:20px;
  border-top:1px solid var(--line);}
.pg-btn{display:flex;align-items:center;gap:9px;background:var(--panel);border:1px solid var(--line);
  border-radius:11px;padding:10px 15px;cursor:pointer;color:var(--text);font-family:var(--sans);
  transition:background .16s,border-color .16s,transform .1s;max-width:48%;}
.pg-btn:hover:not(:disabled){background:var(--panel2);border-color:var(--line2);}
.pg-btn:active:not(:disabled){transform:translateY(1px);}
.pg-btn:disabled{opacity:0.32;cursor:default;}
.pg-next{margin-left:auto;}
.pg-txt{display:flex;flex-direction:column;line-height:1.2;min-width:0;}
.pg-next .pg-txt{align-items:flex-end;}
.pg-dir{font-family:var(--mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--faint);}
.pg-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;}
.pg-btn svg{color:var(--amber);flex:none;}

/* ---- responsive ---- */
@media (max-width:900px){
  .shell{grid-template-columns:1fr;gap:16px;padding:16px;}
  .nav{position:static;flex-direction:row;overflow-x:auto;padding:6px 2px 8px;gap:6px;
    -webkit-overflow-scrolling:touch;scrollbar-width:thin;}
  .nav-spine{display:none;}
  .nav-item{flex:none;flex-direction:column;align-items:flex-start;width:auto;min-width:132px;
    border-color:var(--line);background:var(--panel);}
  .nav-item .nav-node{margin-bottom:4px;}
  .nav-main{flex-direction:column;}
  .nav-freq{margin-top:5px;}
}
@media (max-width:680px){
  .split-h,.mapgrid,.shift-grid{grid-template-columns:1fr;}
  .flow{flex-direction:column;align-items:stretch;}
  .farrow{transform:rotate(90deg);padding:3px 0;}
  .pipe-stages{flex-direction:column;align-items:stretch;}
  .pstage-link{flex-direction:row;transform:rotate(90deg);}
  .pstage-art{transform:rotate(-90deg);}
  .art-diagram{flex-direction:column;}
  .art-left,.art-right{width:100%;}
  .art-arrow{transform:rotate(90deg);}
  .sumtable-head{display:none;}
  .sumtable-row{grid-template-columns:1fr;gap:5px;}
  .st-k{order:3;}
  .hdr-title{font-size:17px;}
  .sec-title{font-size:22px;}
  .pg-name{display:none;}
}
@media (prefers-reduced-motion:reduce){
  .hdr-flow,.hero-flow{animation:none;display:none;}
  .section{animation:none;}
}
`;
