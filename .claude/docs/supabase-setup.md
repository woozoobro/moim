# Supabase × Claude Code 셋업 가이드

GitHub 셋업까지 끝낸 상태 (`.claude/docs/git-setup.md`) 에서 이어집니다.

Next.js 프로젝트에 Supabase 붙이는 전체 흐름. 직접 타이핑하는 건 **단 2번** — CLI 설치랑 로그인. 나머지는 전부 Claude Code에 맡깁니다!

## 준비물

- Supabase 회원가입 완료 (GitHub 로그인 OK)
- Warp + Claude Code 실행 중
- Next.js 프로젝트 폴더에서 Claude Code 열려있음 (이미 GitHub 원격에 push 된 상태)

---

## 1. Supabase CLI 설치

**macOS**

```bash
brew install supabase/tap/supabase
```

**Windows (Scoop)**

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**공통 백업** — 위가 안 될 때 Node만 있으면

```bash
npx supabase --version
```
이후 모든 명령을 `npx supabase ...` 형태로. 느리지만 설치 과정 생략.

설치 확인:

```bash
supabase --version
```
→ 버전 숫자 뜨면 OK.

---

## 2. 로그인 (브라우저 딱 한 번 뜸)

Claude Code 채팅창에:

```
! supabase login
```

`!` 로 시작하면 그 줄은 Claude가 아니라 **터미널에서 직접 실행**돼요. 브라우저가 한 번 뜨고 토큰 받으면 이후엔 CLI에서 자동 인증.

이후 전부 Claude Code 안에서 마무리됩니다.

---

## 3. Claude에게 프로젝트 셋업 맡기기

채팅창에 그대로 복붙:

> supabase CLI로 프로젝트 셋업 도와줘.
> 먼저 `supabase orgs list` 로 내 org 확인 — 기존 org 있으면 그 중 하나 쓸지 물어보고, 없으면 org 이름 뭘로 만들지 물어봐.
> 프로젝트 이름도 나한테 물어봐. 리전은 서울 (`ap-northeast-2`) 고정.
> DB 비밀번호는 랜덤 생성해서 `.env.local`에 저장해주고,
> `@supabase/ssr` 설치 + `supabase init` + `link` + Auth 이메일 확인 OFF 설정까지 한번에 해줘.
> Next.js에서 쓸 `lib/supabase/server.ts`, `lib/supabase/client.ts` 헬퍼도 같이 만들어줘.

Claude가 자동으로 수행하는 일:

1. `supabase orgs list` → 기존 org 재사용 할지 / 새 org 이름은 뭘로 할지 사용자에게 확인. 새로 만드는 경우 `supabase orgs create <org-name>`
2. 프로젝트 이름 사용자에게 확인 후 `supabase projects create <project-name> --org-id ... --region ap-northeast-2 --db-password <랜덤>`
3. `supabase projects api-keys --project-ref ...` 로 anon / service_role 키 획득
4. `npm i @supabase/ssr @supabase/supabase-js`
5. `supabase init --yes`
6. `supabase link --project-ref ... --password ...`
7. `.env.local` 작성:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<JWT anon key>
   SUPABASE_PROJECT_REF=<ref>
   SUPABASE_DB_PASSWORD=<랜덤 생성된 비번>
   ```
8. `supabase/config.toml` 의 `[auth.email]` 섹션 `enable_confirmations = false` 확인 (개발 편의 — 실제 프로덕션에선 SMTP 붙이고 ON 전환 권장)
9. `supabase config push --yes` 로 원격 Auth 설정 동기화
10. `lib/supabase/server.ts` (Server Component/Action용) + `lib/supabase/client.ts` (Client Component용) 작성

끝나면 대시보드 URL이 대화창에 뜸 (`https://supabase.com/dashboard/project/<ref>`). 한 번 열어서 프로젝트 카드 보이면 셋업 끝. 이 링크가 앞으로 데이터 눈으로 확인하는 창이에요.

> 💡 테이블은 아직 안 만들어요. 실제 기능 붙일 때 필요한 테이블이 자연스럽게 나오니까, 그때 한 번에 마이그레이션으로 만듭니다. 지금은 Supabase와 "연결만 된" 상태.

---

## ⚠️ 가끔 만나는 함정 3가지

### ① `supabase orgs create --help` 에 "이름 넣는 법"이 안 나옴

`--name` 같은 플래그 없음. 그냥 positional 인자 — `supabase orgs create <org-name>`. Claude는 알고 있으니 혼자 쳐보다 막힐 때만 참고하면 됩니다.

### ② `supabase link --password` 의 "password"는 DB 비번

로그인 비번이 아닙니다. 3단계에서 Claude가 랜덤 생성해서 `.env.local`의 `SUPABASE_DB_PASSWORD`에 넣어둔 값이에요. 용어 혼동 주의 — 이 가이드에선 **"DB 비밀번호"**로 일관되게 부르기.

### ③ `config push` / `db push`는 기본 대화형

`[Y/n]` 프롬프트가 뜨는데, Claude Code의 Bash는 stdin 입력을 못 받음. Claude는 `--yes` 자동으로 붙여서 실행하니 평소엔 안 보임. 직접 터미널에서 쳐볼 땐 기억해두기.

---

## 셋업 완료 후 프로젝트 구조

```
.env.local                          ← 커밋 금지 (기본 .gitignore의 .env* 가 막아줌)
supabase/
├── config.toml                     ← Auth/DB/Storage 설정 관리
├── .gitignore
├── .temp/project-ref               ← link 후 ref 저장
└── migrations/                     ← 비어있음. 테이블 만들 때 여기 SQL 쌓임
lib/supabase/
├── server.ts                       ← Server Component/Action 용 (async cookies 필수)
└── client.ts                       ← Client Component 용
```

이 상태면 Next.js 페이지에서 바로 Supabase 호출 가능.

---

## 커밋

Claude 한테:

> 이번 셋업 커밋 + push 해줘

다음 단계는 [`.claude/docs/design-setup.md`](./design-setup.md) — **shadcn/ui 를 먼저 깔아둬야** 이후 UI 빌드에서 폼/카드가 자동으로 깔끔하게 나옵니다.

---

## 이후 개발 중에 Supabase 관련해서 자주 쓰는 말

- "이번에 새로 마이그레이션 파일 만들어서 원격에 push까지 해줘"
- "지금 Auth 설정 어떻게 돼있는지 `config.toml` 보여줘"
- "테이블 스키마 한 번 리셋하고 싶어. 어떻게 해?"
- "Supabase 대시보드에서 어느 탭 보면 되는지 알려줘"

모두 Claude가 알아서 처리 가능. 정 안 되면 https://supabase.com/dashboard 로 직접 들어가서 눈으로 확인이 가장 빠름.
