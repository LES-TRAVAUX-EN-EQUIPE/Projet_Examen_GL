import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'stations',
  champs: [
    { nom: 'nom_station', libelle: 'Nom station', required: true },
    { nom: 'code_station', libelle: 'Code station', required: true },
    { nom: 'localisation', libelle: 'Localisation', required: true },
    { nom: 'ville', libelle: 'Ville', required: true },
    { nom: 'capacite_stockage', libelle: 'Capacité stockage', type: 'number' },
    { nom: 'responsable_id', libelle: 'Responsable', type: 'select', source: { entity: 'utilisateurs', value: 'id', label: 'nom' } },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['actif', 'inactif'] }
  ],
  colonnes: [
    { nom: 'nom_station', libelle: 'Nom' },
    { nom: 'code_station', libelle: 'Code' },
    { nom: 'ville', libelle: 'Ville' },
    { nom: 'capacite_stockage', libelle: 'Capacité' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});
