# Règles de gestion

## 1. Objet

Ce document formalise les règles métier opérationnelles de FuelTrack.

## 2. Règles d'authentification et accès

### RG-01 Connexion

- Un utilisateur ne peut accéder au système qu'avec des identifiants valides.

### RG-02 Autorisations

- Toute action est soumise au rôle de l'utilisateur.
- Les permissions sont distinguées en lecture (GET) et écriture (POST/PUT/PATCH/DELETE).

### RG-03 Profil utilisateur

- Un utilisateur connecté peut consulter et mettre à jour ses paramètres (profil, mot de passe) sous contrôle de validation.

## 3. Règles référentielles

### RG-04 Cohérence des références

- Toute transaction doit référencer des entités existantes (station, dépôt, carburant, client, etc.).

### RG-05 Unicité

- Les champs identifiants métiers (codes, immatriculations, références de transaction) doivent rester uniques.

## 4. Règles de stock

### RG-06 Stock dépôt

- Le stock dépôt par carburant est suivi dans `stocks_depots`.
- Les opérations `entree_depot` augmentent le stock.
- Les opérations `sortie_depot` diminuent le stock.

### RG-07 Stock station

- Le stock station par carburant est suivi dans `stocks_stations`.
- Les opérations `entree_station` augmentent le stock.
- Les opérations `sortie_station` et `transfert` diminuent le stock.

### RG-08 Non-négativité

- Une opération ne peut pas conduire à un stock négatif.

### RG-09 Ajustements

- Tout ajustement manuel de stock doit être tracé par un mouvement stock.

## 5. Règles approvisionnements

### RG-10 Création

- Un approvisionnement valide doit comporter une référence, un fournisseur, un dépôt, un carburant, une quantité, un coût unitaire et une date.

### RG-11 Impact stock

- Un approvisionnement reçu impacte positivement le stock du dépôt concerné.

### RG-12 Traçabilité

- L'approvisionnement doit générer ou mettre à jour les mouvements correspondants.

## 6. Règles livraisons

### RG-13 Création

- Une livraison valide doit comporter une référence, un dépôt source, une station destination, un carburant, une quantité et une date de départ.

### RG-14 Statuts

- Une livraison suit les statuts: `preparee`, `en_cours`, `livree`, `annulee`.

### RG-15 Effet sur stock

- Lorsqu'une livraison est considérée livrée, le stock dépôt diminue et le stock station augmente de la quantité concernée.

### RG-16 Contrôle quantité

- La quantité livrée ne peut excéder le stock disponible au dépôt pour le carburant concerné.

## 7. Règles ventes station

### RG-17 Conditions de vente

- Une vente requiert station, client, carburant, quantité, devise.

### RG-18 Prix et devise

- Le prix unitaire provient du prix actif de la station/carburant.
- Si devise CDF, le taux actif de la station est appliqué.

### RG-19 Réduction

- Toute réduction appliquée ne doit pas conduire à un montant net négatif.

### RG-20 Paiement et dette

- `montant_restant = montant_net - montant_paye` (plancher à 0).
- Le paiement cumulé ne peut dépasser le montant net.

### RG-21 Effet stock

- Chaque vente validée diminue le stock station et enregistre un mouvement de `sortie_station`.

## 8. Règles dettes

### RG-22 Dette ouverte

- Une dette est ouverte tant que `montant_restant > 0`.

### RG-23 Paiement complémentaire

- Un paiement complémentaire met à jour `montant_paye` sans dépasser le montant net.

## 9. Règles alertes

### RG-24 Génération automatique

- Les alertes stock sont générées automatiquement selon les seuils de stock.

### RG-25 Interdiction d'édition manuelle

- Les opérations manuelles de création/modification/suppression sur alertes sont interdites.

### RG-26 Consultation

- Lors de la consultation détaillée d'une alerte `nouvelle`, le statut passe à `en_cours`.

### RG-27 Badge notifications

- Le badge notifications affiche uniquement les alertes au statut `nouvelle`.

## 10. Règles tableau de bord et rapports

### RG-28 Compteurs

- Les compteurs doivent refléter les volumes réels des principales entités.

### RG-29 Rapports agrégés

- Les rapports doivent fournir des agrégations par carburant, statut et niveau d'alerte.

## 11. Règles d'impression

### RG-30 Impression lisible

- L'impression doit exclure les éléments de navigation non pertinents.

### RG-31 Fidélité

- Les données imprimées doivent correspondre aux filtres et à l'état courant de la vue.

