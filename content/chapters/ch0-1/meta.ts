import type { ChapterMeta, SectionMeta } from "../../schema";

/**
 * 원본: content/aws-dva-stage0.html (0단계 — AWS의 문법) 중 01 리전/AZ · 03 API 구조 · 04 요금.
 * 02 IAM 섹션은 커버리지가 ch0-2와 겹쳐 분리됨 (docs/reports/axis2/aws-dva-stage0.md 범위 이탈 항목).
 */
/**
 * 오리엔테이션 (규약 v3.1, #163 소급) — objectives 는 본문이 실제로 가르치는 능력만 담는다.
 * §02(API·자격 증명)가 이 챕터의 ★★★ 자리라 5개 중 3개가 거기서 나온다 — 섹션 균등 배분이
 * 아니라 "무엇을 할 수 있게 되는가"의 목록이므로 의도한 편중이다.
 * **parts 는 생략한다** — 섹션이 4개뿐이라 어떻게 끊어도 파트당 1~2섹션이고, 그러면 그룹
 * 헤더가 목차를 한 번 더 쓴 것이 된다 (규약 v3.1이 ch0-1을 그 예로 명시). 파트가 없어도
 * 오리엔테이션의 챕터 총 소요는 그대로 산출된다 (lib/reading-time.ts).
 */
export const chapterMeta: ChapterMeta = {
  id: "ch0-1",
  phase: "0단계 · 기반 다지기",
  title: "AWS 기초",
  domain: "foundation",
  examWeight: 4,
  prerequisites: [],
  objectives: [
    "리전과 가용영역(AZ)의 관계를 설명하고, 고가용성 설계가 왜 여러 AZ에 걸치는 일인지 말한다",
    "콘솔·CLI·SDK가 전부 같은 HTTPS API를 SigV4로 서명해 호출한다는 구조를 설명한다",
    "비밀번호·액세스 키·임시 자격 증명을 용도로 구분하고, 애플리케이션에 줄 자격 증명으로 IAM 역할을 고른다",
    "“구체적 지정이 기본값을 이긴다”는 SDK 자격 증명 탐색 원칙으로 인증이 어디서 풀렸는지 짚는다 (대표 순서: 코드 → 환경변수 → 설정 파일 → 역할)",
    "종량제 과금과 직접 운영–관리형–서버리스 스펙트럼으로 “운영 부담 최소화” 요구의 정답 방향을 잡는다",
  ],
};

// 퀴즈: aws-cloud-drills aws-basics.json 11문항 임포트 — scripts/import-drills.ts가
// 생성한 ./drills.ts를 re-export (이슈 #11. 원본에 퀴즈 성분 없어 신규 작성).
export { quiz } from "./drills.ts";

// 인출 세션 (이슈 #58) — 데이터는 ./session.ts, meta 가 단일 진실 통로 (drills.ts 전례).
export { session } from "./session.ts";

// 섹션 셀프 퀴즈 (이슈 #99) — 데이터는 ./selfquiz.ts, 같은 통로 규약.
export { selfQuiz } from "./selfquiz.ts";

/**
 * 섹션 헤더 데이터 — 본문 <Sec> 헤더·목차·검증기가 공유하는 단일 진실 (규약 v2).
 * 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 */
export const sections: SectionMeta[] = [
  { num: "00", title: "왜 AI 시대에 AWS를 공부하는가", sub: "코드는 AI가 짜준다 — 판단은 누가 하는가", freq: "lo", freqLabel: "출제 아님 · 이 공부를 하는 이유" },
  { num: "01", title: "리전 / 가용영역(AZ)", sub: "“내 리소스는 어디에 놓이는가” — AWS가 만든 칸(리전·AZ)과 내가 그은 칸(VPC)", freq: "mid", freqLabel: "빈출 ★★☆ · 직접 문항은 적지만 모든 문제의 전제" },
  { num: "02", title: "AWS API의 구조", sub: "콘솔·CLI·SDK는 전부 “같은 API”를 부르는 다른 껍데기", freq: "hi", freqLabel: "빈출 ★★★ · 자격 증명 관련은 개발자 시험의 핵심" },
  { num: "03", title: "요금의 기본 사고방식", sub: "쓴 만큼 낸다 · 관리형 vs 직접 운영", freq: "lo", freqLabel: "빈출 ★☆☆ · 직접 출제는 드물지만 “정답 고르는 감각”의 뿌리" },
];
