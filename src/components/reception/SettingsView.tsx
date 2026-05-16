const TABS = ['General', 'Slot Configuration', 'Pricing & Charges', 'Payment', 'Users']

const labelStyle = 'display:block; font-size:10px; font-weight:700; color:rgba(255,255,255,0.38); letter-spacing:0.09em; text-transform:uppercase; margin-bottom:8px;'
const inputStyle = 'width:100%; padding:11px 14px; font-size:14px; color:#F1F5F9; background:rgba(9,13,18,0.60); border:1px solid rgba(255,255,255,0.09); border-radius:10px; outline:none; transition:border-color 0.15s ease, box-shadow 0.15s ease; box-sizing:border-box; box-shadow:inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20);'
const inputFocus = `onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';"`
const cardStyle = 'background:linear-gradient(180deg,#1F2831 0%,#1A2028 100%); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:24px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.40); margin-bottom:20px;'
const saveBtn = 'display:inline-flex; align-items:center; gap:8px; padding:11px 24px; background:linear-gradient(180deg,#FF7A2A 0%,#E85A0A 100%); color:white; border:none; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; box-shadow:inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(252,101,20,0.40), 0 1px 3px rgba(0,0,0,0.40); margin-top:20px; transition:box-shadow 0.15s ease;'

export const SettingsView = ({ activeTab = 'General', tenant, users }: { activeTab?: string; tenant?: any; users?: any[] }) => (
  <div x-data={`{ tab: '${activeTab}' }`}>
    {/* Tab nav */}
    <div style="display:flex; gap:2px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:4px; margin-bottom:28px; overflow-x:auto;">
      {TABS.map((t) => (
        <button
          key={t}
          type="button"
          x-on:click={`tab = '${t}'`}
          style="padding:8px 16px; font-size:13px; font-weight:500; border:none; border-radius:9px; white-space:nowrap; cursor:pointer; transition:all 0.15s ease;"
          x-bind:style={`tab === '${t}'
            ? 'background:linear-gradient(180deg,#1F2831 0%,#1A2028 100%); color:#F1F5F9; box-shadow:inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 6px rgba(0,0,0,0.30); border:1px solid rgba(255,255,255,0.09);'
            : 'background:transparent; color:#64748B; border:1px solid transparent;'`}
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
          <p style="font-size:15px; font-weight:600; color:#F1F5F9; margin-bottom:18px; letter-spacing:-0.01em;">General Settings</p>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" name="name" value={tenant?.name ?? ''} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';" />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <textarea name="address" rows={3} style={`${inputStyle} resize:vertical;`} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';">{tenant?.address ?? ''}</textarea>
            </div>
            <div>
              <label style={labelStyle}>Contact Email</label>
              <input type="email" name="contact_email" value={tenant?.contact_email ?? ''} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';" />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone</label>
              <input type="tel" name="contact_phone" value={tenant?.contact_phone ?? ''} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';" />
            </div>
            <div>
              <label style={labelStyle}>Timezone</label>
              <select name="timezone" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';">
                {['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Asia/Kolkata'].map((tz) => (
                  <option key={tz} value={tz} selected={tenant?.timezone === tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select name="currency" style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';">
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
          <p style="font-size:15px; font-weight:600; color:#F1F5F9; margin-bottom:18px; letter-spacing:-0.01em;">Slot Configuration</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            {[
              { label: 'Slot Duration (min)',      name: 'slot_duration_min',       val: tenant?.slot_duration_min      ?? 60,    type: 'number' },
              { label: 'Max Bookings per Slot',    name: 'max_bookings_per_slot',   val: tenant?.max_bookings_per_slot  ?? 5,     type: 'number' },
              { label: 'Advance Booking Days',     name: 'advance_booking_days',    val: tenant?.advance_booking_days   ?? 7,     type: 'number' },
              { label: 'Slot Hold Duration (min)', name: 'slot_hold_duration_min',  val: tenant?.slot_hold_duration_min ?? 10,    type: 'number' },
              { label: 'Same-Day Cutoff Time',     name: 'same_day_cutoff_time',    val: tenant?.same_day_cutoff_time   ?? '09:00', type: 'time' },
            ].map((f) => (
              <div key={f.name}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} name={f.name} value={f.val} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';" />
              </div>
            ))}
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
          <p style="font-size:15px; font-weight:600; color:#F1F5F9; margin-bottom:18px; letter-spacing:-0.01em;">Pricing & Charges</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            {[
              { label: 'Storage Rate per CBM',       name: 'storage_rate_per_cbm',           val: tenant?.storage_rate_per_cbm,           step: '0.01' },
              { label: 'Storage Free Days',           name: 'storage_free_days',               val: tenant?.storage_free_days },
              { label: 'Shrink Wrap Rate / Pallet',  name: 'shrink_wrap_rate_per_pallet',     val: tenant?.shrink_wrap_rate_per_pallet,    step: '0.01' },
              { label: 'Slot Fee — Pick Up',          name: 'slot_fee_pickup',                 val: tenant?.slot_fee_pickup,                step: '0.01' },
              { label: 'Slot Fee — Drop Off',         name: 'slot_fee_dropoff',                val: tenant?.slot_fee_dropoff,               step: '0.01' },
            ].map((f) => (
              <div key={f.name}>
                <label style={labelStyle}>{f.label}</label>
                <input type="number" name={f.name} value={f.val ?? ''} step={f.step} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';" />
              </div>
            ))}
          </div>
          <div style="margin-top:16px; display:flex; align-items:center; gap:10px;">
            <input type="checkbox" id="gst_enabled" name="gst_enabled" checked={tenant?.gst_enabled} x-model="gstEnabled" x-init={`gstEnabled = ${tenant?.gst_enabled ? 'true' : 'false'}`} style="accent-color:#FC6514; width:16px; height:16px;" />
            <label for="gst_enabled" style="font-size:13px; font-weight:500; color:#F1F5F9; cursor:pointer;">GST Enabled</label>
          </div>
          <div style="margin-top:14px;" x-show="gstEnabled">
            <label style={labelStyle}>GST Rate (%)</label>
            <input type="number" name="gst_rate" value={tenant?.gst_rate ?? 10} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';" />
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
          <p style="font-size:15px; font-weight:600; color:#F1F5F9; margin-bottom:18px; letter-spacing:-0.01em;">Payment Settings</p>
          <div style="display:flex; flex-direction:column; gap:16px;">
            {[
              { label: 'Stripe Public Key',  name: 'stripe_public_key',         val: tenant?.stripe_public_key,  ph: 'pk_live_…',  type: 'text' },
              { label: 'EFT Bank Name',      name: 'eft_bank_name',             val: tenant?.eft_bank_name,      ph: '',           type: 'text' },
              { label: 'EFT BSB',            name: 'eft_bsb',                   val: tenant?.eft_bsb,            ph: '000-000',    type: 'text' },
              { label: 'EFT Account Number', name: 'eft_account_number',        val: tenant?.eft_account_number, ph: '',           type: 'text' },
              { label: 'EFT Account Name',   name: 'eft_account_name',          val: tenant?.eft_account_name,   ph: '',           type: 'text' },
            ].map((f) => (
              <div key={f.name}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} name={f.name} value={f.val ?? ''} placeholder={f.ph} style={inputStyle} onfocus="this.style.borderColor='rgba(252,101,20,0.50)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.25), 0 0 0 3px rgba(252,101,20,0.15)';" onblur="this.style.borderColor='rgba(255,255,255,0.09)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.30), inset 0 1px 0 rgba(0,0,0,0.20)';" />
              </div>
            ))}
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="checkbox" id="require_payment_to_confirm" name="require_payment_to_confirm" checked={tenant?.require_payment_to_confirm} style="accent-color:#FC6514; width:16px; height:16px;" />
              <label for="require_payment_to_confirm" style="font-size:13px; font-weight:500; color:#F1F5F9; cursor:pointer;">Require payment to confirm booking</label>
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
          <p style="font-size:15px; font-weight:600; color:#F1F5F9; letter-spacing:-0.01em;">Team Members</p>
          <button
            type="button"
            class="btn-ghost"
            style="font-size:12px; padding:7px 14px; cursor:pointer;"
          >
            + Invite
          </button>
        </div>
        <table style="width:100%; font-size:13px; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
              {['Name','Email','Role','Status',''].map((h) => (
                <th key={h} style="text-align:left; padding:8px 0; font-size:10px; font-weight:700; color:#64748B; letter-spacing:0.07em; text-transform:uppercase;">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u: any) => (
              <tr key={u.email} style="border-bottom:1px solid rgba(255,255,255,0.06);">
                <td style="padding:12px 0; color:#F1F5F9; font-weight:500;">{u.name}</td>
                <td style="padding:12px 0; color:#94A3B8;">{u.email}</td>
                <td style="padding:12px 0;">
                  <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); border-radius:6px; padding:3px 8px; font-size:11px; color:#94A3B8; font-weight:500;">{u.role}</span>
                </td>
                <td style="padding:12px 0;">
                  <span style={`border-radius:6px; padding:3px 8px; font-size:11px; font-weight:500; ${u.status === 'Active' ? 'background:rgba(34,197,94,0.12); color:#22C55E; border:1px solid rgba(34,197,94,0.22);' : 'background:rgba(255,255,255,0.05); color:#64748B; border:1px solid rgba(255,255,255,0.09);'}`}>{u.status}</span>
                </td>
                <td style="padding:12px 0; text-align:right;">
                  <button type="button" style="font-size:12px; color:#64748B; background:none; border:none; cursor:pointer; transition:color 0.15s ease;" onmouseover="this.style.color='#F1F5F9'" onmouseout="this.style.color='#64748B'">Edit</button>
                </td>
              </tr>
            ))}
            {(users ?? []).length === 0 && (
              <tr>
                <td colspan={5} style="padding:40px 0; text-align:center; color:#64748B; font-size:13px;">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
