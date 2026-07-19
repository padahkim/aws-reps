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
}

/** 챕터 첫 화면의 섹션 목차 — 읽은 섹션 체크 표시 + 챕터 진도 바 (이슈 #7). */
export function SectionToc({ chapterId, items }: { chapterId: string; items: TocItem[] }) {
  const read = new Set(useReadSections(chapterId));
  const done = items.filter((item) => read.has(item.sec)).length;

  return (
    <>
      <div style={{ margin: "0 0 1.25rem" }}>
        <ProgressBar done={done} total={items.length} />
      </div>
      <ol style={{ listStyle: "none", display: "grid", gap: "0.6rem" }}>
        {items.map((item) => {
          const isRead = read.has(item.sec);
          return (
            <li key={item.sec}>
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
    </>
  );
}
