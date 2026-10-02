# CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
### Độc lập - Tự do - Hạnh phúc
*Bình Long, ngày 03 tháng 10 năm 2026*

---

# BIÊN BẢN VÀ HỒ SƠ BÀN GIAO KỸ THUẬT
## HỆ THỐNG TRÍ TUỆ NHÂN TẠO (AI) & TỰ ĐỘNG HÓA SỐ HÓA
**Dự án:** Bản đồ số Di tích Lịch sử và Văn hóa Phường Bình Long (Bình Long VR)  
**Font quy chuẩn thể thức văn bản hành chính:** Times New Roman (Nghị định số 30/2020/NĐ-CP)  
**Tệp định dạng Word kèm theo:** `bien_ban_ban_giao_ai.docx`

---

### CĂN CỨ BÀN GIAO
- Căn cứ Kế hoạch liên tịch giữa Ủy ban Nhân dân Phường Bình Long và Đoàn Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh (HCMUTE) về việc triển khai công trình thanh niên chuyển đổi số di sản văn hóa;
- Căn cứ Biên bản nghiệm thu kỹ thuật sản phẩm phần mềm "Bản đồ số du lịch thực tế ảo Phường Bình Long" (Bình Long VR);
- Hôm nay, ngày 03 tháng 10 năm 2026, tại trụ sở UBND Phường Bình Long, chúng tôi tiến hành bàn giao hồ sơ kỹ thuật, mã nguồn, mô hình Trí tuệ Nhân tạo (AI) và công cụ tự động hóa của dự án với các nội dung chi tiết như sau:

---

### I. THÀNH PHẦN THAM GIA BÀN GIAO VÀ TIẾP NHẬN

#### 1. Đại diện Bên Bàn giao (Đội ngũ Phát triển Trí tuệ Nhân tạo & Phần mềm - HCMUTE):
- **Đại diện Kỹ thuật & Trưởng nhóm AI:** Đỗ Cao Toàn (Kỹ sư Công nghệ Phần mềm - AI Lead).
- **Đơn vị công tác:** Đoàn Trường Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh.
- **Email liên hệ:** tctoan1024@gmail.com.
- **Nhiệm vụ:** Chịu trách nhiệm thiết kế kiến trúc AI, thuật toán xử lý ảnh 360°, pipeline âm thanh thần kinh và tích hợp hệ thống.

#### 2. Đại diện Bên Tiếp nhận (Ủy ban Nhân dân Phường Bình Long):
- **Đại diện Lãnh đạo:** Thường trực Ủy ban Nhân dân Phường Bình Long.
- **Đại diện Ban ngành:** Ban Văn hóa - Thông tin & Đoàn Thanh niên Phường Bình Long.
- **Địa chỉ trụ sở:** Phường Bình Long, Thành phố Đồng Nai.
- **Nhiệm vụ:** Tiếp nhận toàn bộ sản phẩm số, cơ sở dữ liệu, quản lý hạ tầng và khai thác phục vụ nhân dân, du khách.

---

### II. NỘI DUNG VÀ CHI TIẾT BÀN GIAO CÁC PHÂN HỆ TRÍ TUỆ NHÂN TẠO (AI)

#### 1. Phân hệ AI 1: Thuật toán Xử lý Ảnh Thực tế ảo 360° (Perspective Rectilinear Unwarping)
- **Mục đích kỹ thuật:** Ảnh toàn cảnh 360° Equirectangular dạng cầu (tỉ lệ 2:1) khi trích xuất làm ảnh đại diện hay thumbnail thường bị méo cong, làm biến dạng các góc kiến trúc lịch sử. Phân hệ thuật toán AI này giải quyết triệt để bài toán khử méo cầu quang học.
- **Nguyên lý toán học & thuật toán:**
  - Mô phỏng chùm tia máy ảnh phẳng ảo (Pinhole Camera Raycasting) chiếu ngược lên mặt cầu không gian 3D (Spherical to Cartesian Coordinate Conversion).
  - Tự do tinh chỉnh các thông số quang học: Trường nhìn (FOV: 80° - 85°), Góc xoay ngang (Yaw), Góc nâng hạ (Pitch) và Góc nghiêng (Roll).
  - Áp dụng phép nội suy song tuyến tính (Bilinear Interpolation) cho hình ảnh chuẩn tỉ lệ 16:9 sắc nét, trong trẻo như chụp từ máy ảnh DSLR chuyên dụng.
