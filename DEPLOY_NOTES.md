# 運用メモ

## 環境

- Cloudflareアカウント: （2FAあり、リカバリコードは別途保管）
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

## D1はローカルとリモートが別物

`npm run dev:sandbox` で開いた管理画面は `.wrangler/state/v3/d1` のローカルDBに書き込む。
本番データを直すときは必ず https://tadoreru.com/admin から操作すること。
ローカルで編集して「反映されない」と悩んだら、まずこれを疑う。

CLIは同時実行のオプションが無いので2回に分ける。`~/.zshrc` に入れておくと楽。

d1() { npx wrangler d1 execute tadoreru --local --command="$1" && npx wrangler d1 execute tadoreru --remote --command="$1" }

ローカルが失敗したらリモートは実行されない。逆にローカル成功・リモート失敗（認証切れ）だと
ズレるので、エラーが出たらリモートだけ流し直す。

認証切れのサイン: `code: 7403 The given account is not valid or is not authorized`。
`npx wrangler whoami` → 必要なら `logout` / `login`。

## posts にカラムを足すときの手順

1. `ALTER TABLE posts ADD COLUMN ...` を local と remote の両方に流す
2. `src/lib/db.ts` の `COLS`（読み取り用）に追加
3. `src/lib/db.ts` の `POST_FIELDS`（書き込み用）に追加 ← 忘れると保存時に無視される
4. 数値カラムなら `['rating','cospa','budget','series_day']` の変換リストにも追加。
   入れないと空欄のとき空文字が入り、並び順が壊れる
5. `public/static/admin.js` の `renderEditor` に入力欄を追加

`db.ts` の保存処理は `POST_FIELDS` を回してSQLを組み立てるので、3を入れれば
API側（`src/routes/api.ts`）は触らなくてよい。

## ダークテーマの名残

元のテンプレートが黒基調だったため、`rgba(255,255,255,...)` や
`hover:bg-white/[0.07]` が残っていると明るい背景（#f1f1ec）で見えなくなる。
過去に2回踏んだ（ナビのホバー色、評価星の空色）。色を足すときは `rgba(0,0,0,...)` 側で書く。

## 管理画面の構成

- `src/views/admin.tsx` … 外枠とログイン画面のみ（158行）
- `public/static/admin.js` … フォームと一覧の実体（約68KB）。
  ビルド対象外なので編集すればそのまま配信される。デプロイは必要
- `src/routes/api.ts` … APIの入口。保存処理の中身は `src/lib/db.ts`

## 管理画面の保護（Cloudflare Access）

2026-11-10 設定。`/admin` と `/api/admin/*` を Cloudflare Zero Trust の Access で保護している。
アプリ側の ADMIN_PASSWORD と合わせて二重の守り。リポジトリが public でも、
Access を通らないとログイン画面にすら到達できない。

- チーム名: `orange-dew-8744`（ログインURL: https://orange-dew-8744.cloudflareaccess.com）
- プラン: Zero Trust Free（50ユーザーまで無料）
- アプリ: `Tadoreru Admin`（Self-hosted）
- Destinations: `tadoreru.com` / `admin`、`tadoreru.com` / `api/admin`
  ※ Path は先頭スラッシュ無しで書く。`/admin` と書くとマッチしない
- ポリシー: `Me` / Action: Allow / Include: Emails = tgmiyasaka@gmail.com
- 認証: One-time PIN（IdP連携なし。メールに届くコードを入力する）
- Session Duration: 24 hours

### 動作確認
curl -s https://tadoreru.com/admin | grep -i "cloudflare access" curl -s https://tadoreru.com/api/admin/posts | head -3

どちらも `Sign in ・ Cloudflare Access` のHTMLが返れば正常。
`/api/admin/posts` が JSON を返したら保護が外れている（Destinations の登録漏れを疑う）。
あわせてシークレットウィンドウでトップ・記事・/map・/privacy が
ログイン無しで見えることも確認する。

### はまりどころ
- `api/admin` を登録し忘れると、画面だけ守られてAPIが素通りになる
- 管理用のパスを新しく増やしたら Destinations にも追加する
- ログインが2回（Access → 管理画面のパスワード）出るのは仕様。不具合ではない
- ADMIN_PASSWORD / SESSION_SECRET は Pages Secrets にのみ置く。ファイルには書かない
  再設定: `npx wrangler pages secret put ADMIN_PASSWORD --project-name=tadoreru`
- 一時的に外したいときは Zero Trust → Access → Applications → Tadoreru Admin を Disable
