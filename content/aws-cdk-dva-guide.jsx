import { useState } from "react";

/* ─────────────────────────────────────────────
   AWS CDK · DVA-C02 시험 핵심 정리 (인터랙티브 가이드)
   범위: 강의 389 개요 · 391 구조 · 392 명령어/부트스트래핑 · 393 유닛 테스트
   (390 실습 제외 · 이론 전체 포함 · 출제 빈도 추정 포함)
───────────────────────────────────────────── */

const C = {
  bg: "#EEF2F6",
  card: "#FFFFFF",
  ink: "#16232F",
  sub: "#5F7080",
  faint: "#8CA0B3",
  line: "#DCE4EB",
  aws: "#EC7211",
  awsDeep: "#B3540C",
  awsSoft: "#FDEEDF",
  awsLine: "#F3C79C",
  cfn: "#C2255C",
  cfnSoft: "#FCE7F0",
  cfnLine: "#F2BBD2",
  navy: "#0F1B2B",
  navyLine: "#26405C",
  green: "#4CD98A",
  greenInk: "#1B7A4B",
  greenSoft: "#E2F7EC",
  greenLine: "#B7E6CC",
  blue: "#2B6CB0",
  blueSoft: "#E7F0FA",
  blueLine: "#BCD4EC",
  yellowSoft: "#FFF6DF",
  yellowLine: "#E8C86E",
  yellowInk: "#8A6A12",
};

const FONT = "'IBM Plex Sans KR','Noto Sans KR',-apple-system,'Segoe UI',sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace";

/* ───────────── 공용 소품 ───────────── */

function Freq({ n }) {
  const label = n === 3 ? "빈출" : n === 2 ? "종종 출제" : "가끔 출제";
  const heights = [5, 9, 13];
  const hot = n === 3;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "3px 10px", borderRadius: 999,
        background: hot ? C.awsSoft : "#EDF1F5",
        border: `1px solid ${hot ? C.awsLine : C.line}`,
        flexShrink: 0,
      }}
      aria-label={`출제 빈도: ${label}`}
    >
      <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 13 }}>
        {heights.map((h, i) => (
          <span key={i} style={{
            width: 4, height: h, borderRadius: 1.5,
            background: i < n ? C.aws : "#C9D4DE",
          }} />
        ))}
      </span>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: hot ? C.awsDeep : C.sub, whiteSpace: "nowrap" }}>
        {label}
      </span>
    </span>
  );
}

