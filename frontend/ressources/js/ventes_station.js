import { apiRequete } from './api_client.js';

const form = document.getElementById('vente-form');
const notice = document.getElementById('vente-notice');
const stationSelect = document.getElementById('vente-station-id');
const carburantSelect = document.getElementById('vente-type-carburant-id');
const phoneInput = document.getElementById('vente-telephone-client');
const clientNameInput = document.getElementById('vente-nom-client');
const clientEmailInput = document.getElementById('vente-email-client');
const clientAdresseInput = document.getElementById('vente-adresse-client');
const metrics = document.getElementById('vente-metrics');
const clientPreview = document.getElementById('client-preview');
const ventesBody = document.getElementById('ventes-body');
const phonesList = document.getElementById('client-phones');
const stockProductsSummary = document.getElementById('stock-products-summary');

const auth = window.FUELTRACK_AUTH || {};
const currentUser = auth.user || {};
const canWrite = auth.pageMode === 'rw';

let stations = [];
let carburants = [];
let clients = [];
let tarifs = [];
let tauxRows = [];
let ventes = [];
let stocksStations = [];
let stationResponsable = null;
let paymentOverlay = null;
let paymentResolve = null;
let paymentInput = null;
let paymentError = null;
let paymentTitle = null;
let paymentHint = null;

function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.className = isError ? 'notice error' : 'notice';
}

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
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

function normalisePhone(phone) {
  return String(phone || '').replace(/\s+/g, '').trim();
}

function parseAmount(value) {
  return Number(String(value ?? '').replace(',', '.').trim());
}

function closePaymentDialog(value = null) {
  if (!paymentOverlay) return;
  paymentOverlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  if (paymentResolve) {
    const resolve = paymentResolve;
    paymentResolve = null;
    resolve(value);
  }
}

function openPaymentDialog(vente) {
  if (!paymentOverlay || !paymentInput || !paymentTitle || !paymentHint || !paymentError) {
    return Promise.resolve(null);
  }

  const devise = vente.devise_paiement || 'USD';
  const montantRestant = Number(vente.montant_restant || 0);

  paymentTitle.textContent = `Payer une dette - ${vente.reference_vente || ''}`;
  paymentHint.textContent = `Dette restante: ${formatNumber(montantRestant)} ${devise}`;
  paymentInput.value = String(montantRestant).replace('.', ',');
  paymentInput.max = String(montantRestant);
  paymentInput.dataset.maxAmount = String(montantRestant);
  paymentError.textContent = '';

  paymentOverlay.classList.add('open');
  document.body.classList.add('modal-open');

  window.setTimeout(() => {
    paymentInput.focus();
    paymentInput.select();
  }, 0);

  return new Promise((resolve) => {
    paymentResolve = resolve;
  });
}

function initPaymentDialog() {
  paymentOverlay = document.createElement('div');
  paymentOverlay.className = 'payment-overlay';
  paymentOverlay.innerHTML = `
    <div class="payment-dialog" role="dialog" aria-modal="true" aria-labelledby="payment-dialog-title">
      <div class="payment-dialog-header">
        <h3 id="payment-dialog-title" class="payment-dialog-title"></h3>
        <button type="button" class="payment-dialog-close" aria-label="Fermer"><i class="bi bi-x-lg"></i></button>
      </div>
      <p class="payment-dialog-hint"></p>
      <div class="form-group">
        <label for="payment-amount-input">Montant a payer</label>
        <input id="payment-amount-input" type="text" inputmode="decimal" autocomplete="off" required>
      </div>
      <p class="payment-dialog-error" aria-live="polite"></p>
      <div class="payment-dialog-actions">
        <button type="button" class="btn btn-secondary" data-action="cancel">Annuler</button>
        <button type="button" class="btn btn-primary" data-action="confirm">Valider le paiement</button>
      </div>
    </div>
  `;

  paymentTitle = paymentOverlay.querySelector('.payment-dialog-title');
  paymentHint = paymentOverlay.querySelector('.payment-dialog-hint');
  paymentInput = paymentOverlay.querySelector('#payment-amount-input');
  paymentError = paymentOverlay.querySelector('.payment-dialog-error');

  const closeBtn = paymentOverlay.querySelector('.payment-dialog-close');
  const cancelBtn = paymentOverlay.querySelector('[data-action="cancel"]');
  const confirmBtn = paymentOverlay.querySelector('[data-action="confirm"]');

  const submit = () => {
    const montant = parseAmount(paymentInput.value);
    const montantMax = Number(paymentInput.dataset.maxAmount || 0);

    if (!(montant > 0)) {
      paymentError.textContent = 'Montant de paiement invalide.';
      return;
    }

    if (montant > montantMax) {
      paymentError.textContent = 'Le paiement ne peut pas depasser la dette restante.';
      return;
    }

    closePaymentDialog(montant);
  };

  closeBtn.addEventListener('click', () => closePaymentDialog(null));
  cancelBtn.addEventListener('click', () => closePaymentDialog(null));
  confirmBtn.addEventListener('click', submit);

  paymentInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  });

  paymentOverlay.addEventListener('click', (event) => {
    if (event.target === paymentOverlay) {
      closePaymentDialog(null);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && paymentOverlay.classList.contains('open')) {
      closePaymentDialog(null);
    }
  });

  document.body.appendChild(paymentOverlay);
}

