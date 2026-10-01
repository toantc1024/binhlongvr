#!/usr/bin/env python3
"""
Master Runner Script: Chạy toàn bộ quy trình automation cho Bản đồ số Bình Long VR
Bước 1: Tạo audio thuyết minh tiếng Việt nữ (vi-VN-HoaiMyNeural)
Bước 2: Chuẩn hóa tên tệp, xử lý ảnh 360 khử méo cầu và sinh thumbnail 16:9
Bước 3: Dọn dẹp dữ liệu cũ, tải Storage và Upsert Hotspots + Panoramas vào Supabase
Bước 4: Kiểm tra xác thực dữ liệu trên Supabase Cloud
"""

import os
import sys
import time
import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import SUPABASE_HOST, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, AREA_ID
from dataset import LOCATIONS_DATA

import generate_audio
import process_images
import fill_data


def main():
    start_time = time.time()
    print("=" * 60)
    print("  KHỞI ĐỘNG TOÀN BỘ QUY TRÌNH AUTOMATION BÌNH LONG VR")
    print("=" * 60)

    # ----------------------------------------------------
    # BƯỚC 1: TẠO AUDIO THUYẾT MINH
    # ----------------------------------------------------
    print("\n>>> [1/3] ĐANG TẠO AUDIO THUYẾT MINH...")
    generate_audio.main_sync()

    # ----------------------------------------------------
    # BƯỚC 2: XỬ LÝ & CHUẨN HÓA ẢNH
    # ----------------------------------------------------
    print("\n>>> [2/3] ĐANG XỬ LÝ VÀ CHUẨN HÓA ẢNH 360 & THUMBNAIL...")
    process_images.process_all_images()

    # ----------------------------------------------------
    # BƯỚC 3: DỌN DẸP & UPSERT LÊN SUPABASE
    # ----------------------------------------------------
    print("\n>>> [3/3] ĐANG ĐỒNG BỘ VÀ NẠP DỮ LIỆU LÊN SUPABASE...")
    from supabase import create_client
    supabase = create_client(SUPABASE_HOST, SUPABASE_SERVICE_KEY)

    fill_data.clean_existing_data(supabase)
    fill_data.sync_area_info(supabase, main_hotspot_id=None)
    fill_data.fill_hotspots_and_panoramas(supabase)
    fill_data.sync_area_info(supabase, main_hotspot_id=132)

    # ----------------------------------------------------
    # BƯỚC 4: KIỂM TRA XÁC THỰC KẾT QUẢ
    # ----------------------------------------------------
    print("\n" + "=" * 60)
    print("  KIỂM TRA DỮ LIỆU TRÊN SUPABASE CLOUD (ANON API)")
    print("=" * 60)

    headers = {"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {SUPABASE_ANON_KEY}"}
    r_area = requests.get(f"{SUPABASE_HOST}/rest/v1/areas?area_id=eq.{AREA_ID}", headers=headers).json()
    r_hotspots = requests.get(f"{SUPABASE_HOST}/rest/v1/hotspots?area_id=eq.{AREA_ID}", headers=headers).json()
    
    hid_list = [h["hotspot_id"] for h in r_hotspots]
    r_panos = requests.get(f"{SUPABASE_HOST}/rest/v1/panoramas?hotspot_id=in.({','.join(map(str, hid_list))})", headers=headers).json()

    print(f"[OK] Area {AREA_ID}: {r_area[0]['area_name']} (Main Hotspot: {r_area[0]['main_hotspot_id']})")
    print(f"[OK] Tổng số Hotspots: {len(r_hotspots)}")
    for h in r_hotspots:
        print(f"      * [{h['hotspot_id']}] {h['title']}")
        print(f"        Audio:   {h.get('metadata', {}).get('audio_url')}")
        print(f"        Preview: {h.get('preview_image')}")
    print(f"[OK] Tổng số Panoramas: {len(r_panos)}")

    elapsed = time.time() - start_time
    print("\n" + "=" * 60)
    print(f"  TOÀN BỘ QUY TRÌNH ĐÃ HOÀN THÀNH XUẤT SẮC! ({elapsed:.1f}s)")
    print("=" * 60)


if __name__ == "__main__":
    main()
