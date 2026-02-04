import { getUserProgram } from "@/lib/actions/conference";
import { ConferenceCard } from "@/components/conferences/conference-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserTickets } from "@/lib/actions/commerce";

export default async function MyProgramPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect("/login");
    }

    const [programRes, ticketsRes] = await Promise.all([
        getUserProgram(),
        getUserTickets()
    ]);

    const program = programRes.data || [];
    const tickets = ticketsRes || [];

    const allowedRanges = tickets.map((t: any) => ({
        start: t.type.validFrom ? new Date(t.type.validFrom).getTime() : null,
        end: t.type.validUntil ? new Date(t.type.validUntil).getTime() : null
    })).filter((r: any) => r.start && r.end);

    const groupedByDay: Record<string, any[]> = {};
    program.forEach((conf: any) => {
        const date = new Date(conf.startAt);
        const key = date.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' });
        if (!groupedByDay[key]) {
            groupedByDay[key] = [];
        }
        groupedByDay[key].push(conf);
    });

    const sortedDays = Object.keys(groupedByDay).sort((a, b) => {
        return groupedByDay[a][0].startAt > groupedByDay[b][0].startAt ? 1 : -1;
    });

    return (
        <div className="container py-10">
            <div className="mb-10 text-center">
                <h1 className="lg:text-4xl text-2xl font-display font-bold uppercase tracking-widest text-foreground mb-4">
                    Mon <span className="text-accent">Programme</span>
                </h1>
                <p className="max-w-2xl mx-auto mb-8">
                    Retrouvez ici toutes les conférences que vous avez sélectionnées.
                </p>
                <Link href="/conferences">
                    <Button variant="outline">Parcourir le catalogue</Button>
                </Link>
            </div>

            {(!program || program.length === 0) ? (
                <div className="text-center py-20 bg-secondary/5 rounded-3xl border-2 border-dashed border-secondary/20 max-w-2xl mx-auto">
                    <p className="text-lg font-medium text-foreground mb-4">Votre programme est vide pour le moment.</p>
                    <Link href="/conferences">
                        <Button variant="default">Découvrir les conférences</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-12 max-w-5xl mx-auto">
                    {sortedDays.map((day) => (
                        <div key={day}>
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-lg lg:text-2xl font-display font-bold uppercase tracking-widest text-accent whitespace-nowrap">
                                    {day}
                                </h2>
                                <div className="h-px w-full bg-border" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupedByDay[day]
                                    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                                    .map((conf: any) => (
                                        <ConferenceCard
                                            key={conf.id}
                                            conference={conf}
                                            isInProgram={true}
                                            isLoggedIn={true}
                                            allowedRanges={allowedRanges}
                                            program={true}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
