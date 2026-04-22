---
description: Phase 2 — 이벤트 CRUD (events 마이그레이션 + `/new` · `/my` · 홈 피드)
---

`.claude/docs/phase2-event-crud.md` 의 "Claude에게 맡기기" 섹션 프롬프트를 그대로 실행해줘.

실행 규칙:
- 첫 마이그레이션: `events` 테이블 + RLS 4개 (public read / authenticated insert / owner update / owner delete). `supabase db push --yes` 로 원격 반영
- id 는 `nanoid(10)` — server action 에서 생성
- params/searchParams 는 **Promise** (Next.js 16)
- 폼은 shadcn `Card` + `Input` + `Textarea` + `Button`. 에러는 `text-destructive`

완료 후 브라우저 체크리스트 안내. **다음 단계는 `/phase3`**. 프로덕션 배포 원하면 언제든 `/deploy-vercel` 도 가능.
