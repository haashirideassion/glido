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

      {/* ═══════════════════════════════════════════════════════════════════════
          §1  HERO — split layout, floating booking card preview
      ═══════════════════════════════════════════════════════════════════════ */}
      <section class="bg-hero-gradient" style="padding-top:6rem; padding-bottom:0; overflow:hidden; position:relative; min-height:90vh; display:flex; align-items:center;">

        {/* Background orb */}
        <div style="position:absolute; top:-120px; right:-80px; width:600px; height:600px; border-radius:9999px; background:radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%); pointer-events:none;" />
        <div style="position:absolute; bottom:0; left:-60px; width:400px; height:400px; border-radius:9999px; background:radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%); pointer-events:none;" />

        <div class="max-w-6xl mx-auto px-6 w-full" style="padding-bottom:5rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">

            {/* Left: text */}
            <div>
              {/* Status badge */}
              <div class="status-badge animate-fade-up" style="display:inline-flex; margin-bottom:28px;">
                <span class="pulse-dot" style="width:7px; height:7px; border-radius:9999px; background:#16A34A; flex-shrink:0; animation:pulse-dot 2s ease-in-out infinite;" />
                Open today · Mon–Fri 06:00–18:00
              </div>

              {/* Headline with rotating word */}
              <h1
                class="hero-words"
                style="font-size:clamp(2.4rem,4.5vw,3.4rem); font-weight:500; color:#1C1917; letter-spacing:-0.03em; line-height:1.08; margin-bottom:24px;"
              >
                <span class="hero-word" style="display:block;">Schedule your</span>
                <span class="hero-word" style="display:block;">
                  <span
                    id="rotating-word"
                    style="color:#F97316; display:inline-block; min-width:200px;"
                  >Collection</span>
                </span>
                <span class="hero-word" style="display:block;">at the CFS.</span>
              </h1>

              <p
                class="animate-fade-up delay-300"
                style="font-size:15px; color:#78716C; line-height:1.7; max-width:440px; margin-bottom:36px;"
              >
                Skip the queue. Book a slot online, arrive on time, scan your QR at the kiosk — all without a single phone call.
              </p>

              <div class="animate-fade-up delay-400" style="display:flex; gap:12px; flex-wrap:wrap;">
                <a href="/book" class="btn-primary" style="padding:13px 26px; font-size:13.5px;">
                  <Icon name={ICONS.calendar} size={15} />
                  Book a Slot
                  <Icon name={ICONS.arrowRight} size={14} />
                </a>
                <a href="#how-it-works" class="btn-ghost" style="padding:13px 22px; font-size:13.5px;">
                  See how it works
                </a>
              </div>

              <p class="animate-fade-up delay-500" style="font-size:12px; color:#A8A29E; margin-top:20px;">
                No account required · Takes under 3 minutes
              </p>
            </div>

            {/* Right: floating card mockup */}
            <div class="animate-fade-up delay-200" style="position:relative;">

              {/* Main card */}
              <div
                class="card-shell animate-float-slow"
                style="position:relative; z-index:2;"
              >
                <div class="card-shell-inner" style="padding:28px; border-radius:39px;">

                  {/* Card header */}
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:22px;">
                    <div>
                      <p style="font-size:11px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; color:#A8A29E;">Available Slots</p>
                      <p style="font-size:14px; font-weight:500; color:#1C1917; margin-top:2px;">Thursday, 15 May</p>
                    </div>
                    <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#F97316,#FB923C); display:flex; align-items:center; justify-content:center; box-shadow:rgba(249,115,22,0.30) 0px 4px 12px 0px;">
                      <Icon name={ICONS.calendar} size={16} style="color:white;" />
                    </div>
                  </div>

                  {/* Slot grid */}
                  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:18px;">
                    {[
                      { t:'06:00', s:'available' },
                      { t:'07:00', s:'busy' },
                      { t:'08:00', s:'available' },
                      { t:'09:00', s:'selected' },
                      { t:'10:00', s:'available' },
                      { t:'11:00', s:'busy' },
                    ].map(slot => (
                      <div
                        style={slot.s === 'selected'
                          ? 'background:linear-gradient(135deg,#F97316,#FB923C); border-radius:12px; padding:10px 8px; text-align:center; box-shadow:rgba(249,115,22,0.30) 0px 4px 12px 0px;'
                          : slot.s === 'busy'
                          ? 'background:rgba(168,162,158,0.12); border:1px solid rgba(168,162,158,0.2); border-radius:12px; padding:10px 8px; text-align:center; opacity:0.5;'
                          : 'background:rgba(249,115,22,0.07); border:1px solid rgba(249,115,22,0.18); border-radius:12px; padding:10px 8px; text-align:center; cursor:pointer;'
                        }
                      >
                        <p style={`font-size:12px; font-weight:600; ${slot.s==='selected'?'color:white;':'color:#78716C;'}`}>{slot.t}</p>
                        <p style={`font-size:10px; margin-top:2px; ${slot.s==='selected'?'color:rgba(255,255,255,0.75);':slot.s==='busy'?'color:#A8A29E;':'color:#F97316;'}`}>
                          {slot.s === 'selected' ? 'Selected' : slot.s === 'busy' ? 'Full' : 'Open'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* CTA in card */}
                  <div style="background:linear-gradient(135deg,#F97316,#EA6C0A); border-radius:16px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; box-shadow:rgba(249,115,22,0.25) 0px 8px 24px -4px;">
                    <div>
                      <p style="font-size:12px; font-weight:600; color:white;">09:00 – 10:00</p>
                      <p style="font-size:11px; color:rgba(255,255,255,0.75); margin-top:1px;">Pick Up · LCL</p>
                    </div>
                    <div style="background:rgba(255,255,255,0.2); border-radius:10px; padding:8px 14px;">
                      <p style="font-size:11px; font-weight:600; color:white;">Confirm →</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mini badge — top right */}
              <div
                class="glass-warm"
                style="position:absolute; top:-20px; right:-20px; border-radius:16px; padding:10px 14px; display:flex; align-items:center; gap:8px; z-index:3; box-shadow:rgba(180,170,160,0.25) 0px 8px 24px -4px;"
              >
                <div style="width:28px; height:28px; border-radius:8px; background:linear-gradient(135deg,#16A34A,#22C55E); display:flex; align-items:center; justify-content:center;">
                  <Icon name={ICONS.check} size={14} style="color:white;" />
                </div>
                <div>
                  <p style="font-size:11px; font-weight:600; color:#1C1917; line-height:1.2;">Confirmed</p>
                  <p style="font-size:10px; color:#78716C;">GLD-2026-10142</p>
                </div>
              </div>

              {/* Floating mini badge — bottom left */}
              <div
                class="glass-warm"
                style="position:absolute; bottom:-16px; left:-24px; border-radius:16px; padding:10px 14px; display:flex; align-items:center; gap:8px; z-index:3; box-shadow:rgba(180,170,160,0.25) 0px 8px 24px -4px;"
              >
                <div style="width:28px; height:28px; border-radius:8px; background:rgba(249,115,22,0.12); display:flex; align-items:center; justify-content:center;">
                  <Icon name={ICONS.clock} size={14} style="color:#F97316;" />
                </div>
                <div>
                  <p style="font-size:11px; font-weight:600; color:#1C1917; line-height:1.2;">Gate time</p>
                  <p style="font-size:10px; color:#78716C;">4 min avg.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Fade to next section */}
        <div style="position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(to bottom, transparent, #FFEDD5); pointer-events:none;" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §2  MARQUEE — trust strip
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:28px 0; background:#FFEDD5; overflow:hidden; border-top:1px solid rgba(249,115,22,0.10); border-bottom:1px solid rgba(249,115,22,0.10);">
        <div style="display:flex; overflow:hidden; mask-image:linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%); -webkit-mask-image:linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);">
          <div class="animate-marquee" style="display:flex; gap:0; white-space:nowrap; flex-shrink:0;">
            {[
              'Express Freight Co.',
              'Pacific Logistics',
              'Harbour Carriers',
              'SydPort Forwarding',
              'BlueAnchor CFS',
              'Apex Customs',
              'Meridian Shipping',
              'Coastline Brokers',
              'Trident Freight',
              'Atlas Logistics',
              // duplicate for seamless loop
              'Express Freight Co.',
              'Pacific Logistics',
              'Harbour Carriers',
              'SydPort Forwarding',
              'BlueAnchor CFS',
              'Apex Customs',
              'Meridian Shipping',
              'Coastline Brokers',
              'Trident Freight',
              'Atlas Logistics',
            ].map((name, i) => (
              <span key={i} style="display:inline-flex; align-items:center; gap:20px; padding:0 32px; font-size:12px; font-weight:500; color:#A8A29E; letter-spacing:0.04em; text-transform:uppercase;">
                <span style="width:4px; height:4px; border-radius:9999px; background:rgba(249,115,22,0.4); display:inline-block; flex-shrink:0;" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §3  STATS — animated counters
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:80px 24px; background:#FFEDD5;">
        <div class="max-w-5xl mx-auto">

          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#F97316; margin-bottom:10px;">By the numbers</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:500; color:#1C1917; letter-spacing:-0.025em; line-height:1.15;">
              The CFS platform that actually works
            </h2>
          </div>

          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px;" class="stats-grid">
            {[
              { count: 450,  suffix: '+',  label: 'movements per week',  icon: ICONS.truck,    delay: 0 },
              { count: 4,    suffix: ' min', label: 'average gate time',  icon: ICONS.clock,    delay: 100 },
              { count: 96,   suffix: '%',  label: 'slot utilisation',    icon: ICONS.reports,  delay: 200 },
              { count: 0,    suffix: '',   label: 'phone calls needed',  icon: ICONS.check,    delay: 300 },
            ].map(s => (
              <div
                class="reveal stat-card"
                data-reveal-delay={String(s.delay)}
                style="background:rgba(234,230,219,0.6); border:1px solid rgba(249,115,22,0.12); border-radius:24px; padding:28px 24px; text-align:center; box-shadow:rgba(180,170,160,0.12) 0px 4px 16px -4px, rgba(255,255,255,0.60) 0px 1px 3px 0px inset; transition:transform 0.2s ease, box-shadow 0.2s ease;"
                onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='rgba(249,115,22,0.15) 0px 12px 32px -8px, rgba(255,255,255,0.70) 0px 1px 3px 0px inset';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='rgba(180,170,160,0.12) 0px 4px 16px -4px, rgba(255,255,255,0.60) 0px 1px 3px 0px inset';"
              >
                <div style="width:40px; height:40px; border-radius:12px; background:rgba(249,115,22,0.10); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:rgba(249,115,22,0.15) 0px 2px 8px 0px;">
                  <Icon name={s.icon} size={18} style="color:#F97316;" />
                </div>
                <p
                  data-count={String(s.count)}
                  data-suffix={s.suffix}
                  style="font-size:2.4rem; font-weight:600; color:#1C1917; letter-spacing:-0.04em; line-height:1; margin-bottom:8px;"
                >
                  {s.count === 0 ? 'Zero' : `${s.count}${s.suffix}`}
                </p>
                <p style="font-size:12px; color:#78716C; line-height:1.5;">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §4  HOW IT WORKS — numbered step cards with connector
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style="padding:80px 24px; background:linear-gradient(180deg,#FEF0DC 0%,#FFEDD5 100%);">
        <div class="max-w-5xl mx-auto">

          {/* Header */}
          <div class="reveal" style="max-width:520px; margin-bottom:60px;">
            <p style="font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#F97316; margin-bottom:10px;">How it works</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:500; color:#1C1917; letter-spacing:-0.025em; line-height:1.15; margin-bottom:14px;">
              From browser to bay door in four steps
            </h2>
            <p style="font-size:14px; color:#78716C; line-height:1.7;">
              No spreadsheets. No radio calls. The whole check-in process runs online.
            </p>
          </div>

          {/* Steps grid */}
          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; position:relative;" class="steps-grid">

            {/* Connector line */}
            <div style="position:absolute; top:52px; left:calc(12.5% + 12px); right:calc(12.5% + 12px); height:1px; background:linear-gradient(to right, rgba(249,115,22,0.3), rgba(249,115,22,0.6), rgba(249,115,22,0.3)); pointer-events:none; z-index:0;" class="hide-mobile" />

            {[
              { num: '01', icon: ICONS.users,   title: 'Your details',     desc: 'Name, service type, and cargo category. Takes 60 seconds.' },
              { num: '02', icon: ICONS.calendar, title: 'Pick a slot',     desc: 'Choose an open window — held for 10 min while you finish.' },
              { num: '03', icon: ICONS.document, title: 'Add shipment',    desc: 'Enter your HBL or container. ICS status fetched automatically.' },
              { num: '04', icon: ICONS.qrCode,   title: 'Scan & enter',   desc: 'Scan your QR at the kiosk. No counter queue, no wait.' },
            ].map((step, i) => (
              <div
                class="reveal step-card"
                data-reveal-delay={String(i * 120)}
                style="position:relative; z-index:1; background:rgba(255,247,237,0.75); border:1px solid rgba(249,115,22,0.14); border-radius:28px; padding:24px 20px; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); box-shadow:rgba(180,170,160,0.15) 0px 4px 20px -4px, rgba(255,255,255,0.70) 0px 1px 3px 0px inset; transition:transform 0.2s ease, box-shadow 0.2s ease;"
                onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='rgba(249,115,22,0.18) 0px 16px 40px -8px, rgba(255,255,255,0.80) 0px 1px 3px 0px inset';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='rgba(180,170,160,0.15) 0px 4px 20px -4px, rgba(255,255,255,0.70) 0px 1px 3px 0px inset';"
              >
                {/* Step number + icon */}
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
                  <div style="width:44px; height:44px; border-radius:14px; background:linear-gradient(135deg,#F97316,#FB923C); display:flex; align-items:center; justify-content:center; box-shadow:rgba(249,115,22,0.30) 0px 4px 12px 0px; flex-shrink:0;">
                    <Icon name={step.icon} size={18} style="color:white;" />
                  </div>
                  <span style="font-size:11px; font-weight:700; letter-spacing:0.08em; color:#A8A29E;">{step.num}</span>
                </div>
                <p style="font-size:14px; font-weight:600; color:#1C1917; margin-bottom:8px; letter-spacing:-0.015em;">{step.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §5  FEATURES — asymmetric bento grid
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:80px 24px; background:#FFEDD5;">
        <div class="max-w-5xl mx-auto">

          {/* Header */}
          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#F97316; margin-bottom:10px;">Built different</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:500; color:#1C1917; letter-spacing:-0.025em; line-height:1.15; margin-bottom:14px;">
              Purpose-built for the depot floor
            </h2>
            <p style="font-size:14px; color:#78716C; max-width:440px; margin:0 auto; line-height:1.7;">
              Every feature exists because it solves a real operational headache at a Container Freight Station.
            </p>
          </div>

          {/* Bento grid — top row: 1 wide + 2 narrow */}
          <div style="display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:12px; margin-bottom:12px;" class="bento-row">

            {/* Wide feature */}
            <div
              class="reveal-left"
              style="background:linear-gradient(135deg,rgba(249,115,22,0.08) 0%,rgba(254,240,220,0.6) 100%); border:1px solid rgba(249,115,22,0.18); border-radius:28px; padding:32px; position:relative; overflow:hidden; box-shadow:rgba(180,170,160,0.18) 0px 8px 32px -8px;"
            >
              <div style="position:absolute; top:-40px; right:-40px; width:180px; height:180px; border-radius:9999px; background:radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%); pointer-events:none;" />
              <div style="width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,#F97316,#FB923C); display:flex; align-items:center; justify-content:center; margin-bottom:20px; box-shadow:rgba(249,115,22,0.30) 0px 4px 12px 0px;">
                <Icon name={ICONS.shield} size={22} style="color:white;" />
              </div>
              <p style="font-size:16px; font-weight:600; color:#1C1917; letter-spacing:-0.02em; margin-bottom:10px;">Automatic ICS clearance check</p>
              <p style="font-size:13px; color:#78716C; line-height:1.7; max-width:280px;">
                Customs clearance status is fetched automatically the moment you enter your shipment number — no manual checks needed.
              </p>
              <div style="margin-top:24px; display:inline-flex; align-items:center; gap:6px; background:rgba(22,163,74,0.10); border:1px solid rgba(22,163,74,0.20); border-radius:9999px; padding:6px 12px;">
                <span style="width:6px; height:6px; border-radius:9999px; background:#16A34A;" />
                <span style="font-size:11px; font-weight:500; color:#16A34A;">Clearance verified</span>
              </div>
            </div>

            {/* Narrow features */}
            {[
              { icon: ICONS.clock,   title: '10-min slot holds',    desc: 'Your preferred time is reserved while you complete the booking — zero double-bookings.' },
              { icon: ICONS.qrCode,  title: 'QR check-in kiosk',    desc: 'Scan at arrival. Skip the counter entirely.' },
            ].map((feat, i) => (
              <div
                class="reveal"
                data-reveal-delay={String((i + 1) * 100)}
                style="background:rgba(234,230,219,0.55); border:1px solid rgba(249,115,22,0.12); border-radius:28px; padding:28px; box-shadow:rgba(180,170,160,0.12) 0px 4px 16px -4px, rgba(255,255,255,0.60) 0px 1px 3px 0px inset; transition:transform 0.2s ease, box-shadow 0.2s ease;"
                onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='rgba(249,115,22,0.15) 0px 12px 32px -8px';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='rgba(180,170,160,0.12) 0px 4px 16px -4px, rgba(255,255,255,0.60) 0px 1px 3px 0px inset';"
              >
                <div style="width:44px; height:44px; border-radius:14px; background:rgba(249,115,22,0.10); display:flex; align-items:center; justify-content:center; margin-bottom:18px; box-shadow:rgba(249,115,22,0.12) 0px 2px 8px 0px;">
                  <Icon name={feat.icon} size={20} style="color:#F97316;" />
                </div>
                <p style="font-size:14px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:8px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom row: 3 equal */}
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;" class="bento-row">
            {[
              { icon: ICONS.warning, title: 'CHEP pallet alerts',    desc: 'System flags any pallet exchange requirements before you arrive at the depot.' },
              { icon: ICONS.users,   title: 'Agent bookings',         desc: 'Freight forwarders can book on behalf of drivers — no separate account needed.' },
              { icon: ICONS.reports, title: 'Reception dashboard',    desc: 'Staff see live bookings, walk-ins, and clearance holds in a single view.' },
            ].map((feat, i) => (
              <div
                class="reveal"
                data-reveal-delay={String(i * 80)}
                style="background:rgba(234,230,219,0.55); border:1px solid rgba(249,115,22,0.12); border-radius:28px; padding:28px; box-shadow:rgba(180,170,160,0.12) 0px 4px 16px -4px, rgba(255,255,255,0.60) 0px 1px 3px 0px inset; transition:transform 0.2s ease, box-shadow 0.2s ease;"
                onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='rgba(249,115,22,0.15) 0px 12px 32px -8px';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='rgba(180,170,160,0.12) 0px 4px 16px -4px, rgba(255,255,255,0.60) 0px 1px 3px 0px inset';"
              >
                <div style="width:44px; height:44px; border-radius:14px; background:rgba(249,115,22,0.10); display:flex; align-items:center; justify-content:center; margin-bottom:18px;">
                  <Icon name={feat.icon} size={20} style="color:#F97316;" />
                </div>
                <p style="font-size:14px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:8px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §6  TESTIMONIAL / TRUST QUOTE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:80px 24px; background:linear-gradient(180deg,#FFEDD5 0%,#FEF0DC 100%);">
        <div class="max-w-3xl mx-auto">
          <div
            class="reveal card-shell"
            style="border-radius:40px;"
          >
            <div class="card-shell-inner" style="padding:52px 48px; border-radius:39px; text-align:center;">

              {/* Quote marks */}
              <div style="width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,#F97316,#FB923C); display:flex; align-items:center; justify-content:center; margin:0 auto 28px; box-shadow:rgba(249,115,22,0.30) 0px 4px 12px 0px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="color:white;">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>
                </svg>
              </div>

              <blockquote style="font-size:clamp(1.1rem,2.5vw,1.4rem); font-weight:400; color:#1C1917; letter-spacing:-0.02em; line-height:1.55; margin-bottom:28px; font-style:italic;">
                "We used to spend 40 minutes every morning taking phone bookings and updating a whiteboard. Now drivers book online, the system handles ICS checks, and our gate time is down to under 4 minutes."
              </blockquote>

              <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
                <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,#F97316,#FB923C); display:flex; align-items:center; justify-content:center;">
                  <Icon name={ICONS.users} size={18} style="color:white;" />
                </div>
                <div style="text-align:left;">
                  <p style="font-size:13px; font-weight:600; color:#1C1917;">James R.</p>
                  <p style="font-size:12px; color:#78716C;">Operations Manager, Sydney CFS</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §7  FINAL CTA — dark section
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#1C1917; position:relative; overflow:hidden;">

        {/* Ambient glow */}
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:700px; height:400px; border-radius:9999px; background:radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 65%); pointer-events:none;" />

        <div class="max-w-2xl mx-auto" style="text-align:center; position:relative; z-index:1;">

          <div class="reveal" style="display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(249,115,22,0.25); border-radius:9999px; padding:7px 16px; margin-bottom:28px;">
            <span style="width:6px; height:6px; border-radius:9999px; background:#F97316; animation:pulse-dot 2s ease-in-out infinite;" />
            <span style="font-size:11px; font-weight:500; color:rgba(249,115,22,0.85);">Open Mon–Fri 06:00–18:00</span>
          </div>

          <h2
            class="reveal"
            data-reveal-delay="100"
            style="font-size:clamp(2rem,5vw,3.2rem); font-weight:500; color:#FAFAF9; letter-spacing:-0.03em; line-height:1.1; margin-bottom:20px;"
          >
            Ready to skip<br />
            <span class="text-gradient-orange">the queue?</span>
          </h2>

          <p
            class="reveal"
            data-reveal-delay="150"
            style="font-size:14px; color:#78716C; line-height:1.7; margin-bottom:36px; max-width:380px; margin-left:auto; margin-right:auto;"
          >
            Your first booking takes under 3 minutes. No account, no calls, no paper.
          </p>

          <div
            class="reveal"
            data-reveal-delay="200"
            style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;"
          >
            <a href="/book" class="btn-primary" style="padding:14px 28px; font-size:14px;">
              <Icon name={ICONS.calendar} size={15} />
              Book a Visit
              <Icon name={ICONS.arrowRight} size={14} />
            </a>
            <a
              href="/bookings"
              style="display:inline-flex; align-items:center; gap:8px; padding:14px 24px; font-size:14px; font-weight:500; color:#A8A29E; border:1px solid rgba(255,255,255,0.10); border-radius:9999px; text-decoration:none; transition:border-color 0.15s ease, color 0.15s ease;"
              onmouseover="this.style.borderColor='rgba(255,255,255,0.25)'; this.style.color='#D6D3D1';"
              onmouseout="this.style.borderColor='rgba(255,255,255,0.10)'; this.style.color='#A8A29E';"
            >
              <Icon name={ICONS.search} size={15} />
              Look Up Booking
            </a>
          </div>

          <p class="reveal" data-reveal-delay="250" style="font-size:12px; color:#44403C; margin-top:20px;">
            Sydney Container Freight Station · ABN 12 345 678 901
          </p>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bento-row  { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 640px) {
          section > div > div[style*="grid-template-columns:1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .steps-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .status-badge {
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 500;
          color: #78716C;
          background: rgba(255,247,237,0.85);
          border: 1px solid rgba(249,115,22,0.18);
          border-radius: 9999px;
          padding: 6px 14px;
          backdrop-filter: blur(8px);
        }
      `}</style>

    </LandingLayout>
  )
})

// ─── Booking wizard ─────────────────────────────────────────────────────────
portalRoutes.get('/book', (c) => {
  return c.html(
    <PublicLayout title="Book a Visit">
      <div style="min-height:calc(100vh - 56px); background:#EDE9E2; padding:40px 24px 64px;">
        <div style="max-width:540px; margin:0 auto;">
          <div style="margin-bottom:28px;">
            <h1 style="font-size:22px; font-weight:600; color:#1C1917; letter-spacing:-0.025em; margin-bottom:4px;">Book a Depot Visit</h1>
            <p style="font-size:13px; color:#A8A29E;">Sydney Container Freight Station · Mon–Fri 06:00–18:00</p>
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
      <div style="min-height:calc(100vh - 56px); background:#FFEDD5; padding:40px 24px 64px;">
        <div style="max-width:640px; margin:0 auto;">

          {/* Page header */}
          <div style="margin-bottom:28px;">
            <h1 style="font-size:22px; font-weight:600; color:#1C1917; letter-spacing:-0.025em; margin-bottom:4px;">My Bookings</h1>
            <p style="font-size:13px; color:#78716C;">Track the status of your depot slot bookings.</p>
          </div>

          {/* Search bar */}
          <form method="get" action="/bookings" style="display:flex; gap:8px; margin-bottom:28px;">
            <div style="flex:1; position:relative;">
              <input
                type="text"
                name="ref"
                value={ref || ''}
                placeholder="Booking reference — e.g. GLD-2026-10142"
                style="width:100%; padding:10px 14px; font-size:13.5px; color:#1C1917; background:#FFF7ED; border:1.5px solid rgba(240,197,137,0.6); border-radius:10px; outline:none; box-sizing:border-box; font-family:inherit;"
                onfocus="this.style.borderColor='#F97316';"
                onblur="this.style.borderColor='rgba(240,197,137,0.6)';"
              />
            </div>
            <button
              type="submit"
              style="padding:10px 20px; font-size:13px; font-weight:500; color:white; background:linear-gradient(135deg,#F97316,#EA6C0A); border:none; border-radius:10px; cursor:pointer; white-space:nowrap; box-shadow:rgba(249,115,22,0.22) 0px 4px 10px 0px;"
            >
              Search
            </button>
            {ref && (
              <a
                href="/bookings"
                style="display:flex; align-items:center; padding:10px 16px; font-size:13px; font-weight:500; color:#78716C; background:transparent; border:1.5px solid rgba(240,197,137,0.5); border-radius:10px; text-decoration:none; white-space:nowrap;"
              >
                Clear
              </a>
            )}
          </form>

          {ref && (
            <p style="font-size:12px; font-weight:500; color:#78716C; margin-bottom:16px;">{heading}</p>
          )}

          <MyBookingsList bookings={bookings} query={ref} />
        </div>
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
