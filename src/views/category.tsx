import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import type { CategoryDef } from '../lib/config'
import { PostCard, EmptyState, SpecRow, SectionTitle } from './components'
import { ArrowLink } from './layout'
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

const COPY: Record<string, { head: string; lead: string }> = {
  asset: {
    head: '積み上げは、静かに効く。',
    lead: 'NISAとiDeCoを軸にした資産形成の記録。毎月の評価額と積立額を、そのまま公開しています。'
  },
  life: {
    head: '暮らしの値段を、知る。',
    lead: '家賃から趣味まで。実際に使った金額と、買ってよかったもののコスパを記録しています。'
  },
  touring: {
    head: 'その道は、走った人にしか分からない。',
    lead: 'ルート・距離・天気・景色。次に走る人の役に立つように、細かく残しています。'
  },
  supermarket: {
    head: '観光地よりも、スーパーへ。',
    lead: '旅先のご当地スーパーを、品揃えと価格とコスパで評価。買ったものは全部書いています。'
  },
  it: {
    head: '現場で使えたものだけ、書く。',
    lead: '社内SEとしての業務改善と、生成AIの実践。うまくいかなかったことも含めて記録します。'
  }
}

export const CategoryPage: FC<Props> = ({ cat, posts, tags, activeTag, q, total, page, perPage, stats, summary }) => {
  const pages = Math.max(1, Math.ceil(total / perPage))
  const copy = COPY[cat.key]
  const specs = buildSpecs(cat, summary, total)
  const grid =
    cat.key === 'asset' || cat.key === 'life'
      ? 'grid gap-4 sm:grid-cols-2'
      : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <>
      {/* ============ ヒーロー ============ */}
      <section class="bg-white pb-14 pt-14 sm:pb-20 sm:pt-20">
        <div class="mx-auto max-w-page px-5 text-center sm:px-6">
          <p class="hero-line text-[13px] font-semibold uppercase tracking-[0.16em]" style={`color:${cat.accent}`}>
            {cat.short}
          </p>
          <h1 class="hero-line mx-auto mt-4 max-w-[820px] text-[36px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[60px]">
            {copy?.head || cat.name}
          </h1>
          <p class="hero-line mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.55] tracking-[-0.01em] text-sub sm:text-[19px]">
            {copy?.lead || cat.description}
          </p>
          <div class="hero-line mx-auto mt-12 max-w-[860px] sm:mt-16">
            <SpecRow items={specs} />
          </div>
        </div>
      </section>

      {/* ============ 資産・生活：グラフ ============ */}
      {(cat.key === 'asset' || cat.key === 'life') && stats.length ? (
        <section class="bg-hazy py-14 sm:py-20">
          <div class="mx-auto max-w-page px-5 sm:px-6">
            <div class="reveal">
              <SectionTitle
                eyebrow="Data"
                title={cat.key === 'asset' ? '資産の推移。' : '生活費の推移。'}
                desc={
                  cat.key === 'asset'
                    ? '総資産・NISA評価額・iDeCo評価額の月次推移です。'
                    : '毎月の生活費と手取り収入、直近月の費目内訳です。'
                }
              />
            </div>
            <div class="reveal mt-10 rounded-big bg-white p-6 sm:mt-14 sm:p-10">
              <div class="h-[260px] sm:h-[340px]">
                <canvas id={cat.key === 'asset' ? 'asset-chart' : 'life-chart'}></canvas>
              </div>
            </div>

            {cat.key === 'life' ? (
              <div class="reveal mt-4 rounded-big bg-white p-6 sm:p-10">
                <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-mute">Breakdown</p>
                <h3 class="mt-2 text-[22px] font-semibold tracking-[-0.02em]">直近月の費目内訳</h3>
                <div class="mt-8 h-[260px] sm:h-[300px]">
                  <canvas id="expense-chart"></canvas>
                </div>
              </div>
            ) : (
              <div class="reveal mt-4 overflow-hidden rounded-big bg-white">
                <table class="w-full text-left text-[13px]">
                  <thead>
                    <tr class="border-b border-black/[0.08] text-mute">
                      <th class="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">月</th>
                      <th class="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">総資産</th>
                      <th class="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">NISA</th>
                      <th class="hidden px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] sm:table-cell">
                        iDeCo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats
                      .slice(-6)
                      .reverse()
                      .map((s: any) => (
                        <tr class="border-b border-black/[0.05] last:border-0">
                          <td class="px-6 py-4 font-medium">{s.ym}</td>
                          <td class="px-6 py-4 text-right font-medium">{yen(s.total_assets)}</td>
                          <td class="px-6 py-4 text-right text-sub">{yen(s.nisa_value)}</td>
                          <td class="hidden px-6 py-4 text-right text-sub sm:table-cell">{yen(s.ideco_value)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ============ ツーリング・スーパー：地図 ============ */}
      {cat.key === 'touring' || cat.key === 'supermarket' ? (
        <section class="bg-hazy py-14 sm:py-20">
          <div class="mx-auto max-w-page px-5 sm:px-6">
            <div class="reveal">
              <SectionTitle
                eyebrow="Map"
                title={cat.key === 'touring' ? '走った場所。' : '訪ねた店。'}
                desc="ピンをタップすると、その記事に移動できます。"
              />
            </div>
            <div class="reveal mt-10 overflow-hidden rounded-big bg-white sm:mt-14">
              <div id="cat-map" class="h-[360px] w-full sm:h-[440px]" data-category={cat.key}></div>
            </div>
            <div class="reveal mt-6 text-center">
              <ArrowLink href="/map" size="sm">
                すべてのスポットを地図で見る
              </ArrowLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ 記事一覧 ============ */}
      <section class="bg-white py-14 sm:py-20">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <div class="reveal">
            <SectionTitle eyebrow="Articles" title="記事一覧。" desc={`${total} 件の記録があります。`} />
          </div>

          {/* 検索 & タグ */}
          <div class="reveal mt-10 sm:mt-12">
            <form action={`/category/${cat.key}`} method="get" class="mx-auto flex max-w-[460px] items-center gap-2">
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-mute"></i>
                <input
                  type="search"
                  name="q"
                  value={q || ''}
                  placeholder={`${cat.name}の記事を検索`}
                  class="w-full rounded-full bg-hazy py-3 pl-10 pr-4 text-[14px] tracking-tight outline-none transition placeholder:text-mute focus:bg-[#eeeef0]"
                />
              </div>
              {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
              <button class="rounded-full bg-ink px-5 py-3 text-[13px] text-white transition hover:opacity-85">検索</button>
            </form>

            {tags.length ? (
              <div class="mt-6 flex flex-wrap justify-center gap-2">
                <a
                  href={`/category/${cat.key}`}
                  class={`rounded-full px-3.5 py-1.5 text-[12px] transition ${
                    !activeTag ? 'bg-ink text-white' : 'bg-hazy text-sub hover:bg-[#eeeef0]'
                  }`}
                >
                  すべて
                </a>
                {tags.map((t) => (
                  <a
                    href={`/category/${cat.key}?tag=${encodeURIComponent(t.slug)}`}
                    class={`rounded-full px-3.5 py-1.5 text-[12px] transition ${
                      activeTag === t.slug ? 'text-white' : 'bg-hazy text-sub hover:bg-[#eeeef0]'
                    }`}
                    style={activeTag === t.slug ? `background:${cat.accent}` : ''}
                  >
                    {t.name}
                    <span class="ml-1.5 opacity-50">{t.cnt}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div class={`mt-10 sm:mt-14 ${grid}`}>
            {posts.length ? (
              posts.map((p, i) => (
                <div class="reveal" style={`transition-delay:${(i % 3) * 70}ms`}>
                  <PostCard post={p} showCategory={false} />
                </div>
              ))
            ) : (
              <div class="sm:col-span-2 lg:col-span-3">
                <EmptyState text={q || activeTag ? '条件に合う記事が見つかりませんでした' : `${cat.name}の記事はまだありません`} />
              </div>
            )}
          </div>

          {pages > 1 ? (
            <div class="mt-14 flex items-center justify-center gap-2">
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
                    class={`grid h-8 min-w-8 place-items-center rounded-full px-3 text-[13px] transition ${
                      n === page ? 'bg-ink text-white' : 'bg-hazy text-sub hover:bg-[#eeeef0]'
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

      {/* ============ 他テーマへの導線 ============ */}
      <section class="bg-hazy py-14 sm:py-20">
        <div class="mx-auto max-w-page px-5 text-center sm:px-6">
          <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-mute">Other Topics</p>
          <h2 class="mt-3 text-[26px] font-semibold tracking-[-0.02em] sm:text-[34px]">ほかのテーマも見る。</h2>
          <div class="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <ArrowLink href="/" size="sm">
              ホーム
            </ArrowLink>
            <ArrowLink href="/map" size="sm">
              マップ
            </ArrowLink>
            <ArrowLink href="/search" size="sm">
              記事を探す
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  )
}

function buildSpecs(cat: CategoryDef, summary: Record<string, any>, total: number) {
  if (cat.key === 'asset')
    return [
      { label: '総資産', value: yen(summary.total_assets) },
      { label: 'NISA評価額', value: yen(summary.nisa_value) },
      { label: 'iDeCo評価額', value: yen(summary.ideco_value) },
      { label: '記事', value: `${total} 本` }
    ]
  if (cat.key === 'life')
    return [
      { label: '直近の生活費', value: yen(summary.living_cost) },
      { label: '平均生活費', value: yen(summary.avg_cost) },
      { label: '記録月数', value: `${summary.months || 0} ヶ月` },
      { label: '記事', value: `${total} 本` }
    ]
  if (cat.key === 'touring')
    return [
      { label: '総走行距離', value: `${(summary.distance || 0).toLocaleString()} km` },
      { label: '訪問した県', value: `${summary.prefectures || 0}` },
      { label: '平均距離', value: `${Math.round(summary.avg_distance || 0)} km` },
      { label: 'ログ', value: `${total} 本` }
    ]
  if (cat.key === 'supermarket')
    return [
      { label: '訪問店舗', value: `${total} 店` },
      { label: '平均評価', value: summary.avg_rating ? summary.avg_rating.toFixed(1) : '—' },
      { label: '平均コスパ', value: summary.avg_cospa ? summary.avg_cospa.toFixed(1) : '—' },
      { label: '平均会計', value: yen(summary.avg_budget) }
    ]
  return [
    { label: '記事', value: `${total} 本` },
    { label: 'テーマ', value: '社内SE' },
    { label: 'テーマ', value: '生成AI' },
    { label: '更新', value: '不定期' }
  ]
}
