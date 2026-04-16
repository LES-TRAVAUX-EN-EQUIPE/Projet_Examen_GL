import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'prix_carburants',
  champs: [
    { nom: 'station_id', libelle: 'Station', type: 'select', required: true, source: { entity: 'stations', value: 'id', label: 'nom_station' } },
    { nom: 'type_carburant_id', libelle: 'Carburant', type: 'select', required: true, source: { entity: 'types_carburant', value: 'id', label: 'nom_carburant' } },
    { nom: 'prix_unitaire_usd', libelle: 'Prix unitaire USD', type: 'number', required: true },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['actif', 'inactif'] },
  ],
  colonnes: [
    { nom: 'station_id', libelle: 'Station' },
    { nom: 'type_carburant_id', libelle: 'Carburant' },
    { nom: 'prix_unitaire_usd', libelle: 'PU USD' },
    { nom: 'statut', libelle: 'Statut' },
  ],
});
