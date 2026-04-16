import { initialiserPageCrud } from './crud_page.js';
import { apiRequete } from './api_client.js';

const SORTIE_TYPES = new Set(['sortie_depot', 'sortie_station', 'transfert']);

const stockSheetForm = document.getElementById('stock-sheet-form');
const stockSheetSiteType = document.getElementById('sheet-site-type');
const stockSheetSiteId = document.getElementById('sheet-site-id');
const stockSheetCarburantId = document.getElementById('sheet-carburant-id');
const stockSheetPeriod = document.getElementById('sheet-period');
const stockSheetSummary = document.getElementById('stock-sheet-summary');
const stockSheetBody = document.getElementById('stock-sheet-body');
const printButton = document.getElementById('btn-print-stock-sheet');

let mouvementsRows = [];
let depotsRows = [];
let stationsRows = [];
let carburantsRows = [];
let livraisonsRows = [];

function toNumber(value) {
  return Number(value || 0);
}

function formatNombre(value) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('fr-FR');
}

function getLivraisonMap() {
  return new Map(livraisonsRows.map((row) => [String(row.id), row]));
}

function getDepotLabel(id) {
  const row = depotsRows.find((item) => String(item.id) === String(id));
  return row ? row.nom_depot : '';
}

function getStationLabel(id) {
  const row = stationsRows.find((item) => String(item.id) === String(id));
  return row ? row.nom_station : '';
}

function getCarburantLabel(id) {
  const row = carburantsRows.find((item) => String(item.id) === String(id));
  return row ? row.nom_carburant : '';
}

function getSiteLabel(mouvement) {
  if (mouvement.depot_id) return `Dépôt - ${getDepotLabel(mouvement.depot_id)}`;
  if (mouvement.station_id) return `Station - ${getStationLabel(mouvement.station_id)}`;
  return 'Non précisé';
}

function getEtatSortie(mouvement) {
  if (!SORTIE_TYPES.has(mouvement.type_mouvement)) {
    return 'Aucune sortie';
  }

  if (!mouvement.livraison_id) {
    return 'Sortie enregistrée';
  }

  const livraison = getLivraisonMap().get(String(mouvement.livraison_id));
  const statut = (livraison?.statut || '').toLowerCase();

  if (statut === 'preparee') return 'Préparée';
  if (statut === 'en_cours') return 'En cours';
  if (statut === 'livree') return 'Livrée';
  if (statut === 'annulee') return 'Annulée';
  return 'Sortie enregistrée';
}

function isEntree(type) {
  return type === 'entree_depot' || type === 'entree_station';
}

function isSortie(type) {
  return SORTIE_TYPES.has(type);
}

function populateSiteOptions() {
  const type = stockSheetSiteType.value;
  stockSheetSiteId.innerHTML = '<option value="all">Tous les sites</option>';

  const rows = type === 'depot'
    ? depotsRows.map((row) => ({ value: row.id, label: row.nom_depot }))
    : type === 'station'
      ? stationsRows.map((row) => ({ value: row.id, label: row.nom_station }))
      : [
          ...depotsRows.map((row) => ({ value: `depot:${row.id}`, label: `Dépôt - ${row.nom_depot}` })),
          ...stationsRows.map((row) => ({ value: `station:${row.id}`, label: `Station - ${row.nom_station}` })),
        ];

  rows.forEach((row) => {
    const option = document.createElement('option');
    option.value = String(row.value);
    option.textContent = row.label;
    stockSheetSiteId.appendChild(option);
  });
}

function populateCarburantOptions() {
  stockSheetCarburantId.innerHTML = '<option value="all">Tous les carburants</option>';
  carburantsRows.forEach((row) => {
    const option = document.createElement('option');
    option.value = String(row.id);
    option.textContent = row.nom_carburant;
    stockSheetCarburantId.appendChild(option);
  });
}

function filterByPeriod(rows, period) {
  if (period === 'all') return rows;
  const days = Number(period);
  if (!days) return rows;

  const now = new Date();
  const minDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

  return rows.filter((row) => {
    const date = new Date(row.date_mouvement);
    return !Number.isNaN(date.getTime()) && date >= minDate;
  });
}

