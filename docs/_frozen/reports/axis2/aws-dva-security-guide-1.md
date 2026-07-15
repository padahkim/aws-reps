# 축2 리포트: aws-dva-security-guide-1

모드: 레거시 / 성분 태그: 설명 O · 예시 O(코드·CLI·SVG 시나리오) · 퀴즈 X · 해설 X / 매핑 챕터: 3-2 KMS, 3-3 Secrets Manager·SSM·ACM / **판정: 수정**

> 고엄밀 배치. AWS MCP(aws___search_documentation/read_documentation)를 스크래치패드 mcp.sh로 직접 호출해 검증. 캐시: docs/VERIFIED_FACTS.md(신규 KMS/SSM/Secrets Manager/CloudWatch Logs 사실 다수 미등재였음 — 이번에 신규 확보).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| KMS 대칭 키 요청 쿼터: "리전에 따라 5,500 / 10,000 / 30,000" (섹션05 표) | 수치 | **수정 필요** | 현행: "5,500 또는 10,000 또는 **50,000**(리전에 따라)" — 30,000이 아니라 최대 50,000까지 존재 | https://docs.aws.amazon.com/kms/latest/developerguide/requests-per-second.html |
| RSA 2048 비대칭 작업 쿼터: "500" (섹션05 표) | 수치 | **수정 필요** | 현행: RSA 키 전체(2048/3072/4096 등)가 **공유 쿼터 1,000**/초 — 키 크기별 구분 없음 | 위와 동일 URL |
| ECC 비대칭 작업 쿼터: "300" (섹션05 표) | 수치 | **수정 필요** | 현행: ECC(+SM2) **공유 쿼터 1,000**/초 | 위와 동일 URL |
| "가져온(Imported) 키: 자동 교체 불가 — 별칭을 이용한 수동 교체만 가능" (섹션02 Ul) | 동작(시험 포인트) | **수정 필요** | 현행: Imported(EXTERNAL origin) 대칭 키는 **온디맨드 로테이션(RotateKeyOnDemand) 지원** — "수동(별칭 교체)만 가능"은 구식. (자동 스케줄 로테이션은 여전히 불가) | https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html · https://aws.amazon.com/blogs/security/how-to-use-on-demand-rotation-for-aws-kms-imported-keys/ |
| AWS 관리형 키: "1년마다 자동 교체(강제, 변경 불가)" | 동작 | 확인됨 | "AWS KMS always rotates the key material for AWS managed KMS keys every year" | https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html |
| 고객 관리형 키: "자동 교체 활성화 필요, 기본 1년 주기" | 동작+수치 | 확인됨 (부분 갭) | 확인. 단, 커버리지 갭: 현행은 `RotationPeriodInDays`로 **90일~2,560일(약 7년)** 커스텀 가능 — 콘텐츠에 미언급 | 위와 동일 URL |
| Encrypt API 4KB(4,096바이트) 한도 | 수치 | 확인됨 | "Encrypts plaintext of up to 4,096 bytes" | https://docs.aws.amazon.com/cli/v1/reference/kms/encrypt.html · https://aws.amazon.com/kms/faqs/ |
| KMS vs CloudHSM 비교표: "KMS = FIPS 140-2 Level 2(일부 Level 3)" | 수치 | **수정 필요** | 현행: AWS KMS는 2023-05부터 **FIPS 140-2 Level 3** 인증 HSM 사용, 현재는 **FIPS 140-3 Level 3** 검증 HSM으로 전환 — CloudHSM과 동일하게 Level 3. "Level 2" 서술은 구식이며 시험 함정 포인트(KMS vs CloudHSM 구분 근거)로 쓰이는 만큼 시급 | https://aws.amazon.com/blogs/security/aws-key-management-service-now-offers-fips-140-2-validated-cryptographic-modules-enabling-easier-adoption-of-the-service-for-regulated-workloads/ · https://aws.amazon.com/compliance/fips/ |
| CloudHSM: FIPS 140-2 Level 3 | 수치 | 확인됨 | "Yes, CloudHSM provides FIPS 140-2 Level 3 validated HSMs" | https://aws.amazon.com/cloudhsm/faqs/ |
| 암호화된 스냅샷/AMI 교차 계정 공유: "고객 관리형 키(CMK)만 가능, AWS 관리형 키(aws/ebs)는 불가" | 동작(시험 포인트) | 확인됨 | "You can share encrypted snapshots and AMIs using a customer-managed customer master key (CMK) with other AWS accounts" | https://aws.amazon.com/ebs/faqs/ |
| SSM Standard: 파라미터 10,000개/4KB · Advanced: 100,000개/8KB, 파라미터당 월 $0.05 | 수치 | 확인됨 | 동일(표 수치 일치) | https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html |
| Secrets Manager: KMS 암호화 필수 (SSM은 선택) | 동작(시험 포인트) | 확인됨 | "Secrets Manager encrypts at rest using encryption keys that you own and store in AWS KMS" — 봉투 암호화로 시크릿마다 고유 데이터 키 사용 | https://aws.amazon.com/secrets-manager/faqs/ · https://docs.aws.amazon.com/secretsmanager/latest/userguide/security-encryption.html |
| RDS `ManageMasterUserPassword: true` — RDS가 Secrets Manager에 시크릿 자동 생성+로테이션 자체 관리 | 동작(시험 포인트) | 확인됨 | "we recommend you use ManageMasterUserPassword... Amazon RDS creates the secret and manages rotation for you" | https://docs.aws.amazon.com/secretsmanager/latest/userguide/cfn-example_RDSsecret.html |
| CloudWatch Logs KMS: "콘솔에서는 KMS 키를 연결할 수 없고, CLI/API 전용" | 동작(시험 포인트) | 확인됨 (경미한 정밀화 필요) | 문서 정확 문구: "You **can't associate** a KMS key with an **existing** log group using the CloudWatch console." — 콘텐츠는 이 제약을 로그 그룹 생성 시점 구분 없이 서술. 신규 로그 그룹 생성 시 콘솔에서 KMS 키 지정이 가능한지는 이 패스에서 별도 미확인(참고만) | https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/encrypt-log-data-kms.html |
| S3 버킷 키: SSE-KMS API 호출·비용 최대 99% 절감 | 수치 | 확인됨 (캐시 재사용) | 동일 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html (VERIFIED_FACTS 기존 등재) |
| KMS 키는 리전 종속, 리전 간 스냅샷 복사 시 대상 리전 키로 재암호화 | 동작 | 확인됨(일반 통념 — 문서 스니펫 미확보, 오래 정착된 AWS 공식 동작으로 판단, 시험 포인트 오류 위험 낮음) | — | — |
| GenerateDataKey/봉투 암호화 절차 서술 | 동작 | 확인됨(일반 통념 — KMS 공식 아키텍처 패턴과 부합, 상세 문서 재조회는 생략) | — | — |
| 데이터 키 캐싱(LocalCryptoMaterialsCache)으로 KMS 호출 절감 | 동작 | 확인됨 | 문서에서 "If you are exceeding the request quota for GenerateDataKey, consider using the data key caching feature of the AWS Encryption SDK" 명시 | https://docs.aws.amazon.com/kms/latest/developerguide/requests-per-second.html |

