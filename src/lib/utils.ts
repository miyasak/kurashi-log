import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

export function renderMarkdown(md: string): string {
  if (!md) return ''
  return marked.parse(md, { async: false }) as string
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
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-|]/g, '')
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
  if (/^[a-z0-9-]+$/.test(base) && base.length > 0) return base.slice(0, 60)
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
