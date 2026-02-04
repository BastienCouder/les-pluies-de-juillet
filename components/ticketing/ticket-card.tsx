"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TicketCardProps {
    ticket: {
        id: string;
        name: string;
        description: string | null;
        priceCents: number;
        currency: string;
        validFrom: Date | null;
        validUntil: Date | null;
        remainingStock?: number;
        isSoldOut?: boolean;
        salesStartAt?: Date | null;
        salesEndAt?: Date | null;
    };
    isLoggedIn?: boolean;
    isOwned?: boolean;
    hasAnyTicket?: boolean;
}


import { buyTicket } from "@/lib/actions/commerce";
import { useState } from "react";

export function TicketCard({ ticket, isLoggedIn = false, isOwned = false, hasAnyTicket = false }: TicketCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const isSoldOut = ticket.isSoldOut || (ticket.remainingStock !== undefined && ticket.remainingStock <= 0);

    const handleBuy = async () => {
        if (isOwned || hasAnyTicket) {
            router.push("/account");
            return;
        }

        if (isSoldOut) return;

        if (!isLoggedIn) {
            toast.error("Veuillez vous inscrire ou vous connecter pour acheter un billet.");
            router.push("/login");
            return;
        }

        setLoading(true);
        toast.info("Achat en cours...");

        try {
            const res = await buyTicket(ticket.id);
            if (res.success) {
                toast.success("Billet acheté avec succès ! 🎟️");
                router.refresh();
            } else {
                toast.error(res.error || "Erreur lors de l'achat");
            }
        } catch (e) {
            toast.error("Erreur inattendue");
        } finally {
            setLoading(false);
        }
    };

    const priceFormatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: ticket.currency
    }).format(ticket.priceCents / 100);

    return (
        <Card className={cn("border-3 relative overflow-hidden group transition-all flex flex-col h-full",
            isSoldOut && !isOwned ? "border-gray-200 bg-gray-50 opacity-80" : "border-accent bg-primary"
        )}>
            {ticket.name.toLowerCase().includes("week-end") && !isSoldOut && (
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 font-bold text-sm uppercase rounded-bl-lg">
                    Populaire
                </div>
            )}
            {isSoldOut && !isOwned && (
                <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-3 py-1 font-bold text-sm uppercase rounded-bl-lg">
                    Complet
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-2xl font-display uppercase tracking-tighter text-foreground">
                    {ticket.name}
                </CardTitle>
                <CardDescription className="text-foreground/80 font-medium">
                    {ticket.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className={cn("text-4xl font-bold text-accent mb-4 font-display", isSoldOut && !isOwned && "text-black")}>
                    {priceFormatted}
                </div>
                <ul className="space-y-2 text-sm">
                    <li className="flex gap-2 items-center"><Check size={16} className={cn("text-accent", isSoldOut && !isOwned && "text-black")} /> Entrée pour le festival</li>
                    <li className="flex gap-2 items-center"><Check size={16} className={cn("text-accent", isSoldOut && !isOwned && "text-black")} /> Accès aux conférences</li>
                    {ticket.validFrom && ticket.validUntil && (
                        <li className="flex gap-2 items-center"><Check size={16} className={cn("text-accent", isSoldOut && !isOwned && "text-black")} />
                            {(() => {
                                const start = new Date(ticket.validFrom!);
                                const end = new Date(ticket.validUntil!);
                                const isSameDay = start.toDateString() === end.toDateString();

                                if (isSameDay) {
                                    return `Valide le ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`;
                                } else {
                                    const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

                                    const startDay = start.getDate();
                                    const endDay = end.getDate();
                                    const month = start.toLocaleDateString('fr-FR', { month: 'long' });
                                    const monthIndexStrict = start.getMonth();
                                    const endMonthIndexStrict = end.getMonth();

                                    if (monthIndexStrict === endMonthIndexStrict) {
                                        const diffDays = endDay - startDay;

                                        if (diffDays === 1) {
                                            return `Valide les ${startDay} et ${endDay} ${month}`;
                                        }

                                        if (diffDays === 2) {
                                            return `Valide les ${startDay}, ${startDay + 1} et ${endDay} ${month}`;
                                        }
                                    }

                                    return `Valide du ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`;
                                }
                            })()}
                        </li>
                    )}
                </ul>
                {ticket.remainingStock !== undefined && ticket.remainingStock < 50 && !isSoldOut && (
                    <p className="text-white font-bold text-sm mt-4">
                        Plus que {ticket.remainingStock} place{ticket.remainingStock > 1 ? 's' : ''} !
                    </p>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleBuy}
                    disabled={(isSoldOut && !isOwned) || loading || (() => {
                        const now = new Date();
                        if (ticket.salesStartAt && now < new Date(ticket.salesStartAt)) return true;
                        if (ticket.salesEndAt && now > new Date(ticket.salesEndAt)) return true;
                        return false;
                    })()}
                    variant={isOwned ? "outline" : (hasAnyTicket ? "secondary" : (isLoggedIn ? "default" : "secondary"))}
                    className={cn("w-full font-bold rounded-none uppercase transition-all cursor-pointer",
                        (isSoldOut && !isOwned) || (ticket.salesStartAt && new Date() < new Date(ticket.salesStartAt)) || (ticket.salesEndAt && new Date() > new Date(ticket.salesEndAt)) ?
                            "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300" :
                            isOwned ? "text-foreground bg-accent border-3 text-sm border-secondary px-4 py-1.5 uppercase font-display font-bold tracking-wider hover:opacity-90 transition-all duration-300 hover:bg-secondary hover:border-accent" :
                                hasAnyTicket ? "text-foreground bg-secondary border-3 text-sm border-accent px-4 py-1.5 uppercase font-display font-bold tracking-wider hover:opacity-90 transition-all duration-300 hover:bg-accent hover:border-secondary" :
                                    "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}
                >
                    {(() => {
                        const now = new Date();
                        if (ticket.salesStartAt && now < new Date(ticket.salesStartAt)) return "Vente pas encore disponible";
                        if (ticket.salesEndAt && now > new Date(ticket.salesEndAt)) return "Vente terminée";

                        return loading ? "Traitement..." :
                            isOwned ? "Modifier" :
                                hasAnyTicket ? "Changer" :
                                    isSoldOut ? "Épuisé" :
                                        (isLoggedIn ? "Acheter maintenant" : "Se connecter pour acheter");
                    })()}
                </Button>
            </CardFooter>
        </Card>
    );
}