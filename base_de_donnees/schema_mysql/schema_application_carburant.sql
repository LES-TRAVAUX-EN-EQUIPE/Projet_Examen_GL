CREATE DATABASE IF NOT EXISTS fueltrack_nord_kivu;

USE fueltrack_nord_kivu;

-- =========================
-- TABLE : roles
-- ==
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_role VARCHAR(50) NOT NULL UNIQUE,
    description_role VARCHAR(255)
);

-- =========================
-- TABLE : utilisateurs
-- =========================
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role_id INT NOT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_utilisateur_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : fournisseurs
-- =========================
CREATE TABLE fournisseurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fournisseur VARCHAR(150) NOT NULL,
    type_fournisseur VARCHAR(100),
    contact_personne VARCHAR(150),
    telephone VARCHAR(20),
    email VARCHAR(150),
    adresse VARCHAR(255),
    ville VARCHAR(100),
    province VARCHAR(100) DEFAULT 'Nord-Kivu',
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- TABLE : types_carburant
-- =========================
CREATE TABLE types_carburant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_carburant VARCHAR(100) NOT NULL UNIQUE,
    description_carburant VARCHAR(255),
    unite_mesure VARCHAR(20) DEFAULT 'litres',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLE : depots
-- =========================
CREATE TABLE depots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_depot VARCHAR(150) NOT NULL,
    code_depot VARCHAR(50) NOT NULL UNIQUE,
    localisation VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    capacite_totale DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    responsable_id INT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_depot_responsable
        FOREIGN KEY (responsable_id) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : stations
-- =========================
CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_station VARCHAR(150) NOT NULL,
    code_station VARCHAR(50) NOT NULL UNIQUE,
    localisation VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    capacite_stockage DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    responsable_id INT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_station_responsable
        FOREIGN KEY (responsable_id) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : vehicules
-- =========================
CREATE TABLE vehicules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    immatriculation VARCHAR(50) NOT NULL UNIQUE,
    marque VARCHAR(100),
    modele VARCHAR(100),
    nom_chauffeur VARCHAR(150),
    telephone_chauffeur VARCHAR(20),
    capacite DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    type_vehicule VARCHAR(100) DEFAULT 'Camion-citerne',
    statut ENUM('disponible', 'en_mission', 'maintenance', 'hors_service') DEFAULT 'disponible',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- TABLE : approvisionnements (A CORRIGER)
-- =========================
CREATE TABLE approvisionnements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_approvisionnement VARCHAR(100) NOT NULL UNIQUE,
    fournisseur_id INT NOT NULL,
    type_carburant_id INT NOT NULL,
    depot_id INT NOT NULL,
    quantite DECIMAL(15,2) NOT NULL,
    cout_unitaire DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cout_total DECIMAL(15,2) GENERATED ALWAYS AS (quantite * cout_unitaire) STORED,
    date_approvisionnement DATETIME NOT NULL,
    statut ENUM('en_attente', 'recu', 'annule') DEFAULT 'recu',
    cree_par INT NULL,
    commentaire TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appro_fournisseur
        FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_appro_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_appro_depot
        FOREIGN KEY (depot_id) REFERENCES depots(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_appro_utilisateur
        FOREIGN KEY (cree_par) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : livraisons
-- =========================
CREATE TABLE livraisons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_livraison VARCHAR(100) NOT NULL UNIQUE,
    depot_id INT NOT NULL,
    station_id INT NOT NULL,
    type_carburant_id INT NOT NULL,
    vehicule_id INT NULL,
    quantite DECIMAL(15,2) NOT NULL,
    date_depart DATETIME NOT NULL,
    date_arrivee DATETIME NULL,
    statut ENUM('preparee', 'en_cours', 'livree', 'annulee') DEFAULT 'preparee',
    cree_par INT NULL,
    commentaire TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_livraison_depot
        FOREIGN KEY (depot_id) REFERENCES depots(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_livraison_station
        FOREIGN KEY (station_id) REFERENCES stations(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_livraison_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_livraison_vehicule
        FOREIGN KEY (vehicule_id) REFERENCES vehicules(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_livraison_utilisateur
        FOREIGN KEY (cree_par) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : stocks_depots
-- =========================
CREATE TABLE stocks_depots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    depot_id INT NOT NULL,
    type_carburant_id INT NOT NULL,
    quantite_disponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    seuil_alerte DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_stock_depot UNIQUE (depot_id, type_carburant_id),
    CONSTRAINT fk_stock_depot_depot
        FOREIGN KEY (depot_id) REFERENCES depots(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_stock_depot_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : stocks_stations
-- =========================
CREATE TABLE stocks_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_id INT NOT NULL,
    type_carburant_id INT NOT NULL,
    quantite_disponible DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    seuil_alerte DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_stock_station UNIQUE (station_id, type_carburant_id),
    CONSTRAINT fk_stock_station_station
        FOREIGN KEY (station_id) REFERENCES stations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_stock_station_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : mouvements_stock (A VERIFIER)
-- =========================
CREATE TABLE mouvements_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_mouvement VARCHAR(100) NOT NULL UNIQUE,
    type_mouvement ENUM('entree_depot', 'sortie_depot', 'entree_station', 'sortie_station', 'transfert') NOT NULL,
    type_carburant_id INT NOT NULL,
    depot_id INT NULL,
    station_id INT NULL,
    approvisionnement_id INT NULL,
    livraison_id INT NULL,
    quantite DECIMAL(15,2) NOT NULL,
    date_mouvement DATETIME NOT NULL,
    cree_par INT NULL,
    commentaire TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mouvement_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_mouvement_depot
        FOREIGN KEY (depot_id) REFERENCES depots(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_mouvement_station
        FOREIGN KEY (station_id) REFERENCES stations(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_mouvement_appro
        FOREIGN KEY (approvisionnement_id) REFERENCES approvisionnements(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_mouvement_livraison
        FOREIGN KEY (livraison_id) REFERENCES livraisons(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_mouvement_utilisateur
        FOREIGN KEY (cree_par) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- TABLE : alertes
-- =========================
CREATE TABLE alertes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_alerte ENUM('stock_faible', 'stock_critique', 'retard_livraison', 'anomalie') NOT NULL,
    niveau ENUM('faible', 'moyen', 'eleve', 'critique') DEFAULT 'moyen',
    depot_id INT NULL,
    station_id INT NULL,
    type_carburant_id INT NULL,
    message TEXT NOT NULL,
    statut ENUM('nouvelle', 'en_cours', 'resolue') DEFAULT 'nouvelle',
    date_alerte DATETIME NOT NULL,
    cree_par INT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alerte_depot
        FOREIGN KEY (depot_id) REFERENCES depots(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_alerte_station
        FOREIGN KEY (station_id) REFERENCES stations(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_alerte_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_alerte_utilisateur
        FOREIGN KEY (cree_par) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =========================
-- INDEXES SUPPLEMENTAIRES
-- =========================
CREATE INDEX idx_appro_date ON approvisionnements(date_approvisionnement); -- A REFAIR
CREATE INDEX idx_livraison_date_depart ON livraisons(date_depart);
CREATE INDEX idx_mouvement_date ON mouvements_stock(date_mouvement); -- A REVOIR
CREATE INDEX idx_alerte_date ON alertes(date_alerte);