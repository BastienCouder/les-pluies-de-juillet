import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/auth/logout-button";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {session.user.name}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Profile</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Manage your account settings
                    </p>
                    <Link href="/account">
                        <Button variant="outline" className="w-full">
                            Go to Account
                        </Button>
                    </Link>
                </div>

                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">User Info</h2>
                    <div className="space-y-2 mb-4">
                        <p className="text-sm">
                            <span className="font-medium">Email:</span>{" "}
                            <span className="text-muted-foreground">{session.user.email}</span>
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Name:</span>{" "}
                            <span className="text-muted-foreground">{session.user.name}</span>
                        </p>
                    </div>
                    <LogoutButton />
                </div>
            </div>

            <div className="mt-6">
                <Link href="/">
                    <Button variant="ghost">← Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}
