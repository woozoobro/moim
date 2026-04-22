"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <div className="flex flex-1 items-center justify-center p-4 py-12">
      <div className="w-full max-w-sm border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)]">
        <div className="border-b-2 border-foreground bg-brand px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-widest">
            / welcome back
          </div>
          <div className="font-heading text-2xl font-black uppercase tracking-tighter">
            로그인
          </div>
        </div>
        <form action={formAction}>
          <div className="flex flex-col gap-4 px-6 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {state.error && (
              <div className="border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
                {state.error}
              </div>
            )}
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "로그인 중..." : "로그인 →"}
            </Button>
            <p className="text-center text-sm font-medium text-muted-foreground">
              계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="border-b-2 border-foreground font-bold text-foreground"
              >
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
