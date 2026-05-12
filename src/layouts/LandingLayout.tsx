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
      <body>

        {/* ── Fixed nav ──────────────────────────────────────────────────────── */}
        <header
          class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 transition-colors"
          x-data="{scrolled: false}"
          x-init="window.addEventListener('scroll', () => scrolled = window.scrollY > 10)"
          {...{"x-bind:class": "scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'"}}
        >
          <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Left: logo + wordmark */}
            <a href="/" class="flex items-center gap-2 text-slate-900">
              <Icon name={ICONS.logo} size={24} />
              <span class="font-semibold text-slate-900 tracking-tight">Glido</span>
            </a>

            {/* Center: nav links (hidden on mobile) */}
            <nav class="hidden sm:flex items-center gap-7">
              <a href="#how-it-works" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">How it works</a>
              <a href="/book" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">Book a Slot</a>
              <a href="/bookings" class="text-sm text-slate-500 hover:text-slate-900 transition-colors">My Bookings</a>
            </nav>

            {/* Right: sign in + CTA */}
            <div class="flex items-center gap-3">
              <a href="/bookings" class="text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
              <a
                href="/book"
                class="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full hover:bg-primary-hover transition-colors"
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
        <footer class="border-t border-slate-200 py-6 px-6">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-sm text-slate-400">&copy; 2026 Glido</span>
            <div class="flex gap-5 text-sm text-slate-400">
              <a href="#" class="hover:text-slate-600 transition-colors">Privacy</a>
              <a href="#" class="hover:text-slate-600 transition-colors">Terms</a>
              <a href="#" class="hover:text-slate-600 transition-colors">Contact</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
