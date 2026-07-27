"use client";

import Link from "next/link";
import { useReadSections } from "@/lib/progress";
import { ProgressBar } from "../../progress-bar";

/** 목차 한 줄에 필요한 직렬화 가능 데이터 — 서버(page.tsx)가 meta.sections에서 만들어 내려준다. */
export interface TocItem {
  sec: number;   // 섹션 페이지 URL 번호 (1-based, 퀴즈 = 마지막)
  num: string;   // 표기 번호 "01".."NN", 퀴즈는 "Q"
  title: string;
  sub: string;
  freq?: "hi" | "mid" | "lo";   // 빈출도 (#161 — 데이터는 v2부터 있었으나 목차에 안 보였다). 퀴즈 줄은 없음
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
 */
function FreqStars({ freq }: { freq: "hi" | "mid" | "lo" }) {
  const filled = FILLED[freq];
  const stars = "★".repeat(filled) + "☆".repeat(3 - filled);
  return (
    <span
      aria-label={`빈출 ${stars}`}
      style={{ fontSize: "0.8rem", letterSpacing: "0.05em", whiteSpace: "nowrap" }}
    >
      <span aria-hidden style={{ color: "var(--fg)" }}>{"★".repeat(filled)}</span>
      <span aria-hidden style={{ color: "var(--border)" }}>{"☆".repeat(3 - filled)}</span>
    </span>
  );
}

/**
 * 챕터 첫 화면의 섹션 목차 — 읽은 섹션 체크 + 챕터 진도 바 (이슈 #7).
 * v3.1(#161): 파트 그룹 헤더 + 파트별 진도 + 빈출 별점.
 */
export function SectionToc({ chapterId, groups }: { chapterId: string; groups: TocGroup[] }) {
  const read = new Set(useReadSections(chapterId));
  const all = groups.flatMap((g) => g.items);
  const done = all.filter((item) => read.has(item.sec)).length;

  return (
    <>
      <div style={{ margin: "0 0 1.25rem" }}>
        <ProgressBar done={done} total={all.length} />
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
                      <span
                        aria-label={isRead ? "읽음" : "안 읽음"}
                        style={{
                          fontWeight: 900,
                          color: isRead ? "var(--accent)" : "var(--border)",
                        }}
                      >
                        ✓
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
