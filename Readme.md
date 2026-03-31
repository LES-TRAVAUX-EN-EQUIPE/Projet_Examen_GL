Projet_Examen_GL/
│
├── README.md
├── .gitignore
├── instructions_travail_equipe.md
├── rapport_travail_effectue.md
│
├── documentation/
│   ├── cahier_des_charges.md
│   ├── analyse_du_probleme.md
│   ├── besoins_fonctionnels.md
│   ├── besoins_non_fonctionnels.md
│   ├── regles_de_gestion.md
│   ├── plan_de_test.md
│   ├── manuel_utilisateur.md
│   ├── preuves_travail_equipe.md
│   │
│   └── uml/
│       ├── diagramme_cas_utilisation.png
│       ├── diagramme_classes.png
│       ├── diagramme_activite.png
│       ├── diagramme_sequence.png
│       └── diagramme_deploiement.png
│
├── base_de_donnees/
│   ├── schema_mysql/
│   │   └── schema_application_carburant.sql
│   ├── donnees_test/
│   │   └── jeu_donnees_initial.sql
│   └── dictionnaire_donnees.md
│
├── backend/
│   ├── config/
│   │   └── connexion.php
│   │
│   ├── controleurs/
│   │   ├── AuthentificationControleur.php
│   │   ├── UtilisateurControleur.php
│   │   ├── FournisseurControleur.php
│   │   ├── CarburantControleur.php
│   │   ├── DepotControleur.php
│   │   ├── StationControleur.php
│   │   ├── VehiculeControleur.php
│   │   ├── ApprovisionnementControleur.php
│   │   ├── LivraisonControleur.php
│   │   ├── MouvementStockControleur.php
│   │   ├── AlerteControleur.php
│   │   └── RapportControleur.php
│   │
│   ├── modeles/
│   │   ├── Utilisateur.php
│   │   ├── Fournisseur.php
│   │   ├── TypeCarburant.php
│   │   ├── Depot.php
│   │   ├── Station.php
│   │   ├── Vehicule.php
│   │   ├── Approvisionnement.php
│   │   ├── Livraison.php
│   │   ├── MouvementStock.php
│   │   └── Alerte.php
│   │
│   ├── routes/
│   │   └── api.php
│   │
│   ├── middleware/
│   │   └── AuthMiddleware.php
│   │
│   ├── utilitaires/
│   │   ├── reponse_json.php
│   │   ├── validation.php
│   │   └── fonctions.php
│   │
│   ├── tests/
│   │   ├── test_connexion.php
│   │   ├── test_utilisateur.php
│   │   ├── test_fournisseur.php
│   │   ├── test_approvisionnement.php
│   │   └── test_livraison.php
│   │
│   └── public/
│       └── index.php
│
├── frontend/
│   ├── index.html
│   │
│   ├── pages/
│   │   ├── connexion.html
│   │   ├── tableau_de_bord.html
│   │   ├── utilisateurs.html
│   │   ├── fournisseurs.html
│   │   ├── types_carburant.html
│   │   ├── depots.html
│   │   ├── stations.html
│   │   ├── vehicules.html
│   │   ├── approvisionnements.html
│   │   ├── livraisons.html
│   │   ├── mouvements_stock.html
│   │   ├── alertes.html
│   │   └── rapports.html
│   │
│   ├── ressources/
│   │   ├── css/
│   │   │   ├── style.css
│   │   │   ├── accueil.css
│   │   │   ├── connexion.css
│   │   │   ├── tableau_de_bord.css
│   │   │   ├── formulaires.css
│   │   │   └── tableaux.css
│   │   │
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   ├── connexion.js
│   │   │   ├── tableau_de_bord.js
│   │   │   ├── fournisseurs.js
│   │   │   ├── depots.js
│   │   │   ├── stations.js
│   │   │   ├── approvisionnements.js
│   │   │   ├── livraisons.js
│   │   │   ├── alertes.js
│   │   │   └── rapports.js
│   │   │
│   │   └── images/
│   │       ├── logo.png
│   │       ├── banniere.jpg
│   │       └── captures/
│   │
│   └── composants/
│       ├── entete.html
│       ├── barre_laterale.html
│       └── pied_de_page.html
│
└── captures_projet/
    ├── capture_accueil.png
    ├── capture_connexion.png
    ├── capture_tableau_bord.png
    └── capture_mysql.png
