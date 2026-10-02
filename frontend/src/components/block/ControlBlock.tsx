import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "../ui/button";
import AbsoluteWrapper from "../ui/absolute-wrapper";
import { FiHome, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Check, ChevronsUpDown, Search, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import HotspotInfoDialogBlock from "./HotspotInfoDialogBlock";
import ShareDialogBlock from "./ShareDialogBlock";
import PanoramaCarouselBlock from "./PanoramaCarouselBlock";
import TutorialDialogBlock from "./TutorialDialogBlock";
import MapDialogBlock from "./MapDialogBlock";
import { useNavigate } from "react-router-dom";
import AssetActionPillBlock from "./AssetActionPillBlock";
import { PiInfoFill } from "react-icons/pi";
import { FiShare2 } from "react-icons/fi";
import useVRStore from "@/store/vr.store";
import { toast } from "sonner";

const ControlBlock = ({
  showMedia,
}: {
  showMedia: (mediaName: string) => void;
  muteAllAudio?: () => void;
  unmuteAllAudio?: () => void;
  getAudioState?: () => Promise<any>;
}) => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const {
    currentHotspot,
    currentPanorama,
    setCurrentPanoramaById,
    panoramas,
  } = useVRStore((state) => state);
  const navigate = useNavigate();

  const actionPills = [
    {
      id: "introduction",
      label: "Thông tin",
      icon: PiInfoFill,
    },
    { id: "share", label: "Chia sẻ", icon: FiShare2 },
  ];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  // Audio narration state & audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const prevHotspotIdRef = useRef<number | null>(currentHotspot?.hotspot_id ?? null);
  const userPausedRef = useRef<boolean>(false);

  const currentAudioUrl = useMemo(() => {
    return (currentHotspot?.metadata as any)?.audio_url || null;
  }, [currentHotspot]);

  useEffect(() => {
    if (currentPanorama) {
      setValue(currentPanorama.title);
    }
  }, [currentPanorama]);

  // Set gentle volume (small volume: 0.35) whenever audio element is mounted
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.35;
    }
  }, []);

  // Helper function to play audio with small volume (0.35) and handle browser autoplay policy
  const playAudioWithSmallVolume = (url: string, title?: string | null) => {
    if (!audioRef.current || userPausedRef.current) return;

    audioRef.current.volume = 0.35;
    audioRef.current.src = url;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingAudio(true);
          toast.info(`Thuyết minh: ${title || "Di tích"} (Âm lượng nhỏ)`, {
            id: "audio-info",
            duration: 3000,
          });
        })
        .catch((err) => {
          console.log("Autoplay waiting for user gesture:", err);
          setIsPlayingAudio(false);

          // Fallback: auto-play on first user interaction anywhere on screen
          const onFirstInteraction = () => {
            if (!userPausedRef.current && audioRef.current) {
              audioRef.current.volume = 0.35;
              audioRef.current
                .play()
                .then(() => {
                  setIsPlayingAudio(true);
                  toast.info(`Thuyết minh: ${title || "Di tích"} (Âm lượng nhỏ)`, {
                    id: "audio-info",
                    duration: 3000,
                  });
                })
                .catch(() => {});
            }
            window.removeEventListener("pointerdown", onFirstInteraction);
            window.removeEventListener("keydown", onFirstInteraction);
          };

          window.addEventListener("pointerdown", onFirstInteraction, {
            once: true,
          });
          window.addEventListener("keydown", onFirstInteraction, {
            once: true,
          });
        });
    }
  };

  // Auto-play audio on initial load after a small delay (600ms) with small volume
  useEffect(() => {
    if (!currentAudioUrl || userPausedRef.current) return;

    const timer = setTimeout(() => {
      playAudioWithSmallVolume(currentAudioUrl, currentHotspot?.title);
    }, 600);

    return () => clearTimeout(timer);
  }, []); // Run on initial load

  // When hotspot changes: automatically play the new place's narration with small volume
  useEffect(() => {
    if (!currentHotspot) return;
    const currentId = currentHotspot.hotspot_id;

    if (prevHotspotIdRef.current !== currentId) {
      prevHotspotIdRef.current = currentId;

      if (currentAudioUrl && !userPausedRef.current) {
        const timer = setTimeout(() => {
          playAudioWithSmallVolume(currentAudioUrl, currentHotspot.title);
        }, 500);

        return () => clearTimeout(timer);
      } else if (!currentAudioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlayingAudio(false);
      }
    }
  }, [currentHotspot, currentAudioUrl]);

  const handleToggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      userPausedRef.current = true;
      setIsPlayingAudio(false);
      toast.info("Đã tắt thuyết minh âm thanh");
    } else {
      if (!currentAudioUrl) {
        toast.warning("Địa điểm này chưa có bản thu thuyết minh");
        return;
      }
      userPausedRef.current = false;
      audioRef.current.volume = 0.35;
      audioRef.current.src = currentAudioUrl;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          toast.success(
            `Đang phát thuyết minh: ${currentHotspot?.title || "Di tích"} (Âm lượng nhỏ)`
          );
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlayingAudio(false);
          toast.error("Không thể phát âm thanh. Vui lòng thử lại!");
        });
    }
  };

  return (
    <>
      {/* Hidden HTML5 audio element for place-based narration */}
      <audio
        ref={audioRef}
        src={currentAudioUrl || undefined}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => setIsPlayingAudio(false)}
        preload="auto"
      />

      {/* Top Left Navigation: Home, Audio Toggle, Tutorial */}
      <AbsoluteWrapper
        top="0"
        zIndex={2}
        left="0"
        customClassName="flex m-2 sm:m-3 items-center px-1.5 py-1.5 sm:px-2 sm:py-2 h-auto rounded-full gap-2 sm:gap-2.5 flex-col shadow-xl border border-border/80 bg-white/95 backdrop-blur-2xl"
      >
        {/* Home / Back to website button */}
        <Button
          variant="ghost"
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-xs rounded-full hover:bg-secondary bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95"
          onClick={() => navigate("/")}
          aria-label="Về trang chủ website"
          title="Về trang chủ website"
        >
          <FiHome className="!size-6 sm:!size-7 text-foreground" />
        </Button>

        {/* Audio Narration Toggle Button */}
        <Button
          variant="ghost"
          className={cn(
            "w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-xs rounded-full border flex items-center justify-center cursor-pointer transition-all active:scale-95 relative",
            isPlayingAudio
              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md"
              : "hover:bg-secondary bg-white/95 text-foreground border-border"
          )}
          onClick={handleToggleAudio}
          aria-label={
            isPlayingAudio ? "Tắt thuyết minh âm thanh" : "Bật thuyết minh âm thanh"
          }
          title={
            isPlayingAudio ? "Tắt thuyết minh âm thanh" : "Bật thuyết minh âm thanh"
          }
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="!size-6 sm:!size-7 text-emerald-600 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </>
          ) : (
            <VolumeX className="!size-6 sm:!size-7 text-muted-foreground" />
          )}
        </Button>

        {/* Tutorial Dialog */}
        <TutorialDialogBlock />
      </AbsoluteWrapper>

      {/* Top Right Navigation: Search (opens Map Dialog) */}
      <div className="fixed top-2 right-2 sm:top-3 sm:right-3 z-50 flex flex-col gap-2">
        <Button
          variant="ghost"
          onClick={() => setIsMapDialogOpen(true)}
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-xl rounded-full hover:bg-secondary bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95 group"
          title="Tìm kiếm di tích & Bản đồ số"
          aria-label="Tìm kiếm di tích & Bản đồ số"
        >
          <Search className="!size-6 sm:!size-7 text-foreground group-hover:scale-110 transition-transform" />
        </Button>

        <MapDialogBlock
          showMedia={showMedia}
          opened={isMapDialogOpen}
          setOpened={setIsMapDialogOpen}
        />
      </div>

      {/* Top Center Location Title Banner */}
      <div className="absolute w-full top-2 sm:top-3 flex flex-col items-center justify-center pointer-events-none px-16 z-20">
        {currentHotspot && (
          <div className="pointer-events-auto py-1.5 px-4 sm:py-2 sm:px-6 font-bold text-foreground text-xs sm:text-sm md:text-base lg:text-lg bg-white/95 rounded-full border border-border max-w-[70vw] sm:max-w-[50vw] overflow-hidden text-ellipsis whitespace-nowrap shadow-xl backdrop-blur-2xl">
            {currentHotspot?.title}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <AbsoluteWrapper
        zIndex={1}
        customClassName="bottom-0 left-0 w-full flex flex-col justify-center items-center"
      >
        <div className="w-full bg-white/95 border-t border-border backdrop-blur-2xl shadow-2xl py-2 sm:py-2.5 px-2 sm:px-4">
          <div className="relative">
            <div className="z-[1] flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none w-full max-w-full mx-auto px-1">
              {/* Centered Panorama Selector Popover */}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="bg-white hover:bg-secondary text-foreground border border-border rounded-full h-11 sm:h-12 px-3 sm:px-4 min-w-[210px] sm:min-w-[250px] max-w-[280px] sm:max-w-[340px] justify-between overflow-hidden cursor-pointer shadow-xs font-semibold text-xs sm:text-sm shrink-0"
                  >
                    <span className="truncate capitalize text-foreground text-left">
                      Bạn đang ở {currentPanorama?.title}
                    </span>
                    <ChevronsUpDown className="text-foreground opacity-80 shrink-0 ml-2 !size-5 stroke-[2.5]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  className="border border-border w-[280px] sm:w-[320px] !rounded-2xl bg-white/95 backdrop-blur-2xl p-0 shadow-2xl"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command className="bg-transparent border-none text-foreground">
                    <CommandInput
                      placeholder="Tìm panorama..."
                      className="h-11 text-foreground placeholder:text-muted-foreground text-sm font-medium"
                    />
                    <CommandList>
                      <CommandEmpty className="text-muted-foreground p-4 text-center text-sm">
                        Không tìm thấy panorama
                      </CommandEmpty>
                      <CommandGroup className="p-1.5 max-h-60 overflow-y-auto">
                        {panoramas.map((panorama, index) => (
                          <CommandItem
                            className={cn(
                              `text-foreground hover:bg-secondary rounded-xl cursor-pointer border border-transparent ${
                                index === panoramas.length - 1 ? "" : "mb-1"
                              } font-medium px-3 py-2 text-sm transition-colors`,
                              value === panorama.title
                                ? "bg-secondary text-primary font-bold border-border"
                                : ""
                            )}
                            key={panorama.panorama_id}
                            defaultChecked={
                              currentPanorama?.title === panorama.title
                            }
                            value={panorama.title}
                            onSelect={(currentValue) => {
                              setValue(currentValue);
                              setOpen(false);
                              setCurrentPanoramaById(panorama.panorama_id);
                              showMedia(panorama.panorama_id);
                            }}
                          >
                            <span className="truncate flex-1">{panorama.title}</span>
                            <Check
                              className={cn(
                                "ml-2 text-primary !size-5 shrink-0",
                                value === panorama.title
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <AssetActionPillBlock
                hotspot={currentHotspot}
                showMedia={showMedia}
              />

              {actionPills.map((pill) => {
                if (pill.id === "introduction") {
                  return (
                    <HotspotInfoDialogBlock
                      key={pill.id}
                      hotspot={currentHotspot}
                      panoramas={panoramas}
                      pill={pill}
                    />
                  );
                }

                if (pill.id === "share") {
                  return (
                    <ShareDialogBlock
                      key={pill.id}
                      pill={pill}
                      shareData={{
                        title:
                          currentHotspot?.title ||
                          currentPanorama?.title ||
                          "Bản Đồ Số VR Di Tích Phường Bình Long - Thực Tế Ảo 360°",
                        description:
                          currentHotspot?.description ||
                          "Khám phá các di tích lịch sử và văn hóa Phường Bình Long, Thành phố Đồng Nai qua công nghệ thực tế ảo tương tác đa chiều.",
                        url:
                          typeof window !== "undefined"
                            ? window.location.href
                            : "https://bandosobinhlong.vn",
                      }}
                    />
                  );
                }

                return null;
              })}

              {/* Carousel Toggle Button */}
              <Button
                variant="outline"
                className="h-11 sm:h-12 px-3.5 sm:px-4 shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer font-semibold text-xs sm:text-sm shrink-0 transition-all active:scale-95"
                onClick={() => setIsBottomNavVisible(!isBottomNavVisible)}
                aria-label={
                  isBottomNavVisible ? "Ẩn danh sách ảnh" : "Hiện danh sách ảnh"
                }
              >
                {isBottomNavVisible ? (
                  <FiChevronDown className="!size-5 sm:!size-5.5 mr-1.5 text-foreground stroke-[2.5]" />
                ) : (
                  <FiChevronUp className="!size-5 sm:!size-5.5 mr-1.5 text-foreground stroke-[2.5]" />
                )}
                <span>{isBottomNavVisible ? "Ẩn" : "Hiện"}</span>
              </Button>
            </div>
          </div>
        </div>

        <PanoramaCarouselBlock
          isBottomNavVisible={isBottomNavVisible}
          showMedia={showMedia}
        />
      </AbsoluteWrapper>
    </>
  );
};
export default ControlBlock;
