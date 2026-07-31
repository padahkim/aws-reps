import type { ChapterMeta, SectionMeta } from "../../schema";

/**
 * 원본: content/aws-lambda-dva-guide.jsx(28섹션·최상세본)를 뼈대로,
 * content/aws-lambda-dva-guide-2.jsx(7탭 — 숫자 암기표·시나리오→정답 패턴·콜드스타트 타임라인)와
 * content/lambda-dva-study.jsx(문답 퀴즈 10문항·QUOTAS 표)를 병합 (docs/reports/axis2 3개 리포트의
 * 「중복 관찰」: guide가 범위·상세 우세, guide-2/study는 요약·인출연습 보완재).
 * 사실 수정: docs/reports/axis2/aws-lambda-dva-guide.md · -2.md · lambda-dva-study.md 지시 전부 반영
 * (1,769MB, SQS ESM 스케일링 현행화, Lambda@Edge 30초/50MB, 콜드스타트 수치 완화,
 * Destinations 뉘앙스, 비동기 페이로드 1MB, SnapStart 런타임 병기, 함수 URL 미검증 각주).
 * 커버리지 공백 보충(리포트 "보충 생성 목록"): Lambda 익스텐션·SAM 로컬 테스트·Firehose 변환.
 * 퀴즈: aws-cloud-drills lambda.json 15문항 임포트 — scripts/import-drills.ts가 생성한
 * ./drills.ts를 re-export (이슈 #6. lambda-dva-study 변환분 10문항은 drills 15문항으로 교체 —
 * 주제 중복 방지. 기존 문항은 git 이력에 잔존).
 */
/**
 * 오리엔테이션 (규약 v3.1, #161 파일럿) — objectives 는 섹션 제목 요약이 아니라 "이 챕터를
 * 마치면 무엇을 할 수 있는가"이고, parts 는 섹션 20개를 6묶음으로 끊어 중간 완결감을 준다.
 * 파트 경계는 학습 흐름 기준: 호출 방식(01~04)이 이 챕터의 심장이라 맨 앞에 통째로 두고,
 * 시험에서 같이 묶여 나오는 것끼리(성능·동시성·스토리지 등) 이웃하게 했다.
 * #163 소급 때 재검토: 커버리지·경계는 그대로 두고 두 번째 파트 제목만 고쳤다 —
 * 05~08에는 §08 환경 변수가 들어 있어 "이벤트 처리와 권한"이 그 섹션을 덮지 못했다.
 */
export const chapterMeta: ChapterMeta = {
  id: "ch1-2",
  phase: "1단계 · 서버리스 핵심",
  title: "Lambda",
  domain: "Development",
  examWeight: 5,
  prerequisites: ["ch0-1", "ch0-2", "ch1-1"],
  objectives: [
    "동기·비동기·이벤트 소스 매핑 — 세 가지 호출 방식과 각각의 오류 처리를 구분한다",
    "실행 역할(나가는 권한)과 리소스 기반 정책(들어오는 권한)을 상황에 맞게 고른다",
    "메모리·타임아웃·동시성 설정이 성능과 콜드 스타트에 어떻게 작용하는지 설명한다",
    "버전·별칭·CodeDeploy 전환을 조합해 무중단 배포 시나리오를 세운다",
    "15분·10GB·1,769MB·zip 50MB 같은 한도 수치를 시험장에서 바로 떠올린다",
  ],
  parts: [
    { title: "서버리스와 호출 3유형", from: "01", to: "04" },
    { title: "이벤트 · 권한 · 설정", from: "05", to: "08" },
    { title: "관측 · 엣지 · 네트워크", from: "09", to: "11" },
    { title: "성능 · 동시성 · 스토리지", from: "12", to: "14" },
    { title: "배포와 버전 관리", from: "15", to: "18" },
    { title: "보충과 한도 총정리", from: "19", to: "20" },
  ],
};

export { quiz } from "./drills.ts";

// 섹션 셀프 퀴즈 (이슈 #107) — 데이터는 ./selfquiz.ts, ch0-1과 같은 통로 규약.
// §03·04·07·12·13·15·16 인라인 <SelfQuiz> 블록(#95)에서 이관 + 누락 섹션 신규 작성.
export { selfQuiz } from "./selfquiz.ts";

