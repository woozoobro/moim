"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LiveCount({
  eventId,
  initialCount,
}: {
  eventId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`rsvps:${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${eventId}`,
        },
        () => setCount((c) => c + 1)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="font-heading text-lg font-black tabular-nums">
        {count}
      </span>
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        명
      </span>
    </span>
  );
}
