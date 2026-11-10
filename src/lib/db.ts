import { slugify } from './utils'

export type Post = {
  id: number
  slug: string
  category: string
  title: string
  summary: string | null
  body: string
  cover_image: string | null
  status: string
  featured: number
  published_at: string | null
  place_name: string | null
  prefecture: string | null
  address: string | null
  lat: number | null
  lng: number | null
  distance_km: number | null
  duration_text: string | null
  weather: string | null
  bike: string | null
  route_text: string | null
  rating: number | null
  cospa: number | null
  budget: number | null
  visit_date: string | null
  business_hours: string | null
  highlight_label: string | null
  highlight_value: string | null
  highlight_sub: string | null
  genre: string | null
  area: string | null
  best_season: string | null
  road_note: string | null
  recommend_items: string | null
  access_text: string | null
  linked_slug: string | null
  series: string | null
  series_day: number | null
  meta: string | null
  views: number
  created_at: string
  updated_at: string
  tags?: string[]
  photos?: { url: string; caption: string | null }[]
  spots?: { id: number; name: string; lat: number; lng: number; note: string | null; sort_order: number }[]
}

const POST_FIELDS = [
  'slug','category','title','summary','body','cover_image','status','featured','published_at',
  'place_name','prefecture','address','lat','lng',
  'distance_km','duration_text','weather','bike','route_text',
  'rating','cospa','budget','visit_date','business_hours',
  'highlight_label','highlight_value','highlight_sub',
  'genre','area','best_season','road_note','recommend_items','access_text','linked_slug','series','series_day',
  'meta'
]

/** LIKE のワイルドカード（% _ \）を打ち消す */
function likeEscape(s: string) {
  return s.replace(/[\\%_]/g, (m) => '\\' + m)
}

type ListOptions = {
  category?: string
  /** 複数カテゴリ（テーマ単位の絞り込み用） */
  categories?: string[]
  tag?: string
  q?: string
  limit?: number
  /** limit の上限を広げたいときだけ指定（sitemap用）。既定は100 */
  maxLimit?: number
  offset?: number
  includeDrafts?: boolean
  featuredOnly?: boolean
  withGeo?: boolean
}

export async function listPosts(db: D1Database, opts: ListOptions = {}) {
  const where: string[] = []
  const binds: any[] = []
  if (!opts.includeDrafts) where.push("p.status = 'published'")
  if (opts.category) {
    where.push('p.category = ?')
    binds.push(opts.category)
  } else if (opts.categories && opts.categories.length) {
    where.push(`p.category IN (${opts.categories.map(() => '?').join(',')})`)
    binds.push(...opts.categories)
  }
  if (opts.featuredOnly) where.push('p.featured = 1')
  if (opts.withGeo) where.push('p.lat IS NOT NULL AND p.lng IS NOT NULL')
  if (opts.q) {
    where.push(
      "(p.title LIKE ? ESCAPE '\\' OR p.summary LIKE ? ESCAPE '\\' OR p.body LIKE ? ESCAPE '\\' OR p.place_name LIKE ? ESCAPE '\\')"
    )
    const like = `%${likeEscape(opts.q.trim().slice(0, 50))}%`
    binds.push(like, like, like, like)
  }
  if (opts.tag) {
    where.push(
      'p.id IN (SELECT pt.post_id FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE t.slug = ? OR t.name = ?)'
    )
    binds.push(opts.tag, opts.tag)
  }
  const limit = Math.min(opts.limit ?? 20, opts.maxLimit ?? 100)
  const offset = opts.offset ?? 0
  const sql = `
    SELECT p.*, (
      SELECT group_concat(t.name, ',') FROM post_tags pt
      JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = p.id
    ) AS tag_names
    FROM posts p
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY COALESCE(p.published_at, p.created_at) DESC, p.id DESC
    LIMIT ? OFFSET ?`
  const rows = await db.prepare(sql).bind(...binds, limit, offset).all()
  return (rows.results as any[]).map(normalize)
}

