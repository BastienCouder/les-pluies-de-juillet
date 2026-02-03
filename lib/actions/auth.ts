"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema/profile";
import { user } from "@/lib/db/schema/auth";
import { userConsent } from "@/lib/db/schema/consent";
import { eq } from "drizzle-orm";
import { translateAuthError } from "@/lib/utils";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

export async function signInAction(email: string, password: string) {
    try {
        const validation = signInSchema.safeParse({ email, password });
        if (!validation.success) {
            return {
                success: false,
                error: "Détails incorrects",
                fieldErrors: validation.error.flatten().fieldErrors,
            };
        }

        const result = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        return { success: true, data: result };
    } catch (error: any) {
        return {
            success: false,
            error: translateAuthError(error),
        };
    }
}

export async function signUpAction(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    rgpdConsent: boolean
) {
    try {
        const validation = signUpSchema.safeParse({
            email,
            password,
            firstName,
            lastName,
            rgpdConsent
        });

        if (!validation.success) {
            return {
                success: false,
                error: "Veuillez vérifier les champs.",
                fieldErrors: validation.error.flatten().fieldErrors,
            };
        }

        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: "",
            },
        });

        if (result?.user?.id) {
            await db.insert(profile).values({
                userId: result.user.id,
                firstName,
                lastName,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            if (rgpdConsent) {
                await db.insert(userConsent).values({
                    userId: result.user.id,
                    type: "PRIVACY_ACCEPTED",
                    version: "v1",
                    acceptedAt: new Date(),
                });
            }
        }

        return { success: true, data: result };
    } catch (error: any) {
        return {
            success: false,
            error: translateAuthError(error),
        };
    }
}

export async function signOutAction() {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Échec de la déconnexion",
        };
    }
}

export async function deleteAccountAction() {
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

        const anonymizedId = `deleted-${session.user.id}-${Date.now()}`;

        await db.transaction(async (tx) => {
            await tx
                .update(user)
                .set({
                    email: `${anonymizedId}@deleted.local`,
                    name: "Deleted User",
                    deletedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(user.id, session.user.id));

            await tx
                .update(profile)
                .set({
                    firstName: "Deleted",
                    lastName: "User",
                    updatedAt: new Date(),
                })
                .where(eq(profile.userId, session.user.id));
        });

        await auth.api.signOut({
            headers: await headers(),
        });

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Échec de la suppression du compte",
        };
    }
}