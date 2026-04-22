# 디자인 셋업 — shadcn/ui

이전 setup 단계까지 끝낸 상태에서 이어집니다. 아직 UI 를 만들기 전 — 디자인 시스템을 먼저 깔아두면 이후 앱 빌드에서 나오는 모든 화면이 **자동으로 깔끔하게** 나옵니다.

이번에 얻는 것: **[shadcn/ui](https://ui.shadcn.com) 기본 컴포넌트 5개** (`Button`, `Input`, `Label`, `Textarea`, `Card`) + Tailwind v4 의 디자인 토큰 (색상/간격/radius/포커스 링). Claude 가 이후 폼·카드·헤더 만들 때 이 컴포넌트를 그대로 씁니다. 프로젝트에 따라 Select/Dialog/Dropdown 등 필요하면 `npx shadcn@latest add <name>` 로 언제든 추가.

---

## Claude에게 맡기기

채팅창에 복붙:

> shadcn/ui 셋업하자.
> - `npx shadcn@latest init --defaults --yes` 로 초기화 (Next.js 16 + Tailwind v4 자동 감지)
> - `npx shadcn@latest add input label textarea card --yes` 로 컴포넌트 4개 추가 (Button 은 init 때 같이 생김)
> - 이후 폼은 전부 shadcn `Input` / `Label` / `Textarea` / `Button` 으로, 카드·섹션은 `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` 로 만들어줘
> - 기본 텍스트/배경은 `text-foreground` / `bg-background`, 에러는 `text-destructive`, 보조 텍스트는 `text-muted-foreground` 사용
> - `<Button>` 안에 링크를 넣을 땐 `render={<Link href="..." />} nativeButton={false}` 쓰기 (Base UI 버전의 shadcn — `asChild` 아니고, native `<button>` 에서 `<a>` 로 바뀌니 `nativeButton={false}` 꼭 같이)

Claude가 하는 일:

1. `npx shadcn@latest init --defaults --yes` → `components.json`, `components/ui/button.tsx`, `lib/utils.ts` 생성 + `app/globals.css` 에 디자인 토큰 주입
2. `npx shadcn@latest add input label textarea card --yes` → `components/ui/{input,label,textarea,card}.tsx` 4개 추가
3. 이후 UI 빌드는 shadcn 컴포넌트 기반으로 작성

---

## 확인

프로젝트 구조가 이렇게 돼 있으면 OK:

```
components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── label.tsx
└── textarea.tsx
components.json      ← shadcn 설정
lib/utils.ts         ← cn() 헬퍼
app/globals.css      ← Tailwind v4 + 디자인 토큰 (shadcn이 주입)
```

이제 `npm run dev` 돌려도 화면엔 아직 아무 변화 없음 — 컴포넌트만 깔린 상태. 실제 기능 화면 만들기 시작하면 자연스럽게 적용됨.

---

## ⚠️ 자주 만나는 함정 2가지

### ① `npx shadcn init` 이 프롬프트 물음

`-y` 만 붙이면 "Select a component library" 에서 멈춤. **반드시 `--defaults --yes`** 두 개 다. Claude 는 알고 있으니 복붙 프롬프트 그대로 쓰면 OK.

### ② 이 shadcn 은 Radix 아니라 **Base UI** 기반

최신 shadcn(v4+) 은 Radix 대신 Base UI. 링크 버튼은 이 패턴:

```tsx
<Button render={<Link href="/about" />} nativeButton={false}>
  더 보기
</Button>
```

- `asChild` (❌ 구버전 Radix) 대신 `render` prop
- `nativeButton={false}` 를 빼먹으면 콘솔에 **"A component that acts as a button expected a native `<button>`"** 경고 뜸 (Base UI 가 "네이티브 button 말고 anchor 로 렌더하는 거 의도적인 거 맞아?" 라고 확인 요구)

Claude 가 구글링한 구버전 Radix 예시로 짜면 TS 에러 + Base UI 경고 콤보. 복붙 프롬프트가 이걸 예방함.

---

## 커밋

Claude 한테:

> shadcn 셋업 커밋 + push 해줘

---

**다음:** 여기까지가 setup 끝. 이제 원하는 기능 Claude 한테 맡기면 됨 — 폼/카드는 shadcn 기본 컴포넌트로, 색상/간격은 디자인 토큰으로 자동으로 깔끔하게.
