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
    <div style="background:#fff; border:1.5px solid #e5e7eb; border-radius:16px; padding:14px; margin-bottom:20px; overflow-x:auto; scrollbar-width:none; display:flex; gap:7px;">
      {DATES.map((d) => (
        <button
          key={d.iso}
          type="button"
          x-on:click={`$store.wizard.selectDate('${d.iso}')`}
          style="flex-shrink:0; width:62px; padding:13px 0 11px; border-radius:12px; border:1.5px solid transparent; cursor:pointer; text-align:center; transition:all 0.18s ease; position:relative;"
          x-bind:style={`{ background: $store.wizard.selectedDate === '${d.iso}' ? '#FC6514' : 'rgba(0,0,0,0.028)', borderColor: $store.wizard.selectedDate === '${d.iso}' ? '#FC6514' : 'rgba(0,0,0,0.07)', boxShadow: $store.wizard.selectedDate === '${d.iso}' ? '0 6px 16px rgba(252,101,20,0.32)' : 'none' }`}
        >
          {/* Day abbreviation */}
          <p
            style="font-size:9px; font-weight:700; letter-spacing:0.09em; margin-bottom:6px; transition:color 0.18s ease;"
            x-bind:style={`{ color: $store.wizard.selectedDate === '${d.iso}' ? 'rgba(255,255,255,0.72)' : '#A8A29E' }`}
          >{d.day}</p>

          {/* Date number */}
          <p
            style="font-size:21px; font-weight:800; line-height:1; letter-spacing:-0.03em; transition:color 0.18s ease;"
            x-bind:style={`{ color: $store.wizard.selectedDate === '${d.iso}' ? 'white' : '#1C1917' }`}
          >{d.num}</p>

          {/* Today dot */}
          {d.isToday && (
            <div
              style="width:4px; height:4px; border-radius:9999px; margin:6px auto 0; transition:background 0.18s ease;"
              x-bind:style={`{ background: $store.wizard.selectedDate === '${d.iso}' ? 'rgba(255,255,255,0.60)' : '#FC6514' }`}
            />
          )}
          {!d.isToday && <div style="height:10px;" />}
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

    {/* ── Slot grid (2-column cards) ───────────────────────────────────────── */}
    <div
      x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.length > 0"
      style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;"
    >
      <template x-for="slot in $store.wizard.slots" x-key="slot.id">
        <button
          type="button"
          x-bind:disabled="slot.busyness === 'full' || slot.busyness === 'closed'"
          x-on:click="slot.busyness !== 'full' && slot.busyness !== 'closed' && $store.wizard.selectSlot(slot.id, slot.startTime + ' – ' + slot.endTime)"
          style="position:relative; display:flex; flex-direction:column; justify-content:space-between; padding:16px 16px 14px; border-radius:14px; border:1.5px solid #e5e7eb; text-align:left; transition:all 0.18s ease; background:#fff; cursor:pointer; min-height:96px;"
          x-bind:style="{ opacity: (slot.busyness === 'full' || slot.busyness === 'closed') ? '0.30' : '1', cursor: (slot.busyness === 'full' || slot.busyness === 'closed') ? 'not-allowed' : 'pointer', background: $store.wizard.selectedSlotId === slot.id ? 'rgba(252,101,20,0.04)' : '#fff', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#e5e7eb', boxShadow: $store.wizard.selectedSlotId === slot.id ? '0 0 0 3px rgba(252,101,20,0.10), 0 4px 14px rgba(252,101,20,0.14)' : '0 1px 3px rgba(0,0,0,0.04)' }"
          x-on:mouseover={`if(slot.busyness !== 'full' && $store.wizard.selectedSlotId !== slot.id){ $el.style.borderColor='#d1d5db'; $el.style.boxShadow='0 2px 8px rgba(0,0,0,0.07)'; }`}
          x-on:mouseout={`if($store.wizard.selectedSlotId !== slot.id){ $el.style.borderColor='#e5e7eb'; $el.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'; }`}
        >
          {/* Radio indicator — top right */}
          <div
            style="position:absolute; top:14px; right:14px; width:18px; height:18px; border-radius:9999px; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease; border:1.5px solid rgba(0,0,0,0.14); background:rgba(0,0,0,0.04);"
            x-bind:style="{ background: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : 'rgba(0,0,0,0.04)', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : 'rgba(0,0,0,0.14)' }"
          >
            <span
              x-show="$store.wizard.selectedSlotId === slot.id"
              style="width:6px; height:6px; border-radius:9999px; background:white; display:block;"
            ></span>
          </div>

          {/* Time display */}
          <div style="padding-right:28px;">
            <p
              style="font-size:22px; font-weight:800; letter-spacing:-0.04em; line-height:1; margin-bottom:3px; font-variant-numeric:tabular-nums; transition:color 0.15s ease;"
              x-bind:style="{ color: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#1C1917' }"
              x-text="slot.startTime"
            ></p>
            <p
              style="font-size:11px; font-weight:500; color:#A8A29E;"
              x-text="'until ' + slot.endTime"
            ></p>
          </div>

          {/* Capacity bar + spots left */}
          <div style="margin-top:14px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:5px;">
              <span
                style="font-size:10px; font-weight:600; color:#78716C;"
                x-text="slot.busyness === 'full' ? 'Full' : (slot.capacity - slot.confirmed) + ' spots left'"
              ></span>
            </div>
            <div style="height:3px; background:rgba(0,0,0,0.06); border-radius:9999px; overflow:hidden;">
              <div
                style="height:100%; border-radius:9999px; transition:width 0.3s ease;"
                x-bind:style="{ width: Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) + '%', background: Math.max(0, Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) - 80) !== 0 ? '#FC6514' : (Math.max(0, Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) - 50) !== 0 ? '#FDBA74' : 'rgba(0,0,0,0.20)') }"
              ></div>
            </div>
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
