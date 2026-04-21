# Analyse du problème

## 1. Contexte général

FuelTrack est une application web de gestion des carburants destinée aux acteurs de la chaîne logistique (administrateur, gestionnaire de stock, responsable logistique, responsable station, superviseur). L'application couvre les processus principaux suivants:

- gestion des référentiels (utilisateurs, fournisseurs, dépôts, stations, types de carburant, véhicules)
- gestion des flux physiques (approvisionnements, livraisons, mouvements de stock)
- gestion commerciale en station (ventes, dettes clients, paiements)
- suivi opérationnel (tableau de bord, alertes, rapports)

Le besoin métier est d'assurer une maîtrise en temps réel des stocks et des opérations, avec des décisions rapides et traçables.

## 2. Problématique principale

Avant la mise en place d'un système intégré comme FuelTrack, la gestion du carburant repose souvent sur des pratiques manuelles ou semi-numériques:

- enregistrements dispersés (cahiers, fichiers Excel, messages informels)
- absence de synchronisation entre dépôt, transport et station
- faible visibilité sur les stocks disponibles et les seuils critiques
- suivi incomplet des ventes et des dettes clients

Cette situation crée un manque de fiabilité des données, des retards de décision, et une augmentation des erreurs opérationnelles.

## 3. Causes du problème

Les causes majeures identifiées sont:

1. Absence de système centralisé
Les informations sont stockées à différents endroits sans base de données unique.

2. Processus non standardisés
Les équipes appliquent des méthodes différentes pour les mêmes opérations (saisie, validation, correction).

3. Contrôle insuffisant des accès
Les rôles et responsabilités ne sont pas toujours traduits en droits informatiques clairs.

4. Faible automatisation des contrôles
Les alertes de seuil et les vérifications de cohérence sont traitées tardivement ou manuellement.

5. Difficulté de traçabilité
Il est compliqué de reconstituer l'historique exact d'une opération (qui, quand, quoi, pourquoi).

## 4. Manifestations observées

Les symptômes opérationnels rencontrés sont:

- ruptures ou quasi-ruptures de stock non anticipées
- écarts entre stock théorique et stock réel
- retards dans les livraisons et tensions entre dépôt et station
- difficultés à identifier les ventes à crédit non soldées
- production de rapports lente et parfois incohérente
- surcharge du personnel par des tâches de correction de données

## 5. Impacts métier

### 5.1 Impacts opérationnels

- baisse de continuité de service dans les stations
- mauvaise planification des approvisionnements et des transferts
- perte de temps dans la recherche d'information fiable

### 5.2 Impacts financiers

- pertes liées aux erreurs de stock et aux retards
- immobilisation de trésorerie par des dettes mal suivies
- difficulté à mesurer correctement la performance des ventes

### 5.3 Impacts managériaux

- faible confiance dans les indicateurs
- arbitrages difficiles pour les responsables
- manque de visibilité consolidée sur l'ensemble du réseau

## 6. Besoin à satisfaire

Le besoin central est de disposer d'une plateforme unifiée, sécurisée et orientée traçabilité, capable de:

- enregistrer et historiser toutes les opérations clés
- refléter automatiquement l'état réel des stocks
- générer des alertes pertinentes au bon moment
- limiter les actions selon le rôle de chaque utilisateur
- produire des vues décisionnelles fiables (tableau de bord, rapports)

## 7. Objectifs de la solution

La solution FuelTrack vise les objectifs suivants:

1. Centraliser les données de gestion carburant dans une base unique.
2. Fiabiliser les opérations de stock (entrées, sorties, transferts, ventes).
3. Automatiser la détection des situations critiques via les alertes de seuil.
4. Renforcer la gouvernance par un contrôle d'accès basé sur les rôles.
5. Améliorer la réactivité décisionnelle grâce à des indicateurs en temps réel.

## 8. Périmètre fonctionnel de l'analyse

Le périmètre retenu couvre:

- gestion des entités de référence
- approvisionnements, livraisons, mouvements de stock
- ventes station et gestion des dettes
- alertes de stock (création et suivi automatique)
- reporting opérationnel

Hors périmètre de cette analyse:

- intégration comptable avancée (ERP)
- optimisation prédictive par IA/ML
- gestion RH complète des équipes

## 9. Contraintes identifiées

- environnement multi-rôles avec droits différenciés
- cohérence entre données métier et affichage interface
- disponibilité acceptable en contexte de connectivité variable
- nécessité d'impression et d'export pour les besoins terrain
- maintenabilité du code backend/frontend sur la durée

## 10. Risques à maîtriser

1. Risque de mauvaise qualité des données initiales
Une migration ou saisie initiale incomplète peut fausser les indicateurs.

2. Risque d'appropriation utilisateur
Sans formation minimale, les erreurs de manipulation persistent.

3. Risque de divergence règle métier / implémentation
Si les règles de gestion ne sont pas strictement alignées avec le code, les comportements inattendus augmentent.

4. Risque de surcharge par fonctionnalités non prioritaires
Ajouter trop tôt des fonctions annexes peut retarder la stabilisation du coeur métier.

## 11. Critères de succès

La problématique est considérée comme correctement traitée si:

- les stocks affichés reflètent les opérations validées sans correction manuelle récurrente
- les alertes de stock se déclenchent et se résolvent automatiquement selon les seuils
- les utilisateurs accèdent uniquement aux fonctions autorisées par leur rôle
- les ventes et dettes sont consultables et auditables rapidement
- les rapports clés sont obtenus sans retraitement manuel important

## 12. Conclusion

Le problème initial est un déficit de contrôle, de visibilité et de cohérence dans la gestion du carburant. L'approche FuelTrack répond à cette problématique par la centralisation des données, l'automatisation des contrôles critiques et la structuration des responsabilités. Cette analyse justifie la mise en oeuvre d'une solution intégrée orientée fiabilité, traçabilité et pilotage opérationnel.
