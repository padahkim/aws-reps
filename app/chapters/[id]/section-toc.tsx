"use client";

import Link from "next/link";
import { useReadSections } from "@/lib/progress/read";
import { useQuestionRecords, type QuestionRecord } from "@/lib/progress/records";
import { CompletionBadge } from "../../completion-badge";
import { ProgressBar } from "../../progress-bar";
import { VisuallyHidden } from "../../visually-hidden";

/** 목차 한 줄에 필요한 직렬화 가능 데이터 — 서버(page.tsx)가 meta.sections에서 만들어 내려준다. */
export interface TocItem {
  sec: number;   // 섹션 페이지 URL 번호 (1-based, 퀴즈 = 마지막)
  num: string;   // 표기 번호 "01".."NN", 퀴즈는 "Q"
  title: string;
  sub: string;
  freq?: "hi" | "mid" | "lo";   // 빈출도 (#161 — 데이터는 v2부터 있었으나 목차에 안 보였다). 퀴즈 줄은 없음
  /**
   * 점수 배지가 셀 문항의 **전역 키** (#66 — 안정 식별자였던 것을 #224 에서 키로 바꿨다).
   * 퀴즈/마무리 세션 줄에만 있다. 키를 서버가 합성해 내려보내는 이유: 이 목록이 완료 판정의
   * finalQ 분모와 **같은 집합**이어야 하는데, 두 곳에서 각자 `scope === "final"` 을 걸고 각자
   * 키를 합성하면 언젠가 한쪽만 고쳐진다 (lib/question-bank.ts `chapterQuestionKeys`).
   */
  quizKeys?: string[];
}

/**
 * 목차의 한 묶음 (규약 v3.1) — label 이 있으면 파트 그룹 헤더가 붙는다.
 * parts 가 없는 챕터는 label 없는 그룹 하나 = 예전과 같은 평평한 목차.
 */
export interface TocGroup {
  label?: string;     // "파트 2 — 호출 방식 세 가지"
  minutes?: number;   // 이 파트를 도는 데 걸리는 대략의 분 (label 이 있을 때만 표시된다)
  items: TocItem[];
}

const FILLED: Record<"hi" | "mid" | "lo", number> = { hi: 3, mid: 2, lo: 1 };

/**
 * 빈출 별점 — 색 배지가 아니라 별로 낸다 (본문 <Sec> 의 컬러 배지와 역할이 겹치지 않게,
 * 목차는 훑기용). 빈 자리를 ☆ 로 두는 이유: 색만 흐리게 하면 텍스트로 뽑았을 때
 * ★☆☆ 섹션도 "★★★" 로 읽힌다.
 *
 * 낭독은 별이 아니라 **숨은 글자**가 맡는다 (#253). 예전에는 바깥 span 에 `aria-label` 을
 * 걸었는데 그건 동작하지 않았다 — 밋밋한 span 의 암묵 role 은 `generic` 이고 ARIA 는
 * generic 에 author 이름 부여를 금지하므로, 라벨은 못 읽히고 `aria-hidden` 만 확실히 먹어
 * 별점이 통째로 사라졌다. 여기는 글자를 그대로 노출하는 처방(#252)이 안 통하는 자리다:
 * "★★☆" 는 낭독되면 기호 이름("검은 별 검은 별 흰 별")이라 뜻이 서지 않는다. 그래서 별은
 * 장식으로 숨기고 등급을 말로 낸다 — 3단 척도라는 사실까지 실려야 2가 상인지 중인지가 선다.
 */