function Card({ children, style, tone }) {
  const tones = {
    aws: { background: C.awsSoft, border: `1px solid ${C.awsLine}` },
    cfn: { background: C.cfnSoft, border: `1px solid ${C.cfnLine}` },
    blue: { background: C.blueSoft, border: `1px solid ${C.blueLine}` },
    green: { background: C.greenSoft, border: `1px solid ${C.greenLine}` },
  };
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.line}`, borderRadius: 14,
      padding: "16px 18px", ...(tone ? tones[tone] : {}), ...style,
    }}>
      {children}
    </div>
  );
}

function Section({ title, freq, desc, children }) {
  return (
    <section style={{ marginTop: 30 }}>
      <div className="flex flex-wrap items-center" style={{ gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: C.ink, letterSpacing: "-0.3px" }}>
          {title}
        </h2>
        {freq && <Freq n={freq} />}
      </div>
      {desc && (
        <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.75, color: C.sub, maxWidth: 720 }}>
          {desc}
        </p>
      )}
      <div style={{ marginTop: 14 }}>{children}</div>
    </section>
  );
}

function Prompt({ cmd, note }) {
  return (
    <div className="flex flex-wrap items-center" style={{ gap: 8, fontFamily: MONO, fontSize: 13 }}>
      <span style={{ color: C.aws, fontWeight: 600 }}>dva@exam</span>
      <span style={{ color: C.faint }}>~/cdk $</span>
      <span style={{ color: C.ink, fontWeight: 600 }}>{cmd}</span>
      {note && <span style={{ color: C.faint }}># {note}</span>}
    </div>
  );
}

function Term({ title, children }) {
  return (
    <div style={{
      background: C.navy, borderRadius: 12, border: `1px solid ${C.navyLine}`,
      overflow: "hidden", boxShadow: "0 2px 10px rgba(15,27,43,0.18)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
        borderBottom: `1px solid ${C.navyLine}`,
      }}>
        {["#F26D6D", "#F2C36D", "#6DD98A"].map((c) => (
          <span key={c} style={{ width: 9, height: 9, borderRadius: 999, background: c, opacity: 0.9 }} />
        ))}
        <span style={{ marginLeft: 8, color: "#7E93A8", fontFamily: MONO, fontSize: 11 }}>{title}</span>
      </div>
      <pre style={{
        margin: 0, padding: "13px 15px", fontFamily: MONO, fontSize: 12.5,
        lineHeight: 1.75, color: "#D7E3EE", overflowX: "auto",
      }}>
        {children}
      </pre>
    </div>
  );
}

function ExamTip({ children }) {
  return (
    <div style={{
      background: C.yellowSoft, border: `1px solid ${C.yellowLine}`, borderRadius: 10,
      padding: "11px 14px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12,
    }}>
      <span style={{
        fontWeight: 700, color: C.yellowInk, fontSize: 11.5, whiteSpace: "nowrap",
        marginTop: 2, letterSpacing: "0.4px",
      }}>
        ✎ 시험 포인트
      </span>
      <span style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.7 }}>{children}</span>
    </div>
  );
}

function Chip({ children, tone }) {
  const map = {
    aws: { bg: C.awsSoft, bd: C.awsLine, fg: C.awsDeep },
    cfn: { bg: C.cfnSoft, bd: C.cfnLine, fg: C.cfn },
    blue: { bg: C.blueSoft, bd: C.blueLine, fg: C.blue },
    green: { bg: C.greenSoft, bd: C.greenLine, fg: C.greenInk },
    plain: { bg: "#F1F5F8", bd: C.line, fg: C.sub },
  };
  const t = map[tone || "plain"];
  return (
    <span style={{
      display: "inline-block", padding: "3px 9px", borderRadius: 7,
      background: t.bg, border: `1px solid ${t.bd}`, color: t.fg,
      fontSize: 12, fontWeight: 600, fontFamily: MONO,
    }}>
      {children}
    </span>
  );
}

function Code({ children }) {
  return (
    <code style={{
      fontFamily: MONO, fontSize: "0.9em", background: "#F1F5F8",
      border: `1px solid ${C.line}`, borderRadius: 5, padding: "1px 6px", color: C.ink,
    }}>
      {children}
    </code>
  );
}

/* ───────────── 파이프라인 도식용 ───────────── */

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center justify-center self-center" style={{ gap: 5, padding: "2px 0" }}>
      <span style={{
        fontFamily: MONO, fontSize: 11, fontWeight: 600, color: C.awsDeep,
        background: "#fff", border: `1px solid ${C.awsLine}`,
        padding: "2px 9px", borderRadius: 999, whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <div className="hidden md:flex items-center">
        <div className="flowline" style={{ width: 54, height: 2 }} />
        <div style={{
          width: 0, height: 0, borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent", borderLeft: `7px solid ${C.aws}`,
        }} />
      </div>
      <div className="md:hidden flex flex-col items-center">
        <div className="flowline-v" style={{ width: 2, height: 22 }} />
        <div style={{
          width: 0, height: 0, borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent", borderTop: `7px solid ${C.aws}`,
        }} />
      </div>
    </div>
  );
}

function Node({ badge, badgeTone, title, sub, children }) {
  return (
    <div className="flex-1" style={{
      background: C.card, border: `1px solid ${C.line}`, borderRadius: 13,
      padding: 14, minWidth: 0,
    }}>
      <div className="flex items-center flex-wrap" style={{ gap: 8 }}>
        <Chip tone={badgeTone}>{badge}</Chip>
        <span style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>{title}</span>
      </div>
      {sub && <div style={{ fontSize: 12.5, color: C.sub, marginTop: 5, lineHeight: 1.6 }}>{sub}</div>}
      {children && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}

/* ───────────── 탭 1 · 개요 ───────────── */

function TabOverview() {
  return (
    <div>
      <Prompt cmd="cdk docs" note="CDK가 뭔지부터 — 강의 389" />

      <Section
        title="CDK란? — 코드가 CloudFormation이 된다"
        freq={2}
        desc="AWS Cloud Development Kit. 익숙한 프로그래밍 언어(TypeScript · JavaScript · Python · Java · .NET · Go)로 클라우드 인프라를 정의하면, CDK가 이를 CloudFormation 템플릿(JSON/YAML)으로 '합성(synthesize)'해서 배포합니다. 이 3단계 흐름이 CDK의 전부이자 시험의 출발점입니다."
      >
        <div className="flex flex-col md:flex-row md:items-stretch" style={{ gap: 8 }}>
          <Node badge="① 코드" badgeTone="green" title="CDK 앱"
            sub="TS · JS · Python · Java · .NET · Go — 타입 체크, 조건문·반복문, IDE 자동완성">
            <Term title="lib/my-stack.ts">{`const bucket = new s3.Bucket(
  this, 'MyBucket', {
    versioned: true,
});`}</Term>
          </Node>
          <Arrow label="cdk synth" />
          <Node badge="② 템플릿" badgeTone="cfn" title="CloudFormation 템플릿"
            sub="cdk.out/ 폴더에 JSON/YAML로 생성 — 사람이 직접 안 써도 됨">
            <Term title="cdk.out/MyStack.template.json">{`Resources:
  MyBucketF68F3FF0:
    Type: AWS::S3::Bucket
    Properties:
      VersioningConfiguration:
        Status: Enabled`}</Term>
          </Node>
          <Arrow label="cdk deploy" />
          <Node badge="③ 리소스" badgeTone="aws" title="실제 AWS 리소스"
            sub="CloudFormation이 스택을 생성 — S3, Lambda, VPC, ECS 등 모든 서비스">
            <div className="flex flex-wrap" style={{ gap: 6 }}>
              <Chip tone="aws">S3</Chip>
              <Chip tone="aws">Lambda</Chip>
              <Chip tone="aws">VPC</Chip>
              <Chip tone="aws">DynamoDB</Chip>
              <Chip tone="aws">ECS</Chip>
            </div>
          </Node>
        </div>

        <ExamTip>
          <b>인프라 코드와 애플리케이션 런타임 코드를 한 언어로 함께 배포</b>할 수 있다는 것이 CDK의 대표 장점 —
          특히 <b>Lambda 함수</b>나 <b>ECS/EKS의 Docker 컨테이너</b>와 함께 쓰기 좋다는 문장이 보기로 자주 등장합니다.
        </ExamTip>
      </Section>

      <Section
        title="CDK vs SAM — 시험 최다 빈출 비교"
        freq={3}
        desc="'어떤 IaC 도구를 선택해야 하는가' 시나리오 문제의 단골 소재입니다. 문제 속 키워드만 잡아내면 바로 정답이 나옵니다."
      >
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 10 }}>
          <Card tone="blue">
            <div className="flex items-center" style={{ gap: 8 }}>
              <Chip tone="blue">SAM</Chip>
              <b style={{ fontSize: 15, color: C.ink }}>Serverless Application Model</b>
            </div>
            <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13.5, color: C.ink, lineHeight: 1.85 }}>
              <li><b>서버리스 전용</b> — Lambda · API Gateway · DynamoDB 중심</li>
              <li><b>선언형</b> — JSON/YAML 템플릿 작성</li>
              <li>Lambda 프로젝트를 <b>빠르게 시작</b>하기 좋음</li>
            </ul>
            <div style={{ marginTop: 10, fontSize: 12.5, color: C.blue, fontWeight: 600 }}>
              시그널 키워드 → "서버리스 앱을 빠르게", "YAML 템플릿"
            </div>
          </Card>
          <Card tone="green">
            <div className="flex items-center" style={{ gap: 8 }}>
              <Chip tone="green">CDK</Chip>
              <b style={{ fontSize: 15, color: C.ink }}>Cloud Development Kit</b>
            </div>
            <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13.5, color: C.ink, lineHeight: 1.85 }}>
              <li><b>모든 AWS 서비스</b> 지원</li>
              <li><b>명령형</b> — 프로그래밍 언어로 작성 (TS · Python …)</li>
              <li>타입 안전성, 로직 재사용, 추상화(Construct)</li>
            </ul>
            <div style={{ marginTop: 10, fontSize: 12.5, color: C.greenInk, fontWeight: 600 }}>
              시그널 키워드 → "익숙한 프로그래밍 언어로 인프라 정의"
            </div>
          </Card>
        </div>

        <Card tone="cfn" style={{ marginTop: 10, textAlign: "center" }}>
          <span style={{ fontSize: 13.5, color: C.ink }}>
            <b style={{ color: C.cfn }}>공통점:</b> 둘 다 결국 <b>CloudFormation</b> 템플릿으로 변환되어 배포됩니다.
          </span>
        </Card>

        <Card style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>
            🔗 조합 문제: SAM CLI로 CDK 앱 로컬 테스트 <span style={{ marginLeft: 6 }}><Freq n={2} /></span>
          </div>
          <p style={{ margin: "8px 0 10px", fontSize: 13.5, color: C.sub, lineHeight: 1.7 }}>
            "CDK로 정의한 Lambda 함수를 <b>로컬에서 테스트</b>하려면?" → 먼저 <Code>cdk synth</Code>로 템플릿을 만들고,
            그 템플릿을 <b>SAM CLI</b>에 넘겨 실행합니다.
          </p>
          <Term title="terminal — CDK + SAM CLI">
            <span style={{ color: C.green }}>$ </span>cdk synth{"\n"}
            <span style={{ color: "#7E93A8" }}>  # cdk.out/ 에 CloudFormation 템플릿 생성</span>{"\n"}
            <span style={{ color: C.green }}>$ </span>sam local invoke MyFunction \{"\n"}
            {"    "}-t ./cdk.out/CdkStack.template.json
          </Term>
        </Card>
      </Section>
    </div>
  );
}

/* ───────────── 탭 2 · 구조(Constructs) ───────────── */

function LayerRow({ level, name, tone, points, code, tip }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.line}`, borderRadius: 13, padding: 14,
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0 }}>
        <Chip tone={tone}>{level}</Chip>
        <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 14 }}>
          {[5, 9, 13].map((h, i) => (
            <span key={i} style={{
              width: 4, height: h, borderRadius: 1.5,
              background: i < Number(level[1]) ? "#9AB0C4" : "#DDE5EC",
            }} />
          ))}
        </span>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>{name}</div>
        <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.7, marginTop: 4 }}>{points}</div>
        <div className="flex flex-wrap" style={{ gap: 6, marginTop: 8 }}>
          {code.map((c) => <Chip key={c} tone={tone}>{c}</Chip>)}
        </div>
        <div style={{ fontSize: 12.5, color: C.awsDeep, fontWeight: 600, marginTop: 8 }}>✎ {tip}</div>
      </div>
    </div>
  );
}

