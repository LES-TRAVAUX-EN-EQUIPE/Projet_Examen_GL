import { apiRequete } from './api_client.js';

export async function initialiserPageCrud(config) {
  const form = document.getElementById('crud-form');
  const formBody = document.getElementById('form-body');
  const tableHead = document.getElementById('table-head');
  const tableBody = document.getElementById('table-body');
  const notice = document.getElementById('notice');
  const formCard = form ? form.closest('.card') : null;
  const pageHeader = document.querySelector('.page-header');

  const auth = window.FUELTRACK_AUTH || null;
  const canWrite = auth ? auth.peutEcrire(config.entity) : true;
  const creationMode = config.creationMode || 'modal';

  let elementEdition = null;
  let cache = [];
  const lookups = {};

  let modalOverlay = null;
  let modalTitle = null;
  let confirmOverlay = null;
  let confirmResolve = null;
  let noticeTimeoutId = null;

  const pageNotice = document.createElement('p');
  pageNotice.className = 'notice-banner';

  if (pageHeader && pageHeader.parentNode) {
    pageHeader.insertAdjacentElement('afterend', pageNotice);
  }

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

  function afficherNotice(message, type = 'success') {
    if (noticeTimeoutId) {
      clearTimeout(noticeTimeoutId);
      noticeTimeoutId = null;
    }

    if (notice) {
      notice.textContent = message;
      notice.className = `notice ${type}`;
    }

    pageNotice.textContent = message;
    pageNotice.className = `notice-banner visible ${type}`;

    if (type === 'success') {
      noticeTimeoutId = window.setTimeout(() => {
        if (notice) {
          notice.textContent = '';
          notice.className = 'notice';
        }
        pageNotice.textContent = '';
        pageNotice.className = 'notice-banner';
      }, 3500);
    }
  }

  function effacerNotice() {
    if (noticeTimeoutId) {
      clearTimeout(noticeTimeoutId);
      noticeTimeoutId = null;
    }
    if (notice) {
      notice.textContent = '';
      notice.className = 'notice';
    }
    pageNotice.textContent = '';
    pageNotice.className = 'notice-banner';
  }

  function ouvrirModal(titre) {
    if (!modalOverlay) return;
    modalTitle.textContent = titre;
    modalOverlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function fermerModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    if (!confirmOverlay || !confirmOverlay.classList.contains('open')) {
      document.body.classList.remove('modal-open');
    }
  }

  function ouvrirConfirmation(message) {
    if (!confirmOverlay) {
      return Promise.resolve(window.confirm(message));
    }

    const confirmMessage = confirmOverlay.querySelector('.confirm-message');
    confirmMessage.textContent = message;
    confirmOverlay.classList.add('open');
    document.body.classList.add('modal-open');

    return new Promise((resolve) => {
      confirmResolve = resolve;
    });
  }

  function fermerConfirmation(resultat = false) {
    if (!confirmOverlay) return;
    confirmOverlay.classList.remove('open');
    if (!modalOverlay || !modalOverlay.classList.contains('open')) {
      document.body.classList.remove('modal-open');
    }

    if (confirmResolve) {
      const resolve = confirmResolve;
      confirmResolve = null;
      resolve(resultat);
    }
  }

  function initialiserBoiteConfirmation() {
    confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'confirm-overlay';
    confirmOverlay.innerHTML = `
      <div class="confirm-box" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div class="confirm-icon"><i class="bi bi-trash3"></i></div>
        <h3 id="confirm-title" class="confirm-title">Confirmer la suppression</h3>
        <p class="confirm-message"></p>
        <div class="confirm-actions">
          <button type="button" class="btn btn-secondary confirm-cancel">Annuler</button>
          <button type="button" class="btn btn-danger confirm-accept">Supprimer</button>
        </div>
      </div>
    `;

    const cancelBtn = confirmOverlay.querySelector('.confirm-cancel');
    const acceptBtn = confirmOverlay.querySelector('.confirm-accept');

    cancelBtn.addEventListener('click', () => fermerConfirmation(false));
    acceptBtn.addEventListener('click', () => fermerConfirmation(true));
    confirmOverlay.addEventListener('click', (event) => {
      if (event.target === confirmOverlay) {
        fermerConfirmation(false);
      }
    });

    document.body.appendChild(confirmOverlay);
  }

  function initialiserModalSiBesoin() {
    if (creationMode !== 'modal' || !canWrite || !formCard) return;

    if (pageHeader) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn btn-add-entity';
      const nom = labelsParEntite[config.entity] || 'élément';
      addBtn.innerHTML = `<i class="bi bi-plus-lg" aria-hidden="true"></i><span>${config.createButtonLabel || `Ajouter ${nom}`}</span>`;
      addBtn.addEventListener('click', () => {
        elementEdition = null;
        form.reset();
        reinitialiserChampsSensibles();
        effacerNotice();
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
      if (event.key === 'Escape' && confirmOverlay && confirmOverlay.classList.contains('open')) {
        fermerConfirmation(false);
      } else if (event.key === 'Escape' && modalOverlay.classList.contains('open')) {
        fermerModal();
      }
    });
  }

  async function chargerLookups() {
    const colonnesAffichees = new Set((config.colonnes || []).map((col) => col.nom));

    for (const champ of config.champs) {
      if (champ.type === 'select' && champ.source) {
        if (!canWrite && !colonnesAffichees.has(champ.nom)) {
          lookups[champ.nom] = [];
          continue;
        }

        try {
          const rows = await apiRequete(champ.source.entity);
          lookups[champ.nom] = rows;
        } catch (error) {
          lookups[champ.nom] = [];

          if (canWrite) {
            afficherNotice(
              `Certaines listes du formulaire n'ont pas pu être chargées: ${error.message}`,
              'error'
            );
          }
        }
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
        if (champ.type === 'number') {
          input.step = champ.step || '0.01';
        }
      }

      if (champ.required) input.required = true;

      group.appendChild(input);
      formBody.appendChild(group);
    }
  }

  function reinitialiserChampsSensibles() {
    for (const champ of config.champs) {
      const input = form.elements[champ.nom];
      if (!input || champ.type !== 'password') continue;
      input.value = '';
      input.placeholder = '';
    }
  }

  function masquerFormulaireSiLectureSeule() {
    if (canWrite || !formCard) return;
    formCard.remove();
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
        if (typeof col.render === 'function') {
          td.textContent = col.render({
            item,
            valeur,
            champ,
            lookups,
            labelLookup,
            config,
          });
        } else {
          td.textContent = champ ? labelLookup(champ, valeur) : valeur;
        }
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
            if (!input) continue;

            if (champ.type === 'password') {
              input.value = '';
              input.placeholder = 'Laisser vide pour conserver le mot de passe actuel';
              continue;
            }

            input.value = item[champ.nom] ?? '';
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
          const confirme = await ouvrirConfirmation('Cette action supprimera définitivement cet élément. Voulez-vous continuer ?');
          if (!confirme) return;
          try {
            await apiRequete(config.entity, 'DELETE', null, { id: item.id });
            afficherNotice('Suppression effectuée avec succès.', 'success');
            await chargerDonnees();
          } catch (error) {
            afficherNotice(error.message, 'error');
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
    document.dispatchEvent(new CustomEvent('fueltrack:crud-data-loaded', {
      detail: {
        entity: config.entity,
        rows: cache,
        canWrite,
      },
    }));
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
        afficherNotice('Modification effectuée avec succès.', 'success');
      } else {
        await apiRequete(config.entity, 'POST', payload);
        afficherNotice('Ajout effectué avec succès.', 'success');
      }

      form.reset();
      elementEdition = null;
      reinitialiserChampsSensibles();
      await chargerDonnees();

      if (creationMode === 'modal') {
        fermerModal();
      }
    } catch (error) {
      afficherNotice(error.message, 'error');
    }
  });

  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      elementEdition = null;
      form.reset();
      reinitialiserChampsSensibles();
      if (canWrite) effacerNotice();
      if (creationMode === 'modal') fermerModal();
    });
  }

  await chargerLookups();
  if (canWrite) {
    renderForm();
  } else {
    masquerFormulaireSiLectureSeule();
  }
  initialiserBoiteConfirmation();
  initialiserModalSiBesoin();
  await chargerDonnees();
}
