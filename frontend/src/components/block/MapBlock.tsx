"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useVRStore from "@/store/vr.store";
import { cn } from "@/lib/utils";

export default function MapBlock({
    opened,
    className,
}: {
    opened: boolean;
    setOpened?: (opened: boolean) => void;
    showMedia?: (mediaName: string) => void;
    className?: string;
}) {
    const onMarkerSelectHandler = (hotspot: any) => {
        if (hotspot.geolocation?.lon && hotspot.geolocation?.lat) {
            setSelectedHotspotId(hotspot.hotspot_id);
            mapRef.current?.flyTo({
                center: [hotspot.geolocation.lon, hotspot.geolocation.lat],
                zoom: 14,
                speed: 1.2,
                curve: 1,
                easing: (t) => t
            });
        }
    };

    const center: [number, number] = import.meta.env.VITE_CENTER_GPS 
        ? import.meta.env.VITE_CENTER_GPS.split(",").map(Number) 
        : [106.6042, 11.6483];
    const zoom = 12.8;

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const hotspotMarkersRef = useRef<maplibregl.Marker[]>([]);

    const { areaHotspots } = useVRStore((state) => state);

    useEffect(() => {
        if (!opened) {
            setSelectedHotspotId(null);
        }
    }, [opened]);

    const [selectedHotspotId, setSelectedHotspotId] = useState<number | null>(null);

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
                const response = await fetch("./map.geojson");
                const geojson = await response.json();

                if (geojson.features) {
                    geojson.features = geojson.features.map((f: any, idx: number) => ({
                        ...f,
                        id: f.id ?? idx,
                    }));
                }

                if (!mapRef.current?.getSource("custom-geojson")) {
                    mapRef.current?.addSource("custom-geojson", {
                        type: "geojson",
                        data: geojson,
                    });

                    // Subtle boundary fill for Binh Long
                    mapRef.current?.addLayer({
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

                    // Boundary border line
                    mapRef.current?.addLayer({
                        id: "custom-geojson-stroke",
                        type: "line",
                        source: "custom-geojson",
                        paint: {
                            "line-color": "#059669",
                            "line-width": 2.5,
                            "line-opacity": 0.8,
                        },
                    });
                }

                let hoveredId: string | number | null = null;

                mapRef.current?.on("mousemove", "custom-geojson-fill", (e) => {
                    if (e.features?.length) {
                        const featureId = e.features[0].id;
                        if (featureId !== undefined) {
                            if (hoveredId !== null && hoveredId !== featureId) {
                                mapRef.current?.setFeatureState(
                                    { source: "custom-geojson", id: hoveredId },
                                    { hover: false }
                                );
                            }
                            hoveredId = featureId;
                            mapRef.current?.setFeatureState(
                                { source: "custom-geojson", id: hoveredId },
                                { hover: true }
                            );
                        }
                    }
                });

                mapRef.current?.on("mouseleave", "custom-geojson-fill", () => {
                    if (hoveredId !== null) {
                        mapRef.current?.setFeatureState(
                            { source: "custom-geojson", id: hoveredId },
                            { hover: false }
                        );
                    }
                    hoveredId = null;
                });
            } catch (err) {
                console.error("Error loading GeoJSON boundary:", err);
            }
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
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

                const element = document.createElement("div");
                element.className = "marker-container cursor-pointer";
                element.innerHTML = `
                <div class="map-marker shadow-xl cursor-pointer ${isSelected ? 'ring-3 ring-emerald-500 selected' : ''}">
                    <div class="map-marker-circle">
                        <div class="map-marker-image">
                            <img src="${hotspot.preview_image}" alt="${hotspot.title}" />
                        </div>
                    </div>
                </div>
                <div class="marker-label">
                    <span class="marker-title ${isSelected ? 'font-bold text-emerald-700' : ''}">${hotspot.title}</span>
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

    useEffect(() => {
        if (!mapContainer.current) return;
        const resizeObserver = new ResizeObserver(() => {
            mapRef.current?.resize();
        });
        resizeObserver.observe(mapContainer.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className={cn("h-full w-full relative overflow-hidden", className)}>
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}
