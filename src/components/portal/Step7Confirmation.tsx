import { Icon, ICONS } from '../../lib/Icon'

export const Step7Confirmation = () => (
  <div x-show="$store.wizard.currentStep === 7" x-cloak>

    {/* ── Step heading ── */}
    <div style="margin-bottom:24px;">
      <h2 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.2; margin-bottom:6px;"
        x-text="$store.wizard.paymentMethod === 'eft' ? 'Review &amp; Confirm' : 'Review &amp; Pay'"
      >Review &amp; Confirm</h2>
      <p style="font-size:14px; color:#78716C; line-height:1.5;"
        x-text="$store.wizard.paymentMethod === 'eft' ? 'Confirm your booking details. You will receive bank transfer instructions by email.' : 'Confirm your booking details and complete payment to secure your slot.'"
      >Confirm your booking details to secure your slot.</p>
    </div>

    {/* Hold timer banner */}
    <div x-show="$store.wizard.holdActive" x-cloak style="margin-bottom:20px;">
      <div
        style="display:flex; align-items:center; gap:12px; border-radius:10px; padding:12px 16px; font-size:13px; font-weight:500;"
        {...{"x-bind:style": "{ background: $store.wizard.holdExpiring ? 'rgba(239,68,68,0.10)' : 'rgba(252,101,20,0.08)', border: $store.wizard.holdExpiring ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(252,101,20,0.28)', color: $store.wizard.holdExpiring ? '#EF4444' : '#9A3412' }"}}
      >
        <Icon name={ICONS.clock} size={16} style="flex-shrink:0;" x-bind:style="{ color: $store.wizard.holdExpiring ? '#EF4444' : '#EA580C' }" />
        <span>
          Your slot is held for{' '}
          <span style="font-weight:700; font-family:ui-monospace,monospace;" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>.{' '}
          <span x-text="$store.wizard.paymentMethod === 'eft' ? 'Confirm your booking to secure it.' : 'Complete payment to secure it.'">Confirm your booking to secure it.</span>
        </span>
      </div>
    </div>

    {/* Booking summary */}
    <div style="background:#fff; border:1.5px solid #e5e7eb; border-radius:14px; padding:20px; margin-bottom:20px; font-size:13px;">
      <p style="font-size:10px; font-weight:700; color:#78716C; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:14px;">Booking Summary</p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#78716C;">Guest Name</span>
          <span style="font-weight:600; color:#1C1917;" x-text="$store.wizard.guestName || '—'"></span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#78716C;">Service</span>
          <span style="font-weight:600; color:#1C1917; text-transform:capitalize;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : $store.wizard.serviceType === 'dropoff' ? 'Drop Off' : '—'"></span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#78716C;">Load Type</span>
          <span style="font-weight:600; color:#1C1917; text-transform:uppercase;" x-text="$store.wizard.loadType || '—'"></span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#78716C;">Slot</span>
          <span style="font-weight:600; color:#1C1917;" x-text="$store.wizard.selectedSlotLabel || '—'"></span>
        </div>
        <div x-show="$store.wizard.houseBillNumber">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#78716C;">HBL</span>
            <span style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#78716C;" x-text="$store.wizard.houseBillNumber"></span>
          </div>
        </div>
        <div x-show="$store.wizard.containerNumber">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#78716C;">Container</span>
            <span style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#78716C;" x-text="$store.wizard.containerNumber"></span>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#78716C;">Driver</span>
          <span style="font-weight:600; color:#1C1917;" x-text="$store.wizard.driverName || '—'"></span>
        </div>
      </div>
    </div>

    {/* ICS status */}
    <div x-show="$store.wizard.shipmentData" x-cloak style="margin-bottom:20px;">
      <div style="display:flex; align-items:center; gap:12px; font-size:13px;">
        <span style="color:#78716C; font-weight:500;">ICS Status:</span>
        <span
          style="display:inline-flex; align-items:center; font-size:11px; font-weight:600; padding:3px 10px; border-radius:9999px; border:1px solid transparent;"
          {...{"x-bind:style": "{ background: $store.wizard.shipmentData?.icsStatus === 'cleared' ? 'rgba(34,197,94,0.12)' : $store.wizard.shipmentData?.icsStatus === 'held' ? 'rgba(239,68,68,0.12)' : $store.wizard.shipmentData?.icsStatus === 'examination' ? 'rgba(251,191,36,0.10)' : 'rgba(0,0,0,0.04)', color: $store.wizard.shipmentData?.icsStatus === 'cleared' ? '#22C55E' : $store.wizard.shipmentData?.icsStatus === 'held' ? '#EF4444' : $store.wizard.shipmentData?.icsStatus === 'examination' ? '#FBBF24' : '#78716C', borderColor: $store.wizard.shipmentData?.icsStatus === 'cleared' ? 'rgba(34,197,94,0.22)' : $store.wizard.shipmentData?.icsStatus === 'held' ? 'rgba(239,68,68,0.22)' : $store.wizard.shipmentData?.icsStatus === 'examination' ? 'rgba(251,191,36,0.22)' : 'rgba(0,0,0,0.10)' }"}}
          x-text="{'cleared':'Cleared','held':'Held','examination':'On Hold','pending':'Pending'}[$store.wizard.shipmentData?.icsStatus] || 'Unknown'"
        ></span>
      </div>
    </div>

    {/* CHEP notice */}
    <div x-show="$store.wizard.showChepWarning" style="background:rgba(217,119,6,0.08); border:1px solid rgba(217,119,6,0.25); border-radius:10px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:flex-start; gap:12px;">
      <Icon name={ICONS.warning} size={16} style="color:#D97706; flex-shrink:0; margin-top:1px;" />
      <p style="font-size:12px; color:#92400E; font-weight:500; line-height:1.5;">Reminder: CHEP pallet exchange required at collection. Bring your CHEP pallets.</p>
    </div>

    {/* Charges breakdown */}
    <div style="background:#fff; border:1.5px solid #e5e7eb; border-radius:14px; padding:20px; margin-bottom:20px;">
      <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:14px;">Charges</p>
      <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
        <div style="display:flex; justify-content:space-between; color:#78716C;" x-show="$store.wizard.shipmentData?.storageCharge > 0">
          <span>Storage charge</span>
          <span x-text="$store.wizard.storageChargeFormatted"></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#78716C;" x-show="$store.wizard.shipmentData?.shrinkWrapCharge > 0">
          <span>Shrink wrap</span>
          <span x-text="$store.wizard.shrinkWrapFormatted"></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#78716C;">
          <span>Slot fee</span>
          <span x-text="'$' + ($store.wizard.slotFee || 5).toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:600; color:#1C1917; padding-top:10px; border-top:1px solid rgba(0,0,0,0.07); margin-top:2px;">
          <span>Subtotal</span>
          <span x-text="'$' + $store.wizard.totalCharges.toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#78716C; font-size:12px;">
          <span>GST (10%)</span>
          <span x-text="'$' + ($store.wizard.totalCharges * 0.10).toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:700; color:#1C1917; padding-top:10px; border-top:1px solid rgba(0,0,0,0.07); font-size:15px;">
          <span>Total Due</span>
          <span style="color:#FC6514;" x-text="'$' + $store.wizard.totalWithGst + ' AUD'"></span>
        </div>
      </div>
    </div>

    {/* Payment method selector */}
    <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:12px;">Payment Method</p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'card'"
        style="text-align:left; cursor:pointer; border-radius:14px; padding:16px; transition:all 0.15s ease; background:#fff; border:1.5px solid #e5e7eb;"
        {...{"x-bind:style": "{ background: $store.wizard.paymentMethod === 'card' ? 'rgba(252,101,20,0.03)' : '#fff', borderColor: $store.wizard.paymentMethod === 'card' ? '#FC6514' : '#e5e7eb' }"}}
      >
        <Icon name={ICONS.shield} size={20} style="color:#FC6514; margin-bottom:8px; display:block;" />
        <div style="font-weight:600; font-size:13px; color:#1C1917;">Credit / Debit Card</div>
        <div style="font-size:12px; color:#78716C; margin-top:2px;">Visa, Mastercard, Amex</div>
      </button>
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'eft'"
        style="text-align:left; cursor:pointer; border-radius:14px; padding:16px; transition:all 0.15s ease; background:#fff; border:1.5px solid #e5e7eb;"
        {...{"x-bind:style": "{ background: $store.wizard.paymentMethod === 'eft' ? 'rgba(252,101,20,0.03)' : '#fff', borderColor: $store.wizard.paymentMethod === 'eft' ? '#FC6514' : '#e5e7eb' }"}}
      >
        <Icon name={ICONS.document} size={20} style="color:#FC6514; margin-bottom:8px; display:block;" />
        <div style="font-weight:600; font-size:13px; color:#1C1917;">Bank Transfer (EFT)</div>
        <div style="font-size:12px; color:#78716C; margin-top:2px;">Transfer before slot date</div>
      </button>
    </div>

    {/* Card details panel */}
    <div x-show="$store.wizard.paymentMethod === 'card'" style="background:#fff; border:1.5px solid #e5e7eb; border-radius:14px; padding:20px; margin-bottom:20px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
        <Icon name={ICONS.shield} size={15} style="color:#22C55E;" />
        <p style="font-size:12px; color:#78716C; font-weight:500;">Secure card payment powered by Stripe</p>
      </div>
      <div style="margin-bottom:14px;">
        <label style="display:block; font-size:11px; font-weight:600; color:#78716C; letter-spacing:0.07em; text-transform:uppercase; margin-bottom:6px;">Card Number</label>
        <input
          type="text"
          placeholder="•••• •••• •••• ••••"
          maxLength={19}
          class="wizard-field"
          style="width:100%; padding:12px 16px; font-size:14px; box-sizing:border-box; letter-spacing:0.08em;"
        />
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="display:block; font-size:11px; font-weight:600; color:#78716C; letter-spacing:0.07em; text-transform:uppercase; margin-bottom:6px;">Expiry</label>
          <input type="text" placeholder="MM / YY" class="wizard-field" style="width:100%; padding:12px 16px; font-size:13px; box-sizing:border-box;" />
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:600; color:#78716C; letter-spacing:0.07em; text-transform:uppercase; margin-bottom:6px;">CVV</label>
          <input type="text" placeholder="•••" maxLength={4} class="wizard-field" style="width:100%; padding:12px 16px; font-size:13px; box-sizing:border-box;" />
        </div>
      </div>
    </div>

    {/* EFT panel */}
    <div x-show="$store.wizard.paymentMethod === 'eft'" style="background:rgba(252,101,20,0.06); border:1px solid rgba(252,101,20,0.20); border-radius:10px; padding:16px; margin-bottom:20px;">
      <p style="font-weight:600; color:#FC6514; font-size:13px; margin-bottom:14px;">Bank Transfer Details</p>
      {[
        { label: 'Bank',         xt: "$store.wizard.eftBankName || '—'" },
        { label: 'Account Name', xt: "$store.wizard.eftAccountName || '—'" },
        { label: 'BSB',          xt: "$store.wizard.eftBsb || '—'" },
        { label: 'Account No.',  xt: "$store.wizard.eftAccountNumber || '—'" },
      ].map((row, i, arr) => (
        <div key={row.label} style={`display:flex; justify-content:space-between; padding:7px 0; ${i < arr.length - 1 ? 'border-bottom:1px solid rgba(252,101,20,0.15);' : ''}`}>
          <span style="color:rgba(252,101,20,0.60); font-size:12px;">{row.label}</span>
          <span style="font-family:ui-monospace,monospace; font-weight:600; color:#FC6514; font-size:12px;" x-text={row.xt}></span>
        </div>
      ))}
      <div style="margin-top:14px; display:flex; align-items:flex-start; gap:10px;">
        <input type="checkbox" id="eft-confirm" x-model="$store.wizard.eftConfirmed" style="margin-top:3px; accent-color:#FC6514;" />
        <label for="eft-confirm" style="font-size:12px; color:rgba(252,101,20,0.70); cursor:pointer; line-height:1.5;">
          I confirm I will transfer <span style="font-weight:700; color:#FC6514;" x-text="'$' + $store.wizard.totalWithGst + ' AUD'"></span> to the above account using my booking reference as the payment reference.
        </label>
      </div>
    </div>

    {/* Terms checkbox */}
    <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:20px;">
      <input type="checkbox" id="terms" x-model="$store.wizard.termsAccepted" style="margin-top:3px; accent-color:#FC6514;" />
      <label for="terms" style="font-size:13px; color:#78716C; cursor:pointer; line-height:1.5;">
        I agree to the{' '}
        <a href="#" style="color:#FC6514; text-decoration:underline; text-underline-offset:2px;">booking terms</a>
        {' '}and{' '}
        <a href="#" style="color:#FC6514; text-decoration:underline; text-underline-offset:2px;">cancellation policy</a>.
      </label>
    </div>

    {/* Submit error */}
    <div
      x-show="$store.wizard.submitError"
      x-cloak
      style="display:flex; align-items:center; gap:10px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.22); border-radius:10px; padding:12px 16px; margin-bottom:16px; font-size:13px; color:#DC2626; font-weight:500;"
    >
      <span x-text="$store.wizard.submitError"></span>
    </div>

    {/* Submit button */}
    <button
      type="button"
      x-on:click="$store.wizard.submitBooking()"
      {...{"x-bind:disabled": `$store.wizard.isSubmitting || !$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)`}}
      class="btn-primary"
      style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; font-weight:600; padding:14px 24px; border:none; cursor:pointer;"
      {...{"x-bind:style": "{ opacity: ($store.wizard.isSubmitting || !$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)) ? '0.50' : '1', cursor: ($store.wizard.isSubmitting || !$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)) ? 'not-allowed' : 'pointer', pointerEvents: ($store.wizard.isSubmitting || !$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)) ? 'none' : 'auto' }"}}
    >
      <span x-show="$store.wizard.isSubmitting" x-cloak>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation:spin 0.7s linear infinite;">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="10" stroke-linecap="round"/>
        </svg>
      </span>
      <span x-show="!$store.wizard.isSubmitting">
        <Icon name={ICONS.check} size={18} />
      </span>
      <span x-text="$store.wizard.isSubmitting ? 'Submitting…' : ($store.wizard.paymentMethod === 'eft' ? 'Confirm Booking' : ('Confirm & Pay $' + $store.wizard.totalWithGst + ' AUD'))">Confirm Booking</span>
    </button>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)
