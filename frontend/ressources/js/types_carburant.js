import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'types_carburant',
  champs: [
    { nom: 'nom_carburant', libelle: 'Nom carburant', required: true },
    { nom: 'description_carburant', libelle: 'Description' },
    { nom: 'unite_mesure', libelle: 'Unité mesure' }
  ],
  colonnes: [
    { nom: 'nom_carburant', libelle: 'Nom' },
    { nom: 'description_carburant', libelle: 'Description' },
    { nom: 'unite_mesure', libelle: 'Unité' }
  ]
});
