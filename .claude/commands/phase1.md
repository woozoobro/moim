---
description: Phase 1 — Auth (회원가입/로그인/로그아웃 + 세션 persistence)
---

`.claude/docs/phase1-auth.md` 의 "Claude에게 맡기기" 섹션 프롬프트를 그대로 실행해줘.

실행 규칙:
- Server Actions + `useActionState` 로 에러 UX
- 세션 확인은 Server Component 의 `supabase.auth.getUser()`
- 로그인 보호는 **inline `redirect()`** (middleware 금지 — Next.js 16)
- `INITIAL` 상수는 `"use server"` 파일 아니라 **client form 컴포넌트**에
- 폼/카드는 shadcn `Card` + `Input` + `Label` + `Button`

완료 후 브라우저에서 "브라우저에서 확인" 체크리스트 돌려볼 수 있게 요약 안내. **다음 단계는 `/phase2`**.
