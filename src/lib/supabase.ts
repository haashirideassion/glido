import { createClient } from '@supabase/supabase-js'
import type { Database } from './db/types'

// Use placeholder values so the module loads even when env vars are absent —
// routes catch query errors gracefully instead of crashing the whole function.
const url = process.env.SUPABASE_URL ?? 'http://localhost:54321'
const key = process.env.SUPABASE_ANON_KEY ?? 'anon-placeholder'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? key

// Anon client — respects RLS (used for portal/kiosk public ops)
export const supabase = createClient<Database>(url, key)

// Service-role client — bypasses RLS (used for server-side reception ops)
export const supabaseAdmin = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const DEFAULT_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'
