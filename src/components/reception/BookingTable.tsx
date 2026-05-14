import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL, ICS_LABEL, ICS_BADGE_CLASS } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  bookings: Booking[]
  title?: string
  showFilters?: boolean
}

type StatusVariant = 'warning' | 'default' | 'success' | 'secondary' | 'outline' | 'destructive'

export const BookingTable = ({ bookings, title = "Today's Bookings", showFilters = false }: Props) => (
  <div
    class="rounded-xl overflow-hidden"
    style="background:#FCFBF8; border:1px solid #D6D3D1"
  >
    <div class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid #E7E5E4">
      <h2 class="font-semibold" style="color:#44403C">{title}</h2>
      <span
        class="text-xs px-2.5 py-1 rounded-full font-medium"
        style="color:#A8A29E; background:#EAE6DE"
      >
        {bookings.length} records
      </span>
    </div>

    {showFilters && (
      <div class="px-5 py-3 flex flex-wrap gap-3 items-center" style="border-bottom:1px solid #E7E5E4; background:#F5F3EC">
        <Icon name={ICONS.filter} size={16} style="color:#A8A29E" />

        {/* Status filter */}
        <select
          name="status"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          class="text-sm rounded-lg px-3 py-1.5 focus:outline-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="checked_in">Checked In</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Service filter */}
        <select
          name="service"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          class="text-sm rounded-lg px-3 py-1.5 focus:outline-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        >
          <option value="">All Services</option>
          <option value="pickup">Pick Up</option>
          <option value="dropoff">Drop Off</option>
        </select>

        {/* Date filter */}
        <input
          type="date"
          name="date"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          hx-trigger="change"
          class="text-sm rounded-lg px-3 py-1.5 focus:outline-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        />

        {/* Text search */}
        <input
          type="text"
          name="search"
          placeholder="Search ref, driver, HBL…"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date'],[name='search']"
          hx-trigger="input changed delay:300ms"
          class="text-sm rounded-lg px-3 py-1.5 focus:outline-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C; min-width:200px"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        />
      </div>
    )}

    <div class="overflow-x-auto" id="bookings-table">
      {bookings.length === 0 ? (
        <div class="text-center py-12" style="color:#A8A29E">
          <Icon name={ICONS.bookings} size={40} class="mx-auto mb-2" style="color:#D6D3D1" />
          <p class="text-sm">No bookings match your filters.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow style="background:#F5F3EC; border-bottom:1px solid #D6D3D1">
              <TableHead
                class="text-left px-5 py-3 font-semibold"
                style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
              >
                Reference
              </TableHead>
              <TableHead
                class="text-left px-4 py-3 font-semibold"
                style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
              >
                Driver
              </TableHead>
              <TableHead
                class="text-left px-4 py-3 font-semibold"
                style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
              >
                Slot
              </TableHead>
              <TableHead
                class="text-left px-4 py-3 font-semibold"
                style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
              >
                Service
              </TableHead>
              <TableHead
                class="text-left px-4 py-3 font-semibold"
                style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
              >
                HBL
              </TableHead>
              <TableHead
                class="text-left px-4 py-3 font-semibold"
                style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
              >
                ICS
              </TableHead>
              <TableHead
                class="text-left px-4 py-3 font-semibold"
                style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
              >
                Status
              </TableHead>
              <TableHead class="px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody style="border-top:none">
            {bookings.map((b) => {
              // Determine row background based on priority: ICS held > checked_in > completed > default
              let rowBg = ''
              if (b.icsStatus === 'held') {
                rowBg = '#FEF2F2'
              } else if (b.status === 'checked_in') {
                rowBg = '#F0FDF4'
              } else if (b.status === 'completed') {
                rowBg = '#F9FAFB'
              }

              return (
                <TableRow
                  key={b.id}
                  class="transition-colors cursor-pointer"
                  style={rowBg ? `background:${rowBg}; border-bottom:1px solid #E7E5E4` : 'border-bottom:1px solid #E7E5E4'}
                  onmouseover={`this.style.background='#F5F3EC'`}
                  onmouseout={`this.style.background='${rowBg}'`}
                  hx-get={`/reception/bookings/${b.id}`}
                  hx-target="#slide-over-content"
                  hx-swap="innerHTML"
                  {...{"hx-on:htmx:after-request": "document.getElementById('slide-over-backdrop').classList.remove('hidden'); document.getElementById('slide-over').classList.remove('translate-x-full')"}}
                >
                  <TableCell class="px-5 py-3.5 font-mono text-xs font-bold" style="color:#57534E">
                    {b.referenceNumber}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <p class="font-semibold" style="color:#44403C">{b.driverName}</p>
                    <p class="text-xs" style="color:#A8A29E">{b.driverPhone || '—'}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <p class="font-semibold" style="color:#44403C">{b.slotStartTime} – {b.slotEndTime}</p>
                    <p class="text-xs" style="color:#A8A29E">{b.slotDate}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5 text-xs font-medium" style="color:#78716C">
                    {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
                  </TableCell>
                  <TableCell class="px-4 py-3.5 font-mono text-xs" style="color:#78716C">
                    {b.houseBillNumber || b.containerNumber || '—'}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    {b.icsStatus ? (
                      <span class={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}>
                        {ICS_LABEL[b.icsStatus]}
                      </span>
                    ) : (
                      <span class="text-xs" style="color:#A8A29E">—</span>
                    )}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant}>
                      {STATUS_LABEL[b.status]}
                    </Badge>
                  </TableCell>
                  <TableCell class="px-4 py-3.5" style="color:#D6D3D1">
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