function getStationLabel(id) {
  const station = stations.find((row) => String(row.id) === String(id));
  return station ? rowLabel(station.nom_station, station.code_station) : id;
}

function getCarburantLabel(id) {
  const carburant = carburants.find((row) => String(row.id) === String(id));
  return carburant ? carburant.nom_carburant : id;
}

function rowLabel(primary, secondary) {
  return secondary ? `${primary} (${secondary})` : primary;
}

function findManagedStation() {
  stationResponsable = stations.find((row) => String(row.responsable_id) === String(currentUser.id)) || null;
}

function populateStations() {
  stationSelect.innerHTML = '';
  stations.forEach((row) => {
    const option = document.createElement('option');
    option.value = String(row.id);
    option.textContent = rowLabel(row.nom_station, row.code_station);
    stationSelect.appendChild(option);
  });

  if (auth.roleId === 4 && stationResponsable) {
    stationSelect.value = String(stationResponsable.id);
    stationSelect.disabled = true;
  }
}

function populateCarburants() {
  carburantSelect.innerHTML = '';
  carburants.forEach((row) => {
    const option = document.createElement('option');
    option.value = String(row.id);
    option.textContent = row.nom_carburant;
    carburantSelect.appendChild(option);
  });
}

function populatePhoneList() {
  phonesList.innerHTML = '';
  clients.forEach((row) => {
    const option = document.createElement('option');
    option.value = row.telephone;
    option.label = row.nom_client;
    phonesList.appendChild(option);
  });
}

function getSelectedStationId() {
  if (auth.roleId === 4 && stationResponsable) return Number(stationResponsable.id);
  return Number(stationSelect.value || 0);
}

function getSelectedCarburantId() {
  return Number(carburantSelect.value || 0);
}

function getTarifActif(stationId, carburantId) {
  return tarifs.find((row) =>
    String(row.station_id) === String(stationId)
    && String(row.type_carburant_id) === String(carburantId)
    && String(row.statut || 'actif') === 'actif'
  ) || null;
}

function getTauxActif(stationId) {
  return tauxRows
    .filter((row) => String(row.station_id) === String(stationId) && String(row.statut || 'actif') === 'actif')
    .sort((a, b) => new Date(b.date_application) - new Date(a.date_application))[0] || null;
}

function getStockForStation(stationId) {
  return stocksStations
    .filter((row) => String(row.station_id) === String(stationId))
    .sort((a, b) => getCarburantLabel(a.type_carburant_id).localeCompare(getCarburantLabel(b.type_carburant_id)));
}

function renderStockSummary() {
  const stationId = getSelectedStationId();
  const rows = getStockForStation(stationId);

  if (!stationId || rows.length === 0) {
    stockProductsSummary.innerHTML = `
      <article class="stock-product-card">
        <span>Stock station</span>
        <strong>Aucune quantite disponible</strong>
        <div class="muted-block">Aucun stock trouve pour cette station.</div>
      </article>
    `;
    return;
  }

  stockProductsSummary.innerHTML = '';
  rows.forEach((row) => {
    const article = document.createElement('article');
    article.className = 'stock-product-card';
    article.innerHTML = `
      <span>${getCarburantLabel(row.type_carburant_id)}</span>
      <strong>${formatNumber(row.quantite_disponible)} litres</strong>
      <div>Seuil alerte: ${formatNumber(row.seuil_alerte || 0)} litres</div>
    `;
    stockProductsSummary.appendChild(article);
  });
}

