//fable xhigh - 이 녀석은 간이 개념테스트로 매우좋음 - 학습한 후 그 챕터의 간이 테스트로 사용

import { useState } from "react";

/* ============================================================
   AWS DVA 학습 세션 템플릿 — Ch.1 서버리스 핵심 흐름
   ------------------------------------------------------------
   다음 세션부터는 아래 CHAPTER 객체의 "데이터만" 교체하면 됩니다.
   컴포넌트 구조·스타일은 그대로 재사용 (병합 시 스타일 통일 보장).

   교육학 원리 → 컴포넌트 동작 매핑
   · 인출연습   → 모든 카드 기본상태 = 질문만 보임, 탭해야 정답
   · 이중부호화 → 흐름 개념은 인터랙티브 SVG 도식 (역할→서비스명 인출)
   · 자기설명   → 퀴즈 정답 확인 후, 오답 이유를 말해야 해설 열림
   · 정교화     → 각 개념에 "왜?" 후속 질문 포함
   · 교차학습   → 세션 끝 혼합복습: 헷갈리는 인접 서비스 섞어 출제
   ============================================================ */

const CHAPTER = {
  line: "1",
  eyebrow: "AWS DVA · 학습 세션",
  title: "서버리스 핵심 흐름",
  subtitle: "Lambda · API Gateway · DynamoDB",

  concepts: [
    {
      id: "c1",
      q: "Lambda 콜드 스타트는 언제 발생하고, 지연을 줄이는 방법 3가지는?",
      a: "새 실행 환경을 처음 초기화할 때(첫 호출, 스케일아웃, 오랜 유휴 후) 발생합니다. 완화책: ① Provisioned Concurrency로 실행 환경을 미리 데워두기 ② 배포 패키지 경량화·초기화 코드 최소화 ③ Java/.NET은 SnapStart 활용.",
      why: "왜 메모리를 올리면 콜드 스타트도 짧아질까? — Lambda는 메모리에 비례해 CPU를 할당하므로 초기화 코드 실행 자체가 빨라지기 때문.",
    },
    {
      id: "c2",
      q: "DynamoDB 강한 일관성 읽기 vs 최종 일관성 읽기 — 차이와 비용은?",
      a: "강한 일관성(ConsistentRead=true)은 가장 최근 쓰기를 항상 반영하지만 RCU를 2배 소비하고 지연이 약간 큽니다. 최종 일관성(기본값)은 절반의 RCU로 읽지만 직전 쓰기가 반영되지 않았을 수 있습니다.",
      why: "왜 기본값이 최종 일관성일까? — 다중 AZ 복제 구조에서 모든 복제본 동기화를 기다리지 않아야 처리량과 지연 모두 유리하기 때문.",
    },
    {
      id: "c3",
      q: "API Gateway의 Lambda 프록시 통합과 비프록시 통합의 차이는?",
      a: "프록시 통합은 요청 전체(헤더·경로·쿼리·바디)를 정해진 이벤트 형식으로 Lambda에 그대로 전달하고, 응답 형식(statusCode·headers·body)도 코드가 책임집니다. 비프록시는 매핑 템플릿(VTL)으로 요청·응답을 API Gateway 단에서 변환합니다.",
      why: "왜 시험은 프록시 통합을 선호하는 답을 자주 낼까? — 매핑 템플릿 관리 부담 없이 빠르게 구축하는 것이 서버리스 모범 사례 시나리오와 맞아떨어지기 때문.",
    },
    {
      id: "c4",
      q: "Reserved Concurrency와 Provisioned Concurrency는 각각 무엇을 해결하나?",
      a: "Reserved는 함수의 동시 실행 '상한'을 예약·제한해 다른 함수의 폭주로부터 보호하고 다운스트림 과부하를 막습니다(무료). Provisioned는 실행 환경을 '미리 초기화'해 콜드 스타트를 제거합니다(유료).",
      why: "왜 Reserved만으로는 지연 문제가 해결되지 않을까? — 상한을 정해도 새 환경 초기화 자체는 그대로 일어나기 때문. 목적이 다르다: 하나는 제한, 하나는 예열.",
    },
  ],

  diagram: {
    prompt:
      "각 상자의 '역할'만 보고 어떤 서비스인지 먼저 답한 뒤, 탭해서 확인하세요. (백지 재현 훈련)",
    nodes: [
      { id: "d1", role: "모바일/웹에서 요청 발신", name: "클라이언트" },
      {
        id: "d2",
        role: "요청 수신 · 인증 · 스로틀링 · 라우팅",
        name: "API Gateway",
      },
      { id: "d3", role: "이벤트 기반으로 코드 실행", name: "Lambda" },
      { id: "d4", role: "밀리초 키-값 저장 · 온디맨드 확장", name: "DynamoDB" },
      {
        id: "d5",
        role: "항목 변경을 순서대로 캡처한 스트림",
        name: "DynamoDB Streams",
      },
      {
        id: "d6",
        role: "스트림을 트리거로 비동기 후속 처리",
        name: "Lambda (트리거)",
      },
    ],
    edges: [
      "HTTPS",
      "프록시 통합 이벤트",
      "AWS SDK 호출",
      "변경 캡처",
      "이벤트 소스 매핑",
    ],
  },

  quizzes: [
    {
      id: "q1",
      scenario:
        "간헐적 트래픽 스파이크 때마다 Lambda가 수백 개로 스케일아웃되어 다운스트림 RDS 커넥션이 고갈됩니다. 아키텍처를 크게 바꾸지 않고 완화하려면?",
      options: [
        {
          t: "Lambda 동시성 제한을 해제해 처리량을 높인다",
          why: "동시성을 늘리면 RDS로 향하는 커넥션이 오히려 더 늘어나 문제가 악화됩니다.",
        },
        {
          t: "SQS 큐를 버퍼로 두고 Lambda가 제한된 동시성으로 폴링한다",
          why: "정답. 큐가 스파이크를 흡수하고, Reserved Concurrency로 소비 속도를 제한하면 다운스트림이 감당 가능한 속도로 평탄화됩니다.",
        },
        {
          t: "API Gateway 캐싱을 켠다",
          why: "캐싱은 읽기 응답에만 유효합니다. 쓰기 작업이나 매번 다른 요청에는 스파이크 완화 효과가 없습니다.",
        },
        {
          t: "RDS를 DynamoDB로 마이그레이션한다",
          why: "효과는 있겠지만 '아키텍처를 크게 바꾸지 않고'라는 제약을 위반합니다. 시험은 제약 조건 독해를 요구합니다.",
        },
      ],
      answer: 1,
    },
    {
      id: "q2",
      scenario:
        "결제 API의 p99 지연이 콜드 스타트 때문에 SLA를 초과합니다. 가장 직접적인 해결책은?",
      options: [
        {
          t: "함수 타임아웃을 늘린다",
          why: "타임아웃은 실패 여부만 바꿀 뿐, 초기화에 걸리는 시간 자체는 그대로입니다.",
        },
        {
          t: "Reserved Concurrency를 설정한다",
          why: "동시 실행 상한을 정하는 기능입니다. 새 환경의 초기화 지연은 제거하지 못합니다.",
        },
        {
          t: "Provisioned Concurrency를 설정한다",
          why: "정답. 실행 환경을 미리 초기화해 두므로 요청이 예열된 환경으로 바로 라우팅됩니다.",
        },
        {
          t: "메모리 크기를 낮춰 비용을 절감한다",
          why: "메모리를 낮추면 CPU도 줄어 초기화가 오히려 느려집니다. 지연 문제에 역행합니다.",
        },
      ],
      answer: 2,
    },
  ],

  mixed: [
    {
      id: "m1",
      scenario: "하나의 이벤트를 여러 구독자에게 '즉시 푸시'로 팬아웃해야 한다",
      service: "SNS",
      why: "푸시 기반 pub/sub. 구독자(SQS·Lambda·HTTP)에게 동시에 전달.",
      contrast:
        "SQS와 달리 소비자가 폴링하지 않고, 메시지를 보관·재생하지 않는다.",
    },
    {
      id: "m2",
      scenario:
        "초당 수천 건의 레코드를 '순서 보장 + 재생(replay)' 가능하게 여러 소비자가 읽어야 한다",
      service: "Kinesis Data Streams",
      why: "샤드 단위 순서 보장, 보존 기간 내 여러 소비자가 같은 데이터를 반복 읽기 가능.",
      contrast: "SQS는 읽고 삭제하면 끝 — 재생이 없다. SNS는 보관 자체가 없다.",
    },
    {
      id: "m3",
      scenario:
        "생산자와 소비자를 느슨하게 결합하고, 소비자가 자기 속도로 가져가 실패 시 재시도해야 한다",
      service: "SQS",
      why: "풀(폴링) 기반 큐. 가시성 타임아웃 + DLQ로 안전한 재처리.",
      contrast:
        "Kinesis처럼 다중 소비자 재생이 필요 없다면 SQS가 더 단순하고 저렴.",
    },
    {
      id: "m4",
      scenario:
        "AWS 서비스·SaaS 이벤트를 '규칙 기반으로 라우팅'하거나 스케줄로 트리거해야 한다",
      service: "EventBridge",
      why: "이벤트 버스 + 패턴 매칭 규칙 + 스케줄러. 서비스 간 이벤트 허브.",
      contrast:
        "SNS는 토픽 단위 팬아웃, EventBridge는 내용 기반 필터링·라우팅이 강점.",
    },
  ],
};

