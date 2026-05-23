import { Icon, ICONS } from '../../lib/Icon'

function calendarDays(n: number): { iso: string; isToday: boolean; dayFull: string; num: string }[] {
  const days: { iso: string; isToday: boolean; dayFull: string; num: string }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let d = new Date(today)
  const FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  while (days.length < n) {
    days.push({
      iso:     d.toISOString().split('T')[0],
      isToday: days.length === 0,
      dayFull: FULL[d.getDay()],
      num:     String(d.getDate()),
    })
    d = new Date(d.getTime() + 86400000)
  }
  return days
}

const DATES = calendarDays(7)


export const Step4ShipmentDetails = () => (
  <div x-show="$store.wizard.currentStep === 4" x-cloak>

    {/* ── Step heading ── */}
    <div style="margin-bottom:28px;">
      <h2 style="font-size:24px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.2; margin-bottom:8px;">Pick Date & Time</h2>
      <p style="font-size:14px; color:#78716C; line-height:1.5;">Select a date and time slot and please ensure your vehicle arrives within the chosen window to avoid delays.</p>
    </div>

    {/* ── Date strip ── */}
    <div style="display:flex; gap:10px; margin-bottom:32px;">
      {DATES.map((d) => (
        <button
          key={d.iso}
          type="button"
          x-on:click={`$store.wizard.selectDate('${d.iso}')`}
          style="flex:1; padding:16px 8px 14px; border-radius:12px; border:1.5px solid #e5e7eb; background:#fff; cursor:pointer; text-align:center; transition:all 0.18s ease;"
          x-bind:style={`{
            background:   $store.wizard.selectedDate === '${d.iso}' ? 'rgba(252,101,20,0.06)' : '#fff',
            borderColor:  $store.wizard.selectedDate === '${d.iso}' ? '#FC6514' : '#e5e7eb',
            boxShadow:    $store.wizard.selectedDate === '${d.iso}' ? '0 0 0 1px #FC6514, 0 4px 14px rgba(252,101,20,0.18)' : 'none'
          }`}
        >
          <p
            style="font-size:12px; font-weight:500; margin-bottom:8px; transition:all 0.18s ease; color:#9CA3AF;"
            x-bind:style={`{ color: $store.wizard.selectedDate === '${d.iso}' ? '#FC6514' : '#9CA3AF', fontWeight: $store.wizard.selectedDate === '${d.iso}' ? '700' : '500' }`}
          >{d.dayFull}</p>
          <p
            class="slot-num"
            style="font-size:26px; font-weight:800; letter-spacing:-0.03em; line-height:1; color:#1C1917;"
          >{d.num}</p>
          {d.isToday && (
            <div style="width:5px; height:5px; border-radius:9999px; margin:6px auto 0; background:#FC6514;" />
          )}
          {!d.isToday && <div style="height:11px;" />}
        </button>
      ))}
    </div>

    {/* ── No date selected ── */}
    <div
      x-show="$store.wizard.selectedDate === null"
      style="text-align:center; padding:48px 0; color:#9CA3AF;"
    >
      <Icon name={ICONS.calendar} size={32} style="margin:0 auto 10px; opacity:0.35;" />
      <p style="font-size:14px;">Pick a date above to see available slots</p>
    </div>

    {/* ── Loading ── */}
    <div
      x-show="$store.wizard.selectedDate !== null && $store.wizard.slotsLoading"
      style="text-align:center; padding:48px 0; color:#9CA3AF; font-size:14px;"
    >
      Loading slots…
    </div>

    {/* ── No slots ── */}
    <div
      x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.length === 0"
      style="text-align:center; padding:48px 0; color:#9CA3AF; font-size:14px;"
    >
      No slots available for this date.
    </div>

    {/* ── Morning Slots (before 12:00) ── */}
    <div x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.some(s => parseInt(s.startTime) < 12)">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
        <Icon name={ICONS.bell} size={18} style="color:#FC6514; flex-shrink:0;" />
        <h3 style="font-size:16px; font-weight:600; color:#1C1917;">Morning Slots</h3>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px;">
        <template x-for="slot in $store.wizard.slots.filter(s => parseInt(s.startTime) < 12)" x-key="slot.id">
          <button
            type="button"
            x-bind:disabled="slot.busyness === 'full' || slot.busyness === 'closed'"
            x-on:click="slot.busyness !== 'full' && slot.busyness !== 'closed' && $store.wizard.selectSlot(slot.id, slot.startTime + ' – ' + slot.endTime)"
            style="width:100%; position:relative; display:flex; flex-direction:column; padding:16px; border-radius:12px; border:1.5px solid #e5e7eb; text-align:left; transition:all 0.18s ease; background:#fff; cursor:pointer; box-sizing:border-box;"
            x-bind:style="{ background: $store.wizard.selectedSlotId === slot.id ? 'rgba(252,101,20,0.05)' : '#fff', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#e5e7eb', boxShadow: $store.wizard.selectedSlotId === slot.id ? '0 0 0 1px #FC6514, 0 4px 14px rgba(252,101,20,0.18)' : 'none', cursor: (slot.busyness === 'full' || slot.busyness === 'closed') ? 'not-allowed' : 'pointer' }"
          >
            {/* Radio */}
            <div
              style="position:absolute; top:14px; right:14px; width:20px; height:20px; border-radius:9999px; border:1.5px solid #d1d5db; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease;"
              x-bind:style="{ background: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : 'transparent', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#d1d5db' }"
            >
              <span x-show="$store.wizard.selectedSlotId === slot.id" style="width:7px; height:7px; border-radius:9999px; background:white; display:block;" />
            </div>
            {/* Time */}
            <p
              class="slot-num"
              style="font-size:20px; font-weight:700; letter-spacing:-0.02em; line-height:1; margin-bottom:4px; padding-right:28px; transition:color 0.15s ease;"
              x-bind:style="{ color: slot.busyness === 'full' ? '#EF4444' : ($store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#1C1917') }"
              x-text="slot.startTime"
            />
            <p class="slot-num" style="font-size:12px; color:#9CA3AF; margin-bottom:12px;" x-text="'until ' + slot.endTime" />
            {/* Spots */}
            <p
              style="font-size:13px; font-weight:500; margin-top:auto;"
              x-bind:style="{ color: slot.busyness === 'full' ? '#EF4444' : ((slot.capacity - slot.confirmed) === 0 ? '#EF4444' : ((slot.capacity - slot.confirmed) <= 5 ? '#F97316' : '#16A34A')) }"
              x-text="slot.busyness === 'full' ? 'All Spots Booked' : (slot.capacity - slot.confirmed) + ' Spots available'"
            />
          </button>
        </template>
      </div>
    </div>

    {/* ── Afternoon Slots (12:00–16:59) ── */}
    <div x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.some(s => parseInt(s.startTime) >= 12 && parseInt(s.startTime) < 17)">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
        <Icon name={ICONS.clock} size={18} style="color:#FC6514; flex-shrink:0;" />
        <h3 style="font-size:16px; font-weight:600; color:#1C1917;">Afternoon Slots</h3>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px;">
        <template x-for="slot in $store.wizard.slots.filter(s => parseInt(s.startTime) >= 12 && parseInt(s.startTime) < 17)" x-key="slot.id">
          <button
            type="button"
            x-bind:disabled="slot.busyness === 'full' || slot.busyness === 'closed'"
            x-on:click="slot.busyness !== 'full' && slot.busyness !== 'closed' && $store.wizard.selectSlot(slot.id, slot.startTime + ' – ' + slot.endTime)"
            style="width:100%; position:relative; display:flex; flex-direction:column; padding:16px; border-radius:12px; border:1.5px solid #e5e7eb; text-align:left; transition:all 0.18s ease; background:#fff; cursor:pointer; box-sizing:border-box;"
            x-bind:style="{ background: $store.wizard.selectedSlotId === slot.id ? 'rgba(252,101,20,0.05)' : '#fff', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#e5e7eb', boxShadow: $store.wizard.selectedSlotId === slot.id ? '0 0 0 1px #FC6514, 0 4px 14px rgba(252,101,20,0.18)' : 'none', cursor: (slot.busyness === 'full' || slot.busyness === 'closed') ? 'not-allowed' : 'pointer' }"
          >
            {/* Radio */}
            <div
              style="position:absolute; top:14px; right:14px; width:20px; height:20px; border-radius:9999px; border:1.5px solid #d1d5db; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease;"
              x-bind:style="{ background: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : 'transparent', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#d1d5db' }"
            >
              <span x-show="$store.wizard.selectedSlotId === slot.id" style="width:7px; height:7px; border-radius:9999px; background:white; display:block;" />
            </div>
            {/* Time */}
            <p
              class="slot-num"
              style="font-size:20px; font-weight:700; letter-spacing:-0.02em; line-height:1; margin-bottom:4px; padding-right:28px; transition:color 0.15s ease;"
              x-bind:style="{ color: slot.busyness === 'full' ? '#EF4444' : ($store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#1C1917') }"
              x-text="slot.startTime"
            />
            <p class="slot-num" style="font-size:12px; color:#9CA3AF; margin-bottom:12px;" x-text="'until ' + slot.endTime" />
            {/* Spots */}
            <p
              style="font-size:13px; font-weight:500; margin-top:auto;"
              x-bind:style="{ color: slot.busyness === 'full' ? '#EF4444' : ((slot.capacity - slot.confirmed) === 0 ? '#EF4444' : ((slot.capacity - slot.confirmed) <= 5 ? '#F97316' : '#16A34A')) }"
              x-text="slot.busyness === 'full' ? 'All Spots Booked' : (slot.capacity - slot.confirmed) + ' Spots available'"
            />
          </button>
        </template>
      </div>
    </div>

    {/* ── Evening Slots (17:00+) ── */}
    <div x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.some(s => parseInt(s.startTime) >= 17)">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
        <Icon name={ICONS.star} size={18} style="color:#FC6514; flex-shrink:0;" />
        <h3 style="font-size:16px; font-weight:600; color:#1C1917;">Evening Slots</h3>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px;">
        <template x-for="slot in $store.wizard.slots.filter(s => parseInt(s.startTime) >= 17)" x-key="slot.id">
          <button
            type="button"
            x-bind:disabled="slot.busyness === 'full' || slot.busyness === 'closed'"
            x-on:click="slot.busyness !== 'full' && slot.busyness !== 'closed' && $store.wizard.selectSlot(slot.id, slot.startTime + ' – ' + slot.endTime)"
            style="width:100%; position:relative; display:flex; flex-direction:column; padding:16px; border-radius:12px; border:1.5px solid #e5e7eb; text-align:left; transition:all 0.18s ease; background:#fff; cursor:pointer; box-sizing:border-box;"
            x-bind:style="{ background: $store.wizard.selectedSlotId === slot.id ? 'rgba(252,101,20,0.05)' : '#fff', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#e5e7eb', boxShadow: $store.wizard.selectedSlotId === slot.id ? '0 0 0 1px #FC6514, 0 4px 14px rgba(252,101,20,0.18)' : 'none', cursor: (slot.busyness === 'full' || slot.busyness === 'closed') ? 'not-allowed' : 'pointer' }"
          >
            <div
              style="position:absolute; top:14px; right:14px; width:20px; height:20px; border-radius:9999px; border:1.5px solid #d1d5db; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease;"
              x-bind:style="{ background: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : 'transparent', borderColor: $store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#d1d5db' }"
            >
              <span x-show="$store.wizard.selectedSlotId === slot.id" style="width:7px; height:7px; border-radius:9999px; background:white; display:block;" />
            </div>
            <p
              class="slot-num"
              style="font-size:20px; font-weight:700; letter-spacing:-0.02em; line-height:1; margin-bottom:4px; padding-right:28px; transition:color 0.15s ease;"
              x-bind:style="{ color: slot.busyness === 'full' ? '#EF4444' : ($store.wizard.selectedSlotId === slot.id ? '#FC6514' : '#1C1917') }"
              x-text="slot.startTime"
            />
            <p class="slot-num" style="font-size:12px; color:#9CA3AF; margin-bottom:12px;" x-text="'until ' + slot.endTime" />
            <p
              style="font-size:13px; font-weight:500; margin-top:auto;"
              x-bind:style="{ color: slot.busyness === 'full' ? '#EF4444' : ((slot.capacity - slot.confirmed) === 0 ? '#EF4444' : ((slot.capacity - slot.confirmed) <= 5 ? '#F97316' : '#16A34A')) }"
              x-text="slot.busyness === 'full' ? 'All Spots Booked' : (slot.capacity - slot.confirmed) + ' Spots available'"
            />
          </button>
        </template>
      </div>
    </div>


  </div>
)
