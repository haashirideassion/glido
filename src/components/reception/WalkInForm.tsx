const wlabel = 'display:block; font-size:11px; font-weight:600; color:#6B6560; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:7px;'
const winput = 'width:100%; padding:11px 14px; font-size:14px; color:#1A1815; background:#FEFCFA; border:1.5px solid rgba(0,0,0,0.10); border-radius:10px; outline:none; transition:border-color 0.15s ease, box-shadow 0.15s ease; box-sizing:border-box;'
const wfocus = `onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';" onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"`

export const WalkInForm = () => (
  <div class="max-w-2xl">
    {/* Info banner */}
    <div
      class="mb-6 flex items-start gap-3"
      style="background:#F0F4FF; border:1px solid rgba(99,102,241,0.15); border-radius:12px; padding:14px 16px;"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4338CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <p style="font-size:13px; font-weight:600; color:#3730A3; margin-bottom:3px;">Walk-in Registration</p>
        <p style="font-size:12px; color:#4338CA; line-height:1.5;">
          Use this form for visitors who arrive without a prior booking. A booking reference will be generated on submission.
        </p>
      </div>
    </div>

    <form
      style="background:#FEFCFA; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.06);"
      hx-post="/reception/walk-in"
      hx-target="#walk-in-result"
      hx-swap="innerHTML"
    >
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
        <div>
          <label style={wlabel}>
            Service Type <span style="color:#DC2626">*</span>
          </label>
          <select
            name="serviceType"
            style={winput}
            onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
            onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
          >
            <option value="">Select…</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
            <option value="transshipment">Transshipment</option>
          </select>
        </div>
        <div>
          <label style={wlabel}>
            Load Type <span style="color:#DC2626">*</span>
          </label>
          <select
            name="loadType"
            style={winput}
            onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
            onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
          >
            <option value="">Select…</option>
            <option value="fcl">FCL</option>
            <option value="lcl">LCL</option>
            <option value="breakbulk">Breakbulk</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label style={wlabel}>
          Visitor Full Name <span style="color:#DC2626">*</span>
        </label>
        <input
          type="text"
          name="visitorName"
          placeholder="e.g. Ahmed Raza"
          required
          style={winput}
          onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
          onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
        />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
        <div>
          <label style={wlabel}>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="03XX-XXXXXXX"
            style={winput}
            onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
            onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
          />
        </div>
        <div>
          <label style={wlabel}>
            Vehicle Registration <span style="color:#DC2626">*</span>
          </label>
          <input
            type="text"
            name="vehicleReg"
            placeholder="LEA-1234"
            required
            class="uppercase"
            style={winput}
            onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
            onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
          />
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label style={wlabel}>
          B/L Number <span style="color:#DC2626">*</span>
        </label>
        <input
          type="text"
          name="blNumber"
          placeholder="e.g. COSCO2026041201"
          required
          style={winput}
          onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
          onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
        />
      </div>

      <div style="margin-bottom:16px;">
        <label style={wlabel}>
          Cargo Description <span style="color:#DC2626">*</span>
        </label>
        <textarea
          name="cargoDescription"
          rows={2}
          placeholder="Brief description of cargo"
          required
          style={`${winput} resize:none;`}
          onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
          onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
        ></textarea>
      </div>

      <div style="margin-bottom:24px;">
        <label style={wlabel}>Assign to Slot</label>
        <select
          name="slotId"
          style={winput}
          onfocus="this.style.borderColor='#F97316'; this.style.boxShadow='0 0 0 3px rgba(249,115,22,0.12)';"
          onblur="this.style.borderColor='rgba(0,0,0,0.10)'; this.style.boxShadow='none';"
        >
          <option value="">Next available slot</option>
          <option value="immediate">Immediate / Now</option>
        </select>
      </div>

      <button
        type="submit"
        style="width:100%; padding:14px; background:linear-gradient(135deg,#F97316,#EA6C0A); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; box-shadow:rgba(249,115,22,0.35) 0px 4px 16px 0px; transition:box-shadow 0.15s ease; letter-spacing:0.01em;"
        onmouseover="this.style.boxShadow='rgba(249,115,22,0.45) 0px 6px 20px 0px';"
        onmouseout="this.style.boxShadow='rgba(249,115,22,0.35) 0px 4px 16px 0px';"
      >
        Register Walk-In
      </button>
    </form>

    <div id="walk-in-result" class="mt-4"></div>
  </div>
)
