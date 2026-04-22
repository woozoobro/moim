---
description: shadcn/ui 초기화 + 5개 기본 컴포넌트 추가 (Button · Input · Label · Textarea · Card)
---

`.claude/docs/design-setup.md` 의 "Claude에게 맡기기" 섹션을 그대로 실행해줘.

- `npx shadcn@latest init --defaults --yes` (Next.js 16 + Tailwind v4 자동 감지)
- `npx shadcn@latest add input label textarea card --yes` (Button 은 init 에서 같이 생김)

Base UI 기반임에 유의 — 이후 UI 에서 `<Button render={<Link />} nativeButton={false}>` 패턴으로 링크 버튼 작성.

완료 시 **setup 끝. 이제 원하는 기능 만들기 시작**이라고 안내.
