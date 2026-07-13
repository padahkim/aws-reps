# SCHEMA_FEEDBACK_AXIS1.md — 학습 설계 관점 제안 (축1)

> RUBRIC §8 근거. **AI는 RUBRIC/스키마를 직접 수정하지 않는다 — 제안만.** 인간이 검토해 RUBRIC §8 앵커 / 스키마 v1에 반영한다.
> 최초 기록: 축1 캘리브레이션 세션 (대상 3파일: aws-dva-messaging · dva-chapter-template · lambda-dva-study).

---

## A. 앵커(RUBRIC §8) 피드백 — 형식이 앵커에 안 맞아 판정이 흔들린 지점

캘리브레이션에서 현행 앵커가 레거시 콘텐츠의 특정 형식을 다루지 못해, 좋은 설계가 부당하게 낮은 점수를 받는 3개 지점이 확인됨.

| # | 항목 | 문제 | 제안 | 인간 결정 |
|---|---|---|---|---|
| A1 | **L2 해설 완전성** | 앵커(`2=오답별 조건화`)가 **4지선다 전제**. 자유서술 자가채점 퀴즈(선택지·오답 없음, 모범답안만)는 구조상 적용 불가 (예: lambda-dva-study 10문항). | **해설 성분 X(자유서술형) → L2 N/A** 규칙 추가. 현행 N/A 규칙은 "퀴즈 성분"에만 걸려 있어 이 형식을 못 잡음. | **채택 확정 (2026-07-13, 인간)** — 다음 세션은 자유서술 퀴즈에 L2 N/A 적용, 유효 만점에서 제외 |
| A2 | **L1 인출 밀도** | 앵커가 **배치(placement)와 품질(quality)을 한 눈금에 혼합**: `0=챕터 끝에만 몰림` vs `2=적용해야 풀림`. 문항이 끝에 몰렸지만 전부 적용형인 경우(lambda-dva-study) 0과 2 조건을 동시에 만족 → 채점 불능. 또 인터랙티브 시뮬레이터(능동 인출)를 "문항"이 아니라는 이유로 무득점. | **문항이 말단에 몰려도 전부 적용형이고 챕터 본문에 능동 시뮬레이터가 분산되어 있으면 0(끝몰림) 대신 1로 완화.** (배치 약점은 반영하되 적용 품질·분산 시뮬레이터를 부분 인정 → 0 폭탄 방지) | **채택 확정 (2026-07-13, 인간)** |
| A3 | **L8 누적 복습** | 단일 챕터 파일(예: lambda-dva-study = 1-2 Lambda 단독)은 구조상 이전 챕터 결합 문항이 불가 → L8=0이 판정을 끌어내림. | **단일 챕터 담당 파일 → L8 N/A** (누적 복습은 통합 단계의 챕터 배열 책임). A1과 같은 취지(형식 결손을 0 폭탄으로 처리하지 않음). | **채택 확정 (2026-07-13, 인간)** |

> A2·A3는 A1과 **같은 성격**(앵커가 예상 못 한 형식을 0으로 처벌)이라 A1의 취지를 확장해 **함께 채택 확정**(2026-07-13, 인간). 세 건 모두 "형식 결손을 감점 폭탄으로 처리하지 않는다"는 원칙. 다음 세션은 셋을 동일하게 적용.

---

## B. 스키마 v1 후보 구조 — 학습 설계 관점

캘리브레이션 3파일에서 관찰된, 스키마 v0(`Question{scenario, choices[4], answer[], explanation}`)가 표현 못 하지만 학습 효과가 확인된 구조. (축2 SCHEMA_FEEDBACK와 중복되는 항목은 재현성 근거로 가치 상승.)

