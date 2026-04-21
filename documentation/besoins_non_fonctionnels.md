# Besoins non fonctionnels

## 1. Objectif

Ce document définit les contraintes de qualité de l'application FuelTrack (performance, sécurité, fiabilité, maintenabilité, ergonomie, etc.).

## 2. Exigences de performance

### BNF-01 Temps de réponse

- Les opérations de consultation (GET) doivent répondre en moins de 3 secondes dans des conditions nominales.
- Les opérations de création/mise à jour critiques (ventes, livraisons, approvisionnements) doivent répondre en moins de 5 secondes.

### BNF-02 Concurrence et cohérence

- Les opérations affectant les stocks doivent être exécutées de manière transactionnelle.
- Le système doit éviter les états intermédiaires incohérents en cas d'erreur.

## 3. Exigences de sécurité

### BNF-03 Contrôle d'accès

- L'accès aux entités doit être contrôlé par rôle.
- Toute tentative d'accès non autorisé doit être rejetée (code HTTP adapté + message explicite).

### BNF-04 Protection des données sensibles

- Les mots de passe doivent être stockés sous forme hashée.
- Les mots de passe ne doivent jamais être exposés dans les réponses API.

### BNF-05 Validation des entrées

- Le backend doit valider les champs obligatoires et les formats (dates, numériques, devise, etc.).
- Les requêtes invalides doivent être rejetées avec des codes d'erreur structurés.

## 4. Exigences de fiabilité

### BNF-06 Intégrité des données

- Les contraintes de base de données (PK, FK, uniques) doivent garantir l'intégrité référentielle.
- Les flux métier stock/dette/alerte doivent rester cohérents après chaque transaction.

### BNF-07 Résilience applicative

- En cas d'échec d'une opération transactionnelle, l'ensemble de la transaction doit être annulé.
- Le système doit retourner des messages d'erreur exploitables pour le diagnostic.

## 5. Exigences d'ergonomie et UX

### BNF-08 Interface utilisateur

- L'interface doit rester homogène (palette, composants, navigation latérale, topbar).
- Le système doit proposer des messages de feedback utilisateur (succès/erreur) clairs.

### BNF-09 Adaptation aux rôles

- Les pages doivent s'adapter automatiquement au profil (`lecture` ou `lecture-écriture`).
- Les actions non autorisées ne doivent pas apparaître dans l'interface.

### BNF-10 Impression

- Le rendu impression doit être lisible, sans éléments parasites d'interface.
- Les tableaux imprimés doivent éviter les colonnes coupées et barres de défilement.

## 6. Exigences de compatibilité

### BNF-11 Environnement d'exécution

- Backend compatible PHP 8.x et MySQL/MariaDB.
- Frontend compatible navigateurs modernes (Chrome, Edge, Firefox).

### BNF-12 API

- Communication frontend/backend via API REST JSON.
- Support CORS pour développement local (`OPTIONS` preflight).

## 7. Exigences de maintenabilité

### BNF-13 Structure du code

- Le code doit rester organisé par modules (pages JS, CSS, endpoints API).
- Les changements métier doivent être centralisés autant que possible pour limiter la duplication.

### BNF-14 Évolutivité

- Le système doit permettre l'ajout de nouvelles entités/modules sans refonte globale.
- Les règles de rôles doivent être extensibles à de nouveaux profils.

## 8. Exigences de traçabilité

### BNF-15 Historisation opérationnelle

- Les mouvements de stock doivent être historisés avec référence, date, type, quantité, auteur.
- Les ventes doivent conserver les montants bruts, nets, payés et restants.

### BNF-16 Audit métier

- Les données doivent permettre de reconstruire le parcours d'une opération (approvisionnement -> stock -> livraison -> vente -> dette).

## 9. Exigences de disponibilité et exploitation

### BNF-17 Disponibilité

- Le système doit fonctionner en continu pendant les heures d'exploitation.
- Les redémarrages backend ne doivent pas nécessiter de reconfiguration lourde.

### BNF-18 Administration technique

- La configuration doit rester simple pour un déploiement local/institutionnel.
- Les erreurs backend doivent être détectables rapidement via logs et messages API.

## 10. Critères de validation non fonctionnelle

- Les tests de parcours critiques s'exécutent sans erreur bloquante.
- Les temps de réponse restent acceptables sur les volumes de test.
- Les droits par rôle sont respectés sur API et interface.
- L'impression des listes/fiches produit un document exploitable.
