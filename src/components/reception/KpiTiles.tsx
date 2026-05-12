import { Card, CardContent } from '@/components/ui/card'
import { Icon, ICONS } from '../../lib/Icon'
import type { DashboardStats } from '../../data/types'

interface Props {
  stats: DashboardStats
}

export const KpiTiles = ({ stats }: Props) => {
  const tiles = [
    {
      label:   'Total Scheduled',
      value:   stats.totalScheduled,
      sub:     'booked for today',
      icon:    ICONS.calendar,
      bg:      'bg-blue-50',
      fg:      'text-blue-600',
    },
    {
      label:   'Checked In',
      value:   stats.checkedIn,
      sub:     'currently on site',
      icon:    ICONS.userCheck,
      bg:      'bg-green-50',
      fg:      'text-green-600',
    },
    {
      label:   'Completed',
      value:   stats.completed,
      sub:     'finished today',
      icon:    ICONS.checkSquare,
      bg:      'bg-slate-100',
      fg:      'text-slate-500',
    },
    {
      label:   'ICS Held',
      value:   stats.held,
      sub:     'customs holds today',
      icon:    ICONS.warning,
      bg:      'bg-red-50',
      fg:      'text-red-500',
    },
  ]

  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {tiles.map((tile) => (
        <Card key={tile.label} class="hover:shadow-md transition-shadow">
          <CardContent class="pt-4">
            <div class={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tile.bg}`}>
              <Icon name={tile.icon} size={22} class={tile.fg} />
            </div>
            <p class="text-2xl font-bold text-foreground">{tile.value}</p>
            <p class="text-sm font-semibold text-foreground mt-0.5">{tile.label}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{tile.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
