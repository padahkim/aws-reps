"use client";

import { Component, type ReactNode } from "react";

// 날것 원본 하나가 렌더 중 던져도 목차·다른 파일은 살아있게 하는 격리 경계.
// 검수 도구이므로 실패를 숨기지 않고 파일명 + 에러 메시지를 그대로 노출한다.
interface Props {
  file: string;
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div
          style={{
            padding: "1.5rem",
            border: "1px solid #e11d48",
            borderRadius: "8px",
            background: "#fff1f2",
            color: "#9f1239",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <strong>⚠ 렌더 실패: {this.props.file}</strong>
          {"\n\n"}
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ""}
        </div>
      );
    }
    return this.props.children;
  }
}
