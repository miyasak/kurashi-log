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
    <section class="relative -mt-16 overflow-hidden border-b border-edge2 bg-base pt-16">
      <div
        class="absolute inset-0"
        style="background:radial-gradient(circle at 50% 0%, rgba(249,115,22,0.16), transparent 60%)"
      ></div>
      <div class="relative mx-auto max-w-page px-5 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16">
        <SectionTitle
          eyebrow="Search"
          icon="fa-magnifying-glass"
          title="読みたい記録を、探す。"
          desc="キーワード・カテゴリ・タグで横断検索できます。"
        />

        <form action="/search" method="get" class="mx-auto mt-11 max-w-[620px]">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[13px] text-mute"></i>
            <input
              type="search"
              name="q"
              value={q || ''}
              placeholder="キーワード（例: NISA、道の駅、生成AI）"
              class="w-full rounded-full border border-edge2 bg-panel py-3.5 pl-12 pr-5 text-[15px] text-ink outline-none transition placeholder:text-mute focus:border-brand/60"
            />
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
            <label class="sr-only" for="search-category">
              カテゴリ
            </label>
            <select
              id="search-category"
              name="category"
              class="rounded-full border border-edge2 bg-panel px-5 py-2.5 text-[13px] text-ink outline-none transition focus:border-edge"
            >
              <option value="">すべてのカテゴリ</option>
              {CATEGORIES.map((c) => (
                <option value={c.key} selected={category === c.key}>
                  {c.name}
                </option>
              ))}
            </select>
            <button class="rounded-full bg-brand px-7 py-2.5 text-[14px] font-medium text-white transition hover:brightness-110">
              検索する
            </button>
          </div>
        </form>

        {tag ? <p class="mt-6 text-center text-[13px] text-mute">タグ: {tag}</p> : null}
      </div>
    </section>

    <section class="bg-base py-14 sm:py-20">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <p class="mb-9 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
          {total} 件の記事
        </p>
        {posts.length ? (
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <section class="border-b border-edge2 bg-base pb-10 pt-12 sm:pb-12 sm:pt-16">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <SectionTitle
          eyebrow="Map"
          icon="fa-map-location-dot"
          title="走った場所も、寄った店も。"
          desc="ツーリングで訪れた場所と、旅先で立ち寄ったご当地スーパーを一枚の地図に。ピンをタップすると記事に移動します。"
        />
        <div class="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button class="map-filter rounded-full bg-brand px-5 py-2.5 text-[13px] font-medium text-white transition" data-filter="all">
            すべて
          </button>
          <button
            class="map-filter rounded-full border border-edge2 bg-panel px-5 py-2.5 text-[13px] text-sub transition hover:text-ink"
            data-filter="touring"
          >
            <i class="fa-solid fa-motorcycle mr-2 text-[11px]" style="color:#fb923c"></i>ツーリング {touringCount}
          </button>
          <button
            class="map-filter rounded-full border border-edge2 bg-panel px-5 py-2.5 text-[13px] text-sub transition hover:text-ink"
            data-filter="supermarket"
          >
            <i class="fa-solid fa-basket-shopping mr-2 text-[11px]" style="color:#fb7185"></i>スーパー {superCount}
          </button>
        </div>
      </div>
    </section>

    <div class="bg-base pb-14 pt-8 sm:pb-20">
      <div class="mx-auto max-w-[1120px] px-0 sm:px-6">
        <div id="full-map" class="h-[62vh] min-h-[420px] w-full overflow-hidden border-y border-edge2 sm:rounded-big sm:border"></div>
      </div>
    </div>

    <section class="border-t border-edge2 bg-panel py-16 sm:py-20">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <SectionTitle eyebrow="Spots" icon="fa-location-dot" title="訪れたスポット。" />
        <div id="map-list" class="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
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
      <section class="relative -mt-16 overflow-hidden border-b border-edge2 bg-base pt-16">
        <div
          class="absolute inset-0"
          style="background:radial-gradient(circle at 25% 0%, rgba(249,115,22,0.18), transparent 62%)"
        ></div>
        <div class="relative mx-auto max-w-page px-5 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <p class="inline-flex items-center gap-2.5 rounded-full border border-brand/40 bg-brandsoft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            <i class="fa-solid fa-circle-info text-[11px]"></i>About
          </p>
          <h1 class="mt-6 max-w-[760px] text-[32px] font-bold leading-[1.14] tracking-[-0.03em] text-white sm:text-[52px]">
            記録は、いちばん正直な判断材料になる。
          </h1>
          <p class="mt-6 max-w-[620px] text-[14.5px] leading-[1.85] text-sub sm:text-[16px]">
            {SITE.title} は、お金の積み上げ・暮らしのコスパ・バイクで走った距離・旅先のスーパー・仕事(社内SE)と生成AIの学びを、
            ひとつにまとめた個人サイトです。数字と写真で「あとから見返せる」ことを大切にしています。
          </p>
          <div class="mt-9 flex flex-wrap items-center gap-3">
            <PillButton href="/" icon="fa-house">
              ホームを見る
            </PillButton>
            <PillButton href="/map" variant="ghost" icon="fa-map-location-dot">
              走行マップ
            </PillButton>
          </div>
        </div>
      </section>

      <section class="border-b border-edge2 bg-panel py-16 sm:py-20">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <SectionTitle eyebrow="Topics" icon="fa-compass" title="5つのテーマ。" />
          <div class="mt-12 grid gap-4 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <a
                href={`/category/${c.key}`}
                class="group flex flex-col rounded-big border border-edge2 bg-base p-7 transition duration-500 hover:-translate-y-1 hover:border-edge"
              >
                <span
                  class="grid h-12 w-12 place-items-center rounded-2xl"
                  style={`background:${c.accentSoft};color:${c.accent}`}
                >
                  <i class={`fa-solid ${c.icon} text-[16px]`}></i>
                </span>
                <h2 class="mt-5 text-[20px] font-bold tracking-[-0.02em]">{c.name}</h2>
                <p class="mt-3 text-[13.5px] leading-relaxed text-sub">{c.description}</p>
                <p class="mt-6 flex items-center gap-1.5 text-[13px] font-medium" style={`color:${c.accent}`}>
                  記事を見る（{counts[c.key] || 0}）
                  <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section class="bg-base py-16 sm:py-20">
        <div class="mx-auto max-w-page px-5 sm:px-6">
          <SectionTitle eyebrow="Site" icon="fa-code" title="このサイトの構成。" />
          <div class="mt-12">
            <SpecRow
              items={[
                { label: '公開記事', value: String(total), accent: '#fb923c' },
                { label: 'バックエンド', value: 'Hono', sub: 'Cloudflare Workers' },
                { label: 'データベース', value: 'D1', sub: 'SQLite (Edge)' },
                { label: '地図', value: 'Leaflet', sub: 'OpenStreetMap' }
              ]}
            />
          </div>
          <div class="mx-auto mt-12 max-w-text rounded-big border border-edge2 bg-panel p-7 sm:p-9">
            <dl class="divide-y divide-edge2 text-[13.5px]">
              {[
                ['更新方法', '管理画面から記事・月次データを登録'],
                ['デザイン', 'ダークテーマ / Tailwind CSS'],
                ['グラフ', 'Chart.js による資産・生活費の可視化'],
                ['対応端末', 'PC / iPhone レスポンシブ']
              ].map(([k, v]) => (
                <div class="flex gap-6 py-4 first:pt-0 last:pb-0">
                  <dt class="w-28 shrink-0 text-mute">{k}</dt>
                  <dd class="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p class="mt-8 text-center">
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
  <div class="mx-auto flex min-h-[60vh] max-w-text flex-col items-center justify-center px-5 py-24 text-center sm:px-6">
    <span class="grid h-14 w-14 place-items-center rounded-2xl bg-brandsoft text-brand">
      <i class="fa-solid fa-triangle-exclamation text-[20px]"></i>
    </span>
    <p class="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">404 Not Found</p>
    <h1 class="mt-3 text-[30px] font-bold leading-tight tracking-[-0.025em] text-white sm:text-[42px]">
      ページが見つかりません。
    </h1>
    <p class="mt-5 text-[15px] leading-relaxed text-sub">URLが変更されたか、削除された可能性があります。</p>
    <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
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
    <section class="border-b border-edge2 bg-base pb-12 pt-14 sm:pb-14 sm:pt-16">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        <SectionTitle eyebrow="Tag" icon="fa-tag" title={tag} desc={`${posts.length} 件の記事`} />
      </div>
    </section>
    <section class="bg-base py-14 sm:py-20">
      <div class="mx-auto max-w-page px-5 sm:px-6">
        {posts.length ? (
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
