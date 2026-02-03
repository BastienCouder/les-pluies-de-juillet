import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-xl">My App</span>
          </div>
          <nav className="flex items-center gap-2">
            {session?.user ? (
              <>
                <Link href="/account">
                  <Button variant="outline" size="sm">
                    Account
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Log in</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center">
        <div className="container max-w-2xl text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Welcome{session?.user ? `, ${session.user.name}` : ""}
          </h1>
          <p className="text-muted-foreground mb-8">
            {session?.user
              ? "You are logged in."
              : "Please log in to access your account."}
          </p>
          {!session?.user && (
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button size="lg">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} My App
        </div>
      </footer>
    </div>
  );
}
