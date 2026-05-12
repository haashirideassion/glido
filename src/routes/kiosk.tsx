import { Hono } from 'hono'
import { KioskLayout } from '../layouts/KioskLayout'
import { WelcomeScreen } from '../components/kiosk/WelcomeScreen'
import { LookupScreen } from '../components/kiosk/LookupScreen'
import { PurposeScreen } from '../components/kiosk/PurposeScreen'
import { IDScanScreen } from '../components/kiosk/IDScanScreen'
import { ConfirmScreen } from '../components/kiosk/ConfirmScreen'
import { ArrivedScreen } from '../components/kiosk/ArrivedScreen'
import { WalkInScreen } from '../components/kiosk/WalkInScreen'
import { Icon, ICONS } from '../lib/Icon'

export const kioskRoutes = new Hono()

kioskRoutes.get('/', (c) => {
  return c.html(
    <KioskLayout>
      <div class="relative h-full w-full">

        {/* Welcome screen */}
        <WelcomeScreen />

        {/* Lookup screen — has a booking */}
        <LookupScreen />

        {/* Purpose screen — no booking / walk-in */}
        <PurposeScreen />

        {/* ID scan screen */}
        <IDScanScreen />

        {/* Confirm arrival screen */}
        <ConfirmScreen />

        {/* Arrived / check-in success screen */}
        <ArrivedScreen />

        {/* Walk-in registration screen */}
        <WalkInScreen />

        {/* Screensaver screen */}
        <div
          class="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center"
          x-show="$store.kiosk.currentScreen === 'screensaver'"
          x-transition:enter="transition-opacity duration-500"
          x-transition:enter-start="opacity-0"
          x-transition:enter-end="opacity-100"
          x-transition:leave="transition-opacity duration-300"
          x-transition:leave-start="opacity-100"
          x-transition:leave-end="opacity-0"
          {...{"x-on:click": "$store.kiosk.wakeFromScreensaver()"}}
        >
          <div class="text-center" style="animation: pulse 3s ease-in-out infinite;">
            <div class="w-24 h-24 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Icon name={ICONS.logo} size={56} class="text-blue-400 opacity-80" />
            </div>
            <p class="text-4xl font-light text-white/80 mb-2">Sydney CFS</p>
            <p class="text-lg text-white/40 mb-10">Container Freight Station</p>
            <p class="text-white/50 text-base animate-pulse">Tap anywhere to continue</p>
          </div>
        </div>

      </div>
    </KioskLayout>
  )
})
