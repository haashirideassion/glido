import { Hono } from 'hono'
import { PublicLayout } from '../layouts/PublicLayout'
import { LandingLayout } from '../layouts/LandingLayout'
import { Icon, ICONS } from '../lib/Icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookingWizard } from '../components/portal/BookingWizard'
import { MyBookingsList } from '../components/portal/MyBookingsList'
import { Input } from '@/components/ui/input'
import { mockBookings, findBooking } from '../data/bookings'

export const portalRoutes = new Hono()

// ─── Landing page ──────────────────────────────────────────────────────────
portalRoutes.get('/', (c) => {
  return c.html(
    <LandingLayout title="Home">

      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      <section class="pt-32 pb-24" style="background-color: #f7f6f4;">
        <div class="max-w-2xl mx-auto px-6 text-center">

          {/* Status badge */}
          <div class="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 bg-stone-100 border border-stone-200 rounded-full px-3 py-1 mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
            Open today · Mon–Fri 06:00–18:00
          </div>

          {/* Main heading */}
          <h1 class="landing-serif text-5xl font-medium text-balance leading-tight mb-6" style="color: #2c2520; font-size: clamp(2.5rem, 6vw, 3.75rem);">
            Book your visit to the Container Freight Station
          </h1>

          {/* Subtext */}
          <p class="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style="color: #6b5e52;">
            Skip the queue. Select your slot online, arrive on time, and check in at the kiosk — all without a phone call.
          </p>

          {/* CTAs */}
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/book"
              class="inline-flex items-center justify-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors shadow-sm"
              style="background-color: #2c2520;"
              onmouseover="this.style.backgroundColor='#4a433a'"
              onmouseout="this.style.backgroundColor='#2c2520'"
            >
              <Icon name={ICONS.calendar} size={16} />
              Book a Visit
            </a>
            <a
              href="/bookings"
              class="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3 rounded-full border border-stone-300 hover:bg-stone-100 transition-colors"
              style="color: #4a433a;"
            >
              <Icon name={ICONS.search} size={16} />
              Look Up Booking
            </a>
          </div>

          {/* Micro-note */}
          <p class="text-xs text-stone-400 mt-5">No account required · 3 minutes to complete</p>

        </div>
      </section>

      {/* ── Section 2: Stats strip ───────────────────────────────────────── */}
      <section class="py-16 border-y border-stone-200 bg-white">
        <div class="max-w-4xl mx-auto px-6">
          <div class="flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-stone-200">
            {[
              { stat: '450+',  label: 'movements per week' },
              { stat: '4 min', label: 'avg. gate time' },
              { stat: '96%',   label: 'slot utilisation' },
              { stat: 'Zero',  label: 'phone calls taken' },
            ].map((s) => (
              <div class="flex-1 text-center px-8 py-4">
                <p class="landing-serif text-3xl font-medium" style="color: #2c2520;">{s.stat}</p>
                <p class="text-sm text-stone-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: How it works ──────────────────────────────────────── */}
      <section id="how-it-works" class="py-24" style="background-color: #f7f6f4;">
        <div class="max-w-3xl mx-auto px-6">

          {/* Eyebrow */}
          <p class="text-xs font-medium tracking-widest uppercase text-stone-400 mb-4">HOW IT WORKS</p>

          {/* Heading */}
          <h2 class="landing-serif text-4xl font-medium text-balance mb-4" style="color: #2c2520;">
            Four steps from browser to bay door
          </h2>

          {/* Subtext */}
          <p class="text-stone-500 text-base leading-relaxed mb-12 max-w-xl">
            No spreadsheets, no radio calls. The whole process is handled online.
          </p>

          {/* Step cards */}
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
              <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm" style="box-shadow: 0 1px 3px 0 rgb(28 20 12 / 0.05);">
                <p class="text-xs font-bold text-stone-400 tracking-widest mb-3">{step.num}</p>
                <div class="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-3 text-stone-600">
                  <Icon name={step.icon} size={20} />
                </div>
                <p class="font-medium text-base mb-1.5" style="color: #2c2520;">{step.title}</p>
                <p class="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 4: Why Glido ─────────────────────────────────────────── */}
      <section class="py-24 bg-white border-t border-stone-200">
        <div class="max-w-3xl mx-auto px-6">

          {/* Eyebrow */}
          <p class="text-xs font-medium tracking-widest uppercase text-stone-400 mb-4">WHY GLIDO</p>

          {/* Heading */}
          <h2 class="landing-serif text-4xl font-medium text-balance mb-4" style="color: #2c2520;">
            Built for the depot floor, not a boardroom
          </h2>

          {/* Subtext */}
          <p class="text-stone-500 text-base leading-relaxed max-w-xl">
            Purpose-built for Container Freight Stations. Every feature exists because it solves a real operational problem.
          </p>

          {/* Feature tiles */}
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
              <div class="rounded-2xl border border-stone-200 p-6" style="background-color: #faf9f7;">
                <div class="w-9 h-9 rounded-lg bg-stone-200 flex items-center justify-center mb-4 text-stone-700">
                  <Icon name={feat.icon} size={18} />
                </div>
                <p class="font-medium text-sm mb-1.5" style="color: #2c2520;">{feat.title}</p>
                <p class="text-stone-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 5: Final CTA ─────────────────────────────────────────── */}
      <section class="py-32 text-white" style="background-color: #2c2520;">
        <div class="max-w-xl mx-auto px-6 text-center">

          <h2 class="landing-serif text-4xl font-medium text-balance mb-5 text-white" style="font-size: clamp(2rem, 5vw, 3rem);">
            Ready to skip the queue?
          </h2>

          <p class="text-stone-400 text-base leading-relaxed mb-8">
            Your first booking takes under 3 minutes. No account required.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/book"
              class="inline-flex items-center justify-center gap-2 bg-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-stone-100 transition-colors shadow-sm"
              style="color: #2c2520;"
            >
              Book a Visit
              <Icon name={ICONS.arrowRight} size={16} />
            </a>
            <a
              href="/bookings"
              class="inline-flex items-center justify-center gap-2 text-stone-400 text-sm px-7 py-3.5 rounded-full border border-stone-700 hover:border-stone-500 hover:text-stone-300 transition-colors"
            >
              Look Up Booking
            </a>
          </div>

          <p class="text-xs text-stone-600 mt-6">
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
portalRoutes.get('/bookings', (c) => {
  const ref = c.req.query('ref')?.trim().toUpperCase()
  let bookings = mockBookings
  let heading = 'My Bookings'

  if (ref) {
    const found = findBooking(ref)
    bookings = found ? [found] : []
    heading = `Results for "${ref}"`
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
