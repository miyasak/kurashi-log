# Kurashi Log — 個人サイト（資産運用 / 生活 / ツーリング / ご当地スーパー / IT）

## プロジェクト概要
- **名称**: Kurashi Log
- **目的**: 性質の異なる5テーマを1サイトにまとめつつ、テーマごとに最適な見せ方・動線を用意した個人サイト
- **主な特徴**
  - 5カテゴリごとに**専用のレイアウト / カード表示 / サマリー指標**
  - 記事は**管理画面から登録・編集・削除**（ログイン制）
  - ツーリング・スーパーは**地図（Leaflet + OpenStreetMap）**埋め込み、写真ギャラリー、タグ
  - 資産運用・生活費は**Chart.js のグラフ**（月次データを管理画面から登録）
  - PC / iPhone 両対応のレスポンシブ、モダンなUI（Tailwind CSS）

## カテゴリと動線設計
グローバルナビはテーマの性質で3グループに集約し、迷わない導線にしています。

| グループ | カテゴリ | 見せ方 |
| --- | --- | --- |
| MONEY（お金のこと） | 資産運用 / 日常の生活 | 数値ハイライト付きリスト型カード＋推移グラフ・費目ドーナツグラフ |
| TRAVEL（旅とスーパー） | ツーリングログ / ご当地スーパー | 写真主体のカード（距離バッジ / ★評価・コスパ・会計）＋地図 |
| TECH（仕事とIT） | IT / 生成AI | ダークテーマのテキスト主体カード＋タグ |

さらに `/map` で「ツーリング×スーパー」を1枚の地図に統合表示（カテゴリ絞り込み可）。

## URL 一覧
### 公開ページ
| パス | 内容 |
| --- | --- |
| `/` | トップ（ヒーロー / 5カテゴリ導線 / MONEY・TRAVEL・TECH ゾーン / 新着） |
| `/category/:key` | カテゴリ一覧（`asset` `life` `touring` `supermarket` `it`）<br>クエリ: `?q=` 検索, `?tag=` タグ絞込, `?page=` ページング |
| `/posts/:slug` | 記事詳細（カテゴリ別スペック / 写真 / 地図 / 関連記事） |
| `/tags/:tag` | タグ別一覧 |
| `/search` | 横断検索（`?q=` `?category=` `?tag=`） |
| `/map` | 走行 & スーパーマップ |
| `/about` | サイト紹介 |
| `/sitemap.xml`, `/robots.txt` | SEO |

### 管理画面
| パス | 内容 |
| --- | --- |
| `/admin` | ログイン → ダッシュボード / 記事管理 / 記事エディタ / 月次データ |

**初期パスワード: `admin1234`**（`ADMIN_PASSWORD` で変更。本番は必ず変更してください）

### API
| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/api/posts?category=&tag=&q=&limit=&offset=` | 公開記事一覧 |
| GET | `/api/tags?category=` | タグ一覧 |
| GET | `/api/stats/monthly` | 月次データ（グラフ用） |
| GET | `/api/map/points` | 地図ピン一覧 |
| POST | `/api/admin/login` / `logout`, GET `/api/admin/me` | 認証 |
| GET/POST/PUT/DELETE | `/api/admin/posts[/:id]` | 記事CRUD（要認証） |
| GET/POST/DELETE | `/api/admin/stats[/:ym]` | 月次データCRUD（要認証） |
| GET | `/api/admin/summary` | ダッシュボード集計 |
| POST | `/api/admin/upload` | 画像アップロード（R2バインド時のみ） |

## データ構成
- **ストレージ**: Cloudflare D1（SQLite）
- **テーブル**
  - `posts` … 記事本体。共通項目＋カテゴリ固有項目を1テーブルで保持
    - 共通: `slug` `category` `title` `summary` `body`(Markdown) `cover_image` `status` `published_at` `featured`
    - 位置: `place_name` `prefecture` `address` `lat` `lng`
    - ツーリング: `distance_km` `duration_text` `weather` `bike` `route_text`
    - スーパー: `rating` `cospa` `budget` `visit_date` `business_hours`
    - 資産/生活: `highlight_label` `highlight_value` `highlight_sub`
  - `tags` / `post_tags` … タグ（多対多）
  - `post_photos` … 記事内フォトギャラリー
  - `monthly_stats` … 月次の資産・生活費（`ym` 一意、`expense_json` に費目内訳）
  - `settings` … 予備
- **認証**: HMAC-SHA256 署名付き Cookie（7日間）

## 使い方（管理画面）
1. `/admin` にアクセスしてパスワードでログイン
2. 「新規記事」→ カテゴリを選ぶと**カテゴリ専用の入力欄**に切り替わる
   - ツーリング / スーパー: 地図をクリック、または地名検索でピン（緯度経度）を設定
   - 資産 / 生活: 記事上部の数値ハイライトを設定
3. 本文は Markdown（挿入ボタン＋プレビュー切替あり）
4. タグはカンマ区切り、写真はURL＋キャプションで追加
5. 「下書き / 公開」を切り替えて保存（下書きはログイン中のみ閲覧可）
6. 「月次データ」から総資産・NISA・iDeCo・生活費を登録するとグラフに反映

## ローカル開発
```bash
npm install
npm run build
npm run db:migrate:local     # ローカルD1にスキーマ適用
npm run db:seed              # サンプルデータ投入
pm2 start ecosystem.config.cjs
curl http://localhost:3000
```
- 環境変数は `.dev.vars`（`ADMIN_PASSWORD`, `SESSION_SECRET`）

## デプロイ
- **プラットフォーム**: Cloudflare Pages（Hono / Workers ランタイム）
- **状態**: ❌ 未デプロイ（ローカル検証済み）
- **本番手順（概要）**
  1. `npx wrangler d1 create webapp-production` → `wrangler.jsonc` の `database_id` を更新
  2. `npm run db:migrate:prod`
  3. `npx wrangler pages project create` → `npm run deploy:prod`
  4. `npx wrangler pages secret put ADMIN_PASSWORD` / `SESSION_SECRET`

## 技術スタック
Hono + TypeScript(JSX SSR) / Cloudflare Pages + D1 / Tailwind CSS(CDN) / Chart.js / Leaflet + OpenStreetMap / marked

## 今後の拡張候補
- R2 バインドを有効にして管理画面から画像を直接アップロード
- 記事の予約公開、閲覧数の集計表示
- ツーリングのGPXルート表示、スーパーの商品単価データベース
- RSS配信、OGP画像の自動生成

_Last Updated: 2026-08-02_
