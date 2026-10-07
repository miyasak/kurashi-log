import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      /**
       * Worker を通さず Cloudflare Pages に直接配信させるパス。
       * ここに入れないと OG画像やファビコンが Worker に吸われて404になる。
       */
      emptyOutDir: false,
      entryContentAfterHooks: []
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    }),
    {
      // ビルド後に _routes.json を上書きして、静的ファイルを除外に追加する
      name: 'patch-routes-json',
      apply: 'build',
      closeBundle() {
        const fs = require('node:fs')
        const p = 'dist/_routes.json'
        const routes = {
          version: 1,
          include: ['/*'],
          exclude: [
            '/static/*',
            '/og.png',
            '/favicon.ico',
            '/icon-32.png',
            '/icon-180.png',
            '/icon-512.png',
            '/site.webmanifest'
          ]
        }
        fs.writeFileSync(p, JSON.stringify(routes))
      }
    }
  ]
})
