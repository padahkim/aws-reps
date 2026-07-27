---
name: land
description: 작업 브랜치를 develop에 착지시킨다 — 기본은 PR 착지(표준 본문으로 PR 생성 → 사용자 승인 후 머지), 즉시 착지는 사용자가 명시적으로 지시한 경우만. 작업 단위가 끝났을 때, 그리고 세션을 마치기 전에 반드시 호출. CLAUDE.md "착지 필수" 규칙의 실행 절차.
---

# /land — 작업 브랜치를 develop에 착지

목표: 현재 작업 브랜치의 커밋을 `develop`에 도달시킨다. 경로는 두 가지 — 기본인 **PR 착지**(PR 생성 후 사용자 승인 대기) 또는 예외인 **즉시 착지**(직접 머지·push). 둘 중 하나가 끝나야(PR 착지는 "PR 보고"까지 하면) 착지 의무가 충족된 것이다.

## 착지 모드 판별 — 둘 다 정상 경로

이 리포는 여러 워크트리로 작업된다. **어느 쪽도 이상 상황이 아니다** — 모드를 판별해 해당 경로를 그대로 따르고, 우회 판단을 하지 않는다 (#62).

판별의 축은 **"`develop`을 지금 누가 들고 있는가" 하나뿐이다** (2026-07-27, #131). 예전에는 "내가 주 워크트리인가"도 함께 봐서, CLAUDE.md가 권장하는 **상설 워크트리 병렬 작업**(`../aws-reps-wt`에서 작업 + `--detach` 파킹)을 이상 상황으로 오판했다 — 그 규약을 지키면 develop이 어느 워크트리에도 체크아웃되지 않는데, 그게 곧 `MODE=abort` 조건이었다.

- **위임 모드** — `develop`이 어느 워크트리에 체크아웃돼 있다. develop 조작은 전부 `git -C "$MAIN"`으로 그 워크트리에 맡긴다.
- **직접 모드** — `develop`을 든 워크트리가 없다. **지금 워크트리가 직접** `git switch develop`으로 잡아 다룬다. 메인 워크트리에서 `git switch -c feat/<주제> develop`으로 작업한 경우도, 상설 워크트리에서 작업하고 develop이 놀고 있는 경우도 여기다.

```bash
BR=<착지할 작업 브랜치>

# develop이 체크아웃된 워크트리를 동적으로 찾는다 (PC마다 경로가 다를 수 있으므로 하드코딩 금지)
MAIN=$(git worktree list --porcelain \
  | awk '/^worktree /{w=$2} /^branch refs\/heads\/develop$/{print w}')

if [ -n "$MAIN" ]; then
  MODE=delegate
elif git show-ref --verify --quiet refs/heads/develop; then
  MODE=direct
  MAIN=$(git rev-parse --show-toplevel)   # 아래 git -C "$MAIN" 이 그대로 성립하게
else
  MODE=abort                              # develop 브랜치 자체가 없다 = 리포가 예상과 다르다
fi
```

- `MODE=direct`이면 **develop을 조작하기 직전에 이 워크트리에서 `git switch develop`을 한 번 한다** (A-1·B-3에 명시). 그 뒤로는 아래의 모든 `git -C "$MAIN"` 명령이 같은 워크트리를 가리키므로 그대로 쓴다.
- **남의 워크트리를 건드리지 않는다는 보장은 git 자신이 준다** — develop이 다른 워크트리에 있으면 `git switch develop`은 `fatal: 'develop' is already used by worktree at …`로 **거부한다**. 즉 직접 모드가 성립했다는 것 자체가 "지금 아무도 develop을 안 쓴다"의 증거이고, 이 모드는 다른 워크트리 경로를 아예 만지지 않는다. 예전 abort가 지키려던 안전성(남의 작업 브랜치 불가침)은 이 성질로 그대로 유지된다.
- **직접 모드 착지 후 파킹** (A-3·B-3 직후): 여기가 연결 워크트리(상설 `../aws-reps-wt`, 앱 자동 생성 워크트리)면 `git switch --detach develop`으로 되돌린다 — CLAUDE.md Branch strategy의 파킹 규약이자, 다음 세션이 develop을 자유롭게 잡도록 비워 두는 일이다. 주 워크트리면 develop에 그대로 둔다.
- **파킹이 다른 세션의 `$MAIN`을 흔들 수 있다** (PR #146 Codex P1). 이 워크트리가 develop을 든 동안 다른 세션이 여기를 `$MAIN`으로 잡을 수 있고, 그 세션이 머지하기 전에 우리가 파킹하면 그쪽 머지가 detached HEAD로 샌다. "delegate가 붙어 있는 동안 파킹하지 않기"는 **누가 나를 `$MAIN`으로 잡았는지 알 수 없어서** 성립하지 않으므로, 방어는 파킹하는 쪽이 아니라 **머지하는 쪽**에 둔다 — A-2의 머지 직전 재확인 + 결과 검산, A-3의 삭제 전 관문(각 절 참조). 그래서 이 사고는 데이터 손실이 아니라 **멈춤**으로 끝난다.

```bash
# 주 워크트리면 --git-dir 과 --git-common-dir 이 같다 → 파킹 불필요
# --path-format=absolute 필수: 하위 디렉토리에서 실행하면 --git-dir은 절대경로,
# --git-common-dir은 상대경로(../.git)로 나와 비교가 헛돈다 (#63 Codex 리뷰)
[ "$(git rev-parse --path-format=absolute --git-dir)" \
 = "$(git rev-parse --path-format=absolute --git-common-dir)" ] \
  || git switch --detach develop
```

- `MODE=abort`은 이제 **develop 브랜치 자체가 없을 때뿐**이다 (리포가 예상과 다름). 멈추고 사용자에게 보고한다 (`git -C ""`는 위험하니 절대 이어가지 않는다).

## 경로 선택 — 기본은 PR 착지

**모든 작업 단위(이슈)는 PR 착지가 기본이다** (2026-07-21 정책, #48 — 사용자가 머지 전에 PR로 내용을 한 번 확인한다). 검증을 마쳤어도, 변경이 작아도 PR을 만든다.

**즉시 착지(A)는 다음 경우에만**:

1. 사용자가 이 세션에서 **명시적으로 즉시 머지를 지시**했다 ("바로 머지해", "PR 없이 착지해").
2. 오탈자·한두 줄 수준의 단일 커밋 (CLAUDE.md 예외 — 이 경우 브랜치 없이 develop 직접 커밋도 허용).

gh를 쓸 수 없는 머신(git_guard가 차단 — 회사 머신 등)에서 PR 착지 조건에 걸리면: `git push -u origin "$BR"`만 하고 compare 링크(`https://github.com/padahkim/aws-reps/compare/develop...<BR>`)와 "머지 대기 + 이유"를 보고하며 종료한다.

## 0. 사전 체크 — 하나라도 걸리면 멈추고 사용자에게 보고

1. `git branch --show-current`가 작업 브랜치인가? `develop`/`main`이면 착지할 대상이 없다.
2. 워킹트리가 클린한가? (`git status --porcelain` 빈 출력) 미커밋 변경은 먼저 커밋한다.
3. **위임 모드만** — `git -C "$MAIN" status --porcelain`이 클린한가? 더럽다면 다른 세션이 그 워크트리에서 작업 중일 수 있다 — 이어가지 말고 보고. (직접 모드에서는 `$MAIN`이 현재 워크트리라 2번과 같은 검사다 — 생략한다.)
4. 머지가 **엉뚱한 브랜치로 들어가지 않음**을 보장한다 — 모드별로 확인 지점이 다르다.
   - 위임 모드: `git -C "$MAIN" branch --show-current`가 `develop`인가? 아니면 멈추고 보고한다. (`$MAIN`을 하드코딩 fallback으로 썼거나, 누가 그 워크트리를 다른 브랜치로 switch해둔 경우를 잡는 안전장치.)
   - 직접 모드: 지금 이 자리에 작업 브랜치가 있는 것이 정상이므로 여기서는 검사하지 않는다. 대신 A-1/B-3의 `git switch develop` **직후** `git branch --show-current`가 `develop`인지 확인하고, 아니면 멈추고 보고한다.

## A. 즉시 착지

### A-1. develop 동기화

직접 모드면 **먼저** 이 워크트리를 develop으로 옮기고 확인한다 (사전 체크 4의 직접 모드 확인 지점):

```bash
git switch develop
[ "$(git branch --show-current)" = "develop" ] || exit 1   # 아니면 멈추고 보고
```

이후 두 모드 공통: `git -C "$MAIN" fetch origin` 후 develop이 origin/develop보다 behind면 `git -C "$MAIN" merge --ff-only origin/develop`. diverge 상태면 멈추고 보고한다 (다른 PC 작업과 충돌 소지).

### A-2. 머지 → push

```bash
# 머지 직전 재확인 — 사전 체크 4 이후에 그 워크트리가 옮겨졌을 수 있다 (아래 "왜 다시 보는가")
[ "$(git -C "$MAIN" branch --show-current)" = "develop" ] || exit 1

git -C "$MAIN" merge "$BR"        # 단일 커밋이면 ff 허용, 여러 커밋이면 머지 커밋 생성
git -C "$MAIN" merge-base --is-ancestor "$BR" develop || exit 1   # develop이 실제로 받았나
git -C "$MAIN" push origin develop
```

충돌 시: 기계적으로 자명한 것만 해결하고, 판단이 필요한 충돌은 사용자에게 묻는다.

- **왜 다시 보는가 (2026-07-27, PR #146 Codex P1)**: 사전 체크 4는 확인하고 나서 한참 뒤에 머지한다. 그 사이 **직접 모드로 착지한 다른 세션이 파킹(`git switch --detach develop`)** 하면 `$MAIN`이 가리키던 워크트리는 develop을 놓고 detached HEAD가 된다. 그 상태로 머지하면 머지 커밋은 **detached HEAD에 얹히고** `push origin develop`은 안 바뀐 ref를 밀어 "Everything up-to-date"로 조용히 끝난다. 브랜치 확인과 머지를 원자적으로 묶을 방법은 없으므로 **창을 좁히고(재확인) 결과를 검산한다(`--is-ancestor`)** — 검산이 실패하면 A-3의 브랜치 삭제로 넘어가지 않는다.

### A-3. 브랜치 삭제

```bash
# 삭제 전 관문: origin/develop 이 정말 이 브랜치를 담고 있나 (담지 않았으면 지우지 않는다)
git -C "$MAIN" fetch origin
git merge-base --is-ancestor "$BR" origin/develop || exit 1

git -C "$MAIN" branch -d "$BR"                               # 반드시 메인 쪽에서 실행 (로컬 삭제)
git -C "$MAIN" push origin --delete "$BR" 2>/dev/null || true # origin에 올렸던 브랜치면 원격도 정리
```

- **삭제 전 관문이 마지막 안전망이다** (PR #146 Codex P1): A-2의 재확인·검산이 뚫리더라도, `origin/develop`에 없는 커밋의 브랜치는 여기서 안 지워진다. `git branch -d`는 **HEAD 기준**으로 머지 여부를 보므로(detached HEAD가 머지를 담고 있으면 통과) `-d`만으로는 이 사고를 못 막는다 — 기준을 `origin/develop`으로 못박는 이 줄이 필요하다.

- 세션 워크트리 쪽에서 실행하면 그 HEAD 기준 "not fully merged"로 거부된다.
- `$BR`이 현재 세션 워크트리에 체크아웃돼 있으면 삭제가 거부된다 → 먼저 이 워크트리를 원래의 `claude/*` 브랜치로 `git switch`해서 비켜준 뒤 삭제한다. (직접 모드는 A-1에서 이미 develop으로 옮겼으므로 그냥 삭제된다.) 직접 모드면 삭제 후 **파킹**한다 (모드 판별 절).
- 원격 삭제 줄은 `$BR`이 origin에 없으면 (로컬 전용 브랜치였으면) 조용히 넘어간다 — 남은 `feat/*`·`fix/*` 원격 브랜치가 쌓이지 않게 하는 게 목적이다. `--delete`는 force가 아니라 git_guard에 걸리지 않는다.

## B. PR 착지

### B-1. push → PR 생성

```bash
API=repos/padahkim/aws-reps            # 아래 모든 REST 호출의 접두 (B-2·B-3도 같은 값을 쓴다)

git push -u origin "$BR"
PR_URL=$(gh pr create --base develop --head "$BR" \
           --title "<conventional-commits 제목>" --body "<아래 'PR 본문 표준'을 따른 본문>") || exit 1
PR=${PR_URL##*/}                       # 이후 B-2·B-3이 전부 이 번호를 쓴다 (브랜치 이름 대신)
case "$PR" in ''|*[!0-9]*) echo "PR 번호를 못 얻었다: $PR_URL"; exit 1;; esac
```

프리뷰 URL은 PR을 만든 **뒤** Vercel 봇 코멘트로 달린다. 리뷰 가이드가 필요한 PR이면 PR 생성 직후 URL을 얻어 본문을 채운다 (봇 코멘트까지 1분 남짓 걸릴 수 있다 — 비면 잠시 뒤 다시 조회):

```bash
gh api --paginate "$API"/issues/"$PR"/comments \
  --jq '.[] | select(.user.login=="vercel[bot]") | .body' \
  | grep -oE 'https://aws-reps-git-[a-z0-9-]+\.vercel\.app' | head -1
# 얻은 URL로 리뷰 가이드 절을 채워 본문 갱신
gh api -X PATCH "$API"/pulls/"$PR" -F body=@<파일>
```

- 조회·본문 갱신 모두 **REST**다 (2026-07-27, #157) — GraphQL 예산을 쓰지 않고, 한도가 별개다. 봇 계정 표기는 API마다 다르다: REST는 `vercel[bot]`, GraphQL(`gh pr view --json comments`)은 `vercel` — REST로 통일했으므로 `vercel[bot]`이 정본이다.

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

**1) PR 생성 직후 바로 트리거한다.** 이 리포에서 **자동 발동은 신뢰할 수 없다** — 아무것도 안 오거나(PR #121), 리뷰 대신 `To use Codex here, create an environment for this repo` 오류 코멘트만 온다(PR #125). 자동 발동을 기다리는 시간이 그대로 낭비이므로 기다리지 말고 먼저 남긴다.

그래서 자동 발동과 수동 트리거가 **같은 head에 두 번 돌 수 있다 — head가 그대로인 동안은 무해하다**(둘 다 지금 코드를 본 판정이다). 위험한 건 그 실행이 살아 있는 사이에 push해서 head가 바뀌는 경우다: 먼저 끝난 실행의 지적으로 head B를 만든 뒤, 느린 실행(head A를 본 것)이 새 `$SINCE` 이후에 끝나면 시각만 보고 head B의 판정으로 오인한다. **시각 경계로는 이걸 못 막는다** — 그래서 2)에서 판정을 head에 묶는다 (2026-07-26, #127. 원 지적은 PR #125 4라운드).

```bash
PR=<PR 번호>; API=repos/padahkim/aws-reps
SINCE=$(date -u +%Y-%m-%dT%H:%M:%SZ)   # 트리거 시각 — 이번 라운드가 응답했는지 보는 기준
gh api -X POST "$API"/issues/"$PR"/comments -f body="@codex review" --jq .html_url
```

**2) 판정은 "지금 head를 실제로 본 실행"에서만 읽는다.** 시각(`$SINCE`)은 *응답이 왔는지*를 보는 데만 쓰고, *무엇에 대한 판정인지*는 head 대조로 정한다.

`gh api --jq`는 jq의 `--arg`·`--argjson`을 받지 않는다 — 파이프로 넘긴다. **모든 질의에 `--paginate`를 붙인다** — `gh api`는 기본이 첫 페이지뿐이라, 코멘트가 쌓인 PR에서 새 리뷰 신호가 다음 페이지로 밀리면 "리뷰 미도착"으로 오판한다 (PR #125 Codex 지적).

```bash
CX='["chatgpt-codex-connector","chatgpt-codex-connector[bot]"]'   # 정확 일치 2종
API=repos/padahkim/aws-reps
HEAD=$(gh api "$API"/pulls/"$PR" --jq .head.sha)   # 지금 판정받아야 하는 커밋 (REST — 아래 주의)
[ -n "$HEAD" ] || exit 1                           # 빈 값을 head로 들고 가지 않는다

# (a) 리뷰 객체 — 지적이 있으면 요약이 여기로 온다. commit_id = 그 실행이 실제로 본 head
gh api --paginate "$API"/pulls/"$PR"/reviews | jq -s 'add' \
  | jq --argjson cx "$CX" --arg since "$SINCE" --arg head "$HEAD" \
    '[.[] | select(.user.login|IN($cx[]))
          | {id, submitted_at, commit_id, on_head: (.commit_id == $head),
             this_round: (.submitted_at > $since), body}]'

# (b) 지금 head를 본 리뷰의 인라인 지적 — 그런 리뷰가 **여럿일 수 있으니 전부** 합산한다
RIDS=$(gh api --paginate "$API"/pulls/"$PR"/reviews | jq -s 'add' \
  | jq -c --argjson cx "$CX" --arg head "$HEAD" \
    '[.[] | select((.user.login|IN($cx[])) and .commit_id == $head) | .id]')
echo "$RIDS"   # [] 이면 지금 head를 본 리뷰가 아직 없다
gh api --paginate "$API"/pulls/"$PR"/comments | jq -s 'add' \
  | jq --argjson rids "$RIDS" '[.[] | select(.pull_request_review_id|IN($rids[]))]
    | {n: length, items: [.[] | {id, review:.pull_request_review_id,
                                 loc:"\(.path):\(.line)", body}]}'

# (c) 클린 요약 코멘트 — 지적이 없으면 "Didn't find any major issues"가 여기로 온다.
#     본문의 "Reviewed commit: <short sha>"가 그 실행이 본 head다.
#     환경 미설정 오류 코멘트는 리뷰가 아니므로 걸러낸다
gh api --paginate "$API"/issues/"$PR"/comments | jq -s 'add' \
  | jq --argjson cx "$CX" --arg since "$SINCE" --arg head "$HEAD" \
    '[.[] | select((.user.login|IN($cx[])) and (.body|test("create an environment")|not))
          | (.body | [scan("Reviewed commit:\\*\\* `([0-9a-f]{7,40})`")] | flatten | first) as $sha
          | {created_at, reviewed: $sha, on_head: ($sha != null and ($head|startswith($sha))),
             this_round: (.created_at > $since), body}]'

# (d) 리액션 — **판정이 아니라 진행 신호**로만 읽는다 (👀 접수 확인용)
gh api --paginate "$API"/issues/"$PR"/reactions | jq -s 'add' \
  | jq --argjson cx "$CX" --arg since "$SINCE" \
    '[.[] | select((.user.login|IN($cx[])) and .created_at > $since) | .content]'
```

**head는 REST로 읽고 빈 값을 거른다** (2026-07-27, #157). 이 절의 나머지 질의는 원래 REST였는데 head만 `gh pr view --json headRefOid`(GraphQL)였다. 2026-07-26 세션에서 GraphQL 예산이 소진되자 그 호출이 **오류가 아니라 빈 문자열**을 돌려줬고, 빈 head는 아래 모든 대조를 조용히 어긋나게 만든다 (B-3에서 착지가 멈췄다 — 가드는 정상 작동했지만 원인은 예산이었다). REST는 한도가 별개(5000요청/시간)이고, `[ -n "$HEAD" ]` 가드가 그래도 빈 값이 오면 즉시 멈춘다.

**head 대조는 리뷰 객체의 `commit_id`로 한다 — 인라인 코멘트의 `commit_id`로는 안 된다.** GitHub은 아직 유효한 리뷰 코멘트의 `commit_id`를 새 head로 갱신하므로, 이미 고친 이전 라운드 지적이 현재 head 것으로 딸려온다 (PR #125 실측: 인라인 5건 중 `commit_id == head`가 4건 — 1라운드 지적 하나가 섞였다). 반면 **리뷰 객체의 `commit_id`는 갱신되지 않는다** (같은 PR 실측: 4개 리뷰가 `7ad8f54b`·`3e9f0158`·`8b33fe0b`·`f773675f`로 각 라운드 head를 그대로 유지). 그래서 인라인은 시각이 아니라 **`pull_request_review_id`로 리뷰 객체에 묶는다** — (b)가 그것이고, 라운드 경계 문제 자체가 사라진다 (PR #125 실측: 라운드별 2·3·3·3건으로 정확히 갈린다).

- **지금 head를 본 리뷰가 여러 개면 전부 합산한다** (PR #129 Codex 지적). 자동 발동과 수동 트리거가 같은 head를 보면 리뷰 객체가 둘 생길 수 있다 — 하나만 골라 세면(예: `last`) 나머지 실행의 지적이 통째로 사라지고, 고른 쪽이 마침 0건이면 **지적을 남긴 채 클린으로 머지된다**. 클린은 `$RIDS`의 **모든** 리뷰가 0건일 때만이다 (그래서 (b)는 `IN($rids[])`로 합산한다).
- **`RIDS`가 `[]`면 (b)의 `n`은 0이 되지만 그건 클린이 아니다** — "지금 head를 본 리뷰가 아직 없다"는 뜻이다. 0을 클린으로 읽는 건 이 게이트가 막으려는 사고 그 자체다.
- **클린 판정도 head를 이름으로 적는다.** PR #121 실측: 클린 코멘트의 `Reviewed commit`이 `8bc09b6dcd`(= 그 PR을 develop에 머지한 커밋)이고 PR head는 `bb488ce7`이었다 — 리뷰가 머지 뒤에 돌았다는 뜻이고, 대조하면 "지금 head 판정 아님"으로 걸러진다. 선언만 있던 현행에서는 이게 클린으로 통과했다.
- **맨몸 👍(본문 없는 리액션)은 판정으로 쓰지 않는다.** head를 담지 못하므로 어느 커밋에 대한 판정인지 증명할 수 없고, 묵은 실행의 👍가 보지도 않은 head를 통과시킨다 (PR #129 Codex 지적 — "PR 생성 후 push 여부"를 커밋 날짜로 추정해 예외를 두려 했으나, PR 생성 전에 만들어 둔 커밋을 나중에 push하면 그 추정이 틀린다). **1)의 수동 트리거는 항상 head를 적은 판정을 돌려주므로 이 규칙에 손실이 없다** — 실측: 지적 있으면 리뷰 객체(PR #120·#125·#129), 지적 없으면 `Reviewed commit`을 적은 클린 코멘트(PR #121, 수동 트리거 → 2분 41초). 맨몸 👍만 오는 건 트리거 없는 자동 발동뿐이다(PR #122). 그래도 head를 적은 판정이 안 오면 3)의 상한 처리로 사용자에게 묻는다 — 조용히 머지하지 않는다.
- **계정은 정확 일치 2종으로 본다.** `startswith`는 공개 PR에서 `chatgpt-codex-connector-fake` 같은 사칭 계정도 통과시킨다 — 그 계정이 👍 하나만 달면 클린 경로가 뚫린다 (PR #125 Codex 지적). 2종을 두는 이유는 **같은 봇인데 API마다 표기가 다르기 때문**이다: REST는 `chatgpt-codex-connector[bot]`, GraphQL은 `chatgpt-codex-connector`. #157 이후 이 절의 질의는 전부 REST라 실제로 걸리는 건 `[bot]` 쪽이지만, 2종을 남겨 둔다 — 표기가 하나로 좁혀졌다고 믿었다가 다른 표기가 통과하는 쪽이 더 비싼 실수다. 사람·다른 봇이 남긴 인라인 코멘트는 아래 "사용자 코멘트" 경로에서 따로 처리한다.
- **리액션은 둘 다 진행 신호로만 읽는다.** `eyes`(👀)는 "트리거를 접수하고 작업 중", `+1`(👍)은 "지적 없음"이라는 뜻이지만 **어느 커밋에 대한 것인지 말해주지 않는다**(위 항목). 👀을 클린으로 오인하면 리뷰가 끝나기도 전에 머지한다 — 이 게이트가 막으려는 바로 그 사고다. 리액션만 있으면 계속 기다린다.

**3) 상한 10분.** 그래도 판정이 없으면 "**Codex 리뷰 미도착**"을 사용자에게 명시하고 **재시도할지 / 더 기다릴지**를 묻는다. 조용히 머지하지 않는다.

대기 중 판단 기준 (2026-07-26 실측: 수동 트리거 → 첫 응답이 `2분 41초`·`4분 12초`·`4분 57초`, 3/3 응답):

- **👀가 붙었으면 접수된 것** — 상한까지 기다린다.
- **5분이 지나도 👀조차 없으면** 트리거가 유실됐을 가능성이 크다 — 10분을 채우지 말고 **한 번 재트리거**하고 `$SINCE`를 새로 잡는다.
- 무응답의 정체는 대개 Codex가 느린 게 아니라 **자동 발동이 이 리포에서 안 되는 것**이다(1번 참조).

**판정과 분기** — 어느 쪽이든 먼저 "지금 head를 본 판정인가"를 통과해야 한다:

- **판정 없음** (지금 head를 본 리뷰도, 지금 head를 적은 클린 코멘트도 없음 — 리액션만 있는 경우가 여기다) → 아직 판정이 아니다. 계속 기다린다. 이전 head를 본 판정이 새로 도착했더라도 **무시하고**, 무시했다는 사실을 보고에 적는다 (묵은 판정을 클린으로 쓰지 않는다).
- **클린** (지금 head를 본 리뷰가 **전부** 인라인 0건이고 요약에 지적 없음 — 또는 지금 head를 적은 클린 코멘트) → **승인이 지금 head에 대한 것이면** 다시 묻지 않고 B-3으로 진행한다. 보고에 "Codex 리뷰 지적 0건"을 적는다. 이 게이트의 목적은 리뷰를 확보하는 것이지 승인을 두 번 받는 것이 아니다.
  - **승인은 head에 묶인다** (PR #125 Codex 지적). 사용자가 리뷰 대기 중에 승인했고 그 뒤 지적 반영으로 push가 있었다면, 그 승인은 **사용자가 본 적 없는 코드**에 대한 것이다 — 클린이 나와도 **머지 전에 승인을 다시 받는다**. 재사용해도 되는 건 승인 이후 push가 없었던 경우뿐(= 첫 리뷰가 클린이라 고칠 게 없었던 경우). PR 착지 경로의 존재 이유가 "사용자가 머지 전에 내용을 한 번 본다"인데, 승인을 head에 묶지 않으면 그게 무너진다. 그 대조는 문장이 아니라 **B-3의 `APPROVED_HEAD` 기록·재대조로 기계화한다** (#127).
- **지적 있음** → 수정을 반영해 같은 브랜치에 push하고, **인라인 코멘트는 건별로 반드시 답글을 남긴다** (2026-07-22 지시, #80 전례) — 반영이면 반영 커밋 해시와 요지, 거부(반영 부적절 판단)면 거부 사유. 어느 쪽이든 무응답으로 넘기지 않는다. 답글: `gh api repos/padahkim/aws-reps/pulls/<PR>/comments/<comment_id>/replies -f body="..."`.
- **애매하면** (요약이 지적인지 단순 소감인지 불분명) 클린으로 치지 말고 사용자에게 보고한다.

**push할 때마다 이 절을 처음부터 다시 돈다** (1→2→3→판정) — 사용자 코멘트로 인한 push도 포함. 리뷰는 특정 커밋에 대한 것이라, 지적을 반영해 push한 뒤 그대로 B-3으로 가면 **정작 머지되는 최종 코드는 리뷰를 한 번도 안 거친 상태**가 된다 (PR #125 Codex 지적). push하면 `HEAD`가 바뀌므로 이전 판정은 head 대조에서 자동으로 탈락한다 — 재확인을 잊는 실수까지 2)가 잡아준다.

재확인은 **push에 걸려 있지 라운드 수에 걸려 있지 않다** — 첫 리뷰가 클린이면 고칠 게 없고, 고칠 게 없으면 push도 없으니 루프는 한 번도 돌지 않는다. 그대로 B-3이다 (전례 PR #121).

**단, 라운드 상한은 2회다** (2026-07-26 결정, #124). 라운드마다 새 지적이 나올 수 있어서(PR #125 실측: 1라운드 2건 → 2라운드 3건) 상한이 없으면 원리적으로 안 끝난다. 2라운드에도 새 지적이 남으면 **거기서 멈추고 남은 지적을 요약해 사용자에게 보고**한다 — 계속 반영할지, 거부하고 머지할지, 보류할지는 사용자가 정한다. 세션이 판단을 이어받지 않는다.

사용자가 PR에 직접 남긴 요청도 같은 자리에서 처리한다 — **세 곳을 다 본다** (2026-07-26, #127. 그전에는 이슈 코멘트만 봤는데, **인라인 리뷰 코멘트는 다른 엔드포인트에 있고** 그 엔드포인트를 쓰는 유일한 질의는 Codex 계정으로만 필터돼 있었다 — 사람이 인라인으로 남긴 요청이 세션에 한 번도 안 보인 채 머지될 수 있었다):

```bash
# (1) 이슈 코멘트 = PR 대화 탭 (봇 제외 — Vercel·Codex는 위에서 이미 처리했다)
gh api --paginate "$API"/issues/"$PR"/comments | jq -s 'add' \
  | jq '[.[] | select(.user.type != "Bot") | {id, user:.user.login, at:.created_at, body}]'

# (2) 인라인 리뷰 코멘트 — Codex 계정만 제외하고 전부 (Codex 것은 위에서 이미 처리했다)
gh api --paginate "$API"/pulls/"$PR"/comments | jq -s 'add' \
  | jq --argjson cx "$CX" \
    '[.[] | select((.user.login|IN($cx[]))|not)
          | {id, reply_to:.in_reply_to_id, user:.user.login, at:.created_at,
             loc:"\(.path):\(.line)", body}]'

# (3) 사람이 남긴 리뷰 총평 (Request changes·Comment의 본문)
gh api --paginate "$API"/pulls/"$PR"/reviews | jq -s 'add' \
  | jq --argjson cx "$CX" \
    '[.[] | select(((.user.login|IN($cx[]))|not) and (.body|length>0))
          | {user:.user.login, state, at:.submitted_at, body}]'
```

- (2)에는 **세션이 Codex 지적에 남긴 답글도 같이 나온다** — `reply_to`가 채워진 것들이고, PR #125에서는 11건 전부가 그것이었다. 그건 이미 처리한 출력이니 제외하고 나머지를 요청으로 다룬다 (사람이 Codex 스레드에 답글로 요청을 남길 수도 있으니 `reply_to` 유무로 잘라버리지 말고 내용을 본다).
- 반영하면 같은 브랜치에 push한다 (이 push 역시 위 재확인 대상이다).

### B-3. 승인 후 머지 → 동기화

**전제 둘이 모두 참이어야 머지한다** — (i) B-2의 리뷰 확보가 **지금 head에서** 끝났다, (ii) 사용자 승인이 **지금 head에 대한 것**이다. (i)이 아니면 "리뷰 대기 중", (ii)가 아니면 "재승인 필요"를 보고하고 여기서 멈춘다.

**우회는 사용자의 명시 지시로만** (2026-07-26 결정, #124). B-2가 타임아웃(10분)이나 라운드 상한(2회)으로 끝났을 때, 사용자가 "리뷰 없이 머지해"·"남은 지적 거부하고 머지해"라고 **명시**하면 그때만 진행한다 — Codex 장애가 착지를 영구히 막지 않게 하는 탈출구다. 그 경우 보고에 **"리뷰 미확보 머지"** 또는 **"미반영 지적 n건 남긴 채 머지"**를 반드시 적는다. 승인 독려("쭉 해줘")는 우회 지시가 아니다. 우회해도 **아래 head 대조는 건너뛰지 않는다** — 우회하는 건 리뷰 확보이지 "사용자가 승인한 코드가 머지된다"는 보장이 아니다.

**승인은 "제시한 head"에 묶는다** (2026-07-26, #127 — 현행은 "승인은 head에 묶인다"를 문장으로만 선언해서, 승인 뒤 다른 세션·협업자·자동화가 브랜치를 갱신하면 세션이 알아채지 못한 채 **리포의 유일한 비가역 관문**을 통과했다). 순서가 핵심이다 — **승인을 요청할 때 head SHA를 함께 제시하고, 승인이 오면 그 제시한 값을 그대로 옮겨 적는다**:

```bash
# 승인을 요청하기 전에 조회해서 보고에 적는다 ("머지 승인 요청 — head <SHA>")
ASK_HEAD=$(gh api "$API"/pulls/"$PR" --jq .head.sha)
[ -n "$ASK_HEAD" ] || exit 1   # 빈 값을 승인 대상으로 제시하지 않는다
# ... 사용자 승인 도착 후 ...
APPROVED_HEAD=$ASK_HEAD   # 승인 뒤에 다시 조회하지 않는다
```

**승인이 도착한 뒤에 조회하면 안 된다** (PR #129 Codex 지적): 사용자가 head A를 보고 승인했는데 그 사이 브랜치가 B로 움직였으면, 조회는 B를 "승인된 head"로 기록하고 B가 리뷰까지 통과하면 아래 두 대조가 **모두 통과한다** — 사용자가 본 적 없는 코드가 승인된 것으로 남는다. 승인 요청 시 head를 제시하지 않았다면 그 승인은 어느 커밋에 대한 것인지 증명할 수 없다 — 제시하고 다시 받는다.

머지 직전에 다시 대조한다 — 셸에서 한 번, 서버에서 한 번:

```bash
NOW_HEAD=$(gh api "$API"/pulls/"$PR" --jq .head.sha)
[ -n "$NOW_HEAD" ] || exit 1                   # 빈 값끼리는 서로 "일치"한다 — 대조 전에 먼저 막는다
[ "$NOW_HEAD" = "$APPROVED_HEAD" ] || exit 1   # 승인 후 head가 움직였다 → 멈추고 재승인 요청
[ "$NOW_HEAD" = "$HEAD" ] || exit 1            # B-2에서 판정받은 head와도 일치해야 한다

# 모드 재판별 — B-1의 스냅샷은 승인을 기다리는 동안 낡는다 (아래 "왜 다시 판별하는가").
# 모드 판별 절의 블록을 다시 돌려 MAIN·MODE를 재계산한 뒤, **비가역 머지 앞에서** 자리를 잡는다.
if [ "$MODE" = direct ]; then
  git switch develop                                       # 사전 체크 4의 직접 모드 확인 지점
  [ "$(git branch --show-current)" = "develop" ] || exit 1
  MAIN=$(git rev-parse --show-toplevel)
else
  [ "$(git -C "$MAIN" branch --show-current)" = "develop" ] || exit 1
fi

# 머지 — REST. `-f sha=` 는 `--match-head-commit` 과 **동등한 서버측 head 가드**다
gh api -X PUT "$API"/pulls/"$PR"/merge \
  -f sha="$APPROVED_HEAD" -f merge_method=merge || exit 1
# 검산 — 머지가 실제로 됐을 때만 브랜치를 지운다 (보고에 쓸 머지 커밋도 여기서 얻는다)
MERGED=$(gh api "$API"/pulls/"$PR" --jq '"\(.merged)|\(.merge_commit_sha)"')
echo "머지 검산: $MERGED"
[ "${MERGED%%|*}" = true ] || exit 1

# REST 머지는 브랜치를 지우지 않는다 (gh pr merge --delete-branch 와 다른 점) → 원격을 직접 정리
gh api -X DELETE "$API"/git/refs/heads/"$BR" 2>/dev/null || true

git -C "$MAIN" fetch origin
# 동기화 직전 재확인 + 사후 검산 — A-2와 같은 이유(다른 세션의 파킹으로 $MAIN이 develop을 놓았을 수 있다)
[ "$(git -C "$MAIN" branch --show-current)" = "develop" ] || exit 1
git -C "$MAIN" merge --ff-only origin/develop
git -C "$MAIN" merge-base --is-ancestor origin/develop develop || exit 1   # 로컬 develop이 실제로 따라왔나
git -C "$MAIN" branch -d "$BR" 2>/dev/null || true   # 로컬 브랜치 정리 (REST 머지는 로컬을 안 건드린다)
```

- **왜 다시 판별하는가 (2026-07-27, PR #146 Codex 라운드 2)**: 모드는 B-1에서 정해지는데 승인은 몇 분~몇 시간 뒤에 온다. 그사이 다른 워크트리가 develop을 잡으면 스냅샷이 낡는다. 순서를 바꾸지 않으면 **비가역인 머지 호출이 먼저 실행되고 나서** `git switch develop`이 실패해서, 로컬 동기화·브랜치 정리·파킹·보드/이슈 갱신이 통째로 건너뛰어진다 — PR은 이미 머지된 채로. 그래서 **자리를 먼저 잡고 머지한다**.
- **로컬 동기화도 검산한다**: 재확인 뒤에도 같은 창이 남아, `merge --ff-only`가 detached HEAD에서 성공하면 `refs/heads/develop`은 낡은 채로 남는다. 다만 이 시점엔 서버 머지가 끝나 있어 **피해는 로컬 ref가 낡는 것뿐**이다 — 검산이 실패하면 보고하고, 다시 머지하려 들지 않는다.
- `-f sha=`는 **서버측 검사**다 — GitHub이 head가 그 SHA일 때만 머지한다(맞지 않으면 `409`). 셸 대조와 머지 명령 사이의 틈(그 사이에 누가 push하는 경우)까지 닫고, 세션이 SHA를 잘못 들고 있으면 머지가 실패한다. 실패는 조용한 통과보다 낫다. `gh pr merge --match-head-commit`과 **같은 보장**이며, 2026-07-26 세션에서 실동작을 확인했다.
- **REST 머지가 실패하면 `gh pr merge`로 재시도하지 않는다** — 둘은 같은 서버 상태를 볼 뿐이라 결과가 달라질 이유가 없고, 재시도는 실패 원인을 가린다. `409`면 head가 움직인 것(재승인), `405`면 머지 불가 상태(충돌·보호 규칙)다 — 상태를 확인해 사용자에게 보고한다.
- **승인 시점의 head를 기록하지 못한 채 세션이 넘어갔다면 승인은 없는 것으로 취급한다** — `APPROVED_HEAD`를 만들 수 없으면 다시 받는다. 이전 세션이 "승인받았다"고 남긴 말은 어느 커밋에 대한 승인인지 증명하지 못한다.
- `$BR`이 세션 워크트리에 체크아웃돼 있으면 로컬 삭제가 거부된다 → A-3과 같이 `claude/*` 브랜치로 비켜준 뒤 삭제. (직접 모드는 위의 `git switch develop`으로 이미 비켜난 상태다.) 직접 모드면 마지막에 **파킹**한다 (모드 판별 절).
- **REST 머지로 바꾸면서 사라진 사고 하나** (2026-07-27, #157): `gh pr merge --delete-branch`는 머지 뒤 **로컬에서** base 브랜치로 옮기려 하는데, develop이 다른 워크트리에 있으면 `fatal: 'develop' is already used by worktree at …`로 죽었다 — 서버 머지는 끝났는데 로컬 정리만 실패해서 위임 모드에서 3회 재발했다(#130·#136·#142). REST 머지는 **로컬을 아예 건드리지 않으므로** 이 실패 지점이 구조적으로 없어진다. 대신 원격·로컬 브랜치 삭제를 위 블록이 명시적으로 한다.
- 그래도 머지 성공 여부가 불확실하면(네트워크 끊김 등) `gh api "$API"/pulls/"$PR" --jq .merged`로 확인한 뒤 남은 정리만 손으로 마저 한다. **다시 머지하려 들지 않는다.**

## 보드 갱신

착지 결과를 Projects 보드 "aws-reps 로드맵"(프로젝트 #1)에 반영한다 — CLAUDE.md Task management의 보드 규칙의 실행 지점이 여기다.

- **즉시 착지 완료 / PR 머지 완료(B-3)** → 해당 이슈를 `Done`으로.
- **PR 착지 대기(B-1까지)** → `In Progress` 유지.

아래 블록은 **필드 하나를 목표값으로 맞추는 범용 절차**다 — `Status`(이 절)와 `Phase`(신규 등록 시, write-issue §3)가 같은 코드를 쓴다.

**보드는 GraphQL 외길이다** (Projects v2에는 REST가 없다 — `/repos/…/projects`·`/users/…/projects` 모두 404). 그래서 절약 수단은 **질의를 좁히는 것 하나뿐**이고, 아래 블록은 보드 전체를 훑는 대신 **이슈 하나만 짚는 질의**를 쓴다 (#157).

```bash
N=<이슈 번호>; FIELD=Status; TARGET=Done   # Status → "Done"·"In Progress"
                                          # Phase  → "Phase1. MVP-콘텐츠"…"Phase5. 릴리즈 후"·"상시·기타"
OWNER=padahkim; REPO=aws-reps; PROJ=1

# 항목 id·현재값·프로젝트 id·필드 id·옵션 id 를 **한 질의(cost 1)** 로 받는다.
# gh project item-list / field-list 는 각각 102점이라 쓰지 않는다 (아래 실측 표)
# 항목을 프로젝트 **node id** 로 짚는다 — number 는 소유자별 스코프라 남의 프로젝트 #1과 겹친다
Q='query($owner:String!,$repo:String!,$num:Int!,$field:String!,$proj:Int!){
  repository(owner:$owner,name:$repo){ issue(number:$num){
    projectItems(first:20){ totalCount
      nodes{ id project{ id }
             fieldValueByName(name:$field){ ... on ProjectV2ItemFieldSingleSelectValue{ name } } } } } }
  viewer{ projectV2(number:$proj){ id
    field(name:$field){ ... on ProjectV2SingleSelectField{ id options{ id name } } } } } }'

board(){ gh api graphql -f query="$Q" \
           -F owner="$OWNER" -F repo="$REPO" -F num="$N" -F field="$FIELD" -F proj="$PROJ"; }

# 파서 = 게이트다. 잘림·빈 응답·형식 오류는 **즉시 실패**(exit 1)로 만들고, **예산 소진만
# exit 3** 으로 구분한다 — 소진은 "보드를 건너뛰고 계속"이 정답이고 나머지는 fail-closed다.
# gh 는 GraphQL 오류에도 응답 본문을 stdout 에 그대로 준다(실측) — 그래서 여기서 읽을 수 있다
parse(){ python3 -c "
import json,sys
try: p = json.load(sys.stdin)
except Exception as e: sys.exit(f'보드 응답을 파싱할 수 없다: {e}')
errs = p.get('errors') or []
if errs:
    msg = json.dumps(errs, ensure_ascii=False)
    if any(e.get('type') == 'RATE_LIMITED' for e in errs) or 'rate limit' in msg.lower():
        print('예산 소진: ' + msg, file=sys.stderr); sys.exit(3)
    sys.exit('GraphQL 오류: ' + msg)
d = p.get('data') or {}
pj = (d.get('viewer') or {}).get('projectV2')
if not pj: sys.exit('보드를 못 읽었다 (권한·응답 이상) — 빈 값을 결과로 쓰지 않는다')
f = pj.get('field') or {}
opt = next((o['id'] for o in f.get('options', []) if o['name'] == '$TARGET'), None)
if not opt: sys.exit(\"필드 '$FIELD' 에 옵션 '$TARGET' 이 없다\")
c = ((d.get('repository') or {}).get('issue') or {}).get('projectItems')
if c is None: sys.exit('이슈 #$N 을 못 읽었다')
if len(c['nodes']) < c['totalCount']:
    sys.exit(f\"항목 조회가 잘렸다: {len(c['nodes'])}/{c['totalCount']} — first 를 올려라\")
it = next((n for n in c['nodes'] if n['project']['id'] == pj['id']), None)
print(f\"{it['id'] if it else '-'}|{((it or {}).get('fieldValueByName') or {}).get('name') or '-'}|{pj['id']}|{f['id']}|{opt}\")
"; }

# mutation 실행기 — 읽기와 **같은 3분기**를 mutation에도 준다: 성공이면 stdout 그대로,
# 예산 소진이면 3, 그 외 실패면 1. 읽기만 막아두면 "첫 질의가 마지막 점수를 쓰는" 창이 남는다
# stderr 파일은 **프로세스별**이다 ($$) — 고정 경로면 병렬 착지 세션이 서로의 진단을 덮어써서
# 소진을 일반 실패로 오분류한다 (= 머지 뒤 중단). 이 리포는 병렬 세션이 상수 조건이다
mut(){ local out rc err="/tmp/land-mut.$$.err"
  out=$("$@" 2>"$err"); rc=$?
  if [ $rc -eq 0 ]; then rm -f "$err"; printf '%s' "$out"; return 0; fi
  cat "$err" >&2
  if grep -qiE 'rate limit|RATE_LIMITED' "$err"; then rm -f "$err"; return 3; fi
  rm -f "$err"; return 1; }

apply_board(){                          # 성공 0 / 실패 1. 예산 소진은 "미갱신"으로 보고하고 0
  IFS='|' read -r IT CUR PJ FD OPT <<< "$1"
  local OUT RC

  if [ "$IT" = "-" ]; then              # 보드에 없다 (읽기 실패와는 다르다 — 파서가 걸렀다)
    echo "보드에 없음 → 추가한다"
    OUT=$(mut gh project item-add "$PROJ" --owner "@me" \
            --url "https://github.com/$OWNER/$REPO/issues/$N" --format json); RC=$?
    [ $RC -eq 3 ] && { echo "보드 미갱신 — GraphQL 예산 소진 (item-add)"; return 0; }
    [ $RC -eq 0 ] || return 1
    IT=$(printf '%s' "$OUT" | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])') || return 1
    CUR=-
  fi

  if [ "$CUR" = "$TARGET" ]; then
    echo "$FIELD 이미 $TARGET — 설정 생략 (Status면 내장 워크플로가 옮겨둔 것이다, 아래 참조)"
  else
    mut gh project item-edit --id "$IT" --project-id "$PJ" \
      --field-id "$FD" --single-select-option-id "$OPT" >/dev/null; RC=$?
    [ $RC -eq 3 ] && { echo "보드 미갱신 — GraphQL 예산 소진 (item-edit)"; return 0; }
    [ $RC -eq 0 ] || return 1
  fi

  # 재조회로 확인한다 — 보고에 쓰는 건 "설정했다"가 아니라 관측한 값이다 (같은 질의, cost 1)
  local INFO2 RC2; INFO2=$(board | parse); RC2=$?
  [ $RC2 -eq 3 ] && { echo "보드 갱신 결과 미확인 — GraphQL 예산 소진"; return 0; }
  [ $RC2 -eq 0 ] || return 1
  IFS='|' read -r _ NOW _ _ _ <<< "$INFO2"
  echo "보드 확인: #$N $FIELD=$NOW"
  [ "$NOW" = "$TARGET" ] || { echo "보드 갱신 실패 — 위 값이 목표와 다르다"; return 1; }
}

INFO=$(board | parse); RC=$?            # 실패 판정은 반드시 여기서 — read 로 받은 뒤엔 종료 코드가 죽는다(#154)
case $RC in
  0) apply_board "$INFO" || exit 1 ;;
  3) echo "보드 미갱신 — GraphQL 예산 소진 (착지의 나머지 단계는 그대로 계속한다)" ;;
  *) exit 1 ;;                          # 잘림·빈 응답·형식 오류 = fail-closed
esac
```

**왜 이렇게 바꿨나 — 실측 (2026-07-27, #157)**. GraphQL 한도는 요청 수가 아니라 **점수**이고 점수는 반환 노드 수에 비례한다:

| 호출 | 점수 |
|---|---|
| `gh project item-list 1 --limit 500` (보드 항목 91개) | **102** |
| `gh project field-list 1` | **102** ← 이슈 본문이 놓쳤던 지점 |
| `gh project view 1` | 2 |
| 위 단일 항목 질의 (항목 + 필드 메타 동시) | **1** |

옛 블록은 착지 1건에 `item-list`×2 + `field-list` + `view` + `item-edit` = **309점**(실측)을 썼다. 새 블록은 질의 2회 + 편집 1회 = **약 3점**이다. 시간당 5000점을 **모든 세션이 공유**하므로, 병렬 세션 3~4개 리듬에서 이 차이가 착지 가능 횟수를 정한다.

- **"보드에 없음"의 근거가 무엇인가** (#154가 막은 구멍을 다시 열지 않기 위해). 옛 블록은 "보드 전체 목록에 없음 + `totalCount` 대조로 잘리지 않았음"으로 확정했다. 단일 항목 질의에는 "보드 전체"라는 개념이 없으므로 근거를 **이슈 쪽에서** 세운다 — ① 질의가 실제로 응답했다(`viewer.projectV2`가 null 아님 = 예산·권한 정상), ② 이 이슈의 `projectItems`가 잘리지 않았다(`nodes == totalCount`), ③ 그 안에 `project.number == 1`인 항목이 없다. 셋이 모두 참일 때만 "없음"이고, 하나라도 깨지면 파서가 죽는다. 즉 **잘림 감지는 사라진 게 아니라 "보드 전체"에서 "이 이슈의 소속 목록"으로 옮겨 갔다** — 이슈가 어느 프로젝트에도 안 붙었으면 `totalCount=0`·`nodes=[]`로 잘림 없이 "없음"이 확정된다.
- **예산 소진은 멈출 이유가 아니다 — 그것만 `exit 3`으로 구분한다** (PR #158 Codex P1). 이 블록은 **비가역인 머지 뒤, 이슈 close-out·잔재 정리·main 전파 앞**에 있다. 그래서 소진 시 통째로 `exit 1`을 하면 **PR은 머지된 채로 남은 단계가 전부 건너뛰어진다** — 이 스킬이 #146에서 배운 사고와 같은 모양이고, 정작 주의 절이 명문화한 폴백("보드만 건너뛰고 계속")과 코드가 어긋나 있었다. 이제 소진은 "보드 미갱신"으로 보고하고 계속하며, **잘림·빈 응답·형식 오류는 그대로 fail-closed**다 (그건 보드 상태를 모른다는 뜻이므로 계속하면 안 된다).
  - **mutation도 같은 3분기를 받는다** (PR #158 Codex 라운드 2). 읽기만 고치면 창이 남는다 — **첫 질의가 마지막 남은 점수를 쓰면** 뒤따르는 `item-add`·`item-edit`이 rate-limit으로 실패하고, 그 실패가 `exit 1`로 번져 같은 부분 착지 상태를 만든다. 그래서 `mut()` 실행기가 mutation의 stderr에서 소진을 알아보고 3을 돌려준다. 읽기든 쓰기든 **"보드를 못 만졌다"는 착지를 멈출 이유가 아니다** — 멈출 이유는 "보드 상태를 잘못 알 위험"뿐이다.
  - 소진 판정은 읽기에서는 `errors[].type == "RATE_LIMITED"`(또는 메시지의 `rate limit`), mutation에서는 stderr 문자열로 한다. `gh api graphql`은 GraphQL 오류에도 **응답 본문을 stdout에 그대로 준다**(실측: exit 1 + 본문 출력) — 그래서 파서가 읽을 수 있다. 2026-07-26 사고에서 빈 값이 왔던 건 `gh pr view --json … --jq`가 오류를 삼켰기 때문이고, 원본 응답에는 `type`이 들어 있다.
  - `data.viewer.projectV2` null 검사는 남아 있다 — 소진 외의 이유(권한·응답 이상)로 못 읽은 경우를 잡는다. 이 검사가 없으면 그 상태가 "보드에 없음"으로 읽혀 `item-add`가 중복 항목을 만든다.
- **항목은 프로젝트 번호가 아니라 node id로 짚는다** (PR #158 Codex P2). 프로젝트 번호는 **소유자별 스코프**라, 이 이슈가 다른 사용자·조직의 프로젝트 #1에도 들어 있으면 `number == 1`이 그 항목을 고른다. 그러면 ① 그쪽 필드가 마침 목표값이면 설정과 검증이 **둘 다 거짓 성공**하고(우리 보드는 그대로), ② 아니면 다른 프로젝트의 항목 id에 우리 프로젝트의 필드 id를 넘겨 `item-edit`이 실패한다. 그래서 질의가 `project{ id }`를 받아 `viewer`의 프로젝트 id와 대조한다.

- **보드에는 내장 워크플로가 이미 돌고 있다** (2026-07-27 실측, `ProjectV2.workflows` GraphQL 조회 — 전부 enabled): `Item closed`·`Item added to project`·`Pull request merged`·`Pull request linked to issue`·`Auto-add sub-issues to project`·`Auto-close issue`. 그래서 `closes #N`으로 닫히는 **표준 경로에서는 Done이 자동으로 붙는다** — 위 스크립트가 Done을 "설정"이 아니라 **"확인하고 다를 때만 설정"** 으로 바뀐 이유다. 반면 **`In Progress`는 자동화가 없으므로** 착수 시 세션이 반드시 설정해야 한다.
- 순서 주의: **추가가 먼저, 상태 설정이 나중** — 보드에 없는 이슈를 상태부터 설정하려 하면 빈 id로 `item-edit`을 불러 GraphQL 오류로 죽는다(#154 실측). 위 스크립트는 "조회가 잘림"(즉시 실패)과 "보드에 없음"(추가)을 **구분**한다.
- item-add로 새로 추가한 이슈는 **Phase 필드도 설정**한다 (CLAUDE.md Task management의 보드 규칙 — Milestones 대신 Phase 필드). Status는 `Item added to project` 워크플로가 `Todo`로 넣어 준다.
- gh 차단 머신에서는 생략하고 보고에 "보드 미갱신"을 명시한다 — 다음 gh 가능 세션 시작 시 동기화한다. **GraphQL 예산이 소진된 경우도 같은 처리**다 (보드에는 REST 대체 경로가 없다 — 주의 절 참조): 사유를 붙여 "보드 미갱신 — GraphQL 예산 소진"으로 보고하고, 착지의 나머지 단계는 REST로 그대로 완주한다.

## 이슈 close-out — 체크박스 갱신 (생략 불가)

착지가 완료되는 시점(즉시 착지 A-2 이후, PR 머지 B-3 이후)에 **`closes #N`으로 닫히는 이슈의 완료 기준 체크박스를 갱신한다**. 자동 닫힘은 이슈 본문을 거치지 않으므로, 이 단계를 건너뛰면 이슈가 빈 체크박스인 채 닫힌다 (#41·#43 사고 — 닫힌 이슈에서 "실제로 다 했는가"를 판별할 수 없게 된다).

- **실제 달성한 항목만** `[x]`로 바꾼다 — 착지했다고 일괄 체크 금지.
- 미달성 항목은 빈 채로 두고 보고에 명시한다. 미달성분이 실작업이면 /write-issue로 파생 이슈를 만들어 본문에 `#N`으로 남긴다.

```bash
N=<이슈 번호>; API=repos/padahkim/aws-reps
gh api "$API"/issues/"$N" --jq .body > /tmp/issue-$N.md
[ -s /tmp/issue-$N.md ] || exit 1                     # 빈 본문으로 덮어쓰지 않는다
# 달성 항목의 "- [ ]"를 "- [x]"로 편집한 뒤:
gh api -X PATCH "$API"/issues/"$N" -F body=@/tmp/issue-$N.md
```

- 조회·갱신 모두 **REST**다 (#157). 빈 파일 검사가 필요한 이유는 이 스킬이 배운 것과 같다: **읽기가 조용히 빈 값을 주면 그다음 쓰기가 본문을 지운다.**

- PR 착지 대기(B-1까지) 상태에서는 하지 않는다 — 머지가 승인된 뒤(B-3)가 갱신 시점이다.
- gh 차단 머신에서는 생략하되 보고에 "**체크박스 미갱신 — 웹에서 체크 필요**"와 달성 항목 목록을 명시한다.

## 잔재 정리 — 착지 완료 시 (A-3·B-3 직후)

A-3·B-3의 브랜치 삭제는 방금 착지한 브랜치만 다룬다. 여기서는 **과거 세션이 남긴 잔재**를 함께 쓸어낸다 (2026-07-22 도입 — 머지 완료된 로컬 브랜치 27개·워크트리 5개가 방치돼 있던 사고의 재발 방지). PR 착지 대기(B-1까지) 상태에서는 하지 않는다.

```bash
# 1) develop에 이미 머지된 로컬 브랜치 일괄 삭제
#    (develop/main 제외, 워크트리에 체크아웃된 브랜치는 "+" 표시라 자동 제외, -d라 미머지는 어차피 거부됨)
git branch --merged develop | grep -vE '^[+*]|develop$|main' | xargs -n1 git branch -d 2>/dev/null || true

# 2) 앱 자동 생성 워크트리(.claude/worktrees/*) 중 착지가 끝나고 "아무도 안 쓰는" 것만 제거
#    안전 조건 5가지: 현재 세션 워크트리 아님 + 사용 중 아님 + 최근 활동 없음(GRACE) + 클린 + HEAD가 develop에 포함
#    기준 경로는 **메인 리포**다 — $MAIN(develop을 다루는 워크트리)이 아니다 (아래 "왜 메인 리포 기준인가")
WTDIR=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")/.claude/worktrees
SELF=$(git rev-parse --show-toplevel)
SEEN=0; GONE=0

# 살아 있는 프로세스들의 cwd를 한 번만 뜬다 (lsof 1회 ≈0.3초 — 루프 안에서 반복 호출하지 않는다)
CWDS=$(lsof -a -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
GRACE=60                                                      # 분(=1시간). cwd가 1차 방어라 mtime은 백스톱만
if [ -z "$CWDS" ]; then
  echo "  !! 사용 중 판별 불가(lsof 없음/차단) — 이번엔 워크트리를 하나도 제거하지 않는다"
fi

echo "워크트리 정리 대상 경로: $WTDIR"
if [ ! -d "$WTDIR" ]; then
  echo "  경로 없음 — 이 리포에서 앱 자동 생성 워크트리를 쓴 적이 없다는 뜻이다"
elif [ -z "$(ls -A "$WTDIR")" ]; then
  echo "  비어 있음 — 지울 잔재 없음"
fi

for W in "$WTDIR"/*/; do
  [ -d "$W" ] || continue
  W=${W%/}; SEEN=$((SEEN + 1))
  if [ "$W" = "$SELF" ]; then echo "  건너뜀 $W — 자기 자신"; continue; fi

  # (a) 사용 중 판별 — 직접 신호. 그 경로를 cwd로 가진 프로세스가 하나라도 있으면 살아 있는 세션이다
  if [ -z "$CWDS" ]; then echo "  건너뜀 $W — 사용 중 판별 불가"; continue; fi
  if printf '%s\n' "$CWDS" | grep -qxF "$W" || printf '%s\n' "$CWDS" | grep -qF "$W/"; then
    echo "  건너뜀 $W — 사용 중(살아 있는 프로세스의 cwd)"; continue
  fi

  # (b) 최근 활동 백스톱 — 반드시 status보다 먼저 한다
  #     (git status는 인덱스를 다시 쓸 수 있어, 나중에 재면 우리가 만든 mtime을 재게 된다)
  GD=$(git -C "$W" rev-parse --path-format=absolute --git-dir 2>/dev/null) \
    || { echo "  건너뜀 $W — git 워크트리가 아님"; continue; }
  SLUG=$(printf '%s' "$W" | tr '/.' '--')                     # ~/.claude/projects 의 경로 슬러그 규칙
  HOT=$(find "$GD" -maxdepth 1 -mmin "-$GRACE" 2>/dev/null | head -1)                    # git 활동
  [ -z "$HOT" ] && HOT=$(find "$HOME/.claude/projects/$SLUG" -maxdepth 1 -name '*.jsonl' \
                              -mmin "-$GRACE" 2>/dev/null | head -1)                     # 세션 대화 활동
  if [ -n "$HOT" ]; then echo "  건너뜀 $W — 최근 활동 ($HOT)"; continue; fi

  # (c) 착지 완료 판별
  if [ -n "$(git -C "$W" status --porcelain)" ]; then echo "  건너뜀 $W — 더러움"; continue; fi
  if git merge-base --is-ancestor "$(git -C "$W" rev-parse HEAD)" develop; then
    if git worktree remove "$W"; then GONE=$((GONE + 1)); echo "  제거 $W"
    else echo "  !! 제거 실패 $W"; fi
  else
    echo "  건너뜀 $W — HEAD가 develop에 없음(미착지)"
  fi
done
git worktree prune
echo "워크트리 정리: 훑음 $SEEN · 제거 $GONE"
```

- **무엇을 지켜야 하나 — 2026-07-26 사고 (#130)**: 제거 조건이 "클린 + develop에 포함"뿐이던 시절, 세션 A가 PR #128을 머지한 **직후**(워크트리는 클린, HEAD는 develop에 포함) 병렬 세션 B의 이 단계가 세션 A의 워크트리를 제거했다. 자기 보호 조건(`$W = $SELF`)은 정리를 *실행하는* 세션만 지킨다. 결과: 세션 A는 훅 스크립트(`scripts/git_guard.py`) 소실로 **모든 Bash 호출이 차단**(훅 부재 = fail-closed)되고, `.git` 포인터 소실로 git 명령이 상위 메인 리포로 오해석됐다. 즉 **"착지가 끝났다"는 "세션이 끝났다"가 아니다**.
- **왜 mtime이 아니라 프로세스 cwd인가 (#139)**: 처음 낸 답은 12시간 mtime 유예였는데, mtime은 "세션이 살아 있나"의 **대리 지표**라 양쪽으로 틀렸다. 착지 자체가 그 워크트리의 `index`·`HEAD`·`logs`를 쓰므로 **막 착지한 워크트리는 그 순간부터 12시간 hot이 확정**된다 — 하루에 워크트리를 2~3개 돌리면 그날은 하나도 정리되지 않는다. 반대로 밤새 열어둔 idle 세션은 두 신호가 다 식어 **#130이 그대로 재현**된다. cwd는 대리 지표가 아니라 직접 신호라 두 경우를 다 맞힌다.

  | 상황 | 12시간 mtime | 프로세스 cwd + 1시간 |
  |---|---|---|
  | 착지 직후, 세션은 살아 있음 (#130 사고) | 지킴 | 지킴 |
  | 밤새 열어둔 12시간+ idle 세션 | **지움 — 구멍** | 지킴 |
  | 2시간 전에 끝난 세션 | **못 지움 — 하루치 누적** | 같은 날 지움 |

- **판별 불능이면 하나도 지우지 않는다** — `lsof`가 없거나 막혀 `$CWDS`가 비면 제거를 통째로 건너뛰고 그 사실을 출력한다. 여기서 옛 12시간 유예로 되돌리는 건 답이 아니다: 그 유예가 바로 위 표의 idle 구멍이라, "판별 못 함"을 "지워도 됨"으로 바꿔 읽는 셈이 된다 (PR #140 Codex 지적). 비용이 비대칭이라 이쪽이 맞다 — 잔재를 못 지우면 다음 세션이 지우면 그만이지만, 살아 있는 워크트리를 지우면 병렬 세션이 그 자리에서 죽는다.
- 남은 1시간 유예의 역할은 하나다 — **셸이 아직 안 뜬 갓 시작한 세션**. 그때는 cwd를 잡을 프로세스가 없지만 트랜스크립트(`*.jsonl`)는 이미 쓰이고 있다.
- **왜 메인 리포 기준인가 (#136)**: 앱 자동 생성 워크트리는 항상 **메인 리포** 아래(`<메인 리포>/.claude/worktrees/`)에 생기는데, `$MAIN`은 "develop을 다루는 워크트리"(위임 모드=develop을 든 워크트리, 직접 모드=현재 워크트리)라 둘이 갈릴 수 있다. 실제로 #130 착지 중 `gh pr merge --delete-branch`가 상설 워크트리를 develop으로 옮겨 `$MAIN`이 거기가 됐고, 루프는 없는 경로를 훑고 **조용히 아무것도 안 했다**. `--git-common-dir`의 부모는 어느 워크트리에서 실행하든 메인 리포를 가리킨다.
- **조용한 no-op 금지**: 훑은 경로·건수·건너뛴 사유를 전부 출력하고 그대로 보고에 옮긴다. "훑었는데 0건"과 "경로가 빗나가 못 훑음"은 다른 사건인데, 출력이 없으면 둘 다 "정리 완료"로 보인다 — 이 단계가 도입된 이유(잔재 누적)가 그대로 되살아난다.
- 건너뛴 워크트리가 있으면 **사유(사용 중 / 판별 불가 / 최근 활동 / 더러움 / 미착지)와 함께** 보고에 명시한다 — 사용자가 병렬 세션 여부를 판단한다.
- `eval/*` 등 `.claude/worktrees/` 밖의 수동 워크트리는 이 정리 대상이 아니다 — 사용자가 직접 관리한다.
- 현재 세션이 앱 자동 생성 워크트리 안이라면 자기 워크트리는 남는다 — 세션 종료 후 다음 착지 세션의 이 단계가 치운다.

## 하네스 변경 시 — main 전파

착지한 변경에 CLAUDE.md · `.claude/` · `scripts/` 가 포함되면, develop 착지 직후 `develop`→`main` 머지·push까지 한다 (CLAUDE.md Branch strategy 참조 — 새 세션 워크트리가 main에서 분기하므로).

## 보고

develop 최신 해시, 경로(즉시/PR)와 머지 방식(ff/머지커밋), push 결과, **Codex 리뷰 결과**(지적 0건 / 반영 n건 / 미도착 — **판정받은 head SHA와 머지한 head SHA를 함께** 적는다. 둘이 같다는 게 게이트가 실제로 작동했다는 유일한 증거다), 보드 갱신 결과(또는 "보드 미갱신"), 이슈 체크박스 갱신 결과(미달성 항목 포함, 또는 "체크박스 미갱신"), 잔재 정리 결과(삭제한 브랜치 수, **훑은 워크트리 경로와 건수**, 제거한 워크트리, 건너뛴 워크트리와 사유 — 사용 중 / 판별 불가 / 최근 활동 / 더러움 / 미착지)를 사용자에게 보고한다. PR 착지 대기 상태면 PR URL과 사유를 보고한다.

## 주의

- **GraphQL 예산(5000점/시간)은 모든 세션이 공유하고, 소진되면 오류가 아니라 빈 값으로 온다** (2026-07-26 사고, #157). 그래서 착지 경로의 **읽기·대조·머지는 전부 REST**로 옮겼다 — 한도가 별개이고(REST 5000요청/시간) GraphQL 점수를 0점 쓴다. 잔량 확인: `gh api rate_limit --jq .resources.graphql`.
- **남은 GraphQL 소비처는 보드와 몇몇 mutation뿐이다** — 보드 질의·`item-add`·`item-edit`(각 1~2점), `gh pr create`. 이것들은 절대량이 작아 그대로 둔다. 반면 `gh pr comment`(2점)는 REST POST로 바꿨는데, B-2는 **라운드마다 반복 호출**되는 자리라 상수 비용이 아니기 때문이다. 이 리포에서 문제가 된 건 언제나 **호출 수가 아니라 한 호출이 끌어오는 노드 수**였다(`item-list`·`field-list` 102점).
- **예산 소진 시 폴백**: 착지 자체는 REST만으로 완주된다(head 조회·머지·브랜치 삭제·본문 갱신). 보드는 GraphQL 외길이라 대체 경로가 없으므로 **보드 갱신만 건너뛰고 보고에 "보드 미갱신 — GraphQL 예산 소진"을 명시**한다 (gh 차단 머신과 같은 처리). 다음 세션이 동기화한다 — 리셋은 매시간이다. 빈 값을 결과로 받아들여 진행하지 않는다.
- gh는 git_guard 조건(홈 마커 + 개인 계정 활성)을 충족한 머신에서만 동작한다 — 차단되면 위의 gh-불가 fallback을 따른다. `push --force`·`branch -D`·`reset --hard`·`clean -f`는 어느 머신에서든 git_guard 훅이 차단한다.
- git_guard는 **커밋 메시지 본문의 "gh <단어>" 문자열도 오탐 차단**한다 — 커밋 메시지에 gh를 단독 단어로 쓰지 말 것 ("gh-CLI" 등으로 표기).
