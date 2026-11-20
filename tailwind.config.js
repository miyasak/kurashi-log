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
      /* 実際の色は public/static/style.css の :root と
         @media (prefers-color-scheme: dark) で定義する。
         ここは変数への参照だけ。値を直接書かないこと */
      colors: {
        base: 'rgb(var(--base-rgb) / <alpha-value>)',
        panel: 'rgb(var(--panel-rgb) / <alpha-value>)',
        panel2: 'rgb(var(--panel2-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        sub: 'rgb(var(--sub-rgb) / <alpha-value>)',
        mute: 'rgb(var(--mute-rgb) / <alpha-value>)',
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        edge: 'var(--edge)',
        edge2: 'var(--edge2)',
        brandsoft: 'var(--brandsoft)'
      },
      maxWidth: { page: 'clamp(1280px, 86vw, 1760px)', text: '800px' },
      borderRadius: { apple: '14px', big: '18px' }
    }
  }
  // line-clamp は Tailwind v3.3 以降は標準搭載のためプラグイン不要
}
