import { useState, useEffect, useMemo } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  MapPin,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import AnimatedNumber from "../common/AnimatedNumber";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "../magicui/text-animate";
import useVRStore from "@/store/vr.store";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

// 3D Custom Assets (HCMUTE Green Satin Style)
import area3DIcon from "@/assets/3d-icons/area__binhlong-3d-icon.png";
import population3DIcon from "@/assets/3d-icons/population__binhlong-3d-icon.png";
import admin3DIcon from "@/assets/3d-icons/admin__binhlong-3d-icon.png";
import highway3DIcon from "@/assets/3d-icons/highway__binhlong-3d-icon.png";
import landmarkExplore3DIcon from "@/assets/3d-icons/landmark-explore__binhlong-3d-icon.png";
import bannerQcDesktop from "@/assets/banner_qc_desktop.jpg";
import bannerQcMobile from "@/assets/banner_qc_mobile.jpg";

// 4 Key Stats - Clean, no repeated labels, prominent values & 3D icons
const STATS_DATA = [
  {
    title: "Diện tích",
    value: 49.14,
    displayDecimals: 2,
    unit: "km² tự nhiên",
    description: "Tổng diện tích tự nhiên sau sắp xếp",
    icon: area3DIcon,
  },
  {
    title: "Dân số",
    prefix: "> ",
    value: 40000,
    unit: "người",
    description: "Quy mô dân số toàn phường",
    icon: population3DIcon,
  },
  {
    title: "Hành chính",
    value: 9,
    padZero: true,
    unit: "Khu phố",
    description: "Hợp nhất từ 04 đơn vị hành chính",
    icon: admin3DIcon,
  },
  {
    title: "Huyết mạch",
    prefix: "QL ",
    value: 13,
    unit: "TP.HCM - Hoa Lư",
    description: "Cửa ngõ Đông Nam Bộ – Campuchia",
    icon: highway3DIcon,
  },
];

// Showcase gallery images using authentic high-resolution photos
const GALLERY_ITEMS = [
  {
    id: "dothi",
    title: "Toàn cảnh Đô Thị Bình Long",
    subtitle: "Không gian đô thị văn minh, hiện đại – Cửa ngõ kết nối phía Bắc",
    badge: "Đô thị Bình Long",
    image: "/landmarks/do_thi_binh_long.jpg",
    actionType: "map" as const,
  },
  {
    id: "mo3000",
    title: "Di tích Quốc gia Mộ 3.000 người",
    subtitle: "Khu tưởng niệm đồng bào An Lộc – Di tích lịch sử Quốc gia",
    badge: "Di tích Quốc gia",
    image: "/landmarks/mo_3000_tuong_niem.jpg",
    actionType: "vr" as const,
    hotspotId: 132,
    panoramaId: "M3000_0_FLYCAM_2",
  },
  {
    id: "congchao",
    title: "Trụ sở Đảng bộ – HĐND – UBND",
    subtitle: "Cổng chào Đại hội Đại biểu Đảng bộ Phường Bình Long lần thứ I, nhiệm kỳ 2025 – 2030",
    badge: "Trụ sở Hành chính",
    image: "/images/phuong_binh_long/phuong_binh_long_tru_so_cong_chao.jpg",
    actionType: "map" as const,
  },
  {
    id: "dieuhanh",
    title: "Đoàn xe diễu hành chào mừng",
    subtitle: "Khí thế hân hoan, rực rỡ cờ hoa trên các đại lộ chính Phường Bình Long",
    badge: "Sự kiện lịch sử",
    image: "/images/phuong_binh_long/phuong_binh_long_dieu_hanh.jpg",
    actionType: "map" as const,
  },
  {
    id: "hoasen",
    title: "Tuyến phố & Cụm Hoa sen",
    subtitle: "Không gian thương mại trung tâm với cụm hoa sen vươn cao kiêu hãnh",
    badge: "Đô thị trung tâm",
    image: "/images/phuong_binh_long/phuong_binh_long_tuyen_pho_hoa_sen.jpg",
    actionType: "map" as const,
  },
  {
    id: "giaolo",
    title: "Giao lộ kết nối Quốc lộ 13",
    subtitle: "Tuyến giao thông huyết mạch nối TP. Hồ Chí Minh với Cửa khẩu Hoa Lư",
    badge: "Huyết mạch giao thông",
    image: "/images/phuong_binh_long/phuong_binh_long_giao_lo_trung_tam.jpg",
    actionType: "map" as const,
  },
];

