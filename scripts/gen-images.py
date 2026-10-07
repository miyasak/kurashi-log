#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OG画像とファビコンを PNG で生成する。

- public/og.png        : SNS共有用のデフォルトOG画像（1200x630）
- public/icon-32.png   : ブラウザのタブ用
- public/icon-180.png  : iOS ホーム画面用（apple-touch-icon）
- public/icon-512.png  : PWA / 構造化データのロゴ用
- public/favicon.ico   : 旧環境向け

絵文字SVGだと環境によって表示されないため、PNGで用意する。
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
os.makedirs(OUT, exist_ok=True)

BRAND = (249, 115, 22)
BASE = (10, 10, 11)
PANEL = (18, 18, 20)
INK = (245, 245, 247)
SUB = (161, 161, 170)

FONT_BOLD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
FONT_REG = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


# ---------------------------------------------------------------- OG画像
def make_og():
    W, H = 1200, 630
    img = Image.new('RGB', (W, H), BASE)
    d = ImageDraw.Draw(img, 'RGBA')

    # 斜めのグラデーション風背景（上から下へ少し明るく→暗く）
    for y in range(H):
        t = y / H
        c = (
            int(BASE[0] + (PANEL[0] - BASE[0]) * (1 - t)),
            int(BASE[1] + (PANEL[1] - BASE[1]) * (1 - t)),
            int(BASE[2] + (PANEL[2] - BASE[2]) * (1 - t)),
        )
        d.line([(0, y), (W, y)], fill=c)

    # 右上のオレンジのにじみ（ぼかして輪郭が出ないようにする）
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for i in range(60, 0, -1):
        r = i * 11
        a = int(26 * (i / 60) ** 3.0)
        gd.ellipse([1070 - r, 40 - r, 1070 + r, 40 + r], fill=BRAND + (a,))
    glow = glow.filter(ImageFilter.GaussianBlur(70))
    img = Image.alpha_composite(img.convert('RGBA'), glow).convert('RGB')
    d = ImageDraw.Draw(img, 'RGBA')

    # 上端のアクセントバー
    d.rectangle([0, 0, W, 8], fill=BRAND)

    # ロゴ（角丸の四角 + K）
    d.rounded_rectangle([80, 70, 132, 122], radius=14, fill=BRAND)
    f_logo = font(FONT_BOLD, 28)
    d.text((106, 96), 'K', font=f_logo, fill=(255, 255, 255), anchor='mm')
    f_brand = font(FONT_BOLD, 27)
    d.text((148, 96), 'Kurashi Log', font=f_brand, fill=INK, anchor='lm')

    # メインコピー
    f_title = font(FONT_BOLD, 72)
    lines = ['数字で記録する、', 'お金とツーリングと仕事。']
    y = 268
    for ln in lines:
        d.text((80, y), ln, font=f_title, fill=INK)
        y += 96

    # サブコピー
    f_sub = font(FONT_REG, 26)
    d.text(
        (80, 512),
        'Money（資産運用・生活費）／ Touring（ツーリング）／ Tech（業務効率化）',
        font=f_sub,
        fill=SUB,
    )

    # 下部のアクセント
    d.rounded_rectangle([80, 566, 168, 571], radius=3, fill=BRAND)

    img.save(os.path.join(OUT, 'og.png'), 'PNG', optimize=True)
    print('og.png', img.size)


# ---------------------------------------------------------------- ファビコン
def make_icon(px):
    S = 512  # 大きく描いて縮小する（輪郭をなめらかに）
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # オレンジの角丸背景
    d.rounded_rectangle([0, 0, S, S], radius=int(S * 0.22), fill=BRAND)

    # 右肩上がりの3本バー + 丸（「記録・積み上げ」を表す図形）
    w = int(S * 0.072)
    x = int(S * 0.20)
    bars = [
        (int(S * 0.62), int(S * 0.60)),  # 一番長い（下）
        (int(S * 0.46), int(S * 0.42)),
        (int(S * 0.30), int(S * 0.24)),
    ]
    for y, length in bars:
        d.rounded_rectangle([x, y, x + length, y + w], radius=w // 2, fill=(255, 255, 255))
    # 右上のドット
    r = int(S * 0.072)
    cx, cy = int(S * 0.76), int(S * 0.275)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255))

    out = img.resize((px, px), Image.LANCZOS)
    out.save(os.path.join(OUT, f'icon-{px}.png'), 'PNG', optimize=True)
    print(f'icon-{px}.png')
    return out


if __name__ == '__main__':
    make_og()
    i32 = make_icon(32)
    make_icon(180)
    i512 = make_icon(512)
    # favicon.ico（16/32/48 をまとめる）
    i512.save(
        os.path.join(OUT, 'favicon.ico'),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print('favicon.ico')
