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
    title: 'Di tích Lịch sử: An Lộc "Nhà và Đường hầm" (Dinh Tỉnh Trưởng Bình Long)',
    description:
      'Di tích: An Lộc "Nhà và Đường hầm" (Dinh Tỉnh Trưởng Bình Long) là công trình kiến trúc và quân sự tiêu biểu tọa lạc tại Khu phố Phú Đức, Phường Bình Long, Thành phố Đồng Nai. Ngôi nhà được xây dựng năm 1920 dùng làm trụ sở điều hành việc khai thác mủ cao su ở Bình Long. Sau Hiệp định Geneve năm 1954, chính quyền Ngô Đình Diệm thành lập chính quyền Việt Nam Cộng hòa. Ngày 22/10/1956, tỉnh Bình Long được thành lập gồm ba quận: An Lộc, Chơn Thành và Lộc Ninh. Do có vị trí chiến lược quan trọng, ngôi nhà được lựa chọn làm nơi đặt cơ quan đầu não của chính quyền đương thời tại tỉnh Bình Long và được gọi là Dinh Tỉnh trưởng. Từ năm 1957 đến năm 1974 có 8 đời Tỉnh Trưởng đã làm việc trong căn nhà này. Đây không chỉ là trụ sở hành chính mà còn là một địa điểm có vai trò quan trọng trong việc tổ chức, điều hành các hoạt động quân sự và chính trị. Nhằm phục vụ phòng thủ và chỉ huy, công trình đã được kiên cố hóa với hệ thống công sự, lô cốt và đường hầm ngầm kiên cố. Trong chiến sự mùa hè năm 1972, An Lộc là địa bàn diễn ra nhiều trận đánh ác liệt và Dinh Tỉnh trưởng là một trong những điểm tác chiến then chốt. Sau ngày giải phóng, Dinh Tỉnh trưởng từng được sử dụng làm nơi làm việc của các cơ quan Đảng và Nhà nước. Di tích được xếp hạng Di tích Lịch sử cấp Tỉnh vào năm 1980.',
    address: "Khu phố Phú Đức, Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.607088, lat: 11.652378 },
    preview_image: "/landmarks/dtt_preview.jpg",
    click_panorama_id: "DTT_0_FLYCAM",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "/audio/dtt_thuyet_minh.mp3"
    },
    documents: null,
    assets: [
      {
        asset_id: "dtt_asset_1",
        title: "Tòa nhà Dinh Tỉnh Trưởng Bình Long (Mặt tiền kiến trúc Pháp)",
        description: "Kiến trúc Pháp nguyên bản xây dựng từ năm 1920 tại Bình Long, từng là trụ sở làm việc của 8 đời Tỉnh trưởng và cơ quan chỉ huy quân sự.",
        image_url: "/landmarks/dtt_exterior.jpg",
        panorama_id: "DTT_2_SAN"
      },
      {
        asset_id: "dtt_asset_2",
        title: "Khuôn viên Dinh Tỉnh Trưởng và Cổng chính",
        description: "Góc nhìn toàn cảnh khuôn viên Dinh Tỉnh Trưởng Bình Long (Di tích Lịch sử Nhà và Đường hầm An Lộc).",
        image_url: "/landmarks/dtt_preview.jpg",
        panorama_id: "DTT_1_CONG"
      }
    ],
  },
  {
    id: "131",
    hotspot_id: 131,
    area_id: 25,
    title: "Di tích Lịch sử Mộ tập thể Lực lượng vũ trang An ninh An Lộc (Mộ 7 Người)",
    description:
      "Di tích Mộ tập thể Lực lượng vũ trang An ninh An Lộc (thường được người dân địa phương gọi thân thương là Di tích Mộ 7 người) tọa lạc tại Khu phố Bình An, Phường Bình Long, Thành phố Đồng Nai. Nơi đây là nơi an nghỉ và tưởng niệm các chiến sĩ kiên trung thuộc Đội An ninh vũ trang An Lộc đã anh dũng hy sinh trong cuộc kháng chiến chống Mỹ cứu nước. Vào ngày 08/07/1970, đoàn công tác gồm 7 đồng chí đang làm nhiệm vụ bám trụ địa bàn thì bị địch phát hiện và phục kích, 03 chiến sĩ anh dũng hy sinh và 4 đồng chí bị thương; kẻ thù đã tàn bạo dùng xe Jeep kéo lê thi thể các liệt sĩ thị uy rồi ném xuống giếng sâu của một người dân làm rẫy. Đến ngày 27/07/1970, tiếp tục có 03 đồng chí hy sinh khi làm nhiệm vụ và bị giặc ném xuống miệng giếng này. Sau ngày non sông thống nhất, nhân dân Bình Long đã xây dựng khu vực này thành mộ tập thể trang nghiêm để tri ân công đức. Ngày 15/12/2011, UBND tỉnh đã ban hành Quyết định số 2764 công nhận Mộ tập thể liệt sĩ lực lượng vũ trang An ninh An Lộc xếp hạng Di tích Lịch sử - Văn hóa cấp Tỉnh.",
    address: "Khu phố Bình An, Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.6057152, lat: 11.6583201 },
    preview_image: "/landmarks/m7n_preview.jpg",
    click_panorama_id: "M7N_0_FLYCAM",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "/audio/m7n_thuyet_minh.mp3"
    },
    documents: null,
    assets: [
      {
        asset_id: "m7n_asset_1",
        title: "Khuôn viên và Nhà bia Tưởng niệm Mộ 7 Người",
        description: "Khuôn viên tưởng niệm trang nghiêm 7 cán bộ, chiến sĩ Đội An ninh vũ trang An Lộc anh dũng hy sinh năm 1970.",
        image_url: "/landmarks/m7n_preview.jpg",
        panorama_id: "M7N_1_CONG"
      },
      {
        asset_id: "m7n_asset_2",
        title: "Bia ghi danh Di tích Lịch sử Mộ tập thể Lực lượng vũ trang An ninh An Lộc",
        description: "Bia tưởng niệm khắc ghi chiến công anh dũng và sự hy sinh bất khuất của các liệt sĩ an ninh vũ trang vì độc lập tự do của Tổ quốc.",
        image_url: "/landmarks/m7n_monument.jpg",
        panorama_id: "M7N_2_BIA"
      }
    ],
  },
  {
    id: "132",
    hotspot_id: 132,
    area_id: 25,
    title: "Di tích Lịch sử cấp Quốc gia Mộ 3.000 người An Lộc",
    description:
      "Di tích lịch sử Quốc gia: Mộ 3.000 đồng bào bị Đế quốc Mỹ tàn sát ngày 03/10/1972 (còn gọi là Mộ tập thể 3.000 người), tọa lạc tại Khu phố An Lộc, Phường Bình Long, Thành phố Đồng Nai. Ngày 07/04/1972, khi Lộc Ninh được hoàn toàn giải phóng, quân ta tấn công như vũ bão nhằm giải phóng Bình Long. Địch ra sức giữ Bình Long vì 'Bình Long mất, Sài Gòn không còn'. Suốt 32 ngày đêm (từ 13/04 đến 15/05/1972), chiến sự diễn ra vô cùng ác liệt. Địch tập trung mọi hỏa lực hiện có kể cả máy bay B52 thả bom rải thảm cày nát mặt đất, thả bom vào cả bệnh viện thị trấn An Lộc nơi phần lớn nhân dân tập trung tránh đạn pháo và cả lính địch bị thương đang điều trị khiến hàng ngàn người thương vong, nhà cửa đổ nát. Để giải quyết số người chết trong 32 ngày đêm đó, địch dùng xe ủi khoét bốn rãnh lớn chôn các xác chết sau khi gom lại, hình thành ngôi mộ tập thể trên 3.000 người. Với diện tích hơn 4.000m², khu di tích ngày nay được tôn tạo trang nghiêm với tượng đài tưởng niệm cao 12,6m, nhà bia lịch sử và hoa viên xanh mát. Di tích được Bộ Văn hóa công nhận là Di tích Lịch sử cấp Quốc gia vào ngày 01/04/1985, là minh chứng sâu sắc về cái giá của hòa bình và sự hy sinh to lớn của dân tộc.",
    address: "Khu phố An Lộc, Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.6057461, lat: 11.6491817 },
    preview_image: "/landmarks/m3000_preview.jpg",
    click_panorama_id: "M3000_0_FLYCAM_1",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "/audio/m3000_thuyet_minh.mp3"
    },
    documents: null,
    assets: [
      {
        asset_id: "m3000_asset_1",
        title: "Đài tưởng niệm Di tích Lịch sử Quốc gia Mộ 3.000 người",
        description: "Tượng đài uy nghiêm cao 12,6m và nhà bia tưởng niệm hơn 3.000 đồng bào và chiến sĩ tử nạn trong 32 ngày đêm chiến sự năm 1972.",
        image_url: "/landmarks/m3000_preview.jpg",
        panorama_id: "M3000_6"
      },
      {
        asset_id: "m3000_asset_2",
        title: "Khu mộ tập thể và hoa viên tưởng niệm An Lộc",
        description: "Khuôn viên xanh mát hơn 4.000m² lưu dấu 4 hào rãnh mộ tập thể lịch sử, được xếp hạng Di tích Lịch sử cấp Quốc gia năm 1985.",
        image_url: "/landmarks/mo_3000_nguoi.jpg",
        panorama_id: "M3000_9_GIUA"
      }
    ],
  },
  {
    id: "133",
    hotspot_id: 133,
    area_id: 25,
    title: "Di tích Lịch sử - Văn hóa cấp thành phố Hưng Lập Tự",
    description:
      "Hưng Lập Tự (Chi hội Hưng Lập Tự thuộc Tịnh độ Cư sĩ Phật hội Việt Nam) tọa lạc tại Khu phố Phú Đức, Phường Bình Long, Thành phố Đồng Nai. Chùa được xây dựng năm 1958, di tích lúc đó gồm có các công trình: Cổng, chánh điện, giảng đường, phòng thuốc nam. Năm 1972, chiến sự tại Bình Long diễn ra vô cùng ác liệt, hàng ngàn người bị thương vong. Chánh điện của Hưng Lập Tự bị bành dù tiếp tế rơi trúng khiến một phần ngói và nền nhà bị vỡ sập. Trong hoàn cảnh đó, chùa vừa là nơi cứu chữa người bị thương, vừa là nơi che chở tránh bom đạn cho đồng bào. Sau chiến tranh, các y sĩ đã trở về tiếp tục phát triển phòng thuốc nam. Năm 1983, chùa được UBND huyện Bình Long quyết định thành lập tổ chẩn trị Đông y khám bệnh từ thiện. Với tôn chỉ hành đạo 'Phước Huệ Song Tu', Hưng Lập Tự là cơ sở tôn giáo và di tích lịch sử - văn hóa nổi tiếng với truyền thống khám chữa bệnh, cấp phát thuốc miễn phí cho nhân dân suốt nhiều thập kỷ.",
    address: "Khu phố Phú Đức, Phường Bình Long, Thành phố Đồng Nai",
    website: null,
    geolocation: { lon: 106.6117306, lat: 11.6480133 },
    preview_image: "/landmarks/hlt_preview.jpg",
    click_panorama_id: "HLT_0_FLYCAM",
    created_at: new Date().toISOString(),
    metadata: {
      ids: [],
      audio_url: "/audio/hlt_thuyet_minh.mp3"
    },
    documents: null,
    assets: [
      {
        asset_id: "hlt_asset_1",
        title: "Chánh điện Di tích Lịch sử - Văn hóa Chùa Hưng Lập Tự",
        description: "Kiến trúc cổ kính thanh tịnh của Chùa Hưng Lập Tự (xây dựng năm 1958) thuộc Tịnh độ Cư sĩ Phật hội Việt Nam.",
        image_url: "/landmarks/hlt_preview.jpg",
        panorama_id: "HLT_2"
      },
      {
        asset_id: "hlt_asset_2",
        title: "Cảnh quan Đô thị Phường Bình Long thanh bình",
        description: "Toàn cảnh đô thị Phường Bình Long hôm nay, nơi lưu giữ nhiều di tích lịch sử và văn hóa tâm linh hào hùng.",
        image_url: "/landmarks/do_thi_binh_long.jpg",
        panorama_id: "HLT_0_FLYCAM"
      }
    ],
  },
];

