import { Hono } from 'hono'
import type { Context } from 'hono'
import {
  CATEGORIES,
  CATEGORY_MAP,
  THEMES,
  THEME_MAP,
  ABOUT_POST_SLUGS,
  MAP_CAT_SQL,
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
  getSeriesNeighbors,
  findFirstPostSlug,
  getSettings
} from './lib/db'
import { renderMarkdown, stripMd, applyShortcodes } from './lib/utils'
import {
  websiteJsonLd,
  articleJsonLd,
  personJsonLd,
  themeJsonLd,
  simplePageJsonLd,
  rssXml
} from './lib/seo'
import { isAuthed } from './lib/auth'
import { api } from './routes/api'
import { Layout } from './views/layout'
import { HomePage } from './views/home'
import { ThemePage } from './views/theme'
import { PostPage } from './views/post'
import { SearchPage, MapPage, SupermarketListPage, CampListPage, OnsenListPage, AboutPage, PrivacyPage, NotFoundPage, TagPage } from './views/pages'
import { AdminApp } from './views/admin'

const app = new Hono<{ Bindings: Bindings }>()

const doc = (c: Context, el: any) => c.html('<!DOCTYPE html>' + el.toString())

/** 現在のリクエストから正規URL（クエリを除いたURL）を作る */
const canonicalOf = (c: Context) => {
  const u = new URL(c.req.url)
  return u.origin + u.pathname
}
const originOf = (c: Context) => new URL(c.req.url).origin

/** DBの日付を ISO8601（JST）にする。article:published_time 用。 */
const isoDate = (v?: string | null) => {
  if (!v) return null
  const s = String(v).replace(' ', 'T')
  return s.length <= 10 ? `${s}T00:00:00+09:00` : `${s}+09:00`
}

