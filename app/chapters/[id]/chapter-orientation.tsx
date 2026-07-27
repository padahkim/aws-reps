/**
 * 챕터 오리엔테이션 (선행조직자 — 규약 v3.1, #148 spike 채택안 1 → #161).
 * 목차 위에서 "무엇을 할 수 있게 되는가 · 얼마나 걸리나 · 어디부터 읽나"를 먼저 준다.
 *
 * 서버 컴포넌트 — 상태가 없다. objectives 가 있는 챕터에서만 렌더된다 (호출부가 판단).
 */
export function ChapterOrientation({
  objectives,
  minutes,
  sectionCount,
  partCount,
}: {
  objectives: string[];
  minutes?: number;      // 산출 실패 시 생략 — 틀린 수치보다 없는 편이 낫다
  sectionCount: number;
  partCount: number;
}) {
  const facts = [
    minutes !== undefined ? `예상 소요 약 ${minutes}분` : null,
    `섹션 ${sectionCount}개`,
    partCount > 0 ? `파트 ${partCount}개` : null,
  ].filter(Boolean) as string[];

  return (
    <section
      aria-label="챕터 안내"
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "1rem 1.1rem",
        margin: "0 0 1.5rem",
      }}
    >
      <h2
        style={{
          fontSize: "0.78rem",
          letterSpacing: "0.04em",
          color: "var(--muted)",
          textTransform: "uppercase",
        }}
      >
        이 챕터를 마치면
      </h2>
      <ul style={{ listStyle: "none", display: "grid", gap: "0.35rem", margin: "0.6rem 0 0" }}>
        {objectives.map((objective) => (
          <li key={objective} style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
            <span aria-hidden style={{ color: "var(--accent)", fontWeight: 900 }}>
              ·
            </span>
            <span>{objective}</span>
          </li>
        ))}
      </ul>

      <p
        style={{
          marginTop: "0.9rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border)",
          fontSize: "0.85rem",
          color: "var(--muted)",
        }}
      >
        {facts.join(" · ")}
      </p>
      <p style={{ marginTop: "0.3rem", fontSize: "0.85rem", color: "var(--muted)" }}>
        시간이 없다면 — 아래 목차의 <b style={{ color: "var(--fg)" }}>★★★</b> 섹션부터 읽으세요.
        시험에 가장 자주 나오는 자리입니다.
      </p>
    </section>
  );
}
