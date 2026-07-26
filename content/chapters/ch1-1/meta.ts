import type { ChapterMeta, SectionMeta } from "../../schema";

/**
 * 원본: content/aws-dva-s3-guide.jsx(18섹션) + content/aws-s3-dva-guide.jsx(18모듈) 통합.
 * 두 파일은 주제 집합이 1:1 대응하는 실질 중복 쌍(docs/reports/axis2 두 리포트의 「중복 관찰」) —
 * 컴팩트한 전자를 본문 뼈대로, 후자 고유 성분(정책 JSON·S3 Bucket Key·기본 암호화 시점·
 * presigned 기본 3600초·BPA 4설정·freqNote)을 병합했다.
 * 사실 수정: docs/reports/axis2/aws-dva-s3-guide.md · aws-s3-dva-guide.md 수정 지시 전부 반영
 * (50TB, KMS 쿼터 재표현, 평가 순서 재표현, 버킷 네이밍 마침표, MFA CLI/API, 로그 같은 계정,
 * aws:SecureTransport 패턴, S3 Metadata·SSE-C 2026-04 각주).
 * 퀴즈: aws-cloud-drills s3.json 15문항 임포트 — scripts/import-drills.ts가 생성한
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

// 섹션 셀프 퀴즈 (이슈 #106) — 데이터는 ./selfquiz.ts, ch0-1과 같은 통로 규약.
export { selfQuiz } from "./selfquiz.ts";

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 */
export const sections: SectionMeta[] = [
  { num: "01", title: "S3 개요 — 버킷·객체·Key", sub: "키/prefix 구조, 크기 한도, 버킷 네이밍", freq: "mid", freqLabel: "빈출 ★★☆ · 기초지만 함정 선지의 재료" },
  { num: "02", title: "S3 보안 · 버킷 정책", sub: "정책 평가 로직과 교차 계정이 핵심", freq: "hi", freqLabel: "최빈출 ★★★ · 거의 매 시험" },
  { num: "03", title: "S3 정적 웹사이트", sub: "엔드포인트 형식과 403 트러블슈팅", freq: "lo", freqLabel: "보통 ★☆☆ · 403 시나리오 위주" },
  { num: "04", title: "S3 버전 관리", sub: "Delete Marker 동작과 null 버전", freq: "mid", freqLabel: "빈출 ★★☆ · 복구 시나리오 단골" },
  { num: "05", title: "S3 복제 (CRR / SRR)", sub: "버전 관리 전제 · 기존 객체 미복제 · 체이닝 불가", freq: "mid", freqLabel: "빈출 ★★☆ · 3대 함정이 그대로 선지" },
  { num: "06", title: "S3 스토리지 클래스", sub: "용도·검색 속도·최소 저장 기간", freq: "hi", freqLabel: "최빈출 ★★★ · 시나리오 매칭" },
  { num: "07", title: "수명 주기 규칙 + S3 Analytics", sub: "Transition/Expiration 구분과 Analytics 적용 범위", freq: "mid", freqLabel: "빈출 ★★☆ · 비용 절감 시나리오" },
  { num: "08", title: "S3 이벤트 알림", sub: "대상의 리소스 정책과 EventBridge 통합", freq: "mid", freqLabel: "빈출 ★★☆ · 권한 방식이 함정" },
  { num: "09", title: "S3 퍼포먼스", sub: "기준 성능 수치와 3가지 최적화 기법", freq: "hi", freqLabel: "최빈출 ★★★ · 수치 암기 필수" },
  { num: "10", title: "객체 태그 & 메타데이터", sub: "직접 검색 불가 — 외부 인덱스 패턴", freq: "lo", freqLabel: "가끔 ★☆☆ · 함정 선지로 등장" },
  { num: "11", title: "S3 암호화", sub: "SSE 4종 + 클라이언트 측 — 키 소유와 암호화 위치로 구분", freq: "hi", freqLabel: "최빈출 ★★★ · S3 최다 출제 주제" },
  { num: "12", title: "S3 기본 암호화", sub: "자동 SSE-S3와 암호화 강제 패턴", freq: "lo", freqLabel: "보통 ★☆☆ · 강제 패턴이 포인트" },
  { num: "13", title: "S3 CORS", sub: "preflight와 설정 위치(요청받는 쪽)", freq: "mid", freqLabel: "빈출 ★★☆ · DVA 단골" },
  { num: "14", title: "S3 MFA Delete", sub: "버전 관리 전제 · 루트 전용 · 콘솔 불가", freq: "lo", freqLabel: "보통 ★☆☆ · 조건 3종 세트" },
  { num: "15", title: "S3 액세스 로그", sub: "같은 리전·같은 계정 + 무한 루프 금지", freq: "lo", freqLabel: "가끔 ★☆☆ · 무한 루프 함정" },
  { num: "16", title: "사전 서명된 URL (Presigned URL)", sub: "생성자 권한 상속 · 만료 시간", freq: "hi", freqLabel: "최빈출 ★★★ · 임시 접근의 정답" },
  { num: "17", title: "S3 액세스 포인트", sub: "용도별 정책 분리 + VPC Origin", freq: "lo", freqLabel: "보통 ★☆☆ · 대규모 접근 관리" },
  { num: "18", title: "S3 Object Lambda", sub: "반환 직전 변환 — 원본은 하나만", freq: "lo", freqLabel: "보통 ★☆☆ · 구성 순서 문제" },
];
