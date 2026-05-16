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

    <h2 style="font-size:18px; font-weight:700; color:#F1F5F9; letter-spacing:-0.03em; margin-bottom:3px;">
      Choose a time slot
    </h2>
    <p style="font-size:13px; color:#64748B; margin-bottom:20px; line-height:1.5;">
      Your slot is held for 10 minutes once you proceed.
    </p>

    {/* ── Date strip ─────────────────────────────────────────────────────── */}
    <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:4px; margin-bottom:20px; scrollbar-width:none;">
      {DATES.map((d) => (
        <button
          key={d.iso}
          type="button"
          x-on:click={`$store.wizard.selectDate('${d.iso}')`}
          style="flex-shrink:0; width:52px; padding:9px 0 7px; border-radius:14px; border:none; cursor:pointer; text-align:center; transition:all 0.18s ease; position:relative;"
          x-bind:style={`$store.wizard.selectedDate === '${d.iso}'
            ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), rgba(252,101,20,0.40) 0px 4px 14px 0px;'
            : 'background:rgba(255,255,255,0.06); box-shadow:inset 0 1px 0 rgba(255,255,255,0.07);'`}
        >
          {/* Day abbreviation */}
          <p
            style="font-size:9px; font-weight:700; letter-spacing:0.08em; margin-bottom:5px; transition:color 0.18s ease;"
            x-bind:style={`$store.wizard.selectedDate === '${d.iso}' ? 'color:rgba(255,255,255,0.75);' : 'color:#64748B;'`}
          >{d.day}</p>

          {/* Date number */}
          <p
            style="font-size:18px; font-weight:700; line-height:1; letter-spacing:-0.02em; transition:color 0.18s ease;"
            x-bind:style={`$store.wizard.selectedDate === '${d.iso}' ? 'color:white;' : 'color:#F1F5F9;'`}
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
      style="text-align:center; padding:40px 0; color:#64748B;"
    >
      <Icon name={ICONS.calendar} size={28} style="margin:0 auto 8px; opacity:0.4;" />
      <p style="font-size:13px;">Pick a date above to see available slots</p>
    </div>

    {/* ── Loading ─────────────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.selectedDate !== null && $store.wizard.slotsLoading"
      style="text-align:center; padding:40px 0; color:#64748B; font-size:13px;"
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
          style="display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.07); text-align:left; width:100%; transition:all 0.15s ease; background:rgba(255,255,255,0.04); box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);"
          x-bind:style={`
            (slot.busyness === 'full' || slot.busyness === 'closed')
              ? 'opacity:0.30; cursor:not-allowed;'
              : $store.wizard.selectedSlotId === slot.id
                ? 'background:rgba(252,101,20,0.08); border-color:rgba(252,101,20,0.40); box-shadow:0 0 0 3px rgba(252,101,20,0.08); cursor:pointer;'
                : 'cursor:pointer;'
          `}
          x-on:mouseover={`if(slot.busyness !== 'full' && $store.wizard.selectedSlotId !== slot.id){ $el.style.borderColor='rgba(255,255,255,0.13)'; }`}
          x-on:mouseout={`if($store.wizard.selectedSlotId !== slot.id){ $el.style.borderColor='rgba(255,255,255,0.07)'; }`}
        >
          {/* Time range */}
          <div style="width:96px; flex-shrink:0;">
            <span
              style="font-size:14px; font-weight:600; font-variant-numeric:tabular-nums; transition:color 0.15s ease;"
              x-bind:style="$store.wizard.selectedSlotId === slot.id ? 'color:#FC6514;' : 'color:#F1F5F9;'"
              x-text="slot.startTime"
            ></span>
            <span style="font-size:12px; color:#64748B; margin-left:3px;" x-text="'– ' + slot.endTime"></span>
          </div>

          {/* Capacity bar */}
          <div style="flex:1; min-width:0;">
            <div style="height:4px; background:rgba(255,255,255,0.08); border-radius:9999px; overflow:hidden;">
              <div
                style="height:100%; border-radius:9999px; transition:width 0.3s ease;"
                x-bind:style="'width:' + Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) + '%; background:' + (Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) > 80 ? '#FC6514' : Math.round((slot.confirmed / Math.max(slot.capacity,1)) * 100) > 50 ? '#FDBA74' : 'rgba(255,255,255,0.25)') + ';'"
              ></div>
            </div>
          </div>

          {/* Spots left */}
          <div style="width:68px; text-align:right; flex-shrink:0;">
            <span
              style="font-size:11px; font-weight:500; color:#64748B;"
              x-text="slot.busyness === 'full' ? 'Full' : (slot.capacity - slot.confirmed) + ' left'"
            ></span>
          </div>

          {/* Radio dot */}
          <div
            style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease; border:1.5px solid rgba(255,255,255,0.20); background:rgba(255,255,255,0.05);"
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
      style="text-align:center; padding:32px 0; color:#64748B; font-size:13px;"
    >
      No slots available for this date.
    </div>

    {/* ── Selected slot bar ────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.selectedSlotId !== null"
      style="display:flex; align-items:center; justify-content:space-between; border-radius:10px; padding:12px 16px; background:rgba(252,101,20,0.08); border:1px solid rgba(252,101,20,0.25); box-shadow:inset 0 1px 0 rgba(255,255,255,0.06);"
    >
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="width:8px; height:8px; border-radius:9999px; background:#FC6514; flex-shrink:0; box-shadow:0 0 6px rgba(252,101,20,0.60);"></span>
        <span style="font-size:13px; font-weight:500; color:#F1F5F9;" x-text="$store.wizard.selectedSlotLabel"></span>
        <span style="font-size:12px; color:#64748B;">selected</span>
      </div>
      <span style="font-size:11px; color:#94A3B8; font-weight:500;">10-min hold on Next →</span>
    </div>

    {/* Prompt */}
    <div
      x-show="$store.wizard.selectedSlotId === null && $store.wizard.slots.length > 0"
      style="text-align:center; padding:12px 0; font-size:12px; color:rgba(255,255,255,0.22);"
    >
      Select a time slot above
    </div>

    {/* Legend */}
    <div style="display:flex; align-items:center; gap:16px; margin-top:14px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.07);">
      <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#64748B;">
        <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:rgba(255,255,255,0.25);"></span>
        Available
      </span>
      <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#64748B;">
        <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:#FDBA74;"></span>
        Filling up
      </span>
      <span style="display:flex; align-items:center; gap:6px; font-size:11px; color:#64748B;">
        <span style="display:inline-block; width:20px; height:3px; border-radius:9999px; background:#FC6514;"></span>
        Nearly full
      </span>
    </div>

  </div>
)
