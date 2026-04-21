import { apiRequete } from './api_client.js';

const counters = document.getElementById('panel-kpi');
const stocksBody = document.getElementById('stocks-body');
const livraisonsBody = document.getElementById('livraisons-body');
const profileCardBody = document.getElementById('profile-card-body');
const publicationsCardBody = document.getElementById('publications-card-body');
const feedback = document.getElementById('dashboard-feedback');
const stocksFilterChip = document.getElementById('stocks-filter-chip');
const livraisonsFilterChip = document.getElementById('livraisons-filter-chip');
const actionOpenDettes = document.getElementById('action-open-dettes');
const actionClearFilters = document.getElementById('action-clear-filters');

const DEFAULT_CFG = {
  show_kpi: true,
  show_chart_stocks: true,
  show_chart_livraisons: true,
  show_chart_alertes: true,
  show_chart_appro: true,
  show_chart_dettes: true,
  show_table_stocks: true,
  show_table_livraisons: true,
  show_profile_card: true,
  show_publications_card: true,
  show_dashboard_actions: true,
  analyse_periode: 'all',
  auto_refresh: false,
};

const KPI_LINKS = {
  utilisateurs: 'utilisateurs.html',
  fournisseurs: 'fournisseurs.html',
  depots: 'depots.html',
  stations: 'stations.html',
  vehicules: 'vehicules.html',
  approvisionnements: 'approvisionnements.html',
  livraisons: 'livraisons.html',
  alertes_ouvertes: 'alertes.html',
};

const filters = {
  stockIndex: null,
  livraisonStatut: null,
};

const chartInstances = {
  stocks: null,
  livraisons: null,
  alertes: null,
  appro: null,
  dettes: null,
};

let stocksRows = [];
let livraisonsRows = [];
let ventesRows = [];

function getCfg() {
  try {
    const saved = JSON.parse(localStorage.getItem('fueltrack_dashboard_cfg') || '{}');
    const merged = { ...DEFAULT_CFG, ...saved };
    Object.keys(DEFAULT_CFG).forEach((key) => {
      if (typeof DEFAULT_CFG[key] === 'boolean') {
        if (merged[key] === 'true') merged[key] = true;
        if (merged[key] === 'false') merged[key] = false;
      }
    });
    return merged;
  } catch (_error) {
    return { ...DEFAULT_CFG };
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function showFeedback(message, type = 'info') {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `notice ${type}`;
}

function makeMetric(title, value, href = null) {
  const card = href ? document.createElement('button') : document.createElement('div');
  card.className = `metric${href ? ' metric-action' : ''}`;
  if (href) {
    card.type = 'button';
    card.addEventListener('click', () => {
      window.location.href = href;
    });
  }
  card.innerHTML = `<span>${title}</span><strong>${value}</strong>`;
  return card;
}

function destroyChart(chartKey) {
  const chart = chartInstances[chartKey];
  if (chart) {
    chart.destroy();
    chartInstances[chartKey] = null;
  }
}

function buildChart(chartKey, id, type, labels, data, label, color, onClick = null) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === 'undefined') return;

  destroyChart(chartKey);

  chartInstances[chartKey] = new Chart(canvas, {
    type,
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: Array.isArray(color) ? color : `${color}66`,
        borderColor: Array.isArray(color) ? color : color,
        borderWidth: 2,
        fill: type === 'line',
        tension: 0.25,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: type !== 'bar' },
        tooltip: { enabled: true },
      },
      scales: type === 'doughnut' ? {} : { y: { beginAtZero: true } },
      onClick: (_event, elements) => {
        if (!onClick || !elements || elements.length === 0) return;
        const index = elements[0].index;
        onClick(index);
      },
      onHover: (event, elements) => {
        const target = event?.native?.target;
        if (target) {
          target.style.cursor = elements && elements.length > 0 ? 'pointer' : 'default';
        }
      },
    },
  });
}

function togglePanel(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = show ? '' : 'none';
}

function filterLivraisonsByPeriod(rows, period) {
  if (period === 'all') return rows;
  const now = new Date();
  const months = period === '6m' ? 6 : 12;
  const minDate = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());

  return rows.filter((row) => {
    const d = new Date(row.date_depart);
    return !Number.isNaN(d.getTime()) && d >= minDate;
  });
}

function getRestant(vente) {
  return Math.max(0, Number(vente.montant_net || 0) - Number(vente.montant_paye || 0));
}

