import { Hono } from 'hono'
import type { Context } from 'hono'
import {
  CATEGORIES,
  CATEGORY_MAP,
  THEMES,
  THEME_MAP,
  ABOUT_POST_SLUGS,
  SITE,
  type Bindings
} from './lib/config'
import {
  listPosts,
  countPosts,
  getPostBySlug,
  listTags,
  listMonthlyStats,
  getCategoryCounts,
  getLinkedPost,
  findFirstPostSlug
} from './lib/db'
import { renderMarkdown, stripMd } from './lib/utils'
import { isAuthed } from './lib/auth'
import { api } from './routes/api'
import { Layout } from './views/layout'
import { HomePage } from './views/home'
import { ThemePage } from './views/theme'
import { PostPage } from './views/post'
import { SearchPage, MapPage, AboutPage, NotFoundPage, TagPage } from './views/pages'
import { AdminApp } from './views/admin'

const app = new Hono<{ Bindings: Bindings }>()

const doc = (c: Context, el: any) => c.html('<!DOCTYPE html>' + el.toString())

/** 現在のリクエストから正規URL（クエリを除いたURL）を作る */
const canonicalOf = (c: Context) => {
  const u = new URL(c.req.url)
  return u.origin + u.pathname
}

const CHART_JS = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
const LEAFLET_CSS = (
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
)

app.route('/api', api)

/* ================= HOME ================= */
app.get('/', async (c) => {
  const db = c.env.DB
  const [latest, counts, stats, aboutSlug] = await Promise.all([
    listPosts(db, { limit: 6 }),
    getCategoryCounts(db),
    listMonthlyStats(db),
    findFirstPostSlug(db, ABOUT_POST_SLUGS)
  ])
  const byCategory: Record<string, any[]> = {}
  for (const cat of CATEGORIES) {
    byCategory[cat.key] = counts[cat.key] ? await listPosts(db, { category: cat.key, limit: 3 }) : []
  }
  const dist = await db
    .prepare("SELECT COALESCE(SUM(distance_km),0) AS d FROM posts WHERE status='published' AND category='touring'")
    .first<{ d: number }>()
  const sup = await db
    .prepare("SELECT COUNT(*) AS c FROM posts WHERE status='published' AND category='supermarket'")
    .first<{ c: number }>()
  const pref = await db
    .prepare(
      `SELECT COUNT(DISTINCT prefecture) AS c FROM posts
       WHERE status='published' AND prefecture IS NOT NULL AND prefecture <> ''
         AND category IN ('touring','supermarket')`
    )
    .first<{ c: number }>()

  return doc(
    c,
    <Layout activePage="home" canonical={canonicalOf(c)} scripts={[CHART_JS, '/static/site.js']}>
      <HomePage
        latest={latest}
        byCategory={byCategory}
        counts={counts}
        stats={stats}
        totalDistance={Math.round(dist?.d || 0)}
        superCount={sup?.c || 0}
        prefCount={pref?.c || 0}
        aboutHref={aboutSlug ? `/posts/${aboutSlug}` : '/about'}
      />
    </Layout>
  )
})

