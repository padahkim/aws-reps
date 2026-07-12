# Project: aws-reps

AWS DVA-C02 학습 사이트. 백지에서 시작하는 독립 프로젝트다.

## Branch strategy

- `main`: 릴리스 트렁크 (기본 브랜치). 직접 커밋 금지.
- `develop`: 통합 브랜치. 작업 브랜치의 머지 대상.
- `feat/*`, `fix/*`, `docs/*`: 작업 브랜치 — `develop`에서 분기하고 PR로 `develop`에 머지한다.

## Process rules

- CRITICAL: `gh` CLI 사용 금지 (회사 계정으로 로그인되어 있음). 원격 작업은 plain `git`만 사용한다.
- CRITICAL: API 키·시크릿을 코드/번들/리포에 노출 금지.
- 커밋 메시지는 영어, conventional-commits 형식 (feat:, fix:, docs:, refactor:).

## Harness

- `.claude/settings.json`(커밋됨)이 PreToolUse 훅 `scripts/git_guard.py`를 등록한다 — gh CLI와 파괴적 명령(rm -rf, git push --force, git reset --hard 등)을 차단한다.
