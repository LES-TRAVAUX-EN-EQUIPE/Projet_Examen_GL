-- Migration FuelTrack : ventes station, clients, tarifs et taux de change

CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_client VARCHAR(150) NOT NULL,
    telephone VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(150) NULL,
    adresse VARCHAR(255) NULL,
    statut ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prix_carburants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_id INT NOT NULL,
    type_carburant_id INT NOT NULL,
    prix_unitaire_usd DECIMAL(15,2) NOT NULL,
    statut ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_prix_station_carburant UNIQUE (station_id, type_carburant_id),
    CONSTRAINT fk_prix_station
        FOREIGN KEY (station_id) REFERENCES stations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_prix_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS taux_change_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_id INT NOT NULL,
    taux_usd_cdf DECIMAL(15,2) NOT NULL,
    date_application DATETIME NOT NULL,
    statut ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
    cree_par INT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_taux_station
        FOREIGN KEY (station_id) REFERENCES stations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_taux_utilisateur
        FOREIGN KEY (cree_par) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ventes_station (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_vente VARCHAR(100) NOT NULL UNIQUE,
    station_id INT NOT NULL,
    client_id INT NOT NULL,
    type_carburant_id INT NOT NULL,
    quantite DECIMAL(15,2) NOT NULL,
    devise_paiement ENUM('USD', 'CDF') NOT NULL DEFAULT 'USD',
    taux_change_applique DECIMAL(15,2) NOT NULL,
    prix_unitaire_usd DECIMAL(15,2) NOT NULL,
    prix_unitaire_cdf DECIMAL(15,2) NOT NULL,
    reduction DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    montant_brut DECIMAL(15,2) NOT NULL,
    montant_net DECIMAL(15,2) NOT NULL,
    montant_paye DECIMAL(15,2) NOT NULL,
    cree_par INT NULL,
    date_vente DATETIME NOT NULL,
    commentaire TEXT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vente_station
        FOREIGN KEY (station_id) REFERENCES stations(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_vente_client
        FOREIGN KEY (client_id) REFERENCES clients(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_vente_carburant
        FOREIGN KEY (type_carburant_id) REFERENCES types_carburant(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_vente_utilisateur
        FOREIGN KEY (cree_par) REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
