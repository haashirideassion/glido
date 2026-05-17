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
      <section class="bg-hero-gradient noise" style="padding-top:2rem; padding-bottom:4rem; overflow:hidden; position:relative; min-height:80vh; display:flex; align-items:flex-start;">

        {/* Background orb */}
        <div style="position:absolute; top:-120px; right:-80px; width:600px; height:600px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.12) 0%, transparent 70%); pointer-events:none;" />
        <div style="position:absolute; bottom:0; left:-60px; width:400px; height:400px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.06) 0%, transparent 70%); pointer-events:none;" />

        <div class="max-w-6xl mx-auto px-6 w-full" style="padding-bottom:5rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; padding-top:3rem;">

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
                style="font-size:clamp(2.4rem,4.5vw,3.4rem); font-weight:700; color:#1C1917; letter-spacing:-0.04em; line-height:1.05; margin-bottom:24px;"
              >
                <span class="hero-word" style="display:block;">Schedule your</span>
                <span class="hero-word" style="display:block;">
                  <span
                    id="rotating-word"
                    style="color:#FC6514; display:inline-block; min-width:200px;"
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

              <p class="animate-fade-up delay-500" style="font-size:12px; color:#64748B; margin-top:20px;">
                No account required · Takes under 3 minutes
              </p>
            </div>

            {/* Right: floating card mockup */}
            <div class="animate-fade-up delay-200" style="position:relative;">

              {/* Main card — Level 3 elevation */}
              <div
                class="card-shell animate-float-slow"
                style="position:relative; z-index:2;"
              >
                <div class="card-shell-inner" style="padding:28px;">

                  {/* Card header */}
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:22px;">
                    <div>
                      <p style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#64748B;">Available Slots</p>
                      <p style="font-size:14px; font-weight:600; color:#1C1917; margin-top:2px;">Thursday, 15 May</p>
                    </div>
                    <div style="width:34px; height:34px; border-radius:8px; background:rgba(252,101,20,0.12); border:1px solid rgba(252,101,20,0.22); display:flex; align-items:center; justify-content:center;">
                      <Icon name={ICONS.calendar} size={15} style="color:#FC6514;" />
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
                          ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-radius:8px; padding:10px 8px; text-align:center; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 12px rgba(252,101,20,0.40);'
                          : slot.s === 'busy'
                          ? 'background:rgba(0,0,0,0.025); border:1px solid rgba(0,0,0,0.06); border-radius:8px; padding:10px 8px; text-align:center; opacity:0.40;'
                          : 'background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08); border-radius:8px; padding:10px 8px; text-align:center; cursor:pointer;'
                        }
                      >
                        <p style={`font-size:12px; font-weight:600; ${slot.s==='selected'?'color:white;':'color:#78716C;'}`}>{slot.t}</p>
                        <p style={`font-size:10px; margin-top:2px; ${slot.s==='selected'?'color:rgba(255,255,255,0.75);':slot.s==='busy'?'color:#64748B;':'color:#FC6514;'}`}>
                          {slot.s === 'selected' ? 'Selected' : slot.s === 'busy' ? 'Full' : 'Open'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* CTA in card */}
                  <div style="background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08); border-radius:10px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <p style="font-size:12px; font-weight:600; color:#1C1917;">09:00 – 10:00</p>
                      <p style="font-size:11px; color:#64748B; margin-top:1px;">Pick Up · LCL</p>
                    </div>
                    <div style="background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-radius:6px; padding:7px 13px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 3px 8px rgba(252,101,20,0.40);">
                      <p style="font-size:11px; font-weight:600; color:white;">Confirm →</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mini badge — top right */}
              <div
                class="glass"
                style="position:absolute; top:-20px; right:-20px; border-radius:12px; padding:10px 14px; display:flex; align-items:center; gap:8px; z-index:3;"
              >
                <div style="width:28px; height:28px; border-radius:8px; background:rgba(34,197,94,0.14); border:1px solid rgba(34,197,94,0.25); display:flex; align-items:center; justify-content:center;">
                  <Icon name={ICONS.check} size={14} style="color:#22C55E;" />
                </div>
                <div>
                  <p style="font-size:11px; font-weight:600; color:#1C1917; line-height:1.2;">Confirmed</p>
                  <p style="font-size:10px; color:#64748B;">GLD-2026-10142</p>
                </div>
              </div>

              {/* Floating mini badge — bottom left */}
              <div
                class="glass"
                style="position:absolute; bottom:-16px; left:-24px; border-radius:12px; padding:10px 14px; display:flex; align-items:center; gap:8px; z-index:3;"
              >
                <div style="width:28px; height:28px; border-radius:8px; background:rgba(252,101,20,0.12); border:1px solid rgba(252,101,20,0.22); display:flex; align-items:center; justify-content:center;">
                  <Icon name={ICONS.clock} size={14} style="color:#FC6514;" />
                </div>
                <div>
                  <p style="font-size:11px; font-weight:600; color:#1C1917; line-height:1.2;">Gate time</p>
                  <p style="font-size:10px; color:#64748B;">4 min avg.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Fade to next section */}
        <div style="position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(to bottom, transparent, #EEEAE4); pointer-events:none;" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §2  MARQUEE — trust strip
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:24px 0; background:#EEEAE4; overflow:hidden; border-top:1px solid rgba(0,0,0,0.07); border-bottom:1px solid rgba(0,0,0,0.07);">
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
              <span key={i} style="display:inline-flex; align-items:center; gap:20px; padding:0 32px; font-size:11px; font-weight:600; color:rgba(0,0,0,0.20); letter-spacing:0.06em; text-transform:uppercase;">
                <span style="width:3px; height:3px; border-radius:9999px; background:rgba(0,0,0,0.15); display:inline-block; flex-shrink:0;" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §3  STATS — animated counters
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:80px 24px; background:#EEEAE4;">
        <div class="max-w-5xl mx-auto">

          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">By the numbers</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.1;">
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
                class="reveal gl-card"
                data-reveal-delay={String(s.delay)}
                style="padding:28px 24px; text-align:center;"
              >
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(252,101,20,0.10); border:1px solid rgba(252,101,20,0.18); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
                  <Icon name={s.icon} size={16} style="color:#FC6514;" />
                </div>
                <p
                  data-count={String(s.count)}
                  data-suffix={s.suffix}
                  style="font-size:2.4rem; font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1; margin-bottom:8px;"
                >
                  {s.count === 0 ? 'Zero' : `${s.count}${s.suffix}`}
                </p>
                <p style="font-size:12px; color:#64748B; line-height:1.5;">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §4  HOW IT WORKS — numbered step cards with connector
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style="padding:80px 24px; background:#EEEAE4; border-top:1px solid rgba(0,0,0,0.07);">
        <div class="max-w-5xl mx-auto">

          {/* Header */}
          <div class="reveal" style="max-width:520px; margin-bottom:60px;">
            <p style="font-size:10px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase; color:#FC6514; opacity:0.75; margin-bottom:10px;">How it works</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.1; margin-bottom:14px;">
              From browser to bay door in four steps
            </h2>
            <p style="font-size:14px; color:#78716C; line-height:1.7;">
              No spreadsheets. No radio calls. The whole check-in process runs online.
            </p>
          </div>

          {/* Steps grid */}
          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; position:relative;" class="steps-grid">

            {/* Connector line */}
            <div style="position:absolute; top:52px; left:calc(12.5% + 12px); right:calc(12.5% + 12px); height:1px; background:rgba(0,0,0,0.10); pointer-events:none; z-index:0;" class="hide-mobile" />

            {[
              { num: '01', icon: ICONS.users,   title: 'Your details',     desc: 'Name, service type, and cargo category. Takes 60 seconds.' },
              { num: '02', icon: ICONS.calendar, title: 'Pick a slot',     desc: 'Choose an open window — held for 10 min while you finish.' },
              { num: '03', icon: ICONS.document, title: 'Add shipment',    desc: 'Enter your HBL or container. ICS status fetched automatically.' },
              { num: '04', icon: ICONS.qrCode,   title: 'Scan & enter',   desc: 'Scan your QR at the kiosk. No counter queue, no wait.' },
            ].map((step, i) => (
              <div
                class="reveal gl-card"
                data-reveal-delay={String(i * 120)}
                style="position:relative; z-index:1; padding:24px 20px;"
              >
                {/* Step number pill */}
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
                  <div style="width:36px; height:36px; border-radius:9999px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 12px rgba(252,101,20,0.35);">
                    <span style="font-size:12px; font-weight:700; color:white; letter-spacing:-0.01em;">{step.num}</span>
                  </div>
                  <div style="flex:1; height:1px; background:rgba(0,0,0,0.08); border-radius:9999px;" />
                </div>
                <div style="width:36px; height:36px; border-radius:9px; background:rgba(252,101,20,0.08); border:1px solid rgba(252,101,20,0.16); display:flex; align-items:center; justify-content:center; margin-bottom:14px;">
                  <Icon name={step.icon} size={16} style="color:#FC6514;" />
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
      <section style="padding:80px 24px; background:#EEEAE4; border-top:1px solid rgba(0,0,0,0.07);">
        <div class="max-w-5xl mx-auto">

          {/* Header */}
          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Built different</p>
            <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.1; margin-bottom:14px;">
              Purpose-built for the depot floor
            </h2>
            <p style="font-size:14px; color:#78716C; max-width:440px; margin:0 auto; line-height:1.7;">
              Every feature exists because it solves a real operational headache at a Container Freight Station.
            </p>
          </div>

          {/* Bento grid — top row: 1 wide + 2 narrow */}
          <div style="display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:12px; margin-bottom:12px;" class="bento-row">

            {/* Wide feature — Level 4 brand surface */}
            <div
              class="reveal-left noise"
              style="background:linear-gradient(135deg,rgba(252,101,20,0.15) 0%,rgba(232,90,10,0.08) 100%); border:1px solid rgba(252,101,20,0.22); border-radius:16px; padding:32px; position:relative; overflow:hidden; box-shadow:0 8px 32px rgba(252,101,20,0.12);"
            >
              <div style="position:absolute; top:-40px; right:-40px; width:180px; height:180px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.20) 0%, transparent 70%); pointer-events:none;" />
              <div style="width:48px; height:48px; border-radius:10px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin-bottom:20px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(252,101,20,0.40);">
                <Icon name={ICONS.shield} size={22} style="color:white;" />
              </div>
              <p style="font-size:16px; font-weight:600; color:#1C1917; letter-spacing:-0.02em; margin-bottom:10px;">Automatic ICS clearance check</p>
              <p style="font-size:13px; color:#78716C; line-height:1.7; max-width:280px;">
                Customs clearance status is fetched automatically the moment you enter your shipment number — no manual checks needed.
              </p>
              <div style="margin-top:24px; display:inline-flex; align-items:center; gap:6px; background:rgba(34,197,94,0.10); border:1px solid rgba(34,197,94,0.22); border-radius:9999px; padding:6px 12px;">
                <span class="gl-live-dot" style="width:6px; height:6px;" />
                <span style="font-size:11px; font-weight:500; color:#22C55E;">Clearance verified</span>
              </div>
            </div>

            {/* Narrow features */}
            {[
              { icon: ICONS.clock,   title: '10-min slot holds',    desc: 'Your preferred time is reserved while you complete the booking — zero double-bookings.' },
              { icon: ICONS.qrCode,  title: 'QR check-in kiosk',    desc: 'Scan at arrival. Skip the counter entirely.' },
            ].map((feat, i) => (
              <div
                class="reveal gl-card"
                data-reveal-delay={String((i + 1) * 100)}
                style="padding:28px;"
              >
                <div style="width:44px; height:44px; border-radius:10px; background:rgba(252,101,20,0.10); border:1px solid rgba(252,101,20,0.18); display:flex; align-items:center; justify-content:center; margin-bottom:18px;">
                  <Icon name={feat.icon} size={20} style="color:#FC6514;" />
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
                class="reveal gl-card"
                data-reveal-delay={String(i * 80)}
                style="padding:28px;"
              >
                <div style="width:44px; height:44px; border-radius:10px; background:rgba(252,101,20,0.10); border:1px solid rgba(252,101,20,0.18); display:flex; align-items:center; justify-content:center; margin-bottom:18px;">
                  <Icon name={feat.icon} size={20} style="color:#FC6514;" />
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
      <section style="padding:80px 24px; background:#EEEAE4; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-3xl mx-auto">
          <div
            class="reveal"
            style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:16px;"
          >
            <div style="padding:52px 48px; text-align:center;">

              {/* Quote marks */}
              <div style="width:48px; height:48px; border-radius:10px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin:0 auto 28px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(252,101,20,0.40), 0 1px 3px rgba(0,0,0,0.40);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                </svg>
              </div>

              <blockquote style="font-size:clamp(1.1rem,2.5vw,1.4rem); font-weight:400; color:#1C1917; letter-spacing:-0.02em; line-height:1.55; margin-bottom:28px; font-style:italic;">
                "We used to spend 40 minutes every morning taking phone bookings and updating a whiteboard. Now drivers book online, the system handles ICS checks, and our gate time is down to under 4 minutes."
              </blockquote>

              <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
                <div style="width:40px; height:40px; border-radius:8px; background:rgba(252,101,20,0.15); border:1px solid rgba(252,101,20,0.25); display:flex; align-items:center; justify-content:center;">
                  <Icon name={ICONS.users} size={18} style="color:#FC6514;" />
                </div>
                <div style="text-align:left;">
                  <p style="font-size:13px; font-weight:600; color:#1C1917;">James R.</p>
                  <p style="font-size:12px; color:#64748B;">Operations Manager, Sydney CFS</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          §7  FINAL CTA — dark section
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#EEEAE4; position:relative; overflow:hidden;">

        {/* Ambient glow */}
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:700px; height:400px; border-radius:9999px; background:radial-gradient(ellipse, rgba(252,101,20,0.12) 0%, transparent 65%); pointer-events:none;" />

        <div class="max-w-2xl mx-auto" style="text-align:center; position:relative; z-index:1;">

          <div class="reveal" style="display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(252,101,20,0.25); border-radius:9999px; padding:7px 16px; margin-bottom:28px;">
            <span style="width:6px; height:6px; border-radius:9999px; background:#FC6514; animation:pulse-dot 2s ease-in-out infinite;" />
            <span style="font-size:11px; font-weight:500; color:rgba(252,101,20,0.85);">Open Mon–Fri 06:00–18:00</span>
          </div>

          <h2
            class="reveal"
            data-reveal-delay="100"
            style="font-size:clamp(2rem,5vw,3.2rem); font-weight:500; color:#1C1917; letter-spacing:-0.03em; line-height:1.1; margin-bottom:20px;"
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
              style="display:inline-flex; align-items:center; gap:8px; padding:14px 24px; font-size:14px; font-weight:500; color:#78716C; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; text-decoration:none; transition:border-color 0.15s ease, color 0.15s ease;"
              onmouseover="this.style.borderColor='rgba(0,0,0,0.25)'; this.style.color='#1C1917';"
              onmouseout="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.color='#78716C';"
            >
              <Icon name={ICONS.search} size={15} />
              Look Up Booking
            </a>
          </div>

          <p class="reveal" data-reveal-delay="250" style="font-size:12px; color:#64748B; margin-top:20px;">
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
          color: rgba(252,101,20,0.85);
          background: rgba(252,101,20,0.08);
          border: 1px solid rgba(252,101,20,0.20);
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
      <div style="padding:40px 24px 64px;">
        <div style="max-width:560px; margin:0 auto;">

          {/* Page header */}
          <div style="margin-bottom:28px;">
            <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(252,101,20,0.08); border:1px solid rgba(252,101,20,0.16); border-radius:9999px; padding:3px 11px; margin-bottom:14px;">
              <span style="width:5px; height:5px; border-radius:9999px; background:#FC6514; flex-shrink:0;" />
              <span style="font-size:10.5px; font-weight:600; color:rgba(252,101,20,0.85); letter-spacing:0.06em; text-transform:uppercase;">Sydney CFS · Mon–Fri 06:00–18:00</span>
            </div>
            <h1 style="font-size:24px; font-weight:700; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:5px;">Book a Depot Visit</h1>
            <p style="font-size:13px; color:#78716C; line-height:1.6;">Reserve your time slot, upload documents, and get a QR code — all in under 3 minutes.</p>
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
      <div style="padding:40px 24px 64px;">
        <div style="max-width:640px; margin:0 auto;">

          {/* Page header */}
          <div style="margin-bottom:28px;">
            <h1 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:4px;">My Bookings</h1>
            <p style="font-size:13px; color:#64748B;">Track the status of your depot slot bookings.</p>
          </div>

          {/* Search bar */}
          <form method="get" action="/bookings" style="display:flex; gap:8px; margin-bottom:28px;">
            <div style="flex:1; position:relative;">
              <input
                type="text"
                name="ref"
                value={ref || ''}
                placeholder="Booking reference — e.g. GLD-2026-10142"
                class="wizard-field"
                style="width:100%; padding:10px 14px; font-size:13.5px; border-radius:10px; outline:none; box-sizing:border-box; font-family:inherit;"
                onfocus="this.style.borderColor='rgba(252,101,20,0.50)';"
                onblur="this.style.borderColor='rgba(0,0,0,0.12)';"
              />
            </div>
            <button
              type="submit"
              class="btn-primary"
              style="padding:10px 20px; font-size:13px; white-space:nowrap; border:none; cursor:pointer;"
            >
              Search
            </button>
            {ref && (
              <a
                href="/bookings"
                class="btn-ghost"
                style="padding:10px 16px; font-size:13px; white-space:nowrap;"
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
          <a href="/book" class="text-xs underline" style="color:#FC6514;">Try again</a>
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
      <div style="min-height:calc(100vh - 56px); background:#EEEAE4; padding:40px 24px 64px;">
      <div class="max-w-2xl mx-auto">

        {/* Success banner */}
        <div
          class="flex items-center gap-3 rounded-xl px-5 py-4 mb-8"
          style="background:rgba(34,197,94,0.10); border:1px solid rgba(34,197,94,0.22);"
        >
          <div
            style="width:40px; height:40px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:linear-gradient(180deg,#4ADE80 0%,#16A34A 100%); box-shadow:0 4px 12px rgba(34,197,94,0.35);"
          >
            <Icon name={ICONS.check} size={20} style="color:white;" />
          </div>
          <div>
            <p style="font-size:13px; font-weight:600; color:#22C55E;">Booking Confirmed!</p>
            <p style="font-size:12px; font-family:ui-monospace,monospace; font-weight:700; color:#78716C; margin-top:2px;">{ref}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          {/* QR Code */}
          <div
            style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 24px; border-radius:16px; background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08);"
          >
            <img src={qrDataUrl} alt={`QR code for ${ref}`} width={220} height={220} style="border-radius:8px;" />
            <p style="font-size:12px; font-weight:500; color:#64748B; margin-top:14px;">Scan at the kiosk to check in</p>
            <p style="font-size:12px; font-family:ui-monospace,monospace; font-weight:700; color:#1C1917; margin-top:4px;">{ref}</p>
          </div>

          {/* Booking summary */}
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div
              style="border-radius:12px; padding:16px; background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08);"
            >
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#64748B; margin-bottom:12px;">Booking Details</p>
              <div style="display:flex; flex-direction:column; gap:7px; font-size:12px;">
                {[
                  { label: 'Driver', value: booking.driverName },
                  { label: 'Service', value: booking.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off' },
                  { label: 'Load type', value: booking.loadType.toUpperCase() },
                  { label: 'Date', value: booking.slotDate },
                  { label: 'Time', value: `${booking.slotStartTime} – ${booking.slotEndTime}` },
                  ...(booking.houseBillNumber ? [{ label: 'HBL', value: booking.houseBillNumber }] : []),
                  ...(booking.containerNumber ? [{ label: 'Container', value: booking.containerNumber }] : []),
                ].map((row) => (
                  <div key={row.label} style="display:flex; justify-content:space-between;">
                    <span style="color:#64748B;">{row.label}</span>
                    <span style="font-weight:500; color:#1C1917;">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charges */}
            {booking.totalAmount && (
              <div
                style="border-radius:12px; padding:16px; background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08);"
              >
                <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#64748B; margin-bottom:12px;">Charges</p>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
                  {(booking.storageCharge ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#78716C;"><span>Storage</span><span>${booking.storageCharge!.toFixed(2)}</span></div>
                  )}
                  {(booking.shrinkWrapCharge ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#78716C;"><span>Shrink wrap</span><span>${booking.shrinkWrapCharge!.toFixed(2)}</span></div>
                  )}
                  {(booking.slotFee ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#78716C;"><span>Slot fee</span><span>${booking.slotFee!.toFixed(2)}</span></div>
                  )}
                  {(booking.gstAmount ?? 0) > 0 && (
                    <div style="display:flex; justify-content:space-between; color:#64748B; padding-top:6px; border-top:1px solid rgba(0,0,0,0.07);"><span>GST (10%)</span><span>${booking.gstAmount!.toFixed(2)}</span></div>
                  )}
                  <div style="display:flex; justify-content:space-between; font-weight:700; color:#1C1917; padding-top:6px; border-top:1px solid rgba(0,0,0,0.09);">
                    <span>Total</span>
                    <span style="color:#FC6514;">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; color:#64748B;">
                    <span>{booking.paymentMethod?.toUpperCase()}</span>
                    <span style={booking.paymentStatus === 'paid' ? 'color:#22C55E; font-weight:500;' : 'color:#FBBF24; font-weight:500;'}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'pending_eft' ? 'EFT Pending' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* EFT bank details */}
            {isEft && tenant && (
              <div
                style="border-radius:12px; padding:16px; background:rgba(252,101,20,0.06); border:1px solid rgba(252,101,20,0.20);"
              >
                <p style="font-size:11px; font-weight:600; color:#FC6514; margin-bottom:10px;">Transfer details</p>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:rgba(252,101,20,0.65);">
                  <div style="display:flex; justify-content:space-between;"><span>Bank</span><span style="font-weight:500; color:#FC6514;">{tenant.eft_bank_name || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>BSB</span><span style="font-family:ui-monospace,monospace; font-weight:500; color:#FC6514;">{tenant.eft_bsb || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>Account No.</span><span style="font-family:ui-monospace,monospace; font-weight:500; color:#FC6514;">{tenant.eft_account_number || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>Account Name</span><span style="font-weight:500; color:#FC6514;">{tenant.eft_account_name || '—'}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>Reference</span><span style="font-family:ui-monospace,monospace; font-weight:700; color:#FC6514;">{ref}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHEP warning */}
        {booking.palletType === 'chep' && (
          <div
            style="display:flex; align-items:flex-start; gap:10px; border-radius:10px; padding:12px 16px; margin-top:20px; background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20);"
          >
            <Icon name={ICONS.warning} size={16} style="color:#FBBF24; flex-shrink:0; margin-top:2px;" />
            <p style="font-size:12px; font-weight:500; color:rgba(251,191,36,0.75); line-height:1.5;">
              Remember: Bring {booking.palletCount} empty CHEP pallet{(booking.palletCount ?? 1) > 1 ? 's' : ''} to exchange at collection.
            </p>
          </div>
        )}

        {/* Actions */}
        <div class="flex flex-wrap gap-3 mt-8 justify-center">
          <a
            href="/book"
            class="btn-primary"
            style="padding:11px 22px; font-size:13px;"
          >
            <Icon name={ICONS.add} size={14} />
            Book Another Visit
          </a>
          <a
            href={`/bookings?ref=${ref}`}
            class="btn-ghost"
            style="padding:11px 20px; font-size:13px;"
          >
            <Icon name={ICONS.search} size={14} />
            View My Bookings
          </a>
        </div>

      </div>
      </div>
    </PublicLayout>
  )
})