export const BINHLONG_PANORAMAS: Panorama[] = [
  // DTT Panoramas (11 items)
  { panorama_id: "DTT_0_FLYCAM", hotspot_id: 130, title: "Toàn cảnh Dinh Tỉnh Trưởng (Flycam 360°)", preview_image: "/panoramas_thumb/pan_DTT_0_FLYCAM_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_1_CONG", hotspot_id: 130, title: "Cổng chính Dinh Tỉnh Trưởng", preview_image: "/panoramas_thumb/pan_DTT_1_CONG_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_2_SAN", hotspot_id: 130, title: "Khuôn viên sân trước Dinh Tỉnh Trưởng", preview_image: "/panoramas_thumb/pan_DTT_2_SAN_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_3_GIUA", hotspot_id: 130, title: "Khu vực tiền sảnh trung tâm", preview_image: "/panoramas_thumb/pan_DTT_3_GIUA_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_3_PHAI", hotspot_id: 130, title: "Khuôn viên cánh phải", preview_image: "/panoramas_thumb/pan_DTT_3_PHAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_3_TRAI", hotspot_id: 130, title: "Khuôn viên cánh trái", preview_image: "/panoramas_thumb/pan_DTT_3_TRAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_4", hotspot_id: 130, title: "Không gian trưng bày tư liệu lịch sử", preview_image: "/panoramas_thumb/pan_DTT_4_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_5", hotspot_id: 130, title: "Lối vào hệ thống hầm công sự chỉ huy", preview_image: "/panoramas_thumb/pan_DTT_5_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_6", hotspot_id: 130, title: "Bên trong đường hầm kiên cố", preview_image: "/panoramas_thumb/pan_DTT_6_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_7", hotspot_id: 130, title: "Hành lang kết nối hầm ngầm", preview_image: "/panoramas_thumb/pan_DTT_7_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "DTT_8", hotspot_id: 130, title: "Cửa thoát hiểm và công sự bảo vệ", preview_image: "/panoramas_thumb/pan_DTT_8_thumb.webp", created_at: new Date().toISOString() },
  // M7N Panoramas (5 items)
  { panorama_id: "M7N_0_FLYCAM", hotspot_id: 131, title: "Toàn cảnh Khu Di tích Mộ 7 Người (Flycam 360°)", preview_image: "/panoramas_thumb/pan_M7N_0_FLYCAM_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M7N_1_CONG", hotspot_id: 131, title: "Cổng chính và khuôn viên tưởng niệm", preview_image: "/panoramas_thumb/pan_M7N_1_CONG_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M7N_2_BIA", hotspot_id: 131, title: "Bia ghi danh Di tích Lịch sử Mộ tập thể", preview_image: "/panoramas_thumb/pan_M7N_2_BIA_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M7N_3_SAN", hotspot_id: 131, title: "Khu vực sân hành lễ và đền thờ tưởng niệm", preview_image: "/panoramas_thumb/pan_M7N_3_SAN_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M7N_4_MO", hotspot_id: 131, title: "Khu phần mộ các anh hùng liệt sĩ", preview_image: "/panoramas_thumb/pan_M7N_4_MO_thumb.webp", created_at: new Date().toISOString() },
  // M3000 Panoramas (22 items)
  { panorama_id: "M3000_0_FLYCAM_1", hotspot_id: 132, title: "Toàn cảnh Di tích Mộ 3.000 người (Góc Flycam 1)", preview_image: "/panoramas_thumb/pan_M3000_0_FLYCAM_1_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_0_FLYCAM_2", hotspot_id: 132, title: "Toàn cảnh Tượng đài và Khuôn viên (Góc Flycam 2)", preview_image: "/panoramas_thumb/pan_M3000_0_FLYCAM_2_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_1_CONG_PHU", hotspot_id: 132, title: "Cổng phụ vào khu di tích", preview_image: "/panoramas_thumb/pan_M3000_1_CONG_PHU_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_2_CONG_CHINH", hotspot_id: 132, title: "Cổng chính Khu di tích Quốc gia", preview_image: "/panoramas_thumb/pan_M3000_2_CONG_CHINH_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_3", hotspot_id: 132, title: "Sân tiền sảnh tượng đài", preview_image: "/panoramas_thumb/pan_M3000_3_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_4", hotspot_id: 132, title: "Lối dẫn vào khu nhà bia tưởng niệm", preview_image: "/panoramas_thumb/pan_M3000_4_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_5", hotspot_id: 132, title: "Khuôn viên hoa viên trung tâm", preview_image: "/panoramas_thumb/pan_M3000_5_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_6", hotspot_id: 132, title: "Đài tưởng niệm chính cao 12,6m", preview_image: "/panoramas_thumb/pan_M3000_6_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_7_NHA_GIUA", hotspot_id: 132, title: "Gian chính Nhà bia tưởng niệm", preview_image: "/panoramas_thumb/pan_M3000_7_NHA_GIUA_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_7_NHA_PHAI", hotspot_id: 132, title: "Gian cánh phải Nhà bia tưởng niệm", preview_image: "/panoramas_thumb/pan_M3000_7_NHA_PHAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_7_NHA_TRAI", hotspot_id: 132, title: "Gian cánh trái Nhà bia tưởng niệm", preview_image: "/panoramas_thumb/pan_M3000_7_NHA_TRAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_8", hotspot_id: 132, title: "Không gian trưng bày hình ảnh lịch sử An Lộc 1972", preview_image: "/panoramas_thumb/pan_M3000_8_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_9_GIUA", hotspot_id: 132, title: "Khu vực mộ tập thể trung tâm", preview_image: "/panoramas_thumb/pan_M3000_9_GIUA_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_9_PHAI", hotspot_id: 132, title: "Khu vực mộ tập thể phía hữu", preview_image: "/panoramas_thumb/pan_M3000_9_PHAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_9_TRAI", hotspot_id: 132, title: "Khu vực mộ tập thể phía tả", preview_image: "/panoramas_thumb/pan_M3000_9_TRAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_10", hotspot_id: 132, title: "Hành lang tưởng niệm các nạn nhân chiến tranh", preview_image: "/panoramas_thumb/pan_M3000_10_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_11_PHAI", hotspot_id: 132, title: "Khuôn viên lưu niệm phía đông", preview_image: "/panoramas_thumb/pan_M3000_11_PHAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_11_TRAI", hotspot_id: 132, title: "Khuôn viên lưu niệm phía tây", preview_image: "/panoramas_thumb/pan_M3000_11_TRAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_12_GIUA", hotspot_id: 132, title: "Toàn cảnh cụm bia ghi danh tưởng niệm", preview_image: "/panoramas_thumb/pan_M3000_12_GIUA_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_12_PHAI", hotspot_id: 132, title: "Hàng cây xanh và lối dạo tĩnh mịch (Phải)", preview_image: "/panoramas_thumb/pan_M3000_12_PHAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_12_TRAI", hotspot_id: 132, title: "Hàng cây xanh và lối dạo tĩnh mịch (Trái)", preview_image: "/panoramas_thumb/pan_M3000_12_TRAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "M3000_13", hotspot_id: 132, title: "Khu vực tiếp đón khách và vườn lưu niệm", preview_image: "/panoramas_thumb/pan_M3000_13_thumb.webp", created_at: new Date().toISOString() },
  // HLT Panoramas (22 items)
  { panorama_id: "HLT_0_FLYCAM", hotspot_id: 133, title: "Toàn cảnh Chùa Hưng Lập Tự (Flycam 360°)", preview_image: "/panoramas_thumb/pan_HLT_0_FLYCAM_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_1_PHAI", hotspot_id: 133, title: "Cổng chính và khuôn viên phía phải chùa", preview_image: "/panoramas_thumb/pan_HLT_1_PHAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_1_TRAI", hotspot_id: 133, title: "Cổng chính và khuôn viên phía trái chùa", preview_image: "/panoramas_thumb/pan_HLT_1_TRAI_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2", hotspot_id: 133, title: "Tiền sảnh chính điện Chùa Hưng Lập Tự", preview_image: "/panoramas_thumb/pan_HLT_2_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_1", hotspot_id: 133, title: "Khuôn viên sân Chánh điện", preview_image: "/panoramas_thumb/pan_HLT_2_1_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_2", hotspot_id: 133, title: "Bên trong Chánh điện tôn nghiêm (Góc 1)", preview_image: "/panoramas_thumb/pan_HLT_2_2_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_3", hotspot_id: 133, title: "Bên trong Chánh điện tôn nghiêm (Góc 2)", preview_image: "/panoramas_thumb/pan_HLT_2_3_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_4", hotspot_id: 133, title: "Bàn thờ Đức Phật và chư vị tiền hiền", preview_image: "/panoramas_thumb/pan_HLT_2_4_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_11", hotspot_id: 133, title: "Khu vực giảng đường sinh hoạt đạo tràng", preview_image: "/panoramas_thumb/pan_HLT_2_11_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_12", hotspot_id: 133, title: "Hành lang kết nối các gian thờ", preview_image: "/panoramas_thumb/pan_HLT_2_12_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_13", hotspot_id: 133, title: "Khuôn viên nhà Hậu Tổ", preview_image: "/panoramas_thumb/pan_HLT_2_13_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_31", hotspot_id: 133, title: "Lối vào Phòng thuốc Nam Phước thiện", preview_image: "/panoramas_thumb/pan_HLT_2_31_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_32P", hotspot_id: 133, title: "Phòng khám và chẩn trị y học cổ truyền (Phải)", preview_image: "/panoramas_thumb/pan_HLT_2_32P_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_32T", hotspot_id: 133, title: "Phòng khám và chẩn trị y học cổ truyền (Trái)", preview_image: "/panoramas_thumb/pan_HLT_2_32T_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_33", hotspot_id: 133, title: "Khu vực bào chế và bốc thuốc Nam từ thiện", preview_image: "/panoramas_thumb/pan_HLT_2_33_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_33P", hotspot_id: 133, title: "Kho lưu trữ thảo dược thuốc Nam (Cánh phải)", preview_image: "/panoramas_thumb/pan_HLT_2_33P_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_33T", hotspot_id: 133, title: "Kho lưu trữ thảo dược thuốc Nam (Cánh trái)", preview_image: "/panoramas_thumb/pan_HLT_2_33T_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_34", hotspot_id: 133, title: "Sân phơi thảo dược y học dân tộc", preview_image: "/panoramas_thumb/pan_HLT_2_34_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_35", hotspot_id: 133, title: "Khu nhà ăn và sinh hoạt từ thiện cộng đồng", preview_image: "/panoramas_thumb/pan_HLT_2_35_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_2_41", hotspot_id: 133, title: "Không gian tĩnh tâm và hoa viên thanh tịnh", preview_image: "/panoramas_thumb/pan_HLT_2_41_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_3", hotspot_id: 133, title: "Khu tháp mộ chư vị tiền bối sư trụ trì", preview_image: "/panoramas_thumb/pan_HLT_3_thumb.webp", created_at: new Date().toISOString() },
  { panorama_id: "HLT_4", hotspot_id: 133, title: "Vườn cây bồ đề và cảnh quan sinh thái tự nhiên", preview_image: "/panoramas_thumb/pan_HLT_4_thumb.webp", created_at: new Date().toISOString() },
];
