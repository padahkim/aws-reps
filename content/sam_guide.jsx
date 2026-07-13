//opus 4.8 max
import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  Server,
  Cloud,
  Zap,
  Database,
  Shield,
  GitBranch,
  Rocket,
  Terminal,
  FlaskConical,
  Globe,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Play,
  RotateCcw,
  ChevronRight,
  Package,
  FileCode,
  Network,
  Split,
  Boxes,
  Container,
  BookOpen,
  Target,
  ListChecks,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Palette — Infrastructure-as-Code / cloud console feel             */
/*  (inline styles used for color because the artifact has no JIT)    */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#E7EAEC",
  surface: "#FFFFFF",
  surfaceAlt: "#F4F6F7",
  ink: "#14262F",
  inkSoft: "#2C4652",
  muted: "#5E6E77",
  faint: "#8695_9C".replace("_", ""), // #86959C
  line: "#D6DBDE",
  amber: "#DD6D0C",
  amberSoft: "#FBEAD7",
  teal: "#0C7A84",
  tealSoft: "#DBEFF1",
  green: "#1C9A61",
  greenSoft: "#D9F0E4",
  red: "#CC4229",
  redSoft: "#FAE1DB",
  violet: "#5F52C9",
  violetSoft: "#E7E4F7",
};
const MONO =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
const SANS =
  '"Segoe UI", "Pretendard", "Apple SD Gothic Neo", system-ui, sans-serif';

const TONES = {
  ink: { fg: C.ink, bg: C.surfaceAlt, br: C.line },
  amber: { fg: C.amber, bg: C.amberSoft, br: "#F0C79E" },
  teal: { fg: C.teal, bg: C.tealSoft, br: "#A9DBDF" },
  green: { fg: C.green, bg: C.greenSoft, br: "#A6DCC1" },
  red: { fg: C.red, bg: C.redSoft, br: "#EFB6A8" },
  violet: { fg: C.violet, bg: C.violetSoft, br: "#C4BCEC" },
};

/* ------------------------------------------------------------------ */
/*  Navigation model                                                  */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: "intro", n: "378", label: "섹션 개요 · 학습 지도" },
  { id: "docker", n: "★", label: "도커 기초 (선수 개념)" },
  { id: "serverless", n: "★", label: "서버리스 & Lambda 복습" },
  { id: "overview", n: "379", label: "SAM 개요" },
  { id: "cli", n: "380", label: "SAM CLI" },
  { id: "deploy", n: "381·382", label: "프로젝트 구조 & 배포 흐름" },
  { id: "apigw", n: "383", label: "SAM + API Gateway" },
  { id: "dynamo", n: "384", label: "SAM + DynamoDB" },
  { id: "policy", n: "385", label: "정책 템플릿" },
  { id: "codedeploy", n: "386", label: "SAM + CodeDeploy" },
  { id: "local", n: "387", label: "SAM Local (로컬 기능)" },
  { id: "multienv", n: "388", label: "다중 환경" },
  { id: "cheat", n: "퀴즈", label: "시험 요약 · 치트시트" },
];

/* ------------------------------------------------------------------ */
/*  Small primitives                                                  */
/* ------------------------------------------------------------------ */
function ExamBadge({ level = 2, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ display: "inline-flex", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              background: i < level ? C.amber : "#CBD2D6",
              transform: "rotate(45deg)",
            }}
          />
        ))}
      </span>
      {label && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11.5,
            color: C.muted,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
}

