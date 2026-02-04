"use server";

import { db } from "@/lib/db";
import { ticketType, order, ticket } from "@/lib/db/schema/commerce";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { auth } from "../auth";


export async function getTicketTypes() {
    try {
        const [types, festivalDays] = await Promise.all([
            db.query.ticketType.findMany({
                where: eq(ticketType.isActive, true),
                orderBy: (types, { asc }) => [asc(types.validFrom), asc(types.priceCents)],
            }),
            db.query.festivalDay.findMany()
        ]);

        const dayLimits: Record<string, number> = {};
        festivalDays.forEach(d => {
            const dateKey = d.date.toISOString().split('T')[0];
            dayLimits[dateKey] = d.maxCapacity;
        });

        const dailyUsage: Record<string, number> = {};
        Object.keys(dayLimits).forEach(date => dailyUsage[date] = 0);

        types.forEach(t => {
            if (!t.validFrom || !t.validUntil) return;

            const start = new Date(t.validFrom);
            const end = new Date(t.validUntil);

            festivalDays.forEach(day => {
                const dateKey = day.date.toISOString().split('T')[0];
                const dayStart = new Date(day.date); // 00:00
                const dayEnd = new Date(day.date);
                dayEnd.setHours(23, 59, 59, 999);

                if (start <= dayEnd && end >= dayStart) {
                    if (dailyUsage[dateKey] !== undefined) {
                        dailyUsage[dateKey] += t.soldCount;
                    }
                }
            });
        });

        const typesWithStock = types.map(t => {
            let maxAvailable = 999999;

            if (t.validFrom && t.validUntil) {
                const start = new Date(t.validFrom);
                const end = new Date(t.validUntil);
                let bottleneck = 999999;

                festivalDays.forEach(day => {
                    const dateKey = day.date.toISOString().split('T')[0];
                    const dayStart = new Date(day.date);
                    const dayEnd = new Date(day.date);
                    dayEnd.setHours(23, 59, 59, 999);

                    if (start <= dayEnd && end >= dayStart) {
                        const capacity = dayLimits[dateKey] || 0;
                        const used = dailyUsage[dateKey] || 0;
                        const remainingForDay = capacity - used;

                        if (remainingForDay < bottleneck) {
                            bottleneck = remainingForDay;
                        }
                    }
                });
                maxAvailable = bottleneck;
            }

            const ownRemaining = t.capacity - t.soldCount;

            const realRemaining = Math.max(0, Math.min(ownRemaining, maxAvailable));

            return {
                ...t,
                remainingStock: realRemaining,
                isSoldOut: realRemaining <= 0
            };
        });

        const sortedTypes = typesWithStock.sort((a, b) => {
            const getDuration = (t: typeof a) => {
                if (!t.validFrom || !t.validUntil) return 0;
                return new Date(t.validUntil).getTime() - new Date(t.validFrom).getTime();
            };

            const durationA = getDuration(a);
            const durationB = getDuration(b);
            const isMultiDayA = durationA > 86400000;
            const isMultiDayB = durationB > 86400000;

            if (isMultiDayA !== isMultiDayB) {
                return isMultiDayA ? 1 : -1;
            }

            if (isMultiDayA) {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();

                const getWeight = (name: string) => {
                    if (name.includes("week-end")) return 1;
                    if (name.includes("3 jours") || name.includes("pass complet")) return 2;
                    return 3;
                };

                const weightA = getWeight(nameA);
                const weightB = getWeight(nameB);

                if (weightA !== weightB) return weightA - weightB;

            }

            const dateA = a.validFrom ? new Date(a.validFrom).getTime() : 0;
            const dateB = b.validFrom ? new Date(b.validFrom).getTime() : 0;
            if (dateA !== dateB) return dateA - dateB;

            return a.priceCents - b.priceCents;
        });

        return { success: true, data: sortedTypes };

    } catch (error) {
        console.error("Error fetching ticket types:", error);
        return { success: false, error: "Failed to fetch tickets" };
    }
}

