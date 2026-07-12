//fable 5 high
import React, { useState } from "react";

/* ─────────────────────────── 공통 소품 ─────────────────────────── */

const FREQ = {
  high: {
    label: "빈출도 상",
    dots: 3,
    color: "bg-red-500",
    text: "text-red-400",
    ring: "ring-red-500/30",
  },
  mid: {
    label: "빈출도 중",
    dots: 2,
    color: "bg-amber-400",
    text: "text-amber-300",
    ring: "ring-amber-400/30",
  },
  low: {
    label: "빈출도 하",
    dots: 1,
    color: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "ring-emerald-400/30",
  },
};

function FreqBadge({ level }) {
  const f = FREQ[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 ring-1 ${f.ring} text-xs font-medium ${f.text}`}
    >
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i < f.dots ? f.color : "bg-slate-600"}`}
          />
        ))}
      </span>
      {f.label}
    </span>
  );
}

function Card({ title, children, accent = "border-slate-700" }) {
  return (
    <div className={`rounded-xl border ${accent} bg-slate-900/70 p-4 md:p-5`}>
      {title && (
        <h4 className="text-sm font-semibold text-orange-300 mb-2 tracking-wide">
          {title}
        </h4>
      )}
      <div className="text-sm text-slate-300 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-800 text-slate-300 ring-slate-600/50",
    orange: "bg-orange-500/10 text-orange-300 ring-orange-500/40",
    cyan: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/40",
    green: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/40",
    red: "bg-red-500/10 text-red-300 ring-red-500/40",
    purple: "bg-purple-500/10 text-purple-300 ring-purple-500/40",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-xs font-mono ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Code({ children }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-slate-800 text-orange-200 font-mono text-xs">
      {children}
    </code>
  );
}

function ExamTip({ children }) {
  return (
    <div className="rounded-lg border border-orange-500/40 bg-orange-500/5 p-3 flex gap-2.5">
      <span className="text-orange-400 text-base leading-none mt-0.5">◆</span>
      <div className="text-sm text-orange-100/90 leading-relaxed">
        <span className="font-semibold text-orange-300 mr-1">시험 포인트</span>
        {children}
      </div>
    </div>
  );
}

/* 다이어그램용 박스/화살표 */
function DBox({ children, tone = "slate", small }) {
  const tones = {
    slate: "border-slate-600 bg-slate-800 text-slate-200",
    orange: "border-orange-500/60 bg-orange-500/10 text-orange-200",
    cyan: "border-cyan-500/60 bg-cyan-500/10 text-cyan-200",
    green: "border-emerald-500/60 bg-emerald-500/10 text-emerald-200",
    red: "border-red-500/60 bg-red-500/10 text-red-200",
    purple: "border-purple-500/60 bg-purple-500/10 text-purple-200",
    blue: "border-blue-500/60 bg-blue-500/10 text-blue-200",
  };
  return (
    <div
      className={`rounded-lg border ${tones[tone]} ${small ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"} font-medium text-center whitespace-pre-line`}
    >
      {children}
    </div>
  );
}

function Arrow({ label, down }) {
  return (
    <div
      className={`flex ${down ? "flex-col" : ""} items-center justify-center text-slate-500 shrink-0 px-1`}
    >
      {label && (
        <span className="text-[10px] text-slate-400 font-mono mb-0.5">
          {label}
        </span>
      )}
      <span className="text-lg leading-none">{down ? "↓" : "→"}</span>
    </div>
  );
}

function Diagram({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 overflow-x-auto">
      {title && (
        <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-widest">
          ▸ {title}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─────────────────────────── 섹션별 다이어그램 ─────────────────────────── */

function StackDiagram() {
  const cols = [
    { step: "Code", tone: "cyan", svc: ["GitHub", "CodeCommit*", "Bitbucket"] },
    { step: "Build · Test", tone: "orange", svc: ["CodeBuild", "Jenkins"] },
    {
      step: "Deploy",
      tone: "green",
      svc: ["CodeDeploy", "Elastic Beanstalk†"],
    },
    {
      step: "Provision",
      tone: "purple",
      svc: ["EC2 / ASG", "ECS · Lambda", "CloudFormation"],
    },
  ];
  return (
    <Diagram title="AWS CI/CD 기술 스택 (전체 흐름)">
      <div className="flex items-stretch gap-1 min-w-max">
        {cols.map((c, i) => (
          <React.Fragment key={c.step}>
            <div className="flex flex-col gap-2 w-36">
              <DBox tone={c.tone}>{c.step}</DBox>
              {c.svc.map((s) => (
                <DBox key={s} small>
                  {s}
                </DBox>
              ))}
            </div>
            {i < cols.length - 1 && <Arrow />}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-dashed border-orange-500/50 bg-orange-500/5 px-3 py-2 text-center text-sm text-orange-200 font-medium">
        ⟵ AWS CodePipeline : 전 단계를 오케스트레이션(자동 연결) ⟶
      </div>
      <p className="mt-2 text-xs text-slate-500">
        * CodeCommit은 신규 고객 사용 불가 · † Elastic Beanstalk은 Deploy +
        Provision을 함께 담당
      </p>
    </Diagram>
  );
}

function CICDCompareDiagram() {
  const rows = [
    {
      name: "Continuous Integration (CI)",
      tone: "cyan",
      steps: ["코드 Push", "자동 빌드", "자동 테스트", "피드백"],
      note: "버그를 빨리 발견 · 배포 주기 단축",
    },
    {
      name: "Continuous Delivery",
      tone: "orange",
      steps: ["CI 통과", "릴리스 준비 완료", "수동 승인 ✋", "프로덕션 배포"],
      note: "언제든 배포 가능한 상태 유지 (배포 버튼은 사람이)",
    },
    {
      name: "Continuous Deployment",
      tone: "green",
      steps: ["CI 통과", "자동 스테이징", "자동 검증", "자동 프로덕션 배포"],
      note: "사람 개입 없이 프로덕션까지 완전 자동",
    },
  ];
  return (
    <Diagram title="CI vs Continuous Delivery vs Continuous Deployment">
      <div className="space-y-3 min-w-max">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="text-xs font-semibold text-slate-300 mb-1.5">
              {r.name}
            </div>
            <div className="flex items-center gap-1">
              {r.steps.map((s, i) => (
                <React.Fragment key={s}>
                  <DBox tone={r.tone} small>
                    {s}
                  </DBox>
                  {i < r.steps.length - 1 && <Arrow />}
                </React.Fragment>
              ))}
              <span className="ml-3 text-xs text-slate-500">{r.note}</span>
            </div>
          </div>
        ))}
      </div>
    </Diagram>
  );
}

function PipelineDiagram() {
  return (
    <Diagram title="CodePipeline — 스테이지 사이 아티팩트 흐름">
      <div className="flex items-center gap-1 min-w-max">
        <DBox tone="cyan">{"Source 스테이지\n(GitHub · S3 · ECR)"}</DBox>
        <Arrow label="output" />
        <DBox tone="slate" small>
          {"S3\n아티팩트 버킷"}
        </DBox>
        <Arrow label="input" />
        <DBox tone="orange">{"Build 스테이지\n(CodeBuild)"}</DBox>
        <Arrow label="output" />
        <DBox tone="slate" small>
          {"S3\n아티팩트 버킷"}
        </DBox>
        <Arrow label="input" />
        <DBox tone="purple">{"Manual\nApproval ✋"}</DBox>
        <Arrow />
        <DBox tone="green">{"Deploy 스테이지\n(CodeDeploy · EB · CFN)"}</DBox>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        각 스테이지의 산출물(아티팩트)은{" "}
        <span className="text-orange-300">S3에 저장</span>된 뒤 다음 스테이지의
        입력이 됩니다. 스테이지 간 서비스가 직접 통신하지 않습니다.
      </p>
    </Diagram>
  );
}

function BuildspecDiagram() {
  const phases = [
    ["install", "런타임 설치 (예: nodejs 18)"],
    ["pre_build", "빌드 전 명령 (예: ECR 로그인, 의존성 설치)"],
    ["build", "실제 빌드 명령"],
    ["post_build", "마무리 (예: docker push, 산출물 정리)"],
  ];
  return (
    <Diagram title="buildspec.yml 구조 — 4단계 phases">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col items-stretch gap-1">
          <DBox tone="slate" small>
            {"env — 환경변수\n(plaintext · parameter-store · secrets-manager)"}
          </DBox>
          <Arrow down />
          {phases.map(([p, d], i) => (
            <React.Fragment key={p}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <DBox tone="orange" small>
                    {p}
                  </DBox>
                </div>
                <span className="text-xs text-slate-400 flex-1">{d}</span>
              </div>
              {i < phases.length - 1 && <Arrow down />}
            </React.Fragment>
          ))}
          <Arrow down />
          <div className="flex gap-2">
            <div className="flex-1">
              <DBox tone="green" small>
                {"artifacts → S3\n(KMS 암호화)"}
              </DBox>
            </div>
            <div className="flex-1">
              <DBox tone="cyan" small>
                {"cache → S3\n(다음 빌드 재사용)"}
              </DBox>
            </div>
          </div>
        </div>
        <pre className="rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">{`version: 0.2
env:
  variables:
    JAVA_HOME: "/usr/lib/jvm/java-8"
  parameter-store:
    DB_PASSWORD: /my-app/db/password
phases:
  install:
    runtime-versions:
      nodejs: 18
  pre_build:
    commands:
      - npm install
  build:
    commands:
      - npm run build
  post_build:
    commands:
      - echo Build done
artifacts:
  files:
    - '**/*'
cache:
  paths:
    - node_modules/**/*`}</pre>
      </div>
    </Diagram>
  );
}

function CodeBuildArchDiagram() {
  return (
    <Diagram title="CodeBuild 동작 구조">
      <div className="flex items-center gap-1 min-w-max">
        <DBox tone="cyan">{"소스\nGitHub · S3\nBitbucket"}</DBox>
        <Arrow label="buildspec.yml" />
        <DBox tone="orange">
          {"빌드 Docker 컨테이너\n(관리형 이미지 or\n커스텀 이미지)"}
        </DBox>
        <Arrow />
        <div className="flex flex-col gap-2">
          <DBox tone="green" small>
            아티팩트 → S3
          </DBox>
          <DBox tone="slate" small>
            로그 → CloudWatch Logs / S3
          </DBox>
          <DBox tone="purple" small>
            지표·알람 → CloudWatch · EventBridge
          </DBox>
        </div>
      </div>
    </Diagram>
  );
}

function DeployTypeDiagram() {
  return (
    <Diagram title="EC2 배포 방식 — In-place vs Blue/Green">
      <div className="grid md:grid-cols-2 gap-4 min-w-max md:min-w-0">
        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2">
            In-place (기존 인스턴스 갱신)
          </div>
          <div className="flex items-center gap-1">
            <div className="flex flex-col gap-1.5">
              <DBox tone="blue" small>
                v1 → v2
              </DBox>
              <DBox tone="blue" small>
                v1 → v2
              </DBox>
              <DBox tone="blue" small>
                v1 → v2
              </DBox>
            </div>
            <span className="text-xs text-slate-400 ml-2">
              같은 인스턴스 위에서
              <br />
              순차적으로 새 버전 설치
              <br />
              (용량 일시 감소)
            </span>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2">
            Blue/Green (새 인프라로 교체)
          </div>
          <div className="flex items-center gap-1">
            <DBox tone="purple" small>
              {"ELB"}
            </DBox>
            <Arrow label="트래픽 전환" />
            <div className="flex flex-col gap-1.5">
              <DBox tone="blue" small>
                Blue: v1 (기존 ASG)
              </DBox>
              <DBox tone="green" small>
                Green: v2 (새 ASG)
              </DBox>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            새 ASG를 만들어 검증 후 ELB가 트래픽 전환 ·{" "}
            <span className="text-orange-300">ELB 필수</span> · 롤백이 빠름
          </p>
        </div>
      </div>
    </Diagram>
  );
}

function DeployConfigDiagram() {
  const cfgs = [
    {
      name: "AllAtOnce",
      desc: "전체 동시 배포",
      boxes: ["■", "■", "■", "■"],
      note: "가장 빠름 · 다운타임 위험",
      tone: "red",
    },
    {
      name: "HalfAtATime",
      desc: "절반씩 배포",
      boxes: ["■", "■", "□", "□"],
      note: "용량 50% 유지",
      tone: "orange",
    },
    {
      name: "OneAtATime",
      desc: "한 대씩 배포",
      boxes: ["■", "□", "□", "□"],
      note: "가장 느림 · 가용성 최고",
      tone: "green",
    },
  ];
  return (
    <Diagram title="Deployment Configuration (EC2 배포 속도)">
      <div className="space-y-2.5">
        {cfgs.map((c) => (
          <div key={c.name} className="flex items-center gap-3 flex-wrap">
            <div className="w-32">
              <Pill tone={c.tone}>{c.name}</Pill>
            </div>
            <span className="font-mono text-lg tracking-widest text-orange-300">
              {c.boxes.join(" ")}
            </span>
            <span className="text-xs text-slate-400">
              {c.desc} — {c.note}
            </span>
          </div>
        ))}
        <p className="text-xs text-slate-500">
          ■ = 새 버전 배포 중 · Custom(예: 최소 정상 호스트 75%)도 정의 가능
        </p>
      </div>
    </Diagram>
  );
}

function HooksDiagram() {
  const hooks = [
    ["ApplicationStop", "기존 앱 종료"],
    ["DownloadBundle", "S3에서 번들 다운로드 (Agent · 스크립트 불가)"],
    ["BeforeInstall", "설치 전 작업 (백업 등)"],
    ["Install", "파일 복사 (Agent · 스크립트 불가)"],
    ["AfterInstall", "설정 변경, 권한 부여"],
    ["ApplicationStart", "앱 시작"],
    ["ValidateService", "★ 배포 검증 (헬스체크)"],
  ];
  return (
    <Diagram title="appspec.yml 라이프사이클 훅 순서 (EC2 In-place)">
      <div className="flex flex-col gap-1 max-w-md">
        {hooks.map(([h, d], i) => (
          <React.Fragment key={h}>
            <div className="flex items-center gap-2">
              <div className="w-44 shrink-0">
                <DBox
                  tone={
                    h === "ValidateService"
                      ? "green"
                      : h === "DownloadBundle" || h === "Install"
                        ? "slate"
                        : "orange"
                  }
                  small
                >
                  {h}
                </DBox>
              </div>
              <span className="text-xs text-slate-400">{d}</span>
            </div>
            {i < hooks.length - 1 && <Arrow down />}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        ELB 사용 시 앞에{" "}
        <Pill tone="purple">
          BeforeBlockTraffic → BlockTraffic → AfterBlockTraffic
        </Pill>{" "}
        , 뒤에{" "}
        <Pill tone="purple">
          BeforeAllowTraffic → AllowTraffic → AfterAllowTraffic
        </Pill>{" "}
        가 추가됩니다.
      </p>
    </Diagram>
  );
}

function LambdaTrafficDiagram() {
  return (
    <Diagram title="Lambda 트래픽 시프팅 — Linear vs Canary vs AllAtOnce">
      <svg viewBox="0 0 640 220" className="w-full max-w-2xl">
        <line
          x1="50"
          y1="180"
          x2="610"
          y2="180"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <line
          x1="50"
          y1="180"
          x2="50"
          y2="20"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <text x="30" y="30" fill="#94a3b8" fontSize="11">
          100%
        </text>
        <text x="38" y="185" fill="#94a3b8" fontSize="11">
          0
        </text>
        <text x="560" y="200" fill="#94a3b8" fontSize="11">
          시간 →
        </text>
        <text
          x="12"
          y="110"
          fill="#94a3b8"
          fontSize="11"
          transform="rotate(-90 12 110)"
        >
          신버전 트래픽
        </text>
        {/* Linear: 계단식 */}
        <polyline
          points="50,180 130,180 130,140 210,140 210,100 290,100 290,60 370,60 370,25 610,25"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
        />
        {/* Canary: 10% 유지 후 점프 */}
        <polyline
          points="50,180 100,180 100,164 330,164 330,25 610,25"
          fill="none"
          stroke="#fb923c"
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />
        {/* AllAtOnce */}
        <polyline
          points="50,180 70,180 70,25 610,25"
          fill="none"
          stroke="#f87171"
          strokeWidth="2"
          strokeDasharray="2 3"
        />
        <text x="420" y="52" fill="#22d3ee" fontSize="12">
          Linear (매 N분 X%씩 증가)
        </text>
        <text x="150" y="158" fill="#fb923c" fontSize="12">
          Canary (X%로 검증 후 100%)
        </text>
        <text x="80" y="18" fill="#f87171" fontSize="12">
          AllAtOnce
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Pill tone="cyan">LambdaLinear10PercentEvery3Minutes</Pill>
        <Pill tone="orange">LambdaCanary10Percent5Minutes</Pill>
        <Pill tone="red">AllAtOnce</Pill>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Lambda 별칭(Alias)의 가중치로 트래픽을 나누며,{" "}
        <Pill tone="green">PreTraffic</Pill> /{" "}
        <Pill tone="green">PostTraffic</Pill> 훅(Lambda 함수)으로 검증할 수
        있습니다. CloudWatch 알람 발생 시 자동 롤백.
      </p>
    </Diagram>
  );
}

function ArtifactDiagram() {
  return (
    <Diagram title="CodeArtifact — 퍼블릭 저장소 프록시 구조">
      <div className="flex items-center gap-1 min-w-max">
        <DBox tone="blue">
          {"개발자 · CodeBuild\n(npm, pip, maven,\ngradle, nuget, twine)"}
        </DBox>
        <Arrow label="요청" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono text-slate-400">Domain</span>
          <DBox tone="orange">{"CodeArtifact\nRepository\n(패키지 캐시)"}</DBox>
          <DBox tone="slate" small>
            Upstream Repo (최대 10)
          </DBox>
        </div>
        <Arrow label="최초 1회 fetch" />
        <DBox tone="cyan">{"퍼블릭 저장소\nnpmjs · PyPI\nMaven Central"}</DBox>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        한 번 가져온 패키지는 캐시되어{" "}
        <span className="text-orange-300">
          퍼블릭 저장소 장애 시에도 빌드 가능
        </span>
        . 패키지 버전 생성/수정 이벤트는 EventBridge로 전송되어 CodePipeline
        재실행 등에 활용됩니다.
      </p>
    </Diagram>
  );
}

function CodeGuruDiagram() {
  return (
    <Diagram title="CodeGuru — Reviewer(개발 단계) vs Profiler(운영 단계)">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/5 p-3">
          <div className="text-sm font-semibold text-cyan-300 mb-2">
            CodeGuru Reviewer — 정적 코드 리뷰
          </div>
          <div className="flex items-center gap-1">
            <DBox tone="slate" small>
              {"코드 커밋\n(CodeCommit·GitHub·Bitbucket)"}
            </DBox>
            <Arrow />
            <DBox tone="cyan" small>
              {"ML 분석"}
            </DBox>
            <Arrow />
            <DBox tone="green" small>
              {"리뷰 코멘트"}
            </DBox>
          </div>
          <ul className="mt-2 text-xs text-slate-400 list-disc pl-4 space-y-0.5">
            <li>버그, 메모리 누수, 리소스 누수, 입력 검증, 보안 취약점 탐지</li>
            <li>Java · Python 지원</li>
          </ul>
        </div>
        <div className="rounded-lg border border-purple-500/40 bg-purple-500/5 p-3">
          <div className="text-sm font-semibold text-purple-300 mb-2">
            CodeGuru Profiler — 런타임 성능 분석
          </div>
          <div className="flex items-center gap-1">
            <DBox tone="slate" small>
              {"실행 중인 앱\n(+ 에이전트)"}
            </DBox>
            <Arrow />
            <DBox tone="purple" small>
              {"프로파일링"}
            </DBox>
            <Arrow />
            <DBox tone="green" small>
              {"CPU·비용 최적화\n권장사항"}
            </DBox>
          </div>
          <ul className="mt-2 text-xs text-slate-400 list-disc pl-4 space-y-0.5">
            <li>CPU 사용률 이해, 힙 요약, 이상 징후(Anomaly) 탐지</li>
            <li>프로덕션에서 낮은 오버헤드로 상시 실행 · Lambda 지원</li>
          </ul>
        </div>
      </div>
    </Diagram>
  );
}

/* ─────────────────────────── 섹션 콘텐츠 ─────────────────────────── */

const sections = [
  {
    id: "intro",
    nav: "CI/CD 소개",
    lecture: "360–361강",
    title: "AWS의 CI/CD 소개",
    freq: "high",
    body: (
      <>
        <Card title="왜 CI/CD인가?">
          <p>
            지금까지는 콘솔·CLI·Elastic Beanstalk 등으로{" "}
            <b className="text-slate-100">수동 배포</b>를 했습니다. 코드를
            자동으로, 안전하게, 반복 가능하게 배포하려면{" "}
            <b className="text-slate-100">자동화된 파이프라인</b>이 필요합니다.
            이것이 CI/CD의 핵심입니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>배포 전 자동 테스트로 사람의 실수 제거</li>
            <li>dev → test → staging → prod 환경별 단계적 배포</li>
            <li>필요 시 수동 승인 게이트 추가 가능</li>
          </ul>
        </Card>
        <CICDCompareDiagram />
        <Card title="세 가지 개념 구분 (시험 단골)">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <b className="text-cyan-300">CI (지속적 통합)</b>: 개발자가 코드를
              자주 push → 빌드/테스트 서버가 자동으로 검증 → 빠른 피드백으로
              버그 조기 발견, 배포 주기 단축.
            </li>
            <li>
              <b className="text-orange-300">
                Continuous Delivery (지속적 전달)
              </b>
              : 언제든 릴리스할 수 있는 상태를 유지. 배포 자체는 자동화되어
              있지만 <b>프로덕션 반영은 수동 승인</b>일 수 있음.
            </li>
            <li>
              <b className="text-emerald-300">
                Continuous Deployment (지속적 배포)
              </b>
              : 모든 변경이 파이프라인을 통과하면{" "}
              <b>사람 개입 없이 프로덕션까지 자동 배포</b>.
            </li>
          </ul>
        </Card>
        <StackDiagram />
        <ExamTip>
          "Delivery vs Deployment"의 차이(수동 승인 유무)와, 각
          단계(Code/Build/Deploy/Provision)에 대응하는 AWS 서비스를 매칭하는
          문제가 나옵니다. CodePipeline이 전체를 오케스트레이션한다는 점을
          기억하세요.
        </ExamTip>
      </>
    ),
  },
  {
    id: "codecommit",
    nav: "CodeCommit",
    lecture: "362–364강",
    title: "CodeCommit 개요 & 서비스 종료",
    freq: "low",
    body: (
      <>
        <Card title="CodeCommit이란?" accent="border-cyan-500/40">
          <p>
            AWS가 호스팅하는{" "}
            <b className="text-slate-100">프라이빗 Git 저장소</b> 서비스입니다.
            (GitHub · GitLab · Bitbucket의 AWS 버전)
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>저장소 크기 제한 없음, 완전관리형 · 고가용성</li>
            <li>AWS 계정 안에 코드 보관 → 보안·규정 준수에 유리</li>
            <li>보안: 저장 시 암호화(KMS), 전송 중 암호화(HTTPS/SSH)</li>
            <li>Jenkins · CodeBuild 등 CI 도구와 통합</li>
          </ul>
        </Card>
        <Card title="인증과 접근 제어">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <b>SSH 키</b>: IAM 사용자가 콘솔에서 공개키 등록
            </li>
            <li>
              <b>HTTPS</b>: IAM의 Git 자격증명(Git credentials) 생성
            </li>
            <li>
              <b>권한 관리</b>: IAM 정책으로 사용자/역할 권한 제어
            </li>
            <li>
              <b>교차 계정 접근</b>: SSH 키·자격증명 공유 ✕ →{" "}
              <b className="text-orange-300">IAM Role + STS AssumeRole</b> 사용
            </li>
          </ul>
        </Card>
        <Card
          title="⚠ 중요: CodeCommit 서비스 종료(Discontinuation)"
          accent="border-red-500/50"
        >
          <p>
            <b className="text-red-300">
              2024년 7월 25일부터 신규 고객은 CodeCommit을 사용할 수 없습니다.
            </b>{" "}
            기존 고객은 계속 사용할 수 있지만, AWS는 GitHub · GitLab 등 외부 Git
            공급자로의 마이그레이션을 안내하고 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>강의·시험에는 여전히 등장할 수 있으나 비중은 줄어드는 추세</li>
            <li>
              실무/실습에서는 <b>GitHub를 소스 공급자</b>로 사용
              (CodePipeline·CodeBuild는 GitHub와 완전 통합)
            </li>
          </ul>
        </Card>
        <ExamTip>
          CodeCommit 자체 문제 출제는 줄고 있지만, "AWS 계정 내 프라이빗 Git",
          "IAM 기반 인증(SSH/HTTPS Git credentials)", "교차 계정은 IAM Role"
          개념은 알고 있어야 합니다.
        </ExamTip>
      </>
    ),
  },
  {
    id: "codepipeline",
    nav: "CodePipeline",
    lecture: "365강",
    title: "CodePipeline 개요",
    freq: "high",
    body: (
      <>
        <Card title="CodePipeline이란?" accent="border-orange-500/40">
          <p>
            <b className="text-slate-100">
              CI/CD 전체 흐름을 시각적으로 오케스트레이션
            </b>
            하는 완전관리형 서비스입니다.
          </p>
          <div className="grid md:grid-cols-2 gap-2 mt-2 text-xs">
            <div className="rounded-lg bg-slate-800/70 p-2.5">
              <b className="text-cyan-300">Source</b> — CodeCommit, ECR, S3,
              Bitbucket, GitHub
            </div>
            <div className="rounded-lg bg-slate-800/70 p-2.5">
              <b className="text-orange-300">Build</b> — CodeBuild, Jenkins,
              CloudBees, TeamCity
            </div>
            <div className="rounded-lg bg-slate-800/70 p-2.5">
              <b className="text-purple-300">Test</b> — CodeBuild, AWS Device
              Farm, 서드파티
            </div>
            <div className="rounded-lg bg-slate-800/70 p-2.5">
              <b className="text-emerald-300">Deploy</b> — CodeDeploy, Elastic
              Beanstalk, CloudFormation, ECS, S3 …
            </div>
            <div className="rounded-lg bg-slate-800/70 p-2.5 md:col-span-2">
              <b className="text-blue-300">Invoke</b> — Lambda, Step Functions
            </div>
          </div>
        </Card>
        <PipelineDiagram />
        <Card title="스테이지(Stage) 구조">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              파이프라인은 여러 <b>스테이지</b>로 구성 (예: Build → Test →
              Deploy → LoadTesting)
            </li>
            <li>
              각 스테이지는 <b>순차 또는 병렬 액션 그룹</b>을 가질 수 있음
            </li>
            <li>
              원하는 스테이지에{" "}
              <b className="text-orange-300">수동 승인(Manual Approval)</b> 액션
              추가 가능 — 승인자는 <Code>codepipeline:GetPipeline*</Code> +{" "}
              <Code>codepipeline:PutApprovalResult</Code> IAM 권한 필요
            </li>
          </ul>
        </Card>
        <Card title="트러블슈팅 (시험 단골)">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              파이프라인 상태 변화(실패, 취소 등)는{" "}
              <b className="text-orange-300">EventBridge 이벤트</b>를 생성 →
              실패 시 SNS 알림 등 자동화 가능
            </li>
            <li>
              스테이지 실패 시 파이프라인이 멈추고 콘솔에서 원인 확인 가능
            </li>
            <li>
              "파이프라인이 어떤 동작을 수행할 수 없다"면 →{" "}
              <b>IAM Service Role 권한 부족</b>을 의심
            </li>
            <li>
              API 호출 감사(누가 무엇을 했나)는 <b>CloudTrail</b>
            </li>
          </ul>
        </Card>
        <ExamTip>
          ① 아티팩트는 스테이지 사이에서 <b>S3</b>를 통해 전달된다 ② 상태 변화
          감지는 <b>EventBridge</b> ③ 권한 문제는 <b>서비스 롤</b> — 이 세 가지
          조합 문제가 매우 자주 나옵니다.
        </ExamTip>
      </>
    ),
  },
  {
    id: "codebuild",
    nav: "CodeBuild",
    lecture: "368강",
    title: "CodeBuild 개요",
    freq: "high",
    body: (
      <>
        <Card title="CodeBuild란?" accent="border-orange-500/40">
          <p>
            <b className="text-slate-100">완전관리형 빌드·테스트 서비스</b>
            입니다. 빌드 서버(Jenkins 등)를 직접 관리할 필요가 없고, 사용한 빌드
            시간만큼만 과금됩니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              빌드는 <b>Docker 컨테이너 안에서 실행</b> — AWS 관리형 이미지 또는
              커스텀 Docker 이미지 사용 가능
            </li>
            <li>
              빌드 지침은 소스 코드 루트의 <Code>buildspec.yml</Code> 파일
              (콘솔에서 직접 입력도 가능)
            </li>
            <li>CodePipeline과 함께 쓰거나 단독으로도 사용 가능</li>
          </ul>
        </Card>
        <CodeBuildArchDiagram />
        <BuildspecDiagram />
        <Card title="buildspec.yml 핵심 (시험 최중요)">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <b>위치</b>: 반드시 소스 코드의{" "}
              <b className="text-orange-300">루트 디렉터리</b>
            </li>
            <li>
              <b>env</b>: 일반 변수 / <Pill tone="cyan">parameter-store</Pill>{" "}
              (SSM) / <Pill tone="cyan">secrets-manager</Pill> —{" "}
              <b>비밀값은 하드코딩하지 않고 여기서 참조</b>
            </li>
            <li>
              <b>phases</b>: <Code>install</Code> → <Code>pre_build</Code> →{" "}
              <Code>build</Code> → <Code>post_build</Code>
            </li>
            <li>
              <b>artifacts</b>: 산출물을 S3로 업로드 (KMS 암호화)
            </li>
            <li>
              <b>cache</b>: 의존성 등을 S3에 캐시해 <b>다음 빌드 속도 향상</b>
            </li>
          </ul>
        </Card>
        <Card title="모니터링 · 기타 기능">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              로그: <b>CloudWatch Logs & S3</b> 저장
            </li>
            <li>
              CloudWatch Metrics(빌드 통계) · CloudWatch Alarms(실패 임계값
              알림) · EventBridge(이벤트 기반 알림)
            </li>
            <li>
              <b className="text-orange-300">로컬 빌드</b>: 문제를 로컬에서
              재현하려면 Docker + <b>CodeBuild Agent</b> 실행
            </li>
            <li>
              <b className="text-orange-300">VPC 내 빌드</b>: 기본은 VPC 밖에서
              실행 → VPC 구성(VPC ID, 서브넷, SG)을 지정하면 VPC 안의{" "}
              <b>RDS · ElastiCache · EC2 등 프라이빗 리소스에 접근</b> 가능
            </li>
          </ul>
        </Card>
        <ExamTip>
          "빌드에서 DB 비밀번호를 안전하게 쓰려면?" → buildspec의{" "}
          <b>parameter-store / secrets-manager</b>. "VPC 안의 RDS에 접근해 통합
          테스트를 하려면?" → <b>VPC 구성 지정</b>. "로컬에서 빌드 실패를
          재현하려면?" → <b>CodeBuild Agent</b>. 세 문제 모두 단골입니다.
        </ExamTip>
      </>
    ),
  },
  {
    id: "codedeploy",
    nav: "CodeDeploy",
    lecture: "371 · 373강",
    title: "CodeDeploy 개요 + EC2/ASG",
    freq: "high",
    body: (
      <>
        <Card title="CodeDeploy란?" accent="border-orange-500/40">
          <p>
            <b className="text-slate-100">
              새 애플리케이션 버전의 배포를 자동화
            </b>
            하는 서비스입니다. 배포 대상 플랫폼은 4가지:
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <Pill tone="blue">EC2 인스턴스</Pill>
            <Pill tone="blue">온프레미스 서버</Pill>
            <Pill tone="purple">Lambda 함수</Pill>
            <Pill tone="purple">ECS 서비스</Pill>
          </div>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              점진적 배포 제어, <b>CloudWatch 알람 기반 자동 롤백</b> 지원
            </li>
            <li>
              배포 정의 파일: <Code>appspec.yml</Code>
            </li>
          </ul>
        </Card>
        <Card title="EC2 / 온프레미스 플랫폼">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              대상 머신에 <b className="text-orange-300">CodeDeploy Agent</b>가
              실행 중이어야 함 (Systems Manager로 설치·자동 업데이트 가능)
            </li>
            <li>
              Agent가 S3에서 앱 번들을 가져오므로{" "}
              <b>EC2 인스턴스 프로파일에 S3 읽기 권한 필요</b>
            </li>
            <li>대상 식별: EC2 태그 또는 온프레미스 등록</li>
          </ul>
        </Card>
        <DeployTypeDiagram />
        <DeployConfigDiagram />
        <HooksDiagram />
        <Card title="Auto Scaling Group과 함께 쓸 때 (373강)">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <b>In-place</b>: 기존 인스턴스를 갱신하고, ASG가 새로 띄운
              인스턴스에도 자동으로 배포
            </li>
            <li>
              <b>Blue/Green</b>:{" "}
              <b className="text-orange-300">새 ASG를 생성</b>(설정 복사) → 검증
              후 ELB가 트래픽 전환 → 이전 ASG 유지 시간 설정 가능 ·{" "}
              <b>ELB 필수</b>
            </li>
            <li className="text-red-300">
              <b>주의 — Redeploy & Rollback</b>: 롤백이 발생하면 CodeDeploy는
              마지막 정상 버전을 <b>"새로운 배포"로 다시 배포</b>합니다(이전
              버전 복원이 아니라 새 배포 ID가 생김).
            </li>
          </ul>
        </Card>
        <ExamTip>
          DVA에서 가장 많이 나오는 서비스 중 하나입니다. ① 훅 실행 <b>순서</b>
          (특히 ValidateService가 마지막 검증) ②{" "}
          <b>DownloadBundle·Install은 스크립트를 넣을 수 없음</b> ③ Agent + S3
          권한 ④ Blue/Green은 ELB 필수 ⑤ 롤백 = 새 배포 — 모두 기출
          포인트입니다.
        </ExamTip>
      </>
    ),
  },
  {
    id: "lambda-ecs",
    nav: "Lambda · ECS 배포",
    lecture: "371강 후반",
    title: "CodeDeploy — Lambda & ECS 플랫폼",
    freq: "high",
    body: (
      <>
        <Card title="Lambda 플랫폼" accent="border-purple-500/40">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Lambda <b>별칭(Alias)</b>의 버전 간{" "}
              <b className="text-orange-300">트래픽 시프팅</b>을 자동화 (예: v1
              → v2)
            </li>
            <li>SAM 프레임워크와 기본 통합</li>
            <li>
              배포 전략: <b>Linear</b>(일정 간격으로 %씩 증가), <b>Canary</b>
              (소량으로 검증 후 100%), <b>AllAtOnce</b>
            </li>
            <li>
              <Pill tone="green">PreTraffic</Pill> /{" "}
              <Pill tone="green">PostTraffic</Pill> 훅으로 배포 전·후 검증 (훅은
              Lambda 함수)
            </li>
          </ul>
        </Card>
        <LambdaTrafficDiagram />
        <Card title="ECS 플랫폼" accent="border-purple-500/40">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              새 ECS <b>태스크 정의(Task Definition)</b>를 만들어{" "}
              <b className="text-orange-300">Blue/Green 배포만 지원</b>
            </li>
            <li>
              <b>로드 밸런서 필수</b> — 새(Green) 태스크 세트를 띄운 뒤 트래픽
              전환
            </li>
            <li>
              트래픽 전환 방식: Linear / Canary / AllAtOnce (예:{" "}
              <Code>ECSLinear10PercentEvery3Minutes</Code>,{" "}
              <Code>ECSCanary10Percent5Minutes</Code>)
            </li>
            <li>
              새 태스크 정의와 컨테이너 이미지는 미리 준비되어 있어야 함
              (CodeDeploy가 이미지를 빌드하지 않음)
            </li>
          </ul>
        </Card>
        <ExamTip>
          "Lambda 새 버전에 10% 트래픽으로 5분 검증 후 전체 전환" →{" "}
          <b>Canary 10Percent5Minutes</b>. "ECS를 무중단으로 새 버전 전환" →{" "}
          <b>CodeDeploy Blue/Green + ALB</b>. 배포 구성 이름을 보고 동작을
          해석하는 문제가 자주 출제됩니다.
        </ExamTip>
      </>
    ),
  },
  {
    id: "codeartifact",
    nav: "CodeArtifact",
    lecture: "374강",
    title: "CodeArtifact 개요",
    freq: "mid",
    body: (
      <>
        <Card title="CodeArtifact란?" accent="border-cyan-500/40">
          <p>
            소프트웨어는 서로 의존하며(코드 의존성), 이를 저장·관리하는 것이{" "}
            <b className="text-slate-100">아티팩트 관리</b>입니다.
            CodeArtifact는 안전하고 확장 가능한{" "}
            <b>완전관리형 아티팩트 저장소</b>입니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              지원 도구: <Pill tone="cyan">Maven</Pill>{" "}
              <Pill tone="cyan">Gradle</Pill> <Pill tone="cyan">npm</Pill>{" "}
              <Pill tone="cyan">yarn</Pill> <Pill tone="cyan">pip</Pill>{" "}
              <Pill tone="cyan">twine</Pill> <Pill tone="cyan">NuGet</Pill>
            </li>
            <li>개발자와 CodeBuild가 여기서 의존성을 받아 빌드</li>
          </ul>
        </Card>
        <ArtifactDiagram />
        <Card title="핵심 개념">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <b className="text-orange-300">퍼블릭 저장소 프록시</b>:
              npmjs·PyPI 등에서 최초 1회 가져와 캐시 → 이후 퍼블릭 장애/삭제에도
              빌드 가능, 버전 고정에 유리
            </li>
            <li>
              <b>Domain</b>: 여러 리포지토리를 묶는 단위. 도메인 안에서는
              패키지가 <b>중복 없이 한 번만 저장(dedup)</b>되고 KMS 키 공유
            </li>
            <li>
              <b>Upstream Repository</b>: 리포지토리 하나가 최대 10개의
              업스트림을 가질 수 있음 → 개발자는 <b>엔드포인트 하나만</b>{" "}
              바라보면 됨
            </li>
            <li>
              <b>EventBridge 통합</b>: 패키지 버전 생성/수정/삭제 이벤트 발생 →
              Lambda·SNS·SQS 호출, <b>CodePipeline 자동 재실행</b>(최신
              의존성으로 재빌드) 등
            </li>
            <li>
              <b>Resource Policy</b>: 다른 AWS 계정에 접근 허용 가능 — 단, 특정
              계정/역할에 대해{" "}
              <b className="text-orange-300">
                저장소 전체 읽기 or 아무것도 못 읽기
              </b>{" "}
              (패키지 단위 제어 불가)
            </li>
          </ul>
        </Card>
        <ExamTip>
          "퍼블릭 npm 레지스트리 장애에도 빌드가 가능해야 한다" → CodeArtifact
          프록시/캐시. "의존성이 업데이트되면 파이프라인을 자동 재실행" →
          EventBridge. "타 계정 공유는 전부 아니면 전무" — 이 세 가지가 출제
          포인트입니다.
        </ExamTip>
      </>
    ),
  },
  {
    id: "codeguru",
    nav: "CodeGuru",
    lecture: "376–377강",
    title: "CodeGuru 개요 & 에이전트 구성",
    freq: "low",
    body: (
      <>
        <Card title="CodeGuru란?" accent="border-purple-500/40">
          <p>
            <b className="text-slate-100">머신러닝 기반</b>의 자동 코드
            리뷰(Reviewer)와 애플리케이션 성능 분석(Profiler) 서비스입니다.
          </p>
        </Card>
        <CodeGuruDiagram />
        <Card title="Reviewer vs Profiler 비교">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700">
                  <th className="py-2 pr-3"></th>
                  <th className="py-2 pr-3 text-cyan-300">Reviewer</th>
                  <th className="py-2 text-purple-300">Profiler</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-3 text-slate-400">시점</td>
                  <td className="py-2 pr-3">개발 단계 (정적 분석)</td>
                  <td className="py-2">운영 단계 (런타임)</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-3 text-slate-400">대상</td>
                  <td className="py-2 pr-3">커밋된 소스 코드</td>
                  <td className="py-2">실행 중인 애플리케이션</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 pr-3 text-slate-400">찾는 것</td>
                  <td className="py-2 pr-3">
                    버그, 메모리/리소스 누수, 보안 취약점, 입력 검증 문제
                  </td>
                  <td className="py-2">
                    CPU 낭비 코드, 성능 병목, 비용 최적화 기회, 힙 요약, 이상
                    징후
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 text-slate-400">특징</td>
                  <td className="py-2 pr-3">
                    수천 개 오픈소스+Amazon 코드로 학습 · Java/Python ·
                    GitHub/Bitbucket/CodeCommit 연동
                  </td>
                  <td className="py-2">
                    오버헤드 최소 · 프로덕션 상시 실행 가능 · Lambda 지원 ·
                    에이전트 필요
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Profiler 에이전트 구성 파라미터 (377강)">
          <ul className="list-disc pl-5 space-y-1.5 font-mono text-xs">
            <li>
              <Code>MaxStackDepth</Code> —{" "}
              <span className="font-sans text-slate-300">
                분석할 콜스택 최대 깊이 (예: A→B→C→D에서 2로 설정 시 A,B만 수집)
              </span>
            </li>
            <li>
              <Code>MemoryUsageLimitPercent</Code> —{" "}
              <span className="font-sans text-slate-300">
                프로파일러가 사용할 수 있는 메모리 비율 상한
              </span>
            </li>
            <li>
              <Code>MinimumTimeForReportingInMilliseconds</Code> —{" "}
              <span className="font-sans text-slate-300">
                보고서 전송 최소 간격
              </span>
            </li>
            <li>
              <Code>ReportingIntervalInMilliseconds</Code> —{" "}
              <span className="font-sans text-slate-300">
                프로파일 보고 주기
              </span>
            </li>
            <li>
              <Code>SamplingIntervalInMilliseconds</Code> —{" "}
              <span className="font-sans text-slate-300">
                샘플링 주기 (줄이면 샘플링 비율 ↑, 더 정밀)
              </span>
            </li>
          </ul>
        </Card>
        <ExamTip>
          출제 비중은 낮지만, "정적 코드 리뷰 = Reviewer / 런타임 성능 =
          Profiler" 구분 문제와 에이전트 파라미터(특히 SamplingInterval을 줄이면
          정밀도↑)를 묻는 문제가 간혹 나옵니다.
        </ExamTip>
      </>
    ),
  },
  {
    id: "summary",
    nav: "총정리 · 빈출도",
    lecture: "퀴즈 21 대비",
    title: "섹션 총정리 & 빈출도 맵",
    freq: "high",
    body: (
      <>
        <Card title="서비스별 출제 비중 한눈에 보기">
          <div className="space-y-2.5">
            {[
              {
                name: "CodeDeploy (훅 순서 · 배포구성 · Lambda 트래픽시프팅)",
                w: "w-full",
                level: "high",
              },
              {
                name: "CodePipeline (아티팩트=S3 · EventBridge · 승인)",
                w: "w-11/12",
                level: "high",
              },
              {
                name: "CodeBuild (buildspec.yml · 비밀값 · VPC · 캐시)",
                w: "w-10/12",
                level: "high",
              },
              {
                name: "CI/CD 개념 (Delivery vs Deployment)",
                w: "w-8/12",
                level: "high",
              },
              {
                name: "CodeArtifact (프록시 캐시 · Domain · EventBridge)",
                w: "w-6/12",
                level: "mid",
              },
              {
                name: "CodeGuru (Reviewer vs Profiler)",
                w: "w-3/12",
                level: "low",
              },
              {
                name: "CodeCommit (서비스 종료로 비중 감소)",
                w: "w-2/12",
                level: "low",
              },
            ].map((r) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{r.name}</span>
                  <FreqBadge level={r.level} />
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.w} ${r.level === "high" ? "bg-gradient-to-r from-orange-500 to-red-500" : r.level === "mid" ? "bg-amber-400" : "bg-emerald-500"}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            ※ 빈출도는 DVA-C02 일반적인 출제 경향에 근거한 추정치이며, 실제 시험
            구성은 회차마다 다를 수 있습니다.
          </p>
        </Card>
        <Card title="30초 요약 카드">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <b>CI</b>=자주 통합·자동 테스트, <b>Delivery</b>=수동 승인 가능,{" "}
              <b>Deployment</b>=프로덕션까지 전자동
            </li>
            <li>
              <b>CodePipeline</b>: 오케스트레이터 · 아티팩트는 <b>S3</b> 경유 ·
              상태변화는 <b>EventBridge</b> · 권한문제는 서비스 롤
            </li>
            <li>
              <b>CodeBuild</b>: 컨테이너에서 <Code>buildspec.yml</Code> 실행 ·
              비밀은 Parameter Store/Secrets Manager · 캐시는 S3 · VPC 구성 시
              프라이빗 리소스 접근
            </li>
            <li>
              <b>CodeDeploy</b>: EC2(Agent 필요)/Lambda/ECS · In-place vs
              Blue/Green · 훅 마지막 검증은 <b>ValidateService</b> · 롤백=새
              배포
            </li>
            <li>
              <b>Lambda 배포</b>: Alias 트래픽 시프팅 (Linear/Canary/AllAtOnce)
              + Pre/PostTraffic 훅
            </li>
            <li>
              <b>ECS 배포</b>: Blue/Green만 · LB 필수 · 이미지는 미리 빌드
            </li>
            <li>
              <b>CodeArtifact</b>: 의존성 저장소 겸 퍼블릭 프록시(캐시) · Domain
              · 업스트림 최대 10 · 계정 공유는 전부/전무
            </li>
            <li>
              <b>CodeGuru</b>: Reviewer=코드 리뷰(정적), Profiler=런타임
              성능(에이전트)
            </li>
            <li>
              <b>CodeCommit</b>: 2024-07-25부터 신규 사용 불가 → GitHub 권장
            </li>
          </ul>
        </Card>
      </>
    ),
  },
];

/* ─────────────────────────── 메인 컴포넌트 ─────────────────────────── */

export default function AwsDvaCicd() {
  const [active, setActive] = useState(0);
  const sec = sections[active];

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200"
      style={{
        fontFamily: "'Pretendard', 'Noto Sans KR', system-ui, sans-serif",
      }}
    >
      {/* 헤더 */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-mono text-xs text-orange-400 tracking-widest">
              AWS DVA-C02 · SECTION 21
            </span>
            <span className="font-mono text-xs text-slate-500">
              360–377강 (실습 제외)
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
            AWS CI/CD{" "}
            <span className="text-orange-400">파이프라인 완전 정복</span>
          </h1>
          {/* 시그니처: 파이프라인형 내비게이션 */}
          <nav
            className="mt-4 flex items-center gap-0 overflow-x-auto pb-1"
            aria-label="섹션 이동"
          >
            {sections.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    i === active
                      ? "border-orange-500 bg-orange-500/15 text-orange-300"
                      : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  }`}
                >
                  {s.nav}
                </button>
                {i < sections.length - 1 && (
                  <span
                    className={`shrink-0 w-4 h-px ${i < active ? "bg-orange-500" : "bg-slate-700"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <span className="font-mono text-xs text-slate-500">
            {sec.lecture}
          </span>
          <h2 className="text-lg md:text-xl font-bold text-white">
            {sec.title}
          </h2>
          <FreqBadge level={sec.freq} />
        </div>
        <div className="space-y-4">{sec.body}</div>

        {/* 이전/다음 */}
        <div className="flex justify-between mt-8 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActive(Math.max(0, active - 1))}
            disabled={active === 0}
            className="px-4 py-2 rounded-lg text-sm border border-slate-700 text-slate-300 disabled:opacity-30 hover:border-orange-500 hover:text-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            ← 이전
          </button>
          <button
            onClick={() => setActive(Math.min(sections.length - 1, active + 1))}
            disabled={active === sections.length - 1}
            className="px-4 py-2 rounded-lg text-sm border border-slate-700 text-slate-300 disabled:opacity-30 hover:border-orange-500 hover:text-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            다음 →
          </button>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-8 text-xs text-slate-600">
        빈출도는 일반적인 DVA-C02 출제 경향 기반 추정치입니다 · 실습(Hands-on)
        강의 내용은 제외했습니다
      </footer>
    </div>
  );
}
