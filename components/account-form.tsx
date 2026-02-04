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
import Link from "next/link";

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
            {error && (
                <Alert className="mb-4 border-2 border-white bg-white/10 text-white rounded-none" variant="default">
                    <AlertDescription className="font-semibold text-white">{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                    <Alert className="mb-4 border-2 border-white bg-white/10 text-white rounded-none">
                        <AlertDescription className="text-white">Profil mis à jour avec succès !</AlertDescription>
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
                        <Button disabled={loading} type="submit">
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
                    <Link href="/login" className="underline underline-offset-4 hover:text-accent hover:cursor-pointer hover:underline-accent">
                        Réinitialiser le mot de passe
                    </Link>
                </div>
            </form>
        </>
    );
}
