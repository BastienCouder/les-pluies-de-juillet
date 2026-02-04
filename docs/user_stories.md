# User Stories

## Épic A — Auth & Comptes
- [x] **Création de compte** : En tant que visiteur, je veux créer un compte avec mon email et un mot de passe afin d’accéder aux fonctionnalités du festival.
- [x] **Connexion** : En tant qu’utilisateur, je veux me connecter afin d’accéder à mon espace personnel.
- [x] **Déconnexion** : En tant qu’utilisateur, je veux me déconnecter afin de sécuriser mon compte sur un appareil partagé.
- [x] **Accès protégé** : En tant que visiteur non connecté, je veux être redirigé vers la page de connexion si j’essaie d’accéder à une page réservée.
- [x] **Gestion du profil minimal** : En tant qu’utilisateur, je veux consulter et mettre à jour les informations basiques de mon profil (nom/prénom).
- [ ] **Réinitialisation du mot de passe** (Optionnel) : En tant qu’utilisateur, je veux réinitialiser mon mot de passe si je l’ai oublié.

## Épic B — Conférences (Consultation)
- [x] **Voir la liste des conférences** : En tant qu’utilisateur, je veux voir la liste des conférences afin de découvrir le programme.
- [ ] **Filtrer par date** : En tant qu’utilisateur, je veux filtrer les conférences par date.
- [ ] **Filtrer par thématique** : En tant qu’utilisateur, je veux filtrer par thématique pour cibler mes intérêts.
- [x] **Voir le détail d’une conférence** : En tant qu’utilisateur, je veux consulter le détail d’une conférence (description, horaire, lieu).

## Épic C — Programme Personnalisé
- [x] **Ajouter une conférence** : En tant qu’utilisateur, je veux ajouter une conférence à mon programme pour planifier ma journée.
- [x] **Retirer une conférence** : En tant qu’utilisateur, je veux retirer une conférence de mon programme.
- [x] **Voir mon programme** : En tant qu’utilisateur, je veux consulter mon programme personnel.
- [x] **Éviter les doublons** : Le système empêche d’ajouter deux fois la même conférence.

## Épic D — Billetterie & Paiement (Stripe)
- [ ] **Voir les types de billets** : En tant que visiteur, je veux voir les types de passes disponibles.
- [ ] **Acheter un billet** : En tant qu’utilisateur, je veux acheter un billet en ligne pour m’inscrire.
- [ ] **Confirmation de paiement** : En tant qu’utilisateur, je veux recevoir une confirmation immédiate après paiement.
- [ ] **Voir mes billets** : En tant qu’utilisateur, je veux retrouver mes billets dans mon espace.
- [ ] **Annulation/Échec** : En tant qu’utilisateur, je veux être informé si le paiement échoue.

## Épic E — Quotas / Stock
- [ ] **Voir la disponibilité** : En tant que visiteur, je veux savoir si un billet est complet.
- [ ] **Empêcher la survente** : En tant qu’organisateur, je veux que le système bloque les ventes une fois la jauge atteinte.

## Épic F — Billet Numérique & Accès (QR/Scan)
- [ ] **Recevoir mon billet par email** : En tant qu’utilisateur, je veux recevoir mon billet par email.
- [ ] **Billet avec QR Code** : En tant qu’utilisateur, je veux un QR code scannable sur mon billet.
- [ ] **Scanner un billet (Staff)** : En tant que staff, je veux scanner un billet pour valider l’entrée.
- [ ] **Empêcher la réutilisation** : En tant qu’organisateur, je veux qu’un billet déjà scanné soit refusé.
- [ ] **Voir résultat du scan** : En tant que staff, je veux voir immédiatement si le billet est Valide ou Invalide.

## Épic G — Admin (CRUD + Rôles)
- [ ] **Gérer les conférences** : En tant qu’admin, je veux créer/modifier/supprimer des conférences.
- [ ] **Gérer les billets & quotas** : En tant qu’admin, je veux configurer les types de billets et stocks.
- [ ] **Voir commandes/paiements** : En tant qu’admin, je veux suivre les ventes.
- [ ] **Gérer utilisateurs & rôles** : En tant qu’admin, je veux attribuer des rôles (Staff, Admin).

## Épic H — Emails & Notifications
- [ ] **Email de bienvenue** : En tant qu’utilisateur, je veux confirmer la création de mon compte.
- [ ] **Email billet/confirmation** : En tant qu’utilisateur, je veux recevoir mon billet et ma facture.
- [ ] **Infos pratiques** : En tant qu’organisateur, je veux envoyer des infos pratiques aux participants.

## Épic I — RGPD & Conformité
- [x] **Politique de confidentialité** : En tant que visiteur, je veux accéder à la politique de confidentialité.
- [ ] **Accéder à mes données** : En tant qu’utilisateur, je veux consulter mes données personnelles.
- [x] **Supprimer mon compte** : En tant qu’utilisateur, je veux pouvoir supprimer mon compte et mes données.
- [x] **Limiter la collecte** : En tant qu’organisateur, je ne collecte que le strict nécessaire.

## Épic J — Non-fonctionnel
- [ ] **Accessibilité clavier** : Navigation possible sans souris.
- [ ] **Performance catalogue** : Chargement rapide des conférences.
- [ ] **Sécurité actions sensibles** : Protection des routes Admin et Scan.
