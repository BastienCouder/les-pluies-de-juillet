import { z } from "zod";

export const conferenceFiltersSchema = z.object({
    page: z.number().int().min(1, "La page doit être au moins 1").optional().default(1),
    limit: z.number().int().min(1).max(100, "La limite maximale est 100").optional().default(10),
    date: z.string().datetime({ message: "Date invalide" }).optional(),
    theme: z.string().min(1, "Le thème ne peut pas être vide").optional(),
});

export type ConferenceFilters = z.infer<typeof conferenceFiltersSchema>;