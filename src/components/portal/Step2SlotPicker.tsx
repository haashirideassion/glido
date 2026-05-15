import { Icon, ICONS } from '../../lib/Icon'

export const Step2SlotPicker = () => (
  <div x-show="$store.wizard.currentStep === 2" x-cloak>

    <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:4px;">
      What are you here for?
    </h2>
    <p style="font-size:13px; color:#78716C; margin-bottom:20px; line-height:1.5;">
      This applies to all slots in this session.
    </p>

    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">

      {/* Pick Up row */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('pickup')"
        style="display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:14px; border:1.5px solid; cursor:pointer; text-align:left; transition:background 0.15s ease, border-color 0.15s ease; width:100%;"
        x-bind:style="$store.wizard.serviceType === 'pickup'
          ? 'background:rgba(249,115,22,0.07); border-color:#F97316;'
          : 'background:rgba(234,230,219,0.4); border-color:rgba(240,197,137,0.4);'"
      >
        {/* Icon */}
        <div
          style="width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'pickup'
            ? 'background:linear-gradient(135deg,#F97316,#FB923C); box-shadow:rgba(249,115,22,0.25) 0px 4px 10px 0px;'
            : 'background:rgba(168,162,158,0.15);'"
        >
          <Icon
            name={ICONS.arrowDown}
            size={18}
            x-bind:style="$store.wizard.serviceType === 'pickup' ? 'color:white;' : 'color:#A8A29E;'"
          />
        </div>

        {/* Text */}
        <div style="flex:1; min-width:0;">
          <p
            style="font-size:14px; font-weight:600; letter-spacing:-0.01em; margin-bottom:2px; transition:color 0.15s ease;"
            x-bind:style="$store.wizard.serviceType === 'pickup' ? 'color:#F97316;' : 'color:#1C1917;'"
          >
            Pick Up
          </p>
          <p style="font-size:12px; color:#78716C;">Collect cargo from the CFS · ICS checked automatically</p>
        </div>

        {/* Selected dot */}
        <div
          style="width:18px; height:18px; border-radius:9999px; border:1.5px solid; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:background 0.15s ease, border-color 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'pickup'
            ? 'background:#F97316; border-color:#F97316;'
            : 'background:transparent; border-color:rgba(168,162,158,0.4);'"
        >
          <span
            x-show="$store.wizard.serviceType === 'pickup'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>

      {/* Drop Off row */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('dropoff')"
        style="display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:14px; border:1.5px solid; cursor:pointer; text-align:left; transition:background 0.15s ease, border-color 0.15s ease; width:100%;"
        x-bind:style="$store.wizard.serviceType === 'dropoff'
          ? 'background:rgba(249,115,22,0.07); border-color:#F97316;'
          : 'background:rgba(234,230,219,0.4); border-color:rgba(240,197,137,0.4);'"
      >
        <div
          style="width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'dropoff'
            ? 'background:linear-gradient(135deg,#F97316,#FB923C); box-shadow:rgba(249,115,22,0.25) 0px 4px 10px 0px;'
            : 'background:rgba(168,162,158,0.15);'"
        >
          <Icon
            name={ICONS.arrowUp}
            size={18}
            x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'color:white;' : 'color:#A8A29E;'"
          />
        </div>

        <div style="flex:1; min-width:0;">
          <p
            style="font-size:14px; font-weight:600; letter-spacing:-0.01em; margin-bottom:2px; transition:color 0.15s ease;"
            x-bind:style="$store.wizard.serviceType === 'dropoff' ? 'color:#F97316;' : 'color:#1C1917;'"
          >
            Drop Off
          </p>
          <p style="font-size:12px; color:#78716C;">Deliver cargo to the CFS · Container or HBL required</p>
        </div>

        <div
          style="width:18px; height:18px; border-radius:9999px; border:1.5px solid; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:background 0.15s ease, border-color 0.15s ease;"
          x-bind:style="$store.wizard.serviceType === 'dropoff'
            ? 'background:#F97316; border-color:#F97316;'
            : 'background:transparent; border-color:rgba(168,162,158,0.4);'"
        >
          <span
            x-show="$store.wizard.serviceType === 'dropoff'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>
    </div>

    <p style="font-size:12px; color:#A8A29E; text-align:center;">
      Not sure? <a href="#" style="color:#F97316; text-decoration:none; border-bottom:1px solid rgba(249,115,22,0.3);">View depot services guide →</a>
    </p>
  </div>
)
