/* ========= 公開サイト共通スクリプト ========= */
(function () {
  'use strict'

  const INK = '#f5f5f7'
  const SUB = '#a1a1aa'
  const MUTE = '#71717a'
  const LINE = 'rgba(255,255,255,0.07)'
  const BRAND = '#f97316'

  /* アクセントはサイト共通の1色（オレンジ）に統一 */
  const CAT = {
    asset: { color: BRAND, icon: 'fa-chart-line', name: '資産運用' },
    life: { color: BRAND, icon: 'fa-receipt', name: '生活費' },
    touring: { color: BRAND, icon: 'fa-motorcycle', name: 'ツーリング記録' },
    supermarket: { color: BRAND, icon: 'fa-basket-shopping', name: 'ご当地スーパー' },
    it: { color: BRAND, icon: 'fa-gears', name: '業務効率化' }
  }

  /* ---- モバイルメニュー ---- */
  const toggle = document.getElementById('menu-toggle')
  const menu = document.getElementById('mobile-menu')
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const opening = menu.classList.contains('hidden')
      menu.classList.toggle('hidden')
      document.body.style.overflow = opening ? 'hidden' : ''
      const icon = document.getElementById('menu-icon') || toggle.querySelector('i')
      if (icon) icon.className = opening ? 'fa-solid fa-xmark text-[15px]' : 'fa-solid fa-bars text-[14px]'
    })
  }

  /* ---- スクロール演出 ---- */
  ;(function reveal() {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    els.forEach((el) => io.observe(el))
  })()

  /* ---- シェア / コピー ---- */
  document.querySelectorAll('.js-share').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const title = btn.dataset.title || document.title
      if (navigator.share) {
        try {
          await navigator.share({ title, url: location.href })
        } catch (e) {}
      } else {
        await navigator.clipboard.writeText(location.href)
        toast('URLをコピーしました')
      }
    })
  })
  document.querySelectorAll('.js-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(location.href)
      toast('URLをコピーしました')
    })
  })

  function toast(msg) {
    const el = document.createElement('div')
    el.className =
      'fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-full border border-edge bg-panel px-5 py-2.5 text-[13px] text-ink shadow-2xl backdrop-blur'
    el.textContent = msg
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 2000)
  }

  const yen = (n) => (n == null ? '—' : '¥' + Number(n).toLocaleString('ja-JP'))

  /* ================= グラフ（ミニマル） ================= */
  async function fetchStats() {
    const r = await fetch('/api/stats/monthly')
    const j = await r.json()
    return j.stats || []
  }

  /* グラフの数値は等幅フォントで桁を揃える */
  const FONT = {
    family: '"Roboto Mono", SFMono-Regular, Menlo, monospace',
    size: 11
  }

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: {
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          padding: 18,
          color: MUTE,
          font: FONT,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(24,24,27,.95)',
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
        titleColor: INK,
        bodyColor: '#e4e4e7',
        borderColor: 'rgba(255,255,255,.12)',
        borderWidth: 1,
        titleFont: FONT,
        bodyFont: FONT,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${yen(ctx.parsed.y)}` }
      }
    },
    scales: {
      x: { border: { display: false }, grid: { display: false }, ticks: { color: MUTE, font: FONT } },
      y: {
        border: { display: false },
        grid: { color: LINE, drawTicks: false },
        ticks: {
          color: MUTE,
          font: FONT,
          padding: 8,
          callback: (v) => (v >= 10000 ? v / 10000 + '万' : v)
        }
      }
    }
  }

  async function initCharts() {
    const homeEl = document.getElementById('home-asset-chart')
    const assetEl = document.getElementById('asset-chart')
    const lifeEl = document.getElementById('life-chart')
    const expenseEl = document.getElementById('expense-chart')
    if (!homeEl && !assetEl && !lifeEl && !expenseEl) return
    if (typeof Chart === 'undefined') return
    const stats = await fetchStats()
    if (!stats.length) return
    const labels = stats.map((s) => s.ym)

    const lineDs = (label, key, color, fill) => ({
      label,
      data: stats.map((s) => s[key]),
      borderColor: color,
      backgroundColor: fill ? color + '26' : 'transparent',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#0a0a0b',
      pointHoverBorderWidth: 2,
      fill: !!fill
    })

    if (homeEl) {
      new Chart(homeEl, {
        type: 'line',
        data: { labels, datasets: [lineDs('総資産', 'total_assets', BRAND, true)] },
        options: { ...baseOpts, plugins: { ...baseOpts.plugins, legend: { display: false } } }
      })
    }
    if (assetEl) {
      new Chart(assetEl, {
        type: 'line',
        data: {
          labels,
          datasets: [
            lineDs('総資産', 'total_assets', BRAND, true),
            lineDs('NISA', 'nisa_value', '#e4e4e7', false),
            lineDs('iDeCo', 'ideco_value', '#71717a', false)
          ]
        },
        options: baseOpts
      })
    }
    if (lifeEl) {
      new Chart(lifeEl, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: '生活費',
              data: stats.map((s) => s.living_cost),
              backgroundColor: BRAND,
              borderRadius: 4,
              maxBarThickness: 20
            },
            {
              label: '手取り収入',
              data: stats.map((s) => s.income),
              backgroundColor: 'rgba(255,255,255,0.16)',
              borderRadius: 4,
              maxBarThickness: 20
            }
          ]
        },
        options: baseOpts
      })
    }
    if (expenseEl) {
      const withExp = stats.filter((s) => s.expense_json)
      if (withExp.length) {
        let obj = {}
        try {
          obj = JSON.parse(withExp[withExp.length - 1].expense_json)
        } catch (e) {}
        const keys = Object.keys(obj)
        if (keys.length) {
          // オレンジ1色の濃淡でまとめる
          const mono = ['#f97316', '#fb8c3c', '#fda462', '#fdbb88', '#a1a1aa', '#8b8b93', '#71717a', '#5a5a61', '#45454b', '#333338']
          new Chart(expenseEl, {
            type: 'doughnut',
            data: {
              labels: keys,
              datasets: [
                {
                  data: keys.map((k) => obj[k]),
                  backgroundColor: keys.map((_, i) => mono[i % mono.length]),
                  borderWidth: 3,
                  borderColor: '#121214',
                  hoverOffset: 6
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '68%',
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 14,
                    color: MUTE,
                    font: FONT,
                    usePointStyle: true,
                    pointStyle: 'circle'
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(24,24,27,.95)',
                  padding: 10,
                  cornerRadius: 10,
                  displayColors: false,
                  titleColor: INK,
                  bodyColor: '#e4e4e7',
                  borderColor: 'rgba(255,255,255,.12)',
                  borderWidth: 1,
                  titleFont: FONT,
                  bodyFont: FONT,
                  callbacks: { label: (ctx) => ` ${ctx.label}: ${yen(ctx.parsed)}` }
                }
              }
            }
          })
        }
      }
    }
  }

  /* ================= 地図 ================= */
  function pinIcon(cat) {
    const c = CAT[cat] || { color: INK, icon: 'fa-location-dot' }
    return L.divIcon({
      className: '',
      html: `<div class="map-pin" style="background:${c.color}"><i class="fa-solid ${c.icon}"></i></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -12]
    })
  }

  function tileLayer() {
    return L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    })
  }

  function popupHtml(p) {
    const c = CAT[p.category] || {}
    const extra =
      p.category === 'supermarket'
        ? `<div style="margin-top:5px;color:${MUTE};font-size:11px">${'★'.repeat(p.rating || 0)}${p.budget ? ' / ' + yen(p.budget) : ''}</div>`
        : p.distance_km
          ? `<div style="margin-top:5px;color:${MUTE};font-size:11px">${p.distance_km} km</div>`
          : ''
    return `<div style="min-width:180px">
      <div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${BRAND}">${c.name || ''}</div>
      <a href="/posts/${p.slug}" style="display:block;margin-top:4px;font-size:14px;font-weight:700;letter-spacing:-.01em;color:${INK};text-decoration:none">${p.title}</a>
      ${p.place_name ? `<div style="color:${MUTE};font-size:11px;margin-top:3px">${p.place_name}</div>` : ''}
      ${extra}
      <a href="/posts/${p.slug}" style="display:inline-block;margin-top:8px;font-size:12px;color:${BRAND};text-decoration:none">記事を読む ›</a>
    </div>`
  }

  async function initMaps() {
    if (typeof L === 'undefined') return

    // 記事詳細の地図
    const postMapEl = document.getElementById('post-map')
    if (postMapEl) {
      const lat = parseFloat(postMapEl.dataset.lat)
      const lng = parseFloat(postMapEl.dataset.lng)
      const map = L.map(postMapEl, { scrollWheelZoom: false }).setView([lat, lng], 12)
      tileLayer().addTo(map)
      L.marker([lat, lng], { icon: pinIcon(postMapEl.dataset.cat || 'touring') })
        .addTo(map)
        .bindPopup(`<b style="font-size:14px">${postMapEl.dataset.label || ''}</b>`)
    }

    // カテゴリページの地図
    const catMapEl = document.getElementById('cat-map')
    if (catMapEl) {
      const map = L.map(catMapEl, { scrollWheelZoom: false }).setView([36.5, 138], 5)
      tileLayer().addTo(map)
      const res = await fetch('/api/map/points')
      const { points } = await res.json()
      // data-category が空ならツーリング系すべて（テーマ表示）
      const want = catMapEl.dataset.category
      const target = want
        ? points.filter((p) => p.category === want)
        : points.filter((p) => p.category === 'touring' || p.category === 'supermarket')
      const group = []
      target.forEach((p) => {
        group.push(L.marker([p.lat, p.lng], { icon: pinIcon(p.category) }).addTo(map).bindPopup(popupHtml(p)))
      })
      if (group.length) map.fitBounds(L.featureGroup(group).getBounds().pad(0.25))
    }

    // 全体マップ
    const fullMapEl = document.getElementById('full-map')
    if (fullMapEl) {
      const map = L.map(fullMapEl, { scrollWheelZoom: false }).setView([36.5, 138], 5)
      tileLayer().addTo(map)
      const res = await fetch('/api/map/points')
      const { points } = await res.json()
      let markers = []
      const listEl = document.getElementById('map-list')

      function render(filter) {
        markers.forEach((m) => map.removeLayer(m))
        markers = []
        const target = points.filter((p) => filter === 'all' || p.category === filter)
        target.forEach((p) => {
          markers.push(L.marker([p.lat, p.lng], { icon: pinIcon(p.category) }).addTo(map).bindPopup(popupHtml(p)))
        })
        if (markers.length) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2))
        if (listEl) {
          listEl.innerHTML = target.length
            ? target
                .map((p) => {
                  const c = CAT[p.category] || {}
                  return `<a href="/posts/${p.slug}" class="group flex items-center gap-3.5 rounded-big border border-edge2 bg-base p-4 transition hover:border-brand/40">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style="background:rgba(249,115,22,0.14);color:${c.color}">
                      <i class="fa-solid ${c.icon} text-[13px]"></i>
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-[13.5px] font-bold tracking-[-0.01em]">${p.title}</span>
                      <span class="mt-0.5 block truncate text-[11.5px] text-mute">${p.prefecture || ''} ${p.place_name || ''}</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-mute transition group-hover:translate-x-0.5"></i>
                  </a>`
                })
                .join('')
            : '<p class="text-[13px] text-mute">該当するスポットはありません</p>'
        }
      }
      render('all')

      const ACTIVE =
        'map-filter rounded-full bg-brand px-4 py-2 text-[12.5px] font-medium text-white transition'
      const IDLE =
        'map-filter rounded-full border border-edge2 bg-panel px-4 py-2 text-[12.5px] text-sub transition hover:text-ink'
      document.querySelectorAll('.map-filter').forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.map-filter').forEach((b) => (b.className = IDLE))
          btn.className = ACTIVE
          render(btn.dataset.filter)
        })
      })
    }
  }

  initCharts()
  initMaps()
})()
