import type { FC } from 'hono/jsx'
import { SITE } from '../lib/config'

export const AdminApp: FC = () => (
  <html lang="ja" class="dark">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="color-scheme" content="dark" />
      <meta name="theme-color" content="#0a0a0b" />
      <title>管理画面 | {SITE.title}</title>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%23f97316'/><text x='50' y='50' text-anchor='middle' dominant-baseline='central' font-size='52'>%F0%9F%9B%A0</text></svg>"
      />
      {/* 公開サイトと同じサブセット（アイコンの見え方を揃える） */}
      <link rel="stylesheet" href="/static/fa.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `tailwind.config={darkMode:'class',theme:{extend:{
            fontFamily:{sans:['-apple-system','BlinkMacSystemFont','SF Pro Text','Hiragino Sans','Inter','Noto Sans JP','sans-serif']},
            colors:{
              ink:{DEFAULT:'#f5f5f7',soft:'#a1a1aa',mute:'#71717a'},
              brand:'#f97316',
              blue:'#f97316',
              base:'#0a0a0b',
              panel:'#121214',
              panel2:'#18181b',
              hazy:'#18181b',
              slate:{50:'#18181b',100:'#1f1f23',200:'#27272a',300:'#3f3f46',400:'#71717a',500:'#a1a1aa',600:'#a1a1aa',700:'#ea580c',800:'#c2410c',900:'#f97316'},
              rose:{50:'#2a1015',200:'#7f1d2d',300:'#9f1239',500:'#fb7185',600:'#fb7185'},
              emerald:{50:'#0e2a20',600:'#34d399'},
              amber:{50:'#2a2010',600:'#fbbf24'}
            },
            borderRadius:{apple:'16px',big:'24px'}
          }}}`
        }}
      ></script>
      <link rel="stylesheet" href="/static/style.css" />
      <style
        dangerouslySetInnerHTML={{
          __html: `html:has(.admin-body){background:#0a0a0b}\n.admin-body .bg-white{background-color:#121214 !important}
.admin-body .bg-white\\/85{background-color:rgba(18,18,20,.85) !important}
.admin-body .border-black\\/\\[0\\.07\\]{border-color:rgba(255,255,255,.07) !important}`
        }}
      ></style>
    </head>
    <body class="admin-body bg-base text-ink antialiased">
      {/* ===== ログイン ===== */}
      <div id="login-view" class="hidden min-h-screen place-items-center px-5">
        <div class="w-full max-w-[380px] rounded-big border border-black/10 bg-panel p-9">
          <div class="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white">
            <i class="fa-solid fa-lock text-[15px]"></i>
          </div>
          <h1 class="mt-6 text-[26px] font-semibold tracking-[-0.02em]">管理画面</h1>
          <p class="mt-2 text-[13px] text-ink-soft">{SITE.title} の記事と月次データを管理します。</p>
          <form id="login-form" class="mt-7 space-y-3">
            <input
              type="password"
              id="login-password"
              placeholder="パスワード"
              autocomplete="current-password"
              class="w-full rounded-full border border-black/[0.10] bg-base px-5 py-3 text-[14px] text-ink outline-none transition placeholder:text-ink-mute focus:border-brand/60"
            />
            <p id="login-error" class="hidden text-[12px] text-rose-500"></p>
            <button class="w-full rounded-full bg-brand py-3 text-[14px] font-medium text-white transition hover:brightness-110">
              ログイン
            </button>
          </form>
          <a href="/" class="mt-5 block text-center text-[12px] text-ink-mute transition hover:text-ink">
            サイトへ戻る
          </a>
        </div>
      </div>

      {/* ===== 管理アプリ ===== */}
      <div id="app-view" class="hidden min-h-screen w-full lg:flex">
        {/* サイドバー */}
        <aside
          id="sidebar"
          class="fixed inset-y-0 left-0 z-40 w-60 -translate-x-full border-r border-black/[0.09] bg-panel transition-transform lg:static lg:translate-x-0"
        >
          <div class="flex h-14 items-center gap-2.5 border-b border-black/[0.09] px-5">
            <span class="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">
              <i class="fa-solid fa-motorcycle text-[11px]"></i>
            </span>
            <span class="text-[13px] font-semibold tracking-tight">{SITE.title} Admin</span>
          </div>
          <nav class="space-y-0.5 p-3">
            {[
              { v: 'dashboard', i: 'fa-gauge-high', l: 'ダッシュボード' },
              { v: 'posts', i: 'fa-file-lines', l: '記事管理' },
              { v: 'editor', i: 'fa-pen-to-square', l: '新規作成' },
              { v: 'stats', i: 'fa-chart-column', l: '月次データ' },
              { v: 'media', i: 'fa-images', l: 'メディア' },
              { v: 'settings', i: 'fa-shield-halved', l: '免責文' },
              { v: 'tags', i: 'fa-tags', l: 'タグ' }
            ].map((n) => (
              <button
                data-nav={n.v}
                class="nav-btn flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-[13px] text-ink-soft transition hover:bg-black/[0.05] hover:text-ink"
              >
                <i class={`fa-solid ${n.i} w-4 text-[11px]`}></i>
                {n.l}
              </button>
            ))}
            <hr class="my-3 border-black/[0.09]" />
            <a
              href="/"
              target="_blank"
              class="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-[13px] text-ink-soft transition hover:bg-black/[0.05] hover:text-ink"
            >
              <i class="fa-solid fa-arrow-up-right-from-square w-4 text-[11px]"></i>サイトを見る
            </a>
            <button
              id="logout-btn"
              class="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-[13px] text-rose-500 transition hover:bg-rose-50"
            >
              <i class="fa-solid fa-right-from-bracket w-4 text-[11px]"></i>ログアウト
            </button>
          </nav>
        </aside>
        <div id="sidebar-overlay" class="fixed inset-0 z-30 hidden bg-black/60 backdrop-blur-sm lg:hidden"></div>

        {/* メイン */}
        <div class="flex-1 lg:ml-0">
          <header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-black/[0.09] bg-base/85 px-4 backdrop-blur-xl sm:px-6">
            <button
              id="sidebar-toggle"
              class="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-black/[0.05] hover:text-ink lg:hidden"
            >
              <i class="fa-solid fa-bars text-[13px]"></i>
            </button>
            <h1 id="page-title" class="text-[15px] font-semibold tracking-[-0.01em]">ダッシュボード</h1>
            <button
              id="new-post-btn"
              class="ml-auto rounded-full bg-brand px-4 py-2 text-[13px] font-medium text-white transition hover:brightness-110"
            >
              新規記事
            </button>
          </header>
          <main id="admin-main" class="p-4 sm:p-7"></main>
        </div>
      </div>

      <div
        id="toast"
        style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
        class="pointer-events-none hidden rounded-full border border-black/10 bg-panel2 px-5 py-2.5 text-[13px] text-ink shadow-2xl backdrop-blur"
      ></div>

      <script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="/static/admin.js"></script>
    </body>
  </html>
)
