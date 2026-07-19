import type { ChapterMeta } from "../../schema";

/**
 * 원본: content/aws-lambda-dva-guide.jsx(28섹션·최상세본)를 뼈대로,
 * content/aws-lambda-dva-guide-2.jsx(7탭 — 숫자 암기표·시나리오→정답 패턴·콜드스타트 타임라인)와
 * content/lambda-dva-study.jsx(문답 퀴즈 10문항·QUOTAS 표)를 병합 (reports/axis2 3개 리포트의
 * 「중복 관찰」: guide가 범위·상세 우세, guide-2/study는 요약·인출연습 보완재).
 * 사실 수정: reports/axis2/aws-lambda-dva-guide.md · -2.md · lambda-dva-study.md 지시 전부 반영
 * (1,769MB, SQS ESM 스케일링 현행화, Lambda@Edge 30초/50MB, 콜드스타트 수치 완화,
 * Destinations 뉘앙스, 비동기 페이로드 1MB, SnapStart 런타임 병기, 함수 URL 미검증 각주).
 * 커버리지 공백 보충(리포트 "보충 생성 목록"): Lambda 익스텐션·SAM 로컬 테스트·Firehose 변환.
 * 퀴즈: aws-cloud-drills lambda.json 15문항 임포트 — scripts/import-drills.mts가 생성한
 * ./drills.ts를 re-export (이슈 #6. lambda-dva-study 변환분 10문항은 drills 15문항으로 교체 —
 * 주제 중복 방지. 기존 문항은 git 이력에 잔존).
 */
export const chapterMeta: ChapterMeta = {
  id: "ch1-2",
  phase: "1단계 · 서버리스 핵심",
  title: "Lambda",
  domain: "Development",
  examWeight: 5,
  prerequisites: ["ch0-1", "ch0-2", "ch1-1"],
};

export { quiz } from "./drills.ts";
