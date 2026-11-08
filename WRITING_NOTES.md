# 記事を書くときのメモ

## タグの付け方

タグは「種類」と「エリア」の2段で表示される。エリアに並ぶのは `src/lib/config.ts` の`AREA_TAGS` に載っている名前だけで、それ以外は種類の行に出る。

記事ごとに最低3つ入れる。

- 種類：無料格安キャンプ場 / ツーリングルート / ご当地スーパー / 展望台 など
- 県名：長野、高知、青森 など（「県」は付けない）
- 地方名：東北 / 中部 / 四国 / 北海道 / 関東 / 近畿 / 中国 / 九州 / 沖縄

地方名を入れ忘れるとエリア絞り込みから漏れる。北海道は県名と地方名が同じなので1つでよい。

| 県 | 地方名 |
|---|---|
| 青森・岩手・宮城・秋田・山形・福島 | 東北 |
| 新潟・富山・石川・福井・山梨・長野・岐阜・静岡・愛知 | 中部 |
| 徳島・香川・愛媛・高知 | 四国 |

スポット名（竜飛岬、にこ淵など1件しか付かないもの）は付けてよいが、2件以上にならないとチップには出ない。記事内の記録として残る。

### 入れ忘れたときの補完

県名から地方名を後付けできる。`INSERT OR IGNORE` なので何度流しても安全。
`--local` と `--remote` の両方に流すこと。

npx wrangler d1 execute tadoreru --remote --command="INSERT OR IGNORE INTO post_tags (post_id, tag_id) SELECT DISTINCT pt.post_id, (SELECT id FROM tags WHERE name='四国') FROM post_tags pt JOIN tags t ON t.id=pt.tag_id WHERE t.name IN ('高知','愛媛','香川','徳島')"

地方名と県名の部分を入れ替えれば他の地方にも使える。新しい地方タグを使う前にはタグ自体の作成が必要。

npx wrangler d1 execute tadoreru --remote --command="INSERT OR IGNORE INTO tags (name, slug) VALUES ('関東','関東')"


タグのスラッグは名前と同じ（日本語のまま）に統一している。`src/lib/db.ts` で
`const tslug = name` としているので、新しいタグも自動で揃う。

## 日付

記事カードの日付は `visit_date`（走行日・訪問日）があればそれを優先し、
無ければ `published_at`（公開日）が出る。ツーリング・キャンプ・スーパーの記事では
必ず `visit_date` を入れること。入れないと公開日が出て、実際に行った日とズレる。

## 抜粋（summary）

空にすると本文から自動生成され、HTMLタグが混ざったり途中で切れたりする。
1〜2文で手書きすること。

## シリーズものの日数

「四国ツーリング○日目」のような表記は、出発日から数える。
走り始めた日ではなく移動初日が1日目。既存記事と矛盾しないか、
公開前に `visit_date` 順で並べて確認する。

npx wrangler d1 execute tadoreru --local --command="SELECT visit_date, substr(title,1,30) FROM posts WHERE status='published' AND visit_date<>'' ORDER BY visit_date"

## タイトル

30〜35文字に収める。区切り（｜）は2つまで。

Googleの検索結果はPCで全角32文字前後、スマホで40文字前後で切られる。
カードの見出しは2行までなので、40文字を超えた分は表示されない。

形は「県名｜何をしたか」が基本。見どころを3つ並べたくなるが、2つに絞る。
残りは本文で書けばよい。

お金系の記事は数字が主役なので、文字数より数字を優先してよい。
（例：ツーリング9日間の現地出費が25,500円だった話）
