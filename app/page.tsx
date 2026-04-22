import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="flex max-w-xl flex-col items-center gap-3 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          moim
        </h1>
        {user ? (
          <p className="text-muted-foreground">
            환영해요, <span className="font-medium">{user.email}</span> 님.
          </p>
        ) : (
          <p className="text-muted-foreground">
            로그인하고 모임을 만들어보세요.
          </p>
        )}
      </div>
    </div>
  );
}
