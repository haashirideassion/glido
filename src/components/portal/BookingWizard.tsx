import { Icon, ICONS } from '../../lib/Icon'
import { Step1ServiceType } from './Step1ServiceType'
import { Step2SlotPicker } from './Step2SlotPicker'
import { Step3HoldConfirm } from './Step3HoldConfirm'
import { Step4ShipmentDetails } from './Step4ShipmentDetails'
import { Step5Documents } from './Step5Documents'
import { Step6ContactVehicle } from './Step6ContactVehicle'
import { Step7Confirmation } from './Step7Confirmation'

const STEPS = [
  { n: 1, label: 'Slots' },
  { n: 2, label: 'Service' },
  { n: 3, label: 'Cargo' },
  { n: 4, label: 'Time' },
  { n: 5, label: 'Details' },
  { n: 6, label: 'Docs' },
  { n: 7, label: 'Payment' },
]

export const BookingWizard = () => (
  <div x-data="{}">

    {/* ── Step indicator ──────────────────────────────────────────────────── */}
    <div x-show="$store.wizard.currentStep !== 8" style="margin-bottom:28px;">

      {/* Stepper track */}
      <div class="step-track" style="margin-bottom:10px;">
        {STEPS.map((s, i) => (
          <div key={s.n} class="step-track-item">

            {/* Connector before this step — flip comparisons to avoid < in JSX attrs */}
            {i > 0 && (
              <div
                class="step-connector"
                x-bind:class={`$store.wizard.currentStep > ${s.n} ? 'done' : $store.wizard.currentStep === ${s.n} ? 'active' : 'future'`}
              />
            )}

            {/* Step column: bubble + label */}
            <div style="display:flex; flex-direction:column; align-items:center;">
              <div
                class="step-bubble"
                x-bind:class={`$store.wizard.currentStep > ${s.n} ? 'done' : $store.wizard.currentStep === ${s.n} ? 'active' : 'inactive'`}
              >
                {/* Checkmark for completed — x-show uses > not < */}
                <svg
                  x-show={`$store.wizard.currentStep > ${s.n}`}
                  style="width:13px; height:13px; flex-shrink:0;"
                  viewBox="0 0 12 12" fill="none"
                >
                  <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {/* Number — show when current or future */}
                <span x-show={`!($store.wizard.currentStep > ${s.n})`} style="line-height:1;">{s.n}</span>
              </div>
              <span
                class="step-label"
                x-bind:class={`$store.wizard.currentStep > ${s.n} ? 'done' : $store.wizard.currentStep === ${s.n} ? 'active' : 'inactive'`}
              >
                {s.label}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style="height:2px; background:rgba(255,255,255,0.06); border-radius:9999px; overflow:hidden; margin-top:4px;">
        <div
          style="height:100%; border-radius:9999px; background:linear-gradient(90deg,#FF7A2A,#FC6514); transition:width 0.4s cubic-bezier(0.16,1,0.3,1);"
          x-bind:style="`width:${Math.round(($store.wizard.currentStep - 1) / 6 * 100)}%`"
        />
      </div>
    </div>

    {/* ── Hold timer ───────────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.currentStep >= 5 && $store.wizard.holdActive"
      x-cloak
      style="margin-bottom:16px; display:flex; align-items:center; gap:10px; border-radius:5px; padding:10px 14px; font-size:12px; font-weight:500;"
      x-bind:style="$store.wizard.holdExpiring
        ? 'background:rgba(239,68,68,0.10); border:1px solid rgba(239,68,68,0.25); color:#EF4444;'
        : 'background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); color:#94A3B8;'"
    >
      <Icon name={ICONS.clock} size={13} style="flex-shrink:0;" />
      <span>
        Slot held for{' '}
        <span style="font-family:ui-monospace,monospace; font-weight:700;" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>
        {' '}— complete payment to secure.
      </span>
    </div>

    {/* ── Step panels ──────────────────────────────────────────────────────── */}
    <div class="wizard-card" style="padding:32px; min-height:360px;">
      <Step1ServiceType />
      <Step2SlotPicker />
      <Step3HoldConfirm />
      <Step4ShipmentDetails />
      <Step5Documents />
      <Step6ContactVehicle />
      <Step7Confirmation />

      {/* Step 8: confirmed */}
      <div x-show="$store.wizard.currentStep === 8" x-cloak style="text-align:center; padding:12px 0;">
        <div style="width:56px; height:56px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-radius:10px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 20px rgba(252,101,20,0.50), 0 1px 3px rgba(0,0,0,0.40);">
          <Icon name={ICONS.check} size={26} style="color:white;" />
        </div>
        <h2 style="font-size:20px; font-weight:700; color:#F1F5F9; letter-spacing:-0.03em; margin-bottom:6px;">Booking Confirmed</h2>
        <p style="font-size:13px; color:#64748B; margin-bottom:24px;">Your QR code is ready — screenshot or print it before arrival.</p>

        <div style="display:inline-block; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:8px; padding:10px 22px; margin-bottom:20px;">
          <p style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(255,255,255,0.30); margin-bottom:3px;">Reference</p>
          <p style="font-family:ui-monospace,monospace; font-size:18px; font-weight:700; color:#FC6514; letter-spacing:0.05em;" x-text="$store.wizard.confirmationRef"></p>
        </div>

        <div style="width:148px; height:148px; border:1.5px dashed rgba(255,255,255,0.12); border-radius:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 24px; background:rgba(255,255,255,0.03);">
          <Icon name={ICONS.qrCode} size={44} style="color:rgba(255,255,255,0.20); margin-bottom:6px;" />
          <p style="font-size:11px; color:rgba(255,255,255,0.30);">Scan at kiosk</p>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:16px 20px; text-align:left; margin-bottom:20px; max-width:340px; margin-left:auto; margin-right:auto;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 24px;">
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.30); margin-bottom:3px;">Service</p>
              <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off'"></p>
            </div>
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.30); margin-bottom:3px;">Load</p>
              <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="($store.wizard.loadType || '—').toUpperCase()"></p>
            </div>
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.30); margin-bottom:3px;">Slot</p>
              <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.selectedSlotLabel || '—'"></p>
            </div>
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.30); margin-bottom:3px;">Driver</p>
              <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.driverName || $store.wizard.guestName || '—'"></p>
            </div>
          </div>
        </div>

        <button
          type="button"
          style="font-size:13px; font-weight:600; color:#F1F5F9; background:none; border:none; cursor:pointer; padding:0; opacity:0.5; transition:opacity 0.15s ease;"
          onmouseover="this.style.opacity='1'"
          onmouseout="this.style.opacity='0.5'"
          x-on:click="$store.wizard.reset(); window.location.href = '/book'"
        >
          Book another visit →
        </button>
      </div>
    </div>

    {/* ── Navigation ───────────────────────────────────────────────────────── */}
    <div
      style="display:flex; align-items:center; justify-content:space-between; margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.07); gap:12px;"
      x-show="7 > $store.wizard.currentStep"
    >
      {/* Back button — ghost pill with left arrow */}
      <button
        type="button"
        x-on:click="$store.wizard.prevStep()"
        x-bind:disabled="$store.wizard.currentStep === 1"
        x-bind:style="$store.wizard.currentStep === 1 ? 'opacity:0; pointer-events:none; visibility:hidden;' : 'opacity:1;'"
        style="display:inline-flex; align-items:center; gap:6px; padding:9px 16px; font-size:13px; font-weight:500; color:#94A3B8; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:9999px; cursor:pointer; transition:all 0.15s ease; letter-spacing:-0.01em; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.06);"
        onmouseover="this.style.background='rgba(255,255,255,0.07)'; this.style.color='#F1F5F9'; this.style.borderColor='rgba(255,255,255,0.14)'"
        onmouseout="this.style.background='rgba(255,255,255,0.04)'; this.style.color='#94A3B8'; this.style.borderColor='rgba(255,255,255,0.09)'"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
          <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back
      </button>

      {/* Continue / Pay button */}
      <button
        type="button"
        x-on:click="$store.wizard.nextStep()"
        x-bind:disabled="!$store.wizard.canProceed"
        class="btn-primary"
        style="padding:10px 22px; font-size:13px; min-width:130px; justify-content:center;"
        x-bind:style="!$store.wizard.canProceed ? 'opacity:0.30; cursor:not-allowed; pointer-events:none;' : ''"
      >
        <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay →' : 'Continue →'">Continue →</span>
      </button>
    </div>
  </div>
)
