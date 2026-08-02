import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORIES, CATEGORY_MAP, GROUPS, SITE } from '../lib/config'
import { PostCard, SectionHeading, EmptyState } from './components'
import { formatDate, stripMd, yen } from '../lib/utils'

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

  return (
    <>
      {/* ===== HERO ===== */}
      <section class="relative overflow-hidden border-b border-slate-200 bg-white">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"></div>
        <div class="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl"></div>
        <div class="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-ink-soft backdrop-blur">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
            PERSONAL ARCHIVE
          </p>
          <h1 class="mt-5 max-w-3xl text-[32px] font-black leading-[1.15] tracking-tight sm:text-5xl">
            お金と暮らしと、
            <br class="hidden sm:block" />
            <span class="bg-gradient-to-r from-sky-500 via-emerald-500 to-rose-500 bg-clip-text text-transparent">
              走った距離
            </span>
            の記録。
          </h1>
          <p class="mt-5 max-w-xl text-[13px] leading-relaxed text-ink-soft sm:text-[15px]">{SITE.description}</p>

          <div class="mt-8 flex flex-wrap gap-2.5">
            {GROUPS.map((g) => {
              const first = CATEGORIES.find((c) => c.group === g.key)!
              return (
                <a
                  href={`/category/${first.key}`}
                  class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-slate-700"
                >
                  <i class={`fa-solid ${g.icon} text-xs`}></i>
                  {g.label}
                </a>
              )
            })}
          </div>

          <dl class="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="記事数" value={`${totalPosts}`} unit="本" icon="fa-file-lines" />
            <Stat
              label="総資産"
              value={last?.total_assets ? Math.round(last.total_assets / 10000).toLocaleString() : '—'}
              unit="万円"
              icon="fa-sack-dollar"
              sub={diff ? `${diff > 0 ? '+' : ''}${Math.round(diff / 10000)}万` : undefined}
            />
            <Stat label="走行距離" value={totalDistance ? totalDistance.toLocaleString() : '—'} unit="km" icon="fa-route" />
            <Stat label="スーパー" value={`${superCount}`} unit="店" icon="fa-basket-shopping" />
          </dl>
        </div>
      </section>

      {/* ===== カテゴリ動線 ===== */}
      <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="EXPLORE"
          title="5つのテーマ"
          desc="興味のあるテーマから読み進められます。それぞれ記録の切り口が違います。"
        />
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <a
              href={`/category/${c.key}`}
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                class="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-60 transition group-hover:scale-125"
                style={`background:${c.accentSoft}`}
              ></div>
              <div class="relative">
                <span
                  class="grid h-11 w-11 place-items-center rounded-xl"
                  style={`background:${c.accentSoft};color:${c.accent}`}
                >
                  <i class={`fa-solid ${c.icon} text-lg`}></i>
                </span>
                <p class="mt-4 text-[10px] font-black tracking-[0.2em]" style={`color:${c.accent}`}>
                  {c.short}
                </p>
                <h3 class="mt-1 text-lg font-extrabold tracking-tight">{c.name}</h3>
                <p class="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{c.description}</p>
                <p class="mt-4 flex items-center gap-2 text-[11px] font-bold text-ink-mute">
                  <span>{counts[c.key] || 0} 記事</span>
                  <i class="fa-solid fa-arrow-right transition group-hover:translate-x-1"></i>
                </p>
              </div>
            </a>
          ))}
          <a
            href="/map"
            class="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-soft transition hover:-translate-y-0.5"
          >
            <div>
              <span class="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                <i class="fa-solid fa-map-location-dot text-lg"></i>
              </span>
              <p class="mt-4 text-[10px] font-black tracking-[0.2em] text-white/60">MAP</p>
              <h3 class="mt-1 text-lg font-extrabold tracking-tight">走行 & スーパーマップ</h3>
              <p class="mt-2 text-[12.5px] leading-relaxed text-white/70">
                ツーリング先とご当地スーパーを地図上でまとめてチェック。
              </p>
            </div>
            <p class="mt-4 flex items-center gap-2 text-[11px] font-bold text-white/60">
              地図を開く<i class="fa-solid fa-arrow-right transition group-hover:translate-x-1"></i>
            </p>
          </a>
        </div>
      </section>

      {/* ===== MONEY ゾーン ===== */}
      <section class="border-y border-slate-200 bg-white">
        <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeading
            eyebrow="MONEY"
            title="資産と暮らしの数字"
            desc="NISA・iDeCoの積み上げと、実際の生活費をあわせて記録しています。"
            color="#10b981"
          />
          <div class="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div class="rounded-2xl border border-slate-200 p-5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h3 class="text-sm font-extrabold">資産推移 / 生活費</h3>
                {last ? <span class="text-[11px] font-semibold text-ink-mute">最新 {last.ym}</span> : null}
              </div>
              {stats.length ? (
                <>
                  <div class="mt-4 h-56">
                    <canvas id="home-asset-chart"></canvas>
                  </div>
                  <div class="mt-4 grid grid-cols-3 gap-2 text-center">
                    <MiniStat label="総資産" value={yen(last?.total_assets)} color="#10b981" />
                    <MiniStat label="NISA" value={yen(last?.nisa_value)} color="#0ea5e9" />
                    <MiniStat label="iDeCo" value={yen(last?.ideco_value)} color="#8b5cf6" />
                  </div>
                </>
              ) : (
                <p class="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-ink-mute">
                  管理画面の「月次データ」から資産・生活費を登録するとグラフが表示されます。
                </p>
              )}
            </div>
            <div class="space-y-3">
              {[...(byCategory.asset || []).slice(0, 2), ...(byCategory.life || []).slice(0, 2)].length ? (
                [...(byCategory.asset || []).slice(0, 2), ...(byCategory.life || []).slice(0, 2)].map((p) => (
                  <PostCard post={p} />
                ))
              ) : (
                <EmptyState text="資産運用・生活の記事はまだありません" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRAVEL ゾーン ===== */}
      <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="TRAVEL"
          title="ツーリングログ"
          desc="走った道、見た景色、立ち寄ったスポット。"
          color="#0ea5e9"
          href="/category/touring"
        />
        {(byCategory.touring || []).length ? (
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(byCategory.touring || []).slice(0, 3).map((p) => (
              <PostCard post={p} showCategory={false} />
            ))}
          </div>
        ) : (
          <EmptyState text="ツーリング記録はまだありません" />
        )}

        <div class="mt-14">
          <SectionHeading
            eyebrow="LOCAL SUPER"
            title="ご当地スーパー紹介"
            desc="旅先のスーパーは一番おもしろい観光地。品揃えとコスパをレビュー。"
            color="#f43f5e"
            href="/category/supermarket"
          />
          {(byCategory.supermarket || []).length ? (
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(byCategory.supermarket || []).slice(0, 3).map((p) => (
                <PostCard post={p} showCategory={false} />
              ))}
            </div>
          ) : (
            <EmptyState text="スーパーのレビューはまだありません" />
          )}
        </div>
      </section>

      {/* ===== TECH ゾーン ===== */}
      <section class="border-t border-slate-200 bg-slate-900">
        <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-[11px] font-extrabold tracking-[0.18em] text-violet-400">TECH</p>
              <h2 class="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">社内SE / 生成AI</h2>
              <p class="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/60">
                情シスの現場で試したこと、生成AIの実践的な使い方。
              </p>
            </div>
            <a
              href="/category/it"
              class="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3.5 py-2 text-xs font-bold text-white/80 transition hover:bg-white/10"
            >
              もっと見る<i class="fa-solid fa-arrow-right text-[10px]"></i>
            </a>
          </div>
          {(byCategory.it || []).length ? (
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(byCategory.it || []).slice(0, 3).map((p) => (
                <a
                  href={`/posts/${p.slug}`}
                  class="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/10"
                >
                  <p class="text-[11px] font-semibold text-white/40">{formatDate(p.published_at)}</p>
                  <h3 class="mt-2 line-clamp-2 text-[15px] font-bold leading-snug text-white">{p.title}</h3>
                  <p class="mt-2 line-clamp-3 text-xs leading-relaxed text-white/55">
                    {p.summary || stripMd(p.body, 130)}
                  </p>
                  <div class="mt-4 flex flex-wrap gap-1.5">
                    {(p.tags || []).slice(0, 3).map((t) => (
                      <span class="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">#{t}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div class="rounded-2xl border border-dashed border-white/20 px-6 py-12 text-center text-sm text-white/50">
              IT記事はまだありません
            </div>
          )}
        </div>
      </section>

      {/* ===== 最新記事 ===== */}
      <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading eyebrow="LATEST" title="新着記事" desc="カテゴリ横断の最新更新。" href="/search" />
        {latest.length ? (
          <div class="grid gap-3 md:grid-cols-2">
            {latest.slice(0, 6).map((p) => (
              <a
                href={`/posts/${p.slug}`}
                class="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-soft"
              >
                <span
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={`background:${CATEGORY_MAP[p.category]?.accentSoft};color:${CATEGORY_MAP[p.category]?.accent}`}
                >
                  <i class={`fa-solid ${CATEGORY_MAP[p.category]?.icon} text-sm`}></i>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-[14px] font-bold group-hover:opacity-70">{p.title}</span>
                  <span class="mt-0.5 block text-[11px] text-ink-mute">
                    {CATEGORY_MAP[p.category]?.name} ・ {formatDate(p.published_at)}
                  </span>
                </span>
                <i class="fa-solid fa-chevron-right text-[10px] text-ink-mute"></i>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </>
  )
}

const Stat: FC<{ label: string; value: string; unit?: string; icon: string; sub?: string }> = ({
  label,
  value,
  unit,
  icon,
  sub
}) => (
  <div class="rounded-2xl border border-slate-200 bg-white/70 p-3.5 backdrop-blur">
    <p class="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-ink-mute">
      <i class={`fa-solid ${icon}`}></i>
      {label}
    </p>
    <p class="mt-1.5 flex items-baseline gap-1">
      <span class="text-xl font-black tracking-tight">{value}</span>
      {unit ? <span class="text-[11px] font-bold text-ink-mute">{unit}</span> : null}
    </p>
    {sub ? <p class="text-[10px] font-bold text-emerald-600">{sub}</p> : null}
  </div>
)

const MiniStat: FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div class="rounded-xl bg-slate-50 p-2.5">
    <p class="text-[9px] font-bold tracking-wider text-ink-mute">{label}</p>
    <p class="mt-0.5 text-[13px] font-extrabold" style={`color:${color}`}>
      {value}
    </p>
  </div>
)
