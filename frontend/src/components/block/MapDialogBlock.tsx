// components/MapDialogBlock.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useVRStore from "@/store/vr.store";
import { Search } from "lucide-react";
import MapItemDrawerBlock from "./MapItemDrawerBlock";
import { FiLogOut } from "react-icons/fi";
import type { Hotspot } from "@/types/hotspots.service.type";

export default function MapDialogBlock({
    opened,
    setOpened,
    showMedia
}: {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    showMedia: (mediaName: string) => void;
}) {
    const onMarkerSelectHandler = (hotspot: any) => {
        if (hotspot.geolocation?.lon && hotspot.geolocation?.lat) {
            // Set selected hotspot for highlighting
            setSelectedHotspotId(hotspot.hotspot_id);
            setSelectedMarker(hotspot);

            // Fly to the hotspot location
            mapRef.current?.flyTo({
                center: [hotspot.geolocation.lon, hotspot.geolocation.lat],
                zoom: 12,
                speed: 1.2,
                curve: 1,
                easing: (t) => t
            });

            // Close search popover
            setIsSearchOpen(false);
            setSearchValue("");
        }
    };

    const center: [number, number] = import.meta.env.VITE_CENTER_GPS ? import.meta.env.VITE_CENTER_GPS.split(",").map(Number) : [106.6042, 11.6483];
    const zoom = 12;

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const hotspotMarkersRef = useRef<maplibregl.Marker[]>([]);

    const { areaHotspots } = useVRStore((state) => state);

    useEffect(() => {
        if (!opened) {
            setSelectedMarker(null);
            setSelectedHotspotId(null);
        }
    }, [opened])

    const [searchValue, setSearchValue] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedHotspotId, setSelectedHotspotId] = useState<number | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    // Filter hotspots based on search value
    const filteredHotspots = useMemo(() => {
        if (!searchValue.trim()) return [];

        return areaHotspots.filter(hotspot =>
            hotspot.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
            hotspot.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
            hotspot.address?.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [areaHotspots, searchValue]);

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
            pitch: 0,
            attributionControl: false,
        });

        // Add standard navigation controls
        mapRef.current.addControl(
            new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
            "top-right"
        );

        mapRef.current.on("load", async () => {
            try {
                let response = await fetch("./map.geojson");
                let geojson = await response.json();

                if (geojson.features) {
                    geojson.features = geojson.features.map(
                        (f: any, idx: number) => ({
                            ...f,
                            id: f.id ?? idx, // assign ID if missing
                        })
                    );
                }
                mapRef.current!.addSource("custom-geojson", {
                    type: "geojson",
                    data: geojson,
                });

                mapRef.current!.addLayer({
                    id: "custom-geojson-fill",
                    type: "fill",
                    source: "custom-geojson",
                    paint: {
                        "fill-color": [
                            "case",
                            ["boolean", ["feature-state", "hover"], false],
                            "#059669",
                            "#10b981",
                        ],
                        "fill-opacity": [
                            "case",
                            ["boolean", ["feature-state", "hover"], false],
                            0.2,
                            0.08,
                        ],
                    },
                });

                mapRef.current!.addLayer({
                    id: "custom-geojson-stroke",
                    type: "line",
                    source: "custom-geojson",
                    paint: {
                        "line-color": "#059669",
                        "line-width": 2.5,
                        "line-opacity": 0.8,
                    },
                });
            } catch (err) {
                console.error("Error loading geojson:", err);
            }
            let hoveredId: string | number | null = null;

            mapRef.current!.on("mousemove", "custom-geojson-fill", (e) => {
                if (e.features?.length) {
                    const featureId = e.features[0].id;

                    if (featureId !== undefined) {
                        if (hoveredId !== null && hoveredId !== featureId) {
                            mapRef.current!.setFeatureState(
                                { source: "custom-geojson", id: hoveredId },
                                { hover: false }
                            );
                        }

                        hoveredId = featureId;
                        mapRef.current!.setFeatureState(
                            { source: "custom-geojson", id: hoveredId },
                            { hover: true }
                        );
                    }
                }
            });

            mapRef.current!.on("mouseleave", "custom-geojson-fill", () => {
                if (hoveredId !== null) {
                    mapRef.current!.setFeatureState(
                        { source: "custom-geojson", id: hoveredId },
                        { hover: false }
                    );
                }
                hoveredId = null;
            });
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            markerRef.current = null;
            hotspotMarkersRef.current.forEach((marker) => marker.remove());
            hotspotMarkersRef.current = [];
        };
    }, []);

    useEffect(() => {
        if (!mapContainer.current || !mapRef.current) return;

        // Clear existing hotspot markers
        hotspotMarkersRef.current.forEach((marker) => marker.remove());
        hotspotMarkersRef.current = [];

        // Add new hotspot markers
        areaHotspots.forEach((hotspot) => {
            if (hotspot.geolocation?.lon && hotspot.geolocation?.lat) {
                const isSelected = selectedHotspotId === hotspot.hotspot_id;

                let element = document.createElement("div");
                element.className = "marker-container";
                element.innerHTML = `
                <div class="map-marker shadow-xl cursor-pointer ${isSelected ? 'ring-[3px] border-[0px] ring-primary border-primary border-none ring-opacity-60 selected' : ''}">
                    <div class="map-marker-circle ">
                        <div class="map-marker-image">
                            <img src="${hotspot.preview_image}" alt="place" />
                        </div>
                    </div>
                </div>
                <div class="marker-label">
                    <span class="marker-title ${isSelected ? 'font-bold text-primary' : ''}">${hotspot.title}</span>
                </div>
            `;

                // Add click handler to the marker element
                element.addEventListener('click', () => {
                    onMarkerSelectHandler(hotspot);
                });

                let marker = new maplibregl.Marker({
                    element: element,
                    anchor: "bottom",
                })

                marker.setLngLat([hotspot.geolocation.lon, hotspot.geolocation.lat])
                    .addTo(mapRef.current!);
                hotspotMarkersRef.current.push(marker);
            }
        });
    }, [areaHotspots, selectedHotspotId]);





    return (
        <div
            className={`${opened ? "visible" : "hidden"
                } fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center backdrop-blur-sm z-[999]`}
        >

            <MapItemDrawerBlock closeDrawer={() => { setOpened(false) }} setCurrentHotspot={(hotspot: Hotspot | null) => {
                setSelectedMarker(hotspot);
                setSelectedHotspotId(hotspot?.hotspot_id ?? null);
            }} currentHotspot={selectedMarker}
                showMedia={showMedia}

            />


            <div className="h-screen w-full relative">
                {/* Search Input with Popover Results */}
                <div className="absolute w-full px-4 md:px-8 flex items-start justify-between top-12 md:top-4 left-1/2 -translate-x-1/2 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>

                    <div className="flex-1 md:flex md:justify-center relative mr-4">
                        <div className="bg-white/95 backdrop-blur-xl shadow-lg border border-border rounded-full w-full md:w-72 flex items-center px-4 py-3">
                            <Search className="w-5 h-5 text-primary mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm địa điểm..."
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
                                onBlur={() => {
                                    // Close popover when clicking outside, but with a delay to allow clicks on results
                                    setTimeout(() => setIsSearchOpen(false), 150);
                                }}
                            />
                        </div>

                        {/* Search Results - positioned absolutely */}
                        {isSearchOpen && searchValue.trim() !== "" && (
                            <div className="absolute top-full mt-2 w-full md:w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border z-50 max-h-64 overflow-y-auto">
                                {filteredHotspots.length > 0 ? (
                                    <div className="space-y-1 p-2">
                                        {filteredHotspots.map((hotspot) => (
                                            <button
                                                key={hotspot.hotspot_id}
                                                onMouseDown={(e) => {
                                                    // Prevent input from losing focus
                                                    e.preventDefault();
                                                    onMarkerSelectHandler(hotspot);
                                                }}
                                                className="w-full text-left p-3 rounded-lg hover:bg-secondary/70 transition-colors"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    {hotspot.preview_image && (
                                                        <img
                                                            src={hotspot.preview_image}
                                                            alt={hotspot.title || ''}
                                                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm text-foreground truncate">
                                                            {hotspot.title}
                                                        </h4>
                                                        {hotspot.address && (
                                                            <p className="text-xs text-muted-foreground truncate mt-1">
                                                                {hotspot.address}
                                                            </p>
                                                        )}
                                                        {hotspot.description && (
                                                            <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1">
                                                                {hotspot.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        Không tìm thấy địa điểm nào
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setOpened(false)}
                            className="p-3 bg-white/95 hover:bg-secondary text-foreground backdrop-blur-xl rounded-full shadow-lg transition-colors cursor-pointer border border-border z-20 flex items-center justify-center"
                            aria-label="Đóng bản đồ"
                        >
                            <FiLogOut className="w-5 h-5 text-foreground" />
                        </button>
                    </div>
                </div>

                <div ref={mapContainer} className="w-full h-full" />
            </div>
        </div >
    );
}
