export const Step1ServiceType = () => (
  <div x-show="$store.wizard.currentStep === 1" x-cloak>
    <h2 class="text-xl font-bold text-slate-900 mb-1">How many shipments are you booking today?</h2>
    <p class="text-slate-500 text-sm mb-7">Each shipment (House Bill Number) requires its own slot.</p>

    {/* Slot counter */}
    <div class="mb-8">
      <div class="flex items-center gap-5 mb-5">
        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount > 1) $store.wizard.slotCount--"
          {...{"x-bind:disabled": "$store.wizard.slotCount <= 1"}}
          class="w-14 h-14 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-2xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all select-none"
        >
          −
        </button>
        <span class="w-20 text-center text-4xl font-bold text-slate-900 tabular-nums" x-text="$store.wizard.slotCount">1</span>
        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount < 10) $store.wizard.slotCount++"
          {...{"x-bind:disabled": "$store.wizard.slotCount >= 10"}}
          class="w-14 h-14 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-2xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all select-none"
        >
          +
        </button>
        <span class="text-sm text-slate-400">slot(s) · max 10 per session</span>
      </div>

      {/* Quick-select chips */}
      <div class="flex gap-2 flex-wrap">
        {[1, 2, 3, 5, 10].map((n) => (
          <button
            key={n}
            type="button"
            x-on:click={`$store.wizard.slotCount = ${n}`}
            {...{"x-bind:class": `$store.wizard.slotCount === ${n} ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'`}}
            class="border rounded-xl px-4 py-2 text-sm font-semibold transition-all"
          >
            {n}
          </button>
        ))}
      </div>
    </div>

    {/* Guest name */}
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Your name (for records) <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          x-model="$store.wizard.guestName"
          placeholder="e.g. Sarah Nguyen"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition"
        />
        <p class="text-xs text-slate-400 mt-1">Required — min. 2 characters</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Phone number <span class="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          x-model="$store.wizard.guestPhone"
          placeholder="+61 4XX XXX XXX"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition"
        />
      </div>
    </div>

    <div
      class="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700"
      x-show="$store.wizard.slotCount > 1"
    >
      You've selected <span class="font-bold" x-text="$store.wizard.slotCount"></span> slots.
      Each slot = one time window at the depot. You'll go through shipment details for each slot separately.
    </div>
  </div>
)
