"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal, Trash2 } from "lucide-react";

export default function DeleteAccountButton() {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);
        setError("");

        const result = await deleteAccountAction();

        if (result.success) {
            router.push("/");
            router.refresh();
        } else {
            setError(result?.error || "Erreur inconnue");
            setLoading(false);
        }
    }

    if (!showConfirm) {
        return (
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">Supprimer le compte</CardTitle>
                    <CardDescription>
                        Supprimer définitivement votre compte et toutes les données associées
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="destructive"
                        onClick={() => setShowConfirm(true)}
                        className="w-full"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer mon compte
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-red-500">
            <CardHeader>
                <CardTitle className="text-red-600">Confirmer la suppression</CardTitle>
                <CardDescription>
                    Cette action est irréversible. Votre compte sera marqué comme supprimé.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert className="mb-4 border-red-500" variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowConfirm(false)}
                        disabled={loading}
                        className="flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? "Suppression..." : "Oui, supprimer"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