## Task 커버리지 (담당: Task 2.2 암호화 구현, 2.3 민감 데이터 관리)

- **커버**: 저장/전송 중 암호화(2.2.1), KMS 키 사용(2.2.5), 교차 계정 암호화(2.2.6), 키 로테이션(2.2.7), 시크릿 관리 서비스(2.3.3, SSM·Secrets Manager) — 예시(CLI, buildspec.yml, CloudFormation 동적 참조)가 개념 직후 배치되어 커버 수준 양호
- **부분 갭**: 인증서 관리(2.2.2, ACM/Private CA) — ACM 언급이 CloudFormation 섹션 표에만 짧게 나오고 별도 개념 블록 없음. Private CA는 전무
- **부분 갭**: 클라이언트 vs 서버 측 암호화(2.2.4) — 개념은 있으나(섹션01) "개발용 인증서·SSH 키"(2.2번 Task 키워드) 사례 없음
- **부분 갭**: 데이터 새니타이즈·앱 수준 마스킹(2.3.4~5), 멀티테넌트 데이터 접근 패턴(2.3.6, EXAM_TASK_MAP 부분 갭으로 기 보고됨) — 이 파일에도 없음. Cognito 가이드의 Policy Variable 패턴이 부분적으로 대응하나 이 파일 범위 밖

## 범위 이탈 (축1 L5 참조용)

- 없음. 전 섹션이 3-2·3-3 챕터 범위 내(Nitro Enclaves·CodeBuild 보안도 암호화/시크릿 관리 문맥에서 다뤄짐 — 범위 이탈 아님).

## 출제 각도 부정합

- 없음. Task 동사("구현·보호·관리") 대비 시나리오·시험 포인트 콜아웃·"10초 요약" 표가 출제 각도(정답 방향 매칭)를 직접 제시. KMS 한도·비교표·SSM vs Secrets Manager 비교표 등 "구현 판단" 형 서술이 우수.

## 폐기 문항 (레거시 F4)

- 해당 없음 (퀴즈 성분 없음 → F4 N/A).

## 수정 지시 (실행 가능하게)

1. **섹션05 KMS 한도 표 3행 전체 수정**: "5,500 / 10,000 / 30,000" → "5,500 / 10,000 / 50,000(리전별)", "RSA 2048: 500" → "RSA(2048/3072/4096 등 전체): 공유 1,000", "ECC: 300" → "ECC/SM2: 공유 1,000". 근거: requests-per-second.html
2. **섹션02 "자동 키 교체" 불릿 — 가져온 키 항목 수정**: "자동 교체 불가 — 별칭을 이용한 수동 교체만 가능" → "자동(스케줄) 교체는 불가하나, **온디맨드 로테이션(RotateKeyOnDemand)은 지원**(별칭 방식 수동 교체도 여전히 가능)". 근거: rotate-keys.html
3. **섹션02 "자동 키 교체" 불릿 — 고객 관리형 키 항목 보강**: "기본 1년 주기" 뒤에 "(RotationPeriodInDays로 90일~2,560일 커스텀 가능)" 추가.
4. **섹션07 KMS vs CloudHSM 비교표 "표준" 행 수정**: "FIPS 140-2 Level 2(일부 Level 3)" → "FIPS 140-2/140-3 **Level 3**(2023-05부터)". 이 행이 "KMS vs CloudHSM 구분" 시험 포인트의 근거로 쓰이므로 최우선 수정 대상 — 현재 문서상 두 서비스 모두 Level 3라 기존 구분 논리(테넌시 차이는 여전히 유효)만 남기고 FIPS 레벨을 구분 근거에서 제외하거나 "둘 다 Level 3, 차이는 테넌시/키 관리 주체"로 재구성 권고.
5. **(보충 생성 목록)** ACM/Private CA 개념 블록, 클라이언트 측 암호화의 개발용 인증서·SSH 키 사례, 데이터 새니타이즈·마스킹 패턴 — 3-3 챕터 보강 필요.

## 스키마 피드백 요약

- "시험 직전 10초 요약" 표(문제 속 키워드 → 정답 방향 매핑)와 섹션별 "숨은 함정" Callout 유형 → docs/SCHEMA_FEEDBACK_AXIS2.md에 제안 기록.

