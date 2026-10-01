import { ArrowUpRight, CirclePlay, Gamepad2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";

import MapBlock from "../block/MapBlock";
import { AuroraText } from "@/components/magicui/aurora-text";
import { GridPattern } from "../magicui/grid-pattern";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useVRStore from "@/store/vr.store";
import { RiChatAiFill } from "react-icons/ri";

export default function HeroSection() {
  const navigate = useNavigate();
  const { setIsLoading } = useVRStore((state) => state);
  return (
    <div className="relative pt-28 pb-0 w-full flex flex-col gap-8 items-center justify-center">
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
      <div className="relative z-[20] text-center max-w-2xl px-4 sm:px-6">
        <Badge className="rounded-full py-2 px-3 text-md bg-white/90 border border-border text-foreground shadow-xs">
          Công nghệ{" "}
          <Badge className="text-primary-foreground py-1 rounded-full !bg-primary ml-1">
            VR
          </Badge>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight text-foreground">
          Bản đồ số khu vực
          <br />
          <AuroraText>Phường Bình Long</AuroraText>
        </h1>
        <p className="mt-6 text-[17px] md:text-lg text-muted-foreground">
          Khám phá truyền thống - Lịch sử - văn hoá bằng Công nghệ Số.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center z-[30] justify-center gap-3 sm:gap-4 w-full max-w-4xl">
          <Button
            size="lg"
            className="rounded-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md w-full sm:w-auto min-w-[140px]"
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
            className="rounded-full cursor-pointer backdrop-blur-xl border border-border bg-white/90 text-foreground hover:bg-secondary/80 hover:text-foreground text-base font-medium shadow-xs w-full sm:w-auto min-w-[130px]"
          >
            <Gamepad2 className="!h-5 !w-5 text-primary" />
            <span className="hidden sm:inline">Trò chơi Lịch sử</span>
            <span className="sm:hidden">Trò chơi</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full cursor-pointer backdrop-blur-xl border border-border bg-white/90 text-foreground hover:bg-secondary/80 hover:text-foreground text-base font-medium shadow-xs w-full sm:w-auto min-w-[130px]"
          >
            <RiChatAiFill className="!h-5 !w-5 text-primary" />
            <span className="">AI Chatbot</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full cursor-pointer backdrop-blur-xl border border-border bg-white/90 text-foreground hover:bg-secondary/80 hover:text-foreground text-base font-medium shadow-xs w-full sm:w-auto min-w-[130px]"
          >
            <CirclePlay className="!h-5 !w-5 text-primary" />
            <span className="hidden sm:inline">Video 360</span>
            <span className="sm:hidden">Video</span>
          </Button>
        </div>
      </div>
      <div className="relative mt-4 w-full h-[500px] sm:h-[600px] lg:h-[720px] border-y border-border bg-card shadow-sm overflow-hidden z-[20]">
        <MapBlock
          opened={true}
          setOpened={() => {}}
          showMedia={() => {}}
          className="rounded-none p-0"
        />
      </div>
    </div>
  );
}
