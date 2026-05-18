import { Icon, ICONS } from '../../lib/Icon'

const FIELD_LABEL = "display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;"
const FIELD_STYLE = ""  /* wizard-field class now provides padding + font-size */
const DIVIDER = "display:grid; grid-template-columns:1fr 1fr; gap:16px; padding-top:16px; margin-top:4px; border-top:1px solid rgba(0,0,0,0.07);"

export const Step5Documents = () => (
  <div x-show="$store.wizard.currentStep === 5" x-cloak>

    {/* ── Step heading ── */}
    <div style="margin-bottom:28px;">
      <h2 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.2; margin-bottom:6px;">Shipment details</h2>
      <p style="font-size:14px; color:#78716C; line-height:1.5;">Enter your HBL or container reference. ICS clearance status is checked automatically.</p>
    </div>

    {/* ── LCL Pickup ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isPickupLcl" style="display:flex; flex-direction:column; gap:20px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <label style={FIELD_LABEL}>
            House Bill Number <span style="color:#EF4444;">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.houseBillNumber"
            placeholder="e.g. SYHMSCU001847"
            class="wizard-field" style="text-transform:uppercase; letter-spacing:0.04em;"
          />
        </div>
        <div>
          <label style={FIELD_LABEL}>
            Container Number <span style="color:#EF4444;">*</span>
          </label>
          <input
            type="text"
            x-model="$store.wizard.containerNumber"
            placeholder="e.g. MSCU1234567"
            class="wizard-field" style="text-transform:uppercase; letter-spacing:0.04em;"
          />
        </div>
      </div>

      <div>
        <button
          type="button"
          x-on:click="$store.wizard.fetchShipmentDetails()"
          {...{"x-bind:disabled": "$store.wizard.houseBillNumber.trim().length < 4 || $store.wizard.shipmentFetching"}}
          class="btn-dark" style="padding:10px 18px; font-size:13px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;"
        >
          <span x-show="!$store.wizard.shipmentFetching">
            <Icon name={ICONS.search} size={16} />
          </span>
          <span x-show="$store.wizard.shipmentFetching" style="width:16px; height:16px; border:2px solid rgba(255,255,255,0.25); border-top-color:white; border-radius:9999px; animation:spin 0.7s linear infinite; display:inline-block;"></span>
          <span x-text="$store.wizard.shipmentFetching ? 'Looking up...' : 'Look Up Shipment'">Look Up Shipment</span>
        </button>
      </div>

      {/* Fetched shipment data */}
      <div x-show="$store.wizard.shipmentFetched && $store.wizard.shipmentData" style="display:flex; flex-direction:column; gap:16px;">
        {/* ICS status badge */}
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:13px; font-weight:600; color:#78716C;">ICS Status:</span>
          <span
            style="display:inline-flex; align-items:center; font-size:11px; font-weight:600; padding:3px 10px; border-radius:9999px; border:1px solid transparent;"
            {...{"x-bind:style": `$store.wizard.shipmentData?.icsStatus === 'cleared'
              ? 'background:rgba(34,197,94,0.12); color:#22C55E; border-color:rgba(34,197,94,0.22);'
              : $store.wizard.shipmentData?.icsStatus === 'held'
              ? 'background:rgba(239,68,68,0.12); color:#EF4444; border-color:rgba(239,68,68,0.22);'
              : $store.wizard.shipmentData?.icsStatus === 'examination'
              ? 'background:rgba(251,191,36,0.10); color:#FBBF24; border-color:rgba(251,191,36,0.22);'
              : 'background:rgba(0,0,0,0.04); color:#78716C; border-color:rgba(0,0,0,0.10);'`}}
            x-text="{'cleared':'Cleared','held':'Held','examination':'On Hold','pending':'Pending'}[$store.wizard.shipmentData?.icsStatus] || 'Unknown'"
          ></span>
        </div>

        {/* ICS Held warning */}
        <div x-show="$store.wizard.showIcsHeld" style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.22); border-radius:8px; padding:12px 16px; display:flex; align-items:flex-start; gap:12px;">
          <Icon name={ICONS.warning} size={18} style="color:#EF4444; flex-shrink:0; margin-top:1px;" />
          <div>
            <p style="font-weight:600; color:#EF4444; font-size:13px; margin-bottom:3px;">ICS Hold Detected</p>
            <p style="font-size:12px; color:rgba(239,68,68,0.70); line-height:1.5;">This shipment is currently held by Australian Border Force. You cannot collect until the hold is lifted. Contact your freight forwarder.</p>
          </div>
        </div>

        {/* Auto-populated fields */}
        <div style="background:#F7F6F5; border:1px solid rgba(0,0,0,0.08); border-radius:12px; padding:16px;">
          <p style="font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:12px;">Auto-populated from CFS records</p>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
            {[
              { label: 'Weight',        xtext: `$store.wizard.shipmentData?.weightKg ? $store.wizard.shipmentData.weightKg + ' kg' : '—'` },
              { label: 'Volume',        xtext: `$store.wizard.shipmentData?.volumeCbm ? $store.wizard.shipmentData.volumeCbm + ' CBM' : '—'` },
              { label: 'Packages',      xtext: `$store.wizard.shipmentData?.packageCount || '—'` },
              { label: 'Pallets',       xtext: `$store.wizard.shipmentData?.palletCount ? $store.wizard.shipmentData.palletCount + ' × ' + $store.wizard.shipmentData.palletType : '—'` },
              { label: 'Storage from',  xtext: `$store.wizard.shipmentData?.storageStartDate || '—'` },
              { label: 'Days in store', xtext: `$store.wizard.shipmentData?.storageDays ? $store.wizard.shipmentData.storageDays + ' days' : '—'` },
            ].map((item) => (
              <div key={item.label} style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:8px; padding:10px 12px;">
                <p style="font-size:10px; color:#78716C; margin-bottom:3px;">{item.label}</p>
                <p style="font-weight:600; color:#1C1917; font-size:13px;" x-text={item.xtext}></p>
              </div>
            ))}
          </div>
        </div>

        {/* CHEP warning */}
        <div x-show="$store.wizard.showChepWarning" style="background:rgba(217,119,6,0.08); border:1px solid rgba(217,119,6,0.25); border-radius:10px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px;">
          <Icon name={ICONS.warning} size={18} style="color:#D97706; flex-shrink:0; margin-top:1px;" />
          <div>
            <p style="font-weight:600; color:#B45309; font-size:13px; margin-bottom:3px;">CHEP Pallet Exchange Required</p>
            <p style="font-size:12px; color:#92400E; line-height:1.5;">
              Your shipment is on CHEP pallets. You must bring the same number of empty CHEP pallets to exchange when collecting.
            </p>
          </div>
        </div>

        {/* Charges breakdown */}
        <div style="background:#F7F6F5; border:1px solid rgba(0,0,0,0.08); border-radius:12px; padding:16px;">
          <p style="font-size:13px; font-weight:600; color:#1C1917; margin-bottom:12px;">Estimated Charges</p>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:13px;">
            <div style="display:flex; justify-content:space-between; color:#78716C;">
              <span>Storage charge</span>
              <span style="font-weight:500;" x-text="$store.wizard.storageChargeFormatted"></span>
            </div>
            <div style="display:flex; justify-content:space-between; color:#78716C;">
              <span>Shrink wrap</span>
              <span style="font-weight:500;" x-text="$store.wizard.shrinkWrapFormatted"></span>
            </div>
            <div style="display:flex; justify-content:space-between; color:#78716C;">
              <span>Slot fee</span>
              <span style="font-weight:500;">$5.00</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:600; color:#1C1917; padding-top:8px; border-top:1px solid rgba(0,0,0,0.07); margin-top:4px;">
              <span>Subtotal</span>
              <span x-text="'$' + $store.wizard.totalCharges.toFixed(2)"></span>
            </div>
            <div style="display:flex; justify-content:space-between; color:#78716C; font-size:12px;">
              <span>GST (10%)</span>
              <span x-text="'$' + ($store.wizard.totalCharges * 0.10).toFixed(2)"></span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:700; color:#1C1917; padding-top:8px; border-top:1px solid rgba(0,0,0,0.07); font-size:15px;">
              <span>Total</span>
              <span style="color:#FC6514;" x-text="'$' + $store.wizard.totalWithGst"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver details */}
      <div style={DIVIDER}>
        <div>
          <label style={FIELD_LABEL}>Driver Name <span style="color:#EF4444;">*</span></label>
          <input type="text" x-model="$store.wizard.driverName" placeholder="Person physically visiting" class="wizard-field" style={FIELD_STYLE} />
        </div>
        <div>
          <label style={FIELD_LABEL}>Driver Phone <span style="color:#A8A29E; font-weight:400; font-size:10px;">(optional)</span></label>
          <input type="tel" x-model="$store.wizard.driverPhone" placeholder="+61 4XX XXX XXX" class="wizard-field" style={FIELD_STYLE} />
        </div>
      </div>
    </div>

    {/* ── FCL Pickup ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isPickupFcl" style="display:flex; flex-direction:column; gap:20px;">
      <div>
        <label style={FIELD_LABEL}>Container Number <span style="color:#EF4444;">*</span></label>
        <div style="display:flex; gap:8px;">
          <input
            type="text"
            x-model="$store.wizard.containerNumber"
            placeholder="e.g. MSCU1234567"
            class="wizard-field" style="flex:1; text-transform:uppercase; letter-spacing:0.04em;"
          />
          <button
            type="button"
            x-on:click="$store.wizard.fetchFclDetails()"
            {...{"x-bind:disabled": "$store.wizard.containerNumber.trim().length < 4 || $store.wizard.shipmentFetching"}}
            class="btn-dark" style="padding:10px 18px; font-size:13px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; flex-shrink:0;"
          >
            <span x-show="!$store.wizard.shipmentFetching"><Icon name={ICONS.search} size={16} /></span>
            Look Up
          </button>
        </div>
      </div>

      {/* FCL fetched data */}
      <div x-show="$store.wizard.shipmentFetched && $store.wizard.shipmentData" style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:13px; font-weight:600; color:#78716C;">ICS Status:</span>
          <span
            style="display:inline-flex; align-items:center; font-size:11px; font-weight:600; padding:3px 10px; border-radius:9999px; border:1px solid transparent;"
            {...{"x-bind:style": `$store.wizard.shipmentData?.icsStatus === 'cleared'
              ? 'background:rgba(34,197,94,0.12); color:#22C55E; border-color:rgba(34,197,94,0.22);'
              : $store.wizard.shipmentData?.icsStatus === 'held'
              ? 'background:rgba(239,68,68,0.12); color:#EF4444; border-color:rgba(239,68,68,0.22);'
              : 'background:rgba(0,0,0,0.04); color:#78716C; border-color:rgba(0,0,0,0.10);'`}}
            x-text="{'cleared':'Cleared','held':'Held','examination':'On Hold','pending':'Pending'}[$store.wizard.shipmentData?.icsStatus] || 'Unknown'"
          ></span>
        </div>
        <div style="background:#F7F6F5; border:1px solid rgba(0,0,0,0.08); border-radius:12px; padding:16px;">
          <p style="font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:12px;">Container details</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:8px; padding:10px 12px;">
              <p style="font-size:10px; color:#78716C; margin-bottom:3px;">Gross Weight</p>
              <p style="font-weight:600; color:#1C1917; font-size:13px;" x-text="$store.wizard.shipmentData?.weightKg ? $store.wizard.shipmentData.weightKg + ' kg' : '—'"></p>
            </div>
            <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:8px; padding:10px 12px;">
              <p style="font-size:10px; color:#78716C; margin-bottom:3px;">Volume</p>
              <p style="font-weight:600; color:#1C1917; font-size:13px;" x-text="$store.wizard.shipmentData?.volumeCbm ? $store.wizard.shipmentData.volumeCbm + ' CBM' : '—'"></p>
            </div>
          </div>
        </div>
      </div>

      <div style={DIVIDER}>
        <div>
          <label style={FIELD_LABEL}>Driver Name <span style="color:#EF4444;">*</span></label>
          <input type="text" x-model="$store.wizard.driverName" placeholder="Person physically visiting" class="wizard-field" style={FIELD_STYLE} />
        </div>
        <div>
          <label style={FIELD_LABEL}>Driver Phone <span style="color:#A8A29E; font-weight:400; font-size:10px;">(optional)</span></label>
          <input type="tel" x-model="$store.wizard.driverPhone" placeholder="+61 4XX XXX XXX" class="wizard-field" style={FIELD_STYLE} />
        </div>
      </div>
    </div>

    {/* ── LCL Drop-Off ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isDropoffLcl" style="display:flex; flex-direction:column; gap:16px;">
      <div>
        <label style={FIELD_LABEL}>House Bill Number <span style="color:#A8A29E; font-weight:400; font-size:10px;">(if known)</span></label>
        <input type="text" x-model="$store.wizard.houseBillNumber" placeholder="e.g. SYHMSCU001847" class="wizard-field" style="text-transform:uppercase; letter-spacing:0.04em;" />
      </div>
      <div>
        <label style={FIELD_LABEL}>Cargo Description <span style="color:#EF4444;">*</span></label>
        <textarea x-model="$store.wizard.cargoDescription" rows={2} placeholder="Brief description of goods, packaging, and quantities" class="wizard-field" style="resize:none;"></textarea>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <label style={FIELD_LABEL}>Estimated Weight (kg)</label>
          <input type="number" x-model="$store.wizard.estimatedWeightKg" placeholder="0" min="0" class="wizard-field" style={FIELD_STYLE} />
        </div>
        <div>
          <label style={FIELD_LABEL}>Estimated Volume (CBM)</label>
          <input type="number" x-model="$store.wizard.estimatedVolumeCbm" placeholder="0.0" min="0" step="0.1" class="wizard-field" style={FIELD_STYLE} />
        </div>
      </div>
      <div>
        <label style={FIELD_LABEL}>Destination Port</label>
        <input type="text" x-model="$store.wizard.destinationPort" placeholder="e.g. Shanghai, China" class="wizard-field" style={FIELD_STYLE} />
      </div>
      <div style={DIVIDER}>
        <div>
          <label style={FIELD_LABEL}>Driver Name <span style="color:#EF4444;">*</span></label>
          <input type="text" x-model="$store.wizard.driverName" placeholder="Person physically visiting" class="wizard-field" style={FIELD_STYLE} />
        </div>
        <div>
          <label style={FIELD_LABEL}>Driver Phone <span style="color:#A8A29E; font-weight:400; font-size:10px;">(optional)</span></label>
          <input type="tel" x-model="$store.wizard.driverPhone" placeholder="+61 4XX XXX XXX" class="wizard-field" style={FIELD_STYLE} />
        </div>
      </div>
      <p style="font-size:12px; color:#78716C; display:flex; align-items:center; gap:6px;">
        <Icon name={ICONS.info} size={13} style="flex-shrink:0;" />
        Drop-off does not incur storage charges. No ICS check required.
      </p>
    </div>

    {/* ── FCL Drop-Off ─────────────────────────────────────────────── */}
    <div x-show="$store.wizard.isDropoffFcl" style="display:flex; flex-direction:column; gap:16px;">
      <div>
        <label style={FIELD_LABEL}>Container Number <span style="color:#A8A29E; font-weight:400; font-size:10px;">(if known)</span></label>
        <input type="text" x-model="$store.wizard.containerNumber" placeholder="e.g. MSCU1234567" class="wizard-field" style="text-transform:uppercase; letter-spacing:0.04em;" />
      </div>
      <div>
        <label style={FIELD_LABEL}>Cargo Description <span style="color:#EF4444;">*</span></label>
        <textarea x-model="$store.wizard.cargoDescription" rows={2} placeholder="Brief description of goods, packaging, and quantities" class="wizard-field" style="resize:none;"></textarea>
      </div>
      <div>
        <label style={FIELD_LABEL}>Destination Port</label>
        <input type="text" x-model="$store.wizard.destinationPort" placeholder="e.g. Rotterdam, Netherlands" class="wizard-field" style={FIELD_STYLE} />
      </div>
      <div style={DIVIDER}>
        <div>
          <label style={FIELD_LABEL}>Driver Name <span style="color:#EF4444;">*</span></label>
          <input type="text" x-model="$store.wizard.driverName" placeholder="Person physically visiting" class="wizard-field" style={FIELD_STYLE} />
        </div>
        <div>
          <label style={FIELD_LABEL}>Driver Phone <span style="color:#A8A29E; font-weight:400; font-size:10px;">(optional)</span></label>
          <input type="tel" x-model="$store.wizard.driverPhone" placeholder="+61 4XX XXX XXX" class="wizard-field" style={FIELD_STYLE} />
        </div>
      </div>
    </div>
  </div>
)
