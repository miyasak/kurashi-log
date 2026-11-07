# 運用メモ

## 環境

- Cloudflareアカウント: tgmiyasaka@gmail.com（2FAあり、リカバリコードは別途保管）
- 公開URL: https://tadoreru.com
- Pagesプロジェクト: tadoreru（本番ブランチ main、既定URL tadoreru-eh9.pages.dev）
- D1: tadoreru / 6de3e843-fbac-4574-9d3a-f57fe835637a
- R2: tadoreru-media（画像は uploads/ 配下）
- バインディングは wrangler.jsonc に記載（D1は DB、R2は R2）

## 反映手順
npm run build npx wrangler pages deploy dist --project-name=tadoreru
これだけ。自分のアカウントなので回数制限はない。

## ローカル開発
npm run build npm run dev:sandbox

http://localhost:3000 で確認。管理画面は .dev.vars の ADMIN_PASSWORD（localtest）で入る。
.dev.vars は3行（ADMIN_PASSWORD / SESSION_SECRET / DEV_MEDIA_ORIGIN）。本番とは別の値にすること。
.gitignore で除外済みなのでGitHubには上がらない。

ローカルR2は空なので、画像は DEV_MEDIA_ORIGIN（https://tadoreru.com）から借りて表示している。

## シークレット

本番の ADMIN_PASSWORD と SESSION_SECRET は Pages のシークレットに登録済み。
auth.ts は SESSION_SECRET が無いと例外を投げるので、両方必須。

変更する場合:
npx wrangler pages secret put SESSION_SECRET --project-name=tadoreru npx wrangler pages secret put ADMIN_PASSWORD --project-name=tadoreru

値は openssl rand -base64 32 で生成し、画面に出さない。
一度入れると読み出せない。忘れても put し直せば復旧できる（ログイン中のセッションは切れる）。
ADMIN_PASSWORD を変えると既存セッションが無効になる仕様。
シークレット変更後は一度デプロイし直すこと。

## マイグレーション

0001〜0009 は本番に適用済み。新しく追加したときは、
npx wrangler d1 migrations apply tadoreru --local npx wrangler d1 migrations apply tadoreru --remote


--remote を付けないとローカルDBしか変わらない。

0009_image_width.sql は本文を丸ごとUPDATEする内容なので、作り直したくなったら
scripts/fix-image-width.mjs で生成し直すこと（既存のSQLをそのまま流さない）。

## バックアップ

npx wrangler d1 export tadoreru --remote --output=backup_YYYYMMDD.sql


画像は media-backup/ にローカル控えあり（158枚）。
どちらも .gitignore 済み。

## ゴーストタグの掃除

upsertPost / deletePost で自動掃除するようにしたので通常は不要。
手動でやるなら、

```sql
DELETE FROM tags WHERE NOT EXISTS (SELECT 1 FROM post_tags pt WHERE pt.tag_id = tags.id)

## 残りの宿題

favicon とアプリアイコンがバイクのまま
カテゴリ管理画面（今は config.ts 直書き）
記事末の免責文を管理画面から編集できるようにする
/about の文言を管理画面から編集できるようにする
関連記事を1〜3件選べるようにする（今は linked_slug で1件のみ）
本文画像の max-height