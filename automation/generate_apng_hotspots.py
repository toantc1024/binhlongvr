#!/usr/bin/env python3
"""
generate_apng_hotspots.py
Generates 3DVista-compatible Animated PNG (APNG) hotspots:
1. Arrow 06a (White & Gold): 3-tier perspective chevrons with sequential upward moving pulse.
2. Arrow 06 (White & Gold): 2-tier perspective chevron with sliding upward pulse.
3. Circle Arrow 02b (White & Gold): Ground perspective ellipse with chevron sliding forward/up.
4. Door Portal (Blue & Gold): Circular portal with open door and radiant pulsing ripples.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFilter

DEST_DIRS = [
    os.path.abspath("images/assets"),
    os.path.abspath("/Users/macos/bandosobinhlong/images/assets"),
    os.path.abspath("frontend/public/assets/3dvista"),
]

for d in DEST_DIRS:
    os.makedirs(d, exist_ok=True)

# -------------------------------------------------------------
# HELPER: Perspective Chevron Math
# -------------------------------------------------------------
def get_chevron_polygon(cx, cy_base, w_span, z, h_total, thick_mult=1.0):
    """
    z in [0.0, 1.0]: 0 is nearest (bottom), 1 is farthest (top).
    Returns 6 polygon points for a perspective-projected floor chevron.
    """
    persp = 1.0 - z * 0.48
    base_y = cy_base - (z ** 0.88) * (h_total * 0.56)
    span = w_span * persp
    apex_dy = (h_total * 0.17) * persp
    apex_y = base_y - apex_dy
    thick = (h_total * 0.084) * persp * thick_mult

    tip_dx = span * 0.18

    p_apex_out = (cx, apex_y)
    p_right_out = (cx + span, base_y + span * 0.08)
    p_right_tip = (cx + span - tip_dx, base_y + span * 0.08 + thick)
    p_apex_in = (cx, apex_y + thick)
    p_left_tip = (cx - span + tip_dx, base_y + span * 0.08 + thick)
    p_left_out = (cx - span, base_y + span * 0.08)

    return [p_apex_out, p_right_out, p_right_tip, p_apex_in, p_left_tip, p_left_out]


# -------------------------------------------------------------
# 1. ARROW 06A: 3-TIER CHEVRON UPWARD WAVE ANIMATION
# -------------------------------------------------------------
def generate_arrow_06a(theme="white", num_frames=24, size=(360, 270)):
    w, h = size
    scale = 3
    W, H = w * scale, h * scale
    cx = W / 2
    cy_base = H * 0.84
    w_span = W * 0.42
    h_total = H

    frames = []
    z_positions = [0.05, 0.45, 0.82]

    for f in range(num_frames):
        t = f / num_frames

        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw_shadow = ImageDraw.Draw(shadow)
        draw_glow = ImageDraw.Draw(glow)

        for i, z in enumerate(z_positions):
            phase = (t - (i / 3.0)) % 1.0
            intensity = math.exp(-((phase - 0.35) ** 2) / 0.045)
            dz = math.sin(phase * math.pi) * 0.035 if 0.0 < phase < 0.7 else 0.0
            actual_z = z + dz

            pts = get_chevron_polygon(cx, cy_base, w_span, actual_z, h_total)

            # Drop shadow points (offset down)
            s_pts = [(p[0], p[1] + 6 * scale) for p in pts]
            draw_shadow.polygon(s_pts, fill=(0, 0, 0, 110))

            if theme == "white":
                base_alpha = 90
                active_alpha = int(base_alpha + intensity * (255 - base_alpha))
                fill_color = (255, 255, 255, active_alpha)
                line_color = (220, 235, 250, 255)
                glow_color = (180, 230, 255, int(intensity * 180))
            else: # gold
                base_alpha = 100
                active_alpha = int(base_alpha + intensity * (255 - base_alpha))
                r = int(234 + intensity * 20)
                g = int(179 + intensity * 60)
                b = int(8 + intensity * 60)
                fill_color = (r, g, b, active_alpha)
                line_color = (254, 240, 138, 255)
                glow_color = (250, 204, 21, int(intensity * 200))

            if intensity > 0.12:
                draw_glow.polygon(pts, fill=glow_color)

            # Draw body with dark border for contrast
            draw.polygon(pts, fill=fill_color, outline=(20, 20, 25, 140))
            # Inner white/gold highlight
            inner_pts = get_chevron_polygon(cx, cy_base, w_span, actual_z, h_total, thick_mult=0.6)
            draw.polygon(inner_pts, outline=(255, 255, 255, int(intensity * 200)))

        # Composite shadow -> glow -> img
        shadow_blurred = shadow.filter(ImageFilter.GaussianBlur(6 * scale))
        glow_blurred = glow.filter(ImageFilter.GaussianBlur(12 * scale))

        comp = Image.alpha_composite(shadow_blurred, glow_blurred)
        comp = Image.alpha_composite(comp, img)

        downsampled = comp.resize((w, h), Image.Resampling.LANCZOS)
        frames.append(downsampled)

    return frames


# -------------------------------------------------------------
# 2. ARROW 06: BASE CHEVRON + RIPPLE PULSE MOVING UP
# -------------------------------------------------------------
def generate_arrow_06(theme="white", num_frames=24, size=(360, 270)):
    w, h = size
    scale = 3
    W, H = w * scale, h * scale
    cx = W / 2
    cy_base = H * 0.84
    w_span = W * 0.42
    h_total = H

    frames = []

    for f in range(num_frames):
        t = f / num_frames

        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw_shadow = ImageDraw.Draw(shadow)
        draw_glow = ImageDraw.Draw(glow)

        base_z = 0.08
        base_pts = get_chevron_polygon(cx, cy_base, w_span, base_z, h_total)
        s_base_pts = [(p[0], p[1] + 6 * scale) for p in base_pts]
        draw_shadow.polygon(s_base_pts, fill=(0, 0, 0, 110))

        pulse_z = base_z + (t * 0.78)
        pulse_pts = get_chevron_polygon(cx, cy_base, w_span, pulse_z, h_total, thick_mult=0.85)
        pulse_alpha = int(max(0.0, 1.0 - (pulse_z - base_z) / 0.78) * 255)

        s_pulse_pts = [(p[0], p[1] + 4 * scale) for p in pulse_pts]
        draw_shadow.polygon(s_pulse_pts, fill=(0, 0, 0, int(pulse_alpha * 0.4)))

        if theme == "white":
            draw.polygon(base_pts, fill=(255, 255, 255, 245), outline=(20, 20, 25, 140))
            draw_glow.polygon(base_pts, fill=(255, 255, 255, 60))

            draw.polygon(pulse_pts, outline=(255, 255, 255, pulse_alpha), fill=(255, 255, 255, int(pulse_alpha * 0.6)))
            draw_glow.polygon(pulse_pts, fill=(200, 235, 255, int(pulse_alpha * 0.5)))
        else: # gold
            draw.polygon(base_pts, fill=(234, 179, 8, 245), outline=(60, 45, 5, 160))
            draw_glow.polygon(base_pts, fill=(250, 204, 21, 80))

            draw.polygon(pulse_pts, outline=(254, 240, 138, pulse_alpha), fill=(163, 230, 53, int(pulse_alpha * 0.6)))
            draw_glow.polygon(pulse_pts, fill=(250, 204, 21, int(pulse_alpha * 0.5)))

        shadow_blurred = shadow.filter(ImageFilter.GaussianBlur(6 * scale))
        glow_blurred = glow.filter(ImageFilter.GaussianBlur(10 * scale))
        comp = Image.alpha_composite(shadow_blurred, glow_blurred)
        comp = Image.alpha_composite(comp, img)

        downsampled = comp.resize((w, h), Image.Resampling.LANCZOS)
        frames.append(downsampled)

    return frames


# -------------------------------------------------------------
# 3. CIRCLE ARROW 02B: GROUND PERSPECTIVE ELLIPSE WITH CHEVRON
# -------------------------------------------------------------
def generate_circle_arrow_02b(theme="white", num_frames=24, size=(360, 270)):
    w, h = size
    scale = 3
    W, H = w * scale, h * scale
    cx, cy = W / 2, H * 0.58

    rx = W * 0.42
    ry = H * 0.26
    ring_thick = int(14 * scale)

    frames = []

    for f in range(num_frames):
        t = f / num_frames

        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw_shadow = ImageDraw.Draw(shadow)
        draw_glow = ImageDraw.Draw(glow)

        pulse = math.sin(t * math.pi * 2) * 0.03
        cur_rx = rx * (1.0 + pulse)
        cur_ry = ry * (1.0 + pulse)

        # Drop shadow for ring
        draw_shadow.ellipse(
            [cx - cur_rx, cy - cur_ry + 6 * scale, cx + cur_rx, cy + cur_ry + 6 * scale],
            outline=(0, 0, 0, 100),
            width=ring_thick
        )

        if theme == "white":
            ring_color = (255, 255, 255, 245)
            ring_glow = (200, 230, 255, 80)
            arr_fill = (255, 255, 255, 255)
            arr_line = (20, 20, 25, 120)
        else: # gold
            ring_color = (234, 179, 8, 250)
            ring_glow = (250, 204, 21, 100)
            arr_fill = (254, 240, 138, 255)
            arr_line = (60, 45, 5, 140)

        # Draw outer ground ring
        draw.ellipse([cx - cur_rx, cy - cur_ry, cx + cur_rx, cy + cur_ry], outline=ring_color, width=ring_thick)
        draw_glow.ellipse([cx - cur_rx, cy - cur_ry, cx + cur_rx, cy + cur_ry], outline=ring_glow, width=ring_thick + 10)

        # Inner 3D polygon arrow sliding forward/up
        arrow_y = cy + (ry * 0.38) - (t * ry * 0.88)
        arrow_persp = 1.0 - (cy - arrow_y) / (H * 0.9)
        arrow_span = W * 0.17 * arrow_persp
        arrow_apex_y = arrow_y - (H * 0.075 * arrow_persp)
        thick = H * 0.045 * arrow_persp

        if t < 0.18:
            a = int((t / 0.18) * 255)
        elif t > 0.72:
            a = int((1.0 - (t - 0.72) / 0.28) * 255)
        else:
            a = 255

        p_apex_out = (cx, arrow_apex_y)
        p_right_out = (cx + arrow_span, arrow_y)
        p_right_in = (cx + arrow_span * 0.78, arrow_y + thick)
        p_apex_in = (cx, arrow_apex_y + thick)
        p_left_in = (cx - arrow_span * 0.78, arrow_y + thick)
        p_left_out = (cx - arrow_span, arrow_y)

        arr_pts = [p_apex_out, p_right_out, p_right_in, p_apex_in, p_left_in, p_left_out]
        s_arr_pts = [(p[0], p[1] + 4 * scale) for p in arr_pts]

        draw_shadow.polygon(s_arr_pts, fill=(0, 0, 0, int(a * 0.45)))
        draw_glow.polygon(arr_pts, fill=(*ring_glow[:3], int(a * 0.5)))
        draw.polygon(arr_pts, fill=(*arr_fill[:3], a), outline=(*arr_line[:3], int(a * 0.6)))

        shadow_blurred = shadow.filter(ImageFilter.GaussianBlur(6 * scale))
        glow_blurred = glow.filter(ImageFilter.GaussianBlur(10 * scale))
        comp = Image.alpha_composite(shadow_blurred, glow_blurred)
        comp = Image.alpha_composite(comp, img)

        downsampled = comp.resize((w, h), Image.Resampling.LANCZOS)
        frames.append(downsampled)

    return frames


# -------------------------------------------------------------
# 4. DOOR PORTAL HOTSPOT: BLUE & GOLD EDITION
# -------------------------------------------------------------
def generate_door_portal(theme="blue", num_frames=24, size=(280, 280)):
    w, h = size
    scale = 3
    W, H = w * scale, h * scale
    cx, cy = W / 2, H / 2
    r_outer = W * 0.38
    r_inner = W * 0.32

    frames = []

    for f in range(num_frames):
        t = f / num_frames

        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw_glow = ImageDraw.Draw(glow)

        # Radiating expanding pulse ripple
        ripple_r = r_outer + (t * (W * 0.11))
        ripple_alpha = int(max(0.0, 1.0 - t) * 160)

        if theme == "blue":
            core_fill = (0, 174, 239, 255) # Cyan / 3DVista blue
            border_outer = (255, 255, 255, 240)
            glow_color = (0, 210, 255, 140)
        else: # gold / emerald
            core_fill = (6, 95, 70, 255) # Deep emerald
            border_outer = (250, 204, 21, 255) # Gold
            glow_color = (234, 179, 8, 160)

        # Draw expanding ripple
        draw_glow.ellipse([cx - ripple_r, cy - ripple_r, cx + ripple_r, cy + ripple_r], outline=(*glow_color[:3], ripple_alpha), width=int(4 * scale))

        # Outer ring
        draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=border_outer, width=int(5 * scale))

        # Inner solid circle
        draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=core_fill)

        # 3D Door Geometry
        # Door frame
        dw, dh = W * 0.22, H * 0.34
        dx0, dy0 = cx - (dw * 0.7), cy - (dh * 0.5)

        # Frame outline
        draw.rectangle([dx0, dy0, dx0 + dw, dy0 + dh], outline=(255, 255, 255, 240), width=int(4.5 * scale))

        # Open door swinging in perspective
        # Swings slightly with breathing angle
        swing = math.sin(t * math.pi * 2) * 0.05
        p1 = (dx0 + dw * 0.15, dy0 + dh * 0.05 - (swing * dh))
        p2 = (dx0 + dw * 0.85, dy0 + dh * 0.15 - (swing * dh * 1.5))
        p3 = (dx0 + dw * 0.85, dy0 + dh * 0.85 + (swing * dh * 1.5))
        p4 = (dx0 + dw * 0.15, dy0 + dh * 0.95 + (swing * dh))

        door_fill = (255, 255, 255, 245) if theme == "blue" else (254, 240, 138, 250)
        draw.polygon([p1, p2, p3, p4], fill=door_fill, outline=(255, 255, 255, 255))

        # Door knob
        knob_cx = dx0 + dw * 0.72
        knob_cy = dy0 + dh * 0.52
        draw.ellipse([knob_cx - 4, knob_cy - 4, knob_cx + 4, knob_cy + 4], fill=(0, 174, 239, 255) if theme == "blue" else (6, 95, 70, 255))

        glow_blurred = glow.filter(ImageFilter.GaussianBlur(10 * scale))
        composite = Image.alpha_composite(glow_blurred, img)

        downsampled = composite.resize((w, h), Image.Resampling.LANCZOS)
        frames.append(downsampled)

    return frames


# -------------------------------------------------------------
# MAIN BATCH EXECUTION
# -------------------------------------------------------------
def save_apng(frames, filename, duration=42):
    for d in DEST_DIRS:
        out_path = os.path.join(d, filename)
        frames[0].save(
            out_path,
            format="PNG",
            save_all=True,
            append_images=frames[1:],
            duration=duration, # ~24 fps
            loop=0
        )
    print(f"  ✓ Created APNG: {filename} ({len(frames)} frames @ {1000//duration}fps)")


def main():
    print("=" * 60)
    print("BATCH GENERATING 3DVISTA ANIMATED APNG HOTSPOTS")
    print("=" * 60)

    # 1. Arrow 06a: 3-Tier Chevron Moving Up
    print("\n[1/4] Generating Arrow 06a (Moving Up Wave)...")
    frames = generate_arrow_06a(theme="white")
    save_apng(frames, "arrow_06a_anim_white.png")
    frames_gold = generate_arrow_06a(theme="gold")
    save_apng(frames_gold, "arrow_06a_anim_gold.png")

    # 2. Arrow 06: Base + Sliding Pulse
    print("\n[2/4] Generating Arrow 06 (Perspective Pulse)...")
    frames = generate_arrow_06(theme="white")
    save_apng(frames, "arrow_06_anim_white.png")
    frames_gold = generate_arrow_06(theme="gold")
    save_apng(frames_gold, "arrow_06_anim_gold.png")

    # 3. Circle Arrow 02b: Ground Ring with Moving Chevron
    print("\n[3/4] Generating Circle Arrow 02b (Ground Floor Ring)...")
    frames = generate_circle_arrow_02b(theme="white")
    save_apng(frames, "circle_arrow_02b_white.png")
    frames_gold = generate_circle_arrow_02b(theme="gold")
    save_apng(frames_gold, "circle_arrow_02b_gold.png")

    # 4. Door Portal: Blue & Gold
    print("\n[4/4] Generating Door Portal Hotspots...")
    frames = generate_door_portal(theme="blue")
    save_apng(frames, "door_portal_anim_blue.png")
    frames_gold = generate_door_portal(theme="gold")
    save_apng(frames_gold, "door_portal_anim_gold.png")

    print("\n" + "=" * 60)
    print("ALL APNG ASSETS GENERATED SUCCESSFULLY TO:")
    for d in DEST_DIRS:
        print(f"  📁 {d}")
    print("=" * 60)

if __name__ == "__main__":
    main()
