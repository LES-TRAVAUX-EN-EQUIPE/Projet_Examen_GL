# Manuel utilisateur

## 1. Introduction

Ce manuel explique l'utilisation de FuelTrack pour les opérations quotidiennes de gestion carburant.

## 2. Prérequis

- Navigateur moderne (Chrome, Edge, Firefox)
- Accès au frontend de l'application
- Compte utilisateur actif avec rôle attribué

## 3. Connexion

1. Ouvrir la page de connexion.
2. Saisir email et mot de passe.
3. Cliquer sur Se connecter.
4. En cas d'échec, vérifier les identifiants ou le statut du compte.

## 4. Navigation générale

- La barre latérale donne accès aux modules selon le rôle.
- La topbar affiche les notifications et le bouton d'impression.
- Le badge notification indique le nombre d'alertes nouvelles.

## 5. Modules principaux

### 5.1 Tableau de bord

- Consulter les compteurs clés.
- Identifier rapidement les stocks faibles et livraisons récentes.

### 5.2 Référentiels

Modules: utilisateurs, fournisseurs, dépôts, stations, types carburant, véhicules, clients.

Actions possibles selon rôle:

- Ajouter une fiche
- Modifier une fiche
- Supprimer une fiche
- Rechercher/filtrer

### 5.3 Prix carburants et taux de change

- Définir le prix unitaire par station et carburant.
- Définir le taux USD/CDF actif de la station.
- Vérifier la validité avant enregistrement d'une vente.

### 5.4 Stocks et mouvements

- Consulter le stock dépôt et station.
- Enregistrer des ajustements selon les droits.
- Consulter l'historique des mouvements.
- Imprimer la fiche de stock.

### 5.5 Approvisionnements

1. Ouvrir le module approvisionnements.
2. Cliquer sur Ajouter.
3. Renseigner fournisseur, dépôt, carburant, quantité, coût unitaire, date.
4. Valider.
5. Vérifier l'impact sur stock dépôt.

### 5.6 Livraisons

1. Créer une livraison (dépôt -> station).
2. Affecter le véhicule si nécessaire.
3. Mettre à jour le statut selon progression.
4. Vérifier les impacts stocks après livraison.

### 5.7 Ventes station

1. Ouvrir le module ventes station.
2. Saisir client, carburant, quantité, devise, réduction éventuelle.
3. Valider la vente.
4. Vérifier le montant restant si paiement partiel.

### 5.8 Dettes

- Consulter la liste des ventes avec solde restant.
- Enregistrer un paiement complémentaire.
- Vérifier la mise à jour du solde.

### 5.9 Alertes

- Les alertes sont créées automatiquement par le système.
- Ouvrir le détail d'une alerte pour la consulter.
- La consultation d'une nouvelle alerte réduit le badge notifications.
- La création/édition/suppression manuelle d'alerte n'est pas autorisée.

### 5.10 Rapports

- Consulter les agrégats approvisionnements/livraisons/alertes.
- Utiliser les rapports pour le pilotage hebdomadaire/mensuel.

### 5.11 Paramètres

- Mettre à jour ses informations personnelles.
- Modifier son mot de passe en saisissant l'ancien mot de passe.

## 6. Impression

- Utiliser le bouton Imprimer en topbar.
- Vérifier l'aperçu avant impression.
- Pour la fiche de stock, appliquer les filtres avant impression.

## 7. Bonnes pratiques

1. Vérifier les référentiels avant toute transaction.
2. Saisir les quantités avec précision.
3. Contrôler les statuts de livraison pour éviter les écarts.
4. Traiter rapidement les alertes critiques.
5. Clôturer les dettes par paiements enregistrés correctement.

## 8. Dépannage rapide

### Cas 1: Accès refusé

- Vérifier le rôle utilisateur et les permissions.

### Cas 2: Vente impossible

- Vérifier stock station disponible, prix actif et taux actif.

### Cas 3: Badge notifications ne baisse pas

- Ouvrir le détail de l'alerte pour la marquer consultée.

### Cas 4: Impression incomplète

- Recharger la page et relancer l'impression depuis la vue souhaitée.

## 9. Support

En cas d'anomalie persistante:

1. Noter le module concerné et les étapes de reproduction.
2. Capturer le message d'erreur affiché.
3. Transmettre au support technique pour analyse.

