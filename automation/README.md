# Bộ Công Cụ Automation Bản Đồ Số Bình Long VR 🚀

Hệ thống script tự động hóa thu thập dữ liệu, chuẩn hóa tên gọi danh lam di tích, tự động tạo audio thuyết minh tiếng Việt tự nhiên (giọng nữ), xử lý ảnh 360 VR (Rectilinear Perspective Unwarping khử méo cầu) và đồng bộ trực tiếp lên Supabase (Storage & Database).

---

## 📁 Cấu Trúc Thư Mục

```text
automation/
├── config.py             # Cấu hình Supabase, Storage bucket, Area ID (25), Goong API, đường dẫn
├── dataset.py            # Dataset chuẩn hóa 4 di tích (DTT, M7N, M3000, HLT), tọa độ, thuyết minh & 60 panoramas
├── dataset.json          # File JSON dataset chuẩn hóa để phục vụ tích hợp đa nền tảng
├── generate_audio.py     # Script tạo thuyết minh tiếng Việt nữ tự nhiên (Microsoft Edge Neural TTS: vi-VN-HoaiMyNeural)
├── process_images.py     # Chuẩn hóa tên file ảnh (không dấu, không khoảng trắng), tạo preview phẳng 16:9 & thumbnail
├── fill_data.py          # Xóa dữ liệu cũ của Bình Long, tải ảnh & audio lên Storage, upsert vào hotspots và panoramas
├── requirements.txt      # Thư viện Python phụ thuộc
├── audio/                # Chứa các tệp audio thuyết minh .mp3 đã tạo
├── processed_images/     # Chứa ảnh panorama đã chuẩn hóa tên và ảnh preview phẳng
└── temp/                 # Thư mục tạm chứa thumbnail 16:9 trước khi upload
```

---

## 🏛️ Danh Sách 4 Di Tích Chuẩn Hóa

1. **DTT - Di tích Lịch sử Dinh Tỉnh Trưởng Bình Long** (Hotspot ID: `130`)
   - Tên chuẩn hóa: `DTT_0_FLYCAM.jpg`, `DTT_1_CONG.jpg`, `DTT_2_SAN.jpg`, `DTT_3_GIUA.jpg`, ...
   - Địa chỉ: Phường Phú Đức, Thị xã Bình Long, Tỉnh Bình Phước
   - Tọa độ: `11.652378, 106.607088`
   - Số lượng panorama: 11 điểm nhìn

2. **M7N - Di tích Lịch sử Mộ tập thể Lực lượng vũ trang An ninh An Lộc (Mộ 7 Người)** (Hotspot ID: `131`)
   - Tên chuẩn hóa: `M7N_0_FLYCAM.jpg`, `M7N_1_CONG.jpg`, `M7N_2_BIA.jpg`, `M7N_3_SAN.jpg`, `M7N_4_MO.jpg`
   - Địa chỉ: Khu phố Bình An, Phường An Lộc, Thị xã Bình Long, Tỉnh Bình Phước
   - Tọa độ: `11.6583201, 106.6057152`
   - Số lượng panorama: 5 điểm nhìn

3. **M3000 - Di tích Lịch sử Quốc gia Mộ 3.000 người An Lộc** (Hotspot ID: `132`)
   - Tên chuẩn hóa: `M3000_0_FLYCAM_1.jpg`, `M3000_1_CONG_PHU.jpg`, `M3000_2_CONG_CHINH.jpg`, `M3000_7_NHA_GIUA.jpg`, ...
   - Địa chỉ: Đường Phạm Ngọc Thạch, Phường An Lộc, Thị xã Bình Long, Tỉnh Bình Phước
   - Tọa độ: `11.6491817, 106.6057461`
   - Số lượng panorama: 22 điểm nhìn

