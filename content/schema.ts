/**
 * 규약 v3 (CONFIRMED) — 챕터 모듈 계약. 이 파일이 단일 진실.
 * CONTRACT_PROPOSAL(종이 제안서) 대체. 열린 결정은 "가장 단순"으로 종결하고, 빌드가 교정한다.
 * 근거: axis1 §3(형식은 점수를 거의 안 움직임) + CONTRACT_PREWORK §2-0(RSC 제약).
 * v2 (이슈 #7): 본문을 Sec 단위 섹션 페이지로 분할 — 섹션 헤더 데이터가 meta로 이동.
 * v3 (이슈 #15 spike → #40 에픽): 본문 표현을 TSX 섹션 함수 → MDX 파일로 이관 —
 *   md 산문이 AI 컨텍스트 주입·생성·번역의 직접 재료가 된다. 챕터 인터페이스(이 파일의
 *   타입·registry·loadBody 시그니처)와 섹션 규약은 v2 그대로다.
 * v3.1 (#148 spike → #161): 챕터 오리엔테이션 — ChapterMeta 에 objectives·parts 를 더하고
 *   섹션 본문 앞 슬롯(beforeBody)을 연다. 아래 "챕터 오리엔테이션 규약" 참조. 전부 optional·
 *   가산이라 v3 챕터는 그대로 유효하다 (기존 4챕터 메타 소급은 #163).
 *
 * 파일 구조 (v3 — 전 챕터 적용 완료):
 *   content/chapters/{id}/meta.ts        — chapterMeta + quiz + sections (+ session) (순수 데이터, "use client" 금지)
 *   content/chapters/{id}/session.ts     — 인출 세션 데이터. meta.ts 가 re-export (drills.ts 전례).
 *                                          없는 챕터 적법 (ChapterData.session? optional)
 *   content/chapters/{id}/selfquiz.ts    — 섹션 셀프 퀴즈 문항 (#98). meta.ts 가 re-export.
 *                                          없는 챕터 적법 (ChapterData.selfQuiz? optional)
 *   content/chapters/{id}/body.tsx       — "use client" shim: <Sec {...sections[i]}> 래핑·
 *                                          섹션 수 assert·인트로/아웃트로 배치만 (본문 내용 금지)
 *   content/chapters/{id}/intro.mdx      — 챕터 인트로 (첫 섹션 페이지 상단. 없으면 생략)
 *   content/chapters/{id}/sections/NN.mdx — 섹션 본문 (Sec 래핑 없이 내용만). NN = meta.sections[i].num
 *   content/chapters/{id}/outro.mdx      — 말미 체크리스트 (마지막 섹션 페이지 하단. 없으면 생략)
 *   content/chapters/{id}/figs.tsx       — 그 챕터에서만 쓰는 도식 SVG·인터랙티브 (mdx가 import)
 *   content/chapters/ui.tsx              — 전 챕터 공용 프리미티브·상수 (팔레트 C, MONO·SANS,
 *                                          Sec·Table·ExamPoint·CodeBlock·WarnBox·Fig 등)
 *   content/chapters/interactive.tsx     — 인터랙티브 공용 프레임·버튼 (SimFrame·SelfQuiz·chipBtn 등)
 *
 * 공용 승격 규약 (#156 — 2026-07-28):
 *   • figs.tsx 는 **챕터 고유물 전용**이다. 챕터와 무관한 프리미티브·상수를 여기 두지 않는다 —
 *     둘 이상의 챕터가 쓸 수 있는 것은 ui.tsx(정적)·interactive.tsx(상태 있는 프레임)로 올린다.
 *     figs.tsx 에 복제를 허용하면 챕터마다 사본이 생기고 조용히 갈라진다 (#156 실측:
 *     CodeBlock 3벌 중 ch1-2만 title 지원, MONO 6벌 중 2벌만 폴백 체인이 짧았다).
 *   • 이미 ui.tsx 에 있는 이름을 챕터에서 다시 정의하지 않는다 — 확장이 필요하면 ui.tsx 쪽을
 *     상위집합으로 넓혀 한 벌로 만든다 (CodeBlock 의 title? 이 그 방식).
 *   • 판정이 애매하면 rule of three — 두 번째 챕터가 같은 것을 요구할 때 승격한다
 *     (ch0-2 단독의 CardGrid·InfoCard·PointBox·AccentRow 는 그래서 아직 챕터 로컬이다).
 *
 * 앱(app/)은 content/ 를 lib/content.ts 로만 소비하므로 ui.tsx 를 직접 import 하지 않는다 —
 * app/ 쪽 팔레트·폰트 상수 복제는 이 계층 경계의 결과이며 위 규약의 대상이 아니다.
 *
 * 인터랙티브 이식 원칙 (#68 EvalEngine 관행 → #71 규칙화):
 *   • 레거시 원본 변환 시 학습용 인터랙티브(시뮬레이터·슬라이더 등 상태 있는 학습 장치)는
 *     figs.tsx 로 기본 이식한다 — 원본 로직 유지, ui.tsx 팔레트 적용. 정적으로 격하하는
 *     건은 예외이며 건별 사유를 해당 변환 이슈 코멘트로 남긴다.
 *   • useState 가 필요하면 figs.tsx 전체를 "use client" 로 두는 것이 적법하다
 *     (body.tsx 클라이언트 경계 안이라 무해 — ch0-2·ch1-2 전례).
 *
 * 챕터 인트로 원칙 (#90 — 2026-07-23 사용자 피드백 규칙화):
 *   • intro.mdx 는 본문(정의·비교표) 진입 전에 서비스의 이미지를 먼저 그리게 한다 —
 *     문단 1~2개로 ① 실무에서 어디에·왜 쓰이는지 ② DVA 시험 비중 ③ 강점
 *     ④ 주의점(함정) 을 소개한다.
 *   • 챕터 성격에 따른 변형 허용 — 서비스 챕터는 ①~④ 전부, 기초·문법 챕터(ch0류)는
 *     "왜 이걸 먼저 알아야 하는가" 동기 프레이밍으로 갈음할 수 있다 (ch0-1 전례).
 *
 * MDX 규정 (v3 — 위반 시의 증상까지 기록해 둔다):
 *   • remark/rehype 플러그인 금지 — Next 16+Turbopack에서 플러그인 지원 불안정 (#15 결정 코멘트).
 *     Mermaid·하이라이트가 필요해지면 플러그인이 아니라 클라이언트 컴포넌트로 도입한다.
 *   • md 기본 요소(p·인라인 code·ul/li)는 루트 mdx-components.tsx가 ui.tsx 팔레트로 매핑 —
 *     본문 mdx에서 코드 펜스(```)는 쓰지 않는다 (블록 코드는 CodeBlock류 컴포넌트로).
 *   • 텍스트를 품는 컴포넌트(Note·ExamLi·WarnBox…)는 여는~닫는 태그를 한 줄에 쓴다 —
 *     여러 줄이면 내용이 블록 파싱되어 <p>가 중첩된다 (hydration 오류).
 *   • 볼드 `**…**`는 닫는 ** 앞이 괄호·구두점이고 뒤가 한글이면 안 닫힌다 (CommonMark
 *     flanking 규칙) — 그 패턴은 <b> 태그를 쓴다. 애매하면 <b>가 안전.
 *   • CodeBlock 등 여러 줄 문자열은 \n 이스케이프 한 줄 템플릿으로 — MDX 다중행 표현식은
 *     행 선행 들여쓰기를 잘라먹는다.
 *
 * 섹션 규약 (v2 — 이슈 #7, 앱이 섹션별 정적 라우트 /chapters/{id}/{n} 을 생성):
 *   • meta.ts 의 sections: SectionMeta[] 가 섹션 목록의 단일 진실 — 목차·라우트 수·검증기가 소비
 *   • body.tsx 의 default export 는 { section: number } prop 을 받아 해당 인덱스(0-based)의
 *     섹션 "하나만" 렌더한다. RSC 는 클라이언트 모듈의 배열 export 를 인덱싱할 수 없으므로
 *     (client reference 는 dot-접근 불가) 컴포넌트 배열 export 가 아니라 prop 방식을 쓴다.
 *   • 본문 섹션 헤더는 반드시 <Sec {...sections[i]}> 로 meta 를 스프레드한다 — 헤더 중복 정의 금지
 *   • body 는 모듈 평가 시점에 내부 섹션 수 ≠ meta.sections.length 면 throw 한다
 *     — output: "export" 프리렌더가 모든 섹션 페이지를 렌더하므로 불일치는 빌드 실패로 드러난다
 *   • 챕터 인트로는 첫 섹션 페이지 상단, 말미 체크리스트는 마지막 섹션 페이지 하단에 렌더
 *   • quiz 가 비어있지 않으면 앱이 "챕터 퀴즈"를 마지막 섹션 페이지(N+1)로 덧붙인다
 *   • body 의 default export 는 optional prop afterSection: ReactNode 을 받아 그 섹션 본문과
 *     아웃트로 "사이"에 렌더한다 — 섹션 꼬리 슬롯. 인출 개념 카드가 이 자리에 들어간다
 *     (아웃트로는 챕터 마무리라 섹션 단위 인출보다 뒤에 와야 한다). 페이지가 슬롯의 내용을
 *     만들고 body 는 위치만 정한다 — 인트로/아웃트로 배치를 body 가 갖는 v3 원칙 그대로
 *   • body 의 default export 는 optional prop beforeBody: ReactNode 도 받아 <Sec> 의 "첫
 *     자식"으로 렌더한다 (v3.1) — 섹션 헤더 바로 아래, 본문 앞. "미리 보는 질문"이 이 자리다.
 *     헤더 위(= <Sec> 밖)가 아니라 안인 이유: 예고 질문은 그 섹션에 속한 장치라 헤더와 붙어야
 *     하고, 첫 섹션 페이지에서 챕터 인트로보다 뒤에 와야 한다
 *
 * 챕터 오리엔테이션 규약 (v3.1 — #148 spike 채택안 1·3·4 → #161):
 *   문제였던 것: 같은 모양의 섹션 18~20개가 연속돼 "다 읽어야 하는 백과사전"으로 읽힌다.
 *   학습 목표·구조·소요 안내가 없고, 이미 있는 빈출도(SectionMeta.freq)가 목차에 안 보였다.
 *
 *   • objectives (선행조직자 — Ausubel) — 챕터 첫 화면에 "무엇을 할 수 있게 되는가" 3~5개.
 *     행동 동사로 끝나는 한 줄 (…을 구분한다 / …을 고른다). 섹션 제목 나열이 아니다.
 *     없는 챕터는 적법 — 앱이 오리엔테이션 블록 자체를 렌더하지 않는다 (점진 적용).
 *   • parts (청킹 — Miller / 분할 원리 — Mayer) — 섹션을 몇 묶음으로 나눠 중간 완결감을 준다.
 *     목차가 파트로 그룹핑되고 파트별 진도·예상 소요가 붙으며, 섹션 페이지 상단에 파트
 *     컨텍스트가 뜬다. from/to 는 SectionMeta.num (양끝 포함).
 *     20섹션 챕터에서는 4~6묶음이 눈대중이지만 **개수는 검증기가 강제하지 않는다** — 적정
 *     개수는 챕터 크기에 달렸고(4섹션짜리 ch0-1 을 4파트로 쪼개면 파트당 1섹션이라 무의미하다),
 *     개수가 어긋나도 화면은 멀쩡히 그려진다. 강제하는 건 **커버리지 하나**다: 전 섹션을
 *     빠짐·중복 없이 덮어야 한다 (안 덮인 섹션은 목차의 어느 그룹에도 안 들어가 조용히
 *     사라지므로 빌드를 막는다). objectives 의 3~5 개는 반대로 강제한다 — 그건 챕터 크기와
 *     무관한 콘텐츠 품질 기준이라 수가 어긋나면 선행조직자 구실을 못 한다.
 *   • 예상 소요는 메타에 쓰지 않는다 — 빌드 시 MDX 분량 + 문항 수로 산출한다
 *     (lib/reading-time.ts). 손으로 적은 수치는 본문이 바뀌면 그 자리에서 낡는다.
 *   • "미리 보는 질문" (pretesting — Kornell·Hays·Bjork 2009) — 섹션 상단에 그 섹션 selfQuiz
 *     문항의 **질문 텍스트만** 노출한다. 콘텐츠 신규 작성 0, 앱이 조립한다.
 *     ✗ SelfQuiz 위젯 재사용 금지 · ✗ 응답 수집·채점 금지 — 응답과 채점은 섹션 하단
 *     셀프 퀴즈(afterSection 슬롯, #105 배치)가 그대로 담당한다. 상단은 예고 목록일 뿐이다.
 *   • **예고 프레이밍 ≠ 인출 요구** (CLAUDE.md "학습자가 답할 수 없는 걸 묻지 않는다"와의 관계):
 *     미리 보는 질문은 답을 요구하는 인출 과제가 아니라 "곧 답이 나온다"는 예고다. 그래서
 *     아직 안 배운 것을 물어도 규칙에 저촉되지 않는다 — 단 그 성격이 화면에 명시돼야 한다
 *     ("못 풀어도 정상 — 읽으며 답을 찾으세요"). 이 문구가 빠지면 그냥 못 푸는 시험이 된다.
 *     인출 요구인 셀프 퀴즈·개념 카드는 여전히 "본문이 가르친 것만" 묻는다.
 *
 * 인출 세션 규약 (이슈 #53 에픽 → #54 spike 결정, v1 = #58):
 *   • session 데이터의 단일 진실도 meta.ts — content/chapters/{id}/session.ts 를 re-export 한다
 *     (drills.ts 전례). session 이 없는 챕터는 적법하고, 앱은 그 경우 아무것도 렌더하지 않는다
 *   • 개념 카드는 각 섹션 페이지 하단 — concepts[].section === sections[].num 로 매핑한다.
 *     카드가 0개인 섹션(ch0-1 의 00 동기 서문 등)은 카드 영역 자체를 렌더하지 않는다
 *   • 게이팅은 카드 내부만 — 기본은 질문만 보이고 탭해야 답+why 가 열린다. 섹션 이동은 막지
 *     않는다. 카드 열림 상태는 v1 비저장(useState) — 세션은 한 자리 완주 설계
 *   • diagram·mixed 는 마지막 세션 페이지용(#59 범위). 여기서는 타입만 확정해 둔다 —
 *     diagram? 은 선형 체인 모델이 안 맞는 챕터(ch0-1 개념도)를 위해 optional, mixed 는
 *     빈 배열이 적법하다(교차 대조 대상이 없는 첫 챕터)
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
  // ── 오리엔테이션 (v3.1 — 위 "챕터 오리엔테이션 규약" 참조) ──
  objectives?: string[];          // 학습 목표 3~5개. 없으면 앱이 오리엔테이션 블록을 생략한다
  parts?: ChapterPart[];          // 섹션 묶음 4~6개. 있으면 전 섹션을 빠짐·중복 없이 덮어야 한다
}

/**
 * 챕터 파트 — 섹션 묶음 하나 (v3.1). 배열 순서 = 학습 순서이고, 목차의 그룹 헤더가 된다.
 * from·to 는 SectionMeta.num (양끝 포함). 한 섹션짜리 파트는 from === to 로 적법하다.
 */
