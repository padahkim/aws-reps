import type { ChapterMeta, Question, SectionMeta } from "../../schema";
import { quiz as drills } from "./drills.ts";

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

// 원본에 퀴즈 성분 없음 (축2 리포트) — aws-cloud-drills iam.json 15문항 중 예고편 범위
// 4문항만 선별 연결 (이슈 #44. drills.ts 는 15문항 전체 생성물 — 선별은 여기서 한다).
// 제외 11문항(권한경계·Cognito·SCP·페더레이션·Condition 키·리소스 기반 정책 등)은
// IAM 심화 챕터 변환 시 회수 — #29 코멘트 참조.
const PREVIEW_SCOPE = new Set([
  "q1", // iam-ec2-role-instead-of-access-keys — "코드에는 키 대신 롤"
  "q2", // iam-cross-account-assume-role — AssumeRole 키워드
  "q4", // iam-lambda-least-privilege-dynamodb — 최소 권한
  "q6", // iam-explicit-deny-precedence — Deny 우선
]);
export const quiz: Question[] = drills.filter((q) => PREVIEW_SCOPE.has(q.id));
// 선별 결과 개수 가드 — iam.json 재정렬·재임포트로 id 가 밀리면 빌드에서 즉시 실패시킨다.
if (quiz.length !== PREVIEW_SCOPE.size) {
  throw new Error(`ch0-2 quiz 선별 실패: ${quiz.length}문항 (기대 ${PREVIEW_SCOPE.size}) — drills.ts 재임포트로 id가 밀렸는지 확인`);
}

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 */
export const sections: SectionMeta[] = [
  { num: "01", title: "IAM 기초", sub: "“누가(Who) 무엇을(What) 할 수 있는가(Can do)”", freq: "hi", freqLabel: "빈출 ★★★ · DVA 최다 빈출 주제 중 하나" },
];
