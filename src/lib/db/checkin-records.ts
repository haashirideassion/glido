import { supabaseAdmin as supabase } from '../supabase'
import type { Database } from './types'

type CheckinRow = Database['public']['Tables']['checkin_records']['Row']

export interface CheckinRecord {
  id: string
  bookingId?: string
  tenantId: string
  isWalkIn: boolean
  walkInPurpose?: string
  visitPersonName?: string
  walkInReason?: string
  licenceScanMethod?: string
  licenceName?: string
  licenceNumber?: string
  licenceDob?: string
  licenceExpiry?: string
  licenceAddress?: string
  nameMatchResult?: string
  nameMatchScore?: number
  expiryValid?: boolean
  checkInTime: string
  dismissedAt?: string
  dismissedBy?: string
}

export interface CreateCheckinInput {
  bookingId?: string
  tenantId: string
  isWalkIn?: boolean
  walkInPurpose?: string
  visitPersonName?: string
  walkInReason?: string
  licenceScanMethod?: string
  licenceName?: string
  licenceNumber?: string
  licenceDob?: string
  licenceExpiry?: string
  licenceAddress?: string
  nameMatchResult?: string
  nameMatchScore?: number
  expiryValid?: boolean
}

function rowToRecord(row: CheckinRow): CheckinRecord {
  return {
    id:                row.id,
    bookingId:         row.booking_id ?? undefined,
    tenantId:          row.tenant_id,
    isWalkIn:          row.is_walk_in,
    walkInPurpose:     row.walk_in_purpose ?? undefined,
    visitPersonName:   row.visit_person_name ?? undefined,
    walkInReason:      row.walk_in_reason ?? undefined,
    licenceScanMethod: row.licence_scan_method ?? undefined,
    licenceName:       row.licence_name ?? undefined,
    licenceNumber:     row.licence_number ?? undefined,
    licenceDob:        row.licence_dob ?? undefined,
    licenceExpiry:     row.licence_expiry ?? undefined,
    licenceAddress:    row.licence_address ?? undefined,
    nameMatchResult:   row.name_match_result ?? undefined,
    nameMatchScore:    row.name_match_score ?? undefined,
    expiryValid:       row.expiry_valid ?? undefined,
    checkInTime:       row.check_in_time,
    dismissedAt:       row.dismissed_at ?? undefined,
    dismissedBy:       row.dismissed_by ?? undefined,
  }
}

export async function createCheckinRecord(input: CreateCheckinInput): Promise<CheckinRecord> {
  const { data, error } = await supabase
    .from('checkin_records')
    .insert({
      booking_id:          input.bookingId ?? null,
      tenant_id:           input.tenantId,
      is_walk_in:          input.isWalkIn ?? false,
      walk_in_purpose:     input.walkInPurpose ?? null,
      visit_person_name:   input.visitPersonName ?? null,
      walk_in_reason:      input.walkInReason ?? null,
      licence_scan_method: input.licenceScanMethod ?? null,
      licence_name:        input.licenceName ?? null,
      licence_number:      input.licenceNumber ?? null,
      licence_dob:         input.licenceDob ?? null,
      licence_expiry:      input.licenceExpiry ?? null,
      licence_address:     input.licenceAddress ?? null,
      name_match_result:   input.nameMatchResult ?? 'not_checked',
      name_match_score:    input.nameMatchScore ?? null,
      expiry_valid:        input.expiryValid ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return rowToRecord(data)
}

export async function getActiveWalkInRecords(tenantId: string): Promise<CheckinRecord[]> {
  const { data, error } = await supabase
    .from('checkin_records')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_walk_in', true)
    .is('dismissed_at', null)
    .order('check_in_time', { ascending: false })
  if (error) throw error
  return data.map(rowToRecord)
}

export async function dismissCheckinRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('checkin_records')
    .update({ dismissed_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function getCheckinByBooking(bookingId: string): Promise<CheckinRecord | undefined> {
  const { data, error } = await supabase
    .from('checkin_records')
    .select('*')
    .eq('booking_id', bookingId)
    .order('check_in_time', { ascending: false })
    .maybeSingle()
  if (error) throw error
  return data ? rowToRecord(data) : undefined
}
