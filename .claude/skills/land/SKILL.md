---
name: land
description: 작업 브랜치를 develop에 착지시킨다 — 검증된 일상 작업은 즉시 머지·push, 리뷰가 필요한 변경(미검증·하네스·대규모)은 PR 생성 후 승인 대기. 작업 단위가 끝났을 때, 그리고 세션을 마치기 전에 반드시 호출. CLAUDE.md "착지 필수" 규칙의 실행 절차.
---

# /land — 작업 브랜치를 develop에 착지

목표: 현재 작업 브랜치의 커밋을 `develop`에 도달시킨다. 경로는 두 가지 — **즉시 착지**(직접 머지·push) 또는 **PR 착지**(PR 생성 후 사용자 승인 대기). 둘 중 하나가 끝나야(PR 착지는 "PR 보고"까지 하면) 착지 의무가 충족된 것이다.

이 리포의 `develop`은 메인 워크트리에 체크아웃돼 있다 (현재 구조). 세션 워크트리에서 develop을 조작할 때는 항상 `git -C`를 쓴다. 아래 명령은 이 변수를 전제한다:

```bash
# develop이 체크아웃된 워크트리를 동적으로 찾는다 (PC마다 경로가 다를 수 있으므로 하드코딩 금지)
MAIN=$(git worktree list --porcelain \
  | awk '/^worktree /{w=$2} /^branch refs\/heads\/develop$/{print w}')
BR=<착지할 작업 브랜치>
```

`MAIN`이 비어 있으면 develop이 어느 워크트리에도 체크아웃돼 있지 않다는 뜻이다 — 멈추고 사용자에게 보고한다 (이 경우 `git -C ""`는 위험하니 절대 이어가지 않는다).

## 경로 선택 — 즉시 착지냐, PR 착지냐

아래 중 **하나라도 해당하면 PR 착지**, 전부 아니면 즉시 착지. 애매하면 PR 쪽을 택한다.

1. **미검증** — 작업 결과를 직접 확인하지 못했거나 사용자 확인이 필요하다.
2. **하네스 변경** — CLAUDE.md · `.claude/` · `scripts/` 를 건드렸다 (규칙 자체를 바꾸는 것이라 사용자가 diff를 봐야 한다).
3. **되돌리기 비용이 큰 변경** — 큰 구조 변경, 의존성 추가, 설정/배포 관련.

단, 사용자가 이 세션에서 해당 변경 내용을 이미 구체적으로 검토·승인했다면 그것이 리뷰다 — 즉시 착지해도 된다.

gh를 쓸 수 없는 머신(git_guard가 차단 — 회사 머신 등)에서 PR 착지 조건에 걸리면: `git push -u origin "$BR"`만 하고 compare 링크(`https://github.com/padahkim/aws-reps/compare/develop...<BR>`)와 "머지 대기 + 이유"를 보고하며 종료한다.

## 0. 사전 체크 — 하나라도 걸리면 멈추고 사용자에게 보고

1. `git branch --show-current`가 작업 브랜치인가? `develop`/`main`이면 착지할 대상이 없다.
2. 워킹트리가 클린한가? (`git status --porcelain` 빈 출력) 미커밋 변경은 먼저 커밋한다.
3. `git -C "$MAIN" status --porcelain`이 클린한가? 더럽다면 다른 세션이 메인에서 작업 중일 수 있다 — 이어가지 말고 보고.
4. `git -C "$MAIN" branch --show-current`가 `develop`인가? 아니면 즉시 착지의 머지가 **엉뚱한 브랜치로 들어간다** — 멈추고 보고한다. (`$MAIN`을 하드코딩 fallback으로 썼거나, 누가 메인 워크트리를 다른 브랜치로 switch해둔 경우를 잡는 안전장치.)

## A. 즉시 착지

### A-1. develop 동기화

`git -C "$MAIN" fetch origin` 후 develop이 origin/develop보다 behind면 `git -C "$MAIN" merge --ff-only origin/develop`. diverge 상태면 멈추고 보고한다 (다른 PC 작업과 충돌 소지).

