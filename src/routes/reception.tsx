import { Hono } from 'hono'
import { ReceptionLayout } from '../layouts/ReceptionLayout'
import { KpiTiles } from '../components/reception/KpiTiles'
import { DayChart } from '../components/reception/DayChart'
import { BookingTable } from '../components/reception/BookingTable'
import { BookingSlideOver } from '../components/reception/BookingSlideOver'
import { WalkInForm } from '../components/reception/WalkInForm'
import { ReportsView } from '../components/reception/ReportsView'
import { SettingsView } from '../components/reception/SettingsView'
import { ManualBookingForm } from '../components/reception/ManualBookingForm'
import { Icon, ICONS } from '../lib/Icon'
import {
  findBooking,
  getTodayBookings,
  getBookingsByDate,
  getDashboardStats,
  checkInBooking,
  completeBooking,
  getBookings,
  getBookingsByDateRange,
  cancelBooking,
  rescheduleBooking,
  refreshIcsStatus,
  createBooking,
} from '../lib/db/bookings'
import { getActiveWalkIns, createWalkIn, dismissWalkIn } from '../lib/db/walk-ins'
import { getTenant, updateTenant } from '../lib/db/tenants'
import { DEFAULT_TENANT_ID } from '../lib/supabase'
import { sendBookingCompleted } from '../lib/email'
import type { BookingStatus, ServiceType, WalkInPurpose } from '../data/types'

export const receptionRoutes = new Hono()

const WALK_IN_PURPOSE_LABEL: Record<WalkInPurpose, string> = {
  walk_in_pickup:  'Walk-in Pick Up',
  walk_in_dropoff: 'Walk-in Drop Off',
  visit_person:    'Visiting Person',
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
receptionRoutes.get('/', async (c) => {
  const [todayBookings, stats, walkIns] = await Promise.all([
    getTodayBookings().catch(() => []),
    getDashboardStats().catch(() => ({ totalScheduled: 0, checkedIn: 0, completed: 0, held: 0 })),
    getActiveWalkIns(DEFAULT_TENANT_ID).catch(() => []),
  ])
  return c.html(
    <ReceptionLayout title="Dashboard" activeNav="/reception" walkInCount={walkIns.length}>
      {/* KPI + chart with auto-refresh every 30s */}
      <div id="dashboard-stats" hx-get="/reception/api/stats" hx-trigger="every 30s" hx-swap="innerHTML">
        <KpiTiles stats={stats} />
        <DayChart bookings={todayBookings} />
      </div>
      <div id="dashboard-table" hx-get="/reception/api/today-bookings" hx-trigger="every 30s" hx-swap="outerHTML">
        <BookingTable bookings={todayBookings} />
      </div>
    </ReceptionLayout>
  )
})

// ─── All Bookings (filterable) ───────────────────────────────────────────────
receptionRoutes.get('/bookings', async (c) => {
  const status  = c.req.query('status') as BookingStatus | undefined
  const service = c.req.query('service') as ServiceType | undefined
  const date    = c.req.query('date')
  const search  = c.req.query('search')?.toLowerCase().trim()
  const isHtmx  = c.req.header('HX-Request') === 'true'

  let bookings = date
    ? await getBookingsByDate(date).catch(() => [])
    : await getBookings().catch(() => [])

  if (status)  bookings = bookings.filter(b => b.status === status)
  if (service) bookings = bookings.filter(b => b.serviceType === service)
  if (search)  bookings = bookings.filter(b =>
    b.referenceNumber.toLowerCase().includes(search) ||
    b.driverName.toLowerCase().includes(search) ||
    (b.houseBillNumber  ?? '').toLowerCase().includes(search) ||
    (b.containerNumber  ?? '').toLowerCase().includes(search) ||
    (b.driverPhone      ?? '').toLowerCase().includes(search) ||
    (b.guestName        ?? '').toLowerCase().includes(search)
  )

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
  return c.html(
    <div data-toast={`✓ ${booking.driverName} checked in`} data-toast-type="success">
      <BookingSlideOver booking={booking} />
    </div>
  )
})

// ─── Complete action ─────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/complete', async (c) => {
  const body    = await c.req.parseBody()
  const notes   = typeof body.completionNotes === 'string' ? body.completionNotes : undefined
  const booking = await completeBooking(c.req.param('id'), notes)
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)

  // Non-blocking completion email to guest if email on record
  const guestEmail = typeof body.guestEmail === 'string' ? body.guestEmail.trim() : undefined
  if (guestEmail) {
    getTenant(DEFAULT_TENANT_ID)
      .then(tenant => sendBookingCompleted({ to: guestEmail, booking, tenantName: tenant?.name ?? 'Glido CFS' }))
      .catch(err => console.error('[email] completion failed:', err))
  }

  return c.html(
    <div data-toast={`✓ ${booking.driverName}'s visit completed`} data-toast-type="success">
      <BookingSlideOver booking={booking} />
    </div>
  )
})