4. **HLT - Di tích Lịch sử - Văn hóa Chùa Hưng Lập Tự** (Hotspot ID: `133`)
   - Tên chuẩn hóa: `HLT_0_FLYCAM.jpg`, `HLT_1_PHAI.jpg`, `HLT_2.jpg`, `HLT_2_1.jpg`, `HLT_2_31.jpg`, ...
   - Địa chỉ: Khu phố Phú Trọng, Phường Phú Đức, Thị xã Bình Long, Tỉnh Bình Phước
   - Tọa độ: `11.6480133, 106.6117306`
   - Số lượng panorama: 22 điểm nhìn

---

## 🛠️ Cài Đặt Môi Trường

```bash
pip install -r automation/requirements.txt
```

---

## 🚀 Các Bước Thực Hiện

### Bước 1: Tạo Audio Thuyết Minh Tiếng Việt Nữ

Sử dụng AI giọng đọc thần kinh `vi-VN-HoaiMyNeural` chất lượng cao, phát âm chuẩn, ngữ điệu truyền cảm tự nhiên phù hợp với lời dẫn phim tư liệu di tích:

```bash
python automation/generate_audio.py
```

*Các tệp MP3 sẽ được lưu trong thư mục `automation/audio/`:*
- `dtt_thuyet_minh.mp3`
- `m7n_thuyet_minh.mp3`
- `m3000_thuyet_minh.mp3`
- `hlt_thuyet_minh.mp3`

### Bước 2: Chuẩn Hóa Tên Tệp & Xử Lý Ảnh 360 Khử Méo Cầu

Vì ảnh gốc là ảnh thực tế ảo 360° Equirectangular dạng cầu (tỷ lệ 2:1), nếu chỉ cắt thông thường ảnh sẽ bị cong méo biến dạng. Bộ script áp dụng thuật toán **Perspective Rectilinear Unwarping** biến đổi chùm tia 3D camera phẳng giúp ảnh chụp đại diện phẳng, sắc nét, chân thực như chụp bằng máy ảnh DSLR tiêu chuẩn:

```bash
python automation/process_images.py
```

*Kết quả:*
- 60 ảnh panorama được chuẩn hóa định danh và sao chép vào `automation/processed_images/{dtt, m7n, m3000, hlt}/`.
- 4 ảnh đại diện phẳng tỷ lệ 16:9 lưu vào `automation/processed_images/previews/` và đồng bộ vào `frontend/public/landmarks/`.
- 60 ảnh thumbnail (800x450) chuẩn 16:9 sinh vào thư mục `automation/temp/`.

### Bước 3: Đồng Bộ & Nạp Dữ Liệu Lên Supabase

Chạy lệnh nạp dữ liệu:

```bash
python automation/fill_data.py
```

*Quy trình thực hiện:*
1. Xóa toàn bộ dữ liệu hotspots và panoramas cũ của Area ID `25` trên bản đồ.
2. Cập nhật bảng `areas`: Area ID `25` -> `Thị xã Bình Long, Bình Phước`, Domain `bandosobinhlong.yhcmute.com`.
3. Tải các ảnh đại diện (16:9), ảnh thumbnail và 4 tệp audio thuyết minh lên Supabase Storage bucket `APP_IMAGES/25/...`.
4. Upsert 4 Hotspots kèm đầy đủ thông tin lịch sử, tọa độ GPS, đường dẫn Audio và URL ảnh đại diện.
5. Upsert 60 Panoramas tương ứng với từng điểm nhìn VR 360°.

---

## ⚙️ Biến Môi Trường (Tùy Chọn)

Có thể cấu hình thông qua biến môi trường hoặc chỉnh sửa trong `automation/config.py`:
- `SUPABASE_HOST`: URL Supabase (mặc định: `https://jmeiegtjrrdeubwzgder.supabase.co`)
- `SUPABASE_SERVICE_KEY`: Service Role Key (để bypass RLS khi ghi dữ liệu và storage)
- `AREA_ID`: ID của khu vực (mặc định: `25`)
- `STORAGE_BUCKET`: Tên bucket lưu trữ ảnh và audio (mặc định: `APP_IMAGES`)
