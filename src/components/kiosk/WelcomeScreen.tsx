import { Icon, ICONS } from '../../lib/Icon'

export const WelcomeScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8"
    x-show="$store.kiosk.currentScreen === 'welcome'"
  >
    {/* Logo + name */}
    <div class="mb-10 text-center">
      <div class="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl">
        <Icon name={ICONS.logo} size={56} class="text-white" />
      </div>
      <h1 class="text-5xl font-extrabold text-white mb-2">Sydney CFS</h1>
      <p class="text-xl text-slate-400">Container Freight Station</p>
      {/* Live clock */}
      <p
        class="text-2xl font-mono font-semibold text-slate-300 mt-3"
        x-data="{ time: '' }"
        x-init="setInterval(() => time = new Date().toLocaleTimeString('en-AU'), 1000)"
        x-text="time"
      ></p>
    </div>

    {/* Main action buttons */}
    <div class="flex flex-col gap-4 w-full max-w-md">
      <button
        type="button"
        x-on:click="$store.kiosk.startBookingLookup()"
        class="kiosk-btn w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl"
      >
        <Icon name={ICONS.qrCode} size={28} />
        I have a booking — Pick Up or Drop Off
      </button>

      <button
        type="button"
        x-on:click="$store.kiosk.startVisitingFlow()"
        class="kiosk-btn w-full bg-transparent border-2 border-slate-600 hover:border-slate-400 hover:bg-slate-800/50 active:scale-95 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all"
      >
        <Icon name={ICONS.walkIn} size={28} />
        I'm visiting someone / other purpose
      </button>
    </div>

    {/* Hours */}
    <div class="mt-10 bg-slate-800/60 border border-slate-700 rounded-2xl px-6 py-3 text-center">
      <p class="text-slate-400 text-sm">CFS hours today: <span class="text-white font-semibold">06:00 – 18:00</span></p>
    </div>

    <p class="mt-6 text-slate-600 text-sm">Need help? Speak to our reception team.</p>
  </div>
)
