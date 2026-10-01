import { create } from "zustand";
import type { Area } from "../types/area.service.type";
import type { Hotspot } from "../types/hotspots.service.type";
import { CURRENT_AREA_ID } from "@/constants/env.constants";
import { getAreaDetailById } from "@/services/area.service";
import { getHotspotsByAreaId } from "@/services/hotspots.service";
import type { Panorama } from "@/types/panoramas.service.type";
import {
  getPanoramaByIdFromService,
  getPanoramasByHotspotId,
} from "@/services/panoramas.service";
import {
  BINHLONG_AREA,
  BINHLONG_HOTSPOTS,
  BINHLONG_PANORAMAS,
} from "@/constants/binhlong.constants";
import { isSupabaseConfigured } from "@/lib/supabase";

interface VRStoreState {
  currentArea: Area | null;
  currentHotspot: Hotspot | null;
  currentPanorama: Panorama | null;
  areaHotspots: Hotspot[];
  isLoading: boolean;
  panoramas: Panorama[];
  isLoadingPanoramas: boolean;
  isMapDialogOpen: boolean;
  mapDialogHotspotId: number | null;
}

interface VRStoreActions {
  setCurrentArea: (area: Area | null) => void;
  setCurrentHotspot: (hotspot: Hotspot | null) => void;
  setAreaHotspots: (hotspots: Hotspot[]) => void;
  clearVRState: () => void;
  loadData: () => Promise<void>;
  getHotspotById: (hotspot_id: number) => Hotspot | undefined;
  setIsLoading: (isLoading: boolean) => void;
  setCurrentHotspotById: (hotspot_id: number) => void;
  setPanoramasByHotspotId: (hotspot_id: number) => void;
  setCurrentPanorama: (panorama: Panorama | null) => void;
  setCurrentPanoramaById: (panorama_id: string) => void;
  getPanoramaById: (panorama_id: string) => Promise<Panorama | undefined>;
  setIsMapDialogOpen: (open: boolean, hotspotId?: number | null) => void;
}

type VRStore = VRStoreState & VRStoreActions;

