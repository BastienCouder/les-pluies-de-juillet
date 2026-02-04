# Backlog des Fonctionnalités

## A. Compte & Accès
- [x] **Création de compte / connexion / déconnexion**
- [ ] **Mot de passe oublié / reset**
- [x] **Profil utilisateur** (email, nom, prénom)
- [ ] **Accès réservé** (Gating pour les pages protégées)
- [ ] **Gestion des Rôles** :
  - `USER` (Participant standard)
  - `ADMIN` (Gestion complète)
  - `STAFF_SCAN` (Contrôle d'accès uniquement)

## B. Billetterie
*Objectif : Simple et efficace, sans sur-ingénierie.*
- [ ] **Catalogue des passes** :
  - Pass Jour 1
  - Pass Jour 2
  - Pass Jour 3
  - Pass Week-end
  - *Options tarifaires* : Tarif standard, Tarif solidaire, Tarif soutien.
  - *Note* : Tous donnent accès à l'événement, mais diffèrent par les jours d'accès, le prix, ou le public cible.
- [ ] **Achat via Stripe Checkout**
- [ ] **Page “Mes billets”** (Visualisation des commandes passées)
- [ ] **Statut commande** :
  - En attente
  - Payée
  - Annulée
- [ ] **Confirmation** : Envoi d'email de confirmation avec le billet joint.

## C. Stock / Quotas
- [ ] **Capacité par type de billet** (Gestion des stocks)
- [ ] **Affichage disponibilité** : “Reste X places” ou “Complet”.
- [ ] **Blocage achat** automatique si complet.
- [ ] **Anti-survente** : Gestion transactionnelle en base de données pour éviter les race conditions.

## D. Billet & Entrée (Scan)
- [ ] **Billet numérique** : Génération PDF/Web (Page dédiée + Email).
- [ ] **Sécurité** : QR code signé (crypto via JWT ou secret partagé) ou code unique.
- [ ] **Page “Scan”** : Interface dédiée pour le staff.
- [ ] **Validation** : Vérification de la validité + Marquage du billet comme “utilisé” (check-in unique).
- [ ] **Historique scan** (Optionnel).

## E. Conférences & Programme Perso
- [x] **Liste des conférences**
- [ ] **Filtres** :
  - Par date (Jour 1, Jour 2...)
  - Par thématique
- [x] **Détail d’une conférence**
- [x] **Gestion “Mon programme”** : Ajouter / retirer des conférences.
- [x] **Affichage “Mon programme”** : Vue filtrée par jour des favoris.

## F. Administration
- [ ] **CRUD Conférences** : Créer, Modifier, Supprimer les talks.
- [ ] **CRUD Billets & Quotas** : Gérer les types de passes et les stocks.
- [ ] **Suivi Commandes/Paiements** : Liste des transactions.
- [ ] **Gestion Utilisateurs** : Voir les inscrits et modifier les rôles (ex: promouvoir un Staff).
- [ ] **Export CSV** (Optionnel) : Export des inscrits/commandes.

## G. Emails / Notifications
- [ ] **Confirmation achat**
- [ ] **Envoi du Billet** (QR code + lien d'accès)
- [ ] **Rappel avant événement** (Optionnel - J-1)
- [ ] **Infos pratiques** (Optionnel)
