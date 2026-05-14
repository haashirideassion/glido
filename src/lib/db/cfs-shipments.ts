import { supabase } from '../supabase'
import type { Database } from './types'

export type ShipmentRow = Database['public']['Tables']['cfs_shipments']['Row']

export interface ShipmentLookupResult {
  hbl: string
  containerNumber?: string
  weightKg?: number
  volumeCbm?: number
  packageCount?: number
  palletCount?: number
  palletType?: string
  storageStartDate?: string
  readyForCollection: boolean
  description?: string
}

export async function lookupShipment(
  tenantId: string,
  hbl: string,
): Promise<ShipmentLookupResult | undefined> {
  const { data, error } = await supabase
    .from('cfs_shipments')
    .select('*')
    .eq('tenant_id', tenantId)
    .ilike('house_bill_number', hbl.trim())
    .maybeSingle()
  if (error) throw error
  if (!data) return undefined
  return rowToResult(data)
}

export async function lookupShipmentByContainer(
  tenantId: string,
  containerNumber: string,
): Promise<ShipmentLookupResult | undefined> {
  const { data, error } = await supabase
    .from('cfs_shipments')
    .select('*')
    .eq('tenant_id', tenantId)
    .ilike('container_number', containerNumber.trim())
    .maybeSingle()
  if (error) throw error
  if (!data) return undefined
  return rowToResult(data)
}

function rowToResult(row: ShipmentRow): ShipmentLookupResult {
  return {
    hbl:                row.house_bill_number,
    containerNumber:    row.container_number ?? undefined,
    weightKg:           row.weight_kg ?? undefined,
    volumeCbm:          row.volume_cbm ?? undefined,
    packageCount:       row.package_count ?? undefined,
    palletCount:        row.pallet_count ?? undefined,
    palletType:         row.pallet_type ?? undefined,
    storageStartDate:   row.storage_start_date ?? undefined,
    readyForCollection: row.ready_for_collection,
    description:        row.description ?? undefined,
  }
}
