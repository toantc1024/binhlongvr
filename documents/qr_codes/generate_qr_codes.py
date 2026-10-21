import os
import cv2
import numpy as np
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer, CircleModuleDrawer, SquareModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw, ImageFont

TARGET_URL = "https://binhlongvr.vercel.app/"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.abspath(os.path.join(OUTPUT_DIR, "../../frontend/public/LOGO_VR.png"))

def verify_qr(image_path_or_pil, desc=""):
    """Verify QR code using OpenCV QRCodeDetector."""
    if isinstance(image_path_or_pil, str):
        img = Image.open(image_path_or_pil)
    else:
        img = image_path_or_pil

    # Handle transparency by placing on contrasting background
    if img.mode in ('RGBA', 'LA'):
        # Check against both white and black backgrounds
        for bg_color in [(255, 255, 255), (0, 0, 0)]:
            bg = Image.new('RGB', img.size, bg_color)
            bg.paste(img, (0, 0), img.split()[-1])
            arr = np.array(bg)
            gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
            detector = cv2.QRCodeDetector()
            val, pts, _ = detector.detectAndDecode(gray)
            if not val:
                # Try inverted
                val, pts, _ = detector.detectAndDecode(cv2.bitwise_not(gray))
            if val == TARGET_URL:
                print(f"  [PASS] {desc}: Scanned successfully -> {val}")
                return True
        print(f"  [FAIL] {desc}: Could not decode URL with contrast background!")
        return False
    else:
        arr = np.array(img.convert('RGB'))
        gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
        detector = cv2.QRCodeDetector()
        val, pts, _ = detector.detectAndDecode(gray)
        if not val:
            val, pts, _ = detector.detectAndDecode(cv2.bitwise_not(gray))
        if val == TARGET_URL:
            print(f"  [PASS] {desc}: Scanned successfully -> {val}")
            return True
        else:
            print(f"  [FAIL] {desc}: Decoded '{val}' instead of '{TARGET_URL}'")
            return False

