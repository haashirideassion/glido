const TABS = ['General', 'Slot Configuration', 'Pricing & Charges', 'Payment', 'Users']

const labelStyle = 'display:block; font-size:11px; font-weight:600; color:#6B6560; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:7px;'
const inputStyle = 'width:100%; padding:11px 14px; font-size:14px; color:#1A1815; background:#FEFCFA; border:1.5px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; transition:border-color 0.15s ease, box-shadow 0.15s ease; box-sizing:border-box;'
const inputFocus = `onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"`
const cardStyle = 'background:#FEFCFA; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.06); margin-bottom:20px;'
const saveBtn = 'display:inline-flex; align-items:center; padding:11px 24px; background:linear-gradient(135deg,#F97316,#EA6C0A); color:white; border:none; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; box-shadow:rgba(249,115,22,0.30) 0px 4px 12px 0px; margin-top:20px; transition:box-shadow 0.15s ease;'

export const SettingsView = ({ activeTab = 'General', tenant, users }: { activeTab?: string; tenant?: any; users?: any[] }) => (
  <div x-data={`{ tab: '${activeTab}' }`}>
    {/* Tab nav */}
    <div style="display:flex; gap:2px; background:#EDE8E0; border-radius:12px; padding:4px; margin-bottom:28px; overflow-x:auto;">
      {TABS.map((t) => (
        <button
          key={t}
          type="button"
          x-on:click={`tab = '${t}'`}
          style="padding:8px 16px; font-size:13px; font-weight:500; border:none; border-radius:9px; white-space:nowrap; cursor:pointer; transition:all 0.15s ease;"
          x-bind:style={`tab === '${t}' ? 'background:#FEFCFA; color:#1A1815; box-shadow:0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);' : 'background:transparent; color:#A09990;'`}
        >
          {t}
        </button>
      ))}
    </div>

    {/* ── General ── */}
    <div x-show={`tab === 'General'`} style="max-width:640px;">
      <form method="post" action="/reception/settings">
        <input type="hidden" name="tab" value="General" />
        <div style={cardStyle}>
          <p style="font-size:15px; font-weight:600; color:#1A1815; margin-bottom:18px; letter-spacing:-0.01em;">General Settings</p>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" name="name" value={tenant?.name ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <textarea name="address" rows={3} style={`${inputStyle} resize:vertical;`} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';">{tenant?.address ?? ''}</textarea>
            </div>
            <div>
              <label style={labelStyle}>Contact Email</label>
              <input type="email" name="contact_email" value={tenant?.contact_email ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone</label>
              <input type="tel" name="contact_phone" value={tenant?.contact_phone ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Timezone</label>
              <select name="timezone" style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';">
                {['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Asia/Kolkata'].map((tz) => (
                  <option key={tz} value={tz} selected={tenant?.timezone === tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select name="currency" style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';">
                {['AUD', 'INR'].map((c) => (
                  <option key={c} value={c} selected={tenant?.currency === c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" style={saveBtn}>Save Changes</button>
        </div>
      </form>
    </div>

    {/* ── Slot Configuration ── */}
    <div x-show={`tab === 'Slot Configuration'`} style="max-width:640px;">
      <form method="post" action="/reception/settings">
        <input type="hidden" name="tab" value="Slot Configuration" />
        <div style={cardStyle}>
          <p style="font-size:15px; font-weight:600; color:#1A1815; margin-bottom:18px; letter-spacing:-0.01em;">Slot Configuration</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label style={labelStyle}>Slot Duration (min)</label>
              <input type="number" name="slot_duration_min" value={tenant?.slot_duration_min ?? 60} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Max Bookings per Slot</label>
              <input type="number" name="max_bookings_per_slot" value={tenant?.max_bookings_per_slot ?? 5} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Advance Booking Days</label>
              <input type="number" name="advance_booking_days" value={tenant?.advance_booking_days ?? 7} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Slot Hold Duration (min)</label>
              <input type="number" name="slot_hold_duration_min" value={tenant?.slot_hold_duration_min ?? 10} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Same-Day Cutoff Time</label>
              <input type="time" name="same_day_cutoff_time" value={tenant?.same_day_cutoff_time ?? '09:00'} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
          </div>
          <button type="submit" style={saveBtn}>Save Changes</button>
        </div>
      </form>
    </div>

    {/* ── Pricing & Charges ── */}
    <div x-show={`tab === 'Pricing & Charges'`} style="max-width:640px;" x-data="{ gstEnabled: false }">
      <form method="post" action="/reception/settings">
        <input type="hidden" name="tab" value="Pricing & Charges" />
        <div style={cardStyle}>
          <p style="font-size:15px; font-weight:600; color:#1A1815; margin-bottom:18px; letter-spacing:-0.01em;">Pricing & Charges</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label style={labelStyle}>Storage Rate per CBM</label>
              <input type="number" step="0.01" name="storage_rate_per_cbm" value={tenant?.storage_rate_per_cbm ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Storage Free Days</label>
              <input type="number" name="storage_free_days" value={tenant?.storage_free_days ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Shrink Wrap Rate / Pallet</label>
              <input type="number" step="0.01" name="shrink_wrap_rate_per_pallet" value={tenant?.shrink_wrap_rate_per_pallet ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Slot Fee — Pick Up</label>
              <input type="number" step="0.01" name="slot_fee_pickup" value={tenant?.slot_fee_pickup ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>Slot Fee — Drop Off</label>
              <input type="number" step="0.01" name="slot_fee_dropoff" value={tenant?.slot_fee_dropoff ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
          </div>
          <div style="margin-top:16px; display:flex; align-items:center; gap:8px;">
            <input
              type="checkbox"
              id="gst_enabled"
              name="gst_enabled"
              checked={tenant?.gst_enabled}
              x-model="gstEnabled"
              x-init={`gstEnabled = ${tenant?.gst_enabled ? 'true' : 'false'}`}
            />
            <label for="gst_enabled" style="font-size:13px; font-weight:500; color:#1A1815; cursor:pointer;">GST Enabled</label>
          </div>
          <div style="margin-top:14px;" x-show="gstEnabled">
            <label style={labelStyle}>GST Rate (%)</label>
            <input type="number" name="gst_rate" value={tenant?.gst_rate ?? 10} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
          </div>
          <button type="submit" style={saveBtn}>Save Changes</button>
        </div>
      </form>
    </div>

    {/* ── Payment ── */}
    <div x-show={`tab === 'Payment'`} style="max-width:640px;">
      <form method="post" action="/reception/settings">
        <input type="hidden" name="tab" value="Payment" />
        <div style={cardStyle}>
          <p style="font-size:15px; font-weight:600; color:#1A1815; margin-bottom:18px; letter-spacing:-0.01em;">Payment Settings</p>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div>
              <label style={labelStyle}>Stripe Public Key</label>
              <input type="text" name="stripe_public_key" value={tenant?.stripe_public_key ?? ''} placeholder="pk_live_..." style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>EFT Bank Name</label>
              <input type="text" name="eft_bank_name" value={tenant?.eft_bank_name ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>EFT BSB</label>
              <input type="text" name="eft_bsb" value={tenant?.eft_bsb ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>EFT Account Number</label>
              <input type="text" name="eft_account_number" value={tenant?.eft_account_number ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div>
              <label style={labelStyle}>EFT Account Name</label>
              <input type="text" name="eft_account_name" value={tenant?.eft_account_name ?? ''} style={inputStyle} onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';" />
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <input
                type="checkbox"
                id="require_payment_to_confirm"
                name="require_payment_to_confirm"
                checked={tenant?.require_payment_to_confirm}
              />
              <label for="require_payment_to_confirm" style="font-size:13px; font-weight:500; color:#1A1815; cursor:pointer;">Require payment to confirm booking</label>
            </div>
          </div>
          <button type="submit" style={saveBtn}>Save Changes</button>
        </div>
      </form>
    </div>

    {/* ── Users ── */}
    <div x-show={`tab === 'Users'`} style="max-width:640px;">
      <div style={cardStyle}>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;">
          <p style="font-size:15px; font-weight:600; color:#1A1815; letter-spacing:-0.01em;">Team Members</p>
          <button
            type="button"
            style="background:#FEFCFA; border:1.5px solid rgba(0,0,0,0.10); border-radius:9px; color:#1A1815; font-size:12px; font-weight:500; padding:7px 14px; cursor:pointer; transition:border-color 0.15s ease;"
            onmouseover="this.style.borderColor='rgba(0,0,0,0.20)'"
            onmouseout="this.style.borderColor='rgba(0,0,0,0.10)'"
          >
            + Invite
          </button>
        </div>
        <table style="width:100%; font-size:13px; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid rgba(0,0,0,0.08);">
              <th style="text-align:left; padding:8px 0; font-size:11px; font-weight:600; color:#A09990; letter-spacing:0.05em; text-transform:uppercase;">Name</th>
              <th style="text-align:left; padding:8px 0; font-size:11px; font-weight:600; color:#A09990; letter-spacing:0.05em; text-transform:uppercase;">Email</th>
              <th style="text-align:left; padding:8px 0; font-size:11px; font-weight:600; color:#A09990; letter-spacing:0.05em; text-transform:uppercase;">Role</th>
              <th style="text-align:left; padding:8px 0; font-size:11px; font-weight:600; color:#A09990; letter-spacing:0.05em; text-transform:uppercase;">Status</th>
              <th style="padding:8px 0;"></th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u: any) => (
              <tr key={u.email} style="border-bottom:1px solid rgba(0,0,0,0.06);">
                <td style="padding:11px 0; color:#1A1815; font-weight:500;">{u.name}</td>
                <td style="padding:11px 0; color:#6B6560;">{u.email}</td>
                <td style="padding:11px 0;">
                  <span style="background:rgba(0,0,0,0.05); border:1px solid rgba(0,0,0,0.08); border-radius:6px; padding:3px 8px; font-size:11px; color:#6B6560; font-weight:500;">{u.role}</span>
                </td>
                <td style="padding:11px 0;">
                  <span style={`border-radius:6px; padding:3px 8px; font-size:11px; font-weight:500; ${u.status === 'Active' ? 'background:#DCFCE7; color:#166534; border:1px solid #BBF7D0;' : 'background:rgba(0,0,0,0.05); color:#A09990; border:1px solid rgba(0,0,0,0.08);'}`}>{u.status}</span>
                </td>
                <td style="padding:11px 0; text-align:right;">
                  <button type="button" style="font-size:12px; color:#A09990; background:none; border:none; cursor:pointer; transition:color 0.15s ease;" onmouseover="this.style.color='#1A1815'" onmouseout="this.style.color='#A09990'">Edit</button>
                </td>
              </tr>
            ))}
            {(users ?? []).length === 0 && (
              <tr>
                <td colspan={5} style="padding:40px 0; text-align:center; color:#A09990; font-size:13px;">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
