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
import { checkInBooking } from '../lib/db/bookings'
import { createCheckinRecord } from '../lib/db/checkin-records'
import { DEFAULT_TENANT_ID } from '../lib/supabase'

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
          class="absolute inset-0 flex flex-col items-center justify-center"
          style="background:#1C1917"
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
            <div
              class="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style="background:rgba(245,158,11,0.15)"
            >
              <Icon name={ICONS.logo} size={56} style="color:#F59E0B; opacity:0.8" />
            </div>
            <p class="text-4xl font-light mb-2" style="color:rgba(255,255,255,0.8)">Sydney CFS</p>
            <p class="text-lg mb-10" style="color:rgba(255,255,255,0.4)">Container Freight Station</p>
            <p class="text-base animate-pulse" style="color:rgba(255,255,255,0.5)">Tap anywhere to continue</p>
          </div>
        </div>

      </div>
    </KioskLayout>
  )
})

kioskRoutes.post('/checkin', async (c) => {
  try {
    const body = await c.req.json<{
      bookingId: string
      tenantId?: string
      licenceName: string
      licenceNumber: string
      nameMatchResult: string
    }>()

    const { bookingId, licenceName, licenceNumber, nameMatchResult } = body
    const tenantId = body.tenantId ?? DEFAULT_TENANT_ID

    // Mark the booking as checked in
    const updatedBooking = await checkInBooking(bookingId)

    // Create a checkin audit record
    await createCheckinRecord({
      bookingId,
      tenantId,
      licenceName,
      licenceNumber,
      nameMatchResult,
    })

    return c.json({
      success: true,
      bookingRef: updatedBooking?.referenceNumber,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ success: false, error: message }, 500)
  }
})
