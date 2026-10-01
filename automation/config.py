import os

# Supabase Credentials
SUPABASE_HOST = os.getenv("SUPABASE_HOST", "https://jmeiegtjrrdeubwzgder.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv(
    "SUPABASE_SERVICE_KEY",
    os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZWllZ3RqcnJkZXVid3pnZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA1Mzc5OCwiZXhwIjoyMDcxNjI5Nzk4fQ.ed2WMXm32D460JTgYXDDPONFPEZLynUfPlnY0x3CGtc")
)
SUPABASE_ANON_KEY = os.getenv(
    "SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZWllZ3RqcnJkZXVid3pnZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTM3OTgsImV4cCI6MjA3MTYyOTc5OH0.JCuKV4TWJlCs15WePRXhL42ZFZ1Miglb-HcdTt3C0BY"
)

# Project and Storage Config
AREA_ID = int(os.getenv("AREA_ID", 25))
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "APP_IMAGES")
AREA_NAME = "Thị xã Bình Long, Bình Phước"
DOMAIN = "bandosobinhlong.vn"
MAIN_HOTSPOT_ID = 132  # Mộ 3.000 người An Lộc

# Goong Map API Key
GOONG_API_KEY = os.getenv("GOONG_API_KEY", "7bWT40gj8VTkZ1INXSPPQk3CJG5tLg9jIgMayy3f")

# TTS Voice Configuration
TTS_VOICE = "vi-VN-HoaiMyNeural"  # Giọng nữ tiếng Việt truyền cảm, tự nhiên
TTS_RATE = "+0%"
TTS_PITCH = "+0Hz"

# Path configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(BASE_DIR)
PARENT_DIR = os.path.dirname(REPO_ROOT)

# Auto-detect raw image folder
CANDIDATE_RAW_DIRS = [
    os.path.join(REPO_ROOT, "images"),
    PARENT_DIR
]

RAW_IMAGES_DIR = next((d for d in CANDIDATE_RAW_DIRS if os.path.isdir(os.path.join(d, "dtt"))), CANDIDATE_RAW_DIRS[0])
AUDIO_DIR = os.path.join(BASE_DIR, "audio")
PROCESSED_IMAGES_DIR = os.path.join(BASE_DIR, "processed_images")
TEMP_DIR = os.path.join(BASE_DIR, "temp")
PREVIEWS_DIR = os.path.join(PROCESSED_IMAGES_DIR, "previews")
