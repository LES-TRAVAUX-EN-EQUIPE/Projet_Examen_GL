# INTRODUCTION

Dans un contexte où la gestion efficace des ressources énergétiques est devenue un enjeu majeur, la traçabilité de la chaîne d’approvisionnement en carburant représente un défi important, notamment dans la Province du Nord-Kivu. Les problèmes liés au suivi des stocks, à la distribution, aux pertes et aux irrégularités nécessitent des solutions numériques modernes capables d’assurer transparence, efficacité et fiabilité.

Ce projet porte sur la conception et le développement d’une application de suivi de la chaîne d’approvisionnement en carburant. L’objectif principal est de mettre en place un système centralisé permettant de surveiller en temps réel les différentes étapes de la chaîne depuis l’importation ou la réception du carburant jusqu’à sa distribution finale.

L’application intègre plusieurs modules fonctionnels notamment une landing page d’accueil, des interfaces de gestion des données ainsi que des tableaux de bord permettant la visualisation et l’analyse des informations liées aux stocks et aux mouvements de carburant.

Ce fichier a pour but de documenter le projet, d’expliquer son architecture, ses fonctionnalités principales ainsi que les instructions nécessaires pour son installation et son utilisation.

## 1. Lading_page_01 - lading_page_005

Description de la Landing Page

La landing page constitue la page d’accueil principale de l’application de suivi de la chaîne d’approvisionnement en carburant. Elle a été conçue pour offrir une première présentation claire, professionnelle et intuitive du système aux utilisateurs.

# a. Structure générale

La page est organisée en deux grandes parties :

# . Barre de navigation (Navbar)

En haut de la page, on retrouve une barre de navigation fixe qui permet d’accéder rapidement aux différentes sections de la landing page. Elle est composée des éléments suivants :

- Accueil : ramène l’utilisateur en haut de la page (section principale)
- Fonctionnalités : permet de découvrir les principales fonctionnalités de l’application avec les avatages pour la province
- À propos : présente les objectifs et le contexte du projet
- Contact : fournit les informations pour joindre l’équipe ou l’administrateur
- Connexion : redirige directement vers la page de login

Tous ces boutons, à l’exception de Connexion utilisent un système de scroll fluide (smooth scroll) qui permet de naviguer automatiquement vers la section correspondante de la même page.

# . Contenu principal de la landing page

Sous la navbar, la page est divisée en plusieurs sections bien structurées :

- Une section d’introduction décrivant brièvement l’application et son objectif
- Une section présentant les fonctionnalités principales du système
- Une section À propos expliquant le contexte du projet et son importance dans la gestion de la chaîne d’approvisionnement en carburant
- Une section contact permettant aux utilisateurs d’obtenir plus d’informations ou de support

Chaque section est conçue pour être claire, lisible et accessible afin de faciliter la compréhension du système dès la première visite.

# Bouton de connexion

Le bouton Connexion est un élément distinct de la navigation. Contrairement aux autres liens, il ne fait pas de scroll. Lorsqu’il est cliqué, il redirige directement vers une page de login sécurisée où l’utilisateur doit s’authentifier pour accéder au système complet.

# Objectif de la landing page

L’objectif principal de cette landing page est de :

- Présenter le système de manière professionnelle
- Faciliter la navigation entre les sections
- Donner une vue globale du projet avant authentification
- Guider l’utilisateur vers la connexion pour accéder aux fonctionnalités avancées

# 2. Login_Authentification

# Description de la page de connexion

La page de connexion constitue le point d’accès sécurisé à l’application de suivi de la chaîne d’approvisionnement en carburant. Elle est conçue de manière simple, moderne et ergonomique afin de faciliter l’authentification des utilisateurs autorisés.

# Structure de la page

La page est divisée en deux parties principales :

# a. Partie gauche (Logo)

Sur la partie gauche de l’écran, on retrouve le logo de l’application. Ce logo joue un rôle visuel important car il permet d’identifier rapidement le système et de renforcer l’identité du projet.

# b. Partie droite (Formulaire de connexion)

