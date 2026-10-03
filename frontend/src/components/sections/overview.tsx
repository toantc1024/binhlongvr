import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  Compass,
  MapPin,
  Landmark,
  ArrowUpRight,
  ShieldCheck,
  Navigation2,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TextAnimate } from "../magicui/text-animate";
import useVRStore from "@/store/vr.store";

// 3D Custom Assets
import area3DIcon from "@/assets/3d-icons/area__binhlong-3d-icon.png";
import population3DIcon from "@/assets/3d-icons/population__binhlong-3d-icon.png";
import admin3DIcon from "@/assets/3d-icons/admin__binhlong-3d-icon.png";
import highway3DIcon from "@/assets/3d-icons/highway__binhlong-3d-icon.png";
import landmark3DIcon from "@/assets/3d-icons/landmark-explore__binhlong-3d-icon.png";
import location3DIcon from "@/assets/3d-icons/location__binhlong-3d-icon.png";

// 4 Key Stats with 3D Assets
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
    subtitle: "Không gian đô thị văn minh, hiện đại và năng động – Cửa ngõ kết nối phía Bắc",
    badge: "Đô thị Bình Long",
    image: "/landmarks/do_thi_binh_long.jpg",
  },
  {
    id: "mo3000",
    title: "Di tích Quốc gia Mộ 3.000 người",
    subtitle: "Mộ 3000 đồng bào An Lộc bị đế quốc Mỹ tàn sát ngày 03/10/1972",
    badge: "Di tích Quốc gia",
    image: "/landmarks/mo_3000_tuong_niem.jpg",
  },
  {
    id: "congchao",
    title: "Trụ sở Đảng bộ – UBND Phường Bình Long",
    subtitle: "Cổng chào Đại hội Đại biểu Đảng bộ Phường Bình Long lần thứ I, nhiệm kỳ 2025 - 2030",
    badge: "Trụ sở Hành chính",
    image: "/images/phuong_binh_long/phuong_binh_long_tru_so_cong_chao.jpg",
  },
  {
    id: "dieuhanh",
    title: "Đoàn xe diễu hành chào mừng Đại hội",
    subtitle: "Không khí hân hoan, rực rỡ cờ hoa trên các tuyến đại lộ Phường Bình Long",
    badge: "Sự kiện lịch sử",
    image: "/images/phuong_binh_long/phuong_binh_long_dieu_hanh.jpg",
  },
  {
    id: "hoasen",
    title: "Tuyến phố trung tâm & Cụm Hoa sen",
    subtitle: "Tuyến phố sầm uất với cụm biểu tượng đóa sen Bình Long vươn cao kiêu hãnh",
    badge: "Đô thị trung tâm",
    image: "/images/phuong_binh_long/phuong_binh_long_tuyen_pho_hoa_sen.jpg",
  },
  {
    id: "giaolo",
    title: "Giao lộ kết nối Quốc lộ 13",
    subtitle: "Tuyến giao thông huyết mạch nối TP. Hồ Chí Minh với Cửa khẩu Hoa Lư",
    badge: "Huyết mạch giao thông",
    image: "/images/phuong_binh_long/phuong_binh_long_giao_lo_trung_tam.jpg",
  },
];

// 4 Administrative units merged
const MERGED_UNITS = [
  { name: "P. An Lộc", origin: "TX. Bình Long" },
  { name: "P. Hưng Chiến", origin: "TX. Bình Long" },
  { name: "P. Phú Đức", origin: "TX. Bình Long" },
  { name: "X. Thanh Bình", origin: "H. Hớn Quản" },
];

