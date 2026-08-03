import type { FC, PropsWithChildren } from 'hono/jsx'
import { CATEGORIES, SITE, CATEGORY_MAP } from '../lib/config'

type LayoutProps = PropsWithChildren<{
  title?: string
  description?: string
  activeCategory?: string
  /** ホーム/マップなど、ナビでハイライトする固定ページ */
  activePage?: 'home' | 'map' | 'about' | 'search'
  ogImage?: string | null
  scripts?: string[]
  headExtra?: any
}>

export const Layout: FC<LayoutProps> = (props) => {
  const title = props.title ? `${props.title} — ${SITE.title}` : `${SITE.title} — ${SITE.subtitle}`
  const desc = props.description || SITE.description
  return (
    <html lang="ja" class="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="theme-color" content="#0a0a0b" />
        <meta name="color-scheme" content="dark" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        {props.ogImage ? <meta property="og:image" content={props.ogImage} /> : null}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%23f97316'/><text x='50' y='72' font-size='58' text-anchor='middle' fill='%23fff'>🏍</text></svg>"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config={darkMode:'class',theme:{extend:{
              fontFamily:{sans:['-apple-system','BlinkMacSystemFont','SF Pro Display','SF Pro Text','Hiragino Sans','Inter','Noto Sans JP','Helvetica Neue','sans-serif']},
              colors:{
                base:'#0a0a0b',
                panel:'#121214',
                panel2:'#18181b',
                edge:'rgba(255,255,255,0.10)',
                edge2:'rgba(255,255,255,0.06)',
                ink:'#f5f5f7',
                sub:'#a1a1aa',
                mute:'#71717a',
                brand:'#f97316',
                brandsoft:'rgba(249,115,22,0.14)'
              },
              maxWidth:{page:'1120px',text:'720px'},
              borderRadius:{apple:'16px',big:'24px'}
            }}}`
          }}
        ></script>
        <link rel="stylesheet" href="/static/style.css" />
        {props.headExtra ?? null}
      </head>
      <body class="bg-base font-sans text-ink antialiased">
        <SiteHeader active={props.activeCategory} activePage={props.activePage} />
        <main>{props.children}</main>
        <SiteFooter />
        {(props.scripts || []).map((s) => (
          <script src={s}></script>
        ))}
      </body>
    </html>
  )
}

/* ============ グローバルナビ（ダーク・ピル型アクティブ表示） ============ */
const SiteHeader: FC<{ active?: string; activePage?: string }> = ({ active, activePage }) => {
  const pill = (isActive: boolean) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-[13px] tracking-tight transition ${
      isActive ? 'bg-brand text-white' : 'text-sub hover:bg-white/[0.07] hover:text-ink'
    }`

  return (
    <>
      <header
        id="global-nav"
        class="fixed inset-x-0 top-0 z-50 border-b border-edge2 bg-base/85 backdrop-blur-xl backdrop-saturate-150"
      >
        <div class="mx-auto flex h-16 max-w-page items-center px-5 sm:px-6">
          {/* ロゴ */}
          <a href="/" class="flex items-center gap-3 transition hover:opacity-80" aria-label={SITE.title}>
            <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
              <i class="fa-solid fa-motorcycle text-[15px]"></i>
            </span>
            <span class="leading-tight">
              <span class="block text-[15px] font-semibold tracking-tight">{SITE.title}</span>
              <span class="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-mute sm:block">
                {SITE.caption}
              </span>
            </span>
          </a>

          {/* PCナビ */}
          <nav class="ml-auto hidden items-center gap-1 lg:flex">
            <a href="/" class={pill(activePage === 'home')}>
              <i class="fa-solid fa-house text-[11px]"></i>ホーム
            </a>
            {CATEGORIES.map((c) => (
              <a href={`/category/${c.key}`} class={pill(active === c.key)}>
                <i class={`fa-solid ${c.icon} text-[11px]`}></i>
                {c.name}
              </a>
            ))}
            <a href="/map" class={pill(activePage === 'map')}>
              <i class="fa-solid fa-map-location-dot text-[11px]"></i>マップ
            </a>
            <a
              href="/search"
              class="ml-1 grid h-9 w-9 place-items-center rounded-full text-sub transition hover:bg-white/[0.07] hover:text-ink"
              aria-label="検索"
            >
              <i class="fa-solid fa-magnifying-glass text-[13px]"></i>
            </a>
          </nav>

          {/* モバイル */}
          <div class="ml-auto flex items-center gap-1 lg:hidden">
            <a
              href="/search"
              class="grid h-10 w-10 place-items-center rounded-full text-sub transition hover:bg-white/[0.07]"
              aria-label="検索"
            >
              <i class="fa-solid fa-magnifying-glass text-[14px]"></i>
            </a>
            <button
              id="menu-toggle"
              class="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-white/[0.07]"
              aria-label="メニュー"
            >
              <i id="menu-icon" class="fa-solid fa-bars text-[15px]"></i>
            </button>
          </div>
        </div>
      </header>

      {/* モバイル：全画面メニュー */}
      <div id="mobile-menu" class="fixed inset-0 z-40 hidden bg-base/97 pt-16 backdrop-blur-xl lg:hidden">
        <div class="mx-auto max-w-page overflow-y-auto px-5 py-6" style="max-height:calc(100vh - 4rem)">
          <a
            href="/"
            class="flex items-center justify-between border-b border-edge2 py-4 text-[19px] font-semibold tracking-tight"
          >
            <span class="flex items-center gap-3.5">
              <i class="fa-solid fa-house w-5 text-[14px] text-mute"></i>ホーム
            </span>
            <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
          </a>
          {CATEGORIES.map((c) => (
            <a
              href={`/category/${c.key}`}
              class="flex items-center justify-between border-b border-edge2 py-4 text-[19px] font-semibold tracking-tight"
            >
              <span class="flex items-center gap-3.5">
                <i class={`fa-solid ${c.icon} w-5 text-[14px]`} style={`color:${c.accent}`}></i>
                {c.name}
              </span>
              <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
            </a>
          ))}
          <a
            href="/map"
            class="flex items-center justify-between border-b border-edge2 py-4 text-[19px] font-semibold tracking-tight"
          >
            <span class="flex items-center gap-3.5">
              <i class="fa-solid fa-map-location-dot w-5 text-[14px] text-mute"></i>マップ
            </span>
            <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
          </a>
          <a href="/about" class="flex items-center justify-between py-4 text-[19px] font-semibold tracking-tight">
            <span class="flex items-center gap-3.5">
              <i class="fa-solid fa-circle-info w-5 text-[14px] text-mute"></i>About
            </span>
            <i class="fa-solid fa-chevron-right text-[11px] text-mute"></i>
          </a>
        </div>
      </div>
      <div class="h-16"></div>
    </>
  )
}

