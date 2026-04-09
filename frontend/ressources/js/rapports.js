import { apiRequete } from './api_client.js';

const approBody = document.getElementById('appro-body');
const livrBody = document.getElementById('livr-body');
const alerteBody = document.getElementById('alerte-body');

async function chargerRapports() {
  try {
    const data = await apiRequete('rapports');

    approBody.innerHTML = '';
    data.approvisionnements_par_carburant.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.nom_carburant}</td><td>${row.volume_total}</td><td>${row.montant_total}</td>`;
      approBody.appendChild(tr);
    });

    livrBody.innerHTML = '';
    data.livraisons_par_statut.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.statut}</td><td>${row.total}</td><td>${row.volume}</td>`;
      livrBody.appendChild(tr);
    });

    alerteBody.innerHTML = '';
    data.alertes_par_niveau.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.niveau}</td><td>${row.total}</td>`;
      alerteBody.appendChild(tr);
    });
  } catch (error) {
    approBody.innerHTML = `<tr><td colspan="3">Erreur: ${error.message}</td></tr>`;
  }
}

chargerRapports();
