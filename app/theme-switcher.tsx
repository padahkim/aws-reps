"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

/**
 * 테마 토글 세그먼트 컨트롤 (#282).
 * [☀️ 라이트 | 🌙 다크 | 🖥️ 시스템] 선택 및 localStorage 영속화, data-theme 동기화.
 */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        setTheme(saved);
      }
    } catch {
      // 로컬 스토리지 접근 차단 환경 폴백
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark" || e.newValue === "system")) {
        setTheme(e.newValue);
        applyTheme(e.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const selectTheme = (next: Theme) => {
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 로컬 스토리지 비활성 예외 무시
    }
  };

  return (
    <div className="theme-switcher" role="radiogroup" aria-label="화면 테마 선택">
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        className={`theme-btn ${theme === "light" ? "active" : ""}`}
        onClick={() => selectTheme("light")}
        title="라이트 모드"
        aria-label="라이트 모드"
      >
        <SunIcon />
        <span className="theme-label">라이트</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        className={`theme-btn ${theme === "dark" ? "active" : ""}`}
        onClick={() => selectTheme("dark")}
        title="다크 모드"
        aria-label="다크 모드"
      >
        <MoonIcon />
        <span className="theme-label">다크</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "system"}
        className={`theme-btn ${theme === "system" ? "active" : ""}`}
        onClick={() => selectTheme("system")}
        title="시스템 모드"
        aria-label="시스템 모드"
      >
        <MonitorIcon />
        <span className="theme-label">시스템</span>
      </button>
    </div>
  );
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  if (theme === "system") {
    document.documentElement.setAttribute("data-theme", "system");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}
