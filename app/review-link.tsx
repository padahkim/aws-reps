"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReview } from "@/lib/progress/review";
import { dueCount } from "@/lib/progress/review-core";

/**
 * 홈의 오답 노트 진입점 (#219). 설계 §1-3 의 "due 카운트 배지"가 이것이다 — **숫자 하나가
 * 전부**이고 알림·푸시·스트릭은 만들지 않는다(localStorage 앱의 분수를 지킨다).
 *
 * 설계는 이 자리를 "내비게이션의 오답 노트 항목"이라 불렀는데 이 앱에는 전역 내비가 없다
 * (app/layout.tsx 는 `<main>` 만 감싼다). 그래서 지금의 제자리는 홈 헤더다 — 내비가 생기면
 * 이 컴포넌트째 옮기면 된다.
 *
 * 링크는 개수와 무관하게 늘 보인다: 0이라고 감추면 "복습할 게 없다"와 "그런 화면이 있는 줄
 * 몰랐다"가 구분되지 않는다.
 */
export function ReviewLink({ knownKeys }: { knownKeys: string[] }) {
  const { review } = useReview();
  // 개수는 시각에 달렸다 — 서버·첫 렌더에서는 셀 수 없으므로 마운트 후에만 센다
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const read = () => setNow(new Date().toISOString());
    read();
    /**
     * 시각을 마운트 때 한 번만 잡으면, 홈을 열어 둔 채 자정을 넘겼을 때 **복습이 기한이 됐는데
     * 배지가 안 뜬다** (PR #221 리뷰 지적) — 배지가 하려는 일이 바로 그걸 알리는 것인데.
     * 탭으로 돌아올 때 다시 잡는 것으로 충분하다: 이 화면을 몇 시간째 **보고 있는** 경우까지
     * 타이머로 쫓는 건 알림 없는 설계(§1-3)에 견줘 과하다.
     */
    window.addEventListener("focus", read);
    document.addEventListener("visibilitychange", read);
    return () => {
      window.removeEventListener("focus", read);
      document.removeEventListener("visibilitychange", read);
    };
  }, []);
  // 오답 노트 화면이 그리는 집합과 **같은 것**을 센다 (lib/question-bank.ts 주석 참조)
  const due = now === null ? 0 : dueCount(review, now, new Set(knownKeys));

  return (
    <Link href="/review">
      오답 노트
      {due > 0 && (
        <span
          style={{
            marginLeft: "0.35rem",
            fontSize: "0.75rem",
            fontWeight: 700,
            borderRadius: 99,
            padding: "1px 8px",
            background: "#F8E4DF",
            color: "#B9432C",
          }}
        >
          복습 {due}
        </span>
      )}
    </Link>
  );
}
