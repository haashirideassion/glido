import { mockBookings } from '../../data/bookings'
import { STATUS_LABEL, SERVICE_LABEL, LOAD_LABEL } from '../../lib/constants'
import { Icon, ICONS } from '../../lib/Icon'
import type { BookingStatus } from '../../data/types'

// ── Derived data ──────────────────────────────────────────────────────────────

// Last 7 calendar days
function last7Days(): string[] {
  const days: string[] = []
  const d = new Date(); d.setHours(0,0,0,0)
  for (let i = 6; i >= 0; i--) {
    const t = new Date(d.getTime() - i * 86400000)
    days.push(t.toISOString().split('T')[0])
  }
  return days
}

const DAYS_7 = last7Days()
const countByDay  = DAYS_7.map(d => mockBookings.filter(b => b.slotDate === d).length)
const dayLabels   = DAYS_7.map(d => {
  const t = new Date(d + 'T00:00:00')
  return t.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' })
})

// Status distribution
const STATUS_COLORS: Record<string, string> = {
  completed:   '#16A34A',
  confirmed:   '#F97316',
  checked_in:  '#FB923C',
  cancelled:   '#DC2626',
  pending:     '#D97706',
  pending_eft: '#2563EB',
  no_show:     '#A8A29E',
  scheduled:   '#78716C',
}

const statusCounts = Object.entries(
  mockBookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {})
).sort((a, b) => b[1] - a[1])