export interface ChapterPart {
  title: string;                  // "호출 방식 세 가지" — 파트가 무엇을 다루는지 한 마디
  from: string;                   // 시작 섹션 num "01"
  to: string;                     // 끝 섹션 num "04" (포함)
}

/**
 * 섹션 헤더 데이터 (규약 v2) — 본문 <Sec> 헤더·목차·섹션 라우트가 공유하는 단일 진실.
 * 배열 순서 = 본문 섹션 순서 = 섹션 페이지 URL 번호(1-based) 순서.
 * 필드는 content/chapters/ui.tsx 의 Sec props 와 1:1 — body 가 그대로 스프레드한다.
 */
export interface SectionMeta {
  num: string;                    // 본문 표기 번호 "01".."NN" — 챕터 내 유일
  title: string;
  sub: string;                    // 부제 한 줄
  freq: "hi" | "mid" | "lo";      // 빈출 배지 (★★★/★★☆/★☆☆)
  freqLabel: string;              // 배지 옆 표기 문구
}

/** 해설이 근거로 삼는 AWS 공식 문서 링크 (aws-cloud-drills 임포트 유래). */
export interface ReferenceLink {
  title: string;
  url: string;
}

export interface Question {
  id: string;                     // 챕터-로컬 "q1". 전역 키는 앱이 `${meta.id}:${q.id}`로 합성
  scope: "mini" | "final";        // 본문 인라인(mini) vs 챕터 종합(final)
  concept: string[];              // 최소 1개
  scenario: string;
  choices: string[];              // 2개 이상 — 4지·5지·복수정답 모두 수용 (PREWORK 4지고정 완화)
  answer: number[];               // 정답 인덱스. 복수 가능
  explanation: string;            // 정답 근거 전용. "\n\n" = 문단 구분 (렌더러가 분할)
  choiceExplanations?: string[];  // 선택지별 why (있으면 choices와 길이 일치) — 축1 L2 앵커
  // ── optional 확장 (이슈 #6: 임포트 시 정보 손실 최소화 — 없으면 UI가 그냥 생략) ──
  title?: string;                 // 문항 한 줄 제목
  difficulty?: "easy" | "medium" | "hard";  // 난이도 (하·중·상)
  references?: ReferenceLink[];   // AWS 공식 문서 링크
  slug?: string;                  // drills 원본의 안정 식별자 — 부분 선별(meta.ts filter)의 키.
                                  // positional id(q1…)는 원본 재정렬 시 밀리므로 선별에 쓰지 않는다 (#69 Codex 리뷰)
}

