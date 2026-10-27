import { useRef, useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Globe,
  X,
  Eye,
} from "lucide-react";
import { useNavigate, createSearchParams } from "react-router-dom";
import useVRStore from "@/store/vr.store";
import { cn } from "@/lib/utils";

export interface FeaturedPlace {
  hotspot_id: number;
  panorama_id: string;
  badge: string;
  badgeColor: string;
  shortName: string;
  fullName: string;
  address: string;
  image: string;
}

export const FEATURED_PLACES: FeaturedPlace[] = [
  {
    hotspot_id: 132,
    panorama_id: "M3000_0_FLYCAM_1",
    badge: "Di tích Quốc gia",
    badgeColor: "bg-emerald-600 text-white",
    shortName: "Mộ 3.000 người",
    fullName: "Di tích Lịch sử cấp Quốc gia Mộ 3.000 người",
    address: "Khu phố An Lộc, Phường Bình Long",
    image: "/landmarks/m3000_preview.jpg",
  },
  {
    hotspot_id: 130,
    panorama_id: "DTT_0_FLYCAM",
    badge: "Di tích cấp Tỉnh",
    badgeColor: "bg-amber-600 text-white",
    shortName: "Dinh Tỉnh Trưởng",
    fullName: "Di tích Nhà & Đường hầm An Lộc",
    address: "Khu phố Phú Đức, Phường Bình Long",
    image: "/landmarks/dtt_preview.jpg",
  },
  {
    hotspot_id: 131,
    panorama_id: "M7N_0_FLYCAM",
    badge: "Di tích cấp Tỉnh",
    badgeColor: "bg-blue-600 text-white",
    shortName: "Mộ 7 Người",
    fullName: "Mộ tập thể Lực lượng An ninh An Lộc",
    address: "Khu phố Bình An, Phường Bình Long",
    image: "/landmarks/m7n_preview.jpg",
  },
  {
    hotspot_id: 133,
    panorama_id: "HLT_0_FLYCAM",
    badge: "Di tích Lịch sử - Văn hóa",
    badgeColor: "bg-teal-600 text-white",
    shortName: "Chùa Hưng Lập Tự",
    fullName: "Di tích Lịch sử - Văn hóa Hưng Lập Tự",
    address: "Khu phố Phú Đức, Phường Bình Long",
    image: "/landmarks/hlt_preview.jpg",
  },
];

interface WelcomePlacesDialogBlockProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function WelcomePlacesDialogBlock({
  open,
  onOpenChange,
}: WelcomePlacesDialogBlockProps) {
  const navigate = useNavigate();
  const {
    isWelcomeDialogOpen,
    setIsWelcomeDialogOpen,
    selectHotspotAndPanorama,
    setIsLoading,
  } = useVRStore((state) => state);

  // Controlled or store-based open state
  const isOpen = open !== undefined ? open : isWelcomeDialogOpen;
  const setOpen = onOpenChange || setIsWelcomeDialogOpen;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Check scroll position
  const checkScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const total = FEATURED_PLACES.length;
    const itemWidth = scrollWidth / total;
    if (itemWidth > 0) {
      const idx = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(idx, 0), total - 1));
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isOpen) return;
    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);
    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [isOpen]);

  const scrollToPlace = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      const targetScroll =
        card.offsetLeft -
        container.offsetLeft -
        (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToPlace(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(FEATURED_PLACES.length - 1, activeIndex + 1);
    scrollToPlace(nextIdx);
  };

  // User chooses a landmark to start VR
  const handleSelectPlace = (hotspotId: number, panoramaId: string) => {
    selectHotspotAndPanorama(hotspotId, panoramaId);
    setOpen(false);
    navigate({
      pathname: "/app",
      search: createSearchParams({
        hotspot_id: String(hotspotId),
        panorama_id: panoramaId,
      }).toString(),
    });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        {/* Full-screen Dark backdrop overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Full Screen Dialog Container */}
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-[101] w-full h-full max-w-none m-0",
            "bg-gradient-to-b from-[#021710] via-[#05281c] to-[#010d09] text-white",
            "flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none focus:outline-none",
            "p-4 sm:p-6 md:p-8",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        >
          {/* Top Header: Title & Close Button (Badge removed as requested) */}
          <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center shrink-0 pt-2 pb-2">
            {/* Close (X) button top right */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-0 right-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-lg"
              title="Đóng hộp thoại"
              aria-label="Đóng hộp thoại"
              type="button"
            >
              <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>

            {/* Big, Clear, Bold Title */}
            <DialogPrimitive.Title className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              Chọn Địa Điểm Tham Quan
            </DialogPrimitive.Title>

            {/* Clear Subtitle for seniors and general public */}
            <DialogPrimitive.Description className="text-sm sm:text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto mt-2">
              Nhấn vào hình ảnh bên dưới để vào tham quan thực tế ảo 360°
            </DialogPrimitive.Description>
          </div>

          {/* Middle: 4 Landmark Boxes with Chevrons that only show on hover and do not overlay cards */}
          <div className="group/carousel relative w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center my-2 sm:my-4 px-2 sm:px-12 md:px-16">
            {/* Left Scroll Button: Shows only on hover, positioned outside cards to prevent overlay */}
            <button
              onClick={handlePrev}
              disabled={!canScrollLeft && activeIndex === 0}
              className={cn(
                "hidden sm:flex absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-30",
                "w-13 h-13 md:w-15 md:h-15 rounded-full bg-slate-900/95 text-white",
                "border-2 border-emerald-500/50 shadow-2xl items-center justify-center cursor-pointer",
                "opacity-0 group-hover/carousel:opacity-100 transition-all duration-300",
                "hover:bg-emerald-600 hover:scale-110 active:scale-95",
                (!canScrollLeft && activeIndex === 0) &&
                  "opacity-0 group-hover/carousel:opacity-25 cursor-not-allowed hover:scale-100 hover:bg-slate-900/95"
              )}
              title="Xem địa điểm trước"
              type="button"
            >
              <ChevronLeft className="w-8 h-8 stroke-[3]" />
            </button>

            {/* Right Scroll Button: Shows only on hover, positioned outside cards to prevent overlay */}
            <button
              onClick={handleNext}
              disabled={!canScrollRight && activeIndex === FEATURED_PLACES.length - 1}
              className={cn(
                "hidden sm:flex absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-30",
                "w-13 h-13 md:w-15 md:h-15 rounded-full bg-slate-900/95 text-white",
                "border-2 border-emerald-500/50 shadow-2xl items-center justify-center cursor-pointer",
                "opacity-0 group-hover/carousel:opacity-100 transition-all duration-300",
                "hover:bg-emerald-600 hover:scale-110 active:scale-95",
                (!canScrollRight && activeIndex === FEATURED_PLACES.length - 1) &&
                  "opacity-0 group-hover/carousel:opacity-25 cursor-not-allowed hover:scale-100 hover:bg-slate-900/95"
              )}
              title="Xem địa điểm kế tiếp"
              type="button"
            >
              <ChevronRight className="w-8 h-8 stroke-[3]" />
            </button>

            {/* Scrollable Track / Grid */}
            <div
              ref={scrollContainerRef}
              className={cn(
                "flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 sm:px-2",
                "w-full items-stretch no-scrollbar"
              )}
            >
              {FEATURED_PLACES.map((place, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <div
                    key={place.hotspot_id}
                    onClick={() => handleSelectPlace(place.hotspot_id, place.panorama_id)}
                    className={cn(
                      "snap-center shrink-0 flex flex-col justify-between",
                      // Responsive card width
                      "w-[270px] sm:w-[300px] md:w-[320px] lg:flex-1 lg:min-w-0",
                      "bg-slate-900/85 hover:bg-slate-800/95 border-2 border-slate-700/80 hover:border-emerald-400 rounded-3xl p-3.5 sm:p-4",
                      "cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 relative",
                      isSelected && "border-emerald-500 ring-2 ring-emerald-500/50"
                    )}
                  >
                    {/* BIG SQUARE IMAGE */}
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                      <img
                        src={place.image}
                        alt={place.shortName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                      />

                      {/* Top Relic Tag Badge */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={cn(
                            "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg",
                            place.badgeColor
                          )}
                        >
                          {place.badge}
                        </span>
                      </div>

                      {/* 360 View Indicator */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-md">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>360°</span>
                        </div>
                      </div>

                      {/* Dark gradient for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Information Text (Big, clean, never overflowing) */}
                    <div className="pt-4 pb-1 flex flex-col flex-1 justify-between text-center gap-3">
                      <div>
                        {/* Big Name */}
                        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors leading-snug">
                          {place.shortName}
                        </h3>

                        {/* Address */}
                        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">
                          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                      </div>

                      {/* Big Click Button (Tăng kích thước 10-15%) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlace(place.hotspot_id, place.panorama_id);
                        }}
                        className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl group-hover:shadow-emerald-500/30 transition-all cursor-pointer active:scale-95"
                      >
                        <span>Vào tham quan</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile swipe controls (Left/Right buttons on small screens) */}
            <div className="flex sm:hidden items-center justify-between px-4 mt-2">
              <button
                onClick={handlePrev}
                disabled={!canScrollLeft && activeIndex === 0}
                className="p-2.5 rounded-full bg-slate-800 text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {FEATURED_PLACES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToPlace(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      activeIndex === idx ? "w-6 bg-emerald-400" : "w-2 bg-white/30"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!canScrollRight && activeIndex === FEATURED_PLACES.length - 1}
                className="p-2.5 rounded-full bg-slate-800 text-white disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Center Button: Khám phá website (Tăng kích thước 10-15%) */}
          <div className="pt-2 pb-4 sm:pb-6 flex flex-col items-center justify-center shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="px-10 sm:px-14 py-4 sm:py-4.5 rounded-full border-2 border-emerald-400/60 bg-emerald-950/90 hover:bg-emerald-600 text-white text-lg sm:text-xl font-black flex items-center gap-3 shadow-2xl hover:shadow-emerald-600/40 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
              type="button"
            >
              <Globe className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
              <span>Khám phá website</span>
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
