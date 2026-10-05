import { useState } from "react";
import {
  Carousel,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
  CarouselContent,
} from "../ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useVRStore from "@/store/vr.store";
import type { Panorama } from "@/types/panoramas.service.type";

const getOptimizedThumbnail = (panorama: Panorama) => {
  // If preview_image is already a local WebP thumbnail, use it
  if (
    panorama.preview_image &&
    (panorama.preview_image.endsWith(".webp") ||
      panorama.preview_image.startsWith("/panoramas_thumb/"))
  ) {
    return panorama.preview_image;
  }
  // Otherwise default to the pre-generated lightweight 360x203 WebP
  if (panorama.panorama_id) {
    return `/panoramas_thumb/pan_${panorama.panorama_id}_thumb.webp`;
  }
  return panorama.preview_image;
};

const CarouselThumbItem = ({
  panorama,
  isActive,
  index,
  onClick,
}: {
  panorama: Panorama;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getOptimizedThumbnail(panorama));

  return (
    <CarouselItem
      onClick={onClick}
      className="pl-2 md:pl-3 basis-[30%] sm:basis-1/4 md:basis-1/5 lg:basis-1/6 cursor-pointer select-none"
    >
      <div
        className={`overflow-hidden group border p-0 w-full aspect-[16/9] relative rounded-md bg-secondary/50 shadow-xs transition-all ${
          isActive
            ? "border-2 border-emerald-600 ring-2 ring-emerald-500/40 scale-102"
            : "border-border hover:border-emerald-500/50"
        }`}
        title={panorama.title}
      >
        {/* Subtle skeleton shimmer until image decodes */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted/60 animate-pulse rounded-[5px]" />
        )}

        <img
          src={imgSrc}
          alt={panorama.title}
          width={360}
          height={203}
          loading={index < 5 ? "eager" : "lazy"}
          fetchPriority={index < 4 ? "high" : "low"}
          decoding="async"
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            // Graceful fallback to original preview_image if local WebP is missing
            if (panorama.preview_image && imgSrc !== panorama.preview_image) {
              setImgSrc(panorama.preview_image);
            }
          }}
          className={`group-hover:scale-105 transition-all ease-in-out duration-200 w-full h-full object-cover rounded-[5px] ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </CarouselItem>
  );
};

const PanoramaCarouselBlock = ({
  isBottomNavVisible,
  showMedia,
}: {
  isBottomNavVisible: boolean;
  showMedia: (panorama_id: string) => void;
}) => {
  const {
    currentPanorama,
    panoramas,
    setCurrentPanoramaById,
  } = useVRStore((state) => state);
  return (
    <>
      {/* Carousel Section with Animation */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isBottomNavVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-full flex bg-white/95 border-t border-border backdrop-blur-xl shadow-lg flex-col items-center justify-center px-1 sm:px-4 py-2 sm:py-3">
          <div className="px-1 sm:px-12 lg:px-16 w-full">
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
                containScroll: "trimSnaps",
              }}
              className="w-full max-w-full md:max-w-4xl lg:max-w-[75vw] mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-3">
                {panoramas.map((panorama, index) => (
                  <CarouselThumbItem
                    key={panorama.panorama_id || index}
                    panorama={panorama}
                    index={index}
                    isActive={currentPanorama?.panorama_id === panorama.panorama_id}
                    onClick={() => {
                      setCurrentPanoramaById(panorama.panorama_id);
                      showMedia(panorama.panorama_id);
                    }}
                  />
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex bg-white/95 hover:bg-secondary border border-border text-foreground hover:text-primary shadow-md !w-10 !h-10 sm:!w-11 sm:!h-11 -left-4 sm:-left-10 cursor-pointer transition-transform active:scale-90">
                <ChevronLeft className="!h-5 !w-5 sm:!h-6 sm:!w-6 stroke-[2.5]" />
              </CarouselPrevious>
              <CarouselNext className="hidden sm:flex bg-white/95 hover:bg-secondary border border-border text-foreground hover:text-primary shadow-md !w-10 !h-10 sm:!w-11 sm:!h-11 -right-4 sm:-right-10 cursor-pointer transition-transform active:scale-90">
                <ChevronRight className="!h-5 !w-5 sm:!h-6 sm:!w-6 stroke-[2.5]" />
              </CarouselNext>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanoramaCarouselBlock;
