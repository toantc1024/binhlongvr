import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  Compass,
  MapPin,
  Landmark,
  ArrowUpRight,
  Navigation2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "../magicui/text-animate";
import useVRStore from "@/store/vr.store";

// 3D Custom Assets (HCMUTE Green Satin Style)
import area3DIcon from "@/assets/3d-icons/area__binhlong-3d-icon.png";
import population3DIcon from "@/assets/3d-icons/population__binhlong-3d-icon.png";
import admin3DIcon from "@/assets/3d-icons/admin__binhlong-3d-icon.png";
import highway3DIcon from "@/assets/3d-icons/highway__binhlong-3d-icon.png";
import location3DIcon from "@/assets/3d-icons/location__binhlong-3d-icon.png";

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

const PHOTO_PAIRS = [
  { left: GALLERY_ITEMS[0], right: GALLERY_ITEMS[1] },
  { left: GALLERY_ITEMS[2], right: GALLERY_ITEMS[3] },
  { left: GALLERY_ITEMS[4], right: GALLERY_ITEMS[5] },
];

// 4 Administrative units merged
const MERGED_UNITS = [
  { name: "Phường An Lộc", origin: "Thị xã Bình Long" },
  { name: "Phường Hưng Chiến", origin: "Thị xã Bình Long" },
  { name: "Phường Phú Đức", origin: "Thị xã Bình Long" },
  { name: "Xã Thanh Bình", origin: "Huyện Hớn Quản" },
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
    badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  },
  {
    name: "An Lộc Nhà và Đường hầm",
    detail: "Dinh Tỉnh Trưởng Bình Long – Di tích cấp thành phố",
    type: "Di tích Cấp thành phố",
    hotspotId: 130,
    panoramaId: "DTT_0_FLYCAM",
    image: "/landmarks/dtt_preview.jpg",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    name: "Mộ tập thể LLVT an ninh An Lộc",
    detail: "Khu di tích Mộ 7 người – Tinh thần quả cảm kiên trung",
    type: "Di tích Cấp thành phố",
    hotspotId: 131,
    panoramaId: "M7N_0_FLYCAM",
    image: "/landmarks/m7n_preview.jpg",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    name: "Di tích lịch sử - văn hóa Hưng Lập Tự",
    detail: "Cổ tự linh thiêng & Phòng thuốc Nam phước thiện nhân đạo",
    type: "Di tích Văn hóa",
    hotspotId: 133,
    panoramaId: "HLT_0_FLYCAM",
    image: "/landmarks/hlt_preview.jpg",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
  },
];

