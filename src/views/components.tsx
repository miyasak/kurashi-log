import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP } from '../lib/config'
import { formatDate, stripMd, yen } from '../lib/utils'

/* ---------- 評価表示 ---------- */
export const Stars: FC<{ value?: number | null; color?: string }> = ({ value, color }) => {
  const v = value ?? 0
  return (
    <span class="inline-flex items-center gap-[3px] align-middle">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          class="fa-solid fa-star text-[10px]"
          style={`color:${i <= v ? color || '#fbbf24' : 'rgba(255,255,255,0.16)'}`}
        ></i>
      ))}
    </span>
  )
}

/* ---------- セクション見出し ---------- */
export const SectionTitle: FC<{
  eyebrow?: string
  title: string
  desc?: string
  align?: 'center' | 'left'
  accent?: string
  icon?: string
}> = ({ eyebrow, title, desc, align = 'center', accent, icon }) => (
  <div class={align === 'center' ? 'mx-auto max-w-text text-center' : 'max-w-2xl'}>
    {eyebrow ? (
      <p
        class={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
          align === 'center' ? 'justify-center' : ''
        }`}
        style={`color:${accent || '#fb923c'}`}
      >
        {icon ? <i class={`fa-solid ${icon} text-[11px]`}></i> : null}
        {eyebrow}
      </p>
    ) : null}
    <h2 class="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[40px]">{title}</h2>
    {desc ? (
      <p
        class={`mt-4 text-[15px] leading-[1.7] text-sub sm:text-[16px] ${
          align === 'center' ? 'mx-auto max-w-[620px]' : ''
        }`}
      >
        {desc}
      </p>
    ) : null}
  </div>
)

/* ---------- カード内画像 ---------- */
const Cover: FC<{ post: Post; ratio: string }> = ({ post, ratio }) => {
  const c = CATEGORY_MAP[post.category]
  if (post.cover_image) {
    return (
      <div class={`relative overflow-hidden bg-panel2 ${ratio}`}>
        <img
          src={post.cover_image}
          alt={post.title}
          loading="lazy"
          class="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
    )
  }
  return (
    <div class={`relative grid place-items-center bg-panel2 ${ratio}`}>
      <i class={`fa-solid ${c?.icon || 'fa-file-lines'} text-[26px]`} style={`color:${c?.accent}`}></i>
    </div>
  )
}

const CARD = 'group block overflow-hidden rounded-big border border-edge2 bg-panel transition duration-500 hover:border-edge hover:-translate-y-1'

/* =========================================================
   記事カード：カテゴリごとに構成を変える
   ========================================================= */
export const PostCard: FC<{ post: Post; showCategory?: boolean; variant?: 'tile' | 'plain' }> = ({
  post,
  showCategory = true
}) => {
  const c = CATEGORY_MAP[post.category]
  const href = `/posts/${post.slug}`

  /* --- ツーリング：写真の上に文字を載せた大判タイル --- */
  if (post.category === 'touring') {
    return (
      <a href={href} class="group relative block overflow-hidden rounded-big border border-edge2 bg-panel transition duration-500 hover:border-edge">
        <div class="relative aspect-[4/5] sm:aspect-[3/4]">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              loading="lazy"
              class="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div class="h-full w-full bg-gradient-to-br from-panel2 to-black"></div>
          )}
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"></div>
          {post.prefecture ? (
            <span class="absolute left-5 top-5 rounded-full bg-black/55 px-3 py-1.5 text-[10.5px] font-semibold tracking-[0.1em] text-white backdrop-blur">
              {post.prefecture}
            </span>
          ) : null}
          <div class="absolute inset-x-0 bottom-0 p-6">
            <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={`color:${c?.accent}`}>
              <i class="fa-solid fa-motorcycle text-[10px]"></i>
              {showCategory ? c?.short : 'RIDE'}
            </p>
            <h3 class="mt-2.5 text-[20px] font-bold leading-snug tracking-[-0.01em] text-white">{post.title}</h3>
            <div class="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-white/65">
              {post.distance_km ? (
                <span><i class="fa-solid fa-route mr-1.5 text-[10px]"></i>{post.distance_km} km</span>
              ) : null}
              {post.duration_text ? (
                <span><i class="fa-regular fa-clock mr-1.5 text-[10px]"></i>{post.duration_text}</span>
              ) : null}
              <span>{formatDate(post.published_at)}</span>
            </div>
          </div>
        </div>
      </a>
    )
  }

  /* --- ご当地スーパー：写真＋評価 --- */
  if (post.category === 'supermarket') {
    return (
      <a href={href} class={CARD}>
        <Cover post={post} ratio="aspect-[16/11]" />
        <div class="p-6">
          <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={`color:${c?.accent}`}>
            <i class="fa-solid fa-basket-shopping text-[10px]"></i>
            {post.prefecture || (showCategory ? c?.short : 'SUPER')}
          </p>
          <h3 class="mt-2.5 text-[18px] font-bold leading-snug tracking-[-0.01em]">{post.title}</h3>
          {post.place_name ? <p class="mt-1.5 text-[13px] text-mute">{post.place_name}</p> : null}
          <div class="mt-5 flex items-end justify-between border-t border-edge2 pt-4">
            <div>
              <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">総合 / コスパ</p>
              <p class="mt-2 flex items-center gap-2.5">
                <Stars value={post.rating} color={c?.accent} />
                <span class="text-[11px] text-mute">/</span>
                <Stars value={post.cospa} />
              </p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">会計</p>
              <p class="mt-1 text-[17px] font-bold tracking-tight">{post.budget ? yen(post.budget) : '—'}</p>
            </div>
          </div>
        </div>
      </a>
    )
  }

  /* --- 資産運用 / 日常の生活：数字を主役にしたタイル --- */
  if (post.category === 'asset' || post.category === 'life') {
    return (
      <a href={href} class={`${CARD} flex h-full flex-col justify-between p-7`}>
        <div>
          <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={`color:${c?.accent}`}>
            <i class={`fa-solid ${c?.icon} text-[10px]`}></i>
            {showCategory ? c?.short : formatDate(post.published_at)}
          </p>
          {post.highlight_value ? (
            <>
              <p class="mt-5 text-[32px] font-bold leading-none tracking-[-0.02em] sm:text-[38px]" style={`color:${c?.accent}`}>
                {post.highlight_value}
              </p>
              <p class="mt-2.5 text-[12px] text-mute">
                {post.highlight_label}
                {post.highlight_sub ? ` ・ ${post.highlight_sub}` : ''}
              </p>
            </>
          ) : null}
          <h3 class="mt-6 text-[18px] font-bold leading-snug tracking-[-0.01em]">{post.title}</h3>
          <p class="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-sub">
            {post.summary || stripMd(post.body, 120)}
          </p>
        </div>
        <p class="mt-6 flex items-center gap-1.5 text-[13px] font-medium" style={`color:${c?.accent}`}>
          続きを読む
          <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
        </p>
      </a>
    )
  }

  /* --- IT / 生成AI：テキスト主体 --- */
  return (
    <a href={href} class={`${CARD} flex h-full flex-col p-7`}>
      <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={`color:${c?.accent}`}>
        <i class="fa-solid fa-microchip text-[10px]"></i>
        {showCategory ? c?.short : formatDate(post.published_at)}
      </p>
      <h3 class="mt-4 text-[19px] font-bold leading-snug tracking-[-0.01em]">{post.title}</h3>
      <p class="mt-3 line-clamp-4 text-[13.5px] leading-relaxed text-sub">{post.summary || stripMd(post.body, 150)}</p>
      {post.tags && post.tags.length ? (
        <div class="mt-5 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((t) => (
            <span class="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-sub">{t}</span>
          ))}
        </div>
      ) : null}
      <p class="mt-auto flex items-center gap-1.5 pt-6 text-[13px] font-medium" style={`color:${c?.accent}`}>
        続きを読む
        <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
      </p>
    </a>
  )
}

/* ---------- 記事なし ---------- */
export const EmptyState: FC<{ text?: string; light?: boolean }> = ({ text }) => (
  <div class="rounded-big border border-edge2 bg-panel px-6 py-16 text-center">
    <i class="fa-regular fa-folder-open text-[26px] text-mute"></i>
    <p class="mt-4 text-[16px] font-semibold tracking-tight text-sub">{text || 'まだ記事がありません'}</p>
    <p class="mt-2 text-[13px] text-mute">
      <a href="/admin" class="text-brand hover:underline">管理画面</a> から記事を追加できます。
    </p>
  </div>
)

/* ---------- 数値スペック（パネル型） ---------- */
export const SpecRow: FC<{
  items: { label: string; value: string; sub?: string; accent?: string }[]
  light?: boolean
  panel?: boolean
}> = ({ items, panel = true }) => (
  <dl
    class={`grid grid-cols-2 gap-y-8 sm:grid-cols-4 ${
      panel ? 'rounded-big border border-edge2 bg-panel px-4 py-8 sm:px-6 sm:py-9' : ''
    }`}
  >
    {items.map((it, i) => (
      <div class={`px-3 text-center ${i > 0 ? 'sm:border-l sm:border-edge2' : ''}`}>
        <dd
          class="text-[26px] font-bold leading-none tracking-[-0.02em] sm:text-[32px]"
          style={it.accent ? `color:${it.accent}` : ''}
        >
          {it.value}
        </dd>
        <dt class="mt-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-mute">{it.label}</dt>
        {it.sub ? <p class="mt-1 text-[11px] text-mute">{it.sub}</p> : null}
      </div>
    ))}
  </dl>
)
