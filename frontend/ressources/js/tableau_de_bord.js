import { apiRequete } from './api_client.js';

const counters = document.getElementById('panel-kpi');
const stocksBody = document.getElementById('stocks-body');
const livraisonsBody = document.getElementById('livraisons-body');
const profileCardBody = document.getElementById('profile-card-body');
const publicationsCardBody = document.getElementById('publications-card-body');

const DEFAULT_CFG = {
  show_kpi: true,
  show_chart_stocks: true,
  show_chart_livraisons: true,
  show_chart_alertes: true,
  show_chart_appro: true,
  show_table_stocks: true,
  show_table_livraisons: true,
  show_profile_card: true,
  show_publications_card: true,
  analyse_periode: 'all',
  auto_refresh: false,
};

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

function makeMetric(title, value) {
  const card = document.createElement('div');
  card.className = 'metric';
  card.innerHTML = `<span>${title}</span><strong>${value}</strong>`;
  return card;
}

function buildChart(id, type, labels, data, label, color) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type,
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: Array.isArray(color) ? color : color + '66',
        borderColor: Array.isArray(color) ? color : color,
        borderWidth: 2,
        fill: type === 'line',
        tension: 0.25,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: type !== 'bar' } },
      scales: type === 'doughnut' ? {} : { y: { beginAtZero: true } },
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

function fillExtraCards(data, rapports) {
  const authRaw = sessionStorage.getItem('fueltrack_user');
  const auth = authRaw ? JSON.parse(authRaw) : null;

  if (profileCardBody) {
    profileCardBody.innerHTML = auth
      ? `<p><strong>${auth.nom || ''} ${auth.prenom || ''}</strong></p><p>${auth.email || ''}</p><p>Rôle: ${auth.nom_role || auth.role_id || ''}</p>`
      : '<p>Profil non disponible.</p>';
  }

  if (publicationsCardBody) {
    publicationsCardBody.innerHTML = '';
    const items = rapports.approvisionnements_par_carburant.slice(0, 3);
    if (items.length === 0) {
      publicationsCardBody.innerHTML = '<li>Aucun indicateur disponible.</li>';
    } else {
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.nom_carburant}: volume ${item.volume_total}`;
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
  togglePanel('panel-table-stocks', !!cfg.show_table_stocks);
  togglePanel('panel-table-livraisons', !!cfg.show_table_livraisons);
  togglePanel('panel-profile-card', !!cfg.show_profile_card);
  togglePanel('panel-publications-card', !!cfg.show_publications_card);
}

function appliquerConfigurationCourante() {
  applyVisibility(getCfg());
}

async function chargerDashboard() {
  const cfg = getCfg();

  try {
    const [dashboard, rapports] = await Promise.all([
      apiRequete('dashboard'),
      apiRequete('rapports'),
    ]);

    const livraisonsFiltered = filterLivraisonsByPeriod(dashboard.livraisons_recentes || [], cfg.analyse_periode);

    counters.innerHTML = '';
    Object.entries(dashboard.compteurs || {}).forEach(([key, value]) => {
      counters.appendChild(makeMetric(key.replaceAll('_', ' '), value));
    });

    stocksBody.innerHTML = '';
    (dashboard.stocks_depots || []).forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.nom_depot}</td><td>${row.nom_carburant}</td><td>${row.quantite_disponible}</td><td>${row.seuil_alerte}</td>`;
      stocksBody.appendChild(tr);
    });

    livraisonsBody.innerHTML = '';
    livraisonsFiltered.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.reference_livraison}</td><td>${row.nom_depot}</td><td>${row.nom_station}</td><td>${row.quantite}</td><td>${row.statut}</td>`;
      livraisonsBody.appendChild(tr);
    });

    const statCount = livraisonsFiltered.reduce((acc, row) => {
      acc[row.statut] = (acc[row.statut] || 0) + 1;
      return acc;
    }, {});

    buildChart(
      'chart-stocks',
      'bar',
      (dashboard.stocks_depots || []).map((x) => `${x.nom_depot} - ${x.nom_carburant}`),
      (dashboard.stocks_depots || []).map((x) => Number(x.quantite_disponible || 0)),
      'Quantité',
      '#1186c9'
    );

    buildChart(
      'chart-livraisons',
      'doughnut',
      Object.keys(statCount),
      Object.values(statCount),
      'Livraisons',
      ['#0e1d3d', '#1186c9', '#0ea5e9', '#8fb9d6']
    );

    buildChart(
      'chart-alertes',
      'line',
      (rapports.alertes_par_niveau || []).map((x) => x.niveau),
      (rapports.alertes_par_niveau || []).map((x) => Number(x.total || 0)),
      'Alertes',
      '#0e1d3d'
    );

    buildChart(
      'chart-appro',
      'bar',
      (rapports.approvisionnements_par_carburant || []).map((x) => x.nom_carburant),
      (rapports.approvisionnements_par_carburant || []).map((x) => Number(x.volume_total || 0)),
      'Volume',
      '#0ea5e9'
    );

    fillExtraCards(dashboard, rapports);
    applyVisibility(cfg);

    if (cfg.auto_refresh) {
      setTimeout(() => window.location.reload(), 120000);
    }
  } catch (error) {
    counters.innerHTML = `<div class="metric"><span>Erreur</span><strong style="font-size:18px;">${error.message}</strong></div>`;
  }
}

if (sessionStorage.getItem('fueltrack_dashboard_force_refresh')) {
  sessionStorage.removeItem('fueltrack_dashboard_force_refresh');
}

chargerDashboard();

window.addEventListener('pageshow', () => {
  appliquerConfigurationCourante();
});

window.addEventListener('storage', (event) => {
  if (event.key === 'fueltrack_dashboard_cfg') {
    appliquerConfigurationCourante();
  }
});
