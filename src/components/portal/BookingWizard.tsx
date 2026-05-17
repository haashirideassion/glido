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
  { label: 'Get started',       tip: 'Tell us who is visiting and how many shipments you need slots for today.' },
  { label: 'Service type',      tip: 'Are you picking up cargo from, or dropping it off at the CFS?' },
  { label: 'Pick a slot',       tip: 'Choose your arrival window. Slots are held for 10 minutes while you finish.' },
  { label: 'Confirm your hold', tip: 'Your slot is reserved. Complete the booking before the timer runs out.' },
  { label: 'Shipment details',  tip: 'Enter your HBL or container reference. ICS status is checked automatically.' },
  { label: 'Documents',         tip: 'Upload arrival notices and any customs paperwork for your shipment.' },
  { label: 'Contact & vehicle', tip: 'Who is driving, and what is the vehicle registration plate?' },
]

/* ── Per-step inline SVG illustrations ─────────────────────────────────── */
const Illus1 = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:130px;height:130px;display:block;">
    <rect x="8"  y="82" width="104" height="28" rx="6" fill="rgba(252,101,20,0.82)"/>
    <rect x="16" y="56" width="88"  height="27" rx="6" fill="rgba(252,101,20,0.48)"/>
    <rect x="28" y="30" width="64"  height="27" rx="6" fill="rgba(252,101,20,0.22)"/>
    <line x1="20" y1="93" x2="78" y2="93" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="28" y1="67" x2="72" y2="67" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="96" cy="96" r="13" fill="rgba(252,101,20,1)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <line x1="96" y1="90" x2="96" y2="102" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="90" y1="96" x2="102" y2="96" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
)

const Illus2 = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:130px;height:130px;display:block;">
    <rect x="35" y="42" width="50" height="38" rx="5" fill="rgba(252,101,20,0.28)" stroke="rgba(252,101,20,0.55)" stroke-width="1.5"/>
    <line x1="60" y1="40" x2="60" y2="18" stroke="rgba(252,101,20,0.90)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M51 27 L60 17 L69 27" fill="none" stroke="rgba(252,101,20,0.90)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="60" y1="82" x2="60" y2="104" stroke="rgba(238,234,228,0.65)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M51 95 L60 105 L69 95" fill="none" stroke="rgba(238,234,228,0.65)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="26" cy="27" r="8" fill="rgba(252,101,20,0.18)" stroke="rgba(252,101,20,0.40)" stroke-width="1"/>
    <circle cx="94" cy="93" r="8" fill="rgba(238,234,228,0.08)" stroke="rgba(238,234,228,0.22)" stroke-width="1"/>
    <line x1="8" y1="60" x2="22" y2="60" stroke="rgba(252,101,20,0.25)" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="98" y1="60" x2="112" y2="60" stroke="rgba(238,234,228,0.20)" stroke-width="1" stroke-dasharray="2 2"/>
  </svg>
)

const Illus3 = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:130px;height:130px;display:block;">
    <rect x="10" y="20" width="100" height="88" rx="9" fill="rgba(255,255,255,0.04)" stroke="rgba(252,101,20,0.28)" stroke-width="1.5"/>
    <rect x="10" y="20" width="100" height="25" rx="9" fill="rgba(252,101,20,0.25)"/>
    <line x1="38" y1="13" x2="38" y2="27" stroke="rgba(252,101,20,0.80)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="82" y1="13" x2="82" y2="27" stroke="rgba(252,101,20,0.80)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="28" cy="59" r="5"   fill="rgba(255,255,255,0.14)"/>
    <circle cx="47" cy="59" r="5"   fill="rgba(255,255,255,0.14)"/>
    <circle cx="60" cy="59" r="8.5" fill="rgba(252,101,20,0.92)"/>
    <circle cx="74" cy="59" r="5"   fill="rgba(255,255,255,0.14)"/>
    <circle cx="93" cy="59" r="5"   fill="rgba(255,255,255,0.09)"/>
    <circle cx="28" cy="79" r="4"   fill="rgba(255,255,255,0.08)"/>
    <circle cx="47" cy="79" r="4"   fill="rgba(255,255,255,0.08)"/>
    <circle cx="60" cy="79" r="4"   fill="rgba(255,255,255,0.08)"/>
    <circle cx="74" cy="79" r="4"   fill="rgba(255,255,255,0.08)"/>
    <circle cx="93" cy="79" r="4"   fill="rgba(255,255,255,0.08)"/>
    <circle cx="28" cy="97" r="3.5" fill="rgba(255,255,255,0.04)"/>
    <circle cx="47" cy="97" r="3.5" fill="rgba(255,255,255,0.04)"/>
    <circle cx="60" cy="97" r="3.5" fill="rgba(255,255,255,0.04)"/>
    <circle cx="74" cy="97" r="3.5" fill="rgba(255,255,255,0.04)"/>
    <circle cx="93" cy="97" r="3.5" fill="rgba(255,255,255,0.04)"/>
  </svg>
)

