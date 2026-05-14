import { createClient } from '@supabase/supabase-js'
import type { Database } from './db/types'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
}

// Anon client — respects RLS (used for portal/kiosk public ops)
export const supabase = createClient<Database>(url, key)

// Service-role client — bypasses RLS (used for server-side reception ops)
// Falls back to anon key if service role key not set (dev convenience)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || key
export const supabaseAdmin = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const DEFAULT_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'
