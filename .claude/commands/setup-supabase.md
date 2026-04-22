---
description: Supabase 프로젝트 생성 + Next.js 연결 (org · project · .env.local · lib/supabase/*)
---

## 1. 사전 확인

- `supabase --version` → Supabase CLI 설치 여부
  - 없으면 `.claude/docs/supabase-setup.md` §1 로 설치 안내 (`brew install supabase/tap/supabase` / Scoop / `npx supabase` 백업). 설치 끝나면 재확인
- `supabase projects list` → 인증 여부 확인 (비인증이면 에러남)
  - 에러 뜨면 사용자에게 채팅창에 **직접** `! supabase login` 치라고 안내 (stdin 대화형이라 Claude 가 대신 실행 불가 — `.claude/docs/supabase-setup.md` §2 참고). 완료했다고 하면 `supabase projects list` 로 재확인

## 2. 실행

둘 다 통과 → `.claude/docs/supabase-setup.md` §3 "Claude에게 프로젝트 셋업 맡기기" 섹션의 프롬프트 그대로 실행.

완료 시 **다음 단계는 `/setup-design`** 안내.