/** 地図に出せるピン（緯度経度ありの公開記事）の件数 */
async function countMapPins(db: D1Database) {
  const r = await db
    .prepare(
      `SELECT COUNT(*) AS c FROM posts
       WHERE status='published' AND lat IS NOT NULL AND lng IS NOT NULL
       AND category IN (${MAP_CAT_SQL})`
    )
    .first<{ c: number }>()
  return r?.c || 0
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
  const [latest, counts, stats, mapPins] = await Promise.all([
    listPosts(db, { limit: 6 }),
    getCategoryCounts(db),
    listMonthlyStats(db),
    countMapPins(db)
  ])
  const byCategory: Record<string, any[]> = {}
  for (const cat of CATEGORIES) {
    byCategory[cat.key] = counts[cat.key] ? await listPosts(db, { category: cat.key, limit: 3 }) : []
  }
  const dist = await db
    .prepare(`SELECT COALESCE(SUM(distance_km),0) AS d FROM posts WHERE status='published' AND category IN (${MAP_CAT_SQL})`)
    .first<{ d: number }>()
  const sup = await db
    .prepare("SELECT COUNT(*) AS c FROM posts WHERE status='published' AND category='supermarket'")
    .first<{ c: number }>()
  const pref = await db
    .prepare(
      `SELECT COUNT(DISTINCT prefecture) AS c FROM posts
       WHERE status='published' AND prefecture IS NOT NULL AND prefecture <> ''
          AND category IN (${MAP_CAT_SQL})`
    )
    .first<{ c: number }>()

  return doc(
    c,
    <Layout
      activePage="home"
      canonical={canonicalOf(c)}
      hasMapPins={mapPins > 0}
      jsonLd={websiteJsonLd(originOf(c))}
      scripts={[CHART_JS, '/static/site.js']}
    >
      <HomePage
        latest={latest}
        byCategory={byCategory}
        counts={counts}
        stats={stats}
        totalDistance={Math.round(dist?.d || 0)}
        superCount={sup?.c || 0}
        prefCount={pref?.c || 0}
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
  const total = await countPosts(db, { categories: cats, q, tag })

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
         FROM posts WHERE status='published' AND category IN (${MAP_CAT_SQL})`
      )
      .first<any>()
    Object.assign(summary, {
      distance: Math.round(r?.d || 0),
      prefectures: r?.p || 0
    })
  }

  const mapPins = await countMapPins(db)
  const needsMap = theme.key === 'touring' && mapPins > 0
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
      hasMapPins={mapPins > 0}
      jsonLd={themeJsonLd(originOf(c), theme.key, posts)}
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
  // 本文の {{total_assets}} などを月次データの最新値に置き換えてから描画する
  const stats = await listMonthlyStats(c.env.DB)
  const html = renderMarkdown(applyShortcodes(post.body, stats))
  const theme = CATEGORY_MAP[post.category]?.theme
  // 「次に読む」用に同テーマから2件
  const related = (
    await listPosts(c.env.DB, {
      categories: theme ? THEME_MAP[theme].categories : [post.category],
      limit: 4
    })
  )
    .filter((p) => p.id !== post.id)
    .slice(0, 2)
  const hasGeo = post.lat != null && post.lng != null
  const linked = await getLinkedPost(c.env.DB, post)
  const series = await getSeriesNeighbors(c.env.DB, post)
  const mapPins = await countMapPins(c.env.DB)
  const settings = await getSettings(c.env.DB)
  const canonical = canonicalOf(c)
  const cover = post.cover_image
  ? (post.cover_image.startsWith('http') ? post.cover_image : originOf(c) + post.cover_image)
  : null
  const ogImg = cover || `${originOf(c)}/og.png`

  return doc(
    c,
    <Layout
      title={post.title}
      description={post.summary || stripMd(post.body, 120)}
      activeCategory={post.category}
      ogImage={post.cover_image}
      ogType="article"
      publishedTime={isoDate(post.published_at || post.created_at)}
      modifiedTime={isoDate(post.updated_at || post.published_at)}
      canonical={canonical}
      hasMapPins={mapPins > 0}
      jsonLd={articleJsonLd(originOf(c), post, canonical, ogImg)}
      scripts={[...(hasGeo ? [LEAFLET_JS] : []), '/static/site.js']}
      headExtra={hasGeo ? LEAFLET_CSS : null}
    >
      <PostPage post={post} html={html} related={related} linked={linked} series={series} settings={settings} />
    </Layout>
  )
})

/* ================= TAG ================= */
app.get('/tags/:tag', async (c) => {
  const tag = decodeURIComponent(c.req.param('tag'))
  const posts = await listPosts(c.env.DB, { tag, limit: 60 })
  const mapPins = await countMapPins(c.env.DB)
  return doc(
    c,
    <Layout
      title={`#${tag}`}
      canonical={canonicalOf(c)}
      hasMapPins={mapPins > 0}
      jsonLd={simplePageJsonLd(originOf(c), tag, `/tags/${encodeURIComponent(tag)}`)}
      scripts={['/static/site.js']}
    >
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
  const total = await countPosts(c.env.DB, {
    q,
    categories: theme ? theme.categories : undefined,
    tag
  })
  const mapPins = await countMapPins(c.env.DB)
  return doc(
    c,
    <Layout
      title="記事を探す"
      activePage="search"
      canonical={canonicalOf(c)}
      hasMapPins={mapPins > 0}
      jsonLd={simplePageJsonLd(originOf(c), '記事を探す', '/search')}
      scripts={['/static/site.js']}
    >
      <SearchPage posts={posts} q={q} theme={themeKey} tag={tag} total={total} />
    </Layout>
  )
})

/* ================= MAP ================= */
app.get('/map', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT category, COUNT(*) AS c FROM posts
     WHERE status='published' AND lat IS NOT NULL AND lng IS NOT NULL
       AND category IN (${MAP_CAT_SQL})
     GROUP BY category`
  ).all<{ category: string; c: number }>()
  const counts: Record<string, number> = {}
  for (const r of rows.results || []) counts[r.category] = r.c
  const pins = Object.values(counts).reduce((a, b) => a + b, 0)
  return doc(
    c,
    <Layout
      title="エリア別マップ"
      activePage="map"
      description="ツーリングで走った場所、泊まったキャンプ場、立ち寄ったご当地スーパーや日帰り温泉を地図で確認できます。"
      canonical={canonicalOf(c)}
      hasMapPins={pins > 0}
      jsonLd={simplePageJsonLd(originOf(c), 'エリア別マップ', '/map')}
      scripts={pins > 0 ? [LEAFLET_JS, '/static/site.js'] : ['/static/site.js']}
      headExtra={pins > 0 ? LEAFLET_CSS : null}
    >
      <MapPage counts={counts} />
    </Layout>
  )
})

/* ================== 日帰り温泉一覧 ================== */
app.get('/onsen', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT slug, title, place_name, prefecture, budget, business_hours, rating, visit_date
       FROM posts
      WHERE status='published' AND category='onsen'
      ORDER BY budget ASC, rating DESC, published_at DESC`
  ).all<{
    slug: string
    title: string
    place_name: string | null
    prefecture: string | null
    budget: number | null
    business_hours: string | null
    rating: number | null
    visit_date: string | null
  }>()
  return doc(
    c,
    <Layout
      title="日帰り温泉一覧"
      activePage="onsen"
      activeTheme="spa"
      description="ツーリングやキャンプの途中で寄った日帰り温泉の一覧です。入浴料・エリア・ランク・営業時間から記事を探せます。"
      canonical={canonicalOf(c)}
      jsonLd={simplePageJsonLd(originOf(c), '日帰り温泉一覧', '/onsen')}
      scripts={['/static/site.js']}
    >
      <OnsenListPage items={rows.results || []} />
    </Layout>
  )
})

