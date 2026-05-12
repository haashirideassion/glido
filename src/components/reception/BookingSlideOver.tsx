import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL, ICS_BADGE_CLASS, ICS_LABEL } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  booking: Booking
}

type StatusVariant = 'warning' | 'default' | 'success' | 'secondary' | 'outline' | 'destructive'

export const BookingSlideOver = ({ booking: b }: Props) => (
  <div class="flex flex-col h-full" x-data="{ confirmModal: false, completionNotes: '' }">
    {/* Header */}
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
      <div>
        <p class="font-mono text-sm font-bold text-slate-800">{b.referenceNumber}</p>
        <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant} class="mt-1">
          {STATUS_LABEL[b.status]}
        </Badge>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onclick="document.getElementById('slide-over-backdrop').classList.add('hidden'); document.getElementById('slide-over').classList.add('translate-x-full')"
      >
        <Icon name={ICONS.close} size={22} />
      </Button>
    </div>

    {/* Body */}
    <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">

      {/* Visitor */}
      <section>
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Driver / Visitor</h3>
        <div class="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          {[
            { label: 'Driver', value: b.driverName,  icon: ICONS.user },
            { label: 'Phone',  value: b.driverPhone || '—', icon: ICONS.phone },
            { label: 'Guest',  value: b.guestName || b.driverName, icon: ICONS.users },
          ].map((row) => (
            <div key={row.label} class="flex justify-between items-center">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={row.icon} size={13} class="text-slate-400" />
                {row.label}
              </span>
              <span class="font-semibold text-xs text-slate-800">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Slot */}
      <section>
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Slot</h3>
        <div class="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-xs text-slate-400 mb-0.5">Date</p>
            <p class="font-semibold flex items-center gap-1">
              <Icon name={ICONS.calendar} size={13} class="text-slate-400" />
              {b.slotDate}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-400 mb-0.5">Time</p>
            <p class="font-semibold flex items-center gap-1">
              <Icon name={ICONS.clock} size={13} class="text-slate-400" />
              {b.slotStartTime} – {b.slotEndTime}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-400 mb-0.5">Service</p>
            <p class="font-semibold">{SERVICE_LABEL[b.serviceType]}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400 mb-0.5">Load Type</p>
            <p class="font-semibold">{LOAD_LABEL[b.loadType]}</p>
          </div>
        </div>
      </section>

      {/* Shipment */}
      <section>
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Shipment</h3>
        <div class="space-y-2 text-sm">
          {b.houseBillNumber && (
            <div class="flex justify-between items-center">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={ICONS.document} size={13} class="text-slate-400" />
                HBL
              </span>
              <span class="font-mono text-xs font-bold text-slate-700">{b.houseBillNumber}</span>
            </div>
          )}
          {b.containerNumber && (
            <div class="flex justify-between items-center">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={ICONS.container} size={13} class="text-slate-400" />
                Container
              </span>
              <span class="font-mono text-xs font-bold text-slate-700">{b.containerNumber}</span>
            </div>
          )}
          {b.weightKg && (
            <div class="flex justify-between items-center">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={ICONS.cargo} size={13} class="text-slate-400" />
                Weight
              </span>
              <span class="font-semibold text-xs">{b.weightKg.toLocaleString()} kg</span>
            </div>
          )}
          {b.volumeCbm && (
            <div class="flex justify-between items-center">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={ICONS.layers} size={13} class="text-slate-400" />
                Volume
              </span>
              <span class="font-semibold text-xs">{b.volumeCbm} CBM</span>
            </div>
          )}
          {b.packageCount && (
            <div class="flex justify-between items-center">
              <span class="text-slate-500 ml-5">Packages</span>
              <span class="font-semibold text-xs">{b.packageCount} pkgs</span>
            </div>
          )}
          {b.palletCount !== undefined && b.palletCount > 0 && (
            <div class="flex justify-between items-center">
              <span class="text-slate-500 ml-5">Pallets</span>
              <span class="font-semibold text-xs">{b.palletCount} × {b.palletType}</span>
            </div>
          )}
        </div>
      </section>

      {/* CHEP warning */}
      {b.palletType === 'chep' && (
        <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <Icon name={ICONS.warning} size={16} class="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-amber-800 text-sm">CHEP Pallet Exchange</p>
            <p class="text-xs text-amber-700 mt-0.5">
              {b.palletCount} CHEP pallet{(b.palletCount || 0) > 1 ? 's' : ''} must be exchanged at collection.
            </p>
          </div>
        </div>
      )}

      {/* ICS */}
      {b.icsStatus && (
        <section>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">ICS Status</h3>
          <div class="flex items-center justify-between bg-slate-50 rounded-xl p-3">
            <span
              class={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}
            >
              {ICS_LABEL[b.icsStatus]}
            </span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Icon name={ICONS.refresh} size={12} />
                Refresh ICS
              </button>
              <span class="text-slate-200">|</span>
              <a
                href="https://ics.abf.gov.au"
                target="_blank"
                class="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Open in ICS portal
                <Icon name={ICONS.arrowRight} size={12} />
              </a>
            </div>
          </div>
          {b.icsLastCheckedAt && (
            <p class="text-xs text-slate-400 mt-1">
              Last checked: {new Date(b.icsLastCheckedAt).toLocaleString('en-AU')}
            </p>
          )}
        </section>
      )}

      {/* Charges */}
      {b.totalAmount && (
        <section>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Charges</h3>
          <div class="space-y-1.5 text-sm">
            {b.storageCharge !== undefined && b.storageCharge > 0 && (
              <div class="flex justify-between text-slate-600">
                <span>Storage ({b.storageDays} days)</span>
                <span>${b.storageCharge.toFixed(2)}</span>
              </div>
            )}
            {b.shrinkWrapCharge !== undefined && b.shrinkWrapCharge > 0 && (
              <div class="flex justify-between text-slate-600">
                <span>Shrink wrap</span>
                <span>${b.shrinkWrapCharge.toFixed(2)}</span>
              </div>
            )}
            {b.slotFee !== undefined && (
              <div class="flex justify-between text-slate-600">
                <span>Slot fee</span>
                <span>${b.slotFee.toFixed(2)}</span>
              </div>
            )}
            {b.gstAmount !== undefined && (
              <div class="flex justify-between text-slate-500 text-xs pt-1 border-t border-slate-100">
                <span>GST (10%)</span>
                <span>${b.gstAmount.toFixed(2)}</span>
              </div>
            )}
            <div class="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>Total</span>
              <span>${b.totalAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-400">
              <span>{b.paymentMethod?.toUpperCase() || '—'}</span>
              <span class={b.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-amber-600'}>
                {b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'pending_eft' ? 'EFT Pending' : b.paymentStatus}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Name match (mock) */}
      <section>
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Identity Check</h3>
        <div class="flex items-center gap-2 text-sm">
          <span class="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Icon name={ICONS.check} size={11} />
            Name Matched
          </span>
          <span class="text-slate-400 text-xs">Driver licence verified at kiosk</span>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Timeline</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500 flex items-center gap-1.5">
              <Icon name={ICONS.document} size={13} class="text-slate-400" />
              Booking Created
            </span>
            <span class="text-xs font-medium text-slate-700">
              {new Date(b.createdAt).toLocaleString('en-AU')}
            </span>
          </div>
          {b.paymentStatus === 'paid' && (
            <div class="flex justify-between">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={ICONS.check} size={13} class="text-green-500" />
                Payment Received
              </span>
              <span class="text-xs font-medium text-slate-700">
                {new Date(b.createdAt).toLocaleString('en-AU')}
              </span>
            </div>
          )}
          {b.checkedInAt && (
            <div class="flex justify-between">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={ICONS.userCheck} size={13} class="text-blue-500" />
                Checked In
              </span>
              <span class="text-xs font-medium text-slate-700">
                {new Date(b.checkedInAt).toLocaleString('en-AU')}
              </span>
            </div>
          )}
          {b.completedAt && (
            <div class="flex justify-between">
              <span class="text-slate-500 flex items-center gap-1.5">
                <Icon name={ICONS.checkSquare} size={13} class="text-green-500" />
                Completed
              </span>
              <span class="text-xs font-medium text-slate-700">
                {new Date(b.completedAt).toLocaleString('en-AU')}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>

    {/* Action buttons */}
    <div class="shrink-0 px-6 py-4 border-t border-slate-200 space-y-2">
      {/* Check-in button for scheduled bookings */}
      {b.status === 'scheduled' && (
        <Button
          type="button"
          variant="default"
          class="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl"
          hx-post={`/reception/bookings/${b.id}/check-in`}
          hx-target="#slide-over-content"
          hx-swap="innerHTML"
        >
          <Icon name={ICONS.userCheck} size={18} />
          Check In Visitor
        </Button>
      )}

      {/* Mark Complete button for checked-in bookings */}
      {b.status === 'checked_in' && (
        <Button
          type="button"
          variant="default"
          class="w-full text-sm font-semibold py-2.5 rounded-xl"
          x-on:click="confirmModal = true"
        >
          <Icon name={ICONS.checkSquare} size={18} />
          Mark Complete
        </Button>
      )}
    </div>

    {/* Mark Complete confirmation modal */}
    <div
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      x-show="confirmModal"
      x-cloak
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-1">Complete this job?</h3>
        <p class="text-slate-500 text-sm mb-5">
          You are marking <strong>{b.driverName}</strong>'s visit as complete. This action is final.
        </p>

        {/* Checklist */}
        <div class="space-y-2.5 mb-5">
          {[
            'Driver identity verified',
            'Documents checked',
            'Cargo released',
          ].map((item) => (
            <div key={item} class="flex items-center gap-2.5 text-sm text-slate-700">
              <span class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Icon name={ICONS.check} size={12} class="text-green-600" />
              </span>
              {item}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div class="mb-5">
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Completion Notes (optional)</label>
          <textarea
            rows={2}
            x-model="completionNotes"
            placeholder="Any notes for records..."
            class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <Button
            type="button"
            variant="outline"
            class="flex-1"
            x-on:click="confirmModal = false"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            class="flex-1"
            hx-post={`/reception/bookings/${b.id}/complete`}
            hx-target="#slide-over-content"
            hx-swap="innerHTML"
            x-on:click="confirmModal = false"
          >
            <Icon name={ICONS.check} size={16} />
            Confirm Complete
          </Button>
        </div>
      </div>
    </div>
  </div>
)
