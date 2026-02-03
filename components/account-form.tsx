"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

interface AccountFormProps {
    initialName: string;
    initialEmail: string;
}

export default function AccountForm({
    initialName,
    initialEmail,
}: AccountFormProps) {
    const [fullname, setFullname] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // TODO: Implement update profile server action
        // const result = await updateProfileAction(fullname, email);

        console.log("Update profile:", { fullname, email });

        setTimeout(() => {
            setLoading(false);
            alert("Profile updated successfully!");
        }, 1000);
    }

    return (
        <>
            <h1 className="text-lg font-medium">Account Setting</h1>
            <p className="text-sm text-muted-foreground mb-2">
                Edit your account information
            </p>
            <Separator className="mb-4" />
            <form className="lg:w-1/2" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            onChange={(e) => setFullname(e.target.value)}
                            value={fullname}
                            id="name"
                            type="text"
                            placeholder="Achour Meguenni"
                            required
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            id="email"
                            type="email"
                            placeholder="me@example.com"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button disabled={loading} type="submit" className="w-full">
                            {loading ? (
                                <IconLoader className="animate-spin" stroke={2} />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm">
                    Forgot your password?{" "}
                    <a href="/login" className="underline underline-offset-4">
                        Reset password
                    </a>
                </div>
            </form>
        </>
    );
}