| # | 구조 | 근거 파일 | 학습 설계 근거 |
|---|---|---|---|
| B1 | **선택지별 해설 `choiceExplanations`** (오답마다 "왜 틀렸나 + 어떤 상황이면 정답이었나") | dva-chapter-template (q1·q2 options[].why) | L2 2점 앵커를 **스키마 수준에서 강제**. 서비스 선택 판단력의 핵심 |
| B2 | **자기설명 게이트** (해설 열기 전 "오답이 왜 틀렸는지 설명하라" 강제) | dva-chapter-template (QuizCard 자기설명 체크포인트) | 자기설명 효과 — 능동 인출을 구조로 유도 |
| B3 | **자유서술 자가채점 퀴즈 타입 `type: recall`** (선택지 없이 답 생성 → 모범답안 대조 → 자가 채점) | lambda-dva-study (ChQuiz) | 4지선다 강제 시 정보 손실. 인출연습 강도는 자유서술이 더 높음. **단 A1대로 L2는 N/A** |
| B4 | **혼합복습/교차학습 섹션 `interleave`** (인접 헷갈리는 서비스를 섞어 변별 훈련) | dva-chapter-template (mixed[]) | L8 누적 복습 메커니즘. "다음 챕터부터 이전 챕터 문항 누적" 설계 의도 명시됨 |
| B5 | **인출 카드 `retrievalCards`** (질문만 노출 → 탭하면 정답 + "왜?" 정교화 질문) | dva-chapter-template (concepts[]) | 인출연습 + 정교화. 개념 블록마다 L1 밀도 확보 |
| B6 | **인터랙티브 시뮬레이터** (파라미터 조작형 — 동시성 슬라이더, 콜드/웜 타임라인, 카나리 가중치) | lambda-dva-study, aws-lambda-dva-guide-2 | 능동적 조작 학습. 정적 md로 표현 불가 — 렌더러 복잡도 트레이드오프는 인간 판단 |
| B7 | **빈출도 태그 `examFrequency`** (섹션별 시험 출제 빈도 ★1~5) | aws-dva-messaging (SECTIONS[].freq) | 학습 우선순위 신호. 축2 SCHEMA_FEEDBACK에서도 8개+ 파일 재현(최강 재현성) |

---

## C. 전수 배치(28파일) 관찰 — 앵커/스키마 추가 제안 (2026-07-14, 전수 완료)

> 캘리브레이션 3파일 이후 나머지 25파일까지 전수 평가 완료. 코퍼스 전역에서 재현된 패턴과 앵커가 예상 못 한 2개 형식(첫 챕터·미매핑 파일)을 아래에 기록. **모두 제안이며 인간 미결.**

### C-1. 코퍼스 전역 패턴 (생성 프롬프트/스키마 개선 근거)

| # | 관찰 | 데이터 | 제안 |
|---|---|---|---|
| C1 | **L6(선행 지식 연결)이 28/28 파일 전부 1점.** 어떤 파일도 선행 커리큘럼 챕터를 명시 지목("0-2장의 X가 여기 적용")하지 않음. 동일 챕터 내부 모듈 교차링크·강의번호 참조·서비스명 배경 언급만 존재. | L6 평균 1.00 (분산 0) | 생성 프롬프트에 **"각 개념 블록에 선행 챕터 id 1개 이상 명시 역참조"** 체크리스트 강제. 스키마에 `prerequisiteRefs: [{chapterId, concept}]` 필드를 두면 L6=2를 구조로 유도. |
| C2 | **퀴즈·해설 성분이 26/28 파일에 전무** → L1·L2·L7·L8 대량 N/A(부분 평가). 코퍼스는 설명·도식은 견고하나 **능동 인출 장치가 희소**. | 퀴즈 보유 2파일(template·lambda-study)뿐 | 최대 산출물 = 보충 생성. 각 파일의 "시험 포인트/결정표/시험 단서" 콜아웃이 이미 시나리오→정답을 담아 **문항 전환 소재로 준비됨**. 스키마 `examScenario{stem, answer, trap}` 필드로 콜아웃을 문항으로 자동 승격. |
| C3 | **역설: 퀴즈 보유 2파일이 오히려 L3(예시 결합) 낮음(1점).** 개념-예시를 퀴즈 섹션으로 분리(template)하거나 코드 예시 부재(lambda-study). 반면 설명형 26파일은 개념 직후 도식·코드·시나리오 인접으로 L3=2. | L3: 퀴즈파일 avg 1.0 vs 설명형 avg ~2.0 | 신규 생성 시 "개념 블록 내부에 예시 인라인 결합 + 별도 인출 문항" 둘 다 요구(택일 금지). |
| C4 | **L5=1(경미 이탈) 3파일은 전부 챕터 경계 중복.** stage0(IAM을 0-2와 중복), iam-guide-2(CloudShell을 0-1로), ec2(Budgets). 시험 무관 분량이 아니라 **파일 경계 설계 문제**. | L5=1: 3파일 / L5=2: 24 / N/A: 1 | 변환 단계에서 챕터 경계 재정의. 중복 쌍(S3·APIGW·IAM·메시징·CICD)도 통합 대상. |

