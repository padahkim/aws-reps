---
name: land
description: 작업 브랜치를 develop에 안전하게 착지시킨다 (사전 체크 → 머지 → push → 브랜치 삭제). 작업 단위가 끝났을 때, 그리고 세션을 마치기 전에 반드시 호출. CLAUDE.md "착지 필수" 규칙의 실행 절차.
---

# /land — 작업 브랜치를 develop에 착지

목표: 현재 작업 브랜치의 커밋을 `develop`에 머지하고 origin에 push한 뒤 브랜치를 삭제한다. 이 절차가 끝나야 작업이 "착지"된 것이다.

이 리포의 `develop`은 메인 워크트리에 체크아웃돼 있다 (현재 구조). 세션 워크트리에서 develop을 조작할 때는 항상 `git -C`를 쓴다. 아래 명령은 이 변수를 전제한다:

```bash
# develop이 체크아웃된 워크트리를 동적으로 찾는다 (PC마다 경로가 다를 수 있으므로 하드코딩 금지)
MAIN=$(git worktree list --porcelain \
  | awk '/^worktree /{w=$2} /^branch refs\/heads\/develop$/{print w}')
BR=<착지할 작업 브랜치>
```

`MAIN`이 비어 있으면 develop이 어느 워크트리에도 체크아웃돼 있지 않다는 뜻이다 — 멈추고 사용자에게 보고한다 (이 경우 `git -C ""`는 위험하니 절대 이어가지 않는다).

## 0. 사전 체크 — 하나라도 걸리면 멈추고 사용자에게 보고

1. `git branch --show-current`가 작업 브랜치인가? `develop`/`main`이면 착지할 대상이 없다.
2. 워킹트리가 클린한가? (`git status --porcelain` 빈 출력) 미커밋 변경은 먼저 커밋한다.
3. 작업이 검증됐는가? **미검증이거나 사용자 리뷰가 필요하면 머지하지 않는다** — `git push -u origin "$BR"`만 하고 "머지 대기 + 이유"를 보고하며 종료. (이렇게 origin에 올린 브랜치는 나중에 착지할 때 3단계에서 원격까지 정리한다.)
4. `git -C "$MAIN" status --porcelain`이 클린한가? 더럽다면 다른 세션이 메인에서 작업 중일 수 있다 — 이어가지 말고 보고.
5. `git -C "$MAIN" branch --show-current`가 `develop`인가? 아니면 2단계 머지가 **엉뚱한 브랜치로 들어간다** — 멈추고 보고한다. (`$MAIN`을 하드코딩 fallback으로 썼거나, 누가 메인 워크트리를 다른 브랜치로 switch해둔 경우를 잡는 안전장치.)

## 1. develop 동기화

`git -C "$MAIN" fetch origin` 후 develop이 origin/develop보다 behind면 `git -C "$MAIN" merge --ff-only origin/develop`. diverge 상태면 멈추고 보고한다 (다른 PC 작업과 충돌 소지).

## 2. 머지 → push

```bash
git -C "$MAIN" merge "$BR"        # 단일 커밋이면 ff 허용, 여러 커밋이면 머지 커밋 생성
git -C "$MAIN" push origin develop
```

충돌 시: 기계적으로 자명한 것만 해결하고, 판단이 필요한 충돌은 사용자에게 묻는다.

## 3. 브랜치 삭제

```bash
git -C "$MAIN" branch -d "$BR"                               # 반드시 메인 쪽에서 실행 (로컬 삭제)
git -C "$MAIN" push origin --delete "$BR" 2>/dev/null || true # origin에 올렸던 브랜치면 원격도 정리
```

- 세션 워크트리 쪽에서 실행하면 그 HEAD 기준 "not fully merged"로 거부된다.
- `$BR`이 현재 세션 워크트리에 체크아웃돼 있으면 삭제가 거부된다 → 먼저 이 워크트리를 원래의 `claude/*` 브랜치로 `git switch`해서 비켜준 뒤 삭제한다.
- 원격 삭제 줄은 `$BR`이 origin에 없으면 (로컬 전용 브랜치였으면) 조용히 넘어간다 — 남은 `feat/*`·`fix/*` 원격 브랜치가 쌓이지 않게 하는 게 목적이다. `--delete`는 force가 아니라 git_guard에 걸리지 않는다.

## 4. 보고

develop 최신 해시, 머지 방식(ff/머지커밋), push 결과를 사용자에게 보고한다.

## 주의

- gh CLI 금지, plain git만 사용. `push --force`·`branch -D`·`reset --hard`·`clean -f`는 git_guard 훅이 차단한다.
- git_guard는 **커밋 메시지 본문의 "gh <단어>" 문자열도 오탐 차단**한다 — 커밋 메시지에 gh를 단독 단어로 쓰지 말 것 ("gh-CLI" 등으로 표기).
