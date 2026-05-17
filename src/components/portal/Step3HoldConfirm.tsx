import { Icon, ICONS } from '../../lib/Icon'

export const Step3HoldConfirm = () => (
  <div x-show="$store.wizard.currentStep === 3" x-cloak>

    <h2 style="font-size:18px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:3px;">
      What type of cargo?
    </h2>
    <p style="font-size:13px; color:#64748B; margin-bottom:24px; line-height:1.5;">
      This determines which details we ask for on the next screen.
    </p>

    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">

      {/* FCL */}
      <button
        type="button"
        x-on:click="$store.wizard.selectLoadType('fcl')"
        style="display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:16px; cursor:pointer; text-align:left; width:100%; transition:all 0.18s ease; background:rgba(0,0,0,0.03); border:1.5px solid rgba(0,0,0,0.09);"
        x-bind:style="$store.wizard.loadType === 'fcl'
          ? 'background:rgba(252,101,20,0.08); border-color:rgba(252,101,20,0.40); box-shadow:0 0 0 3px rgba(252,101,20,0.08);'
          : ''"
        onmouseover="if(!this.style.borderColor.includes('252')){this.style.borderColor='rgba(0,0,0,0.15)';}"
        onmouseout="if(!this.style.borderColor.includes('252')){this.style.borderColor='rgba(0,0,0,0.09)';}"
      >
        <div
          style="width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.18s ease; background:rgba(0,0,0,0.05); border:1px solid rgba(0,0,0,0.09);"
          x-bind:style="$store.wizard.loadType === 'fcl'
            ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-color:transparent; box-shadow:0 4px 12px rgba(252,101,20,0.35), inset 0 1px 0 rgba(255,255,255,0.22);'
            : ''"
        >
          <Icon
            name={ICONS.container}
            size={17}
            x-bind:style="$store.wizard.loadType === 'fcl' ? 'color:white;' : 'color:rgba(0,0,0,0.28);'"
          />
        </div>

        <div style="flex:1; min-width:0; text-align:left;">
          <div style="display:flex; align-items:baseline; gap:7px; margin-bottom:2px;">
            <p
              style="font-size:14px; font-weight:700; letter-spacing:-0.01em; color:#1C1917; transition:color 0.15s ease;"
              x-bind:style="$store.wizard.loadType === 'fcl' ? 'color:#FC6514;' : ''"
            >FCL</p>
            <span style="font-size:12px; color:#64748B; font-weight:400;">Full Container Load</span>
          </div>
          <p style="font-size:12px; color:#64748B;">Container number required · No HBL needed</p>
        </div>

        <div
          style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.18s ease; border:1.5px solid rgba(0,0,0,0.14); background:rgba(0,0,0,0.04);"
          x-bind:style="$store.wizard.loadType === 'fcl'
            ? 'background:#FC6514; border-color:#FC6514; box-shadow:rgba(252,101,20,0.35) 0px 2px 8px 0px;'
            : ''"
        >
          <span
            x-show="$store.wizard.loadType === 'fcl'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>

      {/* LCL */}
      <button
        type="button"
        x-on:click="$store.wizard.selectLoadType('lcl')"
        style="display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:16px; cursor:pointer; text-align:left; width:100%; transition:all 0.18s ease; background:rgba(0,0,0,0.03); border:1.5px solid rgba(0,0,0,0.09);"
        x-bind:style="$store.wizard.loadType === 'lcl'
          ? 'background:rgba(252,101,20,0.08); border-color:rgba(252,101,20,0.40); box-shadow:0 0 0 3px rgba(252,101,20,0.08);'
          : ''"
        onmouseover="if(!this.style.borderColor.includes('252')){this.style.borderColor='rgba(0,0,0,0.15)';}"
        onmouseout="if(!this.style.borderColor.includes('252')){this.style.borderColor='rgba(0,0,0,0.09)';}"
      >
        <div
          style="width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.18s ease; background:rgba(0,0,0,0.05); border:1px solid rgba(0,0,0,0.09);"
          x-bind:style="$store.wizard.loadType === 'lcl'
            ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-color:transparent; box-shadow:0 4px 12px rgba(252,101,20,0.35), inset 0 1px 0 rgba(255,255,255,0.22);'
            : ''"
        >
          <Icon
            name={ICONS.cargo}
            size={17}
            x-bind:style="$store.wizard.loadType === 'lcl' ? 'color:white;' : 'color:rgba(0,0,0,0.28);'"
          />
        </div>

        <div style="flex:1; min-width:0; text-align:left;">
          <div style="display:flex; align-items:baseline; gap:7px; margin-bottom:2px;">
            <p
              style="font-size:14px; font-weight:700; letter-spacing:-0.01em; color:#1C1917; transition:color 0.15s ease;"
              x-bind:style="$store.wizard.loadType === 'lcl' ? 'color:#FC6514;' : ''"
            >LCL</p>
            <span style="font-size:12px; color:#64748B; font-weight:400;">Less than Container Load</span>
          </div>
          <p style="font-size:12px; color:#64748B;">Shared container · HBL + container number · ICS auto-checked</p>
        </div>

        <div
          style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.18s ease; border:1.5px solid rgba(0,0,0,0.14); background:rgba(0,0,0,0.04);"
          x-bind:style="$store.wizard.loadType === 'lcl'
            ? 'background:#FC6514; border-color:#FC6514; box-shadow:rgba(252,101,20,0.35) 0px 2px 8px 0px;'
            : ''"
        >
          <span
            x-show="$store.wizard.loadType === 'lcl'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>
    </div>

    <p style="font-size:12px; color:#A8A29E; text-align:center;">
      Not sure?{' '}
      <a href="#" style="color:#64748B; text-decoration:underline; text-underline-offset:2px; text-decoration-color:rgba(0,0,0,0.15);">
        FCL vs LCL explained →
      </a>
    </p>
  </div>
)
