export const Step1ServiceType = () => (
  <div x-show="$store.wizard.currentStep === 1" x-cloak>

    <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:4px;">
      How many shipments today?
    </h2>
    <p style="font-size:13px; color:#78716C; margin-bottom:24px; line-height:1.5;">
      Each HBL or container number needs its own time slot.
    </p>

    {/* ── Slot count ─────────────────────────────────────────────────────── */}
    <div style="margin-bottom:24px;">
      <div style="display:flex; align-items:center; gap:0; margin-bottom:12px; width:fit-content; background:rgba(234,230,219,0.6); border:1px solid rgba(249,115,22,0.15); border-radius:12px; overflow:hidden;">
        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount > 1) $store.wizard.slotCount--"
          x-bind:disabled="$store.wizard.slotCount <= 1"
          style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:400; color:#78716C; background:none; border:none; cursor:pointer; border-right:1px solid rgba(249,115,22,0.12); transition:background 0.1s ease;"
          x-bind:style="$store.wizard.slotCount <= 1 ? 'opacity:0.35; cursor:not-allowed;' : ''"
          onmouseover="if(this.style.cursor!=='not-allowed'){this.style.background='rgba(249,115,22,0.06)';}"
          onmouseout="this.style.background='none';"
        >−</button>
        <span
          style="width:48px; text-align:center; font-size:16px; font-weight:600; color:#1C1917; font-variant-numeric:tabular-nums;"
          x-text="$store.wizard.slotCount"
        >1</span>
        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount < 10) $store.wizard.slotCount++"
          x-bind:disabled="$store.wizard.slotCount >= 10"
          style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:400; color:#78716C; background:none; border:none; cursor:pointer; border-left:1px solid rgba(249,115,22,0.12); transition:background 0.1s ease;"
          x-bind:style="$store.wizard.slotCount >= 10 ? 'opacity:0.35; cursor:not-allowed;' : ''"
          onmouseover="if(this.style.cursor!=='not-allowed'){this.style.background='rgba(249,115,22,0.06)';}"
          onmouseout="this.style.background='none';"
        >+</button>
      </div>

      {/* Quick-select */}
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        {[1, 2, 3, 5, 10].map((n) => (
          <button
            key={n}
            type="button"
            x-on:click={`$store.wizard.slotCount = ${n}`}
            style="padding:4px 12px; font-size:12px; font-weight:500; border-radius:9999px; border:1px solid; cursor:pointer; transition:background 0.15s ease, color 0.15s ease, border-color 0.15s ease;"
            x-bind:style={`$store.wizard.slotCount === ${n}
              ? 'background:#F97316; color:white; border-color:#F97316;'
              : 'background:transparent; color:#78716C; border-color:rgba(240,197,137,0.6);'`}
          >
            {n}
          </button>
        ))}
        <span style="font-size:11px; color:#A8A29E; align-self:center; margin-left:4px;">max 10</span>
      </div>
    </div>

    {/* ── Guest info ──────────────────────────────────────────────────────── */}
    <div style="display:flex; flex-direction:column; gap:16px;">

      <div>
        <label style="display:block; font-size:12px; font-weight:600; color:#57534E; letter-spacing:0.02em; text-transform:uppercase; margin-bottom:7px;">
          Your name <span style="color:#F97316;">*</span>
        </label>
        <input
          type="text"
          x-model="$store.wizard.guestName"
          placeholder="e.g. Sarah Nguyen"
          style="width:100%; padding:10px 14px; font-size:13.5px; color:#1C1917; background:#FFFBF5; border:1.5px solid rgba(240,197,137,0.6); border-radius:10px; outline:none; transition:border-color 0.15s ease; box-sizing:border-box;"
          onfocus="this.style.borderColor='#F97316';"
          onblur="this.style.borderColor='rgba(240,197,137,0.6)';"
        />
        <p style="font-size:11px; color:#A8A29E; margin-top:4px;">Required — min. 2 characters</p>
      </div>

      <div>
        <label style="display:block; font-size:12px; font-weight:600; color:#57534E; letter-spacing:0.02em; text-transform:uppercase; margin-bottom:7px;">
          Phone number <span style="font-size:11px; color:#A8A29E; text-transform:none; font-weight:400; letter-spacing:0;">(optional)</span>
        </label>
        <input
          type="tel"
          x-model="$store.wizard.guestPhone"
          placeholder="+61 4XX XXX XXX"
          style="width:100%; padding:10px 14px; font-size:13.5px; color:#1C1917; background:#FFFBF5; border:1.5px solid rgba(240,197,137,0.6); border-radius:10px; outline:none; transition:border-color 0.15s ease; box-sizing:border-box;"
          onfocus="this.style.borderColor='#F97316';"
          onblur="this.style.borderColor='rgba(240,197,137,0.6)';"
        />
      </div>
    </div>

    {/* Multi-slot note */}
    <div
      x-show="$store.wizard.slotCount > 1"
      style="margin-top:16px; border-radius:10px; padding:10px 14px; font-size:12px; line-height:1.5; background:rgba(249,115,22,0.06); border:1px solid rgba(249,115,22,0.15); color:#92400E;"
    >
      <span class="font-semibold" x-text="$store.wizard.slotCount"></span> slots selected — you'll enter shipment details for each one separately.
    </div>

  </div>
)
