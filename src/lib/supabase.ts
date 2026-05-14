import { createClient } from '@supabase/supabase-js'
import type { Database } from './db/types'

const url  = process.env.SUPABASE_URL
const key  = process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient<Database>(url, key)
