# Project: aws-reps

AWS DVA-C02 학습 사이트. 백지에서 시작하는 독립 프로젝트다.

## Branch strategy

- `main`: 릴리스 트렁크 = Vercel 프로덕션(aws-reps.vercel.app). 직접 커밋 금지, `develop`→`main` 머지로만 갱신 — 릴리스 시점, 그리고 하네스(CLAUDE.md·`.claude/`·`scripts/`) 변경 전파 시.
- `develop`: 통합 브랜치이자 **GitHub 기본 브랜치** (PR 기본 base, `closes #N` 자동 닫힘 작동 대상). 모든 작업의 유일한 머지 대상. push마다 Vercel 프리뷰(+/_source 검수) 자동 배포. 작업 시작 전 `git fetch origin`으로 `origin/develop`과 일치를 확인한다 (다른 PC 작업 가능성).
- 작업 브랜치(`feat/*`·`fix/*`·`docs/*`·`chore/*`)는 최신 `develop`에서 분기한다. 앱이 자동 생성한 `claude/*` 워크트리 브랜치는 베이스가 낡았을 수 있으니 그 위에서 작업 금지 — `git switch -c feat/<주제> develop`으로 갈아탄다. 한 브랜치 = 한 주제.
- **착지 필수**: 세션 종료 전, 작업을 `/land` 스킬로 착지시킨다 (절차는 `.claude/skills/land/SKILL.md`). 검증된 일상 작업은 즉시 착지(develop 직접 머지·push), 리뷰가 필요한 변경(미검증·하네스·대규모/의존성/배포)은 PR 착지 — 브랜치 push 후 PR을 만들고 사용자 승인을 기다린다. **머지도 보고도 없는 방치 금지** (schema.ts 고립 사고 재발 방지).
- 예외: 오탈자·한두 줄 수준의 단일 커밋은 `develop` 직접 커밋을 허용한다.

## Task management

- 과제 관리는 **GitHub Issues가 단일 진실**이다. 새 과제·버그·개선점은 발견 즉시 이슈로 등록한다 (`/write-issue`) — 별도 백로그 md 금지.
- 이슈 형식: 제목 + 본문 완료 기준 체크박스. 라벨·이슈 템플릿·마일스톤은 같은 필요가 3번 반복 증명되기 전까지 도입하지 않는다.
- 로드맵은 **에픽 큐**로 관리한다 (2026-07 도입, #15~#25):
  - 에픽 = 굵은 단위의 기능 이슈. AC·하위 이슈 상세화는 **착수 직전에만** 한다 (rolling-wave) — 몇 달 뒤 착수할 에픽의 상세를 미리 쓰지 않는다.
  - 에픽의 첫 체크박스 = **타임박스 spike**: 산출물은 코드가 아니라 결정 (대안 비교 → 채택/기각, 기각도 정상 결과). 에픽 제목의 기술 선택(Cognito·DynamoDB 등)은 spike 전까지 가설이다.
  - spike가 생성하는 하위 구현 이슈는 부모 에픽의 **sub-issue**로 연결한다 (GraphQL `addSubIssue`) — 에픽에 진행률이 붙고, 보드에서 Group by: Parent issue로 에픽별 묶음이 보인다. 하위 이슈도 보드에 추가한다.
  - **WIP 1**: 동시 착수는 큐 맨 앞 이슈 1개. 나머지는 주차된 지도다.
- **Projects 보드 "aws-reps 로드맵"(프로젝트 #1)** 은 큐의 시각화다. 갱신은 사람이 아니라 세션이 한다: 이슈 착수 시 In Progress, `/land` 착지 시 Done (절차는 land 스킬). 보드 추가 시 **Phase 필드**(Phase1. 콘텐츠 ~ Phase5. 마무리 / 상시·기타)도 설정한다 — GitHub Milestones 대신 이 필드를 쓴다. 어긋난 보드는 없는 보드보다 나쁘다 — gh 차단 머신에서 작업했다면 다음 gh 가능 세션 시작 시 보드를 현실에 맞춘다.
- 작업 단위 = 이슈 1개: 구현 → 프리뷰 확인 → `/land` 착지 → 이슈 닫힘. develop이 기본 브랜치이므로 커밋·PR 본문의 `closes #N`으로 자동 닫힌다.
- gh 차단 머신(회사)에서는 이슈를 GitHub 웹으로 읽고 쓴다 — 규칙은 동일하게 적용된다.

## Process rules

- CRITICAL: `gh` CLI는 **기본 차단** — 홈 마커(`~/.claude/aws-reps-allow-gh`)가 있고 gh 활성 계정이 개인 계정(padahkim)인 머신에서만 허용한다 (git_guard가 강제). 회사 머신은 아무 설정도 하지 않으면 차단이 유지되며, 그 경우 원격 작업은 plain `git`만 사용한다.
- CRITICAL: API 키·시크릿을 코드/번들/리포에 노출 금지.
- 패키지 매니저 = **npm** 고정. `package-lock.json` 커밋 필수, yarn/pnpm 혼용 금지 (세션 간 lockfile 분기 방지).
- 커밋 메시지는 영어, conventional-commits 형식 (feat:, fix:, docs:, refactor:).

## Harness

- `.claude/settings.json`(커밋됨)이 PreToolUse 훅 `scripts/git_guard.py`를 등록한다 — gh CLI(위 조건 미충족 시)와 파괴적 명령(rm -rf, git push --force, git reset --hard 등)을 차단한다.
