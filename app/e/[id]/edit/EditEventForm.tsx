"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteEvent,
  updateEvent,
  type UpdateEventState,
} from "./actions";

const INITIAL: UpdateEventState = { error: null };

type EventData = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  host_name: string;
  image_url: string | null;
};

export function EditEventForm({ event }: { event: EventData }) {
  const [state, formAction, pending] = useActionState(updateEvent, INITIAL);
  const startsAtRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!startsAtRef.current) return;
    const d = new Date(event.starts_at);
    const pad = (n: number) => n.toString().padStart(2, "0");
    startsAtRef.current.value = `${d.getFullYear()}-${pad(
      d.getMonth() + 1
    )}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, [event.starts_at]);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <div className="border-2 border-foreground bg-card shadow-[6px_6px_0_0_var(--foreground)]">
        <div className="border-b-2 border-foreground bg-brand px-6 py-5">
          <div className="text-xs font-bold uppercase tracking-widest">
            / edit
          </div>
          <div className="font-heading text-2xl font-black uppercase tracking-tighter">
            이벤트 수정
          </div>
        </div>

        <form action={formAction}>
          <input type="hidden" name="id" value={event.id} />
          <div className="flex flex-col gap-5 px-6 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                defaultValue={event.title}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="host_name">주최자</Label>
                <Input
                  id="host_name"
                  name="host_name"
                  defaultValue={event.host_name}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="starts_at">시작 일시</Label>
                <Input
                  ref={startsAtRef}
                  id="starts_at"
                  name="starts_at"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">장소 (선택)</Label>
              <Input
                id="location"
                name="location"
                defaultValue={event.location ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cover">커버 이미지 교체 (선택)</Label>
              {event.image_url && (
                <div className="mb-1 flex items-center gap-3 border-2 border-dashed border-foreground/40 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image_url}
                    alt="현재 커버"
                    className="h-16 w-24 border-2 border-foreground object-cover"
                  />
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    현재 커버 · 새 파일 고르면 교체
                  </span>
                </div>
              )}
              <Input
                id="cover"
                name="cover"
                type="file"
                accept="image/*"
                className="cursor-pointer pt-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">소개 (선택)</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={event.description ?? ""}
              />
            </div>
            {state.error && (
              <div className="border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
                {state.error}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 border-t-2 border-foreground bg-muted px-6 py-4">
            <Button
              render={<Link href={`/e/${event.id}`} />}
              nativeButton={false}
              variant="ghost"
              size="sm"
            >
              취소
            </Button>
            <Button type="submit" variant="brand" size="lg" disabled={pending}>
              {pending ? "저장 중..." : "저장 →"}
            </Button>
          </div>
        </form>
      </div>

      <form
        action={deleteEvent}
        onSubmit={(e) => {
          if (!confirm("정말 이 이벤트를 삭제할까요? 복구 안 됩니다.")) {
            e.preventDefault();
          }
        }}
        className="mt-6 border-2 border-destructive bg-destructive/5 p-5 shadow-[4px_4px_0_0_var(--destructive)]"
      >
        <input type="hidden" name="id" value={event.id} />
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-destructive">
              / danger zone
            </div>
            <div className="mt-0.5 text-sm font-bold">
              이벤트를 삭제하면 RSVP 내역도 함께 사라집니다.
            </div>
          </div>
          <Button type="submit" variant="destructive" size="sm">
            삭제
          </Button>
        </div>
      </form>
    </div>
  );
}
