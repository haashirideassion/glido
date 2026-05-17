import type { FC } from 'hono/jsx'
import { Icon, ICONS } from '../lib/Icon'
import { GlidoLogo } from '../lib/GlidoLogo'

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/public/styles.css" />
        <style>{`* { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }`}</style>
        {/* ECharts — loaded sync so inline chart scripts can reference window.echarts */}
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body style="min-height:100vh; background:#EEEAE4; color:#1C1917; font-family:'Inter',ui-sans-serif,system-ui,sans-serif; display:flex; -webkit-font-smoothing:antialiased;">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside
          class="w-56 flex flex-col shrink-0 sticky top-0 h-screen"
          style="background:#EEEAE4; border-right:1px solid rgba(0,0,0,0.07); color:#1C1917;"
        >
          {/* Logo */}
          <div
            class="h-14 flex items-center px-5 gap-3"
            style="border-bottom:1px solid rgba(0,0,0,0.07);"
          >
            <a href="/" style="text-decoration:none; display:flex; align-items:center;">
              <GlidoLogo height={17} onDark={false} />
            </a>
            <span
              class="text-xs px-1.5 py-0.5 rounded font-semibold"
              style="background:rgba(252,101,20,0.10); color:#FC6514; flex-shrink:0; letter-spacing:0.02em;"
            >
              Ops
            </span>
          </div>

          {/* Nav */}
          <nav class="flex-1 py-3 px-2.5 overflow-y-auto" style="display:flex; flex-direction:column; gap:2px;">
            {navItems.map((item) => {
              const isActive = activeNav === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium"
                  style={isActive
                    ? 'background:#FFFFFF; color:#1C1917; box-shadow:0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05); text-decoration:none;'
                    : 'color:#78716C; text-decoration:none; transition:all 0.15s ease;'}
                  onmouseover={!isActive ? "this.style.background='rgba(0,0,0,0.04)'; this.style.color='#1C1917';" : undefined}
                  onmouseout={!isActive ? "this.style.background='transparent'; this.style.color='#78716C';" : undefined}
                >
                  <Icon name={item.icon} size={16} style={isActive ? 'color:#FC6514;' : 'opacity:0.6;'} />
                  <span class="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      class="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none"
                      style="background:#EF4444; color:#FFFFFF; font-size:10px;"
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              )
            })}
          </nav>

          {/* User footer */}
          <div class="px-3 py-3" style="border-top:1px solid rgba(0,0,0,0.07);">
            <div class="flex items-center gap-2.5 px-2">
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style="background:rgba(252,101,20,0.10); color:#FC6514; border:1px solid rgba(252,101,20,0.20);"
              >
                RA
              </div>
              <div style="min-width:0;">
                <p class="text-xs font-semibold truncate" style="color:#1C1917;">Reception Agent</p>
                <p class="text-xs truncate" style="color:#A8A29E;">Sydney CFS · T1</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main area ─────────────────────────────────────────────────── */}
        <div class="flex-1 flex flex-col min-w-0" style="background:#EEEAE4;">
          {/* Top header */}
          <header
            class="h-14 flex items-center justify-between px-5 shrink-0"
            style="background:#EEEAE4; border-bottom:1px solid rgba(0,0,0,0.07);"
          >
            <h1 class="text-sm font-semibold" style="color:#1C1917; letter-spacing:-0.01em;">{title}</h1>
            <div class="flex items-center gap-3 text-xs" style="color:#78716C;">
              <span id="live-clock" x-data="{}" x-text="new Date().toLocaleTimeString('en-AU', {hour:'2-digit', minute:'2-digit'})"></span>
              <span style="color:rgba(0,0,0,0.15);">|</span>
              <a href="/" class="transition-colors text-xs font-medium" style="color:#FC6514; text-decoration:none;">Visitor Portal ↗</a>
            </div>
          </header>

          {/* White content card */}
          <main
            class="flex-1 overflow-y-auto"
            id="main-content"
            style="padding:12px;"
          >
            <div style="background:#FFFFFF; border-radius:20px; min-height:100%; box-shadow:0 1px 4px rgba(0,0,0,0.04), 0 6px 28px rgba(0,0,0,0.07); overflow:hidden; padding:24px;">
              {children}
            </div>
          </main>
        </div>

        {/* ── Slide-over ────────────────────────────────────────────────── */}
        <div
          id="slide-over-backdrop"
          class="hidden fixed inset-0 z-40"
          style="background:rgba(28,25,23,0.35); backdrop-filter:blur(4px);"
          onclick="document.getElementById('slide-over-backdrop').classList.add('hidden'); document.getElementById('slide-over').classList.add('translate-x-full')"
        ></div>
        <div
          id="slide-over"
          class="fixed right-0 top-0 h-full w-[480px] z-50 translate-x-full transition-transform duration-300 overflow-y-auto flex flex-col"
          style="background:#FFFFFF; border-left:1px solid rgba(0,0,0,0.08); box-shadow:-8px 0 40px rgba(0,0,0,0.12);"
        >
          <div id="slide-over-content"></div>
        </div>

      </body>
    </html>
  )
}
