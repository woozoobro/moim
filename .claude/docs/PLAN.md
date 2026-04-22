# moim-moim — 프로젝트 개요 (PLAN)

> **당신이 만들 프로젝트:** Luma(lu.ma)의 핵심 경험 — 이벤트 페이지 + RSVP — 을 최소 구성으로 재현한 배포된 풀스택 앱. Next.js 16 + Supabase 조합.

## 1. 완성 기준

완성 시 당신은 본인 Vercel URL 로 다음을 **시연 가능**:

1. 본인 계정으로 로그인해 이벤트를 **직접 만들 수 있다**
2. 만든 이벤트 URL을 **카톡에 붙여넣으면 썸네일 프리뷰**가 뜬다
3. 옆자리 동료가 RSVP하면 **내 화면 참석자 수가 즉시 올라간다**
4. 이벤트 커버 이미지를 **내가 올린 사진**으로 바꿀 수 있다
5. 로그아웃해도 **이벤트 공개 페이지는 보이고**, 남의 이벤트는 **수정 불가**

네 축으로 묶이는 기술: Auth/RLS · CRUD + 배포 · Realtime/OG · 이미지 업로드.


## 2. 진행 순서

프로젝트 번들 압축 푼 폴더에서 `cd` · `claude` 실행 후, 아래 슬래시 커맨드를 순서대로:

**셋업 (Phase 0)**

1. `/setup-nextjs` — Next.js 16 프로젝트 생성 + 백그라운드 `npm run dev`
2. `/setup-github` — GitHub 원격 repo + 첫 push
3. `/setup-supabase` — Supabase 프로젝트 연결 + `.env.local` + `lib/supabase/*`
4. `/setup-design` — shadcn/ui + 기본 컴포넌트 5개

**기능 구현**

5. `/phase1` — Auth (`/signup`, `/login`, `/logout` + 세션)
6. `/phase2` — 이벤트 CRUD (events 마이그레이션 + `/new` · `/my` · 홈 피드)
7. `/phase3` — 공개 이벤트 페이지 + 익명 RSVP + Realtime LiveCount + OG 메타
8. `/phase4` — 커버 이미지 업로드 + Storage 버킷 + OG 썸네일

**배포 (원하는 시점에 1회)**

- `/deploy-vercel` — Vercel 첫 프로덕션 배포 + `vercel git connect`. **한 번 실행 후엔 `git push` 만 해도 자동 재배포**. phase 순서와 독립적 — 로컬에서 앱이 돌고 있는 아무 시점에나 실행 가능. 수업 흐름상 `/phase2` 끝나고 기본 CRUD 돌아가는 시점 추천.

각 단계 끝엔 `/commit` 으로 변경 저장 (또는 "이번 작업 커밋 + push 해줘" 자연어 프롬프트로 push 까지 한 번에).

각 커맨드의 세부 흐름은 대응 문서 참고: `.claude/docs/{nextjs,git,supabase,design}-setup.md` · `.claude/docs/phase{1,2,3,4}-*.md` · `.claude/docs/deploy-vercel.md`.


## 3. 기술 스택

| 레이어 | 선택                          | 비고                                                          |
| ------ | ----------------------------- | ------------------------------------------------------------- |
| 프레임워크 | Next.js **16.2.4** (App Router) | ⚠️ v14/15와 **깨지는 지점 4가지** — 4장 참고                   |
| 런타임 | React 19 + Server Components  | Server Actions로 모든 mutation                                |
| DB/Auth | Supabase (Postgres + Auth)    | Email/Password만. Confirm email **off**                       |
| 파일  | Supabase Storage              | `event-covers` 버킷, public read                              |
| 실시간 | Supabase Realtime             | `rsvps` 테이블 INSERT 구독                                    |
| 배포  | Vercel                        | 원하는 시점에 첫 배포 (`/deploy-vercel`) + `vercel git connect` 로 `git push` → 자동 배포 |
| 스타일 | Tailwind CSS v4               | create-next-app 기본 셋업                                     |
| 디자인 시스템 | shadcn/ui (Base UI 기반)   | Phase 1 전에 미리 깔아두고 이후 폼/카드 재사용. `asChild` 없음 — `render={<Link />}` + `nativeButton={false}` 패턴 |
| 버전관리 | GitHub (+ `gh` CLI 권장)    | 각 Phase 끝 커밋 push → `/deploy-vercel` 이후엔 auto-deploy. `gh` 는 첫 repo 생성 자동화 용 (없으면 브라우저로 repo 만들기, `.claude/docs/git-setup.md` 의 Fallback 섹션) |

