import { Icon, ICONS } from '../../lib/Icon'
import { Step1ServiceType } from './Step1ServiceType'
import { Step2SlotPicker } from './Step2SlotPicker'
import { Step3HoldConfirm } from './Step3HoldConfirm'
import { Step4ShipmentDetails } from './Step4ShipmentDetails'
import { Step5Documents } from './Step5Documents'
import { Step6ContactVehicle } from './Step6ContactVehicle'
import { Step7Confirmation } from './Step7Confirmation'

const STEPS = [
  { n: 1, label: 'Service' },
  { n: 2, label: 'Slot' },
  { n: 3, label: 'Hold' },
  { n: 4, label: 'Cargo' },
  { n: 5, label: 'Docs' },
  { n: 6, label: 'Contact' },
  { n: 7, label: 'Pay' },
]

export const BookingWizard = () => (
  <div x-data="{}">

    {/* ── Unified wizard card ───────────────────────────────────────────────── */}
    <div
      class="wizard-card"
      x-show="$store.wizard.currentStep !== 8"
      x-cloak
    >

      {/* ── Card header: stepper ─────────────────────────────────────────── */}
      <div style="padding:22px 28px 18px; border-bottom:1px solid rgba(255,255,255,0.055);">

        {/* Stepper track */}
        <div class="step-track" style="margin-bottom:14px;">
          {STEPS.map((s, i) => (
            <div key={s.n} class="step-track-item">

              {/* Connector before this step */}
              {i > 0 && (
                <div
                  class="step-connector"
                  x-bind:class={`$store.wizard.currentStep > ${s.n} ? 'done' : $store.wizard.currentStep === ${s.n} ? 'active' : 'future'`}
                />
              )}

              {/* Bubble + label column */}
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div
                  class="step-bubble"
                  x-bind:class={`$store.wizard.currentStep > ${s.n} ? 'done' : $store.wizard.currentStep === ${s.n} ? 'active' : 'inactive'`}
                >
                  {/* Checkmark when done */}
                  <svg
                    x-show={`$store.wizard.currentStep > ${s.n}`}
                    style="width:12px; height:12px; flex-shrink:0;"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {/* Number when current or future */}
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
        <div style="height:2px; background:rgba(255,255,255,0.05); border-radius:9999px; overflow:hidden;">
          <div
            style="height:100%; border-radius:9999px; background:linear-gradient(90deg,#FF7A2A,#FC6514); transition:width 0.45s cubic-bezier(0.16,1,0.3,1);"
            x-bind:style="`width:${Math.round(($store.wizard.currentStep - 1) / 6 * 100)}%`"
          />
        </div>
      </div>

      {/* ── Hold timer (shown from step 5 onward) ────────────────────────── */}
      <div
        x-show="$store.wizard.currentStep >= 5 && $store.wizard.holdActive"
        x-cloak
        style="margin:0 28px; padding:10px 14px; border-radius:8px; display:flex; align-items:center; gap:10px; font-size:12px; font-weight:500; margin-top:16px;"
        x-bind:style="$store.wizard.holdExpiring
          ? 'background:rgba(239,68,68,0.10); border:1px solid rgba(239,68,68,0.20); color:#EF4444;'
          : 'background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); color:#94A3B8;'"
      >
        <Icon name={ICONS.clock} size={13} style="flex-shrink:0;" />
        <span>
          Slot held for{' '}
          <span style="font-family:ui-monospace,monospace; font-weight:700;" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>
          {' '}— complete payment to secure.
        </span>
      </div>

      {/* ── Card body: step content ───────────────────────────────────────── */}
      <div style="padding:28px; min-height:320px;">
        <Step1ServiceType />
        <Step2SlotPicker />
        <Step3HoldConfirm />
        <Step4ShipmentDetails />
        <Step5Documents />
        <Step6ContactVehicle />
        <Step7Confirmation />
      </div>

      {/* ── Card footer: navigation ───────────────────────────────────────── */}
      <div
        x-show="7 > $store.wizard.currentStep"
        style="padding:16px 28px; border-top:1px solid rgba(255,255,255,0.055); display:flex; align-items:center; justify-content:space-between; gap:12px;"
      >

        {/* Back — ghost, left side */}
        <button
          type="button"
          x-on:click="$store.wizard.prevStep()"
          x-bind:disabled="$store.wizard.currentStep === 1"
          x-bind:style="$store.wizard.currentStep === 1 ? 'opacity:0; pointer-events:none; visibility:hidden;' : 'opacity:1;'"
          class="btn-ghost"
          style="padding:9px 16px; font-size:13px; gap:7px;"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0; margin-top:0.5px;">
            <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>

        {/* Continue / Pay — primary, right side */}
        <button
          type="button"
          x-on:click="$store.wizard.nextStep()"
          x-bind:disabled="!$store.wizard.canProceed"
          class="btn-primary"
          style="padding:9px 22px; font-size:13px; min-width:136px; justify-content:center;"
          x-bind:style="!$store.wizard.canProceed ? 'opacity:0.28; cursor:not-allowed; pointer-events:none;' : ''"
        >
          <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay' : 'Continue'">Continue</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0; margin-top:0.5px;">
            <path d="M4.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

      </div>
    </div>

    {/* ── Step 8: booking confirmed ─────────────────────────────────────────── */}
    <div
      class="wizard-card"
      x-show="$store.wizard.currentStep === 8"
      x-cloak
      style="padding:40px 32px; text-align:center;"
    >
      {/* Icon */}
      <div style="width:52px; height:52px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 24px rgba(252,101,20,0.50), 0 1px 3px rgba(0,0,0,0.45);">
        <Icon name={ICONS.check} size={24} style="color:white;" />
      </div>

      <h2 style="font-size:20px; font-weight:700; color:#F1F5F9; letter-spacing:-0.03em; margin-bottom:6px;">Booking Confirmed</h2>
      <p style="font-size:13px; color:#64748B; margin-bottom:28px; line-height:1.6;">Your QR code is ready — screenshot or print it before arrival.</p>

      {/* Reference */}
      <div style="display:inline-block; background:rgba(252,101,20,0.07); border:1px solid rgba(252,101,20,0.18); border-radius:10px; padding:10px 24px; margin-bottom:24px;">
        <p style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(252,101,20,0.55); margin-bottom:3px;">Reference</p>
        <p style="font-family:ui-monospace,monospace; font-size:18px; font-weight:700; color:#FC6514; letter-spacing:0.05em;" x-text="$store.wizard.confirmationRef"></p>
      </div>

      {/* QR placeholder */}
      <div style="width:144px; height:144px; border:1.5px dashed rgba(255,255,255,0.10); border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 24px; background:rgba(255,255,255,0.025);">
        <Icon name={ICONS.qrCode} size={42} style="color:rgba(255,255,255,0.18); margin-bottom:6px;" />
        <p style="font-size:11px; color:rgba(255,255,255,0.25);">Scan at kiosk</p>
      </div>

      {/* Summary grid */}
      <div style="background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px 20px; text-align:left; margin-bottom:24px; max-width:340px; margin-left:auto; margin-right:auto;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px 24px;">
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.28); margin-bottom:3px;">Service</p>
            <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off'"></p>
          </div>
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.28); margin-bottom:3px;">Load</p>
            <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="($store.wizard.loadType || '—').toUpperCase()"></p>
          </div>
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.28); margin-bottom:3px;">Slot</p>
            <p style="font-size:13px; font-weight:600; color:#F1F5F9;" x-text="$store.wizard.selectedSlotLabel || '—'"></p>
          </div>
          <div>
            <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:rgba(255,255,255,0.28); margin-bottom:3px;">Driver</p>
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
