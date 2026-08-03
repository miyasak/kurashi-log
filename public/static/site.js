/* ========= 公開サイト共通スクリプト ========= */
(function () {
  'use strict'

  const INK = '#1d1d1f'
  const MUTE = '#86868b'
  const LINE = '#e8e8ed'

  const CAT = {
    asset: { color: '#10b981', icon: 'fa-chart-line', name: '資産運用' },
    life: { color: '#f59e0b', icon: 'fa-house-chimney', name: '日常の生活' },
    touring: { color: '#0071e3', icon: 'fa-motorcycle', name: 'ツーリング' },
    supermarket: { color: '#f43f5e', icon: 'fa-basket-shopping', name: 'ご当地スーパー' },
    it: { color: '#8b5cf6', icon: 'fa-microchip', name: 'IT / 生成AI' }
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
      'fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/85 px-5 py-2.5 text-[13px] text-white backdrop-blur'
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

  const FONT = {
    family:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Hiragino Sans", Inter, "Noto Sans JP", sans-serif',
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
        backgroundColor: 'rgba(29,29,31,.92)',
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
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
      backgroundColor: fill ? color + '14' : 'transparent',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      fill: !!fill
    })

    if (homeEl) {
      new Chart(homeEl, {
        type: 'line',
        data: { labels, datasets: [lineDs('総資産', 'total_assets', INK, true)] },
        options: { ...baseOpts, plugins: { ...baseOpts.plugins, legend: { display: false } } }
      })
    }
    if (assetEl) {
      new Chart(assetEl, {
        type: 'line',
        data: {
          labels,
          datasets: [
            lineDs('総資産', 'total_assets', INK, true),
            lineDs('NISA', 'nisa_value', '#10b981', false),
            lineDs('iDeCo', 'ideco_value', '#8b5cf6', false)
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
              backgroundColor: INK,
              borderRadius: 5,
              maxBarThickness: 22
            },
            {
              label: '手取り収入',
              data: stats.map((s) => s.income),
              backgroundColor: '#d2d2d7',
              borderRadius: 5,
              maxBarThickness: 22
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
          const mono = ['#1d1d1f', '#3a3a3c', '#545456', '#6e6e73', '#86868b', '#a1a1a6', '#b8b8bd', '#c7c7cc', '#d2d2d7', '#e0e0e5']
          new Chart(expenseEl, {
            type: 'doughnut',
            data: {
              labels: keys,
              datasets: [
                {
                  data: keys.map((k) => obj[k]),
                  backgroundColor: keys.map((_, i) => mono[i % mono.length]),
                  borderWidth: 3,
                  borderColor: '#f5f5f7',
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
                  backgroundColor: 'rgba(29,29,31,.92)',
                  padding: 10,
                  cornerRadius: 10,
                  displayColors: false,
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
    return L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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
      <div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${MUTE}">${c.name || ''}</div>
      <a href="/posts/${p.slug}" style="display:block;margin-top:4px;font-size:15px;font-weight:600;letter-spacing:-.01em;color:${INK};text-decoration:none">${p.title}</a>
      ${p.place_name ? `<div style="color:${MUTE};font-size:11px;margin-top:3px">${p.place_name}</div>` : ''}
      ${extra}
      <a href="/posts/${p.slug}" style="display:inline-block;margin-top:8px;font-size:12px;color:#0071e3;text-decoration:none">記事を読む ›</a>
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
      const target = points.filter((p) => p.category === catMapEl.dataset.category)
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
                  return `<a href="/posts/${p.slug}" class="group flex items-center gap-4 rounded-big bg-hazy p-5 transition hover:bg-[#eeeef0]">
                    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full" style="background:${c.color}14;color:${c.color}">
                      <i class="fa-solid ${c.icon} text-[14px]"></i>
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-[15px] font-semibold tracking-[-0.01em]">${p.title}</span>
                      <span class="mt-0.5 block truncate text-[12px] text-mute">${p.prefecture || ''} ${p.place_name || ''}</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[10px] text-mute transition group-hover:translate-x-0.5"></i>
                  </a>`
                })
                .join('')
            : '<p class="text-[15px] text-mute">スポットが登録されていません</p>'
        }
      }
      render('all')

      const ACTIVE = 'map-filter rounded-full bg-white px-5 py-2 text-[13px] text-ink transition'
      const IDLE =
        'map-filter rounded-full border border-white/25 px-5 py-2 text-[13px] text-white/85 transition hover:border-white/50'
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
