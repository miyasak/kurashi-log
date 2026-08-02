import type { FC, PropsWithChildren } from 'hono/jsx'
import { CATEGORIES, GROUPS, SITE, CATEGORY_MAP } from '../lib/config'

type LayoutProps = PropsWithChildren<{
  title?: string
  description?: string
  activeCategory?: string
  ogImage?: string | null
  bodyClass?: string
  scripts?: string[]
  headExtra?: any
}>

export const Layout: FC<LayoutProps> = (props) => {
  const title = props.title ? `${props.title} | ${SITE.title}` : `${SITE.title} — ${SITE.subtitle}`
  const desc = props.description || SITE.description
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        {props.ogImage ? <meta property="og:image" content={props.ogImage} /> : null}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛵</text></svg>" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config={theme:{extend:{fontFamily:{sans:['Inter','Noto Sans JP','system-ui','sans-serif']},
            colors:{ink:{DEFAULT:'#0f172a',soft:'#475569',mute:'#94a3b8'}},
            boxShadow:{soft:'0 2px 8px rgba(15,23,42,.05), 0 12px 32px -12px rgba(15,23,42,.12)'}}}}`
          }}
        ></script>
        <link rel="stylesheet" href="/static/style.css" />
        {props.headExtra ?? null}
      </head>
      <body class={`bg-slate-50 text-ink antialiased ${props.bodyClass || ''}`}>
        <SiteHeader active={props.activeCategory} />
        <main class="min-h-[70vh]">{props.children}</main>
        <SiteFooter />
        {(props.scripts || []).map((s) => (
          <script src={s}></script>
        ))}
      </body>
    </html>
  )
}

const SiteHeader: FC<{ active?: string }> = ({ active }) => {
  return (
    <header class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a href="/" class="group flex shrink-0 items-center gap-2.5">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm">
            <i class="fa-solid fa-compass text-[15px]"></i>
          </span>
          <span class="leading-tight">
            <span class="block text-[15px] font-extrabold tracking-tight">{SITE.title}</span>
            <span class="hidden text-[10px] font-medium tracking-widest text-ink-mute sm:block">
              MONEY / LIFE / RIDE / TECH
            </span>
          </span>
        </a>

        {/* PC: グループ別ナビ */}
        <nav class="ml-auto hidden items-center gap-1 lg:flex">
          {GROUPS.map((g) => {
            const cats = CATEGORIES.filter((c) => c.group === g.key)
            return (
              <div class="group relative">
                <button class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-slate-100 hover:text-ink">
                  <i class={`fa-solid ${g.icon} text-xs text-ink-mute`}></i>
                  {g.label}
                  <i class="fa-solid fa-chevron-down text-[9px] text-ink-mute"></i>
                </button>
                <div class="invisible absolute left-0 top-full w-64 translate-y-1 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft">
                    {cats.map((c) => (
                      <a
                        href={`/category/${c.key}`}
                        class={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50 ${
                          active === c.key ? 'bg-slate-50' : ''
                        }`}
                      >
                        <span
                          class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[13px]"
                          style={`background:${c.accentSoft};color:${c.accent}`}
                        >
                          <i class={`fa-solid ${c.icon}`}></i>
                        </span>
                        <span>
                          <span class="block text-[13px] font-bold">{c.name}</span>
                          <span class="block text-[11px] text-ink-mute">{c.tagline}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
          <a
            href="/map"
            class="ml-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-slate-100 hover:text-ink"
          >
            <i class="fa-solid fa-map-location-dot text-xs text-ink-mute"></i>マップ
          </a>
          <a
            href="/about"
            class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-slate-100 hover:text-ink"
          >
            <i class="fa-solid fa-circle-info text-xs text-ink-mute"></i>About
          </a>
          <a
            href="/search"
            class="ml-1 grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700"
            aria-label="検索"
          >
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </a>
        </nav>

        {/* Mobile */}
        <div class="ml-auto flex items-center gap-1.5 lg:hidden">
          <a
            href="/search"
            class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-ink-soft"
            aria-label="検索"
          >
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </a>
          <button
            id="menu-toggle"
            class="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white"
            aria-label="メニュー"
          >
            <i class="fa-solid fa-bars text-xs"></i>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden border-t border-slate-200 bg-white lg:hidden">
        <div class="mx-auto max-w-6xl px-4 py-4">
          <div class="grid gap-2">
            {CATEGORIES.map((c) => (
              <a
                href={`/category/${c.key}`}
                class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3"
              >
                <span
                  class="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                  style={`background:${c.accentSoft};color:${c.accent}`}
                >
                  <i class={`fa-solid ${c.icon} text-sm`}></i>
                </span>
                <span>
                  <span class="block text-sm font-bold">{c.name}</span>
                  <span class="block text-[11px] text-ink-mute">{c.tagline}</span>
                </span>
                <i class="fa-solid fa-chevron-right ml-auto text-[10px] text-ink-mute"></i>
              </a>
            ))}
            <div class="mt-1 grid grid-cols-2 gap-2">
              <a href="/map" class="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold">
                <i class="fa-solid fa-map-location-dot mr-1.5 text-xs text-ink-mute"></i>マップ
              </a>
              <a href="/about" class="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold">
                <i class="fa-solid fa-circle-info mr-1.5 text-xs text-ink-mute"></i>About
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const SiteFooter: FC = () => (
  <footer class="mt-20 border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
              <i class="fa-solid fa-compass text-[15px]"></i>
            </span>
            <span class="text-[15px] font-extrabold">{SITE.title}</span>
          </div>
          <p class="mt-4 max-w-sm text-[13px] leading-relaxed text-ink-soft">{SITE.description}</p>
        </div>
        <div>
          <p class="text-[11px] font-bold tracking-widest text-ink-mute">CATEGORY</p>
          <ul class="mt-4 space-y-2.5">
            {CATEGORIES.map((c) => (
              <li>
                <a href={`/category/${c.key}`} class="text-[13px] font-medium text-ink-soft hover:text-ink">
                  <i class={`fa-solid ${c.icon} mr-2 text-[11px]`} style={`color:${c.accent}`}></i>
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p class="text-[11px] font-bold tracking-widest text-ink-mute">SITE</p>
          <ul class="mt-4 space-y-2.5">
            <li><a href="/" class="text-[13px] font-medium text-ink-soft hover:text-ink">ホーム</a></li>
            <li><a href="/map" class="text-[13px] font-medium text-ink-soft hover:text-ink">走行マップ</a></li>
            <li><a href="/search" class="text-[13px] font-medium text-ink-soft hover:text-ink">記事検索</a></li>
            <li><a href="/about" class="text-[13px] font-medium text-ink-soft hover:text-ink">About</a></li>
            <li><a href="/admin" class="text-[13px] font-medium text-ink-mute hover:text-ink">管理画面</a></li>
          </ul>
        </div>
      </div>
      <p class="mt-10 border-t border-slate-100 pt-6 text-center text-[11px] text-ink-mute">
        © {new Date().getFullYear()} {SITE.title}. Built with Hono on Cloudflare.
      </p>
    </div>
  </footer>
)

export const CategoryChip: FC<{ cat: string; size?: 'sm' | 'md' }> = ({ cat, size = 'sm' }) => {
  const c = CATEGORY_MAP[cat]
  if (!c) return null
  return (
    <span
      class={`inline-flex items-center gap-1.5 rounded-full font-bold ${
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
      }`}
      style={`background:${c.accentSoft};color:${c.accent}`}
    >
      <i class={`fa-solid ${c.icon}`}></i>
      {c.name}
    </span>
  )
}
