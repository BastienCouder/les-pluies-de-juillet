"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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
    name: string
) {
    try {
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
        });

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