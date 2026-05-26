import { Hono } from 'hono'
import { PublicLayout } from '../layouts/PublicLayout'
import { LandingLayout } from '../layouts/LandingLayout'
import { Icon, ICONS } from '../lib/Icon'
import { Button } from '../components/ui/button'
import { BookingWizard } from '../components/portal/BookingWizard'
import { MyBookingsList } from '../components/portal/MyBookingsList'
import { VisitorDashboard } from '../components/portal/VisitorDashboard'
import { Input } from '../components/ui/input'
import { getBookings, findBooking, createBooking, getBookingsByUserId, cancelBooking, getBookingByRef } from '../lib/db/bookings'
import { getSlotsByDate } from '../lib/db/slots'
import { getTenant } from '../lib/db/tenants'
import { lookupShipment, lookupShipmentByContainer } from '../lib/db/cfs-shipments'
import { checkIcsStatus } from '../lib/ics'
import { calculateCharges } from '../lib/charges'
import { generateQRDataURL } from '../lib/qr'
import { DEFAULT_TENANT_ID } from '../lib/supabase'
import {
  signInWithPassword,
  signUpVisitor,
  getSessionUser,
  setSessionCookie,
  clearSessionCookie,
  isReceptionRole,
} from '../lib/auth'
import {
  sendBookingConfirmation,
  sendEftReminder,
  sendIcsHoldAlert,
} from '../lib/email'

export const portalRoutes = new Hono()

