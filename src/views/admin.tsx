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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `tailwind.config={theme:{extend:{fontFamily:{sans:['Inter','Noto Sans JP','system-ui','sans-serif']},
          colors:{ink:{DEFAULT:'#0f172a',soft:'#475569',mute:'#94a3b8'}}}}}`
        }}
      ></script>
      <link rel="stylesheet" href="/static/style.css" />
    </head>
    <body class="bg-slate-100 text-ink antialiased">
      {/* ===== ログイン ===== */}
      <div id="login-view" class="hidden min-h-screen place-items-center px-4">
        <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-xl">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h1 class="mt-5 text-xl font-extrabold tracking-tight">管理画面ログイン</h1>
          <p class="mt-1.5 text-[12.5px] text-ink-soft">{SITE.title} の記事を管理します。</p>
          <form id="login-form" class="mt-6 space-y-3">
            <input
              type="password"
              id="login-password"
              placeholder="パスワード"
              autocomplete="current-password"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-slate-500"
            />
            <p id="login-error" class="hidden text-xs font-bold text-rose-600"></p>
            <button class="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
              ログイン
            </button>
          </form>
          <a href="/" class="mt-4 block text-center text-[11px] font-semibold text-ink-mute hover:text-ink">
            ← サイトへ戻る
          </a>
        </div>
      </div>

      {/* ===== 管理アプリ ===== */}
      <div id="app-view" class="hidden min-h-screen lg:flex">
        {/* サイドバー */}
        <aside
          id="sidebar"
          class="fixed inset-y-0 left-0 z-40 w-60 -translate-x-full border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0"
        >
          <div class="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
            <span class="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
              <i class="fa-solid fa-compass text-sm"></i>
            </span>
            <span class="text-[14px] font-extrabold">Admin</span>
          </div>
          <nav class="space-y-1 p-3">
            {[
              { v: 'dashboard', i: 'fa-gauge-high', l: 'ダッシュボード' },
              { v: 'posts', i: 'fa-file-lines', l: '記事管理' },
              { v: 'editor', i: 'fa-pen-to-square', l: '新規作成' },
              { v: 'stats', i: 'fa-chart-column', l: '月次データ' }
            ].map((n) => (
              <button
                data-nav={n.v}
                class="nav-btn flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-ink-soft transition hover:bg-slate-100"
              >
                <i class={`fa-solid ${n.i} w-4 text-xs`}></i>
                {n.l}
              </button>
            ))}
            <hr class="my-3 border-slate-100" />
            <a
              href="/"
              target="_blank"
              class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-ink-soft transition hover:bg-slate-100"
            >
              <i class="fa-solid fa-arrow-up-right-from-square w-4 text-xs"></i>サイトを見る
            </a>
            <button
              id="logout-btn"
              class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <i class="fa-solid fa-right-from-bracket w-4 text-xs"></i>ログアウト
            </button>
          </nav>
        </aside>
        <div id="sidebar-overlay" class="fixed inset-0 z-30 hidden bg-slate-900/40 lg:hidden"></div>

        {/* メイン */}
        <div class="flex-1 lg:ml-0">
          <header class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
            <button id="sidebar-toggle" class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 lg:hidden">
              <i class="fa-solid fa-bars text-xs"></i>
            </button>
            <h1 id="page-title" class="text-[15px] font-extrabold">ダッシュボード</h1>
            <button
              id="new-post-btn"
              class="ml-auto rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
            >
              <i class="fa-solid fa-plus mr-1.5"></i>新規記事
            </button>
          </header>
          <main id="admin-main" class="p-4 sm:p-6"></main>
        </div>
      </div>

      <div
        id="toast"
        class="pointer-events-none fixed bottom-5 left-1/2 z-[60] hidden -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-bold text-white shadow-xl"
      ></div>

      <script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="/static/admin.js"></script>
    </body>
  </html>
)
