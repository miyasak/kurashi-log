import type { Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { Bindings } from './config'

export const SESSION_COOKIE = 'kl_session'

function b64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return b64url(sig)
}

function getSecret(env: Bindings): string {
  const s = env.SESSION_SECRET || env.ADMIN_PASSWORD
  if (!s) throw new Error('SESSION_SECRET が未設定です')
  // パスワードも混ぜる：変更すると既存セッションが無効になる
  return `${s}::${env.ADMIN_PASSWORD || ''}::kl`
}

export function getPassword(env: Bindings): string | null {
  return env.ADMIN_PASSWORD || null
}

export async function createToken(env: Bindings): Promise<string> {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7 // 7日
  const payload = `admin.${exp}`
  const sig = await hmac(getSecret(env), payload)
  return `${payload}.${sig}`
}

export async function verifyToken(env: Bindings, token?: string): Promise<boolean> {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [sub, expStr, sig] = parts
  if (sub !== 'admin') return false
  const exp = Number(expStr)
  if (!exp || Date.now() > exp) return false
  const expected = await hmac(getSecret(env), `${sub}.${expStr}`)
  return expected === sig
}

export async function isAuthed(c: Context<{ Bindings: Bindings }>): Promise<boolean> {
  return verifyToken(c.env, getCookie(c, SESSION_COOKIE))
}

export function setSessionCookie(c: Context, token: string) {
  setCookie(c, SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: new URL(c.req.url).protocol === 'https:',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearSessionCookie(c: Context) {
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
}
