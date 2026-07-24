# docs/ — 문서 지도

aws-reps의 프로젝트 문서 모음. 코드가 아닌 **설명·근거·계획**이 여기 산다. 아래 표가 "무엇이 어디 있고, 살아있는지 동결인지"의 단일 지도다.

## 살아있는 문서 (계속 참조)

| 파일 | 무엇 | 갱신 |
|---|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | **구조 안내서** — 처음 보는 사람이 ~15분에 프로젝트를 이해하는 정본 | `prompts/아키텍처안내.md` 재실행 |
| [`ARCHITECTURE_REVIEW.md`](ARCHITECTURE_REVIEW.md) | **구조 진단** — 부채·리스크·1~5 루브릭 (안내서를 as-built 기준선으로 대조·채점) | `prompts/아키텍처점검.md` 재실행 |
| [`CURRICULUM.md`](CURRICULUM.md) | **커리큘럼 도면** — 24챕터 트리·스펙 v3.2. 앱·콘텐츠 세션이 참조하는 기준 문서 | 사람이 직접 |
| [`VERIFIED_FACTS.md`](VERIFIED_FACTS.md) | AWS 사실 검증 캐시 (구성기 부산물 — 콘텐츠 작성 참고용, 코드 미참조. _frozen 이동 후보) | — |

## `prompts/` — 문서 재생성 엔진

위 안내서·진단은 이 프롬프트를 **재실행해 다시 그린다** (손으로 갱신하지 않는다).

| 파일 | 산출물 |
|---|---|
| [`prompts/아키텍처안내.md`](prompts/아키텍처안내.md) | → `ARCHITECTURE.md` |
| [`prompts/아키텍처점검.md`](prompts/아키텍처점검.md) | → `ARCHITECTURE_REVIEW.md` |

## `design/` — 미착수 에픽 설계 입력

착수 전 에픽이 참조할 확정 설계. 구현되면 이 문서를 기준으로 만든다.

| 파일 | 무엇 |
|---|---|
| [`design/LEARNING_LOOP_DRAFT.md`](design/LEARNING_LOOP_DRAFT.md) | 학습 루프 설계 확정본 (오답 재출제·숙달 판정·진도) — 에픽 #53·#86 입력 |
| [`design/APP_ARCHITECTURE_DRAFT.md`](design/APP_ARCHITECTURE_DRAFT.md) | 옛 앱 스켈레톤 *제안* (미구현). `아키텍처점검.md`가 "제안 ↔ 현행 괴리" 진단 입력으로 읽는다 — **현행으로 오독 금지** |

## `reports/` — 활성 사실수정 체크리스트

`content/chapters/*/meta.ts`가 "사실 수정 출처"로 인용하는 R1 콘텐츠 교정 리포트. 전체 평가 리포트(axis1·axis2)는 `_frozen/reports/`에 동결돼 있고, 여기엔 **아직 적용 중인 것만** 남긴다.

## `_frozen/` — 동결 attic

소임이 끝난 이력·근거. **지시문이 아니다** — 읽고 실행하면 닫힌 결정이 되살아난다. 규약 정본은 `content/schema.ts`이고, 여기 CONTRACT·PLAYBOOK·RUBRIC·axis1/2 리포트는 도출 근거일 뿐이다. 상세는 [`_frozen/README.md`](_frozen/README.md).

---

*프로젝트 규칙 전문은 루트 [`CLAUDE.md`](../CLAUDE.md).*
