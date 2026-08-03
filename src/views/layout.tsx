import type { FC, PropsWithChildren } from 'hono/jsx'
import { CATEGORIES, SITE, CATEGORY_MAP } from '../lib/config'

type LayoutProps = PropsWithChildren<{
  title?: string
  description?: string
  activeCategory?: string
  ogImage?: string | null
  scripts?: string[]
  headExtra?: any
  /** ナビをダーク（黒背景ページ用）にする */
  darkNav?: boolean
}>

export const Layout: FC<LayoutProps> = (props) => {
  const title = props.title ? `${props.title} — ${SITE.title}` : `${SITE.title} — ${SITE.subtitle}`
  const desc = props.description || SITE.description
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        {props.ogImage ? <meta property="og:image" content={props.ogImage} /> : null}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛵</text></svg>"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config={theme:{extend:{
              fontFamily:{sans:['-apple-system','BlinkMacSystemFont','SF Pro Display','SF Pro Text','Hiragino Sans','Inter','Noto Sans JP','Helvetica Neue','sans-serif']},
              colors:{ink:'#1d1d1f',sub:'#6e6e73',mute:'#86868b',line:'#d2d2d7',hazy:'#f5f5f7',blue:'#0071e3'},
              maxWidth:{page:'1024px',text:'700px'},
              borderRadius:{apple:'18px',big:'28px'}
            }}}`
          }}
        ></script>
        <link rel="stylesheet" href="/static/style.css" />
        {props.headExtra ?? null}
      </head>
      <body class="bg-white font-sans text-ink antialiased">
        <SiteHeader active={props.activeCategory} />
        <main>{props.children}</main>
        <SiteFooter />
        {(props.scripts || []).map((s) => (
          <script src={s}></script>
        ))}
      </body>
    </html>
  )
}

/* ============ ナビゲーション（Apple風の細いグローバルバー） ============ */
const SiteHeader: FC<{ active?: string }> = ({ active }) => (
  <>
    <header
      id="global-nav"
      class="fixed inset-x-0 top-0 z-50 h-11 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl backdrop-saturate-150 sm:h-12"
    >
      <div class="mx-auto flex h-full max-w-page items-center px-5 sm:px-6">
        <a href="/" class="flex items-center gap-2 text-ink transition hover:opacity-60" aria-label={SITE.title}>
          <i class="fa-solid fa-compass text-[15px]"></i>
          <span class="text-[13px] font-semibold tracking-tight sm:hidden">{SITE.title}</span>
        </a>

        <nav class="ml-auto hidden items-center gap-8 lg:flex">
          {CATEGORIES.map((c) => (
            <a
              href={`/category/${c.key}`}
              class={`text-[12px] tracking-tight transition hover:opacity-60 ${
                active === c.key ? 'font-medium text-ink' : 'text-ink/85'
              }`}
            >
              {c.name}
            </a>
          ))}
          <a href="/map" class="text-[12px] tracking-tight text-ink/85 transition hover:opacity-60">
            マップ
          </a>
          <a href="/about" class="text-[12px] tracking-tight text-ink/85 transition hover:opacity-60">
            About
          </a>
          <a href="/search" class="text-ink/85 transition hover:opacity-60" aria-label="検索">
            <i class="fa-solid fa-magnifying-glass text-[13px]"></i>
          </a>
        </nav>

        <div class="ml-auto flex items-center gap-6 lg:hidden">
          <a href="/search" class="text-ink/85" aria-label="検索">
            <i class="fa-solid fa-magnifying-glass text-[14px]"></i>
          </a>
          <button id="menu-toggle" class="text-ink/85" aria-label="メニュー">
            <i id="menu-icon" class="fa-solid fa-bars text-[14px]"></i>
          </button>
        </div>
      </div>
    </header>

    {/* モバイル：全画面メニュー */}
    <div
      id="mobile-menu"
      class="fixed inset-0 z-40 hidden bg-white/95 pt-11 backdrop-blur-xl sm:pt-12 lg:hidden"
    >
      <div class="mx-auto max-w-page px-6 py-6">
        {CATEGORIES.map((c) => (
          <a
            href={`/category/${c.key}`}
            class="menu-item flex items-center justify-between border-b border-black/[0.08] py-4 text-[22px] font-semibold tracking-tight"
          >
            {c.name}
            <i class="fa-solid fa-chevron-right text-[12px] text-mute"></i>
          </a>
        ))}
        <a href="/map" class="menu-item flex items-center justify-between border-b border-black/[0.08] py-4 text-[22px] font-semibold tracking-tight">
          マップ<i class="fa-solid fa-chevron-right text-[12px] text-mute"></i>
        </a>
        <a href="/about" class="menu-item flex items-center justify-between py-4 text-[22px] font-semibold tracking-tight">
          About<i class="fa-solid fa-chevron-right text-[12px] text-mute"></i>
        </a>
      </div>
    </div>
    <div class="h-11 sm:h-12"></div>
  </>
)

/* ============ フッター ============ */
const SiteFooter: FC = () => (
  <footer class="bg-hazy">
    <div class="mx-auto max-w-page px-5 py-12 sm:px-6">
      <p class="max-w-2xl text-[12px] leading-relaxed text-mute">
        {SITE.description}
      </p>
      <div class="mt-9 grid gap-8 border-t border-black/[0.08] pt-9 sm:grid-cols-3">
        <div>
          <p class="text-[12px] font-semibold text-ink">記録するテーマ</p>
          <ul class="mt-3 space-y-2.5">
            {CATEGORIES.map((c) => (
              <li>
                <a href={`/category/${c.key}`} class="text-[12px] text-sub transition hover:text-ink hover:underline">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p class="text-[12px] font-semibold text-ink">サイト</p>
          <ul class="mt-3 space-y-2.5">
            <li><a href="/" class="text-[12px] text-sub transition hover:text-ink hover:underline">ホーム</a></li>
            <li><a href="/map" class="text-[12px] text-sub transition hover:text-ink hover:underline">走行マップ</a></li>
            <li><a href="/search" class="text-[12px] text-sub transition hover:text-ink hover:underline">記事を探す</a></li>
            <li><a href="/about" class="text-[12px] text-sub transition hover:text-ink hover:underline">このサイトについて</a></li>
          </ul>
        </div>
        <div>
          <p class="text-[12px] font-semibold text-ink">管理</p>
          <ul class="mt-3 space-y-2.5">
            <li><a href="/admin" class="text-[12px] text-sub transition hover:text-ink hover:underline">管理画面</a></li>
            <li><a href="/sitemap.xml" class="text-[12px] text-sub transition hover:text-ink hover:underline">サイトマップ</a></li>
          </ul>
        </div>
      </div>
      <p class="mt-9 border-t border-black/[0.08] pt-6 text-[11px] text-mute">
        Copyright © {new Date().getFullYear()} {SITE.title}. すべての金額・記録は個人の実績値です。
      </p>
    </div>
  </footer>
)

/* ============ 共通の小要素 ============ */

/** Apple風のテキストリンク（矢印つき） */
export const ArrowLink: FC<{ href: string; children?: any; size?: 'sm' | 'md'; color?: string }> = ({
  href,
  children,
  size = 'md',
  color
}) => (
  <a
    href={href}
    class={`group inline-flex items-center gap-1.5 font-normal tracking-tight text-blue transition hover:underline ${
      size === 'sm' ? 'text-[13px]' : 'text-[15px] sm:text-[17px]'
    }`}
    style={color ? `color:${color}` : ''}
  >
    {children}
    <i class="fa-solid fa-chevron-right text-[0.7em] transition group-hover:translate-x-0.5"></i>
  </a>
)

/** Apple風のピルボタン */
export const PillButton: FC<{ href: string; children?: any; variant?: 'blue' | 'dark' | 'light' }> = ({
  href,
  children,
  variant = 'blue'
}) => {
  const styles = {
    blue: 'bg-blue text-white hover:brightness-110',
    dark: 'bg-ink text-white hover:opacity-85',
    light: 'bg-white/90 text-ink hover:bg-white'
  }[variant]
  return (
    <a
      href={href}
      class={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[15px] font-normal tracking-tight transition ${styles}`}
    >
      {children}
    </a>
  )
}

export const Eyebrow: FC<{ cat: string; light?: boolean }> = ({ cat, light }) => {
  const c = CATEGORY_MAP[cat]
  if (!c) return null
  return (
    <p
      class="text-[12px] font-semibold uppercase tracking-[0.14em]"
      style={`color:${light ? '#ffffffb3' : c.accent}`}
    >
      {c.short}
    </p>
  )
}
