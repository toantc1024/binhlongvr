#!/usr/bin/env python3
"""
Automation Script: Điền dữ liệu Bản đồ số Bình Long vào Supabase
1. Đồng bộ thông tin khu vực (areas): Area ID 25 -> Thị xã Bình Long, Bình Phước
2. Xóa sạch dữ liệu cũ của Bình Long trên bản đồ (hotspots và panoramas)
3. Tải các ảnh đại diện (preview) và audio thuyết minh lên Supabase Storage (APP_IMAGES/25/...)
4. Upsert thông tin 4 di tích chính (hotspots) kèm tọa độ, thuyết minh audio và hình ảnh
5. Upsert toàn bộ 60 điểm nhìn thực tế ảo 360° (panoramas)

Cách dùng:
    python automation/fill_data.py
    python automation/fill_data.py --service-key <KEY>
"""

import os
import sys
import glob
import json
import argparse
import requests
from supabase import create_client, Client

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import (
    SUPABASE_HOST,
    SUPABASE_SERVICE_KEY,
    AREA_ID,
    AREA_NAME,
    DOMAIN,
    MAIN_HOTSPOT_ID,
    STORAGE_BUCKET,
    AUDIO_DIR,
    TEMP_DIR,
    PREVIEWS_DIR,
    PROCESSED_IMAGES_DIR,
)
from dataset import LOCATIONS_DATA


def upload_storage_file(supabase: Client, local_path: str, storage_path: str, content_type: str = "image/jpeg") -> str:
    """
    Tải tệp tin lên Supabase Storage với bucket công khai và trả về URL trực tiếp.
    """
    if not os.path.exists(local_path):
        raise FileNotFoundError(f"Không tìm thấy tệp để tải lên: {local_path}")

    with open(local_path, "rb") as f:
        file_bytes = f.read()

    supabase.storage.from_(STORAGE_BUCKET).upload(
        path=storage_path,
        file=file_bytes,
        file_options={"content-type": content_type, "upsert": "true"}
    )
    url = f"{SUPABASE_HOST}/storage/v1/object/public/{STORAGE_BUCKET}/{storage_path}"
    return url


def clean_existing_data(supabase: Client):
    """
    Xóa toàn bộ dữ liệu hotspots và panoramas hiện có của Area Bình Long.
    """
    print("\n[BƯỚC 1] Đang dọn dẹp dữ liệu cũ trên bản đồ...")
    
    # Lấy danh sách hotspot hiện tại của area
    res_h = supabase.table("hotspots").select("hotspot_id").eq("area_id", AREA_ID).execute()
    existing_hotspot_ids = [row["hotspot_id"] for row in (res_h.data or [])]
    
    # Cũng xóa các ID thuộc bộ ID mới nếu đã tồn tại từ lần chạy trước
    target_ids = list(set(existing_hotspot_ids + [info["hotspot_id"] for info in LOCATIONS_DATA.values()]))

    for hid in target_ids:
        # Xóa panoramas thuộc hotspot này
        res_del_p = supabase.table("panoramas").delete().eq("hotspot_id", hid).execute()
        count_p = len(res_del_p.data or [])
        if count_p > 0:
            print(f"  - Đã xóa {count_p} panoramas thuộc Hotspot ID {hid}")

    for hid in target_ids:
        # Xóa hotspot
        supabase.table("hotspots").delete().eq("hotspot_id", hid).execute()
        print(f"  - Đã xóa Hotspot ID {hid}")

    print("  -> Dọn dẹp dữ liệu cũ hoàn tất!")


def sync_area_info(supabase: Client):
    """
    Cập nhật thông tin chuẩn của khu vực Bình Long trong bảng areas.
    """
    print(f"\n[BƯỚC 2] Cập nhật thông tin Khu vực Area ID [{AREA_ID}]...")
    area_payload = {
        "area_id": AREA_ID,
        "area_name": AREA_NAME,
        "domain": DOMAIN,
        "main_hotspot_id": MAIN_HOTSPOT_ID,
        "chatbot_limit_request": 100
    }
    res = supabase.table("areas").upsert(area_payload).execute()
    print(f"  [OK] Đã cập nhật Area: {AREA_NAME} (Domain: {DOMAIN}, Main Hotspot: {MAIN_HOTSPOT_ID})")


