-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 21, 2026 at 10:58 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fueltrack_nord_kivu`
--

-- --------------------------------------------------------

--
-- Table structure for table `alertes`
--

CREATE TABLE `alertes` (
  `id` int NOT NULL,
  `type_alerte` enum('stock_faible','stock_critique','retard_livraison','anomalie') NOT NULL,
  `niveau` enum('faible','moyen','eleve','critique') DEFAULT 'moyen',
  `depot_id` int DEFAULT NULL,
  `station_id` int DEFAULT NULL,
  `type_carburant_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `statut` enum('nouvelle','en_cours','resolue') DEFAULT 'nouvelle',
  `date_alerte` datetime NOT NULL,
  `cree_par` int DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alertes`
--

INSERT INTO `alertes` (`id`, `type_alerte`, `niveau`, `depot_id`, `station_id`, `type_carburant_id`, `message`, `statut`, `date_alerte`, `cree_par`, `date_creation`) VALUES
(1, 'stock_faible', 'moyen', NULL, 2, 1, 'Le stock d’essence à la station Majengo est proche du seuil d’alerte.', 'en_cours', '2026-03-24 14:00:00', NULL, '2026-03-31 02:52:13'),
(2, 'retard_livraison', 'eleve', 1, 2, 1, 'La livraison LIVR-2026-0002 est encore en cours et nécessite un suivi.', 'en_cours', '2026-03-24 16:00:00', NULL, '2026-03-31 02:52:13');

-- --------------------------------------------------------

--
-- Table structure for table `approvisionnements`
--

CREATE TABLE `approvisionnements` (
  `id` int NOT NULL,
  `reference_approvisionnement` varchar(100) NOT NULL,
  `fournisseur_id` int NOT NULL,
  `type_carburant_id` int NOT NULL,
  `depot_id` int NOT NULL,
  `quantite` decimal(15,2) NOT NULL,
  `cout_unitaire` decimal(15,2) NOT NULL DEFAULT '0.00',
  `cout_total` decimal(15,2) GENERATED ALWAYS AS ((`quantite` * `cout_unitaire`)) STORED,
  `date_approvisionnement` datetime NOT NULL,
  `statut` enum('en_attente','recu','annule') DEFAULT 'recu',
  `cree_par` int DEFAULT NULL,
  `commentaire` text,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `approvisionnements`
--

INSERT INTO `approvisionnements` (`id`, `reference_approvisionnement`, `fournisseur_id`, `type_carburant_id`, `depot_id`, `quantite`, `cout_unitaire`, `date_approvisionnement`, `statut`, `cree_par`, `commentaire`, `date_creation`, `date_modification`) VALUES
(1, 'APPRO-2026-0001', 1, 2, 1, 120000.00, 1.45, '2026-03-20 08:30:00', 'recu', NULL, 'Approvisionnement initial en diesel', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(2, 'APPRO-2026-0002', 2, 1, 1, 80000.00, 1.60, '2026-03-21 10:15:00', 'recu', NULL, 'Réception essence pour Goma', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(3, 'APPRO-2026-0003', 3, 3, 2, 50000.00, 1.20, '2026-03-22 09:00:00', 'recu', NULL, 'Réception pétrole pour Butembo', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(16, 'APPRO-2026-0004', 2, 3, 2, 1000.00, 0.50, '2026-04-21 01:14:00', 'recu', 6, 'Vue', '2026-04-20 23:15:07', '2026-04-20 23:15:07');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int NOT NULL,
  `nom_client` varchar(150) NOT NULL,
  `telephone` varchar(30) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `statut` enum('actif','inactif') NOT NULL DEFAULT 'actif',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `nom_client`, `telephone`, `email`, `adresse`, `statut`, `date_creation`, `date_modification`) VALUES
(1, 'Gemini Ultra', '0812170541', 'thibauttbcprospere@gmail.com', 'Apgujeong-ro 604Busan', 'actif', '2026-04-15 17:28:33', '2026-04-15 23:03:36'),
(2, 'RIHANA PASCALINE', '0979636304', 'thbtchristian@gmail.com', '002 office 1', 'actif', '2026-04-15 23:18:53', '2026-04-15 23:18:53'),
(3, 'Josue', '7057399146', 'declandbb@gmail.com', '002 office 1', 'actif', '2026-04-20 23:18:11', '2026-04-20 23:18:11'),
(4, 'amani', '0949857474', 'amani@gmail.com', 'mabanga', 'actif', '2026-04-21 15:10:47', '2026-04-21 15:10:47');

-- --------------------------------------------------------

--
-- Table structure for table `depots`
--

CREATE TABLE `depots` (
  `id` int NOT NULL,
  `nom_depot` varchar(150) NOT NULL,
  `code_depot` varchar(50) NOT NULL,
  `localisation` varchar(255) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `capacite_totale` decimal(15,2) NOT NULL DEFAULT '0.00',
  `responsable_id` int DEFAULT NULL,
  `statut` enum('actif','inactif') DEFAULT 'actif',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `depots`
--

INSERT INTO `depots` (`id`, `nom_depot`, `code_depot`, `localisation`, `ville`, `capacite_totale`, `responsable_id`, `statut`, `date_creation`, `date_modification`) VALUES
(1, 'Dépôt Central Goma', 'DEP-GOM-001', 'Quartier Industriel', 'Goma', 500000.00, NULL, 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(2, 'Dépôt Butembo', 'DEP-BUT-001', 'Zone Logistique Butembo', 'Butembo', 300000.00, NULL, 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(3, 'Dépôt Beni', 'DEP-BEN-001', 'Axe principal Beni', 'Beni', 250000.00, 7, 'actif', '2026-03-31 02:52:13', '2026-04-15 17:19:55');

-- --------------------------------------------------------

--
-- Table structure for table `fournisseurs`
--

CREATE TABLE `fournisseurs` (
  `id` int NOT NULL,
  `nom_fournisseur` varchar(150) NOT NULL,
  `type_fournisseur` varchar(100) DEFAULT NULL,
  `contact_personne` varchar(150) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT 'Nord-Kivu',
  `statut` enum('actif','inactif') DEFAULT 'actif',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fournisseurs`
