import { Icon, ICONS } from '../../lib/Icon'

export const ConfirmScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8 relative"
    x-show="$store.kiosk.currentScreen === 'confirm'"
  >
    <button
      type="button"
      x-on:click="$store.kiosk.goTo('lookup')"
      class="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
    >
      <Icon name={ICONS.arrowLeft} size={18} />
      Back
    </button>

    <div class="text-center max-w-md w-full" x-show="$store.kiosk.lookupResult">
      <h2 class="text-3xl font-bold text-white mb-1">Booking Found</h2>
      <p class="text-slate-400 mb-8">Please confirm this is your booking</p>

      <div class="bg-slate-800 border border-slate-700 rounded-3xl p-6 mb-6 text-left space-y-3">
        {[
          { label: 'Reference', key: 'ref',     mono: true },
          { label: 'Name',      key: 'name',    mono: false },
          { label: 'Slot',      key: 'slot',    mono: false },
          { label: 'Service',   key: 'service', mono: false },
        ].map((row) => (
          <div key={row.label} class="flex justify-between text-sm">
            <span class="text-slate-400">{row.label}</span>
            <span
              class={`font-semibold ${row.mono ? 'font-mono text-blue-300' : 'text-white'}`}
              x-text={`$store.kiosk.lookupResult?.${row.key}`}
            ></span>
          </div>
        ))}
      </div>

      <button
        type="button"
        x-on:click="$store.kiosk.completeCheckIn()"
        class="kiosk-btn w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-2xl transition-all shadow-lg mb-3 flex items-center justify-center gap-3"
      >
        <Icon name={ICONS.check} size={26} />
        Confirm Arrival
      </button>
      <button
        type="button"
        x-on:click="$store.kiosk.goTo('lookup')"
        class="kiosk-btn w-full bg-transparent border border-slate-600 text-slate-300 font-medium rounded-2xl hover:bg-slate-800 transition-all"
      >
        This is not my booking
      </button>
    </div>
  </div>
)