// Hourly distribution (all bookings)
const hourlyCounts = Array.from({ length: 12 }, (_, i) => {
  const h = `${String(i + 6).padStart(2, '0')}:00`
  return mockBookings.filter(b => b.slotStartTime === h).length
})
const hourLabels = Array.from({ length: 12 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`)

// Service mix
const pickupCount  = mockBookings.filter(b => b.serviceType === 'pickup').length
const dropoffCount = mockBookings.filter(b => b.serviceType === 'dropoff').length
const fclCount     = mockBookings.filter(b => b.loadType === 'fcl').length
const lclCount     = mockBookings.filter(b => b.loadType === 'lcl').length

const STATUS_STYLE: Record<string, string> = {
  confirmed:    'background:rgba(22,163,74,0.10); color:#15803D; border:1px solid rgba(22,163,74,0.2);',
  checked_in:   'background:rgba(249,115,22,0.10); color:#C2550A; border:1px solid rgba(249,115,22,0.22);',
  completed:    'background:rgba(168,162,158,0.12); color:#57534E; border:1px solid rgba(168,162,158,0.2);',
  cancelled:    'background:rgba(220,38,38,0.08); color:#B91C1C; border:1px solid rgba(220,38,38,0.15);',
  pending:      'background:rgba(217,119,6,0.10); color:#92400E; border:1px solid rgba(217,119,6,0.2);',
  pending_eft:  'background:rgba(37,99,235,0.08); color:#1E3A8A; border:1px solid rgba(37,99,235,0.15);',
  no_show:      'background:rgba(168,162,158,0.10); color:#78716C; border:1px solid rgba(168,162,158,0.18);',
  scheduled:    'background:rgba(120,113,108,0.08); color:#57534E; border:1px solid rgba(120,113,108,0.15);',
}

// JSON serialisation helpers (safe for inline scripts)
const jsDayLabels   = JSON.stringify(dayLabels)
const jsCountByDay  = JSON.stringify(countByDay)
const jsHourLabels  = JSON.stringify(hourLabels)
const jsHourlyCounts = JSON.stringify(hourlyCounts)
const jsStatusNames = JSON.stringify(statusCounts.map(([s]) => STATUS_LABEL[s as BookingStatus] || s))
const jsStatusVals  = JSON.stringify(statusCounts.map(([, n]) => n))
const jsStatusColors = JSON.stringify(statusCounts.map(([s]) => STATUS_COLORS[s] || '#A8A29E'))

// Shared ECharts theme tokens
const EC_THEME = `
  var FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";
  var ORANGE = '#F97316';
  var ORANGE2 = '#FB923C';
  var GRID_LINE = 'rgba(240,197,137,0.25)';
  var AXIS_LABEL = '#A8A29E';
  var TOOLTIP_BG = 'rgba(255,247,237,0.96)';
  var TOOLTIP_BORDER = 'rgba(249,115,22,0.2)';
`

export const ReportsView = () => (
  <div style="display:flex; flex-direction:column; gap:20px;">

    {/* ── Page header ──────────────────────────────────────────────────────── */}
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <div>
        <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:2px;">Reports</h2>
        <p style="font-size:12.5px; color:#78716C;">Activity analytics across all bookings</p>
      </div>
      <button
        type="button"
        style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; font-size:12px; font-weight:500; color:#78716C; background:transparent; border:1.5px solid rgba(240,197,137,0.5); border-radius:9999px; cursor:pointer;"
      >
        <Icon name={ICONS.download} size={13} />
        Export CSV
      </button>
    </div>

    {/* ── KPI summary strip ────────────────────────────────────────────────── */}
    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px;">
      {[
        { label: 'Total Bookings', value: mockBookings.length,                                      color: '#F97316' },
        { label: 'Completed',      value: mockBookings.filter(b => b.status === 'completed').length, color: '#16A34A' },
        { label: 'Cancelled',      value: mockBookings.filter(b => b.status === 'cancelled').length, color: '#DC2626' },
        { label: 'Scheduled',      value: mockBookings.filter(b => b.status === 'scheduled').length, color: '#78716C' },
      ].map(s => (
        <div
          key={s.label}
          style="background:rgba(255,247,237,0.75); border:1.5px solid rgba(249,115,22,0.12); border-radius:16px; padding:18px 20px;"
        >
          <p style={`font-size:28px; font-weight:600; letter-spacing:-0.04em; color:${s.color}; line-height:1; margin-bottom:6px;`}>{s.value}</p>
          <p style="font-size:12px; color:#78716C;">{s.label}</p>
        </div>
      ))}
    </div>

    {/* ── Row 1: Weekly bar + status donut ──────────────────────────────────── */}
    <div style="display:grid; grid-template-columns:1.6fr 1fr; gap:12px;">

      {/* Weekly bookings bar chart */}
      <div style="background:rgba(255,247,237,0.75); border:1.5px solid rgba(249,115,22,0.12); border-radius:20px; padding:24px;">
        <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:4px;">Bookings — last 7 days</p>
        <p style="font-size:11.5px; color:#A8A29E; margin-bottom:16px;">Daily booking volume</p>
        <div id="chart-weekly" style="width:100%; height:220px;"></div>
      </div>

      {/* Status donut */}
      <div style="background:rgba(255,247,237,0.75); border:1.5px solid rgba(249,115,22,0.12); border-radius:20px; padding:24px;">
        <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:4px;">Status breakdown</p>
        <p style="font-size:11.5px; color:#A8A29E; margin-bottom:16px;">All-time distribution</p>
        <div id="chart-status" style="width:100%; height:220px;"></div>
      </div>
    </div>

    {/* ── Row 2: Hourly heatmap + service mix ─────────────────────────────── */}
    <div style="display:grid; grid-template-columns:1.8fr 1fr; gap:12px;">

      {/* Hourly traffic line chart */}
      <div style="background:rgba(255,247,237,0.75); border:1.5px solid rgba(249,115,22,0.12); border-radius:20px; padding:24px;">
        <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:4px;">Hourly traffic pattern</p>
        <p style="font-size:11.5px; color:#A8A29E; margin-bottom:16px;">Average bookings by time window</p>
        <div id="chart-hourly" style="width:100%; height:200px;"></div>
      </div>

      {/* Service mix — two stacked bars */}
      <div style="background:rgba(255,247,237,0.75); border:1.5px solid rgba(249,115,22,0.12); border-radius:20px; padding:24px;">
        <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:4px;">Service mix</p>
        <p style="font-size:11.5px; color:#A8A29E; margin-bottom:20px;">Pick Up vs Drop Off · FCL vs LCL</p>
        <div id="chart-mix" style="width:100%; height:200px;"></div>
      </div>
    </div>

    {/* ── Booking table ────────────────────────────────────────────────────── */}
    <div style="background:rgba(255,247,237,0.75); border:1.5px solid rgba(249,115,22,0.12); border-radius:20px; overflow:hidden;">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:18px 24px; border-bottom:1px solid rgba(249,115,22,0.10);">
        <p style="font-size:13px; font-weight:600; color:#1C1917;">All Bookings</p>
        <span style="font-size:12px; color:#A8A29E;">{mockBookings.length} records</span>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:rgba(234,230,219,0.4);">
              {['Reference', 'Date', 'Time', 'Driver', 'Service', 'Status'].map(h => (
                <th
                  key={h}
                  style="padding:10px 20px; text-align:left; font-size:10px; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; color:#A8A29E; white-space:nowrap;"
                >{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockBookings.slice(0, 12).map((b, i) => (
              <tr
                key={b.id}
                style={`border-top:1px solid rgba(249,115,22,0.07); ${i % 2 === 0 ? '' : 'background:rgba(254,240,220,0.2);'}`}
              >
                <td style="padding:11px 20px; font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#1C1917; white-space:nowrap;">{b.referenceNumber}</td>
                <td style="padding:11px 20px; font-size:12.5px; color:#57534E; white-space:nowrap;">{b.slotDate}</td>
                <td style="padding:11px 20px; font-size:12.5px; color:#57534E; white-space:nowrap;">{b.slotStartTime} – {b.slotEndTime}</td>
                <td style="padding:11px 20px; font-size:12.5px; color:#1C1917;">{b.driverName}</td>
                <td style="padding:11px 20px; font-size:12px; color:#78716C; white-space:nowrap;">
                  {SERVICE_LABEL[b.serviceType]} · {LOAD_LABEL[b.loadType]}
                </td>
                <td style="padding:11px 20px;">
                  <span style={`display:inline-block; padding:3px 10px; border-radius:9999px; font-size:11px; font-weight:600; ${STATUS_STYLE[b.status] || STATUS_STYLE.scheduled}`}>
                    {STATUS_LABEL[b.status] || b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* ── ECharts initialisation ───────────────────────────────────────────── */}
    <script dangerouslySetInnerHTML={{ __html: `
(function() {
  ${EC_THEME}

  var dayLabels    = ${jsDayLabels};
  var countByDay   = ${jsCountByDay};
  var hourLabels   = ${jsHourLabels};
  var hourlyCounts = ${jsHourlyCounts};
  var statusNames  = ${jsStatusNames};
  var statusVals   = ${jsStatusVals};
  var statusColors = ${jsStatusColors};

  function initCharts() {
    if (typeof echarts === 'undefined') { setTimeout(initCharts, 80); return; }

    /* ── Weekly bar chart ─────────────────────────────────────────────── */
    var weekly = echarts.init(document.getElementById('chart-weekly'), null, { renderer: 'svg' });
    weekly.setOption({
      grid: { top: 8, right: 8, bottom: 28, left: 36, containLabel: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: TOOLTIP_BG,
        borderColor: TOOLTIP_BORDER,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#1C1917', fontFamily: FONT, fontSize: 12 },
        formatter: function(p) { return p[0].name + '<br/><b>' + p[0].value + ' bookings</b>'; }
      },
      xAxis: {
        type: 'category',
        data: dayLabels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: AXIS_LABEL, fontFamily: FONT, fontSize: 11 },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: AXIS_LABEL, fontFamily: FONT, fontSize: 11 },
        splitLine: { lineStyle: { color: GRID_LINE, type: 'dashed' } }
      },
      series: [{
        type: 'bar',
        data: countByDay,
        barMaxWidth: 32,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: ORANGE },
            { offset: 1, color: ORANGE2 }
          ])
        },
        emphasis: { itemStyle: { color: '#EA6C0A' } }
      }]
    });

    /* ── Status donut ─────────────────────────────────────────────────── */
    var donut = echarts.init(document.getElementById('chart-status'), null, { renderer: 'svg' });
    donut.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: TOOLTIP_BG,
        borderColor: TOOLTIP_BORDER,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#1C1917', fontFamily: FONT, fontSize: 12 },
        formatter: '{b}: <b>{c}</b> ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'center',
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 4,
        textStyle: { color: '#78716C', fontFamily: FONT, fontSize: 11 }
      },
      series: [{
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 4,
          itemStyle: { shadowBlur: 12, shadowColor: 'rgba(249,115,22,0.25)' }
        },
        data: statusNames.map(function(name, i) {
          return { value: statusVals[i], name: name, itemStyle: { color: statusColors[i], borderRadius: 3 } };
        })
      }]
    });

    /* ── Hourly area line ─────────────────────────────────────────────── */
    var hourly = echarts.init(document.getElementById('chart-hourly'), null, { renderer: 'svg' });
    hourly.setOption({
      grid: { top: 8, right: 8, bottom: 28, left: 36, containLabel: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: TOOLTIP_BG,
        borderColor: TOOLTIP_BORDER,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#1C1917', fontFamily: FONT, fontSize: 12 },
        formatter: function(p) { return p[0].name + '<br/><b>' + p[0].value + ' bookings</b>'; }
      },
      xAxis: {
        type: 'category',
        data: hourLabels,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: AXIS_LABEL, fontFamily: FONT, fontSize: 10, interval: 1 },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: AXIS_LABEL, fontFamily: FONT, fontSize: 11 },
        splitLine: { lineStyle: { color: GRID_LINE, type: 'dashed' } }
      },
      series: [{
        type: 'line',
        data: hourlyCounts,
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: ORANGE, width: 2.5 },
        itemStyle: { color: ORANGE, borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(249,115,22,0.18)' },
            { offset: 1, color: 'rgba(249,115,22,0.02)' }
          ])
        }
      }]
    });

    /* ── Service mix horizontal bars ──────────────────────────────────── */
    var mix = echarts.init(document.getElementById('chart-mix'), null, { renderer: 'svg' });
    var total = ${mockBookings.length};
    mix.setOption({
      grid: { top: 8, right: 12, bottom: 8, left: 8, containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: TOOLTIP_BG,
        borderColor: TOOLTIP_BORDER,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#1C1917', fontFamily: FONT, fontSize: 12 },
        axisPointer: { type: 'none' }
      },
      yAxis: {
        type: 'category',
        data: ['Pick Up', 'Drop Off', 'FCL', 'LCL'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#57534E', fontFamily: FONT, fontSize: 12 }
      },
      xAxis: {
        type: 'value',
        max: total,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      series: [
        {
          type: 'bar',
          data: [${pickupCount}, ${dropoffCount}, ${fclCount}, ${lclCount}],
          barMaxWidth: 24,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: function(p) {
              var c = [ORANGE, ORANGE2, '#FB923C', '#FBD0A8'];
              return c[p.dataIndex] || ORANGE;
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: function(p) { return p.value + ' (' + Math.round(p.value/total*100) + '%)'; },
            color: '#78716C',
            fontFamily: FONT,
            fontSize: 11
          }
        },
        {
          type: 'bar',
          data: [total - ${pickupCount}, total - ${dropoffCount}, total - ${fclCount}, total - ${lclCount}],
          barMaxWidth: 24,
          itemStyle: { color: 'rgba(240,197,137,0.18)', borderRadius: [0, 6, 6, 0] },
          label: { show: false },
          emphasis: { disabled: true },
          stack: 'nope'
        }
      ]
    });

    /* Resize on window resize */
    window.addEventListener('resize', function() {
      weekly.resize(); donut.resize(); hourly.resize(); mix.resize();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
  } else {
    initCharts();
  }
})();
    `}} />

  </div>
)
