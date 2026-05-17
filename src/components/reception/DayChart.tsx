import type { Booking } from '../../data/types'

interface Props {
  bookings: Booking[]
}

// Slot hours used at this terminal (07–17)
const HOURS = ['07','08','09','10','11','12','13','14','15','16','17']

export const DayChart = ({ bookings }: Props) => {
  // Count bookings per hour
  const scheduled: number[] = HOURS.map(h =>
    bookings.filter(b => b.slotStartTime.startsWith(h)).length
  )
  const checkedIn: number[] = HOURS.map(h =>
    bookings.filter(b => b.slotStartTime.startsWith(h) && (b.status === 'checked_in' || b.status === 'completed')).length
  )

  const jsHours     = JSON.stringify(HOURS.map(h => `${h}:00`))
  const jsScheduled = JSON.stringify(scheduled)
  const jsCheckedIn = JSON.stringify(checkedIn)

  const script = `
(function(){
  function init(){
    if(typeof echarts==='undefined'){return setTimeout(init,50);}
    var el=document.getElementById('chart-day');
    if(!el)return;
    var ch=echarts.init(el,null,{renderer:'svg'});
    ch.setOption({
      animation:false,
      grid:{top:12,right:12,bottom:28,left:32,containLabel:false},
      tooltip:{
        trigger:'axis',
        backgroundColor:'rgba(28,25,23,0.88)',
        borderColor:'transparent',
        textStyle:{color:'#FCFBF8',fontFamily:'Inter,ui-sans-serif,sans-serif',fontSize:12},
        axisPointer:{type:'shadow'}
      },
      legend:{
        bottom:0,left:'center',
        itemWidth:10,itemHeight:10,
        textStyle:{color:'#A8A29E',fontFamily:'Inter,ui-sans-serif,sans-serif',fontSize:11},
        icon:'circle'
      },
      xAxis:{
        type:'category',
        data:${jsHours},
        axisLine:{lineStyle:{color:'rgba(214,211,209,0.5)'}},
        axisTick:{show:false},
        axisLabel:{color:'#A8A29E',fontFamily:'Inter,ui-sans-serif,sans-serif',fontSize:11}
      },
      yAxis:{
        type:'value',
        minInterval:1,
        splitLine:{lineStyle:{color:'rgba(0,0,0,0.06)',type:'dashed'}},
        axisLabel:{color:'#A8A29E',fontFamily:'Inter,ui-sans-serif,sans-serif',fontSize:11}
      },
      series:[
        {
          name:'Scheduled',
          type:'bar',
          stack:'day',
          data:${jsScheduled},
          barMaxWidth:28,
          itemStyle:{
            color:{
              type:'linear',x:0,y:0,x2:0,y2:1,
              colorStops:[{offset:0,color:'rgba(252,101,20,0.55)'},{offset:1,color:'rgba(252,101,20,0.15)'}]
            },
            borderRadius:[4,4,0,0]
          }
        },
        {
          name:'On Site',
          type:'bar',
          stack:'day',
          data:${jsCheckedIn},
          barMaxWidth:28,
          itemStyle:{
            color:{
              type:'linear',x:0,y:0,x2:0,y2:1,
              colorStops:[{offset:0,color:'#FC6514'},{offset:1,color:'#FC8A3C'}]
            },
            borderRadius:[4,4,0,0]
          }
        }
      ]
    });
    window.addEventListener('resize',function(){ch.resize();});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
`

  return (
    <div
      style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:14px; padding:18px 20px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07);"
    >
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
        <h2 style="font-size:13px; font-weight:600; color:#1C1917; letter-spacing:-0.01em;">Day at a Glance</h2>
        <span style="font-size:11px; color:#A8A29E;">Today · hourly schedule</span>
      </div>
      <div id="chart-day" style="height:160px; width:100%;"></div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  )
}
