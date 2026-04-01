USE fueltrack_nord_kivu;

-- =========================
-- INSERTION DES ROLES
-- =========================
INSERT INTO roles (nom_role, description_role) VALUES
('Administrateur', 'Gestion complète du système'),
('Gestionnaire de stock', 'Gestion des dépôts et mouvements de stock'),
('Responsable logistique', 'Gestion des livraisons et transports'),
('Responsable station', 'Gestion des stations-service'),
('Superviseur', 'Consultation des rapports et tableaux de bord');

-- =========================
-- INSERTION DES UTILISATEURS
-- =========================
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, role_id, statut) VALUES
('Bujiriri', 'Thibaut', 'thibaut@fueltrack.com', '$2y$10$examplehashadmin', '0990000001', 1, 'actif'),
('Amani', 'Samy', 'samy@fueltrack.com', '$2y$10$examplehashstock', '0990000002', 2, 'actif'),
('Mumbere', 'amina', 'amina@fueltrack.com', '$2y$10$examplehashlog', '0990000003', 3, 'actif'),
('Bahati', 'marie', 'marie@fueltrack.com', '$2y$10$examplehashstation', '0990000004', 4, 'actif'),
('Kambale', 'justin', 'justin@fueltrack.com', '$2y$10$examplehashsup', '0990000005', 5, 'actif');

-- =========================
-- INSERTION DES FOURNISSEURS
-- =========================
INSERT INTO fournisseurs (nom_fournisseur, type_fournisseur, contact_personne, telephone, email, adresse, ville, province, statut) VALUES
('SONAHYDROC', 'Entreprise publique', 'M. Patrick', '0991111111', 'contact@sonahydroc.cd', 'Boulevard Kanyamuhanga', 'Goma', 'Nord-Kivu', 'actif'),
('Virunga Petroleum', 'Entreprise privée', 'Mme Aline', '0992222222', 'info@virungapetroleum.com', 'Quartier Les Volcans', 'Goma', 'Nord-Kivu', 'actif'),
('Kivu Oil Supply', 'Grossiste', 'M. James', '0993333333', 'contact@kivuoil.com', 'Commune de Karisimbi', 'Goma', 'Nord-Kivu', 'actif');

-- =========================
-- INSERTION DES TYPES DE CARBURANT
-- =========================
INSERT INTO types_carburant (nom_carburant, description_carburant, unite_mesure) VALUES
('Essence', 'Carburant pour véhicules légers', 'litres'),
('Diesel', 'Carburant pour véhicules lourds et groupes électrogènes', 'litres'),
('Pétrole', 'Carburant domestique et industriel léger', 'litres');

-- =========================
-- INSERTION DES DEPOTS
-- =========================
INSERT INTO depots (nom_depot, code_depot, localisation, ville, capacite_totale, responsable_id, statut) VALUES
('Dépôt Central Goma', 'DEP-GOM-001', 'Quartier Industriel', 'Goma', 500000.00, 2, 'actif'),
('Dépôt Butembo', 'DEP-BUT-001', 'Zone Logistique Butembo', 'Butembo', 300000.00, 2, 'actif'),
('Dépôt Beni', 'DEP-BEN-001', 'Axe principal Beni', 'Beni', 250000.00, 2, 'actif');

-- =========================
-- INSERTION DES STATIONS
-- =========================
INSERT INTO stations (nom_station, code_station, localisation, ville, capacite_stockage, responsable_id, statut) VALUES
('Station Goma Centre', 'STA-GOM-001', 'Centre-ville Goma', 'Goma', 50000.00, 4, 'actif'),
('Station Majengo', 'STA-GOM-002', 'Majengo', 'Goma', 35000.00, 4, 'actif'),
('Station Butembo Nord', 'STA-BUT-001', 'Quartier Matanda', 'Butembo', 40000.00, 4, 'actif'),
('Station Beni Centre', 'STA-BEN-001', 'Centre Beni', 'Beni', 30000.00, 4, 'actif');

-- =========================
-- INSERTION DES VEHICULES
-- =========================
INSERT INTO vehicules (immatriculation, marque, modele, nom_chauffeur, telephone_chauffeur, capacite, type_vehicule, statut) VALUES
('RDC-TRK-001', 'Mercedes', 'Actros', 'M. Kule', '0994444441', 30000.00, 'Camion-citerne', 'disponible'),
('RDC-TRK-002', 'Volvo', 'FH Tanker', 'M. Safari', '0994444442', 25000.00, 'Camion-citerne', 'en_mission'),
('RDC-TRK-003', 'Scania', 'P-Series', 'M. Muhindo', '0994444443', 20000.00, 'Camion-citerne', 'disponible');

-- =========================
-- INSERTION DES APPROVISIONNEMENTS
-- =========================
INSERT INTO approvisionnements (
    reference_approvisionnement,
    fournisseur_id,
    type_carburant_id,
    depot_id,
    quantite,
    cout_unitaire,
    date_approvisionnement,
    statut,
    cree_par,
    commentaire
) VALUES
('APPRO-2026-0001', 1, 2, 1, 120000.00, 1.45, '2026-03-20 08:30:00', 'recu', 1, 'Approvisionnement initial en diesel'),
('APPRO-2026-0002', 2, 1, 1, 80000.00, 1.60, '2026-03-21 10:15:00', 'recu', 1, 'Réception essence pour Goma'),
('APPRO-2026-0003', 3, 3, 2, 50000.00, 1.20, '2026-03-22 09:00:00', 'recu', 1, 'Réception pétrole pour Butembo');

