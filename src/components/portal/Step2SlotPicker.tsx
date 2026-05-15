import { Icon, ICONS } from '../../lib/Icon'

export const Step2SlotPicker = () => (
  <div x-show="$store.wizard.currentStep === 2" x-cloak>

    <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:4px;">
      What are you here for?
    </h2>
    <p style="font-size:13px; color:#A8A29E; margin-bottom:24px; line-height:1.5;">
      This applies to all slots in this session.
    </p>

    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">

      {/* Pick Up */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('pickup')"
        style="display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:16px; cursor:pointer; text-align:left; width:100%; transition:all 0.18s ease; background:#FFFFFF; border:1.5px solid rgba(0,0,0,0.08); box-shadow:0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03);"
        x-bind:style="$store.wizard.serviceType === 'pickup'
          ? 'background:#FFFFFF; border-color:rgba(249,115,22,0.45); box-shadow:0 0 0 3px rgba(249,115,22,0.08), 0 2px 8px rgba(249,115,22,0.08);'
          : ''"
        onmouseover="if(!this.style.borderColor.includes('249')){this.style.borderColor='rgba(0,0,0,0.16)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';}"
        onmouseout="if(!this.style.borderColor.includes('249')){this.style.borderColor='rgba(0,0,0,0.08)'; this.style.boxShadow='0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)';}"
      >
        {/* Icon */}
        <div
          style="width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.18s ease; background:#F5F2EC; box-shadow:2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9);"
          x-bind:style="$store.wizard.serviceType === 'pickup'
            ? 'background:linear-gradient(135deg,#F97316,#FB923C); box-shadow:rgba(249,115,22,0.3) 0px 4px 12px 0px;'
            : ''"
        >
          <Icon
            name={ICONS.arrowDown}
            size={17}
            x-bind:style="$store.wizard.serviceType === 'pickup' ? 'color:white;' : 'color:#A8A29E;'"
          />
        </div>

        {/* Text */}
        <div style="flex:1; min-width:0; text-align:left;">
          <p
            style="font-size:14px; font-weight:600; letter-spacing:-0.01em; margin-bottom:2px; color:#1C1917; transition:color 0.15s ease;"
            x-bind:style="$store.wizard.serviceType === 'pickup' ? 'color:#F97316;' : ''"
          >
            Pick Up
          </p>
          <p style="font-size:12px; color:#A8A29E;">Collect cargo from the CFS · ICS checked automatically</p>
        </div>

        {/* Radio */}
        <div
          style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.18s ease; border:1.5px solid rgba(0,0,0,0.15); background:#F5F2EC; box-shadow:inset 1px 1px 3px rgba(0,0,0,0.07);"
          x-bind:style="$store.wizard.serviceType === 'pickup'
            ? 'background:#F97316; border-color:#F97316; box-shadow:rgba(249,115,22,0.25) 0px 2px 6px 0px;'
            : ''"
        >
          <span
            x-show="$store.wizard.serviceType === 'pickup'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>

      {/* Drop Off */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('dropoff')"
        style="display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:16px; cursor:pointer; text-align:left; width:100%; transition:all 0.18s ease; background:#FFFFFF; border:1.5px solid rgba(0,0,0,0.08); box-shadow:0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03);"
        x-bind:style="$store.wizard.serviceType === 'dropoff'
          ? 'background:#FFFFFF; border-color:rgba(249,115,22,0.45); box-shadow:0 0 0 3px rgba(249,115,22,0.08), 0 2px 8px rgba(249,115,22,0.08);'
          : ''"
        onmouseover="if(!this.style.borderColor.includes('249')){this.style.borderColor='rgba(0,0,0,0.16)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';}"
        onmouseout="if(!this.style.borderColor.includes('249')){this.style.borderColor='rgba(0,0,0,0.08)'; this.style.boxShadow='0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)';}"
      >
        <div
          style="width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.18s ease; background:#F5F2EC; box-shadow:2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9);"
          x-bind:style="$store.wizard.serviceType === 'dropoff'
            ? 'background:linear-gradient(135deg,#F97316,#FB923C); box-shadow:rgba(249,115,22,0.3) 0px 4px 12px 0px;'
            : ''"
        >
          <Icon
            name={ICONS.arrowUp}
            size={17}
            x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'color:white;' : 'color:#A8A29E;'"
          />
        </div>

        <div style="flex:1; min-width:0; text-align:left;">
          <p
            style="font-size:14px; font-weight:600; letter-spacing:-0.01em; margin-bottom:2px; color:#1C1917; transition:color 0.15s ease;"
            x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'color:#F97316;' : ''"
          >
            Drop Off
          </p>
          <p style="font-size:12px; color:#A8A29E;">Deliver cargo to the CFS · Container or HBL required</p>
        </div>

        <div
          style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.18s ease; border:1.5px solid rgba(0,0,0,0.15); background:#F5F2EC; box-shadow:inset 1px 1px 3px rgba(0,0,0,0.07);"
          x-bind:style="$store.wizard.serviceType === 'dropoff'
            ? 'background:#F97316; border-color:#F97316; box-shadow:rgba(249,115,22,0.25) 0px 2px 6px 0px;'
            : ''"
        >
          <span
            x-show="$store.wizard.serviceType === 'dropoff'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>
    </div>

    <p style="font-size:12px; color:#C2BEBB; text-align:center;">
      Not sure?{' '}
      <a href="#" style="color:#78716C; text-decoration:underline; text-underline-offset:2px; text-decoration-color:rgba(0,0,0,0.2);">
        View depot services guide →
      </a>
    </p>
  </div>
)
