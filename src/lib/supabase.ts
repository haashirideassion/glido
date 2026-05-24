import { createClient } from '@supabase/supabase-js'
import type { Database } from './db/types'

const url        = process.env.SUPABASE_URL              ?? 'http://localhost:54321'
const key        = process.env.SUPABASE_ANON_KEY         ?? 'anon-placeholder'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? key

// Cap every Supabase HTTP call at 20 s so a hung Supabase endpoint can never
// cause a Vercel function to sit for the full 300 s timeout.
const fetchWithTimeout = (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20_000)
  return fetch(input as RequestInfo, { ...init, signal: controller.signal })
    .finally(() => clearTimeout(timer))
}

// Standard client (anon key) — for client-facing queries
export const supabase = createClient<Database>(url, key, {
  global: { fetch: fetchWithTimeout },
})

// Admin client (service role) — for server-side operations, bypasses RLS
export const supabaseAdmin = createClient<Database>(url, serviceKey, {
  auth:   { autoRefreshToken: false, persistSession: false },
  global: { fetch: fetchWithTimeout },
})

export const DEFAULT_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'
