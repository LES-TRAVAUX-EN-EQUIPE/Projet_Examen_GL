import { apiRequete } from './api_client.js';

export async function initialiserPageCrud(config) {
  const form = document.getElementById('crud-form');
  const formBody = document.getElementById('form-body');
  const tableHead = document.getElementById('table-head');
  const tableBody = document.getElementById('table-body');
  const notice = document.getElementById('notice');
  const formCard = form ? form.closest('.card') : null;

  const auth = window.FUELTRACK_AUTH || null;
  const canWrite = auth ? auth.peutEcrire(config.entity) : true;
  const creationMode = config.creationMode || 'modal';

  let elementEdition = null;
  let cache = [];
  const lookups = {};

  let modalOverlay = null;
  let modalTitle = null;

  const labelsParEntite = {
    utilisateurs: 'utilisateur',
    fournisseurs: 'fournisseur',
    depots: 'dépôt',
    stations: 'station',
    vehicules: 'véhicule',
    types_carburant: 'type carburant',
    approvisionnements: 'approvisionnement',
    livraisons: 'livraison',
    mouvements_stock: 'mouvement',
    alertes: 'alerte',
  };

  function ouvrirModal(titre) {
    if (!modalOverlay) return;
    modalTitle.textContent = titre;
    modalOverlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function fermerModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function initialiserModalSiBesoin() {
    if (creationMode !== 'modal' || !canWrite || !formCard) return;

    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn btn-add-entity';
      const nom = labelsParEntite[config.entity] || 'élément';
      addBtn.innerHTML = `<i class="bi bi-plus-lg" aria-hidden="true"></i><span>${config.createButtonLabel || `Ajouter ${nom}`}</span>`;
      addBtn.addEventListener('click', () => {
        elementEdition = null;
        form.reset();
        notice.textContent = '';
        ouvrirModal(config.createModalTitle || `Ajouter ${nom}`);
      });
      pageHeader.appendChild(addBtn);
    }

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 id="crud-modal-title" class="modal-title">${config.createModalTitle || `Ajouter ${labelsParEntite[config.entity] || 'élément'}`}</h3>
          <button type="button" class="modal-close" aria-label="Fermer"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body"></div>
      </div>
    `;

    const modalBody = modalOverlay.querySelector('.modal-body');
    modalTitle = modalOverlay.querySelector('#crud-modal-title');
    const closeBtn = modalOverlay.querySelector('.modal-close');

    formCard.classList.add('modal-form-card');
    modalBody.appendChild(formCard);
    document.body.appendChild(modalOverlay);

    closeBtn.addEventListener('click', fermerModal);
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        fermerModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalOverlay.classList.contains('open')) {
        fermerModal();
      }
    });
  }

  async function chargerLookups() {
    for (const champ of config.champs) {
      if (champ.type === 'select' && champ.source) {
        const rows = await apiRequete(champ.source.entity);
        lookups[champ.nom] = rows;
      }
    }
  }

  function labelLookup(champ, valeur) {
    if (!champ.source) return valeur;
    const table = lookups[champ.nom] || [];
    const row = table.find((x) => String(x[champ.source.value]) === String(valeur));
    return row ? row[champ.source.label] : valeur;
  }

  function renderForm() {
    formBody.innerHTML = '';

    for (const champ of config.champs) {
      const group = document.createElement('div');
      group.className = 'form-group';

      const label = document.createElement('label');
      label.textContent = champ.libelle;
      label.setAttribute('for', champ.nom);
      group.appendChild(label);

      let input;
      if (champ.type === 'select') {
        input = document.createElement('select');
        input.name = champ.nom;
        input.id = champ.nom;

        const empty = document.createElement('option');
        empty.value = '';
        empty.textContent = 'Sélectionner...';
        input.appendChild(empty);

        const options = champ.source
          ? (lookups[champ.nom] || []).map((row) => ({ value: row[champ.source.value], label: row[champ.source.label] }))
          : (champ.options || []).map((v) => ({ value: v, label: v }));

        for (const optionData of options) {
          const option = document.createElement('option');
          option.value = optionData.value;
          option.textContent = optionData.label;
          input.appendChild(option);
        }
      } else if (champ.type === 'textarea') {
        input = document.createElement('textarea');
        input.name = champ.nom;
        input.id = champ.nom;
      } else {
        input = document.createElement('input');
        input.name = champ.nom;
        input.id = champ.nom;
        input.type = champ.type || 'text';
      }

      if (champ.required) input.required = true;
      if (!canWrite) input.disabled = true;

      group.appendChild(input);
      formBody.appendChild(group);
    }

    if (!canWrite) {
      notice.textContent = 'Accès limité: ce module est en lecture seule pour votre rôle.';
      notice.className = 'notice info';
    }
  }

  function renderTable() {
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    const headerRow = document.createElement('tr');
    for (const col of config.colonnes) {
      const th = document.createElement('th');
      th.textContent = col.libelle;
      headerRow.appendChild(th);
    }

    if (canWrite) {
      const thActions = document.createElement('th');
      thActions.textContent = 'Actions';
      headerRow.appendChild(thActions);
    }

    tableHead.appendChild(headerRow);

    if (cache.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = config.colonnes.length + (canWrite ? 1 : 0);
      cell.className = 'empty';
      cell.textContent = 'Aucune donnée.';
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    for (const item of cache) {
      const tr = document.createElement('tr');

      for (const col of config.colonnes) {
        const td = document.createElement('td');
        const champ = config.champs.find((c) => c.nom === col.nom);
        const valeur = item[col.nom];
        td.textContent = champ ? labelLookup(champ, valeur) : valeur;
        tr.appendChild(td);
      }

      if (canWrite) {
        const tdActions = document.createElement('td');
        tdActions.className = 'actions';

        const btnEdit = document.createElement('button');
        btnEdit.type = 'button';
        btnEdit.className = 'btn btn-secondary';
        btnEdit.textContent = 'Modifier';
        btnEdit.addEventListener('click', () => {
          elementEdition = item;
          for (const champ of config.champs) {
            const input = form.elements[champ.nom];
            if (input) input.value = item[champ.nom] ?? '';
          }
          if (creationMode === 'modal') {
            ouvrirModal(config.editModalTitle || 'Modifier');
          }
        });

        const btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.className = 'btn btn-danger';
        btnDelete.textContent = 'Supprimer';
        btnDelete.addEventListener('click', async () => {
          if (!confirm('Confirmer la suppression ?')) return;
          try {
            await apiRequete(config.entity, 'DELETE', null, { id: item.id });
            notice.textContent = 'Suppression réussie.';
            notice.className = 'notice';
            await chargerDonnees();
          } catch (error) {
            notice.textContent = error.message;
            notice.className = 'notice error';
          }
        });

        tdActions.appendChild(btnEdit);
        tdActions.appendChild(btnDelete);
        tr.appendChild(tdActions);
      }

      tableBody.appendChild(tr);
    }
  }

  async function chargerDonnees() {
    cache = await apiRequete(config.entity);
    renderTable();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!canWrite) return;

    const payload = {};
    for (const champ of config.champs) {
      const value = form.elements[champ.nom].value;
      if (value !== '') payload[champ.nom] = value;
    }

    try {
      if (elementEdition) {
        await apiRequete(config.entity, 'PUT', payload, { id: elementEdition.id });
        notice.textContent = 'Mise à jour réussie.';
      } else {
        await apiRequete(config.entity, 'POST', payload);
        notice.textContent = 'Création réussie.';
      }

      notice.className = 'notice';
      form.reset();
      elementEdition = null;
      await chargerDonnees();

      if (creationMode === 'modal') {
        fermerModal();
      }
    } catch (error) {
      notice.textContent = error.message;
      notice.className = 'notice error';
    }
  });

  const btnReset = document.getElementById('btn-reset');
  btnReset.addEventListener('click', () => {
    elementEdition = null;
    form.reset();
    if (canWrite) notice.textContent = '';
    if (creationMode === 'modal') fermerModal();
  });

  if (!canWrite) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    if (btnReset) btnReset.disabled = true;
  }

  await chargerLookups();
  renderForm();
  initialiserModalSiBesoin();
  await chargerDonnees();
}
