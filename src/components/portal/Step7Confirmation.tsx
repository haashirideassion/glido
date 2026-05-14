import { Icon, ICONS } from '../../lib/Icon'

export const Step7Confirmation = () => (
  <div x-show="$store.wizard.currentStep === 7" x-cloak>
    <h2 style="font-size:1.25rem; font-weight:700; color:#44403C; margin-bottom:4px;">Review & Pay</h2>
    <p style="color:#A8A29E; font-size:0.875rem; margin-bottom:20px;">Review your booking and complete payment to confirm your slot hold.</p>

    {/* Hold timer banner */}
    <div
      x-show="$store.wizard.holdActive"
      style="margin-bottom:20px; display:flex; align-items:center; gap:12px; border-radius:12px; padding:12px 16px; font-size:0.875rem; font-weight:500;"
      {...{"x-bind:style": "$store.wizard.holdExpiring ? 'background:#FEF2F2; border:1px solid #FECACA; color:#991B1B;' : 'background:#FFFBEB; border:1px solid #FDE68A; color:#92400E;'"}}
    >
      <Icon name={ICONS.clock} size={16} class="shrink-0" />
      <span>
        Your slot is held for{' '}
        <span style="font-weight:700; font-family:monospace;" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>.
        Complete payment to secure it.
      </span>
    </div>

    {/* Booking summary — Card Style B */}
    <div style="background:#F5F3EC; border:1px solid rgba(231,229,228,0.5); border-radius:12px; padding:20px; box-shadow:rgba(0,0,0,0.05) 0px 1px 2px 0px; margin-bottom:20px; font-size:0.875rem;">
      <p style="font-size:0.625rem; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px;">Booking Summary</p>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:#A8A29E;">Guest Name</span>
        <span style="font-weight:600; color:#44403C;" x-text="$store.wizard.guestName || '—'"></span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:#A8A29E;">Service</span>
        <span style="font-weight:600; color:#44403C; text-transform:capitalize;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : $store.wizard.serviceType === 'dropoff' ? 'Drop Off' : '—'"></span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:#A8A29E;">Load Type</span>
        <span style="font-weight:600; color:#44403C; text-transform:uppercase;" x-text="$store.wizard.loadType || '—'"></span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="color:#A8A29E;">Slot</span>
        <span style="font-weight:600; color:#44403C;" x-text="$store.wizard.selectedSlotLabel || '—'"></span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;" x-show="$store.wizard.houseBillNumber">
        <span style="color:#A8A29E;">HBL</span>
        <span style="font-family:monospace; font-size:0.75rem; font-weight:700; color:#44403C;" x-text="$store.wizard.houseBillNumber"></span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;" x-show="$store.wizard.containerNumber">
        <span style="color:#A8A29E;">Container</span>
        <span style="font-family:monospace; font-size:0.75rem; font-weight:700; color:#44403C;" x-text="$store.wizard.containerNumber"></span>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:#A8A29E;">Driver</span>
        <span style="font-weight:600; color:#44403C;" x-text="$store.wizard.driverName || '—'"></span>
      </div>
    </div>

    {/* ICS status */}
    <div x-show="$store.wizard.shipmentData" style="margin-bottom:20px; display:flex; align-items:center; gap:8px; font-size:0.875rem;">
      <span style="color:#44403C; font-weight:500;">ICS Status:</span>
      <span
        style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem; font-weight:600; padding:2px 10px; border-radius:9999px; border:1px solid transparent;"
        {...{"x-bind:style": `$store.wizard.shipmentData?.icsStatus === 'cleared' ? 'background:#DCFCE7; color:#166534; border-color:#BBF7D0;' : $store.wizard.shipmentData?.icsStatus === 'held' ? 'background:#FEE2E2; color:#991B1B; border-color:#FECACA;' : $store.wizard.shipmentData?.icsStatus === 'examination' ? 'background:#FFFBEB; color:#92400E; border-color:#FDE68A;' : 'background:#F5F3EC; color:#A8A29E; border-color:#D6D3D1;'`}}
        x-text="{'cleared':'Cleared','held':'Held','examination':'On Hold','pending':'Pending'}[$store.wizard.shipmentData?.icsStatus] || 'Unknown'"
      ></span>
    </div>

    {/* CHEP notice */}
    <div x-show="$store.wizard.showChepWarning" style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:12px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:flex-start; gap:12px;">
      <Icon name={ICONS.warning} size={16} class="text-amber-600 shrink-0 mt-0.5" />
      <p style="font-size:0.75rem; color:#92400E; font-weight:500;">Reminder: CHEP pallet exchange required at collection. Bring your CHEP pallets.</p>
    </div>

    {/* Charges breakdown — Card Style A */}
    <div style="background:#EAE6DE; border:1px solid rgba(214,211,209,0.5); border-radius:8px 8px 8px 2px; padding:20px; box-shadow:rgba(0,0,0,0.05) 0px 1px 2px 0px; margin-bottom:20px;">
      <p style="font-size:0.875rem; font-weight:600; color:#44403C; margin-bottom:12px;">Charges</p>
      <div style="font-size:0.875rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#78716C;" x-show="$store.wizard.shipmentData?.storageCharge > 0">
          <span>Storage charge</span>
          <span x-text="$store.wizard.storageChargeFormatted"></span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#78716C;" x-show="$store.wizard.shipmentData?.shrinkWrapCharge > 0">
          <span>Shrink wrap</span>
          <span x-text="$store.wizard.shrinkWrapFormatted"></span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#78716C;">
          <span>Slot fee</span>
          <span x-text="'$' + ($store.wizard.slotFee || 5).toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:600; color:#44403C; padding-top:8px; border-top:1px solid #D6D3D1; margin-top:4px; margin-bottom:4px;">
          <span>Subtotal</span>
          <span x-text="'$' + $store.wizard.totalCharges.toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#A8A29E; font-size:0.75rem; margin-bottom:8px;">
          <span>GST (10%)</span>
          <span x-text="'$' + ($store.wizard.totalCharges * 0.10).toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:700; color:#44403C; padding-top:8px; border-top:1px solid #D6D3D1; font-size:1rem;">
          <span>Total Due</span>
          <span style="color:#F59E0B;" x-text="'$' + $store.wizard.totalWithGst + ' AUD'"></span>
        </div>
      </div>
    </div>

    {/* Payment method selector */}
    <p style="font-size:0.875rem; font-weight:600; color:#44403C; margin-bottom:12px;">Payment Method</p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'card'"
        style="text-align:left; transition:all 0.15s; cursor:pointer;"
        {...{"x-bind:style": "$store.wizard.paymentMethod === 'card' ? 'background:#FEF3C7; border:1px solid #F59E0B; border-radius:8px; padding:16px;' : 'background:#F5F3EC; border:1px solid #D6D3D1; border-radius:8px; padding:16px;'"}}
      >
        <Icon name={ICONS.shield} size={20} class="mb-2" style="color:#F59E0B;" />
        <div style="font-weight:600; font-size:0.875rem; color:#44403C;">Credit / Debit Card</div>
        <div style="font-size:0.75rem; color:#A8A29E; margin-top:2px;">Visa, Mastercard, Amex</div>
      </button>
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'eft'"
        style="text-align:left; transition:all 0.15s; cursor:pointer;"
        {...{"x-bind:style": "$store.wizard.paymentMethod === 'eft' ? 'background:#FEF3C7; border:1px solid #F59E0B; border-radius:8px; padding:16px;' : 'background:#F5F3EC; border:1px solid #D6D3D1; border-radius:8px; padding:16px;'"}}
      >
        <Icon name={ICONS.document} size={20} class="mb-2" style="color:#F59E0B;" />
        <div style="font-weight:600; font-size:0.875rem; color:#44403C;">Bank Transfer (EFT)</div>
        <div style="font-size:0.75rem; color:#A8A29E; margin-top:2px;">Transfer before slot date</div>
      </button>
    </div>

    {/* Card details panel */}
    <div x-show="$store.wizard.paymentMethod === 'card'" style="background:#FCFBF8; border:1px solid #D6D3D1; border-radius:8px; padding:20px; margin-bottom:20px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
        <Icon name={ICONS.shield} size={16} class="text-green-500" />
        <p style="font-size:0.75rem; color:#A8A29E; font-weight:500;">Secure card payment powered by Stripe</p>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block; font-size:0.75rem; font-weight:600; color:#44403C; margin-bottom:6px;">Card Number</label>
        <input
          type="text"
          placeholder="•••• •••• •••• ••••"
          maxLength={19}
          style="width:100%; border:1px solid #D6D3D1; border-radius:6px; background:#FCFBF8; color:#44403C; padding:12px 16px; font-size:0.875rem; outline:none; box-sizing:border-box;"
        />
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="display:block; font-size:0.75rem; font-weight:600; color:#44403C; margin-bottom:6px;">Expiry</label>
          <input
            type="text"
            placeholder="MM / YY"
            style="width:100%; border:1px solid #D6D3D1; border-radius:6px; background:#FCFBF8; color:#44403C; padding:12px 16px; font-size:0.875rem; outline:none; box-sizing:border-box;"
          />
        </div>
        <div>
          <label style="display:block; font-size:0.75rem; font-weight:600; color:#44403C; margin-bottom:6px;">CVV</label>
          <input
            type="text"
            placeholder="•••"
            maxLength={4}
            style="width:100%; border:1px solid #D6D3D1; border-radius:6px; background:#FCFBF8; color:#44403C; padding:12px 16px; font-size:0.875rem; outline:none; box-sizing:border-box;"
          />
        </div>
      </div>
    </div>

    {/* EFT panel */}
    <div x-show="$store.wizard.paymentMethod === 'eft'" style="background:#FEF3C7; border:1px solid #F59E0B; border-radius:8px; padding:16px; margin-bottom:20px; font-size:0.875rem;">
      <p style="font-weight:600; color:#92400E; margin-bottom:12px;">Bank Transfer Details</p>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(245,158,11,0.2);">
        <span style="color:#B45309; font-size:0.75rem;">Bank</span>
        <span style="font-family:monospace; font-weight:600; color:#78350F; font-size:0.75rem;" x-text="$store.wizard.eftBankName || '—'"></span>
      </div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(245,158,11,0.2);">
        <span style="color:#B45309; font-size:0.75rem;">Account Name</span>
        <span style="font-family:monospace; font-weight:600; color:#78350F; font-size:0.75rem;" x-text="$store.wizard.eftAccountName || '—'"></span>
      </div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(245,158,11,0.2);">
        <span style="color:#B45309; font-size:0.75rem;">BSB</span>
        <span style="font-family:monospace; font-weight:600; color:#78350F; font-size:0.75rem;" x-text="$store.wizard.eftBsb || '—'"></span>
      </div>
      <div style="display:flex; justify-content:space-between; padding:6px 0;">
        <span style="color:#B45309; font-size:0.75rem;">Account No.</span>
        <span style="font-family:monospace; font-weight:600; color:#78350F; font-size:0.75rem;" x-text="$store.wizard.eftAccountNumber || '—'"></span>
      </div>
      <div style="margin-top:12px; display:flex; align-items:flex-start; gap:10px;">
        <input
          type="checkbox"
          id="eft-confirm"
          x-model="$store.wizard.eftConfirmed"
          style="margin-top:2px;"
        />
        <label for="eft-confirm" style="font-size:0.75rem; color:#92400E; cursor:pointer;">
          I confirm I will transfer <span style="font-weight:700;" x-text="'$' + $store.wizard.totalWithGst + ' AUD'"></span> to the above account using my booking reference as the payment reference.
        </label>
      </div>
    </div>

    {/* Terms checkbox */}
    <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:20px;">
      <input
        type="checkbox"
        id="terms"
        x-model="$store.wizard.termsAccepted"
        style="margin-top:2px;"
      />
      <label for="terms" style="font-size:0.875rem; color:#78716C; cursor:pointer;">
        I agree to the{' '}
        <a href="#" style="color:#F59E0B; text-decoration:underline;">booking terms</a>
        {' '}and{' '}
        <a href="#" style="color:#F59E0B; text-decoration:underline;">cancellation policy</a>.
      </label>
    </div>

    {/* Submit button */}
    <button
      type="button"
      x-on:click="$store.wizard.submitBooking()"
      {...{"x-bind:disabled": `!$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)`}}
      style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:#F59E0B; color:#1C1917; border-radius:6px; font-size:12px; font-weight:500; padding:12px 24px; border:none; cursor:pointer; transition:opacity 0.15s;"
      {...{"x-bind:style": "(!$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)) ? 'opacity:0.5; cursor:not-allowed; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:#F59E0B; color:#1C1917; border-radius:6px; font-size:12px; font-weight:500; padding:12px 24px; border:none;' : ''"}}
    >
      <Icon name={ICONS.check} size={20} />
      <span x-text="'Confirm & Pay $' + $store.wizard.totalWithGst + ' AUD'">Confirm & Pay</span>
    </button>
  </div>
)
