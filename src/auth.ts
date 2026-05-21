import { createAuth0Client, Auth0Client } from '@auth0/auth0-spa-js';

async function getAuthClient() {
  return await createAuth0Client({
    domain: process.env.VITE_AUTH0_DOMAIN!,
    clientId: process.env.VITE_AUTH0_CLIENT_ID!,
    cacheLocation: 'localstorage',
    authorizationParams: {
      audience: process.env.VITE_AUTH0_AUDIENCE!,
    },
  });
}

async function runAuth(auth0: Auth0Client) {
  if (window.location.search.includes('code=')) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return await auth0.isAuthenticated();
}

async function login(auth0: Auth0Client) {
  await auth0.loginWithRedirect({
    authorizationParams: {
      redirect_uri: 'http://localhost:5000/',
    },
  });
}

function logout(auth0: Auth0Client) {
  auth0.logout({
    logoutParams: {
      returnTo: 'http://localhost:5000/',
    },
  });
}

// ✅ EXPORT AS A SINGLE OBJECT
export const auth = {
  getAuthClient,
  runAuth,
  login,
  logout,
};
