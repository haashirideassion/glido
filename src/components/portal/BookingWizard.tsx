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
  { label: 'Cargo type',       tip: 'Select whether your shipment is FCL or LCL.' },
  { label: 'Choose a slot',    tip: 'Select your arrival window. Slots are held for 10 minutes.' },
  { label: 'Shipment details', tip: 'Enter your HBL or container reference. ICS status is checked automatically.' },
  { label: 'Documents',        tip: 'Upload your Delivery Order and any required customs paperwork.' },
  { label: 'Review & pay',     tip: 'Review your booking details and complete payment to confirm your slot.' },
]

export const BookingWizard = () => (
  <div x-data="{}" id="wizard-root">

    {/* ── Mobile & responsive overrides ────────────────────────────────── */}
    <style>{`
      /* ── Step slide animation ── */
      @keyframes wiz-slide-fwd {
        from { opacity:0; transform:translateX(32px); }
        to   { opacity:1; transform:translateX(0);    }
      }
      @keyframes wiz-slide-bwd {
        from { opacity:0; transform:translateX(-32px); }
        to   { opacity:1; transform:translateX(0);     }
      }

      /* ── Mobile layout ── */
      @media (max-width:600px) {
        .wiz-progress  { padding:14px 20px 12px !important; }
        .wiz-body      { padding:24px 20px 28px !important; }
        .wiz-footer    { position:sticky !important; bottom:0 !important;
                         background:rgba(255,255,255,0.96) !important;
                         backdrop-filter:blur(12px) !important;
                         -webkit-backdrop-filter:blur(12px) !important; }
        .wiz-footer-inner { padding:0 16px !important; }
        .wiz-btn-back  { padding:13px 18px 13px 14px !important; }
        .wiz-btn-next  { flex:1 !important; padding:14px 20px !important;
                         font-size:14px !important; border-radius:14px !important;
                         justify-content:center !important; }
        /* 16px prevents iOS Safari from zooming on input focus */
        .wizard-field  { font-size:16px !important; height:48px !important; }
        textarea.wizard-field { height:auto !important; }
      }
    `}</style>

    {/* ═══════════════════════════════════════════════════════════════════
        PROGRESS STRIP  — no x-cloak so structure is instantly visible
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep !== 8"
      class="wiz-progress"
      style="padding:22px 48px 18px; border-bottom:1px solid #f0f0f0;"
    >
      {/* Step label */}
      <div style="margin-bottom:10px; max-width:560px; margin-left:auto; margin-right:auto; display:flex; align-items:center; justify-content:space-between;">
        <div>
          {STEP_CTX.map((ctx, i) => (
            <span key={i} x-show={`$store.wizard.currentStep === ${i + 1}`} x-cloak
              style="font-size:11.5px; font-weight:600; color:#57534E; letter-spacing:-0.01em;">
              {ctx.label}
            </span>
          ))}
        </div>
        <span style="font-size:11px; color:#A8A29E; font-variant-numeric:tabular-nums; font-weight:500;">
          <span x-text="$store.wizard.currentStep" /> / 7
        </span>
      </div>

      {/* 7-segment track */}
      <div style="display:flex; gap:4px; max-width:560px; margin:0 auto;">
        {[1,2,3,4,5,6,7].map(n => (
          <div key={n} style="flex:1; height:4px; border-radius:9999px; overflow:hidden; background:rgba(0,0,0,0.09);">
            <div
              style="height:100%; border-radius:9999px; background:#FC6514; transition:width 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;"
              x-bind:style={`{ width: $store.wizard.currentStep === ${n} ? '100%' : (Math.max(0,$store.wizard.currentStep-${n})!==0 ? '100%' : '0%'), opacity: $store.wizard.currentStep === ${n} ? 1 : (Math.max(0,$store.wizard.currentStep-${n})!==0 ? 0.5 : 0) }`}
            />
          </div>
        ))}
      </div>
    </div>

    {/* ═══════════════════════════════════════════════════════════════════
        FORM BODY  — no x-cloak on outer wrapper
    ═══════════════════════════════════════════════════════════════════ */}
    <div x-show="$store.wizard.currentStep !== 8">
      <div
        id="wizard-step-body"
        class="wiz-body"
        style="max-width:560px; margin:0 auto; padding:36px 40px 44px; overflow:hidden;"
        x-init={`$watch('$store.wizard.currentStep', function() {
          var dir = $store.wizard.stepDirection;
          $nextTick(function() {
            var fromX = dir >= 0 ? '32px' : '-32px';
            $el.animate(
              [
                { opacity: 0, transform: 'translateX(' + fromX + ')' },
                { opacity: 1, transform: 'translateX(0)' }
              ],
              { duration: 340, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'both' }
            );
          });
        })`}
      >
        {/* Hold timer badge — steps 5–7 */}
        <div
          x-show="Math.max(0, $store.wizard.currentStep - 4) !== 0 && $store.wizard.holdActive"
          x-cloak
          style="margin-bottom:16px; display:inline-flex; align-items:center; gap:7px; padding:5px 12px; border-radius:8px; font-size:11.5px; font-weight:600;"
          x-bind:style="{ background: $store.wizard.holdExpiring ? 'rgba(239,68,68,0.08)' : 'rgba(252,101,20,0.07)', border: $store.wizard.holdExpiring ? '1px solid rgba(239,68,68,0.18)' : '1px solid rgba(252,101,20,0.14)', color: $store.wizard.holdExpiring ? '#EF4444' : 'rgba(252,101,20,0.85)' }"
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
        FOOTER — sticky on mobile, no x-cloak
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep !== 8"
      class="wiz-footer"
      style="border-top:1px solid #f0f0f0; padding:14px 0 16px;"
    >
      <div
        class="wiz-footer-inner"
        style="max-width:560px; margin:0 auto; padding:0 40px; display:flex; align-items:center; justify-content:space-between; gap:8px;"
      >
        {/* Back */}
        <button
          type="button"
          x-on:click="$store.wizard.prevStep()"
          class="wiz-btn-back"
          x-bind:style="{ opacity: $store.wizard.currentStep === 1 ? 0 : 1, pointerEvents: $store.wizard.currentStep === 1 ? 'none' : 'auto' }"
          style="display:inline-flex; align-items:center; gap:6px; padding:9px 20px 9px 14px; font-size:13px; font-weight:600; color:#374151; border:1.5px solid #e5e7eb; border-radius:9999px; background:#fff; cursor:pointer; transition:all 0.15s ease; flex-shrink:0;"
          onmouseover="this.style.borderColor='#d1d5db'; this.style.background='#f9fafb';"
          onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='#fff';"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="flex-shrink:0;">
            <path d="M8.5 2.5L4.5 7l4 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>

        {/* Step counter — hidden on mobile to save space */}
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:1px; flex-shrink:0;" class="hidden sm:flex">
          {STEP_CTX.map((ctx, i) => (
            <span key={i} x-show={`$store.wizard.currentStep === ${i + 1}`} x-cloak
              style="font-size:12px; font-weight:600; color:#57534E; letter-spacing:-0.01em;">
              {ctx.label}
            </span>
          ))}
          <span style="font-size:10px; color:#A8A29E; font-variant-numeric:tabular-nums;">
            <span x-text="$store.wizard.currentStep" /> of 7
          </span>
        </div>

        {/* Continue */}
        <button
          type="button"
          x-on:click="$store.wizard.nextStep()"
          class="btn-primary wiz-btn-next"
          style="padding:10px 24px; font-size:13px; min-width:130px; justify-content:center; flex-shrink:0;"
          x-bind:style="{ filter: !$store.wizard.canProceed ? 'grayscale(1) opacity(0.28)' : 'none', cursor: !$store.wizard.canProceed ? 'not-allowed' : 'pointer', pointerEvents: !$store.wizard.canProceed ? 'none' : 'auto' }"
        >
          <span x-text="$store.wizard.currentStep === 6 ? 'Review & Submit' : 'Continue'">Continue</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
            <path d="M4.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    {/* ═══════════════════════════════════════════════════════════════════
        STEP 8 — Booking confirmed  (keeps x-cloak — starts hidden)
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

    {/* ── Touch swipe support (mobile only) ──────────────────────────── */}
    <script dangerouslySetInnerHTML={{ __html: `
      (function() {
        var body = document.getElementById('wizard-step-body');
        if (!body) return;
        var tx = 0, ty = 0, locked = false;

        body.addEventListener('touchstart', function(e) {
          tx = e.touches[0].clientX;
          ty = e.touches[0].clientY;
          locked = false;
        }, { passive: true });

        body.addEventListener('touchmove', function(e) {
          /* Lock to horizontal swipe — if vertical, ignore */
          if (!locked) {
            var dx = Math.abs(e.touches[0].clientX - tx);
            var dy = Math.abs(e.touches[0].clientY - ty);
            if (dy > dx) { locked = true; }
          }
        }, { passive: true });

        body.addEventListener('touchend', function(e) {
          if (locked) return;  /* vertical scroll — ignore */
          var dx = tx - e.changedTouches[0].clientX;
          if (Math.abs(dx) < 52) return;  /* too short — ignore */
          var store = window.Alpine && window.Alpine.store && window.Alpine.store('wizard');
          if (!store) return;
          if (dx > 0 && store.canProceed) {
            store.nextStep();  /* swipe left = next */
          } else if (dx < 0 && store.currentStep > 1) {
            store.prevStep();  /* swipe right = back */
          }
        }, { passive: true });
      })();
    `}} />

  </div>
)
