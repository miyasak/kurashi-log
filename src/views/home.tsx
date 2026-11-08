import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { THEMES, CATEGORY_MAP, SITE, POST_COUNT_THRESHOLD } from '../lib/config'
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
}

export const HomePage: FC<Props> = ({
  latest,
  byCategory,
  counts,
  stats,
  totalDistance,
  superCount,
  prefCount
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
    { label: '記録したルート', value: totalDistance ? `${totalDistance.toLocaleString()} km` : '' },
    { label: '立ち寄り店', value: superCount ? `${superCount}` : '' },
    { label: '都道府県', value: prefCount ? `${prefCount}` : '' },
    // 記事数は10件に達するまで出さない（少ないと逆にマイナスに見える）
    { label: '公開記事', value: totalPosts >= POST_COUNT_THRESHOLD ? `${totalPosts}` : '' }
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

  /** トップの入口カード。テーマごとに「そのテーマの数字」だけを見せる */
  const themeCards = THEMES.map((t) => {
    const count = t.categories.reduce((s, k) => s + (counts[k] || 0), 0)
    const stats =
      t.key === 'money'
        ? validSpecs([{ label: '総資産', value: last?.total_assets ? yen(last.total_assets) : '' }])
        : t.key === 'touring'
          ? validSpecs([
              { label: '記録したルート', value: totalDistance ? `${totalDistance.toLocaleString()} km` : '' },
              { label: '都道府県', value: prefCount ? `${prefCount}` : '' }
            ])
          : []
    return { theme: t, count, stats }
  }).filter((c) => c.count > 0)

  return (
    <>
      {/* ==================== ヒーロー ==================== */}
      <section class="relative isolate overflow-hidden border-b border-edge2 bg-panel2">
        {/* 写真を普通に置く。sm以上は原寸比率なので切れない */}
        <img
          id="hero-img"
          src="/static/hero.jpg"
          alt=""
          width="1280"
          height="349"
          fetchpriority="high"
          decoding="async"
          class="block w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15"></div>

        {/* 文字を上に重ねる */}
        <div class="absolute inset-0">
          <div class="mx-auto flex h-full max-w-page items-center px-4 sm:px-6">
            <div>
              <p class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                <i class="fa-solid fa-chart-simple text-[10px]"></i>
                {SITE.title}
              </p>
              <h1 class="mt-4 text-[26px] font-bold leading-[1.28] tracking-[-0.03em] text-white sm:text-[38px]">
                お金と道と暮らしを、数字で残しています
              </h1>
              <p class="mt-4 max-w-[62ch] text-[14.5px] leading-[1.85] text-white/80">
                <span class="font-medium text-white">Money</span>（資産運用・生活費）、
                <span class="font-medium text-white">Touring</span>（ツーリング・キャンプ場・ご当地スーパー）、
                <span class="font-medium text-white">Spa</span>（日帰り温泉）、
                <span class="font-medium text-white">Tech</span>（業務効率化）。
                感覚ではなく<span class="font-medium text-white">実額と実測値</span>で、あとから辿れるように残しています。
              </p>
              <p class="mt-5">
                <a
                  href="/about"
                  class="group inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13.5px] font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
                >
                  <i class="fa-solid fa-circle-info text-[11px]"></i>
                  はじめての方はこちら
                  <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== テーマの入口 ==================== */}
      {themeCards.length ? (
        <section class="border-b border-edge2 bg-base">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-12">
            <div class={`grid grid-cols-1 gap-4 ${themeCards.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {themeCards.map((c) => (
                <a
                  href={`/theme/${c.theme.key}`}
                  class="group flex flex-col rounded-big border border-edge2 bg-panel p-5 transition duration-300 hover:border-brand/40 sm:p-6"
                >
                  <span class="grid h-10 w-10 place-items-center rounded-lg bg-brandsoft text-brand">
                    <i class={`fa-solid ${c.theme.icon} text-[15px]`}></i>
                  </span>
                  <h2 class="mt-4 text-[17px] font-bold tracking-[-0.02em] text-ink">
                    {c.theme.label}
                    <span class="ml-2 text-[13.5px] font-medium text-mute">{c.theme.name}</span>
                  </h2>
                  <p class="mt-2 text-[13.5px] leading-[1.7] text-sub">{c.theme.description}</p>
                  {c.stats.length ? (
                    <dl class="mt-5 flex flex-wrap gap-x-7 gap-y-3">
                      {c.stats.map((s) => (
                        <div>
                          <dt class="text-[10px] font-bold uppercase tracking-[0.12em] text-mute">{s.label}</dt>
                          <dd class="mt-1 font-mono text-[19px] font-bold leading-none tabular-nums tracking-tight text-ink">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <p class="mt-auto pt-5 flex items-center gap-1.5 text-[13.5px] font-medium text-brand">
                    <span class="font-mono tabular-nums">{c.count}</span> 件の記録を見る
                    <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
        <section class="border-b border-edge2 bg-base">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-12">
            <SectionTitle
              eyebrow="Money"
              icon="fa-coins"
              title="資産の推移"
              desc="総資産・NISA評価額・iDeCo評価額の月次推移です。"
              action={<ArrowLink href="/theme/money">お金の記録へ</ArrowLink>}
            />

            <div class="mt-6 rounded-big border border-edge2 bg-panel p-4 sm:p-6">
              {/* 大きな数字を主役に */}
              <div class="flex flex-wrap items-end gap-x-9 gap-y-5">
                <div>
                  <p class="font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-mute">
                    {last?.ym ? Number(last.ym.split('-')[0]) + '年' + Number(last.ym.split('-')[1]) + '月' : ''} 時点の総資産
                  </p>
                  <p class="mt-1.5 font-mono text-[34px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink sm:text-[46px]">
                    {yen(last?.total_assets)}
                  </p>
                  {diff ? (
                    <p
                      class="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[13px] font-bold tabular-nums"
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
          <section class={`border-b border-edge2 bg-base`}>
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
                      { label: '記録したルート', value: totalDistance ? `${totalDistance.toLocaleString()} km` : '' },
                      { label: '都道府県', value: prefCount ? `${prefCount}` : '' },
                      { label: 'ルート記事', value: counts.touring ? `${counts.touring}` : '' },
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
            <p class="mt-3 max-w-[66ch] text-[14px] leading-[1.85] text-sub">
              Money（資産運用・生活費）、Touring（ツーリング・キャンプ場・ご当地スーパー）、Spa（日帰り温泉）、Tech（業務効率化）。
              数字と写真で「あとから辿れる」ことを大切にして記録しています。
              運営者のプロフィールと投資方針は About にまとめています。
            </p>
            <div class="mt-5 flex flex-wrap items-center gap-2.5">
              {/* 重複を避けるため /about へ集約する */}
              <PillButton href="/about" icon="fa-circle-info">
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
