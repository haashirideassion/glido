import { Icon, ICONS } from '../../lib/Icon'

export const Step6ContactVehicle = () => (
  <div
    x-show="$store.wizard.currentStep === 6"
    x-cloak
    x-data="{ documents: [], dragging: false, addFile(name, size) { this.documents.push({ name, size }) }, removeFile(i) { this.documents.splice(i, 1) } }"
  >
    {/* ── Step heading ── */}
    <div style="margin-bottom:28px;">
      <h2 style="font-size:22px; font-weight:700; color:#1C1917; letter-spacing:-0.03em; line-height:1.2; margin-bottom:6px;">Documents</h2>
      <p style="font-size:14px; color:#78716C; line-height:1.5;">Upload your Delivery Order and any required customs paperwork.</p>
    </div>

    {/* Required docs checklist */}
    <div style="background:#fff; border:1.5px solid #e5e7eb; border-radius:12px; padding:16px; margin-bottom:20px;">
      <p style="font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:12px;">Required Documents</p>
      <ul style="display:flex; flex-direction:column; gap:10px; list-style:none; padding:0; margin:0;">
        <li style="display:flex; align-items:center; gap:10px; font-size:13px;">
          <span
            style="width:20px; height:20px; border-radius:9999px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"
            {...{"x-bind:style": "documents.length > 0 ? 'background:rgba(34,197,94,0.14); color:#22C55E;' : 'background:rgba(0,0,0,0.05); color:#A8A29E;'"}}
          >
            <Icon name={ICONS.check} size={12} />
          </span>
          <span style="color:#1C1917;">Delivery Order</span>
          <span style="font-size:11px; color:#EF4444; font-weight:600;">Required</span>
        </li>
        <li
          x-show="$store.wizard.serviceType === 'dropoff'"
          style="display:flex; align-items:center; gap:10px; font-size:13px;"
        >
          <span style="width:20px; height:20px; border-radius:9999px; background:rgba(0,0,0,0.05); color:#A8A29E; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <Icon name={ICONS.check} size={12} />
          </span>
          <span style="color:#1C1917;">Packing List</span>
          <span style="font-size:11px; color:#EF4444; font-weight:600;">Required for drop-offs</span>
        </li>
        <li style="display:flex; align-items:center; gap:10px; font-size:13px; color:#78716C;">
          <span style="width:20px; height:20px; border-radius:9999px; background:rgba(0,0,0,0.03); color:rgba(0,0,0,0.20); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <Icon name={ICONS.check} size={12} />
          </span>
          <span>Import Permit</span>
          <span style="font-size:11px; color:#78716C; font-weight:600;">If applicable</span>
        </li>
      </ul>
    </div>

    {/* Drop zone */}
    <div
      style="border:2px dashed #e5e7eb; border-radius:12px; background:#fafafa; padding:40px 24px; text-align:center; transition:border-color 0.15s ease, background 0.15s ease; cursor:pointer;"
      {...{"x-bind:style": "dragging ? 'border-color:#FC6514; background:rgba(252,101,20,0.03);' : ''"}}
      {...{"x-on:dragover.prevent": "dragging = true"}}
      {...{"x-on:dragleave.prevent": "dragging = false"}}
      {...{"x-on:drop.prevent": "dragging = false; const files = Array.from($event.dataTransfer.files); files.forEach(f => addFile(f.name, f.size))"}}
    >
      <div style="width:44px; height:44px; border-radius:10px; background:rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center; margin:0 auto 14px;">
        <Icon name={ICONS.upload} size={22} style="color:#78716C;" />
      </div>
      <p style="font-size:14px; font-weight:600; color:#1C1917; margin-bottom:4px;">Drag &amp; drop your files here, or click to browse</p>
      <p style="font-size:12px; color:#78716C; margin-bottom:18px;">PDF, JPG, PNG — max 10 MB each</p>
      <label class="btn-ghost" style="padding:9px 18px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
        <Icon name={ICONS.upload} size={14} />
        Browse files
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          style="display:none;"
          x-on:change="const files = Array.from($event.target.files); files.forEach(f => addFile(f.name, f.size))"
        />
      </label>
    </div>

    {/* File list */}
    <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px;" x-show="documents.length > 0">
      <p style="font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase;">Uploaded files</p>
      <template x-for="(doc, i) in documents" {...{"x-key": "i"}}>
        <div style="display:flex; align-items:center; justify-content:space-between; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:10px; min-width:0;">
            <Icon name={ICONS.document} size={18} style="color:#78716C; flex-shrink:0;" />
            <div style="min-width:0;">
              <p style="font-size:13px; font-weight:500; color:#1C1917; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" x-text="doc.name"></p>
              <p style="font-size:11px; color:#78716C;" x-text="doc.size ? (doc.size / 1024).toFixed(0) + ' KB' : ''"></p>
            </div>
          </div>
          <button
            type="button"
            x-on:click="removeFile(i)"
            style="margin-left:12px; flex-shrink:0; color:#78716C; background:transparent; border:none; cursor:pointer; padding:4px; border-radius:4px; transition:color 0.12s ease;"
            onmouseover="this.style.color='#EF4444';"
            onmouseout="this.style.color='#78716C';"
          >
            <Icon name={ICONS.trash} size={16} />
          </button>
        </div>
      </template>
    </div>

    {/* Pick-up note */}
    <div
      x-show="$store.wizard.serviceType === 'pickup'"
      style="margin-top:16px; background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20); border-radius:8px; padding:12px 16px; font-size:12px; color:#FBBF24; display:flex; align-items:flex-start; gap:10px; line-height:1.6;"
    >
      <Icon name={ICONS.info} size={14} style="color:#FBBF24; flex-shrink:0; margin-top:1px;" />
      <span>For pick-ups, a Delivery Order is required. You cannot proceed to payment without uploading one.</span>
    </div>

    {/* Drop-off note */}
    <div
      x-show="$store.wizard.serviceType === 'dropoff'"
      style="margin-top:16px; background:rgba(0,0,0,0.025); border:1px solid rgba(0,0,0,0.08); border-radius:8px; padding:12px 16px; font-size:12px; color:#78716C; display:flex; align-items:flex-start; gap:10px; line-height:1.6;"
    >
      <Icon name={ICONS.info} size={14} style="color:#78716C; flex-shrink:0; margin-top:1px;" />
      <span>For drop-offs, a Delivery Order may not be required if your consignment has not been issued one yet. Upload what you have.</span>
    </div>
  </div>
)
