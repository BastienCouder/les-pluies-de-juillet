import { getTicketTypes } from "@/lib/actions/commerce";
import { TicketCard } from "@/components/ticketing/ticket-card";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function BilletteriePage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const [{ data: tickets }, userTickets] = await Promise.all([
        getTicketTypes(),
        import("@/lib/actions/commerce").then(mod => mod.getUserTickets())
    ]);

    const ownedTicketTypeIds = new Set(userTickets?.map((t: any) => t.ticketTypeId) || []);
    console.log(ownedTicketTypeIds);

    return (
        <div className="container py-10">
            <div className="mb-10 text-center">
                <h1 className="lg:text-4xl text-2xl font-display font-bold uppercase tracking-widest text-accent mb-4">
                    Billetterie
                </h1>
                <p className="max-w-xl mx-auto">
                    Réservez votre place pour l'événement de l'année.
                    Places limitées.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tickets?.map((ticket: any) => (
                    <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        isLoggedIn={!!session?.user}
                        isOwned={ownedTicketTypeIds.has(ticket.id)}
                        hasAnyTicket={userTickets && userTickets.length > 0}
                    />
                ))}
            </div>
            {(!tickets || tickets.length === 0) && (
                <div className="text-center py-20 text-muted-foreground">
                    La billetterie n'est pas encore ouverte.
                </div>
            )}
        </div>
    );
}