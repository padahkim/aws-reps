import type { ChapterMeta, Question, SectionMeta } from "../../schema";

/**
 * 원본: content/aws-cognito-guide.jsx (1,693줄 · 탭 7개)를 14섹션으로 재편.
 * 원본의 탭 경계는 강의 번호(394~401)를 따랐고 탭 하나가 여러 주제를 안고 있어,
 * 섹션 경계는 탭이 아니라 <Card> 단위 주제로 다시 그었다 — 원본 탭 "CUP 기타"의
 * 네 카드(Lambda 트리거·Hosted UI·적응형 인증·JWT)가 §06·§08·§09·§10 으로 갈라진 것이
 * 그 결과다.
 *
 * 사실 수정·보충: docs/_frozen/reports/axis2/aws-cognito-guide.md 지시 전부 반영.
 *   ① 토큰 3종의 개별 용도·수명을 §05 로 신설 (원본은 "JWT(ID·Access·Refresh)"로만 뭉뚱그렸다.
 *      Access·ID 기본 60분(5분~1일) · Refresh 기본 30일(60분~10년, refresh 가 상한))
 *   ② Authorization 헤더 토큰 — REST API는 JWT 원문, HTTP API는 원문 또는 Bearer 형식임을
 *      §07 에 명시 (원본은 "JWT 검증"까지만).
 *      REST API 의 Cognito 권한 부여자가 ID·Access 두 토큰을 다 받는다는 사실은 리포트에
 *      없어 공식 문서로 확인해 넣었다 (Access 토큰은 스코프 검사, ID 토큰은 백엔드로 전달).
 *   ③ Identity Pool → STS 임시 자격 증명 교환 흐름을 §11 에서 ch0-2 §07 STS 와 이어지게 서술.
 * 축1 리포트의 L6 수정 지시(선행 챕터 명시 지목 부재 — 코퍼스 9연속 감점): §02·§11·§12 에
 * <ChLink id="ch0-2"> 로 IAM·STS·신뢰 정책을 장 번호로 역참조한다.
 *
 * 퀴즈: 이 챕터는 quiz 가 비어 있다 (아래 주석 참조 — #273).
 */
/**
 * 오리엔테이션 (규약 v3.1) — objectives 는 "이 챕터를 마치면 무엇을 할 수 있는가"이고,
 * parts 는 14섹션을 5묶음으로 끊는다. 파트 경계는 두 풀의 대비가 흐려지지 않도록 잡았다 —
 * User Pool 쪽 8개를 한 덩어리로 두면 챕터의 절반이 한 파트가 되어 CUP↔CIP 대비가 묻히므로,
 * "로그인과 토큰"(발급되는 것)과 "커스터마이즈와 보호"(운영 기능)로 나눴다.
 */
export const chapterMeta: ChapterMeta = {
  id: "ch3-1",
  phase: "3단계 · 보안 심화",
  title: "Cognito",
  domain: "Security",
  examWeight: 4,
  prerequisites: ["ch0-2"],
  objectives: [
    "User Pool(인증)과 Identity Pool(인가)을 갈라, 시나리오가 어느 쪽을 묻는지 고른다",
    "ID·Access·Refresh 세 토큰의 용도와 수명을 각각 구분해 설명한다",
    "로그인으로 받은 토큰이 API Gateway·ALB·STS 중 어디로 흘러가는지 경로를 그린다",
    "정책 변수로 버킷 하나·테이블 하나를 사용자별로 격리하는 정책을 읽는다",
    "us-east-1 인증서·HTTPS 리스너·401 같은 조건을 시험장에서 바로 떠올린다",
  ],
  parts: [
    { title: "Cognito가 무엇인가", from: "01", to: "02" },
    { title: "User Pool — 로그인과 토큰", from: "03", to: "07" },
    { title: "User Pool — 커스터마이즈와 보호", from: "08", to: "10" },
    { title: "Identity Pool — 임시 AWS 자격 증명", from: "11", to: "12" },
    { title: "통합과 조합", from: "13", to: "14" },
  ],
};

