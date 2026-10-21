"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

import { mapToken } from "./env";
import { Team, teams } from "@/mock-data/teams";
import Marker from "./marker";
import SiteMarker from "./site-marker";
import { RouteInfoCard } from "./route-info-card";
import { usePathname } from "next/navigation";
import type { MapMouseEvent } from "mapbox-gl";
import { useUiStore } from "@/store/offload-form-trigger-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, Map, Satellite } from "lucide-react";
// import * from "../../../public/images/const-site-aligned.png"
mapboxgl.accessToken = mapToken.mapbox.accessToken;

// Coordinates of the site marker — update to match your SiteMarker props
const SITE_COORDS: [number, number] = [23.146389309987672, 63.83318837748356];
const ROUTE_SOURCE_ID = "module-route";
const ROUTE_LAYER_ID = "module-route-line";

type LngLat = [number, number];
type ImageCorners = [LngLat, LngLat, LngLat, LngLat];

const INITIAL_IMAGE_CORNERS: ImageCorners = [
    [
        23.150767864585703,
        63.83372427215869
    ],
    [
        23.141907222054897,
        63.83451161053216
    ],
    [
        23.141947766074935,
        63.83233643949737
    ],
    [
        23.148589037421317,
        63.83175897310815
    ],
    // [
    //     23.150767864585703,
    //     63.83372427215869
    // ]

]

interface MapboxComponentProps {
    selectedStore: Team | null
    setSelectedStore: (store: Team | null) => void
}

interface RouteInfo {
    distanceMeters: number
    durationSeconds: number
}

