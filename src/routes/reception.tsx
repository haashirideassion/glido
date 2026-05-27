import { Hono } from 'hono'
import { ReceptionLayout } from '../layouts/ReceptionLayout'
import { KpiTiles } from '../components/reception/KpiTiles'
import { DayChart } from '../components/reception/DayChart'
import { BookingTable, BookingTableBody, PAGE_SIZE } from '../components/reception/BookingTable'
import { BookingSlideOver } from '../components/reception/BookingSlideOver'
import { BookingDetailPage } from '../components/reception/BookingDetailPage'
import { WalkInForm } from '../components/reception/WalkInForm'
import { ReportsView } from '../components/reception/ReportsView'
import { SettingsView } from '../components/reception/SettingsView'
import { ManualBookingForm } from '../components/reception/ManualBookingForm'
import { Icon, ICONS } from '../lib/Icon'
import { GlidoLogo } from '../lib/GlidoLogo'
import {
  signInWithPassword,
  getSessionUser,
  setSessionCookie,
  clearSessionCookie,
  isReceptionRole,
  inviteReceptionUser,
} from '../lib/auth'
import {
  findBooking,
  getTodayBookings,
  getBookingsByDate,
  getDashboardStats,
  checkInBooking,
  completeBooking,
  getBookings,
  getBookingsByDateRange,
  cancelBooking,
  rescheduleBooking,
  refreshIcsStatus,
  createBooking,
} from '../lib/db/bookings'
import { getActiveWalkIns, createWalkIn, dismissWalkIn } from '../lib/db/walk-ins'
import { getTenant, updateTenant } from '../lib/db/tenants'
import { DEFAULT_TENANT_ID } from '../lib/supabase'
import { sendBookingCompleted } from '../lib/email'
import type { Booking, BookingStatus, ServiceType, WalkInPurpose } from '../data/types'