const useVRStore = create<VRStore>((set, get) => ({
  currentArea: BINHLONG_AREA,
  currentHotspot: BINHLONG_HOTSPOTS[0],
  currentPanorama: BINHLONG_PANORAMAS[0],
  isLoading: false,
  areaHotspots: BINHLONG_HOTSPOTS,
  panoramas: BINHLONG_PANORAMAS,
  isLoadingPanoramas: false,
  isMapDialogOpen: false,
  mapDialogHotspotId: null,

  setIsMapDialogOpen: (open, hotspotId = null) =>
    set({
      isMapDialogOpen: open,
      mapDialogHotspotId: open ? (hotspotId ?? null) : null,
    }),

  setCurrentArea: (area) => set({ currentArea: area }),
  setCurrentHotspot: (hotspot) => set({ currentHotspot: hotspot }),
  setCurrentPanorama: (panorama) => set({ currentPanorama: panorama }),
  setAreaHotspots: (hotspots) => set({ areaHotspots: hotspots }),

  clearVRState: () =>
    set({
      currentArea: BINHLONG_AREA,
      currentHotspot: BINHLONG_HOTSPOTS[0],
      currentPanorama: BINHLONG_PANORAMAS[0],
      areaHotspots: BINHLONG_HOTSPOTS,
      isMapDialogOpen: false,
      mapDialogHotspotId: null,
    }),
      panoramas: BINHLONG_PANORAMAS,
    }),

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading: isLoading });
  },

  setCurrentHotspotById: (hotspot_id: number) => {
    const hotspot = get().getHotspotById(hotspot_id);
    if (hotspot) {
      set({ currentHotspot: hotspot });
    }
  },

  getHotspotById: (hotspot_id: number) => {
    const areaHotspots = get().areaHotspots;
    return areaHotspots.find((hotspot) => hotspot.hotspot_id === hotspot_id);
  },

  loadData: async () => {
    if (!isSupabaseConfigured || !CURRENT_AREA_ID) {
      // Standalone mode: already initialized with Binh Long data
      set({
        currentArea: BINHLONG_AREA,
        areaHotspots: BINHLONG_HOTSPOTS,
        currentHotspot: BINHLONG_HOTSPOTS[0],
        panoramas: BINHLONG_PANORAMAS,
        currentPanorama: BINHLONG_PANORAMAS[0],
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true });
    try {
      const currentArea = await getAreaDetailById(CURRENT_AREA_ID);
      const areaHotspots = await getHotspotsByAreaId(CURRENT_AREA_ID);
      const currentHotspot =
        areaHotspots.find(
          (hotspot) => hotspot.hotspot_id === currentArea.main_hotspot_id
        ) || areaHotspots[0];

      set({
        currentArea,
        areaHotspots,
        currentHotspot: currentHotspot || BINHLONG_HOTSPOTS[0],
        isLoading: false,
      });
    } catch {
      // Safe fallback if Supabase query fails
      set({
        currentArea: BINHLONG_AREA,
        areaHotspots: BINHLONG_HOTSPOTS,
        currentHotspot: BINHLONG_HOTSPOTS[0],
        panoramas: BINHLONG_PANORAMAS,
        currentPanorama: BINHLONG_PANORAMAS[0],
        isLoading: false,
      });
    }
  },

  getPanoramaById: async (panorama_id: string) => {
    const panoramas = get().panoramas;
    let currentPanorama = panoramas.find(
      (panorama) => panorama.panorama_id === panorama_id
    );

    if (!currentPanorama) {
      currentPanorama = BINHLONG_PANORAMAS.find(
        (p) => p.panorama_id === panorama_id
      );
    }

    if (!currentPanorama && isSupabaseConfigured) {
      try {
        currentPanorama = await getPanoramaByIdFromService(panorama_id);
      } catch {
        // Ignore service errors
      }
    }
    return currentPanorama;
  },

  setCurrentPanoramaById: (panorama_id: string) => {
    const panoramas = get().panoramas;
    const currentPanorama =
      panoramas.find((p) => p.panorama_id === panorama_id) ||
      BINHLONG_PANORAMAS.find((p) => p.panorama_id === panorama_id);
    if (currentPanorama) {
      set({ currentPanorama });
    }
  },

  setPanoramasByHotspotId: async (hotspot_id: number) => {
    try {
      set({ isLoadingPanoramas: true });
      const hotspot = get().getHotspotById(hotspot_id);
      const currentArea = get().currentArea;
      const areaHotspots = get().areaHotspots;

      if (hotspot) {
        let panoramas: Panorama[] = [];

        if (isSupabaseConfigured) {
          try {
            const isMainHotspot =
              currentArea?.main_hotspot_id !== null &&
              currentArea?.main_hotspot_id !== undefined &&
              Number(currentArea.main_hotspot_id) === hotspot_id;

            if (isMainHotspot) {
              const mainPanoramaPromises = areaHotspots.map(async (h) => {
                if (h.click_panorama_id) {
                  return await getPanoramaByIdFromService(h.click_panorama_id);
                }
                const hotspotPanoramas = await getPanoramasByHotspotId(
                  h.hotspot_id
                );
                return hotspotPanoramas[0];
              });

              const mainPanoramas = await Promise.all(mainPanoramaPromises);
              panoramas = mainPanoramas.filter(
                (p): p is Panorama => p !== undefined
              );
            } else {
              panoramas = await getPanoramasByHotspotId(hotspot_id);
            }
          } catch {
            panoramas = BINHLONG_PANORAMAS;
          }
        }

        if (panoramas.length === 0) {
          panoramas = BINHLONG_PANORAMAS;
        }

        set({ panoramas });

        const currentPanorama =
          panoramas.find(
            (p) => p.panorama_id === hotspot.click_panorama_id
          ) || panoramas[0];

        if (currentPanorama) {
          set({ currentPanorama });
        }
        set({ isLoadingPanoramas: false });
      }
    } catch {
      set({ isLoadingPanoramas: false, panoramas: BINHLONG_PANORAMAS });
    }
  },
}));

export default useVRStore;
