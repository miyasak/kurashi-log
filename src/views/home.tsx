import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORIES, CATEGORY_MAP } from '../lib/config'
import { PostCard, SectionTitle, EmptyState, SpecRow } from './components'
import { ArrowLink, PillButton } from './layout'
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
  const prefCount = new Set(
    [...(byCategory.touring || []), ...(byCategory.supermarket || [])].map((p) => p.prefecture).filter(Boolean)
  ).size

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section class="relative -mt-16 overflow-hidden bg-base pt-16">
        {/* 背景写真 */}
        {heroPost?.cover_image ? (
          <div class="absolute inset-0">
            <img src={heroPost.cover_image} alt="" class="h-full w-full object-cover opacity-70" />
            <div class="absolute inset-0 bg-gradient-to-r from-base via-base/85 to-base/10"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-base via-transparent to-base/70"></div>
          </div>
        ) : (
          <div class="absolute inset-0 bg-gradient-to-br from-panel2 via-base to-black"></div>
        )}

        <div class="relative mx-auto max-w-page px-5 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-24">
          <div class="max-w-[640px]">
            <p class="hero-line inline-flex items-center gap-2.5 rounded-full border border-brand/40 bg-brandsoft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              <i class="fa-solid fa-motorcycle text-[11px]"></i>
              Personal Archive
            </p>
            <h1 class="hero-line mt-7 text-[38px] font-bold leading-[1.12] tracking-[-0.03em] text-white sm:text-[60px]">
              走った道と、
              <br />
              その土地の<span class="text-brand">数字</span>の記録。
            </h1>
            <p class="hero-line mt-6 max-w-[520px] text-[14.5px] leading-[1.85] text-sub sm:text-[16px]">
              資産運用・生活費・ツーリング・ご当地スーパー・社内SEとしてのIT。
              5つのテーマを、写真とルートと<span class="font-medium text-ink">実額の数字</span>であとから辿れるように残しています。
            </p>
            <div class="hero-line mt-9 flex flex-wrap items-center gap-3">
              <PillButton href="/category/touring" icon="fa-motorcycle">
                ツーリング記録を見る
              </PillButton>
              <PillButton href="/category/asset" variant="ghost" icon="fa-chart-line">
                資産の記録を見る
              </PillButton>
            </div>
          </div>

          {/* 数値スペック */}
          <div class="hero-media mt-14 sm:mt-20">
            <div class="rounded-big border border-edge bg-panel/80 px-4 py-8 backdrop-blur-xl sm:px-6 sm:py-9">
              <SpecRow
                panel={false}
                items={[
                  {
                    label: '総資産',
                    value: last?.total_assets ? `${(last.total_assets / 10000).toLocaleString()}万` : '—',
                    sub: diff ? `前月比 ${diff > 0 ? '+' : ''}${Math.round(diff / 10000)}万円` : undefined,
                    accent: '#34d399'
                  },
                  {
                    label: '走行距離 km',
                    value: totalDistance ? totalDistance.toLocaleString() : '—',
                    accent: '#fb923c'
                  },
                  { label: '立ち寄り店', value: String(superCount), accent: '#fb7185' },
                  { label: '公開記事', value: String(totalPosts) }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== テーマ一覧 ==================== */}
      <section class="border-t border-edge2 bg-panel py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Explore"
              icon="fa-compass"
              title="5つのテーマ。"
              desc="それぞれ違う切り口で記録しています。気になるテーマから読み進めてください。"
            />
          </div>
          <div class="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <a
                href={`/category/${c.key}`}
                class="reveal group flex flex-col justify-between overflow-hidden rounded-big border border-edge2 bg-base p-7 transition duration-500 hover:-translate-y-1 hover:border-edge"
                style={`transition-delay:${i * 60}ms`}
              >
                <div>
                  <span
                    class="grid h-12 w-12 place-items-center rounded-2xl"
                    style={`background:${c.accentSoft};color:${c.accent}`}
                  >
                    <i class={`fa-solid ${c.icon} text-[17px]`}></i>
                  </span>
                  <p class="mt-6 text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={`color:${c.accent}`}>
                    {c.short}
                  </p>
                  <h3 class="mt-2 text-[22px] font-bold leading-tight tracking-[-0.02em]">{c.name}</h3>
                  <p class="mt-3 text-[13.5px] leading-relaxed text-sub">{c.description}</p>
                </div>
                <p class="mt-8 flex items-center gap-1.5 text-[13px] font-medium" style={`color:${c.accent}`}>
                  {counts[c.key] || 0} 記事を見る
                  <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                </p>
              </a>
            ))}

            {/* マップタイル */}
            <a
              href="/map"
              class="reveal group relative flex flex-col justify-between overflow-hidden rounded-big border border-brand/30 p-7 transition duration-500 hover:-translate-y-1 hover:border-brand/60"
              style="transition-delay:300ms;background:linear-gradient(150deg,rgba(249,115,22,0.16),rgba(249,115,22,0.03))"
            >
              <div>
                <span class="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white">
                  <i class="fa-solid fa-map-location-dot text-[17px]"></i>
                </span>
                <p class="mt-6 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand">Map</p>
                <h3 class="mt-2 text-[22px] font-bold leading-tight tracking-[-0.02em]">走行 & スーパーマップ</h3>
                <p class="mt-3 text-[13.5px] leading-relaxed text-sub">
                  訪れた場所とスーパーを1枚の地図に。ピンから記事へ移動できます。
                </p>
              </div>
              <p class="mt-8 flex items-center gap-1.5 text-[13px] font-medium text-brand">
                地図を開く
                <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== MONEY ==================== */}
      <section class="border-t border-edge2 bg-base py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Money"
              icon="fa-coins"
              title="増えたか、減ったか。"
              desc="総資産・NISA・iDeCo・生活費。感覚ではなく数字で振り返ります。"
              accent="#34d399"
            />
          </div>

          {stats.length ? (
            <div class="reveal mt-12 overflow-hidden rounded-big border border-edge2 bg-panel p-6 sm:mt-16 sm:p-10">
              <div class="flex flex-wrap items-end justify-between gap-7">
                <div>
                  <p class="text-[11px] font-medium uppercase tracking-[0.12em] text-mute">
                    {last?.ym} 時点の総資産
                  </p>
                  <p class="mt-3 text-[38px] font-bold leading-none tracking-[-0.03em] sm:text-[52px]">
                    {yen(last?.total_assets)}
                  </p>
                  {diff ? (
                    <p
                      class="mt-3.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold"
                      style={`background:${diff > 0 ? 'rgba(52,211,153,.12)' : 'rgba(251,113,133,.12)'};color:${
                        diff > 0 ? '#34d399' : '#fb7185'
                      }`}
                    >
                      <i class={`fa-solid ${diff > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[10px]`}></i>
                      前月比 {diff > 0 ? '+' : '-'}
                      {yen(Math.abs(diff)).replace('¥', '¥')}
                    </p>
                  ) : null}
                </div>
                <div class="grid grid-cols-3 gap-7 sm:gap-10">
                  {[
                    { l: 'NISA', v: last?.nisa_value, c: '#34d399' },
                    { l: 'iDeCo', v: last?.ideco_value, c: '#a78bfa' },
                    { l: '生活費', v: last?.living_cost, c: '#fbbf24' }
                  ].map((x) => (
                    <div>
                      <p class="text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={`color:${x.c}`}>
                        {x.l}
                      </p>
                      <p class="mt-1.5 text-[16px] font-bold tracking-tight sm:text-[19px]">{yen(x.v)}</p>
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
            <ArrowLink href="/category/asset" color="#34d399">
              資産運用の記事をすべて見る
            </ArrowLink>
            <ArrowLink href="/category/life" color="#fbbf24">
              生活費の記事をすべて見る
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* ==================== TOURING ==================== */}
      <section class="relative border-t border-edge2 bg-panel py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Touring"
              icon="fa-route"
              title="走った分だけ、記憶が増える。"
              desc="ルート、距離、天気、そして景色。あとから辿れるように残しています。"
            />
          </div>
        </div>

        {(byCategory.touring || []).length ? (
          <div class="reveal mt-12 sm:mt-16">
            <div class="snap-row px-5 pb-4 sm:px-6">
              {(byCategory.touring || []).slice(0, 4).map((p) => (
                <div class="w-[78vw] sm:w-[330px]">
                  <PostCard post={p} showCategory={false} />
                </div>
              ))}
              <div class="w-1"></div>
            </div>
            <p class="mt-3 px-5 text-[11px] text-mute sm:px-6 lg:hidden">
              <i class="fa-solid fa-hand-point-right mr-1.5"></i>横にスワイプできます
            </p>
          </div>
        ) : (
          <div class="mx-auto mt-12 max-w-page px-5 sm:px-6">
            <EmptyState text="ツーリング記録はまだありません" />
          </div>
        )}

        <div class="reveal mx-auto mt-14 max-w-page px-5 sm:px-6">
          <SpecRow
            items={[
              { label: '総走行距離 km', value: totalDistance ? totalDistance.toLocaleString() : '—', accent: '#fb923c' },
              { label: '都道府県', value: String(prefCount || '—') },
              { label: 'ログ数', value: String(counts.touring || 0) },
              { label: '立ち寄り店', value: String(superCount), accent: '#fb7185' }
            ]}
          />
          <div class="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3">
            <ArrowLink href="/category/touring">ツーリングログを見る</ArrowLink>
            <ArrowLink href="/map">マップで見る</ArrowLink>
          </div>
        </div>
      </section>

      {/* ==================== ご当地スーパー ==================== */}
      <section class="border-t border-edge2 bg-base py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Local Super"
              icon="fa-basket-shopping"
              title="旅先で、一番おもしろい場所。"
              desc="ご当地スーパーの品揃えと価格は、その土地の暮らしそのもの。星とコスパで記録します。"
              accent="#fb7185"
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
            <ArrowLink href="/category/supermarket" color="#fb7185">
              レビューをすべて見る
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* ==================== TECH ==================== */}
      <section class="border-t border-edge2 bg-panel py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle
              eyebrow="Tech"
              icon="fa-microchip"
              title="社内SEの現場と、生成AI。"
              desc="情シスとして試したこと、効いたこと、効かなかったこと。実務ベースで書いています。"
              accent="#a78bfa"
            />
          </div>
          {(byCategory.it || []).length ? (
            <div class="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {(byCategory.it || []).slice(0, 3).map((p, i) => (
                <div class="reveal" style={`transition-delay:${i * 70}ms`}>
                  <PostCard post={p} showCategory={false} />
                </div>
              ))}
            </div>
          ) : (
            <div class="mt-12">
              <EmptyState text="IT記事はまだありません" />
            </div>
          )}
          <div class="reveal mt-12 text-center">
            <ArrowLink href="/category/it" color="#a78bfa">
              IT / 生成AI の記事を見る
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* ==================== 新着 ==================== */}
      <section class="border-t border-edge2 bg-base py-16 sm:py-24">
        <div class="mx-auto max-w-[880px] px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle eyebrow="Latest" icon="fa-clock-rotate-left" title="新着の記録。" />
          </div>
          <div class="mt-10 sm:mt-14">
            {latest.length ? (
              latest.slice(0, 6).map((p) => {
                const c = CATEGORY_MAP[p.category]
                return (
                  <a
                    href={`/posts/${p.slug}`}
                    class="reveal group flex items-center gap-4 border-b border-edge2 py-5 transition hover:bg-white/[0.03] sm:gap-5"
                  >
                    <span
                      class="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                      style={`background:${c?.accentSoft};color:${c?.accent}`}
                    >
                      <i class={`fa-solid ${c?.icon} text-[13px]`}></i>
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block text-[10px] font-semibold uppercase tracking-[0.14em]" style={`color:${c?.accent}`}>
                        {c?.short}
                      </span>
                      <span class="mt-1 block text-[15px] font-medium leading-snug tracking-[-0.01em] sm:text-[16px]">
                        {p.title}
                      </span>
                      <span class="mt-1 block text-[11.5px] text-mute">{formatDate(p.published_at)}</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[11px] text-mute transition group-hover:translate-x-0.5"></i>
                  </a>
                )
              })
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