La partie droite contient le formulaire de connexion structuré comme suit :

- Un titre Connexion indiquant clairement l’objectif de la page
- Une zone de texte pour l’adresse email
- Une zone de texte pour le mot de passe
- Un bouton principal Se connecter permettant de soumettre les identifiants
- Un bouton secondaire Retour à la page d’accueil permettant de revenir à la landing page sans authentification

# c. Fonctionnement du système d’authentification

Lorsque l’utilisateur saisit ses identifiants et clique sur le bouton Se connecter, le système effectue une vérification automatique :

- Si les identifiants sont corrects, l’utilisateur est authentifié et redirigé vers l’interface principale du système (dashboard ou tableau de bord).
- Si les identifiants sont incorrects, l’accès est refusé et un message d’erreur est affiché invitant l’utilisateur à vérifier ses informations et à réessayer.

# d. Rôle de la page de connexion

Cette page joue un rôle essentiel dans la sécurité du système car elle permet de :
- Contrôler l’accès aux données sensibles de la chaîne d’approvisionnement
- Garantir que seuls les utilisateurs autorisés puissent utiliser l’application
- Assurer une authentification fiable avant toute utilisation des fonctionnalités avancées

# 3. Dashboard Administrateur

# Description du Dashboard Administrateur (dashboard_admin_01 à dashboard_admin_04)

Après la vérification des identifiants sur la page de connexion, le système identifie le rôle de l’utilisateur. Si l’utilisateur est reconnu comme administrateur il est automatiquement redirigé vers une interface dédiée appelée Dashboard Administrateur.
Ce tableau de bord constitue le centre de contrôle principal de l’application et permet une gestion globale, en temps réel, de la chaîne d’approvisionnement en carburant.

# Organisation générale de l’interface

Le dashboard est structuré autour de trois grandes zones :

# a. Barre de navigation supérieure (Top Navbar)

Située en haut de l’écran, cette barre fournit des informations essentielles ainsi que des actions rapides :
- Un titre Espace Admin indiquant clairement le niveau d’accès
- Une icône de notification permettant d’alerter l’administrateur sur les événements importants (alertes, anomalies, etc.)
- Une icône de basculement Dark Mode permettant de changer le thème visuel de l’interface
- Une section profil utilisateur affichant : le nom (ex : Admin Système) et le rôle (Administrateur)
- Un bouton Se déconnecter pour quitter la session de manière sécurisée

# b. Barre latérale gauche (Sidebar)

La barre latérale constitue le menu principal de navigation. Elle est composée de boutons avec sous-menus (sous-boutons) permettant d’accéder aux différents modules du système.
Parmi les sections disponibles, on retrouve notamment :
- Tableau de bord
- Acteurs
- Infrastructure
- Operations
- Pilotage
Cette organisation hiérarchique permet une navigation fluide et structurée dans l’ensemble de l’application.

# c. Contenu principal du Dashboard

Le contenu central du dashboard (réparti sur dashboard_admin_01 à dashboard_admin_04) regroupe plusieurs composants analytiques et informatifs.

# - Panneaux indicateurs (Statistiques globales)

Une série de cartes (panels) affiche les principaux indicateurs du système :
Nombre d’utilisateurs
Nombre de fournisseurs
Nombre de dépôts
Nombre de stations
Nombre de véhicules
Nombre d’approvisionnements
Nombre de livraisons
Nombre d’alertes ouvertes
Nombre de dettes clients

a noter que Chaque panneau est cliquable et redirige l’administrateur vers la page correspondante pour plus de détails.

# - Graphiques d’analyse

Plusieurs graphiques permettent de visualiser les données de manière dynamique :

Répartition des stocks faibles : identification rapide des dépôts en difficulté
Livraisons par statut : (en cours / livrées)
Situation des dettes clients : suivi financier
Alertes par niveau : classification des urgences
Volumes approvisionnés : évolution des quantités reçues
Ces graphiques facilitent la prise de décision stratégique.

# c. Panneau d’actions rapides

