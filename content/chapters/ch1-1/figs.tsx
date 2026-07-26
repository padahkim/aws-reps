"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { C } from "../ui";
import { chipBtn, fillBtn, SimFrame } from "../interactive";

/**
 * 챕터 도식 SVG + 챕터 로컬 컴포넌트 (규약 v3) — sections/*.mdx 가 import 한다. 내용은 body.tsx 시절 그대로.
 * StorageClassDecisionTree(#72)가 useState 를 쓰므로 파일 전체를 "use client"로 둔다
 * (body.tsx 클라이언트 경계 안이라 무해 — ch0-2·ch1-2 figs 전례).
 */

export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** JSON/정책 예시 블록 — 잉크 배경 카드 (전역 셀렉터 없이 인라인 스타일만). */
export function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        fontFamily: MONO,
        fontSize: "0.8rem",
        lineHeight: 1.7,
        background: C.ink,
        color: "#D5E0EC",
        borderRadius: 11,
        padding: "1rem 1.15rem",
        overflowX: "auto",
        margin: "1rem 0",
      }}
    >
      {children}
    </pre>
  );
}

/** 주의(함정) 콜아웃 — 레드 왼쪽 보더. */
export function WarnBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: C.redSoft,
        color: C.ink,
        borderLeft: `5px solid ${C.red}`,
        borderRadius: "0 12px 12px 0",
        padding: "0.85rem 1.15rem",
        margin: "1.25rem 0",
        fontSize: "0.93rem",
      }}
    >
      <b style={{ color: C.red }}>⚠ 함정 </b>
      {children}
    </div>
  );
}

/* ============ 인터랙티브: 스토리지 클래스 결정트리 (#72 신규) ============ */

type TreeTerminal = {
  name: string;
  spec: string;
  exam: string;
  rejected: string[];
};

/**
 * 스토리지 클래스 결정트리 — 시나리오 질문에 순차 답하면 추천 클래스와
 * 인접 오답 클래스의 탈락 사유가 나온다. 독립 토글이 아니라 가이드형 결정트리인 이유:
 * 토글 조합은 모순 상태("자주 접근 + 단일 AZ" 등 — One Zone-IA는 저빈도 계층)를 낳는다.
 *
 * 도달 가능한 종착지는 §06 표·ExamPoint 4시나리오에 묶는다 — 탈락 사유가 표가 단언하지
 * 않는 규칙을 지어내지 않게 (수치 근거: §06 표 = 최소기간 30/90/180일 · GIR 밀리초 ·
 * GFR 신속 1~5분/표준 3~5h/대량 5~12h · GDA 표준 12h/대량 48h·신속 미지원 ·
 * One Zone-IA 99.5% 단일 AZ · IT 모니터링 비용·128KB 미만 미모니터링).
 */
