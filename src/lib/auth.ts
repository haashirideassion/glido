import { supabase, supabaseAdmin } from './supabase'
import type { Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

const COOKIE_NAME = 'glido_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// ── Sign in with email + password ────────────────────────────────────────────
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// ── Sign up a new visitor account ────────────────────────────────────────────
export async function signUpVisitor(opts: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  company?: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email: opts.email,
    password: opts.password,
    options: {
      data: {
        first_name: opts.firstName,
        last_name:  opts.lastName,
        phone:      opts.phone ?? null,
        company:    opts.company ?? null,
        role:       'visitor_registered',
      },
    },
  })
  if (error) throw error
  return data
}

// ── Read session from cookie, return verified user or null ───────────────────
export async function getSessionUser(c: Context): Promise<{
  id: string
  email: string
  role: string
  firstName: string | null
} | null> {
  const token = getCookie(c, COOKIE_NAME)
  if (!token) return null

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error) {
      console.warn('[getSessionUser] auth.getUser error:', error.message)
      return null
    }
    if (!data.user) return null

    // Pull role from our users table — failure is non-fatal, default role is used
    const { data: userRow, error: rowErr } = await supabaseAdmin
      .from('users')
      .select('role, first_name')
      .eq('id', data.user.id)
      .maybeSingle()

    if (rowErr) console.warn('[getSessionUser] users table error:', rowErr.message)

    return {
      id:        data.user.id,
      email:     data.user.email ?? '',
      role:      userRow?.role ?? 'visitor_registered',
      firstName: userRow?.first_name ?? null,
    }
  } catch (err: any) {
    console.error('[getSessionUser] unexpected error:', err?.message ?? err)
    return null
  }
}

// ── Persist session token in HttpOnly cookie ─────────────────────────────────
export function setSessionCookie(c: Context, accessToken: string) {
  setCookie(c, COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  })
}

// ── Clear session cookie ─────────────────────────────────────────────────────
export function clearSessionCookie(c: Context) {
  deleteCookie(c, COOKIE_NAME, { path: '/' })
}

// ── Role guards ───────────────────────────────────────────────────────────────
export function isReceptionRole(role: string) {
  return role === 'reception_staff' || role === 'reception_admin'
}

export function isVisitorRole(role: string) {
  return role === 'visitor_registered' || role === 'visitor'
}
