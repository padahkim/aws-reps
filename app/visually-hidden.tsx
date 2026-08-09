import type { CSSProperties, ReactNode } from "react";

/**
 * 화면에서만 감추고 접근성 트리에는 남기는 글자 (#253).
 *
 * 배경: 밋밋한 `span` 의 암묵 role 은 `generic` 이고 **ARIA 는 generic 에 author 가 이름을
 * 부여하는 것을 금지한다**. 그래서 "바깥 span 에 `aria-label` + 안쪽 글자는 통째로
 * `aria-hidden`" 이라는 관용구는 배지를 통째로 지운다 — 라벨은 노출이 보장되지 않는 반면
 * 숨김은 확실히 동작하기 때문이다 (PR #252 Codex P2 → #253).
 *
 * 그러니 기본 처방은 **글자를 실제 텍스트로 노출**하는 것이고, 이 컴포넌트는 그것만으로
 * 뜻이 안 서는 자리(★★☆·✓ 같은 기호)에만 쓴다. 남용하면 화면과 낭독이 갈라진다.
 *
 * 구현이 1px 클립인 이유: `display:none`·`visibility:hidden` 은 접근성 트리에서도 사라져
 * 목적을 못 이룬다. `position:absolute` 라 자기 자리를 차지하지 않으므로 감싼 flex/grid 의
 * 간격은 그대로다. CSS 클래스가 아니라 컴포넌트인 것은 이 리포 `app/` 의 관례를 따른 것이다
 * (globals.css 는 토큰·리셋만 두고 컴포넌트는 인라인 스타일로 그린다).
 */
const STYLE: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span style={STYLE}>{children}</span>;
}
