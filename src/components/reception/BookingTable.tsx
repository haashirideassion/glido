import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table'
import { Badge } from '../ui/badge'
import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL, ICS_LABEL, ICS_BADGE_CLASS } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  bookings: Booking[]
  title?: string
  showFilters?: boolean
}

type StatusVariant = 'warning' | 'default' | 'success' | 'secondary' | 'outline' | 'destructive'

const SELECT_STYLE = "font-size:13px; border-radius:8px; padding:6px 10px; outline:none; background:#EBEBEA; border:1px solid rgba(0,0,0,0.10); color:#1C1917; cursor:pointer;"

export const BookingTable = ({ bookings, title = "Today's Bookings", showFilters = false }: Props) => (
  <div
    class="rounded-xl overflow-hidden"
    style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07);"
  >
    <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid rgba(0,0,0,0.07);">
      <h2 style="font-size:14px; font-weight:600; color:#1C1917;">{title}</h2>
      <span style="font-size:11px; font-weight:500; color:#78716C; background:rgba(0,0,0,0.02); border:1px solid rgba(0,0,0,0.07); border-radius:9999px; padding:3px 10px;">
        {bookings.length} records
      </span>
    </div>

    {showFilters && (
      <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding:12px 20px; border-bottom:1px solid rgba(0,0,0,0.07); background:rgba(0,0,0,0.01);">
        <Icon name={ICONS.filter} size={15} style="color:#A8A29E;" />

        <select
          name="status"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          style={SELECT_STYLE}
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="checked_in">Checked In</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          name="service"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          style={SELECT_STYLE}
        >
          <option value="">All Services</option>
          <option value="pickup">Pick Up</option>
          <option value="dropoff">Drop Off</option>
        </select>

        <input
          type="date"
          name="date"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          hx-trigger="change"
          style={SELECT_STYLE}
        />

        <input
          type="text"
          name="search"
          placeholder="Search ref, driver, HBL…"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          hx-trigger="input changed delay:300ms"
          style={SELECT_STYLE + "min-width:200px;"}
        />
      </div>
    )}

    <div style="overflow-x:auto;" id="bookings-table">
      {bookings.length === 0 ? (
        <div style="text-align:center; padding:48px 0; color:#A8A29E;">
          <Icon name={ICONS.bookings} size={36} style="margin:0 auto 10px; opacity:0.25;" />
          <p style="font-size:13px;">No bookings match your filters.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow style="background:#F7F6F5; border-bottom:1px solid rgba(0,0,0,0.07);">
              {['Reference','Driver','Slot','Service','HBL','ICS','Status',''].map((h) => (
                <TableHead
                  key={h}
                  class="text-left px-5 py-3"
                  style="font-size:10px; font-weight:700; color:#78716C; text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap;"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody style="border-top:none;">
            {bookings.map((b) => {
              let rowBg = ''
              if (b.icsStatus === 'held') {
                rowBg = 'rgba(239,68,68,0.05)'
              } else if (b.status === 'checked_in') {
                rowBg = 'rgba(34,197,94,0.04)'
              } else if (b.status === 'completed') {
                rowBg = 'rgba(0,0,0,0.01)'
              }

              return (
                <TableRow
                  key={b.id}
                  style={`border-bottom:1px solid rgba(0,0,0,0.06); cursor:pointer; transition:background 0.12s ease;${rowBg ? ` background:${rowBg};` : ''}`}
                  onmouseover={`this.style.background='rgba(252,101,20,0.03)'`}
                  onmouseout={`this.style.background='${rowBg}'`}
                  hx-get={`/reception/bookings/${b.id}`}
                  hx-target="#slide-over-content"
                  hx-swap="innerHTML"
                  {...{"hx-on:htmx:after-request": "document.getElementById('slide-over-backdrop').classList.remove('hidden'); document.getElementById('slide-over').classList.remove('translate-x-full')"}}
                >
                  <TableCell class="px-5 py-3.5" style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#FC6514; white-space:nowrap;">
                    {b.referenceNumber}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <p style="font-size:13px; font-weight:600; color:#1C1917;">{b.driverName}</p>
                    <p style="font-size:11px; color:#A8A29E;">{b.driverPhone || '—'}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <p style="font-size:13px; font-weight:600; color:#1C1917; white-space:nowrap;">{b.slotStartTime} – {b.slotEndTime}</p>
                    <p style="font-size:11px; color:#A8A29E;">{b.slotDate}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5" style="font-size:12px; font-weight:500; color:#78716C; white-space:nowrap;">
                    {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
                  </TableCell>
                  <TableCell class="px-4 py-3.5" style="font-family:ui-monospace,monospace; font-size:12px; color:#78716C;">
                    {b.houseBillNumber || b.containerNumber || '—'}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    {b.icsStatus ? (
                      <span class={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}>
                        {ICS_LABEL[b.icsStatus]}
                      </span>
                    ) : (
                      <span style="font-size:12px; color:#A8A29E;">—</span>
                    )}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant}>
                      {STATUS_LABEL[b.status]}
                    </Badge>
                  </TableCell>
                  <TableCell class="px-4 py-3.5" style="color:rgba(0,0,0,0.30);">
                    <Icon name={ICONS.arrowRight} size={16} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  </div>
)
