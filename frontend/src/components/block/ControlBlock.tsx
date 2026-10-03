import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "../ui/button";
import AbsoluteWrapper from "../ui/absolute-wrapper";
import { FiHome, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Check, ChevronsUpDown, Search, Volume2, VolumeX } from "lucide-react";
import { RiGlobalFill } from "react-icons/ri";
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
import { PiInfoFill } from "react-icons/pi";
import { FiShare2 } from "react-icons/fi";
import useVRStore from "@/store/vr.store";
import { toast } from "sonner";

const ControlBlock = ({
  showMedia,
  isActive = true,
}: {
  showMedia: (mediaName: string) => void;
  muteAllAudio?: () => void;
  unmuteAllAudio?: () => void;
  getAudioState?: () => Promise<any>;
  isActive?: boolean;
}) => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const {
    currentArea,
    getHotspotById,
    currentHotspot,
    currentPanorama,
    setCurrentPanoramaById,
    setCurrentHotspotById,
    setPanoramasByHotspotId,
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
  const activeAudioHotspotIdRef = useRef<number | null>(null);
  const userPausedRef = useRef<boolean>(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  const playAudioWithSmallVolume = (url: string) => {
    if (!audioRef.current || userPausedRef.current || !isActive) return;

    audioRef.current.volume = 0.35;
    if (audioRef.current.src !== url) {
      audioRef.current.src = url;
    }

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.log("Autoplay waiting for user gesture:", err);
          setIsPlayingAudio(false);

          // Fallback: auto-play on first user interaction anywhere on screen
          const onFirstInteraction = () => {
            if (!userPausedRef.current && audioRef.current && isActive) {
              audioRef.current.volume = 0.35;
              audioRef.current
                .play()
                .then(() => {
                  setIsPlayingAudio(true);
                })
                .catch(() => { });
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

  // Unified audio controller:
  // - Plays gently ONLY when active inside /app
  // - Plays ONCE per hotspot without duplicate or overlapping playback
  // - Instantly pauses when navigating away from /app
  // - Respects user manual pause
  useEffect(() => {
    if (!isActive) {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      activeAudioHotspotIdRef.current = null;
      return;
    }

    if (!currentHotspot) return;
    const currentId = currentHotspot.hotspot_id;

    // If audio is already active for this hotspot, do not replay or interrupt!
    if (activeAudioHotspotIdRef.current === currentId && isPlayingAudio) {
      return;
    }

    if (activeAudioHotspotIdRef.current !== currentId) {
      activeAudioHotspotIdRef.current = currentId;
      userPausedRef.current = false; // Reset pause when entering new hotspot

      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }

      if (!currentAudioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlayingAudio(false);
        return;
      }

      // Small delay (350ms) to ensure smooth transition
      playTimerRef.current = setTimeout(() => {
        playAudioWithSmallVolume(currentAudioUrl);
      }, 350);

      return () => {
        if (playTimerRef.current) {
          clearTimeout(playTimerRef.current);
        }
      };
    }
  }, [isActive, currentHotspot?.hotspot_id, currentAudioUrl]);

  const handleToggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      userPausedRef.current = true;
      setIsPlayingAudio(false);
    } else {
      if (!currentAudioUrl) {
        toast.warning("Địa điểm này chưa có bản thu thuyết minh");
        return;
      }
      userPausedRef.current = false;
      playAudioWithSmallVolume(currentAudioUrl);
    }
  };

  // Home button: Returns to main panorama of Mộ 3.000 người (Hotspot 132, M3000_0_FLYCAM_1)
  const handleGoToFlycamHome = async () => {
    const mainHotspotId = currentArea?.main_hotspot_id
      ? Number(currentArea.main_hotspot_id)
      : 132;
    const mainHotspot = getHotspotById(mainHotspotId);
    const targetPanoramaId =
      mainHotspot?.click_panorama_id || "M3000_0_FLYCAM_1";

    setCurrentHotspotById(mainHotspotId);
    await setPanoramasByHotspotId(mainHotspotId);
    setCurrentPanoramaById(targetPanoramaId);
    showMedia(targetPanoramaId);
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

      {/* Top Left Navigation: Website, Flycam Home, Audio Narration, Guide */}
      <AbsoluteWrapper
        top="0"
        zIndex={2}
        left="0"
        customClassName="flex m-2 sm:m-3 items-center px-1.5 py-1.5 sm:px-2 sm:py-2 h-auto rounded-full gap-2 sm:gap-2.5 flex-col shadow-xl border border-border/80 bg-white/95 backdrop-blur-2xl"
      >
        {/* Nút trở về Website */}
        <Button
          variant="ghost"
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-xs rounded-full hover:bg-emerald-50 hover:text-emerald-700 bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95 group"
          onClick={() => navigate("/")}
          aria-label="Trở về website"
          title="Trở về website"
        >
          <RiGlobalFill className="!size-6 sm:!size-7 text-emerald-600 group-hover:scale-110 transition-transform" />
        </Button>

        {/* Nút Home: Về main panorama Mộ 3.000 người */}
        <Button
          variant="ghost"
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-xs rounded-full hover:bg-emerald-50 hover:text-emerald-700 bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95 group"
          onClick={handleGoToFlycamHome}
          aria-label="Về toàn cảnh Mộ 3.000 người"
          title="Về toàn cảnh Mộ 3.000 người"
        >
          <FiHome className="!size-6 sm:!size-7 text-emerald-600 group-hover:scale-110 transition-transform" />
        </Button>

        {/* Nút Thuyết minh Âm thanh */}
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
            isPlayingAudio
              ? "Tắt thuyết minh âm thanh (Âm lượng nhỏ 35%)"
              : "Bật thuyết minh âm thanh"
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

        {/* Nút Hướng dẫn */}
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
          showMedia={(mediaName, hotspotId) => {
            if (hotspotId) {
              setCurrentHotspotById(hotspotId);
              setPanoramasByHotspotId(hotspotId);
            }
            showMedia(mediaName);
          }}
          opened={isMapDialogOpen}
          setOpened={setIsMapDialogOpen}
        />
      </div>

      {/* Top Center Location Title Banner */}
      <div className="absolute w-full top-2 sm:top-3 flex flex-col items-center justify-center pointer-events-none px-16 z-20">
        {currentHotspot && (
          <div className="pointer-events-auto py-2 px-5 sm:py-2.5 sm:px-7 font-bold text-foreground text-sm sm:text-base md:text-lg lg:text-xl bg-white/95 rounded-full border border-border max-w-[75vw] sm:max-w-[55vw] overflow-hidden text-ellipsis whitespace-nowrap shadow-xl backdrop-blur-2xl">
            {currentHotspot?.title}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <AbsoluteWrapper
        zIndex={1}
        customClassName="bottom-0 left-0 w-full flex flex-col justify-center items-center"
      >
        <div className="w-full bg-white/95 border-t border-border backdrop-blur-2xl shadow-2xl py-2.5 sm:py-3 px-2 sm:px-4">
          <div className="relative">
            <div className="z-[1] flex items-center justify-start lg:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none w-full max-w-full px-2 sm:px-4">
              {/* Centered Panorama Selector Popover with Wide Width on Mobile */}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="bg-white hover:bg-secondary text-foreground border border-border rounded-full h-12 sm:h-13 px-3.5 sm:px-5 min-w-[220px] sm:min-w-[270px] max-w-[320px] sm:max-w-[420px] items-center overflow-hidden cursor-pointer shadow-sm font-bold text-sm sm:text-base shrink-0 active:scale-95 transition-all"
                  >
                    <span className="!size-5 sm:!size-6 shrink-0 mr-1.5 opacity-0 pointer-events-none select-none" aria-hidden="true" />
                    <span className="truncate text-foreground text-center flex-1">
                      Bạn đang ở: {currentPanorama?.title}
                    </span>
                    <ChevronsUpDown className="text-foreground opacity-90 shrink-0 ml-1.5 !size-5 sm:!size-6 stroke-[2.5]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  side="top"
                  sideOffset={12}
                  className="border border-border w-[calc(100vw-24px)] max-w-md sm:w-[440px] !rounded-2xl bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl p-2 sm:p-2.5 shadow-2xl z-[100]"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command className="bg-transparent border-none text-foreground w-full">
                    <CommandInput
                      placeholder="Tìm kiếm góc nhìn panorama..."
                      className="h-12 text-foreground placeholder:text-muted-foreground text-sm sm:text-base font-medium px-3"
                    />
                    <CommandList className="max-h-72 sm:max-h-80 overflow-y-auto mt-1">
                      <CommandEmpty className="text-muted-foreground p-5 text-center text-sm sm:text-base font-medium">
                        Không tìm thấy góc nhìn nào
                      </CommandEmpty>
                      <CommandGroup className="p-1 space-y-1">
                        {panoramas.map((panorama, index) => (
                          <CommandItem
                            className={cn(
                              `text-foreground hover:bg-secondary rounded-xl cursor-pointer border border-transparent font-semibold px-3.5 py-3 text-sm sm:text-base transition-colors flex items-center justify-between ${index === panoramas.length - 1 ? "" : "mb-1"
                              }`,
                              value === panorama.title
                                ? "bg-secondary text-primary font-bold border-border shadow-xs"
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
                                "ml-2.5 text-primary !size-5 sm:!size-6 shrink-0 stroke-[2.5]",
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
                className="h-12 sm:h-13 px-4 sm:px-5 shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer font-bold text-sm sm:text-base shrink-0 transition-all active:scale-95"
                onClick={() => setIsBottomNavVisible(!isBottomNavVisible)}
                aria-label={
                  isBottomNavVisible ? "Ẩn danh sách ảnh" : "Hiện danh sách ảnh"
                }
              >
                {isBottomNavVisible ? (
                  <FiChevronDown className="!size-5 sm:!size-6 mr-1.5 text-foreground stroke-[2.5]" />
                ) : (
                  <FiChevronUp className="!size-5 sm:!size-6 mr-1.5 text-foreground stroke-[2.5]" />
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
