import { Icon, ICONS } from '../../lib/Icon'

export const Step6ContactVehicle = () => (
  <div
    x-show="$store.wizard.currentStep === 6"
    x-cloak
    x-data="{ documents: [], dragging: false, addFile(name, size) { this.documents.push({ name, size }) }, removeFile(i) { this.documents.splice(i, 1) } }"
  >
    <h2 style="font-size:18px; font-weight:700; color:#F1F5F9; letter-spacing:-0.03em; margin-bottom:3px;">Upload your Delivery Order</h2>
    <p style="font-size:13px; color:#64748B; margin-bottom:28px; line-height:1.5;">Upload your Delivery Order and any other required documents before proceeding to payment.</p>

    {/* Required docs checklist */}
    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:10px; padding:16px; margin-bottom:20px;">
      <p style="font-size:10px; font-weight:700; color:#64748B; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:12px;">Required Documents</p>
      <ul style="display:flex; flex-direction:column; gap:10px; list-style:none; padding:0; margin:0;">
        <li style="display:flex; align-items:center; gap:10px; font-size:13px;">
          <span
            style="width:20px; height:20px; border-radius:9999px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"
            {...{"x-bind:style": "documents.length > 0 ? 'background:rgba(34,197,94,0.14); color:#22C55E;' : 'background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.25);'"}}
          >
            <Icon name={ICONS.check} size={12} />
          </span>
          <span style="color:#F1F5F9;">Delivery Order</span>
          <span style="font-size:11px; color:#EF4444; font-weight:600;">Required</span>
        </li>
        <li
          x-show="$store.wizard.serviceType === 'dropoff'"
          style="display:flex; align-items:center; gap:10px; font-size:13px;"
        >
          <span style="width:20px; height:20px; border-radius:9999px; background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <Icon name={ICONS.check} size={12} />
          </span>
          <span style="color:#F1F5F9;">Packing List</span>
          <span style="font-size:11px; color:#EF4444; font-weight:600;">Required for drop-offs</span>
        </li>
        <li style="display:flex; align-items:center; gap:10px; font-size:13px; color:#64748B;">
          <span style="width:20px; height:20px; border-radius:9999px; background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <Icon name={ICONS.check} size={12} />
          </span>
          <span>Import Permit</span>
          <span style="font-size:11px; color:#64748B; font-weight:600;">If applicable</span>
        </li>
      </ul>
    </div>

    {/* Drop zone */}
    <div
      style="border:2px dashed rgba(255,255,255,0.13); border-radius:10px; padding:40px 24px; text-align:center; transition:border-color 0.15s ease, background 0.15s ease; cursor:pointer;"
      {...{"x-bind:style": "dragging ? 'border-color:rgba(252,101,20,0.50); background:rgba(252,101,20,0.05);' : ''"}}
      {...{"x-on:dragover.prevent": "dragging = true"}}
      {...{"x-on:dragleave.prevent": "dragging = false"}}
      {...{"x-on:drop.prevent": "dragging = false; const files = Array.from($event.dataTransfer.files); files.forEach(f => addFile(f.name, f.size))"}}
    >
      <div style="width:44px; height:44px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.06);">
        <Icon name={ICONS.upload} size={22} style="color:#64748B;" />
      </div>
      <p style="font-size:14px; font-weight:600; color:#F1F5F9; margin-bottom:4px;">Drag &amp; drop your files here, or click to browse</p>
      <p style="font-size:12px; color:#64748B; margin-bottom:18px;">PDF, JPG, PNG — max 10 MB each</p>
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
      <p style="font-size:10px; font-weight:700; color:#64748B; letter-spacing:0.09em; text-transform:uppercase;">Uploaded files</p>
      <template x-for="(doc, i) in documents" {...{"x-key": "i"}}>
        <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:8px; padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:10px; min-width:0;">
            <Icon name={ICONS.document} size={18} style="color:#94A3B8; flex-shrink:0;" />
            <div style="min-width:0;">
              <p style="font-size:13px; font-weight:500; color:#F1F5F9; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" x-text="doc.name"></p>
              <p style="font-size:11px; color:#64748B;" x-text="doc.size ? (doc.size / 1024).toFixed(0) + ' KB' : ''"></p>
            </div>
          </div>
          <button
            type="button"
            x-on:click="removeFile(i)"
            style="margin-left:12px; flex-shrink:0; color:#64748B; background:transparent; border:none; cursor:pointer; padding:4px; border-radius:4px; transition:color 0.12s ease;"
            onmouseover="this.style.color='#EF4444';"
            onmouseout="this.style.color='#64748B';"
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
      style="margin-top:16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:8px; padding:12px 16px; font-size:12px; color:#64748B; display:flex; align-items:flex-start; gap:10px; line-height:1.6;"
    >
      <Icon name={ICONS.info} size={14} style="color:#64748B; flex-shrink:0; margin-top:1px;" />
      <span>For drop-offs, a Delivery Order may not be required if your consignment has not been issued one yet. Upload what you have.</span>
    </div>
  </div>
)
