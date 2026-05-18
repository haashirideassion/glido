import { Icon, ICONS } from '../../lib/Icon'

function workingDays(n: number): { iso: string; isToday: boolean; day: string; num: string }[] {
  const days: { iso: string; isToday: boolean; day: string; num: string }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let d = new Date(today)
  while (days.length < n) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) {
      const iso     = d.toISOString().split('T')[0]
      const isToday = days.length === 0
      const day     = ['SUN','MON','TUE','WED','THU','FRI','SAT'][dow]
      const num     = String(d.getDate())
      days.push({ iso, isToday, day, num })
    }
    d = new Date(d.getTime() + 86400000)
  }
  return days
}

const DATES = workingDays(8)

export const Step4ShipmentDetails = () => (
  <div x-show="$store.wizard.currentStep === 4" x-cloak>

    {/* ── Step heading ── */}
    <div style="margin-bottom:24px;">
      <h2 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.2; margin-bottom:6px;">Choose a slot</h2>
      <p style="font-size:14px; color:#78716C; line-height:1.5;">Select your arrival window. Slots are held for 10 minutes while you complete the booking.</p>
    </div>

    {/* Date strip */}
    <div style="background:#fff; border:1.5px solid #e5e7eb; border-radius:14px; padding:12px; margin-bottom:16px; overflow-x:auto; scrollbar-width:none; display:flex; gap:6px;">
      {DATES.map((d) => (
        <button
          key={d.iso}
          type="button"
          x-on:click={`$store.wizard.selectDate('${d.iso}')`}
          style="flex-shrink:0; width:52px; padding:10px 0 8px; border-radius:10px; border:1px solid #e5e7eb; cursor:pointer; text-align:center; transition:all 0.15s ease; position:relative; background:#f9fafb;"
          x-bind:style={`$store.wizard.selectedDate === '${d.iso}'
            ? 'background:#FC6514; border-color:#FC6514; box-shadow:0 4px 12px rgba(252,101,20,0.30);'
            : ''`}
        >
          {/* Day abbreviation */}
          <p
            style="font-size:9px; font-weight:700; letter-spacing:0.08em; margin-bottom:5px; transition:color 0.18s ease;"
            x-bind:style={`$store.wizard.selectedDate === '${d.iso}' ? 'color:rgba(255,255,255,0.75);' : 'color:#78716C;'`}
          >{d.day}</p>

          {/* Date number */}
          <p
            style="font-size:18px; font-weight:700; line-height:1; letter-spacing:-0.02em; transition:color 0.18s ease;"
            x-bind:style={`$store.wizard.selectedDate === '${d.iso}' ? 'color:white;' : 'color:#1C1917;'`}
          >{d.num}</p>

          {/* Today dot */}
          {d.isToday && (
            <div
              style="width:4px; height:4px; border-radius:9999px; margin:5px auto 0; transition:background 0.18s ease;"
              x-bind:style={`$store.wizard.selectedDate === '${d.iso}' ? 'background:rgba(255,255,255,0.65);' : 'background:#FC6514;'`}
            />
          )}
          {!d.isToday && <div style="height:9px;" />}
        </button>
      ))}
    </div>

    {/* ── No date selected ────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.selectedDate === null"
      style="text-align:center; padding:40px 0; color:#78716C;"
    >
      <Icon name={ICONS.calendar} size={28} style="margin:0 auto 8px; opacity:0.4;" />
      <p style="font-size:13px;">Pick a date above to see available slots</p>
    </div>

    {/* ── Loading ─────────────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.selectedDate !== null && $store.wizard.slotsLoading"
      style="text-align:center; padding:40px 0; color:#78716C; font-size:13px;"
    >
      Loading slots…
    </div>

    {/* ── Slot rows ────────────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.length > 0"
      style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px;"
    >
      <template x-for="slot in $store.wizard.slots" x-key="slot.id">
        <button
          type="button"
          x-bind:disabled="slot.busyness === 'full' || slot.busyness === 'closed'"
          x-on:click="slot.busyness !== 'full' && slot.busyness !== 'closed' && $store.wizard.selectSlot(slot.id, slot.startTime + ' – ' + slot.endTime)"
          style="display:flex; align-items:center; gap:12px; padding:14px 18px; border-radius:12px; border:1.5px solid #e5e7eb; text-align:left; width:100%; transition:all 0.15s ease; background:#fff;"
          x-bind:style={`
            (slot.busyness === 'full' || slot.busyness === 'closed')
              ? 'opacity:0.30; cursor:not-allowed;'
              : $store.wizard.selectedSlotId === slot.id
                ? 'background:rgba(252,101,20,0.03); border-color:#FC6514; cursor:pointer;'
                : 'cursor:pointer;'
          `}
          x-on:mouseover={`if(slot.busyness !== 'full' && $store.wizard.selectedSlotId !== slot.id){ $el.style.borderColor='#d1d5db'; }`}
          x-on:mouseout={`if($store.wizard.selectedSlotId !== slot.id){ $el.style.borderColor='#e5e7eb'; }`}
        >
          {/* Time range */}
          <div style="width:96px; flex-shrink:0;">
            <span
              style="font-size:14px; font-weight:600; font-variant-numeric:tabular-nums; transition:color 0.15s ease;"
              x-bind:style="$store.wizard.selectedSlotId === slot.id ? 'color:#FC6514;' : 'color:#1C1917;'"
              x-text="slot.startTime"
            ></span>
            <span style="font-size:12px; color:#78716C; margin-left:3px;" x-text="'– ' + slot.endTime"></span>
          </div>

          {/* Capacity bar */}
          <div style="flex:1; min-width:0;">
            <div style="height:4px; background:rgba(0,0,0,0.06); border-radius:9999px; overflow:hidden;">
              <div
                style="height:100%; border-radius:9999px; transition:width 0.3s ease;"
                x-bind:style="'width:' + Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) + '%; background:' + (Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) > 80 ? '#FC6514' : Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) > 50 ? '#FDBA74' : 'rgba(0,0,0,0.20)') + ';'"
              ></div>
            </div>
          </div>

          {/* Spots left */}
          <div style="width:68px; text-align:right; flex-shrink:0;">
            <span
              style="font-size:11px; font-weight:500; color:#78716C;"
              x-text="slot.busyness === 'full' ? 'Full' : (slot.capacity - slot.confirmed) + ' left'"
            ></span>
          </div>

          {/* Radio dot */}
          <div
            style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease; border:1.5px solid rgba(0,0,0,0.14); background:rgba(0,0,0,0.04);"
            x-bind:style="$store.wizard.selectedSlotId === slot.id
              ? 'background:#FC6514; border-color:#FC6514; box-shadow:rgba(252,101,20,0.30) 0px 2px 8px 0px;'
              : ''"
          >
            <span
              x-show="$store.wizard.selectedSlotId === slot.id"
              style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
            ></span>
          </div>
        </button>
      </template>
    </div>

    {/* No slots for date */}
    <div
      x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.length === 0"
      style="text-align:center; padding:32px 0; color:#78716C; font-size:13px;"
    >
      No slots available for this date.
    </div>

    {/* ── Selected slot bar ────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.selectedSlotId !== null"
      style="display:flex; align-items:center; justify-content:space-between; border-radius:12px; padding:14px 18px; background:linear-gradient(135deg,rgba(252,101,20,0.10) 0%,rgba(252,101,20,0.05) 100%); border:1.5px solid rgba(252,101,20,0.30); box-shadow:0 2px 12px rgba(252,101,20,0.10);"
    >
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="width:8px; height:8px; border-radius:9999px; background:#FC6514; flex-shrink:0; animation:pulse-orange 2s ease-in-out infinite;"></span>
        <span style="font-size:13px; font-weight:600; color:#1C1917;" x-text="$store.wizard.selectedSlotLabel"></span>
        <span style="font-size:11px; color:#78716C; font-weight:500; background:rgba(0,0,0,0.05); border-radius:4px; padding:2px 6px;">selected</span>
      </div>
      <span style="font-size:11px; color:#FC6514; font-weight:600; opacity:0.75;">10-min hold on Next →</span>
    </div>

    {/* Prompt */}
    <div
      x-show="$store.wizard.selectedSlotId === null && $store.wizard.slots.length > 0"
      style="text-align:center; padding:12px 0; font-size:12px; color:#A8A29E;"
    >
      Select a time slot above
    </div>

    {/* Legend */}
    <div style="display:flex; align-items:center; gap:16px; margin-top:14px; padding-top:14px; border-top:1px solid rgba(0,0,0,0.07);">
      <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#78716C;">
        <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:rgba(0,0,0,0.20);"></span>
        Available
      </span>
      <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#78716C;">
        <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:#FDBA74;"></span>
        Filling up
      </span>
      <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#78716C;">
        <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:#FC6514;"></span>
        Nearly full
      </span>
    </div>

  </div>
)
