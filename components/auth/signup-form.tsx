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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    if (!rgpdConsent) {
      setError("Vous devez accepter la politique de confidentialité");
      setFieldErrors({ rgpdConsent: ["Vous devez accepter la politique de confidentialité"] });
      setLoading(false);
      return;
    }

    const result = await signUpAction(email, password, firstName, lastName, rgpdConsent);

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
          <CardTitle className="font-display text-2xl font-bold uppercase tracking-wider">Créer un compte</CardTitle>
          <CardDescription className="text-base font-medium text-black">Commencez avec votre nouveau compte</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-2 border-white bg-white/10 text-white rounded-none" variant="default">
              <Terminal className="h-4 w-4" />
              <AlertDescription className="font-semibold text-white">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-6">
                <div className="grid gap-3 w-full">
                  <Label htmlFor="firstName" className="font-bold uppercase tracking-wide text-xs">Prénom</Label>
                  <Input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    id="firstName"
                    type="text"
                    className={cn("focus-visible:ring-accent", fieldErrors.firstName ? "border-white focus-visible:ring-white" : "border-input")}
                  />
                  {fieldErrors.firstName && <p className="text-xs text-white font-bold">{fieldErrors.firstName[0]}</p>}
                </div>
                <div className="grid gap-3 w-full">
                  <Label htmlFor="lastName" className="font-bold uppercase tracking-wide text-xs">Nom</Label>
                  <Input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    id="lastName"
                    type="text"
                    className={cn("focus-visible:ring-accent", fieldErrors.lastName ? "border-white focus-visible:ring-white" : "border-input")}
                  />
                  {fieldErrors.lastName && <p className="text-xs text-white font-bold">{fieldErrors.lastName[0]}</p>}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email" className="font-bold uppercase tracking-wide text-xs">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  className={cn("focus-visible:ring-accent", fieldErrors.email ? "border-white focus-visible:ring-white" : "border-input")}
                />
                {fieldErrors.email && <p className="text-xs text-white font-bold">{fieldErrors.email[0]}</p>}
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
                {fieldErrors.password && <p className="text-xs text-white font-bold">{fieldErrors.password[0]}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="rgpd"
                    checked={rgpdConsent}
                    onCheckedChange={(checked) => setRgpdConsent(checked as boolean)}
                    className={cn(fieldErrors.rgpdConsent ? "border-white" : "border-black data-[state=checked]:bg-accent data-[state=checked]:text-black")}
                  />
                  <Label
                    htmlFor="rgpd"
                    className={cn("text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", fieldErrors.rgpdConsent ? "text-white" : "")}
                  >
                    J'accepte la{" "}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-accent font-bold">
                      politique de confidentialité
                    </a>
                  </Label>
                </div>
                {fieldErrors.rgpdConsent && <p className="text-xs text-white font-bold ml-6">{fieldErrors.rgpdConsent[0]}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <Button disabled={loading || !rgpdConsent} type="submit" className="w-full h-12 bg-secondary text-black border-3 border-accent rounded-none uppercase font-display font-bold tracking-widest hover:bg-accent hover:border-secondary transition-all duration-300">
                  {loading ? (
                    <IconLoader className="animate-spin" stroke={2} />
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm font-medium">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="underline underline-offset-4 hover:text-accent transition-colors font-bold">
                Se connecter
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}