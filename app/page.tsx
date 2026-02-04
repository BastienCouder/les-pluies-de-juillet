import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-1 flex-col bg-primary h-full">
      <main className="flex flex-1 items-center justify-center">
        <div className="container max-w-2xl text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue{session?.user ? `, ${session.user.name}` : ""}
          </h1>
          <p className="text-muted-foreground mb-8">
            {session?.user
              ? "Vous êtes connecté."
              : "Veuillez vous connecter pour accéder à votre compte."}
          </p>
          {!session?.user && (
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button size="lg">Se connecter</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} My App
        </div>
      </footer>
    </div>
  );
}
