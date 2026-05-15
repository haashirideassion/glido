import { Input } from '../ui/input'
import { Icon, ICONS } from '../../lib/Icon'

export const LookupScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8 relative"
    x-show="$store.kiosk.currentScreen === 'lookup'"
  >
    <button
      type="button"
      x-on:click="$store.kiosk.goTo('welcome')"
      class="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
    >
      <Icon name={ICONS.arrowLeft} size={18} />
      Back
    </button>

    <div class="w-full max-w-md text-center">
      <div class="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Icon name={ICONS.search} size={36} class="text-blue-400" />
      </div>
      <h2 class="text-3xl font-bold text-white mb-2">Find Your Booking</h2>
      <p class="text-slate-400 mb-8">Enter your booking reference number</p>

      <Input
        type="text"
        placeholder="GLD-2026-XXXXX"
        class="kiosk-input w-full bg-slate-800 border-2 border-slate-600 text-white placeholder-slate-500 rounded-2xl px-6 py-4 mb-3 uppercase tracking-widest"
        x-model="$store.kiosk.referenceInput"
        x-bind:class="$store.kiosk.lookupError ? 'border-red-500' : ''"
        {...{"x-on:keydown.enter": "$store.kiosk.performLookup()"}}
        x-on:input="$store.kiosk.referenceInput = $event.target.value.toUpperCase(); $store.kiosk.lookupError = false"
      />

      <p class="text-red-400 text-sm mb-4" x-show="$store.kiosk.lookupError">
        Reference not found. Please check and try again.
      </p>

      <button
        type="button"
        x-on:click="$store.kiosk.performLookup()"
        x-bind:disabled="!$store.kiosk.referenceInput.trim()"
        class="kiosk-btn w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Find Booking
      </button>

      <div class="mt-6 border-t border-slate-700 pt-6">
        <p class="text-slate-500 text-sm mb-3">Or scan your QR code</p>
        <button
          type="button"
          x-on:click="$store.kiosk.goTo('scan')"
          class="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2 mx-auto transition-colors"
        >
          <Icon name={ICONS.qrCode} size={18} />
          Use QR Scanner
        </button>
      </div>
    </div>
  </div>
)
