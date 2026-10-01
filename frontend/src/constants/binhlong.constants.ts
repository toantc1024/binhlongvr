import type { Area } from "../types/area.service.type";
import type { Hotspot } from "../types/hotspots.service.type";
import type { Panorama } from "../types/panoramas.service.type";

export const BINHLONG_AREA: Area = {
  area_id: "25",
  area_name: "Thị xã Bình Long, Bình Phước",
  domain: "bandosobinhlong.vn",
  main_hotspot_id: "132",
  description: "Bản đồ số Di tích Lịch sử và Văn hóa Thị xã Bình Long, Tỉnh Bình Phước",
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
    address: "Phường Phú Đức, Thị xã Bình Long, Tỉnh Bình Phước",
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
    address: "Khu phố Bình An, Phường An Lộc, Thị xã Bình Long, Tỉnh Bình Phước",
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
    address: "Đường Phạm Ngọc Thạch, Phường An Lộc, Thị xã Bình Long, Tỉnh Bình Phước",
    website: null,
    geolocation: { lon: 106.6057461, lat: 11.6491817 },
    preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/hotspots/hotspot_132_preview.jpg",
    click_panorama_id: "M3000_0_FLYCAM_2",
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
    address: "Khu phố Phú Trọng, Phường Phú Đức, Thị xã Bình Long, Tỉnh Bình Phước",
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
  // DTT Panoramas
  { panorama_id: "DTT_0_FLYCAM", hotspot_id: 130, title: "Toàn cảnh Dinh Tỉnh Trưởng (Flycam 360°)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_0_FLYCAM_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_1_CONG", hotspot_id: 130, title: "Cổng chính Dinh Tỉnh Trưởng", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_1_CONG_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "DTT_2_SAN", hotspot_id: 130, title: "Khuôn viên sân trước Dinh Tỉnh Trưởng", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_DTT_2_SAN_preview.jpg", created_at: new Date().toISOString() },

  // M7N Panoramas
  { panorama_id: "M7N_0_FLYCAM", hotspot_id: 131, title: "Toàn cảnh Khu Di tích Mộ 7 Người (Flycam 360°)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_0_FLYCAM_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M7N_1_CONG", hotspot_id: 131, title: "Cổng chính và khuôn viên tưởng niệm", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_1_CONG_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M7N_2_BIA", hotspot_id: 131, title: "Bia ghi danh Di tích Lịch sử Mộ tập thể", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M7N_2_BIA_preview.jpg", created_at: new Date().toISOString() },

  // M3000 Panoramas
  { panorama_id: "M3000_0_FLYCAM_2", hotspot_id: 132, title: "Toàn cảnh Tượng đài và Khuôn viên (Flycam 360°)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_0_FLYCAM_2_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_2_CONG_CHINH", hotspot_id: 132, title: "Cổng chính Khu di tích Quốc gia", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_2_CONG_CHINH_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "M3000_6", hotspot_id: 132, title: "Đài tưởng niệm chính cao 12,6m", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_M3000_6_preview.jpg", created_at: new Date().toISOString() },

  // HLT Panoramas
  { panorama_id: "HLT_0_FLYCAM", hotspot_id: 133, title: "Toàn cảnh Chùa Hưng Lập Tự (Flycam 360°)", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_0_FLYCAM_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2", hotspot_id: 133, title: "Tiền sảnh chính điện Chùa Hưng Lập Tự", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_preview.jpg", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_31", hotspot_id: 133, title: "Lối vào Phòng thuốc Nam Phước thiện", preview_image: "https://jmeiegtjrrdeubwzgder.supabase.co/storage/v1/object/public/APP_IMAGES/25/panoramas/pan_HLT_2_31_preview.jpg", created_at: new Date().toISOString() },
];
