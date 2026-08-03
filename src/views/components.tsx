import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP } from '../lib/config'
import { formatDate, stripMd, yen } from '../lib/utils'

/* ---------- 評価表示（ミニマル） ---------- */
export const Stars: FC<{ value?: number | null; light?: boolean }> = ({ value, light }) => {
  const v = value ?? 0
  return (
    <span class="inline-flex items-center gap-[3px] align-middle">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          class="fa-solid fa-star text-[9px]"
          style={`color:${i <= v ? (light ? '#ffffff' : '#1d1d1f') : light ? 'rgba(255,255,255,.3)' : '#d2d2d7'}`}
        ></i>
      ))}
    </span>
  )
}

/* ---------- セクション見出し（中央寄せ・大判） ---------- */
export const SectionTitle: FC<{
  eyebrow?: string
  title: string
  desc?: string
  align?: 'center' | 'left'
  light?: boolean
  accent?: string
}> = ({ eyebrow, title, desc, align = 'center', light, accent }) => (
  <div class={`${align === 'center' ? 'mx-auto max-w-text text-center' : 'max-w-2xl'}`}>
    {eyebrow ? (
      <p
        class="text-[12px] font-semibold uppercase tracking-[0.14em]"
        style={`color:${accent || (light ? 'rgba(255,255,255,.6)' : '#86868b')}`}
      >
        {eyebrow}
      </p>
    ) : null}
    <h2
      class={`mt-2 text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[44px] ${
        light ? 'text-white' : 'text-ink'
      }`}
    >
      {title}
    </h2>
    {desc ? (
      <p
        class={`mt-4 text-[17px] leading-[1.55] tracking-[-0.01em] ${light ? 'text-white/65' : 'text-sub'} ${
          align === 'center' ? 'mx-auto max-w-[620px]' : ''
        }`}
      >
        {desc}
      </p>
    ) : null}
  </div>
)

