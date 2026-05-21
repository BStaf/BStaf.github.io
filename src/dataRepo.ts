import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Auth0Client } from '@auth0/auth0-spa-js';

/* -----------------------
   Types
------------------------ */
export type ResponsePost = {
  runid: string;
  timestamp: string;
  response: string;
};

/* -----------------------
   Base Supabase Client
------------------------ */
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

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

export async function fetchLatestPosts(auth0: Auth0Client): Promise<ResponsePost[]> {
  const result = await supabaseCall<ResponsePost[]>(auth0, async (client) =>
    client
      .from('fin_response_wheel')
      .select('runid, timestamp, response')
      .order('timestamp', { ascending: false })
      .limit(5)
  );

  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}
