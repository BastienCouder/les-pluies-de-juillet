import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide."),
    password: z.string().min(1, "Le mot de passe est obligatoire."),
});

export const signUpSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    rgpdConsent: z.boolean().refine((val) => val === true, "Vous devez accepter la politique de confidentialité."),
});

export const updateProfileSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
});