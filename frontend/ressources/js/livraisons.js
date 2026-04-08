const API_BASE_URL = 'http://localhost/Projet_Examen_GL/backend/public/api/livraisons.php';
let currentLivraisonId = null;

// Charger toutes les livraisons
async function loadLivraisons() {
    try {
        const response = await fetch(`${API_BASE_URL}?path=`);
        const data = await response.json();
        
        if(data.success) {
            displayLivraisons(data.data);
            loadStats();
        } else {
            showError('Erreur lors du chargement des livraisons');
        }
    } catch(error) {
        console.error('Error:', error);
        showError('Erreur de connexion au serveur');
    }
}

// Charger les statistiques
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}?path=stats`);
        const data = await response.json();
        
        if(data.success) {
            document.getElementById('totalLivraisons').textContent = data.data.total || 0;
            document.getElementById('enCoursLivraisons').textContent = data.data.en_cours || 0;
            document.getElementById('livreesLivraisons').textContent = data.data.livrees || 0;
            document.getElementById('annuleesLivraisons').textContent = data.data.annulees || 0;
        }
    } catch(error) {
        console.error('Error loading stats:', error);
    }
}

// Afficher les livraisons
function displayLivraisons(livraisons) {
    const tbody = document.getElementById('livraisonsTableBody');
    
    if(livraisons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucune livraison trouvee</td></tr>';
        return;
    }
    
    tbody.innerHTML = livraisons.map(livraison => `
        <tr>
            <td><strong>${livraison.numero_livraison}</strong></td>
            <td>${livraison.marque} ${livraison.modele}<br><small>${livraison.immatriculation}</small></td>
            <td>${livraison.depot_origine || 'N/A'}</td>
            <td>${livraison.station_destination || 'N/A'}</td>
            <td>${livraison.quantite_prevue} L</td>
            <td>${getStatutBadge(livraison.statut)}</td>
            <td>${livraison.date_depart ? new Date(livraison.date_depart).toLocaleString() : 'Non demarree'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="gererStatut(${livraison.id_livraison}, '${livraison.statut}')" title="Gerer">
                    <i class="fas fa-cog"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Obtenir le badge de statut
function getStatutBadge(statut) {
    const badges = {
        'planifiee': 'badge bg-secondary',
        'en_cours': 'badge bg-warning',
        'livree': 'badge bg-success',
        'retard': 'badge bg-danger',
        'annulee': 'badge bg-dark'
    };
    const texts = {
        'planifiee': 'Planifiee',
        'en_cours': 'En cours',
        'livree': 'Livree',
        'retard': 'Retard',
        'annulee': 'Annulee'
    };
    return `<span class="${badges[statut]}">${texts[statut]}</span>`;
}

// Filtrer les livraisons
function filtrerLivraisons() {
    const statut = document.getElementById('filtreStatut').value;
    const date = document.getElementById('filtreDate').value;
    
    let url = `${API_BASE_URL}?path=`;
    if(statut) {
        url = `${API_BASE_URL}?path=${statut === 'planifiee' ? 'planifiees' : 
                                      statut === 'en_cours' ? 'en-cours' :
                                      statut === 'livree' ? 'livrees' : ''}`;
    }
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                let filtered = data.data;
                if(date) {
                    filtered = filtered.filter(l => 
                        new Date(l.created_at).toDateString() === new Date(date).toDateString()
                    );
                }
                displayLivraisons(filtered);
            }
        });
}

