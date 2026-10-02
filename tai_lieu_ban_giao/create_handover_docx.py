import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_handover_document():
    doc = docx.Document()

    # Page setup - Standard A4 (Top 2cm, Bottom 2cm, Left 3cm, Right 2cm)
    for section in doc.sections:
        section.top_margin = Inches(0.79)     # 20mm
        section.bottom_margin = Inches(0.79)  # 20mm
        section.left_margin = Inches(1.18)    # 30mm
        section.right_margin = Inches(0.79)   # 20mm

    # Base Style Setting: Times New Roman
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(13)
    font.color.rgb = RGBColor(0, 0, 0)
    style.paragraph_format.line_spacing = 1.3
    style.paragraph_format.space_after = Pt(6)

    def set_font(run, size=13, bold=False, italic=False, color=(0, 0, 0)):
        run.font.name = 'Times New Roman'
        run.font.size = Pt(size)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = RGBColor(*color)
        rPr = run._element.get_or_add_rPr()
        rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>')
        rPr.append(rFonts)

    def add_p(text="", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, space_before=0, line_spacing=1.3):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            r = p.add_run(text)
            set_font(r)
        return p

    def add_heading_1(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        set_font(r, size=14, bold=True, color=(0, 50, 20))
        return p

    def add_heading_2(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        set_font(r, size=13, bold=True, color=(15, 80, 40))
        return p

    def add_heading_3(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        set_font(r, size=13, bold=True, italic=True)
        return p

    # ------------------ HEADER TABLE ------------------
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    col_widths = [Inches(3.2), Inches(3.5)]
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

    cell_left = table.cell(0, 0)
    p_left1 = cell_left.paragraphs[0]
    p_left1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_left1.paragraph_format.space_after = Pt(2)
    r1 = p_left1.add_run("Đoàn Trường ĐH Sư phạm Kỹ thuật TP.HCM\nĐỘI DỰ ÁN CÔNG NGHỆ SỐ")
    set_font(r1, size=11, bold=True)

    p_left2 = cell_left.add_paragraph()
    p_left2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_left2.paragraph_format.space_after = Pt(2)
    r2 = p_left2.add_run("Số: 01/BBBG-BDBL/2026\n--------")
    set_font(r2, size=11, italic=True)

    cell_right = table.cell(0, 1)
    p_right1 = cell_right.paragraphs[0]
    p_right1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_right1.paragraph_format.space_after = Pt(2)
    r3 = p_right1.add_run("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc")
    set_font(r3, size=12, bold=True)

    p_right2 = cell_right.add_paragraph()
    p_right2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_right2.paragraph_format.space_after = Pt(2)
    r4 = p_right2.add_run("Bình Long, ngày 03 tháng 10 năm 2026\n-------------------")
    set_font(r4, size=11, italic=True)

    add_p(space_after=12)

    # ------------------ TITLE ------------------
    p_title = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4)
    r_title = p_title.add_run("BIÊN BẢN VÀ HỒ SƠ BÀN GIAO KỸ THUẬT\nHỆ THỐNG TRÍ TUỆ NHÂN TẠO (AI) & TỰ ĐỘNG HÓA SỐ HÓA")
    set_font(r_title, size=15, bold=True, color=(0, 40, 20))

    p_sub = add_p(align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16)
    r_sub = p_sub.add_run("DỰ ÁN: BẢN ĐỒ SỐ DI TÍCH LỊCH SỬ VÀ VĂN HÓA PHƯỜNG BÌNH LONG (BÌNH LONG VR)\n"
                          "Nền tảng công nghệ: Trí tuệ nhân tạo (AI), Thực tế ảo 360°, Cloud Database")
    set_font(r_sub, size=12, italic=True)

    # ------------------ CĂN CỨ ------------------
    p_pre = add_p()
    r = p_pre.add_run("Căn cứ Kế hoạch liên tịch giữa Ủy ban Nhân dân Phường Bình Long và Đoàn Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh (HCMUTE) về việc triển khai công trình thanh niên chuyển đổi số di sản văn hóa;\n"
                      "Căn cứ Biên bản nghiệm thu kỹ thuật sản phẩm phần mềm 'Bản đồ số du lịch thực tế ảo Phường Bình Long' (Bình Long VR);\n"
                      "Hôm nay, ngày 03 tháng 10 năm 2026, tại trụ sở UBND Phường Bình Long, chúng tôi tiến hành bàn giao hồ sơ kỹ thuật, mã nguồn, mô hình Trí tuệ Nhân tạo (AI) và công cụ tự động hóa của dự án với các nội dung chi tiết như sau:")
    set_font(r, size=13)

    # ------------------ I. ĐẠI DIỆN CÁC BÊN ------------------
    add_heading_1("I. THÀNH PHẦN THAM GIA BÀN GIAO VÀ TIẾP NHẬN")
    
    add_heading_2("1. Đại diện Bên Bàn giao (Đội ngũ Phát triển Trí tuệ Nhân tạo & Phần mềm - HCMUTE):")
    p = add_p()
    r = p.add_run("- Đại diện Kỹ thuật & Trưởng nhóm AI: Đỗ Cao Toàn (Kỹ sư Công nghệ Phần mềm - AI Lead)\n"
                  "- Đơn vị công tác: Đoàn Trường Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh\n"
                  "- Email liên hệ: tctoan1024@gmail.com\n"
                  "- Nhiệm vụ: Chịu trách nhiệm thiết kế kiến trúc AI, thuật toán xử lý ảnh 360, pipeline âm thanh thần kinh và tích hợp hệ thống.")
    set_font(r, size=13)

    add_heading_2("2. Đại diện Bên Tiếp nhận (UBND Phường Bình Long):")
    p = add_p()
    r = p.add_run("- Đại diện Lãnh đạo: Thường trực Ủy ban Nhân dân Phường Bình Long\n"
                  "- Đại diện Ban Văn hóa - Thông tin & Đoàn Thanh niên Phường Bình Long\n"
                  "- Địa chỉ trụ sở: Phường Bình Long, Thành phố Đồng Nai\n"
                  "- Nhiệm vụ: Tiếp nhận, quản lý, khai thác dữ liệu số và duy trì vận hành nền tảng phục vụ nhân dân và du khách.")
    set_font(r, size=13)

    # ------------------ II. DANH MỤC CÁC PHÂN HỆ AI BÀN GIAO ------------------
    add_heading_1("II. NỘI DUNG VÀ CHI TIẾT BÀN GIAO CÁC PHÂN HỆ TRÍ TUỆ NHÂN TẠO (AI)")

    add_heading_2("1. Phân hệ AI 1: Hệ thống AI Xử lý Ảnh Thực tế ảo 360° (Rectilinear Perspective Unwarping)")
    p = add_p()
    r = p.add_run("• Mục đích kỹ thuật: Khắc phục hiện tượng méo cầu hình học của định dạng ảnh toàn cảnh Equirectangular 2:1. Khi hiển thị làm ảnh đại diện hoặc thumbnail, nếu cắt cúp thông thường các công trình di tích sẽ bị bẻ cong biến dạng.\n"
                  "• Thuật toán & Cơ chế hoạt động:\n"
                  "   - Sử dụng mô hình hình học máy ảnh ảo (Pinhole Camera Raycasting) kết hợp phép biến đổi tọa độ cầu sang tọa độ phẳng Decartes (Spherical to Cartesian 3D Projection).\n"
                  "   - Cho phép tinh chỉnh chính xác các tham số góc nhìn: Trường nhìn quang học (FOV: 80° - 85°), Góc xoay ngang (Yaw), Góc nâng hạ (Pitch) và Góc nghiêng (Roll).\n"
                  "   - Thuật toán nội suy song tuyến tính (Bilinear Interpolation) đảm bảo độ sắc nét cao, không nhòe biên và giữ nguyên màu sắc trung thực như chụp từ máy ảnh DSLR cao cấp.\n"
                  "• Vị trí tệp mã nguồn: automation/process_images.py\n"
                  "• Kết quả bàn giao: Xử lý hoàn chỉnh 60 ảnh panorama của 4 di tích, tự động sinh 4 ảnh đại diện phẳng chuẩn tỉ lệ 16:9 và 60 ảnh thumbnail (800x450px).")
    set_font(r, size=13)

    add_heading_2("2. Phân hệ AI 2: Hệ thống Giọng đọc Thuyết minh Tiếng Việt Thần kinh (Neural TTS Voice AI)")
    p = add_p()
    r = p.add_run("• Mục đích kỹ thuật: Tự động chuyển đổi văn bản nghiên cứu lịch sử thành file âm thanh thuyết minh chất lượng cao, ngữ điệu truyền cảm, âm sắc tự nhiên chuẩn tiếng Việt phục vụ tính năng Audio Guide trên bản đồ.\n"
                  "• Mô hình & Công nghệ:\n"
                  "   - Mô hình mạng nơ-ron học sâu Microsoft Edge Neural TTS (Deep Neural Speech Synthesis).\n"
                  "   - Voice Model: 'vi-VN-HoaiMyNeural' (Giọng nữ miền Nam/Trung chuẩn, thanh thoát, trang trọng, phù hợp phim tài liệu lịch sử).\n"
                  "   - Giao thức xử lý: Bất đồng bộ (Asyncio) qua gói edge-tts, hỗ trợ cấu hình tốc độ đọc, cao độ âm thanh và ngắt nhịp câu chuẩn ngữ pháp tiếng Việt.\n"
                  "• Vị trí tệp mã nguồn: automation/generate_audio.py\n"
                  "• Tệp âm thanh đã hoàn thiện: Lưu trữ tại automation/audio/ và đồng bộ lên Cloud Storage: dtt_thuyet_minh.mp3, m7n_thuyet_minh.mp3, m3000_thuyet_minh.mp3, hlt_thuyet_minh.mp3.")
    set_font(r, size=13)

    add_heading_2("3. Phân hệ AI 3: Hệ thống Trợ lý ảo AI & Chatbot Hướng dẫn viên Lịch sử (AI Heritage Assistant)")
    p = add_p()
    r = p.add_run("• Mục đích kỹ thuật: Đóng vai trò hướng dẫn viên du lịch số 24/7, hỗ trợ người dân và du khách giải đáp mọi thắc mắc về lịch sử Bình Long, sự kiện 32 ngày đêm An Lộc 1972, tiểu sử anh hùng liệt sĩ và thông tin chỉ đường.\n"
                  "• Kiến trúc giải pháp:\n"
                  "   - Hệ thống Prompt Engineering chuyên sâu định hình tính cách: Lễ phép, am hiểu tường tận văn hóa địa phương, tôn trọng lịch sử và văn phong trang nghiêm.\n"
                  "   - Cơ chế RAG (Retrieval-Augmented Generation): Nạp toàn bộ kho tri thức chuẩn hóa (dataset.json) làm ngữ cảnh chính xác, ngăn chặn hiện tượng bịa đặt thông tin (AI Hallucination).\n"
                  "   - Hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Anh) cho du khách quốc tế.")
    set_font(r, size=13)

    add_heading_2("4. Phân hệ AI 4: Pipeline Tự động hóa Dữ liệu Toàn diện (Data Automation Pipeline)")
    p = add_p()
    r = p.add_run("• Mục đích: Cho phép quản trị viên cập nhật thêm di tích mới hoặc sửa đổi nội dung thuyết minh chỉ với một thao tác thực thi script duy nhất.\n"
                  "• Quy trình thực thi tuần tự tự động:\n"
                  "   Bước 1: Nạp cấu hình & kiểm tra tính toàn vẹn dữ liệu từ automation/dataset.py và automation/config.py.\n"
                  "   Bước 2: Kích hoạt AI Neural TTS sinh tệp âm thanh thuyết minh mới.\n"
                  "   Bước 3: Thuật toán AI Unwarping tính toán và kết xuất ảnh phẳng 16:9 cùng thumbnail đa độ phân giải.\n"
                  "   Bước 4: Tự động kết nối cơ sở dữ liệu Supabase (Service Role Key), dọn dẹp dữ liệu cũ, tải media lên Cloud Storage bucket 'APP_IMAGES/25/...' và upsert dữ liệu có cấu trúc vào bảng 'hotspots' và 'panoramas'.\n"
                  "• Tệp thực thi trung tâm: automation/run_all.py và automation/fill_data.py.")
    set_font(r, size=13)

    add_heading_2("5. Phân hệ AI 5: Bộ Nhận diện Thương hiệu & Tài nguyên Đồ họa 3D Clay UI")
    p = add_p()
    r = p.add_run("• Được thiết kế và đồng bộ hóa bằng AI theo ngôn ngữ thiết kế HCMUTE 3D Clay Style (Green Edition):\n"
                  "   - Tông màu chủ đạo: Xanh ngọc lục bảo Emerald (#059669), Xanh lá tươi Mint (#10B981) và Vàng ánh kim (#F59E0B).\n"
                  "   - Bộ biểu tượng 3D tương tác: Kính VR AI, ghim bản đồ 3D, thư mục lưu trữ di tích, tai nghe thuyết minh âm thanh.\n"
                  "   - Bộ nút điều hướng 3D Vista (20 nút Pill Badges viền kim loại vàng bóng, nền ngọc bích, định dạng APNG).\n"
                  "• Vị trí tệp sinh tự động: automation/generate_3dvista_assets.py và automation/generate_apng_hotspots.py.")
    set_font(r, size=13)

    # ------------------ III. BẢNG KIỂM KÊ TÀI NGUYÊN ------------------
    add_heading_1("III. BẢNG KIỂM KÊ CHI TIẾT TÀI NGUYÊN VÀ THÔNG SỐ KỸ THUẬT")

    # Table with borders
    tbl = doc.add_table(rows=1, cols=4)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    widths = [Inches(0.6), Inches(2.2), Inches(2.7), Inches(1.5)]
    headers = ["STT", "Hạng mục bàn giao", "Quy cách kỹ thuật / Đường dẫn", "Trạng thái"]
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].width = widths[i]
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        set_font(r, size=11, bold=True)
        # Background color header
        tcPr = hdr_cells[i]._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="E2F0D9"/>')
        tcPr.append(shd)

    data_rows = [
        ("1", "Mã nguồn Pipeline AI", "automation/ (dataset.py, generate_audio.py, process_images.py, fill_data.py)", "Hoàn thành 100%"),
        ("2", "Mô hình Giọng đọc AI", "Microsoft Edge Neural TTS (vi-VN-HoaiMyNeural) - Audio MP3 320kbps", "Hoàn thành 100%"),
        ("3", "Thuật toán Unwarping 360", "Pinhole Camera Raycasting (Perspective Rectilinear 16:9)", "Đạt chuẩn 4K"),
        ("4", "Dataset 4 Di tích Số hóa", "automation/dataset.json (60 Panoramas, 4 Hotspots, GPS, tư liệu)", "Đã kiểm định"),
        ("5", "Dữ liệu Đám mây Supabase", "Database PostgreSQL (Area ID: 25) & Cloud Storage Bucket APP_IMAGES", "Hoạt động ổn định"),
        ("6", "Hệ thống Web Frontend", "React 19, TypeScript, Vite, TailwindCSS, MapLibre GL, 3DVista Player", "Đang vận hành"),
        ("7", "Bộ Poster & Infographic", "Poster quảng cáo, Poster hướng dẫn sử dụng, Mockup Showcase", "Đã xuất file in"),
        ("8", "Tài liệu kỹ thuật & API", "Tài liệu cấu hình, biến môi trường, hướng dẫn cập nhật dữ liệu", "Đầy đủ"),
    ]

    for row_data in data_rows:
        row_cells = tbl.add_row().cells
        for i, text in enumerate(row_data):
            row_cells[i].width = widths[i]
            p = row_cells[i].paragraphs[0]
            if i in [0, 3]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            r = p.add_run(text)
            set_font(r, size=11)

    # Set table borders XML
    tblPr = tbl._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            '<w:top w:val="single" w:sz="6" w:space="0" w:color="059669"/>'
            '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="059669"/>'
            '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>'
            '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>'
            '<w:left w:val="none"/>'
            '<w:right w:val="none"/>'
            '</w:tblBorders>'
        )
        tblPr[0].append(borders)

    add_p(space_after=8)

    # ------------------ IV. HƯỚNG DẪN VẬN HÀNH ------------------
    add_heading_1("IV. HƯỚNG DẪN VẬN HÀNH VÀ BẢO TRÌ HỆ THỐNG AI")

    add_heading_2("1. Yêu cầu môi trường thực thi (System Prerequisites):")
    p = add_p()
    r = p.add_run("• Hệ điều hành: Linux (Ubuntu 20.04+), macOS hoặc Windows 10/11 có cài Python 3.9+.\n"
                  "• Các thư viện Python phụ thuộc (được liệt kê trong automation/requirements.txt):\n"
                  "   pip install -r automation/requirements.txt\n"
                  "   (Bao gồm: edge-tts, Pillow, numpy, requests, supabase, openpyxl, python-docx).")
    set_font(r, size=13)

    add_heading_2("2. Quy trình 3 bước cập nhật hoặc nạp thêm di tích mới:")
    p = add_p()
    r = p.add_run("• Bước 1: Khai báo thông tin di tích mới vào tệp automation/dataset.py (bao gồm tên gọi, địa chỉ, tọa độ GPS, nội dung văn bản thuyết minh và danh sách ảnh panorama 360° tương ứng đặt trong thư mục raw tương ứng).\n"
                  "• Bước 2: Kích hoạt bộ công cụ tự động hóa toàn phần:\n"
                  "   python automation/run_all.py\n"
                  "   (Hệ thống AI sẽ tự động đọc văn bản, sinh âm thanh, khử méo ảnh và tạo thumbnail trong vài phút).\n"
                  "• Bước 3: Đồng bộ dữ liệu lên máy chủ đám mây:\n"
                  "   python automation/fill_data.py\n"
                  "   (Dữ liệu trên ứng dụng web và tour 360 sẽ ngay lập tức được cập nhật mà không cần biên dịch lại mã nguồn web).")
    set_font(r, size=13)

    add_heading_2("3. Thông tin bảo mật và Quản trị Khóa API:")
    p = add_p()
    r = p.add_run("• Toàn bộ khóa bảo mật Supabase Service Role Key và Goong Map API đã được cấu hình an toàn trong automation/config.py.\n"
                  "• Khuyến nghị Bên Tiếp nhận lưu trữ cẩn mật các khóa bí mật này và định kỳ thay đổi mật khẩu tài khoản quản trị.")
    set_font(r, size=13)

    # ------------------ V. CAM KẾT & KÝ TÊN ------------------
    add_heading_1("V. CAM KẾT BẢO HÀNH VÀ HỖ TRỢ KỸ THUẬT")
    p = add_p()
    r = p.add_run("1. Đội ngũ phát triển (HCMUTE) cam kết bảo hành kỹ thuật, hỗ trợ sửa lỗi phát sinh liên quan đến hệ thống AI và mã nguồn tự động hóa trong thời gian 12 tháng kể từ ngày ký biên bản bàn giao.\n"
                  "2. Hỗ trợ đào tạo, tập huấn kỹ thuật chuyển giao công nghệ cho cán bộ phụ trách CNTT của UBND Phường Bình Long.\n"
                  "3. Biên bản này được lập thành 04 (bốn) bản có giá trị pháp lý như nhau; Bên Bàn giao giữ 02 bản, Bên Tiếp nhận giữ 02 bản để cùng theo dõi và phối hợp thực hiện.")
    set_font(r, size=13)

    add_p(space_after=14)

    # Signatures Table
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    for row in sig_table.rows:
        row.cells[0].width = Inches(3.4)
        row.cells[1].width = Inches(3.4)

    c0 = sig_table.cell(0, 0)
    p0 = c0.paragraphs[0]
    p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sig0 = p0.add_run("ĐẠI DIỆN BÊN BÀN GIAO\nTRƯỞNG NHÓM PHÁT TRIỂN AI & CÔNG NGHỆ\n(Ký và ghi rõ họ tên)\n\n\n\n\n\nĐỗ Cao Toàn")
    set_font(r_sig0, size=12, bold=True)

    c1 = sig_table.cell(0, 1)
    p1 = c1.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sig1 = p1.add_run("ĐẠI DIỆN BÊN TIẾP NHẬN\nTM. ỦY BAN NHÂN DÂN PHƯỜNG BÌNH LONG\n(Ký, đóng dấu và ghi rõ họ tên)\n\n\n\n\n\n")
    set_font(r_sig1, size=12, bold=True)

    output_path = "/Users/macos/bandosobinhlong/binhlong-vr/tai_lieu_ban_giao/bien_ban_ban_giao_ai.docx"
    doc.save(output_path)
    print(f"Document successfully created at {output_path}")

if __name__ == "__main__":
    create_handover_document()
