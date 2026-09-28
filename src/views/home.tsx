import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { THEMES, CATEGORY_MAP } from '../lib/config'
import { PostCard, SectionTitle, SpecRow, validSpecs } from './components'
import { ArrowLink, PillButton } from './layout'
import { yen } from '../lib/utils'

type Props = {
  latest: Post[]
  byCategory: Record<string, Post[]>
  counts: Record<string, number>
  stats: any[]
  totalDistance: number
  superCount: number
  prefCount: number
  /** About として使う自己紹介記事のURL（無ければ /about） */
  aboutHref: string
}

export const HomePage: FC<Props> = ({
  latest,
  byCategory,
  counts,
  stats,
  totalDistance,
  superCount,
  prefCount,
  aboutHref
}) => {
  const last = stats.length ? stats[stats.length - 1] : null
  const prev = stats.length > 1 ? stats[stats.length - 2] : null
  const diff = last && prev && last.total_assets && prev.total_assets ? last.total_assets - prev.total_assets : null
  const totalPosts = Object.values(counts).reduce((a, b) => a + b, 0)

  /** ヒーロー下の数字（値が無いものは自動的に消える） */
  const heroSpecs = validSpecs([
    {
      label: '総資産',
      value: last?.total_assets ? `¥${Number(last.total_assets).toLocaleString('ja-JP')}` : '',
      sub: diff ? `前月比 ${diff > 0 ? '+' : '−'}¥${Math.abs(diff).toLocaleString('ja-JP')}` : undefined
    },
    { label: '走行距離', value: totalDistance ? `${totalDistance.toLocaleString()} km` : '' },
    { label: '立ち寄り店', value: superCount ? `${superCount}` : '' },
    { label: '都道府県', value: prefCount ? `${prefCount}` : '' },
    { label: '公開記事', value: totalPosts ? `${totalPosts}` : '' }
  ])

  /** 新着に出した記事はカテゴリ別セクションでは繰り返さない */
  const shownIds = new Set(latest.slice(0, 6).map((p) => p.id))

  /** テーマごとの記事（空のテーマはセクションごと非表示） */
  const themeBlocks = THEMES.map((t) => {
    const posts = t.categories
      .flatMap((k) => byCategory[k] || [])
      .filter((p) => !shownIds.has(p.id))
      .sort((a, b) =>
        String(b.published_at || '').localeCompare(String(a.published_at || ''))
      )
      .slice(0, 3)
    const count = t.categories.reduce((s, k) => s + (counts[k] || 0), 0)
    return { theme: t, posts, count }
  }).filter((b) => b.posts.length > 0)

  const moneyBlock = themeBlocks.find((b) => b.theme.key === 'money')

  return (
    <>
      {/* ==================== ヒーロー ==================== */}
      <section class="border-b border-edge2 bg-base">
        <div class="mx-auto max-w-page px-4 py-10 sm:px-6 sm:py-14">
          <p class="inline-flex items-center gap-2 rounded-full bg-brandsoft px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
            <i class="fa-solid fa-chart-simple text-[10px]"></i>
            Personal Record
          </p>
          <h1 class="mt-4 text-[26px] font-bold leading-[1.28] tracking-[-0.03em] text-ink sm:text-[36px]">
            <span class="block">数字で記録する、</span>
            <span class="block">お金とツーリングと仕事。</span>
          </h1>
          <p class="mt-4 max-w-[64ch] text-[13.5px] leading-[1.85] text-sub sm:text-[14.5px]">
            資産運用・生活費・ツーリング・ご当地スーパー・業務効率化と自動化。
            感覚ではなく<span class="font-medium text-ink">実額と実測値</span>で、あとから辿れるように残しています。
          </p>

          {/* はじめての方はこちら（1つだけの小さな導線） */}
          <p class="mt-4">
            <a
              href={aboutHref}
              class="group inline-flex items-center gap-2 text-[12.5px] font-medium text-brand transition hover:opacity-80"
            >
              <i class="fa-solid fa-circle-info text-[11px]"></i>
              はじめての方はこちら
              <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
            </a>
          </p>

          {/* 数字（0件の項目は非表示。全て0ならブロック自体が出ない） */}
          {heroSpecs.length ? (
            <div class="mt-7">
              <SpecRow items={heroSpecs} />
            </div>
          ) : null}
        </div>
      </section>

      {/* ==================== 新着記事 ==================== */}
      {latest.length ? (
        <section class="border-b border-edge2 bg-base">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-12">
            <SectionTitle
              eyebrow="Latest"
              icon="fa-clock-rotate-left"
              title="新着記事"
              action={<ArrowLink href="/search">すべての記事</ArrowLink>}
            />
            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.slice(0, 6).map((p) => (
                <PostCard post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ==================== 資産の推移（データがある時のみ） ==================== */}
      {stats.length ? (
        <section class="border-b border-edge2 bg-panel">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-12">
            <SectionTitle
              eyebrow="Money"
              icon="fa-coins"
              title="資産の推移"
              desc="総資産・NISA評価額・iDeCo評価額の月次推移です。"
              action={<ArrowLink href="/theme/money">お金の記録へ</ArrowLink>}
            />

            <div class="mt-6 rounded-big border border-edge2 bg-base p-4 sm:p-6">
              {/* 大きな数字を主役に */}
              <div class="flex flex-wrap items-end gap-x-9 gap-y-5">
                <div>
                  <p class="font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-mute">
                    {last?.ym} 時点の総資産
                  </p>
                  <p class="mt-1.5 font-mono text-[34px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink sm:text-[46px]">
                    {yen(last?.total_assets)}
                  </p>
                  {diff ? (
                    <p
                      class="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[12px] font-bold tabular-nums"
                      style={`background:${
                        diff > 0 ? 'rgba(249,115,22,.14)' : 'rgba(161,161,170,.14)'
                      };color:${diff > 0 ? '#f97316' : '#a1a1aa'}`}
                    >
                      <i class={`fa-solid ${diff > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[10px]`}></i>
                      前月比 {diff > 0 ? '+' : '−'}
                      {yen(Math.abs(diff))}
                    </p>
                  ) : null}
                </div>
                <dl class="flex flex-wrap gap-x-7 gap-y-4">
                  {[
                    { l: 'NISA', v: last?.nisa_value },
                    { l: 'iDeCo', v: last?.ideco_value },
                    { l: '生活費', v: last?.living_cost }
                  ]
                    .filter((x) => x.v)
                    .map((x) => (
                      <div>
                        <dt class="text-[10px] font-bold uppercase tracking-[0.12em] text-mute">{x.l}</dt>
                        <dd class="mt-1 font-mono text-[17px] font-bold tabular-nums tracking-tight text-ink sm:text-[19px]">
                          {yen(x.v)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>

              <div class="mt-6 h-[210px] sm:h-[260px]">
                <canvas id="home-asset-chart"></canvas>
              </div>
            </div>

            {/* Money の記事（新着で既に出したものは除く） */}
            {moneyBlock && moneyBlock.posts.length ? (
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {moneyBlock.posts.map((p) => (
                  <PostCard post={p} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ==================== カテゴリ別（記事0件のテーマは非表示） ==================== */}
      {themeBlocks
        .filter((b) => !(b.theme.key === 'money' && stats.length))
        .map((b, i) => (
          <section class={`border-b border-edge2 ${i % 2 === 0 ? 'bg-base' : 'bg-panel'}`}>
            <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-12">
              <SectionTitle
                eyebrow={b.theme.label}
                icon={b.theme.icon}
                title={b.theme.head}
                desc={b.theme.lead}
                action={<ArrowLink href={`/theme/${b.theme.key}`}>{b.count} 件を見る</ArrowLink>}
              />

              {/* テーマ固有の数字（値が無ければ非表示） */}
              {b.theme.key === 'touring' ? (
                <div class="mt-6">
                  <SpecRow
                    items={[
                      { label: '総走行距離', value: totalDistance ? `${totalDistance.toLocaleString()} km` : '' },
                      { label: '都道府県', value: prefCount ? `${prefCount}` : '' },
                      { label: 'ログ数', value: counts.touring ? `${counts.touring}` : '' },
                      { label: '立ち寄り店', value: superCount ? `${superCount}` : '' }
                    ]}
                  />
                </div>
              ) : null}

              <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {b.posts.map((p) => (
                  <PostCard post={p} showCategory={b.theme.categories.length > 1} />
                ))}
              </div>

              {/* ツーリングは地図への導線を1つだけ */}
              {b.theme.key === 'touring' ? (
                <p class="mt-5">
                  <ArrowLink href="/map" size="sm">
                    エリア別マップで見る
                  </ArrowLink>
                </p>
              ) : null}
            </div>
          </section>
        ))}

      {/* ==================== About ==================== */}
      <section class="bg-base">
        <div class="mx-auto max-w-page px-4 py-10 sm:px-6 sm:py-12">
          <div class="rounded-big border border-edge2 bg-panel p-5 sm:p-7">
            <p class="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
              <i class="fa-solid fa-circle-info text-[10px]"></i>About
            </p>
            <h2 class="mt-2 text-[19px] font-bold leading-tight tracking-[-0.02em] sm:text-[23px]">
              このサイトについて
            </h2>
            <p class="mt-3 max-w-[66ch] text-[13px] leading-[1.85] text-sub">
              資産運用と生活費、ツーリングとご当地スーパー、業務効率化と自動化。
              数字と写真で「あとから見返せる」ことを大切にして記録しています。
              運営者の経歴や、このサイトを始めた理由はこちらにまとめています。
            </p>
            <div class="mt-5 flex flex-wrap items-center gap-2.5">
              <PillButton href={aboutHref} icon="fa-circle-info">
                運営者について読む
              </PillButton>
              <PillButton href="/search" variant="ghost" icon="fa-magnifying-glass">
                記事を探す
              </PillButton>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
