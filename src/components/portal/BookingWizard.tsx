import { Icon, ICONS } from '../../lib/Icon'
import { Step1ServiceType } from './Step1ServiceType'
import { Step2SlotPicker } from './Step2SlotPicker'
import { Step3HoldConfirm } from './Step3HoldConfirm'
import { Step4ShipmentDetails } from './Step4ShipmentDetails'
import { Step5Documents } from './Step5Documents'
import { Step6ContactVehicle } from './Step6ContactVehicle'
import { Step7Confirmation } from './Step7Confirmation'

/* ── Per-step context data ──────────────────────────────────────────────── */
const STEP_CTX = [
  { label: 'Get started',      tip: 'Tell us who is visiting and how many slots you need today.' },
  { label: 'Service type',     tip: 'Are you picking up cargo from, or dropping it off at the CFS?' },
  { label: 'Cargo type',       tip: 'Select whether your shipment is FCL or LCL — this determines which details we ask for.' },
  { label: 'Choose a slot',    tip: 'Select your arrival window. Slots are held for 10 minutes while you complete the booking.' },
  { label: 'Shipment details', tip: 'Enter your HBL or container reference. ICS status is checked automatically.' },
  { label: 'Documents',        tip: 'Upload your Delivery Order and any required customs paperwork.' },
  { label: 'Review & pay',     tip: 'Review your booking details and complete payment to confirm your slot.' },
]


