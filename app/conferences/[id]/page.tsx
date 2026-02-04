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
            <Link href="/conferences" className="inline-flex items-center gap-2 text-accent hover:text-accent mb-6 transition-colors">
                <ArrowLeft size={20} /> Retour au conférences
            </Link>

            <div className="border-4 border-accent p-8">
                <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                    <div className="flex-1">
                        <div className="bg-accent text-foreground inline-block px-3 py-1 font-bold uppercase text-sm rounded mb-4">
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

                        <div className="prose max-w-none text-lg leading-relaxed mb-8">
                            {conf.description}
                        </div>

                        {conf.speakerName && (
                            <>
                                <p className="text-sm uppercase font-bold">Intervenant :</p>
                                <p className="text-xl font-bold">{conf.speakerName}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}