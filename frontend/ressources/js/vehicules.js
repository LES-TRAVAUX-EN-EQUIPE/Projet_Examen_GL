const API_BASE_URL = 'http://localhost/Projet_Examen_GL/backend/public/api/vehicules.php';
let currentVehiculeId = null;

// Charger tous les vehicules
async function loadVehicules() {
    try {
        const response = await fetch(`${API_BASE_URL}?path=`);
        const data = await response.json();
        
        if(data.success) {
            displayVehicules(data.data);
        } else {
            showError('Erreur lors du chargement des vehicules');
        }
    } catch(error) {
        console.error('Error:', error);
        showError('Erreur de connexion au serveur');
    }
}

// Afficher les vehicules dans le tableau
function displayVehicules(vehicules) {
    const tbody = document.getElementById('vehiculesTableBody');
    
    if(vehicules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucun vehicule trouve</td></tr>';
        return;
    }
    
    tbody.innerHTML = vehicules.map(vehicule => `
        <tr>
            <td>${vehicule.id_vehicule}</td>
            <td><strong>${vehicule.immatriculation}</strong></td>
            <td>${vehicule.marque}</td>
            <td>${vehicule.modele}</td>
            <td>${vehicule.capacite_reservoir} L</td>
            <td>${getStatutBadge(vehicule.statut)}</td>
            <td>${vehicule.kilometrage_actuel} km</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editVehicule(${vehicule.id_vehicule})" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteVehicule(${vehicule.id_vehicule})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Obtenir le badge de statut
function getStatutBadge(statut) {
    const badges = {
        'disponible': 'badge bg-success',
        'en_livraison': 'badge bg-warning',
        'en_maintenance': 'badge bg-info',
        'hors_service': 'badge bg-danger'
    };
    const texts = {
        'disponible': 'Disponible',
        'en_livraison': 'En livraison',
        'en_maintenance': 'En maintenance',
        'hors_service': 'Hors service'
    };
    return `<span class="${badges[statut]}">${texts[statut]}</span>`;
}

// Filtrer les vehicules
function filtrerVehicules() {
    const statut = document.getElementById('filtreStatut').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    fetch(`${API_BASE_URL}?path=`)
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                let filtered = data.data;
                
                if(statut) {
                    filtered = filtered.filter(v => v.statut === statut);
                }
                
                if(search) {
                    filtered = filtered.filter(v => 
                        v.immatriculation.toLowerCase().includes(search) ||
                        v.marque.toLowerCase().includes(search) ||
                        v.modele.toLowerCase().includes(search)
                    );
                }
                
                displayVehicules(filtered);
            }
        });
}

// Sauvegarder un vehicule
async function saveVehicule() {
    const vehiculeData = {
        immatriculation: document.getElementById('immatriculation').value,
        marque: document.getElementById('marque').value,
        modele: document.getElementById('modele').value,
        capacite_reservoir: parseFloat(document.getElementById('capacite_reservoir').value),
        consommation_moyenne: parseFloat(document.getElementById('consommation_moyenne').value) || null,
        statut: document.getElementById('statut').value,
        date_mise_en_service: document.getElementById('date_mise_en_service').value,
        kilometrage_actuel: parseFloat(document.getElementById('kilometrage_actuel').value) || 0,
        derniere_maintenance: document.getElementById('derniere_maintenance').value || null
    };
    
    const vehiculeId = document.getElementById('vehiculeId').value;
    const method = vehiculeId ? 'PUT' : 'POST';
    const url = vehiculeId ? `${API_BASE_URL}?path=${vehiculeId}` : `${API_BASE_URL}?path=`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehiculeData)
        });
        
        const data = await response.json();
        
        if(data.success) {
            alert(vehiculeId ? 'Vehicule modifie avec succes' : 'Vehicule ajoute avec succes');
            closeModal();
            loadVehicules();
            resetForm();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch(error) {
        console.error('Error:', error);
        alert('Erreur lors de la sauvegarde');
    }
}

// Editer un vehicule
async function editVehicule(id) {
    try {
        const response = await fetch(`${API_BASE_URL}?path=${id}`);
        const data = await response.json();
        
        if(data.success) {
            const vehicule = data.data;
            document.getElementById('vehiculeId').value = vehicule.id_vehicule;
            document.getElementById('immatriculation').value = vehicule.immatriculation;
            document.getElementById('marque').value = vehicule.marque;
            document.getElementById('modele').value = vehicule.modele;
            document.getElementById('capacite_reservoir').value = vehicule.capacite_reservoir;
            document.getElementById('consommation_moyenne').value = vehicule.consommation_moyenne || '';
            document.getElementById('statut').value = vehicule.statut;
            document.getElementById('date_mise_en_service').value = vehicule.date_mise_en_service;
            document.getElementById('kilometrage_actuel').value = vehicule.kilometrage_actuel;
            document.getElementById('derniere_maintenance').value = vehicule.derniere_maintenance || '';
            
            document.getElementById('modalTitle').textContent = 'Modifier le vehicule';
            new bootstrap.Modal(document.getElementById('vehiculeModal')).show();
        }
    } catch(error) {
        console.error('Error:', error);
        alert('Erreur lors du chargement du vehicule');
    }
}

// Supprimer un vehicule
async function deleteVehicule(id) {
    if(confirm('Etes-vous sur de vouloir supprimer ce vehicule ?')) {
        try {
            const response = await fetch(`${API_BASE_URL}?path=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if(data.success) {
                alert('Vehicule supprime avec succes');
                loadVehicules();
            } else {
                alert('Erreur: ' + data.message);
            }
        } catch(error) {
            console.error('Error:', error);
            alert('Erreur lors de la suppression');
        }
    }
}

// Reinitialiser le formulaire
function resetForm() {
    document.getElementById('vehiculeForm').reset();
    document.getElementById('vehiculeId').value = '';
    document.getElementById('modalTitle').textContent = 'Ajouter un vehicule';
}

// Fermer le modal
function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('vehiculeModal'));
    if(modal) modal.hide();
    resetForm();
}

// Afficher une erreur
function showError(message) {
    const tbody = document.getElementById('vehiculesTableBody');
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">${message}</td></tr>`;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadVehicules();
});