/* ================= THEME（Money / Touring / Tech） ================= */
app.get('/theme/:key', async (c) => {
  const key = c.req.param('key')
  const theme = THEME_MAP[key]
  if (!theme) return notFound(c)
  const db = c.env.DB
  const page = Math.max(1, Number(c.req.query('page') || 1))
  const perPage = 12
  const q = c.req.query('q') || undefined
  const tag = c.req.query('tag') || undefined
  const catParam = c.req.query('cat') || undefined
  // テーマ配下のカテゴリ以外が来たら無視する
  const activeCat =
    catParam && theme.categories.includes(catParam as any) ? catParam : undefined
  const cats = activeCat ? [activeCat] : theme.categories

  const [posts, counts] = await Promise.all([
    listPosts(db, { categories: cats, q, tag, limit: perPage, offset: (page - 1) * perPage }),
    getCategoryCounts(db)
  ])

  // タグはテーマ配下の記事のものだけ
  const tags = await listTags(db, undefined, cats)

  // フィルタ付きの総件数
  let total: number
  if (q || tag) {
    const all = await listPosts(db, { categories: cats, q, tag, limit: 100 })
    total = all.length
  } else {
    total = await countPosts(db, { categories: cats })
  }

  const stats = theme.key === 'money' ? await listMonthlyStats(db) : []

  const summary: Record<string, any> = {}
  if (theme.key === 'money' && stats.length) {
    const last: any = stats[stats.length - 1]
    const withCost = stats.filter((s: any) => s.living_cost)
    Object.assign(summary, {
      total_assets: last.total_assets,
      nisa_value: last.nisa_value,
      ideco_value: last.ideco_value,
      living_cost: withCost.length ? withCost[withCost.length - 1].living_cost : null
    })
  } else if (theme.key === 'touring') {
    const r = await db
      .prepare(
        `SELECT COALESCE(SUM(distance_km),0) AS d,
                COUNT(DISTINCT CASE WHEN prefecture <> '' THEN prefecture END) AS p
         FROM posts WHERE status='published' AND category IN ('touring','supermarket')`
      )
      .first<any>()
    const s = await db
      .prepare(
        `SELECT AVG(budget) AS b FROM posts
         WHERE status='published' AND category='supermarket' AND budget IS NOT NULL`
      )
      .first<any>()
    Object.assign(summary, {
      distance: Math.round(r?.d || 0),
      prefectures: r?.p || 0,
      avg_budget: s?.b ? Math.round(s.b) : null
    })
  }

  const needsMap = theme.key === 'touring' && total > 0
  const scripts = [
    ...(needsMap ? [LEAFLET_JS] : []),
    ...(theme.key === 'money' && stats.length ? [CHART_JS] : []),
    '/static/site.js'
  ]

  return doc(
    c,
    <Layout
      title={theme.label}
      description={theme.description}
      activeTheme={theme.key}
      canonical={canonicalOf(c)}
      scripts={scripts}
      headExtra={needsMap ? LEAFLET_CSS : null}
    >
      <ThemePage
        theme={theme}
        posts={posts}
        activeCat={activeCat}
        counts={counts}
        tags={tags}
        activeTag={tag}
        q={q}
        total={total}
        page={page}
        perPage={perPage}
        stats={stats}
        summary={summary}
      />
    </Layout>
  )
})

/* ===== 旧カテゴリURLは新テーマURLへ恒久リダイレクト ===== */
app.get('/category/:key', (c) => {
  const key = c.req.param('key')
  const cat = CATEGORY_MAP[key]
  if (!cat) return notFound(c)
  const theme = cat.theme
  // テーマ内に複数カテゴリがある場合はサブカテゴリを選択した状態へ
  const multi = THEME_MAP[theme].categories.length > 1
  return c.redirect(`/theme/${theme}${multi ? `?cat=${key}` : ''}`, 301)
})

/* ================= POST ================= */
app.get('/posts/:slug', async (c) => {
  const slug = c.req.param('slug')
  const authed = await isAuthed(c)
  const post = await getPostBySlug(c.env.DB, slug, authed)
  if (!post) return notFound(c)
  const html = renderMarkdown(post.body)
  const theme = CATEGORY_MAP[post.category]?.theme
  const related = (
    await listPosts(c.env.DB, {
      categories: theme ? THEME_MAP[theme].categories : [post.category],
      limit: 4
    })
  )
    .filter((p) => p.id !== post.id)
    .slice(0, 3)
  const hasGeo = post.lat != null && post.lng != null
  const linked = await getLinkedPost(c.env.DB, post)

  return doc(
    c,
    <Layout
      title={post.title}
      description={post.summary || stripMd(post.body, 120)}
      activeCategory={post.category}
      ogImage={post.cover_image}
      canonical={canonicalOf(c)}
      scripts={[...(hasGeo ? [LEAFLET_JS] : []), '/static/site.js']}
      headExtra={hasGeo ? LEAFLET_CSS : null}
    >
      <PostPage post={post} html={html} related={related} linked={linked} />
    </Layout>
  )
})

/* ================= TAG ================= */
app.get('/tags/:tag', async (c) => {
  const tag = decodeURIComponent(c.req.param('tag'))
  const posts = await listPosts(c.env.DB, { tag, limit: 60 })
  return doc(
    c,
    <Layout title={`#${tag}`} canonical={canonicalOf(c)} scripts={['/static/site.js']}>
      <TagPage tag={tag} posts={posts} />
    </Layout>
  )
})

/* ================= SEARCH ================= */
app.get('/search', async (c) => {
  const q = c.req.query('q') || undefined
  const themeKey = c.req.query('theme') || undefined
  const tag = c.req.query('tag') || undefined
  const theme = themeKey ? THEME_MAP[themeKey] : undefined
  const posts = await listPosts(c.env.DB, {
    q,
    categories: theme ? theme.categories : undefined,
    tag,
    limit: 60
  })
  return doc(
    c,
    <Layout title="記事を探す" activePage="search" canonical={canonicalOf(c)} scripts={['/static/site.js']}>
      <SearchPage posts={posts} q={q} theme={themeKey} tag={tag} total={posts.length} />
    </Layout>
  )
})

