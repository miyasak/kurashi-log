# 本番反映メモ

## 1. 適用済みマイグレーションの確認
本番D1に 0004 以降が当たっているか不明。
本番ダッシュボードのタグ数が99のままなら 0004 は未適用。
未適用なら 0004 → 0005 → 0006 → 0007 → 0008 の順で流す（順番厳守）。

## 2. 0006 を流す前に必ず確認
0006_camp_data.sql は id 直書き。本番のidがずれていると別記事を壊す。
下記の対応が本番でも一致することを確認してから実行する。

| id | slug |
|----|------|
| 23 | post-mvl30i62 |
| 26 | post-mvnrc3hv |
| 29 | post-mvpd1b6k |
| 30 | post-mvqq733y |
| 31 | post-mvs1isix |
| 33 | post-mvtll4bp |
| 34 | post-mvtmw6m3 |
| 41 | post-mvxng9x3 |
| 42 | post-mvxtvmom |

確認コマンド:
SELECT id, slug FROM posts WHERE id IN (23,26,29,30,31,33,34,41,42) ORDER BY id

一致しない場合は 0006 を流さず、slug 指定に書き直してから実行する。

## 3. 0008 は slug 指定なのでそのまま流してよい

## 4. 独自ドメイン移行時にやること
- src/index.tsx の /media/* に Genspark の本番URLが直書きされている。要修正。
- ADMIN_PASSWORD と SESSION_SECRET を移行先に設定する（未設定だと管理画面に入れない）。

DELETE FROM tags WHERE NOT EXISTS (SELECT 1 FROM post_tags pt WHERE pt.tag_id = tags.id);
