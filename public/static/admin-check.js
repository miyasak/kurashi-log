/* ============ 公開前チェック（admin.js とは独立） ============
   保存は止めず、気になる点を並べるだけ。
   不要になったらこのファイルと admin.tsx の script タグを消せば元に戻る。
============================================================ */
(function () {
  'use strict'

  var TYPOS = [
    [/様式/g, '「様式」→「洋式」の誤りかも'],
    [/以外と/g, '「以外と」→「意外と」の誤りかも'],
    [/永遠と/g, '「永遠と」→「延々と」の誤りかも'],
    [/的を得/g, '「的を得る」→「的を射る」の誤りかも']
  ]

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]')
    return el ? String(el.value || '').trim() : ''
  }
  function statusOf(form) {
    var r = form.querySelector('[name="status"]:checked')
    return r ? r.value : 'draft'
  }

  function check(form) {
    var w = []
    var cat = val(form, 'category')
    var body = val(form, 'body')

    if (!val(form, 'summary')) w.push('リード文が未入力')
    if (!val(form, 'cover_image')) w.push('カバー画像が未設定')
    if (!val(form, 'tags')) w.push('タグが未設定')

    if (/genspark\.ai/.test(body) || /genspark\.ai/.test(val(form, 'cover_image'))) {
      w.push('一時URLの画像が残っている（/media/uploads/… に差し替え）')
    }
    if (/XXXX/.test(body)) w.push('本文に XXXX が残っている')

    if (cat === 'touring') {
      if (!val(form, 'distance_km')) w.push('走行距離が未入力')
      if (!val(form, 'duration_text')) w.push('所要時間が未入力')
      if (!val(form, 'route_text')) w.push('ルートが未入力')
      if (!val(form, 'road_note')) w.push('路面・注意事項が未入力')
    }
    if (cat === 'touring' || cat === 'camp' || cat === 'onsen' || cat === 'supermarket') {
      if (!val(form, 'visit_date')) w.push('訪問日が未入力')
      if (!val(form, 'place_name')) w.push('スポット名が未入力')
    }

    var pref = val(form, 'prefecture')
    if (pref && !/(都|道|府|県)$/.test(pref)) w.push('都道府県が「県」などで終わっていない（' + pref + '）')

    var d = parseFloat(val(form, 'distance_km'))
    if (d) {
      var nums = [], re = /([0-9][0-9,.]*)\s*km/gi, m
      while ((m = re.exec(body))) nums.push(parseFloat(m[1].replace(/,/g, '')))
      var tol = Math.max(10, d * 0.1)
      if (nums.length && !nums.some(function (n) { return Math.abs(n - d) <= tol })) {
        w.push('本文の距離（' + nums.join(' / ') + 'km）と距離欄（' + d + 'km）が合っていない')
      }
    }

    var s = val(form, 'series'), sd = val(form, 'series_day')
    if (sd && !s) w.push('日番号があるのにシリーズ名が空')
    if (s && !sd) w.push('シリーズ名があるのに日番号が空')
    if (s && /[A-Z\s]/.test(s)) w.push('シリーズ名に大文字か空白がある（表記ゆれの元）')

    var hl = val(form, 'highlight_label'), hv = val(form, 'highlight_value')
    if (hl && !hv) w.push('数値ハイライトのラベルだけ入っている')
    if (hv && !hl) w.push('数値ハイライトの数値だけ入っている')

    TYPOS.forEach(function (t) {
      if (t[0].test(body)) w.push(t[1])
      t[0].lastIndex = 0
    })

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
      var anchor = btn.parentNode
      anchor.parentNode.insertBefore(box, anchor.nextSibling)
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
  function schedule() {
    clearTimeout(timer)
    timer = setTimeout(render, 250)
  }

  document.addEventListener('input', schedule, true)
  document.addEventListener('change', schedule, true)

  var target = document.getElementById('admin-main') || document.body
  new MutationObserver(function () { if (!writing) schedule() }).observe(target, { childList: true, subtree: true })
  schedule()
})()
