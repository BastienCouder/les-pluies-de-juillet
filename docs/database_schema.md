# Structure de la Base de Données

## A. Identité / Auth (Minimisé)
**`users`**
- `id` (UUID, PK) : Identifiant unique.
- `email` (Unique) : Email de l'utilisateur.
- `role` (Enum: `USER`, `ADMIN`, `STAFF_SCAN`) : Rôle applicatif.
- `status` (Enum: `ACTIVE`, `DISABLED`) : État du compte.
- `createdAt`, `updatedAt` : Dates de suivi.
- `deletedAt` (Nullable) : Soft delete pour la rétention.
- `anonymizedAt` (Nullable) : Date d'anonymisation RGPD.

*Note : Pas de données personnelles directes ici.*

**`user_credentials`** (Optionnel - Séparation Auth)
- `userId` (PK, FK `users`)
- `passwordHash` : Hash du mot de passe.
- `updatedAt` : Date de dernière modification du mot de passe.

*Auth tables gérées par Better Auth : `accounts`, `sessions`, `verification_tokens` (selon config).*

## B. Profil (Données Métier)
**`profiles`**
- `userId` (PK, FK `users`) : Lien 1-1.
- `firstName` (Nullable) : Prénom.
- `lastName` (Nullable) : Nom.
- `phone` (Nullable) : Téléphone (pour contact urgence/billet).
- `createdAt`, `updatedAt` : Dates de suivi.

## C. Conférences
**`conferences`**
- `id` (PK)
- `title` : Titre de la conférence.
- `description` : Texte descriptif.
- `theme` : Thématique (ex: Écologie, Tech...).
- `startAt` : Date/Heure de début.
- `endAt` : Date/Heure de fin.
- `speakerName` (Optionnel) : Intervenant.
- `location` (Optionnel) : Salle ou lieu.
- `createdAt`, `updatedAt`

## D. Programme Personnalisé
**`user_program_items`**
- `userId` (FK `users`)
- `conferenceId` (FK `conferences`)
- `createdAt`
- *Contrainte unique* : `(userId, conferenceId)` pour éviter les doublons.

## E. Billetterie
**`ticket_types`**
- `id` (PK)
- `name` : Nom du pass (ex: "Pass 2 Jours").
- `description` (Nullable)
- `priceCents` : Prix en centimes.
- `currency` : Devise (ex: "eur").
- `capacity` : Quota total disponible.
- `isActive` : Vente ouverte ou fermée.
- `salesStartAt` (Nullable), `salesEndAt` (Nullable) : Période de vente.
- `validFrom` (Nullable), `validUntil` (Nullable) : Période de validité du billet (pour restreindre l'accès au programme).
- `createdAt`, `updatedAt`

**`orders`**
- `id` (PK)
- `userId` (FK `users`) : Acheteur.
- `status` (Enum: `DRAFT`, `PENDING_PAYMENT`, `PAID`, `CANCELED`, `REFUNDED`)
- `totalCents` : Montant total.
- `currency` : Devise.
- `createdAt`, `updatedAt`

**`order_items`**
- `id` (PK)
- `orderId` (FK `orders`)
- `ticketTypeId` (FK `ticket_types`)
- `quantity` : Nombre de billets.
- `unitPriceCents` : Prix unitaire au moment de l'achat.
- `lineTotalCents` : Total pour cette ligne.

**`payments`**
- `id` (PK)
- `orderId` (FK `orders`)
- `provider` (ex: "stripe")
- `status` (Enum: `INIT`, `SUCCEEDED`, `FAILED`, `REFUNDED`)
- `stripeCheckoutSessionId` (Unique) : ID Session Stripe.
- `stripePaymentIntentId` (Nullable) : ID Paiement Stripe.
- `createdAt`, `updatedAt`

## F. Billets & Entrée
**`tickets`**
- `id` (PK)
- `userId` (FK `users`) : Propriétaire du billet.
- `orderId` (FK `orders`) : Lien commande.
- `ticketTypeId` (FK `ticket_types`) : Type de billet.
- `status` (Enum: `VALID`, `USED`, `CANCELED`)
- `issuedAt` : Date d'émission.
- `usedAt` (Nullable) : Date de scan.
- `usedByUserId` (Nullable, FK `users`) : Staff qui a scanné.

**`ticket_tokens`**
- `id` (PK)
- `ticketId` (FK `tickets`)
- `tokenHash` : Hash du token/QR pour vérification sécurisée.
- `createdAt`
- `expiresAt` (Nullable) : Validité temporaire du QR.

## G. Emails (Logs)
**`email_logs`** (Optionnel)
- `id` (PK)
- `userId` (Nullable)
- `type` (Enum: `ORDER_CONFIRMED`, `TICKET_SENT`, `RESET_PASSWORD`)
- `providerMessageId` (Nullable)
- `status` (Enum: `SENT`, `FAILED`)
- `createdAt`

## H. Consentements
**`user_consents`**
- `id` (PK)
- `userId` (FK `users`)
- `type` (Enum: `TERMS_ACCEPTED`, `PRIVACY_ACCEPTED`, `MARKETING_OPTIN`)
- `version` (ex: "2026-01")
- `acceptedAt` : Date d'acceptation.
- `ipHash` (Optionnel) : Preuve technique.
- `userAgent` (Optionnel)

## I. Audit
**`audit_logs`** (Optionnel)
- `id` (PK)
- `actorUserId` (FK `users`) : Qui a fait l'action (Admin/Staff).
- `action` (Enum ou String) : Quoi (ex: "SCAN_TICKET", "UPDATE_QUOTA").
- `entityType` : Sur quoi (ex: "ticket").
- `entityId` : ID de l'objet.
- `meta` (JSON) : Détails.
- `createdAt`