--

INSERT INTO `fournisseurs` (`id`, `nom_fournisseur`, `type_fournisseur`, `contact_personne`, `telephone`, `email`, `adresse`, `ville`, `province`, `statut`, `date_creation`, `date_modification`) VALUES
(1, 'SONAHYDROC', 'Entreprise publique', 'M. Patrick', '0991111111', 'contact@sonahydroc.cd', 'Boulevard Kanyamuhanga', 'Goma', 'Nord-Kivu', 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(2, 'Virunga Petroleum', 'Entreprise privée', 'Mme Aline', '0992222222', 'info@virungapetroleum.com', 'Quartier Les Volcans', 'Goma', 'Nord-Kivu', 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(3, 'Kivu Oil Supply', 'Grossiste', 'M. James', '0993333333', 'contact@kivuoil.com', 'Commune de Karisimbi', 'Goma', 'Nord-Kivu', 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13');

-- --------------------------------------------------------

--
-- Table structure for table `livraisons`
--

CREATE TABLE `livraisons` (
  `id` int NOT NULL,
  `reference_livraison` varchar(100) NOT NULL,
  `depot_id` int NOT NULL,
  `station_id` int NOT NULL,
  `type_carburant_id` int NOT NULL,
  `vehicule_id` int DEFAULT NULL,
  `quantite` decimal(15,2) NOT NULL,
  `date_depart` datetime NOT NULL,
  `date_arrivee` datetime DEFAULT NULL,
  `statut` enum('preparee','en_cours','livree','annulee') DEFAULT 'preparee',
  `cree_par` int DEFAULT NULL,
  `commentaire` text,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `livraisons`
--

INSERT INTO `livraisons` (`id`, `reference_livraison`, `depot_id`, `station_id`, `type_carburant_id`, `vehicule_id`, `quantite`, `date_depart`, `date_arrivee`, `statut`, `cree_par`, `commentaire`, `date_creation`, `date_modification`) VALUES
(1, 'LIVR-2026-0001', 1, 1, 2, 2, 15000.00, '2026-03-23 06:00:00', '2026-03-23 11:00:00', 'livree', NULL, 'Livraison diesel vers Goma Centre', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(2, 'LIVR-2026-0002', 1, 2, 1, 1, 12000.00, '2026-03-24 07:30:00', NULL, 'en_cours', NULL, 'Livraison essence vers Majengo', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(3, 'LIVR-2026-0003', 2, 3, 3, 3, 10000.00, '2026-03-24 08:00:00', '2026-03-24 13:00:00', 'livree', NULL, 'Livraison pétrole vers Butembo Nord', '2026-03-31 02:52:13', '2026-03-31 02:52:13');

-- --------------------------------------------------------

--
-- Table structure for table `mouvements_stock`
--

CREATE TABLE `mouvements_stock` (
  `id` int NOT NULL,
  `reference_mouvement` varchar(100) NOT NULL,
  `type_mouvement` enum('entree_depot','sortie_depot','entree_station','sortie_station','transfert') NOT NULL,
  `type_carburant_id` int NOT NULL,
  `depot_id` int DEFAULT NULL,
  `station_id` int DEFAULT NULL,
  `approvisionnement_id` int DEFAULT NULL,
  `livraison_id` int DEFAULT NULL,
  `quantite` decimal(15,2) NOT NULL,
  `date_mouvement` datetime NOT NULL,
  `cree_par` int DEFAULT NULL,
  `commentaire` text,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mouvements_stock`
--

INSERT INTO `mouvements_stock` (`id`, `reference_mouvement`, `type_mouvement`, `type_carburant_id`, `depot_id`, `station_id`, `approvisionnement_id`, `livraison_id`, `quantite`, `date_mouvement`, `cree_par`, `commentaire`, `date_creation`) VALUES
(1, 'MVT-2026-0001', 'entree_depot', 2, 1, NULL, 1, NULL, 120000.00, '2026-03-20 08:45:00', NULL, 'Entrée diesel au dépôt central', '2026-03-31 02:52:13'),
(2, 'MVT-2026-0002', 'entree_depot', 1, 1, NULL, 2, NULL, 80000.00, '2026-03-21 10:30:00', NULL, 'Entrée essence au dépôt central', '2026-03-31 02:52:13'),
(3, 'MVT-2026-0003', 'entree_depot', 3, 2, NULL, 3, NULL, 50000.00, '2026-03-22 09:20:00', NULL, 'Entrée pétrole au dépôt Butembo', '2026-03-31 02:52:13'),
(4, 'MVT-2026-0004', 'sortie_depot', 2, 1, NULL, NULL, 1, 15000.00, '2026-03-23 06:05:00', NULL, 'Sortie diesel du dépôt vers station Goma Centre', '2026-03-31 02:52:13'),
(5, 'MVT-2026-0005', 'entree_station', 2, NULL, 1, NULL, 1, 15000.00, '2026-03-23 11:10:00', NULL, 'Entrée diesel station Goma Centre', '2026-03-31 02:52:13'),
(6, 'MVT-2026-0006', 'sortie_depot', 1, 1, NULL, NULL, 2, 12000.00, '2026-03-24 07:35:00', NULL, 'Sortie essence vers Majengo', '2026-03-31 02:52:13'),
(7, 'MVT-2026-0007', 'sortie_depot', 3, 2, NULL, NULL, 3, 10000.00, '2026-03-24 08:05:00', NULL, 'Sortie pétrole vers Butembo Nord', '2026-03-31 02:52:13'),
(8, 'MVT-2026-0008', 'entree_station', 3, NULL, 3, NULL, 3, 10000.00, '2026-03-24 13:10:00', NULL, 'Entrée pétrole station Butembo Nord', '2026-03-31 02:52:13'),
(9, 'MVT-20260415190102-CEA549', 'entree_depot', 3, 3, NULL, NULL, NULL, 10000.00, '2026-04-15 19:01:02', 6, 'TBC-Groupe', '2026-04-15 18:01:02'),
(10, 'MVT-20260415190809-50DCEE', 'entree_depot', 3, 1, NULL, NULL, NULL, 11000.00, '2026-04-15 19:08:09', 6, 'TBC-Groupe', '2026-04-15 18:08:09'),
(11, 'MVT-20260416000309-5FA0A5', 'entree_station', 3, NULL, 4, NULL, NULL, 11000.00, '2026-04-16 00:03:09', 6, 'TBC-Groupe', '2026-04-15 23:03:09'),
(12, 'MVT-20260416000336-770B0B', 'sortie_station', 3, NULL, 4, NULL, NULL, 200.00, '2026-04-16 01:03:00', 6, 'Vente station VTE-20260416000336-D3F7C1 - client 0812170541', '2026-04-15 23:03:36'),
(13, 'MVT-20260416001853-147C08', 'sortie_station', 3, NULL, 4, NULL, NULL, 20.00, '2026-04-16 01:15:00', 7, 'Vente station VTE-20260416001853-F75FC5 - client 0979636304', '2026-04-15 23:18:53'),
(14, 'MVT-20260420235503-74B51D', 'entree_station', 2, NULL, 4, NULL, NULL, 10000.00, '2026-04-20 23:55:03', 6, 'TBC-Groupe', '2026-04-20 22:55:03'),
(17, 'MVT-20260421001507-B21E4B', 'entree_depot', 3, 2, NULL, 16, NULL, 1000.00, '2026-04-21 01:14:00', 6, 'Reception approvisionnement APPRO-2026-0004', '2026-04-20 23:15:07'),
(18, 'MVT-20260421001811-8609E6', 'sortie_station', 3, NULL, 4, NULL, NULL, 100.00, '2026-04-21 01:16:00', 6, 'Vente station VTE-20260421001811-5CA50D - client 7057399146', '2026-04-20 23:18:11'),
(19, 'MVT-20260421161047-60F98E', 'sortie_station', 3, NULL, 4, NULL, NULL, 1500.00, '2026-04-21 17:08:00', 7, 'Vente station VTE-20260421161047-A57646 - client 0949857474', '2026-04-21 15:10:47');

-- --------------------------------------------------------

--
-- Table structure for table `prix_carburants`
--

CREATE TABLE `prix_carburants` (
  `id` int NOT NULL,
  `station_id` int NOT NULL,
  `type_carburant_id` int NOT NULL,
  `prix_unitaire_usd` decimal(15,2) NOT NULL,
  `statut` enum('actif','inactif') NOT NULL DEFAULT 'actif',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prix_carburants`
--

INSERT INTO `prix_carburants` (`id`, `station_id`, `type_carburant_id`, `prix_unitaire_usd`, `statut`, `date_creation`, `date_modification`) VALUES
(1, 4, 3, 1.00, 'actif', '2026-04-15 17:15:13', '2026-04-15 17:15:13'),
(2, 4, 2, 2.00, 'actif', '2026-04-15 23:05:32', '2026-04-15 23:05:32'),
(3, 4, 1, 0.50, 'actif', '2026-04-15 23:08:53', '2026-04-15 23:08:53');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `nom_role` varchar(50) NOT NULL,
  `description_role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `nom_role`, `description_role`) VALUES
(1, 'Administrateur', 'Gestion complète du système'),
(2, 'Gestionnaire de stock', 'Gestion des dépôts et mouvements de stock'),
(3, 'Responsable logistique', 'Gestion des livraisons et transports'),
(4, 'Responsable station', 'Gestion des stations-service'),
(5, 'Superviseur', 'Consultation des rapports et tableaux de bord');

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int NOT NULL,
  `nom_station` varchar(150) NOT NULL,
  `code_station` varchar(50) NOT NULL,
  `localisation` varchar(255) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `capacite_stockage` decimal(15,2) NOT NULL DEFAULT '0.00',
  `responsable_id` int DEFAULT NULL,
  `statut` enum('actif','inactif') DEFAULT 'actif',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `nom_station`, `code_station`, `localisation`, `ville`, `capacite_stockage`, `responsable_id`, `statut`, `date_creation`, `date_modification`) VALUES
(1, 'Station Goma Centre', 'STA-GOM-001', 'Centre-ville Goma', 'Goma', 50000.00, NULL, 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(2, 'Station Majengo', 'STA-GOM-002', 'Majengo', 'Goma', 35000.00, NULL, 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(3, 'Station Butembo Nord', 'STA-BUT-001', 'Quartier Matanda', 'Butembo', 40000.00, NULL, 'actif', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(4, 'Station Beni Centre', 'STA-BEN-001', 'Centre Beni', 'Beni', 30000.00, 7, 'actif', '2026-03-31 02:52:13', '2026-04-15 17:34:25');

-- --------------------------------------------------------

--
-- Table structure for table `stocks_depots`
--

CREATE TABLE `stocks_depots` (
  `id` int NOT NULL,
  `depot_id` int NOT NULL,
  `type_carburant_id` int NOT NULL,
  `quantite_disponible` decimal(15,2) NOT NULL DEFAULT '0.00',
  `seuil_alerte` decimal(15,2) NOT NULL DEFAULT '0.00',
  `date_mise_a_jour` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stocks_depots`
--

INSERT INTO `stocks_depots` (`id`, `depot_id`, `type_carburant_id`, `quantite_disponible`, `seuil_alerte`, `date_mise_a_jour`) VALUES
(1, 1, 1, 68000.00, 10000.00, '2026-03-31 02:52:13'),
(2, 1, 2, 105000.00, 15000.00, '2026-04-20 23:13:43'),
(3, 1, 3, 11000.00, 200.00, '2026-04-15 18:08:09'),
(4, 2, 1, 0.00, 5000.00, '2026-03-31 02:52:13'),
(5, 2, 2, 0.00, 5000.00, '2026-03-31 02:52:13'),
(6, 2, 3, 41000.00, 7000.00, '2026-04-20 23:15:07'),
(7, 3, 1, 0.00, 5000.00, '2026-03-31 02:52:13'),
(8, 3, 2, 0.00, 5000.00, '2026-03-31 02:52:13'),
(9, 3, 3, 10000.00, 200.00, '2026-04-15 18:01:02');

-- --------------------------------------------------------

--
-- Table structure for table `stocks_stations`
--

CREATE TABLE `stocks_stations` (
  `id` int NOT NULL,
  `station_id` int NOT NULL,
  `type_carburant_id` int NOT NULL,
  `quantite_disponible` decimal(15,2) NOT NULL DEFAULT '0.00',
  `seuil_alerte` decimal(15,2) NOT NULL DEFAULT '0.00',
  `date_mise_a_jour` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stocks_stations`
--

INSERT INTO `stocks_stations` (`id`, `station_id`, `type_carburant_id`, `quantite_disponible`, `seuil_alerte`, `date_mise_a_jour`) VALUES
(1, 1, 2, 15000.00, 3000.00, '2026-03-31 02:52:13'),
(2, 2, 1, 8000.00, 2500.00, '2026-03-31 02:52:13'),
(3, 3, 3, 10000.00, 2000.00, '2026-03-31 02:52:13'),
(4, 4, 2, 10000.00, 200.00, '2026-04-20 22:55:03'),
(5, 4, 3, 9180.00, 200.00, '2026-04-21 15:10:47');

-- --------------------------------------------------------

--
-- Table structure for table `taux_change_stations`
--

CREATE TABLE `taux_change_stations` (
  `id` int NOT NULL,
  `station_id` int NOT NULL,
  `taux_usd_cdf` decimal(15,2) NOT NULL,
  `date_application` datetime NOT NULL,
  `statut` enum('actif','inactif') NOT NULL DEFAULT 'actif',
  `cree_par` int DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `taux_change_stations`
--

INSERT INTO `taux_change_stations` (`id`, `station_id`, `taux_usd_cdf`, `date_application`, `statut`, `cree_par`, `date_creation`) VALUES
(1, 4, 2200.00, '2026-04-15 19:12:00', 'actif', 6, '2026-04-15 17:13:05'),
(2, 1, 2200.00, '2026-04-16 01:09:00', 'actif', 6, '2026-04-15 23:09:56'),
(3, 2, 2200.00, '2026-04-16 01:09:00', 'actif', 6, '2026-04-15 23:10:13'),
(4, 3, 2250.00, '2026-04-16 01:10:00', 'actif', 6, '2026-04-15 23:10:41');

-- --------------------------------------------------------

--
-- Table structure for table `types_carburant`
--

CREATE TABLE `types_carburant` (
  `id` int NOT NULL,
  `nom_carburant` varchar(100) NOT NULL,
  `description_carburant` varchar(255) DEFAULT NULL,
  `unite_mesure` varchar(20) DEFAULT 'litres',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `types_carburant`
--

INSERT INTO `types_carburant` (`id`, `nom_carburant`, `description_carburant`, `unite_mesure`, `date_creation`) VALUES
(1, 'Essence', 'Carburant pour véhicules légers', 'litres', '2026-03-31 02:52:13'),
(2, 'Diesel', 'Carburant pour véhicules lourds et groupes électrogènes', 'litres', '2026-03-31 02:52:13'),
(3, 'Pétrole', 'Carburant domestique et industriel léger', 'litres', '2026-03-31 02:52:13');

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `role_id` int NOT NULL,
  `statut` enum('actif','inactif') DEFAULT 'actif',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `mot_de_passe`, `telephone`, `role_id`, `statut`, `date_creation`, `date_modification`) VALUES
(6, 'Admin', 'Systeme', 'admin@fueltrack.com', '$2y$12$YXMLJ.YpuI7WpRvdebkCkO.zjUcCBIJSTq0y4WtqX5pvJohY8PVTe', '812170541', 1, 'actif', '2026-04-08 22:08:54', '2026-04-15 17:15:47'),
(7, 'BUJIRIRI', 'Thibaut Chris', 'thibauttbcbujiriri@gmail.com', '$2y$12$gCfsWJv3423L7vAMhQoNyu/N.nbz.tNabU7ujEbtcTPinDJthdET.', '979823604', 3, 'actif', '2026-04-08 22:15:05', '2026-04-21 20:17:45');

-- --------------------------------------------------------

--
-- Table structure for table `vehicules`
--

CREATE TABLE `vehicules` (
  `id` int NOT NULL,
  `immatriculation` varchar(50) NOT NULL,
  `marque` varchar(100) DEFAULT NULL,
  `modele` varchar(100) DEFAULT NULL,
  `nom_chauffeur` varchar(150) DEFAULT NULL,
  `telephone_chauffeur` varchar(20) DEFAULT NULL,
  `capacite` decimal(15,2) NOT NULL DEFAULT '0.00',
  `type_vehicule` varchar(100) DEFAULT 'Camion-citerne',
  `statut` enum('disponible','en_mission','maintenance','hors_service') DEFAULT 'disponible',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_modification` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicules`
--

INSERT INTO `vehicules` (`id`, `immatriculation`, `marque`, `modele`, `nom_chauffeur`, `telephone_chauffeur`, `capacite`, `type_vehicule`, `statut`, `date_creation`, `date_modification`) VALUES
(1, 'RDC-TRK-001', 'Mercedes', 'Actros', 'M. Kule', '0994444441', 30000.00, 'Camion-citerne', 'disponible', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(2, 'RDC-TRK-002', 'Volvo', 'FH Tanker', 'M. Safari', '0994444442', 25000.00, 'Camion-citerne', 'en_mission', '2026-03-31 02:52:13', '2026-03-31 02:52:13'),
(3, 'RDC-TRK-003', 'Scania', 'P-Series', 'M. Muhindo', '0994444443', 20000.00, 'Camion-citerne', 'disponible', '2026-03-31 02:52:13', '2026-03-31 02:52:13');

-- --------------------------------------------------------

--
-- Table structure for table `ventes_station`
--

CREATE TABLE `ventes_station` (
  `id` int NOT NULL,
  `reference_vente` varchar(100) NOT NULL,
  `station_id` int NOT NULL,
  `client_id` int NOT NULL,
  `type_carburant_id` int NOT NULL,
  `quantite` decimal(15,2) NOT NULL,
  `devise_paiement` enum('USD','CDF') NOT NULL DEFAULT 'USD',
  `taux_change_applique` decimal(15,2) NOT NULL,
  `prix_unitaire_usd` decimal(15,2) NOT NULL,
  `prix_unitaire_cdf` decimal(15,2) NOT NULL,
  `reduction` decimal(15,2) NOT NULL DEFAULT '0.00',
  `montant_brut` decimal(15,2) NOT NULL,
  `montant_net` decimal(15,2) NOT NULL,
  `montant_paye` decimal(15,2) NOT NULL,
  `cree_par` int DEFAULT NULL,
  `date_vente` datetime NOT NULL,
  `commentaire` text,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ventes_station`
--

INSERT INTO `ventes_station` (`id`, `reference_vente`, `station_id`, `client_id`, `type_carburant_id`, `quantite`, `devise_paiement`, `taux_change_applique`, `prix_unitaire_usd`, `prix_unitaire_cdf`, `reduction`, `montant_brut`, `montant_net`, `montant_paye`, `cree_par`, `date_vente`, `commentaire`, `date_creation`) VALUES
(1, 'VTE-20260416000336-D3F7C1', 4, 1, 3, 200.00, 'USD', 2200.00, 1.00, 2200.00, 0.00, 200.00, 200.00, 200.00, 6, '2026-04-16 01:03:00', NULL, '2026-04-15 23:03:36'),
(2, 'VTE-20260416001853-F75FC5', 4, 2, 3, 20.00, 'USD', 2200.00, 1.00, 2200.00, 1.50, 20.00, 18.50, 18.50, 7, '2026-04-16 01:15:00', NULL, '2026-04-15 23:18:53'),
(3, 'VTE-20260421001811-5CA50D', 4, 3, 3, 100.00, 'USD', 2200.00, 1.00, 2200.00, 1.20, 100.00, 98.80, 91.00, 6, '2026-04-21 01:16:00', 'TBC-Groupe', '2026-04-20 23:18:11'),
(4, 'VTE-20260421161047-A57646', 4, 4, 3, 1500.00, 'USD', 2200.00, 1.00, 2200.00, 0.00, 1500.00, 1500.00, 500.00, 7, '2026-04-21 17:08:00', NULL, '2026-04-21 15:10:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alertes`
--
ALTER TABLE `alertes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_alerte_depot` (`depot_id`),
  ADD KEY `fk_alerte_station` (`station_id`),
  ADD KEY `fk_alerte_carburant` (`type_carburant_id`),
  ADD KEY `fk_alerte_utilisateur` (`cree_par`),
  ADD KEY `idx_alerte_date` (`date_alerte`);

--
-- Indexes for table `approvisionnements`
--
ALTER TABLE `approvisionnements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_approvisionnement` (`reference_approvisionnement`),
  ADD KEY `fk_appro_fournisseur` (`fournisseur_id`),
  ADD KEY `fk_appro_carburant` (`type_carburant_id`),
  ADD KEY `fk_appro_depot` (`depot_id`),
  ADD KEY `fk_appro_utilisateur` (`cree_par`),
  ADD KEY `idx_appro_date` (`date_approvisionnement`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telephone` (`telephone`);

--
-- Indexes for table `depots`
--
ALTER TABLE `depots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_depot` (`code_depot`),
  ADD KEY `fk_depot_responsable` (`responsable_id`);

--
-- Indexes for table `fournisseurs`
--
ALTER TABLE `fournisseurs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `livraisons`
--
ALTER TABLE `livraisons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_livraison` (`reference_livraison`),
  ADD KEY `fk_livraison_depot` (`depot_id`),
  ADD KEY `fk_livraison_station` (`station_id`),
  ADD KEY `fk_livraison_carburant` (`type_carburant_id`),
  ADD KEY `fk_livraison_vehicule` (`vehicule_id`),
  ADD KEY `fk_livraison_utilisateur` (`cree_par`),
  ADD KEY `idx_livraison_date_depart` (`date_depart`);

--
-- Indexes for table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_mouvement` (`reference_mouvement`),
  ADD KEY `fk_mouvement_carburant` (`type_carburant_id`),
  ADD KEY `fk_mouvement_depot` (`depot_id`),
  ADD KEY `fk_mouvement_station` (`station_id`),
  ADD KEY `fk_mouvement_appro` (`approvisionnement_id`),
  ADD KEY `fk_mouvement_livraison` (`livraison_id`),
  ADD KEY `fk_mouvement_utilisateur` (`cree_par`),
  ADD KEY `idx_mouvement_date` (`date_mouvement`);

--
-- Indexes for table `prix_carburants`
--
ALTER TABLE `prix_carburants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_prix_station_carburant` (`station_id`,`type_carburant_id`),
  ADD KEY `fk_prix_carburant` (`type_carburant_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_role` (`nom_role`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_station` (`code_station`),
  ADD KEY `fk_station_responsable` (`responsable_id`);

--
-- Indexes for table `stocks_depots`
--
ALTER TABLE `stocks_depots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_stock_depot` (`depot_id`,`type_carburant_id`),
  ADD KEY `fk_stock_depot_carburant` (`type_carburant_id`);

--
-- Indexes for table `stocks_stations`
--
ALTER TABLE `stocks_stations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_stock_station` (`station_id`,`type_carburant_id`),
  ADD KEY `fk_stock_station_carburant` (`type_carburant_id`);

--
-- Indexes for table `taux_change_stations`
--
ALTER TABLE `taux_change_stations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_taux_station` (`station_id`),
  ADD KEY `fk_taux_utilisateur` (`cree_par`);

--
-- Indexes for table `types_carburant`
--
ALTER TABLE `types_carburant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_carburant` (`nom_carburant`);

--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_utilisateur_role` (`role_id`);

--
-- Indexes for table `vehicules`
--
ALTER TABLE `vehicules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `immatriculation` (`immatriculation`);

--
-- Indexes for table `ventes_station`
--
ALTER TABLE `ventes_station`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_vente` (`reference_vente`),
  ADD KEY `fk_vente_station` (`station_id`),
  ADD KEY `fk_vente_client` (`client_id`),
  ADD KEY `fk_vente_carburant` (`type_carburant_id`),
  ADD KEY `fk_vente_utilisateur` (`cree_par`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alertes`
--
ALTER TABLE `alertes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `approvisionnements`
--
ALTER TABLE `approvisionnements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `depots`
--
ALTER TABLE `depots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fournisseurs`
--
ALTER TABLE `fournisseurs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `livraisons`
--
ALTER TABLE `livraisons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `prix_carburants`
--
ALTER TABLE `prix_carburants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stocks_depots`
--
ALTER TABLE `stocks_depots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `stocks_stations`
--
ALTER TABLE `stocks_stations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `taux_change_stations`
--
ALTER TABLE `taux_change_stations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `types_carburant`
--
ALTER TABLE `types_carburant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vehicules`
--
ALTER TABLE `vehicules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ventes_station`
--
ALTER TABLE `ventes_station`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alertes`
--
ALTER TABLE `alertes`
  ADD CONSTRAINT `fk_alerte_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_alerte_depot` FOREIGN KEY (`depot_id`) REFERENCES `depots` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_alerte_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_alerte_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `approvisionnements`
--
ALTER TABLE `approvisionnements`
  ADD CONSTRAINT `fk_appro_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appro_depot` FOREIGN KEY (`depot_id`) REFERENCES `depots` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appro_fournisseur` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appro_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `depots`
--
ALTER TABLE `depots`
  ADD CONSTRAINT `fk_depot_responsable` FOREIGN KEY (`responsable_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `livraisons`
--
ALTER TABLE `livraisons`
  ADD CONSTRAINT `fk_livraison_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_livraison_depot` FOREIGN KEY (`depot_id`) REFERENCES `depots` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_livraison_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_livraison_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_livraison_vehicule` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD CONSTRAINT `fk_mouvement_appro` FOREIGN KEY (`approvisionnement_id`) REFERENCES `approvisionnements` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mouvement_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mouvement_depot` FOREIGN KEY (`depot_id`) REFERENCES `depots` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mouvement_livraison` FOREIGN KEY (`livraison_id`) REFERENCES `livraisons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mouvement_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mouvement_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `prix_carburants`
--
ALTER TABLE `prix_carburants`
  ADD CONSTRAINT `fk_prix_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_prix_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stations`
--
ALTER TABLE `stations`
  ADD CONSTRAINT `fk_station_responsable` FOREIGN KEY (`responsable_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stocks_depots`
--
ALTER TABLE `stocks_depots`
  ADD CONSTRAINT `fk_stock_depot_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_stock_depot_depot` FOREIGN KEY (`depot_id`) REFERENCES `depots` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stocks_stations`
--
ALTER TABLE `stocks_stations`
  ADD CONSTRAINT `fk_stock_station_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_stock_station_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `taux_change_stations`
--
ALTER TABLE `taux_change_stations`
  ADD CONSTRAINT `fk_taux_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_taux_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `fk_utilisateur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `ventes_station`
--
ALTER TABLE `ventes_station`
  ADD CONSTRAINT `fk_vente_carburant` FOREIGN KEY (`type_carburant_id`) REFERENCES `types_carburant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vente_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vente_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vente_utilisateur` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
