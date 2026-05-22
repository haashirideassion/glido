import type { FC } from 'hono/jsx'

interface Props {
  children: any
}

export const KioskLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Sydney CFS — Kiosk</title>
        <link rel="icon" type="image/svg+xml" href="/public/favicon.svg" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts.css" />
        <link rel="stylesheet" href="/public/styles.css" />
        <link rel="stylesheet" href="/public/kiosk.css" />
        {/* alpine-init.js MUST load synchronously before Alpine so stores are
            registered before Alpine fires its 'alpine:init' event. */}
        <script src="/public/alpine-init.js"></script>
        <script src="https://unpkg.com/alpinejs@3.14.3/dist/cdn.min.js" defer></script>
        <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" defer></script>
      </head>
      <body
        class="h-screen w-screen overflow-hidden bg-slate-900 text-white font-sans antialiased"
        x-data="{}"
        x-init="$store.kiosk.init()"
      >
        <div class="h-full w-full relative">
          {children}
        </div>
      </body>
    </html>
  )
}
