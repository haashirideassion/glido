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

const SELECT_STYLE = "font-size:13px; border-radius:8px; padding:6px 10px; outline:none; background:rgba(9,13,18,0.60); border:1px solid rgba(255,255,255,0.09); color:#F1F5F9; box-shadow:inset 0 2px 4px rgba(0,0,0,0.25); cursor:pointer;"

export const BookingTable = ({ bookings, title = "Today's Bookings", showFilters = false }: Props) => (
  <div
    class="rounded-xl overflow-hidden"
    style="background:linear-gradient(180deg,#1F2831 0%,#1A2028 100%); border:1px solid rgba(255,255,255,0.07); box-shadow:inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.40);"
  >
    <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.07);">
      <h2 style="font-size:14px; font-weight:600; color:#F1F5F9;">{title}</h2>
      <span style="font-size:11px; font-weight:500; color:#64748B; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:9999px; padding:3px 10px;">
        {bookings.length} records
      </span>
    </div>

    {showFilters && (
      <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding:12px 20px; border-bottom:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.02);">
        <Icon name={ICONS.filter} size={15} style="color:#64748B;" />

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
        <div style="text-align:center; padding:48px 0; color:#64748B;">
          <Icon name={ICONS.bookings} size={36} style="margin:0 auto 10px; opacity:0.25;" />
          <p style="font-size:13px;">No bookings match your filters.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow style="background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.07);">
              {['Reference','Driver','Slot','Service','HBL','ICS','Status',''].map((h) => (
                <TableHead
                  key={h}
                  class="text-left px-5 py-3"
                  style="font-size:10px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap;"
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
                rowBg = 'rgba(239,68,68,0.06)'
              } else if (b.status === 'checked_in') {
                rowBg = 'rgba(34,197,94,0.05)'
              } else if (b.status === 'completed') {
                rowBg = 'rgba(255,255,255,0.02)'
              }

              return (
                <TableRow
                  key={b.id}
                  style={`border-bottom:1px solid rgba(255,255,255,0.06); cursor:pointer; transition:background 0.12s ease;${rowBg ? ` background:${rowBg};` : ''}`}
                  onmouseover={`this.style.background='rgba(255,255,255,0.04)'`}
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
                    <p style="font-size:13px; font-weight:600; color:#F1F5F9;">{b.driverName}</p>
                    <p style="font-size:11px; color:#64748B;">{b.driverPhone || '—'}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <p style="font-size:13px; font-weight:600; color:#F1F5F9; white-space:nowrap;">{b.slotStartTime} – {b.slotEndTime}</p>
                    <p style="font-size:11px; color:#64748B;">{b.slotDate}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5" style="font-size:12px; font-weight:500; color:#94A3B8; white-space:nowrap;">
                    {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
                  </TableCell>
                  <TableCell class="px-4 py-3.5" style="font-family:ui-monospace,monospace; font-size:12px; color:#94A3B8;">
                    {b.houseBillNumber || b.containerNumber || '—'}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    {b.icsStatus ? (
                      <span class={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}>
                        {ICS_LABEL[b.icsStatus]}
                      </span>
                    ) : (
                      <span style="font-size:12px; color:#64748B;">—</span>
                    )}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant}>
                      {STATUS_LABEL[b.status]}
                    </Badge>
                  </TableCell>
                  <TableCell class="px-4 py-3.5" style="color:rgba(255,255,255,0.20);">
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
