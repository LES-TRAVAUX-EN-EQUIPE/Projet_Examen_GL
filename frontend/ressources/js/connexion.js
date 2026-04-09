import { apiRequete } from './api_client.js';

const form = document.getElementById('login-form');
const message = document.getElementById('message');
const themeBtn = document.getElementById('theme-btn');

sessionStorage.removeItem('fueltrack_user');

function applyTheme(isDark) {
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('fueltrack_theme', isDark ? 'dark' : 'light');
  const icon = themeBtn ? themeBtn.querySelector('i') : null;
  if (icon) {
    icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }
}

if (themeBtn) {
  const darkSaved = localStorage.getItem('fueltrack_theme') === 'dark';
  applyTheme(darkSaved);
  themeBtn.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark-theme'));
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';

  const payload = {
    email: form.email.value,
    mot_de_passe: form.mot_de_passe.value,
  };

  try {
    const utilisateur = await apiRequete('auth', 'POST', payload);
    if (Number(utilisateur.role_id) !== 1) {
      sessionStorage.removeItem('fueltrack_user');
      throw new Error('Accès refusé: cet espace est réservé aux administrateurs.');
    }
    sessionStorage.setItem('fueltrack_user', JSON.stringify(utilisateur));
    message.textContent = 'Connexion réussie. Redirection...';
    message.className = 'message';
    setTimeout(() => {
      window.location.href = 'tableau_de_bord.html';
    }, 600);
  } catch (error) {
    message.textContent = error.message;
    message.className = 'message error';
  }
});
