"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cancelUserTicket } from "@/lib/actions/commerce";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function TicketActions({ ticketId }: { ticketId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = async () => {
        setLoading(true);
        try {
            const res = await cancelUserTicket(ticketId);
            if (res.success) {
                toast.success("Billet annulé. Vous pouvez maintenant en choisir un nouveau.");
                router.refresh();
                router.push("/billetterie");
            } else {
                toast.error("Erreur: " + res.error);
            }
        } catch (e) {
            toast.error("Erreur inattendue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleChange}
            disabled={loading}
            variant="secondary"
            className="w-full rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            changer le billet
        </Button>
    );
}