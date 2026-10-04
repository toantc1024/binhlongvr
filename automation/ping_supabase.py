#!/usr/bin/env python3
"""
Simulated Real-User Session for Binh Long VR (Supabase Keep-Alive)
------------------------------------------------------------------
To keep Supabase Free Tier active without exceeding rate limits, this script
simulates a realistic, lightweight user browsing session:
1. Loads app & area metadata (Phường Bình Long, area_id=25)
2. Checks visitor statistics (exact count)
3. Fetches di tích hotspots on the map
4. Simulates user reading/clicking on a di tích with realistic human jitter delay
5. Loads the 360° panoramas for the selected di tích
6. Rotates modern browser User-Agents and sends authentic browser headers

Frequency Recommendation:
- 2 to 4 runs per day (e.g., every 6 or 8 hours)
- Consumes ~300-480 requests/month (out of 500,000 monthly free tier quota: < 0.1%)
"""

import os
import sys
import time
import random
from datetime import datetime, timezone
import requests

# Supabase configuration (fallback to project default credentials)
SUPABASE_HOST = os.getenv("SUPABASE_HOST", "https://jmeiegtjrrdeubwzgder.supabase.co").rstrip("/")
SUPABASE_ANON_KEY = os.getenv(
    "SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZWllZ3RqcnJkZXVid3pnZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTM3OTgsImV4cCI6MjA3MTYyOTc5OH0.JCuKV4TWJlCs15WePRXhL42ZFZ1Miglb-HcdTt3C0BY"
)
AREA_ID = int(os.getenv("AREA_ID", 25))

# Pool of realistic browser User-Agents
USER_AGENTS = [
    # Chrome on macOS
    (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        '"macOS"',
        "?0",
    ),
    # Chrome on Windows 11
    (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        '"Windows"',
        "?0",
    ),
    # Safari on iPhone (iOS 18)
    (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
        None,
        None,
        "?1",
    ),
    # Chrome on Android
    (
        "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36",
        '"Chromium";v="130", "Google Chrome";v="130"',
        '"Android"',
        "?1",
    ),
]

def get_browser_session():
    """Builds a requests session mimicking an authentic browser connection."""
    ua, sec_ua, sec_platform, is_mobile = random.choice(USER_AGENTS)
    session = requests.Session()
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Accept": "application/json",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        "User-Agent": ua,
        "Origin": "https://bandosobinhlong.vn",
        "Referer": "https://bandosobinhlong.vn/",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
    }
    if sec_ua:
        headers["sec-ch-ua"] = sec_ua
    if sec_platform:
        headers["sec-ch-ua-platform"] = sec_platform
    headers["sec-ch-ua-mobile"] = is_mobile

    session.headers.update(headers)
    return session, ua

