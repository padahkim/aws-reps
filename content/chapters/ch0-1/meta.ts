import type { ChapterMeta, Question } from "../../schema";

/**
 * 원본: content/aws-dva-stage0.html (0단계 — AWS의 문법) 중 01 리전/AZ · 03 API 구조 · 04 요금.
 * 02 IAM 섹션은 커버리지가 ch0-2와 겹쳐 분리됨 (reports/axis2/aws-dva-stage0.md 범위 이탈 항목).
 */
export const chapterMeta: ChapterMeta = {
  id: "ch0-1",
  phase: "0단계 · 기반 다지기",
  title: "AWS 기초",
  domain: "foundation",
  examWeight: 4,
  prerequisites: [],
};

// 원본에 퀴즈 성분 없음 (축2 리포트: 말미 체크리스트는 자기평가 문장 — 본문에 잔류).
export const quiz: Question[] = [];