// ── 인출 세션 (이슈 #54 spike 결정. 위 "인출 세션 규약" 참조) ──────────────

/**
 * 개념 인출 카드 — 섹션을 읽은 직후 그 섹션 하단에서 "덮고 떠올리기"를 시킨다.
 * 카드 하나 = 질문 하나. 탭 전에는 q 만, 탭 후에 a(+why.q)가 열린다.
 */
export interface SessionConcept {
  id: string;                     // 챕터 내 유일 "c1" — 검증기가 유일성을 강제
  section: string;                // 이 카드가 붙을 섹션의 SectionMeta.num ("01") — 실존해야 함
  q: string;                      // 인출 질문. 답을 떠올리게 하는 형태로 (예/아니오 금지)
  a: string;                      // 모범 답변 — 떠올린 것과 대조할 기준
  // 정교화 질문 (#89 결정 ③) — 답을 맞춘 뒤 한 겹 더 파고드는 물음.
  //   q: 물음 자체. a: 모범 why 답(게이팅 후 공개) — 저선지식 독자용 모델링이자
  //   향후 AI 자기설명 채점(#33/#53)의 레퍼런스. a 는 옵션 — 콘텐츠가 채우기 전엔 질문만 낸다.
  why?: { q: string; a?: string };
}

/**
 * 도식 재현 — 노드를 순서대로 이어 흐름을 복원한다 (#59 범위).
 * 선형 체인 모델: edges[i] = nodes[i] → nodes[i+1] 사이의 라벨. 그래서 edges 는 nodes 보다 정확히 1 짧다.
 * 이 모델이 안 맞는 챕터(중첩·수렴·스펙트럼 도식)는 diagram 을 생략한다 — #54 결정 4.
 */
