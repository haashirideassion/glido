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

const EC_THEME = `var FONT='Inter,ui-sans-serif,sans-serif'; var BG='rgba(255,255,255,0)';`

export const KpiTiles = ({ stats }: Props) => {
  const tiles = [
    {
      id:      'kpi-scheduled',
      statId:  'stat-scheduled',
      label:   'Total Scheduled',
      value:   stats.totalScheduled,
      sub:     'booked for today',
      icon:    ICONS.calendar,
      iconBg:  'rgba(251,191,36,0.10)',
      iconFg:  '#FBBF24',
      valueFg: '#1C1917',
      lineColor: '#FBBF24',
      fillStart: 'rgba(251,191,36,0.18)',
      fillEnd:   'rgba(251,191,36,0)',
      seed: 2,
    },
    {
      id:      'kpi-checkedin',
      statId:  'stat-checkedin',
      label:   'Checked In',
      value:   stats.checkedIn,
      sub:     'currently on site',
      icon:    ICONS.userCheck,
      iconBg:  'rgba(34,197,94,0.10)',
      iconFg:  '#22C55E',
      valueFg: '#22C55E',
      lineColor: '#22C55E',
      fillStart: 'rgba(34,197,94,0.18)',
      fillEnd:   'rgba(34,197,94,0)',
      seed: 5,
    },
    {
      id:      'kpi-completed',
      statId:  'stat-completed',
      label:   'Completed',
      value:   stats.completed,
      sub:     'finished today',
      icon:    ICONS.checkSquare,
      iconBg:  'rgba(148,163,184,0.10)',
      iconFg:  '#94A3B8',
      valueFg: '#1C1917',
      lineColor: '#94A3B8',
      fillStart: 'rgba(148,163,184,0.15)',
      fillEnd:   'rgba(148,163,184,0)',
      seed: 1,
    },
    {
      id:      'kpi-held',
      statId:  'stat-held',
      label:   'ICS Held',
      value:   stats.held,
      sub:     'customs holds today',
      icon:    ICONS.warning,
      iconBg:  'rgba(239,68,68,0.10)',
      iconFg:  '#EF4444',
      valueFg: '#EF4444',
      lineColor: '#EF4444',
      fillStart: 'rgba(239,68,68,0.14)',
      fillEnd:   'rgba(239,68,68,0)',
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
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-stagger data-stagger-ms="70">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:18px; padding:20px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07); transition:transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 28px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)';"
          onmouseout="this.style.transform=''; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07)';"
        >
          {/* Header row */}
          <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px;">
            <div
              style={`width:40px; height:40px; border-radius:12px; background:${tile.iconBg}; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid ${tile.iconFg}22;`}
            >
              <Icon name={tile.icon} size={20} style={`color:${tile.iconFg};`} />
            </div>
          </div>

          {/* Value + labels */}
          <p
            id={tile.statId}
            style={`font-size:36px; font-weight:800; letter-spacing:-0.04em; line-height:1; color:${tile.valueFg}; margin-bottom:5px; font-variant-numeric:tabular-nums;`}
          >
            {tile.value}
          </p>
          <p style="font-size:12px; font-weight:600; color:#57534E; margin-bottom:2px;">{tile.label}</p>
          <p style="font-size:11px; color:#A8A29E; margin-bottom:14px;">{tile.sub}</p>

          {/* Sparkline */}
          <div
            id={tile.id}
            style="height:44px; margin:0 -20px; width:calc(100% + 40px);"
          ></div>
        </div>
      ))}

      {/* ECharts sparkline init */}
      <script dangerouslySetInnerHTML={{ __html: sparkScript }} />
    </div>
  )
}
