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

// Take first value only — Vercel's multi-proxy infra sends comma-joined lists,
// e.g. x-forwarded-proto: "https, https" → must pick "https" not "https, https"
function firstHeader(val: string | string[] | undefined, fallback: string): string {
  const raw = Array.isArray(val) ? val[0] : val
  return (raw ?? fallback).split(',')[0].trim()
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const proto = firstHeader(req.headers['x-forwarded-proto'], 'https')
  const host  = firstHeader(req.headers['x-forwarded-host'] ?? req.headers.host, 'localhost')

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

  try {
    // Run through Hono and convert the Web API Response back to Node.js
    const webRes = await app.fetch(webReq)
    res.statusCode = webRes.status
    webRes.headers.forEach((v, k) => res.setHeader(k, v))
    res.end(Buffer.from(await webRes.arrayBuffer()))
  } catch (err: any) {
    console.error('[glido] handler crash:', err?.stack ?? err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('content-type', 'text/plain')
      res.end(`Internal error: ${err?.message ?? String(err)}`)
    }
  }
}
