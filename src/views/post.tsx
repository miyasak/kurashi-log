import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP } from '../lib/config'
import { formatDate, yen } from '../lib/utils'
import { Stars, PostCard } from './components'

type Props = { post: Post; html: string; related: Post[] }

export const PostPage: FC<Props> = ({ post, html, related }) => {
  const cat = CATEGORY_MAP[post.category]
  const hasGeo = post.lat != null && post.lng != null

  return (
    <>
      <article>
        {/* ヘッダー */}
        <header
          class="border-b border-slate-200"
          style={`background:linear-gradient(160deg, ${cat?.accentSoft} 0%, #ffffff 70%)`}
        >
          <div class="mx-auto max-w-3xl px-4 py-9 sm:px-6 sm:py-12">
            <nav class="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-ink-mute">
              <a href="/" class="hover:text-ink">HOME</a>
              <i class="fa-solid fa-chevron-right text-[8px]"></i>
              <a href={`/category/${post.category}`} class="hover:text-ink" style={`color:${cat?.accent}`}>
                {cat?.name}
              </a>
            </nav>
            <h1 class="mt-4 text-[26px] font-black leading-tight tracking-tight sm:text-[34px]">{post.title}</h1>
            {post.summary ? (
              <p class="mt-4 text-[13.5px] leading-relaxed text-ink-soft sm:text-[15px]">{post.summary}</p>
            ) : null}
            <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] font-semibold text-ink-mute">
              <span><i class="fa-regular fa-calendar mr-1.5"></i>{formatDate(post.published_at || post.created_at)}</span>
              {post.place_name ? <span><i class="fa-solid fa-location-dot mr-1.5"></i>{post.place_name}</span> : null}
              {post.prefecture ? <span>{post.prefecture}</span> : null}
              {post.status === 'draft' ? (
                <span class="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">下書きプレビュー</span>
              ) : null}
            </div>
            {post.tags && post.tags.length ? (
              <div class="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <a
                    href={`/tags/${encodeURIComponent(t)}`}
                    class="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-ink-soft shadow-sm transition hover:text-ink"
                  >
                    #{t}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              class="mb-8 w-full rounded-2xl border border-slate-200 object-cover shadow-soft"
            />
          ) : null}

          {/* カテゴリ別スペックパネル */}
          <SpecPanel post={post} />

          {/* 本文 */}
          <div class="post-body" dangerouslySetInnerHTML={{ __html: html }}></div>

          {/* フォトギャラリー */}
          {post.photos && post.photos.length ? (
            <section class="mt-10">
              <h2 class="text-sm font-extrabold">
                <i class="fa-solid fa-images mr-2" style={`color:${cat?.accent}`}></i>フォト
              </h2>
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                {post.photos.map((ph) => (
                  <figure class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img src={ph.url} alt={ph.caption || ''} loading="lazy" class="h-56 w-full object-cover" />
                    {ph.caption ? (
                      <figcaption class="px-3.5 py-2.5 text-[11.5px] text-ink-soft">{ph.caption}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {/* 地図 */}
          {hasGeo ? (
            <section class="mt-10">
              <h2 class="text-sm font-extrabold">
                <i class="fa-solid fa-map-location-dot mr-2" style={`color:${cat?.accent}`}></i>場所
              </h2>
              <div
                id="post-map"
                class="mt-4 h-[320px] w-full overflow-hidden rounded-2xl border border-slate-200"
                data-lat={String(post.lat)}
                data-lng={String(post.lng)}
                data-label={post.place_name || post.title}
                data-cat={post.category}
              ></div>
              <div class="mt-2.5 flex flex-wrap gap-3 text-[11.5px] font-semibold text-ink-soft">
                {post.address ? <span><i class="fa-solid fa-location-dot mr-1.5 text-ink-mute"></i>{post.address}</span> : null}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`}
                  target="_blank"
                  rel="noopener"
                  class="text-sky-600 hover:underline"
                >
                  Googleマップで開く<i class="fa-solid fa-arrow-up-right-from-square ml-1 text-[9px]"></i>
                </a>
              </div>
            </section>
          ) : null}

          {/* シェア */}
          <div class="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-6">
            <span class="text-[11px] font-bold tracking-wider text-ink-mute">SHARE</span>
            <button
              class="js-share rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-slate-300"
              data-title={post.title}
            >
              <i class="fa-solid fa-share-nodes mr-1.5"></i>共有
            </button>
            <button class="js-copy rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-ink-soft transition hover:border-slate-300">
              <i class="fa-regular fa-copy mr-1.5"></i>URLをコピー
            </button>
            <a
              href={`/category/${post.category}`}
              class="ml-auto text-xs font-bold hover:underline"
              style={`color:${cat?.accent}`}
            >
              {cat?.name}の記事一覧 →
            </a>
          </div>
        </div>
      </article>

      {related.length ? (
        <section class="border-t border-slate-200 bg-white">
          <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 class="mb-6 text-lg font-extrabold tracking-tight">関連する記事</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard post={p} showCategory={false} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

const SpecPanel: FC<{ post: Post }> = ({ post }) => {
  const cat = CATEGORY_MAP[post.category]
  const cell = (label: string, value: any, icon?: string) =>
    value !== null && value !== undefined && value !== '' ? (
      <div class="rounded-xl bg-white p-3">
        <p class="text-[10px] font-bold tracking-wider text-ink-mute">
          {icon ? <i class={`fa-solid ${icon} mr-1`}></i> : null}
          {label}
        </p>
        <p class="mt-1 text-[13px] font-extrabold">{value}</p>
      </div>
    ) : null

  if (post.category === 'touring') {
    const cells = [
      cell('走行距離', post.distance_km ? `${post.distance_km} km` : null, 'fa-route'),
      cell('所要時間', post.duration_text, 'fa-clock'),
      cell('天気', post.weather, 'fa-cloud-sun'),
      cell('車両', post.bike, 'fa-motorcycle')
    ].filter(Boolean)
    if (!cells.length && !post.route_text) return null
    return (
      <div class="mb-8 rounded-2xl p-4" style={`background:${cat?.accentSoft}`}>
        {cells.length ? <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">{cells}</div> : null}
        {post.route_text ? (
          <div class="mt-2 rounded-xl bg-white p-3">
            <p class="text-[10px] font-bold tracking-wider text-ink-mute"><i class="fa-solid fa-diagram-project mr-1"></i>ルート</p>
            <p class="mt-1 text-[12.5px] font-semibold leading-relaxed">{post.route_text}</p>
          </div>
        ) : null}
      </div>
    )
  }

  if (post.category === 'supermarket') {
    return (
      <div class="mb-8 rounded-2xl p-4" style={`background:${cat?.accentSoft}`}>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div class="rounded-xl bg-white p-3">
            <p class="text-[10px] font-bold tracking-wider text-ink-mute">総合評価</p>
            <p class="mt-1"><Stars value={post.rating} color="#f43f5e" /></p>
          </div>
          <div class="rounded-xl bg-white p-3">
            <p class="text-[10px] font-bold tracking-wider text-ink-mute">コスパ</p>
            <p class="mt-1"><Stars value={post.cospa} /></p>
          </div>
          {cell('会計金額', post.budget ? yen(post.budget) : null, 'fa-yen-sign')}
          {cell('訪問日', formatDate(post.visit_date) || null, 'fa-calendar-check')}
        </div>
        {post.business_hours || post.address ? (
          <div class="mt-2 grid gap-2 sm:grid-cols-2">
            {cell('営業時間', post.business_hours, 'fa-clock')}
            {cell('住所', post.address, 'fa-location-dot')}
          </div>
        ) : null}
      </div>
    )
  }

  if ((post.category === 'asset' || post.category === 'life') && post.highlight_value) {
    return (
      <div class="mb-8 flex flex-wrap items-center gap-4 rounded-2xl p-5" style={`background:${cat?.accentSoft}`}>
        <div>
          <p class="text-[11px] font-bold tracking-wider text-ink-soft">{post.highlight_label || 'HIGHLIGHT'}</p>
          <p class="mt-1 text-3xl font-black tracking-tight" style={`color:${cat?.accent}`}>
            {post.highlight_value}
          </p>
        </div>
        {post.highlight_sub ? (
          <p class="rounded-xl bg-white px-3.5 py-2 text-[12px] font-bold text-ink-soft">{post.highlight_sub}</p>
        ) : null}
      </div>
    )
  }
  return null
}
