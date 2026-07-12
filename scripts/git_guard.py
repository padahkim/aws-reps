#!/usr/bin/env python3
"""PreToolUse hook: block gh CLI and destructive commands in this repo."""
import json
import re
import sys

BLOCK_PATTERNS = [
    (r"(^|[|;&\s])gh\s+\w",
     "gh CLI 사용 금지 (회사 계정 로그인 상태) — 원격 작업은 plain git만 사용한다."),
    (r"\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b",
     "rm -rf 금지 — 삭제가 필요하면 사용자에게 요청한다."),
    (r"\bgit\b[^|;&\n]*\bpush\b[^|;&\n]*(--force\b|-f\b|--force-with-lease)",
     "git push --force 금지."),
    (r"\bgit\b[^|;&\n]*\breset\b[^|;&\n]*--hard",
     "git reset --hard 금지."),
    (r"\bgit\b[^|;&\n]*\bclean\b[^|;&\n]*-[a-zA-Z]*f",
     "git clean -f 금지."),
    (r"\bgit\b[^|;&\n]*\bbranch\b[^|;&\n]*\s-D\b",
     "git branch -D (강제 삭제) 금지."),
]


def find_violation(command: str):
    for pattern, message in BLOCK_PATTERNS:
        if re.search(pattern, command):
            return message
    return None


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    if data.get("tool_name") != "Bash":
        sys.exit(0)
    command = (data.get("tool_input") or {}).get("command") or ""
    message = find_violation(command)
    if message:
        print(f"BLOCKED by git_guard: {message}", file=sys.stderr)
        sys.exit(2)
    sys.exit(0)


if __name__ == "__main__":
    main()
