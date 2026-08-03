import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP } from '../lib/config'
import { formatDate, yen } from '../lib/utils'
import { Stars, PostCard, SectionTitle } from './components'
import { ArrowLink, Eyebrow } from './layout'

type Props = { post: Post; html: string; related: Post[] }

export const PostPage: FC<Props> = ({ post, html, related }) => {
  const cat = CATEGORY_MAP[post.category]
  const hasGeo = post.lat != null && post.lng != null

  return (
    <>
      <article>
        {/* ================= タイトル ================= */}
        <header class="relative -mt-16 overflow-hidden border-b border-edge2 bg-base pt-16">
          {post.cover_image ? (
            <div class="absolute inset-0">
              <img src={post.cover_image} alt="" class="h-full w-full object-cover opacity-25" />
              <div class="absolute inset-0 bg-gradient-to-b from-base/80 via-base/90 to-base"></div>
            </div>
          ) : (
            <div
              class="absolute inset-0"
              style={`background:radial-gradient(circle at 30% 0%, ${cat?.accentSoft}, transparent 65%)`}
            ></div>
          )}

          <div class="relative mx-auto max-w-text px-5 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
            <nav class="flex flex-wrap items-center gap-2 text-[11px] text-mute">
              <a href="/" class="transition hover:text-ink">ホーム</a>
              <i class="fa-solid fa-chevron-right text-[8px]"></i>
              <a href={`/category/${post.category}`} class="transition hover:text-ink" style={`color:${cat?.accent}`}>
                {cat?.name}
              </a>
            </nav>

            <div class="mt-5">
              <Eyebrow cat={post.category} />
            </div>
            <h1 class="mt-5 text-[28px] font-bold leading-[1.2] tracking-[-0.025em] text-white sm:text-[44px]">
              {post.title}
            </h1>
            {post.summary ? (
              <p class="mt-5 text-[14.5px] leading-[1.85] text-sub sm:text-[16px]">{post.summary}</p>
            ) : null}

            <div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-mute">
              <span>
                <i class="fa-regular fa-calendar mr-1.5"></i>
                {formatDate(post.published_at || post.created_at)}
              </span>
              {post.place_name ? (
                <span>
                  <i class="fa-solid fa-location-dot mr-1.5"></i>
                  {post.place_name}
                </span>
              ) : null}
              {post.prefecture ? <span>{post.prefecture}</span> : null}
              {post.status === 'draft' ? (
                <span class="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  下書きプレビュー
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {/* ================= カバー画像 ================= */}
        {post.cover_image ? (
          <div class="bg-base pt-10 sm:pt-14">
            <div class="mx-auto max-w-[1120px] px-0 sm:px-6">
              <div class="overflow-hidden border-y border-edge2 sm:rounded-big sm:border">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  class="h-[52vw] max-h-[540px] w-full object-cover sm:h-auto"
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* ================= スペック ================= */}
        <SpecPanel post={post} />

        {/* ================= 本文 ================= */}
        <div class="bg-base">
          <div class="mx-auto max-w-text px-5 py-12 sm:px-6 sm:py-16">
            <div class="post-body" dangerouslySetInnerHTML={{ __html: html }}></div>

            {post.tags && post.tags.length ? (
              <div class="mt-14 border-t border-edge2 pt-8">
                <p class="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute">Tags</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <a
                      href={`/tags/${encodeURIComponent(t)}`}
                      class="rounded-full border border-edge2 bg-panel px-3.5 py-1.5 text-[12px] text-sub transition hover:border-edge hover:text-ink"
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ================= フォト ================= */}
        {post.photos && post.photos.length ? (
          <section class="border-t border-edge2 bg-panel py-16 sm:py-20">
            <div class="mx-auto max-w-page px-5 sm:px-6">
              <SectionTitle eyebrow="Photos" icon="fa-images" title="現地の写真。" accent={cat?.accent} />
              <div class="mt-12 grid gap-4 sm:grid-cols-2">
                {post.photos.map((ph) => (
                  <figure class="overflow-hidden rounded-big border border-edge2 bg-base">
                    <img
                      src={ph.url}
                      alt={ph.caption || ''}
                      loading="lazy"
                      class="aspect-[16/11] w-full object-cover"
                    />
                    {ph.caption ? (
                      <figcaption class="px-6 py-4 text-[13px] leading-relaxed text-sub">{ph.caption}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ================= 地図 ================= */}
        {hasGeo ? (
          <section class="border-t border-edge2 bg-base py-16 sm:py-20">
            <div class="mx-auto max-w-page px-5 sm:px-6">
              <SectionTitle
                eyebrow="Location"
                icon="fa-map-location-dot"
                title="この場所。"
                desc={post.address || undefined}
                accent={cat?.accent}
              />
              <div class="mt-12 overflow-hidden rounded-big border border-edge2">
                <div
                  id="post-map"
                  class="h-[340px] w-full sm:h-[420px]"
                  data-lat={String(post.lat)}
                  data-lng={String(post.lng)}
                  data-label={post.place_name || post.title}
                  data-cat={post.category}
                ></div>
              </div>
              <div class="mt-6 text-center">
                <ArrowLink
                  href={`https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`}
                  size="sm"
                  color={cat?.accent}
                >
                  Googleマップで開く
                </ArrowLink>
              </div>
            </div>
          </section>
        ) : null}

        {/* ================= シェア ================= */}
        <div class="border-t border-edge2 bg-base">
          <div class="mx-auto max-w-text px-5 py-12 sm:px-6 sm:py-16">
            <div class="flex flex-wrap items-center justify-center gap-3">
              <button
                class="js-share rounded-full border border-edge bg-panel px-5 py-2.5 text-[13px] text-ink transition hover:bg-panel2"
                data-title={post.title}
              >
                <i class="fa-solid fa-share-nodes mr-2 text-[11px]"></i>共有する
              </button>
              <button class="js-copy rounded-full border border-edge bg-panel px-5 py-2.5 text-[13px] text-ink transition hover:bg-panel2">
                <i class="fa-regular fa-copy mr-2 text-[11px]"></i>URLをコピー
              </button>
            </div>
            <p class="mt-8 text-center">
              <ArrowLink href={`/category/${post.category}`} size="sm" color={cat?.accent}>
                {cat?.name}の記事をもっと見る
              </ArrowLink>
            </p>
          </div>
        </div>
      </article>

      {/* ================= 関連記事 ================= */}
      {related.length ? (
        <section class="border-t border-edge2 bg-panel py-16 sm:py-20">
          <div class="mx-auto max-w-page px-5 sm:px-6">
            <SectionTitle eyebrow="More" icon="fa-layer-group" title="あわせて読みたい。" />
            <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard post={p} showCategory={true} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* =========================================================
   カテゴリ別スペックパネル
   ========================================================= */
const SpecPanel: FC<{ post: Post }> = ({ post }) => {
  const cat = CATEGORY_MAP[post.category]

  const wrap = (children: any) => (
    <div class="bg-base pt-10 sm:pt-14">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <div class="rounded-big border border-edge2 bg-panel p-6 sm:p-9">{children}</div>
      </div>
    </div>
  )

  const cell = (label: string, value: any, icon?: string) =>
    value !== null && value !== undefined && value !== '' ? (
      <div class="px-2 text-center">
        <p class="flex items-center justify-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-mute">
          {icon ? <i class={`fa-solid ${icon} text-[10px]`}></i> : null}
          {label}
        </p>
        <p class="mt-2.5 text-[19px] font-bold tracking-[-0.02em] sm:text-[23px]">{value}</p>
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
    return wrap(
      <>
        {cells.length ? <div class="grid grid-cols-2 gap-y-8 sm:grid-cols-4">{cells}</div> : null}
        {post.route_text ? (
          <div class="mt-8 border-t border-edge2 pt-7">
            <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={`color:${cat?.accent}`}>
              <i class="fa-solid fa-diagram-project text-[10px]"></i>Route
            </p>
            <p class="mt-3 text-[14px] leading-[1.85] text-ink sm:text-[15px]">{post.route_text}</p>
          </div>
        ) : null}
      </>
    )
  }

  if (post.category === 'supermarket') {
    return wrap(
      <>
        <div class="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
          <div class="px-2 text-center">
            <p class="text-[10.5px] font-medium uppercase tracking-[0.1em] text-mute">総合評価</p>
            <p class="mt-3.5 flex justify-center">
              <Stars value={post.rating} color={cat?.accent} />
            </p>
          </div>
          <div class="px-2 text-center">
            <p class="text-[10.5px] font-medium uppercase tracking-[0.1em] text-mute">コスパ</p>
            <p class="mt-3.5 flex justify-center">
              <Stars value={post.cospa} />
            </p>
          </div>
          {cell('会計金額', post.budget ? yen(post.budget) : null, 'fa-yen-sign')}
          {cell('訪問日', formatDate(post.visit_date) || null, 'fa-calendar-check')}
        </div>
        {post.business_hours || post.address ? (
          <div class="mt-8 grid gap-5 border-t border-edge2 pt-7 sm:grid-cols-2">
            {post.business_hours ? (
              <div>
                <p class="text-[10.5px] font-medium uppercase tracking-[0.1em] text-mute">
                  <i class="fa-solid fa-clock mr-1.5 text-[10px]"></i>営業時間
                </p>
                <p class="mt-2 text-[14px]">{post.business_hours}</p>
              </div>
            ) : null}
            {post.address ? (
              <div>
                <p class="text-[10.5px] font-medium uppercase tracking-[0.1em] text-mute">
                  <i class="fa-solid fa-location-dot mr-1.5 text-[10px]"></i>住所
                </p>
                <p class="mt-2 text-[14px]">{post.address}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    )
  }

  if ((post.category === 'asset' || post.category === 'life') && post.highlight_value) {
    return wrap(
      <div class="text-center">
        <p class="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute">
          {post.highlight_label || 'Highlight'}
        </p>
        <p
          class="mt-4 text-[42px] font-bold leading-none tracking-[-0.03em] sm:text-[60px]"
          style={`color:${cat?.accent}`}
        >
          {post.highlight_value}
        </p>
        {post.highlight_sub ? <p class="mt-4 text-[14px] text-sub">{post.highlight_sub}</p> : null}
      </div>
    )
  }
  return null
}
