import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORY_MAP, THEME_MAP, ACCENT, disclaimerOf, pickLabel, pickIcon, placeLabel } from '../lib/config'
import { formatDate, yen, buildToc } from '../lib/utils'
import { Stars, PostCard, SectionTitle, SeriesNav } from './components'
import { ArrowLink } from './layout'

type Props = { post: Post; html: string; related: Post[]; linked?: Post | null; series?: any; settings?: Record<string, string> }

/* 小見出し：オレンジ系の英字ラベル + 太字の日本語見出し */
const BlockTitle: FC<{ eyebrow: string; title: string; accent?: string }> = ({
  eyebrow,
  title,
  accent
}) => (
  <div class="mb-4">
    <h2 class="mt-1 text-[16px] font-bold tracking-[-0.01em] text-ink sm:text-[18px]">{title}</h2>
  </div>
)

export const PostPage: FC<Props> = ({ post, html, related, linked, series, settings }) => {
  const { html: bodyHtml, toc } = buildToc(html)  
  const cat = CATEGORY_MAP[post.category]
  const hasGeo = post.lat != null && post.lng != null
  /** Googleマップのリンク先。スポットが2件以上ある記事は経路（ルート）で開く */
  const spots = (post.spots || []).filter((s) => s.lat != null && s.lng != null)
  const mapsHref = (() => {
    if (spots.length >= 2) {
      // 経路URLの経由地は9件までなので、多すぎる場合は先頭9件＋最後だけにする
      const pts = spots.length <= 10 ? spots : [...spots.slice(0, 9), spots[spots.length - 1]]
      const q = (s: { lat: number; lng: number }) => `${s.lat},${s.lng}`
      const way = pts.slice(1, -1).map(q).join('|')
      return (
        `https://www.google.com/maps/dir/?api=1&origin=${q(pts[0])}` +
        `&destination=${q(pts[pts.length - 1])}` +
        (way ? `&waypoints=${encodeURIComponent(way)}` : '') +
        `&travelmode=driving`
      )
    }
    const s = spots[0]
    const query = s ? `${s.lat},${s.lng}` : `${post.lat},${post.lng}`
    return `https://www.google.com/maps/search/?api=1&query=${query}`
  })()
  const accent = ACCENT
  const areaLabel = [post.area, post.prefecture].filter(Boolean).join(' / ')
  const theme = cat ? THEME_MAP[cat.theme] : undefined
  const themeHref = theme ? `/theme/${theme.key}` : '/'
  /** テーマ内に複数カテゴリがある場合はサブカテゴリもパンくずに出す */
  const showSub = !!theme && theme.categories.length > 1
  /** 公開日と最終更新日が違うときだけ「更新」を出す */
  const showUpdated = (() => {
    if (!post.updated_at) return false
    const pub = String(post.published_at || post.created_at || '').slice(0, 10)
    const upd = String(post.updated_at).slice(0, 10)
    return !!upd && upd !== pub
  })()

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
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/35"></div>
                <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
              </>
            ) : (
              <div
                style={`background:radial-gradient(120% 100% at 25% 0%, ${cat?.accentSoft}, transparent 70%)`}
                class="h-full w-full"
              ></div>
            )}
          </div>

          <div class="relative mx-auto max-w-page px-4 pb-8 pt-[170px] sm:px-6 sm:pb-11 sm:pt-[240px]">
            {/* パンくず */}
            <nav class="flex flex-wrap items-center gap-2 text-[11px] text-white/55">
              <a href="/" class="transition hover:text-white">ホーム</a>
              <span class="text-white/30">/</span>
              <a href={themeHref} class="transition hover:text-white">
                {theme?.label}
              </a>
              {showSub ? (
                <>
                  <span class="text-white/30">/</span>
                  <a href={`${themeHref}?cat=${post.category}`} class="transition hover:text-white">
                    {cat?.name}
                  </a>
                </>
              ) : null}
              <span class="text-white/30">/</span>
              <span class="text-white/80">{post.place_name || post.title}</span>
            </nav>

            <h1 class="mt-3.5 max-w-[48ch] text-[24px] font-bold leading-[1.22] tracking-[-0.03em] text-white [word-break:auto-phrase] sm:text-[36px]">
              {post.title}
            </h1>

            {/* メタ行：場所 / 日付 / ジャンル / 評価 */}
            <div class="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/70">
              {areaLabel || post.place_name ? (
                <span class="inline-flex items-center gap-1.5">
                  <i class="fa-solid fa-location-dot text-[11px]" style={`color:${accent}`}></i>
                  {areaLabel || post.place_name}
                </span>
              ) : null}
              <span class="inline-flex items-center gap-1.5 font-mono tabular-nums">
                <i class="fa-regular fa-calendar text-[11px]"></i>
                {formatDate(post.visit_date || post.published_at || post.created_at)}
                <span class="ml-0.5 font-sans text-[10.5px] text-white/50">
                  {post.visit_date ? '訪問' : '公開'}
                </span>
              </span>
              {/* 数字を更新していくサイトなので、最終更新日も並べて出す */}
              {showUpdated ? (
                <span class="inline-flex items-center gap-1.5 font-mono tabular-nums text-brand">
                  <i class="fa-solid fa-rotate text-[10.5px]"></i>
                  {formatDate(post.updated_at)}
                  <span class="ml-0.5 font-sans text-[10.5px] opacity-80">更新</span>
                </span>
              ) : null}
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
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-12">
            <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-11">
              {/* ---------------- 左カラム ---------------- */}
              <div class="min-w-0">
                {post.summary ? (
                  <p class="max-w-[875px] border-l-2 border-brand/50 pl-4 text-[14px] leading-[1.9] text-sub sm:text-[15px]">
                    {post.summary}
                  </p>
                ) : null}

                {/* 現地の写真 */}
                {post.photos && post.photos.length ? (
                  <section class={post.summary ? 'mt-8' : ''}>
                    <BlockTitle eyebrow="Photos" title="現地の写真" accent={accent} />
                    <div class="grid gap-4 sm:grid-cols-2">
                      {post.photos.map((ph) => (
                        <figure class="overflow-hidden rounded-big border border-edge2 bg-panel">
                          <img
                            src={ph.url}
                            alt={ph.caption || ''}
                            loading="lazy"
                            class="lb-img aspect-[4/3] w-full cursor-zoom-in object-cover"
                          />
                          {ph.caption ? (
                            <figcaption class="px-4 py-3 text-[13.5px] leading-relaxed text-mute">
                              {ph.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* 目次（見出しが3つ以上ある記事だけ） */}
                {toc.length >= 3 ? (
                  <nav class="mt-8 rounded-big border border-edge2 bg-panel p-5 lg:hidden">
                    <p class="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
                      Contents
                    </p>
                    <ol class="mt-3 space-y-2">
                      {toc.map((t, i) => (
                        <li class="flex gap-2.5 text-[14px] leading-[1.7]">
                          <span class="pt-[3px] font-mono text-[11px] tabular-nums text-mute">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <a href={`#${t.id}`} class="text-sub transition hover:text-brand">
                            {t.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}

                {/* 本文 */}
                <div
                  class={`post-body ${post.summary || toc.length >= 3 || (post.photos && post.photos.length) ? 'mt-8' : ''}`}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                ></div>

                {/* 路面 / 注意事項 */}
                {post.road_note ? (
                  <div class="mt-7 rounded-big border border-brand/25 bg-brandsoft p-4 sm:p-5">
                    <p class="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand">
                      <i class="fa-solid fa-triangle-exclamation text-[10.5px]"></i>
                      Road Note
                    </p>
                    <p class="mt-2 text-[14px] leading-[1.85] text-ink">{post.road_note}</p>
                  </div>
                ) : null}

                {/* タグ */}
                {post.tags && post.tags.length ? (
                  <div class="mt-7 flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <a
                        href={`/tags/${encodeURIComponent(t)}`}
                        class="rounded-full border border-brand/25 bg-brandsoft px-3 py-1 text-[11.5px] text-brand transition hover:brightness-125"
                      >
                        #{t}
                      </a>
                    ))}
                  </div>
                ) : null}

                {/* シリーズの前後ナビ */}
                <SeriesNav series={series} />

                {/* ---- LOCAL STOP / 相互リンク記事 ---- */}
                {linked ? <LinkedCard current={post} linked={linked} /> : null}

                {/* 地図 */}
                {hasGeo ? (
                  <section class="mt-10">
                    <BlockTitle
                      eyebrow="Location"
                      title={placeLabel(post.category)}
                      accent={accent}
                    />
                    <div class="overflow-hidden rounded-big border border-edge2">
                      <div
                        id="post-map"
                        class="h-[300px] w-full sm:h-[380px]"
                        data-lat={String(post.lat)}
                        data-lng={String(post.lng)}
                        data-spots={JSON.stringify(post.spots || [])}
                        data-label={post.place_name || post.title}
                        data-cat={post.category}
                      ></div>
                    </div>
                    <p class="mt-3.5">
                      <ArrowLink href={mapsHref} size="sm">
                        {spots.length >= 2 ? 'Googleマップで立ち寄り地を開く' : 'Googleマップで開く'}                        
                      </ArrowLink>
                    </p>
                  </section>
                ) : null}
                {/* 免責文（全記事の末尾に自動挿入） */}
                {disclaimerOf(post.category, settings) ? (
                  <p class="mt-8 rounded-xl border border-edge2 bg-panel px-4 py-3.5 text-[11.5px] leading-[1.8] text-mute">
                    <i class="fa-solid fa-circle-info mr-1.5 text-[11px]"></i>
                    {disclaimerOf(post.category, settings)}
                  </p>
                ) : null}
                {/* シェア */}
                <div class="mt-6 flex flex-wrap items-center gap-2.5 border-t border-edge2 pt-6">
                  <button
                    class="js-share rounded-full border border-edge bg-panel px-4 py-2 text-[13.5px] text-ink transition hover:bg-panel2"
                    data-title={post.title}
                  >
                    <i class="fa-solid fa-share-nodes mr-2 text-[11px]"></i>共有する
                  </button>
                  <button class="js-copy rounded-full border border-edge bg-panel px-4 py-2 text-[13.5px] text-ink transition hover:bg-panel2">
                    <i class="fa-regular fa-copy mr-2 text-[11px]"></i>URLをコピー
                  </button>
                  <span class="ml-auto">
                    <ArrowLink href={showSub ? `${themeHref}?cat=${post.category}` : themeHref} size="sm">
                      {cat?.name}の一覧へ
                    </ArrowLink>
                  </span>
                </div>
              </div>

              {/* ---------------- 右サイドバー ---------------- */}
              <aside class="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                {/* 目次（PCのみ・サイドバー上部） */}
                {toc.length >= 3 ? (
                  <nav class="mb-5 hidden rounded-big border border-edge2 bg-panel p-4 lg:block">
                    <p class="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
                      Contents
                    </p>
                    <ol class="mt-2.5 space-y-1.5">
                      {toc.map((t) => (
                        <li class="text-[13px] leading-[1.6]">
                          <a href={`#${t.id}`} class="text-sub transition hover:text-brand">
                            {t.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}
                <SpecCard post={post} />
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* ============================================================
          関連記事
         ============================================================ */}
      {/* 次に読む：同テーマから2件（記事間の内部リンクを必ず作る） */}
      {related.length ? (
        <section class="border-t border-edge2 bg-panel">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-12">
            <SectionTitle
              eyebrow="Read next"
              icon="fa-layer-group"
              title="次に読む"
              desc={theme ? `${theme.label} のほかの記事です。` : undefined}
              action={
                <ArrowLink href={showSub ? `${themeHref}?cat=${post.category}` : themeHref}>
                  一覧へ
                </ArrowLink>
              }
            />
            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.slice(0, 2).map((p) => (
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
  const accent = ACCENT

  /** 数値を含む行は等幅フォントで桁を揃える */
  const NUMERIC = new Set([
    '訪問日',
    '公開日',
    '走行距離',
    '会計金額',
    '営業時間',
    '所要時間',
    '料金'
  ])

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
  } else if (post.category === 'camp') {
      heading = 'CAMP DATA'
      push('訪問日', formatDate(post.visit_date || post.published_at))
      push('エリア', areaLabel)
      push('キャンプ場', post.place_name)
      push('サイト形式', post.genre)
      push('料金', post.budget === 0 ? '無料' : post.budget ? yen(post.budget) : null)
      push('開設期間', post.business_hours)
      push('ベストシーズン', post.best_season)
      push('天気', post.weather)
      push('アクセス', post.access_text)
      push('住所', post.address)
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
  } else if (post.category === 'onsen') {
    heading = 'ONSEN DATA'
    push('訪問日', formatDate(post.visit_date || post.published_at))
    push('エリア', areaLabel)
    push('施設名', post.place_name)
    push('泉質', post.genre)
    push('料金', post.budget === 0 ? '無料' : post.budget ? yen(post.budget) : null)
    push('営業時間', post.business_hours)
    push('アクセス', post.access_text)
    push('住所', post.address)
  } else {
    heading = post.category === 'it' ? 'ARTICLE DATA' : 'SUMMARY'
    push('公開日', formatDate(post.published_at))
    push('カテゴリ', post.genre || cat?.name)
  }

  // ハイライトはカテゴリを問わずデータ表の最後に出す
  push(post.highlight_label || 'ハイライト', post.highlight_value)
  push('補足', post.highlight_sub)

  const hasRatings = post.rating != null || post.cospa != null
  const hasRecommend = !!post.recommend_items
  if (!rows.length && !hasRatings && !hasRecommend) return null

  const items = (post.recommend_items || '')
    .split(/[\n/／・]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div class="overflow-hidden rounded-big border border-edge2 bg-panel">
      <div class="border-b border-edge2 px-5 py-3.5">
        <p class="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">{heading}</p>
      </div>

      <dl class="divide-y divide-edge2">
        {rows.map((r) => (
          <div class={`grid px-5 py-3 ${String(r.value).length > 20 ? 'grid-cols-1 gap-1' : 'grid-cols-[86px_minmax(0,1fr)] gap-3'}`}>
            <dt class="text-[11px] leading-[1.6] text-mute">{r.label}</dt>
            <dd
              class={`text-[13.5px] leading-[1.65] text-ink ${
                NUMERIC.has(r.label) ? 'font-mono tabular-nums font-medium' : ''
              }`}
            >
              {r.value}
            </dd>
          </div>
        ))}

        {/* 評価（スーパー） */}
        {post.rating != null ? (
          <div class="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3 px-5 py-3">
            <dt class="text-[11px] text-mute">総合評価</dt>
            <dd>
              <Stars value={post.rating} />
            </dd>
          </div>
        ) : null}
        {post.cospa != null ? (
          <div class="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3 px-5 py-3">
            <dt class="text-[11px] text-mute">コスパ</dt>
            <dd>
              <Stars value={post.cospa} />
            </dd>
          </div>
        ) : null}
      </dl>

      {/* 推し買い */}
      {items.length ? (
        <div class="border-t border-edge2 p-3.5">
          <div class="rounded-xl border border-brand/25 bg-brandsoft p-3.5">
            <p class="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.06em] text-brand">
              <i class={`fa-solid ${pickIcon(post.category)} text-[9.5px]`}></i>
              {pickLabel(post.category)}
            </p>
            <ul class="mt-2 space-y-1.5">
              {items.map((it) => (
                <li class="text-[13px] leading-[1.6] text-ink">{it}</li>
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
  const accent = ACCENT
  const isSuper = linked.category === 'supermarket'
  const eyebrow = isSuper ? 'Local Stop' : 'Related Ride'
  const heading = isSuper ? 'このツーリングで寄った店' : 'この店に寄ったツーリング'

  const items = (linked.recommend_items || '')
    .split(/[\n/／・]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <section class="mt-10">
      <BlockTitle eyebrow={eyebrow} title={heading} accent={accent} />

      <div class="max-w-[400px] overflow-hidden rounded-big border border-edge2 bg-panel">
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
            <div class="grid aspect-[16/10] w-full place-items-center bg-gradient-to-br from-brandsoft to-panel2">
              <i class={`fa-solid ${lc?.icon} text-[26px] text-brand/70`}></i>
            </div>
          )}
          <span class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
            <i class={`fa-solid ${lc?.icon} text-[9px] text-brand`}></i>
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
                <i class="fa-solid fa-location-dot mr-1.5 text-[10px] text-brand"></i>
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
              <Stars value={linked.rating} />
            </p>
          ) : null}

          {linked.summary ? (
            <p class="mt-3 text-[13.5px] leading-[1.8] text-sub">「{linked.summary}」</p>
          ) : null}

          {/* 推し買い */}
          {items.length ? (
            <div class="mt-4 rounded-xl border border-brand/25 bg-brandsoft p-3.5">
              <p class="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.06em] text-brand">
                <i class={`fa-solid ${pickIcon(linked.category)} text-[9px]`}></i>
                {pickLabel(linked.category)}
              </p>
              <p class="mt-1.5 text-[13px] leading-[1.7] text-ink">{items.join(' / ')}</p>
            </div>
          ) : null}

          {/* 下段：現在の記事へのタグ + 地図ボタン */}
          <div class="mt-4 flex items-center justify-between gap-3">
            <a
              href={`/posts/${current.slug}`}
              class="truncate rounded-full border border-brand/25 bg-brandsoft px-3 py-1 text-[11px] text-brand transition hover:brightness-125"
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
