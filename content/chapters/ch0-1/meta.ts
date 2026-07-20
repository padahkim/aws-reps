import type { ChapterMeta, SectionMeta } from "../../schema";

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

// 퀴즈: aws-cloud-drills aws-basics.json 11문항 임포트 — scripts/import-drills.mts가
// 생성한 ./drills.ts를 re-export (이슈 #11. 원본에 퀴즈 성분 없어 신규 작성).
export { quiz } from "./drills.ts";

// 인출 세션 (이슈 #58) — 데이터는 ./session.ts, meta 가 단일 진실 통로 (drills.ts 전례).
export { session } from "./session.ts";

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 */
export const sections: SectionMeta[] = [
  { num: "00", title: "왜 AI 시대에 AWS를 공부하는가", sub: "코드는 AI가 짜준다 — 판단은 누가 하는가", freq: "lo", freqLabel: "출제 아님 · 이 공부를 하는 이유" },
  { num: "01", title: "리전 / 가용영역(AZ)", sub: "\"내 리소스는 물리적으로 어디에 있는가\"", freq: "mid", freqLabel: "빈출 ★★☆ · 직접 문항은 적지만 모든 문제의 전제" },
  { num: "02", title: "AWS API의 구조", sub: "콘솔·CLI·SDK는 전부 “같은 API”를 부르는 다른 껍데기", freq: "hi", freqLabel: "빈출 ★★★ · 자격증명 관련은 개발자 시험의 핵심" },
  { num: "03", title: "요금의 기본 사고방식", sub: "쓴 만큼 낸다 · 관리형 vs 직접 운영", freq: "lo", freqLabel: "빈출 ★☆☆ · 직접 출제는 드물지만 “정답 고르는 감각”의 뿌리" },
];