// 인출 세션 (이슈 #59) — 데이터는 ./session.ts, ch0-1과 같은 통로 규약.
// 개념 카드 20장(섹션당 1장) + 비동기 호출 도식 + 혼합 7장.
export { session } from "./session.ts";

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 */
export const sections: SectionMeta[] = [
  { num: "01", title: "서버리스와 Lambda 개요", sub: "EC2와의 차이, 과금 모델, 런타임", freq: "mid", freqLabel: "빈출 ★★☆ · 전제 개념" },
  { num: "02", title: "호출 ① 동기식 (+ ALB 통합)", sub: "결과를 기다린다 — 오류 처리는 호출자 책임", freq: "hi", freqLabel: "최빈출 ★★★ · 호출 3유형 구분" },
  { num: "03", title: "호출 ② 비동기식 & DLQ", sub: "이벤트 큐 · 재시도 3회 · S3/EventBridge 트리거", freq: "hi", freqLabel: "최빈출 ★★★ · 재시도 정책 암기 필수" },
  { num: "04", title: "호출 ③ 이벤트 소스 매핑 (ESM)", sub: "Kinesis · DynamoDB Streams · SQS — Lambda가 폴링한다", freq: "hi", freqLabel: "최빈출 ★★★ · 오류 처리와 스케일링" },
  { num: "05", title: "이벤트 & 컨텍스트 객체", sub: "handler(event, context) — 데이터 vs 메타데이터", freq: "lo", freqLabel: "보통 ★☆☆ · 구분 문제" },
  { num: "06", title: "Lambda Destinations", sub: "성공/실패 결과 라우팅 — DLQ와의 비교", freq: "mid", freqLabel: "빈출 ★★☆ · DLQ 비교 단골" },
  { num: "07", title: "권한 — 실행 역할 vs 리소스 기반 정책", sub: "권한이 나가느냐, 들어오느냐", freq: "hi", freqLabel: "최빈출 ★★★ · 방향 구분이 정답 키" },
  { num: "08", title: "환경 변수", sub: "4KB 한도 · KMS 암호화", freq: "lo", freqLabel: "보통 ★☆☆ · 설정 관리" },
  { num: "09", title: "모니터링 & X-Ray 추적", sub: "CloudWatch 지표와 X-Ray 환경 변수", freq: "mid", freqLabel: "빈출 ★★☆ · 환경 변수 그대로 출제" },
  { num: "10", title: "Lambda@Edge & CloudFront Functions", sub: "엣지에서 요청/응답 변형 — 비교표 암기", freq: "mid", freqLabel: "빈출 ★★☆ · 선택 기준 문제" },
  { num: "11", title: "VPC의 Lambda", sub: "ENI · 퍼블릭 서브넷 함정 · NAT", freq: "hi", freqLabel: "최빈출 ★★★ · 초빈출 함정 포함" },
  { num: "12", title: "함수 성능 — 메모리·타임아웃·실행 컨텍스트", sub: "RAM↑ = vCPU↑ · 1,769MB = 1 vCPU", freq: "hi", freqLabel: "최빈출 ★★★ · 수치와 코드 패턴" },
  { num: "13", title: "동시성 & 콜드 스타트", sub: "Reserved vs Provisioned · 스로틀 동작", freq: "hi", freqLabel: "최빈출 ★★★ · 시나리오 단골" },
  { num: "14", title: "레이어 & 스토리지 옵션 (EFS 포함)", sub: "종속성 재사용과 4가지 스토리지 비교", freq: "mid", freqLabel: "빈출 ★★☆ · 비교표 통째로 출제" },
  { num: "15", title: "배포 — 종속성 · CloudFormation · 컨테이너 이미지", sub: "zip 50MB · S3ObjectVersion 함정 · Runtime API", freq: "mid", freqLabel: "빈출 ★★☆ · CFN 함정 주의" },
  { num: "16", title: "버전 & Alias", sub: "불변 버전 · 가변 별칭 · 가중치 카나리", freq: "hi", freqLabel: "최빈출 ★★★ · 그대로 암기" },
  { num: "17", title: "CodeDeploy 트래픽 전환", sub: "Linear · Canary · AllAtOnce + 자동 롤백", freq: "mid", freqLabel: "빈출 ★★☆ · 전략 이름 구분" },
  { num: "18", title: "Lambda 함수 URL", sub: "게이트웨이 없이 전용 HTTPS 엔드포인트", freq: "lo", freqLabel: "보통 ★☆☆ · AuthType 구분" },
  { num: "19", title: "익스텐션 · 테스트 · 준실시간 변환 (보충)", sub: "원본 미커버 항목 — Task 1.2 키워드 보강", freq: "lo", freqLabel: "보통 ★☆☆ · 커버리지 보강" },
  { num: "20", title: "한도 총정리 & 시나리오 → 정답 패턴", sub: "숫자 암기표 — 리전당 적용", freq: "hi", freqLabel: "최빈출 ★★★ · 숫자 그대로 출제" },
];
