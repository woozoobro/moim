# Phase 1 — Auth

디자인 셋업까지 끝낸 상태 (`.claude/docs/design-setup.md`) 에서 이어집니다.

이번에 얻는 것: **회원가입 · 로그인 · 로그아웃 · 세션 유지**.

---

## Claude에게 맡기기

채팅창에 복붙:

> Supabase 연결해뒀어. 이제 Auth 붙일거야.
> - `/signup`, `/login` 페이지 + `/logout` Server Action
> - email/password 방식
> - 폼 에러는 `useActionState`로 깔끔하게
> - 세션 읽기는 `lib/supabase/server.ts` 래퍼 재사용
> - 이미 로그인되어 있으면 `/login`, `/signup` 접근 시 `/` 로 튕기기
> - 루트 레이아웃 헤더에 로그인 상태(이메일 + 로그아웃 버튼) 표시, 비로그인이면 로그인/회원가입 링크

Claude가 만드는 파일:

```
app/
├── layout.tsx          (업데이트 — 헤더에 로그인 상태)
├── page.tsx            (업데이트 — 환영 메시지)
├── login/{page,LoginForm,actions}.tsx
├── signup/{page,SignupForm,actions}.tsx
└── logout/actions.ts
```

---

## 브라우저에서 확인

http://localhost:3000 접속.

1. 우상단에 **로그인 · 회원가입** 링크 보임
2. `/signup` → 이메일/비번 입력 → 가입 후 `/` 로, 헤더에 내 이메일 표시
3. **로그아웃** 클릭 → `/login` 으로
4. `/login` → 방금 만든 계정으로 로그인 → `/` 복귀
5. 빈 필드로 제출 → 폼 아래 빨간 에러

Supabase 대시보드 → **Authentication → Users** 에서 방금 만든 계정 확인 가능.

---

## 커밋

Claude 한테:

> Phase 1 작업 커밋 + push 해줘

---

**다음:** [`.claude/docs/phase2-event-crud.md`](./phase2-event-crud.md) — 첫 테이블 + 이벤트 만들기/목록/홈 피드
