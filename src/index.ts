import { createAuth0Client, Auth0Client } from '@auth0/auth0-spa-js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

/* -----------------------
   Global Variables
------------------------ */

let auth0: Auth0Client;
let supabase: SupabaseClient;

/* -----------------------
  DB
------------------------ */

function setupSupabase(): SupabaseClient {
  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );
}

async function fetchFirstTable(outputDiv: HTMLPreElement) {
  const { data, error } = await supabase
    .from('FirstTable')
    .select('*');

  if (error) {
    outputDiv.textContent = 'Error: ' + error.message;
    return;
  }

  outputDiv.textContent = JSON.stringify(data, null, 2);
}

/* -----------------------
   Auth
------------------------ */

async function getAuthClient(){
  return await createAuth0Client({
    domain: process.env.VITE_AUTH0_DOMAIN!,
    clientId: process.env.VITE_AUTH0_CLIENT_ID!,
    cacheLocation: 'localstorage',
    //useRefreshTokens: true,
  });
}

async function runAuth(){
  auth0 = await getAuthClient();
  console.log("running auth");

  if (window.location.search.includes('code=')) {
    console.log("redirect detected");
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  }

  return await auth0.isAuthenticated();
}

async function login() {
  await auth0.loginWithRedirect({
    authorizationParams: {
      redirect_uri: 'http://localhost:5000/',
    },
  });
}

function logout() {
  auth0.logout({
    logoutParams: {
      returnTo: 'http://localhost:5000/',
    },
  });
}

/* -----------------------
   UI Logic
------------------------ */

async function init(
  loginBtn: HTMLButtonElement,
  logoutBtn: HTMLButtonElement,
  fetchBtn: HTMLButtonElement,
  outputDiv: HTMLPreElement
): Promise<void> {

  // Event Listeners
  loginBtn.addEventListener('click', login);
  logoutBtn.addEventListener('click', logout);
  fetchBtn.addEventListener('click', () => fetchFirstTable(outputDiv));
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
  // Safely retrieve DOM elements AFTER page load
  const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
  const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
  const fetchBtn = document.getElementById('fetchBtn') as HTMLButtonElement;
  const outputDiv = document.getElementById('output') as HTMLPreElement;

  if (!loginBtn || !logoutBtn || !fetchBtn || !outputDiv) {
    throw new Error('Required DOM elements not found.');
  }

  supabase = setupSupabase();
  init(loginBtn, logoutBtn, fetchBtn, outputDiv);
  
  let isAuthenticated = await runAuth();

  updateUI(isAuthenticated, loginBtn, logoutBtn, fetchBtn);
}

initApp();
