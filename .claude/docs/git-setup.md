# GitHub × Claude Code 셋업 가이드

Next.js 프로젝트 만든 직후 바로. 이 뒤부턴 작업 단위마다 한 줄 커밋이 자연스러워집니다.

우리가 실제로 쓰는 건 `git commit` + `git push` — **기본 `git` 만 있어도 충분**. 다만 `gh` CLI 를 같이 깔아두면 편해요:

- 첫 GitHub repo 생성을 **브라우저 없이 터미널 한 줄**로
- 이후에도 issue · PR · release 관리할 때 계속 유용

이 가이드는 **`gh` 를 깔아둔 기준**으로 작성. 안 깔고 가려면 [Fallback — `gh` 없이 하려면](#fallback--gh-없이-하려면) 참고.

## 준비물

- GitHub 계정
- Next.js 프로젝트 셋업까지 끝낸 상태 ([`.claude/docs/nextjs-setup.md`](./nextjs-setup.md)) — create-next-app 이 `git init` 까지 자동 수행해둬서 로컬 git 은 이미 있음. 원격만 없음
- Claude Code 세션이 `my-app` 폴더 안에서 열려 있음

---

## 1. GitHub CLI (`gh`) 설치 (권장)

**macOS**

```bash
brew install gh
```

**Windows (Scoop / winget)**

```powershell
scoop install gh
# or
winget install --id GitHub.cli
```

설치 확인:

```bash
gh --version
```

## 2. 로그인 (브라우저 1회)

Claude Code 채팅창에:

```
! gh auth login
```

- Account: **GitHub.com**
- Protocol: **HTTPS**
- Authenticate: **Login with a web browser** → 뜨는 one-time code 복사 → 엔터 → 브라우저에서 붙여넣기

이후 전부 Claude Code 안에서.

---

## 3. Claude에게 맡기기

채팅창에 복붙:

> GitHub 셋업해줘.
> - 현재 저장소를 `my-app` 이름으로 GitHub 에 **public** repo 만들어줘 (공개 포트폴리오·공유용. private 이 좋으면 `--private` 로)
> - 첫 커밋 + `origin main` push 까지 한 번에
> - 내가 할 일은 없음. `gh repo create ... --source=. --push` 로 자동

Claude가 하는 일:

1. `git status` · `git log --oneline` 로 상태 확인
2. 필요하면 staging 되지 않은 파일 `git add` + 초기 커밋
3. `gh repo create my-app --public --source=. --push` → repo 생성과 동시에 push

완료 시 repo URL 이 대화창에 뜸 (`https://github.com/<user>/my-app`).

---

## 4. 확인

1. 브라우저로 `https://github.com/<user>/my-app` 열어서 파일 트리 보임
2. `.env.local` 이 **안** 올라가 있는지 확인 (create-next-app 기본 `.gitignore` 가 `.env*` 막아줌)
3. `node_modules/` 안 올라감 · `.next/` 안 올라감

---

## Fallback — `gh` 없이 하려면

`gh` 안 깔고 싶으면 첫 repo 생성만 브라우저에서 직접:

1. https://github.com/new 열고 repo 만들기 — 이름 `my-app`, **public**, **README / .gitignore / license 전부 체크 해제** (로컬에 이미 있어서 중복되면 충돌)
2. 생성 후 뜨는 **remote URL** 복사 (예: `https://github.com/<user>/my-app.git`)
3. Claude 한테 복붙:

   > remote 를 `https://github.com/<user>/my-app.git` 로 붙이고 첫 커밋 + `origin main` push 해줘

Claude 가 `git remote add origin ...` + `git add` + `git commit` + `git push -u origin main` 자동 실행.

---

## ⚠️ 자주 만나는 함정 2가지

### ① `gh auth login` 을 Claude 한테 시키면 막힘

브라우저 인증이 필요하므로 반드시 `!` 접두어로 **직접** 터미널에서. `gh` 내부 프롬프트도 stdin 대화형이라 Claude 가 못 받음.

### ② `.env.local` 실수 커밋

`.gitignore` 가 기본으로 막아주니까 보통 안전. 근데 `.env.local` 대신 `.env` 이름으로 저장했거나 custom 파일명 쓰면 노출 위험. Claude 한테 커밋 시킬 때 "env 류 파일 절대 커밋 금지" 라고 복붙 프롬프트에 넣어두면 예방.

---

**다음:** [`.claude/docs/supabase-setup.md`](./supabase-setup.md) — Supabase 프로젝트 연결. 여기서부터 실제 백엔드 붙이기 시작.
