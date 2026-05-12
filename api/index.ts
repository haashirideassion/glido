/**
 * Vercel serverless entry point.
 * Builds a fresh Hono app (no Node.js `serve()`) and bridges
 * Node.js IncomingMessage/ServerResponse to the Web Fetch API.
 *
 * Static files (CSS, JS) are served directly by Vercel CDN from
 * the `public/` directory — this function only handles dynamic routes.
 */
import { Hono } from 'hono'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { portalRoutes } from '../src/routes/portal'
import { receptionRoutes } from '../src/routes/reception'
import { kioskRoutes } from '../src/routes/kiosk'

const app = new Hono()

app.route('/', portalRoutes)
app.route('/reception', receptionRoutes)
app.route('/kiosk', kioskRoutes)

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Reconstruct a full URL from Vercel's forwarded headers
  const proto = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'https'
  const host  = (req.headers['x-forwarded-host'] as string | undefined) ?? req.headers.host ?? 'localhost'

  // Buffer the request body (needed for POST/PUT)
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const body = chunks.length ? Buffer.concat(chunks) : null

  // Build a Web API Request
  const webReq = new Request(`${proto}://${host}${req.url}`, {
    method: req.method ?? 'GET',
    headers: Object.fromEntries(
      Object.entries(req.headers)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : (v as string)])
    ),
    body: (body?.length && req.method !== 'GET' && req.method !== 'HEAD') ? body : undefined,
  })

  // Run through Hono and convert the Web API Response back to Node.js
  const webRes = await app.fetch(webReq)
  res.statusCode = webRes.status
  webRes.headers.forEach((v, k) => res.setHeader(k, v))
  res.end(Buffer.from(await webRes.arrayBuffer()))
}
