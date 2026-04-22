# Phase 3 — 공개 페이지 + 익명 RSVP + Realtime + OG

Event CRUD 까지 끝낸 상태 (`.claude/docs/phase2-event-crud.md`) 에서 이어집니다.

이번에 얻는 것: **`/e/[id]` 공개 페이지 · 익명 RSVP · 참석자 수 실시간 카운트 · 카톡/트위터 링크 프리뷰**.

---

## Claude에게 맡기기

채팅창에 복붙:

> 이벤트 공개 페이지랑 RSVP 붙여줘.
> - `rsvps` 테이블 마이그레이션 (id: bigserial / event_id FK events cascade / name / email / created_at / unique(event_id,email))
> - RLS 2개: public read, public insert. 그리고 `supabase_realtime` publication 에 rsvps 추가
> - `/e/[id]` 공개 페이지 — 제목·일시·장소·주최·설명 + 참석자 수 + RSVP 폼 (로그인 불필요)
> - RSVP 폼은 Server Action, 중복 이메일이면 에러, 성공 시 "RSVP 완료" 표시
> - 참석자 수는 Supabase Realtime 으로 다른 사람이 RSVP 하면 즉시 +1
> - `generateMetadata` 로 OG/Twitter 메타태그
> - 홈 `/` 랑 `/my` 의 이벤트 카드를 `/e/[id]` 로 링크 연결
> - 이벤트 없으면 404

Claude가 하는 일:

1. `supabase/migrations/<ts>_rsvps.sql` 작성
2. `supabase db push --yes` 로 원격 적용
3. 라우트:
   ```
   app/e/[id]/{page,actions,RsvpForm,LiveCount}.tsx
   app/page.tsx        (업데이트 — 카드 Link)
   app/my/page.tsx     (업데이트 — 카드 Link)
   ```

---

## 브라우저에서 확인

1. `/` 홈 카드 클릭 → `/e/[id]` 로 이동, "지금까지 참석 **0 명**" + RSVP 폼
2. **로그아웃 상태**로 이름·이메일 입력 → **RSVP 하기** → 카운트 1 + "RSVP 완료!" 박스
3. 같은 이메일 재제출 → 빨간 에러 "이미 이 이메일로 RSVP 하셨습니다"
4. 탭 2개 열기 → 한쪽에서 RSVP → **다른 쪽 숫자가 즉시 +1** (Realtime)
5. 없는 id `/e/xxxxxxxxxx` → 404
6. 이벤트 URL 을 https://www.opengraph.xyz 에 붙여넣기 → 제목·설명 프리뷰 (배포 후)
7. Supabase 대시보드 → Table Editor → `rsvps` 1 row

---

## 지금은 의도된 것

- 주최자가 자기 이벤트의 **RSVP 명단** 보기는 없음. `/my` 는 여전히 제목/일시만.
- 커버 이미지 없음. OG 프리뷰에 썸네일도 아직 안 뜸 — 다음 Phase 에서 붙여짐.

---

## 커밋

Claude 한테:

> Phase 3 작업 커밋 + push 해줘

push 되는 순간 Vercel 이 자동 빌드 시작 — 대시보드 Deployments 탭에 새 배포 찍힘. 1-2분 뒤 프로덕션 URL 에 Phase 3 기능 반영됨.

---

**다음:** [`.claude/docs/phase4-image-demo.md`](./phase4-image-demo.md) — Storage 버킷 + `/new` 이미지 업로드 + `/e/[id]` 커버 + OG 썸네일 + 최종 시연
