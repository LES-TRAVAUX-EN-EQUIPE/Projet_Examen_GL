import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'approvisionnements',
  champs: [
    { nom: 'reference_approvisionnement', libelle: 'Référence', required: true },
    { nom: 'fournisseur_id', libelle: 'Fournisseur', type: 'select', required: true, source: { entity: 'fournisseurs', value: 'id', label: 'nom_fournisseur' } },
    { nom: 'type_carburant_id', libelle: 'Type carburant', type: 'select', required: true, source: { entity: 'types_carburant', value: 'id', label: 'nom_carburant' } },
    { nom: 'depot_id', libelle: 'Dépôt', type: 'select', required: true, source: { entity: 'depots', value: 'id', label: 'nom_depot' } },
    { nom: 'quantite', libelle: 'Quantité', type: 'number', required: true },
    { nom: 'cout_unitaire', libelle: 'Coût unitaire', type: 'number', required: true },
    { nom: 'date_approvisionnement', libelle: 'Date approvisionnement', type: 'datetime-local', required: true },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['en_attente', 'recu', 'annule'] },
    { nom: 'cree_par', libelle: 'Créé par', type: 'select', source: { entity: 'utilisateurs', value: 'id', label: 'nom' } },
    { nom: 'commentaire', libelle: 'Commentaire', type: 'textarea' }
  ],
  colonnes: [
    { nom: 'reference_approvisionnement', libelle: 'Référence' },
    { nom: 'fournisseur_id', libelle: 'Fournisseur' },
    { nom: 'type_carburant_id', libelle: 'Carburant' },
    { nom: 'quantite', libelle: 'Quantité' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});
