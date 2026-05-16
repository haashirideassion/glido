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
    <div x-show="$store.wizard.currentStep <= 7" style="margin-bottom:32px;">

      {/* Track row */}
      <div style="display:flex; align-items:center; position:relative; margin-bottom:14px;">
        {STEPS.map((s, i) => (
          <div key={s.n} style="display:flex; align-items:center; flex:1;">

            {/* Connector */}
            {i > 0 && (
              <div
                style="flex:1; height:1px; margin:0 3px;"
                x-bind:style={`${s.n} <= $store.wizard.currentStep ? 'background:rgba(252,101,20,0.40);' : 'background:rgba(255,255,255,0.08);'`}
              ></div>
            )}

            {/* Marker — sharp square */}
            <div
              style="width:28px; height:28px; border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:11px; font-weight:700; transition:all 0.15s ease; position:relative;"
              x-bind:style={`${s.n} < $store.wizard.currentStep
                ? 'background:rgba(255,255,255,0.08); color:#94A3B8; border:1px solid rgba(255,255,255,0.13); box-shadow:inset 0 1px 0 rgba(255,255,255,0.10);'
                : ${s.n} === $store.wizard.currentStep
                  ? 'background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); color:white; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 12px rgba(252,101,20,0.40), 0 1px 3px rgba(0,0,0,0.40); border:1px solid rgba(0,0,0,0.15);'
                  : 'background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.25); border:1px solid rgba(255,255,255,0.07);'`}
            >
              <span x-show={`${s.n} < $store.wizard.currentStep`} style="font-size:10px; line-height:1;">✓</span>
              <span x-show={`${s.n} >= $store.wizard.currentStep`}>{s.n}</span>
            </div>

          </div>
        ))}
      </div>

      {/* Step label row */}
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:11px; color:#64748B; letter-spacing:0.02em;">
          Step <span x-text="$store.wizard.currentStep" style="font-weight:600; color:#94A3B8;"></span> of 7
        </span>
        <span
          style="font-size:10px; font-weight:700; color:#FC6514; letter-spacing:0.08em; text-transform:uppercase;"
          x-text="['Slots','Service','Cargo','Time','Details','Docs','Payment'][$store.wizard.currentStep - 1] || ''"
        ></span>
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
      style="display:flex; align-items:center; justify-content:space-between; margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.07);"
      x-show="$store.wizard.currentStep < 7"
    >
      {/* Back */}
      <button
        type="button"
        x-on:click="$store.wizard.prevStep()"
        x-bind:disabled="$store.wizard.currentStep <= 1"
        style="font-size:13px; font-weight:500; color:rgba(255,255,255,0.35); background:none; border:none; cursor:pointer; padding:4px 0; transition:color 0.12s ease; letter-spacing:-0.01em;"
        x-bind:style="$store.wizard.currentStep <= 1 ? 'opacity:0; pointer-events:none;' : ''"
        onmouseover="this.style.color='rgba(255,255,255,0.75)'"
        onmouseout="this.style.color='rgba(255,255,255,0.35)'"
      >
        ← Back
      </button>

      {/* Next */}
      <button
        type="button"
        x-on:click="$store.wizard.nextStep()"
        x-bind:disabled="!$store.wizard.canProceed"
        class="btn-dark"
        x-bind:style="!$store.wizard.canProceed ? 'opacity:0.25; cursor:not-allowed; pointer-events:none;' : ''"
      >
        <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay' : 'Continue →'">Continue →</span>
      </button>
    </div>
  </div>
)