function renderStocksTable() {
  const rows = filters.stockIndex === null
    ? stocksRows
    : stocksRows.filter((_, index) => index === filters.stockIndex);

  if (stocksFilterChip) {
    if (filters.stockIndex === null || !rows[0]) {
      stocksFilterChip.hidden = true;
      stocksFilterChip.textContent = '';
    } else {
      stocksFilterChip.hidden = false;
      stocksFilterChip.textContent = `Filtre actif: ${rows[0].nom_depot} - ${rows[0].nom_carburant}`;
    }
  }

  stocksBody.innerHTML = '';
  if (rows.length === 0) {
    stocksBody.innerHTML = '<tr><td colspan="4" class="empty">Aucune donnée pour ce filtre.</td></tr>';
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.nom_depot}</td><td>${row.nom_carburant}</td><td>${formatNumber(row.quantite_disponible)}</td><td>${formatNumber(row.seuil_alerte)}</td>`;
    stocksBody.appendChild(tr);
  });
}

function renderLivraisonsTable() {
  const rows = filters.livraisonStatut === null
    ? livraisonsRows
    : livraisonsRows.filter((row) => String(row.statut) === String(filters.livraisonStatut));

  if (livraisonsFilterChip) {
    if (filters.livraisonStatut === null) {
      livraisonsFilterChip.hidden = true;
      livraisonsFilterChip.textContent = '';
    } else {
      livraisonsFilterChip.hidden = false;
      livraisonsFilterChip.textContent = `Filtre actif: statut ${filters.livraisonStatut}`;
    }
  }

  livraisonsBody.innerHTML = '';
  if (rows.length === 0) {
    livraisonsBody.innerHTML = '<tr><td colspan="5" class="empty">Aucune livraison pour ce filtre.</td></tr>';
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.reference_livraison}</td><td>${row.nom_depot}</td><td>${row.nom_station}</td><td>${formatNumber(row.quantite)}</td><td>${row.statut}</td>`;
    livraisonsBody.appendChild(tr);
  });
}

function renderTables() {
  renderStocksTable();
  renderLivraisonsTable();
}

function clearDashboardFilters() {
  filters.stockIndex = null;
  filters.livraisonStatut = null;
  renderTables();
  showFeedback('Filtres réinitialisés.', 'info');
}