// Authentic photos of Phường Bình Long for showcase bento grid
const BINHLONG_SHOWCASE_PHOTOS = [
  {
    id: "tru_so",
    title: "Trụ sở Đảng bộ – HĐND – UBND Phường Bình Long",
    subtitle: "Cổng chào Đại hội Đại biểu Đảng bộ Phường Bình Long lần thứ I, nhiệm kỳ 2025 – 2030",
    description:
      "Trụ sở làm việc của Đảng bộ và chính quyền Phường Bình Long được trang hoàng trang trọng, rực rỡ cờ hoa, pano khẩu hiệu nhân dịp Đại hội đại biểu khóa I.",
    tag: "Trụ sở Hành chính",
    image: "/images/phuong_binh_long/phuong_binh_long_tru_so_cong_chao.jpg",
  },
  {
    id: "dieu_hanh",
    title: "Đoàn xe diễu hành chào mừng Đại hội",
    subtitle: "Khí thế hân hoan, rực rỡ cờ hoa trên các trục lộ giao thông chính",
    description:
      "Đoàn xe hoa và lực lượng tuần hành rực rỡ cờ đỏ búa liềm và cờ Tổ quốc diễu hành trên tuyến đại lộ rợp bóng cây xanh của Phường Bình Long.",
    tag: "Sự kiện lịch sử",
    image: "/images/phuong_binh_long/phuong_binh_long_dieu_hanh.jpg",
  },
  {
    id: "tuyen_pho",
    title: "Tuyến phố trung tâm & Cụm biểu tượng Hoa Sen",
    subtitle: "Không gian đô thị khang trang, năng động và phát triển",
    description:
      "Tuyến đường thương mại trung tâm sầm uất với điểm nhấn cụm biểu tượng đóa sen Bình Long vươn cao kiêu hãnh, biểu trưng cho sức sống và sự vươn lên.",
    tag: "Đô thị trung tâm",
    image: "/images/phuong_binh_long/phuong_binh_long_tuyen_pho_hoa_sen.jpg",
  },
  {
    id: "duong_co_hoa",
    title: "Đại lộ rợp bóng cây xanh & cờ đỏ sao vàng",
    subtitle: "Cảnh quan thanh bình, tươi đẹp rợp bóng mát",
    description:
      "Tuyến đường rợp bóng cây cổ thụ xanh mát hòa cùng sắc đỏ thắm tươi của cờ Tổ quốc và cờ Đảng chào đón những ngày hội non sông.",
    tag: "Cảnh quan đô thị",
    image: "/images/phuong_binh_long/phuong_binh_long_duong_co_hoa.jpg",
  },
  {
    id: "giao_lo",
    title: "Giao lộ kết nối Quốc lộ 13 huyết mạch",
    subtitle: "Hạ tầng giao thông thông thoáng hướng về Cửa khẩu Hoa Lư",
    description:
      "Điểm nút giao thông chiến lược nằm trên trục Quốc lộ 13 – tuyến huyết mạch nối liền TP. Hồ Chí Minh với Cửa khẩu Quốc tế Hoa Lư và Campuchia.",
    tag: "Hạ tầng giao thông",
    image: "/images/phuong_binh_long/phuong_binh_long_giao_lo_trung_tam.jpg",
  },
];