### C-2. 앵커 추가 제안 (형식이 앵커 밖이라 채점 곤란했던 지점 — A1~A3 취지 확장)

| # | 항목 | 문제 | 제안 | 인간 결정 |
|---|---|---|---|---|
| **A4** | **L6 — 최선두/기반 챕터** | 0-1(aws-dva-stage0)처럼 **역방향 선행 챕터가 구조상 없는** 최선두 파일을 L6=0/1로 처벌하면 A3(단일챕터 L8)와 동일한 "형식 결손 폭탄". | **최선두(선행 챕터 없음) 파일 → L6 N/A, 유효 만점 제외.** | **✅ 확정 (a), 2026-07-14** — stage0 L6=N/A 적용(6/8→5/6=83.3%, 판정 수정 유지) |
| **A5** | **L5 — 커리큘럼 미매핑 파일** | aws-vpc-guide는 시험 out-of-scope이나 인벤토리 단계에서 보존 결정됨. 축2가 매핑 챕터 없음을 이유로 범위이탈 근거를 유보. | **미매핑 여부는 파일 존치(메타 결정)로 처리, L5는 파일 내부 이탈 유무만 본다 → 내부 이탈 없으면 L5=2.** | **✅ 확정 (b), 2026-07-14** — vpc L5=2 적용(5/6→7/8=87.5%, **판정 통과**). 존치=(a) 부록/보너스 격리 |

### C-3. 스키마 v1 추가 후보 (전수에서 재현 확인)

| # | 구조 | 근거 파일(다수) | 근거 |
|---|---|---|---|
| B8 | **결정표/단서-매칭표 `decisionTable`** (시험 지문 신호 → 정답 서비스/설정 2열) | aws_api_gateway_dva, aws-vpc-guide, security-guide-1, elastic-beanstalk, dva-cicd 등 다수 | 축2 SCHEMA_FEEDBACK B와 중복 재현(최강급). DVA 문제 형식(시나리오→선택)과 1:1. L1 문항의 정답·오답 원형으로 직접 승격 가능. |
| B9 | **진리표/케이스 매트릭스 `caseMatrix`** (조건 조합 → 결과) | aws-dva-iam-guide-2(정책 평가 4문형: IAM정책×버킷정책→결과) | 조합형 문항 자동 생성 입력. |
| B10 | **라인별 주석 코드블록 `annotatedCode`** (코드 + 라인별 해설) | iam_guide, aws-dva-iam-guide-2, cloudformation, cdk | L3=2를 스키마 수준에서 강제. |

---

## D. 스키마 v1 후보 통합 체크리스트 (인간 확정용 초안, 2026-07-14)

> RUBRIC §5-4 "스키마 v1 확정"을 위한 축1 관점 통합 초안. 축1 B1~B10 + 축2 SCHEMA_FEEDBACK(44건) 재현 최강 후보를 병합했다.
> **AI는 v1을 확정하지 않는다(제안만).** 인간이 `채택/보류/논의` 칸을 정하면 그것이 v1 게이트가 된다. `☐`에 O/X 표기 후 이 표가 v1 명세의 근거가 된다.
> 지위: v0 = `Chapter{...sections[], finalQuiz[]}` / `Section{objectives[], body, examples, examPoints[], miniQuiz[]}` / `Question{scenario, choices[4], answer[], explanation}`.

### D-0. 코어 (v0 계승 — 유지 권장)
| # | 필드/구조 | 정의 | 권장 | ☐ |
|---|---|---|---|---|
| K1 | `Chapter{id, phase, title, domain, examWeight, prerequisites[], sections[], finalQuiz[]}` | 챕터 뼈대 | **유지** | ☐ |
| K2 | `Section{id, title, objectives[], body(md), examPoints[]}` | 개념 블록 뼈대 | **유지** | ☐ |
| K3 | `Question{id, scenario, choices[4], answer[], explanation}` | 4지선다 기본형 | **유지(단 아래 Q필드로 확장)** | ☐ |

