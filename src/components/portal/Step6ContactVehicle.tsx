import { Icon, ICONS } from '../../lib/Icon'

export const Step6ContactVehicle = () => (
  <div
    x-show="$store.wizard.currentStep === 6"
    x-cloak
    x-data="{ documents: [], dragging: false, addFile(name, size) { this.documents.push({ name, size }) }, removeFile(i) { this.documents.splice(i, 1) } }"
  >
    <h2 class="text-xl font-bold text-slate-900 mb-1">Upload your Delivery Order</h2>
    <p class="text-slate-500 text-sm mb-6">Upload your Delivery Order and any other required documents before proceeding to payment.</p>

    {/* Required docs checklist */}
    <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Required Documents</p>
      <ul class="space-y-2.5">
        <li class="flex items-center gap-3 text-sm">
          <span
            class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            {...{"x-bind:class": "documents.length > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'"}}
          >
            <Icon name={ICONS.check} size={12} />
          </span>
          <span class="text-slate-700">Delivery Order</span>
          <span class="text-xs text-red-500 font-medium">Required</span>
        </li>
        <li
          x-show="$store.wizard.serviceType === 'dropoff'"
          class="flex items-center gap-3 text-sm"
        >
          <span class="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
            <Icon name={ICONS.check} size={12} />
          </span>
          <span class="text-slate-700">Packing List</span>
          <span class="text-xs text-red-500 font-medium">Required for drop-offs</span>
        </li>
        <li class="flex items-center gap-3 text-sm text-slate-500">
          <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center shrink-0">
            <Icon name={ICONS.check} size={12} />
          </span>
          <span>Import Permit</span>
          <span class="text-xs text-slate-400 font-medium">If applicable</span>
        </li>
      </ul>
    </div>

    {/* Drop zone */}
    <div
      class="border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer"
      {...{"x-bind:class": "dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'"}}
      {...{"x-on:dragover.prevent": "dragging = true"}}
      {...{"x-on:dragleave.prevent": "dragging = false"}}
      {...{"x-on:drop.prevent": "dragging = false; const files = Array.from($event.dataTransfer.files); files.forEach(f => addFile(f.name, f.size))"}}
    >
      <Icon name={ICONS.upload} size={36} class="mx-auto mb-3 text-slate-300" />
      <p class="text-sm font-semibold text-slate-600 mb-1">Drag &amp; drop your files here, or click to browse</p>
      <p class="text-xs text-slate-400 mb-4">PDF, JPG, PNG — max 10 MB each</p>
      <label class="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl cursor-pointer transition-colors">
        <Icon name={ICONS.upload} size={15} />
        Browse files
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          class="sr-only"
          x-on:change="const files = Array.from($event.target.files); files.forEach(f => addFile(f.name, f.size))"
        />
      </label>
    </div>

    {/* File list */}
    <div class="mt-4 space-y-2" x-show="documents.length > 0">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Uploaded files</p>
      <template x-for="(doc, i) in documents" {...{"x-key": "i"}}>
        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
          <div class="flex items-center gap-3 min-w-0">
            <Icon name={ICONS.document} size={18} class="text-blue-500 shrink-0" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate" x-text="doc.name"></p>
              <p class="text-xs text-slate-400" x-text="doc.size ? (doc.size / 1024).toFixed(0) + ' KB' : ''"></p>
            </div>
          </div>
          <button
            type="button"
            x-on:click="removeFile(i)"
            class="ml-3 shrink-0 text-slate-400 hover:text-red-500 transition-colors p-1"
          >
            <Icon name={ICONS.trash} size={16} />
          </button>
        </div>
      </template>
    </div>

    {/* Pick-up note */}
    <div
      x-show="$store.wizard.serviceType === 'pickup'"
      class="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-start gap-2"
    >
      <Icon name={ICONS.info} size={14} class="text-amber-500 shrink-0 mt-0.5" />
      <span>For pick-ups, a Delivery Order is required. You cannot proceed to payment without uploading one.</span>
    </div>

    {/* Drop-off note */}
    <div
      x-show="$store.wizard.serviceType === 'dropoff'"
      class="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2"
    >
      <Icon name={ICONS.info} size={14} class="text-blue-500 shrink-0 mt-0.5" />
      <span>For drop-offs, a Delivery Order may not be required if your consignment has not been issued one yet. Upload what you have.</span>
    </div>
  </div>
)
