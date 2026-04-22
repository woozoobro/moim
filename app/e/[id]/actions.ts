"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type RsvpState = { error: string | null; success: boolean };

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const eventId = String(formData.get("event_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!eventId) return { error: "이벤트를 찾을 수 없습니다.", success: false };
  if (!name) return { error: "이름을 입력하세요.", success: false };
  if (!email) return { error: "이메일을 입력하세요.", success: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from("rsvps")
    .insert({ event_id: eventId, name, email });

  if (error) {
    if (error.code === "23505") {
      return {
        error: "이미 이 이메일로 RSVP 하셨습니다.",
        success: false,
      };
    }
    return { error: error.message, success: false };
  }

  revalidatePath(`/e/${eventId}`);
  return { error: null, success: true };
}
