import { mockBookings } from '../../data/bookings'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table'
import { STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL } from '../../lib/constants'
import type { BookingStatus } from '../../data/types'

type StatusVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'

export const ReportsView = () => {
  const byDate: Record<string, typeof mockBookings> = {}
  mockBookings.forEach((b) => {
    if (!byDate[b.slotDate]) byDate[b.slotDate] = []
    byDate[b.slotDate].push(b)
  })

  const dates = Object.keys(byDate).sort().reverse()

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-semibold text-foreground">Booking Reports</h2>
          <p class="text-sm text-foreground-muted mt-0.5">Summary of depot activity by date</p>
        </div>
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: mockBookings.length },
          { label: 'Completed',      value: mockBookings.filter((b) => b.status === 'completed').length },
          { label: 'Cancelled',      value: mockBookings.filter((b) => b.status === 'cancelled').length },
          { label: 'Scheduled',      value: mockBookings.filter((b) => b.status === 'scheduled').length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent class="text-center py-2">
              <p class="text-3xl font-bold text-foreground">{s.value}</p>
              <p class="text-sm text-foreground-muted mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Date breakdown */}
      {dates.map((date) => {
        const day = byDate[date]
        return (
          <Card key={date} class="overflow-hidden py-0">
            <div class="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/50">
              <span class="font-medium text-foreground text-sm">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-AU', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
              <span class="text-xs text-foreground-muted">{day.length} bookings</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="px-5">Reference</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {day.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell class="px-5 font-mono text-xs font-bold text-foreground-muted">{b.referenceNumber}</TableCell>
                    <TableCell class="text-foreground">{b.driverName}</TableCell>
                    <TableCell class="text-foreground-muted">{b.slotStartTime} – {b.slotEndTime}</TableCell>
                    <TableCell>
                      <Badge variant={(STATUS_BADGE_VARIANT[b.status] || 'secondary') as StatusVariant}>
                        {STATUS_LABEL[b.status] || b.status}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-xs text-foreground-muted">
                      {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      })}
    </div>
  )
}
