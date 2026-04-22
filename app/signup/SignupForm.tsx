"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, type SignupState } from "./actions";

const INITIAL: SignupState = { error: null };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, INITIAL);

  return (
    <div className="flex flex-1 items-center justify-center p-4 py-12">
      <div className="w-full max-w-sm border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)]">
        <div className="border-b-2 border-foreground bg-accent px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-widest">
            / join
          </div>
          <div className="font-heading text-2xl font-black uppercase tracking-tighter">
            회원가입
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
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            {state.error && (
              <div className="border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
                {state.error}
              </div>
            )}
            <Button type="submit" variant="brand" size="lg" disabled={pending}>
              {pending ? "가입 중..." : "회원가입 →"}
            </Button>
            <p className="text-center text-sm font-medium text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="border-b-2 border-foreground font-bold text-foreground"
              >
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
