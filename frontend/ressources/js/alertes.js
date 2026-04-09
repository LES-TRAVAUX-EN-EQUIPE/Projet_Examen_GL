import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'alertes',
  champs: [
    { nom: 'type_alerte', libelle: 'Type alerte', type: 'select', required: true, options: ['stock_faible', 'stock_critique', 'retard_livraison', 'anomalie'] },
    { nom: 'niveau', libelle: 'Niveau', type: 'select', options: ['faible', 'moyen', 'eleve', 'critique'] },
    { nom: 'depot_id', libelle: 'Dépôt', type: 'select', source: { entity: 'depots', value: 'id', label: 'nom_depot' } },
    { nom: 'station_id', libelle: 'Station', type: 'select', source: { entity: 'stations', value: 'id', label: 'nom_station' } },
    { nom: 'type_carburant_id', libelle: 'Carburant', type: 'select', source: { entity: 'types_carburant', value: 'id', label: 'nom_carburant' } },
    { nom: 'message', libelle: 'Message', type: 'textarea', required: true },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['nouvelle', 'en_cours', 'resolue'] },
    { nom: 'date_alerte', libelle: 'Date alerte', type: 'datetime-local', required: true },
    { nom: 'cree_par', libelle: 'Créé par', type: 'select', source: { entity: 'utilisateurs', value: 'id', label: 'nom' } }
  ],
  colonnes: [
    { nom: 'type_alerte', libelle: 'Type' },
    { nom: 'niveau', libelle: 'Niveau' },
    { nom: 'message', libelle: 'Message' },
    { nom: 'statut', libelle: 'Statut' },
    { nom: 'date_alerte', libelle: 'Date' }
  ]
});
