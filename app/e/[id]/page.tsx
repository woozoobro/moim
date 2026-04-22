import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.image_url}
          alt={event.title}
          className="mb-6 aspect-video w-full rounded-xl object-cover ring-1 ring-foreground/10"
        />
      )}
      <div className="mb-6 flex flex-col gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {event.title}
        </h1>
        <div className="text-sm text-muted-foreground">
          {formatDateTime(event.starts_at)}
          {event.location ? ` · ${event.location}` : ""}
        </div>
        <div className="text-sm text-muted-foreground">
          주최 {event.host_name}
        </div>
      </div>

      {event.description && (
        <p className="mb-8 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {event.description}
        </p>
      )}

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 py-5">
          <div className="text-sm text-muted-foreground">
            <LiveCount
              key={initialCount}
              eventId={event.id}
              initialCount={initialCount}
            />
          </div>
          <RsvpForm eventId={event.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
