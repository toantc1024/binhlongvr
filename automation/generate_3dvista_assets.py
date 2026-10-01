#!/usr/bin/env python3
"""
generate_3dvista_assets.py
Production batch asset generator for 3DVista VR Tours and Binh Long VR web app:
1. Navigation Pill Badges (Yellow-green-gold metallic borders, Emerald jade background, Crisp Arial Bold font).
2. 3D Info Hotspot Asset (Transparent PNG with glowing emerald/gold glass beacon and 'i' emblem).
3. Pre-rendered Information Art Dialog Cards (Pop-up cards for 3DVista with historical photos & description).
"""

import os
import math
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REGULAR_FONT_PATH = "/System/Library/Fonts/Supplemental/Arial.ttf"

DEST_DIRS = [
    os.path.abspath("images/assets"),
    os.path.abspath("/Users/macos/bandosobinhlong/images/assets"),
    os.path.abspath("frontend/public/assets/3dvista"),
]

for d in DEST_DIRS:
    os.makedirs(d, exist_ok=True)

# -------------------------------------------------------------
# 1. NAVIGATION PILL BADGES GENERATOR
# -------------------------------------------------------------
BADGE_CONFIGS = [
    {"label": "Vào trong", "slug": "badge_vao_trong", "icon": "enter"},
    {"label": "Ra ngoài", "slug": "badge_ra_ngoai", "icon": "exit"},
    {"label": "Bên trái", "slug": "badge_ben_phai", "icon": "right"}, # Note: user doc mapping
    {"label": "Bên trái", "slug": "badge_ben_trai", "icon": "left"},
    {"label": "Bên phải", "slug": "badge_ben_phai_dir", "icon": "right"},
    {"label": "Đi thẳng", "slug": "badge_di_thang", "icon": "up"},
    {"label": "Quay lại", "slug": "badge_quay_lai", "icon": "down"},
    {"label": "Cổng", "slug": "badge_cong", "icon": "gate"},
    {"label": "Cổng chính", "slug": "badge_cong_chinh", "icon": "gate"},
    {"label": "Cổng phụ", "slug": "badge_cong_phu", "icon": "gate"},
    {"label": "Gian giữa", "slug": "badge_gian_giua", "icon": "hall"},
    {"label": "Gian trái", "slug": "badge_gian_trai", "icon": "left"},
    {"label": "Gian phải", "slug": "badge_gian_phai", "icon": "right"},
    {"label": "Khu mộ tập thể", "slug": "badge_khu_mo_tap_the", "icon": "monument"},
    {"label": "Đài tưởng niệm", "slug": "badge_dai_tuong_niem", "icon": "monument"},
    {"label": "Nhà bia tưởng niệm", "slug": "badge_nha_bia", "icon": "monument"},
    {"label": "Toàn cảnh Flycam", "slug": "badge_flycam", "icon": "flycam"},
    {"label": "Khu trưng bày", "slug": "badge_khu_trung_bay", "icon": "hall"},
    {"label": "Khu đón tiếp", "slug": "badge_khu_don_tiep", "icon": "hall"},
    {"label": "Thông tin di tích", "slug": "badge_thong_tin", "icon": "info"},
]

