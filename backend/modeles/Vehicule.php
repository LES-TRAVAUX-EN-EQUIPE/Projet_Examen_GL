<?php
require_once dirname(__DIR__) . '/config/connexion.php';

class Vehicule {
    private $conn;
    private $table = "vehicules";

    public $id_vehicule;
    public $immatriculation;
    public $marque;
    public $modele;
    public $capacite_reservoir;
    public $consommation_moyenne;
    public $statut;
    public $date_mise_en_service;
    public $kilometrage_actuel;
    public $derniere_maintenance;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Ces codes c'est pour créer un véhicule
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET immatriculation=:immatriculation, 
                      marque=:marque, 
                      modele=:modele, 
                      capacite_reservoir=:capacite_reservoir, 
                      consommation_moyenne=:consommation_moyenne, 
                      statut=:statut, 
                      date_mise_en_service=:date_mise_en_service, 
                      kilometrage_actuel=:kilometrage_actuel, 
                      derniere_maintenance=:derniere_maintenance";

        $stmt = $this->conn->prepare($query);

        $this->immatriculation = htmlspecialchars(strip_tags($this->immatriculation));
        $this->marque = htmlspecialchars(strip_tags($this->marque));
        $this->modele = htmlspecialchars(strip_tags($this->modele));
        $this->capacite_reservoir = htmlspecialchars(strip_tags($this->capacite_reservoir));
        $this->consommation_moyenne = htmlspecialchars(strip_tags($this->consommation_moyenne));
        $this->statut = htmlspecialchars(strip_tags($this->statut));
        $this->date_mise_en_service = htmlspecialchars(strip_tags($this->date_mise_en_service));
        $this->kilometrage_actuel = htmlspecialchars(strip_tags($this->kilometrage_actuel));
        $this->derniere_maintenance = htmlspecialchars(strip_tags($this->derniere_maintenance));

        $stmt->bindParam(":immatriculation", $this->immatriculation);
        $stmt->bindParam(":marque", $this->marque);
        $stmt->bindParam(":modele", $this->modele);
        $stmt->bindParam(":capacite_reservoir", $this->capacite_reservoir);
        $stmt->bindParam(":consommation_moyenne", $this->consommation_moyenne);
        $stmt->bindParam(":statut", $this->statut);
        $stmt->bindParam(":date_mise_en_service", $this->date_mise_en_service);
        $stmt->bindParam(":kilometrage_actuel", $this->kilometrage_actuel);
        $stmt->bindParam(":derniere_maintenance", $this->derniere_maintenance);

        if($stmt->execute()) {
            $this->id_vehicule = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Ces codes c'est pour lire tous les véhicules de notre base des donnees
    public function read() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // ca c'est pour lire un seul véhicule
    public function readOne() {
        $query = "SELECT * FROM " . $this->table . " WHERE id_vehicule = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id_vehicule);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->immatriculation = $row['immatriculation'];
            $this->marque = $row['marque'];
            $this->modele = $row['modele'];
            $this->capacite_reservoir = $row['capacite_reservoir'];
            $this->consommation_moyenne = $row['consommation_moyenne'];
            $this->statut = $row['statut'];
            $this->date_mise_en_service = $row['date_mise_en_service'];
            $this->kilometrage_actuel = $row['kilometrage_actuel'];
            $this->derniere_maintenance = $row['derniere_maintenance'];
            return true;
        }
        return false;
    }

    // pour mettre à jour un véhicule
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET immatriculation = :immatriculation,
                      marque = :marque,
                      modele = :modele,
                      capacite_reservoir = :capacite_reservoir,
                      consommation_moyenne = :consommation_moyenne,
                      statut = :statut,
                      date_mise_en_service = :date_mise_en_service,
                      kilometrage_actuel = :kilometrage_actuel,
                      derniere_maintenance = :derniere_maintenance
                  WHERE id_vehicule = :id_vehicule";

        $stmt = $this->conn->prepare($query);

        $this->immatriculation = htmlspecialchars(strip_tags($this->immatriculation));
        $this->marque = htmlspecialchars(strip_tags($this->marque));
        $this->modele = htmlspecialchars(strip_tags($this->modele));
        $this->capacite_reservoir = htmlspecialchars(strip_tags($this->capacite_reservoir));
        $this->consommation_moyenne = htmlspecialchars(strip_tags($this->consommation_moyenne));
        $this->statut = htmlspecialchars(strip_tags($this->statut));
        $this->date_mise_en_service = htmlspecialchars(strip_tags($this->date_mise_en_service));
        $this->kilometrage_actuel = htmlspecialchars(strip_tags($this->kilometrage_actuel));
        $this->derniere_maintenance = htmlspecialchars(strip_tags($this->derniere_maintenance));

        $stmt->bindParam(":immatriculation", $this->immatriculation);
        $stmt->bindParam(":marque", $this->marque);
        $stmt->bindParam(":modele", $this->modele);
        $stmt->bindParam(":capacite_reservoir", $this->capacite_reservoir);
        $stmt->bindParam(":consommation_moyenne", $this->consommation_moyenne);
        $stmt->bindParam(":statut", $this->statut);
        $stmt->bindParam(":date_mise_en_service", $this->date_mise_en_service);
        $stmt->bindParam(":kilometrage_actuel", $this->kilometrage_actuel);
        $stmt->bindParam(":derniere_maintenance", $this->derniere_maintenance);
        $stmt->bindParam(":id_vehicule", $this->id_vehicule);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // pour supprimer un véhicule
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id_vehicule = :id_vehicule";
        $stmt = $this->conn->prepare($query);
        $this->id_vehicule = htmlspecialchars(strip_tags($this->id_vehicule));
        $stmt->bindParam(":id_vehicule", $this->id_vehicule);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Ces codes c'est pour mettre à jour le statut
    public function updateStatut($id, $statut) {
        $query = "UPDATE " . $this->table . " SET statut = :statut WHERE id_vehicule = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":statut", $statut);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    // Ces codes c'est pour obtenir les véhicules disponibles
    public function getVehiculesDisponibles() {
        $query = "SELECT * FROM " . $this->table . " WHERE statut = 'disponible' ORDER BY immatriculation";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>