import { Icon, ICONS } from '../../lib/Icon'

export const Step3HoldConfirm = () => (
  <div x-show="$store.wizard.currentStep === 3" x-cloak>

    <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:4px;">
      What type of cargo?
    </h2>
    <p style="font-size:13px; color:#78716C; margin-bottom:20px; line-height:1.5;">
      This determines which details we ask for on the next screen.
    </p>

    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">

      {/* FCL row */}
      <button
        type="button"
        x-on:click="$store.wizard.selectLoadType('fcl')"
        style="display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:14px; border:1.5px solid; cursor:pointer; text-align:left; transition:background 0.15s ease, border-color 0.15s ease; width:100%;"
        x-bind:style="$store.wizard.loadType === 'fcl'
          ? 'background:rgba(249,115,22,0.07); border-color:#F97316;'
          : 'background:rgba(234,230,219,0.4); border-color:rgba(240,197,137,0.4);'"
      >
        <div
          style="width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'fcl'
            ? 'background:linear-gradient(135deg,#F97316,#FB923C); box-shadow:rgba(249,115,22,0.25) 0px 4px 10px 0px;'
            : 'background:rgba(168,162,158,0.15);'"
        >
          <Icon
            name={ICONS.container}
            size={18}
            x-bind:style="$store.wizard.loadType === 'fcl' ? 'color:white;' : 'color:#A8A29E;'"
          />
        </div>

        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
            <p
              style="font-size:14px; font-weight:600; letter-spacing:-0.01em; transition:color 0.15s ease;"
              x-bind:style="$store.wizard.loadType === 'fcl' ? 'color:#F97316;' : 'color:#1C1917;'"
            >FCL</p>
            <span style="font-size:11px; font-weight:500; color:#78716C; font-style:normal;">Full Container Load</span>
          </div>
          <p style="font-size:12px; color:#A8A29E;">Container number required · No HBL needed</p>
        </div>

        <div
          style="width:18px; height:18px; border-radius:9999px; border:1.5px solid; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:background 0.15s ease, border-color 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'fcl'
            ? 'background:#F97316; border-color:#F97316;'
            : 'background:transparent; border-color:rgba(168,162,158,0.4);'"
        >
          <span
            x-show="$store.wizard.loadType === 'fcl'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>

      {/* LCL row */}
      <button
        type="button"
        x-on:click="$store.wizard.selectLoadType('lcl')"
        style="display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:14px; border:1.5px solid; cursor:pointer; text-align:left; transition:background 0.15s ease, border-color 0.15s ease; width:100%;"
        x-bind:style="$store.wizard.loadType === 'lcl'
          ? 'background:rgba(249,115,22,0.07); border-color:#F97316;'
          : 'background:rgba(234,230,219,0.4); border-color:rgba(240,197,137,0.4);'"
      >
        <div
          style="width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'lcl'
            ? 'background:linear-gradient(135deg,#F97316,#FB923C); box-shadow:rgba(249,115,22,0.25) 0px 4px 10px 0px;'
            : 'background:rgba(168,162,158,0.15);'"
        >
          <Icon
            name={ICONS.cargo}
            size={18}
            x-bind:style="$store.wizard.loadType === 'lcl' ? 'color:white;' : 'color:#A8A29E;'"
          />
        </div>

        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
            <p
              style="font-size:14px; font-weight:600; letter-spacing:-0.01em; transition:color 0.15s ease;"
              x-bind:style="$store.wizard.loadType === 'lcl' ? 'color:#F97316;' : 'color:#1C1917;'"
            >LCL</p>
            <span style="font-size:11px; font-weight:500; color:#78716C;">Less than Container Load</span>
          </div>
          <p style="font-size:12px; color:#A8A29E;">Shared container · HBL + container number · ICS auto-checked</p>
        </div>

        <div
          style="width:18px; height:18px; border-radius:9999px; border:1.5px solid; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:background 0.15s ease, border-color 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'lcl'
            ? 'background:#F97316; border-color:#F97316;'
            : 'background:transparent; border-color:rgba(168,162,158,0.4);'"
        >
          <span
            x-show="$store.wizard.loadType === 'lcl'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>
    </div>

    <p style="font-size:12px; color:#A8A29E; text-align:center;">
      Not sure? <a href="#" style="color:#F97316; text-decoration:none; border-bottom:1px solid rgba(249,115,22,0.3);">FCL vs LCL explained →</a>
    </p>
  </div>
)
