"use server";

import { db } from "@/lib/db";
import { conference } from "@/lib/db/schema/conference";
import { userProgramItem } from "@/lib/db/schema/conference";
import { ticket, ticketType } from "@/lib/db/schema/commerce";
import { auth } from "@/lib/auth"; // Better Auth
import { headers } from "next/headers";
import { eq, and, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getConferences() {
    try {
        const conferences = await db.query.conference.findMany({
            orderBy: (conferences, { asc }) => [asc(conferences.startAt)],
        });
        return { success: true, data: conferences };
    } catch (error) {
        console.error("Error fetching conferences:", error);
        return { success: false, error: "Failed to fetch conferences" };
    }
}

export async function getUserProgram() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const program = await db.query.userProgramItem.findMany({
            where: eq(userProgramItem.userId, session.user.id),
            with: {
                conference: true,
            },
        });

        // Flatten to return just conferences
        const conferences = program.map(item => item.conference);
        return { success: true, data: conferences };
    } catch (error) {
        console.error("Error fetching user program:", error);
        return { success: false, error: "Failed to fetch program" };
    }
}

export async function addToProgram(conferenceId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { success: false, error: "Unauthorized" };

        return await db.transaction(async (tx) => {
            // 1. Get Conference Details & Lock row for update (if possible, but plain check is ok for now)
            const conf = await tx.query.conference.findFirst({
                where: eq(conference.id, conferenceId),
            });

            if (!conf) return { success: false, error: "Conference not found" };

            // 2. Capacity Check
            if (conf.maxCapacity && conf.attendees >= conf.maxCapacity) {
                return { success: false, error: "Complet ! Plus de places disponibles." };
            }

            // 3. Check Ticket Validity
            const validTickets = await tx.query.ticket.findMany({
                where: and(
                    eq(ticket.userId, session.user.id),
                    eq(ticket.status, "VALID")
                ),
                with: {
                    type: true
                }
            });

            const hasAccess = validTickets.some(t => {
                if (!t.type.validFrom || !t.type.validUntil) return true;
                const confDate = new Date(conf.startAt);
                return confDate >= t.type.validFrom && confDate <= t.type.validUntil;
            });

            if (!hasAccess) {
                return {
                    success: false,
                    error: "Aucun billet valide pour cette date."
                };
            }

            // 4. Add to Program
            await tx.insert(userProgramItem).values({
                userId: session.user.id,
                conferenceId: conferenceId,
            });

            // 5. Increment Attendees
            await tx.update(conference)
                .set({ attendees: conf.attendees + 1 })
                .where(eq(conference.id, conferenceId));

            revalidatePath("/my-program");
            revalidatePath("/conferences");
            return { success: true };
        });

    } catch (error) {
        console.error("Error adding to program:", error);
        if ((error as any).code === '23505') {
            return { success: false, error: "Déjà ajouté au programme" };
        }
        return { success: false, error: "Erreur lors de l'ajout au programme" };
    }
}

export async function removeFromProgram(conferenceId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { success: false, error: "Unauthorized" };

        return await db.transaction(async (tx) => {
            // 1. Remove from program
            const deleted = await tx.delete(userProgramItem).where(and(
                eq(userProgramItem.userId, session.user.id),
                eq(userProgramItem.conferenceId, conferenceId)
            )).returning();

            if (deleted.length === 0) return { success: false, error: "Item not found" };

            // 2. Decrement Attendees
            // We need to fetch current count first to be safe, or direct raw SQL decrement.
            // Drizzle doesn't have `increment` helper easily in `set`.
            const conf = await tx.query.conference.findFirst({
                where: eq(conference.id, conferenceId),
                columns: { attendees: true }
            });

            if (conf) {
                await tx.update(conference)
                    .set({ attendees: Math.max(0, conf.attendees - 1) })
                    .where(eq(conference.id, conferenceId));
            }

            revalidatePath("/my-program");
            revalidatePath("/conferences");
            return { success: true };
        });

    } catch (error) {
        console.error("Error removing from program:", error);
        return { success: false, error: "Failed to remove" };
    }
}
