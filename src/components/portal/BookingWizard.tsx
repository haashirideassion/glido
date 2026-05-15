import { Button } from '../ui/button'
import { Icon, ICONS } from '../../lib/Icon'
import { Step1ServiceType } from './Step1ServiceType'
import { Step2SlotPicker } from './Step2SlotPicker'
import { Step3HoldConfirm } from './Step3HoldConfirm'
import { Step4ShipmentDetails } from './Step4ShipmentDetails'
import { Step5Documents } from './Step5Documents'
import { Step6ContactVehicle } from './Step6ContactVehicle'
import { Step7Confirmation } from './Step7Confirmation'

const STEP_LABELS = ['Slots', 'Service', 'Cargo', 'Time Slot', 'Details', 'Documents', 'Payment']

export const BookingWizard = () => (
  <div x-data="{}">

    {/* Step indicator */}
    <div x-show="$store.wizard.currentStep <= 7" class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-foreground-muted font-medium">
          Step <span x-text="$store.wizard.currentStep"></span> of 7
        </span>
        <span class="text-sm text-foreground-muted font-semibold" x-text="['Slots','Service','Cargo','Time Slot','Details','Documents','Payment'][$store.wizard.currentStep - 1] || ''"></span>
      </div>

      {/* Step circles */}
      <div class="flex items-center gap-1 mb-3">
        {STEP_LABELS.map((label, i) => (
          <div key={label} class="flex items-center flex-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
              {...{"x-bind:class": `$store.wizard.currentStep > ${i + 1} ? 'bg-primary text-primary-foreground' : $store.wizard.currentStep === ${i + 1} ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-background-subtle text-foreground-muted border border-border'`}}
            >
              <span x-show={`$store.wizard.currentStep > ${i + 1}`}>
                <Icon name={ICONS.check} size={14} />
              </span>
              <span x-show={`$store.wizard.currentStep <= ${i + 1}`}>{i + 1}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                class="flex-1 h-0.5 mx-1 rounded-full transition-all"
                {...{"x-bind:class": `$store.wizard.currentStep > ${i + 1} ? 'bg-primary' : 'bg-border'`}}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div class="h-1.5 bg-background-subtle rounded-full overflow-hidden">
        <div
          class="h-full bg-primary rounded-full transition-all duration-500"
          {...{"x-bind:style": "'width:' + (($store.wizard.currentStep - 1) / 6 * 100) + '%'"}}
        ></div>
      </div>
    </div>

    {/* Hold timer banner — shown on steps 5, 6, 7 when hold is active */}
    <div
      x-show="$store.wizard.currentStep >= 5 && $store.wizard.holdActive"
      class="mb-4 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium border"
      {...{"x-bind:class": "$store.wizard.holdExpiring ? 'bg-red-50 border-red-200 text-red-800' : 'bg-warning-soft border-amber-200 text-warning'"}}
    >
      <Icon name={ICONS.clock} size={20} class="shrink-0" />
      <span>
        Your slot is held for{' '}
        <span class="font-bold font-mono text-base" x-text="`${$store.wizard.holdMinutes}:${$store.wizard.holdSeconds}`"></span>
        {' '}— complete payment to secure it.
      </span>
    </div>

    {/* Step panels */}
    <div class="bg-card rounded-2xl border border-border shadow-sm p-8 min-h-[420px]">
      <Step1ServiceType />
      <Step2SlotPicker />
      <Step3HoldConfirm />
      <Step4ShipmentDetails />
      <Step5Documents />
      <Step6ContactVehicle />
      <Step7Confirmation />

      {/* Confirmation screen (step 8) */}
      <div x-show="$store.wizard.currentStep === 8" x-cloak>
        <div class="text-center py-4">
          <div class="w-20 h-20 bg-success-soft rounded-full flex items-center justify-center mx-auto mb-5">
            <Icon name={ICONS.check} size={40} class="text-success" />
          </div>
          <h2 class="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p class="text-foreground-muted mb-7">A confirmation has been sent with your QR code.</p>

          <div class="bg-background-subtle border border-border rounded-2xl px-6 py-4 mb-6 inline-block">
            <p class="text-xs text-foreground-muted mb-1 uppercase tracking-widest font-semibold">Reference Number</p>
            <p class="font-mono text-2xl font-bold text-foreground tracking-wider" x-text="$store.wizard.confirmationRef"></p>
          </div>

          {/* QR code placeholder */}
          <div class="w-40 h-40 bg-background-subtle border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center mx-auto mb-7">
            <Icon name={ICONS.qrCode} size={52} class="text-foreground-muted mb-1.5" />
            <p class="text-xs text-foreground-muted font-medium">Scan at kiosk</p>
          </div>

          {/* Summary */}
          <div class="bg-background-subtle border border-border rounded-2xl p-5 text-left mb-6 text-sm space-y-3 max-w-sm mx-auto">
            <div class="flex justify-between">
              <span class="text-foreground-muted">Service</span>
              <span class="font-semibold text-foreground capitalize" x-text="$store.wizard.serviceType === 'pickup' ? 'Pick Up' : 'Drop Off'"></span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground-muted">Load Type</span>
              <span class="font-semibold text-foreground uppercase" x-text="$store.wizard.loadType"></span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground-muted">Slot</span>
              <span class="font-semibold text-foreground" x-text="$store.wizard.selectedSlotLabel || '—'"></span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground-muted">Driver</span>
              <span class="font-semibold text-foreground" x-text="$store.wizard.driverName || '—'"></span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 justify-center mb-6">
            <button
              type="button"
              class="inline-flex items-center gap-2 border border-border text-foreground-muted text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-background-subtle transition-colors"
            >
              <Icon name={ICONS.download} size={16} />
              Download PDF
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 border border-border text-foreground-muted text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-background-subtle transition-colors"
            >
              <Icon name={ICONS.calendar} size={16} />
              Add to Calendar
            </button>
          </div>

          <button
            type="button"
            class="text-primary hover:opacity-80 text-sm font-semibold hover:underline"
            x-on:click="$store.wizard.reset(); window.location.href = '/book'"
          >
            Book another visit →
          </button>
        </div>
      </div>
    </div>

    {/* Navigation buttons — hidden on step 7 and 8 */}
    <div class="flex items-center justify-between mt-5" x-show="$store.wizard.currentStep < 7">
      <Button
        variant="outline"
        class="gap-2"
        x-on:click="$store.wizard.prevStep()"
        {...{"x-bind:disabled": "$store.wizard.currentStep <= 1"}}
      >
        <Icon name={ICONS.arrowLeft} size={16} />
        Back
      </Button>

      <Button
        class="gap-2"
        x-on:click="$store.wizard.nextStep()"
        {...{"x-bind:disabled": "!$store.wizard.canProceed"}}
      >
        <span x-text="$store.wizard.currentStep === 6 ? 'Review & Pay' : 'Next'">Next</span>
        <span x-show="$store.wizard.currentStep < 6">
          <Icon name={ICONS.arrowRight} size={16} />
        </span>
      </Button>
    </div>
  </div>
)