// ─── Landing page ─────────────────────────────────────────────────────────────
portalRoutes.get('/', (c) => {
  return c.html(
    <LandingLayout title="Home">

      {/* ══════════════════════════════════════════════════════════════════
          §1  HERO — contained card on warp background
      ══════════════════════════════════════════════════════════════════ */}
      <section id="hero-section" style="padding:56px 40px 72px; background:#F7F6F5; position:relative; overflow:hidden;">

        {/* ── Warp beams ── */}
        <div style="position:absolute; inset:0; pointer-events:none; overflow:hidden;">
          <div style="position:absolute; left:-70%; right:-70%; bottom:0; height:80%; transform:perspective(280px) rotateX(72deg); transform-origin:center bottom; background-image:linear-gradient(rgba(0,0,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.06) 1px,transparent 1px); background-size:80px 80px; mask-image:linear-gradient(to top,black 0%,black 20%,transparent 100%); -webkit-mask-image:linear-gradient(to top,black 0%,black 20%,transparent 100%);"></div>
          {[
            { l:'6%',  dur:'3.1s', del:'0.0s', c:'rgba(252,101,20,0.45)', h:'120px' },
            { l:'18%', dur:'4.4s', del:'1.2s', c:'rgba(99,130,255,0.35)',  h:'140px' },
            { l:'31%', dur:'2.9s', del:'0.5s', c:'rgba(52,211,153,0.35)',  h:'100px' },
            { l:'47%', dur:'3.7s', del:'1.9s', c:'rgba(252,101,20,0.30)',  h:'130px' },
            { l:'62%', dur:'2.6s', del:'0.3s', c:'rgba(168,85,247,0.38)',  h:'110px' },
            { l:'76%', dur:'4.0s', del:'1.5s', c:'rgba(251,191,36,0.38)',  h:'125px' },
            { l:'90%', dur:'3.4s', del:'0.8s', c:'rgba(236,72,153,0.34)',  h:'105px' },
          ].map((b, i) => (
            <div key={i} class="warp-beam" style={`left:${b.l}; height:${b.h}; background:linear-gradient(to top,${b.c},transparent); animation-duration:${b.dur}; animation-delay:${b.del}; mix-blend-mode:multiply;`} />
          ))}
        </div>

        {/* ── Hero card ── */}
        <div id="hero-card" style="max-width:1200px; margin:0 auto; position:relative; z-index:1; border-radius:24px; overflow:hidden; min-height:520px; display:flex; align-items:center; will-change:transform; transform-origin:center center;">

          {/* Full-bleed photo — scaled up so parallax shift never reveals edges */}
          <div id="hero-bg" style="position:absolute; inset:-8%; background-image:url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bf7f2d26-7889-4678-868d-8cde754846e9_3840w.jpg'); background-size:cover; background-position:center; will-change:transform;"></div>

          {/* Dark scrim — heavier on left for text, softens across the card */}
          <div style="position:absolute; inset:0; background:linear-gradient(105deg, rgba(8,10,14,0.88) 0%, rgba(8,10,14,0.75) 45%, rgba(8,10,14,0.45) 70%, rgba(8,10,14,0.25) 100%); z-index:1;"></div>

          {/* Specular highlight — moves with light source as card tilts */}
          <div id="hero-spec" style="position:absolute; inset:0; z-index:2; pointer-events:none; border-radius:24px; transition:background 0.1s ease;"></div>

          {/* Content */}
          <div id="hero-content-layer" style="position:relative; z-index:3; padding:64px 72px; max-width:640px; will-change:transform;" class="hero-content">

            <h1 style="font-size:clamp(2rem,3.8vw,3.6rem); font-weight:800; letter-spacing:-0.05em; line-height:1.0; color:#ffffff; margin-bottom:14px;">
              Book your CFS slot.<br/>
              <span style="color:#FC6514;">Skip the queue.</span>
            </h1>

            <p style="font-size:15px; color:rgba(255,255,255,0.58); line-height:1.78; margin-bottom:36px; max-width:420px;">
              Instant booking for drivers, forwarders, and depot teams. Scan your QR at the kiosk — straight to the bay.
            </p>

            <div style="display:flex; gap:12px; flex-wrap:wrap;">
              <a href="/book" class="btn-primary" style="padding:13px 28px; font-size:14px;">
                <Icon name={ICONS.calendar} size={15} />
                Book a Visit
                <Icon name={ICONS.arrowRight} size={14} />
              </a>
              <a href="/bookings" style="display:inline-flex; align-items:center; gap:8px; padding:13px 24px; font-size:14px; font-weight:600; color:rgba(255,255,255,0.80); border:1.5px solid rgba(255,255,255,0.22); border-radius:9999px; text-decoration:none; transition:all 0.15s ease;"
                onmouseover="this.style.borderColor='rgba(255,255,255,0.50)'; this.style.color='#fff';"
                onmouseout="this.style.borderColor='rgba(255,255,255,0.22)'; this.style.color='rgba(255,255,255,0.80)';"
              >
                <Icon name={ICONS.search} size={15} />
                Look Up Booking
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §3  HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" class="section-dots" style="padding:96px 24px; background-color:#FFFFFF;">
        <div class="max-w-5xl mx-auto">
          <div class="reveal" style="margin-bottom:56px;">
            <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">How it works</p>
            <h2 style="font-size:clamp(1.8rem,3.2vw,2.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:12px; max-width:500px;">
              From browser to bay door in four steps
            </h2>
            <p style="font-size:14px; color:#78716C; line-height:1.75; max-width:400px;">
              No spreadsheets. No radio calls. The whole process is online.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:2px; background:rgba(0,0,0,0.06); border-radius:20px; overflow:hidden;" class="steps-grid-new">
            {[
              { num:'01', icon:ICONS.users,    title:'Your details',  desc:'Name, service type, cargo category. Under 60 seconds.' },
              { num:'02', icon:ICONS.calendar,  title:'Pick a slot',   desc:'Choose a window — held 10 min while you finish booking.' },
              { num:'03', icon:ICONS.document,  title:'Add shipment',  desc:'Enter HBL or container. ICS clearance is auto-checked.' },
              { num:'04', icon:ICONS.qrCode,    title:'Scan & enter',  desc:'Scan your QR at the kiosk. No counter. No wait.' },
            ].map((step, i) => (
              <div key={step.num} class="reveal" data-reveal-delay={String(i*80)}
                style="background:#FFFFFF; padding:32px 26px; transition:background 0.15s ease;"
                onmouseover="this.style.background='#FFFAF7';"
                onmouseout="this.style.background='#FFFFFF';">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
                  <span style="font-size:12px; font-weight:800; color:rgba(252,101,20,0.35); letter-spacing:0.04em;">{step.num}</span>
                  <div style="width:40px; height:40px; border-radius:11px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.14); display:flex; align-items:center; justify-content:center;">
                    <Icon name={step.icon} size={18} style="color:#FC6514;" />
                  </div>
                </div>
                <p style="font-size:14px; font-weight:700; color:#1C1917; margin-bottom:7px; letter-spacing:-0.02em;">{step.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §4  PLATFORM PREVIEW
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#F7F6F5; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-5xl mx-auto">
          <div style="display:grid; grid-template-columns:1fr 1.7fr; gap:56px; align-items:center;" class="preview-grid">

            <div class="reveal-left">
              <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Operations centre</p>
              <h2 style="font-size:clamp(1.6rem,2.8vw,2.2rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:14px;">
                Everything reception needs in one view
              </h2>
              <p style="font-size:14px; color:#78716C; line-height:1.75; margin-bottom:28px;">
                Live bookings, walk-in queue, ICS hold flags, and gate activity — all updated in real time.
              </p>
              <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:28px;">
                {[
                  { icon:ICONS.userCheck, label:'Live check-in feed',  sub:'See who is on site right now' },
                  { icon:ICONS.warning,   label:'ICS hold alerts',      sub:'Flagged before they reach the gate' },
                  { icon:ICONS.reports,   label:'End-of-day reports',   sub:'PDF export in one click' },
                ].map(item => (
                  <div key={item.label} style="display:flex; align-items:flex-start; gap:11px;">
                    <div style="width:34px; height:34px; border-radius:9px; background:#FFFFFF; border:1px solid rgba(0,0,0,0.09); box-shadow:0 1px 3px rgba(0,0,0,0.04); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;">
                      <Icon name={item.icon} size={15} style="color:#FC6514;" />
                    </div>
                    <div>
                      <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:1px;">{item.label}</p>
                      <p style="font-size:12px; color:#A8A29E;">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/reception" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#FC6514; text-decoration:none; transition:opacity 0.15s ease;"
                onmouseover="this.style.opacity='0.75';" onmouseout="this.style.opacity='1';">
                View Reception Dashboard <Icon name={ICONS.arrowRight} size={13} />
              </a>
            </div>

            {/* Dashboard mockup — light style */}
            <div class="reveal-right" style="border-radius:16px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.10); border:1px solid rgba(0,0,0,0.08);">
              {/* Light title bar */}
              <div style="background:#FFFFFF; border-bottom:1px solid rgba(0,0,0,0.07); padding:11px 16px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:7px;">
                  <div style="display:flex; gap:5px;">
                    <div style="width:10px; height:10px; border-radius:9999px; background:rgba(0,0,0,0.08);" />
                    <div style="width:10px; height:10px; border-radius:9999px; background:rgba(0,0,0,0.06);" />
                    <div style="width:10px; height:10px; border-radius:9999px; background:rgba(0,0,0,0.04);" />
                  </div>
                  <span style="font-size:11px; font-weight:500; color:#A8A29E; margin-left:4px;">Reception · Dashboard</span>
                </div>
                <div style="display:flex; align-items:center; gap:5px;">
                  <span style="width:5px; height:5px; border-radius:9999px; background:#22C55E; animation:pulse-dot 2s ease-in-out infinite;" />
                  <span style="font-size:10px; color:#A8A29E; font-weight:500;">Live</span>
                </div>
              </div>
              {/* KPI row */}
              <div style="background:#F7F6F5; padding:10px; display:grid; grid-template-columns:repeat(4,1fr); gap:6px;">
                {[
                  {label:'Scheduled',val:'24',c:'#1C1917'},{label:'On Site',val:'7',c:'#22C55E'},
                  {label:'Completed',val:'11',c:'#78716C'},{label:'ICS Held',val:'2',c:'#EF4444'},
                ].map(k=>(
                  <div key={k.label} style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:10px; padding:10px 12px;">
                    <p style={`font-size:22px; font-weight:800; color:${k.c}; letter-spacing:-0.04em; line-height:1; margin-bottom:2px;`}>{k.val}</p>
                    <p style="font-size:10px; color:#A8A29E; font-weight:500;">{k.label}</p>
                  </div>
                ))}
              </div>
              {/* Table */}
              <div style="background:#FFFFFF;">
                <div style="display:grid; grid-template-columns:1fr 72px 80px 28px; padding:8px 14px; border-bottom:1px solid rgba(0,0,0,0.06); background:#F7F6F5;">
                  {['Visitor','Slot','Status',''].map(h=>(
                    <span key={h} style="font-size:9.5px; font-weight:700; color:#A8A29E; letter-spacing:0.07em; text-transform:uppercase;">{h}</span>
                  ))}
                </div>
                {[
                  {name:'A. Rahman',  ref:'MSCU·184',time:'08:30',status:'On Site',  sc:'rgba(34,197,94,0.10)',tc:'#16A34A'},
                  {name:'T. Nguyen',  ref:'COSU·456',time:'09:00',status:'Confirmed',sc:'rgba(251,191,36,0.10)',tc:'#B45309'},
                  {name:'J. Smith',   ref:'OOLU·789',time:'09:30',status:'Confirmed',sc:'rgba(251,191,36,0.10)',tc:'#B45309'},
                  {name:'M. Al-Farsi',ref:'MSCU·321',time:'10:00',status:'ICS Hold', sc:'rgba(239,68,68,0.10)', tc:'#DC2626'},
                ].map((row,ri)=>(
                  <div key={ri} style={`display:grid; grid-template-columns:1fr 72px 80px 28px; padding:9px 14px; border-bottom:1px solid rgba(0,0,0,0.05); ${ri===3?'background:rgba(239,68,68,0.025);':''}`}>
                    <div>
                      <p style="font-size:12px; font-weight:500; color:#1C1917;">{row.name}</p>
                      <p style="font-size:9.5px; color:#A8A29E; font-family:ui-monospace,monospace;">{row.ref}</p>
                    </div>
                    <span style="font-size:11px; color:#78716C; align-self:center; font-variant-numeric:tabular-nums;">{row.time}</span>
                    <div style="align-self:center;">
                      <span style={`font-size:10px; font-weight:600; padding:2px 7px; border-radius:9999px; background:${row.sc}; color:${row.tc};`}>{row.status}</span>
                    </div>
                    <div style="align-self:center; display:flex; justify-content:flex-end;">
                      <Icon name={ICONS.arrowRight} size={11} style="color:rgba(0,0,0,0.25);" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §5  WHO IS IT FOR — 3 personas
      ══════════════════════════════════════════════════════════════════ */}
      <section class="section-dots" style="padding:96px 24px; background-color:#FFFFFF; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-5xl mx-auto">
          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Who uses Glido</p>
            <h2 style="font-size:clamp(1.8rem,3.2vw,2.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:12px;">
              Built for everyone in the chain
            </h2>
            <p style="font-size:14px; color:#78716C; max-width:380px; margin:0 auto; line-height:1.75;">
              From the freight forwarder booking a slot to the driver scanning in — everyone benefits.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px;" class="persona-grid" data-stagger data-stagger-ms="90">

            {/* Freight Forwarders — dark navy */}
            <div class="tilt-card" style="background:#192640; border-radius:22px; padding:34px 30px; position:relative; overflow:hidden;">
              <div style="width:44px; height:44px; border-radius:12px; background:rgba(255,255,255,0.10); display:flex; align-items:center; justify-content:center; margin-bottom:22px;">
                <Icon name={ICONS.bookings} size={22} style="color:#fff;" />
              </div>
              <p style="font-size:18px; font-weight:700; color:#fff; letter-spacing:-0.03em; margin-bottom:10px;">Freight Forwarders</p>
              <p style="font-size:13px; color:rgba(255,255,255,0.55); line-height:1.7; margin-bottom:22px;">Book slots on behalf of multiple clients, attach documents, track ICS status — all from one portal.</p>
              <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px;">
                {['Multi-shipment booking','HBL & container lookup','Document upload','Email confirmation'].map((b, bi) => (
                  <li key={b} style="display:flex; align-items:center; gap:11px; font-size:12.5px; color:rgba(255,255,255,0.70);">
                    <span style="flex-shrink:0; width:18px; height:18px; border-radius:5px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); display:inline-flex; align-items:center; justify-content:center; font-size:9px; font-weight:700; color:rgba(255,255,255,0.35); font-variant-numeric:tabular-nums; font-family:ui-monospace,monospace;">
                      {String(bi + 1).padStart(2, '0')}
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Truck Drivers — dark teal */}
            <div class="tilt-card" style="background:#0d3835; border-radius:22px; padding:34px 30px; position:relative; overflow:hidden;">
              <div style="width:44px; height:44px; border-radius:12px; background:rgba(255,255,255,0.10); display:flex; align-items:center; justify-content:center; margin-bottom:22px;">
                <Icon name={ICONS.walkIn} size={22} style="color:#fff;" />
              </div>
              <p style="font-size:18px; font-weight:700; color:#fff; letter-spacing:-0.03em; margin-bottom:10px;">Truck Drivers</p>
              <p style="font-size:13px; color:rgba(255,255,255,0.55); line-height:1.7; margin-bottom:22px;">Arrive at your confirmed window, scan your QR at the kiosk, and go straight to the bay. No queue, no counter.</p>
              <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px;">
                {['QR code check-in','Confirmed arrival window','No account needed','Walk-in fallback'].map((b, bi) => (
                  <li key={b} style="display:flex; align-items:center; gap:11px; font-size:12.5px; color:rgba(255,255,255,0.70);">
                    <span style="flex-shrink:0; width:18px; height:18px; border-radius:5px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); display:inline-flex; align-items:center; justify-content:center; font-size:9px; font-weight:700; color:rgba(255,255,255,0.35); font-variant-numeric:tabular-nums; font-family:ui-monospace,monospace;">
                      {String(bi + 1).padStart(2, '0')}
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Depot Managers — warm dark */}
            <div class="tilt-card" style="background:#260c03; border-radius:22px; padding:34px 30px; position:relative; overflow:hidden;">
              <div style="width:44px; height:44px; border-radius:12px; background:rgba(255,255,255,0.10); display:flex; align-items:center; justify-content:center; margin-bottom:22px;">
                <Icon name={ICONS.home} size={22} style="color:#fff;" />
              </div>
              <p style="font-size:18px; font-weight:700; color:#fff; letter-spacing:-0.03em; margin-bottom:10px;">Depot Managers</p>
              <p style="font-size:13px; color:rgba(255,255,255,0.55); line-height:1.7; margin-bottom:22px;">See every booking, walk-in, and ICS flag in a live dashboard. Run end-of-day reports with one click.</p>
              <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px;">
                {['Real-time live view','ICS hold alerts','Walk-in registration','PDF reports'].map((b, bi) => (
                  <li key={b} style="display:flex; align-items:center; gap:11px; font-size:12.5px; color:rgba(255,255,255,0.70);">
                    <span style="flex-shrink:0; width:18px; height:18px; border-radius:5px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); display:inline-flex; align-items:center; justify-content:center; font-size:9px; font-weight:700; color:rgba(255,255,255,0.35); font-variant-numeric:tabular-nums; font-family:ui-monospace,monospace;">
                      {String(bi + 1).padStart(2, '0')}
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §6  FEATURES BENTO — all-light, no dark card
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#F7F6F5; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-5xl mx-auto">
          <div class="reveal" style="text-align:center; margin-bottom:56px;">
            <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#FC6514; margin-bottom:10px;">Built for the floor</p>
            <h2 style="font-size:clamp(1.8rem,3.2vw,2.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.04em; line-height:1.1; margin-bottom:12px;">
              Purpose-built for Container Freight Stations
            </h2>
            <p style="font-size:14px; color:#78716C; max-width:380px; margin:0 auto; line-height:1.75;">
              Every feature solves a real operational headache.
            </p>
          </div>

          {/* Wide hero feature — ICS check */}
          <div class="reveal bento-hero" style="background:#FFFFFF; border:1px solid rgba(252,101,20,0.20); border-radius:20px; padding:40px 44px; margin-bottom:10px; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(252,101,20,0.06);">
            <div>
              <div style="width:50px; height:50px; border-radius:13px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.20); display:flex; align-items:center; justify-content:center; margin-bottom:22px;">
                <Icon name={ICONS.shield} size={24} style="color:#FC6514;" />
              </div>
              <p style="font-size:18px; font-weight:700; color:#1C1917; letter-spacing:-0.025em; margin-bottom:10px; line-height:1.25;">Automatic ICS clearance check</p>
              <p style="font-size:13px; color:#78716C; line-height:1.75; max-width:320px;">
                Customs status is fetched the moment you enter your shipment number — holds flagged before they reach the gate.
              </p>
            </div>
            <div style="background:#F7F6F5; border-radius:14px; padding:20px 24px; border:1px solid rgba(0,0,0,0.07);">
              {[
                {ref:'MSCU·184729',status:'Cleared',sc:'rgba(34,197,94,0.12)',tc:'#16A34A'},
                {ref:'COSU·037614',status:'Pending',sc:'rgba(251,191,36,0.12)',tc:'#B45309'},
                {ref:'OOLU·295183',status:'ICS Held',sc:'rgba(239,68,68,0.10)',tc:'#DC2626'},
              ].map((row, ri) => (
                <div key={ri} style={`display:flex; align-items:center; justify-content:space-between; padding:10px 0; ${ri < 2 ? 'border-bottom:1px solid rgba(0,0,0,0.06);' : ''}`}>
                  <span style="font-size:12px; font-family:ui-monospace,monospace; font-weight:600; color:#57534E;">{row.ref}</span>
                  <span style={`font-size:11px; font-weight:600; padding:3px 10px; border-radius:9999px; background:${row.sc}; color:${row.tc};`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2+3 grid */}
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;" class="bento-row" data-stagger data-stagger-ms="80">
            {[
              {icon:ICONS.clock,  title:'10-min slot holds',  desc:'Your preferred time is reserved while you complete the booking — zero double-bookings.'},
              {icon:ICONS.qrCode, title:'QR check-in kiosk',  desc:'Scan at arrival. Skip the counter queue entirely. Works on any smartphone.'},
            ].map((feat,i)=>(
              <div key={feat.title}
                style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:30px; transition:border-color 0.15s ease,box-shadow 0.15s ease,transform 0.2s cubic-bezier(0.16,1,0.3,1);"
                onmouseover="this.style.borderColor='rgba(252,101,20,0.25)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.07)';this.style.transform='translateY(-2px)';"
                onmouseout="this.style.borderColor='rgba(0,0,0,0.08)';this.style.boxShadow='none';this.style.transform='';">
                <div style="width:42px; height:42px; border-radius:11px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.14); display:flex; align-items:center; justify-content:center; margin-bottom:18px;">
                  <Icon name={feat.icon} size={19} style="color:#FC6514;" />
                </div>
                <p style="font-size:14px; font-weight:700; color:#1C1917; letter-spacing:-0.02em; margin-bottom:7px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;" class="bento-row" data-stagger data-stagger-ms="70">
            {[
              {icon:ICONS.warning, title:'CHEP pallet alerts',  desc:'Pallet exchange flagged before you leave for the depot.'},
              {icon:ICONS.users,   title:'Agent bookings',      desc:'Freight forwarders book for drivers — no extra account.'},
              {icon:ICONS.reports, title:'Live reception view',  desc:'Staff see bookings, walk-ins, and holds in one screen.'},
            ].map((feat,i)=>(
              <div key={feat.title}
                style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:28px; transition:border-color 0.15s ease,box-shadow 0.15s ease,transform 0.2s cubic-bezier(0.16,1,0.3,1);"
                onmouseover="this.style.borderColor='rgba(252,101,20,0.25)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.07)';this.style.transform='translateY(-2px)';"
                onmouseout="this.style.borderColor='rgba(0,0,0,0.08)';this.style.boxShadow='none';this.style.transform='';">
                <div style="width:40px; height:40px; border-radius:10px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.14); display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
                  <Icon name={feat.icon} size={18} style="color:#FC6514;" />
                </div>
                <p style="font-size:14px; font-weight:700; color:#1C1917; letter-spacing:-0.02em; margin-bottom:6px;">{feat.title}</p>
                <p style="font-size:12.5px; color:#78716C; line-height:1.65;">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §7 TESTIMONIAL — hidden */}

      {/* ══════════════════════════════════════════════════════════════════
          §8  CTA — warm light, not dark
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:100px 24px; background:linear-gradient(180deg,#FFF8F4 0%,#FFF3EC 100%); border-top:1px solid rgba(252,101,20,0.12); position:relative; overflow:hidden;">
        <div style="position:absolute; inset:0; background-image:radial-gradient(rgba(252,101,20,0.07) 1px,transparent 1px); background-size:28px 28px; pointer-events:none;" />
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:300px; background:radial-gradient(ellipse,rgba(252,101,20,0.08) 0%,transparent 68%); pointer-events:none;" />

        <div class="max-w-2xl mx-auto" style="text-align:center; position:relative; z-index:1;">
          <div class="reveal" style="display:inline-flex; align-items:center; gap:7px; padding:5px 14px; border-radius:9999px; background:rgba(34,197,94,0.09); border:1px solid rgba(34,197,94,0.22); margin-bottom:28px;">
            <span style="width:6px; height:6px; border-radius:9999px; background:#22C55E; animation:pulse-dot 2s ease-in-out infinite;" />
            <span style="font-size:11px; font-weight:600; color:#16A34A;">Accepting bookings now</span>
          </div>

          <h2 class="reveal" data-reveal-delay="80"
            style="font-size:clamp(2.2rem,4.8vw,3.5rem); font-weight:800; color:#1C1917; letter-spacing:-0.045em; line-height:1.05; margin-bottom:16px;">
            Ready to skip<br/>the queue?
          </h2>

          <p class="reveal" data-reveal-delay="130"
            style="font-size:15px; color:#78716C; line-height:1.8; margin-bottom:36px; max-width:360px; margin-left:auto; margin-right:auto;">
            Your first booking takes under 3 minutes. No account, no calls, no paper.
          </p>

          <div class="reveal" data-reveal-delay="180" style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <a href="/book" class="btn-primary" style="padding:14px 32px; font-size:14px;">
              <Icon name={ICONS.calendar} size={15} />
              Book a Visit
              <Icon name={ICONS.arrowRight} size={14} />
            </a>
            <a href="/bookings" class="btn-ghost" style="padding:14px 26px; font-size:14px;">
              <Icon name={ICONS.search} size={15} />
              Look Up Booking
            </a>
          </div>

          <p class="reveal" data-reveal-delay="230" style="font-size:12px; color:#A8A29E; margin-top:28px;">
            Sydney Container Freight Station · ABN 12 345 678 901
          </p>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width:960px){
          .preview-grid{grid-template-columns:1fr!important;}
          .steps-grid-new{grid-template-columns:repeat(2,1fr)!important;}
          .bento-row,.persona-grid{grid-template-columns:1fr!important;}
          .bento-hero{grid-template-columns:1fr!important;}
        }
        @media (max-width:640px){
          .steps-grid-new{grid-template-columns:1fr!important;}
        }
      `}</style>

    </LandingLayout>
  )
})

// ─── Login ───────────────────────────────────────────────────────────────────
portalRoutes.get('/login', async (c) => {
  // Redirect already-logged-in users
  const existingUser = await getSessionUser(c)
  if (existingUser) {
    return isReceptionRole(existingUser.role) ? c.redirect('/reception') : c.redirect('/dashboard')
  }
  const next     = c.req.query('next') || ''
  const error    = c.req.query('error') || ''
  const verified = c.req.query('verified') || ''
  return c.html(
    <PublicLayout title="Sign In" plain>
      <div style="min-height:calc(100vh - 56px - 64px); display:flex; align-items:center; justify-content:center; padding:40px 24px; background:linear-gradient(160deg,#FAFAF9 0%,#F7F6F5 100%);">

        {/* Decorative dot grid */}
        <div style="position:fixed; inset:0; background-image:radial-gradient(rgba(0,0,0,0.05) 1px,transparent 1px); background-size:28px 28px; pointer-events:none; z-index:0;" />

        <div style="position:relative; z-index:1; width:100%; max-width:400px;">

          {/* Card */}
          <div x-data="{ role: 'staff' }" style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:24px; padding:44px 40px; box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.09);">

            {/* Logo / heading */}
            <div style="text-align:center; margin-bottom:36px;">
              <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 14px rgba(252,101,20,0.38);">
                <Icon name={ICONS.users} size={24} style="color:#fff;" />
              </div>
              <h1 style="font-size:20px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:6px;">Sign in to Glido</h1>
              <p style="font-size:13px; color:#78716C; line-height:1.6;">Access the reception dashboard or your visitor account.</p>
            </div>

            {/* Error / verified banners */}
            {error === 'invalid' && (
              <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.22); border-radius:10px; padding:10px 14px; margin-bottom:20px; font-size:12.5px; color:#DC2626; text-align:center;">
                Incorrect email or password. Please try again.
              </div>
            )}
            {error === 'missing' && (
              <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.22); border-radius:10px; padding:10px 14px; margin-bottom:20px; font-size:12.5px; color:#DC2626; text-align:center;">
                Please enter your email and password.
              </div>
            )}
            {verified === 'pending' && (
              <div style="background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.22); border-radius:10px; padding:10px 14px; margin-bottom:20px; font-size:12.5px; color:#16A34A; text-align:center;">
                Account created! Check your email to verify, then sign in.
              </div>
            )}

            {/* Role selector */}
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:28px;">
              <button type="button"
                x-on:click="role = 'staff'"
                style="padding:11px 8px; font-size:12.5px; font-weight:600; border-radius:10px; cursor:pointer; border:1.5px solid rgba(0,0,0,0.10); transition:all 0.15s ease; text-align:center;"
                x-bind:style="role === 'staff' ? 'background:rgba(252,101,20,0.08); border-color:rgba(252,101,20,0.35); color:#FC6514;' : 'background:transparent; border-color:rgba(0,0,0,0.10); color:#78716C;'"
              >
                <div style="margin-bottom:6px; display:flex; justify-content:center;">
                  <Icon name="solar:buildings-bold-duotone" size={22} style="color:inherit;" />
                </div>
                Reception Staff
              </button>
              <button type="button"
                x-on:click="role = 'visitor'"
                style="padding:11px 8px; font-size:12.5px; font-weight:600; border-radius:10px; cursor:pointer; border:1.5px solid rgba(0,0,0,0.10); transition:all 0.15s ease; text-align:center;"
                x-bind:style="role === 'visitor' ? 'background:rgba(252,101,20,0.08); border-color:rgba(252,101,20,0.35); color:#FC6514;' : 'background:transparent; border-color:rgba(0,0,0,0.10); color:#78716C;'"
              >
                <div style="margin-bottom:6px; display:flex; justify-content:center;">
                  <Icon name={ICONS.truck} size={22} style="color:inherit;" />
                </div>
                Visitor / Driver
              </button>
            </div>

            {/* ── Staff login form ── */}
            <div x-show="role === 'staff'" x-cloak>
              <form method="post" action="/login" style="display:flex; flex-direction:column; gap:16px;">
                <input type="hidden" name="role" value="staff" />
                {next && <input type="hidden" name="next" value={next} />}
                <div>
                  <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">Email</label>
                  <input type="email" name="email" placeholder="you@cfs.com.au" required
                    style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                    onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                    onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
                  />
                </div>
                <div>
                  <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">Password</label>
                  <input type="password" name="password" placeholder="••••••••" required
                    style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                    onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                    onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
                  />
                </div>
                <button type="submit" class="btn-primary" style="width:100%; padding:13px 20px; font-size:14px; border:none; cursor:pointer; justify-content:center;">
                  Sign in to Reception
                  <Icon name={ICONS.arrowRight} size={14} />
                </button>
              </form>
              <p style="text-align:center; font-size:12px; color:#A8A29E; margin-top:16px;">
                <a href="/forgot-password" style="color:#FC6514; text-decoration:none; font-weight:500;">Forgot your password?</a>
              </p>
            </div>

            {/* ── Visitor login / options ── */}
            <div x-show="role === 'visitor'" x-cloak>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="/book" class="btn-primary" style="padding:13px 20px; font-size:14px; border:none; cursor:pointer; justify-content:center; text-align:center;">
                  <Icon name={ICONS.calendar} size={14} />
                  Book a New Visit
                  <Icon name={ICONS.arrowRight} size={14} />
                </a>
                <a href="/bookings" class="btn-ghost" style="padding:12px 20px; font-size:14px; cursor:pointer; justify-content:center; text-align:center;">
                  <Icon name={ICONS.search} size={14} />
                  Look Up My Booking
                </a>
              </div>
              <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,0,0,0.07);">
                <p style="font-size:12px; color:#A8A29E; text-align:center; line-height:1.6;">
                  No account needed to book a visit.<br />
                  <a href="/signup" style="color:#FC6514; text-decoration:none; font-weight:500;">Create an account</a> to save your booking history.
                </p>
              </div>
            </div>

          </div>

          {/* Back link */}
          <p style="text-align:center; margin-top:20px; font-size:12px; color:#A8A29E;">
            <a href="/" style="color:#78716C; text-decoration:none; font-weight:500; transition:color 0.15s ease;"
              onmouseover="this.style.color='#1C1917'" onmouseout="this.style.color='#78716C'"
            >
              ← Back to home
            </a>
          </p>
        </div>
      </div>
    </PublicLayout>
  )
})

// ─── Login POST ───────────────────────────────────────────────────────────────
portalRoutes.post('/login', async (c) => {
  const body = await c.req.parseBody()
  const email    = String(body.email    ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  const next     = String(body.next     ?? '')

  if (!email || !password) return c.redirect('/login?error=missing')

  let session: any, authUser: any
  try {
    const result = await signInWithPassword(email, password)
    session  = result.session
    authUser = result.user
  } catch (err) {
    console.error('[login] signInWithPassword failed:', err)
    return c.redirect('/login?error=invalid')
  }

  if (!session || !authUser) return c.redirect('/login?error=invalid')

  // Cookie is set before any DB lookup — auth is confirmed at this point
  setSessionCookie(c, session.access_token)

  // Role lookup is best-effort: failure must never block the redirect
  let role = 'visitor_registered'
  try {
    const { supabaseAdmin } = await import('../lib/supabase')
    const { data: userRow } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', authUser.id)
      .maybeSingle()
    if (userRow?.role) role = userRow.role
  } catch (err) {
    console.warn('[login] users table lookup failed (non-fatal):', err)
  }

  if (isReceptionRole(role)) return c.redirect('/reception')
  if (next) return c.redirect(decodeURIComponent(next))
  return c.redirect('/dashboard')
})

// ─── Sign-up GET ─────────────────────────────────────────────────────────────
portalRoutes.get('/signup', (c) => {
  const error = c.req.query('error')
  return c.html(
    <PublicLayout title="Create Account" plain>
      <div style="min-height:calc(100vh - 56px - 64px); display:flex; align-items:center; justify-content:center; padding:40px 24px; background:linear-gradient(160deg,#FAFAF9 0%,#F7F6F5 100%);">
        <div style="position:fixed; inset:0; background-image:radial-gradient(rgba(0,0,0,0.05) 1px,transparent 1px); background-size:28px 28px; pointer-events:none; z-index:0;" />
        <div style="position:relative; z-index:1; width:100%; max-width:420px;">
          <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:24px; padding:44px 40px; box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.09);">
            <div style="text-align:center; margin-bottom:32px;">
              <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 14px rgba(252,101,20,0.38);">
                <Icon name={ICONS.users} size={24} style="color:#fff;" />
              </div>
              <h1 style="font-size:20px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:6px;">Create an account</h1>
              <p style="font-size:13px; color:#78716C; line-height:1.6;">Save your booking history and get reminders.</p>
            </div>

            {error && (
              <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.22); border-radius:10px; padding:10px 14px; margin-bottom:20px; font-size:12.5px; color:#DC2626;">
                {error === 'exists' ? 'An account with that email already exists.' : 'Registration failed. Please try again.'}
              </div>
            )}

            <form method="post" action="/signup" style="display:flex; flex-direction:column; gap:14px;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div>
                  <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">First Name</label>
                  <input type="text" name="first_name" required placeholder="Raj"
                    style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                    onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                    onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
                </div>
                <div>
                  <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">Last Name</label>
                  <input type="text" name="last_name" required placeholder="Sharma"
                    style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                    onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                    onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
                </div>
              </div>
              <div>
                <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">Email</label>
                <input type="email" name="email" required placeholder="raj@example.com"
                  style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                  onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                  onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
              </div>
              <div>
                <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">Phone (optional)</label>
                <input type="tel" name="phone" placeholder="+61 4XX XXX XXX"
                  style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                  onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                  onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
              </div>
              <div>
                <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">Password</label>
                <input type="password" name="password" required placeholder="Min 8 characters"
                  style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                  onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                  onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
              </div>
              <button type="submit" class="btn-primary" style="width:100%; padding:13px 20px; font-size:14px; border:none; cursor:pointer; justify-content:center; margin-top:4px;">
                Create Account
                <Icon name={ICONS.arrowRight} size={14} />
              </button>
            </form>
            <p style="text-align:center; font-size:12px; color:#A8A29E; margin-top:16px;">
              Already have an account? <a href="/login" style="color:#FC6514; text-decoration:none; font-weight:500;">Sign in</a>
            </p>
          </div>
          <p style="text-align:center; margin-top:20px; font-size:12px; color:#A8A29E;">
            <a href="/" style="color:#78716C; text-decoration:none; font-weight:500;" onmouseover="this.style.color='#1C1917'" onmouseout="this.style.color='#78716C'">← Back to home</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  )
})

// ─── Sign-up POST ─────────────────────────────────────────────────────────────
portalRoutes.post('/signup', async (c) => {
  const body = await c.req.parseBody()
  const email     = String(body.email      ?? '').trim().toLowerCase()
  const password  = String(body.password   ?? '')
  const firstName = String(body.first_name ?? '').trim()
  const lastName  = String(body.last_name  ?? '').trim()
  const phone     = String(body.phone      ?? '').trim() || undefined

  if (!email || !password || !firstName || !lastName) return c.redirect('/signup?error=missing')

  try {
    const { session } = await signUpVisitor({ email, password, firstName, lastName, phone })
    if (session) {
      setSessionCookie(c, session.access_token)
      return c.redirect('/dashboard')
    }
    // Supabase may require email confirmation — redirect to login with a note
    return c.redirect('/login?verified=pending')
  } catch (err: any) {
    const code = err?.message?.includes('already registered') ? 'exists' : 'failed'
    return c.redirect(`/signup?error=${code}`)
  }
})

// ─── Forgot Password GET ──────────────────────────────────────────────────────
portalRoutes.get('/forgot-password', (c) => {
  const sent = c.req.query('sent')
  return c.html(
    <PublicLayout title="Forgot Password" plain>
      <div style="min-height:calc(100vh - 56px - 64px); display:flex; align-items:center; justify-content:center; padding:40px 24px; background:linear-gradient(160deg,#FAFAF9 0%,#F7F6F5 100%);">
        <div style="position:fixed; inset:0; background-image:radial-gradient(rgba(0,0,0,0.05) 1px,transparent 1px); background-size:28px 28px; pointer-events:none; z-index:0;" />
        <div style="position:relative; z-index:1; width:100%; max-width:400px;">
          <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:24px; padding:44px 40px; box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.09);">
            <div style="text-align:center; margin-bottom:32px;">
              <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 14px rgba(252,101,20,0.38);">
                <Icon name={ICONS.users} size={24} style="color:#fff;" />
              </div>
              <h1 style="font-size:20px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:6px;">Reset your password</h1>
              <p style="font-size:13px; color:#78716C; line-height:1.6;">Enter your email and we'll send you a reset link.</p>
            </div>
            {sent === '1' ? (
              <div style="background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.22); border-radius:10px; padding:14px 16px; font-size:13px; color:#16A34A; text-align:center; line-height:1.5;">
                Check your inbox — a password reset link is on its way. It may take a minute or two.
              </div>
            ) : (
              <form method="post" action="/forgot-password" style="display:flex; flex-direction:column; gap:16px;">
                <div>
                  <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;">Email Address</label>
                  <input type="email" name="email" required placeholder="you@example.com"
                    style="width:100%; padding:11px 14px; font-size:14px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; box-sizing:border-box; transition:border-color 0.15s ease, box-shadow 0.15s ease;"
                    onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                    onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
                </div>
                <button type="submit" class="btn-primary" style="width:100%; padding:13px 20px; font-size:14px; border:none; cursor:pointer; justify-content:center;">
                  Send Reset Link
                  <Icon name={ICONS.arrowRight} size={14} />
                </button>
              </form>
            )}
            <p style="text-align:center; font-size:12px; color:#A8A29E; margin-top:20px;">
              <a href="/login" style="color:#FC6514; text-decoration:none; font-weight:500;">← Back to sign in</a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
})

// ─── Forgot Password POST ─────────────────────────────────────────────────────
portalRoutes.post('/forgot-password', async (c) => {
  const body = await c.req.parseBody()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (email) {
    const { supabase } = await import('../lib/supabase')
    // Fire and forget — always redirect so we don't leak whether email exists
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.header('origin') ?? 'https://glido.com'}/reset-password`,
    }).catch(console.error)
  }
  return c.redirect('/forgot-password?sent=1')
})

// ─── Reset Password GET ───────────────────────────────────────────────────────
portalRoutes.get('/reset-password', (c) => {
  return c.html(
    <PublicLayout title="Reset Password" plain>
      <div style="min-height:calc(100vh - 56px - 64px); display:flex; align-items:center; justify-content:center; padding:40px 24px; background:linear-gradient(160deg,#FAFAF9 0%,#F7F6F5 100%);">
        <div style="position:fixed; inset:0; background-image:radial-gradient(rgba(0,0,0,0.05) 1px,transparent 1px); background-size:28px 28px; pointer-events:none; z-index:0;" />
        <div style="position:relative; z-index:1; width:100%; max-width:400px;">
          <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:24px; padding:44px 40px; box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.09);">
            <div style="text-align:center; margin-bottom:32px;">
              <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,#FF7A2A 0%,#E85A0A 100%); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 14px rgba(252,101,20,0.38);">
                <Icon name={ICONS.users} size={24} style="color:#fff;" />
              </div>
              <h1 style="font-size:20px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:6px;">Set a new password</h1>
              <p style="font-size:13px; color:#78716C; line-height:1.6;">This link was sent to your email. Choose a new password below.</p>
            </div>
            <div style="background:rgba(252,101,20,0.08); border:1px solid rgba(252,101,20,0.22); border-radius:10px; padding:14px 16px; font-size:13px; color:#FC6514; text-align:center; line-height:1.5;">
              Password reset via email link is handled by Supabase Auth. Use the link in your email to set a new password through the Supabase-hosted reset page.
            </div>
            <p style="text-align:center; font-size:12px; color:#A8A29E; margin-top:20px;">
              <a href="/login" style="color:#FC6514; text-decoration:none; font-weight:500;">← Back to sign in</a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
})

// ─── Visitor Dashboard ────────────────────────────────────────────────────────
portalRoutes.get('/dashboard', async (c) => {
  const user = await getSessionUser(c)
  if (!user) return c.redirect('/login?next=%2Fdashboard')

  // Fetch this visitor's bookings
  const allBookings = await getBookingsByUserId(user.id).catch(() => [] as any[])
  const today = new Date().toISOString().split('T')[0]
  const upcoming = allBookings.filter((b: any) =>
    b.slotDate >= today && b.status !== 'cancelled' && b.status !== 'completed'
  )
  const past = allBookings.filter((b: any) =>
    b.slotDate < today || b.status === 'completed' || b.status === 'cancelled'
  )

  return c.html(
    <PublicLayout title="My Dashboard" plain user={user}>
      <VisitorDashboard user={user} upcoming={upcoming} past={past} />
    </PublicLayout>
  )
})

// ─── Logout ───────────────────────────────────────────────────────────────────
portalRoutes.get('/logout', (c) => {
  clearSessionCookie(c)
  return c.redirect('/')
})

// ─── Booking wizard ─────────────────────────────────────────────────────────
portalRoutes.get('/book', (c) => {
  return c.html(
    <PublicLayout title="Book a Visit" plain path="/book">
      <BookingWizard />
    </PublicLayout>
  )
})

// ─── My Bookings ─────────────────────────────────────────────────────────────
portalRoutes.get('/bookings', async (c) => {
  const ref  = c.req.query('ref')?.trim().toUpperCase()
  const user = await getSessionUser(c)

  // If no search ref and not logged in, show login prompt
  if (!ref && !user) {
    return c.html(
      <PublicLayout title="My Bookings">
        <div style="min-height:calc(100vh - 120px); display:flex; align-items:center; justify-content:center; padding:40px 24px;">
          <div style="max-width:440px; width:100%; text-align:center;">
            <div style="width:52px; height:52px; border-radius:14px; background:#FFF3EC; border:1px solid rgba(252,101,20,0.18); display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
              <Icon name={ICONS.bookings} size={24} style="color:#FC6514;" />
            </div>
            <h1 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:8px;">Sign in to view your bookings</h1>
            <p style="font-size:14px; color:#78716C; line-height:1.65; margin-bottom:28px; max-width:320px; margin-left:auto; margin-right:auto;">
              Log in to see your full booking history, or search by reference number below.
            </p>
            <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:32px;">
              <a href="/login" class="btn-primary" style="padding:13px 24px; font-size:14px; justify-content:center;">
                <Icon name={ICONS.user} size={15} />
                Sign In
                <Icon name={ICONS.arrowRight} size={14} />
              </a>
              <a href="/book" class="btn-ghost" style="padding:12px 24px; font-size:14px; justify-content:center;">
                <Icon name={ICONS.calendar} size={14} />
                Book a New Visit
              </a>
            </div>
            <div style="border-top:1px solid rgba(0,0,0,0.07); padding-top:24px;">
              <p style="font-size:12px; color:#A8A29E; margin-bottom:12px;">Have a reference number? Look it up directly:</p>
              <form method="get" action="/bookings" style="display:flex; gap:8px;">
                <input
                  type="text"
                  name="ref"
                  placeholder="GLD-2026-10142"
                  class="wizard-field"
                  style="flex:1; padding:10px 14px; font-size:13px; border-radius:10px; outline:none; box-sizing:border-box; font-family:inherit;"
                  onfocus="this.style.borderColor='rgba(252,101,20,0.50)';"
                  onblur="this.style.borderColor='rgba(0,0,0,0.12)';"
                />
                <button type="submit" class="btn-primary" style="padding:10px 18px; font-size:13px; border:none; cursor:pointer; white-space:nowrap;">
                  <Icon name={ICONS.search} size={14} />
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  let bookings: any[] = []
  let heading = 'My Bookings'

  if (ref) {
    const found = await getBookingByRef(ref).catch(() => null)
    bookings = found ? [found] : []
    heading  = `Results for "${ref}"`
  } else if (user) {
    bookings = await getBookingsByUserId(user.id).catch(() => [])
  }

  return c.html(
    <PublicLayout title="My Bookings" plain user={user}>
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

// ─── Visitor booking detail page ─────────────────────────────────────────────
portalRoutes.get('/bookings/:ref', async (c) => {
  const ref     = c.req.param('ref').toUpperCase()
  const booking = await getBookingByRef(ref).catch(() => null)
  if (!booking) {
    return c.html(
      <PublicLayout title="Booking Not Found">
        <div style="padding:64px 24px; text-align:center;">
          <div style="display:flex; justify-content:center; margin-bottom:12px;"><Icon name={ICONS.search} size={48} style="color:#A8A29E;" /></div>
          <h1 style="font-size:22px; font-weight:700; color:#1C1917; margin-bottom:8px;">Booking Not Found</h1>
          <p style="font-size:14px; color:#78716C; margin-bottom:24px;">We couldn't find a booking with reference <strong>{ref}</strong>.</p>
          <a href="/bookings" class="btn-primary" style="display:inline-flex; align-items:center; gap:8px; padding:11px 24px; text-decoration:none;">← Search Bookings</a>
        </div>
      </PublicLayout>
    )
  }

  const qrDataUrl = await generateQRDataURL(booking.referenceNumber).catch(() => '')

  const STATUS_COLOR: Record<string, string> = {
    scheduled:  '#2563EB',
    checked_in: '#16A34A',
    completed:  '#78716C',
    cancelled:  '#DC2626',
    held:       '#D97706',
  }
  const statusColor = STATUS_COLOR[booking.status] ?? '#78716C'

  const SERVICE_NAMES: Record<string, string> = { pickup: 'Pick Up', dropoff: 'Drop Off' }
  const LOAD_NAMES: Record<string, string>    = { lcl: 'LCL', fcl: 'FCL' }

  return c.html(
    <PublicLayout title={`Booking ${booking.referenceNumber}`}>
      <div style="padding:40px 24px 80px;">
        <div style="max-width:560px; margin:0 auto;">

          {/* Back */}
          <a href="/bookings" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#78716C; text-decoration:none; margin-bottom:24px; transition:color 0.15s ease;"
            onmouseover="this.style.color='#1C1917'" onmouseout="this.style.color='#78716C'">
            ← Back to Bookings
          </a>

          {/* Header card */}
          <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:20px; padding:28px; margin-bottom:16px; position:relative; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07);">
            <div style="position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:9999px; background:rgba(252,101,20,0.06); pointer-events:none;"></div>
            <div style="position:absolute; bottom:-60px; right:20px; width:120px; height:120px; border-radius:9999px; background:rgba(252,101,20,0.04); pointer-events:none;"></div>

            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap;">
              <div>
                <p style="font-size:10px; font-weight:700; color:#A8A29E; letter-spacing:0.10em; text-transform:uppercase; margin-bottom:8px;">Booking Reference</p>
                <p style="font-family:ui-monospace,monospace; font-size:22px; font-weight:800; color:#FC6514; letter-spacing:-0.01em; margin-bottom:12px;">{booking.referenceNumber}</p>
                <span style={`display:inline-flex; align-items:center; padding:4px 12px; border-radius:9999px; font-size:12px; font-weight:600; background:${statusColor}18; color:${statusColor}; border:1px solid ${statusColor}38;`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                </span>
              </div>
              {qrDataUrl && (
                <div style="background:#F7F6F5; border:1px solid rgba(0,0,0,0.08); border-radius:12px; padding:10px; flex-shrink:0;">
                  <img src={qrDataUrl} alt="QR Code" width="96" height="96" style="display:block;" />
                  <p style="font-size:9px; color:#78716C; text-align:center; margin-top:4px; font-weight:500;">Show at kiosk</p>
                </div>
              )}
            </div>
          </div>

          {/* Details card */}
          <div style="background:#fff; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:24px; margin-bottom:16px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);">
            <p style="font-size:10px; font-weight:700; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:16px;">Slot Details</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              {[
                { label: 'Date',     value: booking.slotDate },
                { label: 'Time',     value: `${booking.slotStartTime} – ${booking.slotEndTime}` },
                { label: 'Service',  value: SERVICE_NAMES[booking.serviceType] ?? booking.serviceType },
                { label: 'Load',     value: LOAD_NAMES[booking.loadType] ?? booking.loadType },
                ...(booking.houseBillNumber  ? [{ label: 'HBL',       value: booking.houseBillNumber  }] : []),
                ...(booking.containerNumber  ? [{ label: 'Container',  value: booking.containerNumber  }] : []),
                ...(booking.driverName       ? [{ label: 'Driver',     value: booking.driverName       }] : []),
                ...(booking.driverPhone      ? [{ label: 'Phone',      value: booking.driverPhone      }] : []),
              ].map(row => (
                <div key={row.label}>
                  <p style="font-size:10px; font-weight:600; color:#A8A29E; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:4px;">{row.label}</p>
                  <p style="font-size:14px; font-weight:600; color:#1C1917; font-family:${row.label === 'HBL' || row.label === 'Container' ? 'ui-monospace,monospace' : 'inherit'};">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Charges card */}
          {booking.totalAmount && (
            <div style="background:#fff; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:24px; margin-bottom:16px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);">
              <p style="font-size:10px; font-weight:700; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:16px;">Charges</p>
              <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
                {booking.storageCharge !== undefined && booking.storageCharge > 0 && (
                  <div style="display:flex; justify-content:space-between; color:#78716C;">
                    <span>Storage ({booking.storageDays} days)</span><span>${booking.storageCharge.toFixed(2)}</span>
                  </div>
                )}
                {booking.shrinkWrapCharge !== undefined && booking.shrinkWrapCharge > 0 && (
                  <div style="display:flex; justify-content:space-between; color:#78716C;">
                    <span>Shrink wrap</span><span>${booking.shrinkWrapCharge.toFixed(2)}</span>
                  </div>
                )}
                {booking.slotFee !== undefined && (
                  <div style="display:flex; justify-content:space-between; color:#78716C;">
                    <span>Slot fee</span><span>${booking.slotFee.toFixed(2)}</span>
                  </div>
                )}
                <div style="display:flex; justify-content:space-between; font-weight:700; color:#1C1917; padding-top:8px; border-top:1px solid rgba(0,0,0,0.08);">
                  <span>Total</span><span style="color:#FC6514;">${booking.totalAmount.toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; color:#A8A29E;">
                  <span>{(booking.paymentMethod ?? '—').toUpperCase()}</span>
                  <span style={booking.paymentStatus === 'paid' ? 'color:#22C55E;font-weight:500;' : 'color:#FBBF24;font-weight:500;'}>
                    {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'pending_eft' ? 'EFT Pending' : booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Completion notes if done */}
          {booking.completionNotes && (
            <div style="background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.18); border-radius:12px; padding:16px; margin-bottom:16px;">
              <p style="font-size:11px; font-weight:700; color:#16A34A; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:6px;">Completion Notes</p>
              <p style="font-size:13px; color:#1C1917; line-height:1.6;">{booking.completionNotes}</p>
            </div>
          )}

          {/* Cancel action */}
          {booking.status === 'scheduled' && (
            <div x-data="{ cancelModal: false }" style="position:relative;">
              <button
                type="button"
                style="width:100%; padding:12px; font-size:13px; font-weight:500; color:#DC2626; background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.22); border-radius:12px; cursor:pointer; transition:all 0.15s ease;"
                x-on:click="cancelModal = true"
                onmouseover="this.style.background='rgba(239,68,68,0.10)'"
                onmouseout="this.style.background='rgba(239,68,68,0.06)'"
              >
                Cancel this Booking
              </button>
              <div
                style="position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(0,0,0,0.55); backdrop-filter:blur(4px);"
                x-show="cancelModal"
                x-cloak
              >
                <div style="background:#fff; border-radius:16px; box-shadow:0 24px 64px rgba(0,0,0,0.18); max-width:360px; width:100%; padding:24px;">
                  <h3 style="font-size:17px; font-weight:700; color:#1C1917; margin-bottom:8px;">Cancel booking?</h3>
                  <p style="font-size:13px; color:#78716C; line-height:1.55; margin-bottom:20px;">
                    You are about to cancel <strong style="font-family:ui-monospace,monospace; color:#FC6514;">{booking.referenceNumber}</strong>. This cannot be undone.
                  </p>
                  <div style="display:flex; gap:10px;">
                    <button type="button" x-on:click="cancelModal=false"
                      style="flex:1; padding:10px 16px; font-size:13px; font-weight:500; background:#EBEBEA; border:none; border-radius:10px; cursor:pointer; color:#1C1917;">
                      Keep Booking
                    </button>
                    <form method="post" action={`/bookings/${booking.referenceNumber}/cancel`} style="flex:1;">
                      <button type="submit"
                        style="width:100%; padding:10px 16px; font-size:13px; font-weight:600; background:rgba(239,68,68,0.10); border:1px solid rgba(239,68,68,0.28); border-radius:10px; cursor:pointer; color:#DC2626;">
                        Confirm Cancel
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </PublicLayout>
  )
})

// ─── Visitor booking cancel ───────────────────────────────────────────────────
portalRoutes.post('/bookings/:ref/cancel', async (c) => {
  const user = await getSessionUser(c)
  if (!user) return c.redirect('/login?next=%2Fdashboard')

  const ref = c.req.param('ref').toUpperCase()
  const booking = await getBookingByRef(ref).catch(() => null)
  if (!booking) return c.redirect('/dashboard')

  // Only allow cancellation of future scheduled bookings owned by this user
  const today = new Date().toISOString().split('T')[0]
  const isOwner = (booking as any).userId === user.id || (booking as any).user_id === user.id
  const isCancellable = booking.status === 'scheduled' && booking.slotDate >= today

  if (isCancellable) {
    await cancelBooking(booking.id).catch(console.error)
  }

  return c.redirect('/dashboard')
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

    // ICS status — live check if CargoWise configured, else use cached value
    let icsStatus = 'unavailable'
    if (shipment) {
      const ics = await checkIcsStatus({
        shipmentId:      shipment.id,
        hbl:             shipment.hbl,
        containerNumber: shipment.containerNumber,
        cachedStatus:    shipment.icsStatus,
        apiUrl:          tenant.cargowise_api_url,
        apiKey:          tenant.cargowise_api_key,
      })
      icsStatus = ics.status
    }

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
      icsStatus,
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
  let body: any
  try {
    body = await c.req.json()
  } catch (parseErr) {
    console.error('[portal] POST /bookings — failed to parse JSON body:', parseErr)
    return c.json({ error: 'Invalid request body — expected JSON.' }, 400)
  }

  console.log('[portal] POST /bookings — body keys:', Object.keys(body))
  console.log('[portal] POST /bookings — slotDate:', body.slotDate, 'slotStartTime:', body.slotStartTime)

  // Attach user_id if visitor is logged in
  const sessionUser = await getSessionUser(c).catch(() => null)

  try {
    const booking = await createBooking({
      serviceType:      body.serviceType || 'pickup',
      loadType:         body.loadType    || 'lcl',
      slotDate:         body.slotDate,
      slotStartTime:    body.slotStartTime,
      slotEndTime:      body.slotEndTime,
      driverName:       body.driverName  || 'Guest',
      driverPhone:      body.driverPhone  || undefined,
      guestName:        body.guestName   || undefined,
      guestPhone:       body.guestPhone  || undefined,
      houseBillNumber:  body.houseBillNumber  || undefined,
      containerNumber:  body.containerNumber  || undefined,
      weightKg:         body.weightKg    != null ? Number(body.weightKg)    : undefined,
      volumeCbm:        body.volumeCbm   != null ? Number(body.volumeCbm)   : undefined,
      packageCount:     body.packageCount != null ? Number(body.packageCount) : undefined,
      palletCount:      body.palletCount  != null ? Number(body.palletCount)  : undefined,
      palletType:       body.palletType  || undefined,
      storageStartDate: body.storageStartDate || undefined,
      storageDays:      body.storageDays  != null ? Number(body.storageDays)  : undefined,
      storageCharge:    body.storageCharge    != null ? Number(body.storageCharge)    : undefined,
      shrinkWrapCharge: body.shrinkWrapCharge != null ? Number(body.shrinkWrapCharge) : undefined,
      slotFee:          body.slotFee      != null ? Number(body.slotFee)      : undefined,
      subtotal:         body.subtotal     != null ? Number(body.subtotal)     : undefined,
      gstAmount:        body.gstAmount    != null ? Number(body.gstAmount)    : undefined,
      totalAmount:      body.totalAmount  != null ? Number(body.totalAmount)  : undefined,
      paymentMethod:    body.paymentMethod || 'card',
      paymentStatus:    body.paymentStatus || 'pending',
      tenantId:         DEFAULT_TENANT_ID,
      userId:           sessionUser?.id ?? undefined,
    })
    // ── Fire transactional emails (non-blocking) ──────────────────────────────
    const emailAddress = body.guestEmail || body.driverEmail || undefined
    const tenant = await getTenant(DEFAULT_TENANT_ID).catch(() => null)
    const qrDataUrl = await generateQRDataURL(booking.referenceNumber, 160).catch(() => '')

    if (emailAddress) {
      // 1. Booking confirmation
      sendBookingConfirmation({
        to:            emailAddress,
        booking,
        tenantName:    tenant?.name    ?? 'Glido CFS',
        tenantAddress: tenant?.address ?? undefined,
        qrDataUrl,
      }).catch(err => console.error('[email] confirmation failed:', err))

      // 2. EFT reminder if payment method is EFT
      if (booking.paymentMethod === 'eft' && tenant) {
        sendEftReminder({
          to:            emailAddress,
          booking,
          bankName:      tenant.eft_bank_name      ?? '',
          bsb:           tenant.eft_bsb             ?? '',
          accountNumber: tenant.eft_account_number  ?? '',
          accountName:   tenant.eft_account_name    ?? '',
        }).catch(err => console.error('[email] EFT reminder failed:', err))
      }
    }

    // 3. ICS held alert to reception admin
    if (booking.icsStatus === 'held' && tenant?.contact_email) {
      sendIcsHoldAlert({
        to:         tenant.contact_email,
        booking,
        tenantName: tenant.name,
      }).catch(err => console.error('[email] ICS alert failed:', err))
    }

    console.log('[portal] POST /bookings — success, ref:', booking.referenceNumber)
    return c.json({ booking_reference: booking.referenceNumber })
  } catch (err: any) {
    console.error('[portal] createBooking error:', err?.message ?? err)
    console.error('[portal] createBooking error details:', JSON.stringify(err, null, 2))
    return c.json(
      { error: err?.message ?? 'Something went wrong creating your booking.' },
      500,
    )
  }
})

// ─── Booking confirmed page (with QR) ────────────────────────────────────────
portalRoutes.get('/booking-confirmed/:ref', async (c) => {
  const ref     = c.req.param('ref').toUpperCase()
  const booking = await getBookingByRef(ref).catch(() => null)
  if (!booking) return c.redirect('/bookings')

  const qrDataUrl = await generateQRDataURL(ref, 220).catch(() => '')
  const isEft     = booking.paymentMethod === 'eft'
  const tenant    = await getTenant(DEFAULT_TENANT_ID).catch(() => null)

  return c.html(
    <PublicLayout title="Booking Confirmed" plain>
      <div style="min-height:calc(100vh - 56px); background:#F3F2F0; padding:40px 24px 64px;">
      <div style="max-width:1000px; margin:0 auto;">

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
            <p
              style="font-size:12px; font-family:ui-monospace,monospace; font-weight:700; color:#78716C; margin-top:2px; cursor:pointer; display:inline-flex; align-items:center; gap:5px;"
              title="Click to copy"
              onclick={`navigator.clipboard.writeText('${ref}').then(function(){this.style.color='#22C55E';setTimeout(()=>{this.style.color='#78716C'},1500)}.bind(this))`}
            >{ref}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          {/* QR Code */}
          <div
            style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 24px;"
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
