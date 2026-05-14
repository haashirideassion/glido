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
      iconBg:  '#FEF3C7',
      iconFg:  '#F59E0B',
      valueFg: '#44403C',
    },
    {
      label:   'Checked In',
      value:   stats.checkedIn,
      sub:     'currently on site',
      icon:    ICONS.userCheck,
      iconBg:  '#DCFCE7',
      iconFg:  '#16A34A',
      valueFg: '#16A34A',
    },
    {
      label:   'Completed',
      value:   stats.completed,
      sub:     'finished today',
      icon:    ICONS.checkSquare,
      iconBg:  '#EAE6DE',
      iconFg:  '#78716C',
      valueFg: '#44403C',
    },
    {
      label:   'ICS Held',
      value:   stats.held,
      sub:     'customs holds today',
      icon:    ICONS.warning,
      iconBg:  '#FEE2E2',
      iconFg:  '#DC2626',
      valueFg: '#DC2626',
    },
  ]

  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          style="background:#EAE6DE; border:1px solid rgba(214,211,209,0.5); border-radius:8px 8px 8px 2px; padding:20px; box-shadow:rgba(0,0,0,0) 0 0 0 0,rgba(0,0,0,0) 0 0 0 0,rgba(0,0,0,0.05) 0 1px 2px 0"
        >
          <div
            class="w-10 h-10 flex items-center justify-center mb-3"
            style={`background:${tile.iconBg}; border-radius:8px`}
          >
            <Icon name={tile.icon} size={22} style={`color:${tile.iconFg}`} />
          </div>
          <p
            class="font-medium tabular-nums"
            style={`font-size:28px; font-weight:500; color:${tile.valueFg}`}
          >
            {tile.value}
          </p>
          <p class="font-semibold mt-0.5" style="font-size:13px; color:#44403C">{tile.label}</p>
          <p class="mt-0.5" style="font-size:12px; color:#A8A29E">{tile.sub}</p>
        </div>
      ))}
    </div>
  )
}
