import type { FC, PropsWithChildren } from 'hono/jsx'
import { THEMES, SITE, SEO, CATEGORY_MAP } from '../lib/config'

type LayoutProps = PropsWithChildren<{
  title?: string
  description?: string
  /** 記事カテゴリ（テーマのハイライト用に自動変換） */
  activeCategory?: string
  /** 大テーマ（money / touring / tech）を直接指定 */
  activeTheme?: string
  /** ホーム/マップなど、ナビでハイライトする固定ページ */
  activePage?: 'home' | 'map' | 'about' | 'search' | 'supermarket'
  ogImage?: string | null
  scripts?: string[]
  headExtra?: any
  /** 正規URL（canonical / og:url に使用） */
  canonical?: string
  /** 地図に表示できるピンが1件以上あるか（0件ならフッターのマップリンクを出さない） */
  hasMapPins?: boolean
  /** og:type（記事ページは article） */
  ogType?: 'website' | 'article'
  /** 記事の公開日 / 更新日（article のときのみ） */
  publishedTime?: string | null
  modifiedTime?: string | null
  /** JSON-LD（構造化データ） */
  jsonLd?: any
}>

export const Layout: FC<LayoutProps> = (props) => {
  const title = props.title ? `${props.title} — ${SITE.title}` : `${SITE.title} — ${SITE.subtitle}`
  const desc = props.description || SITE.description
  const activeTheme = props.activeTheme || CATEGORY_MAP[props.activeCategory || '']?.theme
  /**
   * OG画像。記事のカバー画像があればそれを、なければ共通のOG画像を使う。
   * SNSは絶対パスを要求するため、canonical から origin を組み立てる。
   */
  const origin = props.canonical ? new URL(props.canonical).origin : ''
  const abs = (u: string) => (u.startsWith('http') ? u : `${origin}${u}`)
  const ogImage = abs(props.ogImage || '/og.png')
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="theme-color" content="#f1f1ec" />
        <meta name="color-scheme" content="light" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content={props.ogType || 'website'} />
        <meta property="og:site_name" content={SITE.title} />
        <meta property="og:locale" content="ja_JP" />
        {/* og:image は記事のカバー画像、なければ自動生成のOG画像を使う */}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={props.title || SITE.title} />
        {props.canonical ? <meta property="og:url" content={props.canonical} /> : null}
        {props.canonical ? <link rel="canonical" href={props.canonical} /> : null}
        {props.ogType === 'article' && props.publishedTime ? (
          <meta property="article:published_time" content={props.publishedTime} />
        ) : null}
        {props.ogType === 'article' && props.modifiedTime ? (
          <meta property="article:modified_time" content={props.modifiedTime} />
        ) : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={ogImage} />
        {props.jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(props.jsonLd) }}
          ></script>
        ) : null}

        {/* Google Search Console のサイト所有権確認（config.ts の SEO で設定） */}
        {SEO.googleSiteVerification ? (
          <meta name="google-site-verification" content={SEO.googleSiteVerification} />
        ) : null}
        {/* 絵文字SVGだと環境によって表示されないため PNG を用意 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" type="application/rss+xml" title={SITE.title} href="/rss.xml" />
        {/* 本文フォント：日本語は Noto Sans JP、数字は等幅（Roboto Mono）で桁を揃える */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind は CDN(本番非推奨) をやめ、使用クラスだけをビルドしたCSSを読む */}
        <link rel="stylesheet" href="/static/tw.css" />
        {/* Font Awesome は使用アイコンのみのサブセット（webフォント読み込みなし） */}
        <link rel="stylesheet" href="/static/fa.css" />
        <link rel="stylesheet" href="/static/style.css" />
        {props.headExtra ?? null}
      </head>
      <body class="bg-base font-sans text-ink antialiased">
        <SiteHeader activeTheme={activeTheme} activePage={props.activePage} hasMapPins={props.hasMapPins} />
        <main>{props.children}</main>
        <SiteFooter hasMapPins={props.hasMapPins} />
        {(props.scripts || []).map((s) => (
          <script src={s}></script>
        ))}

        {/* Google Analytics 4（config.ts の SEO.gaMeasurementId を設定すると有効化） */}
        {SEO.gaMeasurementId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${SEO.gaMeasurementId}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SEO.gaMeasurementId}');`
              }}
            ></script>
          </>
        ) : null}

        {/* Google AdSense 自動広告（config.ts の SEO.adsensePublisherId を設定すると有効化） */}
        {SEO.adsensePublisherId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SEO.adsensePublisherId}`}
            crossorigin="anonymous"
          ></script>
        ) : null}
      </body>
    </html>
  )
}

/* =========================================================
   固定ヘッダー
   左：サイト名 ／ 右：Money / Touring / Tech / About
   ========================================================= */
const SiteHeader: FC<{ activeTheme?: string; activePage?: string; hasMapPins?: boolean }> = ({
  activeTheme,
  activePage,
  hasMapPins
}) => {
  const link = (isActive: boolean) =>
    `rounded-full px-3.5 py-1.5 text-[14.5px] font-medium tracking-tight transition ${
      isActive ? 'bg-brand text-white' : 'text-sub hover:bg-black/[0.05] hover:text-ink'
    }`

  const items = [
    ...THEMES.map((t) => ({
      href: `/theme/${t.key}`,
      label: t.label,
      active: activeTheme === t.key,
      subs: t.categories.length > 1 ? t.categories.map((k) => CATEGORY_MAP[k]).filter(Boolean) : []
    })),
    { href: '/about', label: 'About', active: activePage === 'about', subs: [] as any[] }
  ]

  return (
    <>
      <header
        id="global-nav"
        class="fixed inset-x-0 top-0 z-50 border-b border-edge2 bg-base/90 backdrop-blur-xl backdrop-saturate-150"
      >
        <div class="mx-auto flex h-14 max-w-page items-center px-4 sm:px-6">
          {/* 左：サイト名 */}
          <a href="/" class="flex items-center gap-2.5 transition hover:opacity-80" aria-label={SITE.title}>
            <span class="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
              <svg viewBox="0 0 100 100" class="h-[13px] w-[13px] fill-current" aria-hidden="true"><rect x="20" y="62" width="60" height="7.2" rx="3.6"/><rect x="20" y="46" width="42" height="7.2" rx="3.6"/><rect x="20" y="30" width="24" height="7.2" rx="3.6"/><circle cx="76" cy="27.5" r="7.2"/></svg>
            </span>
            <span class="text-[15px] font-bold tracking-tight">{SITE.title}</span>
          </a>

          {/* 右：4リンク（PC） */}
          <nav class="ml-auto hidden items-center gap-1 md:flex">
            {items.map((it) =>
              it.subs.length ? (
                <div class="group relative">
                  <a href={it.href} class={link(it.active)}>{it.label}</a>
                  <div class="absolute left-1/2 top-full hidden w-[210px] -translate-x-1/2 pt-2 group-hover:block group-focus-within:block">
                    <div class="rounded-xl border border-white/10 bg-[#1c1c1b] p-1.5 shadow-lg">                      
                      {it.subs.map((c) => (
                        <a
                          href={`${it.href}?cat=${c.key}`}
                          class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-sub transition hover:bg-black/[0.05] hover:text-ink"
                        >
                          <i class={`fa-solid ${c.icon} w-4 text-[12px] text-brand`}></i>
                          {c.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a href={it.href} class={link(it.active)}>{it.label}</a>
              )
            )}
          </nav>

          {/* 右：モバイル */}
          <div class="ml-auto flex items-center gap-0.5 md:hidden">
            <a
              href="/search"
              class="grid h-9 w-9 place-items-center rounded-full text-sub transition hover:bg-black/[0.05]"
              aria-label="検索"
            >
              <i class="fa-solid fa-magnifying-glass text-[14px]"></i>
            </a>
            <button
              id="menu-toggle"
              class="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-black/[0.05]"
              aria-label="メニュー"
              aria-expanded="false"
            >
              <i id="menu-icon" class="fa-solid fa-bars text-[15px]"></i>
            </button>
          </div>
        </div>
      </header>

      {/* モバイル：ハンバーガーメニュー */}
      <div id="mobile-menu" class="fixed inset-0 z-40 hidden bg-base/97 pt-14 backdrop-blur-xl md:hidden">
        <div class="mx-auto max-w-page overflow-y-auto px-4 py-4" style="max-height:calc(100vh - 3.5rem)">
          {THEMES.map((t) => (
            <a
              href={`/theme/${t.key}`}
              class="flex items-center justify-between border-b border-edge2 py-4"
            >
              <span class="min-w-0">
                <span class="flex items-center gap-3 text-[17px] font-bold tracking-tight">
                  <i class={`fa-solid ${t.icon} w-5 text-[14px] text-brand`}></i>
                  {t.name}
                </span>
                <span class="mt-1 block pl-8 text-[13px] text-mute">{t.label}</span>
              </span>
              <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
            </a>
          ))}

          <a href="/about" class="flex items-center justify-between border-b border-edge2 py-4">
            <span class="flex items-center gap-3 text-[17px] font-bold tracking-tight">
              <i class="fa-solid fa-circle-info w-5 text-[14px] text-brand"></i>このサイトについて
            </span>
            <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
          </a>
          {/* マップはピンが1件以上になるまで出さない */}
          {hasMapPins ? (
            <a href="/map" class="flex items-center justify-between border-b border-edge2 py-4">
              <span class="flex items-center gap-3 text-[17px] font-bold tracking-tight">
                <i class="fa-solid fa-map-location-dot w-5 text-[14px] text-brand"></i>エリア別
              </span>
              <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
            </a>
          ) : null}
          <a href="/search" class="flex items-center justify-between py-4">
            <span class="flex items-center gap-3 text-[17px] font-bold tracking-tight">
              <i class="fa-solid fa-magnifying-glass w-5 text-[14px] text-brand"></i>記事を探す
            </span>
            <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
          </a>
        </div>
      </div>
      <div class="h-14"></div>
    </>
  )
}

/* ============ フッター ============ */
const SiteFooter: FC<{ hasMapPins?: boolean }> = ({ hasMapPins }) => (
  <footer class="mt-16 border-t border-edge2 bg-panel">
    <div class="mx-auto max-w-page px-4 py-10 sm:px-6">
      <div class="flex items-center gap-2.5">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
          <svg viewBox="0 0 100 100" class="h-[13px] w-[13px] fill-current" aria-hidden="true"><rect x="20" y="62" width="60" height="7.2" rx="3.6"/><rect x="20" y="46" width="42" height="7.2" rx="3.6"/><rect x="20" y="30" width="24" height="7.2" rx="3.6"/><circle cx="76" cy="27.5" r="7.2"/></svg>
        </span>
        <span class="text-[15px] font-bold tracking-tight">{SITE.title}</span>
      </div>
      {/* 説明文はナビと同じ3テーマ構成で統一 */}
      <p class="mt-4 max-w-xl text-[13.5px] leading-relaxed text-mute">{SITE.description}</p>

      <div class="mt-8 grid gap-7 border-t border-edge2 pt-8 sm:grid-cols-3">
        <div>
          <p class="text-[10.5px] font-bold uppercase tracking-[0.14em] text-mute">Topics</p>
          <ul class="mt-3 space-y-2.5">
            {THEMES.map((t) => (
              <li>
                <a href={`/theme/${t.key}`} class="text-[14px] text-sub transition hover:text-ink">
                  {t.name}
                  <span class="ml-2 text-[11.5px] text-mute">{t.label}</span>
                </a>
                {t.categories.length > 1 ? (
                  <ul class="footer-sub mt-1.5 space-y-1 pl-3">
                    {t.categories
                      .map((k) => CATEGORY_MAP[k])
                      .filter(Boolean)
                      .map((c) => (
                        <li>
                          <a href={`/theme/${t.key}?cat=${c.key}`}>{c.name}</a>
                        </li>
                      ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p class="text-[10.5px] font-bold uppercase tracking-[0.14em] text-mute">Site</p>
          <ul class="mt-3 space-y-2.5">
            <li><a href="/" class="text-[14px] text-sub transition hover:text-ink">ホーム</a></li>
            <li><a href="/about" class="text-[14px] text-sub transition hover:text-ink">このサイトについて</a></li>
            {/* マップはピンが1件以上になるまで出さない */}
            {hasMapPins ? (
              <li><a href="/map" class="text-[14px] text-sub transition hover:text-ink">エリア別マップ</a></li>
            ) : null}
              <li><a href="/supermarket" class="text-[14px] text-sub transition hover:text-ink">ご当地スーパー一覧</a></li>
              <li><a href="/search" class="text-[14px] text-sub transition hover:text-ink">記事を探す</a></li>
          </ul>
        </div>
        <div>
          <p class="text-[10.5px] font-bold uppercase tracking-[0.14em] text-mute">Info</p>
          <ul class="mt-3 space-y-2.5">
            <li><a href="/sitemap.xml" class="text-[14px] text-sub transition hover:text-ink">サイトマップ</a></li>
            <li><a href="/rss.xml" class="text-[14px] text-sub transition hover:text-ink">RSS</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-edge2 pt-6">
        <p class="text-[11px] leading-relaxed text-mute">
          本サイトの内容は個人の記録であり、特定の金融商品の推奨や投資助言ではありません。
        </p>
        <p class="mt-2 text-[11px] text-mute">
          Copyright © {new Date().getFullYear()} {SITE.title}. すべての金額・記録は個人の実績値です。
        </p>
      </div>
    </div>
  </footer>
)

/* ============ 共通の小要素 ============ */

/** テキストリンク（矢印つき） */
export const ArrowLink: FC<{ href: string; children?: any; size?: 'sm' | 'md'; color?: string }> = ({
  href,
  children,
  size = 'md'
}) => (
  <a
    href={href}
    class={`group inline-flex items-center gap-1.5 font-medium tracking-tight text-brand transition hover:opacity-80 ${
      size === 'sm' ? 'text-[13.5px]' : 'text-[14.5px]'
    }`}
  >
    {children}
    <i class="fa-solid fa-chevron-right text-[0.72em] transition group-hover:translate-x-0.5"></i>
  </a>
)

/** ピルボタン */
export const PillButton: FC<{ href: string; children?: any; variant?: 'brand' | 'ghost' | 'light'; icon?: string }> = ({
  href,
  children,
  variant = 'brand',
  icon
}) => {
  const styles = {
    brand: 'bg-brand text-white hover:brightness-110',
    ghost: 'bg-black/[0.04] text-ink ring-1 ring-inset ring-black/10 hover:bg-black/[0.08]',
    light: 'bg-ink text-base hover:opacity-90'
  }[variant]
  return (
    <a
      href={href}
      class={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14.5px] font-medium tracking-tight transition ${styles}`}
    >
      {icon ? <i class={`fa-solid ${icon} text-[11.5px]`}></i> : null}
      {children}
    </a>
  )
}

/** カテゴリのバッジ（単一アクセント） */
export const Eyebrow: FC<{ cat: string; light?: boolean }> = ({ cat }) => {
  const c = CATEGORY_MAP[cat]
  if (!c) return null
  return (
    <span class="inline-flex items-center gap-1.5 rounded-full bg-brandsoft px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-brand">
      <i class={`fa-solid ${c.icon} text-[9.5px]`}></i>
      {c.short}
    </span>
  )
}
