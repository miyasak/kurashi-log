import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP } from '../lib/config'
import { formatDate, stripMd, yen } from '../lib/utils'
import { CategoryChip } from './layout'

export const Stars: FC<{ value?: number | null; color?: string }> = ({ value, color = '#f59e0b' }) => {
  const v = value ?? 0
  return (
    <span class="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          class={`fa-solid fa-star text-[10px]`}
          style={`color:${i <= v ? color : '#e2e8f0'}`}
        ></i>
      ))}
    </span>
  )
}

const CoverImg: FC<{ post: Post; ratio: string }> = ({ post, ratio }) => {
  const c = CATEGORY_MAP[post.category]
  if (post.cover_image) {
    return (
      <div class={`relative w-full overflow-hidden bg-slate-100 ${ratio}`}>
        <img
          src={post.cover_image}
          alt={post.title}
          loading="lazy"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
    )
  }
  return (
    <div
      class={`relative grid w-full place-items-center ${ratio}`}
      style={`background:linear-gradient(135deg, ${c?.accentSoft || '#f1f5f9'}, #ffffff)`}
    >
      <i class={`fa-solid ${c?.icon || 'fa-file-lines'} text-3xl`} style={`color:${c?.accent}`}></i>
    </div>
  )
}

/** カテゴリごとに見せ方を変える記事カード */
export const PostCard: FC<{ post: Post; showCategory?: boolean }> = ({ post, showCategory = true }) => {
  const c = CATEGORY_MAP[post.category]
  const href = `/posts/${post.slug}`

  // ご当地スーパー: 評価とコスパを前面に
  if (post.category === 'supermarket') {
    return (
      <a href={href} class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
        <CoverImg post={post} ratio="aspect-[16/10]" />
        <div class="flex flex-1 flex-col p-4">
          <div class="flex flex-wrap items-center gap-2">
            {showCategory ? <CategoryChip cat={post.category} /> : null}
            {post.prefecture ? (
              <span class="text-[11px] font-semibold text-ink-mute">
                <i class="fa-solid fa-location-dot mr-1"></i>
                {post.prefecture}
              </span>
            ) : null}
          </div>
          <h3 class="mt-2 line-clamp-2 text-[15px] font-bold leading-snug group-hover:text-rose-600">{post.title}</h3>
          {post.place_name ? <p class="mt-1 text-xs font-medium text-ink-soft">{post.place_name}</p> : null}
          <div class="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center">
            <div>
              <p class="text-[9px] font-bold tracking-wider text-ink-mute">総合</p>
              <Stars value={post.rating} color="#f43f5e" />
            </div>
            <div class="border-x border-slate-200">
              <p class="text-[9px] font-bold tracking-wider text-ink-mute">コスパ</p>
              <Stars value={post.cospa} />
            </div>
            <div>
              <p class="text-[9px] font-bold tracking-wider text-ink-mute">会計</p>
              <p class="text-[12px] font-extrabold">{post.budget ? yen(post.budget) : '—'}</p>
            </div>
          </div>
          <p class="mt-3 text-[11px] text-ink-mute">{formatDate(post.visit_date || post.published_at)}</p>
        </div>
      </a>
    )
  }

  // ツーリング: 距離・天気などのスペックを表示
  if (post.category === 'touring') {
    return (
      <a href={href} class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
        <div class="relative">
          <CoverImg post={post} ratio="aspect-[16/10]" />
          {post.distance_km ? (
            <span class="absolute bottom-2 left-2 rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">
              <i class="fa-solid fa-route mr-1 text-[9px]"></i>
              {post.distance_km} km
            </span>
          ) : null}
        </div>
        <div class="flex flex-1 flex-col p-4">
          <div class="flex flex-wrap items-center gap-2">
            {showCategory ? <CategoryChip cat={post.category} /> : null}
            {post.prefecture ? (
              <span class="text-[11px] font-semibold text-ink-mute">
                <i class="fa-solid fa-location-dot mr-1"></i>
                {post.prefecture}
              </span>
            ) : null}
          </div>
          <h3 class="mt-2 line-clamp-2 text-[15px] font-bold leading-snug group-hover:text-sky-600">{post.title}</h3>
          <p class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
            {post.summary || stripMd(post.body)}
          </p>
          <div class="mt-auto flex items-center gap-3 pt-3 text-[11px] text-ink-mute">
            <span>{formatDate(post.published_at)}</span>
            {post.weather ? <span><i class="fa-solid fa-cloud-sun mr-1"></i>{post.weather}</span> : null}
            {post.bike ? <span><i class="fa-solid fa-motorcycle mr-1"></i>{post.bike}</span> : null}
          </div>
        </div>
      </a>
    )
  }

  // 資産運用 / 生活: 数値ハイライト重視のリスト型カード
  if (post.category === 'asset' || post.category === 'life') {
    return (
      <a href={href} class="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
        <div
          class="hidden h-16 w-16 shrink-0 place-items-center rounded-xl sm:grid"
          style={`background:${c?.accentSoft};color:${c?.accent}`}
        >
          <i class={`fa-solid ${c?.icon} text-xl`}></i>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            {showCategory ? <CategoryChip cat={post.category} /> : null}
            <span class="text-[11px] text-ink-mute">{formatDate(post.published_at)}</span>
          </div>
          <h3 class="mt-2 line-clamp-2 text-[15px] font-bold leading-snug group-hover:opacity-70">{post.title}</h3>
          <p class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
            {post.summary || stripMd(post.body)}
          </p>
          {post.highlight_value ? (
            <div class="mt-3 inline-flex items-baseline gap-2 rounded-xl px-3 py-2" style={`background:${c?.accentSoft}`}>
              <span class="text-[10px] font-bold tracking-wide text-ink-soft">
                {post.highlight_label || 'HIGHLIGHT'}
              </span>
              <span class="text-base font-extrabold" style={`color:${c?.accent}`}>{post.highlight_value}</span>
              {post.highlight_sub ? <span class="text-[11px] font-semibold text-ink-soft">{post.highlight_sub}</span> : null}
            </div>
          ) : null}
        </div>
      </a>
    )
  }

  // IT: シンプル / 技術記事風
  return (
    <a href={href} class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div class="flex flex-wrap items-center gap-2">
        {showCategory ? <CategoryChip cat={post.category} /> : null}
        <span class="text-[11px] text-ink-mute">{formatDate(post.published_at)}</span>
      </div>
      <h3 class="mt-2.5 line-clamp-2 text-[15px] font-bold leading-snug group-hover:text-violet-600">{post.title}</h3>
      <p class="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-soft">{post.summary || stripMd(post.body, 140)}</p>
      {post.tags && post.tags.length ? (
        <div class="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((t) => (
            <span class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-ink-soft">#{t}</span>
          ))}
        </div>
      ) : null}
    </a>
  )
}

export const SectionHeading: FC<{
  eyebrow?: string
  title: string
  desc?: string
  href?: string
  color?: string
}> = ({ eyebrow, title, desc, href, color }) => (
  <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      {eyebrow ? (
        <p class="text-[11px] font-extrabold tracking-[0.18em]" style={`color:${color || '#94a3b8'}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 class="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
      {desc ? <p class="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-ink-soft">{desc}</p> : null}
    </div>
    {href ? (
      <a
        href={href}
        class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-soft transition hover:border-slate-300 hover:text-ink"
      >
        もっと見る<i class="fa-solid fa-arrow-right text-[10px]"></i>
      </a>
    ) : null}
  </div>
)

export const EmptyState: FC<{ text?: string }> = ({ text }) => (
  <div class="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
    <i class="fa-regular fa-file-lines text-3xl text-slate-300"></i>
    <p class="mt-3 text-sm font-semibold text-ink-soft">{text || 'まだ記事がありません'}</p>
    <p class="mt-1 text-xs text-ink-mute">
      管理画面（<a href="/admin" class="underline">/admin</a>）から記事を追加できます。
    </p>
  </div>
)
