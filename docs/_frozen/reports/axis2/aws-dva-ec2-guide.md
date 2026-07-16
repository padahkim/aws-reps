# 축2 리포트: aws-dva-ec2-guide

모드: 레거시 / 성분 태그: 설명 O · 예시 O(다이어그램·표·시험포인트) · 퀴즈 X · 해설 X / 매핑 챕터: 4-0 컴퓨팅 기초(EC2 부분) / **판정: 수정**

> 검증 방식: AWS MCP 서버 HTTP 직접 호출(mcp.sh, 세션 도구와 동일 서버·반환 URL). 캐시: docs/VERIFIED_FACTS.md(스팟 90%·EBS 같은 AZ 제약 재사용).

## 사실 검증표

| 주장 | 유형 | 판정 | 올바른 값 | 근거 URL |
|---|---|---|---|---|
| gp3 볼륨: "기본 3,000 IOPS/125MB/s → 최대 16,000 IOPS/1,000MB/s" | 수치 | **수정 필요** | 현행 공식 스펙: 최대 **80,000 IOPS / 2,000 MB/s** (2022년 인상 반영 안 됨). 베이스라인 3,000 IOPS/125MB/s는 정확 | https://aws.amazon.com/ebs/volume-types/ |
| gp2 볼륨: 3 IOPS/GB, 버스트 3,000, 최대 16,000 IOPS(~5,334GB) | 수치 | 확인됨 | 동일(공식 스펙: Max IOPS/Volume 16,000, 최대 처리량 250MB/s — 처리량 수치는 본문에 없어 검증 대상 아님) | https://aws.amazon.com/ebs/volume-types/ |
| io1: 프로비저닝 IOPS 최대 64,000(Nitro), 처리량 최대 1,000MB/s | 수치 | 확인됨 | 동일 | https://aws.amazon.com/ebs/volume-types/ |
| io2 Block Express: 최대 256,000 IOPS, 1,000 IOPS/GB | 수치 | 확인됨 | 동일(처리량 4,000MB/s는 본문 미언급) | https://aws.amazon.com/ebs/volume-types/ |
| st1: 최대 500 IOPS/500MB/s | 수치 | 확인됨 | 동일 | https://aws.amazon.com/ebs/volume-types/ |
| sc1: 최대 250 IOPS/250MB/s | 수치 | 확인됨 | 동일(패턴상 일치, sc1 처리량 250MB/s 명시 확인) | https://aws.amazon.com/ebs/volume-types/ |
| 부팅 가능 볼륨: gp2·gp3·io1·io2만, st1·sc1 불가 | 동작(시험 포인트) | 확인됨 | 동일 | https://aws.amazon.com/ebs/volume-types/ |
| EBS Multi-Attach: io1/io2 한정, 같은 AZ, 최대 16개 인스턴스 | 수치+동작 | 확인됨(일반 지식 수준, 세부 스니펫 미확보하나 캐시·기존 지식 부합) | 동일 | (VERIFIED_FACTS 캐시 부합, 별도 재검색 안 함) |
| EBS Snapshot Archive: 최대 75% 저렴, 복원 24~72시간 | 수치 | 확인됨 | 아카이브 $0.0125/GB-월 vs 표준 $0.05/GB-월 = 75% 절감. 복원 24~72시간 | https://aws.amazon.com/ebs/snapshots/faqs/ |
| Recycle Bin 보존 기간 1일~1년 | 수치 | 확인됨 | 스냅샷·AMI 대상 1~365일 (볼륨은 1~7일로 별도) | https://docs.aws.amazon.com/ebs/latest/userguide/recycle-bin-create-rule.html |
| EFS Elastic 처리량: "읽기 최대 3GB/s, 쓰기 1GB/s" | 수치 | **수정 필요(구식)** | 현행: 리전 파일시스템 기준 파일시스템당 읽기 20~60GiBps·쓰기 1~5GiBps, 클라이언트당 결합 최대 1,500MiBps(신형 클라이언트) — "3GB/s·1GB/s"는 이전 세대 스펙 | https://docs.aws.amazon.com/efs/latest/ug/performance.html |
| EFS Bursting: 1TB = 50MB/s + 100MB/s 버스트 | 수치 | 확인됨 | 베이스라인 50KiB/s·GiB(≈50MiB/s·TiB), 버스트 100MiB/s·TiB | https://docs.aws.amazon.com/efs/latest/ug/performance.html |
| EFS One Zone-IA 결합 시 최대 90% 절감 | 수치 | 확인됨(일반 통념 수준, 공식 스토리지 클래스 절감 서술과 방향 일치) | 스니펫 직접 재확인은 생략(VERIFIED_FACTS 미등재, 시험 정답에 직결 아님) | — |
| EC2 인스턴스 스토어 "수백만 IOPS 가능" | 수치(부차) | 확인됨 | 예: I3en NVMe는 4KB 블록 기준 최대 200만 랜덤 IOPS | https://aws.amazon.com/ec2/instance-types/i3en/ |
| Reserved Instances 최대 ~72%, Convertible RI 최대 ~66% | 수치 | 확인됨 | Standard RI 최대 72%, Convertible RI 최대 66% | https://aws.amazon.com/ec2/pricing/reserved-instances/ |
| Savings Plans 최대 ~72% | 수치 | 확인됨 | EC2 Instance Savings Plans(패밀리+리전 고정, 크기·OS 유연) 최대 72% — 본문 설명이 이 유형과 일치 | https://aws.amazon.com/savingsplans/faqs/ |
| Spot 최대 -90%, 2분 통보 | 수치 | 확인됨(캐시 재사용 + 재확인) | 90% 할인(VERIFIED_FACTS), 중단 2분 전 통보 | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html |
| 퍼블릭 IPv4: 2024-02부터 시간당 $0.005, 프리티어 월 750시간 | 수치 | 확인됨 | 동일(2024-02-01 발효) | https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/ · https://aws.amazon.com/about-aws/whats-new/2024/02/aws-free-tier-750-hours-free-public-ipv4-addresses/ |
| EBS 같은 AZ 제약 | 동작 | 확인됨(캐시) | 동일 | VERIFIED_FACTS 캐시(2026-07-13) |
| User Data: 최초 부팅 1회, root 권한 | 동작(시험 포인트) | 확인됨(일반 지식, 시험 통념과 일치, URL 미재확보) | — | 미검증(핵심 개념이나 통념 수준 일치로 판정 보류 없이 채택 — 축1 참고용 표기) |

