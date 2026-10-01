#!/usr/bin/env python3
"""
Tự động xử lý ảnh cho dự án Bản đồ số Bình Long:
1. Chuẩn hóa tên tệp panorama (không dấu, không khoảng trắng, định danh rõ ràng như DTT_0_FLYCAM.jpg).
2. Tạo ảnh preview 16:9 chất lượng cao bằng thuật toán Rectilinear Perspective Unwarping
   giúp triệt tiêu độ méo cầu của ảnh 360 VR equirectangular.
3. Tạo thumbnail chuẩn 16:9 (800x450) cho từng panorama.
4. Xuất ảnh preview vào frontend/public/landmarks và automation/processed_images.
"""

import os
import sys
import argparse
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import RAW_IMAGES_DIR, PROCESSED_IMAGES_DIR, TEMP_DIR, PREVIEWS_DIR, REPO_ROOT
from dataset import LOCATIONS_DATA

Image.MAX_IMAGE_PIXELS = None


def extract_perspective(src_path: str, dest_path: str, fov_deg: float = 85.0, yaw_deg: float = 0.0, pitch_deg: float = 0.0, target_size=(1200, 675)):
    """
    Trích xuất ảnh góc nhìn phẳng (Rectilinear / Perspective view) từ ảnh 360° Equirectangular.
    Khử hoàn toàn hiện tượng uốn cong mắt cá (spherical distortion) của ảnh 360 toàn cảnh.
    """
    with Image.open(src_path) as raw_img:
        im = raw_img.convert("RGB")
        src_w, src_h = im.size
        target_w, target_h = target_size

        f = 0.5 * target_w / np.tan(np.deg2rad(fov_deg) / 2)
        x = np.arange(target_w) - target_w / 2
        y = np.arange(target_h) - target_h / 2
        xx, yy = np.meshgrid(x, y)
        zz = np.full_like(xx, f)

        ray = np.stack([xx, -yy, zz], axis=-1)
        norm = np.linalg.norm(ray, axis=-1, keepdims=True)
        ray = ray / norm

        yaw = np.deg2rad(yaw_deg)
        pitch = np.deg2rad(pitch_deg)

        R_pitch = np.array([
            [1, 0, 0],
            [0, np.cos(pitch), -np.sin(pitch)],
            [0, np.sin(pitch), np.cos(pitch)]
        ])
        R_yaw = np.array([
            [np.cos(yaw), 0, np.sin(yaw)],
            [0, 1, 0],
            [-np.sin(yaw), 0, np.cos(yaw)]
        ])
        R = R_yaw @ R_pitch

        ray_rot = np.einsum('ij,hwj->hwi', R, ray)
        rx, ry, rz = ray_rot[..., 0], ray_rot[..., 1], ray_rot[..., 2]

        lon = np.arctan2(rx, rz)
        lat = np.arcsin(np.clip(ry, -1.0, 1.0))

        u = (lon / (2 * np.pi) + 0.5) * src_w
        v = (0.5 - lat / np.pi) * src_h

        src_arr = np.array(im)
        out_arr = np.zeros((target_h, target_w, 3), dtype=np.uint8)
        for c in range(3):
            out_arr[..., c] = map_coordinates(src_arr[..., c], [v, u], order=1, mode='wrap')

        dest_img = Image.fromarray(out_arr)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        dest_img.save(dest_path, "JPEG", quality=92)
    return dest_path


def crop_thumbnail_16_9(src_path: str, dest_path: str, target_width: int = 800, target_height: int = 450):
    """
    Cắt ảnh tỷ lệ chuẩn 16:9 từ ảnh nguồn và lưu lại với kích thước thumbnail.
    """
    with Image.open(src_path) as img:
        img = img.convert("RGB")
        width, height = img.size

        target_aspect = target_width / target_height
        current_aspect = width / height

        if current_aspect > target_aspect:
            new_width = int(height * target_aspect)
            offset = (width - new_width) // 2
            box = (offset, 0, offset + new_width, height)
        else:
            new_height = int(width / target_aspect)
            offset = (height - new_height) // 2
            box = (0, offset, width, offset + new_height)

        cropped = img.crop(box)
        cropped.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        cropped.save(dest_path, "JPEG", quality=88)
    return dest_path


def find_source_image(folder_path: str, filename_or_pan) -> str:
    """
    Tìm ảnh nguồn có tính đến việc tệp đã được đổi tên sang tên chuẩn hóa (standardized_file)
    hoặc tên gốc (raw_file) kèm giải quyết sai khác mã hóa Unicode.
    """
    import unicodedata

    candidates = []
    if isinstance(filename_or_pan, dict):
        if filename_or_pan.get("standardized_file"):
            candidates.append(filename_or_pan["standardized_file"])
        if filename_or_pan.get("raw_file"):
            candidates.append(filename_or_pan["raw_file"])
    elif isinstance(filename_or_pan, str):
        candidates.append(filename_or_pan)

    for c in candidates:
        direct = os.path.join(folder_path, c)
        if os.path.exists(direct):
            return direct

    # Duyệt file trong thư mục đối chiếu
    for target in candidates:
        target_norm = unicodedata.normalize('NFC', target).lower()
        target_clean = "".join(target_norm.split())

        for f in os.listdir(folder_path):
            f_norm = unicodedata.normalize('NFC', f).lower()
            if f_norm == target_norm or "".join(f_norm.split()) == target_clean:
                return os.path.join(folder_path, f)

    return os.path.join(folder_path, candidates[0] if candidates else "")


