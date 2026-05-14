import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'

interface Props {
  title?: string
  activeNav?: string
  children: any
}

const navItems = [
  { href: '/reception',           label: 'Dashboard',  icon: ICONS.home,     badge: null },
  { href: '/reception/bookings',  label: 'Bookings',   icon: ICONS.bookings, badge: null },
  { href: '/reception/walk-ins',  label: 'Walk-Ins',   icon: ICONS.walkIn,   badge: '3' },
  { href: '/reception/reports',   label: 'Reports',    icon: ICONS.reports,  badge: null },
  { href: '/reception/settings',  label: 'Settings',   icon: ICONS.settings, badge: null },
]

export const ReceptionLayout: FC<Props> = ({ title = 'Reception', activeNav = '/reception', children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — Glido Reception</title>
        <link rel="stylesheet" href="/public/styles.css" />
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body class="min-h-screen bg-background text-foreground font-sans antialiased flex">

        {/* ── Sidebar — warm stone dark ──────────────────────────────────── */}
        <aside
          class="w-60 flex flex-col shrink-0 sticky top-0 h-screen"
          style="background:#1C1917; color:#E7E5E4;"
        >
          {/* Logo */}
          <div
            class="h-16 flex items-center px-5 gap-2"
            style="border-bottom: 1px solid #292524;"
          >
            <Icon name={ICONS.logo} size={22} style="color:#F59E0B;" />
            <span class="font-semibold text-base tracking-tight" style="color:#FCFBF8;">Glido</span>
            <span
              class="ml-1 text-xs px-1.5 py-0.5 rounded font-medium"
              style="background:#F59E0B; color:#1C1917;"
            >
              Reception
            </span>
          </div>

          {/* Nav */}
          <nav class="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeNav === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  class="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors"
                  style={isActive
                    ? 'background:#F59E0B; color:#1C1917;'
                    : 'color:#A8A29E;'}
                  onmouseover={!isActive ? "this.style.background='#292524'; this.style.color='#FCFBF8';" : undefined}
                  onmouseout={!isActive ? "this.style.background='transparent'; this.style.color='#A8A29E';" : undefined}
                >
                  <Icon name={item.icon} size={18} />
                  <span class="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      class="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none"
                      style="background:#DC2626; color:#FFFFFF;"
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              )
            })}
          </nav>

          {/* User footer */}
          <div class="px-4 py-4" style="border-top: 1px solid #292524;">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style="background:#F59E0B; color:#1C1917;"
              >
                RA
              </div>
              <div>
                <p class="text-xs font-medium" style="color:#FCFBF8;">Reception Agent</p>
                <p class="text-xs" style="color:#78716C;">Sydney CFS Terminal 1</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main area ─────────────────────────────────────────────────── */}
        <div class="flex-1 flex flex-col min-w-0">
          {/* Top header */}
          <header
            class="h-16 flex items-center justify-between px-6 shrink-0"
            style="background:#FCFBF8; border-bottom: 1px solid #D6D3D1;"
          >
            <h1 class="text-sm font-semibold" style="color:#44403C;">{title}</h1>
            <div class="flex items-center gap-3 text-xs" style="color:#A8A29E;">
              <span id="live-clock" x-data="{}" x-text="new Date().toLocaleTimeString('en-AU', {hour:'2-digit', minute:'2-digit'})"></span>
              <span style="color:#D6D3D1;">|</span>
              <a href="/" class="transition-colors text-xs" style="color:#F59E0B;">Visitor Portal ↗</a>
            </div>
          </header>

          <main class="flex-1 p-6 overflow-y-auto" id="main-content">
            {children}
          </main>
        </div>

        {/* ── Slide-over ────────────────────────────────────────────────── */}
        <div
          id="slide-over-backdrop"
          class="hidden fixed inset-0 z-40"
          style="background: rgb(28 25 23 / 0.5);"
          onclick="document.getElementById('slide-over-backdrop').classList.add('hidden'); document.getElementById('slide-over').classList.add('translate-x-full')"
        ></div>
        <div
          id="slide-over"
          class="fixed right-0 top-0 h-full w-[480px] shadow-2xl z-50 translate-x-full transition-transform duration-300 overflow-y-auto flex flex-col"
          style="background:#FCFBF8; border-left: 1px solid #D6D3D1;"
        >
          <div id="slide-over-content"></div>
        </div>

      </body>
    </html>
  )
}
