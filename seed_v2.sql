-- 新フィールドのサンプル投入（キャプチャ相当のデータで詳細ページを検証）
-- 既存12記事の touring / supermarket に新項目を補完する

-- ツーリング記事：ジャンル・エリア・ベストシーズン・路面注意
UPDATE posts SET
  area = '中部', genre = '峠・ワインディング',
  best_season = '6月〜10月（新緑は6月上旬）',
  road_note = '冬季通行止め（11月中旬〜4月下旬）。朝夕は霧が出やすく、視界が落ちるのでライトは常時点灯で。'
WHERE slug = 'touring-venus-line';

UPDATE posts SET
  area = '北海道', genre = '丘・パノラマロード',
  best_season = '6月〜9月（ラベンダーは7月中旬）',
  road_note = '観光シーズンは農道に観光車両が多く、砂利の浮きに注意。農作業車優先で。'
WHERE slug = 'touring-biei';

UPDATE posts SET
  area = '四国', genre = '海沿い・岬',
  best_season = '4月〜11月（椿は2月〜3月）',
  road_note = '足摺岬周辺は道幅が狭く落石あり。強風時は横風に注意。'
WHERE slug = 'touring-ashizuri';

-- ご当地スーパー記事：ジャンル・エリア・アクセス・推し買い
UPDATE posts SET
  area = '北海道', genre = '地場系スーパー',
  access_text = '道央自動車道 札幌ICから15分／無料駐車場あり',
  recommend_items = '朝どれホタテの刺身
夕張メロンのカット
ジンギスカン用ラム肩ロース'
WHERE slug = 'super-hokkaido';

UPDATE posts SET
  area = '中部', genre = '郊外型スーパー',
  access_text = '中央道 諏訪ICから10分／大型駐車場あり',
  recommend_items = '信州味噌の量り売り
おやき（野沢菜）
安曇野産わさびの生おろし'
WHERE slug = 'super-nagano';

UPDATE posts SET
  area = '四国', genre = '産直併設スーパー',
  access_text = '高知自動車道 高知ICから20分／バイク置き場あり',
  recommend_items = '藁焼きカツオのたたき
四方竹の水煮
ぼうしパン'
WHERE slug = 'super-kochi-sunny';

-- 相互リンク（ツーリング ⇄ スーパー）
UPDATE posts SET linked_slug = 'super-nagano'      WHERE slug = 'touring-venus-line';
UPDATE posts SET linked_slug = 'super-hokkaido'    WHERE slug = 'touring-biei';
UPDATE posts SET linked_slug = 'super-kochi-sunny' WHERE slug = 'touring-ashizuri';

-- 資産 / 生活 / IT にもジャンルを付与
UPDATE posts SET genre = '月次レポート' WHERE category IN ('asset','life');
UPDATE posts SET genre = '実務ノウハウ' WHERE category = 'it';

-- ▼ カバー画像（すべて Wikimedia Commons の CC / パブリックドメイン画像）
UPDATE posts SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Interior_of_Supermarket_in_Japan_02.jpg/1280px-Interior_of_Supermarket_in_Japan_02.jpg'
  WHERE slug = 'super-nagano';                -- CC BY-SA 3.0
UPDATE posts SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/The_Entrance_of_Tokyo_Stock_Exchange_Main_Building_20240329.jpg/1280px-The_Entrance_of_Tokyo_Stock_Exchange_Main_Building_20240329.jpg'
  WHERE slug = 'asset-2026-07';               -- CC0
UPDATE posts SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Trading_apps_on_an_iPhone_screen.jpg/1280px-Trading_apps_on_an_iPhone_screen.jpg'
  WHERE slug = 'nisa-growth-quota';           -- CC BY 2.0
UPDATE posts SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Pocket_calculator.jpg/1280px-Pocket_calculator.jpg'
  WHERE slug = 'life-cost-2026-07';           -- CC BY-SA 4.0
UPDATE posts SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/MotoEqipments_HelmetBootsJacketAndGloves.jpg/1280px-MotoEqipments_HelmetBootsJacketAndGloves.jpg'
  WHERE slug = 'cospa-gear-2026';             -- CC BY-SA 4.0
UPDATE posts SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Macro_laptop_coding_%28Unsplash%29.jpg/1280px-Macro_laptop_coding_%28Unsplash%29.jpg'
  WHERE slug = 'genai-in-house-se';           -- CC0
UPDATE posts SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Technician_with_laptop_working_on_server_rack_at_NERSC.jpg/1280px-Technician_with_laptop_working_on_server_rack_at_NERSC.jpg'
  WHERE slug = 'it-asset-inventory';          -- CC0