export async function countPosts(db: D1Database, opts: ListOptions = {}) {
  const where: string[] = []
  const binds: any[] = []
  if (!opts.includeDrafts) where.push("status = 'published'")
  if (opts.category) {
    where.push('category = ?')
    binds.push(opts.category)
  } else if (opts.categories && opts.categories.length) {
    where.push(`category IN (${opts.categories.map(() => '?').join(',')})`)
    binds.push(...opts.categories)
  }
  if (opts.q) {
    where.push(
      "(title LIKE ? ESCAPE '\\' OR summary LIKE ? ESCAPE '\\' OR body LIKE ? ESCAPE '\\' OR place_name LIKE ? ESCAPE '\\')"
    )
    const like = `%${likeEscape(opts.q.trim().slice(0, 50))}%`
    binds.push(like, like, like, like)
  }
  if (opts.tag) {
    where.push(
      'id IN (SELECT pt.post_id FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE t.slug = ? OR t.name = ?)'
    )
    binds.push(opts.tag, opts.tag)
  }
  const r = await db
    .prepare(`SELECT COUNT(*) AS c FROM posts ${where.length ? 'WHERE ' + where.join(' AND ') : ''}`)
    .bind(...binds)
    .first<{ c: number }>()
  return r?.c ?? 0
}

/**
 * 相互リンク記事を取得。
 * A（この記事）が linked_slug で指している記事、または
 * 逆方向（相手の linked_slug がこの記事を指している）も拾う。
 */
export async function getLinkedPost(db: D1Database, post: Post) {
  const row = await db
    .prepare(
      `SELECT p.*, (
         SELECT group_concat(t.name, ',') FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = p.id
       ) AS tag_names
       FROM posts p
       WHERE p.status = 'published' AND p.id <> ?
         AND (p.slug = ? OR (p.linked_slug IS NOT NULL AND p.linked_slug = ?))
       LIMIT 1`
    )
    .bind(post.id, post.linked_slug || '', post.slug)
    .first<any>()
  if (!row) return null
  return normalize(row)
}

/**
 * 同じシリーズの前後の記事を取得。
 * series_day の番号順で「隣」を探すので、欠番があっても繋がる。
 */
export async function getSeriesNeighbors(db: D1Database, post: Post) {
  const empty = { prev: null as any, next: null as any, total: 0, index: 0 }
  if (!post.series || post.series_day == null) return empty

  const { results } = await db
    .prepare(
      `SELECT slug, title, series_day, visit_date
         FROM posts
        WHERE status = 'published' AND series = ? AND series_day IS NOT NULL
        ORDER BY series_day`
    )
    .bind(post.series)
    .all<{ slug: string; title: string; series_day: number; visit_date: string | null }>()

  const list = results || []
  const i = list.findIndex((r) => r.slug === post.slug)
  if (i < 0) return empty

  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
    total: list.length,
    index: i + 1,
  }
}

export async function getPostBySlug(db: D1Database, slug: string, includeDrafts = false) {
  const row = await db
    .prepare(
      `SELECT p.*, (
         SELECT group_concat(t.name, ',') FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = p.id
       ) AS tag_names
       FROM posts p WHERE p.slug = ? ${includeDrafts ? '' : "AND p.status = 'published'"}`
    )
    .bind(slug)
    .first<any>()
  if (!row) return null
  const post = normalize(row)
  const photos = await db
    .prepare('SELECT url, caption FROM post_photos WHERE post_id = ? ORDER BY sort_order, id')
    .bind(post.id)
    .all()
  post.photos = photos.results as any[]
  const spots = await db
    .prepare('SELECT id, name, lat, lng, note, sort_order FROM post_spots WHERE post_id = ? ORDER BY sort_order, id')
    .bind(post.id)
    .all()
  post.spots = spots.results as any[]  
  return post
}

export async function getPostById(db: D1Database, id: number) {
  const row = await db
    .prepare(
      `SELECT p.*, (
         SELECT group_concat(t.name, ',') FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = p.id
       ) AS tag_names FROM posts p WHERE p.id = ?`
    )
    .bind(id)
    .first<any>()
  if (!row) return null
  const post = normalize(row)
  const photos = await db
    .prepare('SELECT url, caption FROM post_photos WHERE post_id = ? ORDER BY sort_order, id')
    .bind(id)
    .all()
  post.photos = photos.results as any[]
  const spots = await db
    .prepare('SELECT id, name, lat, lng, note, sort_order FROM post_spots WHERE post_id = ? ORDER BY sort_order, id')
    .bind(id)
    .all()
  post.spots = spots.results as any[]
  return post
}

