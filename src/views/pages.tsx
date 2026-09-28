import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { THEMES, SITE } from '../lib/config'
import { PostCard, EmptyState, SectionTitle } from './components'
import { ArrowLink, PillButton } from './layout'

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
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-mute"></i>
            <input
              type="search"
              name="q"
              value={q || ''}
              placeholder="キーワード（例: NISA、ビーナスライン、Python）"
              class="w-full rounded-full border border-edge2 bg-panel py-3 pl-10 pr-4 text-[13.5px] text-ink outline-none transition placeholder:text-mute focus:border-brand/50"
            />
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <label class="sr-only" for="search-theme">テーマ</label>
            <select
              id="search-theme"
              name="theme"
              class="rounded-full border border-edge2 bg-panel px-4 py-2 text-[12.5px] text-ink outline-none transition focus:border-edge"
            >
              <option value="">すべてのテーマ</option>
              {THEMES.map((t) => (
                <option value={t.key} selected={theme === t.key}>
                  {t.label} — {t.name}
                </option>
              ))}
            </select>
            <button class="rounded-full bg-brand px-5 py-2 text-[12.5px] font-medium text-white transition hover:brightness-110">
              検索する
            </button>
          </div>
        </form>

        {tag ? <p class="mt-4 text-[12px] text-mute">タグ: {tag}</p> : null}
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
export const MapPage: FC<{ touringCount: number; superCount: number }> = ({ touringCount, superCount }) => {
  const hasPins = touringCount + superCount > 0
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
            走った場所も、寄った店も。
          </h1>
          <p class="mt-3 max-w-[64ch] text-[13.5px] leading-[1.8] text-sub">
            ツーリングで訪れた場所と、旅先で立ち寄ったご当地スーパーを一枚の地図に。ピンをタップすると記事に移動します。
          </p>

          {hasPins ? (
            <div class="mt-5 flex flex-wrap items-center gap-2">
              <button
                class="map-filter rounded-full bg-brand px-4 py-2 text-[12.5px] font-medium text-white transition"
                data-filter="all"
              >
                すべて
              </button>
              {touringCount ? (
                <button
                  class="map-filter rounded-full border border-edge2 bg-panel px-4 py-2 text-[12.5px] text-sub transition hover:text-ink"
                  data-filter="touring"
                >
                  <i class="fa-solid fa-motorcycle mr-1.5 text-[10.5px] text-brand"></i>
                  ツーリング
                  <span class="ml-1.5 font-mono tabular-nums opacity-60">{touringCount}</span>
                </button>
              ) : null}
              {superCount ? (
                <button
                  class="map-filter rounded-full border border-edge2 bg-panel px-4 py-2 text-[12.5px] text-sub transition hover:text-ink"
                  data-filter="supermarket"
                >
                  <i class="fa-solid fa-basket-shopping mr-1.5 text-[10.5px] text-brand"></i>
                  スーパー
                  <span class="ml-1.5 font-mono tabular-nums opacity-60">{superCount}</span>
                </button>
              ) : null}
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
            <EmptyState text="地図に表示できる記録は準備中です" />
          </div>
        </section>
      )}
    </>
  )
}

/* =========================================================
   About（自己紹介記事が無い場合のフォールバック）
   ========================================================= */
export const AboutPage: FC<{ counts: Record<string, number> }> = ({ counts }) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
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
          <h1 class="mt-1.5 max-w-[24ch] text-[24px] font-bold leading-[1.22] tracking-[-0.03em] text-ink sm:text-[32px]">
            記録は、いちばん正直な判断材料になる。
          </h1>
          <p class="mt-3 max-w-[66ch] text-[13.5px] leading-[1.85] text-sub">
            {SITE.title} は、資産運用と生活費、ツーリングとご当地スーパー、業務効率化と自動化の記録を
            ひとつにまとめた個人サイトです。数字と写真で「あとから見返せる」ことを大切にしています。
          </p>
        </div>
      </section>

      <section class="bg-base">
        <div class="mx-auto max-w-page px-4 py-9 sm:px-6 sm:py-11">
          <SectionTitle eyebrow="Topics" icon="fa-compass" title="3つのテーマ" />
          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t) => {
              const n = t.categories.reduce((s, k) => s + (counts[k] || 0), 0)
              return (
                <a
                  href={`/theme/${t.key}`}
                  class="group flex flex-col rounded-big border border-edge2 bg-panel p-5 transition duration-300 hover:border-brand/40"
                >
                  <span class="grid h-9 w-9 place-items-center rounded-lg bg-brandsoft text-brand">
                    <i class={`fa-solid ${t.icon} text-[14px]`}></i>
                  </span>
                  <h2 class="mt-3.5 text-[16px] font-bold tracking-[-0.02em]">
                    {t.label}
                    <span class="ml-2 text-[12.5px] font-medium text-mute">{t.name}</span>
                  </h2>
                  <p class="mt-2 text-[12.5px] leading-[1.7] text-sub">{t.description}</p>
                  <p class="mt-4 flex items-center gap-1.5 text-[12.5px] font-medium text-brand">
                    <span class="font-mono tabular-nums">{n}</span> 件を見る
                    <i class="fa-solid fa-chevron-right text-[9px] transition group-hover:translate-x-0.5"></i>
                  </p>
                </a>
              )
            })}
          </div>

          <div class="mt-8 rounded-big border border-edge2 bg-panel p-5 sm:p-6">
            <p class="text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand">Site</p>
            <h2 class="mt-1.5 text-[17px] font-bold tracking-[-0.02em]">このサイトの構成</h2>
            <dl class="mt-4 divide-y divide-edge2 text-[13px]">
              {[
                ['公開記事', `${total} 件`],
                ['構成', 'Hono / Cloudflare Workers'],
                ['データベース', 'Cloudflare D1 (SQLite)'],
                ['地図', 'Leaflet / OpenStreetMap'],
                ['対応端末', 'PC / スマートフォン']
              ].map(([k, v]) => (
                <div class="flex gap-5 py-3 first:pt-0 last:pb-0">
                  <dt class="w-28 shrink-0 text-mute">{k}</dt>
                  <dd class="font-mono text-[12.5px] tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
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
  <div class="mx-auto max-w-page px-4 py-20 sm:px-6">
    <span class="grid h-11 w-11 place-items-center rounded-xl bg-brandsoft text-brand">
      <i class="fa-solid fa-triangle-exclamation text-[17px]"></i>
    </span>
    <p class="mt-5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-mute">404 Not Found</p>
    <h1 class="mt-2 text-[24px] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[30px]">
      ページが見つかりません。
    </h1>
    <p class="mt-3 text-[13.5px] leading-relaxed text-sub">URLが変更されたか、削除された可能性があります。</p>
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
        <p class="mt-2 font-mono text-[12px] tabular-nums text-mute">{posts.length} 件の記事</p>
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
