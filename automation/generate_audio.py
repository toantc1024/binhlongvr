#!/usr/bin/env python3
"""
Tự động tạo giọng đọc thuyết minh tiếng Việt nữ (tự nhiên, truyền cảm)
sử dụng Microsoft Edge Neural TTS (vi-VN-HoaiMyNeural).
"""

import os
import sys
import asyncio
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import AUDIO_DIR, TTS_VOICE, TTS_RATE, TTS_PITCH
from dataset import LOCATIONS_DATA

try:
    import edge_tts
except ImportError:
    print("[ERROR] edge-tts chưa được cài đặt. Vui lòng chạy: pip install edge-tts")
    sys.exit(1)


async def _generate_single_audio_async(code: str, info: dict, voice: str = TTS_VOICE, rate: str = TTS_RATE, pitch: str = TTS_PITCH):
    audio_path = os.path.join(AUDIO_DIR, info["audio_filename"])
    print(f"\n[{code}] Đang tạo audio thuyết minh: {info['title']}...")
    print(f"       Giọng đọc: {voice} | Tốc độ: {rate} | Cao độ: {pitch}")
    print(f"       Độ dài văn bản: {len(info['audio_text'])} ký tự")

    communicate = edge_tts.Communicate(info["audio_text"], voice=voice, rate=rate, pitch=pitch)
    await communicate.save(audio_path)

    file_size_kb = os.path.getsize(audio_path) / 1024
    print(f"       -> Hoàn thành: {audio_path} ({file_size_kb:.1f} KB)")
    return audio_path


def generate_single_audio(code: str, info: dict, voice: str = TTS_VOICE, rate: str = TTS_RATE, pitch: str = TTS_PITCH):
    return asyncio.run(_generate_single_audio_async(code, info, voice=voice, rate=rate, pitch=pitch))


def main_sync(selected_code=None, voice=TTS_VOICE, rate=TTS_RATE, pitch=TTS_PITCH):
    os.makedirs(AUDIO_DIR, exist_ok=True)
    targets = {selected_code: LOCATIONS_DATA[selected_code]} if selected_code else LOCATIONS_DATA

    print("==================================================")
    print("BẮT ĐẦU TẠO AUDIO THUYẾT MINH DI TÍCH BÌNH LONG")
    print("==================================================")

    for code, info in targets.items():
        generate_single_audio(code, info, voice=voice, rate=rate, pitch=pitch)

    print("\n==================================================")
    print(f"HOÀN THÀNH: Đã tạo thành công {len(targets)} tệp âm thanh thuyết minh!")
    print(f"Thư mục lưu: {AUDIO_DIR}")
    print("==================================================")


def main():
    parser = argparse.ArgumentParser(description="Tạo audio thuyết minh tiếng Việt tự nhiên cho di tích Bình Long")
    parser.add_argument("--code", choices=list(LOCATIONS_DATA.keys()), help="Mã di tích (DTT, M7N, M3000, HLT). Mặc định tạo toàn bộ.")
    parser.add_argument("--voice", default=TTS_VOICE, help="Tên giọng TTS (mặc định: vi-VN-HoaiMyNeural)")
    parser.add_argument("--rate", default=TTS_RATE, help="Tốc độ đọc (ví dụ: +0%, -5%)")
    parser.add_argument("--pitch", default=TTS_PITCH, help="Cao độ giọng (ví dụ: +0Hz, -2Hz)")
    args = parser.parse_args()

    main_sync(
        selected_code=args.code,
        voice=args.voice,
        rate=args.rate,
        pitch=args.pitch
    )


if __name__ == "__main__":
    main()
