# Cahier des charges

## 1. Présentation du projet

### 1.1 Intitulé

FuelTrack - Système de gestion des approvisionnements, stocks, livraisons et ventes de carburant.

### 1.2 Contexte

Le projet vise à informatiser et fiabiliser la gestion opérationnelle d'un réseau de dépôts et stations-service au Nord-Kivu, en assurant la traçabilité complète des flux carburant.

### 1.3 Objectifs

- centraliser les données métier
- réduire les erreurs de saisie et incohérences de stock
- améliorer le suivi des livraisons et ventes
- automatiser la détection des situations de stock critique
- fournir des tableaux de bord et rapports de pilotage

## 2. Portée

### 2.1 Inclus dans la portée

- gestion des utilisateurs et rôles
- gestion référentiels (fournisseurs, dépôts, stations, carburants, véhicules, clients)
- gestion des stocks dépôt/station
- gestion des approvisionnements et livraisons
- gestion des ventes station et dettes
- alertes automatiques de stock
- tableaux de bord, rapports et impression

### 2.2 Hors portée

- intégration bancaire/mobile money en temps réel
- géolocalisation GPS avancée des véhicules
- notifications SMS/Email natives
- comptabilité générale complète

## 3. Parties prenantes

- Maîtrise d'ouvrage: responsables opérationnels du réseau carburant
- Utilisateurs finaux: administrateur, gestionnaire de stock, responsable logistique, responsable station, superviseur
- Équipe technique: développement frontend/backend, base de données, tests

## 4. Exigences fonctionnelles majeures

1. Authentification et gestion des profils
2. Gestion CRUD des entités métier
3. Mécanismes de synchronisation stock/mouvements
4. Gestion des ventes station avec calcul dette
5. Alertes automatiques non éditables manuellement
6. Tableaux de bord et rapports agrégés
7. Impression exploitable des listes et fiches de stock

## 5. Exigences non fonctionnelles majeures

1. Sécurité par rôles et validation stricte des entrées
2. Intégrité transactionnelle des opérations stock
3. Performance acceptable sur usage normal
4. Interface homogène et lisible en thème clair/sombre
5. Maintenabilité et modularité du code

## 6. Contraintes techniques

- Backend: PHP 8.x
- Base de données: MySQL/MariaDB
- Frontend: HTML/CSS/JavaScript (vanilla)
- API: REST JSON
- Exécution locale: serveur PHP + frontend statique (dev local)

## 7. Architecture fonctionnelle synthétique

### 7.1 Noyau données

- rôles, utilisateurs
- référentiels métier
- transactions: approvisionnements, livraisons, mouvements, ventes
- stocks: dépôts/stations
- alertes et rapports

### 7.2 Règles de flux

- approvisionnement recu -> augmente stock dépôt
- livraison livree -> diminue stock dépôt et augmente stock station
- vente station -> diminue stock station et met à jour dette client
- seuil stock dépassé -> création/mise à jour alerte automatique

## 8. Livrables attendus

1. Code source frontend/backend structuré
2. Scripts base de données et jeu de données initial
3. Documentation complète (analyse, besoins, règles, tests, manuel)
4. Captures et preuves de validation

## 9. Critères de recette

1. Les parcours métier critiques passent sans anomalie bloquante.
2. Les rôles limitent correctement les actions disponibles.
3. Les stocks restent cohérents après séries d'opérations.
4. Les alertes automatiques se déclenchent et évoluent correctement.
5. Les rapports et impressions sont exploitables par les responsables.

## 10. Risques et mesures

- Risque: saisies incohérentes de stock.
- Mesure: validations backend + transactions + règles automatiques.

- Risque: erreurs d'autorisation par rôle.
- Mesure: matrice centralisée de permissions et tests de non-régression.

- Risque: dette client mal suivie.
- Mesure: calcul automatique montant restant et historique des paiements.

## 11. Planification indicative

1. Analyse et modélisation
2. Implémentation backend API
3. Implémentation frontend modules
4. Intégration et stabilisation
5. Tests et documentation