- **Vị trí mã nguồn:** `automation/process_images.py`.
- **Kết quả bàn giao:** Xử lý chuẩn hóa 60 bức ảnh toàn cảnh VR 360° của 4 di tích, tự động trích xuất 4 ảnh đại diện 16:9 và 60 ảnh thumbnail (800x450px).

#### 2. Phân hệ AI 2: Hệ thống Giọng đọc Thuyết minh Tiếng Việt Thần kinh (Neural TTS Voice AI)
- **Mục đích kỹ thuật:** Tự động chuyển đổi các văn bản nghiên cứu lịch sử thành các bản thuyết minh âm thanh sống động, truyền cảm, ngữ điệu tự nhiên chuẩn tiếng Việt phục vụ tính năng Audio Guide trên bản đồ.
- **Mô hình & Công nghệ:**
  - Mạng nơ-ron học sâu Microsoft Edge Neural TTS (Deep Neural Speech Synthesis).
  - Voice Model: `vi-VN-HoaiMyNeural` (Giọng nữ Nam/Trung bộ thanh thoát, ấm áp, trang trọng, phù hợp phim tài liệu lịch sử).
  - Tự động ngắt nghỉ câu ngữ pháp, xử lý tốc độ đọc và âm lượng hài hòa.
- **Vị trí mã nguồn:** `automation/generate_audio.py`.
- **Sản phẩm bàn giao:** 4 tệp âm thanh MP3 hoàn chỉnh: `dtt_thuyet_minh.mp3`, `m7n_thuyet_minh.mp3`, `m3000_thuyet_minh.mp3`, `hlt_thuyet_minh.mp3`.

#### 3. Phân hệ AI 3: Trợ lý Ảo AI & Chatbot Hướng dẫn viên Lịch sử (AI Heritage Assistant)
- **Mục đích kỹ thuật:** Đóng vai trò hướng dẫn viên số 24/7 trực quan trên nền tảng web, hỗ trợ giải đáp thắc mắc về lịch sử Bình Long, sự kiện chiến đấu bảo vệ quê hương năm 1972, xuất xứ tên gọi di tích và hướng dẫn di chuyển.
- **Kiến trúc & Kỹ thuật:**
  - Prompt Engineering chuyên sâu: Thiết lập phong cách xưng hô kính cẩn, văn phong trang trọng, chuẩn mực chính trị - văn hóa địa phương.
  - Cơ chế RAG (Retrieval-Augmented Generation): Nạp trực tiếp bộ cơ sở tri thức chuẩn hóa (`automation/dataset.json`), đảm bảo 100% câu trả lời có dẫn chứng lịch sử xác thực, ngăn chặn hiện tượng bịa đặt thông tin (AI Hallucination).

#### 4. Phân hệ AI 4: Pipeline Tự động hóa Toàn diện (Data Automation Pipeline)
- **Mục đích kỹ thuật:** Giúp cán bộ quản lý dễ dàng bổ sung di tích mới hoặc cập nhật nội dung chỉ với 1 cú click lệnh, không cần can thiệp vào mã nguồn giao diện web.
- **Quy trình thực thi 4 bước tự động:**
  1. Đọc cấu hình và dataset chuẩn hóa từ `automation/dataset.py`.
  2. Sinh âm thanh thuyết minh AI tự động qua Neural Voice.
  3. Thuật toán Unwarping khử méo cầu và kết xuất ảnh phẳng 16:9 sắc nét.
  4. Đồng bộ lên Cloud Database (Supabase PostgreSQL) và Cloud Storage (Bucket APP_IMAGES/25/...).
- **Tệp mã nguồn:** `automation/run_all.py` và `automation/fill_data.py`.

