import type { Area } from "../types/area.service.type";
import type { Hotspot } from "../types/hotspots.service.type";
import type { Panorama } from "../types/panoramas.service.type";

export const BINHLONG_AREA: Area = {
  area_id: "25",
  area_name: "Phường Bình Long, TP. Đồng Nai",
  domain: "bandosobinhlong.vn",
  main_hotspot_id: "132",
  description: "Bản đồ số Di tích Lịch sử và Văn hóa Phường Bình Long, Thành phố Đồng Nai",
  is_active: true,
};

export const BINHLONG_HOTSPOTS: Hotspot[] = [
  {
    id: "130",
    hotspot_id: 130,
    area_id: 25,
    title: "Di tích Lịch sử Dinh Tỉnh Trưởng Bình Long",
    description:
      "Dinh Tỉnh Trưởng Bình Long (Di tích lịch sử Nhà và Đường hầm An Lộc) là cơ quan đầu não thời chính quyền Sài Gòn với hệ thống công sự, lô cốt và đường hầm ngầm kiên cố trong chiến dịch mùa hè 1972.",
    address: "Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.607088, lat: 11.652378 },
    preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/hotspots/hotspot_130_preview.jpg",
    click_panorama_id: "DTT_0_FLYCAM",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/audio/dtt_thuyet_minh.mp3"
    },
    documents: null,
    assets: [],
  },
  {
    id: "131",
    hotspot_id: 131,
    area_id: 25,
    title: "Di tích Lịch sử Mộ tập thể Lực lượng vũ trang An ninh An Lộc (Mộ 7 Người)",
    description:
      "Nơi an nghỉ và ghi dấu sự hy sinh anh dũng kiên cường của 7 cán bộ chiến sĩ Đội An ninh vũ trang An Lộc năm 1971 trong kháng chiến chống Mỹ cứu nước. Di tích Lịch sử cấp Tỉnh.",
    address: "Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.6057152, lat: 11.6583201 },
    preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/hotspots/hotspot_131_preview.jpg",
    click_panorama_id: "M7N_0_FLYCAM",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/audio/m7n_thuyet_minh.mp3"
    },
    documents: null,
    assets: [],
  },
  {
    id: "132",
    hotspot_id: 132,
    area_id: 25,
    title: "Di tích Lịch sử Quốc gia Mộ 3.000 người An Lộc",
    description:
      "Nơi ghi dấu nỗi đau thương chiến tranh và sự hy sinh to lớn của hơn 3.000 đồng bào tử nạn trong 32 ngày đêm chiến sự năm 1972. Di tích Lịch sử - Văn hóa cấp Quốc gia.",
    address: "Đường Phạm Ngọc Thạch, Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.6057461, lat: 11.6491817 },
    preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/hotspots/hotspot_132_preview.jpg",
    click_panorama_id: "M3000_0_FLYCAM_1",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/audio/m3000_thuyet_minh.mp3"
    },
    documents: null,
    assets: [],
  },
  {
    id: "133",
    hotspot_id: 133,
    area_id: 25,
    title: "Di tích Lịch sử - Văn hóa Chùa Hưng Lập Tự",
    description:
      "Ngôi chùa cổ kính thuộc Tịnh độ Cư sĩ Phật hội Việt Nam, nổi tiếng với truyền thống y đạo bác ái của Phòng thuốc Nam Phước thiện khám chữa bệnh miễn phí cho nhân dân suốt nhiều thập kỷ.",
    address: "Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.6117306, lat: 11.6480133 },
    preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/hotspots/hotspot_133_preview.jpg",
    click_panorama_id: "HLT_0_FLYCAM",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/audio/hlt_thuyet_minh.mp3"
    },
    documents: null,
    assets: [],
  },
];

