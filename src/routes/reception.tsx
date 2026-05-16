import { Hono } from 'hono'
import { ReceptionLayout } from '../layouts/ReceptionLayout'
import { KpiTiles } from '../components/reception/KpiTiles'
import { DayChart } from '../components/reception/DayChart'
import { BookingTable } from '../components/reception/BookingTable'
import { BookingSlideOver } from '../components/reception/BookingSlideOver'
import { WalkInForm } from '../components/reception/WalkInForm'
import { ReportsView } from '../components/reception/ReportsView'
import { SettingsView } from '../components/reception/SettingsView'
import { Icon, ICONS } from '../lib/Icon'
import {
  findBooking,
  getTodayBookings,
  getBookingsByDate,
  getDashboardStats,
  checkInBooking,
  completeBooking,
  getBookings,
} from '../lib/db/bookings'
import { getActiveWalkIns, createWalkIn, dismissWalkIn } from '../lib/db/walk-ins'
import { getTenant, updateTenant } from '../lib/db/tenants'
import { DEFAULT_TENANT_ID } from '../lib/supabase'
import type { BookingStatus, ServiceType, WalkInPurpose } from '../data/types'

export const receptionRoutes = new Hono()

const WALK_IN_PURPOSE_LABEL: Record<WalkInPurpose, string> = {
  walk_in_pickup:  'Walk-in Pick Up',
  walk_in_dropoff: 'Walk-in Drop Off',
  visit_person:    'Visiting Person',
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
receptionRoutes.get('/', async (c) => {
  const [todayBookings, stats] = await Promise.all([
    getTodayBookings().catch(() => []),
    getDashboardStats().catch(() => ({ totalScheduled: 0, checkedIn: 0, completed: 0, held: 0 })),
  ])
  return c.html(
    <ReceptionLayout title="Dashboard" activeNav="/reception">
      <KpiTiles stats={stats} />
      <DayChart bookings={todayBookings} />
      <BookingTable bookings={todayBookings} />
    </ReceptionLayout>
  )
})

// ─── All Bookings (filterable) ───────────────────────────────────────────────
receptionRoutes.get('/bookings', async (c) => {
  const status  = c.req.query('status') as BookingStatus | undefined
  const service = c.req.query('service') as ServiceType | undefined
  const date    = c.req.query('date')
  const isHtmx  = c.req.header('HX-Request') === 'true'

  let bookings = date
    ? await getBookingsByDate(date).catch(() => [])
    : await getBookings().catch(() => [])

  if (status)  bookings = bookings.filter(b => b.status === status)
  if (service) bookings = bookings.filter(b => b.serviceType === service)

  if (isHtmx) {
    return c.html(<BookingTable bookings={bookings} title="All Bookings" showFilters />)
  }
  return c.html(
    <ReceptionLayout title="All Bookings" activeNav="/reception/bookings">
      <BookingTable bookings={bookings} title="All Bookings" showFilters />
    </ReceptionLayout>
  )
})

// ─── Booking detail (slide-over fragment) ───────────────────────────────────
receptionRoutes.get('/bookings/:id', async (c) => {
  const isHtmx  = c.req.header('HX-Request') === 'true'
  const booking = await findBooking(c.req.param('id'))
  if (!booking) {
    return isHtmx
      ? c.html(<div style="padding:24px; color:#EF4444;">Booking not found.</div>)
      : c.redirect('/reception/bookings')
  }
  if (isHtmx) return c.html(<BookingSlideOver booking={booking} />)
  return c.html(
    <ReceptionLayout title={booking.referenceNumber} activeNav="/reception/bookings">
      <div style="max-width:672px; margin:0 auto; background:linear-gradient(180deg,#1F2831 0%,#1A2028 100%); border-radius:12px; border:1px solid rgba(255,255,255,0.07);">
        <BookingSlideOver booking={booking} />
      </div>
    </ReceptionLayout>
  )
})

// ─── Check-in action ────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/check-in', async (c) => {
  const booking = await checkInBooking(c.req.param('id'))
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Complete action ─────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/complete', async (c) => {
  const body    = await c.req.parseBody()
  const notes   = typeof body.completionNotes === 'string' ? body.completionNotes : undefined
  const booking = await completeBooking(c.req.param('id'), notes)
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Mark EFT Paid ───────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/mark-eft-paid', async (c) => {
  const { supabase } = await import('../lib/supabase')
  const id = c.req.param('id')
  const db = supabase as any
  await db
    .from('bookings')
    .update({ payment_status: 'paid' })
    .eq('id', id)
  const booking = await findBooking(id)
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Walk-ins list ───────────────────────────────────────────────────────────
receptionRoutes.get('/walk-ins', async (c) => {
  const walkIns = await getActiveWalkIns(DEFAULT_TENANT_ID).catch(() => [])
  return c.html(
    <ReceptionLayout title="Walk-Ins" activeNav="/reception/walk-ins">
      <div style="background:linear-gradient(180deg,#1F2831 0%,#1A2028 100%); border-radius:12px; border:1px solid rgba(255,255,255,0.07); overflow:hidden; box-shadow:inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.40);">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.07);">
          <h2 style="font-weight:600; color:#F1F5F9; font-size:14px;">Walk-In Visitors</h2>
          <span style="font-size:11px; color:#64748B; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); padding:2px 10px; border-radius:9999px; font-weight:500;">
            {walkIns.length} active
          </span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; font-size:12px; border-collapse:collapse;">
            <thead>
              <tr style="background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.07);">
                <th style="text-align:left; padding:10px 20px; color:#64748B; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">Name</th>
                <th style="text-align:left; padding:10px 16px; color:#64748B; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">Phone</th>
                <th style="text-align:left; padding:10px 16px; color:#64748B; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">Purpose</th>
                <th style="text-align:left; padding:10px 16px; color:#64748B; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">Arrived</th>
                <th style="text-align:left; padding:10px 16px; color:#64748B; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.04em;">Licence</th>
                <th style="padding:10px 16px;"></th>
              </tr>
            </thead>
            <tbody>
              {walkIns.map((w) => (
                <tr key={w.id} style="border-bottom:1px solid rgba(255,255,255,0.05);" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                  <td style="padding:12px 20px;">
                    <p style="font-weight:600; color:#F1F5F9;">{w.visitorName}</p>
                    {w.personBeingVisited && (
                      <p style="font-size:11px; color:#64748B; margin-top:2px;">→ {w.personBeingVisited}</p>
                    )}
                  </td>
                  <td style="padding:12px 16px; color:#94A3B8; font-size:11px;">{w.contactNumber || '—'}</td>
                  <td style="padding:12px 16px;">
                    <span style="display:inline-flex; align-items:center; font-size:11px; font-weight:500; padding:2px 8px; border-radius:9999px; background:rgba(252,101,20,0.10); color:rgba(252,101,20,0.85); border:1px solid rgba(252,101,20,0.22);">
                      {WALK_IN_PURPOSE_LABEL[w.purpose]}
                    </span>
                  </td>
                  <td style="padding:12px 16px; font-size:11px; color:#94A3B8;">
                    {new Date(w.arrivedAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style="padding:12px 16px;">
                    {w.licenceCaptured ? (
                      <span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:500; color:#22C55E;">
                        <Icon name={ICONS.check} size={12} style="color:#22C55E;" />
                        Captured
                      </span>
                    ) : (
                      <span style="font-size:11px; color:#64748B;">Not captured</span>
                    )}
                  </td>
                  <td style="padding:12px 16px;">
                    <form method="post" action={`/reception/walk-ins/${w.id}/dismiss`} style="display:inline;">
                      <button
                        type="submit"
                        style="font-size:11px; color:#64748B; background:none; border:none; cursor:pointer; transition:color 0.15s ease;"
                        onmouseover="this.style.color='#94A3B8'"
                        onmouseout="this.style.color='#64748B'"
                      >
                        Dismiss
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {walkIns.length === 0 && (
                <tr>
                  <td colspan={6} style="padding:32px 20px; text-align:center; font-size:12px; color:#64748B;">
                    No active walk-ins
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionLayout>
  )
})

// ─── Dismiss walk-in ─────────────────────────────────────────────────────────
receptionRoutes.post('/walk-ins/:id/dismiss', async (c) => {
  await dismissWalkIn(c.req.param('id'))
  return c.redirect('/reception/walk-ins')
})

// ─── Walk-in registration form ────────────────────────────────────────────────
receptionRoutes.get('/walk-in', (c) => {
  return c.html(
    <ReceptionLayout title="Walk-in Registration" activeNav="/reception/walk-in">
      <WalkInForm />
    </ReceptionLayout>
  )
})

receptionRoutes.post('/walk-in', async (c) => {
  const body = await c.req.parseBody()

  const walkIn = await createWalkIn({
    tenantId:    DEFAULT_TENANT_ID,
    purpose:     (body.purpose as WalkInPurpose) || 'walk_in_pickup',
    visitorName: (body.visitorName as string) || 'Unknown',
    contactNumber:      body.contactNumber as string | undefined,
    personBeingVisited: body.personBeingVisited as string | undefined,
    reason:             body.reason as string | undefined,
    licenceCaptured:    body.licenceCaptured === 'true',
  })

  return c.html(
    <div style="background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.22); border-radius:12px; padding:20px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <div style="width:40px; height:40px; background:rgba(34,197,94,0.15); border-radius:9999px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <Icon name={ICONS.check} size={20} style="color:#22C55E;" />
        </div>
        <div>
          <p style="font-weight:600; color:#22C55E;">Walk-in Registered</p>
          <p style="font-size:13px; color:#4ADE80;">{walkIn.visitorName}</p>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:8px; padding:12px 16px; display:inline-block;">
        <p style="font-size:11px; color:#64748B; margin-bottom:2px;">Walk-in ID</p>
        <p style="font-family:ui-monospace,monospace; font-weight:700; font-size:18px; color:#F1F5F9;">{walkIn.id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  )
})

// ─── Reports ──────────────────────────────────────────────────────────────────
receptionRoutes.get('/reports', (c) => {
  return c.html(
    <ReceptionLayout title="Reports" activeNav="/reception/reports">
      <ReportsView />
    </ReceptionLayout>
  )
})

// ─── Settings GET ─────────────────────────────────────────────────────────────
receptionRoutes.get('/settings', async (c) => {
  const tab = c.req.query('tab') || 'General'
  const tenant = await getTenant(DEFAULT_TENANT_ID).catch(() => null)
  return c.html(
    <ReceptionLayout title="Settings" activeNav="/reception/settings">
      <SettingsView activeTab={tab} tenant={tenant} users={[]} />
    </ReceptionLayout>
  )
})

// ─── Settings POST ────────────────────────────────────────────────────────────
receptionRoutes.post('/settings', async (c) => {
  const body = await c.req.parseBody()
  const {
    name, address, contact_email, contact_phone, timezone, currency,
    slot_duration_min, max_bookings_per_slot, advance_booking_days,
    slot_hold_duration_min, same_day_cutoff_time,
    storage_rate_per_cbm, storage_free_days, shrink_wrap_rate_per_pallet,
    slot_fee_pickup, slot_fee_dropoff,
    gst_enabled, gst_rate,
    stripe_public_key, eft_bank_name, eft_bsb, eft_account_number, eft_account_name,
    require_payment_to_confirm,
  } = body as Record<string, string>

  await updateTenant(DEFAULT_TENANT_ID, {
    name,
    address,
    contact_email,
    contact_phone,
    timezone,
    currency,
    slot_duration_min:            Number(slot_duration_min),
    max_bookings_per_slot:        Number(max_bookings_per_slot),
    advance_booking_days:         Number(advance_booking_days),
    slot_hold_duration_min:       Number(slot_hold_duration_min),
    same_day_cutoff_time,
    storage_rate_per_cbm:         Number(storage_rate_per_cbm),
    storage_free_days:            Number(storage_free_days),
    shrink_wrap_rate_per_pallet:  Number(shrink_wrap_rate_per_pallet),
    slot_fee_pickup:              Number(slot_fee_pickup),
    slot_fee_dropoff:             Number(slot_fee_dropoff),
    gst_enabled:                  gst_enabled === 'on',
    gst_rate:                     Number(gst_rate) || 10,
    stripe_public_key:            stripe_public_key || null,
    eft_bank_name:                eft_bank_name || null,
    eft_bsb:                      eft_bsb || null,
    eft_account_number:           eft_account_number || null,
    eft_account_name:             eft_account_name || null,
    require_payment_to_confirm:   require_payment_to_confirm === 'on',
  })

  return c.redirect(`/reception/settings?tab=${encodeURIComponent(body.tab as string || 'General')}&saved=1`)
})
