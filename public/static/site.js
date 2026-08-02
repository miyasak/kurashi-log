/* ========= 公開サイト共通スクリプト ========= */
(function () {
  'use strict'

  const CAT = {
    asset: { color: '#10b981', icon: 'fa-chart-line', name: '資産運用' },
    life: { color: '#f59e0b', icon: 'fa-house-chimney', name: '日常の生活' },
    touring: { color: '#0ea5e9', icon: 'fa-motorcycle', name: 'ツーリング' },
    supermarket: { color: '#f43f5e', icon: 'fa-basket-shopping', name: 'ご当地スーパー' },
    it: { color: '#8b5cf6', icon: 'fa-microchip', name: 'IT / 生成AI' }
  }

  /* ---- モバイルメニュー ---- */
  const toggle = document.getElementById('menu-toggle')
  const menu = document.getElementById('mobile-menu')
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('hidden')
      const icon = toggle.querySelector('i')
      icon.className = menu.classList.contains('hidden') ? 'fa-solid fa-bars text-xs' : 'fa-solid fa-xmark text-xs'
    })
  }

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
      'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-bold text-white shadow-xl'
    el.textContent = msg
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 2000)
  }

  const yen = (n) => (n == null ? '—' : '¥' + Number(n).toLocaleString('ja-JP'))

  /* ================= グラフ ================= */
  async function fetchStats() {
    const r = await fetch('/api/stats/monthly')
    const j = await r.json()
    return j.stats || []
  }

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { labels: { boxWidth: 10, boxHeight: 10, font: { size: 11 }, usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${yen(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10 },
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

    const areaDs = (label, key, color) => ({
      label,
      data: stats.map((s) => s[key]),
      borderColor: color,
      backgroundColor: color + '20',
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: true
    })

    if (homeEl) {
      new Chart(homeEl, {
        type: 'line',
        data: { labels, datasets: [areaDs('総資産', 'total_assets', '#10b981'), areaDs('生活費', 'living_cost', '#f59e0b')] },
        options: baseOpts
      })
    }
    if (assetEl) {
      new Chart(assetEl, {
        type: 'line',
        data: {
          labels,
          datasets: [
            areaDs('総資産', 'total_assets', '#10b981'),
            areaDs('NISA', 'nisa_value', '#0ea5e9'),
            areaDs('iDeCo', 'ideco_value', '#8b5cf6')
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
              backgroundColor: '#fbbf24',
              borderRadius: 6,
              maxBarThickness: 34
            },
            {
              label: '手取り収入',
              data: stats.map((s) => s.income),
              backgroundColor: '#e2e8f0',
              borderRadius: 6,
              maxBarThickness: 34
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
          new Chart(expenseEl, {
            type: 'doughnut',
            data: {
              labels: keys,
              datasets: [
                {
                  data: keys.map((k) => obj[k]),
                  backgroundColor: [
                    '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#f43f5e',
                    '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#e11d48'
                  ],
                  borderWidth: 2,
                  borderColor: '#fff'
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '58%',
              plugins: {
                legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 }, usePointStyle: true } },
                tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${yen(ctx.parsed)}` } }
              }
            }
          })
        }
      }
    }
  }

  /* ================= 地図 ================= */
  function pinIcon(cat) {
    const c = CAT[cat] || { color: '#0f172a', icon: 'fa-location-dot' }
    return L.divIcon({
      className: '',
      html: `<div class="map-pin" style="background:${c.color}"><i class="fa-solid ${c.icon}"></i></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -14]
    })
  }

  function tileLayer() {
    return L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    })
  }

  function popupHtml(p) {
    const c = CAT[p.category] || {}
    const extra =
      p.category === 'supermarket'
        ? `<div style="margin-top:4px;color:#64748b">${'★'.repeat(p.rating || 0)} ${p.budget ? '/ ' + yen(p.budget) : ''}</div>`
        : p.distance_km
          ? `<div style="margin-top:4px;color:#64748b">${p.distance_km} km</div>`
          : ''
    return `<div style="min-width:170px">
      <div style="font-size:10px;font-weight:800;color:${c.color}">${c.name || ''}</div>
      <a href="/posts/${p.slug}" style="display:block;margin-top:2px;font-weight:800;color:#0f172a;text-decoration:none">${p.title}</a>
      ${p.place_name ? `<div style="color:#64748b;font-size:11px;margin-top:2px">${p.place_name}</div>` : ''}
      ${extra}
      <a href="/posts/${p.slug}" style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:${c.color}">記事を読む →</a>
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
        .bindPopup(`<b>${postMapEl.dataset.label || ''}</b>`)
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
        const m = L.marker([p.lat, p.lng], { icon: pinIcon(p.category) }).addTo(map).bindPopup(popupHtml(p))
        group.push(m)
      })
      if (group.length) map.fitBounds(L.featureGroup(group).getBounds().pad(0.25))
    }

    // 全体マップ
    const fullMapEl = document.getElementById('full-map')
    if (fullMapEl) {
      const map = L.map(fullMapEl).setView([36.5, 138], 5)
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
                  return `<a href="/posts/${p.slug}" class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:shadow-soft">
                    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style="background:${c.color}18;color:${c.color}">
                      <i class="fa-solid ${c.icon}"></i>
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-[13.5px] font-bold">${p.title}</span>
                      <span class="block text-[11px] text-ink-mute">${p.prefecture || ''} ${p.place_name || ''}</span>
                    </span>
                  </a>`
                })
                .join('')
            : '<p class="text-sm text-ink-mute">スポットが登録されていません</p>'
        }
      }
      render('all')

      document.querySelectorAll('.map-filter').forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.map-filter').forEach((b) => {
            b.className = 'map-filter rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-soft'
          })
          btn.className = 'map-filter rounded-xl px-3.5 py-2 text-xs font-bold text-white'
          btn.style.background = '#0f172a'
          render(btn.dataset.filter)
        })
      })
    }
  }

  initCharts()
  initMaps()
})()