function fillClientFromPhone() {
  const phone = normalisePhone(phoneInput.value);
  const client = clients.find((row) => normalisePhone(row.telephone) === phone);

  if (!client) {
    clientNameInput.value = '';
    clientEmailInput.value = '';
    clientAdresseInput.value = '';
    clientPreview.textContent = 'Nouveau client: les informations seront enregistrees automatiquement apres la vente.';
    return;
  }

  clientNameInput.value = client.nom_client || '';
  clientEmailInput.value = client.email || '';
  clientAdresseInput.value = client.adresse || '';
  clientPreview.innerHTML = `
    <strong>${client.nom_client || ''}</strong><br>
    ${client.telephone || ''}<br>
    ${client.email || 'Sans email'}<br>
    ${client.adresse || 'Sans adresse'}
  `;
}

function updateMetrics() {
  const stationId = getSelectedStationId();
  const carburantId = getSelectedCarburantId();
  const quantite = Number(form.quantite.value || 0);
  const reduction = Number(form.reduction.value || 0);
  const devise = form.devise_paiement.value;

  const tarif = getTarifActif(stationId, carburantId);
  const taux = getTauxActif(stationId);
  const stockSelection = stocksStations.find((row) =>
    String(row.station_id) === String(stationId) && String(row.type_carburant_id) === String(carburantId)
  );

  if (!tarif || !taux) {
    metrics.innerHTML = `
      <article class="stock-sheet-metric"><span>Taux</span><strong>-</strong></article>
      <article class="stock-sheet-metric"><span>PU USD</span><strong>-</strong></article>
      <article class="stock-sheet-metric"><span>PU CDF</span><strong>-</strong></article>
      <article class="stock-sheet-metric"><span>Total net</span><strong>-</strong></article>
    `;
    return;
  }

  const prixUsd = Number(tarif.prix_unitaire_usd || 0);
  const tauxUsdCdf = Number(taux.taux_usd_cdf || 0);
  const prixCdf = prixUsd * tauxUsdCdf;
  const brut = quantite * (devise === 'CDF' ? prixCdf : prixUsd);
  const net = Math.max(brut - reduction, 0);

  if (!form.montant_paye.value) {
    form.montant_paye.value = net ? String(net) : '';
  }

  metrics.innerHTML = `
    <article class="stock-sheet-metric"><span>Taux USD/CDF</span><strong>${formatNumber(tauxUsdCdf)}</strong></article>
    <article class="stock-sheet-metric"><span>PU USD</span><strong>${formatNumber(prixUsd)}</strong></article>
    <article class="stock-sheet-metric"><span>PU CDF</span><strong>${formatNumber(prixCdf)}</strong></article>
    <article class="stock-sheet-metric"><span>Total net ${devise}</span><strong>${formatNumber(net)}</strong></article>
    <article class="stock-sheet-metric"><span>Stock actuel</span><strong>${formatNumber(stockSelection?.quantite_disponible || 0)} L</strong></article>
  `;
}

