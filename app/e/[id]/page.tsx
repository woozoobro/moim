import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LiveCount } from "./LiveCount";
import { RsvpForm } from "./RsvpForm";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description, host_name, image_url")
    .eq("id", id)
    .maybeSingle();

  if (!event) return {};

  const description =
    event.description?.slice(0, 160) ?? `${event.host_name} 주최 · moim`;

  const images = event.image_url ? [event.image_url] : undefined;

  return {
    title: `${event.title} · moim`,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "article",
      images,
    },
    twitter: {
      card: event.image_url ? "summary_large_image" : "summary",
      title: event.title,
      description,
      images,
    },
  };
}

export default async function EventPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select(
      "id, title, description, starts_at, location, host_name, image_url"
    )
    .eq("id", id)
    .maybeSingle();

  if (!event) notFound();

  const { count } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);

  const initialCount = count ?? 0;

  const { date, time, dday } = formatParts(event.starts_at);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <div className="border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)]">
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b-2 border-foreground bg-muted">
          {event.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent">
              <span className="font-heading text-7xl font-black uppercase tracking-tighter opacity-40">
                moim
              </span>
            </div>
          )}
          <div className="absolute left-4 top-4 border-2 border-foreground bg-brand px-3 py-1.5 text-sm font-black uppercase shadow-[3px_3px_0_0_var(--foreground)]">
            {dday}
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            / event
          </div>
          <h1 className="mt-2 font-heading text-3xl font-black uppercase leading-tight tracking-tighter sm:text-4xl">
            {event.title}
          </h1>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoTile label="언제" value={`${date} · ${time}`} />
            <InfoTile label="어디서" value={event.location || "미정"} />
            <InfoTile label="주최" value={event.host_name} />
            <InfoTile
              label="참석"
              value={
                <LiveCount
                  key={initialCount}
                  eventId={event.id}
                  initialCount={initialCount}
                />
              }
            />
          </div>

          {event.description && (
            <div className="mt-6 border-t-2 border-dashed border-foreground/40 pt-6">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                / about
              </div>
              <p className="whitespace-pre-wrap text-base leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)]">
        <div className="border-b-2 border-foreground bg-accent px-6 py-4">
          <div className="text-xs font-bold uppercase tracking-widest">
            / rsvp
          </div>
          <div className="font-heading text-xl font-black uppercase tracking-tight">
            참석 등록
          </div>
        </div>
        <div className="px-6 py-5 sm:px-8">
          <RsvpForm eventId={event.id} />
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-2 border-foreground bg-background px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold">{value}</div>
    </div>
  );
}

function formatParts(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("ko-KR", {
    year: "numeric",
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