/* ================== キャンプ場一覧 ================== */
app.get('/camp', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT slug, title, place_name, prefecture, budget, business_hours, rating, visit_date
       FROM posts
      WHERE status='published' AND category='camp'
      ORDER BY budget ASC, rating DESC, published_at DESC`
  ).all<{
    slug: string
    title: string
    place_name: string | null
    prefecture: string | null
    budget: number | null
    business_hours: string | null
    rating: number | null
    visit_date: string | null
  }>()
  return doc(
    c,
    <Layout
      title="キャンプ場一覧"
      activePage="camp"
      activeTheme="touring"
      description="ツーリングで実際に泊まったキャンプ場の一覧です。料金・エリア・ランク・開設期間から記事を探せます。"
      canonical={canonicalOf(c)}
      jsonLd={simplePageJsonLd(originOf(c), 'キャンプ場一覧', '/camp')}
      scripts={['/static/site.js']}
    >
      <CampListPage items={rows.results || []} />
    </Layout>
  )
})

/* ================== ご当地スーパー一覧 ================== */
app.get('/supermarket', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT slug, title, place_name, prefecture, visit_date, highlight_value, cospa, rating
       FROM posts
      WHERE status='published' AND category='supermarket'
      ORDER BY visit_date DESC, published_at DESC`
  ).all<{
    slug: string
    title: string
    place_name: string | null
    prefecture: string | null
    visit_date: string | null
    highlight_value: string | null
    cospa: number | null
    rating: number | null
  }>()
  return doc(
    c,
    <Layout
      title="ご当地スーパー一覧"
      activePage="supermarket"
      activeTheme="touring"
      description="ツーリング中に立ち寄ったご当地スーパーの一覧です。県・訪問日・値引きを確認できた時刻・コスパと品質のランクから記事を探せます。"
      canonical={canonicalOf(c)}
      jsonLd={simplePageJsonLd(originOf(c), 'ご当地スーパー一覧', '/supermarket')}
      scripts={['/static/site.js']}
    >
      <SupermarketListPage items={rows.results || []} />
    </Layout>
  )
})

/* ================= ABOUT =================
   固定ページ（プロフィール要約）。
   自己紹介記事へは「詳しい経緯はこちら」でリンクする（転送しない）。 */
app.get('/privacy', async (c) => {
  const mapPins = await countMapPins(c.env.DB)
  return doc(
    c,
    <Layout
      title="プライバシーポリシー"
      description="アクセス解析・Cookie・免責事項・お問い合わせ先について。"
      canonical={canonicalOf(c)}
      hasMapPins={mapPins > 0}
      jsonLd={simplePageJsonLd(originOf(c), 'プライバシーポリシー', '/privacy')}
      scripts={['/static/site.js']}
    >
      <PrivacyPage />
    </Layout>
  )
})

app.get('/about', async (c) => {
  const [counts, stats, storySlug, mapPins] = await Promise.all([
    getCategoryCounts(c.env.DB),
    listMonthlyStats(c.env.DB),
    findFirstPostSlug(c.env.DB, ABOUT_POST_SLUGS),
    countMapPins(c.env.DB)
  ])
  return doc(
    c,
    <Layout
      title="About"
      description="60歳で資産1億円を目指す会社員のプロフィールと投資方針。資産構成も公開しています。"
      activePage="about"
      canonical={canonicalOf(c)}
      hasMapPins={mapPins > 0}
      jsonLd={personJsonLd(originOf(c), stats)}
      scripts={['/static/site.js']}
    >
      <AboutPage
        counts={counts}
        stats={stats}
        storyHref={storySlug ? `/posts/${storySlug}` : null}
      />
    </Layout>
  )
})

