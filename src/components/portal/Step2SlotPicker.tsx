export const Step2SlotPicker = () => (
  <div x-show="$store.wizard.currentStep === 2" x-cloak>

    <h2 style="font-size:18px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:3px;">
      What are you here for?
    </h2>
    <p style="font-size:13px; color:#64748B; margin-bottom:28px; line-height:1.5;">
      This applies to all slots in this session.
    </p>

    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:28px;">

      {/* Pick Up */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('pickup')"
        class="wizard-option-card"
        x-bind:class="$store.wizard.serviceType === 'pickup' ? 'selected' : ''"
      >
        {/* Icon box */}
        <div
          style="width:44px; height:44px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.09); transition:all 0.12s ease;"
          x-bind:style="$store.wizard.serviceType === 'pickup' ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-color:transparent; box-shadow:0 4px 12px rgba(252,101,20,0.35);' : ''"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            x-bind:style="$store.wizard.serviceType === 'pickup' ? 'stroke:white;' : 'stroke:rgba(0,0,0,0.30);'">
            <path d="M12 4v12M6 12l6 6 6-6"/>
            <line x1="4" y1="20" x2="20" y2="20"/>
          </svg>
        </div>

        {/* Text */}
        <div style="flex:1; min-width:0; text-align:left;">
          <p style="font-size:14px; font-weight:700; letter-spacing:-0.02em; margin-bottom:2px; color:#1C1917;">Pick Up</p>
          <p style="font-size:12px; color:#64748B; line-height:1.4;">Collect cargo from the CFS · ICS checked automatically</p>
        </div>

        {/* Selector */}
        <div
          style="width:20px; height:20px; border-radius:3px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1.5px solid rgba(0,0,0,0.12); background:transparent; transition:all 0.12s ease;"
          x-bind:style="$store.wizard.serviceType === 'pickup' ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-color:transparent;' : ''"
        >
          <span x-show="$store.wizard.serviceType === 'pickup'" style="color:white; font-size:11px; font-weight:700; line-height:1;">✓</span>
        </div>
      </button>

      {/* Drop Off */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('dropoff')"
        class="wizard-option-card"
        x-bind:class="$store.wizard.serviceType === 'dropoff' ? 'selected' : ''"
      >
        <div
          style="width:44px; height:44px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.09); transition:all 0.12s ease;"
          x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-color:transparent; box-shadow:0 4px 12px rgba(252,101,20,0.35);' : ''"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'stroke:white;' : 'stroke:rgba(0,0,0,0.30);'">
            <path d="M12 20V8M6 12l6-6 6 6"/>
            <line x1="4" y1="4" x2="20" y2="4"/>
          </svg>
        </div>

        <div style="flex:1; min-width:0; text-align:left;">
          <p style="font-size:14px; font-weight:700; letter-spacing:-0.02em; margin-bottom:2px; color:#1C1917;">Drop Off</p>
          <p style="font-size:12px; color:#64748B; line-height:1.4;">Deliver cargo to the CFS · Container or HBL required</p>
        </div>

        <div
          style="width:20px; height:20px; border-radius:3px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1.5px solid rgba(0,0,0,0.12); background:transparent; transition:all 0.12s ease;"
          x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-color:transparent;' : ''"
        >
          <span x-show="$store.wizard.serviceType === 'dropoff'" style="color:white; font-size:11px; font-weight:700; line-height:1;">✓</span>
        </div>
      </button>
    </div>

    <p style="font-size:12px; color:#A8A29E; text-align:center;">
      Not sure?{' '}
      <a href="#" style="color:#64748B; text-decoration:underline; text-underline-offset:3px; text-decoration-color:rgba(0,0,0,0.15);">
        View depot services guide →
      </a>
    </p>
  </div>
)
