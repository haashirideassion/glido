import { Icon, ICONS } from '../../lib/Icon'

export const Step3HoldConfirm = () => (
  <div x-show="$store.wizard.currentStep === 3" x-cloak>
    <h2 class="text-xl font-bold text-foreground mb-1">What type of cargo?</h2>
    <p class="text-foreground-muted text-sm mb-7">Select your cargo type. This determines what details we'll ask for next.</p>

    <div class="grid grid-cols-2 gap-4 mb-6">
      {/* FCL card */}
      <button
        type="button"
        x-on:click="$store.wizard.selectLoadType('fcl')"
        class="border-2 rounded-2xl p-8 text-left transition-all focus:outline-none relative"
        {...{"x-bind:class": "$store.wizard.loadType === 'fcl' ? 'bg-primary-soft border-primary ring-2 ring-primary/20' : 'bg-card border-border hover:border-primary/40 hover:bg-primary-soft/50'"}}
      >
        {/* Selected badge */}
        <div
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          x-show="$store.wizard.loadType === 'fcl'"
        >
          <Icon name={ICONS.check} size={13} />
        </div>

        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors"
          {...{"x-bind:class": "$store.wizard.loadType === 'fcl' ? 'bg-primary text-primary-foreground' : 'bg-background-subtle text-foreground-muted'"}}
        >
          <Icon name={ICONS.container} size={26} />
        </div>
        <p
          class="font-bold text-lg mb-1 transition-colors"
          {...{"x-bind:class": "$store.wizard.loadType === 'fcl' ? 'text-primary' : 'text-foreground'"}}
        >
          FCL
        </p>
        <p class="text-sm text-foreground-muted leading-relaxed mb-4">Full container load</p>
        <ul class="space-y-1.5">
          <li class="text-xs text-foreground-muted">• Single container</li>
          <li class="text-xs text-foreground-muted">• Container number required</li>
          <li class="text-xs text-foreground-muted">• No HBL needed</li>
        </ul>
      </button>

      {/* LCL card */}
      <button
        type="button"
        x-on:click="$store.wizard.selectLoadType('lcl')"
        class="border-2 rounded-2xl p-8 text-left transition-all focus:outline-none relative"
        {...{"x-bind:class": "$store.wizard.loadType === 'lcl' ? 'bg-primary-soft border-primary ring-2 ring-primary/20' : 'bg-card border-border hover:border-primary/40 hover:bg-primary-soft/50'"}}
      >
        {/* Selected badge */}
        <div
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          x-show="$store.wizard.loadType === 'lcl'"
        >
          <Icon name={ICONS.check} size={13} />
        </div>

        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors"
          {...{"x-bind:class": "$store.wizard.loadType === 'lcl' ? 'bg-primary text-primary-foreground' : 'bg-background-subtle text-foreground-muted'"}}
        >
          <Icon name={ICONS.cargo} size={26} />
        </div>
        <p
          class="font-bold text-lg mb-1 transition-colors"
          {...{"x-bind:class": "$store.wizard.loadType === 'lcl' ? 'text-primary' : 'text-foreground'"}}
        >
          LCL
        </p>
        <p class="text-sm text-foreground-muted leading-relaxed mb-4">Less than container load</p>
        <ul class="space-y-1.5">
          <li class="text-xs text-foreground-muted">• Shared container</li>
          <li class="text-xs text-foreground-muted">• HBL + container number required</li>
          <li class="text-xs text-foreground-muted">• ICS auto-checked</li>
        </ul>
      </button>
    </div>

    <p class="text-xs text-foreground-muted text-center">
      Not sure which applies? <a href="#" class="text-primary hover:underline">FCL vs LCL explained →</a>
    </p>
  </div>
)
