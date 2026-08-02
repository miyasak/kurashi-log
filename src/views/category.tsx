import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import type { CategoryDef } from '../lib/config'
import { PostCard, EmptyState } from './components'
import { yen } from '../lib/utils'

type Props = {
  cat: CategoryDef
  posts: Post[]
  tags: { name: string; slug: string; cnt: number }[]
  activeTag?: string
  q?: string
  total: number
  page: number
  perPage: number
  stats: any[]
  summary: Record<string, any>
}

export const CategoryPage: FC<Props> = ({ cat, posts, tags, activeTag, q, total, page, perPage, stats, summary }) => {
  const pages = Math.max(1, Math.ceil(total / perPage))
  const listLayout =
    cat.key === 'asset' || cat.key === 'life'
      ? 'grid gap-3'
      : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <>
      {/* HERO */}
      <section
        class="relative overflow-hidden border-b border-slate-200"
        style={`background:linear-gradient(160deg, ${cat.accentSoft} 0%, #ffffff 65%)`}
      >
        <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <nav class="flex items-center gap-2 text-[11px] font-semibold text-ink-mute">
            <a href="/" class="hover:text-ink">HOME</a>
            <i class="fa-solid fa-chevron-right text-[8px]"></i>
            <span style={`color:${cat.accent}`}>{cat.name}</span>
          </nav>
          <div class="mt-4 flex items-start gap-4">
            <span
              class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white shadow-soft"
              style={`color:${cat.accent}`}
            >
              <i class={`fa-solid ${cat.icon} text-2xl`}></i>
            </span>
            <div>
              <p class="text-[10px] font-black tracking-[0.22em]" style={`color:${cat.accent}`}>{cat.short}</p>
              <h1 class="mt-0.5 text-2xl font-black tracking-tight sm:text-3xl">{cat.name}</h1>
              <p class="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-soft">{cat.description}</p>
            </div>
          </div>

          {/* カテゴリ別サマリー */}
          <CategorySummary cat={cat} summary={summary} total={total} />
        </div>
      </section>

      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div class="grid gap-8 lg:grid-cols-[1fr_260px]">
          <div>
            {/* 資産・生活のグラフ */}
            {(cat.key === 'asset' || cat.key === 'life') && stats.length ? (
              <div class="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <h2 class="text-sm font-extrabold">
                  {cat.key === 'asset' ? '資産推移（総資産 / NISA / iDeCo）' : '月別 生活費の推移'}
                </h2>
                <div class="mt-4 h-64">
                  <canvas id={cat.key === 'asset' ? 'asset-chart' : 'life-chart'}></canvas>
                </div>
                {cat.key === 'life' ? (
                  <div class="mt-5">
                    <h3 class="text-xs font-extrabold text-ink-soft">直近月の費目内訳</h3>
                    <div class="mt-3 h-56"><canvas id="expense-chart"></canvas></div>
                  </div>
                ) : (
                  <div class="mt-5 overflow-x-auto">
                    <table class="w-full min-w-[420px] text-left text-xs">
                      <thead class="text-ink-mute">
                        <tr class="border-b border-slate-200">
                          <th class="py-2 font-bold">月</th>
                          <th class="py-2 text-right font-bold">総資産</th>
                          <th class="py-2 text-right font-bold">NISA</th>
                          <th class="py-2 text-right font-bold">iDeCo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.slice(-6).reverse().map((s: any) => (
                          <tr class="border-b border-slate-100">
                            <td class="py-2 font-bold">{s.ym}</td>
                            <td class="py-2 text-right font-semibold">{yen(s.total_assets)}</td>
                            <td class="py-2 text-right text-ink-soft">{yen(s.nisa_value)}</td>
                            <td class="py-2 text-right text-ink-soft">{yen(s.ideco_value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}

            {/* 地図 */}
            {(cat.key === 'touring' || cat.key === 'supermarket') ? (
              <div class="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <div class="flex items-center justify-between px-5 py-3.5">
                  <h2 class="text-sm font-extrabold">
                    <i class="fa-solid fa-map-location-dot mr-2" style={`color:${cat.accent}`}></i>
                    {cat.key === 'touring' ? '訪問エリアマップ' : 'スーパーマップ'}
                  </h2>
                  <a href="/map" class="text-[11px] font-bold text-ink-mute hover:text-ink">全体マップ →</a>
                </div>
                <div id="cat-map" class="h-[300px] w-full border-t border-slate-100" data-category={cat.key}></div>
              </div>
            ) : null}

            {/* 検索・並び */}
            <form action={`/category/${cat.key}`} method="get" class="mb-5 flex gap-2">
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-mute"></i>
                <input
                  type="search"
                  name="q"
                  value={q || ''}
                  placeholder={`${cat.name}の記事を検索`}
                  class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>
              {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
              <button class="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700">
                検索
              </button>
            </form>

            {activeTag ? (
              <div class="mb-4 flex items-center gap-2 text-xs">
                <span class="rounded-full px-3 py-1.5 font-bold" style={`background:${cat.accentSoft};color:${cat.accent}`}>
                  #{activeTag}
                </span>
                <a href={`/category/${cat.key}`} class="font-semibold text-ink-mute hover:text-ink">
                  <i class="fa-solid fa-xmark mr-1"></i>解除
                </a>
              </div>
            ) : null}

            <p class="mb-4 text-[11px] font-bold tracking-wider text-ink-mute">{total} 件の記事</p>

            {posts.length ? (
              <div class={listLayout}>
                {posts.map((p) => (
                  <PostCard post={p} showCategory={false} />
                ))}
              </div>
            ) : (
              <EmptyState text={`${cat.name}の記事はまだありません`} />
            )}

            {pages > 1 ? (
              <div class="mt-8 flex flex-wrap items-center justify-center gap-1.5">
                {Array.from({ length: pages }).map((_, i) => {
                  const n = i + 1
                  const params = new URLSearchParams()
                  if (q) params.set('q', q)
                  if (activeTag) params.set('tag', activeTag)
                  if (n > 1) params.set('page', String(n))
                  const qs = params.toString()
                  return (
                    <a
                      href={`/category/${cat.key}${qs ? '?' + qs : ''}`}
                      class={`grid h-9 min-w-9 place-items-center rounded-xl px-3 text-xs font-bold transition ${
                        n === page ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-ink-soft hover:border-slate-300'
                      }`}
                    >
                      {n}
                    </a>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* サイドバー */}
          <aside class="space-y-5">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 class="text-[11px] font-black tracking-widest text-ink-mute">TAGS</h3>
              {tags.length ? (
                <div class="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <a
                      href={`/category/${cat.key}?tag=${encodeURIComponent(t.slug)}`}
                      class={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        activeTag === t.slug ? 'text-white' : 'bg-slate-100 text-ink-soft hover:bg-slate-200'
                      }`}
                      style={activeTag === t.slug ? `background:${cat.accent}` : ''}
                    >
                      #{t.name}
                      <span class="ml-1 opacity-50">{t.cnt}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p class="mt-3 text-xs text-ink-mute">タグはまだありません</p>
              )}
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 class="text-[11px] font-black tracking-widest text-ink-mute">ABOUT THIS TOPIC</h3>
              <p class="mt-3 text-[12.5px] leading-relaxed text-ink-soft">{cat.description}</p>
              <p class="mt-3 text-[11px] font-bold" style={`color:${cat.accent}`}>{cat.tagline}</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

const CategorySummary: FC<{ cat: CategoryDef; summary: Record<string, any>; total: number }> = ({
  cat,
  summary,
  total
}) => {
  const items: { label: string; value: string }[] = []
  if (cat.key === 'asset') {
    items.push(
      { label: '総資産', value: yen(summary.total_assets) },
      { label: 'NISA評価額', value: yen(summary.nisa_value) },
      { label: 'iDeCo評価額', value: yen(summary.ideco_value) },
      { label: '記事数', value: `${total} 本` }
    )
  } else if (cat.key === 'life') {
    items.push(
      { label: '直近の生活費', value: yen(summary.living_cost) },
      { label: '平均生活費', value: yen(summary.avg_cost) },
      { label: '記録月数', value: `${summary.months || 0} ヶ月` },
      { label: '記事数', value: `${total} 本` }
    )
  } else if (cat.key === 'touring') {
    items.push(
      { label: '総走行距離', value: `${(summary.distance || 0).toLocaleString()} km` },
      { label: '訪問県数', value: `${summary.prefectures || 0} 県` },
      { label: '平均距離', value: `${Math.round(summary.avg_distance || 0)} km` },
      { label: 'ログ数', value: `${total} 本` }
    )
  } else if (cat.key === 'supermarket') {
    items.push(
      { label: '訪問店舗', value: `${total} 店` },
      { label: '平均評価', value: summary.avg_rating ? `★ ${summary.avg_rating.toFixed(1)}` : '—' },
      { label: '平均コスパ', value: summary.avg_cospa ? `★ ${summary.avg_cospa.toFixed(1)}` : '—' },
      { label: '平均会計', value: yen(summary.avg_budget) }
    )
  } else {
    items.push({ label: '記事数', value: `${total} 本` }, { label: 'テーマ', value: '社内SE / 生成AI' })
  }
  return (
    <dl class="mt-7 grid grid-cols-2 gap-2.5 sm:max-w-2xl sm:grid-cols-4">
      {items.map((it) => (
        <div class="rounded-xl border border-white/60 bg-white/80 p-3 backdrop-blur">
          <dt class="text-[10px] font-bold tracking-wider text-ink-mute">{it.label}</dt>
          <dd class="mt-1 text-[15px] font-black tracking-tight" style={`color:${cat.accent}`}>
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
