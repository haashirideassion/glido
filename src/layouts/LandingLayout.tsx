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
        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`[x-cloak]{display:none!important}`}</style>
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body style="background:#FCFBF8; color:#44403C;">

        {/* ── Fixed nav ─────────────────────────────────────────────────── */}
        <header
          class="fixed top-0 inset-x-0 z-50 transition-all"
          style="background: rgba(252,251,248,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid #E7E5E4;"
          x-data="{scrolled: false}"
          x-init="window.addEventListener('scroll', () => scrolled = window.scrollY > 10)"
          {...{"x-bind:style": "scrolled ? 'box-shadow: rgba(140,130,120,0.1) 0px 4px 24px -8px;' : ''"}}
        >
          <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <a href="/" class="flex items-center gap-2">
              <Icon name={ICONS.logo} size={22} style="color:#F59E0B;" />
              <span class="font-semibold text-sm tracking-tight" style="color:#44403C;">Glido</span>
            </a>

            {/* Center nav */}
            <nav class="hidden sm:flex items-center gap-7">
              {[
                { href: '#how-it-works', label: 'How it works' },
                { href: '/book',         label: 'Book a Slot' },
                { href: '/bookings',     label: 'My Bookings' },
              ].map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  class="text-xs font-medium transition-colors"
                  style="color:#A8A29E;"
                  onmouseover="this.style.color='#44403C';"
                  onmouseout="this.style.color='#A8A29E';"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Right CTAs */}
            <div class="flex items-center gap-3">
              <a
                href="/bookings"
                class="text-xs font-medium transition-colors"
                style="color:#78716C;"
                onmouseover="this.style.color='#44403C';"
                onmouseout="this.style.color='#78716C';"
              >
                Sign in
              </a>
              <a
                href="/book"
                class="text-xs font-medium px-4 py-2 rounded-full transition-colors"
                style="background:#F59E0B; color:#FFFFFF;"
                onmouseover="this.style.background='#D97706';"
                onmouseout="this.style.background='#F59E0B';"
              >
                Book a Visit
              </a>
            </div>
          </div>
        </header>

        {/* ── Main ──────────────────────────────────────────────────────── */}
        <main>
          {children}
        </main>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style="border-top: 1px solid #E7E5E4; padding: 24px 24px;">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span class="text-xs" style="color:#A8A29E;">&copy; 2026 Glido</span>
            <div class="flex gap-5 text-xs" style="color:#A8A29E;">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a
                  key={l}
                  href="#"
                  class="transition-colors"
                  onmouseover="this.style.color='#44403C';"
                  onmouseout="this.style.color='#A8A29E';"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
