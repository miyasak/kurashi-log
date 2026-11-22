/* ====== シリーズ名のプルダウンと日番号の自動計算（admin.js とは独立） ====== */
(function () {
  'use strict'

  var cache = null
  var loading = null

  function load() {
    if (cache) return Promise.resolve(cache)
    if (loading) return loading
    loading = fetch('/api/admin/posts?limit=500', { headers: { 'Content-Type': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : { posts: [] } })
      .then(function (j) {
        cache = (j.posts || [])
          .filter(function (p) { return p.series })
          .map(function (p) {
            return { series: String(p.series).trim(), visit_date: p.visit_date || p.published_at || '' }
          })
        return cache
      })
      .catch(function () { cache = []; return cache })
    return loading
  }

  function firstDayOf(rows, name) {
    var min = null
    rows.forEach(function (r) {
      if (r.series !== name || !r.visit_date) return
      if (!min || r.visit_date < min) min = r.visit_date
    })
    return min
  }

  function daysBetween(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000)
  }

  function setup() {
    var input = document.querySelector('[name="series"]')
    var dayInput = document.querySelector('[name="series_day"]')
    var list = document.getElementById('series-list')
    if (!input || input.dataset.seriesReady) return
    input.dataset.seriesReady = '1'
    if (list) list.remove()
    input.removeAttribute('list')

    var wrap = input.parentNode          // シリーズ名のフィールド
    var grid = wrap.parentNode           // シリーズ名＋日番号の2列

    /* プルダウンを input の前に差し込み、input は「新規入力用」に隠す */
    var sel = document.createElement('select')
    sel.className = 'admin-input'
    sel.id = 'series-select'
    wrap.insertBefore(sel, input)
    input.style.display = 'none'
    input.style.marginTop = '6px'
    input.placeholder = '例: tohoku-2026（小文字とハイフン）'

    /* 緑の案内は2列の下に置く */
    var hint = document.createElement('p')
    hint.id = 'series-hint'
    hint.style.cssText = 'margin-top:6px;font-size:10.5px;font-weight:700;color:#0f766e'
    grid.parentNode.insertBefore(hint, grid.nextSibling)

    var NEW = '__new__'

    function fill(rows) {
      var names = []
      rows.forEach(function (r) { if (names.indexOf(r.series) < 0) names.push(r.series) })
      names.sort()
      var cur = String(input.value || '').trim()
      var html = '<option value="">— シリーズなし —</option>'
      names.forEach(function (n) {
        var c = rows.filter(function (r) { return r.series === n }).length
        html += '<option value="' + n + '"' + (n === cur ? ' selected' : '') + '>' + n + '（' + c + '本）</option>'
      })
      html += '<option value="' + NEW + '">＋ 新しいシリーズ名を入力</option>'
      sel.innerHTML = html
      /* 既存にない名前が既に入っていたら、新規入力の状態で見せる */
      if (cur && names.indexOf(cur) < 0) {
        sel.value = NEW
        input.style.display = ''
      }
      recalc()
    }

    function recalc() {
      var name = String(input.value || '').trim()
      if (!name) { hint.textContent = ''; return }
      var visit = document.querySelector('[name="visit_date"]')
      var vd = visit ? visit.value : ''
      load().then(function (rows) {
        var first = firstDayOf(rows, name)
        if (!first) {
          hint.textContent = '「' + name + '」は新しいシリーズです。この記事が1日目になります'
          if (dayInput && !dayInput.value && vd) dayInput.value = 1
          return
        }
        if (!vd) { hint.textContent = '訪問日を入れると日番号を計算します'; return }
        var n = daysBetween(first, vd) + 1
        hint.textContent = first + ' を1日目として ' + n + '日目'
        if (dayInput && !dayInput.value) dayInput.value = n
      })
    }

    sel.addEventListener('change', function () {
      if (sel.value === NEW) {
        input.style.display = ''
        input.value = ''
        input.focus()
        hint.textContent = '小文字とハイフンで。例: tohoku-2026'
      } else {
        input.style.display = 'none'
        input.value = sel.value
        recalc()
      }
    })

    input.addEventListener('change', recalc)
    input.addEventListener('blur', recalc)
    var visit = document.querySelector('[name="visit_date"]')
    if (visit) visit.addEventListener('change', recalc)

    load().then(fill)
  }

  new MutationObserver(setup)
    .observe(document.getElementById('admin-main') || document.body, { childList: true, subtree: true })
  setup()
})()
