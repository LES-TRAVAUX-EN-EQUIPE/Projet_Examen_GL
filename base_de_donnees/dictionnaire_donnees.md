# Dictionnaire de données - FuelTrack Nord-Kivu

Ce dictionnaire décrit les tables de la base de données actuelle de FuelTrack, ainsi que les tables ajoutées par la migration liée aux ventes station.

## 1. Table : roles
Contient les rôles applicables aux utilisateurs de l’application.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique du rôle |
| nom_role | VARCHAR(50) | Nom du rôle, obligatoire et unique |
| description_role | VARCHAR(255) | Description du rôle |

## 2. Table : utilisateurs
Contient les comptes utilisateurs du système.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| nom | VARCHAR(100) | Nom de l’utilisateur |
| prenom | VARCHAR(100) | Prénom de l’utilisateur |
| email | VARCHAR(150) | Adresse email unique |
| mot_de_passe | VARCHAR(255) | Mot de passe haché |
| telephone | VARCHAR(20) | Numéro de téléphone |
| role_id | INT | Référence vers la table roles |
| statut | ENUM('actif','inactif') | État du compte |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

Relations:
- `role_id` référence `roles.id`

## 3. Table : fournisseurs
Contient les fournisseurs de carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant du fournisseur |
| nom_fournisseur | VARCHAR(150) | Nom du fournisseur |
| type_fournisseur | VARCHAR(100) | Type ou catégorie du fournisseur |
| contact_personne | VARCHAR(150) | Personne de contact |
| telephone | VARCHAR(20) | Téléphone |
| email | VARCHAR(150) | Email |
| adresse | VARCHAR(255) | Adresse |
| ville | VARCHAR(100) | Ville |
| province | VARCHAR(100) | Province, valeur par défaut Nord-Kivu |
| statut | ENUM('actif','inactif') | État du fournisseur |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

## 4. Table : types_carburant
Contient les différents carburants gérés par l’application.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| nom_carburant | VARCHAR(100) | Nom du carburant, unique |
| description_carburant | VARCHAR(255) | Description du carburant |
| unite_mesure | VARCHAR(20) | Unité de mesure, généralement litres |
| date_creation | TIMESTAMP | Date de création |

## 5. Table : depots
Contient les dépôts de stockage.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| nom_depot | VARCHAR(150) | Nom du dépôt |
| code_depot | VARCHAR(50) | Code unique du dépôt |
| localisation | VARCHAR(255) | Localisation du dépôt |
| ville | VARCHAR(100) | Ville |
| capacite_totale | DECIMAL(15,2) | Capacité totale de stockage |
| responsable_id | INT | Utilisateur responsable du dépôt |
| statut | ENUM('actif','inactif') | État du dépôt |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

Relations:
- `responsable_id` référence `utilisateurs.id`

## 6. Table : stations
Contient les stations-service.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| nom_station | VARCHAR(150) | Nom de la station |
| code_station | VARCHAR(50) | Code unique de la station |
| localisation | VARCHAR(255) | Localisation |
| ville | VARCHAR(100) | Ville |
| capacite_stockage | DECIMAL(15,2) | Capacité de stockage |
| responsable_id | INT | Utilisateur responsable |
| statut | ENUM('actif','inactif') | État de la station |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

Relations:
- `responsable_id` référence `utilisateurs.id`

## 7. Table : vehicules
Contient les véhicules utilisés pour les livraisons.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| immatriculation | VARCHAR(50) | Immatriculation unique |
| marque | VARCHAR(100) | Marque du véhicule |
| modele | VARCHAR(100) | Modèle |
| nom_chauffeur | VARCHAR(150) | Nom du chauffeur |
| telephone_chauffeur | VARCHAR(20) | Téléphone du chauffeur |
| capacite | DECIMAL(15,2) | Capacité de transport |
| type_vehicule | VARCHAR(100) | Type de véhicule, valeur par défaut Camion-citerne |
| statut | ENUM('disponible','en_mission','maintenance','hors_service') | État du véhicule |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

## 8. Table : approvisionnements
Contient les entrées de carburant dans les dépôts.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| reference_approvisionnement | VARCHAR(100) | Référence unique de l’approvisionnement |
| fournisseur_id | INT | Fournisseur concerné |
| type_carburant_id | INT | Type de carburant |
| depot_id | INT | Dépôt destinataire |
| quantite | DECIMAL(15,2) | Quantité reçue |
| cout_unitaire | DECIMAL(15,2) | Coût unitaire |
| cout_total | DECIMAL(15,2) | Coût total calculé automatiquement |
| date_approvisionnement | DATETIME | Date de réception |
| statut | ENUM('en_attente','recu','annule') | Statut de traitement |
| cree_par | INT | Utilisateur ayant enregistré l’opération |
| commentaire | TEXT | Commentaire éventuel |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