function TabConstructs() {
  const boxLabel = {
    fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.4px",
  };
  return (
    <div>
      <Prompt cmd="cdk list" note="앱의 구조 — 강의 391" />

      <Section
        title="App → Stack → Construct 계층"
        freq={2}
        desc="Construct는 'CloudFormation이 최종 리소스를 만드는 데 필요한 모든 것을 캡슐화한 기본 구성 요소'입니다. Construct들이 모여 Stack이 되고, Stack들이 모여 App이 됩니다."
      >
        <div style={{
          border: `2px dashed ${C.faint}`, borderRadius: 16, padding: 14, background: "#F7FAFC",
        }}>
          <div style={{ ...boxLabel, color: C.sub, marginBottom: 10 }}>APP · CDK 애플리케이션 (루트)</div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 10 }}>
            {[
              { name: "Stack A", constructs: ["S3 Bucket", "Lambda Function"] },
              { name: "Stack B", constructs: ["VPC", "ECS Service", "ALB"] },
            ].map((s) => (
              <div key={s.name} style={{
                border: `1.5px solid ${C.cfnLine}`, background: C.card,
                borderRadius: 12, padding: 12,
              }}>
                <div className="flex items-center justify-between flex-wrap" style={{ gap: 6 }}>
                  <span style={{ ...boxLabel, color: C.cfn }}>STACK · {s.name}</span>
                  <span style={{ fontSize: 11, color: C.faint }}>= CloudFormation 스택 1개</span>
                </div>
                <div className="flex flex-wrap" style={{ gap: 6, marginTop: 10 }}>
                  {s.constructs.map((c) => (
                    <span key={c} style={{
                      fontSize: 12, fontFamily: MONO, padding: "4px 9px", borderRadius: 8,
                      background: C.greenSoft, border: `1px solid ${C.greenLine}`, color: C.greenInk, fontWeight: 600,
                    }}>
                      ⬡ {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <ExamTip>
          CDK의 <b>Stack 하나 = CloudFormation 스택 하나</b>로 1:1 매핑됩니다.
          공식 라이브러리는 <b>AWS Construct Library</b>, 서드파티/커뮤니티 Construct는 <b>Construct Hub</b>에서 찾습니다.
        </ExamTip>
      </Section>

      <Section
        title="Construct 3단계 추상화 — L1 · L2 · L3"
        freq={2}
        desc="레벨이 올라갈수록 추상화가 높아집니다(더 적은 코드로 더 많은 리소스). 시험에서는 각 레벨의 '식별 단서'를 묻습니다."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <LayerRow
            level="L3" tone="aws"
            name="Patterns — 여러 리소스의 묶음"
            points="자주 쓰는 아키텍처 패턴 하나가 관련 리소스 여러 개를 한 번에 생성합니다. 예: API Gateway + Lambda, ALB + Fargate 서비스."
            code={["LambdaRestApi", "ApplicationLoadBalancedFargateService"]}
            tip="문제에 '패턴', '여러 리소스를 함께' 라는 표현이 보이면 L3"
          />
          <LayerRow
            level="L2" tone="green"
            name="Intent-based API — 합리적 기본값 + 편의 메서드"
            points="리소스를 '의도' 수준에서 다룹니다. 보일러플레이트 없이 기본값이 채워지고, 권한 부여 같은 편의 메서드를 제공합니다."
            code={["new s3.Bucket(...)", "bucket.grantRead(role)"]}
            tip="grantRead() 같은 헬퍼 메서드가 등장하면 L2"
          />
          <LayerRow
            level="L1" tone="cfn"
            name="CFN Resources — CloudFormation 리소스 1:1"
            points="CloudFormation 리소스와 그대로 대응하며, 이름이 Cfn 접두사로 시작합니다. 모든 속성을 직접 명시해야 합니다."
            code={["new s3.CfnBucket(...)", "CfnTable"]}
            tip="클래스 이름이 Cfn으로 시작하면 무조건 L1 — 가장 자주 나오는 식별 포인트"
          />
        </div>
      </Section>
    </div>
  );
}

/* ───────────── 탭 3 · 명령어 & 부트스트래핑 ───────────── */

function TabCommands() {
  const cmds = [
    { c: "cdk init app --language typescript", d: "새 CDK 프로젝트 생성", f: 1 },
    { c: "cdk bootstrap", d: "배포 전 계정·리전 준비 (CDKToolkit 스택 생성)", f: 3 },
    { c: "cdk synth", d: "코드를 CloudFormation 템플릿으로 합성 (cdk.out/)", f: 2 },
    { c: "cdk diff", d: "로컬 코드 vs 이미 배포된 스택의 차이 비교", f: 2 },
    { c: "cdk deploy", d: "템플릿을 CloudFormation으로 배포", f: 2 },
    { c: "cdk destroy", d: "스택 삭제", f: 1 },
  ];
  const flow = ["init", "bootstrap", "synth", "diff", "deploy", "destroy"];

  return (
    <div>
      <Prompt cmd="cdk bootstrap" note="명령어와 부트스트래핑 — 강의 392" />

      <Section
        title="배포 라이프사이클 & 명령어"
        freq={2}
        desc="각 명령이 어느 단계를 담당하는지 구분하는 문제가 나옵니다. 특히 bootstrap의 '위치'(배포보다 먼저, 계정·리전마다)가 핵심입니다."
      >
        <div className="flex flex-wrap items-center" style={{ gap: 6, marginBottom: 12 }}>
          {flow.map((f, i) => (
            <div key={f} className="flex items-center" style={{ gap: 6 }}>
              <span style={{
                fontFamily: MONO, fontSize: 12.5, fontWeight: 700,
                padding: "5px 11px", borderRadius: 999,
                background: f === "bootstrap" ? C.aws : C.card,
                color: f === "bootstrap" ? "#fff" : C.ink,
                border: `1.5px solid ${f === "bootstrap" ? C.aws : C.line}`,
              }}>
                {f}
              </span>
              {i < flow.length - 1 && <span style={{ color: C.faint, fontSize: 13 }}>›</span>}
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 13, overflow: "hidden" }}>
          {cmds.map((r, i) => (
            <div key={r.c} className="flex flex-col md:flex-row md:items-center"
              style={{
                gap: 6, padding: "11px 14px",
                borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
                background: r.f === 3 ? C.awsSoft : "transparent",
              }}>
              <code style={{
                fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: C.ink,
                minWidth: 0, flexBasis: "40%",
              }}>
                $ {r.c}
              </code>
              <span style={{ fontSize: 13, color: C.sub, flex: 1, lineHeight: 1.6 }}>{r.d}</span>
              <Freq n={r.f} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Bootstrapping — CDK 단원 최다 빈출"
        freq={3}
        desc="CDK 앱을 어떤 환경(= 계정 + 리전 조합)에 처음 배포하기 전, 그 환경에 CDK가 쓸 준비물을 만들어 두는 과정입니다."
      >
        <div className="flex flex-col md:flex-row" style={{ gap: 10 }}>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <Term title="terminal">
              <span style={{ color: C.green }}>$ </span>cdk bootstrap aws://<span style={{ color: "#F2C36D" }}>123456789012</span>/<span style={{ color: "#F2C36D" }}>ap-northeast-2</span>{"\n"}
              <span style={{ color: "#7E93A8" }}> ⏳ Bootstrapping environment...{"\n"} ✅ CDKToolkit 스택 생성 완료</span>
            </Term>
            <div style={{ fontSize: 12.5, color: C.sub, marginTop: 8, lineHeight: 1.7 }}>
              형식: <Code>aws://계정번호/리전</Code> — 환경(Environment)을 명시합니다.
            </div>
          </div>
          <Arrow label="생성" />
          <div className="flex-1" style={{
            border: `1.5px solid ${C.cfnLine}`, borderRadius: 13, padding: 13,
            background: C.card, minWidth: 0,
          }}>
            <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: C.cfn }}>
              CLOUDFORMATION STACK · "CDKToolkit"
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10 }}>
              {[
                ["S3 버킷", "배포 파일·에셋 스테이징 저장소"],
                ["IAM 역할", "CDK가 배포에 사용할 권한"],
              ].map(([t, d]) => (
                <div key={t} style={{
                  display: "flex", gap: 8, alignItems: "baseline",
                  background: "#F7FAFC", border: `1px solid ${C.line}`,
                  borderRadius: 9, padding: "8px 11px",
                }}>
                  <b style={{ fontSize: 13, color: C.ink, whiteSpace: "nowrap" }}>{t}</b>
                  <span style={{ fontSize: 12.5, color: C.sub }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 10 }}>
            "환경(계정 × 리전) 조합마다" 각각 1회 필요
          </div>
          <div className="grid" style={{ gridTemplateColumns: "auto 1fr 1fr", gap: 6, fontSize: 12.5 }}>
            <span />
            <span style={{ fontFamily: MONO, color: C.sub, textAlign: "center" }}>us-east-1</span>
            <span style={{ fontFamily: MONO, color: C.sub, textAlign: "center" }}>ap-northeast-2</span>
            {["계정 A", "계정 B"].map((acct, r) => (
              [
                <span key={acct} style={{ fontFamily: MONO, color: C.sub, alignSelf: "center" }}>{acct}</span>,
                ...[0, 1].map((col) => {
                  const done = r === 0 && col === 0;
                  return (
                    <span key={acct + col} style={{
                      textAlign: "center", padding: "7px 4px", borderRadius: 8, fontWeight: 700,
                      background: done ? C.greenSoft : C.awsSoft,
                      border: `1px solid ${done ? C.greenLine : C.awsLine}`,
                      color: done ? C.greenInk : C.awsDeep,
                    }}>
                      {done ? "✓ 완료" : "bootstrap 필요"}
                    </span>
                  );
                }),
              ]
            ))}
          </div>
        </Card>

        <div style={{
          marginTop: 12, borderRadius: 12, border: `1.5px solid #E8A9A9`,
          background: "#FDF0F0", padding: "12px 14px",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: "#A33A3A" }}>⚠ 부트스트랩 없이 deploy 하면?</div>
          <div style={{ fontFamily: MONO, fontSize: 12.5, color: "#7C2D2D", marginTop: 6, lineHeight: 1.7 }}>
            Error: "Policy contains a statement with one or more invalid principals"
          </div>
          <div style={{ fontSize: 13, color: C.ink, marginTop: 6, lineHeight: 1.7 }}>
            이 에러 문구가 <b>보기 그대로</b> 출제됩니다. 이 문구 = <b>cdk bootstrap 누락</b>이라고 바로 연결하세요.
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ───────────── 탭 4 · 유닛 테스트 ───────────── */

function TabTesting() {
  return (
    <div>
      <Prompt cmd="npm test" note="CDK 유닛 테스트 — 강의 393" />

      <Section
        title="CDK Assertions Module"
        freq={1}
        desc="CDK가 만들어낼 CloudFormation 템플릿이 의도대로인지 검증합니다. JavaScript/TypeScript는 Jest, Python은 Pytest와 함께 사용합니다."
      >
        <div className="flex flex-col md:flex-row md:items-stretch" style={{ gap: 8 }}>
          <div className="flex-1 flex flex-col" style={{ gap: 8, minWidth: 0 }}>
            <Node badge="소스 ①" badgeTone="green" title="CDK로 만든 스택"
              sub="내 CDK 앱 안의 Stack 객체에서 바로 추출">
              <Chip tone="green">Template.fromStack(stack)</Chip>
            </Node>
            <Node badge="소스 ②" badgeTone="blue" title="CDK 밖에서 만든 템플릿"
              sub="이미 존재하는 CloudFormation 템플릿 문자열을 읽어옴">
              <Chip tone="blue">Template.fromString(str)</Chip>
            </Node>
          </div>
          <Arrow label="검증 대상" />
          <div className="flex-1" style={{ minWidth: 0 }}>
            <Node badge="Template" badgeTone="cfn" title="템플릿 객체"
              sub="이 객체에 대고 두 가지 방식으로 assertion을 겁니다.">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ background: C.greenSoft, border: `1px solid ${C.greenLine}`, borderRadius: 9, padding: "9px 11px" }}>
                  <b style={{ fontSize: 13, color: C.greenInk }}>Fine-grained assertions (일반적)</b>
                  <div style={{ fontSize: 12.5, color: C.ink, marginTop: 3, lineHeight: 1.65 }}>
                    특정 리소스·속성·개수만 콕 집어 검증
                  </div>
                </div>
                <div style={{ background: C.blueSoft, border: `1px solid ${C.blueLine}`, borderRadius: 9, padding: "9px 11px" }}>
                  <b style={{ fontSize: 13, color: C.blue }}>Snapshot tests</b>
                  <div style={{ fontSize: 12.5, color: C.ink, marginTop: 3, lineHeight: 1.65 }}>
                    저장해 둔 기준(baseline) 템플릿과 통째로 비교
                  </div>
                </div>
              </div>
            </Node>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <Term title="my-stack.test.ts — Jest + assertions">
            {`${"imp" + "ort"} { Template } from 'aws-cdk-lib/assertions';

const template = Template.fromStack(myStack);

`}<span style={{ color: C.green }}>{`// 특정 속성을 가진 리소스가 존재하는가`}</span>{`
template.hasResourceProperties('AWS::SNS::Topic', {
  DisplayName: 'MyCoolTopic',
});

`}<span style={{ color: C.green }}>{`// 리소스 개수가 정확한가`}</span>{`
template.resourceCountIs('AWS::SNS::Topic', 1);`}
          </Term>
        </div>

        <ExamTip>
          "템플릿에 <b>특정 속성을 가진 리소스가 있는지</b> 확인" → <Code>hasResourceProperties()</Code> (fine-grained) ·
          "이전 배포본과 <b>전체가 달라졌는지</b> 비교" → snapshot test.
          그리고 <b>fromStack = CDK 내부 / fromString = CDK 외부 템플릿</b> 구분도 기억하세요.
        </ExamTip>
      </Section>
    </div>
  );
}

/* ───────────── 탭 5 · 빈출 정리 ───────────── */

function TabExam() {
  const rank = [
    { t: "CDK vs SAM 선택 시나리오", d: "'프로그래밍 언어로' → CDK · '서버리스 빠르게(YAML)' → SAM", f: 3 },
    { t: "cdk bootstrap의 목적 · 시점 · 에러", d: "계정×리전마다 1회 · CDKToolkit 스택 · invalid principals 에러", f: 3 },
    { t: "CDK 기본 개념 (코드 → synth → CloudFormation)", d: "인프라 + 런타임 코드 함께 배포 (Lambda·ECS에 유리)", f: 2 },
    { t: "명령어 역할 구분", d: "synth=템플릿 생성 · diff=차이 비교 · deploy=배포", f: 2 },
    { t: "Construct 레벨 L1/L2/L3 식별", d: "Cfn 접두사=L1 · 편의 메서드=L2 · 패턴=L3", f: 2 },
    { t: "SAM CLI로 CDK 앱 로컬 테스트", d: "cdk synth → sam local invoke -t 템플릿", f: 2 },
    { t: "유닛 테스트 (Assertions Module)", d: "fine-grained vs snapshot · fromStack vs fromString", f: 1 },
  ];
  const map = [
    ["익숙한 프로그래밍 언어(TS·Python)로 인프라 정의", "CDK"],
    ["서버리스 앱을 YAML로 빠르게 정의·배포", "SAM"],
    ["새 계정/리전에 CDK를 처음 배포하기 전에 할 일", "cdk bootstrap aws://계정/리전"],
    ["'invalid principals' 에러가 발생했다", "bootstrap 누락 → cdk bootstrap 실행"],
    ["배포 없이 CloudFormation 템플릿만 확인", "cdk synth"],
    ["배포된 스택과 로컬 코드의 차이 확인", "cdk diff"],
    ["CDK의 Lambda를 로컬에서 실행·테스트", "cdk synth 후 SAM CLI (sam local invoke)"],
    ["클래스 이름이 Cfn으로 시작한다", "L1 Construct (모든 속성 직접 설정)"],
    ["템플릿에 특정 속성의 리소스가 있는지 테스트", "assertions · hasResourceProperties()"],
  ];
  return (
    <div>
      <Prompt cmd="cdk exam --dry-run" note="출제 경향 요약 + 최종 암기" />

      <Section
        title="출제 비중 한눈에"
        desc="DVA-C02 전체 65문항(채점 50) 중 CDK 관련은 보통 1~3문항 수준으로, Domain 3 '배포'(24%) 영역에 속합니다. 문항 수는 적지만 아래 포인트가 반복 출제됩니다."
      >
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 13, overflow: "hidden" }}>
          {rank.map((r, i) => (
            <div key={r.t} className="flex flex-col md:flex-row md:items-center"
              style={{ gap: 6, padding: "12px 14px", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
              <span style={{
                fontFamily: MONO, fontSize: 12, color: C.faint, fontWeight: 700,
                width: 26, flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{r.t}</div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2, lineHeight: 1.6 }}>{r.d}</div>
              </div>
              <Freq n={r.f} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: C.faint, marginTop: 8, lineHeight: 1.6 }}>
          ※ 출제 빈도는 AWS 공식 통계가 아니라, 연습 문제·모의고사·응시 후기 경향을 바탕으로 한 추정치입니다.
        </p>
      </Section>

      <Section
        title="시나리오 신호 → 정답 즉답표"
        desc="문제 지문에서 이 문구가 보이면, 고민 없이 바로 이 방향으로 답을 고르세요."
      >
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 13, overflow: "hidden" }}>
          <div className="hidden md:flex" style={{
            padding: "9px 14px", background: "#F4F7FA", borderBottom: `1px solid ${C.line}`,
            fontSize: 11.5, fontWeight: 700, color: C.sub, letterSpacing: "0.4px",
          }}>
            <span style={{ flex: 1 }}>문제 속 신호</span>
            <span style={{ flex: 1 }}>정답 방향</span>
          </div>
          {map.map(([q, a], i) => (
            <div key={q} className="flex flex-col md:flex-row"
              style={{ gap: 4, padding: "10px 14px", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
              <span style={{ flex: 1, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>“{q}”</span>
              <span style={{ flex: 1, fontSize: 13, color: C.ink, fontWeight: 700, lineHeight: 1.6 }}>
                → {a}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="마지막 4줄 암기">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 8 }}>
          {[
            "CDK는 코드 → synth → CloudFormation → 배포",
            "새 계정·리전엔 무조건 bootstrap 먼저 (CDKToolkit)",
            "Cfn 접두사 = L1 / 편의 메서드 = L2 / 패턴 = L3",
            "CDK Lambda 로컬 테스트 = synth 후 SAM CLI",
          ].map((s) => (
            <div key={s} style={{
              background: C.navy, color: "#E7F0F8", borderRadius: 11,
              padding: "12px 14px", fontSize: 13.5, fontWeight: 600,
              fontFamily: FONT, lineHeight: 1.6,
              borderLeft: `4px solid ${C.aws}`,
            }}>
              {s}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ───────────── 루트 ───────────── */

const TABS = [
  { id: "overview", label: "개요", comp: TabOverview },
  { id: "constructs", label: "구조 · Constructs", comp: TabConstructs },
  { id: "commands", label: "명령어 · Bootstrap", comp: TabCommands },
  { id: "testing", label: "유닛 테스트", comp: TabTesting },
  { id: "exam", label: "빈출 정리", comp: TabExam },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const Active = TABS.find((t) => t.id === tab).comp;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: FONT, color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        button:focus-visible { outline: 2px solid ${C.aws}; outline-offset: 2px; }
        .flowline { background-image: repeating-linear-gradient(90deg, ${C.aws} 0 6px, transparent 6px 12px); }
        .flowline-v { background-image: repeating-linear-gradient(180deg, ${C.aws} 0 6px, transparent 6px 12px); }
        @media (prefers-reduced-motion: no-preference) {
          .flowline { animation: flow 1.1s linear infinite; }
          .flowline-v { animation: flowv 1.1s linear infinite; }
        }
        @keyframes flow { to { background-position: 12px 0; } }
        @keyframes flowv { to { background-position: 0 12px; } }
      `}</style>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "26px 16px 60px" }}>
        {/* 헤더 */}
        <header className="flex items-start" style={{ gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13, background: C.navy, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${C.navyLine}`, boxShadow: "0 3px 12px rgba(15,27,43,0.25)",
          }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, color: C.aws }}>cdk</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: "1px",
              color: C.awsDeep,
            }}>
              AWS CERTIFIED DEVELOPER – ASSOCIATE · DVA-C02
            </div>
            <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 700, letterSpacing: "-0.6px", lineHeight: 1.25 }}>
              AWS CDK 시험 핵심 정리
            </h1>
            <div className="flex flex-wrap items-center" style={{ gap: 8, marginTop: 8 }}>
              <Chip tone="cfn">Domain 3 · 배포 (24%)</Chip>
              <Chip tone="aws">예상 출제 1~3문항</Chip>
              <Chip tone="plain">강의 389 · 391 · 392 · 393 범위</Chip>
            </div>
          </div>
        </header>

        {/* 탭 */}
        <nav className="flex overflow-x-auto" style={{ gap: 8, marginTop: 22, paddingBottom: 4 }}>
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                fontFamily: FONT, fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap",
                padding: "9px 15px", borderRadius: 999, cursor: "pointer",
                background: on ? C.navy : C.card,
                color: on ? "#fff" : C.sub,
                border: `1.5px solid ${on ? C.navy : C.line}`,
                display: "flex", alignItems: "center", gap: 7,
                transition: "background 0.15s, color 0.15s",
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: 999,
                  background: on ? C.aws : "#C9D4DE",
                }} />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* 본문 */}
        <main style={{ marginTop: 20 }}>
          <Active />
        </main>

        <footer style={{
          marginTop: 44, paddingTop: 16, borderTop: `1px solid ${C.line}`,
          fontSize: 12, color: C.faint, lineHeight: 1.7,
        }}>
          강의 목차 기준 389(개요) · 391(구조) · 392(명령·부트스트래핑) · 393(유닛 테스트)의 이론 내용을 모두 담았습니다 — 390(실습)은 요청대로 제외.
          출제 빈도 표기는 연습 문제·응시 후기 기반 추정치이며, AWS 공식 문항 통계는 공개되지 않습니다.
        </footer>
      </div>
    </div>
  );
}