export function OverviewSection() {
  const navigate = useNavigate();
  const { setIsLoading, setIsMapDialogOpen, selectHotspotAndPanorama } = useVRStore();
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  const handlePrevPair = () => {
    setCurrentPairIndex((prev) => (prev === 0 ? PHOTO_PAIRS.length - 1 : prev - 1));
  };

  const handleNextPair = () => {
    setCurrentPairIndex((prev) => (prev + 1) % PHOTO_PAIRS.length);
  };

  const currentPair = PHOTO_PAIRS[currentPairIndex];

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
          {/* LEFT COLUMN: OFFICIAL NARRATIVE, MERGED UNITS & BOUNDARIES */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            {/* Card 1: Official Establishment & Context */}
            <Card className="border border-border/60 shadow-md bg-card/85 backdrop-blur-sm p-5 sm:p-6 rounded-2xl flex-1 flex flex-col justify-between">
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

              {/* 04 Administrative Units Merged Chips */}
              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 mb-2.5">
                  <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    04 Đơn vị hợp nhất nguyên trạng thành lập Phường
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {MERGED_UNITS.map((unit, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-xl bg-secondary/70 text-foreground text-xs font-medium flex items-center justify-between border border-border/50"
                    >
                      <span className="font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {unit.name}
                      </span>
                      <span className="text-muted-foreground text-[11px]">{unit.origin}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Card 2: Tứ Cận Địa Lý (Geographical Boundaries) */}
            <Card className="border border-border/60 shadow-md bg-card p-5 sm:p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                    Tứ Cận Địa Lý Phường Bình Long
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-md">
                  Vị trí địa lý
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform -rotate-45" />
                    Phía Bắc
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp phường An Lộc</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform rotate-135" />
                    Phía Nam
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp phường Tân Khai</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform rotate-45" />
                    Phía Đông
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp xã Tân Quan</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform -rotate-135" />
                    Phía Tây
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp xã Minh Đức</span>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: 2 IMAGES ON TWO SIDES (2 ẢNH 2 BÊN) + 1 CARD 3D DUY NHẤT */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {/* Header / Pair Navigation Bar */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hình ảnh tiêu biểu Phường Bình Long
                </span>
                <span className="text-[11px] text-muted-foreground/80 font-medium">
                  ({currentPairIndex + 1}/{PHOTO_PAIRS.length})
                </span>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 mr-2">
                  {PHOTO_PAIRS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPairIndex(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        idx === currentPairIndex
                          ? "w-5 h-1.5 bg-emerald-500 shadow-xs"
                          : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      }`}
                      aria-label={`Bộ ảnh ${idx + 1}`}
                      type="button"
                    />
                  ))}
                </div>

                <button
                  onClick={handlePrevPair}
                  className="w-7 h-7 rounded-lg bg-card hover:bg-muted text-foreground flex items-center justify-center border border-border/60 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                  title="Bộ ảnh trước"
                  type="button"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextPair}
                  className="w-7 h-7 rounded-lg bg-card hover:bg-muted text-foreground flex items-center justify-center border border-border/60 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                  title="Bộ ảnh kế tiếp"
                  type="button"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2 Images on Two Sides (2 ảnh 2 bên) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1 min-h-[340px] sm:min-h-[380px]">
              {/* Left Image Card */}
              <Card
                onClick={() => handleCardAction(currentPair.left)}
                className="relative overflow-hidden !p-0 border border-border/60 shadow-lg hover:shadow-xl bg-card rounded-2xl group flex flex-col justify-end min-h-[280px] sm:min-h-[340px] cursor-pointer transition-all duration-300 hover:border-emerald-500/50"
              >
                <CardContent className="!p-0 relative h-full w-full overflow-hidden flex flex-col justify-end">
                  <img
                    src={currentPair.left.image}
                    alt={currentPair.left.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-106"
                    loading="lazy"
                  />
                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 pointer-events-none" />

                  {/* Top-Left Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md uppercase tracking-wider">
                      {currentPair.left.badge}
                    </span>
                  </div>

                  {/* Top-Right Action Arrow */}
                  <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:border-primary transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom Image Caption & Info Overlay */}
                  <div className="relative p-4 z-20 text-white">
                    <h4 className="text-sm sm:text-base font-bold leading-snug drop-shadow-md text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {currentPair.left.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-200/95 mt-1 drop-shadow-sm font-normal line-clamp-2 leading-relaxed">
                      {currentPair.left.subtitle}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="text-emerald-300 font-medium inline-flex items-center gap-1">
                        {currentPair.left.actionType === "vr" ? "Khám phá 3D" : "Xem vị trí"}
                      </span>
                      <span className="text-white/80 group-hover:text-white transition-colors flex items-center gap-0.5">
                        Xem chi tiết <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Image Card */}
              <Card
                onClick={() => handleCardAction(currentPair.right)}
                className="relative overflow-hidden !p-0 border border-border/60 shadow-lg hover:shadow-xl bg-card rounded-2xl group flex flex-col justify-end min-h-[280px] sm:min-h-[340px] cursor-pointer transition-all duration-300 hover:border-emerald-500/50"
              >
                <CardContent className="!p-0 relative h-full w-full overflow-hidden flex flex-col justify-end">
                  <img
                    src={currentPair.right.image}
                    alt={currentPair.right.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-106"
                    loading="lazy"
                  />
                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 pointer-events-none" />

                  {/* Top-Left Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md uppercase tracking-wider">
                      {currentPair.right.badge}
                    </span>
                  </div>

                  {/* Top-Right Action Arrow */}
                  <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 group-hover:border-primary transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom Image Caption & Info Overlay */}
                  <div className="relative p-4 z-20 text-white">
                    <h4 className="text-sm sm:text-base font-bold leading-snug drop-shadow-md text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {currentPair.right.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-200/95 mt-1 drop-shadow-sm font-normal line-clamp-2 leading-relaxed">
                      {currentPair.right.subtitle}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="text-emerald-300 font-medium inline-flex items-center gap-1">
                        {currentPair.right.actionType === "vr" ? "Khám phá 3D" : "Xem vị trí"}
                      </span>
                      <span className="text-white/80 group-hover:text-white transition-colors flex items-center gap-0.5">
                        Xem chi tiết <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 1 ẢNH 3D DUY NHẤT: Highlight Card with 3D Location Icon */}
            <Card className="border border-border/60 shadow-md bg-gradient-to-br from-card via-card to-emerald-50/40 dark:to-emerald-950/20 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 group hover:border-emerald-500/40 transition-all duration-300">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                    Không Gian Số Hóa & Trải Nghiệm Tương Tác
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Trực quan hóa toàn diện hệ thống di tích và không gian đô thị Phường Bình Long qua công nghệ ảnh toàn cảnh 360° và sơ đồ di tích số.
                </p>
              </div>

              {/* 3D Location Pin - 1 ảnh 3D duy nhất */}
              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-108 transition-transform duration-300 flex items-center justify-center pointer-events-none">
                <img
                  src={location3DIcon}
                  alt="3D Location Pin"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
            </Card>
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

          {/* 4 Full-Width Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {FEATURED_SITES.map((site) => (
              <div
                key={site.hotspotId}
                onClick={() => handleOpenVRSite(site.hotspotId, site.panoramaId)}
                className="group cursor-pointer rounded-2xl bg-card border border-border/60 hover:border-primary/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Preview with Category Badge */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="outline" className={`text-xs font-semibold backdrop-blur-md ${site.badgeColor}`}>
                      {site.type}
                    </Badge>
                  </div>

                  {/* Corner Arrow Icon */}
                  <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>

                  {/* Bottom Image Label */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10">
                    <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-md line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {site.name}
                    </h4>
                  </div>
                </div>

                {/* Content Description */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {site.detail}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/40">
                    <Button
                      size="sm"
                      className="w-full rounded-xl cursor-pointer bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-semibold text-xs sm:text-sm transition-all duration-200 shadow-none flex items-center justify-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:bg-white animate-pulse" />
                      Khám phá không gian 3D
                      <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </div>
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
    </section>
  );
}
