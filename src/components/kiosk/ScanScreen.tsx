import { Icon, ICONS } from '../../lib/Icon'

export const ScanScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8 relative"
    x-show="$store.kiosk.currentScreen === 'scan'"
  >
    <button
      type="button"
      x-on:click="$store.kiosk.goTo('lookup')"
      class="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
    >
      <Icon name={ICONS.arrowLeft} size={18} />
      Back
    </button>

    <div class="text-center max-w-sm">
      <h2 class="text-3xl font-bold text-white mb-2">Scan QR Code</h2>
      <p class="text-slate-400 mb-8">Hold your booking QR code in front of the camera</p>

      {/* Camera placeholder */}
      <div class="relative w-64 h-64 mx-auto mb-8">
        <div class="w-full h-full bg-slate-800 rounded-2xl border-2 border-slate-700 flex items-center justify-center">
          <Icon name={ICONS.camera} size={64} class="text-slate-600" />
        </div>
        {/* Corner brackets */}
        <div class="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
        <div class="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-lg"></div>
        <div class="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
        <div class="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg"></div>
      </div>

      <p class="text-slate-500 text-sm mb-5">Camera not available in demo mode</p>

      <button
        type="button"
        x-on:click="$store.kiosk.referenceInput = 'GLD-2026-00138'; $store.kiosk.performLookup()"
        class="kiosk-btn w-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-medium rounded-2xl hover:bg-blue-600/30 transition-all"
      >
        Simulate QR Scan (Demo)
      </button>
    </div>
  </div>
)
