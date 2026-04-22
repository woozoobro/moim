"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, type NewEventState } from "./actions";

const INITIAL: NewEventState = { error: null };

export function NewEventForm() {
  const [state, formAction, pending] = useActionState(createEvent, INITIAL);

  return (
    <div className="flex flex-1 items-start justify-center p-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>새 이벤트 만들기</CardTitle>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="host_name">주최자</Label>
              <Input id="host_name" name="host_name" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="starts_at">시작 일시</Label>
              <Input
                id="starts_at"
                name="starts_at"
                type="datetime-local"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">장소 (선택)</Label>
              <Input id="location" name="location" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cover">커버 이미지 (선택)</Label>
              <Input
                id="cover"
                name="cover"
                type="file"
                accept="image/*"
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">소개 (선택)</Label>
              <Textarea id="description" name="description" rows={4} />
            </div>
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "저장 중..." : "이벤트 만들기"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
