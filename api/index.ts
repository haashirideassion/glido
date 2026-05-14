import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { portalRoutes } from '../src/routes/portal'
import { receptionRoutes } from '../src/routes/reception'
import { kioskRoutes } from '../src/routes/kiosk'

export const config = { runtime: 'nodejs' }

const app = new Hono()
app.route('/', portalRoutes)
app.route('/reception', receptionRoutes)
app.route('/kiosk', kioskRoutes)

export default handle(app)
