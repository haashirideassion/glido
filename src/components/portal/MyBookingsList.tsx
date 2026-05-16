import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, SERVICE_LABEL, LOAD_LABEL } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  bookings: Booking[]
  query?: string
}

const STATUS_STYLE: Record<string, string> = {
  confirmed:      'background:rgba(34,197,94,0.12); color:#22C55E; border:1px solid rgba(34,197,94,0.22);',
  checked_in:     'background:rgba(252,101,20,0.12); color:#FC6514; border:1px solid rgba(252,101,20,0.25);',
  completed:      'background:rgba(148,163,184,0.10); color:#94A3B8; border:1px solid rgba(148,163,184,0.20);',
  cancelled:      'background:rgba(239,68,68,0.10); color:#EF4444; border:1px solid rgba(239,68,68,0.22);',
  pending:        'background:rgba(251,191,36,0.10); color:#FBBF24; border:1px solid rgba(251,191,36,0.22);',
  pending_eft:    'background:rgba(56,189,248,0.10); color:#38BDF8; border:1px solid rgba(56,189,248,0.22);',
  no_show:        'background:rgba(148,163,184,0.08); color:#64748B; border:1px solid rgba(148,163,184,0.15);',
}

export const MyBookingsList = ({ bookings, query }: Props) => {
  if (bookings.length === 0) {
    return (
      <div style="text-align:center; padding:64px 0 48px;">
        <div style="width:48px; height:48px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 12px rgba(0,0,0,0.40);">
          <Icon name={ICONS.bookings} size={22} style="color:#64748B;" />
        </div>
        <p style="font-size:15px; font-weight:600; color:#F1F5F9; margin-bottom:6px; letter-spacing:-0.01em;">
          {query ? `No results for "${query}"` : 'No bookings yet'}
        </p>
        <p style="font-size:13px; color:#64748B; margin-bottom:24px;">
          {query ? 'Check the reference number and try again.' : 'Your booking history will appear here.'}
        </p>
        <a
          href="/book"
          class="btn-primary" style="padding:10px 20px; font-size:13px; text-decoration:none;"
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
          style="background:linear-gradient(180deg,#1F2831 0%,#1A2028 100%); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:18px 20px; transition:border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1); margin-bottom:8px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.20), 0 4px 16px rgba(0,0,0,0.40);"
          onmouseover="this.style.borderColor='rgba(255,255,255,0.13)'; this.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 28px rgba(0,0,0,0.55)'; this.style.transform='translateY(-1px)';"
          onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'; this.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.20), 0 4px 16px rgba(0,0,0,0.40)'; this.style.transform='translateY(0)';"
        >
          {/* Top row: reference + status */}
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
            <div>
              <p style="font-family:ui-monospace,monospace; font-size:13.5px; font-weight:700; color:#FC6514; letter-spacing:0.03em; margin-bottom:3px;">
                {b.referenceNumber}
              </p>
              <p style="font-size:12px; color:#64748B; display:flex; align-items:center; gap:5px;">
                <Icon name={ICONS.calendar} size={12} style="color:#64748B;" />
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
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px 16px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.07);">
            <div>
              <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#64748B; margin-bottom:3px;">Service</p>
              <p style="font-size:13px; font-weight:500; color:#F1F5F9;">
                {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
              </p>
            </div>

            {b.houseBillNumber && (
              <div>
                <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#64748B; margin-bottom:3px;">HBL</p>
                <p style="font-family:ui-monospace,monospace; font-size:12px; font-weight:600; color:#94A3B8;">{b.houseBillNumber}</p>
              </div>
            )}

            {b.containerNumber && (
              <div>
                <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#64748B; margin-bottom:3px;">Container</p>
                <p style="font-family:ui-monospace,monospace; font-size:12px; font-weight:600; color:#94A3B8;">{b.containerNumber}</p>
              </div>
            )}

            <div>
              <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#64748B; margin-bottom:3px;">Driver</p>
              <p style="font-size:13px; font-weight:500; color:#F1F5F9; display:flex; align-items:center; gap:5px;">
                <Icon name={ICONS.user} size={12} style="color:#64748B; flex-shrink:0;" />
                {b.driverName}
              </p>
            </div>

            {b.weightKg && (
              <div>
                <p style="font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#64748B; margin-bottom:3px;">Weight</p>
                <p style="font-size:12px; color:#94A3B8;">{b.weightKg.toLocaleString()} kg</p>
              </div>
            )}
          </div>

          {/* Timeline row */}
          {(b.checkedInAt || b.completedAt) && (
            <div style="display:flex; gap:16px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.07);">
              {b.checkedInAt && (
                <span style="display:flex; align-items:center; gap:5px; font-size:11px; color:#64748B;">
                  <Icon name={ICONS.clock} size={11} />
                  Checked in {new Date(b.checkedInAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              {b.completedAt && (
                <span style="display:flex; align-items:center; gap:5px; font-size:11px; color:#22C55E;">
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
