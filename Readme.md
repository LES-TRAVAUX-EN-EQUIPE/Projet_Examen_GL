# FuelTrack - Structure actuelle du projet

## Arborescence

```text
Examen_GL/
├── .gitignore
├── Readme.md
├── instructions_travail_equipe.md
├── rapport_travail_effectue.md
├── .postman/
│   └── resources.yaml
├── postman/
│   ├── collections/
│   ├── environments/
│   ├── flows/
│   ├── globals/
│   │   └── workspace.globals.yaml
│   ├── mocks/
│   └── specs/
├── backend/
│   ├── config/
│   │   └── connexion.php
│   ├── controleurs/
│   ├── middleware/
│   ├── modeles/
│   ├── routes/
│   ├── utilitaires/
│   └── public/
│       ├── index.php
│       └── api/
│           ├── index.php
│           ├── livraisons.php
│           └── vehicules.php
├── base_de_donnees/
│   ├── dictionnaire_donnees.md
│   ├── donnees_test/
│   │   └── jeu_donnees_initial.sql
│   └── schema_mysql/
│       ├── migration_ventes_station.sql
│       └── schema_application_carburant.sql
├── documentation/
│   ├── analyse_du_probleme.md
│   ├── besoins_fonctionnels.md
│   ├── besoins_non_fonctionnels.md
│   ├── cahier_des_charges.md
│   ├── regles_de_gestion.md
│   ├── plan_de_test.md
│   ├── manuel_utilisateur.md
│   ├── preuves_travail_equipe.md
│   └── DIAGRAMMES UML/
│       ├── DIAGRAMME D'ACTIVITE.png
│       ├── DIAGRAMME DE CAS D'UTILISATION.png
│       ├── DIAGRAMME DE DEPLOIEMENT.png
│       ├── DIAGRAMME DES CLASSES.png
│       └── DIAGRAMME DES SEQUENCES.png
├── frontend/
│   ├── index.html
│   ├── composants/
│   ├── pages/
│   └── ressources/
│       ├── css/
│       │   ├── accueil.css
│       │   ├── connexion.css
│       │   ├── formulaires.css
│       │   ├── style.css
│       │   ├── tableaux.css
│       │   └── tableau_de_bord.css
│       ├── images/
│       └── js/
│           ├── api_client.js
│           ├── auth_guard.js
│           ├── tableau_de_bord.js
│           ├── mouvements_stock.js
│           ├── ventes_station.js
│           └── ...
└── captures_projet/
```

## Notes de mise a jour

- Le dossier `backend/tests/` a ete supprime (fichiers de tests non necessaires a l'execution).
- Les documents de projet ont ete completes dans `documentation/`.
- La structure ci-dessus reflete l'etat actuel du depot.