def process_all_images():
    print("==================================================")
    print("BẮT ĐẦU XỬ LÝ VÀ CHUẨN HÓA HỆ THỐNG ẢNH BÌNH LONG")
    print("==================================================")
    print(f"Thư mục ảnh gốc: {RAW_IMAGES_DIR}")
    print(f"Thư mục ảnh đã chuẩn hóa: {PROCESSED_IMAGES_DIR}")
    print(f"Thư mục tạm thumbnail: {TEMP_DIR}")

    os.makedirs(PROCESSED_IMAGES_DIR, exist_ok=True)
    os.makedirs(TEMP_DIR, exist_ok=True)
    os.makedirs(PREVIEWS_DIR, exist_ok=True)

    frontend_landmarks_dir = os.path.join(REPO_ROOT, "frontend", "public", "landmarks")
    os.makedirs(frontend_landmarks_dir, exist_ok=True)

    total_panoramas = 0

    for code, info in LOCATIONS_DATA.items():
        print(f"\n--------------------------------------------------")
        print(f"[*] Đang xử lý địa điểm [{code}]: {info['title']}")
        print(f"--------------------------------------------------")

        raw_folder = os.path.join(RAW_IMAGES_DIR, info["folder"])
        proc_folder = os.path.join(PROCESSED_IMAGES_DIR, info["folder"])
        os.makedirs(proc_folder, exist_ok=True)

        # 1. Trích xuất ảnh Preview chụp phẳng cho Hotspot (Rectilinear Perspective Unwarp)
        preview_src_path = find_source_image(raw_folder, info["preview_source_image"])
        hotspot_preview_dest = os.path.join(PREVIEWS_DIR, f"hotspot_{info['hotspot_id']}_preview.jpg")
        temp_hotspot_preview = os.path.join(TEMP_DIR, f"hotspot_{info['hotspot_id']}_preview.jpg")

        if os.path.exists(preview_src_path):
            params = info.get("perspective_params", {"fov_deg": 85, "yaw_deg": 0, "pitch_deg": 0})
            print(f"  -> Trích xuất ảnh phối cảnh phẳng cho Hotspot {info['hotspot_id']} (Yaw={params.get('yaw_deg', 0)}°)...")
            extract_perspective(
                src_path=preview_src_path,
                dest_path=hotspot_preview_dest,
                fov_deg=params.get("fov_deg", 85),
                yaw_deg=params.get("yaw_deg", 0),
                pitch_deg=params.get("pitch_deg", 0),
                target_size=(1200, 675)
            )
            # Copy to temp
            with open(hotspot_preview_dest, "rb") as f_in, open(temp_hotspot_preview, "wb") as f_out:
                f_out.write(f_in.read())

            # Đồng bộ ảnh đại diện vào frontend/public/landmarks
            frontend_dest = os.path.join(frontend_landmarks_dir, f"{info['folder']}_preview.jpg")
            with open(hotspot_preview_dest, "rb") as f_in, open(frontend_dest, "wb") as f_out:
                f_out.write(f_in.read())
            print(f"  [OK] Đã tạo Hotspot Preview: {hotspot_preview_dest}")
        else:
            print(f"  [WARN] Không tìm thấy ảnh nguồn preview: {preview_src_path}")

        # 2. Xử lý chuẩn hóa tên và cắt Thumbnail cho từng Panorama
        for pan in info["panoramas"]:
            pan_id = pan["id"]
            pan_raw_path = find_source_image(raw_folder, pan)
            pan_std_path = os.path.join(proc_folder, pan["standardized_file"])
            pan_thumb_path = os.path.join(TEMP_DIR, f"pan_{pan_id}_preview.jpg")

            if os.path.exists(pan_raw_path):
                # Tạo bản sao sang thư mục processed_images nếu khác thư mục
                if os.path.abspath(pan_raw_path) != os.path.abspath(pan_std_path):
                    import shutil
                    shutil.copy2(pan_raw_path, pan_std_path)

                # Tạo thumbnail 16:9
                crop_thumbnail_16_9(pan_raw_path, pan_thumb_path, target_width=800, target_height=450)
                total_panoramas += 1
            else:
                print(f"  [WARN] Không tìm thấy ảnh panorama: {pan.get('standardized_file')} / {pan.get('raw_file')}")

        print(f"  [OK] Đã chuẩn hóa {len(info['panoramas'])} panoramas cho {code}")

    print("\n==================================================")
    print(f"HOÀN THÀNH: Đã xử lý {len(LOCATIONS_DATA)} địa danh và {total_panoramas} ảnh panorama 360!")
    print("==================================================")


def main():
    parser = argparse.ArgumentParser(description="Xử lý và chuẩn hóa ảnh 360 cho dự án Bình Long VR")
    args = parser.parse_args()
    process_all_images()


if __name__ == "__main__":
    main()
