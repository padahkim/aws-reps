#!/usr/bin/env python3
"""PreToolUse hook: block gh CLI (unless personal machine) and destructive commands.

gh 정책: 기본 차단(fail-closed). 아래 두 조건을 모두 만족하는 머신에서만 허용 —
  1. 홈 마커 존재: ~/.claude/aws-reps-allow-gh (touch로 생성; 리포 밖이라 커밋 불가,
     워크트리·재clone과 무관하게 머신 단위로 적용된다)
  2. gh 활성 계정 == 개인 계정(padahkim) — hosts.yml에서 오프라인으로 확인
회사 컴퓨터는 아무 설정도 하지 않으면 차단이 유지된다.
"""
import json
import os
import re
import sys
from pathlib import Path

GH_ALLOWED_USER = "padahkim"
GH_ALLOW_MARKER = Path.home() / ".claude" / "aws-reps-allow-gh"
GH_PATTERN = r"(^|[|;&\s])gh\s+\w"

BLOCK_PATTERNS = [
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


def gh_active_user():
    """hosts.yml에서 활성 계정을 읽는다. 판별 불가면 None (= 차단)."""
    config_dir = os.environ.get("GH_CONFIG_DIR") or str(Path.home() / ".config" / "gh")
    try:
        text = (Path(config_dir) / "hosts.yml").read_text()
    except OSError:
        return None
    # github.com 블록의 "user: <name>" 줄이 활성 계정이다.
    # users: 아래의 계정명 키는 "<name>:" 형태라 이 패턴에 걸리지 않는다.
    m = re.search(r"^\s+user:\s*(\S+)\s*$", text, re.M)
    return m.group(1) if m else None


def gh_violation():
    if not GH_ALLOW_MARKER.exists():
        return ("gh CLI 차단 (기본값) — 개인 머신이면 `touch ~/.claude/aws-reps-allow-gh` "
                "후 재시도. 회사 머신에서는 plain git만 사용한다.")
    user = gh_active_user()
    if user != GH_ALLOWED_USER:
        return (f"gh 활성 계정이 {GH_ALLOWED_USER}(개인)이 아님 (현재: {user or '판별 불가'}) "
                "— 회사 계정 오발사 방지 차단. `gh auth switch`로 개인 계정 활성화 후 재시도.")
    return None


def find_violation(command: str):
    if re.search(GH_PATTERN, command):
        message = gh_violation()
        if message:
            return message
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
