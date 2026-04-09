import { initialiserPageCrud } from './crud_page.js';

initialiserPageCrud({
  entity: 'vehicules',
  champs: [
    { nom: 'immatriculation', libelle: 'Immatriculation', required: true },
    { nom: 'marque', libelle: 'Marque' },
    { nom: 'modele', libelle: 'Modèle' },
    { nom: 'nom_chauffeur', libelle: 'Nom chauffeur' },
    { nom: 'telephone_chauffeur', libelle: 'Téléphone chauffeur' },
    { nom: 'capacite', libelle: 'Capacité', type: 'number' },
    { nom: 'type_vehicule', libelle: 'Type véhicule' },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['disponible', 'en_mission', 'maintenance', 'hors_service'] }
  ],
  colonnes: [
    { nom: 'immatriculation', libelle: 'Immatriculation' },
    { nom: 'marque', libelle: 'Marque' },
    { nom: 'modele', libelle: 'Modèle' },
    { nom: 'capacite', libelle: 'Capacité' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});
