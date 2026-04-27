import { Auth0Client } from '@auth0/auth0-spa-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { auth } from './auth';
import { fetchFirstTable } from './dataRepo';

/* -----------------------
   UI Logic
------------------------ */
async function init(
  loginBtn: HTMLButtonElement,
  logoutBtn: HTMLButtonElement,
  fetchBtn: HTMLButtonElement,
  outputDiv: HTMLPreElement,
  auth0: Auth0Client
) {
  loginBtn.addEventListener('click', () => auth.login(auth0));
  logoutBtn.addEventListener('click', () => auth.logout(auth0));

  fetchBtn.addEventListener('click', async () => {
    await fetchFirstTable(auth0, outputDiv);
  });
}

function updateUI(
  isAuthenticated: boolean,
  loginBtn: HTMLButtonElement,
  logoutBtn: HTMLButtonElement,
  fetchBtn: HTMLButtonElement
) {
  loginBtn.style.display = isAuthenticated ? 'none' : 'inline-block';
  logoutBtn.style.display = isAuthenticated ? 'inline-block' : 'none';
  fetchBtn.style.display = isAuthenticated ? 'inline-block' : 'none';
}

/* -----------------------
   App Init
------------------------ */
async function initApp() {
  const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
  const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
  const fetchBtn = document.getElementById('fetchBtn') as HTMLButtonElement;
  const outputDiv = document.getElementById('output') as HTMLPreElement;

  if (!loginBtn || !logoutBtn || !fetchBtn || !outputDiv) {
    throw new Error('Required DOM elements not found.');
  }

  const auth0 = await auth.getAuthClient();

  init(loginBtn, logoutBtn, fetchBtn, outputDiv, auth0);

  const isAuthenticated = await auth.runAuth(auth0);

  if (isAuthenticated) {
    console.log('authenticated');
    updateUI(isAuthenticated, loginBtn, logoutBtn, fetchBtn);
  }
}

initApp();
