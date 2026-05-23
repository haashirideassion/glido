import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import type { Database } from './db/types'

const url        = process.env.SUPABASE_URL              ?? 'http://localhost:54321'
const key        = process.env.SUPABASE_ANON_KEY         ?? 'anon-placeholder'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? key

// Node.js 20 has no native WebSocket global — ws must be passed explicitly.
// Node.js 22+ has it natively but passing ws here is harmless.
const wsTransport = { transport: ws as unknown as typeof WebSocket }

// Standard client (anon key) — for client-facing queries
export const supabase = createClient<Database>(url, key, {
  realtime: wsTransport,
})

// Admin client (service role) — for server-side operations, bypasses RLS
export const supabaseAdmin = createClient<Database>(url, serviceKey, {
  auth:     { autoRefreshToken: false, persistSession: false },
  realtime: wsTransport,
})

export const DEFAULT_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'
