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
  selectHotspotAndPanorama: (hotspotId?: number | null, panoramaId?: string | null) => void;
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

const getInitialSelection = () => {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlHotspotId = params.get("hotspot_id");
      const urlPanoramaId = params.get("panorama_id");

      if (urlHotspotId) {
        const hid = Number(urlHotspotId);
        const hotspot = BINHLONG_HOTSPOTS.find((h) => h.hotspot_id === hid);
        if (hotspot) {
          const panas = BINHLONG_PANORAMAS.filter((p) => p.hotspot_id === hid);
          const pana =
            (urlPanoramaId && panas.find((p) => p.panorama_id === urlPanoramaId)) ||
            (hotspot.click_panorama_id && panas.find((p) => p.panorama_id === hotspot.click_panorama_id)) ||
            panas[0] ||
            defaultMainPanorama;
          return {
            hotspot,
            panorama: pana,
            panoramas: panas.length > 0 ? panas : defaultMainPanoramas,
          };
        }
      }

      if (urlPanoramaId) {
        const pana = BINHLONG_PANORAMAS.find((p) => p.panorama_id === urlPanoramaId);
        if (pana) {
          const hotspot = BINHLONG_HOTSPOTS.find((h) => h.hotspot_id === pana.hotspot_id);
          const panas = BINHLONG_PANORAMAS.filter((p) => p.hotspot_id === pana.hotspot_id);
          return {
            hotspot: hotspot || defaultMainHotspot,
            panorama: pana,
            panoramas: panas.length > 0 ? panas : defaultMainPanoramas,
          };
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  return {
    hotspot: defaultMainHotspot,
    panorama: defaultMainPanorama,
    panoramas: defaultMainPanoramas,
  };
};

const initialSelection = getInitialSelection();

const useVRStore = create<VRStore>((set, get) => ({
  currentArea: BINHLONG_AREA,
  currentHotspot: initialSelection.hotspot,
  currentPanorama: initialSelection.panorama,
  isLoading: false,
  areaHotspots: BINHLONG_HOTSPOTS,
  panoramas: initialSelection.panoramas,
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

  selectHotspotAndPanorama: (hotspotId?: number | null, panoramaId?: string | null) => {
    let targetHotspot: Hotspot | undefined;
    let targetPanorama: Panorama | undefined;

    if (hotspotId) {
      targetHotspot = get().getHotspotById(hotspotId);
    }

    if (panoramaId) {
      const allPanas = get().panoramas.length > 0 ? get().panoramas : BINHLONG_PANORAMAS;
      targetPanorama =
        allPanas.find((p) => p.panorama_id === panoramaId) ||
        BINHLONG_PANORAMAS.find((p) => p.panorama_id === panoramaId);

      if (!targetHotspot && targetPanorama) {
        targetHotspot = get().getHotspotById(targetPanorama.hotspot_id);
      }
    }

    if (targetHotspot && !targetPanorama) {
      const panas = BINHLONG_PANORAMAS.filter((p) => p.hotspot_id === targetHotspot!.hotspot_id);
      targetPanorama =
        (targetHotspot.click_panorama_id && panas.find((p) => p.panorama_id === targetHotspot!.click_panorama_id)) ||
        panas[0];
    }

    const updates: Partial<VRStoreState> = {};
    if (targetHotspot) {
      updates.currentHotspot = targetHotspot;
      const relatedPanas = BINHLONG_PANORAMAS.filter((p) => p.hotspot_id === targetHotspot!.hotspot_id);
      if (relatedPanas.length > 0) {
        updates.panoramas = relatedPanas;
      }
    }
    if (targetPanorama) {
      updates.currentPanorama = targetPanorama;
    }

    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },

  clearVRState: () => {
    set({
      currentArea: BINHLONG_AREA,
      currentHotspot: defaultMainHotspot,
      currentPanorama: defaultMainPanorama,
      areaHotspots: BINHLONG_HOTSPOTS,
      panoramas: defaultMainPanoramas,
      isMapDialogOpen: false,
      mapDialogHotspotId: null,
    });
  },

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
    return (
      areaHotspots.find((hotspot) => hotspot.hotspot_id === hotspot_id) ||
      BINHLONG_HOTSPOTS.find((hotspot) => hotspot.hotspot_id === hotspot_id)
    );
  },

  loadData: async () => {
    // Check if a specific hotspot was requested via URL query or already chosen by user
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const urlHotspotId = urlParams?.get("hotspot_id");
    const urlPanoramaId = urlParams?.get("panorama_id");

    if (!isSupabaseConfigured || !CURRENT_AREA_ID) {
      // Standalone mode: already initialized with Binh Long data
      let activeHotspot = get().currentHotspot;
      if (urlHotspotId) {
        const found = BINHLONG_HOTSPOTS.find((h) => h.hotspot_id === Number(urlHotspotId));
        if (found) activeHotspot = found;
      } else if (urlPanoramaId) {
        const foundPana = BINHLONG_PANORAMAS.find((p) => p.panorama_id === urlPanoramaId);
        if (foundPana) {
          const found = BINHLONG_HOTSPOTS.find((h) => h.hotspot_id === foundPana.hotspot_id);
          if (found) activeHotspot = found;
        }
      }

      const activePanas = activeHotspot
        ? BINHLONG_PANORAMAS.filter((p) => p.hotspot_id === activeHotspot!.hotspot_id)
        : defaultMainPanoramas;

      const activePana =
        (urlPanoramaId && activePanas.find((p) => p.panorama_id === urlPanoramaId)) ||
        (activeHotspot?.click_panorama_id && activePanas.find((p) => p.panorama_id === activeHotspot!.click_panorama_id)) ||
        activePanas[0] ||
        defaultMainPanorama;

      set({
        currentArea: BINHLONG_AREA,
        areaHotspots: BINHLONG_HOTSPOTS,
        currentHotspot: activeHotspot || defaultMainHotspot,
        panoramas: activePanas.length > 0 ? activePanas : defaultMainPanoramas,
        currentPanorama: activePana,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true });
    try {
      const currentArea = await getAreaDetailById(CURRENT_AREA_ID);
      const rawAreaHotspots = await getHotspotsByAreaId(CURRENT_AREA_ID);
      const areaHotspots = rawAreaHotspots.map((ah) => {
        const local = BINHLONG_HOTSPOTS.find((lh) => lh.hotspot_id === ah.hotspot_id);
        if (!local) return ah;
        return {
          ...ah,
          title: local.title || ah.title,
          description: local.description || ah.description,
          click_panorama_id: local.click_panorama_id || ah.click_panorama_id,
          metadata: { ...ah.metadata, ...local.metadata },
          assets: local.assets || ah.assets,
        };
      });

      let currentHotspot = get().currentHotspot;
      if (urlHotspotId) {
        const found = areaHotspots.find((h) => h.hotspot_id === Number(urlHotspotId));
        if (found) currentHotspot = found;
      } else if (urlPanoramaId) {
        const foundPana = BINHLONG_PANORAMAS.find((p) => p.panorama_id === urlPanoramaId);
        if (foundPana) {
          const found = areaHotspots.find((h) => h.hotspot_id === foundPana.hotspot_id);
          if (found) currentHotspot = found;
        }
      }

      if (!currentHotspot || (!urlHotspotId && !urlPanoramaId && currentHotspot.hotspot_id === defaultMainHotspot.hotspot_id)) {
        const mainId = currentArea.main_hotspot_id
          ? Number(currentArea.main_hotspot_id)
          : 132;
        currentHotspot =
          areaHotspots.find((hotspot) => hotspot.hotspot_id === mainId) ||
          areaHotspots[0] ||
          defaultMainHotspot;
      }

      const safeHotspot = currentHotspot || defaultMainHotspot;
      const hotspotPanoramas = await getPanoramasByHotspotId(
        safeHotspot.hotspot_id
      );
      const panoramas =
        hotspotPanoramas.length > 0 ? hotspotPanoramas : defaultMainPanoramas;
      const currentPanorama =
        (urlPanoramaId && panoramas.find((p) => p.panorama_id === urlPanoramaId)) ||
        panoramas.find(
          (p) => p.panorama_id === safeHotspot.click_panorama_id
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
      const updates: Partial<VRStoreState> = { currentPanorama };
      // If panorama belongs to another hotspot, keep currentHotspot and panoramas synced
      if (get().currentHotspot?.hotspot_id !== currentPanorama.hotspot_id) {
        const hotspot = get().getHotspotById(currentPanorama.hotspot_id);
        if (hotspot) {
          updates.currentHotspot = hotspot;
          const relatedPanas = BINHLONG_PANORAMAS.filter(
            (p) => p.hotspot_id === hotspot.hotspot_id
          );
          if (relatedPanas.length > 0) {
            updates.panoramas = relatedPanas;
          }
        }
      }
      set(updates);
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

        const updates: Partial<VRStoreState> = {
          panoramas,
          isLoadingPanoramas: false,
        };

        // Only set default panorama if currentPanorama does not belong to this hotspot
        const activePanorama = get().currentPanorama;
        const belongsToHotspot =
          activePanorama &&
          panoramas.some((p) => p.panorama_id === activePanorama.panorama_id);

        if (!belongsToHotspot) {
          const defaultPanorama =
            panoramas.find(
              (p) => p.panorama_id === hotspot.click_panorama_id
            ) ||
            panoramas.find((p) => p.panorama_id === "M3000_0_FLYCAM_1") ||
            panoramas[0];
          if (defaultPanorama) {
            updates.currentPanorama = defaultPanorama;
          }
        }

        set(updates);
      } else {
        set({ isLoadingPanoramas: false });
      }
    } catch {
      set({ isLoadingPanoramas: false, panoramas: BINHLONG_PANORAMAS });
    }
  },
}));

export default useVRStore;
