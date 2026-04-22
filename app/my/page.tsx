import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function MyEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("id, title, host_name, starts_at, location")
    .eq("owner_id", user.id)
    .order("starts_at", { ascending: true });

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          내 이벤트
        </h1>
        <Button render={<Link href="/new" />} nativeButton={false} size="sm">
          새 이벤트
        </Button>
      </div>

      {!events || events.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            아직 만든 이벤트가 없어요.{" "}
            <Link href="/new" className="underline underline-offset-4">
              첫 이벤트 만들기
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((e) => (
            <Link key={e.id} href={`/e/${e.id}`} className="block">
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex flex-col gap-1 py-4">
                  <div className="font-heading text-base font-medium">
                    {e.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(e.starts_at)}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    주최 {e.host_name}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
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
