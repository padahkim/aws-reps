import type { Metadata } from "next";
import { glossary } from "@/lib/content";
import { GlossaryView } from "./glossary-view";

export const metadata: Metadata = {
  title: "용어집 — AWS DVA-C02 학습",
  description: "본문에 등장하는 AWS 고유 용어·약어 사전",
};

/**
 * 전역 용어집 페이지 (#192, spike #57 결정) — 단일 정적 페이지 + 항목별 id 앵커.
 * 데이터 정본은 content/glossary.ts, 소비는 lib/content.ts 통로로만.
 * 표시 순서는 여기서 정한다 (배열 순서는 계약이 아니다 — glossary.ts 머리말):
 * 사전이므로 가나다·알파벳 정렬. Intl.Collator 는 빌드 시 한 번 실행되는 결정적
 * 정렬이라 SSG(output: "export")와 충돌하지 않는다.
 *
 * 목록·암기 모드 렌더는 GlossaryView(#210, "use client")가 맡는다 — 암기 체크가
 * localStorage 에 있어 클라이언트 경계가 필요하다. 클라이언트 컴포넌트도 SSG 에서
 * 선렌더되므로 사전 본문은 여전히 정적 HTML 에 담긴다 (review-board 와 같은 구조).
 */
const collator = new Intl.Collator("ko");

export default function GlossaryPage() {
  const terms = [...glossary].sort((a, b) => collator.compare(a.term, b.term));

  return (
    <>
      {/* 예전에 여기 있던 `← 홈`은 없앴다 (#247) — 전역 앱바의 홈과 같은 목적지이고,
          왼쪽 화살표라 앱바의 뒤로와 뜻이 겹쳤다. 용어집에서 챕터로 갔다가 돌아오는 길은
          앱바의 뒤로가 맡는다 (홈이 아니라 **용어집**으로 돌아와야 하므로 이 링크로는
          애초에 안 되던 일이다). */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>용어집</h1>
        <p style={{ color: "var(--muted)" }}>
          본문에 등장하는 AWS 고유 용어·약어 {terms.length}개 — 각 항목은{" "}
          <code>#용어id</code> 앵커로 바로 열 수 있습니다.
        </p>
      </header>

      <GlossaryView terms={terms} />
    </>
  );
}