function normalize(row: any): Post {
  const tags = row.tag_names ? String(row.tag_names).split(',').filter(Boolean) : []
  delete row.tag_names
  return { ...row, tags } as Post
}

export async function upsertPost(db: D1Database, data: any, id?: number) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const payload: Record<string, any> = {}
  for (const f of POST_FIELDS) payload[f] = data[f] ?? null
  payload.slug = (data.slug && String(data.slug).trim()) || slugify(data.title || '')
  payload.title = data.title || '(無題)'
  payload.body = data.body ?? ''
  payload.status = data.status === 'published' ? 'published' : 'draft'
  payload.featured = data.featured ? 1 : 0
  if (payload.status === 'published' && !payload.published_at) {
    payload.published_at = now.slice(0, 10)
  }
  for (const k of ['rating', 'cospa', 'budget', 'series_day']) {
    payload[k] = payload[k] === '' || payload[k] === null ? null : Number(payload[k])
  }
  for (const k of ['budget']) {
    payload[k] = payload[k] === '' || payload[k] === null ? null : parseInt(payload[k], 10)
  }

  let postId = id
  if (id) {
    const sets = POST_FIELDS.map((f) => `${f} = ?`).join(', ')
    await db
      .prepare(`UPDATE posts SET ${sets}, updated_at = ? WHERE id = ?`)
      .bind(...POST_FIELDS.map((f) => payload[f]), now, id)
      .run()
  } else {
    const cols = POST_FIELDS.join(', ')
    const marks = POST_FIELDS.map(() => '?').join(', ')
    const res = await db
      .prepare(`INSERT INTO posts (${cols}, created_at, updated_at) VALUES (${marks}, ?, ?)`)
      .bind(...POST_FIELDS.map((f) => payload[f]), now, now)
      .run()
    postId = res.meta.last_row_id as number
  }

  // タグ更新
  if (Array.isArray(data.tags)) {
    await db.prepare('DELETE FROM post_tags WHERE post_id = ?').bind(postId).run()
    for (const raw of data.tags) {
      const name = String(raw).trim()
      if (!name) continue
      const tslug = name
      await db
        .prepare('INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)')
        .bind(name, tslug)
        .run()
      const t = await db.prepare('SELECT id FROM tags WHERE name = ?').bind(name).first<{ id: number }>()
      if (t) {
        await db
          .prepare('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)')
          .bind(postId, t.id)
          .run()
      }
    }
    // 参照ゼロになったタグを掃除（ゴーストタグ対策）
    await db
      .prepare('DELETE FROM tags WHERE NOT EXISTS (SELECT 1 FROM post_tags pt WHERE pt.tag_id = tags.id)')
      .run()
  }

  // 写真更新
  if (Array.isArray(data.photos)) {
    await db.prepare('DELETE FROM post_photos WHERE post_id = ?').bind(postId).run()
    let i = 0
    for (const p of data.photos) {
      const url = typeof p === 'string' ? p : p?.url
      if (!url) continue
      await db
        .prepare('INSERT INTO post_photos (post_id, url, caption, sort_order) VALUES (?, ?, ?, ?)')
        .bind(postId, url, typeof p === 'object' ? p.caption ?? null : null, i++)
        .run()
    }
  }
  // スポット更新（複数ピンの地図用）
  if (Array.isArray(data.spots)) {
    await db.prepare('DELETE FROM post_spots WHERE post_id = ?').bind(postId).run()
    let j = 0
    for (const s of data.spots) {
      const lat = Number(s?.lat)
      const lng = Number(s?.lng)
      if (!s?.name || !isFinite(lat) || !isFinite(lng)) continue
      await db
        .prepare('INSERT INTO post_spots (post_id, sort_order, name, lat, lng, note) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(postId, j++, String(s.name), lat, lng, s.note ? String(s.note) : null)
        .run()        
    }
    // 記事本体の座標はスポット1番目に合わせる（サイト全体の地図で使われるため）
    const first = data.spots.find(
      (s: any) => s?.name && isFinite(Number(s?.lat)) && isFinite(Number(s?.lng))
    )
    if (first) {
      await db
        .prepare('UPDATE posts SET lat = ?, lng = ? WHERE id = ?')
        .bind(Number(first.lat), Number(first.lng), postId)
        .run()
    }
  }
  return postId!
}

