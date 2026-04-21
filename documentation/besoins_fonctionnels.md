# Besoins fonctionnels

## 1. Objectif du document

Ce document décrit les besoins fonctionnels de l'application FuelTrack, en s'appuyant sur les fonctionnalités effectivement implémentées côté frontend et backend.

## 2. Périmètre fonctionnel couvert

FuelTrack couvre les domaines suivants:

- authentification et gestion de session
- gestion des référentiels de base
- gestion des stocks dépôt/station
- gestion des approvisionnements et livraisons
- gestion des ventes station et des dettes clients
- gestion des alertes automatiques
- tableaux de bord, rapports et impression

## 3. Acteurs et rôles

Rôles pris en charge:

1. Administrateur
2. Gestionnaire de stock
3. Responsable logistique
4. Responsable station
5. Superviseur

Chaque rôle dispose de droits de lecture/écriture spécifiques selon l'entité et la page.

## 4. Besoins fonctionnels détaillés

### BF-01 Authentification

- Le système doit permettre la connexion par email et mot de passe.
- Le système doit refuser les identifiants invalides.
- Le système doit retourner le profil utilisateur connecté (id, nom, rôle, statut).

### BF-02 Gestion des utilisateurs

- L'administrateur doit pouvoir créer, modifier, consulter et supprimer des utilisateurs.
- Le système doit masquer les mots de passe dans les réponses API.
- Le système doit permettre la mise à jour de profil utilisateur connecté via la page paramètres.

### BF-03 Gestion des référentiels métier

Le système doit permettre la gestion CRUD des entités suivantes:

- fournisseurs
- dépôts
- stations
- types carburant
- véhicules
- clients

### BF-04 Gestion des prix et taux de change

- Le système doit permettre d'enregistrer des prix unitaires carburant par station.
- Le système doit permettre de gérer le taux USD/CDF par station.
- Les ventes station doivent utiliser le prix actif et le taux actif.

### BF-05 Gestion des stocks

- Le système doit gérer les stocks par dépôt (`stocks_depots`) et par station (`stocks_stations`).
- Le système doit permettre des ajustements de stock (entrée/sortie) via des endpoints dédiés.
- Chaque ajustement doit générer un mouvement de stock traçable.

### BF-06 Approvisionnements

- Le système doit permettre la création, la modification, la consultation et la suppression d'approvisionnements.
- Le système doit synchroniser automatiquement l'impact d'un approvisionnement sur le stock dépôt.
- Le système doit historiser les mouvements associés.

### BF-07 Livraisons

- Le système doit permettre la création, la modification, la consultation et la suppression de livraisons.
- Le système doit synchroniser automatiquement la sortie dépôt et l'entrée station selon le statut de livraison.
- Le système doit maintenir la cohérence stock/mouvement en cas de mise à jour ou annulation.

### BF-08 Mouvements de stock

- Le système doit enregistrer tous les mouvements (entrée/sortie dépôt, entrée/sortie station, transfert).
- Le système doit permettre la consultation chronologique des mouvements.
- Le système doit proposer une fiche de stock filtrable (site, carburant, période) imprimable.

### BF-09 Ventes station

- Le système doit permettre l'enregistrement d'une vente station avec client, carburant, quantité, devise et réduction.
- Le système doit calculer montant brut, montant net, montant payé et dette restante.
- Le système doit décrémenter le stock station après validation d'une vente.
- Le système doit créer automatiquement un mouvement de type `sortie_station`.
- Le système doit permettre l'enregistrement de paiements partiels/complémentaires sur dette.

### BF-10 Gestion des dettes

- Le système doit calculer automatiquement la dette restante par vente.
- Le système doit afficher la liste des dettes en cours.
- Le système doit permettre le paiement partiel ou total selon le rôle autorisé.

### BF-11 Alertes automatiques

- Le système doit générer automatiquement les alertes de stock (`stock_faible`, `stock_critique`) selon `seuil_alerte` et `quantite_disponible`.
- Le système ne doit pas autoriser la création/modification/suppression manuelle d'alertes métier.
- Le système doit marquer une alerte comme consultée lors de l'ouverture du détail (passage `nouvelle` vers `en_cours`).
- Le badge de notifications doit afficher le nombre d'alertes `nouvelle`.

### BF-12 Tableau de bord

- Le système doit afficher des compteurs globaux (utilisateurs, fournisseurs, dépôts, stations, véhicules, approvisionnements, livraisons, alertes ouvertes).
- Le système doit afficher des stocks critiques et livraisons récentes.
- Le système doit permettre la navigation vers les modules liés.

### BF-13 Rapports

- Le système doit produire des rapports agrégés sur:
	- approvisionnements par carburant
	- livraisons par statut
	- alertes par niveau

### BF-14 Autorisations et sécurité d'accès

- Le système doit contrôler les autorisations par rôle et par méthode (lecture/écriture).
- Le système doit refuser les accès non autorisés avec un message explicite.
- Le frontend doit adapter les actions disponibles selon les droits (`r`/`rw`).

### BF-15 Impression

- Le système doit proposer un bouton d'impression global sur les pages de gestion.
- Le système doit permettre une impression propre de la fiche de stock.
- Le système doit imprimer les listes sans éléments non pertinents (sidebar, boutons d'action).

## 5. Exigences transverses de comportement

- Toute opération modifiant le stock doit conserver la cohérence entre stock courant et mouvements.
- Les actions critiques doivent retourner des messages clairs de succès/erreur.
- La saisie doit valider les champs obligatoires côté API.

## 6. Priorisation (MoSCoW)

### Must Have

- authentification
- gestion CRUD des référentiels principaux
- gestion approvisionnements/livraisons/mouvements
- ventes station + dettes
- alertes automatiques
- gestion des rôles et autorisations

### Should Have

- tableau de bord synthétique
- rapports agrégés
- impression des fiches/listes

### Could Have

- enrichissement des exports (PDF structuré, Excel)
- notifications avancées multicanal

## 7. Critères d'acceptation globaux

- Les scénarios métier principaux s'exécutent sans rupture de cohérence de stock.
- Les utilisateurs ne peuvent effectuer que les actions autorisées par leur rôle.
- Les alertes de stock apparaissent et évoluent automatiquement selon les seuils.
- Les ventes et dettes sont consultables de manière fiable et traçable.
