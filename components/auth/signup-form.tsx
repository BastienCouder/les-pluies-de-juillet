"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/lib/actions/auth";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "../ui/alert";
import { Terminal } from "lucide-react";
import { IconLoader } from "@tabler/icons-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!rgpdConsent) {
      setError("Vous devez accepter la politique de confidentialité");
      setLoading(false);
      return;
    }

    const result = await signUpAction(email, password, firstName, lastName, rgpdConsent);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>Commencez avec votre nouveau compte</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border border-red-500" variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  id="firstName"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  id="lastName"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="rgpd"
                  checked={rgpdConsent}
                  onCheckedChange={(checked) => setRgpdConsent(checked as boolean)}
                  required
                />
                <Label
                  htmlFor="rgpd"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte la{" "}
                  <a href="/privacy" className="underline underline-offset-4">
                    politique de confidentialité
                  </a>
                </Label>
              </div>
              <div className="flex flex-col gap-3">
                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? (
                    <IconLoader className="animate-spin" stroke={2} />
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
                <Button variant="outline" className="w-full">
                  S'inscrire avec Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="underline underline-offset-4">
                Se connecter
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
