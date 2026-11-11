import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP, ACCENT, dateLabel } from '../lib/config'
import { formatDate, stripMd, yen } from '../lib/utils'

/* ---------- 評価表示 ---------- */
export const Stars: FC<{ value?: number | null; color?: string }> = ({ value }) => {
  const v = value ?? 0
  return (
    <span class="inline-flex items-center gap-[3px] align-middle">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          class={`fa-solid ${i - 0.5 === v || (i - v > 0 && i - v < 1) ? 'fa-star-half-stroke' : 'fa-star'} text-[9.5px]`}
          style={`color:${i - 0.5 <= v ? ACCENT : 'rgba(0,0,0,0.14)'}`}
        ></i>
      ))}
      {v % 1 ? <span class="ml-1 font-mono text-[10px] tabular-nums text-mute">{v.toFixed(1)}</span> : null}
    </span>
  )
}

/* 評価ランク。rating は数値のまま持ち、表示だけ S/A/B/C に変換する
   5=S / 4=A / 3=B / 2=C / 1=D。基準は /about#rank に置く */
export const RankBadge: FC<{ value?: number | null; link?: boolean }> = ({ value, link = true }) => {
  if (value === null || value === undefined) return null
  const n = Math.min(5, Math.max(1, Math.round(value)))
  const letter = ['D', 'C', 'B', 'A', 'S'][n - 1]
  const cls = `rank rank-${letter.toLowerCase()}`
  return link ? (
    <a href="/about#rank" class={cls} title="評価基準を見る">{letter}</a>
  ) : (
    <span class={cls}>{letter}</span>
  )
}

/* =========================================================
   セクション見出し（左揃え・小さめ）
   ========================================================= */
export const SectionTitle: FC<{
  eyebrow?: string
  title: string
  desc?: string
  align?: 'center' | 'left'
  accent?: string
  icon?: string
  /** 右側に置く「すべて見る」などのリンク */
  action?: any
}> = ({ eyebrow, title, desc, icon, action }) => (
  <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
    <div class="min-w-0">
      <h2 class="mt-0 text-[19px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[23px]">
        {title}
      </h2>
      {desc ? <p class="mt-2 max-w-[62ch] text-[14px] leading-[1.75] text-sub">{desc}</p> : null}
    </div>
    {action ? <div class="shrink-0">{action}</div> : null}
  </div>
)