Ce panel permet d’exécuter des actions importantes en un seul clic :
- Boutton Accéder directement à la page des dettes clients
- Bouton Réinitialiser les filtres pour actualiser les données affichées

# d. Suivi des stocks (Dépôts)

Un tableau présente les stocks critiques dans les dépôts avec les colonnes suivantes :
- Dépôt
- Type de carburant
- Quantité disponible
- Seuil minimum
Permet d’anticiper les ruptures de stock

# e. Livraisons récentes

Un tableau affiche les dernières opérations de livraison avec les colonnes suivantes :
- Référence
- Dépôt
- Station
- Quantité
- Statut (en cours ou livrée)
Offre une visibilité immédiate sur les activités logistiques

# f. Profil utilisateur actuel

Un encadré présente les informations de l’administrateur connecté :
- Nom
- Rôle
- Adresse email

# g. Derniers indicateurs

Cette section regroupe les données récentes par rapport au volume du type de carburant permettant à l’administrateur de rester informé en temps réel sur l’état global du carburant

# Objectif du Dashboard Administrateur

Le dashboard a pour objectif de :
- Centraliser toutes les informations importantes
- Faciliter la prise de décision grâce aux indicateurs visuels
- Améliorer la gestion des ressources (carburant, logistique, finances)
- Permettre un accès rapide aux différentes fonctionnalités du système
- Assurer un suivi efficace et sécurisé de toute la chaîne d’approvisionnement

## 4. Captures restantes - Administration (modules detaillees)

Les captures suivantes montrent les pages metier accessibles dans l'espace administrateur, au-dela du dashboard general.

- Dashboard_Admin_Alertes.png
Montre la page de suivi des alertes (stock faible, stock critique, anomalies). L'administrateur y consulte le niveau de gravite, le statut de traitement et la date de detection.

- Dashboard_Admin_Approvisionnement.png
Presente la gestion des approvisionnements carburant: enregistrement des receptions, quantites, couts unitaires, reference d'operation et statut.

- Dashboard_Admin_Clients.png
Affiche le registre des clients (identite, contacts, statut), utile pour la tracabilite des ventes station et le suivi commercial.

- Dashboard_Admin_Depots.png
Montre la liste des depots avec leurs informations principales (code, localisation, capacite, responsable, statut).

- Dashboard_Admin_Depots_suite.png
Capture complementaire du module depots (suite des donnees, actions CRUD et gestion detaillee des enregistrements).

- Dashboard_Admin_Dettes.png
Presente le suivi des dettes clients: montant du reste a payer, statut de remboursement et historique associe aux ventes.

- Dashboard_Admin_Fournisseurs.png
Montre la gestion des fournisseurs (identification, type, contact, statut), indispensable pour la chaine d'approvisionnement.

- Dashboard_Admin_Livraison.png
Affiche les livraisons entre depots et stations: references, vehicules, quantites, dates de depart/arrivee et statut logistique.

- Dashboard_Admin_MouvementStock.png
Montre la table des mouvements de stock (entree depot, sortie depot, entree station, sortie station) avec references et quantites.

- Dashboard_Admin_MouvementStock_suite.png
Capture de continuation du meme module pour illustrer d'autres mouvements et la consultation de l'historique complet.

- Dashboard_Admin_Parametres.png
Presente la page de parametres du compte/admin (profil, informations personnelles et options de configuration utilisateur).

- Dashboard_Admin_Parametres_suite.png
Montre la suite des parametres (sections additionnelles de personnalisation, mises a jour du compte et preferences).

- Dashboard_Admin_Rapport.png
Affiche la page de rapports et statistiques globales, avec syntheses des approvisionnements, livraisons et alertes.

- Dashboard_Admin_Station.png
Montre la gestion des stations-service (code station, localisation, capacite, responsable et statut).

- Dashboard_Admin_Station_suite.png
Capture complementaire du module stations (suite de la liste et operations de gestion).

- Dashboard_Admin_Tarif_station.png
Presente la configuration des prix/tarifs carburant par station et par type de carburant.