function fillExtraCards(rapports) {
  const authRaw = sessionStorage.getItem('fueltrack_user');
  const auth = authRaw ? JSON.parse(authRaw) : null;

  if (profileCardBody) {
    profileCardBody.innerHTML = auth
      ? `<p><strong>${auth.nom || ''} ${auth.prenom || ''}</strong></p><p>${auth.email || ''}</p><p>Rôle: ${auth.nom_role || auth.role_id || ''}</p>`
      : '<p>Profil non disponible.</p>';
  }

  if (publicationsCardBody) {
    publicationsCardBody.innerHTML = '';
    const items = (rapports.approvisionnements_par_carburant || []).slice(0, 3);
    if (items.length === 0) {
      publicationsCardBody.innerHTML = '<li>Aucun indicateur disponible.</li>';
    } else {
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.nom_carburant}: volume ${formatNumber(item.volume_total)}`;
        publicationsCardBody.appendChild(li);
      });
    }
  }
}

function applyVisibility(cfg) {
  togglePanel('panel-kpi', !!cfg.show_kpi);
  togglePanel('panel-chart-stocks', !!cfg.show_chart_stocks);
  togglePanel('panel-chart-livraisons', !!cfg.show_chart_livraisons);
  togglePanel('panel-chart-alertes', !!cfg.show_chart_alertes);
  togglePanel('panel-chart-appro', !!cfg.show_chart_appro);
  togglePanel('panel-chart-dettes', !!cfg.show_chart_dettes);
  togglePanel('panel-dashboard-actions', !!cfg.show_dashboard_actions);
  togglePanel('panel-table-stocks', !!cfg.show_table_stocks);
  togglePanel('panel-table-livraisons', !!cfg.show_table_livraisons);
  togglePanel('panel-profile-card', !!cfg.show_profile_card);
  togglePanel('panel-publications-card', !!cfg.show_publications_card);
}

function appliquerConfigurationCourante() {
  applyVisibility(getCfg());
}

function wireActions() {
  actionOpenDettes?.addEventListener('click', () => {
    window.location.href = 'dettes.html';
  });

  actionClearFilters?.addEventListener('click', () => {
    clearDashboardFilters();
  });
}

async function chargerDashboard() {
  const cfg = getCfg();

  try {
    const [dashboard, rapports, ventesData] = await Promise.all([
      apiRequete('dashboard'),
      apiRequete('rapports'),
      apiRequete('ventes_station'),
    ]);

    ventesRows = ventesData || [];
    const livraisonsFiltered = filterLivraisonsByPeriod(dashboard.livraisons_recentes || [], cfg.analyse_periode);
    stocksRows = dashboard.stocks_depots || [];
    livraisonsRows = livraisonsFiltered;

    counters.innerHTML = '';
    Object.entries(dashboard.compteurs || {}).forEach(([key, value]) => {
      const href = KPI_LINKS[key] || null;
      counters.appendChild(makeMetric(key.replaceAll('_', ' '), formatNumber(value), href));
    });

    const dettesUsd = ventesRows
      .filter((row) => String(row.devise_paiement || '').toUpperCase() === 'USD')
      .reduce((sum, row) => sum + getRestant(row), 0);

    counters.appendChild(makeMetric('dettes clients USD', formatNumber(dettesUsd), 'dettes.html'));

    renderTables();

    const statCount = livraisonsRows.reduce((acc, row) => {
      acc[row.statut] = (acc[row.statut] || 0) + 1;
      return acc;
    }, {});

    buildChart(
      'stocks',
      'chart-stocks',
      'bar',
      stocksRows.map((x) => `${x.nom_depot} - ${x.nom_carburant}`),
      stocksRows.map((x) => Number(x.quantite_disponible || 0)),
      'Quantité',
      '#1186c9',
      (index) => {
        if (filters.stockIndex === index) {
          filters.stockIndex = null;
          showFeedback('Filtre stocks retiré.', 'info');
        } else {
          filters.stockIndex = index;
          const row = stocksRows[index];
          if (row) {
            showFeedback(`Filtre stocks: ${row.nom_depot} - ${row.nom_carburant}.`, 'info');
          }
        }
        renderStocksTable();
      }
    );

    const livraisonLabels = Object.keys(statCount);
    buildChart(
      'livraisons',
      'chart-livraisons',
      'doughnut',
      livraisonLabels,
      Object.values(statCount),
      'Livraisons',
      ['#0e1d3d', '#1186c9', '#0ea5e9', '#8fb9d6'],
      (index) => {
        const statut = livraisonLabels[index];
        if (!statut) return;
        if (filters.livraisonStatut === statut) {
          filters.livraisonStatut = null;
          showFeedback('Filtre livraisons retiré.', 'info');
        } else {
          filters.livraisonStatut = statut;
          showFeedback(`Filtre livraisons: statut ${statut}.`, 'info');
        }
        renderLivraisonsTable();
      }
    );

    buildChart(
      'alertes',
      'chart-alertes',
      'line',
      (rapports.alertes_par_niveau || []).map((x) => x.niveau),
      (rapports.alertes_par_niveau || []).map((x) => Number(x.total || 0)),
      'Alertes',
      '#0e1d3d',
      () => {
        window.location.href = 'alertes.html';
      }
    );

    buildChart(
      'appro',
      'chart-appro',
      'bar',
      (rapports.approvisionnements_par_carburant || []).map((x) => x.nom_carburant),
      (rapports.approvisionnements_par_carburant || []).map((x) => Number(x.volume_total || 0)),
      'Volume',
      '#0ea5e9',
      () => {
        window.location.href = 'approvisionnements.html';
      }
    );

    const nbEnDette = ventesRows.filter((row) => getRestant(row) > 0.00001).length;
    const nbSoldes = Math.max(0, ventesRows.length - nbEnDette);
    const detteLabels = ['En dette', 'Soldées'];

    buildChart(
      'dettes',
      'chart-dettes',
      'doughnut',
      detteLabels,
      [nbEnDette, nbSoldes],
      'Ventes',
      ['#e02424', '#00c9a7'],
      (index) => {
        if (detteLabels[index] === 'En dette') {
          window.location.href = 'dettes.html';
        } else {
          window.location.href = 'ventes_station.html';
        }
      }
    );

    fillExtraCards(rapports);
    applyVisibility(cfg);

    if (cfg.auto_refresh) {
      setTimeout(() => window.location.reload(), 120000);
    }
  } catch (error) {
    counters.innerHTML = `<div class="metric"><span>Erreur</span><strong style="font-size:18px;">${error.message}</strong></div>`;
    showFeedback(error.message, 'error');
  }
}

if (sessionStorage.getItem('fueltrack_dashboard_force_refresh')) {
  sessionStorage.removeItem('fueltrack_dashboard_force_refresh');
}

wireActions();
chargerDashboard();

window.addEventListener('pageshow', () => {
  appliquerConfigurationCourante();
});

window.addEventListener('storage', (event) => {
  if (event.key === 'fueltrack_dashboard_cfg') {
    appliquerConfigurationCourante();
  }
});
