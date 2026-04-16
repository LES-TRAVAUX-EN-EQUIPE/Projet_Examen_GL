import { initialiserPageCrud } from './crud_page.js';
import { apiRequete } from './api_client.js';

initialiserPageCrud({
  entity: 'stations',
  champs: [
    { nom: 'nom_station', libelle: 'Nom station', required: true },
    { nom: 'code_station', libelle: 'Code station', required: true },
    { nom: 'localisation', libelle: 'Localisation', required: true },
    { nom: 'ville', libelle: 'Ville', required: true },
    { nom: 'capacite_stockage', libelle: 'Capacité stockage', type: 'number' },
    { nom: 'responsable_id', libelle: 'Responsable', type: 'select', source: { entity: 'utilisateurs', value: 'id', label: 'nom' } },
    { nom: 'statut', libelle: 'Statut', type: 'select', options: ['actif', 'inactif'] }
  ],
  colonnes: [
    { nom: 'nom_station', libelle: 'Nom' },
    { nom: 'code_station', libelle: 'Code' },
    { nom: 'ville', libelle: 'Ville' },
    { nom: 'capacite_stockage', libelle: 'Capacité' },
    { nom: 'statut', libelle: 'Statut' }
  ]
});

const stockForm = document.getElementById('stock-station-form');
const stockNotice = document.getElementById('stock-station-notice');
const stocksBody = document.getElementById('stocks-stations-body');
const stationSelect = document.getElementById('stock-station-id');
const carburantSelect = document.getElementById('station-type-carburant-id');
const adjustCard = document.getElementById('station-stock-adjust-card');

const auth = window.FUELTRACK_AUTH || {};
const currentUser = auth.user || {};
const canWrite = auth.peutEcrire ? auth.peutEcrire('ajustements_stock_stations') || auth.peutEcrire('stocks_stations') || auth.peutEcrire('stations') : true;

let stations = [];
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

function stationLabel(id) {
  const row = stations.find((item) => String(item.id) === String(id));
  return row ? row.nom_station : id;
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

function stationResponsable() {
  return stations.find((item) => String(item.responsable_id) === String(currentUser.id)) || null;
}

function renderStocks() {
  let rows = stocks.slice();
  const managedStation = auth.roleId === 4 ? stationResponsable() : null;
  if (managedStation) {
    rows = rows.filter((row) => String(row.station_id) === String(managedStation.id));
  }

  if (!rows.length) {
    stocksBody.innerHTML = '<tr><td colspan="4" class="empty">Aucun stock station enregistré.</td></tr>';
    return;
  }

  stocksBody.innerHTML = '';
  rows
    .sort((a, b) => stationLabel(a.station_id).localeCompare(stationLabel(b.station_id)) || carburantLabel(a.type_carburant_id).localeCompare(carburantLabel(b.type_carburant_id)))
    .forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${stationLabel(row.station_id)}</td>
        <td>${carburantLabel(row.type_carburant_id)}</td>
        <td>${formatNumber(row.quantite_disponible)} litres</td>
        <td>${formatNumber(row.seuil_alerte)} litres</td>
      `;
      stocksBody.appendChild(tr);
    });
}

async function chargerStocks() {
  try {
    const [stationsRows, carburantsRows, stocksRows] = await Promise.all([
      apiRequete('stations'),
      apiRequete('types_carburant'),
      apiRequete('stocks_stations'),
    ]);
    stations = stationsRows;
    carburants = carburantsRows;
    stocks = stocksRows;

    const managedStation = auth.roleId === 4 ? stationResponsable() : null;
    const stationRowsForSelect = managedStation ? [managedStation] : stations;

    populateSelect(stationSelect, stationRowsForSelect, 'id', 'nom_station');
    populateSelect(carburantSelect, carburants, 'id', 'nom_carburant');
    if (managedStation) {
      stationSelect.value = String(managedStation.id);
      stationSelect.disabled = true;
    }
    renderStocks();
  } catch (error) {
    showNotice(error.message, true);
  }
}

stockForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await apiRequete('ajustements_stock_stations', 'POST', {
      station_id: Number(stationSelect.value || 0),
      type_carburant_id: Number(carburantSelect.value || 0),
      operation: stockForm.operation.value,
      quantite: Number(stockForm.quantite.value || 0),
      seuil_alerte: stockForm.seuil_alerte.value !== '' ? Number(stockForm.seuil_alerte.value) : undefined,
      commentaire: stockForm.commentaire.value.trim(),
    });
    showNotice('Ajustement de stock station enregistré avec succès.');
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