/* ---------- カード内画像 ---------- */
const Cover: FC<{ post: Post; ratio: string; rounded?: string }> = ({ post, ratio, rounded = '' }) => {
  const c = CATEGORY_MAP[post.category]
  if (post.cover_image) {
    return (
      <div class={`relative overflow-hidden bg-hazy ${ratio} ${rounded}`}>
        <img
          src={post.cover_image}
          alt={post.title}
          loading="lazy"
          class="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
      </div>
    )
  }
  return (
    <div
      class={`relative grid place-items-center ${ratio} ${rounded}`}
      style={`background:linear-gradient(150deg,${c?.accentSoft || '#f5f5f7'},#ffffff)`}
    >
      <i class={`fa-solid ${c?.icon || 'fa-file-lines'} text-[26px]`} style={`color:${c?.accent}`}></i>
    </div>
  )
}

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
      <a href={href} class="group relative block overflow-hidden rounded-big bg-ink">
        <div class="relative aspect-[4/5] sm:aspect-[3/4]">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              loading="lazy"
              class="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div class="h-full w-full bg-gradient-to-br from-[#1d1d1f] to-[#3a3a3c]"></div>
          )}
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5"></div>
          <div class="absolute inset-x-0 bottom-0 p-6">
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {post.prefecture || (showCategory ? c?.short : '')}
            </p>
            <h3 class="mt-2 text-[21px] font-semibold leading-tight tracking-[-0.01em] text-white">{post.title}</h3>
            <div class="mt-3 flex items-center gap-4 text-[12px] text-white/70">
              {post.distance_km ? <span>{post.distance_km} km</span> : null}
              {post.duration_text ? <span>{post.duration_text}</span> : null}
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
      <a href={href} class="group block overflow-hidden rounded-big bg-hazy">
        <Cover post={post} ratio="aspect-[16/11]" />
        <div class="p-6">
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
            {post.prefecture || (showCategory ? c?.short : 'SUPER')}
          </p>
          <h3 class="mt-2 text-[19px] font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
          {post.place_name ? <p class="mt-1.5 text-[13px] text-sub">{post.place_name}</p> : null}
          <div class="mt-5 flex items-end justify-between border-t border-black/[0.08] pt-4">
            <div>
              <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">総合 / コスパ</p>
              <p class="mt-1.5 flex items-center gap-2">
                <Stars value={post.rating} />
                <span class="text-[11px] text-mute">|</span>
                <Stars value={post.cospa} />
              </p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">会計</p>
              <p class="mt-1 text-[17px] font-semibold tracking-tight">{post.budget ? yen(post.budget) : '—'}</p>
            </div>
          </div>
        </div>
      </a>
    )
  }

  /* --- 資産運用 / 日常の生活：数字を主役にしたタイル --- */
  if (post.category === 'asset' || post.category === 'life') {
    return (
      <a href={href} class="group flex h-full flex-col justify-between rounded-big bg-hazy p-7 transition hover:bg-[#eeeef0]">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em]" style={`color:${c?.accent}`}>
            {showCategory ? c?.short : formatDate(post.published_at)}
          </p>
          {post.highlight_value ? (
            <>
              <p class="mt-5 text-[34px] font-semibold leading-none tracking-[-0.02em] sm:text-[40px]">
                {post.highlight_value}
              </p>
              <p class="mt-2 text-[12px] text-mute">
                {post.highlight_label}
                {post.highlight_sub ? ` ・ ${post.highlight_sub}` : ''}
              </p>
            </>
          ) : null}
          <h3 class="mt-6 text-[19px] font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
          <p class="mt-2 line-clamp-3 text-[14px] leading-relaxed text-sub">
            {post.summary || stripMd(post.body, 120)}
          </p>
        </div>
        <p class="mt-6 flex items-center gap-1.5 text-[13px] text-blue">
          続きを読む
          <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
        </p>
      </a>
    )
  }

  /* --- IT / 生成AI：テキスト主体 --- */
  return (
    <a href={href} class="group flex h-full flex-col rounded-big bg-hazy p-7 transition hover:bg-[#eeeef0]">
      <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
        {showCategory ? c?.short : formatDate(post.published_at)}
      </p>
      <h3 class="mt-4 text-[20px] font-semibold leading-snug tracking-[-0.01em]">{post.title}</h3>
      <p class="mt-3 line-clamp-4 text-[14px] leading-relaxed text-sub">{post.summary || stripMd(post.body, 150)}</p>
      {post.tags && post.tags.length ? (
        <p class="mt-5 text-[12px] text-mute">{post.tags.slice(0, 3).map((t) => `#${t}`).join('  ')}</p>
      ) : null}
      <p class="mt-auto flex items-center gap-1.5 pt-6 text-[13px] text-blue">
        続きを読む
        <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
      </p>
    </a>
  )
}

/* ---------- 記事なし ---------- */
export const EmptyState: FC<{ text?: string; light?: boolean }> = ({ text, light }) => (
  <div class={`rounded-big px-6 py-16 text-center ${light ? 'bg-white/5' : 'bg-hazy'}`}>
    <p class={`text-[17px] font-medium tracking-tight ${light ? 'text-white/70' : 'text-sub'}`}>
      {text || 'まだ記事がありません'}
    </p>
    <p class={`mt-2 text-[13px] ${light ? 'text-white/40' : 'text-mute'}`}>
      <a href="/admin" class="underline">管理画面</a> から記事を追加できます。
    </p>
  </div>
)

/* ---------- 数値スペック（Appleのテックスペック風） ---------- */
export const SpecRow: FC<{ items: { label: string; value: string; sub?: string }[]; light?: boolean }> = ({
  items,
  light
}) => (
  <dl class="grid grid-cols-2 gap-y-9 sm:grid-cols-4">
    {items.map((it) => (
      <div class="px-2 text-center">
        <dd
          class={`text-[26px] font-semibold leading-none tracking-[-0.02em] sm:text-[32px] ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          {it.value}
        </dd>
        <dt class={`mt-2.5 text-[12px] ${light ? 'text-white/55' : 'text-mute'}`}>{it.label}</dt>
        {it.sub ? <p class={`mt-1 text-[11px] ${light ? 'text-white/40' : 'text-mute'}`}>{it.sub}</p> : null}
      </div>
    ))}
  </dl>
)
