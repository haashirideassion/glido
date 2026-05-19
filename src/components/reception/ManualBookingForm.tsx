import { Icon, ICONS } from '../../lib/Icon'

const inputStyle = 'width:100%; padding:10px 14px; font-size:13.5px; color:#1C1917; background:#F7F6F5; border:1px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; transition:border-color 0.15s ease, box-shadow 0.15s ease; box-sizing:border-box; font-family:inherit;'
const labelStyle = 'display:block; font-size:10px; font-weight:700; color:#78716C; letter-spacing:0.09em; text-transform:uppercase; margin-bottom:7px;'
const focus = 'onfocus="this.style.borderColor=\'rgba(252,101,20,0.50)\';this.style.boxShadow=\'0 0 0 3px rgba(252,101,20,0.12)\';" onblur="this.style.borderColor=\'rgba(0,0,0,0.10)\';this.style.boxShadow=\'none\';"'

interface Props {
  savedFlash?: boolean
  error?: string
}

export const ManualBookingForm = ({ savedFlash, error }: Props) => {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div style="max-width:720px;">

      {savedFlash && (
        <div style="display:flex; align-items:center; gap:10px; padding:14px 18px; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.22); border-radius:12px; margin-bottom:20px;">
          <Icon name={ICONS.check} size={16} style="color:#22C55E; flex-shrink:0;" />
          <p style="font-size:13px; font-weight:500; color:#16A34A; margin:0;">Booking created successfully.</p>
        </div>
      )}
      {error && (
        <div style="display:flex; align-items:center; gap:10px; padding:14px 18px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.22); border-radius:12px; margin-bottom:20px;">
          <Icon name={ICONS.warning} size={16} style="color:#EF4444; flex-shrink:0;" />
          <p style="font-size:13px; font-weight:500; color:#DC2626; margin:0;">{error}</p>
        </div>
      )}

      <form
        method="post"
        action="/reception/bookings/new"
        style="display:flex; flex-direction:column; gap:16px;"
      >
        {/* ── Service + Load ── */}
        <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:16px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size:12px; font-weight:700; color:#A8A29E; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:16px;">Service Type</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style={labelStyle}>Service</label>
              <select name="serviceType" required style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'">
                <option value="">Select…</option>
                <option value="pickup">Pick Up</option>
                <option value="dropoff">Drop Off</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Load Type</label>
              <select name="loadType" required style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'">
                <option value="">Select…</option>
                <option value="lcl">LCL</option>
                <option value="fcl">FCL</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Slot ── */}
        <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:16px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size:12px; font-weight:700; color:#A8A29E; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:16px;">Slot</p>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" name="slotDate" required value={today} min={today} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" name="slotStartTime" required defaultValue="09:00" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input type="time" name="slotEndTime" required defaultValue="10:00" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
          </div>
        </div>

        {/* ── Driver / Guest ── */}
        <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:16px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size:12px; font-weight:700; color:#A8A29E; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:16px;">Driver / Visitor</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style={labelStyle}>Driver Name <span style="color:#EF4444;">*</span></label>
              <input type="text" name="driverName" required placeholder="Full name" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
            <div>
              <label style={labelStyle}>Driver Phone</label>
              <input type="tel" name="driverPhone" placeholder="04xx xxx xxx" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
            <div>
              <label style={labelStyle}>Guest / Company Name</label>
              <input type="text" name="guestName" placeholder="Forwarding agent or company" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
            <div>
              <label style={labelStyle}>Guest Phone</label>
              <input type="tel" name="guestPhone" placeholder="Optional" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
          </div>
        </div>

        {/* ── Shipment ── */}
        <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:16px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size:12px; font-weight:700; color:#A8A29E; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:16px;">Shipment (optional)</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style={labelStyle}>House Bill Number</label>
              <input type="text" name="houseBillNumber" placeholder="ABCD12345678" style={`${inputStyle} font-family:ui-monospace,monospace;`} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
            <div>
              <label style={labelStyle}>Container Number</label>
              <input type="text" name="containerNumber" placeholder="ABCU1234567" style={`${inputStyle} font-family:ui-monospace,monospace;`} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'" />
            </div>
          </div>
        </div>

        {/* ── Payment ── */}
        <div style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.07); border-radius:16px; padding:22px; box-shadow:0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size:12px; font-weight:700; color:#A8A29E; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:16px;">Payment</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style={labelStyle}>Method</label>
              <select name="paymentMethod" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'">
                <option value="">Not specified</option>
                <option value="eft">EFT / Bank Transfer</option>
                <option value="card">Card (on arrival)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="paymentStatus" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'" onblur="this.style.borderColor='rgba(0,0,0,0.10)'">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="pending_eft">EFT Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div style="display:flex; gap:12px; align-items:center; padding-top:4px;">
          <button
            type="submit"
            style="display:inline-flex; align-items:center; gap:8px; padding:12px 28px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); color:#fff; border:none; border-radius:11px; font-size:13.5px; font-weight:600; cursor:pointer; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(252,101,20,0.40), 0 1px 3px rgba(0,0,0,0.30); transition:box-shadow 0.15s ease;"
            onmouseover="this.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 20px rgba(252,101,20,0.50), 0 1px 4px rgba(0,0,0,0.35)'"
            onmouseout="this.style.boxShadow='inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(252,101,20,0.40), 0 1px 3px rgba(0,0,0,0.30)'"
          >
            <Icon name={ICONS.check} size={15} />
            Create Booking
          </button>
          <a href="/reception/bookings" style="font-size:13px; color:#78716C; text-decoration:none; font-weight:500; transition:color 0.15s ease;"
            onmouseover="this.style.color='#1C1917'" onmouseout="this.style.color='#78716C'"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
