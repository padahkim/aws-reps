"use client";

import Link from "next/link";
import { chapterStatus, finalQuizOutcome, type ChapterStatus } from "@/lib/progress/completion-core";
import { countsAsDone, domainCoverage } from "@/lib/progress/coverage-core";
import { useReadMap } from "@/lib/progress/read";
import { useProgress } from "@/lib/progress/records";
import { useNow, useReview } from "@/lib/progress/review";
import { dueCount } from "@/lib/progress/review-core";
import type { ChapterQuestionKeys } from "@/lib/question-bank";

/**
 * 홈 상단 진도 대시보드 (#235) — 설계 §3-3 이 고정한 3지표(전체 진행률·오늘의 복습·도메인
 * 커버리지) + 챕터별 정답률(#86 코멘트, spike #148 신규 입력 3 — 약한 챕터 식별). 여기서
 * 지표를 더 늘리지 않는다: "대시보드는 '다음 행동' 결정용 3개로 끝내고, 진단 상세는 행동하러
 * 들어간 화면에서" — 약점 개념 Top N 도 그래서 오답 노트 소속이다(§3-3).
 *
 * 계산은 전부 기존 층의 재사용이고 저장하는 값은 없다(§4-1 — 파생값은 런타임 조인):
 * - 챕터 판정 = `completion-core.chapterStatus` — 완료 배지와 **같은 함수**라 배지와 진행률이
 *   어긋날 수 없다. 스냅샷(`completedAt`)을 남기는 쪽은 배지(`CompletionBadge`)이고 여기는
 *   읽기만 한다 — 조건식을 직접 보므로 저장이 늦어도 수치는 이미 맞다.
 * - 오늘의 복습 = `dueCount` — 헤더의 `ReviewLink` 배지와 **같은 집합**(전 문항 키)을 센다.
 *   같은 숫자가 두 곳에 뜨는 것은 설계 그대로다: §1-3 이 "내비게이션의 오답 노트 항목**과**
 *   대시보드에" 두라고 했다 — 내비는 진입점, 여기는 행동 유도 지표.
 * - 정답률 재료 = `finalQuizOutcome` — 이름은 finalQ 지만 키 목록에 범용인 집계라 챕터 **전
 *   문항**(`keys.all`)을 넘겨 재사용한다. 기준은 문항별 **마지막 시도**(§2-2 "최근 시도 기준"
 *   과 같은 취지) — 재응시로 교정한 문항을 계속 오답으로 세지 않는다. 셀프 퀴즈(자기채점)는
 *   모집단에 없다 — `question-bank` 가 챕터 quiz 만 색인하므로 객관 채점 문항만 남는다.
 */

/**
 * 도메인 표시명·시험 비중 (docs/CURRICULUM.md §2: Domain 1 개발 32% / 2 보안 26% / 3 배포
 * 24% / 4 트러블슈팅·최적화 18%). 커버리지를 시험 비중과 **병렬 표기**하는 것이 §3-2 의
 * 요구다 — "시험 비중 대비 구멍이 어디인가"가 이 지표의 존재 이유라서다.
 * 여기 없는 도메인(`foundation` 등)은 meta 값 그대로 비중 없이 표기한다(§3-2 — 재분류 금지).
 */
const DOMAIN_LABELS: Record<string, { label: string; examShare: string }> = {
  Development: { label: "Domain 1 · 개발", examShare: "32%" },
  Security: { label: "Domain 2 · 보안", examShare: "26%" },
  Deployment: { label: "Domain 3 · 배포", examShare: "24%" },
  Troubleshooting: { label: "Domain 4 · 트러블슈팅·최적화", examShare: "18%" },
};

const KOR_DOMAIN: Record<string, string> = { foundation: "0단계 · 기반" };