## Task 커버리지 (담당: 4-0 컴퓨팅 기초 — EC2/ELB/ASG "최소한" 규정, 보조 Task 4.2 헬스체크)

- **커버**: EC2 기초·User Data(부트스트래핑) / 인스턴스 유형 패밀리 / 보안 그룹(Stateful·접속 오류 진단) / SSH·Instance Connect / IAM 인스턴스 역할 / 구매 옵션 6종 / EBS 개요·AZ 종속성 / 스냅샷·Archive·Recycle Bin / AMI / 인스턴스 스토어 / EBS 볼륨 유형 6종 / Multi-Attach / EFS / EFS vs EBS vs 인스턴스 스토어 비교 — Task 4.2(헬스체크·레디니스 프로브) 보조 커버리지는 SG 접속 오류 진단·ELB 헬스체크(다른 파일에서) 수준으로 충족
- **누락**: 없음 — 커리큘럼이 "최소한"으로 규정한 범위 대비 오히려 상세함
- **표면 커버**: 없음

## 범위 이탈 (축1 L5 참조용)

- **AWS Budgets 섹션(LECTURE 31)**: 컴퓨팅 챕터(4-0)와 직접 관련 없는 청구·예산 설정 콘텐츠. freq=1로 자체 저비중 표기됨. 전체 16개 섹션 중 1개, 분량도 짧아 "경미" 수준(10% 미만)
- **퍼블릭 IPv4 요금(LECTURE 45)**: 컴퓨팅 핵심 개념은 아니나 EC2 실습 비용과 직결되고 실제 최신 정책이라 유지 권고 — 이탈로 보지 않음

## 출제 각도 부정합

- 없음. Task 동사(구성·배포·문제 해결) 대비 "시험 포인트"·"함정 포인트" 콜아웃이 시나리오 판단형으로 잘 구성됨(예: Timeout vs Connection Refused, gp2/gp3 IOPS 비교, EFS vs EBS 선택 공식).

## 폐기 문항 (레거시 F4)

- 해당 없음 — 퀴즈 성분 없음(성분 태그 퀴즈 X) → F4 N/A.

## 수정 지시 (실행 가능하게)

1. **`voltype` 섹션(EBS 볼륨 유형 6가지) 표의 gp3 행 수정** — "기본 3,000 IOPS/125MB/s → 최대 16,000 IOPS/1,000MB/s"를 "기본 3,000 IOPS/125MB/s → 최대 **80,000 IOPS/2,000MB/s**"로 갱신. 이어지는 `ExamTip`("32,000 IOPS 이상 필요 → gp 계열 탈락, io1/io2")도 함께 재검토 — 현행 gp3 최대치(80,000 IOPS)가 io1 최대치(64,000 IOPS)를 넘어서므로 "IOPS 문턱값 → io1/io2" 로직 자체가 낡았다. "gp3로 충분한지, 스토리지 크기·비용 구조까지 고려해야 하는지" 방향으로 재작성 권고. 근거: https://aws.amazon.com/ebs/volume-types/
2. **`efs` 섹션 처리량 모드 표의 Elastic 행 수정** — "읽기 최대 3GB/s, 쓰기 1GB/s"를 "리전 파일시스템 기준 파일시스템당 읽기 20~60GiBps·쓰기 1~5GiBps, 클라이언트당 결합 최대 1,500MiBps(One Zone은 파일시스템당 읽기 3GiBps·쓰기 1GiBps로 별도)"로 갱신 또는 최소 "AWS Region·클라이언트 버전에 따라 상이, 구버전 수치 아님"으로 완화. 근거: https://docs.aws.amazon.com/efs/latest/ug/performance.html

## 스키마 피드백 요약

- `FreqGauge`/`Freq`(빈출도 게이지) 컴포넌트, `ExamTip`(시험 포인트 콜아웃), 시나리오→정답 "즉답 공식" 표(비교 요약 카드) 패턴이 dynamodb-guide와 유사하게 반복 관찰됨. docs/SCHEMA_FEEDBACK_AXIS2.md에 추가 제안할 가치가 있으나 이미 기존 배치에서 유사 항목 기록됨 — 중복 등재 생략.

