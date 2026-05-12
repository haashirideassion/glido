import { Icon, ICONS } from '../../lib/Icon'

export const Step7Confirmation = () => (
  <div x-show="$store.wizard.currentStep === 7" x-cloak>
    <h2 class="text-xl font-bold text-slate-900 mb-1">Review & Pay</h2>
    <p class="text-slate-500 text-sm mb-5">Review your booking and complete payment to confirm your slot hold.</p>

    {/* Hold timer banner */}
    <div
      x-show="$store.wizard.holdActive"
      class="mb-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium border"
      {...{"x-bind:class": "$store.wizard.holdExpiring ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'"}}
    >
      <Icon name={ICONS.clock} size={16} class="shrink-0" />
      <span>
        Your slot is held for{' '}
        <span class="font-bold font-mono" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>.
        Complete payment to secure it.
      </span>
    </div>

    {/* Booking summary */}
    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-sm space-y-2">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Booking Summary</p>
      <div class="flex justify-between">
        <span class="text-slate-500">Guest Name</span>
        <span class="font-semibold" x-text="$store.wizard.guestName || '—'"></span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Service</span>
        <span class="font-semibold capitalize" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : $store.wizard.serviceType === 'dropoff' ? 'Drop Off' : '—'"></span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Load Type</span>
        <span class="font-semibold uppercase" x-text="$store.wizard.loadType || '—'"></span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Slot</span>
        <span class="font-semibold" x-text="$store.wizard.selectedSlotLabel || '—'"></span>
      </div>
      <div class="flex justify-between" x-show="$store.wizard.houseBillNumber">
        <span class="text-slate-500">HBL</span>
        <span class="font-mono text-xs font-bold" x-text="$store.wizard.houseBillNumber"></span>
      </div>
      <div class="flex justify-between" x-show="$store.wizard.containerNumber">
        <span class="text-slate-500">Container</span>
        <span class="font-mono text-xs font-bold" x-text="$store.wizard.containerNumber"></span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Driver</span>
        <span class="font-semibold" x-text="$store.wizard.driverName || '—'"></span>
      </div>
    </div>

    {/* ICS status */}
    <div x-show="$store.wizard.shipmentData" class="mb-5 flex items-center gap-2 text-sm">
      <span class="text-slate-600 font-medium">ICS Status:</span>
      <span
        class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
        {...{"x-bind:class": `{
          'bg-green-100 text-green-800 border-green-200': $store.wizard.shipmentData?.icsStatus === 'cleared',
          'bg-red-100 text-red-800 border-red-200': $store.wizard.shipmentData?.icsStatus === 'held',
          'bg-amber-100 text-amber-800 border-amber-200': $store.wizard.shipmentData?.icsStatus === 'examination',
          'bg-slate-100 text-slate-500 border-slate-200': !$store.wizard.shipmentData?.icsStatus
        }`}}
        x-text="{'cleared':'Cleared','held':'Held','examination':'On Hold','pending':'Pending'}[$store.wizard.shipmentData?.icsStatus] || 'Unknown'"
      ></span>
    </div>

    {/* CHEP notice */}
    <div x-show="$store.wizard.showChepWarning" class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
      <Icon name={ICONS.warning} size={16} class="text-amber-600 shrink-0 mt-0.5" />
      <p class="text-xs text-amber-700 font-medium">Reminder: CHEP pallet exchange required at collection. Bring your CHEP pallets.</p>
    </div>

    {/* Charges breakdown */}
    <div class="bg-white border border-slate-200 rounded-xl p-4 mb-5">
      <p class="text-sm font-semibold text-slate-700 mb-3">Charges</p>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between text-slate-600" x-show="$store.wizard.shipmentData?.storageCharge > 0">
          <span>Storage charge</span>
          <span x-text="$store.wizard.storageChargeFormatted"></span>
        </div>
        <div class="flex justify-between text-slate-600" x-show="$store.wizard.shipmentData?.shrinkWrapCharge > 0">
          <span>Shrink wrap</span>
          <span x-text="$store.wizard.shrinkWrapFormatted"></span>
        </div>
        <div class="flex justify-between text-slate-600">
          <span>Slot fee</span>
          <span>$5.00</span>
        </div>
        <div class="flex justify-between font-semibold text-slate-800 pt-2 border-t border-slate-100">
          <span>Subtotal</span>
          <span x-text="'$' + $store.wizard.totalCharges.toFixed(2)"></span>
        </div>
        <div class="flex justify-between text-slate-500 text-xs">
          <span>GST (10%)</span>
          <span x-text="'$' + ($store.wizard.totalCharges * 0.10).toFixed(2)"></span>
        </div>
        <div class="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-base">
          <span>Total Due</span>
          <span class="text-blue-700" x-text="'$' + $store.wizard.totalWithGst + ' AUD'"></span>
        </div>
      </div>
    </div>

    {/* Payment method selector */}
    <p class="text-sm font-semibold text-slate-700 mb-3">Payment Method</p>
    <div class="grid grid-cols-2 gap-3 mb-5">
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'card'"
        class="border-2 rounded-xl p-4 text-left transition-all"
        {...{"x-bind:class": "$store.wizard.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500 ring-offset-1' : 'border-slate-200 bg-white hover:border-blue-300'"}}
      >
        <Icon name={ICONS.shield} size={20} class="text-blue-500 mb-2" />
        <div class="font-semibold text-sm text-slate-800">Credit / Debit Card</div>
        <div class="text-xs text-slate-400 mt-0.5">Visa, Mastercard, Amex</div>
      </button>
      <button
        type="button"
        x-on:click="$store.wizard.paymentMethod = 'eft'"
        class="border-2 rounded-xl p-4 text-left transition-all"
        {...{"x-bind:class": "$store.wizard.paymentMethod === 'eft' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500 ring-offset-1' : 'border-slate-200 bg-white hover:border-blue-300'"}}
      >
        <Icon name={ICONS.document} size={20} class="text-blue-500 mb-2" />
        <div class="font-semibold text-sm text-slate-800">Bank Transfer (EFT)</div>
        <div class="text-xs text-slate-400 mt-0.5">Transfer before slot date</div>
      </button>
    </div>

    {/* Card details panel */}
    <div x-show="$store.wizard.paymentMethod === 'card'" class="bg-white border border-slate-200 rounded-xl p-5 mb-5 space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <Icon name={ICONS.shield} size={16} class="text-green-500" />
        <p class="text-xs text-slate-500 font-medium">Secure card payment powered by Stripe</p>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 mb-1.5">Card Number</label>
        <input
          type="text"
          placeholder="•••• •••• •••• ••••"
          maxLength={19}
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1.5">Expiry</label>
          <input
            type="text"
            placeholder="MM / YY"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1.5">CVV</label>
          <input
            type="text"
            placeholder="•••"
            maxLength={4}
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    {/* EFT panel */}
    <div x-show="$store.wizard.paymentMethod === 'eft'" class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm">
      <p class="font-semibold text-blue-800 mb-3">Bank Transfer Details</p>
      {[
        { label: 'Bank',         value: 'Commonwealth Bank' },
        { label: 'Account Name', value: 'Glido CFS Terminal 1 Pty Ltd' },
        { label: 'BSB',          value: '062-000' },
        { label: 'Account No.',  value: '12345678' },
      ].map((row) => (
        <div key={row.label} class="flex justify-between py-1.5 border-b border-blue-100 last:border-0">
          <span class="text-blue-600 text-xs">{row.label}</span>
          <span class="font-mono font-semibold text-blue-900 text-xs">{row.value}</span>
        </div>
      ))}
      <div class="mt-3 flex items-start gap-2.5">
        <input
          type="checkbox"
          id="eft-confirm"
          x-model="$store.wizard.eftConfirmed"
          class="mt-0.5"
        />
        <label for="eft-confirm" class="text-xs text-blue-700 cursor-pointer">
          I confirm I will transfer <span class="font-bold" x-text="'$' + $store.wizard.totalWithGst + ' AUD'"></span> to the above account using my booking reference as the payment reference.
        </label>
      </div>
    </div>

    {/* Terms checkbox */}
    <div class="flex items-start gap-3 mb-5">
      <input
        type="checkbox"
        id="terms"
        x-model="$store.wizard.termsAccepted"
        class="mt-0.5"
      />
      <label for="terms" class="text-sm text-slate-600 cursor-pointer">
        I agree to the{' '}
        <a href="#" class="text-blue-600 hover:underline">booking terms</a>
        {' '}and{' '}
        <a href="#" class="text-blue-600 hover:underline">cancellation policy</a>.
      </label>
    </div>

    {/* Submit button */}
    <button
      type="button"
      x-on:click="$store.wizard.submitBooking()"
      {...{"x-bind:disabled": `!$store.wizard.termsAccepted || !$store.wizard.paymentMethod || ($store.wizard.paymentMethod === 'eft' && !$store.wizard.eftConfirmed)`}}
      class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icon name={ICONS.check} size={20} />
      <span x-text="'Confirm & Pay $' + $store.wizard.totalWithGst + ' AUD'">Confirm & Pay</span>
    </button>
  </div>
)