/**
 * 챕터 퀴즈 — **의도적으로 비어 있다** (#272 에서 분리, 작업은 #273).
 * content/drills-src/ 에 cognito 과목이 없고(11과목) 업스트림 aws-cloud-drills 는 #93 이후
 * 동결이라 임포트할 원본이 없다 — 문항을 새로 써야 하므로 별건으로 뺐다. 스키마상 빈 배열은
 * 적법하고(ChapterData.quiz "빈 배열 적법 — 앱은 빈 quiz에 강건해야 한다"), 인출 세션의
 * 실전 스테이션만 렌더되지 않는다. #273 착지 시 이 줄을 `export { quiz } from "./drills.ts"`
 * 로 바꾼다.
 */
export const quiz: Question[] = [];

// 섹션 셀프 퀴즈 (#98 규약) — 데이터는 ./selfquiz.ts, 기존 4챕터와 같은 통로.
export { selfQuiz } from "./selfquiz.ts";

// 인출 세션 (#54 규약) — 데이터는 ./session.ts.
export { session } from "./session.ts";

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * freq 는 원본의 FreqBadge 레벨(1~5)을 3단계로 접어 옮겼다 — 원본이 5를 준 CUP vs CIP·
 * CUP 자체는 hi, 4는 주제에 따라 hi/mid, 3 이하는 mid/lo.
 */
export const sections: SectionMeta[] = [
  { num: "01", title: "Cognito 개요 — 두 개의 풀", sub: "애플리케이션 사용자를 위한 신원 서비스", freq: "mid", freqLabel: "빈출 ★★☆ · 전제 개념" },
  { num: "02", title: "IAM과 Cognito의 구분", sub: "AWS 주체의 접근 vs 애플리케이션 사용자 로그인", freq: "hi", freqLabel: "최빈출 ★★★ · 키워드 매칭 단골" },
  { num: "03", title: "User Pool = 인증", sub: "서버리스 사용자 DB · MFA · 연합 로그인", freq: "hi", freqLabel: "최빈출 ★★★ · CUP의 정의" },
  { num: "04", title: "CUP 로그인 흐름", sub: "ID/PW 검증부터 JWT 발급까지 5단계", freq: "hi", freqLabel: "최빈출 ★★★ · 흐름 그대로 출제" },
  { num: "05", title: "토큰 3종 — ID · Access · Refresh", sub: "용도가 다르고 수명이 다르다", freq: "hi", freqLabel: "최빈출 ★★★ · 구분이 정답 키" },
  { num: "06", title: "JWT 구조", sub: "Header · Payload(sub) · Signature", freq: "mid", freqLabel: "빈출 ★★☆ · 디코딩 문제 대비" },
  { num: "07", title: "API Gateway 통합 — Cognito 권한 부여자", sub: "Authorization 헤더의 JWT로 API를 지킨다", freq: "hi", freqLabel: "최빈출 ★★★ · 서버리스 단골 조합" },
  { num: "08", title: "Hosted UI와 커스텀 도메인", sub: "로그인 화면을 Cognito가 대신 호스팅한다", freq: "mid", freqLabel: "빈출 ★★☆ · 인증서 위치가 함정" },
  { num: "09", title: "Lambda 트리거", sub: "대표 트리거 10개와 커스텀 인증 3단계", freq: "mid", freqLabel: "빈출 ★★☆ · 시점↔트리거 매칭" },
  { num: "10", title: "적응형 인증", sub: "위험도에 따라 MFA를 더 요구한다", freq: "lo", freqLabel: "보통 ★☆☆ · 지엽 포인트" },
  { num: "11", title: "Identity Pool = 인가", sub: "토큰을 STS 임시 자격 증명으로 바꾼다", freq: "hi", freqLabel: "최빈출 ★★★ · CIP의 정의" },
  { num: "12", title: "정책 변수로 사용자별 격리", sub: "s3:prefix · dynamodb:LeadingKeys", freq: "hi", freqLabel: "최빈출 ★★★ · 정책 지문 그대로 출제" },
  { num: "13", title: "ALB 인증 오프로드", sub: "HTTPS 리스너에서 인증을 끝낸다", freq: "mid", freqLabel: "빈출 ★★☆ · 코드 수정 없는 인증" },
  { num: "14", title: "CUP + CIP 조합과 총정리", sub: "인증은 CUP, 인가는 CIP", freq: "hi", freqLabel: "최빈출 ★★★ · 비교표 통째로 출제" },
];
