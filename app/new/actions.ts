"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";

export type NewEventState = { error: string | null };

export async function createEvent(
  _prev: NewEventState,
  formData: FormData
): Promise<NewEventState> {
  const title = String(formData.get("title") ?? "").trim();
  const hostName = String(formData.get("host_name") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!title) return { error: "제목을 입력하세요." };
  if (!hostName) return { error: "주최자 이름을 입력하세요." };
  if (!startsAt) return { error: "시작 일시를 입력하세요." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = nanoid(10);
  const { error } = await supabase.from("events").insert({
    id,
    owner_id: user.id,
    title,
    host_name: hostName,
    starts_at: new Date(startsAt).toISOString(),
    description: description || null,
    location: location || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/my");
}