const Illus4 = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:130px;height:130px;display:block;">
    <circle cx="60" cy="60" r="50" fill="rgba(252,101,20,0.05)" stroke="rgba(252,101,20,0.16)" stroke-width="1" stroke-dasharray="5 4"/>
    <circle cx="60" cy="60" r="37" fill="rgba(252,101,20,0.10)" stroke="rgba(252,101,20,0.35)" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="37" fill="none" stroke="rgba(252,101,20,0.82)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="160 232" transform="rotate(-90 60 60)"/>
    <rect x="46" y="64" width="28" height="20" rx="4" fill="rgba(252,101,20,0.82)"/>
    <path d="M51 64 L51 55 Q51 47 60 47 Q69 47 69 55 L69 64" fill="none" stroke="rgba(252,101,20,0.82)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="73" r="3.5" fill="rgba(255,255,255,0.38)"/>
    <line x1="60" y1="77" x2="60" y2="80" stroke="rgba(255,255,255,0.38)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
)

const Illus5 = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:130px;height:130px;display:block;">
    <rect x="22" y="12" width="76" height="96" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(252,101,20,0.26)" stroke-width="1.5"/>
    <rect x="22" y="12" width="76" height="22" rx="7" fill="rgba(252,101,20,0.26)"/>
    <rect x="34" y="47" width="52" height="5"  rx="2.5" fill="rgba(252,101,20,0.80)"/>
    <rect x="34" y="58" width="36" height="4"  rx="2"   fill="rgba(255,255,255,0.22)"/>
    <rect x="34" y="68" width="48" height="4"  rx="2"   fill="rgba(255,255,255,0.15)"/>
    <rect x="34" y="78" width="28" height="4"  rx="2"   fill="rgba(255,255,255,0.10)"/>
    <rect x="30" y="90" width="60" height="12" rx="3"   fill="rgba(252,101,20,0.12)" stroke="rgba(252,101,20,0.28)" stroke-width="1"/>
    <line x1="38" y1="93" x2="38" y2="99" stroke="rgba(252,101,20,0.65)" stroke-width="1.5"/>
    <line x1="42" y1="93" x2="42" y2="99" stroke="rgba(252,101,20,0.45)" stroke-width="1"/>
    <line x1="46" y1="93" x2="46" y2="99" stroke="rgba(252,101,20,0.65)" stroke-width="2"/>
    <line x1="51" y1="93" x2="51" y2="99" stroke="rgba(252,101,20,0.50)" stroke-width="1"/>
    <line x1="56" y1="93" x2="56" y2="99" stroke="rgba(252,101,20,0.65)" stroke-width="1.5"/>
    <line x1="61" y1="93" x2="61" y2="99" stroke="rgba(252,101,20,0.40)" stroke-width="2"/>
    <line x1="66" y1="93" x2="66" y2="99" stroke="rgba(252,101,20,0.65)" stroke-width="1"/>
    <line x1="71" y1="93" x2="71" y2="99" stroke="rgba(252,101,20,0.50)" stroke-width="1.5"/>
    <line x1="76" y1="93" x2="76" y2="99" stroke="rgba(252,101,20,0.65)" stroke-width="2"/>
    <line x1="80" y1="93" x2="80" y2="99" stroke="rgba(252,101,20,0.40)" stroke-width="1"/>
  </svg>
)

