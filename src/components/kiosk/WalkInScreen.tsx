export const WalkInScreen = () => (
  <div
    class="h-full flex flex-col items-center justify-center px-8 overflow-y-auto py-10"
    x-show="$store.kiosk.currentScreen === 'walkin'"
  >
    <button
      type="button"
      x-on:click="$store.kiosk.goTo('welcome')"
      class="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <div class="w-full max-w-sm">
      <h2 class="text-3xl font-bold text-white mb-1 text-center">Walk-In Registration</h2>
      <p class="text-slate-400 mb-6 text-center text-sm">Please provide your details</p>

      <div class="space-y-4" x-data="{ submitted: false, ref: '' }">
        <template x-if="!submitted">
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-slate-400 mb-1.5">Your Name</label>
              <input
                type="text"
                placeholder="Full name"
                class="w-full bg-slate-800 border-2 border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm text-slate-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                placeholder="03XX-XXXXXXX"
                class="w-full bg-slate-800 border-2 border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm text-slate-400 mb-1.5">Vehicle Registration</label>
              <input
                type="text"
                placeholder="LEA-1234"
                class="w-full bg-slate-800 border-2 border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-base uppercase focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm text-slate-400 mb-1.5">B/L or Reference</label>
              <input
                type="text"
                placeholder="e.g. COSCO2026041201"
                class="w-full bg-slate-800 border-2 border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              x-on:click={`
                const rand = String(Math.floor(Math.random() * 90000) + 10000);
                ref = 'GLD-2026-' + rand;
                submitted = true;
                setTimeout(() => { $store.kiosk.goTo('welcome'); submitted = false; }, 8000);
              `}
              class="kiosk-btn w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl transition-all mt-2"
            >
              Submit & Notify Reception
            </button>
          </div>
        </template>

        <template x-if="submitted">
          <div class="text-center py-4">
            <div class="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-9 h-9 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-xl font-bold text-white mb-1">Registered!</p>
            <p class="text-slate-400 text-sm mb-4">Reception has been notified. Please wait.</p>
            <div class="bg-slate-800 rounded-xl px-5 py-3 inline-block">
              <p class="text-xs text-slate-400 mb-0.5">Your Reference</p>
              <p class="font-mono font-bold text-lg text-white" x-text="ref"></p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
)
