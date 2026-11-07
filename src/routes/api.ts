import { Hono } from 'hono'
import type { Bindings } from '../lib/config'
import { MAP_CAT_SQL } from '../lib/config'
import {
  listPosts,
  countPosts,
  getPostById,
  upsertPost,
  deletePost,
  listTags,
  listMonthlyStats,
  upsertMonthlyStat,
  deleteMonthlyStat,
  getCategoryCounts
} from '../lib/db'
import { isAuthed, getPassword, createToken, setSessionCookie, clearSessionCookie } from '../lib/auth'

export const api = new Hono<{ Bindings: Bindings }>()
/* ログイン試行の制限（1つのWorkerインスタンス内でのみ有効な簡易版） */
const loginTries = new Map<string, { n: number; until: number }>()
function tooManyTries(ip: string): boolean {
  const now = Date.now()
  const rec = loginTries.get(ip)
  if (!rec || now > rec.until) {
    loginTries.set(ip, { n: 1, until: now + 10 * 60 * 1000 })
    return false
  }
  rec.n++
  return rec.n > 10
}

/* ========== 公開API ========== */
api.get('/posts', async (c) => {
  const { category, tag, q, limit, offset } = c.req.query()
  const posts = await listPosts(c.env.DB, {
    category,
    tag,
    q,
    limit: limit ? Number(limit) : 20,
    offset: offset ? Number(offset) : 0
  })
  return c.json({ posts })
})

api.get('/tags', async (c) => {
  const tags = await listTags(c.env.DB, c.req.query('category'))
  return c.json({ tags })
})

api.get('/stats/monthly', async (c) => {
  const stats = await listMonthlyStats(c.env.DB)
  return c.json({ stats })
})

