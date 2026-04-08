<?php
require_once dirname(__DIR__) . '/config/connexion.php';

class Livraison {
    private $conn;
    private $table = "livraisons";

    public $id_livraison;
    public $numero_livraison;
    public $id_vehicule;
    public $id_depot_origine;
    public $id_station_destination;
    public $quantite_prevue;
    public $quantite_reelle;
    public $date_depart;
    public $date_arrivee_prevue;
    public $date_arrivee_reelle;
    public $statut;
    public $chauffeur_nom;
    public $chauffeur_contact;
    public $remarques;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Ces codes c'est pour générer un numéro de livraison unique
    private function genererNumeroLivraison() {
        $prefixe = 'LIV-' . date('Ymd') . '-';
        $query = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE numero_livraison LIKE :prefixe";
        $stmt = $this->conn->prepare($query);
        $prefixe_like = $prefixe . '%';
        $stmt->bindParam(":prefixe", $prefixe_like);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $numero = $row['count'] + 1;
        return $prefixe . str_pad($numero, 4, '0', STR_PAD_LEFT);
    }

    // pour créer une livraison
    public function create() {
        $this->numero_livraison = $this->genererNumeroLivraison();
        
        $query = "INSERT INTO " . $this->table . " 
                  SET numero_livraison = :numero_livraison,
                      id_vehicule = :id_vehicule,
                      id_depot_origine = :id_depot_origine,
                      id_station_destination = :id_station_destination,
                      quantite_prevue = :quantite_prevue,
                      date_arrivee_prevue = :date_arrivee_prevue,
                      chauffeur_nom = :chauffeur_nom,
                      chauffeur_contact = :chauffeur_contact,
                      remarques = :remarques,
                      statut = 'planifiee'";

        $stmt = $this->conn->prepare($query);

        // pour le nettoyage des données
        $this->id_vehicule = htmlspecialchars(strip_tags($this->id_vehicule));
        $this->id_depot_origine = htmlspecialchars(strip_tags($this->id_depot_origine));
        $this->id_station_destination = htmlspecialchars(strip_tags($this->id_station_destination));
        $this->quantite_prevue = htmlspecialchars(strip_tags($this->quantite_prevue));
        $this->date_arrivee_prevue = htmlspecialchars(strip_tags($this->date_arrivee_prevue));
        $this->chauffeur_nom = htmlspecialchars(strip_tags($this->chauffeur_nom));
        $this->chauffeur_contact = htmlspecialchars(strip_tags($this->chauffeur_contact));
        $this->remarques = htmlspecialchars(strip_tags($this->remarques));

        $stmt->bindParam(":numero_livraison", $this->numero_livraison);
        $stmt->bindParam(":id_vehicule", $this->id_vehicule);
        $stmt->bindParam(":id_depot_origine", $this->id_depot_origine);
        $stmt->bindParam(":id_station_destination", $this->id_station_destination);
        $stmt->bindParam(":quantite_prevue", $this->quantite_prevue);
        $stmt->bindParam(":date_arrivee_prevue", $this->date_arrivee_prevue);
        $stmt->bindParam(":chauffeur_nom", $this->chauffeur_nom);
        $stmt->bindParam(":chauffeur_contact", $this->chauffeur_contact);
        $stmt->bindParam(":remarques", $this->remarques);

        if($stmt->execute()) {
            $this->id_livraison = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // pour lire toutes les livraisons
    public function read() {
        $query = "SELECT l.*, 
                         v.immatriculation, v.marque, v.modele,
                         d.nom_depot as depot_origine,
                         s.nom_station as station_destination
                  FROM " . $this->table . " l
                  LEFT JOIN vehicules v ON l.id_vehicule = v.id_vehicule
                  LEFT JOIN depots d ON l.id_depot_origine = d.id_depot
                  LEFT JOIN stations s ON l.id_station_destination = s.id_station
                  ORDER BY l.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // pour lire une livraison spécifique
    public function readOne() {
        $query = "SELECT l.*, 
                         v.immatriculation, v.marque, v.modele,
                         d.nom_depot as depot_origine,
                         s.nom_station as station_destination
                  FROM " . $this->table . " l
                  LEFT JOIN vehicules v ON l.id_vehicule = v.id_vehicule
                  LEFT JOIN depots d ON l.id_depot_origine = d.id_depot
                  LEFT JOIN stations s ON l.id_station_destination = s.id_station
                  WHERE l.id_livraison = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id_livraison);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // pour démarrer une livraison
    public function demarrerLivraison() {
        $query = "UPDATE " . $this->table . " 
                  SET statut = 'en_cours', date_depart = NOW()
                  WHERE id_livraison = :id_livraison AND statut = 'planifiee'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_livraison", $this->id_livraison);
        
        if($stmt->execute()) {
            // mettre à jour le statut du véhicule
            $queryVehicule = "UPDATE vehicules SET statut = 'en_livraison' 
                              WHERE id_vehicule = (SELECT id_vehicule FROM livraisons WHERE id_livraison = :id_livraison)";
            $stmtVehicule = $this->conn->prepare($queryVehicule);
            $stmtVehicule->bindParam(":id_livraison", $this->id_livraison);
            $stmtVehicule->execute();
            
            $this->enregistrerHistoriqueStatut('planifiee', 'en_cours');
            return true;
        }
        return false;
    }

    // Ces codes c'est pour terminer une livraison
    public function terminerLivraison($quantite_reelle, $date_arrivee_reelle = null) {
        $date_arrivee = $date_arrivee_reelle ?: date('Y-m-d H:i:s');
        
        $query = "UPDATE " . $this->table . " 
                  SET statut = 'livree', 
                      quantite_reelle = :quantite_reelle,
                      date_arrivee_reelle = :date_arrivee_reelle
                  WHERE id_livraison = :id_livraison AND statut = 'en_cours'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":quantite_reelle", $quantite_reelle);
        $stmt->bindParam(":date_arrivee_reelle", $date_arrivee);
        $stmt->bindParam(":id_livraison", $this->id_livraison);
        
        if($stmt->execute()) {
            // mettre à jour le statut du véhicule
            $queryVehicule = "UPDATE vehicules SET statut = 'disponible' 
                              WHERE id_vehicule = (SELECT id_vehicule FROM livraisons WHERE id_livraison = :id_livraison)";
            $stmtVehicule = $this->conn->prepare($queryVehicule);
            $stmtVehicule->bindParam(":id_livraison", $this->id_livraison);
            $stmtVehicule->execute();
            
            $this->enregistrerHistoriqueStatut('en_cours', 'livree');
            return true;
        }
        return false;
    }

    // Pour annuler une livraison
    public function annulerLivraison($motif) {
        $query = "UPDATE " . $this->table . " 
                  SET statut = 'annulee', remarques = CONCAT(remarques, ' - Annulation: ', :motif)
                  WHERE id_livraison = :id_livraison";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":motif", $motif);
        $stmt->bindParam(":id_livraison", $this->id_livraison);
        
        if($stmt->execute()) {
            // Libérer le véhicule si nécessaire
            $queryVehicule = "UPDATE vehicules SET statut = 'disponible' 
                              WHERE id_vehicule = (SELECT id_vehicule FROM livraisons WHERE id_livraison = :id_livraison)";
            $stmtVehicule = $this->conn->prepare($queryVehicule);
            $stmtVehicule->bindParam(":id_livraison", $this->id_livraison);
            $stmtVehicule->execute();
            
            $this->enregistrerHistoriqueStatut('planifiee', 'annulee', $motif);
            return true;
        }
        return false;
    }

    // Ces codes c'est pour enregistrer l'historique des statuts
    private function enregistrerHistoriqueStatut($ancien, $nouveau, $commentaire = null) {
        $query = "INSERT INTO livraison_statut_historique 
                  (id_livraison, ancien_statut, nouveau_statut, commentaire) 
                  VALUES (:id_livraison, :ancien, :nouveau, :commentaire)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_livraison", $this->id_livraison);
        $stmt->bindParam(":ancien", $ancien);
        $stmt->bindParam(":nouveau", $nouveau);
        $stmt->bindParam(":commentaire", $commentaire);
        return $stmt->execute();
    }

    // Pour obtenir les livraisons par statut
    public function getLivraisonsByStatut($statut) {
        $query = "SELECT l.*, 
                         v.immatriculation, v.marque, v.modele,
                         d.nom_depot as depot_origine,
                         s.nom_station as station_destination
                  FROM " . $this->table . " l
                  LEFT JOIN vehicules v ON l.id_vehicule = v.id_vehicule
                  LEFT JOIN depots d ON l.id_depot_origine = d.id_depot
                  LEFT JOIN stations s ON l.id_station_destination = s.id_station
                  WHERE l.statut = :statut
                  ORDER BY l.date_arrivee_prevue ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":statut", $statut);
        $stmt->execute();
        return $stmt;
    }

    // Pour voir les statistiques des livraisons
    public function getStats() {
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN statut = 'planifiee' THEN 1 ELSE 0 END) as planifiees,
                    SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
                    SUM(CASE WHEN statut = 'livree' THEN 1 ELSE 0 END) as livrees,
                    SUM(CASE WHEN statut = 'retard' THEN 1 ELSE 0 END) as retards,
                    SUM(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END) as annulees,
                    SUM(quantite_prevue) as total_quantite_prevue,
                    SUM(quantite_reelle) as total_quantite_livree
                  FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>