import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP } from '../lib/config'
import { formatDate, yen } from '../lib/utils'
import { Stars, PostCard, SectionTitle } from './components'
import { ArrowLink } from './layout'

type Props = { post: Post; html: string; related: Post[]; linked?: Post | null }

/* 小見出し：オレンジ系の英字ラベル + 太字の日本語見出し */
const BlockTitle: FC<{ eyebrow: string; title: string; accent?: string }> = ({
  eyebrow,
  title,
  accent
}) => (
  <div class="mb-5">
    <p
      class="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
      style={`color:${accent || '#fb923c'}`}
    >
      {eyebrow}
    </p>
    <h2 class="mt-1.5 text-[17px] font-bold tracking-[-0.01em] text-ink sm:text-[19px]">{title}</h2>
  </div>
)

export const PostPage: FC<Props> = ({ post, html, related, linked }) => {
  const cat = CATEGORY_MAP[post.category]
  const hasGeo = post.lat != null && post.lng != null
  const accent = cat?.accent || '#fb923c'
  const areaLabel = [post.area, post.prefecture].filter(Boolean).join(' / ')

  return (
    <>
      <article>
        {/* ============================================================
            ヒーロー：カバー画像の上にパンくず・タイトル・メタ情報
           ============================================================ */}
        <header class="relative -mt-16 overflow-hidden bg-base">
          <div class="absolute inset-0">
            {post.cover_image ? (
              <>
                <img
                  src={post.cover_image}
                  alt=""
                  class="h-full w-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-base via-base/55 to-base/70"></div>
                <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-base to-transparent"></div>
              </>
            ) : (
              <div
                style={`background:radial-gradient(120% 100% at 25% 0%, ${cat?.accentSoft}, transparent 70%)`}
                class="h-full w-full"
              ></div>
            )}
          </div>

          <div class="relative mx-auto max-w-page px-5 pb-10 pt-[210px] sm:px-6 sm:pb-14 sm:pt-[300px]">
            {/* パンくず */}
            <nav class="flex flex-wrap items-center gap-2 text-[11px] text-white/55">
              <a href="/" class="transition hover:text-white">ホーム</a>
              <span class="text-white/30">/</span>
              <a href={`/category/${post.category}`} class="transition hover:text-white">
                {cat?.name}
              </a>
              <span class="text-white/30">/</span>
              <span class="text-white/80">{post.place_name || post.title}</span>
            </nav>

            <h1 class="mt-4 text-[27px] font-bold leading-[1.18] tracking-[-0.03em] text-white sm:text-[42px]">
              {post.title}
            </h1>

            {/* メタ行：場所 / 日付 / ジャンル / 評価 */}
            <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/70">
              {areaLabel || post.place_name ? (
                <span class="inline-flex items-center gap-1.5">
                  <i class="fa-solid fa-location-dot text-[11px]" style={`color:${accent}`}></i>
                  {areaLabel || post.place_name}
                </span>
              ) : null}
              <span class="inline-flex items-center gap-1.5">
                <i class="fa-regular fa-calendar text-[11px]"></i>
                {formatDate(post.visit_date || post.published_at || post.created_at)}
              </span>
              {post.genre ? (
                <span class="inline-flex items-center gap-1.5">
                  <i class={`fa-solid ${cat?.icon} text-[11px]`}></i>
                  {post.genre}
                </span>
              ) : null}
              {post.rating ? <Stars value={post.rating} color={accent} /> : null}
              {post.status === 'draft' ? (
                <span class="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  下書きプレビュー
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {/* ============================================================
            本文 2カラム（左：本文 / 右：スペックカード）
           ============================================================ */}
        <div class="border-t border-edge2 bg-base">
          <div class="mx-auto max-w-page px-5 py-12 sm:px-6 sm:py-16">
            <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
              {/* ---------------- 左カラム ---------------- */}
              <div class="min-w-0">
                {post.summary ? (
                  <p class="text-[15px] leading-[1.9] text-sub sm:text-[16px]">{post.summary}</p>
                ) : null}

                {/* 現地の写真 */}
                {post.photos && post.photos.length ? (
                  <section class={post.summary ? 'mt-10' : ''}>
                    <BlockTitle eyebrow="Photos" title="現地の写真" accent={accent} />
                    <div class="grid gap-4 sm:grid-cols-2">
                      {post.photos.map((ph) => (
                        <figure class="overflow-hidden rounded-big border border-edge2 bg-panel">
                          <img
                            src={ph.url}
                            alt={ph.caption || ''}
                            loading="lazy"
                            class="aspect-[4/3] w-full object-cover"
                          />
                          {ph.caption ? (
                            <figcaption class="px-4 py-3 text-[12.5px] leading-relaxed text-mute">
                              {ph.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* 本文 */}
                <div
                  class={`post-body ${post.summary || (post.photos && post.photos.length) ? 'mt-10' : ''}`}
                  dangerouslySetInnerHTML={{ __html: html }}
                ></div>

                {/* 路面 / 注意事項 */}
                {post.road_note ? (
                  <div
                    class="mt-8 rounded-big border p-5"
                    style={`border-color:${accent}40;background:${cat?.accentSoft}`}
                  >
                    <p
                      class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
                      style={`color:${accent}`}
                    >
                      <i class="fa-solid fa-triangle-exclamation text-[11px]"></i>
                      Road Note
                    </p>
                    <p class="mt-2.5 text-[13.5px] leading-[1.85] text-ink">{post.road_note}</p>
                  </div>
                ) : null}

                {/* タグ */}
                {post.tags && post.tags.length ? (
                  <div class="mt-9 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <a
                        href={`/tags/${encodeURIComponent(t)}`}
                        class="rounded-full border px-3.5 py-1.5 text-[12px] transition hover:brightness-125"
                        style={`border-color:${accent}33;background:${cat?.accentSoft};color:${accent}`}
                      >
                        #{t}
                      </a>
                    ))}
                  </div>
                ) : null}

                {/* ---- LOCAL STOP / 相互リンク記事 ---- */}
                {linked ? <LinkedCard current={post} linked={linked} /> : null}

                {/* 地図 */}
                {hasGeo ? (
                  <section class="mt-12">
                    <BlockTitle
                      eyebrow="Location"
                      title={post.category === 'touring' ? 'ルートの位置' : 'この店の場所'}
                      accent={accent}
                    />
                    <div class="overflow-hidden rounded-big border border-edge2">
                      <div
                        id="post-map"
                        class="h-[300px] w-full sm:h-[380px]"
                        data-lat={String(post.lat)}
                        data-lng={String(post.lng)}
                        data-label={post.place_name || post.title}
                        data-cat={post.category}
                      ></div>
                    </div>
                    <p class="mt-4">
                      <ArrowLink
                        href={`https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`}
                        size="sm"
                        color={accent}
                      >
                        Googleマップで開く
                      </ArrowLink>
                    </p>
                  </section>
                ) : null}

                {/* シェア */}
                <div class="mt-12 flex flex-wrap items-center gap-3 border-t border-edge2 pt-8">
                  <button
                    class="js-share rounded-full border border-edge bg-panel px-5 py-2.5 text-[13px] text-ink transition hover:bg-panel2"
                    data-title={post.title}
                  >
                    <i class="fa-solid fa-share-nodes mr-2 text-[11px]"></i>共有する
                  </button>
                  <button class="js-copy rounded-full border border-edge bg-panel px-5 py-2.5 text-[13px] text-ink transition hover:bg-panel2">
                    <i class="fa-regular fa-copy mr-2 text-[11px]"></i>URLをコピー
                  </button>
                  <span class="ml-auto">
                    <ArrowLink href={`/category/${post.category}`} size="sm" color={accent}>
                      {cat?.name}の一覧へ
                    </ArrowLink>
                  </span>
                </div>
              </div>

              {/* ---------------- 右サイドバー ---------------- */}
              <aside class="lg:sticky lg:top-24 lg:self-start">
                <SpecCard post={post} />
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* ============================================================
          関連記事
         ============================================================ */}
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
   右サイドバー：スペックカード（RIDE DATA / SHOP DATA）
   ========================================================= */
const SpecCard: FC<{ post: Post }> = ({ post }) => {
  const cat = CATEGORY_MAP[post.category]
  const accent = cat?.accent || '#fb923c'

  type Row = { label: string; value: any }
  const rows: Row[] = []
  const push = (label: string, value: any) => {
    if (value !== null && value !== undefined && value !== '') rows.push({ label, value })
  }

  const areaLabel = [post.area, post.prefecture].filter(Boolean).join(' / ')
  let heading = 'DATA'

  if (post.category === 'touring') {
    heading = 'RIDE DATA'
    push('訪問日', formatDate(post.visit_date || post.published_at))
    push('エリア', areaLabel)
    push('カテゴリ', post.genre)
    push('走行距離', post.distance_km ? `${post.distance_km} km` : null)
    push('所要時間', post.duration_text)
    push('ルート', post.route_text)
    push('ベストシーズン', post.best_season)
    push('天気', post.weather)
    push('使用車両', post.bike)
  } else if (post.category === 'supermarket') {
    heading = 'SHOP DATA'
    push('訪問日', formatDate(post.visit_date || post.published_at))
    push('エリア', areaLabel)
    push('店舗', post.place_name)
    push('カテゴリ', post.genre)
    push('会計金額', post.budget ? yen(post.budget) : null)
    push('営業時間', post.business_hours)
    push('アクセス', post.access_text)
    push('住所', post.address)
  } else {
    heading = post.category === 'it' ? 'ARTICLE DATA' : 'SUMMARY'
    push('公開日', formatDate(post.published_at))
    push('カテゴリ', post.genre || cat?.name)
    push(post.highlight_label || 'ハイライト', post.highlight_value)
    push('補足', post.highlight_sub)
  }

  const hasRatings = post.rating != null || post.cospa != null
  const hasRecommend = !!post.recommend_items
  if (!rows.length && !hasRatings && !hasRecommend) return null

  const items = (post.recommend_items || '')
    .split(/[\n/／・]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div class="overflow-hidden rounded-big border border-edge2 bg-panel">
      <div class="border-b border-edge2 px-6 py-4">
        <p
          class="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
          style={`color:${accent}`}
        >
          {heading}
        </p>
      </div>

      <dl class="divide-y divide-edge2">
        {rows.map((r) => (
          <div class="grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-6 py-3.5">
            <dt class="text-[11.5px] leading-[1.6] text-mute">{r.label}</dt>
            <dd class="text-[12.5px] leading-[1.65] text-ink">{r.value}</dd>
          </div>
        ))}

        {/* 評価（スーパー） */}
        {post.rating != null ? (
          <div class="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3 px-6 py-3.5">
            <dt class="text-[11.5px] text-mute">総合評価</dt>
            <dd>
              <Stars value={post.rating} color={accent} />
            </dd>
          </div>
        ) : null}
        {post.cospa != null ? (
          <div class="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3 px-6 py-3.5">
            <dt class="text-[11.5px] text-mute">コスパ</dt>
            <dd>
              <Stars value={post.cospa} />
            </dd>
          </div>
        ) : null}
      </dl>

      {/* 推し買い */}
      {items.length ? (
        <div class="border-t border-edge2 p-4">
          <div
            class="rounded-xl p-4"
            style={`background:${cat?.accentSoft};border:1px solid ${accent}33`}
          >
            <p
              class="flex items-center gap-2 text-[11px] font-semibold tracking-[0.06em]"
              style={`color:${accent}`}
            >
              <i class="fa-solid fa-cart-shopping text-[10px]"></i>
              推し買い
            </p>
            <ul class="mt-2.5 space-y-1.5">
              {items.map((it) => (
                <li class="text-[12.5px] leading-[1.6] text-ink">{it}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/* =========================================================
   LOCAL STOP：ツーリング ⇄ スーパーの相互リンクカード
   ========================================================= */
const LinkedCard: FC<{ current: Post; linked: Post }> = ({ current, linked }) => {
  const lc = CATEGORY_MAP[linked.category]
  const accent = lc?.accent || '#fb7185'
  const isSuper = linked.category === 'supermarket'
  const eyebrow = isSuper ? 'Local Stop' : 'Related Ride'
  const heading = isSuper ? 'このツーリングで寄った店' : 'この店に寄ったツーリング'

  const items = (linked.recommend_items || '')
    .split(/[\n/／・]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <section class="mt-12">
      <BlockTitle eyebrow={eyebrow} title={heading} accent={accent} />

      <div class="max-w-[420px] overflow-hidden rounded-big border border-edge2 bg-panel">
        {/* 画像 + バッジ */}
        <a href={`/posts/${linked.slug}`} class="group relative block">
          {linked.cover_image ? (
            <img
              src={linked.cover_image}
              alt={linked.title}
              loading="lazy"
              class="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              class="grid aspect-[16/10] w-full place-items-center"
              style={`background:linear-gradient(135deg,${lc?.accentSoft},#18181b)`}
            >
              <i class={`fa-solid ${lc?.icon} text-[28px]`} style={`color:${accent}`}></i>
            </div>
          )}
          <span class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[10.5px] font-semibold text-white backdrop-blur">
            <i class={`fa-solid ${lc?.icon} text-[9px]`} style={`color:${accent}`}></i>
            {lc?.name}
          </span>
        </a>

        <div class="p-5">
          <a href={`/posts/${linked.slug}`} class="block">
            <h3 class="text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-ink transition hover:opacity-80">
              {linked.place_name || linked.title}
            </h3>
          </a>

          <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-mute">
            {linked.prefecture ? (
              <span>
                <i class="fa-solid fa-location-dot mr-1.5 text-[10px]" style={`color:${accent}`}></i>
                {linked.prefecture}
              </span>
            ) : null}
            {linked.genre ? (
              <span>
                <i class="fa-solid fa-tag mr-1.5 text-[10px]"></i>
                {linked.genre}
              </span>
            ) : null}
          </div>

          {linked.rating ? (
            <p class="mt-2.5">
              <Stars value={linked.rating} color={accent} />
            </p>
          ) : null}

          {linked.summary ? (
            <p class="mt-3 text-[12.5px] leading-[1.8] text-sub">「{linked.summary}」</p>
          ) : null}

          {/* 推し買い */}
          {items.length ? (
            <div
              class="mt-4 rounded-xl p-3.5"
              style={`background:${lc?.accentSoft};border:1px solid ${accent}33`}
            >
              <p
                class="flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.06em]"
                style={`color:${accent}`}
              >
                <i class="fa-solid fa-cart-shopping text-[9px]"></i>
                推し買い
              </p>
              <p class="mt-1.5 text-[12px] leading-[1.7] text-ink">{items.join(' / ')}</p>
            </div>
          ) : null}

          {/* 下段：現在の記事へのタグ + 地図ボタン */}
          <div class="mt-4 flex items-center justify-between gap-3">
            <a
              href={`/posts/${current.slug}`}
              class="truncate rounded-full border px-3 py-1.5 text-[11px] transition hover:brightness-125"
              style={`border-color:${accent}33;background:${lc?.accentSoft};color:${accent}`}
            >
              #{current.place_name || current.title}
            </a>
            {linked.lat != null && linked.lng != null ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${linked.lat},${linked.lng}`}
                target="_blank"
                rel="noopener"
                class="inline-flex shrink-0 items-center gap-2 rounded-full border border-edge bg-base px-4 py-2 text-[11.5px] text-ink transition hover:bg-panel2"
              >
                <i class="fa-solid fa-map-location-dot text-[10px]"></i>
                地図
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