api.get('/map/points', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT slug, title, category, place_name, prefecture, lat, lng, rating, cospa, budget, distance_km, cover_image
     FROM posts WHERE status='published' AND lat IS NOT NULL AND lng IS NOT NULL AND category IN (${MAP_CAT_SQL})     
     ORDER BY COALESCE(published_at, created_at) DESC`
  ).all()
  return c.json({ points: rows.results })
})

/* ========== 認証 ========== */
api.post('/admin/login', async (c) => {
  const body = await c.req.json<{ password?: string }>().catch(() => ({}) as any)
  const ip = c.req.header('cf-connecting-ip') || 'local'
  if (tooManyTries(ip)) {
    return c.json({ ok: false, error: '試行回数が多すぎます。しばらく待ってください' }, 429)
  }
  const pw = getPassword(c.env)
  if (!pw) return c.json({ ok: false, error: '管理画面が未設定です' }, 503)  
  if (!body.password || body.password !== pw) { 
    return c.json({ ok: false, error: 'パスワードが違います' }, 401)
  }
  const token = await createToken(c.env)
  setSessionCookie(c, token)
  return c.json({ ok: true })
})

api.post('/admin/logout', (c) => {
  clearSessionCookie(c)
  return c.json({ ok: true })
})

api.get('/admin/me', async (c) => c.json({ authed: await isAuthed(c) }))

/* ========== 管理API（要認証） ========== */
api.use('/admin/*', async (c, next) => {
  const p = c.req.path
  if (p.endsWith('/login') || p.endsWith('/logout') || p.endsWith('/me')) return next()
  if (!(await isAuthed(c))) return c.json({ ok: false, error: 'unauthorized' }, 401)
  await next()
})

api.get('/admin/posts', async (c) => {
  const { category, q, status, limit, offset } = c.req.query()
  let posts = await listPosts(c.env.DB, {
    category,
    q,
    includeDrafts: true,
    limit: limit ? Number(limit) : 100,
    offset: offset ? Number(offset) : 0
  })
  if (status) posts = posts.filter((p) => p.status === status)
  const total = await countPosts(c.env.DB, { includeDrafts: true })
  return c.json({ posts, total })
})

api.get('/admin/posts/:id', async (c) => {
  const post = await getPostById(c.env.DB, Number(c.req.param('id')))
  if (!post) return c.json({ ok: false, error: 'not found' }, 404)
  return c.json({ post })
})

api.post('/admin/posts', async (c) => {
  const data = await c.req.json<any>()
  try {
    const id = await upsertPost(c.env.DB, data)
    return c.json({ ok: true, id })
  } catch (e: any) {
    return c.json({ ok: false, error: String(e?.message || e) }, 400)
  }
})

api.put('/admin/posts/:id', async (c) => {
  const data = await c.req.json<any>()
  try {
    const id = await upsertPost(c.env.DB, data, Number(c.req.param('id')))
    return c.json({ ok: true, id })
  } catch (e: any) {
    return c.json({ ok: false, error: String(e?.message || e) }, 400)
  }
})

api.delete('/admin/posts/:id', async (c) => {
  await deletePost(c.env.DB, Number(c.req.param('id')))
  return c.json({ ok: true })
})

api.get('/admin/stats', async (c) => {
  const stats = await listMonthlyStats(c.env.DB, 120)
  return c.json({ stats })
})

api.post('/admin/stats', async (c) => {
  const data = await c.req.json<any>()
  if (!data.ym) return c.json({ ok: false, error: 'ym は必須です' }, 400)
  await upsertMonthlyStat(c.env.DB, data)
  return c.json({ ok: true })
})

api.delete('/admin/stats/:ym', async (c) => {
  await deleteMonthlyStat(c.env.DB, c.req.param('ym'))
  return c.json({ ok: true })
})

api.get('/admin/summary', async (c) => {
  const counts = await getCategoryCounts(c.env.DB)
  const draft = await c.env.DB.prepare("SELECT COUNT(*) AS c FROM posts WHERE status='draft'").first<{ c: number }>()
  const published = await c.env.DB.prepare("SELECT COUNT(*) AS c FROM posts WHERE status='published'").first<{ c: number }>()
  const tags = await c.env.DB.prepare('SELECT COUNT(*) AS c FROM tags').first<{ c: number }>()
  const months = await c.env.DB.prepare('SELECT COUNT(*) AS c FROM monthly_stats').first<{ c: number }>()
  return c.json({
    counts,
    draft: draft?.c ?? 0,
    published: published?.c ?? 0,
    tags: tags?.c ?? 0,
    months: months?.c ?? 0
  })
})

/** 画像アップロード（R2バインドがある場合のみ） */
api.post('/admin/upload', async (c) => {
  if (!c.env.R2) {
    return c.json(
      { ok: false, error: 'R2バケットが未設定です。画像URLを直接入力して登録してください。' },
      400
    )
  }
  const form = await c.req.formData()
  const file = form.get('file') as File | null
  if (!file) return c.json({ ok: false, error: 'ファイルがありません' }, 400)
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await c.env.R2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'image/jpeg' }
  })
  return c.json({ ok: true, url: `/media/${key}` })
})

/** 画像一覧（メディア管理画面用） */
api.get('/admin/media', async (c) => {
  if (!c.env.R2) return c.json({ ok: false, error: 'R2バケットが未設定です。', items: [] }, 400)
  const list = await c.env.R2.list({ prefix: 'uploads/', limit: 1000 })
  const items = list.objects
    .map((o) => ({
      key: o.key,
      path: `/media/${o.key}`,
      size: o.size,
      uploaded: o.uploaded
    }))
    .sort((a, b) => String(b.uploaded).localeCompare(String(a.uploaded)))
  return c.json({ ok: true, count: items.length, items })
})

/** 画像削除 */
api.delete('/admin/media', async (c) => {
  if (!c.env.R2) return c.json({ ok: false, error: 'R2バケットが未設定です。' }, 400)
  const key = c.req.query('key')
  if (!key || !key.startsWith('uploads/')) return c.json({ ok: false, error: 'キーが不正です' }, 400)
  await c.env.R2.delete(key)
  return c.json({ ok: true })
})