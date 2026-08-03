export type CategoryKey = 'asset' | 'life' | 'touring' | 'supermarket' | 'it'

export type CategoryDef = {
  key: CategoryKey
  name: string
  short: string
  tagline: string
  description: string
  icon: string
  /** tailwind color token */
  color: string
  accent: string      // hex（ダーク背景で映える明度に調整）
  accentSoft: string  // rgba（ダーク背景用の淡いレイヤー）
  group: 'money' | 'travel' | 'tech'
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: 'asset',
    name: '資産運用',
    short: 'ASSET',
    tagline: 'NISA・iDeCoの積み上げ記録',
    description: '現状の資産、NISA / iDeCo の進捗、毎月の振り返りを数字で残していきます。',
    icon: 'fa-chart-line',
    color: 'emerald',
    accent: '#34d399',
    accentSoft: 'rgba(52,211,153,0.14)',
    group: 'money'
  },
  {
    key: 'life',
    name: '日常の生活',
    short: 'LIFE',
    tagline: '実際の生活費とコスパ検証',
    description: 'リアルな生活費・生活水準・買ってよかったもののコスパを、実額ベースで記録します。',
    icon: 'fa-house-chimney',
    color: 'amber',
    accent: '#fbbf24',
    accentSoft: 'rgba(251,191,36,0.14)',
    group: 'money'
  },
  {
    key: 'touring',
    name: 'ツーリングログ',
    short: 'TOURING',
    tagline: '走った道と景色のアーカイブ',
    description: '各地のツーリング記録。ルート・走行距離・写真・地図つきで残しています。',
    icon: 'fa-motorcycle',
    color: 'orange',
    accent: '#fb923c',
    accentSoft: 'rgba(251,146,60,0.14)',
    group: 'travel'
  },
  {
    key: 'supermarket',
    name: 'ご当地スーパー',
    short: 'SUPER',
    tagline: '旅先のスーパーをレビュー',
    description: 'ツーリング先で立ち寄ったご当地スーパーのレビュー。品揃え・価格・コスパを5段階で評価。',
    icon: 'fa-basket-shopping',
    color: 'rose',
    accent: '#fb7185',
    accentSoft: 'rgba(251,113,133,0.14)',
    group: 'travel'
  },
  {
    key: 'it',
    name: 'IT / 生成AI',
    short: 'TECH',
    tagline: '社内SEの現場と生成AI活用',
    description: '社内SEとしての業務改善、情シスの知見、生成AIの実践的な使い方をまとめます。',
    icon: 'fa-microchip',
    color: 'violet',
    accent: '#a78bfa',
    accentSoft: 'rgba(167,139,250,0.14)',
    group: 'tech'
  }
]

export const CATEGORY_MAP: Record<string, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<string, CategoryDef>

export const GROUPS = [
  { key: 'money', name: 'MONEY', label: 'お金のこと', icon: 'fa-coins' },
  { key: 'travel', name: 'TRAVEL', label: '旅とスーパー', icon: 'fa-road' },
  { key: 'tech', name: 'TECH', label: '仕事とIT', icon: 'fa-laptop-code' }
] as const

/** サイト名やキャッチコピーはここを書き換えるだけで全ページに反映されます */
export const SITE = {
  title: 'Kurashi Log',
  /** ロゴ下に出る小さな英字キャプション */
  caption: 'MONEY · LIFE · RIDE · IT',
  subtitle: 'お金・暮らし・バイク・スーパー・IT の記録',
  author: 'Owner',
  description:
    '資産運用（NISA/iDeCo）、日常の生活費とコスパ、ツーリングログ、ご当地スーパー巡り、社内SE / 生成AI の話題をまとめた個人サイト。'
}

export type Bindings = {
  DB: D1Database
  R2?: R2Bucket
  ADMIN_PASSWORD?: string
  SESSION_SECRET?: string
}
