<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once dirname(__DIR__) . '/modeles/Livraison.php';

class LivraisonControleur {
    private $livraison;

    public function __construct() {
        $this->livraison = new Livraison();
    }

    // GET - pour récupérer toutes les livraisons
    public function getAllLivraisons() {
        $stmt = $this->livraison->read();
        $livraisons = [];
        
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($livraisons, $row);
        }
        
        echo json_encode([
            "success" => true,
            "data" => $livraisons
        ]);
    }

    // GET - pour récupérer une livraison spécifique
    public function getLivraison($id) {
        $this->livraison->id_livraison = $id;
        $livraison = $this->livraison->readOne();
        
        if($livraison) {
            echo json_encode([
                "success" => true,
                "data" => $livraison
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Livraison non trouvée"
            ]);
        }
    }

    // POST - pour créer une livraison
    public function createLivraison() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(!isset($data->id_vehicule) || !isset($data->id_depot_origine) || 
           !isset($data->id_station_destination) || !isset($data->quantite_prevue)) {
            echo json_encode([
                "success" => false,
                "message" => "Données incomplètes"
            ]);
            return;
        }
        
        $this->livraison->id_vehicule = $data->id_vehicule;
        $this->livraison->id_depot_origine = $data->id_depot_origine;
        $this->livraison->id_station_destination = $data->id_station_destination;
        $this->livraison->quantite_prevue = $data->quantite_prevue;
        $this->livraison->date_arrivee_prevue = $data->date_arrivee_prevue;
        $this->livraison->chauffeur_nom = $data->chauffeur_nom ?? null;
        $this->livraison->chauffeur_contact = $data->chauffeur_contact ?? null;
        $this->livraison->remarques = $data->remarques ?? null;
        
        if($this->livraison->create()) {
            echo json_encode([
                "success" => true,
                "message" => "Livraison créée avec succès",
                "numero_livraison" => $this->livraison->numero_livraison,
                "id" => $this->livraison->id_livraison
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la création de la livraison"
            ]);
        }
    }

    // PUT - pour démarrer une livraison
    public function demarrerLivraison($id) {
        $this->livraison->id_livraison = $id;
        
        if($this->livraison->demarrerLivraison()) {
            echo json_encode([
                "success" => true,
                "message" => "Livraison démarrée avec succès"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Impossible de démarrer la livraison"
            ]);
        }
    }

    // PUT - pour terminer une livraison
    public function terminerLivraison($id) {
        $data = json_decode(file_get_contents("php://input"));
        
        if(!isset($data->quantite_reelle)) {
            echo json_encode([
                "success" => false,
                "message" => "Quantité réelle requise"
            ]);
            return;
        }
        
        $this->livraison->id_livraison = $id;
        $date_arrivee = $data->date_arrivee_reelle ?? null;
        
        if($this->livraison->terminerLivraison($data->quantite_reelle, $date_arrivee)) {
            echo json_encode([
                "success" => true,
                "message" => "Livraison terminée avec succès"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Impossible de terminer la livraison"
            ]);
        }
    }

    // PUT - pour annuler une livraison
    public function annulerLivraison($id) {
        $data = json_decode(file_get_contents("php://input"));
        $motif = $data->motif ?? "Annulation sans motif";
        
        $this->livraison->id_livraison = $id;
        
        if($this->livraison->annulerLivraison($motif)) {
            echo json_encode([
                "success" => true,
                "message" => "Livraison annulée avec succès"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Impossible d'annuler la livraison"
            ]);
        }
    }

    // GET - pour voir livraisons par statut
    public function getLivraisonsByStatut($statut) {
        $stmt = $this->livraison->getLivraisonsByStatut($statut);
        $livraisons = [];
        
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($livraisons, $row);
        }
        
        echo json_encode([
            "success" => true,
            "data" => $livraisons
        ]);
    }

    // GET - pour voir les statistiques
    public function getStats() {
        $stats = $this->livraison->getStats();
        echo json_encode([
            "success" => true,
            "data" => $stats
        ]);
    }
}

// Routing
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['path']) ? $_GET['path'] : '';

$controleur = new LivraisonControleur();

if($method === 'GET') {
    if($path === 'stats') {
        $controleur->getStats();
    } elseif($path === 'planifiees') {
        $controleur->getLivraisonsByStatut('planifiee');
    } elseif($path === 'en-cours') {
        $controleur->getLivraisonsByStatut('en_cours');
    } elseif($path === 'livrees') {
        $controleur->getLivraisonsByStatut('livree');
    } elseif(preg_match('/^\d+$/', $path)) {
        $controleur->getLivraison($path);
    } else {
        $controleur->getAllLivraisons();
    }
} elseif($method === 'POST') {
    $controleur->createLivraison();
} elseif($method === 'PUT') {
    if(strpos($path, '/demarrer') !== false) {
        $id = str_replace('/demarrer', '', $path);
        $controleur->demarrerLivraison($id);
    } elseif(strpos($path, '/terminer') !== false) {
        $id = str_replace('/terminer', '', $path);
        $controleur->terminerLivraison($id);
    } elseif(strpos($path, '/annuler') !== false) {
        $id = str_replace('/annuler', '', $path);
        $controleur->annulerLivraison($id);
    }
} else {
    echo json_encode(["success" => false, "message" => "Méthode non supportée"]);
}
?>