Relations:
- `fournisseur_id` référence `fournisseurs.id`
- `type_carburant_id` référence `types_carburant.id`
- `depot_id` référence `depots.id`
- `cree_par` référence `utilisateurs.id`

## 9. Table : livraisons
Contient les livraisons de carburant du dépôt vers la station.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| reference_livraison | VARCHAR(100) | Référence unique de la livraison |
| depot_id | INT | Dépôt d’origine |
| station_id | INT | Station de destination |
| type_carburant_id | INT | Type de carburant transporté |
| vehicule_id | INT | Véhicule utilisé |
| quantite | DECIMAL(15,2) | Quantité livrée |
| date_depart | DATETIME | Date de départ |
| date_arrivee | DATETIME | Date d’arrivée, facultative |
| statut | ENUM('preparee','en_cours','livree','annulee') | Statut logistique |
| cree_par | INT | Utilisateur ayant créé la livraison |
| commentaire | TEXT | Commentaire |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

Relations:
- `depot_id` référence `depots.id`
- `station_id` référence `stations.id`
- `type_carburant_id` référence `types_carburant.id`
- `vehicule_id` référence `vehicules.id`
- `cree_par` référence `utilisateurs.id`

## 10. Table : stocks_depots
Contient les stocks disponibles par dépôt et par type de carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| depot_id | INT | Dépôt concerné |
| type_carburant_id | INT | Type de carburant |
| quantite_disponible | DECIMAL(15,2) | Quantité disponible |
| seuil_alerte | DECIMAL(15,2) | Seuil de déclenchement d’alerte |
| date_mise_a_jour | TIMESTAMP | Date de mise à jour |

Contraintes:
- unicité sur `(depot_id, type_carburant_id)`

Relations:
- `depot_id` référence `depots.id`
- `type_carburant_id` référence `types_carburant.id`

## 11. Table : stocks_stations
Contient les stocks disponibles par station et par type de carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| station_id | INT | Station concernée |
| type_carburant_id | INT | Type de carburant |
| quantite_disponible | DECIMAL(15,2) | Quantité disponible |
| seuil_alerte | DECIMAL(15,2) | Seuil de déclenchement d’alerte |
| date_mise_a_jour | TIMESTAMP | Date de mise à jour |

Contraintes:
- unicité sur `(station_id, type_carburant_id)`

Relations:
- `station_id` référence `stations.id`
- `type_carburant_id` référence `types_carburant.id`

## 12. Table : mouvements_stock
Trace tous les mouvements de carburant.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| reference_mouvement | VARCHAR(100) | Référence unique du mouvement |
| type_mouvement | ENUM('entree_depot','sortie_depot','entree_station','sortie_station','transfert') | Nature du mouvement |
| type_carburant_id | INT | Type de carburant |
| depot_id | INT | Dépôt concerné |
| station_id | INT | Station concernée |
| approvisionnement_id | INT | Approvisionnement associé |
| livraison_id | INT | Livraison associée |
| quantite | DECIMAL(15,2) | Quantité concernée |
| date_mouvement | DATETIME | Date du mouvement |
| cree_par | INT | Utilisateur créateur |
| commentaire | TEXT | Commentaire |
| date_creation | TIMESTAMP | Date de création |

Relations:
- `type_carburant_id` référence `types_carburant.id`
- `depot_id` référence `depots.id`
- `station_id` référence `stations.id`
- `approvisionnement_id` référence `approvisionnements.id`
- `livraison_id` référence `livraisons.id`
- `cree_par` référence `utilisateurs.id`

## 13. Table : alertes
Contient les alertes générées automatiquement par le système.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| type_alerte | ENUM('stock_faible','stock_critique','retard_livraison','anomalie') | Type d’alerte |
| niveau | ENUM('faible','moyen','eleve','critique') | Niveau de criticité |
| depot_id | INT | Dépôt concerné |
| station_id | INT | Station concernée |
| type_carburant_id | INT | Type de carburant concerné |
| message | TEXT | Message descriptif |
| statut | ENUM('nouvelle','en_cours','resolue') | Statut de traitement |
| date_alerte | DATETIME | Date de génération |
| cree_par | INT | Utilisateur lié à l’alerte |
| date_creation | TIMESTAMP | Date de création |

Relations:
- `depot_id` référence `depots.id`
- `station_id` référence `stations.id`
- `type_carburant_id` référence `types_carburant.id`
- `cree_par` référence `utilisateurs.id`

