import { Icon, ICONS } from '../../lib/Icon'

export const ArrivedScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8 text-center"
    x-show="$store.kiosk.currentScreen === 'arrived'"
  >
    <div class="w-28 h-28 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon name={ICONS.check} size={64} class="text-green-400" />
    </div>

    <h2 class="text-4xl font-extrabold text-white mb-3">Welcome!</h2>
    <p class="text-xl text-green-300 mb-2" x-text="$store.kiosk.lookupResult?.name || 'Visitor'"></p>
    <p class="text-slate-400 mb-8">Your arrival has been recorded. Reception has been notified.</p>

    <div class="bg-slate-800 border border-slate-700 rounded-2xl px-8 py-5 mb-8">
      <p class="text-xs text-slate-400 uppercase tracking-widest mb-1">Booking Reference</p>
      <p class="font-mono font-bold text-2xl text-white" x-text="$store.kiosk.lookupResult?.ref"></p>
    </div>

    <p class="text-slate-500 text-sm">This screen will reset automatically in a few seconds.</p>
  </div>
)
