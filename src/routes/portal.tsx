import { Hono } from 'hono'
import { PublicLayout } from '../layouts/PublicLayout'
import { LandingLayout } from '../layouts/LandingLayout'
import { Icon, ICONS } from '../lib/Icon'
import { Button } from '@/components/ui/button'
import { BookingWizard } from '../components/portal/BookingWizard'
import { MyBookingsList } from '../components/portal/MyBookingsList'
import { Input } from '@/components/ui/input'
import { getBookings, findBooking } from '../lib/db/bookings'

export const portalRoutes = new Hono()

// ─── Landing page ──────────────────────────────────────────────────────────
portalRoutes.get('/', (c) => {
  return c.html(
    <LandingLayout title="Home">

      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section class="pt-32 pb-24 bg-white">
        <div class="max-w-2xl mx-auto px-6 text-center">

          {/* Status badge */}
          <div class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
            Open today · Mon–Fri 06:00–18:00
          </div>

          {/* Main heading */}
          <h1 class="text-5xl font-semibold text-slate-900 text-balance leading-tight mb-6 tracking-tight" style="font-size: clamp(2.25rem, 5vw, 3.25rem);">
            Book your visit to the Container Freight Station
          </h1>

          {/* Subtext */}
          <p class="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto">
            Skip the queue. Select your slot online, arrive on time, and check in at the kiosk — all without a phone call.
          </p>

          {/* CTAs */}
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/book"
              class="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-6 py-3 rounded-full hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Icon name={ICONS.calendar} size={16} />
              Book a Visit
            </a>
            <a
              href="/bookings"
              class="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-700 px-6 py-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Icon name={ICONS.search} size={16} />
              Look Up Booking
            </a>
          </div>

          {/* Micro-note */}
          <p class="text-xs text-slate-400 mt-5">No account required · 3 minutes to complete</p>

        </div>
      </section>

      {/* ── Section 2: Stats strip ───────────────────────────────────────── */}
      <section class="py-16 border-y border-slate-200 bg-slate-50">
        <div class="max-w-4xl mx-auto px-6">
          <div class="flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-slate-200">
            {[
              { stat: '450+',  label: 'movements per week' },
              { stat: '4 min', label: 'avg. gate time' },
              { stat: '96%',   label: 'slot utilisation' },
              { stat: 'Zero',  label: 'phone calls taken' },
            ].map((s) => (
              <div class="flex-1 text-center px-8 py-4">
                <p class="text-3xl font-semibold text-slate-900 tracking-tight">{s.stat}</p>
                <p class="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: How it works ──────────────────────────────────────── */}
      <section id="how-it-works" class="py-24 bg-white">
        <div class="max-w-3xl mx-auto px-6">

          <p class="text-xs font-medium tracking-widest uppercase text-slate-400 mb-4">HOW IT WORKS</p>
          <h2 class="text-4xl font-semibold text-slate-900 text-balance mb-4 tracking-tight">
            Four steps from browser to bay door
          </h2>
          <p class="text-slate-500 text-base leading-relaxed mb-12 max-w-xl">
            No spreadsheets, no radio calls. The whole process is handled online.
          </p>

          <div class="grid sm:grid-cols-2 gap-4">
            {[
              {
                num: '01',
                icon: ICONS.users,
                title: 'Enter your details',
                desc: 'Your name, service type (Pick Up or Drop Off), and cargo type.',
              },
              {
                num: '02',
                icon: ICONS.calendar,
                title: 'Choose a time slot',
                desc: 'Browse available windows — your slot is held for 10 minutes while you complete the booking.',
              },
              {
                num: '03',
                icon: ICONS.document,
                title: 'Submit shipment details',
                desc: 'Enter your HBL or container number. ICS status is fetched automatically.',
              },
              {
                num: '04',
                icon: ICONS.kiosk,
                title: 'Arrive and check in',
                desc: 'Scan your QR code at the kiosk. No waiting at the reception counter.',
              },
            ].map((step) => (
              <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 tracking-widest mb-3">{step.num}</p>
                <div class="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center mb-3 text-primary">
                  <Icon name={step.icon} size={20} />
                </div>
                <p class="font-medium text-base text-slate-900 mb-1.5">{step.title}</p>
                <p class="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 4: Why Glido ─────────────────────────────────────────── */}
      <section class="py-24 bg-slate-50 border-t border-slate-200">
        <div class="max-w-3xl mx-auto px-6">

          <p class="text-xs font-medium tracking-widest uppercase text-slate-400 mb-4">WHY GLIDO</p>
          <h2 class="text-4xl font-semibold text-slate-900 text-balance mb-4 tracking-tight">
            Built for the depot floor, not a boardroom
          </h2>
          <p class="text-slate-500 text-base leading-relaxed max-w-xl">
            Purpose-built for Container Freight Stations. Every feature exists because it solves a real operational problem.
          </p>

          <div class="grid sm:grid-cols-2 gap-3 mt-12">
            {[
              {
                icon: ICONS.shield,
                title: 'Automatic ICS clearance',
                desc: 'Customs status is pulled automatically when you enter your shipment number.',
              },
              {
                icon: ICONS.warning,
                title: 'CHEP pallet alerts',
                desc: 'The system flags any CHEP pallet exchange requirements before you arrive.',
              },
              {
                icon: ICONS.clock,
                title: '10-minute slot holds',
                desc: 'Your preferred time is held while you complete the booking — no double-booking.',
              },
              {
                icon: ICONS.qrCode,
                title: 'QR check-in at the kiosk',
                desc: 'Scan your confirmation QR code at the kiosk — no paper, no counter queue.',
              },
              {
                icon: ICONS.users,
                title: 'Guest booking supported',
                desc: 'Agents and freight forwarders can book on behalf of drivers without an account.',
              },
              {
                icon: ICONS.reports,
                title: 'Reception dashboard',
                desc: 'Depot staff see live bookings, walk-ins, and ICS holds in a single dashboard.',
              },
            ].map((feat) => (
              <div class="rounded-2xl border border-slate-200 bg-white p-6">
                <div class="w-9 h-9 rounded-lg bg-primary-soft flex items-center justify-center mb-4 text-primary">
                  <Icon name={feat.icon} size={18} />
                </div>
                <p class="font-medium text-sm text-slate-900 mb-1.5">{feat.title}</p>
                <p class="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 5: Final CTA ─────────────────────────────────────────── */}
      <section class="py-32 bg-slate-900 text-white">
        <div class="max-w-xl mx-auto px-6 text-center">

          <h2 class="text-4xl font-semibold text-white text-balance mb-5 tracking-tight" style="font-size: clamp(2rem, 5vw, 3rem);">
            Ready to skip the queue?
          </h2>
          <p class="text-slate-400 text-base leading-relaxed mb-8">
            Your first booking takes under 3 minutes. No account required.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/book"
              class="inline-flex items-center justify-center gap-2 bg-white text-slate-900 text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-slate-100 transition-colors shadow-sm"
            >
              Book a Visit
              <Icon name={ICONS.arrowRight} size={16} />
            </a>
            <a
              href="/bookings"
              class="inline-flex items-center justify-center gap-2 text-slate-400 text-sm px-7 py-3.5 rounded-full border border-slate-700 hover:border-slate-500 hover:text-slate-300 transition-colors"
            >
              Look Up Booking
            </a>
          </div>

          <p class="text-xs text-slate-600 mt-6">
            CFS open Mon–Fri 06:00–18:00 · Sydney Container Freight Station
          </p>

        </div>
      </section>

    </LandingLayout>
  )
})

// ─── Booking wizard ─────────────────────────────────────────────────────────
portalRoutes.get('/book', (c) => {
  return c.html(
    <PublicLayout title="Book a Visit">
      <div class="min-h-[calc(100vh-8rem)] bg-slate-50 py-10">
        <div class="max-w-2xl mx-auto px-4 sm:px-6">
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-slate-900">Book a Depot Visit</h1>
            <p class="text-slate-500 mt-1 text-sm">Sydney Container Freight Station · Mon–Fri 06:00–18:00</p>
          </div>
          <BookingWizard />
        </div>
      </div>
    </PublicLayout>
  )
})

// ─── My Bookings ─────────────────────────────────────────────────────────────
portalRoutes.get('/bookings', async (c) => {
  const ref = c.req.query('ref')?.trim().toUpperCase()
  let bookings = await getBookings()
  let heading  = 'My Bookings'

  if (ref) {
    const found = await findBooking(ref)
    bookings = found ? [found] : []
    heading  = `Results for "${ref}"`
  }

  return c.html(
    <PublicLayout title="My Bookings">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
        <p class="text-slate-500 mb-6">Track the status of your depot slot bookings.</p>

        <form method="get" action="/bookings" class="flex gap-2 mb-8">
          <Input
            type="text"
            name="ref"
            value={ref || ''}
            placeholder="Enter booking reference (e.g. GLD-2026-10142)"
            class="flex-1"
          />
          <Button type="submit">
            Search
          </Button>
          {ref && (
            <a href="/bookings">
              <Button variant="outline" type="button">Clear</Button>
            </a>
          )}
        </form>

        {ref && <p class="text-sm text-slate-600 mb-4 font-medium">{heading}</p>}

        <MyBookingsList bookings={bookings} query={ref} />
      </div>
    </PublicLayout>
  )
})

// ─── Create booking (POST from wizard) ───────────────────────────────────────
portalRoutes.post('/bookings', async (c) => {
  const { createBooking } = await import('../lib/db/bookings')
  const body = await c.req.parseBody()

  try {
    const booking = await createBooking({
      serviceType:      (body.serviceType as any) || 'pickup',
      loadType:         (body.loadType as any) || 'lcl',
      slotDate:         body.slotDate as string,
      slotStartTime:    body.slotStartTime as string,
      slotEndTime:      body.slotEndTime as string,
      driverName:       body.driverName as string,
      driverPhone:      body.driverPhone as string | undefined,
      guestName:        body.guestName as string | undefined,
      guestPhone:       body.guestPhone as string | undefined,
      houseBillNumber:  body.houseBillNumber as string | undefined,
      containerNumber:  body.containerNumber as string | undefined,
      weightKg:         body.weightKg ? Number(body.weightKg) : undefined,
      volumeCbm:        body.volumeCbm ? Number(body.volumeCbm) : undefined,
      packageCount:     body.packageCount ? Number(body.packageCount) : undefined,
      palletCount:      body.palletCount ? Number(body.palletCount) : undefined,
      palletType:       (body.palletType as any) || undefined,
      paymentMethod:    (body.paymentMethod as any) || 'card',
      paymentStatus:    'pending',
      tenantId:         'tenant-abc-cfs',
    })
    return c.redirect(`/bookings?ref=${booking.referenceNumber}`)
  } catch (err) {
    console.error('[portal] createBooking error:', err)
    return c.html(
      <PublicLayout title="Booking Error">
        <div class="max-w-xl mx-auto px-4 py-16 text-center">
          <p class="text-red-500 font-medium mb-4">Something went wrong creating your booking.</p>
          <a href="/book" class="text-blue-600 underline text-sm">Try again</a>
        </div>
      </PublicLayout>
    )
  }
})
