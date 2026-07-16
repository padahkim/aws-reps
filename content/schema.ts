/**
 * 규약 v1 (CONFIRMED) — 챕터 모듈 계약. 이 파일이 단일 진실.
 * CONTRACT_PROPOSAL(종이 제안서) 대체. 열린 결정은 "가장 단순"으로 종결하고, 빌드가 교정한다.
 * 근거: axis1 §3(형식은 점수를 거의 안 움직임) + CONTRACT_PREWORK §2-0(RSC 제약).
 *
 * 파일 구조 (PREWORK §2-0 — "use client" 챕터가 meta 서버소비를 막는 문제 해소):
 *   content/chapters/{id}/meta.ts   — chapterMeta + quiz (순수 데이터, "use client" 금지)
 *   content/chapters/{id}/body.tsx  — "use client" + default 본문 컴포넌트
 *
 * 본문 네거티브 규정 (PREWORK §1-D-3 — 위반 시 앱 셸과 충돌. S3 원본이 딱 위반):
 *   ✗ 자체 내비게이션/사이드바/페이저     ✗ 전역 셀렉터 스타일(<style>, body/table…)
 *   ✗ document/window 직접 접근            ✗ 외부 리소스(폰트 CDN 등)
 *
 * 확정 결정 (프롬프트 §4의 열린 포인트 → 최단 옵션. 전부 1줄 변경으로 되돌릴 수 있음):
 *   • 문항 유형        : "mc"만. 그 외(플래시카드·자기평가·도식인출)는 본문 jsx로 잔류
 *   • 형식 팔레트      : 강제 안 함. 본문은 자유 jsx (형식은 점수 변별력 없음 — axis1 §3)
 *   • choiceExplanations: optional (의무화는 신규 모드에서 재론)
 *   • self-explain 게이트: v1 미포함
 *   • 챕터 매핑        : 단수 id 하나. coverage[] 도입 안 함
 *   • 메타 export 이름  : chapterMeta (grep 게이트 `grep -L "export const chapterMeta"` 용)
 */

// DVA-C02 도메인. 관례: Development / Security / Deployment / Troubleshooting. ch0류는 "foundation".
export type Domain = string;

export interface ChapterMeta {
  id: string;                     // "1-1", "ch0-2" — 리포 전역 유일
  phase: string;                  // 커리큘럼 단계 라벨
  title: string;
  domain: Domain;
  examWeight: 1 | 2 | 3 | 4 | 5;  // 출제 빈도. 기존 FreqBadge 레벨과 정렬
  prerequisites: string[];        // 선행 챕터 id. 각 개념블록이 이걸 명시 인용 = L6 강제. 없으면 []
}

export interface Question {
  id: string;                     // 챕터-로컬 "q1". 전역 키는 앱이 `${meta.id}:${q.id}`로 합성
  scope: "mini" | "final";        // 본문 인라인(mini) vs 챕터 종합(final)
  concept: string[];              // 최소 1개
  scenario: string;
  choices: string[];              // 2개 이상 — 4지·5지·복수정답 모두 수용 (PREWORK 4지고정 완화)
  answer: number[];               // 정답 인덱스. 복수 가능
  explanation: string;            // 정답 근거 전용
  choiceExplanations?: string[];  // 선택지별 why (있으면 choices와 길이 일치) — 축1 L2 앵커
}

/** 각 챕터의 meta.ts가 export 하는 계약. */
export interface ChapterData {
  chapterMeta: ChapterMeta;
  quiz: Question[];               // 빈 배열 적법 — 앱은 빈 quiz에 강건해야 한다
}
