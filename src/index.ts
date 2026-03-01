import { createAuth0Client } from '@auth0/auth0-spa-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

async function initAuth0() {
  const auth0 = await createAuth0Client({
    domain: process.env.VITE_AUTH0_DOMAIN!,
    clientId: process.env.VITE_AUTH0_CLIENT_ID!,
    cacheLocation: 'localstorage', // persist session
    useRefreshTokens: true,
  });

  loginBtn?.addEventListener('click', () => auth0.loginWithRedirect(
    { authorizationParams:
      { redirect_uri: 'http://localhost:5000/' }
    }));

  logoutBtn?.addEventListener('click', () => auth0.logout(
    { logoutParams:
      { returnTo: 'http://localhost:5000/' }
    }));

  // Optional: Check if returning from redirect
  if (window.location.search.includes('code=')) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  }

  // Optional: Update UI based on auth state
  const isAuthenticated = await auth0.isAuthenticated();
  loginBtn!.style.display = isAuthenticated ? 'none' : 'inline-block';
  logoutBtn!.style.display = isAuthenticated ? 'inline-block' : 'none';
}

initAuth0();
