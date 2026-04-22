---
description: Next.js 16 프로젝트를 현재 폴더에 생성하고 개발 서버를 백그라운드로 띄움
---

`.claude/docs/nextjs-setup.md` 의 "2. `/setup-nextjs` 실행" 섹션을 그대로 따라해줘:

1. 현재 폴더에 Next.js 16 App Router 프로젝트 생성 — `npx create-next-app@latest . --ts --tailwind --eslint --app --turbopack --no-src-dir --import-alias "@/*" --yes`
2. 의존성 설치 완료되면 백그라운드 쉘로 `npm run dev` 실행 (`run_in_background: true`)
3. `http://localhost:3000` 준비되면 사용자에게 주소 알려줘

이미 폴더에 `.claude/`, `CLAUDE.md`, `AGENTS.md` 가 있는 상태 — create-next-app 이 이들과 충돌 없이 공존해야 함 (만약 Busy/conflict 에러 나면 사용자에게 상황 설명).

완료 후 **다음 단계는 `/setup-github`** 이라는 안내도 한 줄.
