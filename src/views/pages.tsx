import type { FC } from 'hono/jsx'
import type { Post } from '../lib/db'
import { CATEGORIES, CATEGORY_MAP, SITE } from '../lib/config'
import { PostCard, EmptyState } from './components'

export const SearchPage: FC<{
  posts: Post[]
  q?: string
  category?: string
  tag?: string
  total: number
}> = ({ posts, q, category, tag, total }) => (
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <h1 class="text-2xl font-black tracking-tight sm:text-3xl">記事を探す</h1>
    <p class="mt-2 text-[13px] text-ink-soft">キーワード・カテゴリ・タグで横断検索できます。</p>

    <form action="/search" method="get" class="mt-6 flex flex-col gap-2 sm:flex-row">
      <div class="relative flex-1">
        <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-mute"></i>
        <input
          type="search"
          name="q"
          value={q || ''}
          placeholder="キーワード（例: NISA、道の駅、生成AI）"
          class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400"
        />
      </div>
      <select
        name="category"
        class="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-slate-400"
      >
        <option value="">すべてのカテゴリ</option>
        {CATEGORIES.map((c) => (
          <option value={c.key} selected={category === c.key}>
            {c.name}
          </option>
        ))}
      </select>
      <button class="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
        検索
      </button>
    </form>

    {tag ? (
      <p class="mt-4 text-xs font-bold text-ink-soft">
        タグ: <span class="rounded-lg bg-slate-100 px-2 py-1">#{tag}</span>
      </p>
    ) : null}

    <p class="mb-4 mt-8 text-[11px] font-bold tracking-wider text-ink-mute">{total} 件ヒット</p>
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
)

export const MapPage: FC<{ touringCount: number; superCount: number }> = ({ touringCount, superCount }) => (
  <div>
    <div class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 class="text-2xl font-black tracking-tight sm:text-3xl">
          <i class="fa-solid fa-map-location-dot mr-2 text-sky-500"></i>走行 & スーパーマップ
        </h1>
        <p class="mt-2 text-[13px] text-ink-soft">
          ツーリングで訪れた場所と、ご当地スーパーを地図上にまとめました。ピンをタップすると記事に飛べます。
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          <button
            class="map-filter rounded-xl px-3.5 py-2 text-xs font-bold text-white"
            data-filter="all"
            style="background:#0f172a"
          >
            すべて
          </button>
          <button
            class="map-filter rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-soft"
            data-filter="touring"
          >
            <i class="fa-solid fa-motorcycle mr-1.5 text-sky-500"></i>ツーリング {touringCount}
          </button>
          <button
            class="map-filter rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-soft"
            data-filter="supermarket"
          >
            <i class="fa-solid fa-basket-shopping mr-1.5 text-rose-500"></i>スーパー {superCount}
          </button>
        </div>
      </div>
    </div>
    <div id="full-map" class="h-[60vh] min-h-[420px] w-full"></div>
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h2 class="mb-4 text-sm font-extrabold">スポット一覧</h2>
      <div id="map-list" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
    </div>
  </div>
)

export const AboutPage: FC<{ counts: Record<string, number> }> = ({ counts }) => (
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
    <h1 class="text-3xl font-black tracking-tight">About</h1>
    <p class="mt-4 text-[14px] leading-relaxed text-ink-soft">
      {SITE.title} は、日々のお金の記録・生活のコスパ検証・バイクで走った記録・旅先のスーパー巡り・仕事(社内SE)とITの学びを、
      ひとつにまとめた個人サイトです。数字と写真で「あとから見返せる」ことを大事にしています。
    </p>
    <div class="mt-8 grid gap-3 sm:grid-cols-2">
      {CATEGORIES.map((c) => (
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <span class="grid h-10 w-10 place-items-center rounded-xl" style={`background:${c.accentSoft};color:${c.accent}`}>
            <i class={`fa-solid ${c.icon}`}></i>
          </span>
          <h2 class="mt-3 text-[15px] font-extrabold">{c.name}</h2>
          <p class="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{c.description}</p>
          <a href={`/category/${c.key}`} class="mt-3 inline-block text-[11px] font-bold" style={`color:${c.accent}`}>
            記事を見る（{counts[c.key] || 0}）→
          </a>
        </div>
      ))}
    </div>
    <div class="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 class="text-sm font-extrabold">サイトについて</h2>
      <dl class="mt-4 space-y-2.5 text-[12.5px]">
        <div class="flex gap-3">
          <dt class="w-28 shrink-0 font-bold text-ink-mute">技術構成</dt>
          <dd class="text-ink-soft">Hono + Cloudflare Pages / D1 (SQLite) + Tailwind CSS</dd>
        </div>
        <div class="flex gap-3">
          <dt class="w-28 shrink-0 font-bold text-ink-mute">地図</dt>
          <dd class="text-ink-soft">Leaflet + OpenStreetMap</dd>
        </div>
        <div class="flex gap-3">
          <dt class="w-28 shrink-0 font-bold text-ink-mute">更新</dt>
          <dd class="text-ink-soft">管理画面から記事・月次データを登録</dd>
        </div>
      </dl>
    </div>
  </div>
)

export const NotFoundPage: FC = () => (
  <div class="mx-auto max-w-xl px-4 py-24 text-center">
    <p class="text-6xl font-black tracking-tight text-slate-300">404</p>
    <h1 class="mt-4 text-xl font-extrabold">ページが見つかりません</h1>
    <p class="mt-2 text-sm text-ink-soft">URLが変更されたか、削除された可能性があります。</p>
    <a
      href="/"
      class="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700"
    >
      <i class="fa-solid fa-house text-xs"></i>ホームへ戻る
    </a>
  </div>
)

export const TagPage: FC<{ tag: string; posts: Post[] }> = ({ tag, posts }) => (
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <p class="text-[11px] font-black tracking-widest text-ink-mute">TAG</p>
    <h1 class="mt-1 text-2xl font-black tracking-tight sm:text-3xl">#{tag}</h1>
    <p class="mb-6 mt-2 text-[13px] text-ink-soft">{posts.length} 件の記事</p>
    {posts.length ? (
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard post={p} />
        ))}
      </div>
    ) : (
      <EmptyState text="このタグの記事はまだありません" />
    )}
  </div>
)
