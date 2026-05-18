export const Step1ServiceType = () => (
  <div x-show="$store.wizard.currentStep === 1" x-cloak>

    {/* ── Slot counter ───────────────────────────────────────────────────── */}
    <div style="margin-bottom:32px;">
      <div style="display:flex; align-items:center; gap:0; margin-bottom:16px;">
        {/* Minus */}
        <button
          type="button"
          class="wizard-stepper-btn"
          x-on:click="if ($store.wizard.slotCount > 1) { $store.wizard.slotCount--; document.getElementById('slot-count-display').animate([{transform:'scale(1)'},{transform:'scale(0.85)'},{transform:'scale(1.08)'},{transform:'scale(1)'}], {duration:200, easing:'ease-out'}); }"
          x-bind:disabled="$store.wizard.slotCount <= 1"
        >−</button>

        {/* Value */}
        <div style="min-width:80px; text-align:center; padding:0 8px;">
          <span
            id="slot-count-display"
            style="font-size:36px; font-weight:800; color:#1C1917; font-variant-numeric:tabular-nums; letter-spacing:-0.04em; line-height:1; display:block;"
            x-text="$store.wizard.slotCount"
          >1</span>
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E;">slots</span>
        </div>

        {/* Plus */}
        <button
          type="button"
          class="wizard-stepper-btn"
          x-on:click="if ($store.wizard.slotCount < 10) { $store.wizard.slotCount++; document.getElementById('slot-count-display').animate([{transform:'scale(1)'},{transform:'scale(1.18)'},{transform:'scale(0.95)'},{transform:'scale(1)'}], {duration:200, easing:'ease-out'}); }"
          x-bind:disabled="$store.wizard.slotCount >= 10"
        >+</button>
      </div>

      {/* Quick-select chips */}
      <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
        {[1, 2, 3, 5, 10].map((n) => (
          <button
            key={n}
            type="button"
            class="wizard-chip"
            x-on:click={`$store.wizard.slotCount = ${n}`}
            x-bind:class={`$store.wizard.slotCount === ${n} ? 'active' : ''`}
          >
            {n}
          </button>
        ))}
        <span style="font-size:11px; color:#A8A29E; margin-left:4px;">max 10</span>
      </div>
    </div>

    {/* ── Guest info ──────────────────────────────────────────────────────── */}
    <div style="display:flex; flex-direction:column; gap:28px;">

      <div>
        <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:10px;">
          Your Name <span style="color:#FC6514;">*</span>
        </label>
        <input
          type="text"
          class="wizard-field"
          x-model="$store.wizard.guestName"
          placeholder="e.g. Sarah Nguyen"
        />
        <p style="font-size:11px; color:#A8A29E; margin-top:5px;">Required — min. 2 characters</p>
      </div>

      <div>
        <label style="display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:10px;">
          Phone Number
          <span style="font-weight:400; text-transform:none; letter-spacing:0; margin-left:6px; color:#A8A29E; font-size:10px;">(optional)</span>
        </label>
        <input
          type="tel"
          class="wizard-field"
          x-model="$store.wizard.guestPhone"
          placeholder="+61 4XX XXX XXX"
        />
      </div>
    </div>

    {/* Multi-slot note */}
    <div
      x-show="$store.wizard.slotCount > 1"
      style="margin-top:24px; border-left:3px solid rgba(252,101,20,0.35); padding:10px 14px; font-size:12px; line-height:1.6; background:rgba(252,101,20,0.05); color:#78716C; border-radius:0 4px 4px 0;"
    >
      <span style="font-weight:700; color:#FC6514;" x-text="$store.wizard.slotCount"></span> slots — you'll enter shipment details for each one separately.
    </div>

  </div>
)
