import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "../ui/button";
import AbsoluteWrapper from "../ui/absolute-wrapper";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Check, ChevronsUpDown } from "lucide-react";
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
import MapDialogBlock from "./MapDialogBlock";
import { useNavigate } from "react-router-dom";
import { PiInfoFill } from "react-icons/pi";
import { FiShare2 } from "react-icons/fi";
import useVRStore from "@/store/vr.store";
import useAssetStore from "@/store/asset.store";
import { toast } from "sonner";
import websiteGlobeIcon from "@/assets/3d-icons/website-globe__binhlong-3d-icon.png";
import homeMonumentIcon from "@/assets/3d-icons/home-monument__binhlong-3d-icon.png";
import audioSpeakerIcon from "@/assets/3d-icons/audio-speaker__binhlong-3d-icon.png";
import questionInfoIcon from "@/assets/3d-icons/question-info__binhlong-3d-icon.png";
import searchLensIcon from "@/assets/3d-icons/search-lens__binhlong-3d-icon.png";

const ControlBlock = ({
  showMedia,
  muteAllAudio,
  unmuteAllAudio: _unmuteAllAudio,
  stopAllAudio,
  getAudioState: _getAudioState,
  isActive = true,
}: {
  showMedia: (mediaName: string) => void;
  muteAllAudio?: () => void;
  unmuteAllAudio?: () => void;
  stopAllAudio?: () => void;
  getAudioState?: () => Promise<any>;
  isActive?: boolean;
}) => {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const {
    currentHotspot,
    currentPanorama,
    setCurrentPanoramaById,
    setCurrentHotspotById,
    setPanoramasByHotspotId,
    panoramas,
    clearVRState,
    selectHotspotAndPanorama,
  } = useVRStore((state) => state);
  const { setCurrentAsset } = useAssetStore((state) => state);
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
  const activeAudioTrackRef = useRef<string | null>(null);
  const userPausedRef = useRef<boolean>(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current view is at the main entrance panorama (Flycam toàn cảnh)
  const isMainPanorama = useMemo(() => {
    if (!currentHotspot || currentHotspot.hotspot_id !== 132) return false;
    const pid = currentPanorama?.panorama_id;
    return !pid || pid === "M3000_0_FLYCAM_1" || pid === "M3000_0_FLYCAM_2";
  }, [currentHotspot?.hotspot_id, currentPanorama?.panorama_id]);

  const currentAudioUrl = useMemo(() => {
    if (isMainPanorama) {
      // Main panorama plays the affectionate welcome & overview voice, not the war/historical text
      return "/audio/binhlong_welcome.mp3";
    }
    return (currentHotspot?.metadata as any)?.audio_url || null;
  }, [isMainPanorama, currentHotspot]);

  const activeAudioTrackKey = useMemo(() => {
    if (isMainPanorama) {
      return "main_welcome";
    }
    return currentHotspot ? `hotspot_${currentHotspot.hotspot_id}` : null;
  }, [isMainPanorama, currentHotspot?.hotspot_id]);

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
  // - At main panorama: plays warm welcome & guide voice ("/audio/binhlong_welcome.mp3")
  // - At specific di tích spots: plays dedicated historical narration
  // - Plays ONCE per section without duplicate or overlapping playback
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
      activeAudioTrackRef.current = null;
      muteAllAudio?.();
      stopAllAudio?.();
      return;
    }

    if (!activeAudioTrackKey || !currentAudioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      return;
    }

    // If audio is already active for this track/state, do not replay or interrupt!
    if (activeAudioTrackRef.current === activeAudioTrackKey && isPlayingAudio) {
      return;
    }

    if (activeAudioTrackRef.current !== activeAudioTrackKey) {
      activeAudioTrackRef.current = activeAudioTrackKey;
      userPausedRef.current = false; // Reset pause when entering new section

      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
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
  }, [isActive, activeAudioTrackKey, currentAudioUrl]);

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

  // Home button: Returns to main panorama of Di tích Lịch sử cấp Quốc gia Mộ 3.000 đồng bào bị Đế quốc Mỹ tàn sát ngày 03/10/1972 (Hotspot 132, M3000_0_FLYCAM_1)
  const handleGoToFlycamHome = async () => {
    const mainHotspotId = 132;
    const targetPanoramaId = "M3000_0_FLYCAM_1";

    setCurrentAsset(null);
    selectHotspotAndPanorama(mainHotspotId, targetPanoramaId);
    showMedia(targetPanoramaId);
    navigate("/app", { replace: true });
  };

  // Return to website: resets VR state to default start point and navigates to "/"
  const handleBackToWebsite = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    activeAudioTrackRef.current = null;
    muteAllAudio?.();
    stopAllAudio?.();
    setCurrentAsset(null);
    clearVRState();
    showMedia("M3000_0_FLYCAM_1");
    navigate("/");
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

      {/* Top Header Bar: Place Name (Full Width) + Search Button (to the right of the name, synced height & text 'Tìm kiếm') */}
      <div className="fixed top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-30 flex items-center gap-2 sm:gap-3 pointer-events-auto">
        {/* Full-Width Place Name */}
        <div className="flex-1 h-12 sm:h-13 md:h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-full border border-border shadow-xl px-4 sm:px-6 flex items-center min-w-0 overflow-hidden">
          <span className="font-bold text-foreground text-sm sm:text-base md:text-lg truncate">
            {currentHotspot?.title || "Bản đồ số Di tích Lịch sử Phường Bình Long"}
          </span>
        </div>

        {/* Right Search Button: in the right of the name with text 'Tìm kiếm' and synced height */}
        <Button
          variant="ghost"
          onClick={() => setIsMapDialogOpen(true)}
          className="h-12 sm:h-13 md:h-14 px-3.5 sm:px-5 bg-white/95 dark:bg-slate-900/95 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-foreground border border-border shadow-xl rounded-2xl sm:rounded-full flex items-center gap-2 font-bold text-sm sm:text-base cursor-pointer shrink-0 active:scale-95 transition-all group overflow-hidden"
          title="Tìm kiếm di tích & Bản đồ số"
          aria-label="Tìm kiếm di tích & Bản đồ số"
        >
          <img
            src={searchLensIcon}
            alt="Tìm kiếm"
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain group-hover:scale-110 transition-transform drop-shadow-xs pointer-events-none select-none"
          />
          <span className="whitespace-nowrap font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            Tìm kiếm
          </span>
        </Button>
      </div>

      {/* Left Navigation: Positioned UNDER the top header bar & UNDER the search dialog */}
      <div
        className={cn(
          "fixed top-[4.25rem] sm:top-[4.75rem] md:top-[5.25rem] left-2 sm:left-3 z-20 flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 h-auto rounded-full gap-2 sm:gap-2.5 flex-col shadow-xl border border-border/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl transition-all duration-300",
          isMapDialogOpen && "opacity-0 pointer-events-none -z-10 invisible"
        )}
      >
        {/* Nút trở về Website (3D Globe) */}
        <Button
          variant="ghost"
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 p-2 sm:p-2.5 shadow-xs rounded-full hover:bg-emerald-50 hover:border-emerald-500/50 bg-white/95 dark:bg-slate-900/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95 group overflow-hidden"
          onClick={handleBackToWebsite}
          aria-label="Trở về website"
          title="Trở về website"
        >
          <img
            src={websiteGlobeIcon}
            alt="Trở về website"
            className="w-full h-full object-contain group-hover:scale-110 transition-transform drop-shadow-xs pointer-events-none select-none"
          />
        </Button>

        {/* Nút Home: Về Di tích Lịch sử cấp Quốc gia Mộ 3.000 đồng bào bị Đế quốc Mỹ tàn sát ngày 03/10/1972 (3D Home Monument) */}
        <Button
          variant="ghost"
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 p-2 sm:p-2.5 shadow-xs rounded-full hover:bg-emerald-50 hover:border-emerald-500/50 bg-white/95 dark:bg-slate-900/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95 group overflow-hidden"
          onClick={handleGoToFlycamHome}
          aria-label="Di tích Lịch sử cấp Quốc gia Mộ 3.000 đồng bào bị Đế quốc Mỹ tàn sát ngày 03/10/1972 (Mộ tập thể 3000 người)"
          title="Di tích Lịch sử cấp Quốc gia Mộ 3.000 đồng bào bị Đế quốc Mỹ tàn sát ngày 03/10/1972 (Mộ tập thể 3000 người)"
        >
          <img
            src={homeMonumentIcon}
            alt="Di tích Lịch sử cấp Quốc gia Mộ 3.000 đồng bào bị Đế quốc Mỹ tàn sát ngày 03/10/1972 (Mộ tập thể 3000 người)"
            className="w-full h-full object-contain group-hover:scale-110 transition-transform drop-shadow-xs pointer-events-none select-none"
          />
        </Button>

        {/* Nút Thuyết minh Âm thanh (3D Audio Speaker) */}
        <Button
          variant="ghost"
          className={cn(
            "w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 p-2 sm:p-2.5 shadow-xs rounded-full border flex items-center justify-center cursor-pointer transition-all active:scale-95 relative group overflow-hidden",
            isPlayingAudio
              ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md"
              : "hover:bg-secondary bg-white/95 dark:bg-slate-900/95 border-border"
          )}
          onClick={handleToggleAudio}
          aria-label={
            isPlayingAudio
              ? isMainPanorama
                ? "Tắt lời chào & hướng dẫn"
                : "Tắt thuyết minh âm thanh"
              : isMainPanorama
              ? "Bật lời chào & hướng dẫn"
              : "Bật thuyết minh âm thanh"
          }
          title={
            isPlayingAudio
              ? isMainPanorama
                ? "Tắt lời chào & hướng dẫn (Âm lượng nhỏ 35%)"
                : "Tắt thuyết minh âm thanh (Âm lượng nhỏ 35%)"
              : isMainPanorama
              ? "Nghe lời chào & hướng dẫn thực tế ảo"
              : "Bật thuyết minh âm thanh"
          }
        >
          <img
            src={audioSpeakerIcon}
            alt={isMainPanorama ? "Lời chào & Hướng dẫn" : "Thuyết minh âm thanh"}
            className={cn(
              "w-full h-full object-contain group-hover:scale-110 transition-transform drop-shadow-xs pointer-events-none select-none",
              isPlayingAudio ? "scale-105 animate-pulse" : "opacity-80 grayscale-[25%]"
            )}
          />
          {isPlayingAudio && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          )}
        </Button>

        {/* Nút Thông tin (Dấu hỏi 3D) - Mở thông tin di tích thay vì hướng dẫn */}
        <HotspotInfoDialogBlock
          hotspot={currentHotspot}
          panoramas={panoramas}
          trigger={
            <Button
              variant="ghost"
              className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 p-2 sm:p-2.5 shadow-xs rounded-full hover:bg-emerald-50 hover:border-emerald-500/50 bg-white/95 dark:bg-slate-900/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95 group overflow-hidden"
              title="Thông tin di tích & Địa điểm"
              aria-label="Thông tin di tích & Địa điểm"
            >
              <img
                src={questionInfoIcon}
                alt="Thông tin di tích"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform drop-shadow-xs pointer-events-none select-none"
              />
            </Button>
          }
        />
      </div>

      {/* Search & Map Dialog (Renders on top of the left navigation with full z-[999] layer) */}
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