const Illus6 = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:130px;height:130px;display:block;">
    <rect x="30" y="30" width="66" height="82" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.10)" stroke-width="1.5" transform="rotate(-7 60 70)"/>
    <rect x="24" y="22" width="68" height="83" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(252,101,20,0.20)" stroke-width="1.5" transform="rotate(-3 60 65)"/>
    <rect x="18" y="14" width="70" height="86" rx="6" fill="rgba(252,101,20,0.12)" stroke="rgba(252,101,20,0.42)" stroke-width="1.5"/>
    <rect x="30" y="33" width="46" height="5"  rx="2.5" fill="rgba(252,101,20,0.70)"/>
    <rect x="30" y="44" width="32" height="4"  rx="2"   fill="rgba(255,255,255,0.18)"/>
    <rect x="30" y="54" width="40" height="4"  rx="2"   fill="rgba(255,255,255,0.12)"/>
    <circle cx="94" cy="28" r="16" fill="rgba(252,101,20,0.88)"/>
    <line x1="94" y1="35" x2="94" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M87 26 L94 19 L101 26" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

const Illus7 = () => (
  <svg viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:150px;height:115px;display:block;">
    <rect x="6"  y="28" width="74" height="48" rx="5" fill="rgba(252,101,20,0.72)"/>
    <rect x="80" y="44" width="40" height="32" rx="5" fill="rgba(252,101,20,0.52)"/>
    <rect x="86" y="49" width="26" height="14" rx="3" fill="rgba(238,234,228,0.22)"/>
    <path d="M80 44 Q80 36 89 36 L112 36 Q120 36 120 44" fill="rgba(252,101,20,0.36)"/>
    <circle cx="30" cy="81" r="10" fill="#1A0F07" stroke="rgba(252,101,20,0.65)" stroke-width="2.5"/>
    <circle cx="30" cy="81" r="4.5" fill="rgba(252,101,20,0.52)"/>
    <circle cx="70" cy="81" r="10" fill="#1A0F07" stroke="rgba(252,101,20,0.65)" stroke-width="2.5"/>
    <circle cx="70" cy="81" r="4.5" fill="rgba(252,101,20,0.52)"/>
    <circle cx="104" cy="82" r="9"  fill="#1A0F07" stroke="rgba(252,101,20,0.55)" stroke-width="2.5"/>
    <circle cx="104" cy="82" r="4"  fill="rgba(252,101,20,0.40)"/>
    <line x1="0" y1="92" x2="130" y2="92" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <circle cx="120" cy="62" r="4" fill="rgba(255,230,120,0.82)"/>
    <line x1="0" y1="30" x2="6" y2="30" stroke="rgba(252,101,20,0.30)" stroke-width="1" stroke-dasharray="2 3"/>
  </svg>
)

const ILLUS = [Illus1, Illus2, Illus3, Illus4, Illus5, Illus6, Illus7]