function FreqStars({ freq }: { freq: "hi" | "mid" | "lo" }) {
  const filled = FILLED[freq];
  return (
    <span style={{ fontSize: "0.8rem", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      <VisuallyHidden>빈출 3단계 중 {filled}단계</VisuallyHidden>
      <span aria-hidden style={{ color: "var(--fg)" }}>{"★".repeat(filled)}</span>
      <span aria-hidden style={{ color: "var(--border)" }}>{"☆".repeat(3 - filled)}</span>
    </span>
  );
}

/**
 * 퀴즈 점수 — 저장된 점수가 아니라 문항별 마지막 결과의 런타임 집계다 (설계 §4-1: 파생 가능한
 * 값은 저장하지 않는다). 그래서 "다시 풀기" 후 재채점한 결과가 별도 갱신 없이 그대로 반영된다.
 *
 * 분모는 문항 전체가 아니라 **푼 문항 수**다 (#66): 11문항 중 3개만 풀고 나온 상태를 "2/11"로
 * 보여주면 안 푼 8개를 틀린 것처럼 읽힌다. 한 문항도 안 풀었으면 null — 배지 자체가 없다.
 */
function quizScore(
  quizKeys: string[],
  records: Record<string, QuestionRecord>,
): { passed: number; attempted: number; total: number } | null {
  let passed = 0;
  let attempted = 0;
  for (const gk of quizKeys) {
    const record = records[gk];
    if (!record) continue;
    attempted += 1;
    if (record.lastResult === "pass") passed += 1;
  }
  return attempted > 0 ? { passed, attempted, total: quizKeys.length } : null;
}

/**
 * 목차 퀴즈 줄의 점수 배지. 강조는 **전 문항을 풀고 전부 맞혔을 때만** 붙는다 — 분모가 푼
 * 문항 수라서 `passed === attempted` 만 보면 15문항 중 1개 풀어 맞힌 상태가 만점과 같은
 * 강조를 받는다 (PR #202 리뷰). 등급을 매기는 자리는 아니므로 그 외에는 전부 muted 다.
 */
function ScoreBadge({
  passed,
  attempted,
  total,
}: {
  passed: number;
  attempted: number;
  total: number;
}) {
  const perfect = attempted === total && passed === total;
  return (
    <span
      style={{
        fontSize: "0.78rem",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        borderRadius: 99,
        padding: "2px 9px",
        border: `1px solid ${perfect ? "var(--accent)" : "var(--border)"}`,
        color: perfect ? "var(--accent)" : "var(--muted)",
      }}
    >
      {/*
        숫자는 실제 텍스트로 노출하고(#253 — 예전의 `aria-label` + 전체 `aria-hidden` 은
        generic 에 이름을 걸어 둔 꼴이라 배지가 통째로 안 읽혔다) 맥락만 숨은 글자로 준다:
        이 배지가 붙는 줄의 제목은 "마무리 세션" 일 수도 있어 "퀴즈" 라는 말이 근처 어디에도
        안 나오는 경우가 있고, 그러면 "3/11" 이 무엇의 3/11 인지 서지 않는다.
      */}
      <VisuallyHidden>퀴즈 점수 </VisuallyHidden>
      {passed}/{attempted}
    </span>
  );
}

/**
 * 챕터 첫 화면의 섹션 목차 — 읽은 섹션 체크 + 챕터 진도 바 (이슈 #7).
 * v3.1(#161): 파트 그룹 헤더 + 파트별 진도 + 빈출 별점. #66: 퀴즈 줄의 점수 배지.
 * #224: 진도 바 옆의 완료 배지 — 홈 챕터 목록과 **같은 컴포넌트**다.
 */
export function SectionToc({
  chapterId,
  groups,
  finalKeys,
  chapterKeys,
}: {
  chapterId: string;
  groups: TocGroup[];
  finalKeys: string[];    // 완료 판정의 finalQ 분모 (#224)
  chapterKeys: string[];  // "복습 n" 이 세는 그 챕터 전 문항
}) {
  const read = new Set(useReadSections(chapterId));
  const records = useQuestionRecords();
  const all = groups.flatMap((g) => g.items);
  const done = all.filter((item) => read.has(item.sec)).length;

  return (
    <>
      <div
        style={{
          margin: "0 0 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <ProgressBar done={done} total={all.length} />
        {/* 분모(all.length)를 배지에도 넘긴다 — 진도 바와 같은 값이어야 "다 읽었는데 미완료"
            힌트가 실제로 100% 인 순간에만 뜬다 */}
        <CompletionBadge
          chapterId={chapterId}
          sectionTotal={all.length}
          finalKeys={finalKeys}
          chapterKeys={chapterKeys}
        />
      </div>
      {groups.map((group, gi) => {
        const groupDone = group.items.filter((item) => read.has(item.sec)).length;
        const complete = groupDone === group.items.length;
        return (
          <section key={group.label ?? gi} style={{ marginTop: gi === 0 ? 0 : "1.5rem" }}>
            {group.label && (
              <h2
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.6rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--muted)",
                  margin: "0 0.2rem 0.5rem",
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>{group.label}</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* 파트 소요 — 한 자리에서 끝낼 수 있는 단위인지 여기서 판단한다 (#161) */}
                  {group.minutes !== undefined && (
                    <span style={{ fontWeight: 400 }}>약 {group.minutes}분 · </span>
                  )}
                  <span style={{ color: complete ? "var(--accent)" : "var(--muted)" }}>
                    {complete ? "✓ 완료" : `${groupDone}/${group.items.length}`}
                  </span>
                </span>
              </h2>
            )}
            <ol style={{ listStyle: "none", display: "grid", gap: "0.6rem" }}>
              {group.items.map((item) => {
                const isRead = read.has(item.sec);
                const score = item.quizKeys ? quizScore(item.quizKeys, records) : null;
                return (
                  // minWidth: 0 — 그리드 항목의 기본 min-width:auto 는 안쪽 nowrap 부제의
                  // min-content 를 바닥으로 삼아 줄이 트랙보다 넓어진다 (모바일 가로 스크롤).
                  // 여기서 바닥을 풀어야 아래 flex 의 ellipsis 가 실제로 동작한다
                  <li key={item.sec} style={{ minWidth: 0 }}>
                    <Link
                      href={`/chapters/${chapterId}/${item.sec}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.7rem",
                        padding: "0.7rem 0.9rem",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        color: "inherit",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          fontSize: "0.8rem",
                          color: "var(--muted)",
                        }}
                      >
                        {item.num}
                      </span>
                      {/* minWidth: 0 — flex 항목이 내용 폭 밑으로 줄어들 수 있어야 모바일에서 카드가 안 넘친다 */}
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontWeight: 600 }}>{item.title}</span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.82rem",
                            color: "var(--muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.sub}
                        </span>
                      </span>
                      {item.freq && <FreqStars freq={item.freq} />}
                      {score && (
                        <ScoreBadge
                          passed={score.passed}
                          attempted={score.attempted}
                          total={score.total}
                        />
                      )}
                      {/* 읽음 표시는 **색으로만** 갈린다 — ✓ 자체는 두 상태에 다 뜬다. 그래서
                          글자를 그대로 읽히게 두면 읽은 줄과 안 읽은 줄이 똑같이 들리고,
                          예전처럼 `aria-label` 을 걸어 두면 generic 이라 그마저 노출이
                          보장되지 않는다 (#253). ✓ 는 장식으로 숨기고 상태를 말로 낸다. */}
                      <span
                        style={{
                          fontWeight: 900,
                          color: isRead ? "var(--accent)" : "var(--border)",
                        }}
                      >
                        <VisuallyHidden>{isRead ? "읽음" : "안 읽음"}</VisuallyHidden>
                        <span aria-hidden>✓</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </>
  );
}