export const BookingWizard = () => (
  /* Compact — no viewport-fill, just wraps content */
  <div x-data="{}">

    {/* ═══════════════════════════════════════════════════════════════════
        PROGRESS STRIP
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep !== 8"
      x-cloak
      style="padding:24px 48px 20px; border-bottom:1px solid rgba(0,0,0,0.06);"
    >
      {/* Label row */}
      <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:10px; max-width:560px; margin-left:auto; margin-right:auto;">
        <span style="font-size:10.5px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#A8A29E;">
          Step <span x-text="$store.wizard.currentStep" /> of 7
        </span>
        {STEP_CTX.map((ctx, i) => (
          <span key={i} x-show={`$store.wizard.currentStep === ${i + 1}`} x-cloak
            style="font-size:11.5px; font-weight:600; color:#78716C;">
            {ctx.label}
          </span>
        ))}
      </div>

      {/* 7-segment track
           current step:  30% fill → 80% when canProceed (reacts to input)
           completed step: 100% fill, faded
           future step:   empty
           NOTE: avoid > and < in Alpine attr strings (Hono encodes them).
                 Use Math.max(0, a - b) !== 0  to mean  a > b             */}
      <div style="display:flex; gap:4px; max-width:560px; margin:0 auto;">
        {[1,2,3,4,5,6,7].map(n => (
          <div
            key={n}
            style="flex:1; height:4px; border-radius:9999px; overflow:hidden; background:rgba(0,0,0,0.09);"
          >
            <div
              style="height:100%; border-radius:9999px; background:#FC6514; transition:width 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;"
              x-bind:style={`$store.wizard.currentStep === ${n}
                ? ($store.wizard.canProceed ? 'width:80%; opacity:1;' : 'width:30%; opacity:1;')
                : (Math.max(0, $store.wizard.currentStep - ${n}) !== 0
                  ? 'width:100%; opacity:0.35;'
                  : 'width:0%; opacity:0;')`}
            />
          </div>
        ))}
      </div>
    </div>

    {/* ═══════════════════════════════════════════════════════════════════
        FORM BODY
    ═══════════════════════════════════════════════════════════════════ */}
    <div x-show="$store.wizard.currentStep !== 8" x-cloak>
      <div
        style="max-width:560px; margin:0 auto; padding:36px 40px 44px;"
        x-init={`$watch('$store.wizard.currentStep', function() {
          $el.animate(
            [{opacity:0, transform:'translateY(8px)'}, {opacity:1, transform:'translateY(0)'}],
            {duration:260, easing:'cubic-bezier(0.16,1,0.3,1)'}
          );
        })`}
      >
        {/* Hold timer badge — steps 5–7 (shown below the step's own heading) */}
        <div
          x-show="Math.max(0, $store.wizard.currentStep - 4) !== 0 && $store.wizard.holdActive"
          x-cloak
          style="margin-bottom:16px; display:inline-flex; align-items:center; gap:7px; padding:5px 12px; border-radius:8px; font-size:11.5px; font-weight:600;"
          x-bind:style="$store.wizard.holdExpiring ? 'background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.18); color:#EF4444;' : 'background:rgba(252,101,20,0.07); border:1px solid rgba(252,101,20,0.14); color:rgba(252,101,20,0.85);'"
        >
          <Icon name={ICONS.clock} size={12} style="flex-shrink:0;" />
          <span>Slot held · <span style="font-family:ui-monospace,monospace; font-weight:700;" x-text="$store.wizard.holdMinutes + ':' + $store.wizard.holdSeconds" /></span>
        </div>

        <Step1ServiceType />
        <Step2SlotPicker />
        <Step3HoldConfirm />
        <Step4ShipmentDetails />
        <Step5Documents />
        <Step6ContactVehicle />
        <Step7Confirmation />
      </div>
    </div>

    {/* ═══════════════════════════════════════════════════════════════════
        FOOTER — Back · counter · Continue  (constrained to form width)
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep !== 8"
      x-cloak
      style="border-top:1px solid rgba(0,0,0,0.07); padding:14px 0 16px;"
    >
      <div style="max-width:560px; margin:0 auto; padding:0 40px; display:flex; align-items:center; justify-content:space-between;">

      {/* Back */}
      <button
        type="button"
        x-on:click="$store.wizard.prevStep()"
        x-bind:style="$store.wizard.currentStep === 1 ? 'opacity:0; pointer-events:none;' : 'opacity:1;'"
        style="display:inline-flex; align-items:center; gap:6px; padding:9px 20px; font-size:13px; font-weight:500; color:#78716C; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; background:transparent; cursor:pointer; transition:border-color 0.15s ease, color 0.15s ease;"
        onmouseover="this.style.borderColor='rgba(0,0,0,0.22)'; this.style.color='#1C1917';"
        onmouseout="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.color='#78716C';"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
          <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back
      </button>

      {/* Counter */}
      <span style="font-size:11px; font-weight:500; color:#A8A29E; font-variant-numeric:tabular-nums;">
        <span x-text="$store.wizard.currentStep" /><span style="opacity:0.4;"> / 7</span>
      </span>

      {/* Continue */}
      <button
        type="button"
        x-on:click="$store.wizard.nextStep()"
        class="btn-primary"
        style="padding:9px 24px; font-size:13px; min-width:130px; justify-content:center;"
        x-bind:style="!$store.wizard.canProceed ? 'filter:grayscale(1) opacity(0.28); cursor:not-allowed; pointer-events:none;' : ''"
      >
        <span x-text="$store.wizard.currentStep === 6 ? 'Review & Submit' : 'Continue'">Continue</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
          <path d="M4.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      </div>{/* end max-width wrapper */}
    </div>{/* end footer */}

    {/* ═══════════════════════════════════════════════════════════════════
        STEP 8 — Booking confirmed
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep === 8"
      x-cloak
      style="padding:52px 40px;"
    >
      <div style="max-width:400px; width:100%; text-align:center;">
        <div style="width:52px; height:52px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-radius:13px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 24px rgba(252,101,20,0.45);">
          <Icon name={ICONS.check} size={24} style="color:white;" />
        </div>

        <h2 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:6px;">Booking Confirmed</h2>
        <p style="font-size:13px; color:#78716C; margin-bottom:28px; line-height:1.6;">Your QR code is ready — screenshot or print it before arriving at the depot.</p>

        <div style="display:inline-block; background:rgba(252,101,20,0.06); border:1px solid rgba(252,101,20,0.16); border-radius:10px; padding:10px 28px; margin-bottom:24px;">
          <p style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(252,101,20,0.50); margin-bottom:3px;">Reference</p>
          <p style="font-family:ui-monospace,monospace; font-size:19px; font-weight:700; color:#FC6514; letter-spacing:0.05em;" x-text="$store.wizard.confirmationRef" />
        </div>

        <div style="width:144px; height:144px; border:1.5px dashed rgba(0,0,0,0.09); border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 24px; background:rgba(0,0,0,0.02);">
          <Icon name={ICONS.qrCode} size={44} style="color:rgba(0,0,0,0.14); margin-bottom:6px;" />
          <p style="font-size:11px; color:#A8A29E;">Scan at kiosk</p>
        </div>

        <div style="background:#EBEBEA; border:1px solid rgba(0,0,0,0.06); border-radius:12px; padding:16px 20px; text-align:left; margin-bottom:24px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px 20px;">
            {[
              { label: 'Service', expr: "$store.wizard.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off'" },
              { label: 'Load',    expr: "($store.wizard.loadType || '—').toUpperCase()" },
              { label: 'Slot',    expr: "$store.wizard.selectedSlotLabel || '—'" },
              { label: 'Driver',  expr: "$store.wizard.driverName || $store.wizard.guestName || '—'" },
            ].map(row => (
              <div key={row.label}>
                <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:4px;">{row.label}</p>
                <p style="font-size:13px; font-weight:600; color:#1C1917;" x-text={row.expr} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          style="display:inline-flex; align-items:center; gap:6px; padding:9px 20px; font-size:13px; font-weight:500; color:#78716C; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; background:transparent; cursor:pointer;"
          x-on:click="$store.wizard.reset(); window.location.href = '/book'"
        >
          Book another visit
        </button>
      </div>
    </div>

  </div>
)
