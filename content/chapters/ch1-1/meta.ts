import type { ChapterMeta } from "../../schema";

/**
 * 원본: content/aws-dva-s3-guide.jsx(18섹션) + content/aws-s3-dva-guide.jsx(18모듈) 통합.
 * 두 파일은 주제 집합이 1:1 대응하는 실질 중복 쌍(reports/axis2 두 리포트의 「중복 관찰」) —
 * 컴팩트한 전자를 본문 뼈대로, 후자 고유 성분(정책 JSON·S3 Bucket Key·기본 암호화 시점·
 * presigned 기본 3600초·BPA 4설정·freqNote)을 병합했다.
 * 사실 수정: reports/axis2/aws-dva-s3-guide.md · aws-s3-dva-guide.md 수정 지시 전부 반영
 * (50TB, KMS 쿼터 재표현, 평가 순서 재표현, 버킷 네이밍 마침표, MFA CLI/API, 로그 같은 계정,
 * aws:SecureTransport 패턴, S3 Metadata·SSE-C 2026-04 각주).
 * 퀴즈: aws-cloud-drills s3.json 15문항 임포트 — scripts/import-drills.mts가 생성한
 * ./drills.ts를 re-export (이슈 #6. 변환기 보충 생성분 8문항은 drills 15문항으로 교체 — 주제
 * 중복 방지. 기존 문항은 git 이력에 잔존).
 */
export const chapterMeta: ChapterMeta = {
  id: "ch1-1",
  phase: "1단계 · 서버리스 핵심",
  title: "S3",
  domain: "Development",
  examWeight: 5,
  prerequisites: ["ch0-1", "ch0-2"],
};

export { quiz } from "./drills.ts";
