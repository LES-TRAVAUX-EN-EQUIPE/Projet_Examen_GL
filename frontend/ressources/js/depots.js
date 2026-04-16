import { initialiserPageCrud } from './crud_page.js';
import { apiRequete } from './api_client.js';

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

const stockForm = document.getElementById('stock-depot-form');
const stockNotice = document.getElementById('stock-depot-notice');
const stocksBody = document.getElementById('stocks-depots-body');
const depotSelect = document.getElementById('stock-depot-id');
const carburantSelect = document.getElementById('stock-type-carburant-id');
const adjustCard = document.getElementById('depot-stock-adjust-card');

const auth = window.FUELTRACK_AUTH || {};
const canWrite = auth.peutEcrire ? auth.peutEcrire('ajustements_stock_depots') || auth.peutEcrire('stocks_depots') || auth.peutEcrire('depots') : true;

let depots = [];
let carburants = [];
let stocks = [];

function showNotice(message, isError = false) {
  stockNotice.textContent = message;
  stockNotice.className = isError ? 'notice error' : 'notice';
}

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function depotLabel(id) {
  const row = depots.find((item) => String(item.id) === String(id));
  return row ? row.nom_depot : id;
}

function carburantLabel(id) {
  const row = carburants.find((item) => String(item.id) === String(id));
  return row ? row.nom_carburant : id;
}

function populateSelect(select, rows, valueKey, labelKey) {
  select.innerHTML = '';
  rows.forEach((row) => {
    const option = document.createElement('option');
    option.value = String(row[valueKey]);
    option.textContent = row[labelKey];
    select.appendChild(option);
  });
}

function renderStocks() {
  if (!stocks.length) {
    stocksBody.innerHTML = '<tr><td colspan="4" class="empty">Aucun stock dépôt enregistré.</td></tr>';
    return;
  }

  stocksBody.innerHTML = '';
  stocks
    .slice()
    .sort((a, b) => depotLabel(a.depot_id).localeCompare(depotLabel(b.depot_id)) || carburantLabel(a.type_carburant_id).localeCompare(carburantLabel(b.type_carburant_id)))
    .forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${depotLabel(row.depot_id)}</td>
        <td>${carburantLabel(row.type_carburant_id)}</td>
        <td>${formatNumber(row.quantite_disponible)} litres</td>
        <td>${formatNumber(row.seuil_alerte)} litres</td>
      `;
      stocksBody.appendChild(tr);
    });
}

async function chargerStocks() {
  try {
    const [depotsRows, carburantsRows, stocksRows] = await Promise.all([
      apiRequete('depots'),
      apiRequete('types_carburant'),
      apiRequete('stocks_depots'),
    ]);
    depots = depotsRows;
    carburants = carburantsRows;
    stocks = stocksRows;
    populateSelect(depotSelect, depots, 'id', 'nom_depot');
    populateSelect(carburantSelect, carburants, 'id', 'nom_carburant');
    renderStocks();
  } catch (error) {
    showNotice(error.message, true);
  }
}

stockForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await apiRequete('ajustements_stock_depots', 'POST', {
      depot_id: Number(stockForm.depot_id.value || 0),
      type_carburant_id: Number(stockForm.type_carburant_id.value || 0),
      operation: stockForm.operation.value,
      quantite: Number(stockForm.quantite.value || 0),
      seuil_alerte: stockForm.seuil_alerte.value !== '' ? Number(stockForm.seuil_alerte.value) : undefined,
      commentaire: stockForm.commentaire.value.trim(),
    });
    showNotice('Ajustement de stock enregistré avec succès.');
    stockForm.reset();
    await chargerStocks();
  } catch (error) {
    showNotice(error.message, true);
  }
});

if (!canWrite) {
  adjustCard?.remove();
}

chargerStocks();
