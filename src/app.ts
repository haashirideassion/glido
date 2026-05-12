import { Hono } from 'hono'
import { portalRoutes } from './routes/portal'
import { receptionRoutes } from './routes/reception'
import { kioskRoutes } from './routes/kiosk'

const app = new Hono()

app.route('/', portalRoutes)
app.route('/reception', receptionRoutes)
app.route('/kiosk', kioskRoutes)

// ── Local development only ──────────────────────────────────────────────────
// On Vercel, process.env.VERCEL is set to "1". When running locally with
// `npm run dev`, it is absent. We only start the TCP server + static-file
// middleware in dev mode so that the exported `app` (used by Vercel's Hono
// framework handler via app.fetch) is clean and stateless.
if (!process.env.VERCEL) {
  // Dynamic import keeps @hono/node-server out of the module graph on Vercel.
  ;(async () => {
    const { serveStatic } = await import('@hono/node-server/serve-static')
    const { serve }       = await import('@hono/node-server')
    const { join, dirname } = await import('node:path')
    const { fileURLToPath }  = await import('node:url')

    const __dirname = (import.meta.dirname as string | undefined)
      ?? dirname(fileURLToPath(import.meta.url))
    const staticRoot = join(__dirname, 'public')

    app.use('/public/*', serveStatic({
      root: staticRoot,
      rewriteRequestPath: (p) => p.replace(/^\/public/, ''),
    }))

    const port = Number(process.env.PORT) || 3000
    console.log(`Glido running on http://localhost:${port}`)
    serve({ fetch: app.fetch, port })
  })()
}

// Vercel's Hono framework handler calls `app.fetch(request)` on this export.
export default app