## 14. Table : clients
Table ajoutée par la migration des ventes station.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| nom_client | VARCHAR(150) | Nom du client |
| telephone | VARCHAR(30) | Téléphone unique |
| email | VARCHAR(150) | Email, facultatif |
| adresse | VARCHAR(255) | Adresse, facultative |
| statut | ENUM('actif','inactif') | Statut du client |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

## 15. Table : prix_carburants
Table ajoutée par la migration des ventes station.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| station_id | INT | Station concernée |
| type_carburant_id | INT | Type de carburant |
| prix_unitaire_usd | DECIMAL(15,2) | Prix unitaire en USD |
| statut | ENUM('actif','inactif') | Statut du tarif |
| date_creation | TIMESTAMP | Date de création |
| date_modification | TIMESTAMP | Date de dernière modification |

Contraintes:
- unicité sur `(station_id, type_carburant_id)`

Relations:
- `station_id` référence `stations.id`
- `type_carburant_id` référence `types_carburant.id`

## 16. Table : taux_change_stations
Table ajoutée par la migration des ventes station.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| station_id | INT | Station concernée |
| taux_usd_cdf | DECIMAL(15,2) | Taux de conversion USD vers CDF |
| date_application | DATETIME | Date d’application du taux |
| statut | ENUM('actif','inactif') | Statut du taux |
| cree_par | INT | Utilisateur ayant saisi le taux |
| date_creation | TIMESTAMP | Date de création |

Relations:
- `station_id` référence `stations.id`
- `cree_par` référence `utilisateurs.id`

## 17. Table : ventes_station
Table ajoutée par la migration des ventes station.

| Champ | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT | Identifiant unique |
| reference_vente | VARCHAR(100) | Référence unique de la vente |
| station_id | INT | Station concernée |
| client_id | INT | Client acheteur |
| type_carburant_id | INT | Type de carburant vendu |
| quantite | DECIMAL(15,2) | Quantité vendue |
| devise_paiement | ENUM('USD','CDF') | Devise de paiement |
| taux_change_applique | DECIMAL(15,2) | Taux utilisé lors de la vente |
| prix_unitaire_usd | DECIMAL(15,2) | Prix unitaire en USD |
| prix_unitaire_cdf | DECIMAL(15,2) | Prix unitaire en CDF |
| reduction | DECIMAL(15,2) | Réduction appliquée |
| montant_brut | DECIMAL(15,2) | Montant brut |
| montant_net | DECIMAL(15,2) | Montant net |
| montant_paye | DECIMAL(15,2) | Montant déjà payé |
| cree_par | INT | Utilisateur créateur |
| date_vente | DATETIME | Date de la vente |
| commentaire | TEXT | Commentaire facultatif |
| date_creation | TIMESTAMP | Date de création |

Relations:
- `station_id` référence `stations.id`
- `client_id` référence `clients.id`
- `type_carburant_id` référence `types_carburant.id`
- `cree_par` référence `utilisateurs.id`

## 18. Relations principales entre les tables

- Un rôle possède plusieurs utilisateurs.
- Un utilisateur peut être responsable d’un dépôt, d’une station ou être l’auteur d’une opération.
- Un fournisseur alimente des approvisionnements.
- Un dépôt reçoit des approvisionnements et envoie des livraisons.
- Une station reçoit des livraisons et enregistre des ventes.
- Les stocks sont suivis séparément pour les dépôts et les stations.
- Les mouvements de stock constituent l’historique d’audit des opérations.
- Les alertes sont déclenchées automatiquement en fonction des seuils de stock.
- Les ventes station sont reliées à un client, une station, un carburant et un taux de change.

## 19. Index et contraintes supplémentaires

Index définis dans le schéma:

- `idx_appro_date` sur `approvisionnements(date_approvisionnement)`
- `idx_livraison_date_depart` sur `livraisons(date_depart)`
- `idx_mouvement_date` sur `mouvements_stock(date_mouvement)`
- `idx_alerte_date` sur `alertes(date_alerte)`

Contraintes importantes:

- unicité des codes et références métier
- intégrité référentielle entre les tables
- suppression/restriction adaptée selon le rôle des enregistrements

## 20. Synthèse

La base de données actuelle de FuelTrack couvre tout le cycle métier:

1. Référentiels métiers
2. Approvisionnement
3. Stockage
4. Livraison
5. Vente
6. Suivi des dettes et des alertes
7. Pilotage par rapports et indicateurs

Elle constitue une base cohérente pour le suivi de la chaîne d’approvisionnement en carburant au Nord-Kivu.