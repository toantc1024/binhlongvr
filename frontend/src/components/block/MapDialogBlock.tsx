// components/MapDialogBlock.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useVRStore from "@/store/vr.store";
import {
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Compass,
    Volume2,
    VolumeX,
    ArrowRight,
    Copy,
    Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Hotspot } from "@/types/hotspots.service.type";
import type { Panorama } from "@/types/panoramas.service.type";
import { BINHLONG_PANORAMAS, BINHLONG_HOTSPOTS } from "@/constants/binhlong.constants";

export default function MapDialogBlock({
    opened,
    setOpened,
    showMedia,
    initialHotspotId,
}: {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    showMedia: (mediaName: string, hotspotId?: number) => void;
    initialHotspotId?: number | null;
}) {
    const center: [number, number] = import.meta.env.VITE_CENTER_GPS
        ? import.meta.env.VITE_CENTER_GPS.split(",").map(Number)
        : [106.6042, 11.6483];
    const zoom = 14.8;

    // Giới hạn bản đồ chỉ cho phép trong khung Phường Bình Long, không cho zoom out quá mức
    const BINH_LONG_BOUNDS: [[number, number], [number, number]] = [
        [106.5600, 11.6100], // Tây Nam [lng, lat]
        [106.6500, 11.6900], // Đông Bắc [lng, lat]
    ];

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const hotspotMarkersRef = useRef<maplibregl.Marker[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { areaHotspots, mapDialogHotspotId } = useVRStore((state) => state);

    const [searchValue, setSearchValue] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedHotspotId, setSelectedHotspotId] = useState<number | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<Hotspot | null>(null);
    const [activePanoramaIndex, setActivePanoramaIndex] = useState<number>(0);
    const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
    const [copiedCoords, setCopiedCoords] = useState(false);

    // Panoramas for currently selected hotspot
    const selectedPanoramas: Panorama[] = useMemo(() => {
        if (!selectedMarker) return [];
        const found = BINHLONG_PANORAMAS.filter(
            (p) => p.hotspot_id === selectedMarker.hotspot_id
        );
        if (found.length > 0) return found;
        return [
            {
                panorama_id: selectedMarker.click_panorama_id || "preview",
                hotspot_id: selectedMarker.hotspot_id,
                title: selectedMarker.title || "Toàn cảnh di tích",
                preview_image: selectedMarker.preview_image || "",
                created_at: new Date().toISOString(),
            },
        ];
    }, [selectedMarker]);

    const activePanorama: Panorama | undefined =
        selectedPanoramas[activePanoramaIndex] || selectedPanoramas[0];

    // Reset carousel index and audio when hotspot changes
    useEffect(() => {
        setActivePanoramaIndex(0);
        setIsPlayingAudio(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [selectedMarker?.hotspot_id]);

    // Handle marker / place selection
    const onMarkerSelectHandler = (hotspot: Hotspot) => {
        setSelectedHotspotId(hotspot.hotspot_id);
        setSelectedMarker(hotspot);

        if (hotspot.geolocation?.lon && hotspot.geolocation?.lat) {
            mapRef.current?.flyTo({
                center: [hotspot.geolocation.lon, hotspot.geolocation.lat],
                zoom: 16.2,
                pitch: 65,
                bearing: -24,
                speed: 1.2,
                curve: 1.4,
                easing: (t) => t,
            });
        }

        setIsSearchOpen(false);
    };

    // Filter hotspots based on search value
    const filteredHotspots = useMemo(() => {
        if (!searchValue.trim()) return [];

        const searchLower = searchValue.toLowerCase().trim();
        return areaHotspots.filter(
            (hotspot) =>
                hotspot.title?.toLowerCase().includes(searchLower) ||
                hotspot.description?.toLowerCase().includes(searchLower) ||
                hotspot.address?.toLowerCase().includes(searchLower)
        );
    }, [areaHotspots, searchValue]);

    useEffect(() => {
        if (!opened) {
            setSelectedMarker(null);
            setSelectedHotspotId(null);
            setIsPlayingAudio(false);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        } else {
            setTimeout(() => {
                mapRef.current?.resize();
            }, 100);

            const activeId = initialHotspotId ?? mapDialogHotspotId;
            if (activeId) {
                const hotspotsSource = areaHotspots && areaHotspots.length > 0 ? areaHotspots : BINHLONG_HOTSPOTS;
                const target = hotspotsSource.find((h) => Number(h.hotspot_id) === Number(activeId));
                if (target) {
                    setSelectedHotspotId(target.hotspot_id);
                    setSelectedMarker(target);
                    setIsSearchOpen(false);
                    setSearchValue("");

                    const flyToHotspot = () => {
                        if (mapRef.current && target.geolocation?.lon && target.geolocation?.lat) {
                            mapRef.current.flyTo({
                                center: [target.geolocation.lon, target.geolocation.lat],
                                zoom: 16.2,
                                pitch: 65,
                                bearing: -24,
                                speed: 1.2,
                                curve: 1.4,
                                easing: (t) => t,
                            });
                        }
                    };

                    if (mapRef.current?.isStyleLoaded()) {
                        setTimeout(flyToHotspot, 150);
                    } else if (mapRef.current) {
                        mapRef.current.once("load", flyToHotspot);
                        setTimeout(flyToHotspot, 350);
                    } else {
                        setTimeout(flyToHotspot, 400);
                    }
                }
            }
        }
    }, [opened, initialHotspotId, mapDialogHotspotId, areaHotspots]);

    // Init map only once
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const goongMapKey = import.meta.env.VITE_GOONG_MAP_KEY || "hkBRTOlzhKDE79Z6WGwQCgI9MTgsGXyUNC7jS8i3";
        const goongStyleUrl = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${goongMapKey}`;

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            style: goongStyleUrl,
            center,
            zoom,
            minZoom: 13.5,
            maxZoom: 20,
            maxBounds: BINH_LONG_BOUNDS,
            pitch: 62,
            bearing: -24,
            maxPitch: 85,
            attributionControl: false,
        });

        mapRef.current.addControl(
            new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
            "bottom-right"
        );

        mapRef.current.on("load", async () => {
            try {
                if (mapRef.current?.getSource("composite")) {
                    if (mapRef.current.getLayer("building")) {
                        mapRef.current.setLayerZoomRange("building", 13.5, 22);
                        mapRef.current.setPaintProperty("building", "fill-extrusion-opacity", 0.85);
                        mapRef.current.setPaintProperty("building", "fill-extrusion-vertical-gradient", true);
                    }
                }
            } catch (err) {
                console.error("Error setting up 3D map:", err);
            }
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            hotspotMarkersRef.current.forEach((marker) => marker.remove());
            hotspotMarkersRef.current = [];
        };
    }, []);

    // Update markers on map
    useEffect(() => {
        if (!mapContainer.current || !mapRef.current) return;

        hotspotMarkersRef.current.forEach((marker) => marker.remove());
        hotspotMarkersRef.current = [];

        areaHotspots.forEach((hotspot) => {
            if (hotspot.geolocation?.lon && hotspot.geolocation?.lat) {
                const isSelected = selectedHotspotId === hotspot.hotspot_id;

                const element = document.createElement("div");
                element.className = "cursor-pointer select-none group/pin";
                element.innerHTML = `
                    <div class="flex flex-col items-center transition-transform duration-200 ease-out origin-bottom group-hover/pin:scale-110">
                        <div class="relative w-12 h-12 rounded-full p-[2px] bg-white shadow-xl ${isSelected ? 'ring-4 ring-emerald-500 ring-offset-2' : 'ring-2 ring-emerald-600/50'} transition-all duration-300">
                            <div class="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                <img src="${hotspot.preview_image}" alt="${hotspot.title}" class="w-full h-full object-cover object-center pointer-events-none" onerror="this.src='/landmarks/mo_3000_nguoi.jpg'" />
                            </div>
                        </div>
                        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white -mt-[1px] drop-shadow-md"></div>
                        <div class="mt-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 text-[11px] font-semibold text-slate-800 whitespace-nowrap pointer-events-none max-w-[140px] truncate text-center ${isSelected ? '!border-emerald-500 !text-emerald-700 !font-bold' : ''}">
                            ${hotspot.title}
                        </div>
                    </div>
                `;

                element.addEventListener('click', () => {
                    onMarkerSelectHandler(hotspot);
                });

                const marker = new maplibregl.Marker({
                    element: element,
                    anchor: "bottom",
                });

                marker.setLngLat([hotspot.geolocation.lon, hotspot.geolocation.lat])
                    .addTo(mapRef.current!);
                hotspotMarkersRef.current.push(marker);
            }
        });
    }, [areaHotspots, selectedHotspotId]);

    // Audio toggle
    const toggleAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlayingAudio) {
            audioRef.current.pause();
            setIsPlayingAudio(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlayingAudio(true);
            }).catch(() => {
                setIsPlayingAudio(false);
            });
        }
    };

    // Copy Coordinates
    const copyCoordinates = () => {
        if (!selectedMarker?.geolocation) return;
        const coords = `${selectedMarker.geolocation.lat}, ${selectedMarker.geolocation.lon}`;
        navigator.clipboard.writeText(coords);
        setCopiedCoords(true);
        toast.success("Đã sao chép tọa độ GPS!");
        setTimeout(() => setCopiedCoords(false), 2000);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActivePanoramaIndex((prev) =>
            prev === 0 ? selectedPanoramas.length - 1 : prev - 1
        );
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActivePanoramaIndex((prev) =>
            prev === selectedPanoramas.length - 1 ? 0 : prev + 1
        );
    };

    const audioUrl = (selectedMarker?.metadata as any)?.audio_url;

    return (
        <div
            className={`${opened ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                } fixed inset-0 transition-opacity duration-200 z-[999] bg-black/40 backdrop-blur-xs`}
        >
            {/* Audio element for narration */}
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlayingAudio(false)}
                    onError={() => setIsPlayingAudio(false)}
                />
            )}

            <div className="h-full w-full relative overflow-hidden">
                {/* Top Bar with Full-Width Search & Minimize Button */}
                <div
                    className="absolute w-full px-3 sm:px-6 md:px-8 flex items-start justify-between gap-3 top-3 md:top-4 left-0 z-40"
                    style={{ paddingTop: 'env(safe-area-inset-top)' }}
                >
                    {/* Full Width Search Container */}
                    <div className="flex-1 max-w-xl relative">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-border/80 rounded-2xl w-full flex items-center px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-emerald-500">
                            <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm di tích, địa danh tại Phường Bình Long..."
                                className="flex-1 outline-none text-foreground placeholder:text-muted-foreground bg-transparent text-sm font-medium"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setIsSearchOpen(e.target.value.trim() !== "");
                                }}
                                onFocus={() => {
                                    if (searchValue.trim() !== "") {
                                        setIsSearchOpen(true);
                                    }
                                }}
                            />
                            {searchValue && (
                                <button
                                    onClick={() => {
                                        setSearchValue("");
                                        setIsSearchOpen(false);
                                    }}
                                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground cursor-pointer"
                                    title="Xóa tìm kiếm"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearchOpen && searchValue.trim() !== "" && (
                            <div className="absolute top-full mt-2 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border z-50 max-h-80 overflow-y-auto divide-y divide-border/60">
                                {filteredHotspots.length > 0 ? (
                                    <div className="p-2 space-y-1">
                                        {filteredHotspots.map((hotspot) => (
                                            <button
                                                key={hotspot.hotspot_id}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    onMarkerSelectHandler(hotspot);
                                                }}
                                                className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-start gap-3 group cursor-pointer"
                                            >
                                                {hotspot.preview_image && (
                                                    <img
                                                        src={hotspot.preview_image}
                                                        alt={hotspot.title || ''}
                                                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-border group-hover:border-emerald-500 transition-colors"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm text-foreground group-hover:text-emerald-600 transition-colors truncate">
                                                        {hotspot.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                        {hotspot.address || 'Phường Bình Long, TP. Đồng Nai'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/80 line-clamp-1 mt-1">
                                                        {hotspot.description}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        Không tìm thấy địa điểm nào khớp với "{searchValue}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Close / Minimize Button on top right */}
                    <button
                        onClick={() => setOpened(false)}
                        className="w-11 h-11 sm:w-12 sm:h-12 bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground backdrop-blur-xl rounded-full shadow-xl transition-all cursor-pointer border border-border flex items-center justify-center shrink-0 group active:scale-95"
                        title="Đóng bản đồ"
                        aria-label="Đóng bản đồ"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Google Maps Style Left Info Panel */}
                {selectedMarker && (
                    <div className="absolute top-20 md:top-20 left-3 sm:left-6 z-30 w-[calc(100vw-1.5rem)] sm:w-[420px] md:w-[440px] max-h-[calc(100vh-6rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Carousel Hero Photo */}
                        <div className="relative w-full h-52 sm:h-56 bg-slate-950 overflow-hidden shrink-0 group">
                            <img
                                src={activePanorama?.preview_image || selectedMarker.preview_image || undefined}
                                alt={activePanorama?.title || selectedMarker.title || ""}
                                className="w-full h-full object-cover transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                            {/* 360 VR Badge */}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none">
                                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                                <span>360° VR</span>
                            </div>

                            {/* Photo Index Badge */}
                            {selectedPanoramas.length > 0 && (
                                <div className="absolute top-3 right-14 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md pointer-events-none">
                                    {activePanoramaIndex + 1} / {selectedPanoramas.length}
                                </div>
                            )}

                            {/* Close Panel Button */}
                            <button
                                onClick={() => {
                                    setSelectedMarker(null);
                                    setSelectedHotspotId(null);
                                }}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer active:scale-95"
                                title="Đóng thông tin"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {/* Chevrons for Carousel navigation */}
                            {selectedPanoramas.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                        title="Ảnh trước"
                                    >
                                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                        title="Ảnh tiếp theo"
                                    >
                                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                                    </button>
                                </>
                            )}

                            {/* Current Panorama Title overlay */}
                            <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-medium truncate drop-shadow-md bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                                {activePanorama?.title || selectedMarker.title}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {selectedPanoramas.length > 1 && (
                            <div className="flex gap-2 px-3 py-2 overflow-x-auto bg-slate-50 dark:bg-slate-900/60 border-b border-border/60 scrollbar-none shrink-0">
                                {selectedPanoramas.map((p, idx) => (
                                    <button
                                        key={p.panorama_id}
                                        onClick={() => setActivePanoramaIndex(idx)}
                                        className={cn(
                                            "relative shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                                            idx === activePanoramaIndex
                                                ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105"
                                                : "border-transparent opacity-70 hover:opacity-100"
                                        )}
                                        title={p.title}
                                    >
                                        <img
                                            src={p.preview_image}
                                            alt={p.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Scrollable Information Body */}
                        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
                            <div>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-1.5 whitespace-nowrap">
                                    Phường Bình Long, TP.&nbsp;Đồng&nbsp;Nai
                                </span>
                                <h3 className="font-bold text-lg text-foreground leading-snug">
                                    {selectedMarker.title}
                                </h3>
                            </div>

                            {/* Address & GPS */}
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{selectedMarker.address || "Phường Bình Long, Thành phố Đồng Nai"}</span>
                                </div>
                                {selectedMarker.geolocation && (
                                    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-border/60">
                                        <span className="font-mono text-[11px]">
                                            GPS: {selectedMarker.geolocation.lat.toFixed(5)}, {selectedMarker.geolocation.lon.toFixed(5)}
                                        </span>
                                        <button
                                            onClick={copyCoordinates}
                                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
                                        >
                                            {copiedCoords ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Đã chép</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>Sao chép</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Audio Narration Player */}
                            {audioUrl && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                            {isPlayingAudio ? (
                                                <Volume2 className="w-4 h-4 animate-pulse" />
                                            ) : (
                                                <VolumeX className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">Thuyết minh âm thanh</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {isPlayingAudio ? "Đang phát giọng đọc..." : "Bấm để nghe thuyết minh"}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={toggleAudio}
                                        className={cn(
                                            "rounded-lg text-xs font-semibold px-3 h-8 cursor-pointer",
                                            isPlayingAudio
                                                ? "bg-amber-600 hover:bg-amber-700 text-white"
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                        )}
                                    >
                                        {isPlayingAudio ? "Tạm dừng" : "Lắng nghe"}
                                    </Button>
                                </div>
                            )}

                            {/* Historical Description */}
                            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                                {selectedMarker.description}
                            </p>
                        </div>

                        {/* Action Button: Full-Width Solid Emerald */}
                        <div className="p-3 sm:p-4 bg-white/90 dark:bg-slate-900/90 border-t border-border shrink-0">
                            <Button
                                onClick={() => {
                                    if (audioRef.current) {
                                        audioRef.current.pause();
                                        audioRef.current.currentTime = 0;
                                    }
                                    setIsPlayingAudio(false);
                                    showMedia(
                                        activePanorama?.panorama_id || selectedMarker.click_panorama_id || "",
                                        selectedMarker.hotspot_id
                                    );
                                    setOpened(false);
                                }}
                                className="w-full h-11 sm:h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                            >
                                <span>Khám phá không gian VR 360°</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* MapLibre Canvas Container */}
                <div ref={mapContainer} className="w-full h-full" />
            </div>
        </div>
    );
}
