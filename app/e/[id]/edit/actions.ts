"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UpdateEventState = { error: string | null };

export async function updateEvent(
  _prev: UpdateEventState,
  formData: FormData
): Promise<UpdateEventState> {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const hostName = String(formData.get("host_name") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const cover = formData.get("cover") as File | null;

  if (!id) return { error: "이벤트를 찾을 수 없습니다." };
  if (!title) return { error: "제목을 입력하세요." };
  if (!hostName) return { error: "주최자 이름을 입력하세요." };
  if (!startsAt) return { error: "시작 일시를 입력하세요." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const update: Record<string, unknown> = {
    title,
    host_name: hostName,
    starts_at: new Date(startsAt).toISOString(),
    description: description || null,
    location: location || null,
  };

  if (cover && cover.size > 0) {
    const ext = (cover.name.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}/${id}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("event-covers")
      .upload(path, cover, { contentType: cover.type, upsert: true });
    if (upErr) return { error: upErr.message };
    const {
      data: { publicUrl },
    } = supabase.storage.from("event-covers").getPublicUrl(path);
    update.image_url = publicUrl;
  }

  const { error } = await supabase
    .from("events")
    .update(update)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath(`/e/${id}`);
  redirect(`/e/${id}`);
}

export async function deleteEvent(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/my");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("events").delete().eq("id", id);

  revalidatePath("/", "layout");
  redirect("/my");
}
