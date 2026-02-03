"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { db } from "../db";
import { profile } from "../db/schema/profile";
import { eq } from "drizzle-orm";

export async function updateProfileAction(firstName: string, lastName: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Non authentifié",
            };
        }

        await db
            .update(profile)
            .set({
                firstName,
                lastName,
                updatedAt: new Date(),
            })
            .where(eq(profile.userId, session.user.id));

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Échec de la mise à jour du profil",
        };
    }
}