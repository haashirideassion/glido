import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, SERVICE_LABEL, LOAD_LABEL } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  bookings: Booking[]
  query?: string
}

const STATUS_STYLE: Record<string, string> = {
  confirmed:      'background:rgba(22,163,74,0.10); color:#15803D; border:1px solid rgba(22,163,74,0.2);',
  checked_in:     'background:rgba(249,115,22,0.10); color:#C2550A; border:1px solid rgba(249,115,22,0.22);',
  completed:      'background:rgba(168,162,158,0.12); color:#57534E; border:1px solid rgba(168,162,158,0.2);',
  cancelled:      'background:rgba(220,38,38,0.08); color:#B91C1C; border:1px solid rgba(220,38,38,0.15);',
  pending:        'background:rgba(217,119,6,0.10); color:#92400E; border:1px solid rgba(217,119,6,0.2);',
  pending_eft:    'background:rgba(37,99,235,0.08); color:#1E3A8A; border:1px solid rgba(37,99,235,0.15);',
  no_show:        'background:rgba(168,162,158,0.10); color:#78716C; border:1px solid rgba(168,162,158,0.18);',
}

export const MyBookingsList = ({ bookings, query }: Props) => {
  if (bookings.length === 0) {
    return (
      <div style="text-align:center; padding:64px 0 48px;">
        <div style="width:48px; height:48px; border-radius:14px; background:rgba(249,115,22,0.08); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <Icon name={ICONS.bookings} size={22} style="color:rgba(249,115,22,0.5);" />
        </div>
        <p style="font-size:15px; font-weight:600; color:#1C1917; margin-bottom:6px; letter-spacing:-0.01em;">
          {query ? `No results for "${query}"` : 'No bookings yet'}
        </p>
        <p style="font-size:13px; color:#78716C; margin-bottom:24px;">
          {query ? 'Check the reference number and try again.' : 'Your booking history will appear here.'}
        </p>
        <a
          href="/book"
          style="display:inline-flex; align-items:center; gap:7px; padding:10px 20px; font-size:13px; font-weight:500; color:white; background:linear-gradient(135deg,#F97316,#EA6C0A); border-radius:9999px; text-decoration:none; box-shadow:rgba(249,115,22,0.22) 0px 4px 12px 0px;"
        >
          <Icon name={ICONS.calendar} size={14} />
          Book a Visit
        </a>
      </div>
    )
  }

  return (
    <div style="display:flex; flex-direction:column; gap:2px;">
      {bookings.map((b) => (
        <div
          key={b.id}
          style="background:rgba(255,247,237,0.7); border:1.5px solid rgba(249,115,22,0.10); border-radius:16px; padding:18px 20px; transition:border-color 0.15s ease, box-shadow 0.15s ease; margin-bottom:8px;"
          onmouseover="this.style.borderColor='rgba(249,115,22,0.22)'; this.style.boxShadow='rgba(180,170,160,0.14) 0px 4px 16px -4px';"
          onmouseout="this.style.borderColor='rgba(249,115,22,0.10)'; this.style.boxShadow='none';"
        >
          {/* Top row: reference + status */}
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
            <div>
              <p style="font-family:ui-monospace,monospace; font-size:13.5px; font-weight:700; color:#1C1917; letter-spacing:0.03em; margin-bottom:3px;">
                {b.referenceNumber}
              </p>
              <p style="font-size:12px; color:#78716C; display:flex; align-items:center; gap:5px;">
                <Icon name={ICONS.calendar} size={12} style="color:#A8A29E;" />
                {b.slotDate} · {b.slotStartTime} – {b.slotEndTime}
              </p>
            </div>
            <span
              style={`display:inline-block; padding:4px 10px; border-radius:9999px; font-size:11px; font-weight:600; white-space:nowrap; ${STATUS_STYLE[b.status] || STATUS_STYLE.pending}`}
            >
              {STATUS_LABEL[b.status] || b.status}
            </span>
          </div>

          {/* Info row */}
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px 16px; padding-top:12px; border-top:1px solid rgba(249,115,22,0.08);">
            <div>
              <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#A8A29E; margin-bottom:3px;">Service</p>
              <p style="font-size:13px; font-weight:500; color:#1C1917;">
                {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
              </p>
            </div>

            {b.houseBillNumber && (
              <div>
                <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#A8A29E; margin-bottom:3px;">HBL</p>
                <p style="font-family:ui-monospace,monospace; font-size:12px; font-weight:600; color:#1C1917;">{b.houseBillNumber}</p>
              </div>
            )}

            {b.containerNumber && (
              <div>
                <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#A8A29E; margin-bottom:3px;">Container</p>
                <p style="font-family:ui-monospace,monospace; font-size:12px; font-weight:600; color:#1C1917;">{b.containerNumber}</p>
              </div>
            )}

            <div>
              <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#A8A29E; margin-bottom:3px;">Driver</p>
              <p style="font-size:13px; font-weight:500; color:#1C1917; display:flex; align-items:center; gap:5px;">
                <Icon name={ICONS.user} size={12} style="color:#A8A29E; flex-shrink:0;" />
                {b.driverName}
              </p>
            </div>

            {b.weightKg && (
              <div>
                <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#A8A29E; margin-bottom:3px;">Weight</p>
                <p style="font-size:12px; color:#57534E;">{b.weightKg.toLocaleString()} kg</p>
              </div>
            )}
          </div>

          {/* Timeline row */}
          {(b.checkedInAt || b.completedAt) && (
            <div style="display:flex; gap:16px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(249,115,22,0.08);">
              {b.checkedInAt && (
                <span style="display:flex; align-items:center; gap:5px; font-size:11px; color:#A8A29E;">
                  <Icon name={ICONS.clock} size={11} />
                  Checked in {new Date(b.checkedInAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              {b.completedAt && (
                <span style="display:flex; align-items:center; gap:5px; font-size:11px; color:#16A34A;">
                  <Icon name={ICONS.check} size={11} />
                  Completed {new Date(b.completedAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
