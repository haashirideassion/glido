import { supabase } from '../supabase'
import type { Database } from './types'

export type TenantRow = Database['public']['Tables']['tenants']['Row']
export type TenantUpdate = Database['public']['Tables']['tenants']['Update']

export interface WorkingHours {
  mon: { open: string; close: string; enabled: boolean }
  tue: { open: string; close: string; enabled: boolean }
  wed: { open: string; close: string; enabled: boolean }
  thu: { open: string; close: string; enabled: boolean }
  fri: { open: string; close: string; enabled: boolean }
  sat: { open: string; close: string; enabled: boolean }
  sun: { open: string; close: string; enabled: boolean }
}

export async function getTenant(id: string): Promise<TenantRow | undefined> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data ?? undefined
}

export async function updateTenant(id: string, updates: TenantUpdate): Promise<TenantRow> {
  const { data, error } = await supabase
    .from('tenants')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export function getWorkingHours(tenant: TenantRow): WorkingHours {
  return tenant.working_hours as unknown as WorkingHours
}