// 4 Featured historical sites with authentic preview images & hotspot IDs
const FEATURED_SITES = [
  {
    name: "Di tích Quốc gia Mộ 3.000 người",
    detail: "Mộ 3000 đồng bào An Lộc bị đế quốc Mỹ tàn sát ngày 03/10/1972 (Mộ tập thể 3000 người)",
    type: "Di tích Quốc gia",
    hotspotId: 132,
    panoramaId: "M3000_0_FLYCAM_2",
    image: "/landmarks/mo_3000_tuong_niem.jpg",
  },
  {
    name: "An Lộc Nhà và Đường hầm",
    detail: "Dinh Tỉnh Trưởng Bình Long – Di tích cấp thành phố",
    type: "Di tích Cấp thành phố",
    hotspotId: 130,
    panoramaId: "DTT_0_FLYCAM",
    image: "/landmarks/dtt_preview.jpg",
  },
  {
    name: "Mộ tập thể LLVT an ninh An Lộc",
    detail: "Khu di tích Mộ 7 người – Tinh thần quả cảm kiên trung",
    type: "Di tích Cấp thành phố",
    hotspotId: 131,
    panoramaId: "M7N_0_FLYCAM",
    image: "/landmarks/m7n_preview.jpg",
  },
  {
    name: "Di tích lịch sử - văn hóa Hưng Lập Tự",
    detail: "Cổ tự linh thiêng & Phòng thuốc Nam phước thiện nhân đạo",
    type: "Di tích Văn hóa",
    hotspotId: 133,
    panoramaId: "HLT_0_FLYCAM",
    image: "/landmarks/hlt_preview.jpg",
  },
];

