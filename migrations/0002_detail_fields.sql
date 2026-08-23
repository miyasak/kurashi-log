-- 詳細ページ強化用フィールド（ツーリング / ご当地スーパー）
-- キャプチャ構成の「RIDE DATA」「推し買い」「LOCAL STOP」に対応

-- 共通：ジャンル（例: 峠・ワインディング / 海沿い / 郊外型スーパー）
ALTER TABLE posts ADD COLUMN genre TEXT;

-- 共通：エリア（例: 東北）※ prefecture と組み合わせて「東北 / 福島県」表示
ALTER TABLE posts ADD COLUMN area TEXT;

-- ツーリング：ベストシーズン（例: 5月〜10月（紅葉は10月上旬））
ALTER TABLE posts ADD COLUMN best_season TEXT;

-- ツーリング：路面 / 注意事項（冬季通行止め等）
ALTER TABLE posts ADD COLUMN road_note TEXT;

-- スーパー：推し買い（改行 or / 区切りで複数）
ALTER TABLE posts ADD COLUMN recommend_items TEXT;

-- スーパー：アクセス（例: 常磐道いわき湯本ICから10分）
ALTER TABLE posts ADD COLUMN access_text TEXT;

-- 相互リンク：この記事に紐づく別記事の slug
-- ツーリング記事 → 寄ったスーパー記事 / スーパー記事 → そのツーリング記事
ALTER TABLE posts ADD COLUMN linked_slug TEXT;

CREATE INDEX IF NOT EXISTS idx_posts_linked_slug ON posts(linked_slug);
CREATE INDEX IF NOT EXISTS idx_posts_genre ON posts(genre);
