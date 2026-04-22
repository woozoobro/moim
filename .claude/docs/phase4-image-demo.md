# Phase 4 — 커버 이미지 + 최종 데모

`/e/[id]` + RSVP + Realtime 까지 끝낸 상태 (`.claude/docs/phase3-public-event-rsvp.md`) 에서 이어집니다.

이번에 얻는 것: **이벤트 커버 이미지 업로드 · 상세 페이지 썸네일 · 카톡/트위터 링크 프리뷰 썸네일까지**.

---

## Claude에게 맡기기

채팅창에 복붙:

> 커버 이미지 붙이고 마무리하자.
> - Supabase Storage 에 `event-covers` 버킷 (public) + 정책 2개 (public read, authenticated insert) 마이그레이션으로 생성
> - `/new` 폼에 커버 이미지 파일 input 추가 (선택)
> - `createEvent` 액션에서 파일 업로드 → public URL 을 `image_url` 컬럼에 저장
> - `/e/[id]` 상단에 커버 이미지 렌더
> - `generateMetadata` OG/Twitter `images` 배열에 커버 URL 포함. 이미지 있으면 twitter card 는 `summary_large_image`
> - `next.config.ts` 의 `experimental.serverActions.bodySizeLimit` 을 `'10mb'` 로 올려줘 (기본 1MB 라 이미지 업로드 중 Server Action 이 막힘)

Claude가 하는 일:

1. `supabase/migrations/<ts>_event_covers.sql` 작성
2. `supabase db push --yes` 로 원격 적용
3. 파일:
   ```
   next.config.ts             (업데이트 — serverActions.bodySizeLimit)
   app/new/NewEventForm.tsx   (업데이트 — file input)
   app/new/actions.ts         (업데이트 — Storage 업로드)
   app/e/[id]/page.tsx        (업데이트 — <img> + OG images)
   ```

---

## 브라우저에서 확인

1. 로그인 후 `/new` → 폼 + **커버 이미지 첨부** → 제출 → `/my` 이동
2. `/my` 카드 클릭 → `/e/[id]` 상단에 이미지 렌더
3. Supabase 대시보드 → Storage → `event-covers` 버킷 → `<uid>/<eventId>.<ext>` 객체 확인
4. 이미지 없이 만든 이벤트는 상세 페이지에 이미지 없이 뜸 (기존 동작 유지)
5. **배포 후** — 이벤트 URL 을 https://www.opengraph.xyz 에 붙여넣기 → 제목·설명·**썸네일**까지 프리뷰
6. 카톡에 URL 붙여도 썸네일 뜸

---

## 지금은 의도된 것

- 홈 `/` 와 `/my` 카드에는 **썸네일 안 나옴** — 상세/OG 에서만 보임. 리스트 레이아웃 건드리는 건 이번 범위 밖
- 이벤트 수정 / 이미지 교체 UI 없음. 업로드한 이미지는 그대로 유지

---

## 마무리 — 데모 체크리스트

배포까지 끝나면 아래 5개를 직접 시연:

1. 본인 계정으로 로그인
2. `/new` 에서 이벤트 생성 (커버 이미지 포함)
3. 배포된 `/e/[id]` URL 을 **카톡/슬랙에 붙여** 썸네일 프리뷰 확인
4. 옆자리에게 링크 공유 → 옆자리가 **로그아웃 상태**로 RSVP → 내 화면 카운트 +1 (Realtime)
5. 로그아웃해도 공개 페이지는 그대로 보이고, 남의 이벤트는 수정 불가

끝!

---

## 커밋

Claude 한테:

> Phase 4 최종 커밋 + push 해줘

push → Vercel 자동 빌드 → 1-2분 뒤 프로덕션에 커버 이미지/OG 썸네일까지 반영. 이 URL 로 데모 시연.

---

**확장 아이디어 (이후 개별로):** `.claude/docs/extensions/` 에 정리. 이벤트 수정/삭제, 주최자 RSVP 명단, 카카오 OAuth, Resend 이메일, ICS 캘린더 등.
