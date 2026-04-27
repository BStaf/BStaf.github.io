import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Auth0Client } from '@auth0/auth0-spa-js';

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
export async function fetchFirstTable(auth0: Auth0Client, outputDiv: HTMLPreElement) {
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
