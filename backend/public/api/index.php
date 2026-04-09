<?php

declare(strict_types=1);

require_once __DIR__ . '/../../config/connexion.php';
require_once __DIR__ . '/../../utilitaires/reponse_json.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Role-Id, X-User-Id');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
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
        'alertes_ouvertes' => (int) $pdo->query("SELECT COUNT(*) FROM alertes WHERE statut <> 'resolue'")->fetchColumn(),
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

function verifierAutorisationRole(string $entity, string $methode, int $roleId): void
{
    $permissions = [
        1 => [
            'read' => ['*'],
            'write' => ['*'],
        ],
        2 => [
            'read' => ['utilisateurs', 'fournisseurs', 'depots', 'stations', 'types_carburant', 'approvisionnements', 'mouvements_stock', 'alertes', 'livraisons', 'dashboard', 'rapports', 'parametres'],
            'write' => ['fournisseurs', 'depots', 'types_carburant', 'approvisionnements', 'mouvements_stock', 'alertes', 'parametres'],
        ],
        3 => [
            'read' => ['utilisateurs', 'depots', 'stations', 'vehicules', 'types_carburant', 'livraisons', 'alertes', 'dashboard', 'rapports', 'parametres'],
            'write' => ['vehicules', 'livraisons', 'alertes', 'parametres'],
        ],
        4 => [
            'read' => ['utilisateurs', 'depots', 'stations', 'vehicules', 'types_carburant', 'livraisons', 'alertes', 'dashboard', 'rapports', 'parametres'],
            'write' => ['alertes', 'parametres'],
        ],
        5 => [
            'read' => ['depots', 'stations', 'types_carburant', 'approvisionnements', 'livraisons', 'mouvements_stock', 'alertes', 'dashboard', 'rapports', 'parametres'],
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
        verifierAutorisationRole($entity, $_SERVER['REQUEST_METHOD'], $roleId);
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

    if (!isset($definitions[$entity])) {
        reponseErreur('Entité non supportée.', 404);
    }

    $definition = $definitions[$entity];
    $table = $definition['table'];
    $champs = $definition['champs'];
    $obligatoires = $definition['obligatoires'];
    $methode = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

    if ($methode === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $ligne = $stmt->fetch();

            if (!$ligne) {
                reponseErreur('Enregistrement introuvable.', 404);
            }

            reponseSucces($ligne);
        }

        $filtres = [];
        $clauses = [];
        foreach ($_GET as $cle => $valeur) {
            if (in_array($cle, $champs, true)) {
                $clauses[] = "{$cle} = :{$cle}";
                $filtres[$cle] = $valeur;
            }
        }

        $sql = "SELECT * FROM {$table}";
        if ($clauses !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $clauses);
        }

        $sql .= ' ORDER BY id DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($filtres);
        reponseSucces($stmt->fetchAll());
    }

    if ($methode === 'POST') {
        $entree = filtrerDonnees(lireCorpsJson(), $champs);
        verifierObligatoires($entree, $obligatoires);

        if (isset($entree['mot_de_passe']) && $entree['mot_de_passe'] !== '') {
            $entree['mot_de_passe'] = password_hash((string) $entree['mot_de_passe'], PASSWORD_BCRYPT);
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

        if (isset($entree['mot_de_passe']) && $entree['mot_de_passe'] !== '') {
            $entree['mot_de_passe'] = password_hash((string) $entree['mot_de_passe'], PASSWORD_BCRYPT);
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

        $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        reponseSucces(['id' => $id], 'Suppression réussie.');
    }

    reponseErreur('Méthode non autorisée.', 405);
} catch (PDOException $e) {
    reponseErreur('Erreur base de données.', 500, ['exception' => $e->getMessage()]);
} catch (Throwable $e) {
    reponseErreur('Erreur serveur.', 500, ['exception' => $e->getMessage()]);
}