function Callout({ variant = "exam", title, children }) {
  const map = {
    exam: { c: C.amber, bg: C.amberSoft, Icon: Target, def: "시험 포인트" },
    tip: { c: C.teal, bg: C.tealSoft, Icon: Lightbulb, def: "이해 팁" },
    warn: {
      c: C.red,
      bg: C.redSoft,
      Icon: AlertTriangle,
      def: "자주 하는 실수",
    },
    note: { c: C.violet, bg: C.violetSoft, Icon: Info, def: "참고" },
  };
  const m = map[variant] || map.note;
  const Icon = m.Icon;
  return (
    <div
      style={{
        background: m.bg,
        borderRadius: 12,
        padding: "13px 15px",
        borderLeft: `3px solid ${m.c}`,
        display: "flex",
        gap: 11,
      }}
    >
      <Icon size={18} color={m.c} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11.5,
            fontWeight: 700,
            color: m.c,
            letterSpacing: 0.4,
            marginBottom: 3,
            textTransform: "uppercase",
          }}
        >
          {title || m.def}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.62, color: C.inkSoft }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }) {
  return (
    <code
      style={{
        fontFamily: MONO,
        fontSize: 12.5,
        background: "#EEF1F2",
        color: C.inkSoft,
        padding: "1px 6px",
        borderRadius: 5,
        border: `1px solid ${C.line}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </code>
  );
}

function CodeBlock({ code, caption }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid #223541`,
        background: "#16242E",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 13px",
          borderBottom: "1px solid #24404E",
          background: "#1B303B",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 99,
            background: "#E56B54",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 99,
            background: "#E5B04A",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 99,
            background: "#5CB588",
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: "#7E95A0",
            marginLeft: 6,
          }}
        >
          {caption || "template.yaml"}
        </span>
      </div>
      <pre style={{ margin: 0, padding: "13px 15px", overflowX: "auto" }}>
        <code style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.72 }}>
          {lines.map((ln, i) => {
            const t = ln.trim();
            let col = "#D7E2E8";
            if (t.startsWith("#")) col = "#61798A";
            else if (t.includes("Transform") || t.includes("AWS::Serverless"))
              col = "#E8A54A";
            else if (/^-?\s*[A-Za-z0-9_]+:/.test(t)) {
              // key: value line
              return (
                <div key={i} style={{ color: "#D7E2E8", whiteSpace: "pre" }}>
                  <span style={{ color: "#7FC6B2" }}>
                    {ln.match(/^\s*-?\s*[A-Za-z0-9_.!]+/)?.[0]}
                  </span>
                  <span>
                    {ln.slice(
                      (ln.match(/^\s*-?\s*[A-Za-z0-9_.!]+/)?.[0] || "").length,
                    )}
                  </span>
                </div>
              );
            }
            return (
              <div key={i} style={{ color: col, whiteSpace: "pre" }}>
                {ln || " "}
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function Node({ icon: Icon, title, sub, tone = "ink", w }) {
  const t = TONES[tone];
  return (
    <div
      style={{
        background: t.bg,
        border: `1.5px solid ${t.br}`,
        borderRadius: 12,
        padding: "11px 13px",
        minWidth: w || 118,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
      }}
    >
      {Icon && <Icon size={20} color={t.fg} />}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 12.5,
          fontWeight: 700,
          color: t.fg,
        }}
      >
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.35 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Arrow({ dir = "right", label }) {
  const Icon = dir === "down" ? ArrowDown : ArrowRight;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: dir === "down" ? "2px 0" : "0 2px",
      }}
    >
      <Icon size={18} color={C.faint} />
      {label && (
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
          {label}
        </span>
      )}
    </div>
  );
}

function DiagramFrame({ title, children }) {
  return (
    <div
      style={{
        background: C.surfaceAlt,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        padding: "16px 16px 18px",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: C.muted,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 14, height: 1.5, background: C.faint }} />{" "}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function Section({ id, num, title, level, freq, children }) {
  return (
    <section id={id} data-nav style={{ scrollMarginTop: 78, marginBottom: 46 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 700,
            color: C.amber,
            background: C.amberSoft,
            padding: "3px 9px",
            borderRadius: 7,
          }}
        >
          {num}
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: 23,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </h2>
      </div>
      {typeof level === "number" && (
        <div style={{ marginBottom: 16 }}>
          <ExamBadge level={level} label={freq} />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return (
    <p
      style={{ margin: 0, fontSize: 14.5, lineHeight: 1.72, color: C.inkSoft }}
    >
      {children}
    </p>
  );
}
function H3({ children }) {
  return (
    <h3
      style={{
        margin: "6px 0 -2px",
        fontSize: 15.5,
        fontWeight: 800,
        color: C.ink,
      }}
    >
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/*  INTERACTIVE 1 — SAM Transform expander (signature)                */
/* ------------------------------------------------------------------ */
function SamTransform() {
  const [open, setOpen] = useState(false);
  const resources = [
    { i: Zap, t: "AWS::Lambda::Function", tone: "amber" },
    { i: Shield, t: "AWS::IAM::Role", tone: "teal" },
    { i: Globe, t: "AWS::ApiGateway::RestApi", tone: "violet" },
    { i: Network, t: "ApiGateway::Deployment", tone: "violet" },
    { i: Layers, t: "ApiGateway::Stage", tone: "violet" },
    { i: FileCode, t: "ApiGateway::Method", tone: "violet" },
    { i: CheckCircle2, t: "Lambda::Permission", tone: "green" },
    { i: BookOpen, t: "Logs::LogGroup", tone: "ink" },
  ];
  return (
    <DiagramFrame title="시그니처 · SAM Transform: 짧은 템플릿 → 다수의 CloudFormation 리소스">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1.05fr)",
          gap: 12,
          alignItems: "center",
        }}
      >
        {/* SAM side */}
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: C.amber,
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            SAM 템플릿 · 약 12줄
          </div>
          <CodeBlock
            caption="template.yaml (SAM)"
            code={`Transform: AWS::Serverless-2016-10-31
Resources:
  HelloFn:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.handler
      Runtime: nodejs22.x
      Events:
        Api:
          Type: Api
          Properties:
            Path: /hello
            Method: get`}
          />
        </div>

        {/* transform button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: 99,
              padding: "10px 14px",
              background: open ? C.ink : C.amber,
              color: "#fff",
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 3px 10px rgba(221,109,12,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {open ? <RotateCcw size={14} /> : <Split size={14} />}
            {open ? "접기" : "Transform ▶"}
          </button>
          <ArrowRight size={20} color={C.faint} />
        </div>

        {/* CloudFormation side */}
        <div
          style={{
            minHeight: 210,
            background: "#16242E",
            borderRadius: 12,
            padding: 12,
            border: "1px solid #223541",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: "#E8A54A",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Cloud size={13} color="#E8A54A" /> CloudFormation 스택 (실제 생성
            리소스)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {resources.map((r, i) => {
              const RI = r.i;
              const tn = TONES[r.tone];
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "7px 9px",
                    background: "#1E3742",
                    borderRadius: 8,
                    border: "1px solid #2A4A57",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(14px)",
                    transition: `all 360ms cubic-bezier(.2,.8,.2,1) ${i * 55}ms`,
                  }}
                >
                  <RI size={15} color={tn.fg} />
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 11.5,
                      color: "#CFDDE4",
                    }}
                  >
                    {r.t}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 12.5,
          color: C.muted,
          fontFamily: MONO,
          textAlign: "center",
        }}
      >
        함수 하나 = CloudFormation 리소스 8개 · 순수 CloudFormation이면 60줄
        이상 → SAM은 코드 70~80% 감소
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  INTERACTIVE 2 — CodeDeploy traffic shifting simulator             */
/* ------------------------------------------------------------------ */
function TrafficShift() {
  const [mode, setMode] = useState("canary");
  const [errMode, setErrMode] = useState(false);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("idle");
  const timerRef = useRef(null);
  const machineRef = useRef({ t: 0 });
  const modeRef = useRef(mode);
  const errRef = useRef(errMode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    errRef.current = errMode;
  }, [errMode]);

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  useEffect(() => () => stop(), []);

  const start = () => {
    stop();
    setPct(0);
    setPhase("pre");
    machineRef.current = { t: 0, rolled: false, post: 0, cur: 0 };
    timerRef.current = setInterval(() => {
      const m = machineRef.current;
      m.t += 1;
      const t = m.t;
      const mo = modeRef.current;
      const er = errRef.current;

      if (t <= 3) {
        setPhase("pre");
        setPct(0);
        return;
      }
      const st = t - 3;

      let p;
      if (mo === "allatonce") p = 100;
      else if (mo === "canary") {
        if (st <= 2) p = 10;
        else if (st <= 8) p = 10;
        else p = Math.min(100, 10 + (st - 8) * 18);
      } else {
        p = Math.min(100, st * 8);
      }

      if (er && !m.rolled && p >= 50) m.rolled = true;

      if (m.rolled) {
        setPhase("rollback");
        setPct((prev) => {
          const np = Math.max(0, prev - 22);
          if (np === 0) {
            setPhase("rolledback");
            stop();
          }
          return np;
        });
        return;
      }

      if (p >= 100) {
        setPct(100);
        m.post += 1;
        setPhase(m.post >= 3 ? "done" : "post");
        if (m.post >= 3) stop();
      } else {
        setPct(p);
        setPhase("shift");
      }
    }, 170);
  };

  const modes = [
    { k: "canary", label: "Canary", desc: "10% → (대기) → 100%" },
    { k: "linear", label: "Linear", desc: "N분마다 +10% 균등" },
    { k: "allatonce", label: "AllAtOnce", desc: "한 번에 100%" },
  ];
  const steps = [
    { k: "pre", label: "BeforeAllowTraffic 훅", note: "사전 검증 Lambda" },
    { k: "shift", label: "트래픽 전환", note: "CodeDeploy 수행" },
    { k: "post", label: "AfterAllowTraffic 훅", note: "사후 검증 Lambda" },
    { k: "done", label: "배포 완료", note: "신버전 100%" },
  ];
  const isRollback = phase === "rollback" || phase === "rolledback";
  const activeIdx = {
    pre: 0,
    shift: 1,
    post: 2,
    done: 3,
    rollback: 1,
    rolledback: 1,
    idle: -1,
  }[phase];

  return (
    <DiagramFrame title="인터랙티브 · CodeDeploy 트래픽 전환 시뮬레이터">
      {/* controls */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}
      >
        {modes.map((mm) => (
          <button
            key={mm.k}
            onClick={() => setMode(mm.k)}
            style={{
              cursor: "pointer",
              borderRadius: 9,
              padding: "8px 12px",
              textAlign: "left",
              border: `1.5px solid ${mode === mm.k ? C.amber : C.line}`,
              background: mode === mm.k ? C.amberSoft : C.surface,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12.5,
                fontWeight: 700,
                color: mode === mm.k ? C.amber : C.inkSoft,
              }}
            >
              {mm.label}
            </div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>
              {mm.desc}
            </div>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontSize: 12.5,
            color: C.inkSoft,
            fontFamily: MONO,
          }}
        >
          <input
            type="checkbox"
            checked={errMode}
            onChange={(e) => setErrMode(e.target.checked)}
          />
          CloudWatch 알람 발생(오류)
        </label>
        <button
          onClick={start}
          style={{
            cursor: "pointer",
            border: "none",
            borderRadius: 9,
            padding: "8px 14px",
            background: C.ink,
            color: "#fff",
            fontFamily: MONO,
            fontSize: 12.5,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Play size={13} /> 배포 시작
        </button>
      </div>

      {/* traffic bar */}
      <div
        style={{
          marginBottom: 6,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontSize: 12,
        }}
      >
        <span style={{ color: C.muted }}>v1 (이전) {100 - pct}%</span>
        <span style={{ color: isRollback ? C.red : C.green, fontWeight: 700 }}>
          v2 (신규) {pct}%
        </span>
      </div>
      <div
        style={{
          height: 26,
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          border: `1px solid ${C.line}`,
          background: C.surface,
        }}
      >
        <div
          style={{
            width: `${100 - pct}%`,
            background: "#B9C4CA",
            transition: "width 200ms linear",
          }}
        />
        <div
          style={{
            width: `${pct}%`,
            background: isRollback ? C.red : C.green,
            transition: "width 200ms linear",
          }}
        />
      </div>

      {/* phase steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginTop: 14,
        }}
      >
        {steps.map((s, i) => {
          const active = i === activeIdx && !isRollback;
          return (
            <div
              key={s.k}
              style={{
                borderRadius: 9,
                padding: "9px 8px",
                textAlign: "center",
                background: active ? C.tealSoft : C.surface,
                border: `1.5px solid ${active ? C.teal : C.line}`,
                opacity: activeIdx >= i || active ? 1 : 0.55,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 700,
                  color: active ? C.teal : C.inkSoft,
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                {s.note}
              </div>
            </div>
          );
        })}
      </div>

      {/* status line */}
      <div
        style={{
          marginTop: 12,
          padding: "9px 12px",
          borderRadius: 9,
          fontFamily: MONO,
          fontSize: 12.5,
          fontWeight: 700,
          background:
            phase === "done"
              ? C.greenSoft
              : isRollback
                ? C.redSoft
                : C.surfaceAlt,
          color: phase === "done" ? C.green : isRollback ? C.red : C.muted,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {phase === "done" && (
          <>
            <CheckCircle2 size={15} /> 배포 성공 — 신버전으로 100% 전환 완료
          </>
        )}
        {phase === "rolledback" && (
          <>
            <RotateCcw size={15} /> 자동 롤백 완료 — 알람 감지로 이전 버전(v1)
            유지
          </>
        )}
        {phase === "rollback" && (
          <>
            <AlertTriangle size={15} /> 알람 발생 — 롤백 진행 중…
          </>
        )}
        {phase === "idle" && (
          <>
            <Info size={15} /> 방식을 고르고 “배포 시작”을 눌러 트래픽 전환을
            확인해 보세요
          </>
        )}
        {(phase === "pre" || phase === "shift" || phase === "post") && (
          <>
            <Rocket size={15} /> 배포 진행 중… ({mode})
          </>
        )}
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                               */
/* ------------------------------------------------------------------ */
export default function App() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll("section[data-nav]"));
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 },
    );
    secs.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: SANS,
        color: C.ink,
      }}
    >
      {/* HERO */}
      <header
        style={{
          borderBottom: `1px solid ${C.line}`,
          background: "linear-gradient(180deg,#16242E,#1C333F)",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "34px 22px 30px",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 2,
              color: "#E8A54A",
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            AWS Certified Developer — Associate (DVA-C02)
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: -1,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            AWS SAM 완전 정복
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 15,
              color: "#AFC1CB",
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            도커 기초부터 SAM의 배포·CodeDeploy·로컬 테스트까지, 시험에 나오는
            개념만 다이어그램으로 정리했습니다.
            <span style={{ color: "#E8A54A" }}>
              {" "}
              실습(설치·프로젝트 생성 단계)은 제외
            </span>
            하고 개념·구조 중심으로 구성했습니다.
          </p>
          {/* priority legend */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 12, color: "#7E95A0" }}>
              빈출 우선순위:
            </span>
            {[
              { l: 3, t: "Transform·CloudFormation 관계 / CodeDeploy 전환" },
              { l: 2, t: "정책 템플릿 / 배포 흐름 / sam local" },
              { l: 1, t: "다중 환경 / 도커(배경 지식)" },
            ].map((x, i) => (
              <span
                key={i}
                style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
              >
                <span style={{ display: "inline-flex", gap: 3 }}>
                  {[0, 1, 2].map((j) => (
                    <span
                      key={j}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        transform: "rotate(45deg)",
                        background: j < x.l ? "#E8A54A" : "#3A5563",
                      }}
                    />
                  ))}
                </span>
                <span style={{ fontSize: 11.5, color: "#95A9B2" }}>{x.t}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* mobile chip nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(231,234,236,0.94)",
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid ${C.line}`,
          display: "block",
        }}
        className="chipnav"
      >
        <div
          style={{
            display: "flex",
            gap: 7,
            overflowX: "auto",
            padding: "9px 14px",
          }}
        >
          {NAV.map((it) => (
            <button
              key={it.id}
              onClick={() => go(it.id)}
              style={{
                flexShrink: 0,
                cursor: "pointer",
                borderRadius: 8,
                padding: "5px 11px",
                border: `1px solid ${active === it.id ? C.amber : C.line}`,
                background: active === it.id ? C.amberSoft : C.surface,
                fontFamily: MONO,
                fontSize: 11.5,
                fontWeight: 700,
                color: active === it.id ? C.amber : C.muted,
                whiteSpace: "nowrap",
              }}
            >
              {it.n}
            </button>
          ))}
        </div>
      </div>

      {/* LAYOUT */}
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "26px 22px 80px",
          display: "grid",
          gridTemplateColumns: "236px minmax(0,1fr)",
          gap: 34,
        }}
        className="layout"
      >
        {/* sidebar */}
        <aside
          className="sidebar"
          style={{
            position: "sticky",
            top: 60,
            alignSelf: "start",
            height: "fit-content",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 1,
              color: C.muted,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            목차
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((it) => {
              const on = active === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => go(it.id)}
                  style={{
                    cursor: "pointer",
                    textAlign: "left",
                    border: "none",
                    background: on ? C.surface : "transparent",
                    borderLeft: `2px solid ${on ? C.amber : "transparent"}`,
                    borderRadius: on ? "0 8px 8px 0" : 8,
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: on ? C.amber : C.faint,
                      minWidth: 40,
                    }}
                  >
                    {it.n}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: on ? C.ink : C.muted,
                      fontWeight: on ? 700 : 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {it.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* content */}
        <main style={{ minWidth: 0 }}>
          {/* 378 INTRO */}
          <Section id="intro" num="378" title="섹션 개요 · 학습 지도">
            <P>
              이 자료는{" "}
              <b>서버리스 애플리케이션을 인프라 코드(IaC)로 정의하고 배포</b>
              하는 도구인 AWS SAM을 다룹니다. SAM을 제대로 이해하려면 그 아래에
              깔린 개념 — <b>도커 → 서버리스/Lambda → CloudFormation</b> — 을
              먼저 알아야 하므로, 아래 순서로 쌓아 올립니다.
            </P>
            <DiagramFrame title="학습 지도 (아래에서 위로 쌓입니다)">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  {
                    i: Rocket,
                    t: "AWS SAM",
                    d: "서버리스 앱을 간결하게 정의·배포·테스트",
                    tone: "amber",
                  },
                  {
                    i: Cloud,
                    t: "CloudFormation",
                    d: "AWS 리소스를 코드로 프로비저닝 (SAM이 확장하는 기반)",
                    tone: "violet",
                  },
                  {
                    i: Zap,
                    t: "서버리스 / Lambda",
                    d: "서버 관리 없이 이벤트로 함수 실행",
                    tone: "teal",
                  },
                  {
                    i: Container,
                    t: "도커 / 컨테이너",
                    d: "패키징·격리 실행 — Lambda 패키징과 로컬 테스트의 바탕",
                    tone: "ink",
                  },
                ].map((x, i) => {
                  const XI = x.i;
                  const tn = TONES[x.tone];
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: tn.bg,
                        border: `1.5px solid ${tn.br}`,
                        borderRadius: 11,
                        padding: "11px 14px",
                      }}
                    >
                      <XI size={22} color={tn.fg} />
                      <div>
                        <div
                          style={{
                            fontFamily: MONO,
                            fontWeight: 700,
                            fontSize: 14,
                            color: tn.fg,
                          }}
                        >
                          {x.t}
                        </div>
                        <div style={{ fontSize: 12.5, color: C.muted }}>
                          {x.d}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DiagramFrame>
            <Callout variant="note" title="시험 내 위치">
              SAM은 시험의 <b>배포(Deployment) 영역</b>과{" "}
              <b>AWS 서비스로 개발</b> 영역에 걸쳐 출제됩니다. 배포 영역은
              시험의 약 1/4 비중이며, 그 안에서 서버리스 배포 도구로{" "}
              <Kbd>SAM</Kbd>과 <Kbd>CodeDeploy</Kbd>가 핵심입니다. 아래
              별점(◆◆◆)은 커뮤니티·시험 청사진 기준의 <b>상대적 빈출 지표</b>
              이며 정확한 문항 수는 시험 버전마다 다릅니다.
            </Callout>
          </Section>

          {/* DOCKER */}
          <Section
            id="docker"
            num="선수 개념"
            title="도커 기초"
            level={1}
            freq="◆◇◇ 배경 지식 (직접 출제는 낮으나 이해 필수)"
          >
            <P>
              “내 컴퓨터에선 잘 되는데 서버에선 안 돼요” —
              환경(OS·라이브러리·버전) 차이 때문에 생기는 고전적 문제입니다.{" "}
              <b>도커</b>는 애플리케이션과 그 실행에 필요한 모든
              것(코드·런타임·라이브러리·설정)을 하나의 <b>컨테이너</b>로 묶어,
              어디서나 동일하게 실행되게 만듭니다.
            </P>

            <H3>컨테이너 vs 가상머신(VM)</H3>
            <DiagramFrame title="같은 격리, 다른 무게">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
                className="two"
              >
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.line}`,
                    borderRadius: 11,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.muted,
                      marginBottom: 9,
                    }}
                  >
                    가상머신 (무겁다)
                  </div>
                  {["App A", "App B"].map((a) => (
                    <div key={a} style={{ marginBottom: 7 }}>
                      <div
                        style={{
                          background: C.amberSoft,
                          border: `1px solid #F0C79E`,
                          borderRadius: 6,
                          padding: "5px 8px",
                          fontFamily: MONO,
                          fontSize: 11.5,
                          color: C.amber,
                          textAlign: "center",
                        }}
                      >
                        {a}
                      </div>
                      <div
                        style={{
                          background: "#EDEFF0",
                          border: `1px solid ${C.line}`,
                          borderRadius: 6,
                          padding: "4px 8px",
                          fontFamily: MONO,
                          fontSize: 10.5,
                          color: C.muted,
                          textAlign: "center",
                          marginTop: 3,
                        }}
                      >
                        게스트 OS 전체
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      background: "#DFE4E7",
                      borderRadius: 6,
                      padding: "5px",
                      fontFamily: MONO,
                      fontSize: 10.5,
                      color: C.inkSoft,
                      textAlign: "center",
                    }}
                  >
                    하이퍼바이저 → 호스트 OS → 하드웨어
                  </div>
                </div>
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.line}`,
                    borderRadius: 11,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.teal,
                      marginBottom: 9,
                    }}
                  >
                    컨테이너 (가볍다)
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                    {["App A", "App B"].map((a) => (
                      <div
                        key={a}
                        style={{
                          flex: 1,
                          background: C.tealSoft,
                          border: `1px solid #A9DBDF`,
                          borderRadius: 6,
                          padding: "8px 6px",
                          fontFamily: MONO,
                          fontSize: 11.5,
                          color: C.teal,
                          textAlign: "center",
                        }}
                      >
                        {a}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      background: "#DFE4E7",
                      borderRadius: 6,
                      padding: "5px",
                      fontFamily: MONO,
                      fontSize: 10.5,
                      color: C.inkSoft,
                      textAlign: "center",
                      marginBottom: 3,
                    }}
                  >
                    도커 엔진 (커널 공유)
                  </div>
                  <div
                    style={{
                      background: "#DFE4E7",
                      borderRadius: 6,
                      padding: "5px",
                      fontFamily: MONO,
                      fontSize: 10.5,
                      color: C.inkSoft,
                      textAlign: "center",
                    }}
                  >
                    호스트 OS → 하드웨어
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12.5,
                  color: C.muted,
                  fontFamily: MONO,
                  textAlign: "center",
                }}
              >
                VM = OS를 통째로 복제(수 GB, 분 단위 부팅) · 컨테이너 = 커널
                공유(수십 MB, 초 단위 시작)
              </div>
            </DiagramFrame>

            <H3>이미지 vs 컨테이너</H3>
            <P>
              <b>이미지</b>는 실행에 필요한 모든 것을 담은 읽기 전용
              “설계도/스냅샷”이고, <b>컨테이너</b>는 그 이미지를 실제로 실행한
              “살아있는 인스턴스”입니다. (클래스 vs 객체와 같은 관계)
            </P>
            <DiagramFrame title="Dockerfile → 이미지 → 레지스트리 → 컨테이너">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                  justifyContent: "center",
                }}
              >
                <Node
                  icon={FileCode}
                  title="Dockerfile"
                  sub="빌드 명세"
                  tone="ink"
                />
                <Arrow label="build" />
                <Node
                  icon={Boxes}
                  title="이미지"
                  sub="읽기 전용 템플릿"
                  tone="teal"
                />
                <Arrow label="push" />
                <Node
                  icon={Cloud}
                  title="레지스트리"
                  sub="Docker Hub / ECR"
                  tone="violet"
                />
                <Arrow label="pull · run" />
                <Node
                  icon={Container}
                  title="컨테이너"
                  sub="실행 중 인스턴스"
                  tone="amber"
                />
              </div>
            </DiagramFrame>

            <Callout variant="exam" title="도커가 SAM·시험과 연결되는 지점">
              ① <b>Lambda 패키징</b>은 <Kbd>.zip 아카이브</Kbd> 또는{" "}
              <Kbd>컨테이너 이미지</Kbd>(최대 10GB) 두 방식이 있습니다. ②{" "}
              <b>SAM Local</b>(387번)은 로컬에서 실제 Lambda 런타임과 동일한
              환경을 <b>도커 컨테이너로 재현</b>합니다 — 그래서 로컬 테스트에는
              도커가 필요합니다. ③ ECR(레지스트리)에 이미지를 올려
              Lambda/ECS/Fargate가 사용합니다.
            </Callout>
          </Section>

          {/* SERVERLESS */}
          <Section
            id="serverless"
            num="복습"
            title="서버리스 & Lambda"
            level={1}
            freq="◆◇◇ SAM 이해를 위한 전제"
          >
            <P>
              <b>서버리스</b>는 서버를 직접 프로비저닝·스케일링·패치하지 않는
              모델입니다(AWS가 대신 관리). 사용한 만큼만 과금되고, 트래픽에 따라
              자동으로 확장됩니다. <b>Lambda</b>는 그 대표 서비스로, 이벤트가
              들어오면 함수를 실행하는 <b>FaaS(Function as a Service)</b>입니다.
            </P>
            <P>
              중요한 점: 실제 “서버리스 애플리케이션”은 Lambda 함수 하나가
              아니라 <b>여러 리소스의 묶음</b>입니다. 요청을 받는 API Gateway,
              데이터를 저장하는 DynamoDB, 이벤트를 전달하는 트리거, 접근을
              통제하는 IAM 권한까지 함께 움직입니다.
            </P>
            <DiagramFrame title="전형적인 서버리스 애플리케이션 구성">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                  justifyContent: "center",
                }}
              >
                <Node icon={Globe} title="클라이언트" tone="ink" w={104} />
                <Arrow label="HTTPS" />
                <Node
                  icon={Network}
                  title="API Gateway"
                  sub="요청 라우팅"
                  tone="violet"
                />
                <Arrow label="트리거" />
                <Node
                  icon={Zap}
                  title="Lambda"
                  sub="비즈니스 로직"
                  tone="amber"
                />
                <Arrow label="읽기/쓰기" />
                <Node
                  icon={Database}
                  title="DynamoDB"
                  sub="데이터 저장"
                  tone="teal"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: C.surface,
                    border: `1px dashed ${C.line}`,
                    borderRadius: 8,
                    padding: "5px 10px",
                  }}
                >
                  <Shield size={14} color={C.muted} />
                  <span
                    style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}
                  >
                    IAM 권한
                  </span>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: C.surface,
                    border: `1px dashed ${C.line}`,
                    borderRadius: 8,
                    padding: "5px 10px",
                  }}
                >
                  <BookOpen size={14} color={C.muted} />
                  <span
                    style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}
                  >
                    CloudWatch 로그
                  </span>
                </div>
              </div>
            </DiagramFrame>
            <Callout variant="tip">
              이 여러 리소스를 순수 CloudFormation으로 하나하나 정의하면 매우
              장황합니다(함수 1개당 리소스 5~8개).{" "}
              <b>이 장황함을 줄이려고 SAM이 등장</b>합니다 — 다음 섹션의
              핵심입니다.
            </Callout>
          </Section>

          {/* 379 OVERVIEW */}
          <Section
            id="overview"
            num="379"
            title="SAM 개요"
            level={3}
            freq="◆◆◆ 최상위 빈출 — 정체성/구조 반드시 암기"
          >
            <P>
              <b>AWS SAM(Serverless Application Model)</b>은 서버리스 앱을 위한
              오픈소스 프레임워크로, 두 부분으로 구성됩니다.
            </P>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
              className="two"
            >
              <div
                style={{
                  background: C.amberSoft,
                  border: `1.5px solid #F0C79E`,
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <FileCode size={18} color={C.amber} />
                  <span
                    style={{
                      fontFamily: MONO,
                      fontWeight: 700,
                      color: C.amber,
                    }}
                  >
                    ① SAM 템플릿
                  </span>
                </div>
                <div
                  style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}
                >
                  서버리스 리소스를 위한 <b>간결한 IaC 문법</b>.
                  CloudFormation을 축약한 형태.
                </div>
              </div>
              <div
                style={{
                  background: C.tealSoft,
                  border: `1.5px solid #A9DBDF`,
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <Terminal size={18} color={C.teal} />
                  <span
                    style={{ fontFamily: MONO, fontWeight: 700, color: C.teal }}
                  >
                    ② SAM CLI
                  </span>
                </div>
                <div
                  style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}
                >
                  프로젝트 생성·<b>빌드·로컬 테스트·배포</b>를 돕는 커맨드라인
                  도구.
                </div>
              </div>
            </div>

            <H3>핵심 원리 — CloudFormation의 “확장”</H3>
            <P>
              SAM 템플릿은 별도의 서비스가 아니라{" "}
              <b>CloudFormation의 확장(extension)</b>입니다. 배포 시 SAM 문법이
              CloudFormation 문법으로 <b>변환(Transform)</b>되어 실제 리소스가
              생성됩니다. 즉 SAM은 “서버리스 전용 축약 문법 + 개발 도구”이고,
              실행 엔진은 언제나 CloudFormation입니다.
            </P>

            <SamTransform />

            <H3>반드시 아는 문법 요소</H3>
            <CodeBlock
              caption="SAM 템플릿 필수 헤더"
              code={`AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31   # 이 한 줄이 'SAM 템플릿'임을 선언

Globals:                                # 모든 함수 공통 설정
  Function:
    Runtime: nodejs22.x
    Timeout: 10
    MemorySize: 256`}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
              className="two"
            >
              {[
                [
                  "AWS::Serverless::Function",
                  "Lambda + 이벤트 + IAM 역할",
                  "amber",
                ],
                ["AWS::Serverless::Api", "API Gateway (REST)", "violet"],
                [
                  "AWS::Serverless::HttpApi",
                  "저비용·저지연 HTTP API",
                  "violet",
                ],
                [
                  "AWS::Serverless::SimpleTable",
                  "간단한 DynamoDB 테이블",
                  "teal",
                ],
                ["AWS::Serverless::StateMachine", "Step Functions", "green"],
                ["AWS::Serverless::LayerVersion", "Lambda 레이어", "ink"],
              ].map(([a, b, tn], i) => (
                <div
                  key={i}
                  style={{
                    background: TONES[tn].bg,
                    border: `1px solid ${TONES[tn].br}`,
                    borderRadius: 9,
                    padding: "9px 11px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: TONES[tn].fg,
                    }}
                  >
                    {a}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                    {b}
                  </div>
                </div>
              ))}
            </div>

            <Callout variant="exam" title="이 섹션 필수 암기 3가지">
              <span style={{ display: "block", marginBottom: 4 }}>
                ① <b>SAM = CloudFormation의 확장(상위 집합)</b>. 순수
                CloudFormation 문법도 SAM 템플릿에 그대로 사용 가능하다.
              </span>
              <span style={{ display: "block", marginBottom: 4 }}>
                ② <Kbd>Transform: AWS::Serverless-2016-10-31</Kbd> 이 한 줄이
                있어야 SAM으로 인식된다(자주 출제).
              </span>
              <span style={{ display: "block" }}>
                ③ SAM은 결국 <b>CloudFormation 스택으로 배포·관리·롤백</b>된다.
              </span>
            </Callout>
          </Section>

          {/* 380 CLI */}
          <Section
            id="cli"
            num="380"
            title="SAM CLI"
            level={2}
            freq="◆◆◇ 명령의 역할 구분이 포인트 (설치 실습은 제외)"
          >
            <P>
              SAM CLI는 서버리스 앱을{" "}
              <b>만들고 · 빌드하고 · 로컬에서 테스트하고 · 배포</b>하는
              커맨드라인 도구입니다. 아래는 시험에서 “각 명령이 무엇을 하는가”를
              구분하기 위한 <b>명령 지도</b>입니다.
            </P>
            <DiagramFrame title="개발 라이프사이클과 SAM 명령">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  {
                    cmd: "sam init",
                    d: "새 프로젝트 생성 (템플릿 선택)",
                    i: FileCode,
                    tone: "ink",
                  },
                  {
                    cmd: "sam validate",
                    d: "템플릿 문법 검증",
                    i: CheckCircle2,
                    tone: "green",
                  },
                  {
                    cmd: "sam build",
                    d: "코드+의존성 빌드 → .aws-sam/ 아티팩트 생성",
                    i: Package,
                    tone: "amber",
                  },
                  {
                    cmd: "sam local invoke / start-api",
                    d: "로컬 테스트 (내부적으로 도커 사용)",
                    i: FlaskConical,
                    tone: "teal",
                  },
                  {
                    cmd: "sam deploy",
                    d: "CloudFormation으로 배포 (스택 생성/업데이트)",
                    i: Rocket,
                    tone: "violet",
                  },
                  {
                    cmd: "sam sync --watch",
                    d: "코드 변경을 빠르게 클라우드에 반영 (개발 가속)",
                    i: RotateCcw,
                    tone: "green",
                  },
                ].map((x, i) => {
                  const XI = x.i;
                  const tn = TONES[x.tone];
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: C.surface,
                        border: `1px solid ${C.line}`,
                        borderRadius: 10,
                        padding: "9px 13px",
                      }}
                    >
                      <XI size={18} color={tn.fg} style={{ flexShrink: 0 }} />
                      <code
                        style={{
                          fontFamily: MONO,
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: tn.fg,
                          minWidth: 210,
                        }}
                      >
                        {x.cmd}
                      </code>
                      <span style={{ fontSize: 12.5, color: C.muted }}>
                        {x.d}
                      </span>
                    </div>
                  );
                })}
              </div>
            </DiagramFrame>
            <Callout variant="tip">
              전제 조건은 두 가지: <b>도커</b>(로컬 테스트·컨테이너 빌드용)와{" "}
              <b>AWS 자격증명</b>(배포용). <Kbd>sam sync</Kbd>는 CloudFormation
              전체 배포를 우회해 코드 변경을 수 초 만에 반영하므로, 반복 개발
              속도가 크게 빨라집니다.
            </Callout>
          </Section>

          {/* 381/382 DEPLOY */}
          <Section
            id="deploy"
            num="381 · 382"
            title="프로젝트 구조 & 배포 흐름"
            level={2}
            freq="◆◆◇ package→deploy 흐름·S3·capabilities 출제"
          >
            <H3>프로젝트 구조</H3>
            <DiagramFrame title="SAM 프로젝트 디렉터리">
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12.5,
                  lineHeight: 1.85,
                  color: C.inkSoft,
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  borderRadius: 10,
                  padding: "12px 15px",
                }}
              >
                <div>my-app/</div>
                <div>
                  ├─{" "}
                  <span style={{ color: C.amber, fontWeight: 700 }}>
                    template.yaml
                  </span>{" "}
                  <span style={{ color: C.faint }}>
                    # 인프라 정의(SAM 템플릿)
                  </span>
                </div>
                <div>
                  ├─{" "}
                  <span style={{ color: C.teal, fontWeight: 700 }}>
                    samconfig.toml
                  </span>{" "}
                  <span style={{ color: C.faint }}>
                    # 배포 설정(스택명·리전·버킷)
                  </span>
                </div>
                <div>
                  ├─ src/{" "}
                  <span style={{ color: C.faint }}># Lambda 함수 코드</span>
                </div>
                <div>
                  └─ events/{" "}
                  <span style={{ color: C.faint }}>
                    # 로컬 테스트용 샘플 이벤트
                  </span>
                </div>
              </div>
            </DiagramFrame>

            <H3>배포 파이프라인</H3>
            <DiagramFrame title="코드 → 빌드 → 패키지 → 배포 → 리소스 생성">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                  justifyContent: "center",
                }}
              >
                <Node icon={FileCode} title="코드+템플릿" tone="ink" />
                <Arrow label="sam build" />
                <Node
                  icon={Package}
                  title=".aws-sam/"
                  sub="빌드 아티팩트"
                  tone="amber"
                />
                <Arrow label="package" />
                <Node
                  icon={Cloud}
                  title="S3 업로드"
                  sub="CodeUri→S3 경로"
                  tone="teal"
                />
                <Arrow label="sam deploy" />
                <Node
                  icon={Rocket}
                  title="CloudFormation"
                  sub="스택 실행"
                  tone="violet"
                />
                <Arrow label="생성" />
                <Node icon={CheckCircle2} title="AWS 리소스" tone="green" />
              </div>
            </DiagramFrame>
            <P>
              <Kbd>sam package</Kbd>는 로컬 코드/아티팩트를 <b>S3 버킷</b>에
              업로드하고, 템플릿의 <Kbd>CodeUri</Kbd>를 S3 경로로 치환한 “배포용
              템플릿”을 만듭니다. <Kbd>sam deploy</Kbd>는 그 템플릿을{" "}
              <b>CloudFormation change set</b>으로 실행합니다. (요즘은{" "}
              <Kbd>sam deploy</Kbd> 하나가 package까지 통합 수행합니다.) 반복
              배포에 필요한 값(스택 이름·리전·버킷·권한)은{" "}
              <Kbd>samconfig.toml</Kbd>에 저장됩니다.
            </P>
            <Callout variant="exam" title="capabilities — 자주 나오는 함정">
              SAM이 IAM 역할 등 권한 리소스를 자동 생성하므로, 배포 시{" "}
              <b>확인 플래그</b>가 필요합니다. <Kbd>CAPABILITY_IAM</Kbd> /{" "}
              <Kbd>CAPABILITY_NAMED_IAM</Kbd>(이름 지정 IAM 리소스), 그리고
              Transform을 확장하므로 <Kbd>CAPABILITY_AUTO_EXPAND</Kbd>가 요구될
              수 있습니다. 이 capabilities 개념이 문제로 종종 등장합니다.
            </Callout>
          </Section>

          {/* 383 API GATEWAY */}
          <Section
            id="apigw"
            num="383"
            title="SAM + API Gateway"
            level={2}
            freq="◆◆◇ 암묵/명시 생성·이벤트 방식 출제"
          >
            <P>Lambda 앞단의 HTTP 진입점을 만드는 두 가지 방법이 있습니다.</P>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
              className="two"
            >
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  borderRadius: 11,
                  padding: 13,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    color: C.violet,
                    marginBottom: 6,
                    fontSize: 13,
                  }}
                >
                  ① 암묵적(Implicit)
                </div>
                <div
                  style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}
                >
                  함수 <Kbd>Events</Kbd>에 <Kbd>Type: Api</Kbd>만 달면 SAM이 API
                  Gateway를 <b>자동 생성</b>. 가장 간단.
                </div>
              </div>
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  borderRadius: 11,
                  padding: 13,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    color: C.violet,
                    marginBottom: 6,
                    fontSize: 13,
                  }}
                >
                  ② 명시적(Explicit)
                </div>
                <div
                  style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}
                >
                  <Kbd>AWS::Serverless::Api</Kbd>로 직접 정의 →
                  스테이지·CORS·인증 등 <b>세부 제어</b> 가능.
                </div>
              </div>
            </div>
            <CodeBlock
              caption="Api 이벤트로 API Gateway 자동 생성"
              code={`Resources:
  GetItemFn:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.get
      Events:
        GetItem:
          Type: Api            # ← 이것만으로 API Gateway 자동 생성
          Properties:
            Path: /items/{id}
            Method: get`}
            />
            <DiagramFrame title="SAM이 자동으로 엮어 주는 것들">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Node icon={Globe} title="클라이언트" tone="ink" w={100} />
                <Arrow label="GET /items" />
                <Node
                  icon={Network}
                  title="API Gateway"
                  sub="경로·메서드"
                  tone="violet"
                />
                <Arrow label="호출" />
                <Node icon={Zap} title="Lambda" tone="amber" />
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: MONO,
                  fontSize: 11.5,
                  color: C.muted,
                }}
              >
                SAM 자동 생성: RestApi · Method · Stage · Deployment ·{" "}
                <b>Lambda Permission</b>(호출 권한)
              </div>
            </DiagramFrame>
            <Callout variant="exam">
              <Kbd>Api</Kbd> 이벤트만으로 API Gateway가 자동 생성되고{" "}
              <b>Lambda 호출 권한까지 자동 부여</b>된다는 점이 핵심입니다.{" "}
              <b>HttpApi</b>(저비용·저지연·간단) vs <b>REST API</b>(기능
              풍부·세밀한 제어)의 구분도 자주 묻습니다.
            </Callout>
          </Section>

          {/* 384 DYNAMODB */}
          <Section
            id="dynamo"
            num="384"
            title="SAM + DynamoDB"
            level={2}
            freq="◆◆◇ SimpleTable·스트림 트리거 출제"
          >
            <P>
              서버리스 앱의 데이터 저장소로 DynamoDB를 자주 씁니다. SAM은 간단한
              테이블용 축약을 제공합니다.
            </P>
            <CodeBlock
              caption="SimpleTable + 함수 연결"
              code={`Resources:
  ItemsTable:
    Type: AWS::Serverless::SimpleTable    # 단일 키 간단 테이블

  WriteFn:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.write
      Environment:
        Variables:
          TABLE_NAME: !Ref ItemsTable     # 테이블 이름 주입
      Policies:
        - DynamoDBCrudPolicy:             # 권한은 정책 템플릿으로(다음 섹션)
            TableName: !Ref ItemsTable`}
            />
            <DiagramFrame title="두 가지 상호작용 방식">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Node icon={Zap} title="Lambda" tone="amber" />
                  <Arrow label="읽기/쓰기" />
                  <Node
                    icon={Database}
                    title="DynamoDB"
                    sub="SimpleTable"
                    tone="teal"
                  />
                </div>
                <div style={{ height: 1, background: C.line }} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Node
                    icon={Database}
                    title="DynamoDB"
                    sub="Streams"
                    tone="teal"
                  />
                  <Arrow label="변경 이벤트" />
                  <Node
                    icon={Zap}
                    title="Lambda"
                    sub="Type: DynamoDB"
                    tone="amber"
                  />
                </div>
              </div>
            </DiagramFrame>
            <Callout variant="exam">
              <b>SimpleTable</b>은 단순한(단일 파티션 키) 테이블용 축약입니다.
              복잡한 인덱스가 필요하면 <Kbd>AWS::DynamoDB::Table</Kbd>을 직접
              씁니다. 또한 <b>DynamoDB Streams</b>를 함수 <Kbd>Events</Kbd>의{" "}
              <Kbd>Type: DynamoDB</Kbd>로 연결하면 테이블 변경에 반응하는{" "}
              <b>이벤트 소스 매핑</b> 트리거가 됩니다.
            </Callout>
          </Section>

          {/* 385 POLICY TEMPLATES */}
          <Section
            id="policy"
            num="385"
            title="정책 템플릿 (Policy Templates)"
            level={2}
            freq="◆◆◇ 최소권한·이름만 지정 개념 출제"
          >
            <P>
              Lambda가 다른 서비스에 접근하려면 IAM 권한이 필요합니다. 직접 IAM
              정책 JSON을 작성하는 대신, SAM은{" "}
              <b>사전 정의된 최소권한(least-privilege) 정책 세트</b>인{" "}
              <b>정책 템플릿</b>을 제공합니다. 함수 <Kbd>Policies</Kbd>에{" "}
              <b>이름과 대상 리소스만</b> 넣으면 필요한 IAM 정책이 자동
              생성됩니다.
            </P>
            <DiagramFrame title="정책 템플릿의 동작">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                  justifyContent: "center",
                }}
              >
                <Node icon={Zap} title="함수" tone="amber" w={90} />
                <Arrow label="Policies:" />
                <Node
                  icon={Shield}
                  title="DynamoDBCrudPolicy"
                  sub="(TableName)"
                  tone="teal"
                  w={160}
                />
                <Arrow label="자동 변환" />
                <Node
                  icon={FileCode}
                  title="IAM 역할/정책"
                  sub="필요 권한만"
                  tone="violet"
                />
                <Arrow label="접근" />
                <Node icon={Database} title="DynamoDB" tone="green" w={100} />
              </div>
            </DiagramFrame>
            <H3>자주 쓰는 정책 템플릿</H3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
              className="two"
            >
              {[
                ["DynamoDBCrudPolicy", "테이블 읽기+쓰기"],
                ["DynamoDBReadPolicy", "테이블 읽기 전용"],
                ["S3ReadPolicy / S3CrudPolicy", "S3 버킷 접근"],
                ["SQSPollerPolicy", "SQS 큐 폴링"],
                ["SNSPublishMessagePolicy", "SNS 발행"],
                ["LambdaInvokePolicy", "다른 함수 호출"],
              ].map(([a, b], i) => (
                <div
                  key={i}
                  style={{
                    background: C.surfaceAlt,
                    border: `1px solid ${C.line}`,
                    borderRadius: 9,
                    padding: "9px 11px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: C.teal,
                    }}
                  >
                    {a}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                    {b}
                  </div>
                </div>
              ))}
            </div>
            <Callout variant="note" title="보너스: SAM Connectors">
              최신 SAM에는 <b>Connectors</b>가 있어, 리소스 간 권한을 “A가 B에
              쓴다”는 <b>의도</b>로 선언하면 SAM이 알맞은 IAM 권한으로 변환해
              줍니다. 정책 이름조차 고를 필요가 없어 더 간단합니다.
            </Callout>
            <Callout variant="exam">
              핵심: 정책 템플릿 = <b>미리 정의된 최소권한 축약</b>.{" "}
              <b>이름 + 대상 리소스</b>만 지정하면 IAM 정책이 자동 생성됩니다.
              필요 시 인라인 커스텀 정책도 함께 붙일 수 있습니다.
            </Callout>
          </Section>

          {/* 386 CODEDEPLOY */}
          <Section
            id="codedeploy"
            num="386"
            title="SAM + CodeDeploy"
            level={3}
            freq="◆◆◆ 최상위 빈출 — Canary/Linear 정의는 단골 문제"
          >
            <P>
              새 Lambda 버전을 배포할 때 <b>트래픽을 점진적으로 이동</b>시켜
              위험을 줄이고, 문제가 감지되면 <b>자동 롤백</b>합니다. SAM은 이를
              위해 내부적으로 <b>CodeDeploy</b> 리소스를 생성하며, 템플릿에는{" "}
              <Kbd>DeploymentPreference</Kbd>만 선언하면 됩니다.
            </P>
            <CodeBlock
              caption="트래픽 전환 설정"
              code={`Resources:
  ApiFn:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.handler
      AutoPublishAlias: live          # 별칭 발행(필수) — 배포마다 새 버전
      DeploymentPreference:
        Type: Canary10Percent5Minutes # 전환 방식
        Alarms:                       # 울리면 자동 롤백
          - !Ref ErrorAlarm
        Hooks:                        # 전환 전/후 검증 Lambda
          PreTraffic:  !Ref PreCheckFn
          PostTraffic: !Ref PostCheckFn`}
            />

            <TrafficShift />

            <H3>세 가지 전환 방식 — 반드시 구분</H3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
              className="three"
            >
              {[
                {
                  t: "Canary",
                  c: C.amber,
                  d: "먼저 소량(예 10%)만 전환하고 대기 → 이상 없으면 나머지 100%.",
                  e: "Canary10Percent5Minutes",
                  k: "2단계",
                },
                {
                  t: "Linear",
                  c: C.teal,
                  d: "일정 시간마다 동일 비율(예 +10%)씩 균등하게 증가.",
                  e: "Linear10PercentEvery1Minute",
                  k: "균등 증분",
                },
                {
                  t: "AllAtOnce",
                  c: C.red,
                  d: "점진 없이 한 번에 100% 전환. 가장 빠르지만 위험.",
                  e: "AllAtOnce",
                  k: "즉시",
                },
              ].map((x, i) => (
                <div
                  key={i}
                  style={{
                    background: C.surface,
                    border: `1.5px solid ${x.c}`,
                    borderRadius: 12,
                    padding: 13,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: MONO,
                        fontWeight: 800,
                        color: x.c,
                        fontSize: 14,
                      }}
                    >
                      {x.t}
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 10,
                        color: "#fff",
                        background: x.c,
                        padding: "2px 7px",
                        borderRadius: 6,
                      }}
                    >
                      {x.k}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: C.inkSoft,
                      lineHeight: 1.55,
                      marginBottom: 8,
                    }}
                  >
                    {x.d}
                  </div>
                  <code
                    style={{
                      fontFamily: MONO,
                      fontSize: 10.5,
                      color: C.muted,
                      background: C.surfaceAlt,
                      padding: "3px 6px",
                      borderRadius: 5,
                      display: "block",
                      wordBreak: "break-all",
                    }}
                  >
                    {x.e}
                  </code>
                </div>
              ))}
            </div>

            <Callout
              variant="warn"
              title="Canary vs Linear — 가장 헷갈리는 지점"
            >
              <b>Canary</b>는 “소량 먼저 → (한 번 대기) → 전량”의 <b>2단계</b>
              이고, <b>Linear</b>는 “일정 간격마다 같은 비율씩”{" "}
              <b>여러 단계로 균등 증가</b>합니다. 문제에서 전환 이름(예:{" "}
              <Kbd>Canary10Percent5Minutes</Kbd> vs{" "}
              <Kbd>Linear10PercentEvery1Minute</Kbd>)의 의미를 골라내게 하는
              경우가 많습니다.
            </Callout>
            <Callout variant="exam">
              구성 요소 암기: <b>AutoPublishAlias</b>(별칭·필수) →{" "}
              <b>DeploymentPreference.Type</b>(전환 방식) → <b>Alarms</b>
              (CloudWatch 알람으로 자동 롤백) → <b>Hooks</b>(Pre/PostTraffic
              검증 Lambda). 실제 트래픽 전환은 <b>CodeDeploy</b>가 수행합니다.
            </Callout>
          </Section>

          {/* 387 LOCAL */}
          <Section
            id="local"
            num="387"
            title="SAM Local (로컬 기능)"
            level={2}
            freq="◆◆◇ start-api 의미·도커 필요 출제"
          >
            <P>
              배포하지 않고 <b>로컬에서 서버리스 앱을 실행·테스트</b>합니다.
              내부적으로 <b>도커 컨테이너</b>로 실제 Lambda 런타임과 동일한
              환경을 재현하므로(도커 섹션과 연결) 클라우드 비용·지연 없이 빠르게
              디버깅할 수 있습니다.
            </P>
            <DiagramFrame title="주요 로컬 명령">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  [
                    "sam local invoke",
                    "함수를 1회 실행 (이벤트 입력)",
                    FlaskConical,
                  ],
                  [
                    "sam local start-api",
                    "로컬 HTTP 서버로 API Gateway 모방 → 엔드포인트 테스트",
                    Globe,
                  ],
                  [
                    "sam local start-lambda",
                    "로컬 Lambda 엔드포인트 (SDK/테스트에서 호출)",
                    Zap,
                  ],
                  [
                    "sam local generate-event",
                    "S3·API GW 등 샘플 이벤트(JSON) 생성",
                    FileCode,
                  ],
                ].map(([a, b, I], i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: C.surface,
                      border: `1px solid ${C.line}`,
                      borderRadius: 10,
                      padding: "9px 13px",
                    }}
                  >
                    {React.createElement(I, {
                      size: 17,
                      color: C.teal,
                      style: { flexShrink: 0 },
                    })}
                    <code
                      style={{
                        fontFamily: MONO,
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: C.teal,
                        minWidth: 210,
                      }}
                    >
                      {a}
                    </code>
                    <span style={{ fontSize: 12.5, color: C.muted }}>{b}</span>
                  </div>
                ))}
              </div>
            </DiagramFrame>
            <Callout variant="exam">
              로컬 테스트에는 <b>도커가 필요</b>합니다.{" "}
              <Kbd>sam local start-api</Kbd>는{" "}
              <b>API Gateway를 로컬에서 시뮬레이션</b>하는 명령이라는 점이 자주
              나옵니다. IDE(예: VS Code) 연동으로 브레이크포인트 디버깅도
              가능합니다.
            </Callout>
          </Section>

          {/* 388 MULTIENV */}
          <Section
            id="multienv"
            num="388"
            title="다중 환경 (Multiple Environments)"
            level={1}
            freq="◆◇◇ 파라미터·config-env·스택 분리 개념"
          >
            <P>
              <b>dev · staging · prod</b>를 분리해 배포합니다. 하나의{" "}
              <Kbd>template.yaml</Kbd>에 <b>Parameters</b>로 환경별 값을
              주입하고, <Kbd>samconfig.toml</Kbd>에 환경별 설정 블록을 두어{" "}
              <Kbd>sam deploy --config-env prod</Kbd> 식으로 전환합니다. 각
              환경은 <b>별도의 CloudFormation 스택</b>으로 격리됩니다.
            </P>
            <DiagramFrame title="하나의 템플릿 → 여러 격리 스택">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <Node
                  icon={FileCode}
                  title="template.yaml"
                  sub="+ Parameters"
                  tone="ink"
                  w={140}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <span
                    style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}
                  >
                    config-env 별
                  </span>
                  <Split size={20} color={C.faint} />
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <Node icon={Cloud} title="dev 스택" tone="teal" w={120} />
                  <Node
                    icon={Cloud}
                    title="staging 스택"
                    tone="amber"
                    w={120}
                  />
                  <Node icon={Cloud} title="prod 스택" tone="violet" w={120} />
                </div>
              </div>
            </DiagramFrame>
            <Callout variant="exam">
              환경별로 <b>별도 스택 + 파라미터로 차별화</b>. 환경별 설정·비밀
              값은 <b>SSM Parameter Store</b>나 <b>Secrets Manager</b>로
              관리하고, <Kbd>samconfig.toml</Kbd>의 <b>config-env</b>로 대상
              환경을 전환합니다.
            </Callout>
          </Section>

          {/* CHEAT SHEET */}
          <Section id="cheat" num="퀴즈 대비" title="시험 요약 · 치트시트">
            <H3>한눈에 보는 핵심</H3>
            <div
              style={{
                overflowX: "auto",
                border: `1px solid ${C.line}`,
                borderRadius: 12,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: C.ink }}>
                    {["개념", "한 줄 정리", "빈출"].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: "left",
                          padding: "10px 13px",
                          color: "#DDE7EC",
                          fontFamily: MONO,
                          fontSize: 11.5,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "SAM의 정체",
                      "CloudFormation의 확장(서버리스 축약 문법 + CLI)",
                      3,
                    ],
                    [
                      "Transform 헤더",
                      "AWS::Serverless-2016-10-31 → SAM으로 인식",
                      3,
                    ],
                    [
                      "배포 실행 엔진",
                      "언제나 CloudFormation 스택으로 배포·롤백",
                      3,
                    ],
                    [
                      "CodeDeploy 전환",
                      "Canary(2단계)·Linear(균등)·AllAtOnce(즉시)",
                      3,
                    ],
                    [
                      "자동 롤백",
                      "CloudWatch 알람 감지 시 이전 버전으로 복귀",
                      3,
                    ],
                    [
                      "AutoPublishAlias",
                      "트래픽 전환의 전제(별칭+버전 발행)",
                      2,
                    ],
                    [
                      "Pre/PostTraffic 훅",
                      "전환 전/후 실행하는 검증용 Lambda",
                      2,
                    ],
                    [
                      "정책 템플릿",
                      "이름+리소스만 지정하는 사전 정의 최소권한",
                      2,
                    ],
                    [
                      "package → deploy",
                      "S3 업로드(CodeUri 치환) → 스택 실행",
                      2,
                    ],
                    [
                      "capabilities",
                      "CAPABILITY_IAM / NAMED_IAM / AUTO_EXPAND",
                      2,
                    ],
                    [
                      "sam local",
                      "도커로 로컬 실행; start-api는 API GW 시뮬레이션",
                      2,
                    ],
                    [
                      "Api 이벤트",
                      "함수 이벤트만으로 API Gateway+권한 자동 생성",
                      2,
                    ],
                    ["SimpleTable", "간단한 DynamoDB 테이블 축약", 1],
                    ["다중 환경", "파라미터+config-env로 스택 분리", 1],
                  ].map((r, i) => (
                    <tr
                      key={i}
                      style={{
                        background: i % 2 ? C.surfaceAlt : C.surface,
                        borderTop: `1px solid ${C.line}`,
                      }}
                    >
                      <td
                        style={{
                          padding: "9px 13px",
                          fontWeight: 700,
                          color: C.ink,
                          fontFamily: MONO,
                          fontSize: 12,
                        }}
                      >
                        {r[0]}
                      </td>
                      <td style={{ padding: "9px 13px", color: C.inkSoft }}>
                        {r[1]}
                      </td>
                      <td style={{ padding: "9px 13px" }}>
                        <ExamBadge level={r[2]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>자주 틀리는 함정 체크</H3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Canary는 ‘소량 먼저 후 전량(2단계)’, Linear는 ‘균등 증분(여러 단계)’ — 정의를 바꿔서 출제.",
                "SAM은 별개 배포 서비스가 아니라 CloudFormation의 확장 — 배포/롤백은 CloudFormation 스택.",
                "Transform 한 줄이 없으면 SAM 템플릿이 아니다.",
                "정책 템플릿은 커스텀 IAM JSON을 쓰지 않고 이름+리소스만 지정하는 최소권한 방식.",
                "sam local 계열은 도커가 있어야 동작한다.",
                "AutoPublishAlias가 있어야 트래픽 전환(CodeDeploy)이 가능하다.",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    background: C.surface,
                    border: `1px solid ${C.line}`,
                    borderRadius: 10,
                    padding: "10px 13px",
                  }}
                >
                  <ListChecks
                    size={16}
                    color={C.amber}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <span
                    style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.55 }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 6,
                padding: "14px 16px",
                background: C.ink,
                borderRadius: 12,
                color: "#B7C7CF",
                fontSize: 12.5,
                lineHeight: 1.6,
              }}
            >
              <span
                style={{ fontFamily: MONO, color: "#E8A54A", fontWeight: 700 }}
              >
                정리 —
              </span>{" "}
              이 자료는 실습(설치·프로젝트 생성 단계)을 제외하고{" "}
              <b>개념·구조·시험 포인트</b> 위주로 구성했습니다. 빈출 지표(◆)는
              상대적 참고치이며, 실제 시험 문항 구성과 SAM 세부 사항은 버전에
              따라 달라질 수 있으니 공식 문서로 최종 확인하세요.
            </div>
          </Section>
        </main>
      </div>

      {/* responsive rules */}
      <style>{`
        @media (max-width: 860px) {
          .layout { grid-template-columns: 1fr !important; gap: 0 !important; }
          .sidebar { display: none !important; }
          .two, .three { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 861px) { .chipnav { display: none !important; } }
        button:focus-visible, input:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-thumb { background: #C3CBD0; border-radius: 8px; }
      `}</style>
    </div>
  );
}
