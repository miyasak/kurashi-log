/* =========================================================
   テーマ構成
   大テーマは Money / Touring / Tech の3つ。
   記事のカテゴリ（DBの posts.category）はこれまで通り5種類のままで、
   それぞれをテーマ配下の「サブカテゴリ」として扱います。
   ========================================================= */

export type CategoryKey = 'asset' | 'life' | 'touring' | 'supermarket' | 'it'
export type ThemeKey = 'money' | 'touring' | 'tech'

export type CategoryDef = {
  key: CategoryKey
  name: string
  short: string
  tagline: string
  description: string
  icon: string
  /** 所属する大テーマ */
  theme: ThemeKey
  /** 旧実装との互換（theme と同義） */
  group: ThemeKey
  /** 配色は全テーマ共通のアクセント1色に統一 */
  accent: string
  accentSoft: string
  color: string
}

/** サイト唯一のアクセントカラー（管理画面のオレンジと同一） */
export const ACCENT = '#f97316'
export const ACCENT_SOFT = 'rgba(249,115,22,0.14)'

const cat = (
  key: CategoryKey,
  theme: ThemeKey,
  name: string,
  short: string,
  icon: string,
  tagline: string,
  description: string
): CategoryDef => ({
  key,
  theme,
  group: theme,
  name,
  short,
  icon,
  tagline,
  description,
  accent: ACCENT,
  accentSoft: ACCENT_SOFT,
  color: 'orange'
})

export const CATEGORIES: CategoryDef[] = [
  cat(
    'asset',
    'money',
    '資産運用',
    'ASSET',
    'fa-chart-line',
    'NISA・iDeCoの積み上げ記録',
    '総資産、NISA / iDeCo の評価額、毎月の積立額を数字のまま残しています。'
  ),
  cat(
    'life',
    'money',
    '生活費',
    'LIFE',
    'fa-receipt',
    '実際の生活費とコスパ検証',
    '家賃から趣味まで、実際に使った金額と買ってよかったもののコスパを記録します。'
  ),
  cat(
    'touring',
    'touring',
    'ツーリング記録',
    'RIDE',
    'fa-motorcycle',
    '走った道と景色のアーカイブ',
    'ルート・走行距離・天気・写真つきのツーリング記録。地図から辿れます。'
  ),
  cat(
    'supermarket',
    'touring',
    'ご当地スーパー',
    'SUPER',
    'fa-basket-shopping',
    '旅先のスーパーをレビュー',
    'ツーリング先で立ち寄ったご当地スーパー。品揃え・価格・コスパを5段階で評価。'
  ),
  cat(
    'it',
    'tech',
    '業務効率化',
    'TECH',
    'fa-gears',
    '作業時間を削った記録',
    'Excel・Python・BIツールで手作業を自動化した記録。再現できる形で書いています。'
  )
]

export const CATEGORY_MAP: Record<string, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<string, CategoryDef>

/* ---------------------------------------------------------
   大テーマ定義（URL: /theme/:key）
   --------------------------------------------------------- */
export type ThemeDef = {
  key: ThemeKey
  /** ヘッダーに出す短いラベル */
  label: string
  /** 英字表記 */
  en: string
  /** 日本語のフルネーム */
  name: string
  icon: string
  /** 一覧ページの見出し */
  head: string
  /** 一覧ページのリード文 */
  lead: string
  description: string
  /** 配下のカテゴリキー（表示順） */
  categories: CategoryKey[]
}

