export const Step1ServiceType = () => (
  <div x-show="$store.wizard.currentStep === 1" x-cloak>
    <h2 class="text-xl font-bold mb-1" style="color:#44403C;">How many shipments are you booking today?</h2>
    <p class="text-sm mb-7" style="color:#A8A29E;">Each shipment (House Bill Number) requires its own slot.</p>

    {/* Slot counter */}
    <div class="mb-8">
      <div class="flex items-center gap-5 mb-5">
        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount > 1) $store.wizard.slotCount--"
          {...{"x-bind:disabled": "$store.wizard.slotCount <= 1"}}
          class="w-14 h-14 rounded-2xl font-bold text-2xl flex items-center justify-center transition-all select-none disabled:opacity-30 disabled:cursor-not-allowed"
          style="border:2px solid #D6D3D1; color:#78716C; background:#F5F3EC;"
        >
          −
        </button>
        <span class="w-20 text-center text-4xl font-bold tabular-nums" style="color:#44403C;" x-text="$store.wizard.slotCount">1</span>
        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount < 10) $store.wizard.slotCount++"
          {...{"x-bind:disabled": "$store.wizard.slotCount >= 10"}}
          class="w-14 h-14 rounded-2xl font-bold text-2xl flex items-center justify-center transition-all select-none disabled:opacity-30 disabled:cursor-not-allowed"
          style="border:2px solid #D6D3D1; color:#78716C; background:#F5F3EC;"
        >
          +
        </button>
        <span class="text-sm" style="color:#A8A29E;">slot(s) · max 10 per session</span>
      </div>

      {/* Quick-select chips */}
      <div class="flex gap-2 flex-wrap">
        {[1, 2, 3, 5, 10].map((n) => (
          <button
            key={n}
            type="button"
            x-on:click={`$store.wizard.slotCount = ${n}`}
            class="border rounded-xl px-4 py-2 text-sm font-semibold transition-all"
            {...{"x-bind:style": `$store.wizard.slotCount === ${n} ? 'background:#F59E0B; color:#fff; border-color:#F59E0B;' : 'background:#F5F3EC; color:#78716C; border-color:#D6D3D1;'`}}
          >
            {n}
          </button>
        ))}
      </div>
    </div>

    {/* Guest name */}
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-1.5" style="color:#57534E;">
          Your name (for records) <span style="color:#EF4444;">*</span>
        </label>
        <input
          type="text"
          x-model="$store.wizard.guestName"
          placeholder="e.g. Sarah Nguyen"
          class="w-full rounded-xl px-4 py-3 text-sm transition"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C; outline:none;"
        />
        <p class="text-xs mt-1" style="color:#A8A29E;">Required — min. 2 characters</p>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1.5" style="color:#57534E;">
          Phone number <span style="color:#A8A29E; font-weight:normal;">(optional)</span>
        </label>
        <input
          type="tel"
          x-model="$store.wizard.guestPhone"
          placeholder="+61 4XX XXX XXX"
          class="w-full rounded-xl px-4 py-3 text-sm transition"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C; outline:none;"
        />
      </div>
    </div>

    <div
      class="mt-5 rounded-xl px-4 py-3 text-xs"
      style="background:#FFFBEB; border:1px solid #FDE68A; color:#92400E;"
      x-show="$store.wizard.slotCount > 1"
    >
      You've selected <span class="font-bold" x-text="$store.wizard.slotCount"></span> slots.
      Each slot = one time window at the depot. You'll go through shipment details for each slot separately.
    </div>
  </div>
)
