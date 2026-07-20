---
name: land
description: 작업 브랜치를 develop에 착지시킨다 — 기본은 PR 착지(표준 본문으로 PR 생성 → 사용자 승인 후 머지), 즉시 착지는 사용자가 명시적으로 지시한 경우만. 작업 단위가 끝났을 때, 그리고 세션을 마치기 전에 반드시 호출. CLAUDE.md "착지 필수" 규칙의 실행 절차.
---

# /land — 작업 브랜치를 develop에 착지

목표: 현재 작업 브랜치의 커밋을 `develop`에 도달시킨다. 경로는 두 가지 — 기본인 **PR 착지**(PR 생성 후 사용자 승인 대기) 또는 예외인 **즉시 착지**(직접 머지·push). 둘 중 하나가 끝나야(PR 착지는 "PR 보고"까지 하면) 착지 의무가 충족된 것이다.

이 리포의 `develop`은 메인 워크트리에 체크아웃돼 있다 (현재 구조). 세션 워크트리에서 develop을 조작할 때는 항상 `git -C`를 쓴다. 아래 명령은 이 변수를 전제한다:

```bash
# develop이 체크아웃된 워크트리를 동적으로 찾는다 (PC마다 경로가 다를 수 있으므로 하드코딩 금지)
MAIN=$(git worktree list --porcelain \
  | awk '/^worktree /{w=$2} /^branch refs\/heads\/develop$/{print w}')
BR=<착지할 작업 브랜치>
```

`MAIN`이 비어 있으면 develop이 어느 워크트리에도 체크아웃돼 있지 않다는 뜻이다 — 멈추고 사용자에게 보고한다 (이 경우 `git -C ""`는 위험하니 절대 이어가지 않는다).

## 경로 선택 — 기본은 PR 착지

