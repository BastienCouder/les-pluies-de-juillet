import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function translateAuthError(error: any): string {
  const message = error?.body?.message || error?.message || "Une erreur est survenue";

  if (message.includes("User already exists")) {
    return "Un utilisateur avec cet email existe déjà.";
  }
  if (message.includes("Invalid email or password")) {
    return "Email ou mot de passe incorrect.";
  }
  if (message.includes("Invalid password")) {
    return "Mot de passe invalide.";
  }
  if (message.includes("password is too short")) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (message.includes("Failed to create user")) {
    return "Impossible de créer l'utilisateur.";
  }
  if (message.includes("Network Error") || message.includes("fetch")) {
    return "Erreur de connexion au serveur.";
  }

  return message;
}