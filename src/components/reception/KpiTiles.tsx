import { Icon, ICONS } from '../../lib/Icon'
import type { DashboardStats } from '../../data/types'

interface Props {
  stats: DashboardStats
}

// Generate plausible 7-point sparkline trend ending near `final`
function spark(final: number, seed: number): number[] {
  const pts: number[] = []
  let v = Math.max(1, Math.round(final * 0.4 + seed % 3))
  for (let i = 0; i < 6; i++) {
    pts.push(v)
    v = Math.max(0, v + Math.round((Math.random() * 3 - 1) + (final - v) * 0.35))
  }
  pts.push(final)
  return pts
}

const EC_THEME = `var FONT='Inter,ui-sans-serif,sans-serif';`

export const KpiTiles = ({ stats }: Props) => {
  const tiles = [
    {
      id:      'kpi-scheduled',
      label:   'Total Scheduled',
      value:   stats.totalScheduled,
      sub:     'booked for today',
      icon:    ICONS.calendar,
      iconBg:  'rgba(245,158,11,0.10)',
      iconFg:  '#F59E0B',
      valueFg: '#44403C',
      lineColor: '#F59E0B',
      fillStart: 'rgba(245,158,11,0.18)',
      fillEnd:   'rgba(245,158,11,0)',
      seed: 2,
    },
    {
      id:      'kpi-checkedin',
      label:   'Checked In',
      value:   stats.checkedIn,
      sub:     'currently on site',
      icon:    ICONS.userCheck,
      iconBg:  'rgba(22,163,74,0.10)',
      iconFg:  '#16A34A',
      valueFg: '#16A34A',
      lineColor: '#16A34A',
      fillStart: 'rgba(22,163,74,0.18)',
      fillEnd:   'rgba(22,163,74,0)',
      seed: 5,
    },
    {
      id:      'kpi-completed',
      label:   'Completed',
      value:   stats.completed,
      sub:     'finished today',
      icon:    ICONS.checkSquare,
      iconBg:  'rgba(120,113,108,0.10)',
      iconFg:  '#78716C',
      valueFg: '#44403C',
      lineColor: '#A8A29E',
      fillStart: 'rgba(168,162,158,0.15)',
      fillEnd:   'rgba(168,162,158,0)',
      seed: 1,
    },
    {
      id:      'kpi-held',
      label:   'ICS Held',
      value:   stats.held,
      sub:     'customs holds today',
      icon:    ICONS.warning,
      iconBg:  'rgba(220,38,38,0.08)',
      iconFg:  '#DC2626',
      valueFg: '#DC2626',
      lineColor: '#F87171',
      fillStart: 'rgba(220,38,38,0.12)',
      fillEnd:   'rgba(220,38,38,0)',
      seed: 3,
    },
  ]

  // Compute sparkline data server-side
  const sparkData = tiles.map(t => spark(t.value, t.seed))

  // Build a single inline script for all 4 sparklines
  const sparkScript = `
${EC_THEME}
(function(){
  function init(){
    if(typeof echarts==='undefined'){return setTimeout(init,50);}
    var configs=[
      ${tiles.map((t, i) => `{
        id:'${t.id}',
        data:${JSON.stringify(sparkData[i])},
        line:'${t.lineColor}',
        fillStart:'${t.fillStart}',
        fillEnd:'${t.fillEnd}'
      }`).join(',\n      ')}
    ];
    configs.forEach(function(cfg){
      var el=document.getElementById(cfg.id);
      if(!el)return;
      var ch=echarts.init(el,null,{renderer:'svg'});
      ch.setOption({
        animation:false,
        grid:{top:2,right:2,bottom:2,left:2},
        xAxis:{type:'category',show:false,boundaryGap:false},
        yAxis:{type:'value',show:false,min:'dataMin',max:'dataMax'},
        series:[{
          type:'line',
          data:cfg.data,
          smooth:0.4,
          symbol:'none',
          lineStyle:{color:cfg.line,width:1.5},
          areaStyle:{
            color:{
              type:'linear',x:0,y:0,x2:0,y2:1,
              colorStops:[
                {offset:0,color:cfg.fillStart},
                {offset:1,color:cfg.fillEnd}
              ]
            }
          }
        }]
      });
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
`

  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          style="background:#FCFBF8; border:1px solid rgba(214,211,209,0.6); border-radius:14px; padding:18px 18px 0; overflow:hidden; box-shadow:rgba(0,0,0,0.04) 0 1px 3px 0;"
        >
          {/* Header row */}
          <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px;">
            <div
              style={`width:36px; height:36px; border-radius:10px; background:${tile.iconBg}; display:flex; align-items:center; justify-content:center; flex-shrink:0;`}
            >
              <Icon name={tile.icon} size={18} style={`color:${tile.iconFg};`} />
            </div>
          </div>

          {/* Value + labels */}
          <p
            style={`font-size:30px; font-weight:600; letter-spacing:-0.03em; line-height:1; color:${tile.valueFg}; margin-bottom:4px; font-variant-numeric:tabular-nums;`}
          >
            {tile.value}
          </p>
          <p style="font-size:12px; font-weight:600; color:#44403C; margin-bottom:1px;">{tile.label}</p>
          <p style="font-size:11px; color:#A8A29E; margin-bottom:12px;">{tile.sub}</p>

          {/* Sparkline */}
          <div
            id={tile.id}
            style="width:100%; height:44px; margin:0 -18px; width:calc(100% + 36px);"
          ></div>
        </div>
      ))}

      {/* ECharts sparkline init */}
      <script dangerouslySetInnerHTML={{ __html: sparkScript }} />
    </div>
  )
}
