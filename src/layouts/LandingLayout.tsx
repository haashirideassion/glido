import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'

interface Props {
  title?: string
  children: any
}

export const LandingLayout: FC<Props> = ({ title = 'Home', children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — Glido</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts.css" />
        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`[x-cloak]{display:none!important}`}</style>
        {/* alpine-init.js MUST load synchronously before Alpine so stores are
            registered before Alpine fires its 'alpine:init' event. */}
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body style="background-color: #f7f6f4; color: #4a433a; font-family: 'Geist', ui-sans-serif, system-ui, sans-serif;">

        {/* ── Fixed nav ──────────────────────────────────────────────────────── */}
        <header
          class="fixed top-0 inset-x-0 z-50 bg-[#f7f6f4]/80 backdrop-blur-lg border-b border-stone-200/60"
          x-data="{scrolled: false}"
          x-init="window.addEventListener('scroll', () => scrolled = window.scrollY > 10)"
          {...{"x-bind:class": "scrolled ? 'border-b border-stone-200' : ''"}}
        >
          <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Left: logo + wordmark */}
            <a href="/" class="flex items-center gap-2 text-[#2c2520]">
              <Icon name={ICONS.logo} size={24} />
              <span class="font-medium text-[#2c2520] tracking-tight">Glido</span>
            </a>

            {/* Center: nav links (hidden on mobile) */}
            <nav class="hidden sm:flex items-center gap-7">
              <a href="#how-it-works" class="text-sm text-stone-500 hover:text-stone-900 transition-colors">How it works</a>
              <a href="/book" class="text-sm text-stone-500 hover:text-stone-900 transition-colors">Book a Slot</a>
              <a href="/bookings" class="text-sm text-stone-500 hover:text-stone-900 transition-colors">My Bookings</a>
            </nav>

            {/* Right: sign in + CTA */}
            <div class="flex items-center gap-3">
              <a href="/bookings" class="text-sm text-stone-600 hover:text-stone-900 transition-colors">Sign in</a>
              <a
                href="/book"
                class="bg-stone-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-stone-700 transition-colors"
              >
                Book a Visit
              </a>
            </div>
          </div>
        </header>

        {/* ── Main content ───────────────────────────────────────────────────── */}
        <main>
          {children}
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer class="border-t border-stone-200 py-6 px-6">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-sm text-stone-400">&copy; 2026 Glido</span>
            <div class="flex gap-5 text-sm text-stone-400">
              <a href="#" class="hover:text-stone-600 transition-colors">Privacy</a>
              <a href="#" class="hover:text-stone-600 transition-colors">Terms</a>
              <a href="#" class="hover:text-stone-600 transition-colors">Contact</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
