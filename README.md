# Tadoreru

お金・ツーリング・温泉・ITの記録を、実額と実測値で残す個人サイト。

- 公開URL: https://tadoreru.com
- 管理画面: https://tadoreru.com/admin

## 技術スタック

Hono + TypeScript (JSX SSR) / Cloudflare Pages + D1 + R2 /
Tailwind CSS（ビルド済み `static/tw.css`）/ Chart.js / Leaflet + OpenStreetMap / marked

維持費はドメイン代のみ（年 約1,905円）。Pages と D1 は無料枠で動かしている。
詳細は記事 `/posts/domain-cloudflare-registrar` に記録。

## テーマとカテゴリ

| テーマ | URL | カテゴリキー |
|---|---|---|
| Money | `/theme/money` | `asset`（資産運用）/ `life`（生活費） |
| Touring | `/theme/touring` | `touring`（ツーリング記録）/ `camp`（キャンプ場）/ `supermarket`（ご当地スーパー） |
| Spa | `/theme/spa` | `onsen`（日帰り温泉） |
| Tech | `/theme/tech` | `it`（業務効率化） |

テーマ内はサブカテゴリタブで絞り込む（例 `/theme/touring?cat=camp`）。
テーマ名・説明文・カテゴリ定義はすべて `src/lib/config.ts` の `THEMES` と `CATEGORY_MAP`。

## ディレクトリ

src/ index.tsx ルーティング lib/ config.ts サイト名・テーマ・カテゴリ・免責文 db.ts D1アクセス。POST_FIELDS / COLS / getSeriesNeighbors など utils.ts ショートコード、整形 routes/api.ts APIの入口（処理本体は db.ts） views/ layout.tsx 共通ヘッダー・フッター home.tsx トップ（ヒーロー・統計） post.tsx 記事詳細（カテゴリ別DATAカード・地図・前後ナビ） theme.tsx テーマ一覧 pages.tsx About / 検索 / 404 components.tsx カード・SeriesNav など共通部品 admin.tsx 管理画面の外枠とログイン（中身はJS側） public/static/ admin.js 管理画面の実体（フォーム・一覧）。ビルド対象外でそのまま配信 site.js 公開側のJS（地図・グラフ・共有ボタン） migrations/ 0001〜。適用は local と remote の両方に

## ローカル開発
npm install npm run build npm run dev:sandbox # http://localhost:3000

環境変数は `.dev.vars`（`ADMIN_PASSWORD` / `SESSION_SECRET` / `DEV_MEDIA_ORIGIN`）。
`.gitignore` 済み。ローカルR2は空なので画像は `DEV_MEDIA_ORIGIN` から借りて表示する。

## デプロイ
npm run build npx wrangler pages deploy dist --project-name=tadoreru

画像・CSSを作り直すとき:npm run build:img # OG画像・ファビコン npm run build:css # Tailwind + Font Awesome サブセット

## 記事の書き方

`WRITING_NOTES.md` を参照。タイトルの文字数、タグの付け方、
カテゴリ別の本文テンプレ、管理画面からの登録手順をまとめてある。

## 運用で踏んだ地雷

`DEPLOY_NOTES.md` を参照。D1のローカル／リモートの扱い、
カラム追加の手順、シークレットの変更方法など。

## タグ管理（管理画面）

管理画面サイドバーの「タグ」から、登録済みタグの一覧と整理ができます。

一覧は公開記事での使用数つきで、「2件以上で使われているタグ」「1件だけのタグ」「公開記事で未使用のタグ」の3グループに分かれます。2件以上は回遊の導線として機能しているタグ、1件だけは行き止まりになりやすいタグ、未使用は下書きだけで使われているか、どの記事にも付いていないタグです。

各行から次の操作ができます。

- **名前変更**：タグ名を変更します。`tags` の `slug` は `name` と同じ値で運用しているため、両方まとめて更新されます。
- **統合**：変更後の名前が既存タグと同じ場合（例「青森県」→「青森」）は、リネームではなく統合になります。`post_tags` の参照を既存タグ側へ付け替えたうえで、元のタグを削除します。両方のタグが付いていた記事は重複分を捨てて1件にまとめます。
- **削除**：タグと、そのタグの記事への紐付け（`post_tags`）をまとめて削除します。記事そのものは消えませんが、その記事からタグが外れます。

関連ファイルは次のとおりです。一覧APIが `GET /api/admin/tags`、リネームが `PUT /api/admin/tags/:id`、削除が `DELETE /api/admin/tags/:id` で、いずれも `src/routes/api.ts` の `api.use('/admin/*')` より後ろに置いてあるため認証がかかります。DB側の処理は `src/lib/db.ts` の `listTagsAdmin` / `renameTag` / `deleteTag`、画面は `public/static/admin.js` の `renderTags`、サイドバーの項目は `src/views/admin.tsx` です。

### 注意

リネームや削除をしたあと、そのタグが付いていた記事の編集画面を**変更前から開きっぱなし**にしていると、保存時にフォームのタグ欄の古い名前で再作成されます。記事を開き直してから保存してください。

## 残っている宿題

- コメント機能（テーブル新設・Turnstile・承認フロー）
- 免責文とカテゴリを管理画面から編集（いまは `config.ts` 直書き）
- `/about` の文言を管理画面から編集
- 関連記事を1〜3件選べるように（いまは `linked_slug` で1件のみ）
- favicon とアプリアイコンがバイクのまま