- Dashboard_Admin_Taux_change.png
Montre la gestion des taux de change (USD/CDF) appliques par station pour les ventes et calculs financiers.

- Dashboard_Admin_TypeCarburan.png
Affiche la gestion des types de carburant (designation, unite, description), base de reference pour tous les modules metier.

- Dashboard_Admin_Utilisateurs.png
Montre l'administration des utilisateurs (creation, roles, statut actif/inactif, edition des comptes).

- Dashboard_Admin_Vehicules.png
Presente la gestion du parc vehicules (immatriculation, capacite, chauffeur, statut disponible/en mission).

- Dashboard_Admin_Vente.png
Affiche la page de ventes station avec enregistrement des transactions, client, produit et montant.

- Dashboard_Admin_Vente_suite_1.png
Capture de suite illustrant des details supplementaires de ventes (historique, filtres, informations financieres).

- Dashboard_Admin_Vente_suite_2.png
Deuxieme suite du module ventes, mettant en evidence la consultation approfondie des operations et paiements.

## 5. Captures restantes - Gestionnaire de stock

Ces captures presentent les fonctionnalites visibles pour le role Gestionnaire de stock.

- Dashboard_GestionnaireStock.png
Montre le dashboard principal du gestionnaire, centre sur les indicateurs de stock et de suivi operationnel.

- Dashboard_GestionnaireStock_Alertes.png
Affiche les alertes de stock a traiter en priorite pour anticiper les ruptures dans depots et stations.

- Dashboard_GestionnaireStock_Approvisionnement.png
Presente le suivi des approvisionnements, notamment les receptions et l'impact sur les quantites disponibles.

- Dashboard_GestionnaireStock_Depots.png
Montre la consultation et la gestion des depots sous l'angle stock (capacites, niveaux, organisation).

- Dashboard_GestionnaireStock_Dettes.png
Affiche la vue des dettes clients pour relier la situation financiere aux operations de distribution.

- Dashboard_GestionnaireStock_Fournisseur.png
Montre la consultation des fournisseurs et des informations liees a la disponibilite des carburants.

- Dashboard_GestionnaireStock_MouvementStock.png
Presente l'historique des mouvements de stock, outil principal de controle et de reconciliation.

- Dashboard_GestionnaireStock_Parametres.png
Affiche les parametres du compte gestionnaire (profil, donnees utilisateur, reglages).

- Dashboard_GestionnaireStock-Rapports.png
Montre la page de rapports orientee stock: syntheses par produit, volume et evolution des operations.

- Dashboard_GestionnaireStock-TarifStation.png
Affiche la consultation des tarifs de vente par station, utile pour la coherence entre stock et commercial.

- Dashboard_GestionnaireStock_Taux_change.png
Montre les taux de change utilises dans les calculs de prix et le suivi des ventes.

- Dashboard_GestionnaireStock_TypeCarburant.png
Affiche les types de carburant geres dans le systeme avec leurs references metier.

- Dashboard_GestionnaireStock_VenteStation.png
Presente les ventes station observees par le gestionnaire pour relier sorties de stock et transactions.

- Dashboard_GestionnaireStocke_Clients.png
Montre la page clients (orthographe du fichier conservee) pour la consultation des informations commerciales.

## 6. Captures restantes - Responsable logistique

Ces captures montrent le perimetre du role Responsable logistique, axe sur transport et distribution.

- Dashboard_Responsable_logistique.png
Dashboard principal du responsable logistique avec indicateurs de livraisons, vehicules et flux.

- Dashboard_Responsable_logistique_Alertes.png
Vue des alertes impactant les operations logistiques (retards, risques de rupture, anomalies).

- Dashboard_Responsable_logistique_Clients.png
Consultation des clients pour coordonner la distribution et le suivi de service.

- Dashboard_Responsable_logistique_Depots.png
Vue depots pour planifier les sorties et optimiser les trajets de livraison.

- Dashboard_Responsable_logistique_Dettes.png
Suivi des dettes en lien avec la logistique commerciale et les livraisons effectuees.

