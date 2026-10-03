import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BINHLONG_LANDMARK_SLIDES = [
  {
    image: "/landmarks/do_thi_binh_long.jpg",
    title: "Toàn cảnh Đô thị Bình Long",
    subtitle: "Cửa ngõ chiến lược phía Bắc – Đô thị năng động và phát triển",
    tag: "Đô thị Bình Long",
  },
  {
    image: "/landmarks/mo_3000_tuong_niem.jpg",
    title: "Di tích Quốc gia Mộ 3.000 người",
    subtitle: "Khu tưởng niệm cấp Quốc gia – Mộ 3.000 đồng bào An Lộc",
    tag: "Di tích Quốc gia",
  },
  {
    image: "/landmarks/dtt_preview.jpg",
    title: "Dinh Tỉnh Trưởng Bình Long",
    subtitle: "Di tích Lịch sử cấp Thành phố – Nhà và Đường hầm An Lộc",
    tag: "Di tích Lịch sử",
  },
  {
    image: "/landmarks/m7n_preview.jpg",
    title: "Khu Di tích Mộ 7 Người",
    subtitle: "Mộ tập thể Lực lượng vũ trang An ninh An Lộc",
    tag: "Di tích Lịch sử",
  },
  {
    image: "/landmarks/hlt_preview.jpg",
    title: "Chùa Hưng Lập Tự",
    subtitle: "Cổ tự linh thiêng & Phòng thuốc Nam phước thiện",
    tag: "Di tích Văn hóa",
  },
];

export default function BinhLongImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BINHLONG_LANDMARK_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? BINHLONG_LANDMARK_SLIDES.length - 1 : prev - 1
    );
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative w-full h-full min-h-[240px] sm:min-h-[288px] lg:min-h-[320px] overflow-hidden rounded-xl bg-slate-900 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {BINHLONG_LANDMARK_SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
            loading="lazy"
          />
          {/* Subtle gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

          {/* Slide caption */}
          <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none text-white">
            <h3 className="text-lg sm:text-xl font-semibold leading-tight drop-shadow-md text-white">
              {slide.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200/90 mt-1 line-clamp-1 drop-shadow-sm font-normal">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Big prominent green-white navigation chevrons (shown on hover) */}
      <button
        onClick={prevSlide}
        aria-label="Hình trước"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white border-2 border-white/90 shadow-xl backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Hình tiếp theo"
        className="absolute right-3.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white border-2 border-white/90 shadow-xl backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 right-4 z-30 flex items-center gap-1.5">
        {BINHLONG_LANDMARK_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? "w-6 h-1.5 bg-emerald-400 shadow-xs"
                : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
