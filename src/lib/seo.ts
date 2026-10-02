import { SITE, THEMES, CATEGORY_MAP, THEME_MAP } from './config'

/* =========================================================
   OG画像（SVGで動的生成 → 1200x630）
   画像ファイルを持たずに、どのページでもSNS共有時に画像が出るようにする。
   ========================================================= */

/** SVG内に埋め込めるようにエスケープ */
const sx = (s: string) =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/**
 * 日本語を含む文字列を、見た目の幅でざっくり折り返す。
 * 全角=1.0、半角=0.5 として数える。
 */
function wrap(text: string, perLine = 15, maxLines = 3): string[] {
  const chars = [...(text || '')]
  const lines: string[] = []
  let cur = ''
  let w = 0
  for (const ch of chars) {
    const cw = /[\x00-\x7F]/.test(ch) ? 0.5 : 1
    if (w + cw > perLine && cur) {
      lines.push(cur)
      cur = ''
      w = 0
      if (lines.length >= maxLines) break
    }
    cur += ch
    w += cw
  }
  if (cur && lines.length < maxLines) lines.push(cur)
  if (lines.length >= maxLines && chars.length) {
    const joined = lines.join('').length
    if (joined < chars.length) lines[lines.length - 1] = lines[lines.length - 1] + '…'
  }
  return lines
}

/** OG画像のSVGを生成（title / subtitle をレイアウト） */
export function ogSvg(title: string, subtitle?: string): string {
  const lines = wrap(title || SITE.title, 15, 3)
  const size = lines.length >= 3 ? 62 : lines.length === 2 ? 70 : 76
  const startY = 330 - (lines.length - 1) * (size * 0.62)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#121214"/>
      <stop offset="100%" stop-color="#0a0a0b"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1080" cy="80" r="420" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="8" fill="#f97316"/>

  <!-- ロゴ -->
  <g transform="translate(80,70)">
    <rect width="52" height="52" rx="14" fill="#f97316"/>
    <text x="26" y="36" font-size="26" text-anchor="middle" fill="#ffffff"
      font-family="system-ui, -apple-system, 'Noto Sans JP', sans-serif">K</text>
    <text x="70" y="35" font-size="27" fill="#f5f5f7" font-weight="700"
      font-family="system-ui, -apple-system, 'Noto Sans JP', sans-serif">${sx(SITE.title)}</text>
  </g>

  <!-- タイトル -->
  <g font-family="system-ui, -apple-system, 'Noto Sans JP', 'Hiragino Sans', sans-serif" font-weight="700" fill="#f5f5f7">
${lines
  .map(
    (l, i) =>
      `    <text x="80" y="${startY + i * (size * 1.32)}" font-size="${size}" letter-spacing="-1.5">${sx(l)}</text>`
  )
  .join('\n')}
  </g>

  <!-- サブタイトル -->
  <text x="80" y="540" font-size="27" fill="#a1a1aa"
    font-family="system-ui, -apple-system, 'Noto Sans JP', sans-serif">${sx(
      subtitle || SITE.subtitle
    )}</text>

  <!-- 下部のアクセント -->
  <rect x="80" y="566" width="88" height="5" rx="2.5" fill="#f97316"/>
</svg>`
}

/* =========================================================
   favicon（SVG → PNG変換はせず、SVG + PNG代替をSVGで返す）
   絵文字に依存しない図形だけで描く。
   ========================================================= */
export function iconSvg(px: number): string {
  const r = Math.round(px * 0.22)
  const cy = px * 0.5
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#f97316"/>
  <g fill="#ffffff">
    <rect x="22" y="60" width="56" height="7" rx="3.5"/>
    <rect x="22" y="44" width="38" height="7" rx="3.5"/>
    <rect x="22" y="28" width="22" height="7" rx="3.5"/>
    <circle cx="74" cy="31.5" r="7"/>
  </g>
</svg>`.replace('r="22"', `r="${Math.max(12, Math.round((r / px) * 100))}"`)
}

/* =========================================================
   JSON-LD（構造化データ）
   ========================================================= */

const authorNode = (origin: string) => ({
  '@type': 'Person',
  name: SITE.author === 'Owner' ? SITE.title : SITE.author,
  url: `${origin}/about`
})

const publisherNode = (origin: string) => ({
  '@type': 'Organization',
  name: SITE.title,
  url: origin,
  logo: { '@type': 'ImageObject', url: `${origin}/icon-512.png` }
})

/** トップページ：WebSite */
export function websiteJsonLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.title,
    alternateName: SITE.subtitle,
    url: origin,
    description: SITE.description,
    inLanguage: 'ja-JP',
    publisher: publisherNode(origin),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${origin}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string'
    }
  }
}

