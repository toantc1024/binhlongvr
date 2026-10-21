# HỆ THỐNG TÀI LIỆU, POSTER & MÃ QR BÀN GIAO
## Dự Án Bản Đồ Số Di Tích Bình Long VR (`https://binhlongvr.vercel.app/`)

Thư mục này chứa đầy đủ các tài liệu bàn giao, ấn phẩm truyền thông và mã QR phục vụ công tác vận hành, in ấn và quảng bá dự án Bản Đồ Số Bình Long VR do **UBND Thị xã Bình Long - Phường An Lộc** phối hợp cùng **Đội ngũ Kỹ thuật HCMUTE** thực hiện.

---

### 1. Poster Giới Thiệu Ứng Dụng (Poster Intro)
Poster kết hợp giao diện thực tế của ứng dụng (Bản đồ số GIS, Không gian 360°, Trợ lý AI), ảnh chụp thực tế các di tích và nhân vật Chibi Thanh Niên Bình Long chào mừng:

- **Poster Ngang (A3 / A4 / Màn hình trình chiếu)**:
  - Bản xem & in Web: [poster_intro_app.html](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/poster_intro/poster_intro_app.html)
  - File ảnh chất lượng cao: [poster_intro_binhlong_vr.png](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/poster_intro/poster_intro_binhlong_vr.png)
- **Standee Đứng (Roll-up Banner đặt tại cổng di tích / sự kiện)**:
  - Bản xem & in Web: [poster_standee_vertical.html](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/poster_intro/poster_standee_vertical.html)
  - File ảnh chất lượng cao: [poster_standee_vertical.png](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/poster_intro/poster_standee_vertical.png)

---

### 2. Bộ Mã QR Bản Đồ Số Bình Long (100% Verified Scannable)
Tất cả các mã QR đều được kiểm tra quét tự động hướng tới địa chỉ `https://binhlongvr.vercel.app/`:

| Tên File | Định Dạng | Mô Tả & Mục Đích Sử Dụng |
| :--- | :---: | :--- |
| [qr_binhlong_transparent.png](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/qr_codes/qr_binhlong_transparent.png) | PNG trong suốt | Nền trong suốt, mắt mã xanh ngọc đậm; dán lên nền sáng/tài liệu |
| [qr_binhlong_transparent_white.png](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/qr_codes/qr_binhlong_transparent_white.png) | PNG trong suốt | Mắt mã trắng sáng; dán lên hình ảnh tối màu, video hoặc banner tối |
| [qr_binhlong_standard.png](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/qr_codes/qr_binhlong_standard.png) | PNG | Chuẩn độ tương phản cao có viền an toàn và logo ứng dụng |
| [qr_binhlong_card_light.png](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/qr_codes/qr_binhlong_card_light.png) | PNG | Thẻ in để bàn / bảng quét mã QR nền sáng cho quầy thông tin |
| [qr_binhlong_card_dark.png](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/qr_codes/qr_binhlong_card_dark.png) | PNG | Thẻ thiết kế phong cách ban đêm (Dark Mode) đồng bộ nhận diện app |
| [qr_binhlong_vector.svg](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/qr_codes/qr_binhlong_vector.svg) | SVG | File vector phóng to vô hạn cho in ấn bạt pano khổ lớn |

*Ghi chú: Kịch bản sinh và kiểm thử tự động lưu tại [generate_qr_codes.py](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/qr_codes/generate_qr_codes.py).*

---

### 3. Tài Liệu Bàn Giao Kỹ Thuật (Ít Chữ, Hình Ảnh HDSD Trực Quan)
Tài liệu hướng dẫn vận hành 5 bước trực quan bằng hình ảnh chụp thực tế và biên bản nghiệm thu bàn giao:

- **Bản Web Tương Tác & In Ấn Trực Tiếp**:
  - Mở xem: [index.html](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/tai_lieu_ban_giao_ky_thuat/index.html)
- **Bản PDF Đã Xuất Sẵn**:
  - Tải về: [tai_lieu_ban_giao_ky_thuat.pdf](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/tai_lieu_ban_giao_ky_thuat/tai_lieu_ban_giao_ky_thuat.pdf)
- **Bản Markdown Gọn Nhẹ**:
  - Đọc nhanh: [tai_lieu_ban_giao_ky_thuat.md](file:///Users/macos/bandosobinhlong/binhlong-vr/documents/tai_lieu_ban_giao_ky_thuat/tai_lieu_ban_giao_ky_thuat.md)

#### 5 Bước Vận Hành Trực Quan Tóm Tắt:
1. **Bước 1**: Quét mã QR hoặc truy cập trực tiếp `https://binhlongvr.vercel.app/`
2. **Bước 2**: Mở Bản đồ số GIS & chọn 1 trong 4 điểm di tích trọng điểm
3. **Bước 3**: Trải nghiệm xoay lật 360°, thu phóng cận cảnh hiện vật
4. **Bước 4**: Chạm Hotspot tương tác và chuyển cảnh khám phá địa đạo ngầm
5. **Bước 5**: Lắng nghe audio thuyết minh tự động và hỏi đáp cùng Trợ lý Lịch sử AI
