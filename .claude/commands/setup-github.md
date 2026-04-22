---
description: GitHub 원격 저장소 생성 + 첫 push
---

## 1. 사전 확인

- `gh --version` → `gh` CLI 설치 여부
  - 없으면 `.claude/docs/git-setup.md` §1 로 설치 안내 (`brew install gh` / `scoop install gh` / `winget install --id GitHub.cli`). 설치 싫다고 하면 §"Fallback — `gh` 없이 하려면" 경로로 분기 (브라우저에서 repo 먼저 만들고 remote URL 받기)
- `gh auth status` → GitHub 인증 여부
  - 인증 안 돼 있으면 사용자에게 채팅창에 **직접** `! gh auth login` 치라고 안내 (stdin 대화형이라 Claude 가 대신 실행 불가 — `.claude/docs/git-setup.md` §2 의 브라우저 인증 흐름 참고). 완료했다고 하면 `gh auth status` 로 재확인

## 2. 실행

둘 다 통과 → `.claude/docs/git-setup.md` §3 "Claude에게 맡기기" 섹션 그대로 실행.

완료 후 **다음 단계는 `/setup-supabase`** 안내.
