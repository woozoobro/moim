---
description: Phase 3 — 공개 이벤트 페이지 + 익명 RSVP + Realtime LiveCount + OG 메타
---

`.claude/docs/phase3-public-event-rsvp.md` 의 "Claude에게 맡기기" 섹션 프롬프트를 그대로 실행해줘.

실행 규칙:
- 두 번째 마이그레이션: `rsvps` 테이블 + RLS (public read / public insert) + `supabase_realtime` publication 에 rsvps 추가. `supabase db push --yes`
- `/e/[id]` — **익명 RSVP** (로그인 불필요). 중복 이메일은 유니크 제약으로 차단 → 에러 "이미 이 이메일로 RSVP 하셨습니다"
- `LiveCount` 는 client component, `postgres_changes` 구독. **`<LiveCount key={initialCount} ...>`** 로 revalidatePath 후 더블 카운트 방지
- `generateMetadata` 로 OG/Twitter 텍스트 메타 (이미지는 Phase 4 에서)
- 홈 `/` · `/my` 카드를 `<Link href={`/e/${e.id}`}>` 로 감싸서 상세 연결
- 없는 id 는 `notFound()` 로 404

완료 후 "탭 2개 열고 한쪽에서 RSVP → 다른 쪽 +1" 체크 안내. **다음 단계는 `/phase4`**.