**이메일, OAuth, Stripe, Resend — 전부 out of scope.** 확장 아이디어는 `.claude/docs/extensions/` 예정.

## 4. Next.js 16 주의사항 (⚠️ 필독)

v14/15 튜토리얼을 구글링하면 100% 걸리는 지점. 각 Phase에서 처음 마주치는 순간 **템플릿 스니펫 복붙**으로 해결.

### 4.1 `params` / `searchParams` 가 Promise

```tsx
// ❌ v15 스타일 — v16에서 [object Promise] 출력됨
export default function Page({ params }: { params: { id: string } }) {
  return <EventDetail id={params.id} />
}

// ✅ v16
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EventDetail id={id} />
}
```

**적용 지점:** `/e/[id]/page.tsx`, `generateMetadata`, 그 외 모든 dynamic route.

### 4.2 `cookies()` / `headers()` 가 async

```tsx
// ✅ v16
import { cookies } from 'next/headers'
const store = await cookies()            // ← await 필수
const token = store.get('sb-access')?.value
```

Supabase SSR 헬퍼 감싸는 코드도 `await cookies()` 기반으로 재작성. 이 프로젝트의 `lib/supabase/server.ts`가 검증된 래퍼 — 그대로 복붙 템플릿으로 사용.

### 4.3 `useFormState` → `useActionState` 로 rename

```tsx
// ❌ React 18/ Next 14
import { useFormState } from 'react-dom'

// ✅ React 19 / Next 16
import { useActionState } from 'react'
```

Phase 1 로그인/회원가입 폼, Phase 3 RSVP 폼, Phase 4 `/new` 커버 업로드 폼에서 사용.

### 4.4 `"use server"` 파일은 **async function만** export 가능

`useActionState`와 짝으로 자주 걸리는 함정. 초기 상태 객체를 `actions.ts` 에 두면 런타임 에러.

```ts
// ❌ "A 'use server' file can only export async functions, found object."
"use server";

export const INITIAL_STATE = { error: null };   // ← 객체 export 금지
export async function login(prev, formData) { ... }
```

```ts
// ✅ actions.ts — async function + type만
"use server";

export type LoginState = { error: string | null };
export async function login(prev: LoginState, formData: FormData): Promise<LoginState> { ... }
```

```tsx
// ✅ LoginForm.tsx (client) — 초기값은 여기서 선언
"use client";

import { login, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, INITIAL);
  ...
}
```

**기억법:** `"use server"` 파일 = 액션 "공장". 공장 문 앞에선 함수만 주고 받음. 상수·객체·클래스는 반입 불가.

### 4.5 Server Action 기본 **body size 1MB** — 파일 업로드면 확장 필요

Server Action 에 이미지를 보낼 때 1MB 를 넘으면 에러:

> An unexpected response was received from the server.

해결: `next.config.ts` 에 다음 추가 (Phase 4 에서 커버 이미지 업로드 붙일 때 같이).

```ts
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};
```

**배포 환경 추가 제약:** Vercel Serverless function 요청 바디 한계는 **4.5MB**. Next.js 쪽 `bodySizeLimit` 을 10mb 로 늘려도 Vercel 이 먼저 자름. "아이폰 사진 원본 말고 스크린샷 정도" 로 생각하면 안전. 확실히 넘는 경우 클라이언트 업로드(브라우저 → Supabase Storage 직접) 로 우회해야 하는데 이건 이 프로젝트 범위 밖.

