"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema/profile";

export async function signInAction(email: string, password: string) {
    try {
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
            error: error.message || "Failed to sign in",
        };
    }
}

export async function signUpAction(
    email: string,
    password: string,
    firstName: string,
    lastName: string
) {
    try {
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: `${firstName} ${lastName}`,
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
        }

        return { success: true, data: result };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to sign up",
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
            error: error.message || "Failed to sign out",
        };
    }
}