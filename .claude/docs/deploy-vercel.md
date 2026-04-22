# Vercel 배포 가이드

Next.js 앱이 로컬에서 돌고 있는 상태라면 **아무 시점에나** 실행 가능. 첫 배포만 수동이고, 이후부턴 `git push` 만 해도 자동 재배포.

이번에 얻는 것: **`https://<project>.vercel.app` 공개 URL**. 이후 작업물이 push 될 때마다 인터넷에서 자동 배포.

---

## 준비물

Supabase 셋업 때처럼 직접 타이핑하는 건 **딱 3번** — CLI 설치 · 로그인 · Claude Code 플러그인 설치.

### 1. Vercel CLI 설치

**macOS (Homebrew)**

```bash
brew install vercel-cli
```

**Windows (Scoop)**

```powershell
scoop install vercel-cli
```

**공통 백업 (Node만 있으면)**

```bash
npx vercel --version
```

이후 모든 명령을 `npx vercel ...` 로. 느리지만 설치 생략.

설치 확인:

```bash
vercel --version
```

### 2. Vercel 로그인 (브라우저 1회)

Claude Code 채팅창에:

```
! vercel login
```

Supabase 때와 같이 `!` 로 시작 → 터미널에서 직접 실행. 브라우저 한 번 뜨고 토큰 받으면 끝.

### 3. Claude Code · Vercel 플러그인 설치 (user-level, 1회)

```
! npx plugins add vercel/vercel-plugin --target claude-code -y
```

한 번 깔면 이 컴퓨터의 모든 Claude Code 세션에서 `/vercel:deploy`, `/vercel:env`, `/vercel:status` 같은 스킬이 자동으로 붙음. 이후에도 그대로 씀.

---

## Claude에게 맡기기

채팅창에 복붙:

> 이제 Vercel 배포할 거야.
> - `vercel.json` 먼저 만들어서 `{"regions": ["icn1"]}` 로 Seoul region 고정 (DB/백엔드가 다른 region 이면 거기에 맞춰. 기본값 `iad1` 이면 대륙 횡단)
> - `vercel link --yes` 로 프로젝트 생성 · 링크
> - `.env.local` 에서 **런타임에 필요한 키만** Production env 에 푸시. 대개 `NEXT_PUBLIC_*` 접두사 + 런타임 secret 정도. 빌드타임 전용 (DB 비번 / PROJECT_REF 류) 는 **절대 푸시 금지**
> - `vercel deploy --prod --yes` 로 첫 프로덕션 배포
> - `vercel git connect` 로 GitHub repo 와 Vercel 프로젝트 link → 이 이후부턴 `git push origin main` 만 해도 자동 배포
> - Supabase 쓰는 프로젝트면 마지막으로 `config.toml` 의 `site_url` 을 받은 Vercel URL 로 바꾸고, localhost 는 `additional_redirect_urls` 로 옮긴 다음 `supabase config push --yes`

Claude가 하는 일:

1. `vercel.json` 작성 (region 핀)
2. `vercel link --yes` → `.vercel/` 생성
3. `vercel env add` × N (Production, 런타임 필요한 키만)
4. `vercel deploy --prod --yes` → 결과 URL 출력
5. `vercel git connect` → GitHub 연결
6. (Supabase 프로젝트면) `supabase/config.toml` 수정 + `supabase config push --yes`

끝나면 대화창에 `https://<your-project>.vercel.app` URL 이 뜸. 이후 커밋 push 할 때마다 Vercel dashboard 의 Deployments 에 새 빌드가 자동으로 찍힘.

---

## 브라우저에서 확인

1. 받은 Vercel URL 접속 → 로컬에서 보던 화면이 그대로 뜨는지
2. 주요 기능 (로그인/폼/데이터 조회 등) 한 번씩 눌러 보기
3. Vercel 대시보드 → 프로젝트 → Deployments · Environment Variables 탭에 눈으로 확인

---

## ⚠️ 자주 만나는 함정 3가지

### ① Function Region 기본값은 `iad1` (US East)

Supabase 가 Seoul 인데 배포를 기본값으로 놔두면 요청마다 태평양 왕복. **첫 배포 전에 `vercel.json` 에 `{"regions": ["icn1"]}` 박아두면 끝.** Hobby 플랜은 1 region 만 허용하니 하나 고르면 그걸로 고정됨. 대시보드의 Function Region 표시가 `iad1` 로 계속 보여도 실제 실행은 `icn1` — 응답 헤더 `x-vercel-id: icn1::...` 로 확인 가능.

### ② `vercel env add` 에 값 쏠 때 trailing newline 주의

stdin 파이프로 값 넣을 때 개행 들어가면 JWT 가 invalid 해져서 런타임에서 401. Claude 는 `printf "%s" ...` 로 쏘니까 직접 칠 땐 `echo -n` 대신 `printf` 쓰기.

### ③ Vercel Serverless function 요청 바디 한계 4.5MB

이미지/파일 업로드 붙일 때 주의. Next.js 의 `serverActions.bodySizeLimit` 을 10mb 로 늘려도 Vercel 플랫폼 한계가 더 빡빡해서 먼저 자름. "아이폰 사진 원본 말고 스크린샷 정도" 로 생각하면 안전. 넘기려면 브라우저 → Storage 직접 업로드로 우회.

---

## 재배포는 자동

`vercel git connect` 끝낸 뒤로는 작업 단위마다 커밋 + `git push` 하면 Vercel 이 자동으로 빌드·배포. 수동 `vercel deploy` 명령 안 돌려도 됨.

GitHub 안 거치고 즉시 배포가 필요하면 한 줄:

```
! vercel deploy --prod --yes
```

---

## 커밋

Claude 한테:

> 배포 셋업 커밋 + push 해줘

커밋 후 `git push` 가 자동 배포를 한 번 더 트리거 — 대시보드에서 "Git 이 트리거한 build" 로 찍힘.

---

**끝.** 첫 배포 완료. 이제 작업하면서 `git push` 할 때마다 프로덕션 URL 이 자동 갱신됨.
