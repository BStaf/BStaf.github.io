import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { auth } from './auth';

async function initLanding() {
  const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;

  if (!loginBtn) {
    throw new Error('Required DOM elements not found.');
  }

  const auth0 = await auth.getAuthClient();

  const isAuthenticated = await auth.runAuth(auth0);

  if (isAuthenticated) {
    window.location.href = '/dashboard.html';
    return;
  }

  loginBtn.addEventListener('click', () => auth.login(auth0));
}

initLanding();