### D-1. 문항·해설 강화 (L1·L2·L7을 스키마로 강제)
| # | 필드 | 정의/구조 | 강제 항목 | 근거·재현성 | 권장 | ☐ |
|---|---|---|---|---|---|---|
| Q1 | `choiceExplanations` = `choices[].{text, why, wouldBeCorrectWhen}` | 오답마다 "왜 틀렸나 + 어떤 상황이면 정답이었나" | **L2=2** | dva-chapter-template(구현 확인). 축1·축2 공통 제안 | **채택**(L2 앵커를 구조로 강제) | ☐ |
| Q2 | `type: "mcq" \| "recall" \| "truefalse" \| "order"` | 문항 타입. `recall`=자유서술 자가채점(선택지 없음) | L1 강화, A1 연동(recall→L2 N/A) | lambda-dva-study(ChQuiz) | **채택** | ☐ |
| Q3 | `recallAnswer{modelAnswer, rubricPoints[], commonTraps[]}` | recall형의 모범답안 + 채점 포인트 + 흔한 함정 | L2 N/A 보완(자가채점 품질) | lambda-dva-study | **채택** | ☐ |
| Q4 | `selfExplainGate: bool` | 해설 열기 전 "오답이 왜 틀렸는지 설명" 강제 | 능동 인출(L1) | dva-chapter-template(QuizCard) | **채택**(렌더러 단순) | ☐ |
| Q5 | `difficulty: "direct" \| "scenario" \| "trivia"` | 난이도/유형 태그 | **L7 자동 산출** | 전 파일 시험포인트 콜아웃이 사실상 scenario | **채택**(L7을 계산 가능하게) | ☐ |
| Q6 | `Section.retrievalCards[] = {q, a, elaboration}` | 개념 블록마다 질문 우선 카드(탭→정답+"왜?") | **L1 밀도** | dva-chapter-template(concepts) | **채택** | ☐ |

### D-2. 예시·선행연결 강화 (L3·L6을 스키마로 강제 — 코퍼스 최대 약점 대응)
| # | 필드 | 정의/구조 | 강제 항목 | 근거·재현성 | 권장 | ☐ |
|---|---|---|---|---|---|---|
| E1 | `prerequisiteRefs[] = {chapterId, concept, appliedAs}` | 개념 블록이 재사용하는 **선행 챕터 명시 지목** | **L6=2** | **없음(28/28 파일 L6=1)** → 정확히 이 결손을 메움 | **채택 최우선**(L6이 코퍼스 유일 구조 약점) | ☐ |
| E2 | `Section.annotatedCode[] = {lang, code, lineNotes[]}` | 코드 + 라인별 해설 | **L3=2** | iam_guide·iam-guide-2·cloudformation·cdk | **채택** | ☐ |
| E3 | `Section.examples inline 강제`(개념 블록 내부 배치) | 예시를 퀴즈로 분리 금지, 개념 직후 결합 | L3(퀴즈파일 L3=1 역설 방지) | template·lambda-study 반례 | **채택**(배치 규칙) | ☐ |

### D-3. 구조·비교 (L5·L7 지원, 문항 자동 생성 소스)
| # | 필드 | 정의/구조 | 근거·재현성 | 권장 | ☐ |
|---|---|---|---|---|---|
| S1 | `decisionTable[] = {signal, answer, why}` | 시험 지문 신호 → 정답 매핑표 | **축1·축2 공통 최강 재현**(api_gateway_dva·vpc·security-1·beanstalk·dva-cicd 등 다수) | **채택**(문항 자동 승격 소스) | ☐ |
| S2 | `caseMatrix{axes[], cases[]}` | 조건 조합 → 결과 진리표 | iam-guide-2(정책 평가 4문형) | **채택** | ☐ |
| S3 | `comparisonTable{head[], rows[]}` | 두 서비스/옵션 대비표 | security-1 등 다수 | **채택** | ☐ |
| S4 | `interleave[] = {scenario, service, contrast}` | 혼합복습(인접 헷갈리는 서비스 변별) | **L8 메커니즘** | dva-chapter-template(mixed) | **채택** | ☐ |
| S5 | `examFrequency: 1~5` (Section/Chapter) | 빈출도 태그 | **축2 최강 재현(8+ 파일 독자 구현)** | **채택** | ☐ |

