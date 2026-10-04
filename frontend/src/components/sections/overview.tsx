import { useState, useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  Compass,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "../magicui/text-animate";
import useVRStore from "@/store/vr.store";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// 3D Custom Assets (HCMUTE Green Satin Style)
import area3DIcon from "@/assets/3d-icons/area__binhlong-3d-icon.png";
import population3DIcon from "@/assets/3d-icons/population__binhlong-3d-icon.png";
import admin3DIcon from "@/assets/3d-icons/admin__binhlong-3d-icon.png";
import highway3DIcon from "@/assets/3d-icons/highway__binhlong-3d-icon.png";
import posterQuangCaoBinhLongVR from "@/assets/poster_quang_cao_binhlong_vr.jpg";
import posterQuangCaoDevices from "@/assets/poster_quang_cao_showcase_devices.jpg";

// 4 Key Stats - Clean, no repeated labels, prominent values & 3D icons
const STATS_DATA = [
  {
    title: "Diện tích",
    value: "49,14",
    unit: "km² tự nhiên",
    description: "Tổng diện tích tự nhiên sau sắp xếp",
    icon: area3DIcon,
  },
  {
    title: "Dân số",
    value: "> 40.000",
    unit: "người",
    description: "Quy mô dân số toàn phường",
    icon: population3DIcon,
  },
  {
    title: "Hành chính",
    value: "09",
    unit: "Khu phố",
    description: "Hợp nhất từ 04 đơn vị hành chính",
    icon: admin3DIcon,
  },
  {
    title: "Huyết mạch",
    value: "QL 13",
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
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isPosterLightboxOpen, setIsPosterLightboxOpen] = useState(false);

  // Auto-play photo carousel every 4.5s (pauses on hover)
  useEffect(() => {
    if (isPhotoHovered) return;
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPhotoHovered]);

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
              className="relative overflow-hidden rounded-2xl border border-border/60 shadow-md bg-card p-4 sm:p-5 lg:p-6 flex flex-col justify-between group hover:shadow-xl hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </span>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mt-1.5">
                    {stat.value}
                  </div>
                  <span className="mt-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {stat.unit}
                  </span>
                </div>

                {/* 3D Satin-Plastic Asset */}
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 group-hover:scale-108 transition-transform duration-300 flex items-center justify-center pointer-events-none -mr-1 -mt-1">
                  <img
                    src={stat.icon}
                    alt={stat.title}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-2.5 border-t border-border/40 text-[11px] sm:text-xs text-muted-foreground font-normal leading-relaxed">
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

            {/* Banner Ngang: Không Gian Bản Đồ Số & Trực Quan Hóa (Poster Quảng Cáo Style) */}
            <div
              onClick={() => {
                navigate("/app");
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 300);
              }}
              className="group relative overflow-hidden rounded-2xl border border-border/70 shadow-lg hover:shadow-2xl bg-card cursor-pointer transition-all duration-300 hover:border-emerald-500/60 min-h-[230px] sm:min-h-[250px] flex flex-col justify-end"
            >
              <img
                src={posterQuangCaoBinhLongVR}
                alt="Bản Đồ Số Bình Long VR"
                className="absolute inset-0 w-full h-full object-cover object-[center_30%] transition-all duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20 pointer-events-none" />

              {/* Top-Left Badge: Xanh chữ trắng đồng bộ */}
              <div className="absolute top-3.5 left-3.5 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/95 text-white text-xs font-semibold backdrop-blur-md shadow-md border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Bản Đồ Số Bình Long VR
                </span>
              </div>

              {/* Top-Right Arrow Action */}
              <div className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:border-primary transition-all shadow-md">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Content Overlay */}
              <div className="relative p-5 z-20 text-white space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold drop-shadow-md text-white group-hover:text-emerald-300 transition-colors">
                  Không Gian Số Hóa & Trải Nghiệm Tương Tác
                </h4>
                <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed drop-shadow-sm max-w-xl">
                  Trực quan hóa toàn diện hệ thống di tích và không gian đô thị Phường Bình Long qua công nghệ ảnh toàn cảnh 360° và sơ đồ di tích số.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 group-hover:text-white transition-colors">
                    <span>Khám phá bản đồ số</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPosterLightboxOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] text-white/85 hover:text-white bg-black/45 hover:bg-black/70 px-2.5 py-1 rounded-md border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Phóng to poster quảng cáo"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Xem poster QC</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 1 IMAGE CHÍNH (AUTO-PLAY, CROSSFADE) + 1 BANNER DỌC */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-5">
            {/* 1 Single Featured Photo Card (Auto-play, không còn badge header) */}
            <Card
              onClick={() => handleCardAction(currentPhoto)}
              onMouseEnter={() => setIsPhotoHovered(true)}
              onMouseLeave={() => setIsPhotoHovered(false)}
              className="relative overflow-hidden !p-0 border border-border/60 shadow-lg hover:shadow-xl bg-card rounded-2xl group flex flex-col justify-end min-h-[280px] sm:min-h-[330px] cursor-pointer transition-all duration-300 hover:border-emerald-500/50 flex-1"
            >
              <CardContent className="!p-0 relative h-full w-full overflow-hidden flex flex-col justify-end">
                {/* Crossfading Background Photos */}
                {GALLERY_ITEMS.map((item, idx) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-106 ${
                      idx === currentPhotoIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                ))}

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 z-15 pointer-events-none" />

                {/* Floating Left/Right Navigation Arrows */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPhoto();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/45 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md shadow-md"
                  title="Ảnh trước"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPhoto();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-25 w-8 h-8 rounded-full bg-black/45 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md shadow-md"
                  title="Ảnh kế tiếp"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Top-Left Category Badge */}
                <div className="absolute top-3.5 left-3.5 z-20">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md uppercase tracking-wider">
                    {currentPhoto.badge}
                  </span>
                </div>

                {/* Top-Right Action Arrow */}
                <div className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:border-primary transition-all shadow-md">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Bottom Image Caption, Info & Navigation Dots Overlay */}
                <div className="relative p-5 z-20 text-white flex items-end justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h4 className="text-base sm:text-lg font-bold leading-snug drop-shadow-md text-white group-hover:text-emerald-300 transition-colors">
                      {currentPhoto.title}
                    </h4>
                    {currentPhoto.subtitle && (
                      <p className="text-xs sm:text-sm text-white/80 line-clamp-1 leading-relaxed">
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
                            ? "w-5 h-1.5 bg-emerald-400 shadow-xs"
                            : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Ảnh ${idx + 1}`}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banner Dọc: Trải Nghiệm Thực Tế Ảo 3D Di Tích */}
            <div
              onClick={() => {
                navigate("/app");
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 300);
              }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 shadow-lg hover:shadow-xl bg-gradient-to-br from-card via-card to-emerald-50/50 dark:to-emerald-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 cursor-pointer transition-all duration-300 hover:border-emerald-500/50"
            >
              {/* Vertical 3D Banner Art Thumbnail (Poster Showcase Devices) */}
              <div className="relative w-full sm:w-32 h-36 sm:h-32 rounded-xl overflow-hidden shrink-0 shadow-md border border-emerald-500/20 bg-slate-900/10">
                <img
                  src={posterQuangCaoDevices}
                  alt="Không Gian Di Sản 3D"
                  className="w-full h-full object-cover object-[center_55%] group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Information & Action */}
              <div className="flex-1 space-y-2 text-left w-full">
                <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                  Khám Phá Di Tích & Đô Thị Phường Bình Long
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  Công nghệ số hóa không gian ba chiều kết nối chiều sâu văn hóa lịch sử với nhịp sống đô thị văn minh.
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMapDialogOpen(true);
                    }}
                    className="h-8 rounded-lg text-xs font-semibold border-border hover:bg-secondary cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 mr-1 text-primary" />
                    Mở sơ đồ di tích
                  </Button>
                  <span className="inline-flex items-center text-xs font-semibold text-primary group-hover:underline cursor-pointer">
                    Vào không gian VR
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
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
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
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
            src: posterQuangCaoBinhLongVR,
            title: "Poster Quảng Cáo – Bản Đồ Số Bình Long VR",
            description: "Khám phá di sản văn hóa trong tầm tay với công nghệ thực tế ảo 360°",
          },
          {
            src: posterQuangCaoDevices,
            title: "Showcase Đa Nền Tảng Thiết Bị",
            description: "Trực quan hóa trên điện thoại, máy tính bảng và máy tính để bàn",
          },
        ] as any}
        plugins={[Zoom]}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  );
}
