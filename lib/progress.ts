"use client";

import { useEffect, useState } from "react";

/**
 * 읽음 진도 저장소 (이슈 #7) — localStorage 단일 키에 { [chapterId]: 읽은 섹션 번호[] }.
 * 섹션 번호는 URL과 같은 1-based (퀴즈 섹션 포함). 로그인 없음 — 기기 로컬로만 유지되고,
 * 진도 초기화 UI는 범위 외(필요 시 별도 이슈).
 */
const KEY = "aws-reps.read.v1";

type ReadMap = Record<string, number[]>;

function loadMap(): ReadMap {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    return typeof parsed === "object" && parsed !== null ? (parsed as ReadMap) : {};
  } catch {
    // 파싱 실패·스토리지 접근 불가(프라이빗 모드 등)는 빈 진도로 강건하게
    return {};
  }
}

export function getReadSections(chapterId: string): number[] {
  const value = loadMap()[chapterId];
  return Array.isArray(value) ? value.filter((n) => Number.isInteger(n) && n >= 1) : [];
}

/** 섹션 방문 = 읽음. 이미 읽음이면 no-op. 저장 실패는 조용히 무시(진도는 보조 기능). */
export function markSectionRead(chapterId: string, sec: number): void {
  const map = loadMap();
  const current = getReadSections(chapterId);
  if (current.includes(sec)) return;
  map[chapterId] = [...current, sec].sort((a, b) => a - b);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* noop */
  }
}

/**
 * 마운트 후 localStorage에서 읽음 목록을 읽는다 — SSG HTML은 항상 "빈 진도"로 렌더되므로
 * useEffect로 채워야 hydration 불일치가 없다.
 */
export function useReadSections(chapterId: string): number[] {
  const [read, setRead] = useState<number[]>([]);
  useEffect(() => {
    setRead(getReadSections(chapterId));
  }, [chapterId]);
  return read;
}
