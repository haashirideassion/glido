import type { TimeSlot } from '../../data/types'

interface Props {
  slots: TimeSlot[]
  date: string
}

export const SlotGrid = ({ slots, date }: Props) => {
  const d = new Date(date + 'T00:00:00')
  const dayName = d.toLocaleDateString('en-AU', { weekday: 'long' })
  const fullDate = d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div id="slot-grid" style="margin-top:16px;">

      {/* Date header */}
      <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:14px;">
        <p style="font-size:14px; font-weight:600; color:#F1F5F9;">{dayName}</p>
        <p style="font-size:12px; color:#78716C;">{fullDate}</p>
      </div>

      {slots.length === 0 ? (
        <div style="text-align:center; padding:40px 0; color:#A8A29E; font-size:13px;">
          No slots available for this date.
        </div>
      ) : (
        <>
          <style>{`
            .slot-grid-wrap {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 6px;
            }
            @media (max-width: 560px) {
              .slot-grid-wrap { grid-template-columns: repeat(3, 1fr); }
            }
            @media (max-width: 380px) {
              .slot-grid-wrap { grid-template-columns: repeat(2, 1fr); }
            }
          `}</style>
          <div class="slot-grid-wrap">
            {slots.map((slot) => {
              const canSelect = slot.busyness === 'available' || slot.busyness === 'busy'
              const isFull    = slot.busyness === 'full' || slot.busyness === 'closed'
              const remaining = Math.max(0, slot.capacity - slot.confirmed - slot.held)
              const pct       = Math.round((slot.confirmed / Math.max(slot.capacity, 1)) * 100)

              const fillColor = pct > 80 ? '#FC6514' : pct > 50 ? '#FC8A3C' : '#22C55E'

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!canSelect}
                  x-on:click={canSelect ? `$store.wizard.selectSlot('${slot.id}', '${slot.startTime} – ${slot.endTime}')` : ''}
                  style={`
                    display:flex; flex-direction:column; align-items:flex-start; gap:6px;
                    padding:10px 11px 9px;
                    border-radius:10px;
                    border:1.5px solid;
                    cursor:${canSelect ? 'pointer' : 'default'};
                    text-align:left;
                    width:100%;
                    transition:background 0.12s ease, border-color 0.12s ease, transform 0.12s ease;
                    position:relative;
                    overflow:hidden;
                    ${isFull ? 'opacity:0.38; pointer-events:none;' : ''}
                  `}
                  x-bind:style={`$store.wizard.selectedSlotId === '${slot.id}'
                    ? 'background:rgba(252,101,20,0.10); border-color:#FC6514; transform:scale(1.02);'
                    : '${isFull ? 'border-color:rgba(168,162,158,0.20); background:transparent;' : 'border-color:rgba(240,197,137,0.30); background:rgba(255,255,255,0.03);'}'`}
                  onmouseover={canSelect ? `if($store.wizard.selectedSlotId !== '${slot.id}'){this.style.background='rgba(252,101,20,0.05)'; this.style.borderColor='rgba(252,101,20,0.45)';}` : ''}
                  onmouseout={canSelect ? `if($store.wizard.selectedSlotId !== '${slot.id}'){this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(240,197,137,0.30)';}` : ''}
                >
                  {/* Selected indicator dot (top-right) */}
                  <div
                    style="position:absolute; top:7px; right:7px; width:7px; height:7px; border-radius:9999px; transition:opacity 0.12s ease;"
                    x-bind:style={`$store.wizard.selectedSlotId === '${slot.id}' ? 'background:#FC6514; opacity:1;' : 'background:transparent; opacity:0;'`}
                  ></div>

                  {/* Time */}
                  <span
                    style="font-size:13px; font-weight:700; font-variant-numeric:tabular-nums; line-height:1; transition:color 0.12s ease;"
                    x-bind:style={`$store.wizard.selectedSlotId === '${slot.id}' ? 'color:#FC6514;' : '${isFull ? "color:#78716C;" : "color:#F1F5F9;"}'`}
                  >
                    {slot.startTime}
                  </span>
                  <span style="font-size:11px; color:#78716C; line-height:1;">
                    – {slot.endTime}
                  </span>

                  {/* Fill bar */}
                  <div style="width:100%; height:3px; background:rgba(168,162,158,0.15); border-radius:9999px; overflow:hidden; margin-top:2px;">
                    <div style={`height:100%; border-radius:9999px; width:${pct}%; background:${fillColor};`}></div>
                  </div>

                  {/* Availability */}
                  <span style={`font-size:10px; font-weight:500; line-height:1; ${isFull ? 'color:#78716C;' : remaining <= 2 ? 'color:#FC6514;' : 'color:#78716C;'}`}>
                    {isFull ? 'Full' : `${remaining} left`}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Legend */}
      <div style="display:flex; align-items:center; gap:16px; margin-top:12px; padding-top:10px; border-top:1px solid rgba(240,197,137,0.20);">
        <span style="display:flex; align-items:center; gap:5px; font-size:10.5px; color:#78716C;">
          <span style="display:inline-block; width:14px; height:3px; border-radius:9999px; background:#22C55E;"></span>
          Open
        </span>
        <span style="display:flex; align-items:center; gap:5px; font-size:10.5px; color:#78716C;">
          <span style="display:inline-block; width:14px; height:3px; border-radius:9999px; background:#FC6514;"></span>
          Filling up
        </span>
        <span style="display:flex; align-items:center; gap:5px; font-size:10.5px; color:#78716C;">
          <span style="display:inline-block; width:14px; height:3px; border-radius:9999px; background:rgba(168,162,158,0.25);"></span>
          Full
        </span>
      </div>
    </div>
  )
}
