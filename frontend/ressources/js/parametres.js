import { apiRequete } from './api_client.js';

const profilForm = document.getElementById('profil-form');
const passwordForm = document.getElementById('password-form');
const preferencesForm = document.getElementById('preferences-form');

const profilNotice = document.getElementById('profil-notice');
const passwordNotice = document.getElementById('password-notice');
const preferencesNotice = document.getElementById('preferences-notice');

const dashboardControls = document.getElementById('dashboard-controls');
const analyticsToggles = document.getElementById('analytics-toggles');

const BTN_REFRESH = document.getElementById('btn-refresh-data');
const BTN_RESET_DASHBOARD = document.getElementById('btn-reset-dashboard');
const BTN_RESET_LOCAL = document.getElementById('btn-reset-local');

const DASHBOARD_DEFAULTS = {
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

const DASHBOARD_CONTROLS = [
  { key: 'show_kpi', title: 'Cartes KPI', desc: 'Afficher les indicateurs de volume en haut du dashboard.' },
  { key: 'show_chart_stocks', title: 'Répartition des stocks', desc: 'Afficher le graphique des stocks faibles.' },
  { key: 'show_chart_livraisons', title: 'Livraisons par statut', desc: 'Afficher le diagramme par statut de livraison.' },
  { key: 'show_chart_alertes', title: 'État des alertes', desc: 'Afficher le graphique des niveaux d’alertes.' },
  { key: 'show_chart_appro', title: 'Volumes des contenus', desc: 'Afficher le graphique des volumes approvisionnés.' },
  { key: 'show_table_stocks', title: 'Table stocks dépôts', desc: 'Afficher le tableau détaillé des stocks faibles.' },
  { key: 'show_table_livraisons', title: 'Table livraisons récentes', desc: 'Afficher le tableau des dernières livraisons.' },
];

const ANALYTICS_CONTROLS = [
  { key: 'show_profile_card', title: 'Carte profil actuel', desc: 'Afficher la fiche résumé du profil dans le dashboard.' },
  { key: 'show_publications_card', title: 'Carte dernières publications', desc: 'Afficher les indicateurs de synthèse supplémentaires.' },
  { key: 'auto_refresh', title: 'Rafraîchissement automatique', desc: 'Recharger automatiquement les données du dashboard.' },
  { key: 'dark_theme', title: 'Mode sombre global', desc: 'Appliquer le thème sombre à toute l’interface.' },
  { key: 'compact_mode', title: 'Mode compact global', desc: 'Réduire les espacements pour afficher plus de contenu.' },
];

function showNotice(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.className = isError ? 'notice error' : 'notice';
}

function getDashboardConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('fueltrack_dashboard_cfg') || '{}');
    const merged = { ...DASHBOARD_DEFAULTS, ...saved };
    Object.keys(DASHBOARD_DEFAULTS).forEach((key) => {
      if (typeof DASHBOARD_DEFAULTS[key] === 'boolean') {
        if (merged[key] === 'true') merged[key] = true;
        if (merged[key] === 'false') merged[key] = false;
      }
    });
    return merged;
  } catch (_error) {
    return { ...DASHBOARD_DEFAULTS };
  }
}

function saveDashboardConfig(cfg) {
  localStorage.setItem('fueltrack_dashboard_cfg', JSON.stringify(cfg));
}

function saveAndApplyDashboardSettings(noticeMessage = 'Paramètres enregistrés.') {
  const cfg = collectSettingsFromUI();
  saveDashboardConfig(cfg);
  applyTheme(!!cfg.dark_theme);
  applyCompact(!!cfg.compact_mode);
  showNotice(preferencesNotice, noticeMessage);
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('fueltrack_theme', isDark ? 'dark' : 'light');
  const icon = document.querySelector('#theme-toggle i');
  if (icon) {
    icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }
}

function applyCompact(compactOn) {
  document.body.classList.toggle('compact-theme', compactOn);
  localStorage.setItem('fueltrack_compact', compactOn ? 'on' : 'off');
}

function createToggleRow(control, checked) {
  const row = document.createElement('label');
  row.className = 'settings-row';
  row.innerHTML = `
    <div>
      <h3>${control.title}</h3>
      <p>${control.desc}</p>
    </div>
    <input type="checkbox" data-key="${control.key}" ${checked ? 'checked' : ''}>
  `;
  return row;
}

function renderSettingsUI() {
  const cfg = getDashboardConfig();

  dashboardControls.innerHTML = '';
  DASHBOARD_CONTROLS.forEach((control) => {
    dashboardControls.appendChild(createToggleRow(control, !!cfg[control.key]));
  });

  const themeSaved = localStorage.getItem('fueltrack_theme') === 'dark';
  const compactSaved = localStorage.getItem('fueltrack_compact') === 'on';

  analyticsToggles.innerHTML = '';
  ANALYTICS_CONTROLS.forEach((control) => {
    let checked = !!cfg[control.key];
    if (control.key === 'dark_theme') checked = themeSaved;
    if (control.key === 'compact_mode') checked = compactSaved;
    analyticsToggles.appendChild(createToggleRow(control, checked));
  });

  const periodSelect = document.getElementById('pref-analyse');
  if (periodSelect) {
    periodSelect.value = cfg.analyse_periode || 'all';
  }

  bindPreferencesAutoSave();
}

