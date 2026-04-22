# Rapport detaille du travail effectue

## 1. Contexte et objectif du projet

Le projet FuelTrack a ete realise pour digitaliser le suivi de la chaine d'approvisionnement en carburant dans la province du Nord-Kivu.
L'objectif principal etait de construire une application web complete permettant:

- la gestion des acteurs (utilisateurs, fournisseurs, clients)
- la gestion des infrastructures (depots, stations, vehicules)
- la gestion operationnelle (approvisionnements, livraisons, mouvements de stock, ventes)
- le suivi financier (dettes clients)
- le pilotage (alertes, tableaux de bord, rapports)

## 2. Demarche de travail adoptee

Le travail a ete organise par issues GitHub assignees par module.
La methode appliquee a ete la suivante:

1. Decoupage du besoin en lots fonctionnels
2. Attribution de chaque lot a un membre de l'equipe
3. Developpement frontend/backend/BD
4. Integration progressive de tous les modules
5. Verification fonctionnelle et consolidation documentaire

Cette approche a facilite la tracabilite des contributions et la coordination entre membres.

## 3. Etat reel de l'architecture implementee

### 3.1 Stack technique

- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: PHP 8.x
- Base de donnees: MySQL/MariaDB
- Communication: API REST JSON

### 3.2 Organisation du code

- Frontend par pages metier dans `frontend/pages/`
- Scripts metier dans `frontend/ressources/js/`
- Backend expose via `backend/public/api/index.php`
- Schema et migrations dans `base_de_donnees/schema_mysql/`
- Documentation projet dans `documentation/`

### 3.3 Observation technique importante

L'architecture logique prevoit des dossiers `controleurs`, `modeles`, `middleware`, `routes` et `utilitaires`.
Toutefois, la logique metier active est majoritairement centralisee dans `backend/public/api/index.php`.
Plusieurs fichiers PHP de structure sont encore vides (controleurs, modeles, middleware et routes), ce qui montre une implementation fonctionnelle valide mais encore peu decouplee.

## 4. Travaux realises cote base de donnees

Le schema principal couvre l'ensemble du flux metier:

- referentiels: `roles`, `utilisateurs`, `fournisseurs`, `clients`, `types_carburant`, `vehicules`, `depots`, `stations`
- operations: `approvisionnements`, `livraisons`, `mouvements_stock`, `ventes_station`
- stock et pilotage: `stocks_depots`, `stocks_stations`, `alertes`, `prix_carburants`, `taux_change_stations`

Points realises:

- definition des cles primaires et etrangeres
- contraintes d'unicite (codes, references)
- colonnes de suivi temporel
- index de performance sur dates de mouvements
- script de migration complementaire pour les ventes station
- jeu de donnees initial pour tests

## 5. Travaux realises cote backend

### 5.1 API CRUD generique

Une API generique a ete mise en place avec:

- filtrage des champs autorises par entite
- verification des champs obligatoires
- gestion standard des methodes `GET`, `POST`, `PUT/PATCH`, `DELETE`
- normalisation des reponses JSON (succes/erreur)

### 5.2 Authentification et session

Fonctionnalites implementees:

- endpoint `auth` pour connexion par email/mot de passe
- verification mot de passe (hash + compatibilite)
- retour des informations utilisateur sans mot de passe
- exploitation des en-tetes `X-Role-Id` et `X-User-Id` pour autorisation

### 5.3 Permissions par role

Une matrice de permissions centralisee controle les droits lecture/ecriture par entite:

- administrateur (acces large)
- gestionnaire stock
- responsable logistique
- responsable station
- superviseur

Cela permet un controle fin des actions selon le profil.

### 5.4 Synchronisation metier des stocks

Des regles automatiques ont ete implementees pour garder la coherence:

- approvisionnement `recu` -> entree depot + mouvement
- livraison `livree` -> sortie depot + entree station + mouvements
- vente station -> sortie station + mouvement
- ajustements manuels depot/station avec controle de non-negativite

Les operations critiques sont encapsulees en transactions afin de limiter les incoherences.

### 5.5 Alertes automatiques

Les alertes stock faible/critique sont gerees automatiquement:

- creation ou mise a jour selon seuils
- resolution automatique si le stock remonte
- blocage des modifications manuelles directes des alertes

### 5.6 Ventes station et dettes

Le module de vente integre:

- calcul prix USD/CDF selon taux actif
- calcul montant brut/net
- gestion des paiements partiels
- calcul du restant (dette)
- creation/mise a jour client liee a la vente

### 5.7 Dashboard et rapports

Deux endpoints specifiques consolidant les donnees ont ete finalises:

- `dashboard`: compteurs, stocks critiques, livraisons recentes
- `rapports`: agregats approvisionnements, livraisons, alertes

## 6. Travaux realises cote frontend

### 6.1 Landing page et connexion

