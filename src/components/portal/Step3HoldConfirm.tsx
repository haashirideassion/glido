import { Icon, ICONS } from '../../lib/Icon'

export const Step3HoldConfirm = () => (
  <div x-show="$store.wizard.currentStep === 3" x-cloak>

    {/* Step heading */}
    <div style="margin-bottom:28px;">
      <h2 style="font-size:22px; font-weight:700; color:#111827; letter-spacing:-0.03em; margin-bottom:6px;">Cargo type</h2>
      <p style="font-size:14px; color:#6b7280; line-height:1.6;">Select whether your shipment is FCL or LCL — this determines which details we ask for next.</p>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">

      {/* FCL */}
      <button
        type="button"
        x-on:click="$store.wizard.selectLoadType('fcl')"
        class="wizard-option-card"
        x-bind:class="$store.wizard.loadType === 'fcl' ? 'selected' : ''"
      >
        <div
          style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1.5px solid #e5e7eb; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'fcl' ? 'background:#FC6514; border-color:#FC6514;' : 'background:#f9fafb;'"
        >
          <Icon
            name={ICONS.container}
            size={20}
            x-bind:style="$store.wizard.loadType === 'fcl' ? 'color:#fff;' : 'color:#9ca3af;'"
          />
        </div>

        <div style="flex:1; min-width:0; text-align:left;">
          <div style="display:flex; align-items:baseline; gap:7px; margin-bottom:3px;">
            <p style="font-size:15px; font-weight:600; color:#111827;">FCL</p>
            <span style="font-size:13px; color:#6b7280; font-weight:400;">Full Container Load</span>
          </div>
          <p style="font-size:13px; color:#6b7280; line-height:1.4;">Container number required · No HBL needed</p>
        </div>

        <div
          style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1.5px solid #e5e7eb; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'fcl' ? 'background:#FC6514; border-color:#FC6514;' : ''"
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
        class="wizard-option-card"
        x-bind:class="$store.wizard.loadType === 'lcl' ? 'selected' : ''"
      >
        <div
          style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1.5px solid #e5e7eb; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'lcl' ? 'background:#FC6514; border-color:#FC6514;' : 'background:#f9fafb;'"
        >
          <Icon
            name={ICONS.cargo}
            size={20}
            x-bind:style="$store.wizard.loadType === 'lcl' ? 'color:#fff;' : 'color:#9ca3af;'"
          />
        </div>

        <div style="flex:1; min-width:0; text-align:left;">
          <div style="display:flex; align-items:baseline; gap:7px; margin-bottom:3px;">
            <p style="font-size:15px; font-weight:600; color:#111827;">LCL</p>
            <span style="font-size:13px; color:#6b7280; font-weight:400;">Less than Container Load</span>
          </div>
          <p style="font-size:13px; color:#6b7280; line-height:1.4;">Shared container · HBL + container number · ICS auto-checked</p>
        </div>

        <div
          style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1.5px solid #e5e7eb; transition:all 0.15s ease;"
          x-bind:style="$store.wizard.loadType === 'lcl' ? 'background:#FC6514; border-color:#FC6514;' : ''"
        >
          <span
            x-show="$store.wizard.loadType === 'lcl'"
            style="width:7px; height:7px; border-radius:9999px; background:white; display:block;"
          ></span>
        </div>
      </button>
    </div>

    <p style="font-size:13px; color:#9ca3af; text-align:center;">
      Not sure?{' '}
      <a href="#" style="color:#6b7280; text-decoration:underline; text-underline-offset:3px;">FCL vs LCL explained</a>
    </p>
  </div>
)
