import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORIES, CATEGORY_MAP } from '../lib/config'
import { PostCard, SectionTitle, EmptyState, SpecRow } from './components'
import { ArrowLink } from './layout'
import { formatDate, yen } from '../lib/utils'

type Props = {
  latest: Post[]
  byCategory: Record<string, Post[]>
  counts: Record<string, number>
  stats: any[]
  totalDistance: number
  superCount: number
}

export const HomePage: FC<Props> = ({ latest, byCategory, counts, stats, totalDistance, superCount }) => {
  const last = stats.length ? stats[stats.length - 1] : null
  const prev = stats.length > 1 ? stats[stats.length - 2] : null
  const diff = last && prev && last.total_assets && prev.total_assets ? last.total_assets - prev.total_assets : null
  const totalPosts = Object.values(counts).reduce((a, b) => a + b, 0)
  const heroPost = (byCategory.touring || []).find((p) => p.cover_image)

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section class="relative overflow-hidden bg-white">
        <div class="mx-auto max-w-page px-5 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24">
          <p class="hero-line text-[13px] font-semibold uppercase tracking-[0.16em] text-mute">Personal Archive</p>
          <h1 class="hero-line mx-auto mt-5 max-w-[880px] text-[40px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[72px]">
            お金と暮らしと、
            <br />
            走った距離を記録する。
          </h1>
          <p class="hero-line mx-auto mt-6 max-w-[600px] text-[17px] leading-[1.5] tracking-[-0.01em] text-sub sm:text-[21px]">
            資産運用、生活費、ツーリング、ご当地スーパー、そして仕事のIT。
            <br class="hidden sm:block" />
            5つのテーマを、数字と写真で残していきます。
          </p>
          <div class="hero-line mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <ArrowLink href="/category/asset">資産の記録を見る</ArrowLink>
            <ArrowLink href="/category/touring">ツーリングログを見る</ArrowLink>
          </div>
        </div>

        {/* ヒーロー画像（最新ツーリングのカバー） */}
        {heroPost ? (
          <div class="hero-media mx-auto max-w-[1180px] px-5 sm:px-6">
            <a href={`/posts/${heroPost.slug}`} class="group block overflow-hidden rounded-big bg-hazy">
              <div class="relative aspect-[16/10] sm:aspect-[21/9]">
                <img
                  src={heroPost.cover_image!}
                  alt={heroPost.title}
                  class="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div class="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Latest Ride</p>
                  <p class="mt-2 max-w-xl text-[22px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[32px]">
                    {heroPost.title}
                  </p>
                  <p class="mt-3 text-[13px] text-white/70">
                    {heroPost.prefecture ? heroPost.prefecture + ' ・ ' : ''}
                    {heroPost.distance_km ? heroPost.distance_km + ' km ・ ' : ''}
                    {formatDate(heroPost.published_at)}
                  </p>
                </div>
              </div>
            </a>
          </div>
        ) : null}

        {/* 数値スペック */}
        <div class="mx-auto mt-16 max-w-page px-5 pb-16 sm:mt-24 sm:px-6 sm:pb-24">
          <div class="reveal">
            <SpecRow
              items={[
                {
                  label: '総資産',
                  value: last?.total_assets ? `¥${(last.total_assets / 10000).toLocaleString()}万` : '—',
                  sub: diff ? `前月比 ${diff > 0 ? '+' : ''}${Math.round(diff / 10000)}万円` : undefined
                },
                { label: '総走行距離', value: totalDistance ? `${totalDistance.toLocaleString()} km` : '—' },
                { label: '訪問したスーパー', value: `${superCount} 店` },
                { label: '公開記事', value: `${totalPosts} 本` }
              ]}
            />
          </div>
        </div>
      </section>

      {/* ==================== テーマ一覧 ==================== */}
      <section class="bg-hazy py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Explore"
              title="5つのテーマ。"
              desc="それぞれ違う切り口で記録しています。気になるテーマから読み進めてください。"
            />
          </div>
          <div class="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <a
                href={`/category/${c.key}`}
                class={`reveal group flex flex-col justify-between overflow-hidden rounded-big bg-white p-8 transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)] ${
                  i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
                style={`transition-delay:${i * 60}ms`}
              >
                <div>
                  <span
                    class="grid h-12 w-12 place-items-center rounded-2xl"
                    style={`background:${c.accentSoft};color:${c.accent}`}
                  >
                    <i class={`fa-solid ${c.icon} text-[18px]`}></i>
                  </span>
                  <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em]" style={`color:${c.accent}`}>
                    {c.short}
                  </p>
                  <h3 class="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em]">{c.name}</h3>
                  <p class="mt-3 text-[14px] leading-relaxed text-sub">{c.description}</p>
                </div>
                <p class="mt-8 flex items-center gap-1.5 text-[13px] text-blue">
                  {counts[c.key] || 0} 記事を見る
                  <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                </p>
              </a>
            ))}
            <a
              href="/map"
              class="reveal group relative flex flex-col justify-between overflow-hidden rounded-big bg-ink p-8 text-white transition duration-500 hover:-translate-y-1"
              style="transition-delay:300ms"
            >
              <div>
                <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                  <i class="fa-solid fa-map-location-dot text-[18px]"></i>
                </span>
                <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">Map</p>
                <h3 class="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em]">走行 & スーパーマップ</h3>
                <p class="mt-3 text-[14px] leading-relaxed text-white/60">
                  訪れた場所とスーパーを、1枚の地図で。ピンから記事へ移動できます。
                </p>
              </div>
              <p class="mt-8 flex items-center gap-1.5 text-[13px] text-white/80">
                地図を開く
                <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== MONEY ==================== */}
      <section class="bg-white py-16 sm:py-28">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Money"
              title="増えたか、減ったか。"
              desc="総資産・NISA・iDeCo・生活費。感覚ではなく数字で振り返ります。"
              accent="#10b981"
            />
          </div>

          {stats.length ? (
            <div class="reveal mt-12 overflow-hidden rounded-big bg-hazy p-6 sm:mt-16 sm:p-12">
              <div class="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p class="text-[12px] text-mute">{last?.ym} 時点の総資産</p>
                  <p class="mt-2 text-[40px] font-semibold leading-none tracking-[-0.03em] sm:text-[56px]">
                    {yen(last?.total_assets)}
                  </p>
                  {diff ? (
                    <p class="mt-3 text-[14px] font-medium" style={`color:${diff > 0 ? '#10b981' : '#ff3b30'}`}>
                      前月比 {diff > 0 ? '+' : ''}
                      {yen(Math.abs(diff)).replace('¥', diff > 0 ? '¥' : '-¥')}
                    </p>
                  ) : null}
                </div>
                <div class="grid grid-cols-3 gap-8">
                  {[
                    { l: 'NISA', v: last?.nisa_value },
                    { l: 'iDeCo', v: last?.ideco_value },
                    { l: '生活費', v: last?.living_cost }
                  ].map((x) => (
                    <div>
                      <p class="text-[11px] text-mute">{x.l}</p>
                      <p class="mt-1.5 text-[17px] font-semibold tracking-tight sm:text-[20px]">{yen(x.v)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div class="mt-10 h-[240px] sm:h-[300px]">
                <canvas id="home-asset-chart"></canvas>
              </div>
            </div>
          ) : null}

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            {[...(byCategory.asset || []).slice(0, 1), ...(byCategory.life || []).slice(0, 1)].map((p) => (
              <div class="reveal">
                <PostCard post={p} />
              </div>
            ))}
          </div>

          <div class="reveal mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3">
            <ArrowLink href="/category/asset">資産運用の記事をすべて見る</ArrowLink>
            <ArrowLink href="/category/life">生活費の記事をすべて見る</ArrowLink>
          </div>
        </div>
      </section>

      {/* ==================== TRAVEL（ツーリング） ==================== */}
      <section class="bg-ink py-16 sm:py-28">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Touring"
              title="走った分だけ、記憶が増える。"
              desc="ルート、距離、天気、そして景色。あとから辿れるように残しています。"
              light
            />
          </div>
        </div>

        {(byCategory.touring || []).length ? (
          <div class="reveal mt-12 sm:mt-16">
            <div class="snap-row flex gap-4 overflow-x-auto px-5 pb-4 sm:px-6">
              {(byCategory.touring || []).slice(0, 4).map((p) => (
                <div class="w-[78vw] shrink-0 snap-start sm:w-[340px]">
                  <PostCard post={p} showCategory={false} />
                </div>
              ))}
              <div class="w-1 shrink-0"></div>
            </div>
          </div>
        ) : (
          <div class="mx-auto mt-12 max-w-page px-5 sm:px-6">
            <EmptyState text="ツーリング記録はまだありません" light />
          </div>
        )}

        <div class="reveal mx-auto mt-12 max-w-page px-5 sm:px-6">
          <div class="border-t border-white/10 pt-10">
            <SpecRow
              light
              items={[
                { label: '総走行距離', value: totalDistance ? `${totalDistance.toLocaleString()} km` : '—' },
                { label: 'ログ数', value: `${counts.touring || 0} 本` },
                { label: '訪問スーパー', value: `${superCount} 店` },
                { label: 'マップ', value: '公開中' }
              ]}
            />
            <div class="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3">
              <ArrowLink href="/category/touring" color="#2997ff">
                ツーリングログを見る
              </ArrowLink>
              <ArrowLink href="/map" color="#2997ff">
                マップで見る
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ご当地スーパー ==================== */}
      <section class="bg-hazy py-16 sm:py-28">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Local Super"
              title="旅先で、一番おもしろい場所。"
              desc="ご当地スーパーの品揃えと価格は、その土地の暮らしそのもの。星とコスパで記録します。"
              accent="#f43f5e"
            />
          </div>
          {(byCategory.supermarket || []).length ? (
            <div class="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {(byCategory.supermarket || []).slice(0, 3).map((p, i) => (
                <div class="reveal" style={`transition-delay:${i * 70}ms`}>
                  <PostCard post={p} showCategory={false} />
                </div>
              ))}
            </div>
          ) : (
            <div class="mt-12">
              <EmptyState text="スーパーのレビューはまだありません" />
            </div>
          )}
          <div class="reveal mt-12 text-center">
            <ArrowLink href="/category/supermarket">レビューをすべて見る</ArrowLink>
          </div>
        </div>
      </section>

      {/* ==================== TECH ==================== */}
      <section class="bg-ink py-16 sm:py-28">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Tech"
              title="社内SEの現場と、生成AI。"
              desc="情シスとして試したこと、効いたこと、効かなかったこと。実務ベースで書いています。"
              light
            />
          </div>
          {(byCategory.it || []).length ? (
            <div class="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {(byCategory.it || []).slice(0, 3).map((p, i) => (
                <a
                  href={`/posts/${p.slug}`}
                  class="reveal group flex h-full flex-col rounded-big bg-white/[0.06] p-7 transition hover:bg-white/[0.1]"
                  style={`transition-delay:${i * 70}ms`}
                >
                  <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                    {formatDate(p.published_at)}
                  </p>
                  <h3 class="mt-4 text-[20px] font-semibold leading-snug tracking-[-0.01em] text-white">{p.title}</h3>
                  <p class="mt-3 line-clamp-4 text-[14px] leading-relaxed text-white/60">{p.summary}</p>
                  <p class="mt-auto flex items-center gap-1.5 pt-6 text-[13px]" style="color:#2997ff">
                    続きを読む
                    <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div class="mt-12">
              <EmptyState text="IT記事はまだありません" light />
            </div>
          )}
          <div class="reveal mt-12 text-center">
            <ArrowLink href="/category/it" color="#2997ff">
              IT / 生成AI の記事を見る
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* ==================== 新着 ==================== */}
      <section class="bg-white py-16 sm:py-24">
        <div class="mx-auto max-w-[860px] px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle eyebrow="Latest" title="新着の記録。" />
          </div>
          <div class="mt-10 sm:mt-14">
            {latest.length ? (
              latest.slice(0, 6).map((p) => (
                <a
                  href={`/posts/${p.slug}`}
                  class="reveal group flex items-center gap-5 border-b border-black/[0.08] py-5 transition hover:opacity-70"
                >
                  <span class="w-[86px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-mute">
                    {CATEGORY_MAP[p.category]?.short}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-[16px] font-medium leading-snug tracking-[-0.01em]">{p.title}</span>
                    <span class="mt-1 block text-[12px] text-mute">{formatDate(p.published_at)}</span>
                  </span>
                  <i class="fa-solid fa-chevron-right text-[11px] text-mute transition group-hover:translate-x-0.5"></i>
                </a>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
          <div class="reveal mt-10 text-center">
            <ArrowLink href="/search">すべての記事を探す</ArrowLink>
          </div>
        </div>
      </section>
    </>
  )
}
