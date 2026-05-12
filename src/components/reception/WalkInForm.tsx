import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertContent, AlertTitle, AlertDescription } from '@/components/ui/alert'

export const WalkInForm = () => (
  <div class="max-w-2xl">
    <Alert class="mb-6">
      <AlertContent>
        <AlertTitle>Walk-in Registration</AlertTitle>
        <AlertDescription>
          Use this form for visitors who arrive without a prior booking. A booking reference will be generated on submission.
        </AlertDescription>
      </AlertContent>
    </Alert>

    <form
      class="bg-white rounded-xl border border-slate-200 p-6 space-y-5"
      hx-post="/reception/walk-in"
      hx-target="#walk-in-result"
      hx-swap="innerHTML"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            Service Type <span class="text-red-500">*</span>
          </label>
          <select name="serviceType" class="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select…</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
            <option value="transshipment">Transshipment</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            Load Type <span class="text-red-500">*</span>
          </label>
          <select name="loadType" class="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select…</option>
            <option value="fcl">FCL</option>
            <option value="lcl">LCL</option>
            <option value="breakbulk">Breakbulk</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">
          Visitor Full Name <span class="text-red-500">*</span>
        </label>
        <Input type="text" name="visitorName" placeholder="e.g. Ahmed Raza" class="w-full" required />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
          <Input type="tel" name="phone" placeholder="03XX-XXXXXXX" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            Vehicle Registration <span class="text-red-500">*</span>
          </label>
          <Input type="text" name="vehicleReg" placeholder="LEA-1234" class="w-full uppercase" required />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">
          B/L Number <span class="text-red-500">*</span>
        </label>
        <Input type="text" name="blNumber" placeholder="e.g. COSCO2026041201" class="w-full" required />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">
          Cargo Description <span class="text-red-500">*</span>
        </label>
        <textarea name="cargoDescription" rows={2} placeholder="Brief description of cargo" class="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1.5">Assign to Slot</label>
        <select name="slotId" class="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Next available slot</option>
          <option value="immediate">Immediate / Now</option>
        </select>
      </div>

      <div class="pt-2">
        <Button type="submit" class="w-full">
          Register Walk-In
        </Button>
      </div>
    </form>

    <div id="walk-in-result" class="mt-4"></div>
  </div>
)
