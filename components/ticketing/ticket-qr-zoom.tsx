"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";
import { useState } from "react";

export function TicketQRZoom({ qrCodeUrl }: { qrCodeUrl: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                    <div className="bg-white p-2 rounded-lg shadow-inner transition-transform group-hover:scale-105">
                        <img
                            src={qrCodeUrl}
                            alt="Ticket QR Code"
                            className="w-32 h-32 object-contain mix-blend-multiply"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg pointer-events-none">
                        <ZoomIn className="text-black/50" />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex items-center justify-center bg-white border-none p-10">
                <img
                    src={qrCodeUrl}
                    alt="Ticket QR Code Large"
                    className="w-80 h-80 object-contain mix-blend-multiply"
                />
            </DialogContent>
        </Dialog>
    );
}
