import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const ORIGIN = process.env.ORIGIN || 'http://localhost:3000'

function size(b) {
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  if (b[0] === 0x47 && b[1] === 0x49) return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) }
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') {
    const t = b.subarray(12, 16).toString()
    if (t === 'VP8X') return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 }
    if (t === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }
    if (t === 'VP8L') { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 } }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue }
      const m = b[i + 1]
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }
      i += 2 + b.readUInt16BE(i + 2)
    }
  }
  return null
}

const cache = new Map()
async function widthFor(path) {
  if (cache.has(path)) return cache.get(path)
  let w = 360
  try {
    const res = await fetch(ORIGIN + path)
    const s = res.ok ? size(Buffer.from(await res.arrayBuffer())) : null
    if (s) {
      const r = s.w / s.h
      w = r > 1.15 ? 360 : r < 0.85 ? 260 : 300
      console.log(`${path}  ${s.w}x${s.h}  -> ${w}px`)
    } else console.log(`${path}  サイズ不明 -> 360px`)
  } catch {
    console.log(`${path}  取得失敗 -> 360px`)
  }
  cache.set(path, w)
  return w
}

const raw = execFileSync('npx', [
  'wrangler', 'd1', 'execute', 'webapp-production', '--local', '--json',
  '--command', "SELECT id, body FROM posts WHERE body LIKE '%width:280px%' ORDER BY id",
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const rows = JSON.parse(raw.slice(raw.indexOf('[')))[0].results

const lines = []
for (const row of rows) {
  const tags = [...row.body.matchAll(/<img[^>]*src="([^"]+)"[^>]*width:280px[^>]*>/g)]
  if (!tags.length) continue
  let body = row.body
  for (const t of tags) {
    const w = await widthFor(t[1])
    body = body.replace(t[0], t[0].replace('width:280px', `width:${w}px`))
  }
  if (body !== row.body)
    lines.push(`UPDATE posts SET body = '${body.replace(/'/g, "''")}' WHERE id = ${row.id};`)
}

writeFileSync('migrations/0009_image_width.sql', lines.join('\n\n') + '\n')
console.log(`\n${lines.length}記事ぶんを migrations/0009_image_width.sql に書き出したにゃ`)