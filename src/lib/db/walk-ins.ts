import { supabase } from '../supabase'
import type { WalkIn, WalkInPurpose } from '../../data/types'
import type { Database } from './types'

type WalkInRow = Database['public']['Tables']['walk_ins']['Row']

function rowToWalkIn(row: WalkInRow): WalkIn {
  return {
    id:                  row.id,
    tenantId:            row.tenant_id,
    purpose:             row.purpose as WalkInPurpose,
    visitorName:         row.visitor_name,
    contactNumber:       row.contact_number ?? undefined,
    personBeingVisited:  row.person_being_visited ?? undefined,
    reason:              row.reason ?? undefined,
    arrivedAt:           row.arrived_at,
    licenceCaptured:     row.licence_captured,
    dismissed:           row.dismissed,
    dismissedAt:         row.dismissed_at ?? undefined,
  }
}

export async function getActiveWalkIns(tenantId: string): Promise<WalkIn[]> {
  const { data, error } = await supabase
    .from('walk_ins')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('dismissed', false)
    .order('arrived_at', { ascending: true })
  if (error) throw error
  return data.map(rowToWalkIn)
}

export async function getAllWalkIns(tenantId: string): Promise<WalkIn[]> {
  const { data, error } = await supabase
    .from('walk_ins')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('arrived_at', { ascending: false })
  if (error) throw error
  return data.map(rowToWalkIn)
}

export interface CreateWalkInInput {
  tenantId:            string
  purpose:             WalkInPurpose
  visitorName:         string
  contactNumber?:      string
  personBeingVisited?: string
  reason?:             string
  licenceCaptured?:    boolean
}

export async function createWalkIn(input: CreateWalkInInput): Promise<WalkIn> {
  const { data, error } = await supabase
    .from('walk_ins')
    .insert({
      tenant_id:            input.tenantId,
      purpose:              input.purpose,
      visitor_name:         input.visitorName,
      contact_number:       input.contactNumber ?? null,
      person_being_visited: input.personBeingVisited ?? null,
      reason:               input.reason ?? null,
      licence_captured:     input.licenceCaptured ?? false,
    })
    .select()
    .single()
  if (error) throw error
  return rowToWalkIn(data)
}

export async function dismissWalkIn(id: string): Promise<void> {
  const { error } = await supabase
    .from('walk_ins')
    .update({ dismissed: true, dismissed_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