/* ================= 디자인 토큰 (모든 세션 공통) ================= */
const C = {
  bg: "#161D25",
  surface: "#1F2A35",
  surface2: "#293643",
  border: "#37475A",
  text: "#EBF1F6",
  dim: "#93A3B2",
  orange: "#FFA033",
  orangeBg: "rgba(255,160,51,0.13)",
  mint: "#5CD6A3",
  mintBg: "rgba(92,214,163,0.12)",
  red: "#F0687F",
  redBg: "rgba(240,104,127,0.12)",
  blue: "#7CB8E8",
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard', 'Noto Sans KR', sans-serif";

/* ================= 공용 소품 ================= */

function PrincipleTag({ children }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: 1,
        color: C.orange,
        background: C.orangeBg,
        border: `1px solid rgba(255,160,51,0.35)`,
        borderRadius: 999,
        padding: "3px 9px",
      }}
    >
      {children}
    </span>
  );
}

/* 지하철 역명판 스타일 섹션 헤더 */
function StationSign({ num, title, tag, sub }) {
  return (
    <div style={{ margin: "40px 0 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.surface,
          border: `2px solid ${C.orange}`,
          borderRadius: 999,
          padding: "8px 14px 8px 8px",
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            minWidth: 30,
            borderRadius: "50%",
            background: C.orange,
            color: "#1A1208",
            fontFamily: MONO,
            fontWeight: 800,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {num}
        </span>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>
          {title}
        </span>
        <span style={{ marginLeft: "auto" }}>
          <PrincipleTag>{tag}</PrincipleTag>
        </span>
      </div>
      {sub && (
        <p
          style={{
            color: C.dim,
            fontSize: 12.5,
            lineHeight: 1.6,
            margin: "10px 4px 0",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* 진행 상황 — 노선도 레일 */
function ProgressRail({ stations }) {
  return (
    <div style={{ margin: "22px 0 6px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {stations.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i === 0 ? "0 0 auto" : "1 1 0",
            }}
          >
            {i > 0 && (
              <div
                style={{
                  height: 3,
                  flex: 1,
                  background: s.frac > 0 ? C.orange : C.border,
                  transition: "background .3s",
                }}
              />
            )}
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `3px solid ${s.frac >= 1 ? C.orange : C.border}`,
                background:
                  s.frac >= 1 ? C.orange : s.frac > 0 ? C.orangeBg : C.bg,
                transition: "all .3s",
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 7,
        }}
      >
        {stations.map((s) => (
          <div
            key={s.label}
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: s.frac >= 1 ? C.orange : C.dim,
            }}
          >
            {s.label} {s.done}/{s.total}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= ① 개념 카드 (인출연습 + 정교화) ================= */
function ConceptCard({ item, index, opened, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: C.surface,
        border: `1px solid ${opened ? C.orange : C.border}`,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        color: C.text,
        fontFamily: SANS,
        cursor: "pointer",
        transition: "border-color .25s",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: C.orange,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        인출 Q{index + 1}
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.55 }}>
        {item.q}
      </div>
      {!opened ? (
        <div
          style={{
            marginTop: 12,
            fontSize: 12.5,
            color: C.dim,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.orange,
              display: "inline-block",
            }}
          />
          먼저 소리 내어(속으로) 답해보세요 — 탭하면 정답
        </div>
      ) : (
        <div style={{ marginTop: 14 }}>
          <p
            style={{ fontSize: 14, lineHeight: 1.75, color: C.text, margin: 0 }}
          >
            {item.a}
          </p>
          <div
            style={{
              marginTop: 12,
              borderLeft: `3px solid ${C.orange}`,
              background: C.orangeBg,
              borderRadius: "0 10px 10px 0",
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: C.orange,
                letterSpacing: 1,
                marginBottom: 5,
              }}
            >
              WHY — 정교화 질문
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: C.text,
                margin: 0,
              }}
            >
              {item.why}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}

/* ================= ② 인터랙티브 도식 (이중부호화 + 인출) ================= */
function FlowDiagram({ data, revealed, onReveal, onRevealAll, onHideAll }) {
  const NODE_H = 58;
  const GAP = 40;
  const W = 340;
  const nodes = data.nodes;
  const totalH = 16 + nodes.length * NODE_H + (nodes.length - 1) * GAP + 16;
  const allOpen = nodes.every((n) => revealed[n.id]);

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "14px 10px 6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 8px 4px",
        }}
      >
        <button
          onClick={allOpen ? onHideAll : onRevealAll}
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: C.dim,
            background: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: 999,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          {allOpen ? "다시 숨기기 ↺" : "모두 공개"}
        </button>
      </div>
      <svg
        viewBox={`0 0 ${W} ${totalH}`}
        style={{ width: "100%", display: "block" }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.orange} />
          </marker>
        </defs>
        {nodes.map((n, i) => {
          const y = 16 + i * (NODE_H + GAP);
          const open = !!revealed[n.id];
          return (
            <g key={n.id}>
              {i > 0 && (
                <>
                  <line
                    x1={W / 2}
                    y1={y - GAP + 4}
                    x2={W / 2}
                    y2={y - 6}
                    stroke={C.orange}
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={W / 2 + 12}
                    y={y - GAP / 2 + 3}
                    fontSize="10"
                    fontFamily={MONO}
                    fill={C.dim}
                  >
                    {data.edges[i - 1]}
                  </text>
                </>
              )}
              <g onClick={() => onReveal(n.id)} style={{ cursor: "pointer" }}>
                <rect
                  x={20}
                  y={y}
                  width={W - 40}
                  height={NODE_H}
                  rx={12}
                  fill={open ? C.surface2 : C.bg}
                  stroke={open ? C.orange : C.border}
                  strokeWidth="1.5"
                />
                <text
                  x={34}
                  y={y + 22}
                  fontSize="11"
                  fill={C.dim}
                  fontFamily={SANS}
                >
                  {n.role}
                </text>
                {open ? (
                  <text
                    x={34}
                    y={y + 44}
                    fontSize="15"
                    fontWeight="700"
                    fill={C.orange}
                    fontFamily={MONO}
                  >
                    {n.name}
                  </text>
                ) : (
                  <text
                    x={34}
                    y={y + 44}
                    fontSize="12"
                    fill={C.blue}
                    fontFamily={MONO}
                  >
                    ? 탭해서 서비스명 인출
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ================= ③ 시나리오 퀴즈 (자기설명 게이트) ================= */
function QuizCard({ quiz, index, state, onSelect, onExplain }) {
  const { selected, explained } = state;
  const answered = selected !== null && selected !== undefined;

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: C.orange,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        실전 시나리오 {index + 1}
      </div>
      <p
        style={{
          fontSize: 14.5,
          fontWeight: 700,
          lineHeight: 1.65,
          margin: "0 0 14px",
        }}
      >
        {quiz.scenario}
      </p>

      {quiz.options.map((op, i) => {
        const isCorrect = i === quiz.answer;
        const isSelected = selected === i;
        let border = C.border;
        let bg = C.bg;
        if (answered && isCorrect) {
          border = C.mint;
          bg = C.mintBg;
        } else if (answered && isSelected && !isCorrect) {
          border = C.red;
          bg = C.redBg;
        }
        return (
          <div key={i} style={{ marginBottom: 8 }}>
            <button
              onClick={() => !answered && onSelect(i)}
              disabled={answered}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: 12,
                padding: "13px 14px",
                color: C.text,
                fontFamily: SANS,
                fontSize: 13.5,
                lineHeight: 1.6,
                cursor: answered ? "default" : "pointer",
                transition: "all .2s",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  color: answered && isCorrect ? C.mint : C.dim,
                  marginRight: 8,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {op.t}
              {answered && isCorrect && (
                <span
                  style={{ fontFamily: MONO, color: C.mint, marginLeft: 8 }}
                >
                  ✓
                </span>
              )}
              {answered && isSelected && !isCorrect && (
                <span style={{ fontFamily: MONO, color: C.red, marginLeft: 8 }}>
                  ✕
                </span>
              )}
            </button>
            {explained && (
              <p
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  color: isCorrect ? C.mint : C.dim,
                  margin: "6px 4px 0 24px",
                }}
              >
                {op.why}
              </p>
            )}
          </div>
        );
      })}

      {answered && !explained && (
        <div
          style={{
            marginTop: 12,
            borderLeft: `3px solid ${C.blue}`,
            background: "rgba(124,184,232,0.10)",
            borderRadius: "0 10px 10px 0",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: C.blue,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            자기설명 체크포인트
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 10px" }}>
            잠깐 — 해설을 열기 전에, 나머지 선택지가 <b>왜 틀렸는지</b> 각각 한
            문장으로 설명해보세요. 설명이 막히는 선택지가 오늘의 약점입니다.
          </p>
          <button
            onClick={onExplain}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "#10202E",
              background: C.blue,
              border: "none",
              borderRadius: 999,
              padding: "9px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            설명했어요 — 해설 열기
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= ④ 혼합복습 (교차학습) ================= */
function MixedCard({ item, opened, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: C.surface,
        border: `1px solid ${opened ? C.mint : C.border}`,
        borderRadius: 14,
        padding: 15,
        marginBottom: 10,
        color: C.text,
        fontFamily: SANS,
        cursor: "pointer",
        transition: "border-color .25s",
      }}
    >
      <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.6 }}>
        {item.scenario}{" "}
        <span style={{ color: C.dim, fontWeight: 400 }}>— 어떤 서비스?</span>
      </div>
      {!opened ? (
        <div style={{ marginTop: 8, fontSize: 12, color: C.dim }}>
          답을 정한 뒤 탭
        </div>
      ) : (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 15,
              fontWeight: 800,
              color: C.mint,
              marginBottom: 6,
            }}
          >
            {item.service}
          </div>
          <p
            style={{
              fontSize: 12.5,
              lineHeight: 1.65,
              color: C.text,
              margin: "0 0 6px",
            }}
          >
            {item.why}
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: C.dim, margin: 0 }}>
            구분 포인트 · {item.contrast}
          </p>
        </div>
      )}
    </button>
  );
}

/* ================= 메인 ================= */
export default function DvaChapter() {
  const [conceptOpen, setConceptOpen] = useState({});
  const [nodeOpen, setNodeOpen] = useState({});
  const [quizState, setQuizState] = useState(
    Object.fromEntries(
      CHAPTER.quizzes.map((q) => [q.id, { selected: null, explained: false }]),
    ),
  );
  const [mixedOpen, setMixedOpen] = useState({});

  const cDone = Object.keys(conceptOpen).length;
  const dDone = Object.keys(nodeOpen).length;
  const qDone = Object.values(quizState).filter((s) => s.explained).length;
  const mDone = Object.keys(mixedOpen).length;

  const stations = [
    {
      label: "개념",
      done: cDone,
      total: CHAPTER.concepts.length,
      frac: cDone / CHAPTER.concepts.length,
    },
    {
      label: "도식",
      done: dDone,
      total: CHAPTER.diagram.nodes.length,
      frac: dDone / CHAPTER.diagram.nodes.length,
    },
    {
      label: "실전",
      done: qDone,
      total: CHAPTER.quizzes.length,
      frac: qDone / CHAPTER.quizzes.length,
    },
    {
      label: "혼합",
      done: mDone,
      total: CHAPTER.mixed.length,
      frac: mDone / CHAPTER.mixed.length,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: SANS,
        color: C.text,
      }}
    >
      <div
        style={{ maxWidth: 460, margin: "0 auto", padding: "28px 18px 60px" }}
      >
        {/* 헤더 */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 2,
            color: C.dim,
          }}
        >
          {CHAPTER.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: 15,
              color: "#1A1208",
              background: C.orange,
              borderRadius: 8,
              padding: "3px 9px",
            }}
          >
            CH.{CHAPTER.line}
          </span>
          <h1
            style={{
              fontSize: 25,
              fontWeight: 800,
              letterSpacing: -0.6,
              margin: 0,
            }}
          >
            {CHAPTER.title}
          </h1>
        </div>
        <div
          style={{ fontFamily: MONO, fontSize: 12, color: C.dim, marginTop: 8 }}
        >
          {CHAPTER.subtitle}
        </div>

        <ProgressRail stations={stations} />

        {/* ① 개념 */}
        <StationSign
          num="1"
          title="개념 인출"
          tag="RETRIEVAL"
          sub="정답을 읽기 전에 반드시 먼저 답합니다. 틀려도 됩니다 — 틀린 인출 시도 자체가 기억을 강화합니다."
        />
        {CHAPTER.concepts.map((c, i) => (
          <ConceptCard
            key={c.id}
            item={c}
            index={i}
            opened={!!conceptOpen[c.id]}
            onOpen={() => setConceptOpen((s) => ({ ...s, [c.id]: true }))}
          />
        ))}

        {/* ② 도식 */}
        <StationSign
          num="2"
          title="흐름 재현"
          tag="DUAL-CODING"
          sub={CHAPTER.diagram.prompt}
        />
        <FlowDiagram
          data={CHAPTER.diagram}
          revealed={nodeOpen}
          onReveal={(id) => setNodeOpen((s) => ({ ...s, [id]: true }))}
          onRevealAll={() =>
            setNodeOpen(
              Object.fromEntries(
                CHAPTER.diagram.nodes.map((n) => [n.id, true]),
              ),
            )
          }
          onHideAll={() => setNodeOpen({})}
        />

        {/* ③ 실전 */}
        <StationSign
          num="3"
          title="실전 시나리오"
          tag="SELF-EXPLAIN"
          sub="DVA는 '무엇을 아는가'가 아니라 '어떤 제약에서 무엇을 고르는가'를 묻습니다. 오답의 이유까지 설명해야 해설이 열립니다."
        />
        {CHAPTER.quizzes.map((q, i) => (
          <QuizCard
            key={q.id}
            quiz={q}
            index={i}
            state={quizState[q.id]}
            onSelect={(sel) =>
              setQuizState((s) => ({
                ...s,
                [q.id]: { ...s[q.id], selected: sel },
              }))
            }
            onExplain={() =>
              setQuizState((s) => ({
                ...s,
                [q.id]: { ...s[q.id], explained: true },
              }))
            }
          />
        ))}

        {/* ④ 혼합복습 */}
        <StationSign
          num="4"
          title="혼합복습"
          tag="INTERLEAVING"
          sub="헷갈리는 인접 서비스를 섞어서 '구분 능력'을 훈련합니다. 다음 챕터부터는 이전 챕터 문항이 여기에 누적됩니다."
        />
        {CHAPTER.mixed.map((m) => (
          <MixedCard
            key={m.id}
            item={m}
            opened={!!mixedOpen[m.id]}
            onOpen={() => setMixedOpen((s) => ({ ...s, [m.id]: true }))}
          />
        ))}

        {/* 세션 마무리 */}
        <div
          style={{
            marginTop: 36,
            background: C.surface,
            border: `1px dashed ${C.border}`,
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: C.orange,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            세션 마무리 (SPACING)
          </div>
          <p
            style={{ fontSize: 13, lineHeight: 1.75, color: C.dim, margin: 0 }}
          >
            내리기 전에: 오늘 설명이 막혔던 개념{" "}
            <b style={{ color: C.text }}>3개</b>를 학습 로그에 적으세요. 그
            3개는 다음 세션 요청 시 붙여넣어 혼합복습에 섞고, Anki 카드로도
            만들어 1일 · 3일 · 7일 간격으로 다시 인출합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
