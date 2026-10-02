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

const defaultMainHotspot =
  BINHLONG_HOTSPOTS.find((h) => h.hotspot_id === 132) || BINHLONG_HOTSPOTS[0];
const defaultMainPanoramas = BINHLONG_PANORAMAS.filter(
  (p) => p.hotspot_id === 132
);
const defaultMainPanorama =
  defaultMainPanoramas.find((p) => p.panorama_id === "M3000_0_FLYCAM_1") ||
  defaultMainPanoramas[0];

const useVRStore = create<VRStore>((set, get) => ({
  currentArea: BINHLONG_AREA,
  currentHotspot: defaultMainHotspot,
  currentPanorama: defaultMainPanorama,
  isLoading: false,
  areaHotspots: BINHLONG_HOTSPOTS,
  panoramas: defaultMainPanoramas,
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
      currentHotspot: defaultMainHotspot,
      currentPanorama: defaultMainPanorama,
      areaHotspots: BINHLONG_HOTSPOTS,
      panoramas: defaultMainPanoramas,
      isMapDialogOpen: false,
      mapDialogHotspotId: null,
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
        currentHotspot: defaultMainHotspot,
        panoramas: defaultMainPanoramas,
        currentPanorama: defaultMainPanorama,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true });
    try {
      const currentArea = await getAreaDetailById(CURRENT_AREA_ID);
      const areaHotspots = await getHotspotsByAreaId(CURRENT_AREA_ID);
      const mainId = currentArea.main_hotspot_id
        ? Number(currentArea.main_hotspot_id)
        : 132;
      const currentHotspot =
        areaHotspots.find((hotspot) => hotspot.hotspot_id === mainId) ||
        areaHotspots[0] ||
        defaultMainHotspot;

      const hotspotPanoramas = await getPanoramasByHotspotId(
        currentHotspot.hotspot_id
      );
      const panoramas =
        hotspotPanoramas.length > 0 ? hotspotPanoramas : defaultMainPanoramas;
      const currentPanorama =
        panoramas.find(
          (p) => p.panorama_id === currentHotspot.click_panorama_id
        ) ||
        panoramas.find((p) => p.panorama_id === "M3000_0_FLYCAM_1") ||
        panoramas[0];

      set({
        currentArea,
        areaHotspots,
        currentHotspot,
        panoramas,
        currentPanorama,
        isLoading: false,
      });
    } catch {
      // Safe fallback if Supabase query fails
      set({
        currentArea: BINHLONG_AREA,
        areaHotspots: BINHLONG_HOTSPOTS,
        currentHotspot: defaultMainHotspot,
        panoramas: defaultMainPanoramas,
        currentPanorama: defaultMainPanorama,
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

      if (hotspot) {
        let panoramas: Panorama[] = [];

        if (isSupabaseConfigured) {
          try {
            panoramas = await getPanoramasByHotspotId(hotspot_id);
          } catch {
            panoramas = BINHLONG_PANORAMAS.filter(
              (p) => p.hotspot_id === hotspot_id
            );
          }
        }

        if (panoramas.length === 0) {
          panoramas = BINHLONG_PANORAMAS.filter(
            (p) => p.hotspot_id === hotspot_id
          );
          if (panoramas.length === 0) {
            panoramas = BINHLONG_PANORAMAS;
          }
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
