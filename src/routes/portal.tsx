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

      {/* ══════════════════════════════════════════════════════════════════
          §1  HERO — 3D band on top, copy below centered
      ══════════════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════════════
          §1  HERO — full-bleed photo with dark gradient overlay
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:28px 24px 0; background:#fff;">
      <div style="max-width:1200px; margin:0 auto; position:relative; border-radius:24px; overflow:hidden; min-height:560px; display:flex; align-items:flex-end;">

        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1601897690942-bcacbad33e55?w=1600&q=80&auto=format&fit=crop"
          alt="Container freight yard"
          style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 40%;"
        />

        {/* Dark gradient — dense left, dissolves right */}
        <div style="position:absolute; inset:0; background:linear-gradient(108deg,rgba(10,8,6,0.90) 0%,rgba(10,8,6,0.76) 38%,rgba(10,8,6,0.30) 68%,transparent 100%);"></div>
        {/* Bottom fade for text legibility */}
        <div style="position:absolute; bottom:0; left:0; right:0; height:40%; background:linear-gradient(to top,rgba(10,8,6,0.55) 0%,transparent 100%);"></div>

        {/* ── Hero content ── */}
        <div style="position:relative; z-index:1; width:100%; max-width:1200px; margin:0 auto; padding:0 40px 88px;" class="hero-content">
          <div style="max-width:560px;">

            {/* Open badge */}
            <div style="display:inline-flex; align-items:center; gap:7px; padding:5px 14px; border-radius:9999px; background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.30); margin-bottom:28px;">
              <span style="width:6px; height:6px; border-radius:9999px; background:#22C55E; flex-shrink:0; animation:pulse-dot 2s ease-in-out infinite;" />
              <span style="font-size:11px; font-weight:600; color:#4ADE80; letter-spacing:0.01em;">Open today</span>
            </div>

            <h1 style="font-size:clamp(2rem,3.8vw,3.2rem); font-weight:800; color:#ffffff; letter-spacing:-0.04em; line-height:1.06; margin-bottom:20px;">
              <span style="display:block;">Book your CFS slot.</span>
              <span style="display:block; color:#FC6514;">Skip the queue.</span>
            </h1>

            <p style="font-size:15px; color:rgba(255,255,255,0.68); line-height:1.75; margin-bottom:40px; max-width:380px;">
              Instant slot booking for drivers, forwarders and depot teams at Sydney CFS.
            </p>

            <div style="display:flex; gap:12px; flex-wrap:wrap;">
              <a href="/book" class="btn-primary" style="padding:13px 28px; font-size:14px;">
                <Icon name={ICONS.calendar} size={15} />
                Book a Visit
                <Icon name={ICONS.arrowRight} size={14} />
              </a>
              <a href="/bookings" style="display:inline-flex; align-items:center; gap:8px; padding:13px 24px; font-size:14px; font-weight:600; color:rgba(255,255,255,0.85); border:1.5px solid rgba(255,255,255,0.25); border-radius:9999px; text-decoration:none; transition:all 0.15s ease; backdrop-filter:blur(8px);"
                onmouseover="this.style.borderColor='rgba(255,255,255,0.55)'; this.style.color='#fff';"
                onmouseout="this.style.borderColor='rgba(255,255,255,0.25)'; this.style.color='rgba(255,255,255,0.85)';"
              >
                <Icon name={ICONS.search} size={15} />
                Look Up Booking
              </a>
            </div>

          </div>
        </div>


      </div>{/* end container */}
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          §2  MARQUEE
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:18px 0; background:#FFFFFF; overflow:hidden; border-top:1px solid rgba(0,0,0,0.06); border-bottom:1px solid rgba(0,0,0,0.06);">
        <div style="display:flex; overflow:hidden; mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent); -webkit-mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent);">
          <div class="animate-marquee" style="display:flex; gap:0; white-space:nowrap; flex-shrink:0;">
            {[
              'Express Freight Co.','Pacific Logistics','Harbour Carriers','SydPort Forwarding',
              'BlueAnchor CFS','Apex Customs','Meridian Shipping','Coastline Brokers','Trident Freight','Atlas Logistics',
              'Express Freight Co.','Pacific Logistics','Harbour Carriers','SydPort Forwarding',
              'BlueAnchor CFS','Apex Customs','Meridian Shipping','Coastline Brokers','Trident Freight','Atlas Logistics',
            ].map((name, i) => (
              <span key={i} style="display:inline-flex; align-items:center; gap:18px; padding:0 26px; font-size:11px; font-weight:600; color:rgba(0,0,0,0.22); letter-spacing:0.07em; text-transform:uppercase;">
                <span style="width:3px; height:3px; border-radius:9999px; background:rgba(252,101,20,0.40); display:inline-block; flex-shrink:0;" />
                {name}
              </span>
            ))}
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

          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px;" class="persona-grid">

            {/* Freight Forwarders — dark navy */}
            <div class="reveal" style="background:#192640; border-radius:22px; padding:34px 30px; position:relative; overflow:hidden; transition:background 0.3s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1);"
              onmouseover="this.style.background='linear-gradient(145deg,#1e2d4a 0%,#0f172a 100%)'; this.style.transform='translateY(-4px)';"
              onmouseout="this.style.background='#192640'; this.style.transform='';">
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
            <div class="reveal" data-reveal-delay="80" style="background:#0d3835; border-radius:22px; padding:34px 30px; position:relative; overflow:hidden; transition:background 0.3s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1);"
              onmouseover="this.style.background='linear-gradient(145deg,#134e4a 0%,#0c302d 100%)'; this.style.transform='translateY(-4px)';"
              onmouseout="this.style.background='#0d3835'; this.style.transform='';">
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
            <div class="reveal" data-reveal-delay="160" style="background:#260c03; border-radius:22px; padding:34px 30px; position:relative; overflow:hidden; transition:background 0.3s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1);"
              onmouseover="this.style.background='linear-gradient(145deg,#431407 0%,#1c0a02 100%)'; this.style.transform='translateY(-4px)';"
              onmouseout="this.style.background='#260c03'; this.style.transform='';">
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
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;" class="bento-row">
            {[
              {icon:ICONS.clock,  title:'10-min slot holds',  desc:'Your preferred time is reserved while you complete the booking — zero double-bookings.'},
              {icon:ICONS.qrCode, title:'QR check-in kiosk',  desc:'Scan at arrival. Skip the counter queue entirely. Works on any smartphone.'},
            ].map((feat,i)=>(
              <div key={feat.title} class="reveal" data-reveal-delay={String(i*80)}
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
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;" class="bento-row">
            {[
              {icon:ICONS.warning, title:'CHEP pallet alerts',  desc:'Pallet exchange flagged before you leave for the depot.'},
              {icon:ICONS.users,   title:'Agent bookings',      desc:'Freight forwarders book for drivers — no extra account.'},
              {icon:ICONS.reports, title:'Live reception view',  desc:'Staff see bookings, walk-ins, and holds in one screen.'},
            ].map((feat,i)=>(
              <div key={feat.title} class="reveal" data-reveal-delay={String(i*70)}
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

      {/* ══════════════════════════════════════════════════════════════════
          §7  TESTIMONIAL
      ══════════════════════════════════════════════════════════════════ */}
      <section style="padding:96px 24px; background:#FFFFFF; border-top:1px solid rgba(0,0,0,0.06);">
        <div class="max-w-3xl mx-auto">
          <div class="reveal" style="background:#F7F6F5; border:1px solid rgba(0,0,0,0.08); border-radius:22px; padding:52px 48px; position:relative; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.04),0 8px 32px rgba(0,0,0,0.06);">
            <div style="position:absolute; top:20px; left:32px; font-size:120px; font-weight:800; color:rgba(252,101,20,0.08); line-height:1; font-family:Georgia,serif; pointer-events:none; user-select:none;">"</div>
            <blockquote style="position:relative; font-size:clamp(1rem,2vw,1.25rem); font-weight:400; color:#1C1917; letter-spacing:-0.02em; line-height:1.65; margin-bottom:28px; font-style:italic;">
              We used to spend 40 minutes every morning on phone bookings and a whiteboard. Now drivers book online, ICS checks happen automatically, and our gate time is under 4 minutes.
            </blockquote>
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:42px; height:42px; border-radius:10px; background:#1C1917; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <span style="font-size:14px; font-weight:700; color:rgba(255,255,255,0.85);">JR</span>
              </div>
              <div>
                <p style="font-size:13px; font-weight:600; color:#1C1917;">James R.</p>
                <p style="font-size:12px; color:#A8A29E;">Operations Manager · Sydney CFS</p>
              </div>
              <div style="margin-left:auto; display:flex; gap:2px;">
                {[1,2,3,4,5].map(s=>(
                  <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FC6514">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
          .hero-grid,.preview-grid{grid-template-columns:1fr!important;}
          .steps-grid-new{grid-template-columns:repeat(2,1fr)!important;}
          .bento-row,.persona-grid{grid-template-columns:1fr!important;}
          .bento-hero{grid-template-columns:1fr!important;}
        }
        @media (max-width:640px){
          .steps-grid-new{grid-template-columns:1fr!important;}
          .hero-content{padding:0 24px 64px!important;}
        }
      `}</style>

    </LandingLayout>
  )
})

// ─── Booking wizard ─────────────────────────────────────────────────────────
portalRoutes.get('/book', (c) => {
  return c.html(
    <PublicLayout title="Book a Visit" plain>
      <BookingWizard />
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
      <div style="min-height:calc(100vh - 56px); background:#F3F2F0; padding:40px 24px 64px;">
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
