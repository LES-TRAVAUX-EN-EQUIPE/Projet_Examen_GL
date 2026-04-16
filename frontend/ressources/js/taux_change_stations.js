import { apiRequete } from './api_client.js';

const form = document.getElementById('taux-form');
const notice = document.getElementById('taux-notice');
const stationSelect = document.getElementById('taux-station-id');
const body = document.getElementById('taux-body');

const auth = window.FUELTRACK_AUTH || {};
const currentUser = auth.user || {};
const canWrite = auth.pageMode === 'rw';

let stations = [];
let tauxRows = [];
let stationResponsable = null;

function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.className = isError ? 'notice error' : 'notice';
}

function formatDateInputNow() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('fr-FR');
}

function getStationLabel(id) {
  const station = stations.find((row) => String(row.id) === String(id));
  return station ? station.nom_station : id;
}

function findManagedStation() {
  stationResponsable = stations.find((row) => String(row.responsable_id) === String(currentUser.id)) || null;
}

function populateStations() {
  stationSelect.innerHTML = '';
  stations.forEach((row) => {
    const option = document.createElement('option');
    option.value = String(row.id);
    option.textContent = row.nom_station;
    stationSelect.appendChild(option);
  });

  if (auth.roleId === 4 && stationResponsable) {
    stationSelect.value = String(stationResponsable.id);
    stationSelect.disabled = true;
  }
}

function renderHistory() {
  const rows = auth.roleId === 4 && stationResponsable
    ? tauxRows.filter((row) => String(row.station_id) === String(stationResponsable.id))
    : tauxRows;

  if (rows.length === 0) {
    body.innerHTML = '<tr><td colspan="4" class="empty">Aucun taux de change enregistre.</td></tr>';
    return;
  }

  body.innerHTML = '';
  rows
    .slice()
    .sort((a, b) => new Date(b.date_application) - new Date(a.date_application))
    .forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${getStationLabel(row.station_id)}</td>
        <td>${row.taux_usd_cdf}</td>
        <td>${formatDate(row.date_application)}</td>
        <td>${row.statut || ''}</td>
      `;
      body.appendChild(tr);
    });
}

async function chargerDonnees() {
  try {
    const [stationsRows, taux] = await Promise.all([
      apiRequete('stations'),
      apiRequete('taux_change_stations'),
    ]);
    stations = stationsRows;
    tauxRows = taux;
    findManagedStation();
    populateStations();
    renderHistory();
  } catch (error) {
    showNotice(error.message, true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const stationId = auth.roleId === 4 && stationResponsable
    ? stationResponsable.id
    : Number(stationSelect.value || 0);

  try {
    await apiRequete('taux_change_stations', 'POST', {
      station_id: stationId,
      taux_usd_cdf: Number(form.taux_usd_cdf.value || 0),
      date_application: form.date_application.value.replace('T', ' '),
      statut: form.statut.value,
      cree_par: currentUser.id || null,
    });
    showNotice('Taux de change enregistre avec succes.');
    form.taux_usd_cdf.value = '';
    form.date_application.value = formatDateInputNow();
    await chargerDonnees();
  } catch (error) {
    showNotice(error.message, true);
  }
});

form.date_application.value = formatDateInputNow();
if (!canWrite) {
  form.closest('.card')?.remove();
}
chargerDonnees();