function renderHistory() {
  const rows = auth.roleId === 4 && stationResponsable
    ? ventes.filter((row) => String(row.station_id) === String(stationResponsable.id))
    : ventes;

  if (rows.length === 0) {
    ventesBody.innerHTML = '<tr><td colspan="11" class="empty">Aucune vente enregistree.</td></tr>';
    return;
  }

  ventesBody.innerHTML = '';
  rows.forEach((row) => {
    const detteRestante = Number(row.montant_restant || 0);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.reference_vente || ''}</td>
      <td>${formatDate(row.date_vente)}</td>
      <td>${row.nom_station || getStationLabel(row.station_id)}</td>
      <td>${row.nom_client || ''}</td>
      <td>${row.telephone_client || ''}</td>
      <td>${row.nom_carburant || getCarburantLabel(row.type_carburant_id)}</td>
      <td>${formatNumber(row.quantite)}</td>
      <td>${row.devise_paiement || ''}</td>
      <td>${formatNumber(row.montant_net)}</td>
      <td>${formatNumber(detteRestante)}</td>
      <td>${detteRestante > 0 ? `<button class="btn btn-secondary btn-small" data-vente-id="${row.id}">Payer dette</button>` : ''}</td>
    `;
    ventesBody.appendChild(tr);
  });
}

async function chargerDonnees() {
  try {
    const [stationsRows, carburantsRows, clientsRows, tarifsRows, tauxData, ventesRows, stocksRows] = await Promise.all([
      apiRequete('stations'),
      apiRequete('types_carburant'),
      apiRequete('clients'),
      apiRequete('prix_carburants'),
      apiRequete('taux_change_stations'),
      apiRequete('ventes_station'),
      apiRequete('stocks_stations'),
    ]);

    stations = stationsRows;
    carburants = carburantsRows;
    clients = clientsRows;
    tarifs = tarifsRows;
    tauxRows = tauxData;
    ventes = ventesRows;
    stocksStations = stocksRows;

    findManagedStation();
    populateStations();
    populateCarburants();
    populatePhoneList();
    fillClientFromPhone();
    updateMetrics();
    renderStockSummary();
    renderHistory();
  } catch (error) {
    showNotice(error.message, true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = {
      station_id: getSelectedStationId(),
      type_carburant_id: getSelectedCarburantId(),
      telephone_client: normalisePhone(phoneInput.value),
      nom_client: clientNameInput.value.trim(),
      email_client: clientEmailInput.value.trim(),
      adresse_client: clientAdresseInput.value.trim(),
      quantite: Number(form.quantite.value || 0),
      devise_paiement: form.devise_paiement.value,
      reduction: Number(form.reduction.value || 0),
      montant_paye: Number(form.montant_paye.value || 0),
      date_vente: form.date_vente.value.replace('T', ' '),
      commentaire: form.commentaire.value.trim(),
    };

    const vente = await apiRequete('ventes_station', 'POST', payload);
    const messageParts = [`Vente enregistree avec succes. Reference: ${vente.reference_vente}`];
    if (Number(vente.montant_restant || 0) > 0) {
      messageParts.push(`Dette restante: ${formatNumber(vente.montant_restant)} ${payload.devise_paiement}`);
    }
    showNotice(messageParts.join(' - '));
    form.reset();
    form.date_vente.value = formatDateInputNow();
    if (auth.roleId === 4 && stationResponsable) {
      stationSelect.value = String(stationResponsable.id);
    }
    clientPreview.textContent = 'Saisissez un numero de telephone pour retrouver automatiquement le client.';
    await chargerDonnees();
  } catch (error) {
    showNotice(error.message, true);
  }
});

stationSelect.addEventListener('change', () => {
  updateMetrics();
  renderStockSummary();
});
carburantSelect.addEventListener('change', updateMetrics);
form.quantite.addEventListener('input', updateMetrics);
form.devise_paiement.addEventListener('change', updateMetrics);
form.reduction.addEventListener('input', updateMetrics);
phoneInput.addEventListener('change', fillClientFromPhone);
phoneInput.addEventListener('blur', fillClientFromPhone);

ventesBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-vente-id]');
  if (!button) return;

  const venteId = button.dataset.venteId;
  const vente = ventes.find((row) => String(row.id) === String(venteId));
  if (!vente) return;

  const montantRestant = Number(vente.montant_restant || 0);
  if (montantRestant <= 0) {
    showNotice('Cette vente est déjà soldée.', true);
    return;
  }

  const montant = await openPaymentDialog(vente);
  if (montant === null) return;

  try {
    await apiRequete('ventes_station', 'PUT', { paiement: montant }, { id: vente.id });
    showNotice(`Paiement de ${formatNumber(montant)} ${vente.devise_paiement} enregistre.`);
    await chargerDonnees();
  } catch (error) {
    showNotice(error.message, true);
  }
});

form.date_vente.value = formatDateInputNow();
initPaymentDialog();
if (!canWrite) {
  form.closest('.card')?.remove();
  clientPreview.closest('.card')?.remove();
}
chargerDonnees();
