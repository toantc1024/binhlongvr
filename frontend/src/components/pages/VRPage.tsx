import React, { useEffect, useState } from "react";
import VRCoreIframeBlock from "../block/VRCoreIframeBlock";
import ControlBlock from "../block/ControlBlock";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import use3DVistaHook from "@/hooks/use3DVistaHook";
import useVRStore from "@/store/vr.store";
import useAssetStore from "@/store/asset.store";
import "./VRPage.module.css";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "vaul";
import AssetDrawerBlock from "../block/AssetDrawerBlock";
import LoaderBlock from "../block/LoaderBlock";
interface VRPageProps {
  isActive?: boolean;
}

const VRPage: React.FC<VRPageProps> = ({ isActive = true }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const {
    showMedia,
    onMessage: registerMessageHandler,
    muteAllAudio,
    unmuteAllAudio,
    stopAllAudio,
    getAudioState,
  } = use3DVistaHook({
    ref: iframeRef as React.RefObject<HTMLIFrameElement>,
    isActive,
  });
  const {
    isLoading,
    currentHotspot,
    getHotspotById,
    setCurrentHotspotById,
    setPanoramasByHotspotId,
    setCurrentPanorama,
    getPanoramaById,
    selectHotspotAndPanorama,
  } = useVRStore((state) => state);
  const { currentAsset, setCurrentAsset } = useAssetStore((state) => state);
  let [searchParams, _] = useSearchParams();

  const prevActiveRef = React.useRef(isActive);
  const prevSearchParamsStrRef = React.useRef(searchParams.toString());

  // Handle direct navigation via searchParams when active, or reset to start point when entering cleanly
  useEffect(() => {
    const wasInactive = !prevActiveRef.current && isActive;
    const prevParamsStr = prevSearchParamsStrRef.current;
    const currentParamsStr = searchParams.toString();
    const paramsChanged = prevParamsStr !== currentParamsStr;

    // Update tracking refs
    prevActiveRef.current = isActive;
    prevSearchParamsStrRef.current = currentParamsStr;

    if (!isActive) return;

    const hotspotIdParam = searchParams.get("hotspot_id");
    const panoramaIdParam = searchParams.get("panorama_id");

    const hotspotId = hotspotIdParam ? Number(hotspotIdParam) : null;
    const panoramaId = panoramaIdParam || null;

    if (hotspotId || panoramaId) {
      selectHotspotAndPanorama(hotspotId, panoramaId);
      const targetPanorama =
        panoramaId || (hotspotId ? getHotspotById(hotspotId)?.click_panorama_id : null);
      if (targetPanorama) {
        showMedia(targetPanorama);
      }
    } else if (wasInactive || (paramsChanged && prevParamsStr !== "")) {
      // User entered /app without specific hotspot/panorama parameters (or cleared params)
      // Reset to root start point (Mộ 3.000 người, M3000_0_FLYCAM_1)
      const rootHotspotId = 132;
      const rootPanoramaId = "M3000_0_FLYCAM_1";
      selectHotspotAndPanorama(rootHotspotId, rootPanoramaId);
      setCurrentAsset(null);
      showMedia(rootPanoramaId);

      const timer = setTimeout(() => {
        showMedia(rootPanoramaId);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [searchParams, isActive]);

  // Sync mute state, viewport, and drawer when active toggles
  useEffect(() => {
    if (isActive) {
      unmuteAllAudio();
      window.dispatchEvent(new Event("resize"));
    } else {
      muteAllAudio();
      stopAllAudio();
      setCurrentAsset(null);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isLoading) {
      setIsFadingOut(true);

      const timer = setTimeout(() => {
        setIsFadingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsFadingOut(false);
    }
  }, [isLoading]);

  useEffect(() => {
    (async () => {
      if (currentHotspot) {
        await setPanoramasByHotspotId(currentHotspot.hotspot_id);
      }
    })();
  }, [currentHotspot?.hotspot_id]);

  useEffect(() => {
    const handlePanoramaChange = async (panoramaInfo: any) => {
      const label = panoramaInfo?.data?.label || panoramaInfo?.label || panoramaInfo?.id;
      if (!label) return;

      const panorama = await getPanoramaById(label);
      if (panorama) {
        if (currentHotspot?.hotspot_id !== panorama.hotspot_id) {
          setCurrentHotspotById(panorama.hotspot_id);
          await setPanoramasByHotspotId(panorama.hotspot_id);
        }
        setCurrentPanorama(panorama);
      }
    };

    registerMessageHandler("panorama_change", handlePanoramaChange);
    const handleDirectMessage = async (event: any) => {
      if (event.data && event.data.type === "panorama_change") {
        const panoramaInfo = event.data.payload;
        await handlePanoramaChange(panoramaInfo);
      }
    };
    window.addEventListener("message", handleDirectMessage);
    return () => {
      window.removeEventListener("message", handleDirectMessage);
    };
  }, [registerMessageHandler, currentHotspot?.hotspot_id]);

  const assetSnapPoints = ["400px", 1];
  const [assetSnap, setAssetSnap] = useState<number | string | null>(
    assetSnapPoints[0]
  );

  const { cssHeight } = useViewportHeight();
  return (
    <>
      {/* Asset Drawer */}
      <Drawer.Root
        open={!!currentAsset}
        snapPoints={assetSnapPoints}
        activeSnapPoint={assetSnap}
        setActiveSnapPoint={setAssetSnap}
        fadeFromIndex={1}
      >
        <Drawer.Overlay className="z-[9999] fixed inset-0 bg-black/30 backdrop-blur-xs" />
        <Drawer.Portal>
          <Drawer.Content
            data-testid="asset-content"
            className="fixed z-[9999] bg-white/95 text-foreground border-t border-border backdrop-blur-2xl rounded-t-4xl bottom-0 left-0 right-0 h-full mx-[-1px] flex flex-col shadow-2xl"
          >
            <AssetDrawerBlock
              currentAsset={currentAsset}
              setCurrentAsset={setCurrentAsset}
              showMedia={showMedia}
              snap={assetSnap}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <div
        className="w-full relative overflow-hidden h-screen-mobile"
        style={{ height: cssHeight }}
      >
        <div className="w-full h-full relative">
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <ControlBlock
                showMedia={showMedia}
                muteAllAudio={muteAllAudio}
                unmuteAllAudio={unmuteAllAudio}
                stopAllAudio={stopAllAudio}
                getAudioState={getAudioState}
                isActive={isActive}
              />
            </div>
          </div>
          {(isLoading || isFadingOut) && (
            <div
              className={`fixed inset-0 z-50 transition-opacity duration-500 ease-out ${
                isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <LoaderBlock />
            </div>
          )}
          <div className="w-full h-full relative">
            <VRCoreIframeBlock ref={iframeRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VRPage;