/** パンくず（下層ページ共通） */
export function breadcrumbJsonLd(origin: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'ホーム', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${origin}${it.path === '/' ? '' : it.path}`
    }))
  }
}

/** 記事ページ：BlogPosting + BreadcrumbList */
export function articleJsonLd(origin: string, post: any, canonical: string, ogImage: string) {
  const cat = CATEGORY_MAP[post.category]
  const theme = cat ? THEME_MAP[cat.theme] : undefined
  const iso = (v?: string | null) => {
    if (!v) return undefined
    const s = String(v).replace(' ', 'T')
    return s.length <= 10 ? `${s}T00:00:00+09:00` : `${s}+09:00`
  }

  const crumbs: { name: string; path: string }[] = []
  if (theme) crumbs.push({ name: theme.label, path: `/theme/${theme.key}` })
  if (theme && theme.categories.length > 1 && cat)
    crumbs.push({ name: cat.name, path: `/theme/${theme.key}?cat=${cat.key}` })
  crumbs.push({ name: post.title, path: `/posts/${post.slug}` })

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: String(post.title || '').slice(0, 110),
      description: post.summary || undefined,
      image: [ogImage],
      datePublished: iso(post.published_at || post.created_at),
      dateModified: iso(post.updated_at || post.published_at || post.created_at),
      author: authorNode(origin),
      publisher: publisherNode(origin),
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      url: canonical,
      inLanguage: 'ja-JP',
      articleSection: cat?.name,
      keywords: Array.isArray(post.tags) && post.tags.length ? post.tags.join(', ') : undefined,
      isAccessibleForFree: true
    },
    breadcrumbJsonLd(origin, crumbs)
  ]
}

/** /about：Person + BreadcrumbList */
export function personJsonLd(origin: string, stats: any[]) {
  const last = stats.length ? stats[stats.length - 1] : null
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SITE.author === 'Owner' ? SITE.title : SITE.author,
      url: `${origin}/about`,
      description:
        '60歳で資産1億円を目指す会社員。資産運用と生活費、ツーリングとご当地スーパー、業務効率化の記録を公開しています。',
      jobTitle: '会社員',
      homeLocation: { '@type': 'Place', name: '東京都' },
      knowsAbout: ['NISA', 'iDeCo', 'インデックス投資', '家計管理', 'ツーリング', '業務効率化'],
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${origin}/about` },
      ...(last?.total_assets ? { award: `総資産 ${Number(last.total_assets).toLocaleString('ja-JP')}円` } : {})
    },
    breadcrumbJsonLd(origin, [{ name: 'About', path: '/about' }])
  ]
}

/** テーマページ：CollectionPage + BreadcrumbList */
export function themeJsonLd(origin: string, themeKey: string, posts: any[]) {
  const t = THEME_MAP[themeKey]
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${t.label} — ${t.name}`,
      description: t.description,
      url: `${origin}/theme/${t.key}`,
      inLanguage: 'ja-JP',
      isPartOf: { '@type': 'WebSite', name: SITE.title, url: origin },
      ...(posts.length
        ? {
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: posts.length,
              itemListElement: posts.slice(0, 10).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${origin}/posts/${p.slug}`,
                name: p.title
              }))
            }
          }
        : {})
    },
    breadcrumbJsonLd(origin, [{ name: t.label, path: `/theme/${t.key}` }])
  ]
}

/** 汎用の下層ページ（検索・マップ・タグ）：BreadcrumbList のみ */
export function simplePageJsonLd(origin: string, name: string, path: string) {
  return breadcrumbJsonLd(origin, [{ name, path }])
}

/* =========================================================
   RSS
   ========================================================= */
export function rssXml(origin: string, posts: any[]): string {
  const esc = (s: any) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  const rfc822 = (v?: string | null) => {
    if (!v) return new Date().toUTCString()
    const s = String(v).replace(' ', 'T')
    const d = new Date(s.length <= 10 ? `${s}T00:00:00+09:00` : `${s}+09:00`)
    return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString()
  }
  const items = posts
    .slice(0, 30)
    .map((p) => {
      const cat = CATEGORY_MAP[p.category]
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${origin}/posts/${esc(p.slug)}</link>
      <guid isPermaLink="true">${origin}/posts/${esc(p.slug)}</guid>
      <pubDate>${rfc822(p.published_at || p.created_at)}</pubDate>
      ${cat ? `<category>${esc(cat.name)}</category>` : ''}
      <description>${esc(p.summary || '')}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.title)}</title>
    <link>${origin}</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(SITE.description)}</description>
    <language>ja</language>
    <lastBuildDate>${rfc822(posts[0]?.updated_at || posts[0]?.published_at)}</lastBuildDate>
${items}
  </channel>
</rss>`
}