// Sauvegarder une livraison
async function saveLivraison() {
    const livraisonData = {
        id_vehicule: document.getElementById('id_vehicule').value,
        id_depot_origine: document.getElementById('id_depot_origine').value,
        id_station_destination: document.getElementById('id_station_destination').value,
        quantite_prevue: parseFloat(document.getElementById('quantite_prevue').value),
        date_arrivee_prevue: document.getElementById('date_arrivee_prevue').value,
        chauffeur_nom: document.getElementById('chauffeur_nom').value,
        chauffeur_contact: document.getElementById('chauffeur_contact').value,
        remarques: document.getElementById('remarques').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}?path=`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livraisonData)
        });
        
        const data = await response.json();
        
        if(data.success) {
            alert('Livraison planifiee avec succes! Numero: ' + data.numero_livraison);
            closeModal();
            loadLivraisons();
            resetForm();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch(error) {
        console.error('Error:', error);
        alert('Erreur lors de la planification');
    }
}

// Gerer le statut d'une livraison
function gererStatut(id, statutActuel) {
    currentLivraisonId = id;
    const modal = new bootstrap.Modal(document.getElementById('statutModal'));
    
    const actions = document.getElementById('statutActions');
    if(statutActuel === 'planifiee') {
        actions.innerHTML = `
            <button class="btn btn-success w-100 mb-2" onclick="demarrerLivraison()">
                <i class="fas fa-play"></i> Demarrer la livraison
            </button>
            <button class="btn btn-danger w-100" onclick="annulerLivraison()">
                <i class="fas fa-times"></i> Annuler la livraison
            </button>
        `;
    } else if(statutActuel === 'en_cours') {
        actions.innerHTML = `
            <button class="btn btn-primary w-100 mb-2" onclick="terminerLivraison()" data-bs-toggle="modal" data-bs-target="#terminerModal">
                <i class="fas fa-check"></i> Terminer la livraison
            </button>
            <button class="btn btn-danger w-100" onclick="annulerLivraison()">
                <i class="fas fa-times"></i> Annuler la livraison
            </button>
        `;
    } else {
        actions.innerHTML = '<p class="text-center">Cette livraison ne peut plus etre modifiee</p>';
    }
    
    modal.show();
}

// Demarrer une livraison
async function demarrerLivraison() {
    if(confirm('Confirmez-vous le depart de la livraison ?')) {
        try {
            const response = await fetch(`${API_BASE_URL}?path=${currentLivraisonId}/demarrer`, {
                method: 'PUT'
            });
            const data = await response.json();
            
            if(data.success) {
                alert('Livraison demarree avec succes');
                closeAllModals();
                loadLivraisons();
            } else {
                alert('Erreur: ' + data.message);
            }
        } catch(error) {
            console.error('Error:', error);
            alert('Erreur lors du demarrage');
        }
    }
}

// Fonction pour terminer (appelle le modal)
function terminerLivraison() {
    const terminerModal = new bootstrap.Modal(document.getElementById('terminerModal'));
    terminerModal.show();
}

// Confirmer la termination
async function confirmerTerminer() {
    const quantite_reelle = parseFloat(document.getElementById('quantite_reelle').value);
    const date_arrivee_reelle = document.getElementById('date_arrivee_reelle').value;
    
    if(!quantite_reelle) {
        alert('Veuillez saisir la quantite reellement livree');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}?path=${currentLivraisonId}/terminer`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantite_reelle: quantite_reelle,
                date_arrivee_reelle: date_arrivee_reelle
            })
        });
        const data = await response.json();
        
        if(data.success) {
            alert('Livraison terminee avec succes');
            closeAllModals();
            loadLivraisons();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch(error) {
        console.error('Error:', error);
        alert('Erreur lors de la finalisation');
    }
}

// Annuler une livraison
async function annulerLivraison() {
    const motif = prompt('Motif de l annulation:');
    if(motif) {
        try {
            const response = await fetch(`${API_BASE_URL}?path=${currentLivraisonId}/annuler`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ motif: motif })
            });
            const data = await response.json();
            
            if(data.success) {
                alert('Livraison annulee');
                closeAllModals();
                loadLivraisons();
            } else {
                alert('Erreur: ' + data.message);
            }
        } catch(error) {
            console.error('Error:', error);
            alert('Erreur lors de l annulation');
        }
    }
}

// Charger les donnees pour les selects
async function loadSelectData() {
    try {
        const vehiculesResponse = await fetch('http://localhost/Projet_Examen_GL/backend/public/api/vehicules.php?path=disponibles');
        const vehiculesData = await vehiculesResponse.json();
        
        if(vehiculesData.success) {
            const selectVehicule = document.getElementById('id_vehicule');
            selectVehicule.innerHTML = '<option value="">Selectionner un vehicule</option>' +
                vehiculesData.data.map(v => `<option value="${v.id_vehicule}">${v.immatriculation} - ${v.marque} ${v.modele}</option>`).join('');
        }
        
        // Charger les depots et stations - adaptez selon votre structure
        // Exemple pour les depots:
        // const depotsResponse = await fetch('http://localhost/Projet_Examen_GL/backend/public/api/depots.php');
        // const depotsData = await depotsResponse.json();
        // if(depotsData.success) {
        //     const selectDepot = document.getElementById('id_depot_origine');
        //     selectDepot.innerHTML = '<option value="">Selectionner un depot</option>' +
        //         depotsData.data.map(d => `<option value="${d.id_depot}">${d.nom_depot}</option>`).join('');
        // }
        
    } catch(error) {
        console.error('Error loading select data:', error);
    }
}

// Reinitialiser le formulaire
function resetForm() {
    document.getElementById('livraisonForm').reset();
}

// Fermer tous les modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if(bsModal) bsModal.hide();
    });
}

// Fermer le modal principal
function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('livraisonModal'));
    if(modal) modal.hide();
    resetForm();
}

// Afficher une erreur
function showError(message) {
    const tbody = document.getElementById('livraisonsTableBody');
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">${message}</td></tr>`;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadLivraisons();
    loadSelectData();
    
    setInterval(() => {
        loadLivraisons();
    }, 30000);
});