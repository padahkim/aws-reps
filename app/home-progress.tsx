"use client";

import { useReadSections } from "@/lib/progress/read";
import { ProgressBar } from "./progress-bar";

/** 홈 챕터 목록의 챕터별 읽음 진도 — localStorage 기반이라 마운트 후에 채워진다. */
export function HomeProgress({ chapterId, total }: { chapterId: string; total: number }) {
  const read = useReadSections(chapterId);
  // 콘텐츠 개편으로 섹션 수가 줄었을 때 done > total 이 되지 않게 범위 밖 번호는 버린다
  const done = read.filter((n) => n <= total).length;
  return <ProgressBar done={done} total={total} />;
}
