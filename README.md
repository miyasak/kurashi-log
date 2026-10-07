# Kurashi Log — 個人サイト（資産運用 / 生活 / ツーリング / ご当地スーパー / IT）

## プロジェクト概要
- **名称**: Kurashi Log
- **目的**: 性質の異なる5テーマを1サイトにまとめつつ、テーマごとに最適な見せ方・動線を用意した個人サイト
- **主な特徴**
  - 5カテゴリごとに**専用のレイアウト / カード表示 / サマリー指標**
  - 記事は**管理画面から登録・編集・削除**（ログイン制）
  - ツーリング・スーパーは**地図（Leaflet + OpenStreetMap(CARTO Dark)）**埋め込み、写真ギャラリー、タグ
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

## 公開URL
- **本番サイト**: https://97fdf32d-665b-47ba-ae39-073216cebef5.vip.gensparksite.com
- **管理画面**: https://97fdf32d-665b-47ba-ae39-073216cebef5.vip.gensparksite.com/admin
- **ホスティング**: Genspark 管理の Cloudflare（Workers for Platform）+ D1

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

**本番パスワード: `KurashiLog2026!`** / ローカル開発は `admin1234`（`.dev.vars`）

### パスワードの変更方法（本番）
サンドボックスのターミナルで下記1行を実行するだけです（再デプロイ不要・即時反映）。
```bash
gsk hosted secret_put --name ADMIN_PASSWORD --value '新しいパスワード'
```
- 設定済みのシークレット名の確認: `gsk hosted secret_list`（値は仕様上読み出し不可）
- ローカル開発用は `.dev.vars` の `ADMIN_PASSWORD=` を書き換え → `pm2 restart webapp`
- セッション署名鍵 `SESSION_SECRET` も同じ方法で変更可能（変更すると既存ログインは無効化されます）

### サイト名・キャッチコピーの変更方法
`src/lib/config.ts` の `SITE` を書き換えるだけで、ヘッダー・フッター・タイトル・OGP・sitemap すべてに反映されます。
```ts
export const SITE = {
  title: 'Kurashi Log',            // ← サイト名（ロゴ / <title> / フッター）
  caption: 'MONEY · LIFE · RIDE · IT', // ← ロゴ下の小さな英字
  subtitle: 'お金・暮らし・バイク・スーパー・IT の記録',
  author: 'Owner',
  description: '…'                  // ← 検索結果 / SNS共有時の説明文
}
```
変更後: `npm run build` → `gsk hosted deploy`（承認）で本番に反映。
カテゴリ名やアクセント色も同ファイルの `CATEGORIES` で変更できます。

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
- **プラットフォーム**: Genspark 管理の Cloudflare（Workers for Platform）+ D1
- **状態**: ✅ 稼働中
- **本番URL**: https://97fdf32d-665b-47ba-ae39-073216cebef5.vip.gensparksite.com
- **D1**: `97fdf32d-…-db`（スキーマ適用済み / サンプル記事12本・タグ17件・月次12ヶ月を投入済み）
- **シークレット**: `ADMIN_PASSWORD`, `SESSION_SECRET` を設定済み

### 更新（再デプロイ）手順
```bash
npm run build                 # dist を作り直す
gsk hosted deploy             # 承認ダイアログで Approve
```
本番DBの確認・操作:
```bash
gsk hosted d1_query   --sql "SELECT slug,title FROM posts ORDER BY published_at DESC"
gsk hosted d1_execute --sql "DELETE FROM posts WHERE slug='xxx'"   # 記事は管理画面からの操作を推奨
```

## デザイン方針（黒基調 × オレンジアクセント）
「シンプル・見やすい・魅せる」を軸に、深い黒をベースにオレンジのアクセントを効かせたダークテーマです。

