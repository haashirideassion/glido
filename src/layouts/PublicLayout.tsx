import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'

interface Props {
  title?: string
  children: any
}

export const PublicLayout: FC<Props> = ({ title = 'Glido', children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — Glido CFS</title>
        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`[x-cloak]{display:none!important}`}</style>
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body class="min-h-screen font-sans antialiased" style="background:#FCFBF8; color:#44403C;">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header
          class="sticky top-0 z-40"
          style="background:#FCFBF8; border-bottom: 1px solid #D6D3D1;"
        >
          <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2">
              <Icon name={ICONS.logo} size={24} style="color:#F59E0B;" />
              <span class="font-semibold text-sm tracking-tight" style="color:#44403C;">Glido</span>
            </a>
            <nav class="hidden sm:flex items-center gap-6 text-xs font-medium" style="color:#A8A29E;">
              {[
                { href: '/',         label: 'Home' },
                { href: '/book',     label: 'Book a Slot' },
                { href: '/bookings', label: 'My Bookings' },
              ].map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  class="transition-colors"
                  onmouseover="this.style.color='#44403C';"
                  onmouseout="this.style.color='#A8A29E';"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <a
              href="/book"
              class="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-md transition-colors"
              style="background:#F59E0B; color:#FFFFFF;"
              onmouseover="this.style.background='#D97706';"
              onmouseout="this.style.background='#F59E0B';"
            >
              <Icon name={ICONS.calendar} size={14} />
              Book a Slot
            </a>
          </div>
        </header>

        <main class="min-h-[calc(100vh-56px-72px)]">
          {children}
        </main>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style="border-top: 1px solid #D6D3D1; margin-top: 64px; padding: 24px;">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style="color:#A8A29E;">
            <span>&copy; 2026 Glido — CFS Depot Management</span>
            <div class="flex gap-5">
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