export interface SessionDiagram {
  prompt: string;                 // "무엇을 그려 보라"는 지시문
  nodes: string[];                // 최소 2개
  edges: string[];                // 정확히 nodes.length - 1 개
}

/** 교차 복습 — 인접 서비스와의 대조로 혼동을 씻는다 (#59 범위, 뒤 챕터가 앞 챕터 풀을 누적 소비). */
export interface SessionMixedItem {
  id: string;                     // 챕터 내 유일
  scenario: string;               // 상황 한 줄
  service: string;                // 이 상황의 정답 서비스/기능
  why: string;                    // 왜 그것인가
  contrast: string;               // 헷갈리는 이웃과 무엇이 다른가
}

/** 챕터의 인출 세션 데이터. session.ts 가 export 하고 meta.ts 가 re-export 한다. */
export interface SessionData {
  concepts: SessionConcept[];     // 섹션 하단 카드. 빈 배열 적법
  diagram?: SessionDiagram;       // 선형 체인이 안 맞으면 생략 (스테이션 선택제)
  mixed: SessionMixedItem[];      // 빈 배열 적법 — 교차 대조 대상이 없는 첫 챕터
}

// ── 섹션 셀프 퀴즈 (이슈 #98 — 2026-07-24 사용자 결정) ─────────────────────

