import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'
import { GlidoLogo } from '../lib/GlidoLogo'

interface Props {
  title?: string
  plain?: boolean   /* skip white card — renders children directly on page bg */
  children: any
}

export const PublicLayout: FC<Props> = ({ title = 'Glido', plain = false, children }) => {
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
      <body class="min-h-screen font-sans antialiased" style="background:#fff; color:#1C1917;">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <header class="sticky top-0 z-40" style="background:rgba(255,255,255,0.92); backdrop-filter:blur(16px) saturate(180%); -webkit-backdrop-filter:blur(16px) saturate(180%); border-bottom:1px solid rgba(0,0,0,0.07);">
          <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

            {/* Logo */}
            <a href="/" class="flex items-center glido-logo-anchor" style="text-decoration:none;">
              <GlidoLogo height={20} onDark={false} />
            </a>

            <nav class="hidden sm:flex items-center gap-1">
              {[
                { href: '/',         label: 'Home',        icon: ICONS.home      },
                { href: '/book',     label: 'Book a Slot', icon: ICONS.calendar  },
                { href: '/bookings', label: 'My Bookings', icon: ICONS.bookings  },
              ].map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  style="display:inline-flex; align-items:center; gap:5px; padding:7px 12px; border-radius:8px; font-size:13px; font-weight:500; color:#78716C; text-decoration:none; transition:all 0.15s ease;"
                  onmouseover="this.style.color='#1C1917'; this.style.background='rgba(0,0,0,0.05)';"
                  onmouseout="this.style.color='#78716C'; this.style.background='transparent';"
                >
                  <Icon name={l.icon} size={14} style="opacity:0.7;" />
                  {l.label}
                </a>
              ))}
            </nav>

            <a href="/login" style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; font-size:12px; font-weight:600; color:#1C1917; background:#F5F4F3; border:1px solid rgba(0,0,0,0.10); border-radius:9999px; text-decoration:none; transition:all 0.15s ease;"
              onmouseover="this.style.background='#EBEBEA'; this.style.borderColor='rgba(0,0,0,0.18)';"
              onmouseout="this.style.background='#F5F4F3'; this.style.borderColor='rgba(0,0,0,0.10)';"
            >
              <Icon name={ICONS.users} size={13} style="opacity:0.6;" />
              Login
            </a>
          </div>
        </header>

        {/* ── Main content ───────────────────────────────────────────── */}
        {plain
          ? <main style="min-height:calc(100vh - 56px - 64px);">{children}</main>
          : (
            <main style="padding:12px; min-height:calc(100vh - 56px - 64px); box-sizing:border-box;">
              <div style="background:#FFFFFF; border-radius:20px; min-height:calc(100vh - 56px - 64px - 24px); box-shadow:0 1px 4px rgba(0,0,0,0.04), 0 6px 28px rgba(0,0,0,0.07); overflow:hidden;">
                {children}
              </div>
            </main>
          )
        }

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style="border-top:1px solid rgba(0,0,0,0.07); padding:24px; margin-top:0; background:#fff;">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3" style="font-size:12px; color:#A8A29E;">
            <span>© 2026 Glido CFS · Sydney Container Freight Station</span>
            <div style="display:flex; gap:20px;">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a
                  key={l}
                  href="#"
                  style="color:#A8A29E; text-decoration:none; transition:color 0.15s ease;"
                  onmouseover="this.style.color='#57534E';"
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