def run_simulated_user_session():
    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    session, ua = get_browser_session()
    short_ua = ua.split(" ")[0] + " ... " + ua.split(" ")[-1]
    
    print("==================================================================")
    print(" 🌐 BÌNH LONG VR - SIMULATED REAL-USER SESSION (KEEP-ALIVE)")
    print(f" 🕒 Time: {now_utc}")
    print(f" 🎯 Target Area: Phường Bình Long (ID: {AREA_ID})")
    print(f" 🖥️  Client: {short_ua}")
    print("==================================================================")
    
    total_requests = 0
    step_start = time.time()
    
    # -------------------------------------------------------------
    # BƯỚC 1: Người dùng truy cập trang chủ -> Tải thông tin khu vực
    # -------------------------------------------------------------
    print("\n[Bước 1/4] Người dùng vào trang chủ -> Tải Area Metadata...")
    url_area = f"{SUPABASE_HOST}/rest/v1/areas?area_id=eq.{AREA_ID}&select=*"
    t0 = time.time()
    res_area = session.get(url_area, timeout=12)
    total_requests += 1
    
    if res_area.status_code != 200:
        print(f"  ❌ Lỗi tải Area: {res_area.status_code} - {res_area.text[:120]}")
        sys.exit(1)
        
    area_data = res_area.json()
    area_name = area_data[0].get("area_name", "N/A") if area_data else "Unknown"
    print(f"  ✅ Đã tải: {area_name} ({int((time.time() - t0)*1000)}ms)")

    # -------------------------------------------------------------
    # BƯỚC 2: Kiểm tra tổng lượt khách tham quan (Visitor Counter)
    # -------------------------------------------------------------
    print("\n[Bước 2/4] Tải bộ đếm thống kê khách (Visitor count)...")
    url_visitors = f"{SUPABASE_HOST}/rest/v1/visitor_logs?area_id=eq.{AREA_ID}&select=*"
    t0 = time.time()
    res_vis = session.head(url_visitors, headers={"Prefer": "count=exact"}, timeout=12)
    total_requests += 1
    content_range = res_vis.headers.get("content-range", "N/A")
    total_visitors = content_range.split("/")[-1] if "/" in content_range else "N/A"
    print(f"  ✅ Trạng thái: HTTP {res_vis.status_code} | Tổng lượt ghé thăm ghi nhận: {total_visitors} ({int((time.time() - t0)*1000)}ms)")

    # -------------------------------------------------------------
    # BƯỚC 3: Mở bản đồ -> Tải danh sách các điểm di tích (Hotspots)
    # -------------------------------------------------------------
    print("\n[Bước 3/4] Người dùng mở bản đồ số -> Tải danh mục di tích...")
    url_hotspots = f"{SUPABASE_HOST}/rest/v1/hotspots?area_id=eq.{AREA_ID}&select=*&order=hotspot_id.asc"
    t0 = time.time()
    res_hotspots = session.get(url_hotspots, timeout=12)
    total_requests += 1
    
    if res_hotspots.status_code != 200:
        print(f"  ❌ Lỗi tải Hotspots: {res_hotspots.status_code}")
        sys.exit(1)
        
    hotspots = res_hotspots.json()
    print(f"  ✅ Đã tải thành công {len(hotspots)} điểm di tích ({int((time.time() - t0)*1000)}ms):")
    for idx, h in enumerate(hotspots, 1):
        print(f"     {idx}. [ID {h.get('hotspot_id')}] {h.get('title')}")

    if not hotspots:
        print("  ⚠️ Không có hotspot nào trong DB.")
        sys.exit(0)

    # -------------------------------------------------------------
    # Mô phỏng độ trễ suy nghĩ của con người (1.0 - 2.0 giây)
    # -------------------------------------------------------------
    selected_hotspot = random.choice(hotspots)
    hid = selected_hotspot.get("hotspot_id")
    title = selected_hotspot.get("title")
    read_delay = round(random.uniform(1.0, 2.0), 2)
    print(f"\n⏳ Người dùng xem qua danh sách và quyết định bấm vào di tích sau {read_delay}s...")
    time.sleep(read_delay)

    # -------------------------------------------------------------
    # BƯỚC 4: Người dùng vào xem tour VR -> Tải danh sách ảnh 360° (Panoramas)
    # -------------------------------------------------------------
    print(f"[Bước 4/4] Khám phá Di tích: '{title}' (ID {hid}) -> Tải các góc nhìn 360°...")
    url_panos = f"{SUPABASE_HOST}/rest/v1/panoramas?hotspot_id=eq.{hid}&select=*&order=panorama_id.asc"
    t0 = time.time()
    res_panos = session.get(url_panos, timeout=12)
    total_requests += 1
    
    if res_panos.status_code == 200:
        panos = res_panos.json()
        print(f"  ✅ Đã tải {len(panos)} khung cảnh panorama 360° ({int((time.time() - t0)*1000)}ms)")
        if panos:
            sample_p = panos[0]
            print(f"     Góc nhìn khởi đầu: '{sample_p.get('title')}' (ID: {sample_p.get('panorama_id')})")
    else:
        print(f"  ⚠️ Cảnh báo tải panos: HTTP {res_panos.status_code}")

    total_time = round(time.time() - step_start, 2)
    print("\n==================================================================")
    print(f" ✨ HOÀN TẤT PHIÊN TRUY CẬP MÔ PHỎNG:")
    print(f" - Tổng request phát sinh: {total_requests} requests")
    print(f" - Tổng thời gian phiên: {total_time}s")
    print(f" - Đánh giá: Supabase PostgreSQL & Edge Gateway hoàn toàn ACTIVE.")
    print(" - Hạn mức tiêu thụ ước tính: ~250 - 480 requests/tháng (< 0.1% Free Limit).")
    print("==================================================================")

if __name__ == "__main__":
    run_simulated_user_session()
