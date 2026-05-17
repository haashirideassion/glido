import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Icon, ICONS } from '../../lib/Icon'
import { STATUS_LABEL, STATUS_BADGE_VARIANT, SERVICE_LABEL, LOAD_LABEL, ICS_BADGE_CLASS, ICS_LABEL } from '../../lib/constants'
import type { Booking } from '../../data/types'

interface Props {
  booking: Booking
}

type StatusVariant = 'warning' | 'default' | 'success' | 'secondary' | 'outline' | 'destructive'

const SECTION_LABEL = "font-size:10px; font-weight:700; color:#A8A29E; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px;"
const PANEL_STYLE  = "background:rgba(0,0,0,0.02); border:1px solid rgba(0,0,0,0.07); border-radius:10px; padding:14px 16px;"
const ROW_LABEL    = "display:flex; align-items:center; gap:6px; font-size:12px; color:#78716C;"
const ROW_VALUE    = "font-size:12px; font-weight:600; color:#1C1917;"

export const BookingSlideOver = ({ booking: b }: Props) => (
  <div style="display:flex; flex-direction:column; height:100%;" x-data="{ confirmModal: false, completionNotes: '' }">
    {/* Header */}
    <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid rgba(0,0,0,0.07); background:#FFFFFF; flex-shrink:0;">
      <div>
        <p style="font-family:ui-monospace,monospace; font-size:13px; font-weight:700; color:#FC6514; margin-bottom:4px;">{b.referenceNumber}</p>
        <Badge variant={STATUS_BADGE_VARIANT[b.status] as StatusVariant}>
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
    <div style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:20px; background:#EBEBEA;">

      {/* Driver / Visitor */}
      <section>
        <p style={SECTION_LABEL}>Driver / Visitor</p>
        <div style={PANEL_STYLE + " display:flex; flex-direction:column; gap:10px;"}>
          {[
            { label: 'Driver', value: b.driverName,  icon: ICONS.user },
            { label: 'Phone',  value: b.driverPhone || '—', icon: ICONS.phone },
            { label: 'Guest',  value: b.guestName || b.driverName, icon: ICONS.users },
          ].map((row) => (
            <div key={row.label} style="display:flex; justify-content:space-between; align-items:center;">
              <span style={ROW_LABEL}>
                <Icon name={row.icon} size={13} style="color:#78716C;" />
                {row.label}
              </span>
              <span style={ROW_VALUE}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Slot */}
      <section>
        <p style={SECTION_LABEL}>Slot</p>
        <div style={PANEL_STYLE + " display:grid; grid-template-columns:1fr 1fr; gap:12px;"}>
          <div>
            <p style="font-size:10px; color:#78716C; margin-bottom:3px;">Date</p>
            <p style="font-size:13px; font-weight:600; color:#1C1917; display:flex; align-items:center; gap:5px;">
              <Icon name={ICONS.calendar} size={13} style="color:#78716C;" />
              {b.slotDate}
            </p>
          </div>
          <div>
            <p style="font-size:10px; color:#78716C; margin-bottom:3px;">Time</p>
            <p style="font-size:13px; font-weight:600; color:#1C1917; display:flex; align-items:center; gap:5px;">
              <Icon name={ICONS.clock} size={13} style="color:#78716C;" />
              {b.slotStartTime} – {b.slotEndTime}
            </p>
          </div>
          <div>
            <p style="font-size:10px; color:#78716C; margin-bottom:3px;">Service</p>
            <p style="font-size:13px; font-weight:600; color:#1C1917;">{SERVICE_LABEL[b.serviceType]}</p>
          </div>
          <div>
            <p style="font-size:10px; color:#78716C; margin-bottom:3px;">Load Type</p>
            <p style="font-size:13px; font-weight:600; color:#1C1917;">{LOAD_LABEL[b.loadType]}</p>
          </div>
        </div>
      </section>

      {/* Shipment */}
      <section>
        <p style={SECTION_LABEL}>Shipment</p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          {b.houseBillNumber && (
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style={ROW_LABEL}><Icon name={ICONS.document} size={13} style="color:#78716C;" />HBL</span>
              <span style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#78716C;">{b.houseBillNumber}</span>
            </div>
          )}
          {b.containerNumber && (
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style={ROW_LABEL}><Icon name={ICONS.container} size={13} style="color:#78716C;" />Container</span>
              <span style="font-family:ui-monospace,monospace; font-size:12px; font-weight:700; color:#78716C;">{b.containerNumber}</span>
            </div>
          )}
          {b.weightKg && (
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style={ROW_LABEL}><Icon name={ICONS.cargo} size={13} style="color:#78716C;" />Weight</span>
              <span style={ROW_VALUE}>{b.weightKg.toLocaleString()} kg</span>
            </div>
          )}
          {b.volumeCbm && (
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style={ROW_LABEL}><Icon name={ICONS.layers} size={13} style="color:#78716C;" />Volume</span>
              <span style={ROW_VALUE}>{b.volumeCbm} CBM</span>
            </div>
          )}
          {b.packageCount && (
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style={ROW_LABEL + " padding-left:19px;"}>Packages</span>
              <span style={ROW_VALUE}>{b.packageCount} pkgs</span>
            </div>
          )}
          {b.palletCount !== undefined && b.palletCount > 0 && (
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style={ROW_LABEL + " padding-left:19px;"}>Pallets</span>
              <span style={ROW_VALUE}>{b.palletCount} × {b.palletType}</span>
            </div>
          )}
        </div>
      </section>

      {/* CHEP warning */}
      {b.palletType === 'chep' && (
        <div style="background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20); border-radius:10px; padding:12px 16px; display:flex; align-items:flex-start; gap:10px;">
          <Icon name={ICONS.warning} size={16} style="color:#FBBF24; flex-shrink:0; margin-top:1px;" />
          <div>
            <p style="font-size:13px; font-weight:600; color:#FBBF24; margin-bottom:2px;">CHEP Pallet Exchange</p>
            <p style="font-size:12px; color:rgba(251,191,36,0.65);">
              {b.palletCount} CHEP pallet{(b.palletCount || 0) > 1 ? 's' : ''} must be exchanged at collection.
            </p>
          </div>
        </div>
      )}

      {/* ICS */}
      {b.icsStatus && (
        <section>
          <p style={SECTION_LABEL}>ICS Status</p>
          <div style={PANEL_STYLE + " display:flex; align-items:center; justify-content:space-between;"}>
            <span class={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${ICS_BADGE_CLASS[b.icsStatus]}`}>
              {ICS_LABEL[b.icsStatus]}
            </span>
            <div style="display:flex; align-items:center; gap:10px;">
              <button type="button" style="font-size:11px; color:#FC6514; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:4px;">
                <Icon name={ICONS.refresh} size={12} />
                Refresh ICS
              </button>
              <span style="color:rgba(0,0,0,0.12);">|</span>
              <a href="https://ics.abf.gov.au" target="_blank" style="font-size:11px; color:#FC6514; text-decoration:none; display:flex; align-items:center; gap:4px;">
                Open in ICS portal
                <Icon name={ICONS.arrowRight} size={12} />
              </a>
            </div>
          </div>
          {b.icsLastCheckedAt && (
            <p style="font-size:11px; color:#A8A29E; margin-top:5px;">
              Last checked: {new Date(b.icsLastCheckedAt).toLocaleString('en-AU')}
            </p>
          )}
        </section>
      )}

      {/* Charges */}
      {b.totalAmount && (
        <section>
          <p style={SECTION_LABEL}>Charges</p>
          <div style="display:flex; flex-direction:column; gap:7px; font-size:13px;">
            {b.storageCharge !== undefined && b.storageCharge > 0 && (
              <div style="display:flex; justify-content:space-between; color:#78716C;">
                <span>Storage ({b.storageDays} days)</span>
                <span>${b.storageCharge.toFixed(2)}</span>
              </div>
            )}
            {b.shrinkWrapCharge !== undefined && b.shrinkWrapCharge > 0 && (
              <div style="display:flex; justify-content:space-between; color:#78716C;">
                <span>Shrink wrap</span>
                <span>${b.shrinkWrapCharge.toFixed(2)}</span>
              </div>
            )}
            {b.slotFee !== undefined && (
              <div style="display:flex; justify-content:space-between; color:#78716C;">
                <span>Slot fee</span>
                <span>${b.slotFee.toFixed(2)}</span>
              </div>
            )}
            {b.gstAmount !== undefined && (
              <div style="display:flex; justify-content:space-between; font-size:12px; color:#A8A29E; padding-top:6px; border-top:1px solid rgba(0,0,0,0.07);">
                <span>GST (10%)</span>
                <span>${b.gstAmount.toFixed(2)}</span>
              </div>
            )}
            <div style="display:flex; justify-content:space-between; font-weight:700; color:#1C1917; padding-top:6px; border-top:1px solid rgba(0,0,0,0.09);">
              <span>Total</span>
              <span style="color:#FC6514;">${b.totalAmount.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#A8A29E;">
              <span>{b.paymentMethod?.toUpperCase() || '—'}</span>
              <span style={b.paymentStatus === 'paid' ? 'color:#22C55E; font-weight:500;' : 'color:#FBBF24; font-weight:500;'}>
                {b.paymentStatus === 'paid' ? 'Paid' : b.paymentStatus === 'pending_eft' ? 'EFT Pending' : b.paymentStatus}
              </span>
            </div>
          </div>

          {b.paymentStatus === 'pending_eft' && (
            <div style="margin-top:12px;">
              <button
                type="button"
                style="width:100%; background:rgba(252,101,20,0.15); color:#FC6514; border:1px solid rgba(252,101,20,0.30); border-radius:8px; padding:8px 16px; font-size:12px; font-weight:600; cursor:pointer;"
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

      {/* Identity check */}
      <section>
        <p style={SECTION_LABEL}>Identity Check</p>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="display:inline-flex; align-items:center; gap:5px; border:1px solid rgba(34,197,94,0.22); font-size:11px; font-weight:600; padding:4px 10px; border-radius:9999px; background:rgba(34,197,94,0.10); color:#22C55E;">
            <Icon name={ICONS.check} size={11} />
            Name Matched
          </span>
          <span style="font-size:11px; color:#A8A29E;">Driver licence verified at kiosk</span>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <p style={SECTION_LABEL}>Timeline</p>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">
          <div style="display:flex; justify-content:space-between;">
            <span style={ROW_LABEL}><Icon name={ICONS.document} size={13} style="color:#78716C;" />Booking Created</span>
            <span style="font-size:11px; font-weight:500; color:#78716C;">{new Date(b.createdAt).toLocaleString('en-AU')}</span>
          </div>
          {b.paymentStatus === 'paid' && (
            <div style="display:flex; justify-content:space-between;">
              <span style={ROW_LABEL}><Icon name={ICONS.check} size={13} style="color:#22C55E;" />Payment Received</span>
              <span style="font-size:11px; font-weight:500; color:#78716C;">{new Date(b.createdAt).toLocaleString('en-AU')}</span>
            </div>
          )}
          {b.checkedInAt && (
            <div style="display:flex; justify-content:space-between;">
              <span style={ROW_LABEL}><Icon name={ICONS.userCheck} size={13} style="color:#FBBF24;" />Checked In</span>
              <span style="font-size:11px; font-weight:500; color:#78716C;">{new Date(b.checkedInAt).toLocaleString('en-AU')}</span>
            </div>
          )}
          {b.completedAt && (
            <div style="display:flex; justify-content:space-between;">
              <span style={ROW_LABEL}><Icon name={ICONS.checkSquare} size={13} style="color:#22C55E;" />Completed</span>
              <span style="font-size:11px; font-weight:500; color:#78716C;">{new Date(b.completedAt).toLocaleString('en-AU')}</span>
            </div>
          )}
        </div>
      </section>
    </div>

    {/* Action buttons */}
    <div style="flex-shrink:0; padding:16px 20px; display:flex; flex-direction:column; gap:8px; border-top:1px solid rgba(0,0,0,0.07); background:#FFFFFF;">
      {b.status === 'scheduled' && (
        <button
          type="button"
          style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; font-weight:600; padding:12px 20px; border-radius:10px; border:none; cursor:pointer; background:linear-gradient(180deg,#4ADE80 0%,#16A34A 100%); color:white; box-shadow:0 4px 14px rgba(34,197,94,0.30), inset 0 1px 0 rgba(255,255,255,0.22);"
          hx-post={`/reception/bookings/${b.id}/check-in`}
          hx-target="#slide-over-content"
          hx-swap="innerHTML"
        >
          <Icon name={ICONS.userCheck} size={18} />
          Check In Visitor
        </button>
      )}

      {b.status === 'checked_in' && (
        <button
          type="button"
          class="btn-primary"
          style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; font-weight:600; padding:12px 20px; border:none; cursor:pointer;"
          x-on:click="confirmModal = true"
        >
          <Icon name={ICONS.checkSquare} size={18} />
          Mark Complete
        </button>
      )}
    </div>

    {/* Mark Complete confirmation modal */}
    <div
      style="position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px);"
      x-show="confirmModal"
      x-cloak
    >
      <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.09); border-radius:16px; box-shadow:0 24px 64px rgba(0,0,0,0.20); max-width:420px; width:100%; padding:24px;">
        <h3 style="font-size:17px; font-weight:700; color:#1C1917; margin-bottom:6px;">Complete this job?</h3>
        <p style="font-size:13px; color:#78716C; margin-bottom:20px; line-height:1.5;">
          You are marking <strong style="color:#1C1917;">{b.driverName}</strong>'s visit as complete. This action is final.
        </p>

        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
          {['Driver identity verified','Documents checked','Cargo released'].map((item) => (
            <div key={item} style="display:flex; align-items:center; gap:10px; font-size:13px; color:#1C1917;">
              <span style="width:20px; height:20px; border-radius:9999px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.22);">
                <Icon name={ICONS.check} size={11} style="color:#22C55E;" />
              </span>
              {item}
            </div>
          ))}
        </div>

        <div style="margin-bottom:20px;">
          <label style="display:block; font-size:11px; font-weight:600; color:rgba(0,0,0,0.40); letter-spacing:0.07em; text-transform:uppercase; margin-bottom:6px;">Completion Notes (optional)</label>
          <textarea
            rows={2}
            x-model="completionNotes"
            placeholder="Any notes for records..."
            class="wizard-field"
            style="width:100%; padding:10px 14px; font-size:13px; resize:none; box-sizing:border-box;"
          ></textarea>
        </div>

        <div style="display:flex; gap:10px;">
          <button
            type="button"
            class="btn-ghost"
            style="flex:1; padding:10px 16px; font-size:13px; cursor:pointer;"
            x-on:click="confirmModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn-primary"
            style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px 16px; font-size:13px; font-weight:600; border:none; cursor:pointer;"
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
