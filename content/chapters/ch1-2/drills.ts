/**
 * 생성물 — 손편집 금지. `node scripts/import-drills.ts lambda` 재실행으로 갱신.
 * 원본: aws-cloud-drills data/questions/lambda.json (15문항)
 */
import type { Question } from "../../schema";

export const quiz: Question[] = [
  // source: lambda-provisioned-concurrency-cold-start
  {
    "id": "q1",
    "slug": "lambda-provisioned-concurrency-cold-start",
    "scope": "final",
    "concept": [
      "cold-start",
      "provisioned-concurrency",
      "performance"
    ],
    "scenario": "한 개발자가 Lambda 함수로 이미지 리사이징 API를 운영하고 있다. 트래픽이 몰리는 시간대마다 일부 요청의 응답이 간헐적으로 수 초씩 지연되는 것을 발견했고, 원인은 함수 초기화(콜드 스타트)로 확인됐다. 지연을 줄이기 위한 가장 적절한 방법은?",
    "choices": [
      "함수 메모리 크기를 줄여 실행 환경을 가볍게 만든다.",
      "프로비저닝된 동시성(provisioned concurrency)을 구성해 초기화된 실행 환경을 미리 확보한다.",
      "함수 타임아웃을 상향해 초기화가 끝날 때까지 기다리게 한다.",
      "함수 호출 방식을 동기 API 호출에서 SQS 큐를 통한 비동기 처리로 바꾼다."
    ],
    "answer": [
      1
    ],
    "explanation": "콜드 스타트는 새 실행 환경을 만들 때 런타임 기동과 초기화 코드 실행에 걸리는 시간이다. 트래픽이 급증하면 동시 실행 수가 늘어나며 새 환경이 자주 만들어지고, 그때마다 첫 요청이 초기화 시간을 그대로 떠안는다.\n\n프로비저닝된 동시성을 구성하면 지정한 수의 실행 환경이 항상 초기화된 상태로 대기하므로, 해당 용량 안에서는 콜드 스타트가 발생하지 않는다. 트래픽 패턴이 예측 가능하다면 Application Auto Scaling과 묶어 시간대별로 조정할 수도 있다.",
    "choiceExplanations": [
      "메모리를 줄이면 비례해서 CPU도 줄어 초기화가 오히려 느려질 수 있다.",
      "정답. 프로비저닝된 동시성은 초기화가 끝난 실행 환경을 미리 확보해 두는 유일한 선택지입니다.",
      "타임아웃 상향은 지연을 허용하는 설정일 뿐, 지연 자체를 줄이지 못한다.",
      "호출 방식을 비동기로 바꿔도 실행 환경 초기화(콜드 스타트)는 그대로 발생한다 — 원인과 무관한 구조 변경이다."
    ],
    "title": "콜드 스타트 지연을 줄이는 가장 적절한 방법",
    "difficulty": "medium",
    "references": [
      {
        "title": "Configuring provisioned concurrency for a function",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html"
      },
      {
        "title": "Understanding Lambda function scaling",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"
      }
    ]
  },
  // source: lambda-secrets-manager-db-credentials
  {
    "id": "q2",
    "slug": "lambda-secrets-manager-db-credentials",
    "scope": "final",
    "concept": [
      "secrets-manager",
      "credentials",
      "rotation"
    ],
    "scenario": "Lambda 함수가 RDS 데이터베이스에 접속해야 한다. 보안 요구사항은 두 가지다 — 자격 증명을 코드와 분리할 것, 그리고 주기적으로 자동 교체(rotation)할 것. 가장 적절한 방법은?",
    "choices": [
      "자격 증명을 함수 코드의 상수로 정의하고 배포 파이프라인 접근을 제한한다.",
      "자격 증명을 Lambda 환경 변수에 평문으로 저장하고 분기마다 콘솔에서 수동으로 바꾼다.",
      "AWS Secrets Manager에 자격 증명을 저장하고 자동 교체를 구성한 뒤, 함수가 실행 시점에 시크릿을 조회한다.",
      "자격 증명을 담은 설정 파일을 S3 버킷에 두고 버킷 이름을 코드에 하드코딩한다."
    ],
    "answer": [
      2
    ],
    "explanation": "Secrets Manager는 시크릿을 암호화해 저장하고, 교체용 Lambda 함수를 통해 RDS 자격 증명의 자동 교체를 기본 지원한다. 함수는 실행 시점에 API로 시크릿을 조회하므로 코드·배포 아티팩트에 자격 증명이 남지 않는다.\n\n시험에서는 '코드와 분리'만 요구하면 환경 변수·Parameter Store도 후보가 되지만, 자동 교체(rotation)가 조건에 들어가는 순간 Secrets Manager가 정답이 된다. 조건 키워드로 답이 갈리는 전형적인 패턴이다.",
    "choiceExplanations": [
      "코드 상수는 리포지토리·빌드 아티팩트·로그로 유출될 수 있고, 교체하려면 재배포가 필요하다.",
      "환경 변수 평문 저장은 콘솔·API 접근 권한이 있는 누구에게나 노출되고, 수동 교체는 요구사항인 자동 교체를 충족하지 못한다.",
      "정답. 자동 교체까지 요구되면 답은 Secrets Manager입니다 — 저장·암호화·교체를 한 서비스가 담당합니다.",
      "S3에 둔 평문 설정 파일은 저장 위치만 바뀐 하드코딩이다. 교체 자동화도 암호화 관리도 해결되지 않는다."
    ],
    "title": "DB 자격 증명을 함수에서 안전하게 사용하기",
    "difficulty": "easy",
    "references": [
      {
        "title": "What is AWS Secrets Manager?",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"
      },
      {
        "title": "Rotate AWS Secrets Manager secrets",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"
      }
    ]
  },
  // source: lambda-alias-weighted-canary-deploy
  {
    "id": "q3",
    "slug": "lambda-alias-weighted-canary-deploy",
    "scope": "final",
    "concept": [
      "alias",
      "versioning",
      "canary",
      "traffic-shifting"
    ],
    "scenario": "결제 처리 Lambda 함수의 새 버전을 배포하려고 한다. 전체 트래픽에 적용하기 전에 10%의 호출만 새 버전으로 보내 검증하고 싶고, 호출하는 쪽(API Gateway)의 설정은 바꾸지 않아야 한다. 가장 적절한 방법은?",
    "choices": [
      "새 버전을 다른 리전에 배포하고 Route 53 가중치 레코드로 트래픽을 나눈다.",
      "함수를 두 개 만들어 두고 클라이언트 코드에서 난수로 호출 대상을 고르게 한다.",
      "$LATEST에 새 코드를 바로 배포하고 CloudWatch 지표를 지켜본다.",
      "새 버전을 발행(publish)하고, 호출에 사용 중인 별칭(alias)에 두 버전 간 가중치 라우팅을 설정해 10%만 새 버전으로 보낸다."
    ],
    "answer": [
      3
    ],
    "explanation": "Lambda 별칭(alias)은 특정 버전을 가리키는 포인터이면서, 두 버전에 가중치를 줘 트래픽을 비율로 분배할 수 있다. 호출자는 별칭 ARN만 계속 호출하면 되므로 API Gateway 설정 변경 없이 카나리 배포가 가능하고, 문제가 생기면 가중치를 0으로 되돌리는 것으로 즉시 롤백된다.\n\n버전(version)은 발행 시점의 코드+설정 스냅샷이고 불변이다. '버전 발행 → 별칭 가중치 조정 → 전환 완료'가 Lambda 점진 배포의 기본 흐름이며, CodeDeploy를 쓰면 이 시프팅을 자동화할 수도 있다.",
    "choiceExplanations": [
      "리전 복제 + DNS 가중치는 같은 목적을 훨씬 비싸고 복잡하게 푸는 구성이고, DNS 캐시 때문에 비율 제어도 부정확하다.",
      "클라이언트 측 분기는 호출하는 쪽의 변경을 요구하므로 조건을 어기고, 비율 조정·롤백도 재배포 없이는 불가능하다.",
      "$LATEST 직배포는 전체 트래픽이 즉시 새 코드를 받는다 — 10% 검증이라는 요구 자체를 충족하지 못한다.",
      "정답. 별칭의 가중치 라우팅이 호출 ARN을 바꾸지 않고 두 버전 사이에서 트래픽을 비율로 나누는 기능입니다."
    ],
    "title": "새 버전을 일부 트래픽으로 검증하며 배포하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Create an alias for a Lambda function",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html"
      },
      {
        "title": "Implement Lambda canary deployments using a weighted alias",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-rolling-deployments.html"
      }
    ]
  },
  // source: lambda-throttling-429-mitigation
  {
    "id": "q4",
    "slug": "lambda-throttling-429-mitigation",
    "scope": "final",
    "concept": [
      "throttling",
      "reserved-concurrency",
      "exponential-backoff"
    ],
    "scenario": "마케팅 이벤트 때마다 동기 호출되는 Lambda 함수에서 간헐적으로 429 TooManyRequestsException(스로틀링)이 발생한다. 같은 계정의 다른 함수들이 동시성을 나눠 쓰고 있는 상황이다. 스로틀링의 영향을 줄이는 조치는? (2개를 고르세요)",
    "choices": [
      "함수 타임아웃을 상향해 요청이 더 오래 대기할 수 있게 한다.",
      "호출 클라이언트에 지수 백오프와 지터(jitter)를 적용한 재시도를 구현한다.",
      "함수를 버전 ARN 대신 $LATEST로 호출하도록 변경한다.",
      "해당 함수에 예약된 동시성(reserved concurrency)을 설정해 다른 함수가 동시성 풀을 소진해도 처리 용량을 보장한다."
    ],
    "answer": [
      1,
      3
    ],
    "explanation": "스로틀링은 동시 실행 수가 사용 가능한 동시성을 초과할 때 발생한다. 동기 호출에서는 429가 호출자에게 그대로 반환되므로, 클라이언트의 지수 백오프+지터 재시도가 순간적인 스파이크를 시간축으로 분산시키는 1차 방어가 된다.\n\n계정의 동시성은 리전 내 함수들이 공유하는 풀이다. 예약된 동시성을 설정하면 그 수치만큼 이 함수 전용 용량이 분리되어, 다른 함수의 트래픽 폭증이 이 함수의 스로틀링으로 전이되지 않는다. 근본적으로 용량이 부족하다면 계정 동시성 한도 상향 요청까지 검토한다.",
    "choiceExplanations": [
      "타임아웃은 실행 중인 함수의 최대 실행 시간 설정이다. 스로틀링은 실행 환경을 얻지 못해 시작조차 못 한 상태라 타임아웃과 무관하다.",
      "정답. 재시도(지수 백오프+지터)로 순간 스파이크를 흡수하고, 예약된 동시성으로 이 함수 몫의 처리 용량을 확보합니다.",
      "$LATEST 호출 여부는 어떤 코드가 실행되는지의 문제일 뿐, 동시성 한도나 스로틀링 동작에는 영향이 없다.",
      "정답. 재시도(지수 백오프+지터)로 순간 스파이크를 흡수하고, 예약된 동시성으로 이 함수 몫의 처리 용량을 확보합니다."
    ],
    "title": "호출 급증 시 스로틀링(429) 줄이기",
    "difficulty": "hard",
    "references": [
      {
        "title": "Configuring reserved concurrency for a function",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html"
      },
      {
        "title": "Retry behavior (AWS SDKs and Tools)",
        "url": "https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html"
      }
    ]
  },
  // source: lambda-vpc-rds-access-configuration
  {
    "id": "q5",
    "slug": "lambda-vpc-rds-access-configuration",
    "scope": "final",
    "concept": [
      "vpc",
      "rds",
      "security-group",
      "eni"
    ],
    "scenario": "Lambda 함수가 프라이빗 서브넷에 있는 RDS 데이터베이스에 접속해야 한다. 데이터베이스는 인터넷에 노출하면 안 된다. 올바른 구성은?",
    "choices": [
      "RDS 인스턴스를 퍼블릭 액세스 가능으로 바꾸고 함수가 인터넷 경유로 접속하게 한다.",
      "추가 구성 없이 그대로 호출한다 — Lambda는 기본적으로 같은 계정의 모든 VPC 리소스에 접근할 수 있다.",
      "함수를 해당 VPC에 연결(서브넷·보안 그룹 지정)하고, RDS 보안 그룹에서 함수의 보안 그룹으로부터의 인바운드를 허용한다.",
      "함수 환경 변수에 RDS 보안 그룹 ID를 설정하면 네트워크 경로가 자동으로 열린다."
    ],
    "answer": [
      2
    ],
    "explanation": "Lambda 함수는 기본적으로 VPC 밖(서비스 소유 네트워크)에서 실행되므로 프라이빗 서브넷의 리소스에 닿지 못한다. VPC 접근이 필요하면 함수에 서브넷과 보안 그룹을 지정해 VPC에 연결해야 하고, 그러면 Lambda가 해당 서브넷에 ENI(탄력적 네트워크 인터페이스)를 만들어 통신한다.\n\n네트워크 경로가 생겨도 보안 그룹 규칙은 별개다 — RDS의 보안 그룹에서 함수의 보안 그룹을 소스로 하는 인바운드(DB 포트)를 허용해야 연결이 완성된다. 'VPC 연결 + 보안 그룹 인바운드' 두 조각을 묶는 것이 출제 포인트다.",
    "choiceExplanations": [
      "퍼블릭 액세스 전환은 '인터넷에 노출하면 안 된다'는 요구사항을 정면으로 위반한다.",
      "기본 상태의 Lambda는 VPC 내부 리소스에 접근할 수 없다. VPC 연결은 명시적으로 구성해야 한다.",
      "정답. 함수를 VPC에 연결하고 보안 그룹 인바운드 규칙으로 함수 → RDS 경로를 여는 것이 표준 구성입니다.",
      "환경 변수는 코드에 값을 전달하는 수단일 뿐, 네트워크 경로나 보안 그룹 규칙을 만들지 않는다."
    ],
    "title": "VPC 안의 RDS에 접근하도록 함수 구성하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Giving Lambda functions access to resources in an Amazon VPC",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html"
      }
    ]
  },
  // source: lambda-snapstart-java-cold-start
  {
    "id": "q6",
    "slug": "lambda-snapstart-java-cold-start",
    "scope": "final",
    "concept": [
      "snapstart",
      "cold-start",
      "java",
      "performance"
    ],
    "scenario": "Java 21 런타임으로 작성된 Lambda 함수가 무거운 프레임워크 초기화 때문에 콜드 스타트가 수 초씩 걸린다. 함수 코드를 거의 바꾸지 않으면서 추가 상시 비용 없이 시작 지연을 줄이고 싶다. 가장 적절한 방법은?",
    "choices": [
      "함수 버전을 발행하면서 SnapStart를 활성화해, 초기화된 실행 환경의 스냅샷을 캐시했다가 호출 시 복원하게 한다.",
      "프로비저닝된 동시성을 충분히 설정해 항상 초기화된 환경을 대기시킨다.",
      "함수 메모리를 128MB로 낮춰 초기화할 코드량을 줄인다.",
      "함수를 컨테이너 이미지로 패키징해 런타임 부팅을 건너뛰게 한다."
    ],
    "answer": [
      0
    ],
    "explanation": "SnapStart는 버전을 발행하는 시점에 함수를 한 번 초기화한 뒤 실행 환경의 메모리·디스크 상태를 Firecracker 스냅샷으로 떠서 암호화·캐시한다. 이후 호출과 스케일 업 때는 매번 초기화하는 대신 캐시된 스냅샷에서 환경을 복원하므로, 프레임워크 로딩 같은 일회성 초기화 지연이 크게 줄어든다. Java 11 이상, Python 3.12 이상, .NET 8 이상에서 지원되고, 함수 코드는 대부분 수정 없이 동작한다.\n\nJava 관리형 런타임에서는 SnapStart 자체에 추가 요금이 없다는 점이 '추가 상시 비용 없이'라는 조건과 맞물린다. 반면 프로비저닝된 동시성은 항상 환경을 켜 두는 만큼 상시 비용이 발생한다 — 두 기능은 같은 함수에서 동시에 쓸 수 없으므로 조건에 따라 하나를 고른다.",
    "choiceExplanations": [
      "정답. SnapStart는 Java 등 지원 런타임에서 초기화 스냅샷을 복원해 콜드 스타트를 줄이며, Java는 추가 비용도 없습니다.",
      "프로비저닝된 동시성은 환경을 상시 대기시키는 만큼 항상 비용이 발생한다 — '추가 상시 비용 없이'라는 조건과 어긋난다. 또한 SnapStart와 함께 쓸 수 없다.",
      "메모리를 낮추면 비례해 CPU도 줄어 초기화가 오히려 더 느려진다. 콜드 스타트를 악화시키는 선택이다.",
      "컨테이너 이미지로 바꿔도 런타임 부팅과 초기화는 그대로 일어난다. 더구나 SnapStart는 컨테이너 이미지 함수를 지원하지 않는다."
    ],
    "title": "코드 변경 없이 Java 함수 콜드 스타트 줄이기",
    "difficulty": "hard",
    "references": [
      {
        "title": "Improving startup performance with Lambda SnapStart",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html"
      }
    ]
  },
  // source: lambda-sqs-batch-window-small-invocations
  {
    "id": "q7",
    "slug": "lambda-sqs-batch-window-small-invocations",
    "scope": "final",
    "concept": [
      "sqs",
      "event-source-mapping",
      "batch-size",
      "batch-window"
    ],
    "scenario": "SQS 큐를 이벤트 소스로 하는 Lambda 함수가 트래픽이 적은 시간대에는 메시지 한두 개만 든 배치로 너무 자주 호출되어 비효율적이다. 한 번 호출에 더 많은 메시지를 모아 처리하도록 이벤트 소스 매핑을 조정하려면?",
    "choices": [
      "함수의 예약된 동시성을 늘려 한 번에 더 많은 메시지를 받게 한다.",
      "큐의 가시성 제한 시간(visibility timeout)을 늘려 메시지가 더 오래 쌓이게 한다.",
      "함수 타임아웃을 늘려 한 호출에서 더 오래 폴링하게 한다.",
      "이벤트 소스 매핑의 배치 크기(batch size)와 배치 윈도우(maximum batching window)를 늘려, 윈도우가 끝나거나 배치 크기·페이로드 한도에 도달할 때까지 메시지를 모아 한 번에 보내게 한다."
    ],
    "answer": [
      3
    ],
    "explanation": "SQS 이벤트 소스 매핑에서 Lambda는 큐를 폴링해 한 배치를 모은 뒤 함수를 한 번 호출한다. 기본적으로 최대 10개를 가져오는데, 배치 윈도우(최대 5분)를 설정하면 윈도우가 만료되거나, 설정한 최대 배치 크기에 도달하거나, 호출 페이로드 한도에 도달할 때까지 메시지를 모은 뒤 호출한다. 트래픽이 적을 때 잦은 소규모 호출을 줄이는 정석 설정이다.\n\n주의할 점은 트래픽이 매우 적은 큐에서는 배치 윈도우를 5초로 설정해도 Lambda가 최대 20초까지 기다린 뒤 호출할 수 있다는 것이다. 폴링·배치 동작은 이벤트 소스 매핑의 파라미터이지 함수의 동시성·타임아웃 설정이 아니다.",
    "choiceExplanations": [
      "예약된 동시성은 이 함수가 쓸 수 있는 동시 실행 용량을 정할 뿐, 한 배치에 담기는 메시지 수와는 무관하다.",
      "가시성 제한 시간은 처리 중 메시지가 다른 소비자에게 숨겨지는 시간이다. 한 배치에 모이는 메시지 수를 늘리는 설정이 아니다.",
      "함수 타임아웃은 한 번 실행이 도는 최대 시간이다. 폴링·배치 수집 동작은 이벤트 소스 매핑이 담당하므로 타임아웃과 무관하다.",
      "정답. 배치 크기와 배치 윈도우를 키우면 Lambda가 메시지를 더 모아 한 번에 호출합니다."
    ],
    "title": "SQS 트래픽이 적을 때 잦은 소규모 호출 줄이기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Using Lambda with Amazon SQS",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html"
      }
    ]
  },
  // source: lambda-kinesis-poison-record-blocking-shard
  {
    "id": "q8",
    "slug": "lambda-kinesis-poison-record-blocking-shard",
    "scope": "final",
    "concept": [
      "kinesis",
      "batch-item-failures",
      "bisect-on-error",
      "poison-pill"
    ],
    "scenario": "Kinesis Data Streams를 소비하는 Lambda 함수에서, 배치 안의 단 하나의 '독성(poison)' 레코드가 처리에 실패하면 그 샤드의 뒤 레코드들이 계속 막혀 같은 배치가 무한 재시도된다. 처리량을 회복하면서 정상 레코드는 진행시키려는 조치는? (2개를 고르세요)",
    "choices": [
      "함수 메모리를 늘려 실패한 레코드가 더 빨리 처리되게 한다.",
      "이벤트 소스 매핑의 FunctionResponseTypes에 ReportBatchItemFailures를 켜고, 함수가 실패한 레코드의 시퀀스 번호를 batchItemFailures로 반환해 그 지점부터 체크포인트하게 한다.",
      "샤드 수를 늘려 독성 레코드를 여러 샤드로 분산시킨다.",
      "BisectBatchOnFunctionError를 켜서 오류 시 배치를 이분할해 재시도하고, 최대 재시도 횟수(MaximumRetryAttempts)나 최대 레코드 수명(MaximumRecordAgeInSeconds)을 설정해 독성 레코드를 결국 건너뛰게 한다."
    ],
    "answer": [
      1,
      3
    ],
    "explanation": "스트림 이벤트 소스에서 Lambda는 기본적으로 배치가 완전히 성공해야만 가장 높은 시퀀스 번호로 체크포인트한다. 그 외에는 배치 전체를 실패로 보고 재시도 한도까지 같은 배치를 재시도하므로, 독성 레코드 하나가 샤드를 막는다. ReportBatchItemFailures를 켜고 함수가 batchItemFailures에 실패 레코드의 시퀀스 번호를 반환하면, Lambda는 그 중 가장 낮은 시퀀스 번호를 체크포인트로 삼아 그 지점부터만 재시도한다 — 앞쪽 정상 레코드는 다시 처리되지 않는다.\n\nBisectBatchOnFunctionError를 켜면 호출이 실패할 때 배치를 둘로 쪼개 재시도해 문제 레코드를 좁혀 간다. 그래도 끝내 실패하는 독성 레코드는 MaximumRetryAttempts나 MaximumRecordAgeInSeconds 한도에 걸려 결국 폐기(또는 on-failure 대상으로 전송)되므로, 샤드가 영원히 막히지 않고 처리량이 회복된다. 두 설정을 함께 쓰면 부분 성공 응답 시 반환된 시퀀스 번호에서 이분할이 시작된다.",
    "choiceExplanations": [
      "메모리를 늘려도 레코드가 코드 오류로 실패하는 사실은 바뀌지 않는다. 독성 레코드는 여전히 같은 위치에서 막힌다.",
      "정답. 부분 배치 응답으로 실패 시퀀스 번호만 체크포인트하고, 배치 이분할 + 재시도/수명 한도로 독성 레코드를 격리합니다.",
      "샤드를 늘려도 특정 파티션 키의 독성 레코드는 여전히 한 샤드에 들어가 그 샤드를 막는다. 막힘의 원인(완전 실패 재시도)을 해결하지 못한다.",
      "정답. 부분 배치 응답으로 실패 시퀀스 번호만 체크포인트하고, 배치 이분할 + 재시도/수명 한도로 독성 레코드를 격리합니다."
    ],
    "title": "Kinesis 한 레코드 오류가 샤드 전체를 막을 때",
    "difficulty": "hard",
    "references": [
      {
        "title": "Configuring partial batch response with Kinesis Data Streams and Lambda",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-kinesis-batchfailurereporting.html"
      }
    ]
  },
  // source: lambda-async-onfailure-destination-vs-dlq
  {
    "id": "q9",
    "slug": "lambda-async-onfailure-destination-vs-dlq",
    "scope": "final",
    "concept": [
      "asynchronous-invocation",
      "destinations",
      "dead-letter-queue"
    ],
    "scenario": "S3 이벤트로 비동기 호출되는 Lambda 함수가 모든 재시도를 소진하고 실패하는 경우가 있다. 운영팀은 실패한 이벤트뿐 아니라 함수가 반환한 오류 응답 정보까지 보존해 분석하고 싶고, 추가 코드 작성은 피하고 싶다. 가장 적절한 구성은?",
    "choices": [
      "함수 코드에 try/catch를 넣어 실패 시 직접 SQS 큐로 페이로드를 보낸다.",
      "함수에 데드레터 큐(DLQ)를 지정한다 — DLQ가 응답 정보를 포함한 전체 호출 기록을 저장한다.",
      "비동기 호출 실패(on-failure) 이벤트 대상(destination)을 SQS나 EventBridge로 구성한다.",
      "함수의 CloudWatch 로그 그룹 보존 기간을 무기한으로 늘린다."
    ],
    "answer": [
      2
    ],
    "explanation": "비동기 호출에서는 실패 이벤트를 보존하는 두 가지 방법이 있다. 이벤트 대상(destination)은 on-success/on-failure 조건별로 SQS·SNS·EventBridge·Lambda(실패 시 S3도)로 보낼 수 있고, 전송되는 호출 기록(JSON)에 요청 페이로드와 함수의 응답·오류 정보가 함께 담긴다. 코드 변경 없이 함수 설정만으로 구성된다.\n\n반면 데드레터 큐(DLQ)는 이벤트 본문을 그대로 보내고 오류 코드·메시지 일부만 메시지 속성으로 첨부할 뿐, 함수의 응답 페이로드가 담긴 구조화된 호출 기록은 제공하지 않는다. '응답 정보까지 보존'이라는 조건이 destination을 가리키는 결정적 단서다. DLQ는 더 오래된 기능으로 함수 단위에서만 설정되고 대상도 SQS/SNS로 제한된다.",
    "choiceExplanations": [
      "코드로 직접 전송하면 '추가 코드 작성을 피한다'는 조건을 어긴다. 또한 함수가 비정상 종료(예: 타임아웃)하면 catch 자체가 동작하지 않을 수 있다.",
      "DLQ는 이벤트 본문을 보내며 RequestID·ErrorCode·ErrorMessage(첫 1KB)를 메시지 속성으로 첨부하지만, 함수의 응답 페이로드를 포함한 구조화된 호출 기록은 담지 않는다 — '응답 정보까지 보존'이라는 요구를 충족하지 못한다.",
      "정답. on-failure 이벤트 대상(destination)은 요청과 함께 함수 응답 정보까지 담은 호출 기록을 전송합니다 — DLQ는 함수의 응답 페이로드까지는 담지 않습니다.",
      "로그 보존 연장은 텍스트 로그를 남길 뿐, 실패한 이벤트를 구조화된 형태로 보존해 재처리·분석하는 메커니즘이 아니다."
    ],
    "title": "비동기 호출 실패 이벤트를 응답 정보까지 보존하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Capturing records of Lambda asynchronous invocations",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html"
      }
    ]
  },
  // source: lambda-envvar-customer-managed-kms-key
  {
    "id": "q10",
    "slug": "lambda-envvar-customer-managed-kms-key",
    "scope": "final",
    "concept": [
      "environment-variables",
      "kms",
      "customer-managed-key",
      "encryption"
    ],
    "scenario": "한 팀은 Lambda 환경 변수에 저장된 설정값을 특정 인원만 콘솔·API에서 열람·관리할 수 있도록 제한하고, KMS 키 교체 정책도 직접 통제해야 한다. 자동 교체가 필요한 자격 증명은 아니다. 가장 적절한 방법은?",
    "choices": [
      "환경 변수를 그대로 두고, 기본 AWS 관리형 키가 모든 접근을 알아서 제한하도록 맡긴다.",
      "환경 변수 암호화에 고객 관리형 KMS 키(customer managed key)를 지정하고, 그 키에 대한 kms:Decrypt 권한을 가진 사용자만 환경 변수를 보거나 관리할 수 있게 한다.",
      "환경 변수 값을 Base64로 인코딩해 저장하면 권한 없는 사용자가 읽지 못한다.",
      "환경 변수를 모두 삭제하고 값을 함수 코드 안에 상수로 옮긴다."
    ],
    "answer": [
      1
    ],
    "explanation": "Lambda는 환경 변수를 항상 KMS 키로 저장 시 암호화하며, 기본값은 AWS 관리형 키다. 기본 키를 쓰면 사용자나 실행 역할에 별도 KMS 권한이 필요 없어 누구나(함수 관리 권한만 있으면) 환경 변수를 볼 수 있다.\n\n고객 관리형 키를 지정하면 그 키에 대한 kms:Decrypt 권한이 있는 사용자만 환경 변수를 열람·관리할 수 있다. 권한이 없는 사용자는 함수는 관리해도 환경 변수 값은 보지 못한다. 키 교체 주기 등도 직접 통제할 수 있어 '열람 통제 + 키 교체 통제'라는 두 요구에 정확히 맞는다. 자동 교체가 필요한 DB 자격 증명이라면 Secrets Manager가 답이지만, 여기서는 그 조건이 없다.",
    "choiceExplanations": [
      "기본 AWS 관리형 키는 KMS 권한 없이도 환경 변수를 볼 수 있게 해, 특정 인원으로 열람을 제한하지 못한다. 키 교체도 직접 통제할 수 없다.",
      "정답. 고객 관리형 KMS 키로 환경 변수를 암호화하면 kms:Decrypt 권한이 있는 사용자만 열람·관리할 수 있고 키 교체도 직접 통제합니다.",
      "Base64는 암호화가 아니라 인코딩일 뿐이다. 누구나 디코딩할 수 있어 접근 통제 효과가 전혀 없다.",
      "코드 상수로 옮기면 리포지토리·빌드 아티팩트로 값이 유출되고, 열람 권한을 KMS로 통제한다는 목표와도 정반대다."
    ],
    "title": "환경 변수 열람 권한을 KMS로 통제하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Securing Lambda environment variables",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html"
      }
    ]
  },
  // source: lambda-layers-shared-dependencies
  {
    "id": "q11",
    "slug": "lambda-layers-shared-dependencies",
    "scope": "final",
    "concept": [
      "layers",
      "dependencies",
      "deployment-package"
    ],
    "scenario": "여러 Lambda 함수(.zip 배포)가 동일한 대용량 라이브러리 묶음을 사용한다. 매 함수 배포 패키지에 같은 의존성을 중복 포함하다 보니 패키지가 커지고 관리가 번거롭다. 의존성을 코드와 분리해 여러 함수가 공유하게 하는 방법은?",
    "choices": [
      "공통 의존성을 Lambda 레이어(layer)로 패키징해 함수들에 연결하면, 런타임이 /opt 경로에 풀어 함수 코드가 사용한다.",
      "공통 의존성을 S3 버킷에 올리고 각 함수가 실행할 때마다 내려받아 메모리에 적재한다.",
      "공통 의존성을 EFS에 두고 모든 함수에 동일 코드로 복사해 넣는다.",
      "함수마다 의존성을 그대로 중복 포함하되 배포 패키지를 gzip으로 한 번 더 압축한다."
    ],
    "answer": [
      0
    ],
    "explanation": "Lambda 레이어는 라이브러리 의존성·런타임·설정 파일 등을 담는 .zip 아카이브다. 한 번 만들면 계정 내 여러 함수에 연결할 수 있어 의존성을 한 곳에서 관리하고 코드와 분리할 수 있다. 함수에 레이어를 추가하면 Lambda가 그 내용을 실행 환경의 /opt 디렉터리에 풀어 주고, 각 런타임은 /opt 하위의 정해진 경로에서 이를 자동으로 찾는다.\n\n함수당 최대 5개의 레이어를 쓸 수 있으며, 이는 .zip 배포 함수에만 적용된다(컨테이너 이미지 함수는 이미지에 의존성을 포함한다). 배포 패키지가 작아져 콘솔 코드 편집기 사용이 가능해지는 부수 효과도 있다.",
    "choiceExplanations": [
      "정답. Lambda 레이어가 공통 의존성을 코드와 분리해 여러 함수가 공유하도록 설계된 기능입니다.",
      "매 실행마다 S3에서 내려받으면 콜드 스타트·지연·전송 비용이 늘고, 의존성을 코드와 깔끔히 분리하는 정식 메커니즘도 아니다.",
      "모든 함수에 동일 코드를 복사해 넣는 것은 '중복 포함'을 그대로 두는 것이라 문제(패키지 비대·관리 부담)를 해결하지 못한다.",
      "추가 압축은 중복을 없애지 못하고, Lambda는 배포 시 어차피 압축을 풀므로 실질적 이득이 없다."
    ],
    "title": "여러 함수가 공통 의존성을 공유하기",
    "difficulty": "easy",
    "references": [
      {
        "title": "Managing Lambda dependencies with layers",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html"
      }
    ]
  },
  // source: lambda-ephemeral-storage-tmp-sizing
  {
    "id": "q12",
    "slug": "lambda-ephemeral-storage-tmp-sizing",
    "scope": "final",
    "concept": [
      "ephemeral-storage",
      "tmp",
      "storage"
    ],
    "scenario": "Lambda 함수가 S3에서 약 4GB짜리 머신러닝 모델 파일을 내려받아 /tmp에 두고 추론에 사용해야 한다. 그런데 기본 설정에서 디스크 공간 부족 오류가 난다. 가장 적절한 조치는?",
    "choices": [
      "함수 메모리를 10,240MB로 올리면 /tmp 용량도 같이 늘어난다.",
      "모델을 여러 조각으로 나눠 매번 S3에서 스트리밍하도록 코드를 다시 작성하는 것이 유일한 방법이다.",
      "함수 타임아웃을 최대로 늘리면 디스크 공간이 확보된다.",
      "함수의 임시 저장소(ephemeral storage, /tmp) 크기를 기본 512MB에서 필요한 만큼(최대 10,240MB) 올린다."
    ],
    "answer": [
      3
    ],
    "explanation": "Lambda는 /tmp 디렉터리에 실행 환경별 임시 저장소를 제공하며 기본 크기는 512MB다. 이 임시 저장소 설정은 512MB부터 10,240MB까지 1MB 단위로 따로 구성할 수 있다. 큰 모델 다운로드, ETL 중간 산출물, 미디어·PDF 처리처럼 일시적으로 큰 디스크가 필요한 워크로드의 표준 해법이다.\n\n임시 저장소 크기는 메모리(configuration-memory) 설정과 별개의 값이다. 메모리를 올린다고 /tmp가 따라 늘어나지 않는다 — '메모리=CPU·RAM, ephemeral storage=/tmp 디스크'로 구분하는 것이 출제 포인트다.",
    "choiceExplanations": [
      "메모리 설정은 RAM과 CPU에 영향을 줄 뿐, /tmp 디스크 용량과는 별개의 설정이다. 메모리를 올려도 /tmp는 그대로다.",
      "임시 저장소를 늘리면 모델을 통째로 /tmp에 둘 수 있으므로, 스트리밍 재작성이 '유일한 방법'이라는 단정은 틀렸다.",
      "타임아웃은 실행 시간 한도일 뿐 디스크 용량과 무관하다.",
      "정답. /tmp 임시 저장소는 512MB~10,240MB로 따로 설정하는 값이며, 메모리 설정과는 별개입니다."
    ],
    "title": "큰 임시 파일을 다루기 위한 /tmp 용량 확보",
    "difficulty": "easy",
    "references": [
      {
        "title": "Configure ephemeral storage for Lambda functions",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html"
      }
    ]
  },
  // source: lambda-memory-cpu-coupling-performance
  {
    "id": "q13",
    "slug": "lambda-memory-cpu-coupling-performance",
    "scope": "final",
    "concept": [
      "memory",
      "cpu",
      "performance",
      "vcpu"
    ],
    "scenario": "이미지 변환을 수행하는 Lambda 함수가 CPU 연산 때문에 실행 시간이 길다. 메모리는 256MB로 설정돼 있고 메모리 사용량 자체는 여유가 있다. 실행 시간을 줄이는 가장 효과적인 조치는?",
    "choices": [
      "메모리 사용량에 여유가 있으므로 메모리를 128MB로 더 낮춰 비용을 절감한다.",
      "함수를 더 작은 단위로 쪼개 여러 번 호출한다 — 그래야만 CPU가 늘어난다.",
      "메모리 설정을 올린다 — Lambda는 메모리에 비례해 CPU를 할당하므로, 메모리를 늘리면 CPU도 늘어 CPU 바운드 함수의 실행 시간이 줄어든다.",
      "프로비저닝된 동시성을 설정해 실행 환경을 미리 확보한다."
    ],
    "answer": [
      2
    ],
    "explanation": "Lambda는 설정한 메모리에 비례해 CPU 파워를 할당한다. 메모리는 128MB~10,240MB에서 설정하며, 1,769MB 지점에서 1 vCPU에 해당하는 연산 능력을 갖는다. 따라서 함수가 메모리가 아니라 CPU 때문에 느린 경우, 메모리를 올리면 CPU도 함께 늘어 실행 시간이 줄어든다 — 메모리는 RAM 크기인 동시에 성능을 조절하는 주된 레버다.\n\n메모리에 여유가 있다고 무작정 낮추면 CPU도 같이 줄어 CPU 바운드 함수는 더 느려지고, 실행 시간이 길어지면 오히려 총 비용이 늘 수 있다. AWS Lambda Power Tuning 같은 도구로 비용·성능이 균형을 이루는 지점을 찾는 것이 권장된다.",
    "choiceExplanations": [
      "메모리를 낮추면 CPU도 비례해 줄어 CPU 바운드 함수는 더 느려진다. 실행 시간이 길어지면 비용 절감 효과도 사라질 수 있다.",
      "함수를 쪼갠다고 각 조각의 CPU가 늘어나는 것은 아니다. 단일 함수의 CPU는 메모리 설정으로 조절된다.",
      "정답. Lambda는 메모리에 비례해 CPU를 배분하므로, CPU 바운드 함수는 메모리를 올리면 실행 시간이 줄어듭니다.",
      "프로비저닝된 동시성은 콜드 스타트(초기화 지연)를 없앨 뿐, 일단 실행이 시작된 뒤의 CPU 연산 시간은 줄이지 못한다."
    ],
    "title": "CPU 바운드 함수의 실행 시간 단축하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Configure Lambda function memory",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html"
      }
    ]
  },
  // source: lambda-function-url-auth-type-public-webhook
  {
    "id": "q14",
    "slug": "lambda-function-url-auth-type-public-webhook",
    "scope": "final",
    "concept": [
      "function-url",
      "auth-type",
      "resource-based-policy"
    ],
    "scenario": "외부 서드파티 서비스가 보내는 웹훅을 받기 위해, API Gateway 없이 Lambda 함수 URL로 직접 HTTPS 엔드포인트를 노출하려 한다. 호출 측은 IAM 자격 증명을 갖지 않은 외부 시스템이라 인증 없이 누구나 호출할 수 있어야 한다. 함수 URL의 인증 유형(AuthType) 설정은?",
    "choices": [
      "AWS_IAM — 모든 요청을 IAM 자격 증명으로 인증·인가한다.",
      "NONE — Lambda가 인증을 수행하지 않으며, 함수의 리소스 기반 정책이 퍼블릭 액세스를 허용하면 누구나 호출할 수 있다.",
      "COGNITO_USER_POOLS — Cognito 사용자 풀로 로그인한 사용자만 호출하게 한다.",
      "함수 URL은 항상 인증을 요구하므로 인증 없이 노출하는 것은 불가능하다."
    ],
    "answer": [
      1
    ],
    "explanation": "Lambda 함수 URL의 AuthType은 AWS_IAM 또는 NONE 두 가지다. AWS_IAM은 호출자의 IAM 자격 증명과 함수의 리소스 기반 정책으로 인증·인가하므로, IAM 주체만 호출할 수 있을 때 쓴다. NONE은 Lambda가 인증을 하지 않으며, 다만 함수의 리소스 기반 정책이 lambda:InvokeFunctionUrl 등으로 퍼블릭 액세스를 명시적으로 허용해야 요청을 받는다.\n\nIAM 자격 증명이 없는 외부 웹훅을 받으려면 NONE이 적절하다. 콘솔이나 SAM으로 NONE 함수 URL을 만들면 퍼블릭 리소스 기반 정책이 자동 생성된다. 다만 NONE은 누구나 호출 가능하므로, 페이로드 서명 검증 같은 애플리케이션 레벨 인증을 함수 코드에서 별도로 하는 것이 안전하다.",
    "choiceExplanations": [
      "AWS_IAM은 호출자가 IAM 자격 증명으로 서명한 요청만 허용한다. IAM 자격 증명이 없는 외부 웹훅 시스템은 호출할 수 없다.",
      "정답. 함수 URL을 공개로 열려면 AuthType을 NONE으로 두고 리소스 기반 정책으로 퍼블릭 액세스를 허용합니다.",
      "함수 URL의 AuthType에는 COGNITO_USER_POOLS 옵션이 없다(AWS_IAM·NONE 둘뿐). Cognito 연동은 API Gateway 권한 부여자의 기능이다.",
      "함수 URL은 AuthType NONE으로 인증 없이 공개할 수 있다. '항상 인증을 요구한다'는 단정은 틀렸다."
    ],
    "title": "함수 URL을 인증 없이 공개로 노출하기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Control access to Lambda function URLs",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html"
      }
    ]
  },
  // source: lambda-xray-active-tracing-bottleneck
  {
    "id": "q15",
    "slug": "lambda-xray-active-tracing-bottleneck",
    "scope": "final",
    "concept": [
      "x-ray",
      "active-tracing",
      "observability",
      "performance"
    ],
    "scenario": "Lambda 함수가 DynamoDB와 외부 API를 호출하는데, 전체 응답 지연 중 어느 구간이 병목인지 시각화해 찾고 싶다. 함수 초기화·실행 구간과 다운스트림 호출 시간을 한눈에 보려면 무엇이 필요한가? (2개를 고르세요)",
    "choices": [
      "함수의 X-Ray 추적 모드를 Active로 설정해, Lambda가 호출에 대한 추적 세그먼트를 생성·전송하게 한다.",
      "함수 메모리를 늘려 추적 데이터가 더 자세히 기록되게 한다.",
      "함수 실행 역할에 xray:PutTraceSegments·xray:PutTelemetryRecords 권한(예: AWSXRayDaemonWriteAccess)을 부여한다.",
      "CloudTrail 데이터 이벤트 로깅을 켜서 함수 호출별 지연을 추적한다."
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "AWS X-Ray는 애플리케이션 구성 요소를 시각화하고 성능 병목과 오류를 찾는 서비스다. Lambda는 Active와 PassThrough 두 추적 모드를 지원하며, Active 추적을 켜면 Lambda가 호출마다(샘플링된 요청에 한해) 추적 세그먼트를 자동 생성해 X-Ray로 보낸다. 세그먼트에는 초기화(Init)·실행 구간이 나뉘어 기록되고, X-Ray SDK로 계측하면 DynamoDB·외부 API 같은 다운스트림 호출이 하위 세그먼트로 나타나 어느 구간이 병목인지 한눈에 보인다.\n\n함수가 추적 데이터를 X-Ray에 업로드하려면 실행 역할에 xray:PutTraceSegments와 xray:PutTelemetryRecords 권한이 있어야 한다(관리형 정책 AWSXRayDaemonWriteAccess가 이를 포함한다). 콘솔에서 Active 추적을 켜면 이 권한이 자동으로 역할에 추가되지만, IaC로 구성할 때는 권한을 직접 부여해야 하므로 두 조건이 함께 필요하다.",
    "choiceExplanations": [
      "정답. X-Ray Active 추적을 켜고 실행 역할에 X-Ray 쓰기 권한을 부여하면 함수와 다운스트림 호출의 지연을 시각화합니다.",
      "메모리는 추적의 상세도와 무관하다. X-Ray 추적은 모드 설정과 권한으로 켜지며 메모리 크기와 관계없다.",
      "정답. X-Ray Active 추적을 켜고 실행 역할에 X-Ray 쓰기 권한을 부여하면 함수와 다운스트림 호출의 지연을 시각화합니다.",
      "CloudTrail은 API 호출에 대한 감사 로그를 남길 뿐, 한 요청이 함수와 다운스트림을 거치며 어디서 시간을 쓰는지 구간별로 시각화하지 못한다 — 그건 X-Ray의 역할이다."
    ],
    "title": "다운스트림 호출까지 포함한 지연 병목 찾기",
    "difficulty": "medium",
    "references": [
      {
        "title": "Visualize Lambda function invocations using AWS X-Ray",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html"
      }
    ]
  },
];
