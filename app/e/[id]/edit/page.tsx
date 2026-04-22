import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditEventForm } from "./EditEventForm";

type Params = Promise<{ id: string }>;

export default async function EditEventPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select(
      "id, owner_id, title, description, starts_at, location, host_name, image_url"
    )
    .eq("id", id)
    .maybeSingle();

  if (!event) notFound();
  if (event.owner_id !== user.id) redirect(`/e/${id}`);

  return <EditEventForm event={event} />;
}
