import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'utilisateurs',
  creationMode: 'modal',
  createButtonLabel: 'Ajouter utilisateur',
  createModalTitle: 'Ajouter un utilisateur',
  editModalTitle: 'Modifier un utilisateur',
  champs: [
    { nom: 'nom', libelle: 'Nom', required: true },
    { nom: 'prenom', libelle: 'Prénom', required: true },
    { nom: 'email', libelle: 'Email', type: 'email', required: true },
    { nom: 'mot_de_passe', libelle: 'Mot de passe', type: 'password' },
    { nom: 'telephone', libelle: 'Téléphone' },
    { nom: 'role_id', libelle: 'Rôle', type: 'select', required: true, source: { entity: 'roles', value: 'id', label: 'nom_role' } },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['actif', 'inactif'] }
  ],
  colonnes: [
    { nom: 'nom', libelle: 'Nom' },
    { nom: 'prenom', libelle: 'Prénom' },
    { nom: 'email', libelle: 'Email' },
    { nom: 'role_id', libelle: 'Rôle' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});
