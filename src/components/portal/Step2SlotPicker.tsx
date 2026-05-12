import { Icon, ICONS } from '../../lib/Icon'

export const Step2SlotPicker = () => (
  <div x-show="$store.wizard.currentStep === 2" x-cloak>
    <h2 class="text-xl font-bold text-foreground mb-1">What are you here to do?</h2>
    <p class="text-foreground-muted text-sm mb-7">Select your visit purpose. This applies to all slots in this session.</p>

    <div class="grid grid-cols-2 gap-4 mb-6">
      {/* Pick Up card */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('pickup')"
        class="border-2 rounded-2xl p-8 text-left transition-all focus:outline-none relative"
        {...{"x-bind:class": "$store.wizard.serviceType === 'pickup' ? 'bg-primary-soft border-primary ring-2 ring-primary/20' : 'bg-card border-border hover:border-primary/40 hover:bg-primary-soft/50'"}}
      >
        {/* Selected badge */}
        <div
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          x-show="$store.wizard.serviceType === 'pickup'"
        >
          <Icon name={ICONS.check} size={13} />
        </div>

        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors"
          {...{"x-bind:class": "$store.wizard.serviceType === 'pickup' ? 'bg-primary text-primary-foreground' : 'bg-background-subtle text-foreground-muted'"}}
        >
          <Icon name={ICONS.arrowDown} size={26} />
        </div>
        <p
          class="font-bold text-lg mb-1.5 transition-colors"
          {...{"x-bind:class": "$store.wizard.serviceType === 'pickup' ? 'text-primary' : 'text-foreground'"}}
        >
          Pick Up
        </p>
        <p class="text-sm text-foreground-muted leading-relaxed mb-4">Collect cargo from the CFS</p>
        <ul class="space-y-1.5">
          <li class="text-xs text-foreground-muted">• Requires HBL or container number</li>
          <li class="text-xs text-foreground-muted">• ICS clearance checked automatically</li>
          <li class="text-xs text-foreground-muted">• CHEP pallets flagged if applicable</li>
        </ul>
      </button>

      {/* Drop Off card */}
      <button
        type="button"
        x-on:click="$store.wizard.selectServiceType('dropoff')"
        class="border-2 rounded-2xl p-8 text-left transition-all focus:outline-none relative"
        {...{"x-bind:class": "$store.wizard.serviceType === 'dropoff' ? 'bg-primary-soft border-primary ring-2 ring-primary/20' : 'bg-card border-border hover:border-primary/40 hover:bg-primary-soft/50'"}}
      >
        {/* Selected badge */}
        <div
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          x-show="$store.wizard.serviceType === 'dropoff'"
        >
          <Icon name={ICONS.check} size={13} />
        </div>

        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors"
          {...{"x-bind:class": "$store.wizard.serviceType === 'dropoff' ? 'bg-primary text-primary-foreground' : 'bg-background-subtle text-foreground-muted'"}}
        >
          <Icon name={ICONS.arrowUp} size={26} />
        </div>
        <p
          class="font-bold text-lg mb-1.5 transition-colors"
          {...{"x-bind:class": "$store.wizard.serviceType === 'dropoff' ? 'text-primary' : 'text-foreground'"}}
        >
          Drop Off
        </p>
        <p class="text-sm text-foreground-muted leading-relaxed mb-4">Deliver cargo to the CFS</p>
        <ul class="space-y-1.5">
          <li class="text-xs text-foreground-muted">• Booking required before arrival</li>
          <li class="text-xs text-foreground-muted">• Container or HBL number needed</li>
          <li class="text-xs text-foreground-muted">• Slot confirmed via QR code</li>
        </ul>
      </button>
    </div>

    <p class="text-xs text-foreground-muted text-center">
      Not sure? <a href="#" class="text-primary hover:underline">View depot services guide →</a>
    </p>
  </div>
)
