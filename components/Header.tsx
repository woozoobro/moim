import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/logout/actions";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-heading text-base font-semibold">
          moim
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                render={<Link href="/" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                둘러보기
              </Button>
              <Button
                render={<Link href="/my" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                내 이벤트
              </Button>
              <Button
                render={<Link href="/new" />}
                nativeButton={false}
                size="sm"
              >
                새 이벤트
              </Button>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                render={<Link href="/login" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                로그인
              </Button>
              <Button
                render={<Link href="/signup" />}
                nativeButton={false}
                size="sm"
              >
                회원가입
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
