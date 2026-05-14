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

// ─── Landing page ─────────────────────────────────────────────────────────────
portalRoutes.get('/', (c) => {
  return c.html(
    <LandingLayout title="Home">

      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      <section style="background:#FCFBF8; padding-top:8rem; padding-bottom:6rem;">
        <div class="max-w-2xl mx-auto px-6 text-center">

          {/* Status badge */}
          <div
            class="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 mb-8"
            style="color:#78716C; background:#F5F3EC; border:1px solid #D6D3D1;"
          >
            <span class="w-1.5 h-1.5 rounded-full inline-block" style="background:#16A34A;"></span>
            Open today · Mon–Fri 06:00–18:00
          </div>

          {/* Main heading */}
          <h1
            class="text-balance leading-tight mb-6 tracking-tight"
            style="font-size: clamp(2.25rem, 5vw, 3rem); font-weight:500; color:#44403C; letter-spacing:-0.025em; line-height:1.1;"
          >
            Book your visit to the Container Freight Station
          </h1>

          {/* Subtext */}
          <p class="leading-relaxed mb-10 max-w-xl mx-auto" style="font-size:14px; color:#A8A29E;">
            Skip the queue. Select your slot online, arrive on time, and check in at the kiosk — all without a phone call.
          </p>

          {/* CTAs */}
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/book"
              class="inline-flex items-center justify-center gap-2 text-xs font-medium px-6 py-3 rounded-full transition-colors"
              style="background:#F59E0B; color:#FFFFFF;"
              onmouseover="this.style.background='#D97706';"
              onmouseout="this.style.background='#F59E0B';"
            >
              <Icon name={ICONS.calendar} size={14} />
              Book a Visit
            </a>
            <a
              href="/bookings"
              class="inline-flex items-center justify-center gap-2 text-xs font-medium px-6 py-3 rounded-full transition-colors"
              style="color:#44403C; border:1px solid #D6D3D1; background:transparent;"
              onmouseover="this.style.background='#F5F3EC';"
              onmouseout="this.style.background='transparent';"
            >
              <Icon name={ICONS.search} size={14} />
              Look Up Booking
            </a>
          </div>

          <p class="text-xs mt-5" style="color:#A8A29E;">No account required · 3 minutes to complete</p>

        </div>
      </section>

      {/* ── Section 2: Stats strip ──────────────────────────────────────────── */}
      <section style="padding:4rem 0; border-top:1px solid #D6D3D1; border-bottom:1px solid #D6D3D1; background:#F5F3EC;">
        <div class="max-w-4xl mx-auto px-6">
          <div class="flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-x-0 sm:divide-x" style="--tw-divide-opacity:1; border-color:#D6D3D1;">
            {[
              { stat: '450+',  label: 'movements per week' },
              { stat: '4 min', label: 'avg. gate time' },
              { stat: '96%',   label: 'slot utilisation' },
              { stat: 'Zero',  label: 'phone calls taken' },
            ].map((s) => (
              <div class="flex-1 text-center px-8 py-4">
                <p class="font-medium tracking-tight" style="font-size:28px; color:#44403C;">{s.stat}</p>
                <p class="text-xs mt-1" style="color:#A8A29E;">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" style="padding:6rem 0; background:#FCFBF8;">
        <div class="max-w-3xl mx-auto px-6">

          <p class="text-xs font-medium tracking-widest uppercase mb-4" style="color:#A8A29E; letter-spacing:0.1em;">HOW IT WORKS</p>
          <h2 class="text-balance mb-4 tracking-tight" style="font-size:clamp(1.75rem,4vw,2.5rem); font-weight:500; color:#44403C;">
            Four steps from browser to bay door
          </h2>
          <p class="leading-relaxed mb-12 max-w-xl" style="font-size:13px; color:#A8A29E;">
            No spreadsheets, no radio calls. The whole process is handled online.
          </p>

          <div class="grid sm:grid-cols-2 gap-4">
            {[
              { num: '01', icon: ICONS.users,    title: 'Enter your details',       desc: 'Your name, service type (Pick Up or Drop Off), and cargo type.' },
              { num: '02', icon: ICONS.calendar,  title: 'Choose a time slot',       desc: 'Browse available windows — your slot is held for 10 minutes while you complete the booking.' },
              { num: '03', icon: ICONS.document,  title: 'Submit shipment details',  desc: 'Enter your HBL or container number. ICS status is fetched automatically.' },
              { num: '04', icon: ICONS.kiosk,     title: 'Arrive and check in',      desc: 'Scan your QR code at the kiosk. No waiting at the reception counter.' },
            ].map((step) => (
              <div style="background:#EAE6DE; border:1px solid rgba(214,211,209,0.5); border-radius:8px 8px 8px 2px; padding:20px; box-shadow:rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0.05) 0px 1px 2px 0px;">
                <p class="text-xs font-bold tracking-widest mb-3" style="color:#A8A29E;">{step.num}</p>
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style="background:#FEF3C7; color:#F59E0B;"
                >
                  <Icon name={step.icon} size={18} />
                </div>
                <p class="font-medium mb-1.5" style="font-size:13px; color:#44403C;">{step.title}</p>
                <p class="leading-relaxed" style="font-size:12px; color:#78716C;">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 4: Why Glido ────────────────────────────────────────────── */}
      <section style="padding:6rem 0; background:#F5F3EC; border-top:1px solid #D6D3D1;">
        <div class="max-w-3xl mx-auto px-6">

          <p class="text-xs font-medium tracking-widest uppercase mb-4" style="color:#A8A29E; letter-spacing:0.1em;">WHY GLIDO</p>
          <h2 class="text-balance mb-4 tracking-tight" style="font-size:clamp(1.75rem,4vw,2.5rem); font-weight:500; color:#44403C;">
            Built for the depot floor, not a boardroom
          </h2>
          <p class="leading-relaxed max-w-xl" style="font-size:13px; color:#A8A29E;">
            Purpose-built for Container Freight Stations. Every feature exists because it solves a real operational problem.
          </p>

          <div class="grid sm:grid-cols-2 gap-3 mt-12">
            {[
              { icon: ICONS.shield,  title: 'Automatic ICS clearance',    desc: 'Customs status is pulled automatically when you enter your shipment number.' },
              { icon: ICONS.warning, title: 'CHEP pallet alerts',          desc: 'The system flags any CHEP pallet exchange requirements before you arrive.' },
              { icon: ICONS.clock,   title: '10-minute slot holds',        desc: 'Your preferred time is held while you complete the booking — no double-booking.' },
              { icon: ICONS.qrCode,  title: 'QR check-in at the kiosk',   desc: 'Scan your confirmation QR code at the kiosk — no paper, no counter queue.' },
              { icon: ICONS.users,   title: 'Guest booking supported',     desc: 'Agents and freight forwarders can book on behalf of drivers without an account.' },
              { icon: ICONS.reports, title: 'Reception dashboard',         desc: 'Depot staff see live bookings, walk-ins, and ICS holds in a single dashboard.' },
            ].map((feat) => (
              <div style="background:#F5F3EC; border:1px solid rgba(231,229,228,0.5); border-radius:12px; padding:24px; box-shadow:rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0.05) 0px 1px 2px 0px;">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style="background:#FEF3C7; color:#F59E0B;"
                >
                  <Icon name={feat.icon} size={16} />
                </div>
                <p class="font-medium mb-1.5" style="font-size:12px; color:#44403C;">{feat.title}</p>
                <p class="leading-relaxed" style="font-size:12px; color:#78716C;">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 5: Final CTA ────────────────────────────────────────────── */}
      <section style="padding:8rem 0; background:#1C1917; color:#FCFBF8;">
        <div class="max-w-xl mx-auto px-6 text-center">

          <h2
            class="text-balance mb-5 tracking-tight"
            style="font-size:clamp(1.75rem,4vw,2.75rem); font-weight:500; color:#FCFBF8;"
          >
            Ready to skip the queue?
          </h2>
          <p class="leading-relaxed mb-8" style="font-size:13px; color:#78716C;">
            Your first booking takes under 3 minutes. No account required.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/book"
              class="inline-flex items-center justify-center gap-2 text-xs font-semibold px-7 py-3.5 rounded-full transition-colors"
              style="background:#F59E0B; color:#1C1917;"
              onmouseover="this.style.background='#D97706';"
              onmouseout="this.style.background='#F59E0B';"
            >
              Book a Visit
              <Icon name={ICONS.arrowRight} size={14} />
            </a>
            <a
              href="/bookings"
              class="inline-flex items-center justify-center gap-2 text-xs px-7 py-3.5 rounded-full transition-colors"
              style="color:#A8A29E; border:1px solid #44403C;"
              onmouseover="this.style.borderColor='#78716C'; this.style.color='#D6D3D1';"
              onmouseout="this.style.borderColor='#44403C'; this.style.color='#A8A29E';"
            >
              Look Up Booking
            </a>
          </div>

          <p class="text-xs mt-6" style="color:#44403C;">
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
      <div class="min-h-[calc(100vh-8rem)] py-10" style="background:#F5F3EC;">
        <div class="max-w-2xl mx-auto px-4 sm:px-6">
          <div class="mb-8 text-center">
            <h1 class="font-medium tracking-tight mb-1" style="font-size:24px; color:#44403C;">Book a Depot Visit</h1>
            <p class="text-xs" style="color:#A8A29E;">Sydney Container Freight Station · Mon–Fri 06:00–18:00</p>
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
        <h1 class="font-medium tracking-tight mb-1" style="font-size:22px; color:#44403C;">My Bookings</h1>
        <p class="text-xs mb-6" style="color:#A8A29E;">Track the status of your depot slot bookings.</p>

        <form method="get" action="/bookings" class="flex gap-2 mb-8">
          <Input
            type="text"
            name="ref"
            value={ref || ''}
            placeholder="Enter booking reference (e.g. GLD-2026-10142)"
            class="flex-1"
          />
          <Button type="submit">Search</Button>
          {ref && (
            <a href="/bookings">
              <Button variant="outline" type="button">Clear</Button>
            </a>
          )}
        </form>

        {ref && <p class="text-xs mb-4 font-medium" style="color:#44403C;">{heading}</p>}

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
          <p class="text-xs font-medium mb-4" style="color:#DC2626;">Something went wrong creating your booking.</p>
          <a href="/book" class="text-xs underline" style="color:#F59E0B;">Try again</a>
        </div>
      </PublicLayout>
    )
  }
})
