/* =========================================================
   テーマ構成
   大テーマは Money / Touring / Tech の3つ。
   記事のカテゴリ（DBの posts.category）はこれまで通り5種類のままで、
   それぞれをテーマ配下の「サブカテゴリ」として扱います。
   ========================================================= */

export type CategoryKey = 'asset' | 'life' | 'touring' | 'camp' | 'supermarket' | 'it' | 'onsen'
export type ThemeKey = 'money' | 'touring' | 'tech' | 'spa'

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
    'camp',
    'touring',
    'キャンプ場',
    'CAMP',
    'fa-campground',
    '泊まった場所の設備メモ',
    '料金・予約の要否・トイレ・炊事場・直火の可否。実際に泊まって確かめた設備を記録します。'
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
  ),
  cat(
    'onsen',
    'spa',
    '日帰り温泉',
    'SPA',
    'fa-mug-hot',
    '立ち寄った湯の記録',
    '泉質・料金・営業時間と、旅の途中での寄りやすさ。実際に入った湯を記録します。'
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
    description: 'ツーリング記録・キャンプ場・ご当地スーパーのレビュー。ルート・距離・写真・地図つきで残しています。',
    categories: ['touring', 'camp', 'supermarket']
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
  },
  {
    key: 'spa',
    label: 'Spa',
    en: 'SPA',
    name: '日帰り温泉',
    icon: 'fa-mug-hot',
    head: '走ったあとに、湯へ寄る。',
    lead: '旅先で入った日帰り温泉。泉質・料金・営業時間を、入った日の記録として残しています。',
    description: '日帰り温泉の記録。泉質・料金・営業時間・アクセスをまとめています。',
    categories: ['onsen']
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
  title: 'Tadoreru',
  /** ロゴ下に出る小さな英字キャプション */
  caption: 'MONEY · TOURING · SPA · TECH',
  subtitle: '走った道も、積み上げた数字も、あとから辿れるように。',
  author: 'Owner',
  /** ナビと同じ 4テーマ構成で統一した説明文 */
  description:
    'Money（資産運用・生活費）、Touring（ツーリング・キャンプ場・ご当地スーパー）、Spa（日帰り温泉）、Tech（業務効率化）。4つのテーマを数字で記録している個人サイト。'
}

/**
 * 「詳しい経緯はこちら」でリンクする自己紹介記事のスラッグ。
 * /about は固定ページなので、ここには「記事本体」のスラッグを並べる。
 * 先に見つかった（公開済みの）ものが使われる。
 */
export const ABOUT_POST_SLUGS = ['post-mtzu8hk0', 'post-mtzu8ga8']

/** カテゴリ別の免責文。空文字のカテゴリは免責文ごと非表示になる */
export const DISCLAIMERS: Record<string, string> = {
  asset: '本記事は個人の記録であり、特定の金融商品の推奨や投資・税務上の助言ではありません。制度の適用可否は個々の状況によって異なります。',
  life: '本記事は個人の記録であり、特定の金融商品の推奨や投資・税務上の助言ではありません。制度の適用可否は個々の状況によって異なります。',
  touring: '道路状況・施設の営業状況は訪問時点のものです。最新情報は各公式サイトでご確認ください。',
  camp: '道路状況・施設の営業状況は訪問時点のものです。最新情報は各公式サイトでご確認ください。',
  supermarket: '価格・品揃え・営業時間は訪問時点のものです。最新情報は各公式サイトでご確認ください。',
  onsen: '料金・営業時間・休業日は訪問時点のものです。最新情報は各施設の公式サイトでご確認ください。',
  it: ''
}

/** 旧実装との互換 */
export const DISCLAIMER = DISCLAIMERS.asset

/** カテゴリに対応する免責文を返す。未設定なら空文字 */
export const disclaimerOf = (category?: string | null): string =>
  (category && DISCLAIMERS[category]) || ''


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
  DEV_MEDIA_ORIGIN?: string
  ADMIN_PASSWORD?: string
  SESSION_SECRET?: string
}

/* 地図に出すカテゴリ（場所のある記事だけ） */
export const MAP_CATEGORIES = ['touring', 'supermarket', 'camp', 'onsen']
export const MAP_CAT_SQL = MAP_CATEGORIES.map((c) => `'${c}'`).join(',')

/** タグを「エリア」と「種類」に振り分けるための地名一覧。
    ここに含まれるタグはエリア行へ、それ以外は種類行へ並ぶ */
export const AREA_TAGS = [
  '北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州', '沖縄',
  '青森', '岩手', '宮城', '秋田', '山形', '福島',
  '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
  '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知',
  '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山',
  '鳥取', '島根', '岡山', '広島', '山口',
  '徳島', '香川', '愛媛', '高知',
  '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島'
]