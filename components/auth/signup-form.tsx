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
              <div className="flex flex-row gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="firstName" className={fieldErrors.firstName ? "text-red-500" : ""}>Prénom</Label>
                  <Input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    id="firstName"
                    type="text"
                    className={fieldErrors.firstName ? "border-red-500" : ""}

                  />
                  {fieldErrors.firstName && <p className="text-xs text-red-500 font-medium">{fieldErrors.firstName[0]}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastName" className={fieldErrors.lastName ? "text-red-500" : ""}>Nom</Label>
                  <Input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    id="lastName"
                    type="text"
                    className={fieldErrors.lastName ? "border-red-500" : ""}

                  />
                  {fieldErrors.lastName && <p className="text-xs text-red-500 font-medium">{fieldErrors.lastName[0]}</p>}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email" className={fieldErrors.email ? "text-red-500" : ""}>Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  className={fieldErrors.email ? "border-red-500" : ""}
                />
                {fieldErrors.email && <p className="text-xs text-red-500 font-medium">{fieldErrors.email[0]}</p>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className={fieldErrors.password ? "text-red-500" : ""}>Mot de passe</Label>
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
                  className={fieldErrors.password ? "border-red-500" : ""}
                />
                {fieldErrors.password && <p className="text-xs text-red-500 font-medium">{fieldErrors.password[0]}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="rgpd"
                    checked={rgpdConsent}
                    onCheckedChange={(checked) => setRgpdConsent(checked as boolean)}
                    className={fieldErrors.rgpdConsent ? "border-red-500" : ""}

                  />
                  <Label
                    htmlFor="rgpd"
                    className={cn("text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", fieldErrors.rgpdConsent ? "text-red-500" : "")}
                  >
                    J'accepte la{" "}
                    <a href="/privacy" className="underline underline-offset-4">
                      politique de confidentialité
                    </a>
                  </Label>
                </div>
                {fieldErrors.rgpdConsent && <p className="text-xs text-red-500 font-medium ml-6">{fieldErrors.rgpdConsent[0]}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <Button disabled={loading || !rgpdConsent} type="submit" className="w-full">
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