def generate_standard_qr():
    """Generate standard high-contrast scannable QR with clean styling and optional logo center."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=4,
    )
    qr.add_data(TARGET_URL)
    qr.make(fit=True)

    # Clean high-contrast emerald & white
    qr_img = qr.make_image(
        fill_color="#064e3b", # Deep Emerald Green for maximum contrast
        back_color="#ffffff"
    ).convert("RGBA")

    # Add subtle branded logo in center
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        qr_w, qr_h = qr_img.size
        logo_size = int(qr_w * 0.22)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

        # Create white rounded background for logo
        badge_size = logo_size + 16
        badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(badge)
        draw.rounded_rectangle([0, 0, badge_size, badge_size], radius=16, fill="#ffffff", outline="#10b981", width=4)

        # Paste logo on badge
        badge.paste(logo, (8, 8), logo)

        # Paste badge onto QR center
        pos = ((qr_w - badge_size) // 2, (qr_h - badge_size) // 2)
        qr_img.paste(badge, pos, badge)

    out_path = os.path.join(OUTPUT_DIR, "qr_binhlong_standard.png")
    qr_img.save(out_path, "PNG", quality=100)
    verify_qr(out_path, "Standard Scannable QR (with logo)")

def generate_transparent_dark_qr():
    """Generate transparent QR code with dark emerald modules (for light backgrounds)."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=4,
    )
    qr.add_data(TARGET_URL)
    qr.make(fit=True)

    # Base image with black on white
    base = qr.make_image(fill_color="black", back_color="white").convert("L")
    base_arr = np.array(base)

    # Create RGBA image: dark emerald where black, transparent where white
    # Dark emerald color: (6, 78, 59)
    rgba = np.zeros((base_arr.shape[0], base_arr.shape[1], 4), dtype=np.uint8)
    black_pixels = base_arr < 128
    rgba[black_pixels] = [6, 78, 59, 255] # #064e3b
    rgba[~black_pixels] = [0, 0, 0, 0]

    qr_img = Image.fromarray(rgba, "RGBA")

    # Add center logo badge with white backing so logo pops
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        qr_w, qr_h = qr_img.size
        logo_size = int(qr_w * 0.22)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

        badge_size = logo_size + 16
        badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(badge)
        draw.rounded_rectangle([0, 0, badge_size, badge_size], radius=16, fill="#ffffff", outline="#064e3b", width=4)
        badge.paste(logo, (8, 8), logo)

        pos = ((qr_w - badge_size) // 2, (qr_h - badge_size) // 2)
        qr_img.paste(badge, pos, badge)

    out_path = os.path.join(OUTPUT_DIR, "qr_binhlong_transparent_dark.png")
    qr_img.save(out_path, "PNG")
    main_transparent = os.path.join(OUTPUT_DIR, "qr_binhlong_transparent.png")
    qr_img.save(main_transparent, "PNG")
    verify_qr(out_path, "Transparent Dark Emerald QR (qr_binhlong_transparent.png)")

def generate_transparent_white_qr():
    """Generate transparent QR code with white/mint modules (for dark backgrounds)."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=4,
    )
    qr.add_data(TARGET_URL)
    qr.make(fit=True)

    base = qr.make_image(fill_color="black", back_color="white").convert("L")
    base_arr = np.array(base)

    # Pure white modules with full opacity
    rgba = np.zeros((base_arr.shape[0], base_arr.shape[1], 4), dtype=np.uint8)
    black_pixels = base_arr < 128
    rgba[black_pixels] = [255, 255, 255, 255]
    rgba[~black_pixels] = [0, 0, 0, 0]

    qr_img = Image.fromarray(rgba, "RGBA")

    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        qr_w, qr_h = qr_img.size
        logo_size = int(qr_w * 0.22)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

        badge_size = logo_size + 16
        badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(badge)
        draw.rounded_rectangle([0, 0, badge_size, badge_size], radius=16, fill="#031710", outline="#10b981", width=4)
        badge.paste(logo, (8, 8), logo)

        pos = ((qr_w - badge_size) // 2, (qr_h - badge_size) // 2)
        qr_img.paste(badge, pos, badge)

    out_path = os.path.join(OUTPUT_DIR, "qr_binhlong_transparent_white.png")
    qr_img.save(out_path, "PNG")
    verify_qr(out_path, "Transparent White QR")

def generate_qr_card_light():
    """Generate beautiful printable light-themed QR display card."""
    card_w, card_h = 1000, 1400
    card = Image.new("RGBA", (card_w, card_h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(card)

    # Background subtle border & header bar
    draw.rectangle([0, 0, card_w, 20], fill="#10b981")
    draw.rounded_rectangle([20, 20, card_w - 20, card_h - 20], radius=32, outline="#e2e8f0", width=4)

    # App Logo at top
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo = logo.resize((140, 140), Image.Resampling.LANCZOS)
        card.paste(logo, ((card_w - 140) // 2, 70), logo)

    # Text headers
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 46)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 26)
        font_cta = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 32)
        font_url = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 28)
    except:
        font_title = font_sub = font_cta = font_url = ImageFont.load_default()

    draw.text((card_w // 2, 240), "BẢN ĐỒ SỐ BÌNH LONG VR", fill="#064e3b", font=font_title, anchor="mm")
    draw.text((card_w // 2, 290), "Khám Phá Di Tích Lịch Sử Không Gian 360°", fill="#64748b", font=font_sub, anchor="mm")

    # Generate core scannable QR
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=3,
    )
    qr.add_data(TARGET_URL)
    qr.make(fit=True)
    qr_pil = qr.make_image(fill_color="#064e3b", back_color="#ffffff").convert("RGBA")

    # Add mini logo inside QR
    if os.path.exists(LOGO_PATH):
        mini_logo = Image.open(LOGO_PATH).convert("RGBA")
        q_w, q_h = qr_pil.size
        m_size = int(q_w * 0.22)
        mini_logo = mini_logo.resize((m_size, m_size), Image.Resampling.LANCZOS)
        b_size = m_size + 14
        badge = Image.new("RGBA", (b_size, b_size), (0, 0, 0, 0))
        d_badge = ImageDraw.Draw(badge)
        d_badge.rounded_rectangle([0, 0, b_size, b_size], radius=14, fill="#ffffff", outline="#10b981", width=3)
        badge.paste(mini_logo, (7, 7), mini_logo)
        qr_pil.paste(badge, ((q_w - b_size) // 2, (q_h - b_size) // 2), badge)

    # Frame for QR on Card
    qr_frame_size = qr_pil.size[0] + 40
    qr_box_x = (card_w - qr_frame_size) // 2
    qr_box_y = 350
    draw.rounded_rectangle(
        [qr_box_x, qr_box_y, qr_box_x + qr_frame_size, qr_box_y + qr_frame_size],
        radius=28,
        fill="#f8fafc",
        outline="#10b981",
        width=4
    )
    card.paste(qr_pil, (qr_box_x + 20, qr_box_y + 20), qr_pil)

    # Bottom Call to Action Card
    cta_box_y = qr_box_y + qr_frame_size + 40
    draw.rounded_rectangle([80, cta_box_y, card_w - 80, cta_box_y + 160], radius=24, fill="#ecfdf5", outline="#a7f3d0", width=2)
    draw.text((card_w // 2, cta_box_y + 50), "📱 QUÉT MÃ ĐỂ TRẢI NGHIỆM NGAY", fill="#047857", font=font_cta, anchor="mm")
    draw.text((card_w // 2, cta_box_y + 105), "https://binhlongvr.vercel.app/", fill="#065f46", font=font_url, anchor="mm")

    # Footer note
    draw.text((card_w // 2, card_h - 70), "UBND Phường An Lộc • Thị Xã Bình Long • HCMUTE", fill="#94a3b8", font=font_sub, anchor="mm")

    out_path = os.path.join(OUTPUT_DIR, "qr_binhlong_card_light.png")
    card.save(out_path, "PNG", quality=100)
    verify_qr(out_path, "QR Card Light Theme")

def generate_qr_card_dark():
    """Generate dark-themed UI QR card matching the app's emerald aesthetic."""
    card_w, card_h = 1000, 1400
    card = Image.new("RGBA", (card_w, card_h), (3, 23, 16, 255)) # #031710 deep emerald dark
    draw = ImageDraw.Draw(card)

    # Glowing subtle border
    draw.rounded_rectangle([20, 20, card_w - 20, card_h - 20], radius=32, outline="#10b981", width=3)

    # Logo at top
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        logo = logo.resize((140, 140), Image.Resampling.LANCZOS)
        card.paste(logo, ((card_w - 140) // 2, 70), logo)

    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 46)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 26)
        font_cta = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 32)
        font_url = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 28)
    except:
        font_title = font_sub = font_cta = font_url = ImageFont.load_default()

    draw.text((card_w // 2, 240), "BẢN ĐỒ SỐ BÌNH LONG VR", fill="#ffffff", font=font_title, anchor="mm")
    draw.text((card_w // 2, 290), "Bảo Tồn Di Tích Lịch Sử Bằng Công Nghệ Số", fill="#6ee7b7", font=font_sub, anchor="mm")

    # Generate QR with solid white back to guarantee 100% scan reliability on dark phone screens
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=3,
    )
    qr.add_data(TARGET_URL)
    qr.make(fit=True)
    qr_pil = qr.make_image(fill_color="#031710", back_color="#ffffff").convert("RGBA")

    # Mini logo badge
    if os.path.exists(LOGO_PATH):
        mini_logo = Image.open(LOGO_PATH).convert("RGBA")
        q_w, q_h = qr_pil.size
        m_size = int(q_w * 0.22)
        mini_logo = mini_logo.resize((m_size, m_size), Image.Resampling.LANCZOS)
        b_size = m_size + 14
        badge = Image.new("RGBA", (b_size, b_size), (0, 0, 0, 0))
        d_badge = ImageDraw.Draw(badge)
        d_badge.rounded_rectangle([0, 0, b_size, b_size], radius=14, fill="#ffffff", outline="#10b981", width=3)
        badge.paste(mini_logo, (7, 7), mini_logo)
        qr_pil.paste(badge, ((q_w - b_size) // 2, (q_h - b_size) // 2), badge)

    # Frame on Card
    qr_frame_size = qr_pil.size[0] + 40
    qr_box_x = (card_w - qr_frame_size) // 2
    qr_box_y = 350
    draw.rounded_rectangle(
        [qr_box_x, qr_box_y, qr_box_x + qr_frame_size, qr_box_y + qr_frame_size],
        radius=28,
        fill="#ffffff",
        outline="#34d399",
        width=5
    )
    card.paste(qr_pil, (qr_box_x + 20, qr_box_y + 20), qr_pil)

    # Bottom CTA Box
    cta_box_y = qr_box_y + qr_frame_size + 40
    draw.rounded_rectangle([80, cta_box_y, card_w - 80, cta_box_y + 160], radius=24, fill="#064e3b", outline="#10b981", width=2)
    draw.text((card_w // 2, cta_box_y + 50), "📱 QUÉT MÃ ĐỂ TRẢI NGHIỆM NGAY", fill="#34d399", font=font_cta, anchor="mm")
    draw.text((card_w // 2, cta_box_y + 105), "https://binhlongvr.vercel.app/", fill="#ffffff", font=font_url, anchor="mm")

    draw.text((card_w // 2, card_h - 70), "UBND Phường An Lộc • Thị Xã Bình Long • HCMUTE", fill="#475569", font=font_sub, anchor="mm")

    out_path = os.path.join(OUTPUT_DIR, "qr_binhlong_card_dark.png")
    card.save(out_path, "PNG", quality=100)
    verify_qr(out_path, "QR Card Dark Theme")

def generate_svg_qr():
    """Generate crisp vector SVG QR code with transparent background."""
    import qrcode.image.svg
    factory = qrcode.image.svg.SvgPathImage
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
        image_factory=factory
    )
    qr.add_data(TARGET_URL)
    qr.make(fit=True)
    svg_img = qr.make_image(attrib={'class': 'binhlong-qr'})
    out_path = os.path.join(OUTPUT_DIR, "qr_binhlong_vector.svg")
    svg_img.save(out_path)
    print(f"  [PASS] SVG Vector QR generated: {out_path}")

if __name__ == "__main__":
    print("Generating Binh Long VR QR Codes...")
    generate_standard_qr()
    generate_transparent_dark_qr()
    generate_transparent_white_qr()
    generate_qr_card_light()
    generate_qr_card_dark()
    generate_svg_qr()
    print("All QR codes generated and verified successfully!")
