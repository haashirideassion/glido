export const Step1ServiceType = () => (
  <div x-show="$store.wizard.currentStep === 1" x-cloak>

    {/* Step heading */}
    <div style="margin-bottom:28px;">
      <h2 style="font-size:22px; font-weight:700; color:#111827; letter-spacing:-0.03em; line-height:1.2; margin-bottom:6px;">Get started</h2>
      <p style="font-size:14px; color:#6b7280; line-height:1.5;">Tell us who's visiting and how many slots you need today.</p>
    </div>

    {/* Slot counter */}
    <div style="border:1.5px solid #e5e7eb; border-radius:14px; padding:20px 24px; margin-bottom:28px; background:#fff;">
      <label style="font-size:12px; font-weight:600; color:#374151; margin-bottom:14px; display:block; letter-spacing:-0.01em;">Number of slots</label>
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
            style="font-size:36px; font-weight:800; color:#111827; font-variant-numeric:tabular-nums; letter-spacing:-0.04em; line-height:1; display:block;"
            x-text="$store.wizard.slotCount"
          >1</span>
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:#9ca3af;">slots</span>
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
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
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
        <span style="font-size:11px; color:#9ca3af; margin-left:4px;">max 10</span>
      </div>
    </div>

    {/* Guest info */}
    <div style="display:flex; flex-direction:column; gap:20px;">

      <div>
        <label style="font-size:12px; font-weight:600; color:#374151; margin-bottom:8px; display:block;">
          Your Name <span style="color:#FC6514;">*</span>
        </label>
        <input
          type="text"
          class="wizard-field"
          x-model="$store.wizard.guestName"
          placeholder="e.g. Sarah Nguyen"
        />
        <p style="font-size:11px; color:#9ca3af; margin-top:5px;">Required — min. 2 characters</p>
      </div>

      <div>
        <label style="font-size:12px; font-weight:600; color:#374151; margin-bottom:8px; display:block;">
          Phone Number
          <span style="font-weight:400; margin-left:6px; color:#9ca3af; font-size:11px;">(optional)</span>
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
      style="margin-top:24px; padding:12px 16px; font-size:13px; line-height:1.6; background:#fff7ed; border:1px solid #fed7aa; color:#9a3412; border-radius:10px;"
    >
      <span style="font-weight:700;" x-text="$store.wizard.slotCount"></span> slots — you'll enter shipment details for each one separately.
    </div>

  </div>
)
