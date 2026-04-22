# moim-moim 번들

Luma(lu.ma) 축소 클론을 Next.js 16 + Supabase 로 만드는 수업 번들.

## 흐름 (이 순서 추천)

1. Setup (범용): `/setup-nextjs` → `/setup-github` → `/setup-supabase` → `/setup-design`
2. Phase (moim-moim): `/phase1` → `/phase2` → `/phase3` → `/phase4`
3. 배포: `/deploy-vercel` — phase 순서와 독립, 아무 시점 1회

전체 스펙은 `docs/PLAN.md`.

## 플랫폼

사용자 OS (macOS / Windows) 는 세션 environment 의 `Platform` 으로 확인. docs 에 OS별 커맨드 병기돼 있음 (`brew` vs `scoop`/`winget`, Warp vs PowerShell 등) — 해당 OS 용 커맨드만 골라서 안내.

## 상시 주의

shadcn v4+ = Base UI (Radix 아님). 링크 버튼은 `<Button asChild>` ❌ → `<Button render={<Link />} nativeButton={false}>` ✓
