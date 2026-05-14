const TABS = ['General', 'Slot Configuration', 'Pricing & Charges', 'Payment', 'Users']

const labelStyle = 'font-size:12px; font-weight:500; color:#44403C; margin-bottom:4px; display:block;'
const inputStyle = 'border:1px solid #D6D3D1; border-radius:6px; background:#FCFBF8; color:#44403C; font-size:12px; padding:8px 12px; width:100%; box-sizing:border-box; outline:none;'
const cardStyle = 'background:#F5F3EC; border:1px solid rgba(231,229,228,0.5); border-radius:12px; padding:20px; box-shadow:rgba(0,0,0,0.05) 0px 1px 2px 0px; margin-bottom:20px;'
const saveBtn = 'background:#F59E0B; color:#1C1917; border-radius:6px; font-size:12px; font-weight:500; padding:10px 20px; border:none; cursor:pointer; margin-top:16px;'

export const SettingsView = ({ activeTab = 'General', tenant, users }: { activeTab?: string; tenant?: any; users?: any[] }) => (
  <div x-data={`{ tab: '${activeTab}' }`}>
    {/* Tab nav */}
    <div style="display:flex; gap:4px; background:#F5F3EC; border-radius:8px; padding:4px; margin-bottom:24px; overflow-x:auto;">
      {TABS.map((t) => (
        <button
          key={t}
          type="button"
          x-on:click={`tab = '${t}'`}
          {...{"x-bind:style": `tab === '${t}' ? 'background:#FCFBF8; border:1px solid #D6D3D1; border-radius:6px; color:#44403C; padding:6px 16px; font-size:12px; font-weight:500; white-space:nowrap; cursor:pointer;' : 'background:transparent; border:1px solid transparent; border-radius:6px; color:#A8A29E; padding:6px 16px; font-size:12px; font-weight:500; white-space:nowrap; cursor:pointer;'`}}
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
          <p style="font-size:14px; font-weight:600; color:#44403C; margin-bottom:16px;">General Settings</p>
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" name="name" value={tenant?.name ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <textarea name="address" rows={3} style={`${inputStyle} resize:vertical;`}>{tenant?.address ?? ''}</textarea>
            </div>
            <div>
              <label style={labelStyle}>Contact Email</label>
              <input type="email" name="contact_email" value={tenant?.contact_email ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone</label>
              <input type="tel" name="contact_phone" value={tenant?.contact_phone ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Timezone</label>
              <select name="timezone" style={inputStyle}>
                {['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Asia/Kolkata'].map((tz) => (
                  <option key={tz} value={tz} selected={tenant?.timezone === tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select name="currency" style={inputStyle}>
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
          <p style="font-size:14px; font-weight:600; color:#44403C; margin-bottom:16px;">Slot Configuration</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div>
              <label style={labelStyle}>Slot Duration (min)</label>
              <input type="number" name="slot_duration_min" value={tenant?.slot_duration_min ?? 60} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max Bookings per Slot</label>
              <input type="number" name="max_bookings_per_slot" value={tenant?.max_bookings_per_slot ?? 5} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Advance Booking Days</label>
              <input type="number" name="advance_booking_days" value={tenant?.advance_booking_days ?? 7} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slot Hold Duration (min)</label>
              <input type="number" name="slot_hold_duration_min" value={tenant?.slot_hold_duration_min ?? 10} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Same-Day Cutoff Time</label>
              <input type="time" name="same_day_cutoff_time" value={tenant?.same_day_cutoff_time ?? '09:00'} style={inputStyle} />
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
          <p style="font-size:14px; font-weight:600; color:#44403C; margin-bottom:16px;">Pricing & Charges</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div>
              <label style={labelStyle}>Storage Rate per CBM</label>
              <input type="number" step="0.01" name="storage_rate_per_cbm" value={tenant?.storage_rate_per_cbm ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Storage Free Days</label>
              <input type="number" name="storage_free_days" value={tenant?.storage_free_days ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Shrink Wrap Rate / Pallet</label>
              <input type="number" step="0.01" name="shrink_wrap_rate_per_pallet" value={tenant?.shrink_wrap_rate_per_pallet ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slot Fee — Pick Up</label>
              <input type="number" step="0.01" name="slot_fee_pickup" value={tenant?.slot_fee_pickup ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slot Fee — Drop Off</label>
              <input type="number" step="0.01" name="slot_fee_dropoff" value={tenant?.slot_fee_dropoff ?? ''} style={inputStyle} />
            </div>
          </div>
          <div style="margin-top:14px; display:flex; align-items:center; gap:8px;">
            <input
              type="checkbox"
              id="gst_enabled"
              name="gst_enabled"
              checked={tenant?.gst_enabled}
              x-model="gstEnabled"
              x-init={`gstEnabled = ${tenant?.gst_enabled ? 'true' : 'false'}`}
            />
            <label for="gst_enabled" style="font-size:12px; font-weight:500; color:#44403C; cursor:pointer;">GST Enabled</label>
          </div>
          <div style="margin-top:12px;" x-show="gstEnabled">
            <label style={labelStyle}>GST Rate (%)</label>
            <input type="number" name="gst_rate" value={tenant?.gst_rate ?? 10} style={inputStyle} />
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
          <p style="font-size:14px; font-weight:600; color:#44403C; margin-bottom:16px;">Payment Settings</p>
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div>
              <label style={labelStyle}>Stripe Public Key</label>
              <input type="text" name="stripe_public_key" value={tenant?.stripe_public_key ?? ''} placeholder="pk_live_..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EFT Bank Name</label>
              <input type="text" name="eft_bank_name" value={tenant?.eft_bank_name ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EFT BSB</label>
              <input type="text" name="eft_bsb" value={tenant?.eft_bsb ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EFT Account Number</label>
              <input type="text" name="eft_account_number" value={tenant?.eft_account_number ?? ''} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>EFT Account Name</label>
              <input type="text" name="eft_account_name" value={tenant?.eft_account_name ?? ''} style={inputStyle} />
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <input
                type="checkbox"
                id="require_payment_to_confirm"
                name="require_payment_to_confirm"
                checked={tenant?.require_payment_to_confirm}
              />
              <label for="require_payment_to_confirm" style="font-size:12px; font-weight:500; color:#44403C; cursor:pointer;">Require payment to confirm booking</label>
            </div>
          </div>
          <button type="submit" style={saveBtn}>Save Changes</button>
        </div>
      </form>
    </div>

    {/* ── Users ── */}
    <div x-show={`tab === 'Users'`} style="max-width:640px;">
      <div style={cardStyle}>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <p style="font-size:14px; font-weight:600; color:#44403C;">Team Members</p>
          <button
            type="button"
            style="background:#F5F3EC; border:1px solid #D6D3D1; border-radius:6px; color:#44403C; font-size:12px; font-weight:500; padding:6px 14px; cursor:pointer;"
          >
            + Invite
          </button>
        </div>
        <table style="width:100%; font-size:12px; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #D6D3D1;">
              <th style="text-align:left; padding:8px 0; color:#A8A29E; font-weight:500;">Name</th>
              <th style="text-align:left; padding:8px 0; color:#A8A29E; font-weight:500;">Email</th>
              <th style="text-align:left; padding:8px 0; color:#A8A29E; font-weight:500;">Role</th>
              <th style="text-align:left; padding:8px 0; color:#A8A29E; font-weight:500;">Status</th>
              <th style="padding:8px 0;"></th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u: any) => (
              <tr key={u.email} style="border-bottom:1px solid rgba(214,211,209,0.4);">
                <td style="padding:10px 0; color:#44403C; font-weight:500;">{u.name}</td>
                <td style="padding:10px 0; color:#78716C;">{u.email}</td>
                <td style="padding:10px 0;">
                  <span style="background:#EAE6DE; border:1px solid #D6D3D1; border-radius:4px; padding:2px 8px; font-size:11px; color:#44403C; font-weight:500;">{u.role}</span>
                </td>
                <td style="padding:10px 0;">
                  <span style={`border-radius:4px; padding:2px 8px; font-size:11px; font-weight:500; ${u.status === 'Active' ? 'background:#DCFCE7; color:#166534; border:1px solid #BBF7D0;' : 'background:#F5F3EC; color:#A8A29E; border:1px solid #D6D3D1;'}`}>{u.status}</span>
                </td>
                <td style="padding:10px 0; text-align:right;">
                  <button type="button" style="font-size:11px; color:#A8A29E; background:none; border:none; cursor:pointer;">Edit</button>
                </td>
              </tr>
            ))}
            {(users ?? []).length === 0 && (
              <tr>
                <td colspan={5} style="padding:32px 0; text-align:center; color:#A8A29E; font-size:12px;">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
