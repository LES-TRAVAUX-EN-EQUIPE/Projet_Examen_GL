import { apiRequete } from './api_client.js';

const ROLE_NAMES = {
  1: 'Administrateur',
  2: 'Gestionnaire de stock',
  3: 'Responsable logistique',
  4: 'Responsable station',
  5: 'Superviseur',
};

const ROLE_POLICY = {
  1: {
    pages: {
      'tableau_de_bord.html': 'rw',
      'clients.html': 'rw',
      'utilisateurs.html': 'rw',
      'fournisseurs.html': 'rw',
      'depots.html': 'rw',
      'stations.html': 'rw',
      'vehicules.html': 'rw',
      'types_carburant.html': 'rw',
      'prix_carburants.html': 'rw',
      'taux_change_stations.html': 'rw',
      'approvisionnements.html': 'rw',
      'livraisons.html': 'rw',
      'mouvements_stock.html': 'rw',
      'ventes_station.html': 'rw',
      'dettes.html': 'rw',
      'alertes.html': 'rw',
      'rapports.html': 'r',
      'parametres.html': 'rw',
    },
    entitiesWrite: ['*'],
  },
  2: {
    pages: {
      'tableau_de_bord.html': 'r',
      'clients.html': 'r',
      'fournisseurs.html': 'rw',
      'depots.html': 'rw',
      'types_carburant.html': 'rw',
      'prix_carburants.html': 'r',
      'taux_change_stations.html': 'r',
      'approvisionnements.html': 'rw',
      'mouvements_stock.html': 'rw',
      'ventes_station.html': 'r',
      'dettes.html': 'r',
      'alertes.html': 'rw',
      'rapports.html': 'r',
      'parametres.html': 'rw',
    },
    entitiesWrite: ['fournisseurs', 'depots', 'types_carburant', 'approvisionnements', 'mouvements_stock', 'alertes'],
  },
  3: {
    pages: {
      'tableau_de_bord.html': 'r',
      'clients.html': 'r',
      'vehicules.html': 'rw',
      'livraisons.html': 'rw',
      'stations.html': 'r',
      'prix_carburants.html': 'r',
      'taux_change_stations.html': 'r',
      'ventes_station.html': 'r',
      'dettes.html': 'r',
      'depots.html': 'r',
      'alertes.html': 'rw',
      'rapports.html': 'r',
      'parametres.html': 'rw',
    },
    entitiesWrite: ['vehicules', 'livraisons', 'alertes'],
  },
  4: {
    pages: {
      'tableau_de_bord.html': 'r',
      'clients.html': 'r',
      'stations.html': 'r',
      'livraisons.html': 'r',
      'prix_carburants.html': 'r',
      'taux_change_stations.html': 'rw',
      'ventes_station.html': 'rw',
      'dettes.html': 'rw',
      'alertes.html': 'rw',
      'rapports.html': 'r',
      'parametres.html': 'rw',
    },
    entitiesWrite: ['alertes', 'taux_change_stations', 'ventes_station'],
  },
  5: {
    pages: {
      'tableau_de_bord.html': 'r',
      'ventes_station.html': 'r',
      'dettes.html': 'r',
      'alertes.html': 'r',
      'rapports.html': 'r',
      'parametres.html': 'rw',
    },
    entitiesWrite: [],
  },
};