### D-4. 렌더러 트레이드오프 (인간 판단 — 앱 복잡도 vs 학습가치)
| # | 필드 | 정의 | 근거 | 권장 | ☐ |
|---|---|---|---|---|---|
| R1 | `interactiveSim{type, params[]}` (동시성 슬라이더·콜드/웜 타임라인·카나리 가중치·트래픽 전환·정책 평가 토글) | 파라미터 조작형 능동 학습 장치. **L3 기여(L1 아님 — 채점형 문항 아님)** | lambda-study·lambda-2·iam_guide·beanstalk·sam·cognito·container | **논의**(정적 md 미표현, 렌더러 복잡도 ↑ — v1 필수 vs 선택 결정 필요) | ☐ |
| R2 | `clickableDiagram{nodes[], detailPanel}` | 노드 클릭→설명 패널. 이중부호화 | vpc·cognito·container 등 | **논의**(R1과 동일 트레이드오프) | ☐ |

### D-5. 축1이 권하는 v1 필수 게이트 규칙 (구조 위반 시 신규모드 재작성 사유 후보)
| # | 규칙 | 근거 항목 | 권장 |
|---|---|---|---|
| G-a | 모든 `Section`에 `miniQuiz` ≥1 (recall 허용) | L1 대량 N/A(26/28) 방지 | **채택** |
| G-b | 모든 mcq는 `choiceExplanations` 필수 | L2=2 강제 | **채택** |
| G-c | 모든 `Section`에 `prerequisiteRefs` ≥1 (최선두 챕터 예외=A4) | L6 결손(28/28) 방지 | **채택** |
| G-d | 예시는 `Section` 내부 결합(별도 퀴즈 분리 금지) | L3 역설 방지 | **채택** |

> **요약**: 코퍼스의 강점(L3·L4)은 유지하고, **최대 결손인 L6(선행연결)·퀴즈/해설(L1·L2)을 스키마 필수 필드(E1·Q1·Q6 + 게이트 G-a~G-d)로 강제**하는 것이 v1의 핵심 설계 방향. 인터랙티브(R1·R2)만 렌더러 복잡도 때문에 인간 판단이 필요.

---

## E. CONTRACT_PREWORK §2-4 대조 — v1 확정 결정시트 (축1 학습설계 관점, 2026-07-14)

> develop에 이미 **`docs/CONTRACT_PREWORK.md`(기술·3파일 스트레스)** 와 **`docs/LEARNING_LOOP_DRAFT.md`(Leitner 자동채점 루프)** 가 규약 v1을 co-design 중임을 확인. 두 문서 모두 **mc(4지선다) 자동채점을 전제**한다.
> 본 §E는 §A~§D(축1 28파일)를 그 v1 초안에 **대조**해 인간의 v1 확정을 돕는 결정시트다. §D는 축1 단독 관점, **§E는 세 문서 통합 관점 — 충돌 시 §E가 §D를 정정한다.** (프리워크가 3파일만 봤고 축1은 28파일을 봤으므로, 커버리지가 다른 지점에서 축1이 보강한다.)

### E-1. 이미 수렴 — 확정만 하면 되는 항목 (3문서 합의)
| 필드/규칙 | CONTRACT_PREWORK | 축1 근거 | 상태 |
|---|---|---|---|
| `choiceExplanations?` (선택지별 해설) | §2-4 신설(optional) | B1·Q1 = L2 앵커 강제 | **합의** |
| `concept: string[]` (복수화) | §2-4 단수→배열 | L8 이전챕터 결합문항 = 본질적 다개념 | **합의** (LEARNING_LOOP §2-3도 소비: concept별 숙달) |
| 빈 `quiz: []` 적법 | §2-4 명문화 | 26/28 파일이 퀴즈 X | **합의** |
| `fixedChoiceOrder?` 예약 | LEARNING_LOOP §1(셔플 예외) | 축1 무이견 | **합의(예약)** |

