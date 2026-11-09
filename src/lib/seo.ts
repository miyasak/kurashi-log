import { SITE, CATEGORY_MAP, THEME_MAP } from './config'

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
        '60歳で資産1億円を目指す会社員。資産運用と生活費、ツーリングとご当地スーパー、IT全般の記録を公開しています。',
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
