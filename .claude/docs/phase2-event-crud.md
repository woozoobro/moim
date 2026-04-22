# Phase 2 — 이벤트 CRUD

Auth까지 끝낸 상태 (`.claude/docs/phase1-auth.md`) 에서 이어집니다.

이번에 얻는 것: **이벤트 생성 (`/new`) · 내 이벤트 목록 (`/my`) · 홈 공개 피드 (`/`)** + 첫 마이그레이션.

---

## Claude에게 맡기기

채팅창에 복붙:

> 이벤트 CRUD 기능 붙여줘.
> - `events` 테이블 마이그레이션 (id: text nanoid / owner_id: auth.users FK / title, description, starts_at, location, host_name, image_url(nullable), created_at)
> - RLS 4개: public read, authenticated insert with owner 체크, owner-only update/delete
> - `/new` — 이벤트 생성 폼 (로그인 필수, 아니면 `/login` 리다이렉트)
> - `/my` — 내가 만든 이벤트 목록
> - 홈 `/` — 전체 이벤트 공개 피드 (시간순)
> - 헤더에 "새 이벤트", "내 이벤트" 링크 추가
> - `nanoid` 패키지 설치

Claude가 하는 일:

1. `npm i nanoid`
2. `supabase/migrations/<ts>_events.sql` 작성
3. `supabase db push --yes` 로 원격 적용
4. 라우트 + 레이아웃:
   ```
   app/new/{page,NewEventForm,actions}.tsx
   app/my/page.tsx
   app/page.tsx        (업데이트 — 공개 피드)
   app/layout.tsx      (업데이트 — 새 이벤트/내 이벤트 네비)
   ```

---

## 브라우저에서 확인

1. **로그아웃 상태**에서 `/new` → `/login` 으로 튕김
2. 로그인 후 `/new` → 폼 입력 (제목 · 주최자 · 일시 필수) → **이벤트 만들기** → `/my` 자동 이동, 카드 1개 등장
3. `/` 홈 → **다가오는 이벤트** 섹션에 같은 이벤트 노출
4. 빈 제목으로 제출 → 빨간 에러
5. Supabase 대시보드 → Table Editor → `events` 테이블에 1 row

---

## 지금은 의도된 것

`/my` 와 `/` 의 이벤트 카드가 **클릭 안 됨**. 공개 상세 페이지 (`/e/[id]`) 는 다음 Phase에서 만들면서 링크 연결됨. 버그 아님.

---

## 커밋

Claude 한테:

> Phase 2 작업 커밋 + push 해줘

---

**다음:** [`.claude/docs/deploy-vercel.md`](./deploy-vercel.md) — Vercel CLI 로 첫 배포 + GitHub 연결. 이벤트 만들기까지 되는 앱이 공개 URL 로 올라가고, 이 이후부턴 **`git push` 만 해도 자동 배포**.
