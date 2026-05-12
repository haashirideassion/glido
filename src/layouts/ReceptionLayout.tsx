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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts.css" />
        <link rel="stylesheet" href="/public/styles.css" />
        {/* alpine-init.js MUST load synchronously before Alpine so stores are
            registered before Alpine fires its 'alpine:init' event. */}
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body class="min-h-screen bg-background text-foreground font-sans antialiased flex">

        {/* Sidebar */}
        <aside class="w-60 bg-slate-900 text-slate-100 flex flex-col shrink-0 sticky top-0 h-screen">
          <div class="h-16 flex items-center px-5 border-b border-slate-700 gap-2">
            <Icon name={ICONS.logo} size={22} class="text-blue-400" />
            <span class="font-bold text-lg text-white">Glido</span>
            <span class="ml-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">Reception</span>
          </div>
          <nav class="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeNav === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Icon name={item.icon} size={19} />
                  <span class="flex-1">{item.label}</span>
                  {item.badge && (
                    <span class="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                      {item.badge}
                    </span>
                  )}
                </a>
              )
            })}
          </nav>
          <div class="px-4 py-4 border-t border-slate-700">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">RA</div>
              <div>
                <p class="text-sm font-medium text-white">Reception Agent</p>
                <p class="text-xs text-slate-400">Sydney CFS Terminal 1</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div class="flex-1 flex flex-col min-w-0">
          <header class="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
            <h1 class="text-lg font-semibold text-foreground">{title}</h1>
            <div class="flex items-center gap-3 text-sm text-foreground-muted">
              <span id="live-clock" x-data="{}" x-text="new Date().toLocaleTimeString('en-AU', {hour:'2-digit', minute:'2-digit'})"></span>
              <span class="text-border">|</span>
              <a href="/" class="text-primary hover:underline text-sm">Visitor Portal ↗</a>
            </div>
          </header>

          <main class="flex-1 p-6 overflow-y-auto" id="main-content">
            {children}
          </main>
        </div>

        {/* Slide-over backdrop + panel */}
        <div
          id="slide-over-backdrop"
          class="hidden fixed inset-0 bg-black/40 z-40"
          onclick="document.getElementById('slide-over-backdrop').classList.add('hidden'); document.getElementById('slide-over').classList.add('translate-x-full')"
        ></div>
        <div id="slide-over" class="fixed right-0 top-0 h-full w-[480px] bg-card shadow-2xl z-50 translate-x-full transition-transform duration-300 overflow-y-auto flex flex-col">
          <div id="slide-over-content"></div>
        </div>

      </body>
    </html>
  )
}