function collectSettingsFromUI() {
  const cfg = getDashboardConfig();
  document.querySelectorAll('.settings-row input[type="checkbox"][data-key]').forEach((checkbox) => {
    cfg[checkbox.dataset.key] = checkbox.checked;
  });

  const periodSelect = document.getElementById('pref-analyse');
  cfg.analyse_periode = periodSelect ? periodSelect.value : 'all';

  return cfg;
}

function bindPreferencesAutoSave() {
  document.querySelectorAll('.settings-row input[type="checkbox"][data-key]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      saveAndApplyDashboardSettings('Paramètre mis à jour.');
    });
  });

  const periodSelect = document.getElementById('pref-analyse');
  if (periodSelect) {
    periodSelect.addEventListener('change', () => {
      saveAndApplyDashboardSettings('Paramètre mis à jour.');
    });
  }
}

async function chargerProfil() {
  try {
    const profil = await apiRequete('parametres');

    document.getElementById('param-nom').value = profil.nom || '';
    document.getElementById('param-prenom').value = profil.prenom || '';
    document.getElementById('param-email').value = profil.email || '';
    document.getElementById('param-telephone').value = profil.telephone || '';
    document.getElementById('param-role').value = profil.nom_role || '';
    document.getElementById('param-statut').value = profil.statut || '';

    const authRaw = sessionStorage.getItem('fueltrack_user');
    let auth = authRaw ? JSON.parse(authRaw) : {};
    auth = {
      ...auth,
      id: profil.id,
      nom: profil.nom,
      prenom: profil.prenom,
      email: profil.email,
      role_id: profil.role_id,
      statut: profil.statut,
      nom_role: profil.nom_role,
    };
    sessionStorage.setItem('fueltrack_user', JSON.stringify(auth));

    const chip = document.querySelector('.user-chip');
    if (chip) {
      chip.innerHTML = `<b>${(profil.nom || '').toUpperCase()} ${profil.prenom || ''}</b> · ${profil.nom_role || ''}`;
    }
  } catch (error) {
    showNotice(profilNotice, error.message, true);
  }
}

profilForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    nom: profilForm.nom.value.trim(),
    prenom: profilForm.prenom.value.trim(),
    email: profilForm.email.value.trim(),
    telephone: profilForm.telephone.value.trim(),
  };

  try {
    await apiRequete('parametres', 'PUT', payload);
    showNotice(profilNotice, 'Profil mis à jour avec succès.');
    await chargerProfil();
  } catch (error) {
    showNotice(profilNotice, error.message, true);
  }
});

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const current = passwordForm.mot_de_passe_actuel.value;
  const next = passwordForm.mot_de_passe_nouveau.value;
  const confirm = passwordForm.mot_de_passe_confirm.value;

  if (next !== confirm) {
    showNotice(passwordNotice, 'La confirmation du mot de passe ne correspond pas.', true);
    return;
  }

  try {
    await apiRequete('parametres', 'PUT', {
      mot_de_passe_actuel: current,
      mot_de_passe_nouveau: next,
    });
    passwordForm.reset();
    showNotice(passwordNotice, 'Mot de passe mis à jour avec succès.');
  } catch (error) {
    showNotice(passwordNotice, error.message, true);
  }
});

BTN_REFRESH?.addEventListener('click', () => {
  sessionStorage.setItem('fueltrack_dashboard_force_refresh', String(Date.now()));
  window.location.href = 'tableau_de_bord.html';
});

BTN_RESET_DASHBOARD?.addEventListener('click', () => {
  localStorage.setItem('fueltrack_dashboard_cfg', JSON.stringify(DASHBOARD_DEFAULTS));
  renderSettingsUI();
  saveAndApplyDashboardSettings('Paramètres dashboard réinitialisés.');
  showNotice(preferencesNotice, 'Paramètres dashboard réinitialisés.');
});

BTN_RESET_LOCAL?.addEventListener('click', () => {
  localStorage.removeItem('fueltrack_dashboard_cfg');
  localStorage.removeItem('fueltrack_compact');
  localStorage.removeItem('fueltrack_theme');
  applyTheme(false);
  applyCompact(false);
  renderSettingsUI();
  saveAndApplyDashboardSettings('Données locales réinitialisées.');
  showNotice(preferencesNotice, 'Données locales réinitialisées.');
});

(function init() {
  const savedTheme = localStorage.getItem('fueltrack_theme') || 'light';
  const savedCompact = localStorage.getItem('fueltrack_compact') || 'off';
  applyTheme(savedTheme === 'dark');
  applyCompact(savedCompact === 'on');
  renderSettingsUI();
})();

chargerProfil();
