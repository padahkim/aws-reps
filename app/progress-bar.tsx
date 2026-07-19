/**
 * 진도 바 (+% 병기) — 홈·챕터 목차 공용 표시 컴포넌트 (이슈 #7 확정: 진도 바 + % 병기).
 * done/total 은 섹션 페이지 수 기준 (퀴즈 섹션 포함). 순수 표시 — 저장소는 lib/progress.ts.
 */
export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 120,
          maxWidth: "40vw",
          height: 6,
          borderRadius: 99,
          background: "var(--border)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            width: `${pct}%`,
            height: "100%",
            background: "var(--accent)",
          }}
        />
      </span>
      <span
        style={{
          fontSize: "0.8rem",
          color: "var(--muted)",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {pct}% ({done}/{total})
      </span>
    </span>
  );
}
