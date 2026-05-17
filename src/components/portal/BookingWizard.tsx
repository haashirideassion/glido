import { Icon, ICONS } from '../../lib/Icon'
import { Step1ServiceType } from './Step1ServiceType'
import { Step2SlotPicker } from './Step2SlotPicker'
import { Step3HoldConfirm } from './Step3HoldConfirm'
import { Step4ShipmentDetails } from './Step4ShipmentDetails'
import { Step5Documents } from './Step5Documents'
import { Step6ContactVehicle } from './Step6ContactVehicle'
import { Step7Confirmation } from './Step7Confirmation'

/* Step meta — used for the step-name label only */
const STEP_LABELS = [
  '', // index 0 unused
  'Service Type',
  'Pick a Slot',
  'Confirm Hold',
  'Shipment Details',
  'Documents',
  'Contact & Vehicle',
  'Review & Pay',
]

export const BookingWizard = () => (
  <div x-data="{}">

    {/* ── Unified card shell ────────────────────────────────────────────────── */}
    <div class="wizard-card" x-show="$store.wizard.currentStep !== 8" x-cloak>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER — dot track + step name + progress bar
      ═══════════════════════════════════════════════════════════════════ */}
      <div style="padding:20px 24px 16px; border-bottom:1px solid rgba(0,0,0,0.06);">

        {/* Dot track — 7 tiny dots connected by lines */}
        <div style="display:flex; align-items:center; width:100%; margin-bottom:12px;">

          {/* Step 1 */}
          <div
            class="wiz-dot"
            x-bind:class="$store.wizard.currentStep > 1 ? 'done' : $store.wizard.currentStep === 1 ? 'active' : 'idle'"
          />
          <div class="wiz-line" x-bind:class="$store.wizard.currentStep > 1 ? 'filled' : ''" />

          {/* Step 2 */}
          <div
            class="wiz-dot"
            x-bind:class="$store.wizard.currentStep > 2 ? 'done' : $store.wizard.currentStep === 2 ? 'active' : 'idle'"
          />
          <div class="wiz-line" x-bind:class="$store.wizard.currentStep > 2 ? 'filled' : ''" />

          {/* Step 3 */}
          <div
            class="wiz-dot"
            x-bind:class="$store.wizard.currentStep > 3 ? 'done' : $store.wizard.currentStep === 3 ? 'active' : 'idle'"
          />
          <div class="wiz-line" x-bind:class="$store.wizard.currentStep > 3 ? 'filled' : ''" />

          {/* Step 4 */}
          <div
            class="wiz-dot"
            x-bind:class="$store.wizard.currentStep > 4 ? 'done' : $store.wizard.currentStep === 4 ? 'active' : 'idle'"
          />
          <div class="wiz-line" x-bind:class="$store.wizard.currentStep > 4 ? 'filled' : ''" />

          {/* Step 5 */}
          <div
            class="wiz-dot"
            x-bind:class="$store.wizard.currentStep > 5 ? 'done' : $store.wizard.currentStep === 5 ? 'active' : 'idle'"
          />
          <div class="wiz-line" x-bind:class="$store.wizard.currentStep > 5 ? 'filled' : ''" />

          {/* Step 6 */}
          <div
            class="wiz-dot"
            x-bind:class="$store.wizard.currentStep > 6 ? 'done' : $store.wizard.currentStep === 6 ? 'active' : 'idle'"
          />
          <div class="wiz-line" x-bind:class="$store.wizard.currentStep > 6 ? 'filled' : ''" />

          {/* Step 7 */}
          <div
            class="wiz-dot"
            x-bind:class="$store.wizard.currentStep > 7 ? 'done' : $store.wizard.currentStep === 7 ? 'active' : 'idle'"
          />
        </div>

        {/* Step name + counter */}
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <span
            style="font-size:13px; font-weight:600; color:#1C1917; letter-spacing:-0.01em;"
            x-text={`['','Service Type','Pick a Slot','Confirm Hold','Shipment Details','Documents','Contact & Vehicle','Review & Pay'][$store.wizard.currentStep] || ''`}
          ></span>
          <span style="font-size:11px; font-weight:500; color:#475569; font-variant-numeric:tabular-nums;">
            <span x-text="$store.wizard.currentStep"></span>
            {' / 7'}
          </span>
        </div>

        {/* Progress bar */}
        <div style="height:2px; background:rgba(0,0,0,0.06); border-radius:9999px; overflow:hidden;">
          <div
            style="height:100%; border-radius:9999px; background:linear-gradient(90deg,#FF7A2A,#FC6514); transition:width 0.45s cubic-bezier(0.16,1,0.3,1);"
            x-bind:style="`width:${Math.round(($store.wizard.currentStep - 1) / 6 * 100)}%`"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          Hold timer
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        x-show="$store.wizard.currentStep >= 5 && $store.wizard.holdActive"
        x-cloak
        style="margin:14px 24px 0; padding:9px 14px; border-radius:8px; display:flex; align-items:center; gap:9px; font-size:12px; font-weight:500;"
        x-bind:style="$store.wizard.holdExpiring
          ? 'background:rgba(239,68,68,0.10); border:1px solid rgba(239,68,68,0.18); color:#EF4444;'
          : 'background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.08); color:#78716C;'"
      >
        <Icon name={ICONS.clock} size={12} style="flex-shrink:0;" />
        <span>
          Slot held for{' '}
          <span style="font-family:ui-monospace,monospace; font-weight:700;" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>
          {' '}— complete payment to secure.
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BODY — step panels
      ═══════════════════════════════════════════════════════════════════ */}
      <div style="padding:24px; min-height:300px;">
        <Step1ServiceType />
        <Step2SlotPicker />
        <Step3HoldConfirm />
        <Step4ShipmentDetails />
        <Step5Documents />
        <Step6ContactVehicle />
        <Step7Confirmation />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER — nav buttons
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        x-show="7 > $store.wizard.currentStep"
        style="padding:14px 24px; border-top:1px solid rgba(0,0,0,0.06); display:flex; align-items:center; justify-content:space-between; gap:12px;"
      >
        {/* Back */}
        <button
          type="button"
          x-on:click="$store.wizard.prevStep()"
          x-bind:disabled="$store.wizard.currentStep === 1"
          x-bind:style="$store.wizard.currentStep === 1 ? 'opacity:0; pointer-events:none; visibility:hidden;' : 'opacity:1;'"
          class="btn-ghost"
          style="padding:8px 16px; font-size:13px; gap:6px;"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
            <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>

        {/* Continue / Pay */}
        <button
          type="button"
          x-on:click="$store.wizard.nextStep()"
          x-bind:disabled="!$store.wizard.canProceed"
          class="btn-primary"
          style="padding:8px 20px; font-size:13px; min-width:130px; justify-content:center; gap:6px;"
          x-bind:style="!$store.wizard.canProceed ? 'opacity:0.28; cursor:not-allowed; pointer-events:none;' : ''"
        >
          <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay' : 'Continue'">Continue</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
            <path d="M4.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    {/* ── Step 8: Confirmed ─────────────────────────────────────────────────── */}
    <div
      class="wizard-card"
      x-show="$store.wizard.currentStep === 8"
      x-cloak
      style="padding:40px 28px; text-align:center;"
    >
      <div style="width:52px; height:52px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 24px rgba(252,101,20,0.50), 0 1px 3px rgba(0,0,0,0.45);">
        <Icon name={ICONS.check} size={24} style="color:white;" />
      </div>

      <h2 style="font-size:20px; font-weight:700; color:#F1F5F9; letter-spacing:-0.03em; margin-bottom:6px;">Booking Confirmed</h2>
      <p style="font-size:13px; color:#64748B; margin-bottom:28px; line-height:1.6;">Your QR code is ready — screenshot or print it before arrival.</p>

      <div style="display:inline-block; background:rgba(252,101,20,0.07); border:1px solid rgba(252,101,20,0.18); border-radius:10px; padding:10px 24px; margin-bottom:24px;">
        <p style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(252,101,20,0.55); margin-bottom:3px;">Reference</p>
        <p style="font-family:ui-monospace,monospace; font-size:18px; font-weight:700; color:#FC6514; letter-spacing:0.05em;" x-text="$store.wizard.confirmationRef"></p>
      </div>

      <div style="width:144px; height:144px; border:1.5px dashed rgba(0,0,0,0.12); border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 24px; background:rgba(0,0,0,0.025);">
        <Icon name={ICONS.qrCode} size={42} style="color:rgba(0,0,0,0.18); margin-bottom:6px;" />
        <p style="font-size:11px; color:#A8A29E;">Scan at kiosk</p>
      </div>

      <div style="background:rgba(0,0,0,0.025); border:1px solid rgba(0,0,0,0.07); border-radius:12px; padding:16px 20px; text-align:left; margin-bottom:24px; max-width:340px; margin-left:auto; margin-right:auto;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px 24px;">
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Service</p>
            <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off'"></p>
          </div>
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Load</p>
            <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="($store.wizard.loadType || '—').toUpperCase()"></p>
          </div>
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Slot</p>
            <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.selectedSlotLabel || '—'"></p>
          </div>
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Driver</p>
            <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.driverName || $store.wizard.guestName || '—'"></p>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="btn-ghost"
        style="font-size:13px; padding:8px 18px;"
        x-on:click="$store.wizard.reset(); window.location.href = '/book'"
      >
        Book another visit
      </button>
    </div>

  </div>
)
