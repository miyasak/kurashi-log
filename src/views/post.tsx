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
        <header class="bg-white pb-10 pt-14 sm:pb-14 sm:pt-24">
          <div class="mx-auto max-w-text px-5 text-center sm:px-6">
            <Eyebrow cat={post.category} />
            <h1 class="mt-3 text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[52px]">
              {post.title}
            </h1>
            {post.summary ? (
              <p class="mx-auto mt-6 max-w-[620px] text-[17px] leading-[1.55] tracking-[-0.01em] text-sub sm:text-[19px]">
                {post.summary}
              </p>
            ) : null}
            <div class="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] text-mute">
              <span>{formatDate(post.published_at || post.created_at)}</span>
              {post.place_name ? (
                <>
                  <span class="text-line">|</span>
                  <span>{post.place_name}</span>
                </>
              ) : null}
              {post.prefecture ? (
                <>
                  <span class="text-line">|</span>
                  <span>{post.prefecture}</span>
                </>
              ) : null}
              {post.status === 'draft' ? (
                <span class="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-medium text-white">
                  下書きプレビュー
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {/* ================= カバー画像（フルブリード） ================= */}
        {post.cover_image ? (
          <div class="mx-auto max-w-[1180px] px-0 sm:px-6">
            <div class="overflow-hidden sm:rounded-big">
              <img
                src={post.cover_image}
                alt={post.title}
                class="h-[48vw] max-h-[560px] w-full object-cover sm:h-auto"
              />
            </div>
          </div>
        ) : null}

        {/* ================= スペック ================= */}
        <SpecPanel post={post} />

        {/* ================= 本文 ================= */}
        <div class="mx-auto max-w-text px-5 py-12 sm:px-6 sm:py-16">
          <div class="post-body" dangerouslySetInnerHTML={{ __html: html }}></div>

          {post.tags && post.tags.length ? (
            <div class="mt-14 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map((t) => (
                <a
                  href={`/tags/${encodeURIComponent(t)}`}
                  class="rounded-full bg-hazy px-3.5 py-1.5 text-[12px] text-sub transition hover:bg-[#eeeef0] hover:text-ink"
                >
                  {t}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {/* ================= フォト ================= */}
        {post.photos && post.photos.length ? (
          <section class="bg-hazy py-16 sm:py-24">
            <div class="mx-auto max-w-page px-5 sm:px-6">
              <SectionTitle eyebrow="Photos" title="現地の写真。" />
              <div class="mt-12 grid gap-5 sm:grid-cols-2">
                {post.photos.map((ph) => (
                  <figure class="overflow-hidden rounded-big bg-white">
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
          <section class="bg-white py-16 sm:py-24">
            <div class="mx-auto max-w-page px-5 sm:px-6">
              <SectionTitle eyebrow="Location" title="この場所。" desc={post.address || undefined} />
              <div
                id="post-map"
                class="mt-12 h-[340px] w-full overflow-hidden rounded-big sm:h-[420px]"
                data-lat={String(post.lat)}
                data-lng={String(post.lng)}
                data-label={post.place_name || post.title}
                data-cat={post.category}
              ></div>
              <div class="mt-6 text-center">
                <ArrowLink
                  href={`https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`}
                  size="sm"
                >
                  Googleマップで開く
                </ArrowLink>
              </div>
            </div>
          </section>
        ) : null}

        {/* ================= シェア ================= */}
        <div class="mx-auto max-w-text px-5 pb-16 sm:px-6 sm:pb-24">
          <div class="flex flex-wrap items-center justify-center gap-3 border-t border-line pt-10">
            <button
              class="js-share rounded-full border border-line px-5 py-2 text-[13px] text-ink transition hover:bg-hazy"
              data-title={post.title}
            >
              共有する
            </button>
            <button class="js-copy rounded-full border border-line px-5 py-2 text-[13px] text-ink transition hover:bg-hazy">
              URLをコピー
            </button>
          </div>
          <p class="mt-8 text-center">
            <ArrowLink href={`/category/${post.category}`} size="sm">
              {cat?.name}の記事をもっと見る
            </ArrowLink>
          </p>
        </div>
      </article>

      {/* ================= 関連記事 ================= */}
      {related.length ? (
        <section class="bg-hazy py-16 sm:py-24">
          <div class="mx-auto max-w-page px-5 sm:px-6">
            <SectionTitle eyebrow="More" title="あわせて読みたい。" />
            <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
   カテゴリ別スペック（Appleのテックスペック風・罫線のみ）
   ========================================================= */
const SpecPanel: FC<{ post: Post }> = ({ post }) => {
  const wrap = (children: any) => (
    <div class="mx-auto max-w-page px-5 pt-12 sm:px-6 sm:pt-16">
      <div class="border-t border-line pt-10">{children}</div>
    </div>
  )

  const cellsGrid = (cells: any[]) => (
    <dl class="grid grid-cols-2 gap-y-9 sm:grid-cols-4">{cells}</dl>
  )

  const cell = (label: string, value: any) =>
    value !== null && value !== undefined && value !== '' ? (
      <div class="px-2 text-center">
        <dd class="text-[24px] font-semibold leading-none tracking-[-0.02em] sm:text-[30px]">{value}</dd>
        <dt class="mt-2.5 text-[12px] text-mute">{label}</dt>
      </div>
    ) : null

  if (post.category === 'touring') {
    const cells = [
      cell('走行距離', post.distance_km ? `${post.distance_km} km` : null),
      cell('所要時間', post.duration_text),
      cell('天気', post.weather),
      cell('車両', post.bike)
    ].filter(Boolean)
    if (!cells.length && !post.route_text) return null
    return wrap(
      <>
        {cells.length ? cellsGrid(cells) : null}
        {post.route_text ? (
          <div class="mx-auto mt-10 max-w-text border-t border-line pt-8 text-center">
            <p class="text-[12px] uppercase tracking-[0.14em] text-mute">Route</p>
            <p class="mt-3 text-[15px] leading-[1.7] tracking-[-0.01em] text-ink sm:text-[17px]">{post.route_text}</p>
          </div>
        ) : null}
      </>
    )
  }

  if (post.category === 'supermarket') {
    return wrap(
      <>
        <dl class="grid grid-cols-2 gap-y-9 sm:grid-cols-4">
          <div class="px-2 text-center">
            <dd class="flex h-[30px] items-center justify-center">
              <Stars value={post.rating} />
            </dd>
            <dt class="mt-2.5 text-[12px] text-mute">総合評価</dt>
          </div>
          <div class="px-2 text-center">
            <dd class="flex h-[30px] items-center justify-center">
              <Stars value={post.cospa} />
            </dd>
            <dt class="mt-2.5 text-[12px] text-mute">コスパ</dt>
          </div>
          {cell('会計金額', post.budget ? yen(post.budget) : null)}
          {cell('訪問日', formatDate(post.visit_date) || null)}
        </dl>
        {post.business_hours || post.address ? (
          <dl class="mt-10 grid gap-y-6 border-t border-line pt-8 text-center sm:grid-cols-2">
            {post.business_hours ? (
              <div>
                <dt class="text-[12px] uppercase tracking-[0.14em] text-mute">営業時間</dt>
                <dd class="mt-2 text-[15px] tracking-[-0.01em]">{post.business_hours}</dd>
              </div>
            ) : null}
            {post.address ? (
              <div>
                <dt class="text-[12px] uppercase tracking-[0.14em] text-mute">住所</dt>
                <dd class="mt-2 text-[15px] tracking-[-0.01em]">{post.address}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </>
    )
  }

  if ((post.category === 'asset' || post.category === 'life') && post.highlight_value) {
    return wrap(
      <div class="text-center">
        <p class="text-[12px] uppercase tracking-[0.14em] text-mute">{post.highlight_label || 'Highlight'}</p>
        <p class="mt-4 text-[48px] font-semibold leading-none tracking-[-0.03em] sm:text-[72px]">
          {post.highlight_value}
        </p>
        {post.highlight_sub ? <p class="mt-4 text-[15px] text-sub">{post.highlight_sub}</p> : null}
      </div>
    )
  }
  return null
}
