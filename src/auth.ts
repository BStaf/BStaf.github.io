import { createAuth0Client, Auth0Client } from '@auth0/auth0-spa-js';

async function getAuthClient() {
  return await createAuth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN!,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID!,
    cacheLocation: 'localstorage',
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE!,
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

const baseUrl = window.location.origin;

async function login(auth0: Auth0Client) {
  await auth0.loginWithRedirect({
    authorizationParams: {
      redirect_uri: baseUrl,
    },
  });
}

function logout(auth0: Auth0Client) {
  auth0.logout({
    logoutParams: {
      returnTo: baseUrl,
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