export function StorageClassDecisionTree() {
  const [a1, setA1] = useState<"known" | "unknown" | null>(null);
  const [keep, setKeep] = useState<"short" | "long" | null>(null);
  const [a2, setA2] = useState<"ms" | "wait" | null>(null);
  const [a3, setA3] = useState<"freq" | "monthly" | "quarterly" | null>(null);
  const [a3b, setA3b] = useState<"recreate" | "unique" | null>(null);
  const [a4, setA4] = useState<"hours" | "days" | null>(null);

  const pick1 = (v: "known" | "unknown") => { setA1(v); setKeep(null); setA2(null); setA3(null); setA3b(null); setA4(null); };
  const pickKeep = (v: "short" | "long") => { setKeep(v); setA2(null); setA3(null); setA3b(null); setA4(null); };
  const pick2 = (v: "ms" | "wait") => { setA2(v); setA3(null); setA3b(null); setA4(null); };
  const pick3 = (v: "freq" | "monthly" | "quarterly") => { setA3(v); setA3b(null); };

  const TERMINALS: Record<string, TreeTerminal> = {
    it: {
      name: "Intelligent-Tiering",
      spec: "최소 기간 없음 · 검색 비용 없음 · 접근 패턴 따라 자동 계층 이동",
      exam: "“접근 패턴 불명 + 운영 부담 최소화” → Intelligent-Tiering (소액 모니터링 비용, 128KB 미만은 미모니터링)",
      rejected: ["나머지 전 클래스 — 접근 패턴을 알아야 유리한 선택이 가능한 값들이라, 패턴 불명이면 자동 이동이 답"],
    },
    std: {
      name: "Standard",
      spec: "최소 기간 없음 · 즉시 접근 · 검색 비용 없음 · 가용성 99.99%",
      exam: "자주 접근하는 데이터의 기본값 — 빅데이터, 콘텐츠 배포",
      rejected: ["Standard-IA·One Zone-IA — 검색 비용 + 최소 30일 규칙: 자주 꺼내는 데이터엔 오히려 불리"],
    },
    stdShort: {
      name: "Standard",
      spec: "최소 기간 없음 — 언제 지워도 그때까지만 과금",
      exam: "최소 저장 기간이 다른 축을 이기는 경우 — 30일 안에 지울 데이터는 접근 빈도·검색 속도와 무관하게 Standard(또는 Intelligent-Tiering)가 답이다.",
      rejected: [
        "Standard-IA·One Zone-IA — 최소 30일: 일주일 뒤 지워도 30일치가 청구된다",
        "Glacier Instant·Flexible — 최소 90일 · Deep Archive — 최소 180일: 저장 단가가 싸도 조기 삭제 요금이 이를 덮는다",
      ],
    },
    sia: {
      name: "Standard-IA",
      spec: "최소 30일 · 밀리초 접근 · 저렴한 저장 + 검색 비용 · 가용성 99.9%",
      exam: "저빈도지만 즉시 필요한 데이터 — 백업, 재해 복구",
      rejected: [
        "One Zone-IA — 단일 AZ(가용성 99.5%)·AZ 파괴 시 유실: 원본·유일본엔 부적합",
        "Glacier류 — 최소 90일+ 이고 (GIR 제외) 복원 절차가 필요",
      ],
    },
    ozia: {
      name: "One Zone-IA",
      spec: "최소 30일 · 단일 AZ · 가용성 99.5%",
      exam: "“손실돼도 재생성 가능한 데이터의 저비용 보관” → One Zone-IA (2차 백업·재생성 가능 사본)",
      rejected: ["Standard-IA — 재생성 가능한 사본에는 다중 AZ 내구 구조가 초과 사양 (저비용 보관이 목적)"],
    },
    gir: {
      name: "Glacier Instant Retrieval",
      spec: "최소 90일 · 밀리초 검색 · 가용성 99.9%",
      exam: "“복원 없이 즉시 접근 + 아카이브 가격” → Glacier Instant Retrieval (분기 1회 접근 데이터)",
      rejected: [
        "Glacier Flexible — 가장 빠른 신속 검색도 1~5분 대기: “즉시(밀리초)”가 필요하면 탈락",
        "Standard-IA — 아카이브 가격이 아님: 분기 1회 수준이면 GIR이 경계 너머",
      ],
    },
    gfr: {
      name: "Glacier Flexible Retrieval",
      spec: "최소 90일 · 신속 1~5분 / 표준 3~5시간 / 대량 5~12시간(무료) · 복원 후 접근",
      exam: "복원 절차를 감수하는 아카이브 — 검색 속도 3옵션을 상황에 맞게 선택",
      rejected: ["Glacier Deep Archive — 신속 검색 미지원·표준 12시간: 분~수 시간 내 복원이 필요하면 탈락"],
    },
    gda: {
      name: "Glacier Deep Archive",
      spec: "최소 180일 · 표준 12시간 / 대량 48시간 · 최저가 · 신속 검색 미지원",
      exam: "“7년 규정 보관, 거의 안 봄” → Glacier Deep Archive. 검색 시간·최소 기간(30/90/180일) 암기",
      rejected: ["Glacier Flexible — 더 빨리 꺼낼 수 있지만 최저가는 아님: 12시간+ 대기가 가능하면 Deep Archive"],
    },
  };

  // 보관 기간이 30일 미만이면 최소 저장 기간(IA 30일 · Glacier 90/180일)이 다른 모든 축을
  // 이긴다 — 일주일 뒤 지울 객체를 GFR 에 넣으면 90일치를 문다. 그래서 검색 지연·빈도를
  // 묻기 전에 여기서 단락시킨다 (PR #151 Codex 지적).
  const terminal: TreeTerminal | null =
    a1 === "unknown" ? TERMINALS.it
    : keep === "short" ? TERMINALS.stdShort
    : a3 === "freq" ? TERMINALS.std
    : a3 === "quarterly" ? TERMINALS.gir
    : a3b === "recreate" ? TERMINALS.ozia
    : a3b === "unique" ? TERMINALS.sia
    : a4 === "hours" ? TERMINALS.gfr
    : a4 === "days" ? TERMINALS.gda
    : null;

  type Q = {
    key: string;
    label: string;
    options: { v: string; label: string; on: boolean; set: () => void }[];
  };

  const questions: Q[] = [
    {
      key: "q1",
      label: "Q1. 접근 패턴을 예측할 수 있나요?",
      options: [
        { v: "known", label: "예측 가능", on: a1 === "known", set: () => pick1("known") },
        { v: "unknown", label: "불명·변동 — 운영 부담 최소화", on: a1 === "unknown", set: () => pick1("unknown") },
      ],
    },
  ];
  if (a1 === "known") {
    questions.push({
      key: "qKeep",
      label: "Q2. 얼마나 오래 보관하나요?",
      options: [
        { v: "short", label: "30일 안에 지운다", on: keep === "short", set: () => pickKeep("short") },
        { v: "long", label: "30일 이상 둔다", on: keep === "long", set: () => pickKeep("long") },
      ],
    });
  }
  if (keep === "long") {
    questions.push({
      key: "q2",
      label: "Q3. 꺼낼 때 얼마나 빨리 필요한가요?",
      options: [
        { v: "ms", label: "밀리초 — 복원 대기 불가", on: a2 === "ms", set: () => pick2("ms") },
        { v: "wait", label: "복원 대기 가능 (분~시간 이상)", on: a2 === "wait", set: () => pick2("wait") },
      ],
    });
  }
  if (a2 === "ms") {
    questions.push({
      key: "q3",
      label: "Q4. 얼마나 자주 접근하나요?",
      options: [
        { v: "freq", label: "자주 — 월 여러 번", on: a3 === "freq", set: () => pick3("freq") },
        { v: "monthly", label: "가끔 — 월 1회 수준 (백업·DR)", on: a3 === "monthly", set: () => pick3("monthly") },
        { v: "quarterly", label: "드묾 — 분기 1회, 90일 이상 보관", on: a3 === "quarterly", set: () => pick3("quarterly") },
      ],
    });
  }
  if (a3 === "monthly") {
    questions.push({
      key: "q3b",
      label: "Q4-1. 손실돼도 재생성 가능한 데이터인가요?",
      options: [
        { v: "recreate", label: "예 — 재생성 가능한 사본 (단일 AZ 감수)", on: a3b === "recreate", set: () => setA3b("recreate") },
        { v: "unique", label: "아니요 — 원본·유일본", on: a3b === "unique", set: () => setA3b("unique") },
      ],
    });
  }
  if (a2 === "wait") {
    questions.push({
      key: "q4",
      label: "Q4. 복원을 얼마나 기다릴 수 있나요?",
      options: [
        { v: "hours", label: "분~수 시간 안엔 필요 (90일 이상 보관)", on: a4 === "hours", set: () => setA4("hours") },
        { v: "days", label: "12시간+ 대기 가능 (180일 이상·규정 보관)", on: a4 === "days", set: () => setA4("days") },
      ],
    });
  }

  return (
    <SimFrame title="스토리지 클래스 결정트리 — 시나리오로 골라 보세요" icon="🗂">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {questions.map((q, qi) => {
          const answered = q.options.some((o) => o.on);
          const isCurrent = !answered && qi === questions.length - 1 && !terminal;
          return (
            <div
              key={q.key}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: `1.5px solid ${isCurrent ? C.amber : C.line}`,
                background: "#fff",
              }}
            >
              <div style={{ fontSize: "0.86rem", fontWeight: 700, color: C.ink, marginBottom: 8 }}>{q.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {q.options.map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={o.set}
                    aria-pressed={o.on}
                    className="widget-btn"
                    style={{
                      ...chipBtn(o.on, C.amber, C.amberSoft),
                      fontSize: "0.8rem",
                      fontFamily: MONO,
                      padding: "7px 12px",
                      borderRadius: 8,
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {terminal && (
          <div
            style={{
              padding: "13px 15px",
              borderRadius: 10,
              background: C.tealSoft,
              border: `1.5px solid ${C.teal}`,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: "1.05rem", fontWeight: 900, color: C.teal }}>
              → {terminal.name}
            </div>
            <div style={{ fontSize: "0.8rem", color: C.inkSoft, marginTop: 4, fontFamily: MONO }}>{terminal.spec}</div>
            <div style={{ fontSize: "0.85rem", color: C.ink, lineHeight: 1.65, marginTop: 8 }}>{terminal.exam}</div>
            <div style={{ marginTop: 10, borderTop: `1px dashed ${C.teal}`, paddingTop: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: "0.68rem", fontWeight: 700, color: C.red, letterSpacing: 0.5, marginBottom: 4 }}>
                왜 이웃 클래스가 아닌가
              </div>
              {terminal.rejected.map((r, i) => (
                <div key={i} style={{ fontSize: "0.8rem", color: C.inkSoft, lineHeight: 1.6, margin: "3px 0" }}>
                  ✖ {r}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setA1(null); setKeep(null); setA2(null); setA3(null); setA3b(null); setA4(null); }}
              className="widget-btn"
              style={{
                ...fillBtn(C.ink, C.inkSoft),
                marginTop: 10,
                borderRadius: 8,
                padding: "7px 14px",
                fontSize: "0.78rem",
              }}
            >
              처음부터 다시
            </button>
          </div>
        )}
      </div>
    </SimFrame>
  );
}

export function OverviewSvg() {
  return (
    <svg viewBox="0 0 700 240" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="15" y="15" width="330" height="210" rx="14" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="32" y="44" fontSize="13" fontWeight="800" fill={C.teal}>
        버킷 my-app-bucket
      </text>
      <text x="32" y="62" fontSize="10.5" fill={C.inkSoft}>
        이름은 전역 고유 · 버킷은 리전 단위 생성
      </text>
      {["images/logo.png", "images/2026/a.jpg", "data/report.csv"].map((k, i) => (
        <g key={k}>
          <rect x="32" y={76 + i * 40} width="296" height="30" rx="7" fill={C.card} stroke={C.line} />
          <text x="44" y={95 + i * 40} fontSize="11" fontFamily="monospace" fontWeight="600" fill={C.ink}>
            {k}
          </text>
        </g>
      ))}
      <rect x="375" y="30" width="310" height="180" rx="12" fill={C.card} stroke={C.line} strokeWidth="1.5" />
      <text x="392" y="56" fontSize="12.5" fontWeight="800" fill={C.ink}>
        객체(Object) = Key + Value
      </text>
      <text x="392" y="82" fontSize="10.5" fontFamily="monospace" fill={C.blue}>
        s3://my-app-bucket/images/logo.png
      </text>
      <text x="392" y="104" fontSize="10.5" fill={C.inkSoft}>
        Key = prefix(images/) + 객체 이름(logo.png)
      </text>
      <text x="392" y="122" fontSize="10.5" fill={C.inkSoft}>
        실제 폴더는 없음 — &ldquo;/&rdquo;로 계층처럼 보일 뿐
      </text>
      <text x="392" y="148" fontSize="10.5" fill={C.ink}>
        Value(본문) 최대{" "}
        <tspan fontWeight="800" fill={C.red}>
          50TB
        </tspan>{" "}
        · 단일 PUT 5GB
      </text>
      <text x="392" y="166" fontSize="10.5" fill={C.inkSoft}>
        + 메타데이터 · 태그(최대 10개) · 버전 ID
      </text>
      <text x="392" y="194" fontSize="10.5" fontWeight="700" fill={C.red}>
        5GB 초과 업로드 = 멀티파트 필수
      </text>
    </svg>
  );
}

export function PolicySvg() {
  return (
    <svg viewBox="0 0 700 230" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="20" y="30" width="150" height="56" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="95" y="54" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>
        IAM 사용자/역할
      </text>
      <text x="95" y="72" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        IAM 정책 (자격증명 기반)
      </text>
      <rect x="20" y="130" width="150" height="56" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="1.5" />
      <text x="95" y="154" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.ink}>
        외부/교차 계정
      </text>
      <text x="95" y="172" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        버킷 정책 (리소스 기반)
      </text>
      <rect x="280" y="78" width="170" height="64" rx="10" fill={C.card} stroke={C.ink} strokeWidth="1.5" />
      <text x="365" y="103" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.ink}>
        접근 평가
      </text>
      <text x="365" y="122" textAnchor="middle" fontSize="10" fill={C.red} fontWeight="700">
        명시적 Deny 최우선
      </text>
      <rect x="530" y="78" width="150" height="64" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="605" y="103" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.teal}>
        S3 버킷
      </text>
      <text x="605" y="122" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        허용 or 거부
      </text>
      <line x1="170" y1="58" x2="280" y2="98" stroke={C.blue} strokeWidth="1.6" />
      <line x1="170" y1="158" x2="280" y2="122" stroke={C.amber} strokeWidth="1.6" />
      <line x1="450" y1="110" x2="530" y2="110" stroke={C.teal} strokeWidth="1.6" />
      <text x="490" y="100" textAnchor="middle" fontSize="9.5" fill={C.teal} fontWeight="700">
        Allow ∪ &amp; ¬Deny
      </text>
      <text x="20" y="215" fontSize="11" fontWeight="600" fill={C.ink}>
        퍼블릭 공개 = 버킷 정책 Allow + Block Public Access 해제, 둘 다 필요
      </text>
    </svg>
  );
}

export function ReplicationSvg() {
  return (
    <svg viewBox="0 0 700 190" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="30" y="45" width="200" height="72" rx="12" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="130" y="76" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.teal}>
        원본 버킷
      </text>
      <text x="130" y="96" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        ap-northeast-2 · 버전 관리 ON
      </text>
      <rect x="470" y="45" width="200" height="72" rx="12" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="570" y="76" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.teal}>
        대상 버킷
      </text>
      <text x="570" y="96" textAnchor="middle" fontSize="10" fill={C.inkSoft}>
        us-east-1 · 버전 관리 ON
      </text>
      <line x1="230" y1="81" x2="470" y2="81" stroke={C.amber} strokeWidth="2" />
      <text x="350" y="70" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.amberText}>
        비동기 복제 (IAM 역할 필요 · 다른 계정도 가능)
      </text>
      <text x="30" y="150" fontSize="11" fill={C.ink}>
        CRR(교차 리전): 규정 준수 · 지연 단축 · 계정 간 — SRR(동일 리전): 로그 집계 · 운영↔테스트
      </text>
      <text x="30" y="174" fontSize="11" fontWeight="700" fill={C.red}>
        활성화 이후 새 객체만 복제 (기존 객체 = S3 Batch Replication) · 체이닝 불가(1→2→3 ✗)
      </text>
    </svg>
  );
}

export function EncryptionSvg() {
  return (
    <svg viewBox="0 0 700 150" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="15" y="25" width="160" height="70" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="95" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.teal}>
        SSE-S3 (기본값)
      </text>
      <text x="95" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        S3 관리 키 · AES-256
      </text>
      <rect x="190" y="25" width="160" height="70" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="1.5" />
      <text x="270" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        SSE-KMS
      </text>
      <text x="270" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        KMS 키 · CloudTrail 감사
      </text>
      <rect x="365" y="25" width="160" height="70" rx="10" fill={C.redSoft} stroke={C.red} strokeWidth="1.5" />
      <text x="445" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.red}>
        SSE-C
      </text>
      <text x="445" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        고객 제공 키 · HTTPS 필수
      </text>
      <rect x="540" y="25" width="145" height="70" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="612" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.blue}>
        DSSE-KMS
      </text>
      <text x="612" y="72" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        KMS 이중 암호화 (2023)
      </text>
      <text x="15" y="130" fontSize="10.5" fontFamily="monospace" fill={C.inkSoft}>
        x-amz-server-side-encryption: AES256 | aws:kms | aws:kms:dsse
      </text>
    </svg>
  );
}
