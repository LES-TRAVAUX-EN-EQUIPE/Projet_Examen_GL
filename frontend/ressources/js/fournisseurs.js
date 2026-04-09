import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'fournisseurs',
  champs: [
    { nom: 'nom_fournisseur', libelle: 'Nom fournisseur', required: true },
    { nom: 'type_fournisseur', libelle: 'Type fournisseur' },
    { nom: 'contact_personne', libelle: 'Contact personne' },
    { nom: 'telephone', libelle: 'Téléphone' },
    { nom: 'email', libelle: 'Email', type: 'email' },
    { nom: 'adresse', libelle: 'Adresse' },
    { nom: 'ville', libelle: 'Ville' },
    { nom: 'province', libelle: 'Province' },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['actif', 'inactif'] }
  ],
  colonnes: [
    { nom: 'nom_fournisseur', libelle: 'Nom' },
    { nom: 'type_fournisseur', libelle: 'Type' },
    { nom: 'contact_personne', libelle: 'Contact' },
    { nom: 'telephone', libelle: 'Téléphone' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});