### E-2. 축1 28파일이 강화/추가하는 결정 (3파일로는 안 드러난 것)
1. **[강화] `choiceExplanations` 신규모드 의무화** — 프리워크는 optional/TBD로 둠. 축1 근거: **L2가 27/28 파일 N/A**(레거시 전면 결손), 유일 보유 `dva-chapter-template`만 L2=2. optional로 두면 이 결손이 신규 콘텐츠에도 재생산됨 → 신규모드 mc는 `choiceExplanations` **의무화** 권장(§D G-b).
2. **[NET-NEW · 최중요] 선행 지식 연결(L6)** — CONTRACT_PREWORK §2-4·LEARNING_LOOP 어디에도 대응 없음(3파일 스트레스는 기술 변환만 봄). 축1 근거: **L6=1이 28/28**(코퍼스 유일 구조적 약점, 평균 1.00 분산 0). 단 이건 **quiz 필드가 아니라 본문/개념블록 속성**이라 두 경로로 제안:
   - **(a) 즉시 — 생성 프롬프트 규칙**: 각 개념 블록에 `chapterMeta.prerequisites[]`의 챕터 1개 이상을 명시 인용("0-2장의 신뢰 정책이 여기 실행역할로 적용"). **`prerequisites[]`는 v0 meta에 이미 존재** → 신규 필드 불요, **활용 규칙**만 추가하면 L6=2를 유도.
   - **(b) 후속 — 섹션 개념 도입 시**: LEARNING_LOOP §2-3이 "섹션 개념"을 v1 유보로 둠. 섹션이 정식화되면 `section.prerequisiteRefs[]{chapterId, concept}`로 구조화(§D E1).
   - → **최소안 = (a) 생성 규칙 즉시 채택**, (b)는 섹션 확정 시.
3. **[이견 · 논의 필요] `recall` 타입** — CONTRACT_PREWORK는 v1 **"mc only"**, recall/flashcard는 본문잔류/예약. 축1 근거: **최대 결손이 인출연습(L1 26/28 N/A)** 이고 recall(자유서술 자가채점)이 인출 강도 최고(앵커 A1·§B B3). **그러나** LEARNING_LOOP의 Leitner 자동채점(answer 인덱스·선택지 셔플·상자 승강)은 **mc를 전제** — recall은 자가보고 채점이라 루프에 그대로 안 맞음(정당한 기술 제약).
   - → **절충 권장**: v1은 **mc-only 유지**(루프 정합 우선). recall 콘텐츠는 (i) 표준화/생성 때 **mc로 변환 생성** + (ii) **본문 인출 카드**(retrievalCards, 채점 없는 능동 인출)로 병존. `recall` 정식 type은 **자가보고 채점 설계와 함께 v1.1**로. (→ §D Q2를 이 선으로 하향 정정.)

### E-3. freq · 스키마 밖 항목
- **freq(빈출도)**: CONTRACT_PREWORK 미결(§2-4 ③), 축1 §D S5. 실물 대다수(stage0·s3·security-1)에서 **섹션 헤더 속성** → 섹션 정식화 시 `section.freq`. 그 전엔 chapterMeta 섹션맵 또는 유보.
- **decisionTable/caseMatrix/annotatedCode**(§D S1·S2·B10): **quiz 필드가 아님** → 본문 표현 + **문항 자동 생성 소스**. v1 스키마 밖(변환/생성 소관). CONTRACT_PREWORK §1-D의 "본문 네거티브 규정"과 함께 변환 단계에서 다룰 것.

### E-4. v1 확정 결정시트 (인간 O/X — 이 표가 v1 게이트 근거)
| # | 결정 | 권장 | 근거 | ☐ |
|---|---|---|---|---|
| 1 | `choiceExplanations` 신규모드 mc **의무화**? | **예** | L2 27/28 N/A → 결손 재생산 방지 | ☐ |
| 2 | `concept: string[]` 확정? | **예** | 3문서 합의, L8 정합 | ☐ |
| 3 | 빈 `quiz:[]` 적법 명문화? | **예** | 26/28 퀴즈X | ☐ |
| 4 | L6 선행연결 = **생성 프롬프트 규칙**(meta.prerequisites 활용) 채택? | **예** | 코퍼스 유일 구조 약점(28/28), 신규 필드 불요 | ☐ |
| 5 | `recall`: v1 **mc-only 유지** + recall은 **v1.1**? | **예** | Leitner 자동채점 정합, recall은 mc변환+본문카드 병존 | ☐ |
| 6 | `freq`: 섹션 정식화 시 `section.freq`? | **예** | 섹션 헤더 속성 실증 | ☐ |
| 7 | `fixedChoiceOrder?` optional 예약? | **예** | LEARNING_LOOP 셔플 예외 | ☐ |

> **한 줄 요약**: 프리워크의 기술 v1(mc·choiceExplanations·concept[])은 그대로 두되, 축1이 **① choiceExplanations 의무화 ② L6 선행연결을 생성 규칙으로 강제(meta.prerequisites 활용) ③ recall은 v1.1로 절충**을 더한다. 신규 필드 추가는 최소(사실상 0) — 대부분 **기존 필드 활용 규칙 + 생성 프롬프트 규칙**으로 해결된다.
