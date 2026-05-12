import { Icon, ICONS } from '../../lib/Icon'

// Mock slot data for the time grid
const SLOT_HOURS = [
  { id: 's06', start: '06:00', end: '07:00', confirmed: 8,  capacity: 10, busyness: 'busy' },
  { id: 's07', start: '07:00', end: '08:00', confirmed: 9,  capacity: 10, busyness: 'full' },
  { id: 's08', start: '08:00', end: '09:00', confirmed: 6,  capacity: 10, busyness: 'busy' },
  { id: 's09', start: '09:00', end: '10:00', confirmed: 3,  capacity: 10, busyness: 'available' },
  { id: 's10', start: '10:00', end: '11:00', confirmed: 2,  capacity: 10, busyness: 'available' },
  { id: 's11', start: '11:00', end: '12:00', confirmed: 4,  capacity: 10, busyness: 'available' },
  { id: 's12', start: '12:00', end: '13:00', confirmed: 1,  capacity: 10, busyness: 'available' },
  { id: 's13', start: '13:00', end: '14:00', confirmed: 2,  capacity: 10, busyness: 'available' },
  { id: 's14', start: '14:00', end: '15:00', confirmed: 1,  capacity: 10, busyness: 'available' },
  { id: 's15', start: '15:00', end: '16:00', confirmed: 3,  capacity: 10, busyness: 'available' },
  { id: 's16', start: '16:00', end: '17:00', confirmed: 2,  capacity: 10, busyness: 'available' },
  { id: 's17', start: '17:00', end: '18:00', confirmed: 0,  capacity: 10, busyness: 'available' },
]

const BUSYNESS_CLASS: Record<string, string> = {
  available: 'bg-green-50 border border-green-200 text-green-800 hover:bg-green-100 cursor-pointer transition-colors',
  busy:      'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 cursor-pointer transition-colors',
  full:      'bg-red-50 border border-red-200 text-red-400 cursor-not-allowed opacity-60',
  closed:    'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed',
}

const BUSYNESS_LABEL: Record<string, string> = {
  available: 'Spots available',
  busy:      'Filling up',
  full:      'Full',
  closed:    'Closed',
}

// Generate 8 days from today (2026-05-12)
const DATES = [
  { iso: '2026-05-12', label: 'Today',     day: 'Tue', num: '12', mon: 'May' },
  { iso: '2026-05-13', label: 'Tomorrow',  day: 'Wed', num: '13', mon: 'May' },
  { iso: '2026-05-14', label: '',          day: 'Thu', num: '14', mon: 'May' },
  { iso: '2026-05-15', label: '',          day: 'Fri', num: '15', mon: 'May' },
  { iso: '2026-05-18', label: '',          day: 'Mon', num: '18', mon: 'May' },
  { iso: '2026-05-19', label: '',          day: 'Tue', num: '19', mon: 'May' },
  { iso: '2026-05-20', label: '',          day: 'Wed', num: '20', mon: 'May' },
  { iso: '2026-05-21', label: '',          day: 'Thu', num: '21', mon: 'May' },
]

export const Step4ShipmentDetails = () => (
  <div x-show="$store.wizard.currentStep === 4" x-cloak>
    <h2 class="text-xl font-bold text-foreground mb-1">Choose a Time Slot</h2>
    <p class="text-foreground-muted text-sm mb-5">Select your preferred date and time. Your slot is held for 10 minutes while you complete the booking.</p>

    {/* Date strip */}
    <div class="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
      {DATES.map((d) => (
        <button
          key={d.iso}
          type="button"
          x-on:click={`$store.wizard.selectedDate = '${d.iso}'; $store.wizard.selectedSlotId = null; $store.wizard.selectedSlotLabel = null`}
          class="shrink-0 border rounded-xl px-3 py-2.5 text-center min-w-[68px] transition-all"
          {...{"x-bind:class": `$store.wizard.selectedDate === '${d.iso}' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground-muted border-border hover:border-primary/40 hover:bg-primary-soft/50'`}}
        >
          {d.label && <div class="text-xs font-semibold mb-0.5 leading-tight">{d.label}</div>}
          {!d.label && <div class="text-xs font-medium mb-0.5 leading-tight">{d.day}</div>}
          <div class="text-xl font-bold leading-none">{d.num}</div>
          <div class="text-xs mt-0.5">{d.mon}</div>
        </button>
      ))}
    </div>

    {/* Time grid */}
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
      {SLOT_HOURS.map((slot) => (
        <button
          key={slot.id}
          type="button"
          disabled={slot.busyness === 'full' || slot.busyness === 'closed'}
          x-on:click={slot.busyness !== 'full' && slot.busyness !== 'closed'
            ? `$store.wizard.selectSlot('${slot.id}', '${slot.start} – ${slot.end}')`
            : ''}
          class={`rounded-xl p-3 text-left transition-all relative ${BUSYNESS_CLASS[slot.busyness]}`}
          {...{"x-bind:class": `$store.wizard.selectedSlotId === '${slot.id}' ? 'ring-2 ring-primary ring-offset-1 bg-primary text-primary-foreground border-primary' : ''`}}
        >
          <div class="font-bold text-sm">{slot.start}</div>
          <div class="text-xs opacity-80">– {slot.end}</div>
          <div class="text-xs mt-1 opacity-70">{BUSYNESS_LABEL[slot.busyness]}</div>
          {slot.busyness !== 'full' && slot.busyness !== 'closed' && (
            <div class="text-xs mt-0.5 opacity-60">{slot.capacity - slot.confirmed} left</div>
          )}

          {/* Selected checkmark */}
          <div
            class="absolute top-2 right-2"
            x-show={`$store.wizard.selectedSlotId === '${slot.id}'`}
          >
            <Icon name={ICONS.check} size={16} class="text-primary-foreground" />
          </div>
        </button>
      ))}
    </div>

    {/* Selected slot info */}
    <div
      x-show="$store.wizard.selectedSlotId !== null"
      class="bg-primary-soft border border-primary/30 rounded-2xl px-5 py-4 flex items-center justify-between text-sm"
    >
      <div class="flex items-center gap-2 text-primary">
        <Icon name={ICONS.check} size={16} class="text-primary shrink-0" />
        <span class="font-semibold">Slot selected:</span>
        <span class="text-foreground" x-text="$store.wizard.selectedSlotLabel"></span>
      </div>
      <span class="text-xs text-primary font-semibold">10-min hold starts on Next →</span>
    </div>

    {/* No slot selected state */}
    <div
      x-show="$store.wizard.selectedSlotId === null"
      class="text-center py-3 text-xs text-foreground-muted"
    >
      <Icon name={ICONS.clock} size={16} class="mx-auto mb-1 text-foreground-muted" />
      Select a time slot above
    </div>

    {/* Legend */}
    <div class="flex flex-wrap gap-4 mt-4 text-xs text-foreground-muted">
      {[
        { color: 'bg-green-100 border-green-300', label: 'Available' },
        { color: 'bg-amber-100 border-amber-300', label: 'Filling up' },
        { color: 'bg-red-100 border-red-300',     label: 'Full' },
      ].map((l) => (
        <div key={l.label} class="flex items-center gap-1.5">
          <span class={`w-3 h-3 rounded border ${l.color} inline-block`}></span>
          {l.label}
        </div>
      ))}
    </div>
  </div>
)
