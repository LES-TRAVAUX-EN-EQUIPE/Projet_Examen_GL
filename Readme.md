# FuelTrack - Structure actuelle du projet

## Arborescence

```text
Examen_GL/
├── .gitignore
├── Readme.md
├── instructions_travail_equipe.md
├── rapport_travail_effectue.md
├── .postman/
│   └── resources.yaml
├── postman/
│   ├── collections/
│   ├── environments/
│   ├── flows/
│   ├── globals/
│   │   └── workspace.globals.yaml
│   ├── mocks/
│   └── specs/
├── backend/
│   ├── config/
│   │   └── connexion.php
│   ├── controleurs/
│   ├── middleware/
│   ├── modeles/
│   ├── routes/
│   ├── utilitaires/
│   └── public/
│       ├── index.php
│       └── api/
│           ├── index.php
│           ├── livraisons.php
│           └── vehicules.php
├── base_de_donnees/
│   ├── dictionnaire_donnees.md
│   ├── donnees_test/
│   │   └── jeu_donnees_initial.sql
│   └── schema_mysql/
│       ├── migration_ventes_station.sql
│       └── schema_application_carburant.sql
├── documentation/
│   ├── analyse_du_probleme.md
│   ├── besoins_fonctionnels.md
│   ├── besoins_non_fonctionnels.md
│   ├── cahier_des_charges.md
│   ├── regles_de_gestion.md
│   ├── plan_de_test.md
│   ├── manuel_utilisateur.md
│   ├── preuves_travail_equipe.md
│   └── DIAGRAMMES UML/
│       ├── DIAGRAMME D'ACTIVITE.png
│       ├── DIAGRAMME DE CAS D'UTILISATION.png
│       ├── DIAGRAMME DE DEPLOIEMENT.png
│       ├── DIAGRAMME DES CLASSES.png
│       └── DIAGRAMME DES SEQUENCES.png
├── frontend/
│   ├── index.html
│   ├── composants/
│   ├── pages/
│   └── ressources/
│       ├── css/
│       │   ├── accueil.css
│       │   ├── connexion.css
│       │   ├── formulaires.css
│       │   ├── style.css
│       │   ├── tableaux.css
│       │   └── tableau_de_bord.css
│       ├── images/
│       └── js/
│           ├── api_client.js
│           ├── auth_guard.js
│           ├── tableau_de_bord.js
│           ├── mouvements_stock.js
│           ├── ventes_station.js
│           └── ...
└── captures_projet/
```

## Notes de mise a jour

