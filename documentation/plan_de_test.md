# Plan de test

## 1. Objectif

Valider que FuelTrack respecte les exigences fonctionnelles et non fonctionnelles, avec un focus sur la cohérence des stocks, les autorisations par rôle, les ventes/dettes et les alertes automatiques.

## 2. Périmètre de test

- API backend (auth, CRUD, endpoints spécialisés)
- Frontend (navigation, formulaires, mode lecture/écriture, notifications)
- Base de données (intégrité et cohérence)
- Impression des pages et fiches

## 3. Stratégie

### 3.1 Types de tests

1. Tests unitaires ciblés backend
2. Tests d'intégration API + base de données
3. Tests fonctionnels UI par module
4. Tests de non-régression par rôle
5. Tests d'impression

### 3.2 Données de test

- Utiliser `jeu_donnees_initial.sql` comme base.
- Prévoir des jeux complémentaires pour:
	- stock critique
	- livraisons partielles/annulées
	- dettes avec paiements successifs

## 4. Environnements

- Local Windows
- Backend PHP local (port 8000)
- Frontend statique (ex: 127.0.0.1:5500)
- Base MySQL/MariaDB locale

## 5. Critères d'entrée / sortie

### 5.1 Entrée

- Schéma base chargé
- Données initiales insérées
- Backend et frontend démarrés

### 5.2 Sortie

- 100% des scénarios critiques passés
- 0 anomalie bloquante ouverte
- anomalies majeures corrigées ou contournées validées

## 6. Scénarios de test principaux

### ST-01 Authentification

- Cas valide: connexion avec compte actif -> succès.
- Cas invalide: mot de passe erroné -> rejet 401.

### ST-02 Autorisations par rôle

- Vérifier qu'un rôle lecture ne peut pas créer/modifier/supprimer.
- Vérifier qu'un rôle autorisé exécute bien les actions d'écriture.

### ST-03 CRUD référentiels

- Tester création, modification, consultation, suppression sur fournisseurs, dépôts, stations, carburants, véhicules, clients.

### ST-04 Approvisionnement -> stock dépôt

- Créer un approvisionnement reçu.
- Vérifier hausse de stock dépôt.
- Vérifier mouvement stock généré.

### ST-05 Livraison -> stock dépôt/station

- Créer livraison.
- Passage au statut livré.
- Vérifier baisse dépôt et hausse station.
- Vérifier mouvements associés.

### ST-06 Vente station

- Créer vente avec quantité valide.
- Vérifier calcul montants (brut/net/paye/restant).
- Vérifier baisse stock station et mouvement `sortie_station`.

### ST-07 Dette et paiements

- Créer vente avec paiement partiel.
- Enregistrer paiement complémentaire.
- Vérifier plafond sur `montant_paye`.

### ST-08 Alertes automatiques

- Provoquer seuil bas sur stock.
- Vérifier apparition alerte `nouvelle`.
- Consulter détail alerte.
- Vérifier transition vers `en_cours` et baisse du badge.

### ST-09 Rapports et tableau de bord

- Vérifier agrégats rapports cohérents avec les données.
- Vérifier compteurs dashboard et listes récentes.

### ST-10 Impression

- Lancer impression sur pages listes et fiche de stock.
- Vérifier lisibilité et absence d'éléments parasites.

## 7. Matrice de couverture (extrait)

1. Auth -> BF-01
2. Rôles/permissions -> BF-14, BNF-03
3. Approvisionnement/livraison -> BF-06, BF-07, RG-10..RG-16
4. Vente/dette -> BF-09, BF-10, RG-17..RG-23
5. Alertes -> BF-11, RG-24..RG-27

## 8. Gestion des anomalies

- Classer: bloquante, majeure, mineure.
- Pour chaque anomalie: reproduire, journaliser, corriger, retester.
- Exécuter une non-régression ciblée après correction.

## 9. Rapport de test attendu

Le rapport final doit contenir:

- contexte d'exécution
- jeux de données utilisés
- cas exécutés et résultats
- anomalies constatées
- décision de recette (go/no-go)