// ─── Dummy data — shown on the dashboard when Supabase has no bookings today ──
const _D = new Date().toISOString().split('T')[0]
const DUMMY_BOOKINGS: Booking[] = [
  // ── 07:00 slot ──────────────────────────────────────────────────────────────
  { id:'d-001', referenceNumber:'GLD-2026-10041', status:'completed',  serviceType:'pickup',  loadType:'fcl', slotDate:_D, slotStartTime:'07:00', slotEndTime:'08:00', driverName:'Tom Nguyen',        driverPhone:'0467 234 567', containerNumber:'MSCU1234567',  icsStatus:'cleared',     tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-002', referenceNumber:'GLD-2026-10042', status:'completed',  serviceType:'pickup',  loadType:'lcl', slotDate:_D, slotStartTime:'07:00', slotEndTime:'08:00', driverName:'Marcus Webb',       driverPhone:'0412 345 678', houseBillNumber:'HLCUSY2120045', icsStatus:'cleared',    tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-003', referenceNumber:'GLD-2026-10043', status:'completed',  serviceType:'dropoff', loadType:'lcl', slotDate:_D, slotStartTime:'07:00', slotEndTime:'08:00', driverName:'Ben Yamamoto',      driverPhone:'0455 789 012', houseBillNumber:'WHLC4521098',                          tenantId:'demo', createdAt: new Date().toISOString() },
  // ── 08:00 slot — 2 on-site + 1 still scheduled (mixed bar) ─────────────────
  { id:'d-004', referenceNumber:'GLD-2026-10044', status:'checked_in', serviceType:'pickup',  loadType:'fcl', slotDate:_D, slotStartTime:'08:00', slotEndTime:'09:00', driverName:'Priya Sharma',      driverPhone:'0421 987 654', containerNumber:'TCKU3456789',  icsStatus:'cleared',     tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-005', referenceNumber:'GLD-2026-10045', status:'checked_in', serviceType:'dropoff', loadType:'lcl', slotDate:_D, slotStartTime:'08:00', slotEndTime:'09:00', driverName:'James Kowalski',    driverPhone:'0498 112 233', houseBillNumber:'MAEU8934521', icsStatus:'examination', tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-006', referenceNumber:'GLD-2026-10046', status:'scheduled',  serviceType:'pickup',  loadType:'lcl', slotDate:_D, slotStartTime:'08:00', slotEndTime:'09:00', driverName:'David Park',        driverPhone:'0488 321 654', houseBillNumber:'YMLU5674321', icsStatus:'pending',     tenantId:'demo', createdAt: new Date().toISOString() },
  // ── 09:00 slot — 2 scheduled + 1 on-site (mixed bar) ────────────────────────
  { id:'d-007', referenceNumber:'GLD-2026-10047', status:'scheduled',  serviceType:'pickup',  loadType:'lcl', slotDate:_D, slotStartTime:'09:00', slotEndTime:'10:00', driverName:'Sarah Chen',        driverPhone:'0435 678 901', houseBillNumber:'OOLU7821034', icsStatus:'held',        tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-008', referenceNumber:'GLD-2026-10048', status:'scheduled',  serviceType:'pickup',  loadType:'fcl', slotDate:_D, slotStartTime:'09:00', slotEndTime:'10:00', driverName:'Rachel Torres',     driverPhone:'0422 543 210', containerNumber:'APLU9087654',  icsStatus:'cleared',     tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-009', referenceNumber:'GLD-2026-10049', status:'checked_in', serviceType:'dropoff', loadType:'lcl', slotDate:_D, slotStartTime:'09:00', slotEndTime:'10:00', driverName:'Amara Okafor',     driverPhone:'0411 876 543', houseBillNumber:'CSCL3089214',                          tenantId:'demo', createdAt: new Date().toISOString() },
  // ── 10:00 slot — 1 scheduled + 2 on-site (mixed bar) ────────────────────────
  { id:'d-010', referenceNumber:'GLD-2026-10050', status:'checked_in', serviceType:'pickup',  loadType:'lcl', slotDate:_D, slotStartTime:'10:00', slotEndTime:'11:00', driverName:'Fatima Al-Hassan', driverPhone:'0401 654 321', houseBillNumber:'COSU1876543', icsStatus:'held',        tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-011', referenceNumber:'GLD-2026-10051', status:'scheduled',  serviceType:'pickup',  loadType:'fcl', slotDate:_D, slotStartTime:'10:00', slotEndTime:'11:00', driverName:'Liam O\'Brien',    driverPhone:'0477 234 890', containerNumber:'GESU8812340',  icsStatus:'cleared',     tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-012', referenceNumber:'GLD-2026-10052', status:'checked_in', serviceType:'dropoff', loadType:'lcl', slotDate:_D, slotStartTime:'10:00', slotEndTime:'11:00', driverName:'Mei-Ling Zhao',    driverPhone:'0499 567 123', houseBillNumber:'EVERSU321098', icsStatus:'cleared',    tenantId:'demo', createdAt: new Date().toISOString() },
  // ── 11:00 slot ──────────────────────────────────────────────────────────────
  { id:'d-013', referenceNumber:'GLD-2026-10053', status:'scheduled',  serviceType:'pickup',  loadType:'lcl', slotDate:_D, slotStartTime:'11:00', slotEndTime:'12:00', driverName:'Carlos Mendez',    driverPhone:'0433 901 234', houseBillNumber:'SITCSY445521', icsStatus:'cleared',    tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-014', referenceNumber:'GLD-2026-10054', status:'scheduled',  serviceType:'pickup',  loadType:'fcl', slotDate:_D, slotStartTime:'11:00', slotEndTime:'12:00', driverName:'Aisha Patel',      driverPhone:'0444 678 345', containerNumber:'CMAU6543210',  icsStatus:'examination', tenantId:'demo', createdAt: new Date().toISOString() },
  // ── 12:00 slot ──────────────────────────────────────────────────────────────
  { id:'d-015', referenceNumber:'GLD-2026-10055', status:'scheduled',  serviceType:'dropoff', loadType:'lcl', slotDate:_D, slotStartTime:'12:00', slotEndTime:'13:00', driverName:'Jake Thornton',    driverPhone:'0466 112 789', houseBillNumber:'ONEY1290834',                          tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-016', referenceNumber:'GLD-2026-10056', status:'scheduled',  serviceType:'pickup',  loadType:'lcl', slotDate:_D, slotStartTime:'12:00', slotEndTime:'13:00', driverName:'Nadia Volkov',     driverPhone:'0455 340 678', houseBillNumber:'SMLMSY772310', icsStatus:'cleared',    tenantId:'demo', createdAt: new Date().toISOString() },
  // ── 13:00 slot ──────────────────────────────────────────────────────────────
  { id:'d-017', referenceNumber:'GLD-2026-10057', status:'scheduled',  serviceType:'pickup',  loadType:'fcl', slotDate:_D, slotStartTime:'13:00', slotEndTime:'14:00', driverName:'Omar Farouk',      driverPhone:'0422 890 123', containerNumber:'TGHU5021987',  icsStatus:'cleared',     tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-018', referenceNumber:'GLD-2026-10058', status:'scheduled',  serviceType:'dropoff', loadType:'lcl', slotDate:_D, slotStartTime:'13:00', slotEndTime:'14:00', driverName:'Sophie Leclair',   driverPhone:'0488 456 901', houseBillNumber:'WANHY8831204', icsStatus:'held',       tenantId:'demo', createdAt: new Date().toISOString() },
  // ── 14:00 slot ──────────────────────────────────────────────────────────────
  { id:'d-019', referenceNumber:'GLD-2026-10059', status:'scheduled',  serviceType:'pickup',  loadType:'lcl', slotDate:_D, slotStartTime:'14:00', slotEndTime:'15:00', driverName:'Diego Ramirez',    driverPhone:'0411 234 567', houseBillNumber:'FMSASY119032', icsStatus:'cleared',    tenantId:'demo', createdAt: new Date().toISOString() },
  { id:'d-020', referenceNumber:'GLD-2026-10060', status:'scheduled',  serviceType:'pickup',  loadType:'fcl', slotDate:_D, slotStartTime:'14:00', slotEndTime:'15:00', driverName:'Elena Petrov',     driverPhone:'0433 567 890', containerNumber:'HLXU4398210',  icsStatus:'pending',     tenantId:'demo', createdAt: new Date().toISOString() },
]

export const receptionRoutes = new Hono()

// ─── Reception Login GET ───────────────────────────────────────────────────────
receptionRoutes.get('/login', async (c) => {
  // Already logged-in reception users go straight to dashboard
  const existingUser = await getSessionUser(c)
  if (existingUser && isReceptionRole(existingUser.role)) return c.redirect('/reception')

  const error = c.req.query('error') ?? ''
  const errorMsg =
    error === 'invalid'        ? 'Incorrect email or password. Please try again.' :
    error === 'missing'        ? 'Please enter your email and password.'          :
    error === 'unauthorized'   ? 'Your account does not have reception access.'   : ''

  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sign In — Reception · Glido</title>
        <link rel="icon" type="image/svg+xml" href="/public/favicon.svg" />
        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`
          [x-cloak]{display:none!important}
          *{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;box-sizing:border-box;}
          body{margin:0;background:#F7F6F5;min-height:100vh;display:flex;align-items:center;justify-content:center;}
        `}</style>
      </head>
      <body>
        <div style="position:fixed;inset:0;background-image:radial-gradient(rgba(0,0,0,0.05) 1px,transparent 1px);background-size:28px 28px;pointer-events:none;z-index:0;" />

        <div style="position:relative;z-index:1;width:100%;max-width:400px;padding:24px;">
          {/* Logo */}
          <div style="text-align:center;margin-bottom:32px;">
            <a href="/" style="display:inline-block;text-decoration:none;">
              <GlidoLogo height={22} onDark={false} />
            </a>
          </div>

          <div style="background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:24px;padding:44px 40px;box-shadow:0 2px 8px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.09);">
            {/* Heading */}
            <div style="text-align:center;margin-bottom:32px;">
              <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#1C232C 0%,#374151 100%);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 4px 14px rgba(0,0,0,0.22);">
                <Icon name="solar:buildings-bold-duotone" size={24} style="color:#fff;" />
              </div>
              <h1 style="font-size:20px;font-weight:700;color:#1C1917;letter-spacing:-0.03em;margin-bottom:6px;">Reception Sign In</h1>
              <p style="font-size:13px;color:#78716C;line-height:1.6;">Staff access only. Invite-only accounts.</p>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.22);border-radius:10px;padding:10px 14px;margin-bottom:20px;font-size:12.5px;color:#DC2626;text-align:center;">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form method="post" action="/reception/login" style="display:flex;flex-direction:column;gap:16px;">
              <div>
                <label style="display:block;font-size:10px;font-weight:700;color:#78716C;letter-spacing:0.09em;text-transform:uppercase;margin-bottom:8px;">Email</label>
                <input type="email" name="email" placeholder="you@cfs.com.au" required autocomplete="email"
                  style="width:100%;padding:11px 14px;font-size:14px;color:#1C1917;background:#F7F6F5;border:1px solid rgba(0,0,0,0.10);border-radius:10px;outline:none;transition:border-color 0.15s ease,box-shadow 0.15s ease;"
                  onfocus="this.style.borderColor='rgba(252,101,20,0.50)';this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                  onblur="this.style.borderColor='rgba(0,0,0,0.10)';this.style.boxShadow='none';" />
              </div>
              <div>
                <label style="display:block;font-size:10px;font-weight:700;color:#78716C;letter-spacing:0.09em;text-transform:uppercase;margin-bottom:8px;">Password</label>
                <input type="password" name="password" placeholder="••••••••" required autocomplete="current-password"
                  style="width:100%;padding:11px 14px;font-size:14px;color:#1C1917;background:#F7F6F5;border:1px solid rgba(0,0,0,0.10);border-radius:10px;outline:none;transition:border-color 0.15s ease,box-shadow 0.15s ease;"
                  onfocus="this.style.borderColor='rgba(252,101,20,0.50)';this.style.boxShadow='0 0 0 3px rgba(252,101,20,0.12)';"
                  onblur="this.style.borderColor='rgba(0,0,0,0.10)';this.style.boxShadow='none';" />
              </div>
              <button type="submit"
                style="width:100%;padding:13px 20px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%);border:none;border-radius:12px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,0.22),0 4px 14px rgba(252,101,20,0.40);transition:opacity 0.15s ease;"
                onmouseover="this.style.opacity='0.92'" onmouseout="this.style.opacity='1'"
              >
                Sign in to Reception
              </button>
            </form>

            {/* Forgot password */}
            <p style="text-align:center;font-size:12px;color:#A8A29E;margin-top:18px;">
              <a href="/forgot-password" style="color:#FC6514;text-decoration:none;font-weight:500;transition:opacity 0.15s ease;"
                onmouseover="this.style.opacity='0.75'" onmouseout="this.style.opacity='1'"
              >Forgot your password?</a>
            </p>
          </div>

          {/* Back link */}
          <p style="text-align:center;margin-top:20px;font-size:12px;color:#A8A29E;">
            <a href="/" style="color:#78716C;text-decoration:none;font-weight:500;transition:color 0.15s ease;"
              onmouseover="this.style.color='#1C1917'" onmouseout="this.style.color='#78716C'"
            >← Back to home</a>
          </p>
        </div>
      </body>
    </html>
  )
})

// ─── Reception Login POST ──────────────────────────────────────────────────────
receptionRoutes.post('/login', async (c) => {
  const body     = await c.req.parseBody()
  const email    = String(body.email    ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')

  if (!email || !password) return c.redirect('/reception/login?error=missing')

  let session: any, authUser: any
  try {
    const result = await signInWithPassword(email, password)
    session  = result.session
    authUser = result.user
  } catch (err: any) {
    console.error('[reception/login]', err?.message)
    return c.redirect('/reception/login?error=invalid')
  }

  if (!session || !authUser) return c.redirect('/reception/login?error=invalid')

  setSessionCookie(c, session.access_token)

  // Verify the user is actually a reception role
  let role = ''
  try {
    const { supabaseAdmin } = await import('../lib/supabase')
    const { data: userRow } = await supabaseAdmin
      .from('users').select('role').eq('id', authUser.id).maybeSingle()
    if (userRow?.role) role = userRow.role
  } catch { /* non-fatal */ }

  if (!isReceptionRole(role)) {
    // Valid Supabase user but wrong role — clear cookie and reject
    clearSessionCookie(c)
    return c.redirect('/reception/login?error=unauthorized')
  }

  return c.redirect('/reception')
})

// ─── Auth middleware — protects all routes except /login ──────────────────────
receptionRoutes.use('/*', async (c, next) => {
  const url = new URL(c.req.url)
  // /reception/login is public
  if (url.pathname === '/reception/login') return next()

  const user = await getSessionUser(c)
  if (!user) return c.redirect('/reception/login')
  if (!isReceptionRole(user.role)) return c.redirect('/reception/login?error=unauthorized')

  return next()
})

// ─── Client-side dashboard refresh script ────────────────────────────────────
// Fetches today's bookings directly from Supabase REST (browser → Supabase),
// avoiding Vercel serverless entirely. Anon key comes from window.__sb.key.
const RECEPTION_DASH_SCRIPT = `(function(){
  var SB_URL='https://lnknynjqxyfvtjpnaljc.supabase.co';
  var TENANT='a0000000-0000-0000-0000-000000000001';
  var SL={scheduled:'Scheduled',checked_in:'Checked In',completed:'Completed',cancelled:'Cancelled'};
  var SVC={pickup:'Pick Up',dropoff:'Drop Off'};
  var LT={fcl:'FCL',lcl:'LCL'};
  var IL={cleared:'Clear',held:'Held',examination:'On Hold',pending:'Pending',unavailable:'N/A'};
  var IC={
    cleared:'bg-green-100 text-green-800 border-green-200',
    held:'bg-red-100 text-red-800 border-red-200',
    examination:'bg-amber-100 text-amber-800 border-amber-200',
    pending:'bg-slate-100 text-slate-500 border-slate-200',
    unavailable:'bg-slate-100 text-slate-400 border-slate-200'
  };
  var BS={
    default:'background:#F5F5F4;color:#57534E;border:1px solid rgba(0,0,0,0.1);border-radius:9999px;padding:2px 8px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;',
    success:'background:rgba(34,197,94,0.12);color:#16A34A;border:1px solid rgba(34,197,94,0.25);border-radius:9999px;padding:2px 8px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;',
    secondary:'background:#F5F5F4;color:#78716C;border:1px solid rgba(0,0,0,0.08);border-radius:9999px;padding:2px 8px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;',
    outline:'background:transparent;color:#A8A29E;border:1px solid rgba(0,0,0,0.15);border-radius:9999px;padding:2px 8px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;'
  };
  function today(){return new Date().toISOString().split('T')[0];}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function tt(s){return s?String(s).slice(0,5):'';}
  async function fetchBs(){
    var u=SB_URL+'/rest/v1/bookings?select=*&tenant_id=eq.'+TENANT+'&slot_date=eq.'+today()+'&status=neq.cancelled&order=slot_start_time.asc';
    try{
      var r=await fetch(u,{headers:{'apikey':window.__sb.key,'Authorization':'Bearer '+window.__sb.key}});
      return r.ok?await r.json():[];
    }catch(e){console.error('[dash] fetch',e);return [];}
  }
  function setEl(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
  function updateStats(bs){
    setEl('stat-scheduled',bs.length);
    setEl('stat-checkedin',bs.filter(function(b){return b.status==='checked_in';}).length);
    setEl('stat-completed',bs.filter(function(b){return b.status==='completed';}).length);
    setEl('stat-held',bs.filter(function(b){return b.ics_status==='held';}).length);
    setEl('booking-count',bs.length+' records');
  }
  function buildRow(b){
    var ics=b.ics_status||'';
    var bg=ics==='held'?'rgba(239,68,68,0.05)':b.status==='checked_in'?'rgba(34,197,94,0.04)':b.status==='completed'?'rgba(0,0,0,0.01)':'';
    var icsHtml=ics
      ?'<span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border '+(IC[ics]||'')+'">'+(IL[ics]||ics)+'</span>'
      :'<span style="font-size:12px;color:#A8A29E;">&#8212;</span>';
    var bv=b.status==='checked_in'?'success':b.status==='completed'?'secondary':b.status==='cancelled'?'outline':'default';
    var badge='<span style="'+(BS[bv]||BS.default)+'">'+(SL[b.status]||b.status)+'</span>';
    var hbl=esc(b.house_bill_number||b.container_number||'—');
    var svc=(SVC[b.service_type]||b.service_type)+' · '+(LT[b.load_type]||b.load_type);
    var showOver="document.getElementById('slide-over-backdrop').classList.remove('hidden');document.getElementById('slide-over').classList.remove('translate-x-full')";
    return '<tr style="border-bottom:1px solid rgba(0,0,0,0.06);cursor:pointer;transition:background 0.12s ease;'+(bg?'background:'+bg+';':'')+'"'
      +' onmouseover="this.style.background=\'rgba(252,101,20,0.03)\'"'
      +' onmouseout="this.style.background=\''+bg+'\'"'
      +' hx-get="/reception/bookings/'+esc(b.id)+'"'
      +' hx-target="#slide-over-content"'
      +' hx-swap="innerHTML"'
      +' hx-on:htmx:after-request="'+esc(showOver)+'">'
      +'<td class="px-5 py-3.5" style="font-family:ui-monospace,monospace;font-size:12px;font-weight:700;color:#FC6514;white-space:nowrap;">'+esc(b.reference_number||'—')+'</td>'
      +'<td class="px-4 py-3.5"><p style="font-size:13px;font-weight:600;color:#1C1917;">'+esc(b.driver_name||'—')+'</p><p style="font-size:11px;color:#A8A29E;">'+esc(b.driver_phone||'—')+'</p></td>'
      +'<td class="px-4 py-3.5"><p style="font-size:13px;font-weight:600;color:#1C1917;white-space:nowrap;">'+tt(b.slot_start_time)+(b.slot_end_time?' – '+tt(b.slot_end_time):'')+' </p><p style="font-size:11px;color:#A8A29E;">'+esc(b.slot_date||'')+'</p></td>'
      +'<td class="px-4 py-3.5" style="font-size:12px;font-weight:500;color:#78716C;white-space:nowrap;">'+svc+'</td>'
      +'<td class="px-4 py-3.5" style="font-family:ui-monospace,monospace;font-size:12px;color:#78716C;">'+hbl+'</td>'
      +'<td class="px-4 py-3.5">'+icsHtml+'</td>'
      +'<td class="px-4 py-3.5">'+badge+'</td>'
      +'<td class="px-4 py-3.5" style="color:rgba(0,0,0,0.30);">&#8594;</td>'
      +'</tr>';
  }
  function updateTable(bs){
    var el=document.getElementById('bookings-results');
    if(!el)return;
    if(!bs||!bs.length){
      el.innerHTML='<div style="text-align:center;padding:48px 0;color:#A8A29E;"><p style="font-size:13px;">No bookings for today.</p></div>';
      return;
    }
    var ths=['Reference','Driver','Slot','Service','HBL','ICS','Status','']
      .map(function(h){return '<th class="text-left px-5 py-3" style="font-size:10px;font-weight:700;color:#78716C;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;">'+h+'</th>';}).join('');
    el.innerHTML='<table style="width:100%;border-collapse:collapse;">'
      +'<thead><tr style="background:#F7F6F5;border-bottom:1px solid rgba(0,0,0,0.07);">'+ths+'</tr></thead>'
      +'<tbody style="border-top:none;">'+bs.map(buildRow).join('')+'</tbody>'
      +'</table>';
    if(window.htmx)htmx.process(el);
  }
  async function refresh(){
    try{
      var bs=await fetchBs();
      // Only override server-rendered content when real data is available
      if(bs&&bs.length>0){updateStats(bs);updateTable(bs);}
    }
    catch(e){console.error('[dash] refresh',e);}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',refresh);}else{refresh();}
  setInterval(refresh,30000);
})();`

const WALK_IN_PURPOSE_LABEL: Record<WalkInPurpose, string> = {
  walk_in_pickup:  'Walk-in Pick Up',
  walk_in_dropoff: 'Walk-in Drop Off',
  visit_person:    'Visiting Person',
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
receptionRoutes.get('/', (c) => {
  const today       = new Date().toISOString().split('T')[0]
  const currentDate = c.req.query('date') || today

  // Filter dummy bookings by selected date (dummies all live on _D = today)
  const bookings = DUMMY_BOOKINGS.filter(b => b.slotDate === currentDate)

  const stats = {
    totalScheduled: bookings.filter(b => b.status === 'scheduled' || b.status === 'checked_in').length,
    checkedIn:      bookings.filter(b => b.status === 'checked_in').length,
    completed:      bookings.filter(b => b.status === 'completed').length,
    held:           bookings.filter(b => b.icsStatus === 'held').length,
  }
  return c.html(
    <ReceptionLayout title="Dashboard" activeNav="/reception" walkInCount={3}>
      <div id="dashboard-stats">
        <KpiTiles stats={stats} />
        <DayChart bookings={bookings} />
      </div>
      <div id="dashboard-table">
        <BookingTable bookings={bookings} currentDate={currentDate} />
      </div>
    </ReceptionLayout>
  )
})

// ─── Shared filter helper (bookings list + CSV export) ───────────────────────
async function applyBookingFilters(params: {
  status?: string; service?: string; loadType?: string; date?: string; search?: string
}) {
  const { status, service, loadType, date, search } = params
  let bookings = date
    ? await getBookingsByDate(date).catch(() => [])
    : await getBookings().catch(() => [])

  if (status)   bookings = bookings.filter(b => b.status === status)
  if (service)  bookings = bookings.filter(b => b.serviceType === service)
  if (loadType) bookings = bookings.filter(b => b.loadType === loadType)
  if (search) {
    const q = search.toLowerCase()
    bookings = bookings.filter(b =>
      b.referenceNumber.toLowerCase().includes(q) ||
      b.driverName.toLowerCase().includes(q) ||
      (b.houseBillNumber  ?? '').toLowerCase().includes(q) ||
      (b.containerNumber  ?? '').toLowerCase().includes(q) ||
      (b.driverPhone      ?? '').toLowerCase().includes(q) ||
      (b.guestName        ?? '').toLowerCase().includes(q)
    )
  }
  return bookings
}

// ─── All Bookings (filterable + paginated) ───────────────────────────────────
receptionRoutes.get('/bookings', async (c) => {
  const status   = c.req.query('status')
  const service  = c.req.query('service')
  const loadType = c.req.query('loadType')
  const date     = c.req.query('date')
  const search   = c.req.query('search')?.toLowerCase().trim()
  const page     = Math.max(1, parseInt(c.req.query('page') || '1', 10))
  const isHtmx   = c.req.header('HX-Request') === 'true'

  const bookings   = await applyBookingFilters({ status, service, loadType, date, search })
  const totalCount = bookings.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paged      = bookings.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  if (isHtmx) {
    return c.html(
      <BookingTableBody bookings={paged} page={safePage} totalPages={totalPages} totalCount={totalCount} />
    )
  }
  return c.html(
    <ReceptionLayout title="All Bookings" activeNav="/reception/bookings">
      <BookingTable bookings={paged} showFilters page={safePage} totalPages={totalPages} totalCount={totalCount} />
    </ReceptionLayout>
  )
})

// ─── CSV export — must be registered before /bookings/:id ────────────────────
receptionRoutes.get('/bookings/export', async (c) => {
  const bookings = await applyBookingFilters({
    status:   c.req.query('status'),
    service:  c.req.query('service'),
    loadType: c.req.query('loadType'),
    date:     c.req.query('date'),
    search:   c.req.query('search')?.toLowerCase().trim(),
  })

  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

  const rows = [
    ['Reference','Driver','Phone','Date','Start','End','Service','Load','HBL','Container','ICS Status','Status','Checked In'],
    ...bookings.map(b => [
      b.referenceNumber, b.driverName, b.driverPhone || '',
      b.slotDate, b.slotStartTime, b.slotEndTime,
      b.serviceType, b.loadType,
      b.houseBillNumber || '', b.containerNumber || '',
      b.icsStatus || '', b.status,
      b.checkedInAt ? new Date(b.checkedInAt).toLocaleString('en-AU') : '',
    ]),
  ].map(row => row.map(esc).join(',')).join('\r\n')

  const filename = `bookings-${new Date().toISOString().split('T')[0]}.csv`
  return c.body('﻿' + rows, 200, {   // BOM for Excel UTF-8 compat
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
  })
})

// ─── Booking detail (slide-over fragment) ───────────────────────────────────
receptionRoutes.get('/bookings/:id', async (c) => {
  const isHtmx  = c.req.header('HX-Request') === 'true'
  const booking = await findBooking(c.req.param('id'))
  if (!booking) {
    return isHtmx
      ? c.html(<div style="padding:24px; color:#EF4444;">Booking not found.</div>)
      : c.redirect('/reception/bookings')
  }
  if (isHtmx) return c.html(<BookingSlideOver booking={booking} />)
  return c.html(
    <ReceptionLayout title={booking.referenceNumber} activeNav="/reception/bookings">
      <BookingDetailPage booking={booking} />
    </ReceptionLayout>
  )
})

// ─── Check-in action ────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/check-in', async (c) => {
  const booking = await checkInBooking(c.req.param('id'))
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  const isPage = c.req.header('HX-Target') === 'booking-detail-page'
  return c.html(
    <div data-toast={`✓ ${booking.driverName} checked in`} data-toast-type="success">
      {isPage ? <BookingDetailPage booking={booking} /> : <BookingSlideOver booking={booking} />}
    </div>
  )
})

// ─── Complete action ─────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/complete', async (c) => {
  const body    = await c.req.parseBody()
  const notes   = typeof body.completionNotes === 'string' ? body.completionNotes : undefined
  const booking = await completeBooking(c.req.param('id'), notes)
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)

  const guestEmail = typeof body.guestEmail === 'string' ? body.guestEmail.trim() : undefined
  if (guestEmail) {
    getTenant(DEFAULT_TENANT_ID)
      .then(tenant => sendBookingCompleted({ to: guestEmail, booking, tenantName: tenant?.name ?? 'Glido CFS' }))
      .catch(err => console.error('[email] completion failed:', err))
  }

  const isPage = c.req.header('HX-Target') === 'booking-detail-page'
  return c.html(
    <div data-toast={`✓ ${booking.driverName}'s visit completed`} data-toast-type="success">
      {isPage ? <BookingDetailPage booking={booking} /> : <BookingSlideOver booking={booking} />}
    </div>
  )
})

