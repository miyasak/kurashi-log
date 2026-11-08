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
      /* public/static/style.css の :root と同じ値にすること。
         片方だけ変えると CSS側とTailwind側で色がズレる */
      colors: {
        base: '#f1f1ec',
        panel: '#ffffff',
        panel2: '#e8e8e2',
        edge: 'rgba(0,0,0,0.16)',
        edge2: 'rgba(0,0,0,0.11)',
        ink: '#1a1a19',
        sub: '#5c5c58',
        mute: '#8c8c87',
        brand: '#ea580c',
        brandsoft: 'rgba(234,88,12,0.10)'
      },
      maxWidth: { page: 'clamp(1280px, 86vw, 1760px)', text: '800px' },
      borderRadius: { apple: '14px', big: '18px' }
    }
  }
  // line-clamp は Tailwind v3.3 以降は標準搭載のためプラグイン不要
}
