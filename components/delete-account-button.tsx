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
            <Card className="p-0 m-0 bg-primary border-none shadow-none">
                <CardHeader className="p-0 m-0">
                    <CardTitle className="text-white">Supprimer le compte</CardTitle>
                </CardHeader>
                <CardContent className="p-0 m-0">
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
        <Card className="p-0 m-0 bg-primary border-none shadow-none">
                <CardHeader className="p-0 m-0">
                <CardTitle className="text-white">Confirmer la suppression</CardTitle>
                <CardDescription className="text-white">
                    Cette action est irréversible. Votre compte sera marqué comme supprimé.
                </CardDescription>
            </CardHeader>
                  <CardContent className="p-0 m-0">
                {error && (
                      <Alert className="mb-4 border-2 border-white bg-white/10 text-white rounded-none">
                        <AlertDescription className="text-white">{error}</AlertDescription>
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