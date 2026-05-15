import { Hono } from 'hono'
import { PublicLayout } from '../layouts/PublicLayout'
import { LandingLayout } from '../layouts/LandingLayout'
import { Icon, ICONS } from '../lib/Icon'
import { Button } from '../components/ui/button'
import { BookingWizard } from '../components/portal/BookingWizard'
import { MyBookingsList } from '../components/portal/MyBookingsList'
import { Input } from '../components/ui/input'
import { getBookings, findBooking, createBooking } from '../lib/db/bookings'
import { getSlotsByDate } from '../lib/db/slots'
import { getTenant } from '../lib/db/tenants'
import { lookupShipment, lookupShipmentByContainer } from '../lib/db/cfs-shipments'
import { calculateCharges } from '../lib/charges'
import { generateQRDataURL } from '../lib/qr'
import { DEFAULT_TENANT_ID } from '../lib/supabase'

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
  let bookings = ref ? [] : (await getBookings().catch(() => []))
  let heading  = 'My Bookings'

  if (ref) {
    const found = await findBooking(ref).catch(() => null)
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

// ─── Shipment lookup API (called by Alpine wizard) ────────────────────────────
portalRoutes.post('/api/shipments/lookup', async (c) => {
  try {
    const body = await c.req.json<{ hbl?: string; container?: string; serviceType?: string; loadType?: string; slotDate?: string }>()
    const tenant = await getTenant(DEFAULT_TENANT_ID)
    if (!tenant) return c.json({ found: false, slotFee: 5 })

    // Look up shipment
    let shipment = body.hbl?.trim()
      ? await lookupShipment(DEFAULT_TENANT_ID, body.hbl.trim())
      : undefined
    if (!shipment && body.container?.trim()) {
      shipment = await lookupShipmentByContainer(DEFAULT_TENANT_ID, body.container.trim())
    }

    const slotDate = body.slotDate || new Date().toISOString().split('T')[0]
    const charges = calculateCharges({
      serviceType:      (body.serviceType as 'pickup' | 'dropoff') || 'pickup',
      loadType:         (body.loadType as 'fcl' | 'lcl') || 'lcl',
      weightKg:         shipment?.weightKg,
      volumeCbm:        shipment?.volumeCbm,
      palletCount:      shipment?.palletCount,
      palletType:       shipment?.palletType,
      storageStartDate: shipment?.storageStartDate,
      slotDate,
      tenant,
    })

    return c.json({
      found:              !!shipment,
      hbl:                shipment?.hbl,
      containerNumber:    shipment?.containerNumber,
      weightKg:           shipment?.weightKg,
      volumeCbm:          shipment?.volumeCbm,
      packageCount:       shipment?.packageCount,
      palletCount:        shipment?.palletCount,
      palletType:         shipment?.palletType,
      storageStartDate:   shipment?.storageStartDate,
      readyForCollection: shipment?.readyForCollection,
      icsStatus:          'unavailable', // real ICS API pending OQ-01
      ...charges,
    })
  } catch (err) {
    console.error('[portal] shipment lookup error:', err)
    return c.json({ found: false, slotFee: 5, subtotal: 5, gstAmount: 0.5, totalAmount: 5.5 })
  }
})

// ─── Tenant public config API ─────────────────────────────────────────────────
portalRoutes.get('/api/tenants/config', async (c) => {
  const tenant = await getTenant(DEFAULT_TENANT_ID).catch(() => null)
  if (!tenant) return c.json({ error: 'not found' }, 404)
  return c.json({
    name:                    tenant.name,
    primaryColor:            tenant.primary_color,
    slotDurationMin:         tenant.slot_duration_min,
    advanceBookingDays:      tenant.advance_booking_days,
    currency:                tenant.currency,
    gstEnabled:              tenant.gst_enabled,
    gstRate:                 tenant.gst_rate,
    eftBankName:             tenant.eft_bank_name,
    eftBsb:                  tenant.eft_bsb,
    eftAccountNumber:        tenant.eft_account_number,
    eftAccountName:          tenant.eft_account_name,
    slotFeePickup:           tenant.slot_fee_pickup,
    slotFeeDropoff:          tenant.slot_fee_dropoff,
    requirePaymentToConfirm: tenant.require_payment_to_confirm,
  })
})

// ─── Slots API for wizard Step 4 ─────────────────────────────────────────────
portalRoutes.get('/api/slots', async (c) => {
  const date = c.req.query('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return c.json({ slots: [] })
  try {
    const slots = await getSlotsByDate(date)
    // If DB has no slots for this date, generate defaults from 06:00–18:00
    if (slots.length === 0) {
      const defaults = []
      const tenant = await getTenant(DEFAULT_TENANT_ID)
      const capacity = tenant?.max_bookings_per_slot ?? 10
      for (let h = 6; h < 18; h++) {
        const start = `${String(h).padStart(2, '0')}:00`
        const end   = `${String(h + 1).padStart(2, '0')}:00`
        defaults.push({ id: `gen-${date}-${h}`, startTime: start, endTime: end, capacity, confirmed: 0, held: 0, busyness: 'available' })
      }
      return c.json({ slots: defaults })
    }
    return c.json({ slots: slots.map(s => ({ id: s.id, startTime: s.startTime, endTime: s.endTime, capacity: s.capacity, confirmed: s.confirmed, held: s.held, busyness: s.busyness })) })
  } catch {
    return c.json({ slots: [] })
  }
})

// ─── Create booking (POST from wizard) ───────────────────────────────────────
portalRoutes.post('/bookings', async (c) => {
  const body = await c.req.parseBody()

  try {
    const booking = await createBooking({
      serviceType:      (body.serviceType as any) || 'pickup',
      loadType:         (body.loadType as any) || 'lcl',
      slotDate:         body.slotDate as string,
      slotStartTime:    body.slotStartTime as string,
      slotEndTime:      body.slotEndTime as string,
      driverName:       (body.driverName as string) || 'Guest',
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
      storageStartDate: body.storageStartDate as string | undefined,
      storageDays:      body.storageDays ? Number(body.storageDays) : undefined,
      storageCharge:    body.storageCharge ? Number(body.storageCharge) : undefined,
      shrinkWrapCharge: body.shrinkWrapCharge ? Number(body.shrinkWrapCharge) : undefined,
      slotFee:          body.slotFee ? Number(body.slotFee) : undefined,
      subtotal:         body.subtotal ? Number(body.subtotal) : undefined,
      gstAmount:        body.gstAmount ? Number(body.gstAmount) : undefined,
      totalAmount:      body.totalAmount ? Number(body.totalAmount) : undefined,
      paymentMethod:    (body.paymentMethod as any) || 'card',
      paymentStatus:    (body.paymentStatus as any) || 'pending',
      tenantId:         DEFAULT_TENANT_ID,
    })
    return c.redirect(`/booking-confirmed/${booking.referenceNumber}`)
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

// ─── Booking confirmed page (with QR) ────────────────────────────────────────
portalRoutes.get('/booking-confirmed/:ref', async (c) => {
  const ref     = c.req.param('ref').toUpperCase()
  const booking = await findBooking(ref).catch(() => null)
  if (!booking) return c.redirect('/bookings')

  const qrDataUrl = await generateQRDataURL(ref, 220).catch(() => '')
  const isEft     = booking.paymentMethod === 'eft'
  const tenant    = await getTenant(DEFAULT_TENANT_ID).catch(() => null)

  return c.html(
    <PublicLayout title="Booking Confirmed">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Success banner */}
        <div
          class="flex items-center gap-3 rounded-xl px-5 py-4 mb-8"
          style="background:#F0FDF4; border:1px solid #BBF7D0;"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style="background:#22C55E; color:#FFFFFF;"
          >
            <Icon name={ICONS.check} size={20} />
          </div>
          <div>
            <p class="font-semibold text-sm" style="color:#15803D;">Booking Confirmed!</p>
            <p class="text-xs font-mono font-bold mt-0.5" style="color:#166534;">{ref}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          {/* QR Code */}
          <div
            class="flex flex-col items-center justify-center p-8 rounded-2xl"
            style="background:#EAE6DE; border:1px solid rgba(214,211,209,0.5); box-shadow:rgba(0,0,0,0.05) 0px 1px 2px 0px;"
          >
            <img src={qrDataUrl} alt={`QR code for ${ref}`} width={220} height={220} style="border-radius:8px;" />
            <p class="text-xs font-medium mt-4" style="color:#78716C;">Scan at the kiosk to check in</p>
            <p class="text-xs font-mono font-bold mt-1" style="color:#44403C;">{ref}</p>
          </div>

          {/* Booking summary */}
          <div class="space-y-4">
            <div
              class="rounded-xl p-4"
              style="background:#F5F3EC; border:1px solid rgba(231,229,228,0.5);"
            >
              <p class="text-xs font-semibold uppercase tracking-wide mb-3" style="color:#A8A29E;">Booking Details</p>
              <div class="space-y-2 text-xs">
                {[
                  { label: 'Driver', value: booking.driverName },
                  { label: 'Service', value: booking.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off' },
                  { label: 'Load type', value: booking.loadType.toUpperCase() },
                  { label: 'Date', value: booking.slotDate },
                  { label: 'Time', value: `${booking.slotStartTime} – ${booking.slotEndTime}` },
                  ...(booking.houseBillNumber ? [{ label: 'HBL', value: booking.houseBillNumber }] : []),
                  ...(booking.containerNumber ? [{ label: 'Container', value: booking.containerNumber }] : []),
                ].map((row) => (
                  <div key={row.label} class="flex justify-between">
                    <span style="color:#A8A29E;">{row.label}</span>
                    <span class="font-medium" style="color:#44403C;">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charges */}
            {booking.totalAmount && (
              <div
                class="rounded-xl p-4"
                style="background:#EAE6DE; border:1px solid rgba(214,211,209,0.5); border-radius:8px 8px 8px 2px;"
              >
                <p class="text-xs font-semibold uppercase tracking-wide mb-3" style="color:#A8A29E;">Charges</p>
                <div class="space-y-1.5 text-xs">
                  {(booking.storageCharge ?? 0) > 0 && (
                    <div class="flex justify-between" style="color:#78716C;"><span>Storage</span><span>${booking.storageCharge!.toFixed(2)}</span></div>
                  )}
                  {(booking.shrinkWrapCharge ?? 0) > 0 && (
                    <div class="flex justify-between" style="color:#78716C;"><span>Shrink wrap</span><span>${booking.shrinkWrapCharge!.toFixed(2)}</span></div>
                  )}
                  {(booking.slotFee ?? 0) > 0 && (
                    <div class="flex justify-between" style="color:#78716C;"><span>Slot fee</span><span>${booking.slotFee!.toFixed(2)}</span></div>
                  )}
                  {(booking.gstAmount ?? 0) > 0 && (
                    <div class="flex justify-between pt-1 border-t text-xs" style="color:#A8A29E; border-color:#D6D3D1;"><span>GST (10%)</span><span>${booking.gstAmount!.toFixed(2)}</span></div>
                  )}
                  <div class="flex justify-between font-bold pt-1 border-t" style="color:#44403C; border-color:#D6D3D1;">
                    <span>Total</span>
                    <span style="color:#F59E0B;">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between text-xs" style="color:#A8A29E;">
                    <span>{booking.paymentMethod?.toUpperCase()}</span>
                    <span style={booking.paymentStatus === 'paid' ? 'color:#16A34A;' : 'color:#D97706;'}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'pending_eft' ? 'EFT Pending' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* EFT bank details */}
            {isEft && tenant && (
              <div
                class="rounded-xl p-4"
                style="background:#FEF3C7; border:1px solid #FDE68A;"
              >
                <p class="text-xs font-semibold mb-2" style="color:#92400E;">Transfer details</p>
                <div class="space-y-1 text-xs" style="color:#78350F;">
                  <div class="flex justify-between"><span>Bank</span><span class="font-medium">{tenant.eft_bank_name || '—'}</span></div>
                  <div class="flex justify-between"><span>BSB</span><span class="font-mono font-medium">{tenant.eft_bsb || '—'}</span></div>
                  <div class="flex justify-between"><span>Account No.</span><span class="font-mono font-medium">{tenant.eft_account_number || '—'}</span></div>
                  <div class="flex justify-between"><span>Account Name</span><span class="font-medium">{tenant.eft_account_name || '—'}</span></div>
                  <div class="flex justify-between"><span>Reference</span><span class="font-mono font-bold">{ref}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHEP warning */}
        {booking.palletType === 'chep' && (
          <div
            class="flex items-start gap-3 rounded-xl px-4 py-3 mt-6"
            style="background:#FEF3C7; border:1px solid #FDE68A;"
          >
            <Icon name={ICONS.warning} size={16} style="color:#D97706; flex-shrink:0; margin-top:2px;" />
            <p class="text-xs font-medium" style="color:#92400E;">
              Remember: Bring {booking.palletCount} empty CHEP pallet{(booking.palletCount ?? 1) > 1 ? 's' : ''} to exchange at collection.
            </p>
          </div>
        )}

        {/* Actions */}
        <div class="flex flex-wrap gap-3 mt-8 justify-center">
          <a
            href="/book"
            class="inline-flex items-center gap-2 text-xs font-medium px-5 py-2.5 rounded-full"
            style="background:#F59E0B; color:#FFFFFF;"
          >
            <Icon name={ICONS.add} size={14} />
            Book Another Visit
          </a>
          <a
            href={`/bookings?ref=${ref}`}
            class="inline-flex items-center gap-2 text-xs font-medium px-5 py-2.5 rounded-full"
            style="color:#44403C; border:1px solid #D6D3D1; background:transparent;"
          >
            <Icon name={ICONS.search} size={14} />
            View My Bookings
          </a>
        </div>

      </div>
    </PublicLayout>
  )
})