- **配色**: ベース `#0a0a0b` / パネル `#121214` `#18181b` / 罫線 `rgba(255,255,255,.06〜.10)` / 文字 `#f5f5f7` `#a1a1aa` / アクセント **オレンジ `#f97316`**
- **カテゴリ色（ダーク最適化）**: 資産運用 `#34d399` / 日常の生活 `#fbbf24` / ツーリング `#fb923c` / ご当地スーパー `#fb7185` / IT `#a78bfa`
- **ナビ**: 高さ64pxの固定バー。リンクはピル型で、現在地はオレンジ塗り。左端はオレンジの角丸ロゴ＋小さな英字キャプション
- **ヒーロー**: 全幅の写真を暗いグラデーションで覆い、左寄せコピー。見出しの一語だけをオレンジに。CTAはオレンジ＋ゴーストの2ボタン、下にガラス調の数値パネル
- **タイポグラフィ**: システムフォント（SF Pro / Hiragino Sans）、見出しは 28〜60px の太字、本文 17〜19px
- **レイアウト**: 中央寄せ 1120px（本文は 720px）、セクションごとに `#0a0a0b` と `#121214` を交互に置いてリズムを作る
- **構成（動線）**: ヒーロー → テーマ一覧 → 資産/生活（数字＋グラフ） → ツーリング（横スクロール） → スーパー → IT → 新着
- **演出**: IntersectionObserver によるフェードアップ（`.reveal`）、ヒーローの段階表示（`.hero-line` / `.hero-media`）、`prefers-reduced-motion` 対応
- **グラフ / 地図**: Chart.js はダーク背景用の配色（総資産はオレンジ）、Leaflet は CARTO **Dark** タイル＋カテゴリ色のピン
- **管理画面**: 公開側と同じ黒基調。サイドバーの現在地・保存ボタン・地図ピッカーもオレンジで統一

## 技術スタック
Hono + TypeScript(JSX SSR) / Cloudflare Pages + D1 / Tailwind CSS(CDN) / Chart.js / Leaflet + OpenStreetMap(CARTO Dark) / marked

## 今後の拡張候補
- R2 バインドを有効にして管理画面から画像を直接アップロード
- 記事の予約公開、閲覧数の集計表示
- ツーリングのGPXルート表示、スーパーの商品単価データベース
- RSS配信、OGP画像の自動生成

_Last Updated: 2026-08-03_

## 今回の追加機能（v3）

### 1. 画像アップロード（Cloudflare R2）
- `wrangler.jsonc` に R2 バインディング `webapp-media` を追加
- 管理画面から直接アップロード可能
  - **カバー画像**：点線の枠をクリックしてファイル選択
  - **現地の写真**：各写真行の「アップロード」ボタン
  - **本文内の画像**：ツールバーの「画像挿入」→ カーソル位置に `![name](url)` を挿入
- API: `POST /api/admin/upload`（10MBまで）→ `/media/<key>` を返す
- 配信: `GET /media/*`（1年キャッシュ）

### 2. Search Console / Google Analytics / AdSense
`src/lib/config.ts` の `SEO` に値を入れるだけで全ページに反映されます（空文字ならタグは出力されません）。

| 項目 | 設定キー | 取得場所 |
|---|---|---|
| Search Console 所有権確認 | `googleSiteVerification` | Search Console →「HTMLタグ」の content 値 |
| Google Analytics 4 | `gaMeasurementId` | GA4 → データストリーム（`G-XXXXXXXXXX`） |
| Google AdSense 自動広告 | `adsensePublisherId` | AdSense（`ca-pub-...`） |

あわせて SEO 強化：全ページに canonical / og:url / og:site_name / Twitter Card、`/sitemap.xml` に `lastmod` `changefreq` `priority` とタグURLを追加。

### 3. 詳細ページの構成（ツーリング / ご当地スーパー）
- ヒーロー：カバー画像＋パンくず（ホーム / カテゴリ / 地名）＋大見出し＋メタ行（エリア・日付・ジャンル・星）
- 2カラム：左＝本文、右＝スティッキーな **RIDE DATA**（ツーリング）/ **SHOP DATA**（スーパー）カード
- `PHOTOS 現地の写真` セクション、`ROAD NOTE` 注意ボックス、タグピル
- **LOCAL STOP**：ツーリング記事 ⇄ スーパー記事の相互リンクカード（推し買いボックス・地図ボタン付き）
  - どちらか一方に紐付けを設定すれば、逆方向も自動で表示されます