#### 5. Phân hệ AI 5: Bộ Nhận diện Đồ họa 3D Clay UI (Bình Long Emerald Edition)
- Thiết kế và đồng bộ hóa bằng AI theo ngôn ngữ thiết kế HCMUTE 3D Clay Style: Bộ ghim bản đồ 3D chuyển động Flip, biểu tượng VR, tai nghe âm thanh, huy hiệu điều hướng 3D Vista viền kim loại vàng bóng nền ngọc bích.
- **Tệp mã nguồn:** `automation/generate_3dvista_assets.py`, `generate_apng_hotspots.py`.

---

### III. BẢNG KIỂM KÊ CHI TIẾT TÀI NGUYÊN VÀ THÔNG SỐ BÀN GIAO

| STT | Hạng mục bàn giao | Quy cách kỹ thuật / Vị trí tệp | Trạng thái |
| :---: | :--- | :--- | :---: |
| 1 | **Mã nguồn Pipeline AI** | Thư mục `automation/` (dataset.py, generate_audio.py, process_images.py, fill_data.py) | Đã hoàn tất |
| 2 | **Mô hình Giọng đọc AI** | Microsoft Edge Neural TTS (vi-VN-HoaiMyNeural) - Audio MP3 320kbps | Đã xuất bản |
| 3 | **Thuật toán Unwarping 360** | Pinhole Camera Raycasting (Perspective Rectilinear 16:9 Preview) | Đạt chuẩn 4K |
| 4 | **Dataset 4 Di tích Lịch sử** | `automation/dataset.json` (60 Panoramas 360°, 4 Hotspots, GPS, tư liệu) | Đã kiểm duyệt |
| 5 | **Dữ liệu Đám mây Supabase** | Database PostgreSQL (Area ID: 25) & Cloud Storage Bucket APP_IMAGES | Hoạt động tốt |
| 6 | **Hệ thống Web Frontend** | React 19, TypeScript, Vite, Tailwind CSS, MapLibre GL, 3DVista Player | Sẵn sàng vận hành |
| 7 | **Bộ Poster & Infographic** | Poster quảng cáo, Poster hướng dẫn sử dụng, Mockup Showcase thiết bị | Đầy đủ file in |
| 8 | **Tài liệu kỹ thuật & API** | Hồ sơ kiến trúc, cấu hình biến môi trường, quy trình cập nhật dữ liệu | Đã bàn giao |

---

### IV. HƯỚNG DẪN VẬN HÀNH VÀ BẢO TRÌ HỆ THỐNG
1. **Môi trường thực thi khuyến nghị:** Hệ điều hành Linux / macOS / Windows cài đặt Python 3.9+. Cài đặt thư viện: `pip install -r automation/requirements.txt`.
2. **Quy trình nạp thêm di tích mới:**
   - Bước 1: Khai báo thông tin trong `automation/dataset.py`.
   - Bước 2: Kích hoạt AI tự động: `python automation/run_all.py`.
   - Bước 3: Đồng bộ đám mây: `python automation/fill_data.py`.

---

### V. CAM KẾT BẢO HÀNH VÀ KÝ NHẬN
1. Đội ngũ phát triển (HCMUTE) cam kết bảo hành kỹ thuật, hỗ trợ sửa lỗi phát sinh liên quan đến hệ thống AI và mã nguồn trong thời gian 12 tháng kể từ ngày ký biên bản bàn giao.
2. Sẵn sàng tổ chức các buổi đào tạo, chuyển giao công nghệ cho cán bộ phụ trách CNTT của UBND Phường Bình Long.
3. Biên bản này được lập thành 04 (bốn) bản có giá trị pháp lý như nhau; Bên Bàn giao giữ 02 bản, Bên Tiếp nhận giữ 02 bản để cùng phối hợp thực hiện.

| ĐẠI DIỆN BÊN BÀN GIAO<br>**TRƯỞNG NHÓM PHÁT TRIỂN AI**<br>*(Ký và ghi rõ họ tên)*<br><br><br><br>**Đỗ Cao Toàn** | ĐẠI DIỆN BÊN TIẾP NHẬN<br>**TM. ỦY BAN NHÂN DÂN PHƯỜNG BÌNH LONG**<br>*(Ký, đóng dấu và ghi rõ họ tên)*<br><br><br><br> |
| :---: | :---: |