/**
 * 섹션 셀프 퀴즈 문항 — 인출 카드 아래에 붙는 자기채점 덱의 데이터.
 * 역할 분담: 인출 카드 = 서술·정교화(why), 셀프 퀴즈 = 판정형 핵심 사실.
 * q 는 짧은 시나리오/사실 큐, a 는 맞았는지 스스로 판정 가능한 1~2문장 정답 —
 * 주제가 카드와 겹쳐도 되지만 문장 재탕은 금지. session.ts 와 파일을 분리하는 이유는
 * SessionData 가 #53·#59 세션 프레임워크와 공유되는 스키마라 결합을 피하기 위함.
 * 렌더는 content/chapters/interactive.tsx 의 SelfQuiz (섹션당 1~3문항 소형 덱, #82 상호작용).
 */
export interface SelfQuizEntry {
  section: string;                // 붙을 섹션의 SectionMeta.num ("01") — 실존해야 함
  q: string;
  a: string;
  // 판정형 문항 표시 (#150) — 값 = 정답 판정. 있으면 위젯이 "답 확인하기" 대신 예/아니오
  // 확답 게이트를 띄운다 (정답 공개 전 입장 확정). 없으면 기존 서술형 동작 그대로.
  // 태깅 기준: 주(첫) 물음이 예/아니오로 직접 답하는 판정 의문문이고 정답의 첫 판정이
  // 예·아니오 한쪽에 1:1 매핑될 때만 — 선택형(A/B 중?)·wh형·"판단은?"류는 제외.
  yn?: "예" | "아니오";
}

/** 각 챕터의 meta.ts가 export 하는 계약. */
export interface ChapterData {
  chapterMeta: ChapterMeta;
  quiz: Question[];               // 빈 배열 적법 — 앱은 빈 quiz에 강건해야 한다
  sections: SectionMeta[];        // 최소 1개 — 단일 섹션 챕터(ch0-2류) 적법, 빈 배열은 위반
  session?: SessionData;          // 없는 챕터 적법 — 점진 이행 중 (#54 결정 1)
  selfQuiz?: SelfQuizEntry[];     // 없는 챕터 적법 — selfquiz.ts 를 re-export (#98)
}