### A-2. 머지 → push

```bash
git -C "$MAIN" merge "$BR"        # 단일 커밋이면 ff 허용, 여러 커밋이면 머지 커밋 생성
git -C "$MAIN" push origin develop
```

충돌 시: 기계적으로 자명한 것만 해결하고, 판단이 필요한 충돌은 사용자에게 묻는다.

### A-3. 브랜치 삭제

```bash
git -C "$MAIN" branch -d "$BR"                               # 반드시 메인 쪽에서 실행 (로컬 삭제)
git -C "$MAIN" push origin --delete "$BR" 2>/dev/null || true # origin에 올렸던 브랜치면 원격도 정리
```

- 세션 워크트리 쪽에서 실행하면 그 HEAD 기준 "not fully merged"로 거부된다.
- `$BR`이 현재 세션 워크트리에 체크아웃돼 있으면 삭제가 거부된다 → 먼저 이 워크트리를 원래의 `claude/*` 브랜치로 `git switch`해서 비켜준 뒤 삭제한다.
- 원격 삭제 줄은 `$BR`이 origin에 없으면 (로컬 전용 브랜치였으면) 조용히 넘어간다 — 남은 `feat/*`·`fix/*` 원격 브랜치가 쌓이지 않게 하는 게 목적이다. `--delete`는 force가 아니라 git_guard에 걸리지 않는다.

## B. PR 착지

### B-1. push → PR 생성

```bash
git push -u origin "$BR"
gh pr create --base develop --head "$BR" --title "<conventional-commits 제목>" --body "<요약 + 검증 상태 + PR 착지 사유>"
```

PR URL과 "PR 대기 + 사유"를 사용자에게 보고한다. **여기까지 하면 이 세션의 착지 의무는 충족** — 머지는 승인 후에 한다.

### B-2. 리뷰 반영 (있으면)

사용자가 PR에 코멘트를 남기면 `gh pr view "$BR" --comments`·`gh api`로 읽어 수정을 반영하고 같은 브랜치에 push한다.

### B-3. 승인 후 머지 → 동기화

사용자가 승인하면:

```bash
gh pr merge "$BR" --merge --delete-branch   # 원격 develop에 머지 커밋 + 원격 브랜치 삭제
git -C "$MAIN" fetch origin
git -C "$MAIN" merge --ff-only origin/develop
git -C "$MAIN" branch -d "$BR" 2>/dev/null || true   # gh가 로컬 삭제를 못 했으면 정리
```

- `$BR`이 세션 워크트리에 체크아웃돼 있으면 로컬 삭제가 거부된다 → A-3과 같이 `claude/*` 브랜치로 비켜준 뒤 삭제.

## 하네스 변경 시 — main 전파

착지한 변경에 CLAUDE.md · `.claude/` · `scripts/` 가 포함되면, develop 착지 직후 `develop`→`main` 머지·push까지 한다 (CLAUDE.md Branch strategy 참조 — 새 세션 워크트리가 main에서 분기하므로).

## 보고

develop 최신 해시, 경로(즉시/PR)와 머지 방식(ff/머지커밋), push 결과를 사용자에게 보고한다. PR 착지 대기 상태면 PR URL과 사유를 보고한다.

## 주의

- gh는 git_guard 조건(홈 마커 + 개인 계정 활성)을 충족한 머신에서만 동작한다 — 차단되면 위의 gh-불가 fallback을 따른다. `push --force`·`branch -D`·`reset --hard`·`clean -f`는 어느 머신에서든 git_guard 훅이 차단한다.
- git_guard는 **커밋 메시지 본문의 "gh <단어>" 문자열도 오탐 차단**한다 — 커밋 메시지에 gh를 단독 단어로 쓰지 말 것 ("gh-CLI" 등으로 표기).
- PR 본문 끝에는 `🤖 Generated with [Claude Code](https://claude.com/claude-code)` 를 붙인다.
