<?php

declare(strict_types=1);

require_once __DIR__ . '/../../config/connexion.php';
require_once __DIR__ . '/../../utilitaires/reponse_json.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Role-Id, X-User-Id');
header('Content-Type: application/json; charset=utf-8');

// Permet les requêtes preflight CORS sans authentification
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$definitions = [
    'utilisateurs' => [
        'table' => 'utilisateurs',
        'champs' => ['nom', 'prenom', 'email', 'mot_de_passe', 'telephone', 'role_id', 'statut'],
        'obligatoires' => ['nom', 'prenom', 'email', 'role_id'],
    ],
    'fournisseurs' => [
        'table' => 'fournisseurs',
        'champs' => ['nom_fournisseur', 'type_fournisseur', 'contact_personne', 'telephone', 'email', 'adresse', 'ville', 'province', 'statut'],
        'obligatoires' => ['nom_fournisseur'],
    ],
    'types_carburant' => [
        'table' => 'types_carburant',
        'champs' => ['nom_carburant', 'description_carburant', 'unite_mesure'],
        'obligatoires' => ['nom_carburant'],
    ],
    'depots' => [
        'table' => 'depots',
        'champs' => ['nom_depot', 'code_depot', 'localisation', 'ville', 'capacite_totale', 'responsable_id', 'statut'],
        'obligatoires' => ['nom_depot', 'code_depot', 'localisation', 'ville'],
    ],
    'stations' => [
        'table' => 'stations',
        'champs' => ['nom_station', 'code_station', 'localisation', 'ville', 'capacite_stockage', 'responsable_id', 'statut'],
        'obligatoires' => ['nom_station', 'code_station', 'localisation', 'ville'],
    ],
    'clients' => [
        'table' => 'clients',
        'champs' => ['nom_client', 'telephone', 'email', 'adresse', 'statut'],
        'obligatoires' => ['nom_client', 'telephone'],
    ],
    'prix_carburants' => [
        'table' => 'prix_carburants',
        'champs' => ['station_id', 'type_carburant_id', 'prix_unitaire_usd', 'statut'],
        'obligatoires' => ['station_id', 'type_carburant_id', 'prix_unitaire_usd'],
    ],
    'taux_change_stations' => [
        'table' => 'taux_change_stations',
        'champs' => ['station_id', 'taux_usd_cdf', 'date_application', 'statut', 'cree_par'],
        'obligatoires' => ['station_id', 'taux_usd_cdf', 'date_application'],
    ],
    'stocks_depots' => [
        'table' => 'stocks_depots',
        'champs' => ['depot_id', 'type_carburant_id', 'quantite_disponible', 'seuil_alerte'],
        'obligatoires' => ['depot_id', 'type_carburant_id'],
    ],
    'stocks_stations' => [
        'table' => 'stocks_stations',
        'champs' => ['station_id', 'type_carburant_id', 'quantite_disponible', 'seuil_alerte'],
        'obligatoires' => ['station_id', 'type_carburant_id'],
    ],
    'vehicules' => [
        'table' => 'vehicules',
        'champs' => ['immatriculation', 'marque', 'modele', 'nom_chauffeur', 'telephone_chauffeur', 'capacite', 'type_vehicule', 'statut'],
        'obligatoires' => ['immatriculation'],
    ],
    'approvisionnements' => [
        'table' => 'approvisionnements',
        'champs' => ['reference_approvisionnement', 'fournisseur_id', 'type_carburant_id', 'depot_id', 'quantite', 'cout_unitaire', 'date_approvisionnement', 'statut', 'cree_par', 'commentaire'],
        'obligatoires' => ['reference_approvisionnement', 'fournisseur_id', 'type_carburant_id', 'depot_id', 'quantite', 'cout_unitaire', 'date_approvisionnement'],
    ],
    'livraisons' => [
        'table' => 'livraisons',
        'champs' => ['reference_livraison', 'depot_id', 'station_id', 'type_carburant_id', 'vehicule_id', 'quantite', 'date_depart', 'date_arrivee', 'statut', 'cree_par', 'commentaire'],
        'obligatoires' => ['reference_livraison', 'depot_id', 'station_id', 'type_carburant_id', 'quantite', 'date_depart'],
    ],
    'mouvements_stock' => [
        'table' => 'mouvements_stock',
        'champs' => ['reference_mouvement', 'type_mouvement', 'type_carburant_id', 'depot_id', 'station_id', 'approvisionnement_id', 'livraison_id', 'quantite', 'date_mouvement', 'cree_par', 'commentaire'],
        'obligatoires' => ['reference_mouvement', 'type_mouvement', 'type_carburant_id', 'quantite', 'date_mouvement'],
    ],
    'alertes' => [
        'table' => 'alertes',
        'champs' => ['type_alerte', 'niveau', 'depot_id', 'station_id', 'type_carburant_id', 'message', 'statut', 'date_alerte', 'cree_par'],
        'obligatoires' => ['type_alerte', 'message', 'date_alerte'],
    ],
    'roles' => [
        'table' => 'roles',
        'champs' => ['nom_role', 'description_role'],
        'obligatoires' => ['nom_role'],
    ],
];

function lireCorpsJson(): array
{
    $contenu = file_get_contents('php://input');
    if ($contenu === false || trim($contenu) === '') {
        return [];
    }

    $data = json_decode($contenu, true);
    if (!is_array($data)) {
        reponseErreur('Corps JSON invalide.', 400);
    }

    return $data;
}

function filtrerDonnees(array $source, array $champsAutorises): array
{
    $resultat = [];
    foreach ($champsAutorises as $champ) {
        if (array_key_exists($champ, $source)) {
            $resultat[$champ] = $source[$champ];
        }
    }

    return $resultat;
}

function nettoyerDonneesSensibles(string $entity, array $ligne): array
{
    if ($entity === 'utilisateurs') {
        unset($ligne['mot_de_passe']);
    }

    return $ligne;
}

function nettoyerCollectionSensible(string $entity, array $lignes): array
{
    return array_map(
        static fn(array $ligne): array => nettoyerDonneesSensibles($entity, $ligne),
        $lignes
    );
}

function normaliserTelephone(?string $telephone): string
{
    $telephone = trim((string) $telephone);
    return preg_replace('/\s+/', '', $telephone) ?? '';
}

function genererReference(string $prefixe): string
{
    return sprintf('%s-%s-%s', $prefixe, date('YmdHis'), strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)));
}

