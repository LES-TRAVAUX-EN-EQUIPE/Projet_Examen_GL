# Presentation du projet FuelTrack

## Slide 1 - Titre

**FuelTrack**  
Systeme de gestion des approvisionnements, stocks, livraisons et ventes de carburant  
Province du Nord-Kivu

- Equipe: LES-TRAVAUX-EN-EQUIPE
- Cours: Examen GL
- Date: Avril 2026

---

## Slide 2 - Contexte et probleme

### Contexte
La gestion du carburant dans plusieurs depots et stations pose des problemes frequents:

- manque de tracabilite des mouvements
- erreurs manuelles de saisie
- difficultes de suivi des stocks et livraisons
- suivi incomplet des ventes et dettes clients

### Probleme principal
Comment centraliser et fiabiliser toute la chaine d'approvisionnement carburant, de la reception jusqu'a la vente finale?

---

## Slide 3 - Objectif du projet

### Objectif general
Concevoir une application web qui permet de suivre, controler et analyser en temps reel les operations carburant.

### Objectifs specifiques

- gerer les acteurs (utilisateurs, fournisseurs, clients)
- gerer les infrastructures (depots, stations, vehicules)
- automatiser les flux operationnels (approvisionnement, livraison, vente)
- maintenir la coherence des stocks
- produire des tableaux de bord et rapports de decision

---

## Slide 4 - Solution proposee

FuelTrack est une application de gestion integree qui relie:

1. l'approvisionnement fournisseur -> depot
2. la distribution depot -> station
3. la vente station -> client

### Valeur ajoutee

- reduction des erreurs
- gain de temps operationnel
- visibilite globale sur l'etat du carburant
- meilleure prise de decision grace aux indicateurs

---

## Slide 5 - Architecture generale

### Stack technique

- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: PHP 8.x (API REST JSON)
- Base de donnees: MySQL/MariaDB

### Organisation

- interface web par modules metier
- API centralisee pour les operations CRUD et regles metier
- base relationnelle avec contraintes d'integrite

---

## Slide 6 - Modules fonctionnels

### Modules metier implementes

- authentification utilisateur
- gestion utilisateurs et roles
- gestion fournisseurs
- gestion depots
- gestion stations-service
- gestion vehicules
- gestion types carburant
- approvisionnements
- livraisons
- mouvements de stock
- ventes station
- dettes clients
- alertes
- rapports
- parametres
- tableau de bord

---

## Slide 7 - Gestion des roles

Le systeme applique des autorisations selon le role:

- Administrateur
- Gestionnaire de stock
- Responsable logistique
- Responsable station
- Superviseur

### Principe
Chaque role voit uniquement les pages et actions autorisees (lecture/ecriture), ce qui renforce la securite fonctionnelle.

---

## Slide 8 - Flux metier automatise

### 1) Approvisionnement
Quand un approvisionnement est recu:

- stock depot augmente
- mouvement stock cree automatiquement

### 2) Livraison
Quand une livraison est marquee livree:

- stock depot diminue
- stock station augmente
- mouvements associes crees

### 3) Vente station
Quand une vente est enregistree:

- stock station diminue
- dette client calculee (si paiement partiel)
- historique de mouvement mis a jour

---

## Slide 9 - Alertes et pilotage

### Alertes automatiques

- stock faible
- stock critique
- evolution du statut d'alerte

### Outils de pilotage

- dashboard avec KPI
- graphiques (stocks, livraisons, alertes, dettes, volumes)
- rapports agreges pour la decision

---

## Slide 10 - Base de donnees (vue globale)

Entites principales:

- roles, utilisateurs
- fournisseurs, clients
- depots, stations, vehicules
- types_carburant
- approvisionnements, livraisons, ventes_station
- stocks_depots, stocks_stations, mouvements_stock
- alertes, prix_carburants, taux_change_stations

### Point fort
La structure assure la tracabilite complete du carburant du fournisseur au client.

---

## Slide 11 - Organisation du travail en equipe

### Methode utilisee

- decoupage en issues GitHub
- attribution des issues par membre
- developpement par module
- integration progressive frontend/backend/BD
- validation collective et documentation

### Benefices

- responsabilites claires
- suivi transparent de l'avancement
- meilleure coordination d'equipe

---

## Slide 12 - Resultats obtenus

- application fonctionnelle de bout en bout
- couverture des besoins majeurs du cahier des charges
- coherence stock/mouvements automatisee
- gestion rolee operationnelle
- documentation et captures completes pour la defense

---

## Slide 13 - Limites actuelles

- logique backend encore tres centralisee dans un seul fichier API
- certains fichiers d'architecture (controleurs/modeles/middleware) restent vides
- securite a renforcer pour une mise en production (CORS, tokens)
- tests automatises encore limites

---

## Slide 14 - Perspectives d'amelioration

### Court terme

- refactoriser le backend par couches (controleurs/services)
- renforcer les validations metier
- completer la matrice de tests executes

### Moyen terme

- introduire JWT ou sessions backend plus robustes
- ajouter des tests automatises API/UI
- ajouter des logs d'audit et indicateurs de performance

---

## Slide 15 - Conclusion

FuelTrack repond au besoin principal de tracabilite et de pilotage de la chaine d'approvisionnement carburant au Nord-Kivu.

Le projet a permis de livrer une solution web complete, utile et evolutive, avec une base solide pour une industrialisation future.

---

## Slide 16 - Demo

### Parcours de demonstration recommande

1. Connexion avec un compte
2. Creation d'un approvisionnement
3. Validation d'une livraison
4. Enregistrement d'une vente station
5. Consultation des alertes et du dashboard
6. Visualisation d'un rapport

---