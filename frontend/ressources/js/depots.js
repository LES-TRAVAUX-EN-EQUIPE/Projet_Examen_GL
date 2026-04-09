import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'depots',
  champs: [
    { nom: 'nom_depot', libelle: 'Nom dépôt', required: true },
    { nom: 'code_depot', libelle: 'Code dépôt', required: true },
    { nom: 'localisation', libelle: 'Localisation', required: true },
    { nom: 'ville', libelle: 'Ville', required: true },
    { nom: 'capacite_totale', libelle: 'Capacité totale', type: 'number' },
    { nom: 'responsable_id', libelle: 'Responsable', type: 'select', source: { entity: 'utilisateurs', value: 'id', label: 'nom' } },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['actif', 'inactif'] }
  ],
  colonnes: [
    { nom: 'nom_depot', libelle: 'Nom' },
    { nom: 'code_depot', libelle: 'Code' },
    { nom: 'ville', libelle: 'Ville' },
    { nom: 'capacite_totale', libelle: 'Capacité' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});
