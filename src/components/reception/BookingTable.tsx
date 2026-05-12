import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_ROW_CLASS, STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL, ICS_LABEL, ICS_BADGE_CLASS } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  bookings: Booking[]
  title?: string
  showFilters?: boolean
}

type StatusVariant = 'warning' | 'default' | 'success' | 'secondary' | 'outline' | 'destructive'

export const BookingTable = ({ bookings, title = "Today's Bookings", showFilters = false }: Props) => (
  <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h2 class="font-semibold text-slate-800">{title}</h2>
      <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">{bookings.length} records</span>
    </div>

    {showFilters && (
      <div class="px-5 py-3 border-b border-slate-100 flex flex-wrap gap-3 items-center">
        <Icon name={ICONS.filter} size={16} class="text-slate-400" />
        <select
          name="status"
          hx-get="/reception/bookings"
          hx-target="#bookings-table"
          hx-swap="outerHTML"
          hx-include="[name='status'],[name='service'],[name='date']"
          class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          hx-include="[name='status'],[name='service'],[name='date']"
          class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          hx-include="[name='status'],[name='service'],[name='date']"
          hx-trigger="change"
          class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )}

    <div class="overflow-x-auto" id="bookings-table">
      {bookings.length === 0 ? (
        <div class="text-center py-12 text-slate-400">
          <Icon name={ICONS.bookings} size={40} class="mx-auto mb-2 text-slate-300" />
          <p class="text-sm">No bookings match your filters.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <TableHead class="text-left px-5 py-3 font-semibold">Reference</TableHead>
              <TableHead class="text-left px-4 py-3 font-semibold">Driver</TableHead>
              <TableHead class="text-left px-4 py-3 font-semibold">Slot</TableHead>
              <TableHead class="text-left px-4 py-3 font-semibold">Service</TableHead>
              <TableHead class="text-left px-4 py-3 font-semibold">HBL</TableHead>
              <TableHead class="text-left px-4 py-3 font-semibold">ICS</TableHead>
              <TableHead class="text-left px-4 py-3 font-semibold">Status</TableHead>
              <TableHead class="px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="divide-y divide-slate-100">
            {bookings.map((b) => {
              // ICS held override: red row
              const icsRowClass = b.icsStatus === 'held' ? 'bg-red-50 hover:bg-red-100' : STATUS_ROW_CLASS[b.status]
              return (
                <TableRow
                  key={b.id}
                  class={`transition-colors cursor-pointer ${icsRowClass}`}
                  hx-get={`/reception/bookings/${b.id}`}
                  hx-target="#slide-over-content"
                  hx-swap="innerHTML"
                  {...{"hx-on:htmx:after-request": "document.getElementById('slide-over-backdrop').classList.remove('hidden'); document.getElementById('slide-over').classList.remove('translate-x-full')"}}
                >
                  <TableCell class="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">{b.referenceNumber}</TableCell>
                  <TableCell class="px-4 py-3.5">
                    <p class="font-semibold text-slate-800">{b.driverName}</p>
                    <p class="text-xs text-slate-400">{b.driverPhone || '—'}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <p class="font-semibold text-slate-800">{b.slotStartTime} – {b.slotEndTime}</p>
                    <p class="text-xs text-slate-400">{b.slotDate}</p>
                  </TableCell>
                  <TableCell class="px-4 py-3.5 text-slate-600 text-xs font-medium">
                    {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
                  </TableCell>
                  <TableCell class="px-4 py-3.5 font-mono text-xs text-slate-600">
                    {b.houseBillNumber || b.containerNumber || '—'}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    {b.icsStatus ? (
                      <span class={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}>
                        {ICS_LABEL[b.icsStatus]}
                      </span>
                    ) : (
                      <span class="text-slate-400 text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell class="px-4 py-3.5">
                    <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant}>
                      {STATUS_LABEL[b.status]}
                    </Badge>
                  </TableCell>
                  <TableCell class="px-4 py-3.5 text-slate-300">
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
