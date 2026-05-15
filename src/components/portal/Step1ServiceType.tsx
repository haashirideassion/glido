export const Step1ServiceType = () => (
  <div x-show="$store.wizard.currentStep === 1" x-cloak>

    <h2 style="font-size:17px; font-weight:600; color:#1C1917; letter-spacing:-0.015em; margin-bottom:4px;">
      How many shipments today?
    </h2>
    <p style="font-size:13px; color:#A8A29E; margin-bottom:28px; line-height:1.5;">
      Each HBL or container number needs its own time slot.
    </p>

    {/* ── Slot counter ───────────────────────────────────────────────────── */}
    <div style="margin-bottom:28px;">
      {/* Neumorphic stepper */}
      <div style="display:inline-flex; align-items:center; gap:0; background:#EDE9E2; border-radius:14px; padding:4px; box-shadow:inset 2px 2px 6px rgba(0,0,0,0.09), inset -2px -2px 5px rgba(255,255,255,0.85); margin-bottom:14px;">
        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount > 1) $store.wizard.slotCount--"
          x-bind:disabled="$store.wizard.slotCount <= 1"
          style="width:38px; height:38px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:300; color:#57534E; background:#FAFAF8; border:none; border-radius:10px; cursor:pointer; box-shadow:2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9); transition:all 0.1s ease; flex-shrink:0; line-height:1;"
          x-bind:style="$store.wizard.slotCount <= 1 ? 'opacity:0.3; cursor:not-allowed;' : ''"
          onmousedown="if(this.style.cursor!=='not-allowed'){this.style.boxShadow='1px 1px 3px rgba(0,0,0,0.09),-1px -1px 2px rgba(255,255,255,0.9)'; this.style.transform='scale(0.96)';}"
          onmouseup="this.style.boxShadow='2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9)'; this.style.transform='';"
          onmouseleave="this.style.boxShadow='2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9)'; this.style.transform='';"
        >−</button>

        <span
          style="width:52px; text-align:center; font-size:20px; font-weight:700; color:#1C1917; font-variant-numeric:tabular-nums; letter-spacing:-0.02em;"
          x-text="$store.wizard.slotCount"
        >1</span>

        <button
          type="button"
          x-on:click="if ($store.wizard.slotCount < 10) $store.wizard.slotCount++"
          x-bind:disabled="$store.wizard.slotCount >= 10"
          style="width:38px; height:38px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:300; color:#57534E; background:#FAFAF8; border:none; border-radius:10px; cursor:pointer; box-shadow:2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9); transition:all 0.1s ease; flex-shrink:0; line-height:1;"
          x-bind:style="$store.wizard.slotCount >= 10 ? 'opacity:0.3; cursor:not-allowed;' : ''"
          onmousedown="if(this.style.cursor!=='not-allowed'){this.style.boxShadow='1px 1px 3px rgba(0,0,0,0.09),-1px -1px 2px rgba(255,255,255,0.9)'; this.style.transform='scale(0.96)';}"
          onmouseup="this.style.boxShadow='2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9)'; this.style.transform='';"
          onmouseleave="this.style.boxShadow='2px 2px 5px rgba(0,0,0,0.09),-1px -1px 4px rgba(255,255,255,0.9)'; this.style.transform='';"
        >+</button>
      </div>

      {/* Quick-select chips */}
      <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
        {[1, 2, 3, 5, 10].map((n) => (
          <button
            key={n}
            type="button"
            x-on:click={`$store.wizard.slotCount = ${n}`}
            style="padding:5px 13px; font-size:12px; font-weight:500; border-radius:9999px; border:none; cursor:pointer; transition:all 0.15s ease;"
            x-bind:style={`$store.wizard.slotCount === ${n}
              ? 'background:#F97316; color:white; box-shadow:rgba(249,115,22,0.28) 0px 2px 8px 0px;'
              : 'background:#EDE9E2; color:#78716C; box-shadow:2px 2px 4px rgba(0,0,0,0.07),-1px -1px 3px rgba(255,255,255,0.8);'`}
          >
            {n}
          </button>
        ))}
        <span style="font-size:11px; color:#C2BEBB; align-self:center; margin-left:2px;">max 10</span>
      </div>
    </div>

    {/* ── Guest info ──────────────────────────────────────────────────────── */}
    <div style="display:flex; flex-direction:column; gap:18px;">

      <div>
        <label style="display:block; font-size:11px; font-weight:600; color:#78716C; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:8px;">
          Your Name <span style="color:#F97316;">*</span>
        </label>
        <input
          type="text"
          x-model="$store.wizard.guestName"
          placeholder="e.g. Sarah Nguyen"
          style="width:100%; padding:12px 16px; font-size:14px; color:#1C1917; background:#F5F2EC; border:none; border-radius:12px; outline:none; transition:box-shadow 0.2s ease; box-sizing:border-box; box-shadow:inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.85);"
          onfocus="this.style.boxShadow='inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.85), 0 0 0 2px rgba(249,115,22,0.3)';"
          onblur="this.style.boxShadow='inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.85)';"
        />
        <p style="font-size:11px; color:#C2BEBB; margin-top:5px; padding-left:2px;">Required — min. 2 characters</p>
      </div>

      <div>
        <label style="display:block; font-size:11px; font-weight:600; color:#78716C; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:8px;">
          Phone Number
          <span style="font-size:11px; color:#C2BEBB; text-transform:none; font-weight:400; letter-spacing:0; margin-left:5px;">(optional)</span>
        </label>
        <input
          type="tel"
          x-model="$store.wizard.guestPhone"
          placeholder="+61 4XX XXX XXX"
          style="width:100%; padding:12px 16px; font-size:14px; color:#1C1917; background:#F5F2EC; border:none; border-radius:12px; outline:none; transition:box-shadow 0.2s ease; box-sizing:border-box; box-shadow:inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.85);"
          onfocus="this.style.boxShadow='inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.85), 0 0 0 2px rgba(249,115,22,0.3)';"
          onblur="this.style.boxShadow='inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.85)';"
        />
      </div>
    </div>

    {/* Multi-slot note */}
    <div
      x-show="$store.wizard.slotCount > 1"
      style="margin-top:18px; border-radius:10px; padding:10px 14px; font-size:12px; line-height:1.5; background:#EDE9E2; color:#78716C; box-shadow:inset 1px 1px 3px rgba(0,0,0,0.06);"
    >
      <span class="font-semibold" x-text="$store.wizard.slotCount"></span> slots — you'll enter shipment details for each one separately.
    </div>

  </div>
)
