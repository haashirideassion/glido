import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { portalRoutes } from './routes/portal'
import { receptionRoutes } from './routes/reception'
import { kioskRoutes } from './routes/kiosk'

const app = new Hono()

// Resolve absolute path to src/public/ regardless of CWD.
// import.meta.dirname may be undefined in some tsx CJS modes, so fall back
// to fileURLToPath(import.meta.url) which is always available.
const __dirname = (import.meta.dirname as string | undefined)
  ?? dirname(fileURLToPath(import.meta.url))
const staticRoot = join(__dirname, 'public')

app.use('/public/*', serveStatic({
  root: staticRoot,
  rewriteRequestPath: (path) => path.replace(/^\/public/, ''),
}))

app.route('/', portalRoutes)
app.route('/reception', receptionRoutes)
app.route('/kiosk', kioskRoutes)

const port = Number(process.env.PORT) || 3000
console.log(`Glido running on http://localhost:${port}`)
console.log(`Static root: ${staticRoot}`)

serve({ fetch: app.fetch, port })

export default app
