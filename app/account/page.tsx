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
import { Ticket } from "lucide-react";
import { TicketActions } from "@/components/ticketing/ticket-actions";

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
                <Link href="/dashboard">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">← Retour</Button>
                </Link>
                <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-accent">Mon Compte</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="uppercase font-display tracking-wider">Informations Personnelles</CardTitle>
                            <CardDescription>Gérez vos informations de connexion et de profil.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AccountForm
                                initialFirstName={userProfile?.firstName || ""}
                                initialLastName={userProfile?.lastName || ""}
                                initialEmail={session.user.email}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-destructive uppercase font-display tracking-wider">Zone de Danger</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeleteAccountButton />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Ticket */}
                <div className="md:col-span-1">
                    <h2 className="text-xl font-bold font-display uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Ticket className="text-accent" /> Mon Billet
                    </h2>

                    {activeTicket ? (
                        <Card className="border-accent bg-gradient-to-br from-primary to-primary/90 text-primary-foreground overflow-hidden shadow-xl relative">
                            {/* Decorative circles */}
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full z-10" />
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full z-10" />

                            <CardHeader className="pb-2 text-center border-b border-white/10 border-dashed">
                                <CardTitle className="text-lg font-display uppercase tracking-widest text-accent-foreground/90">
                                    {activeTicket.type.name}
                                </CardTitle>
                                <div className="text-4xl font-bold font-display my-2">
                                    {userProfile?.firstName || session.user.name?.split(' ')[0]}
                                </div>
                                <CardDescription className="text-primary-foreground/70 text-xs uppercase tracking-widest">
                                    Pass Festival
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 flex flex-col items-center justify-center gap-4">
                                <div className="bg-white p-2 rounded-lg shadow-inner">
                                    {/* QR Code Simulation */}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${activeTicket.qrCode}`}
                                        alt="Ticket QR Code"
                                        className="w-32 h-32 object-contain mix-blend-multiply"
                                    />
                                </div>
                                <p className="text-xs text-center opacity-70 font-mono break-all px-4">
                                    #{activeTicket.id.slice(0, 8)}
                                </p>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 pt-2 pb-6 px-6 bg-black/20">
                                <div className="text-center w-full mb-2">
                                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold uppercase tracking-wider">
                                        Valide
                                    </span>
                                </div>
                                <TicketActions ticketId={activeTicket.id} />
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2 border-muted bg-muted/5">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                <Ticket size={48} className="text-muted-foreground/50" />
                                <p className="text-muted-foreground">Aucun billet actif.</p>
                                <Link href="/billetterie">
                                    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white uppercase font-bold text-xs">
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