**모든 작업 단위(이슈)는 PR 착지가 기본이다** (2026-07-21 정책, #48 — 사용자가 머지 전에 PR로 내용을 한 번 확인한다). 검증을 마쳤어도, 변경이 작아도 PR을 만든다.

**즉시 착지(A)는 다음 경우에만**:

1. 사용자가 이 세션에서 **명시적으로 즉시 머지를 지시**했다 ("바로 머지해", "PR 없이 착지해").
2. 오탈자·한두 줄 수준의 단일 커밋 (CLAUDE.md 예외 — 이 경우 브랜치 없이 develop 직접 커밋도 허용).

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
gh pr create --base develop --head "$BR" --title "<conventional-commits 제목>" --body "<아래 'PR 본문 표준'을 따른 본문>"
```

PR URL과 "PR 대기"를 사용자에게 보고한다. **여기까지 하면 이 세션의 착지 의무는 충족** — 머지는 승인 후에 한다.

#### PR 본문 표준

근거: Google eng-practices "Writing good CL descriptions" + GitHub "How to write the perfect pull request". 목표는 **diff를 안 열어도 무엇이 왜 바뀌는지 알고, diff를 열면 어디를 봐야 하는지 아는 본문**이다.

- **제목**: conventional-commits + 명령형 완결문. 제목만 읽고 히스토리를 훑을 수 있어야 한다. "Fix bug"·"작업 반영"류 무정보 제목 금지.
- **본문 4부**:
  1. **무엇을·왜** — 2~4문장. 맥락을 모르는 독자 전제 (코드는 what을 보여주지만 why는 못 보여준다). 관련 이슈 `closes #N`과 배경 링크.
  2. **주요 변경** — 중요한 것만. diff 재나열·파일 목록 나열 금지. 리뷰어가 diff에서 **봐야 할 지점**과 선택한 접근·한계를 쓴다.
  3. **검증** — 실제로 실행한 것과 그 결과만 (`npm run validate`·빌드·프리뷰 URL·스크린샷). 안 한 검증을 한 것처럼 쓰지 않는다. 미검증이면 "미검증 — <이유>"라고 명시.
  4. **리뷰 포인트** — 판단이 필요했던 지점, 확신 없는 부분을 명시적 질문으로. 없으면 섹션 생략 (형식적으로 채우지 않는다).
- 끝에 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

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

## 보드 갱신

착지 결과를 Projects 보드 "aws-reps 로드맵"(프로젝트 #1)에 반영한다 — CLAUDE.md Task management의 보드 규칙의 실행 지점이 여기다.

- **즉시 착지 완료 / PR 머지 완료(B-3)** → 해당 이슈를 `Done`으로.
- **PR 착지 대기(B-1까지)** → `In Progress` 유지.

```bash
N=<이슈 번호>; TARGET=Done   # 또는 "In Progress"
PJ=$(gh project view 1 --owner "@me" --format json | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])')
IT=$(gh project item-list 1 --owner "@me" --limit 50 --format json | python3 -c "import json,sys;print(next((i['id'] for i in json.load(sys.stdin)['items'] if i['content'].get('number')==$N),''))")
[ -n "$IT" ] || IT=$(gh project item-add 1 --owner "@me" --url "https://github.com/padahkim/aws-reps/issues/$N" --format json | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])')
FD=$(gh project field-list 1 --owner "@me" --format json | python3 -c "import json,sys;f=next(x for x in json.load(sys.stdin)['fields'] if x['name']=='Status');import os;print(f['id'],next(o['id'] for o in f['options'] if o['name']=='$TARGET'))")
gh project item-edit --id "$IT" --project-id "$PJ" --field-id "${FD% *}" --single-select-option-id "${FD#* }"
```

- 순서 주의: **추가가 먼저, 상태 설정이 나중** — 보드에 없는 이슈를 상태부터 설정하려 하면 조회가 빈 값으로 끝나 상태가 기본값으로 남는다. 위 스크립트는 조회 실패 시 item-add로 추가한 뒤 그 item ID로 상태를 설정한다.
- item-add로 새로 추가한 이슈는 **Phase 필드도 설정**한다 (CLAUDE.md Task management의 보드 규칙 — Milestones 대신 Phase 필드).
- gh 차단 머신에서는 생략하고 보고에 "보드 미갱신"을 명시한다 — 다음 gh 가능 세션 시작 시 동기화한다.

## 이슈 close-out — 체크박스 갱신 (생략 불가)

착지가 완료되는 시점(즉시 착지 A-2 이후, PR 머지 B-3 이후)에 **`closes #N`으로 닫히는 이슈의 완료 기준 체크박스를 갱신한다**. 자동 닫힘은 이슈 본문을 거치지 않으므로, 이 단계를 건너뛰면 이슈가 빈 체크박스인 채 닫힌다 (#41·#43 사고 — 닫힌 이슈에서 "실제로 다 했는가"를 판별할 수 없게 된다).

- **실제 달성한 항목만** `[x]`로 바꾼다 — 착지했다고 일괄 체크 금지.
- 미달성 항목은 빈 채로 두고 보고에 명시한다. 미달성분이 실작업이면 /write-issue로 파생 이슈를 만들어 본문에 `#N`으로 남긴다.

```bash
N=<이슈 번호>
gh issue view "$N" --json body -q .body > /tmp/issue-$N.md
# 달성 항목의 "- [ ]"를 "- [x]"로 편집한 뒤:
gh issue edit "$N" --body-file /tmp/issue-$N.md
```

- PR 착지 대기(B-1까지) 상태에서는 하지 않는다 — 머지가 승인된 뒤(B-3)가 갱신 시점이다.
- gh 차단 머신에서는 생략하되 보고에 "**체크박스 미갱신 — 웹에서 체크 필요**"와 달성 항목 목록을 명시한다.

## 하네스 변경 시 — main 전파

착지한 변경에 CLAUDE.md · `.claude/` · `scripts/` 가 포함되면, develop 착지 직후 `develop`→`main` 머지·push까지 한다 (CLAUDE.md Branch strategy 참조 — 새 세션 워크트리가 main에서 분기하므로).

## 보고

develop 최신 해시, 경로(즉시/PR)와 머지 방식(ff/머지커밋), push 결과, 보드 갱신 결과(또는 "보드 미갱신"), 이슈 체크박스 갱신 결과(미달성 항목 포함, 또는 "체크박스 미갱신")를 사용자에게 보고한다. PR 착지 대기 상태면 PR URL과 사유를 보고한다.

## 주의

- gh는 git_guard 조건(홈 마커 + 개인 계정 활성)을 충족한 머신에서만 동작한다 — 차단되면 위의 gh-불가 fallback을 따른다. `push --force`·`branch -D`·`reset --hard`·`clean -f`는 어느 머신에서든 git_guard 훅이 차단한다.
- git_guard는 **커밋 메시지 본문의 "gh <단어>" 문자열도 오탐 차단**한다 — 커밋 메시지에 gh를 단독 단어로 쓰지 말 것 ("gh-CLI" 등으로 표기).
