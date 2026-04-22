"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitRsvp, type RsvpState } from "./actions";

const INITIAL: RsvpState = { error: null, success: false };

export function RsvpForm({ eventId }: { eventId: string }) {
  const [state, formAction, pending] = useActionState(submitRsvp, INITIAL);

  if (state.success) {
    return (
      <div className="rounded-lg border border-emerald-600/20 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-950/40 dark:text-emerald-200">
        RSVP 완료! 이벤트 당일에 뵙겠습니다.
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="event_id" value={eventId} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="rsvp-name">이름</Label>
        <Input id="rsvp-name" name="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="rsvp-email">이메일</Label>
        <Input
          id="rsvp-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "등록 중..." : "RSVP 하기"}
      </Button>
    </form>
  );
}
