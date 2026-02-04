"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Terminal } from "lucide-react";
import { IconLoader } from "@tabler/icons-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const result = await signInAction(email, password);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result?.error || "Erreur inconnue");
      setFieldErrors(result?.fieldErrors || {});
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-3 border-accent bg-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-display text-2xl font-bold uppercase tracking-wider">Connexion</CardTitle>
          <CardDescription className="text-base font-medium text-black">
            Entrez vos identifiants pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-2 border-white bg-white/10 text-white rounded-none" variant="default">
              <AlertDescription className="font-semibold text-white">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="font-bold uppercase tracking-wide text-xs">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  className={cn("focus-visible:ring-accent", fieldErrors.email ? "border-white focus-visible:ring-white" : "border-input")}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-white font-bold">{fieldErrors.email[0]}</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-bold uppercase tracking-wide text-xs">Mot de passe</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs font-semibold underline-offset-4 hover:underline hover:text-accent transition-colors"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  type="password"
                  className={cn("focus-visible:ring-accent", fieldErrors.password ? "border-white focus-visible:ring-white" : "border-input")}
                />
                {fieldErrors.password && (
                  <p className="text-xs text-white font-bold">{fieldErrors.password[0]}</p>
                )}
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <Button disabled={loading} type="submit" className="w-full h-12 bg-secondary text-black border-3 border-accent rounded-none uppercase font-display font-bold tracking-widest hover:bg-accent hover:border-secondary transition-all duration-300">
                  {loading ? (
                    <IconLoader className="animate-spin" stroke={2} />
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm font-medium">
              Pas encore de compte ?{" "}
              <a href="/signup" className="underline underline-offset-4 hover:text-accent transition-colors font-bold">
                S'inscrire
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}