新しく追加した記事フィールド（migration `0002_detail_fields.sql`）:

| カラム | 用途 |
|---|---|
| `genre` | 峠・ワインディング / 郊外型スーパー など |
| `area` | 東北・中部など（`prefecture` と組で「中部 / 長野県」） |
| `best_season` | ベストシーズン（ツーリング） |
| `road_note` | 路面・冬季通行止めなどの注意事項 |
| `recommend_items` | 推し買い（改行 or `/` 区切り） |
| `access_text` | スーパーへのアクセス |
| `linked_slug` | ツーリング ⇄ スーパーの相互リンク |

### 4. サイト構成のモダン化
- グローバルナビを7項目 → **ホーム / お金の記録（ホバーで資産運用・日常の生活）/ ツーリング記録 / ご当地スーパー / IT・生成AI / エリア別 / 検索** に整理
- カバー画像が無かった7記事に Wikimedia Commons の CC / パブリックドメイン画像を設定

---

## v4 変更（テーマ再編 + 読み物向けデザイン）

### 1. サイト構成：5カテゴリ → 3テーマ
| テーマ | URL | 配下カテゴリ |
|---|---|---|
| Money | `/theme/money` | 資産運用・生活費 |
| Touring | `/theme/touring` | ツーリング記録・ご当地スーパー |
| Tech | `/theme/tech` | 業務効率化 |

- テーマページ内の「サブカテゴリタブ」で絞り込み（例 `/theme/touring?cat=supermarket`）
- 旧URL `/category/:key` は **301リダイレクト**（SEO評価を引き継ぎ）
- `/about` は自己紹介記事へ自動転送（`config.ts` の `ABOUT_POST_SLUGS` で指定）

### 2. 文言整理
- 「社内SE」「情シス」をサイト全体から削除（ソース + DB）
- Tech の見出しを「手作業を、自動化する。」へ
- 説明文を「Excel・Python・BIツールで作業時間を削った記録。再現できる形で書いています。」へ
- DB内の既存記事は `migrations/0003_wording_cleanup.sql` で一括置換

### 3. 空セクションの扱い
- 記事0件のテーマはトップページに**セクションごと非表示**
- 走行距離・都道府県・ログ数などのカウンターは**値が0なら非表示**（全て0ならブロック自体が消える）
- 「記事はまだありません」の文言と**管理画面リンクを公開ページから完全に撤去**
- 管理画面は `/admin` を直接開くか、`robots.txt` で除外済み

### 4. ナビゲーション
- 画面上部に**固定ヘッダー**（左: サイト名 / 右: Money・Touring・Tech・About + 検索）
- モバイルは**ハンバーガーメニュー**（全画面）

### 5. セクション順
ヒーロー → **新着記事（最大6件）** → カテゴリ別 → About
ヒーロー直下に「はじめての方はこちら」導線を1つだけ配置

### 6. デザイン方向（ブログ／ドキュメント寄り）
- **左揃えベース**（中央揃えを廃止）、セクション全画面表示をやめて余白を約半分に圧縮
- 見出しサイズを2段階縮小（h1 38px→36px、h2 40px→23px）
- 記事一覧は**カード型グリッド**（PC3列 / タブレット2列 / モバイル1列）
- 各カードに**カテゴリバッジ・日付・タイトル・リード文2行**＋カテゴリ固有の数値
- **アクセントを1色（`#f97316`）に統一**（管理画面と同色）
- フォント: 日本語 **Noto Sans JP** / 数字 **Roboto Mono（等幅・tabular-nums）**
- 金額・基準価額は大きく表示し「数字で記録するサイト」を前面に

