import {
  Carousel,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
  CarouselContent,
} from "../ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useVRStore from "@/store/vr.store";

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
          isBottomNavVisible ? "max-h-36 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-full flex bg-white/95 border-t border-border backdrop-blur-xl shadow-lg flex-col items-center justify-center px-2 py-3 sm:py-4">
          <div className="px-8 sm:px-12 lg:px-16 w-full">
            <Carousel className="h-16 md:h-20 w-full max-w-full md:max-w-md lg:max-w-[60vw] mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {panoramas.map((panorama, index) => (
                  <CarouselItem
                    onClick={() => {
                      setCurrentPanoramaById(panorama.panorama_id);
                      showMedia(panorama.panorama_id);
                    }}
                    className={`pl-2 relative md:pl-4 basis-1/3 lg:basis-1/6 cursor-pointer`}
                    key={index}
                  >
                    <div
                      className={`overflow-hidden object-cover group border border-border p-0 h-16 relative md:h-20 rounded-xl bg-secondary/50 shadow-xs transition-all ${
                        currentPanorama?.panorama_id === panorama.panorama_id
                          ? "border-2 border-primary ring-2 ring-primary/40 scale-102"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={panorama.preview_image}
                        alt={panorama.title}
                        className="rounded-lg group-hover:scale-[1.1] transition-all ease-in-out duration-150 w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/95 hover:bg-secondary border border-border text-foreground hover:text-primary shadow-md !w-10 !h-10 sm:!w-11 sm:!h-11 -left-4 sm:-left-10 cursor-pointer transition-transform active:scale-90">
                <ChevronLeft className="!h-5 !w-5 sm:!h-6 sm:!w-6 stroke-[2.5]" />
              </CarouselPrevious>
              <CarouselNext className="bg-white/95 hover:bg-secondary border border-border text-foreground hover:text-primary shadow-md !w-10 !h-10 sm:!w-11 sm:!h-11 -right-4 sm:-right-10 cursor-pointer transition-transform active:scale-90">
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
