import { initialiserPageCrud } from './crud_page.js';

function genererReferenceApprovisionnement(rows = []) {
  const anneeCourante = new Date().getFullYear();
  const modele = /^APPRO-(\d{4})-(\d{4})$/;
  let dernierNumero = 0;

  for (const row of rows) {
    const reference = String(row.reference_approvisionnement || '').trim();
    const correspondance = reference.match(modele);
    if (!correspondance) continue;

    const annee = Number(correspondance[1]);
    const numero = Number(correspondance[2]);
    if (annee === anneeCourante && Number.isFinite(numero)) {
      dernierNumero = Math.max(dernierNumero, numero);
    }
  }

  const prochainNumero = String(dernierNumero + 1).padStart(4, '0');
  return `APPRO-${anneeCourante}-${prochainNumero}`;
}

initialiserPageCrud({
  entity: 'approvisionnements',
  champs: [
    { nom: 'reference_approvisionnement', libelle: 'Référence', required: true, readonly: true },
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
  ],
  genererValeursAutomatiques: ({ rows }) => ({
    reference_approvisionnement: genererReferenceApprovisionnement(rows),
  }),
});
