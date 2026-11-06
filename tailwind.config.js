/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // JSX / 管理画面JS / site.js の中のクラス名をすべて走査する
  content: ['./src/**/*.{ts,tsx}', './public/static/*.js'],
  // 動的に組み立てるクラス（文字列連結・テンプレートリテラル）の取りこぼし対策
  safelist: [
    'line-clamp-2',
    'line-clamp-3',
    'line-clamp-4',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'sm:grid-cols-2',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    { pattern: /^(bg|text|border)-(base|panel|panel2|edge|edge2|ink|sub|mute|brand|brandsoft)$/ }
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Noto Sans JP',
          '-apple-system',
          'BlinkMacSystemFont',
          'Hiragino Sans',
          'Helvetica Neue',
          'sans-serif'
        ],
        mono: ['Roboto Mono', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        base: '#0a0a0b',
        panel: '#121214',
        panel2: '#18181b',
        edge: 'rgba(255,255,255,0.10)',
        edge2: 'rgba(255,255,255,0.06)',
        ink: '#f5f5f7',
        sub: '#a1a1aa',
        mute: '#71717a',
        brand: '#f97316',
        brandsoft: 'rgba(249,115,22,0.14)'
      },
      maxWidth: { page: 'clamp(1280px, 86vw, 1760px)', text: '800px' },
      borderRadius: { apple: '14px', big: '18px' }
    }
  }
  // line-clamp は Tailwind v3.3 以降は標準搭載のためプラグイン不要
}