export function HomeDashboard({
  chapters,
  keys,
}: {
  /** 레지스트리 순서 그대로 — 이 순서가 커버리지 줄 순서가 된다 (coverage-core 주석). */
  chapters: { id: string; title: string; domain: string }[];
  /** `chapterQuestionKeys()` — 완료 배지·복습 배지와 같은 단일 출처의 키 색인. */
  keys: Record<string, ChapterQuestionKeys>;
}) {
  const readMap = useReadMap(chapters.map((c) => c.id));
  const { progress } = useProgress();
  const { review } = useReview();
  const now = useNow();

  const statusById: Record<string, ChapterStatus> = {};
  for (const { id } of chapters) {
    statusById[id] = chapterStatus({
      readSections: readMap[id] ?? [],
      finalKeys: keys[id]?.final ?? [],
      questions: progress.questions,
      completedAt: progress.chapters[id]?.completedAt,
    });
  }

  const done = chapters.filter((c) => countsAsDone(statusById[c.id])).length;
  const total = chapters.length;

  // ReviewLink 와 같은 모집단(전 문항 키) — 배지와 이 지표가 다른 수를 보이면 안 된다
  const allKeys = chapters.flatMap((c) => keys[c.id]?.all ?? []);
  const due = now === null ? 0 : dueCount(review, now, new Set(allKeys));

  const coverage = domainCoverage(chapters, statusById);

  // 시도가 있는 챕터만 — 손대지 않은 챕터에 0% 를 붙이면 "약한 챕터"와 "안 본 챕터"가 섞인다
  const accuracy = chapters.flatMap((c) => {
    const outcome = finalQuizOutcome(keys[c.id]?.all ?? [], progress.questions);
    return outcome.attempted > 0 ? [{ ...c, ...outcome }] : [];
  });

  return (
    <section
      aria-label="학습 진도 대시보드"
      style={{
        marginBottom: "2rem",
        padding: "0.9rem 1rem",
        border: "1px solid var(--border)",
        borderRadius: 10,
        display: "grid",
        gap: "0.75rem",
      }}
    >
      {/* 지표 1 — 전체 진행률 (§3-1: 무가중, "열람 완료" 포함) */}
      <Metric label="전체 진행률">
        <BarWithNum pct={total > 0 ? Math.round((done / total) * 100) : 0}>
          {done}/{total} 챕터
        </BarWithNum>
      </Metric>

      {/* 지표 2 — 오늘의 복습 (§1-3: 유일한 행동 유도 지표라 /review 링크가 본체다) */}
      <Metric label="오늘의 복습">
        {due > 0 ? (
          <Link href="/review" style={{ fontWeight: 700 }}>
            {due}문항 풀러 가기 →
          </Link>
        ) : (
          <Num>0문항 — 복습할 게 없습니다</Num>
        )}
      </Metric>

      {/* 지표 3 — 도메인 커버리지 (§3-2: 시험 비중과 병렬 표기) */}
      <Metric label="도메인 커버리지">
        <div style={{ display: "grid", gap: 4 }}>
          {coverage.map(({ domain, done: d, total: t }) => (
            <div key={domain} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", minWidth: "9.5rem" }}>
                {DOMAIN_LABELS[domain]?.label ?? KOR_DOMAIN[domain] ?? domain}
                {DOMAIN_LABELS[domain] && (
                  <span style={{ color: "var(--muted)" }}> (시험 {DOMAIN_LABELS[domain].examShare})</span>
                )}
              </span>
              <BarWithNum pct={t > 0 ? Math.round((d / t) * 100) : 0}>
                {d}/{t}
              </BarWithNum>
            </div>
          ))}
        </div>
      </Metric>

      {/* 챕터별 정답률 (#86 신규 입력 3) — 마지막 시도 기준. 시도 없는 챕터는 줄 자체가 없다 */}
      {accuracy.length > 0 && (
        <Metric label="챕터별 정답률">
          <div style={{ display: "grid", gap: 4 }}>
            {accuracy.map(({ id, title, attempted, passed }) => (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Link href={`/chapters/${id}`} style={{ fontSize: "0.8rem", minWidth: "9.5rem" }}>
                  {id} · {title}
                </Link>
                <BarWithNum pct={Math.round((passed / attempted) * 100)}>
                  {passed}/{attempted} 문항
                </BarWithNum>
              </div>
            ))}
          </div>
        </Metric>
      )}
    </section>
  );
}

/** 라벨 + 내용 한 줄 — 지표 4개가 같은 리듬으로 읽히게 하는 틀. */
function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.02em" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

/**
 * 바 + 수치 한 덩어리 — 좁은 화면에서 라벨만 다음 줄로 밀리고 바와 수치는 **함께** 남게
 * 붙여 둔다 (모바일 확인에서 수치만 따로 떨어져 어색했다).
 */
function BarWithNum({ pct, children }: { pct: number; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
      <Bar pct={pct} />
      <Num>{children}</Num>
    </span>
  );
}

/**
 * 미니 바 — `ProgressBar` 를 재사용하지 않는 이유: 저쪽은 "pct% (done/total)" 문구까지 한
 * 덩어리라, 단위가 "챕터"·"문항"으로 갈리는 이 화면에서는 문구를 밖에서 붙여야 한다.
 * 시각 규칙(높이·색·radius)은 저쪽과 같게 유지한다 — 두 바가 다른 물건으로 보이면 안 된다.
 */
function Bar({ pct }: { pct: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 120,
        maxWidth: "40vw",
        height: 6,
        borderRadius: 99,
        background: "var(--border)",
        overflow: "hidden",
      }}
    >
      <span style={{ display: "block", width: `${pct}%`, height: "100%", background: "var(--accent)" }} />
    </span>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "0.8rem",
        color: "var(--muted)",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
