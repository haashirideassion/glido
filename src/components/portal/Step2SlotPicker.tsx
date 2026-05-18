export const Step2SlotPicker = () => (
  <div x-show="$store.wizard.currentStep === 2" x-cloak>
    <div style="margin-bottom:28px;">
      <h2 style="font-size:22px; font-weight:700; color:#111827; letter-spacing:-0.03em; margin-bottom:6px;">Service type</h2>
      <p style="font-size:14px; color:#6b7280; line-height:1.6;">Are you collecting cargo from, or delivering cargo to the CFS?</p>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:28px;">

      {/* Pick Up */}
      <button type="button" x-on:click="$store.wizard.selectServiceType('pickup')"
        class="wizard-option-card" x-bind:class="$store.wizard.serviceType === 'pickup' ? 'selected' : ''">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1.5px solid #e5e7eb; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'pickup' ? 'background:#FC6514; border-color:#FC6514;' : 'background:#f9fafb;'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"
            x-bind:style="$store.wizard.serviceType === 'pickup' ? 'stroke:#fff;' : 'stroke:#9ca3af;'">
            <path d="M12 4v12M6 12l6 6 6-6"/>
            <line x1="4" y1="20" x2="20" y2="20"/>
          </svg>
        </div>
        <div style="flex:1; min-width:0; text-align:left;">
          <p style="font-size:15px; font-weight:600; color:#111827; margin-bottom:3px;">Pick Up</p>
          <p style="font-size:13px; color:#6b7280; line-height:1.4;">Collect cargo from the CFS · ICS checked automatically</p>
        </div>
        <div style="width:20px; height:20px; border-radius:9999px; border:1.5px solid #e5e7eb; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'pickup' ? 'background:#FC6514; border-color:#FC6514;' : ''">
          <div x-show="$store.wizard.serviceType === 'pickup'" style="width:7px; height:7px; border-radius:9999px; background:#fff;"></div>
        </div>
      </button>

      {/* Drop Off */}
      <button type="button" x-on:click="$store.wizard.selectServiceType('dropoff')"
        class="wizard-option-card" x-bind:class="$store.wizard.serviceType === 'dropoff' ? 'selected' : ''">
        <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1.5px solid #e5e7eb; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'background:#FC6514; border-color:#FC6514;' : 'background:#f9fafb;'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"
            x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'stroke:#fff;' : 'stroke:#9ca3af;'">
            <path d="M12 20V8M6 12l6-6 6 6"/>
            <line x1="4" y1="4" x2="20" y2="4"/>
          </svg>
        </div>
        <div style="flex:1; min-width:0; text-align:left;">
          <p style="font-size:15px; font-weight:600; color:#111827; margin-bottom:3px;">Drop Off</p>
          <p style="font-size:13px; color:#6b7280; line-height:1.4;">Deliver cargo to the CFS · Container or HBL required</p>
        </div>
        <div style="width:20px; height:20px; border-radius:9999px; border:1.5px solid #e5e7eb; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'background:#FC6514; border-color:#FC6514;' : ''">
          <div x-show="$store.wizard.serviceType === 'dropoff'" style="width:7px; height:7px; border-radius:9999px; background:#fff;"></div>
        </div>
      </button>
    </div>

    <p style="font-size:13px; color:#9ca3af; text-align:center;">
      Not sure?{' '}
      <a href="#" style="color:#6b7280; text-decoration:underline; text-underline-offset:3px;">View depot services guide</a>
    </p>
  </div>
)
