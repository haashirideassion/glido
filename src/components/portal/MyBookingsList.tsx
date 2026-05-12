import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  bookings: Booking[]
  query?: string
}

type StatusVariant = 'warning' | 'default' | 'success' | 'secondary' | 'outline' | 'destructive'

export const MyBookingsList = ({ bookings, query }: Props) => {
  if (bookings.length === 0) {
    return (
      <div class="text-center py-16 text-slate-400">
        <Icon name={ICONS.bookings} size={52} class="mx-auto mb-3 text-slate-300" />
        <p class="font-semibold text-slate-500 text-lg">No bookings found</p>
        {query && <p class="text-sm mt-1">No results for "{query}"</p>}
        <a href="/book" class="mt-5 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium">
          Book a visit now
          <Icon name={ICONS.arrowRight} size={14} />
        </a>
      </div>
    )
  }

  return (
    <div class="space-y-4">
      {bookings.map((b) => (
        <Card key={b.id} class="hover:shadow-md transition-shadow">
          <CardContent class="pt-5 pb-5">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <p class="font-mono text-sm font-bold text-slate-800">{b.referenceNumber}</p>
                <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Icon name={ICONS.calendar} size={12} />
                  {b.slotDate} · {b.slotStartTime} – {b.slotEndTime}
                </p>
              </div>
              <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant}>
                {STATUS_LABEL[b.status]}
              </Badge>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <div>
                <p class="text-xs text-slate-400">Service</p>
                <p class="font-medium">{SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}</p>
              </div>
              {b.houseBillNumber && (
                <div>
                  <p class="text-xs text-slate-400">HBL</p>
                  <p class="font-mono text-xs font-semibold">{b.houseBillNumber}</p>
                </div>
              )}
              {b.containerNumber && (
                <div>
                  <p class="text-xs text-slate-400">Container</p>
                  <p class="font-mono text-xs font-semibold">{b.containerNumber}</p>
                </div>
              )}
              <div>
                <p class="text-xs text-slate-400">Driver</p>
                <p class="font-medium flex items-center gap-1">
                  <Icon name={ICONS.user} size={13} class="text-slate-400" />
                  {b.driverName}
                </p>
              </div>
              {b.weightKg && (
                <div>
                  <p class="text-xs text-slate-400">Weight</p>
                  <p class="text-xs text-slate-600">{b.weightKg.toLocaleString()} kg</p>
                </div>
              )}
            </div>

            {(b.checkedInAt || b.completedAt) && (
              <div class="mt-3 pt-3 border-t border-slate-100 flex gap-4 text-xs text-slate-400">
                {b.checkedInAt && (
                  <span class="flex items-center gap-1">
                    <Icon name={ICONS.clock} size={12} />
                    Checked in: {new Date(b.checkedInAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {b.completedAt && (
                  <span class="flex items-center gap-1">
                    <Icon name={ICONS.check} size={12} class="text-green-500" />
                    Completed: {new Date(b.completedAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
