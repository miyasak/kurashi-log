#!/usr/bin/env node
/**
 * 本番用のCSSを生成する。
 *
 * 1) Tailwind: cdn.tailwindcss.com（公式に本番非推奨）をやめ、
 *    実際に使っているクラスだけをビルドして public/static/tw.css に出す。
 * 2) Font Awesome: フルCSS（約100KB + 大きなwebフォント）をやめ、
 *    使用しているアイコンのグリフだけを SVG で埋め込んだ CSS を生成する。
 *    → webフォントのダウンロードが不要になる。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'static')

/* ---------------------------------------------- 1) Tailwind */
execFileSync(
  process.execPath,
  [
    join(ROOT, 'node_modules', 'tailwindcss', 'lib', 'cli.js'),
    '-c',
    join(ROOT, 'tailwind.config.js'),
    '-i',
    join(ROOT, 'src', 'styles', 'tailwind.css'),
    '-o',
    join(OUT, 'tw.css'),
    '--minify'
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] }
)
console.log('tw.css', statSync(join(OUT, 'tw.css')).size, 'bytes')

/* ---------------------------------------------- 2) Font Awesome サブセット */

// ソースから実際に使っているアイコン名を集める
function walk(dir, acc = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else if (/\.(tsx?|js)$/.test(f)) acc.push(p)
  }
  return acc
}
const files = [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'public', 'static'))]
const used = new Map() // name -> style ('solid' | 'regular')
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/fa-(solid|regular|brands)\s+fa-([a-z0-9-]+)/g)) {
    // 同じアイコンが solid / regular 両方で使われる場合は両方必要
    used.set(`${m[1]}:${m[2]}`, { style: m[1], name: m[2] })
  }
  // config.ts のようにアイコン名だけを文字列で持つ場合も拾う（'fa-mug-hot' など）
  for (const m of src.matchAll(/['"`]fa-([a-z0-9-]+)['"`]/g)) {
    if (['solid', 'regular', 'brands', 'fw'].includes(m[1])) continue
    if (!used.has(`solid:${m[1]}`)) used.set(`solid:${m[1]}`, { style: 'solid', name: m[1] })
  }
}

// Font Awesome の SVG ファイルからグリフを読む（svgs/<style>/<name>.svg）
const svgRoot = join(ROOT, 'node_modules', '@fortawesome', 'fontawesome-free', 'svgs')
if (!existsSync(svgRoot)) {
  console.warn('! fontawesome-free が無いため、サブセットCSSの生成をスキップしました')
  process.exit(0)
}

const rules = []
const missing = []
for (const { style, name } of used.values()) {
  // 指定スタイルに無ければ solid にフォールバック
  const candidates = [join(svgRoot, style, `${name}.svg`), join(svgRoot, 'solid', `${name}.svg`)]
  const hit = candidates.find((f) => existsSync(f))
  if (!hit) {
    missing.push(`${style}/${name}`)
    continue
  }
  // fill 属性を消して currentColor を効かせる（mask なので実際は色は無関係）
  const svg = readFileSync(hit, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*fill="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const url = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')
  rules.push(
    `.fa-${style}.fa-${name},.fa-${name}.fa-${style}{-webkit-mask-image:url("data:image/svg+xml,${url}");mask-image:url("data:image/svg+xml,${url}")}`
  )
}

const base = `/* Font Awesome subset — 使用アイコンのみ（webフォント読み込みなし） */
.fa-solid,.fa-regular,.fa-brands{
  display:inline-block;
  width:1em;height:1em;
  vertical-align:-0.125em;
  background-color:currentColor;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
  -webkit-mask-position:center;mask-position:center;
  -webkit-mask-size:contain;mask-size:contain;
  flex-shrink:0;
}
.fa-fw{width:1.25em}
`

writeFileSync(join(OUT, 'fa.css'), base + rules.join('\n') + '\n')
console.log(
  'fa.css',
  statSync(join(OUT, 'fa.css')).size,
  'bytes /',
  rules.length,
  'icons'
)
if (missing.length) console.warn('! 見つからなかったアイコン:', missing.join(', '))
