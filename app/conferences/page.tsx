import { getConferences, getUserProgram } from "@/lib/actions/conference";
import { ConferenceCard } from "@/components/conferences/conference-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ConferencesPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    const [allConferencesRes, userProgramRes] = await Promise.all([
        getConferences(),
        getUserProgram()
    ]);

    const conferences = allConferencesRes.data || [];
    const userProgramIds = new Set(userProgramRes.data?.map((c: any) => c.id) || []);

    return (
        <div className="container py-10">
            <div className="mb-10 text-center">
                <h1 className="lg:text-4xl text-2xl font-display font-bold uppercase tracking-widest text-foreground mb-4">
                    Programmation <span className="text-accent">2026</span>
                </h1>
                <p className="max-w-2xl mx-auto">
                    Découvrez les conférences qui façonneront le monde de demain.
                    Ajoutez-les à votre programme personnel pour ne rien rater.
                </p>
            </div>

            {/* TODO: Add Filters Component Here */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {conferences.map((conf: any) => (
                    <ConferenceCard
                        key={conf.id}
                        conference={conf}
                        isInProgram={userProgramIds.has(conf.id)}
                        isLoggedIn={!!session?.user}
                    />
                ))}
            </div>

            {conferences.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    Aucune conférence annoncée pour le moment.
                </div>
            )}
        </div>
    );
}
