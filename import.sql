PRAGMA defer_foreign_keys = true;
-- gsk hosted d1_export — schema + data
CREATE TABLE "d1_migrations"(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE monthly_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ym TEXT UNIQUE NOT NULL,             
  total_assets INTEGER,                
  nisa_value INTEGER,                  
  nisa_contribution INTEGER,           
  ideco_value INTEGER,                 
  ideco_contribution INTEGER,          
  cash INTEGER,                        
  other INTEGER,                       
  income INTEGER,                      
  living_cost INTEGER,                 
  expense_json TEXT,                   
  memo TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE TABLE post_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,               
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL DEFAULT '',        
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft', 
  featured INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,

  
  place_name TEXT,
  prefecture TEXT,
  address TEXT,
  lat REAL,
  lng REAL,

  
  distance_km REAL,
  duration_text TEXT,
  weather TEXT,
  bike TEXT,
  route_text TEXT,

  
  rating INTEGER,        
  cospa INTEGER,         
  budget INTEGER,        
  visit_date TEXT,
  business_hours TEXT,

  
  highlight_label TEXT,  
  highlight_value TEXT,  
  highlight_sub TEXT,    

  meta TEXT,             
  views INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
, genre TEXT, area TEXT, best_season TEXT, road_note TEXT, recommend_items TEXT, access_text TEXT, linked_slug TEXT);
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);
CREATE INDEX idx_post_photos_post ON post_photos(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_genre ON posts(genre);
CREATE INDEX idx_posts_linked_slug ON posts(linked_slug);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_status ON posts(status);
INSERT INTO "d1_migrations" ("id", "name", "applied_at") VALUES (1, '0001_initial_schema.sql', '2026-08-03 14:32:00');
INSERT INTO "d1_migrations" ("id", "name", "applied_at") VALUES (2, '0002_detail_fields.sql', '2026-08-23 11:01:01');
INSERT INTO "d1_migrations" ("id", "name", "applied_at") VALUES (3, '0003_wording_cleanup.sql', '2026-09-28 05:20:53');
INSERT INTO "monthly_stats" ("id", "ym", "total_assets", "nisa_value", "nisa_contribution", "ideco_value", "ideco_contribution", "cash", "other", "income", "living_cost", "expense_json", "memo", "created_at", "updated_at") VALUES (13, '2026-10', 22820103, 9695676, NULL, 677390, 547620, 12447037, NULL, NULL, NULL, NULL, '2026年10月9日時点。資産額は各金融機関の当日評価額。
従業員持株会119,001円は別管理（売却・入金時に現金へ反映）。
', '2026-10-09 08:53:53', '2026-10-09 08:53:53');
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (166, 17, '/media/uploads/1792851415574-ma6ob9.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (167, 17, '/media/uploads/1792851424136-vm110u.png', '', 1);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (168, 18, '/media/uploads/1792851372943-u5bqha.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (169, 19, '/media/uploads/1792851305187-b1hsg2.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (170, 20, '/media/uploads/1792851259407-37hojh.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (171, 21, '/media/uploads/1792850828318-fkl960.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (172, 21, '/media/uploads/1792850834898-p8e6u9.png', '', 1);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (173, 22, '/media/uploads/1792851497030-ms363r.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (187, 23, '/media/uploads/1792851840407-br5qu9.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (188, 23, '/media/uploads/1792851884293-5s4ijs.png', '', 1);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (542, 44, '/media/uploads/1793580120222-i6ztps.png', '', 0);
INSERT INTO "post_photos" ("id", "post_id", "url", "caption", "sort_order") VALUES (543, 44, '/media/uploads/1793580123891-vfinfw.png', '', 1);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (16, 77);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (16, 101);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (16, 102);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (16, 103);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (14, 76);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (14, 77);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (14, 78);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (14, 79);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (27, 417);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (27, 482);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (27, 483);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (17, 182);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (17, 183);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (18, 182);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (18, 186);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (19, 182);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (19, 183);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (20, 182);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (20, 205);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (21, 182);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (21, 205);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (22, 182);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (22, 258);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (25, 1);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (25, 416);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (25, 417);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (28, 5);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (28, 566);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (28, 567);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (28, 568);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (26, 598);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (26, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (23, 600);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (23, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (30, 10);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (30, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (31, 10);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (31, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (33, 9);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (33, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (29, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (29, 596);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (34, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (34, 648);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (36, 5);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (36, 692);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (37, 4);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (37, 704);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (37, 705);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (37, 707);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (37, 708);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (38, 729);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (38, 730);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (38, 731);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (38, 732);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (38, 733);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (40, 1);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (40, 2);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (40, 729);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (40, 730);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (40, 746);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (40, 754);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (41, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (41, 258);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (39, 2);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (39, 730);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (39, 745);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (39, 746);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (39, 747);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (45, 831);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (45, 879);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (45, 916);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (45, 917);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (45, 918);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (45, 974);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (44, 9);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (44, 879);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (44, 880);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (44, 881);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (44, 974);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (44, 979);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (44, 991);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (43, 9);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (43, 831);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (43, 832);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (43, 833);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (43, 834);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (43, 986);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (43, 1106);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (42, 9);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (42, 256);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (35, 668);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (35, 669);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (35, 973);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (35, 974);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (35, 991);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (32, 10);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (32, 657);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (32, 658);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (32, 659);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (32, 660);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (32, 661);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (32, 974);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (24, 205);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (24, 284);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (24, 300);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (24, 301);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (24, 974);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (24, 991);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (46, 831);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (46, 879);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (46, 921);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (46, 922);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (46, 923);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (46, 924);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (46, 974);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (47, 258);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (47, 831);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (47, 926);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (47, 928);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (47, 929);
INSERT INTO "post_tags" ("post_id", "tag_id") VALUES (47, 974);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (14, 'post-mtzu8ga8', 'asset', '資産2万円から2000万超へ。41歳の会社員が60歳で1億円を目指す話', 'かつて貯金が2万円だった会社員が、14年かけて2,000万円を作りました。特別なことは何もしていません。オルカン一本で60歳1億円を目指す記録です。', 'はじめまして。41歳、独身、会社員です。都内で一人暮らしをしながら、60歳で資産1億円を目指しています。現在の総資産は{{total_assets}}、目標の23%です。

先に言っておくと、特別な経歴は何もありません。専門学校卒、年収は600万円ほど。事業もやっていないし、相続もありません。使っているのは誰でも同じ条件で使える制度と、19年という時間だけです。

だから同じことは、たぶん多くの人にできます。それを確かめるために、この記録を書きます。

## 貯金が2万円になった日

社会人になって最初に就いたのは、夜勤のある現場の仕事でした。月収は19万円。数年後にリストラに遭い、職を失いました。

そのとき通帳に残っていたのが2万円です。実家にいたので路頭に迷わずに済みましたが、貯金の習慣も、金融の知識も、何もありませんでした。

そこからは派遣として数年働き、その後に転職して少しずつ年収を上げていきました。420万円、540万円、そして今の600万円前後。飛躍ではなく、5年単位でじわじわ上げただけです。

## 39歳で家を出た時点で、2,000万円を超えていた

実家を出たのは39歳のときです。2万円から数えて14年かかりました。褒められる話ではありませんが、実家にいた期間が資産形成に決定的に効いたのは事実なので、書いておきます。

今は都内で1K・30㎡の部屋に住んでいます。家賃は55,000円、基本生活費は月14万円（年数回の出費を含めると月18万円相当）。バイクを屋根付きの駐輪場に無料で置けることが、この部屋を選んだ理由でした。

節約家に見えるかもしれませんが、我慢はしていません。酒もたばこもギャンブルもやらず、欲しいものが特にないだけです。旅行は一般道をバイクで走り、無料のキャンプ場に泊まって、夕食はその土地のスーパーで買います。これが一番面白いからやっています。

## 現在の内訳

| 区分 | 金額 |
|---|---|
| 現金・預金 | {{cash}}|
| NISA | {{nisa}}|
| iDeCo |  {{idceo}} |
| **合計** | {{total_assets}} |

現金が多く見えますが、これはNISAの生涯投資枠を来年から3年ほどで埋めるための待機資金です。生活防衛資金と、2028年にバイクを買い替える資金も含んでいます。

このほかに従業員持株会があります。3か月ごとに売却して全世界株式に移す運用なので、長く持つ資産ではなく、投資資金を作るための通り道という位置づけです。そのため上の表には入れていません。

## 目標は1億円。年3%でも届く設計にした

やっていることはひとつだけです。全世界株式のインデックスファンド、いわゆるオルカンを買い続ける。それだけです。

新規の買付は全世界株式1本に絞っています。ただし始めた当初に選んだS&P500と先進国株式が、みずほNISAとiDeCoに残っています。売却益を出して枠を無駄にしたくないので、売らずに置いたまま、新しい資金だけを全世界株式に入れる形にしました。分散の判断を19年続けて全部正解できる自信がないので、これ以上は増やしません。

計算も単純です。今の{{total_assets}}に毎年の投資額を19年積み上げて、年3〜5%で増えると仮定する。それで1億円に届きます。年7%のような都合のいい数字は使っていません。**年3%でも届くように作ってあります。**

必要な追加投資は年240万円ほど。給料から出せるのが年50万円、従業員持株会の売却金が年200万円前後なので、今の収入のまま届く範囲に収まっています。昇給も副業も前提に入れていません。

つまりこれは、うまくいけば達成できる目標ではなく、普通にいけば達成できる目標です。ここが大事だと思っています。

やるべきことは「やめないこと」だけ。19年あれば3割4割下がる局面は必ず来るので、そのとき売らずにいられる金額しか入れません。ツーリング代を削って投資額を増やすようなことはしません。続けられない金額を入れるのが、一番大きなリスクだからです。

## このブログに書くこと

毎月の進捗、生活費の実際の内訳、制度の使い分け。それと、バイクで走った道と、その土地の数字の記録です。

派手な話は出てきません。月に数%増えたとか減ったとか、それを19年続けるだけです。

ただ、貯金2万円だった人間が60歳で1億円に届いたなら、それは誰かの役に立つ記録になると思っています。

現在{{total_assets}}、達成率23%。ここから始めます。

<a href="/posts/nav-down" style="display:block;border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:16px 18px;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.1);background:#121214;"><span style="display:block;font-size:11px;letter-spacing:0.14em;color:#f97316;font-weight:700;">関連記事</span><span style="display:block;margin-top:6px;font-size:14.5px;line-height:1.6;color:#f5f5f7;font-weight:700;">オルカンが下がった。でも口数は1口も減っていない事実</span><span style="display:block;margin-top:6px;font-size:12.5px;line-height:1.7;color:#a1a1aa;">買った直後に下がったとき、19年後の金額はどうなるのか</span></a>', '/media/uploads/1791541237077-hc9xlu.png', 'published', 0, '2026-09-13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '総資産', '', '', NULL, 0, '2026-09-13 13:16:36', '2026-10-25 09:29:15', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (16, 'nav-down', 'asset', 'オルカンが下がった。でも口数は1口も減っていない事実', '基準価額が19,250円から19,127円に下がった。評価額は減ったのに、持っている口数は1口も減っていない。下落と複利の関係を、自分が納得できるまで整理した。', '先日、成長投資枠で楽天・プラス・オールカントリーを50万円分買った。そのときの基準価額は19,250円。数日後に見たら19,127円になっていた。

金額にすると約3,200円のマイナス。大きな額ではないが、初めて「買った直後に下がる」を経験したので、これが将来にどう影響するのかを調べた。

## 減ったのは評価額で、口数は減っていない

投資信託を買うと、手元に残るのは「口数」だ。

19,250円のときに50万円で買ったので、約259,740口を持っている。基準価額が19,127円に下がった今も、持っている口数は259,740口のままだ。**1口も減っていない。**

減ったのは「今売ったらいくらになるか」という評価額だけだった。当たり前のことだが、これを実感として理解しているかどうかは、たぶん大きな差になる。

## 19年後の金額に、今日の価格は入らない

19年後に売るときの金額は、こう決まる。

**持っている口数 × そのときの基準価額**

この式に、今日の19,127円は出てこない。途中で15,000円まで下がっても、25,000円まで上がっても、19年後の計算には一切入らない。

途中の値動きが結果に残るのは、その途中で売ったときだけだ。売らなければ、通った道は結果に関係ない。

## 複利は後半に効く

複利は「増えた分にも、さらに増える」という仕組みだ。

10万円が年5%で増えると、1年目は5,000円増えて10万5,000円。2年目は10万5,000円に対して5%がつくので5,250円増える。3年目は5,512円。毎年、増え方そのものが太っていく。

これを19年続けると、10万円は約252,700円になる。毎年5,000円ずつ単純に増える場合は195,000円なので、**結果が3割ほど変わる。** しかも増えた152,700円のうち、6割近くが後半の9年半に集中している。

つまり、大事なのは利回りを上げることより**期間を短くしないこと**だった。

15年でやめた場合も計算してみた。15年時点で約207,890円。19年まで持った場合との差は約44,800円で、**増えた分の約3割**にあたる。一番太っている最後の4年だけを、まるごと捨てる計算になる。

## むしろ、これから買う分には有利だった

もう一つ気づいたことがある。

残りの成長投資枠30万円を買うとき、19,250円なら約155,844口、19,127円なら約156,846口になる。**同じ30万円で約1,000口多く買える。**

19年後の基準価額が40,000円になっていたとしたら、この1,000口は約4,000円の差。下がってくれたおかげで、少し得をしたことになる。

これから19年間、買い続ける側にいるあいだは、価格が低い期間のほうが口数を増やせる。買い増しの途中にいる人にとって、下落は損失ではなく仕込める期間だった。

## 為替のことも知っておく

もう一つ、見落としていた点がある。基準価額は円で表示されているので、**円高になると、世界の株価が上がっていても基準価額は下がる。**

実際、2026年8月以降の伸び悩みは株価ではなく円高が主な原因だった。8月から円高ドル安・円高ユーロ安が進み、外国株式ファンドの評価額が伸び悩んだという整理は、証券会社のレポートでも同じことが書かれている。9月8日には一時152円台まで円高が進む場面もあった。

株そのものの価値は変わっていないのに、円に換算した数字だけが下がった形だ。オルカンは外国株の集まりなので、この影響からは逃げられない。ここは仕組みとして受け入れる部分だと考えている。

## 結論として、やることは何もない

調べてわかったのは、下落で複利が壊れることはないということだった。壊れるのは、売ったときと、やめたときだけだ。

ただし、ここは正確に書いておく。**下落そのものが得なのではない。** 19年後の基準価額が低ければ、結果はやはり減る。言えるのは「買い続けている期間の下落は、口数という形で取り返せる」というところまでだ。途中の価格が結果に入らないことと、安く買えることは別の話で、それを混ぜると楽観が過ぎる。

そのうえで、予定どおり買って、基準価額は年に一度、自分の誕生月にだけ見ることにした。毎日見ても口数は増えないので、見る意味がない。

19年後の基準価額は、想定として40,000円くらいで計算している。当てる自信はないが、年3%でも目標に届く設計にしてあるので、外れても問題ない数字だ。

予想を当てる必要がない計画にしておくことが、たぶん一番の安全策だと思っている。

<a href="/posts/post-mvnhccx3" style="display:block;border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:16px 18px;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.1);background:#121214;"><span style="display:block;font-size:11px;letter-spacing:0.14em;color:#f97316;font-weight:700;">関連記事</span><span style="display:block;margin-top:6px;font-size:14.5px;line-height:1.6;color:#f5f5f7;font-weight:700;">SBI新生の定期に990万円。同じ金利なら3ヶ月でいい、と思ったら違った</span><span style="display:block;margin-top:6px;font-size:12.5px;line-height:1.7;color:#a1a1aa;">買う予定のお金を、なぜ現金のまま置いているのか</span></a>', '/media/uploads/1791541191278-ha01si.png', 'published', 0, '2026-09-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'オルカン基準価額', '', '', NULL, 0, '2026-09-15 08:33:13', '2026-10-25 09:15:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (17, 'post-mvf75sr3', 'supermarket', '岩手県｜スーパーオセン 本店｜人口5,500人の町に激安スーパー', '', '岩手県西和賀町。人口5,500人ほどの山あいの町に、激安スーパーがあると聞いて寄り道した。

着いたのはAM10時頃。駐車場の車の数が、町の規模と明らかに釣り合っていなかった。

## 惣菜と刺身

生鮮、肉、魚、惣菜、飲料、弁当。棚のどこを見ても安い。特に目を引いたのはマグロのサクや刺身、それに牛肉や豚肉で、ボリュームに対する価格が良い意味で崩壊している。

ご当地スーパーも含めて各地のスーパーに寄ってきたが、この店の安さは質が違う。

イメージとしては、**ラ・ムーの価格を維持した状態で品質が高い**、と言ったところ。

## 半額観測

| 項目 | 記録 |
|---|---|
| 訪問時刻 | AM10時頃 |
| 到達段階 | 未観測（午前訪問のため） |
| 値引きの有無 | 未確認。もともとの価格が安く、値引きは限定的な可能性あり|
| 対象範囲 | 未確認 |
| その時点の残り | 棚は十分に埋まっていた |

半額を狙いに行く店ではない。**定価で買って半額相当**という方向の店なので、時間を合わせる必要がない。そこがこの店の強みでもある。

## 買ったもの

食事を済ませたばかりだったため、飲み物と湯田ヨーグルトのみ。湯田ヨーグルトは西和賀の地元産で、ここで買うのが一番それらしい。

## 客層と混雑

客は地元の岩手ナンバーが中心だが、県外ナンバーもちらほら見かけた。

場所柄だけに、レジで並ぶようなことはなかった。北上店は未訪問だが、市街地なので混雑しそうな気配はある。

## その他メモ

* **駐輪・駐車**：駐車場の端。舗装されていて段差もなし。駐車場の広さはそこまででもなさそう。
* **営業時間**：季節で変わる（夏季8:30〜19:30／冬季9:00〜19:00）。閉店が早いので日没前提で組む。
* **給油**：山の中なので前後のガソリンスタンドの位置を確認しておくことが望ましい。西和賀町内に数軒あり。
* **道**：国道107号・県道1号ともに交通量は多く、昼間なら問題なし。山間部なので夜間は動物の飛び出しに注意。
* **買い出し拠点として**：北上総合公園キャンプ場（無料）、焼地台公園キャンプ場（¥400）が射程圏内。

## この店の背景

オセンを運営する小専商店は、1942年に湯本で魚の専門店として創業し、スーパーに業態転換したのは1988年。店舗は今も湯本本店と北上店の2店舗だけだ。 

マグロのサクや刺身が目を引いたのは偶然ではなく、もともと魚屋だった店ということになる。

 人口5,500人の町で年商約20億円。横手と北上の中間という立地も含め、この店の客は町の中だけにいるわけではない。実際、駐車場のナンバーがそれを裏付けていた。

ほかのご当地スーパーは[ご当地スーパーの記事一覧](/theme/touring?cat=supermarket)にまとめてある。

※値引きの時刻や段階は、その日の売れ行きと店の判断で変わります。
この記事は上記日時の1回の観測にすぎません。', '/media/uploads/1792849940170-ebkedj.png', 'published', 0, '2026-10-19', 'スーパーオセン 本店', '岩手県西和賀町', '岩手県和賀郡西和賀町湯本30地割78番1', 39.2725, 140.764, NULL, NULL, NULL, NULL, NULL, 5, 5, NULL, '2026-05-08', '8:30-19:30', NULL, NULL, NULL, NULL, 0, '2026-10-19 11:54:43', '2026-10-25 14:17:27', '郊外型スーパー', '東北', NULL, NULL, '', '秋田自動車道　湯田ICから車で15分', '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (18, 'post-mvgkw6oa', 'supermarket', '宮城県｜ウジエスーパー 石巻山下店｜20時着、半額は貼られたあとだった', '', 'この日は東北ツーリングの帰り道で、石巻の格安ホテルに着いたのは20時頃。

普段通りローカルスーパーをGooglemapで検索したところ、ウジエスーパー石巻山下店がヒット。

スーパーに行ったのは閉店1時間前。半額シールは、もう貼られたあとだった。そして棚は、ほとんど空だった。

## 惣菜と刺身

惣菜などは殆ど売り切れていたので主役は見極められなかったが、全体的には良くある地方のローカルスーパーのイメージ。

価格も全体的には一般的。太平洋沿いということもあり、魚介系に強みはありそう。

## 半額観測

| 項目 | 記録 |
| --- | --- |
| 訪問時刻 | 20時頃（閉店21:00の1時間前） |
| 到達段階 | 半額 |
| 値引きの有無 | あり。20時時点で半額シール済み。 |
| 対象範囲 | 揚げ物や惣菜など |
| その時点の残り | ほぼ売り切れ。残っていたのは揚げ物や小さめの惣菜が中心 |

閉店1時間前は、この店では遅すぎた。半額が始まる時刻そのものは確認できていないが、20時でこの残り方なら、本番は19時台の前半と見ていい。

## 買ったもの

残っていた惣菜と、飲み物。選んで買ったというより、残っていたものを買った、という方が近い。

## 客層と混雑

閉店間近ということもあり、混雑はなし。 ただし徒歩圏にUマートやあいのやなど複数のスーパーがあるエリアなので、昼間は地元客で動いているはずだ。

## その他メモ

* **駐輪・駐車**：駐車場124台。問題なし。
* **営業時間**：9:30〜21:00。半額を狙うなら19時30分頃にスーパーに行く前提で時間を組む
* **持ち帰り**：冷蔵・冷凍ものは走行中に持ち帰れない。その場で食べるか、宿に入ってから
* **アクセス**：JR陸前山下駅から徒歩10分。駅前というより住宅地側。
* **道**：国道398号沿い。石巻警察署の向かい
* **その他**：近くに日和山公園があるので、ウジエスーパーで弁当などを購入して眺めの良いところで食べるのも良いかもしれない。（車やバイクの場合）

## この店の背景

ウジエスーパーは1947年創業、宮城県内に33店舗。県外には出ていない。

もともとは青果の卸売から始まった会社で、今も生鮮に軸足がある。

全国チェーンのように「どこでも同じ棚」を並べるのではなく、県内だけで完結している店。

ほかのご当地スーパーは[ご当地スーパーの記事一覧](/theme/touring?cat=supermarket)にまとめてある。

※値引きの時刻や段階は、その日の売れ行きと店の判断で変わります。
この記事は上記日時の1回の観測にすぎません。', '/media/uploads/1792850216259-aghgzv.png', 'published', 0, '2026-10-20', 'ウジエスーパー 石巻山下店', '宮城県石巻市', '〒986-0876 宮城県石巻市西山町2−10', 38.434128, 141.302809, NULL, NULL, NULL, NULL, NULL, 3, 3, NULL, '2026-08-16', '9:30-21:00', NULL, NULL, NULL, NULL, 0, '2026-10-20 11:06:55', '2026-10-25 14:17:47', '郊外型スーパー', '東北', NULL, NULL, '', 'JR陸前山下駅から徒歩10分', '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (19, 'post-mvgnqxcr', 'supermarket', '岩手県｜マイヤ 大船渡IC店｜三陸道の買い出し拠点として優秀', '', '三陸道で石巻へ行く途中で、気になったのでご当地ローカルスーパー、マイヤ大船渡IC店へ。

三陸道大船渡ICからすぐで、近くに安めのガソリンスタンド、オカモトセルフもあり。

この時は時間も夕方近かったので店に入っておにぎりを買った程度だが、もう少し時間をとってゆっくり店内を見てみたい。

## 惣菜と刺身

三陸沿いということもあり、海鮮系（特に刺身）が充実していた印象。価格は標準より少し安い程度だが、品質は良さそうに感じた。

## 半額観測

| 項目 | 記録 |
| --- | --- |
| 訪問時刻 | 17時頃（閉店21:30） |
| 到達段階 | 未観測（夕方訪問のため） |
| 値引きの有無 | 未確認 |
| 対象範囲 | 未確認 |
| その時点の残り | 豊富 |

まだ夕方だったので、割引等は確認できなかった。

近くにデイリーポート新鮮館大船渡店やマイヤ赤崎店、ジョイス大船渡店など複数のスーパーがあるため閉店間際の割引はありそう。マイヤの本店が大船渡にあるということもある。

## 買ったもの

おにぎり、ドリンクのみ

## 客層と混雑

IC近くということもあり、地元ナンバーだけではなく、仙台ナンバーや福島ナンバー、八戸ナンバーなど他県ナンバーも見かけた。

そのせいか人は多かったが、店内は広いため混雑さは感じなかった。

## その他メモ

* **駐輪・駐車**：余裕あり。舗装。
* **営業時間**：9:30〜21:30。ただし火曜・日曜は9:00開店、祝日は9:30開店
* **アクセス**：三陸道の大船渡ICからすぐ。国道45号沿い。
* **道**：問題なし。交通量も多い。
* **その他**：三陸道にはGSがないため下道に降りる必要がある。大船渡IC前のGSは三陸道沿いで深夜まで営業している数少ない給油ポイントで、ここを逃すと次は釜石か気仙沼になる。飲食店やスーパーも揃っているので、三陸道の補給ポイントとして優秀。

## この店の背景

マイヤは1961年創業。岩手県沿岸南部が地盤で、本社は大船渡市にある。

県内から宮城県北部まで19店舗。チェーンとしては大きくないが、この地域では生活の前提になっている店。

ほかのご当地スーパーは[ご当地スーパーの記事一覧](/theme/touring?cat=supermarket)にまとめてある。

※値引きの時刻や段階は、その日の売れ行きと店の判断で変わります。
この記事は上記日時の1回の観測にすぎません。', '/media/uploads/1792850310156-ff744z.png', 'published', 0, '2026-10-20', 'マイヤ 大船渡IC店', '岩手県大船渡市', '〒022-0006 岩手県大船渡市立根町堀之内10−1', 39.081773, 141.708404, NULL, NULL, NULL, NULL, NULL, 3, 3, NULL, '2026-08-15', '9:30-21:30', NULL, NULL, NULL, NULL, 0, '2026-10-20 12:26:48', '2026-10-25 14:18:05', '郊外型スーパー', '東北', NULL, NULL, '', '三陸道 大船渡ICから3分', '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (20, 'post-mvi4pfo2', 'supermarket', '青森県｜いとく 浪岡店｜22時閉店、20時でも半額が生きている', '', '青森の[花岡公園キャンプ場](/posts/post-mvl30i62)で連泊した。その間の主な買い出しが、いとく浪岡店だった。

同じ店に何度も通ったので、時間帯ごとの棚の変化が見えた回になった。

## 惣菜と刺身

惣菜や刺身は、関東のスーパーでは中々見かけないものが結構多かった。

価格もそこまで高くなく、品質に対してのコスパも良好と感じた。また、弁当系は基本あきたこまちのお米を使っているのも好印象。

## 半額観測

| 項目 | 記録 |
| --- | --- |
| 訪問時刻 | 20時頃（閉店22:00の2時間前）ほか、連泊中に複数回 |
| 到達段階 | 惣菜は半額、刺身は3割引 |
| 値引きの有無 | あり。ジャンルによって値引き率が分かれる |
| 対象範囲 | 惣菜＝半額／刺身＝3割引 |
| その時点の残り | 惣菜系は少なかったが、刺身は大量に残っていた |

閉店22時という遅さが効いている。20時に着いても、まだ半額の棚が生きていた。

また商品の点数も比較的多く、半額シールが貼られた瞬間になくなる、というわけでもなさそう。閉店時刻の2時間前、が一つの目安になりそうだ。

惣菜系は少し早く20時頃、刺身や寿司、弁当系はもう少し遅く21時頃が目安だろうか。

浪岡周辺には無料キャンプ場が複数あるので、夜遅めに買い出しに行くのも良さそう。

刺身が3割止まりだったのは、まだ値引きの途中だった可能性が高い。いとくは秋田市内や大館など複数店舗に足を運んだが、過去には7割引も見かけたことがある。

タイミングにもよるが、21時頃には売り切りとして半額まで進んだかもしれない。

## 買ったもの

・惣菜（唐揚げ、焼き鳥など揚げ物が中心）
・弁当（3割引）
飲料系は高め（特に大容量のペットボトル）、すぐそばにあるハッピードラッグで購入した方が安く済む。

## 客層と混雑

地元の方が多いが、お盆のタイミングということもあり他県ナンバーも含め色々な方がいた。店内は広く、レジ数も多いため混雑感はさほどない。

## その他メモ

* **駐輪・駐車**：駐車場250台。郊外型の大型店で余裕あり
* **営業時間**：9:00〜22:00。この連載で一番遅い閉店。半額狙いなら20時30分頃がベストかも
* **キャンプの買い出し拠点として**：花岡公園キャンプ場からの買い出しに使った。大体10分程度
* **道**：県道13号沿い。近くに奥羽本線があり、高架橋を跨る必要があるので注意。
* **その他**：浪岡周辺は無料キャンプ場だけではなく、500円程度でコスパの良い日帰り温泉が幾つかあるので寄ってみるのも良い（天然温泉 和ノ湯¥520、ポパイ温泉¥380など）

## この店の背景

いとくを運営する伊徳は、創業1899年、本社は秋田県大館市。

28店舗のうち22店舗が秋田で、青森は6店舗。つまり浪岡店は、秋田の会社が県境を越えて出てきた側の店になる。

ほかのご当地スーパーは[ご当地スーパーの記事一覧](/theme/touring?cat=supermarket)にまとめてある。

※値引きの時刻や段階は、その日の売れ行きと店の判断で変わります。
この記事は上記日時の1回の観測にすぎません。', '/media/uploads/1792850531335-5y6uvh.png', 'published', 0, '2026-10-21', 'いとく 浪岡店', '青森県青森市', '〒038-1331 青森県青森市浪岡大字女鹿沢東種本15−1', 40.703213, 140.576461, NULL, NULL, NULL, NULL, NULL, 3, 3, NULL, '2026-08-12', '9:00-22:00', NULL, NULL, NULL, NULL, 0, '2026-10-21 13:09:18', '2026-10-25 14:18:23', '郊外型スーパー', '東北', NULL, NULL, '', '奥羽本線 浪岡駅から徒歩10分', '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (21, 'post-mvjl1ug3', 'supermarket', '青森県｜ヤマヨ 十和田店｜地域密着の激安スーパー', '', '奥入瀬渓流の帰り道、十和田市の中心部にある「ヤマヨ 十和田店」に寄った。
激安スーパーということで、以前から気になっていたがようやく来訪することができた。

看板には「よい品をどんどん安く売る店」とある。期待して入ったが、何も買わずに出た。

## 惣菜と刺身

結論から言うと、安いとは思えなかった。

惣菜、刺身、精肉、青果。いつも見る四つの棚をひと通り回ったが、どれも「わざわざここで買う理由」が見つからなかった。青森県産のご当地商品は結構多い。

決して高くはないが、価格としてはトライアルに近い印象を持った。

ご当地スーパーに期待する「この値段でこれが買えるのか」という驚きはなかった。

ただし訪問は16時。値引きが始まる前の時間帯で、定価を見ただけだ。この店の本当の顔は、閉店前にあるのかもしれない。

代わりに面白かったのがPOPだった。手書きの札が棚のあちこちに貼ってあって、売り文句が一つひとつ違う。

ここは完全に店員さんの手作りで、見て回るだけで楽しい店だった。POPは地元でも名物らしい。

## 半額観測

| 項目 | 内容 |
|---|---|
| 訪問時刻 | 16時頃（閉店20:00） |
| 到達段階 | 未観測（夕方訪問のため） |
| 値引きの有無 | 値引きシールは見かけなかった |
| 対象範囲 | 不明 |
| 棚の状況 | ほぼ満タン |

この店は閉店20:00で、一般的なスーパーよりも若干早めだが地方のローカルスーパーとしては標準的か。

逆算すると、半額を狙うなら18時台後半から19時台に着く必要がある。16時では、どう考えても早すぎた。

## 買ったもの

なし。飲み物くらい買ってもよかったが、それも他で買えると思ってやめた。

## 客層と混雑

16時台で、店内は客で混雑していた。意外だったのは駐車場で、県外ナンバーがかなり多かった。

十和田市は奥入瀬渓流と十和田湖の玄関口で、市街地を抜けて向かう観光客やライダーが多い。

その人たちが買い出しに寄っているのだと思う。自分もその一人だった。

## その他メモ
* **駐輪・駐車**：駐車場はあるが、お客さんも相応に多いため時間帯によっては待つことになるかもしれない。
* **営業時間**：月〜土 10:00〜20:00、日曜のみ9:00開店
* **買い出し拠点として**：十和田市なので、十和田湖や奥入瀬渓流へ向かう時に利用しても良いかもしれない。道も二車線道路で快適。
* **道**：国道102号から市街地に入ってすぐ。十和田市街地なので若干混雑する可能性あり。
* **その他**：今回は奥入瀬観光の帰りに立ち寄った。この日は上北町の旅館に泊まる予定で、買い出しはヤマヨと考えていたが、結局は上北町のユニバースになった。

## この店の背景

運営は株式会社ヤマヨ十和田店。社名がそのまま店名で、この十和田店を中心に営業している地元資本のスーパーだ。

いとく（28店舗）やマイヤ（19店舗）のようなチェーンではなく、規模で勝負していない分、POPのような手作りの部分が残っているのだと思う。

地方の活性化としても、これからも末長く頑張って欲しい。

「よい品をどんどん安く売る店」の看板に対して、激安を期待して行くとズレる。ただし商品コメントPOPと青森県産の品揃えは、他では見られないものだった。

もっとも、値引きが始まる前の16時に、駆け足で回っただけの印象でもある。次はもっと時間をとって、閉店前の棚も見てみたい。

★は安さだけでなく、店としての面白さも含めた総合評価として4とした。

ほかのご当地スーパーは[ご当地スーパーの記事一覧](/theme/touring?cat=supermarket)にまとめてある。

※値引きの時刻や段階は、その日の売れ行きと店の判断で変わります。
この記事は上記日時の1回の観測にすぎません。', '/media/uploads/1792850799806-9oxsyn.png', 'published', 0, '2026-10-22', 'ヤマヨ 十和田店', '青森県十和田市', '青森県十和田市東二番町8-5', 40.61837, 141.21609, NULL, NULL, NULL, NULL, NULL, 4, 3, NULL, '2026-08-14', '10:00-20:00', NULL, NULL, NULL, NULL, 0, '2026-10-22 13:34:37', '2026-10-25 14:18:45', '郊外型スーパー', '東北', NULL, NULL, '', '', '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (22, 'post-mvl1ltys', 'supermarket', '徳島県｜ハローズ 住吉店｜閉店しない店で、半額はいつ来るのか', '', '徳島港から東京行きのオーシャン東九フェリーに乗る前、住吉の「ハローズ 住吉店」に朝10時頃に寄った。

閉店時刻のない店だ。24時間営業、年中無休。

ただ、結論を先に書くと、船に持ち込む食料はここでは買わなかった。

近くのディオで、すでに買ったあとだったからだ。

## 惣菜と刺身

朝10時なので、惣菜はまだ並び始めたところだった。

面白かったのは鮮魚で、関東では見かけない魚が普通に置いてあった。

名前を知らない魚が切り身やパックで並んでいるのを見るのが、ご当地スーパーに寄る一番の楽しみだと思う。刺身はパックが並んでいたが、朝なので値引きとは無縁。

調味料の棚でも足が止まった。馬路村のポン酢があった。

高知の村の名前がそのまま商品になっているやつで、買うかどうか10分くらい悩んで、結局やめた。

バイクの荷物を増やしたくなかったのと、帰ってから使い切る自信がなかったからだ。今でも少し後悔している。

価格については、安いという印象はなかった。ただそれは、直前に寄ったディオが安すぎたせいでもある。

## 半額観測

| 項目 | 内容 |
|---|---|
| 訪問時刻 | 朝10時頃（24時間営業・閉店なし） |
| 到達段階 | 未観測（午前訪問のため） |
| 値引きの有無 | 値引きシールは見かけなかった |
| 対象範囲 | 不明 |
| 棚の状況 | 惣菜は並び始め、鮮魚は充実 |

ここで連載の前提が崩れる。

これまでは「閉店何時か」を調べ、そこから逆算して訪問時刻を決めてきた。

いとく浪岡店は22時閉店だから20時着でも間に合い、ヤマヨ十和田店は20時閉店だから19時台が勝負、という具合だ。

ハローズは閉店しない。逆算する基準がない。24時間営業の店で値引きがいつ始まり、いつ消えるのか。朝10時に行った自分には、何も分からなかった。

トライアルも24時間営業の店舗が多いが、自分が見た範囲では19時頃には半額シールが貼られるケースも結構見受けられた。

ハローズも夜に行けば割引になるのだろうか。次回以降の宿題としたい。

## 買ったもの

おにぎりなど、その場で食べるぶんだけ。店内のイートインで食べた。

買ったものをその場で食べられる席があるのは、移動の途中で腹を満たすには都合がいい。フェリーの出港を待つ時間にも使える。

## 客層と混雑

朝10時台で、混雑というほどではなかった。駐車場は広く、停めるのに困ることはない。

## その他メモ

- **営業時間**：24時間営業、年中無休
- **場所**：徳島市住吉6丁目2番3号
- **設備**：店内ベーカリー、イートイン、氷サービス、純水サービス
- **氷が買える**：クーラーボックスを積んでいるなら覚えておいて損はない
- **フェリー利用者向け**：徳島港が近い。深夜や早朝の便を使うライダーにとって、 24時間開いている食料調達先が港の近くにあるのは、それだけで価値がある。

## この店の背景

ハローズは広島・岡山・香川・愛媛・徳島・兵庫・山口の7県に展開する24時間営業型の食品スーパーだ。

そして今回いちばん大きかったのは、宿泊先の近くにディオ鳴門南店があったことだ。

大黒天物産のディスカウント業態で、同じく24時間営業。フェリーに持ち込む食料はディオで買った。安かったからだ。

また、市内の応神町にはラ・ムーもある。こちらも24時間営業。ハローズでは、座って食べられる席を使った。

同じ24時間営業でも、役割が違う。
価格で選ぶならラ・ムーやディオ、品質を求めたり、休憩ならハローズ。

徳島港から船に乗るなら、買い出しに色々な選択肢があることを覚えておくと良い。

逆に東京港からだとオーケー東雲店くらいしか選択肢はない。（オーケーは24時間営業ではないので注意）

ほかのご当地スーパーは[ご当地スーパーの記事一覧](/theme/touring?cat=supermarket)にまとめてある。

※値引きの時刻や段階は、その日の売れ行きと店の判断で変わります。
この記事は上記日時の1回の観測にすぎません。', '/media/uploads/1792851483434-xonf0r.png', 'published', 0, '2026-10-23', 'ハローズ 住吉店', '徳島県徳島市', '徳島県徳島市住吉6-2−3', 34.119709, 134.513128, NULL, NULL, NULL, NULL, NULL, 3, 3, NULL, '2026-09-26', '24時間営業', NULL, NULL, NULL, NULL, 0, '2026-10-23 14:05:50', '2026-10-25 14:19:02', '郊外型スーパー', '四国', NULL, NULL, '', '徳島南部自動車道 徳島沖洲ICから5分', '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (23, 'post-mvl30i62', 'touring', '青森県｜花岡公園キャンプ場｜無料・予約不要、国道7号そばの林間サイト', '', '前日は秋田のホテル泊で、そこから青森の竜飛岬を目指して出発した。

キャンプ場は五所川原市の芦野公園オートキャンプ場でも良かったが、そちらはGWに泊まっていたので、以前から気になっていた花岡公園キャンプ場を選んで2連泊することにした。翌日に予定通り[竜飛岬まで走った](/posts/post-mvm54zod)が、荷物はできる限り身軽にしたかったからだ。テントを張ったまま空荷で往復できるのが連泊の利点になる。

## サイトと地面

区画のないフリーサイトで、20張ほど入りそうな広さ。地面は松葉と落ち葉が積もった土で、奥の方には芝のエリアもある。松と広葉樹の林間サイトで、見上げるとかなり葉が茂っている。8月の東北で、日中にテントの中が蒸し風呂にならなかったのは、たぶんこの木のおかげだ。

ペグは普通に刺さる。落ち葉の層があるぶん、鍛造でなくても問題なかった。木が多いのでタープもハンモックも張り放題だが、焚き火をするなら落ち葉を払ってから焚き火台を置かないと危ない地面でもある。

ライダー向けの決定的な情報として、サイトのすぐそばにアスファルトの駐車場がある。荷物を担いで何往復もする必要がない。バイクを降りて数歩でテントを張れる距離で、これは連泊するときに効いてくる。

## トイレ・炊事場

トイレは水洗で、清掃もされていて綺麗。無料のキャンプ場でこれは当たりの部類。洋式でウォシュレットはなし。

炊事場は水のみで、お湯は出ない。夏なので困らなかったが、春先や秋に来るなら洗い物は覚悟がいる。ゴミは持ち帰り。

| 項目 | 内容 |
|---|---|
| 料金 | 無料 |
| 予約 | 不要 |
| 受付 | 隣接の健康の森 花岡プラザで施設使用簿に記入 花岡プラザは9:00〜21:00、休館日は毎月第3水曜日と12/29〜1/3|
| サイト | フリー、約20張 |
| 地面 | 松葉の積もった土（一部芝） |
| トイレ | 水洗・清掃あり（洋式、ウォシュレットなし） |
| 炊事場 | あり（水のみ、お湯なし） |
| ゴミ | 持ち帰り |
| バイク | サイト横にアスファルト駐車場 |
| 虫 | 8月で、夏にしては少なめ |

## 買い出しと風呂

買い出しは[いとく浪岡店](/posts/post-mvi4pfo2)。ここから車で10分ほどで、営業は9時から22時。22時閉店なので、20時に行っても惣菜は半額、刺身は3割引にはなりそうだ。キャンプの買い出し拠点としては相当に優秀といえる。

風呂は選択肢が3つある。天然温泉 和ノ湯は大人520円で、黒い湯が出る単純温泉。6時から22時まで開いているので、朝風呂に入ってから出発もできる。ポパイ温泉は大人380円で、こちらも朝6時から。

そしてキャンプ場の目の前、受付をする健康の森 花岡プラザ自体が入浴施設で、大人360円とこのあたりでは最安。ただし温泉井戸の老朽化で源泉の掘り直しが進行中で、現在入れるのは井戸水を沸かしたバイブラ浴槽のみ。新しい源泉での営業再開は2027年1月上旬の予定とされている。
温泉目当てなら和ノ湯かポパイ温泉へ回ったほうがいい。

## 客層と混雑

お盆の真ん中に2泊して、それでもガラガラというほどではないが、場所の取り合いになることは一度もなかった。ファミリーと、同じようなソロのライダーが数組。夜は静かで、国道7号がすぐそばの割に車の音はそこまで気にならなかった。

## その他メモ

- 国道7号からすぐで、翌朝の走り出しが早い。竜飛岬方面へ北上する中継地として使い勝手がいい
- 道の駅なみおかアップルヒルが近く、朝に寄れる
- 無料・予約不要なので、到着時刻が読めないツーリングと相性がいい
- 連泊する場合は、初日の受付で連泊する旨を伝えて紙に記載する

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※料金・営業時間・入浴施設の営業状況は訪問時点のものです。特に花岡プラザの日帰り入浴は源泉の切り替え工事中のため、最新情報は各施設でご確認ください。', '/media/uploads/1792766684150-dqd34o.png', 'published', 0, '2026-10-23', '花岡公園キャンプ場', '青森県青森市', NULL, 40.710526, 140.580915, NULL, '', '', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2026-08-12', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-23 14:45:14', '2026-10-27 13:35:01', '無料格安キャンプ場', '東北', '', 'ゴミ持ち帰り。炊事場はお湯なし。', NULL, NULL, 'post-mvi4pfo2');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (24, 'post-mvm54zod', 'touring', '青森県｜竜飛岬｜国道339号で津軽半島をほぼ一周、12時間のルート', '', '前日は[花岡公園キャンプ場](/posts/post-mvl30i62)にて宿泊。テントを張ったまま空荷で竜飛岬まで往復するためだ。

津軽半島には5月のGWにも来ていて、今回はどうするか悩んだが天気が快晴だったため行くことにした。国道339号で津軽半島をほぼ一周する形で走った。竜飛岬そのものより、そこへ至る道と、その周辺にあるものの方が面白い半島だと思う。

## ざっくり基本ルート

- 花岡公園キャンプ場出発
- 【津軽自動車道】浪岡IC〜五所川原北IC（無料）
- こめ米ロードで中泊まで北上
- 国道339号に合流してひたすら北上、竜飛まで
- 竜飛から南下（国道339号、県道14号）
- 大平から県道12号、国道280号バイパス（無料）で青森市内へ
- 青森市内から国道7号で南下、浪岡の花岡公園キャンプ場到着

全線2車線道路で走りやすい。竜泊ラインは若干ヘアピンカーブがあるので速度に注意。また山間部なので動物の飛び出しもありそうだ。

海、山を両方堪能できるルートだ。国道339号は交通量も少なく快走できる。路面もきれいに整備されていて、荒れや落石は見当たらなかった。

五所川原北ICから中泊まではこめ米ロードを使った方が信号も少なく便利。地元民もこちらを使っている様子だった。正式には五所川原広域農道で、藤崎町から中泊町まで続く全長50km超の広域農道にあたる。国道339号と並走していて、信号が少なく直線が多い。

## タイムライン

このルートには**14:18という動かせない時刻**がある。青函トンネル入口広場を北海道新幹線が通過する時刻だ。ここを軸に前後を組み立てると、一日が無駄なく収まる。

| 時刻 | 場所 | メモ |
|---|---|---|
| 6:30 | 花岡公園キャンプ場 発 | テントは張ったまま、空荷で出発 |
| 8:00 | 湯らぱーく 着 | 8:00開店 |
| 9:30 | 湯らぱーく 発 | 朝風呂で眠気をリセット |
| 10:30 | 七ツ滝 | 道沿い。5分あれば十分、その後竜泊ラインを堪能 |
| 10:45 | 眺瞰台 | このあたりだけ曇り、青空を狙って写真撮影 |
| 11:30 | 竜飛岬 着 | 晴天。階段国道は上から |
| 13:00 | 竜飛岬 発 | 竜飛岬と階段国道で満足 |
| 13:20 | 浜どころ 海 | マグロのたたき丼1,000円。在庫終了次第閉店なので早めが安全 |
| 14:10 | 青函トンネル入口広場 着 | 余裕を持って到着 |
| 14:18 | はやぶさ上下2本 通過 | 1分差で2本 |
| 16:30 | 青森市内 通過 | 国道280号バイパス経由 |
| 18:00 | 花岡公園キャンプ場 着 | 到着後はポパイ温泉、その後いとく浪岡店で買い出し |

合計走行距離は200km程度。12時間は温泉と各スポットの滞在、休憩を含めた数字で、走りっぱなしならもっと短い。逆に言えば、朝8時に出ても夜までには戻れる。

## 買い出し関連

津軽半島の先端周辺は店が少ない。食事と給油は、半島に入る前か、青森市側に戻ってから済ませるのが無難だ。ガソリンは半分を切ったら入れておくくらいの感覚でちょうどいい。

五所川原側から行く場合、中泊以北はほとんどないため、マエダストア中泊店などで購入しておくと良い。外ヶ浜側から行く場合はマエダストア蟹田店が利用できる。どちらも朝9時頃から開いている。

## 立ち寄りスポット

| スポット | 料金 |
|---|---|
| 中泊町総合福祉健康センター 湯らぱーく | 400円 |
| 七ツ滝 | 無料 |
| 眺瞰台 | 無料 |
| 竜飛岬 | 無料 |
| 階段国道 | 無料 |
| 浜どころ 海（昼食） | 1,000円 |
| 青函トンネル入口広場 | 無料 |

この日かかったのは、温泉の400円と昼メシの1,000円だけ。1,400円で津軽半島を一周したことになる。

## 中泊町総合福祉健康センター 湯らぱーく

町営の日帰り温泉。入浴料は400円。サウナや小さいが露天風呂もあり。

朝8時から営業しているため、立ち寄って眠気をリセットした。木曜日のみ19時までで、それ以外は21時まで。年中無休。津軽半島に入る前の最後の温泉と考えていい。

## 七ツ滝

<a href="/media/uploads/1792852342995-wzqwro.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852342995-wzqwro.png" alt="国道339号沿いの七ツ滝、7段に流れ落ちる滝" style="width:280px;max-width:100%;border-radius:10px;"></a>

国道339号沿いにある高さ約21mの滝。7段の岩肌を伝って流れ落ちることから「七ツ滝」と名付けられたとされる。言われてみると確かに段になっていて、こげ茶の岩肌に白い流れが一本通っている。

竜泊ラインを小泊から北上すると右側に見えてくる。道沿いなので歩かずにすぐ見れるが、看板などがなく少し気づきにくいので注意。少ないが停めるスペースもあり。きちんとした駐車場ではないので、停める位置には気を使いたい。

夏に寄ると、滝の周りだけ空気がひんやりしている。走ってきた体を冷ますにはちょうどよく、5分あれば十分だが、5分止まる価値はある。

ここを過ぎると竜泊ラインの山岳区間が始まる。滝は海に流れ込んでいて、海と山が切り替わる地点の目印にもなっている。

## 眺瞰台

<a href="/media/uploads/1792852361807-rjdtcl.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852361807-rjdtcl.png" alt="眺瞰台から見下ろす竜泊ラインの九十九折" style="width:280px;max-width:100%;border-radius:10px;"></a>

小泊から竜飛までの約20kmは「竜泊ライン」と呼ばれていて、その最高地点、標高475mに眺瞰台がある。展望台からは、これから走る道が海沿いまで蛇行して降りていくのが全部見える。走ってきた道を上から眺められる場所は、そう多くない。

ただしこの日は、眺瞰台のあたりだけ曇っていた。下界は晴れているのに、ここだけ雲の中にいる。これは偶然ではなく、海から上がってきた湿った空気が山で雲になるためで、竜泊ラインではよく起きるらしい。

重要なのは、眺瞰台が曇っていても岬は晴れている可能性が高いということだ。実際このあと、下って岬に着いたら晴天だった。ここでガスっているのを見て引き返すのは、たぶん一番もったいない判断になる。

## 竜飛岬と階段国道

<div style="display:flex;flex-wrap:wrap;gap:8px;">
<a href="/media/uploads/1792852387540-tgflvm.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852387540-tgflvm.png" alt="晴天の竜飛岬から見た津軽海峡" style="height:190px;width:auto;border-radius:10px;"></a>
<a href="/media/uploads/1792852398048-532g2j.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852398048-532g2j.png" alt="竜飛埼灯台と風の岬の展望台" style="height:190px;width:auto;border-radius:10px;"></a>
<a href="/media/uploads/1792852411425-8vxd6d.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852411425-8vxd6d.png" alt="階段国道339号の標識とバイク" style="height:190px;width:auto;border-radius:10px;"></a>
</div>

岬に着いたら晴れていた。北海道が見える。

竜飛は風の名所として知られているが、この日もGWのときも、立っていられないような風ではなかった。ただし8月でも寒いと感じる。気温は20度くらいか。半島の先端で、海からの風がそのまま当たる場所なので、夏でも一枚羽織るものがあった方がいい。走ってきた体が冷える。

階段国道339号は、全国で唯一の「車が通れない国道」だ。龍飛漁港から龍飛埼灯台までの362段、全長388.2m、標高差約70m。

今回は上から覗いただけで、降りてはいない。下の方に集落があり、そこに繋がっている。階段が細く曲がりながら漁港まで続いていて、「道である」という感覚は上からでも十分に伝わる。
看板と標識を写真に収めて、それで満足した。全部降りないと意味がない場所ではないと思う。降りれば当然362段を登り直すことになるので、真夏にバイク装備でやる気にはならなかった。

## 浜どころ 海

<div style="display:flex;flex-wrap:wrap;gap:8px;">
<a href="/media/uploads/1792852433622-q7dl07.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852433622-q7dl07.png" alt="浜どころ海のマグロのたたき丼1,000円" style="height:230px;width:auto;border-radius:10px;"></a>
<a href="/media/uploads/1792852442407-bpbjae.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852442407-bpbjae.png" alt="浜どころ海の店構え、国道339号沿い" style="height:230px;width:auto;border-radius:10px;"></a>
</div>

竜飛を出て国道339号を南下し、三厩で昼食をとった。「浜どころ 海」という海鮮の店で、マグロのたたき丼が1,000円だった。

半島の先端には店がほとんどないと書いたが、三厩まで下りてくれば選択肢がある。むしろこの店は、わざわざ目的地にしてもいい部類だと思う。地元で揚がった魚を使っていて、料理は日替わり。仕入れによって中身が変わる。

ただし条件はきびしい。11:30開店で、終了時刻は在庫次第。在庫がなくなればそこで終わりなので、「14時まで営業」を信じて行くと閉まっていることがある。予約も不可。うに丼目当てに開店前から並ぶ人もいる店なので、確実に食べたいなら昼前に着く計画にしたい。

この日は13:20着で食べられたが、わりと際どいタイミングだったと思う。竜飛を12時台に出られるなら、ここをランチに組み込む価値は十分ある。

なお冬期（12月末〜3月末）は休業する。竜泊ラインの冬季通行止めとほぼ同じ期間で、冬の津軽半島の先端は道も店も静かになる。

## 青函トンネル入口広場

<a href="/media/uploads/1792852460641-osljgh.png" target="_blank" rel="noopener"><img src="/media/uploads/1792852460641-osljgh.png" alt="青函トンネルに入る北海道新幹線はやぶさ" style="width:280px;max-width:100%;border-radius:10px;"></a>

帰り道、今別町の青函トンネル入口広場に寄った。2015年に整備された展望台から、北海道新幹線が青函トンネルを出入りする様子を間近で見られる場所だ。

ここで新幹線の通過を撮ることができた。トンネルに吸い込まれていく瞬間が真正面から見える。本数が多い区間ではないので、通過時刻を調べてから行くか、ある程度待つ覚悟がいる。逆に言えば、時間を合わせて行けばほぼ確実に撮れる場所でもある。

14:18に下りはやぶさ17号、14:19に上りはやぶさ28号が通過するので、待ち時間なしで2本の新幹線を見ることができる。今回はこれを目指して到着し、時刻表通りの通過だった。1分差で上下2本というのは、この広場に来る理由として十分だと思う。

ダイヤは改正で変わるので、行く前に最新の時刻表を確認してほしい。

竜飛からの帰り道にちょうど位置しているので、組み込みやすい。

## 路面・注意事項

*  眺瞰台が曇っていても、竜飛岬は晴れていることがある

*  夏でも岬は寒い。羽織るものを持っていく

*  階段国道は上から見るだけでも成立する

*  三厩の「浜どころ 海」は在庫終了次第閉店。昼メシに組み込むなら12時台には着きたい

*  青函トンネル入口広場は14時台が狙い目。ただしダイヤは要確認

*  竜泊ラインは11月中旬から4月中旬まで冬季通行止め。この区間が閉まると津軽半島の一周ができなくなる

*  半島先端に店はほぼない。給油と食料は中泊か蟹田まで

*  拠点を浪岡に置けば、空荷で一日回れる

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※道路状況・施設の営業状況は訪問時点のものです。特に竜泊ラインの通行可否は季節によって変わるため、最新情報をご確認ください。', '/media/uploads/1792830679370-65i5y8.png', 'published', 0, '2026-10-24', '津軽半島一周', '青森県', NULL, NULL, NULL, 200, '12時間', '晴れ', 'トライアンフ アメリカLT', '青森市→五所川原市→龍飛→今別町→外ヶ浜町→青森市', NULL, NULL, NULL, '2026-08-13', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-24 08:32:29', '2026-11-02 14:15:03', 'ツーリングルート', '東北', '5月〜10月頃まで（冬季は吹雪など悪天候の可能性高）', '全線二車線で快走路がメイン。冬季は通行注意', NULL, NULL, 'post-mvi4pfo2');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (25, 'post-mvnhccx3', 'asset', 'SBI新生の定期に990万円。同じ金利なら3ヶ月でいい、と思ったら違った', '', '新規口座開設の特典で、年1.70%の定期預金がある。

SBI新生銀行の「スタートアップ円定期預金」。口座を開いた月から3ヶ月目までしか申し込めない、一度きりの商品だ。990万円を預けた。

申し込み画面の前で、しばらく止まった。3ヶ月ものと1年ものの金利が、同じだったからだ。

## そもそも、なぜ動かしたのか

このお金はもともと、みずほ銀行の普通預金に置いてあった。

### 理由1：金利の差が無視できない水準になった

ゼロ金利の時代なら、どこに置いても同じだった。今は違う。

| 置き場所 | 金利 | 990万円を1年置いた場合（税引前） |
|---|---|---|
| みずほ 普通預金 | 年0.40% | 39,600円 |
| SBI新生 スタートアップ定期 | 年1.70% | 168,300円 |
| 差額 | | **128,700円** |

同じ金額を、ただ違う場所に置くだけで12万円変わる。作業時間は、口座開設からSBI新生のハイパー預金（SBI証券と連携する円普通預金）の申込、定期の設定まで含めて2時間ほど。時給6万円の仕事になった。

ちなみにみずほの普通預金は、2026年11月2日から年0.50%への引き上げが告知されている。金利が上がっているのは全体の流れであって、メガバンクが悪いという話ではない。それでも1.70%との差は埋まらない。

### 理由2：口座開設の特典が重なっていた

SBI新生銀行では同時期に、口座を移すと特典がもらえるキャンペーンが重なっていた。条件を並べたら7つあり、合計65,000円になった（[別記事で書いた](/posts/post-mvnvaqow)）。

定期預金の利息が約11万円、キャンペーンが65,000円。合わせて17万円を超える。どちらか片方だけなら動かなかったかもしれない。重なったから動いた。

### 理由3：そもそも、このお金は余っていない

これが一番の理由だ。

「毎月の給料があるんだから、定期の分は投資に回せばいいのでは」という疑問は当然出る。自分でも考えた。計算してみて、答えが出た。

NISAの残り生涯枠は約1,058万円。定期に入れたのは990万円。ほぼ同じ金額だ。偶然ではなく、残り枠に合わせて金額を決めた。

つまりこの990万円は「置き場所に困ったお金」ではない。**行き先がすでに決まっている、順番待ちの列**だ。

では給料はどこへ行くのか。2027年の家計を並べるとこうなる。

| | 年額 |
|---|---|
| 手取り | 約234万円 |
| 賞与（手取り推定） | 約110万円 |
| 生活費＋年間の臨時支出 | ▲217万円 |
| iDeCo（月62,000円） | ▲74万円 |
| **残り** | **約53万円** |

給料から出せるのは年50万円ほど。従業員持株会の売却金が年200万円前後戻ってくるので、合計で年250万円（初年度は実績がないため概算）。

NISAの年間枠は360万円。**毎年100万円ほど足りない**。その不足を3年分埋めるのが、定期に入れた990万円という位置づけになる。

さらに言えば、iDeCoを月62,000円に引き上げると、給与単体では月6,684円の赤字になる。余裕があるから寝かせているのではなく、枠を埋めきるために確保しておかないと間に合わない、という状態だ。

## 3ヶ月と1年、金利が同じだった

- 3ヶ月もの：年1.70%（税引前）
- 1年もの：年1.70%（税引前）

期間が長いほど金利が高い、という思い込みがあったので意外だった。

同じ金利なら、短いほうが有利に見える。3ヶ月で一度戻ってきて、また預け直せばいい。そう考えた。

## そうはならなかった

この商品は「口座開設から3ヶ月目まで」の期間限定だ。3ヶ月ものが満期を迎えた時点で、もう同じ金利では預け直せない。満期後は通常の定期預金の金利に戻る。

つまり3ヶ月ものを選ぶというのは、「1.70%を3ヶ月だけ使って、残りの9ヶ月は捨てる」ということだった。

正しい選び方はこうなる。

- **1年以内に使うお金** → 3ヶ月もの（使う時期に合わせて戻ってくる）
- **1年は動かさないお金** → 1年もの（1.70%を1年フルで使える）

「同じ金利なら短いほうが得」ではなく、「同じ金利だからこそ、使う時期だけで決めればいい」。そういう商品だった。

## 使う時期で割り振った

| 期間 | 金額 | 満期 | 用途 |
| --- | --- | --- | --- |
| 3ヶ月もの | 240万円 | 2027/01/01 | 翌年のNISA枠 |
| 1年もの | 400万円 | 2027/10/01 | 翌々年以降のNISA枠 |
| 1年もの | 200万円 | 2027/10/01 | 同上 |
| 1年もの | 100万円 | 2027/10/01 | 同上 |
| 1年もの | 50万円 | 2027/10/01 | 同上 |
| 合計 | 990万円 |  |  |

預入日はすべて2026年10月1日。満期取扱方法は全て「自動解約」にしてある。満期日に普通預金へ戻るので、気づかないうちに低い金利で預け直されることはない。

来年1月に使う240万円を1年ものに入れてしまうと、中途解約することになる。これは避けたかった。理由は次の通り。

## 中途解約すると、どうなるか

この商品の中途解約には2つの痛みがある。

ひとつ、**一部解約ができない**。対象の定期預金を丸ごと解約することになる。1本400万円の定期から100万円だけ、ということはできない。だから最初の分け方が重要だ。

ふたつ、**金利が落ちる**。

| 預入期間 | 適用される利率 |
|---|---|
| 6ヶ月未満 | 普通預金金利 |
| 6ヶ月以上1年未満 | 約定金利の50%（＝0.85%） |

6ヶ月を超えていれば半分は残るが、それでも1.70%は消える。満期まで持てる金額だけを1年ものに入れる。そこは慎重にやった。

## 本数を分けても利息は変わらない

もうひとつ調べたことがある。750万円を1本で預けるのと、分けて預けるのとで、受け取る利息は変わるのか。

結論は、**引き出さないかぎり変わらない**。

定期預金の利息は「元本×金利×期間」で決まる。本数で割っても、合計元本が同じなら合計利息も同じだ。750万円を1本にしても、400万・200万・100万・50万の4本にしても、1年後の利息は127,500円（税引前）で変わらない。NISAやオルカンのように複利が雪だるま式に効く世界ではないので、分割しても不利にならない代わりに、有利にもならない。

では分ける意味はどこにあるか。**途中で一部だけ必要になったとき**だ。

この商品は一部解約ができない。1本にまとめていると、10万円必要になっただけで750万円全部を解約することになる。6ヶ月以上なら0.85%、6ヶ月未満なら普通預金金利まで落ちる。750万円全部が、だ。

4本に分けてあれば、50万円の1本だけを崩せばいい。残りの700万円は1.70%のまま走り続ける。

### 金額を倍々にした理由

50万・100万・200万・400万という並びにしたのには理由がある。この4つを組み合わせると、**50万円刻みで750万円までのどの金額でも作れる**。

*   150万円必要 → 50万＋100万
*   250万円必要 → 50万＋200万
*   650万円必要 → 50万＋200万＋400万

必要な額に一番近い組み合わせだけを解約して、残りは1.70%のまま置いておける。250万円ずつ均等に3本にするより、崩す量を小さくできる。

保険として分けるのはあり。利息を増やす目的で分けるのは意味がない。そこは変わらない。

## なぜ、今すぐオルカンに入れないのか

下落と複利の関係については[オルカンが下がった。でも口数は1口も減っていない事実](/posts/nav-down)でも整理している。

ここで当然の疑問が出る。株式の期待リターンは年5〜7%で、定期預金の1.70%より明らかに高い。現金で寝かせるのは機会損失ではないか、と。

実際、この選択は何度も考えた。結論は「やらない」だが、理由は「怖いから」ではない。

### 特定口座で先に買うと、税金という関所が増える

特定口座で買った分は、NISAに移せない。売って、利益に20.315%の税金を払って、その残りをNISAで買い直すことになる。

仮に100万円が1年で110万円になったとして、利益10万円に対して約2万円の税金。NISAに入るのは108万円。最初から現金で持って、そのままNISAで110万円分買えていたほうが得になる場面がある。

「あとでNISAに入れる予定のお金」を特定口座に入れるのは、途中に関所を1つ増やす行為だった。

### 1.70%は、現金のままでも十分な利回りだった

ゼロ金利なら話は別だ。現金で持つコストがゼロだから、少しでもリスクを取ったほうがいい、という議論は成立する。

今は1.70%ある。税引後でも1.355%。インフレ率とほぼ並ぶ水準で、現金の目減りはかなり抑えられる。「現金で待つコスト」が大きく下がったことで、無理に先回りする必要がなくなった。金利のある世界の効能だと思う。

### 投資に回すお金は、別の場所から出す

だから「定期を崩して特定口座へ」という発想にはならない。特定口座に入れるとしたら、それは定期からではなく、給料と持株会から出た余剰のほうだ。

そしてその条件も決めてある。**オルカンの基準価額が10%以上下げたときに、100万円程度**。それ以外は動かさない。

暴落のときに動ける現金を持っていること自体が、現金を持っておく理由のひとつになっている。

## 数字にするといくらか

| | 計算 | 税引前 | 税引後 |
|---|---|---|---|
| 240万円×3ヶ月 | 240万×1.70%×3/12 | 10,200円 | 約8,128円 |
| 750万円×1年 | 750万×1.70%×12/12 | 127,500円 | 約101,598円 |
| 合計 | | 137,700円 | 約109,726円 |

税引後で約11万円。オルカンなら1日の値動きで消える額だが、こちらは元本が減らない前提で確実に増える11万円だ。

生活費が月14万円なので、ほぼ1ヶ月分を銀行が出してくれた計算になる。

## 次の宿題

- 3ヶ月ものの満期は2027年1月。そのままNISAへ入れる
- 1年ものの満期は2027年10月。その時点で同条件の定期はもう存在しない
- 満期後の置き場所を、1年かけて探しておく

一度きりのボーナスステージなので、終われば普通の世界に戻る。次は普通の世界で、どこに置くかを考えることになる。

※ 金利・中途解約利率は申込時点のもの。最新の条件は各行の商品説明書を確認のこと。', '/media/uploads/1792912243984-gdakew.png', 'published', 0, '2026-10-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '定期預金 預入額', '9,900,000円', '年1.70%／税引後の利息 約109,726円', NULL, 0, '2026-10-25 07:01:54', '2026-10-26 11:27:39', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (26, 'post-mvnrc3hv', 'touring', '長野県｜妙琴公園キャンプ場｜4回通っている無料キャンプ場', '', '毎年のように行っているキャンプ場がひとつだけある。長野県飯田市の妙琴公園キャンプ場で、通算4回ほど泊まっている。直近は10月10日から11日にかけての連泊だった。

無料で、予約もいらない。到着時刻が読めないツーリングでこれは大きい。ただ、通う理由はそれだけではないので、今回はそこも含めて書いておく。

## サイトと地面

<a href="/media/uploads/1792922773961-jj27kb.png" target="_blank" rel="noopener"><img src="/media/uploads/1792922773961-jj27kb.png" alt="妙琴公園キャンプ場のフリーサイト" style="width:280px;border-radius:10px;"></a>

区画のないフリーサイトで、30張くらいは入りそうな広さがある。林の中と開けた場所が両方あって、季節と天気で好きなほうを選べるのがいい。春のツツジと秋の紅葉が見どころとされている場所で、10月に行くと木の色が変わりはじめている。

直火は禁止。焚き火台なら使える。花火も禁止で、照明設備は炊事場とトイレにある。ゴミは全量持ち帰り。

駐車場は舗装されている。ただし場所によって傾斜があるので、バイクで行くならサイドスタンドの向きを考えて停める位置を選んだほうがいい。平らなところを早めに押さえておくと、翌朝あわてずに済む。

アクセス自体は中央道の飯田ICから10分で問題ないが、途中に住宅地を抜ける区間があって、そこだけ道幅が狭い。対向車が来ると気を使うので、夜に初めて入るなら明るいうちに通っておくと楽になる。

## トイレ・炊事場

トイレは水洗で洋式、ウォシュレットはなし。炊事場と合わせて、どちらも綺麗に保たれている。無料のキャンプ場でこの水準は珍しく、通っている理由のひとつがここにある。

| 項目 | 内容 |
| --- | --- |
| 料金 | 無料 |
| 予約 | 不要（10名以上の団体は要連絡） |
| 期間 | 12月上旬まで |
| サイト | フリー、約30張 |
| トイレ | 水洗・洋式（ウォシュレットなし）、清掃あり |
| 炊事場 | あり、綺麗 |
| 直火 | 禁止（焚き火台は可）、花火も禁止 |
| ゴミ | 持ち帰り |
| 照明 | 炊事場とトイレにあり。サイト内は暗いのでライト必携 |
| 駐車場 | 舗装あり。場所により傾斜 |
| 虫 | 10月はほぼいない。7〜8月は蚊を含めそれなり |
| 熊 | 目撃情報あり。場内に注意喚起の掲示 |
| アクセス | 中央道 飯田ICから車で10分。一部住宅地で狭い道あり |
| 問い合わせ | 飯田市 維持管理課 0265-22-4511 |

住所は長野県飯田市鼎切石5247-1。

## 川の音がする

<a href="/media/uploads/1792922783570-h9kzpf.png" target="_blank" rel="noopener"><img src="/media/uploads/1792922783570-h9kzpf.png" alt="キャンプ場のそばを流れる松川" style="width:280px;border-radius:10px;"></a>

すぐ近くを松川が流れていて、サイトまで水の音が届く。

夜になると、音が川だけになる瞬間がある。無料のキャンプ場でそれが手に入る場所は、そう多くない。

ただし山が近いぶん、熊の目撃情報は頻繁にあって、場内にも注意喚起の掲示が出ていた。食料をテント内に置いたままにしない、ゴミを夜通し外に出さない、といった基本は守っておきたい。

## 買い出しと風呂

<a href="/media/uploads/1792922790594-dh7wva.png" target="_blank" rel="noopener"><img src="/media/uploads/1792922790594-dh7wva.png" alt="買い出しに使った店の外観" style="width:280px;border-radius:10px;"></a>

飯田市内なので買い出しに困ることはない。バロー、西友（24時間営業）、キラヤ、イオン、アピタと選択肢は多く、キャンプ場から下りた鼎名古熊のあたりにはバロー飯田店とアピタ飯田店が並んでいる。

18時に行ってみたところ、バローは割引が出ていなかったので何も買わず、そのままアピタへ移動した。アピタは惣菜と刺身の一部に半額と3割引が出ていて、結局こちらで揃えた。18時でこの状態なので、設営を終えてから買いに行くくらいの時間帯がちょうどいい。営業はバローが9:30〜20:00、アピタが9:00〜21:00。

地元スーパーのキラヤは前回行ったが、全般的に価格が高く今回は見送った。

風呂はいつも下條温泉郷コスモスの湯に行く。大人500円、11:00〜20:00（受付19:30まで）、火曜休み（祝日の場合は木曜）。

ただし近くはない。三遠南信自動車道の飯田山本ICから天竜峡までが無料区間で、そこを使って片道50分ほどかかる。風呂だけのために行く距離ではないので、自分は天竜峡とセットで一本の寄り道として組んでいる。走ること自体が目的ならこれでいい。

面倒な日は飯田市のほっ湯アップル。大人600円、11:00〜21:00（入場20:30まで）、月曜休み（祝日は営業）。21時まで開いていて市内にあるので、設営後でも間に合う。

## 客層と混雑

基本的に夜は静かで、何度泊まってもそれは変わらなかった。

ただし10月11日の夜は違った。深夜に焼肉を焼いて騒いでいるグループがいて、2時頃まで続いた。見た感じキャンプをしに来た人たちではなく、夜に公園へ集まってきた側だった。

飯田市にも夜間の騒音について同様の意見が寄せられていて、市は看板設置や巡回での対応を示している。無料で誰でも入れる場所である以上、こういう夜は確率として存在する、と考えておいたほうがいい。耳栓は持っていく価値がある。

## 寄り道

<a href="/media/uploads/1792922787102-gkt03q.png" target="_blank" rel="noopener"><img src="/media/uploads/1792922787102-gkt03q.png" alt="天竜峡にかかる橋" style="width:280px;border-radius:10px;"></a>

天竜峡はコスモスの湯と同じ方向にある。三遠南信道で南下して、散策路を歩いて、帰りに風呂へ寄る。この順番にすると片道50分が無駄にならない。

## なぜ毎年行くのか

無料のキャンプ場はたくさんあるが、設備が綺麗で、川の音がして、買い出しも風呂も揃っていて、高速のICから10分という場所はほとんどない。

どれかひとつが欠けていても通わなかったと思う。全部そろっていて、しかも0円。たまに騒がしい夜があることを差し引いても、その計算はまだ合っている。

だから来年も行く。

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※料金・営業時間は訪問時点のものです。最新情報は各施設でご確認ください。', '/media/uploads/1792928927239-fcq3sk.png', 'published', 0, '2026-10-25', '妙琴公園キャンプ場', '長野県', NULL, 35.51471, 137.821952, NULL, '', '', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2026-10-10', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-25 11:41:38', '2026-10-27 13:34:45', '無料格安キャンプ場', '甲信越', '', '直火禁止、ゴミは全量持ち帰り。熊の目撃情報あり、食料の管理に注意。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (27, 'post-mvnvaqow', 'asset', '銀行を引っ越しただけで65,000円。条件を並べたら7つあった', '', '先日の記事で、[990万円をみずほからSBI新生へ移した話](/posts/post-mvnhccx3)を書いた。そのとき「別記事で書く」と置いたままにしていたのが、このキャンペーンの話だ。

結論から書くと、条件を達成した分の合計が65,000円になった。金利とは別に、口座を移したこと自体でついてきた金額だ。

最初に断っておくと、このうち最大のものは2026年9月30日で終了している。これから同じ条件で申し込むことはできない。それでも書き残すのは、この種のプログラムが形を変えて繰り返されるからで、次に同じものが来たときに自分で見返すためだ。

## 65,000円の内訳

ひとつのキャンペーンではなく、3つのプログラムが重なっている。条件の単位で数えると7つになる。

| プログラム | 条件 | 金額 |
| --- | --- | --- |
| お引越しキャンペーン 第1弾 | ハイパー預金残高1,000万円以上 | 50,000円 |
| 同 第2弾 | 振込予約1回＋スマホATM1回 | 2,000円 |
| ウェルカムプログラム 特典1 | 新規口座開設 | 1,500円 |
| 同 特典2 | SBI証券と米ドル入出金 | 1,500円 |
| 同 特典3 | 口座振替による引き落とし | 2,000円 |
| 同 特典4 | 給与振込入金 | 5,000円 |
| ハイパー預金開設キャンペーン | 開設＋エントリー | 3,000円 |
| **合計** | | **65,000円** |

一番大きいのはお引越しキャンペーンの第1弾で、残高によって段階が変わる。

| 残高 | 金額 |
| --- | --- |
| 30万円以上 | 2,000円 |
| 50万円以上 | 5,000円 |
| 100万円以上 | 10,000円 |
| 300万円以上 | 20,000円 |
| 1,000万円以上 | 50,000円 |

みずほ銀行の預金を金利の高い銀行に移す予定だったので、最初から一番上の段に届く位置にいた。これがこのタイミングで動いた理由でもある。

## やったこと

8月24日に総合口座パワーフレックスの開設が完了した。

9月2日にSBIハイパー預金を申し込み、翌3日に開設完了の通知が届いた。SBI証券とSBI新生銀行のあいだで資金を自動で動かせる円普通預金で、お引越しキャンペーンはこの口座の開設が前提条件になっている。銀行口座から10日ほどかかった計算になる。

エントリーはプログラムごとに別々に行った。ここが一番の落とし穴で、条件を全部満たしてもエントリーがなければ0円になる。

9月30日23:59時点の残高が1,000万円以上の段に入っていることを確認して、第1弾の50,000円が確定した。

10月に入ってから第2弾の2つを片付けた。スマホATMで1万円以上の入出金を1回、振込予約で1万円以上の振込を1回。どちらも作業自体は数分で終わる。

ウェルカムプログラムの特典1から4も、同じ期間のうちに条件を満たした。給与振込は10月分だけ5万円をSBI新生へ回して、条件の1回3万円以上をクリアしている。11月以降はみずほに戻した。メインバンクを移したわけではなく、条件を通すために1回だけ経路を変えた形だ。

## 取らなかった特典

ウェルカムプログラムで唯一見送ったのが特典5で、円から米ドル定期預金を100万円以上預けると1,000円という条件だった。

これは為替リスクを取る話になる。1,000円のために、NISAの原資として置いてある資金の計画を崩す理由はなかった。もらえるものを全部もらう、という発想にすると本来の目的がずれる。ここは取らない判断をした。

## 引っかかりそうなところ

条件を読み込んでいて、見落としやすいと感じた点を並べておく。

エントリーがプログラムごとに別手続きになっている。ウェルカムプログラムは専用フォーム、キャッシュプレゼントはアプリから、と入口も違う。口座を開いてお金を置くだけでは対象にならない。

締切がそれぞれ違う。お引越しキャンペーンの第1弾は9月30日、第2弾は10月31日。ウェルカムプログラムは口座開設月を含む3ヶ月目の末日なので、8月開設の自分は10月31日だった。残高判定が終わった時点で終わったと思い込むと、後ろの分を落とす。

判定日の残高に条件がある。振込やスマホATMを使った日の23:59時点で円普通預金残高が1万円未満だと、条件を満たしても対象外になる。

名前の似たサービスがある。「定額自動振込」は対象だが、ハイパー預金側の「定額自動振替」は対象外と明記されている。

給与振込は電文種目で判定される。勤務先から「給与」として送られた場合のみ対象で、「振込・振替」だと金額が足りていても対象外になる。自分の場合は1回だけで条件を満たせたが、ここは勤務先側の処理に依存する。

開設までに日数がかかる。銀行口座とハイパー預金は別の手続きで、自分の場合は10日ほど空いた。残高判定日から逆算すると、動き出しが遅いと間に合わない可能性がある。

併用の可否に注意書きがある。ウェルカムプログラムには「口座開設を対象とした他の景品類の付与対象となった場合は対象外」という条項がある。お引越しキャンペーンはハイパー預金の開設が対象なので併用できると読んで動いたが、最終的な判定は入金で確認するしかない。

## 1年分の利息と足すと

定期預金の利息が税引後で約109,726円。プログラムの合計が65,000円。足すと約175,000円になる。

自分の年間生活費は約217万円なので、ほぼ1か月分にあたる。銀行を移して、口座を開いて、振込を1回とATMを1回。それだけで出た金額だ。

もちろん、990万円という原資があったから50,000円の段に届いた。30万円なら2,000円で、手間に見合うかは人による。

ただ、どうせ置いておくお金の置き場所を変えるだけなら、やらない理由のほうが見つけにくい。

なお、SBIハイパー預金の金利は2026年10月に年0.60%へ引き上げられた。定期に入れていない分の置き場所としても、以前より条件がよくなっている。

## 残っている作業

入金時期はプログラムごとに違う。お引越しキャンペーンは2026年12月末頃、ウェルカムプログラムは口座開設月を含む6ヶ月目の末日までとされている。

どちらも「入金前に口座を解約すると対象外」という条件がついている。解約する予定はないが、全額の着金を確認するまでは口座をそのまま置いておく。

12月末に一度、通帳を見る日をつくる。それだけ決めて、この件は終わりにする。

## 参照した条件ページ

- [SBI新生銀行へのお引越しで最大52,000円プレゼントキャンペーン](https://www.sbishinseibank.co.jp/lp/transfer_sbihyper_2608/)
- [新規口座開設特典 ウェルカムプログラム](https://www.sbishinseibank.co.jp/service/welcome/)

※本記事には終了したキャンペーンの記録を含みます。条件・金額は当時のものです。', '/media/uploads/1792936009546-d597wu.png', 'published', 0, '2026-10-25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '受け取り予定額', '65,000円', '3つのプログラムの合計・2026年12月末〜入金予定', NULL, 0, '2026-10-25 13:32:33', '2026-10-25 14:03:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (28, 'post-mvpb5ob7', 'life', '生活費は月14万円。でも年で割ると18万円だった', '毎月出ていく分と、年に数回だけ出ていく分を分けて数えた', '自分の生活費を、ずっと「月14万円」と言ってきた。同じ口から「実質18万円」とも言っていた。

どちらも嘘ではないが、並べると矛盾している。年末が近いので、一度ぜんぶ並べて数え直した。

結論から書くと、差は**バイクの車検**だった。

## 毎月出ていく分：139,000円

| 項目 | 月額 | 備考 |
| --- | --- | --- |
| 家賃 | 55,000円 | 1K・一人暮らし |
| 食費（外食含む） | 50,000円 | |
| 予備枠 | 18,000円 | 日用品・散髪・衣類など |
| 水道光熱費 | 9,000円 | 電気・ガス・水道の合計 |
| 携帯・ネット | 7,000円 | ahamo＋ahamo光 |
| **合計** | **139,000円** | |

家賃と食費で105,000円。この2つで全体の75%を占めている。逆に言えば、残りはもう削りようがない。

水道光熱費が月9,000円で収まっているのは、節約を頑張っているというより、家にいる時間が短いからだと思う。自炊はするが凝ったことはしない。エアコンは使うときは使う。

酒・煙草・ギャンブル・ゲーム課金はやらない。我慢しているのではなく、もともと興味がない。ここが空欄なのは、節約の工夫ではなく単なる相性だと思っている。

家賃55,000円は、都内にしては安い部類だ。ただし都心までは1時間近くかかる場所で、通勤時間を払って家賃を下げている構造になっている。築年数の古い物件だが、バイクを屋根付きで無料で置けるのが決め手だった。この「駐輪場代ゼロ」が、あとで出てくる駐車場代の話に効いてくる。

## 食費50,000円は高いのか

一人暮らしで月50,000円は、やや高い部類かもしれない。ここは意図して使っている部分なので、中身を書いておく。

基本は自炊だが、スーパーの惣菜や刺身も自炊のうちに数えている。外食は週に1〜2日程度。

買い方には決まりがある。**閉店時刻から逆算して、半額が貼られる時間に行く**。近所の店は20時閉店なので、19時15分あたりが狙い目になる。定価や3割引のときは買わずに引き返すこともある。

| 商品 | 定価 | 半額 |
| --- | --- | --- |
| ブリの刺身 | 699円 | 約350円 |
| 刺身の盛り合わせ | 1,000円 | 500円 |
| 寿司10カン | 1,200円 | 600円 |

一方、野菜と肉は近所の店ではあまり安くならない。こちらは土日に激安スーパーへ行き、2〜3日分をまとめて買う。イオンやヨーカドー、いなげやには基本的に行かない。品質や利便性の問題ではなく、自分の買い方と噛み合わないというだけだ。

出勤日の1日はだいたいこうなる。

| | 内容 | 金額 |
| --- | --- | --- |
| 朝 | ゆで卵＋α | 50〜100円 |
| 昼 | 社食600円／外食800円／前日の半額弁当500円 | 約600円 |
| 夜 | 半額の惣菜を数点 | 約800円 |
| **計** | | **約1,500円** |

1日1,500円なら月45,000円。残りの5,000円が週末の外食や、たまに食べたいものを定価で買う分にあたる。計算は合っている。

削ろうと思えば削れる。ただ、食は数少ない楽しみなので、ここは落とさないことにしている。

それに、半額シールを探すこと自体が宝探しのようで、苦ではなく楽しい。節約として我慢しているのではなく、趣味として成立してしまっている。この逆算の癖がツーリング先でも出るので、[ご当地スーパーの記事](/theme/touring?cat=supermarket)では訪問時刻と値引き状況を毎回記録している。

## 年に数回だけ出ていく分：467,100円

毎月の表には出てこないが、確実に出ていく金額がある。

| 項目 | 年額 | 備考 |
| --- | --- | --- |
| 長距離ツーリング | 150,000円 | 年1回 |
| 近場のツーリング | 120,000円 | 月平均10,000円 |
| 中距離ツーリング | 70,000円 | 年1回 |
| バイク維持費 | 70,000円 | 消耗品・整備 |
| 任意保険 | 24,000円 | 20等級 |
| Genspark（年契約） | 25,110円 | |
| Amazon Prime | 5,990円 | |
| JAF 家族会員 | 2,000円 | |
| **合計** | **467,100円** | |

サブスクは2つで31,100円。月あたり2,592円になる。ここは増やさないようにしている。

## 「14万円」と「18万円」の正体

この2つを足すと、こうなる。

| | 年額 | 月平均 |
| --- | --- | --- |
| 毎月の分（139,000円×12） | 1,668,000円 | 139,000円 |
| 年に数回の分 | 467,100円 | 38,925円 |
| **小計** | **2,135,100円** | **177,925円** |
| バイク車検（100,000円÷2年） | 50,000円 | 4,167円 |
| **合計** | **2,185,100円** | **182,092円** |

車検を入れなければ月約17.8万円。入れると月約18.2万円。

ずっと「14万円」と言っていたのは毎月の表のことで、「18万円」と言っていたのは下の表のことだった。数え方が2つあっただけで、どちらも実態を指していた。

ただ、これを混ぜて話すと自分でも分からなくなる。これからは**毎月139,000円、年214万円（車検のある年は219万円）**と書くことにする。

ちなみに車検は2026年8月に更新済みで、次は2028年8月。だがその時期に売却を考えているので、この5万円は今後発生しない可能性が高い。

## 削らないと決めているもの

年間イレギュラー467,100円のうち、ツーリング関連が340,000円。全体の7割を超える。

ここを削れば年34万円が浮く。NISAの年間枠の1割近い。計算上は、削ったほうが資産は増える。

それでも削らない。資産を増やすのは手段で、目的ではないからだ。60歳で1億円という目標を立てているが、そこに到達するまでの19年を、何もしない19年にする気はない。

[無料のキャンプ場](/theme/touring?cat=touring)に泊まり、[ご当地スーパー](/theme/touring?cat=supermarket)で見切り品を買い、一般道で走る。宿は5,000円を超えないようにして、有料キャンプ場も1,000円までにしている。それでも年34万円は出ていく。この34万円は、削る対象ではなく、払う理由のほうだと思っている。

食費と予備枠も同じで、ここを切り詰めると生活のほうが先に荒れる。手を出さない。

## これから増える支出

今の生活費が安いのは、**バイクしか持っていないから**だ。しかも駐輪場代がかからない。

| 時期 | 予定 |
| --- | --- |
| 2027年1月 | 125ccを売却（自賠責が2027年8月に切れる前に処分） |
| 2028年8月 | 大型バイクを車検を通さず売却（10万km近く、値はほぼ付かない見込み） |

そのあと、自動車を持つかどうかを決めることになる。候補は軽自動車（新車250万円）＋125ccスクーターなど。

自動車を持つと、駐車場代が月1万円かかる。これが一番大きい。

**月1万円 × 12か月 × 17年＝約200万円。**

車両価格とは別に、置き場所だけで200万円出ていく計算になる。125ccはファミリーバイク特約で保険を安くできるが、駐車場代は動かせない。今の「駐輪場・無料」という条件が、生活費の表のどこにも現れないまま効いている。

## 収入との関係

2027年の家計に当てはめるとこうなる。

| | 年額 |
| --- | --- |
| 手取り | 約234万円 |
| 賞与（手取り推定） | 約110万円 |
| 生活費（車検込み） | ▲219万円 |
| iDeCo（月62,000円） | ▲74万円 |
| **残り** | **約51万円** |

給料から投資に回せるのは年50万円ほどしかない。NISAの年間枠は360万円なので、まったく足りない。

足りない分をどう埋めるかは[SBI新生の定期に990万円。同じ金利なら3ヶ月でいい、と思ったら違った](/posts/post-mvnhccx3)に書いた。生活費を削って埋めるのではなく、別の原資を当てる形にしている。

## 数え直してみて

やったことは、数字を2つの表に分けただけだ。それでも分かったことがある。

生活費のうち、意思で動かせる部分は思ったより少ない。家賃・食費・固定費で月139,000円はほぼ固定で、動かせるのは年間イレギュラーの467,100円、そのうち34万円はツーリングで、そこは削らないと決めている。

つまり**削れる余地はほとんど残っていない**。これは悲観ではなく、確認だ。支出を削る方向はもう伸びしろがないので、増やす側（収入・利回り・制度の使い方）で埋めるしかない、という前提が確定したことになる。

毎月家計簿をつける予定はない。年に一度、こうして並べ直せば十分だと思っている。

※ 金額は2026年10月時点のもの。料金プランや保険等級は変動する。
', '/media/uploads/1793023297378-hi1ruk.png', 'published', 0, '2026-10-26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '毎月の生活費', '139,000円', '年214万円／車検のある年は219万円', NULL, 0, '2026-10-26 13:44:17', '2026-10-26 14:03:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (29, 'post-mvpd1b6k', 'touring', '山形県｜庄内夕日の丘オートキャンプ場｜入場料440円で泊まれるフリーサイト', 'オートキャンプ場だが、フリーで張れば入場料440円だけで泊まれる。ゴミ袋付き。目の前が庄内空港の滑走路で、夕方は離着陸、日没は日本海の夕日、夜は星。庄内空港ICから1分。', 'オートキャンプ場という名前がついていると、だいたい3,000円前後はかかる。ここも公式を見るとサイト使用料は宿泊3,100円と書いてある。

ただ、このキャンプ場にはフリーで張れるスペースがあって、そこを使う場合は入場料の440円だけで泊まれた。しかもゴミ袋までもらえる。庄内空港のすぐ横、滑走路が見える丘の上にある。

<a href="/media/uploads/1793025025510-5qbd1s.png" target="_blank" rel="noopener"><img src="/media/uploads/1793025025510-5qbd1s.png" alt="庄内夕日の丘オートキャンプ場から見た離陸直後の旅客機とバイク" style="width:280px;border-radius:10px;"></a>

写真は過去に訪れたときのもの。雪が残っているとおり春で、今回泊まった8月とは草の色が違う。

## 基本情報

| 項目 | 内容 |
|---|---|
| 所在地 | 山形県酒田市浜中粮畑33 |
| 電話 | 0234-92-4570（庄内空港緩衝緑地パークセンター） |
| 料金 | 入場料 大人440円／小人220円、未就学児無料（2026年4月改定）。オートサイトは別途サイト使用料 宿泊3,100円 |
| 予約 | オートサイトは2か月前の1日から。フリーは予約不可、飛び込みのみ |
| 時間 | 宿泊 13:00〜翌11:00／日帰り 9:00〜16:00 |
| 営業期間 | 2026年は4月11日〜11月8日 |
| サイト | オート26区画（AC電源15A付）＋フリースペース |
| 設備 | 水洗トイレ、炊事場、温水シャワー（約3分100円）、コインランドリー（各100円）、かまど |
| 地面 | 芝。ペグは問題なく刺さる |
| 注意 | 焚き火シート必須。野生動物注意のため夜間は飲食物を外に出さない |
| アクセス | 日本海東北自動車道 庄内空港ICから約1分 |

訪問は8月9日、1泊。

## サイトと地面

<a href="/media/uploads/1793025012571-ogjiev.png" target="_blank" rel="noopener"><img src="/media/uploads/1793025012571-ogjiev.png" alt="芝のフリーサイトに張ったテントとバイク、奥に庄内空港の滑走路" style="width:280px;border-radius:10px;"></a>

芝で、ほぼ平ら。ペグは普通に刺さるので、鍛造でなくても困らない。傾斜を探して歩き回る必要がないのはありがたい。

区画がないぶん、どこに張るかは早い者勝ちになる。といっても真夏の平日で混み合う感じはなく、場所に困ることはなかった。予約ができない以上、着いてから考えるしかないのだが、ここに関しては賭けにならずに済んでいる。

空港の緩衝緑地という性格上、敷地はかなり広い。隣との距離を取ろうと思えば取れる。

## 飛行機が見える

<a href="/media/uploads/1793025002019-6jp279.png" target="_blank" rel="noopener"><img src="/media/uploads/1793025002019-6jp279.png" alt="滑走路を走行する旅客機と残雪の山並み" style="width:280px;border-radius:10px;"></a>

テントの正面が滑走路。離着陸がそのまま見える。

空港の横と聞くと音を心配するが、庄内空港は便数が限られている。朝と夕方に数便あるだけで、夜中に起こされることはない。むしろ一日に何回かしかないぶん、音が聞こえると顔を上げて見てしまう。

離陸の瞬間を狙うなら、時刻表を調べておくと確実に撮れる。これも14時18分の新幹線と同じで、動かせない時刻を一本持っておくと、その日の予定が組み立てやすくなる。

## 夕日

<a href="/media/uploads/1793025021084-7eud69.png" target="_blank" rel="noopener"><img src="/media/uploads/1793025021084-7eud69.png" alt="庄内夕日の丘オートキャンプ場に沈む夕日とテント" style="width:280px;border-radius:10px;"></a>

名前のとおり、夕日が見える。西側が日本海に向かって開けているので、遮るものがない。

天気次第ではあるが、この日は見えた。丘の上で風が抜けるため、夏でも日が落ちると涼しくなる。テントの入口を西に向けておくと、中に座ったまま最後まで見ていられる。

## トイレ・炊事場・設備

トイレは水洗で、清掃もされている。炊事場は水のみ。温水シャワーが約3分100円で使えるので、風呂に行かない日でも汗は流せる。コインランドリーもあり、長距離の途中で洗濯できるのは地味にありがたい。

ゴミは入場料と一緒にゴミ袋をもらえる形なので、持ち帰らなくていい。無料キャンプ場では全量持ち帰りが基本なので、この差は大きい。440円のうちのいくらかはここに払っていると考えれば納得できる。

夜間は飲食物を外に出さないよう案内がある。クーラーボックスごとテント内か、バイクのケースに入れておく。

## 買い出しと風呂

買い出しはイオン三川店。1階の食品売り場が22時まで開いているので、設営後に出ても間に合う。キャンプ場から車で20分ほど。

風呂はなの花温泉 田田。大人500円で、バイクで15分くらい。朝6時から21時30分まで（最終入館20時45分）と幅が広いので、夜でも朝でも入れる。

この二つが近いおかげで、ここは「とりあえず向かえばなんとかなる」場所になっている。

## 440円の内訳を考える

オートサイトなら入場料440円＋サイト使用料3,100円で3,540円。フリーを使えば440円。差は3,100円で、その3,100円はAC電源と区画の確保分ということになる。

バイクで、電源を使わず、張れる場所さえあればいい自分にとっては、払う理由がない方の3,100円だった。ただしフリーは予約ができないので、確実に泊まりたい日や連休はオートを取るほうが安全だと思う。

## なぜここに泊まるのか

<a href="/media/uploads/1793025017278-dyhvr9.png" target="_blank" rel="noopener"><img src="/media/uploads/1793025017278-dyhvr9.png" alt="夜のキャンプ場、星空の下のテントとバイク" style="width:280px;border-radius:10px;"></a>

440円で、芝のサイトに、水洗トイレとシャワーとゴミ処理がついてくる。日本海東北道の庄内空港ICから1分で、スーパーも温泉も近い。東北を縦に走るときの中継地として、条件が良すぎる。

それでいて、夕方は飛行機と夕日、夜は星が見える。安いから泊まる場所、ではなくなっている。

ほかのキャンプ場は[ツーリング記録の一覧](/theme/touring)にまとめている。

## 参照

- [庄内夕日の丘オートキャンプ場（酒田市）](https://www.city.sakata.lg.jp/sangyo/kanko/rejyashisetsu/syounai_autocamp.html)
- [庄内空港緩衝緑地 施設案内・料金](https://www.in-green.com/sisetu.html)
- [イオン三川店](https://aeontohoku.co.jp/stores/mikawa)
- [なの花温泉 田田](https://www.iroribinosato.info/denden.html)

※料金・営業時間は2026年10月時点で確認したもの。訪問前に公式で最新情報を確認してほしい。', '/media/uploads/1793025250305-hut3rp.png', 'published', 0, '2026-10-26', '庄内夕日の丘オートキャンプ場', '山形県', NULL, 38.849934, 139.904244, NULL, '', '晴れ', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2026-08-08', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-26 14:36:53', '2026-10-29 14:27:34', '無料格安キャンプ場', '東北', '', '営業期間は4月中旬〜11月上旬（2026年は4/11〜11/8）。期間外は利用不可。フリーサイトは予約不可で飛び込みのみ。焚き火シート必須。
二車線道路で問題なし。キャンプ場の通路は一部砂利があるので注意。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (30, 'post-mvqq733y', 'touring', '北海道｜多和平キャンプ場｜380円で雲海の上に泊まる', '2,000ヘクタールの牧場のてっぺんに、1泊380円で泊まれる。朝、テントから出たら雲海の上だった。ただし温泉もコンビニもスーパーも近くにない。買い出しと風呂を済ませてから上がる場所。', '北海道川上郡標茶町。2,000ヘクタールの牧場のてっぺんに、1泊380円のキャンプ場がある。

朝、テントから出たら雲海の上だった。写真を撮って、絶景の中で日の出を見て、それで380円。この記事はその記録。

ただしこの場所、周りに何もない。温泉も、コンビニも、スーパーも。そこだけは先に書いておく。

<a href="/media/uploads/1793107825606-olsrvm.png" target="_blank" rel="noopener"><img src="/media/uploads/1793107825606-olsrvm.png" alt="多和平キャンプ場、牧柵の向こうに昇る朝日とテント" style="width:280px;border-radius:10px;"></a>

## 基本情報

| 項目 | 内容 |
|---|---|
| 所在地 | 北海道川上郡標茶町標茶798-1 |
| 問い合わせ | グリーンヒル多和 015-486-2806 |
| 料金 | 1泊 大人380円／小人220円、日帰り 大人・小人 各110円 |
| 営業期間 | 5月1日〜10月31日（冬季休業） |
| 予約 | 不要・全面フリーサイト |
| 受付 | グリーンヒル多和 |
| サイト | 芝・ゆるい傾斜あり |
| トイレ | 1箇所 |
| 炊事場 | 1箇所・水のみ |
| ゴミ | 持ち帰り |
| 風呂 | 場内になし。近隣にもなし |
| 売店 | グリーンヒル多和（すぐ隣・日中のみ） |

訪問は2023年7月8日、1泊。支払いは大人380円。

## 380円の中身

受付は隣接するグリーンヒル多和。レストランと売店を兼ねた建物で、ここでお金を払う。1泊大人380円。日帰りなら110円。

この金額で何が付いてくるかというと、トイレと炊事場、そして芝のサイト。それだけ。電源もシャワーもない。ただし、この場所の価値は設備ではない。

キャンプ場は多和平展望台の下に広がっている。付近一帯は総面積2,000ヘクタールの標茶町育成牧場で、視界をさえぎるものがない。360度、地平線が見える。

有料のキャンプ場で3,000円払って木立の中に張るのと、380円でこの景色の中に張るのと、どちらが満足度が高いか。少なくともこの日は後者だった。

## サイトと地面

全面フリーサイト。区画はなく、好きなところに張る。景色を堪能したいなら斜面の上の方だが荷物の持ち運びがやや大変なので悩みどころ。運搬用の一輪車はある（確か2台）

地面は芝。ペグは普通に入る。鍛造でなくても問題ない。ゆるやかな傾斜地なので、張る前に寝る向きを決めておくといい。頭が下になると朝つらい。

<a href="/media/uploads/1793107845180-54oy6c.png" target="_blank" rel="noopener"><img src="/media/uploads/1793107845180-54oy6c.png" alt="昼の多和平キャンプ場、芝のサイトと広がる牧場の眺め" style="width:280px;border-radius:10px;"></a>

遮るものがないということは、風も遮られないということ。丘の上なので風が強い日はかなり来るはずだが、この日はほぼ無風だった。運が良かったと思っている。張り綱とペグはしっかり打っておいたほうがいい場所ではある。

7月上旬の夜は冷える。日中が暖かくても、朝方は息が白い程度まで下がることがある。夏用シュラフ1枚だと寒い可能性がある。別の年の9月下旬に来たときはマイナス1度まで下がった。

## 朝のこと

この記事を書いている理由の大半はこれ。

朝、テントから出たら、眼下が雲で埋まっていた。谷筋に雲海がたまり、その上に太陽が出てくる。牧柵のシルエットと、自分のテントと、雲の海。

<a href="/media/uploads/1793107864031-m34eaw.png" target="_blank" rel="noopener"><img src="/media/uploads/1793107864031-m34eaw.png" alt="雲海の上に昇る朝日と多和平キャンプ場のテント" style="width:280px;border-radius:10px;"></a>

雲海は毎回見られるわけではない。前日の湿度と、夜の冷え込みと、風のなさが揃ったときに出る。この日はたまたま条件が揃った。

<a href="/media/uploads/1793107870580-fo0ypt.png" target="_blank" rel="noopener"><img src="/media/uploads/1793107870580-fo0ypt.png" alt="多和平から見た雲海と朝日、牧場の丘に霧がたまる" style="width:280px;border-radius:10px;"></a>

夜は夜で、街灯がほとんどないので星がよく見える。標茶町の公式も「満天の星空が大地と接している」と書いているが、誇張ではない。

つまり多和平は、夜と朝に価値が集中しているキャンプ場ということになる。日中に通過するだけだと、ただの牧場の展望台で終わってしまう。泊まる意味が明確にある場所。

## 着いてからは何も手に入らない

ここが多和平のいちばんの注意点。

まず、近くに温泉がない。キャンプ場から歩ける距離はもちろん、車やバイクで10分圏内の範囲には日帰り入浴施設がない。道東は温泉だらけの土地なので油断しがちだが、この丘の上だけは例外。風呂は、着く前に済ませるものだと考えておいたほうがいい。弟子屈の市街まで出れば入浴施設は数軒ある。

次に、買い出しができる場所も遠い。いちばん近い市街地は弟子屈だが、そこまで車で30分前後かかる。コンビニも同様で、ふらっと行ける距離ではない。夜に「何か足りない」と気づいても、取りに行くという選択肢が現実的に消える。弟子屈市内であれば入浴施設は数軒ある。

場内の売店はグリーンヒル多和だけで、ここも日中の営業。17時を過ぎれば周囲は牧場と自分のテントだけになる。夜に行くのは動物の飛び出しなどもあるため推奨しない。街灯もないため完全な暗闇となる。

実際に使った店はこうだった。

買い出しはフクハラ摩周店（弟子屈町鈴蘭4-1-8／10:00〜21:00）。弟子屈の市街にあるスーパーで、この周辺では品揃えのあるほう。多和平に上がる前にここで食料と飲み物を積んだ。

風呂は鶴居ノーザンビレッジホテルTAITO（鶴居村鶴居西1丁目／日帰り入浴 平日11:00〜22:00・受付21:30、日曜祝日は10:00から／大人700円）。ただしこれは鶴居村で、多和平からはかなり離れているが、モール泉で湯質はかなり良い。キャンプ場から往復する場所ではなく、帯広方面から向かう場合、道中で寄る場所。

もう少し近い選択肢としては、標茶町市街のホテルテレーノ気仙（標茶町桜8-38）が日帰り入浴をやっている。5:30〜8:00と10:30〜21:00という変則的な時間帯で、朝風呂に入れるのは珍しい。それでも市街地までは距離があるので、「近い」というより「まだマシ」という程度。

## 注意点

トイレはグリーンヒル多和の建物近くにある。サイトの奥の方に張ると5分くらい歩くことになるので注意。ただ、手前側は眺めがあまり良くないのでどちらを選択するかは本人次第。

朝の撤収時はカラスに注意。外に置いてあった牛乳を嘴で突かれ、パックに穴が空いてしまい捨てることとなった。集団でいるのでテントの中にしまっておくことを徹底する必要があるが、状況によっては無理やりテントの中に侵入してくるかもしれない。

時期にもよるが、朝は放射冷却で冷え込みが激しい。夏でも10度以下になることもあるため服装には注意。

## 行く前に決めておくこと

この場所は「設備を使いに行く場所」ではなく「景色の中で寝に行く場所」なので、組み立て方が少し違う。

風呂と買い出しは、丘に上がる前に全部終わらせておく。これに尽きる。着いてからできるのは、張ることと、見ることだけ。水はあるが、それ以外は持ち込んだものがすべてになる。

到着は夕方までに。日没の時間に間に合えば、夕焼けと星と朝日を全部拾える。逆に暗くなってから着くと、傾斜も周囲の状況も分からないまま張ることになる。

そして、朝は早く起きる。雲海が出ていたらそこが本番で、昼まで寝ていたら380円の半分は捨てたことになる。

380円で、2,000ヘクタールの牧場のてっぺんに泊まれる。設備は最低限で、周りには何もない。ただしこの場所に求めるものは設備でも利便性でもない。

買い出しと風呂を事前に片付けるという一手間さえかければ、あとは景色しか残らない。雲海は運だが、星は晴れていれば毎回出る。北海道の道東を走るなら、ここを行程の軸にして前後を組み立てる価値がある。

## 関連リンク

- [標茶町公式｜多和平](https://town.shibecha.hokkaido.jp/gyousei/shibecha_gaiyou/shizen/tawadaira.html)
- [標茶町観光協会｜多和平キャンプ場](https://shibecha-kanko.com/tourism/549/)
- [フクハラ摩周店](https://www.fukuhara-arcs.co.jp/store/detail/104163556.html)
- [鶴居ノーザンビレッジホテルTAITO](https://hotel-taito.com/onsen/)

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※料金・営業時間は訪問前に公式で最新情報を確認してほしい。', '/media/uploads/1793108228581-41zs4z.png', 'published', 0, '2026-10-27', '多和平キャンプ場', '北海道標茶町', NULL, NULL, NULL, NULL, '', '晴れ', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2023-08-07', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-27 13:33:03', '2026-10-27 13:48:03', '無料格安キャンプ場', '北海道', '', '温泉・コンビニ・スーパーはいずれも近隣になし。最寄りの市街地は弟子屈で車30分前後。風呂と買い出しは到着前に済ませること。ゴミは全量持ち帰り。朝は放射冷却で冷え込み、夏でも10度以下、9月下旬にはマイナス1度になったことがある。カラスが多く、食料を外に出しておくと確実に荒らされるのでテント内へ。遮るものがない丘の上のため、風の強い日は張り綱とペグをしっかり。トイレは受付棟そばの1箇所のみで、奥に張ると往復5分ほどかかる。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (31, 'post-mvs1isix', 'touring', '北海道｜クッチャロ湖畔キャンプ場｜400円で宗谷を巡る拠点にする', '道北の浜頓別町、クッチャロ湖のほとりにある町営キャンプ場。1泊400円のフリーサイトで、歩ける距離に温泉とスーパーがある。宗谷を巡る拠点として何度も使っている。', '道北の浜頓別町。クッチャロ湖のほとりにある町営のキャンプ場で、1泊400円。ここに連泊して、荷物を置いたまま宗谷を走り回る。それがこのキャンプ場のいちばん正しい使い方だと思っている。2022年9月に2泊、2023年7月にも泊まったが、毎回この形になる。

<a href="/media/uploads/1793186869580-ucux2c.png" target="_blank" rel="noopener"><img src="/media/uploads/1793186869580-ucux2c.png" alt="クッチャロ湖畔キャンプ場の看板とテント" style="width:280px;border-radius:10px;"></a>

※写真は2022年9月と2023年7月の訪問時のものが混ざっている。

## 基本情報

| 項目 | 内容 |
| --- | --- |
| 所在地 | 北海道枝幸郡浜頓別町クッチャロ湖畔 |
| 問い合わせ | 浜頓別町役場 01634-2-2346 |
| 料金 | 中学生以上 400円／1泊、小学生 200円／1泊、未就学児 無料 |
| 連泊割引 | 6連泊目以降は3割引 |
| 車中泊 | 同額 |
| EV電源 | 2,000円／1回 |
| 開設期間 | 4月下旬〜10月末（天候により変動） |
| 予約 | 不要 |
| サイト | フリーサイト（芝） |
| トイレ | 場内にあり、水洗で綺麗 |
| 炊事場 | あり |
| ゴミ | 分別して処理。袋は持参が無難 |
| 風呂 | はまとんべつ温泉ウイング（徒歩圏） |
| 買い出し | スーパーなかむら（約2km） |

## 400円の中身

湖のすぐ横の芝地に、好きな場所でテントを張れる。それで400円。EV電源を使わなければ追加はない。

以前は200円だった。2020年に400円へ上がっているが、それでも道内の町営キャンプ場としては安い部類に入る。値上がりしてなお安いというのは、もともとの設定が相当に低かったということでもある。

6連泊目から3割引になるのも、この場所の性格をよく表している。ここは一晩通過する場所ではなく、腰を据える場所として作られている。

## 受付の場所が時間で変わる

ここだけ少し変則的なので先に書いておく。

受付窓口は時間帯で移動する。10時から19時までは湖畔の管理棟、7時から10時と19時から21時までは、少し離れたはまとんべつ温泉ウイング。水曜だけは終日ウイングが受付になる。

自分が行ったときはいずれも夕方前の到着だったので、管理棟で済んだ。21時を回るような到着だと、その日の受付はできない。到着が遅くなりそうな日は、湖畔ではなく温泉のほうへ先に向かうと覚えておくといい。

## サイトと地面

全面が芝で、ペグはよく刺さる。鍛造でなくても問題ない。

<a href="/media/uploads/1793186859032-ymtg1i.png" target="_blank" rel="noopener"><img src="/media/uploads/1793186859032-ymtg1i.png" alt="芝のフリーサイトに張られたテント" style="width:280px;border-radius:10px;"></a>

湖と林のあいだに細長く開けた土地で、区画はない。テントの間隔はそれなりに取れる。すぐ脇までアスファルトの道が来ているので、バイクを降りて数歩の場所に張れる。荷物を抱えて歩く距離がほぼないのはありがたい。

湖畔なので風を心配していたが、泊まった日はいずれも弱かった。湖側以外を木立が囲っているおかげかもしれない。ただし遮るものがない方角もあるので、強風予報の日は林寄りに逃げたほうが無難だろう。

## 夕日のこと

このキャンプ場の値打ちの半分は、夕方にある。

<a href="/media/uploads/1793186821311-nfzmnv.png" target="_blank" rel="noopener"><img src="/media/uploads/1793186821311-nfzmnv.png" alt="クッチャロ湖に沈む夕日" style="width:280px;border-radius:10px;"></a>

クッチャロ湖は西向きに開けていて、日が湖に沈む。湖面がオレンジ一色になって、そのまま30分くらい色が変わり続ける。テントから一歩も動かずに見られる。

<a href="/media/uploads/1793186839653-kp6i9n.png" target="_blank" rel="noopener"><img src="/media/uploads/1793186839653-kp6i9n.png" alt="夕日に染まるクッチャロ湖とバイク" style="width:280px;border-radius:10px;"></a>

バイクを停めた位置によっては、車体のシルエットが夕日に重なる。これを狙って停め直したことが何度かある。400円の宿としては出来すぎている。

走りに出た日も、この時間までに戻ってくることを前提に組んだ。宗谷を一周した日も、夕方には湖に帰ってきている。

<a href="/media/uploads/1793186845331-cpdkg1.png" target="_blank" rel="noopener"><img src="/media/uploads/1793186845331-cpdkg1.png" alt="オレンジ色に染まる湖面" style="width:280px;border-radius:10px;"></a>

## 白鳥とカモメ

クッチャロ湖はラムサール条約の登録湿地で、白鳥の飛来地として知られている。ただし白鳥の本番は春と秋の渡りの時期で、夏から初秋に行くと主役はカモメになる。

<a href="/media/uploads/1793187318415-prsqoj.png" target="_blank" rel="noopener"><img src="/media/uploads/1793187318415-prsqoj.png" alt="クッチャロ湖畔の杭に止まるカモメ" style="width:280px;border-radius:10px;"></a>
<a href="/media/uploads/1793187327514-vs6snn.png" target="_blank" rel="noopener"><img src="/media/uploads/1793187327514-vs6snn.png" alt="杭の上に並ぶカモメ" style="width:280px;border-radius:10px;"></a>

湖畔に打たれた杭の上に、一羽ずつ律儀に止まっている。朝、テントから出ると大抵そこにいる。人を恐れないが、近づきすぎると順番に飛び立つ。

食料を外に出したまま離れると持っていかれる可能性がある。夜間に限らず、席を立つときは片付けておきたい。

## 連泊して宗谷を巡る

このキャンプ場をいちばん活かせるのは、拠点にする使い方だと思う。

テントを張ったまま、空荷で出る。浜頓別は宗谷の半島の付け根、オホーツク側にある。道道84号で日本海側へ抜けられるので、豊富温泉、オロロンライン、宗谷岬、宗谷丘陵、エサヌカ線。宗谷の走りたい道が、一日で回れる輪の上に並ぶことになる。

一泊ずつ移動していたら、この組み方はできない。毎日テントを畳んで荷物を積み直す時間が、そのまま走れる時間から引かれていく。連泊なら朝は荷造りなしで走り出せるし、戻ってきたときには寝床ができている。6連泊目から3割引になるのは、そういう使い方を町が想定しているからだろう。

晴れた日に宗谷へ出て、天気が崩れた日は湖のそばで休む。そういう選び方ができるのが、拠点型のいちばんの利点だと思っている。

## 買い出しと風呂

どちらも近いのが、このキャンプ場の大きな強みになる。

買い出しはスーパーなかむら。浜頓別の市街地にあり、9時30分から20時、年中無休。キャンプ場から2kmほどで、バイクなら5分かからない。近くにAコープもあるので、品揃えを重視するならそちらという選択肢もある。道北でこれだけ店があるのは恵まれている方だ。

風呂ははまとんべつ温泉ウイング。キャンプ場の受付も兼ねている施設で、日帰り入浴は11時から21時（最終受付20時30分）。14時以降は大人600円、11時から14時までなら450円。4月から10月は朝5時30分からの朝風呂もある。走り出す前にひと風呂浴びてから出発する、という選択肢が取れるキャンプ場はそう多くない。

## 注意点

到着時刻を21時までに収める。これだけは守りたい。受付が閉まる。そのうえで、連泊を前提に組むといい。1泊だけだと、ここは「安くてきれいな湖畔のキャンプ場」で終わってしまう。2泊3泊して空荷で走り回ると、同じ400円がまったく違う意味を持ちはじめる。

開設は4月下旬から10月末だが、天候次第で前後する。9月下旬を過ぎると朝は相当に冷えるので、寝袋は夏用だけだと心許ない。

浜頓別の市街地が近いので、暗くなった後の買い出しも出来なくはない。ただ、町内にもエゾシカなどの動物が普通にいるため注意すること。

クッチャロ湖キャンプ場は他のキャンプ場と比較して人も多いためソロになることは少ないが、食料の管理には気を付けること。

## まとめ

400円で湖のほとりに泊まり、歩いて温泉に行き、スーパーで買い物をして、朝は空荷で宗谷岬へ向かう。

これだけ条件が揃った場所は、北海道でもそう多くない。何度も泊まっているのは、ここが目的地として優れているからではなく、拠点として優れているからだと思う。

次に道北へ行くときも、たぶんここにテントを張る。

## 関連リンク

- [クッチャロ湖畔キャンプ場（浜頓別町）](http://www.town.hamatonbetsu.hokkaido.jp/tourism/detail.php?content=941)
- [はまとんべつ温泉ウイング](http://www.hotel-wing.jp/hot_spring.html)
- [スーパーなかむら](https://ptl.zchain.co.jp/store/462)

- [ツーリング記録の一覧](/theme/touring?cat=touring)', '/media/uploads/1793187556576-gzmgee.png', 'published', 0, '2026-10-28', 'クッチャロ湖畔キャンプ場', '北海道枝幸郡浜頓別町', NULL, 45.117532, 142.360575, NULL, '', '晴れ', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2023-07-23', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-28 11:37:51', '2026-10-28 12:47:02', '無料格安キャンプ場', '北海道', '5月〜9月', '国道238号沿い、浜頓別市街からすぐ。全線舗装で走りやすい。宗谷岬・エサヌカ線方面は北へ、豊富・オロロンラインは道道84号で西へ横断できる。沿道に店がない区間が長いので、エゾシカの飛び出しと給油に注意。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (32, 'post-mvs5i25v', 'touring', '北海道｜宗谷一周ルート｜豊富温泉・オロロンライン・宗谷岬・エサヌカ線を一日で', '浜頓別のクッチャロ湖畔キャンプ場を拠点に、宗谷を一日で一周した記録。道道84号で半島を横断し、オロロンライン、宗谷岬、宗谷丘陵、エサヌカ線と回って戻る約300kmの輪。', '前日は[クッチャロ湖畔キャンプ場](/posts/post-mvs1isix)にて宿泊。テントを張ったまま空荷で宗谷を一周するためだ。

宗谷は走りたい道がばらけているように見えて、実は一本の輪になる。浜頓別を起点にすると日本海側とオホーツク側を両方使って、一日でちょうど回りきれる大きさになる。これに気づいてから、道北では必ずこの形で走るようになった。

<p><a href="/media/uploads/1793194303837-6g36ke.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194303837-6g36ke.png" alt="宗谷丘陵の緑の丘陵地帯とバイク" style="width:280px;border-radius:10px;"></a></p>

## ざっくり基本ルート

*   クッチャロ湖畔キャンプ場 出発
*   【道道84号】豊富浜頓別線で半島を横断、豊富まで
*   豊富温泉 ふれあいセンター
*   【道道444号】豊富町からオロロンラインへ
*   【道道106号】オロロンラインを北上、オトンルイ風力発電所
*   稚内市内を通過
*   【国道238号】宗谷岬
*   宗谷丘陵
*   【国道238号】を南下、エサヌカ線
*   浜頓別のクッチャロ湖畔キャンプ場 到着
※時間があれば利尻礼文サロベツ国立公園に立ち寄るのも良い（無料で散策できる）

走行距離は300km程度。道道84号は信号がほとんどなく、オロロンラインとエサヌカ線は直線が続く。

海と内陸を両方堪能できるルートだ。ただし、周辺に何もない場所を通ることになるのでガソリンや買い出しなどは注意すること。

この輪のいいところは、途中で引き返す判断ができることにある。豊富まで出た時点で天気が崩れていたら、そのまま84号で戻れば半日で終わる。拠点に荷物を置いてあるので、どちらを選んでも困らない。

## タイムライン

このルートに新幹線のような固定された時刻はない。代わりに動かせないのが**日没**だ。クッチャロ湖は西向きで、夕日が湖に沈む。宗谷を一日走った締めがそれになるように逆算すると、一日がきれいに閉じる。

| 時刻 | 場所 | メモ |
| --- | --- | --- |
| 8:30 | クッチャロ湖畔キャンプ場 発 | テントは張ったまま、空荷で出発 |
| 10:00 | 豊富温泉 ふれあいセンター | 10:00開店。ここを逃すと稚内まで風呂はない |
| 11:00 | ふれあいセンターの食堂でジンギスカン定食 | 11:00開店。正午は混雑するので早めに |
| 12:00 | オトンルイ風力発電所 | 日本海側、風車の列 |
| 14:00 | 宗谷岬 | 最北端。20分ほどで出た |
| 15:00 | 宗谷丘陵 | 2車線で快適 |
| 16:00 | エサヌカ線 | 約16kmの直線。この日の締め |
| 夕方 | キャンプ場 着 | 湖に日が沈む時間に間に合う |

逆回り（先にエサヌカ、最後に84号）も成立するが、その場合は夕日を日本海側で見ることになる。どちらで夕方を迎えたいかで、回る向きが決まる。
また、道道84号は山の中を走ることになるため時間が遅くなるほど動物の飛び出しなどのリスクが出てくる。

## 買い出し関連

このルートは途中で補給できる場所が限られる。

給油は浜頓別で満タンにして出る。道道84号の横断区間にスタンドはなく、次に確実に入れられるのは豊富か稚内になる。半分を切ったら入れておくくらいの感覚でちょうどいい。

食事も同様で、豊富と稚内以外はほぼ選択肢がない。稚内であればスーパーや食堂など複数の選択肢があり、敢えてスーパーで弁当などを購入して宗谷丘陵あたりで食べるという手もある。絶景を堪能しながらの食事は何倍も美味しく感じられる。
時間があれば、豊富温泉のジンギスカン定食を是非おすすめする。

<p><a href="/media/uploads/1793194355486-8xe0mq.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194355486-8xe0mq.png" alt="豊富温泉ふれあいセンターのジンギスカン定食" style="width:280px;border-radius:10px;"></a></p>

## 立ち寄りスポット

| スポット | 料金 |
| --- | --- |
| 豊富温泉 ふれあいセンター | 510円 |
| オトンルイ風力発電所 | 無料 |
| 宗谷岬 | 無料 |
| 宗谷丘陵| 無料 |
| エサヌカ線 | 無料 |

この日かかったのは温泉の510円と、食堂のジンギスカン定食だけ。道そのものに金がかからないのが、このルートの性格をよく表している。

## 道道84号 豊富浜頓別線

浜頓別から豊富まで、約59kmで宗谷の半島を横断する道。

沿道に店がほぼない。人家もまばらで、信号も数えるほどしかない。走り出してしばらくすると、両側が牧草地と林だけになる。宗谷一周の最初の1時間半がこれなので、朝イチの身体を起こすにはちょうどいい区間だと思う。ただし、動物の飛び出しには注意。ヒグマも生息している。

ただしこの道は通行止めになることがある。災害や事故で長期間閉まっていた記録もあり、閉まると半島を大きく迂回することになって一日の構成が崩れる。出発前に宗谷総合振興局の規制情報を確認してから出たほうがいい。

冬期通行止め区間もある。このルート自体が夏季限定だと考えていい。

## 豊富温泉 ふれあいセンター

<p><a href="/media/uploads/1793194427768-lppeak.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194427768-lppeak.png" alt="豊富温泉ふれあいセンターの外観" style="width:280px;border-radius:10px;"></a></p>

横断を終えて最初の目的地。町営の日帰り入浴施設で、入浴料は510円。10時から21時まで（最終受付20時30分）。

8時30分にキャンプ場を出ると、ちょうど開店直後に入れる。走り出して90分で風呂というのは順番としておかしく見えるが、ここから先は稚内まで入浴の機会がない。入るならここになる。

油分を含んだ独特の湯で、アトピーや乾癬の湯治地として知られている温泉でもある。普通の温泉のつもりで入ると、匂いと質感に驚く。

稚内の日帰り温泉も悪くないが、豊富温泉は自分にとって外せないスポットだ。

## オトンルイ風力発電所

<p><a href="/media/uploads/1793194311763-9qriz5.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194311763-9qriz5.png" alt="オトンルイ風力発電所の風車の列" style="width:280px;border-radius:10px;"></a></p>

牧草地に風車が一直線に並ぶ風景で、北海道の日本海側を代表する絵になっていた。ただし現在は建て替え工事が進んでいる。従来の750kW×28基から4,200kW×5基へ変わる計画で、3.1kmに並ぶ28本という風景はもう見られないか、見られても残りわずかということになる。

<p><a href="/media/uploads/1793194328944-v8p44o.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194328944-v8p44o.png" alt="建て替え工事が進むオトンルイ風力発電所と重機" style="width:280px;border-radius:10px;"></a></p>

行くなら現状を確認してから判断したい。本数が減っても風車自体は残るが、あの密度の列はなくなる。

## オロロンライン

オトンルイから北上を続ける区間がオロロンラインの本番になる。道道106号に入ると、左は日本海、右はサロベツ原野で、遮るものがほとんどない。晴れていれば利尻富士が海の向こうに浮かぶ。

そこから北上してオロロンライン。道道106号に入ると、左は日本海、右はサロベツ原野で、遮るものがほとんどない。晴れていれば利尻富士が海の向こうに浮かぶ。

<p><a href="/media/uploads/1793194405573-ocjz38.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194405573-ocjz38.png" alt="利尻礼文サロベツ国立公園の看板と海の向こうの利尻富士" style="width:280px;border-radius:10px;"></a></p>

ガードレールも電柱も少なく、道と原野と海しかない。走っていて現在地の感覚が薄くなる区間だ。

風が強い日が多い。横風に振られるので速度は控えめにしたほうがいい。ここで消耗すると、この後の宗谷岬から先が苦しくなる。

## 宗谷岬

<p><a href="/media/uploads/1793194421976-9ss9vv.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194421976-9ss9vv.png" alt="日本最北端の地の碑" style="width:280px;border-radius:10px;"></a></p>

稚内を抜けて国道238号、最北端。

観光地なので人も車も多い。写真を撮るのも待ち時間が発生する。ここは「着いた」という事実が目的の場所で、長く居る場所ではないと思っている。

宗谷岬のシンボルを間近で撮影できるわけではないが、すぐ近くにある宗谷岬公園であれば宗谷湾を見渡すことができる。

<p><a href="/media/uploads/1793194380335-8ya5cb.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194380335-8ya5cb.png" alt="宗谷岬公園から見下ろした宗谷岬と駐車場" style="width:280px;border-radius:10px;"></a></p>

## 宗谷丘陵

宗谷岬から丘の上へ上がると宗谷丘陵。氷河期の名残のなだらかな起伏が延々と続き、木がほとんどない。風車と牧草地だけが見える。

宗谷岬から直接上がっていくのもいいが、おすすめは少し稚内方面に戻ったところにある道道889号の入り口から入る形。こちらだと宗谷丘陵を一から堪能できる。大半の観光客が宗谷岬に行くためか、宗谷丘陵はガラガラで殆ど交通量がない。

<p><a href="/media/uploads/1793194394156-swiqm6.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194394156-swiqm6.png" alt="宗谷丘陵の起伏と風車" style="width:280px;border-radius:10px;"></a></p>

近くに白い道もあるが、未舗装のため自分は通ったことがない。貝殻の上に車の轍による凸凹ができていて、バイクだとハンドルを取られやすいと聞く。重い車体で入るなら速度を落として轍を避けながら進むことになる。砂利道が苦手なら無理に入らず、丘陵の舗装路から眺めるだけでも十分に景色はいい。

## エサヌカ線

この一日の締めがエサヌカ線になる。

猿払村の村道で、全長約16km。途中に2か所クランクがあるが、それ以外はひたすら直線だ。道路沿いに電柱も看板もガードレールもなく、視界を遮るものが何もない。牧草地の中を、道だけが地平線に向かって消えていく。

<p><a href="/media/uploads/1793195604600-qhofuw.png" target="_blank" rel="noopener"><img src="/media/uploads/1793195604600-qhofuw.png" alt="エサヌカ線の直線路に停めたバイク" style="width:280px;border-radius:10px;"></a></p>
<p><a href="/media/uploads/1793194321112-vameig.png" target="_blank" rel="noopener"><img src="/media/uploads/1793194321112-vameig.png" alt="エサヌカ線沿いの牧草地と放牧された牛、停めたバイク" style="width:280px;border-radius:10px;"></a></p>

宗谷岬が「最北端」という記号の場所なら、エサヌカ線は何の記号もない場所だと思う。だからこそ印象に残る。一周ルートの最後にここを置くと、観光地で消費した感覚が全部上書きされる。

## 路面・注意事項

*   道道84号が通行止めだとルートが成立しない。出発前に規制情報を確認する

*   給油は浜頓別で満タン。次は豊富か稚内まで入れられない

*   豊富温泉を逃すと稚内まで風呂はない

*   オトンルイの風車は建て替え中。28本の列は見納めが近い

*   宗谷丘陵は道道889号の入り口から入ると良い。最初から最後まで堪能できる。

*   風の強い日はオロロンとエサヌカが一気にきつくなる。その日は84号の往復と温泉で切り上げたほうが賢い

*   過疎地走行もあり、エゾシカが多い。特に84号の横断区間とエサヌカ線周辺、夕方以降は注意。

*   一日で回る前提で書いたが、連泊していれば「今日は日本海側、明日はオホーツク側」と分けてもいい

## 関連リンク

*   [豊富温泉ふれあいセンター](https://toyotomi-onsen.com/hotspring)
*   [猿払村道エサヌカ線（さるふつ観光協会）](https://sarufutsu.jp/sightseeing/%E3%82%A8%E3%82%B5%E3%83%8C%E3%82%AB%E7%B7%9A/)
*   [宗谷管内 道道の冬期通行止区間](https://www.souya.pref.hokkaido.lg.jp/kk/wkk/douro/R1toukituukodome.html)
*   [クッチャロ湖畔キャンプ場（拠点にしたキャンプ場）](/posts/post-mvs1isix)

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※道路状況・施設の営業状況は訪問時点のものです。特に道道84号、エサヌカ線は通行止めになることがあるため、最新情報をご確認ください。', '/media/uploads/1793195996921-7797rw.png', 'published', 0, '2026-10-28', '宗谷一周', '北海道', NULL, NULL, NULL, 300, '10時間', '晴れ', 'トライアンフ アメリカLT', '浜頓別町→豊富町→稚内市→猿払村→浜頓別町', NULL, NULL, NULL, '2023-07-03', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-28 13:29:16', '2026-11-02 14:14:07', 'ツーリングルート', '北海道', '5月〜10月頃まで（6月〜9月が気候的に最適）', '過疎地を走行するので、ガソリン切れに注意。また動物飛び出し多発エリアなのでスピードは控えめに。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (33, 'post-mvtll4bp', 'touring', '高知県｜咸陽島公園キャンプ場｜無料、だるま夕日の名所に季節外れで泊まる', '', '高知県宿毛市、宿毛湾に突き出た大島の先にある市営の公園。利用料は無料、予約も不要。目の前の海に咸陽島という無人島が二つ浮かんでいて、その向こうに日が沈む。だるま夕日の名所として知られている場所だが、訪れたのは9月で、季節は外れていた。それでもこの夕日だった。

<p><a href="/media/uploads/1793280711361-xw04fx.png" target="_blank" rel="noopener"><img src="/media/uploads/1793280711361-xw04fx.png" alt="咸陽島の向こうに沈む夕日とテント" style="width:280px;border-radius:10px;"></a></p>

## 基本情報

| 項目 | 内容 |
|---|---|
| 所在地 | 高知県宿毛市大島17 |
| 問い合わせ | 宿毛市 商工観光課 0880-62-1242 |
| 料金 | 無料 |
| 予約 | 不要 |
| サイト | フリーサイト（芝） |
| トイレ | 水洗・洋式・24時間・バリアフリー併設 |
| 炊事場 | あり（屋根なし・蛇口2か所） |
| シャワー | 温水 3分100円／冷水は無料 |
| 駐車場 | あり・一部サイトに横付け可 |
| ゴミ | 持ち帰り |
| 直火 | 不可 |

## 張る場所は三つある

公園の中で、テントを張れる場所が大きく分けて三つある。

ひとつめが遊具のある芝生の広場。木陰が多くて風も避けられる。ただし日中は遊具目当てで子供が来るので、昼間に静かに過ごしたいなら向かない。ふたつめがトイレ建物の裏手の草地。地面は少し固いが、車を横付けできる。

三つめが公園入口の向かい側、海沿いのスペース。今回はここにした。

<p><a href="/media/uploads/1793280727720-ww2wrh.png" target="_blank" rel="noopener"><img src="/media/uploads/1793280727720-ww2wrh.png" alt="海沿いのサイトに張ったテントと咸陽島" style="width:280px;border-radius:10px;"></a></p>

理由は単純で、咸陽島と夕日が正面に来るから。すぐ脇をアスファルトの道が通っているので車の音は多少あるが、9月の平日前夜ということもあって気になるほどではなかった。地面は芝で、ペグは普通に刺さる。

海沿いなので風は覚悟していたが、この日は穏やかだった。湾の中なので外洋ほど荒れないのだと思う。ただ遮るものが何もない場所なので、風が強い日は遊具広場側の木陰に逃げたほうがいい。選べるのがこのキャンプ場の良いところで、天候を見てから決められる。

## 夕日のこと

咸陽島は対岸から約300m離れた二つの無人島で、干潮時には歩いて渡れる。名前の由来は、昔この地に漂着した唐船の船員たちが故郷をしのんで呼んだことから来ているという。

<p><a href="/media/uploads/1793280873633-79t234.png" target="_blank" rel="noopener"><img src="/media/uploads/1793280873633-79t234.png" alt="夕日の中のバイクと海" style="width:280px;border-radius:10px;"></a></p>

日本の夕陽百選に選ばれている場所で、本番は11月中旬から2月上旬。晴れた日の夕方に、太陽が水平線に溶けて丸く潰れたように見える「だるま夕日」が現れる。9月の訪問では当然見られない。

それでも、海に沈む太陽が正面にあって、手前に島のシルエットが二つ並ぶという構図は変わらない。テントを張った位置から振り向かずに見られるので、椅子に座ったまま日没を最後まで見届けられる。

<p><a href="/media/uploads/1793280722394-c7b5yd.png" target="_blank" rel="noopener"><img src="/media/uploads/1793280722394-c7b5yd.png" alt="日没後の空と海" style="width:280px;border-radius:10px;"></a></p>

沈んだあとの時間のほうが長い。空の色が変わり続けて、暗くなりきるまで30分ほどある。

## シャワーで済ませた

公園のトイレ棟にシャワールームが併設されている。温水は3分100円、冷水なら無料。更衣室もある。

近くに宿毛リゾート椰子の湯があって、直線で850mほどしか離れていない。坂道にはなるが徒歩でも行けなくはない。日帰り入浴が平日850円、土日900円で、キャンプ場の利用料が無料なのに風呂で850円を払うのはどうかと思って、今回はシャワーにした。100円で3分、9月ならそれで十分だった。

## 買い出し

フジ 宿毛店を使った。食品館が9時から22時まで開いている。キャンプ場からは車で10分ほど。公園には売店も自販機以外の店もないので、酒も食料もここで揃えておく。

18時30分頃に行ったら、惣菜と刺身にもう半額が貼られていた。22時閉店の店で18時半に半額が出るのは早いほうで、都内の感覚だと19時過ぎからが相場になる。地方の店はこのあたりの時間が読みにくいので、閉店時刻から逆算しただけでは外すことがある。結果的には得をした。

帰り道は暗く狭いので、日が落ちる前に戻るつもりで動いたほうがいい（後述）。

## 注意事項

トイレの道路側にウッドデッキの休憩テラスがあるが、ここでのテント使用は禁止されている。雨の日に使いたくなる場所だが、公園利用者のための設備なので従いたい。

直火は不可。ゴミは全量持ち帰り。炊事場は公園の手洗い場も兼ねていて子供も使うので、残飯を流さないように気をつける。

夜間のトイレはセンサーで照明が点く。サイト側に照明はないので、ライトは必要。

キャンプ場までの道のりは一部勾配が急で通路も狭いので注意。アクセス方法は大きく海側か山側（宿毛リゾート側）かになるが、山側であればホテルまでは2車線のためこちらが安全。ただ下り坂になるのとヘアピンカーブを曲がることになるのでそこだけ注意。

海側は殆ど1車線の狭い道なので夜の走行はおすすめしない。

## その他メモ

大島へは片島から大島橋を渡って入る。島に入ってからのルートは注意事項に書いたとおり。駐車場からサイトまでは徒歩10秒で、バイクならほぼ横付けできる。

春は桜の名所、夏は海水浴場として賑わう場所なので、その時期は空いている保証がない。9月下旬は他に1組いただけだった。

次に来るなら11月以降にしたい。だるま夕日を見るためだけに、この場所をもう一度組み込む理由がある。

## 関連リンク

- [咸陽島公園（宿毛市）](https://www.city.sukumo.kochi.jp/docs-18/p0302.html)
- [フジ 宿毛店](https://www.the-fuji.com/fuji/store/shop/kochi/fuji_sukumo.php)
- [宿毛リゾート 椰子の湯](https://yashinoyu.com/onsen.html)

他の記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめている。', '/media/uploads/1793281423040-fybaop.png', 'published', 0, '2026-10-29', '咸陽島公園キャンプ場', '高知県宿毛市', NULL, NULL, NULL, NULL, '', '晴れ', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2026-09-22', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-29 13:47:18', '2026-10-29 14:01:42', '無料格安キャンプ場', '四国', '', '', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (34, 'post-mvtmw6m3', 'touring', '秋田県｜県立中央公園ファミリーキャンプ場｜1泊300円、空港の真横で2連泊', '秋田空港を囲む県立公園の中にあるキャンプ場。1泊300円で芝のサイトに泊まれて、管理人は24時間常駐、トイレはウォシュレット、シャワーは100円。飛行機の音はするが、夜は静か。2連泊して中日に男鹿半島を一周した。
', '秋田市雄和、秋田空港のすぐ隣にある県立公園のキャンプ場。1泊300円で、芝のサイトに泊まれる。2026年8月9日から11日まで、2連泊した。

空港を囲むように公園が広がっているので、飛行機の音はする。それを承知で選ぶ場所だ。

<p><a href="/media/uploads/1793283595837-hu1env.png" target="_blank" rel="noopener"><img src="/media/uploads/1793283595837-hu1env.png" alt="第3サイトの芝に張ったテント" style="width:280px;border-radius:10px;"></a></p>

## 基本情報

| 項目 | 内容 |
|---|---|
| 所在地 | 秋田県秋田市雄和椿川字駒坂台4-1 |
| 問い合わせ | 018-886-8118 |
| 料金 | 宿泊 一般・学生300円／高校生以下150円（1人1泊） |
| 日帰り | 一般・学生100円／高校生以下50円 |
| 予約 | 必要（予定日の5日前16時まで） |
| 期間 | 4月下旬〜11月中旬 |
| チェックイン | 9:30から |
| チェックアウト | 最終日11:00まで |
| サイト | 第1〜第4の芝サイト（車両乗り入れ不可） |
| 管理人 | 24時間常駐 |
| トイレ | 管理棟・24時間・ウォシュレットあり |
| シャワー | 管理棟・24時間・100円 |
| 洗濯機 | 200円 |
| ロッカー | 100円 |
| 直火 | 不可（焚き火台は可） |
| ゴミ | 持ち帰り |

2連泊しても600円。安さの桁が違う。

## 予約は5日前まで、だが

公式には予定日の5日前16時までに電話予約が必要とある。当日飛び込みはできない。

それを知らずに、前日にダメもとで電話をかけた。結果はOKだったが、そのときに「原則5日前まで」という説明を受けた。受け入れてもらえたのは空きがあったからで、制度が緩いわけではない。真似をするなら、断られる前提で電話したほうがいい。

連泊も同じ流れだった。最初は1泊で取っていたが、受付でもう1泊できるか聞いたら許可が出た。管理人が24時間常駐しているので、こうした相談がその場でできる。ただし空きがあったからこその返事で、延長を当てにして計画を組む話ではない。

## 第3サイト

サイトは第1から第4まである。使ったのは第3サイト。

第1・第2サイトへ向かう通路の途中、右手の坂を登った先にある。周囲を木が囲んでいて、他のサイトから見えにくい。家族連れは第1・第2に集まりやすいので、ソロで静かに過ごしたいならここになる。

<p><a href="/media/uploads/1793283604631-zfmqwv.png" target="_blank" rel="noopener"><img src="/media/uploads/1793283604631-zfmqwv.png" alt="第3サイトへ続く通路と芝のサイト" style="width:280px;border-radius:10px;"></a></p>

車もバイクも、サイトへの乗り入れはできない。荷下ろしのあいだだけは通路に停めてよいが、積み下ろしが終わったら駐車場まで戻す決まりになっている。設営中ずっと横に置いておくことはできないので、荷物を下ろす→車両を戻す→歩いて戻って設営、という順になる。撤収も同じで、片付けが済んだ段階で車両を通路まで入れる。

<p><a href="/media/uploads/1793283600241-lk53c9.png" target="_blank" rel="noopener"><img src="/media/uploads/1793283600241-lk53c9.png" alt="荷下ろしのため通路に停めたバイク" style="width:280px;border-radius:10px;"></a></p>

第3サイトは坂を登った先にあるぶん、この往復がやや面倒ではある。それでも、この静けさとは釣り合う。

地面は芝。ペグは問題なく刺さる。

## 管理棟とシャワー

トイレとシャワーはどちらも管理棟にあり、24時間使える。

トイレはウォシュレット付き。公営のキャンプ場で300円という価格帯だと、水洗であるだけで上等という場所も多いなかで、ここはその上を行く。

シャワーは100円。中は清潔で、使うのに気を使う場所ではなかった。8月の2連泊だったので毎日使った。近くに温泉を探しに行く必要がない。

管理人が24時間常駐しているのも、この管理棟が機能している理由だと思う。夜中にトイレへ行っても人の気配があるというのは、ソロだと地味に効く。

熊について聞いたら、「ここでは出たことがない」という返事だった。秋田の山で熊の話を聞かない年はないので念のため確認したが、空港の隣で人の出入りが多い立地が効いているのかもしれない。もちろん絶対はないので、食料の扱いは普通に気をつける。

## 飛行機の音

秋田空港の滑走路を囲む形で公園があるので、音は結構する。

同じく空港のそばにある[庄内夕日の丘オートキャンプ場](/posts/post-mvpd1b6k)は便数が限られていて、ほとんど気にならなかった。秋田は違う。離着陸のたびに頭上で音が通る。

ただ、夜間の便はない。就寝時間に入れば静かになる。昼間にテントの中でゆっくり寝ていたい人には向かないが、夜の睡眠が妨げられることはなかった。むしろ、頭上を通る機体を見ながら過ごすのが目的になるくらいの場所だと思っている。

## 2日目は男鹿半島へ

2連泊にしたのは、中日を丸ごと走るためだった。

テントを張ったまま、空荷で男鹿半島を一周してきた。秋田市内からだと片道1時間ほどで、日帰りでちょうど回りきれる距離にある。荷物を置いて出られるぶん、同じ道でも身軽さがまったく違う。

このときのルートは別の記事にまとめる。

## 買い出し

キャンプ場の周囲に店はない。公園の外に出て、御所野方面まで20分ほど走ることになる。

いちばん使いやすいのはスーパーセンターアマノ 御所野店。9時から21時まで、年中無休で開いている。食品だけでなく日用品も揃うので、忘れ物をしたときもここで片が付く。

イオンモール秋田も同じ御所野エリアにある。品揃えは最も多いが、駐車場からの距離があるので、食料だけならアマノのほうが早い。

フレスポ御所野にあったジェイ・マルエー御所野店も使ったが、こちらは2026年10月15日で閉店した。店舗の賃貸契約満了による閉店で、今から行く人は選択肢から外していい。

いずれにしても片道20分かかる。連泊するなら、初日にまとめて買っておいたほうが時間を無駄にしない。

## 注意事項

予約は予定日の5日前16時まで。電話予約が必須で、当日の飛び込みはできない。連泊や延長の相談は管理人が常駐しているのでその場でできるが、空きがある場合に限られる。

車もバイクもサイトへの乗り入れは不可。荷下ろしのあいだだけ通路に停められるが、終わったら駐車場まで戻す。第3サイトは坂の上なので、この往復をひと手間と見るかどうかで評価が変わる。

直火は禁止。焚き火台を使う。ゴミは全量持ち帰り。ペット同伴は第4サイトのみ。花火は手持ちのみ可。

飛行機の音は昼間しっかり聞こえる。夜間便はないので就寝時間は静かだが、昼寝を目的に来る場所ではない。

木陰の少ないサイトがあり、8月の日中は日差しが強い。タープを用意するか、木のあるサイトを選ぶ。

営業期間は4月下旬から11月中旬まで。冬季は閉鎖される。

## その他メモ

秋田空港から車で5分ほど。公園内にはフィールドアスレチック、パークゴルフコース、マウンテンバイクコースがあり、どれも別料金で利用できる。キャンプだけで完結させなくていい場所だ。

## 関連リンク

- [秋田県立中央公園](https://www.akisouko.com/chuo/)
- [ご利用料金（秋田県立中央公園）](https://www.akisouko.com/chuo/price3.html)
- [スーパーセンターアマノ](https://www.sc-amano.jp/)

他の記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめている。', '/media/uploads/1793283791956-ez305d.png', 'published', 0, '2026-10-29', '県立中央公園ファミリーキャンプ場', '秋田県秋田市', NULL, NULL, NULL, NULL, '', '晴れ', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2026-08-09', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-29 14:23:54', '2026-10-29 14:29:29', '無料格安キャンプ場', '東北', '', '秋田空港から車で10分、秋田中央ICからも近い。公園までのアクセスは全線2車線で、大型車もすれ違える広さがある。買い出しから戻る道で困ることはないがキャンプ場周辺は街灯はないので夜の走行は注意。
公園内の通路は舗装済み。第3サイトへは坂を登るが、こちらも舗装されている。設営時に通路まで車両を入れられるので、未舗装路を走る場面はない。
御所野エリアのスーパーまでは片道20分。幹線道路を使うので路面は良いが、イオンモール周辺は夕方に混む。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (35, 'post-mvv14llq', 'touring', '秋田県｜男鹿半島一周ルート｜寒風山・ゴジラ岩・入道崎を一日で', '男鹿半島は、一日で一周できる。
付け根の寒風山から先端の入道崎まで、距離にして片道1時間半ほど。その狭い範囲に、草原の山と、ゴジラの形をした岩と、火山湖を見下ろす展望台と、北緯40度線の灯台が詰まっている。しかも展望台はどこも無料で、この日かかったのは昼食と夕食の代金だけだった。
秋田市のキャンプ場を2連泊にして、中日をまるごと男鹿に使った。テントを張ったままなら荷物を積み直す必要がない。朝8時に空荷で出て、夕方17時過ぎに戻る。走った距離は200km程度。', '前日と翌日は[秋田県立中央公園ファミリーキャンプ場](/posts/post-mvtmw6m3)に泊まった。空港の隣にある1泊300円のキャンプ場で、ここを拠点にすると男鹿の付け根まで1時間かからない。

男鹿半島は秋田市から近い。付け根の寒風山までは1時間かからず、先端の入道崎まで行っても片道1時間半ほど。それでいて半島の中に展望台と岩と海と食堂が詰まっているので、一日でちょうど回りきれる。

<p><a href="/media/uploads/1793369445728-9loyen.png" target="_blank" rel="noopener"><img src="/media/uploads/1793369445728-9loyen.png" alt="寒風山の丘陵地帯とバイクと海" style="width:280px;border-radius:10px;"></a></p>

## ざっくり基本ルート

*   秋田県立中央公園ファミリーキャンプ場 出発
*   【国道7号・国道101号・県道54号】寒風山
*   【県道55号】ドジャース 男鹿店（買い出し）
*   【県道59号】ゴジラ岩（潮瀬崎）
*   【県道59号】大桟橋展望台
*   【県道59号・なまはげライン】八望台
*   【県道55号】入道崎
*   【国道101号・県道55号・県道59号】恵比寿食堂（船越）
*   【国道101号・国道7号】ポートタワー・セリオン
*   キャンプ場 到着

走行距離は200km程度。半島をぐるりと一周して戻る形になる。全線2車線で、入道崎までの道も含めて走りにくい区間はない。男鹿半島の海岸沿いは交通量も少なく快走できる。

この順番にしたのには理由がある。買い出しを前半のドジャースで済ませ、昼を八望台で食べ、先端の入道崎を午後に置く。帰りに船越で夕食、最後にセリオンという流れにすると、同じ道を二度通らずに済む。

## タイムライン

| 時刻 | 場所 | メモ |
| --- | --- | --- |
| 8:00 | キャンプ場 発 | テントは張ったまま、空荷で出発 |
| 9:00 | 寒風山 | 半島の付け根。展望台には登らず |
| 10:00 | ドジャース 男鹿店 | 昼食を調達。水曜定休 |
| 11:00 | ゴジラ岩 | 潮瀬崎。干潮時のほうが近づける |
| 11:30 | 大桟橋展望台 | 西海岸。木造の展望台 |
| 12:00 | 八望台 | ここで昼食 |
| 13:30 | 入道崎 | 半島の先端 |
| 15:30 | 恵比寿食堂 | 船越。ホルモン。17:30まで |
| 16:30 | ポートタワー・セリオン | 展望室は無料 |
| 17:00過ぎ | キャンプ場 着 | 明るいうちに戻れる |

8時に出て17時過ぎに戻る、9時間強の行程だった。急ぐ必要はないが、恵比寿食堂が17時30分で閉まるので、夕食をここで取るつもりなら逆算が要る。

## 買い出し

ドジャース 男鹿店を使った。船川港にあるディスカウントストアで、9時30分から19時まで。スーパーとしてはかなり安めの部類。地物も結構多く珍しい商品も置いてあり、見て回るのも楽しい。

ここで昼食を買って八望台へ持っていった。半島の先端側は店が少ないので、午前のうちに食料を確保しておくと後が楽になる。

注意点がひとつ。毎週水曜が定休日だ。水曜に走るなら、男鹿市街手前の船越あたりにいとく男鹿店とスーパーセンターアマノ男鹿店もあるのでそちらに立ち寄るのも良い。

## 立ち寄りスポット

| スポット | 料金 |
| --- | --- |
| 寒風山 | 無料（回転展望台は有料） |
| ゴジラ岩 | 無料 |
| 大桟橋展望台 | 無料 |
| 八望台 | 無料 |
| 入道崎 | 無料 |
| ポートタワー・セリオン | 無料 |

この日かかったのは、ドジャースの買い物と恵比寿食堂のホルモンだけ。展望台はどこも無料で、半島の景色そのものに金がかからない。

## 寒風山

<p><a href="/media/uploads/1793369628045-8pptm8.png" target="_blank" rel="noopener"><img src="/media/uploads/1793369628045-8pptm8.png" alt="寒風山の山頂標識と青空" style="width:280px;border-radius:10px;"></a></p>
<p><a href="/media/uploads/1793369678517-ad2gxy.png" target="_blank" rel="noopener"><img src="/media/uploads/1793369678517-ad2gxy.png" alt="寒風山から見た秋田市方面の海岸線" style="width:280px;border-radius:10px;"></a></p>

半島の付け根にある標高355mの山。草に覆われたなだらかな山体で、木がほとんど生えていない。山頂まで舗装路で上がれる。

4階建ての回転展望台があり、こちらは有料。今回は登らなかった。登らなくても、駐車場からの眺めで十分に半島の形が見える。秋田市方面の海岸線と、その奥に鳥海山。反対側に男鹿の山々。

ここに最初に来ると、この日これから回る範囲が一望できる。地図を見るより早い。

## ゴジラ岩

<p><a href="/media/uploads/1793368611868-7gby03.png" target="_blank" rel="noopener"><img src="/media/uploads/1793368611868-7gby03.png" alt="ゴジラ岩と海岸の岩場と海" style="width:280px;border-radius:10px;"></a></p>

潮瀬崎の岩場にある、ゴジラが口を開けた形に見える岩。

夕日を背負ったシルエットの写真で有名な場所だが、午前中に行くと順光で岩の質感がよく見える。混雑もない。バイクの場合は広い路肩に停める。

岩場を歩いて近づける。ただし足元は濡れた岩で滑りやすく、ライディングブーツだと歩きにくい。潮の加減で近づける範囲が変わるので、無理をしないほうがいい。

## 大桟橋展望台

<p><a href="/media/uploads/1793368619251-sn2aq9.png" target="_blank" rel="noopener"><img src="/media/uploads/1793368619251-sn2aq9.png" alt="大桟橋展望台から見た西海岸の岩場と海" style="width:280px;border-radius:10px;"></a></p>

ゴジラ岩から県道59号を北へ進んだ先、船川港本山門前の海岸にある展望台。

大桟橋は海に突き出した玄武岩の奇岩で、火山活動でできた岩を波が削ってできた地形。男鹿半島・大潟ジオパークの西海岸ジオサイトに数えられている。岩に開いた穴は道路側からは見えず、戸賀発の遊覧船で下をくぐると見えるらしい。

展望台自体は木造でそこそこ高さがある。高所が苦手だと足がすくむという声もある場所だが、上がると海岸線が一望できる。駐車スペースから数歩なので、通りすがりに寄れる。

## 八望台

戸賀湾と入道崎の中間あたりにある展望台。ここで昼を食べた。

二ノ目潟と戸賀湾が見下ろせて、振り返ると寒風山の方向が見える。平成2年にできた展望台で、名前は高松宮殿下が命名したと伝わる。

<p><a href="/media/uploads/1793368624770-glc48x.png" target="_blank" rel="noopener"><img src="/media/uploads/1793368624770-glc48x.png" alt="八望台から見た二ノ目潟と戸賀湾" style="width:280px;border-radius:10px;"></a></p>

ドジャースで買ったものをここで広げた。テーブルがあるわけではないので、適当に腰を下ろして食べることになるが、見える景色が代金に含まれていると思えば安いものだ。宗谷でも同じことをやった。スーパーで買って景色のいい場所で食べるのが、結局いちばん満足度が高い。

## 入道崎

<p><a href="/media/uploads/1793368633712-kj9458.png" target="_blank" rel="noopener"><img src="/media/uploads/1793368633712-kj9458.png" alt="入道崎の白黒の縞模様の灯台" style="width:280px;border-radius:10px;"></a></p>

半島の先端。北緯40度線が通っていて、地面に線を示すモニュメントがある。

白黒の縞模様の灯台と、草原と、その先の海。遮るものがないので風が強い。晴れていれば水平線がまっすぐ見える。

観光地なので売店や食堂が並んでいるが、ここで食べずに八望台で済ませておくと、滞在を景色だけに使える。

## 恵比寿食堂

<p><a href="/media/uploads/1793369943801-0nvjyj.png" target="_blank" rel="noopener"><img src="/media/uploads/1793369943801-0nvjyj.png" alt="恵比寿食堂のホルモン定食" style="width:280px;border-radius:10px;"></a></p>

船越駅前にある食堂。「エビスといえばホルモン」と言われる店で、ホルモン煮込みが看板になっている。

営業は10時30分から17時30分（土曜は17時、月曜は早じまいすることがある）。日曜定休。一日走ったあとに寄るには、閉店時刻の逆算が必要になる。

半島を一周して戻ってくる途中にあるので、順路としても無理がない。走り終わりの一杯というわけにはいかないが、ホルモンで一日を締めるのは悪くない。

## ポートタワー・セリオン

<p><a href="/media/uploads/1793368584525-0rvdh6.png" target="_blank" rel="noopener"><img src="/media/uploads/1793368584525-0rvdh6.png" alt="セリオンから見た秋田港の夕景" style="width:280px;border-radius:10px;"></a></p>

秋田港にある高さ100mのタワー。道の駅あきた港に併設されている。

展望室は無料で、9時から21時まで開いている。100mの無料展望台というのはなかなかない。日本海と秋田市街、それに一日かけて回ってきた男鹿半島が、まとめて見える。

最後にここへ寄ると、朝から走った範囲が全部視界に入る。一日の締めとしてよくできた場所だと思う。

<p style="font-size:13px;color:#9a9aa0;">※この写真は別の機会（ゴールデンウィーク）に寄ったときのもの。この日は夕方までに戻る行程だったので、日没前にキャンプ場へ帰っている。</p>

## 風呂

潟上市のきららの湯が帰り道の途中にある（500円）。この日は寄るつもりだったが、湯の故障で入れず、キャンプ場のシャワー（100円）で汗を流した。拠点にしたキャンプ場は管理棟のシャワーが24時間使えるので、風呂に入れなくても困らない。

## 路面・注意事項

*   ドジャース男鹿店は水曜定休。昼食を当てにするなら曜日を確認する

*   恵比寿食堂は17時30分まで、日曜定休

*   半島の先端側は店とスタンドが少ない。給油は男鹿市街で済ませる

*   ゴジラ岩の岩場は滑る。バイク用ブーツだと歩きにくい

*   入道崎は風が強い。夏でも羽織るものがあるといい

*   寒風山の回転展望台は有料。登らなくても駐車場からの眺めで十分

*   夕日を主役にするなら、ゴジラ岩と入道崎を午後に回す逆ルートになる

## 関連リンク

*   [道の駅あきた港 ポートタワー・セリオン](https://www.selion-akita.com/facility/)
*   [寒風山回転展望台](https://www2.akita-chuoukotsu.co.jp/kanpuzan/)
*   [ディスカウントショップ ドジャース](https://dodgers.co.jp/)
*   [秋田県立中央公園ファミリーキャンプ場（拠点にしたキャンプ場）](/posts/post-mvtmw6m3)

他の記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめている。

※道路状況・施設の営業状況は訪問時点のものです。最新情報をご確認ください。', '/media/uploads/1793370506711-0yde6n.png', 'published', 0, '2026-10-30', '男鹿半島巡り', '秋田県', NULL, NULL, NULL, 200, '10時間', '晴れ', 'トライアンフ アメリカLT', '秋田市→潟上市→男鹿市→潟上市→秋田市', NULL, NULL, NULL, '2026-08-11', NULL, NULL, NULL, NULL, NULL, 0, '2026-10-30 13:50:08', '2026-11-02 14:13:14', 'ツーリングルート', '東北', '4月〜10月頃まで', '全線二車線で快走路。男鹿半島は交通量も少ないが海沿いに商店やガソリンスタンドは殆どないため、男鹿市内で準備しておくこと。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (36, 'post-mvvnqszt', 'life', 'ツーリング9日間の現地出費が25,500円だった話｜節約というより相性の問題', '9日間走って、現地で使ったのは25,500円だった。宿代も食事代も風呂代も込みで、1日あたり約2,800円。ガソリンと高速代を足した総額でも、国内宿泊旅行の平均単価とそう変わらない。2026年に行った東北と四国の実額を全部並べて、どこに金が出ていってどこに出ていかないのかを数えた記録。', '出発前に予算を決めて行ったわけではない。帰ってきてレシートと記録を並べたら、この金額だったというだけだ。

この話をすると「よく我慢できるね」と言われるが、我慢している実感がない。使っていないものは、もともと欲しくないものばかりだった。逆に、削っていないものもある。年末が近いので、2026年に行った2本のツーリングの出費を、ガソリン代と高速代まで含めて全部数え直してみた。

## 年間でいくら使っているか

ツーリング関連で年間に確保している枠はこうなっている。

| 区分 | 金額 | 頻度 |
|---|---|---|
| 長距離ツーリング | 150,000円 | 年1回 |
| 中距離ツーリング | 70,000円 | 年1回 |
| 近場のツーリング | 120,000円 | 月平均10,000円 |
| **合計** | **340,000円** | |

ただしこれは枠の話で、毎年この通りに使うわけではない。去年は北海道に1回、今年は東北に2回（ゴールデンウィークとお盆）と四国で3回になった。区分どおりに年1回ずつ、とはなっていない。総額が枠に収まっていればいいという運用をしている。

## 削っていないもの

先に、削っていない部分を書いておく。

食事は削らない。1日1,500円前後は使っている。スーパーの半額惣菜が中心だが、これは節約の手段であると同時に楽しみでもある。土地の魚が安く並んでいるのを見つけるのが面白い。

風呂も削らない。日帰り温泉は1回300円から750円で、毎日入る。キャンプが続くと風呂は体力の問題になる。

道具も削らない。安物で済ませて買い直す方が高い。

## 使っていないもの

酒、煙草、ギャンブル、ゲーム課金、推し活。このあたりに一円も使っていない。これは節約の工夫ではなく、もともと興味がないだけだ。我慢している人と同じ結果になっているが、過程がまったく違う。

節約記事でここを「努力」として書くと嘘になるので、相性の問題として書いておく。

## 旅のやり方

### 移動は一般道が基本

高速道路は原則として使わない。使うのは自宅から目的地エリアまでの移動だけで、現地に着いたら一般道で走る。二輪の定額プランや定率割引がある区間はそれを使う。

そもそもバイクに乗っている理由が「走ること」なので、一般道の方が目的に合っている。節約と目的が一致している数少ない部分だ。あとは、地方は信号が少なく比較的スムーズであること、バイパスや無料高速で代用可能であることも大きい。

例えば東北の例では、最寄りの高速IC〜新潟西IC（約300km）は高速にして、その後新潟バイパス（無料）、日本海東北自動車道（一部区間/無料）で距離を稼ぐようにする。

帰りは八戸方面から東北自動車道か三陸道（無料）の選択肢があったが、こちらも多少日程に時間があったので三陸道で南下するようにした。これだけでも3,000円程度は浮くし、近くのスポットにも気にせず立ち寄ることができる。

### 宿は無料から数百円のキャンプ場

これが一番大きい。実際に泊まったところを挙げると、こうなる。

-   [咸陽島公園キャンプ場](/posts/post-mvtll4bp)（高知）無料
-   [秋田県立中央公園ファミリーキャンプ場](/posts/post-mvtmw6m3)（秋田）300円
-   [多和平キャンプ場](/posts/post-mvqq733y)（北海道）380円
-   [クッチャロ湖畔キャンプ場](/posts/post-mvs1isix)（北海道）400円
-   [庄内夕日の丘オートキャンプ場](/posts/post-mvpd1b6k)（山形）440円

場所にもよるが基準は1泊1,000円までで、この範囲でだいたい見つかる。市町村や都道府県が運営している公園のキャンプ場は、この価格帯が多い。

東北や四国は無料格安キャンプ場が多く、上記条件を満たせるが、関東・東海地方や関西地方は厳しいかもしれない。

### 曜日で宿を組み替える

四国に行ったのはシルバーウィークだった。連休の前半は宿がどこも高いか埋まっているので、前半は無料のキャンプ場だけで組んだ。美濃田の淵、宮の前公園（2泊）、咸陽島公園で4泊。そのあと平日に入ってから、3,000円前後のホテルを3泊続けた。

シルバーウィーク期間は一般的なビジネスホテルが素泊まりで2万〜でとても手を出す気は起きなかった。（それでも最終的には売り切れたようなので需要はあるのだろう）

キャンプ場は曜日で料金が変わらない。ホテルは変わる。この差を利用して並べ替えるだけで、8泊で8,500円、1泊あたり1,063円になった。

### 連泊の途中に1日、屋根の下で寝る

テントが続くと洗濯物がたまるし、体力も落ちる。東北では8泊のうち1泊を温泉宿にして、四国では後半3泊をホテルにした。洗濯、休養、風呂をこの日にまとめて片付ける。

天気が良くない日（曇りや雨）を休息日とするのが良い。晴れの日は少しもったいなく感じる。

ホテルに併設されているランドリーは格安ホテルでも意外とあるので、それを活用すると効率が良い。

### 基準を超えた日の話

東北では1泊6,980円の宿に泊まっている。基準の1,000円を大きく超えているので、理由を書いておく。

その前の3泊が440円、300円、300円だった。天気が良くなく、洗濯もしたかった。温泉が入り放題で、日帰り温泉750円を2回分と考えれば実質5,500円ほどになる。ゴールデンウィークに同じ宿へ4,980円で泊まった経験があり、5,000円台で泊まる価値のある宿だと分かっていた。

結果として8泊の平均は1,628円に収まっている。1泊単位で基準を守るのではなく、旅全体の平均で見ている。

### 夕食はスーパーの半額

閉店時刻から逆算して、半額シールが貼られる時間に行く。これは自宅での習慣がそのまま旅先に出ているだけで、旅行用の節約術ではない。

土地のスーパーは面白い。並んでいる魚が違うし、惣菜の種類も違う。四国ではフジ、秋田ではスーパーセンターアマノ、北海道では弟子屈のフクハラといった具合に、行った先の店が記録に残っている。宝探しのようなもので、これを苦行だと感じたことはない。

飲み物は水筒を持っていて、足りない分だけ1.5リットルのペットボトルを買う。9日間で1,000円程度だった。

### 風呂は日帰り温泉で済ませる

1回300円から700円。東北9日間で2,720円、四国9日間で3,000円だった。

なの花温泉 田田（山形）が500円、浪岡温泉（青森）が540円、姉戸川温泉（青森）が330円、松ノ湯（青森）が350円、美濃田の湯（高知）が700円、道後温泉（愛媛）が700円。東北の方が安い傾向がある。

場所にもよるが東北でいえば、青森、秋田、山形は日帰り温泉が安い傾向。岩手は普通、宮城は高めか。

### 行き先そのものに、ほとんど金を払っていない

宿と食事の話ばかりになりがちだが、実際に大きいのはここかもしれない。有料の観光施設にほとんど行っていない。

[男鹿半島を一日かけて回った日](/posts/post-mvv14llq)、入場料を払った場所はゼロだった。寒風山（山頂からの眺めは無料で、回転展望台だけ有料）、ゴジラ岩、大桟橋展望台、八望台、入道崎、ポートタワー・セリオンの展望室。全部タダで、しかもどれも男鹿を代表する景色だ。[宗谷を一周した日](/posts/post-mvs5i25v)も同じで、宗谷岬も宗谷丘陵もエサヌカ線も、走って立ち止まるだけなら一円もかからない。

バイクで走っていると、そもそも目的地が「道」や「岬」や「丘」になる。建物に入らないので、入場料という概念があまり出てこない。

### ただし、払うときは払う

東北の最終日、石巻の震災遺構・門脇小学校に600円払って入った。これは削る対象ではない。行かないと分からないものには払う（一度震災の状況を知りたかったというのもある）。

線引きははっきりしていて、「その場所でしか得られないか」で決めている。展望台から見る景色は、隣の無料の駐車場からでも八割がた見える。残り二割に有料分の価値があるかは、毎回その場で判断する。寒風山では上がらなかったし、セリオンは無料だったので上がった。

### 無料スポットの探し方

地方であれば、たいていのスポットは無料だ（有名な観光地や市街地は別）。Googleマップでその日の行き先をざっくり決めたら、あとは近くにある自然系のスポットや、眺めの良さそうな場所を拾っていくだけになる。

一部では駐車場が有料のこともあるが、ほとんどは無料だ。無料スポットを探しているというより、地方を走っていると有料の場所にあまり出会わない、というのが実感に近い。

### 道具の元は取れているか

キャンプ道具一式は5万円から10万円かかる。これを旅費に含めずに「宿代400円」と言うのはフェアではないので、計算しておく。

1泊3,000円のビジネスホテルの代わりだと考えると、34泊で元が取れる。年に15泊するなら2年ちょっとだ。道具は手入れすれば10年はもつので、長期では確実に回収できる。

逆に、年に2泊か3泊しかしないなら、素直に宿に泊まった方が安い。年に何泊するかを先に見積もれば、買うべきかどうかは計算で出る。

自分の道具はすでに100泊ほど使っているが、まだ使い倒していくつもりだ。

それと、金額とは別のメリットがある。繁忙期でも寝床に困らないことだ。ホテルは当日になると全室売り切れということが多々あるが、キャンプ場なら予約不要のところが多く、たどり着けば泊まれる。

### 計算どおりにいかない日もある

秋田で、潟上市のきららの湯（500円）に寄るつもりが故障で入れず、キャンプ場のシャワーで済ませた日があった。この日は結果的に400円安くなったが、逆に高くつくこともある。

対策はひとつで、代替案を必ず一つ持っておく。風呂が駄目ならシャワー、スーパーが閉まっていたらコンビニ、キャンプ場が満杯なら道の駅。予定を詰めすぎると、崩れたときに高い選択肢しか残らない。

## 実例：9日間を2回

2026年に行った2本の実額を出す。ガソリン代と高速代まで含めた。

### 東北ツーリング（8月8日〜8月16日）

| 項目 | 金額 |
|---|---|
| 宿泊（8泊） | 13,020円 |
| 食事・飲料 | 15,050円 |
| 風呂 | 2,720円 |
| コインランドリー・その他 | 900円 |
| **現地合計** | **31,690円** |
| ガソリン（約2,200km） | 約17,300円 |
| 高速 | 8,380円 |
| **総額** | **約57,400円** |

現地分だけなら1日あたり3,521円。6,980円の宿を除くと1日2,745円になる。移動費を足した総額では1日あたり約6,400円。

### 四国ツーリング（9月18日〜9月26日）

| 項目 | 金額 |
|---|---|
| 宿泊（8泊） | 8,500円 |
| 食事 | 12,000円 |
| 飲料 | 1,000円 |
| 風呂 | 3,000円 |
| コインランドリー | 1,000円 |
| **現地合計** | **25,500円** |
| ガソリン（約1,200km） | 約9,400円 |
| フェリー（往復） | 51,480円 |
| 高速 | 約1,400円 |
| **総額** | **約87,800円** |

現地は1日あたり2,833円。移動費を足すと1日あたり約9,800円になる。オーシャン東九フェリーが片道25,740円、往復51,480円で、これだけで総額の59%を占めた。

現地でいくら切り詰めても、移動手段を決めた時点で総額の半分以上が決まっている。四国はそれが露骨に出た例だ。

### ガソリン代と高速代の計算

日々の支出のように記録していないので、燃料費は概算になる。

車両はトライアンフ アメリカLT（865cc）で、燃費は約23km/L。ハイオク指定で、全国平均は181円前後だった（レギュラーは2026年10月26日時点で170.1円）。この181円で計算している。高速は二輪車定率割引で、1回の走行が80km超なら37.5%引きになる。

| | 走行距離 | ガソリン | 高速・船 | 現地 | 総額 |
|---|---|---|---|---|---|
| 東北 | 約2,200km | 約17,300円 | 8,380円 | 31,690円 | 約57,400円 |
| 四国 | 約1,200km | 約9,400円 | 約52,900円 | 25,500円 | 約87,800円 |

走った距離は東北が四国の2倍近いのに、総額は東北の方が3万円安い。差は船代だ。

ではフェリーをやめて自走すればいいかというと、そう単純でもない。往復の高速代とガソリン代に加えて、道中で2泊増える。関西方面は無料や格安のキャンプ場が少ないので、その2泊は宿代がかかる。計算すると総額の差はあまり出ない。それなら寝ている間に移動が終わる方を選ぶ、という判断だった。

船代が高いのは事実だが、「船をやめれば安くなる」わけではない。遠くへ行くこと自体にかかる費用だと思っている。

なお年間の枠34万円に対して、ここで挙げた2本で約14万5,000円。これにゴールデンウィークの東北と近場のぶんが乗るので、今年は枠をほぼ使い切る形になりそうだ。

## 平均と比べてみる

観光庁の2025年の統計では、日本人の国内宿泊旅行の単価は1人1回あたり72,412円、前年比4.4%増となっている。日帰りは約20,000円、宿泊と日帰りを合わせた全体では48,424円。

| | 泊数 | 金額 |
|---|---|---|
| 国内宿泊旅行の平均 | 1〜2泊 | 72,412円 |
| 東北ツーリング | 8泊 | 約57,400円（移動費込み） |
| 四国ツーリング | 8泊 | 約87,800円（移動費込み） |

平均の「1回」には1泊や2泊が多く含まれるので、泊数がまるで違う。それを踏まえると、東北は8泊して平均を下回った。四国は平均を超えているが、超えた分はほぼ全額が船代だ。

現地での生活費だけで比べるなら、東北が31,690円、四国が25,500円。1泊あたりに直すと3,000円前後で、平均の数分の一になる。

## 浮いた分はどこへ行くか

旅行で浮いた金をどこかに貯めているわけではない。毎月の積立額が先に決まっていて、生活費と旅行費を引いた残りが自動的にそちらへ回る構造になっている。

だから旅行枠の34万円は、使い切っても計画が崩れない。使わなければそのぶん積立が増える。節約のモチベーションを維持する工夫は特にしておらず、残高だけを見ている。

## どこまで真似できるか

正直なところ、全部は真似できないと思う。仕分けしておく。

### 誰でもできること

-   **移動手段を先に検討する。** 四国の例のとおり、ここで総額の半分以上が決まる。現地での節約より先に手をつける部分だ。
-   **曜日をずらす。** 連休の前半をキャンプ、後半の平日をホテルにするだけで、同じ日数でも宿代が半分以下になる。
-   **飲み物を水筒にする。** 1日400円としても9日間で3,500円。これは誰でも今日からできる。夏場は氷を入れておくことで低温を維持できることもメリット。
-   **有料施設に入る前に、無料で見える範囲を確認する。** 払う価値があるときはある。ただし「来たから入る」で払うと、一日で2,000円、3,000円はすぐに積み上がる。

### 真似しにくいこと

-   テントで寝られるかどうか。これは体質と好みの問題で、無理な人には無理だ。
-   半額シールを探すのを楽しめるかどうか。苦痛だと感じる人がやると長続きしない。
-   酒を飲まないこと。1日1,000円でも9日間で9,000円違う。ただし飲む人にとっては旅の中身そのものなので、削れと言うつもりはない。

## まとめ

9日間で現地25,500円という数字は、特別な技を使って作ったものではない。宿を無料から数百円のキャンプ場にして、夕食をスーパーで買って、見るものに金を払わず、酒を飲まない。それだけで積み上がった結果だ。

ガソリンと高速代を足しても、東北は9日間で約5万7,000円だった。国内宿泊旅行の平均が1回あたり7万円を超えていることを思えば、泊数の割にはかなり安い。

年に2回か3回、同じやり方で走っている。ゴールデンウィークに東北に行ったときも構成はほぼ同じだった。毎回ゼロから計画を立て直していないので、準備の負担も少ない。

節約のつもりで始めたわけではなく、やりたいことをやったら結果的に安かった。そういう順番の話として読んでもらえればと思う。

## 関連リンク

-   [観光庁 旅行・観光消費動向調査](https://www.mlit.go.jp/kankocho/tokei_hakusyo/shohidoko.html)
-   [資源エネルギー庁 石油製品価格調査](https://www.enecho.meti.go.jp/statistics/petroleum_and_lpgas/pl007/results.html)
-   [咸陽島公園キャンプ場（高知・無料）](/posts/post-mvtll4bp)
-   [秋田県立中央公園ファミリーキャンプ場（秋田・300円）](/posts/post-mvtmw6m3)
-   [多和平キャンプ場（北海道・380円）](/posts/post-mvqq733y)
-   [クッチャロ湖畔キャンプ場（北海道・400円）](/posts/post-mvs1isix)
-   [庄内夕日の丘オートキャンプ場（山形・440円）](/posts/post-mvpd1b6k)
-   [男鹿半島一周ルート](/posts/post-mvv14llq)
-   [宗谷一周ルート](/posts/post-mvs5i25v)
-   [ツーリング記録の一覧](/theme/touring)
', '/media/uploads/1793406257937-w02844.png', 'published', 0, '2026-10-30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '9日間の現地出費', '25,500円', '1日あたり2,833円', NULL, 0, '2026-10-31 00:23:15', '2026-10-31 00:45:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (37, 'post-mvvoxcm5', 'asset', '従業員持株会に上限まで入れて、3か月ごとに全部売る', '勤務先の従業員持株会に、月と賞与の上限まで入れている。年間の拠出は180万円、会社からの奨励金が36万円。ただし株は持ち続けず、3か月ごとに全部売ってインデックスファンドに移す。奨励金だけを受け取って、集中投資は引き受けないという考え方と、そのために先に決めたルールの記録。', '勤務先に従業員持株会があり、2026年9月の給与分から拠出を始めた。月々と賞与、どちらも規約上の上限まで入れている。

ただし株を持ち続けるつもりはない。3か月ごとに全部売って、インデックスファンドに移す。奨励金だけをもらって、自社株の値動きは引き受けないという形にしている。

まだ始めて3か月目なので、うまくいったという話ではない。制度をどう読んで、どういうルールを先に決めたかの記録として書いておく。

## 従業員持株会とは何か

給与と賞与から天引きで自社株を買い続ける社内制度だ。多くの会社で、拠出額に対して会社が奨励金を上乗せしてくれる。

奨励金の率は会社によって違う。東京証券取引所の2024年度調査によると、持株会を持つ上場企業3,265社のうち96.6%にあたる3,154社が奨励金を支給している。金額は拠出金1,000円あたりで表され、最も多いのは100円以上150円未満で全体の43.9%。そのうち100円ちょうど、つまり10%の会社が1,391社と大半を占める。平均は107.24円だった。

うちは拠出金1,000円あたり200円、率にして20%だ。同じ調査で200円以上を支給している会社は全体の11%ほどなので、高い部類に入る。10,000円拠出すると12,000円分の株が買える計算になる。

もうひとつの特徴は、単元に満たない株数でも買えることだ。通常の株式投資は100株単位での購入になるが、持株会は拠出額に応じて小数点以下の株数まで積み上がっていく。毎月決まった額を同じ銘柄に入れ続けるので、ドルコスト平均法がそのまま機能する。

## いくら入れているか

| 区分 | 金額 | 回数 |
|---|---|---|
| 月次拠出 | 100,000円 | 年12回 |
| 賞与拠出 | 300,000円 | 年2回 |
| **年間拠出** | **1,800,000円** | |
| 奨励金（20%） | 360,000円 | |

どちらも規約で決められた上限いっぱいだ。手取りは当然そのぶん減るが、毎月の生活費が139,000円に収まっているので回せている。

## なぜ上限まで入れるのか

理由はひとつで、奨励金が実質的な利回りとして大きすぎるからだ。

拠出した瞬間に20%上乗せされる。これは市場でどうこうして得られる水準ではない。インデックスファンドの期待リターンが年4%から7%と言われている中で、入金した時点で20%が確定するのだから、使わない理由が見つからなかった。

ただし注意点がある。奨励金は給与所得として課税される。36万円がまるごと手元に残るわけではなく、所得税と住民税が引かれる。それでも税引後で考えて、配当の再投資分も含めた年間の純増は26万円ほどになる見込みだ。株価の動きで上下10万円くらいは振れると思っている。

## なぜ3か月ごとに売るのか

ここが一番考えた部分になる。

自社株を持ち続けるのは、給与と資産を同じ会社に賭けることになる。会社の業績が悪化したとき、給与も賞与も株価も同時に下がる。生活の基盤と投資先が完全に重なっているので、分散の観点では最悪の形だ。

奨励金は欲しい。でも集中投資は引き受けたくない。この2つを両立させるには、買ったらすぐ売るしかない。

そこで3か月ごとに引き出して売却し、全世界株式のインデックスファンドに移すことにした。売却のサイクルは年4回で、月末に申請すると翌月の上旬に代金が入る。賞与が乗るサイクルでは1回あたり約8.7万円、通常のサイクルでは約4.3万円が手取りになる見込みだ。

ただし単元未満の株は引き出せないので、実際には100株単位で切り出すことになる。端数は持株会の中に残り続ける。

## 売る前に確認したこと

自社株の売却には、普通の株式投資にはない制約がある。ここは法務に確認してから決めた。

### 都度の事前申出が必要

売却するたびに会社へ申し出て、承認を得る必要がある。承認までに2営業日かかる。思い立った日に売れる仕組みではないので、サイクルを先に決めておいた方が楽だ。

### 禁止期間がある

決算日から決算発表日までの間は売却できない。この期間は業績の数字を知りうる立場にあるとみなされるためだ。

さらに法務からは、発表の翌営業日以降にするよう推奨された。発表当日は株価が大きく動くので、タイミングを選んだと見られかねないという理由だった。四半期ごとに決算があるので、年間で見るとそれなりの期間が売却できないことになる。

### 買うときは規制されない

逆に、毎月の定額買付はインサイダー取引規制の対象外になっている。あらかじめ決めた額を自動で買い続けるだけで、本人の判断が介在しないからだ。だから拠出は何も気にせず続けられる。制約がかかるのは売るときだけになる。

## 運用ルールを先に決めた

売却のたびに迷わないよう、紙に書いて決めてある。

**株価は見ずに成行で全株売る。** 高いか安いかを判断し始めると、売らない理由がいくらでも出てくる。「もう少し上がってから」で持ち続けるのが一番避けたい結果なので、見ないことにした。

**決算発表日当日は売らない。** 法務の推奨に従う。

**売った金はその月のうちに全世界株式へ移す。** 現金のまま置いておくと使い道を考えてしまう。

**奨励金率が10%を下回ったら休止する。** 奨励金が目的で入っている以上、率が下がれば前提が変わる。

このうち最初の一つが一番大事だと思っている。ルールの中身よりも、売る前に迷わない仕組みを作ることの方が効く。

## 奨励金が下がったらどうするか

持株会に入る理由が奨励金である以上、率が変われば判断も変わる。制度は会社の業績や方針で見直されるので、下がる可能性は常にある。

先に線を引いておいた。

| 奨励金率 | どうするか |
|---|---|
| 15%以上 | 今のまま上限まで拠出する |
| 10%〜15% | 続けるが、拠出額を見直す |
| 10%未満 | 休止する |

### なぜ10%で切るのか

拠出した瞬間に10%上乗せされるとしても、それは1回きりの利益だ。年間の拠出額に対する利回りとして見ると、見た目ほど大きくはならない。12月に入れた分は、年が明けるまで1か月しか経っていない。

そのうえ奨励金には所得税と住民税がかかる。税率を20%とすると、10%の奨励金は手取りベースで8%になる。さらに売却までに株価が動くリスクを負う。

ここまで削っていくと、インデックスファンドをただ積み立てるのと大差ない水準になる。それなら、売却のたびに申請して承認を待つ手間をかける意味がない。10%というのはそういう計算で出した線だ。

ちなみに10%という水準は、調査でいえば最も会社数の多い価格帯にあたる。つまり「平均的な持株会なら続ける意味が薄い」という結論になるので、これは自分の奨励金率が高いことを前提にした線引きだと断っておく。

### 退会ではなく休止を選ぶ

規約上、一度退会すると約1年間は再入会できない。奨励金が一時的に下がっただけで退会してしまうと、戻ったときに入れない。

休止なら拠出を止めるだけで、会員の資格は残る。率が戻ったら再開できる。制度の変更は往復することがあるので、戻れる形にしておきたい。

### 率が上がる場合もある

下がる話ばかり書いたが、逆もある。その場合も上限は上限なので、こちらの行動は変わらない。すでに上限まで入れているから、増やす余地がない。

これは上限まで入れていることの副作用で、良い変化があっても受け取れる量が決まっているということになる。

## 受け皿の口座を先に作る

売却代金を受け取るには、持株会と提携している証券会社に自分の口座が必要になる。

提携先がどの証券会社になるかは会社が決めるので、こちらでは選べない。すでに別の証券会社でNISAをやっていても、持株会用に新しく口座を作ることになる場合が多い。開設には1週間から2週間かかるので、初回の売却を考えているなら早めに手を付けた方がいい。

口座の種類には選択肢がある。特定口座（源泉徴収あり）にしておくと、売却益の税金が自動で引かれて確定申告が不要になる。一般口座を選ぶと自分で損益計算をすることになる。年4回も売るなら、間違いなく源泉徴収ありが楽だ。

## 1年の流れ

毎月と毎回の賞与で拠出があり、3か月ごとに売却が入る。文章だと分かりにくいので、1年を通した動きを並べておく。

| 時期 | やること |
|---|---|
| 毎月 | 給与から100,000円を天引きで拠出（手続き不要） |
| 賞与月（年2回） | 賞与から300,000円を拠出（手続き不要） |
| 3か月ごと・月末 | 売却を申し出る。承認に2営業日 |
| 申出の翌月上旬 | 売却代金が証券口座に入金される |
| 入金後、同じ月のうち | 全額を全世界株式のインデックスファンドへ |
| 年1回 | 奨励金率と規約の変更がないか確認する |

実際に手を動かすのは、3か月ごとの売却申請と、その後の買付だけになる。年8回、1回あたり10分ほどの作業だ。拠出は天引きなので何もしなくていい。

売却の月は、決算の前後を避けて決めている。禁止期間は四半期ごとに来るので、サイクルを一度組んでしまえば毎回同じ月になる。

### 気をつけている時期

**年の変わり目。** 売却益が出れば譲渡所得になる。特定口座（源泉徴収あり）にしておけば自動で処理されるが、年間の損益は把握しておきたいので、年末に一度だけ確認する。

**賞与の直後。** 一度に300,000円が出ていくので、賞与の手取りが思ったより少なくなる。別の支出をこの月に重ねないようにしている。

**奨励金率の改定時期。** 制度は会社の都合で変わる。年に一度は規約を読み直すことにしている。

## 向いている人と、そうでない人

**向いている。** 奨励金の率が10%以上あり、売却ルールを機械的に守れる人。あとは、毎月の拠出で手取りが減っても生活が回る人。

**向いていない。** 生活費がぎりぎりの人。持株会は積立額の変更に手続きが要るので、家計が苦しくなったときの機動性が低い。

**特に注意が必要。** 売らずに持ち続けるつもりの人。奨励金につられて上限まで入れて、そのまま10年置くと、資産のかなりの割合が1社に集中する。それを承知で会社の将来に賭けるなら一つの判断だが、「なんとなく売りそびれた」で同じ状態になるのは避けたい。

## これからやること

初回の売却申請が11月30日で、入金は12月8日ごろの見込みだ。実際にいくら入って、いくら税金が引かれたのかは、終わってから数字で書き直すつもりでいる。

あとは、勤務先に自社株の取引に関する誓約書の提出義務がないかを自分で点検しておく。部署によっては追加の制約がかかることがあるので、これは先に確認しておきたい。

制度の名前は同じでも、奨励金の率も上限も売却の手続きも会社ごとに違う。ここに書いたのはあくまで自分の勤務先での話なので、詳細は自分の規約で確認してほしい。

## 関連リンク

-   [日本証券業協会 持株制度に関するガイドライン](https://www.jsda.or.jp/shijyo/minasama/mochikabu_mochitoushiguchi/mochikabuGL_250101.pdf)
-   [日本取引所グループ 従業員持株制度とは](https://www.jpx.co.jp/glossary/sa/196.html)
-   [日本取引所グループ インサイダー取引規制](https://www.jpx.co.jp/regulation/preventing/insider/)
-   [日本取引所グループ 従業員持株会状況調査](https://www.jpx.co.jp/markets/statistics-equities/examination/04.html)
-   [東京証券取引所 2024年度 従業員持株会状況調査結果（PDF）](https://www.jpx.co.jp/markets/statistics-equities/examination/tvdivq0000001xhe-att/employee_2024.pdf)
-   [ツーリング9日間の現地出費が25,500円だった話](/posts/post-mvvnqszt)
-   [資産運用の記録一覧](/theme/money)', '/media/uploads/1793408380280-9sqoci.png', 'published', 0, '2026-10-31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '持株会の年間拠出', '	1,800,000円', '奨励金 +360,000円（拠出額の20%）', NULL, 0, '2026-10-31 00:56:20', '2026-10-31 01:07:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (38, 'furusato-tax-2026', 'asset', 'ふるさと納税の返礼品が、2か月で1,500円値上がりしていた', '今年は59,000円を一つの自治体に寄付した。同じ返礼品を8月と10月に頼んだら、価格が1,500円違っていた。制度改正の前後が、自分の購入履歴にそのまま残っていた記録。', '## そもそもどういう制度なのか

先に全体の流れを書いておく。知っている人は飛ばしてほしい。

ふるさと納税は、寄付をすると税金が安くなる制度だ。正確には「好きな自治体に寄付すると、その金額から2,000円を引いた分が、翌年払う税金から差し引かれる」という仕組みになっている。

税金が減る額と寄付した額がほぼ同じなので、払う総額は2,000円しか変わらない。それなのに返礼品はもらえる。これが「お得」と言われる理由だ。減税というより、払う先を自治体に付け替えて、おまけを受け取っているイメージが近い。

手順は五段階になる。

| 段階 | やること | 時期 |
|---|---|---|
| 1 | 自分の上限額を調べる | 寄付する前 |
| 2 | 自治体を選んで寄付する（決済する） | 12月31日まで |
| 3 | 返礼品と「寄附金受領証明書」が届く | 寄付の数週間後 |
| 4 | ワンストップ特例の申請書を出す、または確定申告する | 翌年1月10日／3月中旬 |
| 5 | 税金が減る | 翌年6月から |

一番大事なのは1番目だ。上限額は収入と家族構成で決まり、人によって数万円単位で違う。ここを調べずに寄付すると、2,000円で済むはずの自己負担が膨らむ。

4番目を忘れると、ただの寄付になる。返礼品はもらえるが税金は一円も減らない。申請を出して初めて制度として完成する。

5番目については、ワンストップ特例を使った場合は全額が住民税から引かれる。所得税の還付はなく、翌年6月から翌々年5月までの12回に分けて、毎月の住民税が少しずつ減っていく。確定申告した場合は所得税の還付と住民税の控除に分かれるが、合計額はほぼ変わらない。

つまり「払った実感はあるのに、戻ってくる実感は薄い」制度でもある。給与明細の住民税が月あたり数千円減るだけなので、気づかないまま終わる人もいると思う。自分は住民税決定通知書が来たら、金額が合っているか見るつもりでいる。

## 自己負担2,000円とは何なのか

「実質2,000円」という言い方を何度も見てきたが、自分もしばらく意味がわかっていなかった。調べたので整理しておく。

これは「適用下限額」という決まりから来ている。寄附金控除はもともと「2,000円を超えた部分から控除する」という設計になっていて、ふるさと納税もその土台に乗っている。だから計算式はすべて「寄付額 − 2,000円」から始まる。差し引かれる2,000円が、そのまま自己負担として残るという意味だ。

重要なのは、この2,000円が寄付1回ごとではなく、年間で1回ぶんだということ。何回寄付しても、何自治体に寄付しても、上限を超えない限り負担は2,000円のままだ。

自分は今年4回に分けて59,000円を寄付したが、自己負担は合計2,000円。1回あたりに均すと500円になる。逆に言えば、2,000円しか寄付しない人は全額が自己負担になり、何も戻らない。この制度は、ある程度まとまった額を寄付したほうが効率がいい。

もう一つ誤解しやすいのが、「2,000円を引いた金額が現金で戻ってくる」わけではないという点だ。戻るのではなく、翌年払う税金が減る。財布から出ていく総額が2,000円増えるだけで、その代わりに返礼品が手元に残る——という形になる。

だから「2,000円で返礼品が買える」のではなく、「払う税金の行き先を自治体に変えて、手数料2,000円を払う」と考えるほうが実態に近い。

## 今年いくら寄付したか

2026年のふるさと納税は、北海道長万部町に4回、合計59,000円を寄付した。返礼品はすべて同じで、蒸しほたて1.6kgの冷凍パック。4回で6.4kgになる。

寄付先は1自治体だけ。あちこちに分散させていない。理由は単純で、冷凍庫に入る量と、食べ切れる量と、自分が本当に欲しいものを考えたら、これ一つに絞るのが一番無駄がなかったからだ。自己負担の2,000円は寄付の回数ではなく年間で1回ぶんなので、分散しないことによる損はない。

スーパーで半額の刺身を買うのを楽しみにしている人間が、年に一度だけ6.4kgのほたてを手に入れる。この落差が気に入っている。

## 同じ返礼品が2か月で1,500円上がっていた

購入履歴を見ていて気づいたことがある。

- 8月18日の注文：14,000円
- 10月7日の注文：15,500円

同じ自治体の、同じ返礼品、同じ1.6kgで、差が1,500円。率にして約10.7%の値上がりだ。

寄付額1,000円あたりの内容量で見ると、8月は約114g、10月は約103g。同じ1,000円で、ほたてが11g減った計算になる。

## 2026年10月に何が変わったのか

ちょうどこの間に、制度の改正が入っている。

総務省は2025年6月24日付で告示を改正し、2026年10月以降の指定対象期間から新しい基準を適用すると発表した。見直されたのは地場産品の認定基準、セット品の構成比率、そして自治体が寄付金を事業に使う割合などだ。

自治体が事業に充てる割合は2026年10月から52.5%以上とされ、2029年までに段階的に60%へ引き上げられる。裏を返せば、返礼品や送料や手数料に使える部分が減っていくということになる。

8月と10月の1,500円差が、この改正によるものだと断定はできない。ほたての相場そのものが動いた可能性もあるし、自治体ごとの事情もある。ただ、時期は見事に重なっている。

そして方向としては、今後も同じ寄付額で受け取れる量は減っていく可能性が高い。「去年と同じ金額で頼んだのに量が少ない」という場面は、これから何度か出てくると思っている。

## ポイントがなくなった後、何を基準に選ぶか

もう一つ、前提が変わっていることがある。

ポータルサイトのポイント還元は2025年9月末で終了し、2025年10月以降は原則として禁止された。かつては「どのサイト経由で寄付するか」で数%の差がついたが、その差はもうない。

結果として、選び方がシンプルになった。サイトを比較する意味が薄れたぶん、見るべきものが「寄付額あたりの内容量」と「本当に使い切れるか」の二点に収束する。

自分の場合、判断は次の順番だ。

1. 冷凍庫に入り切るか
2. 一人で食べ切れる量か
3. 寄付額1,000円あたりの量が去年より悪化していないか

3番目が、今年から特に効いてくる項目になった。去年の履歴が残っているなら、同じ返礼品の去年の寄付額と比べてみるといい。自分は比べたことで1,500円の差に気づいた。

## 上限額は持株会で動いた

今年もう一つ変わったことがある。9月から従業員持株会を始めたことだ。

奨励金は拠出額の20%で、これは給与所得として課税される。9月から12月までの月次ぶんと、冬の賞与ぶんを合わせると、今年の給与収入は十数万円ほど上乗せされる計算になる。

ふるさと納税の控除上限は、収入と各種控除で決まる。収入が増えれば上限も上がる。年収600万円・独身（扶養なし）の目安がおよそ77,000円とされているので、奨励金の上乗せを含めれば8万円前後までは見込めそうだ。

ただしこれはあくまで目安で、iDeCoの掛金や社会保険料の実額で変わる。自分は年末調整でiDeCoを申告するぶん、課税所得が下がって上限も下がる方向に働く。実際に追加で寄付する前に、ポータルサイトの詳細シミュレーションに源泉徴収票の数字を入れて確認するつもりだ。

収入が増えたら枠も増える、という当たり前の話だが、気づかないと取りこぼす。給与以外の収入が増えた年は、ふるさと納税の上限も一度計算し直すといい。

## iDeCoをやると枠は減る

上限額の話には続きがある。自分はiDeCoもやっているので、その影響を調べた。

iDeCoの掛金は小規模企業共済等掛金控除として全額が所得控除になる。課税所得が減るので、所得税も住民税も下がる。これがiDeCoの節税効果だ。

ところが、ふるさと納税の上限は住民税所得割額の2割で決まっている。課税所得が減れば住民税も減り、その2割である上限も一緒に縮む。つまりiDeCoをやるほど、ふるさと納税の枠は小さくなる。

ではどちらを取るべきか、という話になるが、これは比べるまでもなかった。

| | 効果 |
|---|---|
| iDeCo | 年間の節税額が十数万円規模 |
| ふるさと納税の枠減少 | 数千円分枠が縮む |

自分の場合、iDeCoによる節税は年間で約14.9万円になる見込みだ。対してふるさと納税の上限が縮むのは、掛金額にもよるが数千円の範囲にとどまる。桁が二つ違う。iDeCoを削ってふるさと納税の枠を広げるのは、完全に本末転倒になる。

一般的にも、両者を併用した場合はiDeCoの節税効果のほうが大きいので併用したほうが得、とされている。順番としては「iDeCoを先に決めて、残った枠でふるさと納税をする」が正しい。

ただし計算の順序だけは注意がいる。上限額のシミュレーションをするとき、iDeCoの掛金を入力しないと枠を多く見積もってしまう。自分は2027年から掛金が月62,000円に上がる予定なので、来年は今年よりさらに枠が縮む。来年の寄付額を今年と同じ感覚で決めると超過しかねないので、必ず計算し直すつもりだ。

## ワンストップ特例は「自治体数」ではなく「申込数」

ここが一番間違えやすいところだと思う。

ワンストップ特例が使える条件の一つは「1年間の寄付先が5自治体以内」。同じ自治体に何回寄付しても1自治体としてカウントされるので、自分の4回はすべて長万部町だから、自治体数は1。条件は余裕でクリアしている。

ただし、申請書は1枚ではない。同一自治体への寄付であっても、申込ごとに申請書を提出する必要がある。本人確認書類も申込ごとに付ける。

つまり自分の場合、必要なのは4セットだ。「1自治体だから1枚でいい」と思い込むと、3回ぶんの控除が消える。

なお、ワンストップ特例が使えるのは確定申告をしない人に限られる。自分はiDeCoを年末調整で申告するので確定申告は不要の見込みで、持株会の売却も特定口座（源泉徴収あり）なので申告不要。この前提が崩れたら——たとえば医療費控除を出すことになったら——ワンストップは無効になり、確定申告で寄付金控除を申告し直すことになる。

紙で出す以外に、オンライン申請という方法もある。マイナンバーカードとスマートフォンがあれば、申請書の郵送も本人確認書類のコピーも不要になる。対応している自治体に限られるが、自分のように同じ自治体へ複数回寄付していると、4セット分の書類を用意する手間がそのまま消えるので差は大きい。

## 上限を超えたらどうなるのか

残り枠の話をする前に、超えた場合のことを調べておいた。「上限を超えると全額自己負担」という説明をよく見かけるが、これは正確ではない。

ふるさと納税の控除は三つの部分でできている。

1. 所得税の寄附金控除：（寄付額 − 2,000円）× 所得税率
2. 住民税の基本分：（寄付額 − 2,000円）× 10%
3. 住民税の特例分：残りを埋めて、自己負担を2,000円に収める部分

上限額というのは、このうち3番目に天井があることから来ている。特例分は住民税所得割額の2割を超えられない決まりで、ここに達すると3番目だけが打ち止めになる。

止まるのは3番目だけで、1番目と2番目は超過分にも効き続ける。自分の所得税率は20%（復興特別所得税込みで20.42%）なので、超過分については所得税から約20%、住民税から10%、合わせて3割ほどは戻ってくる計算になる。なお、ワンストップ特例を使う場合は所得税からの還付という形にはならず、相当額も含めて住民税から引かれる。内訳は変わるが、戻ってくる合計はほぼ同じだ。

つまり1万円超過した場合、丸ごと1万円を失うのではなく、自己負担はおよそ7,000円。全損ではない。

ただし、得でもない。返礼品の還元率は寄付額の3割が上限とされているので、3割戻ってきて3割ぶんの品を受け取る形になり、差し引きはほぼ行って来いだ。申請の手間を考えると、むしろ負けている。「超えたら破滅」ではないが「超えたら無意味」ではある、というのが実態に近い。

もっと上には別の天井もある。所得税の控除対象になる寄付額は総所得金額等の40%、住民税の基本分は30%が限度とされている。ただしこれに当たるには年収の3割以上を寄付する必要があるので、自分の水準では考えなくていい。

この仕組みを知っておくと、年末の判断が少し楽になる。上限ちょうどを狙って神経質になるより、少し手前で止めるほうが精神衛生にいいし、わずかに超えても致命傷にはならない。

## 二つの締切

年末が近いので、期限を整理しておく。

| やること | 期限 |
|---|---|
| 寄付の決済を完了させる | 2026年12月31日 |
| ワンストップ特例申請書を自治体へ届ける | 2027年1月10日必着 |

12月31日は「申し込んだ日」ではなく「決済が完了した日」で判定される。クレジットカード以外の決済方法だと年をまたぐことがあるので、ぎりぎりを狙わないほうがいい。

1月10日は「消印有効」ではなく「必着」だ。年末年始を挟むので、郵便の日数を甘く見ないほうがいい。自分は12月中に出し切るつもりでいる。

## 残りの枠をどうするか

上限が8万円前後だとすると、59,000円を引いて2万円ほど残っている。ただしこの8万円という数字自体が目安でしかないので、ぴったり使い切ろうとはしない。前の節で見たとおり、少し超えても損失は超過分の7割程度で済むが、少し余らせるほうが気は楽だ。

自己負担の2,000円は年間1回ぶんなので、枠を余らせるほど1回あたりの効率は悪くなる。かといって、食べ切れないものを頼んで冷凍庫で化石にするのでは本末転倒だ。

残りは、常温で日持ちするものか、消耗品に充てようと思っている。ツーリングで使うものなら無駄にならない。

上限額の最終確認は、年末調整の結果が出てからにする。奨励金とiDeCoで両方向に動いているので、感覚で決めると危ない。

## 関連リンク

- [ふるさと納税の流れ（総務省）](https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/procedure.html)
- [税金の控除について（総務省）](https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html)
- [No.1155 ふるさと納税（寄附金控除）｜国税庁](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1155.htm)
- [ふるさと納税に係る指定制度の見直し（総務省）](https://www.soumu.go.jp/menu_news/s-news/01zeimu04_02000144.html)
- [従業員持株会に上限まで入れて、3か月ごとに全部売る](/posts/post-mvvoxcm5)
- [ツーリング9日間の現地出費が25,500円だった話](/posts/post-mvvnqszt)
- [資産運用の記録一覧](/theme/money)
', '/media/uploads/1793494470466-ywkklu.png', 'published', 0, '2026-11-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026年のふるさと納税', '59,000円', '1自治体へ4回・自己負担2,000円', NULL, 0, '2026-11-01 00:42:49', '2026-11-01 00:54:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (39, 'ideco-year-end-adjustment', 'asset', 'iDeCoの控除を申告し忘れて、30,995円を取りこぼしていた', 'iDeCoを個人払込にしていたのに、年末調整で申告するのを忘れていた。気づいたのは1年後。確定申告をやり直して30,995円が戻ってきた記録と、今年の掛金267,000円をどう書くか。', '## 一年遅れで30,995円が戻ってきた

去年の年末調整で、iDeCoの掛金を申告し忘れた。

気づいたのは今年に入ってからで、結局その年分は確定申告をやり直すことになった。送信したのは2026年10月7日。戻ってきたのは30,995円だった。

忘れなければ、去年の12月の給与で受け取れていた金額だ。一年近く国に預けていたことになる。利息はつかない。

金額そのものより、「やることをやっていれば自動的に受け取れたものを、知らずに放置していた」という事実のほうが応えた。同じことをしている人は相当数いると思うので、仕組みごと書いておく。

## なぜ忘れるのか

iDeCoの掛金の払い方には二種類ある。

- **事業主払込**：給与から天引きされる。会社が把握しているので、年末調整で自動的に処理される
- **個人払込**：自分の口座から引き落とされる。会社は知らないので、自分で申告しないと何も起きない

自分は個人払込だった。毎月きちんと引き落とされているので、払っている実感はある。だが会社はその事実を知らない。申告しなければ、控除されないまま年末調整が終わる。

厄介なのは、何のエラーも出ないことだ。給与明細にも源泉徴収票にも「iDeCoの申告が漏れています」とは書かれない。黙って税金が多めに引かれて終わる。自分から取りに行かないと戻ってこない仕組みになっている。

引き落としの通知を見て「払った」と思っていても、税金が安くなったかどうかは別の話だ。ここが分離していることに、自分は一年気づかなかった。

## 忘れても5年は取り返せる

救いがあって、申告を忘れても取り返せる。

年末調整で漏れた場合、翌年1月1日から5年以内であれば還付申告ができる。確定申告の期間（2月16日から3月15日）とは別枠で、期間外でも受け付けてもらえる。自分が10月に送信できたのはこのためだ。

5年という猶予は長い。心当たりのある人は、過去の源泉徴収票を引っ張り出して、小規模企業共済等掛金控除の欄に金額が入っているか見てみるといい。空欄のまま掛金を払っていた年があれば、それは取りこぼしている。

必要なのは、その年の源泉徴収票と、当時の掛金払込証明書だ。証明書を捨てていた場合は、国民年金基金連合会に再発行を依頼することになる。

## 今年の証明書を読む

10月の後半に、今年の掛金払込証明書が届いた。正式名称は「小規模企業共済等掛金払込証明書」で、国民年金基金連合会から送られてくる。

中身はこうなっていた。

| 期間 | 月額 | 備考 |
|---|---|---|
| 1月〜3月 | 20,000円 | |
| 4月〜9月 | 23,000円 | 途中で増額した |
| 10月〜12月 | 23,000円 | 証明書発行時点では予定額 |

そして下部に三つの数字が並んでいる。

- 本年9月までに払い込まれた金額：198,000円
- 10〜12月に払い込まれる予定金額：69,000円
- **合計金額：267,000円**

証明書の発行日は10月15日時点なので、10月以降の欄はアスタリスクで伏せられている。まだ引き落とされていないからだ。

## 書くのは合計金額だけ

ここが一番の注意点になる。

年末調整の申告書に書くのは、一番下の**合計金額267,000円**だ。10月から12月のぶんはまだ引き落とされていないが、その予定額を含めた金額を書く。

自分で計算してはいけない。自分の場合、4月に掛金を20,000円から23,000円に増額している。月額×12で計算すると、20,000円基準なら240,000円、23,000円基準なら276,000円になり、どちらも正しくない。証明書の数字をそのまま写す以外に正解がない。

掛金を年の途中で変更した人、口座振替の回数が12回でない人は特に注意がいる。「だいたいこれくらいのはず」で書くと、証明書の金額と合わずに差し戻される。

記入する場所は、給与所得者の保険料控除申告書の中にある「小規模企業共済等掛金控除」の枠、その中の「個人型年金加入者掛金」という行だ。この名称は国の様式で決まっているので、会社のシステムが何であっても同じ文言になっているはずだ。

金額を書いたら、証明書の**原本**を提出する。コピー不可とされることが多いので、なくさないようにしたい。自分は届いた日に申告書類と一緒にクリップで留めた。

## いくら戻るのか

267,000円が課税所得から引かれると、どれくらいの効果になるか。

所得税率20%（復興特別所得税込みで20.42%）の帯にいる場合、所得税で約54,500円、住民税10%で26,700円。合計すると8万円前後になる。

ただしこれは概算だ。自分は課税所得が330万円の境目に近いので、控除によって一部が10%の帯に落ちる可能性がある。その場合、実際の軽減額はもう少し小さくなる。正確な数字は年末調整の結果を見ないとわからない。

なお去年の還付30,995円は、確定申告で戻ってきた所得税のぶんだけだ。住民税のほうは翌年度の税額が下がる形で反映されるので、実際の効果はこの金額より大きかったことになる。還付通知の金額だけ見て「思ったより少ない」と感じたが、住民税を含めれば計算は合っていた。

## ふるさと納税の枠は縮む

一つ、他の制度との関係も書いておく。

iDeCoで課税所得が下がると、住民税所得割額も下がる。ふるさと納税の控除上限は住民税所得割額の2割で決まっているので、上限も一緒に縮む。

自分の数字で計算すると、267,000円の所得控除で住民税所得割がおよそ26,700円減る。その2割だから、ふるさと納税の枠は5,000円強縮む計算になる。

とはいえ、iDeCoの節税効果は8万円前後。ふるさと納税の枠が5,000円縮むことを嫌ってiDeCoを削るのは、完全に本末転倒だ。順番としては、iDeCoを先に決めて、残った枠でふるさと納税をする。

この話は[ふるさと納税の記事](/posts/furusato-tax-2026)にも書いた。あちらでは「数千円ぶん縮む」としか書けなかったが、証明書が届いたので実額が出せるようになった。

## 来年はもっと大きくなる

2027年から、自分の掛金拠出限度額は月62,000円に上がる予定だ。

満額で拠出すれば年間744,000円。今年の267,000円の約2.8倍になる。節税効果も比例して大きくなり、年間で15万円前後を見込んでいる。

これには別の意味もある。2027年は昇給で課税所得が330万円の境目に近づく年で、税率20%の帯に入る可能性がある。iDeCoを満額で拠出すれば、課税所得を押し下げて帯の内側に留まれる計算になる。

手続きはまだ着手していない。掛金の変更は届出が必要で、反映にも時間がかかるので、年内には動くつもりでいる。

## 今年やること

- [x] 掛金払込証明書を受け取る（10月下旬に到着）
- [ ] 保険料控除申告書の「個人型年金加入者掛金」に267,000円と記入
- [ ] 証明書の原本を添付して提出
- [ ] 12月の給与明細で反映を確認
- [ ] 2027年分の掛金変更手続き

提出が済んで結果が出たら、この記事に追記する。

去年の失敗で学んだのは、「払っていること」と「控除されていること」は別だということだった。引き落としの通知は毎月届くが、控除されたかどうかは誰も教えてくれない。源泉徴収票の小規模企業共済等掛金控除の欄に数字が入っているかどうか、12月に自分で確認するしかない。

## 関連リンク

- [No.1135 小規模企業共済等掛金控除｜国税庁](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm)
- [iDeCo公式サイト（国民年金基金連合会）](https://www.ideco-koushiki.jp/)
- [ふるさと納税の返礼品が、2か月で1,500円値上がりしていた](/posts/furusato-tax-2026)
- [従業員持株会に上限まで入れて、3か月ごとに全部売る](/posts/post-mvvoxcm5)
- [資産運用の記録一覧](/theme/money)', '/media/uploads/1793624354667-abjugl.png', 'published', 0, '2026-11-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026年のiDeCo掛金', '数値 267,000円', '全額が所得控除の対象', NULL, 0, '2026-11-01 02:31:40', '2026-11-02 12:59:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (40, 'tax-benefit-priority', 'asset', '会社員が使える制度を全部並べて、優先度をつけた', 'iDeCo・NISA・ふるさと納税の三つは使っている。ではそれ以外に何があって、自分はどれを使えていないのか。会社員が使える制度を一度ぜんぶ並べて、優先度をつけ直した記録。手元に余裕がない場合にどこから手をつけるかも考えた。', 'iDeCo、NISA、ふるさと納税。この三つは使っている。年末調整の書類を書きながら、ふと「ほかに何があるんだろう」と思った。使えるのに知らないまま過ぎている制度があるかもしれない。

そこで一度、会社員が使える制度をぜんぶ並べてみた。そのうえで、自分の条件で優先度をつけた。

## 前提：誰の話か

制度の有利不利は条件で変わるので、先に自分の条件を書いておく。

| 項目 | 内容 |
|---|---|
| 年齢 | 41歳 |
| 家族 | 独身・扶養なし |
| 住まい | 賃貸（1K・家賃55,000円） |
| 働き方 | 会社員（給与所得のみ） |
| 年収 | 600万円台 |
| 生活費 | 月139,000円 |
| 現金 | 約1,200万円 |

扶養家族がいない、家を買っていない、副業をしていない。この三つで使える制度がかなり絞られる。逆に言えば、残ったものは全部使い切る価値がある。

## 優先度の一覧表

まず結論から。◎は無条件で使う、○は条件が合えば使う、△は判断が分かれる、×は自分には使えない。

| 優先度 | 制度 | 自分の状況 | 効果の目安 |
|:---:|---|---|---|
| ◎ | iDeCo | 使用中 | 年8万円前後の節税 |
| ◎ | NISA | 使用中 | 運用益が非課税 |
| ◎ | 従業員持株会 | 使用中 | 奨励金20%（年36万円） |
| ◎ | ふるさと納税 | 使用中 | 自己負担2,000円で返礼品 |
| ◎ | カフェテリアプラン | 使用中 | 年75,000円分 |
| ○ | 医療費控除 | 該当なし | 10万円超から |
| ○ | セルフメディケーション税制 | 該当なし | 12,000円超・上限88,000円 |
| ○ | 高額療養費制度 | 該当なし | 自己負担に上限 |
| ○ | 損益通算・繰越控除 | 該当なし | 3年繰り越せる |
| △ | 生命保険料控除 | 入っていない | 最大12万円の控除 |
| △ | 特定支出控除 | ほぼ無理 | 条件が厳しい |
| △ | 財形貯蓄 | 使っていない | 利子が非課税 |
| × | 住宅ローン控除 | 賃貸 | — |
| × | 扶養控除・配偶者控除 | 独身 | — |
| × | 小規模企業共済 | 会社員 | — |
| × | 青色申告特別控除 | 事業所得なし | — |

並べてみて分かったのは、「使えるのに使っていない制度」が自分の条件ではほぼ残っていない、ということだった。増やす余地があるのは制度の数ではなく、すでに使っている枠の中身のほうになる。

## ◎：毎年使っている5つ

### iDeCo

掛金が全額「小規模企業共済等掛金控除」になる。今年の払込は267,000円で、節税額は所得税と住民税あわせて8万円前後の見込み。

弱点は60歳まで引き出せないこと。これは節税の対価として受け入れている。2027年から上限が月62,000円（年744,000円）に上がる予定なので、来年は手続きをして満額に寄せるつもり。

注意点として、個人払込の場合は年末調整で自分から申告しないと控除されない。自分はこれを一度やらかしている。

### NISA

年間360万円（つみたて120万円＋成長240万円）、生涯1,800万円まで運用益が非課税。生涯枠の残りは1,000万円弱。

iDeCoと違っていつでも売却できるので、流動性の面では上。ただし掛金が所得控除にならないので、「今年の税金を減らす」効果はない。この違いが後の優先順位に繋がる。

### 従業員持株会

奨励金が拠出額の20%。東証の2024年度調査では、奨励金を出している会社のうち拠出金1,000円あたり200円以上を出しているのは全体の1割程度なので、恵まれている部類だと思う。

自社株を持ち続けるつもりはないので、3か月ごとに全部売ってインデックスに移している。

→ 詳しくは [従業員持株会に上限まで入れて、3か月ごとに全部売る](/posts/post-mvvoxcm5)

### ふるさと納税

厳密には節税ではなく「前払い＋返礼品」だが、自己負担2,000円で済むなら使わない理由がない。今年は59,000円を1自治体に4回。

iDeCoを増やすと課税所得が減るので、ふるさと納税の上限も下がる。自分の場合で5,000円強。ただしiDeCoの節税額のほうがはるかに大きいので、順番は「iDeCoを先に決めて、残った枠でふるさと納税」になる。

→ 詳しくは [ふるさと納税の返礼品が、2か月で1,500円値上がりしていた](/posts/furusato-tax-2026)

### カフェテリアプラン

会社の福利厚生で、年75,000円分のポイントが付く。使わなければその年のぶんは消えるので、現金が増えるわけではないが「使わない＝捨てている」という点では奨励金に近い。

ただし何にでも使えるわけではない。自分のところは資格取得の受験料、参考書、健康器具の一部といったあたりに限られていて、宿泊やスポーツ施設には一切使えない。旅行に充てられるプランもあると聞くが、少なくとも自分の会社は違う。

毎年使い切ってはいるものの、正直なところ使い道を探すほうが大変になってきている。ツーリングの宿代に回せれば一番うれしいのだが、そういう仕組みではない。結果として、資格の受験料と技術書を中心に消化する年が続いている。使い道が限られているなら、年度の早いうちにメニュー表を見て「今年は何に使うか」を決めてしまったほうがいい。期限が近づいてから慌てて選ぶと、要らないものを買って消化することになる。

制度の中身は会社ごとにまったく違うので、まずは自分のところの対象範囲を確認するところからになる。

## ○：該当したら使うもの

今年は使っていないが、条件を満たせば使える。知らないと取りこぼすので並べておく。

| 制度 | 使える条件 | 手続き |
|---|---|---|
| 医療費控除 | 年間の自己負担が10万円超（総所得金額等が200万円未満の場合は総所得の5%超） | 確定申告 |
| セルフメディケーション税制 | 対象医薬品の購入が年12,000円超（控除上限88,000円） | 確定申告 |
| 高額療養費制度 | ひと月の医療費が自己負担限度額を超えたとき | 健保へ申請 |
| 損益通算・繰越控除 | 投資で損失が出たとき | 確定申告 |

いくつか補足する。

**医療費控除とセルフメディケーション税制は併用できない。** どちらか一方を選ぶ。医療費が10万円に届かない年でも、ドラッグストアのレシートを集めると後者で届くことがある。レシートの対象商品には印が付いていることが多い。

**高額療養費制度は、申請しないと戻ってこない。** 健保によっては自動で払い戻してくれるところもあるが、そうでない場合は自分で申請する。なお自己負担限度額の見直しが議論されているので、実際に使うときは加入している健保の最新の案内を見るのが確実。

**損益通算の落とし穴はNISAだ。** NISA口座の損失は、ほかの口座の利益と通算できないし、繰り越しもできない。非課税の裏返しで「損失もなかったこと」になる。特定口座の損失なら3年間繰り越せる。年内に持株会の売却代金が特定口座に入るので、ここは来年の確定申告で確認することになる。

## △：判断が分かれるもの

**生命保険料控除**は、独身で扶養がいない自分には優先度が低い。控除を取るために保険に入るのは順序が逆で、死亡保障の必要性が薄い以上、年間数万円の保険料を払って1〜2万円の節税を得ても差し引きではマイナスになる。守る相手ができたら考え直す。

**特定支出控除**は、会社が負担しない通勤費・研修費・資格取得費などが「給与所得控除の半分」を超えた場合に使える。年収600万円台だと80万円前後が基準になるうえ、会社の証明が要る。現実的ではない。なお資格取得費はカフェテリアプランで先に補助が出てしまうので、そもそも自己負担として積み上がらない。

**財形貯蓄**は、住宅・年金目的なら利子が非課税になる枠がある。ただし低金利では恩恵が小さいので、同じ金額をNISAに入れたほうがいいと判断している。

## ×：使えないもの

ここは早めに諦めたほうが時間の節約になる。

| 制度 | 使えない理由 |
|---|---|
| 住宅ローン控除 | 賃貸。買う予定もない |
| 扶養控除・配偶者控除 | 独身・扶養なし |
| 小規模企業共済 | 会社員（個人事業主・役員向け） |
| 青色申告特別控除 | 事業所得がない |
| 地震保険料控除 | 賃貸の火災保険に地震特約を付けていない |
| ひとり親控除・寡婦控除 | 該当しない |

節税の記事を読んでいると住宅ローン控除の話が必ず出てくるが、賃貸を選んだ時点で縁のない話になる。家賃55,000円で住めている以上、控除のために買う理由はない。

## 優先順位の考え方

なぜこの順番になるのか。基準は三つある。

**一つ目は、確実性。** 運用のリターンは読めないが、所得控除で減る税金と持株会の奨励金は計算できる。拠出額の20%という奨励金は、相場が何をしようと拠出した時点で確定する。だから持株会とiDeCoが上に来る。

**二つ目は、取り返せるかどうか。** NISAの枠は、その年に使わなかったぶんは消える（翌年に繰り越せない）。ふるさと納税は12月31日で締まるし、カフェテリアのポイントも年度で消える。一方、医療費控除のような「後から確定申告すればいい」ものは5年の猶予がある。期限で消えるものが先、後から取り返せるものは後。

**三つ目は、手間に対する効果。** ふるさと納税のワンストップ特例は申込ごとに書類が要るし、確定申告となればもっと手間がかかる。数千円のために半日使うなら、その時間で別のことをしたほうがいい場合もある。

## 手元に余裕がない場合はどうするか

ここまでは「現金が1,200万円ある人の話」なので、そのまま真似すると危ない。同じ制度でも、手元に余裕がない段階では順番が変わる。

**段階0：生活防衛資金が先**

まず、何かあったときに生活が止まらない現金を作る。目安は生活費の半年分。自分の生活費（月139,000円）なら84万円ほどになる。

この段階でiDeCoに全力を入れるのはおすすめしない。節税効果は確かにあるが、60歳まで1円も引き出せない。失業や転職の端境期に現金がないと、結局その分を借りることになって、節税額より利息のほうが大きくなる。

**段階1：会社の制度を確認する**

お金を出さなくても確認できるものが先。カフェテリアプラン、住宅手当、健保の補助、資格取得支援。使わなければ消えるだけなので、調べるコストに対して効率がいい。ここは年収や貯金の額に関係なく、今日できる。

持株会も、奨励金が付くなら月5,000円からでも入る価値がある。拠出した瞬間に奨励金が乗るのは、ほかのどんな運用よりも確実。

**段階2：NISAを少額から**

iDeCoより先にNISAを勧めるのは、引き出せるから。月5,000円でも1万円でもいい。相場が動いたときに自分がどう感じるかを、金額が小さいうちに体験しておくほうがいい。

**段階3：iDeCo**

現金のめどが立ってから。月5,000円から始められるので、余裕ができたら増やす形でいい。所得税率が低いうちは節税効果も小さいので、焦る必要はない。

**段階4：ふるさと納税**

これを最後に置くのは、先に2,000円を払う必要があるのと、戻ってくるのが翌年6月以降だから。上限も年収に比例するので、年収300万円の独身だと3万円弱しかない。食費の足しにはなるが、無理に枠を埋めるものではない。

| 段階 | やること | 目安の金額 |
|:---:|---|---|
| 0 | 生活防衛資金 | 生活費の半年分 |
| 1 | 会社の制度を確認して使う（持株会など） | 0円〜月5,000円 |
| 2 | NISA | 月5,000円〜 |
| 3 | iDeCo | 月5,000円〜 |
| 4 | ふるさと納税 | 上限の範囲で |

自分も最初からこの形だったわけではない。順番を間違えて現金が足りなくなるほうが、制度を一つ使い損ねるよりずっと痛い。

## 来年の宿題

- iDeCoを月62,000円に引き上げる手続き（2027年から）
- iDeCoを増やしたあとのふるさと納税の上限を再計算する
- NISAの生涯枠の残りを簿価ベースで数え直す
- カフェテリアの使い道を年度の早いうちに決める（毎年これで悩んでいる）

制度は毎年どこかが変わる。来年もまた並べ直すことになると思う。

## 関連リンク

- [国税庁 No.1155 ふるさと納税（寄附金控除）](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1155.htm)
- [総務省 ふるさと納税の仕組み・税金の控除について](https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/furusato/mechanism/deduction.html)
- [東京証券取引所 2024年度従業員持株会状況調査結果](https://www.jpx.co.jp/markets/statistics-equities/examination/tvdivq0000001xhe-att/employee_2024.pdf)
- [従業員持株会に上限まで入れて、3か月ごとに全部売る](/posts/post-mvvoxcm5)
- [ふるさと納税の返礼品が、2か月で1,500円値上がりしていた](/posts/furusato-tax-2026)
- [ツーリング9日間の現地出費が25,500円だった話](/posts/post-mvvnqszt)

本記事は個人の記録であり、特定の金融商品の推奨や税務上の助言ではありません。制度の適用可否は個々の状況によって異なります。', '/media/uploads/1793512330683-zq8jga.png', 'published', 0, '2026-11-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '使っている制度', '', 'iDeCo・NISA・持株会・ふるさと納税・カフェテリアプラン', NULL, 0, '2026-11-01 05:36:49', '2026-11-01 05:55:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (41, 'post-mvxng9x3', 'touring', '徳島県｜美濃田の淵キャンプ場｜無料・予約不要、吉野川のほとりで四国の初日', '', '東京から有明発のフェリーで徳島に渡り、そのまま西へ走って最初に泊まったのがここ、美濃田の淵キャンプ場だった。吉野川のすぐ脇にある無料のキャンプサイトで、予約もいらない。四国ツーリング9日間の、実質的な初日になる。

<p><a href="/media/uploads/1793536010179-6vy1bj.png" target="_blank" rel="noopener"><img src="/media/uploads/1793536010179-6vy1bj.png" alt="美濃田の淵キャンプ場のフリーサイトとテント" style="width:280px;border-radius:10px;"></a></p>

最初に紛らわしいことを書いておく。この場所には「美濃田の淵キャンプ村」という有料・要予約の施設が隣接している。バンガローやログハウスがあるのはそちら。検索するとほぼキャンプ村の情報しか出てこないので、無料サイトを目当てに行く人は間違えないようにしたい。

## 基本情報

| 項目 | 内容 |
| --- | --- |
| 所在地 | 徳島県三好郡東みよし町足代1300 |
| 問い合わせ | 東みよし町 産業課 |
| 料金 | 無料 |
| 予約 | 不可（先着順） |
| サイト | フリーサイト（砂地・土・芝） |
| トイレ | 水洗 |
| 炊事場 | なし（立水栓あり） |
| 駐車場 | あり・車両乗り入れ可 |
| ゴミ | 持ち帰り |
| 直火 | 不可 |

炊事場がなく立水栓だけ、という点は事前に知っておくといい。洗い物をする前提なら、水を汲んでくる形になる。

## 徳島市内からの道

フェリーが徳島に着いてから、国道318号・国道192号で西へ向かった。吉野川に沿って走る道で、川がずっと左手に見えている。

ただし徳島市から吉野川市にかけては信号も交通量も多い。時間帯によっては、少し北を通る徳島県道12号を選んだほうが流れる。県道12号でも東みよし町まで行けるので、混む時間に当たりそうなら最初からそちらに振るのもいい。

## 張る場所

サイトは吉野川沿いに細長く広がっていて、大きく三つに分かれている。右と真ん中は広く、大型テントでも張れる。左側は小さめでソロ向き。対面の三好浄化センター側にもキャンプ場へ繋がる道があり、そちらからでも入れる。

訪れたのがシルバーウィークの初日だったこともあって、かなり混雑していた。車両の乗り入れは可能だが、場内の通路は砂利が混じった土のような路面で、無理に入っていくほどの距離でもない。今回は乗り入れをやめて、少し離れたスペースにバイクを置いた。

地面は場所によって砂地だったり土だったりする。真ん中のサイトを川のそばまで下りていくと砂地になるので、四輪はスタックに注意したい。

## 川のこと

目の前が吉野川。流れは穏やかに見えるが、ここは遊泳禁止になっている。水遊び程度にとどめるのが無難。

美濃田の淵そのものは徳島県の名勝・天然記念物に指定されている。岩場が独特の形をしていて、歩いて見に行ける。

<p><a href="/media/uploads/1793536023425-0tkl2s.png" target="_blank" rel="noopener"><img src="/media/uploads/1793536023425-0tkl2s.png" alt="美濃田の淵の吉野川" style="width:280px;border-radius:10px;"></a></p>

## 買い出し

バイクで10分ほどのところにマルヨシセンター三加茂店とマルナカ三加茂店がある。今回はマルヨシセンターのほうに行った。無料キャンプ場の近くにスーパーが二軒あるというのは、それだけでありがたい。

20時頃に入ったが、刺身類はすでに売り切れていて、惣菜が数点残っている程度だった。半額が貼られるタイミングは都内より早いらしい。咸陽島のときも18時半に半額が出ていたので、地方の店は閉店時刻から逆算するだけでは読み切れない。19時台に着くつもりで動いたほうがいい。

この日のスーパーでの支払いは900円だった。

<p><a href="/media/uploads/1793536017735-lx38hs.png" target="_blank" rel="noopener"><img src="/media/uploads/1793536017735-lx38hs.png" alt="マルヨシセンターで買った夕食" style="width:280px;border-radius:10px;"></a></p>

## 風呂

バイクで5分ほどの「美濃田の湯」へ。大人700円、営業は10時から21時で最終受付は20時30分。不定休でメンテナンス休業があるので、行く前に電話で確認したほうが確実。

吉野川サービスエリアに併設されている施設で、歩いて行けなくはないが20分ほどかかる。素直に車かバイクで向かったほうがいい。

## 無料サイトとしての評価

四国ツーリングでは無料キャンプ場を三つ使ったが、アクセスの良さではここが頭ひとつ抜けている。高速のインターからも近く、温泉とコンビニとスーパーが揃っている。設備は最低限だが、そのぶん無料で文句を言う筋合いもない。

静けさを求めるなら時期を選ぶことになる。春の桜と初夏の蛍で知られる場所なので、そのあたりは混む。今回のように連休初日に当たるとソロ向きの左側から埋まっていくと思っておいたほうがいい。

## 注意事項

炊事場がないので、洗い物の段取りは先に決めておく。立水栓はあるが、汚れ物を一度に片付けられる場所ではない。

ゴミは全量持ち帰り。炭の捨て場もない。直火は不可。

川は遊泳禁止になっている。河原まで下りられるが、増水時は言うまでもなく近づかない。

## その他メモ

連休初日に飛び込みで入れたのは運が良かったと思う。予約ができない場所なので、混む時期は到着時刻を早めるしかない。今回の到着は16時30頃だが良さそうな場所は大体埋まっていた。

次に来るなら、桜でも蛍でもない平日に、同じ場所で何もしない一泊をしたい。フェリーで着いた日の受け皿としては、これ以上ない立地だった。

## 関連リンク

* [美濃田の湯](https://nishi-awa.jp/contents/1986/)
* [高知県｜咸陽島公園キャンプ場](/posts/post-mvtll4bp)
* [ツーリング9日間の現地出費が25,500円だった話](/posts/post-mvvnqszt)

他の記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめている。', '/media/uploads/1793536399495-5e0mv4.png', 'published', 0, '2026-11-01', '美濃田の淵キャンプ場', '徳島県', NULL, NULL, NULL, NULL, '', '晴れのち雨', 'トライアンフ アメリカLT', '徳島港 → 国道318号 → 国道192号 → 東みよし町 → 美濃田の淵', NULL, NULL, NULL, '2026-09-19', NULL, NULL, NULL, NULL, NULL, 0, '2026-11-01 09:50:36', '2026-11-01 12:41:01', '無料格安キャンプ場', '四国', '通年（桜は4月上旬、蛍は6月）', '場内の通路は砂利混じりの土。川寄りに下りるほど砂地になるため、四輪は入口付近にとどめるのが無難。炊事場はなく立水栓のみで、洗い物の段取りは先に決めておきたい。ゴミは全量持ち帰り、炭の捨て場もなく直火は不可。川は遊泳禁止で、増水時は河原に近づかない。予約ができないため、連休は到着時刻を早めるしかない。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (42, 'post-mvxtvmom', 'touring', '高知県｜宮の前公園キャンプ場｜無料・予約不要、仁淀川のほとりを四国カルストの前泊地にする', '高知県越知町、仁淀川のすぐ横にある無料のキャンプ場。予約もいらない。翌日に四国カルストへ上がるための前泊地として使い、そのまま連泊した。', '<p><a href="/media/uploads/1793537579109-0xv1tf.png" target="_blank" rel="noopener"><img src="/media/uploads/1793537579109-0xv1tf.png" alt="宮の前公園キャンプ場に並ぶテントと背後の山並み" style="width:280px;border-radius:10px;"></a></p>

四国ツーリング3日目。美濃田の淵から国道32号で南へ抜け、高知市を通り、須崎で風呂に入ってから越知町に入った。目的地はここではなく、翌日の四国カルストだった。

標高1,400mの稜線を走る道に、荷物を満載したまま上がりたくない。かといって前日に麓まで詰めておきたい。その条件で地図を見ていて出てきたのが、この宮の前公園キャンプ場だった。無料で、予約がいらなくて、国道33号から数分。結果としてここに2泊することになる。

## 基本情報

| 項目 | 内容 |
|---|---|
| 所在地 | 高知県高岡郡越知町越知丙734-1 |
| 問い合わせ | 越知町役場 0889-26-1164 |
| 料金 | 無料（協力金については後述） |
| 予約 | 不要 |
| サイト | フリーサイト（えのきの森・桜・土手の3エリア） |
| トイレ | スノーピークかわの駅おち1階（営業時間外も利用可）、ウォシュレット／土手側に仮設トイレ |
| 炊事場 | なし（仮設トイレ横の水道は水汲み程度なら可） |
| 駐車場 | あり・無料 |
| ゴミ | 持ち帰り |
| アクセス | 高知市内から車で約60分、伊野ICから約40分 |

炊事場がないのは美濃田の淵と同じ。四国の無料サイトはこの構成が多いのかもしれない。

## 料金のこと

利用料は無料。越知町の公式ページにも「予約、使用料不要」と明記されている。

ただし記事を書くにあたって調べていたら、最近は一人100円程度の協力金という記載を見かけた。自分が泊まったときはその存在を知らず、結果として払っていない。受付らしい受付もなく、気づく機会がなかった。

無料で使わせてもらっている以上、仕組みがあるなら払うべきものだと思う。これから行く人は、現地の掲示か隣のスノーピークで確認してほしい。

## 張る場所

サイトは大きく三つに分かれている。えのきの森エリアは木陰で川に近いが、大きめの石が混じった砂利敷きで地盤は固い。桜のエリアはスノーピークかわの駅おちの真下で、草地が定期的に手入れされている。土手エリアは木陰で川に近く、スペースは狭いがテーブルと椅子が置いてある。

桜のエリアは大勢のファミリーキャンパーでほぼ埋まっていた。土手エリアはソロキャンパーが集まっていたので、今回はここに張った。

案内にある通りソロ向きの区画だが、シルバーウィークの真ん中とあって、どのエリアもテントで埋まっていた。人気の無料キャンプ場というのはこういうことかと思った。

<p><a href="/media/uploads/1793537585952-r1mltd.png" target="_blank" rel="noopener"><img src="/media/uploads/1793537585952-r1mltd.png" alt="高台から見下ろした宮の前公園キャンプ場と駐車場" style="width:280px;border-radius:10px;"></a></p>

静かな一夜を期待して行く場所ではない。設備と立地に対して無料という条件が強すぎるので、連休は埋まると思っておいたほうがいい。

## トイレはスノーピークまで歩く

土手側に仮設トイレがあるのだが、使わなかった。少し距離があるので、バイクでスノーピークかわの駅おちまで行っていた。

ここの水洗トイレは営業時間外でも開放されている。しかもウォシュレット付き。店舗自体は9時から17時、水曜定休だが、トイレだけは夜も朝も使える。無料キャンプ場でこれが成立しているのは相当にありがたい。

歩けば5分から10分ほど。夜中に起きたときのことを考えると、トイレの質を優先してこちら寄りに張るという考え方もあると思う。

<p><a href="/media/uploads/1793537582384-43tzao.png" target="_blank" rel="noopener"><img src="/media/uploads/1793537582384-43tzao.png" alt="スノーピークかわの駅おちの建物。1階のトイレは営業時間外も使える" style="width:280px;border-radius:10px;"></a></p>

## 川のこと

目の前が仁淀川。仁淀ブルーと呼ばれる水の色で知られる川で、実際に明るい時間に見ると底まで見える。

朝、テントから出て川まで歩くだけで一日が始まる感じがある。この川のそばに2泊できたことが、四国で一番よかったことかもしれない。

## 買い出しと風呂

買い出しはサンプラザ越知店。9時から20時で、キャンプ場から数分。町の中心部まですぐという立地なので、この点でも困らない。

風呂は2日とも別の場所に行った。到着日は須崎のそうだ山温泉 和。9時から21時（最終受付20時30分）で、支払いは700円だった。四国カルストから下りてきた日は吾北むささび温泉。11時から21時（受付20時まで）、木曜定休で、公式の案内は大人800円だが、JAF割引で700円だった。

到着日にはコインランドリーも使っている。3日目で洗濯物が溜まる頃で、町が近いキャンプ場だとこれが片付く。価格はやや高めで700円（洗濯と乾燥含む）。

<p><a href="/media/uploads/1793537574199-sy5ylc.png" target="_blank" rel="noopener"><img src="/media/uploads/1793537574199-sy5ylc.png" alt="そうだ山温泉 和の入口" style="width:280px;border-radius:10px;"></a></p>

## 連泊して四国カルストへ

連泊した理由は、はっきりしている。翌日に四国カルストへ上がるためだった。

テントを張ったまま空荷で出る。荷物を積んだまま標高1,400mまで上がって、狭い稜線の道を走るのと、空荷で上がるのとでは別の乗り物になる。

朝に荷造りがないぶん出発も早くできるし、戻ってきたときには寝床ができている。四国カルストのような「走ること自体が目的」の道を抱えている日は、前後を拠点で挟むのがいちばん効率がいい。良好なキャンプ場の場合は敢えて連泊を選択するケースも多くなった。

四国カルストの話は別の記事に分けて書く。

## 無料サイトとしての評価

四国で使った無料キャンプ場三つのなかで、利便性はここが最上位だった。町まで数分、スーパーあり、コインランドリーあり、トイレは24時間使えて、目の前が仁淀川。

そのぶん混む。静けさと引き換えの立地だと割り切れるなら、これ以上ない場所だと思う。山に上がる日の前泊地としては、条件が揃いすぎている。

近くに日帰り温泉がない。佐川町まで下りてもないので、須崎か吾北まで足を伸ばすことになる。到着前に済ませておくか、明るいうちに動いたほうがいい。暗くなってからの山道は避けたいところ。

## 注意事項

炊事場がない。仮設トイレ横の水道は水を汲む程度の扱いなので、洗い物の段取りは先に決めておく。

ゴミは全量持ち帰り。イベント開催時はキャンプが禁止になる場合がある。春のぼんぼり桜まつり、秋のコスモスまつりの時期は特に事前確認が必要になる。コスモスの育成区画もキャンプ禁止になっている。

公園であって、近隣に住宅がある。夜間の音には気をつけたい。

## 関連リンク

- [宮の前公園キャンプ場（越知町）](https://www.town.ochi.kochi.jp/kankou/activity/camp_miyanomae)
- [宮の前公園キャンプ場（仁淀ブルー観光協議会）](https://niyodoblue.jp/hotel/detail.php?id=39)
- [スノーピークかわの駅おち](https://www.snowpeak.co.jp/locations/kawanoekiochi/)
- [そうだ山温泉 和](https://sondayama.co.jp/dayuse/)
- [徳島県｜美濃田の淵キャンプ場](/posts/post-mvxng9x3)
- [咸陽島公園キャンプ場](posts/post-mvtll4bp)
- [ツーリング9日間の現地出費が25,500円だった話](/posts/post-mvvnqszt)

他の記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめている。', '/media/uploads/1793537881085-lxujw3.png', 'published', 0, '2026-11-01', '宮の前公園キャンプ場', '高知県', NULL, NULL, NULL, NULL, '', '晴れ', 'トライアンフ アメリカLT', '', NULL, NULL, NULL, '2026-09-20', NULL, NULL, NULL, NULL, NULL, 0, '2026-11-01 12:50:30', '2026-11-02 14:12:21', '無料格安キャンプ場', '四国', '', '国道33号線沿い。二車線道路で快適。越知町内も直ぐそばなので、暗くなってからの買い出しも十分可能。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (43, 'post-mvyax5yp', 'touring', '高知県｜四国カルスト縦断ルート｜天狗高原から姫鶴平、帰りににこ淵', '宮の前公園キャンプ場に連泊して、空荷で四国カルストへ上がった一日。快晴の天空の道を天狗高原から姫鶴平まで走り、梼原で昼を食べて、帰りににこ淵と温泉。走行250km。', '<p><a href="/media/uploads/1793568561860-dkiahv.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568561860-dkiahv.png" alt="四国カルストの風車と、路肩に停めたトライアンフ アメリカLT" style="width:280px;border-radius:10px;"></a></p>

四国ツーリング4日目。宮の前公園キャンプ場にテントを張ったまま、空荷で出た。この日のために前日から麓に入っている。

標高1,000mから1,500mの高原を東西に貫く県道383号、通称「天空の道」。ここを走ることがこの日の目的だった。結果として、快晴の一日になった。

## ざっくり基本ルート

宮の前公園を7時30分に出発。国道33号を西へ、国道440号に入って南下し、県道303号から天狗高原へ上がる。カルスト上は県道383号を西へ、姫鶴平まで。そこから梼原に下りて昼食。帰りは国道440号、33号、439号と繋いでにこ淵へ寄り、吾北むささび温泉で締めて宮の前に戻った。

走行距離は約250km。日帰りとしては長めだが、空荷なので体への負担は少なかった。大野ヶ原までは行っていない。姫鶴平で折り返して、そのぶんを帰りのにこ淵に回した形になる。

## タイムライン

| 時刻 | 場所 |
|---|---|
| 7:30 | 宮の前公園キャンプ場 出発 |
| 9:00頃 | 天狗高原 着 |
| 10:00頃 | 姫鶴平周辺巡り |
| 13:00頃 | 梼原町（昼食） |
| 15:30頃 | にこ淵 |
| 17:00頃 | 吾北むささび温泉 |
| 18:00頃 | 仁淀川町ふれあい公園 |
| 18:30頃 | 宮の前公園キャンプ場 着 |

## 上がり方の選択

四国カルストへは越知町側から国道33号・440号を使い、地芳峠から縦断線に入るのが最短とされている。今回は440号から県道303号に振って、東端の天狗高原側から入った。

結果としてこれは正解だったと思う。東から入って西へ抜ける形になるので、走るにつれて視界が開けていく。地芳峠から入ると姫鶴平が先に来るので、順番が逆になる。

どちらのルートも最後の区間は道幅が狭く、カーブが連続する。対向車とすれ違うのに気を遣う場面があるので、大型で上がるなら時間に余裕を持ったほうがいい。

## 天狗高原

東端の天狗高原に着いたのが9時頃。標高1,400m前後。ここから西を向くと、牧草地の上に一本の道が伸びているのが見える。

9時の段階では渋滞はなかったが、10時過ぎには姫鶴平に向かう車で渋滞していた。カルストテラスの駐車場は満車で、その影響もあるかと思う。

<p><a href="/media/uploads/1793568584685-ioekhm.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568584685-ioekhm.png" alt="天狗高原の標識と、眼下に広がる山並み" style="width:280px;border-radius:10px;"></a></p>

快晴で、下界との気温差がはっきり分かる。9月下旬の高知は麓だとまだ暑いが、ここは上着が欲しくなる。この落差が標高1,400mということなのだと思う。

天狗高原には星ふるヴィレッジTENGU（旧天狗荘）があり、宿泊も日帰り利用もできる。天気が崩れたときの逃げ場として覚えておく価値はある。

## 県道383号を西へ

天狗高原から五段高原を経て姫鶴平まで、県道383号を走る。

<p><a href="/media/uploads/1793568574692-j8j731.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568574692-j8j731.png" alt="県道383号沿いの草原と空" style="width:280px;border-radius:10px;"></a><br><a href="/media/uploads/1793568558096-sms5mi.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568558096-sms5mi.png" alt="牧草地に寝そべる放牧牛と風車" style="width:280px;border-radius:10px;"></a></p>

これが四国カルスト縦断線、天空の道。日本百名道にも選ばれている。両側が牧草地で、牛が放牧されている。視界を遮るものがない。

快晴だったので、遠くまで見えた。カルストは霧が出やすいと聞いていたので、この日に当たったのは運が良かったと思う。

路面は舗装されているが、センターラインのない区間が続く。牛が道に出てくることもあるので、速度を出す道ではない。ゆっくり走って景色を見るための道だと思う。

風は強い。遮るものがないので横風が常にあって、バイクだと気を抜けない場面がある。

## 姫鶴平

西へ進んで姫鶴平。カルストの中心にあたる場所で、駐車場と宿泊施設、キャンプ場がある。

<p><a href="/media/uploads/1793568552608-vdwowq.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568552608-vdwowq.png" alt="姫鶴平の看板と牛のオブジェ" style="width:280px;border-radius:10px;"></a></p>

ここで折り返した。大野ヶ原までは行っていない。時間の問題もあったが、帰りににこ淵へ寄ることを決めていたので、そのぶんを残した形になる。殆どの観光客も姫鶴平で折り返している印象。

姫鶴平にはキャンプ場があって、標高1,300mの高原に泊まれる。次に来るならここに泊まりたい。ただし水と食料は下から全部持って上がる必要がある。

## 梼原で昼

カルストから国道440号で地芳峠を越えて下り、梼原町へ。13時頃に「かざぐるま」で昼食をとった。

想像以上に混雑しており、食べ終わるまで1時間くらいかかってしまった。食べたのは蕎麦定食、900円。

<p><a href="/media/uploads/1793568588799-12sskl.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568588799-12sskl.png" alt="かざぐるまの蕎麦定食。炊き込みご飯と柿付き" style="width:280px;border-radius:10px;"></a></p>

梼原は山の中の小さな町だが、このあたりで食事ができる場所は限られている。選択肢が少ないぶん1軒に集中するのだと思う。時間を優先するなら、麓のスーパーで買ってカルストの上で食べる組み方のほうが良かったかもしれない。

## にこ淵

梼原から国道440号、33号、439号と繋いでにこ淵へ。着いたのは15時30分頃。

観光客が非常に多く、長蛇の列が出来ていた。ピークをずらして夕方頃を目指したが、それでも待ち時間は発生した。

少し滝から遠い場所に駐車して、歩いて滝に向かった。駐車場から階段を下りて滝壺の近くまで行ける。急勾配だった階段は近年整備されて、下りやすくなっている。ただしここでも列ができていて、15分くらいは待った。

<p><a href="/media/uploads/1793568612452-f8fvnt.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568612452-f8fvnt.png" alt="滝の目の前まで" style="width:280px;border-radius:10px;"></a></p>
<p><a href="/media/uploads/1793568620171-qf8af3.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568620171-qf8af3.png" alt="にこ淵。滝と青い水をたたえた淵" style="width:280px;border-radius:10px;"></a></p>

にこ淵は仁淀川の支流、枝川川にある淵で、仁淀ブルーを代表する場所になっている。

水の色は時間帯と天候で変わる。晴れた日に光が直接入る時間がいちばん青が出ると言われている。この日は快晴だったので条件は良かった。

ここは地元で水神様の住む場所とされていて、遊泳はできない。見るだけの場所だと思って行ったほうがいい。

階段は歩きやすい靴が前提になる。ツーリングブーツでも下りられるが、濡れていると滑る。

## 吾北むささび温泉

最後に吾北むささび温泉。11時から21時、受付は20時まで、木曜定休。公式の案内は大人800円だが、JAF割引で700円だった。

施設としては規模は小さめで、大きめの内湯が1つのみ。やや高いと思ったがここら辺は温泉も限られているので仕方ないか。温泉感はそれなりにある感じ。

あまりゆっくり出来ないので、1時間程度で出ることとした。

## 仁淀川町ふれあい公園

<p><a href="/media/uploads/1793568624456-bwj6sy.png" target="_blank" rel="noopener"><img src="/media/uploads/1793568624456-bwj6sy.png" alt="仁淀川町ふれあい公園から見下ろした仁淀川" style="width:280px;border-radius:10px;"></a></p>

温泉を出て439号を宮の前へ戻る途中、仁淀川町ふれあい公園に寄った。川を見下ろす位置にあって、水面に山が映っている。にこ淵のような鮮やかな青ではないが、本流の仁淀川はこういう静かな色をしている。同じ川の上流と下流を一日で見られるのは、このルートの組み方の役得だと思う。

## 走ってみて

四国カルストは、走る前に想像していたより「牧場の中の道」だった。北海道の開けた道とも、本州の峠道とも違う。牛がいて、柵があって、その間を舗装路が通っている。

250kmという距離は、カルストだけなら必要ない。上がって下りるだけなら半日で終わる。梼原で昼を食べ、にこ淵に寄り、温泉に入ったぶんが積み上がって、この距離になった。山と水の両方を見る一日になったと思う。

次に来るなら姫鶴平に泊まって、朝と夕方の光でもう一度この道を走りたい。

## 路面・注意事項

*   県道383号は例年12月初旬から3月末まで冬季通行止めになる。訪問前に道路状況の確認が必要。
*   カルスト上は霧が出やすい。今回は快晴だったが、視界が一気になくなることがある。霧に入ったら速度を落としてライトを点ける。
*   放牧牛が道に出てくる。クラクションで追い立てず、通り過ぎるのを待つ。
*   沿道に店もガソリンスタンドもない。麓で給油してから上がる。食事もカルスト上では取れないので、梼原か麓で済ませる組み方になる。
*   連休は10時過ぎからカルスト上が渋滞する。カルストテラスの駐車場も満車になるので、上がるなら朝のうちがいい。にこ淵も夕方まで行列が続く。

## 関連リンク

*  [四国カルスト（四国ツーリズム創造機構）](https://shikoku-tourism.com/feature/karusuto/top)
*  [四国カルストへのアクセス](https://www.karst.co.jp/access/)
*  [星ふるヴィレッジTENGU](https://village-tengu.com/access.html)
*  [にこ淵（仁淀ブルー観光協議会）](https://niyodoblue.jp/spot/detail.php?id=142)
*  [高知県｜宮の前公園キャンプ場](/posts/post-mvxtvmom)
*  [ツーリング9日間の現地出費が25,500円だった話](/posts/post-mvvnqszt)

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※道路状況・施設の営業状況は訪問時点のものです。特に竜泊ラインの通行可否は季節によって変わるため、最新情報をご確認ください。', '/media/uploads/1793569476407-owqfuk.png', 'published', 0, '2026-11-01', '四国カルスト・仁淀川・にこ淵', '高知県/愛媛県', NULL, NULL, NULL, 250, '', '晴れ', 'トライアンフ アメリカLT', '越知町→仁淀川町→久万高原町→梼原町→久万高原町→仁淀川町→いの町→仁淀川町→越知町', NULL, NULL, NULL, '2026-09-21', NULL, NULL, NULL, NULL, NULL, 0, '2026-11-01 20:47:36', '2026-11-02 14:11:22', 'ツーリングルート', '四国', '5月〜10月頃まで（標高が高い為冬季は危険）', '四国カルストへのルートは複数あるが、梼原方面の幹線林道 東津野・城川線(東線)が二車線で快走できるためこちらを利用するのが良い。今回は県道303号を利用したが大型車などは狭路で少し苦労するかもしれない。
ルート上にあまり大きな町（梼原町、仁淀川町くらい）はないため、買い出しやガス欠に注意。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (44, 'post-mvyjba9b', 'touring', '高知県｜足摺サニーロード｜越知から宿毛へ、足摺岬と竜串を挟んで下る一日', '宮の前公園から咸陽島公園まで、高知県を北東から南西へ縦断した移動日。ただ下るだけでは面白くないので、国道321号の足摺サニーロードに振って、足摺岬と竜串を挟んだ。終日晴れ、走行250km。', '<p><a href="/media/uploads/1793580115644-dzwblu.png" target="_blank" rel="noopener"><img src="/media/uploads/1793580115644-dzwblu.png" alt="足摺岬展望台から見た、断崖の上に立つ足摺岬灯台" style="width:280px;border-radius:10px;"></a></p>

宮の前公園から咸陽島公園まで、高知県を北東から南西へ縦断した移動日。ただ下るだけでは面白くないので、国道321号の足摺サニーロードに振って、足摺岬と竜串を挟んだ。終日晴れ、走行250km。

四国ツーリング5日目。この日は宿が決まっている。宿毛の咸陽島公園、無料のキャンプ場だ。

問題は、そこまでの距離をどう使うかだった。越知から宿毛へは国道56号をまっすぐ下れば着く。だがそれだと移動で一日が終わる。少し遠回りして、四国の南西端を回ることにした。

## ざっくり基本ルート

宮の前公園を8時に出発。国道494号で須崎方面へ下り、国道56号に乗り換えて西へ。途中の無料高速区間を使って四万十市まで。四万十市で昼食後、国道321号に入り、県道27号で足摺岬へ。その後竜串海岸に寄って、321号を北上して宿毛の咸陽島公園に16時30分着。

走行距離は約250km。前日の四国カルストと同じくらいの数字だが、中身は違う。カルストは上がって下りる一日、この日は海沿いをひたすら横に移動する一日だった。

56号には無料の自動車専用区間が点在している。土佐方面から四万十にかけて、信号のない区間を拾えるので、ここで時間を稼いでおくと午後が楽になる。この日も使った。

道中で休憩を少し長めにとったため、四万十市の到着が12時頃になった。四万十市周辺は沈下橋もあるので巡りたかったが、流石に時間がなく今回は見送ることにした。

## タイムライン

| 時刻 | 場所 |
| --- | --- |
| 8:00 | 宮の前公園キャンプ場 出発 |
| 12:00頃 | 四万十市（国道56号から321号へ） |
| 14:00頃 | 足摺岬 |
| 15:00頃 | 竜串海岸 |
| 16:30頃 | 咸陽島公園キャンプ場 着 |

※時刻は出発と到着以外、記憶からの推定。

## 四万十市まで

キャンプ場を8時に出発して、国道494を南下、須崎西ICからは無料区間なので高速で四万十市へ。途中でガソリンを満タンにするため中土佐ICで降りた。
到着は10時頃で久礼大正町市場にも立ち寄ったが、人混みが凄く待ち時間がもったいないため特に何も買わずに出発した。
土佐佐賀・土佐白浜あたりは海や砂浜が綺麗に見れるので休憩がてら寄ってみるのも良い。

## 四万十市で昼食

足摺に行く前に、四万十市で昼にした。本当はカツオを食べたかった。この町まで来てカツオを食べないのはもったいない、という気持ちはあった。

だが店が混んでいた。昼のピークにちょうど当たってしまい、待っていると足摺と竜串が間に合わなくなる。諦めてスーパーのフジで買い、イートインで食べた。

<p><a href="/media/uploads/1793580106211-1tzcyr.png" target="_blank" rel="noopener"><img src="/media/uploads/1793580106211-1tzcyr.png" alt="四万十市のスーパー、フジ食品館の外観" style="width:280px;border-radius:10px;"></a></p>

自分の旅はだいたいこうなる。食べたいものがあっても、行列を見た時点で切り替える。店で食べる1,500円とスーパーの500円の差より、その1時間で寄れる場所のほうが自分には価値がある。

スーパーでカツオのたたきを購入したが、流石に美味しい。400円くらいの切り身であったが、土地が違うとこうも違うのかと実感できたので良しとする。

ただ、土佐清水のサニーマートは地元の新鮮な採れたての刺身が販売されているようで、こちらを選択するのもありかと思う（足摺へ向かう途中にある）。今回は寄らなかった。

## 足摺サニーロード

国道321号は四万十市から土佐清水市を経由して宿毛市に至る国道で、「足摺サニーロード」の愛称がついている。延長は80kmあまり。四国の南西端をぐるっと回る形になる。

海沿いを走る区間が長く、右手に太平洋が開ける。この日は終日晴れていたので、海の色がはっきり出ていた。信号が少なく、流れも悪くない。観光国道と呼ばれるだけのことはある道だった。

ただし「サニーロード」の名前から想像するほど、ずっと海が見えているわけではない。山側に入る区間、トンネル、集落を抜ける区間が交互に来る。開けるところで止まって見る、を繰り返す道だと思えばいい。

## 足摺岬

321号から県道27号に入って、足摺岬へ。着いたのが14時00分頃。

<p><a href="/media/uploads/1793580111616-z8iugu.png" target="_blank" rel="noopener"><img src="/media/uploads/1793580111616-z8iugu.png" alt="足摺岬の標識と、奥に立つジョン万次郎像" style="width:280px;border-radius:10px;"></a></p>

今回は展望台（足摺岬展望台・天狗の鼻）に行った。展望台からは太平洋が180度開ける。水平線が丸く見えると言われる場所で、実際に端のほうが落ちているように見えた。断崖の上に立っているので、高さの感覚がある。

駐車場は岬の先端に約20台ぶん。ここは小さいので、観光シーズンの日中は埋まりやすい。少し手前に第一駐車場が115台、東側にも50台ぶんあるので、先端が満車でも停められないことはない。バイクなら先端の隅に収まる。

天狗の鼻は展望台から歩いて10分くらいだろうか。こちらは人がおらず絶景を独り占めできた。晴天で風も少なかったので20分くらいゆっくりとしてから出発した。

灯台は展望台から徒歩5〜6分と近い。時間があるなら寄れる距離だった。次に来るなら、岬には朝のうちに着くように組みたい。

<p><a href="/media/uploads/1793580129399-ws1ay8.png" target="_blank" rel="noopener"><img src="/media/uploads/1793580129399-ws1ay8.png" alt="天狗の鼻の柵越しに見える足摺岬灯台と太平洋" style="width:280px;border-radius:10px;"></a></p>

## 竜串海岸

15時頃、竜串に到着。

<p><a href="/media/uploads/1793580134344-dizy12.png" target="_blank" rel="noopener"><img src="/media/uploads/1793580134344-dizy12.png" alt="竜串海岸の黒い岩と、対岸に見える岬" style="width:280px;border-radius:10px;"></a></p>

ここは砂岩が波と風で削られてできた奇岩の海岸で、大竹小竹、蜂の巣状の岩、蓄養地と呼ばれる地形が並んでいる。地面が丸ごと模様になっているような場所だった。

時間がなかったので、駐車場から近い遊歩道を歩いただけで切り上げた。それでも奇岩のいちばん濃い区間は見られる。岩の上を歩く形になるので、濡れている場所は滑る。

遊歩道の先には足摺海底館という海中展望塔があって、赤い階段が海へ伸びている。入らなかったが、看板と階段だけでも絵になる場所だった。尚、足摺海底館は閉鎖となったようだ。

<p><a href="/media/uploads/1793580139724-xzqxmr.png" target="_blank" rel="noopener"><img src="/media/uploads/1793580139724-xzqxmr.png" alt="竜串海中公園の足摺海底館の看板と、海へ伸びる赤い階段" style="width:280px;border-radius:10px;"></a></p>

対岸の見残し海岸にはグラスボートで渡れる。竜串からの往復で35分、中学生以上2,000円。上陸もできる。乗らなかったが、ここを目的地にして一日取るなら、グラスボートと見残しまで含めるべき場所だと思う。

駐車場は無料。竜串の市営駐車場が普通車60台、長島売店裏にも38台ぶんある。トイレもある。無料でこれだけ見られるスポットとしては、かなり当たりの部類だった。

## 宿毛へ

竜串から321号を北上して宿毛へ。1時間ほどで咸陽島公園に着いた。16時30分。

この時刻に着けたのが大きかった。夕方の明るいうちにテントを張れたので、咸陽島に沈む夕日を落ち着いて見られた。キャンプ場の話は別の記事にまとめてある。

<p><a href="/media/uploads/1793580143426-hczy5u.png" target="_blank" rel="noopener"><img src="/media/uploads/1793580143426-hczy5u.png" alt="咸陽島公園から見た、島のシルエットと夕日" style="width:280px;border-radius:10px;"></a></p>

## 走ってみて

移動日のつもりで組んだ一日だったが、結果としては内容が濃くなった。

国道56号でまっすぐ下れば、距離は150kmほどで済んだはずだ。321号に振ったことで100km増えて、足摺岬と竜串が入った。増えたぶんは全部景色になった。

四国の南西端は、本州から行くと遠い。次にいつ来るか分からない場所なので、通過するだけにしなくて正解だったと思う。

## 路面・注意事項

*   足摺岬の先端駐車場は20台ほどしかない。日中は埋まりやすいので、手前の駐車場も頭に入れておく。

*   県道27号は岬へ下りる道で、カーブが連続する。観光バスも通るので、対向には注意。

*   竜串の遊歩道は岩の上を歩く。濡れていると滑るので、靴は選んだほうがいい。

*   321号は海沿いだが、ガソリンスタンドは土佐清水と宿毛に寄っている。四万十市を出る前に入れておくと安心。

このルートは距離が出る。越知から宿毛まで足摺と竜串を挟むなら、朝8時出発でちょうど夕方着になる。キャンプ泊なら明るいうちに着けるよう逆算しておく。

## 関連リンク

*   [足摺岬（土佐清水市）](https://www.city.tosashimizu.kochi.jp/kanko/g01_kongofukuji.html)
*   [見残し海岸（こうち旅ネット）](https://kochi-tabi.jp/search_spot_inn.html?id=718)
*   [竜串観光汽船（グラスボート）](https://tsplus.asahi.co.jp/spot/13400082)
*   [高知県｜咸陽島公園キャンプ場](/posts/post-mvtll4bp)
*   [高知県｜宮の前公園キャンプ場](/posts/post-mvxtvmom)
*   [高知県｜四国カルスト縦断ルート](/posts/post-mvyax5yp)
*   [ツーリング9日間の現地出費が25,500円だった話](/posts/post-mvvnqszt)

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※道路状況・施設の営業状況は訪問時点のものです。特に竜泊ラインの通行可否は季節によって変わるため、最新情報をご確認ください。', '/media/uploads/1793582327588-81m8kx.png', 'published', 0, '2026-11-02', '足摺岬・竜串海岸', '高知県', NULL, NULL, NULL, 250, '10時間', '晴れ', 'トライアンフ アメリカLT', '越知町→須崎市→四万十市→土佐清水市→足摺岬→竜串海岸→大月町→宿毛市→咸陽島公園キャンプ場', NULL, NULL, NULL, '2026-09-22', NULL, NULL, NULL, NULL, NULL, 0, '2026-11-02 00:42:31', '2026-11-02 14:10:40', 'ツーリングルート', '四国', '通年（基本的に問題ないと思うが、越知町から須崎市にかけては山間部を通る）', '二車線道路で狭路はなし。足摺周辺は一部カーブがきついところがあるので注意。
今回は行っていないが、内陸の三原村へつながるルートは狭路のようなので、国道321号の利用を推奨。', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (45, 'post-mvyz24x8', 'touring', '愛媛県｜夕やけこやけライン｜宿毛から松山へ、市場食堂と下灘駅を挟んで北上する一日', '咸陽島公園から松山まで、国道56号で愛南・宇和島・八幡浜と北上して、最後は海沿いの378号。終日晴れ、走行約220km。', '四国ツーリング6日目。宿毛の咸陽島公園から松山まで、四国の西側を北へ上がる一日。この日以降はキャンプではなくホテル泊にしたので、テントを畳んで朝8時に出発した。

<p><a href="/media/uploads/1793615968058-44wteu.png" target="_blank" rel="noopener"><img src="/media/uploads/1793615968058-44wteu.png" alt="咸陽島公園の朝、堤防の先に浮かぶ咸陽島" style="width:280px;border-radius:10px;"></a></p>

## ざっくり基本ルート

咸陽島公園 → 国道56号 → 愛南町・深浦（市場食堂）→ 宇和島城 → 八幡浜 → 国道378号「夕やけこやけライン」→ 下灘駅 → 松山（道後）

56号をまっすぐ北上すれば松山まで3時間ちょっとで着く。ただそれだと何も残らないので、八幡浜から海沿いの378号に振った。この寄り道のぶんが距離と時間になっている。

## タイムライン

| 時刻 | 場所 |
| --- | --- |
| 8:00 | 咸陽島公園キャンプ場 出発 |
| 9:30 | 愛南町・深浦／市場食堂 |
| 11:30 | 宇和島城 |
| 13:30 | 八幡浜 |
| 14:30 | 国道378号・下灘駅 |
| 16:00 | ホテル：アビスイン道後・松山着 |
| 夜 | 道後温泉 |

## 漁協の食堂で朝から刺身

ここまではご飯はスーパー中心だったため、食堂で海鮮を食べることにして、Googlemapで良さげな店を調べたところ、愛南市場食堂を選択することにした。

愛南町の深浦漁港、漁協の敷地にある「市場食堂」。建物の看板は「漁民厚生施設」で、横に小さく「市場食堂」と出ている。知らずに通ったら食堂だと気づかないと思う。

9時30営業と書いてあったので、時間調整しながら向かったのだが、この日は祝日で10時からの営業のようで30分ほど時間を潰すことになった。

<p><a href="/media/uploads/1793615971459-jcr4io.png" target="_blank" rel="noopener"><img src="/media/uploads/1793615971459-jcr4io.png" alt="深浦漁港にある「漁民厚生施設」の建物。中に市場食堂が入っている" style="width:280px;border-radius:10px;"></a></p>

入口に番号カードを取る台があって、「番号の順番でまわるため1組1枚取って下さい」と手書きで貼ってある。奥の黒板には本日の入荷。この日は「本日かつおの入荷はないです」と赤字で書かれていた。日戻りのカツオが名物なので、そこを狙うなら入荷状況を見てから動いたほうがいい。

<p><a href="/media/uploads/1793615974407-n7awug.png" target="_blank" rel="noopener"><img src="/media/uploads/1793615974407-n7awug.png" alt="市場食堂の入口。番号カードの台と、本日の入荷が書かれた黒板" style="width:280px;border-radius:10px;"></a></p>

カードと携帯での支払いは不可、冷凍のカツオは使わない、水とおしぼりはセルフ。営業は平日9時30分〜15時、土日祝は10時〜15時、ラストオーダー14時30分、月曜定休。

頼んだのは刺身の定食で1,800円。しらすを乗せた丼と、鯛とカツオの刺身、卵を溶いたタレが付いてくる。宇和島の鯛めしと同じ食べ方で、刺身をタレにくぐらせて飯に乗せる。この旅でいちばん高い食事だったけど、ここは出す価値があった。

<p><a href="/media/uploads/1793616016705-il7jlb.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616016705-il7jlb.png" alt="市場食堂の刺身定食。しらす丼、鯛とカツオの刺身、溶き卵のタレ" style="width:280px;border-radius:10px;"></a></p>

食べ終わった頃にはお客さんも並んでいたため結構な人気店なのかもしれない。機会があれば改めて日戻りカツオを食べてみたい。

## 宇和島城

56号に戻って宇和島へ。城山の下にバイクを置いて、石段を登る。城山下の駐車場は24時間営業で普通車1時間100円、46台。自転車とバイクは登城口付近に無料で置けた。

<p><a href="/media/uploads/1793616021055-eftjvm.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616021055-eftjvm.png" alt="宇和島城の登城道。木立の中を苔むした石段が続く" style="width:280px;border-radius:10px;"></a></p>

現存天守十二城のひとつ。登城道は石が苔むしていて、雨のあとは滑ると思う。20分ほど登ると、芝生の広場の奥に三層の天守が建っている。中には入らず外から見ただけだけど、背景の山と空だけで十分だった。

階段は300段くらいだろうか。一段一段が高いので、想像以上に大変かもしれない。翌々日には金刀比羅宮へ行ったが、それと同レベルの疲労感はあった。

登りきる手前で、高く積まれた石垣が現れる。天守そのものより、この石垣のほうが城に来たという感じがした。

<p><a href="/media/uploads/1793616027984-7sofc8.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616027984-7sofc8.png" alt="宇和島城の石垣。手前に芝生が広がる" style="width:280px;border-radius:10px;"></a></p>

<p><a href="/media/uploads/1793616032486-rtss0b.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616032486-rtss0b.png" alt="青空の下に建つ宇和島城の三層天守" style="width:280px;border-radius:10px;"></a></p>

途中の道からは宇和島の市街と湾が見下ろせる。クレーンの立つ港と、その先に重なる島影。登った甲斐のある眺めだった。

## 夕やけこやけライン

宇和島から更に北上し、西予市→八幡浜市へ移動。宇和島市から西予市までは無料の高速が繋がっているので距離を稼げる。

八幡浜からは国道378号へ。大洲市から伊予市へ海沿いに続く区間に「夕やけこやけライン」の愛称が付いていて、伊予灘を右手に見ながら走ることになる。

名前のとおり夕方がいちばんいい道なのだろうけど、この日は14時台の通過。それでも海の色は十分だった。56号の内陸ルートより信号が少なく、海面の高さをそのまま走っている感覚がある。

## 下灘駅

378号沿いの、ホームのすぐ向こうが海の駅。写真で見たことがある人は多いと思う。

<p><a href="/media/uploads/1793616039322-rj8qq8.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616039322-rj8qq8.png" alt="下灘駅のホームに停まる普通列車と、その向こうに広がる伊予灘" style="width:280px;border-radius:10px;"></a></p>

実際に立ってみると、思っていたより何もない。ホームと屋根と、柵の向こうの海だけ。そこへ列車が入ってくると急に絵になる。時刻表を見て待つ価値はある。

<p><a href="/media/uploads/1793616057744-gaqmzm.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616057744-gaqmzm.png" alt="下灘駅の駅名標。すぐ後ろが伊予灘の海" style="width:280px;border-radius:10px;"></a></p>

駅舎側には丸い郵便ポストが立っていて、こちらも定番の構図。平日の午後でも数組いた。この時は運良く普通列車が到着してから直ぐに来た。

下灘駅は観光客でごった返しているが、普通列車から降りた乗客は誰もいなかったのが印象的だった。完全な観光スポットと言えるだろう。

<p><a href="/media/uploads/1793616076018-7zavn3.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616076018-7zavn3.png" alt="下灘駅の木造駅舎と、赤い丸型の郵便ポスト" style="width:280px;border-radius:10px;"></a></p>

駐車場は伊予市が案内を出していて、登り口付近のスペースは狭く混雑するため、国道378号の標識のとおり大洲（長浜）側から入るよう呼びかけられている。バイクなら問題なく置けるけれど、路上駐車は禁止なので素直に駐車場へ。

## 松山と道後温泉

16時に松山着。泊まったのはアビスイン道後・松山。キャンプ連泊のあとで洗濯物が溜まっていたので、まずコインランドリーで洗濯を済ます。300円。

路面電車の勝山町電停がホテルの正面で、徒歩1分。道後温泉にも松山城にもここから行ける。バイクは建物の横のスペースに無料で置かせてもらえた（クルマ用の立体駐車場は1泊600円で高さ制限があるので、四輪の人は先に確認したほうがいい。

それで朝食バイキング付きの3,600円。朝は7時から食べられる。この立地でこの値段は破格で、やはり宿泊はタイミングが重要だと改めて実感した。

荷物を置いてから道後へ。道後温泉駅は明治の駅舎を再現した建物で、夜になると灯りが入る。スターバックスが同居しているのが面白い。

<p><a href="/media/uploads/1793616099617-9qi8ex.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616099617-9qi8ex.png" alt="夜の道後温泉駅。復元された明治の駅舎にスターバックスが入っている" style="width:280px;border-radius:10px;"></a></p>

道後温泉本館は1階の浴室が大人700円。保存修理を終えた建物を夜に見上げると、窓のステンドグラスが光って別の建物のように見える。

<p><a href="/media/uploads/1793616084433-ewg16s.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616084433-ewg16s.png" alt="夜の道後温泉本館。窓のステンドグラスに灯りが入っている" style="width:280px;border-radius:10px;"></a></p>

<p><a href="/media/uploads/1793616089453-lnoyse.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616089453-lnoyse.png" alt="道後温泉本館の入口付近。色鮮やかな装飾と灯り" style="width:280px;border-radius:10px;"></a></p>

本館のそばの広場では、床にプロジェクションマッピングが投影されていた。番傘と花の柄が地面いっぱいに広がっていて、浴衣の人が写真を撮っていた。

<p><a href="/media/uploads/1793616094524-fjnc3w.png" target="_blank" rel="noopener"><img src="/media/uploads/1793616094524-fjnc3w.png" alt="道後温泉本館前の広場に投影された、番傘と花柄のプロジェクションマッピング" style="width:280px;border-radius:10px;"></a></p>

夕食は道後温泉近くのスーパー、フジ道後店でいつも通り半額の惣菜と刺身を入手。確か20時過ぎだったと思うが、大半の商品が売り切れていたので19時30頃には値引きされていたのかもしれない。閉店は22時。

温泉街で食べると一気に跳ねるので、ここは普段どおりにした。

今回は時間の都合上行けなかったが、ロープウェイで松山城へ行くのも良さそう。路面電車も通っているので交通機関で来るのもアリかもしれない。

## 路面・注意事項

*   国道56号は宇和島周辺でトンネルと登坂が続く。交通量はあるが走りやすい

*   西予市から八幡浜市までは愛媛県道25号を使う。海沿いに国道378号があるが、八幡浜市までは狭路もあり推奨はしない

*   下灘駅の駐車場は大洲（長浜）側から入る。路上駐車は禁止。

*   市場食堂は月曜定休、14時30分ラストオーダー。カツオの入荷は日によるので、目当てなら事前確認を

*   宇和島城の登城道は石段。雨のあとは滑る。バイクブーツだと歩きにくい

*   松山市街は夕方の渋滞がある。松前町から松山までの国道56号は中々の混雑。16時着でちょうどよかった

*   宿を取るなら路面電車の電停近くが便利。道後温泉はバイクを置いてから市電で行ったほうが気楽

## 関連リンク

*   [市場食堂（愛南町観光協会）](https://ainan-marugoto.jp/gourmet/ichibasyokudo/)
*   [宇和島城（うわじま観光ガイド）](https://www.uwajima.org/spot/index7.html)
*   [JR下灘駅来訪者向けの駐車場について（伊予市）](https://www.city.iyo.lg.jp/keizaikoyou/kanko/shimonadaeki_parking.html)
*   [道後温泉本館（公式）](https://dogo.jp/onsen/honkan)
*   [アビスイン道後・松山（公式）](https://www.abis.ne.jp/dogo/)
*   [高知県｜咸陽島公園キャンプ場](/posts/post-mvtll4bp)
*   [高知県｜足摺サニーロード](/posts/post-mvyjba9b)
*   [9日間の四国ツーリング、出費25,500円の話](/posts/post-mvvnqszt)

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※道路状況・施設の営業状況は訪問時点のものです。特に竜泊ラインの通行可否は季節によって変わるため、最新情報をご確認ください。', '/media/uploads/1793623479135-fuqzoc.png', 'published', 0, '2026-11-02', '下灘駅・道後温泉・宇和島', '愛媛県', NULL, NULL, NULL, 220, '9時間', '晴れ', 'トライアンフ アメリカLT', '宿毛市→愛南町→宇和島市→西予市→八幡浜市→大洲市→伊予市→松山市', NULL, NULL, NULL, '2026-09-23', NULL, NULL, NULL, NULL, NULL, 0, '2026-11-02 08:03:18', '2026-11-02 14:09:13', 'ツーリングルート', '四国', '通年（基本的に海沿いなので、冬も行けなくはない）', '', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (46, 'post-mvyz3spd', 'touring', '愛媛県｜松山から西条へ｜来島海峡を眺めて、鈍川で湯に浸かる一日', '', '四国ツーリング7日目。この日は移動が主体で、松山から今治を経由して西条まで。有料スポットには入らず、見るものは全部無料だった。それでも中身は濃かった。

## ざっくり基本ルート

松山市 → 国道317号 → 鈍川温泉 → 今治・糸山公園（来島海峡展望館）→ 国道11号 → 西条市

しまなみ海道は渡っていない。片道だけ渡って戻ってくるには時間が足りず、この日の宿も西条に取っていたから、今治側から眺めるだけにした。

## タイムライン

| 時刻 | 場所 |
| --- | --- |
| 10:00 | 松山 出発 |
| 11:00 | 鈍川温泉 せせらぎ交流館 |
| 14:00 | 糸山公園・来島海峡展望館 |
| 16:00 | 今治タオル本店 |
| 17:30 | 西条・アクアトピア水系 |
| 18:00 | 西条のセントラルホテル 着 |

※時刻は記憶によるもので、前後している可能性がある。
これまで4連続キャンプだったため、チェックアウト時間の10時に出発。

## 松山市から今治へ

松山市のホテルをチェックアウト後、国道317号で今治へ向かうこととした。

ルートとしては大きく分けて、国道11号、国道196号、国道317号と3つある。海沿いの国道196号も良さげだったが日帰り温泉が周辺になかったのと、途中にある鈍川温泉が良さそうだったので国道317号のルートを選択。

平日だったこともあり、交通量もさほど多くなく、二車線で快適に移動できた。

## 鈍川温泉 せせらぎ交流館

今治市に入って少し入ると、鈍川温泉の看板がある。県道154号に曲がり、少しすると鈍川温泉 せせらぎ交流館に到着した。

大人560円。入浴は10時30分から21時、札止めは20時30分、休みは毎月第2・第4月曜日。

泉質はpH9.9のアルカリ性単純泉で、ラドンを含む。地元では「美人の湯」と呼ばれているらしい。湯に入った感触が確かにぬるっとしていて、数字どおりだった。

露天風呂やリラックススペース、休憩所や食堂もあり、これで560円は非常に安い。もし近くにあれば週に1回は通うかもしれない、かなりのお気に入り。

今まで北海道から九州まで色々な日帰り温泉に行ったが、久しぶりのSランクだろうか。

面白かったのがロビーで、何故か射的を1回やることができた。射的は初めてで当てることは出来なかったが、いい経験になった。

館内は昭和レトロで統一されている。駄菓子と駄玩具が並び、壁には古い琺瑯看板。武田牛乳、サンキストドリンク、たばこ、ダルマ焼酎のポスター。黒電話と招き猫まで置いてある。温泉に来たつもりが、しばらく看板を眺めていた。

<p><a href="/media/uploads/1793625429913-fbdxgj.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625429913-fbdxgj.png" alt="鈍川せせらぎ交流館の館内。昭和の琺瑯看板と駄菓子が並ぶレトロなコーナー" style="width:280px;border-radius:10px;"></a></p>

お風呂を出たのが12時過ぎ。丁度お昼時間なので食堂で昼食をとった。ラーメン定食で確か850円だったとおもう。昼は14時までで、土日営業しているかは分からなかった。行く人は事前に確認してほしい。

建物のすぐ外が鈍川渓谷で、湯上がりに降りられる。石畳の護岸が川べりまで続いていて、階段で水際まで行ける。

<p><a href="/media/uploads/1793625435989-eqxcf4.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625435989-eqxcf4.png" alt="鈍川渓谷。水が澄んでいて川底の石がそのまま見える" style="width:280px;border-radius:10px;"></a></p>

水が本当に澄んでいて、川底の石の色がそのまま見える。仁淀川のような青ではなく、こちらは石の黄土色と白が透けて見えるタイプの透明さ。この日は人がいなかったので、しばらく座っていた。

渓谷沿いには遊歩道もあるので、時間があれば歩いてみても良いかとおもう。

## 来島海峡大橋は渡らず、こちら側から見る

今治市街から北へ抜けて、糸山公園へ。来島海峡大橋のたもとに当たる高台で、来島海峡展望館がある。駐車場は90台で無料、展望館は9時から18時（12月から2月は17時まで）。

<p><a href="/media/uploads/1793625439254-n203na.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625439254-n203na.png" alt="糸山公園の「しまなみ」モニュメントと、その奥に架かる来島海峡大橋" style="width:280px;border-radius:10px;"></a></p>

駐車場に「SHIMANAMI EHIME」の大きな文字のオブジェがあって、その向こうに橋が架かっている。ここで撮らない人はいないと思う。バイクを横付けできる位置に置けた。

<p><a href="/media/uploads/1793625461590-4wxay8.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625461590-4wxay8.png" alt="SHIMANAMI EHIMEのオブジェの前に停めたトライアンフと来島海峡大橋" style="width:280px;border-radius:10px;"></a></p>

展望台から見下ろすと、三連の吊り橋が島をつないで奥へ伸びている。真下を小さな作業船が通っていく。橋の長さがそのまま海峡の幅で、潮の流れが速いことで知られる場所だというのが、水面の筋を見ていると分かる。

<p><a href="/media/uploads/1793625449591-vzw5wc.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625449591-vzw5wc.png" alt="糸山公園の展望台から見下ろした来島海峡大橋と瀬戸内の島々" style="width:280px;border-radius:10px;"></a></p>

「第一位 来島海峡」と彫られた石碑が立っていた。

<p><a href="/media/uploads/1793625442767-g2ygt2.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625442767-g2ygt2.png" alt="「来島海峡」と彫られた石碑と、背後の来島海峡大橋" style="width:280px;border-radius:10px;"></a></p>

渡らなかったのは残念ではあるけれど、橋は渡っているときより外から見たほうがよく分かる。これは下灘駅と同じで、中にいると全体が見えない。

<p><a href="/media/uploads/1793625458093-b0gpnd.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625458093-b0gpnd.png" alt="角度を変えて眺めた来島海峡大橋。手前の木立の向こうに海峡が広がる" style="width:280px;border-radius:10px;"></a></p>

## 今治タオル本店

少し気になったので、西条に向かう道中にある今治タオル本店へ。

結果から言うと想定よりも高めで、何も買うことはなく店を後にした。品質は良さそうだが、一般的なタオルで満足してしまう自分にはちょっと贅沢な品かもしれない。

## 水の都・西条

国道11号で東へ。この日の宿は西条に取っていた。

西条は「うちぬき」で知られる町で、鉄のパイプを地下に打ち込むだけで地下水が自噴する。一日の自噴量は約9万立方メートル、名水百選にも選ばれている。市の中心部には「アクアトピア水系」として水路が整備されていて、親水デッキと散策路が続いている。

<p><a href="/media/uploads/1793625464883-hb3yl0.png" target="_blank" rel="noopener"><img src="/media/uploads/1793625464883-hb3yl0.png" alt="西条のアクアトピア水系にある屋根付きのうちぬき水汲み場" style="width:280px;border-radius:10px;"></a></p>

柳の下に屋根付きの水汲み場があって、「うちぬき水温」と書かれた温度計が付いている。水路には錦鯉が泳いでいて、向こう岸に夕焼けが映っていた。町なかにこれだけの水が流れているのは、他ではあまり見ない光景だと思う。

その後、西条セントラルホテルで宿泊。伊予西条駅から歩いてすぐの場所にある。駐車場はホテルの目の前だと500円、少し離れた屋根付きの駐車場なら無料。歩いて3分程度なので、今回は屋根付きの無料のほうに停めた。

夕ご飯は近くのマルヨシセンター 西条店でいつも通り半額狙いで、惣菜と刺身を数点購入した。19時30頃に行ったが、半額シールを複数見かけたので、閉店時間22時を考慮すると少し早めに感じた。

## 路面・注意事項

*   国道317号は松山から今治まで二車線で走りやすい。平日は交通量も少ない
*   鈍川温泉へ入る県道154号は幅の狭い山道区間がある。対向車に注意
*   せせらぎ交流館は毎月第2・第4月曜が休み。食堂は14時まで。月曜に当てる予定なら事前確認を
*   糸山公園の駐車場は無料で広い。展望台へは駐車場から階段を登る
*   うちぬきの水汲み場で水を汲む際は、近隣への配慮が呼びかけられている。夜間はエンジンを切って静かに
*   しまなみ海道を渡る場合は半日は見ておきたい。片道だけでも今治から尾道まで約60km

## 関連リンク

*   [来島海峡展望館（今治市）](https://www.city.imabari.ehime.jp/kanko/spot/?a=95)
*   [鈍川せせらぎ交流館（公式）](https://seseragi-onsen.com/)
*   [西条の名水「うちぬき」（西条市）](https://www.city.saijo.ehime.jp/soshiki/kanko/utinuki1.html)
*   [愛媛県｜夕やけこやけライン](/posts/post-mvyz24x8)
*   [高知県｜足摺サニーロード](/posts/post-mvyjba9b)
*   [9日間の四国ツーリング、出費25,500円の話](/posts/post-mvvnqszt)
*   [ツーリング記録の一覧](/theme/touring?cat=touring)

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※道路状況・施設の営業状況は訪問時点のものです。山間部の道や施設の営業時間は季節によって変わるため、最新情報をご確認ください。', '/media/uploads/1793625922289-nur3dr.png', 'published', 0, '2026-11-02', '鈍川温泉・しまなみ海道・来島海峡', '愛媛県', NULL, NULL, NULL, 150, '8時間', '晴れ', 'トライアンフ アメリカLT', '松山市→今治市→西条市', NULL, NULL, NULL, '2026-09-24', NULL, NULL, NULL, NULL, NULL, 0, '2026-11-02 08:04:36', '2026-11-02 14:21:31', 'ツーリングルート', '四国', '通年（基本的に海沿いなので、冬も行けなくはない）', '', NULL, NULL, '');
INSERT INTO "posts" ("id", "slug", "category", "title", "summary", "body", "cover_image", "status", "featured", "published_at", "place_name", "prefecture", "address", "lat", "lng", "distance_km", "duration_text", "weather", "bike", "route_text", "rating", "cospa", "budget", "visit_date", "business_hours", "highlight_label", "highlight_value", "highlight_sub", "meta", "views", "created_at", "updated_at", "genre", "area", "best_season", "road_note", "recommend_items", "access_text", "linked_slug") VALUES (47, 'post-mvz078vb', 'touring', '愛媛・香川・徳島｜西条から松茂へ｜仏崎展望所と銭形砂絵とこんぴらさんを繋いで、四国を横断する一日', '四国ツーリングの7日目は、西条から松茂まで県をまたいで横断する一日。翌朝のフェリーが徳島港なので、宿は港の近くに取る必要があった。ただ通過するだけではもったいないので、途中に展望所と砂絵と浜と石段を挟んだ。入場料がかかったものはひとつもなく、この日使ったのはうどん500円と夕食と宿代だけだった。', '翌日にはオーシャン東九フェリーに乗って東京へ戻る必要がある。その為やや距離はあるが徳島周辺まで行くことにした。今回のメインは金刀比羅宮の785段を登り切ることだ。

## ざっくり基本ルート

西条から国道11号で東へ。四国中央市で山側に逸れて天満峠の仏崎展望所、そこから観音寺でうどんと銭形砂絵、三豊の父母ヶ浜、内陸に入って琴平の金刀比羅宮。最後は東かがわを抜けて徳島県の松茂まで。約250km。

この日の宿を松茂にしたのは、翌朝のフェリーが徳島港だから。朝の移動を減らしたくて、前の晩のうちに県境を越えておいた。結果として東かがわあたりで完全に日が落ちて、最後の1時間は暗い中を走ることになった。

## タイムライン

| 時刻 | 場所 | メモ |
| --- | --- | --- |
| 8:00 | 西条セントラルホテル| 出発 |
| 9:30 | 天満峠 仏崎展望所 | 四国中央市と瀬戸内海を一望 |
| 11:00 | 柳川製麺所（観音寺） | うどん500円 |
| 12:00 | 銭形展望台（琴弾公園） | 寛永通宝の砂絵 |
| 13:00 | 父母ヶ浜 | 干潮に合わず |
| 15:00 | 金刀比羅宮 | 785段を往復 |
| 18:00 | 東かがわ | ここで真っ暗に |
| 19:30 | ホテルニュースカイルート | 夕食は近くの定食、900円 |

## 天満峠 仏崎展望所

当初は国道11号で四国中央方面に行く予定だったが、愛媛県道13号でも行けることが分かり、こちらを選択することにした。

新居浜市内を通り過ぎ、天満峠へ。国道11号をそのまま走っていたら絶対に寄らない場所。四国中央市の土居町天満、県道13号沿いにある小さな展望所で、無料。ただし駐車場という整備されたものはなく、待避所のような路肩スペースに停める形になる。

<p><a href="/media/uploads/1793627451250-ocj97h.png"><img src="/media/uploads/1793627451250-ocj97h.png" alt="仏崎展望所から見下ろした四国中央市の平地と瀬戸内海" style="width:280px;border-radius:10px;"></a></p>

上がってみると、眼下に四国中央市の平地と工場、その先に瀬戸内海が広がっていた。朝の斜めの光が海に当たって、沖の島影が薄く浮いている。製紙の街なので煙突が何本か立っているのだが、それも含めて風景として収まっているのが面白い。

人は誰もいなかった。看板も控えめで、観光地として作られていないぶん、着いたときの「見つけた感」がある。この日の中では一番静かな時間だった。

## 柳川製麺所

香川県に入り、うどんをGooglemapで検索。柳川製麺所をターゲットにした。観音寺のうどん屋、創業90年以上の製麺所で、8時から15時、玉がなくなり次第終了、木曜定休。

<p><a href="/media/uploads/1793627486290-tpq28w.png"><img src="/media/uploads/1793627486290-tpq28w.png" alt="観音寺の路地にある柳川製麺所の外観" style="width:280px;border-radius:10px;"></a></p>

製麺所なので構えは地味で、観光客向けの飾りはない。路地沿いの普通の建物で、のぼりがなければ通り過ぎる。客は地元の人が中心だった。

<p><a href="/media/uploads/1793627490342-7t8rlo.png"><img src="/media/uploads/1793627490342-7t8rlo.png" alt="丼に盛られたうどんと、薬味のねぎが入ったつゆ" style="width:280px;border-radius:10px;"></a></p>

細めの麺で、喉越しで食べさせるタイプ。コシで押してくる讃岐うどんのイメージとは少し違って、するすると入っていく。500円。この旅で一番安い食事だったのに、満足度は上から数えたほうが早い。

香川のうどんは観光地価格の店と地元価格の店がはっきり分かれているので、少し外れたところの製麺所に入ると値段が一段下がる。

## 銭形砂絵・琴弾八幡宮 本殿

観音寺の有明浜に描かれた砂絵で、大きさは東西122m、南北90m、周囲345m。見ると健康で長生きしてお金に困らない、という話になっている。

形がきれいに見えるのは琴弾山の山頂にある銭形展望台から。麓から琴弾公園内のドライブウェイで上がれるが、この道は一方通行で、途中のトンネルに車高3m・車幅2.1mの制限がある。バイクなら制限は気にしなくていいが、入口を間違えると麓から回り直しになる。

<p><a href="/media/uploads/1793627454675-thdffl.png"><img src="/media/uploads/1793627454675-thdffl.png" alt="展望台の木々越しに見える有明浜と銭形砂絵、奥に瀬戸内海" style="width:280px;border-radius:10px;"></a></p>

<p><a href="/media/uploads/1793627459753-wvnyy5.png"><img src="/media/uploads/1793627459753-wvnyy5.png" alt="銭形展望台から見た寛永通宝の砂絵" style="width:280px;border-radius:10px;"></a></p>

砂絵そのものは、思っていたよりはっきり見える。風や雨で崩れるたびに人の手で整えられているそうで、輪郭が妙に鋭い。文字が読めるのは展望台からだけなので、ここを外すと「ただの白い砂浜」で終わる。

同じ琴弾公園の中に琴弾八幡宮があるので、せっかくなので本殿にも寄った。山の上にあるぶん人が少なく、境内は静かだった。

<p><a href="/media/uploads/1793627464487-2n2hv2.png"><img src="/media/uploads/1793627464487-2n2hv2.png" alt="琴弾八幡宮の本殿" style="width:280px;border-radius:10px;"></a></p>

<p><a href="/media/uploads/1793627478891-eudyzs.png"><img src="/media/uploads/1793627478891-eudyzs.png" alt="琴弾八幡宮の石段の上から見下ろした参道と観音寺の町" style="width:280px;border-radius:10px;"></a></p>

参道の石段を上から見下ろすと、石の手すりの向こうに町が見える。この日はあとで785段が控えているので、ここでは長居しなかった。

ドライブウェイは一方通行だが一部ヘアピンカーブがきついところが２箇所ある。速度には注意。

## 父母ヶ浜

三豊の海岸で、干潮と無風が重なると水面が鏡になる。駐車場は無料で300台ぶんある。

<p><a href="/media/uploads/1793627501070-nwiz7z.png"><img src="/media/uploads/1793627501070-nwiz7z.png" alt="潮が引いた父母ヶ浜の広い砂浜と、まばらに歩く人" style="width:280px;border-radius:10px;"></a></p>

着いたのは昼過ぎで、潮も時間も合っていなかった。鏡にはならなかったが、引いた砂浜に水が薄く残っていて、浅いところだけ空が映っていた。狙いの絵は撮れなかったものの、人が少ないぶん静かで、これはこれで悪くない。

<p><a href="/media/uploads/1793627496572-duqjv8.png"><img src="/media/uploads/1793627496572-duqjv8.png" alt="浜に薄く残った水面に空が映り込んでいる" style="width:280px;border-radius:10px;"></a></p>

30分くらい色々な角度で撮影を試みたが、成功といえる写真は撮れなかった。やはり夕方頃に行くのがベストだろうか。

本気で狙うなら干潮と日没が重なる日を選んで、夕方の時間を丸ごと空けておく必要がある。横断の途中に挟む場所ではない、というのが正直なところ。逆に言えば、通りがかりで寄るなら期待値を下げておいたほうが楽しめる。

## 金刀比羅宮

こんぴらさん。参道口から御本宮まで785段。

金刀比羅宮には専用の参拝者駐車場がなく、町内の駐車場に置いて歩く形になる。御本宮近くまで上がれる車輌乗入の予約制度もあるが、対象は乗用車・マイクロバス・タクシーで、自転車とバイクは乗り入れできない。原則全員、石段を登ることになる。

バイクは琴平駅の近くにある無料駐輪場に停めた。近くに有料のパーキングが複数ある。

<p><a href="/media/uploads/1793627510835-0pcl4o.png"><img src="/media/uploads/1793627510835-0pcl4o.png" alt="土産物屋が並ぶ金刀比羅宮の参道と石段" style="width:280px;border-radius:10px;"></a></p>

ブーツで785段は正直きつい。途中の旭社あたりで一度足が止まった。

<p><a href="/media/uploads/1793627521906-4hv7r0.png"><img src="/media/uploads/1793627521906-4hv7r0.png" alt="金刀比羅宮の御本宮を斜めから見たところ" style="width:280px;border-radius:10px;"></a></p>

<p><a href="/media/uploads/1793627525649-6mkeax.png"><img src="/media/uploads/1793627525649-6mkeax.png" alt="金の提灯が下がる金刀比羅宮 御本宮の正面" style="width:280px;border-radius:10px;"></a></p>

海の神様なので、奉納されている絵馬には船の絵が多い。交通の神でもあるから、バイクで来て手を合わせるのも筋としてはおかしくない。

<p><a href="/media/uploads/1793627515987-iud77y.png"><img src="/media/uploads/1793627515987-iud77y.png" alt="御本宮の展望台から見た讃岐平野と讃岐富士" style="width:280px;border-radius:10px;"></a></p>

登りきると讃岐平野が開けて、奥に讃岐富士が見える。ここまで来ないと見られない景色なので、登る価値はある。

## 東かがわから松茂へ

琴平を出たのが17時前。国道11号に戻って東へ向かううちに日が落ちて、東かがわに入る頃には完全に真っ暗になった。

この区間は街灯が途切れるところがあり、しかもトラックが多い。日中なら何ということもない道だが、暗くなってからの単独走行は神経を使う。県境を越えて松茂に着いたのは19時半頃だった。

松茂は徳島阿波踊り空港から車で5分ほどの場所で、翌朝の徳島港までが近い。宿代3,000円、夕食は近くで定食900円。最終日の朝に慌てずに済んだので、この判断は正解だった。

## 路面・注意事項

*   天満峠の仏崎展望所には駐車場がない。路肩のスペースに停めるので、交通の妨げにならない位置を選ぶこと
*   柳川製麺所は15時まで、木曜定休。玉がなくなると早く閉まる
*   琴弾公園のドライブウェイは一方通行。きついヘアピンが2か所あるので速度に注意。入口を間違えると麓から登り直し
*   父母ヶ浜は干潮と日没が重ならないと鏡にならない。潮見表を先に見ておく
*   金刀比羅宮はバイクの乗り入れ不可。町内の駐輪場・駐車場に置いて785段を歩く。往復1時間半〜2時間
*   国道11号は交通量が多く信号も多い。200kmという数字以上に時間を食う
*   東かがわ〜板野の夜間走行は街灯が少なくトラックが多い。日没までに通過できる行程が理想

## 関連リンク

*   [天満峠 仏崎展望所（四国中央市）](https://akuro-furari.com/tenmatouge-shikokuchuo/)
*   [柳川製麺所（観音寺市観光協会）](https://kanonji-kanko.jp/yanagawa-noodlefactory/)
*   [銭形砂絵「寛永通宝」（観音寺市）](https://www.city.kanonji.kagawa.jp/soshiki/21/333.html)
*   [父母ヶ浜（三豊市観光交流局）](https://www.mitoyo-kanko.com/chichibugahama/)
*   [金刀比羅宮](https://www.konpira.or.jp/)
*   [愛媛県｜鈍川温泉と来島海峡](/posts/post-mvyz3spd)
*   [四国9日間の出費まとめ](/posts/post-mvvnqszt)

ほかのキャンプ場やツーリングの記録は[ツーリング記録の一覧](/theme/touring?cat=touring)にまとめてある。

※道路状況・施設の営業状況は訪問時点のものです。山間部の道や施設の営業時間は季節によって変わるため、最新情報をご確認ください。', '/media/uploads/1793627982191-ud917f.png', 'published', 0, '2026-11-02', '仏崎展望所・銭形砂絵・父母ヶ浜・金刀比羅宮', '愛媛県, 香川県, 徳島県', NULL, 33.841839, 132.775034, 250, '', '晴れ', 'トライアンフ アメリカLT', '西条市→新居浜市→四国中央市→観音寺市→三豊市→琴平町→綾川町→高松市→三木町→さぬき市→東かがわ市→鳴門市→松茂町', NULL, NULL, NULL, '2026-09-25', NULL, NULL, NULL, NULL, NULL, 0, '2026-11-02 08:35:16', '2026-11-03 01:43:05', 'ツーリングルート', '四国', '通年（石段があるので凍結期は避けたい。春〜秋が歩きやすい）', '', NULL, NULL, '');
INSERT INTO "tags" ("id", "name", "slug") VALUES (1, 'NISA', 'nisa');
INSERT INTO "tags" ("id", "name", "slug") VALUES (2, 'iDeCo', 'ideco');
INSERT INTO "tags" ("id", "name", "slug") VALUES (3, '振り返り', 'furikaeri');
INSERT INTO "tags" ("id", "name", "slug") VALUES (4, 'インデックス投資', 'index');
INSERT INTO "tags" ("id", "name", "slug") VALUES (5, '生活費', 'seikatsuhi');
INSERT INTO "tags" ("id", "name", "slug") VALUES (6, 'コスパ', 'cospa');
INSERT INTO "tags" ("id", "name", "slug") VALUES (7, '節約', 'setsuyaku');
INSERT INTO "tags" ("id", "name", "slug") VALUES (8, '長野', 'nagano');
INSERT INTO "tags" ("id", "name", "slug") VALUES (9, '高知', 'kochi');
INSERT INTO "tags" ("id", "name", "slug") VALUES (10, '北海道', 'hokkaido');
INSERT INTO "tags" ("id", "name", "slug") VALUES (11, '日帰り', 'higaeri');
INSERT INTO "tags" ("id", "name", "slug") VALUES (12, '絶景', 'zekkei');
INSERT INTO "tags" ("id", "name", "slug") VALUES (13, '惣菜', 'souzai');
INSERT INTO "tags" ("id", "name", "slug") VALUES (14, '地場野菜', 'jibayasai');
INSERT INTO "tags" ("id", "name", "slug") VALUES (15, '生成AI', 'seiseiai');
INSERT INTO "tags" ("id", "name", "slug") VALUES (16, '自動化', 'jidouka');
INSERT INTO "tags" ("id", "name", "slug") VALUES (17, '業務改善', 'gyoumukaizen');
INSERT INTO "tags" ("id", "name", "slug") VALUES (76, '自己紹介', 'post-mtzu8glc');
INSERT INTO "tags" ("id", "name", "slug") VALUES (77, 'オルカン', 'post-mtzu8gyr');
INSERT INTO "tags" ("id", "name", "slug") VALUES (78, '資産公開', 'post-mtzu8hbb');
INSERT INTO "tags" ("id", "name", "slug") VALUES (79, '1億円', 'post-mtzu8hnt');
INSERT INTO "tags" ("id", "name", "slug") VALUES (101, '基準価額', 'post-mu2ezqi4');
INSERT INTO "tags" ("id", "name", "slug") VALUES (102, '複利', 'post-mu2ezqti');
INSERT INTO "tags" ("id", "name", "slug") VALUES (103, '下落', 'post-mu2ezr52');
INSERT INTO "tags" ("id", "name", "slug") VALUES (182, 'ご当地スーパー', 'post-mvgnz3n7');
INSERT INTO "tags" ("id", "name", "slug") VALUES (183, '岩手', 'post-mvgnz4ci');
INSERT INTO "tags" ("id", "name", "slug") VALUES (184, '評価3', 'post-mvgnz4nm');
INSERT INTO "tags" ("id", "name", "slug") VALUES (186, '宮城', 'post-mvgnzkpc');
INSERT INTO "tags" ("id", "name", "slug") VALUES (190, '評価5', 'post-mvgnzwm8');
INSERT INTO "tags" ("id", "name", "slug") VALUES (205, '青森', 'post-mvi4pgr5');
INSERT INTO "tags" ("id", "name", "slug") VALUES (254, 'キャンプ場', 'post-mvl30izn');
INSERT INTO "tags" ("id", "name", "slug") VALUES (256, '無料格安キャンプ場', 'post-mvl30joj');
INSERT INTO "tags" ("id", "name", "slug") VALUES (258, '徳島', 'post-mvl3121a');
INSERT INTO "tags" ("id", "name", "slug") VALUES (284, '竜飛岬', 'post-mvm5507w');
INSERT INTO "tags" ("id", "name", "slug") VALUES (285, '津軽半島. 竜泊ライン', 'post-mvm550ii');
INSERT INTO "tags" ("id", "name", "slug") VALUES (300, '津軽半島', 'post-mvm5hvll');
INSERT INTO "tags" ("id", "name", "slug") VALUES (301, '竜泊ライン', 'post-mvm5hvw1');
INSERT INTO "tags" ("id", "name", "slug") VALUES (416, '定期預金', 'post-mvnhcd7m');
INSERT INTO "tags" ("id", "name", "slug") VALUES (417, 'SBI新生銀行', 'post-mvnhcdke');
INSERT INTO "tags" ("id", "name", "slug") VALUES (482, 'キャンペーン', 'post-mvnvaree');
INSERT INTO "tags" ("id", "name", "slug") VALUES (483, '銀行', 'post-mvnvarow');
INSERT INTO "tags" ("id", "name", "slug") VALUES (566, '固定費', 'post-mvpb5owe');
INSERT INTO "tags" ("id", "name", "slug") VALUES (567, '家計', 'post-mvpb5p7m');
INSERT INTO "tags" ("id", "name", "slug") VALUES (568, 'ツーリング', 'post-mvpb5pit');
INSERT INTO "tags" ("id", "name", "slug") VALUES (581, '山形', 'post-mvpd1bdk');
INSERT INTO "tags" ("id", "name", "slug") VALUES (596, '山形県', 'post-mvqq8y6z');
INSERT INTO "tags" ("id", "name", "slug") VALUES (598, '長野県', 'post-mvqq99ty');
INSERT INTO "tags" ("id", "name", "slug") VALUES (600, '青森県', 'post-mvqq9ma0');
INSERT INTO "tags" ("id", "name", "slug") VALUES (648, '秋田', 'post-mvtmw6vq');
INSERT INTO "tags" ("id", "name", "slug") VALUES (657, '豊富温泉', 'post-mvv164n7');
INSERT INTO "tags" ("id", "name", "slug") VALUES (658, 'オロロンライン', 'post-mvv164xr');
INSERT INTO "tags" ("id", "name", "slug") VALUES (659, '宗谷岬', 'post-mvv1659c');
INSERT INTO "tags" ("id", "name", "slug") VALUES (660, '宗谷丘陵', 'post-mvv165n0');
INSERT INTO "tags" ("id", "name", "slug") VALUES (661, 'エサヌカ線', 'post-mvv165xd');
INSERT INTO "tags" ("id", "name", "slug") VALUES (667, 'エサヌカ', 'post-mvv19c8m');
INSERT INTO "tags" ("id", "name", "slug") VALUES (668, '寒風山', 'post-mvv1e0zx');
INSERT INTO "tags" ("id", "name", "slug") VALUES (669, '男鹿半島', 'post-mvv1e1ad');
INSERT INTO "tags" ("id", "name", "slug") VALUES (692, 'ツーリング費用', 'post-mvvnqtkj');
INSERT INTO "tags" ("id", "name", "slug") VALUES (704, '従業員持株会', 'post-mvvoxcxj');
INSERT INTO "tags" ("id", "name", "slug") VALUES (705, '自社株', 'post-mvvoxd87');
INSERT INTO "tags" ("id", "name", "slug") VALUES (707, '奨励金', 'post-mvvoxdt7');
INSERT INTO "tags" ("id", "name", "slug") VALUES (708, '資産形成', 'post-mvvoxe39');
INSERT INTO "tags" ("id", "name", "slug") VALUES (729, 'ふるさと納税', 'post-mvx3vtdf');
INSERT INTO "tags" ("id", "name", "slug") VALUES (730, '節税', 'post-mvx3vto6');
INSERT INTO "tags" ("id", "name", "slug") VALUES (731, 'ワンストップ特例', 'post-mvx3vtyk');
INSERT INTO "tags" ("id", "name", "slug") VALUES (732, '返礼品', 'post-mvx3vu9a');
INSERT INTO "tags" ("id", "name", "slug") VALUES (733, '制度改正', 'post-mvx3vujy');
INSERT INTO "tags" ("id", "name", "slug") VALUES (745, '年末調整', 'post-mvx7rsxp');
INSERT INTO "tags" ("id", "name", "slug") VALUES (746, '所得控除', 'post-mvx7rt92');
INSERT INTO "tags" ("id", "name", "slug") VALUES (747, '還付申告', 'post-mvx7rtka');
INSERT INTO "tags" ("id", "name", "slug") VALUES (754, '制度まとめ', 'post-mvxedy12');
INSERT INTO "tags" ("id", "name", "slug") VALUES (813, '構築', 'post-mvxtvmy7');
INSERT INTO "tags" ("id", "name", "slug") VALUES (831, '愛媛', 'post-mvyax6t0');
INSERT INTO "tags" ("id", "name", "slug") VALUES (832, '四国カルスト', 'post-mvyax73n');
INSERT INTO "tags" ("id", "name", "slug") VALUES (833, '天空の道', 'post-mvyax7e0');
INSERT INTO "tags" ("id", "name", "slug") VALUES (834, '仁淀ブルー', 'post-mvyax7oa');
INSERT INTO "tags" ("id", "name", "slug") VALUES (835, '日帰りルート', 'post-mvyax7yq');
INSERT INTO "tags" ("id", "name", "slug") VALUES (879, '四国', 'post-mvyjbawh');
INSERT INTO "tags" ("id", "name", "slug") VALUES (880, '足摺岬', 'post-mvyjbb79');
INSERT INTO "tags" ("id", "name", "slug") VALUES (881, '竜串', 'post-mvyjbbi8');
INSERT INTO "tags" ("id", "name", "slug") VALUES (882, '国道321号', 'post-mvyjbbt4');
INSERT INTO "tags" ("id", "name", "slug") VALUES (883, '移動日', 'post-mvyjbc44');
INSERT INTO "tags" ("id", "name", "slug") VALUES (916, '下灘駅', 'post-mvyz25u3');
INSERT INTO "tags" ("id", "name", "slug") VALUES (917, '道後温泉', 'post-mvyz264j');
INSERT INTO "tags" ("id", "name", "slug") VALUES (918, '宇和島城', 'post-mvyz26f0');
INSERT INTO "tags" ("id", "name", "slug") VALUES (921, 'しまなみ海道', 'post-mvyzyqrz');
INSERT INTO "tags" ("id", "name", "slug") VALUES (922, '来島海峡大橋', 'post-mvyzyr2n');
INSERT INTO "tags" ("id", "name", "slug") VALUES (923, '鈍川温泉', 'post-mvyzyrdc');
INSERT INTO "tags" ("id", "name", "slug") VALUES (924, 'うちぬき', 'post-mvyzyro5');
INSERT INTO "tags" ("id", "name", "slug") VALUES (926, '香川', 'post-mvz079fm');
INSERT INTO "tags" ("id", "name", "slug") VALUES (928, '銭形砂絵', 'post-mvz07a0n');
INSERT INTO "tags" ("id", "name", "slug") VALUES (929, '金刀比羅宮', 'post-mvz07aba');
INSERT INTO "tags" ("id", "name", "slug") VALUES (930, '無料スポット', 'post-mvz07aqs');
INSERT INTO "tags" ("id", "name", "slug") VALUES (973, '入道崎', 'post-mvz3233d');
INSERT INTO "tags" ("id", "name", "slug") VALUES (974, 'ツーリングルート', 'post-mvz323el');
INSERT INTO "tags" ("id", "name", "slug") VALUES (979, '咸陽島', 'post-mvz32xtx');
INSERT INTO "tags" ("id", "name", "slug") VALUES (986, 'にこ淵', 'post-mvz3cagi');
INSERT INTO "tags" ("id", "name", "slug") VALUES (991, '展望台', 'post-mvz3d5ir');
INSERT INTO "tags" ("id", "name", "slug") VALUES (1106, 'ツールングルート', 'post-mvz9sd4b');
