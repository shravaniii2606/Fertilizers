const { createClient } = require('@supabase/supabase-js');
const nodeFetch = require('node-fetch');

let supabaseClient;
let webSocketTransport;

function getWebSocketTransport() {
  if (typeof globalThis.WebSocket !== 'undefined') {
    return globalThis.WebSocket;
  }

  if (!webSocketTransport) {
    const wsModule = require('ws');
    webSocketTransport = wsModule.WebSocket || wsModule;
  }

  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = webSocketTransport;
  }

  return webSocketTransport;
}

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  }

  const transport = getWebSocketTransport();

  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: nodeFetch,
    },
    realtime: {
      transport,
    },
  });

  return supabaseClient;
}

module.exports = { getSupabaseClient };