// ─── Cancel action ───────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/cancel', async (c) => {
  const booking = await cancelBooking(c.req.param('id'))
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  return c.html(
    <div data-toast={`Booking ${booking.referenceNumber} cancelled`} data-toast-type="info">
      <BookingSlideOver booking={booking} />
    </div>
  )
})

// ─── Reschedule action ───────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/reschedule', async (c) => {
  const body     = await c.req.parseBody()
  const newDate  = (body.newDate as string) || ''
  const newStart = (body.newStart as string) || ''
  if (!newDate || !newStart) {
    return c.html(<div style="padding:16px; color:#EF4444;">Date and time are required</div>)
  }
  // Compute end time from slot duration (default 60 min)
  const tenant = await getTenant(DEFAULT_TENANT_ID).catch(() => null)
  const dur = tenant?.slot_duration_min ?? 60
  const [h, m] = newStart.split(':').map(Number)
  const endMin = h * 60 + m + dur
  const newEnd = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`
  const booking = await rescheduleBooking(c.req.param('id'), newDate, newStart, newEnd)
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  return c.html(
    <div data-toast={`Rescheduled to ${newDate} at ${newStart}`} data-toast-type="success">
      <BookingSlideOver booking={booking} />
    </div>
  )
})

// ─── ICS Refresh action ──────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/refresh-ics', async (c) => {
  const booking = await refreshIcsStatus(c.req.param('id'))
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  return c.html(
    <div data-toast="ICS status refreshed" data-toast-type="info">
      <BookingSlideOver booking={booking} />
    </div>
  )
})

// ─── Mark EFT Paid ───────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/mark-eft-paid', async (c) => {
  const { supabaseAdmin } = await import('../lib/supabase')
  const id = c.req.param('id')
  await supabaseAdmin
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

// ─── Auto-refresh API partials ────────────────────────────────────────────────
receptionRoutes.get('/api/stats', async (c) => {
  const [stats, todayBookings] = await Promise.all([
    getDashboardStats().catch(() => ({ totalScheduled: 0, checkedIn: 0, completed: 0, held: 0 })),
    getTodayBookings().catch(() => []),
  ])
  return c.html(
    <>
      <KpiTiles stats={stats} />
      <DayChart bookings={todayBookings} />
    </>
  )
})

receptionRoutes.get('/api/today-bookings', async (c) => {
  const bookings = await getTodayBookings().catch(() => [])
  return c.html(
    <div id="dashboard-table" hx-get="/reception/api/today-bookings" hx-trigger="every 30s" hx-swap="outerHTML">
      <BookingTable bookings={bookings} />
    </div>
  )
})

receptionRoutes.get('/api/walk-in-count', async (c) => {
  const walkIns = await getActiveWalkIns(DEFAULT_TENANT_ID).catch(() => [])
  return c.json({ count: walkIns.length })
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

// ─── Manual Booking (staff creates booking) ───────────────────────────────────
receptionRoutes.get('/bookings/new', (c) => {
  const saved = c.req.query('saved') === '1'
  return c.html(
    <ReceptionLayout title="New Booking" activeNav="/reception/bookings">
      <div style="margin-bottom:20px;">
        <a href="/reception/bookings" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#78716C; text-decoration:none; margin-bottom:14px; transition:color 0.15s ease;"
          onmouseover="this.style.color='#1C1917'" onmouseout="this.style.color='#78716C'"
        >
          ← Back to Bookings
        </a>
        <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin:0 0 2px;">Create Booking</h2>
        <p style="font-size:12.5px; color:#78716C; margin:0;">Manually create a booking for a walk-in or phone caller.</p>
      </div>
      <ManualBookingForm savedFlash={saved} />
    </ReceptionLayout>
  )
})

receptionRoutes.post('/bookings/new', async (c) => {
  const body = await c.req.parseBody()
  const b    = body as Record<string, string>

  if (!b.driverName?.trim() || !b.slotDate || !b.slotStartTime || !b.slotEndTime || !b.serviceType || !b.loadType) {
    return c.html(
      <ReceptionLayout title="New Booking" activeNav="/reception/bookings">
        <div style="margin-bottom:20px;">
          <a href="/reception/bookings" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#78716C; text-decoration:none; margin-bottom:14px;">← Back to Bookings</a>
          <h2 style="font-size:17px; font-weight:600; color:#1C1917; margin:0 0 2px;">Create Booking</h2>
          <p style="font-size:12.5px; color:#78716C; margin:0;">Manually create a booking for a walk-in or phone caller.</p>
        </div>
        <ManualBookingForm error="Please fill in all required fields: driver name, service type, load type, date and time." />
      </ReceptionLayout>
    )
  }

  await createBooking({
    tenantId:       DEFAULT_TENANT_ID,
    serviceType:    b.serviceType as 'pickup' | 'dropoff',
    loadType:       b.loadType as 'lcl' | 'fcl',
    slotDate:       b.slotDate,
    slotStartTime:  b.slotStartTime,
    slotEndTime:    b.slotEndTime,
    driverName:     b.driverName.trim(),
    driverPhone:    b.driverPhone?.trim() || undefined,
    guestName:      b.guestName?.trim() || undefined,
    guestPhone:     b.guestPhone?.trim() || undefined,
    houseBillNumber: b.houseBillNumber?.trim() || undefined,
    containerNumber: b.containerNumber?.trim() || undefined,
    paymentMethod:  b.paymentMethod as 'eft' | 'card' | undefined || undefined,
    paymentStatus:  (b.paymentStatus as any) || 'pending',
  })

  return c.redirect('/reception/bookings/new?saved=1')
})

// ─── Reports ──────────────────────────────────────────────────────────────────
receptionRoutes.get('/reports', async (c) => {
  const from = c.req.query('from')
  const to   = c.req.query('to')
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10))

  const bookings = (from && to)
    ? await getBookingsByDateRange(from, to).catch(() => [])
    : await getBookings().catch(() => [])

  return c.html(
    <ReceptionLayout title="Reports" activeNav="/reception/reports">
      <ReportsView bookings={bookings} page={page} from={from} to={to} />
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
  const b = body as Record<string, string>

  // Build working hours JSON from checkbox/time fields
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const workingHours: Record<string, { enabled: boolean; open: string; close: string }> = {}
  for (const day of DAYS) {
    workingHours[day] = {
      enabled: b[`${day}_enabled`] === 'on',
      open:    b[`${day}_open`]    || '06:00',
      close:   b[`${day}_close`]   || '18:00',
    }
  }

  // Only update working_hours when the Working Hours tab is submitted
  const isWorkingHoursTab = (b.tab || '') === 'Working Hours'

  await updateTenant(DEFAULT_TENANT_ID, {
    name:                         b.name,
    address:                      b.address,
    contact_email:                b.contact_email,
    contact_phone:                b.contact_phone,
    timezone:                     b.timezone,
    currency:                     b.currency,
    slot_duration_min:            Number(b.slot_duration_min),
    max_bookings_per_slot:        Number(b.max_bookings_per_slot),
    advance_booking_days:         Number(b.advance_booking_days),
    slot_hold_duration_min:       Number(b.slot_hold_duration_min),
    same_day_cutoff_time:         b.same_day_cutoff_time,
    storage_rate_per_cbm:         Number(b.storage_rate_per_cbm),
    storage_free_days:            Number(b.storage_free_days),
    shrink_wrap_rate_per_pallet:  Number(b.shrink_wrap_rate_per_pallet),
    slot_fee_pickup:              Number(b.slot_fee_pickup),
    slot_fee_dropoff:             Number(b.slot_fee_dropoff),
    gst_enabled:                  b.gst_enabled === 'on',
    gst_rate:                     Number(b.gst_rate) || 10,
    stripe_public_key:            b.stripe_public_key || null,
    eft_bank_name:                b.eft_bank_name || null,
    eft_bsb:                      b.eft_bsb || null,
    eft_account_number:           b.eft_account_number || null,
    eft_account_name:             b.eft_account_name || null,
    require_payment_to_confirm:   b.require_payment_to_confirm === 'on',
    ...(isWorkingHoursTab ? { working_hours: workingHours } : {}),
  })

  return c.redirect(`/reception/settings?tab=${encodeURIComponent(b.tab || 'General')}&saved=1`)
})
