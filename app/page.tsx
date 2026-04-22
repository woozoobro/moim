import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import bannerImg from "@/public/banner.png";

export default async function Home() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, host_name, starts_at, location, image_url")
    .order("starts_at", { ascending: true });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-10">
      <div className="relative mx-auto mb-6 aspect-[16/7] w-full max-w-4xl overflow-hidden">
        <Image
          src={bannerImg}
          alt="다가오는 이벤트 — 관심 있는 모임을 찾아 바로 RSVP"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 896px, 100vw"
        />
      </div>

      {!events || events.length === 0 ? (
        <div className="border-2 border-foreground bg-card p-10 text-center shadow-[5px_5px_0_0_var(--foreground)]">
          <p className="text-sm font-medium">
            아직 등록된 이벤트가 없어요.
          </p>
          <Link
            href="/new"
            className="mt-3 inline-block border-b-2 border-foreground font-bold"
          >
            첫 이벤트 만들기 →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
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

function EventCard({ event }: { event: EventItem }) {
  const { date, time, dday } = formatParts(event.starts_at);
  return (
    <Link
      href={`/e/${event.id}`}
      className="group block border-2 border-foreground bg-card shadow-[5px_5px_0_0_var(--foreground)] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0_0_var(--foreground)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-foreground bg-muted">
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent">
            <span className="font-heading text-5xl font-black uppercase tracking-tighter opacity-50">
              moim
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3 border-2 border-foreground bg-background px-2 py-1 text-xs font-black uppercase">
          {dday}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
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
        <div className="mt-1 border-t-2 border-dashed border-foreground/30 pt-2 text-xs font-bold uppercase tracking-wide">
          by {event.host_name}
        </div>
      </div>
    </Link>
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
