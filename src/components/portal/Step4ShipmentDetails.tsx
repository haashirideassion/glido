import { Icon, ICONS } from '../../lib/Icon'

// Generate next N working days from today
function workingDays(n: number): { iso: string; label: string; day: string; num: string; mon: string }[] {
  const days: { iso: string; label: string; day: string; num: string; mon: string }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let d = new Date(today)
  while (days.length < n) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) {
      const iso = d.toISOString().split('T')[0]
      const label = days.length === 0 ? 'Today' : days.length === 1 ? 'Tomorrow' : ''
      const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dow]
      const num = String(d.getDate())
      const mon = d.toLocaleString('en-AU', { month: 'short' })
      days.push({ iso, label, day, num, mon })
    }
    d = new Date(d.getTime() + 86400000)
  }
  return days
}

const DATES = workingDays(8)

export const Step4ShipmentDetails = () => (
  <div x-show="$store.wizard.currentStep === 4" x-cloak>
    <h2 class="text-xl font-bold mb-1" style="color:#44403C;">Choose a Time Slot</h2>
    <p class="text-sm mb-5" style="color:#A8A29E;">Select your preferred date and time. Your slot is held for 10 minutes while you complete the booking.</p>

    {/* Date strip */}
    <div class="flex gap-2 overflow-x-auto pb-2 mb-5" style="scrollbar-width:none;">
      {DATES.map((d) => (
        <button
          key={d.iso}
          type="button"
          x-on:click={`$store.wizard.selectDate('${d.iso}')`}
          class="shrink-0 rounded-xl px-3 py-2.5 text-center transition-all"
          style="min-width:68px; border:1px solid #D6D3D1; background:#F5F3EC; color:#78716C;"
          {...{"x-bind:style": `$store.wizard.selectedDate === '${d.iso}' ? 'background:#F59E0B; border-color:#F59E0B; color:#fff;' : 'background:#F5F3EC; border-color:#D6D3D1; color:#78716C;'`}}
        >
          {d.label
            ? <div class="text-xs font-semibold mb-0.5 leading-tight">{d.label}</div>
            : <div class="text-xs font-medium mb-0.5 leading-tight">{d.day}</div>
          }
          <div class="text-xl font-bold leading-none">{d.num}</div>
          <div class="text-xs mt-0.5">{d.mon}</div>
        </button>
      ))}
    </div>

    {/* No date selected prompt */}
    <div x-show="$store.wizard.selectedDate === null" class="text-center py-10" style="color:#A8A29E;">
      <Icon name={ICONS.calendar} size={32} class="mx-auto mb-2" />
      <p class="text-sm">Select a date above to see available slots</p>
    </div>

    {/* Loading */}
    <div x-show="$store.wizard.selectedDate !== null && $store.wizard.slotsLoading" class="text-center py-10" style="color:#A8A29E;">
      <p class="text-sm">Loading slots…</p>
    </div>

    {/* Slot grid */}
    <div
      x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.length > 0"
      class="grid grid-cols-2 gap-2 mb-5"
      style="grid-template-columns: repeat(3, 1fr);"
    >
      <template x-for="slot in $store.wizard.slots" x-key="slot.id">
        <button
          type="button"
          x-bind:disabled="slot.busyness === 'full' || slot.busyness === 'closed'"
          x-on:click="slot.busyness !== 'full' && slot.busyness !== 'closed' && $store.wizard.selectSlot(slot.id, slot.startTime + ' – ' + slot.endTime)"
          class="rounded-xl p-3 text-left transition-all relative"
          x-bind:style={`
            $store.wizard.selectedSlotId === slot.id
              ? 'background:#F59E0B; border:2px solid #F59E0B; color:#fff; cursor:pointer;'
              : slot.busyness === 'available'
                ? 'background:#F0FDF4; border:1px solid #BBF7D0; color:#166534; cursor:pointer;'
                : slot.busyness === 'busy'
                  ? 'background:#FFFBEB; border:1px solid #FDE68A; color:#92400E; cursor:pointer;'
                  : 'background:#FEF2F2; border:1px solid #FECACA; color:#991B1B; opacity:0.6; cursor:not-allowed;'
          `}
        >
          <div class="font-bold text-sm" x-text="slot.startTime"></div>
          <div class="text-xs opacity-80" x-text="'– ' + slot.endTime"></div>
          <div
            class="text-xs mt-1 opacity-70"
            x-text="slot.busyness === 'available' ? 'Available' : slot.busyness === 'busy' ? 'Filling up' : 'Full'"
          ></div>
          <div class="text-xs mt-0.5 opacity-60" x-show="slot.busyness !== 'full'" x-text="(slot.capacity - slot.confirmed) + ' left'"></div>

          {/* Selected checkmark */}
          <div class="absolute top-2 right-2" x-show="$store.wizard.selectedSlotId === slot.id">
            <Icon name={ICONS.check} size={16} class="" style="color:#fff;" />
          </div>
        </button>
      </template>
    </div>

    {/* No slots for date */}
    <div
      x-show="$store.wizard.selectedDate !== null && !$store.wizard.slotsLoading && $store.wizard.slots.length === 0"
      class="text-center py-10"
      style="color:#A8A29E;"
    >
      <p class="text-sm">No slots available for this date.</p>
    </div>

    {/* Selected slot banner */}
    <div
      x-show="$store.wizard.selectedSlotId !== null"
      class="rounded-2xl px-5 py-4 flex items-center justify-between text-sm"
      style="background:#FFFBEB; border:1px solid #FDE68A;"
    >
      <div class="flex items-center gap-2" style="color:#92400E;">
        <Icon name={ICONS.check} size={16} style="color:#F59E0B;" class="shrink-0" />
        <span class="font-semibold">Slot selected:</span>
        <span style="color:#44403C;" x-text="$store.wizard.selectedSlotLabel"></span>
      </div>
      <span class="text-xs font-semibold" style="color:#F59E0B;">10-min hold starts on Next →</span>
    </div>

    {/* No slot prompt */}
    <div
      x-show="$store.wizard.selectedSlotId === null && $store.wizard.slots.length > 0"
      class="text-center py-3 text-xs"
      style="color:#A8A29E;"
    >
      <Icon name={ICONS.clock} size={16} class="mx-auto mb-1" />
      Select a time slot above
    </div>

    {/* Legend */}
    <div class="flex flex-wrap gap-4 mt-4 text-xs" style="color:#A8A29E;">
      {[
        { color: 'background:#F0FDF4; border:1px solid #BBF7D0;', label: 'Available' },
        { color: 'background:#FFFBEB; border:1px solid #FDE68A;', label: 'Filling up' },
        { color: 'background:#FEF2F2; border:1px solid #FECACA; opacity:0.6;', label: 'Full' },
      ].map((l) => (
        <div key={l.label} class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded inline-block" style={l.color}></span>
          {l.label}
        </div>
      ))}
    </div>
  </div>
)
