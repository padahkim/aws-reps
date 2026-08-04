"use client";

import { useEffect, useRef } from "react";
import {
  chapterStatus,
  earnsCompletion,
  finalQuizOutcome,
  PASS_PERCENT,
} from "@/lib/progress/completion-core";
import { useReadSections } from "@/lib/progress/read";
import { markChapterCompleted, useProgress } from "@/lib/progress/records";
import { useNow, useReview } from "@/lib/progress/review";
import { dueCount } from "@/lib/progress/review-core";

/**
 * 챕터 완료 배지 (#224) — **홈 챕터 목록과 챕터 목차가 같은 이 컴포넌트를 쓴다**. 판정 자체는
 * `lib/progress/completion-core.ts`(순수·CI 검증)에 있고, 여기는 저장소 셋을 조인해 그 함수에
 * 먹이고 그리는 일만 한다. 설계 정본: LEARNING_LOOP_DRAFT.md §2-3·§2-4.
 *
 * 그리는 것은 셋이고, 셋 다 서로 다른 사실이다:
 * - **완료 / 열람 완료 배지** — "본편을 마쳤나" (D4 가 둘을 구분 표기하라고 정했다).
 * - **"복습 n"** — "지금 뭘 해야 하나". 배지를 **강등하지 않고 옆에 병기**한다 (D5): 완료 후
 *   틀린 게 생겨도 진행률이 오르내리면 완주 동기를 해친다. due 가 0이면 표기 자체가 없다.
 * - **미완료인데 다 읽은 경우의 사유** — 아래 `Hint` 주석 참조 (진단 D-7).
 *
 * **완료 스냅샷(`completedAt`)을 남기는 것도 여기다.** 판정에 필요한 재료(읽음 진도·채점
 * 기록·콘텐츠의 finalQ 목록)가 전부 브라우저에 모이는 자리가 여기뿐이라, 조건을 처음 충족한
 * 순간을 관측할 수 있는 것도 여기다. 저장 자체는 `records.ts` 한 모듈을 경유한다(§4-1).
 */
export function CompletionBadge({
  chapterId,
  sectionTotal,
  finalKeys,
  chapterKeys,
}: {
  chapterId: string;
  /** 읽음 진도의 분모(퀴즈 섹션 포함) — 진도 바와 **같은 값**이어야 아래 힌트가 어긋나지 않는다. */
  sectionTotal: number;
  /** 그 챕터 finalQ 의 전역 키 (lib/question-bank.ts `chapterQuestionKeys`). */
  finalKeys: string[];
  /** 그 챕터 **전 문항**의 전역 키 — "복습 n" 이 세는 모집단. */
  chapterKeys: string[];
}) {
  const readSections = useReadSections(chapterId);
  const { progress, refresh } = useProgress();
  const { review } = useReview();
  const now = useNow();

  const completedAt = progress.chapters[chapterId]?.completedAt;
  const input = { readSections, finalKeys, questions: progress.questions, completedAt };
  const status = chapterStatus(input);
  const outcome = finalQuizOutcome(finalKeys, progress.questions);

  /**
   * 조건을 **처음** 충족한 순간을 잡아 스냅샷을 남긴다 (§4-1: 파생되지 않는 사실).
   *
   * 저장이 늦어도 화면은 이미 맞다 — 위 `status` 는 조건식을 직접 보므로 배지는 이 효과와
   * 무관하게 뜬다. 스냅샷이 하는 일은 **나중에** 그 챕터 문항을 다시 틀렸을 때 배지를 지키는
   * 것이다 (D5). 저장 뒤 `refresh` 로 다시 읽는 이유도 그것이다: 같은 탭의 쓰기에는 storage
   * 이벤트가 오지 않으므로, 다시 읽지 않으면 이 세션 동안만 스냅샷이 없는 상태로 남는다.
   *
   * **마운트당 한 번만 시도한다(`tried`)** — 저장은 실패할 수 있고(프라이빗 모드·용량 초과)
   * 그 실패는 조용하다. 그때 `refresh` 가 매번 새 객체를 물어오면 이 효과의 의존이 바뀌어
   * 스스로를 다시 부른다(저장 실패 → 재조회 → 재실행). 화면이 도는 것을 한 줄로 막는다.
   */
  const tried = useRef(false);
  useEffect(() => {
    if (completedAt !== undefined || tried.current) return;
    if (!earnsCompletion(input)) return;
    tried.current = true;
    markChapterCompleted(chapterId, new Date().toISOString());
    refresh();
    // input 은 렌더마다 새 객체라 의존 목록에 넣을 수 없다 — 그 재료들을 대신 적는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, completedAt, readSections, progress.questions, finalKeys, refresh]);

  // 오답 노트 화면·홈 배지와 **같은 필터**를 통과한 수를 센다 (review-core.ts `active` 주석):
  // 여기서는 `known` 을 그 챕터의 문항으로 좁혀 챕터별 due 를 낸다
  const due = now === null ? 0 : dueCount(review, now, new Set(chapterKeys));
  // 진도 바가 100% 인지 — 콘텐츠 개편으로 섹션이 줄었을 때를 대비해 범위 밖 번호는 버린다
  // (홈 진도 바 `HomeProgress` 와 같은 규칙이어야 두 표시가 어긋나지 않는다)
  const allRead =
    sectionTotal > 0 && readSections.filter((n) => n <= sectionTotal).length >= sectionTotal;

  if (status === "미완료" && !allRead && due === 0) return null;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {status !== "미완료" && <StatusPill status={status} />}
      {status === "미완료" && allRead && (
        <Hint passed={outcome.passed} total={outcome.total} attempted={outcome.attempted} />
      )}
      {due > 0 && (
        <span
          aria-label={`복습할 문항 ${due}개`}
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            borderRadius: 99,
            padding: "1px 8px",
            background: "#F8E4DF",
            color: "#B9432C",
          }}
        >
          복습 {due}
        </span>
      )}
    </span>
  );
}

