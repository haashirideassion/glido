import { Hono } from 'hono'
import { ReceptionLayout } from '../layouts/ReceptionLayout'
import { KpiTiles } from '../components/reception/KpiTiles'
import { BookingTable } from '../components/reception/BookingTable'
import { BookingSlideOver } from '../components/reception/BookingSlideOver'
import { WalkInForm } from '../components/reception/WalkInForm'
import { ReportsView } from '../components/reception/ReportsView'
import { SettingsView } from '../components/reception/SettingsView'
import { Icon, ICONS } from '../lib/Icon'
import { mockBookings, findBooking, getTodayBookings, getBookingsByDate, getDashboardStats } from '../data/bookings'
import type { BookingStatus, ServiceType, WalkIn, WalkInPurpose } from '../data/types'

export const receptionRoutes = new Hono()

// ─── Mock walk-in data ───────────────────────────────────────────────────────
const mockWalkIns: WalkIn[] = [
  {
    id: 'w1',
    tenantId: 'tenant-abc-cfs',
    purpose: 'walk_in_pickup',
    visitorName: 'Danny Sullivan',
    contactNumber: '+61412999001',
    arrivedAt: '2026-05-12T07:42:00Z',
    licenceCaptured: true,
    dismissed: false,
  },
  {
    id: 'w2',
    tenantId: 'tenant-abc-cfs',
    purpose: 'visit_person',
    visitorName: 'Emma Clarke',
    contactNumber: '+61423888002',
    personBeingVisited: 'Operations Manager',
    reason: 'Delivery audit',
    arrivedAt: '2026-05-12T09:15:00Z',
    licenceCaptured: false,
    dismissed: false,
  },
  {
    id: 'w3',
    tenantId: 'tenant-abc-cfs',
    purpose: 'walk_in_dropoff',
    visitorName: 'Hassan Al-Farsi',
    contactNumber: '+61434777003',
    arrivedAt: '2026-05-12T10:30:00Z',
    licenceCaptured: true,
    dismissed: false,
  },
]

const WALK_IN_PURPOSE_LABEL: Record<WalkInPurpose, string> = {
  walk_in_pickup:  'Walk-in Pick Up',
  walk_in_dropoff: 'Walk-in Drop Off',
  visit_person:    'Visiting Person',
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
receptionRoutes.get('/', (c) => {
  const todayBookings = getTodayBookings()
  const stats = getDashboardStats()
  return c.html(
    <ReceptionLayout title="Dashboard" activeNav="/reception">
      <KpiTiles stats={stats} />
      <BookingTable bookings={todayBookings} />
    </ReceptionLayout>
  )
})

// ─── All Bookings (filterable) ───────────────────────────────────────────────
receptionRoutes.get('/bookings', (c) => {
  const status = c.req.query('status') as BookingStatus | undefined
  const service = c.req.query('service') as ServiceType | undefined
  const date = c.req.query('date')
  const isHtmx = c.req.header('HX-Request') === 'true'

  let bookings = mockBookings
  if (status) bookings = bookings.filter((b) => b.status === status)
  if (service) bookings = bookings.filter((b) => b.serviceType === service)
  if (date) bookings = bookings.filter((b) => b.slotDate === date)

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
receptionRoutes.get('/bookings/:id', (c) => {
  const isHtmx = c.req.header('HX-Request') === 'true'
  const booking = findBooking(c.req.param('id'))
  if (!booking) {
    return isHtmx
      ? c.html(<div class="p-6 text-red-500">Booking not found.</div>)
      : c.redirect('/reception/bookings')
  }
  if (isHtmx) {
    return c.html(<BookingSlideOver booking={booking} />)
  }
  return c.html(
    <ReceptionLayout title={booking.referenceNumber} activeNav="/reception/bookings">
      <div class="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200">
        <BookingSlideOver booking={booking} />
      </div>
    </ReceptionLayout>
  )
})

// ─── Check-in action ────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/check-in', (c) => {
  const booking = findBooking(c.req.param('id'))
  if (!booking) return c.html(<div class="p-4 text-red-500">Not found</div>)
  booking.status = 'checked_in'
  booking.checkedInAt = new Date().toISOString()
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Complete action ─────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/complete', (c) => {
  const booking = findBooking(c.req.param('id'))
  if (!booking) return c.html(<div class="p-4 text-red-500">Not found</div>)
  booking.status = 'completed'
  booking.completedAt = new Date().toISOString()
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Walk-ins list ───────────────────────────────────────────────────────────
receptionRoutes.get('/walk-ins', (c) => {
  return c.html(
    <ReceptionLayout title="Walk-Ins" activeNav="/reception/walk-ins">
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 class="font-semibold text-slate-800">Walk-In Visitors</h2>
          <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            {mockWalkIns.filter(w => !w.dismissed).length} active
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
              {mockWalkIns.map((w) => (
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
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="text-xs text-blue-600 hover:underline font-medium"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        class="text-xs text-slate-400 hover:text-red-500 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionLayout>
  )
})

// ─── Walk-in form (legacy) ────────────────────────────────────────────────────
receptionRoutes.get('/walk-in', (c) => {
  return c.html(
    <ReceptionLayout title="Walk-in Registration" activeNav="/reception/walk-in">
      <WalkInForm />
    </ReceptionLayout>
  )
})

receptionRoutes.post('/walk-in', async (c) => {
  const body = await c.req.parseBody()
  const rand = String(Math.floor(Math.random() * 90000) + 10000)
  const ref = `GLD-2026-${rand}`
  return c.html(
    <div class="bg-green-50 border border-green-200 rounded-xl p-5">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Icon name={ICONS.check} size={20} class="text-green-600" />
        </div>
        <div>
          <p class="font-semibold text-green-800">Walk-in Registered</p>
          <p class="text-sm text-green-600">{body.visitorName as string}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg px-4 py-3 inline-block">
        <p class="text-xs text-slate-400 mb-0.5">Reference Number</p>
        <p class="font-mono font-bold text-lg text-slate-800">{ref}</p>
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
