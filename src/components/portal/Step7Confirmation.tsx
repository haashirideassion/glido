import { Icon, ICONS } from '../../lib/Icon'

export const Step7Confirmation = () => (
  <div x-show="$store.wizard.currentStep === 7" x-cloak>
    <h2 style="font-size:18px; font-weight:700; color:#F1F5F9; letter-spacing:-0.03em; margin-bottom:4px;">Review & Pay</h2>
    <p style="color:#64748B; font-size:13px; margin-bottom:20px; line-height:1.5;">Review your booking and complete payment to confirm your slot hold.</p>

    {/* Hold timer banner */}
    <div
      x-show="$store.wizard.holdActive"
      style="margin-bottom:20px; display:flex; align-items:center; gap:12px; border-radius:10px; padding:12px 16px; font-size:13px; font-weight:500;"
      {...{"x-bind:style": "$store.wizard.holdExpiring ? 'background:rgba(239,68,68,0.10); border:1px solid rgba(239,68,68,0.25); color:#EF4444;' : 'background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.20); color:#FBBF24;'"}}
    >
      <Icon name={ICONS.clock} size={16} style="flex-shrink:0;" />
      <span>
        Your slot is held for{' '}
        <span style="font-weight:700; font-family:ui-monospace,monospace;" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>.
        Complete payment to secure it.
      </span>
    </div>

    {/* Booking summary */}
    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:12px; padding:20px; margin-bottom:20px; font-size:13px;">
      <p style="font-size:10px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:14px;">Booking Summary</p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#64748B;">Guest Name</span>
          <span style="font-weight:600; color:#F1F5F9;" x-text="$store.wizard.guestName || '—'"></span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#64748B;">Service</span>
          <span style="font-weight:600; color:#F1F5F9; text-transform:capitalize;" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : $store.wizard.serviceType === 'dropoff' ? 'Drop Off' : '—'"></span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#64748B;">Load Type</span>
          <span style="font-weight:600; color:#F1F5F9; text-transform:uppercase;" x-text="$store.wizard.loadType || '—'"></span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#64748B;">Slot</span>
          <span style="font-weight:600; color:#F1F5F9;" x-text="$store.wizard.selectedSlotLabel || '—'"></span>
        </div>
        <div style="display:flex; justify-content:space-between;" x-show="$store.wizard.houseBillNumber">
          <span style="color:#64748B;">HBL</span>
          <span style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#94A3B8;" x-text="$store.wizard.houseBillNumber"></span>
        </div>
        <div style="display:flex; justify-content:space-between;" x-show="$store.wizard.containerNumber">
          <span style="color:#64748B;">Container</span>
          <span style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#94A3B8;" x-text="$store.wizard.containerNumber"></span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#64748B;">Driver</span>
          <span style="font-weight:600; color:#F1F5F9;" x-text="$store.wizard.driverName || '—'"></span>
        </div>
      </div>
    </div>

    {/* ICS status */}
    <div x-show="$store.wizard.shipmentData" style="margin-bottom:20px; display:flex; align-items:center; gap:8px; font-size:13px;">
      <span style="color:#94A3B8; font-weight:500;">ICS Status:</span>
      <span
        style="display:inline-flex; align-items:center; font-size:11px; font-weight:600; padding:3px 10px; border-radius:9999px; border:1px solid transparent;"
        {...{"x-bind:style": `$store.wizard.shipmentData?.icsStatus === 'cleared'
          ? 'background:rgba(34,197,94,0.12); color:#22C55E; border-color:rgba(34,197,94,0.22);'
          : $store.wizard.shipmentData?.icsStatus === 'held'
          ? 'background:rgba(239,68,68,0.12); color:#EF4444; border-color:rgba(239,68,68,0.22);'
          : $store.wizard.shipmentData?.icsStatus === 'examination'
          ? 'background:rgba(251,191,36,0.10); color:#FBBF24; border-color:rgba(251,191,36,0.22);'
          : 'background:rgba(148,163,184,0.10); color:#94A3B8; border-color:rgba(148,163,184,0.20);'`}}
        x-text="{'cleared':'Cleared','held':'Held','examination':'On Hold','pending':'Pending'}[$store.wizard.shipmentData?.icsStatus] || 'Unknown'"
      ></span>
    </div>

    {/* CHEP notice */}
    <div x-show="$store.wizard.showChepWarning" style="background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20); border-radius:10px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:flex-start; gap:12px;">
      <Icon name={ICONS.warning} size={16} style="color:#FBBF24; flex-shrink:0; margin-top:1px;" />
      <p style="font-size:12px; color:rgba(251,191,36,0.75); font-weight:500; line-height:1.5;">Reminder: CHEP pallet exchange required at collection. Bring your CHEP pallets.</p>
    </div>

    {/* Charges breakdown */}
    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:10px; padding:20px; margin-bottom:20px;">
      <p style="font-size:13px; font-weight:600; color:#F1F5F9; margin-bottom:14px;">Charges</p>
      <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
        <div style="display:flex; justify-content:space-between; color:#94A3B8;" x-show="$store.wizard.shipmentData?.storageCharge > 0">
          <span>Storage charge</span>
          <span x-text="$store.wizard.storageChargeFormatted"></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#94A3B8;" x-show="$store.wizard.shipmentData?.shrinkWrapCharge > 0">
          <span>Shrink wrap</span>
          <span x-text="$store.wizard.shrinkWrapFormatted"></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#94A3B8;">
          <span>Slot fee</span>
          <span x-text="'$' + ($store.wizard.slotFee || 5).toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:600; color:#F1F5F9; padding-top:10px; border-top:1px solid rgba(255,255,255,0.07); margin-top:2px;">
          <span>Subtotal</span>
          <span x-text="'$' + $store.wizard.totalCharges.toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; color:#64748B; font-size:12px;">
          <span>GST (10%)</span>
          <span x-text="'$' + ($store.wizard.totalCharges * 0.10).toFixed(2)"></span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:700; color:#F1F5F9; padding-top:10px; border-top:1px solid rgba(255,255,255,0.07); font-size:15px;">
          <span>Total Due</span>
          <span style="color:#FC6514;" x-text="'$' + $store.wizard.totalWithGst + ' AUD'"></span>
        </div>
      </div>
    </div>

    {/* Payment method selector */}
    <p style="font-size:13px; font-weight:600; color:#F1F5F9; margin-bottom:12px;">Payment Method</p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'card'"
        style="text-align:left; cursor:pointer; border-radius:10px; padding:16px; transition:all 0.15s ease; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.09);"
        {...{"x-bind:style": "$store.wizard.paymentMethod === 'card' ? 'background:rgba(252,101,20,0.08); border-color:rgba(252,101,20,0.40); box-shadow:0 0 0 3px rgba(252,101,20,0.08);' : ''"}}
      >
        <Icon name={ICONS.shield} size={20} style="color:#FC6514; margin-bottom:8px; display:block;" />
        <div style="font-weight:600; font-size:13px; color:#F1F5F9;">Credit / Debit Card</div>
        <div style="font-size:12px; color:#64748B; margin-top:2px;">Visa, Mastercard, Amex</div>
      </button>
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'eft'"
        style="text-align:left; cursor:pointer; border-radius:10px; padding:16px; transition:all 0.15s ease; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.09);"
        {...{"x-bind:style": "$store.wizard.paymentMethod === 'eft' ? 'background:rgba(252,101,20,0.08); border-color:rgba(252,101,20,0.40); box-shadow:0 0 0 3px rgba(252,101,20,0.08);' : ''"}}
      >
        <Icon name={ICONS.document} size={20} style="color:#FC6514; margin-bottom:8px; display:block;" />
        <div style="font-weight:600; font-size:13px; color:#F1F5F9;">Bank Transfer (EFT)</div>
        <div style="font-size:12px; color:#64748B; margin-top:2px;">Transfer before slot date</div>
      </button>
    </div>

    {/* Card details panel */}
    <div x-show="$store.wizard.paymentMethod === 'card'" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:10px; padding:20px; margin-bottom:20px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
        <Icon name={ICONS.shield} size={15} style="color:#22C55E;" />
        <p style="font-size:12px; color:#64748B; font-weight:500;">Secure card payment powered by Stripe</p>
      </div>
      <div style="margin-bottom:14px;">
        <label style="display:block; font-size:11px; font-weight:600; color:rgba(255,255,255,0.40); letter-spacing:0.07em; text-transform:uppercase; margin-bottom:6px;">Card Number</label>
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
          <label style="display:block; font-size:11px; font-weight:600; color:rgba(255,255,255,0.40); letter-spacing:0.07em; text-transform:uppercase; margin-bottom:6px;">Expiry</label>
          <input type="text" placeholder="MM / YY" class="wizard-field" style="width:100%; padding:12px 16px; font-size:13px; box-sizing:border-box;" />
        </div>
        <div>
          <label style="display:block; font-size:11px; font-weight:600; color:rgba(255,255,255,0.40); letter-spacing:0.07em; text-transform:uppercase; margin-bottom:6px;">CVV</label>
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
      <label for="terms" style="font-size:13px; color:#94A3B8; cursor:pointer; line-height:1.5;">
        I agree to the{' '}
        <a href="#" style="color:#FC6514; text-decoration:underline; text-underline-offset:2px;">booking terms</a>
        {' '}and{' '}
        <a href="#" style="color:#FC6514; text-decoration:underline; text-underline-offset:2px;">cancellation policy</a>.
      </label>
    </div>

    {/* Submit button */}
    <button
      type="button"
      x-on:click="$store.wizard.submitBooking()"
      {...{"x-bind:disabled": `!$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)`}}
      class="btn-primary"
      style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; font-weight:600; padding:14px 24px; border:none; cursor:pointer;"
      {...{"x-bind:style": "(!$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)) ? 'opacity:0.30; cursor:not-allowed; pointer-events:none;' : ''"}}
    >
      <Icon name={ICONS.check} size={18} />
      <span x-text="'Confirm & Pay $' + $store.wizard.totalWithGst + ' AUD'">Confirm & Pay</span>
    </button>
  </div>
)
