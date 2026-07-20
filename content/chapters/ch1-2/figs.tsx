import type { ReactNode } from "react";
import { C } from "../ui";

/** 챕터 도식 SVG + 챕터 로컬 컴포넌트 (규약 v3) — sections/*.mdx 가 import 한다. 내용은 body.tsx 시절 그대로. */

export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** 코드/CLI 예시 블록 — 잉크 배경 카드 (전역 셀렉터 없이 인라인 스타일만). */
export function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div style={{ margin: "1rem 0" }}>
      {title && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: C.inkSoft,
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          fontFamily: MONO,
          fontSize: "0.8rem",
          lineHeight: 1.7,
          background: C.ink,
          color: "#D5E0EC",
          borderRadius: 11,
          padding: "1rem 1.15rem",
          overflowX: "auto",
          margin: 0,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

/** 주의(함정) 콜아웃 — 레드 왼쪽 보더. */
export function WarnBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: C.redSoft,
        color: C.ink,
        borderLeft: `5px solid ${C.red}`,
        borderRadius: "0 12px 12px 0",
        padding: "0.85rem 1.15rem",
        margin: "1.25rem 0",
        fontSize: "0.93rem",
      }}
    >
      <b style={{ color: C.red }}>⚠ 함정 </b>
      {children}
    </div>
  );
}

export function InvocationSvg() {
  return (
    <svg viewBox="0 0 700 210" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="15" y="20" width="210" height="52" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="120" y="42" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={C.blue}>
        ① 동기 (sync)
      </text>
      <text x="120" y="60" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        CLI/SDK · API Gateway · ALB
      </text>
      <rect x="15" y="82" width="210" height="52" rx="10" fill={C.amberSoft} stroke={C.amber} strokeWidth="1.5" />
      <text x="120" y="104" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={C.amberText}>
        ② 비동기 (async · push)
      </text>
      <text x="120" y="122" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        S3 · SNS · EventBridge
      </text>
      <rect x="15" y="144" width="210" height="52" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="120" y="166" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={C.teal}>
        ③ 이벤트 소스 매핑 (poll)
      </text>
      <text x="120" y="184" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        Kinesis · DDB Streams · SQS
      </text>
      <rect x="410" y="82" width="150" height="52" rx="10" fill={C.card} stroke={C.ink} strokeWidth="1.6" />
      <text x="485" y="112" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.ink}>
        Lambda
      </text>
      <line x1="225" y1="46" x2="410" y2="98" stroke={C.blue} strokeWidth="1.6" />
      <line x1="225" y1="108" x2="410" y2="108" stroke={C.amber} strokeWidth="1.6" />
      <line x1="410" y1="122" x2="225" y2="170" stroke={C.teal} strokeWidth="1.6" />
      <text x="318" y="60" fontSize="9.5" fill={C.blue} fontWeight="700">
        결과 즉시 반환
      </text>
      <text x="318" y="100" fontSize="9.5" fill={C.amberText} fontWeight="700">
        202 반환 · 이벤트 큐
      </text>
      <text x="300" y="162" fontSize="9.5" fill={C.teal} fontWeight="700">
        Lambda가 폴링 → 동기 호출
      </text>
      <text x="575" y="100" fontSize="9.5" fill={C.inkSoft}>
        오류 처리·재시도가
      </text>
      <text x="575" y="116" fontSize="9.5" fill={C.inkSoft}>
        유형마다 다름 = 시험 핵심
      </text>
    </svg>
  );
}

export function PermissionSvg() {
  return (
    <svg viewBox="0 0 700 190" style={{ width: "100%", height: "auto" }} role="img">
      <rect x="30" y="25" width="150" height="50" rx="10" fill={C.card} stroke={C.amber} strokeWidth="1.6" />
      <text x="105" y="55" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        Lambda 함수
      </text>
      <rect x="470" y="25" width="200" height="50" rx="10" fill={C.blueSoft} stroke={C.blue} strokeWidth="1.5" />
      <text x="570" y="48" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>
        S3 · DynamoDB · SQS …
      </text>
      <text x="570" y="65" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        읽기/쓰기 (나가는 방향)
      </text>
      <line x1="180" y1="50" x2="470" y2="50" stroke={C.amber} strokeWidth="2" />
      <text x="325" y="40" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.amberText}>
        실행 역할 (Execution Role)
      </text>
      <rect x="30" y="115" width="200" height="50" rx="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
      <text x="130" y="138" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>
        다른 서비스 · 다른 계정
      </text>
      <text x="130" y="155" textAnchor="middle" fontSize="9.5" fill={C.inkSoft}>
        S3 이벤트, ALB, 계정 B …
      </text>
      <rect x="520" y="115" width="150" height="50" rx="10" fill={C.card} stroke={C.amber} strokeWidth="1.6" />
      <text x="595" y="145" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.amberText}>
        함수 호출
      </text>
      <line x1="230" y1="140" x2="520" y2="140" stroke={C.teal} strokeWidth="2" />
      <text x="375" y="130" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.teal}>
        리소스 기반 정책 (들어오는 방향)
      </text>
    </svg>
  );
}
