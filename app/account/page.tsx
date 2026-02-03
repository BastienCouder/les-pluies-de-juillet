import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountForm from "@/components/account-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="container max-w-2xl py-8">
            <div className="mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost">← Back to Dashboard</Button>
                </Link>
            </div>

            <AccountForm
                initialName={session.user.name}
                initialEmail={session.user.email}
            />
        </div>
    );
}