- page d'accueil presentant le projet
- navigation vers login
- formulaire de connexion avec feedback utilisateur

### 6.2 Client API et garde d'acces

- client HTTP central (`api_client.js`)
- injection automatique des en-tetes role/utilisateur
- messages d'erreur explicites en cas de backend indisponible
- garde frontend des pages et des menus par role (`auth_guard.js`)

### 6.3 Moteur CRUD mutualise

Un composant JS reusable (`crud_page.js`) a ete construit pour:

- generer dynamiquement formulaires et tableaux
- charger les listes de reference (select)
- gerer creation, edition, suppression
- supporter mode ecriture/lecture selon permissions
- afficher confirmations et notifications homogenes

### 6.4 Pages metier implementees

Les modules suivants sont couverts par pages HTML + JS dedies:

- utilisateurs
- fournisseurs
- depots
- stations
- vehicules
- types carburant
- approvisionnements
- livraisons
- mouvements stock
- alertes
- ventes station
- dettes
- rapports
- parametres
- tableau de bord

### 6.5 Tableau de bord visuel

Le dashboard inclut:

- KPI cliquables
- graphiques (stocks, livraisons, alertes, approvisionnements, dettes)
- filtres interactifs
- cartes profil et indicateurs recents
- actions rapides (dettes, reset filtres)

## 7. Repartition du travail par equipe (basee sur les issues)

La repartition officiellement suivie est:

- #18 Integration frontend-backend: thibaut-tbc-bujiriri
- #17 Documentation + tests + preuves: adoko2021
- #16 UML + validation BD: Amani-S21
- #15 Gestion automatique stock/mouvements: thibaut-tbc-bujiriri
- #14 Module livraisons: Amani-S21
- #13 Module approvisionnements: thibaut-tbc-bujiriri
- #12 Module vehicules: Amani-S21
- #11 Module stations-service: thibaut-tbc-bujiriri
- #10 Module depots: Aminazabona
- #9 Module fournisseurs: Aganzeshamavu
- #8 Tableau de bord principal: Aminazabona
- #7 Authentification utilisateur: Aganzeshamavu

## 8. Resultats obtenus

Le projet livre a ce stade:

- une application web fonctionnelle de bout en bout
- une couverture large des besoins metier definis dans le cahier des charges
- une gestion rolee coherente entre frontend et backend
- une automatisation effective de la coherence stock/mouvements/alertes
- une documentation globale et des captures d'illustration par role

## 9. Difficultes rencontrees et solutions appliquees

### 9.1 Cohesion entre flux metier

Probleme:
garantir la coherence entre approvisionnements, livraisons, ventes et stocks.

Solution:

- fonctions de synchronisation metier centralisees
- transactions SQL sur operations critiques
- generation systematique des mouvements de stock

### 9.2 Gestion differenciee par role

Probleme:
eviter les actions non autorisees sans complexifier l'interface.

Solution:

- matrice backend de permissions
- filtrage frontend des pages et boutons d'action

### 9.3 Suivi des dettes clients

Probleme:
suivre correctement les paiements partiels.

Solution:

- calcul automatique du montant restant
- modal de paiement et controle de plafond de paiement

## 10. Limites actuelles constatees

1. Centralisation excessive de la logique backend dans un seul fichier API.
2. Plusieurs fichiers de l'architecture cible sont encore vides.
3. Authentification basee sur en-tetes de session frontend (pas de token signe/JWT).
4. Politique CORS permissive (`Access-Control-Allow-Origin: *`) a durcir en production.
5. Quelques traces de qualite de code a ameliorer (messages mal encodes, commentaires de type "A CORRIGER").

## 11. Recommandations de consolidation

### Court terme

1. Refactoriser `backend/public/api/index.php` vers des controleurs/services par domaine.
2. Finaliser les fichiers `controleurs`, `modeles`, `middleware` et `routes` pour aligner structure et implementation.
3. Completer `preuves_travail_equipe.md` avec liens commits/PR/captures par issue.
4. Produire un tableau de tests executes avec statut `OK/KO` pour la soutenance.

### Moyen terme

1. Introduire un mecanisme de token (JWT ou session backend stricte).
2. Ajouter une vraie suite de tests automatises (API + non-regression role).
3. Mettre en place des logs metier et audit plus detailles.
4. Renforcer les controles de validation metier complexes (regles de dates, limites de capacite).

## 12. Conclusion generale

Le travail realise montre une application globalement operationnelle et coherente avec les objectifs pedagogiques et fonctionnels du projet.

Les modules principaux sont implementes, l'integration frontend-backend est effective, la base de donnees couvre les flux essentiels et la gouvernance par roles est en place.

La priorite restante est surtout architecturale (refactorisation backend, industrialisation des tests et durcissement securite) afin de transformer une solution fonctionnelle en solution pleinement robuste et maintenable.