/* ================= MAP ================= */
app.get('/map', async (c) => {
  const t = await c.env.DB.prepare(
    "SELECT COUNT(*) AS c FROM posts WHERE status='published' AND category='touring' AND lat IS NOT NULL"
  ).first<{ c: number }>()
  const s = await c.env.DB.prepare(
    "SELECT COUNT(*) AS c FROM posts WHERE status='published' AND category='supermarket' AND lat IS NOT NULL"
  ).first<{ c: number }>()
  return doc(
    c,
    <Layout
      title="エリア別マップ"
      activePage="map"
      description="ツーリング先とご当地スーパーの位置を地図で確認できます。"
      canonical={canonicalOf(c)}
      scripts={[LEAFLET_JS, '/static/site.js']}
      headExtra={LEAFLET_CSS}
    >
      <MapPage touringCount={t?.c || 0} superCount={s?.c || 0} />
    </Layout>
  )
})

/* ================= ABOUT =================
   自己紹介記事があればそこへ転送し、無ければ簡易ページを表示する */
app.get('/about', async (c) => {
  const slug = await findFirstPostSlug(c.env.DB, ABOUT_POST_SLUGS)
  if (slug) return c.redirect(`/posts/${slug}`, 302)
  const counts = await getCategoryCounts(c.env.DB)
  return doc(
    c,
    <Layout title="About" activePage="about" canonical={canonicalOf(c)} scripts={['/static/site.js']}>
      <AboutPage counts={counts} />
    </Layout>
  )
})

/* ================= ADMIN ================= */
app.get('/admin', (c) => doc(c, <AdminApp />))
app.get('/admin/*', (c) => doc(c, <AdminApp />))

/* ================= R2 メディア ================= */
app.get('/media/*', async (c) => {
  if (!c.env.R2) return c.notFound()
  const key = c.req.path.replace('/media/', '')
  const obj = await c.env.R2.get(key)
  if (!obj) return c.notFound()
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000'
    }
  })
})

/* ================= sitemap / robots ================= */
app.get('/sitemap.xml', async (c) => {
  const posts = await listPosts(c.env.DB, { limit: 1000 })
  const tags = await listTags(c.env.DB)
  const origin = new URL(c.req.url).origin

  /** 日付を W3C Datetime（YYYY-MM-DD）に整える */
  const day = (v?: string | null) => (v ? String(v).slice(0, 10) : '')

  const newest = day(posts[0]?.updated_at || posts[0]?.published_at)

  type Entry = { loc: string; lastmod?: string; priority: string; freq: string }
  const entries: Entry[] = [
    { loc: '', lastmod: newest, priority: '1.0', freq: 'daily' },
    { loc: '/map', lastmod: newest, priority: '0.6', freq: 'weekly' },
    { loc: '/search', priority: '0.3', freq: 'monthly' }
  ]

  // テーマ：配下の最新記事日を lastmod に
  for (const t of THEMES) {
    const latest = posts.find((p) => t.categories.includes(p.category as any))
    entries.push({
      loc: `/theme/${t.key}`,
      lastmod: day(latest?.updated_at || latest?.published_at),
      priority: '0.8',
      freq: 'weekly'
    })
  }

  // 記事本体：最も優先度を高くする
  for (const p of posts) {
    entries.push({
      loc: `/posts/${p.slug}`,
      lastmod: day(p.updated_at || p.published_at),
      priority: '0.9',
      freq: 'monthly'
    })
  }

  // タグ一覧
  for (const t of tags as any[]) {
    entries.push({
      loc: `/tags/${encodeURIComponent(t.name)}`,
      priority: '0.4',
      freq: 'weekly'
    })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${origin}${e.loc}</loc>${
        e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''
      }<changefreq>${e.freq}</changefreq><priority>${e.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`
  return c.body(xml, 200, { 'Content-Type': 'application/xml' })
})

app.get('/robots.txt', (c) =>
  c.text(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${new URL(c.req.url).origin}/sitemap.xml\n`)
)

function notFound(c: Context<{ Bindings: Bindings }>) {
  return c.html(
    '<!DOCTYPE html>' +
      (
        <Layout title="404" scripts={['/static/site.js']}>
          <NotFoundPage />
        </Layout>
      ).toString(),
    404
  )
}

app.notFound((c) => notFound(c as any))

export default app