-- =========================
-- INSERTION DES LIVRAISONS
-- =========================
INSERT INTO livraisons (
    reference_livraison,
    depot_id,
    station_id,
    type_carburant_id,
    vehicule_id,
    quantite,
    date_depart,
    date_arrivee,
    statut,
    cree_par,
    commentaire
) VALUES
('LIVR-2026-0001', 1, 1, 2, 2, 15000.00, '2026-03-23 06:00:00', '2026-03-23 11:00:00', 'livree', 3, 'Livraison diesel vers Goma Centre'),
('LIVR-2026-0002', 1, 2, 1, 1, 12000.00, '2026-03-24 07:30:00', NULL, 'en_cours', 3, 'Livraison essence vers Majengo'),
('LIVR-2026-0003', 2, 3, 3, 3, 10000.00, '2026-03-24 08:00:00', '2026-03-24 13:00:00', 'livree', 3, 'Livraison pétrole vers Butembo Nord');

-- =========================
-- INSERTION DES STOCKS DEPOTS
-- =========================
INSERT INTO stocks_depots (depot_id, type_carburant_id, quantite_disponible, seuil_alerte) VALUES
(1, 1, 68000.00, 10000.00),
(1, 2, 105000.00, 15000.00),
(1, 3, 0.00, 5000.00),
(2, 1, 0.00, 5000.00),
(2, 2, 0.00, 5000.00),
(2, 3, 40000.00, 7000.00),
(3, 1, 0.00, 5000.00),
(3, 2, 0.00, 5000.00),
(3, 3, 0.00, 5000.00);

-- =========================
-- INSERTION DES STOCKS STATIONS
-- =========================
INSERT INTO stocks_stations (station_id, type_carburant_id, quantite_disponible, seuil_alerte) VALUES
(1, 2, 15000.00, 3000.00),
(2, 1, 8000.00, 2500.00),
(3, 3, 10000.00, 2000.00),
(4, 2, 5000.00, 2000.00);

-- =========================
-- INSERTION DES MOUVEMENTS DE STOCK
-- =========================
INSERT INTO mouvements_stock (
    reference_mouvement,
    type_mouvement,
    type_carburant_id,
    depot_id,
    station_id,
    approvisionnement_id,
    livraison_id,
    quantite,
    date_mouvement,
    cree_par,
    commentaire
) VALUES
('MVT-2026-0001', 'entree_depot', 2, 1, NULL, 1, NULL, 120000.00, '2026-03-20 08:45:00', 1, 'Entrée diesel au dépôt central'),
('MVT-2026-0002', 'entree_depot', 1, 1, NULL, 2, NULL, 80000.00, '2026-03-21 10:30:00', 1, 'Entrée essence au dépôt central'),
('MVT-2026-0003', 'entree_depot', 3, 2, NULL, 3, NULL, 50000.00, '2026-03-22 09:20:00', 1, 'Entrée pétrole au dépôt Butembo'),
('MVT-2026-0004', 'sortie_depot', 2, 1, NULL, NULL, 1, 15000.00, '2026-03-23 06:05:00', 3, 'Sortie diesel du dépôt vers station Goma Centre'),
('MVT-2026-0005', 'entree_station', 2, NULL, 1, NULL, 1, 15000.00, '2026-03-23 11:10:00', 3, 'Entrée diesel station Goma Centre'),
('MVT-2026-0006', 'sortie_depot', 1, 1, NULL, NULL, 2, 12000.00, '2026-03-24 07:35:00', 3, 'Sortie essence vers Majengo'),
('MVT-2026-0007', 'sortie_depot', 3, 2, NULL, NULL, 3, 10000.00, '2026-03-24 08:05:00', 3, 'Sortie pétrole vers Butembo Nord'),
('MVT-2026-0008', 'entree_station', 3, NULL, 3, NULL, 3, 10000.00, '2026-03-24 13:10:00', 3, 'Entrée pétrole station Butembo Nord');

-- =========================
-- INSERTION DES ALERTES
-- =========================
INSERT INTO alertes (
    type_alerte,
    niveau,
    depot_id,
    station_id,
    type_carburant_id,
    message,
    statut,
    date_alerte,
    cree_par
) VALUES
('stock_faible', 'moyen', NULL, 2, 1, 'Le stock d’essence à la station Majengo est proche du seuil d’alerte.', 'nouvelle', '2026-03-24 14:00:00', 1),
('retard_livraison', 'eleve', 1, 2, 1, 'La livraison LIVR-2026-0002 est encore en cours et nécessite un suivi.', 'en_cours', '2026-03-24 16:00:00', 1),
('stock_critique', 'critique', 3, NULL, 2, 'Le dépôt de Beni ne dispose pas encore de diesel.', 'nouvelle', '2026-03-24 17:00:00', 1);