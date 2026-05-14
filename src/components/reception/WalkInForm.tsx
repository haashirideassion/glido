import { Button } from '@/components/ui/button'

export const WalkInForm = () => (
  <div class="max-w-2xl">
    {/* Info banner */}
    <div
      class="mb-6 rounded-xl px-4 py-3 flex items-start gap-3"
      style="background:#FEF3C7; border:1px solid rgba(245,158,11,0.3); border-radius:12px"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <p class="font-semibold text-sm" style="color:#92400E">Walk-in Registration</p>
        <p class="text-xs mt-0.5" style="color:#B45309">
          Use this form for visitors who arrive without a prior booking. A booking reference will be generated on submission.
        </p>
      </div>
    </div>

    <form
      class="rounded-xl p-6 space-y-5"
      style="background:#FCFBF8; border:1px solid #D6D3D1; border-radius:12px; box-shadow:rgba(0,0,0,0) 0 0 0 0,rgba(0,0,0,0) 0 0 0 0,rgba(0,0,0,0.05) 0 1px 2px 0"
      hx-post="/reception/walk-in"
      hx-target="#walk-in-result"
      hx-swap="innerHTML"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color:#57534E">
            Service Type <span style="color:#DC2626">*</span>
          </label>
          <select
            name="serviceType"
            class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none"
            style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
            onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
            onblur="this.style.outline='none'"
          >
            <option value="">Select…</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
            <option value="transshipment">Transshipment</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color:#57534E">
            Load Type <span style="color:#DC2626">*</span>
          </label>
          <select
            name="loadType"
            class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none"
            style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
            onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
            onblur="this.style.outline='none'"
          >
            <option value="">Select…</option>
            <option value="fcl">FCL</option>
            <option value="lcl">LCL</option>
            <option value="breakbulk">Breakbulk</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5" style="color:#57534E">
          Visitor Full Name <span style="color:#DC2626">*</span>
        </label>
        <input
          type="text"
          name="visitorName"
          placeholder="e.g. Ahmed Raza"
          required
          class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color:#57534E">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="03XX-XXXXXXX"
            class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none"
            style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
            onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
            onblur="this.style.outline='none'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color:#57534E">
            Vehicle Registration <span style="color:#DC2626">*</span>
          </label>
          <input
            type="text"
            name="vehicleReg"
            placeholder="LEA-1234"
            required
            class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none uppercase"
            style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
            onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
            onblur="this.style.outline='none'"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5" style="color:#57534E">
          B/L Number <span style="color:#DC2626">*</span>
        </label>
        <input
          type="text"
          name="blNumber"
          placeholder="e.g. COSCO2026041201"
          required
          class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5" style="color:#57534E">
          Cargo Description <span style="color:#DC2626">*</span>
        </label>
        <textarea
          name="cargoDescription"
          rows={2}
          placeholder="Brief description of cargo"
          required
          class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none resize-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5" style="color:#57534E">Assign to Slot</label>
        <select
          name="slotId"
          class="w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none"
          style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
          onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
          onblur="this.style.outline='none'"
        >
          <option value="">Next available slot</option>
          <option value="immediate">Immediate / Now</option>
        </select>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="w-full font-medium text-sm py-2.5 rounded-lg"
          style="background:#F59E0B; color:#FFFFFF; border-radius:6px; font-size:12px; font-weight:500"
          onmouseover="this.style.background='#D97706'"
          onmouseout="this.style.background='#F59E0B'"
        >
          Register Walk-In
        </button>
      </div>
    </form>

    <div id="walk-in-result" class="mt-4"></div>
  </div>
)
