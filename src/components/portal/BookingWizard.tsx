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
  { label: 'Get started',      shortLabel: 'Slots',        icon: ICONS.users,     tip: 'Tell us who is visiting and how many slots you need today.' },
  { label: 'Service type',     shortLabel: 'Service Type', icon: ICONS.cargo,     tip: 'Are you picking up cargo from, or dropping it off at the CFS?' },
  { label: 'Cargo type',       shortLabel: 'Load Type',    icon: ICONS.container, tip: 'Select whether your shipment is FCL or LCL.' },
  { label: 'Choose a slot',    shortLabel: 'Time Slot',    icon: ICONS.clock,     tip: 'Select your arrival window. Slots are held for 10 minutes.' },
  { label: 'Shipment details', shortLabel: 'Details',      icon: ICONS.document,  tip: 'Enter your HBL or container reference. ICS status is checked automatically.' },
  { label: 'Documents',        shortLabel: 'Document',     icon: ICONS.upload,    tip: 'Upload your Delivery Order and any required customs paperwork.' },
  { label: 'Review & pay',     shortLabel: 'Payment',      icon: ICONS.shield,    tip: 'Review your booking details and complete payment to confirm your slot.' },
]

export const BookingWizard = () => (
  <div x-data="{}" id="wizard-root" style="background:#fff; min-height:calc(100vh - 56px - 74px);">

    {/* ── Mobile & responsive overrides ────────────────────────────────── */}
    <style dangerouslySetInnerHTML={{ __html: `
      /* ── Red Hat Display for the entire /book page ── */
      body, body * {
        font-family: 'Red Hat Display', ui-sans-serif, system-ui, sans-serif !important;
      }

      /* ── Roboto Condensed digits only (unicode-range trick, one block per weight) ── */
      @font-face {
        font-family: 'RC-Digits';
        src: url(https://fonts.gstatic.com/s/robotocondensed/v31/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQk6YvM.woff2) format('woff2');
        font-weight: 400;
        font-display: swap;
        unicode-range: U+0030-0039, U+003A;
      }
      @font-face {
        font-family: 'RC-Digits';
        src: url(https://fonts.gstatic.com/s/robotocondensed/v31/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQk6YvM.woff2) format('woff2');
        font-weight: 600;
        font-display: swap;
        unicode-range: U+0030-0039, U+003A;
      }
      @font-face {
        font-family: 'RC-Digits';
        src: url(https://fonts.gstatic.com/s/robotocondensed/v31/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQk6YvM.woff2) format('woff2');
        font-weight: 700;
        font-display: swap;
        unicode-range: U+0030-0039, U+003A;
      }
      @font-face {
        font-family: 'RC-Digits';
        src: url(https://fonts.gstatic.com/s/robotocondensed/v31/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQk6YvM.woff2) format('woff2');
        font-weight: 800;
        font-display: swap;
        unicode-range: U+0030-0039, U+003A;
      }
      .slot-num {
        font-family: 'RC-Digits', 'Red Hat Display', ui-sans-serif, system-ui, sans-serif !important;
      }

      /* ── Step slide animation ── */
      @keyframes wiz-slide-fwd {
        from { opacity:0; transform:translateX(32px); }
        to   { opacity:1; transform:translateX(0);    }
      }
      @keyframes wiz-slide-bwd {
        from { opacity:0; transform:translateX(-32px); }
        to   { opacity:1; transform:translateX(0);     }
      }

      /* ── Slot grid ── */
      .slot-list-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px 12px;
      }
      @media (max-width:640px) {
        .slot-list-grid { grid-template-columns: repeat(2, 1fr); }
      }

      /* ── Step indicator circles + labels ── */
      .wiz-step-circle {
        width:56px; height:56px; border-radius:9999px;
        display:flex; align-items:center; justify-content:center;
        transition:all 0.25s ease;
        border:2.5px solid #E5E7EB; background:white; color:#D1D5DB;
        flex-shrink:0;
      }
      .wiz-step-label {
        font-size:13px; font-weight:400; letter-spacing:0;
        white-space:nowrap;
        transition:color 0.25s ease; color:#A8A29E;
      }

      /* ── Mobile layout ── */
      /* ── Hide site footer — shown inside the fixed wizard bar instead ── */
      body > footer { display:none !important; }

      /* ── Push content above the fixed wizard bar (nav 74px + site-footer 38px) ── */
      body { padding-bottom: 112px; }

      /* ── Step counter: show on desktop, hide on mobile ── */
      .wiz-step-counter { display:flex; }

      @media (max-width:600px) {
        .wiz-progress      { padding:24px 20px 20px !important; }
        .wiz-title-area    { margin-bottom:20px !important; }
        .wiz-title         { font-size:20px !important; margin-bottom:4px !important; }
        .wiz-subtitle      { font-size:12px !important; }
        .wiz-body          { padding:24px 20px 32px !important; }
        .wiz-slot-card     { padding:16px !important; margin-bottom:20px !important; }
        .wiz-step1-heading { font-size:18px !important; margin-bottom:4px !important; }
        /* Footer */
        body                   { padding-bottom: 102px !important; }
        .wiz-footer            { height:auto !important; }
        .wiz-nav-row           { height:64px !important; }
        .wiz-site-footer-inner { padding:7px 16px !important; }
        .wiz-site-footer-inner span { font-size:10px !important; }
        .wiz-site-footer-inner a    { font-size:10px !important; }
        .wiz-footer-inner  { padding:0 16px !important; gap:10px !important; }
        .wiz-step-counter  { display:none !important; }
        .wiz-btn-back      { flex:1 !important; min-width:0 !important;
                             padding:0 !important; height:44px !important;
                             font-size:13px !important; justify-content:center !important; }
        .wiz-btn-next      { flex:1 !important; min-width:0 !important;
                             padding:0 !important; height:44px !important;
                             font-size:13px !important; border-radius:12px !important;
                             justify-content:center !important; }
        /* Pills above footer — prevent overflow on small screens */
        .wiz-footer .wiz-pill-text { font-size:11px !important; }
        /* 16px prevents iOS Safari from zooming on input focus */
        .wizard-field      { font-size:16px !important; height:48px !important; }
        textarea.wizard-field { height:auto !important; }
      }
      @media (max-width:480px) {
        .wiz-step-circle   { width:34px !important; height:34px !important; }
        .wiz-step-circle svg { width:14px !important; height:14px !important; }
        .wiz-step-label    { display:none !important; }
        .wiz-conn          { margin-top:17px !important; min-width:4px !important; border-top-width:2px !important; }
      }
    `}} />

    {/* ── Flex column container — ensures footer always reaches viewport bottom ── */}
    <div style="min-height:calc(100vh - 56px); display:flex; flex-direction:column;">

    {/* ═══════════════════════════════════════════════════════════════════
        WHITE HEADER PANEL — title + stepper, full-width white section
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep !== 8"
      class="wiz-progress"
      style="position:relative; overflow:hidden; background:linear-gradient(to right, rgba(250,115,21,0.10), rgba(255,255,255,0.05), rgba(254,230,212,0.005), rgba(250,115,21,0.03)), #fff; padding:48px 60px 44px; margin-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.055); box-shadow:0 4px 16px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03);"
    >

      {/* ── Left grid pattern — solid on left edge, fades to 10% on the right ── */}
      <div style="position:absolute; left:0; top:0; bottom:0; width:380px; pointer-events:none; z-index:0; -webkit-mask-image:linear-gradient(to right, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 100%); mask-image:linear-gradient(to right, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 100%);">
        <svg width="497" height="418" viewBox="0 0 497 418" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute; left:0; top:50%; transform:translateY(-50%);">
          <g opacity="0.22">
            <line x1="495.384" y1="0.5" x2="-157" y2="0.499964" stroke="black"/>
            <line x1="495.384" y1="84.1426" x2="-157" y2="84.1425" stroke="black"/>
            <line x1="29.8955" y1="2.18557e-08" x2="29.8955" y2="417" stroke="black"/>
            <line x1="495.384" y1="167.785" x2="-157" y2="167.785" stroke="black"/>
            <line x1="123.093" y1="2.18557e-08" x2="123.093" y2="417" stroke="black"/>
            <line x1="495.384" y1="251.427" x2="-157" y2="251.427" stroke="black"/>
            <line x1="216.291" y1="2.18557e-08" x2="216.291" y2="417" stroke="black"/>
            <line x1="495.384" y1="333.858" x2="-157" y2="333.858" stroke="black"/>
            <line x1="309.489" y1="2.18557e-08" x2="309.489" y2="417" stroke="black"/>
            <line x1="495.384" y1="417.5" x2="-157" y2="417.5" stroke="black"/>
            <line x1="402.686" y1="2.18557e-08" x2="402.686" y2="417" stroke="black"/>
            <line x1="495.884" y1="2.18557e-08" x2="495.884" y2="417" stroke="black"/>
          </g>
        </svg>
      </div>

      {/* ── Right grid pattern — solid on right edge, fades to 10% on the left ── */}
      <div style="position:absolute; right:0; top:0; bottom:0; width:380px; pointer-events:none; z-index:0; -webkit-mask-image:linear-gradient(to left, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 100%); mask-image:linear-gradient(to left, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 100%);">
        <svg width="497" height="418" viewBox="0 0 497 418" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute; right:0; top:50%; transform:translateY(-50%);">
          <g opacity="0.22">
            <line x1="495.384" y1="0.5" x2="-157" y2="0.499964" stroke="black"/>
            <line x1="495.384" y1="84.1426" x2="-157" y2="84.1425" stroke="black"/>
            <line x1="29.8955" y1="2.18557e-08" x2="29.8955" y2="417" stroke="black"/>
            <line x1="495.384" y1="167.785" x2="-157" y2="167.785" stroke="black"/>
            <line x1="123.093" y1="2.18557e-08" x2="123.093" y2="417" stroke="black"/>
            <line x1="495.384" y1="251.427" x2="-157" y2="251.427" stroke="black"/>
            <line x1="216.291" y1="2.18557e-08" x2="216.291" y2="417" stroke="black"/>
            <line x1="495.384" y1="333.858" x2="-157" y2="333.858" stroke="black"/>
            <line x1="309.489" y1="2.18557e-08" x2="309.489" y2="417" stroke="black"/>
            <line x1="495.384" y1="417.5" x2="-157" y2="417.5" stroke="black"/>
            <line x1="402.686" y1="2.18557e-08" x2="402.686" y2="417" stroke="black"/>
            <line x1="495.884" y1="2.18557e-08" x2="495.884" y2="417" stroke="black"/>
          </g>
        </svg>
      </div>

      {/* Title + subtitle */}
      <div class="wiz-title-area" style="position:relative; z-index:1; text-align:center; margin-bottom:40px;">
        <h1 class="wiz-title" style="font-size:36px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.15; margin-bottom:10px;">Visitor Booking</h1>
        <p class="wiz-subtitle" style="font-size:14px; color:#78716C; line-height:1.6; max-width:480px; margin:0 auto;">Complete your booking now to ensure you get the exact date and time that works for you</p>
      </div>

      {/* Stepper row — space-between spreads circles across the full width */}
      <div style="position:relative; z-index:1; display:flex; align-items:flex-start; justify-content:space-between; max-width:1000px; margin:0 auto;">
        {STEP_CTX.flatMap((ctx, i) => {
          const n = i + 1
          const els: any[] = []

          /* ── dotted connector before every step except the first ── */
          if (i > 0) {
            els.push(
              <div
                key={`conn-${n}`}
                class="wiz-conn"
                style={`flex:1; height:0; border-top:3px solid #E5E7EB; margin-top:27px; min-width:8px; transition:border-top-color 0.3s ease;`}
                x-bind:style={`{ borderTopColor: $store.wizard.currentStep > ${n - 1} ? '#FC6514' : '#E5E7EB' }`}
              />
            )
          }

          /* ── step circle + short label ── */
          els.push(
            <div key={`step-${n}`} style="display:flex; flex-direction:column; align-items:center; gap:10px; flex-shrink:0;">
              <div
                class="wiz-step-circle"
                x-bind:style={`{
                  background:  $store.wizard.currentStep === ${n} ? 'rgba(252,101,20,0.5)' : 'white',
                  borderColor: $store.wizard.currentStep >= ${n} ? '#FC6514' : '#E5E7EB',
                  color:       $store.wizard.currentStep > ${n} ? '#FC6514' : ($store.wizard.currentStep === ${n} ? 'white' : '#D1D5DB'),
                  boxShadow:   $store.wizard.currentStep === ${n} ? '0 4px 16px rgba(252,101,20,0.35)' : 'none'
                }`}
              >
                <Icon name={ctx.icon} size={24} />
              </div>
              <span
                class="wiz-step-label"
                x-bind:style={`{ color: $store.wizard.currentStep >= ${n} ? '#FC6514' : '#A8A29E', fontWeight: $store.wizard.currentStep === ${n} ? '700' : '400' }`}
              >{ctx.shortLabel}</span>
            </div>
          )

          return els
        })}
      </div>
    </div>

    {/* ═══════════════════════════════════════════════════════════════════
        WHITE CARD — form body + footer
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep !== 8"
      style="background:#fff; min-height:60vh;"
    >
      <div
        id="wizard-step-body"
        class="wiz-body"
        style="flex:1; max-width:1000px; margin:0 auto; padding:48px 0 96px; overflow:hidden;"
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
        <Step1ServiceType />
        <Step2SlotPicker />
        <Step3HoldConfirm />
        <Step4ShipmentDetails />
        <Step5Documents />
        <Step6ContactVehicle />
        <Step7Confirmation />
      </div>

    </div>{/* /white card */}
    </div>{/* /flex column wrapper */}

    {/* ── Footer — direct child of #wizard-root, outside white card ── */}
    <div
      class="wiz-footer"
      style="position:fixed; bottom:0; left:0; right:0; z-index:20; background:rgba(255,255,255,0.97); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-top:1px solid #f0f0f0; display:flex; flex-direction:column; box-sizing:border-box; overflow:visible;"
    >
      {/* ── Nav row (74px tall) — pills float above this row ── */}
      <div class="wiz-nav-row" style="position:relative; height:74px; display:flex; align-items:center; flex-shrink:0;">

        {/* Hold timer pill */}
        <div
          x-show="$store.wizard.currentStep > 4 && $store.wizard.holdActive"
          x-cloak
          style="position:absolute; bottom:100%; left:50%; transform:translateX(-50%); padding-bottom:10px; pointer-events:none;"
        >
          <div
            style="display:inline-flex; align-items:center; gap:8px; padding:7px 20px; border-radius:9999px; background:#fff; box-shadow:0 4px 18px rgba(0,0,0,0.09), 0 2px 8px rgba(252,101,20,0.12); white-space:nowrap;"
            x-bind:style="{ border: $store.wizard.holdExpiring ? '1.5px solid rgba(239,68,68,0.35)' : '1.5px solid rgba(252,101,20,0.28)' }"
          >
            <Icon name={ICONS.clock} size={13} style="flex-shrink:0;" x-bind:style="{ color: $store.wizard.holdExpiring ? '#EF4444' : '#FC6514' }" />
            <span
              style="font-size:13px; font-weight:700;"
              x-bind:style="{ color: $store.wizard.holdExpiring ? '#EF4444' : '#1C1917' }"
            >Slot held · <span style="font-family:ui-monospace,monospace;" x-text="$store.wizard.holdMinutes + ':' + $store.wizard.holdSeconds" /></span>
          </div>
        </div>

        {/* Multi-slot pill */}
        <div
          x-show="$store.wizard.currentStep === 1 && $store.wizard.slotCount > 1"
          x-cloak
          style="position:absolute; bottom:100%; left:50%; transform:translateX(-50%); padding-bottom:10px; pointer-events:none;"
        >
          <div style="display:inline-flex; align-items:center; gap:10px; padding:7px 20px; border-radius:9999px; background:#fff; border:1.5px solid rgba(252,101,20,0.28); box-shadow:0 4px 18px rgba(0,0,0,0.09), 0 2px 8px rgba(252,101,20,0.12); white-space:nowrap;">
            <span style="width:7px; height:7px; border-radius:9999px; background:#FC6514; flex-shrink:0;" />
            <span style="font-size:13px; font-weight:700; color:#1C1917;"><span x-text="$store.wizard.slotCount" /> slots — you'll enter shipment details for each one separately.</span>
          </div>
        </div>

        {/* Selected slot pill */}
        <div
          x-show="$store.wizard.currentStep === 4 && $store.wizard.selectedSlotId !== null"
          x-cloak
          style="position:absolute; bottom:100%; left:50%; transform:translateX(-50%); padding-bottom:10px; pointer-events:none;"
        >
          <div style="display:inline-flex; align-items:center; gap:10px; padding:7px 20px; border-radius:9999px; background:#fff; border:1.5px solid rgba(252,101,20,0.28); box-shadow:0 4px 18px rgba(0,0,0,0.09), 0 2px 8px rgba(252,101,20,0.12); white-space:nowrap;">
            <span style="width:7px; height:7px; border-radius:9999px; background:#FC6514; flex-shrink:0;" />
            <span style="font-size:13px; font-weight:700; color:#1C1917;" x-text="$store.wizard.selectedSlotLabel" />
            <span style="font-size:11px; color:#9CA3AF; background:rgba(0,0,0,0.05); border-radius:5px; padding:2px 7px; font-weight:500;">selected</span>
            <span style="font-size:11px; color:#FC6514; font-weight:600;">· 10-min hold on Next →</span>
          </div>
        </div>

        <div
          class="wiz-footer-inner"
          style="width:100%; max-width:1120px; margin:0 auto; padding:0 60px; display:flex; align-items:center; justify-content:space-between; gap:8px; box-sizing:border-box;"
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

          {/* Step counter — centred, hidden on mobile */}
          <div class="wiz-step-counter" style="text-align:center; flex-direction:column; align-items:center; gap:1px; flex-shrink:0;">
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
            style="padding:10px 24px; font-size:13px; min-width:130px; justify-content:center; flex-shrink:0; height:44px;"
            x-bind:style="{ filter: !$store.wizard.canProceed ? 'grayscale(1) opacity(0.28)' : 'none', cursor: !$store.wizard.canProceed ? 'not-allowed' : 'pointer', pointerEvents: !$store.wizard.canProceed ? 'none' : 'auto' }"
          >
            <span x-text="$store.wizard.currentStep === 6 ? 'Review & Submit' : 'Continue'">Continue</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;">
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>{/* /wiz-nav-row */}

      {/* ── Site footer row — below the nav buttons ── */}
      <div style="border-top:1px solid rgba(0,0,0,0.05); flex-shrink:0;" class="wiz-site-footer-row">
        <div style="width:100%; max-width:1120px; margin:0 auto; padding:9px 60px; display:flex; align-items:center; justify-content:space-between; box-sizing:border-box;" class="wiz-site-footer-inner">
          <span style="font-size:11px; color:#A8A29E;">© 2026 Glido CFS · Sydney Container Freight Station</span>
          <div style="display:flex; gap:18px;">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style="font-size:11px; color:#A8A29E; text-decoration:none; transition:color 0.15s ease;"
                onmouseover="this.style.color='#57534E';" onmouseout="this.style.color='#A8A29E';"
              >{l}</a>
            ))}
          </div>
        </div>
      </div>

    </div>{/* /wiz-footer */}

    {/* ═══════════════════════════════════════════════════════════════════
        STEP 8 — Booking confirmed  (keeps x-cloak — starts hidden)
    ═══════════════════════════════════════════════════════════════════ */}
    <div
      x-show="$store.wizard.currentStep === 8"
      x-cloak
      style="max-width:900px; margin:48px auto; background:#fff; border-radius:20px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.07); overflow:hidden; padding:52px 40px; display:flex; justify-content:center;"
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

    <script dangerouslySetInnerHTML={{ __html: `
      (function() {
        function teleportFooter() {
          var footer = document.querySelector('.wiz-footer');
          if (!footer) return;
          document.body.appendChild(footer);
        }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', teleportFooter);
        } else {
          teleportFooter();
        }
      })();
    `}} />

  </div>
)
