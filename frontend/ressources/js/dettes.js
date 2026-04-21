import { apiRequete } from './api_client.js';

const notice = document.getElementById('dettes-notice');
const metrics = document.getElementById('dettes-metrics');
const body = document.getElementById('dettes-body');
const btnRefresh = document.getElementById('dettes-refresh');

const auth = window.FUELTRACK_AUTH || {};
const canWrite = auth.pageMode === 'rw';

let ventes = [];
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

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('fr-FR');
}

function parseAmount(value) {
  return Number(String(value ?? '').replace(',', '.').trim());
}

function getRestant(vente) {
  const net = Number(vente.montant_net || 0);
  const paye = Number(vente.montant_paye || 0);
  return Math.max(0, net - paye);
}

function renderMetrics(rows) {
  const totalUSD = rows
    .filter((row) => String(row.devise_paiement || '').toUpperCase() === 'USD')
    .reduce((sum, row) => sum + getRestant(row), 0);

  const totalCDF = rows
    .filter((row) => String(row.devise_paiement || '').toUpperCase() === 'CDF')
    .reduce((sum, row) => sum + getRestant(row), 0);

  metrics.innerHTML = `
    <article class="stock-sheet-metric">
      <span>Dettes en cours</span>
      <strong>${rows.length}</strong>
    </article>
    <article class="stock-sheet-metric">
      <span>Total dette USD</span>
      <strong>${formatNumber(totalUSD)}</strong>
    </article>
    <article class="stock-sheet-metric">
      <span>Total dette CDF</span>
      <strong>${formatNumber(totalCDF)}</strong>
    </article>
    <article class="stock-sheet-metric">
      <span>Total general (indicatif)</span>
      <strong>${formatNumber(totalUSD)} USD + ${formatNumber(totalCDF)} CDF</strong>
    </article>
  `;
}

function renderTable(rows) {
  if (rows.length === 0) {
    body.innerHTML = '<tr><td colspan="10" class="empty">Aucune dette en cours.</td></tr>';
    return;
  }

  body.innerHTML = '';
  rows.forEach((row) => {
    const restante = getRestant(row);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.reference_vente || ''}</td>
      <td>${formatDate(row.date_vente)}</td>
      <td>${row.nom_station || ''}</td>
      <td>${row.nom_client || ''}</td>
      <td>${row.telephone_client || ''}</td>
      <td>${row.devise_paiement || ''}</td>
      <td>${formatNumber(row.montant_net)}</td>
      <td>${formatNumber(row.montant_paye)}</td>
      <td>${formatNumber(restante)}</td>
      <td>${canWrite ? `<button class="btn btn-secondary btn-small" data-vente-id="${row.id}">Payer</button>` : ''}</td>
    `;
    body.appendChild(tr);
  });
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
  const montantRestant = getRestant(vente);

  paymentTitle.textContent = `Payer la dette - ${vente.reference_vente || ''}`;
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

async function chargerDettes() {
  try {
    const rows = await apiRequete('ventes_station');
    ventes = rows
      .map((row) => ({
        ...row,
        montant_restant: getRestant(row),
      }))
      .filter((row) => row.montant_restant > 0.00001)
      .sort((a, b) => new Date(b.date_vente) - new Date(a.date_vente));

    renderMetrics(ventes);
    renderTable(ventes);
  } catch (error) {
    showNotice(error.message, true);
  }
}

body.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-vente-id]');
  if (!button || !canWrite) return;

  const venteId = button.dataset.venteId;
  const vente = ventes.find((row) => String(row.id) === String(venteId));
  if (!vente) return;

  const montant = await openPaymentDialog(vente);
  if (montant === null) return;

  try {
    const updated = await apiRequete('ventes_station', 'PUT', { paiement: montant }, { id: vente.id });
    const restant = Math.max(0, Number(updated.montant_restant || 0));
    showNotice(`Paiement enregistre: ${formatNumber(montant)} ${vente.devise_paiement}. Reste: ${formatNumber(restant)} ${vente.devise_paiement}.`);
    await chargerDettes();
  } catch (error) {
    showNotice(error.message, true);
  }
});

btnRefresh?.addEventListener('click', () => {
  showNotice('Actualisation en cours...');
  chargerDettes();
});

initPaymentDialog();
if (!canWrite) {
  showNotice('Mode lecture seule: paiement des dettes desactive.', false);
}
chargerDettes();
