"use client";

import { useEffect } from "react";
import { markSectionRead } from "@/lib/progress";

/** 섹션 페이지 방문 = 읽음 처리 (이슈 #7 — 방문이 가장 단순한 완료 신호). 렌더 출력 없음. */
export default function MarkRead({ chapterId, sec }: { chapterId: string; sec: number }) {
  useEffect(() => {
    markSectionRead(chapterId, sec);
  }, [chapterId, sec]);
  return null;
}