- Le dossier `backend/tests/` a ete supprime (fichiers de tests non necessaires a l'execution)
- Les documents de projet ont ete completes dans `documentation/`
- La structure ci-dessus reflete l'etat actuel du depot

# Documentation du Schéma de Base de Données  
<img width="1714" height="1296" alt="fueltrack_nord_kivu" src="https://github.com/user-attachments/assets/9e83117c-75d6-4a49-bf18-13303438f5c0" />
## 1. Vue d’ensemble

Ce projet représente un système complet de gestion de carburant permettant de gérer :

- les types de carburant  
- les stations-service  
- les dépôts de stockage  
- les approvisionnements  
- les livraisons  
- les stocks  
- les ventes  
- les alertes  
- les utilisateurs et rôles  
- les clients et fournisseurs  

### Objectif
Assurer le suivi complet du carburant depuis le fournisseur jusqu’au client final.

---

## 2. Gestion des carburants

### Table : `types_carburant`

Contient les différents types de carburant.

**Champs principaux :**
- `id` : identifiant
- `nom_carburant` : nom (Essence, Diesel…)
- `description` : description
- `unite_mesure` : unité (litres)
- `date_creation`

---

## 3. Stations-service

### Table : `stations`

Représente les stations de distribution.

**Champs :**
- `id`
- `nom_station`
- `code_station`
- `localisation`
- `ville`
- `capacite_stockage`
- `responsable_id`
- `statut`

---

## 4. Dépôts

### Table : `depots`

Représente les dépôts de stockage.

**Champs :**
- `id`
- `nom_depot`
- `code_depot`
- `localisation`
- `capacite_totale`
- `responsable_id`
- `statut`

---

## 5. Approvisionnements

### Table : `approvisionnements`

Représente l’achat de carburant auprès des fournisseurs.

**Champs :**
- `id`
- `reference_approvisionnement`
- `fournisseur_id`
- `type_carburant_id`
- `depot_id`
- `quantite`
- `cout_unitaire`
- `cout_total`
- `date_approvisionnement`

### Flux :
Fournisseur : Dépôt

---

## 6. Livraisons

### Table : `livraisons`

Représente le transport de carburant.

**Champs :**
- `id`
- `reference_livraison`
- `depot_id`
- `station_id`
- `vehicule_id`
- `quantite`
- `date_depart`
- `date_arrivee`

### Flux :
Dépôt : Station

---

## 7. Véhicules

### Table : `vehicules`

**Champs :**
- `id`
- `immatriculation`
- `marque`
- `modele`
- `capacite`
- `nom_chauffeur`
- `telephone_chauffeur`

---

## 8. Gestion des stocks

### Table : `stocks_depots`
Stock dans les dépôts

### Table : `stocks_stations`
Stock dans les stations

**Champs communs :**
- `type_carburant_id`
- `quantite_disponible`
- `seuil_alerte`
- `date_mise_a_jour`

---

## 9. Mouvements de stock

### Table : `mouvements_stock`

Historique des opérations.

**Champs :**
- `id`
- `reference_mouvement`
- `type_mouvement`
- `type_carburant_id`
- `depot_id`
- `station_id`
- `quantite`
- `date_mouvement`

---

## 10. Prix et taux de change

### Table : `prix_carburants`
Prix par station

### Table : `taux_change_stations`
Taux USD ↔ CDF

---

## 11. Ventes 

### Table : `ventes_station`

Représente les ventes aux clients.

**Champs :**
- `id`
- `reference_vente`
- `station_id`
- `client_id`
- `type_carburant_id`
- `quantite`
- `devise_paiement`
- `prix_unitaire_usd`
- `prix_unitaire_cdf`
- `montant_total`
- `montant_paye`
- `date_vente`

### Flux :
Station : Client 

----

## 12. Clients 

### Table : `clients`

**Champs :**
- `id`
- `nom_client`
- `telephone`
- `email`
- `adresse`

----

## 13. Fournisseurs

### Table : `fournisseurs`

**Champs :**
- `id`
- `nom_fournisseur`
- `type_fournisseur`
- `contact_personne`
- `telephone`
- `email`
- `adresse`

----

## 14. Alertes

### Table : `alertes`

Permet de gérer les alertes.

**Champs :**
- `id`
- `type_alerte`
- `niveau`
- `message`
- `station_id`
- `depot_id`
- `statut`

----

## 15. Utilisateurs et rôles

### Table : `utilisateurs`

**Champs :**
- `id`
- `nom`
- `prenom`
- `email`
- `mot_de_passe`
- `role_id`

### Table : `roles`

**Champs :**
- `id`
- `nom_role`
- `description_role`

----

## 16. Relations principales

- Un carburant est utilisé dans plusieurs tables  
- Un dépôt possède plusieurs stocks  
- Une station possède plusieurs ventes  
- Une livraison relie dépôt, station et véhicule  
- Une vente relie station, client et carburant  

---

## 17. Flux global du système

### 1. Approvisionnement
Fournisseur → Dépôt

### 2. Distribution
Dépôt → Station

### 3. Vente
Station → Client

---

## 18. Objectifs du système

- Suivi des stocks en temps réel  
- Gestion des flux de carburant  
- Traçabilité complète  
- Gestion multi-stations  
- Alertes automatiques  

---

## 19. Avantages

- Architecture claire et modulaire  
- Facilité d’extension  
- Bonne organisation des données  
- Adapté aux entreprises de distribution de carburant  

---
Voici le lien d’accès à notre application qui est heberge sur internet :

[FuelTrack Groupe 1](https://fueltrackgroupe1.byethost16.com)

Ce lien vous permet d’accéder directement à la partie frontend de l’application déjà hébergée sur bythost.com qui est l'hébergeur que nous avons choisi .

### Lien d’accès au backend

Le backend de l’application est exécuté en local via le serveur PHP intégré
Et le front est ouvert dans le navigateur avec le click droit dans le fichier index.html qui est dans le dossier frontend puis ouvrir avec live server si l'extension est installée , puis ca s'ouvre en local sur le http://localhost:5500.

Chemin du projet :cd  \backend\public"  php -S localhost:8000 
