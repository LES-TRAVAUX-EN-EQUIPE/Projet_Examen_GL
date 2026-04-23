<img width="1366" height="768" alt="issue_close_1" src="https://github.com/user-attachments/assets/d98730fe-2c44-45de-96f5-13aed46e3901" />
<img width="1366" height="768" alt="issue_close" src="https://github.com/user-attachments/assets/6d4ba5e9-2cd7-4175-af89-696e70d9dd39" />
<img width="1365" height="767" alt="issue_02" src="https://github.com/user-attachments/assets/76ed363e-5b2d-4b9d-b5ad-77680b226d17" />
<img width="1365" height="767" alt="issue_01" src="https://github.com/user-attachments/assets/659fec9a-f64c-419a-abfd-95d4d6774c27" />
<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/6bb7e33a-ddfc-4497-82fa-db1ebe5734b4" />
<img width="1365" height="767" alt="invitation_prof" src="https://github.com/user-attachments/assets/eef7fc28-3c39-4d1f-989d-8a4330769cc2" />
<img width="1365" height="767" alt="invitation_owner" src="https://github.com/user-attachments/assets/2a90bbf3-cbfa-4e6e-bfd8-fd73b6841c58" />
<img width="1365" height="721" alt="invitation_envoyee" src="https://github.com/user-attachments/assets/210c9189-4b60-469e-9798-0b5023c63507" />

# Instructions de travail en equipe - Projet Examen GL (FuelTrack)

## 1. Objectif du document

Ce document explique clairement comment notre equipe a organise et execute le travail sur GitHub.
La methode principale a ete le decoupage du projet en issues, avec une responsabilite explicite par membre et une integration progressive Frontend + Backend + Base de donnees + Documentation.

## 2. Methode de travail adoptee

Nous avons procede en 6 etapes:

1. Decoupage fonctionnel du projet en modules coherents.
2. Creation d'issues GitHub pour chaque module ou lot de livrables.
3. Attribution de chaque issue a un membre de l'equipe.
4. Developpement du module assigne avec commits reguliers.
5. Integration continue dans une architecture commune.
6. Verification collective (tests manuels, controle des flux, coherence des pages et API).

## 3. Issues creees et repartition par membre

Les issues ci-dessous sont celles ouvertes pour piloter l'execution du projet.

| Issue | Intitule | Type | Membre associe |
|---|---|---|---|
| #18 | Integration frontend-backend des formulaires et modules | Front + Back | thibaut-tbc-bujiriri |
| #17 | Documentation complete + tests + preuves equipe | Documentation + Tests | adoko2021 |
| #16 | Diagrammes UML + validation base de donnees | UML + BD | Amani-S21 |
| #15 | Gestion automatique des stocks et mouvements | Back | thibaut-tbc-bujiriri |
| #14 | Module livraisons (transport) | Front + Back | Amani-S21 |
| #13 | Module approvisionnement carburant | Front + Back | thibaut-tbc-bujiriri |
| #12 | Module vehicules (transport) | Front + Back | Amani-S21 |
| #11 | Module stations-service | Front + Back | thibaut-tbc-bujiriri |
| #10 | Module depots (CRUD + affichage) | Front + Back | Aminazabona |
| #9 | Module fournisseurs (CRUD complet) | Front + Back | Aganzeshamavu |
| #8 | Creation du tableau de bord principal | Front | Aminazabona |
| #7 | Authentification utilisateur (login + session) | Front + Back | Aganzeshamavu |

Note: cette repartition reprend la liste fournie dans le suivi GitHub de l'equipe.

## 4. Analyse du projet et coherence avec les issues

### 4.1 Architecture globale observee

- Backend PHP structure (config, modeles, controleurs, middleware, routes, public/api).
- API centrale operationnelle via backend/public/api/index.php.
- Frontend HTML/CSS/JS par page metier avec scripts dedies dans frontend/ressources/js.
- Base MySQL definie dans base_de_donnees/schema_mysql/schema_application_carburant.sql.
- Documentation fonctionnelle et technique dans documentation/.

### 4.2 Point technique important identifie

Une grande partie de la logique metier active est actuellement concentree dans backend/public/api/index.php:

- Authentification (entity auth)
- Dashboard (entity dashboard)
- Rapports (entity rapports)
- Approvisionnements et livraisons avec impact automatique sur stocks
- Alertes automatiques selon seuils de stock
- Ajustements de stock depots/stations
- Gestion des permissions par role via en-tetes X-Role-Id et X-User-Id

Cela confirme directement les issues #15, #14, #13, #11, #8 et #7 en termes d'implementation fonctionnelle.

### 4.3 Correspondance Frontend observee

Les scripts frontend valident l'integration des modules assignees:

- approvisionnements.js -> CRUD approvisionnements.
- livraisons.js -> CRUD livraisons.
- depots.js -> CRUD depots + ajustements de stock depot.
- stations.js -> CRUD stations + ajustements de stock station.
- vehicules.js -> CRUD vehicules.
- connexion.js + api_client.js -> login, session, appels API.
- tableau_de_bord.js -> KPI, tableaux et graphiques du dashboard

Cette organisation est coherente avec la logique issue-based adoptee par l'equipe.

## 5. Procedure de collaboration suivie

Pour chaque issue, l'equipe a applique le flux suivant:

1. Clarification du besoin et des criteres de sortie
2. Identification des fichiers frontend/backend/BD impactes
3. Implementation du module par le membre assigne
4. Tests manuels des cas principaux (creation, lecture, modification, suppression, erreurs).
5. Verification croisee par un autre membre de l'equipe
6. Integration dans le depot principal apres validation

## 6. Regles d'organisation d'equipe

- Une issue = un perimetre clair et un responsable principal.
- Les modifications transversales (integration Front + Back) sont synchronisees avant validation finale.
- Les informations de role et session sont centralisees pour harmoniser les droits d'acces.
- Les references metier (approvisionnement, livraison, mouvement) sont tracees pour assurer l'auditabilite.
- La documentation est mise a jour en parallele des fonctionnalites, pas uniquement a la fin.

## 7. Resultat de la demarche

Cette methode basee sur des issues assignees a permis:

- Une repartition claire des responsabilites.
- Une couverture des modules critiques du projet FuelTrack.
- Une integration progressive entre interface, API et base de donnees.
- Une meilleure tracabilite du travail d'equipe pour l'evaluation academique.

## 8. Recommandations finales pour cloturer proprement

Ajouter un court bilan par membre dans rapport_travail_effectue.md pour faciliter la defense du projet.

