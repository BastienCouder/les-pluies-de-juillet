import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conference, userProgramItem } from "@/lib/db/schema/conference";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ConferenceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const conf = await db.query.conference.findFirst({
        where: eq(conference.id, id),
    });

    if (!conf) {
        notFound();
    }

    const session = await auth.api.getSession({ headers: await headers() });
    let isInProgram = false;

    if (session?.user) {
        const item = await db.query.userProgramItem.findFirst({
            where: and(
                eq(userProgramItem.userId, session.user.id),
                eq(userProgramItem.conferenceId, id)
            ),
        });
        isInProgram = !!item;
    }

    const maxCapacity = conf.maxCapacity || Infinity;
    const attendees = conf.attendees || 0;
    const isFull = attendees >= maxCapacity;
    const percentage = Math.min(100, (attendees / maxCapacity) * 100);

    return (
        <div className="container py-10 max-w-4xl">
            <Link href="/conferences" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent mb-6 transition-colors">
                <ArrowLeft size={20} /> Retour au programme
            </Link>

            <div className="bg-white border-2 border-festival-black p-8 festival-shadow">
                <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                    <div className="flex-1">
                        <div className="bg-accent text-accent-foreground inline-block px-3 py-1 font-bold uppercase text-sm rounded mb-4">
                            {conf.theme}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase text-festival-black mb-6">
                            {conf.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-lg mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-accent" />
                                <span className="font-bold">
                                    {new Date(conf.startAt).toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="text-accent" />
                                <span className="font-bold">
                                    {new Date(conf.startAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                    {" - "}
                                    {new Date(conf.endAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {conf.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-accent" />
                                    <span>{conf.location}</span>
                                </div>
                            )}
                        </div>

                        <div className="prose max-w-none text-lg leading-relaxed text-gray-700 mb-8">
                            {conf.description}
                        </div>

                        {conf.speakerName && (
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border-l-4 border-accent">
                                <div className="bg-gray-200 p-3 rounded-full">
                                    <User size={32} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase text-gray-500 font-bold">Intervenant</p>
                                    <p className="text-xl font-bold">{conf.speakerName}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-80 space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="font-bold uppercase mb-4 text-center">État des inscriptions</h3>
                            {isFull && !isInProgram ? (
                                <div className="bg-destructive text-destructive-foreground text-center py-2 font-bold uppercase rounded mb-4">
                                    Complet
                                </div>
                            ) : (
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>Places occupées</span>
                                        <span>{attendees} / {maxCapacity === Infinity ? "Illimité" : maxCapacity}</span>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-1000", isFull ? "bg-destructive" : "bg-green-500")}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {!session?.user ? (
                                <Link href="/login">
                                    <Button className="w-full uppercase font-bold" variant="secondary">
                                        Se connecter pour s'inscrire
                                    </Button>
                                </Link>
                            ) : (
                                <div className="text-center text-sm text-gray-600">
                                    {isInProgram ? (
                                        <p className="text-green-600 font-bold flex items-center justify-center gap-2">
                                            <Check className="w-5 h-5" /> Inscrit au programme
                                        </p>
                                    ) : (
                                        <p>Inscrivez-vous via la liste principale.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function Check({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
