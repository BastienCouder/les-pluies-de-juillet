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
import { getUserTickets } from "@/lib/actions/commerce";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketActions } from "@/components/ticketing/ticket-actions";
import { TicketQRZoom } from "@/components/ticketing/ticket-qr-zoom";

export default async function AccountPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const [userProfile, tickets] = await Promise.all([
        db.query.profile.findFirst({
            where: eq(profile.userId, session.user.id)
        }),
        getUserTickets()
    ]);

    const activeTicket = tickets.find((t: any) => t.status === "VALID");

    return (
        <div className="container py-12 max-w-5xl">
            <div className="mb-8 flex items-center gap-4">
                <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-accent">Mon Compte</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-accent border-3 bg-primary">
                        <CardHeader>
                            <CardTitle className="uppercase font-display tracking-wider">Informations Personnelles</CardTitle>
                            <CardDescription className="text-foreground">Gérez vos informations de connexion et de profil.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AccountForm
                                initialFirstName={userProfile?.firstName || ""}
                                initialLastName={userProfile?.lastName || ""}
                                initialEmail={session.user.email}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-accent border-3 bg-primary">
                        <CardContent>
                            <DeleteAccountButton />
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <h2 className="text-xl font-bold font-display uppercase tracking-wider mb-4 flex items-center gap-2 text-accent">
                        Mon Billet
                    </h2>

                    {activeTicket ? (
                        <Card className="border-accent  border-2 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground overflow-hidden shadow-xl relative">
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full z-10" />
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full z-10" />

                            <CardHeader className="pb-2 text-center border-b border-white/10 border-dashed">
                                <CardTitle className="text-lg font-display uppercase tracking-widest text-accent-foreground/90">
                                    {activeTicket.type.name}
                                </CardTitle>
                                <div className="text-4xl font-bold font-display my-2">
                                    {`${userProfile?.firstName} ${userProfile?.lastName}`}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 flex flex-col items-center justify-center gap-4">
                                <div className="bg-white p-2 rounded-lg shadow-inner">
                                    <TicketQRZoom qrCodeUrl={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${activeTicket.qrCode}`} />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 pt-2 pb-6 px-6">
                                <TicketActions ticketId={activeTicket.id} />
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2 border-muted bg-muted/5">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                <p className="text-foreground">Aucun billet actif.</p>
                                <Link href="/billetterie">
                                    <Button variant="outline">
                                        Aller à la billetterie
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}