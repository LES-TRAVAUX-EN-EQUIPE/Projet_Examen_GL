# Dictionnaire de données - FuelTrack Nord-Kivu

## 1. Table : roles
Contient les rôles des utilisateurs de l’application.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant unique du rôle |
| nom_role | VARCHAR(50) | Nom du rôle |
| description_role | VARCHAR(255) | Description du rôle |

---

## 2. Table : utilisateurs
Contient les comptes utilisateurs du système.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant unique |
| nom | VARCHAR(100) | Nom de l’utilisateur |
| prenom | VARCHAR(100) | Prénom de l’utilisateur |
| email | VARCHAR(150) | Adresse email unique |
| mot_de_passe | VARCHAR(255) | Mot de passe chiffré |
| telephone | VARCHAR(20) | Numéro de téléphone |
| role_id | INT | Référence au rôle |
| statut | ENUM | État du compte |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de modification |

---

## 3. Table : fournisseurs
Contient les fournisseurs de carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant du fournisseur |
| nom_fournisseur | VARCHAR(150) | Nom du fournisseur |
| type_fournisseur | VARCHAR(100) | Type du fournisseur |
| contact_personne | VARCHAR(150) | Personne de contact |
| telephone | VARCHAR(20) | Téléphone |
| email | VARCHAR(150) | Email |
| adresse | VARCHAR(255) | Adresse |
| ville | VARCHAR(100) | Ville |
| province | VARCHAR(100) | Province |
| statut | ENUM | Statut |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de modification |

---

## 4. Table : types_carburant
Contient les types de carburant gérés.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| nom_carburant | VARCHAR(100) | Nom du carburant |
| description_carburant | VARCHAR(255) | Description |
| unite_mesure | VARCHAR(20) | Unité, généralement litres |
| date_creation | TIMESTAMP | Date de création |

---

## 5. Table : depots
Contient les dépôts de stockage.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| nom_depot | VARCHAR(150) | Nom du dépôt |
| code_depot | VARCHAR(50) | Code unique du dépôt |
| localisation | VARCHAR(255) | Adresse ou localisation |
| ville | VARCHAR(100) | Ville |
| capacite_totale | DECIMAL(15,2) | Capacité totale |
| responsable_id | INT | Responsable du dépôt |
| statut | ENUM | Statut |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de modification |

---

## 6. Table : stations
Contient les stations-service.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| nom_station | VARCHAR(150) | Nom de la station |
| code_station | VARCHAR(50) | Code unique |
| localisation | VARCHAR(255) | Adresse ou localisation |
| ville | VARCHAR(100) | Ville |
| capacite_stockage | DECIMAL(15,2) | Capacité de stockage |
| responsable_id | INT | Responsable |
| statut | ENUM | Statut |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de modification |

---

## 7. Table : vehicules
Contient les véhicules de livraison.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| immatriculation | VARCHAR(50) | Plaque unique |
| marque | VARCHAR(100) | Marque du véhicule |
| modele | VARCHAR(100) | Modèle |
| nom_chauffeur | VARCHAR(150) | Nom du chauffeur |
| telephone_chauffeur | VARCHAR(20) | Téléphone du chauffeur |
| capacite | DECIMAL(15,2) | Capacité du véhicule |
| type_vehicule | VARCHAR(100) | Type |
| statut | ENUM | Disponibilité |

---

## 8. Table : approvisionnements
Contient les arrivées de carburant dans les dépôts.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| reference_approvisionnement | VARCHAR(100) | Référence unique |
| fournisseur_id | INT | Fournisseur |
| type_carburant_id | INT | Type de carburant |
| depot_id | INT | Dépôt de destination |
| quantite | DECIMAL(15,2) | Quantité reçue |
| cout_unitaire | DECIMAL(15,2) | Coût unitaire |
| cout_total | DECIMAL(15,2) | Coût total calculé |
| date_approvisionnement | DATETIME | Date de réception |
| statut | ENUM | Statut |
| cree_par | INT | Utilisateur ayant enregistré |
| commentaire | TEXT | Commentaire |

---

## 9. Table : livraisons
Contient les livraisons des dépôts vers les stations.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| reference_livraison | VARCHAR(100) | Référence unique |
| depot_id | INT | Dépôt d’origine |
| station_id | INT | Station de destination |
| type_carburant_id | INT | Type de carburant |
| vehicule_id | INT | Véhicule utilisé |
| quantite | DECIMAL(15,2) | Quantité livrée |
| date_depart | DATETIME | Date de départ |
| date_arrivee | DATETIME | Date d’arrivée |
| statut | ENUM | Statut |
| cree_par | INT | Utilisateur créateur |
| commentaire | TEXT | Commentaire |

---

## 10. Table : stocks_depots
Contient les quantités disponibles par dépôt et type de carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| depot_id | INT | Dépôt |
| type_carburant_id | INT | Type de carburant |
| quantite_disponible | DECIMAL(15,2) | Quantité actuelle |
| seuil_alerte | DECIMAL(15,2) | Seuil d’alerte |
| date_mise_a_jour | TIMESTAMP | Dernière mise à jour |

---

## 11. Table : stocks_stations
Contient les quantités disponibles par station et type de carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| station_id | INT | Station |
| type_carburant_id | INT | Type de carburant |
| quantite_disponible | DECIMAL(15,2) | Quantité actuelle |
| seuil_alerte | DECIMAL(15,2) | Seuil d’alerte |
| date_mise_a_jour | TIMESTAMP | Dernière mise à jour |

---

## 12. Table : mouvements_stock
Trace tous les mouvements du carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| reference_mouvement | VARCHAR(100) | Référence unique |
| type_mouvement | ENUM | Nature du mouvement |
| type_carburant_id | INT | Type de carburant |
| depot_id | INT | Dépôt concerné |
| station_id | INT | Station concernée |
| approvisionnement_id | INT | Référence d’approvisionnement liée |
| livraison_id | INT | Référence de livraison liée |
| quantite | DECIMAL(15,2) | Quantité |
| date_mouvement | DATETIME | Date du mouvement |
| cree_par | INT | Utilisateur créateur |
| commentaire | TEXT | Commentaire |

---

## 13. Table : alertes
Contient les alertes générées par le système.

| Champ | Type | Description |
|---|---|---|
| id | INT | Identifiant |
| type_alerte | ENUM | Type d’alerte |
| niveau | ENUM | Niveau de criticité |
| depot_id | INT | Dépôt concerné |
| station_id | INT | Station concernée |
| type_carburant_id | INT | Type de carburant concerné |
| message | TEXT | Message d’alerte |
| statut | ENUM | Statut de traitement |
| date_alerte | DATETIME | Date de l’alerte |
| cree_par | INT | Utilisateur créateur |
| date_creation | TIMESTAMP | Date de création |