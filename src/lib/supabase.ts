import { createClient } from '@supabase/supabase-js'
import * as ws from 'ws'
import type { Database } from './db/types'

const url = process.env.SUPABASE_URL ?? 'http://localhost:54321'
const key = process.env.SUPABASE_ANON_KEY ?? 'anon-placeholder'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? key

export const supabase = createClient<Database>(url, key, {
  realtime: { transport: ws as unknown as typeof WebSocket },
})

export const supabaseAdmin = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws as unknown as typeof WebSocket },
})

export const DEFAULT_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'