/* ================= ADMIN ================= */
app.get('/admin', (c) => doc(c, <AdminApp />))
app.get('/admin/*', (c) => doc(c, <AdminApp />))

/* ================= R2 メディア ================= */
app.get('/media/*', async (c) => {
  const key = c.req.path.replace('/media/', '')
  const obj = c.env.R2 ? await c.env.R2.get(key) : null
  if (!obj) {
    // ローカル開発だけ、別環境の画像を借りて表示する（.dev.vars の DEV_MEDIA_ORIGIN）
    const origin = new URL(c.req.url).origin
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1')
    if (isLocal && c.env.DEV_MEDIA_ORIGIN) {
      return fetch(c.env.DEV_MEDIA_ORIGIN.replace(/\/$/, '') + c.req.path)
    }
    return c.notFound()
  }
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000'
    }
  })
})

/* ================= sitemap / rss / robots ================= */
app.get('/sitemap.xml', async (c) => {
  const posts = await listPosts(c.env.DB, { limit: 1000, maxLimit: 5000 })
  const origin = originOf(c)

  /** 日付を W3C Datetime（YYYY-MM-DD）に整える */
  const day = (v?: string | null) => (v ? String(v).slice(0, 10) : '')
  const today = new Date().toISOString().slice(0, 10)
  const newest = day(posts[0]?.updated_at || posts[0]?.published_at) || today

  /** 地図に出せるピンがあるか（0件なら /map は出さない） */
  const mapPins = await countMapPins(c.env.DB)

  type Entry = { loc: string; lastmod: string; priority: string; freq: string }
  const entries: Entry[] = [
    { loc: '', lastmod: newest, priority: '1.0', freq: 'daily' },
    // About は固定ページとして独立させたので必ず載せる
    { loc: '/about', lastmod: newest, priority: '0.8', freq: 'monthly' },
    { loc: '/privacy', lastmod: newest, priority: '0.3', freq: 'yearly' },
    // /search は robots.txt で Disallow しているため sitemap には載せない
  ]

  if (mapPins > 0) {
    entries.push({ loc: '/map', lastmod: newest, priority: '0.6', freq: 'weekly' })
  }

  // ご当地スーパー一覧：記事が1件以上あるときだけ載せる
  if (posts.some((p) => p.category === 'supermarket')) {
    entries.push({ loc: '/supermarket', lastmod: newest, priority: '0.7', freq: 'weekly' })
  }
  if (posts.some((p) => p.category === 'camp')) {
    entries.push({ loc: '/camp', lastmod: newest, priority: '0.7', freq: 'weekly' })
  }
  if (posts.some((p) => p.category === 'onsen')) {
    entries.push({ loc: '/onsen', lastmod: newest, priority: '0.7', freq: 'weekly' })
  }

  // テーマ：記事が1件以上あるものだけ載せる（空ページをインデックスさせない）
  for (const t of THEMES) {
    const inTheme = posts.filter((p) => t.categories.includes(p.category as any))
    if (!inTheme.length) continue
    entries.push({
      loc: `/theme/${t.key}`,
      lastmod: day(inTheme[0].updated_at || inTheme[0].published_at) || newest,
      priority: '0.8',
      freq: 'weekly'
    })
  }

  // 記事本体：最も優先度を高くする
  for (const p of posts) {
    entries.push({
      loc: `/posts/${p.slug}`,
      lastmod: day(p.updated_at || p.published_at) || newest,
      priority: '0.9',
      freq: 'monthly'
    })
  }

  // タグページは記事数が少ないうちは薄いページになるので当面除外する

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${origin}${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.freq}</changefreq><priority>${e.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`
  return c.body(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

/* RSS */
app.get('/rss.xml', async (c) => {
  const posts = await listPosts(c.env.DB, { limit: 30 })
  return c.body(rssXml(originOf(c), posts), 200, {
    'Content-Type': 'application/rss+xml; charset=utf-8'
  })
})

app.get('/robots.txt', (c) => {
  const origin = originOf(c)
  return c.text(
    [
      'User-agent: *',
      'Allow: /',
      // 管理画面とAPIはインデックスさせない
      'Disallow: /admin',
      'Disallow: /api/',
      // 検索結果ページは重複コンテンツになるため除外
      'Disallow: /search',
      '',
      `Sitemap: ${origin}/sitemap.xml`,
      ''
    ].join('\n')
  )
})

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
