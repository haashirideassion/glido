import { Icon, ICONS } from '../../lib/Icon'

export const IDScanScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8 relative"
    x-show="$store.kiosk.currentScreen === 'idscan'"
  >
    <button
      type="button"
      x-on:click="$store.kiosk.goTo('lookup')"
      class="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
    >
      <Icon name={ICONS.arrowLeft} size={18} />
      Back
    </button>

    <div class="w-full max-w-md text-center">
      <div class="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Icon name={ICONS.shield} size={36} class="text-blue-400" />
      </div>
      <h2 class="text-3xl font-bold text-white mb-2">Identity Verification</h2>
      <p class="text-slate-400 mb-8">Scan your driver's licence to verify your identity</p>

      {/* Scanning options */}
      <div x-show="!$store.kiosk.licenceData" class="space-y-4">
        {/* Thales card reader */}
        <div class="bg-slate-800 border-2 border-slate-700 rounded-2xl p-5 text-center">
          <p class="text-xs text-slate-400 uppercase tracking-widest mb-3 font-semibold">Option 1 — Card Reader</p>
          <div class="w-full h-28 bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center mb-3">
            <Icon name={ICONS.shield} size={36} class="text-slate-500 mb-1" />
            <p class="text-slate-500 text-sm">Insert driver's licence face down</p>
          </div>
          <p class="text-xs text-slate-500">Thales double-sided card reader</p>
        </div>

        <div class="text-slate-600 text-sm font-medium">— or —</div>

        {/* NSW Digital Licence QR */}
        <div class="bg-slate-800 border-2 border-slate-700 rounded-2xl p-5 text-center">
          <p class="text-xs text-slate-400 uppercase tracking-widest mb-3 font-semibold">Option 2 — Digital Licence</p>
          <div class="w-full h-28 bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center mb-3">
            <Icon name={ICONS.qrCode} size={36} class="text-slate-500 mb-1" />
            <p class="text-slate-500 text-sm">Show NSW Digital Licence QR code</p>
          </div>
          <p class="text-xs text-slate-500">NSW Service App or Digital Wallet</p>
        </div>

        {/* Demo simulate button */}
        <button
          type="button"
          x-on:click="$store.kiosk.simulateScan()"
          class="kiosk-btn w-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-medium rounded-2xl hover:bg-blue-600/30 transition-all"
        >
          Simulate ID Scan (Demo)
        </button>
      </div>

      {/* Scanned licence data — shown after scan */}
      <div x-show="$store.kiosk.licenceData" class="text-left">
        <div class="bg-green-900/30 border border-green-500/30 rounded-2xl p-4 mb-5">
          <div class="flex items-center gap-2 mb-3">
            <Icon name={ICONS.check} size={20} class="text-green-400" />
            <p class="text-green-400 font-semibold">Identity Verified</p>
          </div>
          <div class="space-y-2 text-sm">
            {[
              { label: 'Name',        key: 'name' },
              { label: 'Licence No.', key: 'licenceNo' },
              { label: 'Date of Birth', key: 'dob' },
              { label: 'Expiry',      key: 'expiry' },
              { label: 'Address',     key: 'address' },
            ].map((row) => (
              <div key={row.label} class="flex justify-between gap-4">
                <span class="text-slate-400 shrink-0">{row.label}</span>
                <span class="font-medium text-white text-right" x-text={`$store.kiosk.licenceData?.${row.key} || '—'`}></span>
              </div>
            ))}
          </div>
        </div>

        <div class="bg-amber-900/20 border border-amber-500/30 rounded-xl p-3 mb-5 text-sm">
          <p class="text-amber-400 font-semibold mb-1">Name match: Confirmed</p>
          <p class="text-amber-300/70 text-xs">Licence name matches booking — Ahmed Raza</p>
        </div>

        <button
          type="button"
          x-on:click="$store.kiosk.goTo('confirm')"
          class="kiosk-btn w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <Icon name={ICONS.arrowRight} size={24} />
          Proceed to Check-In
        </button>
      </div>
    </div>
  </div>
)
