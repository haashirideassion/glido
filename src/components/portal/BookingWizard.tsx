import { Icon, ICONS } from '../../lib/Icon'
import { Step1ServiceType } from './Step1ServiceType'
import { Step2SlotPicker } from './Step2SlotPicker'
import { Step3HoldConfirm } from './Step3HoldConfirm'
import { Step4ShipmentDetails } from './Step4ShipmentDetails'
import { Step5Documents } from './Step5Documents'
import { Step6ContactVehicle } from './Step6ContactVehicle'
import { Step7Confirmation } from './Step7Confirmation'

const STEP_LABELS = ['Slots', 'Service', 'Cargo', 'Time Slot', 'Details', 'Documents', 'Payment']

export const BookingWizard = () => (
  <div x-data="{}">

    {/* ── Step indicator ──────────────────────────────────────────────────── */}
    <div x-show="$store.wizard.currentStep <= 7" style="margin-bottom:28px;">

      {/* Label row */}
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
        <span style="font-size:12px; color:#A8A29E;">
          Step <span x-text="$store.wizard.currentStep" style="font-weight:600; color:#78716C;"></span>
          {' '}of 7
        </span>
        <span
          style="font-size:12px; font-weight:500; color:#F97316; letter-spacing:0.01em;"
          x-text="['Slots','Service','Cargo','Time Slot','Details','Documents','Payment'][$store.wizard.currentStep - 1] || ''"
        ></span>
      </div>

      {/* Progress bar — single clean line */}
      <div style="height:3px; background:rgba(249,115,22,0.12); border-radius:9999px; overflow:hidden;">
        <div
          style="height:100%; background:linear-gradient(to right,#F97316,#FB923C); border-radius:9999px; transition:width 0.4s cubic-bezier(0.4,0,0.2,1);"
          x-bind:style="'width:' + (($store.wizard.currentStep - 1) / 6 * 100) + '%'"
        ></div>
      </div>
    </div>

    {/* ── Hold timer banner ────────────────────────────────────────────────── */}
    <div
      x-show="$store.wizard.currentStep >= 5 && $store.wizard.holdActive"
      x-cloak
      style="margin-bottom:16px; display:flex; align-items:center; gap:10px; border-radius:12px; padding:11px 16px; font-size:13px; font-weight:500;"
      x-bind:style="$store.wizard.holdExpiring
        ? 'background:#FEF2F2; border:1px solid rgba(220,38,38,0.2); color:#B91C1C;'
        : 'background:#FFFBEB; border:1px solid rgba(217,119,6,0.25); color:#92400E;'"
    >
      <Icon name={ICONS.clock} size={15} style="flex-shrink:0;" />
      <span>
        Slot held for{' '}
        <span class="font-mono font-bold" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>
        {' '}— complete payment to secure it.
      </span>
    </div>

    {/* ── Step panels ──────────────────────────────────────────────────────── */}
    <div style="background:#FFF7ED; border:1px solid rgba(249,115,22,0.12); border-radius:20px; padding:28px; min-height:380px; box-shadow:rgba(180,170,160,0.12) 0px 4px 16px -4px, rgba(255,255,255,0.60) 0px 1px 3px 0px inset;">
      <Step1ServiceType />
      <Step2SlotPicker />
      <Step3HoldConfirm />
      <Step4ShipmentDetails />
      <Step5Documents />
      <Step6ContactVehicle />
      <Step7Confirmation />

      {/* Step 8: inline confirmed state */}
      <div x-show="$store.wizard.currentStep === 8" x-cloak style="text-align:center; padding:12px 0;">
        <div style="width:56px; height:56px; background:linear-gradient(135deg,#16A34A,#22C55E); border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:rgba(22,163,74,0.25) 0px 8px 20px -4px;">
          <Icon name={ICONS.check} size={26} style="color:white;" />
        </div>
        <h2 style="font-size:20px; font-weight:600; color:#1C1917; letter-spacing:-0.02em; margin-bottom:6px;">Booking Confirmed</h2>
        <p style="font-size:13px; color:#78716C; margin-bottom:24px;">Your QR code is ready — screenshot or print it before arrival.</p>

        <div style="display:inline-block; background:rgba(249,115,22,0.06); border:1px solid rgba(249,115,22,0.18); border-radius:12px; padding:12px 24px; margin-bottom:20px;">
          <p style="font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#A8A29E; margin-bottom:4px;">Reference</p>
          <p style="font-family:ui-monospace,monospace; font-size:18px; font-weight:700; color:#1C1917; letter-spacing:0.04em;" x-text="$store.wizard.confirmationRef"></p>
        </div>

        {/* QR placeholder */}
        <div style="width:148px; height:148px; border:1.5px dashed rgba(249,115,22,0.25); border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 24px; background:rgba(255,247,237,0.6);">
          <Icon name={ICONS.qrCode} size={44} style="color:rgba(249,115,22,0.4); margin-bottom:6px;" />
          <p style="font-size:11px; color:#A8A29E;">Scan at kiosk</p>
        </div>

        {/* Summary grid */}
        <div style="background:rgba(234,230,219,0.5); border:1px solid rgba(249,115,22,0.10); border-radius:14px; padding:16px 20px; text-align:left; margin-bottom:20px; max-width:340px; margin-left:auto; margin-right:auto;">
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
      style="display:flex; align-items:center; justify-content:space-between; margin-top:16px;"
      x-show="$store.wizard.currentStep < 7"
    >
      <button
        type="button"
        x-on:click="$store.wizard.prevStep()"
        x-bind:disabled="$store.wizard.currentStep <= 1"
        style="display:inline-flex; align-items:center; gap:7px; padding:10px 18px; font-size:13px; font-weight:500; color:#78716C; background:transparent; border:1px solid rgba(240,197,137,0.6); border-radius:9999px; cursor:pointer; transition:border-color 0.15s ease, color 0.15s ease; text-decoration:none;"
        onmouseover="if(!this.disabled){this.style.borderColor='rgba(240,197,137,1)'; this.style.color='#1C1917';}"
        onmouseout="this.style.borderColor='rgba(240,197,137,0.6)'; this.style.color='#78716C';"
      >
        <Icon name={ICONS.arrowLeft} size={14} />
        Back
      </button>

      <button
        type="button"
        x-on:click="$store.wizard.nextStep()"
        x-bind:disabled="!$store.wizard.canProceed"
        style="display:inline-flex; align-items:center; gap:7px; padding:10px 22px; font-size:13px; font-weight:500; color:white; background:linear-gradient(135deg,#F97316,#EA6C0A); border:none; border-radius:9999px; cursor:pointer; transition:opacity 0.15s ease; box-shadow:rgba(249,115,22,0.25) 0px 4px 12px 0px;"
        x-bind:style="!$store.wizard.canProceed ? 'opacity:0.45; cursor:not-allowed;' : 'opacity:1;'"
      >
        <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay' : 'Next'">Next</span>
        <Icon name={ICONS.arrowRight} size={14} />
      </button>
    </div>
  </div>
)