function filterRows() {
  let rows = [...mouvementsRows];
  const siteType = stockSheetSiteType.value;
  const siteId = stockSheetSiteId.value;
  const carburantId = stockSheetCarburantId.value;

  if (siteType === 'depot') {
    rows = rows.filter((row) => row.depot_id);
  } else if (siteType === 'station') {
    rows = rows.filter((row) => row.station_id);
  }

  if (siteId !== 'all') {
    if (siteType === 'depot') {
      rows = rows.filter((row) => String(row.depot_id) === siteId);
    } else if (siteType === 'station') {
      rows = rows.filter((row) => String(row.station_id) === siteId);
    } else {
      const [kind, id] = siteId.split(':');
      rows = rows.filter((row) => kind === 'depot'
        ? String(row.depot_id) === id
        : String(row.station_id) === id);
    }
  }

  if (carburantId !== 'all') {
    rows = rows.filter((row) => String(row.type_carburant_id) === carburantId);
  }

  rows = filterByPeriod(rows, stockSheetPeriod.value);
  rows.sort((a, b) => new Date(a.date_mouvement) - new Date(b.date_mouvement));
  return rows;
}

function renderSummary(rows) {
  const totalEntrees = rows
    .filter((row) => isEntree(row.type_mouvement))
    .reduce((sum, row) => sum + toNumber(row.quantite), 0);

  const totalSorties = rows
    .filter((row) => isSortie(row.type_mouvement))
    .reduce((sum, row) => sum + toNumber(row.quantite), 0);

  const solde = totalEntrees - totalSorties;

  stockSheetSummary.innerHTML = `
    <article class="stock-sheet-metric">
      <span>Mouvements</span>
      <strong>${rows.length}</strong>
    </article>
    <article class="stock-sheet-metric">
      <span>Total entrées</span>
      <strong>${formatNombre(totalEntrees)}</strong>
    </article>
    <article class="stock-sheet-metric">
      <span>Total sorties</span>
      <strong>${formatNombre(totalSorties)}</strong>
    </article>
    <article class="stock-sheet-metric">
      <span>Solde</span>
      <strong>${formatNombre(solde)}</strong>
    </article>
  `;
}

function renderStockSheet() {
  const rows = filterRows();
  renderSummary(rows);

  if (rows.length === 0) {
    stockSheetBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty">Aucun mouvement trouvé pour cette fiche de stock.</td>
      </tr>
    `;
    return;
  }

  let solde = 0;
  stockSheetBody.innerHTML = '';

  rows.forEach((row) => {
    const entree = isEntree(row.type_mouvement) ? toNumber(row.quantite) : 0;
    const sortie = isSortie(row.type_mouvement) ? toNumber(row.quantite) : 0;
    solde += entree - sortie;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.reference_mouvement || ''}</td>
      <td>${formatDate(row.date_mouvement)}</td>
      <td>${getSiteLabel(row)}</td>
      <td>${row.type_mouvement || ''}</td>
      <td>${getEtatSortie(row)}</td>
      <td>${entree ? formatNombre(entree) : '-'}</td>
      <td>${sortie ? formatNombre(sortie) : '-'}</td>
      <td>${formatNombre(solde)}</td>
    `;
    stockSheetBody.appendChild(tr);
  });
}

async function chargerDonneesFiche() {
  const [mouvements, depots, stations, carburants, livraisons] = await Promise.all([
    apiRequete('mouvements_stock'),
    apiRequete('depots'),
    apiRequete('stations'),
    apiRequete('types_carburant'),
    apiRequete('livraisons'),
  ]);

  mouvementsRows = mouvements;
  depotsRows = depots;
  stationsRows = stations;
  carburantsRows = carburants;
  livraisonsRows = livraisons;

  populateSiteOptions();
  populateCarburantOptions();
  renderStockSheet();
}

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
    {
      nom: 'etat_sortie',
      libelle: 'État sortie',
      render: ({ item }) => getEtatSortie(item),
    },
    { nom: 'quantite', libelle: 'Quantité' },
    { nom: 'date_mouvement', libelle: 'Date' }
  ]
});

stockSheetSiteType?.addEventListener('change', () => {
  populateSiteOptions();
  renderStockSheet();
});

stockSheetForm?.addEventListener('change', () => {
  renderStockSheet();
});

printButton?.addEventListener('click', () => {
  window.print();
});

document.addEventListener('fueltrack:crud-data-loaded', async (event) => {
  if (event.detail?.entity !== 'mouvements_stock') return;
  await chargerDonneesFiche();
});

chargerDonneesFiche();
