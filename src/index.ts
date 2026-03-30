import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Auth0Client } from '@auth0/auth0-spa-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { auth } from './auth';

/* -----------------------
   Types
------------------------ */
type FirstTableRow = {
  id: number;
  name: string;
};

/* -----------------------
   Base Supabase Client
------------------------ */
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

/**
 * Helper wrapper to get a fresh token and make Supabase calls
 */
async function supabaseCall<T>(
  auth0: Auth0Client,
  callback: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  const token = await auth0.getTokenSilently();

  console.log('Decoded JWT (browser):', decodeJwt(token));

  const client = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return callback(client);
}

/**
 * Fetch FirstTable data
 */
async function fetchFirstTable(auth0: Auth0Client, outputDiv: HTMLPreElement) {
  const { data, error } = await supabaseCall<FirstTableRow[]>(
    auth0,
    async (client) => client.from('FirstTable').select('*')
  );

  if (error) {
    outputDiv.textContent = 'Error: ' + error.message;
    return;
  }

  outputDiv.textContent = JSON.stringify(data, null, 2);
}

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

function decodeJwt(token: string) {
  const payload = token.split('.')[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
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