/* ---------- カード内画像 ---------- */
export const Cover: FC<{ post: Post; ratio?: string }> = ({ post, ratio = 'aspect-[16/9]' }) => {
  const c = CATEGORY_MAP[post.category]
  if (post.cover_image) {
    return (
      <div class={`relative overflow-hidden bg-panel2 ${ratio}`}>
        <img
          src={post.cover_image}
          alt={post.title}
          loading="lazy"
          class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
    )
  }
  /* 画像未登録のプレースホルダー（ツーリング・スーパー記事で必ず表示） */
  return (
    <div
      class={`relative grid place-items-center ${ratio}`}
      style="background:linear-gradient(135deg,rgba(249,115,22,0.10),#18181b)"
    >
      <div class="text-center">
        <i class={`fa-solid ${c?.icon || 'fa-file-lines'} text-[22px] text-brand/55`}></i>
        <p class="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-mute">
          {c?.short || 'POST'}
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   記事カード（全カテゴリ共通のカード型）
   カテゴリバッジ・日付・タイトル・リード文2行 + カテゴリ固有の数値
   ========================================================= */
export const PostCard: FC<{ post: Post; showCategory?: boolean; variant?: 'tile' | 'plain' }> = ({
  post,
  showCategory = true
}) => {
  const c = CATEGORY_MAP[post.category]
  const href = `/posts/${post.slug}`
  const lead = post.summary || stripMd(post.body, 110)
  /**
   * サムネイル枠の扱い
   * - ツーリング / ご当地スーパーは写真が主役なので、画像が無くても枠を必ず置く
   *   （一覧の見た目が揃い、画像の入れ忘れにも気づける）
   * - それ以外（資産運用・生活費・IT）は画像が無ければ枠を作らず文字主体にする
   */
  const PHOTO_CATS = ['touring', 'supermarket']
  const needsFrame = PHOTO_CATS.includes(post.category)
  const hasImage = !!post.cover_image
  const showFrame = hasImage || needsFrame

  /** カテゴリごとの「数字」行 */
  const metrics: { label: string; value: string; stars?: number | null }[] = []
  if (post.category === 'touring') {
    if (post.distance_km) metrics.push({ label: '走行距離', value: `${post.distance_km.toLocaleString()} km` })
    if (post.prefecture) metrics.push({ label: 'エリア', value: post.prefecture })
  } else if (post.category === 'supermarket') {
    if (post.budget) metrics.push({ label: '会計', value: yen(post.budget) })
    if (post.rating) metrics.push({ label: '総合', value: '', stars: post.rating })
  } else if (post.highlight_value) {
    metrics.push({ label: post.highlight_label || '数値', value: post.highlight_value })
  }

  return (
    <a
      href={href}
      class="group flex h-full flex-col overflow-hidden rounded-big border border-edge2 bg-panel transition duration-300 hover:border-brand/40"
    >
      {showFrame ? <Cover post={post} ratio="aspect-[16/9]" /> : null}
      <div class="flex flex-1 flex-col p-4 sm:p-5">
        {/* バッジ + 日付 */}
        <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {showCategory !== false ? (
            <span class="inline-flex items-center gap-1.5 rounded-full bg-brandsoft px-2 py-[3px] text-[10px] font-bold tracking-[0.08em] text-brand">
              <i class={`fa-solid ${c?.icon} text-[9px]`}></i>
              {c?.name}
            </span>
          ) : null}
          <time class="font-mono text-[11px] tabular-nums text-mute">
            {post.visit_date
              ? `${dateLabel(post.category)} ${formatDate(post.visit_date)}`
              : formatDate(post.published_at)}
          </time>
        </div>

        {/* タイトル：画像枠がない記事は少し大きく見せる */}
        <h3
          class={`mt-2.5 font-bold leading-[1.45] tracking-[-0.01em] text-ink transition group-hover:text-brand ${
            showFrame ? 'text-[15.5px]' : 'text-[16.5px]'
          }`}
        >
          {post.title}
        </h3>

        {/* リード文（画像枠がない場合は3行まで見せる） */}
        {lead ? (
          <p
            class={`mt-2 text-[13.5px] leading-[1.7] text-sub ${
              showFrame ? 'line-clamp-2' : 'line-clamp-3'
            }`}
          >
            {lead}
          </p>
        ) : null}

        {/* 数字 */}
        {metrics.length ? (
          <dl class="mt-auto flex flex-wrap items-baseline gap-x-5 gap-y-1.5 border-t border-edge2 pt-3.5" style="margin-top:auto">
            {metrics.map((m) => (
              <div>
                <dt class="text-[9.5px] font-bold uppercase tracking-[0.1em] text-mute">{m.label}</dt>
                <dd class="mt-0.5 font-mono text-[15px] font-bold tabular-nums tracking-tight text-brand">
                  {m.stars != null ? <Stars value={m.stars} /> : m.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div class="mt-auto pt-3"></div>
        )}
      </div>
    </a>
  )
}

/* =========================================================
   記事一覧グリッド（PC3列 / タブレット2列 / モバイル1列）
   ========================================================= */
export const PostGrid: FC<{ posts: Post[]; showCategory?: boolean }> = ({ posts, showCategory = true }) => (
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {posts.map((p) => (
      <PostCard post={p} showCategory={showCategory} />
    ))}
  </div>
)

/* ---------- 記事なし（管理画面リンクは出さない） ---------- */
export const EmptyState: FC<{ text?: string; light?: boolean }> = ({ text }) => (
  <div class="rounded-big border border-edge2 bg-panel px-5 py-10 text-center">
    <i class="fa-regular fa-folder-open text-[20px] text-mute"></i>
    <p class="mt-3 text-[14.5px] text-sub">{text || '該当する記事が見つかりませんでした'}</p>
  </div>
)

/* =========================================================
   数値スペック
   0件（値なし）の項目は自動的に除外される。
   有効な項目が1つも無ければ null を返し、呼び出し側で非表示にできる。
   ========================================================= */
export type SpecItem = { label: string; value: string; sub?: string; accent?: string }

/** 「—」「0」など意味のない値を落とす */
export const validSpecs = (items: SpecItem[]) =>
  items.filter((it) => {
    const v = String(it.value ?? '').trim()
    if (!v || v === '—' || v === '0' || v === '¥0') return false
    return true
  })

export const SpecRow: FC<{
  items: SpecItem[]
  light?: boolean
  panel?: boolean
}> = ({ items, panel = true }) => {
  const list = validSpecs(items)
  if (!list.length) return null
  return (
    <dl
      class={`flex flex-wrap gap-x-8 gap-y-5 ${
        panel ? 'rounded-big border border-edge2 bg-panel px-5 py-5' : ''
      }`}
    >
      {list.map((it) => (
        <div class="min-w-[104px]">
          <dt class="text-[10px] font-bold uppercase tracking-[0.12em] text-mute">{it.label}</dt>
          <dd class="mt-1.5 font-mono text-[22px] font-bold leading-none tabular-nums tracking-tight text-ink sm:text-[26px]">
            {it.value}
          </dd>
          {it.sub ? <p class="mt-1.5 text-[11px] text-mute">{it.sub}</p> : null}
        </div>
      ))}
    </dl>
  )
}


/** シリーズの前後ナビ（← Day6 ／ Day8 →） */
const seriesKey = (title: string) => {
  const parts = title.split('｜').map((t) => t.trim()).filter(Boolean)
  let t = parts.length >= 3 ? parts[1] : parts[parts.length - 1]
  if (t.length > 18) t = t.split(/[、。]/)[0]
  return t
}

export const SeriesNav: FC<{
  series: { prev: any; next: any; total: number; index: number }
  label?: string
}> = ({ series, label = 'この旅の記録' }) => {
  if (!series || (!series.prev && !series.next)) return null
  const { prev, next } = series

  return (
    <nav class="mt-10 border-t border-edge2 pt-6">
      <p class="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">{label}</p>
      <div class="mt-3 grid gap-2.5 sm:grid-cols-2">
        {prev ? (
          <a
            href={`/posts/${prev.slug}`}
            class="group flex items-center gap-3 rounded-big border border-edge2 bg-panel p-4 transition hover:border-brand/40"
          >
            <i class="fa-solid fa-chevron-left text-[11px] text-mute transition group-hover:text-brand"></i>
            <span class="min-w-0">
              <span class="block text-[10.5px] font-bold tracking-[0.06em] text-mute">
                Day {prev.series_day}
              </span>
              <span class="mt-0.5 block truncate text-[14px] font-medium text-ink transition group-hover:text-brand">
                {seriesKey(prev.title)}
              </span>
            </span>
          </a>
        ) : (
          <span></span>
        )}
        {next ? (
          <a
            href={`/posts/${next.slug}`}
            class="group flex items-center justify-end gap-3 rounded-big border border-edge2 bg-panel p-4 text-right transition hover:border-brand/40"
          >
            <span class="min-w-0">
              <span class="block text-[10.5px] font-bold tracking-[0.06em] text-mute">
                Day {next.series_day}
              </span>
              <span class="mt-0.5 block truncate text-[14px] font-medium text-ink transition group-hover:text-brand">
                {seriesKey(next.title)}
              </span>
            </span>
            <i class="fa-solid fa-chevron-right text-[11px] text-mute transition group-hover:text-brand"></i>
          </a>
        ) : null}
      </div>
    </nav>
  )
}
