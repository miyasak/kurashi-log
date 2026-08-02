-- 記事テーブル（5カテゴリ共通 + カテゴリ固有カラム）
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,               -- asset | life | touring | supermarket | it
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL DEFAULT '',        -- Markdown
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | published
  featured INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,

  -- 位置情報（ツーリング / ご当地スーパー）
  place_name TEXT,
  prefecture TEXT,
  address TEXT,
  lat REAL,
  lng REAL,

  -- ツーリング固有
  distance_km REAL,
  duration_text TEXT,
  weather TEXT,
  bike TEXT,
  route_text TEXT,

  -- ご当地スーパー固有
  rating INTEGER,        -- 総合 1-5
  cospa INTEGER,         -- コスパ 1-5
  budget INTEGER,        -- 会計額(円)
  visit_date TEXT,
  business_hours TEXT,

  -- 資産運用 / 生活費 固有
  highlight_label TEXT,  -- 例: 総資産, 今月の生活費
  highlight_value TEXT,  -- 例: 12,340,000円
  highlight_sub TEXT,    -- 例: 前月比 +120,000円

  meta TEXT,             -- 予備 JSON
  views INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);

-- タグ
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);

-- 記事内フォトギャラリー
CREATE TABLE IF NOT EXISTS post_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_post_photos_post ON post_photos(post_id);

-- 月次の資産 / 生活費データ（グラフ表示用）
CREATE TABLE IF NOT EXISTS monthly_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ym TEXT UNIQUE NOT NULL,             -- YYYY-MM
  total_assets INTEGER,                -- 総資産
  nisa_value INTEGER,                  -- NISA評価額
  nisa_contribution INTEGER,           -- NISA累計投資額
  ideco_value INTEGER,                 -- iDeCo評価額
  ideco_contribution INTEGER,          -- iDeCo累計拠出額
  cash INTEGER,                        -- 現金
  other INTEGER,                       -- その他資産
  income INTEGER,                      -- 手取り収入
  living_cost INTEGER,                 -- 生活費合計
  expense_json TEXT,                   -- 費目内訳 JSON {"家賃":70000,...}
  memo TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- サイト設定（プロフィール等）
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
