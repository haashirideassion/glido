import { Button } from '@/components/ui/button'
import { Icon, ICONS } from '../../lib/Icon'

export const Step5Documents = () => (
  <div x-show="$store.wizard.currentStep === 5" x-cloak>
    <h2 class="text-xl font-bold text-slate-900 mb-1">Shipment Details</h2>
    <p class="text-slate-500 text-sm mb-6">Enter the details of your shipment. Fields change based on your service and cargo type.</p>

    {/* ── LCL Pickup ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isPickupLcl" class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            House Bill Number <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.houseBillNumber"
            placeholder="e.g. SYHMSCU001847"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Container Number <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.containerNumber"
            placeholder="e.g. MSCU1234567"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <button
          type="button"
          x-on:click="$store.wizard.fetchShipmentDetails()"
          {...{"x-bind:disabled": "$store.wizard.houseBillNumber.trim().length < 4 || $store.wizard.shipmentFetching"}}
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span x-show="!$store.wizard.shipmentFetching">
            <Icon name={ICONS.search} size={16} />
          </span>
          <span x-show="$store.wizard.shipmentFetching" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span x-text="$store.wizard.shipmentFetching ? 'Looking up...' : 'Look Up Shipment'">Look Up Shipment</span>
        </button>
      </div>

      {/* Fetched shipment data */}
      <div x-show="$store.wizard.shipmentFetched && $store.wizard.shipmentData" class="space-y-4">
        {/* ICS status badge */}
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-slate-700">ICS Status:</span>
          <span
            class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
            {...{"x-bind:class": `{
              'bg-green-100 text-green-800 border-green-200': $store.wizard.shipmentData?.icsStatus === 'cleared',
              'bg-red-100 text-red-800 border-red-200': $store.wizard.shipmentData?.icsStatus === 'held',
              'bg-amber-100 text-amber-800 border-amber-200': $store.wizard.shipmentData?.icsStatus === 'examination',
              'bg-slate-100 text-slate-500 border-slate-200': $store.wizard.shipmentData?.icsStatus === 'pending' || !$store.wizard.shipmentData?.icsStatus
            }`}}
            x-text="{'cleared':'Cleared','held':'Held','examination':'On Hold','pending':'Pending'}[$store.wizard.shipmentData?.icsStatus] || 'Unknown'"
          ></span>
        </div>

        {/* ICS Held warning */}
        <div x-show="$store.wizard.showIcsHeld" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Icon name={ICONS.warning} size={18} class="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-red-800 text-sm">ICS Hold Detected</p>
            <p class="text-xs text-red-700 mt-0.5">This shipment is currently held by Australian Border Force. You cannot collect until the hold is lifted. Contact your freight forwarder.</p>
          </div>
        </div>

        {/* Auto-populated fields */}
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Auto-populated from CFS records</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Weight',        xtext: `$store.wizard.shipmentData?.weightKg ? $store.wizard.shipmentData.weightKg + ' kg' : '—'` },
              { label: 'Volume',        xtext: `$store.wizard.shipmentData?.volumeCbm ? $store.wizard.shipmentData.volumeCbm + ' CBM' : '—'` },
              { label: 'Packages',      xtext: `$store.wizard.shipmentData?.packageCount || '—'` },
              { label: 'Pallets',       xtext: `$store.wizard.shipmentData?.palletCount ? $store.wizard.shipmentData.palletCount + ' × ' + $store.wizard.shipmentData.palletType : '—'` },
              { label: 'Storage from',  xtext: `$store.wizard.shipmentData?.storageStartDate || '—'` },
              { label: 'Days in store', xtext: `$store.wizard.shipmentData?.storageDays ? $store.wizard.shipmentData.storageDays + ' days' : '—'` },
            ].map((item) => (
              <div key={item.label} class="bg-white rounded-lg px-3 py-2 border border-slate-100">
                <p class="text-xs text-slate-400 mb-0.5">{item.label}</p>
                <p class="font-semibold text-slate-800 text-sm" x-text={item.xtext}></p>
              </div>
            ))}
          </div>
        </div>

        {/* CHEP warning */}
        <div x-show="$store.wizard.showChepWarning" class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Icon name={ICONS.warning} size={18} class="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-amber-800 text-sm">CHEP Pallet Exchange Required</p>
            <p class="text-xs text-amber-700 mt-0.5">
              Your shipment is on CHEP pallets. You must bring the same number of empty CHEP pallets to exchange when collecting. Plain pallets are not accepted.
            </p>
          </div>
        </div>

        {/* Charges breakdown */}
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p class="text-sm font-semibold text-slate-800 mb-3">Estimated Charges</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-slate-600">
              <span>Storage charge</span>
              <span class="font-medium" x-text="$store.wizard.storageChargeFormatted"></span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Shrink wrap</span>
              <span class="font-medium" x-text="$store.wizard.shrinkWrapFormatted"></span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Slot fee</span>
              <span class="font-medium">$5.00</span>
            </div>
            <div class="flex justify-between font-semibold text-slate-800 pt-2 border-t border-slate-200">
              <span>Subtotal</span>
              <span x-text="'$' + $store.wizard.totalCharges.toFixed(2)"></span>
            </div>
            <div class="flex justify-between text-slate-500 text-xs">
              <span>GST (10%)</span>
              <span x-text="'$' + ($store.wizard.totalCharges * 0.10).toFixed(2)"></span>
            </div>
            <div class="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-base">
              <span>Total</span>
              <span class="text-blue-700" x-text="'$' + $store.wizard.totalWithGst"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver details */}
      <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.driverName"
            placeholder="Person physically visiting"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Phone <span class="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            x-model="$store.wizard.driverPhone"
            placeholder="+61 4XX XXX XXX"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
      </div>
    </div>

    {/* ── FCL Pickup ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isPickupFcl" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Container Number <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            x-model="$store.wizard.containerNumber"
            placeholder="e.g. MSCU1234567"
            class="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
          <button
            type="button"
            x-on:click="$store.wizard.fetchFclDetails()"
            {...{"x-bind:disabled": "$store.wizard.containerNumber.trim().length < 4 || $store.wizard.shipmentFetching"}}
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <span x-show="!$store.wizard.shipmentFetching">
              <Icon name={ICONS.search} size={16} />
            </span>
            Look Up
          </button>
        </div>
      </div>

      {/* FCL fetched data */}
      <div x-show="$store.wizard.shipmentFetched && $store.wizard.shipmentData" class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-slate-700">ICS Status:</span>
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
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Container details</p>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="bg-white rounded-lg px-3 py-2 border border-slate-100">
              <p class="text-xs text-slate-400 mb-0.5">Gross Weight</p>
              <p class="font-semibold text-slate-800" x-text="$store.wizard.shipmentData?.weightKg ? $store.wizard.shipmentData.weightKg + ' kg' : '—'"></p>
            </div>
            <div class="bg-white rounded-lg px-3 py-2 border border-slate-100">
              <p class="text-xs text-slate-400 mb-0.5">Volume</p>
              <p class="font-semibold text-slate-800" x-text="$store.wizard.shipmentData?.volumeCbm ? $store.wizard.shipmentData.volumeCbm + ' CBM' : '—'"></p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.driverName"
            placeholder="Person physically visiting"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Phone <span class="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            x-model="$store.wizard.driverPhone"
            placeholder="+61 4XX XXX XXX"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
      </div>
    </div>

    {/* ── LCL Drop-Off ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isDropoffLcl" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          House Bill Number <span class="text-slate-400 font-normal">(if known)</span>
        </label>
        <input
          type="text"
          x-model="$store.wizard.houseBillNumber"
          placeholder="e.g. SYHMSCU001847"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
        />
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Cargo Description <span class="text-red-500">*</span>
        </label>
        <textarea
          x-model="$store.wizard.cargoDescription"
          rows={2}
          placeholder="Brief description of goods, packaging, and quantities"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
        ></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Estimated Weight (kg)</label>
          <input
            type="number"
            x-model="$store.wizard.estimatedWeightKg"
            placeholder="0"
            min="0"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Estimated Volume (CBM)</label>
          <input
            type="number"
            x-model="$store.wizard.estimatedVolumeCbm"
            placeholder="0.0"
            min="0"
            step="0.1"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Destination Port</label>
        <input
          type="text"
          x-model="$store.wizard.destinationPort"
          placeholder="e.g. Shanghai, China"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.driverName"
            placeholder="Person physically visiting"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Phone <span class="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            x-model="$store.wizard.driverPhone"
            placeholder="+61 4XX XXX XXX"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
      </div>
      <p class="text-xs text-slate-400">
        <Icon name={ICONS.info} size={13} class="inline mr-1" />
        Drop-off does not incur storage charges. No ICS check required.
      </p>
    </div>

    {/* ── FCL Drop-Off ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isDropoffFcl" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Container Number <span class="text-slate-400 font-normal">(if known)</span>
        </label>
        <input
          type="text"
          x-model="$store.wizard.containerNumber"
          placeholder="e.g. MSCU1234567"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
        />
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">
          Cargo Description <span class="text-red-500">*</span>
        </label>
        <textarea
          x-model="$store.wizard.cargoDescription"
          rows={2}
          placeholder="Brief description of goods, packaging, and quantities"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Destination Port</label>
        <input
          type="text"
          x-model="$store.wizard.destinationPort"
          placeholder="e.g. Rotterdam, Netherlands"
          class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.driverName"
            placeholder="Person physically visiting"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">
            Driver Phone <span class="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            x-model="$store.wizard.driverPhone"
            placeholder="+61 4XX XXX XXX"
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>
      </div>
    </div>
  </div>
)