/**
 * 배지 본체. "완료"만 강조색이고 "열람 완료"는 muted 다 — D4 가 요구한 시각 구분이 이것이다.
 * 퀴즈를 통과한 챕터와 아직 퀴즈가 없어 열람만으로 닫힌 챕터가 같은 무게로 보이면, 구분 표기를
 * 둔 이유(#29 로 들어올 퀴즈 없는 레거시가 다수다) 자체가 사라진다.
 */
function StatusPill({ status }: { status: "열람 완료" | "완료" }) {
  const full = status === "완료";
  return (
    <span
      style={{
        fontSize: "0.75rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
        borderRadius: 99,
        padding: "1px 9px",
        border: `1px solid ${full ? "var(--accent)" : "var(--border)"}`,
        color: full ? "var(--accent)" : "var(--muted)",
      }}
    >
      ✓ {status}
    </span>
  );
}

/**
 * **다 읽었는데 왜 완료가 아닌가**를 그 자리에서 답한다 (진단 D-7 → #224 완료 기준).
 * 진도 바가 100% 인데 배지가 없으면 화면이 두 가지 다른 말을 하는 것처럼 읽힌다 — 진도 바는
 * "본문을 어디까지 봤나"이고 완료는 "퀴즈까지 통과했나"라 실제로 다른 사실인데, 그 차이가
 * 화면 어디에도 안 적혀 있으면 사용자에겐 그냥 고장이다.
 *
 * 분모가 **finalQ 전체**라 목차 퀴즈 줄의 점수 배지("푼 것 중 몇 개")와 수치가 다를 수 있다.
 * 다른 게 맞다 — 그래서 통과선을 같이 적어 이 숫자가 완료 조건임을 드러낸다.
 * 진도 바가 100% 가 아닌 동안에는 띄우지 않는다: 아직 읽는 중인 챕터에 "퀴즈 0/11" 은 재촉일 뿐이다.
 */
function Hint({
  passed,
  total,
  attempted,
}: {
  passed: number;
  total: number;
  attempted: number;
}) {
  return (
    <span
      aria-label={`완료 조건 — 퀴즈 ${total}문항 중 ${attempted}문항 시도, 마지막 시도가 정답인 문항 ${passed}개. 통과선 ${PASS_PERCENT}%`}
      style={{
        fontSize: "0.75rem",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        color: "var(--muted)",
      }}
    >
      <span aria-hidden>
        퀴즈 {passed}/{total} · 완료까지 {PASS_PERCENT}%
      </span>
    </span>
  );
}