export function OverviewSection() {
  const navigate = useNavigate();
  const { setIsLoading, setIsMapDialogOpen, selectHotspotAndPanorama } = useVRStore();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPosterLightboxOpen, setIsPosterLightboxOpen] = useState(false);
  const [showcaseLightboxIndex, setShowcaseLightboxIndex] = useState<number | null>(null);

  const showcaseLightboxSlides = useMemo(
    () =>
      BINHLONG_SHOWCASE_PHOTOS.map((photo) => ({
        src: photo.image,
        title: photo.title,
        subtitle: photo.subtitle,
        description: photo.description,
        tag: photo.tag,
      })),
    []
  );

  // Auto-play photo carousel reliably every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [currentPhotoIndex]);

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? GALLERY_ITEMS.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
  };

  const currentPhoto = GALLERY_ITEMS[currentPhotoIndex];

  const handleCardAction = (item: (typeof GALLERY_ITEMS)[0]) => {
    if (item.actionType === "vr" && item.hotspotId) {
      handleOpenVRSite(item.hotspotId, item.panoramaId);
    } else {
      setIsMapDialogOpen(true);
    }
  };

  const handleOpenVRSite = (hotspotId: number, panoramaId?: string) => {
    selectHotspotAndPanorama(hotspotId, panoramaId || null);
    navigate({
      pathname: "/app",
      search: createSearchParams({
        hotspot_id: String(hotspotId),
        ...(panoramaId ? { panorama_id: panoramaId } : {}),
      }).toString(),
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <section className="py-12 sm:py-16 w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Full-Width Container */}
      <div className="w-full flex flex-col gap-10 sm:gap-12">
        {/* ================= 1. SECTION HEADER ================= */}
        <div className="w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left !leading-tight">
            <TextAnimate animation="blurIn" as="span">
              Khái Quát Đặc Điểm
            </TextAnimate>{" "}
            <span className="text-primary font-semibold">Phường Bình Long</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground text-left font-normal max-w-3xl leading-relaxed">
            Cửa ngõ chiến lược kết nối vùng Đông Nam Bộ với Campuchia – Vùng đất có bề dày truyền thống cách mạng vẻ vang và những di tích lịch sử ghi dấu một thời hào hùng của Đảng bộ và nhân dân Bình Long.
          </p>
        </div>

        {/* ================= 2. 4 STAT CARDS (FULL WIDTH, 4 COLUMNS) ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {STATS_DATA.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-border/60 shadow-md bg-card flex flex-col justify-between group hover:shadow-xl hover:border-primary/40 transition-all duration-300"
            >
              {/* Upper Card Content */}
              <div className="p-4 sm:p-5 lg:p-6 pb-4 sm:pb-5">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {stat.title}
                    </span>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mt-1.5 flex items-baseline gap-1">
                      <AnimatedNumber
                        value={stat.value}
                        prefix={stat.prefix}
                        decimals={stat.displayDecimals}
                        padZero={stat.padZero}
                        formatStyle="vi"
                      />
                    </div>
                    <span className="mt-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {stat.unit}
                    </span>
                  </div>

                  {/* 3D Satin-Plastic Asset - BIGGER */}
                  <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center pointer-events-none -mr-2 -mt-2">
                    <img
                      src={stat.icon}
                      alt={stat.title}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Edge-to-Edge Full-Width Divider */}
              <div className="w-full h-px bg-border/60" />

              {/* Bottom Card Footer */}
              <div className="px-4 sm:px-5 lg:px-6 py-3 bg-muted/20 text-[11px] sm:text-xs text-muted-foreground font-normal leading-relaxed">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* ================= 3. BALANCED 2-COLUMN SPLIT (NARRATIVE & IMAGE SHOWCASE) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full">
          {/* LEFT COLUMN: OFFICIAL NARRATIVE & BANNER NGANG */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-5">
            {/* Card 1: Official Establishment & Context */}
            <Card className="border border-border/60 shadow-md bg-card/85 backdrop-blur-sm p-5 sm:p-6 rounded-2xl flex-1 flex flex-col justify-center">
              <div className="space-y-4 text-sm sm:text-base text-foreground/90 font-normal leading-relaxed text-justify">
                <p>
                  <strong>Phường Bình Long</strong> được thành lập theo{" "}
                  <span className="font-semibold text-primary">
                    Nghị quyết số 1662/2025/NQ-UBTVQH
                  </span>{" "}
                  ngày 16/6/2025 của Ủy ban Thường vụ Quốc hội, trên cơ sở sắp xếp, hợp nhất nguyên trạng diện tích tự nhiên và dân số từ các phường <strong>An Lộc, Hưng Chiến, Phú Đức</strong> của thị xã Bình Long và xã <strong>Thanh Bình</strong> của huyện Hớn Quản, với tổng diện tích tự nhiên đạt <strong>49,14 km²</strong>.
                </p>

                <p>
                  Toàn phường có <strong>09 khu phố</strong>; dân số của toàn phường trên <strong>40.000 người</strong>. Phường Bình Long có vị trí địa lý chiến lược nằm trên tuyến <strong>Quốc lộ 13</strong> – tuyến đường giao thông huyết mạch nối Thành phố Hồ Chí Minh với Cửa khẩu Hoa Lư, là cửa ngõ kết nối vùng Đông Nam Bộ với Campuchia.
                </p>

                <p>
                  Bình Long là vùng đất có bề dày truyền thống cách mạng vẻ vang. Trên địa bàn phường Bình Long có những di tích văn hóa, lịch sử đã ghi dấu một thời hào hùng của Đảng bộ và nhân dân Bình Long.
                </p>
              </div>
            </Card>

            {/* Banner Ngang: Không Gian Bản Đồ Số & Trực Quan Hóa (Pure Visual Banner - Tự thích ứng tỷ lệ 16:9) */}
            <div
              className="group relative overflow-hidden rounded-2xl border border-border/70 shadow-md hover:shadow-xl bg-card transition-all duration-300 hover:border-emerald-500/60 w-full aspect-video flex items-center justify-center"
            >
              {/* Responsive Images: Mobile 9:16 and Desktop 16:9 */}
              <picture
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={() => setIsPosterLightboxOpen(true)}
                title="Nhấp để xem ảnh quảng cáo độ phân giải cao"
              >
                <source media="(max-width: 639px)" srcSet={bannerQcMobile} />
                <img
                  src={bannerQcDesktop}
                  alt="Bản Đồ Số Bình Long VR"
                  className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                />
              </picture>

              {/* Center Action Button: Trải nghiệm thực tế ảo */}
              <div className="relative z-10 p-4">
                <Button
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/app");
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 300);
                  }}
                  className="rounded-xl cursor-pointer bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3 shadow-2xl backdrop-blur-md border border-white/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 group/btn"
                >
                  <Eye className="w-5 h-5 text-white stroke-[2.2]" />
                  <span>Trải nghiệm thực tế ảo</span>
                  <ArrowUpRight className="w-4 h-4 text-white stroke-[2.2] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ẢNH TIÊU BIỂU TOÀN PHẦN (AUTO-PLAY, FULL-HEIGHT, CROSSFADE) */}
          <div className="lg:col-span-6 flex flex-col h-full">
            {/* 1 Single Featured Photo Card (Shadow nhẹ nhàng, đồng bộ, sáng sủa) */}
            <Card
              onClick={() => handleCardAction(currentPhoto)}
              className="relative overflow-hidden !p-0 border border-border/60 shadow-md hover:shadow-lg bg-card rounded-2xl group flex flex-col justify-end min-h-[380px] sm:min-h-[460px] lg:min-h-full cursor-pointer transition-all duration-300 hover:border-emerald-500/50 flex-1 w-full"
            >
              <CardContent className="!p-0 relative h-full w-full overflow-hidden flex flex-col justify-end">
                {/* Crossfading Background Photos */}
                {GALLERY_ITEMS.map((item, idx) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                      idx === currentPhotoIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                ))}

                {/* Gentle gradient overlay only at the bottom caption area (không làm tối ảnh) */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-15 pointer-events-none" />

                {/* Floating Left/Right Navigation Arrows - Màu xanh giống Lightbox, hiện khi hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPhoto();
                  }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-25 size-10 sm:size-11 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white border border-emerald-400/40 shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 select-none"
                  title="Ảnh trước"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="size-5 sm:size-6 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPhoto();
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-25 size-10 sm:size-11 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white border border-emerald-400/40 shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 select-none"
                  title="Ảnh kế tiếp"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="size-5 sm:size-6 stroke-[2.5]" />
                </button>

                {/* Top-Left Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-600/95 text-white text-xs font-semibold backdrop-blur-md shadow-sm border border-emerald-500/40 uppercase tracking-wider">
                    {currentPhoto.badge}
                  </span>
                </div>

                {/* Top-Right Action Arrow - Synchronized with Navigation buttons */}
                <div className="absolute top-4 right-4 z-20 size-9 sm:size-10 rounded-full bg-background/90 text-foreground border border-border/80 shadow-md backdrop-blur-md flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all">
                  <ArrowUpRight className="size-4 sm:size-5 stroke-[2.5]" />
                </div>

                {/* Bottom Image Caption, Info & Navigation Dots Overlay */}
                <div className="relative p-6 sm:p-7 z-20 text-white flex items-end justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.9),_0_2px_8px_rgba(0,0,0,0.8)] group-hover:text-emerald-300 transition-colors">
                      {currentPhoto.title}
                    </h4>
                    {currentPhoto.subtitle && (
                      <p className="text-xs sm:text-sm text-white/95 [text-shadow:_0_1px_3px_rgba(0,0,0,0.9),_0_2px_6px_rgba(0,0,0,0.8)] line-clamp-2 leading-relaxed max-w-xl font-medium">
                        {currentPhoto.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Auto-play Dots Indicator */}
                  <div className="shrink-0 flex items-center gap-1.5 pb-1">
                    {GALLERY_ITEMS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPhotoIndex(idx);
                        }}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          idx === currentPhotoIndex
                            ? "w-6 h-2 bg-emerald-400 shadow-xs"
                            : "w-2 h-2 bg-white/40 hover:bg-white/80"
                        }`}
                        aria-label={`Ảnh ${idx + 1}`}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ================= DẤU ẤN ĐỔI MỚI PHƯỜNG BÌNH LONG (BENTO GRID 5 REAL PHOTOS) ================= */}
        <div className="w-full space-y-6 pt-2">
          {/* Header */}
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/60">
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                <TextAnimate animation="blurIn" as="span">
                  Dấu Ấn Đổi Mới
                </TextAnimate>{" "}
                <span className="text-primary font-bold">Phường Bình Long</span>
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-4xl leading-relaxed">
                Ghi nhận những hình ảnh chân thực, diện mạo đô thị khang trang và các sự kiện chính trị – văn hóa trọng đại của Đảng bộ và Nhân dân Phường Bình Long.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg bg-secondary/80 border border-border/50">
                Nhấp để xem ảnh phóng to
              </span>
            </div>
          </div>

          {/* Responsive Bento Grid with 5 Real Photos */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
            {/* Top Row: 2 Major Feature Cards (6-6 cols on desktop) */}
            {BINHLONG_SHOWCASE_PHOTOS.slice(0, 2).map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setShowcaseLightboxIndex(idx)}
                className="group relative md:col-span-6 h-[280px] sm:h-[340px] rounded-2xl overflow-hidden cursor-pointer border border-border/60 hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 pointer-events-none z-10">
                  <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white border-0 text-xs font-semibold backdrop-blur-md shadow-md">
                    {photo.tag}
                  </Badge>
                </div>

                {/* Bottom Content Overlay */}
                <div className="relative z-10 p-5 sm:p-6 text-white pointer-events-none">
                  <h3 className="text-lg sm:text-xl font-bold leading-snug text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.9),_0_2px_8px_rgba(0,0,0,0.8)] group-hover:text-emerald-300 transition-colors">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}

            {/* Bottom Row: 3 Feature Cards (4-4-4 cols on desktop) */}
            {BINHLONG_SHOWCASE_PHOTOS.slice(2, 5).map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setShowcaseLightboxIndex(idx + 2)}
                className="group relative md:col-span-4 h-[240px] sm:h-[280px] rounded-2xl overflow-hidden cursor-pointer border border-border/60 hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                {/* Top Floating Badge */}
                <div className="absolute top-3.5 left-3.5 pointer-events-none z-10">
                  <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white border-0 text-[11px] font-semibold backdrop-blur-md shadow-md">
                    {photo.tag}
                  </Badge>
                </div>

                {/* Bottom Content Overlay */}
                <div className="relative z-10 p-4 sm:p-5 text-white pointer-events-none">
                  <h3 className="text-base sm:text-lg font-bold leading-snug text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.9),_0_2px_8px_rgba(0,0,0,0.8)] group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. DI TÍCH LỊCH SỬ – VĂN HÓA TIÊU BIỂU (FULL WIDTH 4 CARDS) ================= */}
        <div className="w-full space-y-6 pt-2">
          {/* Header & Invitation Narrative */}
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/60">
            <div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Di Tích Lịch Sử – Văn Hóa Tiêu Biểu
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-4xl leading-relaxed">
                Xin mời quý vị cùng khám phá Bản đồ số Bình Long, cùng tham quan trải nghiệm không gian ảo 3D tìm hiểu các di tích lịch sử - văn hóa tiêu biểu trên địa bàn phường để có những trải nghiệm thú vị và càng hiểu thêm về vùng đất và con người Bình Long:
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg bg-secondary/80 border border-border/50">
                Nhấp để xem VR 360°
              </span>
            </div>
          </div>

          {/* 4 Full-Width Cards Grid (Style matching feature.tsx: padded rounded image, clear typography, full-width divider, solid action button) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {FEATURED_SITES.map((site) => (
              <div
                key={site.hotspotId}
                onClick={() => handleOpenVRSite(site.hotspotId, site.panoramaId)}
                className="group cursor-pointer rounded-xl sm:rounded-2xl bg-card border border-border/70 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Prominent Focus Image: Padded & fully rounded (Ảnh rounded padding) */}
                <div className="p-2.5 sm:p-3.5 pb-0 w-full">
                  <div className="relative h-40 sm:h-48 md:h-52 w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-900 shadow-xs">
                    <img
                      src={site.image}
                      alt={site.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top-Left Category Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <Badge className="bg-emerald-600/95 hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-semibold shadow-md border border-emerald-500/30 backdrop-blur-md px-2.5 py-0.5">
                        {site.type}
                      </Badge>
                    </div>

                    {/* Corner Arrow Icon */}
                    <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all shadow-sm">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>

                {/* Card Body: Title & Description (Tăng cỡ chữ, rõ ràng) */}
                <div className="p-3.5 sm:p-5 pt-3 sm:pt-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors text-left leading-snug sm:leading-normal">
                      {site.name}
                    </h4>
                    <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 font-normal leading-relaxed text-left">
                      {site.detail}
                    </p>
                  </div>
                </div>

                {/* Full-width Divider & Solid Action Button (Divider full width, Button rõ ràng, Bỏ left rounded ping) */}
                <div className="w-full border-t border-border/70 p-3 sm:p-4 bg-secondary/15">
                  <Button
                    size="sm"
                    className="w-full rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 flex items-center justify-between shadow-xs group-hover:shadow-md transition-all cursor-pointer h-10 sm:h-11"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white truncate">
                      Khám phá không gian 3D
                    </span>
                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-white stroke-[2.5] shrink-0 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= 5. FULL WIDTH ACTION CTA BAR ================= */}
          <div className="w-full rounded-2xl bg-card border border-border/70 p-5 sm:p-7 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
            {/* Subtle background ambient tint */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start sm:items-center gap-4 relative z-10">
              <div className="shrink-0 relative flex items-center justify-center">
                <img
                  src={landmarkExplore3DIcon}
                  alt="Bản đồ số Di tích Bình Long 3D"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-md select-none pointer-events-none hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  Trải nghiệm Bản đồ số Di tích & Đô thị Phường Bình Long
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Khám phá đầy đủ các điểm nhìn toàn cảnh 360°, tư liệu thuyết minh âm thanh tự động và vị trí không gian địa lý trực quan.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full md:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-xl cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs px-5"
                onClick={() => {
                  navigate("/app");
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 300);
                }}
              >
                Khám phá bản đồ số Bình Long
                <ArrowUpRight className="!h-5 !w-5 ml-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl cursor-pointer bg-secondary/80 hover:bg-secondary text-foreground text-sm font-semibold shadow-xs px-5 border-border/70"
                onClick={() => setIsMapDialogOpen(true)}
              >
                <MapPin className="!h-4 !w-4 text-primary mr-1" />
                Mở sơ đồ di tích
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Poster Quảng Cáo Bình Long VR */}
      <Lightbox
        open={isPosterLightboxOpen}
        close={() => setIsPosterLightboxOpen(false)}
        slides={[
          {
            src: bannerQcDesktop,
            title: "Bản Đồ Số Bình Long VR – Bản Rộng (Desktop)",
            description: "Khám phá không gian thực tế ảo 360° & số hóa di tích",
          },
          {
            src: bannerQcMobile,
            title: "Bản Đồ Số Bình Long VR – Bản Đứng (Mobile)",
            description: "Thiết kế tối ưu cho trải nghiệm trên thiết bị di động",
          },
        ] as any}
        plugins={[Zoom]}
        controller={{ closeOnBackdropClick: true }}
      />

      {/* Lightbox for Dấu Ấn Đổi Mới Phường Bình Long */}
      <Lightbox
        open={showcaseLightboxIndex !== null}
        close={() => setShowcaseLightboxIndex(null)}
        index={showcaseLightboxIndex ?? 0}
        slides={showcaseLightboxSlides}
        plugins={[Zoom, Counter]}
        carousel={{ finite: false }}
        animation={{ swipe: 300 }}
        render={{
          iconPrev: () => (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/65 hover:bg-emerald-600 text-white border border-white/25 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer select-none">
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
            </div>
          ),
          iconNext: () => (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/65 hover:bg-emerald-600 text-white border border-white/25 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer select-none">
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
            </div>
          ),
          iconClose: () => (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/65 hover:bg-red-600 text-white border border-white/25 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none">
              <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
          ),
          slideFooter: ({ slide }: any) => (
            <div className="absolute bottom-0 inset-x-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-16 sm:pt-24 pb-6 sm:pb-8 px-5 sm:px-10 lg:px-16 text-white z-50 pointer-events-auto select-none">
              <div className="w-full space-y-1.5 text-left">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug drop-shadow-lg">
                  {slide.title}
                </h3>
                {slide.subtitle && (
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-emerald-400 drop-shadow-sm leading-relaxed">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          ),
        }}
      />
    </section>
  );
}