export const BookingWizard = () => (
  <div x-data="{}" style="display:flex; flex-direction:column; min-height:calc(100vh - 148px);">

    {/* ═══════════════════════════════════════════════════════════════════
        SPLIT BODY
    ═══════════════════════════════════════════════════════════════════ */}
    <div x-show="$store.wizard.currentStep !== 8" x-cloak style="display:flex; flex:1; min-height:0;">

      {/* ── LEFT CONTEXT PANEL ──────────────────────────────────────── */}
      <div
        style="width:38%; min-width:280px; background:linear-gradient(155deg,#1A0F07 0%,#2D1A0E 55%,#1A0F07 100%); display:flex; flex-direction:column; padding:44px 38px 32px; position:relative; overflow:hidden; flex-shrink:0;"
      >
        {/* Ambient orbs */}
        <div style="position:absolute; bottom:-90px; right:-60px; width:280px; height:280px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.22) 0%, transparent 65%); pointer-events:none;" />
        <div style="position:absolute; top:-50px; left:-50px; width:180px; height:180px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.12) 0%, transparent 65%); pointer-events:none;" />
        <div style="position:absolute; top:40%; right:-30px; width:120px; height:120px; border-radius:9999px; background:radial-gradient(circle, rgba(252,101,20,0.08) 0%, transparent 70%); pointer-events:none;" />

        {/* Step number (big faded) */}
        <div style="position:relative; z-index:1; margin-bottom:4px;">
          <span style="font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(252,101,20,0.50); display:block; margin-bottom:0px;">Step</span>
          <span
            style="font-size:88px; font-weight:800; color:rgba(252,101,20,0.16); line-height:0.95; display:block; letter-spacing:-0.04em; font-variant-numeric:tabular-nums;"
            x-text="$store.wizard.currentStep"
          />
        </div>

        {/* Illustration — one per step, all overlaid, x-show shows correct one */}
        <div
          id="wiz-illus"
          style="flex:1; display:flex; align-items:center; justify-content:center; position:relative; z-index:1; min-height:140px;"
          x-init={`$watch('$store.wizard.currentStep', function() {
            var il = document.getElementById('wiz-illus');
            if (il) il.animate([{opacity:0,transform:'scale(0.86) translateY(12px)'},{opacity:1,transform:'scale(1) translateY(0)'}], {duration:400,easing:'cubic-bezier(0.16,1,0.3,1)'});
          })`}
        >
          {ILLUS.map((IllusComp, i) => (
            <div
              key={i}
              x-show={`$store.wizard.currentStep === ${i + 1}`}
              x-cloak
              style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;"
            >
              <IllusComp />
            </div>
          ))}
        </div>

        {/* Step name + tip */}
        <div style="position:relative; z-index:1; margin-bottom:24px;">
          {STEP_CTX.map((ctx, i) => (
            <div key={i} x-show={`$store.wizard.currentStep === ${i + 1}`} x-cloak>
              <p style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:-0.02em; margin-bottom:7px; line-height:1.25;">{ctx.label}</p>
              <p style="font-size:12px; color:rgba(255,255,255,0.38); line-height:1.65; max-width:220px;">{ctx.tip}</p>
            </div>
          ))}

          {/* Hold timer (steps 5+) */}
          <div
            x-show="$store.wizard.currentStep > 4 && $store.wizard.holdActive"
            x-cloak
            style="margin-top:12px; display:inline-flex; align-items:center; gap:7px; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:600;"
            x-bind:style="$store.wizard.holdExpiring ? 'background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.22); color:#EF4444;' : 'background:rgba(252,101,20,0.10); border:1px solid rgba(252,101,20,0.20); color:rgba(252,101,20,0.80);'"
          >
            <Icon name={ICONS.clock} size={11} style="flex-shrink:0;" />
            <span>Slot held · <span style="font-family:ui-monospace,monospace; font-weight:700;" x-text="$store.wizard.holdMinutes + ':' + $store.wizard.holdSeconds" /></span>
          </div>
        </div>

        {/* Progress pills */}
        <div style="display:flex; gap:5px; position:relative; z-index:1;">
          {[1,2,3,4,5,6,7].map(n => (
            <div
              key={n}
              style="height:3px; border-radius:9999px; transition:all 0.38s cubic-bezier(0.16,1,0.3,1);"
              x-bind:style={`$store.wizard.currentStep === ${n} ? 'background:#FC6514; width:28px; flex-shrink:0;' : $store.wizard.currentStep > ${n} ? 'background:rgba(252,101,20,0.42); width:14px; flex-shrink:0;' : 'background:rgba(255,255,255,0.14); width:14px; flex-shrink:0;'`}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ────────────────────────────────────────── */}
      <div
        style="flex:1; overflow-y:auto; padding:52px 60px 36px; background:#FFFFFF;"
        x-init={`$watch('$store.wizard.currentStep', function() {
          $el.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],
            {duration:300,easing:'cubic-bezier(0.16,1,0.3,1)'});
        })`}
      >
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
        FOOTER — Back (left) · step counter (center) · Continue (right)
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep !== 8"
      x-cloak
      style="flex-shrink:0; display:flex; align-items:center; justify-content:space-between; padding:14px 40px 16px; border-top:1px solid rgba(0,0,0,0.07); background:#FFFFFF;"
    >
      {/* Back */}
      <button
        type="button"
        x-on:click="$store.wizard.prevStep()"
        x-bind:disabled="$store.wizard.currentStep === 1"
        x-bind:style="$store.wizard.currentStep === 1 ? 'opacity:0; pointer-events:none; visibility:hidden;' : 'opacity:1;'"
        class="btn-ghost"
        style="padding:9px 22px; font-size:13px; gap:6px; border-radius:9999px; min-width:100px;"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
          <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back
      </button>

      {/* Step counter */}
      <span style="font-size:11px; font-weight:500; color:#A8A29E; font-variant-numeric:tabular-nums; letter-spacing:0.02em;">
        <span x-text="$store.wizard.currentStep" /> <span style="opacity:0.5;">/ 7</span>
      </span>

      {/* Continue */}
      <button
        type="button"
        x-on:click="$store.wizard.nextStep()"
        x-bind:disabled="!$store.wizard.canProceed"
        class="btn-primary"
        style="padding:9px 26px; font-size:13px; min-width:150px; justify-content:center; gap:6px; border-radius:9999px;"
        x-bind:style="!$store.wizard.canProceed ? 'filter:grayscale(1) opacity(0.28); cursor:not-allowed; pointer-events:none;' : ''"
      >
        <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay' : 'Continue'">Continue</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
          <path d="M4.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    {/* ═══════════════════════════════════════════════════════════════════
        STEP 8 — Booking confirmed
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep === 8"
      x-cloak
      style="flex:1; display:flex; align-items:center; justify-content:center; padding:60px 28px; background:#FFFFFF;"
    >
      <div style="max-width:380px; width:100%; text-align:center;">
        <div style="width:56px; height:56px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 22px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 24px rgba(252,101,20,0.50), 0 1px 3px rgba(0,0,0,0.45);">
          <Icon name={ICONS.check} size={26} style="color:white;" />
        </div>

        <h2 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; margin-bottom:6px;">Booking Confirmed</h2>
        <p style="font-size:13px; color:#78716C; margin-bottom:28px; line-height:1.6;">Your QR code is ready — screenshot or print it before arriving at the depot.</p>

        <div style="display:inline-block; background:rgba(252,101,20,0.06); border:1px solid rgba(252,101,20,0.18); border-radius:10px; padding:10px 28px; margin-bottom:24px;">
          <p style="font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(252,101,20,0.55); margin-bottom:3px;">Reference</p>
          <p style="font-family:ui-monospace,monospace; font-size:19px; font-weight:700; color:#FC6514; letter-spacing:0.05em;" x-text="$store.wizard.confirmationRef" />
        </div>

        <div style="width:144px; height:144px; border:1.5px dashed rgba(0,0,0,0.10); border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 24px; background:rgba(0,0,0,0.02);">
          <Icon name={ICONS.qrCode} size={44} style="color:rgba(0,0,0,0.16); margin-bottom:6px;" />
          <p style="font-size:11px; color:#A8A29E;">Scan at kiosk</p>
        </div>

        <div style="background:#F7F4F0; border:1px solid rgba(0,0,0,0.07); border-radius:12px; padding:16px 20px; text-align:left; margin-bottom:24px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px 20px;">
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Service</p>
              <p style="font-size:13px; font-weight:600; color:#1C1917;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off'" />
            </div>
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Load</p>
              <p style="font-size:13px; font-weight:600; color:#1C1917;" x-text="($store.wizard.loadType || '—').toUpperCase()" />
            </div>
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Slot</p>
              <p style="font-size:13px; font-weight:600; color:#1C1917;" x-text="$store.wizard.selectedSlotLabel || '—'" />
            </div>
            <div>
              <p style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#A8A29E; margin-bottom:3px;">Driver</p>
              <p style="font-size:13px; font-weight:600; color:#1C1917;" x-text="$store.wizard.driverName || $store.wizard.guestName || '—'" />
            </div>
          </div>
        </div>

        <button
          type="button"
          class="btn-ghost"
          style="font-size:13px; padding:9px 20px; border-radius:9999px;"
          x-on:click="$store.wizard.reset(); window.location.href = '/book'"
        >
          Book another visit
        </button>
      </div>
    </div>

  </div>
)
