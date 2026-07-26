---
name: land
description: 작업 브랜치를 develop에 착지시킨다 — 기본은 PR 착지(표준 본문으로 PR 생성 → 사용자 승인 후 머지), 즉시 착지는 사용자가 명시적으로 지시한 경우만. 작업 단위가 끝났을 때, 그리고 세션을 마치기 전에 반드시 호출. CLAUDE.md "착지 필수" 규칙의 실행 절차.
---

# /land — 작업 브랜치를 develop에 착지

목표: 현재 작업 브랜치의 커밋을 `develop`에 도달시킨다. 경로는 두 가지 — 기본인 **PR 착지**(PR 생성 후 사용자 승인 대기) 또는 예외인 **즉시 착지**(직접 머지·push). 둘 중 하나가 끝나야(PR 착지는 "PR 보고"까지 하면) 착지 의무가 충족된 것이다.

## 착지 모드 판별 — 둘 다 정상 경로

이 리포는 두 가지 형태로 작업된다. **어느 쪽도 이상 상황이 아니다** — 모드를 판별해 해당 경로를 그대로 따르고, 우회 판단을 하지 않는다 (#62).

- **워크트리 모드** — 세션 워크트리에서 작업하고 `develop`은 메인 워크트리에 체크아웃돼 있다. develop 조작은 전부 `git -C "$MAIN"`.
- **단일 워크트리 모드** — 메인 워크트리에서 `git switch -c feat/<주제> develop`으로 작업한다. develop이 어느 워크트리에도 체크아웃돼 있지 않으므로 `MAIN`이 빈 값이 되는 것이 **정상**이다.

```bash
BR=<착지할 작업 브랜치>

# develop이 체크아웃된 워크트리를 동적으로 찾는다 (PC마다 경로가 다를 수 있으므로 하드코딩 금지)
MAIN=$(git worktree list --porcelain \
  | awk '/^worktree /{w=$2} /^branch refs\/heads\/develop$/{print w}')

if [ -n "$MAIN" ]; then
  MODE=worktree
elif git show-ref --verify --quiet refs/heads/develop \
  && [ "$(git rev-parse --path-format=absolute --git-dir)" \
     = "$(git rev-parse --path-format=absolute --git-common-dir)" ]; then
  # develop 브랜치는 있고, 지금이 주 워크트리다 → 단일 워크트리 모드
  # --path-format=absolute 필수: 하위 디렉토리에서 실행하면 --git-dir은 절대경로,
  # --git-common-dir은 상대경로(../.git)로 나와 비교가 헛돈다 (#63 Codex 리뷰)
  MODE=single
  MAIN=$(git rev-parse --show-toplevel)   # 아래 git -C "$MAIN" 이 그대로 성립하게
else
  MODE=abort
fi
```

- `MODE=single`이면 **develop을 조작하기 직전에 이 워크트리에서 `git switch develop`을 한 번 한다** (A-1·B-3에 명시). 그 뒤로는 아래의 모든 `git -C "$MAIN"` 명령이 같은 워크트리를 가리키므로 그대로 쓴다.
- `MODE=abort`이면 진짜 이상 상황이다 — develop 브랜치 자체가 없거나(리포가 예상과 다름), 세션 워크트리에 있는데 메인 워크트리가 develop이 아닌 다른 브랜치로 옮겨져 있다. 멈추고 사용자에게 보고한다 (`git -C ""`는 위험하니 절대 이어가지 않는다).

## 경로 선택 — 기본은 PR 착지

**모든 작업 단위(이슈)는 PR 착지가 기본이다** (2026-07-21 정책, #48 — 사용자가 머지 전에 PR로 내용을 한 번 확인한다). 검증을 마쳤어도, 변경이 작아도 PR을 만든다.

**즉시 착지(A)는 다음 경우에만**:

1. 사용자가 이 세션에서 **명시적으로 즉시 머지를 지시**했다 ("바로 머지해", "PR 없이 착지해").
2. 오탈자·한두 줄 수준의 단일 커밋 (CLAUDE.md 예외 — 이 경우 브랜치 없이 develop 직접 커밋도 허용).

gh를 쓸 수 없는 머신(git_guard가 차단 — 회사 머신 등)에서 PR 착지 조건에 걸리면: `git push -u origin "$BR"`만 하고 compare 링크(`https://github.com/padahkim/aws-reps/compare/develop...<BR>`)와 "머지 대기 + 이유"를 보고하며 종료한다.

## 0. 사전 체크 — 하나라도 걸리면 멈추고 사용자에게 보고

1. `git branch --show-current`가 작업 브랜치인가? `develop`/`main`이면 착지할 대상이 없다.
2. 워킹트리가 클린한가? (`git status --porcelain` 빈 출력) 미커밋 변경은 먼저 커밋한다.
3. **워크트리 모드만** — `git -C "$MAIN" status --porcelain`이 클린한가? 더럽다면 다른 세션이 메인에서 작업 중일 수 있다 — 이어가지 말고 보고. (단일 워크트리 모드에서는 `$MAIN`이 현재 워크트리라 2번과 같은 검사다 — 생략한다.)
4. 머지가 **엉뚱한 브랜치로 들어가지 않음**을 보장한다 — 모드별로 확인 지점이 다르다.
   - 워크트리 모드: `git -C "$MAIN" branch --show-current`가 `develop`인가? 아니면 멈추고 보고한다. (`$MAIN`을 하드코딩 fallback으로 썼거나, 누가 메인 워크트리를 다른 브랜치로 switch해둔 경우를 잡는 안전장치.)
   - 단일 워크트리 모드: 지금 이 자리에 작업 브랜치가 있는 것이 정상이므로 여기서는 검사하지 않는다. 대신 A-1/B-3의 `git switch develop` **직후** `git branch --show-current`가 `develop`인지 확인하고, 아니면 멈추고 보고한다.

## A. 즉시 착지

### A-1. develop 동기화

단일 워크트리 모드면 **먼저** 이 워크트리를 develop으로 옮기고 확인한다 (사전 체크 4의 단일 모드 확인 지점):

```bash
git switch develop
[ "$(git branch --show-current)" = "develop" ] || exit 1   # 아니면 멈추고 보고
```

이후 두 모드 공통: `git -C "$MAIN" fetch origin` 후 develop이 origin/develop보다 behind면 `git -C "$MAIN" merge --ff-only origin/develop`. diverge 상태면 멈추고 보고한다 (다른 PC 작업과 충돌 소지).

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
- `$BR`이 현재 세션 워크트리에 체크아웃돼 있으면 삭제가 거부된다 → 먼저 이 워크트리를 원래의 `claude/*` 브랜치로 `git switch`해서 비켜준 뒤 삭제한다. (단일 워크트리 모드는 A-1에서 이미 develop으로 옮겼으므로 그냥 삭제된다.)
- 원격 삭제 줄은 `$BR`이 origin에 없으면 (로컬 전용 브랜치였으면) 조용히 넘어간다 — 남은 `feat/*`·`fix/*` 원격 브랜치가 쌓이지 않게 하는 게 목적이다. `--delete`는 force가 아니라 git_guard에 걸리지 않는다.

## B. PR 착지

### B-1. push → PR 생성

```bash
git push -u origin "$BR"
gh pr create --base develop --head "$BR" --title "<conventional-commits 제목>" --body "<아래 'PR 본문 표준'을 따른 본문>"
```

프리뷰 URL은 PR을 만든 **뒤** Vercel 봇 코멘트로 달린다. 리뷰 가이드가 필요한 PR이면 PR 생성 직후 URL을 얻어 본문을 채운다 (봇 코멘트까지 1분 남짓 걸릴 수 있다 — 비면 잠시 뒤 다시 조회):

```bash
gh pr view "$BR" --json comments \
  --jq '.comments[] | select(.author.login=="vercel") | .body' \
  | grep -oE 'https://aws-reps-git-[a-z0-9-]+\.vercel\.app' | head -1
# 얻은 URL로 리뷰 가이드 절을 채워 본문 갱신
gh pr edit "$BR" --body-file <파일>
```

PR URL과 "PR 대기"를 사용자에게 보고한다. **여기까지 하면 이 세션의 착지 의무는 충족** — 머지는 승인 후에 한다. 승인을 기다리는 동안 손을 놓지 말고 **B-2(자동 리뷰 확보)를 이어서 진행한다** — 리뷰는 승인과 무관하게 확보해야 하고, 먼저 돌려두면 승인이 떨어졌을 때 바로 머지할 수 있다.

#### PR 본문 표준

근거: Google eng-practices "Writing good CL descriptions" + GitHub "How to write the perfect pull request". 목표는 **diff를 안 열어도 무엇이 왜 바뀌는지 알고, diff를 열면 어디를 봐야 하는지 아는 본문**이다.

- **제목**: conventional-commits + 명령형 완결문. 제목만 읽고 히스토리를 훑을 수 있어야 한다. "Fix bug"·"작업 반영"류 무정보 제목 금지.
- **본문 5부**:
  1. **무엇을·왜** — 2~4문장. 맥락을 모르는 독자 전제 (코드는 what을 보여주지만 why는 못 보여준다). 관련 이슈 `closes #N`과 배경 링크.
  2. **주요 변경** — 중요한 것만. diff 재나열·파일 목록 나열 금지. 리뷰어가 diff에서 **봐야 할 지점**과 선택한 접근·한계를 쓴다.
  3. **검증** — 실제로 실행한 것과 그 결과만 (`npm run validate`·빌드·프리뷰 URL·스크린샷). 안 한 검증을 한 것처럼 쓰지 않는다. 미검증이면 "미검증 — <이유>"라고 명시.
  4. **리뷰 가이드** — 아래 "리뷰 가이드 작성" 참조. 화면에 보이는 변경이 있으면 필수.
  5. **리뷰 포인트** — 판단이 필요했던 지점, 확신 없는 부분을 명시적 질문으로. 리뷰 가이드에 쓴 화면 판정은 여기서 반복하지 않는다 — 여기는 화면 밖(접근·설계·범위) 판단이다. 없으면 섹션 생략 (형식적으로 채우지 않는다).
- 끝에 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

#### 리뷰 가이드 작성

PR 본문만으로는 "화면에서 어딜 봐야 하는지"를 알 수 없어 리뷰어가 diff를 일일이 읽고 되묻는 낭비가 났다 (#118 전례 → #119). 리뷰어가 **프리뷰를 열어 판정을 내리기까지의 경로**를 본문이 깔아준다. 세 가지를 쓴다:

1. **딥링크** — 변경이 보이는 페이지의 Vercel 브랜치 프리뷰 URL. 챕터·섹션 단위까지 (루트 URL만 던지지 않는다).
2. **조작할 것·볼 것** — 그 페이지에서 무엇을 눌러야 변경이 드러나는지(탭 전환·토글 열기 등)와 화면의 어디가 바뀐 곳인지.
3. **판정 기준** — 리뷰어가 내려야 할 판단을 한 문장으로. 판단이 갈릴 수 있는 항목은 그 자리에 표시한다 ("판단 갈릴 수 있음 — 이견 환영").

- 변경 지점이 여럿이면 표로 정리한다 (위치 링크 | 무엇이 바뀜/사라짐 | 그렇게 한 이유). 전수 나열이 과하면 **품질 스펙트럼의 양 끝**(가장 잘 된 것·가장 애매한 것)을 표본으로 지목한다.
- **적용 범위**: 화면에 보이는 변경(콘텐츠·UI)이 있는 PR은 **필수**. 프리뷰에 나타나지 않는 변경만 있는 PR(하네스·스크립트·문서)은 해당 시만 쓰고, 아니면 섹션째 생략한다 — 형식적 빈 섹션 금지 ("리뷰 포인트" 생략 규칙과 같은 원칙).
- 권장 형식 실례: [PR #118 리뷰 가이드](https://github.com/padahkim/aws-reps/pull/118#issuecomment-5082952802).

### B-2. 자동 리뷰 확보 → 반영

**리뷰를 확보하기 전에는 머지하지 않는다** (2026-07-26 정책, #124 — PR #121이 생성 3분 만에 승인·머지돼 리뷰가 main 전파 뒤에야 돌아간 사고). 적용 범위는 **모든 PR** — 문서·하네스 전용도 예외 없다. 판단 여지를 두면 "이건 문서니까"로 매번 새어나간다.

**1) PR 생성 직후 바로 트리거한다.** 이 리포에서 **자동 발동은 신뢰할 수 없다** — 아무것도 안 오거나(PR #121), 리뷰 대신 `To use Codex here, create an environment for this repo` 오류 코멘트만 온다(PR #125). 자동 발동을 기다리는 시간이 그대로 낭비이므로 기다리지 말고 먼저 남긴다. 중복 리뷰는 문제되지 않는다.

```bash
PR=<PR 번호>
SINCE=$(date -u +%Y-%m-%dT%H:%M:%SZ)   # 라운드 경계 — 이 시각 이후의 신호만 이번 라운드 것
gh pr comment "$PR" --body "@codex review"
```

**2) 도착 확인 — 이번 라운드 신호만 본다.** 누적 집계는 두 방향으로 다 틀린다 (PR #125 Codex 지적): 이전 라운드의 👍가 새 라운드를 클린으로 보이게 하고, 반대로 **이미 고친 인라인 지적이 계속 카운트돼 클린 판정이 영영 안 나온다**(= 끝나지 않는 루프). 그래서 `$SINCE`로 라운드를 가른다.

`gh api --jq`는 jq의 `--arg`·`--argjson`을 받지 않는다 — 파이프로 넘긴다.

```bash
CX='["chatgpt-codex-connector","chatgpt-codex-connector[bot]"]'   # 정확 일치 2종

# 요약 코멘트 — 이번 라운드 것만. 환경 미설정 오류 코멘트는 리뷰가 아니므로 걸러낸다
gh api repos/padahkim/aws-reps/issues/"$PR"/comments \
  | jq --argjson cx "$CX" --arg since "$SINCE" \
    '[.[] | select((.user.login|IN($cx[])) and .created_at > $since
                   and (.body|test("create an environment")|not)) | .body]'
# 인라인 리뷰 코멘트 건수 — 이번 라운드 것만
gh api repos/padahkim/aws-reps/pulls/"$PR"/comments \
  | jq --argjson cx "$CX" --arg since "$SINCE" \
    '[.[] | select((.user.login|IN($cx[])) and .created_at > $since)] | length'
# PR 본문 리액션 — Codex 것만 (리액션에서는 계정명이 chatgpt-codex-connector[bot])
gh api repos/padahkim/aws-reps/issues/"$PR"/reactions \
  | jq --argjson cx "$CX" '[.[] | select(.user.login|IN($cx[])) | .content]'
```

**라운드 경계는 `created_at`으로 잡는다 — `commit_id`로는 안 된다.** GitHub은 아직 유효한 리뷰 코멘트의 `commit_id`를 새 head로 갱신하므로, 이미 고친 이전 라운드 지적이 현재 head 것으로 딸려온다 (PR #125 실측: Codex 인라인 5건 중 `commit_id == head`가 4건 — 1라운드 지적 하나가 섞여 들어왔다). `created_at`은 1라운드 `11:05:29` / 2라운드 `11:12:11`로 깨끗하게 갈렸다.

- **계정은 정확 일치로 본다.** `startswith`는 공개 PR에서 `chatgpt-codex-connector-fake` 같은 사칭 계정도 통과시킨다 — 그 계정이 👍 하나만 달면 클린 경로가 뚫린다 (PR #125 Codex 지적). 사람·다른 봇이 남긴 인라인 코멘트는 아래 "사용자 코멘트" 경로에서 따로 처리한다.
- **리액션은 두 종류를 구분한다.** `+1`(👍)은 "지적 없음"이라는 **판정**, `eyes`(👀)는 "트리거를 접수하고 작업 중"이라는 **진행 신호**다. 👀을 클린으로 오인하면 리뷰가 끝나기도 전에 머지한다 — 이 게이트가 막으려는 바로 그 사고다. 👀만 있으면 계속 기다린다. (리액션에는 시각 경계를 걸 수 없으므로, 직전 라운드에서 👍를 이미 받았다면 리액션은 판정에서 빼고 코멘트 신호로만 판단한다.)

**3) 상한 10분.** 그래도 판정이 없으면 "**Codex 리뷰 미도착**"을 사용자에게 명시하고 **재시도할지 / 더 기다릴지**를 묻는다. 조용히 머지하지 않는다.

**판정과 분기**:

- **클린** (이번 라운드 인라인 0건 **그리고** 요약에 지적 없음 — 👍 리액션만 온 경우 포함) → 사용자 승인이 이미 있으면 **다시 묻지 않고 B-3으로 진행**한다. 보고에 "Codex 리뷰 지적 0건"을 적는다. 이 게이트의 목적은 리뷰를 확보하는 것이지 승인을 두 번 받는 것이 아니다.
- **지적 있음** → 수정을 반영해 같은 브랜치에 push하고, **인라인 코멘트는 건별로 반드시 답글을 남긴다** (2026-07-22 지시, #80 전례) — 반영이면 반영 커밋 해시와 요지, 거부(반영 부적절 판단)면 거부 사유. 어느 쪽이든 무응답으로 넘기지 않는다. 답글: `gh api repos/padahkim/aws-reps/pulls/<PR>/comments/<comment_id>/replies -f body="..."`.
- **애매하면** (요약이 지적인지 단순 소감인지 불분명) 클린으로 치지 말고 사용자에게 보고한다.

**push할 때마다 이 절을 처음부터 다시 돈다** (1→2→3→판정) — 사용자 코멘트로 인한 push도 포함. 리뷰는 특정 커밋에 대한 것이라, 지적을 반영해 push한 뒤 그대로 B-3으로 가면 **정작 머지되는 최종 코드는 리뷰를 한 번도 안 거친 상태**가 된다 (PR #125 Codex 지적).

**단, 라운드 상한은 2회다** (2026-07-26 결정, #124). 라운드마다 새 지적이 나올 수 있어서(PR #125 실측: 1라운드 2건 → 2라운드 3건) 상한이 없으면 원리적으로 안 끝난다. 2라운드에도 새 지적이 남으면 **거기서 멈추고 남은 지적을 요약해 사용자에게 보고**한다 — 계속 반영할지, 거부하고 머지할지, 보류할지는 사용자가 정한다. 세션이 판단을 이어받지 않는다.

사용자가 PR에 직접 남긴 코멘트도 같은 자리에서 처리한다 — `gh pr view "$BR" --comments`로 읽어 반영하고 같은 브랜치에 push한다 (이 push 역시 위 재확인 대상이다).

### B-3. 승인 후 머지 → 동기화

**전제: B-2의 리뷰 확보가 끝났다.** 사용자 승인이 이미 있어도 리뷰가 없으면 "리뷰 대기 중"을 보고하고 여기서 멈춘다.

**우회는 사용자의 명시 지시로만** (2026-07-26 결정, #124). B-2가 타임아웃(10분)이나 라운드 상한(2회)으로 끝났을 때, 사용자가 "리뷰 없이 머지해"·"남은 지적 거부하고 머지해"라고 **명시**하면 그때만 진행한다 — Codex 장애가 착지를 영구히 막지 않게 하는 탈출구다. 그 경우 보고에 **"리뷰 미확보 머지"** 또는 **"미반영 지적 n건 남긴 채 머지"**를 반드시 적는다. 승인 독려("쭉 해줘")는 우회 지시가 아니다.

사용자가 승인하면 (B-2가 클린으로 끝났다면 재승인 없이 그대로):

```bash
gh pr merge "$BR" --merge --delete-branch   # 원격 develop에 머지 커밋 + 원격 브랜치 삭제

# 단일 워크트리 모드면 먼저 이 워크트리를 develop으로 옮긴다 (사전 체크 4의 단일 모드 확인 지점)
git switch develop
[ "$(git branch --show-current)" = "develop" ] || exit 1   # 아니면 멈추고 보고

git -C "$MAIN" fetch origin
git -C "$MAIN" merge --ff-only origin/develop
git -C "$MAIN" branch -d "$BR" 2>/dev/null || true   # gh가 로컬 삭제를 못 했으면 정리
```

- `$BR`이 세션 워크트리에 체크아웃돼 있으면 로컬 삭제가 거부된다 → A-3과 같이 `claude/*` 브랜치로 비켜준 뒤 삭제. (단일 워크트리 모드는 위의 `git switch develop`으로 이미 비켜난 상태다.)

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

## 잔재 정리 — 착지 완료 시 (A-3·B-3 직후)

A-3·B-3의 브랜치 삭제는 방금 착지한 브랜치만 다룬다. 여기서는 **과거 세션이 남긴 잔재**를 함께 쓸어낸다 (2026-07-22 도입 — 머지 완료된 로컬 브랜치 27개·워크트리 5개가 방치돼 있던 사고의 재발 방지). PR 착지 대기(B-1까지) 상태에서는 하지 않는다.

```bash
# 1) develop에 이미 머지된 로컬 브랜치 일괄 삭제
#    (develop/main 제외, 워크트리에 체크아웃된 브랜치는 "+" 표시라 자동 제외, -d라 미머지는 어차피 거부됨)
git branch --merged develop | grep -vE '^[+*]|develop$|main' | xargs -n1 git branch -d 2>/dev/null || true

# 2) 앱 자동 생성 워크트리(.claude/worktrees/*) 중 착지가 끝난 것 제거
#    안전 조건: 현재 세션 워크트리가 아니고 + 클린하고 + HEAD가 이미 develop에 포함된 것만
SELF=$(git rev-parse --show-toplevel)
for W in "$MAIN"/.claude/worktrees/*/; do
  [ -d "$W" ] || continue
  W=${W%/}
  [ "$W" = "$SELF" ] && continue                              # 자기 자신은 건드리지 않는다
  [ -n "$(git -C "$W" status --porcelain)" ] && continue      # 더러우면 다른 세션 진행 중일 수 있다 — 건너뛰고 보고
  git merge-base --is-ancestor "$(git -C "$W" rev-parse HEAD)" develop \
    && git worktree remove "$W"
done
git worktree prune
```

- 더러워서 건너뛴 워크트리가 있으면 보고에 명시한다 — 사용자가 병렬 세션 여부를 판단한다.
- `eval/*` 등 `.claude/worktrees/` 밖의 수동 워크트리는 이 정리 대상이 아니다 — 사용자가 직접 관리한다.
- 현재 세션이 앱 자동 생성 워크트리 안이라면 자기 워크트리는 남는다 — 세션 종료 후 다음 착지 세션의 이 단계가 치운다.

## 하네스 변경 시 — main 전파

착지한 변경에 CLAUDE.md · `.claude/` · `scripts/` 가 포함되면, develop 착지 직후 `develop`→`main` 머지·push까지 한다 (CLAUDE.md Branch strategy 참조 — 새 세션 워크트리가 main에서 분기하므로).

## 보고

develop 최신 해시, 경로(즉시/PR)와 머지 방식(ff/머지커밋), push 결과, **Codex 리뷰 결과**(지적 0건 / 반영 n건 / 미도착), 보드 갱신 결과(또는 "보드 미갱신"), 이슈 체크박스 갱신 결과(미달성 항목 포함, 또는 "체크박스 미갱신"), 잔재 정리 결과(삭제한 브랜치·워크트리 수, 더러워서 건너뛴 워크트리)를 사용자에게 보고한다. PR 착지 대기 상태면 PR URL과 사유를 보고한다.

## 주의

- gh는 git_guard 조건(홈 마커 + 개인 계정 활성)을 충족한 머신에서만 동작한다 — 차단되면 위의 gh-불가 fallback을 따른다. `push --force`·`branch -D`·`reset --hard`·`clean -f`는 어느 머신에서든 git_guard 훅이 차단한다.
- git_guard는 **커밋 메시지 본문의 "gh <단어>" 문자열도 오탐 차단**한다 — 커밋 메시지에 gh를 단독 단어로 쓰지 말 것 ("gh-CLI" 등으로 표기).