export async function deletePost(db: D1Database, id: number) {
  await db.prepare('DELETE FROM post_tags WHERE post_id = ?').bind(id).run()
  await db.prepare('DELETE FROM post_photos WHERE post_id = ?').bind(id).run()
  await db.prepare('DELETE FROM post_spots WHERE post_id = ?').bind(id).run()  
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
  await db
    .prepare('DELETE FROM tags WHERE NOT EXISTS (SELECT 1 FROM post_tags pt WHERE pt.tag_id = tags.id)')
    .run()  
}

export async function listTags(db: D1Database, category?: string, categories?: string[]) {
  const binds: any[] = []
  let filter = ''
  if (category) {
    filter = 'AND p.category = ?'
    binds.push(category)
  } else if (categories && categories.length) {
    filter = `AND p.category IN (${categories.map(() => '?').join(',')})`
    binds.push(...categories)
  }
  const sql = `
    SELECT t.name, t.slug, COUNT(pt.post_id) AS cnt
    FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    JOIN posts p ON p.id = pt.post_id AND p.status = 'published'
    ${filter}
    GROUP BY t.id ORDER BY cnt DESC, t.name`
  const r = binds.length ? await db.prepare(sql).bind(...binds).all() : await db.prepare(sql).all()
  return r.results as { name: string; slug: string; cnt: number }[]
}

/**
 * 候補スラッグのうち、公開済みで最初に見つかったものを返す。
 * About 用の自己紹介記事を解決するのに使用。
 */
export async function findFirstPostSlug(db: D1Database, slugs: string[]) {
  if (!slugs.length) return null
  const r = await db
    .prepare(
      `SELECT slug FROM posts
       WHERE status='published' AND slug IN (${slugs.map(() => '?').join(',')})`
    )
    .bind(...slugs)
    .all()
  const found = (r.results as any[]).map((x) => x.slug)
  // config.ts の並び順を優先する
  for (const s of slugs) if (found.includes(s)) return s as string
  return null
}

export async function listMonthlyStats(db: D1Database, limit = 36) {
  const r = await db
    .prepare('SELECT * FROM (SELECT * FROM monthly_stats ORDER BY ym DESC LIMIT ?) ORDER BY ym ASC')
    .bind(limit)
    .all()
  return r.results as any[]
}

const STAT_FIELDS = [
  'ym','total_assets','nisa_value','nisa_contribution','ideco_value','ideco_contribution',
  'cash','other','income','living_cost','expense_json','memo'
]

export async function upsertMonthlyStat(db: D1Database, data: any) {
  const payload: Record<string, any> = {}
  for (const f of STAT_FIELDS) {
    let v = data[f]
    if (v === '' || v === undefined) v = null
    if (f !== 'ym' && f !== 'memo' && f !== 'expense_json' && v !== null) v = Number(v)
    payload[f] = v
  }
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const cols = STAT_FIELDS.join(', ')
  const marks = STAT_FIELDS.map(() => '?').join(', ')
  const updates = STAT_FIELDS.filter((f) => f !== 'ym').map((f) => `${f} = excluded.${f}`).join(', ')
  await db
    .prepare(
      `INSERT INTO monthly_stats (${cols}, updated_at) VALUES (${marks}, ?)
       ON CONFLICT(ym) DO UPDATE SET ${updates}, updated_at = excluded.updated_at`
    )
    .bind(...STAT_FIELDS.map((f) => payload[f]), now)
    .run()
}

export async function deleteMonthlyStat(db: D1Database, ym: string) {
  await db.prepare('DELETE FROM monthly_stats WHERE ym = ?').bind(ym).run()
}

export async function getCategoryCounts(db: D1Database) {
  const r = await db
    .prepare("SELECT category, COUNT(*) AS c FROM posts WHERE status='published' GROUP BY category")
    .all()
  const map: Record<string, number> = {}
  for (const row of r.results as any[]) map[row.category] = row.c
  return map
}
