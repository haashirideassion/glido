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
      <body class="min-h-screen bg-background text-foreground font-sans antialiased">
        <header class="bg-card border-b border-border sticky top-0 z-40">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2">
              <Icon name={ICONS.logo} size={28} class="text-primary" />
              <span class="font-bold text-xl text-foreground tracking-tight">Glido</span>
            </a>
            <nav class="hidden sm:flex items-center gap-6 text-sm font-medium text-foreground-muted">
              <a href="/" class="hover:text-foreground transition-colors">Home</a>
              <a href="/book" class="hover:text-foreground transition-colors">Book a Slot</a>
              <a href="/bookings" class="hover:text-foreground transition-colors">My Bookings</a>
            </nav>
            <a
              href="/book"
              class="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Icon name={ICONS.calendar} size={15} />
              Book a Slot
            </a>
          </div>
        </header>

        <main class="min-h-[calc(100vh-4rem-80px)]">
          {children}
        </main>

        <footer class="bg-card border-t border-border mt-16">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-foreground-muted">
            <span>&copy; 2026 Glido — CFS Depot Management</span>
            <div class="flex gap-5">
              <a href="#" class="hover:text-foreground">Privacy</a>
              <a href="#" class="hover:text-foreground">Terms</a>
              <a href="#" class="hover:text-foreground">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