def draw_vector_icon(draw, icon_type, cx, cy, size, color):
    s = size / 2.0
    if icon_type == "left":
        points = [(cx + s * 0.7, cy - s * 0.8), (cx - s * 0.9, cy), (cx + s * 0.7, cy + s * 0.8)]
        draw.polygon(points, fill=color)
    elif icon_type == "right":
        points = [(cx - s * 0.7, cy - s * 0.8), (cx + s * 0.9, cy), (cx - s * 0.7, cy + s * 0.8)]
        draw.polygon(points, fill=color)
    elif icon_type == "up":
        points = [(cx - s * 0.8, cy + s * 0.7), (cx, cy - s * 0.9), (cx + s * 0.8, cy + s * 0.7)]
        draw.polygon(points, fill=color)
    elif icon_type == "down":
        points = [(cx - s * 0.8, cy - s * 0.7), (cx, cy + s * 0.9), (cx + s * 0.8, cy - s * 0.7)]
        draw.polygon(points, fill=color)
    elif icon_type == "enter":
        # Up-right diagonal arrow
        p1 = (cx - s * 0.6, cy + s * 0.6)
        p2 = (cx + s * 0.6, cy - s * 0.6)
        draw.line([p1, p2], fill=color, width=max(4, int(s * 0.35)))
        arr = [(cx + s * 0.7, cy - s * 0.7), (cx + s * 0.7, cy), (cx, cy - s * 0.7)]
        draw.polygon(arr, fill=color)
    elif icon_type == "exit":
        p1 = (cx + s * 0.6, cy - s * 0.6)
        p2 = (cx - s * 0.6, cy + s * 0.6)
        draw.line([p1, p2], fill=color, width=max(4, int(s * 0.35)))
        arr = [(cx - s * 0.7, cy + s * 0.7), (cx - s * 0.7, cy), (cx, cy + s * 0.7)]
        draw.polygon(arr, fill=color)
    elif icon_type == "gate":
        # Gate / arch structure
        w, h = s * 0.8, s * 0.9
        draw.rectangle([cx - w, cy - h, cx + w, cy - h + 6], fill=color)
        draw.rectangle([cx - w, cy - h, cx - w + 6, cy + h], fill=color)
        draw.rectangle([cx + w - 6, cy - h, cx + w, cy + h], fill=color)
        draw.arc([cx - w, cy - h * 0.2, cx + w, cy + h * 0.8], 180, 360, fill=color, width=5)
    elif icon_type == "flycam":
        # Diamond / drone center
        draw.ellipse([cx - s * 0.35, cy - s * 0.35, cx + s * 0.35, cy + s * 0.35], fill=color)
        draw.line([(cx - s * 0.8, cy), (cx + s * 0.8, cy)], fill=color, width=4)
        draw.line([(cx, cy - s * 0.8), (cx, cy + s * 0.8)], fill=color, width=4)
        draw.ellipse([cx - s * 0.85, cy - s * 0.15, cx - s * 0.55, cy + s * 0.15], fill=color)
        draw.ellipse([cx + s * 0.55, cy - s * 0.15, cx + s * 0.85, cy + s * 0.15], fill=color)
    elif icon_type == "info":
        draw.ellipse([cx - s * 0.8, cy - s * 0.8, cx + s * 0.8, cy + s * 0.8], outline=color, width=5)
        draw.ellipse([cx - s * 0.15, cy - s * 0.55, cx + s * 0.15, cy - s * 0.25], fill=color)
        draw.rectangle([cx - s * 0.15, cy - s * 0.1, cx + s * 0.15, cy + s * 0.5], fill=color)
    else: # monument or default
        w, h = s * 0.7, s * 0.9
        # Stele/obelisk
        pts = [(cx - w * 0.4, cy - h), (cx + w * 0.4, cy - h), (cx + w * 0.7, cy + h * 0.6), (cx - w * 0.7, cy + h * 0.6)]
        draw.polygon(pts, fill=color)
        draw.rectangle([cx - w, cy + h * 0.6, cx + w, cy + h], fill=color)

