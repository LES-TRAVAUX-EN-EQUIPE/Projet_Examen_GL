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
