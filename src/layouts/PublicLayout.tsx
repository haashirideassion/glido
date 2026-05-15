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

        {/* Inter font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`
          [x-cloak]{display:none!important}
          * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        `}</style>
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body class="min-h-screen font-sans antialiased" style="background:#FFEDD5; color:#1C1917;">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header class="sticky top-0 z-40" style="background:rgba(255,237,213,0.80); backdrop-filter:blur(16px) saturate(1.5); -webkit-backdrop-filter:blur(16px) saturate(1.5); border-bottom:1px solid rgba(249,115,22,0.10);">
          <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

            {/* Logo */}
            <a href="/" class="flex items-center gap-2.5" style="text-decoration:none;">
              <div style="width:30px; height:30px; border-radius:9px; background:linear-gradient(135deg,#F97316,#FB923C); display:flex; align-items:center; justify-content:center; box-shadow:rgba(249,115,22,0.25) 0px 3px 8px 0px;">
                <Icon name={ICONS.logo} size={15} style="color:white;" />
              </div>
              <span style="font-weight:600; font-size:14px; letter-spacing:-0.02em; color:#1C1917;">Glido</span>
            </a>

            <nav class="hidden sm:flex items-center gap-7">
              {[
                { href: '/',         label: 'Home' },
                { href: '/book',     label: 'Book a Slot' },
                { href: '/bookings', label: 'My Bookings' },
              ].map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  style="font-size:13px; font-weight:500; color:#78716C; text-decoration:none; transition:color 0.15s ease;"
                  onmouseover="this.style.color='#1C1917';"
                  onmouseout="this.style.color='#78716C';"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <a href="/book" class="btn-primary" style="padding:9px 18px; font-size:12px;">
              <Icon name={ICONS.calendar} size={13} />
              Book a Slot
            </a>
          </div>
        </header>

        <main class="min-h-[calc(100vh-56px-64px)]">
          {children}
        </main>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style="border-top:1px solid rgba(249,115,22,0.10); padding:24px; margin-top:0;">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3" style="font-size:12px; color:#A8A29E;">
            <span>© 2026 Glido CFS · Sydney Container Freight Station</span>
            <div style="display:flex; gap:20px;">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a
                  key={l}
                  href="#"
                  style="color:#A8A29E; text-decoration:none; transition:color 0.15s ease;"
                  onmouseover="this.style.color='#1C1917';"
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
