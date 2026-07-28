/**
 * 미리 보는 질문 (pretesting — 규약 v3.1, #148 spike 채택안 4 → #161).
 * 그 섹션 셀프 퀴즈의 **질문 텍스트만** 보여 준다. 답을 찾으며 읽게 만드는 예고이지
 * 인출 과제가 아니다 — 그래서 두 가지가 금지다 (schema.ts "챕터 오리엔테이션 규약"):
 *   ✗ SelfQuiz 위젯 재사용 (결과 화면 프레이밍이 "숙달 확인" 전제라 어긋난다)
 *   ✗ 응답 수집·채점 — 그건 섹션 하단 셀프 퀴즈(afterSection)가 그대로 담당한다 (#105·#150)
 * 그래서 이 컴포넌트는 상태 없는 서버 컴포넌트이고, 앞으로도 그래야 한다.
 */
export function PreviewQuestions({ questions }: { questions: string[] }) {
  return (
    <section
      aria-label="미리 보는 질문"
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 12,
        padding: "0.9rem 1.1rem",
        margin: "1.2rem 0 0",
      }}
    >
      <h3
        style={{
          fontSize: "0.78rem",
          letterSpacing: "0.04em",
          color: "var(--muted)",
          textTransform: "uppercase",
        }}
      >
        미리 보는 질문
      </h3>
      <ol
        style={{
          listStyle: "decimal",
          paddingLeft: "1.2rem",
          display: "grid",
          gap: "0.3rem",
          margin: "0.5rem 0 0",
          fontSize: "0.92rem",
        }}
      >
        {questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ol>
      <p style={{ marginTop: "0.7rem", fontSize: "0.82rem", color: "var(--muted)" }}>
        지금 못 풀어도 정상입니다 — 읽으면서 답을 찾아 보세요. 답은 이 섹션 아래 셀프 퀴즈에서
        확인합니다.
      </p>
    </section>
  );
}
