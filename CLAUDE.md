# Project: aws-reps

AWS DVA-C02 학습 사이트. 백지에서 시작하는 독립 프로젝트다.

## Branch strategy

- `main`: 릴리스 트렁크 (기본 브랜치). 직접 커밋 금지. 릴리스 시점에만 `develop`→`main` 머지.
- `develop`: 통합 브랜치. 모든 작업의 유일한 머지 대상. 작업 시작 전 `git fetch origin`으로 `origin/develop`과 일치를 확인한다 (다른 PC 작업 가능성).
- 작업 브랜치(`feat/*`·`fix/*`·`docs/*`·`chore/*`)는 최신 `develop`에서 분기한다. 앱이 자동 생성한 `claude/*` 워크트리 브랜치는 베이스가 낡았을 수 있으니 그 위에서 작업 금지 — `git switch -c feat/<주제> develop`으로 갈아탄다. 한 브랜치 = 한 주제.
- **착지 필수**: 세션 종료 전, 검증된 작업은 `/land` 스킬로 `develop`에 머지·push한다 (절차는 `.claude/skills/land/SKILL.md`). 머지가 이르면 브랜치만 push하고 "머지 대기 + 이유"를 보고한다. **머지도 보고도 없는 방치 금지** (schema.ts 고립 사고 재발 방지).
- 예외: 오탈자·한두 줄 수준의 단일 커밋은 `develop` 직접 커밋을 허용한다.

## Process rules

- CRITICAL: `gh` CLI 사용 금지 (회사 계정으로 로그인되어 있음). 원격 작업은 plain `git`만 사용한다.
- CRITICAL: API 키·시크릿을 코드/번들/리포에 노출 금지.
- 커밋 메시지는 영어, conventional-commits 형식 (feat:, fix:, docs:, refactor:).

## Harness

- `.claude/settings.json`(커밋됨)이 PreToolUse 훅 `scripts/git_guard.py`를 등록한다 — gh CLI와 파괴적 명령(rm -rf, git push --force, git reset --hard 등)을 차단한다.
