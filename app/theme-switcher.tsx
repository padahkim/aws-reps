"use client";

import { useEffect, useRef, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

const THEMES: { id: Theme; label: string; Icon: React.ComponentType<{ "aria-hidden"?: boolean | "true" | "false"; width?: number; height?: number; viewBox?: string; fill?: string; stroke?: string; strokeWidth?: number | string; strokeLinecap?: "inherit" | "round" | "butt" | "square"; strokeLinejoin?: "inherit" | "round" | "miter" | "bevel" }> }[] = [
  { id: "light", label: "라이트", Icon: SunIcon },
  { id: "dark", label: "다크", Icon: MoonIcon },
  { id: "system", label: "시스템", Icon: MonitorIcon },
];

/**
 * 테마 토글 세그먼트 컨트롤 (#282).
 * [☀️ 라이트 | 🌙 다크 | 🖥️ 시스템] 선택 및 localStorage 영속화, data-theme 동기화,
 * 브라우저 theme-color 메타 태그 동기화 및 WAI-ARIA Radio Group 키보드 탐색(roving tabIndex) 지원.
 */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system");
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let currentTheme: Theme = "system";
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        currentTheme = saved;
        setTheme(saved);
      }
    } catch {
      // 로컬 스토리지 접근 차단 환경 폴백
    }

    applyTheme(currentTheme);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark" || e.newValue === "system")) {
        setTheme(e.newValue);
        applyTheme(e.newValue);
      }
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (!saved || saved === "system") {
          updateThemeColor("system");
        }
      } catch {
        updateThemeColor("system");
      }
    };

    window.addEventListener("storage", onStorage);
    media.addEventListener("change", onMediaChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      media.removeEventListener("change", onMediaChange);
    };
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

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % THEMES.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + THEMES.length) % THEMES.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = THEMES.length - 1;
    }

    if (nextIndex !== -1) {
      const next = THEMES[nextIndex].id;
      selectTheme(next);
      buttonRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="theme-switcher" role="radiogroup" aria-label="화면 테마 선택">
      {THEMES.map((item, index) => {
        const isChecked = theme === item.id;
        const Icon = item.Icon;
        return (
          <button
            key={item.id}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isChecked}
            tabIndex={isChecked ? 0 : -1}
            className={`theme-btn ${isChecked ? "active" : ""}`}
            onClick={() => selectTheme(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            title={`${item.label} 모드`}
            aria-label={`${item.label} 모드`}
          >
            <Icon />
            <span className="theme-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeColor(theme);
}

export function updateThemeColor(theme: Theme) {
  if (typeof document === "undefined") return;
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    metas.forEach((m) => {
      const media = m.getAttribute("media");
      if (media?.includes("dark")) m.setAttribute("content", "#0d1117");
      else if (media?.includes("light")) m.setAttribute("content", "#ffffff");
      else m.setAttribute("content", isDark ? "#0d1117" : "#ffffff");
    });
    return;
  }
  const color = theme === "dark" ? "#0d1117" : "#ffffff";
  metas.forEach((m) => m.setAttribute("content", color));
  if (metas.length === 0) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = color;
    document.head.appendChild(meta);
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
