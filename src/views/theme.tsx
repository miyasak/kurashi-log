import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import type { ThemeDef } from '../lib/config'
import { CATEGORY_MAP } from '../lib/config'
import { PostCard, EmptyState, SpecRow, SectionTitle, validSpecs } from './components'
import { ArrowLink } from './layout'
import { yen } from '../lib/utils'

type Props = {
  theme: ThemeDef
  posts: Post[]
  /** 選択中のサブカテゴリ（未指定ならテーマ全体） */
  activeCat?: string
  /** サブカテゴリごとの件数 */
  counts: Record<string, number>
  tags: { name: string; slug: string; cnt: number }[]
  activeTag?: string
  q?: string
  total: number
  page: number
  perPage: number
  stats: any[]
  summary: Record<string, any>
}

export const ThemePage: FC<Props> = ({
  theme,
  posts,
  activeCat,
  counts,
  tags,
  activeTag,
  q,
  total,
  page,
  perPage,
  stats,
  summary
}) => {
  const pages = Math.max(1, Math.ceil(total / perPage))
  const specs = validSpecs(buildSpecs(theme, summary, counts))
  const hasSub = theme.categories.length > 1
  const base = `/theme/${theme.key}`
  const qsOf = (extra: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    if (extra.cat ?? activeCat) p.set('cat', (extra.cat ?? activeCat) as string)
    if (extra.q ?? q) p.set('q', (extra.q ?? q) as string)
    if (extra.tag ?? activeTag) p.set('tag', (extra.tag ?? activeTag) as string)
    if (extra.page && extra.page !== '1') p.set('page', extra.page)
    const s = p.toString()
    return s ? `?${s}` : ''
  }

  const showMoneyChart = theme.key === 'money' && stats.length > 0
  const showMap = theme.key === 'touring'

  return (
    <>
      {/* ============ 見出し（左揃え・コンパクト） ============ */}
      <section class="border-b border-edge2 bg-base">
        <div class="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-10">
          {/* パンくず */}
          <nav class="flex items-center gap-1.5 text-[11.5px] text-mute">
            <a href="/" class="transition hover:text-ink">ホーム</a>
            <i class="fa-solid fa-chevron-right text-[8px]"></i>
            <span class="text-sub">{theme.label}</span>
          </nav>

          <p class="mt-4 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
            <i class={`fa-solid ${theme.icon} text-[10px]`}></i>
            {theme.en}
          </p>
          <h1 class="mt-1.5 max-w-[26ch] text-[24px] font-bold leading-[1.22] tracking-[-0.03em] text-ink sm:text-[32px]">
            {theme.head}
          </h1>
          <p class="mt-3 max-w-[66ch] text-[13.5px] leading-[1.8] text-sub">{theme.lead}</p>

          {specs.length ? (
            <div class="mt-6">
              <SpecRow items={specs} />
            </div>
          ) : null}

          {/* サブカテゴリタブ */}
          {hasSub ? (
            <div class="mt-6 flex flex-wrap gap-2">
              <a
                href={`${base}${qsOf({ cat: '' })}`}
                class={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
                  !activeCat ? 'bg-brand text-white' : 'border border-edge2 bg-panel text-sub hover:text-ink'
                }`}
              >
                すべて
                <span class="ml-1.5 font-mono tabular-nums opacity-60">
                  {theme.categories.reduce((s, k) => s + (counts[k] || 0), 0)}
                </span>
              </a>
              {theme.categories.map((k) => {
                const c = CATEGORY_MAP[k]
                return (
                  <a
                    href={`${base}?cat=${k}`}
                    class={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${
                      activeCat === k ? 'bg-brand text-white' : 'border border-edge2 bg-panel text-sub hover:text-ink'
                    }`}
                  >
                    <i class={`fa-solid ${c.icon} text-[10px]`}></i>
                    {c.name}
                    <span class="font-mono tabular-nums opacity-60">{counts[k] || 0}</span>
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </section>

      {/* ============ Money：グラフ（データがある時のみ） ============ */}
      {showMoneyChart ? (
        <section class="border-b border-edge2 bg-panel">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
            <SectionTitle
              eyebrow="Data"
              icon="fa-chart-column"
              title="月次データ"
              desc="総資産・NISA評価額・iDeCo評価額と、毎月の生活費の推移です。"
            />
            <div class="mt-6 grid gap-4 lg:grid-cols-2">
              <div class="rounded-big border border-edge2 bg-base p-4 sm:p-5">
                <p class="text-[10.5px] font-bold uppercase tracking-[0.12em] text-mute">資産推移</p>
                <div class="mt-4 h-[230px] sm:h-[270px]">
                  <canvas id="asset-chart"></canvas>
                </div>
              </div>
              <div class="rounded-big border border-edge2 bg-base p-4 sm:p-5">
                <p class="text-[10.5px] font-bold uppercase tracking-[0.12em] text-mute">生活費推移</p>
                <div class="mt-4 h-[230px] sm:h-[270px]">
                  <canvas id="life-chart"></canvas>
                </div>
              </div>
            </div>

            {/* 月次テーブル（金額を等幅で縦に揃える） */}
            <div class="mt-4 overflow-hidden rounded-big border border-edge2 bg-base">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-[13px]">
                  <thead>
                    <tr class="border-b border-edge2 text-mute">
                      <th class="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em]">月</th>
                      <th class="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.1em]">総資産</th>
                      <th class="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.1em]">NISA</th>
                      <th class="hidden px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.1em] sm:table-cell">
                        iDeCo
                      </th>
                      <th class="hidden px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.1em] sm:table-cell">
                        生活費
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats
                      .slice(-8)
                      .reverse()
                      .map((s: any) => (
                        <tr class="border-b border-edge2 last:border-0">
                          <td class="px-4 py-3 font-mono text-[12.5px] tabular-nums font-medium">{s.ym}</td>
                          <td class="px-4 py-3 text-right font-mono text-[13.5px] font-bold tabular-nums text-brand">
                            {yen(s.total_assets)}
                          </td>
                          <td class="px-4 py-3 text-right font-mono text-[12.5px] tabular-nums text-sub">
                            {yen(s.nisa_value)}
                          </td>
                          <td class="hidden px-4 py-3 text-right font-mono text-[12.5px] tabular-nums text-sub sm:table-cell">
                            {yen(s.ideco_value)}
                          </td>
                          <td class="hidden px-4 py-3 text-right font-mono text-[12.5px] tabular-nums text-sub sm:table-cell">
                            {yen(s.living_cost)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ ツーリング：地図（記事がある時のみ） ============ */}
      {showMap && total > 0 ? (
        <section class="border-b border-edge2 bg-panel">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
            <SectionTitle
              eyebrow="Map"
              icon="fa-map-location-dot"
              title="走った場所と、寄った店"
              desc="ピンをタップすると、その記事に移動できます。"
              action={<ArrowLink href="/map">全画面で見る</ArrowLink>}
            />
            <div class="mt-6 overflow-hidden rounded-big border border-edge2">
              <div id="cat-map" class="h-[320px] w-full sm:h-[400px]" data-category={activeCat || ''}></div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ 記事一覧 ============ */}
      <section class="bg-base">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          <SectionTitle
            eyebrow="Articles"
            icon="fa-file-lines"
            title={activeCat ? `${CATEGORY_MAP[activeCat]?.name}の記事` : '記事一覧'}
            desc={total ? `${total} 件の記録があります。` : undefined}
          />

          {/* 検索 & タグ（左揃え） */}
          <div class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3">
            <form action={base} method="get" class="flex w-full max-w-[420px] items-center gap-2">
              {activeCat ? <input type="hidden" name="cat" value={activeCat} /> : null}
              {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[11.5px] text-mute"></i>
                <input
                  type="search"
                  name="q"
                  value={q || ''}
                  placeholder={`${theme.label} の記事を検索`}
                  class="w-full rounded-full border border-edge2 bg-panel py-2.5 pl-9 pr-4 text-[13px] tracking-tight text-ink outline-none transition placeholder:text-mute focus:border-brand/50"
                />
              </div>
              <button class="rounded-full bg-brand px-4 py-2.5 text-[12.5px] font-medium text-white transition hover:brightness-110">
                検索
              </button>
            </form>
          </div>

          {tags.length ? (
            <div class="mt-4 flex flex-wrap gap-1.5">
              <a
                href={`${base}${qsOf({ tag: '' })}`}
                class={`rounded-full px-3 py-1 text-[11.5px] transition ${
                  !activeTag ? 'bg-ink text-base' : 'border border-edge2 bg-panel text-sub hover:text-ink'
                }`}
              >
                すべて
              </a>
              {tags.slice(0, 14).map((t) => (
                <a
                  href={`${base}${qsOf({ tag: t.slug })}`}
                  class={`rounded-full px-3 py-1 text-[11.5px] transition ${
                    activeTag === t.slug
                      ? 'bg-brand font-medium text-white'
                      : 'border border-edge2 bg-panel text-sub hover:text-ink'
                  }`}
                >
                  {t.name}
                  <span class="ml-1.5 font-mono tabular-nums opacity-50">{t.cnt}</span>
                </a>
              ))}
            </div>
          ) : null}

          <div class="mt-6">
            {posts.length ? (
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <PostCard post={p} showCategory={hasSub && !activeCat} />
                ))}
              </div>
            ) : (
              <EmptyState
                text={
                  q || activeTag
                    ? '条件に合う記事が見つかりませんでした'
                    : 'このテーマの記事は準備中です'
                }
              />
            )}
          </div>

          {pages > 1 ? (
            <div class="mt-9 flex flex-wrap items-center gap-1.5">
              {Array.from({ length: pages }).map((_, i) => {
                const n = i + 1
                return (
                  <a
                    href={`${base}${qsOf({ page: String(n) })}`}
                    class={`grid h-8 min-w-8 place-items-center rounded-full px-2.5 font-mono text-[12.5px] tabular-nums transition ${
                      n === page
                        ? 'bg-brand font-bold text-white'
                        : 'border border-edge2 bg-panel text-sub hover:text-ink'
                    }`}
                  >
                    {n}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

function buildSpecs(theme: ThemeDef, summary: Record<string, any>, counts: Record<string, number>) {
  const n = (v: any) => (v ? Number(v) : 0)
  if (theme.key === 'money')
    return [
      { label: '総資産', value: n(summary.total_assets) ? yen(summary.total_assets) : '' },
      { label: 'NISA評価額', value: n(summary.nisa_value) ? yen(summary.nisa_value) : '' },
      { label: 'iDeCo評価額', value: n(summary.ideco_value) ? yen(summary.ideco_value) : '' },
      { label: '直近の生活費', value: n(summary.living_cost) ? yen(summary.living_cost) : '' }
    ]
  if (theme.key === 'touring')
    return [
      { label: '走行距離', value: n(summary.distance) ? `${Number(summary.distance).toLocaleString()} km` : '' },
      { label: '都道府県', value: n(summary.prefectures) ? `${summary.prefectures}` : '' },
      { label: '訪問店舗', value: counts.supermarket ? `${counts.supermarket}` : '' },
      { label: '平均会計', value: n(summary.avg_budget) ? yen(summary.avg_budget) : '' }
    ]
  return [
    { label: '記事', value: counts.it ? `${counts.it}` : '' },
    { label: '削減時間', value: n(summary.saved_hours) ? `${summary.saved_hours} h` : '' }
  ]
}
