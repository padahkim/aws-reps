import type { ChapterMeta, Question, SectionMeta } from "../../schema";

/**
 * 원본: content/iam_guide.jsx(9섹션 + EvalEngine 시뮬레이터) + content/aws-dva-iam-guide-2.jsx
 * (10섹션 심화) 전량 통합 (#68 — stage0 분리 예고편에서 전면 확장).
 * 뼈대는 iam_guide 9섹션, §07(자격증명&보안)만 08 접근 방법·09 보안 도구로 분리해 guide-2의
 * 16·18~23·26·28~29강을 수용 — 총 10섹션 (목차 초안은 #68 코멘트).
 * 인터랙티브: iam_guide EvalEngine(정책 평가 시뮬레이터)을 figs.tsx로 격하 없이 이식.
 * guide-2 PolicyEvalDiagram은 EvalEngine의 DECISION FLOW 패널과 중복이라 별도 이식 안 함.
 * 사실 수정: reports/{axis1,axis2}/{iam_guide,aws-dva-iam-guide-2}.md 수정 지시 전부 반영 —
 * 0-1 자격증명 체인·SigV4 역참조 브리지(§03·§07), ch1-1 버킷 정책 역참조(§06),
 * STS 4종 명시 + GetSessionToken 추가(§07), Condition 키 구체 예시 + dynamodb:LeadingKeys
 * 세분화 인가(§04), CloudShell 축약 + 0-1 참조(§08), "CLI가 boto3 위" → botocore 정정(§08),
 * 베어러 토큰 보충(§03), 페더레이션 흐름 보충(§07).
 */
export const chapterMeta: ChapterMeta = {
  id: "ch0-2",
  phase: "0단계 · 기반 다지기",
  title: "IAM",
  domain: "foundation",
  examWeight: 5,
  prerequisites: ["ch0-1"],
};

// 두 원본 모두 퀴즈 성분 없음 (축2 리포트). 퀴즈 연결은 #44 (예고편 범위 제한 해제됨).
export const quiz: Question[] = [];

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 */
export const sections: SectionMeta[] = [
  { num: "01", title: "IAM 개요 — AWS의 관문", sub: "글로벌·무료·기본은 전부 거부", freq: "mid", freqLabel: "빈출 ★★☆ · 모든 서비스 문제의 배경" },
  { num: "02", title: "핵심 구성요소", sub: "Root·유저·그룹·롤·정책 — 주체와 권한", freq: "hi", freqLabel: "빈출 ★★★ · 그룹 규칙이 함정 재료" },
  { num: "03", title: "인증 vs 인가", sub: "“너 누구야?” 다음에 “뭐 할 수 있어?”", freq: "mid", freqLabel: "빈출 ★★☆ · 용어 구분 문제" },
  { num: "04", title: "정책 JSON 해부", sub: "Effect·Action·Resource·Principal·Condition + 정책 변수", freq: "hi", freqLabel: "최빈출 ★★★ · 정책 판독 문제의 재료" },
  { num: "05", title: "정책 유형과 유효 권한", sub: "Identity/Resource/Boundary/SCP — 교집합", freq: "hi", freqLabel: "빈출 ★★★ · Boundary 그룹 불가 함정" },
  { num: "06", title: "정책 평가 로직", sub: "명시적 Deny > Allow > 암묵적 Deny — 시뮬레이터로 확인", freq: "hi", freqLabel: "최빈출 ★★★ · DVA 최다 출제 지점" },
  { num: "07", title: "롤 & STS", sub: "빌려 쓰는 신원, 임시 자격증명, iam:PassRole", freq: "hi", freqLabel: "최빈출 ★★★ · 키 대신 롤 + PassRole" },
  { num: "08", title: "접근 방법과 자격증명", sub: "콘솔·CLI·SDK, 액세스 키, 비밀번호 정책·MFA", freq: "mid", freqLabel: "빈출 ★★☆ · 도구·자격증명 매칭" },
  { num: "09", title: "보안 도구·모범 사례·공동 책임", sub: "Credential Report vs Access Advisor가 핵심", freq: "mid", freqLabel: "빈출 ★★☆ · 도구 스왑 함정" },
  { num: "10", title: "DVA 시험 핵심 정리", sub: "한 장 요약 + 시험 직전 체크", freq: "hi", freqLabel: "총정리 · 시험 직전 복습용" },
];