### 4.6 의도적으로 **사용하지 않을** 기능들

| 기능 | 이유 |
| --- | --- |
| `cacheComponents: true` (use cache directive) | 범위 밖. 구 모델(`revalidatePath`)로 통일 |
| `middleware.ts` → `proxy` 마이그레이션 | Auth 게이트를 **미들웨어 대신 서버 컴포넌트에서 `redirect()`** 로 처리. 개념 하나 덜어냄 |
| Turbopack 설정 | 기본값이니 건들 필요 없음 |

## 5. 기능 스펙 (MVP)

### 5.1 인증 (Phase 1)

- `GET /signup`, `GET /login` — 이메일/비밀번호 폼
- `GET /logout` (server action)
- Server Action + `useActionState` 로 에러 UX
- 세션 persistence 검증 — Server Component에서 `supabase.auth.getUser()` 로 현재 사용자 읽어 헤더에 표시

### 5.2 이벤트 CRUD (Phase 2, 주최자 측)

- `GET /new` — 이벤트 생성 폼 (로그인 필수 → 아니면 `redirect('/login')`)
- `GET /my` — 내가 만든 이벤트 목록
- `GET /` — 홈. 공개 이벤트 피드 (시간 순, 간단 목록)
- 첫 마이그레이션: `events` 테이블 + RLS (public read / authenticated insert / owner-only update·delete)

### 5.3 공개 이벤트 페이지 + RSVP (Phase 3, 게스트 측)

- `GET /e/[id]` — 이벤트 상세
  - 제목, 일시, 장소, 설명, 주최자
  - 현재 RSVP 수 (SSR) + 실시간 증가 카운터
  - RSVP 폼 (이름 + 이메일, **로그인 불필요**)
  - **OG 메타태그** — Twitter/Facebook/KakaoTalk 프리뷰
- 두 번째 마이그레이션: `rsvps` 테이블 + RLS + realtime publication

### 5.4 이미지 업로드 (Phase 4)

- Supabase Storage 버킷 (`event-covers`) 생성
- `/new` 폼에 cover image 업로드 추가
- `/e/[id]` 최상단에 커버 이미지 렌더
- OG `images` 배열에 이미지 URL 포함 (카톡 프리뷰에 썸네일)

### 5.5 비즈니스 규칙

- RSVP는 `(event_id, email)` 유니크 — 중복 신청 차단
- 본인 이벤트만 수정/삭제 가능 (RLS)
- 이벤트 삭제 시 RSVP는 CASCADE

## 6. 데이터 모델

```sql
create table events (
  id           text primary key,              -- nanoid
  owner_id     uuid references auth.users(id) on delete cascade not null,
  title        text not null,
  description  text,
  starts_at    timestamptz not null,
  location     text,
  host_name    text not null,
  image_url    text,                           -- Supabase Storage path
  created_at   timestamptz default now()
);
create index on events (starts_at);
create index on events (owner_id);

create table rsvps (
  id          bigserial primary key,
  event_id    text references events(id) on delete cascade not null,
  name        text not null,
  email       text not null,
  created_at  timestamptz default now(),
  unique (event_id, email)
);
create index on rsvps (event_id);
```

Phase 2에서 events만 먼저 생성, Phase 3에서 rsvps + realtime 추가. 두 개의 별도 마이그레이션 파일로.

## 7. RLS 정책

```sql
-- events (Phase 2)
alter table events enable row level security;

create policy "events_public_read"
  on events for select using (true);

create policy "events_authenticated_insert"
  on events for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "events_owner_update"
  on events for update
  to authenticated
  using  (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "events_owner_delete"
  on events for delete
  to authenticated
  using (owner_id = auth.uid());

-- rsvps (Phase 3)
alter table rsvps enable row level security;

create policy "rsvps_public_read"
  on rsvps for select using (true);

create policy "rsvps_public_insert"
  on rsvps for insert with check (true);

alter publication supabase_realtime add table rsvps;
```