---

## v5 変更（管理画面の入力設計 / About独立 / SEO強化）

### ① 月次データの入力設計
- **総資産の手入力欄を廃止**。「現金・預金／NISA評価額／iDeCo評価額」の3項目だけを入力し、総資産は**合計として自動計算**。
- **前月比も自動計算**（前月行との差分）。入力中にリアルタイム表示。
- 一覧に**「不一致」バッジ**を追加。総資産と内訳の合計がずれている行を警告表示（編集→保存で自動的に整合）。
- 行の**個別削除**に加え、**まとめて削除**を追加（`2025-12~2026-07` のような範囲指定可）。
- グラフは**2行でも1行でも破綻しない**実装に変更（1点ならドット表示、2点なら直線、0件なら案内文）。
- 記事本文で使える**ショートコード**を追加：`{{total_assets}}` `{{cash}}` `{{nisa}}` `{{ideco}}` `{{living_cost}}` `{{diff}}` `{{updated}}` `{{ym}}`。管理画面のボタンから挿入でき、表示時に最新値へ置換されるため記事の数字とトップの数字がずれない。

### ② About の重複解消
- `/about` を**固定ページとして独立**（プロフィール・資産構成・投資方針6項目・3テーマ）。資産額は月次データから自動表示。
- 末尾に「**詳しい経緯はこちら**」で `/posts/post-mtzu8ga8` へリンク。
- トップの導線2本（「はじめての方はこちら」「運営者について読む」）を**どちらも `/about`** に変更。
- `sitemap.xml` に `/about` を追加。

### ③ 空ページとテーマ宣言
- `/theme/tech` に他テーマと同じ**空ステートボックス**を追加（他テーマへの導線つき）。
- `/map` はピン0件時に「**記事が増え次第、順次追加します**」を表示。Leaflet も読み込まない。
- **フッター／モバイルメニューの「エリア別マップ」は、ピン1件以上になるまで非表示**。
- トップ本文・フッター説明文を**3テーマ構成に統一**（Money／Touring／Tech）。
- ヒーローの「Personal Record」を**「Kurashi Log」に統一**。
- **「公開記事」カウンタは10件に達するまで非表示**。

### ④ 記事テンプレート
- メタに**最終更新日**を追加（公開日と異なる場合のみ表示。管理画面の編集日時を自動反映）。
- 末尾に「**次に読む**」（同テーマから2件）を自動表示。
- 末尾に**定型の免責文**を自動挿入。
- ツーリング・ご当地スーパーの記事カードは**サムネイル枠を必ず表示**（画像未登録でもプレースホルダー）。

### ⑤ SEO・技術
- **og:image を生成**し全ページに設定（`public/og.png` 1200×630）。`twitter:card` は `summary_large_image`。
- 記事ページの `og:type` を **article** にし、`article:published_time` / `article:modified_time` を追加。
- **JSON-LD** を追加：トップ=WebSite、記事=BlogPosting+BreadcrumbList、/about=Person+BreadcrumbList、テーマ=CollectionPage+BreadcrumbList、下層=BreadcrumbList。
- **sitemap.xml を整理**：記事0件のテーマと `/tags/*` を除外、全URLに `lastmod` を付与、`/about` を追加。
- **RSS（`/rss.xml`）** と robots.txt の整備（`/admin` `/api/` `/search` を Disallow）。
- **Tailwind CDN を廃止**し、使用クラスのみをビルドした `static/tw.css`（31KB）に差し替え。
- **Font Awesome をサブセット化**（`static/fa.css`／使用32アイコンのみ、webフォント読み込みなし）。
- **favicon を PNG 化**（32/180/512 + favicon.ico + webmanifest）。絵文字SVG依存を解消。

### 画像・CSSの再生成
```bash
npm run build:img   # OG画像・ファビコンを生成
npm run build:css   # Tailwind + Font Awesomeサブセットを生成
npm run build       # build:css を含むフルビルド
```
