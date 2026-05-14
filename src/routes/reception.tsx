import { Hono } from 'hono'
import { ReceptionLayout } from '../layouts/ReceptionLayout'
import { KpiTiles } from '../components/reception/KpiTiles'
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
import type { BookingStatus, ServiceType, WalkInPurpose } from '../data/types'

export const receptionRoutes = new Hono()

const DEFAULT_TENANT = 'tenant-abc-cfs'

const WALK_IN_PURPOSE_LABEL: Record<WalkInPurpose, string> = {
  walk_in_pickup:  'Walk-in Pick Up',
  walk_in_dropoff: 'Walk-in Drop Off',
  visit_person:    'Visiting Person',
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
receptionRoutes.get('/', async (c) => {
  const [todayBookings, stats] = await Promise.all([
    getTodayBookings(),
    getDashboardStats(),
  ])
  return c.html(
    <ReceptionLayout title="Dashboard" activeNav="/reception">
      <KpiTiles stats={stats} />
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
    ? await getBookingsByDate(date)
    : await getBookings()

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
      ? c.html(<div class="p-6 text-red-500">Booking not found.</div>)
      : c.redirect('/reception/bookings')
  }
  if (isHtmx) return c.html(<BookingSlideOver booking={booking} />)
  return c.html(
    <ReceptionLayout title={booking.referenceNumber} activeNav="/reception/bookings">
      <div class="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200">
        <BookingSlideOver booking={booking} />
      </div>
    </ReceptionLayout>
  )
})

// ─── Check-in action ────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/check-in', async (c) => {
  const booking = await checkInBooking(c.req.param('id'))
  if (!booking) return c.html(<div class="p-4 text-red-500">Not found</div>)
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Complete action ─────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/complete', async (c) => {
  const body    = await c.req.parseBody()
  const notes   = typeof body.completionNotes === 'string' ? body.completionNotes : undefined
  const booking = await completeBooking(c.req.param('id'), notes)
  if (!booking) return c.html(<div class="p-4 text-red-500">Not found</div>)
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Walk-ins list ───────────────────────────────────────────────────────────
receptionRoutes.get('/walk-ins', async (c) => {
  const walkIns = await getActiveWalkIns(DEFAULT_TENANT)
  return c.html(
    <ReceptionLayout title="Walk-Ins" activeNav="/reception/walk-ins">
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 class="font-semibold text-slate-800">Walk-In Visitors</h2>
          <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            {walkIns.length} active
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
                <th class="text-left px-5 py-3 font-semibold">Name</th>
                <th class="text-left px-4 py-3 font-semibold">Phone</th>
                <th class="text-left px-4 py-3 font-semibold">Purpose</th>
                <th class="text-left px-4 py-3 font-semibold">Arrived</th>
                <th class="text-left px-4 py-3 font-semibold">Licence</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {walkIns.map((w) => (
                <tr key={w.id} class="bg-white hover:bg-slate-50 transition-colors">
                  <td class="px-5 py-3.5">
                    <p class="font-semibold text-slate-800">{w.visitorName}</p>
                    {w.personBeingVisited && (
                      <p class="text-xs text-slate-400">→ {w.personBeingVisited}</p>
                    )}
                  </td>
                  <td class="px-4 py-3.5 text-slate-600 text-xs">{w.contactNumber || '—'}</td>
                  <td class="px-4 py-3.5">
                    <span class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {WALK_IN_PURPOSE_LABEL[w.purpose]}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-xs text-slate-600">
                    {new Date(w.arrivedAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td class="px-4 py-3.5">
                    {w.licenceCaptured ? (
                      <span class="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                        <Icon name={ICONS.check} size={12} class="text-green-600" />
                        Captured
                      </span>
                    ) : (
                      <span class="text-xs text-slate-400">Not captured</span>
                    )}
                  </td>
                  <td class="px-4 py-3.5">
                    <form method="post" action={`/reception/walk-ins/${w.id}/dismiss`} style="display:inline">
                      <button
                        type="submit"
                        class="text-xs text-slate-400 hover:text-red-500 transition-colors"
                      >
                        Dismiss
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {walkIns.length === 0 && (
                <tr>
                  <td colspan={6} class="px-5 py-8 text-center text-sm text-slate-400">
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
    tenantId:    DEFAULT_TENANT,
    purpose:     (body.purpose as WalkInPurpose) || 'walk_in_pickup',
    visitorName: (body.visitorName as string) || 'Unknown',
    contactNumber:      body.contactNumber as string | undefined,
    personBeingVisited: body.personBeingVisited as string | undefined,
    reason:             body.reason as string | undefined,
    licenceCaptured:    body.licenceCaptured === 'true',
  })

  return c.html(
    <div class="bg-green-50 border border-green-200 rounded-xl p-5">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Icon name={ICONS.check} size={20} class="text-green-600" />
        </div>
        <div>
          <p class="font-semibold text-green-800">Walk-in Registered</p>
          <p class="text-sm text-green-600">{walkIn.visitorName}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg px-4 py-3 inline-block">
        <p class="text-xs text-slate-400 mb-0.5">Walk-in ID</p>
        <p class="font-mono font-bold text-lg text-slate-800">{walkIn.id.slice(0, 8).toUpperCase()}</p>
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

// ─── Settings ─────────────────────────────────────────────────────────────────
receptionRoutes.get('/settings', (c) => {
  const tab = c.req.query('tab') || 'General'
  return c.html(
    <ReceptionLayout title="Settings" activeNav="/reception/settings">
      <SettingsView activeTab={tab} />
    </ReceptionLayout>
  )
})
