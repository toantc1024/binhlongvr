import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BINHLONG_LANDMARK_SLIDES = [
  {
    image: "/landmarks/mo_3000_nguoi.jpg",
    title: "Di tích Lịch sử Mộ 3.000 người",
    subtitle: "Khu tưởng niệm cấp Quốc gia - An Lộc, Bình Long",
    tag: "Di tích Lịch sử",
  },
  {
    image: "/landmarks/nga_nam_binh_long.jpg",
    title: "Ngã Năm Thị Xã Bình Long",
    subtitle: "Giao lộ lịch sử chứng nhân qua các thời kỳ",
    tag: "Đô thị & Văn hoá",
  },
  {
    image: "/landmarks/phat_quoc_van_thanh.jpg",
    title: "Chùa Phật Quốc Vạn Thành",
    subtitle: "Quần thể tâm linh hùng vĩ giữa rừng xanh Bình Long",
    tag: "Thắng cảnh Tâm linh",
  },
  {
    image: "/landmarks/binh_long_sunset.jpg",
    title: "Toàn cảnh Thị xã Bình Long",
    subtitle: "Bình yên giữa bạt ngàn vườn cao su xanh mát",
    tag: "Thiên nhiên & Đất trời",
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
      className="relative w-full h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] overflow-hidden rounded-xl bg-slate-900 group select-none"
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

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        aria-label="Hình trước"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Hình tiếp theo"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
      >
        <ChevronRight className="w-5 h-5" />
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
