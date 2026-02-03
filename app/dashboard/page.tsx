import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/auth/logout-button";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema/index";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const [userProfile] = await db
        .select()
        .from(profile)
        .where(eq(profile.userId, session.user.id));

    const displayName =
        userProfile?.firstName && userProfile?.lastName
            ? `${userProfile.firstName} ${userProfile.lastName}`
            : session.user.email;

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
                <p className="text-muted-foreground">
                    Bienvenue, {displayName}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Profil</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Gérez les paramètres de votre compte
                    </p>
                    <Link href="/account">
                        <Button variant="outline" className="w-full">
                            Aller au compte
                        </Button>
                    </Link>
                </div>

                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Infos utilisateur</h2>
                    <div className="space-y-2 mb-4">
                        <p className="text-sm">
                            <span className="font-medium">Email:</span>{" "}
                            <span className="text-muted-foreground">{session.user.email}</span>
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Nom :</span>{" "}
                            <span className="text-muted-foreground">{displayName}</span>
                        </p>
                    </div>
                    <LogoutButton />
                </div>
            </div>

            <div className="mt-6">
                <Link href="/">
                    <Button variant="ghost">← Retour à l'accueil</Button>
                </Link>
            </div>
        </div>
    );
}
