import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function MyEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("id, title, host_name, starts_at, location, image_url")
    .eq("owner_id", user.id)
    .order("starts_at", { ascending: true });

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <div className="mb-8 flex items-end justify-between border-b-2 border-foreground pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            / dashboard
          </div>
          <h1 className="mt-1 font-heading text-3xl font-black uppercase tracking-tighter sm:text-4xl">
            내 이벤트
          </h1>
        </div>
        <Button
          render={<Link href="/new" />}
          nativeButton={false}
          variant="brand"
          size="sm"
        >
          + 새 이벤트
        </Button>
      </div>

      {!events || events.length === 0 ? (
        <div className="border-2 border-foreground bg-card p-10 text-center shadow-[5px_5px_0_0_var(--foreground)]">
          <p className="text-sm font-medium">
            아직 만든 이벤트가 없어요.
          </p>
          <Link
            href="/new"
            className="mt-3 inline-block border-b-2 border-foreground font-bold"
          >
            첫 이벤트 만들기 →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((e) => (
            <MyEventRow key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

type EventItem = {
  id: string;
  title: string;
  host_name: string;
  starts_at: string;
  location: string | null;
  image_url: string | null;
};

function MyEventRow({ event }: { event: EventItem }) {
  const { date, time, dday } = formatParts(event.starts_at);
  return (
    <div className="group flex items-stretch border-2 border-foreground bg-card shadow-[4px_4px_0_0_var(--foreground)] transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_0_var(--foreground)]">
      <Link
        href={`/e/${event.id}`}
        className="flex flex-1 items-stretch gap-0"
      >
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden border-r-2 border-foreground bg-muted sm:w-32">
          {event.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent">
              <span className="font-heading text-xl font-black uppercase tracking-tighter opacity-60">
                moim
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <span className="border-2 border-foreground bg-background px-1.5 py-0.5 text-[10px] text-foreground">
                {dday}
              </span>
              <span>{date}</span>
              <span>·</span>
              <span>{time}</span>
            </div>
            <div className="font-heading text-lg font-extrabold leading-tight">
              {event.title}
            </div>
            {event.location && (
              <div className="text-xs font-medium text-muted-foreground">
                📍 {event.location}
              </div>
            )}
          </div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            by {event.host_name}
          </div>
        </div>
      </Link>
      <div className="flex shrink-0 items-center justify-center border-l-2 border-foreground bg-muted px-3">
        <Link
          href={`/e/${event.id}/edit`}
          className="font-heading text-xs font-black uppercase tracking-tight transition-colors hover:text-brand"
          aria-label={`${event.title} 수정`}
        >
          수정
        </Link>
      </div>
    </div>
  );
}

function formatParts(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const time = d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const diffMs = d.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const dday =
    diffDays < 0
      ? "종료"
      : diffDays === 0
        ? "D-DAY"
        : diffDays <= 99
          ? `D-${diffDays}`
          : "곧";
  return { date, time, dday };
}