def fill_hotspots_and_panoramas(supabase: Client):
    """
    Tải ảnh, tải audio, upsert hotspots và toàn bộ panoramas.
    """
    print("\n[BƯỚC 3] Bắt đầu tải tệp lên Storage và Upsert dữ liệu...")
    total_panoramas_uploaded = 0

    for code, info in LOCATIONS_DATA.items():
        hid = info["hotspot_id"]
        title = info["title"]
        print(f"\n==================================================")
        print(f"[*] Xử lý [{code}] (Hotspot {hid}): {title}")
        print(f"==================================================")

        # 1. Tải Audio thuyết minh lên Storage
        audio_local_path = os.path.join(AUDIO_DIR, info["audio_filename"])
        audio_url = None
        if os.path.exists(audio_local_path):
            audio_storage_path = f"{AREA_ID}/audio/{info['audio_filename']}"
            print(f"  -> Tải lên Audio Thuyết minh -> {audio_storage_path}...")
            audio_url = upload_storage_file(supabase, audio_local_path, audio_storage_path, content_type="audio/mpeg")
            print(f"     Audio URL: {audio_url}")
        else:
            print(f"  [WARN] Chưa có tệp audio tại {audio_local_path}. Bỏ qua tải audio.")

        # 2. Tải Hotspot Preview Image lên Storage
        preview_local_path = os.path.join(TEMP_DIR, f"hotspot_{hid}_preview.jpg")
        if not os.path.exists(preview_local_path):
            preview_local_path = os.path.join(PREVIEWS_DIR, f"hotspot_{hid}_preview.jpg")

        hotspot_preview_url = None
        if os.path.exists(preview_local_path):
            preview_storage_path = f"{AREA_ID}/hotspots/hotspot_{hid}_preview.jpg"
            print(f"  -> Tải lên Hotspot Preview Image -> {preview_storage_path}...")
            hotspot_preview_url = upload_storage_file(supabase, preview_local_path, preview_storage_path, content_type="image/jpeg")
            print(f"     Preview URL: {hotspot_preview_url}")
        else:
            print(f"  [WARN] Không tìm thấy ảnh preview tại {preview_local_path}")

        # 3. Upsert Hotspot vào Database
        metadata = {"ids": []}
        if audio_url:
            metadata["audio_url"] = audio_url

        hotspot_payload = {
            "hotspot_id": hid,
            "area_id": AREA_ID,
            "title": title,
            "description": info["description"],
            "address": info["address"],
            "geolocation": info["geolocation"],
            "click_panorama_id": info["click_panorama_id"],
            "metadata": metadata,
            "assets": [],
            "documents": None
        }
        if hotspot_preview_url:
            hotspot_payload["preview_image"] = hotspot_preview_url

        print(f"  -> Upserting Hotspot record [{hid}]...")
        supabase.table("hotspots").upsert(hotspot_payload).execute()
        print(f"  [OK] Đã lưu Hotspot [{hid}] vào CSDL.")

        # 4. Tải Panoramas Preview và Upsert Panoramas
        print(f"  -> Bắt đầu xử lý {len(info['panoramas'])} panoramas...")
        for pan in info["panoramas"]:
            pan_id = pan["id"]
            pan_title = pan["title"]
            pan_thumb_path = os.path.join(TEMP_DIR, f"pan_{pan_id}_preview.jpg")

            pan_preview_url = None
            if os.path.exists(pan_thumb_path):
                pan_storage_path = f"{AREA_ID}/panoramas/pan_{pan_id}_preview.jpg"
                pan_preview_url = upload_storage_file(supabase, pan_thumb_path, pan_storage_path, content_type="image/jpeg")

            pan_payload = {
                "panorama_id": pan_id,
                "hotspot_id": hid,
                "title": pan_title
            }
            if pan_preview_url:
                pan_payload["preview_image"] = pan_preview_url

            supabase.table("panoramas").upsert(pan_payload).execute()
            total_panoramas_uploaded += 1

        print(f"  [OK] Đã hoàn thành lưu {len(info['panoramas'])} panoramas cho {code}.")

    print("\n==================================================")
    print(f"HOÀN THÀNH TẤT CẢ:")
    print(f" - {len(LOCATIONS_DATA)} Hotspots đã được tạo mới.")
    print(f" - {total_panoramas_uploaded} Panoramas đã được cập nhật vào CSDL.")
    print("==================================================")


def main():
    parser = argparse.ArgumentParser(description="Tự động đồng bộ và nạp dữ liệu Bình Long VR lên Supabase")
    parser.add_argument("--service-key", help="Supabase Service Role Key")
    parser.add_argument("--clean-only", action="store_true", help="Chỉ xóa dữ liệu cũ, không nạp mới")
    args = parser.parse_args()

    service_key = args.service_key or SUPABASE_SERVICE_KEY
    if not service_key:
        print("[ERROR] Không tìm thấy Supabase Service Role Key. Vui lòng cung cấp qua --service-key hoặc SUPABASE_SERVICE_KEY.")
        sys.exit(1)

    print(f"Kết nối tới Supabase: {SUPABASE_HOST}")
    supabase: Client = create_client(SUPABASE_HOST, service_key)

    # 1. Xóa dữ liệu cũ
    clean_existing_data(supabase)
    if args.clean_only:
        print("Đã hoàn tất xóa dữ liệu.")
        return

    # 2. Cập nhật thông tin Area
    sync_area_info(supabase)

    # 3. Nạp dữ liệu Hotspots & Panoramas
    fill_hotspots_and_panoramas(supabase)


if __name__ == "__main__":
    main()
