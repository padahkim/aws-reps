import type { ChapterMeta, Question } from "../../schema";

/**
 * 원본: content/aws-dva-stage0.html (0단계 — AWS의 문법) 중 02 IAM 기초 섹션.
 * stage0에서 분리된 IAM 예고편 수준 — 본 챕터 심화(정책 유형·Condition·STS 오퍼레이션 등)는
 * aws-dva-iam-guide-2 / iam_guide 변환 시 이 챕터를 확장한다.
 */
export const chapterMeta: ChapterMeta = {
  id: "ch0-2",
  phase: "0단계 · 기반 다지기",
  title: "IAM",
  domain: "foundation",
  examWeight: 5,
  prerequisites: ["ch0-1"],
};

// 원본에 퀴즈 성분 없음 (축2 리포트: 말미 체크리스트는 자기평가 문장 — 본문에 잔류).
export const quiz: Question[] = [];