const MENU_GROUPS = [
  {
    title: 'Acteurs',
    icon: 'bi-people-fill',
    items: [
      { href: 'clients.html', label: 'Clients', icon: 'bi-person-vcard-fill' },
      { href: 'utilisateurs.html', label: 'Utilisateurs', icon: 'bi-people-fill' },
      { href: 'fournisseurs.html', label: 'Fournisseurs', icon: 'bi-building' },
    ],
  },
  {
    title: 'Infrastructure',
    icon: 'bi-hdd-network',
    items: [
      { href: 'depots.html', label: 'Dépôts', icon: 'bi-box-seam' },
      { href: 'stations.html', label: 'Stations', icon: 'bi-geo-alt-fill' },
      { href: 'vehicules.html', label: 'Véhicules', icon: 'bi-truck' },
      { href: 'types_carburant.html', label: 'Types carburant', icon: 'bi-fuel-pump-fill' },
    ],
  },
  {
    title: 'Opérations',
    icon: 'bi-activity',
    items: [
      { href: 'approvisionnements.html', label: 'Approvisionnements', icon: 'bi-box-arrow-in-down' },
      { href: 'livraisons.html', label: 'Livraisons', icon: 'bi-send-check' },
      { href: 'mouvements_stock.html', label: 'Mouvements stock', icon: 'bi-arrow-left-right' },
      { href: 'ventes_station.html', label: 'Ventes station', icon: 'bi-receipt-cutoff' },
      { href: 'dettes.html', label: 'Dettes', icon: 'bi-wallet2' },
      { href: 'alertes.html', label: 'Alertes', icon: 'bi-exclamation-triangle-fill' },
    ],
  },
  {
    title: 'Pilotage',
    icon: 'bi-speedometer2',
    items: [
      { href: 'prix_carburants.html', label: 'Tarifs station', icon: 'bi-cash-coin' },
      { href: 'taux_change_stations.html', label: 'Taux de change', icon: 'bi-currency-exchange' },
      { href: 'rapports.html', label: 'Rapports', icon: 'bi-graph-up-arrow' },
      { href: 'parametres.html', label: 'Paramètres', icon: 'bi-gear-fill' },
    ],
  },
];

function getCurrentPage() {
  const page = window.location.pathname.split('/').pop();
  return page || 'tableau_de_bord.html';
}

