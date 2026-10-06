---
name: chapter-audit
description: 챕터 하나를 사실(AWS 공식 문서 대조)·내부 일관성(본문·그림·카드·셀프 퀴즈·outro·meta)·학습자 경로(CLAUDE.md Audience) 3축으로 병렬 검수하고, 적대적 검증을 통과한 결함만 보고서로 낸다 — 보고서에서 멈추고 사용자가 고른 묶음만 /write-issue로 등록한다. "/chapter-audit ch3-1", "챕터 종합 검수", "챕터 정확성 검수해줘", "공식 문서랑 대조해줘", "이 챕터 모순 찾아줘", "정의 안 하고 쓰는 용어 찾아줘", "그림이 본문이랑 반대인 곳 봐줘", "변환한 챕터 검수", "#45류 검수"에 사용하고, 후속 요청("사실 축만 다시", "검수 다시 돌려", "이전 검수 결과로 이슈 만들어", "보고서 3·5번 등록해")에도 사용한다. 언어 품질(번역투·용어 표기)은 chapter-review, PR 리뷰 코멘트 대응은 land B-2, 코드 diff 버그 리뷰는 code-review의 몫이다.
---

# /chapter-audit — 챕터 종합 검수

목표: 챕터 하나에서 **사실 오류·자리 간 모순·학습자가 막히는 자리**를 찾아, 사용자가 고를 수 있는 교정 이슈 후보로 묶는다.