export async function buyTicket(ticketTypeId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const existingTicket = await db.query.ticket.findFirst({
            where: and(
                eq(ticket.userId, session.user.id),
                eq(ticket.status, "VALID")
            )
        });

        if (existingTicket) {
            return { success: false, error: "Vous possédez déjà un billet valide. Veuillez le modifier si besoin." };
        }

        return await db.transaction(async (tx) => {
            const tType = await tx.query.ticketType.findFirst({
                where: eq(ticketType.id, ticketTypeId)
            });

            if (!tType) return { success: false, error: "Ticket not found" };

            if (tType.soldCount >= tType.capacity) {
                return { success: false, error: "Sold out (Ticket Limit)" };
            }

            const now = new Date();
            if (tType.salesStartAt && now < tType.salesStartAt) {
                return { success: false, error: "Sales have not started yet for this ticket." };
            }
            if (tType.salesEndAt && now > tType.salesEndAt) {
                return { success: false, error: "Sales have ended for this ticket." };
            }

            if (tType.validFrom && tType.validUntil) {
                const festivalDays = await tx.query.festivalDay.findMany();
                const allTypes = await tx.query.ticketType.findMany({
                    where: eq(ticketType.isActive, true)
                });

                const dailyUsage: Record<string, number> = {};
                const start = new Date(tType.validFrom);
                const end = new Date(tType.validUntil);

                allTypes.forEach(t => {
                    if (!t.validFrom || !t.validUntil) return;
                    const tStart = new Date(t.validFrom);
                    const tEnd = new Date(t.validUntil);

                    festivalDays.forEach(day => {
                        const dateKey = day.date.toISOString().split('T')[0];
                        const dayStart = new Date(day.date);
                        const dayEnd = new Date(day.date);
                        dayEnd.setHours(23, 59, 59, 999);

                        if (tStart <= dayEnd && tEnd >= dayStart) {
                            dailyUsage[dateKey] = (dailyUsage[dateKey] || 0) + t.soldCount;
                        }
                    });
                });

                for (const day of festivalDays) {
                    const dateKey = day.date.toISOString().split('T')[0];
                    const dayStart = new Date(day.date);
                    const dayEnd = new Date(day.date);
                    dayEnd.setHours(23, 59, 59, 999);

                    if (start <= dayEnd && end >= dayStart) {
                        const currentusage = dailyUsage[dateKey] || 0;
                        if (currentusage + 1 > day.maxCapacity) {
                            return { success: false, error: `Sold out for date ${day.name} (Venue Capacity Reached)` };
                        }
                    }
                }
            }

            const [newOrder] = await tx.insert(order).values({
                userId: session.user.id,
                totalCents: tType.priceCents,
                status: "PAID",
            }).returning();

            await tx.insert(ticket).values({
                userId: session.user.id,
                ticketTypeId: tType.id,
                orderId: newOrder.id,
                status: "VALID",
                qrCode: uuidv4(),
            });

            await tx.update(ticketType)
                .set({ soldCount: sql`${ticketType.soldCount} + 1` })
                .where(eq(ticketType.id, tType.id));

            revalidatePath("/billetterie");
            return { success: true };
        });

    } catch (error) {
        console.error("Purchase error:", error);
        return { success: false, error: "Failed to purchase" };
    }
}

export async function getUserTickets() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return [];

        const tickets = await db.query.ticket.findMany({
            where: and(
                eq(ticket.userId, session.user.id),
                eq(ticket.status, "VALID")
            ),
            with: {
                type: true
            }
        });

        return tickets;
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        return [];
    }
}

export async function cancelUserTicket(ticketId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) return { success: false, error: "Unauthorized" };

        return await db.transaction(async (tx) => {
            const ticketToCancel = await tx.query.ticket.findFirst({
                where: and(
                    eq(ticket.id, ticketId),
                    eq(ticket.userId, session.user.id),
                    eq(ticket.status, "VALID")
                ),
                with: { type: true }
            });

            if (!ticketToCancel) return { success: false, error: "Ticket not found or already cancelled" };

            await tx.update(ticket)
                .set({ status: "REFUNDED" })
                .where(eq(ticket.id, ticketId));

            await tx.update(ticketType)
                .set({ soldCount: sql`${ticketType.soldCount} - 1` })
                .where(eq(ticketType.id, ticketToCancel.ticketTypeId));

            revalidatePath("/billetterie");
            revalidatePath("/account");
            return { success: true };
        });
    } catch (error) {
        console.error("Cancellation error:", error);
        return { success: false, error: "Failed to cancel ticket" };
    }
}