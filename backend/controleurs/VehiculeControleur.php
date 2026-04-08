<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once dirname(__DIR__) . '/modeles/Vehicule.php';

class VehiculeControleur {
    private $vehicule;

    public function __construct() {
        $this->vehicule = new Vehicule();
    }

    // GET - pour récupérer tous les véhicules
    public function getAllVehicules() {
        $stmt = $this->vehicule->read();
        $vehicules = [];
        
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($vehicules, $row);
        }
        
        echo json_encode([
            "success" => true,
            "data" => $vehicules
        ]);
    }

    // GET - pour récupérer un véhicule spécifique
    public function getVehicule($id) {
        $this->vehicule->id_vehicule = $id;
        
        if($this->vehicule->readOne()) {
            echo json_encode([
                "success" => true,
                "data" => [
                    "id_vehicule" => $this->vehicule->id_vehicule,
                    "immatriculation" => $this->vehicule->immatriculation,
                    "marque" => $this->vehicule->marque,
                    "modele" => $this->vehicule->modele,
                    "capacite_reservoir" => $this->vehicule->capacite_reservoir,
                    "consommation_moyenne" => $this->vehicule->consommation_moyenne,
                    "statut" => $this->vehicule->statut,
                    "date_mise_en_service" => $this->vehicule->date_mise_en_service,
                    "kilometrage_actuel" => $this->vehicule->kilometrage_actuel,
                    "derniere_maintenance" => $this->vehicule->derniere_maintenance
                ]
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Véhicule non trouvé"
            ]);
        }
    }

    // POST - pour créer un véhicule
    public function createVehicule() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(!isset($data->immatriculation) || !isset($data->marque) || !isset($data->modele)) {
            echo json_encode([
                "success" => false,
                "message" => "Données incomplètes"
            ]);
            return;
        }
        
        $this->vehicule->immatriculation = $data->immatriculation;
        $this->vehicule->marque = $data->marque;
        $this->vehicule->modele = $data->modele;
        $this->vehicule->capacite_reservoir = $data->capacite_reservoir ?? 0;
        $this->vehicule->consommation_moyenne = $data->consommation_moyenne ?? null;
        $this->vehicule->statut = $data->statut ?? 'disponible';
        $this->vehicule->date_mise_en_service = $data->date_mise_en_service ?? date('Y-m-d');
        $this->vehicule->kilometrage_actuel = $data->kilometrage_actuel ?? 0;
        $this->vehicule->derniere_maintenance = $data->derniere_maintenance ?? null;
        
        if($this->vehicule->create()) {
            echo json_encode([
                "success" => true,
                "message" => "Véhicule créé avec succès",
                "id" => $this->vehicule->id_vehicule
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la création du véhicule"
            ]);
        }
    }

    // PUT - pour mettre à jour un véhicule
    public function updateVehicule($id) {
        $data = json_decode(file_get_contents("php://input"));
        
        $this->vehicule->id_vehicule = $id;
        
        if(!$this->vehicule->readOne()) {
            echo json_encode([
                "success" => false,
                "message" => "Véhicule non trouvé"
            ]);
            return;
        }
        
        $this->vehicule->immatriculation = $data->immatriculation ?? $this->vehicule->immatriculation;
        $this->vehicule->marque = $data->marque ?? $this->vehicule->marque;
        $this->vehicule->modele = $data->modele ?? $this->vehicule->modele;
        $this->vehicule->capacite_reservoir = $data->capacite_reservoir ?? $this->vehicule->capacite_reservoir;
        $this->vehicule->consommation_moyenne = $data->consommation_moyenne ?? $this->vehicule->consommation_moyenne;
        $this->vehicule->statut = $data->statut ?? $this->vehicule->statut;
        $this->vehicule->date_mise_en_service = $data->date_mise_en_service ?? $this->vehicule->date_mise_en_service;
        $this->vehicule->kilometrage_actuel = $data->kilometrage_actuel ?? $this->vehicule->kilometrage_actuel;
        $this->vehicule->derniere_maintenance = $data->derniere_maintenance ?? $this->vehicule->derniere_maintenance;
        
        if($this->vehicule->update()) {
            echo json_encode([
                "success" => true,
                "message" => "Véhicule mis à jour avec succès"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la mise à jour"
            ]);
        }
    }

    // DELETE - pour supprimer un véhicule
    public function deleteVehicule($id) {
        $this->vehicule->id_vehicule = $id;
        
        if($this->vehicule->delete()) {
            echo json_encode([
                "success" => true,
                "message" => "Véhicule supprimé avec succès"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la suppression"
            ]);
        }
    }

    // GET - pour voir les véhicules disponibles
    public function getVehiculesDisponibles() {
        $vehicules = $this->vehicule->getVehiculesDisponibles();
        echo json_encode([
            "success" => true,
            "data" => $vehicules
        ]);
    }
}

// Routing simple
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['path']) ? $_GET['path'] : '';

$controleur = new VehiculeControleur();

switch($method) {
    case 'GET':
        if($path === 'disponibles') {
            $controleur->getVehiculesDisponibles();
        } elseif(preg_match('/^\d+$/', $path)) {
            $controleur->getVehicule($path);
        } else {
            $controleur->getAllVehicules();
        }
        break;
    case 'POST':
        $controleur->createVehicule();
        break;
    case 'PUT':
        if(preg_match('/^\d+$/', $path)) {
            $controleur->updateVehicule($path);
        }
        break;
    case 'DELETE':
        if(preg_match('/^\d+$/', $path)) {
            $controleur->deleteVehicule($path);
        }
        break;
    default:
        echo json_encode(["success" => false, "message" => "Méthode non supportée"]);
}
?>