왜 하네스인가: ch3-1 변환(#272) 뒤 2026-09-24 종합 검수를 사람이 한 세션에서 수작업으로 했고, 교정 이슈가 5건(#288~#292) 나왔다. 원인 대부분은 **한 곳만 고치고 연결된 자리를 남긴 잔재**, **근거 없는 사실**, **그림과 본문의 방향 불일치**, **정의 전 사용**이었다 — 한 사람이 한 번에 읽으면 축이 섞여 서로를 가린다. 잔여 24챕터(#29)마다 같은 검수가 필요하다.

**언어 품질은 이 스킬의 축이 아니다** — `/chapter-review`가 맡는다. 두 축을 섞으면 어느 쪽도 끝까지 보지 못한다(chapter-review와 같은 원칙). 보고서 끝에서 안내만 한다.

**변환 원본 대비 내용 누락도 이 스킬의 축이 아니다.** 스코프의 레거시 원본은 사실·일관성 판단의 참고 자료일 뿐 대조 대상이 아니다 — 원본의 한 절이 빠져도 챕터가 스스로 일관되면 이 스킬은 통과시킨다. 담당은 #302에서 정한다 (PR #301 Codex 지적).

## 실행 모드: 서브에이전트 위임 (팬아웃/팬인 + 적대적 검증)

| 단계 | 실행 | 이유 |
|---|---|---|
| 0 기존 작업 확인 | 메인 | 부분 재실행·재등록을 가른다 |
| 1 스코프 확정 | 메인 | 세 축이 **같은 파일 목록·같은 버전**을 봐야 병합이 성립한다 |
| 2 3축 검수 | 서브에이전트 3명 병렬 | 축끼리 대화가 필요 없고 결과만 모으면 된다 |
| 3 병합 | 메인 | 중복 제거·ID 부여·배치 분할 |
| 4 적대적 검증 | 서브에이전트 배치 수만큼 병렬 | 그럴듯한 오지적을 사용자 앞에서 걸러낸다 |
| 5 보고 → **멈춤** | 메인 | 등록할 항목은 사용자가 고른다 (2026-09-28 결정) |
| 6 등록 | `/write-issue` | 고른 묶음만 |

이 리포 세션 환경에는 `Workflow` 도구가 없어서(2026-09-28 확인) 워크플로 스크립트 대신 서브에이전트 위임으로 짰다. 처리 목록과 검증 규칙이 고정돼 있으므로, Workflow를 쓸 수 있게 되면 2~4단계를 스크립트로 옮기는 게 다음 개선 후보다.

## 에이전트 구성

| 에이전트 (`subagent_type`) | 모델 | 축 | 산출물 |
|---|---|---|---|
| `fact-auditor` | opus | 챕터 ↔ AWS 공식 (F1~F4) | `01_fact-auditor_findings.md` |
| `consistency-auditor` | opus | 챕터 ↔ 챕터 자신 (C1~C5) | `01_consistency-auditor_findings.md` |
| `learner-auditor` | sonnet | 챕터 ↔ 학습자 (L1~L6) | `01_learner-auditor_findings.md` |
| `finding-verifier` | opus | 지적 반박 | `03_finding-verifier_<batch>_verdicts.md` |

정의는 `.claude/agents/`, 지적·판정 형식과 유형 코드의 정본은 `references/finding-format.md`. 모델 선택 이유는 각 정의 파일 머리 주석에 있다.

> **에이전트 정의와 `finding-format.md`에 특정 챕터의 실제 결함을 예로 넣지 않는다.** 회귀 테스트가 과거 검수 결과를 정답으로 쓰므로, 예시가 곧 정답 누출이 된다. 교훈은 **유형**으로 일반화해 넣는다.

## 0단계: 기존 작업 확인

입력: 챕터 id (필수 — 없으면 묻는다). 선택: `--root <dir>`(스냅샷 대상), 규모 `철저히`.

작업 디렉터리는 `_workspace/chapter-audit/<id>/` (리포 루트 기준, `.gitignore` 대상).

- `00_scope.md`·`00_inputs.txt`·`00_input_hashes.txt` 중 하나라도 **없다** → 처음부터. 이전 버전 산출물은 새 의존성 목록이 없어서 안전하게 재사용할 수 없다.
- 있으면 먼저 **판정 입력이 그대로인지** 본다 — 대상 커밋이 같고, 저장한 `00_inputs.txt`의 각 파일을 다시 해시해 `00_input_hashes.txt`와 비교했을 때 같아야 "그대로"다. 입력 목록에는 대상의 실제 렌더 자산뿐 아니라 `content/registry.ts`, 화면의 순서·선별을 정하는 app/lib 렌더러 소스, 용어집, `VERIFIED_FACTS`, Audience 절을 담은 `CLAUDE.md`, 레거시 원본(썼다면), **registry에서 대상보다 앞선 챕터의 실제 렌더 자산**을 넣는다. 앞 챕터와 용어집은 L1의 "이미 배움/팝오버로 정의됨" 판정을, 렌더러는 intro·preview·카드·마무리의 노출 여부와 순서를 바꾸므로 빠뜨리면 안 된다. 커밋만 보면 안 된다 — 보고서 뒤에 커밋 없이 입력을 고쳤으면 커밋은 같은데 보고서는 낡았다 (PR #301 Codex 지적). 반대로 판정에 쓰지 않은 다른 챕터·파일은 입력 목록에 넣지 않는다 — 무관한 편집이 거짓 "낡음"을 만들지 않게.
- 있고 **대상이 그대로다**:
  - "○○ 축만 다시" → 그 축만 2단계부터. 그 축의 이전 산출물은 `01_<agent>_findings.v<N>.md`로 남긴다. 3단계에서는 **A번호를 다시 매기지 않는다** — 그 축의 기존 지적에서 **그 축의 원 ID만 지운다**. 다른 축 출처가 남은 A는 살아 있고, 출처가 하나도 남지 않은 A는 제목에 `[폐기 — <축> vN]`과 `상태: tombstone`을 붙여 번호·이력만 보존한다. tombstone의 예전 본문은 **검증·판정 집계·보고에서 모두 제외**한다 — 재실행이 버린 지적을 verifier가 되살리면 안 된다. 새 지적이 기존 live A와 같은 결함이면 그 A에 원 ID를 더한다. tombstone과 같은 결함이면 그 A의 tombstone을 제거해 되살리고 원 ID를 붙인다. 어느 쪽도 아니면 마지막 번호 다음부터 이어 붙인다. **판정은 내용에 묶이지 A번호에 묶이지 않는다.** 살아 있는 A의 축/원 ID·위치·인용·문제·교정 방향·규모 중 하나라도 달라졌거나, tombstone/refuted 상태에서 되살아났거나, 새 A라면 그 A가 든 **배치 전체의 live A**를 4단계에서 다시 검증한다. 이전 판정 파일은 `.v<N>.md`로 남기고 새 판정으로 교체한다. 완전히 같은 live A만 기존 판정을 유지한다. 새 출처를 붙였다는 이유만으로 예전 refuted 판정을 물려주거나, 새 위치·교정 범위를 검증 없이 confirmed로 내보내면 안 된다 (PR #301·#303 Codex 지적).
  - "이슈 만들어·N번 등록" → `04_report.md`를 읽고 6단계로.
- 있고 **대상이 바뀌었다**(커밋이 다르거나, 커밋은 같아도 대상 해시가 다르다) 또는 새 입력 → "N번 등록" 요청이었어도 낡은 보고서로 등록하지 않는다 — 바뀌었다는 사실과 재검수 필요를 보고한다. 재검수하면 기존 디렉터리를 `<id>-<YYYYMMDD-HHMM>`으로 옮기고 처음부터. 옛 보고서의 "등록됨" 행은 새 보고서에 옮겨 적는다 — 같은 결함을 두 번 등록하지 않으려는 것이다.

## 1단계: 스코프 확정 (메인)

1. **대상 루트.** 기본은 리포 루트(현행 브랜치). `--root`면 그 디렉터리. 회귀 테스트나 과거 시점 검수용 스냅샷은 이렇게 만든다 (scratchpad 등 리포 밖에):
   ```bash
   SHA=<커밋>; SNAP=<scratchpad>/snap-$SHA
   mkdir -p "$SNAP" && git archive "$SHA" app/chapters lib content CLAUDE.md docs/VERIFIED_FACTS.md \
     | tar -x -C "$SNAP"
   ```
2. **스캔 파일 목록** = `/chapter-review`의 "입력·범위"에 있는 자산 종류를 쓰되, 실제 집합은 **파일 존재가 아니라 렌더 그래프**로 확정한다.
   - 화면 쪽 시작점은 `app/chapters/[id]/page.tsx`와 `app/chapters/[id]/[sec]/page.tsx`다. 두 route와 import helper를 따라 intro, 섹션 header, preview, self-quiz, concept, outro, finale의 노출 여부·순서를 먼저 확정한다. 적어도 `lib/content.ts`·`lib/chapter-routes.ts`와 실제로 쓰는 하위 renderer를 포함한다.
   - 콘텐츠 쪽은 `content/registry.ts`의 대상 entry에서 `loadBody`와 `data`가 가리키는 export를 시작점으로 삼고, `body.tsx`와 렌더되는 MDX의 import를 따라간다. `sections/*.mdx`·`outro.mdx`·`figs.tsx`는 이 그래프에서 실제로 도달하는 파일/심볼만 넣는다.
   - `intro.mdx`는 대상 entry에 `loadIntro`가 있을 때만 넣는다. 파일이 남아 있어도 `loadIntro`가 없으면 화면에 나오지 않으므로 제외한다. 같은 원칙으로 registry/body 그래프에서 도달하지 않는 orphan 자산은 스캔하지 않고 `00_scope.md`의 "비렌더 제외"에 적는다.
   - `session.ts`·`selfquiz.ts`도 registry의 `data` export와 유효한 섹션 매핑을 거쳐 실제 렌더되는 항목만 본다. **챕터 퀴즈는 `drills.ts` 전량이 아니라 `meta.ts`가 내보내는 `quiz` 선별분만** 대상이다 (예: ch0-2는 `CHAPTER_SCOPE`로 일부만 고른다). `meta.ts`의 `quiz` 정의를 읽어 **선별된 slug 목록**(전량 re-export면 "전량")을 적는다. 교정 위치는 `content/drills-src/` 원본이라고 적는다.
   - 각 대상은 줄 수와 함께 적고, 부분 파일이면 렌더되는 export·slug·심볼도 적는다. 이렇게 해야 "디스크에 있음"과 "학습자가 봄"을 혼동하지 않는다 (PR #301 Codex 지적).
3. **참고 경로**: `<root>/docs/VERIFIED_FACTS.md`, 용어집 `<root>/content/glossary.ts`(본문 `<Term>` 팝오버가 여기 `short`를 띄운다 — L1 판정에 필요하다), 레거시 원본(`meta.ts` 헤더 주석이 가리키는 `content/*.jsx` — 있으면), 선행 챕터(`<root>/content/chapters/`), `CLAUDE.md` Audience 절.
4. **재사용 입력 + 무결성 기준점 — 파일 해시 목록**:
   - 먼저 `00_inputs.txt`에 이번 판정이 의존하는 **로컬 파일 전부**를 절대경로로 한 줄씩 쓴다: 두 chapter route에서 시작한 **renderer import closure**(예: `lib/content.ts`·`lib/chapter-routes.ts`·preview/self-quiz/concept/finale renderer), `content/registry.ts`, 대상의 렌더 자산, glossary, `VERIFIED_FACTS`, `CLAUDE.md`, 사용한 레거시 원본, registry상 앞선 챕터에서 L1/C1 판단에 참고할 렌더 자산, chapter-audit/chapter-review 지침, 에이전트 정의와 `finding-format.md`. 그 목록을 해시한 `00_input_hashes.txt`가 0단계 재사용 판정의 기준이다. 외부 AWS 문서는 보고서의 확인 날짜·URL로 추적한다.
   - 별도로 리포의 `content`·`docs` 전체와 스냅샷을 해시한다. 이것은 5단계에서 검수자가 콘텐츠를 고치지 않았는지 확인하는 무결성 기준점이다.
   ```bash
   W=_workspace/chapter-audit/<id>; mkdir -p "$W"   # 새 체크아웃에는 이 디렉터리가 없다 (.gitignore 대상)
   while IFS= read -r p; do
     if [ -f "$p" ]; then shasum "$p"; else printf 'MISSING  %s\n' "$p"; fi
   done < "$W/00_inputs.txt" | LC_ALL=C sort -k2 > "$W/00_input_hashes.txt"
   find content docs -type f -exec shasum {} + | LC_ALL=C sort -k2 > "$W/00_hashes_repo.txt"                   # 리포 루트에서
   if [ -n "$SNAP" ]; then                                                                                     # 스냅샷 모드만
     (cd "$SNAP" && find . -type f -exec shasum {} + | LC_ALL=C sort -k2) > "$W/00_hashes_snapshot.txt"
   fi   # `[ -n "$SNAP" ] && …` 한 줄로 쓰면 기본 모드에서 블록 전체가 종료 코드 1로 끝난다
   ```
   - **왜 `git status`가 아니라 해시인가**: `git status --porcelain`은 상태 코드만 본다. 검수 시작 전에 이미 수정 중이던 파일(` M path`)을 검수자가 더 고쳐도 코드는 그대로라 대조를 통과한다 (PR #301 Codex 지적). 해시는 추적·미추적·수정 중 파일을 가리지 않고 **내용**을 본다. 스냅샷은 리포 밖이라 `git status`에 아예 안 잡히는데, 같은 해시 목록으로 한 번에 덮는다.
   - 범위를 `content`·`docs`로 좁히는 이유: 검수 도중 메인이 하네스 파일을 고치거나 커밋해도 거짓 경보가 나지 않게 하려는 것이다 (2026-09-28 회귀 테스트에서 실제로 걸렸다). 그러니 **메인도 검수 중에는 `content`·`docs`를 고치지 않는다**.
5. `00_scope.md`를 쓴다:
   ```markdown
   # chapter-audit scope — <id>
   - 대상 루트: <절대경로>          (스냅샷이면: 원 커밋 <sha>)
   - 대상 커밋: <sha>
   - 규모: 기본 | 철저히
   - 스캔 파일: `<root>/content/chapters/<id>/sections/01.mdx`(34) · …
   - 렌더 근거: route/helper import graph=<요약> · registry entry=<위치> · loadIntro=<있음|없음> · body import graph=<요약>
   - 비렌더 제외: <orphan intro·미선별 quiz·미사용 export | 없음>
   - 참고: VERIFIED_FACTS=<경로> · 용어집=<root>/content/glossary.ts · 레거시 원본=<경로|없음> · 선행 챕터=<root>/content/chapters/ · Audience=CLAUDE.md
   - 챕터 퀴즈 선별: <slug 목록 | 전량 | 없음>   (마지막 섹션 페이지의 퀴즈·세션 도식·교차 복습도 스캔 대상이다)
   - 출력 디렉터리: <리포>/_workspace/chapter-audit/<id>/
   - 금지: 스코프 밖 파일(스냅샷 모드에서는 리포의 현행 content/·docs/), gh, git log/show — 정답이 새거나 다른 버전과 섞인다. 챕터·원장 수정 금지.
   ```

## 2단계: 3축 병렬 검수

**실행 모드: 서브에이전트 위임.** 한 메시지에서 Agent 도구를 3번 호출한다 — `name` 없는 단발 실행, `subagent_type`은 에이전트 이름, 백그라운드. 프롬프트는 셋 다 같은 골격이다:

```text
chapter-audit 2단계 — <축> 검수.
스코프: <리포>/_workspace/chapter-audit/<id>/00_scope.md (먼저 읽는다)
출력: <리포>/_workspace/chapter-audit/<id>/01_<agent>_findings.md
형식: <리포>/.claude/skills/chapter-audit/references/finding-format.md
반환: 유형별 지적 수·읽은 파일 수·실패 여부만.
```

완료 알림을 기다린다. **메인은 맡긴 검수를 직접 하지 않는다** — 메인이 끼어들면 축 분리가 무너지고 컨텍스트만 먹는다.

## 3단계: 병합 (메인)

1. 세 파일을 읽는다. 머리의 "읽은 파일"이 스코프 목록보다 적으면 누락으로 기록한다.
2. **중복 병합**: 위치가 겹치고 결함이 같으면 하나로 합친다. 축 표시는 양쪽 다 남긴다 — 두 축이 독립으로 찾았다는 건 확신 신호다. 위치가 같아도 결함이 다르면 따로 둔다 (예: 같은 문장이 모순(C1)이면서 공식 문서와도 다름(F1)).
3. 새 ID `A01…`을 붙이고 원 ID(`F-03`·`C-07`)를 병기해 `02_merged_findings.md`에 쓴다. 각 지적은 `finding-format.md` §3 형식을 그대로 유지한다.
4. **배치 분할**: 12건 이하씩 `b1`·`b2`… 로 나눈다. 검증자는 건마다 원문과 근거를 다시 열어서, 배치가 크면 뒤쪽 건의 검증이 얕아진다. 같은 위치를 공유하는 지적은 같은 배치에 둔다.
   - 부분 재실행이면 새 A뿐 아니라 **내용 또는 출처가 달라진 live A가 하나라도 든 배치 전체**를 재검증 대상으로 표시한다. tombstone은 번호 위치만 차지하고 배치 입력에서는 뺀다. unchanged live A만 든 배치는 기존 판정을 유지한다.

## 4단계: 적대적 검증

**실행 모드: 서브에이전트 위임.** 배치마다 `finding-verifier` 1명, 한 메시지에서 병렬.
규모가 `철저히`면 배치마다 2명을 독립 실행하고 **둘 다 confirmed**인 것만 통과시킨다 (과반 규칙 — 2명의 과반은 2명).
- 출력 파일을 검수자별로 **나눈다** — `03_finding-verifier_<batch>_v1_verdicts.md`·`…_v2_verdicts.md`. 같은 경로를 주면 한쪽이 다른 쪽을 덮어써서 "둘 다" 규칙을 강제할 수 없다 (PR #301 Codex 지적).
- 합산은 메인이 한다: 둘 다 `confirmed` → confirmed · 둘 다 `refuted` → refuted · 한쪽 `confirmed`·다른 쪽 `refuted` → **uncertain**(판정 조건 "검증자 불일치 — 두 사유 한 줄씩") · 한쪽이라도 `uncertain` → uncertain. 불일치를 한쪽으로 몰지 않는 이유는 판단형 지적 원칙과 같다 — 갈린 판단은 사용자에게 넘긴다.
- 부분 재실행에서는 3단계가 표시한 배치의 **live A를 전부** 다시 검증한다. tombstone은 입력에서 제외한다. 같은 배치의 예전 판정 파일은 덮어쓰기 전에 `.v<N>.md`로 남기고, 새 파일이 그 배치의 active verdict가 된다. 일부 live A만 새 판정, 나머지는 묵은 판정인 혼합 배치를 만들지 않는다.

```text
chapter-audit 4단계 — 적대적 검증, 배치 <b2> (A13~A24).
스코프: <리포>/_workspace/chapter-audit/<id>/00_scope.md
입력: <리포>/_workspace/chapter-audit/<id>/02_merged_findings.md 의 live A13~A24 (`상태: tombstone` 제외)
출력: <리포>/_workspace/chapter-audit/<id>/03_finding-verifier_b2_verdicts.md
      (철저히: 같은 배치의 두 호출에 각각 …_b2_v1_verdicts.md · …_b2_v2_verdicts.md — 한 경로를 공유시키지 않는다)
형식: <리포>/.claude/skills/chapter-audit/references/finding-format.md "판정 형식"
```

통과 규칙:
- `상태: tombstone` → 검증하지 않고 판정 집계·보고에서도 제외한다. ID와 폐기 이력은 `02_merged_findings.md`에만 남긴다.
- `confirmed` → 보고서 본표.
- `uncertain` → 보고서 "판단 필요" 표 (판정 조건과 함께).
- `refuted` → 보고서 끝에 **건수와 한 줄 사유를 공개**한다. 제외 수를 숨기면 사용자는 "찾은 게 이것뿐"으로 오해한다.
- 판정 파일에 빠진 ID, 또는 `unverified`(형식 결함으로 판정 불가) → "미검증"으로 따로 표기 (본표에 넣지 않는다). 미검증은 기각이 아니다 — 보고서에 건수를 적고, 해당 축을 다시 돌릴지 사용자에게 묻는다.

## 5단계: 보고 → 멈춤

1. **판정 입력 + 무결성 대조**: 1단계와 같은 명령으로 판정 입력, 리포, 스냅샷 해시 목록을 다시 떠서 비교한다. 세 비교는 **서로 독립으로 전부** 돈다 — 앞의 결과로 뒤를 건너뛰지 않는다 (`&&`로 이으면 앞 비교가 차이를 내는 순간 뒤 비교가 실행되지 않는다 — PR #301 Codex 지적).
   ```bash
   while IFS= read -r p; do
     if [ -f "$p" ]; then shasum "$p"; else printf 'MISSING  %s\n' "$p"; fi
   done < "$W/00_inputs.txt" | LC_ALL=C sort -k2 | diff "$W/00_input_hashes.txt" - ; R0=$?
   find content docs -type f -exec shasum {} + | LC_ALL=C sort -k2 | diff "$W/00_hashes_repo.txt" - ; R1=$?
   R2=0; if [ -n "$SNAP" ]; then (cd "$SNAP" && find . -type f -exec shasum {} + | LC_ALL=C sort -k2) | diff "$W/00_hashes_snapshot.txt" - ; R2=$?; fi
   echo "inputs=$R0 repo=$R1 snapshot=$R2"   # 셋 다 0이어야 통과. diff 출력의 < / > 줄이 바뀐·생긴·사라진 파일이다
   ```
   다르면 멈추고 무엇이 바뀌었는지 보고한다. **되돌리지 않는다** — 되돌림은 사용자 판단이다.
2. `04_report.md`를 쓰고 채팅에는 표로 요약한다.
   - **요약 줄**: 축별 지적 수 → 병합 후 N → confirmed / uncertain / refuted / 미검증. 누락(못 읽은 파일·문서 조회 실패·실패한 에이전트).
   - **묶음 제안** — 이 리포의 선례를 따른다:

     | 묶음 | 선례 | 담는 것 |
     |---|---|---|
     | 문장 교정 | #289 | 규모 `문장`인 confirmed 전부 → 이슈 1개 후보 |
     | 구조 | #290·#291·#292 | 규모 `구조` — 섹션·그림·주제 단위로 이슈 1개씩 후보 |
     | 실측·결정 | #296 | `uncertain`과 규모 `실측` — 건별 후보, 판정 조건 한 줄 |

   - 각 행: 번호 · 위치 · 문제 · 교정 방향 · 축/유형 · 확신도.
   - **묶음 간 선행 조건**: 같은 파일을 고치는 묶음은 문장 교정 → 구조 순서다 (문장 교정 위에 구조 작업을 얹어야 충돌·재작업이 없다 — #290 선행 조건 전례).
   - 끝줄: "언어 품질은 `/chapter-review <id>`로 따로 돈다."
3. **여기서 멈춘다.** 사용자가 등록할 묶음·행을 고른다. 검증을 통과했어도 "어느 자리를 기준으로 맞출지"(C1)나 비중(L5)은 사용자 결정이라서, 자동 등록하면 그 결정을 세션이 대신 내리게 된다.

## 6단계: 등록

고른 묶음마다 `/write-issue`를 부른다 (형식·보드 절차는 그 스킬이 정본).
- 배경: "chapter-audit <날짜> 결과 (대상 커밋 <sha>)" + 자산 경로. 완료 기준: 보고서의 행 단위 체크박스 + 새로 쓴 사실은 `VERIFIED_FACTS` 등재 + 검증 방법.
- 라벨: 콘텐츠 교정은 `content`, 렌더 버그는 `task`.
- 등록 후 `04_report.md`의 해당 행에 이슈 번호를 적는다 — 다음 검수가 "이미 등록됨"을 안다.

## 데이터 전달

| 파일 | 쓰는 쪽 | 읽는 쪽 |
|---|---|---|
| `00_scope.md` · `00_inputs.txt` · `00_input_hashes.txt` | 메인 (1단계) | 모든 에이전트 · 메인 (0단계 재사용 판정) |
| `00_hashes_repo.txt` · `00_hashes_snapshot.txt`(스냅샷 모드) | 메인 (1단계) | 메인 (5단계 무결성 대조) |
| `01_<agent>_findings.md` ×3 | 각 auditor (2단계) | 메인 (3단계) |
| `02_merged_findings.md` | 메인 (3단계) | finding-verifier (4단계) |
| `03_finding-verifier_<batch>[_v1|_v2]_verdicts.md` | 각 verifier (4단계) | 메인 (5단계) |
| `04_report.md` | 메인 (5·6단계) | 사용자 · 다음 검수 (0단계) |

에이전트의 반환 메시지는 건수 요약뿐이다. 지적 본문은 파일로만 오간다 — 메인 컨텍스트를 아끼고, 나중에 판정 과정을 되짚을 수 있게 한다.

## 오류 처리

- **에이전트 유형이 등록되지 않았다** (`Agent type 'fact-auditor' not found` — 정의를 만들거나 받은 직후에 난다. 2026-09-28 실측: 같은 세션에서도 몇 분 뒤 "New agent types are now available" 알림과 함께 등록됐다. 급하지 않으면 그 알림을 기다린다) → 기다릴 수 없으면 `subagent_type: "general-purpose"` + 정의의 `model`을 `model` 인자로 주고, 프롬프트 첫 줄에 "먼저 `.claude/agents/<name>.md`를 읽고 그 본문을 역할 정의로 따른다"를 넣는다. 이 경로에서는 frontmatter의 도구 제한이 걸리지 않으므로 **5단계 무결성 대조가 유일한 안전장치**다 — 생략하지 않는다. 보고서 머리에 "유형 미등록 — 대체 실행"을 적는다.
- **auditor 1명 실패** → 한 번 다시 실행한다. 또 실패하면 그 축 없이 진행하고 보고서 머리에 "<축> 누락"을 적는다.
- **사용량 한도·인증 만료·권한 거부** → 다시 실행하지 않는다 (결과가 같고 한도만 먹는다). 부분 산출물을 직접 열어 어디까지 됐는지 확인하고, 누락을 `04_report.md`에 적은 뒤 보고한다. 한도면 풀리는 시각도 알린다.
- **AWS 문서 조회 불가** → fact-auditor가 원장만으로 판정하고 나머지를 "문서 미확인"으로 표시한다. 검증자도 그 건을 uncertain으로 둔다. 보고서에 "사실 축 부분 수행"을 적는다.
- **verifier 실패** → 그 배치만 한 번 다시 실행한다. 또 실패하면 그 배치 지적은 "미검증"으로 보고서 별표에 둔다.
- **메인은 에이전트의 판단을 추측해 채우지 않는다.** 누락은 누락으로 적는다 — 추측으로 메우면 판정 기록을 위조하는 셈이다.
- 에이전트의 절반 이상이 실패하면 사용자에게 계속할지 묻는다.

## 규모

- **기본**: auditor 3 + verifier 배치 수(지적 수에 따라 보통 2~4).
- **철저히**: verifier를 배치마다 2명으로. auditor 수는 늘리지 않는다 — 축을 쪼개면 병합 비용이 탐색 이득보다 커진다.

## 테스트 시나리오

### 정상 흐름 — 회귀 테스트 (#300)

- 입력: `ch3-1 --root <scratchpad>/snap-4f6ac7b` (첫 교정 PR #294 직전 develop — #288·#289 생성 시각과 일치).
- 기대: 1~5단계 산출물이 모두 생기고, 5단계에서 멈춘다. 무결성 대조 통과.
- 정답: #288~#292 완료 기준 중 정적 검수로 잡을 수 있는 39건 (#288 렌더 버그 2건은 세 축 밖이라 제외).
- 비교: 같은 스냅샷에 스킬 없는 단일 에이전트("이 챕터를 종합 검수해 결함을 찾아라")를 돌린 기준 실행.
- **정답 파일은 에이전트가 쓰는 디렉터리 밖에 둔다.** 2026-09-28 실행에서는 기준 실행의 출력 디렉터리에 정답을 둬서, 기준 실행이 "열지 않았다"고 자가 보고했을 뿐 확인할 수 없었다.
- 결과 (2026-09-28, 채점자는 목록 출처를 모른 채 같은 프롬프트로 채점):

  | 실행 | hit · partial · miss / 39 | 정답 밖 지적 (실제·의심·오지적) |
  |---|---|---|
  | 기준 실행 (단일 opus) | 20 · 3 · 16 | 16 (11·4·1) |
  | 하네스 v1 (learner sonnet) — 검증 후 | 19 · 5 · 15 | — |
  | 하네스 v2 (learner opus, 검증자 보정) — 검증 후 | **27 · 6 · 6** | 14 (9·5·0) |

  - v1에서 learner(sonnet)가 5건에 그쳤고, 검증자가 판단형 지적 3건을 "다르게도 읽힌다"로 기각했는데 셋 다 정답이었다 → learner opus 상향 + 검증자 원칙 보정 (정의 파일 주석·본문에 기록).
  - **한계**: 유형표(`finding-format.md`)와 에이전트 원칙은 이 정답을 만든 검수에서 교훈을 뽑았다. 챕터 본문 낱말은 걸러냈지만("반면" 누출을 찾아 지웠다) 구조 패턴("N번째 항목을 센다" 등)은 남겼으므로, 이 수치는 **설계 의도대로 과거 유형을 잡는가의 상한**이다. 일반화는 다른 챕터 실전에서 따로 잰다.
  - 둘 다 놓친 것: 설명 공백 2건(JWT 검증 주체·커스텀 스코프 정의 위치), 신뢰 정책 산문, 사람과 판정이 갈린 사실 3건(기준 실행은 셋을 "정상"으로 판정).

### 오류 흐름 — 문서 조회 도구가 없는 머신

- AWS Knowledge MCP가 없고 WebFetch도 막힌 환경에서 fact-auditor가 원장만으로 판정한다.
- 기대: fact 파일 머리에 "조회 불가", 원장 밖 주장은 확신도 `낮음`·"문서 미확인". 검증자는 그 건을 uncertain으로. 보고서에 "사실 축 부분 수행". 기억으로 메운 F1이 본표에 없어야 한다.

### 오류 흐름 — 검수자가 챕터 파일을 건드림

- 에이전트가 규칙을 어기고 `sections/*.mdx`를 수정했다.
- 기대: 5단계 무결성 대조에서 차이가 잡혀 보고서 작성 전에 멈추고, 바뀐 파일을 보고한다. 되돌리지 않는다.
