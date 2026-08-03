import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORIES, SITE } from '../lib/config'
import { PostCard, EmptyState, SectionTitle, SpecRow } from './components'
import { ArrowLink, PillButton } from './layout'

/* =========================================================
   検索
   ========================================================= */
export const SearchPage: FC<{
  posts: Post[]
  q?: string
  category?: string
  tag?: string
  total: number
}> = ({ posts, q, category, tag, total }) => (
  <>
    <section class="bg-white pb-12 pt-14 sm:pb-16 sm:pt-24">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <SectionTitle eyebrow="Search" title="読みたい記録を、探す。" desc="キーワード・カテゴリ・タグで横断検索できます。" />

        <form action="/search" method="get" class="mx-auto mt-12 max-w-[620px]">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[13px] text-mute"></i>
            <input
              type="search"
              name="q"
              value={q || ''}
              placeholder="キーワード（例: NISA、道の駅、生成AI）"
              class="w-full rounded-full bg-hazy py-3.5 pl-12 pr-5 text-[15px] tracking-[-0.01em] outline-none transition placeholder:text-mute focus:bg-[#eeeef0]"
            />
          </div>
          <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
            <label class="sr-only" for="search-category">カテゴリ</label>
            <select
              id="search-category"
              name="category"
              class="rounded-full bg-hazy px-5 py-2.5 text-[13px] tracking-[-0.01em] outline-none transition focus:bg-[#eeeef0]"
            >
              <option value="">すべてのカテゴリ</option>
              {CATEGORIES.map((c) => (
                <option value={c.key} selected={category === c.key}>
                  {c.name}
                </option>
              ))}
            </select>
            <button class="rounded-full bg-blue px-7 py-2.5 text-[14px] text-white transition hover:brightness-110">
              検索する
            </button>
          </div>
        </form>

        {tag ? <p class="mt-6 text-center text-[13px] text-mute">タグ: {tag}</p> : null}
      </div>
    </section>

    <section class="bg-hazy py-14 sm:py-20">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <p class="mb-9 text-center text-[12px] uppercase tracking-[0.14em] text-mute">{total} 件の記事</p>
        {posts.length ? (
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
export const MapPage: FC<{ touringCount: number; superCount: number }> = ({ touringCount, superCount }) => (
  <>
    <section class="bg-ink pb-12 pt-16 text-white sm:pb-16 sm:pt-24">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <SectionTitle
          eyebrow="Map"
          title="走った場所も、寄った店も。"
          desc="ツーリングで訪れた場所と、旅先で立ち寄ったご当地スーパーを一枚の地図に。ピンをタップすると記事に移動します。"
          light
        />
        <div class="mt-11 flex flex-wrap items-center justify-center gap-2">
          <button
            class="map-filter rounded-full bg-white px-5 py-2 text-[13px] text-ink transition"
            data-filter="all"
          >
            すべて
          </button>
          <button
            class="map-filter rounded-full border border-white/25 px-5 py-2 text-[13px] text-white/85 transition hover:border-white/50"
            data-filter="touring"
          >
            ツーリング {touringCount}
          </button>
          <button
            class="map-filter rounded-full border border-white/25 px-5 py-2 text-[13px] text-white/85 transition hover:border-white/50"
            data-filter="supermarket"
          >
            ご当地スーパー {superCount}
          </button>
        </div>
      </div>
    </section>

    <div class="bg-ink pb-16 sm:pb-20">
      <div class="mx-auto max-w-[1180px] px-0 sm:px-6">
        <div id="full-map" class="h-[62vh] min-h-[420px] w-full overflow-hidden sm:rounded-big"></div>
      </div>
    </div>

    <section class="bg-white py-16 sm:py-24">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <SectionTitle eyebrow="Spots" title="訪れたスポット。" />
        <div id="map-list" class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </section>
  </>
)

/* =========================================================
   About
   ========================================================= */
export const AboutPage: FC<{ counts: Record<string, number> }> = ({ counts }) => {
  const total = CATEGORIES.reduce((s, c) => s + (counts[c.key] || 0), 0)
  return (
    <>
      <section class="bg-white pb-14 pt-16 sm:pb-20 sm:pt-28">
        <div class="mx-auto max-w-text px-5 text-center sm:px-6">
          <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-mute">About</p>
          <h1 class="mt-3 text-[36px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[60px]">
            記録は、いちばん正直な
            <br class="hidden sm:block" />
            判断材料になる。
          </h1>
          <p class="mx-auto mt-7 max-w-[620px] text-[17px] leading-[1.6] tracking-[-0.01em] text-sub sm:text-[19px]">
            {SITE.title} は、お金の積み上げ・暮らしのコスパ・バイクで走った距離・旅先のスーパー・仕事(社内SE)と生成AIの学びを、
            ひとつにまとめた個人サイトです。数字と写真で「あとから見返せる」ことを大切にしています。
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <PillButton href="/">ホームを見る</PillButton>
            <PillButton href="/map" variant="dark">走行マップ</PillButton>
          </div>
        </div>
      </section>

      <section class="bg-hazy py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <SectionTitle eyebrow="Topics" title="5つのテーマ。" />
          <div class="mt-12 grid gap-5 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <a
                href={`/category/${c.key}`}
                class="group flex flex-col rounded-big bg-white p-8 transition hover:-translate-y-0.5"
              >
                <span
                  class="grid h-11 w-11 place-items-center rounded-full"
                  style={`background:${c.accentSoft};color:${c.accent}`}
                >
                  <i class={`fa-solid ${c.icon} text-[15px]`}></i>
                </span>
                <h2 class="mt-5 text-[21px] font-semibold tracking-[-0.015em]">{c.name}</h2>
                <p class="mt-3 text-[14px] leading-relaxed text-sub">{c.description}</p>
                <p class="mt-6 flex items-center gap-1.5 text-[13px] text-blue">
                  記事を見る（{counts[c.key] || 0}）
                  <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section class="bg-white py-16 sm:py-24">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <SectionTitle eyebrow="Site" title="このサイトの構成。" />
          <div class="mt-14">
            <SpecRow
              items={[
                { label: '公開記事', value: String(total) },
                { label: 'バックエンド', value: 'Hono', sub: 'Cloudflare Workers' },
                { label: 'データベース', value: 'D1', sub: 'SQLite (Edge)' },
                { label: '地図', value: 'Leaflet', sub: 'OpenStreetMap' }
              ]}
            />
          </div>
          <div class="mx-auto mt-16 max-w-text border-t border-line pt-10">
            <dl class="divide-y divide-line text-[14px]">
              {[
                ['更新方法', '管理画面から記事・月次データを登録'],
                ['デザイン', 'Tailwind CSS / システムフォント'],
                ['グラフ', 'Chart.js による資産・生活費の可視化'],
                ['対応端末', 'PC / iPhone レスポンシブ']
              ].map(([k, v]) => (
                <div class="flex gap-6 py-4">
                  <dt class="w-28 shrink-0 text-mute">{k}</dt>
                  <dd class="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p class="mt-10 text-center">
              <ArrowLink href="/admin" size="sm">
                管理画面へ
              </ArrowLink>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

/* =========================================================
   404
   ========================================================= */
export const NotFoundPage: FC = () => (
  <div class="mx-auto flex min-h-[62vh] max-w-text flex-col items-center justify-center px-5 py-24 text-center sm:px-6">
    <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-mute">404</p>
    <h1 class="mt-3 text-[34px] font-semibold leading-tight tracking-[-0.025em] sm:text-[48px]">
      ページが見つかりません。
    </h1>
    <p class="mt-5 text-[17px] leading-relaxed text-sub">
      URLが変更されたか、削除された可能性があります。
    </p>
    <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
      <PillButton href="/">ホームへ戻る</PillButton>
      <PillButton href="/search" variant="dark">記事を探す</PillButton>
    </div>
  </div>
)

/* =========================================================
   タグ
   ========================================================= */
export const TagPage: FC<{ tag: string; posts: Post[] }> = ({ tag, posts }) => (
  <>
    <section class="bg-white pb-12 pt-16 sm:pb-16 sm:pt-24">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <SectionTitle eyebrow="Tag" title={tag} desc={`${posts.length} 件の記事`} />
      </div>
    </section>
    <section class="bg-hazy py-14 sm:py-20">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        {posts.length ? (
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard post={p} />
            ))}
          </div>
        ) : (
          <EmptyState text="このタグの記事はまだありません" />
        )}
        <p class="mt-12 text-center">
          <ArrowLink href="/search" size="sm">
            ほかのキーワードで探す
          </ArrowLink>
        </p>
      </div>
    </section>
  </>
)