- Dashboard_Responsable_logistique_Livraison.png
Module central du role: planification, execution et suivi des livraisons avec statut.

- Dashboard_Responsable_logistique_Paramettres.png
Page parametres du responsable logistique (nom du fichier conserve avec sa graphie actuelle).

- Dashboard_Responsable_logistique_Rapports.png
Rapports logistiques: performances de livraison, volumes transportes et tendances.

- Dashboard_Responsable_logistique_Station.png
Consultation des stations desservies pour organiser les affectations de livraison.

- Dashboard_Responsable_logistique_TarifStation.png
Vue des tarifs station utiles pour la coordination entre service logistique et vente.

- Dashboard_Responsable_logistique_Taux_change.png
Consultation des taux de change appliques aux transactions associees aux livraisons.

- Dashboard_Responsable_logistique_Vehicules.png
Gestion/consultation des vehicules disponibles pour les missions logistiques.

## 7. Captures restantes - Responsable station

Ces captures presentent l'espace du Responsable de station, concentre sur exploitation locale.

- Dashboard_Responsable_station.png
Dashboard principal de station avec indicateurs de vente, stock local et alertes courantes.

- Dashboard_Responsable_station_suite.png
Suite de la vue dashboard station (informations et widgets complementaires).

- Dashboard_Responsable_station_Alertes.png
Alertes de la station (seuils critiques, anomalies locales) pour intervention rapide.

- Dashboard_Responsable_station_clients.png
Gestion/consultation des clients de la station et des donnees de contact.

- Dashboard_Responsable_station_Dettes.png
Suivi des dettes clients au niveau station pour le recouvrement et la tresorerie.

- Dashboard_Responsable_station_Parametres.png
Parametres du compte responsable station.

- Dashboard_Responsable_station_Rapports.png
Rapports de station (ventes, volumes, evolution et tendances locales).

- Dashboard_Responsable_station_Station.png
Consultation des informations de la station et donnees operationnelles associees.

- Dashboard_Responsable_station_Tarif.png
Gestion/consultation des tarifs carburant appliques dans la station.

- Dashboard_Responsable_station_Taux_change.png
Affiche les taux de change utilises pour les ventes en monnaies differentes.

- Dashboard_Responsable_Vente.png
Module de vente station (saisie de transaction, client, produit, montant, paiement).

## 8. Captures restantes - Responsable livraison

- Dashboard_Responsable_Livraison.png
Montre l'interface dediee au suivi des livraisons (etat de mission, progression, validation).

- Dashboard_Responsable_Livraison_Vente.png
Capture mettant en relation livraisons et ventes, utile pour verifier la coherence operation-finance.

## 9. Captures restantes - Superviseur

Ces captures representent les vues de controle du role Superviseur, oriente audit et pilotage.

- Dashboard_Superviseur.png
Dashboard global du superviseur avec indicateurs de suivi transversal.

- Dashboard_Superviseur_Alertes.png
Vue des alertes systeme pour supervision des incidents et priorisation des actions.

- Dashboard_Superviseur_Dettes.png
Suivi des dettes pour controle de performance financiere et risque client.

- Dashboard_Superviseur_Parametres.png
Page parametres du compte superviseur.

- Dashboard_Superviseur_Rapport.png
Espace rapports pour lecture decisionnelle et suivi des performances globales.

- Dashboard_Superviseur_vente.png
Vue de supervision des ventes pour verifier volumes, montants et tendances.

## 10. Conclusion des captures restantes

Les captures restantes confirment que l'application couvre:

- Une separation claire des interfaces par role (Administrateur, Gestionnaire de stock, Responsable logistique, Responsable station, Responsable livraison, Superviseur).
- Une couverture complete des modules metier (utilisateurs, fournisseurs, depots, stations, vehicules, approvisionnements, livraisons, mouvements de stock, ventes, dettes, alertes, rapports, parametres).
- Une logique de tracabilite de bout en bout, depuis l'entree en stock jusqu'a la vente finale.