function renderSidebar(page, allowedPages) {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const brand = sidebar.querySelector('.brand');
  const brandHtml = brand ? brand.outerHTML : '<h2 class="brand">FuelTrack</h2>';
  let html = `${brandHtml}<a class="nav-link ${page === 'tableau_de_bord.html' ? 'active' : ''}" href="tableau_de_bord.html"><i class="bi bi-grid-fill"></i><span>Tableau de bord</span></a>`;

  MENU_GROUPS.forEach((group, index) => {
    const visibles = group.items.filter((item) => allowedPages.includes(item.href));
    if (visibles.length === 0) return;

    const groupId = `group-${index}`;
    const hasActive = visibles.some((item) => item.href === page);
    const expanded = hasActive ? 'true' : 'false';
    const openClass = hasActive ? 'open' : '';

    html += `<button class="menu-group-toggle ${openClass}" type="button" data-target="${groupId}" aria-expanded="${expanded}">
      <span class="menu-group-left"><i class="bi ${group.icon}"></i><span>${group.title}</span></span>
      <i class="bi bi-chevron-down menu-chevron"></i>
    </button>`;
    html += `<div class="menu-group-panel ${openClass}" id="${groupId}">`;
    visibles.forEach((item) => {
      const active = item.href === page ? 'active' : '';
      html += `<a class="nav-link sub ${active}" href="${item.href}"><i class="bi ${item.icon}"></i><span>${item.label}</span></a>`;
    });
    html += '</div>';
  });

  sidebar.innerHTML = html;

  sidebar.querySelectorAll('.menu-group-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (!target) return;
      const panel = sidebar.querySelector(`#${target}`);
      if (!panel) return;
      const isOpen = panel.classList.contains('open');

      sidebar.querySelectorAll('.menu-group-panel.open').forEach((openedPanel) => {
        if (openedPanel !== panel) {
          openedPanel.classList.remove('open');
          const openedButton = sidebar.querySelector(`.menu-group-toggle[data-target="${openedPanel.id}"]`);
          if (openedButton) {
            openedButton.classList.remove('open');
            openedButton.setAttribute('aria-expanded', 'false');
          }
        }
      });

      panel.classList.toggle('open', !isOpen);
      btn.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
}

function buildTopbar(user, roleId) {
  if (document.querySelector('.topbar')) return;

  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <div class="topbar-left">
      <button type="button" class="sidebar-toggle" id="sidebar-toggle" aria-label="Ouvrir le menu" aria-expanded="false">
        <i class="bi bi-list"></i>
      </button>
      <h2 class="topbar-title">Espace admin</h2>
    </div>
    <div class="topbar-user">
      <div class="topbar-actions">
        <button class="icon-btn notification-btn" type="button" id="notifications-btn" aria-label="Notifications">
          <i class="bi bi-bell-fill"></i>
          <span class="notification-badge" id="notifications-badge" hidden>0</span>
        </button>
        <button class="icon-btn" type="button" id="theme-toggle" aria-label="Thème"><i class="bi bi-moon-fill"></i></button>
      </div>
      <span class="user-chip"><b>${(user.nom || '').toUpperCase()} ${(user.prenom || '')}</b> · ${ROLE_NAMES[roleId] || 'Profil'}</span>
      <button type="button" class="logout-btn" id="logout-btn"><i class="bi bi-box-arrow-right"></i> Déconnexion</button>
    </div>
  `;

  document.body.appendChild(topbar);

  const btnLogout = document.getElementById('logout-btn');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('fueltrack_user');
      window.location.href = 'connexion.html';
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    const syncIcon = () => {
      if (!icon) return;
      const isDark = document.body.classList.contains('dark-theme');
      icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    };

    themeToggle.addEventListener('click', () => {
      const nextDark = !document.body.classList.contains('dark-theme');
      document.body.classList.toggle('dark-theme', nextDark);
      localStorage.setItem('fueltrack_theme', nextDark ? 'dark' : 'light');
      syncIcon();
    });

    syncIcon();
  }

  const notificationsBtn = document.getElementById('notifications-btn');
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', () => {
      window.location.href = 'alertes.html';
    });
  }

  const notificationsBadge = document.getElementById('notifications-badge');
  const actualiserBadgeNotifications = async () => {
    if (!notificationsBadge) return;

    try {
      const resultat = await apiRequete('dashboard');
      const compteur = Number(resultat?.compteurs?.alertes_ouvertes || 0);
      if (compteur > 0) {
        notificationsBadge.textContent = String(compteur);
        notificationsBadge.hidden = false;
      } else {
        notificationsBadge.hidden = true;
      }
    } catch (_error) {
      notificationsBadge.hidden = true;
    }
  };

  actualiserBadgeNotifications();
  window.setInterval(actualiserBadgeNotifications, 60000);
  document.addEventListener('fueltrack:notifications-updated', actualiserBadgeNotifications);
}

function initResponsiveSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  if (!sidebar || !toggle) return;

  let backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  const closeMobileMenu = () => {
    document.body.classList.remove('sidebar-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMobileMenu = () => {
    document.body.classList.add('sidebar-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    const opened = document.body.classList.contains('sidebar-open');
    if (opened) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  backdrop.addEventListener('click', closeMobileMenu);

  sidebar.querySelectorAll('a.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 980) closeMobileMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });
}

(function initAuthGuard() {
  const page = getCurrentPage();
  if (page === 'connexion.html' || page === 'index.html') return;

  const userRaw = sessionStorage.getItem('fueltrack_user');
  if (!userRaw) {
    window.location.href = 'connexion.html';
    return;
  }

  let user = null;
  try {
    user = JSON.parse(userRaw);
  } catch (_error) {
    sessionStorage.removeItem('fueltrack_user');
    window.location.href = 'connexion.html';
    return;
  }

  const roleId = Number(user.role_id || 0);
  const policy = ROLE_POLICY[roleId] || { pages: { 'tableau_de_bord.html': 'r' }, entitiesWrite: [] };
  const allowedPages = Object.keys(policy.pages);

  const savedTheme = localStorage.getItem('fueltrack_theme');
  document.body.classList.toggle('dark-theme', savedTheme === 'dark');
  const savedCompact = localStorage.getItem('fueltrack_compact');
  document.body.classList.toggle('compact-theme', savedCompact === 'on');

  if (!allowedPages.includes(page)) {
    window.location.href = allowedPages[0] || 'tableau_de_bord.html';
    return;
  }

  renderSidebar(page, allowedPages);
  buildTopbar(user, roleId);
  initResponsiveSidebar();

  window.FUELTRACK_AUTH = {
    user,
    roleId,
    roleName: ROLE_NAMES[roleId] || 'Inconnu',
    allowedPages,
    pageMode: policy.pages[page] || 'r',
    peutEcrire(entity) {
      if ((policy.entitiesWrite || []).includes('*')) return true;
      return (policy.entitiesWrite || []).includes(entity);
    },
  };
})();
