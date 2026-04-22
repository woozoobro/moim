---
description: Vercel 첫 프로덕션 배포 + `vercel git connect` 로 push 자동 배포 연결
---

## 1. 사전 확인

- `vercel --version` → Vercel CLI 설치 여부
  - 없으면 `.claude/docs/deploy-vercel.md` §1 로 설치 안내 (`brew install vercel-cli` / `scoop install vercel-cli` / `npx vercel` 백업). 설치 끝나면 재확인
- `vercel whoami` → Vercel 인증 여부 (비인증이면 에러남)
  - 에러 뜨면 사용자에게 채팅창에 **직접** `! vercel login` 치라고 안내 (stdin 대화형이라 Claude 가 대신 실행 불가 — `.claude/docs/deploy-vercel.md` §2 참고). 완료했다고 하면 `vercel whoami` 로 재확인
- (선택) Vercel Claude Code 플러그인 미설치면 `! npx plugins add vercel/vercel-plugin --target claude-code -y` 권장 — user-level 1회만, 이후 `/vercel:deploy` 같은 스킬 자동으로 붙음

## 2. 실행

둘 다 통과 → `.claude/docs/deploy-vercel.md` §"Claude에게 맡기기" 섹션의 프롬프트 그대로 실행.

실행 규칙:
- **반드시 `vercel.json` 먼저 작성** — `{"regions": ["icn1"]}` (Seoul 리전. DB/백엔드가 다른 region 이면 거기에 맞춰서)
- `.env.local` 에서 **런타임에 필요한 키만** Production env 로 푸시 — 대개 `NEXT_PUBLIC_*` 접두사 + 런타임용 secret 정도. 빌드타임 전용 키 (예: DB 비번, PROJECT_REF 류) 는 **절대 금지**
- `vercel env add` 는 stdin trailing newline 주의 — `printf "%s"` 로 쏘기
- `vercel deploy --prod --yes` → 받은 URL 반환
- **Supabase 쓰고 있으면** 받은 URL 로 `supabase/config.toml` 의 `site_url` 업데이트 후 `supabase config push --yes` (Auth callback URL 허용용)
- 마지막에 `vercel git connect` 로 GitHub repo ↔ Vercel 프로젝트 연결 → 이후 `git push` 만 해도 자동 배포

완료 후 받은 프로덕션 URL 정리해서 알려줘.
