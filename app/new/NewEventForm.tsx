"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, type NewEventState } from "./actions";

const INITIAL: NewEventState = { error: null };

export function NewEventForm() {
  const [state, formAction, pending] = useActionState(createEvent, INITIAL);

  return (
    <div className="flex flex-1 items-start justify-center p-4 py-10">
      <div className="w-full max-w-2xl border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)]">
        <div className="border-b-2 border-foreground bg-brand px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-widest">
            / create
          </div>
          <div className="font-heading text-2xl font-black uppercase tracking-tighter">
            새 이벤트 만들기
          </div>
        </div>
        <form action={formAction}>
          <div className="flex flex-col gap-5 px-6 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="host_name">주최자</Label>
                <Input id="host_name" name="host_name" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="starts_at">시작 일시</Label>
                <Input
                  id="starts_at"
                  name="starts_at"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">장소 (선택)</Label>
              <Input id="location" name="location" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cover">커버 이미지 (선택)</Label>
              <Input
                id="cover"
                name="cover"
                type="file"
                accept="image/*"
                className="cursor-pointer pt-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">소개 (선택)</Label>
              <Textarea id="description" name="description" rows={5} />
            </div>
            {state.error && (
              <div className="border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
                {state.error}
              </div>
            )}
          </div>
          <div className="flex justify-end border-t-2 border-foreground bg-muted px-6 py-4">
            <Button type="submit" variant="brand" size="lg" disabled={pending}>
              {pending ? "저장 중..." : "이벤트 만들기 →"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
