import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'clients',
  champs: [
    { nom: 'nom_client', libelle: 'Nom du client', required: true },
    { nom: 'telephone', libelle: 'Telephone', required: true },
    { nom: 'email', libelle: 'Email', type: 'email' },
    { nom: 'adresse', libelle: 'Adresse', type: 'textarea' },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['actif', 'inactif'] },
  ],
  colonnes: [
    { nom: 'nom_client', libelle: 'Client' },
    { nom: 'telephone', libelle: 'Telephone' },
    { nom: 'email', libelle: 'Email' },
    { nom: 'statut', libelle: 'Statut' },
  ],
});
