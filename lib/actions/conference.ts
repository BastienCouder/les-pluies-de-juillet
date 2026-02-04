"use server";

import { db } from "@/lib/db";
import { conference } from "@/lib/db/schema/conference";
import { userProgramItem } from "@/lib/db/schema/conference";
import { ticket } from "@/lib/db/schema/commerce";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getConferences(options?: {
    page?: number;
    limit?: number;
    theme?: string;
    date?: string;
    search?: string;
}) {
    try {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const offset = (page - 1) * limit;

        const conditions = [];

        if (options?.theme && options.theme !== "all") {
            conditions.push(eq(conference.theme, options.theme));
        }

        if (options?.date) {
            const dateStrings = options.date.split(',');
            const dateConditions = dateStrings.map(dateStr => {
                const dateStart = new Date(dateStr);
                dateStart.setHours(0, 0, 0, 0);
                const dateEnd = new Date(dateStr);
                dateEnd.setHours(23, 59, 59, 999);
                return and(
                    sql`${conference.startAt} >= ${dateStart.toISOString()}`,
                    sql`${conference.startAt} <= ${dateEnd.toISOString()}`
                );
            });

            if (dateConditions.length > 0) {
                conditions.push(or(...dateConditions));
            }
        }

        if (options?.search) {
            const searchLower = `%${options.search.toLowerCase()}%`;
            conditions.push(sql`(lower(${conference.title}) LIKE ${searchLower} OR lower(${conference.theme}) LIKE ${searchLower})`);
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, totalCount] = await Promise.all([
            db.query.conference.findMany({
                where: whereClause,
                orderBy: (conferences, { asc }) => [asc(conferences.startAt)],
                limit: limit,
                offset: offset,
            }),
            db.select({ count: sql<number>`count(*)` })
                .from(conference)
                .where(whereClause)
                .then(res => Number(res[0]?.count || 0))
        ]);

        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
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
            const conf = await tx.query.conference.findFirst({
                where: eq(conference.id, conferenceId),
            });

            if (!conf) return { success: false, error: "Conference not found" };

            if (conf.maxCapacity && conf.attendees >= conf.maxCapacity) {
                return { success: false, error: "Complet ! Plus de places disponibles." };
            }

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

            await tx.insert(userProgramItem).values({
                userId: session.user.id,
                conferenceId: conferenceId,
            });

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
            const deleted = await tx.delete(userProgramItem).where(and(
                eq(userProgramItem.userId, session.user.id),
                eq(userProgramItem.conferenceId, conferenceId)
            )).returning();

            if (deleted.length === 0) return { success: false, error: "Item not found" };

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