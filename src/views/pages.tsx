import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { THEMES, SITE, MAP_CATEGORIES, CATEGORY_MAP } from '../lib/config'
import { PostCard, EmptyState, SectionTitle, RankBadge } from './components'
import { ArrowLink, PillButton } from './layout'
import { yen } from '../lib/utils'

/* =========================================================
   検索
   ========================================================= */
export const SearchPage: FC<{
  posts: Post[]
  q?: string
  theme?: string
  tag?: string
  total: number
}> = ({ posts, q, theme, tag, total }) => (
  <>
    <section class="border-b border-edge2 bg-base">
      <div class="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-10">
        <nav class="flex items-center gap-1.5 text-[11.5px] text-mute">
          <a href="/" class="transition hover:text-ink">ホーム</a>
          <i class="fa-solid fa-chevron-right text-[8px]"></i>
          <span class="text-sub">記事を探す</span>
        </nav>

        <p class="mt-4 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
          <i class="fa-solid fa-magnifying-glass text-[10px]"></i>Search
        </p>
        <h1 class="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">
          記事を探す
        </h1>

        <form action="/search" method="get" class="mt-6 max-w-[560px]">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-mute"></i>
            <input
              type="search"
              name="q"
              value={q || ''}
              placeholder="キーワード（例: NISA、ビーナスライン、Python）"
              class="w-full rounded-full border border-edge2 bg-panel py-3 pl-10 pr-4 text-[14.5px] text-ink outline-none transition placeholder:text-mute focus:border-brand/50"
            />
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <label class="sr-only" for="search-theme">テーマ</label>
            <select
              id="search-theme"
              name="theme"
              class="rounded-full border border-edge2 bg-panel px-4 py-2 text-[13.5px] text-ink outline-none transition focus:border-edge"
            >
              <option value="">すべてのテーマ</option>
              {THEMES.map((t) => (
                <option value={t.key} selected={theme === t.key}>
                  {t.label} — {t.name}
                </option>
              ))}
            </select>
            <button class="rounded-full bg-brand px-5 py-2 text-[13.5px] font-medium text-white transition hover:brightness-110">
              検索する
            </button>
          </div>
        </form>

        {tag ? <p class="mt-4 text-[13px] text-mute">タグ: {tag}</p> : null}
      </div>
    </section>

    <section class="bg-base">
      <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
        <p class="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] tabular-nums text-mute">
          {total} 件
        </p>
        {posts.length ? (
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard post={p} />
            ))}
          </div>
        ) : (
          <EmptyState text="該当する記事が見つかりませんでした" />
        )}
      </div>
    </section>
  </>
)

/* =========================================================
   マップ
   ========================================================= */
