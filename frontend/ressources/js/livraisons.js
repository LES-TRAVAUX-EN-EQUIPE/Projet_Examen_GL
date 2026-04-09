import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'livraisons',
  champs: [
    { nom: 'reference_livraison', libelle: 'Référence', required: true },
    { nom: 'depot_id', libelle: 'Dépôt', type: 'select', required: true, source: { entity: 'depots', value: 'id', label: 'nom_depot' } },
    { nom: 'station_id', libelle: 'Station', type: 'select', required: true, source: { entity: 'stations', value: 'id', label: 'nom_station' } },
    { nom: 'type_carburant_id', libelle: 'Carburant', type: 'select', required: true, source: { entity: 'types_carburant', value: 'id', label: 'nom_carburant' } },
    { nom: 'vehicule_id', libelle: 'Véhicule', type: 'select', source: { entity: 'vehicules', value: 'id', label: 'immatriculation' } },
    { nom: 'quantite', libelle: 'Quantité', type: 'number', required: true },
    { nom: 'date_depart', libelle: 'Date départ', type: 'datetime-local', required: true },
    { nom: 'date_arrivee', libelle: 'Date arrivée', type: 'datetime-local' },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['preparee', 'en_cours', 'livree', 'annulee'] },
    { nom: 'cree_par', libelle: 'Créé par', type: 'select', source: { entity: 'utilisateurs', value: 'id', label: 'nom' } },
    { nom: 'commentaire', libelle: 'Commentaire', type: 'textarea' }
  ],
  colonnes: [
    { nom: 'reference_livraison', libelle: 'Référence' },
    { nom: 'depot_id', libelle: 'Dépôt' },
    { nom: 'station_id', libelle: 'Station' },
    { nom: 'quantite', libelle: 'Quantité' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});