def generate_pill_badge(text, icon_type, output_path):
    scale = 3
    font_size = 46 * scale
    font = ImageFont.truetype(FONT_PATH, font_size)

    # Measure text
    dummy_img = Image.new("RGBA", (10, 10))
    dummy_draw = ImageDraw.Draw(dummy_img)
    bbox = dummy_draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    has_icon = icon_type is not None
    icon_w = int(60 * scale) if has_icon else 0
    padding_x = int(50 * scale)
    spacing = int(24 * scale) if has_icon else 0

    W = tw + icon_w + spacing + (padding_x * 2)
    H = int(108 * scale)
    radius = H // 2

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background Mask
    mask = Image.new("L", (W, H), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, W, H], radius=radius, fill=255)

    # 2. Rich Emerald Jade Gradient
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for y in range(H):
        t = y / H
        # Deep emerald to darker pine
        r = int(5 * (1 - t) + 2 * t)
        g = int(85 * (1 - t) + 38 * t)
        b = int(60 * (1 - t) + 25 * t)
        # Top gloss shine
        if y < H * 0.48:
            shine = int((1.0 - (y / (H * 0.48))) * 45)
            r = min(255, r + shine)
            g = min(255, g + shine + 15)
            b = min(255, b + shine + 10)
        line = Image.new("RGBA", (W, 1), (r, g, b, 240))
        grad.paste(line, (0, y))

    img.paste(grad, (0, 0), mask)

    # 3. Yellow-Green-Golden Metallic Borders (Multi-ring)
    # Outer Lime-Gold Ring
    outer_border_w = int(5.5 * scale)
    draw.rounded_rectangle(
        [outer_border_w // 2, outer_border_w // 2, W - outer_border_w // 2, H - outer_border_w // 2],
        radius=radius,
        outline=(250, 204, 21, 255), # Gold #facc15
        width=outer_border_w
    )

    # Secondary Lime Accent Ring
    lime_w = int(2 * scale)
    lime_inset = outer_border_w + int(1 * scale)
    draw.rounded_rectangle(
        [lime_inset, lime_inset, W - lime_inset, H - lime_inset],
        radius=radius - lime_inset,
        outline=(163, 230, 53, 200), # Lime green #a3e635
        width=lime_w
    )

    # Inner Gold Highlight
    gold_inset = lime_inset + lime_w + int(1.5 * scale)
    draw.rounded_rectangle(
        [gold_inset, gold_inset, W - gold_inset, H - gold_inset],
        radius=radius - gold_inset,
        outline=(234, 179, 8, 160), # Amber gold #eab308
        width=int(1.5 * scale)
    )

    # 4. Icon & Text Positioning
    content_w = icon_w + spacing + tw
    start_x = (W - content_w) // 2

    if has_icon:
        icon_cx = start_x + (icon_w // 2)
        icon_cy = H // 2
        draw_vector_icon(draw, icon_type, icon_cx, icon_cy, icon_w * 0.75, (253, 224, 71, 255))
        text_x = start_x + icon_w + spacing
    else:
        text_x = start_x

    text_y = (H - th) // 2 - int(bbox[1])

    # Text shadow
    shadow_offset = int(3 * scale)
    draw.text((text_x + shadow_offset, text_y + shadow_offset), text, font=font, fill=(0, 0, 0, 180))
    # Crisp white text
    draw.text((text_x, text_y), text, font=font, fill=(255, 255, 255, 255))

    # Downsample with Lanczos for anti-aliasing
    final_w = W // scale
    final_h = H // scale
    final_img = img.resize((final_w, final_h), Image.Resampling.LANCZOS)
    final_img.save(output_path, "PNG")


# -------------------------------------------------------------
# 2. 3D GLOSSY INFO ASSET GENERATOR
# -------------------------------------------------------------
def generate_3d_info_asset(output_path):
    size = 400
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2
    r_outer = 150
    r_inner = 135

    # Glowing back shadow
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.ellipse([cx - r_outer, cy - r_outer + 15, cx + r_outer, cy + r_outer + 15], fill=(0, 0, 0, 110))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    img.paste(shadow, (0, 0), shadow)

    # Outer metallic gold ring with bevel
    for i in range(16):
        t = i / 16.0
        # Gold gradient from light yellow to deep bronze
        gold_r = int(254 * (1 - t) + 180 * t)
        gold_g = int(240 * (1 - t) + 120 * t)
        gold_b = int(138 * (1 - t) + 20 * t)
        draw.ellipse([cx - r_outer + i, cy - r_outer + i, cx + r_outer - i, cy + r_outer - i], outline=(gold_r, gold_g, gold_b, 255), width=2)

    # Emerald jade core
    core_mask = Image.new("L", (size, size), 0)
    c_draw = ImageDraw.Draw(core_mask)
    c_draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=255)

    core = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    for y in range(cy - r_inner, cy + r_inner):
        t = (y - (cy - r_inner)) / (r_inner * 2)
        # Deep emerald to forest green
        er = int(6 * (1 - t) + 2 * t)
        eg = int(130 * (1 - t) + 60 * t)
        eb = int(85 * (1 - t) + 40 * t)
        if y < cy:
            # Top 3D gloss reflection
            s = int((1.0 - ((y - (cy - r_inner)) / r_inner)) * 75)
            er = min(255, er + s)
            eg = min(255, eg + s + 20)
            eb = min(255, eb + s + 15)
        core_line = Image.new("RGBA", (size, 1), (er, eg, eb, 255))
        core.paste(core_line, (0, y))

    img.paste(core, (0, 0), core_mask)

    # Inner lime highlight ring
    draw.ellipse([cx - r_inner + 4, cy - r_inner + 4, cx + r_inner - 4, cy + r_inner - 4], outline=(163, 230, 53, 180), width=4)

    # 3D Top curved glass gloss
    glass_mask = Image.new("L", (size, size), 0)
    g_draw = ImageDraw.Draw(glass_mask)
    g_draw.ellipse([cx - r_inner + 15, cy - r_inner + 8, cx + r_inner - 15, cy - 10], fill=120)
    glass_mask = glass_mask.filter(ImageFilter.GaussianBlur(8))
    glass = Image.new("RGBA", (size, size), (255, 255, 255, 120))
    img.paste(glass, (0, 0), glass_mask)

    # 3D 'i' Info icon
    info_font = ImageFont.truetype(FONT_PATH, 140)
    ibox = draw.textbbox((0, 0), "i", font=info_font)
    iw = ibox[2] - ibox[0]
    ih = ibox[3] - ibox[1]
    ix = cx - (iw // 2) - ibox[0]
    iy = cy - (ih // 2) - ibox[1] - 4

    # Icon drop shadow
    draw.text((ix + 4, iy + 6), "i", font=info_font, fill=(0, 0, 0, 160))
    # Icon golden text
    draw.text((ix, iy), "i", font=info_font, fill=(254, 240, 138, 255))

    img.save(output_path, "PNG")


# -------------------------------------------------------------
# 3. INFORMATION ART DIALOG CARDS GENERATOR
# -------------------------------------------------------------
DIALOG_CARDS = [
    {
        "slug": "dialog_art_mo_3000",
        "tag": "DI TÍCH LỊCH SỬ QUỐC GIA",
        "title": "Mộ 3.000 Người An Lộc",
        "subtitle": "Khu chứng tích lịch sử mùa hè đỏ lửa 1972",
        "coords": "11.64830° B, 106.60420° Đ",
        "address": "Đường Ngô Quyền, Phường Bình Long, TP. Đồng Nai",
        "desc": (
            "Khu di tích lịch sử Quốc gia Mộ 3.000 người An Lộc là nơi an nghỉ của hàng ngàn đồng bào và chiến sĩ "
            "đã anh dũng ngã xuống trong cuộc chiến 32 ngày đêm bảo vệ Bình Long năm 1972. "
            "Nơi đây lưu giữ đài tưởng niệm thiêng liêng, nhà bia lịch sử cùng hệ thống công trình tưởng niệm "
            "trang trọng, thể hiện đạo lý 'Uống nước nhớ nguồn' của dân tộc Việt Nam."
        ),
        "photo": "frontend/public/landmarks/mo_3000_nguoi.jpg"
    },
    {
        "slug": "dialog_art_dinh_tinh_truong",
        "tag": "DI TÍCH LỊCH SỬ CHIẾN TRƯỜNG",
        "title": "Dinh Tỉnh Trưởng Bình Long",
        "subtitle": "Căn cứ đầu não & hầm ngầm An Lộc",
        "coords": "11.65238° B, 106.60709° Đ",
        "address": "Phường Bình Long, TP. Đồng Nai",
        "desc": (
            "Dinh Tỉnh Trưởng Bình Long cùng hệ thống đường hầm ngầm kiên cố từng là trung tâm chỉ huy quân sự "
            "đầu não trong chiến sự An Lộc 1972. Khu di tích ghi lại chiến công lẫy lừng của quân và dân ta, "
            "với mạng lưới hầm bê tông cốt thép, lô cốt kiên cố và các chứng tích lịch sử phản ánh khát vọng hòa bình "
            "và độc lập của quân đội nhân dân Việt Nam."
        ),
        "photo": "frontend/public/landmarks/dtt_preview.jpg"
    },
    {
        "slug": "dialog_art_mo_7_nguoi",
        "tag": "DI TÍCH LỊCH SỬ CẤP TỈNH",
        "title": "Mộ Tập Thể 7 Chiến Sĩ An Ninh",
        "subtitle": "Tượng đài bất tử của Đội An ninh vũ trang An Lộc",
        "coords": "11.65832° B, 106.60572° Đ",
        "address": "Phường Bình Long, TP. Đồng Nai",
        "desc": (
            "Khu mộ tập thể tưởng niệm 7 chiến sĩ kiên trung thuộc Đội An ninh vũ trang thị xã An Lộc "
            "đã anh dũng chiến đấu đến hơi thở cuối cùng trong trận đánh ác liệt năm 1971. "
            "Di tích là biểu tượng sáng ngời cho tinh thần quả cảm, lòng trung thành vô hạn với Tổ quốc "
            "và tấm gương bất khuất cho các thế hệ trẻ mai sau."
        ),
        "photo": "frontend/public/landmarks/m7n_preview.jpg"
    },
    {
        "slug": "dialog_art_huong_dan_vr",
        "tag": "CẨM NANG KHÁM PHÁ SỐ",
        "title": "Hướng Dẫn Trải Nghiệm VR 360°",
        "subtitle": "Tương tác thực tế ảo sống động tại Phường Bình Long",
        "coords": "Không gian số đa chiều 4K",
        "address": "Bản đồ số Phường Bình Long, TP. Đồng Nai",
        "desc": (
            "• Chạm và vuốt để xoay không gian 360 độ quanh di tích.\n"
            "• Nhấp vào các huy hiệu chỉ dẫn nổi 'Vào trong', 'Ra ngoài' để di chuyển liên tục.\n"
            "• Bấm vào biểu tượng thông tin (i) 3D để mở tư liệu lịch sử chi tiết.\n"
            "• Sử dụng thanh điều khiển phía dưới để nghe thuyết minh âm thanh sống động."
        ),
        "photo": "frontend/public/landmarks/binh_long_sunset.jpg"
    }
]

def generate_dialog_card(card_cfg, output_path):
    W, H = 1200, 760
    card = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)

    # 1. Base Dark Slate / Emerald Background with Rounded Rect
    radius = 36
    bg_mask = Image.new("L", (W, H), 0)
    b_draw = ImageDraw.Draw(bg_mask)
    b_draw.rounded_rectangle([0, 0, W, H], radius=radius, fill=255)

    bg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for y in range(H):
        t = y / H
        # Deep dark emerald / blue-slate gradient
        r = int(10 * (1 - t) + 4 * t)
        g = int(24 * (1 - t) + 16 * t)
        b = int(22 * (1 - t) + 18 * t)
        line = Image.new("RGBA", (W, 1), (r, g, b, 248))
        bg.paste(line, (0, y))

    card.paste(bg, (0, 0), bg_mask)

    # 2. Outer Golden Metallic Border
    border_w = 6
    draw.rounded_rectangle([3, 3, W - 3, H - 3], radius=radius, outline=(234, 179, 8, 255), width=border_w)
    draw.rounded_rectangle([8, 8, W - 8, H - 8], radius=radius - 5, outline=(253, 224, 71, 160), width=2)
    draw.rounded_rectangle([12, 12, W - 12, H - 12], radius=radius - 9, outline=(132, 204, 22, 100), width=1)

    # 3. Historical Photo on Left Side
    photo_w, photo_h = 480, 680
    px, py = 40, 40
    photo_path = card_cfg["photo"]
    if os.path.exists(photo_path):
        p_img = Image.open(photo_path).convert("RGB")
        # Fill & crop to photo_w x photo_h
        aspect = photo_w / photo_h
        src_aspect = p_img.width / p_img.height
        if src_aspect > aspect:
            # Crop width
            new_w = int(p_img.height * aspect)
            left = (p_img.width - new_w) // 2
            p_img = p_img.crop((left, 0, left + new_w, p_img.height))
        else:
            # Crop height
            new_h = int(p_img.width / aspect)
            top = (p_img.height - new_h) // 2
            p_img = p_img.crop((0, top, p_img.width, top + new_h))
        p_img = p_img.resize((photo_w, photo_h), Image.Resampling.LANCZOS)

        # Rounded mask for photo
        p_mask = Image.new("L", (photo_w, photo_h), 0)
        pm_draw = ImageDraw.Draw(p_mask)
        pm_draw.rounded_rectangle([0, 0, photo_w, photo_h], radius=24, fill=255)
        card.paste(p_img, (px, py), p_mask)

        # Gold frame around photo
        draw.rounded_rectangle([px, py, px + photo_w, py + photo_h], radius=24, outline=(250, 204, 21, 200), width=4)
        draw.rounded_rectangle([px + 4, py + 4, px + photo_w - 4, py + photo_h - 4], radius=20, outline=(163, 230, 53, 140), width=2)

    # 4. Right Content Column
    rx = 560
    ry = 50

    # Pill Tag: Category
    tag_font = ImageFont.truetype(FONT_PATH, 15)
    tag_text = card_cfg["tag"]
    tbox = draw.textbbox((0, 0), tag_text, font=tag_font)
    tw, th = tbox[2] - tbox[0], tbox[3] - tbox[1]
    pill_pad_x, pill_pad_y = 16, 6
    draw.rounded_rectangle(
        [rx, ry, rx + tw + pill_pad_x * 2, ry + th + pill_pad_y * 2],
        radius=14,
        fill=(6, 78, 59, 230),
        outline=(250, 204, 21, 240),
        width=2
    )
    draw.text((rx + pill_pad_x, ry + pill_pad_y - tbox[1]), tag_text, font=tag_font, fill=(254, 240, 138, 255))

    # Close icon indicator at top-right
    close_r = 16
    cx_close, cy_close = W - 55, ry + 15
    draw.ellipse([cx_close - close_r, cy_close - close_r, cx_close + close_r, cy_close + close_r], fill=(30, 41, 59, 200), outline=(234, 179, 8, 180), width=1)
    # Vector X lines
    x_len = 6
    draw.line([(cx_close - x_len, cy_close - x_len), (cx_close + x_len, cy_close + x_len)], fill=(241, 245, 249, 220), width=2)
    draw.line([(cx_close - x_len, cy_close + x_len), (cx_close + x_len, cy_close - x_len)], fill=(241, 245, 249, 220), width=2)

    # Main Title
    title_font = ImageFont.truetype(FONT_PATH, 34)
    title_y = ry + 45
    draw.text((rx, title_y), card_cfg["title"], font=title_font, fill=(255, 255, 255, 255))

    # Subtitle
    sub_font = ImageFont.truetype(FONT_PATH, 18)
    sub_y = title_y + 48
    draw.text((rx, sub_y), card_cfg["subtitle"], font=sub_font, fill=(163, 230, 53, 255))

    # Metadata row (GPS & Address)
    meta_font = ImageFont.truetype(REGULAR_FONT_PATH, 15)
    meta_bold = ImageFont.truetype(FONT_PATH, 15)
    meta_y = sub_y + 36
    draw.text((rx, meta_y), "Địa chỉ: ", font=meta_bold, fill=(250, 204, 21, 255))
    draw.text((rx + 65, meta_y), card_cfg['address'], font=meta_font, fill=(226, 232, 240, 255))
    draw.text((rx, meta_y + 24), "Tọa độ GPS: ", font=meta_bold, fill=(163, 230, 53, 255))
    draw.text((rx + 95, meta_y + 24), card_cfg['coords'], font=meta_font, fill=(203, 213, 225, 255))

    # Golden Divider Line
    div_y = meta_y + 60
    draw.line([(rx, div_y), (W - 60, div_y)], fill=(234, 179, 8, 180), width=2)
    # Diamond in middle of divider
    mid_dx = rx + (W - 60 - rx) // 2
    draw.polygon([(mid_dx, div_y - 6), (mid_dx + 6, div_y), (mid_dx, div_y + 6), (mid_dx - 6, div_y)], fill=(253, 224, 71, 255))

    # Historical Description Box
    desc_y = div_y + 24
    desc_font = ImageFont.truetype(REGULAR_FONT_PATH, 17)
    max_text_w = W - 60 - rx

    # Word wrap description
    lines = []
    for raw_para in card_cfg["desc"].split("\n"):
        words = raw_para.split(" ")
        cur_line = ""
        for w in words:
            test_line = f"{cur_line} {w}".strip()
            bbox = draw.textbbox((0, 0), test_line, font=desc_font)
            if bbox[2] - bbox[0] <= max_text_w:
                cur_line = test_line
            else:
                lines.append(cur_line)
                cur_line = w
        if cur_line:
            lines.append(cur_line)

    cur_y = desc_y
    for l in lines:
        draw.text((rx, cur_y), l, font=desc_font, fill=(241, 245, 249, 235))
        cur_y += 28

    # Bottom Footer Badge
    footer_y = H - 85
    draw.line([(rx, footer_y - 12), (W - 60, footer_y - 12)], fill=(255, 255, 255, 40), width=1)
    footer_font = ImageFont.truetype(FONT_PATH, 14)
    draw.text((rx, footer_y), "BẢN ĐỒ SỐ DI TÍCH PHƯỜNG BÌNH LONG • CÔNG NGHỆ THỰC TẾ ẢO 360°", font=footer_font, fill=(163, 230, 53, 255))
    draw.text((rx, footer_y + 22), "© 2026 Bản Quyền Thuộc UBND Phường Bình Long - Phát Triển Bởi HCMUTE", font=meta_font, fill=(148, 163, 184, 180))

    card.save(output_path, "PNG")


def main():
    print("=" * 60)
    print("BATCH GENERATING 3DVISTA ASSETS & PRE-RENDERED ART")
    print(f"Font Used: Arial Bold ({FONT_PATH})")
    print("=" * 60)

    # 1. Generate All Navigation Pill Badges
    print("\n[1/3] Generating 20+ Navigation Pill Badges...")
    for cfg in BADGE_CONFIGS:
        filename = f"{cfg['slug']}.png"
        for d in DEST_DIRS:
            dest = os.path.join(d, filename)
            generate_pill_badge(cfg["label"], cfg["icon"], dest)
        print(f"  ✓ Created badge: {filename} ('{cfg['label']}')")

    # 2. Generate 3D Info Asset
    print("\n[2/3] Generating 3D Glossy Info Asset...")
    info_filename = "asset_info_3d.png"
    for d in DEST_DIRS:
        dest = os.path.join(d, info_filename)
        generate_3d_info_asset(dest)
    print(f"  ✓ Created 3D Info Hotspot Asset: {info_filename}")

    # 3. Generate Information Art Dialog Cards
    print("\n[3/3] Generating Information Art Dialog Cards...")
    for card_cfg in DIALOG_CARDS:
        filename = f"{card_cfg['slug']}.png"
        for d in DEST_DIRS:
            dest = os.path.join(d, filename)
            generate_dialog_card(card_cfg, dest)
        print(f"  ✓ Created Dialog Art Card: {filename} ('{card_cfg['title']}')")

    print("\n" + "=" * 60)
    print("ALL ASSETS SUCCESSFULLY GENERATED TO:")
    for d in DEST_DIRS:
        print(f"  📁 {d}")
    print("=" * 60)

if __name__ == "__main__":
    main()
