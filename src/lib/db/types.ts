export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          checked_in_at: string | null
          completed_at: string | null
          completion_notes: string | null
          container_number: string | null
          created_at: string
          driver_name: string
          driver_phone: string | null
          gst_amount: number | null
          guest_name: string | null
          guest_phone: string | null
          house_bill_number: string | null
          ics_last_checked_at: string | null
          ics_status: string | null
          id: string
          load_type: string
          package_count: number | null
          pallet_count: number | null
          pallet_type: string | null
          payment_method: string | null
          payment_status: string | null
          reference_number: string
          service_type: string
          session_id: string | null
          shrink_wrap_charge: number | null
          slot_date: string
          slot_end_time: string
          slot_fee: number | null
          slot_start_time: string
          status: string
          storage_charge: number | null
          storage_days: number | null
          storage_start_date: string | null
          subtotal: number | null
          tenant_id: string
          total_amount: number | null
          volume_cbm: number | null
          weight_kg: number | null
        }
        Insert: {
          checked_in_at?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          container_number?: string | null
          created_at?: string
          driver_name: string
          driver_phone?: string | null
          gst_amount?: number | null
          guest_name?: string | null
          guest_phone?: string | null
          house_bill_number?: string | null
          ics_last_checked_at?: string | null
          ics_status?: string | null
          id?: string
          load_type: string
          package_count?: number | null
          pallet_count?: number | null
          pallet_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          reference_number: string
          service_type: string
          session_id?: string | null
          shrink_wrap_charge?: number | null
          slot_date: string
          slot_end_time: string
          slot_fee?: number | null
          slot_start_time: string
          status?: string
          storage_charge?: number | null
          storage_days?: number | null
          storage_start_date?: string | null
          subtotal?: number | null
          tenant_id: string
          total_amount?: number | null
          volume_cbm?: number | null
          weight_kg?: number | null
        }
        Update: {
          checked_in_at?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          container_number?: string | null
          created_at?: string
          driver_name?: string
          driver_phone?: string | null
          gst_amount?: number | null
          guest_name?: string | null
          guest_phone?: string | null
          house_bill_number?: string | null
          ics_last_checked_at?: string | null
          ics_status?: string | null
          id?: string
          load_type?: string
          package_count?: number | null
          pallet_count?: number | null
          pallet_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          reference_number?: string
          service_type?: string
          session_id?: string | null
          shrink_wrap_charge?: number | null
          slot_date?: string
          slot_end_time?: string
          slot_fee?: number | null
          slot_start_time?: string
          status?: string
          storage_charge?: number | null
          storage_days?: number | null
          storage_start_date?: string | null
          subtotal?: number | null
          tenant_id?: string
          total_amount?: number | null
          volume_cbm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          capacity: number
          confirmed: number
          created_at: string
          date: string
          end_time: string
          held: number
          id: string
          start_time: string
          tenant_id: string | null
        }
        Insert: {
          capacity?: number
          confirmed?: number
          created_at?: string
          date: string
          end_time: string
          held?: number
          id: string
          start_time: string
          tenant_id?: string | null
        }
        Update: {
          capacity?: number
          confirmed?: number
          created_at?: string
          date?: string
          end_time?: string
          held?: number
          id?: string
          start_time?: string
          tenant_id?: string | null
        }
        Relationships: []
      }
      walk_ins: {
        Row: {
          arrived_at: string
          contact_number: string | null
          created_at: string
          dismissed: boolean
          dismissed_at: string | null
          id: string
          licence_captured: boolean
          person_being_visited: string | null
          purpose: string
          reason: string | null
          tenant_id: string
          visitor_name: string
        }
        Insert: {
          arrived_at?: string
          contact_number?: string | null
          created_at?: string
          dismissed?: boolean
          dismissed_at?: string | null
          id?: string
          licence_captured?: boolean
          person_being_visited?: string | null
          purpose: string
          reason?: string | null
          tenant_id: string
          visitor_name: string
        }
        Update: {
          arrived_at?: string
          contact_number?: string | null
          created_at?: string
          dismissed?: boolean
          dismissed_at?: string | null
          id?: string
          licence_captured?: boolean
          person_being_visited?: string | null
          purpose?: string
          reason?: string | null
          tenant_id?: string
          visitor_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
