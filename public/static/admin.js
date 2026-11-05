/* ================== 管理画面 ================== */
(function () {
  'use strict'

  /** 本文で使える数値ショートコード（src/lib/utils.ts の SHORTCODES と対応） */
  const SHORTCODES = [
    { code: 'total_assets', label: '総資産（現金＋NISA＋iDeCo）' },
    { code: 'cash', label: '現金・預金' },
    { code: 'nisa', label: 'NISA評価額' },
    { code: 'ideco', label: 'iDeCo評価額' },
    { code: 'living_cost', label: '直近の生活費' },
    { code: 'diff', label: '総資産の前月比（±付き）' },
    { code: 'updated', label: 'データの更新月（例: 2026年7月）' }
  ]

  /* 公開サイトと同じ3テーマ構成。色はアクセント1色に統一 */
  const CATS = [
    { key: 'asset', name: '資産運用', theme: 'Money', color: '#f97316', icon: 'fa-chart-line' },
    { key: 'life', name: '生活費', theme: 'Money', color: '#f97316', icon: 'fa-receipt' },
    { key: 'touring', name: 'ツーリング記録', theme: 'Touring', color: '#f97316', icon: 'fa-motorcycle' },
    { key: 'camp', name: 'キャンプ場', theme: 'Touring', color: '#f97316', icon: 'fa-campground' },
    { key: 'supermarket', name: 'ご当地スーパー', theme: 'Touring', color: '#f97316', icon: 'fa-basket-shopping' },
    { key: 'it', name: '業務効率化', theme: 'Tech', color: '#f97316', icon: 'fa-gears' }
  ]
  const catOf = (k) => CATS.find((c) => c.key === k) || CATS[0]

  const $ = (s) => document.querySelector(s)
  const main = () => $('#admin-main')
  const state = { view: 'dashboard', posts: [], editing: null, stats: [], filter: { category: '', status: '', q: '' } }
  let mapPicker = null

  /* ---------- utils ---------- */
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m])
  const yen = (n) => (n == null || n === '' ? '—' : '¥' + Number(n).toLocaleString('ja-JP'))
  const today = () => new Date().toISOString().slice(0, 10)

  function toast(msg, type) {
    const el = $('#toast')
    el.textContent = msg
    el.style.background = type === 'error' ? '#e11d48' : '#0f172a'
    el.classList.remove('hidden')
    clearTimeout(el._t)
    el._t = setTimeout(() => el.classList.add('hidden'), 2400)
  }

  async function api(path, opts = {}) {
    const res = await fetch('/api' + path, {
      headers: opts.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      ...opts
    })
    if (res.status === 401 && !path.includes('login')) {
      showLogin()
      throw new Error('unauthorized')
    }
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error || 'エラーが発生しました')
    return json
  }

  /* ---------- 認証 ---------- */
  function showLogin() {
    $('#login-view').classList.remove('hidden')
    $('#login-view').classList.add('grid')
    $('#app-view').classList.add('hidden')
  }
  function showApp() {
    $('#login-view').classList.add('hidden')
    $('#login-view').classList.remove('grid')
    $('#app-view').classList.remove('hidden')
    navigate(location.hash.replace('#', '') || 'dashboard')
  }

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const err = $('#login-error')
    err.classList.add('hidden')
    try {
      await api('/admin/login', { method: 'POST', body: JSON.stringify({ password: $('#login-password').value }) })
      showApp()
    } catch (e) {
      err.textContent = e.message
      err.classList.remove('hidden')
    }
  })

  $('#logout-btn').addEventListener('click', async () => {
    await api('/admin/logout', { method: 'POST' })
    location.reload()
  })

  /* ---------- ナビゲーション ---------- */
  const TITLES = { dashboard: 'ダッシュボード', posts: '記事管理', editor: '記事エディタ', stats: '月次データ', media: 'メディア' }

  function navigate(view) {
    state.view = view
    location.hash = view
    $('#page-title').textContent = TITLES[view] || ''
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.nav === view))
    closeSidebar()
    if (view === 'dashboard') renderDashboard()
    else if (view === 'posts') renderPosts()
    else if (view === 'editor') renderEditor(state.editing)
    else if (view === 'stats') renderStats()
    else if (view === 'media') renderMedia()
  }

  document.querySelectorAll('.nav-btn').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.nav === 'editor') state.editing = null
      navigate(b.dataset.nav)
    })
  )
  $('#new-post-btn').addEventListener('click', () => {
    state.editing = null
    navigate('editor')
  })
  $('#sidebar-toggle').addEventListener('click', () => {
    $('#sidebar').classList.remove('-translate-x-full')
    $('#sidebar-overlay').classList.remove('hidden')
  })
  $('#sidebar-overlay').addEventListener('click', closeSidebar)
  function closeSidebar() {
    if (window.innerWidth < 1024) {
      $('#sidebar').classList.add('-translate-x-full')
      $('#sidebar-overlay').classList.add('hidden')
    }
  }

  /* ================= ダッシュボード ================= */
  async function renderDashboard() {
    main().innerHTML = '<p class="text-sm text-ink-mute">読み込み中...</p>'
    const [sum, list] = await Promise.all([api('/admin/summary'), api('/admin/posts?limit=6')])
    state.posts = list.posts
    main().innerHTML = `
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        ${card('公開記事', sum.published, 'fa-circle-check', '#10b981')}
        ${card('下書き', sum.draft, 'fa-pen', '#f59e0b')}
        ${card('タグ', sum.tags, 'fa-tags', '#8b5cf6')}
        ${card('月次データ', sum.months + ' ヶ月', 'fa-chart-column', '#0ea5e9')}
      </div>
      <div class="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-extrabold">最近の記事</h2>
            <button class="text-[11px] font-bold text-ink-mute hover:text-ink" data-goto="posts">すべて見る →</button>
          </div>
          <div class="mt-4 space-y-2">
            ${
              list.posts.length
                ? list.posts
                    .map(
                      (p) => `
              <button data-edit="${p.id}" class="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition hover:border-slate-300">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style="background:${catOf(p.category).color}18;color:${catOf(p.category).color}">
                  <i class="fa-solid ${catOf(p.category).icon} text-xs"></i>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-[13px] font-bold">${esc(p.title)}</span>
                  <span class="block text-[11px] text-ink-mute">${catOf(p.category).name} ・ ${p.published_at || '未公開'}</span>
                </span>
                ${statusBadge(p.status)}
              </button>`
                    )
                    .join('')
                : '<p class="text-xs text-ink-mute">記事がありません</p>'
            }
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 class="text-sm font-extrabold">カテゴリ別</h2>
          <div class="mt-4 space-y-2.5">
            ${CATS.map((c) => {
              const n = sum.counts[c.key] || 0
              const max = Math.max(1, ...Object.values(sum.counts))
              return `<div>
                <div class="flex items-center justify-between text-[11.5px] font-bold">
                  <span><i class="fa-solid ${c.icon} mr-1.5" style="color:${c.color}"></i>${c.name}</span>
                  <span class="text-ink-mute">${n}</span>
                </div>
                <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div class="h-full rounded-full" style="width:${(n / max) * 100}%;background:${c.color}"></div>
                </div>
              </div>`
            }).join('')}
          </div>
          <button data-goto="editor" class="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-700">
            <i class="fa-solid fa-plus mr-1.5"></i>新しい記事を書く
          </button>
        </div>
      </div>`
    bindCommon()
  }

  const card = (label, value, icon, color) => `
    <div class="rounded-2xl border border-slate-200 bg-white p-4">
      <p class="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-ink-mute">
        <i class="fa-solid ${icon}" style="color:${color}"></i>${label}
      </p>
      <p class="mt-1.5 text-2xl font-black tracking-tight">${value}</p>
    </div>`

  const statusBadge = (s) =>
    s === 'published'
      ? '<span class="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600">公開</span>'
      : '<span class="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-600">下書き</span>'

  async function renderMedia() {
    main().innerHTML = '<p class="text-sm text-ink-mute">読み込み中...</p>'
    const r = await api('/admin/media')
    if (!r.ok) { main().innerHTML = '<p class="text-sm text-ink-mute">' + esc(r.error || '取得に失敗したにゃ') + '</p>'; return }
    if (!r.count) { main().innerHTML = '<p class="text-sm text-ink-mute">画像がまだありません。</p>'; return }
    main().innerHTML = `
      <p class="text-sm text-ink-mute mb-4">${r.count} 件</p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${r.items.map((it) => `
          <div class="rounded-big border border-edge2 bg-panel overflow-hidden">
            <img src="${esc(it.path)}" alt="" class="w-full h-40 object-cover bg-black/30" loading="lazy" />
            <div class="p-3 space-y-2">
              <p class="text-[12px] break-all">${esc(it.path)}</p>
              <p class="text-[11px] text-ink-mute">${new Date(it.uploaded).toLocaleString('ja-JP')} / ${Math.round(it.size / 1024)} KB</p>
              <div class="flex gap-2">
                <button class="media-copy text-[11px] px-2.5 py-1 rounded-full border border-white/[0.12] text-ink-soft hover:bg-white/[0.07] transition" data-kind="path" data-path="${esc(it.path)}">パス</button>
                <button class="media-copy text-[11px] px-2.5 py-1 rounded-full border border-white/[0.12] text-ink-soft hover:bg-white/[0.07] transition" data-kind="tag" data-path="${esc(it.path)}">HTMLタグ</button>
                <button class="media-del text-[11px] px-2.5 py-1 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 transition ml-auto" data-key="${esc(it.key)}">削除</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`
    document.querySelectorAll('.media-copy').forEach((b) =>
      b.addEventListener('click', async () => {
        const p = b.dataset.path
        const text = b.dataset.kind === 'tag'
          ? `<p><a href="${p}"><img src="${p}" alt="" style="width:280px;border-radius:10px;"></a></p>`
          : p
        try { await navigator.clipboard.writeText(text) } catch (e) { return }
        const old = b.textContent
        b.textContent = 'コピーしたにゃ'
        setTimeout(() => { b.textContent = old }, 1200)
      })
    )
    document.querySelectorAll('.media-del').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm('この画像を削除しますか？記事で使っていると表示が消えます。')) return
        const r2 = await api('/admin/media?key=' + encodeURIComponent(b.dataset.key), { method: 'DELETE' })
        if (r2 && r2.ok) renderMedia()
        else alert('削除できませんでした')
      })
    )
  }

  /* ================= 記事一覧 ================= */
  async function renderPosts() {
    main().innerHTML = '<p class="text-sm text-ink-mute">読み込み中...</p>'
    const f = state.filter
    const qs = new URLSearchParams()
    if (f.category) qs.set('category', f.category)
    if (f.q) qs.set('q', f.q)
    if (f.status) qs.set('status', f.status)
    const { posts } = await api('/admin/posts?' + qs.toString())
    state.posts = posts
    main().innerHTML = `
      <div class="rounded-2xl border border-slate-200 bg-white">
        <div class="flex flex-wrap gap-2 border-b border-slate-100 p-4">
          <input id="f-q" value="${esc(f.q)}" placeholder="タイトル・本文で検索" class="admin-input flex-1 min-w-[180px]" />
          <select id="f-cat" class="admin-input w-auto">
            <option value="">全カテゴリ</option>
            ${CATS.map((c) => `<option value="${c.key}" ${f.category === c.key ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
          <select id="f-status" class="admin-input w-auto">
            <option value="">全ステータス</option>
            <option value="published" ${f.status === 'published' ? 'selected' : ''}>公開</option>
            <option value="draft" ${f.status === 'draft' ? 'selected' : ''}>下書き</option>
          </select>
        </div>
        <div class="divide-y divide-slate-100">
          ${
            posts.length
              ? posts
                  .map(
                    (p) => `
            <div class="flex flex-wrap items-center gap-3 p-4">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style="background:${catOf(p.category).color}18;color:${catOf(p.category).color}">
                <i class="fa-solid ${catOf(p.category).icon} text-sm"></i>
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-[13.5px] font-bold">${esc(p.title)}</p>
                <p class="mt-0.5 text-[11px] text-ink-mute">
                  ${catOf(p.category).name} ・ ${p.published_at || '日付なし'} ・ /${esc(p.slug)}
                  ${(p.tags || []).length ? ' ・ ' + p.tags.map((t) => '#' + esc(t)).join(' ') : ''}
                </p>
              </div>
              ${statusBadge(p.status)}
              <div class="flex gap-1.5">
                <a href="/posts/${encodeURIComponent(p.slug)}" target="_blank" class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-ink-soft hover:border-slate-300" title="表示">
                  <i class="fa-solid fa-eye text-xs"></i>
                </a>
                <button data-edit="${p.id}" class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-ink-soft hover:border-slate-300" title="編集">
                  <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button data-del="${p.id}" class="grid h-9 w-9 place-items-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50" title="削除">
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>`
                  )
                  .join('')
              : '<p class="p-8 text-center text-sm text-ink-mute">記事がありません</p>'
          }
        </div>
      </div>`
    $('#f-q').addEventListener('input', debounce((e) => {
      state.filter.q = e.target.value
      renderPosts()
    }, 400))
    $('#f-cat').addEventListener('change', (e) => {
      state.filter.category = e.target.value
      renderPosts()
    })
    $('#f-status').addEventListener('change', (e) => {
      state.filter.status = e.target.value
      renderPosts()
    })
    bindCommon()
  }

  function debounce(fn, ms) {
    let t
    return (...a) => {
      clearTimeout(t)
      t = setTimeout(() => fn(...a), ms)
    }
  }

  function bindCommon() {
    main().querySelectorAll('[data-edit]').forEach((b) =>
      b.addEventListener('click', async () => {
        const { post } = await api('/admin/posts/' + b.dataset.edit)
        state.editing = post
        navigate('editor')
      })
    )
    main().querySelectorAll('[data-del]').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm('この記事を削除しますか？')) return
        await api('/admin/posts/' + b.dataset.del, { method: 'DELETE' })
        toast('削除しました')
        renderPosts()
      })
    )
    main().querySelectorAll('[data-goto]').forEach((b) =>
      b.addEventListener('click', () => {
        if (b.dataset.goto === 'editor') state.editing = null
        navigate(b.dataset.goto)
      })
    )
  }

  /* ================= エディタ ================= */
  function field(label, name, value, opts = {}) {
    const t = opts.type || 'text'
    return `<div class="${opts.cls || ''}">
      <label class="admin-label">${label}</label>
      <input type="${t}" name="${name}" value="${esc(value ?? '')}" placeholder="${opts.ph || ''}" class="admin-input" ${opts.attr || ''} />
      ${opts.hint ? `<p class="mt-1 text-[10.5px] text-ink-mute">${opts.hint}</p>` : ''}
    </div>`
  }

  function renderEditor(post) {
    const p = post || { category: 'touring', status: 'draft', published_at: today(), tags: [], photos: [] }
    const isNew = !post
    main().innerHTML = `
      <form id="post-form" class="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            <label class="admin-label">タイトル</label>
            <input name="title" value="${esc(p.title)}" placeholder="記事タイトル" class="admin-input !text-base !font-bold" required />
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              ${field('スラッグ (URL)', 'slug', p.slug, { ph: '空欄なら自動生成', hint: '/posts/xxxx の xxxx 部分' })}
              <div>
                <label class="admin-label">カテゴリ</label>
                <select name="category" id="cat-select" class="admin-input">
                  ${CATS.map((c) => `<option value="${c.key}" ${p.category === c.key ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="mt-3">
              <label class="admin-label">リード文 / 概要</label>
              <textarea name="summary" rows="2" class="admin-input !font-sans" placeholder="一覧カードやSNSに表示される要約">${esc(p.summary)}</textarea>
            </div>
          </div>

          <div id="cat-fields"></div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <label class="admin-label !mb-0">本文 (Markdown)</label>
              <div class="flex gap-1.5">
                <label class="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-ink-soft hover:border-slate-300" title="画像を本文に挿入">
                  <i class="fa-solid fa-image mr-1"></i>画像挿入
                  <input type="file" accept="image/*" class="hidden" id="md-upload" />
                </label>
                <button type="button" id="md-write" class="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white">編集</button>
                <button type="button" id="md-prev" class="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-ink-soft">プレビュー</button>
              </div>
            </div>
            <div class="mt-2 flex flex-wrap gap-1.5">
              ${['## 見出し', '### 小見出し', '**太字**', '- リスト', '> 引用', '| 表 |', '![画像](URL)', '[リンク](URL)']
                .map((t) => `<button type="button" data-insert="${esc(t)}" class="rounded-md bg-slate-100 px-2 py-1 text-[10.5px] font-bold text-ink-soft hover:bg-slate-200">${esc(t)}</button>`)
                .join('')}
            </div>
            <!-- ショートコード：クリックで本文に挿入 -->
            <div class="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-[11px] font-extrabold text-ink-soft">
                <i class="fa-solid fa-wand-magic-sparkles mr-1"></i>数値のショートコード
              </p>
              <p class="mt-1 text-[10.5px] leading-relaxed text-ink-mute">
                クリックで挿入。表示時に<strong>月次データの最新値</strong>へ自動で置き換わるので、
                金額を直書きする必要がありません（記事を書き直さなくてもトップの数字と一致します）。
              </p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                ${SHORTCODES.map(
                  (s) =>
                    `<button type="button" data-insert="{{${s.code}}}" title="${esc(s.label)}"
                       class="rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-[10.5px] font-bold text-slate-700 hover:border-brand hover:text-brand">{{${s.code}}}</button>`
                ).join('')}
              </div>
            </div>
            <textarea name="body" id="md-input" rows="20" class="admin-input mt-2" placeholder="Markdownで記述できます">${esc(p.body)}</textarea>
            <div id="md-output" class="md-preview mt-2 hidden min-h-[300px] rounded-xl border border-slate-200 bg-white p-4"></div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <label class="admin-label !mb-0">フォトギャラリー</label>
              <button type="button" id="add-photo" class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-ink-soft hover:border-slate-300">
                <i class="fa-solid fa-plus mr-1"></i>写真を追加
              </button>
            </div>
            <div id="photo-list" class="mt-3 space-y-2"></div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            <label class="admin-label">公開設定</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-2.5 text-[12px] font-bold has-[:checked]:border-slate-900 has-[:checked]:bg-slate-900 has-[:checked]:text-white">
                <input type="radio" name="status" value="draft" class="hidden" ${p.status !== 'published' ? 'checked' : ''} />下書き
              </label>
              <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-2.5 text-[12px] font-bold has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-600 has-[:checked]:text-white">
                <input type="radio" name="status" value="published" class="hidden" ${p.status === 'published' ? 'checked' : ''} />公開
              </label>
            </div>
            <div class="mt-3">${field('公開日', 'published_at', p.published_at || today(), { type: 'date' })}</div>
            <label class="mt-3 flex items-center gap-2 text-[12px] font-bold text-ink-soft">
              <input type="checkbox" name="featured" ${p.featured ? 'checked' : ''} class="h-4 w-4 rounded" />
              注目記事にする
            </label>
            <div class="mt-4 flex gap-2">
              <button type="submit" class="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-700">
                <i class="fa-solid fa-floppy-disk mr-1.5"></i>${isNew ? '作成する' : '保存する'}
              </button>
              ${!isNew ? `<a href="/posts/${encodeURIComponent(p.slug || '')}" target="_blank" class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-ink-soft"><i class="fa-solid fa-eye text-xs"></i></a>` : ''}
            </div>
            ${!isNew ? `<button type="button" data-del="${p.id}" class="mt-2 w-full rounded-xl border border-rose-200 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><i class="fa-solid fa-trash mr-1.5"></i>削除</button>` : ''}
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            ${field('カバー画像URL', 'cover_image', p.cover_image, { ph: 'https://... または端末から選択', hint: '外部URL / アップロード画像（/media/…）どちらでも可' })}
            <label class="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-[11.5px] font-bold text-ink-soft hover:border-slate-400">
              <i class="fa-solid fa-cloud-arrow-up"></i>端末から画像をアップロード
              <input type="file" accept="image/*" class="hidden" id="cover-upload" />
            </label>
            <div id="cover-preview" class="mt-2"></div>
            <div class="mt-3">
              <label class="admin-label">タグ（カンマ区切り）</label>
              <input name="tags" value="${esc((p.tags || []).join(', '))}" placeholder="NISA, 積立, 振り返り" class="admin-input" />
            </div>
          </div>
        </div>
      </form>`

    renderCatFields(p)
    renderPhotos(p.photos || [])
    if ($('#spot-list')) renderSpots(p.spots || [])
    if ($('#spot-add')) $('#spot-add').addEventListener('click', () => renderSpots(currentSpots().concat([{ name: '', lat: '', lng: '', note: '' }])))
    $('#cat-select').addEventListener('change', (e) => {
      renderCatFields({ ...collect(), category: e.target.value })
    })

    // Markdown プレビュー
    $('#md-prev').addEventListener('click', () => {
      $('#md-output').innerHTML = marked.parse($('#md-input').value || '')
      $('#md-output').classList.remove('hidden')
      $('#md-input').classList.add('hidden')
      $('#md-prev').className = 'rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white'
      $('#md-write').className = 'rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-ink-soft'
    })
    $('#md-write').addEventListener('click', () => {
      $('#md-output').classList.add('hidden')
      $('#md-input').classList.remove('hidden')
      $('#md-write').className = 'rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white'
      $('#md-prev').className = 'rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-ink-soft'
    })
    main().querySelectorAll('[data-insert]').forEach((b) =>
      b.addEventListener('click', () => {
        const ta = $('#md-input')
        const pos = ta.selectionStart
        const raw = b.dataset.insert
        // ショートコードは文中に差し込むので改行を付けない
        const text = raw.startsWith('{{') ? raw : raw + '\n'
        ta.value = ta.value.slice(0, pos) + text + ta.value.slice(pos)
        ta.focus()
        ta.selectionStart = ta.selectionEnd = pos + text.length
      })
    )
    // 本文への画像挿入
    const mdUp = document.getElementById('md-upload')
    if (mdUp) {
      mdUp.addEventListener('change', async () => {
        const file = mdUp.files && mdUp.files[0]
        if (!file) return
        const url = await uploadImage(file)
        if (!url) return
        const ta = $('#md-input')
        const pos = ta.selectionStart
        const text = `\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n`
        ta.value = ta.value.slice(0, pos) + text + ta.value.slice(pos)
        ta.focus()
        ta.selectionStart = ta.selectionEnd = pos + text.length
        mdUp.value = ''
      })
    }
    $('#add-photo').addEventListener('click', () => {
      const cur = currentPhotos()
      cur.push({ url: '', caption: '' })
      renderPhotos(cur)
    })
    const coverInput = main().querySelector('[name="cover_image"]')
    const updateCover = () => {
      $('#cover-preview').innerHTML = coverInput.value
        ? `<img src="${esc(coverInput.value)}" class="h-32 w-full rounded-xl border border-slate-200 object-cover" />`
        : ''
    }
    coverInput.addEventListener('input', updateCover)
    updateCover()
    const coverUp = document.getElementById('cover-upload')
    if (coverUp) {
      coverUp.addEventListener('change', async () => {
        const file = coverUp.files && coverUp.files[0]
        if (!file) return
        const url = await uploadImage(file)
        if (!url) return
        coverInput.value = url
        updateCover()
      })
    }

    main().querySelectorAll('[data-del]').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm('この記事を削除しますか？')) return
        await api('/admin/posts/' + b.dataset.del, { method: 'DELETE' })
        toast('削除しました')
        state.editing = null
        navigate('posts')
      })
    )

    $('#post-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      const data = collect()
      if (!data.title) return toast('タイトルを入力してください', 'error')
      try {
        if (post) {
          await api('/admin/posts/' + post.id, { method: 'PUT', body: JSON.stringify(data) })
          toast('保存しました')
        } else {
          const r = await api('/admin/posts', { method: 'POST', body: JSON.stringify(data) })
          const { post: created } = await api('/admin/posts/' + r.id)
          state.editing = created
          toast('作成しました')
          navigate('editor')
        }
      } catch (err) {
        toast(err.message, 'error')
      }
    })
  }

  /* カテゴリ別の入力欄 */
  function renderCatFields(p) {
    const c = p.category
    let inner = ''
    if (c === 'touring' || c === 'camp' || c === 'supermarket') {
      inner = `
        <div class="grid gap-3 sm:grid-cols-2">
          ${field(c === 'touring' ? 'スポット名' : c === 'camp' ? 'キャンプ場名' : '店舗名', 'place_name', p.place_name, { ph: c === 'touring' ? '例: 美ヶ原高原' : '例: スーパーいちば 高知店' })}
          ${field('都道府県', 'prefecture', p.prefecture, { ph: '例: 長野県' })}
        </div>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          ${field('エリア', 'area', p.area, { ph: '例: 東北', hint: '詳細ページで「東北 / 福島県」と表示' })}
          ${field('ジャンル', 'genre', p.genre, {
            ph: c === 'touring' ? '例: 峠・ワインディング' : c === 'camp' ? '例: フリーサイト（砂地・土・芝）' : '例: 郊外型スーパー',
            hint: '記事上部と DATA カードに表示'
          })}
        </div>
        ${
          c === 'touring'
            ? `<div class="mt-3 grid gap-3 sm:grid-cols-4">
                ${field('走行距離(km)', 'distance_km', p.distance_km, { type: 'number', attr: 'step="0.1"' })}
                ${field('所要時間', 'duration_text', p.duration_text, { ph: '例: 8時間' })}
                ${field('天気', 'weather', p.weather, { ph: '例: 晴れ' })}
                ${field('車両', 'bike', p.bike, { ph: '例: CB400SF' })}
              </div>
              <div class="mt-3">
                <label class="admin-label">ルート</label>
                <input name="route_text" value="${esc(p.route_text)}" placeholder="例: 福島市 → 高湯温泉 → 浄土平 → 土湯峠" class="admin-input" />
              </div>
              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                ${field('ベストシーズン', 'best_season', p.best_season, { ph: '例: 5月〜10月（紅葉は10月上旬）' })}
                ${field('訪問日', 'visit_date', p.visit_date, { type: 'date' })}
              </div>
              <div class="mt-3">
                <label class="admin-label">路面・注意事項</label>
                <textarea name="road_note" rows="2" class="admin-input !font-sans" placeholder="例: 冬季通行止め（11月中旬〜4月上旬）。夜間通行止めの時間帯あり。">${esc(p.road_note)}</textarea>
                <p class="mt-1 text-[10.5px] text-ink-mute">本文下に注意ボックスとして表示されます</p>
              </div>`
            : `<div class="mt-3 grid gap-3 sm:grid-cols-4">
                <div>
                  <label class="admin-label">総合評価</label>
                  <select name="rating" class="admin-input">${starOpts(p.rating)}</select>
                </div>
                <div>
                  <label class="admin-label">コスパ</label>
                  <select name="cospa" class="admin-input">${starOpts(p.cospa)}</select>
                </div>
                ${field(c === 'camp' ? '料金' : '会計金額（円）', 'budget', p.budget, { type: 'number' })}
                ${field('訪問日', 'visit_date', p.visit_date, { type: 'date' })}
              </div>
              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                ${field('住所', 'address', p.address, { ph: '例: 高知県高知市...' })}
                ${field(c === 'camp' ? '開設期間' : '営業時間', 'business_hours', p.business_hours, { ph: c === 'camp' ? '例: 通年（冬期は要確認）' : '例: 9:00-21:00' })}
              </div>
              <div class="mt-3">
                ${field('アクセス', 'access_text', p.access_text, { ph: '例: 常磐道いわき湯本ICから10分' })}
              </div>
              <div class="mt-3">
                <label class="admin-label">${c === 'camp' ? '設備メモ' : '推し買い'}</label>
                <textarea name="recommend_items" rows="3" class="admin-input !font-sans" placeholder="${c === 'camp' ? '炊事場なし（立水栓あり）&#10;水洗トイレ&#10;直火不可' : '手むすびおにぎり&#10;常磐ものの刺身&#10;メヒカリの唐揚げ'}">${esc(p.recommend_items)}</textarea>
                <p class="mt-1 text-[10.5px] text-ink-mute">改行 または「/」区切り。DATAカード内にオレンジのボックスで表示されます</p>
              </div>`
        }
        <div class="mt-3">
          <label class="admin-label">${c === 'touring' ? '寄ったご当地スーパーの記事' : '関連するツーリング記事'}</label>
          <select name="linked_slug" id="linked-select" class="admin-input">
            <option value="">— 紐付けなし —</option>
          </select>
          <p class="mt-1 text-[10.5px] text-ink-mute">
            紐付けると、記事下部に「${c === 'touring' ? 'このツーリングで寄った店' : 'この店に寄ったツーリング'}」カードが表示され、相互リンクになります
          </p>
        </div>
        <div class="mt-4">
          <label class="admin-label">位置情報（地図をクリックしてピンを設定）</label>
          <div class="flex flex-wrap gap-2">
            <input id="geo-q" placeholder="地名・住所で検索" class="admin-input flex-1 min-w-[160px]" />
            <button type="button" id="geo-btn" class="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white">検索</button>
          </div>
          <div id="map-pick" class="mt-2 h-56 w-full overflow-hidden rounded-xl border border-slate-200"></div>
          <div class="mt-2 grid grid-cols-2 gap-3">
            ${field('緯度', 'lat', p.lat, { type: 'number', attr: 'step="any"' })}
            ${field('経度', 'lng', p.lng, { type: 'number', attr: 'step="any"' })}
          </div>
            <div class="mt-4">
              <label class="admin-label">立ち寄りスポット（番号順に地図へ表示されます）</label>
              <div id="spot-list" class="space-y-2"></div>
              <button type="button" id="spot-add" class="mt-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-ink-soft hover:border-slate-300">
                <i class="fa-solid fa-plus mr-1.5"></i>スポットを追加
              </button>
              <p class="mt-1 text-[10.5px] text-ink-mute">
                2件以上でピンが番号付きになり、点線でつながります。上の地図をクリックすると空いている緯度・経度に入ります
              </p>
            </div>              
          </div>`
    } else if (c === 'asset' || c === 'life') {
      inner = `
        <p class="mb-3 text-[11.5px] text-ink-soft">記事上部に大きく表示される数値ハイライトです（任意）。</p>
        <div class="grid gap-3 sm:grid-cols-3">
          ${field('ラベル', 'highlight_label', p.highlight_label, { ph: c === 'asset' ? '例: 総資産' : '例: 今月の生活費' })}
          ${field('数値', 'highlight_value', p.highlight_value, { ph: c === 'asset' ? '例: 12,340,000円' : '例: 168,000円' })}
          ${field('補足', 'highlight_sub', p.highlight_sub, { ph: '例: 前月比 +120,000円' })}
        </div>
        <p class="mt-3 rounded-xl bg-slate-50 p-3 text-[11.5px] text-ink-soft">
          <i class="fa-solid fa-circle-info mr-1"></i>グラフの元データは「月次データ」画面から登録してください。
        </p>`
    } else {
      inner = `<p class="text-[11.5px] text-ink-soft">IT / 生成AI カテゴリは追加項目なし。タグを活用して整理しましょう。</p>`
    }
    $('#cat-fields').innerHTML = `<div class="rounded-2xl border border-slate-200 bg-white p-5">
      <p class="mb-3 text-[11px] font-black tracking-widest" style="color:${catOf(c).color}">
        <i class="fa-solid ${catOf(c).icon} mr-1.5"></i>${catOf(c).name} の項目
      </p>${inner}</div>`

    if (c === 'touring' || c === 'camp' || c === 'supermarket') {
      initMapPicker(p)
      fillLinkedOptions(c, p.linked_slug)
    }
  }

  /** 相互リンク候補（ツーリング ⇄ ご当地スーパー）をセレクトに流し込む */
  async function fillLinkedOptions(cat, current) {
    const sel = document.getElementById('linked-select')
    if (!sel) return
    const target = cat === 'touring' ? 'supermarket' : 'touring'
    try {
      const { posts } = await api('/admin/posts?category=' + target + '&limit=100')
      sel.innerHTML =
        '<option value="">— 紐付けなし —</option>' +
        (posts || [])
          .map(
            (x) =>
              `<option value="${esc(x.slug)}" ${current === x.slug ? 'selected' : ''}>${esc(
                x.place_name || x.title
              )}${x.prefecture ? '（' + esc(x.prefecture) + '）' : ''}</option>`
          )
          .join('')
    } catch (e) {
      /* 失敗時は「紐付けなし」のみ */
    }
  }

  const starOpts = (v) =>
    ['', 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
      .map((n) => {
        const label =
          n === ''
            ? '未評価'
            : '★'.repeat(Math.floor(n)) + (n % 1 ? '☆' : '') + ' ' + Number(n).toFixed(1)
        return `<option value="${n}" ${String(v ?? '') === String(n) ? 'selected' : ''}>${label}</option>`
      })
      .join('')

  function initMapPicker(p) {
    const el = document.getElementById('map-pick')
    if (!el || typeof L === 'undefined') return
    const lat = parseFloat(p.lat) || 36.5
    const lng = parseFloat(p.lng) || 138
    mapPicker = L.map(el).setView([lat, lng], p.lat ? 12 : 5)
    // CARTOがAPIキー必須になったため、キー不要のOpenStreetMap標準タイルを使用
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      className: 'map-dark'
    }).addTo(mapPicker)
    let marker = p.lat ? L.marker([lat, lng]).addTo(mapPicker) : null
    const setPin = (la, ln, zoom) => {
      // スポット欄に座標が空の行があれば、そちらを先に埋める
      const list = document.getElementById('spot-list')
      if (list) {
        const rows = Array.from(list.querySelectorAll('[data-spot]'))
        const blank = rows.find((r) => !r.querySelector('.s-lat').value.trim() || !r.querySelector('.s-lng').value.trim())
        if (blank) {
          blank.querySelector('.s-lat').value = la.toFixed(6)
          blank.querySelector('.s-lng').value = ln.toFixed(6)
          renderSpots(currentSpots())
          if (zoom) mapPicker.setView([la, ln], zoom)
          toast('スポット' + (rows.indexOf(blank) + 1) + 'に設定しました')
          return
        }
      }
      main().querySelector('[name="lat"]').value = la.toFixed(6)
      main().querySelector('[name="lng"]').value = ln.toFixed(6)
      if (marker) marker.setLatLng([la, ln])
      else marker = L.marker([la, ln]).addTo(mapPicker)
      if (zoom) mapPicker.setView([la, ln], zoom)
    }
    mapPicker.on('click', (e) => setPin(e.latlng.lat, e.latlng.lng))
    setTimeout(() => mapPicker.invalidateSize(), 200)

    const geoBtn = document.getElementById('geo-btn')
    const geoQ = document.getElementById('geo-q')
    const search = async () => {
      const q = geoQ.value.trim()
      if (!q) return
      try {
        const res = await fetch(
          'https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=ja&q=' + encodeURIComponent(q)
        )
        const list = await res.json()
        if (!list.length) return toast('見つかりませんでした', 'error')
        setPin(parseFloat(list[0].lat), parseFloat(list[0].lon), 14)
        toast('位置を設定しました')
      } catch (e) {
        toast('検索に失敗しました', 'error')
      }
    }
    geoBtn.addEventListener('click', search)
    geoQ.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        search()
      }
    })
  }

  /* 写真 */
  function currentPhotos() {
    return Array.from(main().querySelectorAll('#photo-list [data-photo]')).map((row) => ({
      url: row.querySelector('.p-url').value,
      caption: row.querySelector('.p-cap').value
    }))
  }
  function renderPhotos(photos) {
    const el = $('#photo-list')
    el.innerHTML = photos.length
      ? photos
          .map(
            (ph, i) => `
      <div data-photo="${i}" class="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
        ${ph.url ? `<img src="${esc(ph.url)}" class="h-12 w-16 rounded-lg object-cover" />` : '<span class="grid h-12 w-16 place-items-center rounded-lg bg-slate-200 text-slate-400"><i class="fa-regular fa-image"></i></span>'}
        <input class="p-url admin-input flex-1 min-w-[160px]" value="${esc(ph.url)}" placeholder="画像URL" />
        <input class="p-cap admin-input flex-1 min-w-[140px]" value="${esc(ph.caption)}" placeholder="キャプション" />
        <label class="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-slate-200 text-ink-soft hover:border-slate-300" title="画像をアップロード">
          <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
          <input type="file" accept="image/*" class="hidden p-up" data-idx="${i}" />
        </label>
        <button type="button" data-rm="${i}" class="grid h-9 w-9 place-items-center rounded-xl border border-rose-200 text-rose-500"><i class="fa-solid fa-xmark text-xs"></i></button>
      </div>`
          )
          .join('')
      : '<p class="text-[11.5px] text-ink-mute">写真は登録されていません</p>'
    el.querySelectorAll('[data-rm]').forEach((b) =>
      b.addEventListener('click', () => {
        const cur = currentPhotos()
        cur.splice(Number(b.dataset.rm), 1)
        renderPhotos(cur)
      })
    )
    el.querySelectorAll('.p-url').forEach((inp) => inp.addEventListener('change', () => renderPhotos(currentPhotos())))
    // 各行の画像アップロード
    el.querySelectorAll('.p-up').forEach((inp) =>
      inp.addEventListener('change', async () => {
        const file = inp.files && inp.files[0]
        if (!file) return
        const url = await uploadImage(file)
        if (!url) return
        const cur = currentPhotos()
        const i = Number(inp.dataset.idx)
        if (cur[i]) cur[i].url = url
        renderPhotos(cur)
      })
    )
  }

  function currentSpots() {
    return Array.from(main().querySelectorAll('#spot-list [data-spot]')).map((row) => ({
      name: row.querySelector('.s-name').value,
      lat: row.querySelector('.s-lat').value,
      lng: row.querySelector('.s-lng').value,
      note: row.querySelector('.s-note').value
    }))
  }

  function renderSpots(spots) {
    const el = $('#spot-list')
    el.innerHTML = spots.length
      ? spots
          .map(
            (s, i) => `
      <div data-spot="${i}" class="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
        <div class="flex flex-wrap items-center gap-2">
          <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-[11px] font-bold text-white">${i + 1}</span>
          <input class="s-name admin-input flex-1 min-w-[160px]" value="${esc(s.name)}" placeholder="スポット名" />
          <input class="s-lat admin-input w-[110px]" value="${esc(s.lat)}" placeholder="緯度" />
          <input class="s-lng admin-input w-[110px]" value="${esc(s.lng)}" placeholder="経度" />
          <button type="button" data-up="${i}" class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-ink-soft" title="上へ"><i class="fa-solid fa-arrow-up text-xs"></i></button>
          <button type="button" data-down="${i}" class="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-ink-soft" title="下へ"><i class="fa-solid fa-arrow-down text-xs"></i></button>
          <button type="button" data-srm="${i}" class="grid h-9 w-9 place-items-center rounded-xl border border-rose-200 text-rose-500"><i class="fa-solid fa-xmark text-xs"></i></button>
        </div>
        <input class="s-note admin-input mt-2 w-full" value="${esc(s.note)}" placeholder="メモ（例: 11:00 うどん500円）" />
      </div>`
          )
          .join('')
      : '<p class="text-[11.5px] text-ink-mute">スポットは登録されていません</p>'

    const move = (from, to) => {
      const cur = currentSpots()
      if (to < 0 || to >= cur.length) return
      const [x] = cur.splice(from, 1)
      cur.splice(to, 0, x)
      renderSpots(cur)
    }
    el.querySelectorAll('[data-up]').forEach((b) =>
      b.addEventListener('click', () => move(Number(b.dataset.up), Number(b.dataset.up) - 1))
    )
    el.querySelectorAll('[data-down]').forEach((b) =>
      b.addEventListener('click', () => move(Number(b.dataset.down), Number(b.dataset.down) + 1))
    )
    el.querySelectorAll('[data-srm]').forEach((b) =>
      b.addEventListener('click', () => {
        const cur = currentSpots()
        cur.splice(Number(b.dataset.srm), 1)
        renderSpots(cur)
      })
    )
  }

  /** 画像を R2 にアップロードして公開パスを返す */
  async function uploadImage(file) {
    if (file.size > 10 * 1024 * 1024) {
      toast('画像は10MB以下にしてください', 'error')
      return null
    }
    const fd = new FormData()
    fd.append('file', file)
    toast('アップロード中…')
    try {
      const r = await api('/admin/upload', { method: 'POST', body: fd })
      toast('アップロードしました')
      return r.url
    } catch (e) {
      toast(e.message, 'error')
      return null
    }
  }

  /* フォーム収集 */
  function collect() {
    const fd = new FormData($('#post-form'))
    const data = {}
    fd.forEach((v, k) => {
      data[k] = v
    })
    data.featured = !!$('#post-form').querySelector('[name="featured"]:checked')
    data.tags = String(data.tags || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    data.photos = currentPhotos().filter((p) => p.url)
    data.spots = currentSpots().filter((s) => s.name && s.lat && s.lng)
    return data
  }

  /* ================= 月次データ ================= */
  async function renderStats() {
    main().innerHTML = '<p class="text-sm text-ink-mute">読み込み中...</p>'
    const { stats } = await api('/admin/stats')
    state.stats = stats
    const nowYm = new Date().toISOString().slice(0, 7)
    main().innerHTML = `
      <div class="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 class="text-sm font-extrabold">月次データを登録 / 更新</h2>
          <p class="mt-1 text-[11.5px] text-ink-soft">同じ年月を登録すると上書きされます。</p>
          <form id="stat-form" class="mt-4 space-y-3">
            ${field('年月 (YYYY-MM)', 'ym', nowYm, { ph: '2026-08', attr: 'required' })}

            <!-- 資産の内訳：この3つだけを入力する -->
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-[11px] font-extrabold text-ink-soft">資産の内訳（この3つだけ入力）</p>
              <div class="mt-2.5 space-y-2.5">
                ${field('現金・預金', 'cash', '', { type: 'number', attr: 'data-sum="1" step="1"' })}
                ${field('NISA評価額', 'nisa_value', '', { type: 'number', attr: 'data-sum="1" step="1"' })}
                ${field('iDeCo評価額', 'ideco_value', '', { type: 'number', attr: 'data-sum="1" step="1"' })}
              </div>

              <!-- 総資産：手入力させず、上の3項目の合計を自動表示 -->
              <div class="mt-3 border-t border-slate-200 pt-3">
                <div class="flex items-baseline justify-between">
                  <span class="text-[11px] font-extrabold text-ink-soft">総資産（自動計算）</span>
                  <span id="sum-total" class="font-mono text-[17px] font-extrabold text-slate-900">¥0</span>
                </div>
                <div class="mt-1.5 flex items-baseline justify-between">
                  <span class="text-[11px] font-bold text-ink-mute">前月比（自動計算）</span>
                  <span id="sum-diff" class="font-mono text-[12.5px] font-bold text-ink-mute">—</span>
                </div>
                <p class="mt-2 text-[10.5px] leading-relaxed text-ink-mute">
                  総資産は「現金・預金＋NISA＋iDeCo」で自動計算されます。手入力欄はありません。
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              ${field('NISA累計投資額', 'nisa_contribution', '', { type: 'number' })}
              ${field('iDeCo累計拠出額', 'ideco_contribution', '', { type: 'number' })}
              ${field('手取り収入', 'income', '', { type: 'number' })}
              ${field('生活費合計', 'living_cost', '', { type: 'number' })}
            </div>
            <div>
              <label class="admin-label">費目内訳（JSON）</label>
              <textarea name="expense_json" rows="4" class="admin-input" placeholder='{"家賃":75000,"食費":42000,"光熱費":12000}'></textarea>
            </div>
            <div>
              <label class="admin-label">メモ</label>
              <textarea name="memo" rows="2" class="admin-input !font-sans"></textarea>
            </div>
            <button class="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-700">
              <i class="fa-solid fa-floppy-disk mr-1.5"></i>保存する
            </button>
          </form>
        </div>
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4">
            <div>
              <h2 class="text-sm font-extrabold">登録済みデータ（${stats.length}件）</h2>
              <p class="mt-0.5 text-[10.5px] text-ink-mute">
                「不一致」の行は総資産と内訳の合計が合っていません。編集→保存で自動的に合います。
              </p>
            </div>
            ${
              stats.length
                ? `<button id="stat-bulk-del" class="rounded-lg border border-rose-200 px-2.5 py-1.5 text-[10.5px] font-bold text-rose-500 hover:bg-rose-50">
                     <i class="fa-regular fa-trash-can mr-1"></i>複数まとめて削除
                   </button>`
                : ''
            }
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[640px] text-left text-[12px]">
              <thead class="bg-slate-50 text-ink-mute">
                <tr>
                  <th class="px-4 py-2.5 font-bold">年月</th>
                  <th class="px-4 py-2.5 text-right font-bold">総資産</th>
                  <th class="px-4 py-2.5 text-right font-bold">現金</th>
                  <th class="px-4 py-2.5 text-right font-bold">NISA</th>
                  <th class="px-4 py-2.5 text-right font-bold">iDeCo</th>
                  <th class="px-4 py-2.5 text-right font-bold">前月比</th>
                  <th class="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                ${
                  stats.length
                    ? stats
                        .slice()
                        .reverse()
                        .map((s, i, arr) => {
                          // arr は新しい順。前月は1つ後ろの要素
                          const prev = arr[i + 1]
                          const n = (v) => Number(v || 0)
                          const sum = n(s.cash) + n(s.nisa_value) + n(s.ideco_value)
                          // 総資産と内訳の合計が合っているか（1円以上ずれていたら警告）
                          const mismatch = Math.abs(n(s.total_assets) - sum) >= 1
                          const d = prev ? n(s.total_assets) - n(prev.total_assets) : null
                          const dTxt =
                            d === null
                              ? '—'
                              : `${d > 0 ? '+' : d < 0 ? '−' : '±'}${yen(Math.abs(d))}`
                          const dCls =
                            d === null
                              ? 'text-ink-mute'
                              : d > 0
                                ? 'text-emerald-600'
                                : d < 0
                                  ? 'text-rose-500'
                                  : 'text-ink-mute'
                          return `<tr class="border-t border-slate-100 ${mismatch ? 'bg-amber-50' : ''}">
                    <td class="px-4 py-2.5 font-bold">${s.ym}</td>
                    <td class="px-4 py-2.5 text-right font-bold">${yen(s.total_assets)}${
                      mismatch
                        ? `<span class="ml-1.5 inline-block rounded bg-amber-200 px-1.5 py-0.5 text-[9.5px] font-extrabold text-amber-900" title="内訳の合計 ${yen(sum)} と一致していません。編集して保存すると自動で合います。">不一致</span>`
                        : ''
                    }</td>
                    <td class="px-4 py-2.5 text-right text-ink-soft">${yen(s.cash)}</td>
                    <td class="px-4 py-2.5 text-right text-ink-soft">${yen(s.nisa_value)}</td>
                    <td class="px-4 py-2.5 text-right text-ink-soft">${yen(s.ideco_value)}</td>
                    <td class="px-4 py-2.5 text-right font-bold ${dCls}">${dTxt}</td>
                    <td class="px-4 py-2.5 text-right whitespace-nowrap">
                      <button data-load="${s.ym}" class="mr-1 rounded-lg border border-slate-200 px-2 py-1 text-[10.5px] font-bold text-ink-soft">編集</button>
                      <button data-dels="${s.ym}" class="rounded-lg border border-rose-200 px-2 py-1 text-[10.5px] font-bold text-rose-500">削除</button>
                    </td>
                  </tr>`
                        })
                        .join('')
                    : '<tr><td colspan="7" class="p-8 text-center text-ink-mute">データがありません</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>`

    /* ---- 総資産と前月比を自動計算して表示する ---- */
    const statForm = $('#stat-form')
    const num = (v) => {
      const n = parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''))
      return isNaN(n) ? 0 : n
    }
    /** 現金 + NISA + iDeCo */
    function computeTotal() {
      return ['cash', 'nisa_value', 'ideco_value'].reduce(
        (s, k) => s + num(statForm.querySelector(`[name="${k}"]`)?.value),
        0
      )
    }
    /** 入力中の年月の「前月」の総資産を登録済みデータから探す */
    function prevTotal(ym) {
      if (!ym || !/^\d{4}-\d{2}$/.test(ym)) return null
      const [y, m] = ym.split('-').map(Number)
      const d = new Date(y, m - 2, 1) // m-1 が当月なので m-2 が前月
      const pym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const row = state.stats.find((s) => s.ym === pym)
      if (!row) return null
      return { ym: pym, total: num(row.total_assets) }
    }
    function refreshSum() {
      const total = computeTotal()
      $('#sum-total').textContent = yen(total)
      const prev = prevTotal(statForm.querySelector('[name="ym"]').value)
      const el = $('#sum-diff')
      if (!prev || !total) {
        el.textContent = prev ? '—' : '前月のデータがありません'
        el.className = 'font-mono text-[12.5px] font-bold text-ink-mute'
        return
      }
      const d = total - prev.total
      const sign = d > 0 ? '+' : d < 0 ? '−' : '±'
      el.textContent = `${prev.ym} 比 ${sign}${yen(Math.abs(d)).replace('¥', '¥')}`
      el.className =
        'font-mono text-[12.5px] font-bold ' +
        (d > 0 ? 'text-emerald-600' : d < 0 ? 'text-rose-500' : 'text-ink-mute')
    }
    statForm.querySelectorAll('[data-sum], [name="ym"]').forEach((i) => {
      i.addEventListener('input', refreshSum)
      i.addEventListener('change', refreshSum)
    })
    refreshSum()

    statForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      const data = {}
      fd.forEach((v, k) => (data[k] = v))
      if (data.expense_json) {
        try {
          JSON.parse(data.expense_json)
        } catch (err) {
          return toast('費目内訳のJSON形式が不正です', 'error')
        }
      }
      // 総資産は内訳の合計で確定させる（手入力を受け付けない）
      const total = computeTotal()
      if (!total) return toast('現金・NISA・iDeCo のいずれかを入力してください', 'error')
      data.total_assets = total
      data.other = null
      try {
        await api('/admin/stats', { method: 'POST', body: JSON.stringify(data) })
        toast('保存しました（総資産 ' + yen(total) + '）')
        renderStats()
      } catch (err) {
        toast(err.message, 'error')
      }
    })

    main().querySelectorAll('[data-load]').forEach((b) =>
      b.addEventListener('click', () => {
        const s = state.stats.find((x) => x.ym === b.dataset.load)
        if (!s) return
        const form = $('#stat-form')
        Object.keys(s).forEach((k) => {
          const inp = form.querySelector(`[name="${k}"]`)
          if (inp) inp.value = s[k] ?? ''
        })
        // 旧データは内訳が未入力で総資産だけ入っている場合がある。
        // その差額を現金・預金として補完し、合計が一致した状態で編集を始められるようにする。
        const cashInp = form.querySelector('[name="cash"]')
        if (cashInp && !num(cashInp.value)) {
          const rest = num(s.total_assets) - num(s.nisa_value) - num(s.ideco_value)
          if (rest > 0) cashInp.value = String(Math.round(rest))
        }
        refreshSum()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    )
    main().querySelectorAll('[data-dels]').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm(`${b.dataset.dels} のデータを削除しますか？`)) return
        await api('/admin/stats/' + b.dataset.dels, { method: 'DELETE' })
        toast('削除しました')
        renderStats()
      })
    )

    /* ---- まとめて削除（ダミー行の一括整理用） ---- */
    const bulk = $('#stat-bulk-del')
    if (bulk) {
      bulk.addEventListener('click', async () => {
        const all = state.stats.map((s) => s.ym).join(', ')
        const input = prompt(
          '削除する年月をカンマ区切りで入力してください。\n' +
            '範囲指定も使えます（例: 2025-12~2026-07）。\n\n登録済み: ' +
            all,
          ''
        )
        if (!input) return
        // 「2025-12~2026-07」形式を展開する
        const targets = new Set()
        input
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((tok) => {
            const m = tok.match(/^(\d{4}-\d{2})\s*[~〜-]{1}\s*(\d{4}-\d{2})$/)
            if (m) {
              let [y1, m1] = m[1].split('-').map(Number)
              const [y2, m2] = m[2].split('-').map(Number)
              let guard = 0
              while ((y1 < y2 || (y1 === y2 && m1 <= m2)) && guard++ < 240) {
                targets.add(`${y1}-${String(m1).padStart(2, '0')}`)
                m1++
                if (m1 > 12) {
                  m1 = 1
                  y1++
                }
              }
            } else if (/^\d{4}-\d{2}$/.test(tok)) {
              targets.add(tok)
            }
          })
        const list = [...targets].filter((ym) => state.stats.some((s) => s.ym === ym))
        if (!list.length) return toast('該当する年月がありません', 'error')
        if (!confirm(`${list.length}件を削除します。\n\n${list.join(', ')}\n\nよろしいですか？`)) return
        let ok = 0
        for (const ym of list) {
          try {
            await api('/admin/stats/' + ym, { method: 'DELETE' })
            ok++
          } catch (e) {}
        }
        toast(`${ok}件を削除しました`)
        renderStats()
      })
    }
  }

  /* ================= 起動 ================= */
  ;(async () => {
    try {
      const { authed } = await api('/admin/me')
      if (authed) showApp()
      else showLogin()
    } catch (e) {
      showLogin()
    }
  })()
})()
