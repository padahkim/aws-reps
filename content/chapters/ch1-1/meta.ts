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
  objectives: [
    "IAM 정책·버킷 정책·Block Public Access가 함께 만드는 접근 허용 조건을 판정한다",
    "스토리지 클래스를 검색 속도·최소 저장 기간·비용으로 비교하고, 수명 주기 규칙으로 옮긴다",
    "SSE-S3·SSE-KMS·SSE-C·클라이언트 측 암호화를 키 소유와 암호화 위치로 구분해 고른다",
    "버전 관리·복제의 전제와 한계(자동 복제는 새 객체만 — 기존분은 Batch Replication · 체이닝 불가)를 근거로 복구 시나리오를 세운다",
    "prefix당 3,500/5,500 요청, 객체 최대 50TB·단일 PUT 5GB, presigned URL 만료(CLI 기본 3600초)를 바로 떠올린다",
  ],
  // 18섹션을 6묶음으로. 경계는 "객체에 무슨 일이 일어나는가"의 단계 기준 — 담고 열기(01~03) →
  // 시간이 지나며 생기는 일(04~07) → 붙는 장치(08~10) → 암호화(11~12) → 요청을 통과시키거나
  // 막는 규칙(13~14) → 접근을 기록하고 열어 주는 법(15~18). 암호화는 §11이 이 챕터 최다
  // 출제라 이웃과 섞지 않고 따로 뒀다.
  //
  // 5|6 경계는 #178에서 한 번 옮겼다 (#163 최초안은 13~15 / 16~18). 13~15 를 "켜는 설정"으로
  // 묶었더니 방향이 제각각이었다 — CORS 는 브라우저 요청을 **통과시키고**, MFA Delete 는 삭제를
  // **막고**, 액세스 로그는 그저 **기록한다**. 그래서 통과/차단 두 규칙(13~14)을 한 쌍으로 두고,
  // 기록(15)은 "누가 어떻게 가져가는가"를 다루는 16~18 과 합쳤다. §13 을 §16 옆으로 옮기는 게
  // 더 자연스럽지만 ChapterPart 는 연속 범위라 불가능하다 (섹션 순서를 바꾸면 URL 이 깨진다).
  parts: [
    { title: "버킷·객체와 접근 제어", from: "01", to: "03" },
    { title: "버전 · 복제 · 클래스 · 수명 주기", from: "04", to: "07" },
    { title: "이벤트 · 성능 · 메타데이터", from: "08", to: "10" },
    { title: "암호화", from: "11", to: "12" },
    { title: "브라우저 허용과 삭제 잠금", from: "13", to: "14" },
    { title: "접근 기록과 제공 방식", from: "15", to: "18" },
  ],
};

export { quiz } from "./drills.ts";

// 섹션 셀프 퀴즈 (이슈 #106) — 데이터는 ./selfquiz.ts, ch0-1과 같은 통로 규약.
export { selfQuiz } from "./selfquiz.ts";

// 인출 세션 (이슈 #100) — 데이터는 ./session.ts, meta 가 단일 진실 통로 (ch0-1 전례).
export { session } from "./session.ts";

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
