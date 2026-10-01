import { ArrowUpRight, CirclePlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import MapBlock from "../block/MapBlock";
import BinhLongImageCarousel from "../block/BinhLongImageCarousel";
import viewCountIcon from "@/assets/3d-icons/view-count__binhlong-3d-icon.png";
import { AuroraText } from "@/components/magicui/aurora-text";
import { GridPattern } from "../magicui/grid-pattern";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useVRStore from "@/store/vr.store";

export default function HeroSection() {
  const navigate = useNavigate();
  const { setIsLoading } = useVRStore((state) => state);
  return (
    <div className="relative pt-24 pb-10 w-full flex flex-col gap-6 items-center justify-center">
      <div className="top-0 z-[0] flex h-screen w-full flex-col items-center justify-center overflow-hidden absolute">
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
      </div>
      <div className="relative z-[20] text-left sm:text-center max-w-4xl px-4 sm:px-6 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold !leading-[1.25] tracking-tight text-foreground text-left sm:text-center">
          Bản đồ số khu vực
          <br />
          <AuroraText>Phường Bình Long</AuroraText>
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground font-normal text-left sm:text-center">
          Khám phá truyền thống - Lịch sử - văn hoá bằng Công nghệ Số.
        </p>
        <div className="mt-6 flex flex-row items-center z-[30] justify-start sm:justify-center gap-3 sm:gap-4 w-full">
          <Button
            size="lg"
            className="rounded-xl cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs w-auto min-w-[130px] sm:min-w-[140px]"
            onClick={() => {
              navigate("/app");
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 2000);
            }}
          >
            Bắt đầu <ArrowUpRight className="!h-5 !w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-xl cursor-pointer backdrop-blur-xl border-0 bg-secondary/80 hover:bg-secondary text-foreground text-sm sm:text-base font-normal shadow-xs w-auto min-w-[120px] sm:min-w-[130px]"
            onClick={() => {
              navigate("/app");
            }}
          >
            <CirclePlay className="!h-5 !w-5 text-primary" />
            <span className="hidden sm:inline">Video 360</span>
            <span className="sm:hidden">Video</span>
          </Button>
        </div>
      </div>
      <div className="relative mt-2 w-full px-4 sm:px-6 lg:px-8 z-[20]">
        <div className="absolute z-[0] -top-8 left-1/2 -translate-x-1/2 w-[85%] h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 2-Column Split: Map on Left, Carousel & View Count on Right */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* Left Column: 3D Goong Map (reduced height by 20%) */}
          <div className="lg:col-span-7 flex flex-col">
            <Card className="relative overflow-hidden !p-0 h-[384px] sm:h-[432px] lg:h-[496px] w-full border-0 shadow-lg bg-card rounded-xl">
              <CardContent className="h-full w-full !p-0 relative">
                <MapBlock
                  opened={true}
                  setOpened={() => {}}
                  showMedia={() => {}}
                  className="rounded-xl h-full w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: 4K Carousel + View Count */}
          <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
            {/* Top: 4K Carousel of Bình Long (reduced height by 20%) */}
            <Card className="relative overflow-hidden !p-0 flex-1 min-h-[256px] sm:min-h-[304px] border-0 shadow-lg bg-card rounded-xl flex flex-col">
              <BinhLongImageCarousel />
            </Card>

            {/* Bottom: View Count Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-emerald-50/40 p-5 sm:p-6 rounded-xl group transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
                      1,520+
                    </span>
                    <span className="text-emerald-600 font-medium text-lg sm:text-xl">
                      lượt xem
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground font-normal">
                    đã được thực hiện trong khu vực.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-normal">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Khám phá di tích & thực tế ảo 360°
                  </div>
                </div>
                {/* 3D Asset: Transparent, no border or shadow behind */}
                <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <img
                    src={viewCountIcon}
                    alt="3D View Count Icon"
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