// Featured historical sites with corresponding hotspot ID in store
const FEATURED_SITES = [
  {
    name: "Di tích Quốc gia Mộ 3.000 người",
    detail: "Mộ 3000 đồng bào An Lộc bị đế quốc Mỹ tàn sát ngày 03/10/1972 (Mộ tập thể 3000 người)",
    type: "Di tích Quốc gia",
    hotspotId: 132,
    panoramaId: "M3000_0_FLYCAM_1",
    tagColor: "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10",
  },
  {
    name: "An Lộc Nhà và Đường hầm",
    detail: "Dinh Tỉnh Trưởng Bình Long – Di tích cấp thành phố",
    type: "Di tích Cấp thành phố",
    hotspotId: 130,
    panoramaId: "DTT_0_FLYCAM",
    tagColor: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  {
    name: "Mộ tập thể LLVT an ninh An Lộc",
    detail: "Khu di tích Mộ 7 người – Tinh thần quả cảm kiên trung",
    type: "Di tích Cấp thành phố",
    hotspotId: 131,
    panoramaId: "M7N_0_FLYCAM",
    tagColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  {
    name: "Di tích lịch sử - văn hóa Hưng Lập Tự",
    detail: "Cổ tự linh thiêng & Phòng thuốc Nam phước thiện nhân đạo",
    type: "Di tích Văn hóa",
    hotspotId: 133,
    panoramaId: "HLT_0_FLYCAM",
    tagColor: "border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/10",
  },
];

export function OverviewSection() {
  const navigate = useNavigate();
  const { setIsLoading, setIsMapDialogOpen, selectHotspotAndPanorama } = useVRStore();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const activeImage = GALLERY_ITEMS[activeGalleryIndex];

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

      {/* Synchronized full width container matching other components */}
      <div className="w-full">
        {/* Section Header: Clean, Bold, Align Left */}
        <div className="w-full mb-8 sm:mb-10">
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

        {/* 4 Stat Cards with 3D Assets - Full Width & Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mb-8 sm:mb-10">
          {STATS_DATA.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/60 shadow-md bg-card p-4 sm:p-5 lg:p-6 flex flex-col justify-between group hover:shadow-xl hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </span>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mt-1">
                    {stat.value}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {stat.unit}
                  </p>
                </div>

                {/* Transparent 3D Asset */}
                <div className="shrink-0 w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 group-hover:scale-108 transition-transform duration-300 flex items-center justify-center pointer-events-none -mr-1 -mt-1">
                  <img
                    src={stat.icon}
                    alt={stat.title}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              </div>

              <p className="mt-3 text-[11px] sm:text-xs text-muted-foreground font-normal leading-relaxed border-t border-border/40 pt-2 line-clamp-1">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* 2-Column Split: Detailed Content on Left, Image Showcase on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
          {/* ================= LEFT COLUMN: DETAILED INFO ================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Main Overview Narrative Text Box */}
            <Card className="border border-border/60 shadow-md bg-card/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl relative overflow-hidden">
              <div className="space-y-3.5 text-sm sm:text-base text-foreground/90 font-normal leading-relaxed text-justify">
                <p>
                  <strong>Phường Bình Long</strong> được thành lập theo{" "}
                  <span className="font-semibold text-primary">
                    Nghị quyết số 1662/2025/NQ-UBTVQH
                  </span>{" "}
                  ngày 16/6/2025 của Ủy ban Thường vụ Quốc hội, trên cơ sở sắp xếp, hợp nhất nguyên trạng diện tích tự nhiên và dân số từ các phường <strong>An Lộc, Hưng Chiến, Phú Đức</strong> của thị xã Bình Long và xã <strong>Thanh Bình</strong> của huyện Hớn Quản, với tổng diện tích tự nhiên đạt <strong>49,14 km²</strong>; Phía bắc giáp phường An Lộc; phía nam giáp phường Tân Khai; phía đông giáp xã Tân Quan; phía Tây giáp xã Minh Đức.
                </p>

                <p>
                  Toàn phường có <strong>09 khu phố</strong>; dân số của toàn phường trên <strong>40.000 người</strong>. Phường Bình Long có vị trí địa lý chiến lược nằm trên tuyến <strong>Quốc lộ 13</strong> – tuyến đường giao thông huyết mạch nối Thành phố Hồ Chí Minh với Cửa khẩu Hoa Lư, là cửa ngõ kết nối vùng Đông Nam Bộ với Campuchia.
                </p>

                <p>
                  Bình Long là vùng đất có bề dày truyền thống cách mạng. Trên địa bàn phường Bình Long có những di tích văn hóa, lịch sử đã ghi dấu một thời hào hùng của Đảng bộ và nhân dân Bình Long. Xin mời quý vị cùng khám phá Bản đồ số Bình Long, cùng tham quan trải nghiệm không gian ảo 3D tìm hiểu các di tích lịch sử - văn hóa tiêu biểu trên địa bàn phường.
                </p>
              </div>

              {/* Administrative Merged Chips */}
              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 mb-2.5">
                  <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    04 Đơn vị hợp nhất nguyên trạng thành lập Phường
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {MERGED_UNITS.map((unit, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-secondary/80 text-foreground text-xs font-medium flex items-center gap-1.5 border border-border/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold">{unit.name}</span>
                      <span className="text-muted-foreground text-[11px]">({unit.origin})</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Tứ Cận Địa Lý (Geographical Boundaries) */}
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
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform -rotate-45" />
                    Phía Bắc
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp phường An Lộc</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform rotate-135" />
                    Phía Nam
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp phường Tân Khai</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform rotate-45" />
                    Phía Đông
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp xã Tân Quan</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
                    <Navigation2 className="w-3.5 h-3.5 transform -rotate-135" />
                    Phía Tây
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Giáp xã Minh Đức</span>
                </div>
              </div>
            </Card>

            {/* Featured Historical Sites (Di tích văn hóa - lịch sử tiêu biểu) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                    Di Tích Lịch Sử – Văn Hóa Tiêu Biểu
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">Nhấp để xem VR 360°</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEATURED_SITES.map((site) => (
                  <div
                    key={site.hotspotId}
                    onClick={() => handleOpenVRSite(site.hotspotId, site.panoramaId)}
                    className="group cursor-pointer p-3.5 rounded-xl bg-card border border-border/60 hover:border-primary/50 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <Badge variant="outline" className={`text-[11px] font-medium ${site.tagColor}`}>
                          {site.type}
                        </Badge>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {site.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {site.detail}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Khám phá không gian 3D
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                className="rounded-xl cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs"
                onClick={() => {
                  navigate("/app");
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 300);
                }}
              >
                Khám phá bản đồ số Bình Long
                <ArrowUpRight className="!h-5 !w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-xl cursor-pointer bg-card hover:bg-secondary text-foreground text-sm font-medium shadow-xs"
                onClick={() => setIsMapDialogOpen(true)}
              >
                <MapPin className="!h-4 !w-4 text-primary" />
                Mở sơ đồ di tích
              </Button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: LIVELY IMAGE SHOWCASE ================= */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Primary Main Showcase Image Card */}
            <Card className="relative overflow-hidden !p-0 border border-border/60 shadow-xl bg-card rounded-2xl group flex flex-col">
              <CardContent className="!p-0 relative h-[340px] sm:h-[420px] lg:h-[460px] w-full overflow-hidden">
                <img
                  src={activeImage.image}
                  alt={activeImage.title}
                  className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 pointer-events-none" />

                {/* Floating Top-Right 3D Pill Badge */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg text-white text-xs select-none">
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                    <img
                      src={landmark3DIcon}
                      alt="Landmark 3D Icon"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <span className="font-medium tracking-wide">Bình Long VR 360°</span>
                </div>

                {/* Floating Top-Left Tag */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-md shadow-md uppercase tracking-wider">
                    {activeImage.badge}
                  </span>
                </div>

                {/* Bottom Image Caption & Info Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-md text-white">
                    {activeImage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200/95 mt-1.5 drop-shadow-sm font-normal leading-relaxed">
                    {activeImage.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Route className="w-3.5 h-3.5 text-emerald-400" />
                      Quốc lộ 13 – Cửa khẩu Hoa Lư
                    </span>
                    <button
                      onClick={() => setIsMapDialogOpen(true)}
                      className="text-white hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Xem bản đồ <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Thumbnail Selector Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {GALLERY_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveGalleryIndex(index)}
                  className={`group relative h-16 sm:h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                    activeGalleryIndex === index
                      ? "border-primary shadow-md ring-2 ring-primary/20 scale-[1.02]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  title={item.title}
                  type="button"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-1 inset-x-0.5 text-[9px] sm:text-[10px] font-semibold text-white drop-shadow-md truncate text-center px-0.5">
                    {item.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Highlight Card with 3D Location Icon */}
            <Card className="border border-border/60 shadow-md bg-gradient-to-br from-card via-card to-emerald-50/30 dark:to-emerald-950/20 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-sm font-semibold text-foreground">
                    Khám phá & Trải nghiệm thực tế
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tìm hiểu chi tiết các di tích lịch sử - văn hóa tiêu biểu và không gian 3D tương tác sống động trên Bản đồ số Bình Long.
                </p>
              </div>

              <div className="shrink-0 w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center pointer-events-none">
                <img
                  src={location3DIcon}
                  alt="3D Location Pin"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
