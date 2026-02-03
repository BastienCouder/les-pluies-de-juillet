import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountForm from "@/components/account-form";
import DeleteAccountButton from "@/components/delete-account-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema/index";
import { eq } from "drizzle-orm";

export default async function AccountPage() {
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

    return (
        <div className="container max-w-2xl py-8">
            <div className="mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost">← Retour au tableau de bord</Button>
                </Link>
            </div>

            <div className="space-y-6">
                <AccountForm
                    initialFirstName={userProfile?.firstName || ""}
                    initialLastName={userProfile?.lastName || ""}
                    initialEmail={session.user.email}
                />

                <DeleteAccountButton />
            </div>
        </div>
    );
}
