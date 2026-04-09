import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'mouvements_stock',
  champs: [
    { nom: 'reference_mouvement', libelle: 'Référence', required: true },
    { nom: 'type_mouvement', libelle: 'Type mouvement', type: 'select', required: true, options: ['entree_depot', 'sortie_depot', 'entree_station', 'sortie_station', 'transfert'] },
    { nom: 'type_carburant_id', libelle: 'Carburant', type: 'select', required: true, source: { entity: 'types_carburant', value: 'id', label: 'nom_carburant' } },
    { nom: 'depot_id', libelle: 'Dépôt', type: 'select', source: { entity: 'depots', value: 'id', label: 'nom_depot' } },
    { nom: 'station_id', libelle: 'Station', type: 'select', source: { entity: 'stations', value: 'id', label: 'nom_station' } },
    { nom: 'approvisionnement_id', libelle: 'Approvisionnement', type: 'select', source: { entity: 'approvisionnements', value: 'id', label: 'reference_approvisionnement' } },
    { nom: 'livraison_id', libelle: 'Livraison', type: 'select', source: { entity: 'livraisons', value: 'id', label: 'reference_livraison' } },
    { nom: 'quantite', libelle: 'Quantité', type: 'number', required: true },
    { nom: 'date_mouvement', libelle: 'Date mouvement', type: 'datetime-local', required: true },
    { nom: 'cree_par', libelle: 'Créé par', type: 'select', source: { entity: 'utilisateurs', value: 'id', label: 'nom' } },
    { nom: 'commentaire', libelle: 'Commentaire', type: 'textarea' }
  ],
  colonnes: [
    { nom: 'reference_mouvement', libelle: 'Référence' },
    { nom: 'type_mouvement', libelle: 'Type' },
    { nom: 'type_carburant_id', libelle: 'Carburant' },
    { nom: 'quantite', libelle: 'Quantité' },
    { nom: 'date_mouvement', libelle: 'Date' }
  ]
});
