import { SLOT_CELL_CLASS } from '../../lib/constants'
import type { TimeSlot } from '../../data/types'

const SLOT_LABEL: Record<string, string> = {
  available: 'Available',
  busy:      'Busy',
  full:      'Full',
  closed:    'Closed',
}

interface Props {
  slots: TimeSlot[]
  date: string
}

export const SlotGrid = ({ slots, date }: Props) => {
  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div id="slot-grid" class="mt-4">
      <p class="text-sm text-slate-500 mb-4">{formatted}</p>
      {slots.length === 0 ? (
        <div class="text-center py-10 text-slate-400">No slots available for this date.</div>
      ) : (
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {slots.map((slot) => {
            const canSelect = slot.busyness === 'available' || slot.busyness === 'busy'
            const cellClass = SLOT_CELL_CLASS[slot.busyness]
            const label = `${slot.startTime} – ${slot.endTime}`
            return (
              <button
                key={slot.id}
                type="button"
                disabled={!canSelect}
                class={`border-2 rounded-xl p-4 text-center transition-all ${cellClass} ${canSelect ? '' : 'pointer-events-none'}`}
                x-on:click={canSelect ? `$store.wizard.selectSlot('${slot.id}', '${label}')` : ''}
                x-bind:class={`$store.wizard.selectedSlotId === '${slot.id}' ? 'ring-2 ring-blue-500 ring-offset-2' : ''`}
              >
                <div class="font-semibold text-base">{slot.startTime}</div>
                <div class="text-xs mt-0.5 opacity-70">to {slot.endTime}</div>
                <div class="mt-2 text-xs font-medium">{SLOT_LABEL[slot.busyness]}</div>
                <div class="text-xs opacity-60">{slot.confirmed}/{slot.capacity} booked</div>
              </button>
            )
          })}
        </div>
      )}
      <div class="flex items-center gap-4 mt-5 text-xs text-slate-500">
        <span class="flex items-center gap-1.5"><span class="inline-block w-3 h-3 rounded bg-green-200 border border-green-400"></span>Available</span>
        <span class="flex items-center gap-1.5"><span class="inline-block w-3 h-3 rounded bg-amber-200 border border-amber-400"></span>Busy</span>
        <span class="flex items-center gap-1.5"><span class="inline-block w-3 h-3 rounded bg-red-200 border border-red-400 opacity-60"></span>Full</span>
        <span class="flex items-center gap-1.5"><span class="inline-block w-3 h-3 rounded bg-slate-200 border border-slate-300"></span>Closed</span>
      </div>
    </div>
  )
}
