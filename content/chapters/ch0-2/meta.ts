import type { ChapterMeta, Question, SectionMeta } from "../../schema";

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

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 */
export const sections: SectionMeta[] = [
  { num: "01", title: "IAM 기초", sub: "“누가(Who) 무엇을(What) 할 수 있는가(Can do)”", freq: "hi", freqLabel: "빈출 ★★★ · DVA 최다 빈출 주제 중 하나" },
];
