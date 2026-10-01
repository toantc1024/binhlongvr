import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AbsoluteWrapper from "../ui/absolute-wrapper";
import {
  FiArrowLeft,
  FiHome,
  FiMenu,
  FiShare2,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { Mail, Map } from "lucide-react";
import { Drawer } from "vaul";
import { PiInfoFill } from "react-icons/pi";
import useVRStore from "@/store/vr.store";
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
import SearchDialogBlock from "./SearchDialogBlock";
import PanoramaCarouselBlock from "./PanoramaCarouselBlock";
import TutorialDialogBlock from "./TutorialDialogBlock";
import { RiGlobalFill } from "react-icons/ri";
import MapDialogBlock from "./MapDialogBlock";
import { useNavigate } from "react-router-dom";
import AssetActionPillBlock from "./AssetActionPillBlock";

const ControlBlock = ({
  showMedia,
  muteAllAudio,
  unmuteAllAudio,
  getAudioState,
}: {
  showMedia: (mediaName: string) => void;
  muteAllAudio?: () => void;
  unmuteAllAudio?: () => void;
  getAudioState?: () => Promise<any>;
}) => {
  console.log(unmuteAllAudio, muteAllAudio, getAudioState);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const {
    currentArea,
    getHotspotById,
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

  useEffect(() => {
    if (currentPanorama) {
      setValue(currentPanorama.title);
    }
  }, [currentPanorama]);

  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  return (
    <>
      {/* Left Navigation */}
      <AbsoluteWrapper
        top="0"
        zIndex={2}
        left="0"
        customClassName="flex m-1 md:m-2 items-center px-1 md:px-2 h-auto rounded-4xl py-1 md:py-2 flex gap-1 md:gap-2 flex-col shadow-md border border-border bg-white/90 backdrop-blur-xl"
      >
        <Drawer.Root direction="left">
          <Drawer.Trigger asChild>
            <Button
              variant="ghost"
              className="w-10 h-10 md:w-12 lg:w-14 md:h-12 lg:h-14 shadow-xs rounded-full hover:bg-secondary bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer"
              aria-label="Menu"
            >
              <FiMenu className="!size-5 md:!size-7 lg:!size-9 text-foreground" />
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-[10] backdrop-blur-xs bg-black/30" />
            <Drawer.Content
              className="left-1 md:left-2 top-1 md:top-2 bottom-1 md:bottom-2 fixed z-10 outline-none w-[280px] md:w-[310px] flex"
              style={
                {
                  "--initial-transform": "calc(100% + 8px)",
                } as React.CSSProperties
              }
            >
              <div className="h-full w-full grow p-4 md:p-5 flex flex-col rounded-[16px] bg-white/95 text-foreground border border-border backdrop-blur-2xl shadow-2xl">
                <div className="">
                  <Drawer.Title className="flex items-center font-medium mb-4 text-foreground text-lg md:text-xl">
                    <Drawer.Close>
                      <Button variant="ghost" className="w-10 h-10 md:w-12 md:h-12 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-full p-2 cursor-pointer">
                        <FiArrowLeft className="!size-6 md:!size-8 text-foreground" />
                      </Button>
                    </Drawer.Close>
                    <div className="ml-3 md:ml-4 font-bold text-foreground">Tùy chọn</div>
                  </Drawer.Title>
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full h-10 md:h-12 text-left flex items-center justify-start gap-3 bg-secondary/80 hover:bg-secondary text-foreground border border-border rounded-full text-sm md:text-base cursor-pointer transition-all font-medium"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      <RiGlobalFill className="size-4 md:size-5 text-foreground" />
                      Về trang chủ
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-10 md:h-12 text-left flex items-center justify-start gap-3 bg-secondary/80 hover:bg-secondary text-foreground border border-border rounded-full text-sm md:text-base cursor-pointer transition-all font-medium"
                      onClick={() => {
                        // mailto
                        window.location.href = "mailto:vrdiachido@gmail.com";
                      }}
                    >
                      <Mail className="size-4 md:size-5 text-foreground" />
                      Góp ý
                    </Button>
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>

        {/* Top left nav */}
        {[
          {
            icon: (
              <>
                <FiHome className="!size-5 md:!size-7 lg:!size-9 text-foreground" />
              </>
            ),
            onClick: () => {
              if (currentArea?.main_hotspot_id) {
                const panoramaId = getHotspotById(
                  Number(currentArea.main_hotspot_id)
                )?.click_panorama_id;
                if (panoramaId) {
                  showMedia(panoramaId);
                }
              }
            },
            label: "Home",
          },
        ].map((item, idx) => (
          <Button
            key={idx}
            variant="ghost"
            className="w-10 h-10 md:w-12 lg:w-14 md:h-12 lg:h-14 shadow-xs rounded-full hover:bg-secondary bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer"
            onClick={item.onClick}
            aria-label={item.label}
          >
            {item.icon}
          </Button>
        ))}

        <Button
          variant="ghost"
          onClick={() => {
            setIsMapDialogOpen(!isMapDialogOpen);
          }}
          className="w-10 h-10 md:w-12 lg:w-14 md:h-12 lg:h-14 shadow-xs rounded-full hover:bg-secondary bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer"
        >
          <Map className="!size-5 md:!size-7 lg:!size-9 text-foreground" />
        </Button>

        {/* Audio Control Button */}
        {/* {muteAllAudio && unmuteAllAudio && getAudioState && (
          <AudioControlBlock
            muteAllAudio={muteAllAudio}
            unmuteAllAudio={unmuteAllAudio}
            getAudioState={getAudioState}
          />
        )} */}

        <TutorialDialogBlock />
      </AbsoluteWrapper>

      {/* Top Right Navigation */}
      <div className="fixed top-1 right-1 z-50 flex flex-col gap-1">
        <MapDialogBlock
          showMedia={showMedia}
          opened={isMapDialogOpen}
          setOpened={setIsMapDialogOpen}
        />
        {/* <ChatbotDialogBlock /> */}
        <SearchDialogBlock showMedia={showMedia} />
      </div>

      <div className="absolute w-full top-0 flex flex-col items-center justify-center">
        {currentHotspot && (
          <div className="py-2 my-1 font-bold text-foreground text-md lg:text-2xl bg-white/90 rounded-full px-8 border border-border max-w-[50vw] overflow-hidden text-ellipsis whitespace-nowrap shadow-lg backdrop-blur-xl">
            {currentHotspot?.title}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <AbsoluteWrapper
        zIndex={1}
        customClassName="bottom-0 left-0 w-full flex flex-col justify-center items-center rounded-t-xl"
      >
        <div className="w-full bg-white/90 border-t border-border backdrop-blur-xl shadow-lg">
          <div className="relative">
            <div className="z-[1] flex gap-2 py-2 px-2 overflow-x-auto scrollbar-hide justify-start lg:justify-center">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="bg-white hover:bg-secondary text-foreground border border-border rounded-full w-[200px] justify-between overflow-hidden cursor-pointer shadow-xs font-medium"
                  >
                    <span className="truncate capitalize text-foreground">
                      Bạn đang ở {currentPanorama?.title}
                    </span>
                    <ChevronsUpDown className="text-foreground opacity-70 shrink-0 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="border border-border w-[250px] !rounded-xl bg-white/95 backdrop-blur-2xl p-0 shadow-2xl"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command className="bg-transparent border-none text-foreground">
                    <CommandInput
                      placeholder="Tìm panorama"
                      className="h-9 text-foreground placeholder:text-muted-foreground"
                    />
                    <CommandList>
                      <CommandEmpty className="text-muted-foreground p-4 text-center text-sm">
                        Không tìm thấy panorama
                      </CommandEmpty>
                      <CommandGroup className="p-1">
                        {panoramas.map((panorama, index) => (
                          <CommandItem
                            className={cn(
                              `text-foreground hover:bg-secondary rounded-lg cursor-pointer border border-transparent ${
                                index === panoramas.length - 1 ? "" : "mb-1"
                              } font-medium px-2 py-1.5 transition-colors`,
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
                            {panorama.title}
                            <Check
                              className={cn(
                                "ml-auto text-primary",
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
                const IconComponent = pill.icon;

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
                          "VR Experience",
                        description:
                          currentHotspot?.description ||
                          "Khám phá không gian ảo 360° tuyệt đẹp",
                        url:
                          typeof window !== "undefined"
                            ? window.location.href
                            : "",
                      }}
                    />
                  );
                }

                return (
                  <Button
                    variant="outline"
                    key={pill.id}
                    className="shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer font-medium"
                  >
                    {IconComponent && (
                      <IconComponent className="w-3.5 h-3.5 mr-1 text-foreground" />
                    )}
                    {pill.id === "search" ? currentPanorama?.title : pill.label}
                  </Button>
                );
              })}

              {/* Carousel Toggle Button */}
              <Button
                variant="outline"
                className="shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer font-medium"
                onClick={() => setIsBottomNavVisible(!isBottomNavVisible)}
                aria-label={
                  isBottomNavVisible ? "Hide carousel" : "Show carousel"
                }
              >
                {isBottomNavVisible ? (
                  <FiChevronDown className="w-3.5 h-3.5 mr-1 text-foreground" />
                ) : (
                  <FiChevronUp className="w-3.5 h-3.5 mr-1 text-foreground" />
                )}
                {isBottomNavVisible ? "Ẩn" : "Hiện"}
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