export const THEMES: ThemeDef[] = [
  {
    key: 'money',
    label: 'Money',
    en: 'MONEY',
    name: 'お金の記録',
    icon: 'fa-coins',
    head: '積み上げた数字を、そのまま置く。',
    lead: '資産運用と生活費。評価額・積立額・支出を、感覚ではなく実額で記録しています。',
    description: '資産運用（NISA / iDeCo）と生活費の記録。総資産・評価額・毎月の支出を実額で公開しています。',
    categories: ['asset', 'life']
  },
  {
    key: 'touring',
    label: 'Touring',
    en: 'TOURING',
    name: 'ツーリング',
    icon: 'fa-motorcycle',
    head: '走った道と、寄った店。',
    lead: 'ルート・距離・天気に加えて、旅先で立ち寄ったご当地スーパーも同じ地図に残しています。',
    description: 'ツーリング記録とご当地スーパーのレビュー。ルート・距離・写真・地図つきで残しています。',
    categories: ['touring', 'supermarket']
  },
  {
    key: 'tech',
    label: 'Tech',
    en: 'TECH',
    name: '業務効率化',
    icon: 'fa-gears',
    head: '手作業を、自動化する。',
    lead: 'Excel・Python・BIツールで作業時間を削った記録。再現できる形で書いています。',
    description: 'Excel・Python・BIツールによる業務効率化と自動化の記録。手順を再現できる形でまとめています。',
    categories: ['it']
  }
]

export const THEME_MAP: Record<string, ThemeDef> = Object.fromEntries(
  THEMES.map((t) => [t.key, t])
) as Record<string, ThemeDef>

/** カテゴリキー → 所属テーマ */
export const themeOfCategory = (key?: string | null): ThemeDef | undefined => {
  const c = key ? CATEGORY_MAP[key] : undefined
  return c ? THEME_MAP[c.theme] : undefined
}

/** 旧実装との互換（3テーマをそのまま返す） */
export const GROUPS = THEMES.map((t) => ({
  key: t.key,
  name: t.en,
  label: t.name,
  icon: t.icon
}))

/** サイト名やキャッチコピーはここを書き換えるだけで全ページに反映されます */
export const SITE = {
  title: 'Kurashi Log',
  /** ロゴ下に出る小さな英字キャプション */
  caption: 'MONEY · TOURING · TECH',
  subtitle: 'お金・ツーリング・業務効率化の記録',
  author: 'Owner',
  /** ナビと同じ 3テーマ构成で統一した説明文 */
  description:
    'Money（資産運用・生活費）、Touring（ツーリング・ご当地スーパー）、Tech（業務効率化）。3つのテーマを数字で記録している個人サイト。'
}

/**
 * 「詳しい経緯はこちら」でリンクする自己紹介記事のスラッグ。
 * /about は固定ページなので、ここには「記事本体」のスラッグを並べる。
 * 先に見つかった（公開済みの）ものが使われる。
 */
export const ABOUT_POST_SLUGS = ['post-mtzu8hk0', 'post-mtzu8ga8']

/** 全記事の末尾に自動挿入する免責文 */
export const DISCLAIMER =
  '本記事は個人の記録であり、特定の金融商品の推奨や投資助言ではありません。'

/** トップの「公開記事」カウンタを表示し始める件数 */
export const POST_COUNT_THRESHOLD = 10

/* =========================================================
   SEO / アクセス解析の設定
   ここに値を入れるだけで全ページに反映されます。
   空文字のままなら、そのタグは出力されません。
   ========================================================= */
export const SEO = {
  /**
   * Google Search Console のサイト所有権確認コード。
   * Search Console →「HTMLタグ」で表示される
   * <meta name="google-site-verification" content="ここの文字列" />
   * の content の値だけを貼り付けてください。
   */
  googleSiteVerification: '',

  /**
   * Google Analytics 4 の測定ID（G- から始まる文字列）。
   * GA4 管理画面 → データストリーム で確認できます。
   * 例: 'G-XXXXXXXXXX'
   */
  gaMeasurementId: '',

  /**
   * Google AdSense のパブリッシャーID（ca-pub- から始まる文字列）。
   * 設定すると自動広告用スクリプトが全ページに入ります。
   * 例: 'ca-pub-1234567890123456'
   */
  adsensePublisherId: ''
}

export type Bindings = {
  DB: D1Database
  R2?: R2Bucket
  ADMIN_PASSWORD?: string
  SESSION_SECRET?: string
}