function obtenirStationResponsable(PDO $pdo, int $userId): ?array
{
    $stmt = $pdo->prepare('SELECT id, nom_station FROM stations WHERE responsable_id = :user_id LIMIT 1');
    $stmt->execute(['user_id' => $userId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function utilisateurExiste(PDO $pdo, int $userId): bool
{
    if ($userId <= 0) {
        return false;
    }

    $stmt = $pdo->prepare('SELECT id FROM utilisateurs WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $userId]);
    return (bool) $stmt->fetchColumn();
}

function determinerCreePar(PDO $pdo, int $userIdHeader, mixed $creeParSoumis): ?int
{
    $creeParSoumis = (int) $creeParSoumis;
    if ($creeParSoumis > 0 && utilisateurExiste($pdo, $creeParSoumis)) {
        return $creeParSoumis;
    }

    if ($userIdHeader > 0 && utilisateurExiste($pdo, $userIdHeader)) {
        return $userIdHeader;
    }

    return null;
}

function normaliserDateHeure(string $valeur, string $champ): string
{
    $valeur = trim($valeur);
    if ($valeur === '') {
        reponseErreur(sprintf('Le champ %s est requis.', $champ), 422);
    }

    $formats = ['Y-m-d H:i:s', 'Y-m-d\TH:i', 'Y-m-d H:i', 'Y-m-d'];
    foreach ($formats as $format) {
        $date = DateTime::createFromFormat($format, $valeur);
        if ($date instanceof DateTime) {
            return $date->format('Y-m-d H:i:s');
        }
    }

    $timestamp = strtotime($valeur);
    if ($timestamp !== false) {
        return date('Y-m-d H:i:s', $timestamp);
    }

    reponseErreur(sprintf('Format de date invalide pour %s.', $champ), 422);
    return '';
}

function obtenirOuInitialiserStockStation(PDO $pdo, int $stationId, int $typeCarburantId): array
{
    $stmtStock = $pdo->prepare(
        'SELECT id, quantite_disponible
         FROM stocks_stations
         WHERE station_id = :station_id AND type_carburant_id = :type_carburant_id
         LIMIT 1'
    );
    $stmtStock->execute([
        'station_id' => $stationId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $stock = $stmtStock->fetch();

    if ($stock) {
        $stmtMouvements = $pdo->prepare(
            "SELECT
                COALESCE(SUM(
                    CASE
                        WHEN type_mouvement = 'entree_station' THEN quantite    
                        WHEN type_mouvement IN ('sortie_station', 'transfert') THEN -quantite
                        ELSE 0
                    END
                ), 0) AS stock_calcule
             FROM mouvements_stock
             WHERE station_id = :station_id
               AND type_carburant_id = :type_carburant_id"
        );
        $stmtMouvements->execute([
            'station_id' => $stationId,
            'type_carburant_id' => $typeCarburantId,
        ]);
        $row = $stmtMouvements->fetch();
        $quantiteCalculee = max((float) ($row['stock_calcule'] ?? 0), 0);

        if (abs($quantiteCalculee - (float) $stock['quantite_disponible']) > 0.0001) {
            $stmtUpdate = $pdo->prepare(
                'UPDATE stocks_stations
                 SET quantite_disponible = :quantite_disponible
                 WHERE id = :id'
            );
            $stmtUpdate->execute([
                'id' => (int) $stock['id'],
                'quantite_disponible' => $quantiteCalculee,
            ]);
            $stock['quantite_disponible'] = $quantiteCalculee;
        }

        return $stock;
    }

    $stmtMouvements = $pdo->prepare(
        "SELECT
            COALESCE(SUM(
                CASE
                    WHEN type_mouvement = 'entree_station' THEN quantite        
                    WHEN type_mouvement IN ('sortie_station', 'transfert') THEN -quantite
                    ELSE 0
                END
            ), 0) AS stock_calcule
         FROM mouvements_stock
         WHERE station_id = :station_id
           AND type_carburant_id = :type_carburant_id"
    );
    $stmtMouvements->execute([
        'station_id' => $stationId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $row = $stmtMouvements->fetch();
    $quantiteCalculee = max((float) ($row['stock_calcule'] ?? 0), 0);

    $stmtInsert = $pdo->prepare(
        'INSERT INTO stocks_stations (station_id, type_carburant_id, quantite_disponible, seuil_alerte)
         VALUES (:station_id, :type_carburant_id, :quantite_disponible, :seuil_alerte)'
    );
    $stmtInsert->execute([
        'station_id' => $stationId,
        'type_carburant_id' => $typeCarburantId,
        'quantite_disponible' => $quantiteCalculee,
        'seuil_alerte' => 0,
    ]);

    return [
        'id' => (int) $pdo->lastInsertId(),
        'quantite_disponible' => $quantiteCalculee,
    ];
}

function obtenirOuInitialiserStockDepot(PDO $pdo, int $depotId, int $typeCarburantId): array
{
    $stmtStock = $pdo->prepare(
        'SELECT id, quantite_disponible, seuil_alerte
         FROM stocks_depots
         WHERE depot_id = :depot_id AND type_carburant_id = :type_carburant_id
         LIMIT 1'
    );
    $stmtStock->execute([
        'depot_id' => $depotId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $stock = $stmtStock->fetch();

    if ($stock) {
        $stmtMouvements = $pdo->prepare(
            "SELECT
                COALESCE(SUM(
                    CASE
                        WHEN type_mouvement = 'entree_depot' THEN quantite
                        WHEN type_mouvement = 'sortie_depot' THEN -quantite
                        ELSE 0
                    END
                ), 0) AS stock_calcule
             FROM mouvements_stock
             WHERE depot_id = :depot_id
               AND type_carburant_id = :type_carburant_id"
        );
        $stmtMouvements->execute([
            'depot_id' => $depotId,
            'type_carburant_id' => $typeCarburantId,
        ]);
        $row = $stmtMouvements->fetch();
        $quantiteCalculee = max((float) ($row['stock_calcule'] ?? 0), 0);

        if (abs($quantiteCalculee - (float) $stock['quantite_disponible']) > 0.0001) {
            $stmtUpdate = $pdo->prepare(
                'UPDATE stocks_depots
                 SET quantite_disponible = :quantite_disponible
                 WHERE id = :id'
            );
            $stmtUpdate->execute([
                'id' => (int) $stock['id'],
                'quantite_disponible' => $quantiteCalculee,
            ]);
            $stock['quantite_disponible'] = $quantiteCalculee;
        }

        return $stock;
    }

    $stmtMouvements = $pdo->prepare(
        "SELECT
            COALESCE(SUM(
                CASE
                    WHEN type_mouvement = 'entree_depot' THEN quantite
                    WHEN type_mouvement = 'sortie_depot' THEN -quantite
                    ELSE 0
                END
            ), 0) AS stock_calcule
         FROM mouvements_stock
         WHERE depot_id = :depot_id
           AND type_carburant_id = :type_carburant_id"
    );
    $stmtMouvements->execute([
        'depot_id' => $depotId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $row = $stmtMouvements->fetch();
    $quantiteCalculee = max((float) ($row['stock_calcule'] ?? 0), 0);

    $stmtInsert = $pdo->prepare(
        'INSERT INTO stocks_depots (depot_id, type_carburant_id, quantite_disponible, seuil_alerte)
         VALUES (:depot_id, :type_carburant_id, :quantite_disponible, :seuil_alerte)'
    );
    $stmtInsert->execute([
        'depot_id' => $depotId,
        'type_carburant_id' => $typeCarburantId,
        'quantite_disponible' => $quantiteCalculee,
        'seuil_alerte' => 0,
    ]);

    return [
        'id' => (int) $pdo->lastInsertId(),
        'quantite_disponible' => $quantiteCalculee,
        'seuil_alerte' => 0,
    ];
}

function ajusterStockDepot(PDO $pdo, int $depotId, int $typeCarburantId, float $delta, bool $autoriserNegatif = false): array
{
    $stock = obtenirOuInitialiserStockDepot($pdo, $depotId, $typeCarburantId);
    $nouvelleQuantite = (float) $stock['quantite_disponible'] + $delta;

    if (!$autoriserNegatif && $nouvelleQuantite < 0) {
        reponseErreur('Stock depot insuffisant pour cette operation.', 422);
    }

    $stmt = $pdo->prepare(
        'UPDATE stocks_depots
         SET quantite_disponible = :quantite_disponible
         WHERE id = :id'
    );
    $stmt->execute([
        'id' => (int) $stock['id'],
        'quantite_disponible' => max($nouvelleQuantite, 0),
    ]);

    return [
        'id' => (int) $stock['id'],
        'quantite_disponible' => max($nouvelleQuantite, 0),
        'seuil_alerte' => (float) ($stock['seuil_alerte'] ?? 0),
    ];
}

function ajusterStockStation(PDO $pdo, int $stationId, int $typeCarburantId, float $delta, bool $autoriserNegatif = false): array
{
    $stock = obtenirOuInitialiserStockStation($pdo, $stationId, $typeCarburantId);
    $nouvelleQuantite = (float) $stock['quantite_disponible'] + $delta;

    if (!$autoriserNegatif && $nouvelleQuantite < 0) {
        reponseErreur('Stock station insuffisant pour cette operation.', 422);
    }

    $stmt = $pdo->prepare(
        'UPDATE stocks_stations
         SET quantite_disponible = :quantite_disponible
         WHERE id = :id'
    );
    $stmt->execute([
        'id' => (int) $stock['id'],
        'quantite_disponible' => max($nouvelleQuantite, 0),
    ]);

    return [
        'id' => (int) $stock['id'],
        'quantite_disponible' => max($nouvelleQuantite, 0),
        'seuil_alerte' => (float) ($stock['seuil_alerte'] ?? 0),
    ];
}

function formaterNombreAlerte(float $valeur): string
{
    $formatte = rtrim(rtrim(number_format($valeur, 2, '.', ''), '0'), '.');
    return $formatte === '' ? '0' : $formatte;
}

function obtenirLibelleStock(PDO $pdo, string $typeSite, int $siteId): string
{
    if ($typeSite === 'depot') {
        $stmt = $pdo->prepare('SELECT nom_depot FROM depots WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $siteId]);
        return (string) ($stmt->fetchColumn() ?: 'Dépôt inconnu');
    }

    if ($typeSite === 'station') {
        $stmt = $pdo->prepare('SELECT nom_station FROM stations WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $siteId]);
        return (string) ($stmt->fetchColumn() ?: 'Station inconnue');
    }

    return 'Site inconnu';
}

function obtenirNomCarburant(PDO $pdo, int $typeCarburantId): string
{
    $stmt = $pdo->prepare('SELECT nom_carburant FROM types_carburant WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $typeCarburantId]);
    return (string) ($stmt->fetchColumn() ?: 'Carburant inconnu');
}

function mettreAJourAlerteStock(PDO $pdo, string $typeSite, int $siteId, int $typeCarburantId, float $quantite, float $seuilAlerte, int $userId): void
{
    $typeAlerte = null;
    $niveau = null;

    if ($quantite <= 0) {
        $typeAlerte = 'stock_critique';
        $niveau = 'critique';
    } elseif ($seuilAlerte > 0 && $quantite <= $seuilAlerte) {
        $typeAlerte = 'stock_faible';
        $niveau = 'eleve';
    }

    $siteLabel = obtenirLibelleStock($pdo, $typeSite, $siteId);
    $carburantLabel = obtenirNomCarburant($pdo, $typeCarburantId);
    $dateAlerte = date('Y-m-d H:i:s');
    $colonneSite = $typeSite === 'depot' ? 'depot_id' : 'station_id';
    $conditionSite = sprintf('%s = :site_id', $colonneSite);

    $stmtResoudre = $pdo->prepare(
        "UPDATE alertes
         SET statut = 'resolue'
         WHERE statut <> 'resolue'
           AND type_alerte IN ('stock_faible', 'stock_critique')
           AND $conditionSite
           AND type_carburant_id = :type_carburant_id"
    );
    $stmtResoudre->execute([
        'site_id' => $siteId,
        'type_carburant_id' => $typeCarburantId,
    ]);

    if ($typeAlerte === null) {
        return;
    }

    $message = sprintf(
        'Le %s %s pour %s est %s: %s litres restants pour un seuil de %s litres.',
        $typeSite === 'depot' ? 'dépôt' : 'station',
        $siteLabel,
        $carburantLabel,
        $typeAlerte === 'stock_critique' ? 'en stock critique' : 'sous le seuil d’alerte',
        formaterNombreAlerte($quantite),
        formaterNombreAlerte($seuilAlerte)
    );

    $stmtTrouver = $pdo->prepare(
        "SELECT id
         FROM alertes
         WHERE statut <> 'resolue'
           AND type_alerte = :type_alerte
           AND $conditionSite
           AND type_carburant_id = :type_carburant_id
         ORDER BY id DESC
         LIMIT 1"
    );
    $stmtTrouver->execute([
        'type_alerte' => $typeAlerte,
        'site_id' => $siteId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $alerteId = $stmtTrouver->fetchColumn();

    if ($alerteId) {
        $stmtUpdate = $pdo->prepare(
            'UPDATE alertes
             SET niveau = :niveau,
                 message = :message,
                 statut = :statut,
                 date_alerte = :date_alerte,
                 cree_par = :cree_par
             WHERE id = :id'
        );
        $stmtUpdate->execute([
            'id' => (int) $alerteId,
            'niveau' => $niveau,
            'message' => $message,
            'statut' => 'nouvelle',
            'date_alerte' => $dateAlerte,
            'cree_par' => $userId > 0 ? $userId : null,
        ]);
        return;
    }

    $stmtInsert = $pdo->prepare(
        'INSERT INTO alertes (
            type_alerte, niveau, depot_id, station_id, type_carburant_id,
            message, statut, date_alerte, cree_par
         ) VALUES (
            :type_alerte, :niveau, :depot_id, :station_id, :type_carburant_id,
            :message, :statut, :date_alerte, :cree_par
         )'
    );
    $stmtInsert->execute([
        'type_alerte' => $typeAlerte,
        'niveau' => $niveau,
        'depot_id' => $typeSite === 'depot' ? $siteId : null,
        'station_id' => $typeSite === 'station' ? $siteId : null,
        'type_carburant_id' => $typeCarburantId,
        'message' => $message,
        'statut' => 'nouvelle',
        'date_alerte' => $dateAlerte,
        'cree_par' => $userId > 0 ? $userId : null,
    ]);
}

function synchroniserAlertesStockDepot(PDO $pdo, int $depotId, int $typeCarburantId, int $userId): void
{
    $stmt = $pdo->prepare(
        'SELECT quantite_disponible, seuil_alerte
         FROM stocks_depots
         WHERE depot_id = :depot_id AND type_carburant_id = :type_carburant_id
         LIMIT 1'
    );
    $stmt->execute([
        'depot_id' => $depotId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $stock = $stmt->fetch();
    if (!$stock) return;

    mettreAJourAlerteStock(
        $pdo,
        'depot',
        $depotId,
        $typeCarburantId,
        (float) $stock['quantite_disponible'],
        (float) ($stock['seuil_alerte'] ?? 0),
        $userId
    );
}

function synchroniserAlertesStockStation(PDO $pdo, int $stationId, int $typeCarburantId, int $userId): void
{
    $stmt = $pdo->prepare(
        'SELECT quantite_disponible, seuil_alerte
         FROM stocks_stations
         WHERE station_id = :station_id AND type_carburant_id = :type_carburant_id
         LIMIT 1'
    );
    $stmt->execute([
        'station_id' => $stationId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $stock = $stmt->fetch();
    if (!$stock) return;

    mettreAJourAlerteStock(
        $pdo,
        'station',
        $stationId,
        $typeCarburantId,
        (float) $stock['quantite_disponible'],
        (float) ($stock['seuil_alerte'] ?? 0),
        $userId
    );
}

function synchroniserImpactApprovisionnement(PDO $pdo, ?array $ancien, array $nouveau, int $userId): void
{
    $ancienStatutRecu = $ancien && ($ancien['statut'] ?? '') === 'recu';
    $nouveauStatutRecu = ($nouveau['statut'] ?? '') === 'recu';

    if ($ancienStatutRecu) {
        ajusterStockDepot(
            $pdo,
            (int) $ancien['depot_id'],
            (int) $ancien['type_carburant_id'],
            - ((float) $ancien['quantite'])
        );
        synchroniserAlertesStockDepot($pdo, (int) $ancien['depot_id'], (int) $ancien['type_carburant_id'], $userId);

        $stmtDelete = $pdo->prepare('DELETE FROM mouvements_stock WHERE approvisionnement_id = :approvisionnement_id');
        $stmtDelete->execute(['approvisionnement_id' => (int) $ancien['id']]);
    }

    if ($nouveauStatutRecu) {
        ajusterStockDepot(
            $pdo,
            (int) $nouveau['depot_id'],
            (int) $nouveau['type_carburant_id'],
            (float) $nouveau['quantite']
        );
        synchroniserAlertesStockDepot($pdo, (int) $nouveau['depot_id'], (int) $nouveau['type_carburant_id'], $userId);

        $stmtInsert = $pdo->prepare(
            'INSERT INTO mouvements_stock (
                reference_mouvement, type_mouvement, type_carburant_id, depot_id,
                approvisionnement_id, quantite, date_mouvement, cree_par, commentaire
             ) VALUES (
                :reference_mouvement, :type_mouvement, :type_carburant_id, :depot_id,
                :approvisionnement_id, :quantite, :date_mouvement, :cree_par, :commentaire
             )'
        );
        $stmtInsert->execute([
            'reference_mouvement' => genererReference('MVT'),
            'type_mouvement' => 'entree_depot',
            'type_carburant_id' => (int) $nouveau['type_carburant_id'],
            'depot_id' => (int) $nouveau['depot_id'],
            'approvisionnement_id' => (int) $nouveau['id'],
            'quantite' => (float) $nouveau['quantite'],
            'date_mouvement' => (string) $nouveau['date_approvisionnement'],
            'cree_par' => ((int) ($nouveau['cree_par'] ?? 0) ?: ($userId > 0 ? $userId : null)),
            'commentaire' => sprintf('Reception approvisionnement %s', (string) $nouveau['reference_approvisionnement']),
        ]);
    }
}

function synchroniserImpactLivraison(PDO $pdo, ?array $ancien, array $nouveau, int $userId): void
{
    $ancienStatutLivre = $ancien && ($ancien['statut'] ?? '') === 'livree';
    $nouveauStatutLivre = ($nouveau['statut'] ?? '') === 'livree';

    if ($ancienStatutLivre) {
        ajusterStockDepot(
            $pdo,
            (int) $ancien['depot_id'],
            (int) $ancien['type_carburant_id'],
            (float) $ancien['quantite']
        );

        ajusterStockStation(
            $pdo,
            (int) $ancien['station_id'],
            (int) $ancien['type_carburant_id'],
            - ((float) $ancien['quantite'])
        );
        synchroniserAlertesStockDepot($pdo, (int) $ancien['depot_id'], (int) $ancien['type_carburant_id'], $userId);
        synchroniserAlertesStockStation($pdo, (int) $ancien['station_id'], (int) $ancien['type_carburant_id'], $userId);

        $stmtDelete = $pdo->prepare('DELETE FROM mouvements_stock WHERE livraison_id = :livraison_id');
        $stmtDelete->execute(['livraison_id' => (int) $ancien['id']]);
    }

    if ($nouveauStatutLivre) {
        ajusterStockDepot(
            $pdo,
            (int) $nouveau['depot_id'],
            (int) $nouveau['type_carburant_id'],
            - ((float) $nouveau['quantite'])
        );

        ajusterStockStation(
            $pdo,
            (int) $nouveau['station_id'],
            (int) $nouveau['type_carburant_id'],
            (float) $nouveau['quantite']
        );
        synchroniserAlertesStockDepot($pdo, (int) $nouveau['depot_id'], (int) $nouveau['type_carburant_id'], $userId);
        synchroniserAlertesStockStation($pdo, (int) $nouveau['station_id'], (int) $nouveau['type_carburant_id'], $userId);

        $stmtSortie = $pdo->prepare(
            'INSERT INTO mouvements_stock (
                reference_mouvement, type_mouvement, type_carburant_id, depot_id,
                livraison_id, quantite, date_mouvement, cree_par, commentaire
             ) VALUES (
                :reference_mouvement, :type_mouvement, :type_carburant_id, :depot_id,
                :livraison_id, :quantite, :date_mouvement, :cree_par, :commentaire
             )'
        );
        $stmtSortie->execute([
            'reference_mouvement' => genererReference('MVT'),
            'type_mouvement' => 'sortie_depot',
            'type_carburant_id' => (int) $nouveau['type_carburant_id'],
            'depot_id' => (int) $nouveau['depot_id'],
            'livraison_id' => (int) $nouveau['id'],
            'quantite' => (float) $nouveau['quantite'],
            'date_mouvement' => (string) ($nouveau['date_arrivee'] ?: $nouveau['date_depart']),
            'cree_par' => $userId > 0 ? $userId : ((int) ($nouveau['cree_par'] ?? 0) ?: null),
            'commentaire' => sprintf('Sortie depot pour livraison %s', (string) $nouveau['reference_livraison']),
        ]);

        $stmtEntree = $pdo->prepare(
            'INSERT INTO mouvements_stock (
                reference_mouvement, type_mouvement, type_carburant_id, station_id,
                livraison_id, quantite, date_mouvement, cree_par, commentaire
             ) VALUES (
                :reference_mouvement, :type_mouvement, :type_carburant_id, :station_id,
                :livraison_id, :quantite, :date_mouvement, :cree_par, :commentaire
             )'
        );
        $stmtEntree->execute([
            'reference_mouvement' => genererReference('MVT'),
            'type_mouvement' => 'entree_station',
            'type_carburant_id' => (int) $nouveau['type_carburant_id'],
            'station_id' => (int) $nouveau['station_id'],
            'livraison_id' => (int) $nouveau['id'],
            'quantite' => (float) $nouveau['quantite'],
            'date_mouvement' => (string) ($nouveau['date_arrivee'] ?: $nouveau['date_depart']),
            'cree_par' => $userId > 0 ? $userId : ((int) ($nouveau['cree_par'] ?? 0) ?: null),
            'commentaire' => sprintf('Entree station pour livraison %s', (string) $nouveau['reference_livraison']),
        ]);
    }
}

function verifierObligatoires(array $donnees, array $obligatoires): void
{
    $manquants = [];
    foreach ($obligatoires as $champ) {
        if (!array_key_exists($champ, $donnees) || $donnees[$champ] === '' || $donnees[$champ] === null) {
            $manquants[] = $champ;
        }
    }

    if ($manquants !== []) {
        reponseErreur('Champs obligatoires manquants.', 422, ['champs' => $manquants]);
    }
}

function executerDashboard(PDO $pdo): void
{
    $compteurs = [
        'utilisateurs' => (int) $pdo->query('SELECT COUNT(*) FROM utilisateurs')->fetchColumn(),
        'fournisseurs' => (int) $pdo->query('SELECT COUNT(*) FROM fournisseurs')->fetchColumn(),
        'depots' => (int) $pdo->query('SELECT COUNT(*) FROM depots')->fetchColumn(),
        'stations' => (int) $pdo->query('SELECT COUNT(*) FROM stations')->fetchColumn(),
        'vehicules' => (int) $pdo->query('SELECT COUNT(*) FROM vehicules')->fetchColumn(),
        'approvisionnements' => (int) $pdo->query('SELECT COUNT(*) FROM approvisionnements')->fetchColumn(),
        'livraisons' => (int) $pdo->query('SELECT COUNT(*) FROM livraisons')->fetchColumn(),
        'alertes_ouvertes' => (int) $pdo->query("SELECT COUNT(*) FROM alertes WHERE statut = 'nouvelle'")->fetchColumn(),
    ];

    $stocksDepots = $pdo->query(
        'SELECT d.nom_depot, tc.nom_carburant, sd.quantite_disponible, sd.seuil_alerte
         FROM stocks_depots sd
         INNER JOIN depots d ON d.id = sd.depot_id
         INNER JOIN types_carburant tc ON tc.id = sd.type_carburant_id
         ORDER BY sd.quantite_disponible ASC
         LIMIT 10'
    )->fetchAll();

    $livraisonsRecentes = $pdo->query(
        'SELECT l.reference_livraison, l.statut, l.quantite, l.date_depart,
                d.nom_depot, s.nom_station
         FROM livraisons l
         INNER JOIN depots d ON d.id = l.depot_id
         INNER JOIN stations s ON s.id = l.station_id
         ORDER BY l.date_depart DESC
         LIMIT 10'
    )->fetchAll();

    reponseSucces([
        'compteurs' => $compteurs,
        'stocks_depots' => $stocksDepots,
        'livraisons_recentes' => $livraisonsRecentes,
    ]);
}

function executerRapports(PDO $pdo): void
{
    $approParCarburant = $pdo->query(
        'SELECT tc.nom_carburant, SUM(a.quantite) AS volume_total, SUM(a.cout_total) AS montant_total
         FROM approvisionnements a
         INNER JOIN types_carburant tc ON tc.id = a.type_carburant_id
         GROUP BY tc.nom_carburant
         ORDER BY volume_total DESC'
    )->fetchAll();

    $livraisonsParStatut = $pdo->query(
        'SELECT statut, COUNT(*) AS total, SUM(quantite) AS volume
         FROM livraisons
         GROUP BY statut
         ORDER BY total DESC'
    )->fetchAll();

    $alertesParNiveau = $pdo->query(
        'SELECT niveau, COUNT(*) AS total
         FROM alertes
         GROUP BY niveau
         ORDER BY total DESC'
    )->fetchAll();

    reponseSucces([
        'approvisionnements_par_carburant' => $approParCarburant,
        'livraisons_par_statut' => $livraisonsParStatut,
        'alertes_par_niveau' => $alertesParNiveau,
    ]);
}

function executerAuth(PDO $pdo): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        reponseErreur('Méthode non autorisée pour auth.', 405);
    }

    $entree = lireCorpsJson();
    $email = $entree['email'] ?? null;
    $motDePasse = $entree['mot_de_passe'] ?? null;

    if (!$email || !$motDePasse) {
        reponseErreur('Email et mot de passe requis.', 422);
    }

    $stmt = $pdo->prepare(
        'SELECT u.id, u.nom, u.prenom, u.email, u.mot_de_passe, u.role_id, u.statut, r.nom_role
         FROM utilisateurs u
         INNER JOIN roles r ON r.id = u.role_id
         WHERE u.email = :email
         LIMIT 1'
    );
    $stmt->execute(['email' => $email]);
    $utilisateur = $stmt->fetch();

    if (!$utilisateur) {
        reponseErreur('Identifiants invalides.', 401);
    }

    $hash = (string) ($utilisateur['mot_de_passe'] ?? '');
    $motDePasseValide = password_verify((string) $motDePasse, $hash) || $motDePasse === $hash;

    if (!$motDePasseValide) {
        reponseErreur('Identifiants invalides.', 401);
    }

    unset($utilisateur['mot_de_passe']);
    reponseSucces($utilisateur, 'Connexion réussie.');
}

function executerParametres(PDO $pdo): void
{
    $userId = (int) ($_SERVER['HTTP_X_USER_ID'] ?? 0);
    if ($userId <= 0) {
        reponseErreur('Utilisateur non identifie.', 401);
    }

    $methode = $_SERVER['REQUEST_METHOD'];

    if ($methode === 'GET') {
        $stmt = $pdo->prepare(
            'SELECT u.id, u.nom, u.prenom, u.email, u.telephone, u.role_id, u.statut, r.nom_role
             FROM utilisateurs u
             INNER JOIN roles r ON r.id = u.role_id
             WHERE u.id = :id
             LIMIT 1'
        );
        $stmt->execute(['id' => $userId]);
        $utilisateur = $stmt->fetch();

        if (!$utilisateur) {
            reponseErreur('Profil utilisateur introuvable.', 404);
        }

        reponseSucces($utilisateur);
    }

    if ($methode === 'PUT' || $methode === 'PATCH') {
        $entree = lireCorpsJson();
        $maj = [];
        $params = ['id' => $userId];

        $champs = ['nom', 'prenom', 'email', 'telephone'];
        foreach ($champs as $champ) {
            if (array_key_exists($champ, $entree)) {
                $maj[] = "{$champ} = :{$champ}";
                $params[$champ] = $entree[$champ];
            }
        }

        if (!empty($entree['mot_de_passe_nouveau'])) {
            $stmt = $pdo->prepare('SELECT mot_de_passe FROM utilisateurs WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => $userId]);
            $row = $stmt->fetch();

            if (!$row) {
                reponseErreur('Profil utilisateur introuvable.', 404);
            }

            $motPasseActuel = (string) ($entree['mot_de_passe_actuel'] ?? '');
            if ($motPasseActuel === '') {
                reponseErreur('Mot de passe actuel requis.', 422);
            }

            $hash = (string) $row['mot_de_passe'];
            $ok = password_verify($motPasseActuel, $hash) || $motPasseActuel === $hash;
            if (!$ok) {
                reponseErreur('Mot de passe actuel incorrect.', 422);
            }

            $maj[] = 'mot_de_passe = :mot_de_passe';
            $params['mot_de_passe'] = password_hash((string) $entree['mot_de_passe_nouveau'], PASSWORD_BCRYPT);
        }

        if ($maj === []) {
            reponseErreur('Aucune modification detectee.', 422);
        }

        $sql = 'UPDATE utilisateurs SET ' . implode(', ', $maj) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $stmt = $pdo->prepare(
            'SELECT u.id, u.nom, u.prenom, u.email, u.telephone, u.role_id, u.statut, r.nom_role
             FROM utilisateurs u
             INNER JOIN roles r ON r.id = u.role_id
             WHERE u.id = :id
             LIMIT 1'
        );
        $stmt->execute(['id' => $userId]);
        $utilisateur = $stmt->fetch();

        reponseSucces($utilisateur, 'Parametres mis a jour.');
    }

    reponseErreur('Methode non autorisee pour parametres.', 405);
}

function executerVentesStation(PDO $pdo): void
{
    $methode = $_SERVER['REQUEST_METHOD'];
    $roleId = (int) ($_SERVER['HTTP_X_ROLE_ID'] ?? 0);
    $userId = (int) ($_SERVER['HTTP_X_USER_ID'] ?? 0);
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($methode === 'GET') {
        $params = [];
        $clauses = [];

        if ($roleId === 4 && $userId > 0) {
            $station = obtenirStationResponsable($pdo, $userId);
            if ($station) {
                $clauses[] = 'v.station_id = :station_role';
                $params['station_role'] = (int) $station['id'];
            }
        }

        if (!empty($_GET['station_id'])) {
            $clauses[] = 'v.station_id = :station_id';
            $params['station_id'] = (int) $_GET['station_id'];
        }

        if (!empty($_GET['type_carburant_id'])) {
            $clauses[] = 'v.type_carburant_id = :type_carburant_id';
            $params['type_carburant_id'] = (int) $_GET['type_carburant_id'];
        }

        if (!empty($_GET['telephone_client'])) {
            $clauses[] = 'c.telephone = :telephone_client';
            $params['telephone_client'] = normaliserTelephone((string) $_GET['telephone_client']);
        }

        $sql = 'SELECT v.*, c.nom_client, c.telephone AS telephone_client, c.email AS email_client,
                       s.nom_station, tc.nom_carburant,
                       u.nom AS nom_createur, u.prenom AS prenom_createur
                FROM ventes_station v
                INNER JOIN clients c ON c.id = v.client_id
                INNER JOIN stations s ON s.id = v.station_id
                INNER JOIN types_carburant tc ON tc.id = v.type_carburant_id
                LEFT JOIN utilisateurs u ON u.id = v.cree_par';

        if ($clauses !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $clauses);
        }

        $sql .= ' ORDER BY v.date_vente DESC, v.id DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $row['montant_restant'] = max(0.00, (float) $row['montant_net'] - (float) $row['montant_paye']);
        }
        unset($row);
        reponseSucces($rows);
    }

    if ($methode === 'PUT' || $methode === 'PATCH') {
        if ($id <= 0) {
            reponseErreur('Parametre id requis pour la mise a jour.', 400);
        }

        $stmtExisting = $pdo->prepare('SELECT * FROM ventes_station WHERE id = :id LIMIT 1');
        $stmtExisting->execute(['id' => $id]);
        $vente = $stmtExisting->fetch();
        if (!$vente) {
            reponseErreur('Enregistrement introuvable.', 404);
        }

        $entree = lireCorpsJson();
        $paiement = isset($entree['paiement']) ? (float) $entree['paiement'] : null;
        $montantPaye = isset($entree['montant_paye']) ? (float) $entree['montant_paye'] : null;
        $commentaire = array_key_exists('commentaire', $entree)
            ? trim((string) $entree['commentaire'])
            : $vente['commentaire'];

        if ($paiement === null && $montantPaye === null && $commentaire === $vente['commentaire']) {
            reponseErreur('Aucune donnée à mettre a jour.', 422);
        }

        $nouveauMontantPaye = (float) $vente['montant_paye'];
        if ($paiement !== null) {
            if ($paiement <= 0) {
                reponseErreur('Montant de paiement invalide.', 422);
            }
            $nouveauMontantPaye += $paiement;
        }
        if ($montantPaye !== null) {
            if ($montantPaye < 0) {
                reponseErreur('Montant payé invalide.', 422);
            }
            $nouveauMontantPaye = $montantPaye;
        }

        $nouveauMontantPaye = min($nouveauMontantPaye, (float) $vente['montant_net']);

        $stmtUpdate = $pdo->prepare(
            'UPDATE ventes_station
             SET montant_paye = :montant_paye,
                 commentaire = :commentaire
             WHERE id = :id'
        );
        $stmtUpdate->execute([
            'id' => $id,
            'montant_paye' => $nouveauMontantPaye,
            'commentaire' => $commentaire,
        ]);

        $vente['montant_paye'] = $nouveauMontantPaye;
        $vente['montant_restant'] = max(0.00, (float) $vente['montant_net'] - $nouveauMontantPaye);
        reponseSucces($vente, 'Paiement enregistre.');
    }

    if ($methode !== 'POST') {
        reponseErreur('Methode non autorisee pour ventes_station.', 405);
    }

    $entree = lireCorpsJson();

    $stationId = (int) ($entree['station_id'] ?? 0);
    if ($roleId === 4 && $userId > 0) {
        $station = obtenirStationResponsable($pdo, $userId);
        if (!$station) {
            reponseErreur('Aucune station rattachee a ce responsable.', 422);
        }
        $stationId = (int) $station['id'];
    }

    $typeCarburantId = (int) ($entree['type_carburant_id'] ?? 0);
    $quantite = (float) ($entree['quantite'] ?? 0);
    $devisePaiement = strtoupper((string) ($entree['devise_paiement'] ?? 'USD'));
    $reduction = (float) ($entree['reduction'] ?? 0);
    $montantPayeSaisi = isset($entree['montant_paye']) ? (float) $entree['montant_paye'] : null;
    $telephone = normaliserTelephone((string) ($entree['telephone_client'] ?? ''));
    $nomClient = trim((string) ($entree['nom_client'] ?? ''));
    $dateVente = (string) ($entree['date_vente'] ?? date('Y-m-d H:i:s'));

    if ($stationId <= 0 || $typeCarburantId <= 0 || $quantite <= 0 || $telephone === '' || $nomClient === '') {
        reponseErreur('Station, client, carburant et quantite sont requis.', 422);
    }

    if (!in_array($devisePaiement, ['USD', 'CDF'], true)) {
        reponseErreur('Devise de paiement invalide.', 422);
    }

    $stmtPrix = $pdo->prepare(
        "SELECT id, prix_unitaire_usd
         FROM prix_carburants
         WHERE station_id = :station_id
           AND type_carburant_id = :type_carburant_id
           AND statut = 'actif'
         LIMIT 1"
    );
    $stmtPrix->execute([
        'station_id' => $stationId,
        'type_carburant_id' => $typeCarburantId,
    ]);
    $prix = $stmtPrix->fetch();

    if (!$prix) {
        reponseErreur('Aucun prix unitaire actif configure pour cette station et ce carburant.', 422);
    }

    $stmtTaux = $pdo->prepare(
        "SELECT taux_usd_cdf
         FROM taux_change_stations
         WHERE station_id = :station_id
           AND statut = 'actif'
         ORDER BY date_application DESC, id DESC
         LIMIT 1"
    );
    $stmtTaux->execute(['station_id' => $stationId]);
    $taux = $stmtTaux->fetch();

    if (!$taux) {
        reponseErreur('Aucun taux de change actif configure pour cette station.', 422);
    }

    $stock = obtenirOuInitialiserStockStation($pdo, $stationId, $typeCarburantId);

    $stockDisponible = (float) $stock['quantite_disponible'];
    if ($stockDisponible < $quantite) {
        reponseErreur('Stock insuffisant pour enregistrer cette vente.', 422);
    }

    $prixUnitaireUsd = (float) $prix['prix_unitaire_usd'];
    $tauxUsdCdf = (float) $taux['taux_usd_cdf'];
    $prixUnitaireCdf = $prixUnitaireUsd * $tauxUsdCdf;
    $montantBrut = $quantite * ($devisePaiement === 'CDF' ? $prixUnitaireCdf : $prixUnitaireUsd);
    $montantNet = max($montantBrut - $reduction, 0);
    $montantPaye = $montantPayeSaisi === null || $montantPayeSaisi <= 0 ? $montantNet : $montantPayeSaisi;

    try {
        $pdo->beginTransaction();

        $stmtClient = $pdo->prepare('SELECT id FROM clients WHERE telephone = :telephone LIMIT 1');
        $stmtClient->execute(['telephone' => $telephone]);
        $client = $stmtClient->fetch();

        if ($client) {
            $clientId = (int) $client['id'];
            $stmtUpdateClient = $pdo->prepare(
                'UPDATE clients
                 SET nom_client = :nom_client,
                     email = :email,
                     adresse = :adresse,
                     statut = :statut
                 WHERE id = :id'
            );
            $stmtUpdateClient->execute([
                'id' => $clientId,
                'nom_client' => $nomClient,
                'email' => trim((string) ($entree['email_client'] ?? '')) ?: null,
                'adresse' => trim((string) ($entree['adresse_client'] ?? '')) ?: null,
                'statut' => 'actif',
            ]);
        } else {
            $stmtInsertClient = $pdo->prepare(
                'INSERT INTO clients (nom_client, telephone, email, adresse, statut)
                 VALUES (:nom_client, :telephone, :email, :adresse, :statut)'
            );
            $stmtInsertClient->execute([
                'nom_client' => $nomClient,
                'telephone' => $telephone,
                'email' => trim((string) ($entree['email_client'] ?? '')) ?: null,
                'adresse' => trim((string) ($entree['adresse_client'] ?? '')) ?: null,
                'statut' => 'actif',
            ]);
            $clientId = (int) $pdo->lastInsertId();
        }

        $referenceVente = genererReference('VTE');
        $stmtVente = $pdo->prepare(
            'INSERT INTO ventes_station (
                reference_vente, station_id, client_id, type_carburant_id, quantite,
                devise_paiement, taux_change_applique, prix_unitaire_usd, prix_unitaire_cdf,
                reduction, montant_brut, montant_net, montant_paye, cree_par, date_vente, commentaire
             ) VALUES (
                :reference_vente, :station_id, :client_id, :type_carburant_id, :quantite,
                :devise_paiement, :taux_change_applique, :prix_unitaire_usd, :prix_unitaire_cdf,
                :reduction, :montant_brut, :montant_net, :montant_paye, :cree_par, :date_vente, :commentaire
             )'
        );
        $stmtVente->execute([
            'reference_vente' => $referenceVente,
            'station_id' => $stationId,
            'client_id' => $clientId,
            'type_carburant_id' => $typeCarburantId,
            'quantite' => $quantite,
            'devise_paiement' => $devisePaiement,
            'taux_change_applique' => $tauxUsdCdf,
            'prix_unitaire_usd' => $prixUnitaireUsd,
            'prix_unitaire_cdf' => $prixUnitaireCdf,
            'reduction' => $reduction,
            'montant_brut' => $montantBrut,
            'montant_net' => $montantNet,
            'montant_paye' => $montantPaye,
            'cree_par' => $userId > 0 ? $userId : null,
            'date_vente' => $dateVente,
            'commentaire' => trim((string) ($entree['commentaire'] ?? '')) ?: null,
        ]);
        $venteId = (int) $pdo->lastInsertId();

        $stmtUpdateStock = $pdo->prepare(
            'UPDATE stocks_stations
             SET quantite_disponible = quantite_disponible - :quantite
             WHERE id = :id'
        );
        $stmtUpdateStock->execute([
            'id' => (int) $stock['id'],
            'quantite' => $quantite,
        ]);

        $stmtMouvement = $pdo->prepare(
            'INSERT INTO mouvements_stock (
                reference_mouvement, type_mouvement, type_carburant_id, station_id,
                quantite, date_mouvement, cree_par, commentaire
             ) VALUES (
                :reference_mouvement, :type_mouvement, :type_carburant_id, :station_id,
                :quantite, :date_mouvement, :cree_par, :commentaire
             )'
        );
        $stmtMouvement->execute([
            'reference_mouvement' => genererReference('MVT'),
            'type_mouvement' => 'sortie_station',
            'type_carburant_id' => $typeCarburantId,
            'station_id' => $stationId,
            'quantite' => $quantite,
            'date_mouvement' => $dateVente,
            'cree_par' => $userId > 0 ? $userId : null,
            'commentaire' => sprintf('Vente station %s - client %s', $referenceVente, $telephone),
        ]);

        $pdo->commit();

        reponseSucces([
            'id' => $venteId,
            'reference_vente' => $referenceVente,
            'client_id' => $clientId,
            'montant_brut' => $montantBrut,
            'montant_net' => $montantNet,
            'montant_paye' => $montantPaye,
            'montant_restant' => max(0.00, $montantNet - $montantPaye),
            'prix_unitaire_usd' => $prixUnitaireUsd,
            'prix_unitaire_cdf' => $prixUnitaireCdf,
            'taux_change_applique' => $tauxUsdCdf,
        ], 'Vente station enregistree.', 201);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function executerApprovisionnements(PDO $pdo): void
{
    $methode = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $userId = (int) ($_SERVER['HTTP_X_USER_ID'] ?? 0);

    if ($methode === 'GET') {
        if ($id > 0) {
            $stmt = $pdo->prepare('SELECT * FROM approvisionnements WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            if (!$row) {
                reponseErreur('Enregistrement introuvable.', 404);
            }
            reponseSucces($row);
        }

        $stmt = $pdo->query('SELECT * FROM approvisionnements ORDER BY id DESC');
        reponseSucces($stmt->fetchAll());
    }

    if ($methode === 'POST') {
        $entree = filtrerDonnees(lireCorpsJson(), $GLOBALS['definitions']['approvisionnements']['champs']);
        verifierObligatoires($entree, $GLOBALS['definitions']['approvisionnements']['obligatoires']);
        $entree['date_approvisionnement'] = normaliserDateHeure((string) ($entree['date_approvisionnement'] ?? ''), 'date_approvisionnement');

        $entree['statut'] = $entree['statut'] ?? 'en_attente';
        $coutUnitaire = (float) ($entree['cout_unitaire'] ?? 0);
        $quantite = (float) ($entree['quantite'] ?? 0);
        $coutTotal = $coutUnitaire * $quantite;
        $creePar = determinerCreePar($pdo, $userId, $entree['cree_par'] ?? null);

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare(
                'INSERT INTO approvisionnements (
                    reference_approvisionnement, fournisseur_id, type_carburant_id, depot_id,
                    quantite, cout_unitaire, date_approvisionnement, statut, cree_par, commentaire
                 ) VALUES (
                    :reference_approvisionnement, :fournisseur_id, :type_carburant_id, :depot_id,
                    :quantite, :cout_unitaire, :date_approvisionnement, :statut, :cree_par, :commentaire
                 )'
            );
            $stmt->execute([
                'reference_approvisionnement' => $entree['reference_approvisionnement'],
                'fournisseur_id' => (int) $entree['fournisseur_id'],
                'type_carburant_id' => (int) $entree['type_carburant_id'],
                'depot_id' => (int) $entree['depot_id'],
                'quantite' => $quantite,
                'cout_unitaire' => $coutUnitaire,
                'date_approvisionnement' => $entree['date_approvisionnement'],
                'statut' => $entree['statut'],
                'cree_par' => $creePar,
                'commentaire' => $entree['commentaire'] ?? null,
            ]);

            $newId = (int) $pdo->lastInsertId();
            $nouveau = [
                'id' => $newId,
                ...$entree,
                'quantite' => $quantite,
                'cout_unitaire' => $coutUnitaire,
                'cout_total' => $coutTotal,
                'cree_par' => $creePar,
            ];
            synchroniserImpactApprovisionnement($pdo, null, $nouveau, $userId);

            $pdo->commit();
            reponseSucces(['id' => $newId], 'Creation reussie.', 201);
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    if ($methode === 'PUT' || $methode === 'PATCH') {
        if ($id <= 0) {
            reponseErreur('Parametre id requis pour la mise a jour.', 400);
        }

        $stmtExisting = $pdo->prepare('SELECT * FROM approvisionnements WHERE id = :id LIMIT 1');
        $stmtExisting->execute(['id' => $id]);
        $ancien = $stmtExisting->fetch();
        if (!$ancien) {
            reponseErreur('Enregistrement introuvable.', 404);
        }

        $entree = filtrerDonnees(lireCorpsJson(), $GLOBALS['definitions']['approvisionnements']['champs']);
        if ($entree === []) {
            reponseErreur('Aucune donnee a mettre a jour.', 422);
        }

        $nouveau = array_merge($ancien, $entree);
        $nouveau['date_approvisionnement'] = normaliserDateHeure((string) ($nouveau['date_approvisionnement'] ?? ''), 'date_approvisionnement');
        $nouveau['quantite'] = (float) ($nouveau['quantite'] ?? 0);
        $nouveau['cout_unitaire'] = (float) ($nouveau['cout_unitaire'] ?? 0);
        $nouveau['cout_total'] = $nouveau['quantite'] * $nouveau['cout_unitaire'];
        $nouveau['cree_par'] = determinerCreePar($pdo, $userId, $nouveau['cree_par'] ?? null);
        $nouveau['id'] = $id;

        try {
            $pdo->beginTransaction();

            synchroniserImpactApprovisionnement($pdo, $ancien, [
                ...$ancien,
                'statut' => 'annule',
            ], $userId);

            $stmtUpdate = $pdo->prepare(
                'UPDATE approvisionnements
                 SET reference_approvisionnement = :reference_approvisionnement,
                     fournisseur_id = :fournisseur_id,
                     type_carburant_id = :type_carburant_id,
                     depot_id = :depot_id,
                     quantite = :quantite,
                     cout_unitaire = :cout_unitaire,
                     date_approvisionnement = :date_approvisionnement,
                     statut = :statut,
                     cree_par = :cree_par,
                     commentaire = :commentaire
                 WHERE id = :id'
            );
            $stmtUpdate->execute([
                'id' => $id,
                'reference_approvisionnement' => $nouveau['reference_approvisionnement'],
                'fournisseur_id' => (int) $nouveau['fournisseur_id'],
                'type_carburant_id' => (int) $nouveau['type_carburant_id'],
                'depot_id' => (int) $nouveau['depot_id'],
                'quantite' => $nouveau['quantite'],
                'cout_unitaire' => $nouveau['cout_unitaire'],
                'date_approvisionnement' => $nouveau['date_approvisionnement'],
                'statut' => $nouveau['statut'],
                'cree_par' => isset($nouveau['cree_par']) ? (int) $nouveau['cree_par'] : null,
                'commentaire' => $nouveau['commentaire'] ?? null,
            ]);

            synchroniserImpactApprovisionnement($pdo, null, $nouveau, $userId);

            $pdo->commit();
            reponseSucces(['id' => $id], 'Mise a jour reussie.');
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    if ($methode === 'DELETE') {
        if ($id <= 0) {
            reponseErreur('Parametre id requis pour la suppression.', 400);
        }

        $stmtExisting = $pdo->prepare('SELECT * FROM approvisionnements WHERE id = :id LIMIT 1');
        $stmtExisting->execute(['id' => $id]);
        $ancien = $stmtExisting->fetch();
        if (!$ancien) {
            reponseErreur('Enregistrement introuvable.', 404);
        }

        try {
            $pdo->beginTransaction();

            if (($ancien['statut'] ?? '') === 'recu') {
                synchroniserImpactApprovisionnement($pdo, $ancien, [
                    ...$ancien,
                    'statut' => 'annule',
                ], $userId);
            }

            $stmtDelete = $pdo->prepare('DELETE FROM approvisionnements WHERE id = :id');
            $stmtDelete->execute(['id' => $id]);

            $pdo->commit();
            reponseSucces(['id' => $id], 'Suppression reussie.');
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    reponseErreur('Methode non autorisee pour approvisionnements.', 405);
}

function executerLivraisons(PDO $pdo): void
{
    $methode = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $userId = (int) ($_SERVER['HTTP_X_USER_ID'] ?? 0);

    if ($methode === 'GET') {
        if ($id > 0) {
            $stmt = $pdo->prepare('SELECT * FROM livraisons WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            if (!$row) {
                reponseErreur('Enregistrement introuvable.', 404);
            }
            reponseSucces($row);
        }

        $stmt = $pdo->query('SELECT * FROM livraisons ORDER BY id DESC');
        reponseSucces($stmt->fetchAll());
    }

    if ($methode === 'POST') {
        $entree = filtrerDonnees(lireCorpsJson(), $GLOBALS['definitions']['livraisons']['champs']);
        verifierObligatoires($entree, $GLOBALS['definitions']['livraisons']['obligatoires']);
        $entree['statut'] = $entree['statut'] ?? 'preparee';

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare(
                'INSERT INTO livraisons (
                    reference_livraison, depot_id, station_id, type_carburant_id, vehicule_id,
                    quantite, date_depart, date_arrivee, statut, cree_par, commentaire
                 ) VALUES (
                    :reference_livraison, :depot_id, :station_id, :type_carburant_id, :vehicule_id,
                    :quantite, :date_depart, :date_arrivee, :statut, :cree_par, :commentaire
                 )'
            );
            $stmt->execute([
                'reference_livraison' => $entree['reference_livraison'],
                'depot_id' => (int) $entree['depot_id'],
                'station_id' => (int) $entree['station_id'],
                'type_carburant_id' => (int) $entree['type_carburant_id'],
                'vehicule_id' => ($entree['vehicule_id'] ?? '') !== '' ? (int) $entree['vehicule_id'] : null,
                'quantite' => (float) $entree['quantite'],
                'date_depart' => $entree['date_depart'],
                'date_arrivee' => $entree['date_arrivee'] ?? null,
                'statut' => $entree['statut'],
                'cree_par' => isset($entree['cree_par']) ? (int) $entree['cree_par'] : ($userId > 0 ? $userId : null),
                'commentaire' => $entree['commentaire'] ?? null,
            ]);

            $newId = (int) $pdo->lastInsertId();
            $nouveau = [
                'id' => $newId,
                ...$entree,
                'quantite' => (float) $entree['quantite'],
            ];
            synchroniserImpactLivraison($pdo, null, $nouveau, $userId);

            $pdo->commit();
            reponseSucces(['id' => $newId], 'Creation reussie.', 201);
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    if ($methode === 'PUT' || $methode === 'PATCH') {
        if ($id <= 0) {
            reponseErreur('Parametre id requis pour la mise a jour.', 400);
        }

        $stmtExisting = $pdo->prepare('SELECT * FROM livraisons WHERE id = :id LIMIT 1');
        $stmtExisting->execute(['id' => $id]);
        $ancien = $stmtExisting->fetch();
        if (!$ancien) {
            reponseErreur('Enregistrement introuvable.', 404);
        }

        $entree = filtrerDonnees(lireCorpsJson(), $GLOBALS['definitions']['livraisons']['champs']);
        if ($entree === []) {
            reponseErreur('Aucune donnee a mettre a jour.', 422);
        }

        $nouveau = array_merge($ancien, $entree);
        $nouveau['id'] = $id;
        $nouveau['quantite'] = (float) ($nouveau['quantite'] ?? 0);

        try {
            $pdo->beginTransaction();

            synchroniserImpactLivraison($pdo, $ancien, [
                ...$ancien,
                'statut' => 'annulee',
            ], $userId);

            $stmtUpdate = $pdo->prepare(
                'UPDATE livraisons
                 SET reference_livraison = :reference_livraison,
                     depot_id = :depot_id,
                     station_id = :station_id,
                     type_carburant_id = :type_carburant_id,
                     vehicule_id = :vehicule_id,
                     quantite = :quantite,
                     date_depart = :date_depart,
                     date_arrivee = :date_arrivee,
                     statut = :statut,
                     cree_par = :cree_par,
                     commentaire = :commentaire
                 WHERE id = :id'
            );
            $stmtUpdate->execute([
                'id' => $id,
                'reference_livraison' => $nouveau['reference_livraison'],
                'depot_id' => (int) $nouveau['depot_id'],
                'station_id' => (int) $nouveau['station_id'],
                'type_carburant_id' => (int) $nouveau['type_carburant_id'],
                'vehicule_id' => ($nouveau['vehicule_id'] ?? '') !== '' ? (int) $nouveau['vehicule_id'] : null,
                'quantite' => $nouveau['quantite'],
                'date_depart' => $nouveau['date_depart'],
                'date_arrivee' => $nouveau['date_arrivee'] ?? null,
                'statut' => $nouveau['statut'],
                'cree_par' => isset($nouveau['cree_par']) ? (int) $nouveau['cree_par'] : null,
                'commentaire' => $nouveau['commentaire'] ?? null,
            ]);

            synchroniserImpactLivraison($pdo, null, $nouveau, $userId);

            $pdo->commit();
            reponseSucces(['id' => $id], 'Mise a jour reussie.');
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    if ($methode === 'DELETE') {
        if ($id <= 0) {
            reponseErreur('Parametre id requis pour la suppression.', 400);
        }

        $stmtExisting = $pdo->prepare('SELECT * FROM livraisons WHERE id = :id LIMIT 1');
        $stmtExisting->execute(['id' => $id]);
        $ancien = $stmtExisting->fetch();
        if (!$ancien) {
            reponseErreur('Enregistrement introuvable.', 404);
        }

        try {
            $pdo->beginTransaction();

            if (($ancien['statut'] ?? '') === 'livree') {
                synchroniserImpactLivraison($pdo, $ancien, [
                    ...$ancien,
                    'statut' => 'annulee',
                ], $userId);
            }

            $stmtDelete = $pdo->prepare('DELETE FROM livraisons WHERE id = :id');
            $stmtDelete->execute(['id' => $id]);

            $pdo->commit();
            reponseSucces(['id' => $id], 'Suppression reussie.');
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    reponseErreur('Methode non autorisee pour livraisons.', 405);
}

function executerAjustementsStockDepots(PDO $pdo): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        reponseErreur('Methode non autorisee pour ajustements_stock_depots.', 405);
    }

    $entree = lireCorpsJson();
    $depotId = (int) ($entree['depot_id'] ?? 0);
    $typeCarburantId = (int) ($entree['type_carburant_id'] ?? 0);
    $quantite = (float) ($entree['quantite'] ?? 0);
    $operation = (string) ($entree['operation'] ?? 'entree');
    $seuilAlerte = isset($entree['seuil_alerte']) ? (float) $entree['seuil_alerte'] : null;
    $userId = (int) ($_SERVER['HTTP_X_USER_ID'] ?? 0);

    if ($depotId <= 0 || $typeCarburantId <= 0 || $quantite <= 0) {
        reponseErreur('Depot, carburant et quantite sont requis.', 422);
    }

    $delta = $operation === 'sortie' ? -$quantite : $quantite;

    try {
        $pdo->beginTransaction();

        $stock = ajusterStockDepot($pdo, $depotId, $typeCarburantId, $delta);

        if ($seuilAlerte !== null) {
            $stmtSeuil = $pdo->prepare('UPDATE stocks_depots SET seuil_alerte = :seuil_alerte WHERE id = :id');
            $stmtSeuil->execute([
                'id' => (int) $stock['id'],
                'seuil_alerte' => $seuilAlerte,
            ]);
        }

        $stmtMouvement = $pdo->prepare(
            'INSERT INTO mouvements_stock (
                reference_mouvement, type_mouvement, type_carburant_id, depot_id,
                quantite, date_mouvement, cree_par, commentaire
             ) VALUES (
                :reference_mouvement, :type_mouvement, :type_carburant_id, :depot_id,
                :quantite, :date_mouvement, :cree_par, :commentaire
             )'
        );
        $stmtMouvement->execute([
            'reference_mouvement' => genererReference('MVT'),
            'type_mouvement' => $operation === 'sortie' ? 'sortie_depot' : 'entree_depot',
            'type_carburant_id' => $typeCarburantId,
            'depot_id' => $depotId,
            'quantite' => $quantite,
            'date_mouvement' => date('Y-m-d H:i:s'),
            'cree_par' => $userId > 0 ? $userId : null,
            'commentaire' => trim((string) ($entree['commentaire'] ?? '')) ?: 'Ajustement manuel stock depot',
        ]);

        synchroniserAlertesStockDepot($pdo, $depotId, $typeCarburantId, $userId);

        $pdo->commit();
        reponseSucces(['stock_id' => (int) $stock['id']], 'Ajustement de stock enregistre.', 201);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function executerAjustementsStockStations(PDO $pdo): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        reponseErreur('Methode non autorisee pour ajustements_stock_stations.', 405);
    }

    $entree = lireCorpsJson();
    $stationId = (int) ($entree['station_id'] ?? 0);
    $typeCarburantId = (int) ($entree['type_carburant_id'] ?? 0);
    $quantite = (float) ($entree['quantite'] ?? 0);
    $operation = (string) ($entree['operation'] ?? 'entree');
    $seuilAlerte = isset($entree['seuil_alerte']) ? (float) $entree['seuil_alerte'] : null;
    $userId = (int) ($_SERVER['HTTP_X_USER_ID'] ?? 0);

    if ($stationId <= 0 || $typeCarburantId <= 0 || $quantite <= 0) {
        reponseErreur('Station, carburant et quantite sont requis.', 422);
    }

    try {
        $pdo->beginTransaction();

        $stock = obtenirOuInitialiserStockStation($pdo, $stationId, $typeCarburantId);
        $delta = $operation === 'sortie' ? -$quantite : $quantite;
        $nouvelleQuantite = (float) $stock['quantite_disponible'] + $delta;

        if ($nouvelleQuantite < 0) {
            reponseErreur('Stock station insuffisant pour cette operation.', 422);
        }

        $stmt = $pdo->prepare(
            'UPDATE stocks_stations
             SET quantite_disponible = :quantite_disponible,
                 seuil_alerte = COALESCE(:seuil_alerte, seuil_alerte)
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => (int) $stock['id'],
            'quantite_disponible' => max($nouvelleQuantite, 0),
            'seuil_alerte' => $seuilAlerte,
        ]);

        $stmtMouvement = $pdo->prepare(
            'INSERT INTO mouvements_stock (
                reference_mouvement, type_mouvement, type_carburant_id, station_id,
                quantite, date_mouvement, cree_par, commentaire
             ) VALUES (
                :reference_mouvement, :type_mouvement, :type_carburant_id, :station_id,
                :quantite, :date_mouvement, :cree_par, :commentaire
             )'
        );
        $stmtMouvement->execute([
            'reference_mouvement' => genererReference('MVT'),
            'type_mouvement' => $operation === 'sortie' ? 'sortie_station' : 'entree_station',
            'type_carburant_id' => $typeCarburantId,
            'station_id' => $stationId,
            'quantite' => $quantite,
            'date_mouvement' => date('Y-m-d H:i:s'),
            'cree_par' => $userId > 0 ? $userId : null,
            'commentaire' => trim((string) ($entree['commentaire'] ?? '')) ?: 'Ajustement manuel stock station',
        ]);

        synchroniserAlertesStockStation($pdo, $stationId, $typeCarburantId, $userId);

        $pdo->commit();
        reponseSucces(['stock_id' => (int) $stock['id']], 'Ajustement de stock station enregistre.', 201);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function verifierAutorisationRole(string $entity, string $methode, int $roleId): void
{
    $permissions = [
        1 => [
            'read' => ['*'],
            'write' => ['*'],
        ],
        2 => [
            'read' => ['utilisateurs', 'clients', 'fournisseurs', 'depots', 'stations', 'types_carburant', 'prix_carburants', 'taux_change_stations', 'stocks_depots', 'stocks_stations', 'approvisionnements', 'mouvements_stock', 'ventes_station', 'alertes', 'livraisons', 'dashboard', 'rapports', 'parametres'],
            'write' => ['fournisseurs', 'depots', 'stations', 'types_carburant', 'stocks_depots', 'stocks_stations', 'ajustements_stock_depots', 'ajustements_stock_stations', 'approvisionnements', 'mouvements_stock', 'alertes', 'parametres'],
        ],
        3 => [
            'read' => ['utilisateurs', 'clients', 'depots', 'stations', 'vehicules', 'types_carburant', 'prix_carburants', 'taux_change_stations', 'stocks_depots', 'stocks_stations', 'livraisons', 'ventes_station', 'alertes', 'dashboard', 'rapports', 'parametres'],
            'write' => ['vehicules', 'livraisons', 'alertes', 'parametres'],
        ],
        4 => [
            'read' => ['utilisateurs', 'clients', 'depots', 'stations', 'vehicules', 'types_carburant', 'prix_carburants', 'taux_change_stations', 'stocks_depots', 'stocks_stations', 'livraisons', 'mouvements_stock', 'ventes_station', 'alertes', 'dashboard', 'rapports', 'parametres'],
            'write' => ['stocks_stations', 'ajustements_stock_stations', 'alertes', 'taux_change_stations', 'ventes_station', 'parametres'],
        ],
        5 => [
            'read' => ['depots', 'stations', 'types_carburant', 'stocks_depots', 'stocks_stations', 'approvisionnements', 'livraisons', 'mouvements_stock', 'ventes_station', 'alertes', 'dashboard', 'rapports', 'parametres'],
            'write' => ['parametres'],
        ],
    ];

    if (!isset($permissions[$roleId])) {
        reponseErreur('Rôle non autorisé.', 403);
    }

    $isLecture = $methode === 'GET';
    $scope = $isLecture ? 'read' : 'write';
    $liste = $permissions[$roleId][$scope];

    if (!in_array('*', $liste, true) && !in_array($entity, $liste, true)) {
        reponseErreur('Accès refusé pour ce rôle.', 403);
    }
}

try {
    $pdo = obtenirConnexion();
    $entity = $_GET['entity'] ?? null;

    if (!$entity) {
        reponseErreur('Paramètre entity manquant.', 400);
    }

    if ($entity !== 'auth') {
        $roleIdHeader = $_SERVER['HTTP_X_ROLE_ID'] ?? '';
        $roleId = (int) $roleIdHeader;
        if ($roleId <= 0) {
            reponseErreur('Authentification requise.', 401);
        }

        $methodeAutorisation = $_SERVER['REQUEST_METHOD'];
        if ($entity === 'alertes' && $methodeAutorisation === 'POST' && (($_GET['action'] ?? '') === 'consulter')) {
            $methodeAutorisation = 'GET';
        }

        verifierAutorisationRole($entity, $methodeAutorisation, $roleId);
    }

    if ($entity === 'dashboard') {
        executerDashboard($pdo);
    }

    if ($entity === 'rapports') {
        executerRapports($pdo);
    }

    if ($entity === 'auth') {
        executerAuth($pdo);
    }

    if ($entity === 'parametres') {
        executerParametres($pdo);
    }

    if ($entity === 'ventes_station') {
        executerVentesStation($pdo);
    }

    if ($entity === 'approvisionnements') {
        executerApprovisionnements($pdo);
    }

    if ($entity === 'ajustements_stock_depots') {
        executerAjustementsStockDepots($pdo);
    }

    if ($entity === 'ajustements_stock_stations') {
        executerAjustementsStockStations($pdo);
    }

    $methode = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

    if ($entity === 'alertes' && $methode === 'POST' && (($_GET['action'] ?? '') === 'consulter')) {
        $idAlerte = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($idAlerte <= 0) {
            reponseErreur('Paramètre id requis pour consulter une alerte.', 400);
        }

        $stmtAlerte = $pdo->prepare('SELECT * FROM alertes WHERE id = :id LIMIT 1');
        $stmtAlerte->execute(['id' => $idAlerte]);
        $alerte = $stmtAlerte->fetch();

        if (!$alerte) {
            reponseErreur('Alerte introuvable.', 404);
        }

        if (($alerte['statut'] ?? '') === 'nouvelle') {
            $stmtMarquerVue = $pdo->prepare("UPDATE alertes SET statut = 'en_cours' WHERE id = :id");
            $stmtMarquerVue->execute(['id' => $idAlerte]);
            $alerte['statut'] = 'en_cours';
        }

        reponseSucces(nettoyerDonneesSensibles($entity, $alerte));
    }

    if ($entity === 'alertes' && in_array($methode, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
        reponseErreur('Les alertes sont gérées automatiquement et ne peuvent pas être modifiées manuellement.', 405);
    }

    if (!isset($definitions[$entity])) {
        reponseErreur('Entité non supportée.', 404);
    }

    $definition = $definitions[$entity];
    $table = $definition['table'];
    $champs = $definition['champs'];
    $obligatoires = $definition['obligatoires'];

    if ($methode === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $ligne = $stmt->fetch();

            if (!$ligne) {
                reponseErreur('Enregistrement introuvable.', 404);
            }

            reponseSucces(nettoyerDonneesSensibles($entity, $ligne));
        }

        $filtres = [];
        $clauses = [];
        foreach ($_GET as $cle => $valeur) {
            if (in_array($cle, $champs, true)) {
                $clauses[] = "{$cle} = :{$cle}";
                $filtres[$cle] = $valeur;
            }
        }

        if ($entity === 'stocks_stations') {
            $sql = "SELECT * FROM {$table}";
            if ($clauses !== []) {
                $sql .= ' WHERE ' . implode(' AND ', $clauses);
            }
            $sql .= ' ORDER BY id DESC';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($filtres);
            $rows = $stmt->fetchAll();

            $sqlMouvements = "SELECT
                    station_id,
                    type_carburant_id,
                    COALESCE(SUM(
                        CASE
                            WHEN type_mouvement = 'entree_station' THEN quantite
                            WHEN type_mouvement IN ('sortie_station', 'transfert') THEN -quantite
                            ELSE 0
                        END
                    ), 0) AS quantite_disponible
                FROM mouvements_stock
                WHERE station_id IS NOT NULL";

            $mouvementFiltres = [];
            if (!empty($filtres['station_id'])) {
                $sqlMouvements .= ' AND station_id = :station_id';
                $mouvementFiltres['station_id'] = $filtres['station_id'];
            }
            if (!empty($filtres['type_carburant_id'])) {
                $sqlMouvements .= ' AND type_carburant_id = :type_carburant_id';
                $mouvementFiltres['type_carburant_id'] = $filtres['type_carburant_id'];
            }

            $sqlMouvements .= ' GROUP BY station_id, type_carburant_id';
            $stmtMouvements = $pdo->prepare($sqlMouvements);
            $stmtMouvements->execute($mouvementFiltres);
            $mouvements = $stmtMouvements->fetchAll();

            foreach ($mouvements as $mouvementRow) {
                if ((float) $mouvementRow['quantite_disponible'] <= 0) {
                    continue;
                }

                $existe = false;
                foreach ($rows as $row) {
                    if (
                        (string) ((int) $row['station_id']) === (string) ((int) $mouvementRow['station_id'])
                        && (string) ((int) $row['type_carburant_id']) === (string) ((int) $mouvementRow['type_carburant_id'])
                    ) {
                        $existe = true;
                        break;
                    }
                }

                if (!$existe) {
                    $rows[] = [
                        'id' => null,
                        'station_id' => (int) $mouvementRow['station_id'],
                        'type_carburant_id' => (int) $mouvementRow['type_carburant_id'],
                        'quantite_disponible' => (float) $mouvementRow['quantite_disponible'],
                        'seuil_alerte' => 0,
                        'date_mise_a_jour' => null,
                    ];
                }
            }

            reponseSucces(nettoyerCollectionSensible($entity, $rows));
        }

        $sql = "SELECT * FROM {$table}";
        if ($clauses !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $clauses);
        }

        $sql .= ' ORDER BY id DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($filtres);
        reponseSucces(nettoyerCollectionSensible($entity, $stmt->fetchAll()));
    }

    if ($methode === 'POST') {
        $entree = filtrerDonnees(lireCorpsJson(), $champs);
        verifierObligatoires($entree, $obligatoires);

        if (false && $entity === 'utilisateurs' && array_key_exists('mot_de_passe', $entree)) {
            if ($entree['mot_de_passe'] === '' || $entree['mot_de_passe'] === null) {
                unset($entree['mot_de_passe']);
            } else {
                $stmt = $pdo->prepare('SELECT mot_de_passe FROM utilisateurs WHERE id = :id LIMIT 1');
                $stmt->execute(['id' => $id]);
                $utilisateurExistant = $stmt->fetch();

                if (!$utilisateurExistant) {
                    reponseErreur('Enregistrement introuvable.', 404);
                }

                $motDePasseSoumis = (string) $entree['mot_de_passe'];
                $motDePasseActuel = (string) ($utilisateurExistant['mot_de_passe'] ?? '');

                if ($motDePasseSoumis === $motDePasseActuel) {
                    unset($entree['mot_de_passe']);
                } else {
                    $entree['mot_de_passe'] = password_hash($motDePasseSoumis, PASSWORD_BCRYPT);
                }
            }
        } elseif (isset($entree['mot_de_passe']) && $entree['mot_de_passe'] !== '') {
            $entree['mot_de_passe'] = password_hash((string) $entree['mot_de_passe'], PASSWORD_BCRYPT);
        }

        if ($entree === []) {
            reponseErreur('Aucune donnÃ©e Ã  mettre Ã  jour.', 422);
        }

        $colonnes = array_keys($entree);
        $placeholders = array_map(static fn($colonne) => ':' . $colonne, $colonnes);

        $sql = sprintf(
            'INSERT INTO %s (%s) VALUES (%s)',
            $table,
            implode(', ', $colonnes),
            implode(', ', $placeholders)
        );

        $stmt = $pdo->prepare($sql);
        $stmt->execute($entree);
        reponseSucces(['id' => (int) $pdo->lastInsertId()], 'Création réussie.', 201);
    }

    if ($methode === 'PUT' || $methode === 'PATCH') {
        if (!$id) {
            reponseErreur('Paramètre id requis pour la mise à jour.', 400);
        }

        $entree = filtrerDonnees(lireCorpsJson(), $champs);
        if ($entree === []) {
            reponseErreur('Aucune donnée à mettre à jour.', 422);
        }

        if ($entity === 'utilisateurs' && array_key_exists('mot_de_passe', $entree)) {
            if ($entree['mot_de_passe'] === '' || $entree['mot_de_passe'] === null) {
                unset($entree['mot_de_passe']);
            } else {
                $stmt = $pdo->prepare('SELECT mot_de_passe FROM utilisateurs WHERE id = :id LIMIT 1');
                $stmt->execute(['id' => $id]);
                $utilisateurExistant = $stmt->fetch();

                if (!$utilisateurExistant) {
                    reponseErreur('Enregistrement introuvable.', 404);
                }

                $motDePasseSoumis = (string) $entree['mot_de_passe'];
                $motDePasseActuel = (string) ($utilisateurExistant['mot_de_passe'] ?? '');

                if ($motDePasseSoumis === $motDePasseActuel) {
                    unset($entree['mot_de_passe']);
                } else {
                    $entree['mot_de_passe'] = password_hash($motDePasseSoumis, PASSWORD_BCRYPT);
                }
            }
        } elseif (isset($entree['mot_de_passe']) && $entree['mot_de_passe'] !== '') {
            $entree['mot_de_passe'] = password_hash((string) $entree['mot_de_passe'], PASSWORD_BCRYPT);
        }

        if ($entree === []) {
            reponseErreur('Aucune donnée à mettre à jour.', 422);
        }

        $assignations = array_map(static fn($colonne) => $colonne . ' = :' . $colonne, array_keys($entree));
        $entree['id'] = $id;

        $sql = sprintf('UPDATE %s SET %s WHERE id = :id', $table, implode(', ', $assignations));
        $stmt = $pdo->prepare($sql);
        $stmt->execute($entree);

        reponseSucces(['id' => $id], 'Mise à jour réussie.');
    }

    if ($methode === 'DELETE') {
        if (!$id) {
            reponseErreur('Paramètre id requis pour la suppression.', 400);
        }

        if ($entity === 'clients') {
            $stmtDependances = $pdo->prepare('SELECT COUNT(*) FROM ventes_station WHERE client_id = :id');
            $stmtDependances->execute(['id' => $id]);

            if ((int) $stmtDependances->fetchColumn() > 0) {
                reponseErreur('Ce client est lié à une ou plusieurs ventes et ne peut pas être supprimé.', 409);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = :id");
        try {
            $stmt->execute(['id' => $id]);
        } catch (PDOException $e) {
            if ($entity === 'clients' && $e->getCode() === '23000') {
                reponseErreur('Ce client est lié à une ou plusieurs ventes et ne peut pas être supprimé.', 409);
            }

            throw $e;
        }
        reponseSucces(['id' => $id], 'Suppression réussie.');
    }

    reponseErreur('Méthode non autorisée.', 405);
} catch (PDOException $e) {
    reponseErreur('Erreur base de données.', 500, ['exception' => $e->getMessage()]);
} catch (Throwable $e) {
    reponseErreur('Erreur serveur.', 500, ['exception' => $e->getMessage()]);
}
