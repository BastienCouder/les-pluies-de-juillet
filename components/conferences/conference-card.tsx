"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Check } from "lucide-react";
import { addToProgram, removeFromProgram } from "@/lib/actions/conference";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ConferenceCardProps {
    conference: {
        id: string;
        title: string;
        description: string;
        theme: string;
        startAt: Date;
        endAt: Date;
        location: string | null;
        speakerName: string | null;
        maxCapacity?: number | null;
        attendees?: number;
    };
    isInProgram?: boolean;
    isLoggedIn?: boolean;
    allowedRanges?: { start: number, end: number }[];
    hideCapacity?: boolean;
    program?: boolean;
}

export function ConferenceCard({
    conference,
    isInProgram = false,
    isLoggedIn = false,
    allowedRanges = [],
    hideCapacity = false,
    program = false
}: ConferenceCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(isInProgram);

    const confTime = new Date(conference.startAt).getTime();
    const hasAccess = isLoggedIn && (allowedRanges.length === 0 ? false : allowedRanges.some(r => confTime >= r.start && confTime <= r.end));

    const maxCapacity = conference.maxCapacity || Infinity;
    const attendees = conference.attendees || 0;
    const isFull = attendees >= maxCapacity && !added;
    const handleToggle = async () => {
        if (!isLoggedIn) {
            toast.error("Veuillez vous connecter pour gérer votre programme");
            router.push("/login");
            return;
        }

        if (isFull && !added) return;

        setLoading(true);
        if (added) {
            const res = await removeFromProgram(conference.id);
            if (res.success) {
                setAdded(false);
                toast.success("Retiré du programme");
            } else {
                toast.error(res.error || "Erreur");
            }
        } else {
            const res = await addToProgram(conference.id);
            if (res.success) {
                setAdded(true);
                toast.success("Ajouté au programme !");
            } else {
                toast.error(res.error || "Impossible d'ajouter");
            }
        }
        setLoading(false);
        router.refresh();
    };

    return (
        <Card className={cn("flex flex-col border-3 border-accent h-full transition-colors bg-primary relative overflow-hidden",
            isFull ? "opacity-90 grayscale-[0.5]" : ""
        )}>
            {isFull && (
                <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-3 py-1 font-bold text-xs uppercase z-10 rounded-bl-lg">
                    Complet
                </div>
            )}

            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div className="bg-secondary text-foreground text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {conference.theme}
                    </div>
                </div>
                <CardTitle className="mt-2 text-xl font-display uppercase tracking-tight text-foreground">
                    {conference.title}
                </CardTitle>
                <CardDescription className="flex items-center text-foreground gap-4 mt-2">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-accent" />
                        <span>
                            {new Date(conference.startAt).toLocaleDateString("fr-FR", { weekday: 'short', day: 'numeric', month: 'short' })}
                            {" - "}
                            {new Date(conference.startAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    {conference.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-accent" />
                            <span>{conference.location}</span>
                        </div>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-foreground line-clamp-3 mb-4">
                    {conference.description}
                </p>
                {conference.speakerName && (
                    <p className="text-sm font-semibold text-foreground mb-4">
                        Intervenant : {conference.speakerName}
                    </p>
                )}
                {!program && !hideCapacity && hasAccess && conference.maxCapacity && conference.maxCapacity < 1000 && (
                    <div className="mt-auto pt-2">
                        <div className="text-xs font-bold uppercase foreground mb-1">
                            Places : {attendees} / {maxCapacity}
                        </div>
                        <div className="w-full bg-accent h-2 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full transition-all", isFull ? "bg-destructive" : "bg-secondary")}
                                style={{ width: `${Math.min(100, (attendees / maxCapacity) * 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="w-full flex flex-col gap-2">
                <Link href={`/conferences/${conference.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        Voir la fiche
                    </Button>
                </Link>
                {isLoggedIn && hasAccess && (
                    <Button
                        onClick={handleToggle}
                        disabled={loading || (isFull && !added)}
                        variant={added ? "outline" : "default"}
                        className={cn(
                            "w-full",
                            added ? "bg-accent" : "",
                            (isFull) && !added && "opacity-50 cursor-not-allowed bg-gray-400"
                        )}
                    >
                        {loading ? "..." : added ? "Retirer du programme" : isFull ? "Complet" : "Ajouter au programme"}
                    </Button>
                )}
            </CardFooter>

        </Card>
    );
}