export const BINHLONG_PANORAMAS: Panorama[] = [
  // DTT Panoramas (11 items)
  { panorama_id: "DTT_0_FLYCAM", hotspot_id: 130, title: "Toàn cảnh Dinh Tỉnh Trưởng (Flycam 360°)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_0_FLYCAM_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_1_CONG", hotspot_id: 130, title: "Cổng chính Dinh Tỉnh Trưởng", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_1_CONG_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_2_SAN", hotspot_id: 130, title: "Khuôn viên sân trước Dinh Tỉnh Trưởng", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_2_SAN_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_3_GIUA", hotspot_id: 130, title: "Khu vực tiền sảnh trung tâm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_3_GIUA_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_3_PHAI", hotspot_id: 130, title: "Khuôn viên cánh phải", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_3_PHAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_3_TRAI", hotspot_id: 130, title: "Khuôn viên cánh trái", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_3_TRAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_4", hotspot_id: 130, title: "Không gian trưng bày tư liệu lịch sử", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_4_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_5", hotspot_id: 130, title: "Lối vào hệ thống hầm công sự chỉ huy", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_5_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_6", hotspot_id: 130, title: "Bên trong đường hầm kiên cố", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_6_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_7", hotspot_id: 130, title: "Hành lang kết nối hầm ngầm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_7_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_8", hotspot_id: 130, title: "Cửa thoát hiểm và công sự bảo vệ", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_8_preview.jpg", created_at: new Date().toISOString() },
  // M7N Panoramas (5 items)
  { panorama_id: "M7N_0_FLYCAM", hotspot_id: 131, title: "Toàn cảnh Khu Di tích Mộ 7 Người (Flycam 360°)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_0_FLYCAM_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M7N_1_CONG", hotspot_id: 131, title: "Cổng chính và khuôn viên tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_1_CONG_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M7N_2_BIA", hotspot_id: 131, title: "Bia ghi danh Di tích Lịch sử Mộ tập thể", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_2_BIA_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M7N_3_SAN", hotspot_id: 131, title: "Khu vực sân hành lễ và đền thờ tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_3_SAN_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M7N_4_MO", hotspot_id: 131, title: "Khu phần mộ các anh hùng liệt sĩ", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_4_MO_preview.jpg", created_at: new Date().toISOString() },
  // M3000 Panoramas (22 items)
  { panorama_id: "M3000_0_FLYCAM_1", hotspot_id: 132, title: "Toàn cảnh Di tích Mộ 3.000 người (Góc Flycam 1)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_0_FLYCAM_1_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_0_FLYCAM_2", hotspot_id: 132, title: "Toàn cảnh Tượng đài và Khuôn viên (Góc Flycam 2)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_0_FLYCAM_2_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_1_CONG_PHU", hotspot_id: 132, title: "Cổng phụ vào khu di tích", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_1_CONG_PHU_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_2_CONG_CHINH", hotspot_id: 132, title: "Cổng chính Khu di tích Quốc gia", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_2_CONG_CHINH_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_3", hotspot_id: 132, title: "Sân tiền sảnh tượng đài", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_3_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_4", hotspot_id: 132, title: "Lối dẫn vào khu nhà bia tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_4_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_5", hotspot_id: 132, title: "Khuôn viên hoa viên trung tâm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_5_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_6", hotspot_id: 132, title: "Đài tưởng niệm chính cao 12,6m", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_6_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_7_NHA_GIUA", hotspot_id: 132, title: "Gian chính Nhà bia tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_7_NHA_GIUA_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_7_NHA_PHAI", hotspot_id: 132, title: "Gian cánh phải Nhà bia tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_7_NHA_PHAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_7_NHA_TRAI", hotspot_id: 132, title: "Gian cánh trái Nhà bia tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_7_NHA_TRAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_8", hotspot_id: 132, title: "Không gian trưng bày hình ảnh lịch sử An Lộc 1972", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_8_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_9_GIUA", hotspot_id: 132, title: "Khu vực mộ tập thể trung tâm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_9_GIUA_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_9_PHAI", hotspot_id: 132, title: "Khu vực mộ tập thể phía hữu", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_9_PHAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_9_TRAI", hotspot_id: 132, title: "Khu vực mộ tập thể phía tả", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_9_TRAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_10", hotspot_id: 132, title: "Hành lang tưởng niệm các nạn nhân chiến tranh", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_10_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_11_PHAI", hotspot_id: 132, title: "Khuôn viên lưu niệm phía đông", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_11_PHAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_11_TRAI", hotspot_id: 132, title: "Khuôn viên lưu niệm phía tây", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_11_TRAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_12_GIUA", hotspot_id: 132, title: "Toàn cảnh cụm bia ghi danh tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_12_GIUA_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_12_PHAI", hotspot_id: 132, title: "Hàng cây xanh và lối dạo tĩnh mịch (Phải)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_12_PHAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_12_TRAI", hotspot_id: 132, title: "Hàng cây xanh và lối dạo tĩnh mịch (Trái)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_12_TRAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_13", hotspot_id: 132, title: "Khu vực tiếp đón khách và vườn lưu niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_13_preview.jpg", created_at: new Date().toISOString() },
  // HLT Panoramas (22 items)
  { panorama_id: "HLT_0_FLYCAM", hotspot_id: 133, title: "Toàn cảnh Chùa Hưng Lập Tự (Flycam 360°)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_0_FLYCAM_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_1_PHAI", hotspot_id: 133, title: "Cổng chính và khuôn viên phía phải chùa", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_1_PHAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_1_TRAI", hotspot_id: 133, title: "Cổng chính và khuôn viên phía trái chùa", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_1_TRAI_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2", hotspot_id: 133, title: "Tiền sảnh chính điện Chùa Hưng Lập Tự", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_1", hotspot_id: 133, title: "Khuôn viên sân Chánh điện", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_1_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_2", hotspot_id: 133, title: "Bên trong Chánh điện tôn nghiêm (Góc 1)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_2_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_3", hotspot_id: 133, title: "Bên trong Chánh điện tôn nghiêm (Góc 2)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_3_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_4", hotspot_id: 133, title: "Bàn thờ Đức Phật và chư vị tiền hiền", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_4_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_11", hotspot_id: 133, title: "Khu vực giảng đường sinh hoạt đạo tràng", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_11_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_12", hotspot_id: 133, title: "Hành lang kết nối các gian thờ", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_12_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_13", hotspot_id: 133, title: "Khuôn viên nhà Hậu Tổ", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_13_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_31", hotspot_id: 133, title: "Lối vào Phòng thuốc Nam Phước thiện", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_31_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_32P", hotspot_id: 133, title: "Phòng khám và chẩn trị y học cổ truyền (Phải)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_32P_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_32T", hotspot_id: 133, title: "Phòng khám và chẩn trị y học cổ truyền (Trái)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_32T_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_33", hotspot_id: 133, title: "Khu vực bào chế và bốc thuốc Nam từ thiện", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_33_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_33P", hotspot_id: 133, title: "Kho lưu trữ thảo dược thuốc Nam (Cánh phải)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_33P_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_33T", hotspot_id: 133, title: "Kho lưu trữ thảo dược thuốc Nam (Cánh trái)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_33T_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_34", hotspot_id: 133, title: "Sân phơi thảo dược y học dân tộc", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_34_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_35", hotspot_id: 133, title: "Khu nhà ăn và sinh hoạt từ thiện cộng đồng", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_35_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_41", hotspot_id: 133, title: "Không gian tĩnh tâm và hoa viên thanh tịnh", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_41_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_3", hotspot_id: 133, title: "Khu tháp mộ chư vị tiền bối sư trụ trì", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_3_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_4", hotspot_id: 133, title: "Vườn cây bồ đề và cảnh quan sinh thái tự nhiên", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_4_preview.jpg", created_at: new Date().toISOString() },
];