const MapboxComponent = ({ selectedStore, setSelectedStore }: MapboxComponentProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [zoom] = useState(10);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [routeGeometry, setRouteGeometry] =
  useState<GeoJSON.LineString | null>(null);
    const pathname = usePathname();
    const isDashboard = pathname.endsWith('/dashboard');
    const isOffload = pathname.endsWith("/module-offload");
    const isLogistics = pathname.endsWith("/module-logistics");

    const [roundedArea, setRoundedArea] = useState<Number | null>();
    const [isAreaModelOpen, setIsAreaModalOpen] = useState<String>();
    const [pendingGeometry, setPendingGeometry] = useState<String>();
    const [selectedStyle, setSelectedStyle] = useState<String>("standard-satellite");
    const { openDrawer } = useUiStore.getState()

    // ─── Image overlay state ────────────────────────────────────────────────
    const [imageCorners, setImageCorners] = useState<ImageCorners>(INITIAL_IMAGE_CORNERS);
    const [imageAdjustMode, setImageAdjustMode] = useState(false);
    const [imageOpacity, setImageOpacity] = useState(0.85);

    // Ref mirror of imageCorners — drag handlers read/write this so they
    // never operate on a stale closure snapshot from when the marker was created.
    const imageCornersRef = useRef<ImageCorners>(INITIAL_IMAGE_CORNERS);

    const cornerMarkersRef = useRef<mapboxgl.Marker[]>([]);
    const centerMarkerRef = useRef<mapboxgl.Marker | null>(null);

    // Keep the ref in sync with state (covers any state updates that
    // don't flow through applyImageCorners).
    useEffect(() => {
        imageCornersRef.current = imageCorners;
    }, [imageCorners]);

    const applyImageCorners = useCallback((corners: ImageCorners) => {
        imageCornersRef.current = corners;
        setImageCorners(corners);
        const source = map.current?.getSource('radar') as mapboxgl.ImageSource | undefined;
        source?.setCoordinates(corners);
    }, []);

    const getCentroid = useCallback((corners: ImageCorners): LngLat => {
        const [sumLng, sumLat] = corners.reduce(
            (acc, [lng, lat]) => [acc[0] + lng, acc[1] + lat],
            [0, 0]
        );
        return [sumLng / corners.length, sumLat / corners.length];
    }, []);

    const scaleImage = useCallback((factor: number) => {
        const current = imageCornersRef.current;
        const centroid = getCentroid(current);
        const scaled = current.map(([lng, lat]) => [
            centroid[0] + (lng - centroid[0]) * factor,
            centroid[1] + (lat - centroid[1]) * factor,
        ]) as ImageCorners;
        applyImageCorners(scaled);
        // Reposition the handles to match, if they're currently on screen
        cornerMarkersRef.current.forEach((m, i) => m.setLngLat(scaled[i]));
        centerMarkerRef.current?.setLngLat(getCentroid(scaled));
    }, [getCentroid, applyImageCorners]);

    // ─── Map init ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!mapContainerRef.current) return;

        map.current = new mapboxgl.Map({
            accessToken: mapToken.mapbox.accessToken,
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard-satellite",

            center: [23.146389309987672, 63.83318837748356],

            zoom: isOffload ? 16 : 8,
        });

        map.current.on("load", () => {
            // Add the route source if it doesn't exist
            if (!map.current!.getSource(ROUTE_SOURCE_ID)) {
                map.current!.addSource(ROUTE_SOURCE_ID, {
                    type: "geojson",
                    data: { type: "FeatureCollection", features: [] },
                });
            }

            // GUARD: Check if the layer exists before adding it
            if (!map.current!.getLayer(ROUTE_LAYER_ID)) {
                map.current!.addLayer({
                    id: ROUTE_LAYER_ID,
                    type: "line",
                    source: ROUTE_SOURCE_ID,
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#2563EB",
                        "line-width": 4,
                        "line-opacity": 0.85,
                    },
                });
            }

            setMapLoaded(true);
            map.current?.resize();
        });
        let resizeTimeout: NodeJS.Timeout;
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => map.current?.resize(), 100);
        });
        resizeObserver.observe(mapContainerRef.current);

        return () => {
            clearTimeout(resizeTimeout);
            resizeObserver.disconnect();
            map.current?.remove();
        };
    }, [zoom, isOffload]);

    const handleStyleChange = (styleId: string) => {
        setSelectedStyle(styleId);
        map.current?.setStyle(`mapbox://styles/mapbox/${styleId}`);
    };

    // ─── Fly to selected module ───────────────────────────────────────────────
    useEffect(() => {
        if (!selectedStore) return;
        map.current?.flyTo({
            center: [
                selectedStore.geometry.coordinates[0],
                selectedStore.geometry.coordinates[1],
            ],
            zoom: 7,
            duration: 1000,
        });
    }, [selectedStore]);

    // ─── Fetch and draw route ─────────────────────────────────────────────────
    useEffect(() => {
        if (!map.current || !mapLoaded) return;

        const source = map.current.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
        if (!source) return;

        // Clear the route when nothing is selected
        if (!selectedStore) {
            source.setData({ type: "FeatureCollection", features: [] });
            return;
        }

        const [modLng, modLat] = selectedStore.geometry.coordinates;
        const [siteLng, siteLat] = SITE_COORDS;

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${modLng},${modLat};${siteLng},${siteLat}?geometries=geojson&overview=full&max_height=3.6&max_width=5.9&max_weight=3.5&exclude=ferry%2Cunpaved&access_token=${mapToken.mapbox.accessToken}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (!data.routes?.length) return;
                console.log(data);

              const geometry = data.routes[0].geometry;
const route = data.routes[0];

setRouteGeometry(geometry);

source.setData({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry,
    },
  ],
});

                setRouteInfo({
                    distanceMeters: route.distance,
                    durationSeconds: route.duration,
                });
            })
            .catch((err) => console.error("Route fetch failed:", err));
    }, [selectedStore, mapLoaded]);


    // ─── Draw shapes on map ─────────────────────────────────────────────────
    useEffect(() => {
        if (!isOffload) return;
        const draw = new MapboxDraw({

            displayControlsDefault: true,
            controls: {
                polygon: true,
                combine_features: true,
                uncombine_features: true,
                line_string: true,
                trash: true,
            },
            defaultMode: "simple_select",
        });

        map.current?.addControl(draw);

        map.current?.on("draw.create", (e: any) => {
            setTimeout(() => {
                const feature = e.features[0];
                console.log(feature)
                setPendingGeometry(feature);
                if (feature.geometry.type !== "Polygon") return;
                openDrawer()
            }, 500)

        });

        map.current?.on("draw.delete", (e: any) => {
            setTimeout(() => {
                const feature = e.features[0];
                console.log(feature)
            }, 500)
        });

        map.current?.on("draw.selectionchange", (e: any) => {
            setTimeout(() => {
                const feature = e.features[0];
                console.log("Selected", feature)
            }, 500)
        });

    }, [isOffload])

    // ─── Image overlay setup helper ──────────────────────────────────────────
    const setupImageSource = useCallback(() => {
        if (!map.current) return;
        if (map.current.getSource('radar')) return;

        map.current.addSource('radar', {
            type: 'image',
            url: '/images/gem-site-edited.png',
            coordinates: imageCornersRef.current,
        });

        // 1. Find the first layer generated by MapboxDraw (if it exists)
        const style = map.current.getStyle();
        const firstDrawLayer = style?.layers?.find((layer) =>
            layer.id.startsWith('gl-draw-')
        );

        // 2. Add the layer BEFORE Mapbox Draw layers (or before route layer as fallback)
        const beforeLayerId = firstDrawLayer ? firstDrawLayer.id : ROUTE_LAYER_ID;

        if (!map.current.getLayer('radar-layer')) {
            map.current.addLayer(
                {
                    id: 'radar-layer',
                    type: 'raster',
                    source: 'radar',
                    paint: {
                        'raster-fade-duration': 0,
                        'raster-emissive-strength': 1,
                        'raster-opacity': imageOpacity,
                    },
                },
                beforeLayerId // <--- Crucial second parameter to place layer underneath
            );
        }
    }, [imageOpacity]);

    // ─── Image overlay: create the source/layer once ───────────────────────
    useEffect(() => {
        if (!isOffload || !map.current) return;

        if (map.current.isStyleLoaded()) {
            setupImageSource();
        } else {
            map.current.on('load', setupImageSource);
        }
    }, [isOffload, setupImageSource]);

    
    // ─── Update image opacity when slider changes ──────────────────────────
    useEffect(() => {
        if (!map.current || !isOffload) return;
        if (map.current.getLayer('radar-layer')) {
            map.current.setPaintProperty('radar-layer', 'raster-opacity', imageOpacity);
        }
    }, [imageOpacity, isOffload]);


    // ─── Image overlay: draggable corner + center handles ──────────────────
    useEffect(() => {
        if (!map.current || !isOffload) return;

        // Clean up any existing handles first
        cornerMarkersRef.current.forEach((m) => m.remove());
        cornerMarkersRef.current = [];
        centerMarkerRef.current?.remove();
        centerMarkerRef.current = null;

        if (!imageAdjustMode) return;

        const cornerLabels = ["TL", "TR", "BR", "BL"];
        const startingCorners = imageCornersRef.current;

        startingCorners.forEach((corner, i) => {
            const el = document.createElement("div");
            el.style.width = "14px";
            el.style.height = "14px";
            el.style.borderRadius = "50%";
            el.style.background = "#2563EB";
            el.style.border = "2px solid white";
            el.style.cursor = "grab";
            el.title = cornerLabels[i];

            const marker = new mapboxgl.Marker({ element: el, draggable: true })
                .setLngLat(corner)
                .addTo(map.current!);

            marker.on("drag", () => {
                const { lng, lat } = marker.getLngLat();
                // Always read the LATEST corners from the ref, not the
                // `startingCorners` snapshot captured when this effect ran —
                // otherwise dragging one handle overwrites edits made by another.
                const next = [...imageCornersRef.current] as ImageCorners;
                next[i] = [lng, lat];
                applyImageCorners(next);
                centerMarkerRef.current?.setLngLat(getCentroid(next));
            });

            cornerMarkersRef.current.push(marker);
        });

        // Center marker — drag to translate the whole image
        const centerEl = document.createElement("div");
        centerEl.style.width = "18px";
        centerEl.style.height = "18px";
        centerEl.style.borderRadius = "4px";
        centerEl.style.background = "#F59E0B";
        centerEl.style.border = "2px solid white";
        centerEl.style.cursor = "move";
        centerEl.title = "Move image";

        const centerMarker = new mapboxgl.Marker({ element: centerEl, draggable: true })
            .setLngLat(getCentroid(startingCorners))
            .addTo(map.current);

        let dragStartCenter: LngLat = getCentroid(imageCornersRef.current);
        let cornersAtDragStart: ImageCorners = imageCornersRef.current;

        centerMarker.on("dragstart", () => {
            dragStartCenter = getCentroid(imageCornersRef.current);
            cornersAtDragStart = imageCornersRef.current;
        });

        centerMarker.on("drag", () => {
            const { lng, lat } = centerMarker.getLngLat();
            const deltaLng = lng - dragStartCenter[0];
            const deltaLat = lat - dragStartCenter[1];
            const next = cornersAtDragStart.map(([cLng, cLat]) => [
                cLng + deltaLng,
                cLat + deltaLat,
            ]) as ImageCorners;
            applyImageCorners(next);
            cornerMarkersRef.current.forEach((m, idx) => m.setLngLat(next[idx]));
        });

        centerMarkerRef.current = centerMarker;

        return () => {
            cornerMarkersRef.current.forEach((m) => m.remove());
            centerMarkerRef.current?.remove();
        };
    }, [imageAdjustMode, applyImageCorners, getCentroid]);

    return (
        <div className="w-full h-full overflow-hidden relative">
            <div id="map" className="h-full w-full text-black " ref={mapContainerRef} />

          


            {routeInfo && !isOffload && !isDashboard && selectedStore && (
                <div className="absolute bottom-20 right-4 w-[25em] z-10">
                    <RouteInfoCard
                        distanceMeters={routeInfo.distanceMeters}
                        durationSeconds={routeInfo.durationSeconds}
                        moduleName={selectedStore.name}
                    />
                </div>
            )}

            {mapLoaded && (
                <SiteMarker
                    lat={23.146389309987672}
                    long={63.83318837748356}
                    map={map.current!}
                />
            )}

            {mapLoaded && !isOffload && !isDashboard && teams.map((location) => (
                <Marker
                    key={location.name}
                    feature={location}
                    map={map.current!}
                    setSelectedStore={setSelectedStore}
                    selectedStore={selectedStore}
                />
            ))}

            {isOffload && (
                <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                    <button
                        onClick={() => setImageAdjustMode((v) => !v)}
                        className={`rounded px-3 py-2 text-sm font-medium border ${imageAdjustMode ? "bg-black text-white" : "bg-white text-black"
                            }`}
                    >
                        {imageAdjustMode ? "Done adjusting" : "Adjust Drone Capture"}
                    </button>

                    {imageAdjustMode && (
                        <div className="flex gap-1">
                            <button
                                onClick={() => scaleImage(1.05)}
                                className="rounded px-3 py-2 text-sm border bg-background"
                            >
                                Resize +
                            </button>
                            <button
                                onClick={() => scaleImage(0.95)}
                                className="rounded px-3 py-2 text-sm border bg-background"
                            >
                                Resize −
                            </button>
                        </div>
                    )}

                    {/* ─── Opacity slider ─────────────────────────────── */}
                    <div className="flex flex-col gap-1 bg-background border rounded p-2">
                        <Label htmlFor="image-opacity" className="text-xs font-medium">
                            Overlay Opacity: {Math.round(imageOpacity * 100)}%
                        </Label>
                        <input
                            id="image-opacity"
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={imageOpacity}
                            onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
                            className="w-32 accent-foreground"
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default MapboxComponent;