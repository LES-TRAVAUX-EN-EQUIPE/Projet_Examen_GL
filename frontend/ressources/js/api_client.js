export const API_BASE = window.FUELTRACK_API_BASE || 'http://localhost:8000/api/index.php';

export async function apiRequete(entity, method = 'GET', data = null, params = {}) {
  const query = new URLSearchParams({ entity, ...params }).toString();
  const url = `${API_BASE}?${query}`;
  const userRaw = sessionStorage.getItem('fueltrack_user');
  let roleId = '';
  let userId = '';
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      roleId = String(user.role_id || '');
      userId = String(user.id || '');
    } catch (_error) {
      roleId = '';
      userId = '';
    }
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Role-Id': roleId,
      'X-User-Id': userId,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (_error) {
    throw new Error(`Impossible de joindre l'API (${API_BASE}). Vérifie que le serveur PHP est démarré.`);
  }
  const raw = await response.text();
  let payload = null;

  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch (_error) {
    throw new Error(
      `Réponse invalide du serveur (${response.status}). Vérifie que le backend PHP tourne sur ${API_BASE}.`
    );
  }

  if (!response.ok || !payload || payload.succes === false) {
    const message = payload && payload.message ? payload.message : `Erreur API (${response.status})`;
    throw new Error(message);
  }

  return payload.donnees;
}
