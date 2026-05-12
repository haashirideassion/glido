import { Icon, ICONS } from '../../lib/Icon'

export const PurposeScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8 relative"
    x-show="$store.kiosk.currentScreen === 'purpose'"
  >
    <button
      type="button"
      x-on:click="$store.kiosk.goTo('welcome')"
      class="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
    >
      <Icon name={ICONS.arrowLeft} size={18} />
      Back
    </button>

    <div class="w-full max-w-lg text-center">
      <div class="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Icon name={ICONS.users} size={36} class="text-blue-400" />
      </div>
      <h2 class="text-3xl font-bold text-white mb-2">What brings you here today?</h2>
      <p class="text-slate-400 mb-10">Select the option that best describes your visit</p>

      <div class="grid grid-cols-1 gap-4 w-full">
        {/* Pick Up cargo */}
        <button
          type="button"
          x-on:click="$store.kiosk.walkInPurpose = 'walk_in_pickup'; $store.kiosk.goTo('walkin')"
          class="kiosk-btn w-full bg-slate-800 border-2 border-slate-700 hover:border-blue-500 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-2xl flex items-center gap-4 transition-all px-7"
        >
          <div class="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon name={ICONS.arrowDown} size={26} class="text-blue-400" />
          </div>
          <div class="text-left">
            <p class="text-white font-bold text-lg">Pick Up cargo</p>
            <p class="text-slate-400 text-sm font-normal">Collect my shipment from the depot</p>
          </div>
        </button>

        {/* Drop Off cargo */}
        <button
          type="button"
          x-on:click="$store.kiosk.walkInPurpose = 'walk_in_dropoff'; $store.kiosk.goTo('walkin')"
          class="kiosk-btn w-full bg-slate-800 border-2 border-slate-700 hover:border-blue-500 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-2xl flex items-center gap-4 transition-all px-7"
        >
          <div class="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
            <Icon name={ICONS.arrowUp} size={26} class="text-indigo-400" />
          </div>
          <div class="text-left">
            <p class="text-white font-bold text-lg">Drop Off cargo</p>
            <p class="text-slate-400 text-sm font-normal">Deliver goods to the depot</p>
          </div>
        </button>

        {/* Visiting someone */}
        <button
          type="button"
          x-on:click="$store.kiosk.walkInPurpose = 'visit_person'; $store.kiosk.goTo('walkin')"
          class="kiosk-btn w-full bg-slate-800 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-2xl flex items-center gap-4 transition-all px-7"
        >
          <div class="w-12 h-12 bg-slate-600/30 rounded-xl flex items-center justify-center shrink-0">
            <Icon name={ICONS.user} size={26} class="text-slate-400" />
          </div>
          <div class="text-left">
            <p class="text-white font-bold text-lg">Visiting someone here</p>
            <p class="text-slate-400 text-sm font-normal">Meeting a staff member or contractor</p>
          </div>
        </button>
      </div>
    </div>
  </div>
)
