import * as nodemailer from 'nodemailer'
import type { Booking } from '../data/types'

// ── Transport ─────────────────────────────────────────────────────────────────
// Reads SMTP config from env vars. Falls back to a no-op in dev when not set.
function createTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM ?? 'Glido CFS <noreply@glido.com.au>'

  if (!host || !user || !pass) {
    // Return a stub transport that logs instead of sending
    return { sendMail: async (opts: any) => {
      console.log('[email stub]', opts.to, '|', opts.subject)
    }, from }
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
  return { sendMail: transport.sendMail.bind(transport), from }
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const BRAND = '#FC6514'
const baseStyle = `
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  background: #f7f6f5;
  margin: 0;
  padding: 0;
`

function wrap(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyle}">
  <div style="max-width:580px; margin:0 auto; padding:32px 16px 48px;">
    <!-- Header -->
    <div style="text-align:center; margin-bottom:28px;">
      <div style="display:inline-block; background:#1C1917; border-radius:12px; padding:10px 20px;">
        <span style="font-size:18px; font-weight:800; color:#FC6514; letter-spacing:-0.04em;">Glido</span>
        <span style="font-size:11px; font-weight:500; color:rgba(255,255,255,0.40); margin-left:6px;">CFS</span>
      </div>
    </div>
    <!-- Card -->
    <div style="background:#ffffff; border-radius:18px; border:1px solid rgba(0,0,0,0.07); box-shadow:0 2px 8px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.07); overflow:hidden;">
      ${content}
    </div>
    <!-- Footer -->
    <p style="text-align:center; font-size:11px; color:#A8A29E; margin-top:24px; line-height:1.7;">
      Sydney Container Freight Station · Mon–Fri 06:00–18:00<br>
      © 2026 Glido CFS · <a href="https://glido.com.au" style="color:#A8A29E;">glido.com.au</a>
    </p>
  </div>
</body></html>`
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    cleared:     'background:rgba(34,197,94,0.12); color:#16A34A; border:1px solid rgba(34,197,94,0.22);',
    held:        'background:rgba(239,68,68,0.10); color:#DC2626; border:1px solid rgba(239,68,68,0.22);',
    pending:     'background:rgba(251,191,36,0.12); color:#B45309; border:1px solid rgba(251,191,36,0.22);',
    unavailable: 'background:rgba(0,0,0,0.04); color:#78716C; border:1px solid rgba(0,0,0,0.10);',
  }
  const style = map[status] ?? map.unavailable
  return `<span style="display:inline-block; padding:2px 8px; border-radius:9999px; font-size:11px; font-weight:600; ${style}">${status.toUpperCase()}</span>`
}

function row(label: string, value: string): string {
  return `<div style="display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid rgba(0,0,0,0.05);">
    <span style="font-size:12px; color:#78716C;">${label}</span>
    <span style="font-size:12px; font-weight:500; color:#1C1917;">${value}</span>
  </div>`
}

// ── 1. Booking confirmed ──────────────────────────────────────────────────────
export async function sendBookingConfirmation(opts: {
  to: string
  booking: Booking
  tenantName: string
  tenantAddress?: string
  qrDataUrl?: string
}) {
  const { sendMail, from } = createTransport()
  const b = opts.booking

  const chepWarning = b.palletType === 'chep' && b.palletCount
    ? `<div style="background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.22); border-radius:10px; padding:12px 16px; margin:16px 24px 0;">
        <p style="font-size:12px; font-weight:600; color:#B45309; margin:0 0 4px;">Pallet Exchange Required</p>
        <p style="font-size:12px; color:#B45309; margin:0; opacity:0.85;">Bring ${b.palletCount} empty CHEP pallet${b.palletCount > 1 ? 's' : ''} to exchange at the bay on arrival.</p>
      </div>`
    : ''

  const icsSection = b.icsStatus && b.icsStatus !== 'unavailable'
    ? `${row('ICS Customs Status', statusBadge(b.icsStatus))}`
    : ''

  const chargesSection = b.totalAmount
    ? `<div style="padding:16px 24px; background:#f7f6f5; border-top:1px solid rgba(0,0,0,0.06);">
        <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.09em; color:#A8A29E; margin:0 0 10px;">Charges</p>
        ${b.storageCharge ? row('Storage', `$${b.storageCharge.toFixed(2)}`) : ''}
        ${b.shrinkWrapCharge ? row('Shrink Wrap', `$${b.shrinkWrapCharge.toFixed(2)}`) : ''}
        ${b.slotFee ? row('Slot Fee', `$${b.slotFee.toFixed(2)}`) : ''}
        ${b.gstAmount ? row('GST (10%)', `$${b.gstAmount.toFixed(2)}`) : ''}
        <div style="display:flex; justify-content:space-between; padding:8px 0 0; border-top:1px solid rgba(0,0,0,0.08); margin-top:4px;">
          <span style="font-size:13px; font-weight:700; color:#1C1917;">Total</span>
          <span style="font-size:13px; font-weight:800; color:${BRAND};">$${b.totalAmount.toFixed(2)}</span>
        </div>
      </div>`
    : ''

  const html = wrap(`
    <div style="background:${BRAND}; padding:28px 24px 24px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <div style="width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.20); display:flex; align-items:center; justify-content:center; font-size:18px;">✓</div>
        <div>
          <p style="font-size:16px; font-weight:700; color:#fff; margin:0 0 2px;">Booking Confirmed!</p>
          <p style="font-size:11px; font-family:monospace; color:rgba(255,255,255,0.75); margin:0;">${b.referenceNumber}</p>
        </div>
      </div>
    </div>
    <div style="padding:24px;">
      <p style="font-size:13px; color:#78716C; line-height:1.6; margin:0 0 20px;">
        Hi ${b.driverName.split(' ')[0]}, your slot at <strong>${opts.tenantName}</strong> is confirmed. Show the QR code at the kiosk on arrival — no counter stop needed.
      </p>
      <div style="background:#f7f6f5; border-radius:12px; padding:16px 20px; margin-bottom:16px;">
        <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.09em; color:#A8A29E; margin:0 0 10px;">Booking Details</p>
        ${row('Reference', b.referenceNumber)}
        ${row('Driver', b.driverName)}
        ${row('Service', b.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off')}
        ${row('Date', b.slotDate)}
        ${row('Time', `${b.slotStartTime} – ${b.slotEndTime}`)}
        ${b.houseBillNumber ? row('HBL', b.houseBillNumber) : ''}
        ${b.containerNumber ? row('Container', b.containerNumber) : ''}
        ${icsSection}
      </div>
      ${opts.qrDataUrl ? `
        <div style="text-align:center; padding:16px 0;">
          <img src="${opts.qrDataUrl}" width="160" height="160" alt="QR Code" style="border-radius:8px;" />
          <p style="font-size:11px; color:#A8A29E; margin:8px 0 0;">Scan at the kiosk to check in</p>
        </div>` : ''}
      ${chepWarning}
    </div>
    ${chargesSection}
    <div style="padding:16px 24px 24px;">
      <a href="https://glido.com.au/bookings?ref=${b.referenceNumber}"
        style="display:block; text-align:center; padding:12px 20px; background:${BRAND}; color:#fff; border-radius:10px; font-size:13px; font-weight:600; text-decoration:none;">
        View My Booking
      </a>
      ${opts.tenantAddress ? `<p style="font-size:11px; color:#A8A29E; text-align:center; margin:14px 0 0;">${opts.tenantAddress}</p>` : ''}
    </div>
  `)

  await sendMail({
    from,
    to:      opts.to,
    subject: `Booking Confirmed · ${b.referenceNumber} · ${b.slotDate} ${b.slotStartTime}`,
    html,
  })
}

// ── 2. EFT payment reminder ───────────────────────────────────────────────────
export async function sendEftReminder(opts: {
  to: string
  booking: Booking
  bankName: string
  bsb: string
  accountNumber: string
  accountName: string
}) {
  const { sendMail, from } = createTransport()
  const b = opts.booking

  const html = wrap(`
    <div style="padding:28px 24px 20px;">
      <p style="font-size:17px; font-weight:700; color:#1C1917; margin:0 0 8px;">Payment instructions</p>
      <p style="font-size:13px; color:#78716C; line-height:1.6; margin:0 0 20px;">
        Please transfer the amount below within <strong>24 hours</strong> using your booking reference as the payment description.
      </p>
    </div>
    <div style="padding:0 24px 24px;">
      <div style="background:#f7f6f5; border-radius:12px; padding:16px 20px; margin-bottom:16px;">
        <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.09em; color:#A8A29E; margin:0 0 10px;">Bank Transfer Details</p>
        ${row('Bank', opts.bankName)}
        ${row('BSB', opts.bsb)}
        ${row('Account Number', opts.accountNumber)}
        ${row('Account Name', opts.accountName)}
        <div style="display:flex; justify-content:space-between; padding:7px 0; border-top:1px solid rgba(0,0,0,0.08); margin-top:4px;">
          <span style="font-size:12px; font-weight:700; color:#1C1917;">Reference (REQUIRED)</span>
          <span style="font-size:12px; font-weight:700; color:${BRAND}; font-family:monospace;">${b.referenceNumber}</span>
        </div>
      </div>
      <div style="background:#f7f6f5; border-radius:12px; padding:16px 20px;">
        <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.09em; color:#A8A29E; margin:0 0 10px;">Amount Due</p>
        <p style="font-size:24px; font-weight:800; color:${BRAND}; margin:0;">$${b.totalAmount?.toFixed(2) ?? '0.00'}</p>
      </div>
    </div>
  `)

  await sendMail({
    from,
    to:      opts.to,
    subject: `Payment Due · ${b.referenceNumber} · $${b.totalAmount?.toFixed(2) ?? '0.00'}`,
    html,
  })
}

// ── 3. Booking reminder (24h before) ────────────────────────────────────────
export async function sendBookingReminder(opts: {
  to: string
  booking: Booking
  tenantName: string
  qrDataUrl?: string
}) {
  const { sendMail, from } = createTransport()
  const b = opts.booking
  const name = b.driverName.split(' ')[0]

  const html = wrap(`
    <div style="background:#1C1917; padding:28px 24px 24px;">
      <p style="font-size:16px; font-weight:700; color:#fff; margin:0 0 4px;">Your visit is tomorrow ⏰</p>
      <p style="font-size:12px; color:rgba(255,255,255,0.50); margin:0;">${opts.tenantName}</p>
    </div>
    <div style="padding:24px;">
      <p style="font-size:13px; color:#78716C; line-height:1.6; margin:0 0 20px;">
        Hi ${name}, just a reminder — you have a slot at <strong>${opts.tenantName}</strong> tomorrow.
        Have your QR code ready on your phone before you arrive.
      </p>
      <div style="background:#f7f6f5; border-radius:12px; padding:16px 20px; margin-bottom:16px;">
        ${row('Date', b.slotDate)}
        ${row('Time', `${b.slotStartTime} – ${b.slotEndTime}`)}
        ${row('Reference', b.referenceNumber)}
        ${row('Service', b.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off')}
      </div>
      ${opts.qrDataUrl ? `
        <div style="text-align:center; padding:12px 0 4px;">
          <img src="${opts.qrDataUrl}" width="140" height="140" alt="QR Code" style="border-radius:8px;" />
          <p style="font-size:11px; color:#A8A29E; margin:8px 0 0;">Scan this at the kiosk</p>
        </div>` : ''}
      ${b.palletType === 'chep' && b.palletCount ? `
        <div style="background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.22); border-radius:10px; padding:12px 16px; margin-top:16px;">
          <p style="font-size:12px; color:#B45309; margin:0; font-weight:600;">Remember: bring ${b.palletCount} empty CHEP pallet${b.palletCount > 1 ? 's' : ''} to exchange.</p>
        </div>` : ''}
    </div>
  `)

  await sendMail({
    from,
    to:      opts.to,
    subject: `Reminder: Visit tomorrow at ${b.slotStartTime} · ${b.referenceNumber}`,
    html,
  })
}

// ── 4. ICS hold alert to reception admin ─────────────────────────────────────
export async function sendIcsHoldAlert(opts: {
  to: string          // reception admin email
  booking: Booking
  tenantName: string
}) {
  const { sendMail, from } = createTransport()
  const b = opts.booking

  const html = wrap(`
    <div style="background:rgba(239,68,68,0.90); padding:24px;">
      <p style="font-size:16px; font-weight:700; color:#fff; margin:0 0 4px;">⚠ ICS Hold Detected</p>
      <p style="font-size:12px; color:rgba(255,255,255,0.75); margin:0;">${opts.tenantName} · Reception Alert</p>
    </div>
    <div style="padding:24px;">
      <p style="font-size:13px; color:#78716C; line-height:1.6; margin:0 0 20px;">
        Booking <strong>${b.referenceNumber}</strong> has a customs hold.
        The shipment will not be released until the hold is resolved.
        Contact the booking holder to action this via the ICS portal.
      </p>
      <div style="background:#f7f6f5; border-radius:12px; padding:16px 20px;">
        ${row('Reference', b.referenceNumber)}
        ${row('Driver', b.driverName)}
        ${row('Slot', `${b.slotDate} · ${b.slotStartTime}–${b.slotEndTime}`)}
        ${b.houseBillNumber ? row('HBL', b.houseBillNumber) : ''}
        ${b.containerNumber ? row('Container', b.containerNumber) : ''}
        ${row('ICS Status', statusBadge('held'))}
      </div>
      <div style="margin-top:20px;">
        <a href="https://glido.com.au/reception"
          style="display:block; text-align:center; padding:12px 20px; background:#EF4444; color:#fff; border-radius:10px; font-size:13px; font-weight:600; text-decoration:none;">
          Open Reception Dashboard
        </a>
      </div>
    </div>
  `)

  await sendMail({
    from,
    to:      opts.to,
    subject: `ICS Hold — ${b.referenceNumber} — Action Required`,
    html,
  })
}

// ── 5. Booking completed (optional, tenant setting) ───────────────────────────
export async function sendBookingCompleted(opts: {
  to: string
  booking: Booking
  tenantName: string
}) {
  const { sendMail, from } = createTransport()
  const b = opts.booking
  const name = b.driverName.split(' ')[0]

  const html = wrap(`
    <div style="background:#16A34A; padding:24px;">
      <p style="font-size:16px; font-weight:700; color:#fff; margin:0 0 4px;">Visit completed ✓</p>
      <p style="font-size:12px; color:rgba(255,255,255,0.70); margin:0;">${opts.tenantName}</p>
    </div>
    <div style="padding:24px;">
      <p style="font-size:13px; color:#78716C; line-height:1.6; margin:0 0 16px;">
        Hi ${name}, your visit on <strong>${b.slotDate}</strong> at ${opts.tenantName} has been completed. Thank you for using Glido.
      </p>
      <div style="background:#f7f6f5; border-radius:12px; padding:16px 20px;">
        ${row('Reference', b.referenceNumber)}
        ${row('Service', b.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off')}
        ${row('Completed', b.completedAt ? new Date(b.completedAt).toLocaleString('en-AU') : '—')}
      </div>
      <div style="margin-top:20px;">
        <a href="https://glido.com.au/book"
          style="display:block; text-align:center; padding:12px 20px; background:${BRAND}; color:#fff; border-radius:10px; font-size:13px; font-weight:600; text-decoration:none;">
          Book Another Visit
        </a>
      </div>
    </div>
  `)

  await sendMail({
    from,
    to:      opts.to,
    subject: `Visit Completed · ${b.referenceNumber} · ${b.slotDate}`,
    html,
  })
}
