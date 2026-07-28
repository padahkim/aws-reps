# drills-src — 드릴 퀴즈 문항 원본 (정본)

DVA-C02 시험 문형을 본뜬 문항 데이터 11과목. **이 디렉터리가 문항의 정본이다** —
업스트림 `aws-cloud-drills` 리포에서 2026-07-28(#93) 이관했고, 업스트림 데이터는
그 시점부터 동결이다. 문항 수정은 여기 JSON에 하고 재임포트한다:

```bash
node scripts/import-drills.ts [subject ...]   # 무인자 = 매핑된 전 과목
```

- 스키마·변환 규칙: `scripts/import-drills.ts` 헤더 주석 참조
- 출력(생성물): `content/chapters/<id>/drills.ts` — 손편집 금지
- 과목 → 챕터 매핑: 같은 스크립트의 `SUBJECT_TO_CHAPTER` (새 챕터 변환 시 한 줄 추가)
- 언어 품질 기준: `.claude/skills/chapter-review/SKILL.md` (패턴 A·용어 B)
