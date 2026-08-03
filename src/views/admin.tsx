import type { FC } from 'hono/jsx'
import { SITE } from '../lib/config'

export const AdminApp: FC = () => (
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="robots" content="noindex, nofollow" />
      <title>管理画面 | {SITE.title}</title>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛠️</text></svg>" />
      <link
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `tailwind.config={theme:{extend:{
            fontFamily:{sans:['-apple-system','BlinkMacSystemFont','SF Pro Text','Hiragino Sans','Inter','Noto Sans JP','sans-serif']},
            colors:{
              ink:{DEFAULT:'#1d1d1f',soft:'#6e6e73',mute:'#86868b'},
              blue:'#0071e3',
              hazy:'#f5f5f7',
              slate:{50:'#fbfbfd',100:'#f5f5f7',200:'#e3e3e6',300:'#d2d2d7',400:'#a1a1a6',500:'#86868b',600:'#6e6e73',700:'#3a3a3c',800:'#2b2b2e',900:'#1d1d1f'}
            },
            borderRadius:{apple:'18px',big:'28px'}
          }}}`
        }}
      ></script>
      <link rel="stylesheet" href="/static/style.css" />
    </head>
    <body class="admin-body bg-hazy text-ink antialiased">
      {/* ===== ログイン ===== */}
      <div id="login-view" class="hidden min-h-screen place-items-center px-5">
        <div class="w-full max-w-[380px] rounded-big bg-white p-9">
          <div class="grid h-12 w-12 place-items-center rounded-full bg-ink text-white">
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
              class="w-full rounded-full bg-hazy px-5 py-3 text-[14px] outline-none transition placeholder:text-ink-mute focus:bg-[#eeeef0]"
            />
            <p id="login-error" class="hidden text-[12px] text-rose-600"></p>
            <button class="w-full rounded-full bg-blue py-3 text-[14px] text-white transition hover:brightness-110">
              ログイン
            </button>
          </form>
          <a href="/" class="mt-5 block text-center text-[12px] text-ink-mute transition hover:text-ink">
            サイトへ戻る
          </a>
        </div>
      </div>

      {/* ===== 管理アプリ ===== */}
      <div id="app-view" class="hidden min-h-screen lg:flex">
        {/* サイドバー */}
        <aside
          id="sidebar"
          class="fixed inset-y-0 left-0 z-40 w-60 -translate-x-full border-r border-black/[0.07] bg-white transition-transform lg:static lg:translate-x-0"
        >
          <div class="flex h-14 items-center gap-2.5 border-b border-black/[0.07] px-5">
            <i class="fa-solid fa-compass text-[15px]"></i>
            <span class="text-[13px] font-semibold tracking-tight">{SITE.title} Admin</span>
          </div>
          <nav class="space-y-0.5 p-3">
            {[
              { v: 'dashboard', i: 'fa-gauge-high', l: 'ダッシュボード' },
              { v: 'posts', i: 'fa-file-lines', l: '記事管理' },
              { v: 'editor', i: 'fa-pen-to-square', l: '新規作成' },
              { v: 'stats', i: 'fa-chart-column', l: '月次データ' }
            ].map((n) => (
              <button
                data-nav={n.v}
                class="nav-btn flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-[13px] text-ink-soft transition hover:bg-hazy"
              >
                <i class={`fa-solid ${n.i} w-4 text-[11px]`}></i>
                {n.l}
              </button>
            ))}
            <hr class="my-3 border-black/[0.07]" />
            <a
              href="/"
              target="_blank"
              class="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-[13px] text-ink-soft transition hover:bg-hazy"
            >
              <i class="fa-solid fa-arrow-up-right-from-square w-4 text-[11px]"></i>サイトを見る
            </a>
            <button
              id="logout-btn"
              class="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-[13px] text-rose-600 transition hover:bg-rose-50"
            >
              <i class="fa-solid fa-right-from-bracket w-4 text-[11px]"></i>ログアウト
            </button>
          </nav>
        </aside>
        <div id="sidebar-overlay" class="fixed inset-0 z-30 hidden bg-black/30 backdrop-blur-sm lg:hidden"></div>

        {/* メイン */}
        <div class="flex-1 lg:ml-0">
          <header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-black/[0.07] bg-white/85 px-4 backdrop-blur-xl sm:px-6">
            <button id="sidebar-toggle" class="grid h-9 w-9 place-items-center rounded-full hover:bg-hazy lg:hidden">
              <i class="fa-solid fa-bars text-[13px]"></i>
            </button>
            <h1 id="page-title" class="text-[15px] font-semibold tracking-[-0.01em]">ダッシュボード</h1>
            <button
              id="new-post-btn"
              class="ml-auto rounded-full bg-blue px-4 py-2 text-[13px] text-white transition hover:brightness-110"
            >
              新規記事
            </button>
          </header>
          <main id="admin-main" class="p-4 sm:p-7"></main>
        </div>
      </div>

      <div
        id="toast"
        class="pointer-events-none fixed bottom-6 left-1/2 z-[60] hidden -translate-x-1/2 rounded-full bg-black/85 px-5 py-2.5 text-[13px] text-white backdrop-blur"
      ></div>

      <script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="/static/admin.js"></script>
    </body>
  </html>
)
