import { apiRequete } from './api_client.js';

const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');
const detailBox = document.getElementById('alerts-detail');
const detailStatus = document.getElementById('detail-status');
const refreshButton = document.getElementById('btn-refresh-alertes');
const auth = window.FUELTRACK_AUTH || {};
const canWrite = auth.pageMode === 'rw';

let alertes = [];
let alertesSelectionnee = null;
const lookups = {
  depots: [],
  stations: [],
  types_carburant: [],
  utilisateurs: [],
};

function formatDate(value) {
  if (!value) return 'Non renseignée';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('fr-FR');
}

function formatType(value) {
  const labels = {
    stock_faible: 'Stock faible',
    stock_critique: 'Stock critique',
    retard_livraison: 'Retard livraison',
    anomalie: 'Anomalie',
  };
  return labels[value] || value || 'Non précisé';
}

function formatNiveau(value) {
  const labels = {
    faible: 'Faible',
    moyen: 'Moyen',
    eleve: 'Élevé',
    critique: 'Critique',
  };
  return labels[value] || value || 'Non précisé';
}

function getLookupLabel(entity, id, key = 'id', label = 'nom') {
  const rows = lookups[entity] || [];
  const row = rows.find((item) => String(item[key]) === String(id));
  return row ? (row[label] ?? '') : '';
}

function getSiteLabel(alerte) {
  if (alerte.depot_id) {
    return `Dépôt: ${getLookupLabel('depots', alerte.depot_id, 'id', 'nom_depot') || alerte.depot_id}`;
  }
  if (alerte.station_id) {
    return `Station: ${getLookupLabel('stations', alerte.station_id, 'id', 'nom_station') || alerte.station_id}`;
  }
  return 'Site non précisé';
}

function getCarburantLabel(alerte) {
  if (!alerte.type_carburant_id) return 'Carburant non précisé';
  return getLookupLabel('types_carburant', alerte.type_carburant_id, 'id', 'nom_carburant') || String(alerte.type_carburant_id);
}

function getCreateurLabel(alerte) {
  if (!alerte.cree_par) return 'Système';
  const row = (lookups.utilisateurs || []).find((item) => String(item.id) === String(alerte.cree_par));
  return row ? `${row.nom || ''} ${row.prenom || ''}`.trim() : String(alerte.cree_par);
}

function setDetailStatus(statut) {
  if (!detailStatus) return;
  detailStatus.textContent = formatNiveau(statut);
  const classeStatut = String(statut || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
  detailStatus.className = `alerts-status-pill ${classeStatut || 'neutre'}`;
}

function renderDetail(alerte) {
  if (!detailBox) return;

  if (!alerte) {
    detailBox.className = 'alerts-detail-empty';
    detailBox.textContent = 'Sélectionnez une alerte pour afficher ses informations.';
    setDetailStatus('Aucune sélection');
    return;
  }

  const items = [
    ['Type', formatType(alerte.type_alerte)],
    ['Niveau', formatNiveau(alerte.niveau)],
    ['Statut', alerte.statut || 'Non précisé'],
    ['Date', formatDate(alerte.date_alerte)],
    ['Site', getSiteLabel(alerte)],
    ['Carburant', getCarburantLabel(alerte)],
    ['Créé par', getCreateurLabel(alerte)],
    ['Message', alerte.message || ''],
  ];

  detailBox.className = 'alerts-detail-content';
  detailBox.innerHTML = items.map(([label, value]) => `
    <div class="alerts-detail-row">
      <span class="alerts-detail-label">${label}</span>
      <span class="alerts-detail-value">${value || 'Non renseigné'}</span>
    </div>
  `).join('');

  setDetailStatus(alerte.statut || 'Non précisé');
}

function renderTable() {
  if (!tableHead || !tableBody) return;

  tableHead.innerHTML = '';
  tableBody.innerHTML = '';

  const headerRow = document.createElement('tr');
  ['Type', 'Niveau', 'Message', 'Statut', 'Date', 'Actions'].forEach((title) => {
    const th = document.createElement('th');
    th.textContent = title;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  if (alertes.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'empty';
    cell.textContent = 'Aucune alerte disponible.';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  alertes.forEach((alerte) => {
    const row = document.createElement('tr');
    if (alertesSelectionnee && String(alertesSelectionnee.id) === String(alerte.id)) {
      row.classList.add('row-selected');
    }

    const cells = [
      formatType(alerte.type_alerte),
      formatNiveau(alerte.niveau),
      alerte.message || '',
      alerte.statut || '',
      formatDate(alerte.date_alerte),
    ];

    cells.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      row.appendChild(td);
    });

    const tdActions = document.createElement('td');
    tdActions.className = 'actions';

    const btnDetail = document.createElement('button');
    btnDetail.type = 'button';
    btnDetail.className = 'btn btn-secondary';
    btnDetail.textContent = 'Voir détail';
    btnDetail.addEventListener('click', () => consulterDetail(alerte));

    tdActions.appendChild(btnDetail);
    row.appendChild(tdActions);
    tableBody.appendChild(row);
  });
}

async function chargerLookups() {
  const requetes = [
    apiRequete('depots'),
    apiRequete('stations'),
    apiRequete('types_carburant'),
    canWrite ? apiRequete('utilisateurs') : Promise.resolve([]),
  ];

  const [depots, stations, typesCarburant, utilisateurs] = await Promise.allSettled(requetes);

  lookups.depots = depots.status === 'fulfilled' ? depots.value : [];
  lookups.stations = stations.status === 'fulfilled' ? stations.value : [];
  lookups.types_carburant = typesCarburant.status === 'fulfilled' ? typesCarburant.value : [];
  lookups.utilisateurs = utilisateurs.status === 'fulfilled' ? utilisateurs.value : [];
}

async function chargerAlertes() {
  alertes = await apiRequete('alertes');

  if (alertesSelectionnee) {
    const miseAJour = alertes.find((alerte) => String(alerte.id) === String(alertesSelectionnee.id));
    if (miseAJour) {
      alertesSelectionnee = miseAJour;
      renderDetail(alertesSelectionnee);
    }
  }

  renderTable();
}

async function consulterDetail(alerte) {
  const detail = await apiRequete('alertes', 'POST', null, { action: 'consulter', id: alerte.id });
  alertesSelectionnee = detail;
  renderDetail(detail);
  await chargerAlertes();
  document.dispatchEvent(new CustomEvent('fueltrack:notifications-updated', {
    detail: {
      entity: 'alertes',
      id: detail.id,
    },
  }));
}

if (refreshButton) {
  refreshButton.addEventListener('click', async () => {
    refreshButton.disabled = true;
    try {
      await chargerAlertes();
    } finally {
      refreshButton.disabled = false;
    }
  });
}

(async function init() {
  renderDetail(null);
  try {
    await chargerLookups();
  } catch (_error) {
    // Les lookups sont optionnels pour afficher la liste des alertes.
  }
  await chargerAlertes();
})();