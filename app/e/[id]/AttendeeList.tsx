"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export type Attendee = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export function AttendeeList({
  eventId,
  initialAttendees,
}: {
  eventId: string;
  initialAttendees: Attendee[];
}) {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`attendees:${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const row = payload.new as Attendee;
          setAttendees((prev) =>
            prev.some((a) => a.id === row.id) ? prev : [row, ...prev]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  async function copyAllEmails() {
    await navigator.clipboard.writeText(
      attendees.map((a) => a.email).join(", ")
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-6 border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)]">
      <div className="flex items-start justify-between gap-3 border-b-2 border-foreground bg-accent px-6 py-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest">
            / attendees · owner only
          </div>
          <div className="font-heading text-xl font-black uppercase tracking-tight">
            참석자 명단 ({attendees.length})
          </div>
        </div>
        {attendees.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={copyAllEmails}
          >
            {copied ? "복사됨 ✓" : "이메일 모두 복사"}
          </Button>
        )}
      </div>

      {attendees.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-bold">아직 참석자가 없어요.</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            이벤트 링크를 공유해 보세요.
          </p>
        </div>
      ) : (
        <ul className="divide-y-2 divide-foreground">
          {attendees.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-4 px-6 py-3"
            >
              <div className="flex min-w-0 flex-col">
                <div className="font-heading font-bold">{a.name}</div>
                <div className="truncate text-xs font-medium text-muted-foreground">
                  {a.email}
                </div>
              </div>
              <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {formatRsvpTime(a.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const kstFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Seoul",
  hour12: false,
});

function formatRsvpTime(iso: string): string {
  return kstFormatter.format(new Date(iso));
}
