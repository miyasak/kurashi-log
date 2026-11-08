import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

export function renderMarkdown(md: string): string {
  if (!md) return ''
  return marked.parse(md, { async: false }) as string
}

/* =========================================================
   ショートコード
   記事本文に {{total_assets}} のように書くと、管理画面に登録した
   最新の月次データの値に置き換わる。
   数値を直書きしなくて済むので、トップの数字と記事の数字がずれない。
   ========================================================= */

/** 利用できるショートコードの一覧（増やしたら public/static/admin.js の SHORTCODES も同じ内容にすること） */
export const SHORTCODES: { code: string; label: string }[] = [
  { code: 'total_assets', label: '総資産（現金＋NISA＋iDeCo）' },
  { code: 'cash', label: '現金・預金' },
  { code: 'nisa', label: 'NISA評価額' },
  { code: 'ideco', label: 'iDeCo評価額' },
  { code: 'nisa_contribution', label: 'NISA累計投資額' },
  { code: 'ideco_contribution', label: 'iDeCo累計拠出額' },
  { code: 'living_cost', label: '直近の生活費' },
  { code: 'income', label: '直近の手取り収入' },
  { code: 'diff', label: '総資産の前月比（±付き）' },
  { code: 'ym', label: '対象年月（例: 2026-07）' },
  { code: 'updated', label: 'データの更新月（例: 2026年7月）' }
]

type StatRow = Record<string, any>

/**
 * 本文中のショートコードを最新の月次データで置換する。
 * stats は古い順（listMonthlyStats と同じ並び）を想定。
 * 「{{idceo}}」のようなよくある綴り違いも拾う。
 */
export function applyShortcodes(body: string, stats: StatRow[]): string {
  if (!body) return ''
  if (!body.includes('{{')) return body

  const last = stats.length ? stats[stats.length - 1] : null
  const prev = stats.length > 1 ? stats[stats.length - 2] : null
  const n = (v: any) => (v === null || v === undefined || v === '' ? null : Number(v))

  const total = last ? n(last.total_assets) : null
  const prevTotal = prev ? n(prev.total_assets) : null
  const diff = total !== null && prevTotal !== null ? total - prevTotal : null

  const ymLabel = (() => {
    if (!last?.ym) return ''
    const [y, m] = String(last.ym).split('-')
    return `${y}年${Number(m)}月`
  })()

  const table: Record<string, string> = {
    total_assets: yen(total),
    cash: yen(last ? n(last.cash) : null),
    nisa: yen(last ? n(last.nisa_value) : null),
    nisa_value: yen(last ? n(last.nisa_value) : null),
    ideco: yen(last ? n(last.ideco_value) : null),
    ideco_value: yen(last ? n(last.ideco_value) : null),
    // よくある綴り違いも同じ値にしておく
    idceo: yen(last ? n(last.ideco_value) : null),
    nisa_contribution: yen(last ? n(last.nisa_contribution) : null),
    ideco_contribution: yen(last ? n(last.ideco_contribution) : null),
    living_cost: yen(last ? n(last.living_cost) : null),
    income: yen(last ? n(last.income) : null),
    diff: diff === null ? '—' : `${diff > 0 ? '+' : diff < 0 ? '−' : '±'}${yen(Math.abs(diff))}`,
    ym: last?.ym ? String(last.ym) : '',
    updated: ymLabel
  }

  return body.replace(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g, (full, key) => {
    const k = String(key).toLowerCase()
    return Object.prototype.hasOwnProperty.call(table, k) ? table[k] : full
  })
}

export function escapeHtml(s: string | null | undefined): string {
  if (!s) return ''
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function stripMd(md: string, len = 110): string {
  const text = (md || '')
    // コードブロック
    .replace(/```[\s\S]*?```/g, '')
    // HTMLコメント
    .replace(/<!--[\s\S]*?-->/g, '')
    // 本文に直接書いたHTMLタグ（img や a を抜粋に出さない）
    .replace(/<[^>]*>/g, ' ')
    // マークダウンの画像とリンク
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 残った記号
    .replace(/[#>*_`~\-|]/g, '')
    // 実体参照を戻す
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > len ? text.slice(0, len) + '…' : text
}

export function formatDate(d?: string | null): string {
  if (!d) return ''
  const s = String(d).replace(' ', 'T')
  const dt = new Date(s.length <= 10 ? s + 'T00:00:00' : s)
  if (isNaN(dt.getTime())) return String(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(
    dt.getDate()
  ).padStart(2, '0')}`
}

export function yen(n?: number | null): string {
  if (n === null || n === undefined || isNaN(Number(n))) return '—'
  return '¥' + Number(n).toLocaleString('ja-JP')
}

export function slugify(input: string): string {
  const base = (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    if (/^[a-z0-9\u3040-\u30ff\u4e00-\u9faf-]+$/.test(base) && base.length > 0) return base.slice(0, 60)
    return 'post-' + Date.now().toString(36)
}

export function safeJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback
  try {
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

/* =========================================================
   目次
   本文HTMLの h2 に id を振って、見出しの一覧を作る。
   マークダウン本文には手を加えない。
   ========================================================= */
export function buildToc(html: string): { html: string; toc: { id: string; text: string }[] } {
  if (!html) return { html: '', toc: [] }
  const toc: { id: string; text: string }[] = []
  let i = 0
  const out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (full, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    if (!text) return full
    if (/\sid=/.test(attrs)) return full
    i++
    const id = `s${i}`
    toc.push({ id, text })
    return `<h2 id="${id}" style="scroll-margin-top:90px"${attrs}>${inner}</h2>`
  })
  return { html: out, toc }
}