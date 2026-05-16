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
        <p style="font-size:12px; color:#64748B;">{fullDate}</p>
      </div>

      {slots.length === 0 ? (
        <div style="text-align:center; padding:40px 0; color:#A8A29E; font-size:13px;">
          No slots available for this date.
        </div>
      ) : (
        <div style="display:flex; flex-direction:column; gap:4px;">
          {slots.map((slot) => {
            const canSelect = slot.busyness === 'available' || slot.busyness === 'busy'
            const isFull    = slot.busyness === 'full' || slot.busyness === 'closed'
            const remaining = Math.max(0, slot.capacity - slot.confirmed - slot.held)
            const pct       = Math.round((slot.confirmed / Math.max(slot.capacity, 1)) * 100)

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!canSelect}
                x-on:click={canSelect ? `$store.wizard.selectSlot('${slot.id}', '${slot.startTime} – ${slot.endTime}')` : ''}
                style={`
                  display:flex; align-items:center; gap:12px;
                  padding:11px 14px;
                  border-radius:11px;
                  border:1.5px solid;
                  cursor:${canSelect ? 'pointer' : 'default'};
                  text-align:left;
                  width:100%;
                  transition:background 0.12s ease, border-color 0.12s ease;
                  ${isFull ? 'opacity:0.4; pointer-events:none;' : ''}
                `}
                x-bind:style={`$store.wizard.selectedSlotId === '${slot.id}'
                  ? 'background:rgba(252,101,20,0.08); border-color:#FC6514;'
                  : '${isFull ? '' : 'border-color:rgba(240,197,137,0.35); background:transparent;'}'`}
                onmouseover={canSelect ? `if($store.wizard.selectedSlotId !== '${slot.id}'){this.style.background='rgba(252,101,20,0.04)'; this.style.borderColor='rgba(252,101,20,0.4)';}` : ''}
                onmouseout={canSelect ? `if($store.wizard.selectedSlotId !== '${slot.id}'){this.style.background='transparent'; this.style.borderColor='rgba(240,197,137,0.35)';}` : ''}
              >
                {/* Time */}
                <div style="width:88px; flex-shrink:0;">
                  <span
                    style="font-size:14px; font-weight:600; font-variant-numeric:tabular-nums; transition:color 0.12s ease;"
                    x-bind:style={`$store.wizard.selectedSlotId === '${slot.id}' ? 'color:#FC6514;' : '${isFull ? 'color:#64748B;' : 'color:#F1F5F9;'}'`}
                  >
                    {slot.startTime}
                  </span>
                  <span style="font-size:12px; color:#A8A29E; margin-left:4px;">– {slot.endTime}</span>
                </div>

                {/* Capacity bar */}
                <div style="flex:1; min-width:0;">
                  <div style="height:4px; background:rgba(168,162,158,0.15); border-radius:9999px; overflow:hidden;">
                    <div style={`height:100%; border-radius:9999px; width:${pct}%; transition:width 0.3s ease; background:${pct > 80 ? '#FC6514' : pct > 50 ? '#FC8A3C' : '#FBD0A8'};`}></div>
                  </div>
                </div>

                {/* Status */}
                <div style="width:72px; text-align:right; flex-shrink:0;">
                  {isFull ? (
                    <span style="font-size:11px; font-weight:500; color:#A8A29E;">Full</span>
                  ) : (
                    <span style="font-size:11px; font-weight:500; color:#64748B;">
                      {remaining} left
                    </span>
                  )}
                </div>

                {/* Selected tick */}
                <div
                  style="width:18px; height:18px; border-radius:9999px; border:1.5px solid; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:background 0.12s ease, border-color 0.12s ease;"
                  x-bind:style={`$store.wizard.selectedSlotId === '${slot.id}'
                    ? 'background:#FC6514; border-color:#FC6514;'
                    : 'background:transparent; border-color:rgba(168,162,158,0.35);'`}
                >
                  <span
                    x-show={`$store.wizard.selectedSlotId === '${slot.id}'`}
                    style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
                  ></span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div style="display:flex; align-items:center; gap:16px; margin-top:12px; padding-top:12px; border-top:1px solid rgba(240,197,137,0.25);">
        <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#A8A29E;">
          <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:#FBD0A8;"></span>
          Open
        </span>
        <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#A8A29E;">
          <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:#FC6514;"></span>
          Filling up
        </span>
        <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#A8A29E;">
          <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:rgba(168,162,158,0.25);"></span>
          Full
        </span>
      </div>
    </div>
  )
}
