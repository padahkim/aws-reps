# Project: aws-reps

AWS DVA-C02 학습 사이트. 백지에서 시작하는 독립 프로젝트다.

## Branch strategy

- `main`: 릴리스 트렁크 (기본 브랜치). 직접 커밋 금지. 릴리스 시점에만 `develop`→`main` 머지.
- `develop`: 통합 브랜치. 모든 작업의 유일한 머지 대상.
- 작업 브랜치: `feat/*`(기능·콘텐츠) · `fix/*`(버그·사실 수정) · `docs/*`(문서) · `chore/*`(설정·정리) — `develop`에서 분기한다.

### AI 세션 작업 흐름 (모든 Claude 세션이 따른다)

1. **시작 — 동기화**: `git fetch origin` 후 `develop`이 `origin/develop`과 일치하는지 확인한다 (다른 PC에서 작업했을 수 있음). 어긋나면 ff-only로 맞추고 시작한다.
2. **분기**: 최신 `develop`에서 작업 브랜치를 만든다. 앱이 자동 생성한 `claude/*` 워크트리 브랜치는 베이스가 낡았을 수 있으니 그 위에서 작업하지 말고, 워크트리 안에서 갈아탄다: `git switch -c feat/<주제> develop`.
3. **작업**: 한 브랜치 = 한 주제. 주제가 바뀌면 먼저 착지하고 새 브랜치를 판다.
4. **착지 (세션 종료 전 필수)**: 완료·검증된 작업은 세션이 끝나기 전에 `develop`에 머지하고 push까지 마친다. 머지가 이르면(미검증·리뷰 필요) 브랜치만 push하고 "머지 대기 + 이유"를 사용자에게 보고한다. **머지도 보고도 없이 브랜치에 작업을 방치하지 않는다** (schema.ts 고립 사고 재발 방지).
5. **머지 방법**: `develop`은 메인 워크트리(`~/pdk/projects/aws-reps`)에 체크아웃돼 있다 (현재 구조) — 세션 워크트리에서는 메인이 클린인지 확인한 뒤 `git -C ~/pdk/projects/aws-reps merge <브랜치>` → `git -C ~/pdk/projects/aws-reps push origin develop`. gh 금지이므로 PR 없이 직접 머지가 기본이다.
6. **정리**: 머지된 작업 브랜치는 즉시 `git branch -d`로 삭제한다.
7. **예외**: 오탈자·한두 줄 수준의 단일 커밋은 `develop` 직접 커밋을 허용한다.

## Process rules

- CRITICAL: `gh` CLI 사용 금지 (회사 계정으로 로그인되어 있음). 원격 작업은 plain `git`만 사용한다.
- CRITICAL: API 키·시크릿을 코드/번들/리포에 노출 금지.
- 커밋 메시지는 영어, conventional-commits 형식 (feat:, fix:, docs:, refactor:).

## Harness

- `.claude/settings.json`(커밋됨)이 PreToolUse 훅 `scripts/git_guard.py`를 등록한다 — gh CLI와 파괴적 명령(rm -rf, git push --force, git reset --hard 등)을 차단한다.
