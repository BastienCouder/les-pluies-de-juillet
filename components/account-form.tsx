"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { updateProfileAction } from "@/lib/actions/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface AccountFormProps {
    initialFirstName: string;
    initialLastName: string;
    initialEmail: string;
}

export default function AccountForm({
    initialFirstName,
    initialLastName,
    initialEmail,
}: AccountFormProps) {
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const result = await updateProfileAction(firstName, lastName);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || "Impossible de mettre à jour le profil");
        }

        setLoading(false);
    }

    return (
        <>
            <h1 className="text-lg font-medium">Paramètres du compte</h1>
            <p className="text-sm text-muted-foreground mb-2">
                Modifiez les informations de votre compte
            </p>
            <Separator className="mb-4" />

            {error && (
                <Alert className="mb-4 border border-red-500" variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 border border-green-500 bg-green-50 text-green-900">
                    <Terminal className="h-4 w-4 text-green-600" />
                    <AlertDescription>Profil mis à jour avec succès !</AlertDescription>
                </Alert>
            )}

            <form className="lg:w-1/2" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            id="firstName"
                            type="text"
                            placeholder="Achour"
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
                            placeholder="Meguenni"
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

                    <div className="flex flex-col gap-3">
                        <Button disabled={loading} type="submit" className="w-full">
                            {loading ? (
                                <IconLoader className="animate-spin" stroke={2} />
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm">
                    Mot de passe oublié ?{" "}
                    <a href="/login" className="underline underline-offset-4">
                        Réinitialiser le mot de passe
                    </a>
                </div>
            </form>
        </>
    );
}
