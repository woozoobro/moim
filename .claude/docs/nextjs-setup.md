# Next.js × Claude Code 셋업 가이드

## 준비물

- **Node.js 20 LTS 이상** — `node --version` 으로 확인. 없으면 https://nodejs.org 에서 LTS 버전 설치
- **Warp** (https://www.warp.dev) — Windows 는 Warp 대신 **PowerShell** 또는 **Windows Terminal**
- **Claude Code** — 실행 가능 상태 + 활성 요금제 (Pro / Max / API credit)

---

## 1. 터미널에서 폴더 열기 + Claude Code 실행

**macOS (Warp)** — 프로젝트 폴더 우클릭 → **Open Warp Here**. 터미널이 그 폴더를 현재 위치로 열어줌.

**Windows (PowerShell / Windows Terminal)** — `Win + X` → `Windows PowerShell` 열고 폴더로 이동:

```powershell
cd C:\Users\<이름>\Desktop\my-app
```

> **"현재 디렉토리" 개념** — 터미널은 **항상 현재 어디에서 명령을 실행 중** 인 위치가 있어요. 폴더 우클릭 → Open Warp Here 하면 그 폴더가 현재 위치. `pwd` 로 확인 가능. 앞으로 모든 명령은 "지금 이 터미널이 어디에 있는지" 를 기준으로 실행됩니다.

폴더에서 Claude Code 실행:

```
claude
```

번들이 올바르게 풀려있으면 `/` 입력 시 슬래시 커맨드 목록이 뜹니다 — `/setup-nextjs`, `/setup-github`, `/setup-supabase`, `/setup-design` 등.

---

## 2. `/setup-nextjs` 실행

채팅창에 그대로:

```
/setup-nextjs
```

Claude 가 하는 일:

1. 현재 폴더에 Next.js 16 App Router 프로젝트 생성 — `npx create-next-app@latest .` (TypeScript · Tailwind · ESLint · App Router · Turbopack 전부 기본값). `.` 은 "현재 폴더에" 라는 의미 — 이미 풀어둔 `.claude/` · `CLAUDE.md` · `AGENTS.md` 와 공존
2. 의존성 설치 + `git init`
3. 백그라운드로 `npm run dev` 실행 → `http://localhost:3000` 준비 완료 알림

---

## 3. 브라우저에서 확인

`http://localhost:3000` 접속 → Next.js 기본 웰컴 페이지가 뜨면 **셋업 완료**.

---

## `npm run dev` 는 계속 켜두기

- 로컬 **개발 서버** 실행 명령. 코드 바꾸면 브라우저에 즉시 반영 (HMR).
- 앞으로 작업 내내 **항상 켜져 있어야** 브라우저 확인 가능. 꺼지면 localhost:3000 이 안 뜸.
- `/setup-nextjs` 가 Claude Code 백그라운드 쉘에 띄워놨으니 작업 내내 유지됨 (Claude Code 창 상단 Shells 표시에 1 shell 뜸)
- 혹시 꺼졌으면 Claude 한테 "백그라운드로 dev 서버 다시 돌려줘" 한 줄

---

## ⚠️ 자주 만나는 함정 3가지

### ① `/setup-nextjs` 가 목록에 안 보임

`.claude/commands/setup-nextjs.md` 파일이 현재 폴더에 있어야 인식됨. 확인:

```bash
ls .claude/commands/
```

파일이 있는데도 안 뜨면 Claude Code 를 끄고 다시 실행.

### ② `npx create-next-app` 이 "command not found" / 버전 에러

Node.js 가 안 깔렸거나 버전이 낮음.

```bash
node --version
```

- 아무것도 안 뜨면 → https://nodejs.org 에서 **LTS** 버전 설치 후 터미널 재시작
- `v18.x` 이하 뜨면 → Next.js 16 이 요구하는 Node 20 LTS 이상으로 업그레이드

### ③ `claude` 가 "command not found"

Claude Code CLI 가 안 깔렸거나 설치 직후 PATH 리로드 안 됨. 공식 설치 가이드: https://claude.ai/code. 설치 후 **터미널 재시작** 하면 잡힘.

---

**다음:** [`.claude/docs/git-setup.md`](./git-setup.md) — GitHub 원격 저장소 연결 + 첫 push. `/setup-github` 한 줄.