/* ============ フッター ============ */
const SiteFooter: FC = () => (
  <footer class="border-t border-edge2 bg-panel">
    <div class="mx-auto max-w-page px-5 py-14 sm:px-6">
      <div class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
          <i class="fa-solid fa-motorcycle text-[15px]"></i>
        </span>
        <span class="text-[15px] font-semibold tracking-tight">{SITE.title}</span>
      </div>
      <p class="mt-5 max-w-2xl text-[13px] leading-relaxed text-mute">{SITE.description}</p>

      <div class="mt-11 grid gap-9 border-t border-edge2 pt-10 sm:grid-cols-3">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">Topics</p>
          <ul class="mt-4 space-y-3">
            {CATEGORIES.map((c) => (
              <li>
                <a href={`/category/${c.key}`} class="text-[13px] text-sub transition hover:text-ink">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">Site</p>
          <ul class="mt-4 space-y-3">
            <li><a href="/" class="text-[13px] text-sub transition hover:text-ink">ホーム</a></li>
            <li><a href="/map" class="text-[13px] text-sub transition hover:text-ink">走行マップ</a></li>
            <li><a href="/search" class="text-[13px] text-sub transition hover:text-ink">記事を探す</a></li>
            <li><a href="/about" class="text-[13px] text-sub transition hover:text-ink">このサイトについて</a></li>
          </ul>
        </div>
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">Manage</p>
          <ul class="mt-4 space-y-3">
            <li><a href="/admin" class="text-[13px] text-sub transition hover:text-ink">管理画面</a></li>
            <li><a href="/sitemap.xml" class="text-[13px] text-sub transition hover:text-ink">サイトマップ</a></li>
          </ul>
        </div>
      </div>

      <p class="mt-11 border-t border-edge2 pt-7 text-[11px] text-mute">
        Copyright © {new Date().getFullYear()} {SITE.title}. すべての金額・記録は個人の実績値です。
      </p>
    </div>
  </footer>
)

/* ============ 共通の小要素 ============ */

/** テキストリンク（矢印つき） */
export const ArrowLink: FC<{ href: string; children?: any; size?: 'sm' | 'md'; color?: string }> = ({
  href,
  children,
  size = 'md',
  color
}) => (
  <a
    href={href}
    class={`group inline-flex items-center gap-1.5 font-medium tracking-tight transition hover:opacity-80 ${
      size === 'sm' ? 'text-[13px]' : 'text-[15px] sm:text-[16px]'
    }`}
    style={`color:${color || '#fb923c'}`}
  >
    {children}
    <i class="fa-solid fa-chevron-right text-[0.7em] transition group-hover:translate-x-0.5"></i>
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
    ghost: 'bg-white/[0.08] text-ink ring-1 ring-inset ring-white/15 hover:bg-white/[0.14]',
    light: 'bg-ink text-base hover:opacity-90'
  }[variant]
  return (
    <a
      href={href}
      class={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium tracking-tight transition ${styles}`}
    >
      {icon ? <i class={`fa-solid ${icon} text-[12px]`}></i> : null}
      {children}
    </a>
  )
}

/** カテゴリのアイコン付きラベル（バッジ） */
export const Eyebrow: FC<{ cat: string; light?: boolean }> = ({ cat }) => {
  const c = CATEGORY_MAP[cat]
  if (!c) return null
  return (
    <span
      class="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
      style={`background:${c.accentSoft};color:${c.accent}`}
    >
      <i class={`fa-solid ${c.icon} text-[10px]`}></i>
      {c.short}
    </span>
  )
}
