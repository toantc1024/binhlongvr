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
                zoom: 16,
                pitch: 65,
                bearing: -24,
                speed: 1.2,
                curve: 1.4,
                easing: (t) => t
            });
        }
    };

    const center: [number, number] = import.meta.env.VITE_CENTER_GPS 
        ? import.meta.env.VITE_CENTER_GPS.split(",").map(Number) 
        : [106.6042, 11.6483];
    const zoom = 14.8;

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
            pitch: 62,
            bearing: -24,
            maxPitch: 85,
            attributionControl: false,
        });

        // Add standard navigation controls
        mapRef.current.addControl(
            new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
            "top-right"
        );

        mapRef.current.on("load", async () => {
            try {
                // Enable 3D Buildings from Goong composite vector tiles
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
                element.className = "cursor-pointer select-none group";
                element.innerHTML = `
                    <div class="flex flex-col items-center transition-transform duration-200 ease-out origin-bottom group-hover:scale-110">
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

                element.addEventListener('click', (e) => {
                    e.stopPropagation();
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