export const MapPage: FC<{ counts: Record<string, number> }> = ({ counts }) => {
  const cats = MAP_CATEGORIES.map((k) => CATEGORY_MAP[k]).filter((c) => c && counts[c.key])
  const hasPins = cats.length > 0
  return (
    <>
      <section class="border-b border-edge2 bg-base">
        <div class="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-10">
          <nav class="flex items-center gap-1.5 text-[11.5px] text-mute">
            <a href="/" class="transition hover:text-ink">ホーム</a>
            <i class="fa-solid fa-chevron-right text-[8px]"></i>
            <span class="text-sub">エリア別</span>
          </nav>

          <p class="mt-4 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
            <i class="fa-solid fa-map-location-dot text-[10px]"></i>Map
          </p>
          <h1 class="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">
            地図から探す
          </h1>
          <p class="mt-3 max-w-[64ch] text-[14.5px] leading-[1.8] text-sub">
            走った道、泊まったキャンプ場、立ち寄ったスーパーや温泉を一枚の地図に。ピンをタップすると記事に移動します。
          </p>

          {hasPins ? (
            <div class="mt-5 flex flex-wrap items-center gap-2">
              <button
                class="map-filter rounded-full bg-brand px-4 py-2 text-[13.5px] font-medium text-white transition"
                data-filter="all"
              >
                すべて
              </button>
              {cats.map((cat) => (
                <button
                  class="map-filter rounded-full border border-edge2 bg-panel px-4 py-2 text-[13.5px] text-sub transition hover:text-ink"
                  data-filter={cat.key}
                >
                  <i class={`fa-solid ${cat.icon} mr-1.5 text-[10.5px] text-brand`}></i>
                  {cat.name}
                  <span class="ml-1.5 font-mono tabular-nums opacity-60">{counts[cat.key]}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {hasPins ? (
        <>
          <div class="bg-base">
            <div class="mx-auto max-w-page px-0 py-5 sm:px-6">
              <div
                id="full-map"
                class="h-[58vh] min-h-[380px] w-full overflow-hidden border-y border-edge2 sm:rounded-big sm:border"
              ></div>
            </div>
          </div>

          <section class="border-t border-edge2 bg-panel">
            <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
              <SectionTitle eyebrow="Spots" icon="fa-location-dot" title="訪れたスポット" />
              <div id="map-list" class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
            </div>
          </section>
        </>
      ) : (
        <section class="bg-base">
          <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
            <div class="rounded-big border border-edge2 bg-panel px-5 py-10 text-center">
              <i class="fa-solid fa-map-location-dot text-[22px] text-brand/50"></i>
              <p class="mt-3.5 text-[14px] font-bold tracking-tight text-sub">
                記事が増え次第、順次追加します
              </p>
              <p class="mx-auto mt-2 max-w-[46ch] text-[13.5px] leading-[1.8] text-mute">
                ツーリングやご当地スーパーの記事に位置情報を登録すると、ここに地図とピンが表示されます。
              </p>
              <div class="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <PillButton href="/theme/touring" variant="ghost" icon="fa-motorcycle">
                  ツーリングのページへ
                </PillButton>
                <PillButton href="/" variant="ghost" icon="fa-house">
                  ホームへ戻る
                </PillButton>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

/* =========================================================
   About（固定ページ）
   プロフィールの要約を置き、詳しい経緯は自己紹介記事へ送る。
   資産の数字は月次データの最新値から差し込むので直書きしない。
   ========================================================= */
export const AboutPage: FC<{
  counts: Record<string, number>
  stats: any[]
  /** 自己紹介記事（詳しい経緯）へのリンク。無ければ null */
  storyHref: string | null
}> = ({ counts, stats, storyHref }) => {
  const last = stats.length ? stats[stats.length - 1] : null
  const n = (v: any) => (v === null || v === undefined || v === '' ? null : Number(v))
  const total = last ? n(last.total_assets) : null
  const ymLabel = (() => {
    if (!last?.ym) return ''
    const [y, m] = String(last.ym).split('-')
    return `${y}年${Number(m)}月`
  })()

  /** 資産構成（値があるものだけ表示） */
  const breakdown = [
    { label: '現金・預金', value: last ? n(last.cash) : null },
    { label: 'NISA', value: last ? n(last.nisa_value) : null },
    { label: 'iDeCo', value: last ? n(last.ideco_value) : null }
  ].filter((x) => x.value)

  /** プロフィール項目 */
  const profile: [string, string][] = [
    ['年齢', '41歳'],
    ['職業', '会社員（専門学校卒・年収600万円ほど）'],
    ['住まい', '都内で一人暮らし（1K・30㎡／家賃55,000円）'],
    ['世帯', '独身']
  ]

  return (
    <>
      <section class="border-b border-edge2 bg-base">
        <div class="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-10">
          <nav class="flex items-center gap-1.5 text-[11.5px] text-mute">
            <a href="/" class="transition hover:text-ink">ホーム</a>
            <i class="fa-solid fa-chevron-right text-[8px]"></i>
            <span class="text-sub">About</span>
          </nav>

          <p class="mt-4 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
            <i class="fa-solid fa-circle-info text-[10px]"></i>About
          </p>
          <h1 class="mt-1.5 text-[24px] font-bold leading-[1.22] tracking-[-0.03em] text-ink sm:text-[32px]">
            60歳で資産1億円を目指す、会社員の記録です。
          </h1>
          <p class="mt-3 max-w-[66ch] text-[14.5px] leading-[1.85] text-sub">
            {SITE.title} は、資産運用と生活費、ツーリングとキャンプ場、ご当地スーパーと日帰り温泉、
            IT全般の記録をまとめた個人サイトです。特別な経歴はなく、使っているのは誰でも同じ条件で
            使える制度と時間だけ。感覚ではなく実額で記録し、あとから辿れることを大切にしています。
          </p>
        </div>
      </section>

      {/* プロフィール */}
      <section class="border-b border-edge2 bg-base">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          <SectionTitle eyebrow="Profile" icon="fa-user" title="運営者について" />
          <div class="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <dl class="divide-y divide-edge2 rounded-big border border-edge2 bg-panel px-5">
              {profile.map(([k, v]) => (
                <div class="grid grid-cols-[88px_minmax(0,1fr)] gap-3 py-3.5">
                  <dt class="text-[11.5px] text-mute">{k}</dt>
                  <dd class="text-[14px] leading-[1.7] text-ink">{v}</dd>
                </div>
              ))}
              <div class="grid grid-cols-[88px_minmax(0,1fr)] gap-3 py-3.5">
                <dt class="text-[11.5px] text-mute">目標</dt>
                <dd class="text-[14px] leading-[1.7] text-ink">
                  60歳で資産1億円
                  {total ? (
                    <span class="ml-2 font-mono text-[13.5px] tabular-nums text-brand">
                      （現在 {yen(total)}）
                    </span>
                  ) : null}
                </dd>
              </div>
            </dl>

            {/* 資産構成：月次データの最新値から自動表示 */}
            {breakdown.length ? (
              <div class="rounded-big border border-edge2 bg-panel p-5">
                <p class="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
                  Assets
                </p>
                <h3 class="mt-1 text-[15px] font-bold tracking-tight">
                  資産構成
                  {ymLabel ? <span class="ml-1.5 text-[11.5px] font-medium text-mute">{ymLabel}時点</span> : null}
                </h3>
                <p class="mt-3 font-mono text-[26px] font-bold leading-none tabular-nums tracking-tight text-ink">
                  {yen(total)}
                </p>
                <dl class="mt-4 divide-y divide-edge2 border-t border-edge2">
                  {breakdown.map((b) => (
                    <div class="flex items-baseline justify-between py-2.5">
                      <dt class="text-[11.5px] text-mute">{b.label}</dt>
                      <dd class="font-mono text-[14px] font-bold tabular-nums text-ink">{yen(b.value)}</dd>
                    </div>
                  ))}
                </dl>
                <p class="mt-3 text-[11px] leading-relaxed text-mute">
                  数字は管理画面に登録した月次データと連動しています。
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 投資方針 */}
      <section class="border-b border-edge2 bg-panel">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          <SectionTitle
            eyebrow="Policy"
            icon="fa-compass"
            title="投資方針"
            desc="判断する余地を最初から消して、続けられる金額だけを入れる。それだけです。"
          />
          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: 'fa-globe',
                t: '全世界株式1本に絞る',
                d: '全世界株式のインデックスファンド（オルカン）を買い続けるだけ。米国株を足したり金を混ぜたりはしません。'
              },
              {
                icon: 'fa-scale-balanced',
                t: '判断の余地を作らない',
                d: '複数のファンドを持つと「どちらを増やすか」を考える日が来るので、最初から1本にしています。'
              },
              {
                icon: 'fa-calculator',
                t: '年3%でも届く設計',
                d: '年7%のような都合のいい数字は使いません。普通にいけば達成できる目標にしてあります。'
              },
              {
                icon: 'fa-hand-holding-dollar',
                t: 'やめないことが最優先',
                d: '3〜4割下がる局面でも売らずにいられる金額しか入れません。続けられない額を入れるのが最大のリスクです。'
              },
              {
                icon: 'fa-motorcycle',
                t: '趣味は削らない',
                d: 'ツーリング代を削って投資額を増やすことはしません。我慢を前提にした計画は続かないからです。'
              },
              {
                icon: 'fa-chart-line',
                t: '実額をそのまま公開',
                d: '毎月の評価額・積立額・生活費を、加工せず数字のまま記録します。'
              }
            ].map((x) => (
              <div class="rounded-big border border-edge2 bg-base p-5">
                <span class="grid h-9 w-9 place-items-center rounded-lg bg-brandsoft text-brand">
                  <i class={`fa-solid ${x.icon} text-[14px]`}></i>
                </span>
                <h3 class="mt-3.5 text-[14.5px] font-bold tracking-tight">{x.t}</h3>
                <p class="mt-2 text-[13.5px] leading-[1.75] text-sub">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3つのテーマ */}
      <section class="border-b border-edge2 bg-base">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          <SectionTitle eyebrow="Topics" icon="fa-layer-group" title="書いていること" />
          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t) => {
              const num = t.categories.reduce((s, k) => s + (counts[k] || 0), 0)
              return (
                <a
                  href={`/theme/${t.key}`}
                  class="group flex flex-col rounded-big border border-edge2 bg-panel p-5 transition duration-300 hover:border-brand/40"
                >
                  <span class="grid h-9 w-9 place-items-center rounded-lg bg-brandsoft text-brand">
                    <i class={`fa-solid ${t.icon} text-[14px]`}></i>
                  </span>
                  <h3 class="mt-3.5 text-[16px] font-bold tracking-[-0.02em]">
                    {t.label}
                    <span class="ml-2 text-[13.5px] font-medium text-mute">{t.name}</span>
                  </h3>
                  <p class="mt-2 text-[13.5px] leading-[1.7] text-sub">{t.description}</p>
                  <p class="mt-4 flex items-center gap-1.5 text-[13.5px] font-medium text-brand">
                    <span class="font-mono tabular-nums">{num}</span> 件を見る
                    <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                  </p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* 評価ランク */}
      <section id="rank" class="border-b border-edge2 bg-base scroll-mt-20">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          <SectionTitle eyebrow="Rank" icon="fa-award" title="評価ランクについて" />
          <p class="mt-4 max-w-[66ch] text-[14px] leading-[1.85] text-sub">
            記事に付いている S / A / B / C / D は、走っている途中に寄る価値があるか、という一点で判定しています。
            料金や設備の絶対評価ではなく、同じ条件なら次も選ぶかどうかの記録です。
            基準はカテゴリごとに少しずつ違います。
          </p>
          <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div class="rounded-big border border-edge2 bg-panel p-5">
                <h3 class="flex items-center gap-2 text-[14.5px] font-bold tracking-tight">
                  <i class="fa-solid fa-route text-[13px] text-brand"></i>ツーリングルート
                </h3>
                <div class="mt-4 rounded-xl border border-edge2 bg-base">
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-s">S</span>
                    <p class="text-[13px] leading-[1.7] text-sub">この道のために遠征する価値がある。何度でも走りたい</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-a">A</span>
                    <p class="text-[13px] leading-[1.7] text-sub">近くを通るなら必ず組み込む</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-b">B</span>
                    <p class="text-[13px] leading-[1.7] text-sub">移動として悪くない。景色か道のどちらかは良い</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-c">C</span>
                    <p class="text-[13px] leading-[1.7] text-sub">次は別のルートを選ぶ</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-d">D</span>
                    <p class="text-[13px] leading-[1.7] text-sub">勧めない</p>
                  </div>
                </div>
              </div>
              <div class="rounded-big border border-edge2 bg-panel p-5">
                <h3 class="flex items-center gap-2 text-[14.5px] font-bold tracking-tight">
                  <i class="fa-solid fa-campground text-[13px] text-brand"></i>キャンプ場
                </h3>
                <p class="mt-3 text-[12.5px] leading-[1.75] text-mute">次の8つを満たした数で決めています。</p>
                <div class="mt-2 text-[11.5px] text-mute" style="display:flex;flex-wrap:wrap;gap:6px"><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">料金</span><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">ロケーション</span><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">トイレ</span><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">炊事場</span><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">荷運び</span><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">買い出し</span><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">温泉</span><span style="display:inline-block;border:1px solid var(--edge2,rgba(0,0,0,.12));border-radius:999px;padding:2px 9px">アクセス</span></div>
                <div class="mt-4 rounded-xl border border-edge2 bg-base">
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-s">S</span>
                    <p class="text-[13px] leading-[1.7] text-sub">8つすべて。連泊したくなる</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-a">A</span>
                    <p class="text-[13px] leading-[1.7] text-sub">7つ。ひとつだけ惜しい</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-b">B</span>
                    <p class="text-[13px] leading-[1.7] text-sub">5〜6つ。一泊なら十分</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-c">C</span>
                    <p class="text-[13px] leading-[1.7] text-sub">3〜4つ。我慢する前提で使う</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-d">D</span>
                    <p class="text-[13px] leading-[1.7] text-sub">2つ以下。勧めない</p>
                  </div>
                </div>
              <p class="mt-2 text-[11.5px] leading-[1.7] text-mute">無料でもトイレか炊事場に難があるときはCにしています。</p>
                </div>
              <div class="rounded-big border border-edge2 bg-panel p-5">
                <h3 class="flex items-center gap-2 text-[14.5px] font-bold tracking-tight">
                  <i class="fa-solid fa-droplet text-[13px] text-brand"></i>日帰り温泉
                </h3>
                <div class="mt-4 rounded-xl border border-edge2 bg-base">
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-s">S</span>
                    <p class="text-[13px] leading-[1.7] text-sub">700円以下。かけ流しまたはとろとろ・ぬるぬるの湯で、サウナ・露天・休憩所が揃う。寄り道してでも行く</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-a">A</span>
                    <p class="text-[13px] leading-[1.7] text-sub">湯は良いが設備が限られる。通り道なら必ず寄る</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-b">B</span>
                    <p class="text-[13px] leading-[1.7] text-sub">汗を流せれば十分なとき。価格相応</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-c">C</span>
                    <p class="text-[13px] leading-[1.7] text-sub">次はないかな</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-d">D</span>
                    <p class="text-[13px] leading-[1.7] text-sub">勧めない</p>
                  </div>
                </div>
              </div>
          </div>
          <div class="mt-4 rounded-big border border-edge2 bg-panel p-5">
            <h3 class="flex items-center gap-2 text-[14.5px] font-bold tracking-tight text-brand">
              <i class="fa-solid fa-cart-shopping text-[13px] text-brand"></i>ご当地スーパー
            </h3>
            <p class="mt-2 text-[13px] leading-[1.7] text-sub">
              ここだけは総合ランクではなく、2つの軸で別々に見ています。
            </p>
            <p class="mt-2.5">
              <span style="display:inline-block;border:1px solid rgba(0,0,0,0.12);border-radius:9999px;padding:2px 9px;margin:0 6px 6px 0;font-size:11.5px;color:#6b6b66">コスパ＝定価の安さ</span>
              <span style="display:inline-block;border:1px solid rgba(0,0,0,0.12);border-radius:9999px;padding:2px 9px;margin:0 6px 6px 0;font-size:11.5px;color:#6b6b66">品質＝地場品・鮮魚・惣菜</span>
            </p>
            <div class="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-[12px] font-bold text-ink">コスパ</p>
                <div class="mt-2 overflow-hidden rounded-xl border border-edge2">
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-s">S</span>
                    <p class="text-[13px] leading-[1.7] text-sub">定価がディスカウント店水準。値引きを待たなくても安い</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-a">A</span>
                    <p class="text-[13px] leading-[1.7] text-sub">全国チェーンより明確に安い。常時この価格なら寄る</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-b">B</span>
                    <p class="text-[13px] leading-[1.7] text-sub">全国チェーンより少し安い。地場チェーンとして健闘</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-c">C</span>
                    <p class="text-[13px] leading-[1.7] text-sub">全国チェーン並み。イオン・ヨーカドーと同じ位置</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-d">D</span>
                    <p class="text-[13px] leading-[1.7] text-sub">明らかに高い。補給以外で寄る理由がない</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-[12px] font-bold text-ink">品質</p>
                <div class="mt-2 overflow-hidden rounded-xl border border-edge2">
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-s">S</span>
                    <p class="text-[13px] leading-[1.7] text-sub">県産品が棚の主役。店内調理の刺身や惣菜が目的になる</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-a">A</span>
                    <p class="text-[13px] leading-[1.7] text-sub">地場品の棚がはっきりある。鮮魚か惣菜が明確に強い</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-b">B</span>
                    <p class="text-[13px] leading-[1.7] text-sub">必要なものは揃い、地場品も一部ある</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-c">C</span>
                    <p class="text-[13px] leading-[1.7] text-sub">全国チェーンと同じ品揃え。土地の色はない</p>
                  </div>
                  <div class="rank-row border-b border-edge2 px-4 py-3 last:border-b-0">
                    <span class="rank rank-d">D</span>
                    <p class="text-[13px] leading-[1.7] text-sub">品揃えが限られ、買い出し先として機能しない</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="mt-3 text-[11.5px] leading-[1.7] text-mute">
              値引きの強さはランクに含めず、「値引きを見た時刻」として別に記録しています。同じチェーンでも店舗によって価格も品揃えも違うため、訪問した1店舗を、ツーリング中の買い出し先という目的で見た個人の主観です。
            </p>
          </div>
        </div>
      </section>

      {/* 詳しい経緯はこちら */}
      <section class="bg-base">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          {storyHref ? (
            <div class="rounded-big border border-brand/25 bg-brandsoft p-5 sm:p-7">
              <p class="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">Read next</p>
              <h2 class="mt-1.5 text-[17px] font-bold leading-snug tracking-[-0.02em] sm:text-[20px]">
                詳しい経緯はこちら
              </h2>
              <p class="mt-2.5 max-w-[62ch] text-[14px] leading-[1.8] text-sub">
                貯金が2万円だった時期から現在までの14年間、どうやって積み上げたのか。
                収入の推移や実家を出たタイミングまで含めて、1本の記事にまとめています。
              </p>
              <div class="mt-5">
                <PillButton href={storyHref} icon="fa-book-open">
                  資産2万円からの記録を読む
                </PillButton>
              </div>
            </div>
          ) : null}

          <div class="mt-4 rounded-big border border-edge2 bg-panel p-5 sm:p-6">
            <p class="text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand">Site</p>
            <h2 class="mt-1.5 text-[16px] font-bold tracking-[-0.02em]">このサイトの構成</h2>
            <dl class="mt-4 divide-y divide-edge2 text-[14px]">
              {[
                ['公開記事', `${Object.values(counts).reduce((a, b) => a + b, 0)} 件`],
                ['構成', 'Hono / Cloudflare Pages'],
                ['データベース', 'Cloudflare D1 (SQLite)'],
                ['地図', 'Leaflet / OpenStreetMap'],
                ['対応端末', 'PC / スマートフォン']
              ].map(([k, v]) => (
                <div class="flex gap-5 py-3 first:pt-0 last:pb-0">
                  <dt class="w-28 shrink-0 text-mute">{k}</dt>
                  <dd class="font-mono text-[13.5px] tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p class="mt-5 rounded-xl border border-edge2 bg-panel px-4 py-3.5 text-[11.5px] leading-relaxed text-mute">
            本サイトの内容は個人の記録であり、特定の金融商品の推奨や投資助言ではありません。
            投資の判断はご自身の責任で行ってください。
          </p>
        </div>
      </section>
    </>
  )
}

/* =========================================================
   404
   ========================================================= */
export const NotFoundPage: FC = () => (
  <div class="mx-auto max-w-page px-4 py-20 sm:px-6">
    <span class="grid h-11 w-11 place-items-center rounded-xl bg-brandsoft text-brand">
      <i class="fa-solid fa-triangle-exclamation text-[17px]"></i>
    </span>
    <p class="mt-5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-mute">404 Not Found</p>
    <h1 class="mt-2 text-[24px] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[30px]">
      ページが見つかりません。
    </h1>
    <p class="mt-3 text-[14.5px] leading-relaxed text-sub">URLが変更されたか、削除された可能性があります。</p>
    <div class="mt-6 flex flex-wrap items-center gap-2.5">
      <PillButton href="/" icon="fa-house">
        ホームへ戻る
      </PillButton>
      <PillButton href="/search" variant="ghost" icon="fa-magnifying-glass">
        記事を探す
      </PillButton>
    </div>
  </div>
)

/* =========================================================
   タグ
   ========================================================= */
export const TagPage: FC<{ tag: string; posts: Post[] }> = ({ tag, posts }) => (
  <>
    <section class="border-b border-edge2 bg-base">
      <div class="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-10">
        <nav class="flex items-center gap-1.5 text-[11.5px] text-mute">
          <a href="/" class="transition hover:text-ink">ホーム</a>
          <i class="fa-solid fa-chevron-right text-[8px]"></i>
          <span class="text-sub">タグ</span>
        </nav>
        <p class="mt-4 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
          <i class="fa-solid fa-tag text-[10px]"></i>Tag
        </p>
        <h1 class="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">{tag}</h1>
        <p class="mt-2 font-mono text-[13px] tabular-nums text-mute">{posts.length} 件の記事</p>
      </div>
    </section>
    <section class="bg-base">
      <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
        {posts.length ? (
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard post={p} />
            ))}
          </div>
        ) : (
          <EmptyState text="このタグの記事は見つかりませんでした" />
        )}
        <p class="mt-8">
          <ArrowLink href="/search" size="sm">
            ほかのキーワードで探す
          </ArrowLink>
        </p>
      </div>
    </section>
  </>
)
export const CampListPage: FC<{
  items: {
    slug: string
    title: string
    place_name: string | null
    prefecture: string | null
    budget: number | null
    business_hours: string | null
    rating: number | null
  }[]
}> = ({ items }) => {
  return (
    <div class="mx-auto max-w-page px-6 py-10">
      <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink sm:text-[26px]">
        キャンプ場一覧
      </h1>
      <p class="mt-2 text-[14px] leading-[1.8] text-sub">
        ツーリングで実際に泊まったキャンプ場の記録です。料金の安い順に並んでいます。「開設期間」は訪問時に確認した情報で、冬季は閉鎖する場所もあります。ランクは料金・ロケーション・トイレ・炊事場・荷運び・買い出し・温泉・アクセスの8つで見た個人の評価で、詳しい基準は{' '}
        <a href="/about#rank" class="text-brand underline underline-offset-2">
          評価ランクについて
        </a>
        にまとめています。
      </p>
      <p class="mt-3">
        <a
          href="/theme/touring?cat=camp"
          class="inline-flex items-center gap-1.5 text-[13.5px] text-sub underline underline-offset-2 transition hover:text-ink"
        >
          <i class="fa-solid fa-chevron-left text-[9px]"></i>
          キャンプ場の記事を読む
        </a>
      </p>
      {items.length ? (
        <div class="mt-6 overflow-hidden rounded-big border border-edge2 bg-panel">
          <div class="camp-row border-b border-edge2 bg-base px-4 py-2 text-[11px] font-bold text-mute">
            <span class="min-w-0 flex-1">キャンプ場</span>
            <span class="w-24">エリア</span>
            <span class="w-20">料金</span>
            <span class="w-14">ランク</span>
            <span class="w-40">開設期間</span>
          </div>
          {items.map((it) => (
            <a
              href={`/posts/${it.slug}`}
              class="camp-row border-b border-edge2 px-4 py-3.5 last:border-b-0 hover:bg-black/[0.03]"
            >
              <span class="min-w-0 flex-1 text-[14px] font-bold text-ink">
                {it.place_name || it.title}
              </span>
              <span class="w-24 text-[13px] text-mute">{it.prefecture || '—'}</span>
              <span class="w-20 font-mono text-[13px] font-bold tabular-nums text-brand">
                {it.budget != null ? (it.budget === 0 ? '無料' : `${it.budget.toLocaleString()}円`) : '—'}
              </span>
              <span class="w-14">
                {it.rating != null ? (
                  <RankBadge value={it.rating} link={false} />
                ) : (
                  <span class="text-[13px] text-mute">—</span>
                )}
              </span>
              <span class="w-40 text-[12.5px] leading-[1.6] text-mute">
                {it.business_hours || '—'}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p class="mt-6 rounded-big border border-edge2 bg-panel px-4 py-8 text-center text-[14px] text-mute">
          まだ記事がありません。
        </p>
      )}
    </div>
  )
}

export const OnsenListPage: FC<{
  items: {
    slug: string
    title: string
    place_name: string | null
    prefecture: string | null
    budget: number | null
    business_hours: string | null
    rating: number | null
  }[]
}> = ({ items }) => {
  return (
    <div class="mx-auto max-w-page px-6 py-10">
      <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink sm:text-[26px]">
        日帰り温泉一覧
      </h1>
      <p class="mt-2 text-[14px] leading-[1.8] text-sub">
        ツーリングやキャンプの途中で寄った日帰り温泉の記録です。入浴料の安い順に並んでいます。料金も営業時間も訪問時に確認したもので、変わることがあります。ランクは湯の良さと設備、価格を合わせて見た個人の評価で、詳しい基準は{' '}
        <a href="/about#rank" class="text-brand underline underline-offset-2">
          評価ランクについて
        </a>
        にまとめています。
      </p>
      <p class="mt-3">
        <a
          href="/theme/spa"
          class="inline-flex items-center gap-1.5 text-[13.5px] text-sub underline underline-offset-2 transition hover:text-ink"
        >
          <i class="fa-solid fa-chevron-left text-[9px]"></i>
          日帰り温泉の記事を読む
        </a>
      </p>
      {items.length ? (
        <div class="mt-6 overflow-hidden rounded-big border border-edge2 bg-panel">
          <div class="camp-row border-b border-edge2 bg-base px-4 py-2 text-[11px] font-bold text-mute">
            <span class="min-w-0 flex-1">施設名</span>
            <span class="w-24">エリア</span>
            <span class="w-20">入浴料</span>
            <span class="w-14">ランク</span>
            <span class="w-40">営業時間</span>
          </div>
          {items.map((it) => (
            <a
              href={`/posts/${it.slug}`}
              class="camp-row border-b border-edge2 px-4 py-3.5 last:border-b-0 hover:bg-black/[0.03]"
            >
              <span class="min-w-0 flex-1 text-[14px] font-bold text-ink">
                {it.place_name || it.title}
              </span>
              <span class="w-24 text-[13px] text-mute">{it.prefecture || '—'}</span>
              <span class="w-20 font-mono text-[13px] font-bold tabular-nums text-brand">
                {it.budget != null ? `${it.budget.toLocaleString()}円` : '—'}
              </span>
              <span class="w-14">
                {it.rating != null ? (
                  <RankBadge value={it.rating} link={false} />
                ) : (
                  <span class="text-[13px] text-mute">—</span>
                )}
              </span>
              <span class="w-40 text-[12.5px] leading-[1.6] text-mute">
                {it.business_hours || '—'}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p class="mt-6 rounded-big border border-edge2 bg-panel px-4 py-8 text-center text-[14px] text-mute">
          まだ記事がありません。
        </p>
      )}
    </div>
  )
}

export const SupermarketListPage: FC<{
  items: {
    slug: string
    title: string
    place_name: string | null
    prefecture: string | null
    visit_date: string | null
    highlight_value: string | null
    cospa: number | null
    rating: number | null
  }[]
}> = ({ items }) => {
  return (
    <div class="mx-auto max-w-page px-6 py-10">
      <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink sm:text-[26px]">
        ご当地スーパー一覧
      </h1>
      <p class="mt-2 text-[14px] leading-[1.8] text-sub">
        ツーリングの途中で立ち寄ったご当地スーパーの記録です。訪問日の新しい順に並んでいます。「値引きを見た時刻」は実際に値引きシールを確認できた時刻で、「—」は観測できていない店です。コスパは定価の安さ、品質は地場品と鮮魚・惣菜の強さを見ています。全国チェーン（イオン・ヨーカドー）をC相当とした、訪問した1店舗についての個人の主観です。詳しい基準は{' '}
        <a href="/about#rank" class="text-brand underline underline-offset-2">
          評価ランクについて
        </a>
        にまとめています。
      </p>
      <p class="mt-3">
        <a
          href="/theme/touring?cat=supermarket"
          class="inline-flex items-center gap-1.5 text-[13.5px] text-sub underline underline-offset-2 transition hover:text-ink"
        >
          <i class="fa-solid fa-chevron-left text-[9px]"></i>
          ご当地スーパーの記事を読む
        </a>
      </p>
      {items.length ? (
        <div class="mt-6 overflow-hidden rounded-big border border-edge2 bg-panel">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-edge2 bg-base px-4 py-2 text-[11px] font-bold text-mute">
            <span class="min-w-0 flex-1">店舗</span>
            <span class="w-24">エリア</span>
            <span class="w-24">訪問日</span>
            <span class="w-28">値引きを見た時刻</span>
            <span class="w-24">コスパ / 品質</span>
          </div>
          {items.map((it) => (
            <a
              href={`/posts/${it.slug}`}
              class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-edge2 px-4 py-3.5 last:border-b-0 hover:bg-black/[0.03]"
            >
              <span class="min-w-0 flex-1 text-[14px] font-bold text-ink">
                {it.place_name || it.title}
              </span>
              <span class="w-24 text-[13px] text-mute">{it.prefecture || '—'}</span>
              <span class="w-24 font-mono text-[13px] tabular-nums text-mute">
                {it.visit_date || '—'}
              </span>
              <span class="w-28 text-[13px] text-brand">
                {it.highlight_value || '—'}
              </span>
              <span class="flex w-24 items-center gap-1.5">
                {it.cospa ? (
                  <RankBadge value={it.cospa} link={false} />
                ) : (
                  <span class="text-[13px] text-mute">—</span>
                )}
                <span class="text-[11px] text-mute">/</span>
                {it.rating ? (
                  <RankBadge value={it.rating} link={false} />
                ) : (
                  <span class="text-[13px] text-mute">—</span>
                )}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <p class="mt-6 rounded-big border border-edge2 bg-panel px-4 py-8 text-center text-[14px] text-mute">
          まだ記事がありません。
        </p>
      )}
    </div>
  )
}

/* =========================================================
   プライバシーポリシー（固定ページ）
   アクセス解析・Cookie・免責・連絡先。内容を変えたらここを直す。
   ========================================================= */
export const PrivacyPage: FC = () => {
  const sections: [string, string[]][] = [
    [
      'アクセス解析について',
      [
        '当サイトでは、サイトの利用状況を把握するために Google LLC が提供する Google アナリティクス 4 を利用しています。このツールは Cookie を使用して、ページの閲覧状況や訪問者のおおよその地域などの情報を収集します。氏名や住所など、個人を特定できる情報は収集していません。',
        '収集されたデータは Google 社のプライバシーポリシーに基づいて管理されます。Cookie による計測を望まない場合は、ブラウザの設定で Cookie を無効にするか、Google が提供するオプトアウトアドオンを利用することで拒否できます。'
      ]
    ],
    [
      'アクセスログについて',
      [
        '当サイトは Cloudflare, Inc. のサービス上で運用しています。サーバーへのアクセスに伴い、IPアドレス・ブラウザの種類・アクセス日時などが記録されます。これらは障害対応と不正アクセスの防止のために利用し、それ以外の目的では使用しません。'
      ]
    ],
    [
      '記載内容について',
      [
        '当サイトに掲載している資産額・生活費・税制に関する記述は、運営者個人の記録です。特定の金融商品の購入を勧めるものではなく、投資や税務上の助言でもありません。制度の適用可否は個々の状況によって異なります。実際の判断は、ご自身の責任において、必要に応じて専門家に相談のうえ行ってください。',
        '施設の料金・営業時間・道路状況などは、いずれも訪問した時点の情報です。その後変更されている場合があります。最新の情報は各施設の公式サイトでご確認ください。',
        '掲載内容には正確を期していますが、情報の利用によって生じたいかなる損害についても責任を負いかねます。'
      ]
    ],
    [
      '広告・アフィリエイトについて',
      [
        '現在、当サイトに広告は掲載していません。将来的に第三者配信の広告サービスやアフィリエイトプログラムを利用する場合は、その旨をこのページに追記します。その際、広告配信事業者が Cookie を使用して訪問者の興味に応じた広告を表示することがあります。'
      ]
    ],
    [
      '著作権について',
      [
        '当サイトに掲載している文章および写真の著作権は運営者に帰属します。引用の範囲を超えた転載はご遠慮ください。引用される場合は、出典として当サイトへのリンクを添えていただければ問題ありません。'
      ]
    ],
    [
      'お問い合わせ',
      [
        '当サイトに関するご連絡は contact@tadoreru.com までお願いします。記載内容の誤りのご指摘も歓迎します。内容によっては返信までお時間をいただく場合があります。'
      ]
    ]
  ]

  return (
    <>
      <section class="border-b border-edge2 bg-base">
        <div class="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-10">
          <nav class="flex items-center gap-1.5 text-[11.5px] text-mute">
            <a href="/" class="transition hover:text-ink">ホーム</a>
            <i class="fa-solid fa-chevron-right text-[8px]"></i>
            <span class="text-sub">プライバシーポリシー</span>
          </nav>

          <p class="mt-4 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
            <i class="fa-solid fa-shield-halved text-[10px]"></i>Privacy
          </p>
          <h1 class="mt-1.5 text-[24px] font-bold leading-[1.22] tracking-[-0.03em] text-ink sm:text-[32px]">
            プライバシーポリシー
          </h1>
          <p class="mt-3 max-w-[64ch] text-[14.5px] leading-[1.8] text-sub">
            個人が運営しているサイトです。何を集めていて、何を集めていないかをここに書いておきます。
          </p>
        </div>
      </section>

      <section class="bg-base">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          <div class="max-w-[72ch] space-y-9">
            {sections.map(([head, paras]) => (
              <div>
                <h2 class="text-[17px] font-bold tracking-tight text-ink sm:text-[19px]">{head}</h2>
                <div class="mt-3 space-y-3.5">
                  {paras.map((t) => (
                    <p class="text-[14.5px] leading-[1.9] text-sub">{t}</p>
                  ))}
                </div>
              </div>
            ))}

            <div class="border-t border-edge2 pt-6">
              <p class="font-mono text-[12px] tabular-nums text-mute">制定日 2026.11.10</p>
              <div class="mt-4">
                <ArrowLink href="/about">運営者について読む</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
