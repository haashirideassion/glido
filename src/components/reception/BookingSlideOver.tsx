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
    <div
      class="flex items-center justify-between px-6 py-4 shrink-0"
      style="border-bottom:1px solid #D6D3D1; background:#FCFBF8"
    >
      <div>
        <p class="font-mono text-sm font-bold" style="color:#44403C">{b.referenceNumber}</p>
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
    <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5" style="background:#FCFBF8">

      {/* Visitor */}
      <section>
        <h3
          class="mb-3"
          style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
        >
          Driver / Visitor
        </h3>
        <div class="rounded-xl p-4 space-y-2 text-sm" style="background:#F5F3EC; border:1px solid rgba(231,229,228,0.5)">
          {[
            { label: 'Driver', value: b.driverName,  icon: ICONS.user },
            { label: 'Phone',  value: b.driverPhone || '—', icon: ICONS.phone },
            { label: 'Guest',  value: b.guestName || b.driverName, icon: ICONS.users },
          ].map((row) => (
            <div key={row.label} class="flex justify-between items-center">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={row.icon} size={13} style="color:#A8A29E" />
                {row.label}
              </span>
              <span class="font-semibold text-xs" style="color:#44403C">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Slot */}
      <section>
        <h3
          class="mb-3"
          style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
        >
          Slot
        </h3>
        <div class="rounded-xl p-4 grid grid-cols-2 gap-3 text-sm" style="background:#F5F3EC; border:1px solid rgba(231,229,228,0.5)">
          <div>
            <p class="text-xs mb-0.5" style="color:#A8A29E">Date</p>
            <p class="font-semibold flex items-center gap-1" style="color:#44403C">
              <Icon name={ICONS.calendar} size={13} style="color:#A8A29E" />
              {b.slotDate}
            </p>
          </div>
          <div>
            <p class="text-xs mb-0.5" style="color:#A8A29E">Time</p>
            <p class="font-semibold flex items-center gap-1" style="color:#44403C">
              <Icon name={ICONS.clock} size={13} style="color:#A8A29E" />
              {b.slotStartTime} – {b.slotEndTime}
            </p>
          </div>
          <div>
            <p class="text-xs mb-0.5" style="color:#A8A29E">Service</p>
            <p class="font-semibold" style="color:#44403C">{SERVICE_LABEL[b.serviceType]}</p>
          </div>
          <div>
            <p class="text-xs mb-0.5" style="color:#A8A29E">Load Type</p>
            <p class="font-semibold" style="color:#44403C">{LOAD_LABEL[b.loadType]}</p>
          </div>
        </div>
      </section>

      {/* Shipment */}
      <section>
        <h3
          class="mb-3"
          style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
        >
          Shipment
        </h3>
        <div class="space-y-2 text-sm">
          {b.houseBillNumber && (
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={ICONS.document} size={13} style="color:#A8A29E" />
                HBL
              </span>
              <span class="font-mono text-xs font-bold" style="color:#57534E">{b.houseBillNumber}</span>
            </div>
          )}
          {b.containerNumber && (
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={ICONS.container} size={13} style="color:#A8A29E" />
                Container
              </span>
              <span class="font-mono text-xs font-bold" style="color:#57534E">{b.containerNumber}</span>
            </div>
          )}
          {b.weightKg && (
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={ICONS.cargo} size={13} style="color:#A8A29E" />
                Weight
              </span>
              <span class="font-semibold text-xs" style="color:#44403C">{b.weightKg.toLocaleString()} kg</span>
            </div>
          )}
          {b.volumeCbm && (
            <div class="flex justify-between items-center">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={ICONS.layers} size={13} style="color:#A8A29E" />
                Volume
              </span>
              <span class="font-semibold text-xs" style="color:#44403C">{b.volumeCbm} CBM</span>
            </div>
          )}
          {b.packageCount && (
            <div class="flex justify-between items-center">
              <span class="ml-5" style="color:#78716C">Packages</span>
              <span class="font-semibold text-xs" style="color:#44403C">{b.packageCount} pkgs</span>
            </div>
          )}
          {b.palletCount !== undefined && b.palletCount > 0 && (
            <div class="flex justify-between items-center">
              <span class="ml-5" style="color:#78716C">Pallets</span>
              <span class="font-semibold text-xs" style="color:#44403C">{b.palletCount} × {b.palletType}</span>
            </div>
          )}
        </div>
      </section>

      {/* CHEP warning */}
      {b.palletType === 'chep' && (
        <div class="border rounded-xl px-4 py-3 flex items-start gap-2" style="background:#FFFBEB; border-color:#FDE68A">
          <Icon name={ICONS.warning} size={16} class="shrink-0 mt-0.5" style="color:#D97706" />
          <div>
            <p class="font-semibold text-sm" style="color:#92400E">CHEP Pallet Exchange</p>
            <p class="text-xs mt-0.5" style="color:#B45309">
              {b.palletCount} CHEP pallet{(b.palletCount || 0) > 1 ? 's' : ''} must be exchanged at collection.
            </p>
          </div>
        </div>
      )}

      {/* ICS */}
      {b.icsStatus && (
        <section>
          <h3
            class="mb-3"
            style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
          >
            ICS Status
          </h3>
          <div class="flex items-center justify-between rounded-xl p-3" style="background:#F5F3EC; border:1px solid rgba(231,229,228,0.5)">
            <span
              class={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}
            >
              {ICS_LABEL[b.icsStatus]}
            </span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="text-xs flex items-center gap-1 hover:underline"
                style="color:#F59E0B"
              >
                <Icon name={ICONS.refresh} size={12} />
                Refresh ICS
              </button>
              <span style="color:#D6D3D1">|</span>
              <a
                href="https://ics.abf.gov.au"
                target="_blank"
                class="text-xs flex items-center gap-1 hover:underline"
                style="color:#F59E0B"
              >
                Open in ICS portal
                <Icon name={ICONS.arrowRight} size={12} />
              </a>
            </div>
          </div>
          {b.icsLastCheckedAt && (
            <p class="text-xs mt-1" style="color:#A8A29E">
              Last checked: {new Date(b.icsLastCheckedAt).toLocaleString('en-AU')}
            </p>
          )}
        </section>
      )}

      {/* Charges */}
      {b.totalAmount && (
        <section>
          <h3
            class="mb-3"
            style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
          >
            Charges
          </h3>
          <div class="space-y-1.5 text-sm">
            {b.storageCharge !== undefined && b.storageCharge > 0 && (
              <div class="flex justify-between" style="color:#78716C">
                <span>Storage ({b.storageDays} days)</span>
                <span>${b.storageCharge.toFixed(2)}</span>
              </div>
            )}
            {b.shrinkWrapCharge !== undefined && b.shrinkWrapCharge > 0 && (
              <div class="flex justify-between" style="color:#78716C">
                <span>Shrink wrap</span>
                <span>${b.shrinkWrapCharge.toFixed(2)}</span>
              </div>
            )}
            {b.slotFee !== undefined && (
              <div class="flex justify-between" style="color:#78716C">
                <span>Slot fee</span>
                <span>${b.slotFee.toFixed(2)}</span>
              </div>
            )}
            {b.gstAmount !== undefined && (
              <div class="flex justify-between text-xs pt-1" style="color:#A8A29E; border-top:1px solid #E7E5E4">
                <span>GST (10%)</span>
                <span>${b.gstAmount.toFixed(2)}</span>
              </div>
            )}
            <div class="flex justify-between font-bold pt-1" style="color:#44403C; border-top:1px solid #D6D3D1">
              <span>Total</span>
              <span>${b.totalAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-xs" style="color:#A8A29E">
              <span>{b.paymentMethod?.toUpperCase() || '—'}</span>
              <span style={b.paymentStatus === 'paid' ? 'color:#16A34A; font-weight:500' : 'color:#F59E0B'}>
                {b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'pending_eft' ? 'EFT Pending' : b.paymentStatus}
              </span>
            </div>
          </div>

          {/* EFT Mark as Paid button */}
          {b.paymentStatus === 'pending_eft' && (
            <div class="mt-3">
              <button
                type="button"
                class="w-full"
                style="background:#F59E0B; color:#FFFFFF; border-radius:6px; padding:8px 16px; font-size:12px; font-weight:500; width:100%"
                hx-post={`/reception/bookings/${b.id}/mark-eft-paid`}
                hx-target="#slide-over-content"
                hx-swap="innerHTML"
              >
                Mark EFT as Paid
              </button>
            </div>
          )}
        </section>
      )}

      {/* Name match (mock) */}
      <section>
        <h3
          class="mb-2"
          style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
        >
          Identity Check
        </h3>
        <div class="flex items-center gap-2 text-sm">
          <span class="inline-flex items-center gap-1.5 border text-xs font-semibold px-2.5 py-1 rounded-full" style="background:#F0FDF4; border-color:#BBF7D0; color:#16A34A">
            <Icon name={ICONS.check} size={11} />
            Name Matched
          </span>
          <span class="text-xs" style="color:#A8A29E">Driver licence verified at kiosk</span>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h3
          class="mb-3"
          style="font-size:10px; font-weight:600; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em"
        >
          Timeline
        </h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="flex items-center gap-1.5" style="color:#78716C">
              <Icon name={ICONS.document} size={13} style="color:#A8A29E" />
              Booking Created
            </span>
            <span class="text-xs font-medium" style="color:#57534E">
              {new Date(b.createdAt).toLocaleString('en-AU')}
            </span>
          </div>
          {b.paymentStatus === 'paid' && (
            <div class="flex justify-between">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={ICONS.check} size={13} style="color:#16A34A" />
                Payment Received
              </span>
              <span class="text-xs font-medium" style="color:#57534E">
                {new Date(b.createdAt).toLocaleString('en-AU')}
              </span>
            </div>
          )}
          {b.checkedInAt && (
            <div class="flex justify-between">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={ICONS.userCheck} size={13} style="color:#F59E0B" />
                Checked In
              </span>
              <span class="text-xs font-medium" style="color:#57534E">
                {new Date(b.checkedInAt).toLocaleString('en-AU')}
              </span>
            </div>
          )}
          {b.completedAt && (
            <div class="flex justify-between">
              <span class="flex items-center gap-1.5" style="color:#78716C">
                <Icon name={ICONS.checkSquare} size={13} style="color:#16A34A" />
                Completed
              </span>
              <span class="text-xs font-medium" style="color:#57534E">
                {new Date(b.completedAt).toLocaleString('en-AU')}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>

    {/* Action buttons */}
    <div class="shrink-0 px-6 py-4 space-y-2" style="border-top:1px solid #D6D3D1; background:#FCFBF8">
      {/* Check-in button for scheduled bookings */}
      {b.status === 'scheduled' && (
        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl"
          style="background:#16A34A; color:#FFFFFF"
          hx-post={`/reception/bookings/${b.id}/check-in`}
          hx-target="#slide-over-content"
          hx-swap="innerHTML"
        >
          <Icon name={ICONS.userCheck} size={18} />
          Check In Visitor
        </button>
      )}

      {/* Mark Complete button for checked-in bookings */}
      {b.status === 'checked_in' && (
        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl"
          style="background:#F59E0B; color:#FFFFFF"
          x-on:click="confirmModal = true"
        >
          <Icon name={ICONS.checkSquare} size={18} />
          Mark Complete
        </button>
      )}
    </div>

    {/* Mark Complete confirmation modal */}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.5)"
      x-show="confirmModal"
      x-cloak
    >
      <div
        class="rounded-2xl shadow-2xl max-w-md w-full p-6"
        style="background:#FCFBF8; border:1px solid #D6D3D1"
      >
        <h3 class="text-lg font-bold mb-1" style="color:#44403C">Complete this job?</h3>
        <p class="text-sm mb-5" style="color:#78716C">
          You are marking <strong>{b.driverName}</strong>'s visit as complete. This action is final.
        </p>

        {/* Checklist */}
        <div class="space-y-2.5 mb-5">
          {[
            'Driver identity verified',
            'Documents checked',
            'Cargo released',
          ].map((item) => (
            <div key={item} class="flex items-center gap-2.5 text-sm" style="color:#57534E">
              <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style="background:#DCFCE7">
                <Icon name={ICONS.check} size={12} style="color:#16A34A" />
              </span>
              {item}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1.5" style="color:#57534E">Completion Notes (optional)</label>
          <textarea
            rows={2}
            x-model="completionNotes"
            placeholder="Any notes for records..."
            class="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
            style="border:1px solid #D6D3D1; background:#FCFBF8; color:#44403C"
            onfocus="this.style.outline='2px solid #F59E0B'; this.style.outlineOffset='2px'"
            onblur="this.style.outline='none'"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="flex-1 rounded-md font-medium text-sm py-2"
            style="background:#FCFBF8; color:#57534E; border:1px solid #E7E5E4; border-radius:6px; padding:8px 16px; font-size:12px; font-weight:500"
            x-on:click="confirmModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-2 rounded-md font-medium text-sm py-2"
            style="background:#F59E0B; color:#FFFFFF; border-radius:6px; padding:8px 16px; font-size:12px; font-weight:500"
            hx-post={`/reception/bookings/${b.id}/complete`}
            hx-target="#slide-over-content"
            hx-swap="innerHTML"
            x-on:click="confirmModal = false"
          >
            <Icon name={ICONS.check} size={16} />
            Confirm Complete
          </button>
        </div>
      </div>
    </div>
  </div>
)
