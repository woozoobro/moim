---
description: Phase 4 — Storage 버킷 + 커버 이미지 업로드 + OG 썸네일
---

`.claude/docs/phase4-image-demo.md` 의 "Claude에게 맡기기" 섹션 프롬프트를 그대로 실행해줘.

실행 규칙:
- 세 번째 마이그레이션: Storage 버킷 `event-covers` (public) + 정책 2개 (public read, authenticated insert). `insert into storage.buckets ...` + `create policy ... on storage.objects ...`. `supabase db push --yes`
- `/new` 폼에 `<input type="file" accept="image/*">` 추가 (선택 입력)
- `createEvent` 액션에서 `eventId = nanoid(10)` 먼저 생성 → Storage 업로드 경로 `event-covers/${user.id}/${eventId}.${ext}` → `getPublicUrl` 로 URL 얻기 → events 에 `image_url` 저장
- `/e/[id]` 상단에 커버 이미지 렌더 (있을 때만). `aspect-video object-cover`
- `generateMetadata` `openGraph.images` 배열 + `twitter.card="summary_large_image"` (이미지 있을 때)
- **`next.config.ts` 의 `experimental.serverActions.bodySizeLimit` 을 `"10mb"` 로 필수 업데이트** — 기본 1MB 면 이미지 업로드 시 "unexpected response from server" 에러

완료 후 데모 시연 체크리스트 (카톡 링크 프리뷰 썸네일 등) 안내. 마지막으로 `/commit` 실행 → push 도 해달라고 요청해서 자동 배포 트리거.
