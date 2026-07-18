// 자동 생성 — scripts/gen-source-routes.mjs. 직접 편집하지 말 것.
// dev 검수 도구 전용 매니페스트: content/ 최상위 날것 원본 목록.
// 제품 registry(content/registry.ts)와 무관하며, 여기의 어떤 것도 제품 경로로 새지 않는다.

export interface SourceItem {
  /** content/ 기준 파일명 */
  file: string;
  kind: "jsx" | "html";
  /** 제품 챕터가 아니라 저작용 템플릿임을 구분 (제외하진 않음) */
  isTemplate?: boolean;
}

export const SOURCES: SourceItem[] = [
  { file: "aws_api_gateway_dva.jsx", kind: "jsx" },
  { file: "aws-cdk-dva-guide.jsx", kind: "jsx" },
  { file: "aws-cicd-guide.jsx", kind: "jsx" },
  { file: "aws-cognito-guide.jsx", kind: "jsx" },
  { file: "aws-container-guide.jsx", kind: "jsx" },
  { file: "aws-dva-api-gateway.jsx", kind: "jsx" },
  { file: "aws-dva-cicd.jsx", kind: "jsx" },
  { file: "aws-dva-ec2-guide.jsx", kind: "jsx" },
  { file: "aws-dva-elb-asg.jsx", kind: "jsx" },
  { file: "aws-dva-iam-guide-2.jsx", kind: "jsx" },
  { file: "aws-dva-messaging.jsx", kind: "jsx" },
  { file: "aws-dva-monitoring.jsx", kind: "jsx" },
  { file: "aws-dva-rds-aurora-elasticache.jsx", kind: "jsx" },
  { file: "aws-dva-s3-guide.jsx", kind: "jsx" },
  { file: "aws-dva-security-guide-1.jsx", kind: "jsx" },
  { file: "aws-elastic-beanstalk-guide.jsx", kind: "jsx" },
  { file: "aws-lambda-dva-guide-2.jsx", kind: "jsx" },
  { file: "aws-lambda-dva-guide.jsx", kind: "jsx" },
  { file: "aws-messaging-visual-guide.jsx", kind: "jsx" },
  { file: "aws-s3-dva-guide.jsx", kind: "jsx" },
  { file: "aws-vpc-guide.jsx", kind: "jsx" },
  { file: "cloudformation-dva-guide.jsx", kind: "jsx" },
  { file: "dva-chapter-template.jsx", kind: "jsx", isTemplate: true },
  { file: "dynamodb-guide.jsx", kind: "jsx" },
  { file: "iam_guide.jsx", kind: "jsx" },
  { file: "lambda-dva-study.jsx", kind: "jsx" },
  { file: "sam_guide.jsx", kind: "jsx" },
  { file: "aws-dva-stage0.html", kind: "html" },
];

/**
 * URL 슬러그 = 확장자 뗀 파일명. 생성기가 슬러그 충돌을 막아준다.
 */
export function slugOf(file: string): string {
  return file.replace(/\.[^.]+$/, "");
}

export function getByFile(file: string): SourceItem | undefined {
  return SOURCES.find((s) => s.file === file);
}
