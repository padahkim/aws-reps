# 축1 보충 생성 & 변환 실행 계획 (변환 단계 입력)

> RUBRIC §5-5(변환) 입력. 28개 축1 리포트의 "보충 생성 목록" + `docs/CONTRACT_PREWORK.md §1`(작업량 프로파일) + `docs/SCHEMA_FEEDBACK_AXIS1.md §E`(v1 결정)을 통합.
> **전제**: v1 확정(§E-4 결정시트) 및 축2 「높음/중간」 사실 수정 후 실행. 「높음」 4건은 완료(develop f146138). 이 문서는 *무엇을 얼마나 어떤 순서로* 생성/변환할지의 지도이며, 실제 생성·변환은 별도 세션(콘텐츠 생성/표준화) 소관.

---

## 1. 전역 생성 규칙 (전 파일 공통 — §E 결정 반영)
1. **문항 = mc + `choiceExplanations` 의무**(§E-4 #1·#5). 오답마다 "왜 틀렸나 + 어떤 상황이면 정답(`wouldBeCorrectWhen`)". recall 콘텐츠는 mc 변환 + 본문 인출카드 병존(recall 정식화는 v1.1).
2. **L6 선행연결**: 각 개념 블록에 `chapterMeta.prerequisites[]`의 챕터 1개 이상 명시 인용("0-2장 신뢰 정책이 여기 실행역할로")(§E-4 #4). 신규 필드 불요 — 기존 meta 필드 + 생성 규칙. **28/28 전 파일 대상**(코퍼스 유일 구조 약점).
3. **문항 소재 = 기존 콜아웃**: 각 파일의 "시험 포인트/결정표/시험 단서/치트시트/N문형" 콜아웃은 이미 시나리오→정답 구조 → **직접 4지선다 승격**(오답지 = 인접 서비스/옵션 혼동). 생성 비용 최저.
4. **`concept[]` 태그** 부여(LEARNING_LOOP 숙달·약점 계산용, 복수 귀속으로 L8 결합문항 지원).
5. **정확성 게이트**: 해당 파일 축2 「높음/중간」 수정 완료 후 생성(오류를 문항 정답으로 굳히지 않기).

---

## 2. 도메인 우선순위 (시험 비중 × 준비도)
시험 비중(RUBRIC §1): **개발 32% · 보안 26% · 배포 24% · 트러블슈팅·최적화 18%**.

| 우선 | 도메인(비중) | 챕터·파일 | 보충 준비도 |
|:--:|---|---|---|
| **P1** | 개발 32% | 1-1 S3(s3-dva·dva-s3) · 1-2 Lambda(lambda-guide·-2·study) · 1-3 DynamoDB · 1-4 API GW(2파일) · [기반]0-1·0-2 | 높음 — 결정표·시험포인트 풍부. template가 문항 골든샘플 |
| **P2** | 보안 26% | 0-2 IAM(iam_guide·iam-guide-2) · 3-1 Cognito · 3-2·3-3 security-1 | 높음 — security-1 "10초 요약"·iam-2 "4문형" 즉시 승격 |
| **P3** | 배포 24% | 4-0(ec2·elb-asg) · 4-1 container · 4-2 beanstalk · 4-3 CFN · 4-4 sam·cdk · 4-5 cicd(2파일) | 중간 — 결정표 있음. **축2 「높음」(ECS·CodeCommit)은 수정 완료** |
| **P4** | 트러블슈팅 18% | 5-1·5-2·5-3 monitoring · 5-4 rds | 중간 — monitoring 골든샘플(L3), rds 의사코드 |
| 병행 | 이벤트통합(개발/배포 교차) | 2-1·2-2·2-4 messaging·messaging-visual | 높음 — messaging 종합통과, 소재 풍부 |
| 부록 | out-of-scope | vpc-guide | **정규 진도 제외**(존치=부록/보너스). 문항화 시 엔드포인트 오류 수정 후 |

---

## 3. 파일별 보충 명세 (챕터순)
> "문항 수 추정" = 개념 블록/최빈출 섹션 기준 대략치. "중복 쌍"은 변환 시 통합 후 1세트만 생성.

### 기반 (0단계)
- **aws-dva-stage0** (0-1, 수정 5/6): 4섹션(리전/IAM/API/요금) → mc 각 2~3문항(≈10). 소재: `.exam`·`.summary` 체크리스트 7항. L6=N/A(A4 최선두, 브리지 불요). **정적 HTML→JSX 변환**(class→className, 전역CSS 스코핑, 폰트CDN 처리) — CONTRACT_PREWORK 1-B.
- **iam_guide + aws-dva-iam-guide-2** (0-2, 중복쌍): **통합**(iam-guide-2를 정본, iam_guide의 `EvalEngine` 시뮬레이터 흡수). 최빈출 §평가로직·Role/STS·정책유형 → mc(≈12). 소재: iam-2 "정책 평가 4문형" 표=진리표 문항 직접, iam_guide 치트시트 8항. L6: 0-1 자격증명체인 역참조.

### 개발 (1단계, P1)
- **aws-s3-dva-guide + aws-dva-s3-guide** (1-1, 중복쌍): 통합. 최빈출 보안/암호화/스토리지클래스 → mc(≈12). 소재: Exam 콜아웃 17개(시나리오→클래스). L6: 0-2 IAM 버킷정책·3-2 KMS.
- **aws-lambda-dva-guide(+-2, study)** (1-2, 3파일): guide를 본문 정본(실코드·VPC 커버 완결), -2의 시뮬레이터·study의 recall 흡수. mc(≈14). study의 자유서술 10문항 → mc 변환. L6: 0-2 IAM 실행역할·2-1 SQS ESM.
- **dynamodb-guide** (1-3): 25섹션 → 최빈출 mc(≈12). 소재: 결정표·시험포인트·치트시트. **축2 수정값 사용**(TTL "며칠"·용량모드 24h당 4회). L6: 0-2 IAM.
- **aws-dva-api-gateway + aws_api_gateway_dva** (1-4, 중복쌍): 통합. mc(≈12). 소재: api_gateway_dva 결정표(인증 상황→선택)·문제풀이 공식. L6: 1-2 Lambda 프록시.
- **dva-chapter-template** (1-2·1-3·1-4 종합): **문항 골든샘플**(L1·L2·L7·L8 모두 2). 신규 생성의 **레퍼런스 구현**으로 사용. 커버리지 보강(축2)만 추가.

### 보안 (3단계, P2)
- **aws-cognito-guide** (3-1): 토큰3종·User/Identity Pool → mc(≈8). **축2 커버리지 갭(토큰 용도·수명) 선보강 후 문항화**. L6: 0-2 IAM 신뢰정책.
- **aws-dva-security-guide-1** (3-2·3-3): 14섹션 최빈출(KMS·봉투암호화·SSM vs Secrets) → mc(≈12). 소재: "10초 요약" 10행 직접 승격. **축2 「높음」 FIPS 수정 완료**. L6: 0-2 IAM·1-1 S3.

### 배포 (4단계, P3)
- **aws-dva-ec2-guide** (4-0, 수정 6/8): mc(≈8). **축2 「높음」 gp3 IOPS 수정 완료**. L5 개선: Budgets 섹션 정리. L6: 0-2 IAM 인스턴스프로파일.
- **aws-dva-elb-asg** (4-0): mc(≈8). 소재: Exam(NLB/GWLB 판단)·결정표.
- **aws-container-guide** (4-1): mc(≈10). **축2 「높음」 ECS IAM 수정 완료** — 문항은 Task Execution Role 기준. 소재: 결정표.
- **aws-elastic-beanstalk-guide** (4-2): mc(≈8). 소재: KEYWORDS(조건→정책). **축2 배포정책 6→5종 수정 후**.
- **cloudformation-dva-guide** (4-3): mc(≈10). 소재: Exam(!Ref vs !GetAtt)·체크리스트 14항.
- **aws-cdk-dva-guide + sam_guide** (4-4): 각 단독 유지(CDK·SAM 별개). cdk mc(≈8, 즉답표)·sam mc(≈10, 치트시트·함정체크). SAM은 갭 해소 완료.
- **aws-cicd-guide + aws-dva-cicd** (4-5, 중복쌍): 통합. mc(≈12). **축2 「높음」 CodeCommit GA복귀 수정 완료** — 문항은 "2025 재개방" 기준. 소재: appspec 훅 순서·결정표.

### 트러블슈팅 (5단계, P4)
- **aws-dva-monitoring** (5-1·5-2·5-3): **L3 골든샘플**. mc(≈12). 소재: SCompare 시나리오→정답·시험포인트. **축2 EMF 갭 선보강**. L6: 0-2 IAM·2-2 SNS.
- **aws-dva-rds-aurora-elasticache** (5-4): mc(≈8). 소재: 의사코드(Lazy vs Write-through). **축2 「중간」(Aurora 성능·Multi-AZ) 수정 후**.

### 이벤트 통합 (병행)
- **aws-dva-messaging + aws-messaging-visual-guide** (2-1·2-2·2-4, 중복쌍): 통합(messaging 종합통과=정본, visual의 CLI/KCL/KPL 흡수). mc(≈14). 소재: 시험포인트 콜아웃 다수. L6: 1-2 Lambda ESM.

### 부록
- **aws-vpc-guide**: 정규 문항화 보류(부록). 필요 시 비교표 "시험 단서" 행 승격, **단 엔드포인트 접근성 축2 수정 후**.

---

## 4. 변환 작업량 프로파일 (CONTRACT_PREWORK §1 기준)
| 프로파일 | 파일 | 파일당 표준화 | 특징 |
|---|---|---|---|
| 카드형(~40분) | dva-chapter-template | 판단 적음 | v0 정신에 가장 근접, 골든샘플 |
| 정적 HTML(~35분) | stage0 | 기계적 | HTML→JSX + 스타일 스코핑 |
| 인터랙티브(중) | lambda-study·-2·iam_guide·beanstalk·sam·cognito·container | 시뮬레이터 보존 | 능동장치=L3 자산, 유지 |
| 미니앱형(1.5~2h) | s3-dva·api-gateway·monitoring·security-1·cfn·cicd·rds·messaging 등 다수 | **판단 중심** | 사이드바·페이저·전역스타일 **셸 제거 수술** 필요 |

> **견적 원칙(CONTRACT_PREWORK §1-D-10)**: 표준화 견적은 파일 수가 아니라 **형식 유형 분포**. 미니앱형이 다수라 이 단계 견적을 지배 → 셸 제거 자동화(공용 레이아웃 치환) 스크립트가 ROI 최대.

---

## 5. 실행 순서 제안
1. **v1 확정**(§E-4 O/X) → 2. **중복쌍 6개 통합 결정**(S3·APIGW·IAM·메시징·CICD·Lambda3파일) → 3. **축2 「중간」 잔여 수정**(S3 50TB·VPC엔드포인트·Aurora 등, 「높음」은 완료) → 4. **P1(개발)부터 문항 생성**: template를 레퍼런스로 → 5. 도메인 비중순 P2→P3→P4 → 6. **L6 브리지는 전 파일 일괄**(생성 규칙에 포함) → 7. vpc 부록 처리.

> **문항 총량 대략**: 통합 후 ~18개 콘텐츠 단위 × 파일당 8~14문항 ≈ **180~220 mc 문항 + choiceExplanations**. template 골든샘플 패턴 복제로 품질 균일화.
