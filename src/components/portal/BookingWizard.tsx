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
    <div x-show="$store.wizard.currentStep <= 7" style="margin-bottom:28px;">

      {/* Bubbles row */}
      <div style="display:flex; align-items:center; justify-content:space-between; position:relative; margin-bottom:12px;">
        {STEPS.map((s, i) => (
          <div key={s.n} style="display:flex; align-items:center; flex:1;">

            {/* Connector line */}
            {i > 0 && (
              <div style="flex:1; height:2px; margin:0 4px; border-radius:9999px; transition:background 0.3s ease;"
                x-bind:style={`${s.n} <= $store.wizard.currentStep ? 'background:#1A1815;' : 'background:rgba(0,0,0,0.10);'`}
              ></div>
            )}

            {/* Bubble */}
            <div
              style="width:34px; height:34px; border-radius:9999px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:12px; font-weight:700; letter-spacing:-0.01em; transition:all 0.25s ease; position:relative; z-index:1;"
              x-bind:style={`${s.n} < $store.wizard.currentStep
                ? 'background:#1A1815; color:white;'
                : ${s.n} === $store.wizard.currentStep
                  ? 'background:#F97316; color:white; box-shadow:0 0 0 4px rgba(249,115,22,0.15), 0 2px 10px rgba(249,115,22,0.35);'
                  : 'background:#FEFCFA; color:#A09990; box-shadow:0 2px 6px rgba(0,0,0,0.08); border:1.5px solid rgba(0,0,0,0.09);'`}
            >
              {/* Past: check icon */}
              <span
                x-show={`${s.n} < $store.wizard.currentStep`}
                style="font-size:11px; line-height:1;"
              >✓</span>
              {/* Current / future: number */}
              <span
                x-show={`${s.n} >= $store.wizard.currentStep`}
              >{s.n}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Current step label */}
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:11px; color:#A8A29E; letter-spacing:0.01em;">
          Step <span x-text="$store.wizard.currentStep" style="font-weight:600; color:#78716C;"></span>
          {' '}of 7
        </span>
        <span
          style="font-size:11px; font-weight:600; color:#F97316; letter-spacing:0.04em; text-transform:uppercase;"
          x-text="['Slots','Service','Cargo','Time','Details','Docs','Payment'][$store.wizard.currentStep - 1] || ''"
        ></span>
      </div>
    </div>

    {/* ── Hold timer banner ────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.currentStep >= 5 && $store.wizard.holdActive"
      x-cloak
      style="margin-bottom:16px; display:flex; align-items:center; gap:10px; border-radius:12px; padding:11px 16px; font-size:12.5px; font-weight:500;"
      x-bind:style="$store.wizard.holdExpiring
        ? 'background:#FEF2F2; border:1px solid rgba(220,38,38,0.18); color:#B91C1C;'
        : 'background:#FFFBEB; border:1px solid rgba(217,119,6,0.2); color:#92400E;'"
    >
      <Icon name={ICONS.clock} size={14} style="flex-shrink:0;" />
      <span>
        Slot held for{' '}
        <span class="font-mono font-bold" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>
        {' '}— complete payment to secure it.
      </span>
    </div>

    {/* ── Step panels ──────────────────────────────────────────────────────── */}
    <div style="background:#FEFCFA; border-radius:20px; padding:28px; min-height:380px; box-shadow:0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9);">
      <Step1ServiceType />
      <Step2SlotPicker />
      <Step3HoldConfirm />
      <Step4ShipmentDetails />
      <Step5Documents />
      <Step6ContactVehicle />
      <Step7Confirmation />

      {/* Step 8: confirmed */}
      <div x-show="$store.wizard.currentStep === 8" x-cloak style="text-align:center; padding:12px 0;">
        <div style="width:56px; height:56px; background:linear-gradient(135deg,#16A34A,#22C55E); border-radius:18px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:rgba(22,163,74,0.25) 0px 8px 20px -4px;">
          <Icon name={ICONS.check} size={26} style="color:white;" />
        </div>
        <h2 style="font-size:20px; font-weight:600; color:#1C1917; letter-spacing:-0.02em; margin-bottom:6px;">Booking Confirmed</h2>
        <p style="font-size:13px; color:#78716C; margin-bottom:24px;">Your QR code is ready — screenshot or print it before arrival.</p>

        <div style="display:inline-block; background:#F5F2EC; border:1px solid rgba(0,0,0,0.07); border-radius:12px; padding:12px 24px; margin-bottom:20px;">
          <p style="font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#A8A29E; margin-bottom:4px;">Reference</p>
          <p style="font-family:ui-monospace,monospace; font-size:18px; font-weight:700; color:#1C1917; letter-spacing:0.04em;" x-text="$store.wizard.confirmationRef"></p>
        </div>

        <div style="width:148px; height:148px; border:1.5px dashed rgba(0,0,0,0.12); border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 24px; background:#F5F2EC;">
          <Icon name={ICONS.qrCode} size={44} style="color:rgba(0,0,0,0.2); margin-bottom:6px;" />
          <p style="font-size:11px; color:#A8A29E;">Scan at kiosk</p>
        </div>

        <div style="background:#F5F2EC; border:1px solid rgba(0,0,0,0.07); border-radius:14px; padding:16px 20px; text-align:left; margin-bottom:20px; max-width:340px; margin-left:auto; margin-right:auto;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 24px;">
            <div>
              <p style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#A8A29E; margin-bottom:3px;">Service</p>
              <p style="font-size:13px; font-weight:500; color:#1C1917;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off'"></p>
            </div>
            <div>
              <p style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#A8A29E; margin-bottom:3px;">Load</p>
              <p style="font-size:13px; font-weight:500; color:#1C1917;" x-text="($store.wizard.loadType || '—').toUpperCase()"></p>
            </div>
            <div>
              <p style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#A8A29E; margin-bottom:3px;">Slot</p>
              <p style="font-size:13px; font-weight:500; color:#1C1917;" x-text="$store.wizard.selectedSlotLabel || '—'"></p>
            </div>
            <div>
              <p style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#A8A29E; margin-bottom:3px;">Driver</p>
              <p style="font-size:13px; font-weight:500; color:#1C1917;" x-text="$store.wizard.driverName || $store.wizard.guestName || '—'"></p>
            </div>
          </div>
        </div>

        <button
          type="button"
          style="font-size:13px; font-weight:500; color:#F97316; background:none; border:none; cursor:pointer; padding:0;"
          x-on:click="$store.wizard.reset(); window.location.href = '/book'"
        >
          Book another visit →
        </button>
      </div>
    </div>

    {/* ── Navigation ───────────────────────────────────────────────────────── */}
    <div
      style="display:flex; align-items:center; justify-content:space-between; margin-top:24px; padding-top:20px; border-top:1px solid rgba(0,0,0,0.07);"
      x-show="$store.wizard.currentStep < 7"
    >
      {/* Back — clear white border button */}
      <button
        type="button"
        x-on:click="$store.wizard.prevStep()"
        x-bind:disabled="$store.wizard.currentStep <= 1"
        style="display:inline-flex; align-items:center; gap:8px; padding:12px 22px; font-size:13px; font-weight:500; color:#6B6560; background:#FEFCFA; border:1.5px solid rgba(0,0,0,0.13); border-radius:12px; cursor:pointer; transition:all 0.15s ease; box-shadow:0 1px 3px rgba(0,0,0,0.06);"
        x-bind:style="$store.wizard.currentStep <= 1 ? 'opacity:0.3; cursor:not-allowed; pointer-events:none;' : ''"
        onmouseover="if(this.style.cursor!=='not-allowed'){this.style.borderColor='rgba(0,0,0,0.22)'; this.style.color='#1A1815';}"
        onmouseout="this.style.borderColor='rgba(0,0,0,0.13)'; this.style.color='#6B6560';"
      >
        ← Back
      </button>

      {/* Next — orange gradient */}
      <button
        type="button"
        x-on:click="$store.wizard.nextStep()"
        x-bind:disabled="!$store.wizard.canProceed"
        style="display:inline-flex; align-items:center; gap:8px; padding:12px 28px; font-size:13px; font-weight:600; color:white; background:linear-gradient(135deg,#F97316,#EA6C0A); border:none; border-radius:12px; cursor:pointer; box-shadow:rgba(249,115,22,0.35) 0px 4px 16px 0px; letter-spacing:0.01em; transition:all 0.15s ease;"
        x-bind:style="!$store.wizard.canProceed ? 'opacity:0.35; cursor:not-allowed;' : ''"
        onmouseover="if(this.style.cursor!=='not-allowed'){this.style.boxShadow='rgba(249,115,22,0.45) 0px 6px 20px 0px';}"
        onmouseout="this.style.boxShadow='rgba(249,115,22,0.35) 0px 4px 16px 0px';"
      >
        <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay' : 'Next →'">Next →</span>
      </button>
    </div>
  </div>
)
