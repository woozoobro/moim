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
      <div className="border-2 border-foreground bg-accent p-5 shadow-[3px_3px_0_0_var(--foreground)]">
        <div className="text-xs font-bold uppercase tracking-widest">
          ✓ confirmed
        </div>
        <div className="mt-1 font-heading text-lg font-black uppercase tracking-tight">
          RSVP 완료!
        </div>
        <div className="mt-1 text-sm font-medium">
          이벤트 당일에 뵙겠습니다.
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
        <div className="border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
          {state.error}
        </div>
      )}
      <Button type="submit" variant="brand" size="lg" disabled={pending}>
        {pending ? "등록 중..." : "RSVP 하기 →"}
      </Button>
    </form>
  );
}
