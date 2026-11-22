/* ============ 公開前チェック（admin.js とは独立） ============ */
(function () {
  'use strict'

  var SHORTCODES = ['total_assets','cash','nisa','ideco','nisa_contribution',
    'ideco_contribution','living_cost','income','diff','ym','updated']

  var TYPOS = [
    [/様式/g, '「様式」→「洋式」の誤りかも'],
    [/以外と/g, '「以外と」→「意外と」の誤りかも'],
    [/永遠と/g, '「永遠と」→「延々と」の誤りかも'],
    [/的を得/g, '「的を得る」→「的を射る」の誤りかも']
  ]

  var PLACE = ['touring', 'camp', 'onsen', 'supermarket']

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]')
    return el ? String(el.value || '').trim() : ''
  }
  function statusOf(form) {
    var r = form.querySelector('[name="status"]:checked')
    return r ? r.value : 'draft'
  }
  function need(w, form, name, label) {
    if (!val(form, name)) w.push(label + 'が未入力')
  }
  /* 本文中の「数字＋単位」が欄の値と合っているか。どれか一つ合えばOK */
  function mismatch(body, unit, v) {
    var n = parseFloat(v)
    if (!n) return null
    var nums = [], re = new RegExp('([0-9][0-9,.]*)\\s*' + unit, 'gi'), m
    while ((m = re.exec(body))) nums.push(parseFloat(m[1].replace(/,/g, '')))
    if (!nums.length) return null
    var tol = Math.max(unit === 'km' ? 10 : 0, n * 0.1)
    for (var i = 0; i < nums.length; i++) if (Math.abs(nums[i] - n) <= tol) return null
    return nums.join(' / ')
  }

  function check(form) {
    var w = []
    var cat = val(form, 'category')
    var body = val(form, 'body')

    /* ---- 共通 ---- */
    need(w, form, 'summary', 'リード文')
    need(w, form, 'cover_image', 'カバー画像')
    need(w, form, 'tags', 'タグ')

    if (/genspark\.ai/.test(body) || /genspark\.ai/.test(val(form, 'cover_image')))
      w.push('一時URLの画像が残っている（/media/uploads/… に差し替え）')
    if (/XXXX/.test(body)) w.push('本文に XXXX が残っている')
    if (!/^##\s/m.test(body)) w.push('本文に見出し（##）が一つもない')
    if (/^post-[a-z0-9]{8}$/.test(val(form, 'slug')))
      w.push('スラッグが自動生成のまま（公開前なら意味のある名前に）')

    var sc, scre = /\{\{\s*([a-z_]+)\s*\}\}/g
    while ((sc = scre.exec(body)))
      if (SHORTCODES.indexOf(sc[1]) < 0) w.push('知らないショートコード {{' + sc[1] + '}}')

    var hl = val(form, 'highlight_label'), hv = val(form, 'highlight_value')
    if (hl && !hv) w.push('数値ハイライトのラベルだけ入っている')
    if (hv && !hl) w.push('数値ハイライトの数値だけ入っている')

    TYPOS.forEach(function (t) {
      if (t[0].test(body)) w.push(t[1])
      t[0].lastIndex = 0
    })

    /* ---- 場所系に共通 ---- */
    if (PLACE.indexOf(cat) >= 0) {
      need(w, form, 'place_name', 'スポット名')
      need(w, form, 'prefecture', '都道府県')
      need(w, form, 'area', 'エリア')
      need(w, form, 'genre', 'ジャンル')
      need(w, form, 'visit_date', '訪問日')
      if (!val(form, 'rating')) w.push('ランクが未選択')
      var pref = val(form, 'prefecture')
      if (pref && !/(都|道|府|県)$/.test(pref))
        w.push('都道府県の表記がおかしい（' + pref + '）')
    }

    /* ---- カテゴリ別 ---- */
    if (cat === 'touring') {
      need(w, form, 'distance_km', '走行距離')
      need(w, form, 'duration_text', '所要時間')
      need(w, form, 'route_text', 'ルート')
      need(w, form, 'road_note', '路面・注意事項')
      var mk = mismatch(body, 'km', val(form, 'distance_km'))
      if (mk) w.push('本文の距離（' + mk + 'km）と距離欄（' + val(form, 'distance_km') + 'km）が合っていない')
    }

    if (cat === 'camp') {
      need(w, form, 'budget', '料金')
      need(w, form, 'business_hours', '開設期間')
      need(w, form, 'address', '住所')
      need(w, form, 'access_text', 'アクセス')
    }

    if (cat === 'onsen') {
      need(w, form, 'budget', '入浴料')
      need(w, form, 'business_hours', '営業時間')
      need(w, form, 'address', '住所')
      need(w, form, 'access_text', 'アクセス')
      need(w, form, 'recommend_items', '泉質・特徴')
      var my = mismatch(body, '円', val(form, 'budget'))
      if (my) w.push('本文の料金（' + my + '円）と入浴料欄（' + val(form, 'budget') + '円）が合っていない')
    }

    if (cat === 'supermarket') {
      if (!val(form, 'cospa')) w.push('コスパが未選択')
      need(w, form, 'address', '住所')
      need(w, form, 'business_hours', '営業時間')
      need(w, form, 'recommend_items', '推し買い')
    }

    if (cat === 'asset' || cat === 'life') {
      if (!/\{\{/.test(body))
        w.push('月次データのショートコードが使われていない（金額を直書きしていないか確認）')
    }

    /* ---- シリーズ（場所系のみ） ---- */
    if (PLACE.indexOf(cat) >= 0) {
      var s = val(form, 'series'), sd = val(form, 'series_day')
      if (sd && !s) w.push('日番号があるのにシリーズ名が空')
      if (s && !sd) w.push('シリーズ名があるのに日番号が空')
      if (s && /[A-Z\s]/.test(s)) w.push('シリーズ名に大文字か空白がある（表記ゆれの元）')
    }

    return w
  }

  var writing = false

  function render() {
    var form = document.getElementById('post-form')
    if (!form) return
    var btn = form.querySelector('button[type="submit"]')
    if (!btn) return

    var box = document.getElementById('pub-check')
    if (!box) {
      box = document.createElement('div')
      box.id = 'pub-check'
      box.style.cssText = 'margin-top:10px;font-size:11.5px;line-height:1.75'
      btn.parentNode.parentNode.insertBefore(box, btn.parentNode.nextSibling)
    }

    var html = ''
    if (statusOf(form) === 'published') {
      var w = check(form)
      if (w.length) {
        html = '<div style="border:1px solid #fdba74;background:#fff7ed;border-radius:12px;padding:10px 12px">' +
          '<p style="font-weight:800;color:#c2410c;margin:0 0 4px">公開前チェック（' + w.length + '件）</p>' +
          '<ul style="margin:0;padding-left:16px;color:#9a3412">' +
          w.map(function (x) { return '<li>' + x + '</li>' }).join('') + '</ul></div>'
      } else {
        html = '<div style="border:1px solid #6ee7b7;background:#ecfdf5;border-radius:12px;' +
          'padding:8px 12px;color:#047857;font-weight:800">公開前チェック：問題なし</div>'
      }
    }
    if (box.innerHTML === html) return
    writing = true
    box.innerHTML = html
    setTimeout(function () { writing = false }, 0)
  }

  var timer
  function schedule() { clearTimeout(timer); timer = setTimeout(render, 250) }
  document.addEventListener('input', schedule, true)
  document.addEventListener('change', schedule, true)
  new MutationObserver(function () { if (!writing) schedule() })
    .observe(document.getElementById('admin-main') || document.body, { childList: true, subtree: true })
  schedule()
})()