// ─── Cancel action ───────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/cancel', async (c) => {
  const booking = await cancelBooking(c.req.param('id'))
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  const isPage = c.req.header('HX-Target') === 'booking-detail-page'
  return c.html(
    <div data-toast={`Booking ${booking.referenceNumber} cancelled`} data-toast-type="info">
      {isPage ? <BookingDetailPage booking={booking} /> : <BookingSlideOver booking={booking} />}
    </div>
  )
})

// ─── Reschedule action ───────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/reschedule', async (c) => {
  const body     = await c.req.parseBody()
  const newDate  = (body.newDate as string) || ''
  const newStart = (body.newStart as string) || ''
  if (!newDate || !newStart) {
    return c.html(<div style="padding:16px; color:#EF4444;">Date and time are required</div>)
  }
  const tenant = await getTenant(DEFAULT_TENANT_ID).catch(() => null)
  const dur = tenant?.slot_duration_min ?? 60
  const [h, m] = newStart.split(':').map(Number)
  const endMin = h * 60 + m + dur
  const newEnd = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`
  const booking = await rescheduleBooking(c.req.param('id'), newDate, newStart, newEnd)
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  const isPage = c.req.header('HX-Target') === 'booking-detail-page'
  return c.html(
    <div data-toast={`Rescheduled to ${newDate} at ${newStart}`} data-toast-type="success">
      {isPage ? <BookingDetailPage booking={booking} /> : <BookingSlideOver booking={booking} />}
    </div>
  )
})

// ─── ICS Refresh action ──────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/refresh-ics', async (c) => {
  const booking = await refreshIcsStatus(c.req.param('id'))
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  const isPage = c.req.header('HX-Target') === 'booking-detail-page'
  return c.html(
    <div data-toast="ICS status refreshed" data-toast-type="info">
      {isPage ? <BookingDetailPage booking={booking} /> : <BookingSlideOver booking={booking} />}
    </div>
  )
})

// ─── Mark EFT Paid ───────────────────────────────────────────────────────────
receptionRoutes.post('/bookings/:id/mark-eft-paid', async (c) => {
  const { supabaseAdmin } = await import('../lib/supabase')
  const id = c.req.param('id')
  await supabaseAdmin
    .from('bookings')
    .update({ payment_status: 'paid' })
    .eq('id', id)
  const booking = await findBooking(id)
  if (!booking) return c.html(<div style="padding:16px; color:#EF4444;">Not found</div>)
  return c.html(<BookingSlideOver booking={booking} />)
})

// ─── Walk-ins list ───────────────────────────────────────────────────────────
receptionRoutes.get('/walk-ins', async (c) => {
  const walkIns = await getActiveWalkIns(DEFAULT_TENANT_ID).catch(() => [])
  return c.html(
    <ReceptionLayout title="Walk-Ins" activeNav="/reception/walk-ins">
      <div style="background:#FFFFFF; border-radius:12px; border:1px solid rgba(0,0,0,0.07); overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07);">
        <div style="display:flex; align-items:center; justify-content:flex-end; padding:10px 16px; border-bottom:1px solid rgba(0,0,0,0.07); background:rgba(0,0,0,0.01);">
          <span style="font-size:11px; color:#78716C; background:#EBEBEA; border:1px solid rgba(0,0,0,0.09); padding:2px 10px; border-radius:9999px; font-weight:600;">
            {walkIns.length} active
          </span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; font-size:12px; border-collapse:collapse;">
            <thead>
              <tr style="background:#F7F6F5; border-bottom:1px solid rgba(0,0,0,0.07);">
                <th style="text-align:left; padding:10px 20px; color:#78716C; font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.08em;">Name</th>
                <th style="text-align:left; padding:10px 16px; color:#78716C; font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.08em;">Phone</th>
                <th style="text-align:left; padding:10px 16px; color:#78716C; font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.08em;">Purpose</th>
                <th style="text-align:left; padding:10px 16px; color:#78716C; font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.08em;">Arrived</th>
                <th style="text-align:left; padding:10px 16px; color:#78716C; font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.08em;">Licence</th>
                <th style="padding:10px 16px;"></th>
              </tr>
            </thead>
            <tbody>
              {walkIns.map((w) => (
                <tr key={w.id} style="border-bottom:1px solid rgba(0,0,0,0.06); transition:background 0.12s ease;" onmouseover="this.style.background='rgba(252,101,20,0.03)'" onmouseout="this.style.background='transparent'">
                  <td style="padding:13px 20px;">
                    <p style="font-size:13px; font-weight:600; color:#1C1917;">{w.visitorName}</p>
                    {w.personBeingVisited && (
                      <p style="font-size:11px; color:#A8A29E; margin-top:2px;">→ {w.personBeingVisited}</p>
                    )}
                  </td>
                  <td style="padding:13px 16px; color:#78716C; font-size:12px;">{w.contactNumber || '—'}</td>
                  <td style="padding:13px 16px;">
                    <span style="display:inline-flex; align-items:center; font-size:11px; font-weight:600; padding:3px 9px; border-radius:9999px; background:rgba(252,101,20,0.08); color:#FC6514; border:1px solid rgba(252,101,20,0.22);">
                      {WALK_IN_PURPOSE_LABEL[w.purpose]}
                    </span>
                  </td>
                  <td style="padding:13px 16px; font-size:12px; color:#78716C;">
                    {new Date(w.arrivedAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style="padding:13px 16px;">
                    {w.licenceCaptured ? (
                      <span style="display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:600; color:#22C55E;">
                        <Icon name={ICONS.check} size={12} />
                        Captured
                      </span>
                    ) : (
                      <span style="font-size:12px; color:#A8A29E;">Not captured</span>
                    )}
                  </td>
                  <td style="padding:13px 16px;">
                    <form method="post" action={`/reception/walk-ins/${w.id}/dismiss`} style="display:inline;">
                      <button
                        type="submit"
                        style="font-size:12px; font-weight:500; color:#A8A29E; background:none; border:none; cursor:pointer; transition:color 0.15s ease; padding:0;"
                        onmouseover="this.style.color='#EF4444'"
                        onmouseout="this.style.color='#A8A29E'"
                      >
                        Dismiss
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {walkIns.length === 0 && (
                <tr>
                  <td colspan={6} style="padding:40px 20px; text-align:center; font-size:13px; color:#A8A29E;">
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

// ─── Auto-refresh API partials ────────────────────────────────────────────────
receptionRoutes.get('/api/stats', async (c) => {
  const [stats, todayBookings] = await Promise.all([
    getDashboardStats().catch(() => ({ totalScheduled: 0, checkedIn: 0, completed: 0, held: 0 })),
    getTodayBookings().catch(() => []),
  ])
  return c.html(
    <>
      <KpiTiles stats={stats} />
      <DayChart bookings={todayBookings} />
    </>
  )
})

receptionRoutes.get('/api/today-bookings', async (c) => {
  const bookings = await getTodayBookings().catch(() => [])
  return c.html(
    <div id="dashboard-table" hx-get="/reception/api/today-bookings" hx-trigger="every 30s" hx-swap="outerHTML">
      <BookingTable bookings={bookings} />
    </div>
  )
})

receptionRoutes.get('/api/walk-in-count', async (c) => {
  const walkIns = await getActiveWalkIns(DEFAULT_TENANT_ID).catch(() => [])
  return c.json({ count: walkIns.length })
})

// ─── HBL / shipment lookup API (used by ManualBookingForm) ───────────────────
receptionRoutes.post('/api/hbl-lookup', async (c) => {
  try {
    const body = await c.req.json<{ hbl?: string; container?: string; serviceType?: string; loadType?: string; slotDate?: string }>()
    const tenant = await getTenant(DEFAULT_TENANT_ID)
    if (!tenant) return c.json({ found: false })

    const { lookupShipment, lookupShipmentByContainer } = await import('../lib/db/cfs-shipments')
    const { checkIcsStatus } = await import('../lib/ics')
    const { calculateCharges } = await import('../lib/charges')

    let shipment = body.hbl?.trim()
      ? await lookupShipment(DEFAULT_TENANT_ID, body.hbl.trim())
      : undefined
    if (!shipment && body.container?.trim()) {
      shipment = await lookupShipmentByContainer(DEFAULT_TENANT_ID, body.container.trim())
    }
    if (!shipment) return c.json({ found: false })

    const slotDate = body.slotDate || new Date().toISOString().split('T')[0]
    const charges = calculateCharges({
      serviceType:      (body.serviceType as 'pickup' | 'dropoff') || 'pickup',
      loadType:         (body.loadType as 'fcl' | 'lcl') || 'lcl',
      weightKg:         shipment.weightKg,
      volumeCbm:        shipment.volumeCbm,
      palletCount:      shipment.palletCount,
      palletType:       shipment.palletType,
      storageStartDate: shipment.storageStartDate,
      slotDate,
      tenant,
    })

    const ics = await checkIcsStatus({
      shipmentId:      shipment.id,
      hbl:             shipment.hbl,
      containerNumber: shipment.containerNumber,
      cachedStatus:    shipment.icsStatus,
      apiUrl:          tenant.cargowise_api_url,
      apiKey:          tenant.cargowise_api_key,
    })

    return c.json({
      found:              true,
      hbl:                shipment.hbl,
      containerNumber:    shipment.containerNumber,
      weightKg:           shipment.weightKg,
      volumeCbm:          shipment.volumeCbm,
      packageCount:       shipment.packageCount,
      palletCount:        shipment.palletCount,
      palletType:         shipment.palletType,
      storageStartDate:   shipment.storageStartDate,
      readyForCollection: shipment.readyForCollection,
      icsStatus:          ics.status,
      icsSource:          ics.source,
      description:        shipment.description,
      ...charges,
    })
  } catch (err) {
    console.error('[reception] hbl-lookup error:', err)
    return c.json({ found: false })
  }
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
    tenantId:    DEFAULT_TENANT_ID,
    purpose:     (body.purpose as WalkInPurpose) || 'walk_in_pickup',
    visitorName: (body.visitorName as string) || 'Unknown',
    contactNumber:      body.contactNumber as string | undefined,
    personBeingVisited: body.personBeingVisited as string | undefined,
    reason:             body.reason as string | undefined,
    licenceCaptured:    body.licenceCaptured === 'true',
  })

  return c.html(
    <div style="background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.22); border-radius:12px; padding:20px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <div style="width:40px; height:40px; background:rgba(34,197,94,0.15); border-radius:9999px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <Icon name={ICONS.check} size={20} style="color:#22C55E;" />
        </div>
        <div>
          <p style="font-weight:600; color:#22C55E;">Walk-in Registered</p>
          <p style="font-size:13px; color:#4ADE80;">{walkIn.visitorName}</p>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:8px; padding:12px 16px; display:inline-block;">
        <p style="font-size:11px; color:#64748B; margin-bottom:2px;">Walk-in ID</p>
        <p style="font-family:ui-monospace,monospace; font-weight:700; font-size:18px; color:#F1F5F9;">{walkIn.id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  )
})

// ─── Manual Booking (staff creates booking) ───────────────────────────────────
receptionRoutes.get('/bookings/new', (c) => {
  const saved = c.req.query('saved') === '1'
  return c.html(
    <ReceptionLayout title="New Booking" activeNav="/reception/bookings">
      <div style="margin-bottom:20px;">
        <a href="/reception/bookings" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#78716C; text-decoration:none; margin-bottom:14px; transition:color 0.15s ease;"
          onmouseover="this.style.color='#1C1917'" onmouseout="this.style.color='#78716C'"
        >
          ← Back to Bookings
        </a>
        <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin:0 0 2px;">Create Booking</h2>
        <p style="font-size:12.5px; color:#78716C; margin:0;">Manually create a booking for a walk-in or phone caller.</p>
      </div>
      <ManualBookingForm savedFlash={saved} />
    </ReceptionLayout>
  )
})

receptionRoutes.post('/bookings/new', async (c) => {
  const body = await c.req.parseBody()
  const b    = body as Record<string, string>

  if (!b.driverName?.trim() || !b.slotDate || !b.slotStartTime || !b.slotEndTime || !b.serviceType || !b.loadType) {
    return c.html(
      <ReceptionLayout title="New Booking" activeNav="/reception/bookings">
        <div style="margin-bottom:20px;">
          <a href="/reception/bookings" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#78716C; text-decoration:none; margin-bottom:14px;">← Back to Bookings</a>
          <h2 style="font-size:17px; font-weight:600; color:#1C1917; margin:0 0 2px;">Create Booking</h2>
          <p style="font-size:12.5px; color:#78716C; margin:0;">Manually create a booking for a walk-in or phone caller.</p>
        </div>
        <ManualBookingForm error="Please fill in all required fields: driver name, service type, load type, date and time." />
      </ReceptionLayout>
    )
  }

  await createBooking({
    tenantId:       DEFAULT_TENANT_ID,
    serviceType:    b.serviceType as 'pickup' | 'dropoff',
    loadType:       b.loadType as 'lcl' | 'fcl',
    slotDate:       b.slotDate,
    slotStartTime:  b.slotStartTime,
    slotEndTime:    b.slotEndTime,
    driverName:     b.driverName.trim(),
    driverPhone:    b.driverPhone?.trim() || undefined,
    guestName:      b.guestName?.trim() || undefined,
    guestPhone:     b.guestPhone?.trim() || undefined,
    houseBillNumber: b.houseBillNumber?.trim() || undefined,
    containerNumber: b.containerNumber?.trim() || undefined,
    paymentMethod:  b.paymentMethod as 'eft' | 'card' | undefined || undefined,
    paymentStatus:  (b.paymentStatus as any) || 'pending',
  })

  return c.redirect('/reception/bookings/new?saved=1')
})

// ─── Reports ──────────────────────────────────────────────────────────────────
receptionRoutes.get('/reports', async (c) => {
  const from = c.req.query('from')
  const to   = c.req.query('to')
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10))

  const bookings = (from && to)
    ? await getBookingsByDateRange(from, to).catch(() => [])
    : await getBookings().catch(() => [])

  return c.html(
    <ReceptionLayout title="Reports" activeNav="/reception/reports">
      <ReportsView bookings={bookings} page={page} from={from} to={to} />
    </ReceptionLayout>
  )
})

// ─── Settings GET ─────────────────────────────────────────────────────────────
receptionRoutes.get('/settings', async (c) => {
  const tab = c.req.query('tab') || 'General'
  const tenant = await getTenant(DEFAULT_TENANT_ID).catch(() => null)
  return c.html(
    <ReceptionLayout title="Settings" activeNav="/reception/settings">
      <SettingsView activeTab={tab} tenant={tenant} users={[]} />
    </ReceptionLayout>
  )
})

// ─── Settings POST ────────────────────────────────────────────────────────────
receptionRoutes.post('/settings', async (c) => {
  const body = await c.req.parseBody()
  const b = body as Record<string, string>

  // Build working hours JSON from checkbox/time fields
  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const workingHours: Record<string, { enabled: boolean; open: string; close: string }> = {}
  for (const day of DAYS) {
    workingHours[day] = {
      enabled: b[`${day}_enabled`] === 'on',
      open:    b[`${day}_open`]    || '06:00',
      close:   b[`${day}_close`]   || '18:00',
    }
  }

  const tab = (b.tab || 'General')
  const isWorkingHoursTab  = tab === 'Working Hours'
  const isIntegrationsTab  = tab === 'Integrations'

  // For the Integrations tab only save integration fields; other tabs ignore them
  const integrationUpdates = isIntegrationsTab ? {
    cargowise_api_url: b.cargowise_api_url?.trim() || null,
    // Only overwrite the key if the field was actually submitted (not the masked placeholder)
    ...(b.cargowise_api_key && b.cargowise_api_key !== '••••••••' ? { cargowise_api_key: b.cargowise_api_key.trim() || null } : {}),
  } : {}

  await updateTenant(DEFAULT_TENANT_ID, {
    name:                         b.name,
    address:                      b.address,
    contact_email:                b.contact_email,
    contact_phone:                b.contact_phone,
    timezone:                     b.timezone,
    currency:                     b.currency,
    slot_duration_min:            Number(b.slot_duration_min),
    max_bookings_per_slot:        Number(b.max_bookings_per_slot),
    advance_booking_days:         Number(b.advance_booking_days),
    slot_hold_duration_min:       Number(b.slot_hold_duration_min),
    same_day_cutoff_time:         b.same_day_cutoff_time,
    storage_rate_per_cbm:         Number(b.storage_rate_per_cbm),
    storage_free_days:            Number(b.storage_free_days),
    shrink_wrap_rate_per_pallet:  Number(b.shrink_wrap_rate_per_pallet),
    slot_fee_pickup:              Number(b.slot_fee_pickup),
    slot_fee_dropoff:             Number(b.slot_fee_dropoff),
    gst_enabled:                  b.gst_enabled === 'on',
    gst_rate:                     Number(b.gst_rate) || 10,
    stripe_public_key:            b.stripe_public_key || null,
    eft_bank_name:                b.eft_bank_name || null,
    eft_bsb:                      b.eft_bsb || null,
    eft_account_number:           b.eft_account_number || null,
    eft_account_name:             b.eft_account_name || null,
    require_payment_to_confirm:   b.require_payment_to_confirm === 'on',
    ...(isWorkingHoursTab ? { working_hours: workingHours } : {}),
    ...integrationUpdates,
  })

  return c.redirect(`/reception/settings?tab=${encodeURIComponent(tab)}&saved=1`)
})

// ─── Invite reception user (Users tab in Settings) ────────────────────────────
receptionRoutes.post('/settings/invite', async (c) => {
  let body: any
  try { body = await c.req.json() } catch { return c.json({ ok: false, error: 'Invalid request.' }, 400) }

  const email = String(body.email ?? '').trim().toLowerCase()
  const role  = String(body.role  ?? 'reception_staff')

  if (!email) return c.json({ ok: false, error: 'Email is required.' })
  if (role !== 'reception_staff' && role !== 'reception_admin') {
    return c.json({ ok: false, error: 'Invalid role.' })
  }

  try {
    const appUrl = process.env.APP_URL ?? `https://${c.req.header('host') ?? 'localhost:3000'}`
    await inviteReceptionUser(email, role as any, appUrl)
    return c.json({ ok: true, message: `Invite sent to ${email}.` })
  } catch (err: any) {
    console.error('[settings/invite]', err?.message)
    const msg = err?.message ?? ''
    if (msg.includes('already been invited') || msg.includes('already registered')) {
      return c.json({ ok: false, error: 'That email has already been invited.' })
    }
    return c.json({ ok: false, error: 'Failed to send invite. Please try again.' })
  }
})
